import { Routes } from '@angular/router';
import { Structure } from './theme/structure/structure';
import { Check } from './routs-components/public/check/check';

export const routes: Routes = [
  {
    path: '',
    component: Structure,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => Check,
        pathMatch: 'full',
        // canActivate: [securiedGuard]
      },
      // {
      //     path: 'admin', loadChildren: () => import('./layout/admin/admin-routing.module').then(r => r.AdminRoutingModule),
      //     canActivateChild: [securiedChildGuard]
      // },
      // {
      //     path: 'loan', loadChildren: () => import('./layout/loan/loan-routing.module').then(r => r.loanRoutes),
      // },

      // {
      //     path: 'page-not-found',
      //     component: PageNotFoundComponent,
      //     pathMatch: 'full'
      // }
    ]
  },
];
