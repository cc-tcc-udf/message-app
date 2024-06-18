import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ToggleThemeComponent } from './toggle-theme/toggle-theme.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ToggleThemeComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  name: string = "Taui Silva";

  constructor(private datePipe: DatePipe) { }

  getDate() {
    const today = new Date(); // Obter data atual
    return this.datePipe.transform(today, 'EEEE dd/MM/yyyy'); // Formatar a data
  }
}
