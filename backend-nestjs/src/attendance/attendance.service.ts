import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { ATTENDANCE_MODEL, Attendance } from 'src/schema/attendance.schema';
import { Model } from 'mongoose';
@Injectable()
export class AttendanceService {
    constructor(
        @InjectModel(ATTENDANCE_MODEL)
        private readonly attendanceModel: Model<Attendance> & SoftDeleteModel<Attendance>,
    ) { }

    async handleGetAttendancesById(studentId: string) {
        const attendances = await this.attendanceModel.find({ studentId }).lean().exec();

        if (attendances.length === 0) {
            return new BadRequestException('Không tìm thấy thông tin điểm danh');
        }
        return attendances;
    }

    async handleGetAttendancesByDate(studentId: string, date: string) {
        const attendances = await this.attendanceModel.find({ studentId, day: date }).lean().exec();

        if (attendances.length === 0) {
            return new BadRequestException('Không tìm thấy thông tin điểm danh');
        }
        return attendances;
    }

    // async handleCreateAttendance() {
    //     const studentIds = [
    //         '66a8f90c26f73f84d88c8141',
    //         '66a8f90c26f73f84d88c8142',
    //         '66a8f90c26f73f84d88c8143',
    //         '66a8f90c26f73f84d88c8144',
    //         '66a8f90c26f73f84d88c8145',
    //     ];

    //     const shifts = ['8h-12h (Ca 1)', '13h-17h (Ca 2)'];
    //     const statuses = ['LATE', 'ON_TIME'];
    //     const startDate = new Date('2025-01-01');
    //     const endDate = new Date('2025-04-23');
    //     const allRecords = [];

    //     for (const studentId of studentIds) {
    //         const records = [];

    //         for (let i = 0; i < 1000; i++) {
    //             const shift = shifts[Math.floor(Math.random() * shifts.length)];
    //             const status = statuses[Math.floor(Math.random() * statuses.length)];

    //             const randomTime = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    //             const day = randomTime.toLocaleDateString('vi-VN');

    //             let time = '08:00:00';
    //             if (shift === '8h-12h (Ca 1)') {
    //                 const hour = 8 + Math.floor(Math.random() * 4);
    //                 const minute = Math.floor(Math.random() * 60);
    //                 time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
    //             } else {
    //                 const hour = 13 + Math.floor(Math.random() * 4);
    //                 const minute = Math.floor(Math.random() * 60);
    //                 time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
    //             }

    //             records.push({
    //                 studentId,
    //                 shift,
    //                 time,
    //                 day,
    //                 status,
    //                 deleted: false,
    //                 createdAt: new Date(),
    //                 updatedAt: new Date(),
    //             });
    //         }

    //         allRecords.push(...records);
    //     }

    //     await this.attendanceModel.insertMany(allRecords);
    //     return { message: `5 studentIds x 1000 records = ${allRecords.length} inserted.` };
    // }
}
