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
export class Rems2Service {
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  constructor(private http: HttpClient, private idle: Idle,) { }
  idleState = 'Not started.';
  timedOut = false;
  permiseIdentificationJson: any;
  premiseDocInfoJson: any;
  statutoryADDEditJson: any;
  repairmaintenanceADDEditJson: any;
  closuredetailsADDEditJson: any;
  approverJson: any;
  forwardToEMC: any;
  expADDEditJson: any;
  termDetailsJson: any
  public getPremiseIdentification(abc: number, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premiseidentification?status=" + abc + "&page=" + pageNumber, { 'headers': headers })
  }

  public getpremiseidentificationdrop(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premiseidtification_status_filter", { 'headers': headers })
  }

  public premiseIdentificationFormCreate(identification, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      if (identification.identification_type_id == 1) {
        let json = {
          "area": identification.area,
          "description": identification.description,
          "group_id": identification.group_id,
          "name": identification.name,
          "offered_rent": identification.offered_rent,
          "ownership_type": identification.ownership_type,
          "usage_code": identification.usage_code,
          "identification_type_id": identification.identification_type_id,
          "site_type":identification.site_type
        }
        this.permiseIdentificationJson = Object.assign({}, json)
      } else {
        this.permiseIdentificationJson = identification;
      }

    } else {
      if (identification.identification_type_id == 1) {
        let json = {
          "id": id,
          "area": identification.area,
          "description": identification.description,
          "group_id": identification.group_id,
          "name": identification.name,
          "offered_rent": identification.offered_rent,
          "ownership_type": identification.ownership_type,
          "usage_code": identification.usage_code,
          "identification_type_id": identification.identification_type_id,
          "site_type":identification.site_type
        }
        this.permiseIdentificationJson = Object.assign({}, json)

      } else {
        let ids = {
          "id": id,
        }
        this.permiseIdentificationJson = Object.assign({}, identification, ids)
      }

    }
    return this.http.post<any>(remsUrl + "pdserv/premiseidentification", this.permiseIdentificationJson, { 'headers': headers })
  }

  public getOwnerShipType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/ownership_type", { 'headers': headers })
  }

  public identificationDelete(id: number): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/premiseidentification/' + id, { 'headers': headers })
  }
  public getPremiseIdView(id: number): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premiseidentification/' + id, { 'headers': headers })
  }

  public getDocumentType(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/doctype', { 'headers': headers })
  }


  public premiseDocInfoForm(docInfo, id, files, premiseIdentification): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let formData = new FormData();
    if (id == "") {
      let s = {
        approved_by: docInfo.approved_by.id
      }
      this.premiseDocInfoJson = Object.assign({}, docInfo, s);
      formData.append('data', JSON.stringify(this.premiseDocInfoJson));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    } else {
      let ids = {
        "id": id,
        approved_by: docInfo.approved_by.id
      }
      this.premiseDocInfoJson = Object.assign({}, docInfo, ids);
      formData.append('data', JSON.stringify(this.premiseDocInfoJson));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    }
    return this.http.post<any>(remsUrl + "pdserv/premiseidentification/" + premiseIdentification
      + "/premiseidentificationdocument_info", formData, { 'headers': headers })
  }

  amenitiesJsonValue: any
  public premisenameForm(prenamee, id, pid): Observable<any> {

    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.amenitiesJsonValue = prenamee;
    } else {
      let ids = {
        "id": id,
      }
      this.amenitiesJsonValue = Object.assign({}, prenamee, ids)
    }
    return this.http.post<any>(remsUrl + "pdserv/premiseidentification/" + pid
      + "/premiseidentificationname", this.amenitiesJsonValue, { 'headers': headers })
  }


  public getPremiseDocInfoForm(premiseIdentification): Observable<any> {
    this.reset();
    // console.log("ide", premiseIdentification)
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premiseidentificationname/" + premiseIdentification
      + "/premiseidentificationdocument_info", { 'headers': headers })
  }


  public getPremisename(id: any): Observable<any> {
    this.reset();

    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premiseidentification/" + id
      + "/premiseidentificationname", { 'headers': headers })
  }

  public getPremisenamee(id: any, ids: any): Observable<any> {
    this.reset();

    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premiseidentification/" + id
      + "/premiseidentificationname/" + ids, { 'headers': headers })
  }


  public docInfoDelete(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/premiseidentificationname/" + id
      + "/premiseidentificationdocument_info", { 'headers': headers })
  }

  public doccInfoDelete(id, a): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/premiseidentification/" + id
      + "/premiseidentificationname/" + a, { 'headers': headers })
  }


  public getRefTypeId(refId, refTypeId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/reftype/' + refTypeId + '/refid/' + refId, { 'headers': headers })
  }

  public getPaidBy(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/renopaidby", { 'headers': headers })
  }

  public getPreDocumentType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/doctype", { 'headers': headers })
  }

  public getUsageCode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/occusecode", { 'headers': headers })
  }

  public getUsage(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/occusagetype', { 'headers': headers })
  }
  public getIdentificationType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/identificationtype ', { 'headers': headers })
  }

  public getControllingOffice(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/controfz", { 'headers': headers })
  }

  public getModificationView(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + id + "/modification_view", { 'headers': headers })
  }
  public getModificationViewAddRenewal(id, request_status): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (request_status == "RENEWAL") {
      return this.http.get<any>(remsUrl + "pdserv/renewal/" + id, { 'headers': headers })
    } else {
      return this.http.get<any>(remsUrl + "pdserv/premise/" + id + "/modification_view", { 'headers': headers })
    }
  }

  public getModificationRequest(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + id + "/modification_request", { 'headers': headers })
  }
  public getRenewalRequest(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + id + "/renewal_request", { 'headers': headers })
  }
  public getTerminateRequest(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + id + "/termination_request", { 'headers': headers })
  }

  public getRenewalApprove(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + id + "/renewal_approve", { 'headers': headers })
  }
  public approverreject(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + id + "/modification_reject", { 'headers': headers })
  }


  public getModificationApprove(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premise/" + id + "/modification_approve", { 'headers': headers })
  }

  public getStatutorySummary(pageNumber = 1, pageSize = 10, PremiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'pdserv/statutorypayment?premise_id=' + PremiseId, { 'headers': headers, params })
  }
  public statutoryCreateEditForm(statutory, id, premiseId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.statutoryADDEditJson = statutory;
      let premise = {
        premise_id: premiseId
      }
      this.statutoryADDEditJson = Object.assign({}, statutory, premise)
    }
    else {
      let ids = {
        "id": id,
        premise_id: premiseId
      }
      this.statutoryADDEditJson = Object.assign({}, statutory, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/statutorypayment?premise_id=' + premiseId, this.statutoryADDEditJson, { 'headers': headers })
  }

  public statutoryDeleteForm(id: number, premiseId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/statutorypayment/' + idValue + '?premise_id=' + premiseId, { 'headers': headers })
  }

  public statutoryparticular(id: number, premiseId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/statutorypayment/" + id, { 'headers': headers })
  }

  public getstatutoryTypedetails(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/statutorytype', { 'headers': headers })
  }

  public getIdentificationSearch(search): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (search.code == null || search.code == '') {
      search.code = "''"
    } if (search.name == null || search.name == '') {
      search.name = "''"
    }
    return this.http.get<any>(remsUrl + 'pdserv/searchpremiseidtification_by_code?query=' + search.code, { 'headers': headers })
  }
  public getPremiseIdentificationCodeSearch(search): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (search.code == null || search.code == '') {
      search.code = "''"
    } if (search.name == null || search.name == '') {
      search.name = "''"
    }
    return this.http.get<any>(remsUrl + 'pdserv/searchpremiseidtification_by_code?query=' + search.code + '&type=premise', { 'headers': headers })
  }


  public getPremiseIdentificationEdit(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premiseidentification/" + id, { 'headers': headers })
  }

  public premisesType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premisetype", { 'headers': headers })
  }


  public getDoneBydetails(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/doneby", { 'headers': headers })
  }

  public getDropDown(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/premiseoption/" + id, { 'headers': headers })
  }

  public repairmaintenanceForm(repairmain, id, repairId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.repairmaintenanceADDEditJson = repairmain;
      this.repairmaintenanceADDEditJson = Object.assign({}, repairmain)
    }
    else {
      let ids = {
        "id": id
      }
      this.repairmaintenanceADDEditJson = Object.assign({}, repairmain, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/repairmaintenace/' + repairId + '/repairmaintenacedetails', this.repairmaintenanceADDEditJson, { 'headers': headers })
  }

  public repairmaintenancesummary(pageNumber = 1, pageSize = 10, repairId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'pdserv/repairmaintenace/' + repairId + '/repairmaintenacedetails', { 'headers': headers, params })
  }

  public repairmaintenanceDeleteForm(id: number, repairId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/repairmaintenace/' + repairId + '/repairmaintenacedetails/' + idValue, { 'headers': headers })
  }

  public repairmaintenanceparticular(id: number, repairId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/repairmaintenace/' + repairId + '/repairmaintenacedetails/' + id, { 'headers': headers })
  }

  public ClosureDetailsummary(pageNumber = 1, pageSize = 10, OccupancyID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'pdserv/occupancy/' + OccupancyID + "/occuclosure", { 'headers': headers, params })
  }

  public ClosureDetailCreateEditForm(closure, id, OccupancyID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.closuredetailsADDEditJson = closure;
      let Occupancy = {
        occupancy_id: OccupancyID
      }
      this.closuredetailsADDEditJson = Object.assign({}, closure, Occupancy)
    }
    else {
      let ids = {
        "id": id,
        occupancy_id: OccupancyID
      }
      this.closuredetailsADDEditJson = Object.assign({}, closure, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/occuclosure', this.closuredetailsADDEditJson, { 'headers': headers })
  }


  public ClosureDetailCreateEdiForm(closure, OccupancyID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }


    return this.http.post<any>(remsUrl + 'pdserv/occupancy/' + OccupancyID + "/occupancy_close", closure, { 'headers': headers })
  }

  public ClosureDeleteForm(id: number, OccupancyID): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/occuclosure/' + idValue, { 'headers': headers })
  }

  public premiseIdentificationstatus(id: number, status: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "pdserv/premiseidentification_status/" + id, status, { 'headers': headers })
  }

  public moveToEstateCell(data: any, id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "pdserv/statusupdate_identificationname/" + id, data, { 'headers': headers })
  }
  public getCoverageNote(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/identification_coverage_note/" + id + "?type=1", { 'headers': headers })
  }


  public premisestatus(id: number, status: any): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "pdserv/premise/" + id + "/status_update", status, { 'headers': headers })
  }


  public getgrnsummarylist(pageNumber = 1, pageSize = 10): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'pdserv/leasedetails' + { 'headers': headers, params })
  }
  public branchcode(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'usrserv/user_branch', { 'headers': headers })
  }

  // public getEBModificationView(id,EbdetailID): Observable<any> {
  //   this.reset();
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(remsUrl + "pdserv/eb_details/" + EbdetailID +"/ebadvance?premise_id=" + id , { 'headers': headers })
  // }

  createCommentform(docInfo, id, files, premiseIdentificationameid) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (files == undefined) {
      files = ''
    }
    let formData = new FormData();
    if (id == "") {
      let s = {
        content: docInfo.content
      }
      this.premiseDocInfoJson = Object.assign({}, docInfo, s);

      formData.append('data', JSON.stringify(this.premiseDocInfoJson));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    }
    else {
      let ids = {
        "id": id,
        content: docInfo.content
      }
      this.premiseDocInfoJson = Object.assign({}, docInfo, ids);
      formData.append('data', JSON.stringify(this.premiseDocInfoJson));
      for (var i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
    }
    // console.log("ABF", formData);
    // this.premiseDocInfoJson =formData
    // formData=this.premiseDocInfoJson
    return this.http.post<any>(remsUrl + "pdserv/identification_name_comment/" + premiseIdentificationameid,
      formData, { 'headers': headers })

  }
  public branchNameScroll(deptkeyvalue, pageno, type): Observable<any> {
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

  public branchName(deptkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/searchbranch?name=' + deptkeyvalue, { 'headers': headers })
  }
  public branchNameScroll1(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = remsUrl + 'pdserv/searchbranch?name=' + empkeyvalue + '&page=' + pageno;
    // console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }

  public getDepartmentScroll(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = remsUrl + 'usrserv/searchdepartment?query=' + empkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getDepartmentFilter(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'usrserv/searchdepartment?query=' + empkeyvalue, { 'headers': headers })
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
    return this.http.post<any>(remsUrl + 'pdserv/premise_allsearch', jsonValue, { 'headers': headers })
  }
  public premiseNameScroll(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let data = {
      "premise_name": empkeyvalue
    }
    let jsonValue = Object.assign({}, data)
    return this.http.post<any>(remsUrl + 'pdserv/premise_allsearch?page=' + pageno, jsonValue, { 'headers': headers })
  }

  approverForPremiseIdentification(approverform, id, files, array) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (files == undefined) {
      files = ''
    }
    let ApproverPP = {
      "document": array,
    }
    let formData = new FormData();
    this.forwardToEMC = Object.assign({}, approverform, ApproverPP);

    formData.append('data', JSON.stringify(this.forwardToEMC));
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    return this.http.post<any>(remsUrl + "pdserv/identificationdoc_by_identificationnameid/" + id,
      formData, { 'headers': headers })
  }

  approverForPremiseName(approverform, id, files, statusForpremiseName) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (files == undefined) {
      files = ''
    }
    let ApproverValue = {
      "status": statusForpremiseName,
    }
    let formData = new FormData();
    this.approverJson = Object.assign({}, approverform, ApproverValue);

    formData.append('data', JSON.stringify(this.approverJson));
    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    // console.log("ap", formData);
    return this.http.post<any>(remsUrl + "pdserv/idtname_approval_comment/" + id,
      formData, { 'headers': headers })
  }

  approverSubmitForReject(approverform, id, statusForpremiseName) {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    let ApproverValue = {
      "status": statusForpremiseName,
    }
    let formData = new FormData();
    this.approverJson = Object.assign({}, approverform, ApproverValue);

    formData.append('data', JSON.stringify(this.approverJson));

    return this.http.post<any>(remsUrl + "pdserv/idtname_approval_comment/" + id,
      formData, { 'headers': headers })
  }

  public approvedGet(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/idtname_approval_comment/' + id, { 'headers': headers })
  }
  public getEstateApproveFile(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/identification_approve_files/' + id, { 'headers': headers })
  }

  public fileDownloadForApprovedPP(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/files/Rems_' + id + '?identification_name=true&token=' + token, { responseType: 'blob' as 'json' })

  }
  //doc edit view
  public fileDownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/files/' + id + '?token=' + token,  { responseType: 'blob' as 'json' })

  }
  //doc edit-file delete
  public deletefile(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + "pdserv/file_delete?file_id=" + idValue, { 'headers': headers })
    } 
    

  //Forward To EMc Table file
  public fileDownloadForTableFile(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/files/' + id + '?identification_name=true&token=' + token, { responseType: 'blob' as 'json' })

  }



  public getcomments(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/identification_name_comment/' + id, { 'headers': headers })
  }
  public getinvoiceType(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/searchinvoicetype", { 'headers': headers })
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

  public ExpensesForm(exp, id, ExpId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "") {
      this.expADDEditJson = exp;
      this.expADDEditJson = Object.assign({}, exp)
    }
    else {
      let ids = {
        "id": id
      }
      this.expADDEditJson = Object.assign({}, exp, ids)
    }
    return this.http.post<any>(remsUrl + 'pdserv/expendet', this.expADDEditJson, { 'headers': headers })
  }

  public expsummary(pageNumber = 1, pageSize = 10, ExpId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(remsUrl + 'pdserv/expendet', { 'headers': headers, params })
  }

  public expDeleteForm(id: number, ExpId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = id;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/expendet/' + idValue, { 'headers': headers })
  }

  public expparticular(id: number, ExpId): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/expendet/' + id, { 'headers': headers })
  }


  public removeFiles(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/file_delete?file_id=' + id, { 'headers': headers })
  }


  public getTermDetails(identification_Id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/proposedrentdetails/' + identification_Id + '/premiseidentification', { 'headers': headers })
  }

  public getEditTermDetails(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/proposedrentdetails/' + id, { 'headers': headers })
  }

  public termDetailsDelete(id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.delete<any>(remsUrl + 'pdserv/proposedrentdetails/' + id, { 'headers': headers })
  }
  public termDetails(finaleJson, id): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (id == "" || id == undefined) {
      this.termDetailsJson = finaleJson;
    } else {
      let json = {
        id: id
      }
      this.termDetailsJson = Object.assign({}, finaleJson, json);
    }
    return this.http.post<any>(remsUrl + 'pdserv/proposedrentdetails', this.termDetailsJson, { 'headers': headers })
  }
   //identification history
   public getIdentificationHistory(identificationid): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premiseidentification/' + identificationid + '/identificationhistory', { headers }) 
  }

  
}