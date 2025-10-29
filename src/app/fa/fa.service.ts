import { Injectable } from '@angular/core';
import { HttpClient,HttpBackend, HttpEventType, HttpEvent, HttpRequest } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { faShareService } from './share.service';
import { environment } from 'src/environments/environment';
import { data } from 'jquery';
import { catchError, map } from 'rxjs/operators';

// const faUrl = "http://34.68.45.66:9001/"
const faUrl = environment.apiURL



@Injectable({
  providedIn: 'root'
})
export class faservice {
  category_id: number;


  constructor(private httpBackend:HttpBackend,private http: HttpClient, private idle: Idle, private share: faShareService) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {

    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public getassetcategorysummary(pageNumber = 1, pageSize = 10): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/assetcat?page=" + pageNumber, { 'headers': headers })
  }

  // asset checke view
  public getassetcategorysummaryadd(d: any,page:any): Observable<any> {
    // this.reset();
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', page.toString());
    // params = params.append('pageSize', pageSize.toString());
    // return this.http.get<any>(faUrl + "faserv/assetcat?page=" + page, { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/assetchecker_view?"+d +"&page="+page, { 'headers': headers })
  }

  public getassetcategorysummaryaddgrp(d: any): Observable<any> {
    // this.reset();
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', page.toString());
    // params = params.append('pageSize', pageSize.toString());
    // return this.http.get<any>(faUrl + "faserv/assetcat?page=" + page, { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/assetchecker_view_nongrp?" + d, { 'headers': headers })
  }



  // this is bs api call
  public getassetbsdata(keyvalue, page: number): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    //  params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + 'usrserv/searchbusinesssegment?query=' + keyvalue + '&page=' + page, { 'headers': headers });
    // return this.http.post<any>(faUrl + "faserv/assetcat" ,data,{'headers':headers,'params':params });

  }
  // this is cc api call
  public getassetccdata(data: number): Observable<any> {
    console.log('d=', data)
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    let d = { 'businesssegment_id': data }
    // params = params.append('filter', filter)
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.post<any>(faUrl + "usrserv/search_ccbs", d, { 'headers': headers });

  }
  // this is assetcat branch details
  public getassetbranchdata(value: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "usrserv/search_employeebranch?query=" + value + "&page=" + page, { 'headers': headers });

  }
  // this is assetcat location
  public getassetlocationdata(data: number): Observable<any> {

    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    console.log(token)
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    let p = { "data": data }
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/assetlocation?query=" + data, { 'headers': headers });

  }
  // ap category
  public getassetcategorydata(data: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());

    return this.http.get<any>(faUrl + "mstserv/Apcategory_search_fa?page=" + page + "&query=" + data, { 'headers': headers });

  }
  public getassetcategorydata_expence(data: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());

    return this.http.get<any>(faUrl + "mstserv/Apcategory_search_faexp?page=" + page + "&query=" + data, { 'headers': headers });

  }
  public getassetcategorydata_sale(data: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());

    return this.http.get<any>(faUrl + "mstserv/Apcategory_search_fa_sale?page=" + page + "&query=" + data, { 'headers': headers });

  }
  // asset subcategory
  public getassetsubcategoryccdata(data: string, id): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);r
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "mstserv/Apsubcategory_search?category_id=" + id + "&query=" + data, { 'headers': headers });

  }


  ///newly added 10-09-2021
  public getassetfinaldata(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    console.log("service=", data);
    return this.http.post<any>(faUrl + "faserv/create_assetdetails", data, { 'headers': headers });

  }

  public search_employeebranch(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'usrserv/search_employeebranch?query=' + empkeyvalue, { 'headers': headers })
  }
  // new branch location added 
  public getassetdatalocation(data: any): Observable<any> {
    console.log('location=', data);
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.post<any>(faUrl + "faserv/assetlocation", data, { 'headers': headers });

  }
  //this is product select
  public getassetproductdata(data: string, page): Observable<any> {
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
    return this.http.get<any>(faUrl + "mstserv/product_search?page=" + page + "&query=" + data, { 'headers': headers });

  }
  public getassetproductdata_make_data(data: string, page): Observable<any> {
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
    return this.http.get<any>(faUrl + "faserv/fa_maker_make_data_product?id=" + data+"&query="+page , { 'headers': headers });

  }
  public getassetproductdata_model_data(data: string, page,pro_id): Observable<any> {
    console.log('product=', data);
    console.log(page);
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/fa_maker_model_data_product?make=" + data+"&query="+page+"&id="+pro_id , { 'headers': headers });

  }
  // this is asset subcategory select
  public getassetcategory(data: string): Observable<any> {
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
    return this.http.get<any>(faUrl + "faserv/assetcat?subcatname=" + data, { 'headers': headers });

  }


  public assetcatCreateForm(assetcatJson): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("assetcatJson", assetcatJson)
    return this.http.post<any>(faUrl + "faserv/assetcat", assetcatJson, { 'headers': headers })

  }
  public getapcat(apcatkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (apcatkeyvalue === null) {
      apcatkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = faUrl + 'mstserv/Apcategory_search?query=' + apcatkeyvalue;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    })
  }
  public getapcatt(apcatkeyvalue,page:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (apcatkeyvalue === null) {
      apcatkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = faUrl + 'faserv/assetgroup?query=' + apcatkeyvalue+"&page="+page;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    })
  }
  public getapcattreverse(apcatkeyvalue,page:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (apcatkeyvalue === null) {
      apcatkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = faUrl + 'faserv/fetch_assetgroup_id?query=' + apcatkeyvalue+"&page="+page;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    })
  }
  public getapcatid(apcatkeyvalue: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (apcatkeyvalue === null) {
      apcatkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = faUrl + 'faserv/fetch_asset_id?assetgroup_id=' + apcatkeyvalue;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    })
  }


  public getsubcat(id: number, subcatkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (subcatkeyvalue === null) {
      subcatkeyvalue = "";
      console.log('calling empty');
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.get<any>(faUrl + 'mstserv/Apsubcategory_search?category_id=' + id + '&query=' + subcatkeyvalue, { headers, params })
  }




  // return this.http.get<any>(faUrl +'mstserv/Apsubcategory_search?query='+ subcatkeyvalue +'&category_id='+id, { headers,params})

  public depCreateForm(depcatJson): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("depcatJson", depcatJson)
    return this.http.post<any>(faUrl + "faserv/depreciationsetting", depcatJson, { 'headers': headers })

  }

  public queryget(data, page, pagesize, type): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(faUrl + "faserv/faquery_get?page=" + page + "&pagesize=" + pagesize + "&type=" + type, data, { 'headers': headers })

  }

  public queryverisonget(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(faUrl + "faserv/faquery_version", { 'headers': headers })

  }

  public Assetparentchildsummary(page, type, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(faUrl + "faserv/clumbmakerparentchildget/?page=" + page + "&type=" + type, data, { 'headers': headers })

  }

  public clubmakerupdate(data, type) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(faUrl + "faserv/clubmakerupdate/?type=" + type, data, { 'headers': headers })

  }
  public clubmakerget(data, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(faUrl + "faserv/Assetclubget?page=" + page, data, { 'headers': headers })

  }
  async getchilddetails(page, parentid) {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return await this.http.get<any>(faUrl + "faserv/getparentchild/" + parentid + "?page=" + page, { 'headers': headers }).toPromise();

  }
  public subcategorysearch(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.post<any>(faUrl + "mstserv/subcategorysearch", data, { 'headers': headers })

  }

  public accounting_ddl(barcode,page:any,type:any,source:any,assetdetails_id) {
    this.reset();

    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(faUrl + "faserv/entrydetails_barcode/" + barcode+'?page='+page+'&type='+type+"&source="+source+"&assetdetails_id="+assetdetails_id, { 'headers': headers })


  }
  public accounting_ddl_expence(barcode,page:any,type:any,crnum:any) {
    this.reset();

    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(faUrl + "faserv/entrydetails_expence/" + barcode+'?page='+page+'&type='+type+'&crnum='+crnum, { 'headers': headers })


  }
  // public downloadfile(data, page, pagesize, type) {
  //   const getToken = localStorage.getItem('sessionData');
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   const headers = { 'Authorization': 'Token ' + token };
  //   console.log('dear=,', data)
  //   return this.http.post(faUrl + "faserv/faquery_get_download?page=" + page + "&pagesize=" + pagesize + "&type=" + type, data, { 'headers': headers ,responseType: 'blob' as 'json'});
  
  // }
