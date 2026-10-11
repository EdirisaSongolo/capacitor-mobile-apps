import { Injectable } from '@angular/core';
import { createAppResponse } from '@core-modules';
import { AppResponseType } from '@domain-data-models/app-domain.enums';
import { AppResponse } from '@domain-data-models/app-domain.interfaces';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AppResponseService {
  constructor(
    private store: Store,
    private translator: TranslateService
  ) {}

  public createAppResponse(
    responseType: AppResponseType,
    messages: string[]
  ): void {
    const responseMessages: string[] = messages.map(message =>
      this.translator.instant(message)
    );

    const appResponse: AppResponse = {
      viewed: false,
      type: responseType,
      messages: [...responseMessages],
    };

    this.store.dispatch(createAppResponse({ appResponse: appResponse }));
  }
}
