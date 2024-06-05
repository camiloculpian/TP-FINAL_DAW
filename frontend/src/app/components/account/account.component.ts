import { Component, inject, OnInit } from '@angular/core';
import { Response } from '../../dto/responses';
import { CommonModule, NgForOf } from '@angular/common';
import { NgbHighlight, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrentUser, User } from '../../dto/users';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UsersService } from '../users/users.service';
import { environment } from '../../../environment/environment';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, NgForOf, NgbHighlight,FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {
  public apiUrl:string = environment.apiUrl;
  public userProfile!: User;
  public currentUser: User = JSON.parse(String(localStorage.getItem('user')));

  enableEdit:boolean=false;
  enableEditIndex:number=0;
  userForm : FormGroup;

  username:string|undefined;

  constructor(
    private usersService:UsersService,
    private fbuilder: FormBuilder,
  ) {
    this.userForm = this.fbuilder.group({
      username: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dni: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
      roles: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required,Validators.email]),
      phone: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    
    this.getAccountData();
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  getAccountData(){
    this.usersService.getUserProfile().subscribe({
      next: (resp:Response) => {
        console.log(resp.data)
        this.userProfile = resp?.data as User;        
      },
      error: (err:Error) => {
        console.log(err.message);
      }
    });
  }
  
}













//   ngOnInit(): void {
    
//     this.getUser();
//   }

//   trackByUserId(index: number, user: User): number {
//     return user.id;
//   }

//   getUser(){
//     this.accountService.getUser().subscribe({
//       next: (resp) => {
//         this.response = resp;
//         this.usersList = this.response.data as unknown as User[]; 
//         console.log(this.usersList);
//       },
//      });
//   }

// }