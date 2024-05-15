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
      localStorage.setItem('user', JSON.stringify(resp.data));
      return true
    }),
    catchError(() => {
      return router.navigate(['/login']);
    })
  );
};
