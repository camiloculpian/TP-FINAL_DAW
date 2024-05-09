import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { NotifyComponent } from './components/notify/notify.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

export const routes: Routes = [
    
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginLayoutComponent },
    { path: 'app', component: AppLayoutComponent },
    { path: 'notify', component: NotifyComponent}
];
