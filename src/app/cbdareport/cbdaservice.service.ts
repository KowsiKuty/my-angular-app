import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const url = environment.apiURL
@Injectable({
  providedIn: 'root'
})

export class CbdaserviceService {

  idleState = 'Not started.';
  timedOut = false;
  constructor(private idle: Idle, private http: HttpClient,) { }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  public employeeapi_dd(id, query, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'usrserv/emp_from_dept/' + id + '?' + 'query=' + query + '&page=' + page, { 'headers': headers })
  }
  public branch_product_api() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    let data = {}
    return this.http.post<any>(url + "reportserv/get_target?", data, { headers: headers });
  }
  public branchdd() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    let data = {}
    return this.http.get<any>(url + "usrserv/fetch_cbdabranch?", { headers: headers });
  }
  public productdd() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    let data = {}
    return this.http.get<any>(url + "mstserv/fetch_cbdaproduct?", { headers: headers });
  }
  public gldd() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    let data = {}
    return this.http.get<any>(url + "usrserv/fetch_cbdaglno?", { headers: headers });
  }
  public docInwAdd(files, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    formData.append('data', JSON.stringify(data));

    // if(files != null || files != undefined ){
    formData.append("file", files);
    // }
    if (data?.file_type == 'Raw Data File') {
      return this.http.post<any>(url + 'reportserv/cbda_raw_data', formData, { 'headers': headers })
    }
    else if(data?.file_type == 'Gl TB File'){
      return this.http.post<any>(url + 'reportserv/gl_tb_data', formData, { 'headers': headers })
    }
    else{
      return this.http.post<any>(url + 'reportserv/cbda_inc_data', formData, { 'headers': headers }) 
    }
  }
  public incmaster(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(url + 'reportserv/inc_exc_data', data, { 'headers': headers })

  }
  public specialprodmaster(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(url + 'reportserv/special_prod', data, { 'headers': headers })

  }

  public cloumn_api() {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    let data = {}
    return this.http.get<any>(url + "reportserv/get_column_names", { headers: headers });
  }
  public fileType(params) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    let data = {}
    return this.http.post<any>(url + "reportserv/get_file_name", params, { headers: headers });
  }
  public CBDAFileUploadSummary(params) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    let data = {}
    return this.http.post<any>(url + "reportserv/get_file_summary", params, { headers: headers });
  }
  public CBDAINCEXCDataSummary(params) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    let data = {}
    return this.http.post<any>(url + "reportserv/get_inc_exc_sumamry", params, { headers: headers });
  }
  public CBDAINCEXCDataViewSummary(params) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "reportserv/get_inc_exc_data", params, { headers: headers });
  }
  public CBDAINCEXCDataSubmit(params) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(url + "reportserv/inc_exc_data", params, { headers: headers });
  }
}
