import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TimeViewDto {

    @IsString()
    @IsNotEmpty()
    lessonId: string

    @IsNotEmpty()
    @IsString()
    sectionId: string

    @IsOptional()
    @IsString()
    startTimeView: string

    @IsOptional()
    @IsString()
    endTimeView: string
}
export class PartialTypeTimeView extends PartialType(TimeViewDto) { }