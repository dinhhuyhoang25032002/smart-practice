import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { COURSE_MODEL, Course } from 'src/schema/course.schema';
import { Model } from 'mongoose';
import { DEADLINE_MODEL, Deadline } from 'src/schema/deadline.schema';
import { USER_MODEL, User } from 'src/schema/user.schema';
import removeAccents from 'remove-accents';
@Injectable()
export class CourseService {
    constructor(
        @InjectModel(COURSE_MODEL)
        private readonly courseModel: Model<Course> & SoftDeleteModel<Course>,
        @InjectModel(USER_MODEL)
        private readonly userModel: Model<User> & SoftDeleteModel<User>,
        @InjectModel(DEADLINE_MODEL)
        private readonly deadlineModel: Model<Deadline> & SoftDeleteModel<Deadline>,
    ) { }

    async handleGetAllCourseById(userId: string) {

        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            return { message: 'User không tồn tại' };
        }
        const deadline = await this.deadlineModel.find({ userId: userId })
            .populate({
                path: 'productionId',
            })
            .exec();
        return deadline
    }
    async findOneCourse(slug: string, query?: boolean, seo?: boolean) {
        if (query) {
            return this.courseModel.findOne({ slug: slug }).select('name')
                .populate({ path: 'lessons', select: 'name _id', });
        }
        if (seo) {
            return this.courseModel.findOne({ slug: slug }).select('name')
        }

        const dataCourse = await this.courseModel
            .findOne({ slug: slug })
            .populate({ path: 'lessons', select: 'name _id linkImage' });
        console.log(dataCourse);

        return dataCourse
    }

    async getCourseByName(name: string) {
        const valueToSearch = removeAccents(name);
        return this.courseModel
            .find({ isSearch: { $regex: new RegExp(valueToSearch), $options: 'i' } }, 'name')

    }

}
