import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { NotificationService } from "../service/notification.service";
import { data, param } from "jquery";
const reconurl = environment.apiURL;
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";

@Injectable({
  providedIn: 'root',
})
export class ReconServicesService {

  constructor(private http: HttpClient,private idle: Idle) { }
  idleState = "Not started.";
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = "Started.";
    this.timedOut = false;
  }
  
  public newActionsCreate(Date, branch_code, gl_code,value,tempname): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/ars_action_create?Date="+ Date + "&branch_code=" + branch_code + "&gl_code=" + gl_code + "&value="+value+"&temp_name="+tempname, {
      headers: headers,
    });
  }
  public newActionSubmit(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/action_submit_untagnumber", data, {
      headers: headers,
    });
  }
  public getDeletedata(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/matched_view?id="+id, {
      headers: headers,
    });
  }
  public getCombineData(date,gl_no,branch_code,action,value,tempname,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/matched_view?date="+date+"&gl_no="+gl_no+"&branch_code="+branch_code+"&action="+action+"&value="+value+"&temp_name="+tempname+'&page='+page, {
      headers: headers,
    });
  }
  public combineSave(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/matched_view",data, {
      headers: headers,
    });
  }
  public systemreportdownload(
    iDate,
    glcode_id,
    branch_codeid,externalvalue
  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      reconurl +
        "reconserv/ARS_s3_excel_downlord?date=" +
        iDate +
        "&gl_no=" +
        glcode_id +
        "&branch_code=" +
        branch_codeid +
        "&type=" +
        "6" + "&value="+externalvalue,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public newActions(data,recon_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/ars_action_create?recon_type="+recon_id, data, {
      headers: headers,
    });
  }
  public selectedRecCbs(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/ars_action_submit_cbs", data, {
      headers: headers,
    });
  }
  public selectedRecFas(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/ars_action_submit_fas", data, {
      headers: headers,
    });
  }
  public actionSave(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/ars_action_save", data, {
      headers: headers,
    });
  }
  public autofetchdate(auto_dict,recon_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/ARS_Dropdown?recon_type="+recon_id,auto_dict, {
      headers: headers,
    });
  }
  public get_fas_cbs_fetch_data(params,recon_type,value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/cbs_data_count" + params+"&value="+value+"&recon_type="+recon_type, {
      headers: headers,
    });
  }
  public dynamicheaderfetchdata(head): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/cbs_wisefine_template" +"?temp_name=" + head, {
      headers: headers,
    });
  }
  public Matchingcbsdata(params,recon_type,value,data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/fetch_cbs_match" + params+"&value="+value+"&recon_type="+recon_type,data, {
      headers: headers,
    });
  }
    public editfastagnumber(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    let new_data = {"data": data}
    return this.http.post<any>(reconurl + "reconserv/fetch_fas_match", new_data, {
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
      reconurl +
        "reconserv/ARS_runprocess?date=" +
        param.date +
        "&gl_no=" +
        param.gl_no +
        "&branch_code=" +
        param.branch_code +
        "&id1=" +
        param.id1 +
        "&id2=" +
        param.id2+
        "&value="+
        param.value+
        "&multi_gl="+param.multi_gl+"&comp_gl="+param.comp_gl+"&temp_name="+param.temp_name+ "&account="+ param.account+"&recon_type="+param.recon_type,
      { headers: headers }
    );
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
    return this.http.post<any>(reconurl + "reconserv/ARS_CBS_Upload_excel", formData, {
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
    return this.http.post<any>(reconurl + "reconserv/ARS_wisefin_Upload_excel", formData, {
      headers: headers,
    });
  }
  
  public integrityUnmatchreportdownload
  (
    iDate,
  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      reconurl +
        "reconserv/ars_report_download?date=" +
        iDate,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public reportdownload(
    iDate,
    branch_codeid,
    glcode_id,
    action,value
  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      reconurl +
        "reconserv/ARS_Untag_report?date=" +
        iDate +
        "&gl_no=" +
        glcode_id +
        "&branch_code=" +
        branch_codeid +
        "&action=" +
        action+"&value="+value,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public getccscroll(glcode_id,id,value,recon_id,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/buisness_cost_drodown?gl_no="+glcode_id+"&page="+page+"&bs_id="+id+ "&name="+value +"&recon_type="+recon_id, {
      headers: headers,
    });
  }
  public getcc(glcode_id,id,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/buisness_cost_drodown?gl_no="+glcode_id+"&page="+page+"&bs_id="+id, {
      headers: headers,
    });
  } 
  public getbsscroll(gl_codeid,value,recon_id,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/buisness_cost_drodown?gl_no="+gl_codeid+"&page="+page+"&name="+value+"&recon_type="+recon_id, {
      headers: headers,
    });
  }
  public getbs(gl_codeid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/buisness_cost_drodown?gl_no="+gl_codeid, {
      headers: headers,
    });
  }
  public getsubCategoryListScroll(glcode_id,id,value,recon_id,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/category_dropdown?gl_no="+glcode_id+"&page="+page+"&category_id="+id+ "&category_name="+value+"recon_type="+recon_id, {
      headers: headers,
    });
  } 
  public getSubCategory(glcode_id,id,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/category_dropdown?gl_no="+glcode_id+"&page="+page+"&category_id="+id, {
      headers: headers,
    });
  } 
  public getCategoryListScroll(glcode_id,value,recon_id,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/category_dropdown?gl_no="+glcode_id+"&page="+page+"&category_name="+value+"recon_type="+recon_id, {
      headers: headers,
    });
  } 
  public getCategoryList(gl_codeid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/category_dropdown?gl_no="+gl_codeid, {
      headers: headers,
    });
  }
  public getClosedRecordcbs(page,date,gl_codeid,branch_codeid,type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/ars_close_lineitem?date="+date+"&gl_no="+gl_codeid+ "&branch_code="+branch_codeid+"&type="+type+"&page="+page, {
      headers: headers,
    });
  }
  public getClosedRecordfas(page,date,gl_codeid,branch_codeid,type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/ars_close_lineitem?date="+date+"&gl_no="+gl_codeid+ "&branch_code="+branch_codeid+"&type="+type+"&page="+page, {
      headers: headers,
    });
  }
  public closeData(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/ars_close_lineitem", data, {
      headers: headers,
    });
  }
  public run_process(date,gl_code,brachcode,value,temp_name,multi_gl,comparegl,recon_id ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/ARS_Upload_excel?gl_no="+ gl_code + "&date=" + date +"&branch_code="+ brachcode + "&value=" + value +"&temp_name="+temp_name +"&multi_gl="+multi_gl+'&comp_gl='+comparegl+'&recon_type='+recon_id,  {
      headers: headers,
    });
  }
  public deleteFileData(id,date,type,status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/ars_status_modify?id="+id+ "&date="+date+"&type="+type+"&status="+status, {
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
      reconurl + "reconserv/ars_view_s3_excel_download?id=" + id,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public viewData(date,gl_code,brachcode,value,history,recon_id,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/ars_process_status?gl_code="+gl_code + "&date=" + date +"&branch_code="+ brachcode +"&value="+value+"&history="+history +'&recon_type='+recon_id+ "&page="+page, {
      headers: headers,
    });
  }
  public newActionSave(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/ars_action_save", data, {
      headers: headers,
    });
  }
  public actionRefresh(id, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.delete<any>(reconurl + "reconserv/ars_action_save?id=" + id +"&type=" +type, {
      headers: headers,
    });
  }
  public overallmatech(iDate, glcode_id, branch_codeid,externalvalue,id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      reconurl +
        "reconserv/ARS_Manual_Match_report?date=" +
        iDate +
        "&gl_no=" +
        glcode_id +
        "&branch_code=" +
        branch_codeid +
        "&type=" +
        "6"+"&value="+externalvalue+
        "&id="+ id,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public overallmatechs(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      reconurl +
        "reconserv/ars_view_s3_excel_download?id="+id,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public autofetchDownload(body): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      reconurl +
        "reconserv/auto_fetch", body,
      { headers: headers }
    );
  }
  public manualreportdownload(
    fasfromdate_date,
    fasenddate_date,
    glcode_id,
    branch_codeid,
    iDate,externalvalue,
  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      reconurl +
        "reconserv/ARS_Manual_Match_report?from_date=" +
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
        iDate+"&value="+externalvalue,
      { headers: headers, responseType: "blob" as "json" }
    );
  }
  public submitcompare(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/ARS_action_compare", data, {
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
      reconurl + "reconserv/template_download?type=" + data,
      { headers: headers, responseType: "arraybuffer" as "json" }
    );
  }
  public arssummarydata(params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(reconurl + "reconserv/integrity_unmatch" + params, {
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
      reconurl + "reconserv/ars_unmatch_record?date=" + date,
      { headers: headers }
    );
  }
  public MatchingData(params,recon_type,value,data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(reconurl + "reconserv/fetch_fas_match" + params + "&value="+value+'&recon_type='+recon_type,data, {
      headers: headers,
    });
  }

  // public resetMatchingData(params,value,recon_type,data): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   const headers = { Authorization: "Token " + token };
  //   return this.http.post<any>(reconurl + "reconserv/fetch_fas_match" + params+ "&value="+value+'&recon_type='+recon_type ,data, {
  //     headers: headers,
  //   });
  // }

  public getarsbranchname(date, glcode): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      reconurl + "reconserv/ars_unmatch_record?date=" + date + "&gl_no=" + glcode,
      { headers: headers }
    );
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
      reconurl + "reconserv/manual_knockoff?action=" + id,
      data,
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
  return this.http.post<any>(reconurl + "reconserv/ledger_scheduler", formData, {
    headers: headers,
  });
}
public schedulerStatus(branch): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    reconurl + "reconserv/scheduler_status_get?branch_code=" + branch,
    { headers: headers }
  );
}
public purgeStmtServ(data): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  // let vals = "statement";
  const headers = { Authorization: "Token " + token };
  // return this.http.get<any>(brsurl + "brsserv/auto_knockoff?page="+page+"&"+"ledger_account_id=1"
  // +"&"+"statement_account_id=1", { 'headers': headers })
  return this.http.post<any>(reconurl + "reconserv/purge", data, {
    headers: headers,
  });
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
  return this.http.post<any>(reconurl + "reconserv/purge", data, {
    headers: headers,
  });
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
    reconurl + "reconserv/knockoff_details?id=" + id + "&download=1",
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
    reconurl +
      "reconserv/report_download?account_id=" +
      id +
      "&brs_status=1&type=" +
      vals +
      "&branch_code=" +
      branch,
    { headers: headers, responseType: "blob" as "json" }
  );
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
    reconurl +
      "reconserv/report_download?account_id=" +
      id +
      "&brs_status=1&type=" +
      vals +
      "&branch_code=" +
      branch,
    { headers: headers, responseType: "blob" as "json" }
  );
}
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
  return this.http.post<any>(reconurl + "reconserv/manual_knockoff", data, {
    headers: headers,
  });
}
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
    reconurl + "reconserv/auto_knockoff_scheduler",
    data,
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
    reconurl +
      "reconserv/auto_knockoff?ledger_account_id=" +
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
public getStatementdata(id, page, branch): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    reconurl +
      "reconserv/statement?account_id=" +
      id +
      "&page=" +
      page +
      "&branch_code=" +
      branch +
      "&brs_status=1",
    { headers: headers }
  );
}
public getLedgerdata(id, page, branch): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    reconurl +
      "reconserv/ledger?account_id=" +
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

