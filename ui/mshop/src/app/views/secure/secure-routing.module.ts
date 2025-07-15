import { Routes } from '@angular/router';
import { ithouseGuard } from './ithouse/ithouse.guard';
import DashAnalyticsComponent from '../../demo/dashboard/dash-analytics.component';
import { ProfileComponent } from './commons/profile/profile.component';

export const secRoutes: Routes = [
  {
    path: 'admin', pathMatch: 'prefix', canActivate: [ithouseGuard],
    loadChildren: () => import('../secure/ithouse/ithouse-routing.module').then(m => m.itRoutes)
  },
  { path: 'home', loadComponent: () => DashAnalyticsComponent, pathMatch: 'full' },
  { path: 'profile', loadComponent: () => ProfileComponent, pathMatch: 'full' },
  // {
  //   path: 'mshop', loadChildren: () => import('./mshop/mshop-routing.module').then(r => r.MshopRoutingModule), pathMatch: 'prefix'
  // }
];
