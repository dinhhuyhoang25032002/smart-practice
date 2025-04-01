
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResultDto {
    
    @IsString()
    @IsNotEmpty()
    lessonId: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;//file
}
export class PartialTypeResult extends PartialType(ResultDto) { } 