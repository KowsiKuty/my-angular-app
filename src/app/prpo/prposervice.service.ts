import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { catchError, map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { D } from '@angular/cdk/keycodes';



//const APDATAURL = "http://emc-vysfin-sit.kvbank.in/insert_ap_frm_memo?Group=GENERIC_API_AP&Action=COMMON_API"

const PRPOUrl = environment.apiURL      //8000
const MicroUrl = environment.apiURL   /// 8184
@Injectable({
  providedIn: 'root'
})
export class PRPOSERVICEService {
  test: any;
  constructor(private http: HttpClient, private idle: Idle,) { }
  grnADDJson: any
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  
  
   public getdraftData(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/get_batch_pr_draft/'+ id , { 'headers': headers })
  }
  
  public getPrList(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/consolitated_bpr_summary',val , { 'headers': headers })
  }
  
  public prCreate(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/pr_create', val , { 'headers': headers })
  }




  public submitPrice(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/consolitated_bpr', val , { 'headers': headers })
  }
  public submitDraft(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/consolidation_draft', val , { 'headers': headers })
  }
  
  public getProductCode(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/mst_fetch_productdata/'+ id , { 'headers': headers })
  }
  
  public getQuotationDetailsHistory(id, sup_id): Observable<any> {
    this.reset();
    let dict =  {"supplier_id":sup_id}

    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/quotation_history/'+ id, dict , { 'headers': headers })
  }
  public getQuotationDetails(id, sup_id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/quotation_comparison/'+ id +'/supplier/'+ sup_id , { 'headers': headers })
  }
  public activeCheck(id, dtlid, sup_id,status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/quotation_action/'+ id +'/quotationdetail_id/'+ dtlid +'/supplier_id/'+sup_id + '?action=' + status, { 'headers': headers })
  }
  public quotationSearch(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/summary_quotationsupplier?page=' , val, { 'headers': headers })
  }

   public quotationSearchnew(val,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/summary_quotationsupplier?page='+page , val, { 'headers': headers })
  }

  public quotationSearchh(val,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.post<any>(PRPOUrl + 'prserv/summary_quotation?page='+ page , val, { 'headers': headers })
    return this.http.post<any>(PRPOUrl + 'prserv/quot_summary?page='+ page , val, { 'headers': headers })

  }
  public quotationSearchMaster(val,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/summary_quotationmaster?page='+ page,  val, { 'headers': headers })
  }
  public getSupplierData(prod,make,model,spec,config): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let dict = {
      "product_id": prod,
      "make": make,
      "model": model,
      "specification": spec,
      "configuration": config,
      "supplier_id": "",
    }
    return this.http.post<any>(PRPOUrl + 'venserv/catalog_specification_prpo?page=1',dict, { 'headers': headers })
  }

  public quotationDD(val,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/get_quotation_for_pr?page='+ page , val, { 'headers': headers })
  }
  public getQuotationSubmit(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/quotation_master' , val, { 'headers': headers })
  }
  public getQuotationSubmitData(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/quotation_supplier' , val, { 'headers': headers })
  }
  
  // http://192.168.1.22:8000/prserv/quot_summary
  ///////////////////////commodity
  public addAssetId(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/search_assetid_get?asset_id=' + val, { 'headers': headers })
  }
  
  public getAssetDetails(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/replacement_view/' + val, { 'headers': headers })
  }
   public getAssetDetailsNewpo(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/replacement_view_po', val, { 'headers': headers })
  }
   public getAssetDetailsNewpoget(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/po_replacement_view/'+ val, { 'headers': headers })
  }
    public getAssetDetailss(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/branchreplacement_view/' + val, { 'headers': headers })
  }
  public getAssetDetailsreplace(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/replacement_requestfor/' + val, { 'headers': headers })
  }
  public getproductType(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/productclassification', { 'headers': headers })
    // return this.http.get<any>(PRPOUrl + 'mstserv/pdtclasstype', { 'headers': headers })
  }
  public getproduct_type(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/pdtclasstype', { 'headers': headers })
  }
  public getAssetDetailsPO(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/po_replacement_view/' + val, { 'headers': headers })
  }
  public getExcelDwnld(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/pr_branch_request_report',data,{ headers, responseType: 'blob' as 'json' })
   }
  
  public getcommodity(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/commodity?page=" + pageNumber, { 'headers': headers, params })
  }
  public getcommoditysummary(page,name:any,code:any,status:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/commoditysummary?name="+name+ "&code="+code+ "&status="+status , { 'headers': headers, params })
  }

  // public getcommadityInactivelist(page=1,pagesize=10): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', page.toString());
  //   params = params.append('pageSize', pagesize.toString());
  //   return this.http.get<any>(PRPOUrl + "mstserv/commodity_inactive_list?page=" + page, { 'headers': headers, params })
  // }
  // public getcommadityactivelist(page=1,pagesize=10): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', page.toString());
  //   params = params.append('pageSize', pagesize.toString());
  //   return this.http.get<any>(PRPOUrl + "mstserv/commodity_active_list?page=" + page, { 'headers': headers, params })
  // }
  // public getCommoditySearch(search): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token } 
  //   return this.http.post<any>(PRPOUrl + 'mstserv/search_commodityAll' ,search, { 'headers': headers })
  // }
  public getCommoditySearch(code, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let names = name

    for (let i in names) {
      if (!names[i]) {
        delete names[i];
      }
    }
    let codes = code

    for (let i in codes) {
      if (!codes[i]) {
        delete codes[i];
      }
    }
    return this.http.get<any>(PRPOUrl + 'mstserv/commoditysearch?name=' + names + '&code=' + codes, { 'headers': headers })
  }

  public commodityCreateForm(com: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(com)
    // console.log("com Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'mstserv/commodity', data, { 'headers': headers })
  }
  public activeInactiveCommodity(comId, status_action): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/commoditystatus/" + comId + '?status=' + status_action, { 'headers': headers })
  }
  //////////delmat
  public getdelmat(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/delmat?page=" + pageNumber, { 'headers': headers, params })
  }
 


