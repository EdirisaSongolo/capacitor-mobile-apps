import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthRestConstants } from '@auth-core/api';
import {
  LogIn,
  SignUp,
  AuthDTO,
  EmailDTO,
  PasswordResetDTO,
} from '@app-core/auth-core/api/auth.dto-models';
import { ApiService, SuccessResponseDTO } from '@app-core/app-api';
import { UserProfileInfo } from '@app-core/app-domain/domain-data-models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private apiService: ApiService) {}

  public registerUserProfile(signUp: SignUp): Observable<AuthDTO> {
    const requestMapping: string = `${AuthRestConstants.AUTH}/${AuthRestConstants.REGISTER_USER}`;
    return this.apiService.post<AuthDTO>(requestMapping, signUp);
  }

  public authenticateUserCredentials(logIn: LogIn): Observable<AuthDTO> {
    const requestMapping: string = `${AuthRestConstants.AUTH}/${AuthRestConstants.AUTHENTICATE_USER}`;
    return this.apiService.post<AuthDTO>(requestMapping, logIn);
  }

  public retrieveUserProfileInfo(
    authenticationDTO: AuthDTO
  ): Observable<UserProfileInfo> {
    const requestMapping: string = `${AuthRestConstants.AUTH}/${AuthRestConstants.GENERATE_USER_PROFILE_INFO}`;
    return this.apiService.post<UserProfileInfo>(
      requestMapping,
      authenticationDTO
    );
  }

  public createTemporaryPassword(
    userEmail: EmailDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${AuthRestConstants.AUTH}/${AuthRestConstants.CREATE_TEMPORARY_PASSWORD}`;
    return this.apiService.post<SuccessResponseDTO>(requestMapping, userEmail);
  }

  public resetUserPassword(
    passwordReset: PasswordResetDTO
  ): Observable<SuccessResponseDTO> {
    const requestMapping: string = `${AuthRestConstants.AUTH}/${AuthRestConstants.RESET_USER_PASSWORD}`;
    return this.apiService.post<SuccessResponseDTO>(
      requestMapping,
      passwordReset
    );
  }
}
