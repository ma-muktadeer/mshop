import { NgClass } from '@angular/common';
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
  imports: [NgClass],
  templateUrl: './friend.html',
  styleUrl: './friend.scss'
})

export class Friend {
  @Input() friends!: friendsList;
  @Output() ChatOn = new EventEmitter();

  // public method
  innerChatToggle(friends: friendsList) {
    this.ChatOn.emit(friends.id);
  }
}
