import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.prod';
import { TabManagerService } from './ithouse/common/tab-manager.service';
import { SpinnerComponent } from "./layout/theme/pages/shared/components/spinner/spinner.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
title = 'mshop';

  activeTab = signal<boolean>(true);
  constructor(@Inject(PLATFORM_ID) private platformId: any, private tabManagerService: TabManagerService) {

  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // import('hammerjs').then((Hammer) => {
      //   // Initialize Hammer.js here
      // });
      window.innerWidth;
      if(environment.blockMultiTab){
        window.addEventListener('storage', (event)=>{
          this.checkActiveTab(event);
        });
      }
    }
  }
  checkActiveTab(event: StorageEvent) {

    if(event.key === 'activeTab'){
      const activeTabId = event.newValue;
      this.activeTab.set(this.tabManagerService.isActiveTab(activeTabId));
    }
  }
}
