import { Component } from '@angular/core';
import { LoginService } from '../login/login.service';
import { CurrentUser } from '../../dto/users';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.css'
})
export class StatusBarComponent {
  currentUser:CurrentUser|undefined=undefined;
  constructor(
    private router:Router,
    private loginService : LoginService
  ) {

    this.currentUser = JSON.parse(String(loginService.getCurrentUser()));

  }

  logOut(){
    this.loginService.logOut();
    this.currentUser = undefined;
    this.router.navigate(['']);
  }

}
