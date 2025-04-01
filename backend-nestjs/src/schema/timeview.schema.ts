import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose"

@Schema({ timestamps: true })
export class TimeView extends Document {

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    lessonId: ObjectId

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
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