public getdelmatsummary(page,emp_id:any,com_id:any,type:any,status:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/delmatsummary?commodity_id=" + com_id+ "&employee_id="+emp_id+"&type="+type+"&status="+status, { 'headers': headers, params })
  }
  public delmatmakercreate(delmake): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(delmake)
    //console.log("delmake Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/delmat', data, { 'headers': headers })
  }
  public getemployeeFK(empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
  }
  public getemployeeFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getcommodityFK(comkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=' + comkeyvalue, { 'headers': headers })
  }
  public getcommodityFKdd(comkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=' + comkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getdelmattype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/delmattype', { 'headers': headers })
  }

  ////////////////delmatapproval

  public getdelmatapp(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/pending_list?page=" + pageNumber, { 'headers': headers, params })
  }
  public getdelapprovalorRejectdata(delmatapprovalId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/delmat/" + delmatapprovalId, { 'headers': headers })
  }
  // public getdelapprovaldata(delmatapprovalId): Observable<any>{
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/delmat/" + delmatapprovalId +'/statusApproved', { 'headers': headers })
  // }
  // public getdelrejectdata(delmatapprovalId): Observable<any>{
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/delmat/" + delmatapprovalId +'/statusRejected', { 'headers': headers })
  // }

  public getdelapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(approval)
    //console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/updateapproved', data, { 'headers': headers })
  }
  public getdelrejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/updaterejected", data, { 'headers': headers })
  }
  public getdelmatappSearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/searchpending', searchdel, { 'headers': headers })
  }
  /////////////////////   Apcategory
  public getapcategory(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/categorylist?page=" + pageNumber, { 'headers': headers, params })
  }

  public apcategoryCreateForm(apcat: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apcat)
    console.log("apcat Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'mstserv/Apcategory', data, { 'headers': headers })
  }
  public editapcat(apcatedit): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apcatedit)
    // console.log("apcat Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'mstserv/updateisasset', data, { 'headers': headers })
  }
  public activeInactiveapcat(apId, status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = apId + '?status=' + status
    //console.log('data check for apcat active inactive', data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/categorystatus/" + apId + '?status=' + status, { 'headers': headers })
  }
  public getapcatsearch(no, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let names = name

    for (let i in names) {
      if (!names[i]) {
        delete names[i];
      }
    }
    let nos = no

    for (let i in nos) {
      if (!nos[i]) {
        delete nos[i];
      }
    }
    return this.http.get<any>(PRPOUrl + 'mstserv/categorysearch?name=' + names + '&no=' + nos, { 'headers': headers })
  }

  ////////////////////////apsubcat
  public getapsubcategory(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/subcategorylist?page=" + pageNumber, { 'headers': headers, params })
  }

  public apSubCategoryCreateForm(apsubcat: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apsubcat)
    // console.log("apcat Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'mstserv/Apsubcategory', data, { 'headers': headers })
  }
  public getcategorydd(catkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/categoryname_search?query=' + catkeyvalue, { 'headers': headers })
  }
  public getcategoryFKdd(catkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public getexp(expkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/search_expense?query=' + expkeyvalue, { 'headers': headers })
  }
  public getexpen(expkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/search_expense?query=' + expkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public editapsubcat(apsubcatedit): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apsubcatedit)
    // console.log("editapsubcat Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'mstserv/editsubcategory', data, { 'headers': headers })
  }

  public getapsubcatsearch(searchapsub): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let names= name

    // for (let i in name) {
    //       if (!name[i]) {
    //         delete name[i];
    //       }
    //     }
    // let nos= no

    // for (let i in nos) {
    //       if (!nos[i]) {
    //         delete nos[i];
    //       }
    //     }    
    // if (name === undefined || name==="" || name===null ) {
    //   name ="";
    // }
    // if (no === undefined || no==="" || no===null ) {
    //   no ="";
    // }
    return this.http.post<any>(PRPOUrl + 'mstserv/subcategorysearch', searchapsub, { 'headers': headers })

    //return this.http.get<any>(PRPOUrl + 'mstserv/subcategorysearch?name='+ name +'&no='+ no, { 'headers': headers })
  }


  ////////////////// bs
  public getbs(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/businesssegmentlist?page=" + pageNumber, { 'headers': headers, params })
  }

  public BSCreateForm(bs: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(bs)
    //console.log("bs Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'usrserv/businesssegment', data, { 'headers': headers })
  }

  public getBssearch(no, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let names = name

    for (let i in names) {
      if (!names[i]) {
        delete names[i];
      }
    }
    let nos = no

    for (let i in nos) {
      if (!nos[i]) {
        delete nos[i];
      }
    }
    return this.http.get<any>(PRPOUrl + 'usrserv/businesssegmentsearch?name=' + names + '&no=' + nos, { 'headers': headers })
  }
  public activeInactivebs(bsId, status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = bsId + '?status=' + status
    //console.log('data check for apcat active inactive', data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/businesssegmentstatus/" + bsId + '?status=' + status, { 'headers': headers })
  }

  ////////////////// CC
  public getcc(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/costcentrelist?page=" + pageNumber, { 'headers': headers, params })
  }

  public getCCsearch(no, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let names = name

    for (let i in names) {
      if (!names[i]) {
        delete names[i];
      }
    }
    let nos = no

    for (let i in nos) {
      if (!nos[i]) {
        delete nos[i];
      }
    }
    return this.http.get<any>(PRPOUrl + 'usrserv/costcentresearch?name=' + names + '&no=' + nos, { 'headers': headers })
  }

  public CCCreateForm(cc: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(cc)
    // console.log("cc Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'usrserv/costcentre', data, { 'headers': headers })
  }

  public activeInactivecc(ccId, status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = ccId + '?status=' + status
    // console.log('data check for apcat active inactive', data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/costcentrestatus/" + ccId + '?status=' + status, { 'headers': headers })
  }
  public activeInactivedel(delId, status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = delId + '?status=' + status
    //console.log('data check for apcat active inactive', data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/delmatstatus/" + delId + '?status=' + status, { 'headers': headers })
  }
  public getdelmatSearch(searchdel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    // if (type === undefined || type==="" ) {
    //   type ="";
    // }
    // if (empid === undefined || empid==="" ) {
    //   empid ="";
    // }
    // if (comid === undefined || comid==="" ) {
    //   comid ="";
    // }

    // let types= type.id
    // let comids= comid.id
    // let empids= empid.id
    // for (let i in types) {
    //       if (!types[i]) {
    //         delete types[i];
    //       }
    //     }
    // for (let i in comids) {
    //       if (!comids[i]) {
    //         delete comids[i];
    //       }
    //     } 
    // for (let i in empids) {
    //       if (!empids[i]) {
    //         delete empids[i];
    //       }
    //     }        
    //return this.http.get<any>(MicroUrl + 'prserv/delmatsearch?type='+ type +'&employee_id='+ empid + '&commodity_id=' + comid, { 'headers': headers })
    return this.http.post<any>(MicroUrl + 'prserv/delmatsearch', searchdel, { 'headers': headers })
  }



  /////////////////////////////////CCBS
  public getccBS(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/ccbsmapping?page=" + pageNumber, { 'headers': headers, params })
  }


  public getbsvalue(bskeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchbusinesssegment?query=" + bskeyvalue, { 'headers': headers })
  }
  public getbsFKdd(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno, { 'headers': headers })
  }


  public getccvalue(empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchcostcentre?query=" + empkeyvalue, { 'headers': headers })
  }
  public getccFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchcostcentre?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public ccbsCreateForm(ccbs: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(ccbs)
    // console.log("ccbs Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'usrserv/ccbsmapping', data, { 'headers': headers })
  }

  public getCCBSsearch(searchccbs): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'usrserv/search_ccbs', searchccbs, { 'headers': headers })
  }

  public getapsubcatInactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    //  console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/subcategorylistinactive?page=" + pageNumber, { 'headers': headers, params })
  }

  public getapsubcatactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/subcategorylistactive?page=" + pageNumber, { 'headers': headers, params })
  }



  public getapcatInactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/categorylistinactive?page=" + pageNumber, { 'headers': headers, params })
  }

  public getapcatactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "mstserv/categorylistactive?page=" + pageNumber, { 'headers': headers, params })
  }

  public getbsInactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/bslistinactive?page=" + pageNumber, { 'headers': headers, params })
  }

  public getbsactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/bslistactive?page=" + pageNumber, { 'headers': headers, params })
  }


  public getccInactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/cclistinactive?page=" + pageNumber, { 'headers': headers, params })
  }

  public getccactivelist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(PRPOUrl + "usrserv/cclistactive?page=" + pageNumber, { 'headers': headers, params })
  }



  public getproduct(prodkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return
    return this.http.get<any>(PRPOUrl + "mstserv/productsearch?query=" + prodkeyvalue, { 'headers': headers })
  }

  public getproductDependencyBR(com,type,value,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (com != undefined) {
          return this.http.get<any>(MicroUrl + "prserv/cpMap/"+com+'?query='+"&page="+pageno ,{ 'headers': headers })
          }
  }

  // prserv/cpMap/<commodity_id>?query=&page=1

 

  public getproductKdd(prodkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return
    return this.http.get<any>(PRPOUrl + "mstserv/productsearch?query=" + prodkeyvalue + '&page=' + pageno, { 'headers': headers })
  }


  public getonlyproduct(type,pageno):
  Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return
    return this.http.get<any>(PRPOUrl + "mstserv/productsearch?query="+type+'&page='+pageno, { 'headers': headers })
  }
  public getConf(page,spec,code): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(PRPOUrl + 'mstserv/product_configuration?page='+page+"&code="+code+"&specification="+spec, { 'headers': headers })
  }
  
  public getHwsw(page,spec): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(PRPOUrl + 'mstserv/search_specconfig_reqfor?page='+page+"&name="+ spec, { 'headers': headers })
  }
  // mstserv/search_specconfig_reqfor?name=Desktop&page=1

  public getConf_for(page,spec,value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(PRPOUrl + 'mstserv/specification_search?page='+page+"&request_type="+ spec + "&query=" + value, { 'headers': headers })
  }
  // mstserv/specification_search?page=1&request_type=2 
  
  public getOtherAttributes(id,page):
  Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return
    return this.http.get<any>(PRPOUrl + "mstserv/product_specification?page="+ page + "&code="+id, { 'headers': headers })
  }
  

  public getproduct_Asset(key,branchId,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return
    // if(comid){
    // return this.http.get<any>(PRPOUrl + "prserv/cpMap/" + comid +'?query='+ key + '&page=' + pageno + "&type=" + list, { 'headers': headers })
  // } else{
    return this.http.get<any>(PRPOUrl +'mstserv/productsearch?query='+key+'&page='+page +"&request_for="+branchId,{ 'headers': headers })
  // }
  }
  public getproductList(key,comid, list, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return
    // if(comid){
    return this.http.get<any>(PRPOUrl + "prserv/prpo_cp/" + comid +'?query='+ key + '&page=' + pageno + "&request_type=" + list, { 'headers': headers })
    // } else{
    // return this.http.get<any>(PRPOUrl +'mstserv/productsearch?query='+key+'&page='+pageno,{ 'headers': headers })
  // }
  }
  public get_Asset(asset,request_for, prod, pageno,make?,model?,serial_no?): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return
    // if(comid){
    return this.http.get<any>(PRPOUrl + "prserv/search_assetid_get?asset_id=" +asset+"&branch_id="+ request_for + '&page=' + pageno + "&product_id=" + prod+"&make_name="+make+"&model_name="+model+"&serial_no="+serial_no, { 'headers': headers })
  // } else{
    // return this.http.get<any>(PRPOUrl +'mstserv/productsearch?query='+key+'&page='+pageno,{ 'headers': headers })
  // }
  }
   public get_Asset_replacement(asset,request_for, prod, pageno,make?,model?,serial_no?): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return
    // if(comid){
    return this.http.get<any>(PRPOUrl + "prserv/search_assetid_replacement?asset_id=" +asset+"&branch_id="+ request_for + '&page=' + pageno + "&product_id=" + prod+"&make_name="+make+"&model_name="+model+"&serial_no="+serial_no, { 'headers': headers })
  // } else{
    // return this.http.get<any>(PRPOUrl +'mstserv/productsearch?query='+key+'&page='+pageno,{ 'headers': headers })
  // }
  }

  public getproductfn(comid,prod,key, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    key == undefined || typeof key == "object" ? key = "" : key
    // return
    if(comid && !prod){
    return this.http.get<any>(PRPOUrl + "prserv/cpMap/" + comid +'?query='+ key + '&page=' + pageno, { 'headers': headers })
  } else if(comid && prod){
    return this.http.get<any>(MicroUrl + "prserv/prpo_cp/"+comid+"?request_type=" + prod + "&query="+key + "&page="+ pageno, {'headers': headers })

  } else if(!comid && prod){
    return this.http.get<any>(MicroUrl + "mstserv/producttype_get_product/"+prod+"?query="+key + "&page="+ pageno, {'headers': headers })

  }else {
    return this.http.get<any>(PRPOUrl +'mstserv/productsearch?query='+key+'&page='+pageno,{ 'headers': headers })
  }
  }
  public productCreateForm(prod: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(prod)
    //console.log("prod Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/cpmapping', data, { 'headers': headers })
  }
  public getODIT(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(PRPOUrl + 'mstserv/categorytype', { 'headers': headers })
  }

  public getprodselectedlist(ids: any,query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let id = ids
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + 'prserv/cpMap/' + id, { 'headers': headers })
    // BUG ID:7386
    return this.http.get<any>(MicroUrl + 'prserv/commodityproduct_get/' + id+'?query='+query, { 'headers': headers })

  }


  //////////////////////////////////////////////Transaction


  public getpar(pageNumber, pageSize): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/par", { 'headers': headers, params })
  }
  public getparsummarySearch(searchdel,bpa_summary,pageno,pageSize): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.post<any>(MicroUrl + 'prserv/search_parmaker', searchdel, { 'headers': headers })
    return this.http.post<any>(MicroUrl + 'prserv/par_maker?is_summary='+bpa_summary+'&page='+pageno+'&pageSize='+pageSize, searchdel, { 'headers': headers })
  }

  public getreqfor(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/department_search?query=", { 'headers': headers })
  }
  public getreqforFK(rforkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/department_search?query=' + rforkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  parmakerdocJson: any;
  public PARmakerFormSubmit(par: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // this.parmakerdocJson = par
    // formData.append('data', JSON.stringify(this.parmakerdocJson));
    // for (var i = 0; i < files.length; i++) {
    //   const addToFormData = ["file"]
    //   addToFormData.forEach(key => formData.append(key, files[i]));
    // }
    return this.http.post<any>(MicroUrl + 'prserv/par', par, { 'headers': headers })
  }

  public getallpar(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/fetch_pardetails?query=" + id, { 'headers': headers })
  }
  public PARcontigencySubmit(par: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(par)
    // console.log("par Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/contigency_par', data, { 'headers': headers })
  }

  public getparchecker(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/parchecker_list?page=" + pageNumber, { 'headers': headers, params })
  }
  public getparapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(approval)
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/parapproved', data, { 'headers': headers })
  }
  public getparrejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/parrejected", data, { 'headers': headers })
  }

  public getparcheckerSearch(searchdel,bpa_summary,pageno,pagesize): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.post<any>(MicroUrl + 'prserv/search_parchecker', searchdel, { 'headers': headers })
    return this.http.post<any>(MicroUrl + 'prserv/par_checker?page='+pageno+'&is_summary='+bpa_summary, searchdel, { 'headers': headers })
  }


  public getparEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/pardetails/' + id, { headers })
  }



  public getMepList(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/mep?page=" + pageNumber, { 'headers': headers, params })
  }

  public getmepsummarySearch(searchdel,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_mepmaker?page='+pageno, searchdel, { 'headers': headers })
  }


  public getparnoFK(parnokeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/search_parno?query=" + parnokeyvalue, { 'headers': headers })
  }
  public getparnoFKdd(parnokeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/search_parno?query=' + parnokeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public MEPmakerFormSubmit(mep: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(mep)
    // console.log("mep Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/mep', data, { 'headers': headers })
  }

  public getbranch(branchkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/search_branch?query=" + branchkeyvalue, { 'headers': headers })
  }
  public getbranchFK(branchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getmepEdit(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/mepdetails/' + id, { headers })
  }

  public getraisorFK(empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
  }
  public getraisorFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getprojectownerFK(empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
  }
  public getprojectownerFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getbudgetownerFK(empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/searchemployee?query=" + empkeyvalue, { 'headers': headers })
  }
  public getbudgetownerFKdd(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getMepapproverList(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/get_mepchecker?page=" + pageNumber, { 'headers': headers, params })
  }

  public getmeapproverpsummarySearch(searchdel,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_mepchecker?page='+pageno, searchdel, { 'headers': headers })
  }

  public getmepapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(approval)
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/mepapproved', data, { 'headers': headers })
  }
  public getmeprejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/meprejected", data, { 'headers': headers })
  }

  public MepcontigencySubmit(mep: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(mep)
    // console.log("mep Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/contigency_mep', data, { 'headers': headers })
  }

  public getproductdetails(prodkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/productsearch?query=" + prodkeyvalue, { 'headers': headers })
  }

  public getpoclosesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/close_makerlist?page=" + pageNumber, { 'headers': headers, params })
  }

  public getpocloseappsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/approval_closelist?page=" + pageNumber, { 'headers': headers, params })
  }

  public getpoclosedatasummary(id: any): Observable<any> {
    this.reset();
    // let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poclose_get/' + id, { headers })
  }

  public getpoclosesummarySearch(searchpo,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_poclose?page='+pageno, searchpo, { 'headers': headers })
  }

  public getpoclosedata(id: any): Observable<any> {
    this.reset();
    // let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/get_poheader/' + id, { headers })
  }

  public pocloseremarks(close): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(close)
    // console.log("close Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/poclose', close, { 'headers': headers })
  }


  public getpocloseapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(approval)
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/pocloseapproved', approval, { 'headers': headers })
  }


  public getpocloserejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/pocloserejected ", data, { 'headers': headers })
  }

  // public getpocloseappsummary(pageNumber = 1, pageSize = 10): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //   console.log(params);
  //   console.log(headers);
  //   return this.http.get<any>(MicroUrl + "prserv/poclose?page=" + pageNumber, { 'headers': headers, params })
  // }

  public getpocloseappsummarySearch(searchpo,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/approval_closesearch?page='+pageno, searchpo, { 'headers': headers })
  }

  public getporeopensummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/reopen?page=" + pageNumber, { 'headers': headers, params })
  }
  public getporeopensummarySearch(searchpo,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_poreopen?page='+pageno, searchpo, { 'headers': headers })
  }

  public getporeopendata(id: any): Observable<any> {
    this.reset();
    // let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poreopen_header/' + id, { headers })
  }

  public poreopenremarks(reopen): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(reopen)
    // console.log("reopen Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/reopen', data, { 'headers': headers })
  }

  public getpocancelsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/cancel_makerlist?page=" + pageNumber, { 'headers': headers, params })
  }
  public getpocancelsummarySearch(searchpo,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_pocancel?page='+pageno, searchpo, { 'headers': headers })
  }
  public getpocancelappsummarySearch(searchpo,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/approval_cancelsearch?page='+pageno, searchpo, { 'headers': headers })
  }

  public getpocanceldata(id: any): Observable<any> {
    this.reset();
    // let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/get_poheader/' + id, { headers })
  }

  public pocancelremarks(cancel): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(cancel)
    // console.log("cancel Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/pocancel', data, { 'headers': headers })
  }

  public getpocancelappsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/approval_cancellist?page=" + pageNumber, { 'headers': headers, params })
  }



  // public getpocancelappsummarySearch(searchpo): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(MicroUrl + 'prserv/search_poclose', searchpo, { 'headers': headers })
  // }

  public getpoappcanceldata(id: any): Observable<any> {
    this.reset();
    // let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/get_poheader/' + id, { headers })
  }

  public getpocancelapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(approval)
    //console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/pocancelapproved', data, { 'headers': headers })
  }
  public getpocancelrejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/pocancelrejected", data, { 'headers': headers })
  }

  public getpo(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    //console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/poheader?page=" + pageNumber, { 'headers': headers, params })
  }

  public getposummarySearch(searchdel,pageno,pagesize): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/posearch?page='+pageno, searchdel, { 'headers': headers })
  }
  public getprapprovesummary(type, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    if( (type == undefined) || (type == null) || (type == "") || (type.value == "")){type = 0}
    // return this.http.get<any>(MicroUrl + "prserv/prdetailsapproved?query="+type+"?page=" + pageNumber, { 'headers': headers, params })
    return this.http.get<any>(MicroUrl + "prserv/prdetailsapproved?query="+type, { 'headers': headers, params })

  }

  public getprsummarySearch(type, searchdel, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if( (type == undefined) || (type == null) || (type == "") || (type.value == "")){type = 0}
    return this.http.post<any>(MicroUrl + 'prserv/prdetailsapprovedsearch?query='+type+"&page="+ page, searchdel, { 'headers': headers })
  }

  public getpodeliverydetails(id,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // console.log("idccbs", id)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prccbsdtl/" + id+"?page="+page, { 'headers': headers })
  }

  public getApprovalpo(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/poapprover?page=" + pageNumber, { 'headers': headers, params })
  }

  public getpoApprovalsummarySearch(searchdel,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/poapprovesearch?page='+pageno, searchdel, { 'headers': headers })
  }

  public getdetailsforPO(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //console.log("idccbs", id)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prccbsid/" + id, { 'headers': headers })
  }

  public POCreateForm(po: any, ): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(po)
    // console.log("po Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // formData.append('data', data);

    // for (var i = 0; i < filesHeadervalue.length; i++) {
    //   const addToFormData = ["file"]
    //   addToFormData.forEach(key => formData.append(key, filesHeadervalue[i]));
    // }

    // for (var i = 0; i < files.length; i++) {
    //   const addToFormData = ["file_detail"]
    //   addToFormData.forEach(key => formData.append(key, files[i]));
    // }

    // console.log("PO CREATE", formData)
    return this.http.post<any>(MicroUrl + 'prserv/poheader', po, { 'headers': headers })
  }
  public POCreateFormNew(po: any, ): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/po_create', po, { 'headers': headers })
  }

  // public getpodetailsforPOsummary(id): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   console.log("po single get details for summary popup", id)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/posummary_get/" + id, { 'headers': headers })
  // }
  public getsupplier(supplierkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'venserv/search_suppliername?sup_id=&name=' + supplierkeyvalue, { 'headers': headers })
  }
  public getsupplierDD(supplierkeyvalue, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'prserv/pr_supplier?query=' + supplierkeyvalue + '&page=' + page, { 'headers': headers })
  }
  
  public getsupplierFK(supplierkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'venserv/search_suppliername?sup_id=&name=' + supplierkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public getPoProductList(id, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //console.log("po single get details for summary popup", id)
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/poheader_get/"+id+"?page="+pageNumber, { 'headers': headers, params })
  }


  public getPoDeliveryList(headerID, detailID,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //console.log("po single get details for summary popup", id)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/productdelivery_get/"+headerID+"/"+detailID+"?page="+page, { 'headers': headers })
  }

  public getPoapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(approval)
    //console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/poapproved', data, { 'headers': headers })
  }
  public getPorejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/poreject", data, { 'headers': headers })
  }

  public meptotalget(expense, par): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + 'prserv/search_par?exp_type=' + expense + '&no=' + par, { 'headers': headers })
    return this.http.get<any>(MicroUrl + 'prserv/par_utilized_Mep?query='+par+'&exptype='+ expense, { 'headers': headers })
  }

  public fileDownloads(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id, { 'headers': headers, responseType: 'blob' as 'json' })

  }

  public fileDownloadpo(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id, { 'headers': headers, responseType: 'blob' as 'json' })

  }

  public fileDownloadspar(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id, { 'headers': headers, responseType: 'blob' as 'json' })

  }



  public grnsummarySearch(searchgrn,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_grndetail?page='+pageno, searchgrn, { 'headers': headers })
  }

  public transactionget(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/grntran/' + id, { 'headers': headers })
  }


  public getgrncloseapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/grnupdateapproved', approval, { 'headers': headers })
  }


  public rcnupdate(rcn): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'pdserv/rcn_update', rcn, { 'headers': headers })
  }

  public grnflag(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/grnrems/' + id, { 'headers': headers })
  }
  public getgrncloserejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/grnupdaterejected", data, { 'headers': headers })
  }



  public deliverydetailssummary(pageNumber = 1, pageSize = 10, pocancelmakerid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //  console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/podtlid/" + pocancelmakerid, { 'headers': headers, params })
  }


  // public APsummary(pageNumber = 1, pageSize = 10, pocancelapprovalid): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  // //  console.log(params);
  // //  console.log(headers);
  //   return this.http.get<any>(PRPOUrl + "" + pageNumber, { 'headers': headers, params })
  // }


  public getpocancelapprovalldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(approval)
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/pocancelapproved', approval, { 'headers': headers })
  }

  public getpocancelrejecttdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/pocancelrejected", data, { 'headers': headers })
  }

  public reopendeliverydetailssummary(pageNumber = 1, pageSize = 10, poreopenid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //  console.log(params);
    //  console.log(headers);
    return this.http.get<any>(PRPOUrl + "" + pageNumber, { 'headers': headers, params })
  }

  //grn inward coding starting part-------------------------------------//

  public getgrnsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //  console.log(params);
    //  console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/grninward", { 'headers': headers, params })
  }

  public getgrncreatesummarySearch(searchgrninward, pageNumber = 1, pageSize = 10): Observable<any> {

    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //  console.log(params);
    // console.log(headers);
    return this.http.post<any>(MicroUrl + 'prserv/search_grnlist', searchgrninward, { 'headers': headers, params })
  }

  public getrcninwardsummarySearch(searchgrn): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_rcninward', searchgrn, { 'headers': headers })
  }

  public transactionhistorysummary(pageNumber = 1, pageSize = 10, grnid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    ////  console.log(params);
    //  console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/grntran/" + grnid, { 'headers': headers, params })



  }

  public getgrnView(GRNID): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/grninwardviews/" + GRNID, { 'headers': headers })
  }
  // prserv/grninwardview/
  public getgrndetailsviewsummary(pageNumber = 1, pageSize = 10, grnid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/grninwardviews/" + grnid, { 'headers': headers, params })
  }
  public getgrndetailsfileviewsummary(pageNumber, pageSize, grnid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    //console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/grninward/" + grnid, { 'headers': headers, params })
  }
  // prserv/grnindetail

  public assetdetailssummary(pageNumber = 1, pageSize = 10, grndetailsviewid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return
    // return this.http.get<any>(PRPOUrl + "" + pageNumber, { 'headers': headers, params })
  }


  //grn create screen summary---------///

  // public getgrninwardsummary(pageNumber = 1, pageSize = 10): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //   console.log(params);
  //   console.log(headers);
  //   return this.http.get<any>(MicroUrl + "prserv/search_grnlist", { 'headers': headers, params })
  // }

  public getgrninwardView(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "venserv/supplierbranch/" + id, { 'headers': headers })
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
    return this.http.get<any>(PRPOUrl + 'venserv/search_suppliername?sup_id=' + id + '&name=' + suppliername, { headers })
  }


  public getbranchname(branchcode): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchcode === null) {
      branchcode = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    // let urlvalue = PRPOUrl + 'venserv/search_suppliername?query=' + suppliername;
    return this.http.get<any>(PRPOUrl + 'usrserv/search_branch?query=' + branchcode, { headers })

  }



  // public grnCreateForm(GRN, files): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let formData = new FormData();
  //   // if (id == "") {
  //   this.grnADDJson = GRN;
  //   this.grnADDJson = Object.assign({}, GRN)
  //   // } 
  //   formData.append('data', JSON.stringify(this.grnADDJson));
  //   if(files != null || files != undefined ){
  //   for (var i = 0; i < files.length; i++) {
  //     formData.append("file1", files[i]);
  //   }}
  //   return this.http.post<any>(MicroUrl + 'prserv/grninward', formData, { 'headers': headers })
  // }

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
    return this.http.get<any>(MicroUrl + 'venserv/search_supplier?code=' + searchsupplier.code + '&panno=' + searchsupplier.panno + '&gstno=' + searchsupplier.gstno, { 'headers': headers })
  }

  public fileDownloadsgrnmaker(id: number) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id ,{ 'headers': headers, responseType: 'blob' as 'json' })
  }
  // }
  // public downloadfile(id: number) {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   let idValue = id;
  //   const headers = { 'Authorization': 'Token ' + token }
  //    window.open(PRPOUrl+'venserv/vendor_attactments/'+idValue+"?token="+token, '_blank');
  //   } 

  //____________________________________________________________________________________
  public getgrn(pageNumber = 1, pageSize = 10): Observable<any> {

    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/grndetail?page=" + pageNumber, { 'headers': headers, params })
  }

  public grndetail(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/grndetailview/' + id, { 'headers': headers })
  }

  public grnapprove(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/grnupdateapproved', id, { 'headers': headers })
  }

  public grnreject(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/grnupdaterejected', id, { 'headers': headers })
  }
  public getbrsummarydata(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const id =1;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/branchrequest_maker_summary?is_summary="+ id , { 'headers': headers })
  }

  public product(id, namevalue,page=1): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/productdelivery_get/'+id+"/"+namevalue+"?page="+page, { 'headers': headers })
  }

  public grnproduct(id,page=1): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poheader_get/' + id+'?page='+page, { 'headers': headers })

  }
  // ---PR start--
  public getprsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);

    return this.http.get<any>(MicroUrl + "prserv/prheader?page=" + pageNumber, { 'headers': headers })
  }

  public getprtransummary(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prtran/" + id, { 'headers': headers })
  }


  public getbrtransummary(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/pr_branch_tran/"+ id, { 'headers': headers })
  }


  public getdetails(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prhdrdtl/" + id, { 'headers': headers })
  }


  public getproductcat(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/pdtcat", { 'headers': headers })
  }

  public getproducttype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/pdttype", { 'headers': headers })
  }

  // public getproduct(): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(PRPOUrl + "mstserv/product", { 'headers': headers })
  // }

  public getcommoditypro(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "mstserv/commodity", { 'headers': headers })
  }
    public getproductdata(data,page,type): Observable<any> {
      // console.log('product=', data);
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      // params = params.append('filter', filter);
      // params = params.append('sortOrder', sortOrder);
      // params = params.append('page', pageNumber.toString());
      // params = params.append('pageSize', pageSize.toString());
      if(type){
        return this.http.get<any>(MicroUrl + "mstserv/producttype_get_product/"+type+"?query="+data + "&page="+ page, {'headers': headers })
      } else {
      return this.http.get<any>(PRPOUrl + "mstserv/product_search?page=" + page + "&query=" + data, { 'headers': headers });
      }
  
    }
  // public getsupplierproduct(id): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let idValue = id.id
  //   return this.http.get<any>(MicroUrl + "prserv/product_search?product_id" +'=' + idValue, { 'headers': headers })
  // }

  public getemployeebranch(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/employeebranch", { 'headers': headers })
  }
  public getcommodityproduct(ids: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let id = ids
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/cpMap/' + id, { 'headers': headers })
  }

  public getemployee(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/delmat", { 'headers': headers })

  }

  public getbslist(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/businesssegment", { 'headers': headers })
  }

  public getcclist(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "usrserv/costcentre", { 'headers': headers })
  }


  public PRcreateForm(PR: any, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(PR)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    let prdetail = {
      "prdetails": name
    }
    let Json = Object.assign({}, PR, prdetail)
    //  console.log("js",Json)
    return this.http.post<any>(MicroUrl + "prserv/prsearch", Json, { 'headers': headers })
  }

  public getapproversummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(MicroUrl + "prserv/prapprovesummary?page=" + pageNumber, { 'headers': headers, params })
  }

  public getapprover(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prdtl/" + id, { 'headers': headers })
  }
  public getpredit(id,pagenumber): Observable<any> {  
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prhdrdtl/" + id+'?page='+pagenumber, { 'headers': headers })
  }
  public getprapproval(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(approval)
    //  console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/prapprover', data, { 'headers': headers })
  }
  public getprreject(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/prreject", data, { 'headers': headers })
  }
  public getprreturn(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/prreject", data, { 'headers': headers })
  }
  public prCreateForm(pr: any,service): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(pr)
    //  console.log("com Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // formData.append('data', data);

    // for (var i = 0; i < imagesHeader.length; i++) {
    //   const addToFormData = ["file_detail"]
    //   addToFormData.forEach(key => formData.append(key, imagesHeader[i]));
    // }
    // let typeCatlogOnly = pr.type
    // if( typeCatlogOnly == 1  ) {
    // for (var i = 0; i < images.length; i++) {
    //   const addToFormData = ["file"]
    //   addToFormData.forEach(key => formData.append(key, images[i]));
    // }}
    // return this.http.post<any>(MicroUrl + 'prserv/prheader', pr, { 'headers': headers })
    // return this.http.post<any>(MicroUrl + 'prserv/pr_update', pr,ccbs_bfile_id { 'headers': headers }) //7420
    // if(service == true){
    //   return this.http.post<any>(MicroUrl + 'prserv/sr_create', pr, { 'headers': headers })
    // } else {
    return this.http.post<any>(MicroUrl + 'prserv/pr_update', pr, { 'headers': headers })
    // }

    








  }
  public batchprcrete(pr: any,service): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(pr)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/consolitated_bpr', pr, { 'headers': headers })
  }
  // public prDraftForm(com: any,images:any): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   let data = JSON.stringify(com)
  //  // console.log("com Data", data)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let formData = new FormData();
  //   formData.append('data', data);
  // for (var i = 0; i < images.length; i++) {
  //   formData.append("file", images[i]);
  // }
  //   return this.http.post<any>(MicroUrl + 'prserv/prdraft', formData, { 'headers': headers })
  // } 

  public getprSearch(search, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/prsearch?page='+ page, search, { 'headers': headers })
  }

  public getbrSearch(search,pageno):
  Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/branchrequest_maker_summary?is_summary=1&page='+pageno,search,{ 'headers': headers })
  }

  // http://192.168.1.18:8000/prserv/branchrequest_maker_summary?is_summary=1&page=1
  public getapSearch(search,pageno):
  Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl +'prserv/branchrequest_approver_summary?is_summary=1&page='+pageno,search,{ 'headers': headers })
  }
  // http://192.168.5.119:8000/prserv/branchrequest_approver_summary?is_summary=1&page=1
  public getbrAPSearch(pageno):
  Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl +'prserv/branchrequest_approver_summary?is_summary='+pageno,{},{ headers })
  }


  public getbrFSearch(pageno):
  Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/branchrequest_maker_summary?is_summary='+pageno,{},{ headers })
  }


  public getapprove(obj):
  Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/branch_request_action',obj,{ 'headers': headers })
  }

  public getreturn(obj):
  Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/branch_request_action',obj,{ 'headers': headers })
  }
  // http://192.168.5.119:8000/prserv/branch_request_action
  public getreject(obj):
  Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/branch_request_action',obj,{ 'headers': headers })
  }

  public getprapproverSearch(search, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/prapproversearch?page='+page, search, { 'headers': headers })
  }
  public getmepno(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/mep", { 'headers': headers })
  }
  public filedownloads(id: number) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    window.open(MicroUrl + 'prserv/prpo_filedownload/' + id + "?token=" + token, '_blank');
  }
  public getemployeeApproverforPR(commodityID,): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if( (commodityID == "") || (commodityID == undefined) || (commodityID == null)){
      commodityID = 0
    }
    return this.http.get<any>(MicroUrl + "prserv/search_employeelimit?commodityid=" + commodityID + "&type=PR&employee=", { 'headers': headers })
  }
  // ---PR End--
  public getproducttermsList(data,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = { "type": "P" }
    //  console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/potemptype?page='+page, data, { 'headers': headers })
  }
  public getproductterms(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = { "type": "P" }
    //  console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/potemptype', data, { 'headers': headers })
  }
  public getservicetermsList(data,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = { "type": "S" }
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/potemptype?page='+page, data, { 'headers': headers })
  }
  public getserviceterms(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = { "type": "S" }
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/potemptype', data, { 'headers': headers })
  }


  public getTerms(page,data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = { "type": "S" }
    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/template_search?page='+page+"&is_download=0", data, { 'headers': headers })
  }
  public deleteTerms(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(MicroUrl + 'prserv/poterm_del/'+ id, { 'headers': headers })
  }

  

  public POTermsCreateForm(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/potermstem', data, { 'headers': headers })
  }

  public POproductserviceCreateForm(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    // console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/poterms', data, { 'headers': headers })
  }


  // public POTermsCreForm(data): Observable<any>{
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token

  //   console.log("approval Data", data)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(MicroUrl + 'prserv/poterms', data, { 'headers': headers })
  // }

  public gettermsget(termid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/potermslist/" + termid, { 'headers': headers })
  }


  public gettermsFK(termskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/search_poterm?query=' + termskeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getterms(termskeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/search_termsname?query=" + termskeyvalue, { 'headers': headers })
  }

  public geteermslist(key): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/search_poterm?query=" + key, { 'headers': headers })
  }


  //PO Amendment
  public getpoamendsearch(ponum,pageno, dates, branch,status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let ponumdata = ponum
    let datesdata = dates 
    let branchdata = branch 

    if(ponum == '' || ponum == null || ponum == undefined){
      ponumdata = ''
    }
    if(dates == '' || dates == null || dates == undefined){
      datesdata = ''
    }
    if(branch == '' || branch == null || branch == undefined){
      branchdata = ''
    }
    console.log(ponumdata, datesdata, branchdata)
    return this.http.get<any>(MicroUrl + 'prserv/amendsearch?pono=' + ponumdata + '&podate=' + datesdata + '&branch_id='+ branchdata+'&poheader_status='+status+'&page='+pageno, { 'headers': headers })
  }
  public getpoamendmentsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/amendsummary", { 'headers': headers, params })
  }
  // public getpoheader(id): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/poheader_get/"+id, { 'headers': headers })
  // }

  // public getdeliverydetails(poheaderid,productids): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/productdelivery_get/"+poheaderid+"/"+productids, { 'headers': headers })
  // }



  // public fileDownloadspar(file_id): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + file_id, { 'headers': headers, responseType: 'blob' as 'json' })

  // }
  public gettranhistory(id: any,page=1): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/potran/" + id+"?page="+page, { 'headers': headers })
  }

  public retiredremarksPO(retiredRemarks): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/prretired', retiredRemarks, { 'headers': headers })
  }
  // public getunitPrice(idproduct, idservice, catlog): Observable<any> {
    public getunitPrice(prnum,productID,supplieridvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(PRPOUrl + "venserv/unitprice?suplier=" + idservice + "&product=" + idproduct, { 'headers': headers })
    // return this.http.get<any>(PRPOUrl + "venserv/fetch_unitprice?supplier_id="+idservice+"&product_id="+ idproduct+'&catalog='+catlog, { 'headers': headers })
    return this.http.get<any>(PRPOUrl + "prserv/fetch_unitprice?prno="+prnum +'&supplier_id='+supplieridvalue+'&product_id='+productID, { 'headers': headers }) //9803

  }
  // public getsupplierProductmapping(data, query): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   //  console.log("approval Data", data)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   // return this.http.post<any>(PRPOUrl + 'venserv/product_supplier', data, { 'headers': headers })
  //   return this.http.post<any>(PRPOUrl + 'venserv/catalogproduct_supplier?query='+CREDAI+"&page=1", data, { 'headers': headers })
  // }
  public getemployeeApproverforPO(commodityID,): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/search_employeelimit?commodityid=" + commodityID + "&type=PO&employee=", { 'headers': headers })
  }


  // public getpdfPO(poheaderid): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/po/"+poheaderid +"/pdf", { 'headers': headers})
  // }

  public getpdfPO(poheaderid) : Observable<any>{
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/po/" + poheaderid + "/pdf", { headers, responseType: 'blob' as 'json' })
    
  }
  public getrcnapprovaldata(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    // console.log("aaaaaaaaaaaaaaaaaaaapppppppppppppppppppppppppppppppppppppppppprrrrrrrrrrrrrroooovvvvvaalllll",approval)
    return this.http.post<any>(MicroUrl + 'prserv/grnupdateapproved', approval, { 'headers': headers })
    //return
  }

  // public getInwardDataForAp(ID): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + "prserv/inward/" + ID , { 'headers': headers })
  // }
  // public PostInwardDataToAP(apdata): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Bearer ' + token }
  //   //return this.http.get<any>(APDATAURL + apdata , { 'headers': headers })
  //   return this.http.post<any>(APDATAURL, apdata, { 'headers': headers })
  //  //return
  // }

  // public POEditForm(po: any, images:any,id:any): Observable<any> {
  //     this.reset();
  //     const getToken: any = localStorage.getItem('sessionData')
  //     let tokenValue = JSON.parse(getToken);
  //     let token = tokenValue.token
  //     let data = JSON.stringify(po)
  //     console.log("po Data", data)
  //     // let value = {
  //     //   "id": id,
  //     // }
  //     // let jsonValue = Object.assign({}, data)
  //     const headers = { 'Authorization': 'Token ' + token }
  //     let formData = new FormData();
  //     formData.append('data', data);
  //       // for (var i = 0; i < images.length; i++) {
  //         formData.append("file", images);
  //       // }
  //       // for (var i = 0; i < files.length; i++) {
  //       //   const addToFormData= ["file"]
  //       // addToFormData.forEach(key => formData.append(key, files[i]));
  //       // }
  //     return this.http.post<any>(MicroUrl + 'prserv/poheader', formData, { 'headers': headers })
  //   }

  public getpoheader(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/po/" + id, { 'headers': headers })
  }
  public getdeliverydetails(poheaderid, productids): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/productdelivery_get/" + poheaderid + "/" + productids, { 'headers': headers })
  }

  public POEditForm(po: any, images: any, id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(po)
    // console.log("po Data", data)
    // let value = {
    //   "id": id,
    // }
    // let jsonValue = Object.assign({}, data)
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    formData.append('data', data);
    // for (var i = 0; i < images.length; i++) {
    formData.append("file", images);
    // }
    // for (var i = 0; i < files.length; i++) {
    //   const addToFormData= ["file"]
    // addToFormData.forEach(key => formData.append(key, files[i]));
    // }
    return this.http.post<any>(MicroUrl + 'prserv/poheader', formData, { 'headers': headers })
  }

  public getrcnsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    //  console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/rcnlist", { 'headers': headers, params })
  }

  public getrcn(pageNumber = 1, pageSize = 10): Observable<any> {

    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/rcnapproval_summary?page=" + pageNumber, { 'headers': headers, params })
  }
  public getrcncreatesummarySearch(searchgrninward, pageNumber = 1, pageSize = 10): Observable<any> {

    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.post<any>(MicroUrl + 'prserv/search_rcnlist', searchgrninward, { 'headers': headers, params })
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
    return this.http.post<any>(MicroUrl + 'prserv/rcnpdfgen', rcnheaderid, { headers, responseType: 'blob' as 'json' })
    //return 
  }
  public getPaymodetype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/paymodedtllist', { 'headers': headers })
  }
  public rcnCreateForm(GRN, id, files): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    if (id == "") {
      this.grnADDJson = GRN;
      this.grnADDJson = Object.assign({}, GRN)
    }
    formData.append('data', JSON.stringify(this.grnADDJson));
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
    console.log("rcncreattttest", formData)
    return this.http.post<any>(MicroUrl + 'prserv/rcn_create', formData, { 'headers': headers })
  }

  public getrcnapproval(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/rcnupdateapproved', approval, { 'headers': headers })
    //return
  }
  public getrcnrejectdata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/rcnupdaterejected", data, { 'headers': headers })
  }
  public getLandlordInfo(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "venserv/branch/" + id + "/payment", { 'headers': headers })
  }
  public rorelease(reopen): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(reopen)
    // console.log("reopen Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/reopen', data, { 'headers': headers })
  }
  public RoHold(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/po_hold', approval, { 'headers': headers })
  }
  public getROHoldsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    //console.log(params);
    // console.log(headers);
    return this.http.get<any>(MicroUrl + "prserv/po_hold?page=" + pageNumber, { 'headers': headers, params })
  }
  public getroHoldsummarySearch(searchpo): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/search_release', searchpo, { 'headers': headers })
  }
  public RoRelease(approval): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/po_release', approval, { 'headers': headers })
  }
  public getBankGstTaxSubtaxValidation(id,ronum): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "venserv/paymentsupp/" + id+"?ro_no="+ronum, { 'headers': headers })
  }
  public getclosecanceltranhistory(id, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/" + name + "/" + id, { 'headers': headers })
  }
  //PR draft-4529
  public prDraftForm(pr: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(pr)
    // console.log("com Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // formData.append('data', data);
    // for (var i = 0; i < imagesHeader.length; i++) {
    //   const addToFormData = ["file_detail"]
    //   addToFormData.forEach(key => formData.append(key, imagesHeader[i]));
    // }
    // let typeCatlogOnly = pr.type
    // if( typeCatlogOnly == 1  ) {
    // for (var i = 0; i < images.length; i++) {
    //   const addToFormData = ["file"]
    //   addToFormData.forEach(key => formData.append(key, images[i]));
    // }}
    return this.http.post<any>(MicroUrl + 'prserv/prpo_draft', pr, { 'headers': headers })

    
  }
  public getmepFK(mepkeyvalue): Observable<any> {
    this.reset();

    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + "prserv/search_mepno?query=" + mepkeyvalue, { 'headers': headers })
    return this.http.get<any>(MicroUrl + "prserv/search_pcano?query=" + mepkeyvalue, { 'headers': headers })

  }
  public getmepFKdd(mepkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + 'prserv/search_mepno?query=' + mepkeyvalue + '&page=' + pageno, { 'headers': headers })
      return this.http.get<any>(MicroUrl + 'prserv/search_pcano?query=' + mepkeyvalue + '&page=' + pageno, { 'headers': headers })

  }
  public getmepcommodityFKdd(mepkeyvalue,commodityid ,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/search_mepno?query=' + mepkeyvalue + '&commodity_id=' +commodityid + '&page=' + pageno, { 'headers': headers })
      // return this.http.get<any>(MicroUrl + 'prserv/search_pcano?query=' + mepkeyvalue + '&commodity_id=' +commodityid + '&page=' + pageno, { 'headers': headers })

  }
  public getmepdtl(mepno: any, dataCom): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // if((mepno =="")|| (mepno ==null) || (mepno ==undefined)){
    //   mepno = "MEP1"
    // }
    // return this.http.get<any>(MicroUrl + "prserv/pr_mepno?query=" + mepno+"&commodity_id="+dataCom, { 'headers': headers })
    // prserv/utilized_Mep?mep_no=PCA21080046&commodity_id=2
    return this.http.get<any>(MicroUrl + "prserv/mep_utilized_pr?mep_no="+mepno+"&commodity_id="+dataCom, { 'headers': headers })
  }
  public getsupplierproduct(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //  console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'venserv/product_supplier', data, { 'headers': headers })
  }
  //PR End

  public POAmendmentForm(po: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(po)
    // console.log("po Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/poamend', data, { 'headers': headers })
  }

  public getcclistDependentBs(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((id == null) || (id == undefined) || (id == "")) {
      return
    }
    return this.http.get<any>(PRPOUrl + "usrserv/searchbs_cc?bs_id=" + id + "&query=", { 'headers': headers })
  }

  public getcclistDependentBsdd(id, keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((id == null) || (id == undefined) || (id == "")) {
      return
    }
    return this.http.get<any>(PRPOUrl + 'usrserv/searchbs_cc?bs_id=' + id + '&query=' + keyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getemployeeLimitSearchPO(commodityID, empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((commodityID == "") || (commodityID == null) || (commodityID == undefined)) {
      commodityID = 0
    }
    return this.http.get<any>(MicroUrl + "prserv/search_employeelimit?commodityid=" + commodityID + "&type=PO&employee=" + empkeyvalue, { 'headers': headers })
  }
  public getemployeeLimitSearchPR(commodityID, empkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((commodityID == "") || (commodityID == null) || (commodityID == undefined)) {
      commodityID = 0
    }
    return this.http.get<any>(MicroUrl + "prserv/search_employeelimit?commodityid="+commodityID+"&type=PR&employee="+empkeyvalue, { 'headers': headers })
  }
  public getgrninwardsummarySearch(searchgrn,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.post<any>(MicroUrl + 'prserv/search_grndetail', searchgrn, { 'headers': headers })
    return this.http.post<any>(MicroUrl + 'prserv/search_grninward?page='+pageno, searchgrn, { 'headers': headers })
  }

  public getMepBasedcommodityOrCommodityProduct(Mepdata): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((Mepdata != "") || (Mepdata != "") || (Mepdata != "")) {
      return this.http.get<any>(MicroUrl + 'prserv/mep_dts?query=' + Mepdata, { 'headers': headers })
    } else {
      return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=', { 'headers': headers })
    }

  }

  public getMepBasedcommodityOrCommodityProductdd(pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=' + '&page=' + pageno, { 'headers': headers })
  }



  public getMepCommodityproductOrCommodityProduct(Mepno, Comids: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    if (Mepno == "" && Comids == "") {
      return
    }
    else if (Mepno != "") {
      return this.http.get<any>(MicroUrl + 'prserv/mep_commodity?mep_no=' + Mepno + '&commodity_id=' + Comids, { 'headers': headers })
    }
    else {
      return this.http.get<any>(MicroUrl + 'prserv/cpMap/' + Comids, { 'headers': headers })
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////  PR
  ///////////////////////////////////////////////////////////////////////////////////////////changes for MEP and PR from here
  public getCatlog_NonCatlog(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/get_catelog_type", { 'headers': headers })
  }

  public itemreplacement(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/po_item_replacement", { 'headers': headers })
  }

  /////////////////////////////////////prodcat
  // public getproductCategory(com): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   if ((com == "") || (com == null) || (com == undefined)) {
  //     com = 0
  //   }
  //     // return this.http.get<any>(MicroUrl + "prserv/mep_pr?commodity_id="+com+"&name=", { 'headers': headers })
  //     return this.http.get<any>(MicroUrl + "prserv/commodity_product?commodity_id="+com+"&category=&name=", { 'headers': headers })
  //   }

  // public getproductCategoryFKdd(com, keyvalue, pageno): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   if ((com == "") || (com == null) || (com == undefined)) {
  //     com = 0
  //  }
  //     // return this.http.get<any>(MicroUrl + "prserv/mep_pr?commodity_id="+com+"&name="+keyvalue+"&page="+pageno, { 'headers': headers })
  //     return this.http.get<any>(MicroUrl + "prserv/commodity_product?commodity_id="+com+"&category=&name="+keyvalue+"&page="+pageno, { 'headers': headers })
  //   }

  ////////////////////prod type

  // public getproductTypeFK(commodityID,productCatIddata, keyvalue): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   if ((commodityID == null ) || (commodityID == undefined) || (commodityID == "") || (productCatIddata == undefined) ) {
  //     commodityID = 0
  //     productCatIddata =0
  //   }
  //   // return this.http.get<any>(MicroUrl + "prserv/mep_pr?commodity_id="+commodityID+"&category="+productCatIddata+"&name="+keyvalue, { 'headers': headers })
  //   return this.http.get<any>(MicroUrl + "prserv/commodity_product?commodity_id="+commodityID+"&category="+productCatIddata+"&name=", { 'headers': headers })
  // }

  // public getproductTypeFKdd(commodityID,productCatIddata, keyvalue, pageno): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   if ((commodityID == null) || (commodityID == undefined) || (commodityID == "") || (productCatIddata == undefined)) {
  //     commodityID = 0
  //     productCatIddata = 0
  //   }
  //   // return this.http.get<any>(MicroUrl + "prserv/mep_pr?commodity_id="+commodityID+"&category="+productCatIddata+"&name="+keyvalue+ '&page='+pageno, { 'headers': headers })
  //   return this.http.get<any>(MicroUrl + "prserv/commodity_product?commodity_id="+commodityID+"&category="+productCatIddata+"&name="+keyvalue+ '&page='+pageno, { 'headers': headers })
  // }


  ////////////////////prod

  // public getproductDependencyFK(com, prodcat,prodtype, dts, keyvalue): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   if ((prodtype == null) || (prodtype == undefined) || (prodtype == "")) {
  //     prodtype = 0
  //     com = 0 
  //     prodcat =0
  //   }
  //   return this.http.get<any>(MicroUrl + "prserv/commodityproduct?commodity="+com+"&product_category="+prodcat+"&product_type="+prodtype+"&dts="+dts+"&query="+ keyvalue, { 'headers': headers })
  // }
//6671 //7475assetvalue
  // public getproductDependencyFK(com,value,assetvalue,pageno): Observable<any> {
    public getproductDependencyFK(type,com,supp,dts,value,pageno,ptype): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // if (supp == undefined || supp == null || supp == ''){
    dts = (dts == undefined || dts == "" || dts == null) ? 0 : dts
      if(type==1){
        // if(com != undefined && supp == undefined && !service ){
        //   return this.http.get<any>(MicroUrl + "prserv/cpMap/"+ com +"?query="+value+"&page="+pageno ,{ 'headers': headers })
        // }
        // if(supp != undefined && com != undefined && !service ){
        //   return this.http.get<any>(MicroUrl + "prserv/product_get/"+ com + "/"+supp+ "/"+dts+"?query="+value+"&page="+pageno ,{ 'headers': headers })
        // }
        if(com != undefined && supp == undefined ){
          return this.http.get<any>(MicroUrl + "prserv/prpo_cp/"+com+"?request_type=" + ptype + "&query="+value + "&page="+ pageno, {'headers': headers })
        }
        if(com != undefined && supp != undefined ){
          return this.http.get<any>(MicroUrl + "prserv/productservice_get/"+com+"/"+supp + "/"+dts+ "?query="+value+ "&request_type=" + ptype + "&page="+ pageno, {'headers': headers })
        }
        }
        if(type==2){
          // if(com != undefined && service == false){
          //   return this.http.get<any>(MicroUrl + "prserv/cpMap/"+ com +"?query="+value+"&page="+pageno ,{ 'headers': headers })
          // }
          if(com != undefined){
            return this.http.get<any>(MicroUrl + "prserv/prpo_cp/"+com+"?request_type="+ ptype +"&query="+value + "&page="+ pageno, {'headers': headers })
          }

          }
      // }
      // if (com != undefined && supp != undefined) {
      //   if(type==1){
      //     return this.http.get<any>(MicroUrl + "prserv/product_get/"+ com + "/"+supp+ "/"+dts+"?query="+value+"&page="+pageno ,{ 'headers': headers })
      //     }
      // }
      // if (com != undefined) {
      //     if(type==2){
      //     return this.http.get<any>(MicroUrl + "prserv/cpMap/"+ com +"?query="+value+"&page="+pageno ,{ 'headers': headers })
      //   }
      
    // }
    
   
    // return this.http.get<any>(MicroUrl + "prserv/cpMap/"+ com +"?query="+value+assetvalue+"&page="+pageno ,{ 'headers': headers })
  }

  // public getproductDependencyFKdd(com, prodcat,prodtype, dts, keyvalue, pageno): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   if ((prodtype == null) || (prodtype == undefined) || (prodtype == "")) {
  //     prodtype = 0
  //     com = 0 
  //     prodcat =0
  //   }

  //   return   this.http.get<any>(MicroUrl + "prserv/commodityproduct?commodity="+com+"&product_category="+prodcat+"&product_type="+prodtype+"&dts="+dts+"&query="+keyvalue+ '&page=' + pageno, { 'headers': headers })
  //   //return this.http.get<any>(PRPOUrl + "venserv/get_product?product_type_id=" + prodtype + "&dts=" + dts + "&query=" + keyvalue + '&page=' + pageno, { 'headers': headers })
  // }
  public getproductDependencyyFKdd(type,com,dts,keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (com != undefined) {
         if(type==2){
          return this.http.get<any>(MicroUrl + "prserv/cpMap/"+ com +"?query="+keyvalue+"&page="+pageno ,{ 'headers': headers })
         }
      
    }
  
  }
  public getproductDependencyFKdd(type,com,supp,dts,keyvalue, pageno, services): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    dts = (dts == undefined || dts == "" || dts == null) ? 0 : dts

    // if (com != undefined && supp != undefined && services == false) {

    //     // if(type==1){
    //       return   this.http.get<any>(MicroUrl + "prserv/product_get/"+ com + "/"+supp+ "/"+dts+"?query="+keyvalue+"&page="+pageno, { 'headers': headers })
    //     //  }
         
      
    // }
    if(com != undefined && supp != undefined){
      return this.http.get<any>(MicroUrl + "prserv/productservice_get/"+com+"/"+supp + "/"+dts+ "?query="+keyvalue+ "&request_type=" + services +"&page="+ pageno, {'headers': headers })
    }
  
  }
  public getServiceUnitPrice(prod,supp,dts,service,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    dts = (dts == undefined || dts == "" || dts == null) ? 0 : dts
    return this.http.get<any>(MicroUrl + "venserv/catalog_service_prpo?page= "+page +"&supplier_id="+supp+"&dts="+dts+"&product_id="+prod+"&type="+service,{ 'headers': headers })
  }
  
  public getproductPDependencyFKdd(type,com,dts,keyvalue,pageno,ptype):Observable<any>{
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (com != undefined && type == 1) {
        // if(!services ){
        //   return   this.http.get<any>(MicroUrl + "prserv/cpMap/"+ com+"?query="+keyvalue+"&page="+pageno, { 'headers': headers })
        //  }
        //  if(services == true){
          return this.http.get<any>(MicroUrl + "prserv/prpo_cp/"+com+"?request_type=" + ptype +"&query="+keyvalue + "&page="+ pageno, {'headers': headers })
        // }

  }
}

  //6671
  ////////////////////items
// venserv/catalog_service_prpo?supplier_id=18700&dts=0&product_id=15876&type=2
  public getitemsDependencyFK(prod, dts, supplier): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    

    if (supplier == undefined) {
      supplier = ""
    }

      // return this.http.get<any>(PRPOUrl + "venserv/supplier_catalog?supplier_id="+supplier+"&dts="+dts+"&product_id="+prod+"&query=", { 'headers': headers })
      return this.http.get<any>(PRPOUrl + "venserv/supplier_make?supplier_id="+supplier+"&dts="+dts+"&product_id="+prod, { 'headers': headers })
      // venserv/supplier_models?supplier_id=18023&product_id=1
    // }
  }
  

  public getmodalDependency(prod,supplier,dts,make): Observable<any>{
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    if (make != undefined && supplier != undefined) {
      return this.http.get<any>(PRPOUrl + "venserv/supplier_models?supplier_id="+supplier+"&product_id="+prod+"&dts="+dts+"&make="+make+"&page=1", { 'headers': headers })
  }
}

