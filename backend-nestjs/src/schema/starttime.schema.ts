import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { StatusLesson } from "src/constant/constant";

@Schema({ timestamps: true })
export class StartTime extends Document {

    @Prop()
    studentId: string;

    @Prop()
    lessonId: string;

    @Prop({ required: true, enum: StatusLesson })
    status: StatusLesson;

    @Prop()
    startTime: string;

}

export const STARTTIME_MODEL = StartTime.name;
export const StartTimeSchema = SchemaFactory.createForClass(StartTime);