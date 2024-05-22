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
import { AllValidationErrors, getFormValidationErrors } from '../../../utils/validations';
import { TicketService } from '../tickets.service';
import { Ticket } from '../../../models/ticket';

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
    public currentUser!:CurrentUser;
    public inputMissingMessage:String='';

    constructor(
        private router: Router,
        private _httpReq: HttpClient,
        private formBuilder: FormBuilder,
        private ticketService:TicketService,
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
        this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.currentUser['token']}`,
        });
        this.loadUsers(headers);
        if(this.ticketId){
            console.log('es edicion');
            this.ticketForm.addControl('status',new FormControl('',Validators.required));
            this.ticketService.getTicket(this.ticketId).subscribe({
                next: (response) => {
                    console.log(response);
                    this.ticketForm.patchValue({
                        title: response.data.title,
                        description: response.data.description,
                        priority: response.data.priority,
                        service: response.data.service,
                        status: response.data.status,
                        asignedToUserId: response.data.asignedToUser
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

    save(e:Event): void {
        e.preventDefault();
        if(this.ticketId){
            console.log('es edicion');
            if (this.ticketForm.valid) {
                let formObj = this.ticketForm.getRawValue();
                delete formObj.asignedToUser;
                delete formObj.asignedToUserId;
                delete formObj.priority;
                delete formObj.title;
                delete formObj.service;
                const ticket: Ticket = formObj;
                this.ticketService.updateTicket(this.ticketId,ticket).subscribe({
                    next: ()=>{
                        this.activeModal.close();
                    }
                })
            }else{
                const error: AllValidationErrors|undefined = getFormValidationErrors(this.ticketForm.controls).shift();
                if (error) {
                    let text;
                    switch (error.error_name) {
                    case 'required': text = `${error.control_name} is required!`; break;
                    case 'pattern': text = `${error.control_name} has wrong pattern!`; break;
                    case 'email': text = `${error.control_name} has wrong email format!`; break;
                    case 'minlength': text = `${error.control_name} has wrong length! Required length: ${error.error_value.requiredLength}`; break;
                    case 'areEqual': text = `${error.control_name} must be equal!`; break;
                    default: text = `${error.control_name}: ${error.error_name}: ${error.error_value}`;
                    }
                    this.inputMissingMessage = text;
                }
            }
        }else{
            console.log('es nuevo');
            if (this.ticketForm.valid) {
                
                const newTicket: Ticket = this.ticketForm.value;
                this.ticketService.addTicket(newTicket).subscribe({
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
                        console.error('Error creando el ticket:', error.error.message);
                    }
                });
                this
            }else{
                const error: AllValidationErrors|undefined = getFormValidationErrors(this.ticketForm.controls).shift();
                if (error) {
                    let text;
                    switch (error.error_name) {
                    case 'required': text = `${error.control_name} is required!`; break;
                    case 'pattern': text = `${error.control_name} has wrong pattern!`; break;
                    case 'email': text = `${error.control_name} has wrong email format!`; break;
                    case 'minlength': text = `${error.control_name} has wrong length! Required length: ${error.error_value.requiredLength}`; break;
                    case 'areEqual': text = `${error.control_name} must be equal!`; break;
                    default: text = `${error.control_name}: ${error.error_name}: ${error.error_value}`;
                    }
                    this.inputMissingMessage = text;
                }
            }
        }
    }
        
}
