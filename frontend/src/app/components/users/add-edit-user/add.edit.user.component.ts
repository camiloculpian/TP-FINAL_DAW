import { CommonModule, NgForOf } from "@angular/common";
import { Component, EventEmitter, inject, Inject, Input, OnInit, Output } from "@angular/core";
import { NgbActiveModal, NgbHighlight } from "@ng-bootstrap/ng-bootstrap";
import { UsersService } from "../users.service";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { sha512 } from "js-sha512";
import Swal from "sweetalert2";
import { AllValidationErrors, getFormValidationErrors } from "../../../utils/validations";

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
    @Output() messageEventOut = new EventEmitter<string>();
    @Input() user:any;
    @Input() name: string|undefined;
    activeModal = inject(NgbActiveModal);
    inputMissingMessage:string='';
    constructor(
        private usersService:UsersService,
        private fbuilder: FormBuilder,
    ) {
        this.userForm = this.fbuilder.group({
            username: new FormControl('', Validators.required),
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
            this.userForm.addControl('password', new FormControl('',Validators.minLength(8)))
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
        }else{
            // La contraseña es requerida porque es para agregar uno NUEVO
            this.userForm.addControl('password', new FormControl('',[Validators.required, Validators.minLength(8)]))
        }
    }

    onSave(e:Event){
        e.preventDefault();
        if(this.userId){
            console.log('es edicion');
            if (this.userForm.valid) {
                this.inputMissingMessage='';
                let formObj = this.userForm.getRawValue();
                if(formObj.password==''){
                    console.log('formObj.password = '+formObj.password);
                    delete formObj.password;
                }else{
                    console.log('formObj.password = '+formObj.password);
                    formObj.password = sha512(String(formObj.password));
                }
                this.usersService.editUser(JSON.parse(JSON.stringify(formObj)), this.userId).subscribe(
                    (resp) => {
                        if(resp.statusCode==201){
                            this.activeModal.close();
                            Swal.fire({
                                title: resp.message,
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
            } else {
                const error: AllValidationErrors|undefined = getFormValidationErrors(this.userForm.controls).shift();
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
            if (this.userForm.valid) {
                this.inputMissingMessage='';
                let formObj = this.userForm.getRawValue();
                formObj.password = sha512(String(formObj.password));
                this.usersService.addUser(JSON.parse(JSON.stringify(formObj))).subscribe(
                    (resp) => {
                        if(resp.statusCode==201){
                            this.activeModal.close();
                            //FALTA EMITIR UN EVENTO PARA REFRESCAR LA PAGINA PADRE!!!
                            Swal.fire({
                                title: resp.message,
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
            } else {
                const error: AllValidationErrors|undefined = getFormValidationErrors(this.userForm.controls).shift();
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