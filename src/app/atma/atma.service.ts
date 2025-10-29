import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { EMPTY, Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

const atmaUrl = environment.apiURL
@Injectable({
  providedIn: 'root'
})
export class AtmaService {
  users;
  idleState = 'Not started.';
  timedOut = false;
  taxJson: any;
  constructor(private http: HttpClient, private idle: Idle, ) { }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  public taxCreateForm(taxJsonValue: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (taxJsonValue.pay_receivable === "Payable") {
    //   let value: any = {
    //     "code": taxJsonValue.code,
    //     "name": taxJsonValue.name,
    //     "receivable": "False",
    //     "payable": "True",
    //     "glno": taxJsonValue.glno
    //   }
    //   this.taxJson = value
    // } else if (taxJsonValue.pay_receivable === "Receivable") {
    //   let value: any = {
    //     "code": taxJsonValue.code,
    //     "name": taxJsonValue.name,
    //     "receivable": "True",
    //     "payable": "False",
    //     "glno": taxJsonValue.glno
    //   }
    //   this.taxJson = value
    // }
    // console.log("taxCreaForm", this.taxJson)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "mstserv/tax", taxJsonValue, { 'headers': headers })
  }

  public taxEditCreateForm(id, taxJsonValue: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (taxJsonValue.pay_receivable === "payable") {
      let value: any = {
        "code": taxJsonValue.code,
        "name": taxJsonValue.name,
        "receivable": "False",
        "payable": "True",
        "glno": taxJsonValue.glno,
        "id": id
      }
      this.taxJson = value
    } else if (taxJsonValue.pay_receivable === "receivable") {
      let value: any = {
        "code": taxJsonValue.code,
        "name": taxJsonValue.name,
        "receivable": "True",
        "payable": "False",
        "glno": taxJsonValue.glno,
        "id": id
      }
      this.taxJson = value
    }
    console.log("taxCreaEDIForm", JSON.stringify(this.taxJson))
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "mstserv/tax", this.taxJson, { 'headers': headers })
  }

  public getTax(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(atmaUrl + "mstserv/tax?page=" + pageNumber+'&data='+filter, { 'headers': headers })
  }

  public getpaymentsummary(pageNumber = 1, pageSize = 10, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());

    console.log(params);
    console.log(headers);
    return this.http.get<any>(atmaUrl + "venserv/branch/" + id + "/payment", { 'headers': headers, params })
  }



  public deletebranchform(id: number, mainbid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(atmaUrl + "venserv/branch/" + mainbid + "/payment/" + idValue, { 'headers': headers })
  }

  public subTaxCreateForm(subTaxJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("SUbTaxJson", subTaxJson)
    return this.http.post<any>(atmaUrl + "mstserv/subtax", subTaxJson, { 'headers': headers })

  }

  public subTaxEditForm(id, subTaxJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id
    }
    let jsonValue = Object.assign({}, idValue, subTaxJson)
    console.log("SUbTaxJssssssssssessssson", JSON.stringify(jsonValue))
    return this.http.post<any>(atmaUrl + "mstserv/subtax", jsonValue, { 'headers': headers })
  }

  public getSubTax(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(atmaUrl + "mstserv/subtax?page=" + pageNumber, { 'headers': headers })
  }

  public SubTaxsummary(page,name:any,code:any,status:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/subtaxsummary?name=" +name+ "&code="+code+ "&status="+status, { 'headers': headers,params })
  }

  public taxRateCreateForm(taxRateJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("SUbTaxtaxRateJsonJson", taxRateJson)
    return this.http.post<any>(atmaUrl + "mstserv/taxrate", taxRateJson, { 'headers': headers })
  }

  public taxRateEdit(id, taxRateJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id
    }
    let jsonValue = Object.assign({}, idValue, taxRateJson)
    console.log("SUbTaxtaxRateJsonJson", JSON.stringify(jsonValue))
    return this.http.post<any>(atmaUrl + "mstserv/taxrate", jsonValue, { 'headers': headers })
  }

  public getTaxRate(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(atmaUrl + "mstserv/taxrate?page=" + pageNumber, { 'headers': headers })
  }

  public getTaxRatesummary(page,name:any,code:any,status:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/taxratesummary?name="+name+ "&code="+code+ "&status=" +status , { 'headers': headers,params })
  }  

  public createBankForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(atmaUrl + "mstserv/bank", body, { 'headers': headers })
  }
   public getBankList(page,name:any,code:any,status:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/banksummary?name="+name+"&code="+code+"&status="+status, { 'headers': headers,params })
  }

  public getBankSearch(bankkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/bank_search?query=' + bankkeyvalue, { 'headers': headers })
  }
  public supplierbranch(bankkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'usrserv/searchdepartment?query=' + bankkeyvalue, { 'headers': headers })
  }
  //9331
  public supplierbranchreport(bankkeyvalue,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'usrserv/get_departmentname?query=' + bankkeyvalue +'&page='+page, { 'headers': headers })
  }
