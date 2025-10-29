import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { typeSourceSpan } from '@angular/compiler';

const url = environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class PprService {
  idleState = 'Not started.';
  timedOut = false;
  constructor(private idle: Idle, private http: HttpClient) { }
  pprgetjsondata:any;

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getState(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "mstserv/state", { 'headers': headers })
  }

  public getPprsummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/new_expensegrp_list",this.pprgetjsondata, { 'headers': headers })
  }
  public getpprsummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/new_expensegrp_masterlist",this.pprgetjsondata, { 'headers': headers })
  }

  public getsupplieramountdetails(i,type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    if(i==2){
      return this.http.post<any>(url + "pprservice/ppr_suppliergrp?flag=E",this.pprgetjsondata, { 'headers': headers })
    }else{
      return this.http.post<any>(url + "pprservice/ppr_suppliergrp",this.pprgetjsondata, { 'headers': headers })
    }
    
  }
  public getccbsdetails(type,pageNumber,pageSize): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/ppr_cccbs?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
  }
  public getecfdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/ppr_ecf",this.pprgetjsondata, { 'headers': headers })
  }
  public new_expense_list(type,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/new_expense_list?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
  }
  public new_expenselist(i,type,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // if(i==2){
      // return this.http.post<any>(url + "pprservice/subcatwise_expenselist",this.pprgetjsondata, { 'headers': headers })
      return this.http.post<any>(url + "pprservice/subcatwise_expenselist_dup",this.pprgetjsondata, { 'headers': headers })

      
      // return this.http.post<any>(url + "pprservice/new_expense_masterlist?page="+pageNumber+"&flag="+'E',this.pprgetjsondata, { 'headers': headers })
    // }else if(i==5 || i==6 || i==8 || i==10){
    //   return this.http.post<any>(url + "pprservice/od_allocation_expenselist",this.pprgetjsondata, { 'headers': headers })
    // }else{
    //   return this.http.post<any>(url + "pprservice/new_expense_masterlist?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
    // }
  }
  public new_ppr_expenselist(type,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/ppr_expense_list",this.pprgetjsondata, { 'headers': headers })
  }
  public new_ppr_cat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/ppr_category_list",this.pprgetjsondata, { 'headers': headers })
  }
  public new_cat_list(i,type,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // if(i==2){
      // return this.http.post<any>(url + "pprservice/subcatwise_catlist?flag=E",this.pprgetjsondata, { 'headers': headers })
      // return this.http.post<any>(url + "pprservice/ppr_cat_list?flag=E",this.pprgetjsondata, { 'headers': headers })
      // return this.http.post<any>(url + "pprservice/subcatwise_catlist?page="+page,this.pprgetjsondata, { 'headers': headers })
      return this.http.post<any>(url + "pprservice/subcatwise_catlist_dup?page="+page,this.pprgetjsondata, { 'headers': headers })

      
    // }else if(i==5 || i==6 || i==8 || i==10){
    //   return this.http.post<any>(url + "pprservice/od_allocation_catlist",this.pprgetjsondata, { 'headers': headers })
    // }else{
    // return this.http.post<any>(url + "pprservice/ppr_cat_list",this.pprgetjsondata, { 'headers': headers })
    // }
  }
  public new_subcat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/new_subcat_list",this.pprgetjsondata, { 'headers': headers })
  }
  public new_ppr_subcatlist(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/ppr_subcategory_list",this.pprgetjsondata, { 'headers': headers })
  }
  public new_subcatlist(i,type,pagenumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // if(i==2){
      // return this.http.post<any>(url + "pprservice/ppr_subcat_list?page="+pagenumber,this.pprgetjsondata, { 'headers': headers })
      // return this.http.post<any>(url + "pprservice/subcatwise_subcatlist?page="+pagenumber,this.pprgetjsondata, { 'headers': headers })
      return this.http.post<any>(url + "pprservice/subcatwise_subcatlist_dup?page="+pagenumber,this.pprgetjsondata, { 'headers': headers })

      
    // }else if(i==5 || i==6 || i==8 || i==10){
    //   return this.http.post<any>(url + "pprservice/od_allocation_subcatlist?page="+pagenumber,this.pprgetjsondata, { 'headers': headers })
    // }else{
    //   return this.http.post<any>(url + "pprservice/ppr_subcat_list?page="+pagenumber,this.pprgetjsondata, { 'headers': headers })
    // }
    
  }
  public getcostcenter(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(url + "mstserv/state?page=" + pageNumber, { 'headers': headers })
  }
  public getbranchdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'usrserv/search_employeebranch?query=' + query+"&page="+pagenumber;
    // let urlvalue = url + 'pprservice/budget_employeebranch?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
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
    let urlvalue = url + 'pprservice/budget_employeebranch?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getpprbranchdropdownyear(query,pagenumber, Finyear) {
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
  public getbsdropdown(mstbusiness_id,query,pagenumber) {
    this.reset();
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

  public getbusinessdropdown(sector_id,query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/ppr_mstbusiness_segment?query=' + query+"&page="+pagenumber+"&sectorid="+sector_id;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbsbudgetdropdownyear(mstbusiness_id,branchid,branchcode,query,pagenumber, Finyear) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    if(branchid==undefined||branchid==null){
      branchid=0
    }
    if(branchcode==undefined||branchcode==null){
      branchcode=0
    }
    let urlvalue = url + 'pprservice/ppr_bs?query=' + query+"&page="+pagenumber+"&mstbusinessid="+mstbusiness_id+"&budget_builder=True"+"&branchid="+branchid+"&branchcode="+branchcode+ "&finyear="+ Finyear;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbsbudgetdropdown(mstbusiness_id,branchid,branchcode,query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    if(branchid==undefined||branchid==null){
      branchid=0
    }
    if(branchcode==undefined||branchcode==null){
      branchcode=0
    }
    let urlvalue = url + 'pprservice/ppr_bs?query=' + query+"&page="+pagenumber+"&mstbusinessid="+mstbusiness_id+"&budget_builder=True"+"&branchid="+branchid+"&branchcode="+branchcode;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbusinessbudgetdropdownyear(sector_id,branchid,branchcode,query,pagenumber,Finyear) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    if(branchid==undefined||branchid==null){
      branchid=0
    }
    if(branchcode==undefined||branchcode==null){
      branchcode=0
    }
    // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/ppr_mstbusiness_segment?query=' + query+"&page="+pagenumber+"&sectorid="+sector_id+"&budget_builder=True"+"&branchid="+branchid+"&branchcode="+branchcode+"&finyear="+Finyear;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbusinessbudgetdropdown(sector_id,branchid,branchcode,query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    if(branchid==undefined||branchid==null){
      branchid=0
    }
    if(branchcode==undefined||branchcode==null){
      branchcode=0
    }
    // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
    let urlvalue = url + 'pprservice/ppr_mstbusiness_segment?query=' + query+"&page="+pagenumber+"&sectorid="+sector_id+"&budget_builder=True"+"&branchid="+branchid+"&branchcode="+branchcode;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public allocationFormdroupdown(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    var changeValue = {
     "name":type
    }
    // console.log("change",changeValue)
    console.log("changeValue",changeValue.name)
    if(changeValue.name===null){
      changeValue = {
        "name":''
       }
    }
    console.log("changeValue",changeValue.name)

    let Json = Object.assign({}, changeValue)
    
    return this.http.post<any>(url + "usrserv/search_ccbs",JSON.stringify(Json), { 'headers': headers })
  }

  public bsccToDroupdown(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // this.pprgetjsondata=type
    
    var changeValue = {
      
     "name":type
    }
    if(changeValue.name===null){
      changeValue = {
        
        "name":''
       }
    }
    // console.log("change",changeValue)
  
    let Json = Object.assign({}, changeValue)
    
    return this.http.post<any>(url + "usrserv/search_ccbs",JSON.stringify(Json), { 'headers': headers })
  }

  public getsupplierdetails(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    this.pprgetjsondata=data
    let urlvalue = url + 'pprservice/ppr_supplier?' +"page="+1+"&apexpense_id="+data.apexpense_id
    +"&apsubcat_id="+data.apsubcat_id+"&transactionmonth="+data.transactionmonth
    +"&quarter="+data.quarter+"&masterbusinesssegment_name="+data.masterbusinesssegment_name
    +"&sectorname="+data.sectorname+"&apinvoicesupplier_id="+data.apinvoicesupplier_id
    +"&yearterm="+data.yearterm+"&finyear="+data.finyear+"&bs_name="+data.bs_name+"&cc_name="+data.cc_name
    +"&divAmount="+data.divAmount;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
    // return this.http.post<any>(url + "pprservice/ppr_supplier/1",this.pprgetjsondata, { 'headers': headers })
  }
  public getsupplierdetail(data,pageNumber,pageSize): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
            params = params.append('page', pageNumber.toString());
            params = params.append('pageSize', pageSize.toString());
    this.pprgetjsondata=data
    let urlvalue = url + 'pprservice/ppr_supplier?' +"page="+pageNumber+"&apexpense_id="+data.apexpense_id
    +"&apsubcat_id="+data.apsubcat_id+"&transactionmonth="+data.transactionmonth
    +"&quarter="+data.quarter+"&masterbusinesssegment_name="+data.masterbusinesssegment_name
    +"&sectorname="+data.sectorname+"&apinvoicesupplier_id="+data.apinvoicesupplier_id
    +"&yearterm="+data.yearterm+"&finyear="+data.finyear+"&bs_name="+data.bs_name+"&cc_name="+data.cc_name
    +"&divAmount="+data.divAmount;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
    // return this.http.post<any>(url + "pprservice/ppr_supplier/1",this.pprgetjsondata, { 'headers': headers })
  }
  public getexpensegrpdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'mstserv/expensegrp_search?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getccdropdown(business_id,query,pagenumber) {
    this.reset();
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

  public getsectordropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'mstserv/sector_search?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  
  public getfinyeardropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // finyear_search
    // let urlvalue = url + 'pprservice/budget_finyear_search?page='+pagenumber;
    // let urlvalue = url + 'pprservice/finyear_search';
    let urlvalue = url + 'pprservice/fetch_finyear';
    
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbbfinyeardropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    // finyear_search
    let urlvalue = url + 'pprservice/fetch_finyear';
    // let urlvalue = url + 'pprservice/finyear_search';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbudgetsummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // return this.http.post<any>(url + "pprservice/ppr_variance_expgrp?flag=E",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/ppr_variance_expgrp_list?flag="+this.pprgetjsondata.flag,this.pprgetjsondata, { 'headers': headers })
  } 
  public getbudgetsearchsummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // return this.http.post<any>(url + "pprservice/budget_new_expensegrp_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/overall_budget_expgroup_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public getbudgetapprovesummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_expgroup_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  } 
  public getbudgetcheckersummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_expgroup_list?pagequery=CHECKER",this.pprgetjsondata, { 'headers': headers })
  } 
  public getbudgetviewsummary(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_expgroup_list?pagequery=VIEWER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_builderexpense_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // return this.http.post<any>(url + "pprservice/budget_expense_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/ppr_variance_expense_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_variance_cat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // return this.http.post<any>(url + "pprservice/budget_expense_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/ppr_variance_cat_list",this.pprgetjsondata, { 'headers': headers })
  }
  public new_builderexpense_listsearch(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // return this.http.post<any>(url + "pprservice/budget_new_expense_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/overall_budget_exphead_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_builderexpense_view_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_exphead_list?pagequery=VIEWER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_builderexpense_checker_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_exphead_list?pagequery=CHECKER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_builderexpense_approve_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_exphead_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildersubcat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // return this.http.post<any>(url + "pprservice/budget_subcat_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/ppr_variance_subcat_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildercat_checker_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_cat_list?pagequery=CHECKER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildercat_approver_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_cat_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildercat_viewer_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_cat_list?pagequery=VIEWER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildercat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // return this.http.post<any>(url + "pprservice/budget_cat_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/overall_budget_cat_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public buildersubcat_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    // return this.http.post<any>(url + "pprservice/budget_new_subcat_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/overall_budget_subcat_list",this.pprgetjsondata, { 'headers': headers })
  } 

  public new_buildersubcat_approve_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_subcat_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildersubcat_checker_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_subcat_list?pagequery=CHECKER",this.pprgetjsondata, { 'headers': headers })
  } 
  public new_buildersubcat_view_list(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/overall_budget_subcat_list?pagequery=VIEWER",this.pprgetjsondata, { 'headers': headers })
  } 
  public variance_getsupplieramountdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/variance_suppliergrp_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  }
  public budget_getsupplieramountdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_suppliergrp_list",this.pprgetjsondata, { 'headers': headers })
  } 
  public budgetapprove_getsupplieramountdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_suppliergrp_list?pagequery=APPROVER",this.pprgetjsondata, { 'headers': headers })
  } 
  public budgetchecker_getsupplieramountdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_suppliergrp_list?pagequery=CHECKER",this.pprgetjsondata, { 'headers': headers })
  } 
  public budgetview_getsupplieramountdetails(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_suppliergrp_list?pagequery=VIEWER",this.pprgetjsondata, { 'headers': headers })
  }
  public getapproverdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'usrserv/searchemployee?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
    
  public set_budgetbuilder(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_builder_set",this.pprgetjsondata, { 'headers': headers })
  }  
  public budget_draft_set(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    console.log("s=>",this.pprgetjsondata)
    return this.http.post<any>(url + "pprservice/budget_draft_set",this.pprgetjsondata, { 'headers': headers })
  } 
  public budget_status_set(status,buget_data,type,remark): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=buget_data
    console.log("s=>",this.pprgetjsondata)
    return this.http.post<any>(url + "pprservice/budget_status_set?status="+status+'&level='+type+'&remark_val='+remark,this.pprgetjsondata,{ 'headers': headers })
  } 
  public set_Budgetbuilder(type,amountval_type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    console.log("s=>",this.pprgetjsondata)
    return this.http.post<any>(url + "pprservice/budget_builder_set?divAmount="+amountval_type,this.pprgetjsondata, { 'headers': headers })
  }  
  public set_Budgetbuilder_Approve(type,amountval_type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    return this.http.post<any>(url + "pprservice/budget_approver_set?divAmount="+amountval_type,this.pprgetjsondata, { 'headers': headers })
  }  

  public getallocationleveldropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/allocationlevel_search?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 

  public getallocationleveldcsdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/dcslevel_dropdown?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 

  public getcostdriverdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/costdriver_search?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 

  public getbsccdropdown(query,pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = url + 'pprservice/bsccmaping_search?query=' + query+"&page="+pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 
  public getcostallocationsummary(pagenumber,pageSize,srachid) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let params: any = new HttpParams();
    params = params.append('page', pagenumber.toString());
    params = params.append('pageSize', pageSize.toString());
    var urlvalue
    if(srachid==0){
      urlvalue = url + 'pprservice/allocationmeta?page='+ pagenumber;
    }else{
    urlvalue = url + 'pprservice/allocationmeta?frombscccode='+srachid +'&page='+ pagenumber;}
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 

  public set_allocationratio(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }   
      console.log("else")
    return this.http.post<any>(url + "pprservice/allocationmeta",value, { 'headers': headers })
  }  

  public getparticularallocation(type,allocation_id,year_trans,date_trans,pageNumber, pageSize) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    let urlvalue
    if(allocation_id==11){
    urlvalue=url+'pprservice/transaction_ratioallocation?type='+type+'&bs_id=65&cc_id=266'+'&transactionmonth='+date_trans+'&transactionyear='+year_trans + '&page=' + pageNumber +'&frombscccode='+allocation_id

    }
    if(allocation_id==18){
    urlvalue=url+'pprservice/transaction_ratioallocation?type='+type+'&bs_id=73&cc_id=331'+'&transactionmonth='+date_trans+'&transactionyear='+year_trans + '&page=' + pageNumber +'&frombscccode='+allocation_id

    }
    // let urlvalue = url + 'pprservice/allocation_fetch/0?frombscc='+allocation_id+'&month='+date_trans+'&year='+year_trans+'&type=Genrate';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public particularallocation(prokeyvalue){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    // let urlvalue = url + 'pprservice/allocation_fetch/0?frombscc=18&month=12&year=2021&type=Genrate';
    let urlvalue = url + 'pprservice/allocation_fetch/'+prokeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public allocationfrom_amountcal() {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/remsbased_allocation?type=otherthenrems&bs_code=73&cc_code=331&transactionmonth=10&transactionyear=2021';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public transfervalidation(year,month) {
    console.log("date",year,month)
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/remsbased_allocation?type=otherthenrems&bs_code=73&cc_code=331'+'&transactionmonth='+month +'&transactionyear='+year;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public allocationfrom_techAllocation() {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/tech_allocation?transactionmonth=10&transactionyear=2021';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public transferAllocation(year_trans,date_trans) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/tech_allocation?transactionmonth='+date_trans+'&transactionyear='+year_trans+'&bs_code=65&cc_code=266';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public allocationValue(Allocation,level_id,month,year): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let changeValue={
      "Allocation":Allocation
    }
    
    let Json = Object.assign({}, changeValue)
    // this.pprgetjsondata=typeco

    console.log("changeval=>",changeValue,Json)
    return this.http.post<any>(url + "pprservice/allocationtopp?level_id="+level_id+"&month="+month+"&year="+year,JSON.stringify(Json), { 'headers': headers })
  } 
  public getStatus(id_cost) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/inactive_allocation/'+id_cost;
    console.log("urlvalue=>",urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 
  public getpprdata_level(level) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(level.year_term=="Quarterly"){
      delete level['from_expense_month']
      delete level['to_expense_month']
    }
    // return this.http.post<any>(url + "pprservice/income_expgrp_list?flag=i",JSON.stringify(level), { 'headers': headers })
    return this.http.post<any>(url + "pprservice/subcatwise_incomegrp_list?exp_level=1",JSON.stringify(level), { 'headers': headers })
    // return this.http.post<any>(url + "pprservice/new_incomegrp_list?exp_level=0",JSON.stringify(level), { 'headers': headers })

} 
  public getdata_level(level_id,level,level_code) {
    console.log(level)
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
 if(level_code=="L12"){
  return this.http.post<any>(url + "pprservice/income_total_list_n5_subcatwise",level, { 'headers': headers })
 }else if( level_code=="L10"){
  return this.http.post<any>(url + "pprservice/income_total_list_n3_subcatwise",level, { 'headers': headers })
 }else if( level_code=="L13"){
  return this.http.post<any>(url + "pprservice/income_total_list_n4_subcatwise",level, { 'headers': headers })
 }else if( level_code=="L11"){
  return this.http.post<any>(url + "pprservice/income_total_list_n3_subcatwise",level, { 'headers': headers })
 }else if( level_code=="L9"){
  return this.http.post<any>(url + "pprservice/income_total_list_n2_subcatwise",level, { 'headers': headers })
 }else{ 
    // return this.http.post<any>(url + "pprservice/subcatwise_expensegrplist?exp_level="+level_id,JSON.stringify(level), { 'headers': headers })
    return this.http.post<any>(url + "pprservice/subcatwise_expensegrplist_dup?exp_level="+level_id,JSON.stringify(level), { 'headers': headers })
    
 } 
}
gettotal_level(i,total){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // return this.http.post<any>(url + "pprservice/income_total_list?flag=E",total, { 'headers': headers })
  return this.http.post<any>(url + "pprservice/income_total_list_n2_subcatwise",total, { 'headers': headers })
}
getafterallocation(total){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // return this.http.post<any>(url + "pprservice/income_total_list_n3",total, { 'headers': headers })
  return this.http.post<any>(url + "pprservice/income_total_list_n3_subcatwise",total, { 'headers': headers })
}
getbeforeallocation(total){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // return this.http.post<any>(url + "pprservice/income_total_list_n4",total, { 'headers': headers })
  return this.http.post<any>(url + "pprservice/income_total_list_n4_subcatwise",total, { 'headers': headers })
}
getbeforetax(total){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // return this.http.post<any>(url + "pprservice/income_total_list_n5",total, { 'headers': headers })
  return this.http.post<any>(url + "pprservice/income_total_list_n5_subcatwise",total, { 'headers': headers })
}
public getdata_level4(level){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/fas_level_four",JSON.stringify(level), { 'headers': headers })

}
public getdata_level4ab(level,levelid){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // if(levelid==4){
  //   return this.http.post<any>(url + "pprservice/subcatwise_expensegrplist?exp_level="+levelid,JSON.stringify(level), { 'headers': headers })
  //   return this.http.post<any>(url + "pprservice/subcatwise_expensegrplist?exp_level="+levelid,JSON.stringify(level), { 'headers': headers })
  //   return this.http.post<any>(url + "pprservice/new_fromallocation_list?expgrp_level="+levelid,JSON.stringify(level), { 'headers': headers })

  // }else if(levelid==5){
  //   return this.http.post<any>(url + "pprservice/fromallocation_list",JSON.stringify(level), { 'headers': headers })
  // }
  return this.http.post<any>(url + "pprservice/odre_allocation_expensegrplist?exp_level="+levelid,JSON.stringify(level), { 'headers': headers })
}
public fromallocation_list(level){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/fromallocation_list",JSON.stringify(level), { 'headers': headers })
  

}
public gettech(i,type): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  this.pprgetjsondata=type
  if(i==6){
    return this.http.post<any>(url + "pprservice/toallocation_list",this.pprgetjsondata, { 'headers': headers })
  }else if(i==4){
    return this.http.post<any>(url + "pprservice/new_toallocation_list?expgrp_level="+i,this.pprgetjsondata, { 'headers': headers })

  }  
}
public getincometotallist(level){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/income_total_list?flag=i",level, { 'headers': headers })

}
public getleveltwosummary(type): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  
  return this.http.post<any>(url + "pprservice/new_expensegrp_list",JSON.stringify(type), { 'headers': headers })
}
public expense_list(level_index,type,pageNumber): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  this.pprgetjsondata=type
  if(level_index==0){
    // return this.http.post<any>(url + "pprservice/ppr_expense_list?flag=i",this.pprgetjsondata, { 'headers': headers })
    // return this.http.post<any>(url + "pprservice/new_incomexpense_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/subcatwise_incomexpense_list",this.pprgetjsondata, { 'headers': headers })

  } if(level_index==1){
    // return this.http.post<any>(url + "pprservice/hr_head_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/subcatwise_hrexphead_list",this.pprgetjsondata, { 'headers': headers })
  }else{
    return this.http.post<any>(url + "pprservice/fas_expense_fetch",this.pprgetjsondata, { 'headers': headers })

  }
}
public subexpense_list(level_index,type,pageNumber): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  this.pprgetjsondata=type
  if(level_index==0){
    
    // return this.http.post<any>(url + "pprservice/ppr_subcategory_list?flag=i",this.pprgetjsondata, { 'headers': headers })
    // return this.http.post<any>(url + "pprservice/new_incomesubcat_list?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/subcatwise_incomesubcat_list?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })

  }else if(level_index==1){
    // return this.http.post<any>(url + "pprservice/hr_subcat_list?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/subcatwise_hrsubcat_list?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })

  }else if(level_index==2){
    return this.http.post<any>(url + "pprservice/ppr_subcat_list?page="+pageNumber,this.pprgetjsondata, { 'headers': headers })

  }else{
    return this.http.post<any>(url + "pprservice/fas_subcat_fetch",this.pprgetjsondata, { 'headers': headers })

  }
}
public category_list(leve_index,type,pageNumber): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  this.pprgetjsondata=type
  if(leve_index==0){
    // return this.http.post<any>(url + "pprservice/ppr_category_list?flag=i",this.pprgetjsondata, { 'headers': headers })
    // return this.http.post<any>(url + "pprservice/new_incomecat_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/subcatwise_incomecat_list",this.pprgetjsondata, { 'headers': headers })
  }if(leve_index==1){
    // return this.http.post<any>(url + "pprservice/hr_cat_list",this.pprgetjsondata, { 'headers': headers })
    return this.http.post<any>(url + "pprservice/subcatwise_hrcat_list",this.pprgetjsondata, { 'headers': headers })
  }else{
    return this.http.post<any>(url + "pprservice/fas_category_fetch",this.pprgetjsondata, { 'headers': headers })
  }
}
public ppr_supplier(page,supplier_value){
  var supplier={
    "apexpense_id": 21,
    "apsubcat_id": 2379,
    "masterbusinesssegment_name": "PBLG",
    "sectorname": "KVB SECTOR",
    "finyear": "FY20-21",
    "bs_name": "",
    "cc_name": ""
}
const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  
// var urlvalue = url + 'pprservice/ppr_supplier_dropdown';
// return this.http.post<any>(url + "pprservice/ppr_supplier_dropdown",supplier_value, { 'headers': headers })
return this.http.post<any>(url + "pprservice/ppr_supplier_dropdown",supplier_value, { 'headers': headers })
// return this.http.post<any>(url + "venserv/search_suppliername?sup_id=&name=a" { 'headers': headers })
// const getToken = localStorage.getItem("sessionData")
//     let tokenValue = JSON.parse(getToken);
//     let token = tokenValue.token
//     let urlvalue = url + "venserv/supplier_list?&page="+page;
//     // console.log("urlvalue=>",urlvalue)
//     return this.http.get(urlvalue, {
//       headers: new HttpHeaders()
//         .set('Authorization', 'Token ' + token)
//     }
//     )
    
}
public ppr_getall_supplier(page,query){
const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let urlvalue = url + "venserv/supplier_list?page="+page;
    // console.log("urlvalue=>",urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
}
public ppr_supplier_filter(val,page){
  var supplier={
    "apexpense_id": 21,
    "apsubcat_id": 2379,
    "masterbusinesssegment_name": "PBLG",
    "sectorname": "KVB SECTOR",
    "finyear": "FY20-21",
    "bs_name": "",
    "cc_name": ""
}
const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
// var urlvalue = url + 'pprservice/ppr_supplier_dropdown';
// return this.http.post<any>(url + "pprservice/ppr_supplier_dropdown",supplier_value, { 'headers': headers })
return this.http.post<any>(url + "pprservice/ppr_supplier_dropdown?query="+val,supplier, { 'headers': headers })

    
}
public allocation_values(allocation_name,year_trans,date_trans,allocation_id) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue
  // if (query === null) {
  //   query = "";
  //   console.log('calling empty');
  // }
  if(allocation_id==11){
   urlvalue = url + 'pprservice/transaction_ratioallocation?allocationto_ppr=Genrate&type='+allocation_name+'&bs_id=65&cc_id=266'+'&transactionmonth='+date_trans+'&transactionyear='+year_trans+'&frombscccode='+allocation_id;

  }
  if(allocation_id==18){
     urlvalue = url + 'pprservice/transaction_ratioallocation?allocationto_ppr=Genrate&type='+allocation_name+'&bs_id=73&cc_id=331'+'&transactionmonth='+date_trans+'&transactionyear='+year_trans+'&frombscccode='+allocation_id;

  }
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

