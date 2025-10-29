import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from "rxjs";
import { catchError, filter, map, retry } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { NotificationService } from '../service/notification.service';
import { Idle } from '@ng-idle/core';
// import { stat } from 'fs';


const rmuurl = environment.apiURL

@Injectable({
  providedIn: 'any'
})


export class RmuApiServiceService {
  // department:String
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  header: any;
  method: any;
  body: any;
  get = 'get';
  post = 'post';
  delete = 'delete';
  responsetype = 'json';
  showsuccess = true;
  address = ''
  // array = this.getaddress().subscribe(res =>{
  //   this.department = `(${res['code']})-${res['name']}`;
  //   console.log(this.department)
  // });
  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private notification: NotificationService, private idle: Idle) {


  }

  // URL calling
  httpcall(url) {
    // this.spinner.show();
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }

    if (this.method == 'post') {
      return this.http.post<any>(`${rmuurl}${url}`, this.body, { 'headers': headers })
        .pipe(
          map((response: any) =>
            this.handleresponse(response)

          ),
          catchError((err) =>
            this.handleError(err)
          )
        )
    }
    else if (this.method == 'get') {
      let val = this.responsetype;
      if (this.responsetype == 'blob') {
        val = 'blob';
        this.responsetype = 'json'
      }

      return this.http.get<any>(`${rmuurl}${url}`, { headers, responseType: val as 'json' })
        .pipe(
          map((response: any) =>
            this.handleresponse(response)
          ),
          catchError((err) =>
            this.handleError(err)
          )
        )
    }

    else if (this.method == 'delete') {
      return this.http.delete<any>(`${rmuurl}${url}`, { 'headers': headers })
        .pipe(
          map((response: any) =>
            this.handleresponse(response)
          ),
          catchError((err) =>
            this.handleError(err)
          )
        )
    }

    else {
      this.notification.showError('Http Method not assigned.')
    }

  }

  handleresponse(response: any) {
    this.spinner.hide();
    if (response?.status == 'success' && (this.method == this.post || this.method == this.delete)) {
      if (this.showsuccess) {
        this.notification.showSuccess(response.message);
      }

      return response;
    }

    if (!response['data'] && response['description']) {
      this.notification.showError(response.description);
      return false;
    }

    return response;

  }

  handleError(error) {
    this.spinner.hide();
    window.alert(`${error.statusText}`)
    return throwError(error);

  }

  //RMU API CALLS 
  getbrsummary(val, page) {
    this.spinner.show();
    let url = `rmuserv/barcode_maker?page=${page}${val}`
    this.method = this.get;
    return this.httpcall(url);
  }

  getrrsummary(val, page, data) {
    this.spinner.show()
    let url = `rmuserv/retrivaldata?page=${page}&${val}${data}`
    this.method = this.get;
    return this.httpcall(url);
  }

  // archivalformatdownload(val) {
  //   this.spinner.show();
  //   this.reset();

  //   return this.http.get<any>(`${rmuurl}rmuserv/product_metadata?${val}`, this.header)
  //     .pipe(
  //       map((response: any) =>
  //         this.handleresponse(response)
  //       ),
  //       catchError((err) =>
  //         this.handleError(err)
  //       )
  //     )

  // }


  getretrievaldata(val) {
    this.spinner.show();
    let url = `rmuserv/retrival?id=${val}`
    this.method = this.get
    return this.httpcall(url);
  }
  getretmethod() {
    this.spinner.show()
    let url = `rmuserv/common_dropdown?code=retrieval_method`
    this.method = this.get;
    return this.httpcall(url);
  }
  getrettype() {
    this.spinner.show()
    this.method = this.get;
    let url = `rmuserv/common_dropdown?code=retrieval_type`
    return this.httpcall(url);
  }
  getproducts(val = '', page = 1) {
    this.spinner.show()
    this.method = this.get;
    let url = `rmuserv/product_master?page=${page}&${val}`
    return this.httpcall(url);
  }

  getbarcodestarts() {
    this.spinner.show()
    this.method = this.get;
    let url = `rmuserv/barcode_startswith`
    return this.httpcall(url);
  }
  getrole(role) {
    this.spinner.show()
    this.method = this.get;
    let url = `rmuserv/common_dropdown?code=${role}`
    return this.httpcall(url);
  }
  getdocs(params) {
    this.spinner.show();
    this.method = this.get;
    let url = `rmuserv/archivalsearch?${params}`
    return this.httpcall(url);
  }
  // archivalformatdownload(val){
  //   let url = `rmuserv/product_metadata?${val}`
  //   return this.httpcall(url);

  // }
  barcodesubmit(data) {
    this.spinner.show()
    this.method = this.post;
    this.body = data;
    let url = `rmuserv/barcode_maker`
    return this.httpcall(url);

  }

  getbarcoderequest(id) {
    this.spinner.show()
    this.method = this.get;
    let url = `rmuserv/barcode_request/${id}`
    return this.httpcall(url)
  }


  // getarchivalsummary(val, page) {
  //   let url = `rmuserv/archival_maker?page=${page}${val}`
  //   this.method = 'get';
  //   return this.httpcall(url);
  // }
  // // getapproveBarcode(val, page){
  //   let url = `rmuserv/barcode_approver?page=${page}${val}`
  //   this.method = 'get';
  //   return this.httpcall(url);

  // }
  // getbarcodeapproverarchival(val, page) {
  //   let url = `rmuserv/barcode_approver?page=${page}${val}`
  //   this.method = 'get';
  //   return this.httpcall(url);
  // }
  // archivalformatdownload() {
  //   this.spinner.show();
  //   let url = `rmuserv/product_metadata/`
  //   this.method = this.get
  //   return this.httpcall(url);
  // }
  // submitarchival(val, file)
  // {
  //   this.spinner.show();
  //   this.body = val;
  //   let url = `rmuserv/archival_maker`
  //   this.method = this.post
  //   return this.httpcall(url);

  // }
  // submitnewbarcodes(val)
  // {
  //   this.spinner.show();
  //   this.body = val;
  //   let url = `rmuserv/barcode_series`
  //   this.method = this.post
  //   return this.httpcall(url);
  // }
  setdraft(body) {
    this.body = body;
    this.showsuccess = false;
    let url = `rmuserv/draft_history`;
    this.method = this.post;
    return this.httpcall(url)
  }
  getdraft(type) {
    this.spinner.show()
    let url = `rmuserv/draft_history?type=${type}`;
    this.method = this.get;
    return this.httpcall(url)
  }
  public submitnewbarcodes(CreateList, files): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = ''
      console.log("Error in files")
    }
    let input = CreateList
    delete input.filedatas


    let json = Object.assign({}, input)
    let formData = new FormData();
    formData.append('data', JSON.stringify(json));
    // formData.append('data', input)
    // formData.append('file', files)
    const headers = { 'Authorization': 'Token ' + token }
    console.log(formData)
    return this.http.post<any>(rmuurl + "rmuserv/barcode_series", formData, { 'headers': headers })
    // // console.log(CreateList)
    // // console.log("errors in Servicesss")
    // // this.reset();
    // // const getToken = localStorage.getItem("sessionData")
    // // let tokenValue = JSON.parse(getToken);
    // // let token = tokenValue.token
    // // // const body = JSON.stringify(CreateList)
    // // const headers = { 'Authorization': 'Token ' + token }
    // // return this.http.post<any>(rmuurl + "rmuserv/barcode_series", CreateList, { 'headers': headers })
    // this.reset();
    // const getToken = localStorage.getItem("sessionData")
    // let input = datas
    // delete input.file
    // delete input.fileSource



    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token

    // if (file == undefined) {
    //     file = ""

    // }


    // // let json = Object.assign({}, input)
    // // let formData = new FormData();
    // // formData.append('data', JSON.stringify(json));
    // // formData.append('file', files)


    // const formData = new FormData();
    // let json = Object.assign({}, input)
    // formData.append('data', JSON.stringify(json));
    // formData.append('file', file);
    // const headers = { 'Authorization': 'Token ' + token }
    // console.log(datas)
    // return this.http.post<any>(rmuurl + "rmuserv/barcode_maker", formData, { 'headers': headers })


  }
  public archivalformatdownload(id) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/product_metadata?id=" + id + "&type=download", { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public submitarchival(CreateList, files) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(CreateList)
    if (files == undefined) {
      files = ''
      console.log("Error in files")
    }

    let json = Object.assign({}, CreateList)
    let formData = new FormData();
    formData.append('data', JSON.stringify(json));
    formData.append('file', files)
    const headers = { 'Authorization': 'Token ' + token }
    console.log(formData)
    return this.http.post<any>(rmuurl + "rmuserv/archival_maker", formData, { 'headers': headers })
  }
  //getapproveBarcode
  public getapproveBarcode(CreateList): Observable<any> {
    console.log("CreateList", CreateList)
    console.log("errors in Servicesss")
    let input = CreateList
    delete input.barcode_category
    delete input.barcode_type
    input.approved_count = input.barcodealloted
    input.comment = input.comments
    delete input.count
    delete input.department
    delete input.from_series
    delete input.to_series
    delete input.product
    delete input.vendor
    delete input.startswith
    delete input.comments
    delete input.barcodeavailable

    input.status = 3
    input.barcode_series_id = input.barcode_series_id
    delete input.ids



    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(input)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/barcode_approver", body, { 'headers': headers })

  }
  //getarchivalsummary
  public getarchivalsummary(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/archival_maker?page=" + page, { 'headers': headers })

  }
  //getbarcodeapprove  
  // public getbarcodeapprove(id): Observable<any> {

  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const body = JSON.stringify(id)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(rmuurl + "rmuserv/barcode_approver?id="+id,  { 'headers': headers })

  // }
  // getbarcodeapprove(id) {
  //   this.spinner.show()
  //   this.method = this.get;
  //   let url = `rmuserv/barcode_approver?id=${id}`
  //   return this.httpcall(url)
  // }
  getarchivalboxlevel() {
    // this.reset();
    // const getToken = localStorage.getItem("sessionData")
    // let tokenValue = JSON.parse(getToken);
    // let token = tokenValue.token

    // const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/archival_get?id="+2 ,  { 'headers': headers })

    // this.spinner.show()
    // this.method = this.get;
    // let url = `rmuserv/archival_request_get/`+2;
    // return this.httpcall(url)

    this.spinner.show()
    this.method = this.get;
    let url = `rmuserv/archival_get?id=` + 2;
    return this.httpcall(url)
    //barcode_series
    // this.spinner.show()
    // this.method = this.get;
    // let url = `rmuserv/barcode_series?vendor=`+1;
    // return this.httpcall(url)
  }
  getbarcodes(val) {
    this.method = this.get;
    let url = `rmuserv/barcode_get?${val}`
    return this.httpcall(url);
  }
  getdocuments(val) {
    this.method = this.get;
    let url = `rmuserv/document_get?${val}`
    return this.httpcall(url);
  }
  getbrtype() {
    this.method = this.get;
    let url = `rmuserv/common_dropdown?code=barcode_type`
    return this.httpcall(url);
  }
  getbrcategory() {
    this.method = this.get;
    let url = `rmuserv/common_dropdown?code=sticker_type`
    return this.httpcall(url);
  }

  getvendors() {
    this.spinner.show()
    this.method = this.get;
    // let url = `rmuserv/barcode_series`;
    let url = `rmuserv/vendor?type=1`;
    return this.httpcall(url)

  }

  public getsinglesummary(id): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    //const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/archival_request_get/id", { 'headers': headers })

  }

  //getbarcodeapproverarchival
  //rmuserv/barcode_approver?page=
  public getbarcodeapproverarchival(val, page): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/barcode_approver?page=" + page + "&status=" + 2, { 'headers': headers })

  }
  public getbarcodeapprove(id): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/barcode_approver?id=" + id + "&status=" + 2, { 'headers': headers })

  }




  public getvendorss(id, count): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/barcode_series?vendor.id=" + id, { 'headers': headers })

  }
  //getdropdowndata
  public getdropdowndata(value): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/barcode_series?from_series=" + value, { 'headers': headers })

  }
  public submitretrieval(body) {
    this.spinner.show();
    this.showsuccess = true;
    this.method = this.post;
    this.body = body;
    let url = `rmuserv/retrival`
    return this.httpcall(url);
  }

  public getbarcodeapproverarchivals(val, page): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/barcode_approver?page=" + page + "&status=" + 3, { 'headers': headers })

  }
  public getaddress() {
    this.spinner.show()
    this.reset();
    this.method = this.get
    return this.httpcall('rmuserv/branch_address')
  }
  getbssummary(val, page) {
    this.spinner.show();
    let url = `rmuserv/barcode_series?page=${page}${val}`
    this.method = this.get;
    return this.httpcall(url);
  }

  getarchivaladminsummary(val, page) {
    this.spinner.show();
    let url = `rmuserv/archival_admin?page=${page}${val}`
    this.method = this.get;
    return this.httpcall(url);
  }
  getbarcodeassign(id) {
    this.spinner.show()
    this.method = this.get;
    let url = `rmuserv/barcode_approver?id=${id}`
    return this.httpcall(url)
  }

  public getbarcodeassigndata(val): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(val)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/barcode_request/id", { 'headers': headers })

  }

  // getaddress()
  // {
  //   this.spinner.show()
  //   this.method = this.get;
  //   let url = `rmuserv/branch_address`;
  //   return this.httpcall(url)

  // }

  getbranch(val) {
    this.method = this.get;
    let url = `usrserv/search_employeebranch?${val}`
    return this.httpcall(url)
  }

  getapprover(val) {
    this.method = this.get;
    let url = `rmuserv/delmat_approver?${val}`
    return this.httpcall(url)
  }

  deldraft(type) {
    this.spinner.show()
    let url = `rmuserv/draft_history?type=${type}`;
    this.showsuccess = false;
    this.method = this.delete;
    return this.httpcall(url)
  }

  retaction(request) {
    this.spinner.show()
    this.showsuccess = true;
    this.body = request
    let url = `rmuserv/approval`;
    // this.showsuccess = false;
    this.method = this.post;
    return this.httpcall(url)
  }
  public getsinglerecord(id): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(id)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/archival_request/" + id, { 'headers': headers })

  }

  //getboxlevel

  public getboxlevel(id): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(id)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/archival_get?archivalrequest=" + id, { 'headers': headers })

  }
  public deleterecord(id, comments): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(comments)
    const headers = { 'Authorization': 'Token ' + token }
    const options = {
      headers: headers,
      body: { 'comment': comments },
    };

    return this.http.delete<any>(rmuurl + "rmuserv/archival_request/" + id, options)



  }
  public getfilelevel(id, page = 1): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(id)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/archival_details_get?archival_id="+id,  { 'headers': headers })
    return this.http.get<any>(rmuurl + "rmuserv/archival_details_get?archival_id=" + id + "&page=" + page, { 'headers': headers })

  }

  // getvendorarchsummary(val, page) {
  //   this.spinner.show();
  //   let url = `rmuserv/vendor_archival_details?vendor=1`
  //   this.method = this.get;
  //   return this.httpcall(url);
  // }

  // vendor_archival
  public schedulearchival(CreateList): Observable<any> {
    console.log(CreateList)
    console.log("errors in Servicesss")
    let input = CreateList
    input.type = "SCHEDULED"
    // input.barcode= [input.barcode_no]
    delete input.barcode_no
    delete input.status


    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(input)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/vendor_archival", body, { 'headers': headers })

  }

  public pickuparchival(CreateList): Observable<any> {
    console.log(CreateList)
    console.log("errors in Servicesss")
    let input = CreateList
    input.type = "PICKEDUP"
    input.barcode = [input.barcode]



    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(input)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/vendor_archival", body, { 'headers': headers })

  }

  public archivalcomplete(CreateList): Observable<any> {
    console.log(CreateList)
    console.log("errors in Servicesss")
    let input = CreateList
    input.type = "ARCHIVED"
    input.barcode = [input.barcode_no]
    delete input.barcode_no


    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(input)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/vendor_archival", body, { 'headers': headers })

  }
  public getvendorarchsummary(val, page): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/vendor_archival_details?page="+page+"&vendor="+1,  { 'headers': headers })

    return this.http.get<any>(rmuurl + "rmuserv/vendor_archival", { 'headers': headers })

  }
  getvrsummary(val, page) {
    this.spinner.show()
    let url = `rmuserv/retrivaldata?page=${page}&role=5`
    this.method = this.get;
    return this.httpcall(url);
  }
  getvendorretrievalstatus() {
    this.spinner.show()
    this.method = this.get;
    let url = `rmuserv/common_dropdown?code=vendor_retrieval_status`
    return this.httpcall(url);
  }

  submitdelivery(data) {
    this.spinner.show();
    this.method = this.post;
    this.body = data
    let url = `rmuserv/retrivalsummary`
    return this.httpcall(url);
  }

  getrethistory(id) {
    this.spinner.show()
    this.method = this.get;
    let url = `rmuserv/retrival_approvalflow?id=${id}`
    return this.httpcall(url);
  }

  getarsummary(val, page) {
    this.spinner.show()
    let url = `rmuserv/retrivaldata?page=${page}`
    this.method = this.get;
    return this.httpcall(url);
  }
  vendorstatusupdate(data) {
    this.spinner.show()
    this.showsuccess = true;
    let url = `rmuserv/retrival_summary`
    this.body = data;
    this.method = this.post;
    return this.httpcall(url);
  }

  getdespatchdetails(id) {
    this.spinner.show()
    let url = `rmuserv/retrival_summary?id=${id}`
    this.method = this.get;
    return this.httpcall(url);
  }

  public getarchivalsearch(archCode, archDate, vendor, status, page): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token


    if (archCode == null) {
      archCode = null
    }
    if (archDate == null) {
      archDate = ''
    }

    if (vendor == null) {
      vendor = ''
    }
    if (status == null) {
      status = ''
    }
    let type = ''


    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/archival_maker?archival_code=" + archCode + "&archival_date=" + archDate + "&vendor=" + vendor + "&archival_status="+status+ "&type="+type, { 'headers': headers })
    return this.http.get<any>(rmuurl + "rmuserv/mono_paid_ecf_no" + archCode, { 'headers': headers })
  }


  public getdestroysummary(val, page): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/vendor_archival_details?page="+page+"&vendor="+1,  { 'headers': headers })

    return this.http.get<any>(rmuurl + "rmuserv/destroy_check?page=" + page + val, { 'headers': headers })

  }

  public getdestroyreqsummary(val, page): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/vendor_archival_details?page="+page+"&vendor="+1,  { 'headers': headers })

    return this.http.get<any>(rmuurl + "rmuserv/destroy_maker?destroy_status=2", { 'headers': headers })

  }

  public getdestroyparticular(id, page): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/vendor_archival_details?page="+page+"&vendor="+1,  { 'headers': headers })

    return this.http.get<any>(rmuurl + "rmuserv/destroy_maker/" + id, { 'headers': headers })

  }

  public getdestroyappsummary(val, page): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/vendor_archival_details?page="+page+"&vendor="+1,  { 'headers': headers })

    return this.http.get<any>(rmuurl + "rmuserv/destroy_approver?destroy_status=2", { 'headers': headers })

  }
  getinitiatedvendors(params, page) {
    this.spinner.show()
    let url = `rmuserv/vendor?page=${page}&${params}`
    this.method = this.get;
    return this.httpcall(url);
  }
  getmastervendor(val): Observable<any> {
    let url = `rmuserv/vendor?type=1&query=${val}`
    this.method = this.get;
    return this.httpcall(url);
  }
  creatermuvendor(payload) {
    this.spinner.show()
    let url = `rmuserv/vendor`
    this.body = payload;
    this.method = this.post;
    return this.httpcall(url);
  }

  // deletermuvendor(id) {
  //   this.spinner.show();
  //   this.showsuccess = true;
  //   let url = `rmuserv/rmu_vendor_get/id=${id}`
  //   this.method = this.delete;
  //   return this.httpcall(url);
  // }
  //destroyrequest
  public destroyrequest(CreateList): Observable<any> {
    console.log(CreateList)
    // console.log("errors in Servicesss")
    let input = CreateList
    input.archived_details = CreateList.id
    input.archived_details_id = [input.archived_details]

    //  input.archival_id = [input.archival_id]
    delete input.id
    delete input.archived_details
    delete input.archival_id


    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/destroy_maker", body, { 'headers': headers })
  }

  public destroyapprove(CreateList): Observable<any> {
    console.log(CreateList)
    // console.log("errors in Servicesss")
    let input = CreateList
    input.status = 3
    //  input.archived_details_id = [input.archived_details ]
    //  delete input.id
    //  delete  input.archived_details


    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/destroy_approver", body, { 'headers': headers })
  }

  public destroyreject(CreateList): Observable<any> {
    console.log(CreateList)
    // console.log("errors in Servicesss")
    let input = CreateList
    input.status = 4



    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/destroy_approver", body, { 'headers': headers })
  }
  public destroyreturn(CreateList): Observable<any> {
    console.log(CreateList)
    // console.log("errors in Servicesss")
    let input = CreateList
    input.status = 5
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/destroy_approver", body, { 'headers': headers })
  }
  getfilebyid(id) {
    this.spinner.show()
    let url = `rmuserv/id=${id}`
    this.method = this.get;
    this.responsetype = 'blob'
    return this.httpcall(url)
  }

  getretrievalpdf(id) {
    this.spinner.show();
    let url = `rmuserv/retrival_covernote?retrieval_id=${id}`;
    this.method = this.get;
    this.responsetype = 'blob'
    return this.httpcall(url);
  }
  //submitlegitimaterequest
  public submitlegitimaterequest(CreateList): Observable<any> {
    console.log(CreateList)
    // console.log("errors in Servicesss")
    let input = CreateList
    delete input.id
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(input)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/legitimate", body, { 'headers': headers })
    // return this.http.get<any>(rmuurl + "rmuserv/legitimate", { 'headers': headers })
  }

  deletelegitimate(id) {
    this.reset();
    let comments = '';
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(comments)
    const headers = { 'Authorization': 'Token ' + token }
    const options = {
      headers: headers,
      body: { 'comment': comments },
    };

    return this.http.delete<any>(rmuurl + "rmuserv/legitimate?id=" + id, { 'headers': headers })
  }

  getcullingsummary(val, page) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(id)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/archival_details_get?archival_id="+id,  { 'headers': headers })
    return this.http.get<any>(rmuurl + "rmuserv/culling?page=" + page + "&vendor=1" + val, { 'headers': headers })
  }

  startculling(data) {
    this.spinner.show();
    let url = `rmuserv/culling?vendor=1`;
    this.body = data;
    this.method = this.post;
    return this.httpcall(url);
  }

  public getfilelevels(page): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // const body = JSON.stringify(id)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/archival_details_get?archival_id="+id,  { 'headers': headers })
    return this.http.get<any>(rmuurl + "rmuserv/archival_details_get?page=" + page, { 'headers': headers })

  }

  public getvendordestroysummary(val, page): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(rmuurl + "rmuserv/vendor_archival_details?page="+page+"&vendor="+1,  { 'headers': headers })

    return this.http.get<any>(rmuurl + "rmuserv/destroy_final", { 'headers': headers })

  }

  // public destroydelete(id): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   // const body = JSON.stringify(input)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(rmuurl + "rmuserv/destroy_final?id="+id , { 'headers': headers })

  // }

  destroydelete(id) {
    this.spinner.show();
    let url = `rmuserv/destroy_final?destroy_id=` + id;
    this.method = this.post;
    return this.httpcall(url);
  }

  getcullingfilelevel(id, page) {
    this.spinner.show();
    let url = `rmuserv/archival_details_get?archival_id=${id}&page=${page}&archival_status=4`;
    this.method = this.get;
    return this.httpcall(url);
  }

  createproduct(data) {
    this.spinner.show();
    let url = `rmuserv/product_master`;
    this.method = this.post;
    this.body = data;
    return this.httpcall(url);
  }
  getculledsummary(page) {
    this.spinner.show()
    let url = `rmuserv/culling_summary?page=${page}`;
    this.method = this.get;
    return this.httpcall(url)
  }
  getparticularculling(id) {
    this.spinner.show()
    let url = `rmuverv/culling/${id}`;
    this.method = this.get;
    return this.httpcall(url)
  }
  public getarchivalecf(cr_no,product_id,product_name_find,box_id,status,box_number,page,batchNo): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    let value
    if(status!=2){
      value="summary"
    }else{
    if(!(product_id  || box_id || box_number || cr_no)){
      value="summary"
    }else{
       value="filter"
    }
  }
   let urlvalue
   let is_ecf
    if(product_name_find===true){
    is_ecf = 'True'
    }else{
    is_ecf=""
    }
    //   urlvalue=rmuurl + "rmuserv/rmu_approved_ecf_create?page=" + page+"&cr_no="+cr_no +"&product_id="+product_id+"&box_id="+box_id+"&box_number="+box_number+"&box_status="+status +"&action="+value   
    //   }else{
      urlvalue=rmuurl +"rmuserv/upload_data?product="+product_id+"&action="+value +"&page=" + page+"&box_id="+box_id+"&box_number="+box_number+"&box_status="+status+"&cr_no="+cr_no+"&is_ecf="+is_ecf+'&batch_number='+batchNo
      // }

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )

  }

  public get_archival_master(vendordate,vendor,page,productlist,box_id): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/archival_create?page=" + page +"&archival_date="+vendordate+"&vendor="+vendor +"&product_master="+productlist +"&box_id="+box_id, { 'headers': headers })

  }

  public getarchivalfetch_search(archCode, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token   
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/mono_paid_ecf_no" , archCode, { 'headers': headers })

  }

  public get_master_submit(archival_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token   
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/archival_box_insert" , archival_id, { 'headers': headers })
  }

  public getproductsummary(name,code, page) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/product_master?page="+page +"&code="+code+"&name="+name, { 'headers': headers })

  }

  public get_archival_master_summary(cr_no,vendordate,vendor,archival_status,box_name,action,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/archival_summary_data?page=" + page+"&archival_date="+vendordate+"&vendor="+vendor +"&archival_status="+archival_status+"&box_name="+box_name +"&action="+action +"&cr_no="+cr_no, { 'headers': headers })
// "&archival_date="+vendordate+"&vendor="+vendor +"&product_master="+productlist
  }
  public box_master_delete(id,status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token } 
    return this.http.delete<any>(rmuurl + 'rmuserv/box_get/'+id +'?action='+'Delete'+'&status='+status, { 'headers': headers })
  }

  public box_create_update(box_data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token   
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "rmuserv/box_level_create" , box_data, { 'headers': headers })
  }

  public box_master_summary(name, page) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(page)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(rmuurl + "rmuserv/box_level_create?page="+page +"&name="+name, { 'headers': headers })
}

