import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CurrentUser } from '../../../dto/users';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Papa from 'papaparse';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AuditsService } from '../audits.service';

@Component({
  selector: 'app-view-audits',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './audit.view.component.html',
  styleUrls: ['../audits.component.css'],
})
export class ViewAuditsComponent implements OnInit {
  @Input({ required: true }) ticketId!: number;
  activeModal = inject(NgbActiveModal);
  public audits: any[] = [];
  public modalOpened: boolean = false;

  constructor(
    private auditsService: AuditsService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAudits(this.ticketId);
  }

  getAudits(ticketId: number): void {
    let currentUser: CurrentUser = JSON.parse(
      String(localStorage.getItem('user'))
    );
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentUser.token}`,
    });

    this.auditsService.getAudits(ticketId).subscribe({
      next: (response) => {
        this.audits = response.data;
        console.log(this.audits);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  viewTicketAudit(ticketId: number): void {
    this.getAudits(ticketId);
  }

  tableToJson(table: any) {
    var data = [];
    for (var i = 0; i < table.rows.length; i++) {
      var tableRow = table.rows[i];
      var rowData = [];
      for (var j = 0; j < tableRow.cells.length; j++) {
        rowData.push(tableRow.cells[j].innerHTML);
      }
      data.push(rowData);
    }
    return data;
  }

  // Download csv with papaparse
  downloadCSV() {
    const csvData = Papa.unparse(
      this.tableToJson(document.getElementById('audits-table'))
    );
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
  // Download pdf with jspdf
  downloadPDF() {
    setTimeout(() => {
      const element = document.getElementById('audits-table');
      if (element) {
        console.log('Elemento encontrado:', element);

        const actionsColumn = element.querySelector(
          '.actions-column'
        ) as HTMLElement;
        if (actionsColumn) {
          actionsColumn.style.display = 'none';
        }

        html2canvas(element)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            console.log('Datos de la imagen:', imgData);
            const pdf = new jsPDF.default({
              orientation: 'p',
              unit: 'mm',
              format: 'a4',
            });
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('audit.pdf');

            if (actionsColumn) {
              actionsColumn.style.display = '';
            }
          })
          .catch((error) => {
            console.error('Error al generar PDF:', error);

            if (actionsColumn) {
              actionsColumn.style.display = '';
            }
          });
      } else {
        console.error('Elemento no encontrado');
      }
    }, 50);
  }
}
