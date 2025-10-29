import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { Idle } from '@ng-idle/core';
import { environment } from 'src/environments/environment';
import { catchError, switchMap } from 'rxjs/operators';


const proofUrl = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class ProofingService {

  idleState = 'Not started.';
  timedOut = false;
  constructor(private idle: Idle, private http: HttpClient) { }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public testsubscribe() {
    return {}
  }

  public getProofingdata(pjson: any, accountid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let url = '';
    url = proofUrl + 'prfserv/transaction/' + accountid
    // url = proofUrl + 'prfserv/wisfin_transaction?account_number=175001100&from_date=2021-12-06&to_date=2021-12-08'
    const headers = { 'Authorization': 'Token ' + token }
    // console.log(url);
    // console.log("Body", pjson)
    return this.http.post<any>(url, pjson, { headers })
  }
  public getProofingData(pjson: any, accountid, fromdate, todate): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let url = '';
    // url = proofUrl + 'prfserv/transaction/' + accountid
    url = proofUrl + 'prfserv/wisfin_transaction?account_number=175001100&from_date=2019-01-01&to_date=2022-01-01'
    const headers = { 'Authorization': 'Token ' + token }
    // console.log(url);
    // console.log("Body", pjson)
    return this.http.post<any>(url, pjson, { headers })
  }

  public getLabel(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/label', { headers, responseType: "json" })
  }

  public mapLabelToProofData(pjson: any, Labelid: any, type: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = Labelid
    console.log('pjson1', pjson)
    console.log("maping")
    // const url=proofUrl + 'prfserv/labelassign/' + idValue + '?Type=' + type	
    let url = proofUrl + 'prfserv/assignlabel'
    if (type === 'Remove') {
      url = proofUrl + 'prfserv/labelassign/' + idValue + '?Type=' + type
    }
    if (type === 'Assgin') {
      url = proofUrl + 'prfserv/labelassign/' + idValue + '?Type=' + type
    }
    const headers = { 'Authorization': 'Token ' + token }
    // console.log(url);
    // console.log("Body", pjson)
    return this.http.post<any>(url, pjson, { headers })

  }
  // public update_remarks(pjson: any, Labelid:any): Observable<any> {	
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   // const body = JSON.stringify(CreateList)
  //   const headers = { 'Authorization': 'Token ' + token }
  //   // console.log("Body", pjson)
  //   let url=proofUrl + "prfserv/label/"+Labelid+'/description'
  //   return this.http.post<any>(url, pjson, { 'headers': headers })

  // }
  public approveService(pjson: any, status: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }

    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", pjson)
    let url = proofUrl + "prfserv/upload_process?status=" + status + '&type=Account'
    // console.log(url);
    return this.http.post<any>(url, pjson, { 'headers': headers })

  }
  public createTemplateForm(CreateList: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", body)
    return this.http.post<any>(proofUrl + "prfserv/proofingtemplate", body, { 'headers': headers })
  }

  public uploadDocument(id: any, accountid: any, upload: any,payload): Observable<any> {
    this.reset();
    let idValue = id
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let formData = new FormData();
    formData.append('file', upload);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + 'prfserv/proofingdocument/document/' + idValue + '/' + accountid +'?'+ payload, formData, { 'headers': headers })

  }
  public proofingfileuploadDocument(accountid: any, upload: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let formData = new FormData();
    formData.append('file', upload);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + 'prfserv/bulk_file_uploads' + '?template_id=' + accountid , formData, { 'headers': headers })

  }
  public fileuploadDocument(id: any, upload: any, payload: any): Observable<any> {
    this.reset();
    let idValue = id;
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
    let formData = new FormData();
    formData.append('file', upload);
    formData.append('payload', JSON.stringify(payload));
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(proofUrl + 'prfserv/proofingdocument/document/' + idValue, formData, { 'headers': headers });
}
  public fileupload( upload: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let formData = new FormData();
    formData.append('file', upload);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + 'prfserv/proofingdocument/document/' , formData, { 'headers': headers })

  }
  public excelupload(params): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/uploadsummary' + params, { 'headers': headers })

  }

  public file_upload_summary(data, pageSize): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
  
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
  
    const headers = { 'Authorization': 'Token ' + token };
  
  
    if (data !== null && data !== undefined && data !== "" && data !== 1) {
      return this.http.get<any>(proofUrl + 'prfserv/file_upload_summary' + data + "?page=" + pageSize, { headers });
    } else {
      return this.http.get<any>(proofUrl + 'prfserv/file_upload_summary'+ "?page=" + pageSize, { headers });
    }
    

  }
  public get_uploaddata(accountid: any): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/upload_viewdata/' + accountid, { 'headers': headers })
  }

  public uploadPreview(id: any): Observable<any> {
    let idValue = id
    let token = ''
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/proofingdocument/' + idValue, { headers, responseType: 'blob' as 'json' })

  }


  public getTemplateDD(): Observable<any> {
    this.reset();
    let token = ''
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    // console.log('token',token)
    return this.http.get<any>(proofUrl + 'prfserv/template', { headers, responseType: "json" });
  }

  public getAccount_List(): Observable<any> {
    this.reset();
    let token = ''
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/accounts?page=1', { headers, responseType: "json" })
  }


  public proofingLabelSort(fromdate, todate, type, accountid) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }

    let json = {
      "fromdate": fromdate,
      "todate": todate
    }
    let JsonData = Object.assign({}, json)
    let jsonData = JSON.stringify(JsonData)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("balanced_transaction", jsonData)
    let url = ""
    if (type === 'All') {
      url = proofUrl + 'prfserv/balanced_transaction/' + accountid;
    }
    if (type === 'Mapped') {
      url = proofUrl + 'prfserv/balanced_transaction/' + accountid + '?type=knockup';
    }
    if (type === 'Partially Mapped') {
      url = proofUrl + 'prfserv/balanced_transaction/' + accountid + '?type=unknockup';
    }
    // console.log('proofingLabelSort', url)
    return this.http.post<any>(url, jsonData, { 'headers': headers })
  }

  public userDescription(id: any, description: any): Observable<any> {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = id;
    let value = {
      "transaction_id": [idValue]
    }
    let jsonValue = Object.assign({}, description, value)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/transaction_description", jsonValue, { 'headers': headers })
  }


  public uploadTransactionImages(id: any, transactionFile: any): Observable<any> {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = id;
    let file = transactionFile;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/transaction/" + idValue + "/transactiondocument", file, { 'headers': headers })
  }


  public transactionDownload(id: any): Observable<any> {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "docserv/document/download/" + idValue, { headers, responseType: 'blob' as 'json' })
  }

  public uploadLabelImages(id: any, labelFile: any): Observable<any> {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let idValue = id
    let file = labelFile
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/label/" + idValue + "/labeldocument", file, { 'headers': headers })
  }

  public labelDownload(id: any): Observable<any> {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "docserv/document/download/" + idValue, { headers, responseType: 'blob' as 'json' })
  }

  public getAccountList(filter = "", sortOrder = 'asc',page,  data, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(proofUrl + "prfserv/accounts?page="+ page + '&account_name=' + data, { 'headers': headers })
  }
  public getAccountMap(filter = "", sortOrder = 'asc',  data, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(proofUrl + "prfserv/account_map?page=" + data, { 'headers': headers })
  }
  public acctDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(proofUrl + "prfserv/accounts/" + idValue, { 'headers': headers })

  }
  public getTemplateList(filter = "", sortOrder = 'asc', data, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(proofUrl + "prfserv/template?page=" + data, { 'headers': headers })
  }
  public templateDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(proofUrl + "prfserv/template/" + idValue, { 'headers': headers })

  }
  public agingsearch(bucket_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // this.pprgetjsondata=type
    // console.log("s=>",this.pprgetjsondata)
    return this.http.get<any>(proofUrl + "prfserv/bucket_accounts?bucket_id=" + bucket_id, { 'headers': headers })
  }
  public aging(aging): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // this.pprgetjsondata=type
    // console.log("s=>",this.pprgetjsondata)
    return this.http.post<any>(proofUrl + "prfserv/proofingreport_details?flag=report", aging, { 'headers': headers })
  }
  public aging_exceldownload(from_days, to_days, params): Observable<any> {
    this.reset();

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/aging_exceldownload?from_days=" + from_days + "&to_days=" + to_days, params, { headers, responseType: 'blob' as 'json' })

  }
  public transactiondownload(id: any, type: any): Observable<any> {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/transaction_exceldownload?account_id=" + idValue, type, { headers, responseType: 'blob' as 'json' })
  }

  public getTemplateDetails(id): Observable<any> {
    this.reset();
    let token = ''
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    // console.log('token',token)
    return this.http.get<any>(proofUrl + 'prfserv/template_create?id=' + id, { 'headers': headers });
  }

  public createTemplate(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/template_create", body, { 'headers': headers })
  }

  public deletetemplate(CreateList): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/rule_create", body, { 'headers': headers })
  }

  public autoknockoff(body,date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    body.role = 1
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/transaction_knowkoff?"+date,body , { 'headers': headers })
    // return this.http.get<any>(proofUrl + "prfserv/transaction_knowkoff?role=1&account_id=14",{ 'headers': headers })
  }

  public partiallymap(partially): Observable<any>{
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/partially_suggest", partially,{ 'headers': headers })
  }

  public unmapped_ser(partially): Observable<any>{
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/unmapped_suggest", partially,{ 'headers': headers })
  }

  public mapped_ser(partially): Observable<any>{
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/autoknockoff_suggest", partially,{ 'headers': headers })
  }

  public unmap(): Observable<any>{
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/unmapped_suggest", { 'headers': headers })
  }

  public maped_afterautoknockoff(body,date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/partially_labelled_summary?role=1"+date,body, { 'headers': headers })
    // return this.http.get<any>(proofUrl + "prfserv/transaction_knowkoff?role=1&account_id=14",{ 'headers': headers })
  }

  public submitrule(data): Observable<any> {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/rule_create", data, { 'headers': headers })
  }
  public submitrulenew(data): Observable<any> {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/rulecreate_new", data, { 'headers': headers })
  }

  public getrule(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/rule_create?id=" + id, { 'headers': headers })
  }

  public getruleslist(params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/rule_summary?" + params, { 'headers': headers })
  }
  public getaccountruleslist(params,template): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/rule_summary?" + params+ "&temp_name="+ template, { 'headers': headers })
  }

  public createlable(data): Observable<any> {
    this.reset()
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/Knock_off_button", data, { 'headers': headers })
  }
  public createlablemapping(data,role): Observable<any> {
    this.reset()
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/label_create?role="+role, data, { 'headers': headers })
  }
  public getmappeddata(params) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/label_create" + params, { 'headers': headers })
}

  public createbucket(data): Observable<any> {
    this.reset()
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/bucket_create", data, { 'headers': headers })
  }
  public getbucket(id) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/bucket_create?id=" + id, { 'headers': headers })
  }
  public getbucketslist(params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/bucket_summary?" + params, { 'headers': headers })
  }
  public creatAccountForm(data: any, account_Id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    let dataToSubmit;
    if (account_Id != '') {
      let id = account_Id
      dataToSubmit = Object.assign({}, { 'id': id }, data)
    }
    else {
      dataToSubmit = data
    }

    const body = JSON.stringify(dataToSubmit)
    const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(proofUrl + 'prfserv/accounts_create', body, { 'headers': headers })
  
 
  }

  public editAccountform(account_id){
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/accounts_get?acc_id=' + account_id, { 'headers': headers })
  }
  public getTemplate(tempkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/template?query=' + tempkeyvalue, { 'headers': headers })
  }
  public getFileType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + 'prfserv/proofing_filetype', { 'headers': headers })
  }
  public dataDownload(data,params): Observable<any> {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    // const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/transaction_knowkoff?"+params,data,{ headers, responseType: 'blob' as 'json' })
  }
  public dataDownloadxl(params): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(interurl + "integrityserv/knockoff_details?id="+id+ "&download=1", { 'headers': headers, responseType: 'blob' as 'json'})
    return this.http.post<any>(proofUrl + "prfserv/report_xl?"+params,{},{ headers, responseType: 'blob' as 'json' })
  }
  public dataDownloadxl_trns(body): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(interurl + "integrityserv/knockoff_details?id="+id+ "&download=1", { 'headers': headers, responseType: 'blob' as 'json'})
    return this.http.post<any>(proofUrl + "prfserv/transaction_xl",body,{ headers, responseType: 'blob' as 'json' })
  }
  public agingreport(acc_id): Observable<any> {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    // const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/aging_report?account_id=["+acc_id+"]",{ headers})
  }

  public fetch_transactions(data): Observable<any> {
    this.reset()
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/api_fetch_trns", data, { 'headers': headers })
  }

  public fetch_balance(data): Observable<any> {
    this.reset()
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/api_fetch_clstbln", data, { 'headers': headers })
  }

  public getHistory(page, acctype): Observable<any> {
    this.reset()
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/uploadhistory?account_type="+acctype+"&page="+page,{ 'headers': headers })
  }

  public downloadExcel(acctype, accno): Observable<any>
  {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/uploadhistory_xl?account_type="+acctype+"&acount_no="+accno, { 'headers': headers, responseType: 'blob' as 'json'})


  }
  public bucketreport_dwn(data): Observable<any> {
    this.reset();

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.post<any>(proofUrl + "prfserv/bucket_download_notag",data, { 'headers': headers, responseType: 'blob' as 'json' })

  }
  public bucketreport_withgrpby(data): Observable<any> {
    this.reset();

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.post<any>(proofUrl + "prfserv/bucket_download_withtag",data, { 'headers': headers, responseType: 'blob' as 'json' })

  }

  public agingreport_download(data): Observable<any> {
    this.reset();

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.post<any>(proofUrl + "prfserv/report_download",data, { 'headers': headers, responseType: 'blob' as 'json' })

  }
  public partialreportdownload(data): Observable<any>
  {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/partiallmap_report?account_id="+data, { 'headers': headers, responseType: 'blob' as 'json'})
  }
  public PartialreportSummary(data): Observable<any>
  {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/partiallymappedsummary?page="+data, { 'headers': headers,})
  }
  public bulk_accountupload(upload): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let formData = new FormData();
    formData.append('file', upload);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + 'prfserv/excel_upload?',formData, { 'headers': headers })

  }
  public templaebaselist(id:any): Observable<any>
  {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(proofUrl + "prfserv/template_get_drop?template_id="+id, { 'headers': headers,})
  }
  public Template_ac_download(): Observable<any> {
    this.reset();

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.post<any>(proofUrl + "prfserv/proofing_account_template" ,null, { 'headers': headers, responseType: 'blob' as 'json' })

  }

  public Proofing_Transaction_report(id: string | null, download: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;

    let body = {};
    let queryParams = '';
if(download === undefined  && id !== null){
  queryParams = '?isexcel=true&table_type=TEMP';
  body = { "fileid": id };
}
else if (download === undefined ){
  queryParams = '?isexcel=true&table_type=TEMP';
}
else if (id === null && download){
  body = download;
  queryParams = '?isexcel=true&table_type=MAIN';
}
    else if (download ) {
        body = download;
        queryParams = '?isexcel=true&table_type=TEMP';
    } else if (id) {
        body = { "fileid": id };
        queryParams = '?isexcel=true&table_type=TEMP';
    }

    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(proofUrl + "prfserv/transcationsummeryreport" + queryParams, body, { headers: headers});
}



  public Proofing_gen_file(id): Observable<any> {
    this.reset();

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let body = {"fileid": id}
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.post<any>(proofUrl + "prfserv/s3_file_download",body,  { 'headers': headers, responseType: 'blob' as 'json' })

  }


  public s3summary(file,proofid){
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      if(proofid){
        return this.http.post<any>(proofUrl + "prfserv/s3_download?fileid="+ file+"&proof_temp_id="+proofid ,{},{ 'headers': headers, responseType: 'blob' as 'json' })
      }else{
        return this.http.post<any>(proofUrl + "prfserv/s3_download?fileid="+ file ,{},{ 'headers': headers, responseType: 'blob' as 'json' })
      }
     

  }
  public upload_multipleacc_Document(params,data,upload): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    // let dict:any=Object.assign({}, data)
    let formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append('file',upload);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + 'prfserv/proofingdocument_bulk_upload?'+params,formData,{ headers: headers})

  }
  // uploadDocument
  public summaryreferesh(id,page): Observable<any> {
    this.reset();
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data={
          id:id
    }
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.get<any>(proofUrl + "prfserv/file_upload_summery?account_id="+id +'&page='+page, { 'headers': headers})

  }
  public connection_uploadDocument( upload: any,data:any): Observable<any> {
    this.reset();
    // let idValue = id
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let formData = new FormData();
    formData.append("data", JSON.stringify(data));

    formData.append('file', upload);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + 'prfserv/ppx_liquidation_upload', formData, { 'headers': headers })

  }
  
  public connection_map(data,id){
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let st=JSON.stringify(data)
    return this.http.post<any>(proofUrl + "prfserv/connection_mapping?proof_temp_id="+id,st,{ 'headers': headers })

}
public fa_connection_map(data,id){
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let st=JSON.stringify(data)
  return this.http.post<any>(proofUrl + "prfserv/bucket_mapping?proof_temp_id="+id,st,{ 'headers': headers })

}

