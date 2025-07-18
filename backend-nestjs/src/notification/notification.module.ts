import { Global, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationsGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NOTIFICATION_MODEL,
  NotificationSchema,
} from 'src/schema/notification.schema';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NOTIFICATION_MODEL, schema: NotificationSchema },
    ]),
  ], // Add your notification schema here if needed
  controllers: [NotificationController],
  providers: [NotificationsGateway, NotificationService],
  exports: [NotificationsGateway],
})
export class NotificationModule {}
