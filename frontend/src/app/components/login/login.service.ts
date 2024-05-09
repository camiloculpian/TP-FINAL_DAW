import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
// import { Response } from '../../models/responses';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private _httpReq:HttpClient,
  ) {}

  login(username:string, password:string){
    return this._httpReq.post("http://localhost:3000/api/v1/auth/login", {"username":username, "password":password})
    // .pipe(
      // map((response) => ({
      //   statusCode: response.statusCode,
      //   status: response.status,
      //   message: response.message,
      //   data: response.data
      // }))
    // );
    // catchError(this.handleError<Question[]>('getAllQuestions', [])));

    // .pipe(
    //   tap(_ => console.log('fetched heroes')),
    //   catchError(this.handleError<Response>('login'))
    // );
    // .subscribe({
    //   next: data => {
    //     console.log(data);
    //     return JSON.parse(data.toString());
    //   },
    //   error: error => {
    //     return error;
    //   }
    // })
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  
  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead
  
  //     // TODO: better job of transforming error for user consumption
  //     console.log(`${operation} failed: ${error.message}`);
  
  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }
  
}
