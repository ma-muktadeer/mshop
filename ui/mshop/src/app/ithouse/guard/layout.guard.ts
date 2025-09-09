import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
export const layoutGuard: CanActivateFn = (route, state) => {
  const cs = inject(CommonService);
  const router = inject(Router);
  const user = cs.loadLoginUser();
  // if (user) {
  //   if(!state.url.includes(`${user?.loginName}/`)){
  //     router.navigate([`/${user?.loginName}/home`]);
  //     return false;
  //   }
  //   return true;
  // }else{
  //   router.navigate(['/login']);
  //   return false;
  // }
debugger
  if (!user) {
    return router.parseUrl('/login');
  }
  if (state.url.includes('/page-not-found')) {
    return true;
  }
  const loginName = route.params['loginName'];
  if (loginName !== user.loginName) {
    return router.parseUrl(`/${loginName}/page-not-found`);
  }
  return true;
};
