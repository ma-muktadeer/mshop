import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services/common.service';

// export const layoutGuard: CanActivateFn = (route, state) => {
//   const cs = inject(CommonService);
//   const router = inject(Router);
//   const user = cs.loadLoginUser();
//   console.log('layoutGuard', state.url);

//   // if (user) {
//   //   if(!state.url.includes(`${user?.loginName}/`)){
//   //     router.navigate([`/${user?.loginName}/home`]);
//   //     return false;
//   //   }
//   //   return true;
//   // }else{
//   //   router.navigate(['/login']);
//   //   return false;
//   // }

//   if (!user) {
//     return router.parseUrl('/login');
//   }
//   if (state.url.includes('/page-not-found')) {
//     return true;
//   }
//   const loginName = route.params['loginName'];
//   if (loginName !== user.loginName) {
//     return router.parseUrl(`/${loginName}/page-not-found`);
//   }
//   return true;
// };

@Injectable()
export class layoutGuard implements CanActivate {
  constructor(private router: Router, private cs: CommonService) { }

  canActivate() {
    console.log('layoutGuard', this.router.url);
    var loginUser = this.cs.loadLoginUser();
    if (loginUser?.userId) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
