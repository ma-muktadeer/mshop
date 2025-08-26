import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonService } from '../../../../../ithouse/common/common.service';
import { NavigationItem, NavigationItems } from '../navigation';
import { PermissionStoreService } from '../../../../../ithouse/servies/PermissionStoreService';

@Injectable({
  providedIn: 'root'
})

export class NavigationService {
  protected cs = inject(CommonService);
  private user?: any;
  constructor(private _permissionStoreService: PermissionStoreService) {
    this.user = this.cs.loadLoginUser();
  }
  getNavigationItems(): Observable<NavigationItem[]> {
    return of(replaceLoginName(NavigationItems, this.user?.loginName, this._permissionStoreService));
    // return of(replaceLoginName(NavigationItems, this.user?.loginName, this.user?.authorities));
  }
}

// Function to replace :loginName in URLs
export const replaceLoginName = (items: NavigationItem[], loginName: string, permissionStoreService: any): NavigationItem[] => {
// export const replaceLoginName = (items: NavigationItem[], loginName: string, authorities: {authority: string}[]): NavigationItem[] => {

  return items.map(item => {
    let newItem: NavigationItem;
    if (item.id !== 'admin') {
      newItem = { ...item };
    }
    else if (item.id === 'admin' && (loginName === 'ithousebd' || (item.permission === 'DEFAULT' || permissionStoreService.hasAnyPermission(item.permission)))) {
    // else if (item.id === 'admin' && (loginName === 'ithousebd' || authorities?.[0]['authority'] === 'ADMIN')) {
      newItem = { ...item };
    }
    if (newItem?.url) {
      newItem.url = newItem.url.replace(/:loginName/g, loginName);
    }

    if (newItem?.children) {
      newItem.children = replaceLoginName(newItem.children, loginName, permissionStoreService);
    }

    return newItem;
  });
};
