import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ThemeService } from '@utils/services/theme.service';

@Component({
  selector: 'app-toggle-theme',
  standalone: true,
  imports: [NgClass],
  template: `
  <button class="theme_toogle" (click)="toggleDarkMode()" aria-label="Alternar tema">
    <div class="btn" [ngClass]="{'isDark': isDarkMode}">
      <div class="btn__indicator">
        <div class="btn__icon-container">
          <i class="btn__icon bi"
            [ngClass]="{ 'bi-moon-stars-fill': isDarkMode, 'bi-brightness-low-fill': !isDarkMode, 'animated': isAnimated }"></i>
        </div>
      </div>
    </div>
  </button>
  `,
  styleUrl: '../layout.component.scss',

})
export class ToggleThemeComponent implements OnInit {
  private service = inject(ThemeService);

  isDarkMode: boolean = false;
  isAnimated: boolean = false;

  ngOnInit(): void {
    this.load();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.isAnimated = true;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    this.service.setTheme(newTheme);

    setTimeout(() => {
      this.isAnimated = false;
    }, 500);
  }

  private load(): void {
    const currentTheme = this.service.getTheme();
    this.isDarkMode = currentTheme === 'dark';
  }
}
