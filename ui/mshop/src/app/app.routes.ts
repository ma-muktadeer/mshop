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


  // {
  //   path: '',
  //   component: Structure,
  //   // canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'dashboard',
  //       pathMatch: 'full'
  //     },
  //     {
  //       path: 'dashboard',
  //       loadComponent: () => Check,
  //       pathMatch: 'full',
  //       // canActivate: [securiedGuard]
  //     },
  //     // {
  //     //     path: 'admin', loadChildren: () => import('./layout/admin/admin-routing.module').then(r => r.AdminRoutingModule),
  //     //     canActivateChild: [securiedChildGuard]
  //     // },
  //     // {
  //     //     path: 'loan', loadChildren: () => import('./layout/loan/loan-routing.module').then(r => r.loanRoutes),
  //     // },

  //     // {
  //     //     path: 'page-not-found',
  //     //     component: PageNotFoundComponent,
  //     //     pathMatch: 'full'
  //     // }
  //   ]
  // },
];
