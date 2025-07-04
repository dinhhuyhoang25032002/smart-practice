import { Module } from '@nestjs/common';
import { DeadlineController } from './deadline.controller';
import { DeadlineService } from './deadline.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DEADLINE_MODEL, DeadlineSchema } from 'src/schema/deadline.schema';
import { COURSE_MODEL, CourseSchema } from 'src/schema/course.schema';
import { USER_MODEL, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DEADLINE_MODEL,
        schema: DeadlineSchema,
      },
      {
        name: COURSE_MODEL,
        schema: CourseSchema,
      },
      {
        name: USER_MODEL,
        schema: UserSchema,
      }
    ]),
  ],
  controllers: [DeadlineController],
  providers: [DeadlineService]
})
export class DeadlineModule { }
