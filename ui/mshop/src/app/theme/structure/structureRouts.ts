import { Routes } from '@angular/router';
import { securiedGuard } from 'src/app/ithouse/guard/securied.guard';
import { Dashbord } from 'src/app/routs-components/private/dashbord/dashbord';
import { User } from 'src/app/routs-components/private/user/user';
import { PageNotFound } from "src/app/routs-components/public/page-not-found/page-not-found";

export const structureRouts: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => Dashbord,
    canActivate: [securiedGuard]
  },
  {
    path: 'user',
    loadComponent: () => User,
    pathMatch: 'full'
  },
  {
    path: 'page-not-found',
    loadComponent: () => PageNotFound,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
]
