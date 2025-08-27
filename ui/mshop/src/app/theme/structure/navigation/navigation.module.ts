import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NavContent } from './nav-content/nav-content';
import { Navigation } from './navigation';
import { NavCollapse } from './nav-content/nav-collapse/nav-collapse';
import { NavGroup } from './nav-content/nav-group/nav-group';
import { NavItem } from './nav-content/nav-item/nav-item';


@NgModule({
  declarations: [
    Navigation,
    NavContent,
    NavCollapse,
    NavGroup,
    NavItem,
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    RouterModule
  ],
  exports: [
    Navigation
  ]
})
export class NavigationModule { }
