import { Controller, HttpCode, HttpStatus, Query, Get, Param, UseGuards, BadRequestException, Post, Body, Req, ForbiddenException, BadGatewayException, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { CourseService } from 'src/course/course.service';
import { Request } from "express"
import { UserJWT } from 'src/types/CustomType';
import { ActiveCourseDto, CreateCourseDto } from 'src/course/class/ActiveCourse.dto';
import { UserRole } from 'src/constant/constant';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
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

    @Get("all-course")
    @HttpCode(HttpStatus.OK)
    async getAllCourseByTeacher(
        @Req() req: Request
    ) {
        const { role } = req.user as UserJWT
        if (role !== UserRole.TEACHER) {
            return new BadRequestException();
        }
        return this.courseService.handleGetAllCourseByTeacher()
    }

    @Get('search-name')
    @HttpCode(HttpStatus.OK)
    async getNameCourses(@Query('name') name: string) {
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
    async ActiveCourse(
        @Body() body: { code: string },
        @Req() req: Request
    ) {
        const user = req.user as UserJWT;
        if (!user) {
            return new ForbiddenException();
        }
        return this.courseService.handleActiveCourse(body, user);
    }

    @Post("create-course")
    @UseInterceptors(FileInterceptor("image"))
    @ApiConsumes('multipart/form-data')
    @HttpCode(HttpStatus.CREATED)
    async createACourse(
        @Body() body: CreateCourseDto,
        @UploadedFile() image: Express.Multer.File,
    ) {
        console.log(image);

        return this.courseService.handleCreateACourse(body, image);
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async DeleteCourse(@Query('_id') _id: string) {
        return this.courseService.handleDeleteCourse(_id);
    }
}
