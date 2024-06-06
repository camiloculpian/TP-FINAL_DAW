import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewAuditsComponent } from './audit-view/audit.view.component';
import { TicketService } from '../tickets/tickets.service';
import { Ticket } from '../../dto/ticket';

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
  public response: any | null = null; 
  constructor(
    private ticketsService: TicketService,
  ){

  }

  ngOnInit(): void {
    this.tickets = this.getTickets();
    console.log(this.getTickets())
  }

  getTickets(){
    this.ticketsService.getTickets()
        .subscribe({
          next: (response) => {
            if (response.status == 'success') {
              console.log('Listo pa procesar los datiños')
            } else if (response.data) { 
              this.tickets = (response.data as unknown as Ticket[]).map((ticketData: any) => {
                const ticket: Ticket = {
                  id: ticketData.id,
                  title: ticketData.title,
                  description: ticketData.description,
                  asignedToUser: ticketData.asignedToUser,
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
