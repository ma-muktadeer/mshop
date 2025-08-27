import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, signal } from '@angular/core';

@Component({
  selector: 'ithouse-navigation',
  standalone: false,
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation {
  windowWidth: number = 1200;
  @Output() NavMobCollapse = new EventEmitter();

  // constructor
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.windowWidth = window.innerWidth;
    }
  }

  // public method
  navMobCollapse() {
    if (this.windowWidth < 992) {
      this.NavMobCollapse.emit();
    }
  }
}
