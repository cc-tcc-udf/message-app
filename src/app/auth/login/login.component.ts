import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { ToggleThemeComponent } from '@layout/components/toolbar/toggle-theme/toggle-theme.component';
import { AlertService } from '@utils/services/alert.service';
import { ThemeService } from '@utils/services/theme.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserResponse } from '../../interfaces/UserResponse';
import { Usuario } from '../../interfaces/Usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ToggleThemeComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  public theme = inject(ThemeService);
  public alert = inject(AlertService);


  form!: FormGroup;

  ngOnInit(): void {
    this.verify();
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl<string | null>(null),
      password: new FormControl<string | null>(null)
    });
  }

  send() {
    const usr = this.form.getRawValue();
    this.auth.login(usr as Usuario)
      .subscribe({
        next: (res: UserResponse) => {
          sessionStorage.setItem('access_token', res.token);
          sessionStorage.setItem('user_email', res.email);
          this.getUser(res);
        },
        error: (error) => {
          let summary = '';
          if (error.status >= 400 && error.status < 500) {
            summary = 'Não autorizado';
          } else if (error.status >= 500) {
            summary = 'Erro';
          }
          this.alert.showMsg('error', summary, error.error?.message);
        }
      })
  }

  private getUser(usr: UserResponse) {
    this.auth.getUser(usr)
      .subscribe({
        next: (user: Usuario) => {
          this.alert.showMsg('success', 'Bem vindo', user.name);
          this.router.navigate(['']);
        },
        error: (error) => {
          this.alert.showMsg(
            'error',
            "Erro ao recuperar usuário",
            error.error?.message
          );
        }
      });
  }

  private verify() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }
}