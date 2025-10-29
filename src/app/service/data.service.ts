import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators'
import { User } from '../user'
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

const url = environment.apiURL
const memoUrl = environment.apiURL
// const crmurl = environment.apiURLS



@Injectable({
  providedIn: 'root'
})
export class DataService {
  idleState = 'Not started.';
  publicKey = new BehaviorSubject<string>('');
  timedOut = false;
  isLoggedSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public messageSource = new BehaviorSubject<string>('');
  isLoading = new BehaviorSubject<boolean>(false);
  public _refresh = new Subject<void>();
  users;
  constructor(private idle: Idle, private http: HttpClient,) { }
  /*Loading*/
  show() {
    this.isLoading.next(true)
  }
  hide() {
    this.isLoading.next(false);
  }
  get refresh() {
    return this._refresh;
  }

  //  Login Data
  public login(user: User): Observable<any> {
    this.reset();
    const headers = { 'content-type': 'application/json' }
    const userdata = {
      'username': user.username,
      'password': user.password
    }
    const body = JSON.stringify(userdata);
    return this.http.post(memoUrl + 'usrserv/auth_token' + '', body, { 'headers': headers })
  }
  // public login(user: User): Observable<any> {
  //
  //   const headers = { 'content-type': 'application/json' }
  //   const userdata={
  //     'username':"tester1",

  //     'password':"MTIzNA=="
  //   }
  //   const body = JSON.stringify(userdata);
  //   return this.http.post(memoUrl + 'usrserv/auth_token' + '', body, { 'headers': headers })
  // }
  encryptPassword(password: string): string {
    const key = CryptoJS.enc.Utf8.parse(environment.crypto_encrypt_key);
    const encrypted = CryptoJS.AES.encrypt(password, key, {
      mode: CryptoJS.mode.ECB, 
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }
  public logout(): Observable<any> {
    this.reset();
    let token = '';
    // const getToken = localStorage.getItem("sessionData");
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(memoUrl + "usrserv/logout", {}, { 'headers': headers })
  }

  async getempmobiedata(empcode: any) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // if (pan == null || pan == '') {
    //   pan = "''"
    // }
    const res: any = await this.http.get<any>(memoUrl + 'usrserv/fetch_empmobile?code=' + empcode, { 'headers': headers }).toPromise();
    this.users = res

    return this.users
  }

  async Finduserlocation(ips, code) {
    this.reset();
    const headers = { 'Authorization': 'Token ' + ips }
    const res: any = await this.http.get<any>(memoUrl + 'usrserv/loginstatus?code=' + code, { 'headers': headers }).toPromise();
    this.users = res
    return this.users
  }

  async gen_otp(mob, type, employee_id, token) {
    this.reset();
    const headers = { 'Authorization': 'Token ' + token }
    const res: any = await this.http.get<any>(memoUrl + 'venserv/validate?type=' + type + '&value=' + mob.mobile_number + '&otp=' + mob.otp + '&employee_id=' + employee_id, { 'headers': headers }).toPromise();
    this.users = res
    return this.users
  }

  //   public login_status(): Observable<any> {
  //     const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
  // return this.http.get('https://ifconfig.me/forwarded',{ headers, responseType: 'text'});

  //   }



  async employeemobilenomicro(mobiledata, id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    // console.log("branchacty", JSON.stringify(branchActivity))
    // mobiledata.mobile_number=btoa(mobiledata.mobile_number)
    const headers = { 'Authorization': 'Token ' + token }
    const res: any = await this.http.post<any>(memoUrl + "usrserv/employeemobilenomicro?code=" + id + "&otp=" + mobiledata.otp, mobiledata, { 'headers': headers }).toPromise();
    this.users = res
    return this.users
  }
  public mobiledatapost(mobiledata): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // console.log("branchacty", JSON.stringify(branchActivity))
    // mobiledata.mobile_number=btoa(mobiledata.mobile_number)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(memoUrl + "usrserv/mobileupdation", mobiledata, { 'headers': headers })
  }
  //Login Data 
  // public login(user: User): Observable<any> {
  //
  //   const headers = { 'content-type': 'application/json' }
  //   const body = JSON.stringify(user);
  //   // // console.log(body)
  //   // console.log(memoUrl);
  //   return this.http.post(memoUrl + 'usrserv/auth_token' + '', body, { 'headers': headers })
  //   // .subscribe(data => {
  //   //   if(data){
  //   //     this.Loginname=data.name;
  //   //   }
  //   // })
  // }

