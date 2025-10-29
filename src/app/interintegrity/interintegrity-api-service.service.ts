import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, throwError } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { NotificationService } from "../service/notification.service";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { data, param } from "jquery";
import { query } from "@angular/animations";
import { ValueTransformer } from "@angular/compiler/src/util";

const interurl = environment.apiURL;

@Injectable({
  providedIn: "root",
})
export class InterintegrityApiServiceService {
  //integrityserv

  constructor(private http: HttpClient, private idle: Idle) {}

  idleState = "Not started.";
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = "Started.";
    this.timedOut = false;
  }

  public getTemplateData(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(interurl + "integrityserv/gl_template", {
      headers: headers,
    });
  }

  public getnewtemplateSummary(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(interurl + "integrityserv/wisefine_template?page=1" + page , { 'headers': headers })

  }

  public getaccountdata(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/account_master?page=" + page,
      { headers: headers }
    );
  }

  // public getActionData(): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(interurl + "integrityserv/action_master", { 'headers': headers })

  
  // }
  public accountS(CreateList: any): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    let data = [CreateList];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(
      interurl + "integrityserv/account_master",
      data,
      { headers: headers }
    );
  }

  public getNtemplates(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/gl_template?page=" + page,
      { headers: headers }
    );
  }

  public deleteNtemplates(id): Observable<any> {
    this.reset();
    let comments = "";
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(comments)
    const headers = { Authorization: "Token " + token };
    const options = {
      headers: headers,
      body: { comment: comments },
    };

    return this.http.delete<any>(
      interurl + "integrityserv/gl_template?id=" + id,
      { headers: headers }
    );
  }

  public deleteNtemplate(id, status): Observable<any> {
    this.reset();
    let comments = "";
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(comments)
    const headers = { Authorization: "Token " + token };
    const options = {
      headers: headers,
      body: { comment: comments },
    };

    return this.http.delete<any>(
      interurl + "integrityserv/template?id=" + id + "&status=" + status,
      { headers: headers }
    );
  }

  public getNsingletemplate(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(interurl + "integrityserv/gl_template?id=" + id, {
      headers: headers,
    });
  }

  public templateSedit( payload,id): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    console.log(id);
    // console.log(CreateList1);
    let list = [];
    let json = Object.assign({},id);
    console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    let data = json;
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(interurl + "integrityserv/template?temp_name="+id, payload, {
      headers: headers,
    });
  }
  public templateSeditss(id): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    // console.log(payload);
    // console.log(CreateList1);
    let list = [];
    // let json = Object.assign({}, payload);
    // console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    // let data = json;
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.get<any>(interurl + "integrityserv/get_template?temp_name="+ id , {
      headers: headers,
    });
  }

  public gettemplates(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/statement_template?page=" + page,
      { headers: headers }
    );
  }

  public defineTemplates(payload): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    console.log(payload);
    console.log(payload);
    let list = [];
    let json = Object.assign({}, payload);
    console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    let data = json;
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(interurl + "integrityserv/template", data, {
      headers: headers,
    });
  }
  public deletetemplates(id): Observable<any> {
    this.reset();
    let comments = "";
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(comments)
    const headers = { Authorization: "Token " + token };
    const options = {
      headers: headers,
      body: { comment: comments },
    };

    return this.http.delete<any>(
      interurl + "integrityserv/statement_template?id=" + id,
      { headers: headers }
    );
  }

  public Btemplatedate(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/statement_template?id=" + id,
      { headers: headers }
    );
  }

  public templateSStmtedit(CreateList: any): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    console.log(CreateList);
    // console.log(CreateList1);
    let list = [];
    let json = Object.assign({}, CreateList);
    console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    let data = [json];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(
      interurl + "integrityserv/statement_template",
      data,
      { headers: headers }
    );
  }
  public templateSStmtedits(CreateList,id): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    console.log(CreateList);
    // console.log(CreateList1);
    let list = [];
    let json = Object.assign({}, CreateList);
    console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    let data = json;
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.get<any>(
      interurl + "integrityserv/get_cbs?id="+ id +CreateList ,
      { headers: headers }
    );
  }

  public defineTemplatesBank(
    CreateList: any,
    CreateList1: any
  ): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    console.log(CreateList);
    console.log(CreateList1);
    let list = [];
    let json = Object.assign({}, CreateList, CreateList1);
    console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    let data = json;
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(
      interurl + "integrityserv/cbs_template",
      data,
      { headers: headers }
    );
  }

  public getLedgerdata(date, id, page, branch,uploadtype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl +
        "integrityserv/ledger?gl_date=" +
        date +
        "&branch_code=" + branch +
        "&upload_type="+ uploadtype ,
      { headers: headers }
    );
  }

  public glUpload(CreateList, files) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = "";
      console.log("Error in files");
    }
    let CreateList1 = CreateList;
    delete CreateList1.account_id;
    delete CreateList1.filedata;
    // delete CreateList1.template_id

    let json = Object.assign({}, CreateList1);
    let formData = new FormData();
    formData.append("data", JSON.stringify(json));
    formData.append("file", files);
    const headers = { Authorization: "Token " + token };
    console.log(formData);
    return this.http.post<any>(interurl + "integrityserv/ledger", formData, {
      headers: headers,
    });
  }

  public bankstatementUplaod(CreateList, files) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = "";
      console.log("Error in files");
    }
    let CreateList1 = CreateList;
    delete CreateList1.account_id;
    delete CreateList1.filedatas;

    let json = Object.assign({}, CreateList1);
    let formData = new FormData();
    formData.append("data", JSON.stringify(json));
    formData.append("file", files);
    const headers = { Authorization: "Token " + token };
    console.log(formData);
    return this.http.post<any>(interurl + "integrityserv/statement", formData, {
      headers: headers,
    });
  }

  public getStatementdata(date, id, page, branch,uploadtype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl +
        "integrityserv/statement?bs_date=" +
        date +
        "&template_id=" +
        id +
        "&page=" +
        page +
        "&branch_code=" + branch +
        "&upload_type=" + uploadtype,
      { headers: headers }
    );
  }

  
  public autoknockoff(date, overwrite, branch,  uploadtype,filterVal): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;

    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl +
        "integrityserv/auto_knockoff?filter_value=" + filterVal +"&date=" + date +
        "&overwrite=" +overwrite +
        "&branch_code=" + branch +
        "&upload_type=" + uploadtype,
      { headers: headers }
    );
  }

  public accountfileUpload(files: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = "";
      console.log("Error in files");
    }

    // let json = Object.assign({})
    let formData = new FormData();
    // formData.append('data', JSON.stringify(json));
    formData.append("file", files);
    const headers = { Authorization: "Token " + token };
    console.log(formData);
    return this.http.post<any>(
      interurl + "integrityserv/account_master?file=1",
      formData,
      { headers: headers }
    );
    // return this.http.post<any>(interurl + "integrityserv/account_master", data, { 'headers': headers })
  }

  public purgeLedgerServ(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let vals = "ledger";
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(interurl + "integrityserv/purge", data, {
      headers: headers,
    });
  }

  public purgeStmtServ(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let vals = "statement";
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(interurl + "integrityserv/purge", data, {
      headers: headers,
    });
  }
  public autoknockoffFilter(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    console.log(interurl + "integrityserv/auto_knockoff" + value);
    return this.http.get<any>(
      interurl + "integrityserv/auto_knockoff" + value,
      { headers: headers }
    );
  }

 

  public getknockofflists(page,id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/knockoff_list?page=" + page+'&int_type='+id,
      { headers: headers }
    );
  }

  public singlerecords(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/knockoff_details?id=" + id,
      { headers: headers }
    );
  }

  public glFetch(CreateList, file) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(CreateList)
    let CreateList1 = CreateList;
    let json = Object.assign({}, CreateList1);
    let formData = new FormData();
    formData.append("data", JSON.stringify(json));
    // formData.append('file', file)
    const headers = { Authorization: "Token " + token };
    console.log(formData);
    return this.http.post<any>(interurl + "integrityserv/ledger", formData, {
      headers: headers,
    });
  }

  public closedate(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(interurl + "integrityserv/closed_date?id=" + id, {
      headers: headers,
    });
  }

  public downloadsingle(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/knockoff_details?id=" + id + "&download=1",
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  public getknockoffSearch(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/knockoff_details?page=" + page + value,
      { headers: headers }
    );
  }

  public IntegrityRunStatus(date, branch,uploadtype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;

    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl +
        "integrityserv/transaction_date_check?date=" +
        date +
        "&branch_code=" + branch+
        "&upload_type=" +
        uploadtype,
      { headers: headers }
    );
  }

  

  public getknockoffSearchDownload(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/knockoff_details?download=1" + value,
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  public glUploads(CreateList, files, id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = "";
      console.log("Error in files");
    }
    let CreateList1 = CreateList;
    delete CreateList1.account_id;
    delete CreateList1.filedata;
    // delete CreateList1.template_id

    let json = Object.assign({}, CreateList1);
    let formData = new FormData();
    formData.append("data", JSON.stringify(json));
    formData.append("file", files);
    const headers = { Authorization: "Token " + token };
    console.log(formData);
    return this.http.post<any>(
      interurl + "integrityserv/ledger?overwrite=" + id,
      formData,
      { headers: headers }
    );
  }

  public bankstatementUplaods(CreateList, files, id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = "";
      console.log("Error in files");
    }
    let CreateList1 = CreateList;
    delete CreateList1.account_id;
    delete CreateList1.filedatas;

    let json = Object.assign({}, CreateList1);
    let formData = new FormData();
    formData.append("data", JSON.stringify(json));
    formData.append("file", files);
    const headers = { Authorization: "Token " + token };
    console.log(formData);
    return this.http.post<any>(
      interurl + "integrityserv/statement?overwrite=" + id,
      formData,
      { headers: headers }
    );
  }

  public glFetchS(CreateList, file, id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(CreateList)
    let CreateList1 = CreateList;
    let json = Object.assign({}, CreateList1);
    let formData = new FormData();
    formData.append("data", JSON.stringify(json));
    // formData.append('file', file)
    const headers = { Authorization: "Token " + token };
    console.log(formData);
    return this.http.post<any>(
      interurl + "integrityserv/ledger?overwrite=" + id,
      formData,
      { headers: headers }
    );
  }

  public getknockoffSearchDate(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(interurl + "integrityserv/knockoff_details", {
      headers: headers,
    });
  }

  public accountSedit(CreateList: any): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    let data = [CreateList];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(
      interurl + "integrityserv/account_master",
      data,
      { headers: headers }
    );
  }

  public deleteaccounts(id): Observable<any> {
    this.reset();
    let comments = "";
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(comments)
    const headers = { Authorization: "Token " + token };
    const options = {
      headers: headers,
      body: { comment: comments },
    };

    return this.http.delete<any>(
      interurl + "integrityserv/account_master?id=" + id,
      { headers: headers }
    );
  }

  public downloadAccount(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/account_master?download=1",
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  public getAccountSearch(value,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/account_master?page="+page + value,
      { headers: headers }
    );
  }

  public getAccountUpdate(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let formData = new FormData();
    formData.append("file", value);
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(interurl + "integrityserv/account_master_upload", formData, {
      headers: headers,
    });
  }
  
  public viewData_download(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/account_master_xcel_dowload?id="+id,{ headers: headers , responseType: "blob" as "json"}
    );
  }
  public deleteFileData(id,type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/account_master_delete?id=" + id + "&type=" +type,
      { headers: headers }
    );
  }
  
  public getViewData(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let formData = new FormData();
    // formData.append("file", value);
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(interurl + "integrityserv/account_master_upload?page="+ page , {
      headers: headers,
    });
  }

  public getBranches(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(interurl + "usrserv/search_branch?page=" + page, {
      headers: headers,
    });
  }
  public glUploadbranch(CreateList, files, branch) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = "";
      console.log("Error in files");
    }
    let CreateList1 = CreateList;
    delete CreateList1.account_id;
    delete CreateList1.filedata;
    // delete CreateList1.template_id

    let json = Object.assign({}, CreateList1);
    let formData = new FormData();
    formData.append("data", JSON.stringify(json));
    formData.append("file", files);
    const headers = { Authorization: "Token " + token };
    console.log(formData);
    return this.http.post<any>(
      interurl + "integrityserv/ledger?branch_code=" + branch,
      formData,
      { headers: headers }
    );
  }

  public getemployeesdetails(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(interurl + "taserv/emp_details_get", {
      headers: headers,
    });
  }
  public autoknockoffBranch(date, branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;

    const headers = { Authorization: "Token " + token };
    const branchString = branch.toString();
    return this.http.get<any>(
      interurl +
        "integrityserv/auto_knockoff?filter_value=non_zero&date=" +
        date +
        "&branch_code=" +
        branchString ,
      { headers: headers }
    );
  }

  public wisefintb(data,bscc,jv,jw,fa,expense) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
 
      console.log("upload api",data)
      console.log("upload file",bscc,jv,jw,fa,expense)
      let json = Object.assign({}, data);
      let formData = new FormData();
      formData.append("data", JSON.stringify(json));
      formData.append("bscc", bscc);
      formData.append("jv", jv);
      formData.append("jw", jw);
      formData.append("fa", fa);
      formData.append("expense", expense);
     
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      interurl + "integrityserv/tb_interintegrity" ,formData,{ headers: headers }
    );
  }

  public document_upload(data,file) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
 
      console.log("upload api",data)
      console.log("upload file",file)
      let json = Object.assign({}, data);
      let formData = new FormData();
      formData.append("data", JSON.stringify(json));
      formData.append("file", file);
     
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      interurl + "integrityserv/s3_excel_upload" ,formData,{ headers: headers }
    );
  }

  public upload_summary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/s3_excel_upload",{ headers: headers }
    );
  }

  public tb_s3_download(date,inter_id,id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/tb_interintegrity?date="+date+'&int_type='+inter_id+'&id='+id,{ headers: headers , responseType: "blob" as "json"}
    );
  }

  public tb_fetch_summary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/auto_fetch_summary",{ headers: headers }
    );
  }

  public summary_search(date,type,file,page,test,id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    console.log("search_date",date)
    console.log("search_type",type)
    return this.http.get<any>(
      interurl + "integrityserv/s3_excel_upload?date="+ date + '&type='+type+ '&name=' +file+ '&page=' + page+'&test='+test+'&int_type='+id,
      { headers: headers }
    );
  }

  public perticular_get(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/particular_fech_controller?id=11" ,{ headers: headers }
    );
  }

  public status_modify(date,type,status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/status_modify_controller?date="+date+'&type='+type+'&status='+status,{ headers: headers }
    );
  }

  public tb_status_tb(date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      interurl + "integrityserv/tb_interintegrity?date="+date,{ headers: headers }
    );
  }

  public implementing_conditions(date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    let formData = new FormData();
    formData.append("date", date);
    return this.http.post<any>(
      interurl + "integrityserv/s3_implementing_conditions",date,{ headers: headers }
    );
  }

  public s3_download(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/s3_excel_downlord?id="+id,{ headers: headers , responseType: "blob" as "json"}
    );
  }

  public knock_off_summary(page,date,type,size,order,id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/knock_summary?page="+page+'&date='+date+'&type='+type+'&page_size='+size+'&order='+order+'&int_type='+id,{ headers: headers }
    );
  }

  public integrity_count(date,id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/integtrity_count?date="+date+'&int_type='+id,{ headers: headers }
    );
  }

  public integrity_file(date,temp,id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/integrity_file_dropdown?date="+date+'&temp_name='+temp+'&int_type='+id,{ headers: headers }
    );
  }

  public intigritydownload(date,id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/download_knock_summary?date="+date+'&int_type='+id,{ headers: headers , responseType: "blob" as "json"}
    );
  }

  public attachmentsubmit(fas,cbs,): Observable<any> {
    // fas_dd_data,cbs_dd_data
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    if (!fas) {
      console.log("Error in file");
    }
    if (!cbs) {
      console.log("Error in file");
    }
    let files_fas :File=fas
    let files_cbs :File=cbs
    let formData = new FormData();
    // formData.append('data', additionalData)
    formData.append('file_fas', files_fas);
    formData.append('file_cbs', files_cbs);
    // formData.append('fas_sheet', fas_dd_data);
    // formData.append('cbs_sheet', cbs_dd_data);
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(interurl + 'integrityserv/excel_col_header' ,formData, { headers });
    // ?fas_sheet=' + fas_dd_data + "&cbs_sheet=" + cbs_dd_data,
  }

  public attachmentSsubmit(fas,cbs): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    if (!fas) {
      console.log("Error in file");
    }
    if (!cbs) {
      console.log("Error in file");
    }
    // let files_fas :File=fas
    // let files_cbs :File=cbs
    let formData = new FormData();
    // formData.append('data', additionalData)
    formData.append('file_fas', fas);
    formData.append('file_cbs', cbs);
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(interurl + 'integrityserv/auto_fetch_summary', formData, { headers });
  }
  public fas_dd(files_fas,files_cbs): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    if (!files_fas) {
      console.log("Error in file");
    }
    // if (!cbs) {
    //   console.log("Error in file");
    // }
    // let files_fas :File=fas
    // let files_cbs :File=cbs
    let formData = new FormData();
    // formData.append('data', file)
    formData.append('file_fas', files_fas);
    formData.append('file_cbs', files_cbs);
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(interurl + 'integrityserv/auto_fetch_summary', formData, { headers });
  }
  public inputdata(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + 'integrityserv/upload_type',{ headers: headers}
    );
  }
  public svae_inegrity(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      interurl + "integrityserv/multi_integrity_uploads",data,{ headers: headers }
    );
  }
  public inter_file_summary(page,params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + 'integrityserv/multi_integrity_uploads?page='+page+params,{ headers: headers}
    );
  }
  public inter_file_statuschange(id,status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      interurl + 'integrityserv/multi_integrity_uploads?id='+id+'&status='+status,{ headers: headers}
    );
  }
  public db_linkcreation(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      interurl + "integrityserv/db_entry",data,{ headers: headers }
    );
  }
  public dbsummary(page,params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + 'integrityserv/db_entry?page='+page+params,{ headers: headers}
    );
  }
  public dblink_statuschange(id,status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      interurl + 'integrityserv/db_entry?id='+id+'&status='+status,{ headers: headers}
    );
  }
  public dbschema(user,pass,port,ip,page,input): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + 'integrityserv/db_link_schema?user='+user+'&password='+pass+'&port='+port+'&ip_address='+ip+'&page='+page+'&schema_name='+input,{ headers: headers}
    );
  }
  public dbtable(user,pass,port,ip,schema,page,input): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + 'integrityserv/db_link_table?user='+user+'&password='+pass+'&port='+port+'&ip_address='+ip+'&schema_name='+schema+'&page='+page+'&table_name='+input,{ headers: headers}
    );
  }
  public dbwhere(user,pass,port,ip,schema,table,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + 'integrityserv/db_link_col?user='+user+'&password='+pass+'&port='+port+'&ip_address='+ip+'&schema_name='+schema+'&table_name='+table+'&page='+page,{ headers: headers}
    );
  }
  public executequery(user,pass,port,ip,query,type,date,temp,id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + 'integrityserv/db_fetch_table?user='+user+'&password='+pass+'&port='+port+'&ip_address='+ip+'&query='+query
      +'&type='+type+'&date='+date+'&temp_name='+temp+'&int_type='+id,{ headers: headers}
    );
  }
  public apicall_creation(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    let formdata = new FormData();
    formdata.append('data',JSON.stringify(value))
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      interurl + "integrityserv/api_cal_create",formdata,{ headers: headers }
    );
  }
  public getapi_summary(page,data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + 'integrityserv/api_cal_create?page='+page+data,{ headers: headers}
    );
  }
  public apicall_action(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    let formdata = new FormData();
    formdata.append('data',JSON.stringify(value))
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      interurl + "integrityserv/fetch_api",formdata,{ headers: headers }
    );
  }
  public newtemplate(page,value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let param=''
    if(value!==''){
param='&template_name='+value
    }
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + "integrityserv/template?page=" + page+param,
      { headers: headers }
    );
  }
  public dblink_runintegrity(id,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + 'integrityserv/db_summary?int_type='+id+'&page='+page,{ headers: headers}
    );
  }
  public delete_dblink_summary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(
      interurl + 'integrityserv/db_summary?id='+id,{ headers: headers}
    );
  }

  public rundatesIntegrity(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      interurl + 'integrityserv/run_date_success?int_type='+id,{ headers: headers}
    );
  }
  public download_integrity_template(type): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { Authorization: "Token " + token };
      return this.http.get<any>(
        interurl + 'integrityserv/TB_creation_template?type='+type,
        { headers: headers, responseType: "blob" as "json" }
      );
    }
}

