import { Injectable } from "@angular/core";
import { CommonService } from "./common.service";
import { Status } from "./status";

@Injectable({
  providedIn: "root",
})
export class PermissionStoreService {
  permissionList = [];

  public appPermission = AppPermission;

  constructor(private cs: CommonService) {
    // if (sessionStorage.getItem("APP_LOGIN_USER")) {
    //   this.getPermission();
    // }
  }

  private getPermission() {
    // const usr = JSON.parse(sessionStorage.getItem("APP_LOGIN_USER"));
    // this.permissionList = usr?.permissionList ?? [];
    // console.log(this.permissionList);
  }

  loadPermission() {
    if (this.permissionList.length > 0) {
      return;
    }
    this.getPermission();
  }

  hasPermission(permissioin: AppPermission): boolean {
    return true;
    // if (this.cs.forceAllow()) {
    //   return true;
    // }
    if (this.permissionList.length < 1) {
      this.getPermission();
    }
    return this.permissionList.some((f) => f.permissionName == permissioin);
  }

  hasAnyPermission(
    permissioin: Array<AppPermission>,
    p?: { status: any; matchStatus: Status[] }
  ) {
    if (this.cs.forceAllow() || !permissioin) {
      return true;
    }
    if (p && p.status && p.matchStatus && p.matchStatus.length > 0) {
      if (!this.checkStatus(p)) {
        return false;
      }
    }

    var allow = false;

    permissioin.forEach((p) => {
      var success = this.hasPermission(p);
      if (success) {
        allow = true;
        return allow;
      }
      return false;
    });

    return allow;
  }

  checkStatus(p: { status: any; matchStatus: Status[] }): boolean {
    if (!p || !p.status || !p.matchStatus || p.matchStatus.length < 1) {
      return false;
    }
    if (!p.matchStatus.includes(p.status)) {
      return false;
    }
    return true;
  }

  isBranchMaker() {
    // return this.cs.hasAnyRole([
    //   AppRole.APPLICATION_SYSTEM_ADMINISTRATION_MAKER,
    //   AppRole.SUPER_ADMIN,
    //   AppRole.SYSTEM_USER,
    // ]);
  }
}

export enum AppPermission {
  DASHBOARD_VIWER = "DASHBOARD_VIWER",
  USER_VIEWER = "USER_VIEWER",
  USER_MAKER = "USER_MAKER",
  USER_APPROVER = "USER_APPROVER",
  DELETE_USER = "DELETE_USER",
  EXPORT_USER = "EXPORT_USER",

  VIEW_PERMISSION = "VIEW_PERMISSION",
  APPROVE_PERMISSION = "APPROVE_PERMISSION",

  VIEW_BANK = "VIEW_BANK",
  SAVE_BANK = "SAVE_BANK",
  UPDATE_BANK = "UPDATE_BANK",
  DELETE_BANK = "DELETE_BANK",

  VIEW_BRANCH = "VIEW_BRANCH",
  SAVE_BRANCH = "SAVE_BRANCH",
  DELETE_BRANCH = "DELETE_BRANCH",
  UPDATE_BRANCH = "UPDATE_BRANCH",
  APPROVE_BRANCH = "APPROVE_BRANCH",

  VIEW_RM_CODE = "VIEW_RM_CODE",
  SAVE_RM_CODE = "SAVE_RM_CODE",
  UPDATE_RM_CODE = "UPDATE_RM_CODE",
  DELETE_RM_CODE = "DELETE_RM_CODE",

  SAVE_ROLE = "SAVE_ROLE",
  VIEW_ROLE = "VIEW_ROLE",
  APPROVE_ROLE = "APPROVE_ROLE",
  DELETE_ROLE = "DELETE_ROLE",

  VIEW_PROFIT_MARGIN = "VIEW_PROFIT_MARGIN",
  SAVE_PROFIT_MARGIN = "SAVE_PROFIT_MARGIN",
  UPDATE_PROFIT_MARGIN = "UPDATE_PROFIT_MARGIN",
  DELETE_PROFIT_MARGIN = "DELETE_PROFIT_MARGIN",

  APPLICATION_SETUP_MAKER = "APPLICATION_SETUP_MAKER",
  APPLICATION_SETUP_CHECKER = "APPLICATION_SETUP_CHECKER",
  ACCESS_APPLICATION_SETUP = "ACCESS_APPLICATION_SETUP",

  SAVE_PERMISSION = "SAVE_PERMISSION",

  //loan section
  SAVE_LOAN = "SAVE_LOAN",
  VIEW_LOAN = "VIEW_LOAN",
  HOME_LOAN = "HOME_LOAN",
  CAR_LOAN = "CAR_LOAN",
  EDIT_LOAN = "EDIT_LOAN",

  //new
  REJECT = "REJECT",
  SUBMIT_LOAN = "SUBMIT_LOAN",
  COPY_TEXT = "COPY_TEXT",

  // config section

  VIEW_DESIGNATION = "VIEW_DESIGNATION",
  SAVE_DESIGNATION = "SAVE_DESIGNATION",
  UPDATE_DESIGNATION = "UPDATE_DESIGNATION",
  DELETE_DESIGNATION = "DELETE_DESIGNATION",

  VIEW_BUSINESS_TYPE = "VIEW_BUSINESS_TYPE",
  SAVE_BUSINESS_TYPE = "SAVE_BUSINESS_TYPE",
  UPDATE_BUSINESS_TYPE = "UPDATE_BUSINESS_TYPE",
  DELETE_BUSINESS_TYPE = "DELETE_BUSINESS_TYPE",

  VIEW_PROFESSION_TYPE = "VIEW_PROFESSION_TYPE",
  SAVE_PROFESSION_TYPE = "SAVE_PROFESSION_TYPE",
  UPDATE_PROFESSION_TYPE = "UPDATE_PROFESSION_TYPE",
  DELETE_PROFESSION_TYPE = "DELETE_PROFESSION_TYPE",

  VIEW_DOCUMENT = "VIEW_DOCUMENT",
  SAVE_DOCUMENT = "SAVE_DOCUMENT",
  UPDATE_DOCUMENT = "UPDATE_DOCUMENT",
  DELETE_DOCUMENT = "DELETE_DOCUMENT",

  VIEW_CO_APPLICANT = "VIEW_CO_APPLICANT",
  SAVE_CO_APPLICANT = "SAVE_CO_APPLICANT",
  UPDATE_CO_APPLICANT = "UPDATE_CO_APPLICANT",

  VIEW_FOLLOWUP = "VIEW_FOLLOWUP",
  SAVE_FOLLOWUP = "SAVE_FOLLOWUP",
  UPDATE_FOLLOWUP = "UPDATE_FOLLOWUP",
  DELETE_FOLLOWUP = "DELETE_FOLLOWUP",
}
