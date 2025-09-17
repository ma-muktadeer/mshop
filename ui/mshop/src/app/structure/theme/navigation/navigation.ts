import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';
import { NavContent } from "./nav-content/nav-content";

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation {
 windowWidth: number;
 @Output() NavMobCollapse = new EventEmitter();

 // constructor
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
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
