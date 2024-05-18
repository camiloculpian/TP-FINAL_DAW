import { CommonModule, NgForOf } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { NgbHighlight } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../../modal/modal.component";
import { UsersService } from "../users.service";
import { Response } from "../../../models/responses";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { sha512 } from "js-sha512";

@Component({
    selector: 'app-add-edit-user',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, NgForOf, NgbHighlight, ModalComponent],
    templateUrl: './add.edit.user.component.html',
    styleUrls: ['../users.component.css']
  })
  export class AddEditUsersComponent implements OnInit {
    userForm : FormGroup;
    private response:Response|null = null;
    private userId:number|null=null;
    constructor(
        private usersService:UsersService,
        private fbuilder: FormBuilder,
        // @Inject('userId') private userId?: number|null,
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
            phone: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            gender: new FormControl('', Validators.required),
        });
        if(this.userId){
            //this.usersService.getUser(2).subscribe(resp => console.log(resp));
        }else{
            
        }
    }

    ngOnInit(){
        
    }

    onAddUser(e:Event){
        e.preventDefault();
        let formObj = this.userForm.getRawValue();
        formObj.password = sha512(String(formObj.password));
        console.log(JSON.stringify(formObj));
        this.usersService.addUser(JSON.parse(JSON.stringify(formObj))).subscribe(
            (resp) => {
                if(resp.statusCode==201){
                
                }
            },(err) => {
                //console.log('**CUAK!'+JSON.stringify(err.response));
                console.log(err.error.message);
            }
        )
        //this.usersService.addUser(this.user).subscribe(resp => this.response = resp);
    }
  }