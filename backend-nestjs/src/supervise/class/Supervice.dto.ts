import { PartialType } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsNumber } from "class-validator"

export class SuperviceDto {

    @IsString()
    @IsNotEmpty()
    lessonId: string

    @IsString()
    @IsNotEmpty()
    sectionId: string


    @IsString()
    @IsNotEmpty()
    studentId: string
}

export class PartialTypeSupervice extends PartialType(SuperviceDto) { }