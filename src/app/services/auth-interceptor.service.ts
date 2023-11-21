import {Injectable} from '@angular/core';

import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }


  intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (request.url.includes("/auth")) {
            return next.handle(request);
        }
        const token = localStorage.getItem('mbbg_token');

        const authReq = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next.handle(authReq).pipe(
            tap(
                (event) => {
                },
                (error) => {
                    if (error.status === 401 || error.status === 403) {
                        localStorage.setItem("mbbg_token", "");
                        localStorage.setItem("user", "");
                        this.router.navigate(['/login']);
                    }
                }
            )
        );
    }
}
