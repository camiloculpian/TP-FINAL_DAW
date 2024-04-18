import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    register(
        @Body()
        registerUserDto : RegisterUserDto
    ){
        return this.authService.register(registerUserDto);
    }

    @Post('login')
    login(
        @Body()
        loginUserDto: LoginUserDto,
    ){
        return this.authService.login(loginUserDto);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    profile(
        @Request()
        req
    ){
        return this.authService.getProfile(req.user.sub);
    }
}
