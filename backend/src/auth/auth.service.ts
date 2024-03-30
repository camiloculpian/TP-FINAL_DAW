import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersServive: UsersService){}

    async register(registerUserDto: RegisterUserDto){
        try{
            if(this.usersServive.findOneByUsername(registerUserDto.username) 
                || this.usersServive.findOneByDNI(registerUserDto.dni)
                || this.usersServive.findOneByEmail(registerUserDto.email))
            {
                throw new BadRequestException('User already exists!') //TO-DO: Controlar uno por uno y pasar el error puntual (Ej.: ese email ya esta en uso, etc...)
            }
            return await this.usersServive.create(registerUserDto);
        }catch (e){
            return e;
        }
    }

    async login(loginUserDto: LoginUserDto){
        let user = await this.usersServive.findOneByUsername(loginUserDto.username);
        if(!user){
            user = await this.usersServive.findOneByDNI(loginUserDto.username);
            if(!user){
                user = await this.usersServive.findOneByEmail(loginUserDto.username);
                if(!user){
                    throw new UnauthorizedException('Invalid Credentials');
                }
            }
        }
        if(user && user.password == loginUserDto.password || user.user.password == loginUserDto.password ){
            if(user.user){
                return ({
                    username:user.user.username,
                    rol:user.user.rol
                });
            }else{ 
                return ({
                    username:user.username,
                    rol:user.rol
                });
            }
        }else{
            throw new UnauthorizedException('Invalid Credentials');
        }
    }
}
