// Angular import
import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, HostListener, inject, PLATFORM_ID } from '@angular/core';

// project import
import screenfull from 'screenfull';

// declare const screenfull: any;

@Directive({
  selector: '[appToggleFullScreen]',
})
export class ToggleFullScreenDirective {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor(private elements: ElementRef) { }

  @HostListener('click')
  onClick() {
    if (!this.isBrowser) return;
    if (!screenfull.isEnabled) return;

    if (screenfull.isEnabled) {
      const feather = this.elements.nativeElement.querySelector('.feather');
      if (feather) {
        feather.classList.toggle('icon-maximize');
        feather.classList.toggle('icon-minimize');
      }
      screenfull.toggle().catch(err => {
        console.error('Error trying to enable fullscreen:', err.message);
      });
    }
  }

}
