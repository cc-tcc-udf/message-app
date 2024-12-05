import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@auth/auth.service";
import { RefreshToken } from "@models/RefreshToken";
import { catchError, finalize, Observable, switchMap, throwError } from "rxjs";
import { ThemeService } from "./services/theme.service";

export const HttpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const theme = inject(ThemeService);

  const handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('HTTP Error:', error);

    const status = error.status;
    const message =
      status === 401
        ? 'Você não tem permissão para realizar essa requisição'
        : `Erro ${status}: ${error.message || 'Desconhecido'}`;

    router.navigate(['/error'], {
      queryParams: { errorCode: status, message },
    });

    return throwError(() => error);
  };

  const addAuthorizationHeader = (request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> => {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
  theme.show();

  if (auth.isAuthenticated()) {
    if (auth.isTokenExpired()) {
      return auth.refreshToken().pipe(
        switchMap((newToken: RefreshToken | null) => {
          if (newToken?.refreshToken) {
            const clonedReq = addAuthorizationHeader(req, newToken.refreshToken);
            return next(clonedReq);
          } else {
            console.warn('Token de atualização ausente ou inválido.');
            return next(req);
          }
        }),
        catchError(handleError),
        finalize(() => theme.hide()) // Finaliza o loading independentemente do resultado
      );
    } else {
      // Token ainda válido
      const clonedReq = addAuthorizationHeader(req, auth.getAccessToken());
      return next(clonedReq).pipe(
        catchError(handleError),
        finalize(() => theme.hide()) // Finaliza o loading
      );
    }
  } else {
    return next(req).pipe(
      catchError(handleError),
      finalize(() => theme.hide()) // Finaliza o loading
    );
  }
};