import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { NotifyComponent } from './components/notify/notify.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { UsersComponent } from './components/users/users.component';
import { AuditsComponent } from './components/audits/audits.component';

export const routes: Routes = [
    
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginLayoutComponent },
    { path: 'app', component: AppLayoutComponent,
        children: [
            {path: 'users',component: UsersComponent},
            {path: 'tickets',component: TicketsComponent},
            {path: 'audits',component: AuditsComponent}
        ]
    },
    { path: 'notify', component: NotifyComponent}
];
