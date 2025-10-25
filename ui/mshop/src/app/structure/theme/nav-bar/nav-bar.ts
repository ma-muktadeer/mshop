import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Output, PLATFORM_ID, signal } from '@angular/core';
import { ConfigService } from 'src/config.service';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss'
})
export class NavBar {
  app!: any;

  menuClass = false;
  collapseStyle = signal<string>('none');
  windowWidth: number;
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private configService: ConfigService) {
    this.app = this.configService.app;
    if (isPlatformBrowser(this.platformId)) {
      this.windowWidth = window.innerWidth;
    }
    console.log(this.app);

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
