import { Module } from '@nestjs/common';
import { TimeviewController } from './timeview.controller';
import { TimeviewService } from './timeview.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TIMEVIEW_MODEL, TimeViewSchema } from 'src/schema/timeview.schema';
import { LessonSchema, LESSON_MODEL } from 'src/schema/lesson.schema';


@Module({

  imports: [
    MongooseModule.forFeature([
      {
        schema: TimeViewSchema,
        name: TIMEVIEW_MODEL
      },
      {
        schema: LessonSchema,
        name: LESSON_MODEL
      },
    ])
  ],
  controllers: [TimeviewController],
  providers: [TimeviewService]
})
export class TimeviewModule { }
