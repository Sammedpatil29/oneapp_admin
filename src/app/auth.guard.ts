import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inject AuthService
  const router = inject(Router);  // Inject Router

  // IMPORTANT: For this to fix the flicker, your `AuthService.isAuthenticated()`
  // method must be changed to return an Observable<boolean>.
  // This observable should only emit `true` after it has successfully
  // verified the user's session (e.g., with an API call on app load).
  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true; // Allow navigation
      }
      // If not authenticated, redirect to the login page
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    })
  );
};
