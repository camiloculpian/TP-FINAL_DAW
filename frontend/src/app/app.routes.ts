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
import { AccountComponent } from './components/account/account.component';

export const routes: Routes = [
    
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginLayoutComponent },
    { path: 'app', component: AppLayoutComponent, 
        canActivate: [authGuard],
        children: [
            {path: 'account',component: AccountComponent, canActivate: [authGuard]},
            {path: 'users',component: UsersComponent, canActivate: [authGuard]},
            {path: 'tickets',component: TicketsComponent, canActivate: [authGuard]},
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