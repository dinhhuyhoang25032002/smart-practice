import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommodityType, expireTime } from 'src/constant/constant';

@Schema({ timestamps: true })
export class Deadline extends Document {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Course" })
  productionId: string;

  @Prop({ required: true, enum: CommodityType, })
  productionType: CommodityType;

  @Prop({ type: mongoose.Schema.Types.Date })
  createdAt: Date;
}
export const DEADLINE_MODEL = Deadline.name;
export const DeadlineSchema = SchemaFactory.createForClass(Deadline);

DeadlineSchema.index({ createdAt: 1 }, { expireAfterSeconds: expireTime, unique: true, name: "INDEX_DEADLINE" });