//********************** *

public downloadfile(data, page, pagesize, type){
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    const newHttpClient = new HttpClient(this.httpBackend);
  return newHttpClient.post(faUrl + "faserv/faquery_get_download?page=" + page + "&pagesize=" + pagesize + "&type=" + type, data, { 'headers': headers })
    .pipe(
      map((response) => {
        return response;
      }),
      catchError((err, caught) => {
        console.error(err);
        throw err;
      }
      )
    )
}
public downloadfile_prepare(){
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  const newHttpClient = new HttpClient(this.httpBackend);
return newHttpClient.get(faUrl + "faserv/faquery_get_download_file" , { 'headers': headers,responseType: 'blob' as 'json' })
  // .pipe(
  //   map((response) => {
  //     return response;
  //   }),
  //   catchError((err, caught) => {
  //     console.error(err);
  //     throw err;
  //   }
  //   )
  //)
}

//****8 */
  public getsubcatid(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'mstserv/Apsubcategory', { 'headers': headers })
  }


  public getapsubcatsearch(ssubcatkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (ssubcatkeyvalue === null) {
      ssubcatkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = faUrl + 'mstserv/Apsubcat_search?query=' + ssubcatkeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  public getsummarySearch(a, b): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (a === undefined) {
      a = "";
      console.log('calling empty');
    }
    if (b === "") {
      b = "";
      console.log('calling empty');
    }
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(faUrl + 'faserv/assetcat?subcatname=' + a + '&deptype=' + b, { 'headers': headers })
  }



  public getassetlocationsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/assetlocation?page=" + pageNumber, { 'headers': headers })
  }


  public assetlocCreateForm(assetlocJson): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("assetlocJson", assetlocJson)
    return this.http.post<any>(faUrl + "faserv/assetlocation", assetlocJson, { 'headers': headers })

  }


  public getassetmakerbsummary(pageNumber = 1, pageSize = 10): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/assetcat?page=" + pageNumber, { 'headers': headers })
  }

  public getassetmakerregsummary(pageNumber = 1, pageSize = 10, dear: any): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    console.log('service=', dear);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString()); // 
    // return this.http.get<any>(faUrl + "faserv/clearingheader?" + "page=" + pageNumber + "&Doc_type=" + dear['Doc_Type'] + "&Is_Grp=" + dear['Is_Grp'], { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/clearingheader?"+ dear['page'], { 'headers': headers })
 
    }

  a: any
  public getassetmakerwbCWIPsummary(pageNumber = 1, pageSize = 10, data: any): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // return this.http.get<any>(faUrl + "faserv/clearingheader?" + "page=" + pageNumber + "&Doc_type=" + data['Doc_Type'] + "&Is_Grp=" + data['Is_Grp'], { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/clearingheader?"+ data['page'], { 'headers': headers })
  
  }
  public getassettotalcount( data: any): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(faUrl + "faserv/clearingheader?" + "page=" + pageNumber + "&Doc_type=" + data['Doc_Type'] + "&Is_Grp=" + data['Is_Grp'], { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/clearingheader_count?"+ data['page'], { 'headers': headers })
  
  }
  // [(ngModel)]="checkedValuesbuc[i]"

  public getassetmakerwbBUCsummary(pageNumber = 1, pageSize = 10, data: any): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // return this.http.get<any>(faUrl + "faserv/clearingheader?" + "page=" + pageNumber + "&Doc_type=" + data['Doc_Type'] + "&Is_Grp=" + data['Is_Grp'], { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/clearingheader?" +data['page'], { 'headers': headers })
  
  }


  public getinvoicesummary_1(pageNumber = 1, pageSize = 10): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/assetcat?page=" + pageNumber, { 'headers': headers })
  }

  public getinvoicesummary(id: any,doctype=null): Observable<any> {
    // this.reset();
    console.log('function caled');
    console.log(id)
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/clearingheaderdetails?clearing_header_id=" + id+"&doctype="+doctype, { 'headers': headers })
  }

  // Newly Added
  // Newly Added

  public getcheckersumrepost(data: any) {
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    console.log(tokenValue);
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post(faUrl + "faserv/assent" , data , { 'headers': headers })

  }

  public getcheckerapprover(data: any) {
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post(faUrl + 'faserv/assetchecker_approve' ,data, { 'headers': headers });
  }

  public getcheckerreject(data: any,reason:any) {
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get(faUrl + 'faserv/assetchecker_reject?assetdetails_id='+ data+'&reason='+reason, { 'headers': headers });
  }


  public getcpdatesummary(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    //+ page+data['assetid']+data['asset_value']+data['category']+data['branch']+data['capdate']
    return this.http.get(faUrl + 'faserv/capdatesummary?'+ data['page'] , { 'headers': headers });
  }

  public getcpdateaddsummary(data: any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get(faUrl + 'faserv/capdatemakersummary?'+data['page'], { 'headers': headers });

  }
  public getcpdateaddapprove(data: any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post(faUrl + 'faserv/capdatechangemake', data, { 'headers': headers });

  }
  public getcpdatecheckerapprove(data: any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log(data['page'])
    return this.http.get(faUrl + 'faserv/capdatechangechecksum?'+data['page'] , { 'headers': headers });

  }

  public getcpdatecheckerfinalappove(data: any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post(faUrl + 'faserv/capdatechangecheck', data, { 'headers': headers });

  }
  public getcpdatecheckerfinalreject(data: any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post(faUrl + 'faserv/capdatechangecheck', data, { 'headers': headers });

  }
  public getcpdatecheckerassetid(data: any, page) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.get(faUrl + 'faserv/assetdetails_id?page=' + page + '&query=' + data, { 'headers': headers });

  }



  public bucket(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData');
    console.log(getToken)
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'faserv/doctype', { 'headers': headers })
  }


  // public bucCreateForm(bucJson): Observable<any> {
  //   // this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   if (bucJson.doctype==="REGULAR"){
  //     bucJson.doctype.text===1
  //   }
  //   if (bucJson.doctype.text==="CWIP"){
  //     bucJson.doctype.text===2
  //   }
  //   if (bucJson.doctype.text==="BUC"){
  //     bucJson.doctype.text===3
  //   }
  //   const headers = { 'Authorization': 'Token ' + token }
  //   console.log("bucJson", bucJson)
  //   return this.http.post<any>(faUrl + "faserv/cwipgroup", bucJson, { 'headers': headers })

  // }
  buJson: any;
  public bucCreateForm(bucJson): Observable<any> {
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    if (bucJson.doctype === "REGULAR") {
      let value: any = {
        "name": bucJson.name,
        "doctype": 1,

      }
      this.buJson = value
    }
    else if (bucJson.doctype === "CWIP") {
      let value: any = {
        "name": bucJson.name,
        "doctype": 2,

      }
      this.buJson = value
    }
    else if (bucJson.doctype === "BUC") {
      let value: any = {
        "name": bucJson.name,
        "doctype": 3,

      }
      this.buJson = value;
    }

    const headers = { 'Authorization': 'Token ' + token }
    console.log("bucJson", this.buJson)
    // return this.http.post<any>(faUrl + "faserv/cwipgroup", this.buJson, { 'headers': headers })
    return this.http.post<any>(faUrl + "faserv/clearancebucket", this.buJson, { 'headers': headers })

  }


  public bucketnameSearch(bucvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'faserv/cwipgroup?query=' + bucvalue, { 'headers': headers })
  }
  bucnameJson: any
  aa: any
  public bucnameCreateForm(bucnameJson): Observable<any> {
    this.aa = this.share.checklist.value
    // this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // this.aa.push(1)

    // let value: any = {
    //   "FA_CltHeader_Updateids": this.aa,
    //   "FaClrance_GrpName": bucnameJson.bucketname,

    // }
    // this.bucnameJson = value



    const headers = { 'Authorization': 'Token ' + token }
    console.log("bucnameJson", bucnameJson)
    return this.http.post<any>(faUrl + "faserv/movetobucket", bucnameJson, { 'headers': headers })

  }

  public getassetmakersummarySearch(b, a): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (a === undefined) {
      a = "";
      console.log('calling empty');
    }
    if (b === "") {
      b = "";
      console.log('calling empty');
    }
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(faUrl + 'faserv/clearingdetails?doctype=' + 2 + '&invno=' + b + '&invdate=' + a, { 'headers': headers })
  }

  public getassetCatdata(value: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + "faserv/assetcat?subcatname=" + value + "&page=" + page, { 'headers': headers });

  }
  // pv start

  public getassetdata(value: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(faUrl+'faserv/records', { 'params': params });

  }

  public getbranchdata(value: string, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(faUrl + "faserv/fetch_branch_list?query=" + value + "&page=" + page, { 'headers': headers });

  }

  // api fa_pv_assest_search
  public getassetsearch(query): Observable<any> {
    let data: any = { 'barcode': query }
    console.log(query)
    console.log(data)
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl+'faserv/filter_records', data, { 'headers': headers });
  }

  // api fa_pv_branch_search
  public getbranchsearch(query:any, page:any): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'usrserv/search_employeebranch?page=' + page + '&query=' + query, { 'headers': headers })
  }

  // api fa_pv_branch_search
  public getbranchdosearch(query:any, page:any): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'usrserv/controlling_office_branch_do?page='+page + '&query=' + query, { 'headers': headers })
  }

  // api fa_pv_branch_search
  public getbranchpv(query:any,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl+'faserv/filter_records?page='+pageNumber+'&branch='+query, { 'headers': headers })
  }

  // api fa_pv_branch_search
  public getbranchsearchscroll(query,page): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'usrserv/search_employeebranch?page=' + page + '&query=' + query, { 'headers': headers })
  }

  // api fa_pv_branch_search
  public getbranchdosearchscroll(query,page): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'usrserv/controlling_office_branch_do?page='+page + '&query=' + query, { 'headers': headers })
  }

  // api fa_pv_getdata
  public getassetdata1(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records?page=" + pageNumber+'&init='+search, { 'headers': headers });
  }
  public getassetdata1_checker(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records_checker?page=" + pageNumber+'&init='+search, { 'headers': headers });
  }

  // api fa_pv_search
  public getassetdata2(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records?page=" + pageNumber+search, { 'headers': headers });
  }
  public getassetdata2_checker(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records_checker?page=" + pageNumber+search+'&pageSize='+pageSize, { 'headers': headers });
  }
  public pvserialno_update_reject(data): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(faUrl+"faserv/fa_asset_serialno_update_approve_reject",data, { 'headers': headers });
  }
  public fapvrecordsprepare(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records_prepare?page=" + pageNumber+search, { 'headers': headers });
  }
  public fapvrecordsprepare_checker(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records_prepare_checker?page=" + pageNumber+search, { 'headers': headers });
  }
  public fapvrecordsdownload(): Observable<any> {
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.get<any>(faUrl+"faserv/filter_records_download?page=" , { 'headers': headers,responseType:'blob' as 'json'});
  }

  public fapvrecordsdownload_checker(): Observable<any> {
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.get<any>(faUrl+"faserv/filter_records_download_checker?page=" , { 'headers': headers,responseType:'blob' as 'json'});
  }

  public fapvrecordsupload(data:any): Observable<any> {
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    // return this.http.post<any>(faUrl+"faserv/filter_records_upload",data , { 'headers': headers});
    return this.http.post<any>(faUrl+"faserv/filter_records_upload_pv",data , { 'headers': headers});

  }


  public fapvrecordsupload_checker(data:any): Observable<any> {
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(faUrl+"faserv/filter_records_upload_checker",data , { 'headers': headers});
  }

  public fa_serial_no_update(data:any): Observable<any> {
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(faUrl+"faserv/fa_asset_serialno_update",data , { 'headers': headers});
  }
  public fa_serial_no_update_checker(data:any): Observable<any> {
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(faUrl+"faserv/fa_asset_serialno_update",data , { 'headers': headers});
  }
  // api fa_pv_search
  public getassetdataedit(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/assetedit_records?page=" + pageNumber+search, { 'headers': headers });
  }

  // api fa_pv_insertdata
  public getassetsave(data: any): Observable<any> {
    // let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl+'faserv/assetupdate', data, { 'headers': headers });
  }

  //api fa_pv image
  public getassetsave1(data: any): Observable<any> {
    // let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl+'faserv/assetupdate1', data, { 'headers': headers });
  }

  // api fa_pv_insertdata
  public getassetrowsave(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/add_row', data, { 'headers': headers });
  }
  // api fa_pv_insertdata
  public getassetrowsave1(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/add_row1', data, { 'headers': headers });
  }

  // api fa_pv_insertdata
  public getassetrowupdate(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/update_pv', data, { 'headers': headers });
  }

  public getassetrowupdate1(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/update_pv1', data, { 'headers': headers });
  }

  public getasset1(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl+"faserv/assetdetails", { 'headers': headers });
  }

  // api approver_getdata
  public getapprover(pageNumber,search): Observable<any> {
    console.log('get_branch',search)
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/branchfilter?page="+ pageNumber+'&init='+search, { 'headers': headers });

  }

    // api approver_getdata
    public getapprover1(pageNumber,search): Observable<any> {
      console.log('get',search)
      let params: any = new HttpParams();
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(faUrl + "faserv/branchupdate?page="+ pageNumber+'&init='+search, { 'headers': headers });
  
    }
  

  // api save data approver
  public getapprover_data(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('fa',data)
    return this.http.post<any>(faUrl + "faserv/approver_save", data, { 'headers': headers });
  }

  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapprover(query: string,pageNumber): Observable<any> {
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/branchfilter?page='+pageNumber+'&branch='+query, {'headers': headers});
  }

    // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapprover1(query: string,pageNumber): Observable<any> {
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/branchupdate?page='+pageNumber+'&branch='+query, {'headers': headers});
  }

  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapprover2(query: string,pageNumber): Observable<any> {
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/approver_full?page='+pageNumber+'&ctrl_branch='+query, {'headers': headers});
  }

  public getbackin_pv(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/branchfilter?page=" + pageNumber+'&init='+search, { 'headers': headers });
  }

  public getbackin_DoPV(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/approver_full?page=" + pageNumber+'&ctrl_branch='+search, { 'headers': headers });
  }
  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapprover3(query: string,pageNumber): Observable<any> {
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/approver_branch?page='+pageNumber+'&ctrl_branch='+query, {'headers': headers});
  }

  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchselect(query: string,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/approver_full?page='+pageNumber+'&branch='+query, {'headers': headers});
  }
  
  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapproverbranch1(query: string,pageNumber): Observable<any> {
    console.log('second',query)
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/approver_branch?page='+pageNumber+'&branch='+query, {'headers': headers});
  }

  // api branch search
  // api fa_pv_branch_search
  public getbranchsearchapproverfull1(query: string,pageNumber): Observable<any> {
    console.log('second',query)
    this.reset();
    let data: any = { 'branch': query }
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(query)
    console.log(data)
    return this.http.get<any>(faUrl + 'faserv/approver_full?page='+pageNumber+'&branch='+query, {'headers': headers});
  }


  //api approver branch download 
  public getApproverBranchDownload():Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/branchfile_download?branch=", {'headers': headers,responseType: 'blob' as 'json'})
  }

  //api approver full download 
  public getApproverFullDownload():Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/fullfile_download?branch=", {'headers': headers,responseType: 'blob' as 'json'})
  }

  //api approver branch download 
  public getApproverBranchDownload1(data):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/branchfile_download?ctrl_branch="+data, {'headers': headers,responseType: 'blob' as 'json'})
  }

  //api approver full download 
  public getApproverFullDownload1(data):Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/fullfile_download?ctrl_branch="+data, {'headers': headers,responseType: 'blob' as 'json'})
  }
  public getassetcategorysummary1(page = 1, d: any): Observable<any> {
    // this.reset();
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', page.toString());
    // params = params.append('pageSize', pageSize.toString());
    // return this.http.get<any>(faUrl + "faserv/assetcat?page=" + page, { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/assetchecksummary?" +d['page'], { 'headers': headers })
  }
  public getassetcategorysummary1_new(page = 1, d: any): Observable<any> {
    // this.reset();
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    params = params.append('page', page.toString());
    // params = params.append('pageSize', pageSize.toString());
    // return this.http.get<any>(faUrl + "faserv/assetcat?page=" + page, { 'headers': headers })
    return this.http.get<any>(faUrl + "faserv/assetchecksummary_new?" +d['page'], { 'headers': headers })
  }
  public getassetsummarydata(data:any){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"faserv/summary_assetdetails?"+data['page'],{'headers':headers});
  };
  public getassetsuppliername(data:any,page:number){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"venserv/search_supplier_name?name="+data+"&page="+page,{'headers':headers});
  };
  public getbucketsummary(page:any,data:any){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"faserv/bucketsummary?page="+page,{'headers':headers});
  };
  public getbucketsummarydropdown(page:any,data:any,flag:any){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"faserv/buckettran_summary?page="+page+'&data='+data+'&flag='+flag,{'headers':headers});
  };
  public getbucketsummaryhistory(page:any,data:any){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"faserv/bucket_history?page="+page+'&name='+data,{'headers':headers});
  };
  public getbucketsummarydropdownexclude(page:any,data:any,exclude){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"faserv/buckettran_summary?page="+page+'&exclude='+exclude+'&data='+data,{'headers':headers});
  };
  public getbucketsummarysubmit(data:any){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.post(faUrl+"faserv/buckettran_move",data,{'headers':headers});
  };
  public getbucketsummarydropdown_search(page:any,data:any,flag:any){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"faserv/buckettran_summary?"+'data='+data+'&flag='+flag,{'headers':headers});
  };
  public getbucketsummarysearch(data:any,page:any){
    const getToken=localStorage.getItem('sessionData');
    let tokenValue=JSON.parse(getToken);
    let token=tokenValue.token;
    const headers={'Authorization': 'Token ' + token};
    return this.http.get(faUrl+"faserv/bucketnamesearch?data="+data+"&page="+page,{'headers':headers});
  };
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
    return this.http.get<any>(faUrl + "faserv/assetcat?subcatname=" + data+"&page="+page, { 'headers': headers });

  }

