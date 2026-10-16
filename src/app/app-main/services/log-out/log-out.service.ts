import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthService } from '@auth-core/auth-service';
import { logout } from '@core-modules';
import { SideNavService, ThemeService } from '@domain-services/index';

@Injectable({
  providedIn: 'root',
})
export class LogOutService {
  constructor(
    private authService: AuthService,
    private sideNav: SideNavService,
    private store: Store,
    private themeService: ThemeService
  ) {}

  public logOutUser(): void {
    this.themeService.clearUserTheme();
    this.authService.deleteClientTokens();
    this.store.dispatch(logout());
    this.sideNav.updateIsOpen();
  }
}
