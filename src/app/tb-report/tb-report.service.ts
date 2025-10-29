import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

const url=environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class TbReportService {
  idleState = 'Not started.';
  timedOut = false;
  constructor( private idle: Idle, private http: HttpClient, ) {   }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getfinyeardropdown(query,pagenumber) {  
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token 
    let urlvalue = url + 'pprservice/fetch_finyear';    
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbranchdropdown(query,pagenumber,do_ids,branch_flag) {   
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);9
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue
    if(branch_flag==2){
       urlvalue = url + 'usrserv/search_employeebranch?query=' + query+"&page="+pagenumber;
    }else{
       urlvalue = url + 'reportserv/do_branch_search?query=' + query+"&page="+pagenumber +"&branch_code="+do_ids;
    }
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
 public Business_master_summary(param,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/pprbusiness_summary?page="+page,param, { 'headers': headers })
}
public label_master_summary(param,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/vertical_label_fetch?page="+page,param, { 'headers': headers })
}
public Mapping_master_summary(param,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/label_business_fetch?page="+page,param, { 'headers': headers })
}

public vert_report_summary(finyear,from_month,to_month,report_type,branch,amount,business,branch_flag,bs_id,cc_id) {   
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue = url + 'pprservice/roa_report?finyear='+finyear+'&from_month='+from_month+'&to_month='+to_month+'&report_type='+report_type +'&branch_code='+branch+'&div_amount='+amount+'&business_code='+business+'&branch_flag='+branch_flag+"&bs_id="+bs_id+"&cc_id="+cc_id;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

public gl_dd(glno,page) {   
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue = url + "mstserv/gl_search?glno="+glno+"&page="+page;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

public tb_gl_summary(param,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "reportserv/get_glwise_tbreport?page="+page,param, { 'headers': headers })
}

public tb_business_summary(param,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "reportserv/trialbal_view_sp",param, { 'headers': headers })
}



public tb_gl_child_summary(param,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "reportserv/fetch_bscc_tbglreport?page="+page,param, { 'headers': headers })
}

public getbusinessdropdown(query,pagenumber) {
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
  let urlvalue = url + 'pprservice/ppr_mstbusiness_segment?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

public tb_business_child_summary(param,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "reportserv/fetch_bscc_tbbizreport?page="+page,param, { 'headers': headers })
}

public tb_common_summary(param,flag,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "reportserv/separate_report?flag="+flag+"&page="+page,param, { 'headers': headers })
}

public tb_gl_master_api(query,page,flag,gl_bs){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue
  // if(gl_bs==="gl"){
  //    urlvalue = url + 'mstserv/apsubcat_summary?value=' + query+"&page="+page + "&flag="+flag;
  // }else{
   urlvalue = url + 'mstserv/apsubcat_summary?query=' + query+"&page="+page + "&flag="+flag;
  // }
  return this.http.get(urlvalue, {headers: new HttpHeaders().set('Authorization', 'Token ' + token)}
  )}

public getbusiness_dropdown(query,page,report_type){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'pprservice/pprbusiness_fetch?query=' + query+"&page="+page+"&report_type="+report_type;
  
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public label_create_edit(param){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/create_vertical_lable",param, { 'headers': headers })
}


public Business_create_edit(param){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/create_pprbusiness",param, { 'headers': headers })
}

public mapping_create_edit(param){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/create_label_business",param, { 'headers': headers })
}

public label_master_delete(id,status){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let statuss={
    "status":status
  }

  return this.http.post<any>(url + "pprservice/vertical_status_update?id="+id,statuss, { 'headers': headers })
}

public Business_master_delete(id,status){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let statuss={
    "status":status
  }

  return this.http.post<any>(url + "pprservice/pprbusiness_status_update?id="+id,statuss, { 'headers': headers })
}

public mapping_master_delete(id,status){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let statuss={
    "status":status
  }

  return this.http.post<any>(url + "pprservice/label_business_update?id="+id,statuss, { 'headers': headers })
}

ppr_report_label_summary(quary,status,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    url + "pprservice/allocationlevel?page="+page+"&query="+quary+"&status="+status ,{ headers: headers }      
  );
}

public User_Branch(){  
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    url + "usrserv/user_branch" ,{ headers: headers }      
  );
}

public User_Branch_DO(branch_code){  
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    url + "usrserv/get_empbranch_list?co_branch_code="+branch_code ,{ headers: headers }      
  );
}
public branch_product_api(){  
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    url + "usrserv/get_empbranch_list?" ,{ headers: headers }      
  );
}
  public employeeapi_dd(id,query,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'usrserv/emp_from_dept/'+id+'?'+'query='+query+'&page=' +page, { 'headers': headers })
  }
   public fileuploadsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'usrserv/emp_from_dept/', { 'headers': headers })
  }
