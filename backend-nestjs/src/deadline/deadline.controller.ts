import { Body, Controller, Req, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { DealineDto } from 'src/deadline/class/Dealine.dto';
import { DeadlineService } from 'src/deadline/deadline.service';
import { Request } from 'express';
import { UserJWT } from 'src/types/CustomType';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('deadline')
export class DeadlineController {
    constructor(
        private readonly deadlineService: DeadlineService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    createDeadline(
        @Body() data: DealineDto,
        @Req() req: Request
    ) {
        const user = req.user as UserJWT
        return this.deadlineService.handleCreateDeadline(data, user.sub);
    }
}
