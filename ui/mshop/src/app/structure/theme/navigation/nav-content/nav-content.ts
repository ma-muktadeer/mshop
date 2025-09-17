import { Location, LocationStrategy, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Output, PLATFORM_ID, signal } from '@angular/core';
import { NabItemsService } from '../nab-items.service';
import { NavigationItem, NavigationItems } from '../navigation-items';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.html',
  styleUrl: './nav-content.scss',
  standalone: false,
})
export class NavContent {
// public pops
  navigations = signal<NavigationItem[]>([]);
  wrapperWidth!: number;
  windowWidth: number;

  @Output() NavMobCollapse = new EventEmitter();
  // constructor
  document: any;
  constructor(
    private location: Location,
    private locationStrategy: LocationStrategy,
    private nabItemService: NabItemsService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.windowWidth = window.innerWidth;
      this.document = document;
    }
    // this.navigations.set(this.buildNabItems(NavigationItems));
  }

  // life cycle event
  ngOnInit() {

    if (this.windowWidth < 992) {
      this.document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
    }
    this.buildNavigation();
  }

  buildNavigation() {
    // this.navigations.set();
    debugger
    const navs = this.nabItemService.buildNabItems(NavigationItems);
    this.navigations.update(() => navs);
  }

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      this.NavMobCollapse.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}