//   public getip(): Observable<any> {
//     this.reset();
//     const getToken = localStorage.getItem("sessionData")
//     let tokenValue = JSON.parse(getToken);
//     let token = tokenValue.token
//     const headers = { 'Authorization': 'Token ' + token }
//     return this.http.get<any>(atmaUrl + 'venserv/getip' , { 'headers': headers })
//   }
//   public login_status(): Observable<any> {
//     const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
// return this.http.get('https://ifconfig.me/forwarded',{ headers, responseType: 'text'});
     
    
//   }

  // bankdropdown
  public bankdropdown(query): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/bank_search?query=" + query, { 'headers': headers })
  }
  public getIFSCcode(ifsc: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (ifsc == null || ifsc == '') {
      ifsc = "''"
    }
    return this.http.get<any>(atmaUrl + 'venserv/validate?type=ifsc&value=' + ifsc, { 'headers': headers })
  }
  public bankEditForm(data: any, id: number): Observable<any> {
    this.reset();
    console.log("bankEditForm")
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(atmaUrl + "mstserv/bank", jsonValue, { 'headers': headers })
  }
  public createpaymodeForm(CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(atmaUrl + "mstserv/paymode", body, { 'headers': headers })
  }
  public getPaymodeList(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + "mstserv/paymode?page=" + pageNumber, { 'headers': headers })
  }
  public getPaymodesummary(page,name:any,code:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/paymodesummary?name=" +name+ "&code="+code, { 'headers': headers,params })
  }
  public paymodeEditForm(data: any, id: number): Observable<any> {
    this.reset();
    console.log("paymodeEditForm")
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(atmaUrl + "mstserv/paymode", jsonValue, { 'headers': headers })
  }
  public getPinCode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/pincode_search', { 'headers': headers })
  }
  public getCity(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/new_city_search', { 'headers': headers })
  }

  public getState(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/state_search', { 'headers': headers })
  }


  public getDistrict(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/district_search', { 'headers': headers })
  }
  public branchCreateForm(branch: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(branch)
    console.log("bankbrach", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + 'mstserv/bankbranch', data, { 'headers': headers })
  }

  public getVendorSummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + 'venserv/vendor?page=' + pageNumber, { 'headers': headers })
  }

  public getVendorSearch(search,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let url=atmaUrl+'venserv/search?page='+pageNumber
    let url1=''
    if (search.gstno == null || search.gstno == '') {
      search.gstno = ""
    }else{
      url1=url1+ "&gstno=" + search.gstno 
    } 
    if (search.name == null || search.name == '') {
      search.name = ""
    } else{
      url1=url1+ "&name=" + search.name 
    } 
    if (search.panno == null || search.panno == '') {
      search.panno = ""
    }else{
      url1=url1+ "&panno=" + search.panno 
    } 
    if (search.code == null || search.code == '') {
      search.code = ""
    }else{
      url1=url1+ "&code=" + search.code 
    } 
    // console.log(search)
    if (search.classification== null || search.classification == '') {
      search.classification= ""
    }else{
      url1=url1+ "&type=" + search.classification 
    } 
    if (search.renewal_date == null || search.renewal_date == '' ) {
      search.renewal_date = ""
    }else{
      url1=url1+ "&renewal_date=" + search.renewal_date 
    } 
    if (search.rm_id == null || search.rm_id == '') {
      search.rm_id = ""
    }else{
      url1=url1+ "&rm_id=" + search.rm_id 
    } 
    if (search.vendor_status == null || search.vendor_status == '') {
      search.vendor_status = ""
    }else{
      url1=url1+ "&vendor_status=" + search.vendor_status 
    } 
    //BUG ID:7023

    if (search.vendorstatus == null || search.vendorstatus == '') {
      search.vendorstatus = ""
    }else{
      url1=url1+ "&supplierprocess=" + search.vendorstatus
    } 
    //7023

    //BUG ID:7009

    if (search.GST_status == null || search.GST_status == '') {
      search.GST_status = ""
    }else{
      url1=url1+ "&composite=" + search.GST_status 
    } 
    //7009
    if(search.code!=''|| search.name!=''
    ||search.vendor_status!=''||search.rm_id!=''|| search.renewal_date!=''||search.classification!=''
    ||search.panno!=''||search.gstno!='' || search.GST_status!='' || search.vendorstatus!=''){


      url=url+"&name1=1"
    }
      url=url+url1


      // console.log(url);
      
      return this.http.get<any>(url,{ 'headers': headers })

      //   return this.http.get<any>(atmaUrl + 'venserv/search?name=' + search.name + "&panno=" +

      // search.panno + "&gstno=" + search.gstno + '&code='+ search.code + "&type="+search.classification +"&renewal_date="+search.renewal_date+"&rm_id="+search.rm_id+"&vendor_status="+ search.vendor_status, { 'headers': headers })
  }

  public contractorCreateForm(vendorId, contractorJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("contractorCreateForm", JSON.stringify(contractorJson))
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/contractor", contractorJson, { 'headers': headers })
  }

  public contractorEdit(id, vendorId, contractorJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("contractorCreateForm", contractorJson)
    let idValue = {
      "id": id
    }
    let contractorJsonValue = Object.assign({}, idValue, contractorJson)
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/contractor", contractorJsonValue, { 'headers': headers })
  }

  public clientCreateForm(vendorId, clientJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("clientCreateForm", JSON.stringify(clientJson))
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/client", clientJson, { 'headers': headers })
  }

  public clientEditForm(id, vendorId, clientJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id
    }
    let clientEditJson = Object.assign({}, idValue, clientJson)
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/client", clientEditJson, { 'headers': headers })
  }

  public branchFormCreate(vendorId, branchJson, ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    console.log("AL", JSON.stringify(branchJson))
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/branch", branchJson, { 'headers': headers })
  }
  public gstduplicationstatewise(vendorId, branchJson, ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    console.log("AL", JSON.stringify(branchJson))
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/gstnumbercheck", branchJson, { 'headers': headers })
  }

  public branchEditForm(id, vendorId, branchJson, ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let idValue = {
      "id": id
    }
    let branchEditJson = Object.assign({}, idValue, branchJson)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/branch", branchEditJson, { 'headers': headers })
  }

  public productCreateForm(vendorId, productJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("clientCreateForm", JSON.stringify(productJson))
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/product", productJson, { 'headers': headers })
  }

  public productEditForm(id, vendorId, productJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id
    }
    let productEditjson = Object.assign({}, idValue, productJson)
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/product", productEditjson, { 'headers': headers })
  }

  public getDesignation(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/designation', { 'headers': headers })
  }
  public getContactType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/contacttype', { 'headers': headers })
  }

  public getVendorViewDetails(vendorId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId, { 'headers': headers })
  }
  public getmodificationDetails(modificationId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + modificationId + "/modication_view", { 'headers': headers })
  }

  public getBranch(vendorId, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + "/branch?page=" + pageNumber, { 'headers': headers })
  }

  public getClient(vendorId, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + "/client?page=" + pageNumber, { 'headers': headers })
  }

  public getProduct(vendorId, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + "/product?page=" + pageNumber, { 'headers': headers })
  }

  public getContractor(vendorId, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + "/contractor?page=" + pageNumber, { 'headers': headers })
  }

  public getBankbranchList(page,name:any,code:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/bank_branch_summary?name=" +name+ "&code=" +code , { headers, params })
  }

  public getriskcat(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + "mstserv/riskcategory?page=" + pageNumber, { 'headers' :headers })
  }
  

  public riskadd(Id, name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("clientCreateForm", JSON.stringify(name))
        if(Id=="" || Id==undefined || Id==null ){
          return this.http.post<any>(atmaUrl + "mstserv/riskcategory",name , { 'headers': headers })

        }
        else{
          return this.http.post<any>(atmaUrl + "mstserv/riskcategory" ,name, { 'headers': headers })

        }

  }
  public riskDelete(Id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = Id
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(atmaUrl + "mstserv/riskcategory/" + idValue, { 'headers': headers })
  }
  public get_singleBankBranch(bankBranchId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = bankBranchId
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/bankbranch/" + idValue, { 'headers': headers })
  }
  public get_singleproduct(vendorId, productId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = productId
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + "/product/" + idValue, { 'headers': headers })
  }
  //branchdropdown
  public branchdropdown(id, query,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.get<any>(atmaUrl + "mstserv/ifsc?bank_id=" + id + "&query=" + query, { headers, params })
  }
  public customercategory_searchfilter(query,code): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.get<any>(atmaUrl + "mstserv/get_customer_category_name_code?" + "query=" + query + "&code="+code, { headers, params })
  }
  public apcategory_searchfilter(query): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.get<any>(atmaUrl + "mstserv/categoryname_search?"+ "&query=" + query, { headers, params })
  }
  public prodcategory_searchfilter(code,name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.get<any>(atmaUrl + "mstserv/get_pdcat_name_code?query=" + name+  "&code="+code, { headers, params })
  }
  public editbranchForm(data: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("branchEdit", body)
    return this.http.post<any>(atmaUrl + 'mstserv/bankbranch', jsonValue, { 'headers': headers })
  }

  public getComposite(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/composite', { 'headers': headers })
  }
  public getGroup(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/group', { 'headers': headers })
  }
  public getCustCategory(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/customercategory', { 'headers': headers })
  }
  public getClassification(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/type', { 'headers': headers })
  }
  //risk category
  public getriskcategory(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/risktype', { 'headers': headers })
  }
  
  public getType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/classification', { 'headers': headers })
  }
  public getOrgType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/org_type', { 'headers': headers })
  }
  public getEmployee(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'usrserv/employee', { 'headers': headers })
  }
  public vendorCreateForm(vendor: any, name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(vendor)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    let directorName = {
      "director": name
    }
    let Json = Object.assign({}, directorName, vendor)
    let formData = new FormData();
    formData.append("data", JSON.stringify(Json))
    return this.http.post<any>(atmaUrl + "venserv/vendor", formData, { 'headers': headers })
  }
  async  getVendorPanNumber(pan: any)  {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (pan == null || pan == '') {
      pan = "''"
    }
    const res:any= await this.http.get<any>(atmaUrl + 'venserv/validate?type=pan&value=' + pan, { 'headers': headers }).toPromise();
    this.users= res
    return this.users  }

    async getVendorGstNumber(gstno: any) {
      this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (gstno == null || gstno == '') {
      gstno = "''"
    }
    const res:any= await this.http.get<any>(atmaUrl + 'venserv/validate?type=gst&value=' + gstno, { 'headers': headers }).toPromise();
    this.users= res
 
    return this.users
 
  }
  async ifscodevalidation(ifsc: any) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (ifsc == null || ifsc == '') {
      ifsc = "''"
    }
    const res:any= await this.http.get<any>(atmaUrl + 'venserv/validate?type=ifsc&value=' + ifsc, { 'headers': headers }).toPromise();
    this.users= res
 
    return res
 
  }

  async  getempmobiedata(empid: any)  {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // if (pan == null || pan == '') {
    //   pan = "''"
    // }
    const res:any= await this.http.get<any>(atmaUrl + 'usrserv/employeemobileno/' + empid, { 'headers': headers }).toPromise();
    this.users= res
 
    return this.users  }

  public getVendor(vendorId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId, { 'headers': headers })
  }
  public getSingleBranch(vendorId, branchId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + '/branch/' + branchId, { 'headers': headers })
  }
  public editVendorForm(data: any, id: number, name): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let directorName = {
      "director": name
    }
    let jsonValue = Object.assign({}, data, value, directorName)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("vendorEdit", jsonValue)
    let formData = new FormData();
    formData.append("data", JSON.stringify(jsonValue))
    return this.http.post<any>(atmaUrl + 'venserv/vendor', formData, { 'headers': headers })
  }
  public branchActivityCreateForm(branchId, branchActivity, ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    console.log("branchacty", JSON.stringify(branchActivity))
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "venserv/branch/" + branchId + "/activity", branchActivity, { 'headers': headers })
  }
  public mobiledatapost(mobiledata ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // console.log("branchacty", JSON.stringify(branchActivity))
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "usrserv/employeemobileno", mobiledata, { 'headers': headers })
  }
  public getCustomerCategory(pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    console.log(params);
    console.log(headers);
    return this.http.get<any>(atmaUrl + "mstserv/customercategory", { 'headers': headers, params })
  }

  public customerCatCreateForm(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "mstserv/customercategory", data, { 'headers': headers })
  }

  public getCustomerCatEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/customercategory/' + idValue, { headers })
  }
  public editCustomerCatEdit(data: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("editCustomerCatEdit", body)
    return this.http.post<any>(atmaUrl + 'mstserv/customercategory', jsonValue, { 'headers': headers })
  }

  public getProductCategory(pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    console.log(params);
    console.log(headers);
    return this.http.get<any>(atmaUrl + "mstserv/pdtcat", { 'headers': headers, params })
  }
  public ProductCategorysummary(page,name:any,code:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    console.log(params);
    console.log(headers);
    return this.http.get<any>(atmaUrl + "mstserv/pdcatsummary?name="+name+ "&code="+code, { 'headers': headers, params })
  }


  public getproductcategory(prodkey:any='',page=1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params:any =new HttpParams();
    params=params.append('page',page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/pdcat_list?query="+prodkey, { 'headers': headers,params })
  }

  public getBracnhPanNumber(pan: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (pan == null || pan == '') {
      pan = "''"
    }
    return this.http.get<any>(atmaUrl + 'venserv/validate?type=pan&value=' + pan, { 'headers': headers })
  }

  public branchViewDetails(vendorId, branchViewId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'venserv/vendor/' + vendorId + '/branch/' + branchViewId, { 'headers': headers })
  }
  public productCatCreateForm(productCatJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("productCatJson", productCatJson)
    return this.http.post<any>(atmaUrl + "mstserv/pdtcat", productCatJson, { 'headers': headers })
  }
  public getproductCatEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/pdtcat/' + idValue, { headers })
  }

  public editProductCatEdit(data: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("editProductCatEdit", body)
    return this.http.post<any>(atmaUrl + 'mstserv/pdtcat', jsonValue, { 'headers': headers })
  }

  public getUom(pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    console.log(params);
    console.log(headers);
    return this.http.get<any>(atmaUrl + "mstserv/uom", { 'headers': headers, params })
  }
  public getUomsummary(page,name:any,code:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/uomsummary?name="+name+ "&code="+code, { 'headers': headers, params })
  }

  public uomCreateForm(uomJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("uomJson", uomJson)
    return this.http.post<any>(atmaUrl + "mstserv/uom", uomJson, { 'headers': headers })
  }
  public getuomEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/uom/' + idValue, { headers })
  }
  public edituomSubmitEdit(data: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("edituomsubmit", body)
    return this.http.post<any>(atmaUrl + 'mstserv/uom', jsonValue, { 'headers': headers })
  }


  public getApCategory(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(atmaUrl + "mstserv/Apcategory?page=" + pageNumber, { 'headers': headers })
  }


  public getProductType(pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/pdttype", { 'headers': headers, params })
  }
  public ProductTypesummary(page,name:any,code:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/ptypesummary?name="+name+ "&code="+code, { 'headers': headers, params })
  }

  public producttypeCreateForm(producttypeJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("producttypeJson", producttypeJson)
    return this.http.post<any>(atmaUrl + "mstserv/pdttype", producttypeJson, { 'headers': headers })
  }

  public getProductTypeEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/pdttype/' + idValue, { headers })
  }
  public ProductTypeEdit(data: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("ProductTypeEdit", body)
    return this.http.post<any>(atmaUrl + 'mstserv/pdttype', jsonValue, { 'headers': headers })
  }

  public getdoc(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/documentgroup', { 'headers': headers })
  }


  public DocGrpCreateForm(docgrpJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("productpost", docgrpJson)
    return this.http.post<any>(atmaUrl + "mstserv/documentgroup", docgrpJson, { 'headers': headers })
  }

  public sendGetRequest() {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'venserv/branch/28/suppliertax', { 'headers': headers });
  }

  public docgrpEditForm(id, docgrpJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id
    }
    let jsonValue = Object.assign({}, idValue, docgrpJson)
    console.log("docgrpedit", JSON.stringify(jsonValue))
    return this.http.post<any>(atmaUrl + "mstserv/documentgroup", jsonValue, { 'headers': headers })


  }
  public getdocgrppage(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams()
      .set('page', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + 'mstserv/documentgroup?page=' + pageNumber, { headers, params })
      .pipe(
        map(res => res)
      );
  }
  public docgrpDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(atmaUrl + "mstserv/documentgroup/" + idValue, { 'headers': headers })
  }
  public getProductmaster(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/product", { 'headers': headers })
  }
  public Productmastersummary(page,name:any,code:any,status:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params : any =new HttpParams();
    params=params.append('page' ,page.toString())
    return this.http.get<any>(atmaUrl + "mstserv/productsummary?name="+name+ "&code="+code+ "&status="+status, { 'headers': headers,params })
  }

  public ProductCreateForms(productJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("productpost", productJson)
    return this.http.post<any>(atmaUrl + "mstserv/product", productJson, { 'headers': headers })


  }
  public productmasterEditForm(id, productJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id
    }
    let jsonValue = Object.assign({}, idValue, productJson)
    console.log("productedit", JSON.stringify(jsonValue))
    return this.http.post<any>(atmaUrl + "mstserv/product", jsonValue, { 'headers': headers })

  }
  public getuom(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/uom", { 'headers': headers })
  }
  public getapcat(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/Apcategory", { 'headers': headers })
  }
  public getapcatdropdown(q): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/Apcategory_search?query=" + q, { 'headers': headers })
  }
  public getapcat_LoadMore(q, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (q === null) {
      q = "";
    }
    let urlvalue = atmaUrl + 'mstserv/Apcategory_search?query=' + q + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getapsubcat(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/Apsubcategory_search?category_id=" + id, { 'headers': headers })
  }
  public getapsubcat_tax(id,q,pgno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params ={'query':q,'page':pgno}
    return this.http.get<any>(atmaUrl + "mstserv/Apsubcategory_search?category_id=" + id, { 'headers': headers,params })
  }
  public getapsubcatdropdown(q): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/Apsubcategory_search?query=" + q , { 'headers': headers })
  }
  public getapsubcat_LoadMore(q, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (q === null) {
      q = "";
    }
    let urlvalue = atmaUrl + 'mstserv/Apsubcategory_search?query=' + q + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getapsubcatsummary(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/Apsubcategory", { 'headers': headers })
  }
  public getproductcat(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/pdtcat", { 'headers': headers })
  }
  public gethsn(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/hsn", { 'headers': headers })
  }

  public gethsnlist(pageNumber,size=10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/hsn?page=' + pageNumber, { 'headers': headers })
  }
  public gethsnsummary(page,code:any,status:any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params :any = new HttpParams();
    params= params.append('page',page.toString());
    return this.http.get<any>(atmaUrl + 'mstserv/hsnsummary?code=' +code+'&status='+status, { 'headers': headers,params })
  }
  public getBracnhGSTNo(gstno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    if (gstno == null || gstno == '') {
      gstno = "''"
    }
    return this.http.post<any>(atmaUrl + 'venserv/validate' , gstno, { 'headers': headers })
  }
  public getproducttype(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/pdttype", { 'headers': headers })
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
    return this.http.get<any>(atmaUrl + 'mstserv/product?page=' + pageNumber+'&data='+data, { headers, params })
      .pipe(
        map(res => res)
      );
  }
  public getproduct_type_new(page,data:any):Observable<any>{
    const getToken =localStorage.getItem("sessionData")
    let tokenValue =JSON.parse(getToken);
    let token=tokenValue.token;
    const headers ={'Authorization':'Token '+ token}
    return this.http.get<any>(atmaUrl+ 'mstserv/pdtclasstype?page='+page+  '&data='+data,{headers})
  
  }
  public getproducttype_data(id,data,page){
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/pdtclasstype/'+id+'?page='+page+'&data='+data,{'headers':headers});
  }
  public getproductsearch(name,code,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/get_product_name_code?query=' + name + '&code='+code+ '&page=' + pageno, { 'headers': headers })
  }
  public getprodactivelist(page=1,pagesize=10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pagesize.toString());
    return this.http.get<any>(atmaUrl + "mstserv/product_active_list??page=" + page, { 'headers': headers, params })
  }
  public getprodInactivelist(page=1,pagesize=10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pagesize.toString());
    return this.http.get<any>(atmaUrl + "mstserv/product_inactive_list??page=" + page, { 'headers': headers, params })
  }

  public productDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(atmaUrl + "mstserv/product/" + idValue, { 'headers': headers })
  }
  // branch tax create
  public branchtax_create(jsondata, filedata, branch_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let formData = new FormData();
    // formData.append("data", JSON.stringify(jsondata))
    // formData.append("file", filedata)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "venserv/branch/" + branch_id + '/suppliertax', filedata, { 'headers': headers })
    

  }
  public branchPayMentCreate(branchPayment, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("branchPayment", branchPayment)
    return this.http.post<any>(atmaUrl + "venserv/branch/" + id + "/payment", branchPayment, { 'headers': headers })
  }

  // Taxget
  public Tax_dropdownget() {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/tax', { 'headers': headers });
  }
  // SubTax_dropdownget
  public SubTax_dropdownget(id, subtaxkeyvalue) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (subtaxkeyvalue === null) {
      subtaxkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/subtax_search?tax_id=' + id + '&query=' + subtaxkeyvalue;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public subTax_dropdownscroll(id,subtaxkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (subtaxkeyvalue === null) {
      subtaxkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/subtax_search?tax_id=' + id+'&query='+subtaxkeyvalue + '&page=' + pageno;

        console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
 
  // Tax rate
  public Taxrate_dropdownget(id, taxratekeyvalue) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }


    if (taxratekeyvalue === null) {
      taxratekeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/taxrate_search?subtax_id=' + id + '&query=' + taxratekeyvalue;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
    // return this.http.get<any>(atmaUrl + 'mstserv/taxrate', { 'headers': headers });
  }

  public Taxrate_dropdownscroll(id,taxratekeyvalue,panno, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (taxratekeyvalue === null) {
      taxratekeyvalue = "";
      console.log('calling empty');
    }

    panno=(panno == '')? "false":'True'

    let urlvalue = atmaUrl + 'mstserv/taxrate_search?subtax_id=' + id+'&query='+taxratekeyvalue+'&pan_no='+panno + '&page=' + pageno;

        console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
 

  //Pagination?page=1
  public Taxsummary(pageNumber, pageSize = 10, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(atmaUrl + 'venserv/branch/' + id + '/suppliertax?page=' + pageNumber, { headers: headers })


  }
  // delete
  public Brachtaxdelete(id: Number, branchViewId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(atmaUrl + "venserv/branch/" + branchViewId + "/suppliertax/" + idValue, { 'headers': headers })
  }
  public Branchtaxeditget(id: Number, branch_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token

    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/branch/" + branch_id + "/suppliertax/" + id, { 'headers': headers })
  }

  public activityViewDetails(branchId, activityViewId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'venserv/branch/' + branchId + '/activity/' + activityViewId, { 'headers': headers })
  }
  public getActivityDetailList(activityViewId, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + "venserv/activity/" + activityViewId + "/supplieractivitydtl?page=" + pageNumber, { 'headers': headers })
  }
  public activityDetailDelete(activityId, supplierId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.delete<any>(atmaUrl + 'venserv/activity/' + activityId + '/supplieractivitydtl/' + supplierId, { 'headers': headers })
  }

  public activityDetailEditForm(id, activityId, activityDetailJson, ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let idValue = {
      "id": id
    }
    let activityDetailEditJson = Object.assign({}, idValue, activityDetailJson)
    console.log("activitydetailedit", activityDetailEditJson)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "venserv/activity/" + activityId + "/supplieractivitydtl", activityDetailEditJson, { 'headers': headers })
  }

  public activityDetailCreateForm(activityId, activityDetail, ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    console.log("activitydetail", JSON.stringify(activityDetail))
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "venserv/activity/" + activityId + "/supplieractivitydtl", activityDetail, { 'headers': headers })
  }

  public activityEditForm(id, branchId, activityJson, ): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let idValue = {
      "id": id
    }
    let activityEditJson = Object.assign({}, idValue, activityJson)
    console.log("activityedit", activityEditJson)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + "venserv/branch/" + branchId + "/activity", activityEditJson, { 'headers': headers })
  }

  public getRejected(vendorId: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + "/history", { 'headers': headers })
  }

  public rejectStatus(vendorId, remarks, vendorStatusID,reject): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let rejectValue = {
      "assign_to": 0,
      "status": vendorStatusID,
      "supplierprocess": "",
      "remarks":remarks,
      "comments":reject
    }
    let jsonValue = Object.assign({}, rejectValue)
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/status", jsonValue, { 'headers': headers })

  }


  public approverreject(vendorId, reject, vendorStatusID,remarks): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let rejectValue = {
      "assign_to": 0,
      "status": vendorStatusID,
      "supplierprocess": "",
      "remarks":remarks
    }
    let jsonValue = Object.assign({}, rejectValue, reject)
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/modification_reject", jsonValue, { 'headers': headers })

  }
  public getActivityList(branchId, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + "venserv/branch/" + branchId + "/activity?page=" + pageNumber, { 'headers': headers })
  }
  public activityDelete(branchId, activityId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.delete<any>(atmaUrl + 'venserv/branch/' + branchId + '/activity/' + activityId, { 'headers': headers })
  }
  public branchActivitySingle(branchId, activityId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(atmaUrl + 'venserv/branch/' + branchId + '/activity/' + activityId, { 'headers': headers })
  }
  public getEmployeeSearchFilter(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'usrserv/searchemployee?query=' + empkeyvalue, { 'headers': headers })
  }
  public getEmployeeSearchFilter2(empkeyvalue,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'usrserv/searchheader?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }

    public Tax_dropdownsearch(prokeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);


    let token = tokenValue.token
    if (prokeyvalue === null) {
      prokeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/tax_search?query=' + prokeyvalue;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public Tax_dropdownsearchST(prokeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);


    let token = tokenValue.token
    if (prokeyvalue === null) {
      prokeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/tax_search?query=' + prokeyvalue + '&page=' + pageno;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public Taxdropdownsearch(prokeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);


    let token = tokenValue.token
    if (prokeyvalue === null) {
      prokeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/tax_search?query=' + prokeyvalue;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  // 
  public getApSubCategory(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
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
    return this.http.get<any>(atmaUrl + "mstserv/Apsubcategory?page=" + pageNumber, { 'headers': headers })
  }
  public apCategoryCreateForm(apCategoryJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("apCategoryJson", apCategoryJson)
    return this.http.post<any>(atmaUrl + "mstserv/Apcategory", apCategoryJson, { 'headers': headers })
  }
  public apSubCategoryCreateForm(apsubCategoryJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("apsubCategoryJson", apsubCategoryJson)
    return this.http.post<any>(atmaUrl + "mstserv/Apsubcategory", apsubCategoryJson, { 'headers': headers })
  }
  1
  public getcategory(apcatkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(atmaUrl + "mstserv/Apcategory", { 'headers': headers })
    return this.http.get<any>(atmaUrl + "mstserv/Apcategory_search?query=" + apcatkeyvalue, { 'headers': headers })
  }

  public apCategoryEdit(data: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("apCategoryEdit", body)
    return this.http.post<any>(atmaUrl + 'mstserv/Apcategory', jsonValue, { 'headers': headers })
  }
  public getApCategoryEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/ap_category/' + idValue, { headers })
  }
  public apSubCategoryEdit(data: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("apSubCategoryEdit", body)
    return this.http.post<any>(atmaUrl + 'mstserv/Apsubcategory', jsonValue, { 'headers': headers })
  }
  public getApSubCategoryEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/ap_subcategory/' + idValue, { headers })
  }

  public getProductList(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/product ", { 'headers': headers })
  }
  public createCatalogForm(CreateList: any, activityDetailId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    console.log("Body", body)
    return this.http.post<any>(atmaUrl + 'venserv/supplieractivitydtl/' + activityDetailId + '/catelog', body, { 'headers': headers })
  }
  public catalogEditCreateForm(id, catalogJson, activityDetailId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id
    }
    let jsonValue = Object.assign({}, idValue, catalogJson)
    console.log("CatalogJson", JSON.stringify(jsonValue))
    return this.http.post<any>(atmaUrl + 'venserv/supplieractivitydtl/' + activityDetailId + '/catelog', jsonValue, { 'headers': headers })
  }
  public getcatalogsummary(pageNumber = 1, pageSize = 10, activityDetailId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());

    params = params.append('pageSize', pageSize.toString());
    console.log(params);
    console.log(headers);
    return this.http.get<any>(atmaUrl + 'venserv/supplieractivitydtl/' + activityDetailId + '/catelog?page=' + pageNumber, { 'headers': headers, params })
  }
  public deleteCatalogForm(id: number, activityDetailId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(atmaUrl + 'venserv/supplieractivitydtl/' + activityDetailId + '/catelog/' + idValue, { 'headers': headers })
  }
  // public getProducts1(prokeyvalue,pageno): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   if (prokeyvalue === null) {
  //     prokeyvalue = "";
  //     console.log('calling empty');
  //   }
  //   let urlvalue = atmaUrl + 'mstserv/product_search?query=' + prokeyvalue +'&page='+pageno;
  //   console.log(urlvalue)
  //   return this.http.get(urlvalue, {
  //     headers: new HttpHeaders()
  //       .set('Authorization', 'Token ' + token)
  //   }
  //   )
  // }
  public getProducts(prokeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (prokeyvalue === null) {
      prokeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/product_search?query=' + prokeyvalue
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getCatlogs(prokeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (prokeyvalue === null) {
      prokeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/categoryname_search?query=' + prokeyvalue
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  // Vendor status Filter start
  public getstatusfilter(Id: number,pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
   
    return this.http.get<any>(atmaUrl + "venserv/modification_summary?supplierprocess=" + Id+'&page='+pageNumber, { 'headers': headers })
  }
  // Vendor status Filter end
  // --changesviewstart--
  public getmodification(vendorId: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + "/modication_view", { 'headers': headers })
  }
  public getcatalogbulkmodification(branchId: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/catalog_bulk_modification/" + branchId , { 'headers': headers })
  }
  public modificationrequest(vendorId: number, status: number,remarks:any,vendor_status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + "/modification_request?supplierprocess=" + status+'&remarks='+remarks +'&vendor_status='+vendor_status, { 'headers': headers })
  }
  // ---changesviewend--
  // paymode dropdown
  public paymodedropdown(query): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/paymode_search?query=" + query, { 'headers': headers })
  }

  public getDesignationSearch(desgkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/designation_search?query=' + desgkeyvalue, { 'headers': headers })
  }
  public movetorm(vendorId,remarks, rmId, vendorStatusID,comments): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let ApproverValue = {
      
      "assign_to": rmId,
      "status": vendorStatusID,
      "supplierprocess": "",
      "remarks":remarks,
      "comments":comments
    }
    let jsonValue = Object.assign({}, ApproverValue)
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/status", jsonValue, { 'headers': headers })

  }
  public Rm(vendorId): Observable<any> {
 
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + "/vendorrm_validation",  { 'headers': headers })

  }
  public branchvalidation(vendorId): Observable<any> {
    this.reset();
 
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/" + vendorId + "/pendingbranch",  { 'headers': headers })

  }

  public modification_approve(vendorId,remarks): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let ApproverValue = {
      "remarks": remarks,
      // "comments":"Header Approve"
      "comments": "Header Approve",
      "status":5
    }
    let jsonValue = Object.assign({}, ApproverValue)
    return this.http.post<any>(atmaUrl + "venserv/vendor/" + vendorId + "/modification_approve", jsonValue, { 'headers': headers })

  }
  public getContactSearch(contactkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/contacttype_search?query=' + contactkeyvalue, { 'headers': headers })
  }
  public getCitySearch(citykeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/new_city_search?query=' + citykeyvalue, { 'headers': headers })
  }
  public getDistrictSearch(districtkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/district_search?query=' + districtkeyvalue, { 'headers': headers })
  }
  public getStateSearch(statekeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/state_search?query=' + statekeyvalue, { 'headers': headers })
  }
  public getPinCodeSearch(pincodekeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/pincode_search?query=' + pincodekeyvalue, { 'headers': headers })
  }
  public get_EmployeeName(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";
      // console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'usrserv/searchemployee?query=' + empkeyvalue + '&page=' + pageno;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  public gettransactionsummary(transactionDetail, pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + 'venserv/vendor/' + transactionDetail + '/history', { 'headers': headers, params })
  }
  public get_city(citykeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (citykeyvalue === null) {
      citykeyvalue = "";
    }
    let urlvalue = atmaUrl + 'mstserv/new_city_search?query=' + citykeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_state(statekeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (statekeyvalue === null) {
      statekeyvalue = "";
    }
    let urlvalue = atmaUrl + 'mstserv/state_search?query=' + statekeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_district(districtkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (districtkeyvalue === null) {
      districtkeyvalue = "";
    }
    let urlvalue = atmaUrl + 'mstserv/district_search?query=' + districtkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_districtValue(stateId, districtkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (districtkeyvalue === null) {
      districtkeyvalue = "";
    }
    let urlvalue = atmaUrl + 'mstserv/district_search?state_id=' + stateId +'&query=' + districtkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public districtdropdown(stateId, query): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();

    return this.http.get<any>(atmaUrl + "mstserv/district_search?state_id=" + stateId + "&query=" + query, { headers, params })
  }
  public get_cityValue(stateId, citykeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (citykeyvalue === null) {
      citykeyvalue = "";
    }
    let urlvalue = atmaUrl + 'mstserv/new_city_search?state_id=' + stateId +'&query=' + citykeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_pinCode(pincodekeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (pincodekeyvalue === null) {
      pincodekeyvalue = "";
    }
    let urlvalue = atmaUrl + 'mstserv/pincodesearch?query=' + pincodekeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_designation(dsgkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (dsgkeyvalue === null) {
      dsgkeyvalue = "";
    }
    let urlvalue = atmaUrl + 'mstserv/designation_search?query=' + dsgkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public get_productCat(pckeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (pckeyvalue === null) {
      pckeyvalue = "";
    }
    let urlvalue = atmaUrl + 'mstserv/productcat_search?query=' + pckeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getproductcatdropdown(pckeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/productcat_search?query=" + pckeyvalue, { 'headers': headers })
  }
  public get_productType(ptkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (ptkeyvalue === null) {
      ptkeyvalue = "";
    }
    let urlvalue = atmaUrl + 'mstserv/producttype_search?query=' + ptkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getproducttypedropdown(ptkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/producttype_search?query=" + ptkeyvalue, { 'headers': headers })
  }
  public get_contact(contactkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (contactkeyvalue === null) {
      contactkeyvalue = "";
    }
    let urlvalue = atmaUrl + 'mstserv/contacttype_search?query=' + contactkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public subTax_dropdownsearch(subtaxkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (subtaxkeyvalue === null) {
      subtaxkeyvalue = "";
      console.log('calling empty');
    }
   let urlvalue = atmaUrl + 'mstserv/subtax_search?query=' + subtaxkeyvalue + '&page=' + pageno;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  
  public subTax_dropdownsearchST(subtaxkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (subtaxkeyvalue === null) {
      subtaxkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/subtax_search?query=' + subtaxkeyvalue;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public subTax_filter(subtaxkeyvalue,tax_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (subtaxkeyvalue === null) {
      subtaxkeyvalue = "";
      // console.log('calling empty');
    }
    let urlvalue=''
    if(tax_id>0){
       urlvalue = atmaUrl + 'mstserv/subtax_search?query=' + subtaxkeyvalue +'&tax_id='+tax_id;
    }else{
      urlvalue = atmaUrl + 'mstserv/subtax_search?query=' + subtaxkeyvalue;
    }
   
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public taxrate_dropdownsearchST(subtaxkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (subtaxkeyvalue === null) {
      subtaxkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/taxrate_search?name=' + subtaxkeyvalue;
    console.log(urlvalue)
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getPinCodeDropDown(pinkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (pinkeyvalue === null) {
      pinkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/pincode_search?query=' + pinkeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getPinCodeDropDownscroll(pinkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (pinkeyvalue === null) {
      pinkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/pincode_search?query=' + pinkeyvalue + '&page=' + pageno;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getCityDropDown(citykeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (citykeyvalue === null) {
      citykeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/search_city_scroll?query=' + citykeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getCityDropDownscroll(citykeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (citykeyvalue === null) {
      citykeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/search_city_scroll?query=' + citykeyvalue + '&page=' + pageno;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }



  public getStateDropDown(statekeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (statekeyvalue === null) {
      statekeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/state_search?query=' + statekeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getStateDropDownscroll(statekeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (statekeyvalue === null) {
      statekeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/state_search?query=' + statekeyvalue + '&page=' + pageno;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }




  public getDistrictDropDown(districtkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (districtkeyvalue === null) {
      districtkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/district_search?query=' + districtkeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getDistrictDropDownscroll(districtkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (districtkeyvalue === null) {
      districtkeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = atmaUrl + 'mstserv/district_search?query=' + districtkeyvalue + '&page=' + pageno;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getBankSearchdd(bankkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/bank_search?query=' + bankkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public bankactiveinactive(id,data:any){
    const getToken =localStorage.getItem("sessionData")
    let tokenValue =JSON.parse(getToken);
    let token = tokenValue.token
    const headers ={'Authorization':'Token '+token }
    return this.http.post(atmaUrl +'mstserv/bankactiveinactive/'+id,data,{'headers':headers})
  }

  public getuom_Search(uomKey): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/uom_search?query=" + uomKey, { 'headers': headers })
  }
  public getuom_LoadMore(uomKey, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (uomKey === null) {
      uomKey = "";
    }
    let urlvalue = atmaUrl + 'mstserv/uom_search?query=' + uomKey + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getSingleCatalog(activityDetailId, catalogEditId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/supplieractivitydtl/" + activityDetailId + '/catelog/' + catalogEditId, { 'headers': headers })
  }
  public get_parentScroll(parentkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    
    if (parentkeyvalue === null) {
      parentkeyvalue = "";
  }
  let urlvalue = atmaUrl + 'mstserv/documentgroup_search?query=' + parentkeyvalue  + '&page=' + pageno;
    return this.http.get(urlvalue, {
        headers: new HttpHeaders()
            .set('Authorization', 'Token ' + token)
    }
    )
}
public getParentDropDown(parentkeyvalue): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  if (parentkeyvalue === null) {
    parentkeyvalue = "";
  console.log('calling empty');
  }
  let urlvalue = atmaUrl + 'mstserv/documentgroup_search?query=' + parentkeyvalue ;
  console.log(urlvalue);
  return this.http.get(urlvalue, {
  headers: new HttpHeaders()
  .set('Authorization', 'Token ' + token)
  }
  )
  }
  public createDocumentForm(vendorId,CreateList: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    // let formData = new FormData();
    // if (id != "") {
    //   let idValue = {
    //     "id": id,
    //     "document_arr": []
    //   }
      //  let obj = Object.assign({}, CreateList, vendorId)
      // formData.append('data', JSON.stringify(obj));
      // if (images !==null){
      // for (var i = 0; i < images.length; i++) {
      //   formData.append("file", images[i]);
      // }}
    // }
    // else {
    //   let document = {
    //     "document_arr": []
    //   }
    //   let ob = Object.assign({}, document, data)
    //   formData.append('data', JSON.stringify(ob));
    //   if (images !==null){
    //   for (var i = 0; i < images.length; i++) {
    //     formData.append("file", images[i]);
    //   }}
    // }
  
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any> (atmaUrl+ 'venserv/vendor/'+vendorId+'/bulkdocument', CreateList, { 'headers': headers })

   

 
  }
  public getdocumentEdit(id: any,vendorId): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor/"+vendorId+"/vendordocument/" + idValue, { headers })
         }
    
        //  public documentEditCreateForm( vendorId,docJson,filedata): Observable<any> {
        //
        //   const getToken = localStorage.getItem("sessionData")
        //   let tokenValue = JSON.parse(getToken);
        //   let token = tokenValue.token
        //   let formData = new FormData();
        
         
        //   const headers = { 'Authorization': 'Token ' + token }
        //   // let idValue = {
        //   // "id": id
        //   // }
        //   // formData.append("id",id)
        //   formData.append("data", JSON.stringify(docJson))
        //   formData.append("file", filedata)
  
        //   // let jsonValue = Object.assign({}, idValue,formData, docJson)
        //   // console.log("docJson", JSON.stringify(jsonValue))
        //   return this.http.post<any>(atmaUrl + "venserv/vendor/"+vendorId+"/vendordocument",formData,
        //     { 'headers': headers })
        //   }

          public documentEditCreateForm(vendorId,docJson, images: any): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData");
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token;
            let formData = new FormData();
            // if (id != "") {
            //   let idValue = {
            //     "id": id,
            //     "document_arr": []
            //   }
               let obj = Object.assign({}, docJson, vendorId)
              formData.append('data', JSON.stringify(obj));
              if (images !==null){
              for (var i = 0; i < images.length; i++) {
                formData.append("file", images[i]);
              }}
            // }
            // else {
            //   let document = {
            //     "document_arr": []
            //   }
            //   let ob = Object.assign({}, document, data)
            //   formData.append('data', JSON.stringify(ob));
            //   if (images !==null){
            //   for (var i = 0; i < images.length; i++) {
            //     formData.append("file", images[i]);
            //   }}
            // }
          
            const headers = { 'Authorization': 'Token ' + token }
            return this.http.post<any>(atmaUrl + "venserv/vendor/"+vendorId+"/vendordocument",formData,
            { 'headers': headers })
          }

           public getdocumentsummaryy(vendorId,pageNumber = 1,pageSize=10): Observable<any> {
            this.reset();
            const getToken = localStorage.getItem("sessionData")
            let tokenValue = JSON.parse(getToken);
            let token = tokenValue.token
            const headers = { 'Authorization': 'Token ' + token }
            let params: any = new HttpParams();
            params = params.append('page', pageNumber.toString());
            params = params.append('pageSize', pageSize.toString());
            console.log(params);
            console.log(headers);
            return this.http.get<any>(atmaUrl + "venserv/vendor/"+vendorId+"/vendordocument", { 'headers': headers, params })
            }
            public deletedocumentform(id: number,VendorId): Observable<any> {
              this.reset();
              const getToken = localStorage.getItem("sessionData")
              let tokenValue = JSON.parse(getToken);
              let token = tokenValue.token
              let idValue = id;
              const headers = { 'Authorization': 'Token ' + token }
              return this.http.delete<any>(atmaUrl + "venserv/vendor/"+VendorId+"/vendordocument/" + idValue, { 'headers': headers })
              }
              public get_bankScroll(bankkeyvalue, pageno): Observable<any> {
             
                const getToken: any = localStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                if (bankkeyvalue === null) {
                  bankkeyvalue = "";
              }
              let urlvalue = atmaUrl + 'mstserv/bank_search?query=' + bankkeyvalue + '&page=' + pageno;
                return this.http.get(urlvalue, {
                    headers: new HttpHeaders()
                        .set('Authorization', 'Token ' + token)
                }
                )
              }
              public get_paymodeScroll(query, pageno): Observable<any> {
                this.reset();
                const getToken: any = localStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                if (query === null) {
                  query = "";
              }
              let urlvalue = atmaUrl + 'mstserv/paymode_search?query=' + query + '&page=' + pageno;
                return this.http.get(urlvalue, {
                    headers: new HttpHeaders()
                        .set('Authorization', 'Token ' + token)
                }
                )
              }
              public getcatlogsearch(page=1,branchId,activityViewId,activedetailId,catlogname): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                // let vendorid = vendorId;
                const headers = { 'Authorization': 'Token ' + token }
                if(catlogname!=null && catlogname!="" && catlogname!= undefined){
                  return this.http.get<any>(atmaUrl + "venserv/category_search?supplier_id=" + branchId+'&category_name='+catlogname+'&activity_id='+ activityViewId +'&activitydtl_id='+ activedetailId+'&page='+ page,{ 'headers': headers })
                }else{
                return this.http.get<any>(atmaUrl + "venserv/category_search?supplier_id=" + branchId+'&activity_id='+ activityViewId +'&activitydtl_id='+ activedetailId+'&page='+ page,{ 'headers': headers })
                } 
              }
                // let urlvalue = atmaUrl + 'mstserv/bankbranch_search?bank_id='+id+'&query='+query + '&page=' + pageno;
             
              public get_bankbranchScroll(id,query, pageno): Observable<any> {
                this.reset();
                const getToken: any = localStorage.getItem('sessionData')
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                if (query === null) {
                  query = "";
              }
              let urlvalue = atmaUrl + 'mstserv/bankbranch_search?bank_id='+id+'&query='+query + '&page=' + pageno;
                return this.http.get(urlvalue, {
                    headers: new HttpHeaders()
                        .set('Authorization', 'Token ' + token)
                }
                )
              }
              
              public deletefile(id: number): Observable<any> {
                this.reset();
                const getToken = localStorage.getItem("sessionData")
                let tokenValue = JSON.parse(getToken);
                let token = tokenValue.token
                let idValue = id;
                const headers = { 'Authorization': 'Token ' + token }
                return this.http.delete<any>(atmaUrl + "venserv/vendor_attactments/" + idValue, { 'headers': headers })
                } 

                public downloadfile(id: number) {
               
                  const getToken = localStorage.getItem("sessionData")
                  let tokenValue = JSON.parse(getToken);
                  let token = tokenValue.token
                  let idValue = id;
                  const headers = { 'Authorization': 'Token ' + token }
                   window.open(atmaUrl+'venserv/vendor_attactments/'+idValue+"?token="+token, '_blank');
                  //  return this.http.get<any>(atmaUrl +'venserv/vendor_attactments/'+idValue, { 'headers': headers , responseType: 'blob' as 'json' } )
                  } 
                
                
                        
  //////////////////////////////Updated Apcat Subcat Services

  public getapcategory(page,name:any,no:any,status:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params =params.append('page',page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/categorysummary?name="+name+"&no="+no+"&status="+status, { 'headers': headers, params })
  }
  public getapcatapprover(page,no:any,name:any):Observable<any>{
    const getToken :any =localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token =tokenValue.token;
    const headers ={'Authorization' : 'Token ' +token}
    let params:any=new HttpParams();
    params =params.append('page',page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/apcat_approver_summary?no="+no+ "&name="+name  ,{'headers':headers,params})


  }
  public getapsubcatapprover(page,no:any,name:any):Observable<any>{
    const getToken :any =localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token =tokenValue.token;
    const headers ={'Authorization' : 'Token ' +token}
    let params:any=new HttpParams();
    params =params.append('page',page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/subcat_approver_summary?no="+no+ "&name="+name  ,{'headers':headers,params})
  }
 

  public apcategoryCreateForm(apcat: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apcat)
    console.log("apcat Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + 'mstserv/Apcategory', data, { 'headers': headers })
  }
  public editapcat(apcatedit): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apcatedit)
   // console.log("apcat Data", data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + 'mstserv/updateisasset', data, { 'headers': headers })
  }
  public activeInactiveapcat(apId, status): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = apId + '?status=' + status
    //console.log('data check for apcat active inactive', data)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/categorystatus/" + apId + '?status=' + status, { 'headers': headers })
  }
  public getapcatsearch(no, name): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let names = name

    for (let i in names) {
      if (!names[i]) {
        delete names[i];
      }
    }
    let nos = no

    for (let i in nos) {
      if (!nos[i]) {
        delete nos[i];
      }
    }
    return this.http.get<any>(atmaUrl + 'mstserv/categorysearch?name=' + names + '&no=' + nos, { 'headers': headers })
  }

  ////////////////////////apsubcat
  public getapsubcategory(page,cat_id:any,name:any,no:any,status:any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    return this.http.get<any>(atmaUrl + "mstserv/subcategorysummary?category_id="+cat_id+"&name="+name+"&no="+no+"&status="+status ,{ 'headers': headers, params })
  }

  public apSubCategoryCreateFormnew(apsubcat: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apsubcat)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + 'mstserv/Apsubcategory', data, { 'headers': headers })
  }
  public getcategorydd(catkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/categoryname_search?query=' + catkeyvalue, { 'headers': headers })
  }
  public getcategoryFKdd(catkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/categoryname_search?query=' + catkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public getcategory_subcat(catkeyvalue,pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/category_drop_down?name=' + catkeyvalue+ "&page="+pageno, { 'headers': headers })
  }

  public editapsubcat(apsubcatedit): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(apsubcatedit)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + 'mstserv/editsubcategory', data, { 'headers': headers })
  }

  public getapsubcatsearch(searchapsub): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + 'mstserv/subcategory_search', searchapsub, { 'headers': headers })
}
//   public getODIT(): Observable<any> {
//     this.reset();
//     const getToken: any = localStorage.getItem('sessionData')
//     let tokenValue = JSON.parse(getToken);
//     let token = tokenValue.token
//     const headers = { 'Authorization': 'Token ' + token }
//   return this.http.get<any>(atmaUrl + 'mstserv/categorytype', { 'headers': headers })
// }

public getglno(glkey:any='',page=1): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params:any= new HttpParams();
  params = params.append('page', page.toString());
  return this.http.get<any>(atmaUrl + 'usrserv/fetch_glno?data='+glkey, { 'headers': headers,params })
}

public getexp(expkeyvalue): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'mstserv/search_expense?query=' + expkeyvalue, { 'headers': headers })
}

public vendorbranch(deptkeyvalue): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'venserv/landlordbranch_list?query=' + deptkeyvalue, { 'headers': headers })
}
// public vendorsearch(query): Observable<any> {
//   this.reset();
//   const getToken: any = localStorage.getItem('sessionData')
//   let tokenValue = JSON.parse(getToken);
//   let token = tokenValue.token
//   const headers = { 'Authorization': 'Token ' + token }
//   return this.http.get<any>(atmaUrl + 'venserv/getvendor_name?query=' + query, { 'headers': headers })
// }
// BUG ID:9331
public vendorsearch(query,page): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'venserv/getvendor_name?query=' + query + '&page='+ page, { 'headers': headers })
}

