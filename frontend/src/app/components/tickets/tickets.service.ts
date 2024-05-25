import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Response } from "../../models/responses";
import { Ticket } from "../../models/ticket";

// Servicio de Tickets
@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private apiUrl = 'http://localhost:3000/api/v1/tickets';

    constructor(private http: HttpClient) { }

    getTickets(): Observable<Response> {
        return this.http.get<any>(this.apiUrl);
    }

    getTicket(ticketId:number): Observable<any> {
        return this.http.get<any>(this.apiUrl+`/${ticketId}`);
    }

    updateTicket(ticketId:number, ticket: Ticket){

        return this.http.patch<any>(this.apiUrl+`/${ticketId}`, ticket);
    }

    addTicket(ticket: Ticket): Observable<any> {
        return this.http.post<any>(this.apiUrl, ticket);
    }

    deleteTicket(ticketId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${ticketId}`);
    }
}