import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { typeSourceSpan } from '@angular/compiler';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
// const url = environment.pprURL  
const url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class DssService {
  idleState = 'Not started.';
  timedOut = false;
  pprgetjsondata: any;
 

  constructor(private idle: Idle, private http: HttpClient,private spinner:NgxSpinnerService) { }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  
  public dss_report(dss_data): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let dss_datas=dss_data
    console.log("headgrp_data=>",dss_datas)
    return this.http.post<any>(url + "dsserv/dssdate_level_list",dss_datas, { 'headers': headers })
  }
  public dss_report_profitorloss(dss_data): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let dss_datas=dss_data
    console.log("headgrp_data=>",dss_datas)
    return this.http.post<any>(url + "dsserv/dss_profitorloss_list",dss_datas, { 'headers': headers })
  }
  public dss_average(dss_average): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let dss_datas=dss_average
    console.log("headgrp_data=>",dss_datas)
    return this.http.post<any>(url + "dsserv/dss_average_list",dss_average, { 'headers': headers })
  }
  public dss_overall(overall_view): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "dsserv/overall_dssdate_level_list",overall_view, { 'headers': headers })
  }
  dssupload(file_uplode):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formdata=new FormData()
    formdata.append("file", file_uplode);

    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.post(url + 'dsserv/dss_upload',formdata,{ 'headers': header})
  }
  // source
  public deletesource(query,status): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "dsserv/modify_source_status?query=" +query+ "&status="+status,{}, { 'headers': headers })
  }
  public deletehead(query,status): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "dsserv/modify_status_edit?query=" +query+ "&status="+status,{}, { 'headers': headers })
  }
  public deletesubgrp(query,status): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "dsserv/modify_subgroup_status?query=" +query+ "&status="+status,{}, { 'headers': headers })
  }
  public deletegl(query,status): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "dsserv/modify_glsubgroup_status?query=" +query+ "&status="+status,{}, { 'headers': headers })
  }
  public set_pprsources(sources): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let source_data=sources
    // return this.http.post<any>(url + "dsserv/income_header_fetch?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "dsserv/set_pprsources",source_data, { 'headers': headers })
  }
  


// gl-subgroup
  public summary_glsubgrp_view(subgrp,pagenumber): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let subgrp_data=subgrp
    console.log("headgrp_data=>",subgrp_data)
    return this.http.post<any>(url + "dsserv/ppr_gl_subgrp_list?page="+pagenumber,subgrp_data, { 'headers': headers })
  }

  public get_glsubgrp_dropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'dsserv/ppr_glsubgrps_dropdown?query='+query+'&page='+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public get_subgrp_dropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'dsserv/ppr_subgrps_dropdown?query='+query+'&page='+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public set_gl_subgroup(set_glsubgrp): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let gl_sub_grp=set_glsubgrp
    console.log("headgrp_data=>",gl_sub_grp)
    return this.http.post<any>(url + "dsserv/set_gl_subgroup",gl_sub_grp, { 'headers': headers })
  }

// Head-Group
  public set_headgrp(headgrp): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let headgrp_data=headgrp
    console.log("headgrp_data=>",headgrp_data)
    return this.http.post<any>(url + "dsserv/set_head_groups",headgrp_data, { 'headers': headers })
  }
  public get_source_dropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'dsserv/ppr_source_dropdown?query='+query+'&page='+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public summary_headgrp_view(headgrp,pagenumber,pageSize): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let headgrp_data=headgrp
    console.log("headgrp_data=>",headgrp_data)
    return this.http.post<any>(url + "dsserv/ppr_headgrps_list?page="+pagenumber,headgrp_data, { 'headers': headers })
  }
  public get_headgrp_dropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'dsserv/ppr_headgrps_dropdown?query='+query+'&page='+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
