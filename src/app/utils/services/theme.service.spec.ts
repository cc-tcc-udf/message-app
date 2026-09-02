import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockDocument: Document;

  beforeEach(() => {
    mockDocument = document;
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: mockDocument }
      ]
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a valid theme (light or dark) when initialized', () => {
    expect(['light', 'dark']).toContain(service.getTheme());
  });

  it('should set and retrieve stored theme', () => {
    service.setTheme('dark');
    expect(service.getTheme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(mockDocument.body.className).toContain('dark');
  });

  it('should update loading$ state on show() and hide()', (done) => {
    service.loading$.subscribe((loading) => {
      if (loading) {
        expect(loading).toBeTrue();
        service.hide();
      } else {
        expect(loading).toBeFalse();
        done();
      }
    });

    service.show();
  });
});
