import { Component, inject, Inject, PLATFORM_ID, signal } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Spinner } from "./structure/shared/components/spinner/spinner";
import { ConfigService } from 'src/config.service';
import { TabManagerService } from './services/tab-manager.service';
import { Spinkit } from './structure/shared/components/spinner/spinkits';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly blockMultiTab = inject(ConfigService).blockMultiTab;
  protected readonly title = signal('mshop');

  readonly spinner = Spinkit.skLine

  activeTab = signal<boolean>(true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      if (this.blockMultiTab) {
        window.addEventListener('storage', (event) => {
          this.checkActiveTab(event);
        });
      }
    }
  }

  checkActiveTab(event: StorageEvent): void {
    if (event.key === 'activeTab') {
      this.activeTab.update(() => inject(TabManagerService).isActiveTab(event.newValue));
    }
  }

}
