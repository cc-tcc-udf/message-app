import { Routes } from '@angular/router';
import { AuthGuard } from '@utils/services/auth-guard.service';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  // !Authenticated
  {
    path: 'auth', component: AuthComponent, children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  // Authenticated
  {
    path: '', canActivate: [AuthGuard], component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent }
    ]
  },
  // { path: '**', redirectTo: 'auth/login' }
];
