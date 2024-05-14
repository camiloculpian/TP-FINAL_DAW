import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import { Response } from '../../models/responses';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private responseSubject: BehaviorSubject<Response | null>;
  public response: Observable<Response | null>;
  public isAuthenticated:boolean;
  constructor(
    private _httpReq:HttpClient,
    private router:Router,
  ) {
    this.responseSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('response')!));
    this.response = this.responseSubject.asObservable();
    this.isAuthenticated =false;
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
          this.isAuthenticated=true;
          return resp;
      })
    )
  }

  logOut(){
    this.responseSubject.next(null);
    localStorage.removeItem('user');
  }

  // isLoggedIn():Observable<any>|undefined{
  //   let user:any = localStorage.getItem('user');
  //   if( user != null){
  //     return this._httpReq.get<Response>(
  //       `http://localhost:3000/api/v1/auth/verify`,
  //       {
  //         headers: new HttpHeaders ({   
  //             "Authorization": String("Bearer "+JSON.parse(user).token),
  //         }),
  //       }
  //     )
  //   }else{
  //     return throwError(() => new Error('UNAUTORIZED'));
  //   }
  // }

  isLoggedIn():boolean{
    // try{
    //   let user:any = localStorage.getItem('user');
    //   console.log(user);
    //   if(user == null){
    //     this.isAuthenticated = false;
    //     return false
    //   }else{
    //     this._httpReq.get<Response>(
    //         `http://localhost:3000/api/v1/auth/verify`,
    //         {
    //           headers: new HttpHeaders ({   
    //               "Authorization": String("Bearer "+JSON.parse(user).token),
    //           }),
    //         }).subscribe({
    //                 next: (resp) => {
    //                   console.log('**OK!'+JSON.stringify(resp.data));
    //                   localStorage.setItem('user', JSON.stringify(resp.data));
    //                   this.isAuthenticated=true;
    //                 },
    //                 error: (err)  =>{
    //                   console.log('**CUAK!'+JSON.stringify(err.error));
    //                   console.log('**CUAK! NO estas autorizado a andar por aca!');
    //                   localStorage.removeItem('user');
    //                   this.isAuthenticated=false;
    //                 },
    //               })
    //               return this.isAuthenticated;
    //     }
    // }catch(e){
    //   this.isAuthenticated=false;
    //   return false;
    // }
    if(localStorage.getItem('user')){
      return true;
      }else{
        return false;
      }
  }

  getCurrentUser(){
    return localStorage.getItem('user');
  }
}