public getModal(prod,make,page): Observable<any>{
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }

  // if (make != undefined && supplier != undefined) {
    return this.http.get<any>(PRPOUrl + "mstserv/product_makemodel?m_type=model&code="+prod+"&make_id="+make+"&page="+page, { 'headers': headers })
// }
}

public getModalserch(prod,make,keyvalue,page): Observable<any>{
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }

  // if (make != undefined && supplier != undefined) {
    return this.http.get<any>(PRPOUrl + "mstserv/product_makemodel?m_type=model&code="+prod+"&make_id="+make+"&query="+keyvalue+"&page="+page, { 'headers': headers })
// }
}


public getspecsDependency(prod,supplier,dts,make,model): Observable<any>{
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  dts = (dts == undefined || dts == "" || dts == null) ? 0 : dts
  // make = (make == undefined || make == "" || make == null) ? 0 : make
  // model = (model == undefined || model == "" || model == null) ? 0 : model
  if (prod != undefined && supplier != undefined && make != undefined && model != undefined) {
    return this.http.get<any>(PRPOUrl + "venserv/supplier_specification?supplier_id="+supplier+"&product_id="+prod+"&dts="+dts+"&make="+make+"&model="+model+"&page=1", { 'headers': headers })
} 
if (prod != undefined && supplier != undefined ){
  return this.http.get<any>(PRPOUrl + "venserv/catalog_specification_new?supplier_id="+supplier+"&product_id="+prod+"&dts="+dts+"&make=0&model=0&page=1", { 'headers': headers })
}
// venserv/catalog_specification_new?supplier_id=18700&product_id=15876&dts=0&make=0&model=0&page=1






}
// public Branchcreate(data: any): Observable<any> {
//   this.reset();
//   const getToken = localStorage.getItem("sessionData");
//   let tokenValue = JSON.parse(getToken);
//   let token = tokenValue.token;
//   console.log("activitydetail", JSON.stringify(data));
//   const headers = new HttpHeaders({
//     'Authorization': 'Token ' + token,
//     'Content-Type': 'application/json'
//   });

