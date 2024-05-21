// ORIGINAL CODE V1.0

// import { NgFor, NgForOf, NgIf } from "@angular/common";
// import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { Component, Input, OnInit } from "@angular/core";
// import { CurrentUser } from "../../../models/users";

// @Component({
//     selector: 'app-view-audits',
//     standalone: true,
//     imports: [NgFor, NgForOf, NgIf],
//     templateUrl: './audit.view.component.html',
//     styleUrl: '../audits.component.css'
//   })
//   export class ViewAuditsComponent implements OnInit {
//     @Input({ required: true }) ticketId!: number;
//     public audits:any=[];
//     public response: any | null = null; // Usar'cualquiera' para el objeto de respuesta
//     constructor(
//       private _httpReq: HttpClient,
//     ){
    
//     }
  
//     ngOnInit(): void {
//       this.audits = this.getAudits(this.ticketId);
//     }

//     getAudits(ticketId:number){
//         let currentUser:CurrentUser = JSON.parse(String(localStorage.getItem('user')));
//         const headers = new HttpHeaders({
//             Authorization: `Bearer ${currentUser.token}`,
//         });
//         this._httpReq.get<any>(`http://localhost:3000/api/v1/ticket-audits/${this.ticketId}`, {headers}).subscribe(
//             (response) => {
//                 this.audits = response.data;
//                 console.log(this.audits)},
//             (error) => {console.log(error)}
//         )
//     }
// }


// CODE MODIFIED V1.1
import { NgClass, NgFor, NgIf } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, inject, Input, OnInit} from "@angular/core";
import { CurrentUser } from "../../../models/users";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-view-audits',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './audit.view.component.html',
  styleUrls: ['../audits.component.css']
})
export class ViewAuditsComponent implements OnInit {
  @Input({ required: true }) ticketId!: number;
  activeModal = inject(NgbActiveModal);
  public audits: any[] = [];
  public modalOpened: boolean = false;
  

  constructor(
    private _httpReq: HttpClient,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAudits(this.ticketId);
  }

  getAudits(ticketId: number): void {
    let currentUser: CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentUser.token}`,
    });

    this._httpReq.get<any>(`http://localhost:3000/api/v1/ticket-audits/${ticketId}`, { headers }).subscribe(
      (response) => {
        //this.audits = response;
        this.audits = response.data; // esto devuelve un array vacio
        console.log(this.audits);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewTicketAudit(ticketId: number): void {
    this.getAudits(ticketId);
  }
}
