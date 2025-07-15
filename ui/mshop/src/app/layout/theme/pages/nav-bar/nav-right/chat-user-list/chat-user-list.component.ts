import { Component, EventEmitter, Output } from '@angular/core';
import { FriendsList } from '../../../../../../fack-db/friends-list';

@Component({
  selector: 'ithouse-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrl: './chat-user-list.component.scss',
  standalone: false
})
export class ChatUserListComponent {
  // public props
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
