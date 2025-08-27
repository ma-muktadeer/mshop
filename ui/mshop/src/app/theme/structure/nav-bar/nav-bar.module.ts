import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NavBar } from './nav-bar';
import { NavLeft } from './nav-left/nav-left';
import { NavRight } from './nav-right/nav-right';
import { NavSearch } from './nav-left/nav-search/nav-search';
import { ChatMsg } from './nav-right/chat-msg/chat-msg';
import { ChatUserList } from './nav-right/chat-user-list/chat-user-list';
import { Friend } from './nav-right/chat-user-list/friend/friend';
import { ToggleFullScreenDirective } from '../../full-screen/toggle-full-screen';



@NgModule({
  declarations: [
    NavBar,
    NavLeft,
    NavRight,
    NavSearch,
    ChatMsg,
    ChatUserList,
    Friend
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgScrollbarModule,
    FormsModule,
    RouterLink,
    ToggleFullScreenDirective
  ],
  exports: [
    NavBar
  ]
})
export class NavBarModule { }
