import { Component, inject, OnInit } from '@angular/core';
import { Response } from '../../dto/responses';
import { CommonModule, NgForOf } from '@angular/common';
import { NgbHighlight, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CurrentUser, User } from '../../dto/users';
import { AddEditUsersComponent } from './add-edit-user/add.edit.user.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NgForOf, NgbHighlight, AddEditUsersComponent,FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  private modalService = inject(NgbModal);
  public usersList: User[] | [];
  public response: Response | null;
  public currentUser: CurrentUser = JSON.parse(String(localStorage.getItem('user')));

  enableEdit:boolean=false;
  enableEditIndex:number=0;
  userForm : FormGroup;

  username:string|undefined;
  public filteredUsersList: User[] = [];

  constructor(
    private usersService:UsersService,
    private fbuilder: FormBuilder,
  ) {
    this.response = null;
    this.usersList = [];
    this.userForm = this.fbuilder.group({
      username: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      // dni: new FormControl('', Validators.required),
      // birthDate: new FormControl('', Validators.required),
      roles: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required,Validators.email]),
      phone: new FormControl('', Validators.required),
      // address: new FormControl('', Validators.required),
      // gender: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    
    this.getUsers();
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  getUsers(){
    this.usersService.getUsers().subscribe({
      next: (resp) => {
        this.response = resp;
        this.usersList = this.response.data as unknown as User[]; 
        this.filteredUsersList = this.usersList;
        console.log(this.usersList);
      },
      error: (err) => {
        this.response = err;
        console.log(this.response);
      }
    });
  }

  // Search username
  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (searchTerm) {
      this.filteredUsersList = this.usersList.filter(user =>
        user.person?.name?.toLowerCase().includes(searchTerm)
        
      );
      this.usersList = this.filteredUsersList; 
    } else {
      this.getUsers(); 
    }
  }
  

  deleteUser(userId: number): void {
    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: 'No podrá revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        console.log('Deleting user:', userId);

      this.usersService.deleteUser(userId).subscribe({
          next: (response) => {
            console.log('User deleted:', response);

            this.getUsers();

            Swal.fire({
              title: response.message,
              icon: 'success'
            });
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            Swal.fire({
              title: 'Error al eliminar usuario',
              text: error.message,
              icon: 'error'
            });
          }
        });
      }
    });
  }

  onAddUser(){
    const modalRef = this.modalService.open(AddEditUsersComponent);
    modalRef.hidden.subscribe({next:()=>(this.getUsers())});
  }

  onEditUser(item:any){
    const modalRef = this.modalService.open(AddEditUsersComponent);
		modalRef.componentInstance.name = item.id;
    modalRef.componentInstance.user = item;
    modalRef.hidden.subscribe({next:()=>(this.getUsers())});
  }

}


