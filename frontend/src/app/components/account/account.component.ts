import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Response } from '../../models/responses';
import { CommonModule, NgForOf } from '@angular/common';
import { NgbHighlight, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CurrentUser, User } from '../../models/users';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from './account.service';

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
    private accountService:AccountService,
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
  // OBTENCION DE TODOS LOS USERS
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
        this.usersList = this.response.data as unknown as User[]; // Cast to User[]
        console.log(this.usersList);
      },
      error: (err) => {
        this.response = err;
        console.log(this.response);
      }
    });
  }
  // BORRA UN USUARIO EN ESPECIFICO
  deleteUser(userId: number): void {
    // Mostrar Sweet Alert de confirmación
    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: 'No podrá revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        // Usuario confirmó eliminar, realizar la eliminación
        console.log('Deleting user:', userId);

      this.accountService.deleteUser(userId).subscribe({
          next: (response) => {
            console.log('User deleted:', response);

            this.getUsers();

            // Mostrar mensaje de éxito
            Swal.fire({
              title: response.message,
              icon: 'success'
            });
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            // Manejar el error de eliminación (por ejemplo, mostrar un mensaje de error)
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

  // onAddUser(){
  //   const modalRef = this.modalService.open(AddEditUsersComponent);
  //   modalRef.hidden.subscribe({next:()=>(this.getUsers())});
  // }

  // onEditUser(item:any){
  //   const modalRef = this.modalService.open(AddEditUsersComponent);
	// 	modalRef.componentInstance.name = item.id;
  //   modalRef.componentInstance.user = item;
  //   modalRef.hidden.subscribe({next:()=>(this.getUsers())});
  // }

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