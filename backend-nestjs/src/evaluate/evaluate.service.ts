import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Evaluate, EVALUATE_MODEL } from 'src/schema/evaluate.schema';
import { Model } from 'mongoose';
import { EvaluateDto } from 'src/evaluate/class/Evaluate.dto';
import { User, USER_MODEL } from 'src/schema/user.schema';
import { LESSON_MODEL, Lesson } from 'src/schema/lesson.schema';
import { StatusLesson } from 'src/constant/constant';
import { STARTTIME_MODEL, StartTime } from 'src/schema/starttime.schema';
import { RESULT_MODEL, Result } from 'src/schema/result.schema';
import { exec } from 'child_process';
@Injectable()
export class EvaluateService {
  constructor(
    @InjectModel(EVALUATE_MODEL)
    private readonly evaluateModel: Model<Evaluate> & SoftDeleteModel<Evaluate>,
    @InjectModel(USER_MODEL)
    private readonly userModel: Model<User> & SoftDeleteModel<User>,
    @InjectModel(LESSON_MODEL)
    private readonly lessonModel: Model<Lesson> & SoftDeleteModel<Lesson>,
    @InjectModel(STARTTIME_MODEL)
    private readonly startTimeModel: Model<StartTime> &
      SoftDeleteModel<StartTime>,
    @InjectModel(RESULT_MODEL)
    private readonly resultModel: Model<Result> & SoftDeleteModel<Result>,
  ) {}

  async handleCreateAEvaluation(id: string, data: EvaluateDto) {
    const { score, studentId, content, lessonId } = data;
    const student = await this.userModel.findById(studentId).lean().exec();
    const teacher = await this.userModel.findById(id).lean().exec();
    const lesson = await this.lessonModel.findById(lessonId).lean().exec();
    const result = await this.resultModel
      .findOne({
        studentId: studentId,
        lessonId: lessonId,
      })
      .exec();
    if (!student) {
      return new NotFoundException('Không tìm thấy dữ liệu về sinh viên');
    }
    if (!teacher) {
      return new NotFoundException('Không tìm thấy dữ liệu về giáo viên');
    }
    if (!lesson) {
      return new NotFoundException('Không tìm thấy dữ liệu về khóa học');
    }

    if (!result) {
      return new NotFoundException(
        'Không tìm thấy dữ liệu về bài làm của sinh viên',
      );
    }

    const evaluateData = await this.evaluateModel
      .findOne({ teacherId: id, lessonId: lessonId, studentId: studentId })
      .exec();
    if (evaluateData) {
      evaluateData.set({ score, content });
      await evaluateData.save();
      result.set({ isEvaluated: true });
      await result.save();
      return { message: 'Đã update lại đánh giá', status: 200 };
    }
    const evaluate = {
      ...data,
      teacherId: id,
    };
    await this.startTimeModel.findOneAndUpdate(
      {
        studentId: studentId,
        lessonId: lessonId,
      },
      { status: StatusLesson.COMPLETED },
    );

    await this.evaluateModel.create(evaluate);

    return { message: 'Đã đánh giá', status: 201 };
  }

  async handleGetEvaluation(studentId: string, lessonId: string) {
    const evaluate = await this.evaluateModel
      .findOne({ studentId, lessonId })
      .populate([
        { path: 'studentId', select: 'fullname' },
        { path: 'lessonId', select: 'name' },
      ])
      .lean()
      .exec();
    if (!evaluate) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy đánh giá.',
      };
    }
    return {
      status: HttpStatus.OK,
      data: evaluate,
    };
  }
}
