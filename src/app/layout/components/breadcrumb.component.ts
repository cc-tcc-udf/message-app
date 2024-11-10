import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService } from '../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule, NgClass, NgIf, RouterLink],
  template: `
  <section class="w-full align-items-center flex">
    <p-breadcrumb class="max-w-full" [model]="items" [home]="home" />
  </section>
  `,
  styles: [`
  .p-breadcrumb {
    border-radius: 6px;
    padding: .5rem 0rem;
    background: none;
    border: none;
  }
  `],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {
  private service = inject(BreadcrumbService);

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit() {
    this.home = { icon: 'bi bi-house', routerLink: '/home' };
    this.service.breadcrumbs$.subscribe(breadcrumbs => {
      this.items = breadcrumbs;
    });
  }
}
