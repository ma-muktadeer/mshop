// Angular Import
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgScrollbar } from "ngx-scrollbar";

// project import

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss'],
  imports: [NgScrollbar, FormsModule]
})
export class ChatUserListComponent {
  // public props
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
