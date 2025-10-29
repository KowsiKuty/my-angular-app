import { Injectable } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { typeSourceSpan } from '@angular/compiler';

const url = environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class PprService {
  idleState = 'Not started.';
  timedOut = false;
  constructor(private idle: Idle, private http: HttpClient) { }
  pprgetjsondata:any;

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  dynamic_tablename(schema_name,type){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      url + 'dynrepserv/scheme_tabel_summary?scheme_name='+String(schema_name)+'&type='+type+"&id="+1,{ headers: headers });
  }

  dynamic_table_column(schema_name,table_name,type){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      url + "dynrepserv/scheme_tabel_columns_summary?scheme_name="+schema_name+'&table_name='+table_name+'&type='+type+"&id="+1,{ headers: headers });
  }

  public dynamic_query_create(parms,type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.pprgetjsondata=parms
    return this.http.post<any>(url + "dynrepserv/create_query_template?type="+type,this.pprgetjsondata, { 'headers': headers })
  } 

  get_schema_names(id,type){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      url + "dynrepserv/scheme_summary?id="+id+'&type='+type+"&id="+1,{ headers: headers }      
    );
  }

  temp_summari_api(name,page){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      url + "dynrepserv/query_template_summary?page="+page+"&name="+name,{ headers: headers }      
    );
  }

  temp_query_view(id){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      url + "dynrepserv/query_execution?down_type=0"+'&id='+id,{ headers: headers }      
    );
  }

  temp_query_download(id){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      url + "dynrepserv/query_execution?down_type=1"+'&id='+id,{ headers: headers}      
    );
  }

  doc_summary(name,page){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      url + "dynrepserv/document_summary?page="+page+'&file_name='+name,{ headers: headers}      
    );
  }

  document_per_download(name){
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      url + "dynrepserv/download_document?gen_file="+name,{ headers: headers, responseType: 'blob' as 'json' }      
    );
  }

}