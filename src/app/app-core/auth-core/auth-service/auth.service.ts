import { Injectable } from '@angular/core';
import {
  authStatusSelector,
  userProfileInfoSelector,
} from '@app-store/app.selectors';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, map, Observable, take } from 'rxjs';

import { Preferences } from '@capacitor/preferences';
import { AppDomainConstants } from '@domain-data-models/app-domain.constants';
import { UserProfileInfo } from '@domain-data-models/app-domain.interfaces';
import { setAuthenticationStatus } from '@app-store/app.actions';
import { AuthDTO } from '@auth-core/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userAuthenicated: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public userAuthenicated$: Observable<boolean> =
    this.userAuthenicated.asObservable();

  private authenticationStatus$: Observable<boolean> =
    this.store.select(authStatusSelector);
  private userProfileInfo$: Observable<UserProfileInfo> = this.store.select(
    userProfileInfoSelector
  );

  private clientTokens: AuthDTO = { accessToken: '', refreshToken: '' };

  constructor(private store: Store) {
    this.authenticationStatus$.subscribe((authStatus: boolean) => {
      const accessTokenPresent: boolean = !!this.clientTokens.accessToken;

      const refreshTokenPresent: boolean = !!this.clientTokens.refreshToken;

      let currentAuthStatus: boolean | null = null;

      this.userAuthenicated$
        .pipe(take(1))
        .subscribe(authStatus => (currentAuthStatus = authStatus));

      if (accessTokenPresent && refreshTokenPresent && authStatus) {
        if (!currentAuthStatus) {
          this.userAuthenicated.next(true);
        }
      }

      if (accessTokenPresent && refreshTokenPresent && !authStatus) {
        if (currentAuthStatus) {
          this.store.dispatch(
            setAuthenticationStatus({ authenticationStatus: true })
          );
        }
      }

      if (!accessTokenPresent && !refreshTokenPresent && !authStatus) {
        if (currentAuthStatus) {
          this.userAuthenicated.next(false);
        }
      }
    });
  }

  public async loadClientTokens(): Promise<void> {
    const [accessToken, refreshToken] = await Promise.all([
      Preferences.get({ key: AppDomainConstants.ACCESS_TOKEN }),
      Preferences.get({ key: AppDomainConstants.REFRESH_TOKEN }),
    ]);

    this.clientTokens = {
      accessToken: accessToken.value ?? '',
      refreshToken: refreshToken.value ?? '',
    };
  }

  public setClientTokens(authDTO: AuthDTO): void {
    if (authDTO?.accessToken) {
      this.clientTokens.accessToken = authDTO.accessToken;
      void Preferences.set({
        key: AppDomainConstants.ACCESS_TOKEN,
        value: authDTO.accessToken,
      });
    }

    if (authDTO?.refreshToken) {
      this.clientTokens.refreshToken = authDTO.refreshToken;
      void Preferences.set({
        key: AppDomainConstants.REFRESH_TOKEN,
        value: authDTO.refreshToken,
      });
    }
  }

  public deleteClientTokens(): void {
    this.clientTokens = { accessToken: '', refreshToken: '' };
    void Preferences.remove({ key: AppDomainConstants.ACCESS_TOKEN });
    void Preferences.remove({ key: AppDomainConstants.REFRESH_TOKEN });

    this.userAuthenicated.next(false);
  }

  public checkUserAuthentication(): void {
    const accessTokenPresent: boolean = !!this.clientTokens.accessToken;
    const refreshTokenPresent: boolean = !!this.clientTokens.refreshToken;

    if (accessTokenPresent !== refreshTokenPresent) {
      this.deleteClientTokens();
      return;
    }

    const authenticated: boolean = accessTokenPresent && refreshTokenPresent;

    if (this.userAuthenicated.value !== authenticated) {
      this.userAuthenicated.next(authenticated);
    }
  }

  public retrieveClientTokens(): AuthDTO {
    return { ...this.clientTokens };
  }

  public retrieveUserName(): Observable<string> {
    return this.userProfileInfo$.pipe(
      map(userProfileInfo => userProfileInfo?.userName),
      filter((userName): userName is string => !!userName)
    );
  }
}