// Source
  public summary_pprsources_view(sources,pagenumber,pageSize): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let source_data=sources
    // return this.http.post<any>(url + "dsserv/income_header_fetch?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "dsserv/pprsources_list?page="+pagenumber,source_data, { 'headers': headers })
  }
  // sub-group
  public getpprbranchdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // let urlvalue = url + 'usrserv/search_employeebranch?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'dsserv/budget_employeebranch?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public summary_subgrp_view(subgrp,pagenumber): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let subgrp_data=subgrp
    console.log("headgrp_data=>",subgrp_data)
    return this.http.post<any>(url + "dsserv/ppr_subgrps_list?page="+pagenumber,subgrp_data, { 'headers': headers })
  }
  public set_subgrp(subgrp): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let subgrp_data=subgrp
    console.log("headgrp_data=>",subgrp_data)
    return this.http.post<any>(url + "dsserv/set_sub_groups",subgrp_data, { 'headers': headers })
  }

  public get_dss_exception(date){
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let urlvalue=url + "dsserv/dssdate_exception_list?date="+date;
    this.spinner.show()
    return this.http.get<any>(urlvalue, { headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token) }).pipe(finalize(()=>this.spinner.hide()))
  }
  public dss_exception_download(date){
    this.reset();
    
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let urlvalue=url + "dsserv/dssdate_exception_download?date="+date;
    this.spinner.show()
    return this.http.get<any>(urlvalue, { headers , responseType: 'blob' as 'json' }).pipe(
      finalize(()=>this.spinner.hide()
    ))
  }
  public dss_status_update(id,status){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.spinner.show()
    let urlvalue=url + "dsserv/edit_dss_exception?arr="+JSON.stringify(id)+"&status="+status;
    return this.http.get<any>(urlvalue, { headers }).pipe(
      finalize(()=>this.spinner.hide()
    ))
  }
  public getfinyeardropdown(query,pagenumber){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let urlvalue = url + "pprservice/fetch_finyear";
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set("Authorization", "Token " + token),
    });
  } 
 

  public get_business_dropdown(sector_id,query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // let urlvalue = pprurl + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/business_fetch?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public get_bs_dropdown(bscc_id,query,pagenumber) {
    this.reset();
    console.log(bscc_id)
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // let urlvalue = pprurl + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/bs_fetch?query=' + query+"&page="+pagenumber +"&business_id="+bscc_id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public get_product_search(query,pageNumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let urlvalue=masterurl+'mstserv/product_search?query='+query+'&page='+pageNumber;
    let urlvalue=url+'mstserv/create_bsproduct?query='+query+'&page='+pageNumber
    const headers = { 'Authorization': 'Token ' + token }
    
    
    return this.http.get(urlvalue, { 'headers': headers }
    )
  }

  public rm_client(type,query,asset_id,pagenumber): Observable<any>{
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let urlvalue=pprurl+'dsserv/asset_class?type='+type+'&query='+query+'&assettype_id='+asset_id+'&page='+pagenumber;
    let urlvalue
    if(type=="CLIENT"){
      urlvalue=url+'mstserv/create_client?status=1'+'&name='+query+'&page='+pagenumber;
    }else if(type=="RM"){
      urlvalue=url+'mstserv/rm_drop_down?query='+query+'&page='+pagenumber;
    }else if(type == 'Branch'){
      urlvalue=url+'usrserv/employeebranch?status=1'+'&name='+query+'&page='+pagenumber;
    }
    const headers = { 'Authorization': 'Token ' + token }
    
    
    return this.http.get(urlvalue, { 'headers': headers }
    )
  }

  public getpprbranchdropdownyear(query, Finyear, asset_id, pagenumber) {
    console.log("Page:",pagenumber)
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // let urlvalue = url + 'usrserv/search_employeebranch?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/budget_employeebranch?query=' + query+"&page="+pagenumber+"&finyear="+Finyear;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public activeclientsearch(from_month,to_month,finyear,pageNumber,pageSize,): Observable<any> {
    this.reset();
    console.log("pageNumber=>",pageNumber)
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const headers = { 'Authorization': 'Token ' + token }
    // this.pprgetjsondata=assectval
    let urlvalue=  url + 'dsserv/active_clint_report_sammary?from_month=' + from_month+"&to_month="+to_month+"&finyear="+finyear
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    })
    // return this.http.post<any>(pprurl + "dsserv/ppr_client_list",this.pprgetjsondata, { 'headers': headers })
  }
  // public activeclientsearchs(params): Observable<any> {
  //   this.reset();
  //   // console.log("pageNumber=>",pageNumber)
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   this.pprgetjsondata=params
  //   return this.http.post<any>(url + "dsserv/ppr_client_date",this.pprgetjsondata, { 'headers': headers })
  //   // return this.http.post<any>(pprurl + "dsserv/ppr_client_list",this.pprgetjsondata, { 'headers': headers })
  // }

  activeclientupload(file_uplode):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formdata=new FormData()
    formdata.append("file", file_uplode);

    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.post(url + 'dsserv/fileupload_acti_clients',formdata,{ 'headers': header})
  }

  incomeupload(file_uplode):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formdata=new FormData()
    formdata.append("file", file_uplode);

    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.post(url + 'pprservice/income_upload',formdata,{ 'headers': header})
  }

  expanseupload(file_uplode):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formdata=new FormData()
    formdata.append("file", file_uplode);

    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.post(url + 'pprservice/expense_overall_upload',formdata,{ 'headers': header})
  }

  public get_profitability_report(params) : Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    const income_expense_api=this.http.post<any>(url + "pprservice/subcatwise_expensegrp_list",params, { 'headers': headers })
    return income_expense_api;
  }

  public get_profitability_allocation(params) : Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    const income_expense_api=this.http.post<any>(url + "pprservice/level_core_get",params, { 'headers': headers })
    return income_expense_api;
  }

  public get_tax_expensegrp(params) : Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    const tax_expense_api=this.http.post<any>(url + "pprservice/subcatwise_tax_expensegrp_list",params, { 'headers': headers })
    return tax_expense_api;
  }
}