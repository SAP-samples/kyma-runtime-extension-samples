import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Task, TaskResponse} from './task'
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class C4cTasksService {
  c4cTasksUrl = environment.c4cExtensionUrl;
  constructor(private http: HttpClient) {}

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  }

  createTask(subject:string): Observable<TaskResponse> {
    console.log(`Create task with subject ${subject}`);
    const taskRequest:Task = {subject:subject}
    const url = `${this.c4cTasksUrl}/tasks`;
    return this.http.post<TaskResponse>(url, taskRequest, this.getHttpOptions()).pipe(
        tap(resp => console.log(`created Task ${JSON.stringify(resp)}`)),
        catchError(this.handleError<TaskResponse>('created tasks'))
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