// -
// api depreciation_cal
public getdepreciation(pageNumber = 1, pageSize = 10):Observable<any>{
  let params: any = new HttpParams();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  params = params.append('page', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/depreciation?page="+pageNumber,{'headers':headers });
}

// api depreciation_cal_prepare
public getDepreciationPrepare(data1,data2):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
    const requestOptions: Object = {
    'from_date': data1,
    'to_date': data2,
    'calculate_for': "ALL",
    'deptype':"1"
  }
  return this.http.post<any>(faUrl + "faserv/depreciation",requestOptions,{'headers':headers });
}

 // api depreciation_cal_prepare
 public getDepreciationCal(str1,str2,radioFlag):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
    const requestOptions: Object = {
    'from_date': str1,
    'to_date': str2,
    'calculate_for': 'ALL',
    'deptype': radioFlag
  }
  console.log('download ',requestOptions);
  const httpclient=new HttpClient(this.httpBackend);
  return httpclient.post<any>(faUrl + "faserv/depreciation",requestOptions,{'headers':headers });
}

 // api depreciation_cal_Forecastexcel_prepare
 public getDepreciationForecastPrepare(year:any,month:any):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token };
  const httpclient=new HttpClient(this.httpBackend);
  return httpclient.get<any>(faUrl + "faserv/report_depreciation?year="+year+'&month='+month,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public getfagefudata(year:any,month:any,type:any):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token };
  const httpclient=new HttpClient(this.httpBackend);
  return httpclient.get<any>(faUrl + "faserv/dep_rep_download?year="+year+'&month='+month+"&type="+type,{ 'headers': headers  });
}
public getfajwdata(year:any,month:any,type:any):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token };
  const httpclient=new HttpClient(this.httpBackend);
  return httpclient.get<any>(faUrl + "faserv/dep_rep_download?year="+year+'&month='+month+"&type="+type,{ 'headers': headers  });
}
 public fareportsdownloadexcel(fromdate,todate):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.get<any>(faUrl + "faserv/dep_rep_download?fromdate="+fromdate+'&todate='+todate,{ 'headers': headers,responseType: 'blob' as 'json'  });
}

 // api depreciation_cal_Regularexcel_prepare
 public getDepreciationRegularPrepare(year:any,month:any):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/report_depreciation_regular?year="+year+'&month='+month,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public getDepreciationRegularPrepare_q(year:any,month:any,type:string):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/report_depreciation_regular?year="+year+'&month='+month+"&type="+type,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
 public fareportssummary():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/fareports",{ 'headers': headers });
}

