import { RouterModule, Routes } from '@angular/router';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { NotifyComponent } from './components/notify/notify.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { UsersComponent } from './components/users/users.component';
import { AuditsComponent } from './components/audits/audits.component';
import { NgModule } from '@angular/core';
import { authGuard, authGuardAdmin } from './guards/auth-guard';

export const routes: Routes = [
    
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginLayoutComponent },
    { path: 'app', component: AppLayoutComponent, 
        canActivate: [authGuard],
        children: [
            {path: 'users',component: UsersComponent},
            {path: 'tickets',component: TicketsComponent},
            {path: 'audits',component: AuditsComponent,canActivate: [authGuardAdmin]}
        ]
    },
    { path: 'notify', component: NotifyComponent},
    {
        path: '**',
        redirectTo:'login'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }