import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inject AuthService
  const router = inject(Router);  // Inject Router
  
  // Check if user is authenticated (i.e., if a valid token exists)
  if (authService.isAuthenticated()) {
    return true;  // Allow navigation if authenticated
  } else {
    // If not authenticated, redirect to login page
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;  // Deny navigation
  }
};
