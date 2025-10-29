
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

const remsUrl = environment.apiURL
@Injectable({
  providedIn: 'root'
})


export class RemsService {

  constructor(private http: HttpClient, private idle: Idle, ) { }
  idleState = 'Not started.';
  timedOut = false;
  amenitiesJsonValue: any;
  ebadvanceADDEditJson: any;
  terminalADDEditJson: any;
  terminateADDEditJson: any;
  holdADDEditJson: any;
  landlordbankADDEditJson: any;
  taxJsonValue: any;
  taxRateJsonValue: any;
  legalJsonData: any;
  agreementJsonData: any;
  rentJsonData: any;
  legalClearJsonData: any;
  rentTermJsonData: any;
  rentArrearJsonData: any;
  statutoryTypeJsonData: any;
  legalNoticeJsonData: any;
  bankAccountTypeJsonData: any;
  renovationJsonData: any;
  permiseDetailsJsonData: any;
  brokerDetailsJsonData: any;
  occupancyMapppingForm: any;
  documentJsonData: any;
  invoiceJsonData:any;
  landLordMapppingForm: any;
  occpancyMapForm: any;
  agreementMapForm: any;
  scheduleapproverJson: any;
  schappJsonData: any;
  JsonData: any;

  statutoryADDEditJson: any;
  premiseCreateJsonData: any;
  landlordData: any;
  Json: any;
  sss = [];
  sss1 = [];
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  //Controlling Office
  public getControllingOfz(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(remsUrl + "pdserv/controllingofz?page=" + pageNumber, { 'headers': headers, params })
  }
  // Premise summary
  public getPremise(pageNumber = 1, pageSize = 10, abc: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + "pdserv/premise?status=" + abc + "&page" + pageNumber, { 'headers': headers, params })
  }

  //rems-summary
  public getPremiseRemsSummary(pageNumber = 1, pageSize = 10, abc: number, search): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    if(search){
      return this.http.post<any>(remsUrl + 'pdserv/premise_allsearch?page=' + pageNumber , search,  { 'headers': headers, params })
    }else {
      return this.http.get<any>(remsUrl + "pdserv/premise?status=" + abc + "&page=" + pageNumber, { 'headers': headers, params })
    }
  }


  public premisedrop(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premise_status_filter', { 'headers': headers })
  }

  public getpremiseidentificationdrop(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premiseidtification_status_filter", { 'headers': headers })
  }



  // premise Search
  public getPremiseSearch(search): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/premise_allsearch', search, { 'headers': headers })
  }


  public getControllingOfzDropDown(ctrlofzkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (ctrlofzkeyvalue === null) {
      ctrlofzkeyvalue = "";
    }
    let urlvalue = remsUrl + 'pdserv/searchbranch?name=' + ctrlofzkeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    })
  }


  public getPinCodeDropDown(pinkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (pinkeyvalue === null) {
      pinkeyvalue = "";
    }
    let urlvalue = remsUrl + 'mstserv/pincode_search?query=' + pinkeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    })
  }

  public PremiseCreateForm(Premise: any, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (Premise.land_ownership == 1 || Premise.land_ownership == 3 || Premise.land_ownership == 2 ) {
      let json = {
        // rm_id: Premise.rm_id.id,
        premise_identification_id: id,
        land_ownership: Premise.land_ownership
      }
      this.premiseCreateJsonData = Object.assign({}, Premise, json)
    } else {
      let json = {
        // rm_id: Premise.rm_id.id,
        premise_identification_id: id,
        controlling_office_id: Premise.controlling_office_id,
        name: Premise.name,
        rent_area: Premise.rent_area,
        type: Premise.type,
        latitude: Premise.latitude,
        longitude: Premise.longitude,
        address: {
          city_id: Premise.address.city_id,
          district_id: Premise.address.district_id,
          line1: Premise.address.line1,
          line2: Premise.address.line2,
          line3: Premise.address.line3,
          pincode_id: Premise.address.pincode_id,
          state_id: Premise.address.state_id,
        }
      }
      this.premiseCreateJsonData = Object.assign({}, json)
    }

    return this.http.post<any>(remsUrl + 'pdserv/premise', this.premiseCreateJsonData, { 'headers': headers })
  }

  public getRemsReport(page, search): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/rems_report?page='+ page, search,  { 'headers': headers })
  }

  public remsReportFileget(search): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/rems_report?download=true', search, { 'headers': headers })
  }
  
  public remsReportDownload(): Observable<any> {
     this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/rems_report', { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public rentEditableNew(Json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.JsonData = Object.assign({}, Json)
    // console.log("sapp",JSON.stringify(this.JsonData))
    return this.http.post<any>(remsUrl + 'pdserv/rentapproval', this.JsonData,{ 'headers': headers })
  }
  
  public getApproveAmtchg(PremiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/rentapproval?premise_id=" + PremiseId, { 'headers': headers })
  }

  public approveOrRejAmtChg(Json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.JsonData = Object.assign({}, Json)
    // console.log("sapp",JSON.stringify(this.JsonData))
    return this.http.post<any>(remsUrl + 'pdserv/rentapproval?approval=true', this.JsonData,{ 'headers': headers })
  }
  
  
  public getPremiseView(PremiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + PremiseId, { 'headers': headers })
  }
  public getPremiseEdit(PremiseIdValue: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + PremiseIdValue, { 'headers': headers })
  }

  public editPremieForm(data: any, PremiseIdValue: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = PremiseIdValue;
    let value = {
      "id": idValue,
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/premise', jsonValue, { 'headers': headers })
  }



  public getOccupancyList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10, premiseID): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseID + "/occupancy?page=" + pageNumber, { 'headers': headers })
  }

  public getOccupancyCCBSList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10, premiseID): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('filter', filter);
    // params = params.append('sortOrder', sortOrder);
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseID + "/occupancy_ccbs", { 'headers': headers })
  }

  public getOccupancy(premiseID): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseID + "/occupancy", { 'headers': headers })
  }

  public getlanlord(premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/landlorddetails", { 'headers': headers })
  }

  public occupancyCreateForm(occupancyJson, premiseId, date): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let dates = {
      date_of_opening: date
    }
    let finalJson = Object.assign({}, dates, occupancyJson)
    return this.http.post<any>(remsUrl + "pdserv/premise/" + premiseId + "/occupancy", finalJson, { 'headers': headers })
  }


  public deleteoccupancy(id: number, premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/premise/" + premiseId + "/occupancy/" + id, { 'headers': headers })
  }


  public deleterenovation(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/renovation/" + id, { 'headers': headers })
  }

  public getpremise(prekeyvalue): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    prekeyvalue = { "name": prekeyvalue }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "pdserv/premise_search", prekeyvalue, { 'headers': headers })
  }


  public getDistrict(diskeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (diskeyvalue === null) {
      diskeyvalue = "";
    }
    let urlvalue = remsUrl + 'mstserv/district_search?query=' + diskeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    })
  }

  public getCity(citykeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (citykeyvalue === null) {
      citykeyvalue = "";
    }
    let urlvalue = remsUrl + 'mstserv/new_city_search?query=' + citykeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    })
  }

  public getUsage(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/occusagetype', { 'headers': headers })
  }

  public getOwnership(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/ownershiptype', { 'headers': headers })
  }

  public getBranchclassification(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/branchclasstype', { 'headers': headers })
  }

  public getBranchwindow(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/branchwindowtype', { 'headers': headers })
  }

  public getBranchlocation(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/branchlocationtype', { 'headers': headers })
  }

  public getStrongroom(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/strongroom', { 'headers': headers })
  }
  public getUsageCode(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";
     
    }
    let   urlvalue = remsUrl + 'pdserv/searchbranch?name=' + empkeyvalue + '&page=' + pageno;
    // console.log(urlvalue);
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
    return this.http.get<any>(remsUrl + 'pdserv/searchbranch?name=' + empkeyvalue, { 'headers': headers })
  }

  public getLandlordType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'mstserv/composite', { 'headers': headers })
  }

  public getPaidStatus(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_modulelist?paid_status=true', { 'headers': headers })
  }

  public TDSSection(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";
     
    }  
    let urlvalue = remsUrl + 'mstserv/tds_subtax_search?query=' + empkeyvalue + '&page=' + pageno;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getTDSSearchFilter(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'mstserv/tds_subtax_search?query=' + empkeyvalue, { 'headers': headers })
  }

  public TDSRate(id,empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";
     
    }  
    let urlvalue = remsUrl + 'mstserv/taxrate_search?subtax_id=' + id+'&query='+ empkeyvalue + '&page=' + pageno;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getTDSRateSearchFilter(id,empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'mstserv/taxrate_search?subtax_id=' + id+'&query=' + empkeyvalue, { 'headers': headers })
  }

  //vendor_id with tds section
  public TDSSectionWithVendorId(id,empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";
     
    }  
    let urlvalue = remsUrl + 'venserv/landlord_tax?vendor_id=' +id+ '&query=' + empkeyvalue + '&page=' + pageno;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getTDSSearchFilterWithVendorId(id,empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'venserv/landlord_tax?vendor_id=' + id+'&query=' + empkeyvalue, { 'headers': headers })
  }

   //vendor_Id
   public getVendor(vendor_Id,branch_Id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'venserv/vendor/' + vendor_Id + '/branch/' + branch_Id, { 'headers': headers })
  }


  public getSaferoompartition(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/saferoom', { 'headers': headers })
  }

  public getRiskcategory(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/riskcattype', { 'headers': headers })
  }


  public editOccupancyForm(data: any, id: number, premiseId, date): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    let idValue = id;
    let value = {
      "id": idValue,
      date_of_opening: date
    }
    let jsonValue = Object.assign({}, data, value)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "pdserv/premise/" + premiseId + "/occupancy", jsonValue, { 'headers': headers })
  }
  public getleasesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    let url = remsUrl + "pdserv/leasedetails"
    return this.http.get<any>(url, { 'headers': headers, params })
  }


  public deleteleaseform(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/leasedetails/" + idValue, { 'headers': headers })
  }
  public getlanlordsummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10, premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/landlorddetails?page=" + pageNumber + "&with_inactive=true", { 'headers': headers })
  }

  public deletelanlordform(id: number, premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/premise/" + premiseId + "/landlorddetails/" + id, { 'headers': headers })
  }

  public createlandlordForm(CreateList: any, premiseId,vendorSearchId,TDSSelectionName): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    // if (vendorSearchId) {
      let json = {
        "vendor": vendorSearchId,
        "tax_name": TDSSelectionName
      }
      this.landlordData = Object.assign({}, CreateList, json)
    // } else {
    //   let json = {
    //     "tax_name": TDSSelectionName
    //   }
    //   this.landlordData = Object.assign({}, CreateList, json)
    // }
    const body = JSON.stringify(this.landlordData)
    // console.log("body",body)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "pdserv/premise/" + premiseId + "/landlorddetails", body, { 'headers': headers })
  }

  public getPincodeDropDown(pinkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (pinkeyvalue === null) {
      pinkeyvalue = "";
    }
    let urlvalue = remsUrl + 'mstserv/pincode_search?query=' + pinkeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    })
  }
  public getCityDropDown(citykeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (citykeyvalue === null) {
      citykeyvalue = "";
    }
    let urlvalue = remsUrl + 'mstserv/new_city_search?query=' + citykeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    })
  }

  public getStateDropDown(statekeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (statekeyvalue === null) {
      statekeyvalue = "";
      // console.log('calling empty');
    }
    let urlvalue = remsUrl + 'mstserv/state_search?query=' + statekeyvalue;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    })
  }

  public getDistrictDropDown(districtkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (districtkeyvalue === null) {
      districtkeyvalue = "";
      // console.log('calling empty');
    }
    let urlvalue = remsUrl + 'mstserv/district_search?query=' + districtkeyvalue;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    })
  }


  // public landlordEditCreateForm(id, landlordJson, premiseId): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let idValue = {
  //     "id": id
  //   }
  //   let jsonValue = Object.assign({}, idValue, landlordJson)
  //   return this.http.post<any>(remsUrl + "pdserv/premise/" + premiseId + "/landlorddetails", jsonValue, { 'headers': headers })
  // }

  public landlordEditCreateForm(id, landlordJson, premiseId,TDSSelectionName): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id,
      "tax_name": TDSSelectionName,
    }
    let jsonValue = Object.assign({}, idValue, landlordJson)
    const body = JSON.stringify(jsonValue)
    // console.log("edit",body)
    return this.http.post<any>(remsUrl + "pdserv/premise/" + premiseId + "/landlorddetails", body, { 'headers': headers })
  }

  public getlanlordsummaryy(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(remsUrl + "pdserv/landlorddetails", { 'headers': headers, params })
  }


  public getlandlordEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/landlorddetails/" + idValue, { headers })
  }

  public getlandlordPanNumber(pan: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (pan == null || pan == '') {
      pan = "''"
    }
    return this.http.get<any>(remsUrl + 'venserv/validate?type=pan&value=' + pan, { 'headers': headers })
  }
  public getlandlordGstNumber(gstno: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (gstno == null || gstno == '') {
      gstno = "''"
    }
    return this.http.get<any>(remsUrl + 'venserv/validate?type=gst&value=' + gstno, { 'headers': headers })
  }

  public getEntityType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/landlord', { 'headers': headers })
  }
  public getstatutorypayment(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + "pdserv/statutorypayment?page=" + pageNumber, { 'headers': headers })
  }
  public createStatutory(CreateList: any): Observable<any> {
    this.reset();
    const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(CreateList)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "pdserv/statutorypayment", body, { 'headers': headers })
  }
  public gettaxname(): Observable<any> {
    this.reset();
    const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/taxname ", { 'headers': headers })
  }
  public getpaidbyValue(): Observable<any> {
    this.reset();
    const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/paidby ", { 'headers': headers })
  }
  public statutorypaymentEditForm(id, statutoryJson): Observable<any> {
    this.reset();
    const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id
    }
    let jsonValue = Object.assign({}, idValue, statutoryJson)
    return this.http.post<any>(remsUrl + "pdserv/statutorypayment", jsonValue, { 'headers': headers })
  }
  public deleteStatutory(id: number): Observable<any> {
    this.reset();
    const getToken: any = sessionStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/statutorypayment/" + idValue, { 'headers': headers })
  }

  public getInsuranceType(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/insurancetype?page=" + pageNumber, { 'headers': headers })
  }
  public InsuranceTypeCreateSubmit(instype) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let data = JSON.stringify(instype)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/insurancetype', data, { 'headers': headers })
  }
  public getInsurance(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/insurancetype/' + idValue, { headers })
  }
  public InsuranceTypeEditSubmit(data: any, id: number): Observable<any> {
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
    return this.http.post<any>(remsUrl + 'pdserv/insurancetype', jsonValue, { 'headers': headers })
  }
  public getInsuranceDetails(pageNumber = 1, premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/insurancedetails?premise_id=" + premiseId + "&page=" + pageNumber, { 'headers': headers })
  }
  public insuranceDetailsDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/insurancedetails/" + id, { 'headers': headers })
  }
  public premiseDetailsDelete(premiseid, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/premise/" + premiseid + "/premisedetails/" + id, { 'headers': headers })
  }
  public getInsuranceFK(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/insurancetype", { 'headers': headers })
  }
  public InsuranceDetailCreateSubmit(data): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/insurancedetails', data, { 'headers': headers })
  }
  public getInsuranceDetail(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/insurancedetails/' + idValue, { headers })
  }
  public InsuranceDetailEditSubmit(data: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let premise = {
      "id": id,
    }
    let jsonValue = Object.assign({}, data, premise)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/insurancedetails', jsonValue, { 'headers': headers })
  }
  public getLicense(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/licensetype?page=" + pageNumber, { 'headers': headers })
  }
  public licenseCreateForm(licenseJson): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "pdserv/licensetype", licenseJson, { 'headers': headers })
  }
  public getLicenseEdit(id: any): Observable<any> {
    this.reset();
    let idValue = id.id
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/licensetype/' + idValue, { headers })
  }
  public editLicenseForm(data: any, id: number): Observable<any> {
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
    return this.http.post<any>(remsUrl + 'pdserv/licensetype', jsonValue, { 'headers': headers })
  }
  public getLicensedetails(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/licensedetails?page=" + pageNumber, { 'headers': headers })
  }
  public licensedetailsCreateForm(licensedetJson): Observable<any> {
    // this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("licensedetJson", licensedetJson)
    let licensedetailsJson = licensedetJson;
    return this.http.post<any>(remsUrl + "pdserv/licensedetails", licensedetailsJson, { 'headers': headers })
  }
  public getLicensesDetails(pageNumber, premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/licensedetails?premise_id=" + premiseId + "&page=" + pageNumber, { 'headers': headers })

  }
  public editLicensedetailsForm(data: any, id: number, premiseId): Observable<any> {
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
    return this.http.post<any>(remsUrl + 'pdserv/licensedetails', jsonValue, { 'headers': headers })
  }
  public getIFSCdependent(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'mstserv/bankbranch/' + id, { headers })
  }

  public landLordView(premiseId, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/landlorddetails/" + id + "?with_inactivate=true", { 'headers': headers })
  }

  public getAmenitiesType(pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/amentiestype?page=" + pageNumber, { 'headers': headers })
  }
  public createAmentiesTypeForm(amentiesType): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "pdserv/amentiestype", amentiesType, { 'headers': headers })
  }


  public getAmenties(premiseId, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/occuamenties?premise_id=" + premiseId, { 'headers': headers })
  }
  public amentiesFormCreate(amenties, id, premiseId): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.amenitiesJsonValue = amenties;
    } else {
      let ids = {
        "id": id,
      }
      this.amenitiesJsonValue = Object.assign({}, amenties, ids)
    }
    return this.http.post<any>(remsUrl + "pdserv/occuamenties", this.amenitiesJsonValue, { 'headers': headers })
  }
  public getAmenitiesTypeDD(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/amentiestype", { 'headers': headers })
  }

  public amenitiesDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/occuamenties/' + id, { 'headers': headers })
  }
  public licensesDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/licensedetails/' + id, { 'headers': headers })
  }

  public ebadavancesummary(pageNumber = 1, pageSize = 10, eddetails): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'pdserv/eb_details/' + eddetails + '/ebadvance', { 'headers': headers, params })
  }

  public ebadvanceCreateEditForm(ebadvance, id,eddetails): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.ebadvanceADDEditJson = ebadvance;
      this.ebadvanceADDEditJson = Object.assign({}, ebadvance)
    }
    else {
      let ids = {
        "id": id
      }
      this.ebadvanceADDEditJson = Object.assign({}, ebadvance, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/eb_details/' + eddetails + '/ebadvance', this.ebadvanceADDEditJson, { 'headers': headers })
  }

  public ebadvanceDeleteForm( EbdetailID,advanceId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/eb_details/' + EbdetailID + '/ebadvance/' + advanceId, { 'headers': headers })

  }

  public ebdetailssummary(pageNumber = 1, pageSize = 10, premiseId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'pdserv/eb_details?premise_id=' + premiseId, { 'headers': headers, params })
  }

  public ebdetailscreateAddForm(ebdetails, premiseId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let premise = {
      premise_id: premiseId
    }
    let ebdetailsAddJson = Object.assign({}, ebdetails, premise)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/eb_details', ebdetailsAddJson, { 'headers': headers })
  }

  public ebdetailsEdit(data: any, id: number, premiseId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id,
      premise_id: premiseId
    }
    let ebdetailsEditJson = Object.assign({}, idValue, data)
    return this.http.post<any>(remsUrl + "pdserv/eb_details", ebdetailsEditJson, { 'headers': headers })
  }

  public ebdetailsDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/eb_details/' + idValue, { 'headers': headers })
  }

  public ebdetailsparticular(id: number): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/eb_details/" + id, { 'headers': headers })
  }

  public getleasedetails(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/leasedetails', { 'headers': headers })
  }

  public getbornedetails(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/bomeby', { 'headers': headers })
  }

  /*   public getebdetails(): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(remsUrl + 'pdserv/eb_details', { 'headers': headers })
    } */

  public getebcirclenameDropDown(ebcirclevalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    ebcirclevalue = { "circle_name": ebcirclevalue }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/search_ebCircle', ebcirclevalue, { 'headers': headers })
  }

  //service provider
  public getServiceProviderDropDown(id,servicevalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/ebregion/' + id  +  '/search_ebregion?query=' + servicevalue, { 'headers': headers })
  }
  public serviceProvider(id,servicevalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (servicevalue === null) {
      servicevalue = "";
     
    }  
    let urlvalue = remsUrl + 'pdserv/ebregion/' + id +'/search_ebregion?query=' + servicevalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }


  public repairsummary(pageNumber = 1, pageSize = 10, premiseId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'pdserv/repairmaintenace?premise_id=' + premiseId, { 'headers': headers, params })
    // return this.http.get<any>(remsUrl + 'pdserv/repairmaintenace?ref_id=' + premiseId + '&ref_type=' + 2, { 'headers': headers, params })
  }

  public getTypedetails(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/rmdesc', { 'headers': headers })
  }

  public repaircreateAddForm(redetails, premiseId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let premise = {
      //   ref_id: premiseId
      premise_id: premiseId
    }
    let repairAddJson = Object.assign({}, redetails, premise)
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/repairmaintenace', repairAddJson, { 'headers': headers })
  }

  public repairEdit(data: any, id: number, premiseId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const body = JSON.stringify(data)
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = {
      "id": id,
      // ref_id: premiseId
      premise_id: premiseId
    }
    let repairEditJson = Object.assign({}, idValue, data)
    return this.http.post<any>(remsUrl + "pdserv/repairmaintenace", repairEditJson, { 'headers': headers })
  }


  public repairDeleteForm(id: number): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/repairmaintenace/' + idValue, { 'headers': headers })

  }
  public repairparticular(id: number): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/repairmaintenace/" + id, { 'headers': headers })
  }

  public getLegalData(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    return this.http.get<any>(remsUrl + "pdserv/legaldata?page=" + pageNumber, { 'headers': headers })
  }

  public legalDataFormCreate(legalData, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      if (legalData.under_mortage == "true") {
        let json = {
          'EC_details': legalData.EC_details,
          'lease_id': "1",
          'noc_details': legalData.noc_details,
          'noc_remarks': legalData.noc_remarks,
          'under_mortage': true,
        }
        this.legalJsonData = json
      } else {
        let json = {
          'EC_details': legalData.EC_details,
          'lease_id': "1",
          'noc_details': legalData.noc_details,
          'noc_remarks': legalData.noc_remarks,
          'under_mortage': false,
        }
        this.legalJsonData = json
      }
    } else {
      if (legalData.under_mortage == "true") {
        let json = {
          'EC_details': legalData.EC_details,
          'lease_id': "1",
          'noc_details': legalData.noc_details,
          'noc_remarks': legalData.noc_remarks,
          'under_mortage': true,
          "id": id
        }
        this.legalJsonData = json
      } else {
        let json = {
          'EC_details': legalData.EC_details,
          'lease_id': "1",
          'noc_details': legalData.noc_details,
          'noc_remarks': legalData.noc_remarks,
          'under_mortage': false,
          "id": id
        }
        this.legalJsonData = json
      }
    }
    return this.http.post<any>(remsUrl + 'pdserv/legaldata', this.legalJsonData, { 'headers': headers })
  }

  public legalDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/legaldata/' + id, { 'headers': headers })
  }

  public getTax(pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/tax?page=" + pageNumber, { 'headers': headers })
  }

  public taxDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/tax/' + id, { 'headers': headers })
  }

  public taxFormCreate(taxJson, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.taxJsonValue = taxJson;
    } else {
      let ids = {
        "id": id
      }
      this.taxJsonValue = Object.assign({}, taxJson, ids)
    }
    return this.http.post<any>(remsUrl + "pdserv/tax", this.taxJsonValue, { 'headers': headers })
  }


  public taxRateFormCreate(taxrateJson, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.taxRateJsonValue = taxrateJson;
    } else {
      let ids = {
        "id": id
      }
      this.taxRateJsonValue = Object.assign({}, taxrateJson, ids)
    }
    return this.http.post<any>(remsUrl + "pdserv/taxrate", this.taxRateJsonValue, { 'headers': headers })
  }

  public getTaxRate(pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/taxrate?page=" + pageNumber, { 'headers': headers })
  }
  public taxRateDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/taxrate/' + id, { 'headers': headers })
  }

  public wholeschedule_delete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/leaseagreement/' + id + '/wholeschedule_delete', { 'headers': headers })
  }

  public OccupancyCCBSFormCreate(occupancyccbs: any, premiseid: any,occupancyid: any,occupancyccbsid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    let newjson:any;
    // console.log("occupancyccbsid",occupancyccbsid)
    if (occupancyccbsid !== undefined && occupancyccbsid !== ''){
      let occupancyccbsid1 = {
        "id": occupancyccbsid
      }
      newjson = Object.assign({},occupancyccbs , occupancyccbsid1);
    }else{
      newjson = occupancyccbs;
    }
    
    // console.log("occupancyccbs",newjson)
    let formData = new FormData();
    formData.append('data', JSON.stringify(newjson));
    const headers = { 'Authorization': 'Token ' + token }
    let url = remsUrl + "pdserv/premise/" + premiseid + "/occupancy/" + occupancyid+"/occupancy_ccbs";
    return this.http.post<any>(url, newjson, { 'headers': headers })

  }
 
  public agreementFormCreate(agreement, id, premiseId, landlorddetails): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
   
    if (id == "") {
      let json = {
        "landlord_allocation_ratio":landlorddetails, 
      }
      this.agreementJsonData = Object.assign({}, agreement, json)
    } else {
      let ids = {
        "id": id
      }
      let json = {
        "landlord_allocation_ratio":landlorddetails, 
      }
      this.agreementJsonData = Object.assign({}, agreement, ids, json)
    }
    const body = JSON.stringify(this.agreementJsonData)
    // console.log("agreement",body)

    let leaseAgreement = remsUrl + "pdserv/premise/" + premiseId + "/leaseagreement"
    return this.http.post<any>(leaseAgreement, body, { 'headers': headers })
  }
  

  public getAgreement(pageNumber, premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/leaseagreement?page=" + pageNumber, { 'headers': headers })
  }
  public agreementDelete(id, premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/premise/' + premiseId + '/leaseagreement/' + id, { 'headers': headers })
  }

  public getAgreementView(id, premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/leaseagreement/" + id, { headers })
  }
  public getRent(pageNumber, leaseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/leaseagreement/' + leaseId + '/rentschedule?page=' + pageNumber, { headers })

  }

  public rentFormCreate(rentJson, id, leaseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.rentJsonData = rentJson;
    } else {
      let ids = {
        "id": id
      }
      this.rentJsonData = Object.assign({}, rentJson, ids)
    }
    // console.log("leaseagreement", JSON.stringify(this.rentJsonData))
    return this.http.post<any>(remsUrl + 'pdserv/leaseagreement/' + leaseId + '/rentschedule', this.rentJsonData, { headers })
  }

  public getTaxList(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/tax", { 'headers': headers })
  }

  public rentDelete(leaseagreementid, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/leaseagreement/' + leaseagreementid + '/rentschedule/' + id, { 'headers': headers })
  }

  public getDocumentType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/legalcleartype", { 'headers': headers })
  }
  public getRegistrationStatus(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/leaseregis", { 'headers': headers })
  }
  public getScheduleType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/agreement_type", { 'headers': headers })
  }
  public getRegchargespaidby(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/leasepaid", { 'headers': headers })
  }
  public getLeasestatus(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/leaseagrstatus", { 'headers': headers })
  }
  public legalClearanceForm(legalJson, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.legalClearJsonData = legalJson;
    } else {
      let ids = {
        "id": id,
      }
      this.legalClearJsonData = Object.assign({}, legalJson, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/legalclear', this.legalClearJsonData, { headers })
  }

  public getLegalClearance(premiseId, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/legalclear?premise_id=" + premiseId, { headers })
  }

  public legalClearanceDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/legalclear/' + id, { 'headers': headers })
  }

  public rentTermFormCreate(rentTermJson, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.rentTermJsonData = rentTermJson;
    } else {
      let ids = {
        "id": id
      }
      this.rentTermJsonData = Object.assign({}, rentTermJson, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/rentterm', this.rentTermJsonData, { headers })
  }

  public rentTermDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/rentterm/' + id, { 'headers': headers })
  }
  public ownedArrearsDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/ownarrears/' + id, { 'headers': headers })
  }

  public getRentTerm(pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/rentterm?page=' + pageNumber, { headers })
  }
  public getOwnArrears(pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/ownarrears?page=' + pageNumber, { headers })
  }
  public ownArrearsFormCreate(rentTermJson, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.rentTermJsonData = rentTermJson;
    } else {
      let ids = {
        "id": id
      }
      this.rentTermJsonData = Object.assign({}, rentTermJson, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/ownarrears', this.rentTermJsonData, { headers })
  }
  public getOwnRecurringSchedule(pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/ownrecurringschedule?page=' + pageNumber, { headers })
  }
  public ownRecurringScheduleDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/ownrecurringschedule/' + id, { 'headers': headers })
  }
  public ownRecurringFormCreate(rentTermJson, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.rentTermJsonData = rentTermJson;
    } else {
      let ids = {
        "id": id
      }
      this.rentTermJsonData = Object.assign({}, rentTermJson, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/ownrecurringschedule', this.rentTermJsonData, { headers })
  }

  public rentArrearForm(rentArrearJson, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.rentArrearJsonData = rentArrearJson;
    } else {
      let ids = {
        "id": id
      }
      this.rentArrearJsonData = Object.assign({}, rentArrearJson, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/rentarr', this.rentArrearJsonData, { headers })
  }

  public rentArrearDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/rentarr/' + id, { 'headers': headers })
  }

  public getRentArrear(pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/rentarr?page=' + pageNumber, { headers })
  }

  public getStatutoryTpe(pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/statutorytype?page=' + pageNumber, { headers })
  }

  public statutoryTypeDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/statutorytype/' + id, { 'headers': headers })
  }

  public statutoryTypeCreate(statutoryJsonData, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.statutoryTypeJsonData = statutoryJsonData;
    } else {
      let ids = {
        "id": id
      }
      this.statutoryTypeJsonData = Object.assign({}, statutoryJsonData, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/statutorytype', this.statutoryTypeJsonData, { headers })
  }


  public legalNoticeCreate(legalNoticeJosn, id, premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.legalNoticeJsonData = legalNoticeJosn;

    } else {
      let ids = {
        "id": id,
      }
      this.legalNoticeJsonData = Object.assign({}, legalNoticeJosn, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/legaldetail', this.legalNoticeJsonData, { headers })
  }

  public legalNoticeDelete(id, PremiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/legaldetail/' + id + '?premise_id=' + PremiseId, { 'headers': headers })
  }

  public getLegalNotice(premiseId, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/legaldetail?premise_id=" + premiseId + "&page=" + pageNumber, { headers })
  }

  public getLegalNoticeList(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/legalnot", { 'headers': headers })
  }

  public bankAccountTypeCreate(acoountType, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.bankAccountTypeJsonData = acoountType;
    } else {
      let ids = {
        "id": id
      }
      this.bankAccountTypeJsonData = Object.assign({}, acoountType, ids)
    }
    return this.http.post<any>(remsUrl + "pdserv/bankacctype", this.bankAccountTypeJsonData, { 'headers': headers })
  }

  public getBanchAccountType(pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/bankacctype?page=' + pageNumber, { headers })
  }

  public banckAccountTypeDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/bankacctype/' + id, { 'headers': headers })
  }


  public getRenovation(premiseId, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/renovation?premise_id=" + premiseId, { 'headers': headers })
  }
  public renovationFormCreate(renovation, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.renovationJsonData = renovation;
    } else {
      let ids = {
        "id": id,
      }
      this.renovationJsonData = Object.assign({}, renovation, ids)
    }
    return this.http.post<any>(remsUrl + "pdserv/renovation", this.renovationJsonData, { 'headers': headers })
  }

  public getPremiseDetails(premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/premisedetails", { 'headers': headers })
  }
  public premiseDetailsFormCreate(premiseDetails, premiseId, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      let primary_contact = {
        "primary_contact": premiseDetails.primary_contact.id
      }
      this.permiseDetailsJsonData = Object.assign({}, premiseDetails, primary_contact)

    } else {
      let ids = {
        "id": id,
        "primary_contact": premiseDetails.primary_contact.id
      }
      this.permiseDetailsJsonData = Object.assign({}, premiseDetails, ids)
    }
    return this.http.post<any>(remsUrl + "pdserv/premise/" + premiseId + "/premisedetails", this.permiseDetailsJsonData, { 'headers': headers })
  }


  public getPremiseDetailsView(premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/premisedetails/" + premiseId, { 'headers': headers })
  }


  public  primaryContact(deptkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue, { 'headers': headers })
  }


  public approvername(deptkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/searchbranch?name=' + deptkeyvalue, { 'headers': headers })
  }


  public premisesName(deptkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/search_premiseidentificationname?query=' + deptkeyvalue, { 'headers': headers })
  }

  // public occupanydropdown(deptkeyvalue): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(remsUrl + 'pdserv/searchemployee?query=' + deptkeyvalue, { 'headers': headers })
  // }

  public primaryContacts(deptkeyvalue, pageno, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let url = ''
    if (type === '') {
      url = remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue + '&page=' + pageno;
    } else {
      url = remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue + '&page=' + pageno + '&type=' + type
    }
  
    return this.http.get<any>(url, { 'headers': headers })
  }

  public approverscroll(deptkeyvalue, pageno, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let url = ''
    // if (type === '') {
    //   url = remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue + '&page=' + pageno;
    // } else {
    //   url = remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue + '&page=' + pageno + '&type=' + type
    // }
    if (type === '') {
      url = remsUrl + 'pdserv/searchbranch?name=' + deptkeyvalue + '&page=' + pageno;
    } else {
      url = remsUrl + 'pdserv/searchbranch?name=' + deptkeyvalue + '&page=' + pageno + '&type=' + type
    }
    return this.http.get<any>(url, { 'headers': headers })
  }

  public Employee(deptkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue, { 'headers': headers })
  }
  public get_landlordList(premiseId,empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premise/' + premiseId +'/landlorddetails?query=' + empkeyvalue, { 'headers': headers })
  }
 
  public getAgreementStatus(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/agreement_type?agreement_status=true', { 'headers': headers })
  }
 
  public getAgreementStatusAll(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/agreement_type?all=true', { 'headers': headers })
  }

   public get_landlordListwithpageno(premiseId,empkeyvalue,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premise/' + premiseId +'/landlorddetails?query=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public get_CCBSListwithpageno(empkeyvalue,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/ccbs?name=' + empkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  

  public get_CCBSList(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/ccbs?name=' + empkeyvalue, { 'headers': headers })
  } 

  public get_BSList(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // if (empkeyvalue === '') {
    //   return this.http.get<any>(remsUrl + 'usrserv/businesssegmentsearch?no=', { 'headers': headers })
    // } else {
      return this.http.get<any>(remsUrl + 'usrserv/businesssegmentsearch?no=&name=' + empkeyvalue, { 'headers': headers })
    // }
  } 
  public get_BSListwithpageno(empkeyvalue,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(empkeyvalue =="")
      return this.http.get<any>(remsUrl + 'usrserv/businesssegmentsearch?name=' + '&no=&page=' + pageno, { 'headers': headers })
    else
      return this.http.get<any>(remsUrl + 'usrserv/businesssegmentsearch?name=' + empkeyvalue + '&no=&page=' + pageno, { 'headers': headers })
  }

  public get_CCList(empkeyvalue,bsid): Observable<any> {
    if (bsid===undefined) {
      return;}
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (empkeyvalue == "")
      return this.http.get<any>(remsUrl + 'usrserv/searchbs_cc?query=' + '&bs_id=' + bsid, { 'headers': headers })
    else
      return this.http.get<any>(remsUrl + 'usrserv/searchbs_cc?query=' + empkeyvalue + '&bs_id=' + bsid, { 'headers': headers })
  }

  public getMultipleOccupancy(premiseId,empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(empkeyvalue == "")
      return this.http.get<any>(remsUrl + 'pdserv/premise/' + premiseId +'/occupancy', { 'headers': headers })
    else
      return this.http.get<any>(remsUrl + 'pdserv/premise/' + premiseId +'/occupancy?query=' + empkeyvalue, { 'headers': headers })
  }

  public EmployeeName(deptkeyvalue, pageno, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let url = ''
    if (type === '') {
      url = remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue + '&page=' + pageno;
    } else {
      url = remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue + '&page=' + pageno + '&type=' + type
    }
    return this.http.get<any>(url, { 'headers': headers })
  }

  public premisesNameloadmore(deptkeyvalue, pageno, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let url = ''
    if (type === '') {
      url = remsUrl + 'pdserv/search_premiseidentificationname?query=' + deptkeyvalue + '&page=' + pageno;
    } else {
      url = remsUrl + 'pdserv/search_premiseidentificationname?query=' + deptkeyvalue + '&page=' + pageno + '&type=' + type
    }
    return this.http.get<any>(url, { 'headers': headers })
  }

  public getOccupancyMapping(premiseDetailsId, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premiseoccupancy_mapping/' + premiseDetailsId + '?page=' + pageNumber, { headers })
  }

  // public getagreementMapping(premiseDetailsId, pageNumber): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(remsUrl + 'pdserv/premiseoccupancy_mapping/' + premiseDetailsId + '?page=' + pageNumber, { headers })
  // }

  public premiseOccupancyMappingForm(SelectedMappingId, premiseDetailsId, method): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (method == "add") {
      let s = {
        method: "add",
        premisedetails_id: premiseDetailsId,
        occupancy_id: SelectedMappingId,
      }
      this.occupancyMapppingForm = s;
    } else {
      let s = {
        method: "remove",
        premisedetails_id: premiseDetailsId,
        occupancy_id: [SelectedMappingId],
      }
      this.occupancyMapppingForm = s;
    }
    return this.http.post<any>(remsUrl + 'pdserv/premiseoccupancy_mapping', this.occupancyMapppingForm, { headers })
  }

  public occupancyMapDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/premiseoccupancy_mapping/' + id, { 'headers': headers })
  }

  public getOccupancyListMap(premiseID): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseID + "/occupancy", { 'headers': headers })
  }


  public getBrokerDetails(premiseDetailsId, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premisebrokerdetails?premisedetails_id=' + premiseDetailsId + '&page=' + pageNumber, { headers })
  }

  public brokerDetailsForm(brokerjson, id, premiseDetailsId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      let ids = {
        premise_details_id: premiseDetailsId
      }
      this.brokerDetailsJsonData = Object.assign({}, brokerjson, ids)
    } else {
      let ids = {
        "id": id,
        premise_details_id: premiseDetailsId
      }
      this.brokerDetailsJsonData = Object.assign({}, brokerjson, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/premisebrokerdetails', this.brokerDetailsJsonData, { headers })
  }

  public brokerDetailsDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/premisebrokerdetails/' + id, { 'headers': headers })
  }

  public getDocumentList(pageNumber, premsieID): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/upload?premise_id=" + premsieID, { headers })
  }


  public documentForm(doumentJson, id, premiseId, files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    if (id == "") {
      this.documentJsonData = doumentJson;
      formData.append('data', JSON.stringify(this.documentJsonData));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    } else {
      let ids = {
        id: id,
      }
      this.documentJsonData = Object.assign({}, doumentJson, ids)
      formData.append('data', JSON.stringify(this.documentJsonData));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    }
    return this.http.post<any>(remsUrl + 'pdserv/upload', formData, { headers })
  }

  public documentDelete(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/upload/' + id, { 'headers': headers })
  }

  public getOccupancyView(OccupancyID, PremiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + PremiseId + "/occupancy/" + OccupancyID, { 'headers': headers })
  }

  public terminalsummary(pageNumber = 1, pageSize = 10, OccupancyID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'pdserv/occupancy/' + OccupancyID + '/atm', { 'headers': headers, params })
  }

  public terminalCreateEditForm(terminal, id, OccupancyID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.terminalADDEditJson = terminal;
      let occid = {
        occupancy_id: OccupancyID
      }
      this.terminalADDEditJson = Object.assign({}, terminal, occid)
    } else {
      let ids = {
        "id": id,
        occupancy_id: OccupancyID
      }
      this.terminalADDEditJson = Object.assign({}, terminal, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/occupancy/' + OccupancyID + '/atm', this.terminalADDEditJson, { 'headers': headers })
  }


  public terminalDeleteForm(id: number, OccupancyID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/occupancy/' + OccupancyID + '/atm/' + idValue, { 'headers': headers })
  }

  public landlordbanksummary(pageNumber = 1, pageSize = 10, landlordViewId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'pdserv/landlorddetails/' + landlordViewId + '/landlordbankdetails', { 'headers': headers, params })
  }
  public landlordbankpaymentsummary(pageNumber = 1, pageSize = 10, landlord_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'venserv/vendor_payment?landlord_id=' + landlord_id, { 'headers': headers, params })
  }

  public updateLandlordAccno(suppid, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'venserv/rems_landlord/'+ suppid, json, { 'headers': headers })
  }
 
  public getLandlordTaxDet( vendor_Id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'venserv/landlord_tax/' + vendor_Id, { 'headers': headers })
  }

  public updateLandlordTaxDet(suppid, json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'venserv/rems_landlord_tax/'+ suppid, json, { 'headers': headers })
  }

  public getBankNameDD(bankkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bankkeyvalue === null) {
      bankkeyvalue = "";
    }
    let urlvalue = remsUrl + 'mstserv/bank?query=' + bankkeyvalue;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    })
  }
  public getBankBranchNameDD(id: number, bankbranchkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bankbranchkeyvalue === null) {
      bankbranchkeyvalue = "";
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'mstserv/bankbranch_search?bank_id=' + id + '&query=' + bankbranchkeyvalue, { headers })
  }

  public getIFSCcode(IFSC: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (IFSC == null || IFSC == '') {
      IFSC = "''"
    }
    let url = remsUrl + 'venserv/validate?type=ifsc&value=' + IFSC
    return this.http.get<any>(url, { 'headers': headers })
  }

  public landlordBankDeleteForm(id: number, landlordViewId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/landlorddetails/' + landlordViewId + '/landlordbankdetails/' + idValue, { 'headers': headers })

  }
  public landlordbankCreateEditForm(LLB, id, landlordViewId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.landlordbankADDEditJson = LLB;
      let LLid = {
        bank_name: LLB.bank_name.id,
        branch_name: LLB.branch_name.id,
        account_type: LLB.account_type
      }
      this.landlordbankADDEditJson = Object.assign({}, LLB, LLid)
    } else {
      let ids = {
        "id": id,
        bank_name: LLB.bank_name.id,
        branch_name: LLB.branch_name.id,
        account_type: LLB.account_type
      }
      this.landlordbankADDEditJson = Object.assign({}, LLB, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/landlorddetails/' + landlordViewId + '/landlordbankdetails', this.landlordbankADDEditJson, { 'headers': headers })
  }
  public getAccountTypedetails(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/accounttype', { 'headers': headers })
  }

  public fileDownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/files/' + id + '?token=' + token,  { responseType: 'blob' as 'json' })

  }
  public fileDownloadForRemsDoc(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/files/Rems_' + id + '?token=' + token,  { responseType: 'blob' as 'json' })

  }
  public fileDownloadForApprovedPremise(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/files/Rems_' + id + '?premiseidentificationfile=true&token=' + token,  { responseType: 'blob' as 'json' })

  }

  public fileDownloads(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/files/Rems_' + id, { 'headers': headers, responseType: 'blob' as 'json' })
    
  }
  public fileDownloadForApprovedPP(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/files/' + id + '?identification_name=true&token=' + token,  { responseType: 'blob' as 'json' })

  }
  //raise req view file download
  public raiseReqViewfileDownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/modification_file/' + id + '/download?token=' + token,  { responseType: 'blob' as 'json' })

  }

  public fileDownloadss(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/files/' + id, { 'headers': headers, responseType: 'blob' as 'json' })

  }

  public fileDownloadForComments(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/files/' + id + '?identification_name=true&token=' + token, { 'headers': headers, responseType: 'blob' as 'json' })
    
  }

  public fileDownloadtemp(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/filedw/' + id, { 'headers': headers, responseType: 'blob' as 'json' })

  }

  public getRentType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/rentpaytype', { 'headers': headers })
  }
  public getRecurringFrq(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/recufreq', { 'headers': headers })
  }

  public getRecurringFrequency(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/recufreq', { 'headers': headers })
  }



  public getRefType(premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/reftype?premise_id=' + premiseId, { 'headers': headers })
  }


  public getRefID(premiseId, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/reftype/' + id + '/refid/' + premiseId, { 'headers': headers })
  }


  public getLandlordListMap(pageNumber, leaseId): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/leaseagreement/" + leaseId + "/landlords?page=" + pageNumber, { 'headers': headers })
  }

  public landLordMappingForm(SelectedMappingId, leaseId, method): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (method == "add") {
      let s = {
        method: "add",
        landlord_id: SelectedMappingId,
      }
      this.landLordMapppingForm = s;
    } else {
      let s = {
        method: "remove",
        landlord_id: [SelectedMappingId],
      }
      this.landLordMapppingForm = s;
    }
    return this.http.post<any>(remsUrl + "pdserv/leaseagreement/" + leaseId + "/landlord", this.landLordMapppingForm, { headers })
  }

  public getLeaseOccupancyMap(pageNumber, leaseId): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/leaseagreement/" + leaseId + "/occupancys?page=" + pageNumber, { 'headers': headers })
  }

  public getparticularOwnedRentsch(leaseId, id): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/leaseagreement/" + leaseId + "/rentschedule/" + id, { 'headers': headers })
  }
  public getparticularAgreement(premiseId,id): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/leaseagreement/" + id, { 'headers': headers })
  }

  public leaseOccupancyMapCreate(occupancy, leaseId, method): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (method == "add") {
      let s = {
        method: "add",
        occupancy_id: [occupancy.occupancy_id],
      }
      this.occpancyMapForm = s;
    } else {
      let s = {
        method: "remove",
        occupancy_id: [occupancy],
      }
      this.occpancyMapForm = s;
    }
    return this.http.post<any>(remsUrl + "pdserv/leaseagreement/" + leaseId + "/occupancy", this.occpancyMapForm, { headers })
  }

  public getOccupancyMap(pageNumber, occupancyId): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/occupancy/" + occupancyId + "/landlords?page=" + pageNumber, { 'headers': headers })
  }


  
  public getagreementMap(pageNumber, occupancyId): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/occupancy/" + occupancyId + "/leaseagreements?page=" + pageNumber, { 'headers': headers })
  }
  public occupancyMapCreate(SelectedMappingId, occupancyId, method): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (method == "add") {
      let s = {
        method: "add",
        landlord_id: SelectedMappingId,
      }
      this.occpancyMapForm = s;
    } else {
      let s = {
        method: "remove",
        landlord_id: [SelectedMappingId],
      }
      this.occpancyMapForm = s;
    }
    return this.http.post<any>(remsUrl + "pdserv/occupancy/" + occupancyId + "/landlord", this.occpancyMapForm, { headers })
  }



  public agreementMapCreate(SelectedMappingId, occupancyId, method): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (method == "add") {
      let s = {
        method: "add",
        agreement_id: SelectedMappingId,
      }
      this.agreementMapForm = s;
    } else {
      let s = {
        method: "remove",
        agreement_id: [SelectedMappingId],
      }
      this.agreementMapForm = s;
    }
    return this.http.post<any>(remsUrl + "pdserv/occupancy/" + occupancyId + "/leaseagreement", this.agreementMapForm, { headers })
  }
  public getLegalNoticeStatus(): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/noticesta", { 'headers': headers })
  }

  public getEditAmenties(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/occuamenties/" + id, { 'headers': headers })
  }

  public getRenovatinEdit(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/renovation/" + id, { 'headers': headers })
  }

  public getRMDetailsEdit(repairId,id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/repairmaintenace/' + repairId + '/repairmaintenacedetails/' + id, { 'headers': headers })
  }

  

  public getinsuranceEdit(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/insurancedetails/" + id, { 'headers': headers })
  }

  public getLicensedetailsEdit(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/licensedetails/" + id, { 'headers': headers })
  }


  public getDocumentEdit(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/upload/" + id, { 'headers': headers })
  }

  public getEditNotice(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/legaldetail/" + id, { 'headers': headers })
  }

  public getEditLegalClearance(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/legalclear/" + id, { 'headers': headers })
  }
 

   //Activate
   public activate(details,scheduleId,scheduleStatusID, Activatearray): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let activate = {
      "type": scheduleStatusID,
      "landlord_list": Activatearray
    }
    let jsonValue = Object.assign({}, details,activate)
    return this.http.post<any>(remsUrl + "pdserv/rentschedule/" + scheduleId + "/schedule_accessor", jsonValue, { 'headers': headers })

  }
   // terminate 
  public terminateForm(details,scheduleId,scheduleStatusID,terminatearray): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
      let terminate = {
        "type": scheduleStatusID,
        "landlord_list": terminatearray
      }
      this.terminateADDEditJson = Object.assign({}, details, terminate)
  
    return this.http.post<any>(remsUrl + 'pdserv/rentschedule/' + scheduleId + "/schedule_accessor", this.terminateADDEditJson, { 'headers': headers })
  }
  // partially terminate
  public partiallyTermiante(details,scheduleId,scheduleStatusID, partiallyterminatearray): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let partiallyterminate = {
        "type": scheduleStatusID,
        "landlord_list": partiallyterminatearray
    }
    let jsonValue = Object.assign({}, details, partiallyterminate)
   
    return this.http.post<any>(remsUrl + 'pdserv/rentschedule/' + scheduleId + "/schedule_accessor", jsonValue, { 'headers': headers })
  }

   //Hold
   public holdForm(details,scheduleId,scheduleStatusID,holdarray): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let hold = {
      "type": scheduleStatusID,
      "landlord_list": holdarray
    }
    let jsonValue = Object.assign({}, details,hold)
    return this.http.post<any>(remsUrl + "pdserv/rentschedule/" + scheduleId + "/schedule_accessor", jsonValue, { 'headers': headers })

  }

   // partially Hold 
   public partiallyhold(details,scheduleId,scheduleStatusID, partiallyholdarray): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let partiallyhold = {
        "type": scheduleStatusID,
        "landlord_list": partiallyholdarray
    }
    let jsonValue = Object.assign({}, details, partiallyhold)
   
    return this.http.post<any>(remsUrl + 'pdserv/rentschedule/' + scheduleId + "/schedule_accessor", jsonValue, { 'headers': headers })
  }
  public InvoiceDetailsForm(invoiceJson,id, files): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    if (id == "") {
      this.invoiceJsonData = invoiceJson;
      formData.append('data', JSON.stringify(this.invoiceJsonData));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    } else {
      let ids = {
        id: id,
      }
      this.invoiceJsonData = Object.assign({}, invoiceJson,ids)
      formData.append('data', JSON.stringify(this.invoiceJsonData));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    }
    return this.http.post<any>(remsUrl + 'pdserv/invoice_details', formData, { headers })
  }
  
  public getinvoicesummary(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // console.log(params);
    // console.log(headers);
    return this.http.get<any>(remsUrl + "pdserv/invoice_details?status=1", { 'headers': headers, params })
  }
  
  public deleteinvoiceform(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/invoice_details/" + idValue, { 'headers': headers })
  }

  public getPaymentDetailsList(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + "pdserv/paymentdet?page=" + pageNumber, { 'headers': headers })
  }
  public getApprovedDetails(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10,statusId): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('filter', filter);
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    if(statusId == 1 || statusId == 2){
      // console.log("PremiseFilter",statusId)
      return this.http.get<any>(remsUrl + "pdserv/identificationdoc_by_identificationnameid?status=" + statusId  + '&page=' + pageNumber, { 'headers': headers })
    } else {
      return this.http.get<any>(remsUrl + "pdserv/identificationdoc_by_identificationnameid?page=" + pageNumber, { 'headers': headers })
    }
    
  }
  public premiseDetail(deptkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue, { 'headers': headers })
  }
  public premiseDetails(deptkeyvalue, pageno, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let url = ''
    // if (type === '') {
    //   url = remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue + '&page=' + pageno;
    // } else {
    //   url = remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue + '&page=' + pageno + '&type=' + type
    // }
    if (type === '') {
      url = remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue + '&page=' + pageno;
    } else {
      url = remsUrl + 'usrserv/searchemployee?query=' + deptkeyvalue + '&page=' + pageno + '&type=' + type
    }
    return this.http.get<any>(url, { 'headers': headers })
  }


  public getcategory(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premtempcat' , { 'headers': headers })
  }


  public getsubcategory(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premtempsubcat' , { 'headers': headers })
  }




  public gettemplate( pageNumber = 1, pageSize = 10): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
 
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + "pdserv/uploads?page=" + pageNumber, { 'headers': headers })
  }

  // public addtemplate( pageNumber = 1, pageSize = 10): Observable<any> {
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let params: any = new HttpParams();
 
  //   params = params.append('page', pageNumber.toString());
  //   params = params.append('pageSize', pageSize.toString());
  //   return this.http.get<any>(remsUrl + "pdserv/uploads?page=" + pageNumber, { 'headers': headers })
  // }
  templateDocInfoJson:any
  public addtemplate(value,id,files): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    if (id == "") {
      let s = {
        // approved_by: value.approved_by.id       
      }
      this.templateDocInfoJson = Object.assign({}, value, s);
      formData.append('data', JSON.stringify(this.templateDocInfoJson));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    } else {
      let ids = {
        "id": id,
      }
      this.templateDocInfoJson = Object.assign({}, value, ids);
      formData.append('data', JSON.stringify(this.templateDocInfoJson));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    }
    return this.http.post<any>(remsUrl + 'pdserv/uploads',formData, { 'headers': headers })
  }

  public templateDeleteForm(id: number ): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/uploads/'+ id  , { 'headers': headers })
  }
  public getScheduleApproval(sajson, sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('sortOrder', sortOrder);
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    // let sajson1= Object.assign({}, sajson);
    console.log("sajson",sajson)
    let jsonValue = Object.assign({}, sajson)
    return this.http.post<any>(remsUrl + "pdserv/pending_rentschedule?page=" + pageNumber,jsonValue , { 'headers': headers })
  }

  scheduleApprove(approverform,id,statusForSchedule){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    let ApproverValue = {
      "status": statusForSchedule,
    }
    this.scheduleapproverJson = Object.assign({}, approverform, ApproverValue);
    return this.http.post<any>(remsUrl + "pdserv/rentschedule/" + id + "/status_update" ,
    this.scheduleapproverJson , { 'headers': headers })
  }

  public getScheduleForTerm(ScheduleId,bothcondition): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(bothcondition == 2){
      return this.http.get<any>(remsUrl + 'pdserv/rentschedule_accessor/' + ScheduleId + '?hold_only=true', { headers })
    } else if(bothcondition == 3) {
      return this.http.get<any>(remsUrl + 'pdserv/rentschedule_accessor/' + ScheduleId + '?terminate_only=true', { headers }) 
    }
     else {
      return this.http.get<any>(remsUrl + 'pdserv/rentschedule_accessor/' + ScheduleId, { headers }) 
    }
  }


  public getModificationView(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + id + "/modification_view", { 'headers': headers })
  }

  public moveToPo(leaseAgreementId,scheduleaccessorId,rentPayableAmount): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/schedulebulk_entry?accr_id=" + scheduleaccessorId , { 'headers': headers })
  } 

  public landlordScroll(deptkeyvalue, pageno, type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let url = ''
    if (type === '') {
      url = remsUrl + 'venserv/landlordbranch_list?query=' + deptkeyvalue + '&page=' + pageno;
    } else {
      url = remsUrl + 'venserv/landlordbranch_list?query=' + deptkeyvalue + '&page=' + pageno + '&type=' + type
    }
    return this.http.get<any>(url, { 'headers': headers })
  }

  public landlordName(deptkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'venserv/landlordbranch_list?query=' + deptkeyvalue, { 'headers': headers })
  }

  //raise request summary
  public getRaiseRequest(pageNumber, pageSize,statusId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + "pdserv/request_raise?status=" + statusId + "&page=" + pageNumber, { 'headers': headers})
   
  }
  public statusDropDown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/request_raise_filter", { 'headers': headers })
  }


  public getAnalysisReqList(formvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // console.log("formvalue",formvalue);
    if (formvalue.fcn_method === 'GET'){
      return this.http.get<any>(formvalue.fcn_url , { 'headers': headers })
    }
    if(formvalue.fcn_method === 'POST'){
      return this.http.post<any>(formvalue.fcn_url, JSON.parse(formvalue.fcn_json1), { 'headers': headers })
    }
  }

  public getRaiseReqList(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/PdRequestStatus_list' , { 'headers': headers })
  }
  public raiseReqView(raiseReqId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/request_raise/' + raiseReqId , { 'headers': headers })
  }
  raiseRequestForm(approverform, files){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(files==undefined){
      files=''
    }
   
    let formData = new FormData();
    this.Json = Object.assign({}, approverform);
      
    formData.append('data', JSON.stringify(this.Json));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    return this.http.post<any>(remsUrl + "pdserv/request_raise",formData, { 'headers': headers })
  }


  //premise Name search 
  public premiseNameSearch(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let data = {
    "premise_name": empkeyvalue
    }
    let jsonValue = Object.assign({}, data)
    return this.http.post<any>(remsUrl + 'pdserv/premise_allsearch',  jsonValue, { 'headers': headers })
  }

  public get_premiseOptionForModification(premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premiseoption/' + premiseId , { 'headers': headers })
    
  }
  public get_premiseOptionForRenewal(premiseId,renewal_Req): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premiseoption/' + premiseId + '?type=' + renewal_Req, { 'headers': headers })
    
  }
  public get_premiseOptionForTermination(premiseId,termination_Req): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premiseoption/' + premiseId + '?type=' + termination_Req, { 'headers': headers })
    
  }

  public get_reprocessschedule(rentamount,rentschedule_info_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/schedule_accessor/' + rentschedule_info_id + '/reverse_ro?rent_amount=' + rentamount, { 'headers': headers })
  }

  //subtype dropdown
  public get_subTypeOption(premiseId,reftype): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(reftype == "Landlord Details"){
      return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/landlorddetails", { 'headers': headers })
    } else if(reftype == "Premise Details") {
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/premisedetails", { 'headers': headers })
    } else if(reftype == "Occupancy Details") {
      return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/occupancy", { 'headers': headers })
    } else if(reftype == "Agreement and Rent") {
      return this.http.get<any>(remsUrl + "pdserv/premise/" + premiseId + "/leaseagreement", { 'headers': headers })
    } else if(reftype == "Documents") {
      return this.http.get<any>(remsUrl + "pdserv/upload?premise_id=" + premiseId, { 'headers': headers })
    } else if(reftype == "Amenities & Infrastructure") {
      return this.http.get<any>(remsUrl + "pdserv/occuamenties?premise_id=" + premiseId, { 'headers': headers })
    } else if(reftype == "Legal Clearance") {
      return this.http.get<any>(remsUrl + "pdserv/legalclear?premise_id=" + premiseId, { 'headers': headers })
    } else if(reftype == "EB Details") {
      return this.http.get<any>(remsUrl + "pdserv/eb_details?premise_id=" + premiseId, { 'headers': headers })
    } else if(reftype == "Legal & Statutory Notice") {
      return this.http.get<any>(remsUrl + "pdserv/legaldetail?premise_id=" + premiseId, { 'headers': headers })
    } else if(reftype == "Repairs & Maintenance") {
      return this.http.get<any>(remsUrl + "pdserv/repairmaintenace?premise_id=" + premiseId, { 'headers': headers })
    } else if(reftype == "Renovations & Additions") {
      return this.http.get<any>(remsUrl + "pdserv/renovation?premise_id=" + premiseId, { 'headers': headers })
    } else if(reftype == "Licenses & Certificate") {
      return this.http.get<any>(remsUrl + "pdserv/licensedetails?premise_id=" + premiseId, { 'headers': headers })
    } else if(reftype == "Insurance Details") {
      return this.http.get<any>(remsUrl + "pdserv/insurancedetails?premise_id=" + premiseId, { 'headers': headers })
    } else if(reftype == "Statutory Payments") {
      return this.http.get<any>(remsUrl + "pdserv/statutorypayment?premise_id=" + premiseId, { 'headers': headers })
    } 
    
  }

  raiseReqApprove(approverform,id,status){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    let ApproverValue = {
      "status": status,
    }
    this.scheduleapproverJson = Object.assign({}, approverform, ApproverValue);
    return this.http.post<any>(remsUrl + "pdserv/request_approve/" + id + "?status=" + status,
    this.scheduleapproverJson , { 'headers': headers })
  }

  raiseReqReject(approverform,id,status){
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    
    let ApproverValue = {
      "status": status,
    }
    this.scheduleapproverJson = Object.assign({}, approverform, ApproverValue);
    return this.http.post<any>(remsUrl + "pdserv/request_approve/" + id + "?status=" + status,
    this.scheduleapproverJson , { 'headers': headers })
  }


  public upComingRentSchedule(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/upcoming_rentschedule/' + id, { 'headers': headers })
  }



  public scheduleApprover(scheduleJson, json,rentScheduleId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.schappJsonData = Object.assign({}, scheduleJson, json)
    // console.log("sapp",JSON.stringify(this.schappJsonData))
    return this.http.post<any>(remsUrl + 'pdserv/rentschedule/' + rentScheduleId+'/status_update', this.schappJsonData,{ 'headers': headers })
  }
  public OverallSchedule(scheduleJson,pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // this.schappJsonData = Object.assign({}, scheduleJson, json)
    // console.log("sapp",JSON.stringify(this.schappJsonData))
    return this.http.post<any>(remsUrl + 'pdserv/overall_rentschedule?page='+pageno, scheduleJson,{ 'headers': headers })
  }
  public moveToRO(scheduleJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/schedulebulk_entry', scheduleJson,{ 'headers': headers })
  }
  public rentscheduledateupdate(scheduleJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/rentscheduledate_update', scheduleJson,{ 'headers': headers })
  }

  public bulkRunCheck(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/overall_rentschedule', { 'headers': headers })
  }

  public getBulkRunFiles(page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/bulkrun_report?page='+ page, { 'headers': headers })
  } //

  public downloadBulkFile(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/bulkrun_report?download=1&doc_id=' +id,   { 'headers': headers,responseType: 'blob' as 'json' })

  }
  public schedulebulk_entry(scheduleJson): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'pdserv/schedulebulk_entry?type=date', scheduleJson,{ 'headers': headers })
  }
  public rentEditable(Json, rentschedule_accessor_id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    this.JsonData = Object.assign({}, Json)
    // console.log("sapp",JSON.stringify(this.JsonData))
    return this.http.post<any>(remsUrl + 'pdserv/schedule_accessor/' + rentschedule_accessor_id+'/rent_modify', this.JsonData,{ 'headers': headers })
  }

  public addElectricity(electricity: any,modstatus): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let addform = Object.assign({}, electricity)
    const body = JSON.stringify(addform)
    console.log("create electricity", body)
    let create = remsUrl + 'ebserv/consumer?modstatus='+modstatus
    return this.http.post<any>(create, body, { 'headers': headers })


  }

  public getregiondata(value, board, page): Observable<any> {
    this.reset();
    board = (board) ? board : '';

    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "ebserv/search_ebboard_byregion?query=" + value + "&eb_board=" + board + "&page=" + page, { 'headers': headers })
  }

  public getstatebasedboard(value, state, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "ebserv/search_stateby_board?query=" + value + '&state=' + state + '&page=' + page, { 'headers': headers })
  }

  public getebboard(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "ebserv/createebboard?query=" + value + '&page=' + page, { 'headers': headers })
  }

  public getconsumerdetail(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/get_ebdetails?cosumer_number=" + value, { 'headers': headers })
  }

  public getstate(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "mstserv/state_search?query=" + value + '&page=' + page, { 'headers': headers })
  }

  public getparticularelectricityconsumer(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "ebserv/consumer/" + id, { 'headers': headers })
  }

  public tnebconsumervalidation(json): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "ebserv/ebboard_validation", json, { 'headers': headers })
  }

  public getconsumeractivated(consumerid, active,premises): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "ebserv/ebconsumer_update/" + consumerid + "?type=is_active&value=" + active+"&modify=1"+"&premises_id="+premises, { 'headers': headers })
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
    let urlvalue = remsUrl + 'usrserv/searchbs_cc?bs_id=' + bsid + '&query=' + cckeyvalue + '&page=' + pageno;

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
    return this.http.get<any>(remsUrl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue, { 'headers': headers })

  }

  public getbsscroll(bskeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (bskeyvalue === null) {
      bskeyvalue = "";

    }
    let urlvalue = remsUrl + 'usrserv/searchbusinesssegment?query=' + bskeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getbranchId(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "usrserv/user_branch", { 'headers': headers })

  }

  public getoccupancydatas(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/occusagetype?query=" + value + '&page=' + page, { 'headers': headers })
  }

  public getlandlorddetails(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "venserv/landlordbranch_list?query=" + value + '&page=' + page, { 'headers': headers })
  }

  public getpremisesbased_eb(id,flag,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if(flag == 0){
      return this.http.get<any>(remsUrl + "ebserv/premises_eb_details?premises_id=" + id+"&modify=0"+"&page="+page , { 'headers': headers })
    }
    else{
      return this.http.get<any>(remsUrl + "ebserv/premises_eb_details?premises_id=" + id+"&modify=1"+"&page="+page , { 'headers': headers })
    }
  }

  public getsuppliercode(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "venserv/suppliercode_gst_validation?query=" + value + '&page=' + page, { 'headers': headers })
  }

  public getpremisesoccupancy(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/"+id+"/occupancy?dropdown=true" , { 'headers': headers })

    // return this.http.get<any>(remsUrl + "pdserv/premise/" + id + '/occupancy?query='+value+'&page='+page , { 'headers': headers })
  }

  

  public getoccupancysiteids(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/occupancy/"+id+"/atm" , { 'headers': headers })

    // return this.http.get<any>(remsUrl + "pdserv/premise/" + id + '/occupancy?query='+value+'&page='+page , { 'headers': headers })
  }

  public getebmodificationsummary(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "ebserv/consumer_modification_view/" + id , { 'headers': headers })
  }
  
  public getbillcycledropdown(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "ebserv/Billing_cycle" , { 'headers': headers })

  }

  public getModificationReqSummary(premid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + premid + "/modification_request?get_modification=true", { 'headers': headers })
  }

}