import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { EvaluateModule } from './evaluate/evaluate.module';
import { LessonModule } from './lesson/lesson.module';
import { StarttimeModule } from './starttime/starttime.module';
import { ResultModule } from './result/result.module';
import { DeadlineModule } from './deadline/deadline.module';
import { AccessTokenStrategy } from 'src/auth/strategy/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/auth/strategy/refreshToken.strategy';
import { SuperviceModule } from './supervise/supervice.module';
import { TimeviewModule } from './timeview/timeview.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { AttendanceModule } from './attendance/attendance.module';
import { UpdatesModule } from './uploads/uploads.module';
import { ArduinoModule } from './arduino/arduino.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: configService.get<string>('SENDER_EMAIL'),
            clientId: configService.get<string>('CLIENT_MAILER_GOOGLE_ID'),
            clientSecret: configService.get<string>(
              'CLIENT_MAILER_GOOGLE_SECRET',
            ),
            refreshToken: configService.get<string>(
              'CLIENT_MAILER_GOOGLE_REFRESH_TOKEN',
            ),
          },
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('URL_DATABASE');
        return {
          uri,
          connectionFactory: (connection: Connection) => {
            connection.plugin(MongooseDelete, {
              overrideMethods: 'all',
              deletedAt: true,
            });

            connection.on('error', (err) => {
              console.error(`MongoDB connection error: ${err}`);
            });
            connection.on('connected', () => {
              console.log('MongoDB connection established successfully');
            });

            connection.on('disconnected', () => {
              console.log('MongoDB connection disconnected');
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    SuperviceModule,
    UserModule,
    AuthModule,
    CourseModule,
    EvaluateModule,
    LessonModule,
    StarttimeModule,
    ResultModule,
    DeadlineModule,
    TimeviewModule,
    AttendanceModule,
    UpdatesModule,
    ArduinoModule,
  ],
  controllers: [AppController],
  providers: [AppService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AppModule {}
