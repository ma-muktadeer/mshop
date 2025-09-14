import { Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';
import { NavContentComponent } from "./nav-content/nav-content.component";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  imports: [NavContentComponent],
})
export class NavigationComponent {
 // public props
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
