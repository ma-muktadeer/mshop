import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mshop');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    debugger
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.getElementById('loading');
      if (loader) loader.remove();
    }
  }

}
