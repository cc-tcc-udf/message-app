import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@auth/auth.service";
import { RefreshToken } from "@models/RefreshToken";
import { Observable, catchError, switchMap, throwError } from "rxjs";

export const HttpInterceptor: HttpInterceptorFn =
  (req: HttpRequest<unknown>, next: HttpHandlerFn):
    Observable<HttpEvent<unknown>> => {
    const router = inject(Router);
    const auth = inject(AuthService);

    const handleError = (error: HttpErrorResponse): Observable<never> => {
      const status = error.status;
      const message = status === 401
        ? 'Você não tem permissão para realizar essa requisição'
        : `${status}`;
      router.navigate(['/error'], {
        queryParams: {
          errorCode: status,
          message: message,
        },
      });

      return throwError(() => error);
    };

    if (auth.isAuthenticated()) {
      if (auth.isTokenExpired()) {
        return auth.refreshToken().pipe(
          switchMap((newToken: RefreshToken | null) => {
            if (newToken && newToken.token) { 
              const clonedReq = req.clone({
                setHeaders: {
                  authorization: `Bearer ${newToken.token}`,
                },
              });
              return next(clonedReq);
            } else {
              return next(req);
            }
          }),
          catchError(handleError)
        );

      } else {
        const clonedReq = req.clone({
          setHeaders: {
            authorization: `Bearer ${auth.getAccessToken()}`,
          },
        });
        return next(clonedReq).pipe(
          catchError(handleError)
        );
      }
    } else {
      return next(req).pipe(
        catchError(handleError)
      );
    }
  };
