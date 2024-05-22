import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ticket } from "./tickets.component";
import { Injectable } from "@angular/core";
import { CurrentUser } from "../../models/users";
import { FormGroup } from "@angular/forms";

// Servicio de Tickets
@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private apiUrl = 'http://localhost:3000/api/v1/tickets';
    private currentUser: CurrentUser;

    constructor(private http: HttpClient) { 
        this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    }

    getTickets(headers: HttpHeaders): Observable<any> {
        return this.http.get<any>(this.apiUrl, { 
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.currentUser.token}`,
            })
        });
    }

    getTicket(ticketId:number|undefined): Observable<any> {
        return this.http.get<any>(this.apiUrl+`/${ticketId}`, { 
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.currentUser.token}`,
            })
         });
    }

    updateTicket(ticketId:number, ticket: Ticket){

        return this.http.patch<any>(this.apiUrl+`/${ticketId}`, ticket,{
            headers: new HttpHeaders({
                'Authorization': String('Bearer ' + this.currentUser.token),
            })
        });
    }

    addTicket(ticket: Ticket): Observable<any> {
        return this.http.post<any>(this.apiUrl, ticket, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.currentUser.token}`,
            })
        });
    }

    deleteTicket(ticketId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${ticketId}`, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.currentUser.token}`,
            })
        });
    }
}