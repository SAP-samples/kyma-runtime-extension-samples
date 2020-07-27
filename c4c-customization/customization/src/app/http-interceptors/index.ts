import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { OIDCInterceptor } from './oidc-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: OIDCInterceptor, multi: true },
];
