import { P } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VowService } from '../service/vow.service';
import { catchError, map } from 'rxjs/operators';
import { Idle } from '@ng-idle/core';



const vowUrl = environment.apiURL



@Injectable({
  providedIn: 'root'
})
export class LeadserviceService {
  idleState = 'Not started.';
  timedOut = false;

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  unsubscibe() {
    // throw new Error('Method not implemented.');
  }

  taskObject: any = null;
  leadId: number = null;
  subscriptions: Subscription[] = [];

  leadWithTasks: [] = [];

  leadsummaryid: number = null

  leadtaskobj: any = null

  nextleadboolean:boolean=false

  public Headers() {
    return { 'Authorization': 'Token ' + JSON.parse(localStorage.getItem("sessionData")).token }
  }


  constructor(private http: HttpClient, private vowservice: VowService,private idle: Idle) { }

  public getagentlead(vendorid, value, employee, page): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }

    // return this.http.get<any>(vowUrl + "prodserv/agentlead_info?is_admin=" + value+"&page="+page, { 'headers': this.Headers() })

    // let role = value == 1 ? true : false

    if (value == 2) {
      return this.http.get<any>(vowUrl + "prodserv/unassigned_lead?vendor_id=" + vendorid + "&page=" + page, { 'headers': this.Headers() })
    }
    else {
      return this.http.get<any>(vowUrl + "prodserv/leadagentvendor_info?vendor_id=" + vendorid + "&is_admin=" + value +"&employee_id="+employee+ "&page=" + page, { 'headers': this.Headers() })
      
      // return this.http.get<any>(vowUrl + "prodserv/leadagentvendor_info?vendor_id=" + vendorid + "&is_admin=" + role + "&page=" + page, { 'headers': this.Headers() })
    }

  }

  public getunassignedagentlead(vendorid, value, page): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }

    // return this.http.get<any>(vowUrl + "prodserv/agentlead_info?is_admin=" + value+"&page="+page, { 'headers': this.Headers() })

    return this.http.get<any>(vowUrl + "prodserv/unassigned_lead?vendor_id=" + vendorid + "&is_admin=" + value + "&page=" + page, { 'headers': this.Headers() })
  }

  public leadmasterdata(page): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "prodserv/lead_entry?page=" + page, { 'headers': this.Headers() })
    // return this.http.get<any>(produrl + "prodserv/lead_info/1", { 'headers': this.Headers() })
  }

  public getleadsview(id): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "prodserv/lead_info/" + id, { 'headers': this.Headers() })
  }

  getEmployeeTask(data) {
    this.vowservice.loader=true
    let url = 'prodserv/leadtask';
    return this.postCall(url, data)
  }

  createActivity(data) {
    let url = 'prodserv/employee_task';
    return this.postCall(url, data);
  }

  getNotes(params) {
    // this.spinner.show();
    let url = 'prodserv/agenttask_note?' + params;
    return this.getCall(url);
  }

  leadTaskUpdate(params, data) {

    let url = 'prodserv/lead_to_customer?' + params;
    return this.postCall(url, data);
  }

  createNote(data) {
    let url = 'prodserv/agenttask_note';
    return this.postCall(url, data);
  }

  getCall(url) {
    // let localstorage = JSON.parse(localStorage.getItem("crmuserdata"));
    // let token = localstorage.token
    // console.log('token', token)
    // // return this.http.get<any>(`${vowUrl}${url}`, token)
    // const headers = { 'Authorization': 'Token ' + token }
    this.vowservice.loader = true;
    return this.http.get<any>(vowUrl + url, { 'headers': this.Headers() }).pipe(
      map((response: any) => {
        this.vowservice.loader = false
        return response
      }), catchError((err) => {
        this.vowservice.loader = false
        return err
      })
    )
  }

  postCall(url, body) {
    // let localstorage = JSON.parse(localStorage.getItem("crmuserdata"));
    // let token = localstorage.token
    // console.log('token', token)

    // return this.http.post<any>(`${vowUrl}${url}`, body, token)

    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(vowUrl + url, body, { 'headers': this.Headers() }).pipe(
      map((response: any) => {
        this.vowservice.loader = false
        return response
      }), catchError((err) => {
        this.vowservice.loader = false
        return err
      })
    )
  }

  taskStatusUpdate(params, data) {
    let url = 'prodserv/leadtask_action?' + params;
    return this.postCall(url, data);
  }

  getMappedList(params) {
    // this.spinner.show()
    let url = 'prodserv/lead_mapping_summary?' + params;
    return this.getCall(url)
  }

  getProductList(params) {
    // this.spinner.show()
    let url = 'prodserv/product?' + params;
    return this.getCall(url)
  }

  getTasklist(params) {
    // this.spinner.show()
    let url = 'prodserv/tasksummary?' + params;
    return this.getCall(url)
  }

  mapLeadProduct(data) {
    // this.spinner.show()
    let url = 'prodserv/lead_mapping'
    return this.postCall(url, data);
  }

  public get_EmployeeList(empkeyvalue): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'usrserv/searchemployee?query=' + empkeyvalue, { 'headers': this.Headers() })
  }

  public leadagentmapping(json): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(vowUrl + "prodserv/create_leadagentmapping", json, { 'headers': this.Headers() })
  }


  public groupbasedemployeeget(id, empkeyvalue): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'venserv/group_employee_get?group_id=' + id, { 'headers': this.Headers() })
  }

  public getvendorgroupdropdownsearch(id): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("crmuserdata");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "venserv/vendor_basedgroup?vendor_id=" + id, { 'headers': this.Headers() })
  }

  public getportaluseremployee(vendorid, empkeyvalue): Observable<any> {
    // this.reset();
    // const getToken = localStorage.getItem("sessionData");
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + 'venserv/vendor_portal_emp_get?vendor_id=' + vendorid + '&name=' + empkeyvalue, { 'headers': this.Headers() })
  }

 

  public getvendoremployeeleadsdata(vendorid,employeeid): Observable<any> {
   if(employeeid ==''){
    return this.http.get<any>(vowUrl + 'prodserv/vendor_based_emp_campaign_info?vendor=' + vendorid , { 'headers': this.Headers() })

   }
   else{
    return this.http.get<any>(vowUrl + 'prodserv/vendor_based_emp_campaign_info?vendor=' + vendorid+'&employee='+employeeid , { 'headers': this.Headers() })

   }
  }

  public getemployeeleadsdata(leadsstatus,employeeid): Observable<any> {
   
    
    return this.http.get<any>(vowUrl + 'crmrepserv/lead_status_info?lead_status='+leadsstatus+'&employee=' + employeeid , { 'headers': this.Headers() })

    // return this.http.get<any>(vowUrl + 'prodserv/employee_level_leads?employee_id=' + employeeid , { 'headers': this.Headers() })
  }

  public getemployeelimits(vendorid,employeeid): Observable<any> {
    return this.http.get<any>(vowUrl + 'venserv/employee_level_limit?vendor='+vendorid+'&employee='+employeeid , { 'headers': this.Headers() })
  }

  public getvendorcampaigndata(vendor_id): Observable<any> {
    return this.http.get<any>(vowUrl + "crmrepserv/vendor_level_leads?admin=false&vendor="+vendor_id , { 'headers': this.Headers() })

  }
  public getvendorleadsreport(vendorid:any,camapaign:any): Observable<any> {
   
    return this.http.get<any>(vowUrl + 'crmrepserv/vendor_level_user?vendor='+vendorid+'&campaign='+camapaign , { 'headers': this.Headers() })
  }

  public getemployeeleads(campaign:any,vendorid:any,employee): Observable<any> {
    // return this.http.get<any>(url + "prodserv/unassigned_lead?vendor_id=" + vendorid + "&page=" + page, { 'headers': this.Headers() })
    return this.http.get<any>(vowUrl + "crmrepserv/campaign_based_emp_leads?vendor=" + vendorid + "&campaign=" + campaign +"&employee_id="+employee+ "&page=" + 1, { 'headers': this.Headers() })
  }


  // get vendor
  public getVendor(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vowUrl + "usrserv/get_vendor_by_user", { 'headers': this.Headers() })
  }
}
