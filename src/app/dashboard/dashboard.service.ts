import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Idle } from '@ng-idle/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const ecfmodelurl = environment.apiURL

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  constructor(private http: HttpClient, private idle: Idle) { }
  GetDashboardURL(data:any):Observable<any>{
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "dashboard/dashboard" , data, { 'headers': headers })
  }
  GetDashboard_summary(page:any):Observable<any>{
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "dashboard/dashboard?page=" + page, { 'headers': headers })
  }
}
