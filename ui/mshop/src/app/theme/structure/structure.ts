import { Component, HostListener, Inject, inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from "@angular/router";
import { isPlatformBrowser, NgClass } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-structure',
  imports: [NavBarComponent, BreadcrumbComponent, RouterModule, NgClass, NavigationComponent],
  templateUrl: './structure.html',
  styleUrl: './structure.scss'
})

export class Structure {
 // public props
 navCollapsed!: boolean;
 navCollapsedMob: boolean;
  windowWidth: number;
  document: any;

 // constructor
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
   if (isPlatformBrowser(this.platformId)) {
     this.windowWidth = window.innerWidth;
     this.document = document;
   }
   this.navCollapsedMob = false;
 }

 @HostListener('window:resize', ['$event'])
 // eslint-disable-next-line
 onResize(event: any): void {
   this.windowWidth = event.target.innerWidth;
   if (this.windowWidth < 992) {
     this.document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
     if (this.document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('navbar-collapsed')) {
       this.document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('navbar-collapsed');
     }
   }
 }

 // public method
 navMobClick() {
   if (this.windowWidth < 992) {
     if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
       this.navCollapsedMob = !this.navCollapsedMob;
       setTimeout(() => {
         this.navCollapsedMob = !this.navCollapsedMob;
       }, 100);
     } else {
       this.navCollapsedMob = !this.navCollapsedMob;
     }
   }
 }

 handleKeyDown(event: KeyboardEvent): void {
   if (event.key === 'Escape') {
     this.closeMenu();
   }
 }

 closeMenu() {
   if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
     document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
   }
 }

}
