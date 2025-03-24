import { PartialType, ApiProperty } from '@nestjs/swagger';
import {
  
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { CommodityType } from 'src/constant/constant';

export class DealineDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productionId: string;

    @ApiProperty({ enum: CommodityType })
    @IsString()
    @IsNotEmpty()
    productionType: CommodityType;

}
export class PartialTypeAuth extends PartialType(DealineDto) { }
