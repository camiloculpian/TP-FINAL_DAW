import { Component } from '@angular/core';
import { LoginService } from '../login/login.service';
import { User } from '../../models/users';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.css'
})
export class StatusBarComponent {
  // OBVIAMENTE ESTO LO TENEMOS QUE TOMAR DESDE EL USUARIO LOGUEADO!!!!
  currentUser:User|undefined=undefined;
  constructor(private loginService : LoginService) {

    this.currentUser = JSON.parse(String(loginService.getCurrentUser()));

  }

}
