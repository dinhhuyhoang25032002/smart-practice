import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from "@nestjs/common";
import { SuperviceService } from "./supervice.service";
import { SuperviceDto } from "./class/Supervice.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAccessAuthGuard } from "src/auth/guard/accessToken.guard";

@ApiBearerAuth()
@UseGuards(JwtAccessAuthGuard)
@Controller("supervise")
export class SuperviceController {
    constructor(
        private readonly superviceService: SuperviceService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOrUpdateSupervice(
        @Body() body: SuperviceDto
    ) {

        return this.superviceService.hanldeCreateAndUpdateSupervice(body)
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getTimeDurationACourse(
        @Query("studentId") studentId: string,
        @Query("courseId") courseId: string
    ) {
        return this.superviceService.handleGetTimeDurationACourse(studentId,courseId)
    }
}