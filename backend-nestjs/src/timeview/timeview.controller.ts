import { Body, Controller, Get, Req, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { TimeviewService } from './timeview.service';
import { TimeViewDto } from './class/TimeView.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { Request } from 'express';
import { UserJWT } from 'src/types/CustomType';
@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('timeview')
export class TimeviewController {

    constructor(
        private readonly timeViewService: TimeviewService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createTimeView(
        @Body() body: TimeViewDto,
        @Req() req: Request
    ) {
        const { sub } = req.user as UserJWT
        return this.timeViewService.handleCreateTimeView(body, sub)
    }


    @Get()
    @HttpCode(HttpStatus.OK)
    async getTimeview() {

    }
}
