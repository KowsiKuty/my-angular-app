import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/service/notification.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';


const vowurl = environment.apiURL


@Injectable({
  providedIn: 'root'
})
export class VowService {
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  constructor(private http: HttpClient, private idle: Idle) { }


  // get executive api
  public getExecutive(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.auth
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowurl + 'usrserv/portal_employee', { 'headers': headers })
  }
}
