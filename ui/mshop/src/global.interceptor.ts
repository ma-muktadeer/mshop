import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { CommonService } from "./app/services/common.service";
import { ConfigService } from "./config.service";

export const globalInterceptor: HttpInterceptorFn = (req, next) => {

  // Write your logic
  console.log("Inside interceptor")

  // const router = inject(Router);
  const cs = inject(CommonService);
  const config = inject(ConfigService);

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
          'Content-Type': 'application/json; charset=utf-8',
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

      // if (error.status === 403) {
      //     cs.removeSession();
      //     router.navigate(['/login'], { queryParams: { sessionExpired: true } });
      // }
      return throwError(() => error);
    })
  )

};

