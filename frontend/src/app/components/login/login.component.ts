import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { sha512 } from 'js-sha512';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  message:string = '';
  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private router:Router,
    private loginService : LoginService
  ) {}

  onUsernameChange(){
    this.message='';
  }

  onPasswordChange(){
    if(this.userForm.value.username){
      this.message='';
    }
  }

  onSubmit() {
    if(!this.userForm.value.username){
      this.message='Username no puede estar vacio'
    }else if(!this.userForm.value.password){
      this.message='Password no puede estar vacio'
    }else{
    //   this.loginService.login(String(this.userForm.value.username), sha512(String(this.userForm.value.password)))
    //   .subscribe(
    //     {
    //       next: (resp) => {
    //         if(resp.statusCode==201){
    //           localStorage.setItem('user', JSON.stringify(resp.data));
    //           this.router.navigate(['/notify']);
    //         }
    //       },
    //       error: (err) => {
    //         if (err.status==401){
    //           this.message=err.error.message;
    //         }else{
    //           this.message='**ERROR: '+err.error.message;
    //           //notificar con Notify
    //         }
    //       },
    //     }
    //   );
    // }
    this.loginService.login(String(this.userForm.value.username), sha512(String(this.userForm.value.password)))
    .subscribe({
      next: (resp) => {
        if(resp.statusCode==201){
          localStorage.setItem('user', JSON.stringify(resp.data));
          this.router.navigate(['/notify']);
        }
      },error: (err) => {
        console.log('**CUAK!'+JSON.stringify(err.error));
        this.message='**ERROR: '+err.error.message;
      }
    })
  }
    // let username=String(this.userForm.value.username);
    // let password=sha512(String(this.userForm.value.password))    
  }
}
