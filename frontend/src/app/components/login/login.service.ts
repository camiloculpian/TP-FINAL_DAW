import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
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

  login(username: string, password: string) {
    return this._httpReq.post<Response>("http://localhost:3000/api/v1/auth/login", {"username":username, "password":password})
        .pipe(map(resp => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(resp.data));
            this.responseSubject.next(resp);
            return resp;
        }))
}

  logout(){
    this.responseSubject.next(null);
    localStorage.removeItem('user');
  }

  isLoggedIn(){
    return localStorage.getItem('user') !== null;
    //Queda Verificar con el backend que el token sea valido!
  }

  getCurrentUser(){
    return localStorage.getItem('user');
  }
}
