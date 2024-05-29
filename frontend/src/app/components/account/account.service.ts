import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountComponent } from './account.component';

describe('accountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../models/responses';
import { environment } from "../../../environment/environment";

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl:string = environment.apiUrl;
  // private apiURL: string = 'http://localhost:3000/api/v1'

  constructor(private _httpReq: HttpClient) {}
  
  
  getUser(userId:number):Observable<Response>{
    return this._httpReq.get<Response>(this.apiUrl+`/users/${userId}`);
  }
  
}