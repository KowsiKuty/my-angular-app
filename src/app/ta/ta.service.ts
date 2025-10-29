import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { User } from '../user'
import { environment } from 'src/environments/environment';
import { I } from '@angular/cdk/keycodes';
import { codeBlockButton } from 'ngx-summernote';

const url = environment.apiURL
const taURL = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class TaService {
  constructor(private http: HttpClient, private idle: Idle,) { }

  landlordbankADDEditJson: any
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public login(user: User): Observable<any> {
    this.reset();
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(user);
    // // console.log(body)
    // console.log(memoUrl);
    return this.http.post(taURL + 'usrserv/auth_token' + '', body, { 'headers': headers })
    // .subscribe(data => {
    //   if(data){
    //     this.Loginname=data.name;
    //   }
    // })
  }

  public createtourmakers(CreateList: any, files: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = ''
    }
    // if (onbehalfof == undefined) {
    //   onbehalfof = ''
    // }
    let tourjson = Object.assign({}, CreateList)
    let formData = new FormData();
    formData.append('data', JSON.stringify(tourjson));
    for (var i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    // formData.append('onbehalfof', onbehalfof);
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", formData)
    return this.http.post<any>(taURL + "taserv/tour", formData, { 'headers': headers })
  }
  public expenseAdd(CreateList: any, files: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = ''
    }
    let tourjson = Object.assign({}, CreateList)
    let formData = new FormData();
    formData.append('data', JSON.stringify(tourjson));
    for (var i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", formData)
    return this.http.post<any>(taURL + "taserv/expense/submit", formData, { 'headers': headers })
  }
  public edittourmakers(CreateList: any, files: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(CreateList)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, CreateList, value)
    if (files == undefined) {
      files = ''
    }
    let tourjson = Object.assign({}, CreateList)
    let formData = new FormData();
    formData.append('data', JSON.stringify(jsonValue));
    for (var i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", formData)
    return this.http.post<any>(taURL + "taserv/tour", formData, { 'headers': headers })
  }
  public createtourmaker(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", formData)
    return this.http.post<any>(taURL + "taserv/tour", body, { 'headers': headers })
  }

  public TourmakerEditForm(id, tourJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id
    }
    let jsonValue = Object.assign({}, idValue, tourJson)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/tour", jsonValue, { 'headers': headers })
  }

  // public getadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   // const getToken: any = sessionStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //   console.log(params);
  //   return this.http.get<any>(taURL + "taserv/touradvance", { 'headers': headers })
  // }

  public getadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/touradvance", { 'headers': headers })
  }

  //advance maker summary
  public getAdvanceMakerSummaryDetails(val,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/touradvance?page='+ pageNumber + val, { 'headers': headers })
    
  }

  public getViewadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "" + pageNumber, { 'headers': headers })
  }
  public getTourMakerSummary(val,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/tourdata?page='+ pageNumber + val, { 'headers': headers })
  }
  public getTourApprovesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=2", { 'headers': headers,params })
  }
  public getTourapprovetounoSummary(tourno,pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?tour_no=" + tourno , { 'headers': headers,params })
  }
  public getTourapproverequestdateSummary(date,pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?request_date=" + date , { 'headers': headers,params })
  }
  public getTourapprovetourrequestdateSummary(date,tour,pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + 'taserv/tourapprove/tour?request_date=' + date+ '&tour_no=' + tour, { 'headers': headers,params })
  }
  public getTourApprovedsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=3", { 'headers': headers,params })
  }
  public getTourPendingsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=2", { 'headers': headers,params })
  }
  public getTourRejectsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=4", { 'headers': headers,params })
  }
  public getTourReturnsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=5", { 'headers': headers,params })
  }
  public getTourForwardsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=6", { 'headers': headers,params })
  }
  public getTourmakerSummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(taURL + 'taserv/tourdata', { 'headers': headers, params})

  }
  public getTourmakertounoSummary(tourno,pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(taURL + 'taserv/tourdata?tour_no=' + tourno, { 'headers': headers,params})

  }
  public getTourmakerrequestdateSummary(date,pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(taURL + 'taserv/tourdata?request_date=' + date, { 'headers': headers,params})

  }
  public getTourmakertourrequestdateSummary(date,tour,pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(taURL + 'taserv/tourdata?request_date=' + date+ '&tour_no=' + tour, { 'headers': headers,params})

  }
  public getAdvancemakerSummary(val, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    
   
    return this.http.get<any>(taURL + 'taserv/advance_summary?page='+ pageNumber + val, { 'headers': headers, params})

  }

  public getAdvancemakerSummaryonbehalf(val, pageNumber,empid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    
   
    return this.http.get<any>(taURL + 'taserv/advance_summary?onbehalf='+empid+'&page='+ pageNumber +val, { 'headers': headers, params})

  }
  public getTourmakereditSummary(summ): Observable<any> {
    this.reset();
    if(summ === undefined){
      summ=""
    }
  const getToken = localStorage.getItem("sessionData")
  // const getToken: any = sessionStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(taURL + 'taserv/tourdata/' + summ, { 'headers': headers })
  // return this.http.get<any>(taURL +'taserv/tourdata/'+,{ 'headers': headers })

}
    // public getadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    //   this.reset();
    //   const getToken = localStorage.getItem("sessionData")
    //   // const getToken: any = sessionStorage.getItem('sessionData')
    //   let tokenValue = JSON.parse(getToken);
    //   let token = tokenValue.token
    //   const headers = { 'Authorization': 'Token ' + token }
    //   let params: any = new HttpParams();
    //   params = params.append('page', pageNumber.toString());
    //   params = params.append('pageSize', pageSize.toString());
    //   console.log(params);
    //   return this.http.get<any>(taURL + "taserv/touradvance", { 'headers': headers })
    // }
    public getadvancesummaryOnbehalf(val,pageNumber,empgid): Observable<any> {
      this.reset();
      if(empgid === undefined){
        empgid=0
      }
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(taURL + 'taserv/touradvance?onbehalf=' +empgid+'&page='+ pageNumber + val, { 'headers': headers,params })
      }
      
    // public getViewadvancesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    //   this.reset();
    //   const getToken: any = sessionStorage.getItem('sessionData')
    //   let tokenValue = JSON.parse(getToken);
    //   let token = tokenValue.token
    //   const headers = { 'Authorization': 'Token ' + token }
    //   let params: any = new HttpParams();
    //   params = params.append('page', pageNumber.toString());
    //   params = params.append('pageSize', pageSize.toString());
    //   console.log(params);
    //   return this.http.get<any>(taURL + ""+ pageNumber ,{ 'headers': headers })
    // }
    // public getTourApprovesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    //   this.reset();
    //   const getToken = localStorage.getItem("sessionData")
    //   let tokenValue = JSON.parse(getToken);
    //   let token = tokenValue.token
    //   const headers = { 'Authorization': 'Token ' + token }
    //   let params: any = new HttpParams();
    //   params = params.append('page', pageNumber.toString());
    //   params = params.append('pageSize', pageSize.toString());
    //   console.log(params);
    //   return this.http.get<any>(taURL + "taserv/tourapprove/tour" ,{ 'headers': headers })
    // }
   
    
    public setallowamount(CreateList): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      // const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const body = JSON.stringify(CreateList)
      const headers = { 'Authorization': 'Token ' + token }
      console.log("Body", body)
      return this.http.post<any>(taURL + "taserv/updateapprove", body, { 'headers': headers })
    }
    public getexpreasonValue(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/common_dropdown_get/misc_reason", { 'headers': headers })
    }
    public getshiftCenter(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/common_dropdown_get/conv_center", { 'headers': headers })
    }
    public getemployeedetails(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/emp_details_get?onbehalf="+id, { 'headers': headers })
    }
    public getemployeesdetails(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/emp_details_get", { 'headers': headers })
    }
    public getexpreasonValueshifting(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/common_dropdown_get/misc_res", { 'headers': headers })
    }
    public gettravelMode(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/common_dropdown_get/travel_travelmode", { 'headers': headers })
    }
    public getCenter(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/common_dropdown_get/lodging_center", { 'headers': headers })
    }
    public getroadtravelMode(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/common_dropdown_get/travel_Road", { 'headers': headers })
    }
    public gettraintravelMode(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/common_dropdown_get/travel_Train", { 'headers': headers })
    }
    public getairtravelMode(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/common_dropdown_get/travel_Air", { 'headers': headers })
    }
    public getseatravelMode(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/common_dropdown_get/travel_Sea", { 'headers': headers })
    }
    public getcityValue(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/allowance_get?expense=8&salarygrade=S3", { 'headers': headers })
    }
    public getreasonValue(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "taserv/tourreason", { 'headers': headers })
    }
    public getemployeeValue(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "usrserv/searchemployee", { 'headers': headers })
    }
    public getbranchValue(value:any='',page=1): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params={'query':value}
      return this.http.get<any>(taURL + "usrserv/search_employeebranch?page="+ page, { 'headers': headers,params })
    }
    public getbranch(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "usrserv/search_employeebranch", { 'headers': headers })
    }
    public setemployee(id: any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      // const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const body = id
      const headers = { 'Authorization': 'Token ' + token }
      console.log("Body", body)
      return this.http.get<any>(taURL + "taserv/onbehalf_emp_get/"+body, { 'headers': headers })
      }
    public setemployeeValue(value,branch,onbehalfid,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      // const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      if (onbehalfid){
        return this.http.get<any>(taURL + "taserv/branch_approver_get/advance/branch/"+ branch +'?onbehalfof='+onbehalfid+'&name='+value+'&page='+page, { 'headers': headers })
      }
      else{
      return this.http.get<any>(taURL + "taserv/branch_approver_get/advance/branch/"+ branch +'?name='+value+'&page='+page, { 'headers': headers })
      }
    }
      public setemployeeValues(value,branch,onbehalfid,tourid,page): Observable<any> {
        this.reset();
      const getToken = localStorage.getItem("sessionData")
      // const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      if (onbehalfid != 0){
        return this.http.get<any>(taURL + "taserv/branch_approver_get/expense/branch/"+ branch +'?onbehalfof='+onbehalfid+'&name='+value+'&page='+page, { 'headers': headers })
      }
      else{
      return this.http.get<any>(taURL + "taserv/branch_approver_get/expense/branch/"+ branch +'?name='+value+'&tourid='+tourid + '&page='+page, { 'headers': headers })
      }
        }
    public getbusinesssegmentValue(value,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "usrserv/searchbusinesssegment?query="+value+"&page="+page, { 'headers': headers })
    }
    public getcostcenterValue(value,id: any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + "usrserv/searchbs_cc?query="+value+'&bs_id='+id,{ 'headers': headers })
    }
    public approvetourmaker( approveJson,files): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      // let idValue = {
      // "id": id
      // }
      let formData = new FormData();
    formData.append('data', JSON.stringify(approveJson));
    if(files){
      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }
    
      let jsonValue = Object.assign({}, approveJson)
      console.log("statutoryJson", JSON.stringify(jsonValue))
      return this.http.post<any>(taURL + "taserv/tourapprove", formData, { 'headers': headers })
      }

         public approvetour_maker(approveJson, files,forward,move_to_other): Observable<any> {
    this.reset();
     if (forward.claim_status_id == 2 && forward.applevel == 1 &&  move_to_other == 'MOVE TO OTHER') {
     const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }
    let formData = new FormData();
    
    
     approveJson['forwaded_key'] = 1;
    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }
    let jsonValue = Object.assign({}, approveJson)
    
    console.log("statutoryJson", JSON.stringify(jsonValue))
    formData.append('data', JSON.stringify(approveJson));
    return this.http.post<any>(taURL + "taserv/tourapprove", formData, { 'headers': headers })
  }
  else{
const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = {
    // "id": id
    // }
    let formData = new FormData();
    formData.append('data', JSON.stringify(approveJson));
    if (files) {
      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
    }

    let jsonValue = Object.assign({}, approveJson)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/tourapprove", formData, { 'headers': headers })
  }
    
  }
      public rejecttourmaker( approveJson,files): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        // let idValue = {
        // "id": id
        // }
          let formData = new FormData();
       formData.append('data', JSON.stringify(approveJson));
       if(files){
          for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
         }
       }
        let jsonValue = Object.assign({}, approveJson)
        console.log("statutoryJson", JSON.stringify(jsonValue))
        return this.http.post<any>(taURL + "taserv/tourreject", formData, { 'headers': headers })
        }
      public returntourmaker( approveJson,files): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          // let idValue = {
          // "id": id
          // }
          let formData = new FormData();
          formData.append('data', JSON.stringify(approveJson));   
          if(files){
            for (var i = 0; i < files.length; i++) {
              formData.append('file', files[i]);
            }
          }
          let jsonValue = Object.assign({}, approveJson)
          console.log("statutoryJson", JSON.stringify(jsonValue))
          return this.http.post<any>(taURL + "taserv/tourreturn", formData, { 'headers': headers })
          }
        public advanceCancel(CreateList): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const body = JSON.stringify(CreateList)
          const headers = { 'Authorization': 'Token ' + token }
          console.log("Body", body)
          return this.http.post<any>(taURL + "taserv/tourcancel", body, { 'headers': headers })
          }
          public tourCancel(CreateList): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList)
            const headers = { 'Authorization': 'Token ' + token }
            console.log("Body", body)
            return this.http.post<any>(taURL + "taserv/tourcancel", body, { 'headers': headers })
            }
        public getexpenceSummary(pageNumber,val): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          let params: any = new HttpParams();
        
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.get<any>(taURL +"taserv/expense_summary?page="+ pageNumber + val,{ 'headers': headers,params })
          
        }
       
       
        public getadvanceEditview(id): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.get<any>(taURL +"taserv/approval_flow_get?type=all&tourid="+id ,{ 'headers': headers })
          
        }
        public getadvanceccbsEditview(id): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.get<any>(taURL +"taserv/ccbs_get?type=1&tour="+id,{ 'headers': headers })
          
        }

        public getccbsedit(id): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.delete<any>(taURL +"taserv/ccbs_get?id="+id,{ 'headers': headers })
          
        }
        
       
        
        public IncidentalCreate(CreateList): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const body = JSON.stringify(CreateList)
          const headers = { 'Authorization': 'Token ' + token }
          console.log("Body", body)
          return this.http.post<any>(taURL + "taserv/incidental", body, { 'headers': headers })
          }
          public approver_Incidental(CreateList,expenseid): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList)
            const headers = { 'Authorization': 'Token ' + token }
            console.log("Body", body)
            return this.http.post<any>(taURL + "taserv/expamount?tour_id=" + expenseid + "&expense_id=3", body, { 'headers': headers })
            }
        public LocalconveyanceCreate(CreateList): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const body = JSON.stringify(CreateList)
          const headers = { 'Authorization': 'Token ' + token }
          console.log("Body", body)
          return this.http.post<any>(taURL + "taserv/localconv", body, { 'headers': headers })
        }
      public miscellaneousCreate(CreateList): Observable<any> {
         this.reset();
         const getToken = localStorage.getItem("sessionData")
        // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const body = JSON.stringify(CreateList)
          const headers = { 'Authorization': 'Token ' + token }
          console.log("Body", body)
          return this.http.post<any>(taURL + "taserv/misc", body, { 'headers': headers })
          }    
          public localdeputationCreate(CreateList): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
           // const getToken: any = sessionStorage.getItem('sessionData')
             let tokenValue = JSON.parse(getToken);
             let token = tokenValue.token
             const body = JSON.stringify(CreateList)
             const headers = { 'Authorization': 'Token ' + token }
             console.log("Body", body)
             return this.http.post<any>(taURL + "taserv/localdeputation", body, { 'headers': headers })
             }  
             public localdeputationEdit(CreateList): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
             // const getToken: any = sessionStorage.getItem('sessionData')
               let tokenValue = JSON.parse(getToken);
               let token = tokenValue.token
               const body = JSON.stringify(CreateList)
               const headers = { 'Authorization': 'Token ' + token }
               console.log("Body", body)
               return this.http.post<any>(taURL + "taserv/localdeputation", body, { 'headers': headers })
               }  
             public miscellaneousEdit(CreateList): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
             // const getToken: any = sessionStorage.getItem('sessionData')
               let tokenValue = JSON.parse(getToken);
               let token = tokenValue.token
               const body = JSON.stringify(CreateList)
               const headers = { 'Authorization': 'Token ' + token }
               console.log("Body", body)
               return this.http.post<any>(taURL + "taserv/misc", body, { 'headers': headers })
               }  
               public TravelingEdit(CreateList): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
             // const getToken: any = sessionStorage.getItem('sessionData')
               let tokenValue = JSON.parse(getToken);
               let token = tokenValue.token
               const body = JSON.stringify(CreateList)
               const headers = { 'Authorization': 'Token ' + token }
               console.log("Body", body)
               return this.http.post<any>(taURL + "taserv/misc", body, { 'headers': headers })
               } 
               public LodgingEdit(CreateList): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
               // const getToken: any = sessionStorage.getItem('sessionData')
                 let tokenValue = JSON.parse(getToken);
                 let token = tokenValue.token
                 const body = JSON.stringify(CreateList)
                 const headers = { 'Authorization': 'Token ' + token }
                 console.log("Body", body)
                 return this.http.post<any>(taURL + "taserv/lodging", body, { 'headers': headers })
                 }  
             public getdeputeligibleAmount(CreateList): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
             // const getToken: any = sessionStorage.getItem('sessionData')
               let tokenValue = JSON.parse(getToken);
               let token = tokenValue.token
               const body = JSON.stringify(CreateList)
               const headers = { 'Authorization': 'Token ' + token }
               console.log("Body", body)
               return this.http.post<any>(taURL + "taserv/localdeputation/logic", body, { 'headers': headers })
               }      
               public getmisceligibleAmount(CreateList): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
               // const getToken: any = sessionStorage.getItem('sessionData')
                 let tokenValue = JSON.parse(getToken);
                 let token = tokenValue.token
                 const body = JSON.stringify(CreateList)
                 const headers = { 'Authorization': 'Token ' + token }
                 console.log("Body", body)
                 return this.http.post<any>(taURL + "taserv/misc/logic", body, { 'headers': headers })
                 } 
               public getlodgingeligibleAmount(CreateList): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
               // const getToken: any = sessionStorage.getItem('sessionData')
                 let tokenValue = JSON.parse(getToken);
                 let token = tokenValue.token
                 const body = JSON.stringify(CreateList)
                 const headers = { 'Authorization': 'Token ' + token }
                 console.log("Body", body)
                 return this.http.post<any>(taURL + "taserv/lodging/logic", body, { 'headers': headers })
                 }      
        public LodgingCreate(CreateList): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList)
            const headers = { 'Authorization': 'Token ' + token }
            console.log("Body", body)
            return this.http.post<any>(taURL + "taserv/lodging", body, { 'headers': headers })
          }          
          public TravelingCreate(CreateList): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList)
            const headers = { 'Authorization': 'Token ' + token }
            console.log("Body", body)
            return this.http.post<any>(taURL + "taserv/travel", body, { 'headers': headers })
          }       
          public packingCreate(CreateList): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList)
            const headers = { 'Authorization': 'Token ' + token }
            console.log("Body", body)
            return this.http.post<any>(taURL + "taserv/packingmvg", body, { 'headers': headers })
          }       
          public getclaimrequestsummary(id,key): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.get<any>(taURL +'taserv/claimreq/tour/'+id+'?key='+key,{ 'headers': headers })
            
          }  
          public getdailydiemeditSummary(id,report): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            if(report){
              return this.http.get<any>(taURL +'taserv/dailydeim/tour/'+id+'?report=1',{ 'headers': headers })
            }
            else{
            return this.http.get<any>(taURL +'taserv/dailydeim/tour/'+id,{ 'headers': headers })
            }
          } 
          public gettravelingeditSummary(id,report,key): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            if(report){
              return this.http.get<any>(taURL +'taserv/travel/tour/'+id+'?report=1',{ 'headers': headers })
            }
            else{
            return this.http.get<any>(taURL +'taserv/travel/tour/'+id+'?key='+key,{ 'headers': headers })
            }
          } 
          public getmisceditSummary(id,report): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            if(report){
              return this.http.get<any>(taURL +'taserv/misc/tour/'+id+'?report=0',{ 'headers': headers })            }
            else{
              return this.http.get<any>(taURL +'taserv/misc/tour/'+id,{ 'headers': headers })
            }
            
            
          }  
          public expensedeleteSummary(id,type): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.delete<any>(taURL +'taserv/expense_delete/'+id+'/tour/'+type,{ 'headers': headers })
            
          } 
          public deletemiscdeleteSummary(id): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.delete<any>(taURL +'taserv/misc/tour/'+id,{ 'headers': headers })
            
          }  
          public deletetraveldeleteSummary(id): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.delete<any>(taURL +'taserv/travel/tour/'+id,{ 'headers': headers })
            
          }  
          public deletelodgingdeleteSummary(id): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.delete<any>(taURL +'taserv/lodging/tour/'+id,{ 'headers': headers })
            
          } 
          public deletedeptdeleteSummary(id): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.delete<any>(taURL +'taserv/localdeputation/tour/'+id,{ 'headers': headers })
            
          }
          public getdeputeditSummary(id,report): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            if(report){
              return this.http.get<any>(taURL +'taserv/localdeputation/tour/'+id+'?report=1',{ 'headers': headers })
            }
            else{
            return this.http.get<any>(taURL +'taserv/localdeputation/tour/'+id,{ 'headers': headers })
            }
          }  
          public getpackingeditSummary(id,report,key): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            if(report){
              return this.http.get<any>(taURL +'taserv/packingmvg/tour/'+id+'?report=1',{ 'headers': headers })
            }
            else{
            return this.http.get<any>(taURL +'taserv/packingmvg/tour/'+id +'?key='+key,{ 'headers': headers })
            } 
          }  
          public getlocaleditSummary(id,report): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            if(report){
              return this.http.get<any>(taURL +'taserv/localconv/tour/'+id+'?report=1',{ 'headers': headers })
            }
            else{
            return this.http.get<any>(taURL +'taserv/localconv/tour/'+id,{ 'headers': headers })
            }
          }  
          public getlodgeeditSummary(id,report,key): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            if(report){
              return this.http.get<any>(taURL +'taserv/lodging/tour/'+id+'?report=1',{ 'headers': headers })
            }
            else{
            return this.http.get<any>(taURL +'taserv/lodging/tour/'+id+'?key='+key,{ 'headers': headers })
            }
          } 
          public getincidentaleditSummary(id,report): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            if(report){
              return this.http.get<any>(taURL +'taserv/incidental/tour/'+id+'?report=1',{ 'headers': headers })
            }
            else{
            return this.http.get<any>(taURL +'taserv/incidental/tour/'+id,{ 'headers': headers })
            }
          }      
          public getCancelapproveSummary(statusId,pageNumber,val): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
            return this.http.get<any>(taURL +"taserv/tourapprove/TourCancel?status=" + statusId +"&page="+ pageNumber + val,{ 'headers': headers })
            
          } 
          public getCancelapproveadvanceSummary(statusId,pageNumber,val): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
            return this.http.get<any>(taURL +"taserv/tourapprove/AdvanceCancel?status=" + statusId +"&page="+ pageNumber + val,{ 'headers': headers })
            
          } 
          public getCancelMakeronbehalfSummary(val,pageNumber,empgid): Observable<any> {
            this.reset();
            if(empgid === undefined){
              empgid=0
            }
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
            console.log(params);
            return this.http.get<any>(taURL +"taserv/cancelled_data?type=TourCancel&page="+ pageNumber + "&onbehalf=" +empgid+val,{ 'headers': headers })
            
          } 
          public getCancelMakerSummary(val,pageNumber): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
            console.log(params);
            return this.http.get<any>(taURL +"taserv/cancelled_data?type=TourCancel&page="+ pageNumber + val,{ 'headers': headers })
            
          }   
          public getCancelApproverSummary(pageNumber = 1, pageSize = 10): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.get<any>(taURL +"",{ 'headers': headers })
            
          }  
          public getCancelAddMakerSummary(val,pageNumber): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
            
            console.log(params);
            return this.http.get<any>(taURL +"taserv/approved_data?type=tour&page="+ pageNumber + val,{ 'headers': headers })
            
          }
          public getCancelAddMakeronbehalfSummary(val,pageNumber,empgid): Observable<any> {
            this.reset();
            if(empgid === undefined){
              empgid=0
            }
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
            
            console.log(params);
            return this.http.get<any>(taURL +"taserv/approved_data?type=tour&page="+ pageNumber + "&onbehalf=" +empgid+val,{ 'headers': headers })
            
          }
          public getCancelAddMakeradvanceSummary(val,pageNumber): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
          
            console.log(params);
            return this.http.get<any>(taURL +"taserv/approved_data?type=advance&page="+ pageNumber + val,{ 'headers': headers })
            
          } 
          public getCancelAddMakeradvanceonbehalfSummary(val,pageNumber,empgid): Observable<any> {
            this.reset();
            if(empgid === undefined){
              empgid=0
            }
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
          
            console.log(params);
            return this.http.get<any>(taURL +"taserv/approved_data?type=advance&page="+ pageNumber + "&onbehalf=" +empgid+val,{ 'headers': headers })
            
          } 
          
          public getAssignSummary(pageNumber,val): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.get<any>(taURL +"taserv/approverlist?page="+pageNumber+val,{ 'headers': headers })
            
          } 
          public getonBehalfSummary(pageNumber = 1, pageSize = 10): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.get<any>(taURL +"",{ 'headers': headers })
            
          } 
          public getCancelMakeradvanceonbehalfSummary(val,pageNumber,empgid): Observable<any> {
            this.reset();
            if(empgid === undefined){
              empgid=0
            }
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
            console.log(params);
            return this.http.get<any>(taURL +"taserv/cancelled_data?type=AdvanceCancel&page="+ pageNumber + "&onbehalf=" +empgid+val,{ 'headers': headers })
            
          } 
          public getCancelMakeradvanceSummary(val,pageNumber): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
            console.log(params);
            return this.http.get<any>(taURL +"taserv/cancelled_data?type=AdvanceCancel&page="+ pageNumber + val,{ 'headers': headers })
            
          } 
          public getonBehalfpopup(pageNumber = 1, pageSize = 10): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.get<any>(taURL +"",{ 'headers': headers })
            
          } 

   
  public getadvanceEditsummary(summ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/touradvance/' + summ, { 'headers': headers })
  }
  public getapproveSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/tourdata/1', { 'headers': headers })

  }
 
 

  // public approvetourmaker(approveJson): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let jsonValue = Object.assign({}, approveJson)
  //   console.log("statutoryJson", JSON.stringify(jsonValue))
  //   return this.http.post<any>(taURL + "taserv/tourapprove", jsonValue, { 'headers': headers })
  
  // }
  // public rejecttourmaker(rejectJson): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let jsonValue = Object.assign({}, rejectJson)
  //   console.log("statutoryJson", JSON.stringify(jsonValue))
  //   return this.http.post<any>(taURL + "taserv/tourreject", jsonValue, { 'headers': headers })
  
  // }
  // public returntourmaker(returnJson): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let jsonValue = Object.assign({}, returnJson)
  //   console.log("statutoryJson", JSON.stringify(jsonValue))
  //   return this.http.post<any>(taURL + "taserv/tourreturn", jsonValue, { 'headers': headers })
  
  // }
  public forwardtourmaker(returnJson,files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
          formData.append('data', JSON.stringify(returnJson));   
          if(files){
            for (var i = 0; i < files.length; i++) {
              formData.append('file', files[i]);
            }
          }

    let jsonValue = Object.assign({}, returnJson)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    return this.http.post<any>(taURL + "taserv/tourforward", formData, { 'headers': headers })
  
  }
  public advanceCreate(CreateList,files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = CreateList; 
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
          formData.append('data', JSON.stringify(CreateList));   
          if(files){
            for (var i = 0; i < files.length; i++) {
              formData.append('file', files[i]);
            }
          }

    let jsonValue = Object.assign({}, CreateList)
    console.log("statutoryJson", JSON.stringify(jsonValue))
    console.log("Body", CreateList.ccbs)
    
    return this.http.post<any>(taURL + "taserv/touradvance", formData, { 'headers': headers })
  }
  public getexpenseReturnsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/claim?status=5", { 'headers': headers })

  }
  public getadvanceReturnsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/advance?status=5", { 'headers': headers })

  }
  public getadvanceRejectsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/advance?status=4", { 'headers': headers })

  }
  public getexpenseRejectsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/claim?status=4", { 'headers': headers })

  }
  public getexpensePendingsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/claim?status=2", { 'headers': headers })

  }
  public getadvancePendingsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/advance?status=2", { 'headers': headers })

  }
  public getexpenseApprovedsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/claim?status=3", { 'headers': headers })

  }
  public getadvanceApprovedsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/advance?status=3", { 'headers': headers })

  }
  public getapprovexpenceSummary(statusId,pageNumber,val,page_size: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/claim?status=" + statusId +"&page="+ pageNumber + val+"&page_size="+page_size, { 'headers': headers })
  }
  public getadvanceview(statusId,pageNumber,val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/advance?status=" + statusId +"&page="+ pageNumber + val, { 'headers': headers })

  }
  public expenseCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/dailydeim", body, { 'headers': headers })
  }
  public getexpenseTypeValue(tour_id = ''): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/expenselist?tour_id="+tour_id, { 'headers': headers })
  }
  public DailydiemCreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/dailydeim", body, { 'headers': headers })
  }
  
  public getHolidaydiemSummary(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/holidaydeim?page=' +page, { 'headers': headers })

  }
  public deleteholidaydiem(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/holidaydeim/" + id, { 'headers': headers })
  }
  public createholidaydiem(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/holidaydeim", body, { 'headers': headers })
  }
  
  public getGradeEligibleSummary(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/grade?page=' +page, { 'headers': headers })

  }
  public deletegradeeligible(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/grade/" + id, { 'headers': headers })
  }
  public creategradeeligible(GradeList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(GradeList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/grade", body, { 'headers': headers })
  }
 
  public getCommondropdownSummary(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown?page='+page, { 'headers': headers })

  }
  public deletecommondropdown(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/common_dropdown/" + id, { 'headers': headers })
  }
  public createCommondropdown(DropdownList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(DropdownList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/common_dropdown", body, { 'headers': headers })
  }
  public getCommondropdownselectedSummary(id: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown/detail/' + id, { 'headers': headers })

  }
  public getCommondropdowndetailSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_details', { 'headers': headers })

  }
  public deletecommondropdowndetail(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + "taserv/common_dropdown_details/" + id, { 'headers': headers })
  }
  public createCommondropdowndetail(DropdowndetailList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(DropdowndetailList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/common_dropdown_details", body, { 'headers': headers })
  }
 
  public getUsageCode(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = ""; 

    }
    let urlvalue = taURL + 'usrserv/search_employeebranch?query=' + empkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getGstCode(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = taURL + 'taserv/bank_gst_get?gst=' + empkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getusageSearchFilter(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'usrserv/search_employeebranch?query=' + empkeyvalue, { 'headers': headers })

  }
  public getgstSearchFilter(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/bank_gst_get?gst=' + empkeyvalue, { 'headers': headers })

  }
  public getemployeeSummary(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/onbehalf_emp_get/' + id, { 'headers': headers })

  }
  public getonbehalfSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/onbehalf_emp_get', { 'headers': headers })

  }
  public getbranchSummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'usrserv/employeebranch', { 'headers': headers })

  }

  public getbranchValues(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "usrserv/search_employeebranch?query=central&pageno=48", { 'headers': headers })
  }
 
 
  public getTourmakeronbehalfSummary(pageNumber=1,pageSize=10,empgid): Observable<any> {
    this.reset();
    if(empgid === undefined){
      empgid=0
    }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(taURL + 'taserv/tourdata?onbehalf=' +empgid, { 'headers': headers,params })

  }
  public getexpenceSummarylist(val,pageNumber,empgid): Observable<any> {
    this.reset();
    if(empgid === undefined){
      empgid=0
    }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(taURL + 'taserv/expense_summary?onbehalf=' +empgid+'&page='+ pageNumber +val, { 'headers': headers,params })

  }
  public getempbasedreport(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token' + token }
    return this.http.get<any>(taURL + 'taserv/report_tour_summary/7995', { 'headers': headers })

  }
  public gettournobasedreport(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token' + token }
    return this.http.get<any>(taURL + 'taserv/report_tour_detail/1', { 'headers': headers })
  }

  public getemployeevalue(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'usrserv/branch_employee_get/' + id, { 'headers': headers })
  }
  public getemployeeval(id: number,empval:any='',page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params={'name':empval}
    return this.http.get<any>(taURL + 'usrserv/branchwise_employee_get/' +id + '?page=' + page, { 'headers': headers, params })
    
  }
  public gettoursearch(page,tourno, empid,grade, branch_id,from,to): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params={'form_date':from,'to_date':to}

    // if (tourno == "") {
    //   return this.http.get<any>(taURL + 'taserv/report_tour_summary?empid=' + empid, { 'headers': headers })
    // }
    // else if (empid == "") {
    //   return this.http.get<any>(taURL + 'taserv/report_tour_summary?tourno=' + tourno, { 'headers': headers })
    // }
    // else {
      return this.http.get<any>(taURL + 'taserv/report_tour_summary?tourno=' + tourno + '&empid=' + empid +'&grade='+ grade + '&branchid='+branch_id + '&page='+page ,{ 'headers': headers,params})    // }

  }

    public gettoursearchnew(page,tourno, empid,grade, branch_id,from,to,month): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params={'form_date':from,'to_date':to}

    // if (tourno == "") {
    //   return this.http.get<any>(taURL + 'taserv/report_tour_summary?empid=' + empid, { 'headers': headers })
    // }
    // else if (empid == "") {
    //   return this.http.get<any>(taURL + 'taserv/report_tour_summary?tourno=' + tourno, { 'headers': headers })
    // }
    // else {
      return this.http.get<any>(taURL + 'taserv/report_tour_summary?tourno=' + tourno + '&empid=' + empid +'&grade='+ grade + '&branchid='+branch_id + '&month=' + month + '&page='+page ,{ 'headers': headers,params})    // }

  }
  public getgstreport(page,tourno, branch, empid,fromdate,todate): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params={'from_date':fromdate,'to_date':todate}
   return this.http.get<any>(taURL + 'taserv/gst_report?tour_id=' + tourno + '&emp_id=' + empid + '&branch_id='+branch +'&page='+page ,{ 'headers': headers,params})
  }
  public getemptourreport(page,tour_no: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_tourid_summary?tour_id=' +tour_no + '&page=' +page,  { 'headers': headers })

  }
  public getconsolidatereport(page,tourno: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/consolidate_report?tour_no=' + tourno + '&page=' + page, { 'headers': headers })
  }
  public gettouriddownload(id,branch,empid,grade,from,to): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params={'from_date':from,'to_date':to}
    return this.http.get<any>(taURL + 'taserv/report_download_tour_summary?tourno='+id +'&empbranch='+ branch + '&empid='+ empid+'&grade='+ grade + '&all_report=1', { headers, responseType: 'blob' as 'json',params })  }
  public getprovisiondownload(id,empid,from,to): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params={'from_date':from,'to_date':to}
    return this.http.get<any>(taURL + 'taserv/report_download_provision_summary?tourno='+id +'&all_report=1', { headers, responseType: 'blob' as 'json',params })
  }
    public getprovisiondownloadnew(id,empid,from,to,month): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params={'from_date':from,'to_date':to, 'month': month}
    return this.http.get<any>(taURL + 'taserv/report_download_provision_summary?tourno='+id +'&all_report=1', { headers,params })
  }

  public getprovisionreportdownload(){
     this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.get<any>(taURL + 'taserv/provision_report_excel_download', { headers, responseType: 'blob' as 'json'})
  }
  public getgstdownload(tourno,branch,empid,from,to): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params={'branch':branch,'empid':empid,'from_date':from,'to_date':to}
    return this.http.get<any>(taURL + 'taserv/gst_report?tourno='+tourno +'&all_report=1', { headers, responseType: 'blob' as 'json' ,params})
  }

  public gettourdetailreport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_tour_detail/' + id, { 'headers': headers })
  }

  public gettourexpensereport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/claimreq/tour/' + id, { 'headers': headers })
  }
  public gettouradvancereport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/touradvance/' + id, { 'headers': headers })
  }
  public gettourdetaildownload(id: number) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_download_tour_detail/' + id, { headers, responseType: 'blob' as 'json'  })


  }
  public gettourexpensedownload(id: number) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_download_tour_expense/' + id, { headers, responseType: 'blob' as 'json'  })


  }
  public getempreportdownload(id: number) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/report_download_tourid?tour_id=' + id, { headers, responseType: 'blob' as 'json'  })
  }
  public getreasonValues(id,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === null) {
      id = "";

    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/tourreason?name=' + id +'&page='+page, { 'headers': headers })
  }
  public getbranchemployee(value,branch,onbehalfof,page): Observable<any> {
    this.reset();
   
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(onbehalfof){
      return this.http.get<any>(taURL + 'taserv/branch_approver_get/tour/branch/' + branch +'?name='+value+'&onbehalfof='+onbehalfof +'&page='+page, { 'headers': headers })
    
    }
   else{
    return this.http.get<any>(taURL + 'taserv/branch_approver_get/tour/branch/' + branch +'?name='+value +'&page='+page, { 'headers': headers })
  }
}
  public getonbehalfemployee(value,branch,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(taURL + 'taserv/onbehalf_emp_get/' + branch, { 'headers': headers })
    return this.http.get<any>(taURL + 'taserv/onbehalf_emp_get/' + branch +'?query='+value+'&page='+page, { 'headers': headers })
  }
  public getemployeevaluepermit(maker,id,value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === null) {
      id = "";

    }
    if(maker==undefined){
      maker=''
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/branch_employee_get/'+value+'?maker='+maker+ '?name=' + id, { 'headers': headers })
  }
  public gethsncode(value,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'mstserv/search_hsn?query='+value+'&page='+pageno, { 'headers': headers })
  }
  public getgstcode(value,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'usrserv/bank_gst_get?gst='+value+'&page='+pageno, { 'headers': headers })
  }
  public getdaterelaxation(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/date_relaxation', { 'headers': headers })
  }
  public getactivedate(id, tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let activeValue = [{
      "id": id,
      "status": 0,
      "tour_id": tourid
    }]

    return this.http.post<any>(taURL + "taserv/date_relaxation", activeValue, { 'headers': headers })

  }
  public date_all_files(tour_id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/fetch_documents/'+tour_id + '?type=1', { headers })
  }
  public date_relaxation_file_upload(data, files): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let formData = new FormData();
          formData.append('data', JSON.stringify(data));   
          if(files){
            for (var i = 0; i < files.length; i++) {
              formData.append('file', files[i]);
            }
          }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + 'taserv/date_relaxation_file_upload', formData, { headers })
  }
  public getinactivedate(id, tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let activeValue = [{
      "id": id,
      "status": 1,
      "tour_id": tourid
    }]

    return this.http.post<any>(taURL + "taserv/date_relaxation", activeValue, { 'headers': headers })

  }
  public getpermitlist(maker,onbehalfof): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if(maker==undefined){
      maker=''
    }
    if(onbehalfof==undefined){
      onbehalfof=''
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'usrserv/branchwise_employee_get/0?maker='+maker+'&onbehalfof='+onbehalfof, { 'headers': headers })
  }
  public getpermittedlist(maker,empkeyvalue, pageno,onbehalfof): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    if(maker==undefined){
      maker=''
    }
    if(onbehalfof==undefined){
      onbehalfof=''
    }
    let urlvalue = taURL + 'usrserv/branchwise_employee_get/0?maker='+maker+'&name=' + empkeyvalue + '&page=' + pageno+'&onbehalfof='+onbehalfof;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbranchwisereport(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let empid = tokenValue.employee_id
    const headers = { 'Authorization': 'Token ' + token }
    if (data === 1) {
      return this.http.get<any>(taURL + 'taserv/branchwise_pending/' + empid, { 'headers': headers })
    } else {
      return this.http.get<any>(taURL + 'taserv/branchwise_pending/0', { 'headers': headers })

    }
  }
  public getfetchimages(id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/fetch_documents/'+id, { headers })

  }
  public fileDelete(id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(taURL + 'taserv/fetch_documents/'+id, { headers })

  }
  public getfetchimages1(id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/download_documents/'+id, { headers })

  }

  public getadvpdf(invoiceid) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/pdf_download/'+invoiceid,{ 'headers': headers, responseType: 'blob' as 'json' })
    
  }

  public getfetchimagesss(url) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    window.open(url)
    return this.http.get<any>(url)
  }

  public getviewpdfimages(url): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(taURL + 'taserv/fetch_documents/'+id, { headers, responseType: 'blob' as 'json'  })
    return this.http.get<any>(url)
  }

  public getapproveflowalllist(id,key): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=all&tourid='+id +'&key='+key, { 'headers': headers })
  }
  public getcancelflowlist(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=TourCancel&tourid='+id, { 'headers': headers })
  }
  public getadvancecancelflowlist(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=AdvanceCancel&tourid='+id, { 'headers': headers })
  }
  public getapproveflowexpenselist(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=all&tourid='+id, { 'headers': headers })
  }
  public getapproveflowlist(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=all&tourid='+id, { 'headers': headers })
  }
  public getcitylist(value,expname,salarygrade,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/allowance?city='+value+'&employeegrade='+salarygrade+
      '&expensename='+expname+'&page='+pageno, {'headers': headers })
  }

  public getincidentaltravelmode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/incidental_travelmode', { 'headers': headers })
  }
  public getstatus(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/status', { 'headers': headers })
  }
  public getyesno(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/yn', { 'headers': headers })
  }
  public getdepend(onbehalf): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (onbehalf != 0){
      return this.http.get<any>(taURL + 'taserv/dependencies_get?onbehalf='+onbehalf, { 'headers': headers })
    }
    else{
      return this.http.get<any>(taURL + 'taserv/dependencies_get', { 'headers': headers })
    }
    
  }
  public Incidentaleligibleamt(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/incidental/logic", body, { 'headers': headers })
    }


    public advanceapproveamt(CreateList): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      // const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const body = JSON.stringify(CreateList)
      const headers = { 'Authorization': 'Token ' + token }
      console.log("Body", body)
      return this.http.post<any>(taURL + "taserv/updateapprove", body, { 'headers': headers })
      }


    public getloc_convtravelmode(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + 'taserv/common_dropdown_get/conv_travelmode', { 'headers': headers })
    }
    public getctcloc_convtravelmode(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + 'taserv/common_dropdown_get/conv_travelctcmode', { 'headers': headers })
    }
    public getloc_convtrain(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + 'taserv/common_dropdown_get/conv_train', { 'headers': headers })
    }
    public getloc_convroad(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + 'taserv/common_dropdown_get/conv_road', { 'headers': headers })
    }

    public getloc_convcenter(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + 'taserv/common_dropdown_get/conv_center', { 'headers': headers })
    }
    public getloc_convonward(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + 'taserv/common_dropdown_get/conv_onward', { 'headers': headers })
    }
    public localconveligibleamt(CreateList): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const body = JSON.stringify(CreateList)
      const headers = { 'Authorization': 'Token ' + token }
      console.log("Body", body)
      return this.http.post<any>(taURL + "taserv/localconv/logic", body, { 'headers': headers })
      }
      public dailydeimligibleamt(CreateList): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const body = JSON.stringify(CreateList)
        const headers = { 'Authorization': 'Token ' + token }
        console.log("Body", body)
        return this.http.post<any>(taURL + "taserv/dailydeim/logic", body, { 'headers': headers })
        }
        public packingeligibleamt(CreateList): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const body = JSON.stringify(CreateList)
          const headers = { 'Authorization': 'Token ' + token }
          console.log("Body", body)
          return this.http.post<any>(taURL + "taserv/packingmvg/logic", body, { 'headers': headers })
          }
          public getpacking_twowheeler(): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.get<any>(taURL + 'taserv/common_dropdown_get/packing_twowheeler', { 'headers': headers })
          }
          public LocalconveyanceEdit(CreateList): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList)
            const headers = { 'Authorization': 'Token ' + token }
            console.log("Body", body)
            return this.http.post<any>(taURL + "taserv/localconv", body, { 'headers': headers })
          }
          public deletelocal(id): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.delete<any>(taURL +'taserv/localconv/tour/'+id,{ 'headers': headers })
            
          }
          public IncidentalEdit(CreateList): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            // const getToken: any = sessionStorage.getItem('sessionData')
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList)
            const headers = { 'Authorization': 'Token ' + token }
            console.log("Body", body)
            return this.http.post<any>(taURL + "taserv/incidental", body, { 'headers': headers })
            }
            public deleteincidental(id): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
              // const getToken: any = sessionStorage.getItem('sessionData')
              let tokenValue = JSON.parse(getToken);
              let token = tokenValue.token
              const headers = { 'Authorization': 'Token ' + token }
              return this.http.delete<any>(taURL +'taserv/incidental/tour/'+id,{ 'headers': headers })
              
            }

            public DailydiemEdit(CreateList): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
              // const getToken: any = sessionStorage.getItem('sessionData')
              let tokenValue = JSON.parse(getToken);
              let token = tokenValue.token
              const body = JSON.stringify(CreateList)
              const headers = { 'Authorization': 'Token ' + token }
              console.log("Body", body)
              return this.http.post<any>(taURL + "taserv/dailydeim", body, { 'headers': headers })
            }
            public deletedailydeim(id): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
              // const getToken: any = sessionStorage.getItem('sessionData')
              let tokenValue = JSON.parse(getToken);
              let token = tokenValue.token
              const headers = { 'Authorization': 'Token ' + token }
              return this.http.delete<any>(taURL +'taserv/dailydeim/tour/'+id,{ 'headers': headers })
              
            }
            public deletepacking(id): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
              // const getToken: any = sessionStorage.getItem('sessionData')
              let tokenValue = JSON.parse(getToken);
              let token = tokenValue.token
              const headers = { 'Authorization': 'Token ' + token }
              return this.http.delete<any>(taURL +'taserv/packingmvg/tour/'+id,{ 'headers': headers })
              
            }
            public getmaxtonnage(id): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
              // const getToken: any = sessionStorage.getItem('sessionData')
              let tokenValue = JSON.parse(getToken);
              let token = tokenValue.token
              const headers = { 'Authorization': 'Token ' + token }
              return this.http.get<any>(taURL +"taserv/tourno_grade_get/"+id,{ 'headers': headers })
              
            }
  //advance maker summary
  public getTourApprovalSummary(statusId,pageNumber,val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourapprove/tour?status=" + statusId +"&page="+ pageNumber + val, { 'headers': headers })
    
  }
  //Onbehalf
  public getonbehalf(empid, approval,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/onbehalfof?branch_id='+empid+ '&employee_id=' + approval+'&page=' + page, { 'headers': headers })
  }

  public getonbehalfemployeeget(branch  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(taURL + "usrserv/branchwise_employee_get/"+branch  , { 'headers': headers })
  }

  public getonbehalfemployeepage(branch,page  ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(taURL + "usrserv/branchwise_employee_get/"+branch+'?page='+page  , { 'headers': headers })
  }

  public getemployeevaluechanges(branch,values,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(taURL + "usrserv/branchwise_employee_get/"+branch+"?name="+values +'&page='+page, { 'headers': headers })
  }


  public getemplvalue(branch,empkeyvalue,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(taURL + 'taserv/search_employee?branch='+branch +'&query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
    return this.http.get<any>(taURL + 'usrserv/branchwise_employee_get/'+branch+'?name='+empkeyvalue+'&maker=14&page='+pageno, { 'headers': headers } )  
  }

  public getbranchname(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "usrserv/search_employeebranch?query", { 'headers': headers })

}
  public getemployeedetail(empkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";
    }
  let urlvalue = taURL + 'taserv/search_employee?query=' + empkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}