// employee business mapping api's
public get_finyear(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null || query===undefined) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'usrserv/emp_bus_map_finyear?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public get_employee(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'usrserv/searchemployee?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

public get_business(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'usrserv/businesssegment?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

public getsummary(branch_id,chipSelectedid,finyearid,statusVal,branchsearchid,pageNumber,pageSize): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
 console.log("chipSelectedprodid=>",chipSelectedid)
 if (branch_id === null || branch_id==undefined ) {
  branch_id = "";
  console.log('calling empty');
}
if (chipSelectedid === null || chipSelectedid==undefined ) {
  chipSelectedid = "";
  console.log('calling empty');
}
if (finyearid === null || finyearid==undefined ) {
  finyearid = "";
  console.log('calling empty');
}
if (statusVal === null || statusVal==undefined ) {
  statusVal = "";
  console.log('calling empty');
}
if (branchsearchid === null || branchsearchid==undefined ) {
  branchsearchid = "";
  console.log('calling empty');
}
let params: any = new HttpParams();

params = params.append('page', pageNumber.toString());
params = params.append('pageSize', pageSize.toString());
//  let val=chipSelectedid
  let urlvalue = url + 'usrserv/emp_bus_map?bs_id='+branch_id+'&emp_id='+chipSelectedid+'&finyear='+finyearid+'&status='+statusVal+'&page='+pageNumber+'&branch='+branchsearchid;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
} 
public emp_bus(type,pageNumber): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  this.pprgetjsondata=type
  return this.http.post<any>(url + "usrserv/emp_bus_map",this.pprgetjsondata, { 'headers': headers })
}
public get_status(query) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'usrserv/get_emp_bus_map_status';
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )}

  public status_update(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(url + "usrserv/update_status_emp_bus_map",type, { 'headers': headers })
  }  
  public submit_subcat(supplier_value){
    
  const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
  // var urlvalue = url + 'pprservice/ppr_supplier_dropdown';
  return this.http.post<any>(url + "pprservice/budget_suppliergrp_list" ,supplier_value, { 'headers': headers })
  
      
  } 
  public status_filter() {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (query === null) {
    //   query = "";
    //   console.log('calling empty');
    // }
    let urlvalue = url + 'pprservice/budget_view_status';
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )}
    public budgetremarks(type): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      this.pprgetjsondata=type
      console.log(type)
      return this.http.post<any>(url + "pprservice/budget_remark",type, { 'headers': headers })
    }
    public getecf(type): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      this.pprgetjsondata=type
      console.log(type)
      

      return this.http.post<any>(url + "pprservice/ppr_ecf_filelist",type, { 'headers': headers })
    }
    public ecfdownload(filename,cr_no,invoiceheaderid,file_gid) {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      
      const headers = { 'Authorization': 'Token ' + token }
      // url +'docserv/document/download/Memo_118985?module=1'
      let urlvalue = url + 'pprservice/ppr_ecf_filedownload?filename='+filename+'&cr_no='+cr_no+'&file_gid='+file_gid+'&invoiceheaderid='+invoiceheaderid;
      
      

      
      return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' }
      )}
      public ppr_nac(time) {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let urlvalue=url+'pprservice/ppr_nac_set_single';
        
        
        
        return this.http.get(urlvalue, {
          headers: new HttpHeaders()
            .set('Authorization', 'Token ' + token)
        }
        )
      }
      public pprfileupdate(incomehr,finyear,sector,data): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        if(incomehr==0){
          return this.http.post<any>(url + 'pprservice/new_income?fin_year='+finyear+'&sector_id='+sector, data, { headers })
        }
        if(incomehr==1){
          return this.http.post<any>(url + 'pprservice/hr_upload?fin_year='+finyear+'&sector_id='+sector, data, { headers })
        }
      }
      public get_bs_dropdown(sector_id,query,pagenumber) {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        if (query === null) {
          query = "";
          console.log('calling empty');
        }
        // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
        let urlvalue = url + 'usrserv/searchbusinesssegment?query=' + query+"&page="+pagenumber;
        return this.http.get(urlvalue, {
          headers: new HttpHeaders()
            .set('Authorization', 'Token ' + token)
        }
        )
      }
      public get_cc_dropdown(sector_id,query,pagenumber) {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        if (query === null) {
          query = "";
          console.log('calling empty');
        }
        // let urlvalue = url + 'usrserv/search_ccbs?query=' + query+"&page="+pagenumber;
        let urlvalue = url + 'usrserv/searchcostcentre?query=' + query+"&page="+pagenumber;
        return this.http.get(urlvalue, {
          headers: new HttpHeaders()
            .set('Authorization', 'Token ' + token)
        }
        )
      } 

      public get_name_dropdown(query,pagenumber) {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        if (query === null) {
          query = "";
          console.log('calling empty');
        }
        let urlvalue = url + 'pprservice/name_search?name=' + query+"&page="+pagenumber;
        return this.http.get(urlvalue, {
          headers: new HttpHeaders()
            .set('Authorization', 'Token ' + token)
        }
        )
      } 
      
      public summaryview(summary,pagenumber,page) {
        this.reset();
        console.log("summary=>",summary)
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        // let urlvalue = url + 'pprservice/fetch_all?page='+ pagenumber;
        let urlvalue = url + 'pprservice/temp_create?core_bscc='+summary.core_bscc+'&bs_id='+summary.bs_id+'&cc_id='+summary.cc_id+'&query='+summary.query+'&page='+pagenumber;
        return this.http.get(urlvalue, {
          headers: new HttpHeaders()
            .set('Authorization', 'Token ' + token)
        }
        )
      }
      pprtem_entry(ppr_entry){
        this.reset();
        const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(url + "pprservice/temp_create",ppr_entry, { 'headers': headers })
      }
      public viewtemplate(id) {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        let urlvalue = url + 'pprservice/temp_fetch/'+id;
        return this.http.get(urlvalue, {
          headers: new HttpHeaders()
            .set('Authorization', 'Token ' + token)
        }
        )
      } 
      public temviewdelete(id,status): Observable<any> {
        this.reset();
        const getToken: any = localStorage.getItem('sessionData')
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        
        return this.http.delete<any>(url + 'pprservice/temp_fetch/'+id +'?status='+status, { 'headers': headers })
      }
  public budget_download(budget) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    // let urlvalue = url + 'pprservice/budget_filedownload';
    let urlvalue=url + 'pprservice/budget_builder_filedownload?finyear='+budget.finyear+"&sectorname="+budget.sectorname+'&bizname='+budget.masterbusinesssegment_name+'&bsname='+budget.bs_name+'&ccname='+budget.cc_name+'&branch_id='+budget.branch_id+"&pagequery="+budget.pagequery+'&status='+budget.status_id+'&biz_id='+budget.business_id+'&bs_id='+budget.bs_id+'&cc_id='+budget.cc_id+'&alei_flag='+budget.alei_flag;
    return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' }
  )}
  public pprreportdownload(pprreport,download_data_type) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    // url +'docserv/document/download/Memo_118985?module=1'
    // let urlvalue = url + 'docserv/document/download/'+file;
    // let urlvalue=url +'pprservice/ppr_filedownload?finyear='+pprreport.finyear+'&sectorname='+pprreport.sectorname+'&sectorid='+pprreport.sectorid+'&biz_name='+pprreport.bizname+'&biz_id='+pprreport.bizid+'&bsname='+pprreport.bsname+'&bsid='+pprreport.bsid+'&ccname='+pprreport.ccname+'&ccid='+pprreport.ccid
    let urlvalue
    if(download_data_type == 2){
    urlvalue =url +'pprservice/report_ppr_levels'
    }else{
      urlvalue =url +'pprservice/generate_overall_pprlevels'
    }
    
    return this.http.post(urlvalue,pprreport, { 'headers' :headers }
    )}
    public pprreport(gen) {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      const headers = { 'Authorization': 'Token ' + token }
      let urlvalue=url+"pprservice/download_pprfile?gen_key="+gen
      return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' }
      )}
     // Expence Group Level Mapping
  public expgrp_mapping(type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=type
    console.log(type)
    return this.http.post<any>(url + "pprservice/level_create",type, { 'headers': headers })
  }
  public expgrpmappingsummary(id,status,page) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let urlvalue = url + 'pprservice/level_create?level='+id+ '&status='+status+'&page='+page;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  } 
  public expgrpdelete(id,status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.delete<any>(url + 'pprservice/level/'+id+'?status='+status, { 'headers': headers })
  }
  public variencexlsxdownload(variancedata,diff) {
    
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let urlvalue
    if(diff=="bs"){
      urlvalue = url + 'pprservice/variancebgt_filedownload?finyear='+variancedata.finyear+'&sectorname='+variancedata.sectorname+'&sector_id='+variancedata.sector_id+'&from_month='+variancedata.from_month+'&to_month='+variancedata.to_month+'&branch_id='+variancedata.branch_id+'&bizname='+variancedata.bizname+'&biz_id='+variancedata.biz_id+'&bsname='+variancedata.bs_name+'&bs_id='+variancedata.bs_id+'&ccname='+variancedata.cc_name+'&cc_id='+variancedata.cc_id+'&flag='+variancedata.flag+'&microbscode='+variancedata.microbscode+"&microcccode="+variancedata.microcccode;
      return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' })
    }else{
      let param= {
        "finyear":variancedata.finyear,
        "sectorid":variancedata.sector_id,
        "sectorname":variancedata.sectorname,
        "from_month":variancedata.from_month,
        "to_month":variancedata.to_month,
        "biz_id":variancedata.biz_id,
        "bizname":variancedata.bizname,
        "microcccode":variancedata.microcccode,
        "microbscode":variancedata.microbscode,
        "bs_id":variancedata.bs_id,
        "bsname":variancedata.bs_name,
        "cc_id":variancedata.cc_id,
        "ccname":variancedata.cc_name,
        "branch_id":variancedata.branch_id,
        "alei_flag":variancedata.flag
     }
     if(diff=="exp"){
      urlvalue = url + 'pprservice/generate_variance_glwisereport';
     }else{
      urlvalue = url + 'pprservice/generate_overallvariance_reportfile';
     }  
     return this.http.post(urlvalue,param , { 'headers': headers })   
    }
  }
  public varience_expdownload(variancedata) {
    
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let urlvalue = url + 'pprservice/variance_filedownload?finyear='+variancedata.finyear+'&sectorname='+variancedata.sectorname+'&from_month='+variancedata.from_month+'&to_month='+variancedata.to_month+'&branch_id='+variancedata.branch_id+'&bizname='+variancedata.bizname+'&bsname='+variancedata.bs_name+'&ccname='+variancedata.cc_name;
    return this.http.get(urlvalue, { headers, responseType: 'blob' as 'json' }
  )}
