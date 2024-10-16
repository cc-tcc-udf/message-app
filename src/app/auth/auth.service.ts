import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/env';
import { GenericResponse } from '@models/GenericResponse';
import { RefreshToken } from '@models/RefreshToken';
import { Roles_user } from '@models/Roles';
import { UserResponse } from '@models/UserResponse';
import { Usuario } from '@models/Usuario';
import { AlertService } from '@utils/services/alert.service';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$: Observable<Usuario | null> = this.userSubject.asObservable();
  private isUserInitialized = false;
  private attToken = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private alert: AlertService
  ) { }

  private handleError(error: unknown): Observable<never> {
    return throwError(() => error);
  }

  private setSessionStorage(response: UserResponse): void {
    this.setToken(response.token);
    sessionStorage.setItem('user_email', response.email);
  }

  setToken(token: string) {
    sessionStorage.setItem('access_token', token);
  }
  setUserInSessionStorage(user: Usuario): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromSessionStorage(): Usuario | null {
    const user = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
    return user ? JSON.parse(user) as Usuario : null;
  }

  private clearSessionStorage(): void {
    sessionStorage.clear();
  }

  initUser(): void {
    if (this.isUserInitialized) return;
    const user = this.getUserFromSessionStorage();
    if (user) {
      this.userSubject.next(user);
      this.isUserInitialized = true;
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

        this.isUserInitialized = true;
      } else {
        this.userSubject.next(null);
        this.isUserInitialized = true;
      }
    }
  }


  login(usr: Usuario): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.API_URL}/public/auth/login`, usr)
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
    this.isUserInitialized = false;
  }

  getUser(dados: UserResponse): Observable<Usuario> {
    const url = `${environment.API_URL}/private/auth/getUser?email=${encodeURIComponent(dados.email)}`;
    return this.http.get<Usuario>(url).pipe(
      catchError(this.handleError)
    );
  }

  isTokenExpired(): boolean {
    const token = sessionStorage.getItem('access_token');
    if (!token) { return true };

    const payload = this.decodeToken(token);
    const expirationDate = new Date(payload?.exp * 1000);
    return new Date() > expirationDate;
  }

  private decodeToken(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  refreshToken(): Observable<RefreshToken | null> {
    if (!this.attToken) {
      this.attToken = true;
      const email = this.getUserEmail();
      if (!email) {
        this.logout();
        return of(null);
      }
      const url = `${environment.API_URL}/public/refreshToken?email=${encodeURIComponent(email)}`;
      return this.http.get<RefreshToken>(url).pipe(
        tap((token: RefreshToken) => {
          if (token) {
            this.setToken(token.refreshToken);
            this.alert.showMsg('success', 'Token', 'token atualizado com sucesso');
          }
          this.attToken = false;
        }),
        catchError((error) => {
          this.attToken = false;
          this.logout();
          return throwError(() => error);
        })
      );
    } else {
      return of(null);
    }
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

  updateUser(usr: Usuario): Observable<GenericResponse> {
    return this.http.put<GenericResponse>(`${environment.API_URL}/private/auth/update`, usr)
      .pipe(catchError(this.handleError));
  }

  getProf() {
    return this.http.get<GenericResponse>(`${environment.API_URL}/public/auth/adm/listResp`)
      .pipe(catchError(this.handleError));
  }

  hasAnyRole(roles: Roles_user[]): boolean {
    const user = this.getUserFromSessionStorage();
    return roles.some(role => user?.roles.includes(role));
  }
  
  // Verifica se o usuário possui a role ADMIN
  isAdmin(): boolean {
    return this.hasRole(Roles_user.ADMIN);
  }

  // Verifica se o usuário possui a role PROF
  isProf(): boolean {
    return this.hasRole(Roles_user.PROF);
  }

  // Verifica se o usuário possui a role AUDIT
  isAudit(): boolean {
    return this.hasRole(Roles_user.AUDIT);
  }

  // Verifica se o usuário possui a role USER
  isUser(): boolean {
    return this.hasRole(Roles_user.USER);
  }

  private hasRole(role: Roles_user): boolean {
    const user = this.getUserFromSessionStorage();
    return user?.roles.includes(role) ?? false;
  }


}
