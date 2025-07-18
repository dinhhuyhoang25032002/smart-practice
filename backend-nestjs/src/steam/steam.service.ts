import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateSteamProjectDto,
  CreateSteamTaskDto,
  InviteSteamMemberDto,
  PartialInviteSteamMemberDto,
} from './class/steam.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Steam, STEAM_MODEL } from 'src/schema/steam.schema';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { USER_MODEL, User } from 'src/schema/user.schema';
import { Task, TASK_MODEL } from 'src/schema/task.schema';
import { STATUS_TASK } from 'src/constant/constant';
import { NotificationsGateway } from 'src/notification/notification.gateway';
import {
  NOTIFICATION_MODEL,
  Notification,
} from 'src/schema/notification.schema';

@Injectable()
export class SteamService {
  constructor(
    @InjectModel(STEAM_MODEL)
    private readonly steamModel: Model<Steam> & SoftDeleteModel<Steam>,
    @InjectModel(USER_MODEL)
    private readonly userModel: Model<User> & SoftDeleteModel<User>,
    @InjectModel(NOTIFICATION_MODEL)
    private readonly notificationModel: Model<Notification> &
      SoftDeleteModel<Notification>,
    @InjectModel(TASK_MODEL)
    private readonly taskModel: Model<Task> & SoftDeleteModel<Task>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async handleGetSteamProjects(userId: string) {
    const data = await this.steamModel
      .find({
        $or: [{ leader: userId }, { 'listMember.memberId': userId }],
      })
      .populate([
        {
          path: 'leader',
          select: ' fullname',
        },
      ])
      .sort({ createdAt: -1 })
      .lean()
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
          path: 'listMember.memberId',
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
        .populate({
          path: 'implementer',
          select: 'fullname',
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

  async handleInviteSteamMember(data: InviteSteamMemberDto, userId: string) {
    const { projectId, memberId, teamNumber, role } = data;
    const project = await this.steamModel
      .findOne({
        _id: projectId,
        leader: userId,
      })
      .populate({
        path: 'leader',
        select: 'fullname',
      })
      .lean()
      .exec();

    if (!project) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy dự án.',
      };
    }
    const leader = (project.leader as any as { _id: string; fullname: string })
      .fullname;
    // const member = await this.userModel
    //   .findOne({
    //     _id: memberId,
    //   })
    //   .lean()
    //   .exec();
    // if (!member) {
    //   return {
    //     status: HttpStatus.NOT_FOUND,
    //     message: 'Không tìm thấy thành viên.',
    //   };
    // }
    const isMemberExisted = project.listMember.some(
      (member) => member.memberId.toString() === memberId,
    );

    if (isMemberExisted) {
      return {
        status: HttpStatus.BAD_REQUEST, // Dùng BAD_REQUEST thay cho FOUND
        message: 'Thành viên đã có trong dự án.',
      };
    }

    const notificationData = await this.notificationModel.create({
      userId: memberId,
      content: `Bạn đã được mời tham gia dự án ${project.name} của ${leader}`,
      status: 'unread',
    });

    this.notificationsGateway.sendNotificationToUser(memberId, {
      message: `Bạn đã được mời tham gia dự án ${project.name} của ${leader}`,
      projectId: project._id,
      teamNumber,
      role,
      notificationId: notificationData._id,
    });
    return {
      status: HttpStatus.CREATED,
      message: 'Đã gửi lời mời thành viên vào dự án thành công!',
    };
  }

  async handleAccessSteamProject(
    userId: string,
    data: PartialInviteSteamMemberDto,
  ) {
    const { projectId, teamNumber, role, notificationId } = data;
    await this.steamModel.updateOne(
      {
        _id: projectId,
        listMember: {
          $not: {
            $elemMatch: {
              memberId: userId,
            },
          },
        },
      },
      {
        $push: {
          listMember: {
            memberId: userId,
            teamNumber: teamNumber,
            role: role,
          },
        },
      },
    );
    await this.notificationModel.deleteOne({
      _id: notificationId,
      userId: userId,
    });
    return { status: HttpStatus.OK, message: 'Tham gia dự án thành công!' };
  }

  async handleAssignSteamTask(
    userId: string,
    body: { taskId: string; memberId: string; projectId: string },
  ) {
    const { taskId, memberId, projectId } = body;
    const task = await this.taskModel
      .findOne({
        _id: taskId,
        creator: userId,
      })
      .lean()
      .exec();
    if (!task) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy nhiệm vụ.',
      };
    }
    if (task.implementer && task.implementer.toString() !== memberId) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Nhiệm vụ đã được giao cho thành viên khác.',
      };
    }
    await this.taskModel.updateOne(
      { _id: taskId },
      {
        implementer: memberId,
        status: STATUS_TASK.IN_PROGRESS,
        startTime: new Date().toString(),
      },
    );
    await this.steamModel.updateOne(
      { _id: projectId },
      {
        $inc: {
          'listMember.$[elem].totalTasks': 1,
        },
      },
      {
        arrayFilters: [{ 'elem.memberId': memberId }],
      },
    );
    return {
      status: HttpStatus.OK,
      message: 'Giao nhiệm vụ thành công!',
    };
  }
}
