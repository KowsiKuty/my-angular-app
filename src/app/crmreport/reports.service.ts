import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Idle } from 'ng2-idle';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';


const url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  idleState = 'Not started.';
  timedOut = false;

  Headers(){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return headers
  }

  reset() {
    // this.idle.watch();
    // this.idleState = 'Started.';
    // this.timedOut = false;
  }

  constructor( private http: HttpClient) { }

  public getreportsummary(page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };//
    return this.http.get<any>(url + 'crmrepserv/create_reportgroup?page='+page, { 'headers': headers })
  }

  public getreportmapsummary(page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };//
    return this.http.get<any>(url + 'crmrepserv/create_reportcategory?page='+page, { 'headers': headers })
  }

  public getreport(product,lead,date,leadstatus,converteddate,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(url + 'crmrepserv/product_search?product='+product+'&lead='+lead+'&created_date='+date+'&lead_status='+leadstatus+'&converted_date='+converteddate+'&page='+page, { 'headers': headers })
  }

  public getmoduledropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'usrserv/usermodule', { 'headers': headers})
  }
  

  public getsubmoduledropdown(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'crmrepserv/modulebased_report?module_id='+id, { 'headers': headers})
  }
  

  public getreportsearchfilters(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'crmrepserv/report_filter?reportgroup_id='+id, { 'headers': headers})
  }

  public getlead(name,code,page): Observable<any>  {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);  
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'crmrepserv/leadreport_search?first_name='+name+'&code='+code+'&page='+page, { 'headers': headers})
  }

  public getleadreportexceldownload(): Observable<any>{
    this.reset();
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(url + 'crmrepserv/crmleadreport_view',{ headers, responseType: 'blob' as 'json' })
  }

  public getleadandreport(): Observable<any>{
    this.reset();
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(url + 'crmrepserv/crmproductreport_view',{ headers, responseType: 'blob' as 'json' })
  }

  
  public getproductsummary(name,code,page): Observable<any> {
    this.reset(); 
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };//
    return this.http.get<any>(url + 'crmrepserv/crmproduct_search?name='+name+'&code='+code+'&page='+page, { 'headers': headers })
  }

  public getproductexcel(): Observable<any>{
    this.reset();
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(url + 'crmrepserv/crmproduct_view',{ headers, responseType: 'blob' as 'json' })
  }

  public getsourcesummary(name,page): Observable<any> {
    this.reset(); 
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };//
    return this.http.get<any>(url + 'crmrepserv/crmsourcereport_search?name='+name+'&page='+page, { 'headers': headers })
  }

  public getsourceexceldownload(): Observable<any>{
    this.reset();
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(url + 'crmrepserv/sourcereport_view',{ headers, responseType: 'blob' as 'json' })
  }

  
 
  public getchartreport(vendorid,campaign): Observable<any> {
    this.reset(); 
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };//
    return this.http.get<any>(url + 'crmrepserv/campaign_report?campaign='+campaign+'&vendor_id='+vendorid, { 'headers': headers })
  }

  

  public getcampaigndrod(value): Observable<any> {
    this.reset(); 
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };//
    return this.http.get<any>(url + 'prodserv/campaign?name='+value, { 'headers': headers })
  }

  public getvensearch(query:any, page:any): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'venserv/search?name=' + query + '&page='+page, { 'headers': headers })
  }

  public getleadsreport(campaign:any, flag:any): Observable<any> {
    // let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'crmrepserv/campaign_report?campaign='+campaign+'&is_flag=' + flag , { 'headers': headers })
  }

  public getvendorleadsreport(vendorid:any,camapaign:any): Observable<any> {
    // let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'crmrepserv/vendor_level_user?vendor='+vendorid+'&campaign='+camapaign , { 'headers': headers })

    

  }
  public getemployeeleads(campaign:any,vendorid:any,employee): Observable<any> {
    // return this.http.get<any>(url + "prodserv/unassigned_lead?vendor_id=" + vendorid + "&page=" + page, { 'headers': this.Headers() })
    return this.http.get<any>(url + "crmrepserv/campaign_based_emp_leads?vendor=" + vendorid + "&campaign=" + campaign +"&employee_id="+employee+ "&page=" + 1, { 'headers': this.Headers() })
  }

  public getvendorleadsdata(): Observable<any> {
    return this.http.get<any>(url + "crmrepserv/vendor_level_leads?admin=true" , { 'headers': this.Headers() })

  }

  public getvendorcampaigndata(vendor_id): Observable<any> {
    return this.http.get<any>(url + "crmrepserv/vendor_level_leads?admin=false&vendor="+vendor_id , { 'headers': this.Headers() })

  }

  public getcampaignexceldownload(camapaign): Observable<any> {
    return this.http.get<any>(url + "crmrepserv/campaignlevel_exceldownloade?campaign="+camapaign , { 'headers': this.Headers(),responseType: 'blob' as 'json' })

  }

}


