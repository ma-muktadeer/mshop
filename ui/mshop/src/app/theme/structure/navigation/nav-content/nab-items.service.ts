import { Injectable } from '@angular/core';
import { PermissionStoreService } from '../../../../ithouse/services/PermissionStoreService';
import { NavigationItem } from '../../navigation-items';

@Injectable({
  providedIn: 'root'
})
export class NabItemsService {

  constructor(private permissionService: PermissionStoreService) { }

  buildNabItems = (items): NavigationItem[] => {

    return items.map(item => {
      let newItem: NavigationItem;

      if ( item.permission == 'DEFAULT' || this.permissionService.hasAnyPermission(item.permission)) {
        newItem = { ...item };
      }

      if(newItem?.children){
        newItem.children = this.buildNabItems(newItem.children);
      }

      return newItem;
    });
  }

  findNabItems = (items, url): NavigationItem[] => {
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

}
