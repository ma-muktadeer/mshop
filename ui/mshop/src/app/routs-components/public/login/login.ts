import { Component, DestroyRef, Inject, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionType } from 'src/app/ithouse/constants/action-type.enum';
import { CommonService } from 'src/app/services/common.service';
import { ContentType } from 'src/app/ithouse/constants/content-type.enum';
import { Ithouse } from 'src/app/ithouse/services/Ithouse';
import { Service } from 'src/app/ithouse/services/service';
import { AlertService } from 'src/app/ithouse/services/alert.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RequestBody } from 'src/app/ithouse/constants/RequestBody';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'ithouse-login',
  imports: [NgClass, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login extends Ithouse implements Service {
  protected cs = inject(CommonService);
  protected _destroyRef = inject(DestroyRef);
  private alert = inject(AlertService);
  isSignDivVisiable = signal<boolean>(false);
  isMobile = signal<boolean>(false);
  loginName: any;
  email: any;
  password: any;
  loading = signal<boolean>(false);

  sessionExpired: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform,
  ) {
    super();
    this.isMobile.update(() => this.platform.ANDROID || this.platform.IOS);
    console.log('Platform is mobile:', this.isMobile());

  }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(params => {
        this.sessionExpired = params['sessionExpired'] === 'true';
      });
    if (this.sessionExpired) {
      // this.cs.logout(this);
      this.alert.showAlert('Session Expriered.', 'Your session is expriered. Please login again.', 'error');
      this.cs.removeUserInfo();

    }
  }

  setIsSignDivVisiable(res: boolean) {
    this.isSignDivVisiable.update(() => res);
  }
  onRegister() {
    if (this.loading()) {
      return;
    }
    const payload = {
      loginName: this.loginName,
      email: this.email,
      password: this.password,
    }
    this.loading.update(() => true);
    this.cs.sendRequestPublic(this, ActionType.REGISTER, ContentType.User, 'REGISTER', payload);


  }

  onLogin() {
    if (this.loading()) {
      return;
    }

    const payload = {
      // loginName: this.loginName,
      loginName: this.email,
      name: this.email,
      password: this.password,
    }
    this.loading.update(() => true);
    this.cs.sendRequestPublic(this, ActionType.LOGIN, ContentType.User, 'LOGIN', payload, '/login');
  }

  onResponse(service: Service, req: RequestBody<any>, res: any) {
    const response = res?.res ?? res;
    this.loading.update(() => false);
    debugger
    if (!super.isOK(response)) {
      alert(super.getErrorMsg(response));
      return;
    }
    else if (req.header.reference === 'REGISTER') {
      const user = response.payload[0];
      console.log(response.payload);
      alert(`${user.loginName} is created successful.`);
      this.isSignDivVisiable.update(() => false);

    }
    else if (req.header.reference === 'LOGIN') {
      console.log(response.payload);

      if (response.payload.length > 0) {
        var user = response.payload[0];
        if (user.allowLogin != 1) {
          //TODO:
          //alert("Sorry! You are not allow to login.");
          alert("Sorry! You are not allow to login.");
          //this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Sorry! You are not allow to login.' });

          // this.router.navigate(['/login']);
          return;
        }
        else if (user.twoFactorAuth == 1) {
          // this.show2FaFrm = true;
        }
        else {
          this.cs.storeToken(res);

          const user = response.payload[0];
          this.cs.storeLoginUser(user);
          this.router.navigate([`/${user?.loginName}/home`]);
        }
      }
      else {
        alert("Invalid username or password");
        //alert("Invalid username or password");
      }

    }
  }
  onError(service: Service, req: any, res: any) {
    this.loading.update(() => false);
    alert('Server error. Please try again later.');
    throw new Error('Method not implemented.');
  }
}
