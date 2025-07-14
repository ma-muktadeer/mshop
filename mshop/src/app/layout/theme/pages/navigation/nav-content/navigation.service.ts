import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonService } from '../../../../../ithouse/common/common.service';
import { NavigationItem, NavigationItems } from '../navigation';

@Injectable({
  providedIn: 'root'
})

export class NavigationService {
  protected cs = inject(CommonService);
  private user?: any;
  constructor() {
    this.user = this.cs.loadLoginUser();
  }
  getNavigationItems(): Observable<NavigationItem[]> {
    // Replace with actual data fetching logic
    // debugger
    // return of(NavigationItems);
    return of(replaceLoginName(NavigationItems, this.user?.loginName, this.user?.authorities));
  }
}

// Function to replace :loginName in URLs
export const replaceLoginName = (items: NavigationItem[], loginName: string, authorities: {authority: string}[]): NavigationItem[] => {
  return items.map(item => {
    // const newItem = { ...item }; // Create a shallow copy of the item
    let newItem: NavigationItem;
    if (item.id !== 'admin') {
      newItem = { ...item };
    } else if (item.id === 'admin' && (loginName === 'ithousebd' || authorities?.[0]['authority'] === 'ADMIN')) {
      newItem = { ...item };
    }
    // Replace loginName in the url if it exists
    if (newItem?.url) {
      newItem.url = newItem.url.replace(/:loginName/g, loginName);
    }

    // If the item has children, recursively replace loginName in them
    if (newItem?.children) {
      newItem.children = replaceLoginName(newItem.children, loginName, authorities);
    }

    return newItem;
  });
};
