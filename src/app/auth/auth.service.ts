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

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // private handleError(error:T): Observable<never> {
  //   if (error.status === 401 || error.status === 403) {
  //     this.logout();
  //   }
  //   const errorMessage = error.error?.message || 'An unexpected error occurred';
  //   return throwError(() => new Error(errorMessage));
  // }
  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }

  private setSessionStorage(response: UserResponse): void {
    sessionStorage.setItem('access_token', response.token);
    sessionStorage.setItem('user_email', response.email);
  }

  private clearSessionStorage(): void {
    sessionStorage.clear();
  }

  initUser(): void {
    const userEmail = this.getUserEmail();
    const token = this.getAccessToken();

    if (userEmail && token) {
      this.getUser({ email: userEmail, token })
        .pipe(
          catchError(() => of(null)) // Caso ocorra erro, inicializa o usuário como null
        )
        .subscribe(user => this.userSubject.next(user));
    } else {
      this.userSubject.next(null);
    }
  }

  login(usr: Usuario): Observable<UserResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserResponse>(`${environment.API_URL}/public/auth/login`, usr, { headers })
      .pipe(
        tap(response => this.setSessionStorage(response)),
        tap(() => this.initUser()), // Inicializa o usuário após login
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.clearSessionStorage();
    this.router.navigate(['/auth/login']);
    this.userSubject.next(null);
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
    return sessionStorage.getItem('access_token');
  }

  getUserEmail(): string | null {
    return sessionStorage.getItem('user_email');
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
