import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TYPE_NOTIFICATIOIN } from 'src/constant/constant';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Steam' })
  projectId: string;

  @Prop({ type: Object })
  content: {
    teamNumber: number;
    role: string;
    projectId: string;
    link: string;
  };

  @Prop({ required: true, enum: TYPE_NOTIFICATIOIN })
  type: TYPE_NOTIFICATIOIN;

  @Prop()
  message: string;

  @Prop()
  status: string;
}

export const NOTIFICATION_MODEL = Notification.name;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
