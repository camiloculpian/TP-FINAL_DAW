import { CommonModule, NgForOf } from "@angular/common";
import { Component, EventEmitter, inject, Inject, Input, OnInit, Output } from "@angular/core";
import { NgbActiveModal, NgbHighlight } from "@ng-bootstrap/ng-bootstrap";
import { UsersService } from "../users.service";
import { Response } from "../../../models/responses";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { sha512 } from "js-sha512";
import Swal from "sweetalert2";

@Component({
    selector: 'app-add-edit-user',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, NgForOf, NgbHighlight],
    templateUrl: './add.edit.user.component.html',
    styleUrls: ['../users.component.css']
  })
  export class AddEditUsersComponent implements OnInit {
    userForm : FormGroup;
    userId:number=0;
    // private response:Response|null = null;
    @Output() messageEventOut = new EventEmitter<string>();
    @Input() user:any;
    @Input() name: string|undefined;
    activeModal = inject(NgbActiveModal);
    constructor(
        private usersService:UsersService,
        private fbuilder: FormBuilder,
    ) {
        this.userForm = this.fbuilder.group({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            dni: new FormControl('', Validators.required),
            birthDate: new FormControl('', Validators.required),
            role: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required,Validators.email]),
            phone: new FormControl('', [Validators.required,/*Validators.pattern('^(\\+?)\d{3,3}-?\d{2,2}-?\d{2,2}-?\d{3,3}$')*/]),
            address: new FormControl('', Validators.required),
            gender: new FormControl('', Validators.required),
        });
    }

    ngOnInit(){
        if(this.user){
            this.userId=this.user.id;
            this.userForm.patchValue({
                username: this.user.username,
                password: this.user.password,
                name: this.user.person.name,
                lastName: this.user.person.lastName,
                dni: this.user.person.dni,
                birthDate: this.user.person.birthDate,
                role: this.user.roles,
                email:this.user.person.email,
                phone:this.user.person.phone,
                gender: this.user.person.gender,
                address:this.user.person.address,
            });
        }
    }

    onSave(e:Event){
        e.preventDefault();
        if(this.userId){
            console.log('es edicion');
            if (this.userForm.valid) {
                console.log("very valid indeed");
            } else {
                console.log("very invalid :(");
            }
        }else{
            console.log('es nuevo');
            if (this.userForm.valid) {
                console.log("very valid indeed");
                let formObj = this.userForm.getRawValue();
                formObj.password = sha512(String(formObj.password));
                console.log(JSON.stringify(formObj));
                if(this.user){
                    // existe hay que editarlo!
                }else{
                    this.usersService.addUser(JSON.parse(JSON.stringify(formObj))).subscribe(
                        (resp) => {
                            if(resp.statusCode==201){
                                Swal.fire({
                                    title: 'Usuario añadido con éxito',
                                    icon: 'success'
                                });
                            }
                        },(err) => {
                            Swal.fire({
                                title: 'Error al añadir usuario',
                                text: err.error.message,
                                icon: 'error'
                            });
                        }
                    )
                }
            } else {
                console.log("very invalid :(");
            }
        }
    }
  }