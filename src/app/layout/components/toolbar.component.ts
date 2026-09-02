import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth/auth.service';
import { Usuario } from '@models/Usuario';
import { SkeletonModule } from 'primeng/skeleton';
import { BreadcrumbComponent } from "./breadcrumb.component";
import { MenuBarComponent } from "./menubar.component";
import { ToggleThemeComponent } from './toggle-theme.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    ToggleThemeComponent,
    BreadcrumbComponent,
    MenuBarComponent,
    SkeletonModule
],
  template: `
  <section class="flex flex-column">
    <section class="w-full h-3rem toolbar flex align-items-center justify-content-between">
      <span class="flex align-items-center font-light">Bem vindo!
        @if (skeleton) {
          <p-skeleton class="ml-1" width="13rem"></p-skeleton>
        }
        @if (!skeleton) {
          <p class="pl-1 font-bold">{{user$?.name}}</p>
        }
      </span>
      <section class="flex align-items-center gap-2">
        @if (!skeleton) {
          <p>{{ getDate() }}</p>
        }
        @if (skeleton) {
          <p-skeleton class="ml-1" width="10rem"></p-skeleton>
        }
        @if (skeleton) {
          <p-skeleton class="ml-1" width="3rem" height="1.5rem"></p-skeleton>
        }
        @if (!skeleton) {
          <app-toggle-theme></app-toggle-theme>
        }
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
      width: 100%;
      height: 3rem;
      display: flex;
      justify-content: space-between;
      p {
        margin: 0;
      }
    }
  `]
})
export class ToolbarComponent implements OnInit {
  private datePipe = inject(DatePipe);
  private auth = inject(AuthService);
  private cr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  user$!: Usuario | null;
  skeleton = true;

  ngOnInit() {
    this.auth.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.user$ = user;
      });
    setTimeout(() => {
      this.skeleton = false;
      this.cr.detectChanges();
    }, 500);
  }

  getDate() {
    const today = new Date();
    return this.datePipe.transform(today, 'EEEE, dd/MM/yyyy', 'pt-BR');
  }

}
