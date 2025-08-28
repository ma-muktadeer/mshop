import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../../../ithouse/services/common.service';

export const loginGuard: CanActivateFn = (route, state) => {
  // const cs = inject(CommonService);
  // const router = inject(Router);

  // console.log('login');
  // // return cs.loadLoginUser() ? router.parseUrl(`/${cs.loadLoginUser()?.loginName}/home`) : true;

  // if (cs.getUserId()) {
  //   return router.parseUrl(`/${cs.loadLoginUser()?.loginName}/home`);
  // }
  // return true;

  const cs = inject(CommonService);
  const router = inject(Router);
  return cs.loadLoginUser() ? router.parseUrl(`/${cs.loadLoginUser()?.loginName}/home`) : true;

};
