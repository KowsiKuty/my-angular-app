import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { stat } from 'fs';


const smsUrl = environment.apiURL;
@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private http: HttpClient, private idle: Idle) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {

    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getNOP(pageNumber = 1, pageSize = 10,subcat): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(smsUrl + "smsservice/natureofproblem?page=" + pageNumber+'&init='+'&subcat_id='+subcat, { 'headers': headers })
  }
  public getlistofassetdata(pageNumber = 1, pageSize = 10,id,type,branch): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(smsUrl + "smsservice/amc_list_of_assets?page=" + pageNumber+'&assetid='+id+'&type='+type+'&branch='+branch, { 'headers': headers })
  }
  public getlistofassetdata_new(pageNumber, pageSize = 10,id,type,branch,product,sortOrder:'asce'): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = {'page': pageNumber.toString(),'pageSize': pageSize.toString(),'sortOrder': sortOrder};
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    // params = params.append('sortOrder', sortOrder);
    return this.http.get<any>(smsUrl + "smsservice/amc_list_of_asset_new?page=" + pageNumber, { 'headers': headers,'params':params })
  }
  public getlistofassetdata_new_search(pageNumber, pageSize = 10,id,type,branch,product): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(smsUrl + "smsservice/amc_list_of_assets_search?page="+pageNumber +'&assetid='+id+'&type='+type+'&branch='+branch+'&product='+product, { 'headers': headers })
  }

  public getNOPChild(pageNumber = 1, pageSize = 10, parent,asset_name): Observable<any> {
    console.log('shared',parent)
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(smsUrl + "smsservice/natureofproblem?page=" + pageNumber +'&parent_id=' + parent+'&asset_name='+asset_name, { 'headers': headers })
  }
  public getNOPparentadd(parent): Observable<any> {
    console.log('shared',parent)
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(smsUrl + "smsservice/natureofproblem" ,parent, { 'headers': headers })
  }

  public getAMCSummary(pageNumber = 1, pageSize = 10,code:any,name:any,data:any,supplier:any,status:any,branch:any,asset_id:any,asset_name:any): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(smsUrl + "smsservice/amc_summary?page=" + pageNumber+'&amcheader_code='+code+'&amcheader_name='+name+'&sortOrder='+data+'&supplier='+supplier+'&status='+status+'&branch='+branch+'&asset_id='+asset_id+'&asset_name='+asset_name, { 'headers': headers })
  }
  public getAMCpropertydropdown(pageNumber = 1, pageSize = 10): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + "faserv/assetdetails_id?page=" + pageNumber, { 'headers': headers })
  }
  public getAMCassetiddropdown(page = 1, data:any): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + "faserv/assetdetails_id?page="+page+'&query='+data, { 'headers': headers })
  }
  public getAMBranchdropdown(pageNumber = 1, data:any): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + "usrserv/search_branch?page="+ pageNumber+'&query='+data, { 'headers': headers })
  }
  public getAMProductdropdown(pageNumber = 1, data:any,id:any): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + "smsservice/product_list?page="+ pageNumber+'&query='+data+'&id='+id, { 'headers': headers })
  }
  public getAMCategorydropdown(page:any,data:any): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + "faserv/assetcat?subcatname=" + data+'&page='+page, { 'headers': headers })
  }
  public getAMChedersummary(pageNumber = 1): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + "smsservice/amc_summary?page=" + pageNumber, { 'headers': headers })
  }
  public getAMCVendordropdown(pageNumber = 1): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + "smsservice/amc_summary?page=" + pageNumber, { 'headers': headers })
  }

  public getAMCsummary(pageNumber = 1,barcode,branch,suncatname,asset_name,assetserialno,type,capdatefrom,capdateto,crnum,invoice_no): Observable<any> {

    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };

    return this.http.get<any>(smsUrl+ "smsservice/amc_create_summary?query="+barcode+"&branch="+branch+"&subcatname="+suncatname +"&assetname="+asset_name+"&assetserialno="+assetserialno+'&type='+type+'&page='+pageNumber+'&capdatefrom='+capdatefrom+'&capdateto='+capdateto+'&crnum='+crnum+'&invoiceno='+invoice_no, { 'headers': headers })

  }
  public getAMCcreate(data:any): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(smsUrl + "smsservice/amcheader_details_creation",data,{ 'headers': headers })
  }
  public getsmsbulkdataupload(data:any): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(smsUrl + "smsservice/smsapprovalbulkupload",data,{ 'headers': headers })
  }
  public getCustomerStateFilter(page:any,data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'venserv/suppliercode_gst_validation?page=' + page+ '&query='+ data,{ 'headers': headers })
  }
  public getperiodicmailFilter(data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/periodic_mail?data='+data,{ 'headers': headers })
  }
  public getserviceperiodFilter(data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/service_period?data='+data,{ 'headers': headers })
  }
  public getTicketSummary(page:any,data:any,issus:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/ticketheader?code='+data+'&issue='+issus+'&page='+page, { 'headers': headers })
  }
  public getTicketSummary_all(page:any,data:any,issus:any,emp_id:any,branch_id:any,sortOrder:'asce',status:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params :any= {'sortOrder':sortOrder};
    // return this.http.get<any>('http://192.168.1.28:8000/' + 'smsservice/ticketheader?code='+data+'&issue='+issus+'&page='+page+'&employee_id='+emp_id, { 'headers': headers })
    return this.http.get<any>(smsUrl + 'smsservice/new_ticket_fitler_summary?code='+data+'&issue='+issus+'&page='+page+'&employee_id='+emp_id+'&branch_id='+branch_id+'&status='+status, { 'headers': headers,'params':params })
  }
  public getTicketSummary_initial(page:any,data:any,issus:any,emp_id,branch_id,sortOrder:'asce',status:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params : any = {'sortOrder':sortOrder};
    return this.http.get<any>(smsUrl + 'smsservice/fetch_thirtyday_list?code='+data+'&issue='+issus+'&page='+page+'&employee_id='+emp_id+'&branch_id='+branch_id+'&status='+status, { 'headers': headers,'params':params})
  }
  public getTicketSummary_between(page:any,data:any,issus:any,emp_id:any,branch_id,sortOrder:'asce',status:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params : any = {'sortOrder':sortOrder};
    return this.http.get<any>(smsUrl + 'smsservice/fetch_thirtytosixtyday_list?code='+data+'&issue='+issus+'&page='+page+'&employee_id='+emp_id+'&branch_id='+branch_id+'&status='+status, { 'headers': headers,'params':params })
  }
  public getTicketSummaryview(data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/ticketheader_view/'+data, { 'headers': headers })
  }
  public getTicketSummaryview_new(data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/track_get?header_id='+data, { 'headers': headers })
  }
  public getTicketSummaryFollow_new(data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'msservice/followup?header_id='+data, { 'headers': headers })
  }
  public getamcapprovalsummary(data:any,page:any,code:any,name:any,branch:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/amc_approval_summary?page='+page+'&amcheader_code='+code+'&amcheader_name='+name+'&branch='+branch, { 'headers': headers })
  }
  public getamcapprovalsummarysort(data:any,page:any,pagesize:any,code:any,name:any,branch:any,status:any,sortOrder:'asce',asset_id:any,asset_name:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params : any = {'sortOrder':sortOrder,'status':status,'amcheader_code':code,'amcheader_name':name,'branch':branch,'asset_id':asset_id,'asset_name':asset_name};
    return this.http.get<any>(smsUrl + 'smsservice/amc_approval_summary_sort?page='+page+'&pagesize='+pagesize, { 'headers': headers,'params':params })
  }
  public getamcapprovalsummaryapprove(formdata:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    // let params={'query':data,'remarks':remarks}
    // "smsservice/amcheader_details_creation",data,{ 'headers': headers }
    return this.http.post<any>(smsUrl + "smsservice/amc_approval",formdata, {'headers': headers})
  }
  public getamcapprovalsummaryreject(data:any,remarks:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/amc_reject?query='+data+'&remarks='+remarks, { 'headers': headers })
  }
  public getamcapprovalsummaryselect(data:any,pageNumber:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    return this.http.get<any>(smsUrl + 'smsservice/amc_approval_select?query='+data+'&page='+pageNumber, { 'headers': headers })
  }
  public getamcaselectfile(data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    return this.http.get<any>(smsUrl + 'smsservice/smsfiledata?query='+data, { 'headers': headers })
  }
  public getamcapprovalaselectfile(data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    return this.http.get<any>(smsUrl + 'smsservice/smsapprovalfiledata?query='+data, { 'headers': headers })
  }
  
  public getamcbranchdata(data:any,page:any): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.get<any>(smsUrl + 'smsservice/branch_data?query='+data+'&page='+page, { 'headers': headers })
  }
  public getassetlocationdata(data: number): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    console.log(token)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(smsUrl + "smsservice/assetlocation_data?query=" + data, { 'headers': headers });
  }
  public getamcserialnodata(data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/assetserial_no_data?query='+data, { 'headers': headers })
    }
  public getamcticketsummary(data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/ticketheader_amc_search'+data, { 'headers': headers })
    }
    public getamcticketsummary_s(data:any,page:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
      return this.http.post<any>(smsUrl + 'smsservice/ticketheader_asset?page='+page,data, { 'headers': headers })
    }
    public getcreateticketsummary(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
      return this.http.post<any>(smsUrl + 'smsservice/ticketheader',data, { 'headers': headers })
    }
    public getTicketnopdropdown(data:any,page:any,asset_name:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/nop_get?page='+page+'&asset_name='+asset_name, { 'headers': headers })
    }
    public barcode_status(barcode:any,type:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(smsUrl + 'smsservice/ticket_barcode_status?barcode='+barcode+'&type='+type, { 'headers': headers })
    }
    public getTicketfollowupEdit(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.post<any>(smsUrl + 'smsservice/track',data, { 'headers': headers })
    }
    public getTicketfollowcreate(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.post<any>(smsUrl + 'smsservice/followup',data, { 'headers': headers })
    }
    public getTicketticketsummary(data:any,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/employee_get?query='+data+'&page='+page, { 'headers': headers })
    }
    public getTicketticketsummarydata(data:any,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/employee_get_data?query='+data+'&page='+page, { 'headers': headers })
    }
    public getAssetviewdataTicket(data:any,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/ticketheader_view/'+data+'?page='+page, { 'headers': headers })
    }
    public getAssetviewdataTicket_new(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/ticketdetails?header_id='+data, { 'headers': headers })
    }
    public getAssetviewdataTicket_com(data:any,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/followup?header_id='+data+'&page='+page, { 'headers': headers })
    }
    public getfollowupdatatrack(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/track?header_id='+data, { 'headers': headers })
    }
    public getfollowfileupload(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.post<any>(smsUrl + 'smsservice/fileupload', data,{ 'headers': headers })
    }
    public getfollowtracknewhistory(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.post<any>(smsUrl + 'smsservice/track_followup_histry?header_id='+data,{ 'headers': headers })
    }
    public getfollowtracknewhistory_new(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/track?header_id='+data,{ 'headers': headers })
    }
    public filedownload(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/filedownload/'+data,{ 'headers': headers ,responseType: 'blob' as 'json'})
    }
    public sms_approval_file_download(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/amc_doc_download/'+data,{ 'headers': headers ,responseType: 'blob' as 'json'})
    }
    public sms_maker_approval_file_download(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/amc_approval_doc_download/'+data,{ 'headers': headers ,responseType: 'blob' as 'json'})
    }
    public sms_approval_file_view(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/download_doc_file/'+data,{ 'headers': headers ,responseType: 'blob' as 'json'})
    }
    public sms_maker_approval_file_view(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/upload_approval_doc_file/'+data,{ 'headers': headers ,responseType: 'blob' as 'json'})
    }
    public amcfileview(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/filedownload/'+data,{ 'headers': headers ,responseType: 'blob' as 'json'});
    }
    public amcfileviewdownload(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(smsUrl + 'smsservice/download_doc_file/'+data,{ 'headers': headers ,responseType: 'blob' as 'json'});
    }
    public getassetcategorynew(data: string,page:number): Observable<any> {
      console.log('product=', data);
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      // params = params.append('filter', filter);
      // params = params.append('sortOrder', sortOrder);
      // params = params.append('page', pageNumber.toString());
      // params = params.append('pageSize', pageSize.toString());
      return this.http.get<any>(smsUrl + "faserv/assetcat?subcatname=" + data+"&page="+page, { 'headers': headers });
  
    }
    public getamcwarsummary_DownloadReport_xl(code:any,name:any,vendor:any,status:any,branch:any,barcode:any,product:any):Observable<any>{
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = {'amcheader_code':code, 'amcheader_name':name,'supplier': vendor,'status':status,'branch':branch,'barcode':barcode,'product':product};
      return this.http.get<any>(smsUrl + "smsservice/amc_war_summary_xldownload", {'headers': headers,params,responseType: 'blob' as 'json'})  
}
public getnoa_approval_DownloadReport_xl(asset_id:any,branch_id:any,asset_cat:any,asset_name:any,make_model:any,asset_serial_number:any,start_date:any,enddate:any,status:any):Observable<any>{
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = {'asset_id':asset_id,'branch_id':branch_id,'asset_cat':asset_cat,'asset_name':asset_name,'make_model':make_model,'asset_serial_number':asset_serial_number,'status':status,
  'start_date':start_date,'enddate':enddate};
  return this.http.get<any>(smsUrl + "smsservice/noa_approver_download", {'headers': headers,params,responseType: 'blob' as 'json'})  
}
public getnoa_maker_DownloadReport_xl(asset_id:any,branch_id:any,asset_cat:any,asset_name:any,make_model:any,asset_serial_number:any,start_date:any,enddate:any,status:any):Observable<any>{
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = {'asset_id':asset_id,'branch_id':branch_id,'asset_cat':asset_cat,'asset_name':asset_name,'make_model':make_model,'asset_serial_number':asset_serial_number,'status':status,
  'start_date':start_date,'enddate':enddate};
  return this.http.get<any>(smsUrl + "smsservice/noa_maker_download", {'headers': headers,params,responseType: 'blob' as 'json'})  
}
public NOPSummary(pageNumber :any,asset_name:any,parent:any,child:any,sortOrder:'asce'): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  let params: any = {'sortOrder':sortOrder};
  return this.http.get<any>(smsUrl + "smsservice/nop_summary?page=" + pageNumber+'&asset_name='+asset_name+'&parent='+parent+'&child='+child, { 'headers': headers,'params':params })
}

