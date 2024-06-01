import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../dto/responses';
import { environment } from "../../../environment/environment";

@Injectable({
  providedIn: 'root',
})

export class AccountService {
  private apiUrl:string = environment.apiUrl;
  // private apiURL: string = 'http://localhost:3000/api/v1'

  constructor(private _httpReq: HttpClient) {}
  
  
  getUsers():Observable<Response>{
    return this._httpReq.get<Response>(this.apiUrl+"/users");
  }



}