//   return this.http.post<any>(PRPOUrl + "prserv/pr_branch_create", data, { headers });
// }
public Branchcreate(data: FormData): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  // console.log("activitydetail", JSON.stringify(data));
  const headers = new HttpHeaders({
    'Authorization': 'Token ' + token
    // 'Content-Type': 'application/json' // Do not set this header when using FormData
  });

  return this.http.post<any>(PRPOUrl + "prserv/branch_request_create_new", data, { headers });
}
// http://192.168.1.18:8000/prserv/branchrequest_create
public MakerEdit(id: any,pageNumber = 1, pageSize = 10): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  let params: any = new HttpParams();
  params = params.append('page', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + "prserv/branchrequest_edit/"+id+"?page="+pageNumber, {'headers': headers, params })
}
// http://127.0.0.1:8000/prserv/branchrequest_edit/11
public getMake(prod,key,pageno): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
 
  // if (prod != undefined && supplier != undefined) {
  //   supplier = supplier.id
    return this.http.get<any>(PRPOUrl + "mstserv/product_makemodel?m_type=make&code="+prod+"&query="+key+ '&page=' + pageno, { 'headers': headers })
  // }

}



  public getitemsDependencyFKdd(prod, dts,supplier,key, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    if (prod != undefined && supplier != undefined) {
      supplier = supplier.id
      return this.http.get<any>(PRPOUrl + "venserv/supplier_catalog?supplier_id="+supplier+"&dts="+dts+"&product_id="+prod+"&query="+key+ '&page=' + pageno, { 'headers': headers })
    }
  
  }
  
  public getmodelDependencyFKdd(prod,supplier,dts,make,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    if (prod != undefined && supplier != undefined) {
      return this.http.get<any>(PRPOUrl + "venserv/supplier_models?supplier_id="+supplier+"&product_id="+prod+"&dts="+dts+"&make="+make+"&page="+pageno,{ 'headers': headers })
    }
  
  }




  public getspecsDependencyFKdd(prod,supplier,dts,make,model,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    if (prod != undefined && supplier != undefined) {
      return this.http.get<any>(PRPOUrl + "venserv/supplier_models?supplier_id="+supplier+"&product_id="+prod+"&dts="+dts+"&make="+make+"&model="+model+"&page="+pageno,{ 'headers': headers })
    }
  
  }


  ////////////////////commodity

  public getcommodityDependencyFK(mep, keyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((mep == null) || (mep == undefined) || (mep == "")) {
      return this.http.get<any>(PRPOUrl + "mstserv/searchcommodity?query=", { 'headers': headers })
    }
    else {
      return this.http.get<any>(MicroUrl + "prserv/mep_pr?mep_no="+mep+"&name="+keyvalue, { 'headers': headers })
    }
  }

  public getcommodityDependencyFKdd(mep, keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((mep == null) || (mep == undefined) || (mep == "")) {
      return this.http.get<any>(PRPOUrl + "mstserv/searchcommodity?query=" + keyvalue + '&page=' + pageno, { 'headers': headers })
    }
    else {
      return this.http.get<any>(MicroUrl + "prserv/mep_pr?mep_no="+mep+"&name="+keyvalue+'&page='+pageno, { 'headers': headers })
    }
  }

  ////////////////////supplier

  public getsupplierDependencyFK(product_id, dts): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if( (dts == null) || (dts == undefined) || (dts == "")    ){
      return this.http.get<any>(PRPOUrl+"venserv/product_dts?product_id="+product_id, {'headers': headers })   
    }

    // if(type == 1 && productID !="" && (catvalue == "" || catvalue == undefined)){
    //   return this.http.get<any>(PRPOUrl+"venserv/product_dts?product_id="+productID+"&dts="+dts+"&query=" , { 'headers': headers })
    // }
      // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query=", {'headers': headers })
      return this.http.get<any>(PRPOUrl+"venserv/product_dts?product_id="+product_id+"&dts="+dts, {'headers': headers })   
  }
  public getsupplierDependencyFK1(productID,dts,type,service,quot,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // if( (productID == null) || (productID == undefined) || (productID == "")    ){
    //   productID = 0
    // }
    dts = (dts == undefined || dts == "" || dts == null) ? 0 : dts
    if(productID != undefined && type == 1 && quot == 1){
      return this.http.get<any>(PRPOUrl+"venserv/prpo_catelog_supplier?product_id=" +productID +"&type="+ service +"&dts=" + dts + "&page=" + page, {'headers': headers })
    }
    // else if(productID != undefined && type == 1 && !service){
    //   return this.http.get<any>(PRPOUrl+"venserv/product_dts?product_id="+productID+"&dts="+dts+"&query=" , { 'headers': headers })
    // }
    else{ // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query=", {'headers': headers })
      return this.http.get<any>(PRPOUrl+"venserv/supplier_list?query=", {'headers': headers })
    }
  }

  public getsupplierDependencyFKdd1(keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // if( (productID == null) || (productID == undefined) || (productID == "")    ){
    //   productID = 0
    // }
    // if( (catvalue == null) || (catvalue == undefined) || (catvalue == "")    ){
    //   catvalue = 0
    // }
  //   if(type == 1 && productID !="" && (catvalue == "" || catvalue == undefined)){
  //     return this.http.get<any>(PRPOUrl+"venserv/product_dts?product_id="+productID+"&dts="+dts+"&query="+ keyvalue + '&page=' + pageno, { 'headers': headers })
  //   }
  //   if(type == 1 && (catvalue != "" || catvalue != undefined)){
  //   return this.http.get<any>(PRPOUrl+"venserv/catalog_supplier?product_id="+productID+"&catalog="+catvalue+"&dts="+dts+"&query="+keyvalue+'&page=' + pageno, { 'headers': headers })
  // }
  // if(type == 2){
    // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query="+keyvalue+'&page='+pageno, { 'headers': headers })
    return this.http.get<any>(PRPOUrl+"venserv/supplier_list?query="+keyvalue+'&page='+pageno, { 'headers': headers })

  // }
}

  public getsupplierDependencyFKdd(product, dts, keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // if( (productID == null) || (productID == undefined) || (productID == "")    ){
    //   productID = 0
    // }
    // if( (catvalue == null) || (catvalue == undefined) || (catvalue == "")    ){
    //   catvalue = 0
    // }
  //   if(type == 1 && productID !="" && (catvalue == "" || catvalue == undefined)){
  //     return this.http.get<any>(PRPOUrl+"venserv/product_dts?product_id="+productID+"&dts="+dts+"&query="+ keyvalue + '&page=' + pageno, { 'headers': headers })
  //   }
  //   if(type == 1 && (catvalue != "" || catvalue != undefined)){
  //   return this.http.get<any>(PRPOUrl+"venserv/catalog_supplier?product_id="+productID+"&catalog="+catvalue+"&dts="+dts+"&query="+keyvalue+'&page=' + pageno, { 'headers': headers })
  // }
  // if(type == 2){
    // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query="+keyvalue+'&page='+pageno, { 'headers': headers })
    return this.http.get<any>(PRPOUrl+"venserv/product_dts?query="+keyvalue+'&page='+pageno+'&product_id='+product+'&dts='+dts, { 'headers': headers })

  // }
}


