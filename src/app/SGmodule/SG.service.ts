import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { SGShareService } from './share.service';
import { environment } from 'src/environments/environment';

const Sgmodelurl = environment.apiURL


@Injectable({
  providedIn: 'root'
})
export class SGService {


  constructor(private http: HttpClient, private share: SGShareService, private idle: Idle
  ) { }
  moveToApproverJson: any;
  invoiceSummary: any;
  ApproverJson: any;
  rejectJson: any;
  reviewJson: any;
  invoiceCreation: any;
  addPenalty: any;
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getEmployeecat(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(Sgmodelurl + "mstserv/employeementcat?page=" + pageNumber, { 'headers': headers, params })
  }


  public getemployeementcatdropsown(query) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = Sgmodelurl + 'mstserv/searchemployeecatdesc?query=' + query;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getEmployeetype(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(Sgmodelurl + "mstserv/employeetype?page=" + pageNumber, { 'headers': headers, params })
  }
  public getStatezone(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(Sgmodelurl + "mstserv/statezonecity?page=" + pageNumber, { 'headers': headers, params })
  }


  public getSeparateState(id: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();


    return this.http.get<any>(Sgmodelurl + "mstserv/statezonecity?statemap_id=" + id, { 'headers': headers, params })
  }


  public getminwages(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(Sgmodelurl + "mstserv/statezone_mapping?page=" + pageNumber, { 'headers': headers })
  }

  employeecat: any
  public employeecatCreateForm(event: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(id);
    if (id == "") {
      this.employeecat = event;
    } else {
      let ids = {
        "id": id
      }
      this.employeecat = Object.assign({}, event, ids)
    }
    return this.http.post<any>(Sgmodelurl + 'mstserv/employeementcat', this.employeecat, { 'headers': headers })
  }
  employeetype: any
  public employeetypeCreation(event: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    if (id == "") {
      this.employeetype = event;
    } else {
      let ids = {
        "id": id
      }
      this.employeetype = Object.assign({}, event, ids)
    }

    return this.http.post<any>(Sgmodelurl + 'mstserv/employeetype', this.employeetype, { 'headers': headers })
  }
  statezonemapping: any
  public stateZoneAddition(event: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    if (id == "") {
      this.statezonemapping = event;
    } else {
      let ids = {
        "id": id
      }
      this.statezonemapping = Object.assign({}, event, ids)
    }

    return this.http.post<any>(Sgmodelurl + 'mstserv/statezone_mapping', this.statezonemapping, { 'headers': headers })
  }
  statezone: any
  public statezoneFormCreation(event: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    if (id == "") {
      this.statezone = event;
    } else {
      let ids = {
        "id": id
      }
      this.statezone = Object.assign({}, event, ids)
    }

    return this.http.post<any>(Sgmodelurl + 'mstserv/statezonecity', this.statezone, { 'headers': headers })
  }