// exception master
public get_product(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'mstserv/product?data=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
} 
public get_category(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'mstserv/Apcategory_search?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public get_subcategory(query,pagenumber,id) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'mstserv/Apsubcategory_search?query=' + query+"&page="+pagenumber +"&category_id=" + id;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public exceptionmastersummary(summary_data,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue = url + 'pprservice/income_master?level='+summary_data.level+'&bs_id='+summary_data.bs_id+
  '&category_id='+summary_data.category_id+'&subcategory_id='+summary_data.subcategory_id+'&cc_id='+summary_data.cc_id+'&glno='+summary_data.glno+'&product='+summary_data.product+ '&Flag='+summary_data.flag+'&page='+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
exception_masterlevel_create(master_param){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/income_master",master_param, { 'headers': headers })
}
public exceptionpaticular_value_get(exp_id) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue = url + 'pprservice/income_master/'+exp_id;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders().set('Authorization', 'Token ' + token)
  }
  )
}
public change_status(id,status): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let status_change
  if(status==1){
    status_change=0
  }else{
    status_change=1
  }
  return this.http.delete<any>(url + 'pprservice/income_master/'+id +'?status='+status_change, { 'headers': headers })
}
public level_change_status(level,status): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let status_change
  if(status==2){
    status_change=0
  }else{
    status_change=2
  }
  return this.http.delete<any>(url + 'pprservice/dcs_statuschange?level='+level+'&status='+status_change, { 'headers': headers })
}
public getexpenseheaddropdown(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'mstserv/search_expense?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public getcat(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'mstserv/Apcat_search?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public getsubcat(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
    console.log('calling empty');
  }
  let urlvalue = url + 'mstserv/subcategorylistactive?query=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public expensemapping(diff,id_1,id_2) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue 
  if(diff==1){
    urlvalue = url + 'pprservice/exphead_expgrp_edit?expgrp_id='+id_1+ '&expense_id='+id_2;
  }if(diff==2){
    urlvalue = url + 'pprservice/cat_exphead_edit?expense_id='+id_1+'&apcat_id='+id_2;
  }if(diff==3){
    urlvalue = url + 'pprservice/subcat_cat_edit?apcat_id='+id_1+'&apsubcat_id='+id_2;
  }
   
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public expanse_summary_search(summary,page) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue = url + 'pprservice/expgrp_glsummary_list?expgrp_id='+summary.expgrp+'&expense_id='+summary.exp+'&apcat_id='+summary.cat+'&apsubcat_id='+summary.subcat+'&page='+page +'&glno='+summary.glno;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public aws_summary(summary,page) {
  // this.reset();
  // const getToken = localStorage.getItem("sessionData")
  // let tokenValue = JSON.parse(getToken);
  // let token = tokenValue.token
  // let urlvalue = url + 'pprservice/Document_summary?status='+summary.status+'&created_date='+summary.created_date+'&filename='+summary.filename+'&page='+page;
  // return this.http.post(urlvalue, {
  //   headers: new HttpHeaders()
  //     .set('Authorization', 'Token ' + token)
  // }
  // )
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let urlvalue = url + 'pprservice/Document_summary?status='+summary.status+'&created_date='+summary.created_date+'&filename='+summary.filename+'&page='+page;
  return this.http.post<any>(urlvalue,{}, { 'headers': headers })
}
public awt_file(type,term,data){
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + 'pprservice/doc_upload?type='+type+'&term='+term, data, { headers })

}
public exception_summary(exp,pageno){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let urlvalue = url + 'pprservice/exception_summary?from_date='+exp.from_date+'&to_date='+exp.to_date+'&type='+exp.type+'&page='+pageno;
  return this.http.post<any>(urlvalue,{}, { 'headers': headers })
}
public exception_downloade(exception){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let urlvalue = url + 'pprservice/income_exception?from_date='+exception.from_date+'&to_date='+exception.to_date+'&level='+exception.type;
  return this.http.post<any>(urlvalue,{}, { 'headers': headers , responseType: 'blob' as 'json'})
}
public exception_heading(exception,status){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue = url + 'pprservice/check_box?arr='+JSON.stringify(exception)+'&status='+status;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public allocationmaster_upload(value): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let formdata=new FormData()
  formdata.append("upload_file",value)
  const headers = { 'Authorization': 'Token ' + token }   
    console.log("else")
  return this.http.post<any>(url + "pprservice/allocation_upload",formdata, { 'headers': headers })

}  
public ppr_search(i,data){
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/level_wise?level="+i, data, { headers })


} 
public allocation_view_summary(params,pageNumber):Observable<any>{
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }   
  console.log("else")
  return this.http.post<any>(url+"pprservice/allocation_fetch?page="+pageNumber,params, { headers })
} 
public Allocation_child(params,page):Observable<any>{
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }   
  console.log("else")
  return this.http.get<any>(url+"pprservice/allocation_childget?parent_id="+params.parent_id+"&level="+params.level+ "&div_Amount="+params.div_Amount+"&page="+page, { headers })
} 
public allocation_filedownload(allocation){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + 'pprservice/allocation_filegenerate',allocation, { 'headers': headers })
}
public allocation_run(allocation){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let urlvalue = url + 'pprservice/allocation_run?fin_year='+allocation.fin_year+'&from_month='+allocation.from_month+'&to_month='+allocation.to_month+'&level='+allocation.level;
  return this.http.post<any>(urlvalue,{}, { 'headers': headers})

}
public budgetbuilder_xlsx(budget_param,type): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let diff=type.id;
  let budget_url=""
  if(diff==1){
    budget_url="pprservice/generate_glwise_bgt_filedownload"
  }else if(diff==2){
    budget_url="pprservice/generate_bizwise_bgt_filedownload"
  }else if(diff==3){
    budget_url="pprservice/generate_overall_bgt_file"
  }else if(diff==4 || diff ==5){
    budget_url="pprservice/generate_bgt_filedownload"
  }
  return this.http.post<any>(url + budget_url ,budget_param, { 'headers': headers })
} 
public dcs_submit(report_id,file) {
  console.log("report_id",report_id,file)
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  let formdata:any = new FormData()    
  formdata.append("data", JSON.stringify(report_id));    
  if (file !== null) {
    for (var i = 0; i < file.length; i++) { 
      formdata.append("file", file[i]);
    }
    console.log("i",i)
  }
  const headers = { Authorization: "Token " + token };
  return this.http.post<any>(url + "pprservice/raw_attechments", formdata, {
    headers: headers,
  });
} 
// public (params){
//   const getToken = localStorage.getItem("sessionData")
//   let tokenValue = JSON.parse(getToken);
//   let token = tokenValue.token
//   const headers = { 'Authorization': 'Token ' + token }
//   let urlvalue = url + 'pprservice/raw_upload', params;
//   return this.http.post<any>(urlvalue,{}, { 'headers': headers})
// }
public dcs_document(master_param){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + "pprservice/raw_upload",master_param, { 'headers': headers })
}
downloadfiledocument(report_id) {
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    url + "niserv/attechment_download?file_id=" + report_id,     
    { headers: headers,responseType: 'blob' as 'json' }      
  );
}
public dcs_summary(summary,page) {
  console.log("summary",summary)
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let urlvalue = url + 'pprservice/Document_summary?status='+summary.status+'&created_date='+summary.created_date+'&filename='+summary.filename+'&type='+summary.type+'&page='+page;
  return this.http.post<any>(urlvalue,{}, { 'headers': headers })
}
public delete_document(id,status): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token } 
  return this.http.delete<any>(url + 'pprservice/doc_modify/'+id +'?status='+status, { 'headers': headers })
}

