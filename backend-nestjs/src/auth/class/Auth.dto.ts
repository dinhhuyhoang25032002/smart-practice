import { PartialType, ApiProperty, OmitType } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class RegisterDto {

    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
export class PartialTypeAuth extends PartialType(RegisterDto) { }

export class LoginDto extends OmitType(RegisterDto, ['fullname'] as const) { }