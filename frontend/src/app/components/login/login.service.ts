import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, last, map, Observable, throwError, timeout } from 'rxjs';
import { Response } from '../../models/responses';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private responseSubject: BehaviorSubject<Response | null>;
  public response: Observable<Response | null>;
  // public isAuthenticated:boolean;
  constructor(
    private _httpReq:HttpClient,
    private router:Router,
  ) {
    this.responseSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('response')!));
    this.response = this.responseSubject.asObservable();
    // this.isAuthenticated = this.isLoggedIn();
  }

  // login(username:string, password:string):Observable<Response>{
  //   return this._httpReq.post<Response>("http://localhost:3000/api/v1/auth/login", {"username":username, "password":password})
  // }

  logIn(username: string, password: string) {
    // CAMBIAR LAS RUTAS A UN ARCHIVO!!!
    return this._httpReq.post<Response>("http://localhost:3000/api/v1/auth/login", {"username":username, "password":password})
      .pipe(map(resp => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(resp.data));
          this.responseSubject.next(resp);
          // this.isAuthenticated=true;
          return resp;
      })
    )
  }

  logOut(){
    this.responseSubject.next(null);
    localStorage.removeItem('user');
  }

  isLoggedIn():Observable<Response>{
    let user:any = localStorage.getItem('user');
    if( user != null){
      return this._httpReq.get<Response>(
        `http://localhost:3000/api/v1/auth/verify`,
        {
          headers: new HttpHeaders ({   
              "Authorization": String("Bearer "+JSON.parse(user).token),
          }),
        }
      )
    }else{
      return throwError(() => new Error('UNAUTORIZED'));
    }
  }

  isAdmin(): boolean{
    console.log();
    return JSON.parse(String(this.getCurrentUser()))?.roles == 'admin';
  }

  getCurrentUser(){
    return localStorage.getItem('user');
  }
}
