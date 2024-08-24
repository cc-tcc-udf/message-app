import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule, NgClass, NgIf, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {
  private service = inject(BreadcrumbService);

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit() {
    this.home = { icon: 'bi bi-house', routerLink: '/home' };
    this.items = this.service.getBreadcrumbs();
  }
}
