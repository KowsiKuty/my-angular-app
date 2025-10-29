import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment'

const url = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class BreApiServiceService {

  constructor(private http: HttpClient,  private idle: Idle) { }
  idleState = 'Not started.';
  timedOut = false;
 
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  public getcommodityy(commoditykeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=', { 'headers': headers })
  }

  public getcommodityscroll(commoditykeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (commoditykeyvalue === null) {
      commoditykeyvalue = "";

    }
    let urlvalue = url + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getcommodityexp(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/brexp_commoditylevel_drop' , { 'headers': headers })
  }

  public getRecurringPeriod(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/brexp_recurperiod_drop' , { 'headers': headers })
  }
  public getSupplierPayDet(ID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/brexp_supplierdetail/' + ID , { 'headers': headers })
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
  public expenceclmcreate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/expenseclmntype', data, { 'headers': headers })
  }
  public branchexpcreate1(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/brexpense', data, { 'headers': headers })
  }

  public brexpCreate(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "breserv/brexpense_new", data, { 'headers': headers })
  }
  
  public branchexpdtlcreate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/brexpdetail2', data, { 'headers': headers })
  }

  public branchexpCCcreate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/brexpcc', data, { 'headers': headers })
  }
  public branchexpTranscreate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/brexptrans', data, { 'headers': headers }) 
  }

  public getPaymentSchedule(data, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/brexpense_recurcalc'+ '?page=' + page, data, { 'headers': headers })
  }


  public branchexpSubmit(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/branchexpense_submit', data, { 'headers': headers })
  }


  public branchexpApprove(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/branchexpense_approved', data, { 'headers': headers })
  }

  public branchexpReject(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/branchexpense_rejected', data, { 'headers': headers })
  }
  public expencecreate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/expensetype', data, { 'headers': headers })
  }
  public getExpenseType(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/expensetype', { 'headers': headers })
  }
  public getExpenseTypescroll(expkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (expkeyvalue === null) {
      expkeyvalue = "";

    }
    let urlvalue = url + 'breserv/expensetype?query=' + expkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getexpence(page,data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(data['status']== 0)
      return this.http.post<any>(url + 'breserv/searchexptype?page='+page + '&status=0',{}, { 'headers': headers })
    else
      return this.http.post<any>(url + 'breserv/searchexptype?page='+page,data, { 'headers': headers })
  }

  public getBrExpense(data ={},page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/branchexp_fetchall?page='+page, data, { 'headers': headers })
  }
  public getBrExpenseApprovalSummary(data ={},page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/branchexpense_summary?page='+page, data, { 'headers': headers })
  }
  public expencecolumnget(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/expense/'+id, { 'headers': headers })
  }
  public getexpencecolumn(page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/expenseclmntype?page='+page, { 'headers': headers })
  }
  public getstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "breserv/brexp_status_drop", { 'headers': headers, params })
    
  }
  public getbranchpermission(sub_name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "breserv/bre_admin_check?submodule="+ sub_name, { 'headers': headers, params })
    
  }
  public dropdownget(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/expensetypedrop', { 'headers': headers })
  }
  public actinactexp(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/delete_exp/'+id, { 'headers': headers })
  }
  public actinactexpclmn(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/delete_expclmn/'+id, { 'headers': headers })
  }
  public getsupplierView(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "venserv/supplierbranch/" + id, { 'headers': headers, params })
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

    return this.http.get<any>(url + 'venserv/search_suppliername?sup_id=' + id + '&name=' + suppliername, { headers })
  }

  public getsuppliernamescroll(id, suppliername, pageno): Observable<any> {
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

    return this.http.get<any>(url + 'venserv/search_suppliername?sup_id=' + id + '&name=' + suppliername + '&page=' + pageno, { headers })
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
    return this.http.get<any>(url + 'venserv/search_supplierdetails_ecf?code=' + searchsupplier.code + '&panno=' + searchsupplier.panno + '&gstno=' + searchsupplier.gstno, { 'headers': headers })
  }
  // public getselectsupplierSearch(searchsupplier): Observable<any> {
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
  //   return this.http.get<any>(url + 'venserv/search_supplier?code=' + searchsupplier.code + '&panno=' + searchsupplier.panno + '&gstno=' + searchsupplier.gstno, { 'headers': headers })
  // }

  public getsuppliertype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "ecfserv/get_suppliertype", { 'headers': headers })
  }
  public getAMBranchdropdown(pageNumber = 1, data:any): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(url + "usrserv/search_branch?page="+ pageNumber+'&query='+data, { 'headers': headers })
  }
  public getbs(bskeyvalue) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null ||bskeyvalue ===undefined) {
      bskeyvalue = "";

    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'usrserv/searchbusinesssegment?query=' + bskeyvalue, { 'headers': headers })



  }

  public getbsscroll(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null ||bskeyvalue ===undefined) {
      bskeyvalue = "";

    }
    let urlvalue = url + 'usrserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(url + 'usrserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue, { 'headers': headers })
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
    let urlvalue = url + 'usrserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getexptypedropdown(data,pageNumber = 1): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    params = params.append('expense_name', data.toString());
    return this.http.post<any>(url + "breserv/expensetypedropdown", data, { 'headers': headers})
  }

  public gethsn(hsnkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'mstserv/search_hsncode?query=' + hsnkeyvalue, { 'headers': headers })
  }

  public gethsnscroll(hsnkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (hsnkeyvalue === null) {
      hsnkeyvalue = "";
    }
    let urlvalue = url + 'mstserv/search_hsncode?query=' + hsnkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getvendorid(suppid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "venserv/branch/" + suppid + "/payment", { 'headers': headers, params })
  }

  public gettdstaxtype1(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "venserv/vendor_tax_ecf/" + id, { 'headers': headers, params })
  }

  public gettdstaxtype1Scroll(id, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(url + "venserv/vendor_tax_ecf/" + id + '?page=' + page ,{ 'headers': headers, params })
  }

  
  public getbranchrole(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'ecfserv/dd', { 'headers': headers })
  }

  getcat(catkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'mstserv/categoryname_search?query=' + catkeyvalue, { 'headers': headers })
  }
  branchget(d:any):Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    console.log(getToken)
    const header = { 'Authorization': 'Token ' + token }
    return this.http.get(url+'usrserv/search_employeebranch?page=1&query='+d, { 'headers': header })
  }

  public getbranchscroll(branchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";
    }
    let urlvalue = url + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
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
    return this.http.get<any>(url + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue, { 'headers': headers })
  }
 
  public getcategoryscroll(catkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    let urlvalue = url + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getsubcategoryscroll(id,pageno , subcatkeyvalue): Observable<any> {
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
    let urlvalue = url + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  public brexpActInact(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/branchexp_delete/'+id, { 'headers': headers })
  }

  public branchexp_fetch(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/branchexp_fetch/'+id, { 'headers': headers })
  }

  public brexpdtl_fetch(id,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/brexpdtl_fetch/'+id + '?page=' + page, { 'headers': headers })
  }

  public branchexpcc_fetch(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/branchexpcc_fetch/'+id, { 'headers': headers })
  }

  public branchexptrans_fetch(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/branchexptrans_fetch/'+id, { 'headers': headers })
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
    let urlvalue = url + 'prserv/ecf_delmatlimit?commodityid='+commodityid+'&created_by='+createdbyid+'&employee='+approverkeyvalue;
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
       urlvalue = url + 'breserv/approver_dropdown?commodityid='+commodityid+'&created_by='+createdbyid+'&query='+approverkeyvalue+ '&page=' + pageno+ '&branch_id=' + branch;
    else
        urlvalue = url + 'breserv/approver_dropdown?commodityid='+commodityid+'&created_by='+createdbyid+'&query='+approverkeyvalue+ '&page=' + pageno;

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
    if(branch != undefined && branch != null && branch != '')
       urlvalue = url + 'prserv/ecf_delmatlimit?commodityid='+1+'&created_by='+createdbyid+'&employee='+approverkeyvalue+ '&page=' + pageno+ '&branch_id=' + branch;
    else
        urlvalue = url + 'prserv/ecf_delmatlimit?commodityid='+1+'&created_by='+createdbyid+'&employee='+approverkeyvalue+ '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  
  public getBretoEcfSummary(data ={},page, download_data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(download_data === 'download'){
    return this.http.post<any>(url + 'breserv/bretoecf_summary?report_download='+page, data, { 'headers': headers, responseType: 'blob' as 'json' })
    }
    else{
    return this.http.post<any>(url + 'breserv/bretoecf_summary?page='+page, data, { 'headers': headers })
    }
  }


  public bretoEcfApprove(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/bretoecf_approve', data, { 'headers': headers })
  }

  public bretoEcfReject(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/bretoecf_reject', data, { 'headers': headers })
  }

  public bretoEcfFetch(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/bretoecf_fetch/'+ id, { 'headers': headers })
  }

  public filesdownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/bretoecf_file/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  getViewTrans(id:any) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(url+'breserv/branchexp_queue/'+id, { 'headers': header })
  }
  getBretoEcfViewTrans(id:any) :Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    
    return this.http.get(url+'breserv/bretoecf_queue/'+id, { 'headers': header })
  }

  public claimMakerCreate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/bretoecf_maker', data, { 'headers': headers })
  }

  public claim_cancel(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/claim_cancel', data, { 'headers': headers })
  }
  public brecoverNotedownload(crno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/bre_covernote/' + crno, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public batchcoverNotedownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'ecfapserv/batch_covernotee/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }


  public coverNoteadvdownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'ecfapserv/ecf_covernoteadv/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  
  
  public expense_hold(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/expense_hold', data, { 'headers': headers })
  }

  
  public expense_unhold(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/expense_unhold', data, { 'headers': headers })
  }
  
  public expense_cancel(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/expense_cancel', data, { 'headers': headers })
  }
  
  public employee_permission(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/employee_permission', { 'headers': headers})
  }

  public bretoecf_scheduler(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'breserv/bretoecf_scheduler', { 'headers': headers})
  }
  // breserv/bretoecf_scheduler_manual
  public manual_schedule(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/bretoecf_scheduler_manual', data, { 'headers': headers })
  }
  // scheduler_summary=1
  public scheduler_summary(data ={},page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'breserv/branchexp_fetchall?page='+page +'&scheduler_summary=1', data, { 'headers': headers })
  }


  
}
