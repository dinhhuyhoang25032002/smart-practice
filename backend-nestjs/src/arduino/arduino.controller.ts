// import {
//     Controller,
//     Post,
//     Get,
//     Body,
//     Param,
//     UsePipes,
//     ValidationPipe,
//     Res,
//     ParseEnumPipe,
//     Delete,
//   } from '@nestjs/common';
//   import { Response } from 'express';
//   import { ArduinoService } from './arduino.service';
//   import { CompileCodeDto } from './class/CompileCodeDto.dto';
//   import * as path from 'path';
  
//   @Controller('arduino')
//   export class ArduinoController {
//     constructor(private readonly arduinoService: ArduinoService) {}
  
//     /**
//      * Test route
//      */
//     @Get('test')
//     async test() {
//       return {
//         message: 'Arduino controller is working!',
//         timestamp: new Date().toISOString()
//       };
//     }

//     /**
//      * API 1: Lấy danh sách board được hỗ trợ
//      */
//     @Get('boards')
//     async getSupportedBoards() {
//       return {
//         success: true,
//         boards: this.arduinoService.getSupportedBoards()
//       };
//     }

//     /**
//      * API 2: Endpoint để tạo một build mới
//      */
//     @Post('builds')
//     // @UsePipes(new ValidationPipe())
//     async createNewBuild(@Body() compileCodeDto: CompileCodeDto) {
//       return this.arduinoService.createBuild(compileCodeDto);
//     }

//     /**
//      * API 3: Lấy thông tin build
//      */
//     @Get('builds/:buildId')
//     async getBuildInfo(@Param('buildId') buildId: string) {
//       return {
//         success: true,
//         build: await this.arduinoService.getBuildInfo(buildId)
//       };
//     }
  
//     /**
//      * API 4: Endpoint để tải file từ một build đã có
//      * :fileType phải là 'hex' hoặc 'bin'
//      */
//     @Get('builds/:buildId/:fileType')
//     async downloadBuildFile(
//       @Param('buildId') buildId: string,
//       @Param('fileType', new ParseEnumPipe(['hex', 'bin'])) fileType: 'hex' | 'bin',
//       @Res({ passthrough: true }) res: Response,
//     ) {
//       const { stream, filePath } = await this.arduinoService.getBuildFile(
//         buildId,
//         fileType,
//       );
      
//       const fileName = path.basename(filePath);
  
//       res.set({
//         'Content-Type': 'application/octet-stream', 
//         'Content-Disposition': `attachment; filename="${fileName}"`,
//       });
  
//       return stream;
//     }
//   }