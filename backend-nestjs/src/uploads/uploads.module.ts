import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import slugify from 'slugify';
import { UpdateMode } from 'src/constant/constant';


@Module({
  imports: [
    MulterModule.registerAsync(
      {
        useFactory: () => ({
          storage: diskStorage({
            destination: (req, file, cb) => {
              // Lấy tên khóa học từ request body
              const { name, mode } = req.body;

              if (!name) {
                return cb(new Error('Course name is required'), null);
              }
              // Tạo tên thư mục an toàn từ tên khóa học
              const safeFolderName = slugify(name, { locale: "vi", lower: true });
              let uploadPath = ``;
              if (mode === UpdateMode.COURSE) {
                uploadPath = `./khoa-hoc/${safeFolderName}`
              } else if (mode === UpdateMode.LESSON) {
                uploadPath = `./bai-hoc/${safeFolderName}`
              } else {
                uploadPath = `./tai-len/${safeFolderName}`
              }

              if (file.mimetype.startsWith('image/')) {
                uploadPath += '/images';
              } else if (file.mimetype.startsWith('video/')) {
                uploadPath += '/videos';
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
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
              'video/quicktime'
            ];

            if (!allowedMimeTypes.includes(file.mimetype)) {
              return cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WEBP) and videos (MP4, WebM, OGG, MOV) are allowed!'), false);
            }

            // Validate file size based on type
            const maxSize = file.mimetype.startsWith('image/')
              ? 5 * 1024 * 1024  // 5MB for images
              : 500 * 1024 * 1024; // 500MB for videos

            if (file.size > maxSize) {
              return cb(new Error(`File size exceeds limit. Max size for ${file.mimetype.startsWith('image/') ? 'images' : 'videos'} is ${maxSize / (1024 * 1024)}MB`), false);
            }

            cb(null, true);
          },
        })
      }
    ),
  ],
  controllers: [UploadsController],
  providers: [UploadsService]
})
export class UpdatesModule { }
