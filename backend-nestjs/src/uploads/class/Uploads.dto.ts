import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ImageUploadsDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    mode: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    image: any;//file
}
export class PartialTypeUploads extends PartialType(ImageUploadsDto) { } 