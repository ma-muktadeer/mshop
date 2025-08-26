import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../../../ithouse/common/common.service';

export const ithouseGuard: CanActivateFn = (route, state) => {
  const user = inject(CommonService)?.loadLoginUser();
  const router = inject(Router);
  if(user){
    debugger
    if(user?.loginName === 'ithousebd' || user?.authorities?.[0]['authority'] === 'ADMIN'){
      return true;
    }
    else if(!state.url.includes(`${user?.loginName}/${user?.loginName}`)){
      router.navigate([`/${user?.loginName}/home`]);
      return false;
    }
    return true;
  }else{
    router.navigate(['/user/registration']);
    return false;
  };
};
