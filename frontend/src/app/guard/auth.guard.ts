import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import firebase from 'firebase/app';
import "firebase/auth";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private __router: Router,
    private __authService: AuthService,
  ) {
  }
  
  canActivate(): Observable<boolean> { 
    let authToken = localStorage.getItem('@token');

    return this.__authService.nodeVerifyUser(authToken).pipe(
      map((result) => {
        if(result.login==true){
          return true;
        }else{
          this.__router.navigate(['/user/login']);
          return false;
        }
      }))
      
  }

}


