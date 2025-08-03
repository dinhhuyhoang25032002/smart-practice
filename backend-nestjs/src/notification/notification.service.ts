import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NOTIFICATION_MODEL,
} from 'src/schema/notification.schema';
import { Cron, Interval } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { NotificationsGateway } from './notification.gateway';
import { MailerService } from '@nestjs-modules/mailer';
import { PopulatedTask, Task, TASK_MODEL } from 'src/schema/task.schema';
import { STATUS_TASK, TYPE_NOTIFICATIOIN } from 'src/constant/constant';
import { ConfigService } from '@nestjs/config';
import slugify from 'slugify';
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NOTIFICATION_MODEL)
    private readonly notificationModel: Model<Notification> &
      SoftDeleteModel<Notification>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly mailService: MailerService,
    @InjectModel(TASK_MODEL)
    private readonly taskModel: Model<Task> & SoftDeleteModel<Task>,
    private configService: ConfigService,
  ) {}
  async handleGetNotifications(userId: string) {
    const notifications = await this.notificationModel
      .find({
        userId,
        status: 'unread',
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return {
      status: HttpStatus.OK,
      data: notifications,
    };
  }

  @Cron('0 0 8 * * *', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleNotificationDeadline() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(0, 0, 0, 0);
    console.log(targetDate);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const tasks = await this.taskModel
      .find({
        deadline: {
          $gte: targetDate,
          $lt: nextDay,
        },
        status: { $eq: STATUS_TASK.IN_PROGRESS },
      })
      .populate([
        {
          path: 'implementer',
          select: 'email fullname',
        },
        {
          path: 'projectId',
          select: 'name',
        },
      ])
      .lean<PopulatedTask[]>()
      .exec();

    console.log('tasks:', tasks);
    if (tasks.length !== 0) {
      tasks.forEach(async (item) => {
        const notificationData = await this.notificationModel.create({
          userId: item.implementer._id,
          message: `Bạn đang có nhiệm vụ ${item.name} ở dự án ${item.projectId.name} có thời hạn là ${new Date(item.deadline).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} còn thời gian 3 ngày trước khi hết hạn. Hãy chú ý và tập trung hoàn thiện nhé!`,
          status: 'unread',
          type: TYPE_NOTIFICATIOIN.NORMAL,
          content: {
            link: `${this.configService.get<string>('NEXT_PUBLIC_API_URL')}/du-an-steam/${slugify(item.projectId.name, { locale: 'vi', lower: true })}?q=${item.projectId._id}`,
          },
        });

        this.notificationsGateway.sendNotificationToUser(item.implementer._id, {
          message: `Bạn đang có nhiệm vụ ${item.name} ở dự án ${item.projectId.name} có thời hạn là ${new Date(item.deadline).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} còn thời gian 3 ngày trước khi hết hạn. Hãy chú ý và tập trung hoàn thiện nhé!`,
          notificationId: notificationData._id,
          content: {
            link: `${this.configService.get<string>('NEXT_PUBLIC_API_URL')}`,
          },
          type: TYPE_NOTIFICATIOIN.NORMAL,
        });
        try {
          const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: item.implementer.email,
            subject: 'Lời nhắc từ SmartLAB.',
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333;">
                    <p>Xin chào <strong>${item.implementer.fullname}</strong>,</p>
                    <p>
                       Bạn đang có nhiệm vụ <strong>${item.name}</strong> ở dự án <strong>${item.projectId.name}</strong> có thời hạn là <strong>${new Date(item.deadline).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</strong> còn thời gian <strong>3 ngày</strong> trước khi hết hạn. Hãy chú ý và tập trung hoàn thiện nhé!
                    </p>
                    <p>
                        Nếu bạn có thêm bất kỳ câu hỏi nào, vui lòng liên hệ qua email
                        này. <strong style="color: #074069">openlab.user@gmail.com</strong>
                    </p>
                    <br />
                    <p>Trân trọng,</p>
                    <p><strong>Đội ngũ OpenLAB</strong></p>
                    <hr />
                    <footer style="font-size: 14px; color: #888;">
                        <p>Đây là email tự động, vui lòng không trả lời email này.</p>
                    </footer>
                </div>`,
          };

          // Gửi email
          const result = await this.mailService.sendMail(mailOptions);
          //   console.log({ message: 'Email sent successfully', result });
          return { message: 'Email sent successfully', result };
        } catch (error) {
          console.error('Error sending email:', error);
          throw new HttpException(
            { message: 'Failed to send email', error: error.message },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
    }
  }
}
