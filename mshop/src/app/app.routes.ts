import { Routes } from '@angular/router';
import { loginGuard } from './views/public/registration/login.guard';

export const routes: Routes = [
  // {
  //   path: 'login', loadChildren: () => import('./views/public/public-routing.module').then(m => m.PublicRoutingModule)
  //   , canActivate: [loginGuard],
  // },
  // {
  //   path: ":loginName",
  //   component: StructureComponent,
  //   canActivate: [layoutGuard],
  //   loadChildren: () => import('./views/secure/secure-routing.module').then(m => m.SecureRoutingModule),
  // },
  // { path: '**', component: NotFoundComponent, canActivate: [notFoundGuard], },
  // redirectTo:()=>{
  //     const usr = Inject(CommonService).loadLoginUser();
  //     return usr?usr.loginName:'login';
  //  }
];