public fa_maker_connection_map(famakedata,id){
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let fa_maker=JSON.stringify(famakedata)
  return this.http.post<any>(proofUrl + "prfserv/Fa_Maker?proof_temp_id="+id,fa_maker,{ 'headers': headers })

}

public fa_checker_connection_map(facheckdata,id){
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let fa_checker=JSON.stringify(facheckdata)
  return this.http.post<any>(proofUrl + "prfserv/Fa_Checker?proof_temp_id="+id,fa_checker,{ 'headers': headers })
}
public verifyfilesummary(file): Observable<any> {
  this.reset()
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  let data={
    "ids":file
}
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(proofUrl + "prfserv/upload_verification_process", data, { 'headers': headers })
}

public movefilesummary(move): Observable<any> {
  this.reset()
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  let data={
    "ids":move
}
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(proofUrl + "prfserv/account_info_move_main", data, { 'headers': headers })
}

public unmapped_sum(unmapped){
  this.reset()
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  let data={
    "label_id":unmapped
}
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(proofUrl + "prfserv/label_create_remove", data, { 'headers': headers })
}

public sum_of_amount(data): Observable<any> {
  this.reset()
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }

  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(proofUrl + "prfserv/display_account_status", data, { 'headers': headers })
}

public pattern_suggestion(data){
  this.reset()
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }

  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(proofUrl + "prfserv/newunmapped_suggest", data, { 'headers': headers })
}

