import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Response } from "../../models/responses";
import { Ticket } from "../../models/ticket";
import { environment } from "../../../environment/environment";

// Servicio de Tickets
@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private apiUrl = environment.apiUrl;
    // private apiUrl = 'http://localhost:3000/api/v1';

    constructor(private http: HttpClient) { }

    getTickets(): Observable<Response> {
        return this.http.get<any>(this.apiUrl+'/tickets');
    }

    getTicket(ticketId:number): Observable<any> {
        return this.http.get<any>(this.apiUrl+`/tickets/${ticketId}`);
    }

    updateTicket(ticketId:number, ticket: Ticket){

        return this.http.patch<any>(this.apiUrl+`/tickets/${ticketId}`, ticket);
    }

    addTicket(ticket: Ticket): Observable<any> {
        return this.http.post<any>(this.apiUrl+'/tickets', ticket);
    }

    deleteTicket(ticketId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/tickets/${ticketId}`);
    }
}