public product_master_create_update(product) : Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token   
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(rmuurl + "  rmuserv/product_create" , product, { 'headers': headers })
}

public product_master_summary(name,code, page) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(page)
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(rmuurl + "rmuserv/product_create?name="+name+"&code="+code+"&page=" + page , { 'headers': headers })

}

public product_mapping_summary(name,code,product_box, page) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(page)
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(rmuurl + "rmuserv/product_mapping_summary?page=" + page +"&name="+name+"&code="+code, { 'headers': headers })
}

public product_mapping_create_update(product): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token   
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(rmuurl + "rmuserv/product_create" , product, { 'headers': headers })
}

public box_dd_product (product_id,box_id,page){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(page)
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(rmuurl + "rmuserv/product_level_box_get?product_id=" + product_id +"&box_id="+box_id+"&page="+page, { 'headers': headers })
}

public archival_search_summary(product_id,box_id,status,box_number,page){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(page)
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(rmuurl + "rmuserv/archivalbox_create?product_id=" + product_id+"&box_id="+box_id +"&status="+status+ "&box_number="+box_number+"&page="+page, { 'headers': headers })
}

public box_generate(product): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token   
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(rmuurl + "rmuserv/archivalbox_create" , product, { 'headers': headers })
}

public get_boxid(id,page) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(page)
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(rmuurl + "rmuserv/archival_ecf_summary?archival_box_id="+id+"&page="+page, { 'headers': headers })
}


