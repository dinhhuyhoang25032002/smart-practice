import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { JwtRefreshAuthGuard } from 'src/auth/guard/refreshToken.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @UseGuards(JwtAccessAuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
