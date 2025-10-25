import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Breadcrumb } from "./shared/components/breadcrumb/breadcrumb";
import { RouterOutlet } from '@angular/router';
import { NavigationModule } from './theme/navigation/navigation-module';
import { NavBarModule } from './theme/nav-bar/nav-bar-module';

@Component({
  selector: 'app-structure',
  imports: [Breadcrumb, RouterOutlet, NavigationModule, NavBarModule],
  templateUrl: './structure.html',
  styleUrl: './structure.scss',
})
export class Structure {
  navCollapsed = signal<boolean>(false);
  navCollapsedMob = signal<boolean>(false);
  windowWidth: number;
  document: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.windowWidth = window.innerWidth;
      this.document = document;
    }
    this.navCollapsedMob.update(() => false);
  }
  navCollapse() {
    this.navCollapsed.update((res) => !res);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
    if (this.windowWidth < 992) {
      this.document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
      if (this.document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('navbar-collapsed')) {
        // this.document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('navbar-collapsed');
        this.navCollapsed.update(() => false);
      }
    }
    else {
      this.navCollapsedMob.update(() => false);
    }
  }

  // public method
  navMobClick() {
    if (this.windowWidth < 992) {
      // if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      //   // this.navCollapsedMob.update(() => !this.navCollapsedMob());
      //   setTimeout(() => {
      //     this.navCollapsedMob.update(() => !this.navCollapsedMob());
      //   }, 100);
      // } else {
      //   this.navCollapsedMob.update(() => !this.navCollapsedMob());
      // }
      this.navCollapsedMob.update(res => !res);
    } else {
      this.navCollapsedMob.update(() => false);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    debugger
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    // if (this.document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
    //   this.document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
    // }
    this.navCollapsedMob.update(() => false);
  }
}
