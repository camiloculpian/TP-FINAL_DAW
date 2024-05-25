import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Response } from "../../models/responses";

@Injectable({
    providedIn: 'root',
  })
  export class AuditsService {
    private apiUrl = 'http://localhost:3000/api/v1';

    constructor(private _httpReq: HttpClient) {}

    getAudits(ticketId: number): Observable<Response> {
        return this._httpReq.get<any>(`${this.apiUrl}/ticket-audits/${ticketId}`);
    }
}