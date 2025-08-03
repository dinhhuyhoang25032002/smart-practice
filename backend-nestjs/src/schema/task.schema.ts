import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { STATUS_TASK } from 'src/constant/constant';
interface PopulatedImplementer {
  _id: string; // Mongoose luôn trả về _id
  email: string;
  fullname: string;
}
interface PopulatedProject {
  _id: string;
  name: string;
}
export type PopulatedTask = Omit<Task, 'implementer' | 'projectId'> & {
  implementer: PopulatedImplementer;
  projectId: PopulatedProject;
};
// Type cho 'projectId' sau khi populate và select
@Schema()
class File {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Date })
  submitTime: string;

  @Prop()
  status: string;
}

const FileSchema = SchemaFactory.createForClass(File);
@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  implementer: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Date })
  startDate: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Date })
  deadline: string;

  @Prop({ type: mongoose.Schema.Types.Date })
  completeTime: string;

  @Prop({ type: mongoose.Schema.Types.Date })
  startTime: string;

  @Prop()
  description: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: [FileSchema] })
  file: File[];

  @Prop({ enum: STATUS_TASK, required: true })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  creator: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Steam', required: true })
  projectId: string;

  @Prop()
  nameFile: string;
}
export const TASK_MODEL = Task.name;
export const TaskSchema = SchemaFactory.createForClass(Task);
