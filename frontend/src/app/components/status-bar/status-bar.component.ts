import { Component } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.css'
})
export class StatusBarComponent {
  // OBVIAMENTE ESTO LO TENEMOS QUE TOMAR DESDE EL USUARIO LOGUEADO!!!!
  currentUser:{}|null={};
  constructor(private loginService : LoginService) {
    this.currentUser = JSON.parse(String(loginService.getCurrentUser()));
  }

}
