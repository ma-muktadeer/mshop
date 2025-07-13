import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ithouseGuard } from './ithouse/ithouse.guard';

const routes: Routes = [
  {
    path: 'admin', pathMatch: 'prefix', canActivate: [ithouseGuard],
    // loadChildren: () => import('./ithouse/ithouse-routing.module').then(m => m.IthouseRoutingModule),
    // children: [
    //   { path: 'user', component: UserComponent, pathMatch: 'full' },
    // ],
    loadChildren: () => import('../secure/ithouse/ithouse-routing.module').then(m => m.IthouseRoutingModule)
  },
  { path: 'home', loadComponent: () => import('../../demo/dashboard/dash-analytics.component').then(c => c.default), pathMatch: 'full' },
  { path: 'profile', loadComponent: () => import('./commons/profile/profile.component').then(c => c.ProfileComponent), pathMatch: 'full' },
  {
    path: 'mshop', loadChildren: () => import('./mshop/mshop-routing.module').then(r => r.MshopRoutingModule), pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
