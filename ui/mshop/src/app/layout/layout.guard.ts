import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../ithouse/common/common.service';

export const layoutGuard: CanActivateFn = (route, state) => {
  
  const cs = inject(CommonService);
  const router = inject(Router);
  const user = cs.loadLoginUser();
  console.log('app gud');
  if(user){
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