public getassetsource():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/faquery_get_source",{ 'headers': headers });
}

//temp forecast download
 public getDepreciationTempForecastPrepare():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/temp_forecast",{ 'headers': headers,responseType: 'blob' as 'json'  });
}

//temp regular download
public getDepreciationTempRegularPrepare():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/temp_regular",{ 'headers': headers,responseType: 'blob' as 'json'  });
}

// api depreciation_cal_Forecastexcel_download
public getDepreciationForecastDownload():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/download_forecast",{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public getfadefudownloadexcel(type:any):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/fagefujwdownload?type="+type,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public getfajwdownloadexcel(type:any):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/fagefujwdownload?type="+type,{ 'headers': headers,responseType: 'blob' as 'json'  });
}

// api depreciation_cal_Regularexcel_download
public getDepreciationRegularDownload():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/download_regular",{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public getDepreciationRegularDownload_q(type:string):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/download_regular?type="+type,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public gst_Expense_reports_download(type:string):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/fa_gst_expense_reportdownload?type="+type,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public fa_min_Expense_reports_download(type:string):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/fa_minor_expense_report?type="+type,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public fa_category_change_downloads(payload):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + "faserv/catchange_downloads",payload,{ 'headers': headers,responseType: 'blob' as 'json'  });
}

public fa_Expense_reports_download(type:string):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/fa_expense_reports?type="+type,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public faquerydataforecastdownload():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/faforecastquery",{ 'headers': headers });
}
public querydatadownloadall():Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/faforecastquerydownload",{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public fardataprepareall(type:any):Observable<any>{
  console.log(type);
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/far_downloads?"+type,{ 'headers': headers  });
}
public fardatadownloadall(type:boolean):Observable<any>{
  console.log(type);
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/far_downloads?type="+type,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public assetheaderhistorymove(data:any):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(faUrl + "faserv/assetheaderhistory",data,{ 'headers': headers });
}
  //api approver branch download 
  public getAllBranchDownload():Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    let https_n=new HttpClient(this.httpBackend);
    return https_n.get<any>(faUrl + "faserv/branchfile_download_all", {'headers': headers,responseType: 'blob' as 'json'})
  }
  public getAllBranchDownload_new():Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    let https_n=new HttpClient(this.httpBackend);
    return https_n.get<any>(faUrl + "faserv/branchfile_download_all_new", {'headers': headers,responseType: 'blob' as 'json'})
  }
  public getAllDownload():Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/download_all", {'headers': headers,responseType: 'blob' as 'json'})
  }
  public getAllDownload_new():Observable<any>{
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/download_all", {'headers': headers,responseType: 'blob' as 'json'})
  }
  public getcategoryscroll(catkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    let urlvalue = faUrl + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getassetiddatalist(page:number,header_id):Observable<any>{
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/assetid?page="+page+"&header_id="+header_id,{ 'headers': headers });
  }
  public gatAccountingBarcodeList(barcode:any):Observable<any>{
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/faaccountingdata?barcode="+barcode,{ 'headers': headers });
  }
  public AccountingDetailsData(barcode:any):Observable<any>{
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/faaccountingdatalist?barcode="+barcode,{ 'headers': headers });
  }
  public AccountingDetailsDataRepost(barcode:any):Observable<any>{
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/faaccountingdatarepost?barcode="+barcode,{ 'headers': headers });
  }
  public preparefile_depreciation() {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.post(faUrl + "faserv/itdepreciation" ,{}, { 'headers': headers });
  
  }
  public Gst_expense_reports_prepare() {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.get(faUrl + "faserv/fa_gst_expense_reportprepare" , { 'headers': headers });
  
  }
  public fa_min_expense_reports_prepare() {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.get(faUrl + "faserv/fa_minor_expense_report" , { 'headers': headers });
  
  }
  public fa_expense_reports_prepare() {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.get(faUrl + "faserv/fa_expense_reports" , { 'headers': headers });
  
  }
  public fa_entry_reports_check(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.post(faUrl + "faserv/fas_entry_data_ppr",data , { 'headers': headers });
  
  }
  public Downloadfile_depreciation() {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.get(faUrl + "faserv/itdepreciation" , { 'headers': headers,responseType: 'blob' as 'json' });
  
  }
  public orm_table_list_get() {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.get(faUrl + "faserv/fa_query_update_orm?type=table" , { 'headers': headers });
  
  }
  public orm_field_list_get(name:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.get(faUrl + "faserv/fa_query_update_orm?type=field&table="+name , { 'headers': headers });
  
  }
  public orm_data_create_query(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.post(faUrl + "faserv/fa_query_update_orm",data , { 'headers': headers });
  
  }
  public orm_data_create_insert_query(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.get(faUrl + "faserv/fa_query_insert_orm?type=field&table="+data , { 'headers': headers });
  
  }
  public orm_insert_query(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.post(faUrl + "faserv/fa_query_insert_orm",data , { 'headers': headers });
  
  }
  public dump_insert_query(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.post(faUrl + "faserv/fa_query_data_dump",data , { 'headers': headers });
  
  }
  public dump_insert_query_download() {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.get(faUrl + "faserv/fa_query_data_dump" , { 'headers': headers,responseType: 'blob' as 'json' });
  
  }
  public getproductpage(pageNumber = 1, pageSize = 10,data:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams()
      .set('page', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(faUrl + 'mstserv/product?page=' + pageNumber+'&data='+data, { headers, params })
      .pipe(
        map(res => res)
      );
  }
  public asset_maker_model_check(data) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.post(faUrl + "faserv/fa_makermodel_check" , data,{ 'headers': headers });
  
  }
  public asset_specification_create(data) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    console.log('dear=,', data)
    return this.http.post(faUrl + "faserv/create_specification" , data,{ 'headers': headers });
  
  }
  public asset_specification_get(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.get(faUrl + "faserv/create_specification?name="+data ,{ 'headers': headers });
  
  }
  public make_model_fa(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.post(faUrl + "faserv/fa_makemodels_create" ,data,{ 'headers': headers });
  
  }
  public make_model_fa_summary(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.get(faUrl + "faserv/fa_makemodels_create?"+data ,{ 'headers': headers });
  
  }
  public specification_fa_summary(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.get(faUrl + "faserv/create_specification?"+data ,{ 'headers': headers });
  
  }
  public model_fa_childcreate(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.post(faUrl + "faserv/fa_makemodels_childcreate",data ,{ 'headers': headers });
  
  }
  public model_fa_childcreate_new(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.post(faUrl + "faserv/fa_makemodels_childcreate_new",data ,{ 'headers': headers });
  
  }
  public model_fa_list(page:number,data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.get(faUrl + "faserv/fa_makemodels_list?page="+page+"&data="+data ,{ 'headers': headers });
  
  }
  public model_fa_child_new(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.post(faUrl + "faserv/fa_makechild_create",data ,{ 'headers': headers });
  
  }

  public product_makedata_get(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.get(faUrl + "faserv/fa_product_model_get?id="+data ,{ 'headers': headers });
  
  }
  public product_makedata_get_spec(data:any) {
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    
    return this.http.get(faUrl + "faserv/fa_maker_make_conspec_product?id="+data ,{ 'headers': headers });
  
  }
  public faexpencedataget(d: any): Observable<any> {
    // this.reset();
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(faUrl + "faserv/faexpencedataget?"+d , { 'headers': headers })
  }
  public getqtybaseDetails(id: any,Doc_type:any,Is_Grp:any,groupno:any): Observable<any> {
   
    console.log('function caled');
    console.log(id)
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(faUrl + "faserv/qtychangeclearingdetails?id=" + id+"&Doc_type="+Doc_type+"&Is_Grp="+Is_Grp+"&groupno="+groupno, { 'headers': headers })
  }
 
  public fa_crnum_data_product(query): Observable<any> {
    
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(faUrl + "faserv/fa_crnum_product_get?"+query, { 'headers': headers })
  }
  public getExpensecheckersummary(page, d: any): Observable<any> {
    
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    
    const req = new HttpRequest('GET', faUrl + "faserv/faexpencedat_checker_summary?"+page['page'], {
      reportProgress: true,headers:headers,observe: 'events'
    },);
    // return this.http.request(req)//.pipe(
    //     map((event:HttpEvent<any>)=>{
    //       if (event.type==HttpEventType.UploadProgress){
    //         console.log( Math.round(event.loaded / event.total * 100) );
    //       }
    //       else if(event.type==HttpEventType.ResponseHeader){
    //         console.log("ASD7");
  
    //       }
    //     })
    //   );
    //##########
    return this.http.get<any>(faUrl + "faserv/faexpencedat_checker_summary?"+page['page'], { 'headers': headers,reportProgress:true,observe: 'events' })
    //.pipe(
    //   map((event:HttpEvent<any>)=>{
    //     if (event.type==HttpEventType.UploadProgress){
    //       console.log( Math.round(event.loaded / event.total * 100) );
    //     }
    //     else if(event.type==HttpEventType.ResponseHeader){
    //       console.log("ASD7");

    //     }
    //   })
    // );
      //#############
   
  }
  public fa_expence_checker_approve(query): Observable<any> {
    
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(faUrl + "faserv/faexpencedat_checker_approve_reject",query, 
    { 'headers': headers,});
    // .pipe(
    //   map((event:any)=>{
    //     if (event.type==HttpEventType.UploadProgress){
    //       console.log( Math.round(event.loaded / event.total * 100) );
    //     }
    //     else if(event.type==HttpEventType.ResponseHeader){
    //       console.log("ASD");

    //     }
    //   })
    //);
  }
  public getqtybaseDetails_submit(data:any): Observable<any> {
   
    
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(faUrl + "faserv/qtychangeclearingdetails",data, { 'headers': headers })
  }


  public getExpenseQuerysummary(page, d: any): Observable<any> {
    
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    
    const req = new HttpRequest('GET', faUrl + "faserv/faexpencedat_checker_summary?"+page['page'], {
      reportProgress: true,headers:headers,observe: 'events'
    },);
    
    return this.http.get<any>(faUrl + "faserv/faexpencedat_query_summary?"+page['page'], { 'headers': headers,reportProgress:true,observe: 'events' })
   
   
  }

  public get_fa_makemodel_create( d: any): Observable<any> {
    
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('page', page.toString());
  
    
    return this.http.post<any>(faUrl + "faserv/fa_makemodel_create",d, { 'headers': headers })
   
   
  }
  public all_get_fa_makemodel_create( d: any): Observable<any> {
    
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('page', page.toString());
  
    
    return this.http.get<any>(faUrl + "faserv/fa_makemodel_create?"+d, { 'headers': headers })
   
   
  }
  public fa_product_specificaitons_create( d: any): Observable<any> {
    
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('page', page.toString());
  
    
    return this.http.post<any>(faUrl + "faserv/fa_productspecifications_create",d, { 'headers': headers })
   
   
  }
  public fa_product_specificaitons_getall( d: any): Observable<any> {
    
    console.log('service file enter');
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('page', page.toString());
  
    
    return this.http.get<any>(faUrl + "faserv/fa_productspecifications_create?"+d, { 'headers': headers })
   
   
  }
  public Sale_history_downloads(params):Observable<any>{
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(faUrl + "faserv/asset_sale_history_download?fromdate="+fromdate+'&todate='+todate,{ 'headers': headers,responseType: 'blob' as 'json'  });
    return this.http.get<any>(faUrl + "faserv/asset_sale_history_download"+params,{ 'headers': headers,responseType: 'blob' as 'json'  });
  }
  public general_query_summary(data):Observable<any>{
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/fa_general_query?page="+data,{ 'headers': headers });
  }

