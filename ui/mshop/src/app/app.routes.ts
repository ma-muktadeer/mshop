import { Routes } from '@angular/router';
import { Structure } from './theme/structure/structure';
import { AuthGuard } from './ithouse/guard/auth.guard';
import { Login } from './components/public/login/login';
import { loginGuard } from './components/public/login/login.guard';
import { Dashbord } from './components/secure/dashbord/dashbord';
import { securiedGuard } from './ithouse/guard/securied.guard';
import { PageNotFound } from './components/public/page-not-found/page-not-found';
import { layoutGuard } from './ithouse/guard/layout.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => Login,
    canActivate: [loginGuard]
  },
  {
    path: ':loginName',
    component: Structure,
    canActivate: [layoutGuard],
    loadChildren: () => structureRouts
  },

];

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
    path: 'page-not-found',
    loadComponent: () => PageNotFound,
    pathMatch: 'full'
  }
]