public leve_dropdown():Observable<any>{
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  const request ={}
  return this.http.post<any>(url + "pprservice/allocation_levelapi",request, { 'headers': headers })
}
public allocation_forecost(param){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + 'pprservice/allocation_transfer',param, { 'headers': headers })

}
public awt_file_download(param){
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let urlvalue
  urlvalue =url +'pprservice/generate_pprdata_file'
  return this.http.post(urlvalue,param, { 'headers' :headers })
}
public awt_file_downloads(param,file_type){
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let urlvalue
  urlvalue =url +'pprservice/custom_download_trigger?file_type='+file_type
  return this.http.post(urlvalue,param, { 'headers' :headers })
}
 public level_Add_data(name,level){ 
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let urlvalue = url + 'pprservice/dcslevel_combo?level='+level+'&name='+name;
  return this.http.post<any>(urlvalue,{}, { 'headers': headers })
 }

 get_name_level_dropdown() {
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    url + "pprservice/dcslevel_key" ,{ headers: headers }      
  );
}
report_level_Labels(flag,param){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  let ppr_url
  if(flag==1){
    ppr_url="pprservice/report_level?flag="+flag+"&fy="+param.finyear+"&divamount="+param.divAmount+"&sectorid="+param.sector_id+"&bizid="+param.business_id+"&bsuniq"+param.bs_id+"&ccuniq"+param.cc_id+"&branch="+param.branch_id+"&from_month="+param.frommonth+"&to_month="+param.tomonth
  }else{
    ppr_url="pprservice/report_level?flag="+flag 
  }
  return this.http.get<any>(
    url + ppr_url,{ headers: headers }      
  );
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

public ppr_label_delete(id,status): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token } 
  return this.http.delete<any>(url + 'pprservice/report_level/'+id +'?status='+status, { 'headers': headers })
}