public getNtemplates(page): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(reconurl + "reconserv/wisefin_template?page=" + page, {
    headers: headers,
  });
}
// public getaccountdata(page): Observable<any> {
//   this.reset();
//   const getToken = localStorage.getItem("sessionData");
//   let tokenValue = JSON.parse(getToken);
//   let token = tokenValue.token;
//   const headers = { Authorization: "Token " + token };
//   return this.http.get<any>(reconurl + "brsserv/account_master?page=" + page, {
//     headers: headers,
//   });
// }
public getActionData1(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(reconurl + "reconserv/ARS_Dropdown", {
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
    reconurl + "reconserv/cbs_template?page=" + page,
    { headers: headers }
  );
}
public getemployeesdetails(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(reconurl + "taserv/emp_details_get", {
    headers: headers,
  });
}
public inputdata(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    reconurl + 'reconserv/upload_type',{ headers: headers}
  );
}
public svae_inegrity(data): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { Authorization: "Token " + token };
  return this.http.post<any>(
    reconurl + "reconserv/multi_integrity_uploads",data,{ headers: headers }
  );
}
public inter_file_statuschange(id,status): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { Authorization: "Token " + token };
  return this.http.delete<any>(
    reconurl + 'reconserv/multi_integrity_uploads?id='+id+'&status='+status,{ headers: headers}
  );
}
public inter_file_summary(page,params): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    reconurl + 'reconserv/multi_integrity_uploads?page='+page+params,{ headers: headers}
  );
}
public Addreport(data): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { Authorization: "Token " + token };
  return this.http.post<any>(
    reconurl + "reconserv/customize_report",data,{ headers: headers }
  );
}
public defaultorcustomize(data): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { Authorization: "Token " + token };
  return this.http.post<any>(
    reconurl + "reconserv/report_type",data,{ headers: headers }
  );
}
public deletereconreport(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { Authorization: "Token " + token };
  return this.http.delete<any>(
    reconurl + 'reconserv/customize_report?id='+id,{ headers: headers}
  );
}
public statement_download(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    reconurl +
      "reconserv/report_type?id="+id,
    { headers: headers, responseType: "blob" as "json" }
  );
}

