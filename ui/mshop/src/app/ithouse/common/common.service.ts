

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ActionType } from '../constants/action-type.enum';
import { ContentType } from '../constants/content-type.enum';
import { app } from './App';
import { AppRole } from './AppRole';
import { Constants } from './Constants';
import { FileAction, FileType } from './file.service';
import { Service } from './service';
import { ConfigService } from '../../../config.service';
import { endpointConfig } from '../../../endpoint.config';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private config = inject(ConfigService);
  // app = app;
  sessionStorage: any;
  localStorage: any;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
    // ✅ Safe access with checks
    if (this.document?.defaultView) {
      this.sessionStorage = this.document.defaultView.sessionStorage;
      this.localStorage = this.document.defaultView.localStorage;
      }

    }
  }

  // /**
  //  * This method responsible for communicating with server.
  //  * All request pass to server and return to sender [onResponse] if success.
  //  * if not access to server response will return to sender [onError] method
  //  *
  //  * @param service Service
  //  * @param actionType ActionType
  //  * @param contentType ContentType
  //  * @param referance string
  //  * @param payload any
  //  */
  public sendRequest(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {
    this.doSendRequest(service, actionType, contentType, referance, payload, path);
  }

  public sendRequestPublic(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {
    this.doSendRequestPublic(service, actionType, contentType, referance, payload, path);
  }



  private doSendRequestPublic(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    var url = path ? endpointConfig(this.config).url_public + path : endpointConfig(this.config).url_public + "/jsonRequest"

    this.http.post(url, req)
      .pipe(
        catchError((error: any) => {
          service.onError(service, req, error);
          return throwError(() => error);
        })
      )
      .subscribe(
        (res) => {
          service.onResponse(service, req, res);
        }
      );
  }

  public sendRequestAdmin(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {
    this.doSendRequestAdmin(service, actionType, contentType, referance, payload, path);
  }


  private doSendRequestAdmin(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    var url = path ? endpointConfig(this.config).url_admin + path : endpointConfig(this.config).url_admin + "/jsonRequest"

    this.http.post(url, req)
      .pipe(
        catchError((error: any) => {
          service.onError(service, req, error);
          return throwError(() => error);
        })
      )
      .subscribe(
        (res) => {
          service.onResponse(service, req, res);
        }
      );
  }


  private doSendRequest(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {

    let req = this.generateReqJson(actionType, contentType, referance, payload);
    let url = path ? endpointConfig(this.config).url + path : endpointConfig(this.config).url + "/jsonRequest"

    this.http.post(url, req)
      .pipe(
        catchError((error: any) => {
          service.onError(service, req, error);
          return throwError(() => error);
        })
      )
      .subscribe(
        (res) => {
          service.onResponse(service, req, res);
        }
      );
  }

  public post(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    // return this.http.post(endpointConfig(this.config).url, req)
    //   .toPromise()
    //   .then(res => {
    //     return res;
    //   })
    //   .catch(res => {
    //     service.onError(service, req, res);
    //   });

    return this.http.post(endpointConfig(this.config).url, req)
      .pipe(
        catchError((error: any) => {
          service.onError(service, req, error);
          return throwError(() => error);
        })
      )
      .subscribe(
        (res) => {
          service.onResponse(service, req, res);
        }
      );
  }


  public execute(actionType: ActionType, contentType: ContentType, payload: any) {

    var req = this.generateReqJson(actionType, contentType, '', payload);

    return this.http.post(endpointConfig(this.config).url, req);

  }

  public executePublic(actionType: ActionType, contentType: ContentType, payload: any, path = null) {

    var req = this.generateReqJson(actionType, contentType, '', payload);
    var url = path ? endpointConfig(this.config).url_public + path : endpointConfig(this.config).url_public + "/jsonRequest"
    return this.http.post(url, req);

  }

  public executeAdmin(actionType: ActionType, contentType: ContentType, payload: any, path = null) {
    var req = this.generateReqJson(actionType, contentType, '', payload);
    var url = path ? endpointConfig(this.config).url_admin + path : endpointConfig(this.config).url_admin + "/jsonRequest"
    return this.http.post(url, req);
  }


  public generateReqJson(actionType: ActionType, contentType: ContentType, referance: string, payload: any) {

    var loginUser = this.loadLoginUser();
    var userId = null;
    if (loginUser && loginUser.userId) {
      userId = loginUser.userId;
    }
    var header = {
      actionType: actionType.toString(),
      contentType: contentType.toString(),
      referance: referance,
      userId: userId,
      extraInfoMap: {
        appName: app.constantAppName
      }
    };

    var data = {
      header: header,
      payload: payload instanceof Object ? [payload] : payload
    }
    return data;
  }

  public reqJson(actionType: ActionType, contentType: ContentType, referance: string, payload: any): string {

    var req = this.generateReqJson(actionType, contentType, referance, payload);
    if (req) {
      return JSON.stringify(req);
    }
    return '';

  }

  public storeLoginUser(loginUser: any) {
    this.sessionStorage?.setItem(Constants.APP_LOGIN_USER, JSON.stringify(loginUser ?? {}))
  }
  storeToken(res: any) {
    this.sessionStorage?.setItem("AUTH_TOKEN", res?.token);
    this.sessionStorage?.setItem("IS_AUTHENTICATED", res?.authenticated);
  }
  public loadLoginUser(): any {
    var loginUser = this.sessionStorage?.getItem(Constants.APP_LOGIN_USER)
    if (loginUser && loginUser != 'undefined') {
      const usr = JSON.parse(loginUser ? loginUser : '');
      if (usr?.userId) {
        return usr;
      }
      return null;
    }
    else {
      return null;
    }
  }

  isSameUser(creatorId) {
    var loggged = this.loadLoginUser();
    if (loggged.loginName == 'ithouse') {
      return false;
    }
    return this.getUserId() == creatorId
  }

  forceAllow() {
    var logg = this.loadLoginUser();
    return logg.loginName == 'ithouse'
  }

  public getUserId(): Number {
    var loginUser = this.loadLoginUser();
    // console.log(loginUser);
    if (loginUser && loginUser.userId) {
      return loginUser.userId
    }
    return null;
  }

  isAuthenticated() {
    var auth = this.sessionStorage?.getItem("IS_AUTHENTICATED");

    if (auth) {
      return true;
    }

    return false;
  }

  public loadLoginUserRoleList() {
    var loginUser = this.sessionStorage?.getItem(Constants.APP_LOGIN_USER);
    if (loginUser) {
      return JSON.parse(loginUser ? loginUser : '')?.roleList;
    }
    else {
      return null;
    }
  }

  public logout(service: Service) {
    if (this.isAuthenticated()) {
      var loginUser = this.loadLoginUser();
      var payload = {
        userId: loginUser.userId
      }
      this.sendRequest(service, ActionType.LOGOUT, ContentType.User, 'logout', payload);

    this.removeUserInfo();

    }
  }

  public removeUserInfo() {
    this.storeLoginUser({});
    this.localStorage?.removeItem('permission');

    //loginUser = this.loadLoginUser();
    this.sessionStorage?.removeItem("IS_AUTHENTICATED");
    this.sessionStorage?.removeItem("AUTH_TOKEN");
    this.sessionStorage?.removeItem(Constants.APP_LOGIN_USER);
  }


  public isLoggedIn(): boolean {
    return this.isAuthenticated()
  }

  public hasAllRole(roleArray: AppRole[]): boolean {
    if (!roleArray) {
      return false;
    }
    var roles = this.loadLoginUserRoleList()
    if (!roles) {
      return false;
    }

    var roless = this.roleArray(roles)
    return roleArray.every(x => roless.indexOf(x) > -1)
  }
  private roleArray(roles) {
    var roleArray = [];
    if (!roles) {
      return roleArray;
    }

    for (var i = 0; i < roles.length; i++) {
      roleArray.push(roles[i].roleName);
    }
    return roleArray;

  }
  public hasAnyRole(roles: AppRole[]): boolean {

    if (!roles) {
      return false;
    }
    var loginUser = this.loadLoginUser();
    var userRoles = loginUser?.roleList;
    var loginRoleArray = this.roleArray(userRoles);
    if (!userRoles) {
      return false;
    }
    return roles.some(r => loginRoleArray.indexOf(r) >= 0);
  }

  public filePostBySecure(path: string, formData: FormData, fileType: FileType, action: FileAction = 'OTHERS', header?: HttpHeaders) {


    formData.append('fileType', fileType);
    formData.append('action', action);


    let headers = new HttpHeaders({
      'Authorization': this.sessionStorage?.getItem("AUTH_TOKEN"),
      'UserId': this.getUserId() + '',
      responseType: 'arraybuffer',
      // responseType: 'blob',
      observe: 'response'
    });
    const url = `${endpointConfig(this.config).url}/${path}`;

    // Create the HTTP request
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'arraybuffer', // ensure this is correctly typed
      withCredentials: true,
      headers: header || headers,
    });

    return this.http.request(req);
  }

  public fileDownload(path: string, payload: any, header?: HttpHeaders): Observable<Blob> {

    let headers = new HttpHeaders({
      'Authorization': this.sessionStorage?.getItem("AUTH_TOKEN"),
      'UserId': this.getUserId() + '',
      responseType: 'arraybuffer',
      // responseType: 'blob',
      observe: 'response'
    });

    if (header) {
      headers = header;
    }

    return this.http.post(endpointConfig(this.config).url + path, payload, { headers: headers, responseType: 'blob' });
  }
  public check(path: string, payload: any, header?: HttpHeaders): Observable<any> {


    return this.http.post(endpointConfig(this.config).url_public + path, payload);
  }

  testSetSession(key: string, value: string) {
    this.sessionStorage?.setItem(key, value);
  }

}
