import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { sha512 } from 'js-sha512';
import { LoginService } from './login.service';
import { Response } from '../../models/responses';
import { HttpStatusCode } from '@angular/common/http';

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
    // private _httpReq:HttpClient
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
      //resp:Response = this.loginService.login(String(this.userForm.value.username), sha512(String(this.userForm.value.password)));
      this.loginService.login(String(this.userForm.value.username), sha512(String(this.userForm.value.password)))
      .subscribe(
        {
          next: (resp) => {
            if(resp.statusCode==201){
              this.message='Login correcto';
            }
          },
          error: (err) => {
            console.log(err.error)
            if (err.status==401){
              this.message=err.error.message;
            }else{
              this.message='**ERROR: '+err.error.message;
              //notificar con Notify
            }
          },
        }
      );
    }
    // console.log(this.userForm.value.username);
    // let username=String(this.userForm.value.username);
    // let password=sha512(String(this.userForm.value.password))    
  }

}
