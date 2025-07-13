import { ApplicationConfig, inject, mergeApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { ConfigService, initializeApplication } from './config.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    
    provideAppInitializer(() => initializeApplication(inject(ConfigService))),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
