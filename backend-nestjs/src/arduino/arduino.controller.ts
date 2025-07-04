import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UsePipes,
    ValidationPipe,
    Res,
    ParseEnumPipe,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { ArduinoService } from './arduino.service';
  import { CompileCodeDto } from './class/CompileCodeDto.dto';
  import * as path from 'path';
  
  @Controller('arduino')
  export class ArduinoController {
    constructor(private readonly arduinoService: ArduinoService) {}
  
    /**
     * API 1: Endpoint để tạo một build mới
     */
    @Post('builds')
    @UsePipes(new ValidationPipe())
    async createNewBuild(@Body() compileCodeDto: CompileCodeDto) {
      return this.arduinoService.createBuild(compileCodeDto);
    }
  
    /**
     * API 2: Endpoint để tải file từ một build đã có
     * :fileType phải là 'hex' hoặc 'bin'
     */
    @Get('builds/:buildId/:fileType')
    async downloadBuildFile(
      @Param('buildId') buildId: string,
      @Param('fileType', new ParseEnumPipe(['hex', 'bin'])) fileType: 'hex' | 'bin',
      @Res({ passthrough: true }) res: Response,
    ) {
      const { stream, filePath } = await this.arduinoService.getBuildFile(
        buildId,
        fileType,
      );
      
      const fileName = path.basename(filePath); // Lấy tên file từ đường dẫn
  
      res.set({
        // Dùng kiểu 'application/octet-stream' cho các file nhị phân nói chung
        'Content-Type': 'application/octet-stream', 
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });
  
      return stream;
    }
  }