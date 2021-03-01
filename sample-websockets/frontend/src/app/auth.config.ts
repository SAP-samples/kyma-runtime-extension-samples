import { AuthConfig } from 'angular-oauth2-oidc';
import {environment} from 'src/environments/environment';

export const authCodeFlowConfig: AuthConfig = {
  issuer: environment.issuer,
  redirectUri: window.location.origin + '/index.html',
  clientId: environment.clientId,
  responseType: 'code',
  scope: 'openid profile email offline_access api',
  showDebugInformation: true,
  timeoutFactor: 0.75
};