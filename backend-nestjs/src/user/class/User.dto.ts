import { PartialType } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class UserDto {
    
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    role: string;

    @IsString()
    @IsOptional()
    avatar: string;

    @IsString()
    @IsOptional()
    dateOfBirth: string;

    @IsString()
    @IsOptional()
    address: string;
}
export class PartialTypeUser extends PartialType(UserDto) { }
