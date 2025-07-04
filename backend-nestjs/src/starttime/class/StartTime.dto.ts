
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class StartTimeDto {

    @IsString()
    @IsNotEmpty()
    lessonId: string;

    @IsString()
    @IsNotEmpty()
    studentId: string;

    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsNotEmpty()
    status: string;
}
export class PartialTypeResult extends PartialType(StartTimeDto) { } 