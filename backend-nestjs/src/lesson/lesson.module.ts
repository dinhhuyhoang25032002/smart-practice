import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonController } from 'src/lesson/lesson.controller';
import { LessonService } from 'src/lesson/lesson.service';
import { LESSON_MODEL, LessonSchema } from 'src/schema/lesson.schema';
import { STARTTIME_MODEL, StartTimeSchema } from 'src/schema/starttime.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: LESSON_MODEL,
                schema: LessonSchema,
            },
            {
                name: STARTTIME_MODEL,
                schema:StartTimeSchema
            }
        ])
    ],
    controllers: [LessonController],
    providers: [LessonService],
})
export class LessonModule { }
