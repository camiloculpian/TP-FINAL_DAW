import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, throwError } from 'rxjs';
import { Response } from '../../models/responses';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private responseSubject: BehaviorSubject<Response | null>;
  public response: Observable<Response | null>;

  constructor(
    private _httpReq:HttpClient,
  ) {
    this.responseSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('response')!));
    this.response = this.responseSubject.asObservable();
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
            return resp;
        }))
}

  logOut(){
    this.responseSubject.next(null);
    localStorage.removeItem('user');
  }

  isLoggedIn():Observable<any>|undefined{
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

  getCurrentUser(){
    return localStorage.getItem('user');
  }
}
