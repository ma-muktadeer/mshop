import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services/common.service';

// export class AuthGuard implements CanActivate {
//   constructor(private router: Router, private cs: CommonService) { }

//   canActivate() {
//     var loginUser = this.cs.loadLoginUser();
//     if (loginUser?.userId) {
//       return true;
//     }

//     this.router.navigate(['/login']);
//     return false;
//   }
// }

export const AuthGuard: CanActivateFn = (route, state) => {
  const loginUser = inject(CommonService).loadLoginUser();
  const router = inject(Router);

  console.log('auth guard');

  if (loginUser?.userId) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
