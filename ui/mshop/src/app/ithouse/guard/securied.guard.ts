import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { InjectPermissionService } from '../services/inject-permission.service';
import { CommonService } from '../services/common.service';

export const securiedGuard: CanActivateFn = (route, state) => {
  const injectPermission = inject(InjectPermissionService);
  const cs = inject(CommonService);
  const router = inject(Router);
  console.log('securied ');
debugger
  // if (!cs.getUserId()) {
  //   router.navigate(['/login']);
  //   return false;
  // }
  if (injectPermission.isAuthUrl(state.url)) {
    return true; // Or add your custom logic
  }
  return router.parseUrl(`/page-not-found`);

};
