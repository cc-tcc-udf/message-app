import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FooterComponent,
    RouterOutlet,
    ToolbarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})

export class LayoutComponent implements OnInit {
  items: MenuItem[] | null = null;


  ngOnInit() {
    this.items = [
      { label: 'Item 1', icon: 'pi pi-refresh', command: () => { console.log('Item 1 clicked'); } },
      { label: 'Item 2', icon: 'pi pi-times', command: () => { console.log('Item 2 clicked'); } }
    ];

    console.log(this.items)
  }
}
