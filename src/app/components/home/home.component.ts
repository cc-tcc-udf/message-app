import { Component } from '@angular/core';
import { InputComponent } from "../../shared/input.component";
import { HomeListComponent } from './components/list-home.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeListComponent, InputComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
