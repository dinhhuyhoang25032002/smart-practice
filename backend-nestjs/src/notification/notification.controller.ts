import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Request } from 'express';
import { UserJWT } from 'src/types/CustomType';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get()
  getNotifications(@Req() req: Request) {
    const { sub } = req.user as UserJWT;
    return this.notificationService.handleGetNotifications(sub);
  }
}