public suppliersearch(query,page): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'venserv/getsupplier_name?query=' + query + '&page=' + page, { 'headers': headers })
}
public getexpen(expkeyvalue, pageno): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'mstserv/search_expense?query=' + expkeyvalue + '&page=' + pageno, { 'headers': headers })
}

public report(data,search,page): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  if (search==0){
  return this.http.post<any>(atmaUrl + 'venserv/report?is_search='+search,data , { 'headers': headers,responseType: 'blob' as 'json'  })

}else{
  return this.http.post<any>(atmaUrl + 'venserv/report?is_search='+search+'&page='+page,data , { 'headers': headers })
}
}


public paymentactive(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(atmaUrl + 'venserv/payment_activeflag',data , { 'headers': headers })
}
public branchactive(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(atmaUrl + 'venserv/supplieractive',data , { 'headers': headers })
}
public getproducttypedata(): Observable<any>{
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get(atmaUrl +'mstserv/productclassification',{'headers':headers});
}
public getproductcategorydata(id,data,page){
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get(atmaUrl +'mstserv/productclassification/'+id+'?page='+page+'&data='+data,{'headers':headers});
}
public getproductsubcategorydata(id,data,page){
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get(atmaUrl +'mstserv/productcat/'+id+'?page='+page+'&data='+data,{'headers':headers});
}
// public createcategorydata(){
//   this.reset();
//   const getToken: any = localStorage.getItem('sessionData')
//   let tokenValue = JSON.parse(getToken);
//   let token = tokenValue.token
//   const headers = { 'Authorization': 'Token ' + token }
// }
public poduct_type_creation(data:any){
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post(atmaUrl+'mstserv/pdtclasstype',data,{'headers':headers});
}
public createproductcategorydata(data:any){
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post(atmaUrl+'mstserv/pdtcat',data,{'headers':headers});
}
public createproductsubcategorydata(data:any){
  console.log('call')
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post(atmaUrl+'mstserv/pdttype',data,{'headers':headers});
}
  public createspecificationsdata(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl+'mstserv/productspecificationmtom',data,{'headers':headers});
  }
  public createproductspecification(data:any,query:any,page:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/productspecification_data/'+data+'?page='+page+'&data='+query,{'headers':headers});
  
  }
  public createhsnproductdetails(data,page){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/hsn_data?page='+page+'&data='+data,{'headers':headers});
  
  }
  public getbranchdetailsdata(data,page){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/bankbranchsummary/'+data+'?page='+page,{'headers':headers});
  
  }
  public productactiveinactive(id,data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/productactiveinactive/'+id,data,{'headers':headers});
  }
  public getaddtaxname(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/subtax',data,{'headers':headers});
  }
  public getaddtaxnamerate(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/taxrate',data,{'headers':headers});
  }
  public gettaxnamelist(data:any,page:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/taxname?page='+page+'&data='+data,{'headers':headers});
  }
  public getsubtaxnamelist(id:any,data:any,page:any){
    const getToken: any = localStorage.getItem('sessionData');
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/subtaxname/'+id+'?page='+page+'&data='+data,{'headers':headers});
  }
  public getsubratetaxnamelist(id:any,data:any,page:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/taxratename/'+id+'?page='+page+'&data='+data,{'headers':headers});
  }
  public getactiveinactivetax(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/taxrate_active_inactive',data,{'headers':headers});
  }
  public taxactiveinactive(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/taxactiveinactive',data,{'headers':headers});
  }
  public getactiveinactivetapcategory(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/apcategory_active_inactivate',data,{'headers':headers});
  }
  public getactiveinactivetapsubcategory(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/apsubcategory_active_inactivate',data,{'headers':headers});
  }
  public gettaxsummarydata(data:any,search:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/taxsummary?page='+data+'&data='+search,{'headers':headers});
  }
  public getTaxsummary(page,tax:any,sub_tax:any,tax_rate:any,status:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params :any =new HttpParams();
    params=params.append('page',page.toString())
    return this.http.get(atmaUrl +'mstserv/get_tax_subtax_taxrate?tax='+tax+'&subtax='+sub_tax+'&taxrate='+tax_rate+ '&status='+status,{'headers':headers,params});
  }
  public gettaxsearchdata(tax,subtax,taxrate,pageno){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/get_tax_subtax_taxrate?tax='+tax+'&subtax='+subtax +'&taxrate='+taxrate+ '&pageno='+pageno, {'headers':headers});
  }
  public getpaymodeeditsummary(id:any,data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/paymodecreditgl/'+id+'?page='+data,{'headers':headers});
  }
  public getpaymodecreate(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/paymodedetail_create',data,{'headers':headers});
  }
  public getpaymodeactiveinactive(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/paymodedetails_active_inactive',data,{'headers':headers});
  }
  public gethsncreate(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/hsn',data,{'headers':headers});
  }
  public getsgstdropdown(data:any,page:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/hsn_taxrateget?page='+page+'&data='+data,{'headers':headers});
  }
  public gethsnid_data(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get(atmaUrl +'mstserv/hsnid/'+data,{'headers':headers});
  }
  public gethsnactiveinactive(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/hsn_activate_inactivate',data,{'headers':headers});
  }

  public activitynamedrop(bankkeyvalue,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'usrserv/searchdepartment?query=' + bankkeyvalue +'&page='+page, { 'headers': headers })
  }

  public getquestypemaster(summarydata, pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/question_type?query=" + summarydata + "&page=" + pageNumber, { 'headers': headers })
  }

    public questypesingleget(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id == null) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/question_type/" + id, { 'headers': headers })
  }

  public QuestypeCreateForms(quesJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("questypepost", quesJson)
    return this.http.post<any>(atmaUrl + "mstserv/question_type", quesJson, { 'headers': headers })
  }


  public getquesheadermaster(summarydata, pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/questionheader?query=" + summarydata + "&page=" + pageNumber, { 'headers': headers })
  }

  public quesheadersingleget(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id == null) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/questionheader/" + id, { 'headers': headers })
  }

  public QuesHeaderCreateForms(queshdrJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("queshdrpost", queshdrJson)
    return this.http.post<any>(atmaUrl + "mstserv/questionheader", queshdrJson, { 'headers': headers })
  }
  
  public inputypesdropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/input_type_drop_down', { 'headers': headers })
  }

  public getquesmaster(quessummarydata, pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/question?query=" + quessummarydata + "&page=" + pageNumber, { 'headers': headers })
  }

  public geteditquestions(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == null) {
      id = ""
    }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/question/" + id + "/ques_subquestion_get", { 'headers': headers })
  }

  public typebasedheaderget(hdrsearch, id, pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id == null) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/type_base_headername?query=" + hdrsearch + "&type_id=" + id + "&page=" + pageNumber, { 'headers': headers })
  }

  public getquestionsubmit(jsonobject): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("actpost", jsonobject)
    return this.http.post<any>(atmaUrl + "mstserv/question", jsonobject, { 'headers': headers })
  }

  public getquestionsmapping(value,pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(value == undefined || value == null){
      value=''
    }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/create_questiontype_mapping?query="+value+"&page=" + pageNumber, { 'headers': headers })
    // ?query="+summarydata+"&page="+pageNumber
  }

  public allquestionget(type, head): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/question?all=1&type_id=" + type + "&header_id=" + head, { 'headers': headers })
    // ?query="+summarydata+"&page="+pageNumber
  }

  public getsubmitquestionmapping(jsonobject): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("actpost", jsonobject)
    return this.http.post<any>(atmaUrl + "mstserv/create_questiontype_mapping?", jsonobject, { 'headers': headers })
  }

  public getquestionmappingflagpost(jsonobject, remove): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("actpost", jsonobject)
    return this.http.post<any>(atmaUrl + "mstserv/create_flagmaster" + remove, jsonobject, { 'headers': headers })
  }

  public getquestionmappost(jsonobject): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("actpost", jsonobject)
    return this.http.post<any>(atmaUrl + "mstserv/questiontype_mapping_is_checked", jsonobject, { 'headers': headers })
  }

  public getvendocmapping(value,pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(value == undefined){
      value =''
    }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/vendorclassfication_create?query="+value+"&page=" + pageNumber, { 'headers': headers })
  }

  public docmappingsingleget(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (id == null) {
      id = ""
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/get_vendorclassfication/" + id, { 'headers': headers })
  }

  public getdeptlists(deptdata, pageNumber = 1): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "usrserv/employeegroup_search?name=" + deptdata + "&type=" + 0 + "&page=" + pageNumber, { 'headers': headers })
  }

  public getperiodlist(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/period_drop_down', { 'headers': headers })
  }

  public getprocesslist(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'mstserv/process_drop_down', { 'headers': headers })
  }

  public DocMappingForms(docJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("docpost", docJson)
    return this.http.post<any>(atmaUrl + "mstserv/vendorclassfication_create", docJson, { 'headers': headers })
  }

  public getevaluationquestions(typeid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "mstserv/question_type_info/" + typeid, { 'headers': headers })
  }

  public evaluateactivitysubmit(vendorid): Observable<any> {  
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    return this.http.get<any>(atmaUrl + "venserv/riskquestionsans_summary?activity_id="+vendorid, { 'headers': headers })
  }

  
  public getevaluation(typeid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/evaluate_vendor/" + typeid, { 'headers': headers })
  }

  public evaluatedraft(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("docpost", json)
    return this.http.post<any>(atmaUrl + "venserv/question_answer_create", json, { 'headers': headers })
  }

  public evaluatesubmit(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("docpost", json)
    return this.http.post<any>(atmaUrl + "venserv/question_answer_create1", json, { 'headers': headers })
  }

  public questionnairedocumentupload(vendorId, object,files): Observable<any> {
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
    return this.http.post<any>(atmaUrl + "venserv/doc/"+ vendorId , formData,
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
    return this.http.get<any>(atmaUrl + "venserv/deletefile/QUS_"+value, { 'headers': headers })
  }

  public getfiledownload(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "venserv/quesfile/QUS_"+value, { 'headers': headers , responseType: 'blob' as 'json' } )
  }

  public getquestionhistory(value,type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "venserv/ques_trans/"+value+"?type="+type, { 'headers': headers })
  }

  public sendquestionnairemail(vendorid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "venserv/question_mail_alert/"+vendorid, { 'headers': headers })
  }
  

  public getactivitydesignation(value,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/create_activity?query="+value+'&page='+page, { 'headers': headers })
  }

  public getparticularactivitydesignation(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(atmaUrl + "mstserv/get_activitydesignation/"+id, { 'headers': headers })
  }

  public getactivitydesignationcreate(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.post<any>(atmaUrl + "mstserv/create_activity",json, { 'headers': headers })
  }

  public activitysubmit(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("docpost", json)
    return this.http.post<any>(atmaUrl + "venserv/activity_answer_create1", json, { 'headers': headers })
  }

  public approveactivitysubmit(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    console.log("docpost", json)
    return this.http.post<any>(atmaUrl + "venserv/question_answer_mapping", json, { 'headers': headers })
  }
  //BUG ID:7026 DEACTIVATE POPUP
  public Deactivateclk(vendorId,CreateList: any,images: any,type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    let formData = new FormData();
    
       let obj = Object.assign({}, CreateList, vendorId)
      formData.append('data', JSON.stringify(obj));
      if (images !==null){
      for (var i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }}
    
      const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any> (atmaUrl+ 'venserv/vendor/'+vendorId+'/vendordocument?type='+type, formData, { 'headers': headers })
   }
   public blockunblock(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + 'venserv/supplier_block',data, { 'headers': headers })
  }
  public vendorDelete(VendorId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(atmaUrl + "venserv/vendor_del/"+VendorId, { 'headers': headers })
    }
  
    public PortalActiveForm(createJson): Observable<any> {

      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      let entityid = tokenValue.entity_id
      let value = {
        "entity_id": entityid
      }
      const headers = { 'Authorization': 'Token ' + token }
      let jsondata = Object.assign({}, createJson, value)
      return this.http.post<any>(atmaUrl+"usrserv/portal_create", jsondata, { 'headers': headers })
    }

    public getportaluserupdate(vendorid,json): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(atmaUrl + "venserv/portal_flag_update/"+vendorid , json, { 'headers': headers })
  
    }
    public createportal(portalcode,json): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(atmaUrl + "usrserv/create_portal_user?code="+portalcode , json, { 'headers': headers })
    }

    public getportalusersummary(value): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(atmaUrl+"usrserv/user_summary?code="+value+"&page=1", { 'headers': headers })
    }
    public getRolesList(): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(atmaUrl + "usrserv/role", { 'headers': headers })
    }
    public creategroup(json): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token    
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(atmaUrl + "venserv/create_group" , json, { 'headers': headers })
  
    }  
    public creategroupmapping(json): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
  
      if(json?.id == undefined){
        return this.http.post<any>(atmaUrl + "venserv/create_groupmapping?action=create" , json, { 'headers': headers })
  
      }
      else{
        return this.http.post<any>(atmaUrl + "venserv/create_groupmapping?action=update" , json, { 'headers': headers })
  
      }
  
    }
    public getsupplierdata(vendorid,value): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      // let params: any = new HttpParams();
      // params = params.append('page', pageNumber.toString());
      return this.http.get<any>(atmaUrl + "venserv/vendor_supplierbranch_Details?vendor_id="+vendorid+"&query="+value, { 'headers': headers })
    }
    public groupsummary(vendorid,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(atmaUrl + "venserv/create_group?vendor_id="+ vendorid +"&page="+ page, { 'headers': headers })
    }  
    public groupmapsummary(id,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(atmaUrl + "venserv/group_empl_map_summary/"+id+"?page="+ page, { 'headers': headers })
  
    } 
    public getportaluseremployee(vendorid,empkeyvalue): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(atmaUrl + 'venserv/vendor_portal_emp_get?vendor_id='+vendorid+'&name=' + empkeyvalue, { 'headers': headers })
    }
    public getparticulargroupmapping(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(atmaUrl + 'venserv/fetch_groupmapping/' + id, { 'headers': headers })
    }
    public getparticulargroup(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(atmaUrl + 'venserv/fetch_group/' + id, { 'headers': headers })
    }
    public createrule(json): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token    
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.post<any>(atmaUrl + "venserv/create_grouprule" , json, { 'headers': headers })
    } 
    public rulesummary(vendorid,page): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData")
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(atmaUrl + "venserv/create_grouprule?vendor_id="+vendorid+"&page="+ page, { 'headers': headers })
  
    } 
    public getparticularemployeedeleteingroupmapping(id): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.delete<any>(atmaUrl + "venserv/fetch_groupmapping/"+id, { 'headers': headers})
    }
    
  public getvendorlimit(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor_lead_limit/"+id, { 'headers': headers })
  }
  public getvendorbasedgroup(id,value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/vendor_basedgroup?vendor_id="+id, { 'headers': headers })
  }
  public getvendorgroupdropdownsearch(value,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/create_vendorgroup?name="+value+"&page="+page, { 'headers': headers })
  }
  public getparticulargroupmapdata(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/group_mapping_get/"+id, { 'headers': headers })
  }
  public getdynamicrulevalues(id,value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/get_value_type_value?rule_type="+id+"&query="+value, { 'headers': headers })
  }
  public getparticulargroupdelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(atmaUrl + 'venserv/fetch_groupmapping/' + id, { 'headers': headers })
  }
  
  public getproduct(groupid,value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "venserv/groupproduct_based_product?action=summary"+"&vendorgroup_id="+groupid+"&name="+value, { 'headers': headers })
  }
  public getrule(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + "prodserv/rule_type", { 'headers': headers })
  }
  public getparticularrule(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(atmaUrl + 'venserv/fetch_grouprule/' + id, { 'headers': headers })
  }
  
  public quitchanges(vendorid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };
    // return this.http.post<any>(atmaUrl + 'venserv/vendor/' + vendorid +'/modification_quit', statuslist, { 'headers': headers })
    return this.http.get<any>(atmaUrl + 'venserv/vendor/' + vendorid +'/modification_quit',{ 'headers': headers })
  }
   
  public risktransaction(pageNumber = 1, pageSize = 10,vendorid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + 'venserv/risktranhistory/'+vendorid+'?page=' + pageNumber, { 'headers': headers })
  }







  public riskoption(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(atmaUrl + 'mstserv/search_riskcategory', { 'headers': headers })






  }
