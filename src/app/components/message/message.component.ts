import { Component } from '@angular/core';
import { NewButtonComponent } from "../../shared/new-button.component";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NewButtonComponent,],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

}
