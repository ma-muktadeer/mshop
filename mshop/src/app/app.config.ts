import { ApplicationConfig, importProvidersFrom, inject, PLATFORM_ID, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { ConfigService, initializeApplication } from '../config.service';
import { ithouseInterceptor } from '../XhrInterceptor';
import { CommonService } from './ithouse/common/common.service';
import { ToggleFullScreenDirective } from './layout/theme/pages/shared/full-screen/toggle-full-screen';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // provideRouter(routes),
    // provideClientHydration(withEventReplay()),
    ToggleFullScreenDirective,
    DatePipe,
    CommonService,
    // ConfigService,\
    // // HttpClient,
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({ includePostRequests: true })
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([ithouseInterceptor])
    ),
    provideAppInitializer(() => initializeApplication(inject(ConfigService))),
    // importProvidersFrom([AngularSlickgridModule.forRoot()]),

  ]
};
