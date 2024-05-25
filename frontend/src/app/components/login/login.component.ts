import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { sha512 } from 'js-sha512';
import { LoginService } from './login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  message: string = '';
  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private router: Router, private loginService: LoginService) {}

  onUsernameChange() {
    this.message = '';
  }

  onPasswordChange() {
    if (this.userForm.value.username) {
      this.message = '';
    }
  }

  onSubmit() {
    if (!this.userForm.value.username || !this.userForm.value.password) {
      this.showErrorMessage(
        'Por favor, complete todos los campos antes de iniciar sesión.'
      );
    } else {
      this.loginService
        .logIn(
          String(this.userForm.value.username),
          sha512(String(this.userForm.value.password))
        )
        .subscribe({
          next: (resp) => {
            if (resp.statusCode == 201) {
              localStorage.setItem('user', JSON.stringify(resp.data));
              this.router.navigate(['/app']);
            }
          },
          error: (err) => {
            console.log('**ERROR! ' + JSON.stringify(err.error));
            this.showErrorMessage(err.error.message);
          },
        });
    }
  }

  showErrorMessage(errorMessage: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
  }
}