public getsupplierPDependencyFKdd(prod,dts,keyvalue, pageno,service,quot): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  dts = (dts == undefined || dts == "" || dts == null) ? 0 : dts
  if(prod != undefined && quot == 1){
    return this.http.get<any>(PRPOUrl+"venserv/prpo_catelog_supplier?query="+keyvalue+ "&product_id=" +prod +"&type="+ service +"&dts=" + dts + "&page=" +pageno, {'headers': headers })
  } 
  else {
    return this.http.get<any>(PRPOUrl+"venserv/supplier_list?query="+keyvalue+"&page="+pageno, {'headers': headers })

  }
  // if(prod != undefined && service == false){
  //   return this.http.get<any>(PRPOUrl+"venserv/product_dts?product_id="+prod+"&dts="+dts+"&query="+keyvalue+"&page="+pageno,{'headers': headers})
  // }
  // return this.http.get<any>(PRPOUrl+"venserv/product_dts?product_id+prod+query="+keyvalue+'&page='+pageno, { 'headers': headers })
}

  public getHSNDropDown(HSNkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/search_hsncode?query=' + HSNkeyvalue, { 'headers': headers })
  }
  public getHSNDropDownPagination(HSNkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + 'mstserv/search_hsncode?query=' + HSNkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getsupplierProductmapping(data, key): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //  console.log("approval Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.post<any>(PRPOUrl + 'venserv/product_supplier', data, { 'headers': headers })
    // if( (key == "") || (key == undefined) || (key == null)){
    //   return this.http.post<any>(PRPOUrl + 'venserv/catalogproduct_supplier?query=', data, { 'headers': headers })
    // }
    // else{
    return this.http.post<any>(PRPOUrl + 'venserv/catalogproduct_supplier?query='+key, data, { 'headers': headers })
    // }
  }

  public getParyear(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/par_year", { 'headers': headers })
  }
  public getParexpensetype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/exp_type", { 'headers': headers })
  }

  public BulkUploadPR(dataBulk: any, images: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(dataBulk)
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    formData.append('data', data);
    formData.append('file', images);
    // return this.http.post<any>(MicroUrl + 'prserv/upload_pr',formData, { 'headers': headers })
    return this.http.post<any>(MicroUrl + 'prserv/pr_details_bulk',formData, { 'headers': headers })

  }


  public DownloadExcel(){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/download_prtemplate', { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public DownloadAssetExcel(payload){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'faserv/assetid_for_grn_asset_bulk',payload, { 'headers': headers, responseType: 'blob' as 'json' })

  }
  public Bulkupload(formData): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.post<any>(MicroUrl + "prserv/grn_asset_bulk", formData, { 'headers': headers})
  
}

