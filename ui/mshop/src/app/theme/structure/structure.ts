import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Breadcrumb } from "../breadcrumb/breadcrumb";
import { NavBar } from "./nav-bar/nav-bar";
import { Navigation } from "./navigation/navigation";

@Component({
  selector: 'app-structure',
  imports: [RouterModule, Breadcrumb, NavBar, Navigation, NgClass],
  templateUrl: './structure.html',
  styleUrl: './structure.scss'
})
export class Structure {
  navCollapsed = signal<boolean>(null);
  navCollapsedMob = signal<boolean>(null);
  windowWidth: number = 900;

  // constructor
  constructor(@Inject(PLATFORM_ID) private paltfromId: Object) {
    if (isPlatformBrowser(paltfromId)) {
      this.windowWidth = window.innerWidth;
    }
    this.navCollapsedMob.set(false);
  }
  navSetCollapsed() {
    this.navCollapsed.update((value) => !value);
  }
  @HostListener('window:resize', ['$event'])
  // eslint-disable-next-line
  onResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
    if (this.windowWidth < 992) {
      document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
      if (document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.contains('navbar-collapsed')) {
        document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.remove('navbar-collapsed');
      }
    }
  }

  // public method
  navMobClick() {
    if (this.windowWidth < 992) {
      if (this.navCollapsedMob() && !document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
        this.navCollapsedMob.update(() => !this.navCollapsedMob());
        setTimeout(() => {
          this.navCollapsedMob.update(() => !this.navCollapsedMob());
        }, 100);
      } else {
        this.navCollapsedMob.update(() => !this.navCollapsedMob());
      }
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.remove('mob-open');
    }
  }
}