public ppr_label_update(param){ 
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + 'pprservice/allocationlevel',param, { 'headers': headers })
 
 }
 allocation_confirm(param){  
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    url + "pprservice/allocation_run_ckecklist?fy="+param.fin_year+"&from="+param.from_month+"&to="+param.to_month ,{ headers: headers }      
  );
 }

 public tb_summary(param,page){
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(url + 'reportserv/get_transaction_drcr?page='+page,param, { 'headers': headers })
 }

 public beforeallocation_run(){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    url + "pprservice/allocmaster_sequence0_s3_download",{ headers: headers }      
  );
 }

 public allocation_master_download(){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { Authorization: "Token " + token };
  return this.http.get<any>(
    url + "pprservice/allocmaster_sequence0_s3_download?level=0",{ headers: headers }      
  );
 }

 Catagorys(catdata,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  let urlvalue = url + "mstserv/categoryname_search?query="+ catdata + '&page=' + page;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders().set("Authorization", "Token " + token),
  });
}   
Subcats(data,cat_id ,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  let urlvalue = url + "mstserv/subcatname_search?query="+ data +"&category_id="+ cat_id + "&page=" + page;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders().set("Authorization", "Token " + token),
  });
  
}  

pprlevel_gltransaction(finyear,branch_id,frommonth,tomonth,gl_no,divAmount,cc_code,bs_code,business_id,sector_id,gl_business_id,gl_bs_code,flag,Entry_crno,transactiondate,supplier_id,microsubcatcode,page){
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  let urlvalue = url + "pprservice/fetch_transaction_for_gl?finyear="+finyear +"&branch_id="+ branch_id + "&frommonth=" +frommonth + "&tomonth="+tomonth +"&gl_no="+gl_no+ "&divAmount="+divAmount+"&cc_code="+cc_code + "&bs_code="+bs_code+"&business_id="+business_id+"&sector_id="+sector_id+"&gl_business_id="+gl_business_id+"&gl_bs_code="+gl_bs_code+"&flag="+flag+"&entry_crno="+Entry_crno+"&transactiondate="+transactiondate+"&supplier_id="+supplier_id+"&microsubcatcode="+microsubcatcode+"&page="+ page;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders().set("Authorization", "Token " + token),
  });
} 

public getsupplier(query,pagenumber) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (query === null) {
    query = "";
  }
  let urlvalue = url + 'pprservice/supplier_dropdown?name=' + query+"&page="+pagenumber;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public master_filedownload(flag) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let urlvalue = url + 'pprservice/masters_download?flag=' + flag;
  return this.http.get(urlvalue, {headers: new HttpHeaders().set('Authorization', 'Token ' + token)})
}
}
