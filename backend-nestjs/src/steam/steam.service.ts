import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSteamProjectDto, CreateSteamTaskDto } from './class/steam.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Steam, STEAM_MODEL } from 'src/schema/steam.schema';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { USER_MODEL, User } from 'src/schema/user.schema';
import { Task, TASK_MODEL } from 'src/schema/task.schema';
import { STATUS_TASK } from 'src/constant/constant';
import { NotificationsGateway } from 'src/notification/notification.gateway';

@Injectable()
export class SteamService {
  constructor(
    @InjectModel(STEAM_MODEL)
    private readonly steamModel: Model<Steam> & SoftDeleteModel<Steam>,
    @InjectModel(USER_MODEL)
    private readonly userModel: Model<User> & SoftDeleteModel<User>,
    @InjectModel(TASK_MODEL)
    private readonly taskModel: Model<Task> & SoftDeleteModel<Task>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async handleGetSteamProjects(userId: string) {
    const data = await this.steamModel
      .find({
        $or: [{ leader: userId }, { listMember: userId }],
      })
      .populate([
        {
          path: 'leader',
          select: ' fullname',
        },
      ])
      .exec();

    return {
      status: HttpStatus.OK,
      message: 'Lấy dữ liệu thành công!',
      data,
    };
  }

  async handleGetSteamProjectDetail(id: string) {
    const data = await this.steamModel
      .findById(id)
      .populate([
        {
          path: 'leader',
          select: 'fullname',
        },
        {
          path: 'listMember',
          select: 'fullname scoreCup',
        },
      ])
      .exec();
    if (!data) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy dữ liệu dự án',
      };
    }
    return {
      status: HttpStatus.OK,
      message: 'Lấy dữ liệu thành công.',
      data,
    };
  }

  async handleCreateSteamProject(data: CreateSteamProjectDto, userId: string) {
    const isExist = await this.steamModel.findOne({
      leader: userId,
      name: data.name,
    });
    if (isExist) {
      return {
        status: HttpStatus.FOUND,
        message: 'Dự án đã được tạo trước đó.',
      };
    }
    const project = await this.steamModel.create({ ...data, leader: userId });
    this.notificationsGateway.sendNotificationToUser(
      '66a8f90c26f73f84d88c8146',
      {
        message: `Đã có thêm nhiệm vụ mới được tạo ra trong dự án ${project.name}`,
      },
    );
    return {
      status: HttpStatus.CREATED,
      message: 'Tạo dự án steam thành công!',
    };
  }

  async handleCreateSteamTask(data: CreateSteamTaskDto, userId: string) {
    const { projectId, name } = data;
    const project = await this.steamModel
      .findOne({
        _id: projectId,
      })
      .lean()
      .exec();
    if (!project) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy dự án.',
      };
    }
    if (userId !== project.leader.toString()) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Không có quyền tạo nhiệm vụ cho dự án này.',
      };
    }
    const isExist = await this.taskModel
      .findOne({
        projectId: projectId,
        name: name,
      })
      .lean()
      .exec();
    if (isExist) {
      return {
        status: HttpStatus.FOUND,
        message: 'Nhiệm vụ đã được tạo trước đó.',
      };
    }
    await this.taskModel.create({
      ...data,
      projectId,
      status: STATUS_TASK.TO_DO,
      creator: userId,
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Tạo nhiệm vụ thành công!',
    };
  }

  async handleGetSteamTasks(userId: string, projectId: string) {
    const project = await this.steamModel
      .findOne({
        leader: userId,
        _id: projectId,
      })
      .lean()
      .exec();
    if (!project) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy dự án.',
      };
    }
    if (userId === project.leader.toString()) {
      const data = await this.taskModel
        .find({
          creator: userId,
          projectId: projectId,
        })
        .lean()
        .exec();
      return {
        status: HttpStatus.OK,
        message: 'Lấy dữ liệu thành công!',
        data,
      };
    }
    const taskList = await this.taskModel
      .find({
        projectId: projectId,
        implementer: userId,
      })
      .lean()
      .exec();

    return {
      status: HttpStatus.OK,
      message: 'Lấy dữ liệu thành công!',
      data: taskList,
    };
  }
}
