import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { ShareService } from '../ECF/share.service'
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { environment } from 'src/environments/environment'


const lcamodelUrl = environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class LcaService {

  constructor(private http: HttpClient, private ecfshareservice: ShareService, private idle: Idle) { }

  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
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
    return this.http.get<any>(lcamodelUrl + 'mstserv/categoryname_search?query=' + catkeyvalue, { 'headers': headers })
  }
  
  public getview(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === null) {
      id = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(lcamodelUrl + 'lcaserv/fetch_lcaentry/' + id, { 'headers': headers })
  }


  public getcategoryscroll(catkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (catkeyvalue === null) {
      catkeyvalue = "";
    }
    let urlvalue = lcamodelUrl + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno;
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
    return this.http.get<any>(lcamodelUrl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue, { 'headers': headers })
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

    let urlvalue = lcamodelUrl + 'mstserv/subcatname_search?category_id=' + id + '&query=' + subcatkeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(lcamodelUrl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue, { 'headers': headers })

  }

  public getbsscroll(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";

    }
    let urlvalue = lcamodelUrl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(lcamodelUrl + 'usrserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue, { 'headers': headers })
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
    let urlvalue = lcamodelUrl + 'usrserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getbranch(branchkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";

    }
    let urlvalue = lcamodelUrl + 'usrserv/search_branch?query=' + branchkeyvalue;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  lcasearch(data: any,page): Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    return this.http.post(lcamodelUrl+'lcaserv/lcaentrysearch?page='+page,data, { 'headers': header })
  }

  public downloadfile1(id) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    if (id === undefined) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(inwardUrl + "ecfserv/ecffile/" + id, { headers, responseType: 'blob' as 'json' })\
   
    window.open(lcamodelUrl + "lcaserv/fileview/"+id+"?token="+token, '_blank');
  }


  lcaapprovalsearch(data: any,page): Observable<any> {
    
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const header = { 'Authorization': 'Token ' + token }
    return this.http.post(lcamodelUrl+'lcaserv/lcaentrysearch?flag=APPROVE&page='+page,data, { 'headers': header })
  }


  public getjournalstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(lcamodelUrl + "lcaserv/get_lcamodetype", { 'headers': headers, params })
    
  }

  public getstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(lcamodelUrl + "lcaserv/get_lcastatus", { 'headers': headers, params })
    
  }
  public getdetstatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(lcamodelUrl + "lcaserv/get_lcadetailtype", { 'headers': headers, params })
    
  }

