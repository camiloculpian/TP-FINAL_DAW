import { Body, Controller, Get, Post, Request, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path'; 

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    // @Post('register')
    // @UseInterceptors(FileInterceptor('profilePicture', {
    //     storage: diskStorage({
    //         destination: './uploads/profiles',
    //         filename: (req, file, cb) => {
    //             const randomName = Array(32).fill(null).map(()=>(Math.round(Math.random()*16)).toString(16)).join('');
    //             return cb(null, `${randomName}${extname(file.originalname)}`);
    //         },
    //     }),
    // }))
    // register(
    //     @Body() registerUserDto: RegisterUserDto,
    //     @UploadedFile() file: Express.Multer.File,
    // ){
    //     if(file){
    //         registerUserDto.profilePicture = file.filename;
    //     }
    //     return this.authService.register(registerUserDto);
    // }

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
