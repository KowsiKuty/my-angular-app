import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

const productmaster_Url = environment.apiURL
// const productmaster_Url = 'http://139.59.32.22:8193/'
@Injectable({
  providedIn: 'root'
})
export class ProductMasterService {
  constructor(private http: HttpClient, private idle: Idle) { }
  idleState = 'Not started.';
  timedOut = false;
  public TypeOfCreateAgent;
  
  public agentid=''
  
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }


  public getAgentgroupSumary(data, page): Observable<any> {
    this.reset();
    console.log("service data",data)
    console.log("service page",page)
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + 'prodserv/agent_group?action=summary&name=' + data + '&page=' + page, { 'headers': headers })
  }




  public getAgentgroupRuleSumary(data, page): Observable<any> {
    this.reset();
    console.log("service data",data)
    console.log("service page",page)
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + 'prodserv/agent_grouprule/' + data.id + '?page=' + page, { 'headers': headers })
  }

    public ProductDropdown(data ): Observable<any> {
    console.log("product data",data)
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + 'prodserv/product?action=summary&name=' + data , { 'headers': headers })
  }

  public getRuleTypeDropdown(): Observable<any> {
    this.reset();
    // console.log("type value",data) 
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + 'prodserv/rule_type', { 'headers': headers })
  }

  public getSourceSearchSumary(data, page): Observable<any> {
    this.reset();
    console.log(data)
    console.log(page)
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    console.log(token)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + 'prodserv/source?name=' + data + '&page=' + page, { 'headers': headers })
  }


  public AgentGroupform(data): Observable<any> {
    this.reset();
    console.log(data)
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = {'Authorization': 'Token ' + token }
    return this.http.post<any>(productmaster_Url + 'prodserv/agent_group', data, { 'headers': headers })
  }

  public AgentRuleform(agentid,data): Observable<any> {
    this.reset();
    console.log(agentid)
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = {'Authorization': 'Token ' + token }
    return this.http.post<any>(productmaster_Url + 'prodserv/agent_grouprule/'+agentid, data, { 'headers': headers })
  }

  public Sourceform(data): Observable<any> {
    this.reset();
    console.log(data)      
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = {'Authorization': 'Token ' + token }
    return this.http.post<any>(productmaster_Url + 'prodserv/source', data, { 'headers': headers })
  }


  public employeesearch(data: any, page, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + 'usrserv/searchemployee?query=' + data + '&page=' + page + '&type=' + type, { 'headers': headers })
  }


  public AgentGroupempmapping(data, action): Observable<any> {
    this.reset();
    console.log("type value",data)
    console.log(" action of the service",action)
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(productmaster_Url + 'prodserv/agent_group_employee_map?action='+action, data, { 'headers': headers })
  }

  public AgentEmployeeMappingSummary(agentid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + 'prodserv/agent_group_employee_map?action=summary&agent='+ agentid?.id, { 'headers': headers })
  }

  public AgentGroupempmappingSubmit(action,data): Observable<any> {
    this.reset();
    console.log("type value",data)
    console.log(" action of the service",action)
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(productmaster_Url + 'prodserv/agent_group_employee_map?action='+action, data, { 'headers': headers })
  }


  public vendorsearch(data: any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + 'venserv/search?name=' + data + '&page=' + page, { 'headers': headers })
  }
  
  public AgentvendorMappingSummary(agentid,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + 'prodserv/agent_vendor_mapping?action=summary&agent='+ agentid + '&page=' + page, { 'headers': headers })
  }

  // public AgentGroupvenmappingSubmit(action,data): Observable<any> {
  //   this.reset();
  //   console.log("type value",data)
  //   console.log(" action of the service",action)
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(productmaster_Url + 'prodserv/agent_vendor_mapping?action='+action, data, { 'headers': headers })
  // }


  public AgentGroupvenmappingSubmit(action, data): Observable<any> {
    this.reset();
    console.log("type value",data)
    console.log(" action of the service",action)
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(productmaster_Url + 'prodserv/agent_vendor_mapping?action='+action, data, { 'headers': headers })
  }

public getrule(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(productmaster_Url + "prodserv/rule_type", { 'headers': headers })
}

  public getdynamicrulevalues(id,value): Observable<any> {
    this.reset();
    console.log("service",id)
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + "venserv/get_value_type_value?rule_type="+ id + "&query=" + value, { 'headers': headers })
  }

  public getProductAgainstVendor(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(productmaster_Url + "venserv/vendor_group_summary?vendor_id="+id, { 'headers': headers })
  }
 }