public createlca(CreateList: any,images): Observable<any> {
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
  return this.http.post<any>(lcamodelUrl + "lcaserv/createlcaentry", formData, { 'headers': headers })
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
  return this.http.get<any>(lcamodelUrl + "lcaserv/delete_lcaentry/"+id, { 'headers': headers })
  
}
public getapprover(commodityid,createdbyid,approverkeyvalue): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  
  if (commodityid === null) {
    commodityid = "";
  }
  if (createdbyid === null) {
    createdbyid = "";
  }
  if (approverkeyvalue === null) {
    approverkeyvalue = "";
  }
  let urlvalue = lcamodelUrl + 'prserv/ecf_delmatlimit?commodityid='+commodityid+'&created_by='+createdbyid+'&employee='+approverkeyvalue;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public coverNotedownload(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(lcamodelUrl + 'lcaserv/lca_covernote/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
}

public getapproverscroll(pageno,commodityid,createdbyid,branch,approverkeyvalue): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (commodityid === null) {
    commodityid = "";
  }
  if (createdbyid === null) {
    createdbyid = "";
  }
  if (approverkeyvalue === null) {
    approverkeyvalue = "";
  }
  let urlvalue
  if(branch != undefined && branch != null && branch != "")
  // + '&branch_id=' + branch
      urlvalue = lcamodelUrl + 'prserv/ecf_delmatlimit?commodityid='+commodityid+'&created_by='+createdbyid+'&employee='+approverkeyvalue+ '&page=' + pageno;
  else
      urlvalue = lcamodelUrl + 'prserv/ecf_delmatlimit?commodityid='+commodityid+'&created_by='+createdbyid+'&employee='+approverkeyvalue+ '&page=' + pageno;

  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
// urlvalue = lcamodelUrl + 'prserv/ecf_delmatlimit?commodityid='+commodityid+'&created_by='+createdbyid+'&employee='+approverkeyvalue+ '&page=' + pageno+ '&branch_id=' + branch;
public getpaymodestaus(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  return this.http.get<any>(lcamodelUrl + "lcaserv/lcapay_dropdown", { 'headers': headers, params })
  
}
public getbeneficiary(id): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (id === null) {
    id = "";
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(lcamodelUrl + 'lcaserv/lcapaymode/' + id, { 'headers': headers })
}
branchget(d:any):Observable<any> {
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  console.log(getToken)
  const header = { 'Authorization': 'Token ' + token }
  return this.http.get(lcamodelUrl+'usrserv/search_employeebranch?page=1&query='+d, { 'headers': header })
}

public creationdetails(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  return this.http.get<any>(lcamodelUrl + "lcaserv/fetch_empdetail", { 'headers': headers, params })
  
}
// public getcommodity(data): Observable<any> {
//   this.reset();
//   const getToken: any = localStorage.getItem('sessionData')
//   let tokenValue = JSON.parse(getToken);
//   let token = tokenValue.token
//   if (data === null) {
//     data = "";
//   }
//   const headers = { 'Authorization': 'Token ' + token }
//   return this.http.get<any>(lcamodelUrl + 'lcaserv/fetch_commoditylist' + data, { 'headers': headers })
// }
  public getcommodityscroll(commoditykeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (commoditykeyvalue === null) {
      commoditykeyvalue = "";

    }
    let urlvalue = lcamodelUrl + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getcommodity(commoditykeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(lcamodelUrl + 'mstserv/commoditysearch?name=' + commoditykeyvalue + '&code=', { 'headers': headers })
  }

  public getbranchscroll(branchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (branchkeyvalue === null) {
      branchkeyvalue = "";
    }
    let urlvalue = lcamodelUrl + 'usrserv/search_branch?query=' + branchkeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(lcamodelUrl + 'usrserv/memosearchemp?query='+rmkeyvalue , { 'headers': headers })
  }

  public getrmscroll(rmkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (rmkeyvalue === null) {
      rmkeyvalue = "";

    }
    let urlvalue = lcamodelUrl + 'usrserv/memosearchemp?query=' + rmkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public bretoEcfApprove(data,status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(lcamodelUrl + 'lcaserv/lcaapprove_reject?query='+status, data, { 'headers': headers })
  }

  public bretoEcfReject(data,status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(lcamodelUrl + 'lcaserv/lcaapprove_reject?query='+status, data, { 'headers': headers })
  }

  public viewfieldett(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === null) {
      id = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(lcamodelUrl + 'lcaserv/fileview/' + id, { 'headers': headers })
  }


  public viewtrans(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id === null) {
      id = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(lcamodelUrl + 'lcaserv/entry_tran/' + id, { 'headers': headers })
  }
  

  // public getassetcategorydata(data: string, page): Observable<any> {
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   // params = params.append('filter', filter);
  //   // params = params.append('sortOrder', sortOrder);
  //   // params = params.append('page', pageNumber.toString());
  //   // params = params.append('pageSize', pageSize.toString());

  //   return this.http.get<any>(faUrl + "mstserv/Apcategory_search_fa?page=" + page + "&query=" + data, { 'headers': headers });

  // }
  // public getassetcategorydata_expence(data: string, page): Observable<any> {
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   // params = params.append('filter', filter);
  //   // params = params.append('sortOrder', sortOrder);
  //   // params = params.append('page', pageNumber.toString());
  //   // params = params.append('pageSize', pageSize.toString());

  //   return this.http.get<any>(faUrl + "mstserv/Apcategory_search_faexp?page=" + page + "&query=" + data, { 'headers': headers });

  // }
  // public getassetcategorydata_sale(data: string, page): Observable<any> {
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   // params = params.append('filter', filter);
  //   // params = params.append('sortOrder', sortOrder);
  //   // params = params.append('page', pageNumber.toString());
  //   // params = params.append('pageSize', pageSize.toString());

  //   return this.http.get<any>(faUrl + "mstserv/Apcategory_search_fa_sale?page=" + page + "&query=" + data, { 'headers': headers });

  // }
  // // asset subcategory
  // public getassetsubcategoryccdata(data: string, id): Observable<any> {
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
  //   // params = params.append('filter', filter);
  //   // params = params.append('sortOrder', sortOrder);r
  //   // params = params.append('page', pageNumber.toString());
  //   // params = params.append('pageSize', pageSize.toString());
  //   return this.http.get<any>(faUrl + "mstserv/Apsubcategory_search?category_id=" + id + "&query=" + data, { 'headers': headers });

  // }

  public expencecreate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(lcamodelUrl + 'lcaserv/expensetype', data, { 'headers': headers })
  }

  public getexpence(page,data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(lcamodelUrl + 'lcaserv/searchexptype?page='+page,data, { 'headers': headers })
  }
  public dropdownget(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(lcamodelUrl + 'lcaserv/expensetypedrop', { 'headers': headers })
  }
  public expenceclmcreate(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(lcamodelUrl + 'lcaserv/expenseclmntype', data, { 'headers': headers })
  }
  public expencecolumnget(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(lcamodelUrl + 'lcaserv/expense/'+id, { 'headers': headers })
  }

  public actinactexp(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(lcamodelUrl + 'lcaserv/delete_exp/'+id, { 'headers': headers })
  }
  public actinactexpclmn(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(lcamodelUrl + 'lcaserv/delete_expclmn/'+id, { 'headers': headers })
  }
  public getexptypedropdown(data,pageNumber = 1): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    params = params.append('expense_name', data.toString());
    return this.http.post<any>(lcamodelUrl + "lcaserv/expensetypedropdown", data, { 'headers': headers})
  }


}



