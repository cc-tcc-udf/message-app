import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './components/toolbar.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ToolbarComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})

export class LayoutComponent {


}