public getTaxrateactivelist(page=1,pagesize=10): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pagesize.toString());
    return this.http.get<any>(atmaUrl + "mstserv/taxrate_active_list?page=" + page, { 'headers': headers, params })
  }

  public apsubcatsearch(searchapsub): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(atmaUrl + 'mstserv/Searchsubcategory', searchapsub, { 'headers': headers })
}
public subtaxactiveinactive(id,data:any){
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post(atmaUrl +'mstserv/subtaxactiveinactive/'+id,data,{'headers':headers});
}

public getapsearchcategory(no,name):Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // let names = name
  // for (let i in names) {
  //   if (!names[i]) {
  //     delete names[i];
  //   }
  // }
  // let nos = no
  // for (let i in nos) {
  //   if (!nos[i]) {
  //     delete nos[i];
  //   }
  // }
  return this.http.get<any>(atmaUrl + 'mstserv/category_search?name=' + name+ '&no=' + no, { 'headers': headers })
}

public all_get_fa_makemodel_create( d: any): Observable<any> {
    
  console.log('service file enter');
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  // params = params.append('page', page.toString());  
  return this.http.get<any>(atmaUrl + "mstserv/pr_makemodel_create?"+d, { 'headers': headers })
}

public asset_specification_get(data:any) {
  const getToken = localStorage.getItem('sessionData');
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token;
  const headers = { 'Authorization': 'Token ' + token };
  
  return this.http.get(atmaUrl + "mstserv/create_specification?name="+data ,{ 'headers': headers });

}
public get_fa_makemodel_create( d: any): Observable<any> {
    
  console.log('service file enter');
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  // params = params.append('page', page.toString());

  
  return this.http.post<any>(atmaUrl + "mstserv/pr_makemodel_create",d, { 'headers': headers })
 
 
}

