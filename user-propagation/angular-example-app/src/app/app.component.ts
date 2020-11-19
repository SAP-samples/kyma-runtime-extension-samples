import { Component, OnInit, OnDestroy } from '@angular/core';
import { OidcConfigService, OidcSecurityService, ConfigResult, AuthorizationState, AuthorizationResult } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Example app with identity propagation';
  isAuthenticated: boolean;
  isConfigurationLoaded: boolean;
  userData: any;

  constructor(
    private router: Router,
    private oidcConfigService: OidcConfigService,
    public oidcSecurityService: OidcSecurityService
  ) {
    if (this.oidcSecurityService.moduleSetup) {
      this.doCallbackLogicIfRequired();
    } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
        this.doCallbackLogicIfRequired();
      });
    }

    this.oidcSecurityService.onAuthorizationResult.subscribe(
      (authorizationResult: AuthorizationResult) => {
        this.onAuthorizationResultComplete(authorizationResult);
      });
  }

  ngOnInit() {
    this.oidcConfigService.onConfigurationLoaded.subscribe((value: ConfigResult) => {
      this.isConfigurationLoaded = true;
    });

    this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
      this.isAuthenticated = auth;
    });

    this.oidcSecurityService.getUserData().subscribe(userData => {
      this.userData = userData;
    });
  }

  ngOnDestroy(): void { }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  private doCallbackLogicIfRequired() {
    console.log('doCallbackLogicIfRequired');
    if (window.location.hash) {
      this.oidcSecurityService.authorizedImplicitFlowCallback();
    } else {
      if ('/autologin' !== window.location.pathname) {
        console.log('autologin');
        // this.write('redirect', window.location.pathname);
        // this.write('search', window.location.search);
        this.write('href', window.location.href);
      }
      console.log('AppComponent:onModuleSetup');
      this.oidcSecurityService.getIsAuthorized().subscribe((authorized: boolean) => {
        console.log('getIsAuthorized');
        if (!authorized) {
          console.log('Is not authorized');
          this.router.navigate(['/autologin']);
        }
      });
    }
  }

  private onAuthorizationResultComplete(authorizationResult: AuthorizationResult) {
    console.log('onAuthorizationResultComplete');
    // const path = this.read('redirect');
    // const search = this.read('search');
    const href = this.read('href');

    console.log('Auth result received AuthorizationState:'
      + authorizationResult.authorizationState
      + ' validationResult:' + authorizationResult.validationResult);

    if (authorizationResult.authorizationState === AuthorizationState.authorized) {
      // this.router.navigate([path], {queryParams: search});
      window.location.href = href;
    } else {
      this.router.navigate(['/Unauthorized']);
    }
  }

  private read(key: string): any {
    const data = localStorage.getItem(key);
    if (data != null) {
      return JSON.parse(data);
    }

    return;
  }

  private write(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
