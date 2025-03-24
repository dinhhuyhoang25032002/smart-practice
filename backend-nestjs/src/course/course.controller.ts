import { Controller, HttpCode, HttpStatus, Query, Get, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { CourseService } from 'src/course/course.service';

@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('course')
    
export class CourseController {

    constructor(
        private readonly courseService: CourseService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllCourseById(
        @Query("userId") userId: string
    ) {
        return this.courseService.handleGetAllCourseById(userId);
    }

    @Get('search-name')
    @HttpCode(HttpStatus.OK)
    getNameCourses(@Query('name') name: string) {
        if (!name) {
            return new BadRequestException('Missing require parameter: nameCourse!');
        }
        return this.courseService.getCourseByName(name);
    }

    @Get(":slug")
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'isActive', required: false, type: Boolean })
    @ApiQuery({ name: 'isSeo', required: false, type: Boolean })
    async findOneCourse(
        @Param('slug') slug: string,
        @Query('isActive') query?: boolean,
        @Query('isSeo') seo?: boolean,
    ) {
        return this.courseService.findOneCourse(slug, query, seo);
    }

}
