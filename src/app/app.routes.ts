import { Routes } from '@angular/router';
import { AuthComponent } from '@auth/auth.component';
import { LoginComponent } from '@auth/login/login.component';
import { ConfigsComponent } from '@components/configs/configs.component';
import { HomeComponent } from '@components/home/home.component';
import { MensageComponent } from '@components/mensage/mensage.component';
import { UsersComponent } from '@components/users/users.component';
import { LayoutComponent } from '@layout/layout.component';
import { AuthGuard } from '@utils/services/auth-guard.service';

export const routes: Routes = [
  // !Authenticated
  {
    path: 'auth', component: AuthComponent, children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  // // Authenticated
  {
    path: '', component: LayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' } },
      { path: 'msg', component: MensageComponent, data: { breadcrumb: 'Mensagem' } },
      { path: 'configs', component: ConfigsComponent, data: { breadcrumb: 'Configurações' } },
      { path: 'users', component: UsersComponent, data: { breadcrumb: 'Usuarios' } },
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];
