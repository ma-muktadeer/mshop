import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../../../ithouse/common/common.service';
import { Ithouse } from '../../../../../ithouse/common/Ithouse';
import { Service } from '../../../../../ithouse/common/service';
import { ActionType } from '../../../../../ithouse/constants/action-type.enum';
import { ContentType } from '../../../../../ithouse/constants/content-type.enum';

@Component({
  selector: 'ithouse-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrl: './nav-right.component.scss',
  standalone: false
})
export class NavRightComponent extends Ithouse implements OnInit, Service {
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
  onChatToggle(friendID: number) {
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
