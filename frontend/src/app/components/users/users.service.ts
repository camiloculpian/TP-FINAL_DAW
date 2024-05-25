import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../models/responses';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  constructor(private _httpReq: HttpClient) {}
  
  getUsers():Observable<Response>{
    return this._httpReq.get<Response>("http://localhost:3000/api/v1/users");
  }

  getUser(userId:number):Observable<Response>{
    return this._httpReq.get<Response>(`http://localhost:3000/api/v1/users/${userId}`);
  }

  addUser(user:JSON):Observable<Response>{
    return this._httpReq.post<any>(`http://localhost:3000/api/v1/users/`, user);
  }

  editUser(user:JSON, userId:number):Observable<Response>{
    return this._httpReq.patch<any>(`http://localhost:3000/api/v1/users/${userId}`, user);
  }

  deleteUser(userId:number):Observable<Response>{
    return this._httpReq.delete<any>(`http://localhost:3000/api/v1/users/${userId}`);
  }
  
}