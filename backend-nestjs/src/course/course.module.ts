import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CourseController } from 'src/course/course.controller';
import { CourseService } from 'src/course/course.service';
import { COURSE_MODEL, CourseSchema } from 'src/schema/course.schema';
import { DEADLINE_MODEL, DeadlineSchema } from 'src/schema/deadline.schema';
import { EVALUATE_MODEL, EvaluateSchema } from 'src/schema/evaluate.schema';
import { STARTTIME_MODEL, StartTimeSchema } from 'src/schema/starttime.schema';
import { USER_MODEL, UserSchema } from 'src/schema/user.schema';
import { existsSync, mkdirSync } from 'fs';
import slugify from 'slugify';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    // Lấy tên khóa học từ request body
                    const courseName = req.body.name;
                    if (!courseName) {
                        return cb(new Error('Course name is required'), null);
                    }

                    // Tạo tên thư mục an toàn từ tên khóa học
                    const safeFolderName = slugify(courseName, { locale: "vi", lower: true });

                    // Tạo đường dẫn đầy đủ dựa trên loại file
                    let uploadPath = `./courses/${safeFolderName}`;

                    // Tạo thư mục con dựa trên loại file
                    if (file.mimetype.startsWith('image/')) {
                        uploadPath += '/images';
                    } else if (file.mimetype.startsWith('video/')) {
                        uploadPath += '/videos';
                    }

                    // Tạo thư mục nếu chưa tồn tại
                    if (!existsSync(uploadPath)) {
                        mkdirSync(uploadPath, { recursive: true });
                    }

                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    // Tạo tên file an toàn với timestamp và phần mở rộng
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const safeFileName = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;
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
        }),
        MongooseModule.forFeature([
            {
                name: USER_MODEL,
                schema: UserSchema,
            },
            {
                name: DEADLINE_MODEL,
                schema: DeadlineSchema,
            },
            {
                name: COURSE_MODEL,
                schema: CourseSchema,
            },
            {
                name: EVALUATE_MODEL,
                schema: EvaluateSchema
            },
            {
                name: STARTTIME_MODEL,
                schema: StartTimeSchema
            },
        ])
    ],
    controllers: [CourseController],
    providers: [CourseService],
})
export class CourseModule { }
