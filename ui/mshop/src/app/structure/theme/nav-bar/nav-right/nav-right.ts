import { Component, inject, OnInit, signal } from '@angular/core';
import { NgbDropdownConfig, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Ithouse } from 'src/app/ithouse/services/Ithouse';
import { Service } from 'src/app/ithouse/services/service';
import { Router } from '@angular/router';
import { Profile } from 'src/app/routs-components/private/profile/profile';
import { ActionType } from 'src/app/ithouse/constants/action-type.enum';
import { CommonService } from 'src/app/ithouse/services/common.service';
import { ContentType } from 'src/app/ithouse/constants/content-type.enum';
import { SessionManagment } from 'src/app/ithouse/services/session-managment';

@Component({
  selector: 'app-nav-right',
  standalone: false,
  templateUrl: './nav-right.html',
  styleUrl: './nav-right.scss',
  providers: [NgbDropdownConfig, SessionManagment],
})
export class NavRight extends Ithouse implements OnInit, Service {

  protected cs = inject(CommonService);
  protected router = inject(Router);
  private readonly sessionManagment = inject(SessionManagment);
  profileImage = signal<string>('assets/images/user/avater.png');
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
  user: any;
  updateDialog: NgbModalRef | null = null;
  userList: Array<any> = [];
  total: number;

  constructor(
    private modalService: NgbModal
  ) {
    super();
    this.visibleUserList = false;
    this.chatMessage = false;
  }

  ngOnInit(): void {
    this.user = this.cs.loadLoginUser();
    if (this.user?.profileImagePath) {
      this.loadProfileImage(this.user?.profileImagePath);
    }
    // this.sessionManagment.startSession(this.appTimeOutMin, this);
  }

  // ngOnDestroy(): void {
  //   this.sessionManagment.ngOnDestroy();
  // }

  loadProfileImage(path: string) {
    const payload = {
      profileImagePath: path,
    }

    this.cs.sendRequest(this, ActionType.BUILD_IMAGE, ContentType.User, 'BUILD_IMAGE', payload);
  }

  openProfile() {
    debugger
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      backdrop: 'static',
      keyboard: true
    };
    const currentUser = this.cs.loadLoginUser();

    this.updateDialog = this.modalService.open(Profile, modalOptions);
    this.updateDialog.componentInstance.isPopup = true;
    this.updateDialog.componentInstance.isViewMode = false;
    this.updateDialog.componentInstance.isUpdate = true;
    this.updateDialog.componentInstance.userId = currentUser.userId;
    this.updateDialog.componentInstance.currentUser = currentUser;


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
    debugger
    if (!super.isOK(res)) {
      alert(super.getErrorMsg(res));
      return;
    }
    if (req.header.reference === 'logout') {
      this.cs.removeUserInfo();
      this.router.navigate(['/login']);
    }
    else if (req.header.reference === 'BUILD_IMAGE') {
      this.profileImage.update((val) => res.payload || val);
    }

  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }


}
