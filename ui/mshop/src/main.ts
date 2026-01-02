import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { enableProdMode, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(App, appConfig)
  .then(ref => {
    const plateFormId = ref.injector.get(PLATFORM_ID);
    if (isPlatformBrowser(plateFormId)) {
      console.log('App bootstrapped');

      const loader = document.getElementById('loading');
      if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.3s ease';
        setTimeout(() => loader.remove(), 300);
      }
    }
  })
  .catch((err) => console.error(err));
