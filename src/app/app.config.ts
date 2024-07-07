import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { DatePipe, registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpInterceptor } from '@utils/http.interceptor';
import { MessageService } from 'primeng/api';
import { routes } from './app.routes';
import { ThemeService } from './utils/services/theme.service';

registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptors([HttpInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    ThemeService,
    DatePipe,
    ThemeService,
    MessageService
  ]
};
