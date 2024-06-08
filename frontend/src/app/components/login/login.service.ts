import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, last, map, Observable, throwError, timeout } from 'rxjs';
import { Response } from '../../dto/responses';
import { environment } from "../../../environment/environment";
import { CurrentUser } from '../../dto/users';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl:string = environment.apiUrl;
  private responseSubject: BehaviorSubject<Response | null>;
  public response: Observable<Response | null>;
  constructor(
    private _httpReq:HttpClient,
  ) {
    this.responseSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('response')!));
    this.response = this.responseSubject.asObservable();
  }


  logIn(username: string, password: string) {
    return this._httpReq.post<Response>(this.apiUrl+"/auth/login", {"username":username, "password":password})
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
      return this._httpReq.get<Response>(this.apiUrl+`/auth/verify`)
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
