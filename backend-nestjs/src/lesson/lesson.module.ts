import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonController } from 'src/lesson/lesson.controller';
import { LessonService } from 'src/lesson/lesson.service';
import { COURSE_MODEL, CourseSchema } from 'src/schema/course.schema';
import { LESSON_MODEL, LessonSchema } from 'src/schema/lesson.schema';
import { STARTTIME_MODEL, StartTimeSchema } from 'src/schema/starttime.schema';
import { TIMEVIEW_MODEL, TimeViewSchema } from 'src/schema/timeview.schema';
import { USER_MODEL, UserSchema } from 'src/schema/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: LESSON_MODEL,
                schema: LessonSchema,
            },
            {
                name: STARTTIME_MODEL,
                schema: StartTimeSchema
            },
            {
                name: COURSE_MODEL,
                schema: CourseSchema,
            },
            {
                name: TIMEVIEW_MODEL,
                schema: TimeViewSchema,
            },
            {
                name: USER_MODEL,
                schema: UserSchema,
            },
        ])
    ],
    controllers: [LessonController],
    providers: [LessonService],
})
export class LessonModule { }
