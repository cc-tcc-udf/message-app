import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { extractColors } from 'extract-colors';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _loading = new Subject<boolean>();
  loading$ = this._loading.asObservable();

  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {}

  getTheme(): string {
    if (!this.isBrowser) {
      return 'light';
    }
    const exist = this.getLocalValue();
    if (exist) {
      this.setTheme(exist);
      return exist;
    }
    return this.setThemeNavegador();
  }

  getLocalValue(): string | null {
    return this.verify() ? localStorage.getItem('theme') : null;
  }

  getLogos(): string {
    const value = this.getTheme();
    if (value === 'light') {
      return 'dark';
    }
    return 'light';
  }

  setThemeNavegador(): string {
    if (this.verify()) {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const value = isDark ? 'dark' : 'light';
      this.setTheme(value);
      return value;
    }
    return 'light';
  }

  setTheme(theme: string): void {
    if (this.verify()) {
      localStorage.setItem('theme', theme);
      if (this.document && this.document.body) {
        this.document.body.className = theme;
      }
    }
  }

  verify(): boolean {
    return this.isBrowser && typeof window !== 'undefined';
  }

  show(): void {
    this._loading.next(true);
  }

  hide(): void {
    this._loading.next(false);
  }

  async extractCor(img: string): Promise<string> {
    if (!this.isBrowser) {
      return '#f5f9ff';
    }
    try {
      const colors = (await extractColors(img)) as Array<{ hex: string; area: number }>;
      const dominantColor = colors.sort((a, b) => b.area - a.area)[0];
      const hexColor = dominantColor?.hex;
      return hexColor ?? '#f5f9ff';
    } catch (error) {
      console.error(error);
      return '#f5f9ff';
    }
  }
}
