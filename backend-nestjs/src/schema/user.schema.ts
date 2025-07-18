import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  fullname: string;

  @Prop()
  class: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Steam' }] })
  projects: Array<string>;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: false })
  dateOfBirth: string;

  @Prop()
  avatar: string;
}

export const USER_MODEL = User.name;
export const UserSchema = SchemaFactory.createForClass(User);
