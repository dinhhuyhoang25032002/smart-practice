import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { TimeviewService } from './timeview.service';
import { TimeViewDto } from './class/TimeView.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
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
        @Body() body: TimeViewDto
    ) {
        return this.timeViewService.handleCreateTimeView(body)
    }

}
