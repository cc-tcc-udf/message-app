import { Routes } from '@angular/router';
import { AuthComponent } from '@auth/auth.component';
import { LoginComponent } from '@auth/login/login.component';
import { RegisterComponent } from '@auth/register/register.component';
import { ConfigsComponent } from '@components/configs/configs.component';
import { CourseComponent } from '@components/course/course.component';
import { HomeComponent } from '@components/home/home.component';
import { ManageMsgComponent } from '@components/message/components/manage-msg/manage-msg.component';
import { ViewMsgComponent } from '@components/message/components/view-msg/view-msg.component';
import { MessageComponent } from '@components/message/message.component';
import { UsersComponent } from '@components/users/users.component';
import { LayoutComponent } from '@layout/layout.component';
import { AuthGuard } from '@utils/services/auth-guard.service';

export const routes: Routes = [
  // !Authenticated
  {
    path: 'auth', component: AuthComponent, children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  // Authenticated
  {
    path: '', component: LayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { breadcrumb: ['Home'] } },

      {
        path: 'msg', data: { breadcrumb: ['Mensagem'], roles: ['PROF'] },
        children: [
          { path: '', component: MessageComponent, data: { breadcrumb: ['Todas as mensagens'] } },
          { path: 'msg-view', component: ViewMsgComponent, data: { breadcrumb: ['Visualizar'] } },
          { path: 'msg-manage', component: ManageMsgComponent, data: { breadcrumb: ['Gerenciar'] } },
        ]
      },
      { path: 'configs', component: ConfigsComponent, data: { breadcrumb: ['Configurações'] } },
      { path: 'users', component: UsersComponent, data: { breadcrumb: ['Configurações', 'Usuarios'] } },
      { path: 'cursos', component: CourseComponent, data: { breadcrumb: ['Configurações', 'Cursos'] } }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];

