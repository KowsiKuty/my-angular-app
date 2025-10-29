import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

const tqUrl = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class TqService {
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  idleState = 'Not started.';
  timedOut = false;
  constructor(private http: HttpClient, private idle: Idle, ) { }

  public tqQuery(queryJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(tqUrl + "usrserv/query_get",queryJson, { 'headers': headers })
  }
}
