import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { ConfigService } from "./config.service";
import { endpointConfig } from "./endpoint.config";
import { CommonService } from "./ithouse/common/common.service";
// import { catchError } from "rxjs";

// @Injectable(
//     {
//         providedIn: 'root'
//     }
// )
// export class XhrInterceptor implements HttpInterceptor {
//     intercept(req: HttpRequest<any>, next: HttpHandler) {
//         debugger
//         console.log(req);
//         if (req.url.includes('/public/')) {
//             const xhr = req.clone({
//                 withCredentials: false  //local false and live true
//             });
//             //console.log(xhr)
//             return next.handle(xhr);
//         }
//         else {
//             if (!req.headers.get('Authorization')) {
//                 const token = sessionStorage!.getItem("AUTH_TOKEN");
//                 const xhr = req.clone({
//                     withCredentials: true,
//                     setHeaders: {
//                         // 'Content-Type' : 'application/x-www-form-urlencoded',
//                         'Content-Type': 'application/json; charset=utf-8',
//                         'Authorization': token!,
//                     },
//                 });
//                 return next.handle(xhr);
//             }

//             const xhr = req.clone({
//                 withCredentials: true,
//                 headers: req.headers,  //local false and live true
//             });
//             //console.log(xhr)
//             return next.handle(xhr);

//             //console.log(xhr)
//         }

//     }
// }

// export const authInterceptorsProveiders = (
//     {
//         provide: HTTP_INTERCEPTORS,
//         useClass: XhrInterceptor,
//         multi: true,
//     }
// )


export const ithouseInterceptor: HttpInterceptorFn = (req, next) => {
    // Write your logic 
    
    console.log("Inside interceptor")
    const router = inject(Router);
    const config = inject(ConfigService);
    const cs = inject(CommonService);
    // const token = cs.sessionStorage?.getItem('AUTH_TOKEN');
    const appName = endpointConfig(config)?.getAppName;

    let xhr = req;

    if (req.url.includes('/public/')) {
        xhr = req.clone({
            withCredentials: false, //local false and live true
            setHeaders: {
                'appName': appName,
            }
        });
        // return next(xhr);
    }
    else if (req.url.includes('/assets/env')) {
        xhr = req.clone({
            withCredentials: false, //local false and live true
            // setHeaders: {
            //     'appName': appName,
            // }
        });
        // return next(xhr);
    }
    else {
        if (!req.headers.get('Authorization')) {
            // const token = sessionStorage!.getItem("AUTH_TOKEN");
            xhr = req.clone({
                withCredentials: true,
                setHeaders: {
                    // 'Content-Type' : 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': cs.sessionStorage?.getItem('AUTH_TOKEN')!,
                    'appName': appName,
                },
            });
            // return next(xhr);
        }
        else {
            const header = req.headers.set('appName', appName);

            xhr = req.clone({
                withCredentials: true,
                headers: header,  //local false and live true
            });
        }
        // return next(xhr);
    }

    return next(xhr).pipe(
        catchError((error: any) =>{
            if(error.status === 403){
                debugger
                cs.removeUserInfo();
                router.navigate(['/login'], {queryParams:{sessionExpired: true}});
            }
            return throwError(()=> new Error(error));
        })
    )
};