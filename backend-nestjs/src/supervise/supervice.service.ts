import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Supervice, SUPERVICE_MODEL } from "src/schema/supervise.schema";
import { Model } from "mongoose"
import { SoftDeleteModel } from "mongoose-delete";
import { SuperviceDto } from "./class/Supervice.dto";
import { Lesson, LESSON_MODEL } from "src/schema/lesson.schema";
import { TIMEVIEW_MODEL, TimeView } from "src/schema/timeview.schema";
import { COURSE_MODEL, Course } from "src/schema/course.schema";
@Injectable()
export class SuperviceService {
    constructor(
        @InjectModel(SUPERVICE_MODEL)
        private readonly superviceModel: Model<Supervice> & SoftDeleteModel<Supervice>,
        @InjectModel(LESSON_MODEL)
        private readonly lessonModel: Model<Lesson> & SoftDeleteModel<Lesson>,
        @InjectModel(TIMEVIEW_MODEL)
        private readonly timeViewModel: Model<TimeView> & SoftDeleteModel<TimeView>,
        @InjectModel(COURSE_MODEL)
        private readonly courseModel: Model<Course> & SoftDeleteModel<Course>,
    ) { }

    async hanldeCreateAndUpdateSupervice(data: SuperviceDto) {
        const { lessonId, sectionId, studentId } = data
        const lesson = await this.lessonModel.findById(lessonId).lean().exec();
        if (!lesson) {
            return new BadRequestException('Không tồn tại khóa học')
        }
        const timeview = await this.timeViewModel.find({
            lessonId,
            userId: studentId,
            sectionId,
            isEnd: true
        })

        const supervice = await this.superviceModel.findOne({
            lessonId, sectionId, studentId
        }).exec();

        const newSupervice = {
            studentId,
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
            lessonId, sectionId, studentId,
            view: timeview.length,
            durationView: durationView
        })

    }

    async handleGetTimeDurationACourse(studentId: string, courseId: string) {
        const course = await this.courseModel.findById(courseId).lean().exec();
        if (!course) {
            return new BadRequestException();
        }
        const lessons = course.lessons
        const supervice = await this.superviceModel.find({
            studentId,
            lessonId: { $in: lessons }
        }).lean().exec()

        if (supervice.length === 0) {
            return { duration: supervice.length }
        }

        const duration = supervice.reduce((result, item) => {
            return result + item.durationView
        }, 0)

        return {
            duration
        }
    }
}