import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _loading = new Subject<boolean>();
  loading$ = this._loading.asObservable();

  constructor() { }

  getTheme() {
    if (this.verify()) {
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

  getLogos() {
    const value = this.getTheme();
    if (value === 'light') {
      return 'dark';
    }
    return 'light';
  }

  setThemeNavegador() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const value = isDark ? 'dark' : 'light';
    this.setTheme(value);
    return value;
  }


  setTheme(theme: string) {
    if (this.verify()) {
      localStorage.setItem('theme', theme);
      document.body.className = theme;
    }
  }

  verify() {
    if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
      return true;
    }
    return false;
  }

  show(): void {
    this._loading.next(true);
  }

  hide(): void {
    this._loading.next(false);
  }
}
