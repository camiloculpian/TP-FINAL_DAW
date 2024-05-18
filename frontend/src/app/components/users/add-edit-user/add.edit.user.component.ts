import { CommonModule, NgForOf } from "@angular/common";
import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { NgbHighlight } from "@ng-bootstrap/ng-bootstrap";
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
    private response:Response|null = null;
    @Output() messageEventOut = new EventEmitter<string>();
    @Input() user:any=undefined;
    
    constructor(
        private usersService:UsersService,
        private fbuilder: FormBuilder,
    ) {
        console.log('useId = '+this.user);
        this.userForm = this.fbuilder.group({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            dni: new FormControl('', Validators.required),
            birthDate: new FormControl('', Validators.required),
            role: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required,Validators.email]),
            phone: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            gender: new FormControl('', Validators.required),
        });
        if(this.user){
            console.log(this.user)
        }else{
            
        }
    }

    ngOnInit(){
        
    }

    onSave(e:Event){
        e.preventDefault();
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
    }
  }