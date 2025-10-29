import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { User } from '../user'
import { environment } from 'src/environments/environment';
import { AnyCnameRecord } from 'dns';

const url = environment.apiURL
const vfmURL = environment.apiURL

@Injectable({
  providedIn: 'root'
})
export class VfmService {
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
    return this.http.post(vfmURL + 'usrserv/auth_token' + '', body, { 'headers': headers })
  }
  public getvehicleSummary(statusId,val,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + "vfmserv/vehiclemaster?status=" + statusId +"&page="+ pageNumber + val, { 'headers': headers })
  }
  public getvehicledetail(val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + 'vfmserv/vehiclemaster/'+ val, { 'headers': headers })
  }
  public getvehicledetailslist(vehicleid,val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+ vehicleid+'/assetdetails/'+val, { 'headers': headers })
  }
  public getfasttagdetailslist(val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + 'vfmserv/vehicle/vfasttag/'+val, { 'headers': headers })
  }
  public gettripdetailslist(val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + 'vfmserv/vehicle/details/'+val, { 'headers': headers })
  }
  public getinsurancedetailslist(val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + 'vfmserv/vehicle/vinsurance/'+val, { 'headers': headers })
  }
  public getclaimdetailslist(val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + 'vfmserv/claimhistory/'+val, { 'headers': headers })
  }
  public getservicedetailslist(val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + 'vfmserv/vehicle/service_history/'+val, { 'headers': headers })
  }
  public getsrundetailslist(val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + 'vfmserv/vehicle/eor/'+val, { 'headers': headers })
  }
  public createvehiclemakers(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", formData)
    return this.http.post<any>(vfmURL + "vfmserv/vehiclemaster", body, { 'headers': headers })
  }
  public createinsurancemakers(CreateList: any,vehicle): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", formData)
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/vinsurance", body, { 'headers': headers })
  }
  public createclaim(CreateList: any,vehicle): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", formData)
    return this.http.post<any>(vfmURL + "vfmserv/vinsurance/"+vehicle+"/claimhistory", body, { 'headers': headers })
  }
  public createfasttagmakers(CreateList: any,vehicle): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", formData)
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/vfasttag", body, { 'headers': headers })
  }
  public createtripmakers(CreateList: any,vehicle): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", formData)
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/details", body, { 'headers': headers })
  }
  public createservicemakers(CreateList: any,vehicle): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", formData)
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/service_history", body, { 'headers': headers })
  }
  public createrunmakers(CreateList: any,vehicle): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", formData)
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/eor", body, { 'headers': headers })
  }
  public createvehicledetailmakers(CreateList: any,vehicle): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")

    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("Body", formData)
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/assetdetails", body, { 'headers': headers })
  }
  public createdocumentmakers(CreateList: any,vehicle): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/documents", CreateList, { 'headers': headers })
  }
  public editvehiclemakers(id, tourJson): Observable<any> {
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
    return this.http.post<any>(vfmURL + "vfmserv/vehiclemaster", jsonValue, { 'headers': headers })
  }
  public editvehiclemakerdetail(vehicle,id, tourJson): Observable<any> {
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
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/assetdetails", jsonValue, { 'headers': headers })
  }
  public editclaim(id, vehicle,tourJson): Observable<any> {
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
    return this.http.post<any>(vfmURL + "vfmserv/vinsurance/"+vehicle+"/claimhistory", jsonValue, { 'headers': headers })
  }
  public editinsurancemakerdetail(vehicle,id, tourJson): Observable<any> {
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
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/vinsurance", jsonValue, { 'headers': headers })
  }
  public editfasttagmakerdetail(vehicle,id, tourJson): Observable<any> {
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
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/vfasttag", jsonValue, { 'headers': headers })
  }
  public edittripmakerdetail(vehicle,id, tourJson): Observable<any> {
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
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/details", jsonValue, { 'headers': headers })
  }
  public editservicemakerdetail(vehicle,id, tourJson): Observable<any> {
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
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/service_history", jsonValue, { 'headers': headers })
  }
  public editrunmakerdetail(vehicle,id, tourJson): Observable<any> {
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
    return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/eor", jsonValue, { 'headers': headers })
  }
  public getvendorname(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(vfmURL + "venserv/supplier_list", { 'headers': headers })
    //5015
    return this.http.get<any>(vfmURL + "venserv/supplier_gstno?query=&page=1", { 'headers': headers })

}
public getpermitlist(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + "usrserv/searchemployee", { 'headers': headers })

}
public getmonthlist(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + "vfmserv/eom_month_list", { 'headers': headers })

}
public getdept(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + "usrserv/search_deptbranch", { 'headers': headers })

}
public getdesignation(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + "usrserv/employee_details_get/"+id, { 'headers': headers })

}
public getvendorchanges(values): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
return this.http.get<any>(vfmURL + "venserv/supplier_list?query="+values , { 'headers': headers })
}
public getpermittedlist(values): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
return this.http.get<any>(vfmURL + "usrserv/searchemployee?query="+values , { 'headers': headers })
}
public getdepartmentlist(values): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
return this.http.get<any>(vfmURL + "usrserv/search_deptbranch?query="+values , { 'headers': headers })
}
public getpermitpage(page  ): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
return this.http.get<any>(vfmURL + "usrserv/searchemployee?page="+page  , { 'headers': headers })
}
public getdeptpage(page  ): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
return this.http.get<any>(vfmURL + "usrserv/search_deptbranch?page="+page  , { 'headers': headers })
}
public getvendorpage(page  ): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
return this.http.get<any>(vfmURL + "venserv/supplier_list?page="+page  , { 'headers': headers })
}
  public getbranch(deptid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + "usrserv/search_dept_branch/"+deptid, { 'headers': headers })

}
public getUsageCode(empkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (empkeyvalue === null) {
    empkeyvalue = ""; 

  }
  let urlvalue = vfmURL + 'usrserv/search_employeebranch?query=' + empkeyvalue + '&page=' + pageno;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public getasset(empkeyvalue, pageno,id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (empkeyvalue === null) {
    empkeyvalue = ""; 

  }
  let urlvalue = vfmURL + 'vfmserv/fetch_assetid/'+id+'?barcode=' + empkeyvalue + '&page=' + pageno;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public getsubcat(empkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (empkeyvalue === null) {
    empkeyvalue = ""; 

  }
  let urlvalue = vfmURL + 'mstserv/catsubsearch_credit?page=1&query=' + empkeyvalue +'&category_id=149'+ '&page=' + pageno;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public getbranchname(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + "usrserv/search_employeebranch", { 'headers': headers })
}
public getsub(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + "mstserv/catsubsearch_credit?category_id=149", { 'headers': headers })
}
public getcat(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + "mstserv/Apcategory_search?page=1&query=Vehicles", { 'headers': headers })
}
public getbarcode(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + "vfmserv/fetch_assetid/"+id, { 'headers': headers })
}
public getassetlist(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + "vfmserv/get_asset_details?barcode="+id, { 'headers': headers })
}
public getpremisedata(deptid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + "pdserv/branchwise_premise/"+deptid+"?query", { 'headers': headers })

}
public getUsage(deptid,empkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (empkeyvalue === null) {
    empkeyvalue = ""; 

  }
  let urlvalue = vfmURL + 'usrserv/search_dept_branch/'+deptid+'?query=' + empkeyvalue + '&page=' + pageno;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public getpremise(deptid,empkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (empkeyvalue === null) {
    empkeyvalue = ""; 

  }
  let urlvalue = vfmURL + 'pdserv/branchwise_premise/'+deptid+'?query=' + empkeyvalue + '&page=' + pageno;
  return this.http.get(urlvalue, {
    headers: new HttpHeaders()
      .set('Authorization', 'Token ' + token)
  }
  )
}
public getinsuranceSummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/vinsurance?page='+page, { 'headers': headers })
}
public getinsurancemodifySummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/vinsurance?page='+page+'&is_modify=1', { 'headers': headers })
}
public modify(vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/modification_request', { 'headers': headers })
}
public getclaimSummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vinsurance/'+vehicleid+'/claimhistory?page='+page, { 'headers': headers })
}
public getclaimmodifySummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vinsurance/'+vehicleid+'/claimhistory?page='+page+'&is_modify=1', { 'headers': headers })
}
public getservicedetailsummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/service_history?page='+page, { 'headers': headers })
}
public getservicedetailmodifysummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/service_history?page='+page+'&is_modify=1', { 'headers': headers })
}
public getdocumentdetailsummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/documents?page='+page, { 'headers': headers })
}
public getdocumentmodifydetailsummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/documents?page='+page+'&is_modify=1', { 'headers': headers })
}
public getrunmodifydetailsummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/eor?page='+page+'&is_modify=1', { 'headers': headers })
}
public getvehicledetailsummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/assetdetails?page='+page, { 'headers': headers })
}
public getvehicledetailmodifysummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/assetdetails?page='+page+'&is_modify=1', { 'headers': headers })
}
public getfasttagdetailsummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/vfasttag?page='+page, { 'headers': headers })
}
public getfasttagmodifysummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/vfasttag?page='+page+'&is_modify=1', { 'headers': headers })
}
public gettripdetailsummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/details?page='+page, { 'headers': headers })
}
public getrundetailsummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/eor?page='+page, { 'headers': headers })
}
public gettripmodifysummary(page,vehicleid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle/'+vehicleid+'/details?page='+page+'&is_modify=1', { 'headers': headers })
}
public documentdownload(data): Observable<any> {
  this.reset();
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(vfmURL + 'vfmserv/vehicle_doc_download?file_id='+data, { headers, responseType: 'blob' as 'json' })
}
public fileDelete(id,vehicle): Observable<any> {
  this.reset();
  let token = '';
  const getToken = localStorage.getItem("sessionData");
  if (getToken) {
    let tokenValue = JSON.parse(getToken);
    token = tokenValue.token
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.delete<any>(vfmURL + 'vfmserv/vehicle/'+vehicle+'/documents?file_id='+id, { headers })

}
public rejectvehiclemaker( approveJson,vehicle): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // let idValue = {
  // "id": id
  // }
  let jsonValue = Object.assign({}, approveJson)
  console.log("statutoryJson", JSON.stringify(jsonValue))
  return this.http.post<any>(vfmURL + "vfmserv/vehicle/"+vehicle+"/status", jsonValue, { 'headers': headers })
  }
  public getmodification(vehicleId: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(vfmURL + "vfmserv/vehicle/" + vehicleId + "/modification_view", { 'headers': headers })
  }

  //FOR VEHICLE INSUMRANCE SUMMARY DELETE 5018
  public vinsurancedlt(vehicleId: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(vfmURL + "vfmserv/vehicle/vinsurance/" + vehicleId , { 'headers': headers })
  }
  public fasttagedlt(fasttagid: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(vfmURL + "vfmserv/vehicle/vfasttag/" + fasttagid , { 'headers': headers })
  }
  // TRIP details need to change API GRT FROM DARSINI
  public tripdtllt(Tripid: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(vfmURL + "vfmserv/vehicle/trip/" + Tripid , { 'headers': headers })
  }
  //service History Delete
  public ServiceHisdlt(ServiceHisid: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(vfmURL + "vfmserv/vehicle/service_history/" + ServiceHisid , { 'headers': headers })
  }
  public assetdtldlt(assetdtldlt: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(vfmURL + "vfmserv/vehicle/vehicle_id/assetdetails/" + assetdtldlt , { 'headers': headers })
  }
  public monthlyrundlt(monthlyrundlt: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(vfmURL + "vfmserv/vehicle/eor/" + monthlyrundlt , { 'headers': headers })
  }
}

