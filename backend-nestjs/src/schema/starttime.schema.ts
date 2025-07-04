import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';
import { StatusLesson } from "src/constant/constant";

@Schema({ timestamps: true })
export class StartTime extends Document {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    studentId: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' })
    lessonId: string;

    @Prop({ required: true, enum: StatusLesson })
    status: StatusLesson;

    @Prop()
    startTime: string;

}

export const STARTTIME_MODEL = StartTime.name;
export const StartTimeSchema = SchemaFactory.createForClass(StartTime);
StartTimeSchema.index({ studentId: 1, lessonId: 1 }, { name: "STARTTIME_INDEX" })