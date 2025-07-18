import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CompileCodeDto } from './class/CompileCodeDto.dto';
import { SerialPort } from 'serialport';

@Injectable()
export class ArduinoService {
  // Mở rộng danh sách board hỗ trợ
  private readonly ALLOWED_BOARDS = {
    'arduino:avr:uno': {
      name: 'Arduino Uno',
      baudRate: 115200,
      protocol: 'STK500v1',
      hexExtension: 'hex'
    },
    'arduino:avr:mega': {
      name: 'Arduino Mega',
      baudRate: 115200,
      protocol: 'STK500v1',
      hexExtension: 'hex'
    },
    'esp8266:esp8266:nodemcuv2': {
      name: 'ESP8266 NodeMCU',
      baudRate: 115200,
      protocol: 'ESP8266',
      hexExtension: 'bin'
    },
    'esp32:esp32:esp32': {
      name: 'ESP32',
      baudRate: 921600,
      protocol: 'ESP32',
      hexExtension: 'bin'
    }
  };
  
  private readonly BUILDS_DIR = path.join(process.cwd(), 'builds');
  
  // Serial Monitor connections
  private serialConnections: Map<string, SerialPort> = new Map();
  private serialData: Map<string, string[]> = new Map();
  
  constructor() {
    // Đảm bảo thư mục builds tồn tại khi service khởi động
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    try {
      await fs.mkdir(this.BUILDS_DIR, { recursive: true });
      await fs.mkdir(path.join(process.cwd(), 'temp'), { recursive: true });
    } catch (error) {
      console.warn('Không thể tạo thư mục:', error);
    }
  }

  async createBuild(body: CompileCodeDto) {
    const { code, board } = body;
    console.log('[LOG] [createBuild] Nhận request build:', { board });
    // Kiểm tra board có được hỗ trợ không
    if (!this.ALLOWED_BOARDS[board]) {
      console.log('[LOG] [createBuild] Board không hỗ trợ:', board);
      throw new BadRequestException(`Board '${board}' is not supported. Supported boards: ${Object.keys(this.ALLOWED_BOARDS).join(', ')}`);
    }

    const buildId = uuidv4();
    const sketchFolderName = `sketch_${buildId}`;
    const sketchFolderPath = path.join(process.cwd(), 'temp', sketchFolderName);
    const sketchFilePath = path.join(sketchFolderPath, `${sketchFolderName}.ino`);
    const arduinoCli = path.join(process.cwd(), 'bin', 'arduino-cli');
    const outputDir = path.join(this.BUILDS_DIR, buildId);

    try {
      console.log('[LOG] [createBuild] Tạo thư mục:', sketchFolderPath, outputDir);
      await fs.mkdir(sketchFolderPath, { recursive: true });
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(sketchFilePath, code);
      console.log('[LOG] [createBuild] Đã ghi file code:', sketchFilePath);

      // Xây dựng lệnh arduino-cli
      const command = `${arduinoCli} compile --fqbn ${board} --output-dir ${outputDir} ${sketchFolderPath}`;
      console.log('[LOG] [createBuild] Lệnh compile:', command);

      const result = await this.executeCommand(command);

      // Log stdout và stderr để debug
      console.log('=== Arduino CLI STDOUT ===');
      console.log(result.stdout);
      console.log('=== Arduino CLI STDERR ===');
      console.log(result.stderr);

      // Lấy thông tin board
      const boardInfo = this.ALLOWED_BOARDS[board];
      // Tìm file output - Arduino CLI tạo ra file với tên sketch_xxx.ino.hex
      const files = await fs.readdir(outputDir);
      console.log('[LOG] [createBuild] files in outputDir:', files);
      const mainFileName = `sketch_${buildId}.ino.${boardInfo.hexExtension}`;
      let hexFile = files.find(f => f === mainFileName);
      if (!hexFile) {
        hexFile = files.find(f => f.endsWith(`.${boardInfo.hexExtension}`));
      }
      console.log('[LOG] [createBuild] hexFile found:', hexFile);
      if (!hexFile) {
        console.log(`[LOG] [createBuild] Không tìm thấy file .${boardInfo.hexExtension} sau khi biên dịch.`);
        throw new Error(`Không tìm thấy file .${boardInfo.hexExtension} sau khi biên dịch.\nFiles in output dir: ${files.join(', ')}\nSTDOUT: ${result.stdout}\nSTDERR: ${result.stderr}`);
      }
      // Lấy kích thước file
      const hexFilePath = path.join(outputDir, hexFile);
      const stats = await fs.stat(hexFilePath);
      const fileSize = stats.size;
      console.log('[LOG] [createBuild] hexFilePath:', hexFilePath);
      console.log('[LOG] [createBuild] Kích thước file output:', fileSize);
      try {
        const fileContent = await fs.readFile(hexFilePath, { encoding: 'utf8' });
        console.log('[LOG] [createBuild] 100 ký tự đầu file:', fileContent.slice(0, 100));
      } catch (e) {
        console.warn('[LOG] [createBuild] Không đọc được nội dung file output:', e);
      }

      return {
        success: true,
        message: 'Compilation successful!',
        buildId: buildId,
        boardInfo: {
          name: boardInfo.name,
          fqbn: board,
          baudRate: boardInfo.baudRate,
          protocol: boardInfo.protocol,
          hexExtension: boardInfo.hexExtension
        },
        fileInfo: {
          fileName: hexFile,
          fileSize: fileSize,
          downloadUrl: `/api/arduino/builds/${buildId}/${boardInfo.hexExtension}`
        },
        output: result.stdout,
      };
    } catch (error) {
      console.error('[LOG] [createBuild] Lỗi:', error.message, error.stack);
      throw new BadRequestException({
        success: false,
        message: 'Compilation failed.',
        error: error.message,
      });
    } finally {
      // Dọn dẹp thư mục tạm
      try {
        await fs.rm(sketchFolderPath, { recursive: true, force: true });
        console.log('[LOG] [createBuild] Đã xóa thư mục tạm:', sketchFolderPath);
      } catch (e) {
        console.warn('[LOG] [createBuild] Không thể xóa thư mục tạm:', e);
      }
    }
  }

