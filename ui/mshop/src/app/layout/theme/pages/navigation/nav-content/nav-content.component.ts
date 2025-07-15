import { isPlatformBrowser, Location, LocationStrategy } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.prod';
import { NavigationItem } from '../navigation';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'ithouse-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrl: './nav-content.component.scss',
  standalone: false
})
export class NavContentComponent implements OnInit {
  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  // public pops
  navigations: Observable<NavigationItem[]>;
  // wrapperWidth!: number;
  windowWidth: number= 900;
  document: any;

  @Output() NavMobCollapse = new EventEmitter();
  // constructor
  constructor(
    @Inject(PLATFORM_ID) private paltfromId: Object,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private navigationService: NavigationService) {
    this.navigations = navigationService.getNavigationItems();
  }

  // life cycle event
  ngOnInit() {
    if (isPlatformBrowser(this.paltfromId)) {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth < 992) {
        this.document=  document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
      }
    }
    // this.navigations = NavigationItems;
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
