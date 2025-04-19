import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose"

@Schema({ timestamps: true })
export class TimeView extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' })
    lessonId: ObjectId

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' })
    sectionId: ObjectId

    @Prop({ required: true })
    startTimeView: string

    @Prop({ required: true, type: mongoose.Schema.Types.Boolean, default: false })
    isEnd: boolean

    @Prop()
    endTimeView: string
}

export const TIMEVIEW_MODEL = TimeView.name;
export const TimeViewSchema = SchemaFactory.createForClass(TimeView)
TimeViewSchema.index({ userId: 1, lessonId: 1, sectionId: 1 }, { name: "TIMEVIEW_INDEX" })