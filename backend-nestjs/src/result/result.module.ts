import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResultController } from 'src/result/result.controller';
import { ResultService } from 'src/result/result.service';
import { RESULT_MODEL, ResultSchema } from 'src/schema/result.schema';
import { STARTTIME_MODEL, StartTimeSchema } from 'src/schema/starttime.schema';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: './upload', // Thư mục lưu file
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
                },
            }),
            limits: {
                fileSize: 1024 * 1024 * 3,
            },
            fileFilter: (req, file, cb) => {

                const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', "application/pdf"];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type. Only PNG, JPG, and JPEG are allowed!'), false);
                }
            },
        }),
        MongooseModule.forFeature([
            {
                name: RESULT_MODEL,
                schema: ResultSchema,
            },
            {
                name: STARTTIME_MODEL,
                schema: StartTimeSchema
            }
        ])
    ],
    controllers: [ResultController],
    providers: [ResultService],
})
export class ResultModule { }
