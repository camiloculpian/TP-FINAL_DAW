import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Response } from "../../models/responses";

@Injectable({
    providedIn: 'root',
  })
  export class AuditsService {
    constructor(private _httpReq: HttpClient) {}

    getAudits(ticketId: number): Observable<Response> {
        return this._httpReq.get<any>(`http://localhost:3000/api/v1/ticket-audits/${ticketId}`);
    }
}