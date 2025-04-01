import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { LESSON_MODEL, Lesson } from 'src/schema/lesson.schema';
import { Model } from "mongoose"
import { StatusLesson, UserRole } from 'src/constant/constant';
import { STARTTIME_MODEL, StartTime } from 'src/schema/starttime.schema';
import { StartTimeDto } from 'src/starttime/class/StartTime.dto';
import { COURSE_MODEL, Course } from 'src/schema/course.schema';
import { LessonDto } from './class/Lesson.dto';
@Injectable()
export class LessonService {
    constructor(
        @InjectModel(LESSON_MODEL)
        private readonly lessonModel: Model<Lesson> & SoftDeleteModel<Lesson>,
        @InjectModel(STARTTIME_MODEL)
        private readonly startTimeModel: Model<StartTime> & SoftDeleteModel<StartTime>,
        @InjectModel(COURSE_MODEL)
        private readonly courseModel: Model<Course> & SoftDeleteModel<Course>,
    ) { }
    async handleGetLessonById(lessonId: string, userId: string, role: string, seo: boolean) {
        if (seo) {
            return this.lessonModel.findById(lessonId).select('name');
        }

        if (role === UserRole.TEACHER) {
            return this.lessonModel.findById(lessonId);
        }

        if (role === UserRole.STUDENT) {
            const startTimeData = await this.startTimeModel.findOne({
                lessonId,
                studentId: userId,
            }).lean().exec();

            if (startTimeData) {
                return this.lessonModel.findById(lessonId);
            }

            const { idFrontLesson, _id } = await this.lessonModel.findById(lessonId).lean().exec();

            const updateStatusLesson: StartTimeDto = {
                lessonId,
                studentId: userId,
                status: StatusLesson.STARTED,
                startTime: (Math.floor(Date.now() / 1000)).toString()
            }

            if (idFrontLesson.toString() === _id.toString()) {
                await this.startTimeModel.create(updateStatusLesson)
                return this.lessonModel.findById(lessonId).exec();
            }

            const startTime = await this.startTimeModel.findOne({ studentId: userId, lessonId: idFrontLesson }).lean().exec()

            if (!startTime) {
                return new ForbiddenException("Không được phép truy cập")
            }

            const { status } = startTime;

            if (status === StatusLesson.SUBMITTED || status === StatusLesson.COMPLETED) {
                const startTimeData = await this.startTimeModel.findOne({
                    lessonId,
                    studentId: userId,
                }).lean().exec();
                if (!startTimeData) {
                    await this.startTimeModel.create(updateStatusLesson)
                    return this.lessonModel.findById(lessonId).exec();
                }
                return this.lessonModel.findById(lessonId).exec();
            } else {
                return new ForbiddenException("Không được phép truy cập")
            }
        }

        return new ForbiddenException("Không được phép truy cập")
    }

    async handleCreateLesson(contentLesson: LessonDto) {
        const { course } = contentLesson;

        const courseData = await this.courseModel.findById(course).exec();
        if (!courseData) {
            return { message: 'Không tồn tại khóa học để thêm.' };
        }

        const lessonCreated = await new this.lessonModel(contentLesson).save();
        const listLessons = courseData.toObject().lessons;
        const lessonId = lessonCreated.id;
        if (!listLessons.includes(lessonId)) {
            listLessons.push(lessonId);
            await courseData?.save();
        }
        return { message: 'Đã cập nhật bài học mới' };
    }
}
