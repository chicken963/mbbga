import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    isAuthorized(): boolean {
        return localStorage.getItem("mbbg_token") != null && localStorage.getItem("mbbg_token") != "";
    }

    login(credentials: any): Observable<any> {
        return this.httpClient.post<any>("/auth", credentials);
    }

    getUser(): string {
        return localStorage.getItem("user") as string;
    }

    logout() {
        localStorage.setItem("mbbg_token", "");
        localStorage.setItem("user", "");
        this.router.navigate(['/']);
    }
}