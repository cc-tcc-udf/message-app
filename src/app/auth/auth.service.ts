import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/env';
import { UserResponse } from '@models/UserResponse';
import { Usuario } from '@models/Usuario';
import { AlertService } from '@utils/services/alert.service';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$: Observable<Usuario | null> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private alert: AlertService
  ) { }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }

  private setSessionStorage(response: UserResponse): void {
    sessionStorage.setItem('access_token', response.token);
    sessionStorage.setItem('user_email', response.email);
  }

  private clearSessionStorage(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_email');
  }

  initUser(): void {
    const userEmail = this.getUserEmail();
    const token = this.getAccessToken();

    if (userEmail && token) {
      this.getUser({ email: userEmail, token })
        .pipe(catchError(this.handleError))
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
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.clearSessionStorage();
    this.router.navigate(['/auth/login']);
    this.userSubject.next(null);
  }

  getUser(dados: UserResponse): Observable<Usuario> {
    if (!dados.token) {
      return throwError(() => new Error('Missing token'));
    }
    const url = `${environment.API_URL}/private/auth/getUser?email=${encodeURIComponent(dados.email)}`;
    return this.http.get<Usuario>(url).pipe
      (catchError(error => {
        this.logout();
        return this.handleError(error);
      })
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
