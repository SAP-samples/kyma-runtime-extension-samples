import { R3ExpressionFactoryMetadata } from '@angular/compiler/src/render3/r3_factory';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private subject: Subject<any>;

  constructor() { }

  public connect(url): Subject<any> {
    if (!this.subject) {
      this.subject = webSocket(url);
      console.log(`websocket connection established: ${url}`);
    }
    return this.subject;
  }

  public getEvents(): Observable<any> {
    return this.subject.asObservable();
  }
}
