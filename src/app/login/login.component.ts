import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogService} from "../utils/dialog.service";

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
    constructor(private authService: AuthService,
                private router: Router,
                private fb: FormBuilder,
                private dialogService: DialogService) {}

    loginForm: FormGroup;

    ngOnInit() {
        this.loginForm = this.fb.group({
            login: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.credentials.login = this.loginForm.get('login')?.value;
            this.credentials.password = this.loginForm.get('password')?.value;

            this.authService.login(this.credentials).subscribe(
                (response) => {
                    localStorage.setItem("mbbg_token", response.token);
                    localStorage.setItem("user", response.username);
                    this.authService.fetchCurrentUser();
                    this.router.navigate(["player"]);
                },
                (error) => {
                    if (error.status === 400) {
                        this.dialogService.showOkPopup("Login failed", error.error);
                    } else if (error.status === 401) {
                        this.loginForm.get("password")?.setErrors({wrongCredentials: true});
                    }
                }
            );
        }
    }

    get f() {
        return this.loginForm.controls;
    }

    resetErrors() {
        if (this.loginForm.get("password")?.errors) {
            // @ts-ignore
            this.loginForm.get("password").errors.wrongCredentials = null;
        }
    }
}
