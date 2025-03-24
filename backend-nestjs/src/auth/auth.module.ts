import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';

import { USER_MODEL, UserSchema } from 'src/schema/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: USER_MODEL,
                schema: UserSchema,
            },
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService,],
})
export class AuthModule { }
