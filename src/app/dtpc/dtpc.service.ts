import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators'

const DtpcUrl = environment.apiURL


@Injectable({
  providedIn: 'root'
})
export class DtpcService {


  constructor(private http: HttpClient, private idle: Idle,) { }
  idleState = 'Not started.';
  timedOut = false;
  LOSinvoiceCreation:any;
  LOSinvoicedraft:any;


  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  public get_application_number(app_number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/loan/' + app_number, { 'headers': headers })
  }

  public get_Branch_loan_summary(pageNumber, pageSize): Observable<any> {
    // debugger;
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(DtpcUrl + 'dtpcserv/loanappl?page=' + pageNumber, { 'headers': headers })
  }

  public get_loan_summary(pageNumber, pageSize): Observable<any> {
    // debugger;
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(DtpcUrl + 'dtpcserv/loanappemp?page=' + pageNumber, { 'headers': headers })
  }
  public get_invoice_summary(pageNumber, pageSize): Observable<any> {
    // debugger;
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(DtpcUrl + 'dtpcserv/invheader?page=' + pageNumber, { 'headers': headers })
  }
  
  public get_invoice_approval_summary(pageNumber, pageSize): Observable<any> {
    // debugger;
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(DtpcUrl + 'dtpcserv/invheaderapp?page=' + pageNumber, { 'headers': headers })
  }

