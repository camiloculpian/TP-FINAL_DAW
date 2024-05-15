import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../components/login/login.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  if(inject(LoginService).isLoggedIn()){
    console.log('ESTAS LOGUEADO');
    return true;
  }else{
    console.log('NOESTAS LOGUEADO');
    inject(Router).navigate(['/login']);
    return false;
  }
};
