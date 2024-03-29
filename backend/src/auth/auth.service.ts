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
        if(     !this.usersServive.findOneByUsername(loginUserDto.username) 
                || !this.usersServive.findOneByDNI(loginUserDto.dni)
                || !this.usersServive.findOneByEmail(loginUserDto.email))
            {
                throw new UnauthorizedException('Invalid Credentials') //TO-DO: Controlar uno por uno y pasar el error puntual (Ej.: ese email ya esta en uso, etc...)
            }
    }
}
