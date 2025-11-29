import { Component, inject, Inject, PLATFORM_ID, signal } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Spinner } from "./structure/shared/components/spinner/spinner";
import { ConfigService } from 'src/config.service';
import { TabManagerService } from './ithouse/services/tab-manager.service';
import { Spinkit } from './structure/shared/components/spinner/spinkits';

import { MultiTabWarning } from './components/multi-tab-warning/multi-tab-warning';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Spinner, MultiTabWarning],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly blockMultiTab = inject(ConfigService).blockMultiTab;
  private readonly tabManagment = inject(TabManagerService);
  protected readonly title = signal('mshop');

  readonly spinner = Spinkit.skLine

  activeTab = signal<boolean>(true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      if (this.blockMultiTab) {
        console.log('Block multiple tab is enabled');

        window.addEventListener('storage', (event) => {
          this.checkActiveTab(event);
        });
      }
    }
  }

  checkActiveTab(event: StorageEvent): void {
    if (event.key === 'activeTab') {
      this.activeTab.update(() => this.tabManagment.isActiveTab(event.newValue));
    }
  }

}
