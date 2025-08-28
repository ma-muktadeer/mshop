import { Injectable, Input } from '@angular/core';
import { AppPermission, PermissionStoreService } from './PermissionStoreService';
import { NavigationItems } from '../../theme/structure/navigation-items';
import { NavigationService } from '../../theme/structure/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class InjectPermissionService {

  @Input()
  public urlPermission: AppPermission[] | 'DEFAULT';

  @Input()
  public isNabBar: boolean = false;


  constructor(private permissionService: PermissionStoreService, private navigationService: NavigationService) { }

  getUrlPermission() {
    return this.urlPermission;
  }

  isAuthUrl(url: string): boolean {
    console.log('permission service', url);

    if(this.urlPermission && this.urlPermission == 'DEFAULT'){
      return true;
    }
    if (!this.urlPermission && !this.isNabBar) {
      const items = this.navigationService.findNavItem(NavigationItems, url);
      this.urlPermission = items && items.length ? items[0].permission : null;
    }
    if (this.urlPermission == null) {
      return false;
    }

    return Array.isArray(this.urlPermission) ?
     this.permissionService.hasAnyPermission(this.urlPermission) : true;
  }

}
