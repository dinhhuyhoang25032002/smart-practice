import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SoftDeleteModel } from "mongoose-delete";
import { USER_MODEL, User } from "src/schema/user.schema";
import { Model } from "mongoose";
import { UserRole } from "src/constant/constant";
@Injectable()
export class UserService {
    constructor(
        @InjectModel(USER_MODEL)
        private readonly userModel: Model<User> & SoftDeleteModel<User>,
    ) { }
    async handleGetUserInfo(userId: string) {
        return this.userModel.findById(userId).select("-password").exec();
    }

    async handleGetAllUser(increase: boolean) {
        if (increase) {
            return this.userModel.find({ role: UserRole.STUDENT }).sort({ address: 1 })
        }
        return this.userModel.find({ role: UserRole.STUDENT }).collation({ locale: "vi", strength: 1 }).sort({ address: -1 })
    }
}