public get_approval_close(data): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token   
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(rmuurl + "rmuserv/archival_create",data, { 'headers': headers })
}
public ecf_box_delete(id): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token } 
  return this.http.delete<any>(rmuurl + 'rmuserv/rmu_approved_ecf_data/'+id +'?action='+'', { 'headers': headers })
}

public vendordd(value,page) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(page)
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(rmuurl + "rmuserv/vendor?page="+page+"&type=1", { 'headers': headers })
}


public contact_details(param): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token   
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(rmuurl + "rmuserv/rmu_vendor_create",param, { 'headers': headers })
}

public vendor_summary(value,status,page) {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(page)
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(rmuurl + "rmuserv/rmu_vendor_create?page="+page+"&name="+value+"&status="+status, { 'headers': headers })
}
public deletermuvendor(id): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token } 
  return this.http.delete<any>(rmuurl + 'rmuserv/rmu_vendor_get/'+id , { 'headers': headers })
}
public StorageVendaorDropDown(name,page): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token } 
  return this.http.get<any>(rmuurl + 'rmuserv/rmu_vendor_create?name='+name +'&page='+page, { 'headers': headers })
}
public BoxNameDropDown(name,page): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token } 
  return this.http.get<any>(rmuurl + 'rmuserv/box_level_create?name='+name +'&page='+page, { 'headers': headers })
}
public VendorSubmit(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token } 
  return this.http.post<any>(rmuurl + 'rmuserv/vendor_barcode_create',data, { 'headers': headers })
}
public VendorBarCodeGet(code,page,boxname): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token } 
  return this.http.get<any>(rmuurl + 'rmuserv/vendor_barcode_create?bar_code_number='+code+'&page='+page +"&box_name="+boxname, { 'headers': headers })
}

