import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/service/notification.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

// const produrl = environment.apiURLS
const produrl = environment.apiURL


@Injectable({
  providedIn: 'root'
})
export class LeadsmainService {

  constructor(private http: HttpClient, private idle: Idle) { }

  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public leadmasterdata(page,params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/lead_entry?page=" + page+params, { 'headers': headers })
    // return this.http.get<any>(produrl + "prodserv/lead_info/1", { 'headers': headers })
   

  }

  public uploadfileheaders(file): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    if (file == undefined) {
      file = ''
      console.log("Error in file")
    }
    let formData = new FormData();

    formData.append('file', file)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(produrl + "prodserv/file_header",  formData, { 'headers': headers })
   

  }

  public fileuploads(creatlist,file): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    if (file == undefined) {
      file = ''
      console.log("Error in file")
    }
   
    let json = Object.assign({}, creatlist)
    let formData = new FormData();
    formData.append('data', JSON.stringify(json));
    formData.append('file', file)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(produrl + "prodserv/lead_entry",  formData, { 'headers': headers })
   

  }

  public tableheaderdata(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/table_header", { 'headers': headers })
   

  }

  
  public getsources(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/source", { 'headers': headers })
  }

  public getleadsview(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/lead_info/"+id, { 'headers': headers })
  }

  public createnewtemplate(creatlist): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

   
   
    // let json = Object.assign({}, creatlist)
    // let formData = new FormData();
    // formData.append('data', JSON.stringify(json));
    // formData.append('file', file)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(produrl + "prodserv/header_template",  creatlist, { 'headers': headers })
   

  }

  public gettemplates(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/header_template", { 'headers': headers })
  }

  //lead_update_records

  public getupdaterecords(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/lead_update_records/"+id, { 'headers': headers })
  }
  public gettemplatesummary(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/header_template?page="+page, { 'headers': headers })
  }

  public deletetemplates(id): Observable<any>
  {
    this.reset();
    let comments = '';
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(comments)
    const headers = { 'Authorization': 'Token ' + token }
    const options = {
      headers: headers,
      body: { 'comment': comments },
    };

    return this.http.delete<any>(produrl + "prodserv/header_template?id=" + id, { 'headers': headers })
  }
  public dropdownvalues(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/crm_dropdown?dropdown_type=label_type", { 'headers': headers })
   

  }
  public dropdownRefValues(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/crm_dropdown?dropdown_type=label_refmodule", { 'headers': headers })
   

  }
  public addNewLabel(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("docpost", json)
    return this.http.post<any>(produrl + "prodserv/lable", json, { 'headers': headers })
  }
  public sysdefvalues(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/custom_field_mapping", { 'headers': headers })
   

  }
  public adddsachart(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("docpost", json)
    return this.http.post<any>(produrl + "prodserv/crm_report", json, { 'headers': headers })
  }

  public dropdownLabel(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/lable", { 'headers': headers })
   

  }

  public columndata(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(produrl + "prodserv/custom_field_mapping", { 'headers': headers })
   

  }

  public leadmasterlabel(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let json = {}
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(produrl + "prodserv/cust_fld", json, { 'headers': headers })
    // return this.http.get<any>(produrl + "prodserv/cust_fld", { 'headers': headers })
    // return this.http.get<any>(produrl + "prodserv/lead_info/1", { 'headers': headers })
   

  }
  public getFilterCount(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // let json = {}
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(produrl + "prodserv/campaign?action=count&api_action=new", json, { 'headers': headers })

   

  }
  public startCampaign(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // let json = {}
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(produrl + "prodserv/campaign?action=campaign&api_action=new", json, { 'headers': headers })

   

  }
}
