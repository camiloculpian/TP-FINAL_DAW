import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { CurrentUser, User } from '../../../models/users';

// Enums
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

// Interfaces

export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: string;
    service: string;
    status: string;
    asignedToUserId: number;
}

// Servicio de Usuarios
@Injectable({
    providedIn: 'root'
})

export class UserService {
    private apiUrl = 'http://localhost:3000/api/v1/users';
  
    constructor(private http: HttpClient) {}
  
    getUsers(headers: HttpHeaders): Observable<User[]> {
      return this.http.get<{ data: User[] }>(this.apiUrl, { headers }).pipe(
        map((response: { data: any; }) => response.data)
      );
    }
  }


// Servicio de Tickets
@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private apiUrl = 'http://localhost:3000/api/v1/tickets'; // Ajusta esto a tu URL de API

    constructor(private http: HttpClient) { }

    getTickets(headers: HttpHeaders): Observable<any> {
        return this.http.get<any>(this.apiUrl, { headers });
    }

    getTicket(ticketId:number|undefined, headers: HttpHeaders): Observable<any> {
        return this.http.get<any>(this.apiUrl+`/${ticketId}`, { headers });
    }

    addTicket(ticket: Ticket, headers: HttpHeaders): Observable<any> {
        return this.http.post<any>(this.apiUrl, ticket, { headers });
    }

    deleteTicket(ticketId: number, headers: HttpHeaders): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${ticketId}`, { headers });
    }
}

// Componente de add-Tickets
@Component({
    selector: 'app-add-tickets',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgbModalModule, NgIf],
    templateUrl: `add.edit.ticket.component.html`,
    styleUrls: []
})
export class AddEditTicketsComponent implements OnInit {
    activeModal = inject(NgbActiveModal);
    @Input() ticketId:number|undefined;
    public ticketForm!: FormGroup;
    public users: User[] = [];

    constructor(
        private router: Router,
        private _httpReq: HttpClient,
        private formBuilder: FormBuilder,
        private ticketService: TicketService,
        private userService: UserService,
    ) { }

    ngOnInit(): void {
        this.ticketForm = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            priority: ['LOW'],
            service: ['HARDWARE_REPAIR'],
            asignedToUserId: ['', Validators.required]
        });
        const currentUser: CurrentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${currentUser['token']}`,
        });
        this.loadUsers(headers);
        if(this.ticketId){
            console.log('es edicion');
            this.ticketForm.addControl('status',new FormControl('',Validators.required));
            this.ticketService.getTicket(this.ticketId, headers).subscribe({
                next: (response) => {
                    console.log(response);
                    this.ticketForm.patchValue({
                        title: response.data.title,
                        description: response.data.description,
                        priority: response.data.priority,
                        service: response.data.service,
                        status: response.data.status,
                        asignedToUserId: response.data.asignedToUserId
                    });
                },
                error: (err) =>{
                    console.log(err);
                }
            })
        }else{
            console.log('es nuevon');
        }
    }

    loadUsers(headers: HttpHeaders): void {
        this.userService.getUsers(headers).subscribe({
            next: (users) => {
                console.log('Usuarios recibidos:', users);
                this.users = users;
            },
            error: (error) => {
                console.error('Error loading users:', error);
            }
        });
    }

    addTicket(): void {
        if (this.ticketForm.invalid) {
            // MOSTRAR CUAL ES EL ERROR!!!
            return;
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${user.token}`,
        });

        const newTicket: Ticket = this.ticketForm.value;

        this.ticketService.addTicket(newTicket, headers).subscribe({
            next: (response) => {
                console.log('Response from server:', response);
                if (response.status !== 'success' && response.statusCode !== 201) {
                    Swal.fire('Error', 'error al crear ticket', 'error');
                } else {
                    Swal.fire('Success', response.message);
                    this.ticketForm.reset({
                        title: '',
                        description: '',
                        priority: 'LOW',
                        service: 'HARDWARE_REPAIR',
                        asignedToUserId: ''
                    });
                    this.activeModal.close();
                }
            },
            error: (error) => {
                Swal.fire('Error', error.error.message);
                console.error('Error creando el ticket:', error);
            }
        });
    }
}
