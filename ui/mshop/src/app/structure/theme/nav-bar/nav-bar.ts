import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Output, PLATFORM_ID, signal } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss'
})
export class NavBar {
  currentApplicationVersion = environment.appVersion;

  menuClass = false;
  collapseStyle = signal<string>('none');
  windowWidth: number;
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.windowWidth = window.innerWidth;
    }
  }

  toggleMobOption() {
    this.menuClass = !this.menuClass;
    this.collapseStyle.update(() => this.menuClass ? 'block' : 'none');
  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.NavCollapse.emit();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
  }

  navCollapseMob() {
    if (this.windowWidth < 992) {
      this.NavCollapsedMob.emit();
    }
  }
}
