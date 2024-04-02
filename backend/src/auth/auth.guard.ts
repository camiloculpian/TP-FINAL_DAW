import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor( private readonly jwtService: JwtService, ){}

  async canActivate( context: ExecutionContext ): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest();
    const token = this.extraxctTokenFromHeader(request);
    if(!token){
      throw new UnauthorizedException();
    }
    try{
      const payload = await this.jwtService.verifyAsync(token, {secret: jwtConstants.secret})
      request ['user'] = payload;
    }catch{
      throw new UnauthorizedException();
    }
    return true;
  }

  private extraxctTokenFromHeader(request: Request): string | undefined{
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
