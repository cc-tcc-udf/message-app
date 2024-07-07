import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../env/env';
import { UserResponse } from '../interfaces/UserResponse';
import { Usuario } from '../interfaces/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$: Observable<Usuario | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  private handleError(error: unknown): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong'));
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
        .pipe(
          catchError(this.handleError),
          map(user => {
            return this.userSubject.next(user);
          })
        )
        .subscribe();
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
    this.userSubject.next(null);
  }

  getUser(dados: UserResponse): Observable<Usuario> {
    if (!dados.token) {
      return throwError(() => new Error('Missing token'));
    }
    const url = `${environment.API_URL}/private/auth/getUser?email=${encodeURIComponent(dados.email)}`;
    return this.http.get<Usuario>(url).pipe(catchError(this.handleError));
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