public glUploadSchedule1(CreateList, id, files) {
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
  // formData.append("file", files);
  files.forEach((fileObj, index) => {
    formData.append("file", fileObj);
  });
  const headers = { Authorization: "Token " + token };
  console.log(formData);
  return this.http.post<any>(reconurl + "reconserv/ARS_wisefin_Upload_excel", formData, {
    headers: headers,
  });
}

public bankstatementUplaodSchedule2(id, CreateList, files) {
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
  // formData.append("file", files);
  files.forEach((fileObj, index) => {
    formData.append("file", fileObj);
  });
  const headers = { Authorization: "Token " + token };
  console.log(formData);
  return this.http.post<any>(reconurl + "reconserv/ARS_CBS_Upload_excel", formData, {
    headers: headers,
  });
}
public matchandunmatch_api(data): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { Authorization: "Token " + token };
  return this.http.post<any>(
    reconurl + "reconserv/match_column",data,{ headers: headers }
  );
}
public submit_template_name(data) {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.post<any>(reconurl + "reconserv/report_column", data, {
    headers: headers,
  });
}
public recon_report_template(data) {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.post<any>(reconurl + "reconserv/template_column", data, {
    headers: headers,
  });
}
public consolidate_file_upload(data, files) {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  let json = Object.assign({}, data);
  let formData = new FormData();
  formData.append("data", JSON.stringify(json));
  files.forEach((fileObj, index) => {
    formData.append("file", fileObj);
  });
  const headers = { Authorization: "Token " + token };
  console.log(formData);
  return this.http.post<any>(reconurl + "reconserv/cons_data", formData, {
    headers: headers,
  });
}
public download_consolidate(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    reconurl +
      "reconserv/consolidate_download?id="+id,
    { headers: headers, responseType: "blob" as "json" }
  );
}
public download_recon_process(file,files,form_value): Observable<any> {
  console.log("formvalue",form_value)
  this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;   
    let formData = new FormData();   
    let form={"temp_name":form_value?.template_name?.template_name,"threshold":form_value?.description}
     formData.append("data", JSON.stringify(form)); 
    formData.append('file1', file);
    formData.append('file2', files);
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(reconurl + 'brsserv/recon_common', formData, { headers, responseType: "blob" as "json" });
}
}
