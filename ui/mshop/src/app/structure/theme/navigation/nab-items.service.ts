import { inject, Injectable } from '@angular/core';
import { PermissioinStoreService } from '../../../services/permissioin-store.service';
import { NavigationItem } from './navigation-items';
import { CommonService } from 'src/app/services/common.service';

@Injectable()
export class NabItemsService {
  private loginName: string = '';
  constructor(
    private permissionService: PermissioinStoreService,
    private readonly _cs: CommonService
  ) {
    this.loginName = this._cs.loadLoginUser()?.loginName ?? '';
  }

  buildNabItems = (items: NavigationItem[]): NavigationItem[] => {

    return items.map(item => {
      let newItem: NavigationItem;

      if (item.permission == 'DEFAULT' || this.permissionService.hasAnyPermission(item.permission)) {
        newItem = { ...item };
      }
      if (newItem && newItem?.url) {
        newItem.url = /:loginName/.test(newItem.url)
          ? newItem.url.replace(/:loginName/g, this.loginName)
          : `/${this.loginName}${newItem.url}`;
        // console.log('url', newItem?.url);
        // newItem.url = newItem.url.replace(/:loginName/g, this.loginName);
      }

      if (newItem?.children) {
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
