import { HttpInterceptorFn } from '@angular/common/http';
import { CurrentUser } from '../models/users';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const currentUser:CurrentUser = JSON.parse(String(localStorage.getItem('user')));;
  if (currentUser) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + currentUser.token),
    });
    return next(cloned);
  }
  return next(req);
};