public fa_product_specificaitons_create( d: any): Observable<any> {
    
  console.log('service file enter');
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  // params = params.append('page', page.toString());

  
  return this.http.post<any>(atmaUrl + "mstserv/productspecifications_create",d, { 'headers': headers })
 
 
}
public otherattb_creation( d: any): Observable<any> {
    
  console.log('service file enter');
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  // params = params.append('page', page.toString());

  
  return this.http.post<any>(atmaUrl + "mstserv/productattributes_create",d, { 'headers': headers })
}
public otherattb_getall( d: any): Observable<any> {
    
  console.log('service file enter');
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  return this.http.get<any>(atmaUrl + "mstserv/productattributes_create?"+d, { 'headers': headers })
}
public fa_product_specificaitons_getall( d: any): Observable<any> {
    
  console.log('service file enter');
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  // params = params.append('page', page.toString());
  return this.http.get<any>(atmaUrl + "mstserv/productspecifications_create?"+d, { 'headers': headers }) 
}
public addattributes_creation( d: any): Observable<any> {
    
  console.log('service file enter');
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  // params = params.append('page', page.toString());

  
  return this.http.post<any>(atmaUrl + "mstserv/create_pdtclasstype_attr",d, { 'headers': headers })
}
public addattributes_getall( d: any): Observable<any> {
    
  console.log('service file enter');
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  return this.http.get<any>(atmaUrl + "mstserv/get_pdtclasstype/"+d, { 'headers': headers })
}
public approveapcat(obj): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params=obj;
  return this.http.post<any>(atmaUrl + "mstserv/apcat_approve_reject",params, { 'headers': headers })
} 
 public rejectapcat(obj): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params=obj;
  return this.http.post<any>(atmaUrl + "mstserv/apcat_approve_reject",params, { 'headers': headers })
} 
 public approveapsubcat(obj): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params=obj;
  return this.http.post<any>(atmaUrl + "mstserv/apsubcat_approve_reject",params, { 'headers': headers })
}
public rejectapsubcat(obj): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData");
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params=obj;
  return this.http.post<any>(atmaUrl + "mstserv/apsubcat_approve_reject",params, { 'headers': headers })
}


