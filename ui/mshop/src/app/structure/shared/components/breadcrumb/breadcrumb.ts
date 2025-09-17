import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Event, NavigationEnd, Router, RouterLink } from '@angular/router';
import { NavigationItem, NavigationItems } from 'src/app/structure/theme/navigation/navigation-items';

interface titleType {
  // eslint-disable-next-line
  id: string;
  url: any;
  title: string;
  breadcrumbs: unknown;
  type: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss'
})
export class Breadcrumb {
  @Input() type!: string;

  navigations: NavigationItem[];
  breadcrumbList: Array<string> = [];
  navigationList!: titleType[];

  // constructor
  constructor(
    private route: Router,
    private titleService: Title
  ) {
    this.navigations = NavigationItems;
    this.setBreadcrumb();
  }
  // public method
  setBreadcrumb() {
    this.route.events.subscribe((router: Event) => {
      if (router instanceof NavigationEnd) {
        const activeLink = router.url;
        let breadcrumbList = this.filterNavigation(this.navigations, activeLink);
        if (!breadcrumbList.length) {
          breadcrumbList = this.buildBreadcrumbList(activeLink);
        }
        this.navigationList = breadcrumbList;
        const title = breadcrumbList[breadcrumbList.length - 1]?.title || 'Welcome';
        this.titleService.setTitle(title + ' | Soft-RBS');
      }
    });
  }

  buildBreadcrumbList(activeLink: string): titleType[] {
    const segments = activeLink.split('/').filter(segment => segment !== '');
    return segments.map((segment, index) => {
      const isLast = index === segments.length - 1;
      const isSecondLast = index === segments.length - 2;
      const capitalizedTitle = segment.charAt(0).toUpperCase() + segment.slice(1);

      return {
        id: (index + 1).toString(),
        url: isLast ? activeLink : false,
        title: capitalizedTitle,
        breadcrumbs: true,
        type: isLast ? 'group' : isSecondLast ? 'collapse' : 'item'
      };
    });
  }


  filterNavigation(navItems: NavigationItem[], activeLink: string): titleType[] {
    for (const navItem of navItems) {
      if (navItem.type === 'item' && 'url' in navItem && navItem.url === activeLink) {
        return [
          {
            id: navItem?.id,
            url: 'url' in navItem ? navItem.url : false,
            title: navItem.title,
            breadcrumbs: 'breadcrumbs' in navItem ? navItem.breadcrumbs : true,
            type: navItem.type
          }
        ];
      }
      if ((navItem.type === 'group' || navItem.type === 'collapse') && 'children' in navItem) {
        // eslint-disable-next-line
        const breadcrumbList = this.filterNavigation(navItem.children!, activeLink);
        if (breadcrumbList.length > 0) {
          breadcrumbList.unshift({
            id: navItem?.id,
            url: 'url' in navItem ? navItem.url : false,
            title: navItem.title,
            breadcrumbs: 'breadcrumbs' in navItem ? navItem.breadcrumbs : true,
            type: navItem.type
          });
          return breadcrumbList;
        }
      }
    }
    return [];
  }
}
