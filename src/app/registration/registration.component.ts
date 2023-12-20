import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogService} from "../utils/dialog.service";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
    registrationData = {
        email: '',
        login: '',
        password: '',
    };

    constructor(private authService: AuthService, private router: Router, private fb: FormBuilder,
                private dialogService: DialogService) {
    }

    registerForm: FormGroup;
    registrationFailedMessage: string;

    ngOnInit() {
        this.registerForm = this.fb.group({
            email: ['', [Validators.email]],
            login: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6), this.passwordMatchValidator.bind(this)]],
            confirmPassword: ['', [Validators.required, this.passwordMatchValidator.bind(this)]]
        });
    }

    passwordMatchValidator(confirmPasswordInput: AbstractControl) {
        const password = this?.registerForm?.get('password')?.value;
        const confirmPassword = confirmPasswordInput.value;
        return confirmPassword === "" || password === confirmPassword ? null : {mismatch: true};
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.registrationData.email = this.registerForm.get('email')?.value;
            this.registrationData.login = this.registerForm.get('login')?.value;
            this.registrationData.password = this.registerForm.get('password')?.value;

            this.authService.register(this.registrationData).subscribe(
                (response) => {
                    this.dialogService.showOkPopup("Successfully registrated",
                        `Thank you for registration!`,
                        () => this.router.navigate(["/"]))
                },
                (error) => {
                    if (error.status === 409) {
                        this.registrationFailedMessage = "Registration failed: " + error.error;
                        if (error.error.includes("email")) {
                            this.registerForm.get("email")?.setErrors({exists: true});
                        } else if (error.error.includes("login")) {
                            this.registerForm.get("login")?.setErrors({exists: true});
                        }
                    }
                }
            );
        }
    }

    get f() {
        return this.registerForm.controls;
    }
}
