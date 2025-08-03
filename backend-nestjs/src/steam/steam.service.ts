import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateSteamProjectDto,
  CreateSteamTaskDto,
  InviteSteamMemberDto,
  PartialInviteSteamMemberDto,
} from './class/steam.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Steam, STEAM_MODEL } from 'src/schema/steam.schema';
import mongoose, { Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { USER_MODEL, User } from 'src/schema/user.schema';
import { PopulatedTask, Task, TASK_MODEL } from 'src/schema/task.schema';
import {
  STATUS_TASK,
  StatusComment,
  TYPE_NOTIFICATIOIN,
} from 'src/constant/constant';
import { NotificationsGateway } from 'src/notification/notification.gateway';

import {
  NOTIFICATION_MODEL,
  Notification,
} from 'src/schema/notification.schema';
import slugify from 'slugify';
import { ConfigService } from '@nestjs/config';

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
    private configservice: ConfigService,
  ) {}

  async handleGetSteamProjects(userId: string) {
    const data = await this.steamModel
      .find({
        $or: [{ leader: userId }, { 'listMember.memberId': userId }],
      })
      .populate([
        {
          path: 'leader',
          select: 'fullname',
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

  // async handleGetSteamProjectDetail(id: string) {
  //   const data = await this.steamModel
  //     .findById(id)
  //     .populate([
  //       {
  //         path: 'leader',
  //         select: 'fullname',
  //       },
  //       {
  //         path: 'listMember.memberId',
  //         select: 'fullname',
  //       },
  //     ])
  //     .exec();
  //   if (!data) {
  //     return {
  //       status: HttpStatus.NOT_FOUND,
  //       message: 'Không tìm thấy dữ liệu dự án',
  //     };
  //   }
  //   return {
  //     status: HttpStatus.OK,
  //     message: 'Lấy dữ liệu thành công.',
  //     data,
  //   };
  // }

  async handleGetSteamProjectDetail(id: string) {
    const projectId = new mongoose.Types.ObjectId(id);

    const aggregationResult = await this.steamModel.aggregate([
      // ===== Giai đoạn 1: Tìm dự án chính =====
      {
        $match: { _id: projectId },
      },
      {
        $lookup: {
          from: 'tasks',
          let: { projectId: '$_id' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$projectId', '$$projectId'] } },
            },
            {
              // Nhóm tất cả task của dự án lại để đếm
              $group: {
                _id: null, // Nhóm tất cả vào một
                totalTasks: { $sum: 1 }, // Đếm tổng số task
                completedTasks: {
                  // Chỉ cộng 1 nếu status là COMPLETED
                  $sum: {
                    $cond: [{ $eq: ['$status', STATUS_TASK.COMPLETED] }, 1, 0],
                  },
                },
              },
            },
          ],
          as: 'projectTaskStats', // Kết quả: [{ _id: null, totalTasks: 50, completedTasks: 20 }]
        },
      },
      // Unwind để dễ truy cập, preserve... để không mất dự án nếu nó không có task nào
      {
        $unwind: {
          path: '$projectTaskStats',
          preserveNullAndEmptyArrays: true,
        },
      },
      // ===== Giai đoạn 2: Populate Leader =====
      {
        $lookup: {
          from: 'users',
          localField: 'leader',
          foreignField: '_id',
          as: 'leaderInfo',
          pipeline: [{ $project: { fullname: 1 } }], // Chỉ lấy fullname
        },
      },
      { $unwind: { path: '$leaderInfo', preserveNullAndEmptyArrays: true } },

      // ===== Giai đoạn 3: Tách các thành viên ra =====
      {
        $unwind: { path: '$listMember', preserveNullAndEmptyArrays: true },
      },

      // ===== Giai đoạn 4: Populate thông tin cho mỗi memberId =====
      {
        $lookup: {
          from: 'users',
          localField: 'listMember.memberId',
          foreignField: '_id',
          as: 'listMember.memberInfo',
          pipeline: [{ $project: { fullname: 1 } }],
        },
      },
      {
        $unwind: {
          path: '$listMember.memberInfo',
          preserveNullAndEmptyArrays: true,
        },
      },

      // ===== Giai đoạn 5: Đếm các nhiệm vụ cho từng thành viên (Đã tối ưu) =====
      {
        $lookup: {
          from: 'tasks', // Tên collection của Task
          let: { memberId: '$listMember.memberId' },
          pipeline: [
            {
              // Tìm các task mà thành viên này là người thực hiện VÀ thuộc dự án này
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$implementer', '$$memberId'] },
                    { $eq: ['$projectId', projectId] },
                  ],
                },
              },
            },
            // Nhóm theo trạng thái và đếm
            {
              $group: {
                _id: '$status', // Nhóm theo 'HOÀN THÀNH', 'ĐANG LÀM', etc.
                count: { $sum: 1 }, // Đếm số lượng trong mỗi nhóm
              },
            },
            // Kết quả của pipeline này sẽ là: [{ _id: 'HOÀN THÀNH', count: 5 }, { _id: 'ĐANG LÀM', count: 2 }]
          ],
          as: 'taskCounts', // Lưu kết quả đếm vào trường 'taskCounts'
        },
      },
      // ===== Giai đoạn 6: Định dạng lại kết quả và nhóm các thành viên lại =====
      {
        $group: {
          _id: '$_id', // Nhóm lại theo ID của dự án
          name: { $first: '$name' },
          description: { $first: '$description' },
          slug: { $first: '$slug' },
          leader: { $first: '$leaderInfo' }, // leaderInfo đã được project ở trên
          totalProjectTasks: {
            $first: { $ifNull: ['$projectTaskStats.totalTasks', 0] },
          },
          completedProjectTasks: {
            $first: { $ifNull: ['$projectTaskStats.completedTasks', 0] },
          },
          startDate: { $first: '$startDate' },
          endDate: { $first: '$endDate' },
          listMember: {
            $push: {
              // Tạo lại mảng listMember
              memberId: '$listMember.memberInfo', // memberInfo đã được project ở trên
              role: '$listMember.role',
              teamNumber: '$listMember.teamNumber',
              createdAt: '$listMember.createdAt',

              // --- Logic chuyển đổi mảng taskCounts thành các trường riêng biệt ---
              completedTasksCount: {
                // Tìm trong mảng taskCounts, object nào có _id là 'HOÀN THÀNH'
                $ifNull: [
                  // Nếu không tìm thấy (null), trả về 0
                  {
                    $let: {
                      vars: {
                        completedObj: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$taskCounts',
                                as: 'item',
                                cond: {
                                  $eq: ['$$item._id', STATUS_TASK.COMPLETED],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: '$$completedObj.count',
                    },
                  },
                  0, // Giá trị mặc định nếu null
                ],
              },
              inProgressTasksCount: {
                // Tương tự, tìm các trạng thái "đang đảm nhiệm"
                $ifNull: [
                  {
                    $sum: {
                      // Tính tổng số lượng của các trạng thái "đang làm"
                      $map: {
                        input: {
                          $filter: {
                            input: '$taskCounts',
                            as: 'item',
                            cond: {
                              $in: [
                                '$$item._id',
                                [
                                  STATUS_TASK.IN_PROGRESS,
                                  STATUS_TASK.COMPLETED,
                                  STATUS_TASK.TO_DO,
                                ],
                              ],
                            }, // Ví dụ: 'ĐANG LÀM', 'CHỜ'
                          },
                        },
                        as: 'statusGroup',
                        in: '$$statusGroup.count',
                      },
                    },
                  },
                  0, // Giá trị mặc định nếu null
                ],
              },
            },
          },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
        },
      },
    ]);

    const data = aggregationResult[0];

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
      slug: slugify(name, { locale: 'vi', lower: true }),
      projectId,
      status: STATUS_TASK.TO_START,
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
        .sort({ createdAt: -1 })
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
      .populate({
        path: 'implementer',
        select: 'fullname',
      })
      .sort({ createdAt: -1 })
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
      .lean<
        Omit<Steam, 'leader'> & {
          leader: {
            _id: string;
            fullname: string;
          };
        }
      >()
      .exec();

    if (!project) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy dự án.',
      };
    }
    const leader = project.leader.fullname;
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
      message: `Bạn đã được mời tham gia dự án ${project.name} của ${leader}`,
      type: TYPE_NOTIFICATIOIN.IMPORTANT,
      content: {
        teamNumber,
        role,
        projectId: project._id,
        link: `${this.configservice.get<string>('NEXT_PUBLIC_API_URL')}/du-an-steam/${slugify(project.name, { locale: 'vi', lower: true })}?q=${projectId}`,
      },
      status: 'unread',
    });

    this.notificationsGateway.sendNotificationToUser(memberId, {
      message: `Bạn đã được mời tham gia dự án ${project.name} của ${leader}`,
      projectId: project._id,
      teamNumber,
      role,
      notificationId: notificationData._id,
      type: TYPE_NOTIFICATIOIN.IMPORTANT,
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
        projectId: projectId,
      })
      .populate({
        path: 'projectId',
        select: 'name',
      })
      .lean<PopulatedTask>()
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
        status: STATUS_TASK.TO_DO,
        startTime: new Date().toString(),
      },
    );
    const notificationData = await this.notificationModel.create({
      userId: memberId,
      type: TYPE_NOTIFICATIOIN.NORMAL,
      message: `Bạn đã được giao nhiệm vụ ${task.name} trong dự án ${task.projectId.name}`,
      content: {
        link: `${this.configservice.get<string>('NEXT_PUBLIC_API_URL')}/du-an-steam/${slugify(task.projectId.name, { locale: 'vi', lower: true })}?q=${projectId}`,
      },
      status: 'unread',
    });
    this.notificationsGateway.sendNotificationToUser(memberId, {
      message: `Bạn đã được giao nhiệm vụ ${task.name} trong dự án ${task.projectId.name}`,
      projectId: task.projectId._id,
      type: TYPE_NOTIFICATIOIN.NORMAL,
      content: {
        link: `${this.configservice.get<string>('NEXT_PUBLIC_API_URL')}/du-an-steam/${slugify(task.projectId.name, { locale: 'vi', lower: true })}?q=${projectId}`,
      },
      notificationId: notificationData._id,
    });
    return {
      status: HttpStatus.OK,
      message: 'Giao nhiệm vụ thành công!',
    };
  }

  async handleGetDetailTask(taskId: string) {
    console.log('taskId', taskId);
    const task = await this.taskModel
      .findById(taskId)
      .populate([
        { path: 'implementer', select: ['fullname'] },
        { path: 'creator', select: ['fullname'] },
        { path: 'projectId', select: ['name'] },
      ])
      .lean()
      .exec();
    if (!task) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy nhiệm vụ.',
      };
    }
    return {
      status: HttpStatus.OK,
      message: 'Lấy dữ liệu thành công!',
      data: task,
    };
  }

  async handleChangeStatusTask(
    userId: string,
    body: { taskId: string; status: string; fileId: string },
  ) {
    const { taskId, status, fileId } = body;

    // B1: Tìm task
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy nhiệm vụ.',
      };
    }

    // B2: Tìm file trong mảng và cập nhật status
    const targetFile = task.file.find((f: any) => f._id.toString() === fileId);
    if (!targetFile) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy file đã nộp.',
      };
    }

    targetFile.status = status;

    // B3: Nếu status của file là PASSED ⇒ cập nhật task.status = COMPLETED
    if (status === StatusComment.GOOD) {
      task.status = STATUS_TASK.COMPLETED;
      task.completeTime = new Date().toString();
    }

    await task.save();

    return {
      status: HttpStatus.OK,
      message: 'Cập nhật trạng thái thành công!',
    };
  }
}
