import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Bật Zone.js change detection với event coalescing
    provideRouter(routes)  // Cung cấp router với các routes đã khai báo
  ]
};
