import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LESSON_MODEL, LessonSchema } from 'src/schema/lesson.schema';
import { STARTTIME_MODEL, StartTimeSchema } from 'src/schema/starttime.schema';
import { StarttimeController } from 'src/starttime/starttime.controller';
import { StarttimeService } from 'src/starttime/starttime.service';

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
            }
        ])
    ],
    controllers: [StarttimeController],
    providers: [StarttimeService],
})
export class StarttimeModule { }
