import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/auth.service";
import { RefreshToken } from "@models/RefreshToken";
import { AlertService } from "@utils/services/alert.service";
import { catchError, finalize, Observable, switchMap, throwError } from "rxjs";
import { ThemeService } from "./services/theme.service";

export const HttpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const auth = inject(AuthService);
  const theme = inject(ThemeService);
  const alert = inject(AlertService);

  const handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('HTTP Error:', error);

    const status = error.status;
    const message =
      error.error?.message ||
      (status === 401
        ? 'Você não tem permissão para realizar essa requisição'
        : `Erro ${status}: ${error.statusText || 'Falha na comunicação com o servidor'}`);

    if (status === 401) {
      alert.showMsg('error', 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.');
      auth.logout();
    } else if (status === 0) {
      alert.showMsg('error', 'Falha de Conexão', 'Não foi possível conectar ao servidor backend. Verifique se o serviço está ativo.');
    } else {
      alert.showMsg(alert.getSeverity(status), 'Erro na Requisição', message);
    }

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