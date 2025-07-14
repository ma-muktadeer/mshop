import { Component, EventEmitter, Input, Output } from '@angular/core';

interface friendsList {
  id: number;
  photo: string;
  name: string;
  new: number;
  status: number;
  time: string;
}
@Component({
  selector: 'ithouse-friend',
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.scss',
  standalone: false
})
export class FriendComponent {
 // public props
 @Input() friends!: friendsList;
 @Output() ChatOn = new EventEmitter();

 // public method
 innerChatToggle(friends: friendsList) {
   this.ChatOn.emit(friends.id);
 }
}
