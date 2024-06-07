import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { CurrentUser, User } from '../../../dto/users';
import { AllValidationErrors, getFormValidationErrors } from '../../../utils/validations';
import { TicketService } from '../tickets.service';
import { Ticket } from '../../../dto/ticket';
import { UsersService } from '../../users/users.service';

@Injectable({
    providedIn: 'root'
})

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
        private userService: UsersService,
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
        this.loadUsers();
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
                        asignedToUserId: response.data.asignedToUser?.id
                    });
                },
                error: (err) =>{
                    console.log(err);
                }
            })
        }else{
            console.log('es nuevo');
        }
    }

    loadUsers(): void {
        this.userService.getUsers().subscribe({
            next: (users) => {
                console.log('Usuarios recibidos:', users);
                this.users = users.data;
            },
            error: (error) => {
                console.error('Error loading users:', error);
            }
        });
    }

    save(e:Event): void {
        e.preventDefault();
        if (this.ticketId) {
            console.log('es edicion');
            if (this.ticketForm.valid) {
              let formObj = this.ticketForm.getRawValue();
              if(this.currentUser.roles!='admin'){
                delete formObj.asignedToUserId;
                delete formObj.priority;
                delete formObj.title;
                delete formObj.service;
          
              }else{
                formObj.asignedToUserId=String(formObj.asignedToUserId);
              }
              
              console.log (formObj)
              const ticket: Ticket = formObj;
              this.ticketService.updateTicket(this.ticketId,ticket).subscribe({
                next: ()=>{
                  Swal.fire({
                    title: "Se ha actualizado el ticket con éxito",
                    icon: "success"
                  });
                  this.activeModal.close();
                }
              })          
            }else{
                const error: AllValidationErrors|undefined = getFormValidationErrors(this.ticketForm.controls).shift();
                if (error) {
                    let text;
                    switch (error.error_name) {
                    case 'required': 
                        text = `Falta ${error.control_name}!`; 
                        break;
                    case 'pattern': 
                        text = `${error.control_name} tiene un patrón incorrecto!`; 
                        break;
                    case 'email': 
                        text = `${error.control_name} tiene un formato de correo electrónico incorrecto!`; 
                        break;
                    case 'minlength': 
                        text = `${error.control_name} debe teneral menos ${error.error_value.requiredLength} caracteres!`; 
                        break;
                    case 'areEqual': 
                        text = `${error.control_name} debe ser igual!`; 
                        break;
                    default: 
                        text = `${error.control_name}: ${error.error_name}: ${error.error_value}`;
                    }
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: text,
                    });
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
                      Swal.fire({
                        title: "El ticket se ha creado con éxito",
                        icon: "success"
                      });
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
              }else{
                const error: AllValidationErrors|undefined = getFormValidationErrors(this.ticketForm.controls).shift();
                if (error) {
                    let text;
                    switch (error.error_name) {
                    case 'required': 
                        text = `Falta ${error.control_name}!`; 
                        break;
                    case 'pattern': 
                        text = `${error.control_name} tiene un patrón incorrecto!`; 
                        break;
                    case 'email': 
                        text = `${error.control_name} tiene un formato de correo electrónico incorrecto!`; 
                        break;
                    case 'minlength': 
                        text = `${error.control_name} debe tener al menos ${error.error_value.requiredLength} caracteres!`; 
                        break;
                    case 'areEqual': 
                        text = `${error.control_name} debe ser igual!`; 
                        break;
                    default: 
                        text = `${error.control_name}: ${error.error_name}: ${error.error_value}`;
                    }
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: text,
                    });
                }
            }
        }
    }
        
}