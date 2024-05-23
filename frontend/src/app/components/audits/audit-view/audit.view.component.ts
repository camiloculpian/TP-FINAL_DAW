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
import * as Papa from 'papaparse';
import * as jsPDF from 'jspdf';
import html2canvas from "html2canvas";

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

  // Descargar csv con papaparse
  downloadCSV() {
    const csvData = Papa.unparse(this.audits);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'tickets.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // Descargar pdf con jspdf
  downloadPDF() {
    setTimeout(() => {
      const element = document.getElementById('audits-table');
      if (element) {
        console.log('Elemento encontrado:', element);

        
        const actionsColumn = element.querySelector('.actions-column') as HTMLElement;
        if (actionsColumn) {
          actionsColumn.style.display = 'none';
        }

        html2canvas(element).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          console.log('Datos de la imagen:', imgData);
          const pdf = new jsPDF.default({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
          });
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('audit.pdf');

          // Restaurar la visibilidad de la columna de acciones y botones
          if (actionsColumn) {
            actionsColumn.style.display = '';
          }
        }).catch(error => {
          console.error('Error al generar PDF:', error);

          // Restaurar la visibilidad de la columna de acciones y botones en caso de error
          if (actionsColumn) {
            actionsColumn.style.display = '';
          }
        });
      } else {
        console.error('Elemento no encontrado');
      }
    }, 50); // Retraso de 50 ms
  }
}