public fileDownloadsPoHeader(id: number) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public fileDownloadsBRHeader(id: number) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public fileDownloadsGRN(name) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/mono_view_file?file_name='+ name, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public getemployeeApproverforPRDD(commodityID,key, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((commodityID == "") || (commodityID == null) || (commodityID == undefined)) {
      commodityID = 0
    }
    return this.http.get<any>(MicroUrl + "prserv/search_employeelimit?commodityid="+commodityID+"&type=PR&employee="+key+'&page='+page, { 'headers': headers })
  }

  public getpdfPR(prheaderid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/pr/" + prheaderid + "/pdf", { headers, responseType: 'blob' as 'json' })
  }

  public getbarcodePO(poheaderid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + "prserv/assest_header?po_id=" + poheaderid + "&type=Header&name=Barcode", { 'headers':headers})
    // return this.http.get<any>(MicroUrl + "prserv/fa_asset_details?po_id=" + poheaderid + "&query=ALL_BARCODE", { 'headers':headers})
    return this.http.get<any>(MicroUrl + "prserv/prpo_fa_asset?po_id=" + poheaderid + "&query=PO_BARCODE", { 'headers':headers})
    // prserv/prpo_fa_asset?po_id=5232&detail_id=5351&query=PO_BARCODE

}
 
  // public gettingUnitpricePR(catlogname, supplierID, productID): Observable<any>{
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(PRPOUrl + "venserv/catalog_unitprice?catalog="+catlogname+"&supplier="+supplierID+"&product_id="+productID , { 'headers': headers })
  // }

  public getassestheader(po_id,datadetailID,type, page,currentqnty): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + "prserv/assest_header?po_id="+po_id+"&detail_id="+datadetailID+'&type='+type+"&Page_Index="+page , { 'headers': headers })
    // return this.http.get<any>(MicroUrl + "prserv/fa_asset_details?po_id="+po_id+"&detail_id="+datadetailID+'&query=PO_ASSET' , { 'headers': headers })
    return this.http.get<any>(MicroUrl + "prserv/prpo_fa_asset?po_id="+po_id+"&detail_id="+datadetailID+'&query=PO_ASSET&page='+page+'&received=0'+ '&current_qty=' + currentqnty
    , { 'headers': headers })
    // prserv/prpo_fa_asset?po_id=5232&detail_id=5351&query=PO_ASSET
  }


  public getprdetails(id: any, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //console.log("po single get details for summary popup", id)
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/prdetail_get/"+id, {'headers': headers, params })
  }


  public getbrdetails(id: any, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/branchrequest_edit/"+id+"?page="+pageNumber, {'headers': headers, params })
  }


  // branchrequest_edit


 public getGrnAssetdata1(detailId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/grn_asset_popup/"+detailId, { 'headers': headers })
  }
  // prserv/grn_asset_popup/4970
  public getGrnAssetdata(pageNumber = 1, pageSize = 10, detailId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    
    return this.http.get<any>(MicroUrl + "prserv/grn_asset_popup/"+detailId+"?page="+ pageNumber, { 'headers': headers, params })
  }

  public getemployeeLimitSearchPODD(commodityID, empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/search_employeelimit?commodityid=" + commodityID + "&type=PO&employee=" + empkeyvalue+ '&page=' + pageno,{ 'headers': headers })
  }

  public getbarcodePOIndividual(poheaderid, detailId): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(MicroUrl + "prserv/assest_header?po_id="+poheaderid+"&detail_id="+detailId+"&type=Headers&name=Barcode", { 'headers':headers})
    // return this.http.get<any>(MicroUrl + "prserv/fa_asset_details?po_id="+poheaderid+"&detail_id="+detailId+"&query=GET_BARCODE", { 'headers':headers})
    return this.http.get<any>(MicroUrl + "prserv/prpo_fa_asset?po_id="+poheaderid+"&detail_id="+detailId+"&query=PO_BARCODE", { 'headers':headers})
    // prserv/prpo_fa_asset?po_id=5232&detail_id=5351&query=PO_BARCODE

}

