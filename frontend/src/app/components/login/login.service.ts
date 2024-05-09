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

  login(username:string, password:string):Observable<Response>{
    return this._httpReq.post<Response>("http://localhost:3000/api/v1/auth/login", {"username":username, "password":password})
  }
}
