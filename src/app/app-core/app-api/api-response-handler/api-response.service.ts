import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { createAppResponse } from '@core-modules';
import { AppResponseType } from '@domain-data-models/app-domain.enums';
import { AppResponse } from '@domain-data-models/app-domain.interfaces';
import { TranslateService } from '@ngx-translate/core';
import {
  ErrorResponseDTO,
  SuccessResponseDTO,
} from '@app-core/app-api/app-api.dto-models';

@Injectable({
  providedIn: 'root',
})
export class ApiResponseService {
  constructor(
    private translator: TranslateService,
    private router: Router
  ) {}

  public createSuccessResponse(successMessage: string): SuccessResponseDTO {
    const successResponse: SuccessResponseDTO = {
      successMessages: [successMessage],
      timeStamp: new Date(),
    };

    return successResponse;
  }

  public createApiCallSuccessResponse(
    successResponse: SuccessResponseDTO,
    proceedTo?: string[]
  ): Action<string> {
    const successMessages: string[] = successResponse.successMessages;
    const parameters: Map<string, string> = successResponse.parameters;

    const appResponse: AppResponse = {
      viewed: false,
      type: AppResponseType.success,
      messages: successMessages.map(successMessage =>
        this.translator.instant(successMessage, parameters)
      ),
    };

    if (proceedTo) {
      this.router.navigate(proceedTo, { replaceUrl: true });
    }

    return createAppResponse({ appResponse: appResponse });
  }

  public createApiCallErrorResponse(
    errorResponse: HttpErrorResponse
  ): Observable<Action<string>> {
    const errorDTO: ErrorResponseDTO = errorResponse.error;
    const errorStrings: string[] = errorDTO?.errorMessages;

    const errorMessages = errorStrings
      ? errorStrings.map(errorMessage => this.translator.instant(errorMessage))
      : [this.translator.instant('system-error.unexpected-error')];

    const appResponse: AppResponse = {
      viewed: false,
      type: AppResponseType.error,
      messages: errorMessages,
    };

    return of(createAppResponse({ appResponse: appResponse }));
  }
}
