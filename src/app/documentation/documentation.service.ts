import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { map } from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


const DocUrl = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {

  test: any;
  constructor(private http: HttpClient, private idle: Idle,) { }
  grnADDJson: any
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getpdfSG(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DocUrl + "sgserv/sg_usermanual", { headers, responseType: 'blob' as 'json' })
  }


  public getpdflos(): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    //const idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DocUrl + "dtpcserv/dtpc_usermanual", { headers, responseType: 'blob' as 'json' })
  }

  public setpdflos(images){
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
    return this.http.post<any>(DocUrl + "dtpcserv/dtpc_usermanual",formData, { 'headers': headers })
  }

  public getModulesList(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DocUrl + "usrserv/usermodule", { 'headers': headers })
  }
  
  
  public uploadpdf(CreateList,images){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let formData = new FormData();
    let obj = Object.assign({}, CreateList)
      formData.append('params', JSON.stringify(obj));
      if (images !==null){
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }}
    // console.log("formdata",formData)
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(DocUrl + "docserv/document_manual",formData, { 'headers': headers })
  }

  public deleteupload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DocUrl + "docserv/docdelete/" + id, { 'headers': headers })
  }


  public downloadfile(fileid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    if (fileid === undefined) {
      fileid = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DocUrl + "docserv/docfile/"+fileid, { headers, responseType: 'blob' as 'json' })
  }

  public getEmployeeFilter(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(DocUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

  docuploadSearch(CreateList: any,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(DocUrl + "docserv/docsearch?page="+pageno, CreateList, { 'headers': headers })
  }






}
