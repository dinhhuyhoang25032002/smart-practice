import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { StartTime, STARTTIME_MODEL } from 'src/schema/starttime.schema';
import { Model } from 'mongoose';
import { Result, RESULT_MODEL } from 'src/schema/result.schema';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { STATUS_TASK, StatusLesson } from 'src/constant/constant';
import slugify from 'slugify';
import { url } from 'inspector';
import { SubmitTaskDto } from 'src/steam/class/steam.dto';
import { TASK_MODEL, Task } from 'src/schema/task.schema';
@Injectable()
export class UploadsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(STARTTIME_MODEL)
    private readonly startTimeModel: Model<StartTime> &
      SoftDeleteModel<StartTime>,
    @InjectModel(RESULT_MODEL)
    private readonly resultModel: Model<Result> & SoftDeleteModel<Result>,
    @InjectModel(TASK_MODEL)
    private readonly taskModel: Model<Task> & SoftDeleteModel<Task>,
  ) {}
  async handleUploadImage(file: Express.Multer.File) {
    const NEST_ENDPOINT_STATIC_URL = this.configService.get<string>(
      'NEST_ENDPOINT_STATIC_URL',
    );
    const url = `${NEST_ENDPOINT_STATIC_URL}/${file.path.replace(/\\/g, '/')}`;
    return {
      status: HttpStatus.CREATED,
      message: 'Upload Image successfully!',
      url,
    };
  }
  async handleCreateResultLesson(
    data: { sub: string; _id: string; name: string },
    file: Express.Multer.File,
  ) {
    console.log(file);
    const { sub, _id, name } = data;
    const resultData = await this.resultModel
      .findOne({
        studentId: sub,
        lessonId: _id,
      })
      .lean()
      .exec();
    let filePath = join(
      process.cwd(),
      'tai-len',
      'ket-qua',
      slugify(name, { locale: 'vi', lower: true }),
    );
    const NEST_ENDPOINT_IMG_URL = this.configService.get<string>(
      'NEST_ENDPOINT_STATIC_URL',
    );
    let content = `${NEST_ENDPOINT_IMG_URL}/tai-len/ket-qua/${slugify(name, { locale: 'vi', lower: true })}/`;
    if (file.mimetype.startsWith('image/')) {
      filePath += '/images/' + file.filename;
      content += 'images/' + file.filename;
    } else if (file.mimetype.startsWith('video/')) {
      filePath += 'videos/' + file.filename;
    } else {
      filePath += '/files/' + file.filename;
      content += 'files/' + file.filename;
    }
    if (resultData) {
      console.log(filePath);
      if (existsSync(filePath)) {
        try {
          unlinkSync(filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      return new BadRequestException('Sinh viên đã nộp bài trước đó!');
    }

    const dataResult = {
      studentId: sub,
      lessonId: _id,
      url: content,
    };
    await this.resultModel.create(dataResult);

    await this.startTimeModel.findOneAndUpdate(
      {
        studentId: sub,
        lessonId: _id,
      },
      { status: StatusLesson.SUBMITTED },
    );
    return {
      status: 200,
      message: 'Nộp bài thành công',
    };
  }
  async handleSubmitTask(body: SubmitTaskDto, file: Express.Multer.File) {
    const { _id, submitTime, name, fileName } = body;

    let filePath = join(
      process.cwd(),
      'tai-len',
      'nhiem-vu',
      slugify(name, { locale: 'vi', lower: true }),
    );
    const NEST_ENDPOINT_IMG_URL = this.configService.get<string>(
      'NEST_ENDPOINT_STATIC_URL',
    );
    let content = `${NEST_ENDPOINT_IMG_URL}/tai-len/du-an-steam/${slugify(name, { locale: 'vi', lower: true })}/`;
    if (file.mimetype.startsWith('image/')) {
      filePath += '/images/' + file.filename;
      content += 'images/' + file.filename;
    } else if (file.mimetype.startsWith('video/')) {
      filePath += 'videos/' + file.filename;
    } else {
      filePath += '/files/' + file.filename;
      content += 'files/' + file.filename;
    }
    const task = await this.taskModel.findByIdAndUpdate(_id, {
      $push: {
        file: { url: content, name: fileName, submitTime: submitTime },
      },
      status: STATUS_TASK.IN_PROGRESS,
    });
    if (!task) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Nhiệm vụ không tồn tại!',
      };
    }
    return {
      status: HttpStatus.OK,
      message: 'Nộp bài thành công!',
    };
  }
}
