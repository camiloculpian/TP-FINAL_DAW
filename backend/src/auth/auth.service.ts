import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { responseStatus } from '../common/responses/responses';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersServive: UsersService,
        private readonly jwtService: JwtService,
        private readonly i18n: I18nService
    ) { }

    // FUNCA OKOK
    async register(registerUserDto: RegisterUserDto) {
        try {
            const existingUserByUsername = await this.usersServive.findOneByUsername(registerUserDto.username);
            const existingUserByDNI = await this.usersServive.findOneByDNI(registerUserDto.dni);
            const existingUserByEmail = await this.usersServive.findOneByEmail(registerUserDto.email);

            if (existingUserByUsername) {
                throw new BadRequestException(this.i18n.t('lang.auth.UsernameError',{ lang:   I18nContext.current().lang }));
            }

            if (existingUserByDNI) {
                throw new BadRequestException(this.i18n.t('lang.auth.DNIError',{ lang:   I18nContext.current().lang }));
            }

            if (existingUserByEmail) {
                throw new BadRequestException(this.i18n.t('lang.auth.mailError',{ lang:   I18nContext.current().lang }));
            }
            return await this.usersServive.create(registerUserDto);
        } catch (e) {
            if(e instanceof BadRequestException){
                throw e;
            }else{
                throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
            }
        }
    }


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
                    roles: user.roles,
                    token: token,
                };
            } else {
                throw new UnauthorizedException({status:responseStatus.UNAUTH,message:this.i18n.t('lang.auth.WrongLogin',{ lang:   I18nContext.current().lang })});
            }
        }catch(e){
            console.log(e);
            if(e instanceof BadRequestException || e instanceof UnauthorizedException){
                throw e;
            }else{
                throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
            }
        }
        
    }

    async getProfile(userId: number) {
        try{
            return await this.usersServive.findOne(userId);
        }catch (e){
            if(e instanceof BadRequestException || e instanceof UnauthorizedException){
                throw e;
            }else{
                throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
            }
        }
    }

    async getUser(userId: number){
        try{
            const payload = { sub: userId };
            const token = await this.jwtService.signAsync(payload);
            let user = await this.usersServive.findOne(userId);
            return {
                nombre: user.person.name + ' ' + user.person.lastName,
                username: user.username,
                roles: user.roles,
                token: token,
            }
        }catch (e){
            if(e instanceof BadRequestException || e instanceof UnauthorizedException){
                throw e;
            }else{
                throw new InternalServerErrorException({status:responseStatus.ERROR,message:e.message});
            }
        }
    }
}
