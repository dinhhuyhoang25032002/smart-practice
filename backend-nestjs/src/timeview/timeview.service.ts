import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { TimeView, TIMEVIEW_MODEL } from 'src/schema/timeview.schema';
import { Model } from "mongoose"
import { TimeViewDto } from './class/TimeView.dto';
import { LESSON_MODEL, Lesson } from 'src/schema/lesson.schema';


@Injectable()
export class TimeviewService {

    constructor(
        @InjectModel(TIMEVIEW_MODEL)
        private readonly timeViewModel: Model<TimeView> & SoftDeleteModel<TimeView>,
        @InjectModel(LESSON_MODEL)
        private readonly lessonModel: Model<Lesson> & SoftDeleteModel<Lesson>
    ) { }

    async handleCreateTimeView(data: TimeViewDto) {
        const { lessonId, sectionId, endTimeView, startTimeView } = data;
        const lesson = await this.lessonModel.findById(lessonId).exec();
        if (!lesson) {
            return new BadRequestException("Not found lesson data")
        }

        if (!endTimeView) {
            await this.timeViewModel.create({
                lessonId, sectionId, startTimeView
            })

            return {
                status: 201,
                message: "Created successfully"
            }
        }
        //endTimeview
        const timeView = await this.timeViewModel.find({
            lessonId, sectionId, isEnd: false
        }).lean().exec();

        const timeViewWithoutStartTime = timeView.filter((item) => !item.startTimeView)

        if (timeView.length === 0) {
            return new BadRequestException("Not found data")
        }

        if (timeViewWithoutStartTime.length > 0) {
            const idToDelete = timeViewWithoutStartTime.map((item) => item._id)
            await this.timeViewModel.deleteMany({
                _id: { $in: idToDelete }
            })
        }

        const timeViewIsChecked = timeView.filter((item) =>
            (+endTimeView) - (+item.startTimeView) >= 10 * 1000 && (+endTimeView) - (+item.startTimeView) <= 60 * 60 * 1000)

        if (timeViewIsChecked.length === 1) {
            const timeviewToUpdate = await this.timeViewModel.findOne({
                lessonId, sectionId, startTimeView: timeViewIsChecked[0].startTimeView, isEnd: false
            }).exec();

            if (timeviewToUpdate) {
                timeviewToUpdate.set({
                    isEnd: true,
                    endTimeView: endTimeView
                })
                await timeviewToUpdate.save();
                return {
                    status: 200,
                    message: "Updated successfully"
                }
            }

            return new BadRequestException("Not found data")
        }

        if (timeViewIsChecked.length === 0) {
            await this.timeViewModel.deleteMany({
                lessonId, sectionId, isEnd: false
            }).exec();
            return new BadRequestException("No document found to update!")
        }

        const timeviewToUpdate = timeViewIsChecked.reduce((maxItem, currentItem) => {
            if (!maxItem || +currentItem.startTimeView > +maxItem) {
                return currentItem
            }
            return maxItem
        })

        const oldTimeview = timeViewIsChecked.filter((item) => item.startTimeView !== timeviewToUpdate.startTimeView)
        const startTimesToDelete = oldTimeview.map((item) => item.startTimeView);
        const lessonIdToDelete = oldTimeview.map((item) => item.lessonId)
        const sectionIdToDelete = oldTimeview.map((item) => item.sectionId)

        await this.timeViewModel.deleteMany({
            startTimeView: { $in: startTimesToDelete },
            lessonId: { $in: lessonIdToDelete },
            sectionId: { $in: sectionIdToDelete }
        }).exec()

        await this.timeViewModel.findOneAndUpdate({
            lessonId: timeviewToUpdate.lessonId,
            sectionId: timeviewToUpdate.sectionId,
            startTimeView: timeviewToUpdate.startTimeView
        }, { endTimeView: endTimeView, isEnd: true }).exec();

        return {
            status: 200,
            message: "Updated successfully"
        }
    }
}
