import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators'
// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router'

const url = environment

const vowUrl = environment.apiURL


@Injectable({
  providedIn: 'root'
})
export class VowService {
  
  
  constructor( private http: HttpClient, private router: Router) { }
  
  // public Headers = { 'Authorization': 'Token ' + environment.apiToken }

  isAuthenticated:boolean =  false
  process: boolean = false
  loader:boolean=false

  //  Login Data
  // public login(user): Observable<any> {
  //   return this.http.post(memoUrl, user)
  // }

  public show(){
    this.loader=true
  }

  public hide(){
    this.loader=false
  }

  public login(user) {
    if(user){
      this.process = true

      setTimeout(()=>{                           
        this.router.navigateByUrl('welcome')
        this.isAuthenticated = true
   }, 3000);
      return true
    }
    this.isAuthenticated = false 
    this.process = true
    return false
  }


  public logout(){
    this.isAuthenticated = false
    this.process = false
    localStorage.clear()
    return true

  }
  public user_bio(bio: any): Observable<any> {
    // const getToken = localStorage.getItem("sessionData")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    let data = JSON.stringify(bio)
    console.log("biojson", data)
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(vowUrl + 'usrserv/portal_user', data)
  }

  public createLogin(bio: any): Observable<any> {
    // const getToken = localStorage.getItem("sessionData")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
  
    let data = JSON.stringify(bio)
    console.log("biojson", data)
    this.process = true
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(vowUrl + 'usrserv/portal_token', data)
  }

  public signIn(bio: any): Observable<any> {
    // const getToken = localStorage.getItem("sessionData")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    let data = JSON.stringify(bio)
    // console.log("biojson", data)
    this.process = true
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(vowUrl + 'usrserv/register_user', data)
  }

  public getMenuUrl(portal_id): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(bio)
    // console.log("biojson", data)
    // this.process = true
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'usrserv/portal_permissions/' + portal_id, {'headers': headers})
  }

  public crmlogin(): Observable<any> {
    // this.reset();
    const headers = { 'content-type': 'application/json' }
    const userdata = {
      'username': 'emp001',
      'password': '1234',
      'entity_id': 1
    }
    // const userdata = {
    //   'username': user.username,
    //   'password': btoa(user.password),
    //   'entity_id': clientname
    // }
    const body = JSON.stringify(userdata);
    return this.http.post( environment.apiURL
      + 'usrserv/auth_token' + '', body, { 'headers': headers })
  }
  
  // get executive api
  public getExecutive(): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'usrserv/portal_employee' ,{ 'headers': headers })
  }

   // get campaign api
   public getCampaign(vendor_id): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'prodserv/dsa_campaign_dd/' + vendor_id, { 'headers': headers })
  }
  
  // dashboard search
  public getDashbordSearch(displayJson,vendor_id): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let Json = Object.assign({}, displayJson)
    return this.http.post<any>(vowUrl + 'prodserv/dsa_dashboard/' + vendor_id,Json, { 'headers': headers })
  }
}