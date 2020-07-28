import { Injectable } from '@angular/core';
import {Customization} from './customization.model';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CustomizationService {

  data: Customization;
  customizationUrl =  environment.customizationUrl;
  createCustomizationUrl = environment.createCustomizationUrl;
  httpOptions = {
    headers: null
  };
  usage: string;

  constructor(
    private http: HttpClient  ) {
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
  }
  getCustomization(taskID: number): Observable<Customization> {
    console.log('Get Customization');
    const url = `${this.customizationUrl}/${taskID}`;
    return this.http.get<Customization>(url , this.getHttpOptions())
      .pipe(
        tap(_ => console.log('fetched customization')),
        catchError(this.handleError<Customization>('getCustomization'))
      );
  }

  createCustomization(taskID: number, customization: Customization): Observable<any> {
    const url = `${this.createCustomizationUrl}/${taskID}`;
    return this.http.put(url, customization, this.getHttpOptions()).pipe(
      tap(_ => this.log(`create customization id=${customization.id}`)),
      catchError(this.handleError<Customization>('createCustomization'))
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

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(`CustomizationService: ${message}`);
  }
}
