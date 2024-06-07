import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, last, map, Observable, throwError, timeout } from 'rxjs';
import { Response } from '../../dto/responses';
import { Router } from '@angular/router';
import { CurrentUser } from '../../dto/users';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private responseSubject: BehaviorSubject<Response | null>;
  public response: Observable<Response | null>;
  constructor(
    private _httpReq:HttpClient,
    private router:Router,
  ) {
    this.responseSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('response')!));
    this.response = this.responseSubject.asObservable();
  }


  logIn(username: string, password: string) {
    return this._httpReq.post<Response>("http://localhost:3000/api/v1/auth/login", {"username":username, "password":password})
      .pipe(map(resp => {
          localStorage.setItem('user', JSON.stringify(resp.data));
          this.responseSubject.next(resp);
          return resp;
      })
    )
  }

  logOut(){
    this.responseSubject.next(null);
    localStorage.removeItem('user');
  }

  isLoggedIn():Observable<Response>{
    let user:CurrentUser = localStorage.getItem('user') as CurrentUser;
    if( user != null){
      return this._httpReq.get<Response>(
        `http://localhost:3000/api/v1/auth/verify`,
        {
          headers: new HttpHeaders ({   
              "Authorization": String("Bearer "+user.token),
          }),
        }
      )
    }else{
      return throwError(() => new Error('UNAUTORIZED'));
    }
  }

  isAdmin(): boolean{
    console.log();
    return JSON.parse(String(this.getCurrentUser()))?.roles == 'admin'
  }

  getCurrentUser(){
    return localStorage.getItem('user');
  }
}
