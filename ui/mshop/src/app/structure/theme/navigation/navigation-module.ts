import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navigation } from './navigation';
import { NavContent } from './nav-content/nav-content';
import { NavCollapse } from './nav-content/nav-collapse/nav-collapse';
import { NavGroup } from './nav-content/nav-group/nav-group';
import { NavItem } from './nav-content/nav-item/nav-item';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterModule } from '@angular/router';
import { NabItemsService } from './nab-items.service';

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
    RouterModule,
  ],
  providers: [NabItemsService],
  exports: [
    Navigation,
  ]
})
export class NavigationModule { }
