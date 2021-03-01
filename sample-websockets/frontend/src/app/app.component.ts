import { Component, OnDestroy } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { authCodeFlowConfig } from './auth.config';
import { WebsocketService } from './websocket.service';
import {environment} from 'src/environments/environment'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  events: string[] = [];
  subscription: Subscription;
  title = 'Websocket Demo';

  constructor(private oauthService: OAuthService, private websocketService:WebsocketService) {
    this.setUpOAuth();
    this.setUpWebsocket();
  }
  
  private setUpWebsocket() {
    this.websocketService.connect(environment.backendWsUrl);
    this.subscription = this.websocketService.getEvents().subscribe(event => {
      if (event) {
        this.events.push(JSON.stringify(event));
        console.log(`got websocket event: ${JSON.stringify(event)}`);
      }
    });
  }

  private setUpOAuth() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndLogin();
    this.oauthService.events
      .pipe(filter(e => e.type === 'token_received'))
      .subscribe(_ => this.oauthService.loadUserProfile());

    this.oauthService.setupAutomaticSilentRefresh();
    // Automatically load user profile
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get userName(): string {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return claims['given_name'];
  }

  get idToken(): string {
    return this.oauthService.getIdToken();
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  refresh() {
    this.oauthService.refreshToken();
  }

  get refreshToken() {
    return this.oauthService.getRefreshToken();
  }

}