public file_upload(files,data,status): Observable<any> {
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token } 
  let formData = new FormData();
  formData.append('data', JSON.stringify(data));
  if(files != null || files != undefined ){
    formData.append("file", files);
  }
  return this.http.post<any>(rmuurl + 'rmuserv/acknowledgement_upload?status='+status,formData , { 'headers': headers })
}


public getfileview(file: string): Observable<Blob> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.get(rmuurl + "rmuserv/acknowledgement_download?file_data=" + file, { headers, responseType: 'blob' });
}
public SubmitUpload(Array): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.post(rmuurl + "rmuserv/product_template" , Array, {  'headers': headers });
}
public FileUploadFetchSummary(id,page): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.get(rmuurl + "rmuserv/product_template?product=" +id+'&page='+page, {  'headers': headers });
}
public downloadfileuploadfetch(product): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http
  .get(rmuurl + `rmuserv/upload_data?product=${product}&action=download`, {
    headers,
    responseType: 'blob', // Force the response to Blob
    observe: 'response',
  })
  .pipe(
    map(response => {
      console.log("responsehjbghd",response.body)
      const blob = response.body as Blob;

      // Log the size of the Blob
      console.log('Blob size in bytes:', blob.size);
      console.log('Blob type:', blob.type);
      console.log("response",response.body)

      // Return Blob or its metadata
      return { blob, size: blob.size, type: blob.type };
    })
  );
}
public uploadfileuploadfetch(product,data): Observable<any> {
  this.reset();
  let formdata=new FormData()
  formdata.append('file',data)
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.post(rmuurl + "rmuserv/upload_data?product="+product ,formdata ,{   'headers':headers});
}


