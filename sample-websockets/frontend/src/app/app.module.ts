import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import {environment} from 'src/environments/environment'
@NgModule({
  imports: [
    BrowserModule, 
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.backendApiUrl, environment.backendWsUrl],
        sendAccessToken: true,
      }
    }), 
    HttpClientModule
  ],
  declarations: [AppComponent],
  providers: [
    { provide: OAuthStorage, useValue: localStorage }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }