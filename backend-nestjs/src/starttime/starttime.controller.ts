import { Controller, Get, Query } from '@nestjs/common';
import { StarttimeService } from 'src/starttime/starttime.service';

@Controller('starttime')
export class StarttimeController {

    constructor(
        private readonly startTimeService: StarttimeService
    ) { }

    @Get()
    async getStartTime(
        @Query("userId") userId: string,
        @Query("lessonId") lessonId: string,
    ) {
        return this.startTimeService.handleGetStartTime(userId, lessonId);
    }
}
