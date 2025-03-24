import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from 'src/course/course.controller';
import { CourseService } from 'src/course/course.service';
import { COURSE_MODEL, CourseSchema } from 'src/schema/course.schema';
import { DEADLINE_MODEL, DeadlineSchema } from 'src/schema/deadline.schema';
import { USER_MODEL, UserSchema } from 'src/schema/user.schema';

@Module({
    imports: [
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
        ])
    ],
    controllers: [CourseController],
    providers: [CourseService],
})
export class CourseModule { }
