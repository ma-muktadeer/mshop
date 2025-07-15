import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../../../ithouse/common/common.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const cs = inject(CommonService);
  const router = inject(Router);
  return cs.loadLoginUser() ? router.parseUrl(`/${cs.loadLoginUser()?.loginName}/home`) : true;
};
