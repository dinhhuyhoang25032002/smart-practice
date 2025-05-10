import {
    IsNotEmpty,
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
    @IsNotEmpty()
    video: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsNotEmpty()
    price: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;
}