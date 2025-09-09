import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { ConfigService, initializeApplication } from './ithouse/services/config.service';
import { RxStompService } from './ithouse/ws/rx-stomp.service';
import { rxStompServiceFactory } from './ithouse/ws/rx-stomp-service-factory';
import { ToggleFullScreenDirective } from './theme/full-screen/toggle-full-screen';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { globalInterceptor } from './global.interceptor';
import { AngularSlickgridModule } from 'angular-slickgrid';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({ includePostRequests: true })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([globalInterceptor])
    ),

    provideAppInitializer(() => initializeApplication(inject(ConfigService))),
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory
    },
    importProvidersFrom(AngularSlickgridModule.forRoot()),

    ToggleFullScreenDirective,
  ]
};
