import {Injectable} from '@angular/core';

import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from "@angular/router";
import {NotificationService} from "../utils/notification.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private notificationService: NotificationService) {
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
                        this.router.navigate(['/login']);
                    }
                    this.notificationService.pushNotification(
                        "Failed to process data. Reason: " + error.error,
                        "error");
                }
            )
        );
    }
}
