import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

const url = environment.apiURL
const prsv=url
@Injectable({
  providedIn: 'root'
})
export class ProvisionService {
  users;
  idleState = 'Not started.';
  timedOut = false;
  taxJson: any;
  constructor(private http: HttpClient, private idle: Idle, ) { }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  async provisionsummary(page,b){
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(prsv + "prsnserv/provision?page="+page, { 'headers': headers })
    const res =await this.http.get<any>(prsv + "prsnserv/provision?page="+page+"&status=1" , { 'headers': headers }).toPromise();
  
  return res
  }
  public provisionsummaryfilter(page,b,id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(prsv + "prsnserv/provision?page="+page+"&status="+id, { 'headers': headers })
  }

  public systemcall(page,b,id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(prsv + "prsnserv/provision?status=3&page="+page+"&is_module=1", { 'headers': headers })
  }

  async get_selectall_data(search_data){
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return await this.http.get<any>(prsv + "prsnserv/approval_provision_id?status="+search_data, { 'headers': headers }) .toPromise()
  }
  public previousdata(page,m,y): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(prsv + "prsnserv/provision?is_previous=1&page="+page, { 'headers': headers })
  }
  public provision(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    // let dataSetArrange = Object.assign({}, data, {ref_key: index} )
    
    return this.http.post<any>(prsv + "prsnserv/provision", data, { 'headers': headers })
  }
  public provision_status(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(prsv + "prsnserv/provision_status", data, { 'headers': headers })
  }
 public ignorebymaker_(data,status){
  this.reset();
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  
  return this.http.post<any>(prsv + "prsnserv/ignoreprovision?is_previous=1", data, { 'headers': headers })
 }
 public delete_provision(id){
  this.reset();
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  
  return this.http.post<any>(prsv + "prsnserv/delete_provision", id, { 'headers': headers })
 }


  public movetoapprover_provision(data,query): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(prsv + "prsnserv/provision?action="+query, data, { 'headers': headers })
  }

  
  public provisionsearch(data,page): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    var link='?page='+page
    if(data.month==null ||data.month==''){
      data.month=''
    }
    else{
      link=link+ "&month="+ data.month
    }
    if(data.year==null ||data.year==''){
      data.year=''
    }
    else{
      link=link+ "&year="+ data.year
    }
    if(data.cc_id==null ||data.cc_id==''){
      data.cc_id=''
    }
    else{
      link=link+ "&cc_id="+data.cc_id    }

    if(data.bs_id==null ||data.bs_id==''){
      data.bs_id=''
    }
    else{
      link=link+ "&bs_id="+ data.bs_id
    }
    if(data.dept_id==null ||data.dept_id==''){
      data.dept_id=''
    }
    else{
      link=link+ "&dept_id="+ data.dept_id
    }
    if(data.status==null ||data.status==''){
      data.status=''
    }
    else{
      link=link+ "&status="+ data.status
    }
    if(data.type==null ||data.type==''){
      data.type=''
    }
    else{
      link=link+ "&paidtype="+ data.type
    }
    
    return this.http.get<any>(prsv +'prsnserv/provision'+ link, { 'headers': headers })
  }



  public report(data): Observable<any> {
    var link='?xb=0'
    if(data.month==null ||data.month==''){
      data.month=''
    }
    else{
      link=link+ "&month="+ data.month
    }
    if(data.year==null ||data.year==''){
      data.year=''
    }
    else{
      link=link+ "&year="+ data.year
    }
    if(data.cc_id==null ||data.cc_id==''){
      data.cc_id=''
    }
    else{
      link=link+ "&cc_id="+data.cc_id    }

    if(data.bs_id==null ||data.bs_id==''){
      data.bs_id=''
    }
    else{
      link=link+ "&bs_id="+ data.bs_id
    }
    if(data.dept_id==null ||data.dept_id==''){
      data.dept_id=''
    }
    else{
      link=link+ "&dept_id="+ data.dept_id
    }
    if(data.status==null ||data.status==''){
      data.status=''
    }
    else{
      link=link+ "&status="+ data.status
    }
    if(data.type==null ||data.type==''){
      data.type=''
    }
    else{
      link=link+ "&paidtype="+ data.type
    }
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(prsv + 'prsnserv/provision_excel_download'+link , { 'headers': headers,responseType: 'blob' as 'json'  })
  }

  public getbsvalue(bskeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((bskeyvalue == null) || (bskeyvalue == undefined) || (bskeyvalue == "")) {
      bskeyvalue==null
    }
    return this.http.get<any>(url + "usrserv/searchbusinesssegment?query=" + bskeyvalue, { 'headers': headers })
  }
  public getcclistDependentBs(id,val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((id == null) || (id == undefined) || (id == "")) {
      return
    }
    if ((val == null) || (val == undefined) || (val == "")) {
      val==null
    }
    return this.http.get<any>(prsv+ "usrserv/searchbs_cc?bs_id=" + id + "&query="+val, { 'headers': headers })
  }
  public getcategorydd(catkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'mstserv/categoryname_search?query=' + catkeyvalue+"&alp_order=1", { 'headers': headers })
  }
  public getSubcategorydataFromGL(glno,categoryid,subcatkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((subcatkeyvalue == null) || (subcatkeyvalue == undefined) || (subcatkeyvalue == "")) {
      subcatkeyvalue==""
    }
    if ((categoryid == null) || (categoryid == undefined) || (categoryid == "")) {
      return
    }
    let categoryid1=categoryid?.id
    if ((categoryid1 === null) || (categoryid1 === undefined)  || (categoryid1 === 0) || (categoryid1 === "")) {
      // console.log("calling return")
      return;
    }
    let glno1=glno?.glno
    if ((glno1 === null) || (glno1 === undefined)  || (glno1 === 0) || (glno1 === "")) {
      return;
    }
    return this.http.get<any>(url + 'mstserv/gl_search?glno=' +glno1 +"&cat_id="+ categoryid1 + "&subcategory="+subcatkeyvalue+"&action=subcat", { 'headers': headers })
  }
  public getcategorydataFromGL(catkeyvalue,glno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("getcategorydataFromGL1",catkeyvalue)
    if ((catkeyvalue == null) || (catkeyvalue == undefined) || (catkeyvalue == "")) {
      catkeyvalue==""
    }
    let glno1=glno?.glno
    if ((glno1 === null) || (glno1 === undefined)  || (glno1 === 0) || (glno1 === "")) {
      // console.log("calling return")
      return;
    }
    // console.log("getcategorydataFromGL2",glno1)
    return this.http.get<any>(url + 'mstserv/gl_search?glno=' +glno1 +"&category="+ catkeyvalue+"&action=cat", { 'headers': headers })
  }
  public getGLData(keyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((keyvalue == undefined) || (keyvalue == "")) {
      keyvalue==null
    }
    return this.http.get<any>(url + 'mstserv/gl_search?glno=' + keyvalue , { 'headers': headers })
  }
  public vendorsearch(query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'venserv/getvendor_name?query=' + query, { 'headers': headers })
  }

  public vendorbranch(deptkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'venserv/landlordbranch_list?query=' + deptkeyvalue, { 'headers': headers })
  }
  public report_dropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'prsnserv/provision_status_filter', { 'headers': headers })
  }
  public getEmployeeSearchFilter(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'usrserv/searchemployee?query=' + empkeyvalue, { 'headers': headers })
  }
  public getpvscount(data): Observable<any> {
    var link='?xb=0'
    if(data.month==null ||data.month==''){
      data.month=''
    }
    else{
      link=link+ "&month="+ data.month
    }
    if(data.year==null ||data.year==''){
      data.year=''
    }
    else{
      link=link+ "&year="+ data.year
    }
    if(data.cc_id==null ||data.cc_id==''){
      data.cc_id=''
    }
    else{
      link=link+ "&cc_id="+data.cc_id    }

    if(data.bs_id==null ||data.bs_id==''){
      data.bs_id=''
    }
    else{
      link=link+ "&bs_id="+ data.bs_id
    }
    if(data.dept_id==null ||data.dept_id==''){
      data.dept_id=''
    }
    else{
      link=link+ "&dept_id="+ data.dept_id
    }
    if(data.status==null ||data.status==''){
      data.status=''
    }
    else{
      link=link+ "&status="+ data.status
    }
    if(data.type==null ||data.type==''){
      data.type=''
    }
    else{
      link=link+ "&paidtype="+ data.type
    }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'prsnserv/provision_count' +link, { 'headers': headers })
  }
  public systemdatasearch(page,data,status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    var link='?sys=internalapi&status='+status
    if(data.module_id==null ||data.module_id==''){
      data.module_id=''
    }
    else{
      link=link+ "&module_id="+ data.module_id
    }
    if(data.cc_id==null ||data.cc_id==''){
      data.cc_id=''
    }
    else{
      link=link+ "&cc_id="+data.cc_id    }

    if(data.bs_id==null ||data.bs_id==''){
      data.bs_id=''
    }
    else{
      link=link+ "&bs_id="+ data.bs_id
    }
    if(data.branch_id==null ||data.branch_id==''){
      data.branch_id=''
    }
    else{
      link=link+ "&branch_id="+ data.branch_id
    }
    return this.http.get<any>(url + "prsnserv/provision"+link, { 'headers': headers })
  }
  public chekersearch(page,data,status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    var link='?status='+status
    if(data.module_id==null ||data.module_id==''){
      data.module_id=''
    }
    else{
      link=link+ "&module_id="+ data.module_id
    }
    if(data.cc_id==null ||data.cc_id==''){
      data.cc_id=''
    }
    else{
      link=link+ "&cc_id="+data.cc_id    }

    if(data.bs_id==null ||data.bs_id==''){
      data.bs_id=''
    }
    else{
      link=link+ "&bs_id="+ data.bs_id
    }
    if(data.branch_id==null ||data.branch_id==''){
      data.branch_id=''
    }
    else{
      link=link+ "&branch_id="+ data.branch_id
    }
    return this.http.get<any>(url + "prsnserv/provision"+link, { 'headers': headers })
    // return this.http.get<any>(url + "prsnserv/provision?status="+status+"&page="+page+"&branch_id="+module, { 'headers': headers })
  }
  public search_employeebranch(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'usrserv/search_employeebranch?query=' + empkeyvalue, { 'headers': headers })
  }

  public datesaerch(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'prsnserv/previousprovision?previouse_month=' + empkeyvalue, { 'headers': headers })
  }
  public get_EmployeeName(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";
    }
    let urlvalue = url + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public delmat(query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'prsnserv/delmat?page='+ query, { 'headers': headers })
  }

  public department(query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'usrserv/searchdepartment?type=provision&query='+ query, { 'headers': headers })
  }

  public provisionfilterget(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'prsnserv/provision_status_filter', { 'headers': headers })
  }

  public moduleget(a): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'prsnserv/modulenamelist', { 'headers': headers })
  }
  public delmatapprover(query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'prsnserv/delmat?action=Approved', query, { 'headers': headers })
  }
  
  public delmatadd(value): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + 'prsnserv/delmat',value, { 'headers': headers })
  }

  async  branchdata()  {

    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    const res:any=await this.http.get<any>(url + 'usrserv/user_branch', { 'headers': headers }).toPromise();
  
    this.users= res
    return this.users  }
  public getapsubcatDropDown(id, val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if ((val == null) || (val == undefined) || (val == "")) {
      val==null
    }
    if ((id == null) || (id == undefined) || (id == "")) {
      return
    }
    return this.http.get<any>(url + 'mstserv/subcatname_search?category_id=' + id + '&query='+val+"&alp_order=1", { 'headers': headers })
  }
  public fileupload(filedata): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let formData = new FormData();
    // formData.append("data", JSON.stringify(jsondata))
    formData.append("file", filedata)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "prsnserv/provision_excel_upload",formData, { 'headers': headers })
    

  }
  public exceldownload(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'prsnserv/provision_sample_excel', { headers, responseType: 'blob' as 'json' })
  }


  public provisionBulkUpdate(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token } 
    
    return this.http.post<any>(prsv + "prsnserv/provision", data, { 'headers': headers })
  }


  public provisionsearchsystemdata(data,page): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    var link='?page='+page
    if(data.month==null ||data.month==''){
      data.month=''
    }
    else{
      link=link+ "&expense_month="+ data.month
    }
    if(data.year==null ||data.year==''){
      data.year=''
    }
    else{
      link=link+ "&expense_year="+ data.year
    }
    if(data.cc_id==null ||data.cc_id==''){
      data.cc_id=''
    }
    else{
      link=link+ "&cc_id="+data.cc_id    }

    if(data.bs_id==null ||data.bs_id==''){
      data.bs_id=''
    }
    else{
      link=link+ "&bs_id="+ data.bs_id
    }
    if(data.dept_id==null ||data.dept_id==''){
      data.dept_id=''
    }
    else{
      link=link+ "&dept_id="+ data.dept_id
    }
    if(data.status==null ||data.status==''){
      data.status=''
    }
    else{
      link=link+ "&status="+ data.status
    }
    if(data.type==null ||data.type==''){
      data.type=''
    }
    else{
      link=link+ "&paidtype="+ data.type
    }
    if(data.module_id ==null ||data.module_id ==''){
      data.module_id='' 
    }else{
      link=link+ "&module_id="+ data.module_id
    }
    
    return this.http.get<any>(prsv +'prsnserv/provision'+ link+"&is_module=1", { 'headers': headers })
  }




  public reportsystem(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let link: any = "?is_module=1"
    if(data.month==null ||data.month==''){
      data.month=''
    }
    else{
      link=link+ "&expense_month="+ data.month
    }
    if(data.year==null ||data.year==''){
      data.year=''
    }
    else{
      link=link+ "&expense_year="+ data.year
    }
    if(data.cc_id==null ||data.cc_id==''){
      data.cc_id=''
    }
    else{
      link=link+ "&cc_id="+data.cc_id    }

    if(data.bs_id==null ||data.bs_id==''){
      data.bs_id=''
    }
    else{
      link=link+ "&bs_id="+ data.bs_id
    }
    if(data.dept_id==null ||data.dept_id==''){
      data.dept_id=''
    }
    else{
      link=link+ "&dept_id="+ data.dept_id
    }
    if(data.status==null ||data.status==''){
      data.status=''
    }
    else{
      link=link+ "&status="+ data.status
    }
    if(data.type==null ||data.type==''){
      data.type=''
    }
    else{
      link=link+ "&paidtype="+ data.type
    }
    if(data.module_id ==null ||data.module_id ==''){
      data.module_id='' 
    }else{
      link=link+ "&module_id="+ data.module_id
    }
    return this.http.get<any>(prsv + 'prsnserv/provision_excel_download'+link , { 'headers': headers,responseType: 'blob' as 'json'  })
  }


  public provisionReportSearch (data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(prsv + 'prsnserv/stand_by_provision_report?from_date='+data?.fromdate+ '&to_date='+data?.todate+'&provision_status='+ data?.status , { 'headers': headers,responseType: 'blob' as 'json'  })
  } 

  public report_dropdownAction(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + 'prsnserv/provision_status_filter?action=report', { 'headers': headers })
  }



  // 
}
