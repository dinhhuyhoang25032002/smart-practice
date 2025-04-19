import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { COURSE_MODEL, Course } from 'src/schema/course.schema';
import { Model } from 'mongoose';
import { DEADLINE_MODEL, Deadline } from 'src/schema/deadline.schema';
import { USER_MODEL, User } from 'src/schema/user.schema';
import removeAccents from 'remove-accents';
import { MailerService } from '@nestjs-modules/mailer';
import { PopulatedLesson, UserJWT } from 'src/types/CustomType';
import { formatTimeVi } from 'src/util/formatTime';

import { EVALUATE_MODEL, Evaluate } from 'src/schema/evaluate.schema';
import { STARTTIME_MODEL, StartTime } from 'src/schema/starttime.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(COURSE_MODEL)
    private readonly courseModel: Model<Course> & SoftDeleteModel<Course>,
    @InjectModel(USER_MODEL)
    private readonly userModel: Model<User> & SoftDeleteModel<User>,
    @InjectModel(DEADLINE_MODEL)
    private readonly deadlineModel: Model<Deadline> & SoftDeleteModel<Deadline>,
    private readonly mailerService: MailerService,
    @InjectModel(EVALUATE_MODEL)
    private readonly evaluateModel: Model<Evaluate> & SoftDeleteModel<Evaluate>,
    @InjectModel(STARTTIME_MODEL)
    private readonly startTimeModel: Model<StartTime> &
      SoftDeleteModel<StartTime>,
  ) {}

  async handleGetAllCourseById(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return { message: 'User không tồn tại' };
    }
    const deadline = await this.deadlineModel
      .find({ userId: userId })
      .populate({
        path: 'productionId',
      })
      .exec();
    if (deadline.length === 0) {
      return new BadRequestException('Not found data');
    }
    return deadline;
  }
  async findOneCourse(slug: string, query?: boolean, seo?: boolean) {
    if (query) {
      return this.courseModel
        .findOne({ slug: slug })
        .select('name')
        .populate({ path: 'lessons', select: 'name _id' });
    }
    if (seo) {
      return this.courseModel.findOne({ slug: slug }).select('name');
    }

    const dataCourse = await this.courseModel
      .findOne({ slug: slug })
      .populate({ path: 'lessons', select: 'name _id linkImage' });
    console.log(dataCourse);
    if (!dataCourse) return new BadRequestException();
    return dataCourse;
  }

  async getCourseByName(name: string) {
    const valueToSearch = removeAccents(name);
    return this.courseModel
      .find(
        { isSearch: { $regex: new RegExp(valueToSearch), $options: 'i' } },
        'name',
      )
      .lean()
      .exec();
  }

  async handleActiveCourse(body: { code: string }, user: UserJWT) {
    const { code } = body;
    const { sub } = user;

    const userData = await this.userModel.findById(sub).lean().exec();
    if (!userData) {
      return new BadRequestException('Not found user data');
    }

    const course = await this.courseModel
      .findOne({
        code,
      })
      .lean()
      .exec();
    if (!course) {
      return new BadRequestException('Not found course data');
    }
    const courseId = course._id;
    const deadline = await this.deadlineModel
      .findOne({
        userId: sub,
        productionId: courseId,
      })
      .lean()
      .exec();
    if (!deadline) {
      const deadline = {
        userId: sub,
        productionId: courseId,
        productionType: 'COURSE',
      };

      await this.deadlineModel.create(deadline);
      return {
        status: HttpStatus.CREATED,
        message: 'Khóa học đã được mở khóa thành công',
      };
    }
    const { createdAt } = deadline;
    const activeTime = formatTimeVi(createdAt);

    return {
      status: HttpStatus.OK,
      message: 'Khóa học đã được thêm từ trước',
      activeTime,
    };
  }

  async handleGetAllResultACourse(slug: string, studentId: string) {
    const course = await this.courseModel
      .findOne({ slug })
      .populate({ path: 'lessons', select: 'name _id' })
      .exec();
    if (!course) {
      return new BadRequestException('Không tồn tại khóa học');
    }
    const lessons = course.lessons as unknown as PopulatedLesson[];
    const startTimeCourse = await this.startTimeModel
      .findOne({
        lessonId: lessons[0]._id,
        studentId,
      })
      .select('startTime -_id')
      .lean()
      .exec();
    const evaluation = await this.evaluateModel.find({
      studentId,
      lessonId: { $in: lessons },
    });
    const isComplete = evaluation.length === lessons.length;
    console.log(evaluation, startTimeCourse);

    const result = await this.evaluateModel
      .find({
        lessonId: { $in: lessons },
        studentId,
      })
      .select('lessonId score')
      .lean()
      .exec();

    const resultMap = new Map(
      result.map((item) => [item.lessonId.toString(), parseFloat(item.score)]),
    );
    const final = lessons.map((item) => ({
      lessonId: item._id,
      name: item.name,
      score: resultMap.get(item._id.toString()) || 0,
    }));
    return {
      nameCourse: course.name,
      dataResult: final,
      isComplete,
      ...startTimeCourse,
    };
  }
}
