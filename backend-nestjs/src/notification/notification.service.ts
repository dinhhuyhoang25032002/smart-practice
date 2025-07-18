import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NOTIFICATION_MODEL } from 'src/schema/notification.schema';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(NOTIFICATION_MODEL) 
        private readonly notificationModel : Model<Notification> & SoftDeleteModel<Notification>
    ) {}
    handleGetNotifications(userId: string) {

    }
}
