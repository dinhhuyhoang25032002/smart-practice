import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ATTENDANCE_MODEL, AttendanceSchema } from 'src/schema/attendance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ATTENDANCE_MODEL,
        schema: AttendanceSchema
      }
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService]
})
export class AttendanceModule { }