  public save_loan_data(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let send_data = JSON.stringify(data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(DtpcUrl + 'dtpcserv/loanapp', data, { 'headers': headers })
  }

  public create_los_invoice(data: any,files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(files==undefined){
      files=''
    }
    let formData = new FormData();
    this.LOSinvoiceCreation = Object.assign({}, data)
    formData.append("data", JSON.stringify(this.LOSinvoiceCreation));
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
    let createUrl = DtpcUrl + 'dtpcserv/invheader'
    return this.http.post<any>(createUrl, formData, { 'headers': headers })
  }


  // public create_los_invoice(data: any,file): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   let send_data = JSON.stringify(data)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(DtpcUrl + 'dtpcserv/invheader', data, { 'headers': headers })
  // }

  // public create_los_invoice_draft(data: any): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   let send_data = JSON.stringify(data)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(DtpcUrl + 'dtpcserv/invdraft', data, { 'headers': headers })
  // }
  public create_los_invoice_draft(data: any,files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(files==undefined){
      files=''
    }
    let formData = new FormData();
    this.LOSinvoicedraft = Object.assign({}, data)
    formData.append("data", JSON.stringify(this.LOSinvoicedraft));
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
    let darfturl = DtpcUrl + 'dtpcserv/invdraft'
    return this.http.post<any>(darfturl, formData, { 'headers': headers })
  }

  public get_loanchargetype_summary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(DtpcUrl + 'dtpcserv/loanchargetype', { 'headers': headers, params })
  }
  public loanchargetype_data(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(DtpcUrl + 'dtpcserv/loanchargetype', data, { 'headers': headers })
    // return this.http.post<any>('http://127.0.0.1:8000/dtpcserv/loanchargetype',data,{'headers': headers})
  }
  //--------------------------------------------------------create screen app drop down ----------------
  public get_CreateEditscreen_loanapp_dropdown(appno, page_number,branchid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (appno === null) {
      appno = "";
    }
    if(branchid == undefined || branchid == null){
      branchid = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    let urlvalue = DtpcUrl + 'dtpcserv/searchloanapp/'+branchid+'?ApplNo=' + appno + '&page=' + page_number;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
    // return this.http.get<any>(DtpcUrl + 'dtpcserv/loanappl', { 'headers': headers })
    // let urlvalue = DtpcUrl + 'dtpcserv/loanappl';
    // return this.http.get(urlvalue, {
    //   headers: new HttpHeaders()
    //     .set('Authorization', 'Token ' + token)
    // }
    // )
  }

  //-----------------------------Los Summary app Drop down -----------------------

  public get_loanapp_dropdownLOS(appno, page_number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (appno === null) {
      appno = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(DtpcUrl + 'dtpcserv/loanappl', { 'headers': headers })
    // dtpcserv/searchlos?ApplNo=&BranchCode=&BranchName=chennai
    let urlvalue = DtpcUrl + 'dtpcserv/searchlos?ApplNo='+appno+'&BranchCode=&BranchName='
    // let urlvalue = DtpcUrl + 'dtpcserv/searchloanapp?ApplNo=' + appno + '&page=' + page_number;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
 
//---------------------------------LOS Branch Screen app drop down -----------------------
  public get_loanapp_branchdropdown(appno, page_number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (appno === null) {
      appno = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(DtpcUrl + 'dtpcserv/loanappl', { 'headers': headers })
    // dtpcserv/searchlos?ApplNo=&BranchCode=&BranchName=chennai
    // let urlvalue = DtpcUrl + 'dtpcserv/searchlos?ApplNo='+appno+'&BranchCode=&BranchName='
    let urlvalue = DtpcUrl + 'dtpcserv/searchloanapp1?ApplNo=' + appno + '&page=' + page_number;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
//-------------------------------------------------------------------------------------------------
  public search_vendor_get(vendor_name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (vendor_name === null) {
      vendor_name = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(DtpcUrl + 'dtpcserv/loanappl', { 'headers': headers })
    let urlvalue = DtpcUrl + 'venserv/getvendor_name?query=' + vendor_name;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
    // venserv/search?name=
  }

  public get_loanapp_balance(appid,data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    console.log("create app", body)
    const headers = { 'Authorization': 'Token ' + token }
    let json ={
      "appno_id":appid
    }
    let alterjson = Object.assign({},appid,data)
     return this.http.post<any>(DtpcUrl + 'dtpcserv/loanappba/'+appid,alterjson,{ 'headers': headers})
    // let appcreate = DtpcUrl + 'dtpcserv/loanappba/'+ appno_id
    // return this.http.get<any>(appcreate, body, { 'headers': headers })

  }

  public get_loanapp_partgetid(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/loans/' + id, { 'headers': headers })
  } 
  public get_invoice_details(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/invdrft/' + id, { 'headers': headers })
  }
  public getVendorSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'venserv/vendor', { 'headers': headers })
  }

  //-----------------------------------------------------------------------------------------------
  public LOSEditButton(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let send_data = JSON.stringify(data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/invdrft/'+id, { 'headers': headers })
  }

  
  public getLOSbranchsummarySearch(searchlos,searchbranchcode,sortby,pageNumber): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/searchloanapp1?ApplNo=' +searchlos+'&BranchCode='+searchbranchcode+'&BranchName=&sortby='+sortby+'&page='+pageNumber, { 'headers': headers })
  }
  public getLOSsummarySearch(searchlos,searchbranchcode,searchstatus,sortby,pageNumber): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/searchlos?ApplNo='+searchlos+'&BranchCode='+searchbranchcode+'&BranchName='+'&status='+searchstatus+'&sortby='+sortby+'&page='+pageNumber, { 'headers': headers })
  }

  public getbranch(branchkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";

    }
    let urlvalue = DtpcUrl + 'usrserv/search_branch?query=' + branchkeyvalue;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  
  public getbranchscroll(branchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";
    }
    let urlvalue = DtpcUrl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
 
  public getInvoiceLOSsummarySearchdate(searchecfno,searchinvoiceno,searchchargetype,searchinvoiceamount,searchinvoicedate,searchapproveddate,searchbranch,searchbehalfbranch,searchapplno,losstatus,sortby,pageNumber): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(searchinvoicedate == null){
      searchinvoicedate = ''
    }
    if(searchapproveddate == null){
      searchapproveddate = ''
    }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/searchinvoice?Ecf_No='+ searchecfno +'&Invoice_Charge_type='+searchchargetype+'&Invoice_No='+searchinvoiceno+'&Invoice_Total_Amt='+searchinvoiceamount+'&Invoice_Date='+ searchinvoicedate+'&updated_date='+searchapproveddate+'&Branchcode='+searchbranch+'&Loan_Application_id='+searchapplno+'&Status='+losstatus+'&behalf_branch='+searchbehalfbranch+'&sortby='+sortby+'&page='+pageNumber, { 'headers': headers })
  }
  public getInvoiceLOSsummarySearch(searchecfno,searchinvoiceno,searchchargetype,searchinvoiceamount,branchid,losstatus,searchbehalfbranch,searchapplno,sortby,pageNumber): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/searchinvoice?Ecf_No='+ searchecfno +'&Invoice_Charge_type='+searchchargetype+'&Invoice_No='+searchinvoiceno+'&Invoice_Total_Amt='+searchinvoiceamount+'&Invoice_Date='+'&Branchcode='+branchid+'&Loan_Application_id='+searchapplno+'&Status='+losstatus+'&behalf_branch='+searchbehalfbranch+'&sortby='+sortby+'&page='+pageNumber, { 'headers': headers })
  }

  public getInvoiceLOSappsummarySearchdate(searchecfno,searchinvoiceno,searchchargetype,searchinvoiceamount,searchinvoicedate,
    searchapproveddate,searchbranch,searchapplno,losstatus,searchbappbranch,sortby,pageNumber): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(searchapproveddate == null){
      searchapproveddate = ""
    }
    if(searchinvoicedate == null){
      searchinvoicedate = ""
    }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/searchinvoiceapp?Ecf_No='+ searchecfno +'&Invoice_Charge_type='+searchchargetype+'&Invoice_No='+searchinvoiceno+'&Invoice_Total_Amt='+searchinvoiceamount+'&Invoice_Date='+ searchinvoicedate+'&updated_date='+searchapproveddate+'&Branchcode='+searchbranch+'&Loan_Application_id='+searchapplno+'&Status='+losstatus+'&behalf_branch='+searchbappbranch+'&sortby='+sortby+'&page='+pageNumber, { 'headers': headers })
  }
  public getInvoiceLOSappsummarySearch(searchecfno,searchinvoiceno,searchchargetype,searchinvoiceamount,branchid,losstatus,
                                      searchbappbranch,searchapplno,sortby,pageNumber): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/searchinvoiceapp?Ecf_No='+ searchecfno +'&Invoice_Charge_type='+searchchargetype+'&Invoice_No='+searchinvoiceno+'&Invoice_Total_Amt='+searchinvoiceamount+'&Invoice_Date='+'&updated_date='+'&Branchcode='+branchid+'&Loan_Application_id='+searchapplno+'&Status='+losstatus+'&behalf_branch='+searchbappbranch +'&sortby='+sortby+'&page='+pageNumber, { 'headers': headers })
  }











  public getInvoiceLOSsummarySearch1(searchlos): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/searchinvoice?Ecf_No='+ searchlos.ecf_number +'&Invoice_Charge_type='+searchlos.invoice_number+'&Invoice_No='+searchlos.invoice_charge_type+'&Invoice_Total_Amt='+searchlos.invoice__total_amount+'&Invoice_Date='+searchlos.Invoice_Date, { 'headers': headers })
  }

  
  public dtpcapprovaldata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let json = {
      'id':data.id,
      'Remarks': data.Remarks
    }
    return this.http.post<any>(DtpcUrl + 'dtpcserv/invheaderapproved', json, { 'headers': headers })
  }
 
  public dtpcrejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let json = {
      'id':data.id,
      'Remarks': data.Remarks
    }
    return this.http.post<any>(DtpcUrl + "dtpcserv/invheaderrejected", json, { 'headers': headers })
  }

  public get_approval_data(invheaderid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/invdrft/' + invheaderid, { 'headers': headers })
  }

  public Viewdatainrectify(invheaderid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/loanappldetails/' + invheaderid, { 'headers': headers })
  }

  public getgrnselectsupplierSearch(searchsupplier): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (searchsupplier.code === undefined) {
      searchsupplier.code = ''
    }
    if (searchsupplier.panno === undefined) {
      searchsupplier.panno = ''

    }
    if (searchsupplier.gstno === undefined) {
      searchsupplier.gstno = ''
    }
    return this.http.get<any>(DtpcUrl + 'venserv/search_supplier?code=' + searchsupplier.code + '&panno=' + searchsupplier.panno + '&gstno=' + searchsupplier.gstno, { 'headers': headers })
  }

  public getsuppliername(id, suppliername): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (suppliername === undefined) {
      suppliername = "";
    }
    if (id === undefined) {
      id = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    // let urlvalue = PRPOUrl + 'venserv/search_suppliername?query=' + suppliername;
    return this.http.get<any>(DtpcUrl + 'venserv/search_suppliername?sup_id=' + id + '&name=' + suppliername, { headers })
  }

  public getcommodity(comkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'mstserv/searchcommodity?query=' + comkeyvalue, { 'headers': headers })
  }

  public getgrninwardView(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // venserv/supplier_name/
    return this.http.get<any>(DtpcUrl + "venserv/supplierbranch/" + id, { 'headers': headers })
  }
  public gethsnpercentage(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'mstserv/searchcommodity?query=', { 'headers': headers })
  }
  public gethsn(hsnkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'mstserv/search_hsncode?query=' + hsnkeyvalue, { 'headers': headers })
  }
  
  public GetbranchgstnumberGSTtype(id,branchid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let userid = tokenValue.employee_id
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/gsttype/' +id+'/'+branchid , { 'headers': headers })
  }
  public GSTcalculation(value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log('createecfff',value)
    return this.http.post<any>(DtpcUrl + 'ecfserv/get_tax', value, { 'headers': headers })
    .pipe(take(1))
  }
  public fileDownloadForLOSInvoice(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl +'dtpcserv/dtpcfile/' + id + '?identification_name=true&token=' + token,{ responseType: 'blob' as 'json' })
  }
  public getbs(bskeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";
    console.log('calling empty');
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue, { 'headers': headers })
  }

  public getcc(bsid,cckeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(bsid === undefined){
      bsid = 0
    }
    if (cckeyvalue === null) {
      cckeyvalue = "";
    console.log('calling empty');
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'usrserv/searchbs_cc?bs_id='+  bsid +'&query='+ cckeyvalue, { 'headers': headers })
  }

  public getbsscroll(bskeyvalue,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";
    console.log('calling empty');
    }
    let urlvalue = DtpcUrl+'usrserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
    headers: new HttpHeaders()
    .set('Authorization', 'Token ' + token)
    }
    )
    }

    public getccscroll(bsid,cckeyvalue,pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      if(bsid === undefined){
        bsid = 0
      }
      if (cckeyvalue === null) {
        cckeyvalue = "";
      console.log('calling empty');
      }
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'usrserv/searchbs_cc?bs_id='+  bsid +'&query='+ cckeyvalue+ '&page=' + pageno, { 'headers': headers })
    }
  
    public getpdfGRN(rcnheaderid): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      //const idValue = id;
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(DtpcUrl + 'dtpcserv/dtpcpdfgen', rcnheaderid, { headers, responseType: 'blob' as 'json' })
      //return
    }
 
    public getBranchcode(): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let id = tokenValue.employee_id
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'dtpcserv/branchcode/' + id, { 'headers': headers })
    }
    public getcontrolbranch(branchkeyvalue,pageno,id): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'usrserv/employee_ctrlofz/' + id +'?query='+branchkeyvalue+'&page='+pageno, { 'headers': headers })
    }
    
    public getproduct(prokeyvalue): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'mstserv/product?data=' + prokeyvalue, { 'headers': headers })
    }
    public getlossumm(searchlos,searchbranchcode,searchstatus): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      //const idValue = id;
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'dtpcserv/loanxldwld?ApplNo='+searchlos+'&BranchCode='+searchbranchcode+'&status='+searchstatus+'&BranchName=', { headers, responseType: 'blob' as 'json' })
      //return
    }
    public getlosbranch(searchlos, searchbranchcode): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      //const idValue = id;
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'dtpcserv/loanbranchdwld?ApplNo=' +searchlos+'&BranchCode='+searchbranchcode, { headers, responseType: 'blob' as 'json' })
      //return
    }
    public getlosmaker(appno, searchecfno,searchinvoiceno,searchchargetype,searchinvoiceamount,branchid,losstatus): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      //const idValue = id;
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'dtpcserv/loanmakerdwld?Loan_Application_id=' +appno+ '&Ecf_No='+ searchecfno +'&Invoice_Charge_type='+searchchargetype+'&Invoice_No='+searchinvoiceno+'&Invoice_Total_Amt='+searchinvoiceamount+'&Invoice_Date='+'&updated_date='+'&Branchcode='+branchid+'&Status='+losstatus, { headers, responseType: 'blob' as 'json' })
      //return
    }

    public getlosmakerdate(appno, searchecfno,searchinvoiceno,searchchargetype,searchinvoiceamount,searchinvoicedate,searchapproveddate,searchbranch,losstatus): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      if(searchapproveddate == null){
        searchapproveddate = ""
      }
      if(searchinvoicedate == null){
        searchinvoicedate = ""
      }
      return this.http.get<any>(DtpcUrl + 'dtpcserv/loanmakerdwld?Loan_Application_id=' +appno+ '&Ecf_No='+ searchecfno +'&Invoice_Charge_type='+searchchargetype+'&Invoice_No='+searchinvoiceno+'&Invoice_Total_Amt='+searchinvoiceamount+'&Invoice_Date='+ searchinvoicedate+'&updated_date='+searchapproveddate+'&Branchcode='+searchbranch+'&Status='+losstatus, { headers, responseType: 'blob' as 'json' })
    }
    public getlosapproval(app_no, searchecfno,searchinvoiceno,searchchargetype,searchinvoiceamount,branchid,losstatus): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      //const idValue = id;
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'dtpcserv/loanapproverdwld?Loan_Application_id=' +app_no+ '&Ecf_No='+ searchecfno +'&Invoice_Charge_type='+searchchargetype+'&Invoice_No='+searchinvoiceno+'&Invoice_Total_Amt='+searchinvoiceamount+'&Invoice_Date='+'&updated_date='+'&Branchcode='+branchid+'&Status='+losstatus, { headers, responseType: 'blob' as 'json' })
      //return
    }

    public getlosapprovaldate(app_no, searchecfno,searchinvoiceno,searchchargetype,searchinvoiceamount,searchinvoicedate,searchapproveddate,branchid,losstatus): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      if(searchapproveddate == null){
        searchapproveddate = ""
      }
      if(searchinvoicedate == null){
        searchinvoicedate = ""
      }
      //const idValue = id;
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'dtpcserv/loanapproverdwld?Loan_Application_id=' +app_no+ '&Ecf_No='+ searchecfno +'&Invoice_Charge_type='+searchchargetype+'&Invoice_No='+searchinvoiceno+'&Invoice_Total_Amt='+searchinvoiceamount+'&Invoice_Date='+ searchinvoicedate+'&updated_date='+searchapproveddate+'&Branchcode='+branchid+'&Status='+losstatus, { headers, responseType: 'blob' as 'json' })
      //return
    }

    public getprovisionreport(): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(DtpcUrl + "dtpcserv/provision", { 'headers': headers, responseType: 'blob' as 'json' })
    }
    public gettranshistory(id): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'dtpcserv/get_trans/' + id, { 'headers': headers })
    }
    public getonbehalf(): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'dtpcserv/is_onbehalfoff_hr', { 'headers': headers })
    }
    public getSupplierPayDet(ID): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(DtpcUrl + 'dtpcserv/supplierdetail/' + ID , { 'headers': headers })
    }
    public isflgchange(data: any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(DtpcUrl + 'dtpcserv/isflag_change', data, { 'headers': headers })
    }
    public isamtchange(data: any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(DtpcUrl + 'dtpcserv/balamt_change', data, { 'headers': headers })
    }
    public isstatuschange(data: any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(DtpcUrl + 'dtpcserv/apstatus_change', data, { 'headers': headers })
    }
    public getLogSummary(pageNumber, data): Observable<any> {
    // debugger;
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
  
    return this.http.post<any>(DtpcUrl + 'dtpcserv/loslog_summary?page=' + pageNumber, data, { 'headers': headers })
  }
   public downloadLogSummary(data): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      //const idValue = id;
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(DtpcUrl + 'dtpcserv/loslogdwld',data, { headers, responseType: 'blob' as 'json' })
      //return
    }
     public getrmcode(rmkeyvalue): Observable<any> {
        this.reset();
        const getToken: any = localStorage.getItem('sessionData')
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(DtpcUrl + 'usrserv/memosearchemp?query='+rmkeyvalue , { 'headers': headers })
      }

        public getrmscroll(rmkeyvalue, pageno): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          if (rmkeyvalue === null) {
            rmkeyvalue = "";
      
          }
          let urlvalue = DtpcUrl + 'usrserv/memosearchemp?query=' + rmkeyvalue + '&page=' + pageno;
          return this.http.get(urlvalue, {
            headers: new HttpHeaders()
              .set('Authorization', 'Token ' + token)
          }
          )
        }

    public chargetypedrpdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DtpcUrl + 'dtpcserv/chargetype', { 'headers': headers })
  }
    public loanapplication_push(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(DtpcUrl + 'dtpcserv/loanapp', data, { 'headers': headers })
  }
    
  }



