import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HeadersResp } from './header';


@Injectable({
  providedIn: 'root'
})
export class HeadersService {

  httpOptions = {
    headers: null
  };
  usage: string;

  constructor(private http: HttpClient) {}

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  }
  getHeaders(): Observable<HeadersResp> {
    console.log('Get Headers...');
    const url = '/headers';
    return this.http.get<HeadersResp>(url, this.getHttpOptions())
      .pipe(
        tap(_ => console.log('fetched headers')),
        catchError(this.handleError<HeadersResp>('getHeaders'))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else if (error.status === 404) {
        console.log(`${operation}: 404`);
        return of(result as T);
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(errorMessage);
    };
  }
}
