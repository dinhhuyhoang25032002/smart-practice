import { Module } from "@nestjs/common";
import { SuperviceController } from "./supervice.controller";
import { SuperviceService } from "./supervice.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SUPERVICE_MODEL, SuperviceSchema } from "src/schema/supervise.schema";
import { LESSON_MODEL, LessonSchema } from "src/schema/lesson.schema";
import { TimeViewSchema, TIMEVIEW_MODEL } from "src/schema/timeview.schema";


@Module({
    imports: [
        MongooseModule.forFeature([
            {
                schema: TimeViewSchema,
                name: TIMEVIEW_MODEL
            },
            {
                schema: SuperviceSchema,
                name: SUPERVICE_MODEL
            },
            {
                schema: LessonSchema,
                name: LESSON_MODEL
            }
        ])
    ],
    controllers: [SuperviceController],
    providers: [SuperviceService]
})

export class SuperviceModule { };