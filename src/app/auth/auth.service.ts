import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/env';
import { GenericResponse } from '@models/GenericResponse';
import { RefreshToken } from '@models/RefreshToken';
import { Roles_user } from '@models/Roles';
import { UserResponse } from '@models/UserResponse';
import { Login, Usuario } from '@models/Usuario';
import { AlertService } from '@utils/services/alert.service';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$: Observable<Usuario | null> = this.userSubject.asObservable();
  private authInitializedSubject = new BehaviorSubject<boolean>(false);
  isAuthInitialized$ = this.authInitializedSubject.asObservable();
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
    if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
      sessionStorage.setItem('user_email', response.email);
    }
  }

  setToken(token: string) {
    if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
      sessionStorage.setItem('access_token', token);
    }
  }
  setUserInSessionStorage(user: Usuario): void {
    this.userSubject.next(user);
    if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUserFromSessionStorage(): Usuario | null {
    const user = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined' ? sessionStorage.getItem('user') : null;
    return user ? JSON.parse(user) as Usuario : null;
  }

  private clearSessionStorage(): void {
    if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  }

  initUser(): void {
    if (this.isUserInitialized) return;

    const user = this.getUserFromSessionStorage();
    if (user) {
      this.userSubject.next(user);
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
            catchError(() => {
              this.userSubject.next(null);
              return of(null);
            })
          )
          .subscribe();
      } else {
        this.userSubject.next(null);
      }
    }
    this.isUserInitialized = true;
    this.authInitializedSubject.next(true);
  }



  login(usr: Login): Observable<UserResponse> {
    usr.isMobile = false;
    return this.http.post<UserResponse>(`${environment.API_URL}/public/auth/login`, usr)
      .pipe(
        tap(response => {
          this.setSessionStorage(response);
          this.getUser({ email: response.email, token: response.token })
            .pipe(
              tap(user => {
                this.userSubject.next(user);
                this.setUserInSessionStorage(user);
              }),
              catchError(() => {
                this.userSubject.next(null);
                return of(null);
              })
            )
            .subscribe();
        }),
        catchError(this.handleError)
      );
  }


  logout(): void {
    this.clearSessionStorage();
    this.userSubject.next(null);
    this.isUserInitialized = false;
    this.router.navigate(['/auth/login']);
  }

  getUser(dados: UserResponse): Observable<Usuario> {
    const url = `${environment.API_URL}/private/auth/getUser?email=${encodeURIComponent(dados.email)}`;
    return this.http.get<Usuario>(url).pipe(
      catchError(this.handleError)
    );
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) { return true; }

    const payload = this.decodeToken(token);
    if (!payload?.exp) { return true; }
    const expirationDate = new Date(payload.exp * 1000);
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
      const url = `${environment.API_URL}/public/refreshToken?email=${encodeURIComponent(email)}&isMobile=false`;
      return this.http.get<RefreshToken>(url).pipe(
        tap((token: RefreshToken) => {
          if (token) {
            this.setToken(token.refreshToken);
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

  register(usr: Usuario): Observable<GenericResponse> {
    const params = { isMobile: false.toString() };
    return this.http.post<GenericResponse>(`${environment.API_URL}/public/auth/register`, usr, { params })
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
    const userRoles = Array.isArray(user?.roles) ? user.roles : [];
    return roles.some(role => userRoles.includes(role));
  }
  getUserRoles() {
    const user = this.getUserFromSessionStorage();
    const userRoles = Array.isArray(user?.roles) ? user.roles : [];
    return userRoles as Roles_user[];
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