  // Lấy danh sách board được hỗ trợ
  getSupportedBoards() {
    return Object.entries(this.ALLOWED_BOARDS).map(([fqbn, info]) => ({
      fqbn,
      name: info.name,
      baudRate: info.baudRate,
      protocol: info.protocol
    }));
  }

  // Lấy thông tin build
  async getBuildInfo(buildId: string) {
    console.log('[LOG] [getBuildInfo] buildId:', buildId);
    if (!/^[a-fA-F0-9-]{36}$/.test(buildId)) {
      console.log('[LOG] [getBuildInfo] Invalid Build ID format:', buildId);
      throw new BadRequestException('Invalid Build ID format.');
    }

    const buildDir = path.join(this.BUILDS_DIR, buildId);
    console.log('[LOG] [getBuildInfo] buildDir:', buildDir);
    try {
      await fs.access(buildDir);
      const files = await fs.readdir(buildDir);
      console.log('[LOG] [getBuildInfo] files in buildDir:', files);
      // Ưu tiên file hex chính
      let file = files.find(f => f === `sketch_${buildId}.ino.hex`);
      if (file) {
        console.log('[LOG] [getBuildInfo] Chọn file hex chính:', file);
      }
      // Nếu không có, lấy file with_bootloader.hex
      if (!file) {
        file = files.find(f => f.endsWith('.hex') && f.includes('with_bootloader'));
        if (file) console.log('[LOG] [getBuildInfo] Chọn file with_bootloader.hex:', file);
      }
      // Nếu vẫn không có, lấy file .bin
      if (!file) {
        file = files.find(f => f.endsWith('.bin'));
        if (file) console.log('[LOG] [getBuildInfo] Chọn file .bin:', file);
      }
      if (!file) {
        console.log('[LOG] [getBuildInfo] Không tìm thấy file hex/bin cho buildId:', buildId);
        throw new NotFoundException('Không tìm thấy file firmware');
      }
      const filePath = path.join(buildDir, file);
      const stats = await fs.stat(filePath);
      const fileExtension = path.extname(file).substring(1);
      const boardInfo = Object.entries(this.ALLOWED_BOARDS).find(([_, info]) => info.hexExtension === fileExtension);
      console.log('[LOG] [getBuildInfo] Trả về file:', file, 'downloadUrl:', `/api/arduino/builds/${buildId}/${fileExtension}`);
      return {
        buildId,
        fileName: file,
        fileSize: stats.size,
        fileExtension,
        boardInfo: boardInfo ? {
          fqbn: boardInfo[0],
          ...boardInfo[1]
        } : null,
        createdAt: stats.birthtime,
        downloadUrl: `/api/arduino/builds/${buildId}/${fileExtension}`
      };
    } catch (error) {
      console.error('[LOG] [getBuildInfo] Lỗi:', error.message, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new NotFoundException(`Build ID '${buildId}' not found.`);
    }
  }

  private executeCommand(
    command: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        // Avrdude có thể trả về exit code 0 (thành công) nhưng vẫn có output ở stderr
        // Chúng ta cần kiểm tra cả stdout và stderr để xác định kết quả
        console.log('[LOG] executeCommand - error:', error);
        console.log('[LOG] executeCommand - stdout:', stdout);
        console.log('[LOG] executeCommand - stderr:', stderr);
        
        // Nếu có lỗi thực sự (exit code khác 0)
        if (error) {
          console.log('[LOG] executeCommand - có lỗi thực sự:', error.message);
          return reject(new Error(stderr || error.message));
        }
        
        // Nếu không có lỗi, trả về cả stdout và stderr
        resolve({ stdout, stderr });
      });
    });
  }

  async getBuildFile(
    buildId: string,
    fileType: 'hex' | 'bin',
  ): Promise<{ stream: StreamableFile; filePath: string }> {
    console.log(`[LOG] [getBuildFile] buildId: ${buildId}, fileType: ${fileType}`);
    if (!/^[a-fA-F0-9-]{36}$/.test(buildId)) {
      console.log('[LOG] [getBuildFile] Invalid Build ID format:', buildId);
      throw new BadRequestException('Invalid Build ID format.');
    }

    const buildDir = path.join(this.BUILDS_DIR, buildId);
    console.log('[LOG] [getBuildFile] buildDir:', buildDir);
    try {
      const files = await fs.readdir(buildDir);
      console.log('[LOG] [getBuildFile] files in buildDir:', files);
      // Ưu tiên file hex chính
      let hexFile = files.find(f => f === `sketch_${buildId}.ino.${fileType}`);
      if (hexFile) {
        console.log('[LOG] [getBuildFile] Chọn file hex chính:', hexFile);
      }
      // Nếu không có, lấy file with_bootloader.hex
      if (!hexFile && fileType === 'hex') {
        hexFile = files.find(f => f.endsWith('.hex') && f.includes('with_bootloader'));
        if (hexFile) console.log('[LOG] [getBuildFile] Chọn file with_bootloader.hex:', hexFile);
      }
      // Nếu vẫn không có, lấy file .bin
      if (!hexFile && fileType === 'bin') {
        hexFile = files.find(f => f.endsWith('.bin'));
        if (hexFile) console.log('[LOG] [getBuildFile] Chọn file .bin:', hexFile);
      }
      if (!hexFile) {
        console.log(`[LOG] [getBuildFile] Không tìm thấy file .${fileType} cho buildId ${buildId}`);
        throw new NotFoundException(`File .${fileType} not found for build ID '${buildId}'.`);
      }

      const filePath = path.join(buildDir, hexFile);
      console.log('[LOG] [getBuildFile] filePath:', filePath);
      try {
        const stats = await fs.stat(filePath);
        console.log('[LOG] [getBuildFile] Kích thước file:', stats.size);
      } catch (e) {
        console.warn('[LOG] [getBuildFile] Không lấy được thông tin file:', e);
      }
      const fileStream = fsSync.createReadStream(filePath);
      return {
        stream: new StreamableFile(fileStream),
        filePath: filePath,
      };
    } catch (error) {
      console.error('[LOG] [getBuildFile] Lỗi:', error.message, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new NotFoundException(`Build ID '${buildId}' not found.`);
    }
  }
}