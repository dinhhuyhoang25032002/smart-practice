import { Request } from 'express';
import { Controller, Req, Post, UploadedFile, UseGuards, UseInterceptors, Query, BadRequestException, HttpCode, Body, ForbiddenException, HttpStatus, Get } from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { ResultService } from 'src/result/result.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ResultDto } from 'src/result/class/Result.dto';
import { UserJWT } from 'src/types/CustomType';
import { UserRole } from 'src/constant/constant';

@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('result')
export class ResultController {
    constructor(
        private readonly resultService: ResultService
    ) { }

    @Get("/all-results")
    @HttpCode((HttpStatus.OK))
    async getAllResultByStudentId(
        @Query('studentId') studentId: string
    ) {
        if (!studentId) {
            return new BadRequestException("Thiếu tham số quan trọng!")
        }
        return this.resultService.handleGetAllResultByStudentId(studentId);
    }

    @Get()
    @HttpCode((HttpStatus.OK))
    async getOneResult(
        @Query('studentId') studentId: string,
        @Query('lessonId') lessonId: string
    ) {
        if (!studentId || !lessonId) {
            return new BadRequestException("Thiếu tham số quan trọng!")
        }
        return this.resultService.handleGetOneResult(studentId, lessonId);
    }

}
