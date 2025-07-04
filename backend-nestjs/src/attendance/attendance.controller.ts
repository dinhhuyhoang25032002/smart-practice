import { BadRequestException, Controller, Get, Post, Query } from '@nestjs/common';
import { AttendanceService } from 'src/attendance/attendance.service';

@Controller('attendance')
export class AttendanceController {

    constructor(
        readonly attendanceService: AttendanceService,
    ) { }

    @Get()
    async getAttendancesById(
        @Query("studentId") studentId: string,
    ) {
        if (!studentId) {
            return new BadRequestException('Thiếu userId');
        }
        return this.attendanceService.handleGetAttendancesById(studentId);
    }

    @Get("search-date")
    async getAttendancesByDate(
        @Query("studentId") studentId: string,
        @Query("date") date: string,
    ) {
        if (!studentId || !date) {
            return new BadRequestException('Thiếu userId');
        }

        return this.attendanceService.handleGetAttendancesByDate(studentId, date);
    }

    // @Post("create")
    // async createAttendance(
    // ) {

    //     return this.attendanceService.handleCreateAttendance();
    // }
}
