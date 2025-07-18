import { Routes } from '@angular/router';
import { loginGuard } from './views/public/registration/login.guard';
import { StructureComponent } from './layout/theme/structure/structure.component';
import { layoutGuard } from './layout/layout.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { notFoundGuard } from './not-found/not-found.guard';

export const routes: Routes = [
  {
    path: 'login', loadChildren: () => import('./views/public/public-routing.module').then(m => m.regRoutes)
    , canActivate: [loginGuard],
  },
  {
    path: ":loginName",
    component: StructureComponent,
    canActivate: [layoutGuard],
    loadChildren: () => import('./views/secure/secure-routing.module').then(m => m.secRoutes),
  },
  { path: '**', component: NotFoundComponent, canActivate: [notFoundGuard], },
  // redirectTo:()=>{
  //     const usr = Inject(CommonService).loadLoginUser();
  //     return usr?usr.loginName:'login';
  //  }
];
