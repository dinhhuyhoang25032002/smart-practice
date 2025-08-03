import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNegative,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

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
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  deadline: Date;

  @IsMongoId({ message: 'projectId must be a valid MongoDB ObjectId' })
  projectId: string;
}

export class InviteSteamMemberDto {
  @IsMongoId({ message: 'projectId must be a valid MongoDB ObjectId' })
  @IsNotEmpty()
  projectId: string;

  @IsMongoId({ message: 'memberId must be a valid MongoDB ObjectId' })
  @IsNotEmpty()
  memberId: string;

  @IsPositive({ message: 'teamNumber must be a positive number' })
  @Type(() => Number)
  teamNumber: number;

  @IsString()
  @IsNotEmpty()
  role: string;
}

export class PartialInviteSteamMemberDto extends PartialType(
  InviteSteamMemberDto,
) {
  @IsMongoId({ message: 'projectId must be a valid MongoDB ObjectId' })
  @IsNotEmpty()
  notificationId: string;
}

export class SubmitTaskDto {
  @IsMongoId({ message: '_id must be a valid MongoDB ObjectId' })
  @IsNotEmpty()
  _id: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  submitTime: Date;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any; //file
}
