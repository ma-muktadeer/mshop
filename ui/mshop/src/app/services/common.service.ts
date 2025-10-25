import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { DOCUMENT, Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, retry, throwError, timeout } from 'rxjs';
import { environment as ENV } from './../../environments/environment';
import { ConfigService } from '../../config.service';
import { Constants } from './common/Constants';
import { AppRole } from '../ithouse/constants/AppRole';
import { ActionType } from '../ithouse/constants/action-type.enum';
import { Service } from './service';
import { ContentType } from './common/constants/content-type.enum';
import { FileAction, FileType } from './file.service';
import { isPlatformBrowser } from '@angular/common';
import { Header } from './common/Header';
import { RequestBody } from './common/constants/RequestBody';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private readonly _config = inject(ConfigService);
  sessionStorage: any;
  localStorage: any;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
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


  get environment() {
    if (!this._config.config) {
      throw new Error("Config not loaded yet");
    }
    if (ENV.production) {
      return this._config.config['env.prod'];
    }
    else {
      return this._config.config['env.local'];
    }
  }

  public sendRequest(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {
    this.doSendRequest(service, actionType, contentType, referance, payload, path);
  }

  public sendRequestPublic(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {
    this.doSendRequestPublic(service, actionType, contentType, referance, payload, path);
  }

  public sendRequestAdmin(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {
    this.doSendRequestAdmin(service, actionType, contentType, referance, payload, path);
  }

  private async doSendRequestPublic<T>(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    var url = path ? this.environment.SERVER_BASE_URL_PUBLIC + path : this.environment.SERVER_BASE_URL_PUBLIC + "/jsonRequest"

    await this._postRequest<T, any>(url, req, service);
  }

  private async doSendRequestAdmin<T>(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    var url = path ? this.environment.SERVER_BASE_URL_ADMIN + path : this.environment.SERVER_BASE_URL_ADMIN + "/jsonRequest"

    await this._postRequest<T, any>(url, req, service);
  }

  private async doSendRequest<T>(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: T | T[], path: string = null) {

    let req = this.generateReqJson(actionType, contentType, referance, payload);
    let url = path ? this.environment.SERVER_BASE_URL + path : this.environment.SERVER_BASE_URL + "/jsonRequest"

    await this._postRequest<T, any>(url, req, service);
  }

  private async _postRequest<T, R>(url: string, req: RequestBody<T>, service: Service):Promise<R> {

    try {
      const res = await firstValueFrom(
        this.http.post<R>(url, req).pipe(
          timeout(this.environment.HTTP_REQUEST_TIMEOUT),
          retry(
            {
              count: this.environment.HTTP_REQUEST_RETRY_COUNT || 0,
              delay: this.environment.HTTP_REQUEST_RETRY_DELAY || 1000
            }
          ),
          catchError((error) => {
            let message = 'An unexpected error occurred.';
            if (error.name === 'TimeoutError') {
              message = 'The server took too long to respond. Please try again later.';
            } else if (error.status === 0) {
              message = 'Unable to connect to the server. Check your internet connection.';
            } else if (error.status >= 500) {
              message = 'The server is temporarily unavailable. Please try again later.';
            } else if (error.status === 404) {
              message = 'The requested service could not be found.';
            } else if (error.status === 400) {
              message = error.error?.message || 'Bad request — please check your input.';
            } else if (error.error?.message) {
              message = error.error.message;
            }
            console.error('HTTP error:', { url, request: req, status: error.status, error });

            return throwError(() => ({
              message,
              raw: error
            }));
          }),
        )
      ) as R;
      service.onResponse(service, req, res);
      return res;
    } catch (error) {
      console.error('HTTP request failed', { url, req, error });
      const message = error?.message || 'Something went wrong.';
      service.onError(service, req, message);
      throw error;
    }

    // this.http.post(url, req)
    //   .pipe(
    //     takeUntilDestroyed(this._destroyRef),
    //     catchError((error: any) => {
    //       service.onError(service, req, error);
    //       return throwError(() => error);
    //     })
    //   )
    //   .subscribe({
    //     next: (res) => {
    //       service.onResponse(service, req, res);
    //     }
    //   });
  }


  public async execute<T>(actionType: ActionType, contentType: ContentType, payload: T | T[]) {

    var req = this.generateReqJson(actionType, contentType, '', payload);

    return this.http.post(this.environment.SERVER_BASE_URL, req);

  }

  public async executePublic<T>(actionType: ActionType, contentType: ContentType, payload: T | T[], path = null) {

    var req = this.generateReqJson(actionType, contentType, '', payload);
    var url = path ? this.environment.SERVER_BASE_URL_PUBLIC + path : this.environment.SERVER_BASE_URL_PUBLIC + "/jsonRequest"
    return this.http.post(url, req);

  }

  public async executeAdmin<T>(actionType: ActionType, contentType: ContentType, payload: T | T[], path = null) {
    var req = this.generateReqJson(actionType, contentType, '', payload);
    var url = path ? this.environment.SERVER_BASE_URL_ADMIN + path : this.environment.SERVER_BASE_URL_ADMIN + "/jsonRequest"
    return this.http.post(url, req);
  }

  private generateReqJson<T>(
    actionType: ActionType,
    contentType: ContentType,
    reference: string,
    payload: T | T[]): RequestBody<T> {

    const loginUser = this.loadLoginUser();
    let userId = null;
    if (loginUser && loginUser.userId) {
      userId = loginUser.userId;
    }
    const header: Header = {
      actionType: actionType.toString(),
      contentType: contentType.toString(),
      reference: reference,
      userId: userId,
      extraInfoMap: {
        appName: this._config.config.app.constantAppName
      }
    };

    const data: RequestBody<T> = {
      header: header,
      payload: Array.isArray(payload) ? payload : [payload]
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

  getToken(): string {
    return this.sessionStorage?.getItem('AUTH_TOKEN');
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
    return logg.loginName == 'ithousebd' || logg.loginName == 'ithouse';
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

      // this.removeUserInfo();

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
    const url = `${this.environment.SERVER_BASE_URL}/${path}`;

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

    return this.http.post(this.environment.SERVER_BASE_URL + path, payload, { headers: headers, responseType: 'blob' });
  }
  public check(path: string, payload: any, header?: HttpHeaders): Observable<any> {


    return this.http.post(this.environment.SERVER_BASE_URL_PUBLIC + path, payload);
  }

  testSetSession(key: string, value: string) {
    this.sessionStorage?.setItem(key, value);
  }

}
