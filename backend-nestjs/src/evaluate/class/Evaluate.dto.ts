import { ApiProperty ,PartialType} from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class EvaluateDto {

    @IsString()
    @IsNotEmpty()
    studentId: string;

    @IsString()
    @IsNotEmpty()
    lessonId: string;

    @IsString()
    @IsNotEmpty()
    score: string;

    @IsString()
    @IsNotEmpty()
    content: string;

}

export class PartialTypeResult extends PartialType(EvaluateDto) { } 