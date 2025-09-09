import { Routes } from '@angular/router';
import { Structure } from './theme/structure/structure';
import { Login } from './components/public/login/login';
import { loginGuard } from './components/public/login/login.guard';
import { Dashbord } from './components/secure/dashbord/dashbord';
import { securiedGuard } from './ithouse/guard/securied.guard';
import { PageNotFound } from './components/public/page-not-found/page-not-found';
import { layoutGuard } from './ithouse/guard/layout.guard';
import { User } from './components/secure/user/user';
import { secureRoutes } from './components/secure/secure.routing';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
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
  {
    path: '**',
    redirectTo: 'login'
  }

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
    path: 'user',
    loadComponent: () => User,
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () => secureRoutes,
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
