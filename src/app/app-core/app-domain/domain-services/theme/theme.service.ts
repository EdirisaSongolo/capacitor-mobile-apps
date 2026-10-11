import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  AppTheme,
  ThemePreference,
} from '@domain-data-models/app-domain.enums';
import { AppDomainConstants } from '@domain-data-models/app-domain.constants';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private systemTheme: MediaQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );
  private themePreference: ThemePreference = ThemePreference.system;
  private themeSubject: BehaviorSubject<AppTheme> =
    new BehaviorSubject<AppTheme>(this.resolveTheme());
  public themeObservable: Observable<AppTheme> =
    this.themeSubject.asObservable();

  constructor() {
    this.systemTheme.addEventListener('change', () => this.applyTheme());
  }

  public applySystemTheme(): void {
    this.themePreference = ThemePreference.system;
    this.applyTheme();
  }

  public applyUserTheme(themePreference: ThemePreference): void {
    this.themePreference = themePreference;
    this.applyTheme();
  }

  public applyStoredTheme(): void {
    const storedPreference = localStorage.getItem(
      AppDomainConstants.THEME_PREFERENCE
    ) as ThemePreference;

    if (storedPreference) {
      this.applyUserTheme(storedPreference);
      return;
    }

    this.applySystemTheme();
  }

  public saveUserTheme(themePreference: ThemePreference): void {
    localStorage.setItem(AppDomainConstants.THEME_PREFERENCE, themePreference);
    this.applyUserTheme(themePreference);
  }

  public clearUserTheme(): void {
    localStorage.removeItem(AppDomainConstants.THEME_PREFERENCE);
    this.applySystemTheme();
  }

  private applyTheme(): void {
    const theme: AppTheme = this.resolveTheme();
    document.documentElement.dataset['theme'] = theme;
    this.themeSubject.next(theme);
  }

  private resolveTheme(): AppTheme {
    if (this.themePreference === ThemePreference.light) return AppTheme.light;
    if (this.themePreference === ThemePreference.dark) return AppTheme.dark;
    if (this.systemTheme.matches) return AppTheme.dark;
    return AppTheme.light;
  }
}