public gen_querydownloadfile(){
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  const newHttpClient = new HttpClient(this.httpBackend);
  return this.http.post(faUrl + "faserv/fagenaralquery_download_file" ,{}, { 'headers': headers,responseType: 'blob' as 'json' })

}

public queryprepare_downloadfile_prepare(body): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(faUrl + "faserv/fa_general_query_download_preapre",body, { headers: headers })
}
public assetmaker_prepare(body): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(faUrl + "faserv/assetmaker_download_excelprepare",body, { headers: headers })
}
public assetmaker_downloadfile(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(faUrl + "faserv/assetmaker_download_file",{}, {'headers': headers,responseType: 'blob' as 'json'})
}
public Fa_querdownloadglbased(body): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.get<any>(faUrl + "faserv/faquery_report?type=p"+body,{ 'headers': headers,responseType: 'blob' as 'json' });

}
public split_maker_prepare(body): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(faUrl + "faserv/splitmaker_download_excelprepare",body, { headers: headers })
}
public split_maker_downloadfile(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(faUrl + "faserv/splitmaker_download_file",{}, { headers: headers })
}

public cap_maker_prepare(body): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(faUrl + "faserv/assetcapdatemaker_download_excelprepare",body, { headers: headers })
}
public cap_maker_downloadfile(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(faUrl + "faserv/assetcapdatemaker_download_file",{}, {'headers': headers,responseType: 'blob' as 'json' })
}
public fa_makerdownload(params):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/fa_maker_report"+params,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public fa_bucket_download(params):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/fa_bucket_report"+params,{ 'headers': headers,responseType: 'blob' as 'json'  });
}
public fa_checker_download(params):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/fa_checker_report"+params,{ 'headers': headers,responseType: 'blob' as 'json'  });
}

