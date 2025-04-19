import { BadRequestException, Controller, Req, Get, HttpCode, HttpStatus, Query, UseGuards, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { LessonService } from 'src/lesson/lesson.service';
import { Request } from 'express';
import { UserJWT } from 'src/types/CustomType';
import { LessonDto } from './class/Lesson.dto';
@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'isSeo', required: false, type: Boolean })
    async getLessonById(
        @Query('lessonId') lessonId: string,
        @Query('isSeo') seo: boolean,
        @Req() req: Request
    ) {
        const { sub, role } = req.user as UserJWT
        console.log(sub, role);

        if (!lessonId || !sub) {
            return new BadRequestException("Thiếu tham số quan trọng")
        }
        return this.lessonService.handleGetLessonById(lessonId, sub, role, seo);
    }

    @Get('/get-sections')
    @HttpCode((HttpStatus.OK))
    async getAllSectionALesson(@Query('lessonId') lessonId: string, @Query('userId') userId: string,) {
        if (!lessonId || !userId) {
            throw new BadRequestException();
        }
        return this.lessonService.handleGetAllSections(lessonId, userId);
    }
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createALesson(@Body() content: LessonDto) {
        return this.lessonService.handleCreateLesson(content);
    }
}
