import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { Usuario } from '@models/Usuario';
import { Subscription } from 'rxjs';
import { ToggleThemeComponent } from './toggle-theme/toggle-theme.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ToggleThemeComponent, DatePipe],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit, OnDestroy {
  user$!: Usuario | null;
  private userSubscription: Subscription | undefined;

  constructor(
    private datePipe: DatePipe,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.userSubscription = this.auth.user$.subscribe(user => {
      this.user$ = user;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getDate() {
    const today = new Date();
    return this.datePipe.transform(today, 'EEEE, dd/MM/yyyy', 'pt-BR');
  }

}
