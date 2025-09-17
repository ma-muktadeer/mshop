import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'app-chat-user-list',
  imports: [NgScrollbar, FormsModule],
  templateUrl: './chat-user-list.html',
  styleUrl: './chat-user-list.scss'
})
export class ChatUserList {
  @Output() ChatCollapse = new EventEmitter();
  @Output() ChatToggle = new EventEmitter();
  searchFriends!: string;
  // eslint-disable-next-line
  // friendsList: any = FriendsList.friends;

  // public method
  ChatOn() {
    this.ChatToggle.emit();
  }
}