public getbranch_do_dropdown(query,page){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);9
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'reportserv/do_branch_search?query=' + query+"&page="+page;
  return this.http.get(urlvalue, {headers: new HttpHeaders().set('Authorization', 'Token ' + token)})
}

public getbsdropdown(mstbusiness_id,query,pagenumber) {
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'pprservice/ppr_bs?query=' + query+"&page="+pagenumber+"&mstbusinessid="+mstbusiness_id;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

public getccdropdown(business_id,query,pagenumber) {
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'pprservice/ppr_cc?query=' + query+"&page="+pagenumber+"&businessid="+business_id;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

public Roa_manual_summary_api(param,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/roa_manualentry_fetch?page="+page,param, { 'headers': headers })
}

  public getlabeldropdown(query,page){
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/ppr_bs?query=' + query+"&page="+page;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public roa_manual_delete(id){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "pprservice/roa_manualentry_del/"+id, { 'headers': headers })
  }

  public roa_manual_create_edit(param){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "pprservice/roa_manualentry_create",param, { 'headers': headers })
  }

public backeend_download(param){
  // const getToken = localStorage.getItem("sessionData");
  // let tokenValue = JSON.parse(getToken);
  // let token = tokenValue.token
  // const headers = { 'Authorization': 'Token ' + token }
  // return this.http.post<any>(url + "reportserv/generate_glbrchwise_filedwnld",param, { 'headers': headers })
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let urlvalue
  urlvalue =url +'reportserv/generate_glbrchwise_filedwnld'
  return this.http.post(urlvalue,param, { 'headers' :headers })
}

public tbdoc_summary(summary,page){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);9
  let token = tokenValue.token
  let urlvalue = url + 'reportserv/tbdoc_summary?status='+summary.status+'&created_date='+summary.created_date+'&filename='+summary.filename+'&page='+page;
  return this.http.get(urlvalue, {headers: new HttpHeaders().set('Authorization', 'Token ' + token)})
}

public tb_File_download(param){
  this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      const headers = { 'Authorization': 'Token ' + token }
      let urlvalue=url+"reportserv/download_tbfile?gen_key="+param
      return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' }
      )
}

public roa_summary(finyear,from_month,to_month,report_type,branch,amount,business,branch_flag,bs_id,cc_id) {   
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let urlvalue = url + 'pprservice/roa_fetch?finyear='+finyear+'&from_month='+from_month+'&to_month='+to_month+'&report_type='+report_type +'&branch_code='+branch+'&div_amount='+amount+'&business_code='+business+'&branch_flag='+branch_flag+"&bs_id="+bs_id+"&cc_id="+cc_id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public top_six_buz(finyear,from_month,to_month,branch,amount,business,branch_flag) {   
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let urlvalue = url + 'pprservice/dashboard_fetch?finyear='+finyear+'&from_month='+from_month+'&to_month='+to_month+'&branch_code='+branch+'&div_amount='+amount+'&business_code='+business+'&flag='+branch_flag;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public level_shown(finyear,from_month,to_month,branch,amount,business,branch_flag) {   
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let urlvalue = url + 'pprservice/dashboard_fetch?finyear='+finyear+'&from_month='+from_month+'&to_month='+to_month+'&branch_code='+branch+'&div_amount='+amount+'&label_code='+business+'&flag='+branch_flag;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public tb_file_roa(file){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "pprservice/roa_assetentry_upload",file, { 'headers': headers })
  }

  public get_to_month_fetch(finyear){
    const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);9
  let token = tokenValue.token
  let urlvalue = url + 'pprservice/eom_fetch_tomonth?finyear='+finyear
  return this.http.get(urlvalue, {headers: new HttpHeaders().set('Authorization', 'Token ' + token)})
  }

  public roa_ppr_run_trigger(params){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "pprservice/roa_ppr_trigger",params, { 'headers': headers })
  }

  public roa_run_summary(status,page,finyear){
    const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);9
  let token = tokenValue.token
  let urlvalue = url + 'pprservice/pprscheduler_summary?reftype='+45+'&status='+status+'&finyear='+finyear+'&page='+page
  return this.http.get(urlvalue, {headers: new HttpHeaders().set('Authorization', 'Token ' + token)})
  }

  public gl_statement(params,page){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "pprservice/pprdata_fetch?page="+page+"&download=0",params, { 'headers': headers })
  }

  public gl_statement_download(params){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "pprservice/pprdata_fetch?download=1",params, { 'headers': headers })
  }

}
