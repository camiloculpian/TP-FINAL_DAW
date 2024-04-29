import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!user) {
      return null;
    }
    return data ? user[data] : user; // extraer una propiedad específica solo si se especifica o obtener un objeto de usuario
  },
);