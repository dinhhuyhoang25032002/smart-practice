import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EvaluateController } from 'src/evaluate/evaluate.controller';
import { EvaluateService } from 'src/evaluate/evaluate.service';
import { EVALUATE_MODEL, EvaluateSchema } from 'src/schema/evaluate.schema';
import { LESSON_MODEL, LessonSchema } from 'src/schema/lesson.schema';
import { RESULT_MODEL, ResultSchema } from 'src/schema/result.schema';
import { STARTTIME_MODEL, StartTimeSchema } from 'src/schema/starttime.schema';
import { USER_MODEL, UserSchema } from 'src/schema/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: EVALUATE_MODEL,
                schema: EvaluateSchema
            },
            {
                name: USER_MODEL,
                schema: UserSchema
            },
            {
                name: LESSON_MODEL,
                schema: LessonSchema
            },
            {
                name: STARTTIME_MODEL,
                schema: StartTimeSchema
            },
            {
                name: RESULT_MODEL,
                schema: ResultSchema,
            },
        ])
    ],
    controllers: [EvaluateController],
    providers: [EvaluateService],
})
export class EvaluateModule { }
