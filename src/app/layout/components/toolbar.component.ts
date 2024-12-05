import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { Usuario } from '@models/Usuario';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { BreadcrumbComponent } from "./breadcrumb.component";
import { MenuBarComponent } from "./menubar.component";
import { ToggleThemeComponent } from './toggle-theme.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    ToggleThemeComponent, BreadcrumbComponent,
    MenuBarComponent, SkeletonModule, NgIf
  ],
  template: `
  <section class="flex flex-column">
    <section class="w-full h-3rem toolbar flex align-items-center justify-content-between">
      <span class="flex align-items-center font-light">Bem vindo! 
      <p-skeleton *ngIf="skeleton" class="ml-1" width="13rem"></p-skeleton>
        <p class="pl-1 font-bold" *ngIf="!skeleton">{{user$?.name}}</p>
      </span>
      <section class="flex align-items-center gap-2">
        <p *ngIf="!skeleton">{{ getDate() }}</p>
        <p-skeleton *ngIf="skeleton" class="ml-1" width="10rem"></p-skeleton>
        <p-skeleton *ngIf="skeleton" class="ml-1" width="3rem" height="1.5rem"></p-skeleton>
        <app-toggle-theme *ngIf="!skeleton"></app-toggle-theme>
      </section>
    </section>
    <section class="flex gap-2 align-items-center h-3rem justify-content-between">
      <app-breadcrumb></app-breadcrumb>
      <app-menu-bar></app-menu-bar>
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
  skeleton = true;

  constructor(
    private datePipe: DatePipe,
    private auth: AuthService,
    private cr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userSubscription = this.auth.user$.subscribe(user => {
      this.user$ = user;
    });
    setTimeout(() => {
      this.skeleton = false;
      this.cr.detectChanges();
    }, 500)
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
