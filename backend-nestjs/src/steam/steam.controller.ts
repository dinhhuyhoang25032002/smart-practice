import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SteamService } from './steam.service';
import {
  CreateSteamProjectDto,
  CreateSteamTaskDto,
  InviteSteamMemberDto,
  PartialInviteSteamMemberDto,
} from './class/steam.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/auth/guard/accessToken.guard';
import { Request } from 'express';
import { UserJWT } from 'src/types/CustomType';
@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller('steam')
export class SteamController {
  constructor(private readonly steamService: SteamService) {}

  @Get('get-steam-project-list')
  async getSteamProjects(@Req() req: Request) {
    const { sub } = req.user as UserJWT;
    return this.steamService.handleGetSteamProjects(sub);
  }

  @Get('get-steam-tasks')
  async getSteamTasks(
    @Req() req: Request,
    @Query('projectId') projectId: string,
  ) {
    const { sub } = req.user as UserJWT;
    return this.steamService.handleGetSteamTasks(sub, projectId);
  }

  @Get(':id')
  async getSteamProjectDetail(@Param('id') id: string) {
    return this.steamService.handleGetSteamProjectDetail(id);
  }

  @Post('create-steam-project')
  async createSteamProject(
    @Body() body: CreateSteamProjectDto,
    @Req() req: Request,
  ) {
    const { sub } = req.user as UserJWT;
    return this.steamService.handleCreateSteamProject(body, sub);
  }

  @Post('create-steam-task')
  async createSteamTask(@Body() body: CreateSteamTaskDto, @Req() req: Request) {
    const { sub } = req.user as UserJWT;
    return this.steamService.handleCreateSteamTask(body, sub);
  }

  @Post('invite-steam-member')
  async inviteSteamMember(
    @Body()
    body: InviteSteamMemberDto,
    @Req() req: Request,
  ) {
    const { sub } = req.user as UserJWT;

    return this.steamService.handleInviteSteamMember(body, sub);
  }

  @Post('access-steam-project')
  async accessSteamProject(
    @Body() body: PartialInviteSteamMemberDto,
    @Req() req: Request,
  ) {
    const { sub } = req.user as UserJWT;
    return this.steamService.handleAccessSteamProject(sub, body);
  }

  @Post('assign-steam-task')
  async assignSteamTask(
    @Body() body: { taskId: string; memberId: string; projectId: string },
    @Req() req: Request,
  ) {
    const { sub } = req.user as UserJWT;
    return this.steamService.handleAssignSteamTask(sub, body);
  }
}
