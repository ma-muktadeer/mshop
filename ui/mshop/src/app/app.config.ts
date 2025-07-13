import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { DatePipe } from '@angular/common';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { routes } from './app.routes';
import { ConfigService, initializeApplication } from './config.service';
import { CommonService } from './ithouse/common/common.service';
import { ToggleFullScreenDirective } from './layout/theme/pages/shared/full-screen/toggle-full-screen';
import { ithouseInterceptor } from './XhrInterceptor';

// export const APP_NAME = new InjectionToken<string>('appName');
// const config= inject(ConfigService);

export const appConfig: ApplicationConfig = {
  providers: [
    ToggleFullScreenDirective,
    DatePipe,
    CommonService,
    ConfigService,
    HttpClient,
    // {
    //   provide: APP_BASE_HREF, useValue: endpointConfig.url,
    // },
    // {
    //   provide: 'CLIENT', useValue: endpointConfig.getClient(),
    // },
    // {
    //   provide: APP_NAME, useValue: endpointConfig.getAppName(),
    // },
    provideExperimentalZonelessChangeDetection(),
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
    importProvidersFrom([AngularSlickgridModule.forRoot()]),
    provideAppInitializer(() => initializeApplication(inject(ConfigService))),

    // {
    //   provide: APP_INITIALIZER,
    //   useValue: initializeApp,
    //   multi: true,
    // }

  ]
};


