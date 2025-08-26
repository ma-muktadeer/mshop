import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../ithouse/common/common.service';
import { InjectPermissionService } from '../ithouse/servies/InjectPermissionService';

export const layoutGuard: CanActivateFn = (route, state) => {
  const injectPermission = inject(InjectPermissionService);
  const cs = inject(CommonService);
  const router = inject(Router);
  const user = cs.loadLoginUser();
  if (user) {
    // debugger
    // if (injectPermission.isAuthUrl(state.url)) {
    //   return true;
    // }
    // else {
    //   router.navigate([`/not-found`]);
    //   return false;
    // }
    if(!state.url.includes(`${user?.loginName}/`)){
    // if(!state.url.includes(`ithousebd/`)){
      router.navigate([`/${user?.loginName}/home`]);
      return false;
    }
    return true;
  }else{
    router.navigate(['/login']);
    return false;
  }
};