public getonbehalfstatusupdate(statusdata): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
return this.http.post<any>(taURL + "taserv/onbehalfof",statusdata, { 'headers': headers })
}

public getonbehalftablestatusupdate(data): Observable<any>{
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
return this.http.post<any>(taURL + "taserv/onbehalfof_status_update",data, { 'headers': headers })
}

public getemployeeonbehalf(branch,empid,page,maker): Observable<any>{
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
return this.http.get<any>(taURL + "taserv/branch_onbehalf_status/"+branch+"/emp/"+empid+'?page='+page+'&maker='+maker, { 'headers': headers })
}







//Date relaxation

public getdaterelaxationdata(page): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(taURL + 'taserv/date_relaxation?page='+ page, { 'headers': headers })
}

public getbranchValuedata( params:any,page ): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  // const id=tourid
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(taURL + "taserv/date_relaxation?" +'page='+page, { 'headers': headers, params })
}

//Claim Allowance

public getexpensetypesearch(name,salarygrade,place,page): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token

  let grade=salarygrade
  if(name==null){
    name=''
  }
  if(grade==null){
    grade=''
  }
  let city=place
  if(city==null){
    city=''
  }

  const headers = { 'Authorization': 'Token ' + token }
return this.http.get<any>(taURL + "taserv/allowance?expensename="+name +"&employeegrade="+grade+"&city="+city+'&page='+page , { 'headers': headers })
}

