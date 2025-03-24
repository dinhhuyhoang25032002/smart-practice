import { Controller, Get, Query } from '@nestjs/common';
import { StarttimeService } from 'src/starttime/starttime.service';

@Controller('starttime')
export class StarttimeController {

    constructor(
        private readonly startTimeService: StarttimeService
    ) { }

    @Get()
    async getSlugLesson(
        @Query("name") name: string
    ) {
        return this.startTimeService.handleGetSlugLesson(name);
    }
}
