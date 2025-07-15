import { isPlatformBrowser, Location, LocationStrategy } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationItem } from '../../navigation';

@Component({
  selector: 'ithouse-nav-group',
  templateUrl: './nav-group.component.html',
  styleUrl: './nav-group.component.scss',
  standalone: false
})
export class NavGroupComponent implements OnInit {
  // public props
  @Input('item') item!: NavigationItem;
  // = {
  //   id:'',
  //   title: '',
  //   type: 'item'
  // };

  // constructor
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private location: Location,
    private locationStrategy: LocationStrategy
  ) { 
    
  }

  // life cycle event
  ngOnInit() {
    console.log('group item', this.item);
    if (isPlatformBrowser(this.platformId)) {

      // at reload time active and trigger link
      
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
}
