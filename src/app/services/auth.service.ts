import {Injectable, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Router} from "@angular/router";
import {User} from "../interfaces/user";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private userSubject = new Subject<User>;
    user: User;

    constructor(private httpClient: HttpClient, private router: Router) {
        if (this.isAuthorized()) {
            this.fetchCurrentUser();
        }
    }

    isAuthorized(): boolean {
        return localStorage.getItem("mbbg_token") != null && localStorage.getItem("mbbg_token") != "";
    }

    login(credentials: any): Observable<any> {
        return this.httpClient.post<any>("/users/login", credentials);
    }

    logout() {
        localStorage.setItem("mbbg_token", "");
        this.router.navigate(['/']);
    }

    register(registrationData: { password: string; login: string; email: string }): Observable<any> {
        return this.httpClient.post<any>("/users/register", registrationData);
    }

    setUser(user: User): void {
        this.userSubject.next(user);
    }

    getUser(): Observable<User> {
        return this.userSubject.asObservable();
    }

    fetchCurrentUser() {
        this.httpClient.get<User>("/users/current").subscribe(user => {
            this.user = user;
            this.setUser(user);
        })
    }
}