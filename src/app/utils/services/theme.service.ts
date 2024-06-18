import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  getTheme() {
    if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
      const exist = this.getLocalValue();
      if (exist) {
        this.setTheme(exist);
        return exist;
      }
      return this.setThemeNavegador();
    }
    return 'dark';
  }

  getLocalValue() {
    return localStorage.getItem('theme');
  }

  setThemeNavegador() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const value = isDark ? 'dark' : 'light';
    this.setTheme(value);
    return value;
  }

  setTheme(theme: string) {
    localStorage.setItem('theme', theme);
  }


  // toggleTheme() {
  //   this.setTheme(this.activeTheme === 'dark' ? 'light' : 'dark');
  // }
}
