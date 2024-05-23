import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Response } from '../../models/responses';
import { CurrentUser } from '../../models/users';
import { Ticket } from '../tickets/tickets.component';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewAuditsComponent } from './audit-view/audit.view.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-audits',
  standalone: true,
  imports: [NgFor, NgForOf, NgIf],
  templateUrl: './audits.component.html',
  styleUrl: './audits.component.css'
})
export class AuditsComponent implements OnInit {
  private modalService = inject(NgbModal);
  public tickets:any=[];
  public selectedTicket: Ticket | null = null;
  public response: any | null = null; // Usar'cualquiera' para el objeto de respuesta
  constructor(
    private _httpReq: HttpClient,
  ){

  }

  ngOnInit(): void {
    this.tickets = this.getTickets();
    console.log(this.getTickets())
  }

  getTickets(){
    let currentUser:CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentUser.token}`,
    });
    this._httpReq.get<Response>('http://localhost:3000/api/v1/tickets', { headers })
        .subscribe({
          next: (response) => {
            if (response.status == 'success') {
              console.log('Listo pa procesar los datiños')
            } else if (response.data) { // procesar datos
              this.tickets = (response.data as unknown as Ticket[]).map((ticketData: any) => {
                // Crear un nuevo objeto Ticket a partir de ticketData
                const ticket: Ticket = {
                  id: ticketData.id,
                  title: ticketData.title,
                  description: ticketData.description, 
                  priority: ticketData.priority,
                  service: ticketData.service,
                  status: ticketData.status,
                  
                };
                return ticket;
              });
            } else {
              console.error('error.');
            }
          },
          error: (error) => {
            console.error('Error en la busqueda tickets:', error);
          },
    });
  }

  viewTicketAudit(ticketId:number){
    const modalRef = this.modalService.open(ViewAuditsComponent,{ size: 'xl' });
		modalRef.componentInstance.ticketId = ticketId;
  }
}
