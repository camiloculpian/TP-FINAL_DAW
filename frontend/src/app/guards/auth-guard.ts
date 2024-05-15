import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../components/login/login.service';
import { inject } from '@angular/core';
import { catchError, map } from 'rxjs';

// export const authGuard: CanActivateFn = (route, state) => {
//   if(inject(LoginService).isLoggedIn()){
//     console.log('ESTAS LOGUEADO');
//     return true;
//   }else{
//     console.log('NOESTAS LOGUEADO');
//     inject(Router).navigate(['/login']);
//     return false;
//   }
// };

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(LoginService);
  const router = inject(Router);
  return authService.isLoggedIn().pipe(
    map((resp) => {
      console.log('**OK!'+JSON.stringify(resp.data));
      localStorage.setItem('user', JSON.stringify(resp.data));
      return true
    }),
    catchError((err) => {
      console.log('**CUAK!'+JSON.stringify(err));
      console.log('**CUAK! NO estas autorizado a andar por aca!');
      localStorage.removeItem('user');
      return router.navigate(['/login']);
    })
  );
};
