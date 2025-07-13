import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ithouse } from '../../../ithouse/common/Ithouse';
import { AlertService } from '../../../ithouse/common/alert.service';
import { CommonService } from '../../../ithouse/common/common.service';
import { Service } from '../../../ithouse/common/service';
import { ActionType } from '../../../ithouse/constants/action-type.enum';
import { ContentType } from '../../../ithouse/constants/content-type.enum';
import { LoadingComponent } from '../../../loading/loading.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule, LoadingComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent extends Ithouse implements Service, OnInit {
  protected cs = inject(CommonService);
  private alert = inject(AlertService);

  isSignDivVisiable: boolean = false;
  loginName: any;
  email: any;
  password: any;
  loading$:boolean=false;

  sessionExpired: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    debugger
    this.route.queryParams.subscribe(params => {
      this.sessionExpired = params['sessionExpired'] === 'true';
    });
    if(this.sessionExpired){
      // this.cs.logout(this);
      this.alert.showAlert('Session Expriered.', 'Your session is expriered. Please login again.', 'error');
      this.cs.removeUserInfo();

    }
  }

  onRegister() {
    if (this.loading$) {
      return;
    }
    const payload = {
      loginName: this.loginName,
      email: this.email,
      password: this.password,
    }
    this.loading$ = true;
    this.cs.sendRequestPublic(this, ActionType.REGISTER, ContentType.User, 'REGISTER', payload);


  }

  onLogin() {
    debugger;
    if (this.loading$) {
      return;
    }

    const payload = {
      // loginName: this.loginName,
      loginName: this.email,
      name: this.email,
      password: this.password,
    }
    this.loading$ = true;
    this.cs.sendRequestPublic(this, ActionType.LOGIN, ContentType.User, 'LOGIN', payload, '/login');
  }

  loadUser() {
    const p = {};
    this.cs.sendRequest(this, ActionType.SELECT, ContentType.User, 'user', p);
  }


  onResponse(service: Service, req: any, res: any) {
    const response = res?.res ?? res;
    this.loading$ = false;
    debugger
    if (!super.isOK(response)) {
      alert(super.getErrorMsg(response));
      return;
    }
    else if (response.header.referance === 'REGISTER') {
      const user = response.payload[0];
      console.log(response.payload);
      alert(`${user.loginName} is created successful.`);
      this.isSignDivVisiable = false;

    }
    else if (response.header.referance === 'user') {
      console.log(response.payload);

    }
    else if (response.header.referance === 'LOGIN') {
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
    throw new Error('Method not implemented.');
  }

}
