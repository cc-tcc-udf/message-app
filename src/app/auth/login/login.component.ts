import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { Login } from '@models/Usuario';
import { AlertService } from '@utils/services/alert.service';
import { ThemeService } from '@utils/services/theme.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputComponent } from "../../shared/input.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    InputComponent
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
    this.theme.show();
    const usr = this.form.getRawValue();
    this.auth.login(usr as Login)
      .subscribe({
        next: () => {
          this.auth.user$.subscribe(u => {
            if (u) {
              this.router.navigate(['']);
            }
          })
        },
        error: (error) => {
          console.log(error);
          const summary = error.status >= 400 && error.status < 500 ? 'Ação não autorizada' : 'Erro inesperado';
          const severity = this.alert.getSeverity(error.status);
          const message = error.status === 0
            ? 'Falha ao realizar login. Tente novamente mais tarde. Se o problema persistir, entre em contato com os administradores.'
            : error.error?.message || 'Ocorreu um erro.';
          this.alert.showMsg(severity, summary, message);
          this.theme.hide();
        }
      })
  }

  private verify() {
    if (this.auth.isAuthenticated()) {
      this.navigate('');
    }
  }

  navigate(rota: string) {
    this.router.navigate([rota]);
  }
}