import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Request,
    UseGuards,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './auth.guard';

import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterUserDto } from '../auth/dto/registerUser.dto'; // Asegúrate de importar el DTO de registro

import { diskStorage } from 'multer'; // Importa diskStorage desde multer
import { extname } from 'path'; 

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @Post('register')
    // @UseInterceptors(FileInterceptor('profilePicture', {
    //     storage: diskStorage({
    //         destination: './uploads-profiles/profiles',
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
    //     try {
    //         if(file){
    //             registerUserDto.profilePicture = file.filename;
    //         }
    //         return this.authService.register(registerUserDto);
    //     } catch (error) {
    //         console.error('Error durante el registro:', error);
    //         throw new HttpException(
    //             {
    //                 status: HttpStatus.INTERNAL_SERVER_ERROR,
    //                 error: 'No se pudo completar el registro. Inténtalo de nuevo.',
    //             },
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }

    // FUNCA OKOK
    @Post('register')
    @UseInterceptors(FileInterceptor('profilePicture', {
        storage: diskStorage({
            destination: './uploads-profiles/profiles',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    async register(
        @Body() registerUserDto: RegisterUserDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        try {
            const result = await this.authService.register(registerUserDto);
            return { status: 'SUCCESS', data: result };
        } catch (error) {
            console.error('Error durante la registacion', error);
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: error.message,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }


    @Post('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
    ) {
        try {
            return await this.authService.login(loginUserDto);
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
            return { 'status': 'ERROR', 'message': error.message, 'statusCode': error.statusCode };
        }
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    async profile(
        @Request() req
    ) {
        try {
            return await this.authService.getProfile(req.user.sub);
        } catch (error) {
            console.error('Error al obtener el perfil:', error);
            return { 'status': 'ERROR', 'message': error.message, 'statusCode': error.statusCode };
        }
    }

}
