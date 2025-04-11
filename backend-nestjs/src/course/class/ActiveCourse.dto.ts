import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ActiveCourseDto {
    @IsString()
    @IsNotEmpty()
    code: string;
}