public product_template_created_data(id,page): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.get(rmuurl + "rmuserv/product_template?product=" +id +"&page="+page, {  'headers': headers });
}

public valid_search_summary(page): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.get(rmuurl + "rmuserv/uploadtran_histsummary?page=" +page+"&action=summary", {  'headers': headers });
}

public template_status_change(sum): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  let value ="primary"
  return this.http.get(rmuurl + "rmuserv/product_template?action="+value+"&field_id="+sum?.id, {  'headers': headers });
}

public template_delete (sum): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { 'Authorization': 'Token ' + token } 
  let value ="delete"
  return this.http.get(rmuurl + "rmuserv/product_template?action="+value+"&field_id="+sum?.id, {  'headers': headers });
}

public invalid_download(file: string): Observable<Blob> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.get(rmuurl + "rmuserv/download_invalid_data?file=" + file, { headers, responseType: 'blob' });
}

public product_mapping_remove(sum): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { 'Authorization': 'Token ' + token } 
  let value ="delete"
  return this.http.get(rmuurl + "rmuserv/box_mapping_inactive?box_id="+sum?.id, {  'headers': headers });
}

public product_file_upload (name,page): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { 'Authorization': 'Token ' + token } 
  let value ="delete"
  return this.http.get(rmuurl + "rmuserv/product_get?name="+name+'&page='+page, {  'headers': headers });
}

