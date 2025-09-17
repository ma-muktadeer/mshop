import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-user-list',
  standalone: false,
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
