import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import slugify from 'slugify';
import { UpdateMode } from 'src/constant/constant';
import { MongooseModule } from '@nestjs/mongoose';
import { RESULT_MODEL, ResultSchema } from 'src/schema/result.schema';
import { STARTTIME_MODEL, StartTimeSchema } from 'src/schema/starttime.schema';
import { TASK_MODEL, TaskSchema } from 'src/schema/task.schema';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            // Lấy tên khóa học từ request body
            const { name, mode } = req.body;
            // Tạo tên thư mục an toàn từ tên khóa học
            const safeFolderName = slugify(name, { locale: 'vi', lower: true });
            let uploadPath = ``;
            if (mode === UpdateMode.COURSE) {
              uploadPath = `./tai-len/khoa-hoc/${safeFolderName}`;
            } else if (mode === UpdateMode.LESSON) {
              uploadPath = `./tai-len/bai-hoc/${safeFolderName}`;
            } else if (mode === UpdateMode.TASK) {
              uploadPath = `./tai-len/du-an-steam/${safeFolderName}`;
            } else if (mode === UpdateMode.RESULT) {
              uploadPath = `./tai-len/ket-qua/${safeFolderName}`;
            }

            if (file.mimetype.startsWith('image/')) {
              uploadPath += '/images';
            } else if (file.mimetype.startsWith('video/')) {
              uploadPath += '/videos';
            } else {
              uploadPath += '/files';
            }
            // Tạo đường dẫn đầy đủ dựa trên loại file

            // Tạo thư mục con dựa trên loại file

            // Tạo thư mục nếu chưa tồn tại
            if (!existsSync(uploadPath)) {
              mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            // Tạo tên file an toàn với timestamp và phần mở rộng
            req.body = {
              ...req.body,
              fileName: file.originalname,
            };
            const { _id } = req.body;
            const uniqueSuffix = Date.now() + '-' + _id;
            const safeFileName = `${uniqueSuffix}${extname(file.originalname)}`;
            cb(null, safeFileName);
          },
        }),
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB cho mỗi file
        },
        fileFilter: (req, file, cb) => {
          // Validate file type
          const allowedMimeTypes = [
            // Images
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            // Videos
            'video/mp4',
            'video/webm',
            'video/ogg',
            'video/quicktime',
            // Files
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
          ];

          if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
              new Error(
                'Invalid file type. Only images (JPEG, PNG, GIF, WEBP) and videos (MP4, WebM, OGG, MOV) and files (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX) are allowed!',
              ),
              false,
            );
          }

          // Validate file size based on type
          const maxSize = file.mimetype.startsWith('image/')
            ? 5 * 1024 * 1024 // 5MB for images
            : 500 * 1024 * 1024; // 500MB for videos

          if (file.size > maxSize) {
            return cb(
              new Error(
                `File size exceeds limit. Max size for ${file.mimetype.startsWith('image/') ? 'images' : 'videos'} is ${maxSize / (1024 * 1024)}MB`,
              ),
              false,
            );
          }

          cb(null, true);
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: STARTTIME_MODEL, schema: StartTimeSchema },
      { name: RESULT_MODEL, schema: ResultSchema },
      { name: TASK_MODEL, schema: TaskSchema },
    ]),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UpdatesModule {}
