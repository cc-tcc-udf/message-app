import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { ToggleThemeComponent } from '@layout/components/toggle-theme.component';
import { InputComponent } from '@shared/input.component';
import { AlertService } from '@utils/services/alert.service';
import { ThemeService } from '@utils/services/theme.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ToggleThemeComponent,
    InputComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  public theme = inject(ThemeService);
  public alert = inject(AlertService);

  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl<string | null>(null),
      name: new FormControl<string | null>(null),
      phone: new FormControl<string | null>(null),
      active: new FormControl<boolean>(false),
      password: new FormControl<string | null>(null),
      roles: new FormControl(["PROF"]),

    });
  }

  send() {
    this.theme.show();
    const usr = this.form.getRawValue();
    this.auth.register(usr)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.alert.showMsg(
              'success',
              'Cadastro',
              'Cadastro realizado com sucesso! Em breve, você receberá um e-mail de ativação da conta, enviado pelo administrador.'
            );
            this.form.reset();
            this.theme.hide();
            this.navigate('auth/login');
          } else {
            this.alert.showMsg(
              'warn',
              'Cadastro',
              res.message
            );
            this.theme.hide();
          }
        }
      });
  }

  navigate(rota: string) {
    this.router.navigate([rota]);
  }

  getControl(control: string) {
    return this.form.get(control) as FormControl;
  }
}
