import { Body, Controller, Post, UseGuards, Req, BadRequestException, HttpStatus, HttpCode, Get, Query } from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { EvaluateService } from 'src/evaluate/evaluate.service';
import { Request } from 'express';
import { type UserJWT } from 'src/types/CustomType';
import { EvaluateDto } from 'src/evaluate/class/Evaluate.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/constant/constant';
@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('evaluate')
export class EvaluateController {
    constructor(
        private readonly evaluateService: EvaluateService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createAEvaluation(
        @Body() body: EvaluateDto,
        @Req() req: Request
    ) {

        const { sub, role } = req.user as UserJWT;

        if (role !== UserRole.TEACHER) {
            return new BadRequestException("Quyền hạn không hợp lệ");
        }
        return this.evaluateService.handleCreateAEvaluation(sub, body)
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getEvaluation(
        @Query('studentId') studentId: string,
        @Query('lessonId') lessonId: string
    ) {
        return this.evaluateService.handleGetEvaluation(studentId, lessonId)
    }
}
