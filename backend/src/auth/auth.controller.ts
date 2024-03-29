import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

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

}
