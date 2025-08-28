import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonService } from '../../../ithouse/services/common.service';
import { PermissionStoreService } from '../../../ithouse/services/PermissionStoreService';
import { NavigationItem, NavigationItems } from '../navigation-items';

@Injectable({
  providedIn: 'root'
})

export class NavigationService {
  protected cs = inject(CommonService);
  private user?: any;

  private navItems!: NavigationItem[];
  constructor(
    private _permissionStoreService: PermissionStoreService
  ) {
    this.user = this.cs.loadLoginUser();
  }
  getNavigationItems(items: NavigationItem[]): Observable<NavigationItem[]> {
    if (!this.navItems || !this.navItems.length) {
      this.replaceLoginName(items, this.user?.loginName, this._permissionStoreService);
    }
    return of(this.navItems);
  }

  public findNavItem = (navigationItems: NavigationItem[], url: string): NavigationItem[] => {
    console.log('try to find navItem', url);

    return this.findNabItems(this.navItems??this.replaceLoginName(navigationItems, this.user?.loginName, this._permissionStoreService), url);
  }

  private findNabItems = (items, url): NavigationItem[] => {
    for (const item of items) {

      if (item.url === url) {
        return [{ ...item }];
      }
      if (item.children) {
        const childResult = this.findNabItems(item.children, url);
        if (childResult && childResult.length) {
          return childResult;
        }
      }
    }
    return [];
  };
  private replaceLoginName = (items: NavigationItem[], loginName: string, permissionStoreService?: any): NavigationItem[] => {

    this.navItems = items.map(item => {
      let newItem: NavigationItem;
      // if (item.id !== 'admin') {
      //   newItem = { ...item };
      // }
      // else
      if (item.permission === 'DEFAULT' || permissionStoreService?.hasAnyPermission(item.permission)) {
        newItem = { ...item };
      }
      if (newItem?.url) {
        newItem.url = newItem.url.replace(/:loginName/g, loginName);
      }

      if (newItem?.children) {
        newItem.children = this.replaceLoginName(newItem.children, loginName, permissionStoreService);
      }

      return newItem;
    });
    return this.navItems;
  }
}

