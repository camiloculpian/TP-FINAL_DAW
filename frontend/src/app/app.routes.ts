import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginLayoutComponent }
];
