import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DatePipe } from '@angular/common';  // Import DatePipe
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {

  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch()),
  provideExperimentalZonelessChangeDetection(), DatePipe, importProvidersFrom([BrowserAnimationsModule]),
  ]
  // providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch()), DatePipe, importProvidersFrom([BrowserAnimationsModule]),]
};


