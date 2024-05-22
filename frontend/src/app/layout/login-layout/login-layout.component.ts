import { Component } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [LoginComponent,HeaderComponent,FooterComponent],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.css'
})
export class LoginLayoutComponent {

}
