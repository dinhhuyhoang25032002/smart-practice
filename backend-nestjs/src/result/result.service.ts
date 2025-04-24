import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Result, RESULT_MODEL } from 'src/schema/result.schema';
import { Model } from "mongoose"
import { SoftDeleteModel } from 'mongoose-delete';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs, { promises } from "fs"

import { CommodityType, StatusLesson } from 'src/constant/constant';
import { StartTime, STARTTIME_MODEL } from 'src/schema/starttime.schema';
import { DEADLINE_MODEL, Deadline } from 'src/schema/deadline.schema';
import { PopulatedDeadline, PopulatedResult } from 'src/types/CustomType';

@Injectable()
export class ResultService {

    constructor(
        @InjectModel(RESULT_MODEL)
        private readonly resultModel: Model<Result> & SoftDeleteModel<Result>,
        readonly configService: ConfigService,
        @InjectModel(STARTTIME_MODEL)
        private readonly startTimeModel: Model<StartTime> & SoftDeleteModel<StartTime>,
        @InjectModel(DEADLINE_MODEL)
        private readonly deadlineModel: Model<Deadline> & SoftDeleteModel<Deadline>,
    ) { }

    async handleCreateResultLesson(data: { sub: string, lessonId: string }, file: Express.Multer.File) {

        const { sub, lessonId } = data;
        const resultData = await this.resultModel.findOne({
            studentId: sub, lessonId: lessonId
        }).exec();

        if (resultData) {
            const filePath = path.join('./upload', file.filename)

            if (fs.existsSync(filePath)) {
                try {
                    await promises.unlink(filePath)
                } catch (error) {
                    console.error('Error deleting file:', error);
                }
            }
            return new BadRequestException("Sinh viên đã nộp bài trước đó!")
        }
        const NEST_ENDPOINT_IMG_URL = this.configService.get<string>("NEST_ENDPOINT_IMG_URL")
        const content = `${NEST_ENDPOINT_IMG_URL}/${file.filename}`
        const dataResult = {
            studentId: sub,
            lessonId,
            content
        }
        await this.resultModel.create(dataResult);

        await this.startTimeModel.findOneAndUpdate(
            {
                studentId: sub,
                lessonId: lessonId
            },
            { status: StatusLesson.SUBMITTED })
        return {
            status: 200,
            message: "Nộp bài thành công"
        }
    }

    async handleGetAllResultByStudentId(studentId: string) {
        const results = await this.resultModel.find({ studentId: studentId }).populate([
            {
                path: "lessonId", select: "name linkImage course", populate: {
                    path: "course", select: "_id"
                }
            },
            { path: "studentId", select: "fullname" }
        ]).select("-content").exec();

        if (results.length === 0) {
            return new BadRequestException();
        }
        const deadlines = await this.deadlineModel.find({
            userId: studentId, productionType: CommodityType.COURSE
        }).populate({ path: "productionId", select: "name lessons" }).lean().exec();

        if (deadlines.length === 0) {
            return new BadRequestException("Không tìm thấy deadline nào!");
        }

        const merged = (deadlines as unknown as PopulatedDeadline[]).map((item) => {
            const lessons = (results as unknown as PopulatedResult[])
                .filter((result) => result.lessonId.course._id.toString() === item.productionId._id.toString())
                .map((res) => ({
                    lessonId: res.lessonId._id,
                    name: res.lessonId.name,
                    studentId: res.studentId,
                    linkImage: res.lessonId.linkImage,
                    isEvaluated: res.isEvaluated,
                    createdAt: res.createdAt,
                }));

            return {
                courseId: item.productionId._id,
                courseName: item.productionId.name,
                lessonNumber: item.productionId.lessons.length,
                lessons,
            };
        });

        return merged
    }
    async handleGetOneResult(studentId: string, lessonId: string) {
        return await this.resultModel.findOne({ studentId, lessonId }).populate({
            path: "studentId",
            select: "fullname"
        }).lean().exec();
    }

}
