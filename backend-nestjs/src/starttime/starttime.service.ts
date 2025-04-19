import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Model } from 'mongoose';
import { StartTime, STARTTIME_MODEL } from 'src/schema/starttime.schema';
import { LESSON_MODEL, Lesson } from 'src/schema/lesson.schema';
@Injectable()
export class StarttimeService {
    constructor(
        @InjectModel(STARTTIME_MODEL)
        private readonly startTimeModel: Model<StartTime> & SoftDeleteModel<StartTime>,
        @InjectModel(LESSON_MODEL)
        private readonly lessonModel: Model<Lesson> & SoftDeleteModel<Lesson>,
    ) { }

    async handleGetStartTime(userId: string, lessonId: string) {
        const lesson = await this.lessonModel.findById(lessonId)
        // const startTime = await this.startTimeModel.findById()
    }
}