public panvalidation(data): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const body = JSON.stringify(data)
  const headers = { 'Authorization': 'Token ' + token }
  console.log("Body", body)
  // let directorName = {
  //   "director": name
  // }
  let Json = Object.assign({}, data)
  let formData = new FormData();
  formData.append("data", JSON.stringify(Json))
  return this.http.post<any>(atmaUrl + "venserv/pan_validate", formData, { 'headers': headers })
}


public getriskassesment(pageNumber = 1, pageSize = 10): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  params = params.append('page', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  return this.http.get<any>(atmaUrl + "venserv/riskqns_summary?page=" + pageNumber, { 'headers' :headers })

}


public riskassesmentadd(id,name): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
     
    let url = atmaUrl + 'venserv/risk_questions';

    // if (id) {
    //   url = atmaUrl + 'venserv/riskquestions_get/' + id,name;
    //   return this.http.get<any>(url, { headers });
    // } else {
      let obj = Object.assign({}, name);
      return this.http.post<any>(url, obj, { headers });
    // }
  }
  // console.log("clientCreateForm", JSON.stringify(name))
      // if(Id=="" || Id==undefined || Id==null ){
      //   return this.http.post<any>(atmaUrl + "mstserv/riskcategory",name , { 'headers': headers })

      // }
      // else{
      //   return this.http.post<any>(atmaUrl + "mstserv/riskcategory" ,name, { 'headers': headers })

      // }


