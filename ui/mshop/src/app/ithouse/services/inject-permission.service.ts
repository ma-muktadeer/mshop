import { Injectable, Input } from '@angular/core';
import { AppPermission, PermissionStoreService } from './permissioin-store.service';
import { NabItemsService } from '../../structure/theme/navigation/nab-items.service';
import { NavigationItems } from '../../structure/theme/navigation/navigation-items';

@Injectable({
  providedIn: 'root'
})
export class InjectPermissionService {

  @Input()
  public urlPermission: AppPermission[] | 'DEFAULT';

  @Input()
  public isNabBar: boolean = false;

  constructor(private permissionService: PermissionStoreService, private nabItemService: NabItemsService) { }

  getUrlPermission() {
    return this.urlPermission;
  }

  isAuthUrl(url: string): boolean {
    // const items = this.nabItemService.findNabItems(NavigationItems, url);
    // this.urlPermission = items && items.length ? items[0].permission : null;
    // if (this.urlPermission && this.urlPermission == 'DEFAULT') {
    //   return true;
    // }
    // if (this.urlPermission == null) {
    //   return false;
    // }

    // return Array.isArray(this.urlPermission) ?
    //   this.permissionService.hasAnyPermission(this.urlPermission) : true;
    if (this.urlPermission && this.urlPermission == 'DEFAULT') {
      return true;
    }
    if (!this.urlPermission && !this.isNabBar) {
      const items = this.nabItemService.findNabItems(NavigationItems, url);
      this.urlPermission = items && items.length ? items[0].permission : null;
    }
    if (this.urlPermission == null) {
      return false;
    }

    return Array.isArray(this.urlPermission) ?
      this.permissionService.hasAnyPermission(this.urlPermission) : true;
  }

}
