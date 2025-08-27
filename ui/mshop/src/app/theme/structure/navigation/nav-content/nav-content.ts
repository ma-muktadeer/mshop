import { Location, LocationStrategy, isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Output, PLATFORM_ID, signal } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { NavigationItem, NavigationItems } from '../../navigation';
import { NabItemsService } from './nab-items.service';
import { NavGroup } from "./nav-group/nav-group";
import { NavCollapse } from "./nav-collapse/nav-collapse";
import { NavItem } from "./nav-item/nav-item";

@Component({
  selector: 'ithouse-nav-content',
  imports: [NgScrollbarModule, NavGroup, NavCollapse, NavItem],
  templateUrl: './nav-content.html',
  styleUrl: './nav-content.scss'
})
export class NavContent {
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  // public pops
  navigations = signal<NavigationItem[]>([]);  // wrapperWidth!: number;
  windowWidth: number = 900;
  document: any;

  @Output() NavMobCollapse = new EventEmitter();
  // constructor
  constructor(
    @Inject(PLATFORM_ID) private paltfromId: Object,
    private location: Location,
    private locationStrategy: LocationStrategy,
     private nabItemService: NabItemsService
  ) {
  }

  // life cycle event
  ngOnInit() {
    if (isPlatformBrowser(this.paltfromId)) {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth < 992) {
        this.document = document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
      }
    }
    this.navigations.set(this.nabItemService.buildNabItems(NavigationItems));

  }

  // public method

  navMob() {
    if (this.windowWidth < 992 && this.document.querySelector('ithouse-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
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
    const ele = this.document.querySelector(link);
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
