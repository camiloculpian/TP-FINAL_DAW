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
import { User } from '../../models/users';

export interface UsernameOptions {
  id: number;
  nombre?: string | undefined;
  username?: string | undefined;
  roles?: string | undefined;
  token?: string | undefined;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NgForOf, NgbHighlight],
  template: `
    <div class="container">
    <div class="container mt-4">
      <h3>Agregar Nuevo Usuario</h3>
        <form>
          <!-- Username -->
          <div class="mb-3">
            <label for="username" class="form-label">Username:</label>
            <input type="text" class="form-control" id="username" name="username">
          </div>
          <!-- Roles -->
          <div class="mb-3">
            <label for="roles" class="form-label">Roles:</label>
            <input type="text" class="form-control" id="roles" name="roles">
          </div>
          <!-- Gender -->
          <div class="mb-3">
            <label for="gender" class="form-label">Gender:</label>
            <select class="form-select" id="gender" name="gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <!-- Birth Date -->
          <div class="mb-3">
            <label for="birthDate" class="form-label">Birth Date:</label>
            <input type="date" class="form-control" id="birthDate" name="birthDate">
          </div>
          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" class="form-control" id="email" name="email">
          </div>
          <!-- Profile Picture -->
          <div class="mb-3">
            <label for="profilePicture" class="form-label">Profile Picture:</label>
            <input type="file" class="form-control" id="profilePicture" name="profilePicture" accept="image/*">
          </div>
          <button type="submit" class="btn btn-primary">Agregar Nuevo</button>
        </form>
      </div>


      
      <h2 class="d-flex justify-content-center">Tabla con todos los Usuarios</h2>
      <table ngb-table class="table table-dark table-striped table-hover table-responsive table-md tablaGas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Roles</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of usersList; trackBy: trackByUserId">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.roles }}</td>
            <td>{{ user.person?.name }}</td>
            <td>{{ user.person?.lastName }}</td>
            <td>{{ user.person?.email }}</td>
            <td>{{ user.person?.phone }}</td>
            <td>
              <button class="btn btn-danger" (click)="deleteUser(user.id)">Despedir</button>
            </td>
          </tr>
          <tr *ngIf="usersList?.length === 0">
            <td colspan="8">No se encontraron datos.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['./users.component.css']
})

// Tranca, despues modularizamos... Por ahora la tablita esta aca para no estar yendo de un archiv
// a otro, para mayor practicidad y rapidez
export class UsersComponent implements OnInit {
  // cambie la lista de user en vez de undefined, lo deje como lista vacia...
  public usersList: User[] | [];
  public response: Response | null;

  constructor(private _httpReq: HttpClient) {
    this.response = null;
    this.usersList = [];
  }
  // OBTENCION DE TODOS LOS USERS
  ngOnInit(): void {
    console.log('ngOnInit()');
    let user: User = JSON.parse(String(localStorage.getItem('user')));
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

  trackByUserId(index: number, user: User): number {
    return user.id;
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
            this.usersList = this.usersList.filter(u => u.id !== userId); // Filtra el usuario eliminau

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


  // AGREGAR
}


