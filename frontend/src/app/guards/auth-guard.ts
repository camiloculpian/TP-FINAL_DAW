import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../components/login/login.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  if(inject(LoginService).isLoggedIn()){
    console.log('NO ESTAS LOGUEADO');
    return true;
  }else{
    inject(Router).navigate(['/login']);
    return false;
  }
};
