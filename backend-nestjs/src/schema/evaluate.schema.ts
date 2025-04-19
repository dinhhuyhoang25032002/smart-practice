import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class Evaluate extends Document {

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    studentId: ObjectId;

    @Prop({ required: true })
    teacherId: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' })
    lessonId: ObjectId;

    @Prop({ required: true })
    score: string;

    @Prop()
    content: string;

}
export const EVALUATE_MODEL = Evaluate.name;
export const EvaluateSchema = SchemaFactory.createForClass(Evaluate);
EvaluateSchema.index({ studentId: 1, lessonId: 1 }, { name: "INDEX_EVALUTION" })