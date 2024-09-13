import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { ThemeService } from '@utils/services/theme.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:
    [RouterOutlet, NgIf,
      NgClass, ToastModule,
      ProgressBarModule, AsyncPipe
    ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  theme = inject(ThemeService);
  title = 'message-app';
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.initUser();
  }
}
