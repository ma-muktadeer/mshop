import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'ithouse-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  standalone: false
})
export class NavigationComponent {
  // public props
  windowWidth: number = 900;
  @Output() NavMobCollapse = new EventEmitter();

  // constructor
  constructor(@Inject(PLATFORM_ID) private paltfromId: Object) {
    if (isPlatformBrowser(paltfromId)) {
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
