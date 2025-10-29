import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from './service/data.service';
import { SharedService } from './service/shared.service';
import { NgxSpinnerService } from "ngx-spinner";


@Injectable({
  providedIn: 'root'
})
export class JwtUnAuthorizedInterceptorServiceService implements HttpInterceptor {

  constructor(private router: Router, public sharedService: SharedService, private SpinnerService: NgxSpinnerService,) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log(request)
    return next.handle(request).pipe(tap(

      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //do something with response
        }
      },

      (error: any) => {
        if (error instanceof HttpErrorResponse) {
          // console.log('errorssss:----------------->', error);
          if (error.status == 401 || error.status == 403 || error.status == 400) {
            // console.log('error:', error);
            let errorValue = error.error;
            // console.log('error1:', errorValue.error);
            if (errorValue.error) { alert(errorValue.error); }
            if (errorValue.detail) {
              alert(errorValue.detail);
              if (errorValue.detail === 'Invalid token.') {
                localStorage.removeItem("sessionData");
              }
            }
            this.sharedService.isLoggedin = false;
            this.sharedService.Loginname = '';
            // console.log("unauthorized calling");
            this.SpinnerService.hide();
            this.router.navigateByUrl('/login');
          }
          else if (error.status == 0) {
            alert("Unable to connect server")
            this.SpinnerService.hide();
          }

          else if (error.status === 404) {
            alert("Page not found")
            this.SpinnerService.hide();
          }
          else if (error.status === 405) {
            alert("405 - API Failed, Method not allowed")
            this.SpinnerService.hide();
          }
          else if (error.status === 408) {
            alert("408 - Request Timeout, Request taking too much time")
            this.SpinnerService.hide();
          }
          // else if(error.status === 411){
          //   this.handle411Error(error)
          // }
          else if (error.status === 413) {
            alert("413 - 413 Payload Too Large Request entity is larger than limits defined by server. The server might close the connection(The request is larger than the server able to handle)")
            this.SpinnerService.hide();
          }
          else if (error.status === 415) {
            alert("415 - Unsupported media type")
            this.SpinnerService.hide();
          }
          else if (error.status === 429) {
            alert("429 - Too Many Requests, Server Busy")
            this.SpinnerService.hide();
          }
          else if (error.status === 500) {
            alert("500 - Internal server error, Sending request failed")
            this.SpinnerService.hide();
          }
          else if (error.status === 502) {
            alert("502 - Got an invalid response")
            this.SpinnerService.hide();
          }
          // Gateway Timeout Error means your web server didn't receive a timely response from another server
          else if (error.status === 504) {
            alert("504 - 'Server timeout'")
            this.SpinnerService.hide();
          }
          else {
            alert(error.status + '.Message:' + error.statusText)
            console.log('jwterror', error.status + '.Message:' + error.statusText)
            this.SpinnerService.hide();
          }
        }
      }

    ));

    // throw new Error("Method not implemented.");
  }
}