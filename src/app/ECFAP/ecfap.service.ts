import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { ShareService } from '../ECF/share.service'
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment';

const ecfmodelurl = environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class EcfapService {

  constructor(private http: HttpClient, private ecfshareservice: ShareService, private idle: Idle) { }

  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  
  public getecftype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/get_ecftype", { 'headers': headers, params })
    
  }
  
  public getInventoryStatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/get_inventory_status", { 'headers': headers, params })
  }

  public getecfstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/get_status", { 'headers': headers, params })
  }

  
  public getBatchstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/get_ecfstatus?batch=true", { 'headers': headers, params })
  }

  ecfsummarySearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/batchheadersearch?page="+pageno, CreateList, { 'headers': headers })
  }

  SupplierwiseEcfSearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/vow_summary?page="+pageno, CreateList, { 'headers': headers })
  }

  ecfinvsummarySearch2(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/inwardsearch?page="+pageno, CreateList, { 'headers': headers })
  }
  
  ecfapprovalsummarySearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/batchheadersearch?page="+pageno+"&ecf_approver=true", CreateList, { 'headers': headers })
  }

  ecfapprovalbatchsummarySearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/batchsearch?page="+pageno+"&ecf_approver=true", CreateList, { 'headers': headers })
  }
  
  // public getpaymentstatus(no:any): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   if (no === undefined) {
  //     no = ""
  //   }
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   return this.http.get<any>(ecfmodelurl + "apserv/fetch_payment_inwarddtls/"+no, { 'headers': headers, params })
  // }
  public ecfhdrdelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfapserv/ecfdelete/" + id, { 'headers': headers })
  }

  public ECFunlockapi(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/headertwo/' + id + '?type=unlock', { headers })
  }

  public ppxdelete(crno: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(ecfmodelurl + "ecfapserv/ecfap_ppxdetails?adv_invhdrcrno=" + crno + "&ecf_type=ECF", { 'headers': headers })
  }
  public ecfcoverNotedownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/ecf_covernotee/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public batchcoverNotedownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/batch_covernotee/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }


  public coverNoteadvdownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/ecf_covernoteadv/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  submitbatch(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/create_ecfbatch", CreateList, { 'headers': headers })
  }

  public createecfheader(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/create_ecfbatchheader", CreateList, { 'headers': headers })
  }

  public editecfheader(data: any, ecfheaderid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = ecfheaderid;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/create_ecfbatchheader", jsonValue, { 'headers': headers })
  }

  ecfbatchSearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/batchsearch?page="+pageno, CreateList, { 'headers': headers })
  }

  public batchview(id,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(id == undefined){
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/get_batch/' + id+'?page='+pageno, { 'headers': headers })
  }

  public invoiceheadercreate(CreateList: any, ecfapprover =''): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(ecfapprover =='')
      return this.http.post<any>(ecfmodelurl + "ecfapserv/create_invoiceheader", CreateList, { 'headers': headers })
    else
      return this.http.post<any>(ecfmodelurl + "ecfapserv/create_invoiceheader?ecfapprover=1  ", CreateList, { 'headers': headers })

  }

  public DedupeInvoiceChk(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/dedupe_check_invoice", data, { 'headers': headers })
  }


  public ecfdetailsDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfapserv/invhdrdel/" + id, { 'headers': headers })
  }


  public getbranchscroll(branchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getDObranchscroll(branchkeyvalue,do_branch_code, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";
    }
    let urlvalue=""
    if(do_branch_code =="")
      urlvalue = ecfmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno;
    else
      urlvalue = ecfmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue + '&co_branch_code=' + do_branch_code + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getecfheader(id, approver =false): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(id == undefined){
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    if(approver)
      return this.http.get<any>(ecfmodelurl + 'ecfapserv/headertwo/' + id + '?approver=1', { 'headers': headers })
    else
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/headertwo/' + id, { 'headers': headers })
  }
  public getecfinwheader(id,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(id == undefined){
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/header/' + id+'?page='+pageno, { 'headers': headers })
  }
  //APPROVER DROPDOWN
  public getapprover(commodityid,createdbyid,approverkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    if (approverkeyvalue === null) {
      approverkeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'prserv/ecf_delmatlimit?commodityid='+commodityid+'&created_by='+createdbyid+'&employee='+approverkeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


    //APPROVER SCROLL
  public getapproverscroll(pageno,commodityid,createdbyid,branch,approverkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    if (approverkeyvalue === null) {
      approverkeyvalue = "";
    }
    let urlvalue
    if(branch != undefined && branch != null && branch != "")
       urlvalue = ecfmodelurl + 'prserv/ecf_delmatlimit?commodityid='+commodityid+'&created_by='+createdbyid+'&employee='+approverkeyvalue+ '&page=' + pageno+ '&branch_id=' + branch;
    else
        urlvalue = ecfmodelurl + 'prserv/ecf_delmatlimit?commodityid='+commodityid+'&created_by='+createdbyid+'&employee='+approverkeyvalue+ '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getECFapproverscroll(pageno,commodityid,createdbyid,branch,approverkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    if (approverkeyvalue === null) {
      approverkeyvalue = "";
    }
    else if(typeof(approverkeyvalue) =="object")
    {
      approverkeyvalue = approverkeyvalue?.code
    }
    let urlvalue
    if(branch != undefined && branch != null && branch != "")
       urlvalue = ecfmodelurl + 'ecfapserv/approver_dropdown?commodityid='+commodityid+'&created_by='+createdbyid+'&query='+approverkeyvalue+ '&page=' + pageno+ '&branch_id=' + branch;
    else
        urlvalue = ecfmodelurl + 'ecfapserv/approver_dropdown?commodityid='+commodityid+'&created_by='+createdbyid+'&query='+approverkeyvalue+ '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getInvDetail(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoicedetails/' +id,{ 'headers': headers })
  }
  public getInvHdr(id, type = ''): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(type == '' || type == "ECF")
      return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoiceheader/' +id ,{ 'headers': headers })
    else if (type == 'apapproverview')
      return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoiceheader/' +id + '?apmaker_check=1' +'&apapprover=1',{ 'headers': headers })
    else if(type ==  'lockcheck')
      return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoiceheader/' +id + '?lock_check=1',{ 'headers': headers })
    else
      return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoiceheader/' +id ,{ 'headers': headers })
    }

  public getDebitCredit(invhdrid, invdtlid, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   if(type == 1)
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/ecfentry/' + invhdrid  + '?entry_type=' +type + '&apinvdtl_id='+invdtlid,{ 'headers': headers })
   else
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/ecfentry/' + invhdrid + '?entry_type=' +type,{ 'headers': headers })
  }
  public debitCreditAddEdit(id, det): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfentry/'+ id, det, { 'headers': headers })
  }
  public credDebitDel(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(ecfmodelurl + 'ecfapserv/get_ecfentry/'+ id, { 'headers': headers })
  }
  public gethsnscroll(hsnkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (hsnkeyvalue === null) {
      hsnkeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/search_hsncode?query=' + hsnkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public gethsn(hsnkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/search_hsncode?query=' + hsnkeyvalue, { 'headers': headers })
  }
  public getuom(uomkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/uom_search?query=' + uomkeyvalue, { 'headers': headers })
  }
  public getproduct(productkeyvalue?): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(productkeyvalue == "" ||productkeyvalue == null || productkeyvalue == undefined)
    {
      productkeyvalue= ""
      return this.http.get<any>(ecfmodelurl + 'mstserv/productsearch' , { 'headers': headers })
    }
    else
    {
      return this.http.get<any>(ecfmodelurl + 'mstserv/productsearch?query=' + productkeyvalue, { 'headers': headers })
    }
  }
  public GSTcalculation(value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/get_tax', value, { 'headers': headers })
  }
  public getPaymode(text): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/paymode_search?query=' + text, { 'headers': headers })
  }
  // public gettdstaxtype1(id): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   return this.http.get<any>(ecfmodelurl + "venserv/supplier_tax/" + id, { 'headers': headers, params })
  // }
  // public gettdstaxtype1Scroll(id, page): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   return this.http.get<any>(ecfmodelurl + "venserv/supplier_tax/" + id + '?page=' + page ,{ 'headers': headers, params })
  // }
  public getcategoryscroll(catkeyvalue, pageno,type?): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    if(type == 4){
      // return this.http.get<any>(ecfmodelurl + 'mstserv/categoryname_search?query=' + "ADVANCE", { 'headers': headers })
      let urlvalue = ecfmodelurl + 'mstserv/categoryname_search?query=' + "ADVANCE" + '&page=' + 1;
      return this.http.get(urlvalue, {
        headers: new HttpHeaders()
          .set('Authorization', 'Token ' + token)
      }
      )
    }
    else{
    let urlvalue = ecfmodelurl + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  }
  public getsubcategoryscroll(id, subcatkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = 0
    }
    if (subcatkeyvalue === null) {
      subcatkeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbs(bskeyvalue) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue, { 'headers': headers })
  }
  public getbsscroll(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getcc(bsid, cckeyvalue) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bsid === undefined) {
      bsid = 0;
    }
    if (cckeyvalue === null) {
      cckeyvalue = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'usrserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue, { 'headers': headers })
  }
  public getccscroll(bsid, cckeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (cckeyvalue === null) {
      cckeyvalue = "";
    }
    if (bsid === undefined) {
      bsid = 0
    }
    let urlvalue = ecfmodelurl + 'usrserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public invDetAddEdit(invdet): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/create_invoicedetail', invdet, { 'headers': headers })
  }

  public tempInvDetSave(invdet): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'dynamic_create?type=invoicedetail', invdet, { 'headers': headers })
  }

  // public invDetDel(id): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.delete<any>(ecfmodelurl + 'apserv/get_apinvdetails/'+ id, { 'headers': headers })
  // }
  public getdebbankacc(accno: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/bankdetails?account_no='+ accno, { 'headers': headers })
  }
  public gettdstaxcalculation(creditamount, taxrate): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (creditamount === undefined) {
      creditamount = ""
    }
    if (taxrate === undefined) {
      taxrate = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/aptds_calculation/' + creditamount + '/' + taxrate, { 'headers': headers })
  }
  public getcreditpaymodesummaryy(pageNumber = 1, pageSize = 10, paymodeid, suppid, accno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (paymodeid === undefined) {
      paymodeid = ""
    }
    if (suppid === undefined) {
      suppid = ""
    }
    if (accno === undefined) {
      accno = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(ecfmodelurl + "ecfapserv/ecfpayment_list/" + suppid + "/" + paymodeid + "?query=" + accno, { 'headers': headers, params })
  }
  public geteraAcc(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'usrserv/get_ecfraiseraccountdtls/' + id, { 'headers': headers })
  }
  public getbrapaymode(paymodeid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (paymodeid === undefined) {
      paymodeid = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/ecfpaymode_list/' + paymodeid, { 'headers': headers})
  }
  public getbankaccno(paymodeid, suppid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (paymodeid === undefined) {
      paymodeid = ""
    }
    if (suppid === undefined) {
      suppid = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "venserv/supplierpaymode_ecf/" + suppid + "/" + paymodeid, { 'headers': headers })
  }
  public getbankaccDetails(suppid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (suppid === undefined) {
      suppid = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfapserv/supplierdetail/" + suppid, { 'headers': headers })
  }
  public getvendorid(suppid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "venserv/branch/" + suppid + "/payment", { 'headers': headers, params })
  }
  public getsupplierdet(id,invhdrid, taxid, subtax_id): Observable<any> { 
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/supplier_threshold/' + id + '/apinvoiceheader/' + invhdrid
                                    + "?tax_id=" + taxid + "&subtax_id=" + subtax_id, { 'headers': headers })
  }
  public gettdstaxrate(vendorid, id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (id === undefined) {
      id = ""
    }
    if (vendorid === undefined) {
      vendorid = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/tdstaxrate?vendor_id=' + vendorid + '&subtax_id=' + id, { 'headers': headers })
  }
  public getcreditsummary(pageNumber = 1, pageSize = 10, suppid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (suppid === undefined) {
      suppid = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(ecfmodelurl + "venserv/branch/" + suppid + "/payment", { 'headers': headers, params })
  }
  public creditglno(paymodeid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (paymodeid === undefined) {
      paymodeid = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "mstserv/paymodecreditgl/" + paymodeid, { 'headers': headers })
  }
  public ppxdetails(data: any,type?): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(type == 'AP'){
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfap_ppxdetails?type=AP',data, { 'headers': headers })
    }
    if(type == 'ECF'){
      return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfap_ppxdetails?type=ECF',data, { 'headers': headers })
      }
  }
  getcat(catkeyvalue,type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    if(type == 4){
      return this.http.get<any>(ecfmodelurl + 'mstserv/categoryname_search?query=' + "ADVANCE", { 'headers': headers })
    }
    else{
    return this.http.get<any>(ecfmodelurl + 'mstserv/categoryname_search?query=' + catkeyvalue, { 'headers': headers })
    }
  }
  getcatadv(catkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/categoryname_search?query=' + "ADVANCE", { 'headers': headers })
  }
  branchget(d:any):Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    console.log(getToken)
    const header = { 'Authorization': 'Token ' + token }
    return this.http.get(ecfmodelurl+'usrserv/search_employeebranch?page=1&query='+d, { 'headers': header })
  }

  branchgetScroll(d:any, page):Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    console.log(getToken)
    const header = { 'Authorization': 'Token ' + token }
    return this.http.get(ecfmodelurl+'usrserv/search_employeebranch?page='+ page +'&query='+d, { 'headers': header })
  }

  public getsubcat(id, subcatkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = 0;
    }
    if (subcatkeyvalue === null) {
      subcatkeyvalue = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue, { 'headers': headers })
  }
  // public ccbsAddEdit(id,ccbsdet): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(ecfmodelurl + 'apserv/apdebitccbs/'+ id, ccbsdet, { 'headers': headers })
  // }
  // public ccbsdelete(id): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.delete<any>(ecfmodelurl + 'apserv/get_apdebitccbs/'+ id, { 'headers': headers })
  // }
  // public uploadCcbsFile(id,file: any): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let formData = new FormData();
  //   if (file !== null) {
  //       formData.append("file", file);
  //   }
  //   return this.http.post<any>(ecfmodelurl + 'apserv/apdebitccbs/' + id + '?upload=true', formData,{ 'headers': headers })
  // }
