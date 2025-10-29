import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

const TNEBUrl = environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class TnebService {
  idleState = 'Not started.';
  timedOut = false;
  addForm: any;

  constructor(private http: HttpClient, private idle: Idle,) { }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  //electricity maker summary
  public getEleMakerSummaryLis(pageNumber, pageSize = 10, consumer_status, consumer_no, consumer_name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(TNEBUrl + "ebserv/consumer?page=" + pageNumber + '&consumer_status=' + consumer_status + '&consumer_no=' + consumer_no + '&consumer_name=' + consumer_name, { 'headers': headers })
  }


  public getbranchdropdown(query, page) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = TNEBUrl + "ebserv/region?query=" + query + "&page=" + page;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  // add Electricity creation form
  public addElectricity(electricity: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.addForm = Object.assign({}, electricity)
    const body = JSON.stringify(this.addForm)
    console.log("create electricity", body)
    let create = TNEBUrl + 'ebserv/consumer'
    return this.http.post<any>(create, body, { 'headers': headers })


  }

  //getFindPremises List

  public findPremises(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10, branch_Id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(TNEBUrl + "pdserv/premiseoccupancy_details/" + branch_Id + "?page=" + pageNumber, { 'headers': headers })

  }

  //getbranchId

  public getbranchId(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "usrserv/user_branch", { 'headers': headers })

  }

  //electricity Approval summary
  public getEleApprovalSummaryLis(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(TNEBUrl + "ebserv/approvedconsumer?page=" + pageNumber, { 'headers': headers })

  }


  //electricity Status summary
  public getEleStatusSummaryLis(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(TNEBUrl + "sgserv/bc_summary?page=" + pageNumber, { 'headers': headers })

  }



  //electricity Payment summary
  public getElePaymentSummaryLis(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(TNEBUrl + "sgserv/bc_summary?page=" + pageNumber, { 'headers': headers })

  }


  public getpremisedropdown(query, pagenumer) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = TNEBUrl + 'pdserv/premise_restriction?query=' + query + '&page=' + pagenumer;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getstatedata(query: any, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/fetch_state_consumer_list", { 'headers': headers })

  }
  public getcodosummary( page: any, consumername,consumer_no, branch, consumer_status,state,board,region,active,occupancy): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/electricity_do_co_summary?consumer_no=" + consumer_no +"&consumer_name="+consumername+ "&consumer_status=" + consumer_status + "&branch_id=" + branch +"&consumer_state="+state +"&consumer_board="+board +"&region_id="+region+ "&makerisactive="+active+"&occupancy_id="+ occupancy + "&page=" + page, { 'headers': headers })

  }
  public getcodoapprovalsummary(query: any, page: any, consumer_no, consumer_name, consumer_status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/electricity_do_co_approval_summary?consumer_no=&" + consumer_no + "&consumer_name=" + consumer_name + "&consumer_status=" + consumer_status, { 'headers': headers })

  }
  public getcodoquerydata(consumer_no, consumer_name, branch, consumer_status,state,board,region,active, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/eb_details_query_screen?consumer_no=" + consumer_no + "&consumer_name=" + consumer_name + "&branch_id=" + branch + "&consumer_status=" + consumer_status+ "&consumer_state="+state +"&consumer_board="+board +"&region_id="+region+ "&makerisactive="+active  + "&page=" + page, { 'headers': headers })

  }
  public getconsumercodedata(query: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(TNEBUrl + "ebserv/electricity_validation", query, { 'headers': headers })

  }
  public getbranchdata(query: any, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/employee_branch?query=" + query + "&page=" + page, { 'headers': headers })

  }
  public electricitymanualrun(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/electricity_manual_run", { 'headers': headers })

  }
  public getpaymenttransactionsummary(query: any, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(TNEBUrl + "ebserv/electricity_payment_query_summary?page=" + page, { 'headers': headers })
  }
  public getpaymenttransactiondetailssummary(query: any, page: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/eb_details_transaction_summary?page=" + page, { 'headers': headers })
  }


  public ebboardsubmit(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(TNEBUrl + "ebserv/createebboard", json, { 'headers': headers })
  }



  public regionsubmit(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(TNEBUrl + "ebserv/createregion", json, { 'headers': headers })
  }

  public getpremisesconsumerno(number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "pdserv/get_premise?cosumer_number=" + number, { 'headers': headers })
  }

  public getebboard(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/createebboard?query=" + value + '&page=' + page, { 'headers': headers })
  }

  public getparticularebboard(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/getebboard/" + id, { 'headers': headers })
  }

  public getstate(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "mstserv/state_search?query=" + value + '&page=' + page, { 'headers': headers })
  }

  public getregionsummary(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/createregion?query=" + value + '&page=' + page, { 'headers': headers })
  }


  public getparticularregion(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/region_get/" + value, { 'headers': headers })
  }


  public getconsumerdetail(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "pdserv/get_ebdetails?cosumer_number=" + value, { 'headers': headers })
  }


  public getregiondata(value, board, page): Observable<any> {
    this.reset();
    board = (board) ? board : '';

    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/search_ebboard_byregion?query=" + value + "&eb_board=" + board + "&page=" + page, { 'headers': headers })
  }

  public getstatebasedboard(value, state, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/search_stateby_board?query=" + value + '&state=' + state + '&page=' + page, { 'headers': headers })
  }


  public getparticularelectricityconsumer(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/consumer/" + id, { 'headers': headers })
  }

  public tnebconsumervalidation(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(TNEBUrl + "ebserv/ebboard_validation", json, { 'headers': headers })
  }

  public getconsumeractivated(consumerid, active): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/ebconsumer_update/" + consumerid + "?type=is_active&value=" + active, { 'headers': headers })
  }

  public getconsumerapprove(consumerid, active): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/ebconsumer_update/" + consumerid + "?type=&value=" + active, { 'headers': headers })
  }
  
  public getbranch(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "usrserv/search_employeebranch?query=" + value + "&page=" + page, { 'headers': headers })
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
    let urlvalue = TNEBUrl + 'usrserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(TNEBUrl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue, { 'headers': headers })

  }

  public getbsscroll(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";

    }
    let urlvalue = TNEBUrl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getpaymentsummary(consumerno,branch,occupancy,fromdate,todate,billpaymentstatus,ownership_type,invoice,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/electricity_details_payment?consumer_no="+consumerno+"&branch_id="+branch+"&occupancy_id="+occupancy+"&bill_txnfromdate="+fromdate+"&bill_txntodate="+todate+"&bill_paymentstatus="+billpaymentstatus+"&ownership_type="+ownership_type+"&invoice_type="+invoice+"&page=" + page, { 'headers': headers })
  }

  public getdetailstatussummary(consumerno,branch,occupancy,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/ebconsumer_payment_screen?query="+consumerno+"&branch_id="+branch+"&occupancy_id="+occupancy+"&page="+page, { 'headers': headers })
  }

  public getPremiseView(PremiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "pdserv/premise/" + PremiseId, { 'headers': headers })
  }

  public getsuppliercode(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "venserv/suppliercode_gst_validation?query=" + value + '&page=' + page, { 'headers': headers })
  }

  public getVendor(vendor_Id,branch_Id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + 'venserv/vendor/' + vendor_Id + '/branch/' + branch_Id, { 'headers': headers })
  }

  public getpremisesoccupancy(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "pdserv/premise/"+id+"/occupancy?dropdown=true" , { 'headers': headers })

    // return this.http.get<any>(remsUrl + "pdserv/premise/" + id + '/occupancy?query='+value+'&page='+page , { 'headers': headers })
  }

  public getoccupancysiteids(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "pdserv/occupancy/"+id+"/atm" , { 'headers': headers })

    // return this.http.get<any>(remsUrl + "pdserv/premise/" + id + '/occupancy?query='+value+'&page='+page , { 'headers': headers })
  }

  public getoccupancydatas(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "pdserv/occusagetype?query=" + value + '&page=' + page, { 'headers': headers })
  }

  public ebbillpayment(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(TNEBUrl + "ebserv/ecf_generation" , value , { 'headers': headers })
  }

  public ebbillreject(value,remarks): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/eb_rejected_consumer?ebbill_id="+value+"&remarks="+remarks , { 'headers': headers })
  }

  public occupancyidget(id) : Observable<any>{

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(TNEBUrl+"pdserv/get_occupancy?occupancy_usage_id="+id, { 'headers': headers })

  }

  public ebbillfailapi(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/kvb_payment?crno="+ value , { 'headers': headers })
  }

  

  public ebbillstatusdata(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/Paymentstatus"  , { 'headers': headers })
  }

  public getebexcel( consumername,consumer_no, branch, consumer_status,state,board,region,active,occupancy): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/report_do_co_summary?consumer_no=" + consumer_no +"&consumer_name="+consumername+ "&consumer_status=" + consumer_status + "&branch_id=" + branch +"&consumer_state="+state +"&consumer_board="+board +"&region_id="+region+ "&makerisactive="+active +'&occupancy_id='+occupancy , { headers, responseType: 'blob' as 'json' })
  
  }

 
  
  public getoccupancydata(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "pdserv/get_occupancy?occupancy_name="+value  , { 'headers': headers })
  }

  public getquerysummary(consumerno,branch,occupancy,fromdate,todate,billpaymentstatus,status,board,state,makerisactive,region,ownership_type,invoice_type,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/eb_details_query?consumer_no="+consumerno+"&branch_id="+branch+"&occupancy_id="+occupancy+"&bill_txnfromdate="+fromdate+"&bill_txntodate="+todate+"&bill_paymentstatus="+billpaymentstatus+'&consumer_status='+status+'&consumer_board='+board+"&consumer_state="+state+"&makerisactive="+makerisactive+"&region_id="+region+"&ownership_type="+ownership_type+"&invoice_type="+invoice_type+"&page=" + page, { 'headers': headers })
  }
  // http://127.0.0.1:8000/ebserv/eb_details_query?consumer_no=09571001566&consumer_status=2&branch_id=1&region_id=8&consumer_board=5&consumer_state=3&makerisactive=1&bill_paymentstatus=1&bill_txnfromdate=2023-02-17&bill_txntodate

  public getqueryebexcel(consumerno,branch,occupancy,fromdate,todate,billpaymentstatus,status,board,state,makerisactive,region,ownership_type,invoice_type): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/report_query_screen?consumer_no="+consumerno+"&branch_id="+branch+"&occupancy_id="+occupancy+"&bill_txnfromdate="+fromdate+"&bill_txntodate="+todate+"&bill_paymentstatus="+billpaymentstatus+'&consumer_status='+status+'&consumer_board='+board+"&consumer_state="+state+"&makerisactive="+makerisactive+"&region_id="+region+"&ownership_type="+ownership_type+"&invoice_type="+invoice_type, { headers, responseType: 'blob' as 'json' })
  
  }

  public getbillcycledropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "ebserv/Billing_cycle" , { 'headers': headers })

  }

  public premisesType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + "pdserv/premisetype", { 'headers': headers })
  }

  
  public getUsage(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(TNEBUrl + 'pdserv/occusagetype', { 'headers': headers })
  }


}
  