import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Friend } from "./friend/friend";
import { FriendsList } from '../../../../../fack-db/friends-list';

@Component({
  selector: 'ithouse-chat-user-list',
  imports: [NgScrollbarModule, FormsModule, Friend],
  templateUrl: './chat-user-list.html',
  styleUrl: './chat-user-list.scss'
})
export class ChatUserList {
  @Output() ChatCollapse = new EventEmitter();
  @Output() ChatToggle = new EventEmitter();
  searchFriends!: string;
  // eslint-disable-next-line
  friendsList: any = FriendsList.friends;

  // public method
  ChatOn() {
    this.ChatToggle.emit();
  }
}
