import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, throwError } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { NotificationService } from "../service/notification.service";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { param } from "jquery";

const brsurl = environment.apiURL;

@Injectable({
  providedIn: "root",
})
export class BrsApiServiceService {
  constructor(private http: HttpClient, private idle: Idle) { }

  idleState = "Not started.";
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = "Started.";
    this.timedOut = false;
  }

  public getLedgerdata(id, page, branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/ledger?account_id=" +
      id +
      "&page=" +
      page +
      "&branch_code=" +
      branch +
      "&brs_status=1",
      { headers: headers }
    );
    // return this.http.get<any>(brsurl + "brsserv/ledger", { 'headers': headers })
  }

  public getStatementdata(id, page, branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/statement?account_id=" +
      id +
      "&page=" +
      page +
      "&branch_code=" +
      branch +
      "&brs_status=1",
      { headers: headers }
    );
  }

  public autoknockoff(id, ids, val, branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;

    const headers = { Authorization: "Token " + token };
    // return this.http.get<any>(brsurl + "brsserv/auto_knockoff?page="+page+"&"+"ledger_account_id=1"
    // +"&"+"statement_account_id=1", { 'headers': headers })
    return this.http.get<any>(
      brsurl +
      "brsserv/auto_knockoff?ledger_account_id=" +
      id +
      "&" +
      "statement_account_id=" +
      ids +
      "&mirror=" +
      val +
      "&branch_code=" +
      branch,
      { headers: headers }
    );
  }

  //defineTemplate

  public defineTemplate(CreateList: any, CreateList1: any): Observable<any> {
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
    let data = [json];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(brsurl + "brsserv/statement_template", data, {
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
      brsurl + "brsserv/cbs_template?page=" + page,
      { headers: headers }
    );
  }

  public Ggettemplates(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/gl_template?page=" + page, {
      headers: headers,
    });
  }

  public defineRuleEngine(CreateList: any): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    CreateList.statement_rule = 1;

    // let json = Object.assign({}, CreateList)
    // console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    let data = [CreateList];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(brsurl + "brsserv/rule", data, {
      headers: headers,
    });
  }

  public getruledefinition(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/get_rule?page=" + page, {
      headers: headers,
    });
  }
  public getruledefinitionL(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/rule?page=" + page + "&statement_rule=0",
      { headers: headers }
    );
  }
  public getruledefinitionB(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/rule?page=" + page + "&statement_rule=1",
      { headers: headers }
    );
  }
  public recommendatory(id, recomId): Observable<any> {
    this.reset();
    let comments = '';
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let body =  { 
    //   'id': id,
    //   'recom' : recomId ,
    //   'status' : null

    // };
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(brsurl + "brsserv/rule?id=" + id + "&recomm=" + recomId, { 'headers': headers })
  }

  public statusrules(id, statusId): Observable<any> {
    this.reset();
    let comments = '';
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let body =  { 
    //   'id': id,
    //   'status' : statusId ,
    //   'recom' : null
    // };

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(brsurl + "brsserv/rule?id=" + id + "&status=" + statusId, { 'headers': headers })
  }

  public deleteData(id): Observable<any> {
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

    return this.http.delete<any>(brsurl + "brsserv/ars_fetch_field?id=" + id, { 'headers': headers })
  }

  public editrulee(id): Observable<any> {
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

    return this.http.get<any>(brsurl + "brsserv/rule?id=" + id, {
      headers: headers,
    });
  }
  public defineRuleMappings(CreateList: any): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }

    // let json = Object.assign({}, CreateList)
    // console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    let data = [CreateList];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(brsurl + "brsserv/rule_mapping", data, {
      headers: headers,
    });
  }

  public getrulemaps(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/rule_mapping?page=" + page, {
      headers: headers,
    });
  }

  public deleterulemap(id): Observable<any> {
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

    return this.http.delete<any>(brsurl + "brsserv/rule_mapping?id=" + id, {
      headers: headers,
    });
  }

  public bankstatementUplaod(id, CreateList, files) {
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
      brsurl + "brsserv/statement?account_id=" + id,
      formData,
      { headers: headers }
    );
  }

  // public glUpload(id, CreateList, files) {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")

  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token

  //   if (files == undefined) {
  //     files = ''
  //     console.log("Error in files")
  //   }
  //   let CreateList1 = CreateList
  //   delete CreateList1.account_id
  //   delete CreateList1.filedata

  //   let json = Object.assign({}, CreateList1)
  //   let formData = new FormData();
  //   formData.append('data', JSON.stringify(json));
  //   formData.append('file', files)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   console.log(formData)
  //   return this.http.post<any>(brsurl + "brsserv/ledger?template_id="+id, formData, { 'headers': headers })
  // }
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
    return this.http.post<any>(brsurl + "brsserv/ledger", formData, {
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
      brsurl + "brsserv/statement_template?id=" + id,
      { headers: headers }
    );
  }

  public getknockofflists(page, branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/knockoff_list?branch_code=" + branch + "&page=" + page,
      { headers: headers }
    );
  }

  public getknockoffSearch(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/knockoff_list?page=" + page + value,
      { headers: headers }
    );
  }

  public getaccountdata(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/account_master?page=" + page, {
      headers: headers,
    });
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

    return this.http.delete<any>(brsurl + "brsserv/account_master?id=" + id, {
      headers: headers,
    });
  }

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
    return this.http.post<any>(brsurl + "brsserv/account_master", data, {
      headers: headers,
    });
  }

  public singlerecords(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/knockoff_details?id=" + id, {
      headers: headers,
    });
  }

  public defineTemplates(CreateList: any, CreateList1: any, dynamicdata,wisefin): Observable<any> {
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
    json.dynamic_data = dynamicdata
    json.customize_temp_wisefin=wisefin
    console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    let data = [json];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(brsurl + "brsserv/wisefin_template", data, {
      headers: headers,
    });
  }

  public getNtemplates(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/wisefin_template?page=" + page, {
      headers: headers,
    });
  }

  public deleteNtemplates(id, status): Observable<any> {
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

    return this.http.delete<any>(brsurl + "brsserv/wisefin_template?id=" + id + "&status=" + status, {
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
      brsurl + "brsserv/knockoff_details?id=" + id + "&download=1",
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public Btemplatedate(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/statement_template?id=" + id, {
      headers: headers,
    });
  }

  public gettemplatesgl(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/gl_template?page=" + page, {
      headers: headers,
    });
  }

  public getaccountmapping(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/account_mapping?page=" + page, {
      headers: headers,
    });
  }

  public addAccountMap(CreateList: any): Observable<any> {
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
    return this.http.post<any>(brsurl + "brsserv/account_mapping", data, {
      headers: headers,
    });
  }
  public NdefineRuleEngine(CreateList: any): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    let CreateList1 = CreateList;
    // CreateList1.statement_rule = 0;
    // let json = Object.assign({}, CreateList)
    // console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    let data = CreateList1;
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(brsurl + "brsserv/rule", data, {
      headers: headers,
    });
  }
  public getNsingletemplate(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/gl_template?id=" + id, {
      headers: headers,
    });
  }

  public defineTemplatesBank(
    CreateList: any,
    CreateList1: any,
    dynamicdata,
    cbs
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
    json.dynamic_data = dynamicdata
    json.customize_temp_cbs = cbs
    console.log(json);
    // const body = JSON.stringify(json)
    // let data = list.push(body);
    let data = [json];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(brsurl + "brsserv/cbs_template", data, {
      headers: headers,
    });
  }

  // public confirmingknockoff(id, ids): Observable<any>
  // {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   // let body = {}
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(brsurl + "brsserv/auto_knockoff?ledger_account_id="+1+"&statement_account_id="+1,  { 'headers': headers })
  //   // return this.http.post<any>(rmuurl + "rmuserv/vendor_archival", body, { 'headers': headers })

  // }
  public confirmingknockoff(data): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }

    // const body = JSON.stringify(json)
    // let data = list.push(body);
    // let data = [json]
    let formdata = [];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    // return this.http.post<any>(brsurl + "brsserv/auto_knockoff",data,  { 'headers': headers })
    return this.http.post<any>(
      brsurl + "brsserv/auto_knockoff_scheduler",
      data,
      { headers: headers }
    );
  }

  //manual_knockoff

  public manualKnockoff(data): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }

    // const body = JSON.stringify(json)
    // let data = list.push(body);
    // let data = [json]
    let formdata = [];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(brsurl + "brsserv/manual_knockoff", data, {
      headers: headers,
    });
  }

  public downloadLedger(id, branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let vals = "ledger";
    const headers = { Authorization: "Token " + token };
    // return this.http.get<any>(brsurl + "brsserv/auto_knockoff?page="+page+"&"+"ledger_account_id=1"
    // +"&"+"statement_account_id=1", { 'headers': headers })
    return this.http.get<any>(
      brsurl +
      "brsserv/report_download?account_id=" +
      id +
      "&brs_status=1&type=" +
      vals +
      "&branch_code=" +
      branch,
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  public downloadStmt(id, branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let vals = "statement";
    const headers = { Authorization: "Token " + token };
    // return this.http.get<any>(brsurl + "brsserv/auto_knockoff?page="+page+"&"+"ledger_account_id=1"
    // +"&"+"statement_account_id=1", { 'headers': headers })
    return this.http.get<any>(
      brsurl +
      "brsserv/report_download?account_id=" +
      id +
      "&brs_status=1&type=" +
      vals +
      "&branch_code=" +
      branch,
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  public AutoknockoffDownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let vals = "statement";
    const headers = { Authorization: "Token " + token };
    // return this.http.get<any>(brsurl + "brsserv/auto_knockoff?page="+page+"&"+"ledger_account_id=1"
    // +"&"+"statement_account_id=1", { 'headers': headers })
    return this.http.get<any>(
      brsurl + "brsserv/knockoff_details?id=" + id + "&download=1",
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  public purgeLedgerServ(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let vals = "ledger";
    const headers = { Authorization: "Token " + token };
    // return this.http.get<any>(brsurl + "brsserv/auto_knockoff?page="+page+"&"+"ledger_account_id=1"
    // +"&"+"statement_account_id=1", { 'headers': headers })
    return this.http.post<any>(brsurl + "brsserv/purge", data, {
      headers: headers,
    });
  }

  //

  public purgeStmtServ(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let vals = "statement";
    const headers = { Authorization: "Token " + token };
    // return this.http.get<any>(brsurl + "brsserv/auto_knockoff?page="+page+"&"+"ledger_account_id=1"
    // +"&"+"statement_account_id=1", { 'headers': headers })
    return this.http.post<any>(brsurl + "brsserv/purge", data, {
      headers: headers,
    });
  }

  public purgeHistory(page, branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let vals = "statement";
    const headers = { Authorization: "Token " + token };
    // return this.http.get<any>(brsurl + "brsserv/auto_knockoff?page="+page+"&"+"ledger_account_id=1"
    // +"&"+"statement_account_id=1", { 'headers': headers })
    return this.http.get<any>(
      brsurl + "brsserv/purge?branch_code=" + branch + "&page=" + page,
      { headers: headers }
    );
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
    return this.http.post<any>(brsurl + "brsserv/account_master", data, {
      headers: headers,
    });
  }

  public getsinglerule(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/rule?id=" + id, {
      headers: headers,
    });
  }

  public deleteaccountmapping(id): Observable<any> {
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

    return this.http.delete<any>(brsurl + "brsserv/account_mapping?id=" + id, {
      headers: headers,
    });
  }

  public rulemapedit(CreateList: any): Observable<any> {
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
    return this.http.post<any>(brsurl + "brsserv/rule_mapping", data, {
      headers: headers,
    });
  }

  public templateSedit(CreateList: any): Observable<any> {
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
    return this.http.post<any>(brsurl + "brsserv/gl_template", data, {
      headers: headers,
    });
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
    return this.http.post<any>(brsurl + "brsserv/statement_template", data, {
      headers: headers,
    });
  }

  public ruleSedit(CreateList: any): Observable<any> {
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
    return this.http.post<any>(brsurl + "brsserv/rule", data, {
      headers: headers,
    });
  }
  public singlerecordspurge(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ledger?purge_entry_id=" + id, {
      headers: headers,
    });
  }
  public arsfasfieldvalidate(CreateList, id, files) {
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
    delete CreateList1.int_gl;
    delete CreateList1.filedata;
    // delete CreateList1.template_id

    let json = Object.assign({}, CreateList1);
    let formData = new FormData();
    formData.append("data", JSON.stringify(json));
    formData.append("file", files);
    const headers = { Authorization: "Token " + token };
    console.log(formData);
    return this.http.post<any>(brsurl + "brsserv/ARS_runprocess", formData, {
      headers: headers,
    });
  }

  public glUploadSchedule(CreateList, id, files) {
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
    delete CreateList1.int_gl;
    delete CreateList1.filedata;
    // delete CreateList1.template_id

    let json = Object.assign({}, CreateList1);
    let formData = new FormData();
    formData.append("data", JSON.stringify(json));
    formData.append("file", files);
    const headers = { Authorization: "Token " + token };
    console.log(formData);
    return this.http.post<any>(brsurl + "brsserv/ARS_wisefin_Upload_excel", formData, {
      headers: headers,
    });
  }

  public arscbsfieldvalidate(id, CreateList, files) {
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
    return this.http.post<any>(brsurl + "brsserv/ARS_runprocess", formData, {
      headers: headers,
    });
  }

  public bankstatementUplaodSchedule(id, CreateList, files) {
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
    return this.http.post<any>(brsurl + "brsserv/ARS_CBS_Upload_excel", formData, {
      headers: headers,
    });
  }

  public confirmingknockoffSchedule(data): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }

    // const body = JSON.stringify(json)
    // let data = list.push(body);
    // let data = [json]
    let formdata = [];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(
      brsurl + "brsserv/auto_knockoff_scheduler",
      data,
      { headers: headers }
    );
  }

  public schedulerStatus(branch): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/scheduler_status_get?branch_code=" + branch,
      { headers: headers }
    );
  }

  public fetchgldata(CreateList): Observable<any> {
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
    return this.http.post<any>(brsurl + "brsserv/ledger_scheduler", formData, {
      headers: headers,
    });
  }


  public actionControl(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/action_master?type=" + id, {
      headers: headers,
    });
  }

  public newAction(CreateList: any): Observable<any> {
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
    return this.http.post<any>(brsurl + "brsserv/action_master", data, {
      headers: headers,
    });
  }

  public getActionData(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/action_master", {
      headers: headers,
    });
  }

  public getActionData1(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ARS_Dropdown", {
      headers: headers,
    });
  }
  public getCategoryList(gl_codeid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/category_dropdown?gl_no=" + gl_codeid, {
      headers: headers,
    });
  }

  public getSubCategory(glcode_id, id, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/category_dropdown?gl_no=" + glcode_id + "&page=" + page + "&category_id=" + id, {
      headers: headers,
    });
  }
  public getcc(glcode_id, id, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/buisness_cost_drodown?gl_no=" + glcode_id + "&page=" + page + "&bs_id=" + id, {
      headers: headers,
    });
  }

  public getCategoryListScroll(glcode_id, value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/category_dropdown?gl_no=" + glcode_id + "&page=" + page + "&category_name=" + value, {
      headers: headers,
    });
  }
  public getsubCategoryListScroll(glcode_id, id, value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/category_dropdown?gl_no=" + glcode_id + "&page=" + page + "&category_id=" + id + "&category_name=" + value, {
      headers: headers,
    });
  }
  public getccscroll(glcode_id, id, value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/buisness_cost_drodown?gl_no=" + glcode_id + "&page=" + page + "&bs_id=" + id + "&name=" + value, {
      headers: headers,
    });
  }
  public getbs(gl_codeid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/buisness_cost_drodown?gl_no=" + gl_codeid, {
      headers: headers,
    });
  }
  public getbsscroll(gl_codeid, value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/buisness_cost_drodown?gl_no=" + gl_codeid + "&page=" + page + "&name=" + value, {
      headers: headers,
    });
  }
  public actionEdit(CreateList: any): Observable<any> {
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
    return this.http.post<any>(brsurl + "brsserv/action_master", data, {
      headers: headers,
    });
  }

  public deleteAction(id): Observable<any> {
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

    return this.http.delete<any>(brsurl + "brsserv/action_master?id=" + id, {
      headers: headers,
    });
  }

  public deleteRow(id): Observable<any> {
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

    return this.http.delete<any>(brsurl + "brsserv/action_fetch_download?id=" + id, {
      headers: headers,
    });
  }


  public actionKnockoff(id, data): Observable<any> {
    this.reset();
    let token = "";
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }

    // const body = JSON.stringify(data)
    // let data = list.push(body);
    // let data = [json]
    let formdata = [];
    const headers = { Authorization: "Token " + token };
    // console.log("Body", body)
    return this.http.post<any>(
      brsurl + "brsserv/manual_knockoff?action=" + id,
      data,
      { headers: headers }
    );
  }
  public getemployeesdetails(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "taserv/emp_details_get", {
      headers: headers,
    });
  }

  public knock_off_summary(
    page,
    date,
    type,
    size,
    order,
    branch
  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "integrityserv/knock_summary?page=" +
      page +
      "&date=" +
      date +
      "&type=" +
      type +
      "&page_size=" +
      size +
      "&order=" +
      order +
      "&branch_code=" +
      branch,
      { headers: headers }
    );
  }

  public ARSUploadexcel(data, file) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let json = Object.assign({}, data);
    let formData = new FormData();
    formData.append("data", JSON.stringify(json));
    formData.append("file", file);

    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ARS_Upload_excel", formData, {
      headers: headers,
    });
  }

  public ARSrunprocess(gl_code, branch_code, date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/ARS_runprocess?gl_code=" +
      gl_code +
      "&branch_code=" +
      branch_code +
      "&date=" +
      date,
      { headers: headers }
    );
  }

  public fetchunmatvh(
    from_date,
    to_date,
    branch_code,
    gl_code,
    page,
    type
  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/fetch_unmatch?from_date=" +
      from_date +
      "&to_date=" +
      to_date +
      "&gl_code=" +
      gl_code +
      "&branch_code=" +
      branch_code +
      "&page=" +
      page +
      "&type=" +
      type,
      { headers: headers }
    );
  }

  public ArsDropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ARS_Dropdown", {
      headers: headers,
    });
  }
  public MatchingPartialdata(params, body): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      brsurl + "brsserv/partially_matched" + params, body, { headers: headers }
    );
  }
  public branchcode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/code_DD_unmatch", {
      headers: headers,
    });
  }

  public Action_submit(data) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ars_action_create", data, {
      headers: headers,
    });
  }

  public Actionsummary(date1, date2, type, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/action_fetch?from_date=" +
      date1 +
      "&to_date=" +
      date2 +
      "&type=" +
      type +
      "&page=" +
      page,
      { headers: headers }
    );
  }

  public arsfiles(glcode, branchcode): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/ars_files_fetch?gl_code=" +
      glcode +
      "&branch_code=" +
      branchcode,
      { headers: headers }
    );
  }

  public action_download(glcode, branch, fromdate, todate): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/action_fetch_download?gl_code=" +
      glcode +
      "&branch_code=" +
      branch +
      "&from_date=" +
      fromdate +
      "&to_date=" +
      todate,
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  public ARScodeDDunmatch(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ARS_code_DD_unmatch", {
      headers: headers,
    });
  }

  public unkoffdropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "integrityserv/code_DD_unknockoff", {
      headers: headers,
    });
  }

  public statusmodify(id, status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/ars_status_modify?id=" + id + "&status=" + status,
      { headers: headers }
    );
  }

  public rulemaster(order, status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/rulemaster_fetch?order=" + order + "&status=" + status,
      { headers: headers }
    );
  }

  public ars_download(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/ARS_s3_excel_downlord?id=" + id,
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  public ars_status(gl_code, branch_code, date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/ars_process_status?branch_code=" +
      branch_code +
      "&gl_code=" +
      gl_code +
      "&date=" +
      date,
      { headers: headers }
    );
  }
  public viewData(date, gl_code, brachcode, value, history, page, inttype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_process_status?gl_code=" + gl_code + "&date=" + date + "&branch_code=" + brachcode + "&value=" + value + "&history=" + history + "&page=" + page + '&int_type=' + inttype, {
      headers: headers,
    });
  }
  public viewData_download(id, intype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/ars_view_s3_excel_download?id=" + id + "&int_type=" + intype,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public deleteFileData(id, date, type, status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_status_modify?id=" + id + "&date=" + date + "&type=" + type + "&status=" + status, {
      headers: headers,
    });
  }

  public run_process(date, gl_code, brachcode, value, temp_name, multi_gl, comparegl, inttype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ARS_Upload_excel?gl_no=" + gl_code + "&date=" + date + "&branch_code=" + brachcode + "&value=" + value + "&temp_name=" + temp_name + "&multi_gl=" + multi_gl + '&comp_gl=' + comparegl + "&int_type=" + inttype, {
      headers: headers,
    });
  }
  public arsFields(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_fetch_field", {
      headers: headers,
    });
  }
  public wisefiles(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_fetch_field?type=4", {
      headers: headers,
    });
  }
  public CBSfiles(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_fetch_field?type=5", {
      headers: headers,
    });
  }

  public postfile(data) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ars_fetch_field", data, {
      headers: headers,
    });
  }

  public run_progress(param): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/ARS_runprocess?date=" +
      param.date +
      "&gl_no=" +
      param.gl_no +
      "&branch_code=" +
      param.branch_code +
      "&id1=" +
      param.id1 +
      "&id2=" +
      param.id2 +
      "&value=" +
      param.value +
      "&multi_gl=" + param.multi_gl + "&comp_gl=" + param.comp_gl + "&temp_name=" + param.temp_name + "&int_type=" + param.int_type,
      { headers: headers }
    );
  }

  public MatchingData(params, value, data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;

    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/fetch_fas_match" + params + "&value=" + value, data, {
      headers: headers,
    });
  }
  public Matchingcbsdata(params, value, data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;

    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/fetch_cbs_match" + params + "&value=" + value, data, {
      headers: headers,
    });
  }
  public arssummarydata(params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/integrity_unmatch" + params, {
      headers: headers,
    });
  }

  public selectedRecCbs(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ars_action_submit_cbs", data, {
      headers: headers,
    });
  }
  public selectedRecFas(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ars_action_submit_fas", data, {
      headers: headers,
    });
  }
  public newActions(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ars_action_create", data, {
      headers: headers,
    });
  }
  public newActionSubmit(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/action_submit_untagnumber", data, {
      headers: headers,
    });
  }

  public getCombineData(date, gl_no, branch_code, action, value, tempname, page, inttype,pagesize): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    if(action===2){
      return this.http.get<any>(brsurl + "brsserv/matched_view?date=" + date + "&gl_no=" + gl_no + "&action=" + action + "&value=" + value + "&temp_name=" + tempname + '&page=' + page + '&int_type=' + inttype+'&page_size='+pagesize, {
        headers: headers,
      });
    }
    else{
      return this.http.get<any>(brsurl + "brsserv/matched_view?date=" + date + "&gl_no=" + gl_no + "&action=" + action + "&value=" + value + "&temp_name=" + tempname + '&page=' + page + '&int_type=' + inttype+'&page_size='+pagesize, {
        headers: headers,
      });
    }
   
  }
  public getDeletedata(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(brsurl + "brsserv/matched_view?id=" + id, {
      headers: headers,
    });
  }

  public combineSave(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/matched_view", data, {
      headers: headers,
    });
  }

  public newActionsCreate(Date, branch_code, gl_code, value, tempname): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_action_create?Date=" + Date + "&branch_code=" + branch_code + "&gl_code=" + gl_code + "&value=" + value + "&temp_name=" + tempname, {
      headers: headers,
    });
  }

  public newActionSave(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ars_action_save", data, {
      headers: headers,
    });
  }
  public actionSave(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ars_action_save", data, {
      headers: headers,
    });
  }
  public closeData(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ars_close_lineitem", data, {
      headers: headers,
    });
  }
  public getClosedRecordfas(page, date, gl_codeid, branch_codeid, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_close_lineitem?date=" + date + "&gl_no=" + gl_codeid + "&branch_code=" + branch_codeid + "&type=" + type + "&page=" + page, {
      headers: headers,
    });
  }
  public getClosedRecordcbs(page, date, gl_codeid, branch_codeid, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_close_lineitem?date=" + date + "&gl_no=" + gl_codeid + "&branch_code=" + branch_codeid + "&type=" + type + "&page=" + page, {
      headers: headers,
    });
  }

  public integrityUnmatch(date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/ars_unmatch_record?date=" + date,
      { headers: headers }
    );
  }
  public getarsbranchname(date, glcode): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/ars_unmatch_record?date=" + date + "&gl_no=" + glcode,
      { headers: headers }
    );
  }
  public arsfilterdate(date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_count?date=" + date, {
      headers: headers,
    });
  }

  public getcampaignexceldownload(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/template_download?type=" + data,
      { headers: headers, responseType: "arraybuffer" as "json" }
    );
  }

  public editfastagnumber(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    let new_data = { "data": data }
    return this.http.post<any>(brsurl + "brsserv/fetch_fas_match", new_data, {
      headers: headers,
    });
  }

  public editcbstagnumber(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/fetch_cbs_match", data, {
      headers: headers,
    });
  }

  // public editcbstagnumber(data): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   const headers = { Authorization: "Token " + token };
  //   return this.http.post<any>(brsurl + "brsserv/cbs_tagno_manual", data, {
  //     headers: headers,
  //   });
  // }

  public submitcompare(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ARS_action_compare", data, {
      headers: headers,
    });
  }
  public integrityUnmatchreportdownload(param): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/ars_report_download"+param,
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  public reportdownload(
    iDate,
    branch_codeid,
    glcode_id,
    action, value, int_type
  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/ARS_Untag_report?date=" +
      iDate +
      "&gl_no=" +
      glcode_id +
      "&branch_code=" +
      branch_codeid +
      "&action=" +
      action + "&value=" + value + "&int_type=" + int_type,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public systemreportdownload(
    iDate,
    glcode_id,
    branch_codeid, externalvalue, intype
  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/ARS_s3_excel_downlord?date=" +
      iDate +
      "&gl_no=" +
      glcode_id +
      "&branch_code=" +
      branch_codeid +
      "&type=" +
      "6" + "&value=" + externalvalue + "&int_type=" + intype,
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  public autofetchdate(auto_dict): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ARS_Dropdown", auto_dict, {
      headers: headers,
    });
  }
  public dynamicheaderfetchdata(head): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/cbs_wisefine_template" + "?temp_name=" + head, {
      headers: headers,
    });
  }
  public actionRefresh(id, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(brsurl + "brsserv/ars_action_save?id=" + id + "&type=" + type, {
      headers: headers,
    });
  }
  public actionRefreshcbs(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(brsurl + "brsserv/ars_action_save?id=" + id + "&type=1", {
      headers: headers,
    });
  }
  public manualreportdownload(
    fasfromdate_date,
    fasenddate_date,
    glcode_id,
    branch_codeid,
    iDate, externalvalue, tempname, intype
  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl +
      "brsserv/ARS_Manual_Match_report?from_date=" +
      fasfromdate_date +
      "&to_date=" +
      fasenddate_date +
      "&gl_no=" +
      glcode_id +
      "&branch_code=" +
      branch_codeid +
      "&type=" +
      "6" +
      "&date=" +
      iDate + "&value=" + externalvalue + "&temp_name=" + tempname + "&int_type=" + intype,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  // public overallmatech():Observable<any>{
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   const headers = { Authorization: "Token " + token };
  //   return this.http.post<any>(
  //     brsurl + "brsserv/ARS_Dropdown", { headers: headers }
  //   );
  // }
  public overallmatech(iDate, glcode_id, branch_codeid, externalvalue, tempname, intype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      brsurl +
      "brsserv/ARS_Manual_Match_report?date=" +
      iDate +
      "&gl_no=" +
      glcode_id +
      "&branch_code=" +
      branch_codeid +
      "&type=" +
      "6" + "&value=" + externalvalue + "&temp_name=" + tempname + "&int_type=" + intype,
      {},
      { headers: headers, responseType: "blob" as "json" }
    );
  }

  // public overallmatech(iDate, glcode_id, branch_codeid,externalvalue,template): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   const headers = { Authorization: "Token " + token };
  //   return this.http.get<any>(
  //     brsurl +
  //       "brsserv/get_col_headers?date=" +
  //       iDate +
  //       "&gl_no=" +
  //       glcode_id +
  //       "&branch_code=" +
  //       branch_codeid +
  //       "&type=" +
  //       "6"+"&value="+externalvalue+'&temp_name='+template,
  //     { headers: headers, responseType: "blob" as "json" }
  //   );
  // }

  public autofetchDownload(body): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      brsurl +
      "brsserv/auto_fetch", body,
      { headers: headers }
    );
  }
  public account_mapping(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/account_template_mapping", data, {
      headers: headers,
    });
  }
  public account_mapping_get(page, params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/account_template_mapping?page=" + page + params, {
      headers: headers,
    });
  }
  public attachmentsubmit(fas, cbs): Observable<any> {
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
    let files_fas: File = fas
    let files_cbs: File = cbs
    let formData = new FormData();
    // formData.append('data', additionalData)
    formData.append('file_fas', files_fas);
    formData.append('file_cbs', files_cbs);
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(brsurl + 'brsserv/get_col_headers', formData, { headers });
  }
  public getwisefie_data(name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/wisefin_template?name=" + name, {
      headers: headers,
    });
  }
  public getcbsdata(name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/cbs_template?name=" + name, {
      headers: headers,
    });
  }
  public wisefine_edit_update(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/wisefin_template", data, {
      headers: headers,
    });
  }
  public cbs_edit_update(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/cbs_template", data, {
      headers: headers,
    });
  }
  public gettemp_data(data) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/cbs_data_count", data, {
      headers: headers,
    });
  }
  public bulk_file_upload(file, additionalData): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    if (!file) {
      console.log("Error in file");
    }

    let files_fas: File = file
    let formData = new FormData();
    formData.append('data', additionalData)
    formData.append('file', files_fas);

    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(brsurl + 'brsserv/bulkaccount_upload', formData, { headers });
  }
  public get_fas_cbs_fetch_data(params, value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/cbs_data_count" + params + "&value=" + value, {
      headers: headers,
    });
  }
  public getruledefinition1(page, params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/get_rule?page=" + page + params, {
      headers: headers,
    });
  }
  public getNtemplatess(page, params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/wisefin_template?page=" + page + params, {
      headers: headers,
    });
  }

  public getNtemplates1(name, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/wisefin_template?name=" + name + "&page=" + page, {
      headers: headers,
    });
  }
  public deleteaccountmap(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(brsurl + "brsserv/account_template_mapping?id=" + id, {
      headers: headers,
    });
  }
  public getcondition(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/upload_type", {
      headers: headers,
    });
  }
  public gettemp_filter(temp): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_filters?temp_name=" + temp, {
      headers: headers,
    });
  }
  public post_filter_data(data) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ars_filters", data, {
      headers: headers,
    });
  }
  public delete_filter(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(brsurl + "brsserv/ars_filters?id=" + id, {
      headers: headers,
    });
  }
  public auto_fetch_summary(date, gl, branch, page, intype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/auto_fetch?date=" + date + "&gl_no=" + gl + "&branch=" + branch + '&page=' + page + '&int_type=' + intype, {
      headers: headers,
    });
  }
  public delete_autofetch(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(brsurl + "brsserv/auto_fetch?id=" + id, {
      headers: headers,
    });
  }
  public rundatesIntegrity(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + 'integrityserv/run_date_success?int_type=' + id, { headers: headers }
    );
  }
  public ars_fileattachment(fas, cbs, data): Observable<any> {
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
    let fas_file: File = fas
    let cbs_file: File = cbs
    let formData = new FormData();
    // formData.append('data', additionalData)
    formData.append('fas_file', fas_file);
    formData.append('cbs_file', cbs_file);
    formData.append('data', JSON.stringify(data));
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(brsurl + 'brsserv/multiple_uploads', formData, { headers });
  }
  public ars_schedule(data) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/run_multiple_gl_scheduler", data, {
      headers: headers,
    });
  }
  public ars_schedule_delete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(brsurl + "brsserv/run_multiple_gl_scheduler?id=" + id, {
      headers: headers,
    });
  }
  public ars_schedule_delete_uploadsum(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(brsurl + "brsserv/multiple_uploads?id=" + id, {
      headers: headers,
    });
  }
  public passjw_success(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let formData = new FormData();
    formData.append('data', JSON.stringify(data));
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(brsurl + 'brsserv/jw_entry_ars', formData, { headers });
  }
  public ars_schedule_download(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/ARS_multiple_downlord?id=" + id ,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public ars_autofetch_download(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/ARS_auto_fetch_downlord?id=" + id ,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public mono_jw_download(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + "brsserv/Mono_jw_excel_download?id=" + id ,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public delete_mono_jw(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(brsurl + "brsserv/jw_entry_ars?id=" + id, {
      headers: headers,
    });
  }
  public getsubcatagorygl(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      brsurl + 'brsserv/subcat_gl?subcat_id=' + id, { headers: headers }
    );
  }
  public auto_fetch_summary_withoutgl(date,page, intype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/auto_fetch?date=" + date+'&page=' + page + '&int_type=' + intype, {
      headers: headers,
    });
  }
  public get_glcount_download(body): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      brsurl +
      "brsserv/ars_gl_counts", body,
      { headers: headers ,responseType: "blob" as "json"}
    );
  }
  public summarytable_remark_submit(data) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/ars_status_change", data, {
      headers: headers,
    });
  }
  public get_gl_count(date,int_type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(brsurl + "brsserv/ars_gl_counts?date="+date+"&int_type="+int_type, {
      headers: headers,
    });
  }
  public get_bulk_accountmappingtemp(): Observable<any> {
    this.reset();
    let data
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      brsurl +
      "brsserv/ars_bulk_account_template",data,
      { headers: headers ,responseType: "blob" as "json"}
    );
  }
  public summarytable_pass_entry(data) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "brsserv/unmatch_jw_pass", data, {
      headers: headers,
    });
  }
  public submit_template_name(data) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(brsurl + "reconserv/report_column", data, {
      headers: headers,
    });
  }
}
