import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class ActiveCourseDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class CreateCourseDto {

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    video?: string;

    @IsString()
    @IsNotEmpty()
    price: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}