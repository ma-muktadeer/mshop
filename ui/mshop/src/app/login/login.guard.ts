import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../ithouse/services/common.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const loginUser = inject(CommonService).loadLoginUser();
  const router = inject(Router);
  debugger
  if (loginUser?.userId) {
    router.navigate(['/dashboard'])
    return false;
  }
  return true;
};
