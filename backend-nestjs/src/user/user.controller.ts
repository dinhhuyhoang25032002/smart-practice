import {
  Controller,
  HttpCode,
  Get,
  Query,
  HttpStatus,
  UseGuards,
  Req,
  ForbiddenException,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { UserJWT } from 'src/types/CustomType';
import { UserRole } from 'src/constant/constant';
import { SearchUserDto } from './class/User.dto';
@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserInfo(@Query('userId') userId: string) {
    return this.userService.handleGetUserInfo(userId);
  }

  @Get('all-user')
  @HttpCode(HttpStatus.OK)
  async getAllUser(@Query('increase') increase: boolean, @Req() req: Request) {
    const { role } = req.user as UserJWT;
    if (role !== UserRole.TEACHER) {
      return new ForbiddenException(FORBIDDEN_MESSAGE);
    }
    return this.userService.handleGetAllUser(increase);
  }

  @Post('search-user')
  async searchUser(@Body() body: SearchUserDto) {
    const { email } = body;
    return this.userService.handleSearchUser(email);
  }
}
