import { Component } from '@angular/core';
import { LoginService } from '../../components/login/login.service';
import { Router, RouterOutlet } from '@angular/router';
import { StatusBarComponent } from '../../components/status-bar/status-bar.component';
import { AppMenuComponent } from '../../components/app-menu/app-menu.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, StatusBarComponent, AppMenuComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {
  private currentUser:{}|null=null;
  constructor(
    private router:Router,
    private loginService : LoginService
  ){
    try{
      this.loginService.isLoggedIn()?.subscribe({
          next: (resp) => {
            console.log('------------->**OK!'+JSON.stringify(resp.data));
            localStorage.setItem('user', JSON.stringify(resp.data));
            return true;
          },
          error: (err)  =>{
            console.log('MUST RETURN FALSE--------->**CUAK!'+JSON.stringify(err.error));
            console.log('**CUAK! NO estas autorizado a andar por aca!');
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
            return true;
          },
        })
    }catch(e){
      console.log('**CUAK! NO estas autorizado a andar por aca!');
      this.router.navigate(['/login']);
    }
  }
}
