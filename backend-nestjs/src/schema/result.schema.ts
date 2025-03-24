import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class Result extends Document {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    studentId: ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true })
    lessonId: ObjectId;

    @Prop()
    content: string;

    @Prop({ type: mongoose.Schema.Types.Boolean, default: false, required: true })
    isEvaluated: boolean;
}
export const RESULT_MODEL = Result.name;
export const ResultSchema = SchemaFactory.createForClass(Result);