public getNOPSummary(pageNumber :any,asset_name:any,parent:any,child:any,sortOrder:'asce'): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  let params: any = {'sortOrder':sortOrder};
  return this.http.get<any>(smsUrl + "smsservice/natureofproblem_summary?page=" + pageNumber+'&asset_name='+asset_name+'&parent='+parent+'&child='+child, { 'headers': headers,'params':params })
}
public getNOPParent(asset_name,name,pageNumber :any): Observable<any> {
    // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  let params: any = new HttpParams();
  return this.http.get<any>(smsUrl + "smsservice/fetch_parent?asset_name=" +asset_name+'&name='+name+'&page='+ pageNumber, { 'headers': headers })
}
public getNOPChilddropdown(asset_name,parent_name,child_name,pageNumber :any): Observable<any> {
  // this.reset();
const getToken = localStorage.getItem('sessionData');
let tokenValue = JSON.parse(getToken);
let token = tokenValue.token;
const headers = { 'Authorization': 'Token ' + token };
let params: any = new HttpParams();
return this.http.get<any>(smsUrl + "smsservice/fetch_child?asset_name=" +asset_name+'&parent_name='+parent_name+'&page='+ pageNumber+'&child_name='+child_name, { 'headers': headers })
}
public nopparentActInactive(data:any): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(smsUrl + 'smsservice/nopinactive',data,{ 'headers': headers })
}
public getNOASummary(pageNumber :any,asset_id:any,branch_id:any,asset_cat:any,asset_name:any,make_model:any,asset_serial_number:any,start_date:any,enddate:any,status:any): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  let params: any = new HttpParams();
  return this.http.get<any>(smsUrl + "smsservice/non_owned_asset_summary?page="+pageNumber+'&asset_id='+asset_id+'&branch_id='+ branch_id+'&asset_cat='+asset_cat+'&asset_make_model='+make_model+'&asset_name='+asset_name+'&asset_serial_no='+asset_serial_number+'&start_date='+start_date+'&end_date='+enddate+'&status='+status, { 'headers': headers })
}
public getNOASummary_sort(pageNumber :any,asset_id:any,branch_id:any,asset_cat:any,asset_name:any,make_model:any,asset_serial_number:any,start_date:any,enddate:any,status:any,sortOrder:'asce'): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  let params: any = {'sortOrder':sortOrder};
  return this.http.get<any>(smsUrl + "smsservice/non_owned_asset_summary?page="+pageNumber+'&asset_id='+asset_id+'&branch_id='+ branch_id+'&asset_cat='+asset_cat+'&asset_make_model='+make_model+'&asset_name='+asset_name+'&asset_serial_no='+asset_serial_number+'&start_date='+start_date+'&end_date='+enddate+'&status='+status, { 'headers': headers,'params':params })
}
public noacreate(data): Observable<any> {
  console.log('shared',data)
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(smsUrl + "smsservice/noa_create_update" ,data, { 'headers': headers })
}
public getNOASingleget(noa_id:any): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  let params: any = new HttpParams();
  return this.http.get<any>(smsUrl + "smsservice/noa_summary_get?id=" +noa_id, { 'headers': headers })
}
public getnoaapprovalsummaryapprove(data:any,remarks:any): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.get<any>(smsUrl + 'smsservice/noa_approval?query='+data+'&remarks='+remarks, { 'headers': headers })
}
public getnoaapprovalsummaryreject(data:any,remarks:any): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.get<any>(smsUrl + 'smsservice/noa_reject?query='+data+'&remarks='+remarks, { 'headers': headers })
}
public getNOAApprovalSummary(pageNumber :any,asset_id:any,branch_id:any,asset_cat:any,asset_name:any,make_model:any,asset_serial_number:any,start_date:any,enddate:any,status:any): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  let params: any = {'asset_id':asset_id,'branch_id': branch_id,
  'asset_cat':asset_cat,'asset_make_model':make_model,'asset_name':asset_name,
  'asset_serial_no':asset_serial_number,'start_date':start_date,'end_date':enddate,
'status':status};
  return this.http.get<any>(smsUrl + "smsservice/noa_approval_summary?page=" +pageNumber, { 'headers': headers ,params})
}
public getNOAApprovalSummary_sort(pageNumber :any,asset_id:any,branch_id:any,asset_cat:any,asset_name:any,make_model:any,asset_serial_number:any,start_date:any,enddate:any,status:any,sortOrder:'asce'): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  let params: any = {'asset_id':asset_id,'branch_id': branch_id,
  'asset_cat':asset_cat,'asset_make_model':make_model,'asset_name':asset_name,
  'asset_serial_no':asset_serial_number,'start_date':start_date,'end_date':enddate,
'status':status,'sortOrder':sortOrder};
  return this.http.get<any>(smsUrl + "smsservice/noa_approval_summary?page=" +pageNumber, { 'headers': headers ,params})
}
public getamcwar_approval_summary_DownloadReport_xl(code:any,name:any,branch:any,status:any,asset_id:any,asset_name:any):Observable<any>{
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = {'amcheader_code':code, 'amcheader_name':name,'branch': branch,'status':status,'barcode':asset_id,asset_name};
  // let params: any = {'page': pageNumber.toString(),'pageSize': pageSize.toString(),'sortOrder': sortOrder};
  return this.http.get<any>(smsUrl + "smsservice/amc_war_approval_summary_xldownload", {'headers': headers,params,responseType: 'blob' as 'json'})  
}
public getrenewalsummary(pageNumber : any,branch,barcode,asset_name,assetserialno,type,amcheader_code,amcheader_name,supplier_name,day,sortOrdersap): Observable<any> {

  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  let params: any = {'asset_id':barcode,'branch':branch,'asset_name':asset_name,'type':type,'asset_serial_number':assetserialno,
  'amcheader_code':amcheader_code,'amcheader_name':amcheader_name,'supplier_name':supplier_name,'day':day,'sortOrder':sortOrdersap};

  return this.http.get<any>(smsUrl+ "smsservice/renewal_summary?page="+pageNumber, { 'headers': headers,params })

}
public get_renewal_summary_id(pageNumber = 1,id): Observable<any> {

  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };

  return this.http.get<any>(smsUrl+ "smsservice/renewal_summary_id_get?page="+pageNumber+"&query="+id, { 'headers': headers })

}
public get_transaction_history(pageNumber = 1,code): Observable<any> {

  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };

  return this.http.get<any>(smsUrl+ "smsservice/transaction_renewal_summary?page="+pageNumber+"&query="+code, { 'headers': headers })

}
public getNOPparent_summary(parentid:any): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  // let params: any = {'sortOrder':sortOrder};
  return this.http.get<any>(smsUrl + "smsservice/fetch_parent_summary?parent="+parentid, { 'headers': headers })
}
public getNOPchild_delete(id:any): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  // let params: any = {'sortOrder':sortOrder};
  return this.http.get<any>(smsUrl + "smsservice/delete_nop_id?id="+id, { 'headers': headers })
}
public getNOPchild_edit(id:any): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  // let params: any = {'sortOrder':sortOrder};
  return this.http.get<any>(smsUrl + "smsservice/fetch_nop_id?id="+id, { 'headers': headers })
}
public filesdownload(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(smsUrl + 'smsservice/amc_doc_download/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
}
public deletefile(id:any): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(smsUrl + 'smsservice/deletefile/'+id, { 'headers': headers })
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
 
  window.open(smsUrl + "ecfapserv/ecffile/"+id+"?token="+token, '_blank');
}