public check_boxselected_summary (): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = { 'Authorization': 'Token ' + token } 
  return this.http.get(rmuurl + "rmuserv/selected_column", {  'headers': headers });
}


public check_boxselected_data(Array): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.post(rmuurl + "rmuserv/selected_column" , Array, {  'headers': headers });
}

public deletermuseletedvalue(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token } 
  return this.http.delete<any>(rmuurl + 'rmuserv/selected_column' , { 'headers': headers })
}

public archivalfileuploadfetch(product,data,box_no): Observable<any> {
  this.reset();
  let formdata=new FormData()
  formdata.append('file',data)
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.post(rmuurl + "rmuserv/upload_data?product="+product +'&is_ecf='+true+'&box_number='+box_no,formdata ,{   'headers':headers});
}

public archival_valid_search_summary(page,product_id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.get(rmuurl + "rmuserv/uploadtran_histsummary?page=" +page+"&action=summary"+'&product_id='+product_id+'&is_ecf='+true, {  'headers': headers });
}
public batch_value_generate (): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get(rmuurl + "rmuserv/batch_generation", {  'headers': headers });
}
public BatchGenerateFunc(obj): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.post(rmuurl + "rmuserv/batch_generation",obj,{  'headers': headers });
}
public GetBatch(obj,id,datas): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.get(rmuurl + "rmuserv/batch_generation?name="+obj+'&box_id='+id+'&action='+datas,{  'headers': headers });
}
public GetBatchDowload(obj): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token; 
  const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
  return this.http.get(rmuurl + "rmuserv/boxwise_download?box_id="+obj,{ 'headers': headers, responseType: 'blob' as 'json' });
}

}

