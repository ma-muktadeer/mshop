import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';
import { AngularSlickgridModule } from 'angular-slickgrid';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { CommonService } from './services/common.service';
import { globalInterceptor } from '../global.interceptor';
import { ConfigService, initializeApplication } from '../config.service';
import { ToggleFullScreenDirective } from './structure/shared/full-screen/toggle-full-screen';
import { ColorModeService } from '@coreui/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withViewTransitions(),
    ),
    provideHttpClient(withFetch(), withInterceptors([globalInterceptor])),
    importProvidersFrom(AngularSlickgridModule.forRoot()),
    provideAppInitializer(() => initializeApplication(inject(ConfigService))),
    // {
    //   provide: RxStompService,
    //   useFactory: rxStompServiceFactory,
    // },
    ToggleFullScreenDirective,
    CommonService,
    ColorModeService,
    provideClientHydration(withEventReplay(),
      withHttpTransferCacheOptions({ includePostRequests: true })
    ),
  ]
};
