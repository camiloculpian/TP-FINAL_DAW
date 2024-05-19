import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentUser, User } from '../../models/users';
import { Observable } from 'rxjs';
import { Response } from '../../models/responses';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  constructor(private _httpReq: HttpClient) {}
  
  getUsers():Observable<Response>{
    let currentUser: CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    return this._httpReq.get<Response>("http://localhost:3000/api/v1/users", {
      headers: new HttpHeaders({
        "Authorization": String("Bearer " + currentUser.token),
      }),
    });
  }

  getUser(userId:number){
    let currentUser: CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    return this._httpReq.get<Response>(`http://localhost:3000/api/v1/users/${userId}`, {
      headers: new HttpHeaders({
        "Authorization": String("Bearer " + currentUser.token),
      }),
    });
  }

  addUser(user:JSON):Observable<Response>{
    let currentUser: CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    return this._httpReq.post<any>(`http://localhost:3000/api/v1/users/`, user,{
          headers: new HttpHeaders({
            'Authorization': String('Bearer ' + currentUser.token)
          })
        });
  }

  editUser(user:JSON, userId:number):Observable<Response>{
    let currentUser: CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    return this._httpReq.patch<any>(`http://localhost:3000/api/v1/users/${userId}`, user,{
          headers: new HttpHeaders({
            'Authorization': String('Bearer ' + currentUser.token)
          })
        });
  }
  
}