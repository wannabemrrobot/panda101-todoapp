import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/auth";
import { AngularFireAuth } from  "@angular/fire/auth";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //observables to detect sign-in state
  private isRegistered = new Subject<boolean>();
  isRegistered$ = this.isRegistered.asObservable();

  private isLoggedIn = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedIn.asObservable();

  // Toaster Props
  toasterPosition = 'top-right';

  _backendURL = "https://panda101-backend.herokuapp.com"
  // _backendURL = "http://localhost:3000"  // change only this when you deploy on production
  
  _loginURL = this._backendURL + "/api/login";
  _registerURL = this._backendURL + "/api/register";

  _registerFormValidationURL = this._backendURL + "/regFormValidate"
  _loginFormValidationURL = this._backendURL + "/loginFormValidate"

  _verifyLoginURL = this._backendURL + "/verifyLoggedInUser"


  constructor(
    private http: HttpClient,
    private router: Router,
    public afAuth: AngularFireAuth,
    private _localToasterService: ToasterService
  ) { }

  registerFormValidation(form: any) {
    return this.http.post<any>(this._registerFormValidationURL, form);
  }

  loginFormValidation(form: any) {
    return this.http.post<any>(this._loginFormValidationURL, form);
  }
  
  // Login with username(email) and password
  firebaseLogin(user: any) {
    // Call Firebase login method with uname and pwd as params
    firebase.auth().signInWithEmailAndPassword(user.username, user.password)
    // If the user exists, and credentials match.
    .then((userCredential) => {
      if(userCredential){
        // Check for the auth state change, to detect if a user is logged in.
        firebase.auth().onAuthStateChanged(async (user) => {
          // if user logged in,
          if(user){
            // check if email is verified,
            if(user?.emailVerified==true){
              // get token for the current logged in user
              const token = firebase.auth().currentUser?.getIdToken(true);
              // if the token exists
              if(token){
                // set login observable as true
                this.isLoggedIn.next(true);
                // set token, in the localStorage
                localStorage.setItem("@token", await token);
                // call nodeRegister to register a mongoDB document for a user
                this.nodeRegister().subscribe((response: any) => {
                  // on getting success as a response, 
                  if(response.registered==true) {
                    // navigate to the app, after 3 seconds
                    setTimeout(() => {
                      // route to the panda page
                      this.router.navigate(['/panda']);
                    }, 3000)
                  }
                })

                // TOAST - info - stay on the same page
                this._localToasterService.showBrowserToast(
                  'Stay on the same page, until you get redirected to the app',
                  this.toasterPosition,
                  'control',
                  4000,
                  'Prevent User Navigation',
                  true
                )
              }
            }else{

              const verifyLinkConfig = {
                url: 'http://localhost:4200/user/login' // need to change
              }
  
              user.sendEmailVerification(verifyLinkConfig)
                .then(() =>{
                  // Verification email sent.
                  // console.log("link sent")
                  this._localToasterService.showBrowserToast(
                    "Email not yet verified. Verification link sent. Check your email to login.", 
                    this.toasterPosition, 
                    'success', 
                    4000, 
                    "Email Verification",
                    true)
                  
                  this.isLoggedIn.next(false);
                })
                .catch((error: any) => {
                  console.log(error)
                  if(error.code=='auth/too-many-requests'){
                    this._localToasterService.showBrowserToast(
                      "Email not yet verified. Verify using previously sent link. New request for link is not processed due to too many requests.", 
                      this.toasterPosition, 
                      'danger', 
                      4000, 
                      "Email Verification",
                      true)
                  
                    this.isLoggedIn.next(false);
                  }
                });
            }
            
          }else{
            // no user signed in
          }
        })
      }
    })
    .catch((error) => {
      // If error, inspect error.code

      // if user is not found, display toast and set login observable as false
      if(error.code=='auth/user-not-found'){
        this._localToasterService.showBrowserToast(
          error.message, 
          this.toasterPosition, 
          'danger', 
          4000, 
          "User Validation",
          true)
        
        this.isLoggedIn.next(false); 
      }
      // if the password is wrong, display toast and set observable as false
      if(error.code=='auth/wrong-password'){
        this._localToasterService.showBrowserToast(
          "Invalid password", 
          this.toasterPosition, 
          'danger', 
          4000, 
          "User Validation",
          true)

        this.isLoggedIn.next(false);
      }
    })
  }

  // Logout user
  firebaseLogout() {
    firebase.auth().signOut()
    .then(() => {
      // Sign-out successful.
      this._localToasterService.showBrowserToast(
        "You've been successfully logged out.",
        this.toasterPosition,
        'success',
        2000,
        'Session Management',
        true
      )
      
      setTimeout(() => {
        this.router.navigate(['/user/login']);
      }, 2000)

      localStorage.removeItem('@token')
      return true;

    }).catch((error) => {
      this._localToasterService.showBrowserToast(
        "Error logging out user!",
        this.toasterPosition,
        'danger',
        2000,
        'Session Management',
        true
      )
      
      setTimeout(() => {
        this.router.navigate(['/user/login']);
      }, 2000)

      localStorage.removeItem('@token')
      return false;
    });
  }

  firebaseRegister(user: any) {
    // trigger firebase user registration
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    // if user is created, 
    .then((userCredential) => {
      // created new user in the firebase 
      if(userCredential){
        // detect if the user is signed in firebase
        firebase.auth().onAuthStateChanged((firebaseUser) => {
          // if the user is signed in,
          if(firebaseUser){
            // update profile/display name
            firebaseUser.updateProfile({
              displayName: user.username
            }).then(()=> {})
              .catch(()=> {})
              
            // Send email verification link
            // link to route the user, after verifying the link
            const verifyLinkConfig = {
              url: 'http://panda101todo.web.app/user/login'
            }

            // after firebase user is created, send verification link to email
            firebaseUser.sendEmailVerification(verifyLinkConfig)
              // if the email is successfully sent,
              .then(() =>{
                // set the observable(to detect registration status) as true
                this.isRegistered.next(true);
                // TOAST - (success) - verification email sent
                this._localToasterService.showBrowserToast(
                  "Verification link sent. Check your email to login.", 
                  this.toasterPosition, 
                  'success', 
                  4000, 
                  "Email Verification",
                  true)
              })
              .catch((error) => {
                // if the email is not sent, (Inspect error.code).
                // console.log(error);

                // set the observable(to detect registration status) as false
                this.isRegistered.next(false);
                // TOAST - (failure) - verification email not sent
                this._localToasterService.showBrowserToast(
                  "Problem sending verification link. Try after sometime", 
                  this.toasterPosition, 
                  'danger', 
                  4000, 
                  "Email Verification",
                  true)
              });
          } else {
            // No user is signed in.
          }
        });
      }
    })
    // user is not created, error!
    .catch((error) => {
      if(error.code=='auth/email-already-in-use'){
        this._localToasterService.showBrowserToast(
          error.message, 
          this.toasterPosition, 
          'danger', 
          4000, 
          "Email Validation",
          true)
        
        // set the observable(to detect registration status) as false
        this.isRegistered.next(false);
      }else{
        this._localToasterService.showBrowserToast(
          error.message, 
          this.toasterPosition, 
          'danger', 
          4000, 
          "Email Validation",
          true)

        // set the observable(to detect registration status) as false
        this.isRegistered.next(false);
      }
    });
  }

  nodeRegister() {
    return this.http.post(this._registerURL, {});
  }

  nodeVerifyUser(token: any) {
    return this.http.post<any>(this._verifyLoginURL, token);
  }

  forgotPassword(email: string) {
    const resetEmail = email;

    firebase.auth().sendPasswordResetEmail(resetEmail)
    .then(() => {
      this._localToasterService.showBrowserToast(
        "Password reset link sent to your email",
        this.toasterPosition,
        "success",
        7000,
        "Reset Password",
        true
      )
    })
    .catch((error) => {
      if(error.code=="auth/user-not-found") {
        this._localToasterService.showBrowserToast(
          "There is no user corresponding to this email. The email is invalid or the user may have been deleted",
          this.toasterPosition,
          "danger",
          7000,
          "Reset Password",
          true
        )
      }else{
        this._localToasterService.showBrowserToast(
          "Error occurred while sending password reset link. Try after sometime.",
          this.toasterPosition,
          "danger",
          7000,
          "Reset Password",
          true
        )
      }
    });
  }
}
