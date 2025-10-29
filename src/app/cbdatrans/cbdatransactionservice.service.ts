import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class CbdatransactionserviceService {

  idleState = 'Not started.';
  timedOut = false;

  constructor(private idle: Idle, private http: HttpClient) { }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  public GenerateColumn1(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'reportserv/fetchcolumn1_data', {}, { 'headers': headers })
  }
}