public riskassesmentDelete(Id): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let idValue = Id
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.delete<any>(atmaUrl + "venserv/riskquestions_get/" + idValue, { 'headers': headers })
}
public fileupload(file): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  // let idValue = Id
  let formData = new FormData();
    // formData.append("data", JSON.stringify(jsondata))
    formData.append("file", file)
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(atmaUrl + "venserv/riskquestion_bulk_create" , formData, { 'headers': headers })
}

public evaluate(data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(atmaUrl + "venserv/activity_risk_evaluate" ,data, { 'headers': headers })
}

public saveData(vendorId,activityId,risk_status,map_id,data): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(atmaUrl + "venserv/activity_risk_que_ans_submit?que_vendor_map="+map_id+"&risk_status="+risk_status+"&vendor_id="+vendorId+"&activity_id="+ activityId,data, { 'headers': headers })
}
public fileDeclaration(vendorid,activityId,file): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let formData = new FormData();
  formData.append("file",file);
  formData.append("data",JSON.stringify(activityId))
  return this.http.post<any>(atmaUrl + "venserv/ansfile/"+vendorid,formData, { 'headers': headers })
}
public returnForm(vendorId,activityId,map_id,remarks): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(atmaUrl + "venserv/activity_risk_que_emc_return_to_branch?risk_status=3"+"&que_vendor_map="+map_id+"&vendor_id="+vendorId+"&activity_id="+ activityId,remarks, { 'headers': headers })
}
public approveForm(vendorId,activityId,map_id,remarks): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(atmaUrl + "venserv/activity_risk_que_emc_accept?risk_status=2"+"&que_vendor_map="+map_id+"&vendor_id="+vendorId+"&activity_id="+ activityId,remarks, { 'headers': headers })
}
public reportDownload(id,qvid): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  // return this.http.get<any>(atmaUrl + "venserv/riskquestionsans_summary?is_search=1&activity_id="+id , { 'headers': headers, responseType: 'blob' as 'json' })
  return this.http.get<any>(atmaUrl + "venserv/report_risk_view_download/"+id+'/'+qvid , { 'headers': headers, responseType: 'blob' as 'json' })

}
public fileDownload(id): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + "venserv/riskfile_download/"+id , { 'headers': headers, responseType: 'blob' as 'json' })
}
public gettranshis(activityid,id): Observable<any> {  
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'venserv/risk_transaction/'+activityid+'/' + id, { 'headers': headers })
  // return this.http.get<any>(MicroUrl + 'prserv/get_pr_podetails/' + id+pagenumber { 'headers': headers })

  // return this.http.get<any>(PRPOUrl + "mstserv/commodity?page=" + pageNumber, { 'headers': headers, params })

}

