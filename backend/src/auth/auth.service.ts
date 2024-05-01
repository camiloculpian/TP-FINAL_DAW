import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
    HttpStatus,
    HttpException
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersServive: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    // async register(registerUserDto: RegisterUserDto){
    //     try{
    //         if(this.usersServive.findOneByUsername(registerUserDto.username)
    //             || this.usersServive.findOneByDNI(registerUserDto.dni)
    //             || this.usersServive.findOneByEmail(registerUserDto.email))
    //         {
    //             throw new BadRequestException('User already exists!') //TO-DO: Conyarntrolar uno por uno y pasar el error puntual (Ej.: ese email ya esta en uso, etc...)
    //         }
    //         return await this.usersServive.create(registerUserDto);
    //     }catch (e){
    //         return e;
    //     }
    // }

    // FUNCA OKOK
    async register(registerUserDto: RegisterUserDto) {
        try {
            const existingUserByUsername = await this.usersServive.findOneByUsername(registerUserDto.username);
            const existingUserByDNI = await this.usersServive.findOneByDNI(registerUserDto.dni);
            const existingUserByEmail = await this.usersServive.findOneByEmail(registerUserDto.email);

            if (existingUserByUsername) {
                throw new BadRequestException('Username already exists!');
            }

            if (existingUserByDNI) {
                throw new BadRequestException('DNI already exists!');
            }

            if (existingUserByEmail) {
                throw new BadRequestException('Email already exists!');
            }

            return await this.usersServive.create(registerUserDto);

        } catch (error) {
            //console.error('Error durante la registracion:', error);
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Registración No completada,  Existe un usuario con el mismo usuario email y dni. Intentar de nuevo.',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    async login(loginUserDto: LoginUserDto) {
        let user = await this.usersServive.findOneByUsernameAndPasswd(
            loginUserDto.username,
            loginUserDto.password,
        );
        if (!user) {
            let userBy = await this.usersServive.findOneByEmail(
                loginUserDto.username,
            );
            if (userBy) {
                user = await this.usersServive.findOneByUsernameAndPasswd(
                    userBy?.user.username,
                    loginUserDto.password,
                );
            } else {
                userBy = await this.usersServive.findOneByDNI(loginUserDto.username);
                if (userBy) {
                    user = await this.usersServive.findOneByUsernameAndPasswd(
                        userBy?.user.username,
                        loginUserDto.password,
                    );
                }
            }
        }
        if (user) {
            const payload = { sub: user.id };
            const token = await this.jwtService.signAsync(payload);
            return {
                nombre: user.person.name + ' ' + user.person.lastName,
                username: user.username,
                rol: user.rol,
                token: token,
            };
        } else {
            throw new UnauthorizedException('Invalid Credentials');
        }
    }

    async getProfile(userId: number) {
        return await this.usersServive.findOne(userId);
    }
}
