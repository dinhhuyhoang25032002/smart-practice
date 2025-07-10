import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { STATUS_TASK } from 'src/constant/constant';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  implementer: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  receiptDate: string;

  @Prop()
  submitTime: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  deadline: string;

  @Prop()
  startTime: string;

  @Prop()
  description: string;

  @Prop({ enum: STATUS_TASK, required: true })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  creator: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Steam', required: true })
  projectId: string;
}
export const TASK_MODEL = Task.name;
export const TaskSchema = SchemaFactory.createForClass(Task);
