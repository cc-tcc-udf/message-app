import { Component, OnInit } from '@angular/core';
import { HomeListComponent } from './components/list-home.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    console.log("ass")
  }

}
