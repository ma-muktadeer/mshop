import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AngularSlickgridModule } from 'angular-slickgrid';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ConfigService, initializeApplication } from '../config.service';
import { ithouseInterceptor } from '../XhrInterceptor';
import { DatePipe } from '@angular/common';
import { CommonService } from './ithouse/common/common.service';
import { TabManagerService } from './ithouse/common/tab-manager.service';
import { ToggleFullScreenDirective } from './layout/theme/pages/shared/full-screen/toggle-full-screen';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([ithouseInterceptor])),
    importProvidersFrom(AngularSlickgridModule.forRoot()),
    provideAppInitializer(() => initializeApplication(inject(ConfigService))),
    // {
    //   provide: RxStompService,
    //   useFactory: rxStompServiceFactory,
    // },
    provideClientHydration(withEventReplay(),
      withHttpTransferCacheOptions({ includePostRequests: true })
    ),
    ToggleFullScreenDirective,
    CommonService,
    DatePipe,
    // NabItemsService,
    TabManagerService,
  ]
};
