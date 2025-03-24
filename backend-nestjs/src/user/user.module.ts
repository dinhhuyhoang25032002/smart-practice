import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { USER_MODEL, UserSchema } from "src/schema/user.schema";
import { UserController } from "src/user/user.controller";
import { UserService } from "src/user/user.service";

@Module(
    {
        imports: [
            MongooseModule.forFeature([
                {
                    name: USER_MODEL,
                    schema: UserSchema,
                }
            ])
        ],
        controllers: [UserController],
        providers: [UserService],
    }
)
export class UserModule { }