import { Controller, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get(':id')
  getNotifications(@Param('userId') userId: string) {
    return this.notificationService.handleGetNotifications(userId);
  }
}