public smsbulkupload(data:any):Observable<any>{
  const getToken=localStorage.getItem('sessionData');
  let tokenValue=JSON.parse(getToken);
  let token=tokenValue.token;
  const headers={'Authorization': 'Token ' +token};
  // return this.http.post<any>(smsUrl + "smsservice/sms_bulk_upload_validation" ,data, { 'headers': headers, responseType: 'blob' as 'json' })
  return this.http.post<any>(smsUrl + "smsservice/sms_bulk_upload_validation" ,data, { 'headers': headers, responseType: 'blob' as 'json' })
}

public sms_upload_data(data:any): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(smsUrl + "smsservice/latestsmstemplateupload",data,{ 'headers': headers })
}
public getsmsmakertemplateDownload(data): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(smsUrl + 'smsservice/latestsmstemplatedownload',data, { 'headers': headers,responseType: 'blob' as 'json' })
}

public sms_right(data): Observable<any> {
  // this.reset();
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  // let params: any = {'sortOrder':sortOrder};
  return this.http.get<any>(smsUrl + "smsservice/admin_rights?data="+data, { 'headers': headers })
}

public smsapprovalbulkupload(data:any):Observable<any>{
  const getToken=localStorage.getItem('sessionData');
  let tokenValue=JSON.parse(getToken);
  let token=tokenValue.token;
  const headers={'Authorization': 'Token ' +token};
  return this.http.post<any>(smsUrl + "smsservice/sms_approver_bulk_upload" ,data, { 'headers': headers, responseType: 'blob' as 'json' })
}

public get_smsnop_create(data):Observable<any>{
  const getToken=localStorage.getItem('sessionData');
  let tokenValue=JSON.parse(getToken);
  let token=tokenValue.token;
  const headers={'Authorization': 'Token ' +token};
  return this.http.post<any>(smsUrl + "smsservice/sms_nop_bulk_upload" ,data,{ 'headers': headers })
}

}
