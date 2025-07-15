import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterModule, Scroll } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
import { NavigationService } from '../../navigation/nav-content/navigation.service';
import { NavigationItem } from '../../navigation/navigation';

interface titleType {
  // eslint-disable-next-line
  url: any;
  title: string;
  breadcrumbs: unknown;
  type: string;
}
@Component({
  selector: 'ithouse-breadcrum',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './breadcrum.component.html',
  styleUrl: './breadcrum.component.scss'
})
export class BreadcrumComponent implements OnInit {
  // public props
  @Input() type!: string;

  navigations: NavigationItem[];
  breadcrumbList: Array<string> = [];
  navigationList!: titleType[];

  // constructor
  constructor(
    private route: Router,
    private titleService: Title,
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {

    this.setBreadcrumb();
  }
  ngOnInit(): void {
    debugger
    if (isPlatformBrowser(this.platformId)) {
      // this.setBreadcrumb();
    }

  }

  // public method
  setBreadcrumb() {
    this.navigationService.getNavigationItems().subscribe((items: NavigationItem[]) => {
      this.navigations = items;
    });

    this.route.events
      .pipe(filter((event: any) => event instanceof NavigationEnd || event instanceof Scroll))
      .subscribe((r: any) => {
        // if (r instanceof NavigationEnd) {
        const activeLink = r.url;
        debugger
        const breadcrumbList = this.filterNavigation(this.navigations, activeLink);
        this.navigationList = breadcrumbList;
        const title = breadcrumbList[breadcrumbList.length - 1]?.title || 'Welcome';
        this.titleService.setTitle(title + ' | MSHOP');
        // }
      });
  }

  filterNavigation(navItems: NavigationItem[], activeLink: string): titleType[] {
    for (const navItem of navItems) {
      if (navItem?.type === 'item' && 'url' in navItem && navItem?.url === activeLink) {
        return [
          {
            url: 'url' in navItem ? navItem?.url : false,
            title: navItem?.title,
            breadcrumbs: 'breadcrumbs' in navItem ? navItem?.breadcrumbs : true,
            type: navItem?.type
          }
        ];
      }
      if ((navItem?.type === 'group' || navItem?.type === 'collapse') && 'children' in navItem) {
        // eslint-disable-next-line
        const breadcrumbList = this.filterNavigation(navItem?.children!, activeLink);
        if (breadcrumbList.length > 0) {
          breadcrumbList.unshift({
            url: 'url' in navItem ? navItem?.url : false,
            title: navItem?.title,
            breadcrumbs: 'breadcrumbs' in navItem ? navItem?.breadcrumbs : true,
            type: navItem?.type
          });
          return breadcrumbList;
        }
      }
    }
    return [];
  }
}
