import { Component, inject, OnInit } from '@angular/core';
import { Response } from '../../dto/responses';
import { CommonModule, NgForOf } from '@angular/common';
import { NgbHighlight, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../dto/users';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UserService } from '../tickets/add-edit-ticket/add.edit.ticket.component';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, NgForOf, NgbHighlight,FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent implements OnInit {
  private modalService = inject(NgbModal);
  public usersList: User[] | [];
  public response: Response | null;
  public user: User = JSON.parse(String(localStorage.getItem('user')));

  enableEdit:boolean=false;
  enableEditIndex:number=0;
  userForm : FormGroup;

  username:string|undefined;

  constructor(
    private accountService:UserService,
    private fbuilder: FormBuilder,
  ) {
    this.response = null;
    this.usersList = [];
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
    
    this.getUsers();
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  getUsers(){
    this.accountService.getUsers().subscribe({
      next: (resp) => {
        this.response = resp;
        const currentUserUsername = this.user.username; 
        this.usersList = this.response?.data.filter((user: User) => user.username === currentUserUsername) as User[];
        console.log(this.usersList);
      },
      error: (err) => {
        this.response = err;
        console.log(this.response);
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