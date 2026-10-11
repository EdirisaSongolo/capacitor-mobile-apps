import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialImportsModules } from '@core-modules';
import { AppAuthRoutingModule } from '@app-auth/app-auth-routing.module';

import { AuthCoreModule } from '@auth-core/auth-core.module';
import { AuthStoreModule } from '@auth-core/store';
import { LoginSingupComponent } from '@app-auth/login-singup/login-singup.component';
import {
  SignUpComponent,
  LogInComponent,
  CredentialsRecoveryComponent,
} from '@app-auth/display-components';

import { AppDomainModule } from '@app-domain/app-domain.module';

@NgModule({
  declarations: [
    LoginSingupComponent,
    LogInComponent,
    SignUpComponent,
    CredentialsRecoveryComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportsModules,
    AppAuthRoutingModule,
    AuthCoreModule,
    AuthStoreModule,
    AppDomainModule,
  ],
})
export class AppAuthModule {}