public viewfile(id): Observable<any> {
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
  return this.http.get<any>(atmaUrl + "venserv/view_riskfile/" + id, { headers, responseType: 'blob' as 'json' })
}

public reviewDownload(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'venserv/risk_que_download?group_key="" ' , { 'headers': headers, responseType: 'blob' as 'json' })


}
public pdfDownload1(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'venserv/attachqnfile_download' , { 'headers': headers, responseType: 'blob' as 'json' })


}
public getapcategorydetails_Download(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'mstserv/apcategory_download', { 'headers': headers,responseType: 'blob' as 'json' })
}
public getapsubcategorydetails_Download(): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'mstserv/subcategory_download', { 'headers': headers,responseType: 'blob' as 'json' })
}

public DownloadExcel(){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'venserv/download_catalog_template', { 'headers': headers, responseType: 'blob' as 'json' })
}

public DownloadErrorExcel(file_id){
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(atmaUrl + 'venserv/catalog_get_errorfile/'+file_id, { 'headers': headers, responseType: 'blob' as 'json' })
}

  public BulkUploadCatalog(branchid: any, images: any): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(dataBulk)
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    // formData.append('data', data);
    formData.append('file', images);
    return this.http.post<any>(atmaUrl + 'venserv/supplier_catalog_bulk_check/'+branchid,formData, { 'headers': headers })

  }
  public previewSubmit(branchid: any,data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(dataBulk)
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // formData.append('data', data);
    // formData.append('file', images);
    return this.http.post<any>(atmaUrl + 'venserv/catalog_bulk_submit/'+branchid,data, { 'headers': headers })

  }
  public BulkUpdate(branchid: any,data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // let data = JSON.stringify(dataBulk)
    const headers = { 'Authorization': 'Token ' + token }
    // let formData = new FormData();
    // formData.append('data', data);
    // formData.append('file', images);
    return this.http.post<any>(atmaUrl + 'venserv/catalog_bulk_get/'+branchid,data, { 'headers': headers,responseType: 'blob' as 'json' })

  }

  public getProdCompSummary(pageNumber = 1, pageSize = 10): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  params = params.append('page', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  return this.http.get<any>(atmaUrl + "mstserv/product_component_create?page="+1, { 'headers' :headers })

}
  public getactiveinactiveProdComp(data:any){
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(atmaUrl +'mstserv/product_component_active_inactive',data,{'headers':headers});
  }
    public getProdCompSummarySearch(pageNumber, prodname): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  // params = params.append('page', pageNumber.toString());
  // params = params.append('pageSize', pageSize.toString());
  return this.http.get<any>(atmaUrl + "mstserv/product_component_create?page="+pageNumber+"&product_id="+prodname, { 'headers' :headers })

}
public addprodcomp(payload): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(atmaUrl + "mstserv/product_component_create" , payload, { 'headers': headers })

} 
  public getChildprodlist(prodid, page): Observable<any> {
  this.reset();
  const getToken = localStorage.getItem("sessionData")
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token }
  let params: any = new HttpParams();
  // params = params.append('page', pageNumber.toString());
  // params = params.append('pageSize', pageSize.toString());
  return this.http.get<any>(atmaUrl + "mstserv/child_products_summary?page="+page+"&parent_product_id="+prodid, { 'headers' :headers })

}
}

    
