import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "@auth/auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const roles = route.data['roles'];
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['auth', 'login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    if (roles && !this.authService.hasAnyRole(roles)) {
      this.router.navigate(['/auth/unauthorized']);
      return false;
    }
    return true;
  }
}