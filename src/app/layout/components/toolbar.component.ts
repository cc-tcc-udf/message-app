import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { Usuario } from '@models/Usuario';
import { Subscription } from 'rxjs';
import { ToggleThemeComponent } from './toggle-theme.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ToggleThemeComponent, DatePipe],
  template: `
  <section class="w-full h-3rem toolbar flex align-items-center justify-content-between">
    <span class="flex font-light">Bem vindo! 
      <p class="pl-1 font-bold">{{user$?.name}}</p>
    </span>
    <section class="flex align-items-center gap-2">
      <p>{{ getDate() }}</p>
      <app-toggle-theme></app-toggle-theme>
    </section>
  </section>
  `,
  styles: [`
    .toolbar {
      p {
        margin: 0;
      }
    }
  `]
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
