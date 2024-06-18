import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { ToggleThemeComponent } from '@layout/toolbar/toggle-theme/toggle-theme.component';
import { ThemeService } from '@utils/services/theme.service';
import { InputTextModule } from 'primeng/inputtext';

import { PasswordModule } from 'primeng/password';
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
    console.log(this.form.getRawValue());
    this.router.navigate(['']);
  }

  private verify() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }
}