import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from './components/breadcrumb.component';
import { FooterComponent } from './components/footer.component';
import { MenuBarComponent } from "./components/menubar.component";
import { ToolbarComponent } from './components/toolbar.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FooterComponent,
    RouterOutlet,
    ToolbarComponent,
    MenuBarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})

export class LayoutComponent {


}
