import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../dto/responses';
import { environment } from "../../../environment/environment";

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl:string = environment.apiUrl;
  // private apiURL: string = 'http://localhost:3000/api/v1'

  constructor(private _httpReq: HttpClient) {}
  
  getUsers():Observable<Response>{
    return this._httpReq.get<Response>(this.apiUrl+"/users");
  }

  getUser(userId:number):Observable<Response>{
    return this._httpReq.get<Response>(this.apiUrl+`/users/${userId}`);
  }

  getUserProfile():Observable<Response>{
    return this._httpReq.get<Response>(this.apiUrl+`/users/profile`);
  }

  addUser(user:FormData):Observable<Response>{
    return this._httpReq.post<any>(this.apiUrl+`/users/`, user);
  }

  editUser(user:FormData, userId:number):Observable<Response>{
    return this._httpReq.patch<any>(this.apiUrl+`/users/${userId}`, user);
  }

  deleteUser(userId:number):Observable<Response>{
    return this._httpReq.delete<any>(this.apiUrl+`/users/${userId}`);
  }
  
}