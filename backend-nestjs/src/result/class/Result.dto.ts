import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class ResultDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any; //file
}
export class PartialTypeResult extends PartialType(ResultDto) {}
