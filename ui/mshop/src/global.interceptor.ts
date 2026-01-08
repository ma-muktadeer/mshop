import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ConfigService } from "./config.service";
import { Router } from "@angular/router";
import { CommonService } from "./app/ithouse/services/common.service";

export const globalInterceptor: HttpInterceptorFn = (req, next) => {

  // Write your logic
  console.log("Inside interceptor")

  // const router = inject(Router);
  const cs = inject(CommonService);
  const config = inject(ConfigService);
  const router = inject(Router);

  let xhr = req;

  if (req.url.includes('/public/')) {
    xhr = req.clone({
      withCredentials: false,
      setHeaders: {
        'appName': config.appName,
      }
    });
  }
  else if (req.url.includes('/assets/env')) {
    xhr = req.clone({
      withCredentials: false,
    });
  }
  else {
    if (!req.headers.get('Authorization')) {
      xhr = req.clone({
        withCredentials: true,
        setHeaders: {
          // 'Content-Type' : 'application/x-www-form-urlencoded',
          // 'Content-Type': 'application/json; charset=utf-8',
          'Authorization': cs.getToken(),
          'appName': config.appName,
        },
      });
    }
    else {
      const header = req.headers.set('appName', config.appName);
      xhr = req.clone({
        withCredentials: true,
        headers: header,
      });
    }
  }

  return next(xhr).pipe(
    catchError((error: any) => {
      if (error.status === 1001) {
        cs.removeUserInfo();
        router.navigate(['/login'], { queryParams: { sessionExpired: true } });
      }
      return throwError(() => error);
    })
  )

};

