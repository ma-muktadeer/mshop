import { Routes } from '@angular/router';
import { securiedGuard } from 'src/app/ithouse/guard/securied.guard';
import { Dashbord } from 'src/app/routs-components/private/dashbord/dashbord';
import { User } from 'src/app/routs-components/private/user/user';
import { PageNotFound } from "src/app/routs-components/public/page-not-found/page-not-found";
import { Profile } from '../routs-components/private/profile/profile';
import { adminRoutes } from '../routs-components/private/private.routing';

export const structureRouts: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => Dashbord,
    // canActivate: [securiedGuard]
  },
  {
    path: 'user',
    loadComponent: () => User,
    pathMatch: 'full'
  },
  { path: 'profile', loadComponent: () => Profile, pathMatch: 'full' },
  {
    path: 'admin',
    loadChildren: () => adminRoutes,
    // canActivateChild: [securiedGuard],
  },
  {
    path: 'page-not-found',
    loadComponent: () => PageNotFound,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
]
