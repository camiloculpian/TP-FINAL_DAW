import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export interface User {
    [x: string]: any;
    id: number;
    name: string;
}

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
    imports: [CommonModule, ReactiveFormsModule, NgbModalModule],
    template: `
    <div class="tickets-container">
      <h2>Tickets</h2>
      <button class="btn btn-primary mb-3" (click)="openCreateTicketModal(createTicketModal)">Add Ticket</button>

      <ng-template #createTicketModal>
        <div class="modal-header">
          <h5 class="modal-title">Create Ticket</h5>
          <button type="button" class="btn-close" aria-label="Close" (click)="modalRef?.close()"></button>
        </div>
        <div class="modal-body">
          <form [formGroup]="ticketForm">
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" class="form-control" id="title" formControlName="title" placeholder="Enter ticket title">
            </div>
            <div class="form-group">
              <label for="asignedToUserId">Asignar a:</label>
              <select class="form-control" id="asignedToUserId" formControlName="asignedToUserId">
                <option *ngFor="let user of users" [value]="user.id">{{ user.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea class="form-control" id="description" formControlName="description" rows="3" placeholder="Enter ticket description"></textarea>
            </div>
            <div class="form-group">
              <label for="priority">Priority:</label>
              <select class="form-control" id="priority" formControlName="priority">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div class="form-group">
              <label for="service">Service:</label>
              <select class="form-control" id="service" formControlName="service">
                <option value="HARDWARE_REPAIR">Hardware Repair</option>
                <option value="REMOTE_SERVICE">Remote Service</option>
                <option value="TECHNICAL_SERVICE">Technical Service</option>
                <option value="CUSTOMER_SERVICE">Customer Service</option>
                <option value="CUSTOMER_SUPPORT">Customer Support</option>
                <option value="SOFTWARE_SUPORT">Software Support</option>
                <option value="PREVENTIVE_MAINTENANCE">Preventive Maintenance</option>
                <option value="PC_ASSEMBLY">PC Assembly</option>
                <option value="DATA_RECORVERY">Data Recovery</option>
                <option value="VIRUS_REMOVAL">Virus Removal</option>
                <option value="HARDWARE_UPGRADES">Hardware Upgrades</option>
                <option value="EMERGENCY_REPAIR">Emergency Repair</option>
                <option value="IT_ACCESSORY_SALES">IT Accessory Sales</option>

              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" (click)="modalRef?.close()">Close</button>
          <button type="button" class="btn btn-primary" (click)="addTicket()">Save Ticket</button>
        </div>
      </ng-template>
    </div>
  `,
    styleUrls: []
})
export class AddEditTicketsComponent implements OnInit {
    public tickets: Ticket[] = [];
    public ticketForm!: FormGroup;
    public users: User[] = [];
    public modalRef: any;

    constructor(
        private router: Router,
        private _httpReq: HttpClient,
        private formBuilder: FormBuilder,
        private ticketService: TicketService,
        private userService: UserService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        
        const user: User = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user['token']) {
            this.router.navigate(['/login']);
            return;
        }

        const headers = new HttpHeaders({
            Authorization: `Bearer ${user['token']}`,
        });


        this.ticketForm = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            priority: ['LOW'],
            service: ['HARDWARE_REPAIR'],
            asignedToUserId: ['', Validators.required]
        });

        this.loadTickets(headers);
        this.loadUsers(headers);
    }

    loadTickets(headers: HttpHeaders): void {
        this.ticketService.getTickets(headers).subscribe({
            next: (response) => {
                if (response.status === 'success' && response.data) {
                    this.tickets = response.data as Ticket[];
                }
            },
            error: (error) => {
                console.error('Error loading tickets:', error);
            }
        });
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


    openCreateTicketModal(content: any): void {
        this.modalRef = this.modalService.open(content);
    }

    addTicket(): void {
        if (this.ticketForm.invalid) {
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
                    Swal.fire('Success', 'Ticket creado exitosamente', 'success');
                    this.tickets.push(response.data);
                    this.ticketForm.reset({
                        title: '',
                        description: '',
                        priority: 'LOW',
                        service: 'HARDWARE_REPAIR',
                        asignedToUserId: ''
                    });
                    this.modalRef.close();
                }
            },
            error: (error) => {
                Swal.fire('Error', 'Error creando el ticket', 'error');
                console.error('Error creando el ticket:', error);
            }
        });
    }
}
