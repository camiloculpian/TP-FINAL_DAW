import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Response } from "../../dto/responses";
import { environment } from "../../../environment/environment";

@Injectable({
  providedIn: 'root',
})
export class AuditsService {
  private apiUrl = environment.apiUrl;
  // private apiURL: string = 'http://localhost:3000/api/v1'
  constructor(private _httpReq: HttpClient) {}

  getAudits(ticketId: number): Observable<Response> {
      return this._httpReq.get<any>(`${this.apiUrl}/ticket-audits/${ticketId}`);
  }
}