import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";
import { StatusAttendance } from "src/constant/constant";
import mongoose, { Document } from "mongoose"
@Schema({ timestamps: true })
export class Attendance extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    studentId: string;

    @Prop({ required: true })
    time: string;

    @Prop({ required: true })
    shift: string;

    @Prop({ required: true })
    day: string;

    @Prop({ required: true, enum: StatusAttendance, })
    status: StatusAttendance;
}
export const ATTENDANCE_MODEL = Attendance.name;
export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
AttendanceSchema.index({ studentId: 1, day: 1 }, { name: "INDEX_ATTENDANCE" });