// public getCcbs(id): Observable<any> {
//     this.reset();
//     const getToken = localStorage.getItem("sessionData")
//     console.log(getToken)
//     let tokenValue = JSON.parse(getToken);
//     let token = tokenValue.token
//     const headers = { 'Authorization': 'Token ' + token }
//     return this.http.get<any>(ecfmodelurl + 'apserv/apdebitccbs/' +id,{ 'headers': headers })
//   }
  public getbusinessproductdd(businesskeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/create_bsproduct?query='+businesskeyvalue, { 'headers': headers })
  }
  public GetpettycashGSTtype(suppgst,branchgst): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (suppgst === undefined) {
      suppgst = ""
    }
    if (branchgst === undefined) {
      branchgst = ""
    }
    let userid = tokenValue.employee_id
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/gst_calc/' +suppgst+'/'+branchgst , { 'headers': headers })
  }
  
  public entryDebit(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/create_entry',id, { 'headers': headers })
  }  

  public updateDebEntryFlag(id: any, json:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/invoicedetails/'+ id, json, { 'headers': headers })
  }  

  public entryCredit(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/create_entry?entrytype=apcredit',id, { 'headers': headers })
  } 
  
  public updateCredEntryFlag(id: any, json:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/invoiceheader/'+ id, json, { 'headers': headers })
  }  

  public OverallAPSubmit(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfinvoice_submit', data, { 'headers': headers })
  }  
  public InvoiceAPSubmit(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecf_submit', data, { 'headers': headers })
  }  

  public batchApprove(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/batchapprove', data, { 'headers': headers })
  }  

  public batchReject(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/batchreject', data, { 'headers': headers })
  }

  public batchReturn(id, remarks,data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/batchreturn/'+ id + '?remarks=' + remarks, data, { 'headers': headers })
  }

  public batch_ecf_remove(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/batch_ecf_remove', data, { 'headers': headers })
  }
 
  public ecfApprove(data,  txt): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    if(txt =='')
      return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfapprove', data, { 'headers': headers })
    else
      return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfapprove_mono', data, { 'headers': headers })
  }  

  // public ecfapprove_mono(data): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
    
  //   return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfapprove_mono', data, { 'headers': headers })
  // }  

  public ecfReject(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfreject', data, { 'headers': headers })
  }
 
  approvedbatchSearch(search: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/approvalbatchsearch?page="+pageno, search, { 'headers': headers })
  }

  approvedECFSearch(search: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/approvalheadersearch?page="+pageno, search, { 'headers': headers })
  }

  public apApproveRej(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/apinvhdr_statusupdate', data, { 'headers': headers })
  } 
  
  getAuditChecklist(id:any) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(ecfmodelurl+'ecfapserv/get_ecfauditchecklist/'+id, { 'headers': header })
  }
  audiokservie(array: any) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    return this.http.post(ecfmodelurl+'ecfapserv/ecfauditchecklist_map', array, { 'headers': header })
  }

  bounce(id,data: any):Observable<any> {
  
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
     return this.http.post(ecfmodelurl+'ecfapserv/ecfbounce/' +id, data, { 'headers': header })
  }

  preparePayment(data: any):Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
     return this.http.post(ecfmodelurl+'ecfapserv/ecfpreparepayment', data, { 'headers': header })
  }
  public getInwDedupeChk(id,type, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/ecfdedupe_check/'+ id + '?type=' + type +
      '&page=' + page , { 'headers': headers })
  }
  public invhdrdelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfapserv/invhdrdel/" + id, { 'headers': headers })
  }

  public invdtldelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfapserv/invdel/" + id, { 'headers': headers })
  }
  public batchviewwithoutpage(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(id == undefined){
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/batchnopage/' + id, { 'headers': headers })
  }

  getpreparepayment(search:any,page) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.post(ecfmodelurl+'ecfapserv/inv_prepare?page='+page,search, { 'headers': header })
  }

  paymentfilesearch(search:any,page) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.post(ecfmodelurl+'ecfapserv/inv_pymtfile?page='+page,search, { 'headers': header })
  }

  paymentfilesubmit(data:any) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    return this.http.post(ecfmodelurl+'ecfapserv/ecfpaymentfile',data, { 'headers': header })
  }
   
  getBounceSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/fetch_ecfbounce?page="+pageno, data, { 'headers': headers })
  }

  public getsupplierscroll(parentkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (parentkeyvalue === null) {
      parentkeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'venserv/landlordbranch_list?query=' + parentkeyvalue +'&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  getBouncedChecklist(id:any) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(ecfmodelurl+'ecfapserv/get_bounceauditchecklist/'+id, { 'headers': header })
  }
  
  public apReauditRej(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/apinvhdr_statusupdate?type=bounce', data, { 'headers': headers })
  } 
  
  getECFCommonSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ecfap_common_summary?page="+pageno , data, { 'headers': headers })
  }

  getAPCommonSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ecfap_common_summary?page="+pageno+ '&apflag=1', data, { 'headers': headers })
  }
  getapSummary(data: any,ecfid, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ap_invoice_summary/"+ecfid+"?page="+pageno, data, { 'headers': headers })
  }

  getapinvSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ap_invoice_summary/0?page=" +pageno + "&summary_type=maker_summary", data, { 'headers': headers })
  }
  getapbounceSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ap_invoice_summary/0?page="+pageno+"&summary_type=bounce_summary", data, { 'headers': headers })
  }
  getaprejectSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ap_invoice_summary/0?page="+pageno+"&summary_type=rejected_summary", data, { 'headers': headers })
  }

  getfailedTransSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ecfap_common_summary?page="+pageno, data, { 'headers': headers })
  }
  getViewEntryMono(crno: any) :Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/mono_entry_view/" + crno, { 'headers': headers, params })
    
  }

  getViewEntry(crno: any, pageno) :Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "entryserv/fetch_commonentrydetails/" + crno + "?page="+pageno , { 'headers': headers, params })
    
  }

  getStatusDropFailed() :Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/get_ecfstatus?failed_tran=true" , { 'headers': headers, params })
    
  }

  failedTransChangeStat(data: any) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.post<any>(ecfmodelurl + "ecfapserv/apinvhdr_statusupdate?type=dynamic", data, { 'headers': headers })
    return this.http.post<any>(ecfmodelurl + "ecfapserv/failed_tran_status_change", data, { 'headers': headers })
  }
  getAdvanceSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/advance_summary?page="+pageno, data, { 'headers': headers })
  }
  
  public getpayto(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/get_yes_or_no_dropdown?type=ppx', { 'headers': headers })
  }
  getapAPPInvSummary(data:any,pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ap_invoice_summary/0?page="+pageno+"&summary_type=approver_summary", data, { 'headers': headers })
  }
  getapappSummary(data: any,ecfid, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ap_invoice_summary/"+ecfid+"?page="+pageno+"&approver_summary=true", data, { 'headers': headers })
  }


  getapecfSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ecf_wise_summary?page="+pageno, data, { 'headers': headers })
  }
  getapappecfSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ecf_wise_summary?page="+pageno+'&approver_summary=true', data, { 'headers': headers })
  }
  public getStatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/get_ecfstatus?type=common_summary", { 'headers': headers, params })
    
  }

  public get_common_status(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/get_common_status", { 'headers': headers, params })
    
  }

 
  public getBracnhGSTNo(gstno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    if (gstno == null || gstno == '') {
      gstno = "''"
    }
    let data = { 'type': 'gst', 'value': gstno }
    return this.http.post<any>(ecfmodelurl + 'venserv/validate' , data, { 'headers': headers })
  }

  public getInvHdrComplete(id, commonLockChk =0): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoiceheader/' +id + '?type=all',{ 'headers': headers })
    if(commonLockChk ==0)
      return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoiceheader/' +id + '?type=all',{ 'headers': headers })
    else
      return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoiceheader/' +id + '?type=all&lock_check=1',{ 'headers': headers })
  }

  getViewTrans(id:any, page) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(ecfmodelurl+'ecfapserv/view_transaction/'+id + '?page=' + page, { 'headers': header })
  }

    public getallPaymode(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/paymode_ecf_search', { 'headers': headers })
  }

  public mono_ppx_liquidation(data) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/mono_ppx_liquidation', data, { 'headers': headers })
  }


  public getppxheader(data,pagenumber,flag) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(flag == 0){
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfap_ppxheader?get=true'+'&page='+pagenumber, data, { 'headers': headers })
    }
    else{
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfap_ppxheader?get=true'+'&page='+pagenumber+'&liquidation_flag='+flag, data, { 'headers': headers })
    }
  }

  public getppxdetails(crno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/ecfap_ppxdetails?adv_invhdrcrno=' + crno,{ 'headers': headers })
  }

   public gettdstaxtype1(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "venserv/vendor_tax_ecf/" + id, { 'headers': headers, params })
  }

  public gettdstaxtype1Scroll(id, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "venserv/vendor_tax_ecf/" + id + '?page=' + page ,{ 'headers': headers, params })
  }

  public getautobscc(raisedby): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (raisedby === undefined) {
      raisedby = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl +'usrserv/ecf_employee?user_id='+raisedby, { 'headers': headers })
  }
  public ecfapproveforward(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ecfnextapprove", CreateList, { 'headers': headers })
  }
  public batchapproveforward(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/batchnextapprove", CreateList, { 'headers': headers })
  }
  public findmultilevel(Createdatas: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "mstserv/findmultlevel", Createdatas, { 'headers': headers })
  }
  public ppxadvancecreate(Createdatas: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "apserv/ap_ppxdetails", Createdatas, { 'headers': headers })
  }
  public geterapaymodenew(raisedby,paymodeid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    if (raisedby === undefined) {
      raisedby = ""
    }
    if (paymodeid === undefined) {
      paymodeid = ""
    }
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'usrserv/employee_acc_no_get_ecf?raiser_id='+raisedby+'&paymode_id='+paymodeid, { 'headers': headers })
  }
  public getdelmatapproverscroll(pageno,commodityid,createdbyid,approverkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/ecf_delmatlimitlevelfilter?commodityid='+commodityid+'&level=1&created_by='+createdbyid+'&employee='+approverkeyvalue+'&page='+ pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getdelmatapprover(commodityid,createdbyid,approverkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    if (commodityid === null) {
      commodityid = "";
    }
    if (createdbyid === null) {
      createdbyid = "";
    }
    if (approverkeyvalue === null) {
      approverkeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/ecf_delmatlimitlevelfilter?commodityid='+commodityid+'&level=1&created_by='+createdbyid+'&employee='+approverkeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public ppxadvance(Createdata: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "apserv/ap_ppxheader?get=true", Createdata, { 'headers': headers })
  }
  public getpmd(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/fetch_pmd/'+id, { 'headers': headers })
  }
  public getsuppliernamescroll(id, suppliername,relid, pageno): Observable<any> {
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
    if (relid === undefined) {
      relid = "";
    }
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(ecfmodelurl + 'venserv/search_suppliername_ecf?sup_id=' + id + '&name=' + suppliername + '&page=' + pageno, { headers })
  }
  
  public getrmcode(rmkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'usrserv/memosearchemp?query='+rmkeyvalue , { 'headers': headers })
  }

  public getrmscroll(rmkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (rmkeyvalue === null) {
      rmkeyvalue = "";

    }
    let urlvalue = ecfmodelurl + 'usrserv/memosearchemp?query=' + rmkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getclientcode(clientkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/create_client?name='+clientkeyvalue+'&code=' , { 'headers': headers })
  }

  public getclientscroll(clientkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (clientkeyvalue === null) {
      clientkeyvalue = "";

    }
    let urlvalue = ecfmodelurl + 'mstserv/create_client?name=' + clientkeyvalue + '&code=&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getdefcat(catkey): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/categoryname_search?query='+catkey, { 'headers': headers })
  }

  public getdefsubcat(catid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(catid == null){
      catid = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/subcatname_search?category_id=' + catid + '&query=', { 'headers': headers })
  }
  getOnbehalfofHR() {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/is_onbehalfoff_hr", { 'headers': headers })
  }
  public getlocationscroll(lockeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (lockeyvalue === null) {
      lockeyvalue = "";
    }
    let urlvalue = ecfmodelurl + 'mstserv/pmdropdown?location=' + lockeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getsuppliername(id, suppliername,relid): Observable<any> {
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
    if (relid === undefined) {
      id = "";
    }
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(ecfmodelurl + 'venserv/search_suppliername_ecf?sup_id=' + id + '&name=' + suppliername, { headers })
  }

  public getselectsupplierSearch(searchsupplier,relid): Observable<any> {
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
    if(relid == undefined){
      relid = ""
    }
    return this.http.get<any>(ecfmodelurl + 'venserv/search_supplierdetails_ecf?code=' + searchsupplier.code + '&panno=' + searchsupplier.panno + '&gstno=' + searchsupplier.gstno, { 'headers': headers })
  }

  // public getselectsupplierSearch(searchsupplier,relid): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   if (searchsupplier.code === undefined) {
  //     searchsupplier.code = ''
  //   }
  //   if (searchsupplier.panno === undefined) {
  //     searchsupplier.panno = ''
  //   }
  //   if (searchsupplier.gstno === undefined) {
  //     searchsupplier.gstno = ''
  //   }
  //   if (searchsupplier.name === undefined) {
  //     searchsupplier.name = ''
  //   }
  //   if(relid == undefined){
  //     relid = ""
  //   }
  //   return this.http.get<any>(ecfmodelurl + 'venserv/search_supplierdetails_ecf?code=' + searchsupplier.code + '&panno=' + searchsupplier.panno + '&gstno=' + searchsupplier.gstno + '&name=' + searchsupplier.name.name, { 'headers': headers })
  // }

  public GetbranchgstnumberGSTtype(suppid,branchid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (suppid === undefined) {
      suppid = ""
    }
    if (branchid === undefined) {
      branchid = ""
    }
    let userid = tokenValue.employee_id
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/gsttypee/' +suppid+'/'+branchid , { 'headers': headers })
  }
  public downloadfile(id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfapserv/ecffile/" + id, { headers, responseType: 'blob' as 'json' })
  }
  public getsupplierView(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "venserv/supplierbranch/" + id, { 'headers': headers, params })
  }
  public getbranch(branchkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";

    }
    let urlvalue = ecfmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getDObranch(branchkeyvalue, do_branch_code): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";

    }
    let urlvalue 
    if(do_branch_code =="")
      urlvalue = ecfmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue;
    else
      urlvalue = ecfmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue + "&co_branch_code=" + do_branch_code  ;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public createinvhdrmodification(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // formData.append('data', JSON.stringify(CreateList));
    // if (images !== null) {
    //   for (var i = 0; i < images.length; i++) {
    //     formData.append("file", images[i]);
    //   }
    // }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/create_invoiveheadermod", CreateList, { 'headers': headers })
  }
  public deletefile(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/deletefile/'+id, { 'headers': headers })
  }
  public filesdownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/ecffile/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public apsubmit(CreateList: any,id,modify): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(modify == 'modify'){
    return this.http.post<any>(ecfmodelurl + "ecfapserv/apinvoiceheader_submit/"+id +'?checker_modification=1', CreateList, { 'headers': headers })
    }
    else{
    return this.http.post<any>(ecfmodelurl + "ecfapserv/apinvoiceheader_submit/"+id, CreateList, { 'headers': headers })
    }
  }
  public getcommodityscroll(commoditykeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (commoditykeyvalue === null) {
      commoditykeyvalue = "";

    }
    let urlvalue = ecfmodelurl + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getcommodity(commoditykeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=', { 'headers': headers })
  }

  public getCommodity(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let urlvalue = ecfmodelurl + 'mstserv/get_commodity/' + id 
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getPCA(commodityid, pcano, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let urlvalue = ecfmodelurl + 'ecfapserv/pca_search?commodity_id=' + commodityid + '&pca_no=' + pcano +'&page=' + page

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public geAPcommodity(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'mstserv/fetch_commoditylist', data, { 'headers': headers })
  }

  public apapprovereaudit(CreateList: any,is_approve_pay?): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(is_approve_pay == 'Y'){
      return this.http.post<any>(ecfmodelurl + "ecfapserv/apinvhdr_statusupdate?type=dynamic", CreateList, { 'headers': headers })
    }
    else{
      return this.http.post<any>(ecfmodelurl + "ecfapserv/apinvhdr_statusupdate?type=ap_approve", CreateList, { 'headers': headers })
    }

  }

  public getinvyesno(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/get_yes_or_no_dropdown', { 'headers': headers })
  }

  public gettdsapplicable(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/get_yes_or_no_dropdown?type=tds", { 'headers': headers, params })
    
  }

  public downloadfile1(id) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(inwardUrl + "ecfserv/ecffile/" + id, { headers, responseType: 'blob' as 'json' })\
   
    window.open(ecfmodelurl + "ecfapserv/ecffile/"+id+"?token="+token, '_blank');
  }

  
  public getbradata(branchcode): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "mstserv/bankdetailstrndata/"+branchcode, { 'headers': headers, params })
    
  }

  public inwardDetailsViewUploadmicro(json: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.post<any>(ecfmodelurl + 'inwdserv/inwarddetailupdatemicro', json, { headers })
  }

  public inwardDetailsViewUploadmicro2(json: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.post<any>(ecfmodelurl + 'inwdserv/inwardsave', json, { headers })
  }

  public getheadertransaction(ecfid:any, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/viewheader_transaction/"+ecfid + "?page=" + page, { 'headers': headers, params })
    
  }
  inwardFormJson: any;
  public createInwardForm(inwardForm: any, iddata): Observable<any> {
    this.reset();
    if (inwardForm.channel == 1) {
      let courierdata 
      if(typeof inwardForm.courier == 'string' ){
        courierdata = inwardForm.courier
      }else{
        courierdata = inwardForm.courier.id
      }
      let json: any = {
        "courier_id": courierdata,
        "channel_id": inwardForm.channel,
        "inwardfrom": inwardForm.inwardfrom,
        "noofpockets": inwardForm.noofpockets,
        "awbno": inwardForm.awbno,
        "date": inwardForm.date,
        "remarks": inwardForm.remarks,
      }
      this.inwardFormJson = json
    }
    else {
      let json: any = {
        "channel_id": inwardForm.channel,
        "inwardfrom": inwardForm.inwardfrom,
        "noofpockets": inwardForm.noofpockets,
        "date": inwardForm.date,
        "courier_id": "0",
        "remarks": inwardForm.remarks,
        "awbno": "",
      }
      this.inwardFormJson = json
    }
    if (iddata) {
      let idForUpdate = {
        id: iddata
      }
      this.inwardFormJson = Object.assign({}, idForUpdate, this.inwardFormJson)
    }
    let jsonData = this.inwardFormJson

    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // console.log("DATA", jsonData)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'inwdserv/inwardmicro', jsonData, { 'headers': headers })
  }
  
  public ecfreturn(id, remarks): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfapserv/ecfreturn/" + id + "?remarks=" + remarks, { 'headers': headers })
  }
  public getbranchrole(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/dd', { 'headers': headers })
  }
  public getbranchrole_create(sub_name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/dd?submodule=' + sub_name, { 'headers': headers })
  }
  public getPMDBranch(key:string): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/pmd_branch?query=' + key, { 'headers': headers })
  }
  public getPMDLocation(branchid, key,page =1): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/pmdbranch_location/' + branchid + '?query=' + key + '&page=' + page, { 'headers': headers })
  }
  public getInwardSummarySearch(data, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.post<any>(ecfmodelurl + 'inwdserv/apinward_summarysearch' + '?page=' + pageno, data, { headers })
  }
  public getdocdata(docnum:any,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "inwdserv/inexpdtl/"+docnum+"?page="+pageno, { 'headers': headers, params })
    
  }
  public POinvoiceCreate(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/common_ecf', data, { headers })
  }
  public lockcheck(id, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoiceheader/' + id + '?type=check_islocked&aprole_type=' + type, { headers })
  }
  public lockapi(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoiceheader/' + id + '?type=unlock', { headers })
  }

  public unlockapi(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("DETS", JSON.stringify(json))
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoiceheader/' + id + '?type=remove_lock', { headers })
  }

  originalinvsave(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/is_orginalinvoice_update", CreateList, { 'headers': headers })
  }
  public getsuppliertype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/get_suppliertype", { 'headers': headers })
  }
  public getppxdropdown(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/get_ppx", { 'headers': headers, params })
  }
  public getadvancetype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/get_advancetype', { 'headers': headers })
  }

  public gettdsapplicability(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/get_tds', { 'headers': headers })
  }
  public getInwardDetailsView(id: any, pageNumber, pageSize): Observable<any> {
    this.reset();
    let idValue = id
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'inwdserv/inwarddetails_ecf/' + idValue, { 'headers': headers, params })
  }

  public detailsBasedOnPacket(headerid, packetno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'inwdserv/inwarddetails_ecf?inward_id='+headerid+'&packet_no='+packetno, { headers })
  }

  ecfinvsummarySearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/inwardflag?page="+pageno, CreateList, { 'headers': headers })
  }

  getpodetails(pono): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (pono === null) {
    //   pono = "";
    // }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'prserv/pono_details',pono, { 'headers': headers })
  }

  

















  getViewTrans_ecf(id:any, page) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(ecfmodelurl+'ecfapserv/viewheader_transaction/'+id, { 'headers': header })
  }

  getDispatchMode() :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(ecfmodelurl+'ecfapserv/apdispatch?dropdown=true', { 'headers': header })
  }
  rejectDispatch(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/apdispatch", data, { 'headers': headers })
  }
  getCourierDrop(txt:any,page:any) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(ecfmodelurl+'mstserv/courier_search?query=' + txt +'&page=' +page, { 'headers': header })
  }
 
  repushInv(id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + "ecfapserv/invoiceheader/" +id + "?type=re_push_capitalize", { 'headers': headers })
  }

  getdispatchdetails(id)
  {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(ecfmodelurl+'ecfapserv/apdispatch/' +id, { 'headers': header })
  }
  public getInvHdrChngHist(id, hdrPage): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoicedetail_history/' + id + '?flag=invoiceheader&page=' +hdrPage, { headers })
  }

  public getInvDtlChngHist(id, dtlPage): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoicedetail_history/' + id + '?flag=invoicedetail&page=' +dtlPage, { headers })
  }

  public getCredChngHist(id, Page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoicedetail_history/' + id + '?flag=credit&page=' + Page, { headers })
  }

  public getDebitChngHist(id, Page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/invoicedetail_history/' + id + '?flag=debit&page=' + Page, { headers })
  }

  getAuditChecklistPagination(id:any, page) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(ecfmodelurl+'ecfapserv/get_ecfauditchecklist/'+id + '?page='+ page, { 'headers': header })
  }
  
  addAuditChklst(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/ecfauditchecklist_make", CreateList, { 'headers': headers })
  }

  public deleteAuditChklst(id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(ecfmodelurl + "ecfapserv/auditchecklist/" + id, { 'headers': headers })
  }
  public getPhysicalVerify(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/apinward_document_type", { 'headers': headers, params })
    
  }

  public getRptDownload(format, data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let url
    if(format == 1) 
    {
      url = ecfmodelurl + 'ecfapserv/ap_maker_pending_report' 
    }
    else if(format == 2)
    {
      url = ecfmodelurl + 'ecfapserv/ap_approver_pending_report' 
    }
    else if(format == 3) 
    {
      url = ecfmodelurl + 'ecfapserv/ap_bounce_report' 
    }
    else if(format == 4) 
    { 
      url = ecfmodelurl + 'ecfapserv/ap_common_report' 
    }
    else if(format == 5)
    {
      url = ecfmodelurl + 'ecfapserv/get_advice_summary?download=true' 
    }
    return this.http.post<any>(url,data, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  Repushfailedtrans(id,status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    const payload = { "invoice_header_id": id };

    return this.http.post<any>(ecfmodelurl + "ecfapserv/failed_tran_repush?failed_type_status=" + status, payload, { headers });
  }

  public getECFRptDownload(format,data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let url
    if(format == 1) 
    {
      url = ecfmodelurl + 'ecfapserv/batchheadersearch?download=1' 
    }
    else if(format == 2)
    {
      url = ecfmodelurl + 'ecfapserv/batchheadersearch?download=1&ecf_approver=true' 
    }
    else if(format == 3) 
    {
      url = ecfmodelurl + 'ecfapserv/ecfap_common_summary?download=1'
    }
    return this.http.post<any>(url, data,{ 'headers': headers, responseType: 'blob' as 'json' })
  }

  // getCommonViewEntry(crno: any, pageno) :Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   return this.http.get<any>(ecfmodelurl + "entryserv/fetch_commonentrydetails/" + crno + "?page="+pageno , { 'headers': headers, params })
    
  // }

  public apRptSummarydownload(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ap_common_report?download=1',data, { 'headers': headers, })
  }
  public apRptSummarydownload1(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/ecffile/'+ data, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public getapRptSummary(data,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ap_common_report?page='+page,data, { 'headers': headers })
  }

  getPaymentAdvSummary(data: any, pageno) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/get_advice_summary?page="+pageno, data, { 'headers': headers })
  }
 
  
  public getRecurringType(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/all_dropdown", { 'headers': headers, params })
    
  }
  // http://127.0.0.1:8027/ecfapserv/get_queue_summary?page=1
  getQueSummary(data: any,pageno) :Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/get_queue_summary?page="+pageno , data, { 'headers': headers })
  }
  // http://127.0.0.1:8035/ecfapserv/queuesetting_create
  submitqsummary(data: any) :Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/queuesetting_create" , data, { 'headers': headers })
  }

  getModules(search: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/batchheadersearch?page="+pageno, search, { 'headers': headers })
  }
  public getCompletedInvCrnos(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/ecfap_template?temptype=invlist&ecf_id='+ id, { 'headers': headers })
  }

  public ecfTemplateCreate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfap_template', data, { 'headers': headers })
  }

  getInvoiceTemplates(ecftype, name = '') :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(ecfmodelurl+'ecfapserv/ecfap_template?temptype=summary&ecftype='+ ecftype + '&name=' + name, { 'headers': header })
  }
  
  getTemplateData(id) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(ecfmodelurl+'ecfapserv/ecfap_template?id='+ id, { 'headers': header })
  }

  public getEmpBanch(gstno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    if (gstno == null || gstno == '') {
      gstno = "''"
    }
    return this.http.get<any>(ecfmodelurl + 'usrserv/empbranch_search?gst=' + gstno, { 'headers': headers })
  }

  public dynamicCreateECF(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/dynamic_create', data, { 'headers': headers })
  }

  public gstValidated(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(id == undefined){
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/gst_validation?apinvoiceheader_id=' + id, { 'headers': headers })
  }

  public gstValidChk(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/gst_validation', data, { 'headers': headers })
  }
  

  public getDooScoreServ(data, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/doo_scorecard' + '?page=' + pageno, data, { headers })
  }
  public DooScoredownload(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/doo_scorecard?download=1',data, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public getRptDownloads(format, commonrep, data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let url
    if (format == 1) {
      url = ecfmodelurl + 'ecfapserv/ap_maker_pending_report'
    }
    else if (format == 2) {
      url = ecfmodelurl + 'ecfapserv/ap_approver_pending_report'
    }
    else if (format == 3) {
      url = ecfmodelurl + 'ecfapserv/ap_bounce_report'
    }
    else if (format == 4) {
      url = ecfmodelurl + 'ecfapserv/ap_common_report'
    }
    else if (format == 5) {
      url = ecfmodelurl + 'ecfapserv/get_advice_summary?download=true'
    }
    return this.http.post<any>(url, data, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public apFailedtranssummaydown(data,package_data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecfap_common_summary?page=1&page_size=10&submodule=Failed%20Transaction&download=1', package_data, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  getschedularsummary(data: any, pageno, sub_module_name): Observable<any> {

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/apscheduler_summary?page=" + pageno + "&submodule=" + sub_module_name , data, { 'headers': headers })
  }

  public schedularget(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken || '{}');;
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/apscheduler', { 'headers': headers })
  }

  public schedularhistory(id, pageno): Observable<any> {
    this.reset()
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken)
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'ecfapserv/apscheduler?history=' + id + '&page=' + pageno, { 'headers': headers })
  }

  public schedularedit(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/apscheduler', data, { 'headers': headers })
  }
  
  public schedularstartstop(action, id,payload): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let payloads = JSON.stringify(payload)
    const headers = { 'Authorization': 'Token ' + token }
    if (action == 'start') {
      return this.http.post<any>(ecfmodelurl + 'ecfapserv/update_stopflag?start='+id , payloads ,{ 'headers': headers})
    }
    if (action == 'stop') {
      return this.http.post<any>(ecfmodelurl + 'ecfapserv/update_stopflag?stop='+id , payloads ,{ 'headers': headers})
    }
  }

  public releasefund(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/approve_pay_flow', data, { 'headers': headers })
  }

  public getreptype(data): Observable<any>{
    this.reset();
    const getToken:any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/apreport_summary",data, { 'headers': headers})
  }
  
  public getrepSummary(data,page,sub_name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + "ecfapserv/apreportfile_summary?page="+ page + "&submodule=" + sub_name, data , { 'headers': headers })
  }

   public ECFRptSummarydownload(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(ecfmodelurl + 'ecfapserv/ecf_common_report',data, { 'headers': headers, })
  }
    public ActiveInActive(id: any,status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(ecfmodelurl + "ecfapserv/auditchecklist/" + id+"?status="+status, { 'headers': headers })
  }
    public audit_get_ecftype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(ecfmodelurl + "ecfapserv/audit_get_ecftype", { 'headers': headers, params })
    
  }

  public getpoproduct(id,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token 
    const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + 'mstserv/product_base_child_product?prouduct_id='+id +'&page='+page, { 'headers': headers })
  }
    public getpoproductscroll(id,page,query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token 
    const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + 'mstserv/product_base_child_product?prouduct_id='+id +'&page='+page+'&query='+query, { 'headers': headers })
  }
  
  public getposubproduct(id,child_id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(ecfmodelurl + 'mstserv/product_base_child_product?prouduct_id='+id+'&child_product_id='+child_id, { 'headers': headers })
  }
    public getsubcatfacl(val,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(ecfmodelurl + 'mstserv/subcatname_search_using_catcode?category_code='+'FACL'+'&query='+val+'&page='+page, { 'headers': headers })
  }
    public poinvoiceheadercreate(CreateList: any, ecfapprover =''): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(ecfapprover =='')
      return this.http.post<any>(ecfmodelurl + "ecfapserv/create_invoiceheader?grn_file_flag=1", CreateList, { 'headers': headers })
    // else
    //   return this.http.post<any>(ecfmodelurl + "ecfapserv/create_invoiceheader?ecfapprover=1  ", CreateList, { 'headers': headers })

  }

}
