import { Module } from '@nestjs/common';
import { SteamController } from './steam.controller';
import { SteamService } from './steam.service';
import { MongooseModule } from '@nestjs/mongoose';
import { STEAM_MODEL, SteamSchema } from 'src/schema/steam.schema';
import { USER_MODEL, UserSchema } from 'src/schema/user.schema';
import { TASK_MODEL, TaskSchema } from 'src/schema/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: STEAM_MODEL, schema: SteamSchema },
      {
        name: USER_MODEL,
        schema: UserSchema,
      },
      {
        name: TASK_MODEL,
        schema: TaskSchema,
      },
    ]),
  ],
  controllers: [SteamController],
  providers: [SteamService],
})
export class SteamModule {}