//getAllEntries
public getAllEntries(presentpage,type:any,barcode,crno): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.get<any>(faUrl + "faserv/fa_failed_entrysummary?page="+presentpage+'&type='+type+"&barcode="+barcode+'&crno='+crno,{ headers: headers })
}
public RepostEntry(type,data:any): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(faUrl + "faserv/faentry_toactivate"+type,data, { headers: headers })
}
public approvalHistory(id):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/fa_approval_history?asset_id="+id,{ 'headers': headers });
}
public farreport_download(type):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  if (type==='p' || type==='P'){
    return this.http.get<any>(faUrl + "faserv/far_report?type="+type,{ 'headers': headers });
  }
  else{
    return this.http.get<any>(faUrl + "faserv/far_report?type="+type,{ 'headers': headers,responseType: 'blob' as 'json'  });
  }
}

public form_x_report_download(data,type):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(faUrl + "faserv/from_x_or_10?from_date="+from_date + '&to_date='+to_date,{ 'headers': headers,responseType: 'blob' as 'json'  });
    if (type =='p' || type =='P'){
      return this.http.get<any>(faUrl +"faserv/from_x_or_10?"+data,{'headers':headers})
    }
    else if (type == 'd' || type == 'D'){
      return this.http.get<any>(faUrl + "faserv/from_x_or_10?type=d",{ 'headers': headers,responseType: 'blob' as 'json'  });
    }
    else{
      return this.http.get<any>(faUrl +"faserv/from_x_or_10?type=",{'headers':headers})
    }

}
public fa_bucket_delete(params):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/bucket_delete"+params,{ 'headers': headers});
}

