import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop()
  content: string;

  @Prop()
  status: string;
}

export const NOTIFICATION_MODEL = Notification.name;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