public getcommodityFKkey(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=', { 'headers': headers })
}
public getbranchdd(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(PRPOUrl + "usrserv/search_branch?query=", { 'headers': headers })
}
public getbsvaluedd(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(PRPOUrl + "usrserv/searchbusinesssegment?query=", { 'headers': headers })
}
public getcommoditydd(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(PRPOUrl + 'mstserv/searchcommodity?query=', { 'headers': headers })
}

public getsupplierDropdown(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query=", {'headers': headers })
  return this.http.get<any>(PRPOUrl+"venserv/supplier_list?query=", {'headers': headers })

}
public getsupplierDropdownFKdd(keyvalue, pageno): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  keyvalue == undefined || typeof keyvalue == "object" ? keyvalue = "" : keyvalue

  // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query="+ keyvalue + '&page=' + pageno, { 'headers': headers })
  return this.http.get<any>(PRPOUrl+"venserv/supplier_list?query="+ keyvalue + '&page=' + pageno, { 'headers': headers })

}

public GRRPDf(id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/grn/"+id+"/pdf", { headers, responseType: 'blob' as 'json' })
  }


public getEmpBranchId(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let id = tokenValue.employee_id;
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(PRPOUrl + "usrserv/emp_empbranch/"+id, { 'headers': headers })
}


public pdfPopupJustificationNote(poheaderid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/po_notepad/" + poheaderid + "/pdf", { headers, responseType: 'blob' as 'json' })
    // return this.http.get<any>(MicroUrl + "prserv/download_po_justification/" + poheaderid, { headers, responseType: 'blob' as 'json' })
  }

  public pardelete(idTodelete): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + "prserv/par_delete", idTodelete, { 'headers': headers })
  }

  public PAReditFormSubmit(par: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/par_update', par, { 'headers': headers })
  }

  public MEPmakerUpdate(mep: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(mep)
    // console.log("mep Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/mep_update', data, { 'headers': headers })
  }

  public getPRStatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "prserv/get_allstatus/3", { 'headers': headers })
  }
  public getuomFK(mepkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "mstserv/uom_search?query=" + mepkeyvalue, { 'headers': headers })
  }
  public getuomFKdd(mepkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'mstserv/uom_search?query=' + mepkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public getPARMakerExcel(bpano,bpadesc,bpadate,bpaamount,bpayear,par_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/par_maker_report?no='+bpano+'&desc='+bpadesc+'&date='+bpadate+'&amount='+bpaamount+'&year='+bpayear+'&par_status='+par_status,{ headers, responseType: 'blob' as 'json' })
    // return this.http.post<any>(MicroUrl + 'prserv/par_maker?is_summary=0', searchdel, { 'headers': headers })
   }

   public getPARCheckerExcel(bpano,bpadesc,bpadate,bpaamount,bpayear,par_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/par_checker_report?no='+bpano+'&desc='+bpadesc+'&date='+bpadate+'&amount='+bpaamount+'&year='+bpayear+'&par_status='+par_status,{ headers, responseType: 'blob' as 'json' })
   }

   public getMEPMakerExcel(mepno,mepname,mepamt,mepyear,mepbudget,mep_status,mepparno): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/mep_maker_report?no='+mepno+'&name='+mepname+'&amount='+mepamt+'&finyear='+mepyear+'&budgeted='+mepbudget+'&mep_status='+mep_status+'&parno='+mepparno,{ headers, responseType: 'blob' as 'json' })
   }

   public getMEPCheckerExcel(mepno,mepname,mepamt,mepyear,mepbudget,mep_status,mepparno): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/mep_approver_report?no='+mepno+'&name='+mepname+'&amount='+mepamt+'&finyear='+mepyear+'&budgeted='+mepbudget+'&mep_status='+mep_status+'&parno='+mepparno,{ headers, responseType: 'blob' as 'json' })
   }

   public getPRMakerExcel(prno,prstatus,branchid,supid,pramt,mepno,prdate,commodity_id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/pr_maker_report?no='+prno+'&prheader_status='+prstatus+'&branch_id='+branchid+'&supplier_id='+supid+'&amount='+pramt+'&mepno='+mepno+'&date='+prdate+'&commodity_id='+commodity_id,{ headers, responseType: 'blob' as 'json' })
   }


  //  public getBRMakerExcel(Summary,branch,commodity,product,quantity): Observable<any> {
  //   this.reset();
  //   let token = '';
  //   const getToken = localStorage.getItem("sessionData");
  //   if (getToken) {
  //     let tokenValue = JSON.parse(getToken);
  //     token = tokenValue.token
  //   }
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(MicroUrl + 'prserv/pr_branch_maker?is_summary='+Summary+'&branch_id='+branch+'&commodity_id='+commodity+'&product_id='+product+'qty='+quantity,{ headers, responseType: 'blob' as 'json' })
  //  }
   
  public getBRMakerExcel(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token;
    }
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(MicroUrl + 'prserv/branchrequest_maker_summary?is_summary=0',data,{ headers, responseType: 'blob' as 'json' });
}


public getBRAppMakerExcel(data): Observable<any> {
  this.reset();
  let Summary = 0;
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
  }
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(MicroUrl + 'prserv/branchrequest_approver_summary?is_summary='+Summary,data, { headers, responseType: 'blob' as 'json' });
}



   public getPRCheckerExcel(prno,prstatus,branchid,supid,pramt,mepno,prdate,commname): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/pr_approver_report?no='+prno+'&prheader_status='+prstatus+'&branch_id='+branchid+'&supplier_id='+supid+'&amount='+pramt+'&mepno='+mepno+'&date='+prdate+'&commodityname='+commname,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOMakerExcel(pono,poname,poamount,branchid,notetitle,poheader_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/po_maker_report?no='+pono+'&name='+poname+'&amount='+poamount+'&branch_id='+branchid+'&note_title='+notetitle+'&poheader_status='+poheader_status,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOApproverExcel(pono,poname,poamount,branchid,notetitle,poheader_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/po_approver_report?no='+pono+'&name='+poname+'&amount='+poamount+'&branch_id='+branchid+'&note_title='+notetitle+'&poheader_status='+poheader_status,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOAmendmentExcel(no,name,amount,branchid,poheader_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poamend_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid+'&poheader_status='+poheader_status,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOCancelMakerExcel(no,name,amount,branchid,poheader_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/pocancel_maker_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid+'&poheader_status='+poheader_status,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOCancelApproverExcel(no,name,amount,branchid,poheader_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/pocancel_approver_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid+'&pocancel_status='+poheader_status,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOCloseMakerExcel(no,name,amount,branchid,poheader_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poclose_maker_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid+'&poheader_status='+poheader_status,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOCloseApproverExcel(no,name,amount,branchid,status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/poclose_approver_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid+'&poclose_status='+status,{ headers, responseType: 'blob' as 'json' })
   }

   public getPOReopenExcel(no,name,amount,branchid,poheader_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/po_reopen_report?no='+no+'&name='+name+'&amount='+amount+'&branch_id='+branchid+'&poheader_status='+poheader_status,{ headers, responseType: 'blob' as 'json' })
   }

   public getGRNMakerExcel(no,supname,fromdate,todate,branchid,grn_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/grn_maker_report?no='+no+'&suppliername='+supname+'&fromdate='+fromdate+'&todate='+todate+'&branch_id='+branchid+'&grn_status='+grn_status,{ headers, responseType: 'blob' as 'json' })
   }

   public getGRNApproverExcel(no,supname,fromdate,todate,branchid,grn_status): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + 'prserv/grn_approver_report?no='+no+'&suppliername='+supname+'&fromdate='+fromdate+'&todate='+todate+'&branch_id='+branchid+'&grn_status='+grn_status,{ headers, responseType: 'blob' as 'json' })
   }

   public getbpaStatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "prserv/get_allstatus/1", { 'headers': headers })
  }

  public getpcaStatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "prserv/get_allstatus/2", { 'headers': headers })
  }
  public getpoStatus(po_status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "prserv/get_allstatus/"+ po_status, { 'headers': headers })
  }
  public getgrnStatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "prserv/get_allstatus/5", { 'headers': headers })
  }

  public getcontivalue(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(PRPOUrl + "prserv/contigency_value?name=par", { 'headers': headers })
  }

  // public getcontivalue(): Observable<any>{
  //   this.reset();
    //   const getToken =localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(PRPOUrl + "prserv/contigency_value?name=par", { 'headers' : headers})
  // }

  // public getPRdraftsummary(prdraft:any): Observable<any> { //draft summary no need
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(PRPOUrl + 'prserv/get_prpodraft', prdraft, { 'headers': headers })


  // }
