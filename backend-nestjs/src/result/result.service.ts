import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Result, RESULT_MODEL } from 'src/schema/result.schema';
import { Model } from "mongoose"
import { SoftDeleteModel } from 'mongoose-delete';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs, { promises } from "fs"

import { StatusLesson } from 'src/constant/constant';
import { StartTime, STARTTIME_MODEL } from 'src/schema/starttime.schema';

@Injectable()
export class ResultService {

    constructor(
        @InjectModel(RESULT_MODEL)
        private readonly resultModel: Model<Result> & SoftDeleteModel<Result>,
        readonly configService: ConfigService,
        @InjectModel(STARTTIME_MODEL)
        private readonly startTimeModel: Model<StartTime> & SoftDeleteModel<StartTime>,
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
        return this.resultModel.find({ studentId: studentId }).populate([
            { path: "lessonId", select: "name linkImage" },
            { path: "studentId", select: "fullname" }
        ]).select("-content").lean().exec();
    }

    async handleGetOneResult(studentId: string, lessonId: string) {
        return await this.resultModel.findOne({ studentId, lessonId }).populate({
            path: "studentId",
            select: "fullname"
        }).lean().exec();
    }
}