  public empolyeecatdelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(Sgmodelurl + 'mstserv/deleteemployeementcat/' + id, { 'headers': headers })
  }
   public holidaydelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/sg_holiday_delete/' + id, { 'headers': headers })
  }



  //vendor markup


  public getvendoretails(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(Sgmodelurl + "sgserv/vendormarkup?page=" + pageNumber, { 'headers': headers, params })
  }


  //vendormarkup summaryy
  public getvendorMarkupSummary(val, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/vendormarkup?page=' + pageNumber + val, { 'headers': headers })
  }

  venddorcard: any
  public createvendoretails(event: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(id);
    if (id == "") {
      this.venddorcard = event;
    } else {
      let ids = {
        "id": id
      }
      this.venddorcard = Object.assign({}, event, ids)
    }
    return this.http.post<any>(Sgmodelurl + 'sgserv/vendormarkup', this.venddorcard, { 'headers': headers })
  }


  public getvendordropdown(query, pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = Sgmodelurl + 'sgserv/searchvendorname?query=' + query + '&page=' + pagenumber;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  public getdepenceofZonedropdowm(query): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = Sgmodelurl + 'mstserv/statezonesearch?state=' + query;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )

  }




  // holiday master component





  createholidayform(id, data, files) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (files == undefined) {
      files = ''
    }
    let formData = new FormData();
    let s = {
      state_id: data.state_id,
      vendor_id: data.vendor_id,
      year: data.year
    }

    formData.append("data", JSON.stringify(s));
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
    return this.http.post<any>(Sgmodelurl + "sgserv/sg_holiday",
      formData, { 'headers': headers })

  }

  getholidayformdetails(val, pageNumber = 1) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params = new HttpParams();
    params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(Sgmodelurl + "sgserv/sg_holiday?page=" + pageNumber + val, { 'headers': headers })

  }



  // holiday master component finished




  public getState(query, pagenumer) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = Sgmodelurl + 'mstserv/state_search?query=' + query + '&page=' + pagenumer;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getStatezonesearch(query, pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = Sgmodelurl + 'mstserv/statezonesearch?state=' + query + '&page=' + pagenumber;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  // login//

  public creatclientlogin(event: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(id);
    if (id == "") {
      this.venddorcard = event;
    } else {
      let ids = {
        "id": id
      }
      this.venddorcard = Object.assign({}, event, ids)
    }
    return this.http.post<any>(Sgmodelurl + 'venserv/clientportal', this.venddorcard, { 'headers': headers })
  }

  public creatvendorlogin(event: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(id);
    if (id == "") {
      this.venddorcard = event;
    } else {
      let ids = {
        "id": id
      }
      this.venddorcard = Object.assign({}, event, ids)
    }
    return this.http.post<any>(Sgmodelurl + 'venserv/clientportal', this.venddorcard, { 'headers': headers })
  }


  public creatnonemplogin(event: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(id);
    if (id == "") {
      this.venddorcard = event;
    } else {
      let ids = {
        "id": id
      }
      this.venddorcard = Object.assign({}, event, ids)
    }
    return this.http.post<any>(Sgmodelurl + 'venserv/nonemployeeportal', this.venddorcard, { 'headers': headers })
  }


  branchcert: any

  // branch certificate creation form
  public BranchCertification(branch: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(id);
    if (id == "") {
      this.branchcert = branch;
    } else {
      let ids = {
        "id": id
      }
      this.branchcert = Object.assign({}, branch, ids)
    }
    const body = JSON.stringify(this.branchcert)
    console.log("create branch", body)
    let branchcreate = Sgmodelurl + 'sgserv/branchcertification'
    return this.http.post<any>(branchcreate, body, { 'headers': headers })


  }
  //get branch,premise,month,year 
  getbranchView(data) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let premise_id = data.premise.id
    let branch_id = data.branch.id
    let month = data.month
    let year = data.year
    let id = data.id
    if (data.branchcertification_id) {
      let from_headerlogin_BranchID = data.branchcertification_id
      return this.http.get<any>(Sgmodelurl + 'sgserv/branchcertification?month=' + month + '&year=' + year + '&premise_id=' + premise_id + '&branch_id=' + branch_id + '&id=' + from_headerlogin_BranchID, { 'headers': headers })
    } else {
      return this.http.get<any>(Sgmodelurl + 'sgserv/branchcertification?month=' + month + '&year=' + year + '&premise_id=' + premise_id + '&branch_id=' + branch_id + '&id=' + id, { 'headers': headers })
    }

  }
  values: any
  branchstatus(branch, premiseid) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.values = branch
    return this.http.post<any>(Sgmodelurl + 'sgserv/branchcertification_status/' + premiseid, this.values, { 'headers': headers })
  }



  public getparticularemptype(pageNumber = 1, pageSize = 10, empcatid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(Sgmodelurl + "mstserv/employeetype?employee_cat=" + empcatid, { 'headers': headers })
  }
  premise: any
  vendorid: any
  public premiseaddform(vendorid, premise: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    console.log(id);
    let vendoridd = vendorid
    if (id == "") {
      this.premise = premise;
    } else {
      let ids = {
        "id": id
      }
      this.premise = Object.assign({}, premise, ids)
    }
    const body = JSON.stringify(this.premise)
    return this.http.post<any>(Sgmodelurl + 'sgserv/vendormarkupmapping/' + vendoridd, body, { 'headers': headers })


  }
  public edit_venmarkup_type(obj): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(Sgmodelurl + 'sgserv/edit_vendormarkupmapping_type', obj, { 'headers': headers })
  }
  public getemployeetypedropdown(query) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = Sgmodelurl + 'mstserv/employeetype?query=Security guard';
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  employee: any
  public Employeeaddform(employee: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(id);

    if (id == "") {
      this.employee = employee;
    } else {
      let ids = {
        "id": id
      }
      this.employee = Object.assign({}, employee, ids)
    }
    return this.http.post<any>(Sgmodelurl + 'sgserv/sg_employee_create', this.employee, { 'headers': headers })


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
    let urlvalue = Sgmodelurl + 'pdserv/premise_restriction?query=' + query + '&page=' + pagenumer;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  getEmployeeList(pageNumber = 1, pageSize = 10, vendorid) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(Sgmodelurl + "sgserv/sg_employee_create?vendor_id=" + vendorid, { 'headers': headers })

  }
  public getbranchdropdown(query, pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = Sgmodelurl + 'usrserv/search_employeebranch?query=' + query + "&page=" + pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  verndorup: any
  public createprimesdepencesvendor(event: any, id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(id);
    if (id == "") {
      this.verndorup = event;
    } else {
      let ids = {
        "id": id
      }
      this.verndorup = Object.assign({}, event, ids)
    }
    return this.http.post<any>(Sgmodelurl + 'mstserv/employeementcat/' + id, this.verndorup, { 'headers': headers })

  }

  // Attenadance screen services


  public getattendacedetails(primiseid, branch_id, month, year, vendorid, pagenumber): Promise<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + "sgserv/attendance?premise_id=" + primiseid + "&month=" + month + "&year=" + year + "&branch_id=" + branch_id + "&vendor_id=" + vendorid + "&page=" + pagenumber, { 'headers': headers }).toPromise()
  }

  //present all 
  public presentAll(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let data = Object.assign({}, json);
    const body = JSON.stringify(data)
    console.log("present all", body)
    return this.http.post<any>(Sgmodelurl + "sgserv/present_all", json, { 'headers': headers })
  }



  public postAttendancedetails(event: any, id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(id);
    if (id == "") {
      this.verndorup = event;
    } else {
      let ids = {
        "id": id
      }
      this.verndorup = Object.assign({}, event, ids)
    }
    return this.http.post<any>(Sgmodelurl + 'sgserv/attendance', this.verndorup, { 'headers': headers })

  }


  public getattendancedependate(list, pagenumber): Promise<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.post<any>(Sgmodelurl + "sgserv/attendance_date?page=" + pagenumber, list, { 'headers': headers }).toPromise()
  }



  public postattendancedependate(event: any, id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(id);
    if (id == "") {
      this.verndorup = event;
    } else {
      let ids = {
        "id": id
      }
      this.verndorup = Object.assign({}, event, ids)
    }
    return this.http.post<any>(Sgmodelurl + 'sgserv/attendance_date', { 'headers': headers })

  }

  //attendance screen dropdowm

  public getprimeslist(query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + "pdserv/premise_restriction?query=" + query, { 'headers': headers })
  }

  public getbranchlist(query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + "usrserv/search_employeebranch?query=" + query, { 'headers': headers })
  }

  // move to approver button 
  public movetoApprover(remarks, branchCerSingleGet_Id, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.moveToApproverJson = Object.assign({}, remarks, json);
    return this.http.post<any>(Sgmodelurl + "sgserv/branchcertification_status/" + branchCerSingleGet_Id, this.moveToApproverJson, { 'headers': headers })
  }



  // approver button 
  public approver(remarks, branchCerSingleGet_Id, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.ApproverJson = Object.assign({}, remarks, json);
    return this.http.post<any>(Sgmodelurl + "sgserv/branchcertification_status/" + branchCerSingleGet_Id, this.ApproverJson, { 'headers': headers })
  }


  // reject button 
  public reject(remarks, branchCerSingleGet_Id, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.rejectJson = Object.assign({}, remarks, json);
    return this.http.post<any>(Sgmodelurl + "sgserv/branchcertification_status/" + branchCerSingleGet_Id, this.rejectJson, { 'headers': headers })
  }



  // review button 
  public review(remarks, branchCerSingleGet_Id, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.reviewJson = Object.assign({}, remarks, json);
    return this.http.post<any>(Sgmodelurl + "sgserv/branchcertification_status/" + branchCerSingleGet_Id, this.reviewJson, { 'headers': headers })
  }

  //employee field  for branch creation screen (approver)

  public getEmployeeFilter(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }


  //branch approval flow
  public getIdentificationHistory(branchGet_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/approvalqueue/' + branchGet_id + '?q_type=2', { 'headers': headers })
  }

  // dataEntry For Table summary
  public onClickDataEntryButton(branchReport: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(Sgmodelurl + 'sgserv/attendance_bc', branchReport, { 'headers': headers })
  }

  // branch Certification updation
  public BranchCertificationUpdate(branch: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.branchcert = Object.assign({}, branch)
    const body = JSON.stringify(this.branchcert)
    console.log("branch edit", body)
    let branchcreate = Sgmodelurl + 'sgserv/branchcertification'
    return this.http.post<any>(branchcreate, body, { 'headers': headers })
  }

  //branchcertification_id_check - branch,premise,month,year 
  branchcertification_id_check(invoiceSearch: any, month: any, year: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let json = {
      "month": month,
      "year": year,
      "premise_id": invoiceSearch.premise_id,
      "branch_id": invoiceSearch.branch_id,
    }
    this.invoiceSummary = Object.assign({}, json)
    const body = JSON.stringify(this.invoiceSummary)
    console.log("invoiceSearch", body)
    let invoiceSummarySearch = Sgmodelurl + 'sgserv/branchcertification_id_check'
    return this.http.post<any>(invoiceSummarySearch, body, { 'headers': headers })

  }

  //monthlyDraft - AutoPopulate
  monthlyDraftFetch(data: any, month: any, year: any, vendorID: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let json = {
      "month": month,
      "year": year,
      "premise_id": data.premise_id,
      "branch_id": data.branch_id,
      "vendor_id": vendorID
    }
    let fetchData = Object.assign({}, json)
    const body = JSON.stringify(fetchData)
    console.log("monthlyDraftFetch", body)
    let url = Sgmodelurl + 'sgserv/attendance_monthlydraft'
    return this.http.post<any>(url, body, { 'headers': headers })

  }



  // security guard payment invoice data Entry


  public InvoicedataEntry(invoiceJson: any, branchCertifate_Id: any, files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (files == undefined) {
      files = ''
    }
    let formData = new FormData();
    this.invoiceCreation = Object.assign({}, invoiceJson)
    formData.append("data", JSON.stringify(this.invoiceCreation));
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
    let invoice = Sgmodelurl + 'sgserv/invoicedata/' + branchCertifate_Id
    return this.http.post<any>(invoice, formData, { 'headers': headers })

  }


  //update -invoice
  public InvoicedataEntry_update(invoiceJson: any, branchCertifate_Id: any, files, emptyList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let deletedfile = {
      "delete_fileid": emptyList
    }
    if (files == undefined) {
      files = ''
    }
    let formData = new FormData();
    this.invoiceCreation = Object.assign({}, invoiceJson, deletedfile)
    formData.append("data", JSON.stringify(this.invoiceCreation));
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
    let invoice = Sgmodelurl + 'sgserv/invoicedata/' + branchCertifate_Id
    return this.http.post<any>(invoice, formData, { 'headers': headers })

  }


  //get Invoice data
  public getInvoiceData(branchCertifate_Id, singleId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/invoicedata/' + branchCertifate_Id + '?id=' + singleId, { 'headers': headers })
  }



  // move to checker button 
  public movetoCheckerInvoice(remarks, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.moveToApproverJson = Object.assign({}, remarks, json);
    return this.http.post<any>(Sgmodelurl + "sgserv/invoice_status", this.moveToApproverJson, { 'headers': headers })
  }

  // move to header button 
  public movetoHeaderInvoice(remarks, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.moveToApproverJson = Object.assign({}, remarks, json);
    return this.http.post<any>(Sgmodelurl + "sgserv/invoice_status", this.moveToApproverJson, { 'headers': headers })
  }



  // approver button 
  public approverInvoice(remarks, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.ApproverJson = Object.assign({}, remarks, json);
    return this.http.post<any>(Sgmodelurl + "sgserv/invoice_status", this.ApproverJson, { 'headers': headers })
  }


  // reject button 
  public rejectInvoice(remarks, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.rejectJson = Object.assign({}, remarks, json);
    return this.http.post<any>(Sgmodelurl + "sgserv/invoice_status", this.rejectJson, { 'headers': headers })
  }



  // review button 
  public reviewInvoice(remarks, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.reviewJson = Object.assign({}, remarks, json);
    return this.http.post<any>(Sgmodelurl + "sgserv/invoice_status", this.reviewJson, { 'headers': headers })
  }

  //delete invoice
  public getDeleteInvoice(invoice_Id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/invoice_delete/' + invoice_Id, { 'headers': headers })
  }
  // To ECF Push
  public ToECFPush(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let ECF = Object.assign({}, json);
    return this.http.post<any>(Sgmodelurl + "sgserv/ecf_push_from_sg", ECF, { 'headers': headers })
  }

  //branch summary
  public getSummaryDetails(val, pageNumber = 1,): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(Sgmodelurl + "sgserv/bc_summary?page=" + pageNumber + val, { 'headers': headers })

  }

  //branch search
  getbranchSearch(val) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/bc_summary' + val, { 'headers': headers })
  }


  //invoice summary
  public getInvoiceSummaryList(val, pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(Sgmodelurl + "sgserv/invoice_summary?page=" + pageNumber + val, { 'headers': headers })

  }

  //invoice search
  getInvoiceSearch(val) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/invoice_summary' + val, { 'headers': headers })
  }

  //invoice approval flow
  public invoiceapprovalFlow(invoiceGet_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/approvalqueue/' + invoiceGet_id + '?q_type=4', { 'headers': headers })
  }

  //Miniwages Screen post get 
  miwagescreate: any
  public minimuwageacreate(list, id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.miwagescreate = list;
    } else {
      let ids = {
        "id": id
      }
      this.miwagescreate = Object.assign({}, list, ids)
    }
    console.log("result data", this.miwagescreate)
    const body = JSON.stringify(this.miwagescreate)
    return this.http.post<any>(Sgmodelurl + "sgserv/minimumwages", body, { 'headers': headers })
  }

  public mininumwagesgetwages(state_id, shift_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + 'sgserv/minimumwages_state?state_id=' + state_id + '&shift_type=' + shift_id, { 'headers': headers })
  }

  public mininumwagesget(pagenumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pagenumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(Sgmodelurl + 'sgserv/minimumwages?page=' + pagenumber, { 'headers': headers })
  }

  //minimum wages summary 
  public minimumWages_summary(value, pagenumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/minimumwages?page=' + pagenumber + value, { 'headers': headers })
  }

  public getSystembillgen(list): Promise<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/system_generated_bill", list, { 'headers': headers }).toPromise()
  }
  public getSystemBill(list): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/system_generated_bill", list, { 'headers': headers })
  }

  getEmployeeListprimebranch(vendorid, premise_id, branch_id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + "sgserv/sg_employee_create?vendor_id=" + vendorid + "&premise_id=" + premise_id + "&branch_id=" + branch_id, { 'headers': headers })
  }

  public getvendorprimes(vendorid, primesid, branchid, pagenumber): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + "sgserv/vendormarkupmapping/" + vendorid + "?premise_id=" + primesid + "&branch_id=" + branchid + "&?page=" + pagenumber, { 'headers': headers })
  }

  getparticularpremise(vendorid, pagenumer) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + "sgserv/vendormarkupmapping/" + vendorid + "?page=" + pagenumer, { 'headers': headers })
  }

  // premises mapping summary screen
  getPM_summaryApi(vendorid, val, pageNumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + "sgserv/vendormarkupmapping/" + vendorid + "?page=" + pageNumber + val, { 'headers': headers })
  }

  public postmakerchekker(list): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/attendance_status", list, { 'headers': headers })
  }

  // invoice file view
  public fileDownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/sg_document/' + id + '?token=' + token, { responseType: 'blob' as 'json' })

  }


  //penalty Summary
  public getpenaltyList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(Sgmodelurl + "sgserv/penalty?page=" + pageNumber, { 'headers': headers })
  }

  //add penalty form
  addPenaltyForm(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.addPenalty = Object.assign({}, json)
    const body = JSON.stringify(this.addPenalty)
    console.log("addPenalty", body)
    let url = Sgmodelurl + 'sgserv/penalty'
    return this.http.post<any>(url, body, { 'headers': headers })

  }

  // attendance approval flow 

  public getattedanceHistory(attendanceGet_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/approvalqueue/' + attendanceGet_id + '?q_type=1', { 'headers': headers })
  }

  public postmakerchekkermim(list): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/minimumwages_status", list, { 'headers': headers })
  }

  public getminimuwagesHistory(attendanceGet_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/approvalqueue/' + attendanceGet_id + '?q_type=5', { 'headers': headers })
  }

  public postMonthlydraft(list): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/attendance_monthlydraft", list, { 'headers': headers })
  }

  public Attendance_status(list, vendorid): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/vendormarkup_status/" + vendorid, list, { 'headers': headers })
  }

  public vendormarkupDeactivate(vendordata): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/vendormarkup_action/1", vendordata, { 'headers': headers })
  }


  public getvendorHistory(attendanceGet_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/approvalqueue/' + attendanceGet_id + '?q_type=3', { 'headers': headers })
  }

  public getZoneDropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(Sgmodelurl + 'mstserv/zonetype', { 'headers': headers })

  }

  public monthlydraftdownload(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let Body = JSON.stringify(data);
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(Sgmodelurl + 'sgserv/pdf_monthlydraft', Body, { 'headers': headers, responseType: 'blob' as 'json' })

  }

  // holiday master search screen

  Searchholidayformdetails(pageNumber, url) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params = new HttpParams()
    return this.http.get<any>(Sgmodelurl + "sgserv/sg_holiday" + url, { 'headers': headers })

  }
  Viewholidayformdetails(holiday_id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params = new HttpParams()
    return this.http.get<any>(Sgmodelurl + "sgserv/sg_holiday/" + holiday_id, { 'headers': headers })

  }

  // Status minimumwages
  public holiday_status(list, holiday_id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/sg_holiday_status/" + holiday_id, list, { 'headers': headers })
  }

  public getholidayHistory(attendanceGet_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/approvalqueue/' + attendanceGet_id + '?q_type=6', { 'headers': headers })
  }


  public holidaysmampledownload(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(Sgmodelurl + 'sgserv/sample_holiday_excel', { 'headers': headers, responseType: 'blob' as 'json' })

  }
  public mininumwagesgetserach(pagenumber = 1, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.get<any>(Sgmodelurl + 'sgserv/minimumwages?page=' + pagenumber + '&state_id=' + val, { 'headers': headers })
  }

  //vendormarkup serach 
  public vendorSerachSummary(pagenumber = 1, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.get<any>(Sgmodelurl + 'sgserv/vendormarkup?page=' + pagenumber + '&vendor_id=' + val, { 'headers': headers })
  }

  public provision_summary(branchSearchId, value, pagenumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    if (branchSearchId) {
      return this.http.get<any>(Sgmodelurl + 'sgserv/provision_summary?page=' + pagenumber + '&branch_id=' + branchSearchId + value, { 'headers': headers })
    }
    else {
      return this.http.get<any>(Sgmodelurl + 'sgserv/provision_summary?page=' + pagenumber + value, { 'headers': headers })
    }
  }
  public employee_mothly_salary(pagenumber, list): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/employee_monthlysalary?page=" + pagenumber, list, { 'headers': headers })
  }
  public Minimuwages_edit(state_id, list): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(Sgmodelurl + "sgserv/minimumwages_state?state_id=" + state_id, list, { 'headers': headers })
  }



  //branch filter
  public getBranch(query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + "sgserv/branch_premise_search_restriction?branch=" + query, { 'headers': headers })
  }
  public getBranchLoadMore(query, pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = Sgmodelurl + 'sgserv/branch_premise_search_restriction?branch=' + query + "&page=" + pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  //premises filter
  public getpremises(premisesArray, query, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let data = {
      "id": premisesArray
    }
    let jsonValue = Object.assign({}, data)
    return this.http.post<any>(Sgmodelurl + "pdserv/premise_restriction_id?query=" + query + "&page=" + pageno, jsonValue, { 'headers': headers })
  }
  //Agency filter
  public getAgency(agencyArray, query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let data = {
      "arr": agencyArray
    }
    let jsonValue = Object.assign({}, data)
    return this.http.post<any>(Sgmodelurl + "sgserv/searchvendorname?query=" + query, jsonValue, { 'headers': headers })
  }


  //Approval branch 

  public getApprovalBranch(approvalbranchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'usrserv/search_branch?query=' + approvalbranchkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  //approval branch based employee
  public appBranchBasedEmployee(branchID, empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'usrserv/branchwise_employee_get/' + branchID + '?name=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }



  //premises Mapping - branch based Premises
  public MappingBranchBasedPremises(mapp_branchID, prekeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'pdserv/branchwise_premise/' + mapp_branchID + '?query=' + prekeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  //coverNote download 
  public coverNotedownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(Sgmodelurl + 'sgserv/pdf_sg_covernote/' + id, { 'headers': headers, responseType: 'blob' as 'json' })

  }
  //extra allowance
  public getExtraAllowance(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/get_extra_allowance', { 'headers': headers })
  }

  //  holiday update 
  public holiday_Update(updatelist): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let Json = Object.assign({}, updatelist);
    return this.http.post<any>(Sgmodelurl + "sgserv/sg_holiday_update", updatelist, { 'headers': headers })
  }


  // sg_rport
  public sg_report(data, branchSearchId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (branchSearchId) {
      return this.http.get<any>(Sgmodelurl + 'sgserv/download_sg_report?branch_id=' + branchSearchId + '&' + data, { 'headers': headers, responseType: 'blob' as 'json' })
    }
    else {
      return this.http.get<any>(Sgmodelurl + 'sgserv/download_sg_report?' + data, { 'headers': headers, responseType: 'blob' as 'json' })
    }
  }


  public updateApproverInAttendence(list): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/attendance_approver_update", list, { 'headers': headers })
  }


  public getattendacedetailsSGAdmin(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + "sgserv/attendance?premise_id=" + data.premise_id + "&month=" + data.month + "&year=" + data.year + "&branch_id=" + data.branch_id + "&vendor_id=" + data.vendor_id, { 'headers': headers })
  }

  public getBranchdetailsSGAdmin(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + "sgserv/bc_summary?premise_id=" + data.premise_id + "&month=" + data.month + "&year=" + data.year + "&branch_id=" + data.branch_id + "&is_admin=" + data.is_admin, { 'headers': headers })
  }

  public getinvoicedetailsSGAdmin(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + "sgserv/invoice_summary?premise_id=" + data.premise_id + "&month=" + data.month + "&year=" + data.year + "&branch_id=" + data.branch_id + "&is_admin=" + data.is_admin, { 'headers': headers })
  }

  public SGAdminDeactivate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/sg_deactivate_admin", data, { 'headers': headers })
  }

  public deactivateVendorMarkup(dataID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(Sgmodelurl + "sgserv/vendormarkup_action/2" , dataID, { 'headers': headers })
  }
  public sg_employee_delete(id,monthdate): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + "sgserv/sg_employee_delete?id=" +id+"&monthtodate="+monthdate, { 'headers': headers })
  }

  public getEmployeeFilterBasedOnBranch(empkeyvalue, branchId, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'usrserv/branchwise_employee_get/' + branchId + '?name=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getAllBranch(query, pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = Sgmodelurl + 'sgserv/branch_premise_search?branch=' + query + "&page=" + pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getguardcountBranch(query): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl + "usrserv/search_employeebranch?query=" + query, { 'headers': headers })
  }
  public getguardBranchLoadMore(query, pagenumber) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (query === null) {
      query = "";
      console.log('calling empty');
    }
    let urlvalue = Sgmodelurl + "usrserv/search_employeebranch?query=" + query + "&page=" + pagenumber;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
 
  public sgguardcountsummary(pageno,data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // if(data===''){
    //   data={}
    // }
   
    return this.http.post<any>(Sgmodelurl + 'sgserv/guardcount_report?page='+pageno,data, { 'headers': headers })
  }
  public sg_guardcount_report(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
 
      return this.http.post<any>(Sgmodelurl + 'sgserv/guardcount_report?action=download',data, { 'headers': headers, responseType: 'blob' as 'json' })
    
  }
  public sgagencyreportsummary(data,page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
 
      return this.http.post<any>(Sgmodelurl + 'sgserv/agency_report_download?action=summary&page='+page,data, { 'headers': headers })
    
  }
  public sg_agency_report(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
 
      return this.http.post<any>(Sgmodelurl + 'sgserv/agency_report_download?action=download',data, { 'headers': headers, responseType: 'blob' as 'json' })
    
  }
  public sgschedulersumaary(page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(Sgmodelurl +'sgserv/monthly_scheduler?page='+page, { 'headers': headers })
  }
  public sg_schedulaer_run(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
 
      return this.http.post<any>(Sgmodelurl + 'sgserv/provision_schedule_sg',data, { 'headers': headers, responseType: 'blob' as 'json' })
    
  }
  public getvendorFilter(page:any,data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(Sgmodelurl + 'venserv/suppliercode_gst_validation?page=' + page+ '&query='+ data,{ 'headers': headers })
  }
   public get_risk_categorization(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl + 'sgserv/get_risk_categorization', { 'headers': headers })
  }
  public Shift_details(page,name,code): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(Sgmodelurl +'sgserv/get_shift_details?page='+page+"&shift_name="+name+"&shift_code="+code, { 'headers': headers })
  }
}

// sgserv/attendance?premise_id=1951&month=4&year=2022&branch_id=1&vendor_id=388&page=1



