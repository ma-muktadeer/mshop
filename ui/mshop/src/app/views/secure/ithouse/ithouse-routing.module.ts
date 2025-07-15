import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadDataComponent } from './load-data/load-data.component';
import { UserComponent } from './user/user.component';

export const itRoutes: Routes = [
  { path: 'user', loadComponent:()=> UserComponent, pathMatch: 'full' },
  { path: 'userr', loadComponent:()=> LoadDataComponent, pathMatch: 'full' },
];
