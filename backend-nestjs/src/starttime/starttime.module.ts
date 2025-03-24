import { Module } from '@nestjs/common';
import { StarttimeController } from 'src/starttime/starttime.controller';
import { StarttimeService } from 'src/starttime/starttime.service';

@Module({
    imports: [],
    controllers: [StarttimeController],
    providers: [StarttimeService],
})
export class StarttimeModule {}
