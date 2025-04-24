import { Body, Controller, Post, Res, Req, UseGuards, HttpCode, HttpStatus, Get, BadRequestException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Response, Request } from 'express';
import { JwtRefreshAuthGuard } from 'src/auth/guard/refreshToken.guard';
import { LoginDto, RegisterDto } from 'src/auth/class/Auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async Register(
        @Body() data: RegisterDto
    ) {
        return this.authService.handleRegister(data);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async Login(
        @Body() data: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { email, password } = data;
        if (!email || !password) {
            return new BadRequestException("Thiếu tham số quan trọng")
        }
        
        return this.authService.handleLogin(data, res);
    }

    @UseGuards(JwtRefreshAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('refresh-token')
    async refreshToken(@Req() req: Request) {
        const jwt = req.user as { sub: string; role: string }
        return this.authService.refreshToken(jwt);
    }

    @HttpCode(HttpStatus.OK)
    @Get('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        // res.cookie('token', "",
        //     { httpOnly: true, secure: true, sameSite: "none", partitioned: true });
        res.clearCookie("token", {
            httpOnly: true, secure: true, sameSite: "none", partitioned: true
        })
        return { message: 'Logged out succefully' };
    }

}
