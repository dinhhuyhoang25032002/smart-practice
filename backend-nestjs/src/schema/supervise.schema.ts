import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, ObjectId } from "mongoose"


@Schema({ timestamps: true })
export class Supervice extends Document {

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    lessonId: ObjectId

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    sectionId: Object

    @Prop({ type: mongoose.Schema.Types.Number })
    durationView: number

    @Prop({ type: mongoose.Schema.Types.Number })
    views: number


    createdAt: Date;  
    updatedAt: Date;
}

export const SUPERVICE_MODEL = Supervice.name;
export const SuperviceSchema = SchemaFactory.createForClass(Supervice)