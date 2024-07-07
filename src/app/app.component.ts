import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { ThemeService } from './utils/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  theme = inject(ThemeService);
  title = 'message-app';
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.initUser();
  }
}
