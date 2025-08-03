import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from 'src/uploads/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import { UserJWT } from 'src/types/CustomType';
import { UserRole } from 'src/constant/constant';
import { ImageUploadsDto } from 'src/uploads/class/Uploads.dto';
import { join } from 'path';
import { ResultDto } from 'src/result/class/Result.dto';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { SubmitTaskDto } from 'src/steam/class/steam.dto';
@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImageUploadsDto })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    // const { role } = req.user as UserJWT;
    // if (role !== UserRole.TEACHER) {
    //     return new ForbiddenException();
    // }

    return this.uploadsService.handleUploadImage(file);
  }

  @Post('result')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async createResultLesson(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() body: ResultDto,
  ) {
    const { sub, role } = req.user as UserJWT;
    const { _id, name } = body;

    if (!_id || !sub) {
      return new BadRequestException('Thiếu tham số quan trọng!');
    }

    if (role !== UserRole.STUDENT) {
      const filePath = join('./upload', file.filename);
      console.log(filePath);
      if (existsSync(filePath)) {
        try {
          await unlink(filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      return new ForbiddenException('Quyền hạn không hợp lệ!');
    }

    const data = {
      sub,
      _id,
      name,
    };

    return this.uploadsService.handleCreateResultLesson(data, file);
  }

  @Post('task')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async createTaskLesson(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() body: SubmitTaskDto,
  ) {
    const { sub, role } = req.user as UserJWT;
    console.log(req.body);
    return this.uploadsService.handleSubmitTask(body, file);
  }
}
