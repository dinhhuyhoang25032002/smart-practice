import { PartialType } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsNumber } from "class-validator"


export class SuperviceDto {

    @IsString()
    @IsNotEmpty()
    lessonId: string

    @IsString()
    @IsNotEmpty()
    sectionId: string

}

export class PartialTypeSupervice extends PartialType(SuperviceDto) { }