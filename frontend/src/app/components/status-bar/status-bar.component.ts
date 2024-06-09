import { Component,  inject} from '@angular/core';
import { LoginService } from '../login/login.service';
import { CurrentUser } from '../../dto/users';
import { Router, RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DecimalPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbCollapseModule, RouterOutlet, RouterModule, NgIf],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.css'
})
export class StatusBarComponent {
  currentUser:CurrentUser|undefined=undefined;
  public authService = inject(LoginService);
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

  isCollapsed = true;

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
    
  }
}


