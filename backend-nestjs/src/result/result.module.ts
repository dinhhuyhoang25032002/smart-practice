import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ResultController } from 'src/result/result.controller';
import { ResultService } from 'src/result/result.service';
import { DEADLINE_MODEL, DeadlineSchema } from 'src/schema/deadline.schema';
import { RESULT_MODEL, ResultSchema } from 'src/schema/result.schema';
import { STARTTIME_MODEL, StartTimeSchema } from 'src/schema/starttime.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RESULT_MODEL,
        schema: ResultSchema,
      },
      {
        name: STARTTIME_MODEL,
        schema: StartTimeSchema,
      },
      {
        name: DEADLINE_MODEL,
        schema: DeadlineSchema,
      },
    ]),
  ],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule {}
