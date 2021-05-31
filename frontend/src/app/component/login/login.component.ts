import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbStepperComponent, NbThemeService, NbToastrService, NbTooltipDirective } from '@nebular/theme';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { faKey, faUser, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from 'src/app/service/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ThemeService } from 'src/app/service/theme.service';
import { ToasterService } from 'src/app/service/toaster.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('stepper') loginStepper!: NbStepperComponent;
  @ViewChild('stepperBack') regStepper!: NbStepperComponent;
  @ViewChild(NbTooltipDirective) tooltipSelector: any;

  action : any;  // action : login/Register
  toggleChecked = false;  // used to keep theme toggle in sync with theme state
  flipped : boolean = false;  // to keep approprate card(login/register) sync with the action
  displayProgress : boolean = false;

  // Icons
  faKey = faKey;
  faUser = faUser;
  faCheckDouble= faCheckDouble;

  // For login
  firstForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}$')]),
  })
  secondForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,20}$')]),
  })

  // For Registration
  firstRegForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9 ]{8,20}$'), Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}$')])
  })
  secondRegForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,20}$')]),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,20}$')])
  })

  loginData = {
    username : '',
    password : ''
  }

  RegistrationData = {
    username : '',
    email : '',
    password : '',
    confirmPassword : ''
  }

  // Toaster Props
  toasterPosition = 'top-right';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private themeService: NbThemeService,
    private _authService: AuthService,
    private _localThemeService: ThemeService,
    private _localToasterService: ToasterService
    ) {
    

    // Listen for the theme change, and update the toggle state
    this.themeService.onThemeChange()
      .subscribe((theme: any) => {
        if(theme.name=='dark'){
          this.toggleChecked = true;
        }
        else if(theme.name=='default'){
          this.toggleChecked = false;
        }
      });
  }


  // Login User
  onFirstLogSubmit() {
    this.firstForm.markAsDirty();
    if(this.firstForm.controls['username'].hasError('required')){
      this._localToasterService.showBrowserToast(
        "Username is required", 
        this.toasterPosition, 
        'warning', 
        4000, 
        "Form Control",
        true);
    }
    if(this.firstForm.controls['username'].hasError('pattern')){
      this._localToasterService.showBrowserToast(
        "Email is in invalid format, verify and submit the form", 
        this.toasterPosition, 
        'warning', 
        4000, 
        "Form Control",
        true);
    }
    if(this.firstForm.valid){
      this.loginData.username = this.firstForm.value.username;
      this.loginStepper.next(); // go to password step
    }
  }

  onSecondLogSubmit() {
    this.secondForm.markAsDirty();
    if(this.secondForm.controls['password'].hasError('required')){
      this._localToasterService.showBrowserToast(
        "Password is required", 
        this.toasterPosition, 
        'warning', 
        4000, 
        "Form Control",
        true)
    }
    if(this.secondForm.controls['password'].hasError('pattern')){
      this._localToasterService.showBrowserToast(
        "Password must contain atleast one uppercase, one lowercase, one number and a special character, with a length of 8-20 characters", 
        this.toasterPosition, 
        'warning', 
        4000, 
        "Form Control",
        true)
    }

    if(this.secondForm.valid){
      this.loginData.password = this.secondForm.value.password;
      
      this.displayProgress = true;
      this._authService.loginFormValidation(this.loginData).subscribe(response => {

        if(response.formValidation==true){
          // Send login details to the authService to start
          // Firebase user login
            this._authService.firebaseLogin(this.loginData);
            this.loginStepper.reset();

          // subscribe to the loginState to detect successful login of user
            this._authService.isLoggedIn$.subscribe(loggedInState => {
              if(loggedInState==true){

                setTimeout(() => {
                  this.displayProgress = false;
                }, 5000)
              }else{// check
                setTimeout(() => {
                  this.displayProgress = false;
                }, 2000)
              }
            })

        }else if(response.formValidation==false){
            this._localToasterService.showBrowserToast(
              response.message, 
              this.toasterPosition, 
              'danger', 
              4000, 
              "Server-side Form Validation",
              true)
            
            this.displayProgress = false;
        }
      },
      error => {
        if(error instanceof HttpErrorResponse){
          if(error.status == 500){
            this._localToasterService.showBrowserToast(
              "Server encountered a fatal error, retry again!", 
              this.toasterPosition, 
              'danger', 
              4000, 
              "Server-side Form Validation",
              true)
            this.displayProgress = false;
          }else if(error.status==422){
            this._localToasterService.showBrowserToast(
              error.message, 
              this.toasterPosition, 
              'danger', 
              4000, 
              "Server-side Form Validation",
              true)
            this.displayProgress = false;
          }
        }
      })
    }
  }

  // Register User
  onFirstRegSubmit() {
    this.firstRegForm.markAsDirty();
    if(this.firstRegForm.controls['username'].hasError('required')){
      this._localToasterService.showBrowserToast(
        "Username is required", 
        this.toasterPosition, 
        'warning', 
        4000, 
        "Form Control",
        true);
    }
    if(this.firstRegForm.controls['email'].hasError('required')){
      this._localToasterService.showBrowserToast(
        "Email is required", 
        this.toasterPosition, 
        'warning', 
        4000, 
        "Form Control",
        true);
    }
    if(this.firstRegForm.controls['username'].hasError('pattern')){
      this._localToasterService.showBrowserToast(
        "Username must contain only uppercase, lowercase, number and whitespace characters, with length of 8-20 characters", 
        this.toasterPosition, 
        'danger', 
        7000, 
        "Form Control",
        true);
    }
    if(this.firstRegForm.controls['email'].hasError('pattern')){
      this._localToasterService.showBrowserToast(
        "Email is in invalid format, verify and submit the form", 
        this.toasterPosition, 
        'danger', 
        7000, 
        "Form Control",
        true);
    }
    if(this.firstRegForm.valid){
      this.RegistrationData.username = this.firstRegForm.value.username;
      this.RegistrationData.email = this.firstRegForm.value.email;

      this.regStepper.next(); // go to password step
    }
  }

  onSecondRegSubmit() {
    this.secondRegForm.markAsDirty();
    if(this.secondRegForm.controls['password'].hasError('required')){
      this._localToasterService.showBrowserToast(
        "Password is required", 
        this.toasterPosition, 
        'warning', 
        4000, 
        "Form Control",
        true)
    }
    if(this.secondRegForm.controls['confirmPassword'].hasError('required')){
      this._localToasterService.showBrowserToast(
        "Confirm your password again", 
        this.toasterPosition, 
        'warning', 
        4000, 
        "Form Control",
        true)
    }
    if(this.secondRegForm.controls['password'].hasError('pattern')){
      this._localToasterService.showBrowserToast(
        "Password must contain atleast one uppercase, one lowercase, one number and a special character, with a length of 8-20 characters", 
        this.toasterPosition, 
        'danger', 
        4000, 
        "Form Control",
        true)
    }
    if(this.secondRegForm.controls['confirmPassword'].hasError('pattern')){
      this._localToasterService.showBrowserToast(
        "Passwords do not match", 
        this.toasterPosition, 
        'danger', 
        4000, 
        "Form Control",
        true)
    }
    if(this.secondRegForm.valid){
      if(this.secondRegForm.value.password == this.secondRegForm.value.confirmPassword){

        this.RegistrationData.password = this.secondRegForm.value.password;
        this.RegistrationData.confirmPassword = this.secondRegForm.value.confirmPassword;
  
        this.displayProgress = true;
        // send the form data for server-side validation on form fields
        this._authService.registerFormValidation(this.RegistrationData).subscribe(response => {
          // on successful, server validation of form
          if(response.formValidation==true){
            // Send registration details to the authService to start
            // Firebase user registration
            this._authService.firebaseRegister(this.RegistrationData);
            this.regStepper.reset();

            this._authService.isRegistered$.subscribe((registerState) => {
              if(registerState==true){
                setTimeout(() => {
                  this.displayProgress = false;
                }, 5000)
              }else{
                setTimeout(() => {
                  this.displayProgress = false;
                }, 3000)
              }
            })

          }else if(response.formValidation==false){
            this._localToasterService.showBrowserToast(
              response.message, 
              this.toasterPosition, 
              'danger', 
              4000, 
              "Server-side Form Validation",
              true)
            this.displayProgress = false;
          }
        },
        error => {
          if(error instanceof HttpErrorResponse){
            if(error.status == 500){
              this._localToasterService.showBrowserToast(
                "Server encountered a fatal error, retry again!", 
                this.toasterPosition, 
                'danger', 
                4000, 
                "Server-side Form Validation",
                true)
                this.displayProgress = false;
            }else if(error.status==422){
              this._localToasterService.showBrowserToast(
                error.message, 
                this.toasterPosition, 
                'danger', 
                4000, 
                "Server-side Form Validation",
                true)
                this.displayProgress = false;
            }
          }
        })
      }else{
        this._localToasterService.showBrowserToast(
          "Passwords do not match", 
          this.toasterPosition, 
          'danger', 
          4000, 
          "Form Control",
          true)
        this.displayProgress = false;
      }
    }
  }

  // Route to login and Register, on button click
  routeToLogin() {
    this.router.navigate(['/user', 'login']);
  }

  routeToSignUp() {
    this.router.navigate(['/user', 'signup']);
  }

  // Change theme on clicking the toggle
  changeTheme(event: any) {
    this._localThemeService.changeThemeOnToggle(event)
  }

  openFPwindow() {
    this.tooltipSelector.hide();
    this.loginStepper.reset();
    this.dialogService.open(ForgotPasswordComponent).onClose.subscribe(resetEmail => {
      if(resetEmail) {
        this._authService.forgotPassword(resetEmail);
      }
    })
  }

  ngOnInit(): void {
    // Get URL params to detect landing page
    this.route.params.subscribe(params => {
      this.action = params['action'];
      if(this.action=='login'){
        this.flipped = false;
      }else if(this.action=='signup'){
        this.flipped = true;
      }
    });
  }
}
