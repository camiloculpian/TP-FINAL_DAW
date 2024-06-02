import { Component, OnInit, inject } from '@angular/core';
import { CurrentUser } from '../../dto/users';
import {  AsyncPipe, NgFor, NgForOf, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { AddEditTicketsComponent } from './add-edit-ticket/add.edit.ticket.component';
import { NgbHighlight, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import * as Papa from 'papaparse';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgbdSortableHeader, TicketService } from './tickets.service';
import { Ticket } from '../../dto/ticket';
import { ViewAuditsComponent } from '../audits/audit-view/audit.view.component';
import { FormsModule } from '@angular/forms';


export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [NgFor, NgForOf, NgIf, AddEditTicketsComponent, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})

export class TicketsComponent implements OnInit {
  private modalService = inject(NgbModal);
  public tickets:any=[]; // Usar una matriz escrita para boletos
  public selectedTicket: Ticket | null = null;
  public response: any | null = null; // Usar'cualquiera' para el objeto de respuesta
  currentUser!:CurrentUser;

  constructor(
    public ticketsService: TicketService,
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  }

  ngOnInit(): void {
    console.log('ngOnInit()');
    try{
      // obtencion de todos los tickets
      this.getTickets();
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
  }

  // confirmacion de borrado solo pa resolved
  confirmDeleteTicket(ticketId: number, ticketStatus: string): void {
    if (ticketStatus !== 'RESOLVED') {
      Swal.fire({
        title: 'Error',
        text: 'No se puede eliminar porque la tarea está en proceso.',
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: 'No podrá revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: { isConfirmed: boolean }) => {
      if (result.isConfirmed) {
        this.deleteTicket(ticketId);
      }
    });
  }

  // Borrar el ticket
  deleteTicket(ticketId: number): void {
    this.ticketsService.deleteTicket(ticketId).subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Ticket eliminado con éxito', 'success');
          this.tickets = this.tickets.filter((ticket: { id: number; }) => ticket.id !== ticketId);
        },
        error: (error) => {
          Swal.fire('Error', 'Error al eliminar el ticket', 'error');
          console.error('Error al eliminar el ticket:', error);
        }
      });
  }

  editTicket(ticketId:number){
    const modalRef = this.modalService.open(AddEditTicketsComponent);
    modalRef.componentInstance.ticketId =ticketId;
    modalRef.hidden.subscribe({next:()=>(this.getTickets())});
  }

  addTicket(){
    //const currentUser: CurrentUser = JSON.parse(String(localStorage.getItem('user')));
    const modalRef = this.modalService.open(AddEditTicketsComponent);
    modalRef.hidden.subscribe({next:()=>(this.getTickets())});
  }

  viewTicketAudit(ticketId:number){
    const modalRef = this.modalService.open(ViewAuditsComponent,{ size: 'xl' });
		modalRef.componentInstance.ticketId = ticketId;
  }

  getTickets(){
    this.ticketsService.tickets$.subscribe({
            next: (tickets) => {
                this.tickets = (tickets as unknown as Ticket[]).map((ticketData: any) => {
                  // Crear un nuevo objeto Ticket a partir de ticketData
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
            },
            error: (error) => {
              console.error('Error en la busqueda tickets:', error);
            },
      });
  }
  // Descargar csv con papaparse
  downloadCSV() {
    const csvData = Papa.unparse(this.tickets);
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
      const element = document.getElementById('tickets-table');
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
          pdf.save('tickets.pdf');

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