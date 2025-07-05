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

@Injectable()
export class ArduinoService {
  private readonly ALLOWED_BOARDS = ['arduino:avr:uno', 'arduino:avr:mega'];
  private readonly BUILDS_DIR = path.join(process.cwd(), 'builds');
  constructor() {
    // Đảm bảo thư mục builds tồn tại khi service khởi động
    fs.mkdir(this.BUILDS_DIR, { recursive: true });
  }
  async createBuild(body: CompileCodeDto) {
    const { code, board } = body;
    // --- 1. Kiểm tra bảo mật ---
    if (!this.ALLOWED_BOARDS.includes(board)) {
      throw new BadRequestException(`Board '${board}' is not supported.`);
    }

    const sketchId = uuidv4();
    const sketchFolderName = `sketch_${sketchId}`;
    // Tạo một thư mục tạm thời, ví dụ trong /tmp/ trên Linux hoặc thư mục tạm của OS
    const sketchFolderPath = path.join(process.cwd(), 'temp', sketchFolderName);
    const sketchFilePath = path.join(
      sketchFolderPath,
      `${sketchFolderName}.ino`,
    );
    const arduinoCli = path.join(process.cwd(), 'arduino-cli'); // Đường dẫn đến arduino-cli
    console.log(arduinoCli);

    try {
      // --- 2. Tạo thư mục và file .ino ---
      await fs.mkdir(sketchFolderPath, { recursive: true });
      await fs.writeFile(sketchFilePath, code);

      // --- 3. Xây dựng và thực thi lệnh arduino-cli ---
      // Thay 'arduino-cli' bằng đường dẫn tuyệt đối nếu cần
      const command = `${arduinoCli} compile --fqbn ${board} --output-dir ${this.BUILDS_DIR} ${sketchFolderPath}`;

      const result = await this.executeCommand(command);

      // --- 4. Xử lý kết quả ---
      // Nếu thành công, có thể đọc file .hex và gửi về
      // Ví dụ: const hexPath = path.join(sketchFolderPath, 'build', ...);

      return {
        success: true,
        message: 'Compilation successful!',
        output: result.stdout, // stdout của arduino-cli thường chứa log quá trình biên dịch
      };
    } catch (error) {
      // Lỗi biên dịch hoặc lỗi hệ thống
      throw new BadRequestException({
        success: false,
        message: 'Compilation failed.',
        error: error.message, // error.message chứa stderr
      });
    } finally {
      // --- 5. Dọn dẹp thư mục tạm ---
     //await fs.rm(sketchFolderPath, { recursive: true, force: true });
    }
  }
  private executeCommand(
    command: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          // error.message thường đã chứa stderr, nên ta reject nó
          return reject(new Error(stderr || error.message));
        }
        resolve({ stdout, stderr });
      });
    });
  }
  async getBuildFile(
    buildId: string,
    fileType: 'hex' | 'bin',
  ): Promise<{ stream: StreamableFile; filePath: string }> {
    // Regex đơn giản để kiểm tra buildId có giống UUID không, tránh Path Traversal
    if (!/^[a-fA-F0-9-]{36}$/.test(buildId)) {
      throw new BadRequestException('Invalid Build ID format.');
    }

    const fileName = `sketch_${buildId}.ino.${fileType}`;
    const filePath = path.join(this.BUILDS_DIR, buildId, 'output', fileName);

    try {
      await fs.access(filePath); // Kiểm tra file có tồn tại không
      const fileStream = fsSync.createReadStream(filePath);
      return {
        stream: new StreamableFile(fileStream),
        filePath: filePath, // Trả về cả đường dẫn để controller biết tên file
      };
    } catch (error) {
      throw new NotFoundException(
        `File '${fileName}' not found for build ID '${buildId}'.`,
      );
    }
  }
}
