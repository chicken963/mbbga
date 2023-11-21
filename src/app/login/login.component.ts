import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    credentials = {
        login: '',
        password: '',
    };
    constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {}

    loginForm: FormGroup;

    ngOnInit() {
        this.loginForm = this.fb.group({
            login: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            // @ts-ignore
            this.credentials.login = this.loginForm.get('login').value;
            // @ts-ignore
            this.credentials.password = this.loginForm.get('password').value;

            this.authService.login(this.credentials).subscribe(
                (response) => {
                    localStorage.setItem("mbbg_token", response.token);
                    localStorage.setItem("user", response.username);
                    this.router.navigate(["player"]);
                },
                (error) => {
                    console.error('Login error', error);
                }
            );
        }
    }
}
