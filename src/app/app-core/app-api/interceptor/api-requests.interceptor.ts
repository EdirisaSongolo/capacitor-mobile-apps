import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, throwError } from 'rxjs';

import { AppDomainConstants } from '@domain-data-models/app-domain.constants';

import { AuthService } from '@auth-core/auth-service';
import { ApiRestConstants } from '@app-core/app-api/app-api.rest-constants';
import { ApiCallIndicatorService } from '@app-core/app-api/api-call-indicator/api-call-indicator.service';
import { AuthDTO } from '@auth-core/api';
import { LogOutService } from '@app-main/services/log-out/log-out.service';

@Injectable()
export class ApiRequestsInterceptor implements HttpInterceptor {
  private API_GATEWAY: string = ApiRestConstants.API_INGRESS;

  constructor(
    private authService: AuthService,
    private apiCallIndicator: ApiCallIndicatorService,
    private logOutService: LogOutService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const requestUrl: string = request.url;

    if (requestUrl.startsWith('/assets')) {
      return next.handle(request);
    }

    this.apiCallIndicator.updateApiCallIndicator(true);

    let httpHeaders = request.headers;
    const clientTokens: AuthDTO = this.authService.retrieveClientTokens();

    if (clientTokens.accessToken) {
      httpHeaders = httpHeaders.set(
        AppDomainConstants.ACCESS_TOKEN,
        clientTokens.accessToken
      );
    }

    if (clientTokens.refreshToken) {
      httpHeaders = httpHeaders.set(
        AppDomainConstants.REFRESH_TOKEN,
        clientTokens.refreshToken
      );
    }

    const completeRequestUrl: string = `${this.API_GATEWAY}/${requestUrl}`;
    const configuredRequest = request.clone({
      url: completeRequestUrl,
      headers: httpHeaders,
    });

    return next.handle(configuredRequest).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === HttpStatusCode.Unauthorized) {
          this.logOutService.logOutUser();

          if (!this.router.url.startsWith('/auth')) {
            this.router.navigate(['/auth'], {
              queryParams: { returnUrl: this.router.url },
            });
          }
        }

        return throwError(() => errorResponse);
      }),
      finalize(() => this.apiCallIndicator.updateApiCallIndicator(false))
    );
  }
}
