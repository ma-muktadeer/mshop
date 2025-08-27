import { Injectable } from "@angular/core";
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})

export class PermissionStoreService {
  private permissionList = [];

  // public appPermission = AppPermission;

  constructor(private cs: CommonService) {
    this._loadPermission();
  }

  private _getPermission(): any[] {
    if (!this.permissionList || this.permissionList.length < 1) {
      this._loadPermission();
    }
    return this.permissionList;
  }

  private _loadPermission() {
    if (this.permissionList.length > 0) {
      return;
    }
    const usr = this.cs.loadLoginUser();
    this.permissionList = usr?.permissionList ?? [];
    console.log(this.permissionList);
  }

  hasPermission(permissioin: AppPermission, isForceCheck: boolean = true): boolean {
    if (isForceCheck && this.cs.forceAllow()) {
      return true;
    }
    const prmLst = this._getPermission();
    return prmLst.some((f) => f.permissionName == permissioin);
  }

  hasAnyPermission(permissioin: Array<AppPermission>) {
    if (this.cs.forceAllow()) {
      return true;
    }

    let allow: boolean = false;
    permissioin.forEach((p) => {
      allow = this.hasPermission(p, false);
      if (allow) {
        return true;
      }
      return false;
    });
    return allow;
  }

}

export enum AppPermission {
  DASHBOARD_VIWER = "DASHBOARD_VIWER",
  USER_VIEWER = "USER_VIEWER",
  USER_MAKER = "USER_MAKER",
  USER_APPROVER = "USER_APPROVER",
  DELETE_USER = "DELETE_USER",

}
