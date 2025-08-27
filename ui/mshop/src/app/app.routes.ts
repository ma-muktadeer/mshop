import { Routes } from '@angular/router';
import { Structure } from './theme/structure/structure';
import { AuthGuard } from './ithouse/guard/auth.guard';
import { Login } from './login/login';
import { loginGuard } from './login/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: Structure,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: Login,
    canActivate:[loginGuard]
  }
];
