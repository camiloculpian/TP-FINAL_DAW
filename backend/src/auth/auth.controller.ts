import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    register(
        @Body()
    ){
        return this.authService.register();
    }

    @Post('login')
    login(){
        return this.authService.login();
    }

}
