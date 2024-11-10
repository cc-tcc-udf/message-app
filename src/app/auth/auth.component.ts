import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, DividerModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
