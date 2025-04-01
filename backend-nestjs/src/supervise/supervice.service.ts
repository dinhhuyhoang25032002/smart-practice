import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Supervice, SUPERVICE_MODEL } from "src/schema/supervise.schema";
import { Model } from "mongoose"
import { SoftDeleteModel } from "mongoose-delete";
import { SuperviceDto } from "./class/Supervice.dto";
import { Lesson, LESSON_MODEL } from "src/schema/lesson.schema";
import { TIMEVIEW_MODEL, TimeView } from "src/schema/timeview.schema";

@Injectable()
export class SuperviceService {
    constructor(
        @InjectModel(SUPERVICE_MODEL)
        private readonly superviceModel: Model<Supervice> & SoftDeleteModel<Supervice>,
        @InjectModel(LESSON_MODEL)
        private readonly lessonModel: Model<Lesson> & SoftDeleteModel<Lesson>,
        @InjectModel(TIMEVIEW_MODEL)
        private readonly timeViewModel: Model<TimeView> & SoftDeleteModel<TimeView>,
    ) { }

    async hanldeCreateAndUpdateSupervice(data: SuperviceDto) {
        const { lessonId, sectionId } = data
        const lesson = await this.lessonModel.findById(lessonId).lean().exec();
        if (!lesson) {
            return new BadRequestException('Không tồn tại khóa học')
        }
        const timeview = await this.timeViewModel.find({
            lessonId,
            sectionId,
            isEnd: true
        })

        const supervice = await this.superviceModel.findOne({
            lessonId, sectionId
        }).exec();

        const newSupervice = {
            lessonId,
            sectionId,
            durationView: 0,
            views: 0
        }

        if (timeview.length === 0) {
            if (supervice) {
                return supervice
            }
            return this.superviceModel.create(newSupervice)
        }

        const durationView = timeview.reduce((durationViews, current) => {
            const startTime = +current.startTimeView;
            const endTime = +current.endTimeView;
            const duration = Math.round((endTime - startTime) / (60 * 1000))

            return durationViews + duration;

        }, 0)

        if (supervice) {
            supervice.set({
                views: timeview.length,
                durationView
            })
            await supervice.save()
            return supervice
        }

        return this.superviceModel.create({
            lessonId, sectionId,
            view: timeview.length,
            durationView: durationView
        })

    }

}