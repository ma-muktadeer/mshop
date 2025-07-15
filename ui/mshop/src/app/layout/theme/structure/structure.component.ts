import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarModule } from '../pages/nav-bar/nav-bar.module';
import { NavigationModule } from '../pages/navigation/navigation.module';
import { BreadcrumComponent } from "../pages/shared/breadcrum/breadcrum.component";

@Component({
  selector: 'ithouse-structure',
  standalone: true,
  imports: [NavigationModule, CommonModule, NavBarModule, BreadcrumComponent, RouterOutlet],
  templateUrl: './structure.component.html',
  styleUrl: './structure.component.scss'
})
export class StructureComponent {
  // public props
  navCollapsed!: boolean;
  navCollapsedMob: boolean;
  windowWidth: number = 900;

  // constructor
  constructor(@Inject(PLATFORM_ID) private paltfromId: Object) {
    if (isPlatformBrowser(paltfromId)) {
      this.windowWidth = window.innerWidth;
    }
    this.navCollapsedMob = false;
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
      if (this.navCollapsedMob && !document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
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
    if (document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.remove('mob-open');
    }
  }
}
