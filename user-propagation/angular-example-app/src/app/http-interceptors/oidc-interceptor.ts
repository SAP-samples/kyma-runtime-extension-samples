import { Injectable, Injector } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { Observable } from 'rxjs'

@Injectable()
export class OIDCInterceptor implements HttpInterceptor {
    private oidcSecurityService: OidcSecurityService;

    constructor(private injector: Injector){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let requestToForward = req;

        if (this.oidcSecurityService === undefined) {
            this.oidcSecurityService = this.injector.get(OidcSecurityService);
        }
        if (this.oidcSecurityService !== undefined) {
            const token = this.oidcSecurityService.getIdToken();
            if (token !== '') {
                const tokenValue = 'Bearer ' + token;
                requestToForward = req.clone({ setHeaders: { Authorization: tokenValue } });
            }
        }

        return next.handle(requestToForward);
    }
}