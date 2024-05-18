// ORIGINAL CODE V1.0

// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { User } from '../../models/users';
// import { Response } from '../../models/responses';
// import { CommonModule, NgForOf } from '@angular/common';
// import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';

// @Component({
//   selector: 'app-users',
//   standalone: true,
//   imports: [CommonModule,NgForOf,NgbHighlight],
//   templateUrl: './users.component.html',

//   styleUrl: './users.component.css'
// })
// export class UsersComponent implements OnInit{
//   public usersList:JSON|undefined;
//   public response: Response|null;

//   constructor(private _httpReq: HttpClient) {
//     this.response = null;
//     this.usersList = undefined;
//    }

//   ngOnInit(): void {
//     console.log('ngOnInit()');
//     let user:User = JSON.parse(String(localStorage.getItem('user')));
//     this._httpReq.get<Response>("http://localhost:3000/api/v1/users",
//     {
//       headers: new HttpHeaders ({   
//           "Authorization": String("Bearer "+user.token),
//       }),
//     }).subscribe({
//       next: (resp => {
//             this.response = resp;
//             this.usersList = this.response.data;
//             console.log(this.usersList);
//         }),
//         error: (err)  =>{
//           this.response=err;
//           console.log(this.response);
//         } 
//       })

//   }

// }



// CODE MODIFIED 1.1: Tranquilo no se asuste chamigo, despues modularizamos...
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Response } from '../../models/responses';
import { CommonModule, NgForOf } from '@angular/common';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CurrentUser, User } from '../../models/users';
import { ModalService } from '../modal/modal.service';
import { ModalComponent } from '../modal/modal.component';
import { UsersService } from './users.service';
import { AddEditUsersComponent } from './add-edit-user/add.edit.user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NgForOf, NgbHighlight, ModalComponent, AddEditUsersComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

// Tranca, despues modularizamos... Por ahora la tablita esta aca para no estar yendo de un archiv
// a otro, para mayor practicidad y rapidez
export class UsersComponent implements OnInit {
  // cambie la lista de user en vez de undefined, lo deje como lista vacia...
  public usersList: User[] | [];
  public response: Response | null;
  //newUser: User = new User;
  //newUser:User | undefined;
  newUser!: User;

  constructor(
    private _httpReq: HttpClient,
    private modalService:ModalService,
  ) {
    this.response = null;
    this.usersList = [];
  }
  // OBTENCION DE TODOS LOS USERS
  ngOnInit(): void {
    // console.log('ngOnInit()');
    // let user: User = JSON.parse(String(localStorage.getItem('user')));
    // this._httpReq.get<Response>("http://localhost:3000/api/v1/users", {
    //   headers: new HttpHeaders({
    //     "Authorization": String("Bearer " + user.token),
    //   }),
    // }).subscribe({
    //   next: (resp) => {
    //     this.response = resp;
    //     this.usersList = this.response.data as unknown as User[]; // Cast to User[]
    //     console.log(this.usersList);
    //   },
    //   error: (err) => {
    //     this.response = err;
    //     console.log(this.response);
    //   }
    // });
    this.getUsers();
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  getUsers(){
    let user: CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    this._httpReq.get<Response>("http://localhost:3000/api/v1/users", {
      headers: new HttpHeaders({
        "Authorization": String("Bearer " + user.token),
      }),
    }).subscribe({
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

        let user: any = JSON.parse(String(localStorage.getItem('user')));

        this._httpReq.delete<any>(`http://localhost:3000/api/v1/users/${userId}`, {
          headers: new HttpHeaders({
            'Authorization': String('Bearer ' + user.token)
          })
        }).subscribe({
          next: (response) => {
            console.log('User deleted:', response);

            // Actualiza la tabla
            // Esto esta mal, tiene que refrescar desde la base de datos!!!
            // this.usersList = this.usersList.filter(u => u.id !== userId); // Filtra el usuario eliminau
            this.getUsers();

            // Mostrar mensaje de éxito
            Swal.fire({
              title: 'Usuario eliminado con éxito',
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

  onAddUser(){
    console.log('---------------> OnAddUser');
  }

  editUser(userId:number){
    this.openModal(userId);
  }
  // AGREGAR

  openModal(userId:number) {
    console.log('------------------> openModal()')
    console.log('userId: ', userId)
    this.modalService.open({
      title: 'test',
    });
    console.log('<------------------ openModal()')
  }
  
}


