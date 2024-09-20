import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/env';
import { UserResponse } from '@models/UserResponse';
import { Usuario } from '@models/Usuario';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$: Observable<Usuario | null> = this.userSubject.asObservable();
  private isUserInitialized = false; // Flag to check if user is already loaded

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }

  private setSessionStorage(response: UserResponse): void {
    sessionStorage.setItem('access_token', response.token);
    sessionStorage.setItem('user_email', response.email);
  }

  private setUserInSessionStorage(user: Usuario): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromSessionStorage(): Usuario | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) as Usuario : null;
  }

  private clearSessionStorage(): void {
    sessionStorage.clear();
  }

  initUser(): void {
    if (this.isUserInitialized) return; // Prevent unnecessary calls

    const user = this.getUserFromSessionStorage();
    if (user) {
      this.userSubject.next(user);
      this.isUserInitialized = true; // Mark user as initialized
    } else {
      const userEmail = this.getUserEmail();
      const token = this.getAccessToken();

      if (userEmail && token) {
        this.getUser({ email: userEmail, token })
          .pipe(
            tap(user => {
              this.userSubject.next(user);
              this.setUserInSessionStorage(user);
            }),
            catchError(() => of(null))
          )
          .subscribe();

        this.isUserInitialized = true; // Mark user as initialized
      } else {
        this.userSubject.next(null);
        this.isUserInitialized = true; // Mark user as initialized
      }
    }
  }


  login(usr: Usuario): Observable<UserResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserResponse>(`${environment.API_URL}/public/auth/login`, usr, { headers })
      .pipe(
        tap(response => {
          this.setSessionStorage(response);
          this.getUser({ email: response.email, token: response.token })
            .pipe(
              tap(user => {
                this.setUserInSessionStorage(user);
                this.userSubject.next(user);
              }),
              catchError(() => of(null))
            )
            .subscribe();
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.clearSessionStorage();
    this.router.navigate(['/auth/login']);
    this.userSubject.next(null);
    this.isUserInitialized = false; // Reset flag on logout
  }

  getUser(dados: UserResponse): Observable<Usuario> {
    const url = `${environment.API_URL}/private/auth/getUser?email=${encodeURIComponent(dados.email)}`;
    return this.http.get<Usuario>(url).pipe(
      catchError(this.handleError)
    );
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getAccessToken(): string | null {
    return typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;
  }

  getUserEmail(): string | null {
    return typeof window !== 'undefined' ? sessionStorage.getItem('user_email') : null;
  }

  register(usr: Usuario): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.API_URL}/public/auth/register`, usr)
      .pipe(catchError(this.handleError));
  }

  updateUser(usr: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${environment.API_URL}/private/auth/update`, usr)
      .pipe(catchError(this.handleError));
  }
}
