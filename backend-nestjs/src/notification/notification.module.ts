import { Global, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';

import { NotificationsGateway } from './notification.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('ACCESSTOKEN_SECRET_KEY'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationsGateway, NotificationService],
  exports: [NotificationsGateway],
})
export class NotificationModule {}
