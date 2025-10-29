import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { ShareService } from '../ECF/share.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment';
const jwmodelurl = environment.apiURL


@Injectable({
  providedIn: 'root'
})
export class JwService {

  constructor(private http: HttpClient, private ecfshareservice: ShareService, private idle: Idle) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  public createjv(CreateList: any,images): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let formData = new FormData();
    let obj = Object.assign({},CreateList)
    formData.append('data', JSON.stringify(obj));
    
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jwmodelurl + "jvserv/create_jventry", formData, { 'headers': headers })
  }

  public getjwsummary(page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jwmodelurl + "jvserv/wisefin_jventry?page="+page, { 'headers': headers })
    
  }

  public jwsummarySearch(download,data:any,pageno): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token } 
    if(download === true){
      return this.http.post<any>(jwmodelurl + "jvserv/wisefin_jventry?page="+pageno +"&download=1", data, { 'headers': headers , responseType: 'blob' as 'json'})
    }
    else{
      return this.http.post<any>(jwmodelurl + "jvserv/wisefin_jventry?page="+pageno, data, { 'headers': headers })
    }

  }

  public jwappsummarySearch(download,data:any,pageno): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token } 
    if(download === true){
      return this.http.post<any>(jwmodelurl + "jvserv/wisefin_jventry?page="+pageno+"&approval=true" +"&download=1", data, { 'headers': headers, responseType: 'blob' as 'json' })
    }
    else{
      return this.http.post<any>(jwmodelurl + "jvserv/wisefin_jventry?page="+pageno+"&approval=true", data, { 'headers': headers })
    }

  }
  public getjwapprovalsummary(page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jwmodelurl + "jvserv/jvaprvlwisefin?page="+page, { 'headers': headers })
    
  }
  public jwsingleget(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(id == undefined){
      id == ""
    }
    return this.http.get<any>(jwmodelurl + "jvserv/jventry_wisefin/"+id, { 'headers': headers })
    
  }
  
  public jWnosearch(refno: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(refno == undefined){
      refno = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jwmodelurl + "jvserv/jvrefnowisefin?jerefno="+ refno, { 'headers': headers })
  }
  
  public crnosearchnew(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jwmodelurl + "jvserv/search_crno", data, { 'headers': headers })
  }
  public crnosearch(crno: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(crno == undefined){
      crno = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jwmodelurl + "ecfapserv/get_approved_apcrno/"+crno, { 'headers': headers })
  }
  
    public rectifyentrysearch(crno):Observable<any>{
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue?.token;
      const headers = {'Authorization':'Token '+token};
      return this.http.get<any>(jwmodelurl+"entryserv/get_ecf_entry/"+crno,{'headers':headers})
    }
  public jwapprove(data){

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jwmodelurl + "jvserv/jwentryapproved", data, { 'headers': headers })
    
  }

  public jwreject(data){

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jwmodelurl + "jvserv/jventryreject", data, { 'headers': headers })

  }

  public gettrandetail(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jwmodelurl + "jvserv/get_trans/"+id, { 'headers': headers, params })
    
  }
  public fileView(id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    window.open(jwmodelurl + 'jvserv/jvfile/' +id+"?token="+token, '_blank');
  }
  
  public filedownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jwmodelurl + 'jvserv/jvfile/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public deletefile(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jwmodelurl + 'jvserv/deletefile/'+id, { 'headers': headers })
  }
  public getjournaltype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jwmodelurl + "jvserv/get_journaltype", { 'headers': headers, params })
    
  }

  public getjournaldtltype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jwmodelurl + "jvserv/get_journaldetailstype", { 'headers': headers, params })
    
  }

  public jvdetaildelete(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(id == undefined){
      id == ""
    }
    return this.http.get<any>(jwmodelurl + "jvserv/jvdetaildelete/"+id, { 'headers': headers })
    
  }
  public templatedownload(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jwmodelurl + 'jvserv/xltemp', { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public jvbulkupload(images){

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formData = new FormData();
    
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    // console.log("formdata",formData)
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jwmodelurl + "jvserv/search_jvupload",formData, { 'headers': headers })
    
  }
  public getjournalstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jwmodelurl + "jvserv/get_journalstatus", { 'headers': headers, params })
    
  }
  public jvheaderdelete(id:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(id == undefined){
      id == ""
    }
    return this.http.get<any>(jwmodelurl + "jvserv/jvdelete/"+id, { 'headers': headers })
    
  }
  public getentrydetail(crno:any,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (crno === undefined) {
      crno = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jwmodelurl + "entryserv/fetch_commonentrydetails/"+crno+'?page='+pageno, { 'headers': headers, params })
    
  }

  public getaccountingdate(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(jwmodelurl + "apserv/fetch_accounting_date", { 'headers': headers, params })
    
  }
  public getbranch(branchkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";

    }
    let urlvalue = jwmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue;

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
    let urlvalue = jwmodelurl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getcat(catkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jwmodelurl + 'mstserv/categoryname_search?query=' + catkeyvalue, { 'headers': headers })
  }

  public getcategoryscroll(catkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    let urlvalue = jwmodelurl + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno;
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
    return this.http.get<any>(jwmodelurl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue, { 'headers': headers })
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

    let urlvalue = jwmodelurl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(jwmodelurl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue, { 'headers': headers })

  }

  public getbsscroll(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";

    }
    let urlvalue = jwmodelurl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(jwmodelurl + 'usrserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue, { 'headers': headers })
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
    let urlvalue = jwmodelurl + 'usrserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getrmcode(rmkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(jwmodelurl + 'usrserv/memosearchemp?query='+rmkeyvalue , { 'headers': headers })
  }

  public getrmscroll(rmkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (rmkeyvalue === null) {
      rmkeyvalue = "";

    }
    let urlvalue = jwmodelurl + 'usrserv/memosearchemp?query=' + rmkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getjournalsummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(jwmodelurl + "jvserv/create_jventry", { 'headers': headers, params })
    
  }
  public getjournalappsummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(jwmodelurl + "jvserv/jvaprvlsummary", { 'headers': headers, params })
    
  }

  public getreportjvdata(data:any):Observable<any>{
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jwmodelurl + "jvserv/jvjw_report?flag=JW", data, { 'headers': headers, responseType: 'blob' as 'json' })
  }

    public jvreturn(data){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(jwmodelurl + "jvserv/jwentryreturn", data, { 'headers': headers })

  }

  

}