public getdataallowance(page ): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(taURL + 'taserv/allowance?page='+page, { 'headers': headers })
}

public getallowanceupdate(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(taURL + 'taserv/allowance',id, { 'headers': headers })
}

public getallowancechange(id): Observable<any> {
  this.reset(); 
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(taURL + 'taserv/allowance',id, { 'headers': headers })
}
//expense edit

public getbranchvalues(page): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(taURL + "usrserv/search_employeebranch?page="+page, { 'headers': headers })
}


public getclaimccbsEditview(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  // const getToken: any = sessionStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(taURL +"taserv/ccbs_get?type=2&tour="+id,{ 'headers': headers })
  
}

public claimcomment(CreateList): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  // const getToken: any = sessionStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(CreateList)
  const headers = { 'Authorization': 'Token ' + token }
  console.log("Body", body)
  return this.http.post<any>(taURL + "taserv/change_maker_comment", body, { 'headers': headers })
  }

  public claimapproveupdate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/change_approver", body, { 'headers': headers })
    }
    public claimccbsupdate(tourid): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      // const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(taURL + "taserv/app_amt_ccbs_update/"+tourid,{}, { 'headers': headers })
      }
     


//localconveyance

public approver_amountupdate(tourno,id,CreateList): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  // const getToken: any = sessionStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(CreateList)
  const headers = { 'Authorization': 'Token ' + token }
  console.log("Body", body)
  return this.http.post<any>(taURL + "taserv/expamount?tour_id=" + tourno + "&expense_id="+id, body, { 'headers': headers })
  }

  public eligibletravel(tourid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + "taserv/tourno_grade_get/"+tourid, { 'headers': headers })
    }

    public assignapprover(payload): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      // const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      const body = JSON.stringify(payload)
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(taURL + "taserv/approverlist",body, { 'headers': headers })
      }

      public recoverysum(payload): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem("sessionData")
        // const getToken: any = sessionStorage.getItem('sessionData')
        let tokenValue = JSON.parse(getToken);
        const body = JSON.stringify(payload)
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.post<any>(taURL + "taserv/recovery_summary",body, { 'headers': headers })
        }
        public recoveryedit(payload): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          const body = JSON.stringify(payload)
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.post<any>(taURL + "taserv/recovery_jv_entry",body, { 'headers': headers })
          }
        public jventry(payload): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          const body = JSON.stringify(payload)
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.post<any>(taURL + "taserv/recovery_summary",body, { 'headers': headers })
          }
          //Adding Masters Page Services
          public gettravelreasondetails(page): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            console.log("Serveice getting called")
            return this.http.get<any>(taURL + 'taserv/tourreason?page='+page, { 'headers': headers })
          }

          public travelreasonadd(CreateList): Observable<any> {
            console.log("errors in Servicesss")
            /*CreateList["Holiday Name"] = CreateList.holidayname */
            //CreateList.code = CreateList.id
            CreateList.fileupload = 0 //CreateList.id
            CreateList.code=CreateList.code
            CreateList.status = 1
            let CreateList1 = CreateList
            console.log("C" +CreateList)
            console.log("C1" +CreateList1)
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList1)
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.post<any>(taURL + "taserv/tourreason", body, { 'headers': headers })
        
          }
          //holidaydiemedit
          public holidaydiemedit(CreateList): Observable<any> {
           this.reset();
            const getToken = localStorage.getItem("sessionData")
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList)
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.post<any>(taURL + "taserv/holidaydeim", body, { 'headers': headers })
          
         }
         public gettravelexpensedetails(): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          console.log("Serveice getting called")
          return this.http.get<any>(taURL + 'taserv/expenselist?page='+1, { 'headers': headers })
        }
        public getholidaydetails(page): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          let pages = page.toString();
          const headers = { 'Authorization': 'Token ' + token }
          console.log("Serveice getting called")
          return this.http.get<any>(taURL + 'taserv/holiday?page='+pages, { 'headers': headers })
        }
        public holidayadd(CreateList): Observable<any> {
          this.reset();
          CreateList.state = 1 
          delete CreateList.file
          let myobj = [CreateList];
          /*console.log("Entering in Add Services")
          CreateList.holidayname
          CreateList.Date = CreateList.date
          CreateList.State = 1 //CreateList.id

          delete CreateList.date
          delete CreateList.id
          let CreateList1 = CreateList*/
      
          const getToken = localStorage.getItem("sessionData")
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const body = JSON.stringify(myobj)
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.post<any>(taURL + "taserv/holiday",body, { 'headers': headers })
        }
        public getcitysearch(value, page): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData")
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.get<any>(taURL + 'taserv/insert_ta_city?city_name=' + value + '&page=' + page, { 'headers': headers })
        }
        //holidaydiemedit
        public holidaydiemedits(CreateList): Observable<any> {
          
          this.reset();
            const getToken = localStorage.getItem("sessionData")
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const body = JSON.stringify(CreateList)
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.post<any>(taURL + "taserv/holidaydeim", body, { 'headers': headers })
          
          }

          public gradeeit(CreateList): Observable<any> {
          
            this.reset();
              const getToken = localStorage.getItem("sessionData")
              let tokenValue = JSON.parse(getToken);
              let token = tokenValue.token
              const body = JSON.stringify(CreateList)
              const headers = { 'Authorization': 'Token ' + token }
              return this.http.post<any>(taURL + "taserv/grade", body, { 'headers': headers })
            
            }

            //travelreasonedit
            public travelreasonedit(CreateList): Observable<any> {
          
              this.reset();
              CreateList.status = 1
              CreateList.fileupload = 0
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const body = JSON.stringify(CreateList)
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.post<any>(taURL + "taserv/tourreason", body, { 'headers': headers })
              
              }
              public travelreasondelete(id): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.delete<any>(taURL + "taserv/tourreason/" + id, { 'headers': headers })
              }
              public travelexpenseadd(CreateList): Observable<any> {
                console.log(CreateList)
                console.log("errors in Servicesss")
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const body = JSON.stringify(CreateList)
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.post<any>(taURL + "taserv/expenselist", body, { 'headers': headers })
            
              }
              public travelexpenseedit(CreateList): Observable<any> {
                console.log(CreateList)
                console.log("errors in Servicesss")
                this.reset();
                CreateList.status = 1
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const body = JSON.stringify(CreateList)
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.post<any>(taURL + "taserv/expenselist", body, { 'headers': headers })
            
              }
              public travelexpensedelete(id): Observable<any> {

                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.delete<any>(taURL + "taserv/expenselist/" + id, { 'headers': headers })
               
              }
              public holidaydelete(id): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.delete<any>(taURL + "taserv/holiday/" + id, { 'headers': headers })
              }
              public holidayedit(CreateList): Observable<any> {
                
                this.reset();
                CreateList.state = 1 //CreateList.id
                delete CreateList.file
                let myobj = [CreateList];
                              
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const body = JSON.stringify(myobj)
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.post<any>(taURL + "taserv/holiday", body, { 'headers': headers })
              }
              public commondropdownedit(CreateList): Observable<any> {
                this.reset();
                let myobj =  [CreateList];
             
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const body = JSON.stringify(myobj)
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.post<any>(taURL + "taserv/common_dropdown", body, { 'headers': headers })
                }
                public commondropdowndetailedit(CreateList): Observable<any> {
                  this.reset();
                  let myobj = {"data" : CreateList};
                  //let body = JSON.stringify(myobj);
                  const getToken = localStorage.getItem("sessionData")
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  const body = JSON.stringify(myobj)
                  const headers = { 'Authorization': 'Token ' + token }
                  return this.http.post<any>(taURL + "taserv/common_dropdown_details", body, { 'headers': headers })
                  }
                  public getreasonsearches(value, page): Observable<any> {
                    this.reset();
                    const getToken = localStorage.getItem("sessionData")
                    let tokenValue = JSON.parse(getToken);
                    let token = tokenValue.token
                    const headers = { 'Authorization': 'Token ' + token }
                    return this.http.get<any>(taURL + 'taserv/tourreason?name=' + value + '&page=' + page, { 'headers': headers })
                  }
                  public getSearchdatas(value, page): Observable<any> {
                    this.reset();
                    const getToken = localStorage.getItem("sessionData")
                    let tokenValue = JSON.parse(getToken);
                    let token = tokenValue.token
                    const headers = { 'Authorization': 'Token ' + token }
                    return this.http.get<any>(taURL + 'taserv/expenselist?name=' + value + '&page=' + page, { 'headers': headers })
                  }
                 //getSearchholiday
                 public getSearchholiday(dates, place, name,  page): Observable<any> {
                  this.reset();
                  const getToken = localStorage.getItem("sessionData")
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  let date = dates
                  if(date==null){
                    date=''
                  }
                  let city=place
                  if(city==null){
                    city=''
                  }
                  if(name==null)
                  {
                    name=''
                  }
                  const headers = { 'Authorization': 'Token ' + token }
                  return this.http.get<any>(taURL + 'taserv/holiday?name='+name+'&state='+city+'&date='+date+ '&page=' + page, { 'headers': headers })
                }

                //getSearchholidaydiem

                public getSearchholidaydiem(salarygrade, place, page): Observable<any> {
                  this.reset();
                  const getToken = localStorage.getItem("sessionData")
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  let grade = salarygrade
                  if(grade==null){
                    grade=''
                  }
                  let city=place
                  if(city==null){
                    city=''
                  }
                  const headers = { 'Authorization': 'Token ' + token }
                  return this.http.get<any>(taURL + 'taserv/holidaydeim?salarygrade='+grade+'&city='+city+'&page='+page, { 'headers': headers })
                  
                }
                //getSearchgrade
                public getSearchgrade(value, page): Observable<any> {
                  this.reset();
                  const getToken = localStorage.getItem("sessionData")
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  const headers = { 'Authorization': 'Token ' + token }
                  return this.http.get<any>(taURL + 'taserv/grade?grade=' + value + '&page=' + page, { 'headers': headers })
                }
                //getSearchCommonNames
                public getSearchCommonNames(value, page): Observable<any> {
                  this.reset();
                  const getToken = localStorage.getItem("sessionData")
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  const headers = { 'Authorization': 'Token ' + token }
                  return this.http.get<any>(taURL + 'taserv/common_dropdown?name=' + value + '&page=' + page, { 'headers': headers })
                }
                //getemployeesearch
                public getemployeesearch(id, approval, page): Observable<any> {
                  this.reset();
                  const getToken = localStorage.getItem("sessionData")
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  let gid = id
                  if(gid==null){
                    gid=''
                  }
                  let approv=approval
                  if(approv==null){
                    approv=''
                  }
                  const headers = { 'Authorization': 'Token ' + token }
                  return this.http.get<any>(taURL + 'taserv/onbehalfof?onbehalf_employeegid='+id+ '&page=' + page, { 'headers': headers })
                }
                public uploadholiday(formData): Observable<any> {
                  console.log("error in upload file service");
                  console.log(formData)
                  const getToken = localStorage.getItem("sessionData")
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  const header = { 'Authorization': 'Token ' + token }
              
                  return this.http.post<any>(taURL + "taserv/holiday_file", formData, { 'headers': header })
                }
                public ClaimAllowance(formData): Observable<any> {
                  console.log("error in upload file service");
                  console.log(formData)
                  const getToken = localStorage.getItem("sessionData")
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  const header = { 'Authorization': 'Token ' + token }
              
                  return this.http.post<any>(taURL + "taserv/allowance_file_upload", formData, { 'headers': header })
                }

                public getbranchemployees(branch): Observable<any> {
                  this.reset();
                 
                  const getToken = localStorage.getItem("sessionData")
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  const headers = { 'Authorization': 'Token ' + token }
             
                    // return this.http.get<any>(taURL + 'taserv/branch_approver_get/tour/branch/' + branch +'?name='+value+'&onbehalfof='+onbehalfof, { 'headers': headers })
                  
                
                  return this.http.get<any>(taURL + 'taserv/branch_approver_get/tour/branch/' + branch , { 'headers': headers })
                
              }

              public getSearchholidaydiems(value, page): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                // return this.http.get<any>(brsurl + "brsserv/knockoff_list?page="+page + value, { 'headers': headers })
                return this.http.get<any>(taURL + 'taserv/holidaydeim?page='+page + value, { 'headers': headers })
                
              }
              public getUsageCodes(empkeyvalue, pageno): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                if (empkeyvalue === null) {
                  empkeyvalue = ""; 
            
                }
                let urlvalue = taURL + 'taserv/expenselist?query=' + empkeyvalue + '&page=' + pageno;
                return this.http.get(urlvalue, {
                  headers: new HttpHeaders()
                    .set('Authorization', 'Token ' + token)
                }
                )
              }
              /*  */
              public getState(value,pageno): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL + 'mstserv/search_hsn?query='+value+'&page='+pageno, { 'headers': headers })
              }
              public createonbehalf(statusdata): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
              return this.http.post<any>(taURL + "taserv/onbehalfof",statusdata, { 'headers': headers })
              }
              public getSearchholidays(value, page): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                // return this.http.get<any>(brsurl + "brsserv/knockoff_list?page="+page + value, { 'headers': headers })
                return this.http.get<any>(taURL + 'taserv/holiday?page='+page + value, { 'headers': headers })
                
              }
              public getstate(value, page): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL + "mstserv/state_search?query=" + value + '&page=' + page, { 'headers': headers })
              }
              public getapuserSummary(pageNumber,val): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                // const getToken: any = sessionStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                let params: any = new HttpParams();
              
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL +"taserv/apusersummery?page="+ pageNumber +val ,{ 'headers': headers })
                
              }
              public getapSummary(statusId,pageNumber,val,apuser): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                // const getToken: any = sessionStorage.getItem('sessionData')
                // http://192.168.1.36:8001/taserv/tourapprove/claim?status=3&page=1
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL + "taserv/tourapprove/claim?status=" + statusId +"&page="+ pageNumber +val +"&apuser="+ 1, { 'headers': headers })
            
              }
           

              public Submitapuser(params): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                // const getToken: any = sessionStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                // params={expenseid:'expenseid,'tourid':'tourid',invoice_date:'invoice_date',invoice_no:'invoice_no',gstno:'gstno'}
                return this.http.post<any>(taURL + "taserv/expensetype" ,params,{ 'headers': headers })
            
              }
              public Submit_ccbs_expence_ap(params): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                // const getToken: any = sessionStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.post<any>(taURL + "taserv/apuser_submit" ,params,{ 'headers': headers })
            
              }
              public check_advance(params): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                // const getToken: any = sessionStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL + "taserv/advance_details" ,{ 'headers': headers, params})
            
              }
       


              public getemployeesearch_onbehalfof(empid, approval, page): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
               
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL + 'taserv/onbehalfof?branch_id='+empid+ '&employee_id=' + approval+'&page=' + page, { 'headers': headers })
              }

              public getdebitbranchsummary(pageNumber = 1, data:any): Observable<any> {
                // this.reset();
                const getToken = localStorage.getItem('sessionData');
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token;
                const headers = { 'Authorization': 'Token ' + token };
                return this.http.get<any>(taURL + "usrserv/search_branch?page="+ pageNumber+'&query='+data, { 'headers': headers })
              }
              public getloc_conv_center(): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL + 'taserv/common_dropdown_get/ctc_conv_center', { 'headers': headers })
              }
          
              public getloc_conv_road(): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL + 'taserv/common_dropdown_get/ctc_conv_road', { 'headers': headers })
              }
              public getecftype(): Observable<any> {
                this.reset();
                const getToken: any = localStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                let params: any = new HttpParams();
                return this.http.get<any>(taURL + "ecfserv/get_ecftype", { 'headers': headers, params })
              }
              public getecfstatus(): Observable<any> {
                this.reset();
                const getToken: any = localStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                let params: any = new HttpParams();
                return this.http.get<any>(taURL + "ecfserv/get_status_ddl", { 'headers': headers, params })
              }
              public getclaimaprequestsummary(id, ap_verify): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                // const getToken: any = sessionStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL +'taserv/claimreq/tour/'+id+'?key='+ap_verify,{ 'headers': headers })
                
              }
              public getclaimapccbsEditview(id, ap_verify): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                // const getToken: any = sessionStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL +"taserv/ccbs_get?type=2&tour="+id+'&key='+ap_verify,{ 'headers': headers })
                
              }
              public getapproveflowapalllist(id, ap_verify): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL + 'taserv/approval_flow_get?type=all&tourid='+id+'&key='+ap_verify, { 'headers': headers })
              }
              public getapusercommenSummary(pageNumber,val): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                // const getToken: any = sessionStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                let params: any = new HttpParams();
                let aptype = ""
                let crno = ""
                let apstatus = ""
                let tour_id =""
                if(val.aptype!=undefined){aptype=val.aptype}
                if(val.crno!=undefined){crno=val.crno}
                if(val.apstatus!=undefined){apstatus=val.apstatus}
                if(val.tour_id!=undefined){tour_id=val.tour_id}
              
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.get<any>(taURL +"taserv/apuser_summary?page="+ pageNumber+"&crno="+crno+"&aptype="+aptype+"&apstatus="+apstatus+"&tour_id="+tour_id,{ 'headers': headers })
                
              }


  public getDesignationSearch(desgkeyvalue:any,page:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'mstserv/designation_search?query=' + desgkeyvalue+'&page='+page, { 'headers': headers })
  }
  public createemployeemapping(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(GradeList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/employeemapping", data, { 'headers': headers })
  }
  public getemployeemappingsummary(page:any,grade:any,designation:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = {'grade':grade, 'designation':designation};
    return this.http.get<any>(taURL + 'taserv/employeemapping?page='+page, { 'headers': headers,params })
  }
  public fetch_employeemapping_id(id:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = {'grade':grade, 'designation':designation};
    return this.http.get<any>(taURL + 'taserv/employeemapping/'+id, { 'headers': headers })
  }
  public ap_approval_and_pay(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(GradeList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + "taserv/apuser_payment", data, { 'headers': headers })
  }

  public getAPUserpdf(invoiceid) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/apuserpdf/'+invoiceid,{ 'headers': headers, responseType: 'blob' as 'json' })
    
  }
  public recovery_jv_approve(payload) {
    this.reset();
          const getToken = localStorage.getItem("sessionData")
          // const getToken: any = sessionStorage.getItem('sessionData')
          let tokenValue = JSON.parse(getToken);
          const body = JSON.stringify(payload)
          let token = tokenValue.token
          const headers = { 'Authorization': 'Token ' + token }
          return this.http.post<any>(taURL + "taserv/recovery_jv_approve",body, { 'headers': headers })
  }
  public gst_validate(gstno) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'venserv/validate?type=gst&value=' + gstno,{ 'headers': headers })
    
  }
  public getcreditpaymodesummaryy(pageNumber:any,tourid, paymodeid, accno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (paymodeid === undefined) {
      paymodeid = ""
    }
   
    if (accno === undefined) {
      accno = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
  
    return this.http.get<any>(taURL + "taserv/credit_details?paymode="+ paymodeid + "&account_no=" + accno+"&tour_id="+tourid, { 'headers': headers, params })
  }
  public getbradata(branchcode): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(taURL + "mstserv/bankdetailstrndata/"+branchcode, { 'headers': headers, params })
    
  }    
  public getallPaymode(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'mstserv/paymode_ecf_search', { 'headers': headers })
  }  
  public createtourcreditdetails(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(taURL + 'taserv/credit_insert',data, { 'headers': headers })
  } 
  public getcreditgl(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'mstserv/paymodecreditgl/'+id, { 'headers': headers })
  }  
  public getPaymode(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'mstserv/get_cridit_gl_paymode', { 'headers': headers })
  }  
  public IBACreate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/uservehicle_iba", body, { 'headers': headers })
  }
  public getiba_travelmode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/iba_travelmode', { 'headers': headers })
  }
  public getiba_road(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL + 'taserv/common_dropdown_get/iba_road', { 'headers': headers })
  }
  public getibaeditSummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(taURL +'taserv/uservehicle_iba/tour/'+id,{ 'headers': headers })
  }  
  public IbaEdit(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    // const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/uservehicle_iba", body, { 'headers': headers })
  }
  public uservehicleibaeligibleamt(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(taURL + "taserv/eligible_amount_iba" , body, { 'headers': headers })
    }
    public deleteuservehicle_iba(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      // const getToken: any = sessionStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.delete<any>(taURL +'taserv/uservehicle_iba/tour/'+id,{ 'headers': headers })
      
    }
    public getbranchid(query,branchid,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      const params = {
        branch_id: branchid,
        query: query,
        page: page
    };
      return this.http.get<any>(taURL +'usrserv/get_claim_approve_emp',{ params,'headers': headers })
      
    }   
    public ta_file_download(data:any): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem('sessionData');
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token;
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(taURL + 'taserv/ta_file_download/'+data,{ 'headers': headers ,responseType: 'blob' as 'json'})
    }
   
    public gettablelist(): Observable<any> {
      this.reset();
      // let obj = { "report_id": data }
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(taURL + "taserv/ta_all_table_get" , { 'headers': headers })
    }
    public getColumnlist(tablevalue,value): Observable<any> {
      this.reset();
      // let obj = { "report_id": data }
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.get<any>(taURL + "taserv/all_table_columns?id="+tablevalue , { 'headers': headers })
    }
    public gettraveltype(key): Observable<any> {
      this.reset();
      // let obj = { "report_id": data }
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      let params: any = new HttpParams();
      return this.http.post<any>(taURL + "taserv/dynamic_report?travel_type_key="+key , { 'headers': headers })
    }
    public getfiledownload(data): Observable<any> {
      this.reset();
     
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(taURL + "taserv/dynamic_report", data, { 'headers': headers , responseType: 'blob' as 'json' } )
    }
    public getfetchpdfimage(id): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      let params = new HttpParams().set('report', '1');
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + 'taserv/fetch_documents/'+id, { 'headers': headers ,'params':params})
    }

  public ta_onbehalf_file_download(data:any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem('sessionData');
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token;
        const headers = { 'Authorization': 'Token ' + token };
        return this.http.get<any>(taURL + 'taserv/onbehalf_download/'+data,{ 'headers': headers ,responseType: 'blob' as 'json'})
      }
  public ta_onbehalf_file_view(data:any): Observable<any> {
        this.reset();
        const getToken = localStorage.getItem('sessionData');
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token;
        const headers = { 'Authorization': 'Token ' + token };
        return this.http.get<any>(taURL + 'taserv/ta_onbehalf_doc_file/'+data,{ 'headers': headers ,responseType: 'blob' as 'json'})
      }
      public gettravelmode(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      // let params={'name':empval}
      return this.http.get<any>(taURL + 'taserv/common_dropdown_get/travel_travelmode', { 'headers': headers })
      
    }
    public getfetchimages2(id, fileextension): Observable<any> {
      this.reset();
      let token = '';
      const getToken = localStorage.getItem("sessionData");
      if (getToken) {
        let tokenValue = JSON.parse(getToken);
        token = tokenValue.token
      }
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(taURL + 'taserv/download_documents/'+id +'?type=' + fileextension, { headers, responseType: 'blob' as 'json' })
  
    }

}