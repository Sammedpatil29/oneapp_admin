import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { CommonService } from '../../src/app/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // This observable will cache the result of our one-time authentication check.
  private authCheck$: Observable<boolean> | null = null;

  constructor(
    private router: Router,
    private commonService: CommonService
  ) { }

  /**
   * This is the core method for the auth guard. It performs an asynchronous
   * check of the user's authentication status and caches the result
   * for the lifetime of the app session.
   */
  public isAuthenticated(): Observable<boolean> {
    if (this.authCheck$) {
      return this.authCheck$;
    }

    const token = sessionStorage.getItem('token');

    if (!token) {
      this.authCheck$ = of(false).pipe(shareReplay(1));
      return this.authCheck$;
    }

    // Client-side check for token expiration
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        this.clearSession();
        return this.authCheck$!;
      }
    } catch (error) {
      this.clearSession();
      return this.authCheck$!;
    }

    // Token exists and is not expired, now verify with the backend.
    this.authCheck$ = this.commonService.getUserDetails(token).pipe(
      map((response:any) => {
        if (response && response?.success) {
          this.isAuthenticatedSubject.next(true);
          return true;
        }
        this.clearSession();
        return false;
      }),
      catchError(() => {
        this.clearSession();
        return of(false);
      }),
      shareReplay(1) // Cache the result to avoid repeated API calls.
    );

    return this.authCheck$;
  }

  /**
   * Call this method from your login component on a successful login.
   */
  handleLoginSuccess(token: string): void {
    sessionStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
    this.authCheck$ = of(true).pipe(shareReplay(1));
  }

  /**
   * Centralized logout method.
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    sessionStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isAuthenticatedSubject.next(false);
    this.authCheck$ = of(false).pipe(shareReplay(1));
  }
}