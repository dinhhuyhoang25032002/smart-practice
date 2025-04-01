import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import MongooseDelete from 'mongoose-delete'
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

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        expandVariables: true,
        envFilePath: '.env.development.local',
      }
    ),
    MongooseModule.forRoot(process.env.URL_DATABASE,
      {
        connectionFactory(connection: Connection, name: string) {
          {
            const { host, port, name } = connection
            connection && console.log("Connect Database successfully: ", `mongodb://${host}:${port}/${name}`);
          }

          connection.plugin(MongooseDelete,
            {
              deletedBy: true, deletedByType: String, deletedAt: true,
              overrideMethods: 'all'
            });
          return connection;
        }
      }
    ), SuperviceModule, UserModule, AuthModule, CourseModule, EvaluateModule, LessonModule, StarttimeModule, ResultModule, DeadlineModule, TimeviewModule
  ],
  controllers: [AppController,],
  providers: [AppService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AppModule { }
