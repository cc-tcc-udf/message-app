import { Component, inject } from '@angular/core';
import { ThemeService } from '@utils/services/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <section class="w-full py-1 h-full flex-column justify-content-center align-items-center flex">
      <img class="h-3rem" [src]="'assets/img/logo/' + theme.getLogos() + '.svg'" alt="">
    </section>
  `,
  styles: [``]
})
export class FooterComponent {
  theme = inject(ThemeService);

}