// // for draft summary 4529
//   public getprsummary(prdraft:any,pageNumber = 1, pageSize = 10): Observable<any> {
//     this.reset();
//     const getToken: any = localStorage.getItem('sessionData')
//     let tokenValue = JSON.parse(getToken);
//     let token = tokenValue.token
//     const headers = { 'Authorization': 'Token ' + token }
//     let params: any = new HttpParams();
//     params = params.append('page', pageNumber.toString());
//     params = params.append('pageSize', pageSize.toString());
//     // console.log(params);

//     return this.http.get<any>(MicroUrl + "prserv/prheader?page=" + pageNumber, { 'headers': headers })
//   }

//BUG ID:4529 PR DRAFT EDIT

public getprDRAFTedit(id): Observable<any> {  
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + "prserv/pr_draft/" + id, { 'headers': headers })
}

// BUG ID:7420 CCBS TEMPLATE
public DownloadCCBSTemExcel(){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/ccbs_download_prtemplate', { 'headers': headers, responseType: 'blob' as 'json' })
}
//CCBS BULK UPLOAD
public BulkUploadPRCCBS(images: any,obj:any): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let data = JSON.stringify(obj)
  const headers = { 'Authorization': 'Token ' + token }
  let formData = new FormData();
  formData.append('data', data);
  formData.append('file', images);
  return this.http.post<any>(MicroUrl + 'prserv/upload_pr_ccbs',formData, { 'headers': headers })
}

//
public DownloadCCBSErrorExcel(filekey){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/prccbs_dwld/'+filekey, { 'headers': headers, responseType: 'blob' as 'json' })
}

public prapproverdeliveryccbsexcel(Id){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/prccbsbulk_dwld/'+Id, { 'headers': headers, responseType: 'blob' as 'json' })
}
//7420

//7421
public prapproverblkexcel(id){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/prdetlsbulk_dwld/'+id, { 'headers': headers, responseType: 'blob' as 'json' })
}
//for PRSUMMARY overall bulkupload View Download
prsummaryexldwn(Id){
   this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // return this.http.get<any>(MicroUrl + 'prserv/prpo_download_file/'+Id, { 'headers': headers, responseType: 'blob' as 'json' })
  return this.http.get<any>(MicroUrl + 'prserv/prdetlsbulk_dwld/'+Id, { 'headers': headers, responseType: 'blob' as 'json' })

}

public DownloadheaderErrorExcel(filekey){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/prdetail_dwld/'+filekey, { 'headers': headers, responseType: 'blob' as 'json' })
}
//7421

//7420 //for delivery details bulk upload
public getdeliverydetailspatch(id,pageNumber): Observable<any> {  
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/prccbs_get/' + id+"?page="+pageNumber, { 'headers': headers })

}

//7421 edit view
public preditview(id: any, pageNumber): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  //console.log("po single get details for summary popup", id)
  let params: any = new HttpParams();
  params = params.append('page', pageNumber.toString());
  // params = params.append('pageSize', pageSize.toString());
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + "prserv/get_pr_details/"+id+"?page="+pageNumber, {'headers': headers, params })
}
//BUG ID:7809
public prsummarygerpo(id): Observable<any> {  
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/get_pr_podetails/' + id, { 'headers': headers })
  // return this.http.get<any>(MicroUrl + 'prserv/get_pr_podetails/' + id+pagenumber { 'headers': headers })

  // return this.http.get<any>(PRPOUrl + "mstserv/commodity?page=" + pageNumber, { 'headers': headers, params })
}
//BUG ID:7422
public DraftNOnctlgExceldownld(draftid,fileid){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/draft_details_bulk_dwld/'+draftid+'?prdetails_bfile_id='+fileid, { 'headers': headers, responseType: 'blob' as 'json' })
}

public DraftctlgExceldownld(draftid,fileid){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/draft_ccbs_bulk_dwld/'+draftid+'?ccbs_bfile_id='+fileid, { 'headers': headers, responseType: 'blob' as 'json' })
}
public predit(id: any, pageNumber): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  //console.log("po single get details for summary popup", id)
  let params: any = new HttpParams();
  params = params.append('page', pageNumber.toString());
  // params = params.append('pageSize', pageSize.toString());
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + "prserv/get_pr_details/"+id+"?page="+pageNumber, {'headers': headers, params })
 
}
download(Id){
  this.reset();
 const getToken = localStorage.getItem("sessionData")
 let tokenValue = JSON.parse(getToken);
 let token = tokenValue.token
 const headers = { 'Authorization': 'Token ' + token }
 // return this.http.get<any>(MicroUrl + 'prserv/prpo_download_file/'+Id, { 'headers': headers, responseType: 'blob' as 'json' })
 return this.http.get<any>(MicroUrl + 'prserv/get_pr_podetails_excel/'+Id, { 'headers': headers, responseType: 'blob' as 'json' })

}
downloadpo(Id){
  this.reset();
 const getToken = localStorage.getItem("sessionData")
 let tokenValue = JSON.parse(getToken);
 let token = tokenValue.token
 const headers = { 'Authorization': 'Token ' + token }
 // return this.http.get<any>(MicroUrl + 'prserv/prpo_download_file/'+Id, { 'headers': headers, responseType: 'blob' as 'json' })
 return this.http.get<any>(MicroUrl + 'prserv/get_po_grndetails_excel/'+Id, { 'headers': headers, responseType: 'blob' as 'json' })

}
public posummarygerpo(id): Observable<any> {  
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/get_po_grndetails/' + id, { 'headers': headers })
  // return this.http.get<any>(MicroUrl + 'prserv/get_pr_podetails/' + id+pagenumber { 'headers': headers })

  // return this.http.get<any>(PRPOUrl + "mstserv/commodity?page=" + pageNumber, { 'headers': headers, params })

}
public getapprovedBRdata(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(PRPOUrl + "prserv/branchrequest_summary",data, { 'headers': headers })
}
public getapprovedBRdatanew(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(PRPOUrl + "prserv/search_batch_pr",data, { 'headers': headers })
}

public search(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(PRPOUrl + "prserv/prserv/branchrequest_summary" ,data, { 'headers': headers })
}

// public getcombasedproduct(com,prod,value,pageno): Observable<any> {
//   this.reset();
//   const getToken: any = localStorage.getItem('sessionData')
//   let tokenValue = JSON.parse(getToken);
//   let token = tokenValue.token
//   const headers = { 'Authorization': 'Token ' + token }

//   if(comid && !prod){
//     return this.http.get<any>(PRPOUrl + "prserv/cpMap/" + comid +'?query='+ key + '&page=' + pageno, { 'headers': headers })
//   } else if(comid && prod){
//     return this.http.get<any>(MicroUrl + "prserv/prpo_cp/"+comid+"?request_type=" + prod + "&query="+key + "&page="+ pageno, {'headers': headers })

//   } else if(!comid && prod){
//     return this.http.get<any>(MicroUrl + "prserv/producttype_get_product/"+prod+"&query="+key + "&page="+ pageno, {'headers': headers })

//   }else {
//     return this.http.get<any>(PRPOUrl +'mstserv/productsearch?query='+key+'&page='+pageno,{ 'headers': headers })
//   }
  

// if((com == null || com == undefined || com == '') && (prod == null || prod == undefined || prod == '')){
//   return this.http.get<any>(MicroUrl + "mstserv/productsearch"+"?query="+value+"&page="+pageno ,{ 'headers': headers })

// } else if(!com && prod){
//   return this.http.get<any>(MicroUrl + "prserv/producttype_get_product/"+prod+"&query="+value + "&page="+ pageno, {'headers': headers })

// }
// else if(prod == null || prod == undefined || prod == ''){
//   return this.http.get<any>(MicroUrl + "prserv/cpMap/"+ com +"?query="+value+"&page="+pageno ,{ 'headers': headers })

// }
// return this.http.get<any>(PRPOUrl + "prserv/prpo_cp/" + com +'?query='+ value + '&page=' + pageno + "&request_type=" + prod, { 'headers': headers })

 
// }
// }


public grnCreateForm(GRN, files): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let formData = new FormData();
  // if (id == "") {
  this.grnADDJson = GRN;
  this.grnADDJson = Object.assign({}, GRN);
  
  // } 
  formData.append('data', JSON.stringify(this.grnADDJson));
  if(files != null || files != undefined ){
  for (var i = 0; i < files.length; i++) {
    formData.append("file1", files[i]);
  }}
  // return this.http.post<any>(MicroUrl + 'prserv/grninward', formData, { 'headers': headers })
  return this.http.post<any>(MicroUrl + 'prserv/grn_create', formData, { 'headers': headers })

}

public getnewgrncreatesummarySearch(searchgrninward, pageNumber = 1, pageSize = 10): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  params = params.append('page', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  //  console.log(params);
  // console.log(headers);
  return this.http.post<any>(MicroUrl + 'prserv/search_po_grnlist', searchgrninward, { 'headers': headers, params })
}
// public getotherattribute(GRNID): Observable<any> {
//   this.reset();
//   const getToken = localStorage.getItem("sessionData")
//   let tokenValue = JSON.parse(getToken);
//   let token = tokenValue.token
//   const headers = { 'Authorization': 'Token ' + token }
//   return this.http.get<any>(MicroUrl + "mstserv/product_sp_all?code=" + GRNID, { 'headers': headers })
// }
public getotherattribute(code,grn): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // page=1&
  // return this.http.get<any>(MicroUrl + "mstserv/product_specification_new?page=1"+ "&code=" + code, { 'headers': headers })
  
  return this.http.get<any>(MicroUrl + "mstserv/grn_product_otherattribute?code=" + code, { 'headers': headers })

  // return this.http.get<any>(MicroUrl + "prserv/prpo_product_otherattribute?code=" + code + "&ref_type=" + grn, { 'headers': headers })
}
public getdropattribute(code,grn): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + "prserv/prpo_product_otherattribute?code=" + code + "&ref_type=" + grn, { 'headers': headers })

  // return this.http.get<any>(MicroUrl + "mstserv/product_sp_all?code=" + GRNID + "&specification=" + name, { 'headers': headers })
}

 public getassestheaderpatch(po_id,datadetailID,type, page,currentqnty): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
     return this.http.get<any>(MicroUrl + "prserv/grn_single_asset_popup?po_id=" + po_id + "&detail_id=" + datadetailID, { 'headers': headers })
  }
   public getQuotationid(obj): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(PRPOUrl + 'prserv/get_quotation_details', obj, { 'headers': headers })
  }
  //getpdfGRN

   public getpdfpreview(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/pr_sample_df', data, { headers, responseType: 'blob' as 'json' })
    //return 
  }


   public getPOpdfpreview(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/po_preview/pdf', data, { headers, responseType: 'blob' as 'json' })
    //return 
  }
    public getJustpdfpreview(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(MicroUrl + 'prserv/po_just_notepad/pdf', data, { headers, responseType: 'blob' as 'json' })
    //return 
  }
   public getprodname(id,page,query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
     return this.http.get<any>(MicroUrl + "mstserv/producttype_get_product/"+id+"?query="+query+"&page="+page, { 'headers': headers })
  }
    public delmatDownload(commodity,emp): Observable<any> {
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(MicroUrl + "prserv/delmat_report?commodity_id=" + commodity + '&employee_id=' + 
        emp,{ headers, responseType: 'blob' as 'json' })
    }
}