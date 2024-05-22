// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { Response } from '../../models/responses';
// import { User } from '../../models/users';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-tickets',
//   standalone: true,
//   imports: [],
//   template:`
//   `,
//   styleUrl: './tickets.component.css'
// })
// export class TicketsComponent implements OnInit{
//   public ticketsList:JSON|undefined;
//   public response: Response|null;
//   constructor(
//     private router:Router,
//     private _httpReq:HttpClient,
//   ) {
//     this.response = null;
//     this.ticketsList = undefined;
//   }

//   ngOnInit(): void {
//     console.log('ngOnInit()');
//     try{
//       let user:User = JSON.parse(String(localStorage.getItem('user')));
//       if(!user){
//         this.router.navigate(['/login']);
//       }
//       this._httpReq.get<Response>("http://localhost:3000/api/v1/tickets",
//       {
//         headers: new HttpHeaders ({   
//             "Authorization": String("Bearer "+user.token),
//         }),
//       }).subscribe({
//         next: (resp => {
//               this.response = resp;
//               this.ticketsList = this.response.data
//               console.log(this.response);
//           }),
//           error: (err)  =>{
//             this.response=err;
//             console.log(this.response);
//           } 
//         })
//     }catch(e){
//       console.log(e);
//     }
    
    
//   }
// }



import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { Response } from '../../models/responses';
import { CurrentUser, User } from '../../models/users';
import { Router } from '@angular/router';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { AddEditTicketsComponent } from './add-edit-ticket/add.edit.ticket.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}



// Definir la interface en base al backend
export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: string;
  service: string;
  status: string;
  // Agregar otras propiedades (assignedTo, createdAt, etc.)
}

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [NgFor, NgForOf, NgIf,AddEditTicketsComponent],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})

export class TicketsComponent implements OnInit {
  private modalService = inject(NgbModal);
  public tickets:any=[]; // Usar una matriz escrita para boletos
  public selectedTicket: Ticket | null = null;
  public response: any | null = null; // Usar'cualquiera' para el objeto de respuesta
  currentUser!:CurrentUser;

  constructor(
    private router: Router,
    private _httpReq: HttpClient,
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit()');
    try{
      this.currentUser = JSON.parse(String(localStorage.getItem('user')));
      if(!this.currentUser){
        this.router.navigate(['/login']);
        return;
      }
      // obtencion de todos los tickets
      this.getTickets();
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  // confirmacion de borrado solo pa resolved
  confirmDeleteTicket(ticketId: number, ticketStatus: string): void {
    if (ticketStatus !== 'RESOLVED') {
      Swal.fire({
        title: 'Error',
        text: 'No se puede eliminar porque la tarea está en proceso.',
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: 'No podrá revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        this.deleteTicket(ticketId);
      }
    });
  }

  // Borrar el ticket
  deleteTicket(ticketId: number): void {
    const currentUser: CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentUser.token}`,
    });

    this._httpReq.delete(`http://localhost:3000/api/v1/tickets/${ticketId}`, { headers })
      .subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Ticket eliminado con éxito', 'success');
          this.tickets = this.tickets.filter((ticket: { id: number; }) => ticket.id !== ticketId);
        },
        error: (error) => {
          Swal.fire('Error', 'Error al eliminar el ticket', 'error');
          console.error('Error al eliminar el ticket:', error);
        }
      });
  }

  editTicket(ticketId:number){
    const modalRef = this.modalService.open(AddEditTicketsComponent);
    modalRef.componentInstance.ticketId =ticketId;
    modalRef.hidden.subscribe({next:()=>(this.getTickets())});
  }

  addTicket(){
    //const currentUser: CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    const modalRef = this.modalService.open(AddEditTicketsComponent);
    modalRef.hidden.subscribe({next:()=>(this.getTickets())});
  }

  getTickets(){
    let currentUser:CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentUser.token}`,
    });
    this._httpReq.get<Response>('http://localhost:3000/api/v1/tickets', { headers })
        .subscribe({
          next: (response) => {
            if (response.status == 'success') {
              console.log('Listo pa procesar los datiños')
            } else if (response.data) { // procesar datos
              this.tickets = (response.data as unknown as Ticket[]).map((ticketData: any) => {
                // Crear un nuevo objeto Ticket a partir de ticketData
                const ticket: Ticket = {
                  id: ticketData.id,
                  title: ticketData.title,
                  description: ticketData.description, 
                  priority: ticketData.priority,
                  service: ticketData.service,
                  status: ticketData.status,
                  
                };
                return ticket;
              });
            } else {
              console.error('error.');
            }
          },
          error: (error) => {
            console.error('Error en la busqueda tickets:', error);
          },
    });
  }

}