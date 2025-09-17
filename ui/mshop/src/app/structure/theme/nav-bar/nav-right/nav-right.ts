import { Component, inject, OnInit, signal } from '@angular/core';
import { NgbDropdownConfig, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { Ithouse } from 'src/app/services/common/Ithouse';
import { Service } from 'src/app/services/service';
import { ChatUserList } from "./chat-user-list/chat-user-list";
import { ChatMsg } from "./chat-msg/chat-msg";
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-right',
  imports: [ChatUserList, ChatMsg, NgClass],
  templateUrl: './nav-right.html',
  styleUrl: './nav-right.scss',
  providers: [NgbDropdownConfig],
})
export class NavRight extends Ithouse implements OnInit, Service {

  protected cs = inject(CommonService);
  protected router = inject(Router);
  profileImage = signal<string>('assets/images/user/avater.png');
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
  user: any;
  updateDialog: NgbModalRef | null = null;
  userList: Array<any> = [];
  total: number;
  // constructor
  constructor(
    private modalService: NgbModal
  ) {
    super();
    this.visibleUserList = false;
    this.chatMessage = false;
  }

  ngOnInit(): void {
      this.user = this.cs.loadLoginUser();
  }

  openProfile() {
    debugger
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      backdrop: 'static',
      keyboard: true
    };
   const currentUser = this.cs.loadLoginUser();

    // this.updateDialog = this.modalService.open(ProfileComponent, modalOptions);
    // this.updateDialog.componentInstance.isPopup = true;
    // this.updateDialog.componentInstance.isViewMode = false;
    // this.updateDialog.componentInstance.isUpdate = true;
    // this.updateDialog.componentInstance.userId = currentUser.userId;
    // this.updateDialog.componentInstance.currentUser = currentUser;


  }
  // public method
  onChatToggle(friendID: number) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }


  logout() {
    // this.cs.logout(this);
  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    // if(!super.isOK(res)){
    //   alert(super.getErrorMsg(res));
    //   return;
    // }
    if (res.header.referance === 'logout') {
      this.router.navigate(['/login']);
    }

  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }


}
