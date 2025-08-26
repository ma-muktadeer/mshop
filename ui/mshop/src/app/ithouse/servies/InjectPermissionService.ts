import { Injectable, Input } from "@angular/core";
import { NavigationItem, NavigationItems } from "../../layout/theme/pages/navigation/navigation";
import { AppPermission, PermissionStoreService } from "./PermissionStoreService";
import { NavigationService } from "../../layout/theme/pages/navigation/nav-content/navigation.service";

@Injectable({
  providedIn: 'root'
})
export class InjectPermissionService {

  @Input()
  public urlPermission: AppPermission[] | 'DEFAULT';

  @Input()
  public isNabBar: boolean = false;


  constructor(private permissionService: PermissionStoreService, private nabItemService: NavigationService) { }

  getUrlPermission() {
    return this.urlPermission;
  }

  isAuthUrl(url: string): boolean {
    debugger
    if (this.urlPermission && this.urlPermission == 'DEFAULT') {
      return true;
    }
    if (!this.urlPermission && !this.isNabBar) {
      let items = [];
      this.nabItemService.getNavigationItems().subscribe((items: NavigationItem[]) => {
        items = items;
      });
      this.urlPermission = items && items.length ? items[0].permission : null;
    }
    if (this.urlPermission == null) {
      return false;
    }

    return Array.isArray(this.urlPermission) ?
      this.permissionService.hasAnyPermission(this.urlPermission) : true;
  }

}
