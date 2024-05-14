import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Response } from '../../models/responses';
import { User } from '../../models/users';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit{
  public ticketsList:JSON|undefined;
  public response: Response|null;
  constructor(
    private _httpReq:HttpClient,
  ) {
    this.response = null;
    this.ticketsList = undefined;
  }

  ngOnInit(): void {
    console.log('ngOnInit()');
    let user:User = JSON.parse(String(localStorage.getItem('user')));
    this._httpReq.get<Response>("http://localhost:3000/api/v1/tickets",
    {
      headers: new HttpHeaders ({   
          "Authorization": String("Bearer "+user.token),
      }),
    }).subscribe({
      next: (resp => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.response = resp;
            this.ticketsList = this.response.data
            console.log(this.response);
        }),
        error: (err)  =>{
          this.response=err;
          console.log(this.response);
        } 
      })
  }
}
