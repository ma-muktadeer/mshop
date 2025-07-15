import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../ithouse/common/common.service';

export const notFoundGuard: CanActivateFn = (route, state) => {
  const cs = inject(CommonService);
  const router = inject(Router);
  const user = cs.loadLoginUser();
  
  if (user) {
    // const path = route.routeConfig?.path;
    router.navigate([`/${user.loginName}/home`]);
    return false;
  } else if(!user) {
    router.navigate([`/user`]);
    return false;
  }
  return true;
};
