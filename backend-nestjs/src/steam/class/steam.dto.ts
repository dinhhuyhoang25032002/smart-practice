import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSteamProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}

export class CreateSteamTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  createdDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  deadline: Date;

  @IsMongoId({ message: 'projectId must be a valid MongoDB ObjectId' })
  projectId: string;
}
