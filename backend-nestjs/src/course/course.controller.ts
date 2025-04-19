import { Controller, HttpCode, HttpStatus, Query, Get, Param, UseGuards, BadRequestException, Post, Body, Req, ForbiddenException, BadGatewayException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { CourseService } from 'src/course/course.service';
import { Request } from "express"
import { UserJWT } from 'src/types/CustomType';
import { ActiveCourseDto } from 'src/course/class/ActiveCourse.dto';
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
        @Req() req: Request,
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

    @Get("get-result")
    @HttpCode(HttpStatus.OK)
    async getAllResultACourse(
        @Query("slug") slug: string,
        @Query("studentId") studentId: string
    ) {
        return this.courseService.handleGetAllResultACourse(slug, studentId)
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

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiBody({ required: true, type: ActiveCourseDto })
    ActiveCourse(
        @Body() body: { code: string },
        @Req() req: Request
    ) {
        const user = req.user as UserJWT;
        if (!user) {
            return new ForbiddenException();
        }
        return this.courseService.handleActiveCourse(body, user);
    }
}
