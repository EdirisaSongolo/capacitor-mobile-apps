import { inject, NgModule, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';
// core modules listed first
import {
  RootRoutingModule,
  MaterialImportsModules,
  TransalationConfigModule,
  AppStoreModule,
} from '@core-modules';
// app-core modules listed second
import { CommunicationsCoreModule } from '@communications-core/communications-core.module';
// app-modules listed third
import { AppMainModule } from '@app-main/app-main.module';

// providers and components
import { ApiRequestsInterceptor } from '@app-core/app-api';
import { AuthService } from '@auth-core/auth-service';
import { RootComponent } from '@root-component';

@NgModule({
  declarations: [RootComponent],
  imports: [
    BrowserModule,
    RootRoutingModule,
    MaterialImportsModules,
    TransalationConfigModule,
    NgxMaskDirective,
    AppStoreModule,
    CommunicationsCoreModule,
    AppMainModule,
  ],
  providers: [
    provideAppInitializer(() => inject(AuthService).loadClientTokens()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiRequestsInterceptor,
      multi: true,
    },
    provideEnvironmentNgxMask(),
  ],
  bootstrap: [RootComponent],
})
export class RootModule {}