public addition_report(params):Observable<any>{
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(faUrl + "faserv/asset_addition_report"+params,{ 'headers': headers,responseType:'blob' as 'json'});
}
 public prpoquerysummary(asset_id,branch,product,page): Observable<any>{
    const getToken = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = {'Authorization': 'Token ' + token}
    let params={'assetid':asset_id,'branch_id':branch,'product_id':product,'page':page}
    return this.http.get(faUrl + 'faserv/assetid_summary',{'headers':headers,params})
  }
  public fapvrecordspreparePV(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records_prepare_pv?page=" + pageNumber+search, { 'headers': headers });
  }
    public fapvrecordsuploadPV(data:any): Observable<any> {
    
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(faUrl+"faserv/filter_records_upload_pv",data , { 'headers': headers});
  }
    public getassetdata2PV(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records_pv?page=" + pageNumber+search, { 'headers': headers });
  }
   // api fa_pv_insertdata
  public getassetsavePV(data: any): Observable<any> {
    // let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(faUrl+'faserv/assetupdate_pv', data, { 'headers': headers });
  }
    public getassetrowsavePV(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/add_row_pv', data, { 'headers': headers });
  }
    public getassetrowsave1PV(data: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log('server',data)
    return this.http.post<any>(faUrl+'faserv/add_row1_pv', data, { 'headers': headers });
  }
    public getassetdata1PV(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/filter_records_pv?page=" + pageNumber+'&init='+search, { 'headers': headers });
  }
   public getapproverPV(pageNumber,search): Observable<any> {
    console.log('get_branch',search)
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + "faserv/branchfilter_pv?page="+ pageNumber+'&init='+search, { 'headers': headers });

  }
    public pvserialMarkYesNo(data): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(faUrl+"faserv/pv_approver_save",data, { 'headers': headers });
  }
    public getassetdata2_checkerPV(pageNumber, pageSize,search:any): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)
    params = params.append('pageSize', pageSize.toString());
    console.log(pageNumber, pageSize)

    return this.http.get<any>(faUrl+"faserv/branchfilter_pv?page=" + pageNumber+search+'&pageSize='+pageSize, { 'headers': headers });
  }
    public GetfapvrecordspreparePV(): Observable<any> {
    let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log(token)


    return this.http.post<any>(faUrl+"faserv/filter_records_prepare_pv", {}, { 'headers': headers });
  }
  
  public get_is_branch(query,page): Observable<any> {
  let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl+"faserv/get_barnch_admin?page=" + page+ '&query='+query, { 'headers': headers });
  }

  public pv_file_download(id): Observable<any> {
  let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl+"faserv/fa_doc_download/" + id, { 'headers': headers ,responseType: 'blob' as 'json'});
  }
   public fapvreport_prepare(data: any): Observable<any> {
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let params: any = new HttpParams();
      const headers = { 'Authorization': 'Token ' + token };
      return this.http.get<any>(faUrl + "faserv/pv_report?type=p"+data ,{ 'headers': headers,params });
  }
  public excelfapv(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(faUrl + "faserv/pv_report?type=d" , { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public fapvpdf(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(faUrl + "faserv/pv_done_pdf " , { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public asset_transferbranch(query,page): Observable<any> {
   let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl+"usrserv/search_employeebranch?page=" + page+ '&query='+query, { 'headers': headers });
  }
 public assetowner_employee(query,page): Observable<any> {
   let params: any = new HttpParams();
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl+"usrserv/emp_based_branch_permision?page=" + page+ '&query='+query, { 'headers': headers });
  }
  public get_productList(name): Observable<any> {
    this.reset(); 
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'mstserv/common_product_all?query=' + name, { 'headers': headers })
    }

   public itod_dropdown(name,page): Observable<any> {
    this.reset(); 
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'faserv/it_od_dropdown?query=' + name+'&page='+page, { 'headers': headers })
    }

  public get_productListdatas(name,page): Observable<any> {
    this.reset(); 
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'mstserv/common_product_all?query=' + name+'&page='+page, { 'headers': headers })
    }

  public criticality_dd(): Observable<any> {
    this.reset(); 
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(faUrl + 'faserv/criticality_dropdown', { 'headers': headers })
  }
}










