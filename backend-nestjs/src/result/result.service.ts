import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Result, RESULT_MODEL } from 'src/schema/result.schema';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { ConfigService } from '@nestjs/config';

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

    @InjectModel(DEADLINE_MODEL)
    private readonly deadlineModel: Model<Deadline> & SoftDeleteModel<Deadline>,
  ) {}

  async handleGetAllResultByStudentId(studentId: string) {
    const results = await this.resultModel
      .find({ studentId: studentId })
      .populate([
        {
          path: 'lessonId',
          select: 'name linkImage course',
          populate: {
            path: 'course',
            select: '_id',
          },
        },
        { path: 'studentId', select: 'fullname' },
      ])
      .select('-content')
      .lean<PopulatedResult[]>()
      .exec();

    if (results.length === 0) {
      return { status: HttpStatus.NOT_FOUND, message: 'Không có kết quả.' };
    }
    const deadlines = await this.deadlineModel
      .find({
        userId: studentId,
        productionType: CommodityType.COURSE,
      })
      .populate({ path: 'productionId', select: 'name lessons' })
      .lean<PopulatedDeadline[]>()
      .exec();

    if (deadlines.length === 0) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy deadline nào!',
      };
    }

    const merged = deadlines.map((item) => {
      const lessons = results
        .filter(
          (result) =>
            result.lessonId.course._id.toString() ===
            item.productionId._id.toString(),
        )
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

    return {
      status: HttpStatus.OK,
      message: 'Lấy kết quả thành công',
      data: merged,
    };
  }
  async handleGetOneResult(studentId: string, lessonId: string) {
    return await this.resultModel
      .findOne({ studentId, lessonId })
      .populate({
        path: 'studentId',
        select: 'fullname',
      })
      .lean()
      .exec();
  }
}
