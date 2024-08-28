import { Component, inject } from '@angular/core';
import { ThemeService } from '@utils/services/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <section class="w-full h-full flex-column justify-content-center align-items-center flex">
      <img height="35px" [src]="'assets/img/logo/' + theme.getLogos() + '.svg'" alt="">
    </section>
  `,
  styles: [``]
})
export class FooterComponent {
  theme = inject(ThemeService);

}
