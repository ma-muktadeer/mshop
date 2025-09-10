import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { CommonService } from "./ithouse/services/common.service";
import { ConfigService } from "./ithouse/services/config.service";

export const globalInterceptor: HttpInterceptorFn = (req, next) => {

  // Write your logic
  console.log("Inside interceptor")

  const router = inject(Router);
  const cs = inject(CommonService);
  const _config = inject(ConfigService);


  let xhr = req;

  if (req.url.includes('/public/')) {
    xhr = req.clone({
      withCredentials: false,
      setHeaders: {
        'appName': _config.config.app.constantAppName
      }
    });
    // return next(xhr);
  }
  else if (req.url.includes('/assets/env')) {
    xhr = req.clone({
      withCredentials: false,
    });
  }
  else {
    if (!req.headers.get('Authorization')) {
      // const token = sessionStorage!.getItem("AUTH_TOKEN");
      xhr = req.clone({
        withCredentials: true,
        setHeaders: {
          // 'Content-Type' : 'application/x-www-form-urlencoded',
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': cs.getToken(),
          'appName': _config.config.app.constantAppName
        },
      });
      // return next(xhr);
    }
    else {
      // const header = req.headers;
       const header = req.headers.set('appName', _config.config.app.constantAppName);

      xhr = req.clone({
        withCredentials: true,
        headers: header,  //local false and live true
      });
    }
    // return next(xhr);
  }

  return next(xhr).pipe(
    catchError((error: any) => {

      // if (error.status === 403) {
      //     cs.removeSession();
      //     router.navigate(['/login'], { queryParams: { sessionExpired: true } });
      // }
      return throwError(() => error);
    })
  )

};

