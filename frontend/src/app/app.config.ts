import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LoginService } from './components/login/login.service';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    //importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    {provide: LoginService}
  ]
};
