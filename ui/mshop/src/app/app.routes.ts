import { Routes } from '@angular/router';
import { Login } from './routs-components/public/login/login';
import { loginGuard } from './routs-components/public/login/login.guard';
import { layoutGuard } from './ithouse/guard/layout.guard';
import { Structure } from './structure/structure';
import { structureRouts } from './structure/structureRouts';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => Login,
    canActivate: [loginGuard],
    pathMatch: 'full'
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
