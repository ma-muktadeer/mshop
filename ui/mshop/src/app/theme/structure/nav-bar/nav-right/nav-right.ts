import { Component, inject, signal } from '@angular/core';
import { Service } from '../../../../ithouse/services/service';
import { CommonService } from '../../../../ithouse/services/common.service';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ithouse } from '../../../../ithouse/common/Ithouse';
import { ActionType } from '../../../../ithouse/constants/action-type.enum';
import { ContentType } from '../../../../ithouse/services/content-type.enum';

@Component({
  selector: 'ithouse-nav-right',
  standalone: false,
  templateUrl: './nav-right.html',
  styleUrl: './nav-right.scss',
  providers: [NgbDropdownConfig],
  // animations: [
  //   trigger('slideInOutLeft', [
  //     transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
  //     transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
  //   ]),
  //   trigger('slideInOutRight', [
  //     transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
  //     transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
  //   ])
  // ]
})
export class NavRight extends Ithouse implements Service {
  protected cs = inject(CommonService);
  protected router = inject(Router);
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
  profileImage = signal<string>('');

  user: any;
  // constructor
  constructor() {
    super();
    this.visibleUserList = false;
    this.chatMessage = false;
  }

  ngOnInit(): void {
    this.user = this.cs.loadLoginUser();
    if (this.user?.profileImagePath) {
      this.loadProfileImage(this.user?.profileImagePath);
    }
  }

  loadProfileImage(path: string) {
    const payload = {
      profileImagePath: path,
    }

    this.cs.sendRequest(this, ActionType.BUILD_IMAGE, ContentType.User, 'BUILD_IMAGE', payload);
  }

  // public method
  onChatToggle(friendID: any) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }


  logout() {
    this.cs.logout(this);
  }

  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      alert(super.getErrorMsg(res));
      return;
    }
    if (res.header.referance === 'logout') {
      this.router.navigate(['/login']);
    }
    else if (res.header.referance === 'BUILD_IMAGE') {
      this.profileImage.set(res.payload);
    }

  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
}
