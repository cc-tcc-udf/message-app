import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ThemeService } from '@utils/services/theme.service';

@Component({
  selector: 'app-toggle-theme',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toggle-theme.component.html',
  styleUrl: './toggle-theme.component.scss'
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
    this.service.setTheme(newTheme);

    setTimeout(() => {
      this.isAnimated = false;
    }, 500);
  }

  private load(): void {
    const currentTheme = this.service.getTheme();
    this.isDarkMode = currentTheme === 'dark';
    this.service.setTheme(currentTheme);
  }
}
