import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule, ConfigResult, OidcConfigService, OidcSecurityService, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeadersComponent } from './headers/headers.component';
import { AutoLoginComponent } from './auto-login/auto-login.component';
import { httpInterceptorProviders } from './http-interceptors';
import { environment } from 'src/environments/environment';
import { C4cTaskComponent } from './c4c-task/c4c-task.component';
import { FormsModule } from '@angular/forms';

export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load_using_custom_stsServer(
    environment.oidcUrl
);
}

@NgModule({
  declarations: [
    AppComponent,
    HeadersComponent,
    AutoLoginComponent,
    C4cTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,    
    AuthModule.forRoot(),
    FormsModule
  ],
  providers: [
    OidcConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: loadConfig,
        deps: [OidcConfigService],
        multi: true,
    },
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
    this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

        // Use the configResult to set the configurations

        const config: OpenIdConfiguration = {
            stsServer: configResult.customConfig.stsServer,
            redirect_url: window.location.origin + '/',
            client_id: environment.oidcClientId,
            scope: 'openid',
            response_type: 'id_token',
            log_console_debug_active: true,
            disable_iat_offset_validation: true,
            // all other properties you want to set
        };
        this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
    });
}
}
