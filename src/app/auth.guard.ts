import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  // During SSR (Server-Side Rendering on Node.js), sessionStorage is not defined.
  // Allow the server to render the shell; browser hydration will perform the real auth check.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    })
  );
};
