import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth-core/auth-service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.checkUserAuthentication();

  return authService.userAuthenicated$.pipe(
    take(1),
    map(authenticated => authenticated || router.createUrlTree(['/auth']))
  );
};
