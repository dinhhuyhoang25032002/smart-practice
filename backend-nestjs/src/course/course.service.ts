import { BadRequestException, HttpStatus, Injectable, HttpException } from '@nestjs/common';
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
import { CreateCourseDto } from 'src/course/class/ActiveCourse.dto';
import slugify from 'slugify';
import { CommodityType, UserRole } from 'src/constant/constant';

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
  ) { }

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
      return []
    }
    return deadline;
  }
  async findOneCourse(slug: string, query?: boolean, seo?: boolean, role?: string) {
    if (query) {
      return this.courseModel
        .findOne({ slug: slug })
        .select('name')
        .populate({ path: 'lessons', select: 'name _id' });
    }
    if (seo) {
      return this.courseModel.findOne({ slug: slug }).select('name');
    }
    if (role === UserRole.TEACHER) {
      return this.courseModel.findOne({ slug: slug }).populate({ path: 'lessons', select: 'name _id' });
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

  async handleGetAllCourseByTeacher() {
    return this.courseModel.aggregate([
      {
        $project: {
          name: 1,
          code: 1,
          lessons: { $size: "$lessons" }
        }
      }
    ]);
  }
  async handleDeleteCourse(_id: string) {
    await this.courseModel.deleteById(_id);
    return { message: "Đã xóa khóa học thành công!", status: HttpStatus.OK }
  }

  async handleCreateACourse(
    body: CreateCourseDto,
    image: Express.Multer.File,
  ) {
    const { name, code } = body;
    const course = await this.courseModel.findOneWithDeleted({
      name, code
    });
    if (course) {
      if ('deleted' in course) {
        // Nếu khóa học đã bị xóa, restore lại
        await this.courseModel.restore({ _id: course._id });

        return {
          message: 'Tạo khóa học thành công',
          status: HttpStatus.CREATED
        };
      } else {
        // Nếu khóa học đang tồn tại, xóa ảnh và báo lỗi
        const fs = require('fs');
        const path = require('path');
        const imagePath = path.join(process.cwd(), image.path);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
        return new BadRequestException('Khóa học đã tồn tại');
      }
    }

    // Tạo khóa học mới nếu chưa tồn tại
    const safeFolderName = slugify(name, { locale: "vi", lower: true });
    const staticServerUrl = process.env.NEST_ENDPOINT_URL_COURSE || 'http://localhost:3000';
    const imagePath = `${staticServerUrl}/${safeFolderName}/images/${image.filename}`;

    await this.courseModel.create({
      ...body,
      image: imagePath,
      slug: slugify(name, { locale: "vi", lower: true }),
      type: CommodityType.COURSE,
      isSearch: slugify(name, { locale: "vi", lower: false })
    });

    return {
      message: 'Tạo khóa học thành công',
      status: HttpStatus.CREATED
    };
  }
  async handleGetAllCourseDeleted() {
    const courseDeleted = await this.courseModel.findWithDeleted({ deleted: true }).select("name code lessons").lean().exec();

    if (courseDeleted.length === 0) {
      return { message: "Không có khóa học đã xóa", status: HttpStatus.NOT_FOUND, data: [] }
    }
    const data = courseDeleted.map((item) => {
      return {
        name: item.name,
        code: item.code,
        lessons: item.lessons.length,
        _id: item._id
      }
    })
    return {
      status: HttpStatus.OK,
      message: "Danh sách các khóa học đã xóa",
      data
    }
  }

  async handleRestoreCourse(id: string) {
    await this.courseModel.restore({ _id: id });
    return { message: "Khôi phục khóa học thành công", status: HttpStatus.OK }
  }
}
