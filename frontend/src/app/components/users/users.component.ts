import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/users';
import { Response } from '../../models/responses';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  public usersList:JSON|undefined;
  public response: Response|null;

  constructor(private _httpReq: HttpClient) {
    this.response = null;
    this.usersList = undefined;
   }

  ngOnInit(): void {
    console.log('ngOnInit()');
    let user:User = JSON.parse(String(localStorage.getItem('user')));
    this._httpReq.get<Response>("http://localhost:3000/api/v1/users",
    {
      headers: new HttpHeaders ({   
          "Authorization": String("Bearer "+user.token),
      }),
    }).subscribe({
      next: (resp => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.response = resp;
            this.usersList = this.response.data;
            console.log(this.response);
        }),
        error: (err)  =>{
          this.response=err;
          console.log(this.response);
        } 
      })
  }

}
