import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
@Schema({ _id: false, timestamps: true }) // _id: false để Mongoose không tự tạo _id cho object con này
export class MemberItem extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  memberId: string; // hoặc mongoose.Types.ObjectId

  @Prop({ type: Number, required: true })
  teamNumber: number;

  @Prop({ required: true })
  role: string;
}

export const MemberItemSchema = SchemaFactory.createForClass(MemberItem);
@Schema({ timestamps: true })
export class Steam extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  leader: string;

  @Prop({
    type: [MemberItemSchema],
    default: [],
  })
  listMember: MemberItem[];

  @Prop()
  description: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;
}

export const STEAM_MODEL = Steam.name;
export const SteamSchema = SchemaFactory.createForClass(Steam);
