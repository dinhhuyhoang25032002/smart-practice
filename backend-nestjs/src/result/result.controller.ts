import { Request } from 'express';
import { Controller, Req, Post, UploadedFile, UseGuards, UseInterceptors, Query, BadRequestException, HttpCode, Body, ForbiddenException, HttpStatus, Get } from '@nestjs/common';
import { FileInterceptor, } from '@nestjs/platform-express';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { ResultService } from 'src/result/result.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ResultDto } from 'src/result/class/Result.dto';
import { UserJWT } from 'src/types/CustomType';
import { UserRole } from 'src/constant/constant';
import path from 'path';
import fs, { promises } from "fs"
@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('result')
export class ResultController {
    constructor(
        private readonly resultService: ResultService
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor("file"))
    @HttpCode((HttpStatus.CREATED))
    async createResultLesson(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
        @Body() body: ResultDto,
    ) {
        const { sub, role } = req.user as UserJWT
        const { lessonId } = body;


        if (!lessonId || !sub) {
            return new BadRequestException("Thiếu tham số quan trọng!")
        }

        if (role !== UserRole.STUDENT) {
            const filePath = path.join('./upload', file.filename)
            console.log(filePath);
            if (fs.existsSync(filePath)) {
                try {
                    await promises.unlink(filePath)
                } catch (error) {
                    console.error('Error deleting file:', error);
                }
            }
            return new ForbiddenException("Quyền hạn không hợp lệ!")
        }

        const data = {
            sub, lessonId
        }

        return this.resultService.handleCreateResultLesson(data, file)
    }


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
