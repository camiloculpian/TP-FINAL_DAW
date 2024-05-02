import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { responseStatus } from 'src/common/responses/responses';

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

    async login(loginUserDto: LoginUserDto) {
        try{
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
                new UnauthorizedException({status:responseStatus.UNAUTH,message:'Credenciales invalidas'});
            }
        }catch(e){
            throw e;
        }
        
    }

    async getProfile(userId: number) {
        try{
            return await this.usersServive.findOne(userId);
        }catch (e){
            throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
        }
    }
}
