import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { ConfigService, initializeApplication } from './ithouse/services/config.service';
import { RxStompService } from './ithouse/ws/rx-stomp.service';
import { rxStompServiceFactory } from './ithouse/ws/rx-stomp-service-factory';
import { ToggleFullScreenDirective } from './theme/full-screen/toggle-full-screen';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),

    provideClientHydration(withEventReplay(),
      withHttpTransferCacheOptions({includePostRequests: true})
    ),
    provideAppInitializer(() => initializeApplication(inject(ConfigService))),
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory
    },
    ToggleFullScreenDirective

  ]
};
