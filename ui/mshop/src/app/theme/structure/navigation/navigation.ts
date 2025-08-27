import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';
import { NavContent } from "./nav-content/nav-content";

@Component({
  selector: 'ithouse-navigation',
  imports: [NavContent],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation {
 windowWidth: number = 900;
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
