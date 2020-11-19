import { Component, OnInit } from '@angular/core';
import { HeadersService } from '../headers.service';
import { HeadersResp } from './../header';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit {
  loading = true;
  headersMap: Map<string,string>;
  constructor(private headersService:HeadersService) { }

  ngOnInit(): void {
    this.headersService.getHeaders()
    .subscribe(headersResp => {
      this.headersMap = headersResp.headers;
      this.loading = false;
    })
  }

}
