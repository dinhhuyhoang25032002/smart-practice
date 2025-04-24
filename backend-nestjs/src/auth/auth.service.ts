import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, USER_MODEL } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { compareData, hardData } from 'src/util/bcrypt';
import { getToken } from 'src/util/auth';
import { Response } from 'express';
import { SoftDeleteModel } from 'mongoose-delete';
import { RegisterDto, LoginDto } from 'src/auth/class/Auth.dto';
import { ShiftAttendance, StatusAttendance, UserRole } from 'src/constant/constant';
import { Attendance, ATTENDANCE_MODEL } from 'src/schema/attendance.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(USER_MODEL)
        private readonly userModel: Model<User> & SoftDeleteModel<User>,
        @InjectModel(ATTENDANCE_MODEL)
        private readonly attendanceModel: Model<Attendance> & SoftDeleteModel<Attendance>,
    ) { }

    async handleRegister(user: RegisterDto) {
        const { email, password } = user;

        const userExist = await this.userModel.findOne({ email: email }).exec();
        if (!userExist) {
            const passwordhard = await hardData(password);
            const UserSave = {
                ...user,
                password: passwordhard,
                role: UserRole.STUDENT,
            };
            await new this.userModel(UserSave)
                .save({ validateBeforeSave: true })
                .catch((e) => {
                    throw new Error(e);
                });
            return { message: 'Bạn đã đăng kí thành công' };
        }
        return new BadRequestException('Email đã tồn tại');
    }

    async handleLogin(user: LoginDto, res: Response) {
        try {
            const { email, password } = user;

            let User = await this.userModel
                .findOne({ email: email })
                .select('+password').lean()
                .exec();

            if (!User) {
                return new BadRequestException('Email không tồn tại');
            }

            // Attendance
            const date = new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
            });
            // const date = "15:43:10 23/4/2025"
            const [timePart, datePart] = date.split(" ");
            const [hours, minutes] = timePart.split(":");
            console.log(date);

            const attendance = await this.attendanceModel.find({
                studentId: User._id,
                day: datePart,
            })
            if (+hours >= 8 && +hours <= 12 || +hours >= 13 && +hours <= 17) {
                const attendanceSave = {
                    studentId: User._id,
                    time: timePart,
                    day: datePart,
                    status: "",
                    shift: ""
                };
                if (attendance.length === 0) {
                    if ((+hours === 8 && +minutes <= 30)) {
                        await new this.attendanceModel({ ...attendanceSave, status: StatusAttendance.ON_TIME, shift: ShiftAttendance.MORNING })
                            .save({ validateBeforeSave: true })
                    }
                    if ((+hours >= 8 && +minutes > 30)) {
                        await new this.attendanceModel({ ...attendanceSave, status: StatusAttendance.LATE, shift: ShiftAttendance.MORNING })
                            .save({ validateBeforeSave: true })
                    }
                    if (+hours === 13 && +minutes <= 30) {
                        await new this.attendanceModel({ ...attendanceSave, status: StatusAttendance.ON_TIME, shift: ShiftAttendance.AFTERNOON })
                            .save({ validateBeforeSave: true })
                    }
                    if (+hours >= 13 && +minutes > 30) {
                        await new this.attendanceModel({ ...attendanceSave, status: StatusAttendance.LATE, shift: ShiftAttendance.AFTERNOON })
                            .save({ validateBeforeSave: true })
                    }
                } else if (attendance.length === 1) {
                    if (+hours >= 13 && +hours <= 17) {
                        const hourAttendanced = +attendance[0].time.split(":")[0]
                        if (hourAttendanced >= 8 && hourAttendanced <= 12) {
                            if ((+hours === 13 && +minutes <= 30)) {
                                await new this.attendanceModel({ ...attendanceSave, status: StatusAttendance.ON_TIME, shift: ShiftAttendance.AFTERNOON })
                                    .save({ validateBeforeSave: true })
                            } else if (+hours >= 13 && +minutes > 30) {
                                await new this.attendanceModel({ ...attendanceSave, status: StatusAttendance.LATE, shift: ShiftAttendance.AFTERNOON })
                                    .save({ validateBeforeSave: true })
                            }
                        }
                    }
                }
            }

            //Validate password
            let checkPassword = await compareData(password as string, User.password);
            if (!checkPassword) {
                return new ForbiddenException('Mật khẩu sai');
            }

            const { accessToken, refreshToken } = await getToken(
                User._id as string,
                User.role,
            );

            res.cookie('token', refreshToken,
                { httpOnly: true, secure: true, sameSite: "none", expires: new Date(Date.now() + 604800000), partitioned: true });

            return {
                accessToken,
            };
        } catch (e) {
            throw new Error(e);
        }
    }

    async refreshToken(jwt: { sub: string; role: string }) {
        const { sub, role } = jwt;
        const { accessToken } = await getToken(sub, role);
        return {
            accessToken,
        };
    }
}
