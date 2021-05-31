import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: any, next: any) {

    let tokenizedReq = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('@token')
      }
    })
    return next.handle(tokenizedReq);
  }
}
