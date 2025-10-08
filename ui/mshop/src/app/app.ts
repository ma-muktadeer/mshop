import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ColorModeService } from '@coreui/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly #colorModeService = inject(ColorModeService);

  protected readonly title = signal('mshop');

  constructor(@Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');
  }


  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // 🟢 Only run in browser, not on server
      this.#colorModeService.colorMode.set('dark');
    }
  }
}