public rule_updatefun(page,ruleid){
  this.reset()
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(proofUrl + "prfserv/rule_mapping?page=" + page + "&account_id="+ ruleid,{},{ 'headers': headers })
}

public proofing_creation(data): Observable<any> {
  this.reset()
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(proofUrl + "prfserv/proofing_file_summary", data, { 'headers': headers })
}
public changeproofing_status(id: number,status): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let idValue = id;
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.delete<any>(proofUrl + "prfserv/proofing_file_summary?id="+id+"&status="+status, { 'headers': headers })

}


public file_submit(temp): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    if (!temp) {
      console.log("Error in file");
    }
    let temp_files: File = temp
    let formData = new FormData();
    // formData.append('data', additionalData)
    formData.append('file', temp_files);
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(proofUrl + 'prfserv/get_col_headers', formData, { headers });
  }
  public deletefile(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(proofUrl + "prfserv/file_upload_summary?file_id="+id, { 'headers': headers })
  
  }
  public new_file_upload_summary(data, pageSize,id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
  
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token;
    }
  
    const headers = { 'Authorization': 'Token ' + token };
  
  
    if (data !== null && data !== undefined && data !== "" && data !== 1) {
      return this.http.get<any>(proofUrl + 'prfserv/file_upload_summary?page=' + pageSize +"&proof_temp_id="+id+data, { headers });
    } else {
      return this.http.get<any>(proofUrl + 'prfserv/file_upload_summary'+ "?page=" + pageSize +"&proof_temp_id="+id, { headers });
    }
    

  }
  public new_proofing_fileupload (data,proofid): Observable<any> {
    this.reset()
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/transcationsummeryreport?isexcel=true&table_type=MAIN&proof_temp_id="+proofid, data, { 'headers': headers })
  }
  public new_connection_uploadDocument( upload: any,data:any,id,gl_no): Observable<any> {
    this.reset();
    // let idValue = id
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let formData = new FormData();
    formData.append("data", JSON.stringify(data));

    formData.append('file', upload);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + 'prfserv/ppx_liquidation_upload?proof_temp_id='+id + '&gl_no=' + gl_no, formData, { 'headers': headers })

  }
  public new_Proofing_gen_file(id,proofid): Observable<any> {
    this.reset();

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let body = {"fileid": id}
    const headers = { 'Authorization': 'Token ' + token }
   
    return this.http.post<any>(proofUrl + "prfserv/s3_file_download?proof_temp_id="+proofid,body,  { 'headers': headers, responseType: 'blob' as 'json' })

  }
  public new_proofingfileuploadDocument(accountid: any, upload: any,proofid,temp_acc_id): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let formData = new FormData();
    formData.append('file', upload);
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + 'prfserv/bulk_file_uploads' + '?template_id=' + accountid+'&proof_temp_id='+proofid+'&account_id='+temp_acc_id , formData, { 'headers': headers })

  }
  public new_verifyfilesummary(file,proofid): Observable<any> {
    this.reset()
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let data={
      "ids":file
  }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/upload_verification_process?proofing_temp_id="+proofid, data, { 'headers': headers })
  }
  public new_movefilesummary(move,proofid): Observable<any> {
    this.reset()
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let data={
      "ids":move
  }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(proofUrl + "prfserv/account_info_move_main?proofing_temp_id="+proofid, data, { 'headers': headers })
  }
  }