  // public logout(): Observable<any> {
  //
  //   let token='';
  //   const getToken: any = sessionStorage.getItem('sessionData')
  //   if (getToken){
  //     let tokenValue = JSON.parse(getToken);
  //     token = tokenValue.token;
  //   }
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(memoUrl + "usrserv/logout",{}, { 'headers': headers })
  // }


  public getSender(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "usrserv/user_emp_list?search=true", { 'headers': headers })
  }

  public getEmployeeTo(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "usrserv/employee", { 'headers': headers })
  }

  public getDepartment(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "usrserv/department", { 'headers': headers })
  }

  public getCategory(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/category?department_id=" + id, { 'headers': headers })
  }

  public getSubCategory(id: any): Observable<any> {
    this.reset();
    if (id === undefined) {
      return;
    }

    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/category/" + id + "/subcategory", { 'headers': headers })
  }

  public createNewMemo(memoCreateList: any, images: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let formData = new FormData();
    formData.append('data', JSON.stringify(memoCreateList));
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }

    // formData.append('file', memoCreateList.images);
    const headers = { 'Authorization': 'Token ' + token }
    let url = memoUrl + "memserv/memo";
    return this.http.post<any>(url, formData, { 'headers': headers })

  }

  public createForwardForm(memoCreateList: any, images: any, id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = id;
    let value = {
      "ref_id": idValue,
    }
    let to_dept = memoCreateList['to_dept']
    // let department = {
    //   "to_dept": [to_dept]
    // }
    let department = to_dept;
    let jsonValue = Object.assign({}, memoCreateList, value, department)
    let formData = new FormData();
    formData.append('data', JSON.stringify(jsonValue));
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    // formData.append('file', images);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(memoUrl + "memserv/memo", formData, { 'headers': headers })
  }

  /*MemoSummary*/
  /*DropDownValue*/
  public getUserList(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "usrserv/filter?search=memo_filter", { 'headers': headers })

  }


  public getMemoHistoryView(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/audit", { 'headers': headers })
  }



  /*generate pdf*/


  public printFilePDF(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/pdf", { headers, responseType: 'blob' as 'json' })
  }


  public downloadFilePDF(id: any, comm: boolean): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/pdf?comments=" + comm, { headers, responseType: 'blob' as 'json' })
  }




  public memoSummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(memoUrl + "memserv/memo", { headers, params })
  }

  public getCommentData(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/comments", { headers })
  }



  public createCommentform(comment: any, id: any, images: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = id;
    // debugger;
    let value = {
      "memo_id": idValue,
      "ref_id": idValue,
      "status": "comment",
      "type": 1 //// comments =1,superscript =2,forward =3,reply = 4,opinion_cmt=5,approver_cmt = 6,recommender_cmt = 7,skip_cmt = 8,reviewresubmit=9
    }
    let object = Object.assign({}, comment, value)
    let formData = new FormData();
    formData.append('data', JSON.stringify(object));
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(memoUrl + "memserv/memo/" + idValue + '/comments', formData, { 'headers': headers })
  }
  public SkipMemo_service(content: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let url = memoUrl + "memserv/skip_tran"
    return this.http.post<any>(url, content, { 'headers': headers })
  }
  public memoContentUpdate(content: any, id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = id;
    // let object = Object.assign({}, content);
    // let formData = new FormData();
    // formData.append('data', JSON.stringify(object));
    const headers = { 'Authorization': 'Token ' + token }
    let url = memoUrl + "memserv/memo/" + idValue + "/edit"
    return this.http.post<any>(url, content, { 'headers': headers })
  }


  public approveCommentForm(comment: any, id: any, images: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = id;
    let value = {
      "memo_id": idValue,
      "ref_id": idValue,
      "status": "approve",
      "type": 6 // comments =1,superscript =2,forward =3,reply = 4,opinion_cmt=5,approver_cmt = 6,recommender_cmt = 7,skip_cmt = 8,reviewresubmit=9
    }
    let object = Object.assign({}, comment, value)
    let formData = new FormData();
    formData.append('data', JSON.stringify(object));
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    // formData.append('file', images);
    const headers = { 'Authorization': 'Token ' + token }
    let url = memoUrl + "memserv/memo/" + idValue + '/comments'
    return this.http.post<any>(url, formData, { 'headers': headers })
  }

  public resubmitCommentForm(comment: any, id: any, images: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = id;
    let value = {
      "memo_id": idValue,
      "ref_id": idValue,
      "status": "review",
      "type": 9 // comments =1,superscript =2,forward =3,reply = 4,opinion_cmt=5,approver_cmt = 6,recommender_cmt = 7,skip_cmt = 8,reviewresubmit=9
    }
    let object = Object.assign({}, comment, value)
    let formData = new FormData();
    formData.append('data', JSON.stringify(object));
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    const headers = { 'Authorization': 'Token ' + token }
    let url = memoUrl + "memserv/memo/" + idValue + '/comments'
    return this.http.post<any>(url, formData, { 'headers': headers })
  }

  public getFetch(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    let url = memoUrl + "memserv/memo/" + idValue
    return this.http.get<any>(url, { headers })
  }

  public getForwardComments(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    let url = memoUrl + "memserv/memo/" + idValue + "/forward_comment"
    return this.http.get<any>(url, { headers })
  }


  public getDocuments(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/documents", { headers })
  }

  public getApprove(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/approver", { headers })
  }

  public ds_getRecommender(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/recommender", { headers })
  }
  public getassign(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/iom_actiontaken", { headers })
  }
  public createcommentsForm(CreateList: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "memserv/memo/" + id + "/forward_comment", body, { 'headers': headers })
  }
  public getCloseMemo(id: any): Observable<any> {

    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/close", { headers })
  }

  public getEmployeeList(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + 'usrserv/employee', { 'headers': headers })
  }

  public getCategoryList(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/category", { 'headers': headers })
  }


  public getSubCategoryList(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/category/" + 1 + "/subcategory", { 'headers': headers })
  }
  public getDepartmentList(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "usrserv/department", { 'headers': headers })
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  public getMenuUrl(): Observable<any> {
    this.reset();
    let token = '';
    let userId = ''
    // const getToken = localStorage.getItem("sessionData");
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
      userId = tokenValue.user_id;
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "usrserv/user_modules", { 'headers': headers })
  }

  public getSubModule(menuId: number): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "usrserv/usermodule/" + menuId + "/submodule", { 'headers': headers })
  }
  public getRefresh(): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let url = memoUrl + "usrserv/refreshtoken"
    let object = {}
    let json = Object.assign({}, object)
    return this.http.post<any>(url, json, { 'headers': headers })
  }
  public getDepartmentToEmployeeList(deptId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = deptId
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + 'usrserv/department/' + idValue + '/employee', { 'headers': headers })
  }
  public get_EmployeeList(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
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

  public addemp_Todepartment(memojson: any, deptId: any, admin: any, memo: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = deptId
    let rights = {
      "isadmin": admin,
      "can_create": memo
    }
    const url = memoUrl + 'usrserv/department/' + idValue + '/employee'
    let object = {
      "method": "add"
    }
    let json = Object.assign({}, memojson, object, rights, idValue)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url, json, { 'headers': headers })

  }

  public employeeDelete(memojson1: any, deptId: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = deptId;
    const url = memoUrl + 'usrserv/department/' + idValue + '/employee'
    let object = {
      "method": "remove"
    }
    let json = Object.assign({}, object, memojson1, idValue)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url, json, { 'headers': headers })

  }

  public get_empTodeptMapping(empId: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = empId
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + 'usrserv/employee/' + idValue + '/department', { 'headers': headers })
  }
  public get_DepartmentList(deptkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (deptkeyvalue === null) {
      deptkeyvalue = "";
    }
    let urlvalue = url + 'usrserv/searchdepartment?query=' + deptkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_Department(deptId: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = deptId
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + 'usrserv/department/' + idValue, { 'headers': headers })
  }
  public getPriorityList(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "memserv/memopriority", { 'headers': headers })
  }
  public createPriorityForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "memserv/memopriority", body, { 'headers': headers })
  }
  public priorityEditForm(data: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "memserv/memopriority", jsonValue, { 'headers': headers })
  }
  public priorityDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(url + "memserv/memopriority/" + idValue, { 'headers': headers })

  }
  public saveAsDraft(data: any, Draftid: any, images: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let formData = new FormData();
    if (Draftid != "") {
      let idValue = {
        "id": Draftid,
        "document_arr": []
      }
      let obj = Object.assign({}, data, idValue)
      formData.append('data', JSON.stringify(obj));
      if (images !== null) {
        for (var i = 0; i < images.length; i++) {
          formData.append("file", images[i]);
        }
      }
    }
    else {
      let document = {
        "document_arr": []
      }
      let ob = Object.assign({}, document, data)
      formData.append('data', JSON.stringify(ob));
      if (images !== null) {
        for (var i = 0; i < images.length; i++) {
          formData.append("file", images[i]);
        }
      }
    }

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "memserv/memo_draft", formData, { 'headers': headers })
  }

  public sendMemo(draftId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "memserv/memo/" + draftId + "/send_memo", { 'headers': headers })
  }

  public reDraftSave(data: any, id: number, images: any, documentList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    let value = {
      "id": idValue,
      "sender": data.sender,
      "category": data.category,
      "sub_category": data.sub_category,
      "type": data.type,
      "confidential": data.confidential,
      "bto_emp": data.bto_emp,
      "content": data.content,
      "document_arr": documentList,
      "to_emp": data.to_emp,
      "to_dept": data.to_dept,

    }
    let jsonValue = Object.assign({}, data, value)
    let formData = new FormData();
    formData.append('data', JSON.stringify(jsonValue));
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "memserv/memo_draft", formData, { 'headers': headers })
  }

  public saveDraft(draftId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "memserv/memo/" + draftId + "/send_memo", { 'headers': headers })
  }
  public reCommendForm(createList: any, id: any, images: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = id;
    let value = {
      "memo_id": idValue,
      "ref_id": idValue,
      "type": 7 // comments =1,superscript =2,forward =3,reply = 4,opinion_cmt=5,approver_cmt = 6,recommender_cmt = 7,skip_cmt = 8,reviewresubmit=9
      // "status": "recommended",
    }
    let object = Object.assign({}, createList, value)
    let formData = new FormData();
    formData.append('data', JSON.stringify(object));
    if (images !== null) {
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
    }
    // formData.append('file', images);
    const headers = { 'Authorization': 'Token ' + token }
    let url = memoUrl + "memserv/memo/" + idValue + '/comments'
    return this.http.post<any>(url, formData, { 'headers': headers })
  }
  public ParallelDelivery(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "memserv/memo/" + id + "/parallel_delivery", { 'headers': headers })
  }

  public AnnotationNotification(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "memserv/annotation_notification/" + id, { 'headers': headers })
  }



  public superScriptForm(id, superScript): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    formData.append('data', JSON.stringify(superScript));
    return this.http.post<any>(memoUrl + "memserv/memo/" + id + '/comments', formData, { 'headers': headers })
  }

  public CreateAnnotation(superScriptcomment, id, scriptid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(superScriptcomment)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(memoUrl + "memserv/memo/" + id + '/super_script/' + scriptid, body, { 'headers': headers })


  }

  public superscriptEditForm(data: any, id: number, commentid: number, scriptid: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = commentid;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "memserv/memo/" + id + '/super_script/' + scriptid, jsonValue, { 'headers': headers })
  }
  public superscriptDeleteForm(scriptid: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "memserv/delete_annotation/" + scriptid, { 'headers': headers })

  }


  public getSuperScript(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(url + "memserv/memo/" + id + "/super_script", { 'headers': headers })
  }

  // nogitd

  public getempmobno(data, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "usrserv/empmobilenolist?page=" + page, data, { 'headers': headers })
  }

  public activeInactivemobno(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "usrserv/empmobilenostatus", data, { 'headers': headers })
  }
  public mobnoupdateorcreate(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "usrserv/employeemobileno", data, { 'headers': headers })
  }
  public getAMBranchdropdown(pageNumber = 1, data: any): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(url + "usrserv/search_branch?page=" + pageNumber + '&query=' + data, { 'headers': headers })
  }
  public checkmobnoexist(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "usrserv/find_mobileno_exist", data, { 'headers': headers })
  }

  public find_mobileno_exist_for_employee(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(url + "usrserv/find_mobileno_exist_for_employee", data, { 'headers': headers })
  }




  public createOpinionform(opinion: any, id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = id;
    let value = {
      "status": opinion.status, "remarks": opinion.content, memo_id: id,
      "type": 5 // comments =1,superscript =2,forward =3,reply = 4,opinion_cmt=5,approver_cmt = 6,recommender_cmt = 7,skip_cmt = 8,reviewresubmit=9
    }



    // let object = Object.assign({}, opinion, value)
    // let formData = new FormData();
    // formData.append('data', JSON.stringify(object));
    // if (images !== null) {
    //   for (var i = 0; i < images.length; i++) {
    //     formData.append("file", images[i]);
    //   }
    // }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(memoUrl + "memserv/approve_opinion_tran", value, { 'headers': headers })
  }



  public SelectedEmpOpinionform(dataOpinion): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(memoUrl + "memserv/opinion_tran", dataOpinion, { 'headers': headers })
  }

  public ds_getOpinion(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/opinion_tran_summary?memo_id=" + id, { headers })
  }
  public ds_getOpinionHistory(id: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/opinion_tran_summary?type=history&memo_id=" + id, { headers })
  }

  public CancelOpinionform(dataOpinion): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(memoUrl + "memserv/opinion_tran?action=cancel", dataOpinion, { 'headers': headers })
  }
  public getVendor(vendorId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "venserv/vendor/" + vendorId, { 'headers': headers })
  }

  //To Get Question and Answer
  public evaluateactivitysubmit(vendorid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(memoUrl + "venserv/evaluate_answer/" + vendorid, { 'headers': headers })
  }

  //  //For Question Submit 
  public activitysubmit(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("docpost", json)
    return this.http.post<any>(memoUrl + "venserv/activity_answer_create", json, { 'headers': headers })
  }

  //  //FOr Reject & Renew 
  public approveactivitysubmit(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("docpost", json)
    // return this.http.post<any>(memoUrl + "venserv/question_answer_mapping", json, { 'headers': headers })
    return this.http.post<any>(memoUrl + "venserv/mapping_question_answer ", json, { 'headers': headers })

  }
  public getdeptlists(deptdata, pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(memoUrl + "usrserv/employeegroup_search?name=" + deptdata + "&type=" + 0 + "&page=" + pageNumber, { 'headers': headers })
  }

  public getperiodlist(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + 'mstserv/period_drop_down', { 'headers': headers })
  }
  public questionnairedocumentupload(vendorId, object, files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let formData = new FormData();

    // let obj = Object.assign({}, docJson, vendorId)
    formData.append('data', JSON.stringify(object));
    if (files !== null) {
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    }

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(memoUrl + "venserv/doc/" + vendorId, formData,
      { 'headers': headers })
  }
  public getfiledelete(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(memoUrl + "venserv/deletefile/QUS_" + value, { 'headers': headers })
  }
  public getfiledownload(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "venserv/quesfile/QUS_" + value, { 'headers': headers, responseType: 'blob' as 'json' })
  }


  public mstsync_reportdownload(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "mstserv/mastersync_checkz", { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public getRiskQuestions(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(memoUrl + 'venserv/search?page=' + pageNumber, { 'headers': headers })

  }

  public getnewFetch(id: any,empid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    let url = memoUrl + "memserv/memo/" + idValue +"?view_data=" + empid
    return this.http.get<any>(url, { headers })
  }

  public getnew_MemoHistoryView(id: any,empid:any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/audit"+"?view_empid=" + empid, { 'headers': headers })
  }

  public getnew_Documents(id: any,empid:any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/documents"+"?view_empid=" + empid, { headers })
  }

  public getnew_Approve(id: any,empid:any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/approver"+"?view_empid=" + empid, { headers })
  }

  public downloadnew_FilePDF(id: any, comm: boolean,empid:any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(memoUrl + "memserv/memo/" + idValue + "/pdf?comments=" + comm +"&view_empid="+empid, { headers, responseType: 'blob' as 'json' })
  }
public get_public_key(): Observable<any> {
    this.reset();
    let headers={}
    // const headers = { 'content-type': 'application/json' }
    return this.http.post<any>(memoUrl + "usrserv/get_public_key",{}, { 'headers': headers })
  }
}


