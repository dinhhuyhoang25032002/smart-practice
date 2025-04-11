import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, USER_MODEL } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { compareData, hardData } from 'src/util/bcrypt';
import { getToken } from 'src/util/auth';
import { Response } from 'express';
import { SoftDeleteModel } from 'mongoose-delete';
import { RegisterDto, PartialTypeAuth } from 'src/auth/class/Auth.dto';
import { UserRole } from 'src/constant/constant';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(USER_MODEL)
        private readonly userModel: Model<User> & SoftDeleteModel<User>,
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

    async handleLogin(user: PartialTypeAuth, res: Response) {
        try {
            const { email, password } = user;
            let User = await this.userModel
                .findOne({ email: email })
                .select('+password').lean()
                .exec();

            if (!User) {
                return new BadRequestException('Email không tồn tại');
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
                accessToken: accessToken,
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
