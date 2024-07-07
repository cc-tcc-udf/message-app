import { Component, inject } from '@angular/core';
import { ThemeService } from '@utils/services/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  theme = inject(ThemeService);

}
