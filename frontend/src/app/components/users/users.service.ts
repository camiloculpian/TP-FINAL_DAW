import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../models/responses';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiURL: string = 'http://localhost:3000/api/v1'

  constructor(private _httpReq: HttpClient) {}
  
  getUsers():Observable<Response>{
    return this._httpReq.get<Response>(this.apiURL+"/users");
  }

  getUser(userId:number):Observable<Response>{
    return this._httpReq.get<Response>(this.apiURL+`/users/${userId}`);
  }

  addUser(user:JSON):Observable<Response>{
    return this._httpReq.post<any>(this.apiURL+`/users/`, user);
  }

  editUser(user:JSON, userId:number):Observable<Response>{
    return this._httpReq.patch<any>(this.apiURL+`/users/${userId}`, user);
  }

  deleteUser(userId:number):Observable<Response>{
    return this._httpReq.delete<any>(this.apiURL+`/users/${userId}`);
  }
  
}