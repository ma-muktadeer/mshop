import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from 'src/app/ithouse/services/common.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const cs = inject(CommonService);
  const router = inject(Router);
  console.log('loginGuard', state.url);

  // return cs.loadLoginUser() ?
  //   router.parseUrl(`/${cs.loadLoginUser()?.loginName}/home`)
  //   : true;
  if (cs.loadLoginUser()?.userId) {
    router.navigate([`/${cs.loadLoginUser()?.loginName}/dashboard`])
    return false;
  }
  return true;
};
