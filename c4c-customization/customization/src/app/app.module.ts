import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FundamentalNgxModule } from 'fundamental-ngx';
import { CustomizationFormComponent } from './customization-form/customization-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { AuthModule, ConfigResult, OidcConfigService, OidcSecurityService, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { AutoLoginComponent } from './auto-login/auto-login.component';
import { httpInterceptorProviders } from './http-interceptors';



export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load_using_custom_stsServer(
    'https://kyma-integration-test.accounts400.ondemand.com/.well-known/openid-configuration'
);
}


@NgModule({
  declarations: [
    AppComponent,
    CustomizationFormComponent,
    AutoLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FundamentalNgxModule,
    HttpClientModule,
    ColorPickerModule,
    FormsModule,
    AuthModule.forRoot(),
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
            client_id: 'T000000',
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
