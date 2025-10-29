import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Idle } from '@ng-idle/core';
import { Observable } from "rxjs";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';

const remsUrl = environment.apiURL   
const MicroUrl = environment.apiURL   /// 8184
const appURL = environment.apiURL;
// const appURL = environment.apiURL; // Assuming apiURL is defined in environment.ts

export interface PeriodicElement {
  BranchName: string;
  sNo: number;
  FromDate: number;
  ToDate: number;
  BranchCode: number;
  SUBCAT: any,
  CC: any,
}

@Injectable({
  providedIn: 'root'
})
export class ReportserviceService {
  dict: {};

  constructor(private http: HttpClient, private idle: Idle,) { }
  idleState = 'Not started.';
  timedOut = false;
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  
    public getReportPOdownld(bpa, type): Observable<any> {
    
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
if (!bpa || Object.keys(bpa).length === 0) {
  this.dict = {};
} else {
  this.dict = { bpa_no: bpa };
}
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(MicroUrl + 'prserv/prpo_common_reports?report_type=1&is_summary=' + type, this.dict,{ 'headers': headers, responseType: 'blob' as 'json' })
}
  public getReportPO(bpa, pca, type): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let dict = {
    bpa_no: bpa,
    pca_no: pca
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(MicroUrl + 'prserv/prpo_common_reports?report_type=1&is_summary=' + type, dict, { 'headers': headers })
}
  public getPOList(): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token

  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/get_prpo_report_status', { 'headers': headers })
}

  //report-group
  public getReportGroup(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group', { 'headers': headers })
  }

  public report(data, search, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (search == 0) {
      return this.http.post<any>(remsUrl + 'venserv/report?is_search=' + search, data, { 'headers': headers, responseType: 'blob' as 'json' })

    } else {
      return this.http.post<any>(remsUrl + 'venserv/report?is_search=' + search + '&page=' + page, data, { 'headers': headers })
    }
  }
  public getVendorSummary(val, pageSize): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let data = {}
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.post<any>(remsUrl + 'venserv/vendor_report?is_excel=0&page=1', data, { headers })
  }

  public getVendorSummarySearch(val, pageSize): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let data = { val }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.post<any>(remsUrl + 'venserv/vendor_report?is_excel=0&page=1', val, { headers })
  }
  public searchfunction(val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let data = { val }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    // params = params.append('pageSize', pageSize.toString());
    return this.http.post<any>(remsUrl + 'venserv/vendor_report?is_excel=0&page=1', val, { headers })
  }

  public downloadreport(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let data = { id }
    return this.http.get<any>(remsUrl + 'venserv/report_dwld/' + id, { headers, responseType: 'blob' as 'json' })

  }
  public report_v(data, search, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (search == 0) {
      return this.http.post<any>(remsUrl + 'venserv/report_v?is_search=' + search, data, { 'headers': headers, responseType: 'blob' as 'json' })

    } else {
      return this.http.post<any>(remsUrl + 'venserv/report_v?is_search=' + search + '&page=' + page, data, { 'headers': headers })
    }
  }
  public vendorlevelsummary(data, search, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'venserv/report_vendor_level?is_search=' + search + '&page=' + page, data, { 'headers': headers })

  }
  public newreportdwnsum(val): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'venserv/vendor_report?is_excel=1', val, { 'headers': headers })

  }
  public vendorlevelreport(is_excel, reporttype, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    // return this.http.post<any>(remsUrl + 'venserv/report_vendor_level_download?is_excel='+is_excel+'&report_type='+reporttype,data , { 'headers': headers,responseType: 'blob' as 'json'  })
    // return this.http.post<any>(remsUrl + 'venserv/report_vendor_level_download?is_excel=' + is_excel + '&report_type=' + reporttype, data, { 'headers': headers, responseType: 'blob' as 'json' })
    return this.http.post<any>(remsUrl + 'venserv/all_vendor_report?is_excel=' + is_excel + '&report_type=' + reporttype, data, { 'headers': headers })

      .pipe(
        catchError(this.handleResponse)
      );
  }

  private handleResponse(response: any): any {
    // Check the content type of the response
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      // Response is JSON, parse and return it
      return response;
    } else {
      // Response is binary (blob)
      // You can return the blob or handle it as needed
      return response;
    }
  }
  //premise report
  public getReportGroupForOwnedPremise(reportGroupId, ownedPremiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + ownedPremiseId, { 'headers': headers })
  }
  public getReportGroupForLeasedPremise(reportGroupId, leasedPremiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + leasedPremiseId, { 'headers': headers })
  }
  public getReportGroupForActivePremise(reportGroupId, activePremiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + activePremiseId, { 'headers': headers })
  }
  public newgetVendorSummary(report_type): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'venserv/vendor_report_scheduler' + "?report_type=" + report_type, { 'headers': headers })
  }
  public getReportGroupForTerminatedPremise(reportGroupId, terminatedPremiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + terminatedPremiseId, { 'headers': headers })
  }
  //occupany
  public getReportGroupForATM(reportGroupIdoccupany, atmId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdoccupany;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + atmId, { 'headers': headers })
  }

  public getReportGroupForBranch(reportGroupIdoccupany, branchId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdoccupany;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + branchId, { 'headers': headers })
  }
  public getReportGroupForClosedOccu(reportGroupIdoccupany, closedOccuId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdoccupany;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + closedOccuId, { 'headers': headers })
  }
  public getReportGroupForoccUsageType(reportGroupIdoccupany, occUsageTypeId, id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdoccupany;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + occUsageTypeId + '?type=' + id, { 'headers': headers })
  }
  public getReportGroupForoccUsageCode(reportGroupIdoccupany, occByUsageCodeId, usageBranchId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdoccupany;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + occByUsageCodeId + '?code=' + usageBranchId, { 'headers': headers })
  }
  //rent
  public getReportGroupForRent(reportGroupIdrent, rentId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdrent;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + rentId, { 'headers': headers })
  }
  public getReportGroupForHoldRent(reportGroupIdrent, holdRentId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdrent;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + holdRentId, { 'headers': headers })
  }
  public getReportGroupForexpiredRentSchedule(reportGroupIdrent, expiredRentScheduleId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdrent;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + expiredRentScheduleId, { 'headers': headers })
  }
  //landlord
  public getReportGroupForLandlord(reportGroupIdlandlord, landlordId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdlandlord;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + landlordId, { 'headers': headers })
  }
  public getReportGroupForUnregLandLord(reportGroupIdlandlord, unreglandlordId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdlandlord;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + unreglandlordId, { 'headers': headers })
  }
  public getactivitydesc(desc): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'venserv/fetch_activitydisc?description=' + desc, { 'headers': headers })
  }
  public getReportGroupForNRILandLord(reportGroupIdlandlord, nrilandlordId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdlandlord;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + nrilandlordId, { 'headers': headers })
  }
  //agreement
  public getReportGroupForAgreement(reportGroupIdagreement, agreementId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdagreement;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + agreementId, { 'headers': headers })
  }
  public getReportGroupForExpiredAgreement(reportGroupIdagreement, expagreementId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdagreement;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + expagreementId, { 'headers': headers })
  }
  public lastMothRecord(reportGroupIdagreement, expagreementId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdagreement;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + expagreementId + '?type=last_month', { 'headers': headers })
  }
  //building approval plan
  public getReportGroupForpremise(reportGroupIdBuilding, premiseId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupIdBuilding;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + premiseId, { 'headers': headers })
  }

  //date search
  public ownedDateSearch(reportGroupId, ownedPremiseId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupId;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + ownedPremiseId + val, { 'headers': headers })
  }
  public leasedDateSearch(reportGroupId, leasedPremiseId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupId;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + leasedPremiseId + val, { 'headers': headers })
  }
  public activeDateSearch(reportGroupId, activePremiseId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupId;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + activePremiseId + val, { 'headers': headers })
  }
  public terminatedDateSearch(reportGroupId, terminatedPremiseId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupId;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + terminatedPremiseId + val, { 'headers': headers })
  }

  public rentDateSearch(reportGroupIdrent, rentId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupIdrent;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + rentId + val, { 'headers': headers })
  }

  public holdRentDateSearch(reportGroupIdrent, holdRentId, val): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupIdrent;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + holdRentId + val, { 'headers': headers })
  }
  public expiredRentSchDateSearch(reportGroupId, expiredRentScheduleId, fromdaterentsche, todaterentsche): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupId;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + expiredRentScheduleId + '?from_date=' + fromdaterentsche + '&to_date=' + todaterentsche, { 'headers': headers })
  }
  public onChangeFornextmonth(reportGroupId, expiredRentScheduleId, event): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupId;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + expiredRentScheduleId + '?exp_month=' + event, { 'headers': headers })
  }
  public regDateSearch(reportGroupIdlandlord, landlordId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupIdlandlord;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + landlordId + val, { 'headers': headers })
  }
  public unregDateSearch(reportGroupIdlandlord, unreglandlordId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupIdlandlord;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + unreglandlordId + val, { 'headers': headers })
  }
  public nriDateSearch(reportGroupIdlandlord, nrilandlordId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupIdlandlord;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + nrilandlordId + val, { 'headers': headers })
  }
  public agreeDateSearch(reportGroupIdagreement, agreementId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupIdagreement;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + agreementId + val, { 'headers': headers })
  }
  public expDateSearch(reportGroupIdagreement, expagreementId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupIdagreement;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + expagreementId + val, { 'headers': headers })
  }
  public typeDateSearch(reportGroupIdoccupany, occUsageTypeId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupIdoccupany;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + occUsageTypeId + val, { 'headers': headers })
  }
  public closedDateSearch(reportGroupIdoccupany, closedOccuId, val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupIdoccupany;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + closedOccuId + val, { 'headers': headers })
  }
  public usageCodeDateSearch(reportGroupIdoccupany, occByUsageCodeId, usageBranchId, fromdate11, todate11): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupIdoccupany;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + occByUsageCodeId + '?code=' + usageBranchId + '&from_date=' + fromdate11 + '&to_date=' + todate11, { 'headers': headers })
  }
  public buildDateSearch(reportGroupId, buildingPlanId, fromdate12, todate12): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = reportGroupId;
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + buildingPlanId + '?from_date=' + fromdate12 + '&to_date=' + todate12, { 'headers': headers })
  }

  public getUsage(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/occusagetype', { 'headers': headers })
  }
  public getUsageCodeScroll(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = remsUrl + 'pdserv/searchbranch?name=' + empkeyvalue + '&page=' + pageno;

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

  public getEmployeeScroll(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = remsUrl + 'usrserv/memosearchemp?query=' + empkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getEmployeeFilter(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'usrserv/memosearchemp?query=' + empkeyvalue, { 'headers': headers })
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
  public buildingplan(reportGroupId, buildingPlanId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = reportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/' + idValue + '/report/' + buildingPlanId, { 'headers': headers })
  }


  //memo reportgroup
  public getMemoReportGroup(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'memserv/report_group', { 'headers': headers })
  }
  public getParexpensetype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(MicroUrl + "prserv/exp_type", { 'headers': headers })
  }
  //dept
  public getReportGroupFordept(memoReportGroupId, deptId, departmentNameId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = memoReportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + deptId + '?dept=' + departmentNameId, { 'headers': headers })
  }
  public getReportGroupForEmployee(memoReportGroupId, employeeId, employeeNameId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = memoReportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + employeeId + '?emp=' + employeeNameId, { 'headers': headers })
  }
  public getReportGroupForApprovedMemo(memoReportGroupId, approvedMemoId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = memoReportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + approvedMemoId, { 'headers': headers })
  }
  public getReportGroupForPendingMemo(memoReportGroupId, pendingMemoId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = memoReportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + pendingMemoId, { 'headers': headers })
  }

  public getReportGroupForClosedMemo(memoReportGroupId, closedMemoId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = memoReportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + closedMemoId, { 'headers': headers })
  }
  public getReportGroupForEdit(memoReportGroupId, editandResubmittedMemoId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = memoReportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + editandResubmittedMemoId, { 'headers': headers })
  }
  public getReportGroupForReview(memoReportGroupId, reviewandResubmittedMemoId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let idValue = memoReportGroupId;
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + reviewandResubmittedMemoId, { 'headers': headers })
  }
  //memo date search
  public deptDateSearch(memoReportGroupId, deptId, fromdatedept, todatedept): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = memoReportGroupId;
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + deptId + '?from_date=' + fromdatedept + '&to_date=' + todatedept, { 'headers': headers })
  }
  public empDateSearch(memoReportGroupId, employeeId, fromdateemp, todateemp): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = memoReportGroupId;
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + employeeId + '?from_date=' + fromdateemp + '&to_date=' + todateemp, { 'headers': headers })
  }
  public branch_search(guery): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let idValue = memoReportGroupId;
    return this.http.get<any>(remsUrl + 'mstserv/branch_search?query=' + guery, { 'headers': headers })
  }
  public approvedDateSearch(memoReportGroupId, approvedMemoId, fromdateapp, todateapp): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = memoReportGroupId;
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + approvedMemoId + '?from_date=' + fromdateapp + '&to_date=' + todateapp, { 'headers': headers })
  }
  public pendingDateSearch(memoReportGroupId, pendingMemoId, fromdatepending, todatepending): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = memoReportGroupId;
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + pendingMemoId + '?from_date=' + fromdatepending + '&to_date=' + todatepending, { 'headers': headers })
  }
  public closedMemoDateSearch(memoReportGroupId, closedMemoId, fromdateclosedmemo, todateclosedmemo): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = memoReportGroupId;
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + closedMemoId + '?from_date=' + fromdateclosedmemo + '&to_date=' + todateclosedmemo, { 'headers': headers })
  }
  public editDateSearch(memoReportGroupId, editandResubmittedMemoId, fromdateedit, todateedit): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = memoReportGroupId;
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + editandResubmittedMemoId + '?from_date=' + fromdateedit + '&to_date=' + todateedit, { 'headers': headers })
  }
  public reviewDateSearch(memoReportGroupId, reviewandResubmittedMemoId, fromdatereview, todatereview): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let idValue = memoReportGroupId;
    return this.http.get<any>(remsUrl + 'memserv/report_group/' + idValue + '/report/' + reviewandResubmittedMemoId + '?from_date=' + fromdatereview + '&to_date=' + todatereview, { 'headers': headers })
  }

  public getStateDropDownRent(statekeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (statekeyvalue === null) {
      statekeyvalue = "";
      console.log('calling empty');
    }
    let urlvalue = remsUrl + 'mstserv/state_search?query=' + statekeyvalue;
    console.log(urlvalue);
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    })
  }

  public premiseStatus(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/premisetype?premise_status=true', { 'headers': headers })
  }


  public RCNReportSearch(from, to): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/report_group/6/report/16?from_date=" + from + "&to_date=" + to, { 'headers': headers })
  }
  public getrcnmenu(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/report_group", { 'headers': headers })
  }
  public getRcnReportSummary(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/report_group/6/report/16?from_date=&to_date=", { 'headers': headers })
  }
  public getrcnExcel(datefrom, dateto): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    console.log(datefrom);
    console.log(dateto);
    if ((datefrom == null) && (dateto == null) || (datefrom == '') && (dateto == '') || (datefrom == undefined) && (dateto == undefined)) {
      return this.http.get<any>(remsUrl + 'prserv/rcn_excelreport?from_date=&to_date=', { headers, responseType: 'blob' as 'json' })
    }
    else {
      return this.http.get<any>(remsUrl + 'prserv/rcn_excelreport?from_date=' + datefrom + '&to_date=' + dateto, { headers, responseType: 'blob' as 'json' })
    }
  }

  //   public getPOExcel(date): Observable<any> {
  //     this.reset();
  //     let token = '';
  //     const getToken = localStorage.getItem("sessionData");
  //     if (getToken) {
  //       let tokenValue = JSON.parse(getToken);
  //       token = tokenValue.token
  //     }
  //     const headers = { 'Authorization': 'Token ' + token }
  //     return this.http.post<any>(remsUrl + 'prserv/utilization_excelreport',date, { headers, responseType: 'blob' as 'json' })

  // }
  // public getparnoFK(parnokeyvalue): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(remsUrl + "prserv/search_parno?query=" + parnokeyvalue, { 'headers': headers })
  // }
  // public getparnoFKdd(parnokeyvalue, pageno): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(remsUrl + 'prserv/search_parno?query=' + parnokeyvalue + '&page=' + pageno, { 'headers': headers })
  // }
  // public getmepFK(mepkeyvalue): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(remsUrl + "prserv/search_mepno?query=" + mepkeyvalue, { 'headers': headers })
  // }
  // public getmepFKdd(mepkeyvalue, pageno): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.get<any>(remsUrl + 'prserv/search_mepno?query=' + mepkeyvalue + '&page=' + pageno, { 'headers': headers })
  // }
  // public POReportSearch(data): Observable<any> {
  //   this.reset();
  //   const getToken: any = localStorage.getItem('sessionData')
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any>(remsUrl + "prserv/utilization_dtl",data, { 'headers': headers })
  // }
  public getUsageCode(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = remsUrl + 'usrserv/search_employeebranch?query=' + empkeyvalue + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getbranchValue(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "usrserv/search_employeebranch", { 'headers': headers })
  }
  public getbranchemployee(value, branch): Observable<any> {
    this.reset();

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }

    return this.http.get<any>(remsUrl + 'usrserv/branchwise_employee_get/' + branch + '?name=' + value, { 'headers': headers })

  }
  public gettoursearch(val, pageNumber): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }


    return this.http.get<any>(remsUrl + 'taserv/report_tour_summary?page=' + pageNumber + val, { 'headers': headers })



  }
  public gettouriddownload(id, empid): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    if (empid === "") {
      return this.http.get<any>(remsUrl + 'taserv/report_download_tour_summary?tourno=' + id, { headers, responseType: 'blob' as 'json' })
    }
    else if (id === "") {
      return this.http.get<any>(remsUrl + 'taserv/report_download_tour_summary?empid=' + empid, { headers, responseType: 'blob' as 'json' })

    }
    else if (empid === undefined && id === undefined) {
      return this.http.get<any>(remsUrl + 'taserv/report_download_tour_summary?all_report=1', { headers, responseType: 'blob' as 'json' })

    }
    else {
      return this.http.get<any>(remsUrl + 'taserv/report_download_tour_summary?tourno=' + id + '&empid=' + empid, { headers, responseType: 'blob' as 'json' })
    }
  }
  public gettourdetailreport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'taserv/report_tour_detail/' + id, { 'headers': headers })
  }
  public gettourexpensereport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'taserv/claim_request/' + id + '?report=1', { 'headers': headers })
  }
  public gettourexpensedownload(id: number) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'taserv/report_download_tour_expense/' + id, { headers, responseType: 'blob' as 'json' })


  }
  public gettourdetaildownload(id: number) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'taserv/report_download_tour_detail/' + id, { headers, responseType: 'blob' as 'json' })


  }
  public gettouradvancereport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'taserv/touradvance/' + id + '?report=1', { 'headers': headers })
  }
  public getbranchwisereport(data: any, pageNumber): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let empid = tokenValue.employee_id
    const headers = { 'Authorization': 'Token ' + token }
    if (data === 1) {
      return this.http.get<any>(remsUrl + 'taserv/branchwise_pending/' + empid + '?page=' + pageNumber, { 'headers': headers })
    } else {
      return this.http.get<any>(remsUrl + 'taserv/branchwise_pending/0?page=' + pageNumber, { 'headers': headers })

    }
  }
  public getemptourreport(val, pageNumber): Observable<any> {
    this.reset();

    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    if (val == "") {
      return this.http.get<any>(remsUrl + 'taserv/report_tourid_summary/0?page=' + pageNumber, { 'headers': headers })

    }
    return this.http.get<any>(remsUrl + 'taserv/report_tourid_summary/' + val, { 'headers': headers })
  }
  public getempreportdownload(id: any) {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    if (id == '') {
      return this.http.get<any>(remsUrl + 'taserv/report_download_tourid?all_report=1', { headers, responseType: 'blob' as 'json' })

    }
    return this.http.get<any>(remsUrl + 'taserv/report_download_tourid/' + id, { headers, responseType: 'blob' as 'json' })
  }
  public getconsolidatereport(id: number): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'taserv/consolidate_report/' + id, { 'headers': headers })
  }
  public getapproveflowalllist(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'taserv/approval_flow_get?type=all&tourid=' + id + '&report=1', { 'headers': headers })
  }

  public getPOExcel(date): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'prserv/utilization_excelreport', date, { headers, responseType: 'blob' as 'json' })

  }
  public getparnoFK(parnokeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "prserv/search_parno?query=" + parnokeyvalue, { 'headers': headers })
  }
  public getparnoFKdd(parnokeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'prserv/search_parno?query=' + parnokeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public getmepFK(mepkeyvalue): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "prserv/search_pcano?query=" + mepkeyvalue, { 'headers': headers })
  }
  public getmepFKdd(mepkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'prserv/search_pcano?query=' + mepkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public POReportSearch(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "prserv/utilization_dtl", data, { 'headers': headers })
  }
  public ProcureReportSearch(data, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }


    return this.http.post<any>(remsUrl + 'prserv/report_prpo?page=' + page, data, { 'headers': headers })



  }
  public send_mail1(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "venserv/send_from_report", data, { 'headers': headers })
  }
  public send_mail(vendorid, activityid, data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "venserv/activity_risk_que_mail_alert?vendor_id=" + vendorid + "&activity_id=" + activityid, data, { 'headers': headers })
  }


  public getReportsModule(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "pdserv/report_modulelist", { 'headers': headers })
  }

  public getChannelFKdd(keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'inwdserv/get_inward_channeldata', { 'headers': headers })
  }

  public getCourierFKdd(keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'mstserv/courier_search?query=' + keyvalue + '&page=' + pageno, { 'headers': headers })
  }

  public getbranchFK(branchkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'usrserv/branch_employee?query=' + branchkeyvalue + '&page=' + pageno, { 'headers': headers })
  }
  public docAssignUnAssignstatusDD(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'inwdserv/inward_docstatus', { headers })
  }
  public getSearchstatusList(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'inwdserv/inward_status', { headers })
  }
  public DocumenttypeSearchAPI(key, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'mstserv/search_doctype?query=' + key + '&page=' + page, { headers })
  }
  public ActiontypeDD(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'inwdserv/inward_action', { headers })
  }
  public docstatusDD(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'inwdserv/inward_docaction', { headers })
  }
  public getInwardExcel(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    console.log("headers for excel", headers)
    return this.http.get<any>(remsUrl + 'inwdserv/inwardreport_all?assignedto=' + data.assignedto + '&from_date=' + data.from_date + '&to_date=' + data.to_date + '&awb_no=' + data.awb_no + '&channel_id=' + data.channel_id + '&courier_id=' + data.courier_id + '&docaction=' + data.docaction + '&docstatus=' + data.docstatus + '&doctype_id=' + data.doctype_id + '&branch_id=' + data.branch_id + '&docnumber=' + data.docnumber + '&inward_no=' + data.inward_no, { 'headers': headers, responseType: 'blob' as 'json' })

  }
  public InwardReportSearch(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'pdserv/report_group/8/report/16?assignedto=' + data.assignedto + '&from_date=' + data.from_date + '&to_date=' + data.to_date + '&awb_no=' + data.awb_no + '&channel_id=' + data.channel_id + '&courier_id=' + data.courier_id + '&docaction=' + data.docaction + '&docstatus=' + data.docstatus + '&doctype_id=' + data.doctype_id + '&branch_id=' + data.branch_id + '&docnumber=' + data.docnumber + '&inward_no=' + data.inward_no, { 'headers': headers })
  }



  public getinvendorproductsummary(id, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'venserv/vendor_productinfo/' + id + '?page=' + page, { 'headers': headers })
  }
  public getRiskData(vendorid, activity_id, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'venserv/report_risk_view/' + vendorid + '/' + activity_id + '?page=' + page, { 'headers': headers })
  }
  public getinvendorproductreport(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'venserv/vendor_productinfo/' + id + '?is_download=1', { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public particularDownload(id, mapId): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'venserv/report_risk_view_download/' + id + '/' + mapId, { 'headers': headers, responseType: 'blob' as 'json' })
  }



  public getschemalist(data): Observable<any> {
    this.reset();
    let obj = { "report_id": data }
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(remsUrl + "reportserv/database_get?name=" + data, { 'headers': headers })
  }
  public gettablelist(data, table): Observable<any> {
    this.reset();
    let obj = { "report_id": data }
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(remsUrl + "reportserv/db_table_get/" + data + '?name=' + table, { 'headers': headers })
  }
  public getcolumnList(schema, table, column): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.get<any>(remsUrl + "reportserv/db_column_get/" + schema + '/' + table + '?name=' + column, { 'headers': headers })
  }
  public getquerydata(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(remsUrl + "reportserv/db_table_execute", data, { 'headers': headers })
  }
  public getquerydatadownload(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(remsUrl + "reportserv/querydata_download", data, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public getactivitydesignation(value, page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(remsUrl + "mstserv/create_activity?query=" + value + '&page=' + page, { 'headers': headers })
  }

  public reportquestionnairehistory(value): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // let params: any = new HttpParams();
    // params = params.append('page', pageNumber.toString());
    return this.http.get<any>(remsUrl + "venserv/history_get/" + value, { 'headers': headers })
  }
  public trial_balancereport_xl(data): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "reportserv/tb_datadownload", data, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public manualRunTB(data): Observable<any> {
    this.reset();
    let obj = { "report_id": data }
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(remsUrl + "reportserv/trialbalance_mannualrun", obj, { 'headers': headers })
  }
  public getTbForecastPrepare(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/tb_reportdownload", data, { 'headers': headers });
  }

  public provisionReportSearch(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // const requestOptions: Object = { 
    //   'headers': headers,
    //   responseType: 'blob' as 'json',
    //   observe: 'response'
    // }
    // let resp = this.http.get<any>(remsUrl + 'prsnserv/stand_by_provision_report?from_date='+data?.fromdate+ '&to_date='+data?.todate+'&provision_status='+ data?.status, 
    // requestOptions ) 
    // return resp
    return this.http.get<any>(remsUrl + 'prsnserv/stand_by_provision_report?from_date=' + data?.fromdate + '&to_date=' + data?.todate + '&provision_status=' + data?.status, { 'headers': headers, responseType: 'blob' as 'json', observe: 'response' })
  }


  public report_dropdownAction(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'prsnserv/provision_status_filter?action=report', { 'headers': headers })
  }
  public detailsmanualRunTB(data): Observable<any> {
    this.reset();
    let obj = { "report_id": data }
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(remsUrl + "reportserv/fetch_pprtb_manualrun", obj, { 'headers': headers })
  }
  public getSimpleTbPrepare(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/stb_prepare_excel", data, { 'headers': headers });
  }
  public getdetTbForecastPrepare(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/fetch_ppr_preparexcel", data, { 'headers': headers });
  }
  public tb_reportExceldownload(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/fetch_ppr_preparexcel1", data, { 'headers': headers });
  }
  public trial_balancedetailcereport_xl(data): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "reportserv/fetch_pprtb_exceldownload", data, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public getfilestatus(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'reportserv/qem_status', { 'headers': headers })
  }
  public getqryexecfilesearch(data, page): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }


    return this.http.post<any>(remsUrl + 'reportserv/qem_request?page=' + page, data, { 'headers': headers })



  }

  public getrm(val, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (val === null) {
      val = "";

    }
    let urlvalue = remsUrl + 'usrserv/memosearchemp?query=' + val + '&page=' + pageno;
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getschema(val): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    let urlvalue;
    if (val == "") {
      urlvalue = remsUrl + 'reportserv/database_get';
    }
    else {
      urlvalue = remsUrl + 'reportserv/database_get?name=' + val;
    }
    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public createqryexecfile(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }


    return this.http.post<any>(remsUrl + 'reportserv/qem_request', data, { 'headers': headers })



  }
  public qryexecapprovereject(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }


    return this.http.post<any>(remsUrl + 'reportserv/qem_approve', data, { 'headers': headers })



  }

  public gettype(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }


    return this.http.get<any>(remsUrl + 'reportserv/get_query_type', { 'headers': headers })



  }

  public downloadExecFile(file): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'reportserv/qem_get_files/' + file, { 'headers': headers, responseType: 'blob' as 'json' })

  }

  public new_trial_balancedetailcereport_xl(data): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "reportserv/fetch_new_glpprtb_exceldownload", data, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  public detail_trial_balancedetailcereport_zip(data): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "reportserv/fetch_dtb_zip_download", data, { 'headers': headers, responseType: 'blob' as 'json' })
  }

  //summary
  public getsum1(NORMAL: any, glno: any, branch: any, page: any, _from_date: any, _to_date: any): Observable<any> {
    const sum1 = {
      "RECORD": NORMAL,
      "GL_NO": glno,
      "BRANCH_ID": branch,
      "FROM_DATE": _from_date,
      "TO_DATE": _to_date,
      // "PAGE": page
    };
    let PAGE = page

    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };

    // Modify the URL to point to the correct API endpoint
    return this.http.post<any[]>(appURL + 'reportserv/tbsummary?page=' + PAGE, sum1, { 'headers': headers });
  }
  public getsum2(SIMPLE: any, glno: any, branch: any, page: any, _from_date: any, _to_date: any): Observable<any> {
    const sum1 = {
      "RECORD": SIMPLE,
      "GL_NO": glno,
      "BRANCH_ID": branch,
      "FROM_DATE": _from_date,
      "TO_DATE": _to_date,
      // "PAGE": page
    };
    let PAGE = page

    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token };

    // Modify the URL to point to the correct API endpoint
    return this.http.post<any[]>(appURL + 'reportserv/tbsummary?page=' + PAGE, sum1, { 'headers': headers });
  }

  // public getsum2(DATERANGE: any, _from_date: any, _to_date: any, page: any): Observable<any> {
  //   const sum2 = {
  //     "RECORD": DATERANGE,
  //     "FROM_DATE": _from_date,
  //     "TO_DATE": _to_date,
  //     "PAGE": page
  //   };
  //   let PAGE=page
  //   const getToken = localStorage.getItem("sessionData")
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   return this.http.post<any[]>(appURL + 'reportserv/tbsummary?page='+PAGE, sum2, { 'headers': headers });

  // }
  public getsum3(DETAILS: any, branch: any, subcatName: any, ccName: any, _from_date: any, _to_date: any, page: any): Observable<any> {
    const sum3 = {
      "RECORD": DETAILS,
      "BRANCH_ID": branch,
      "SUBCAT": subcatName,
      "CC": ccName,
      "FROM_DATE": _from_date,
      "TO_DATE": _to_date,
      "PAGE": page

    };
    let PAGE = page
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any[]>(appURL + 'reportserv/tbsummary?page=' + PAGE, sum3, { 'headers': headers });

  }
  public getsum4(GL: any, _from_date: any, _to_date: any, page: any): Observable<any> {
    const sum4 = {
      "RECORD": GL,
      "FROM_DATE": _from_date,
      "TO_DATE": _to_date,


    };
    let PAGE = page
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any[]>(appURL + 'reportserv/tbsummary?page=' + PAGE, sum4, { 'headers': headers });

  }

  public searchData(_from_date: Date, _to_date: Date, branch: string, glNo: string): Observable<any> {

    const payload = { _from_date, _to_date, branch, glNo };
    const bb = {

      "GL_NO": glNo,
      "BRANCH_ID": branch,
      "FROM_DATE": _from_date,
      "TO_DATE": _to_date,
      // "selectedCCIds":ccName ,
      // "PAGE": page
    };
    // let PAGE=page
    let PAGE = 1
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(appURL + 'reportserv/tbsummary?page=' + PAGE, payload, { 'headers': headers });
  }

  public selectedbranch(page: any, value: any) {
    let PAGE = page
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(appURL + 'usrserv/empbranch_search?page=' + PAGE + '&query=' + value, { 'headers': headers });
  }

  public subcatList(page: any, value: any,): Observable<any> {
    let PAGE = page
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(appURL + 'mstserv/apsubcat_summary?page=' + PAGE + '&value=' + value, { 'headers': headers });

  }
  public gl_noList(page: any, no: any): Observable<any> {
    let PAGE = page
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(appURL + 'usrserv/gl_summary?page=' + PAGE + '&no=' + no + '&status=ACTIVE', { 'headers': headers });

  }

  public ccList(page: any, value: any): Observable<any> {
    let PAGE = page
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(appURL + 'usrserv/get_cclist_dropdown?page=' + PAGE + '&value=' + value, { 'headers': headers });
    // userserv/get_cclist_dropdown?page=1&value=
  }
  public pdfDownload(id): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(appURL + 'venserv/riskfile_download/' + id, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public upload(formData: FormData): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(appURL + 'reportserv/upload_dtbcb', formData, { 'headers': headers });

  }
  public getSimpleTbDownload(data): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/simple_tbdownload", data, { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public getdetTbReconDownload(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/dtbrecon_excel_download", { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public TB_Recon_Stop(): Observable<any> {

    const startstop = { 'startstop': 'stop' }
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/dtbrecon_excel_startstop", startstop, { 'headers': headers });
  }
  public getTbEXcelPrepare(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/dtbrecon_excel", { 'headers': headers });
  }
  public trial_balancedetailcereport_xl1(data): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "reportserv/fetch_pprtb_exceldownload1", data, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public detail_tb_correction_run(data: any): Observable<any> {
    // this.reset();
    // let obj = { "report_id": data }
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(remsUrl + "reportserv/dtb_correction", data, { 'headers': headers })
  }
  public getsimpleTbEXcelPrepare(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/tb_dtb_recon_excel", { 'headers': headers });
  }
  public Simple_TB_Recon_Stop(): Observable<any> {
    const startstop = { 'startstop': 'stop' }
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/dtb_tbrecon_startstop", startstop, { 'headers': headers });
  }
  public simple_getTbReconDownload(file): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/tb_dtbrecon_download/" + file, { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public PPRTBEXcelPrepare(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/dtb_ppr_prepare_excel", { 'headers': headers });
  }
  public PPR_TB_Recon_Stop(): Observable<any> {
    const startstop = { 'startstop': 'stop' }
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/dtb_ppr_recon_startstop", startstop, { 'headers': headers });
  }
  public PPRTbReconDownload(file): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/dtb_ppr_recon_download/" + file, { 'headers': headers, responseType: 'blob' as 'json' });
  }

  public PPRTbReconsummary(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/dtb_ppr_summary", { 'headers': headers });
  }
  public Tb_DTB_Reconsummary(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/tb_dtb_summary", { 'headers': headers });
  }
  public Closingbal_EXcelPrepare(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/tb_dtb_cb_recon", { 'headers': headers });
  }
  public closingbal_tb_Download(file): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/tb_dtb_cb_download/" + file, { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public bankrecon_ExcelPrepare(data): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/bank_whole_cb_prepare", data, { 'headers': headers });
  }
  public bankrecon_tb_Download(file): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/bank_whole_cb_download/" + file, { 'headers': headers, responseType: 'blob' as 'json' });
  }

  public glrecon_ExcelPrepare(data): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/dtpstamptrail_report?from_date=" + data, { 'headers': headers });
  }
  public glrecon_tb_Download(file): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/gl_whole_cb_download/" + file, { 'headers': headers, responseType: 'blob' as 'json' });
  }

  public glrecon_TB_summary(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/gl_recon_summary", { 'headers': headers });
  }
  public bankrecon_TB_summary(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/bank_recon_summary", { 'headers': headers });
  }
  public Fa_recon_TB_summary(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/fa_ppr_summary", { 'headers': headers });
  }
  public FA_internal_ExcelPrepare(data): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/fa_internal_recon_prepare", data, { 'headers': headers });
  }
  public FA_internal_recon_Download(file): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/fa_internal_recon_download/" + file, { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public FA_ppr_ExcelPrepare(data): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/fa_with_ppr_recon", data, { 'headers': headers });
  }
  public FA_ppr_recon_Download(file): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/fa_ppr_recon_download/" + file, { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public LedgerSummary_data(data, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    params = { 'page': page }
    return this.http.post<any>(remsUrl + "reportserv/ledger_tb_summary", data, { 'headers': headers, params });
  }
  public Ledgertb_excelPrepare(data): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/ltb_xl_prepare", data, { 'headers': headers });
  }
  public Ledger_tb_Download(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/ltb_xl_download", { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public getGLTbPrepare(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/tb_branch_prepare", data, { 'headers': headers });
  }
  public GL_report_Download(): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "reportserv/tb_branch_download", { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public branch_gl_ExcelPrepare(data): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/branchwise_gl_summary", data, { 'headers': headers });
  }
  public Branchwisegl_Summary(data, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    params = { 'page': page }
    return this.http.post<any>(remsUrl + "reportserv/branchwise_gl_summary", data, { 'headers': headers, params });
  }
  public branchwise_gl_Download(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/gl_report_download", { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public getempbranchedrop(empname, page = 1): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(appURL + 'usrserv/empbranch_search?page=' + page + '&query=' + empname, { 'headers': headers })
  }
  public getexpense(expence, page = 1): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(appURL + 'mstserv/expensegrp_search?page=' + page + '&query=' + expence, { 'headers': headers })
  }
  public getglno_list(glno, page): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenvalue = JSON.parse(getToken);
    let token = tokenvalue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    params = params.append('page', page.toString());
    return this.http.get<any>(appURL + 'usrserv/fetch_glno?data=' + glno, { 'headers': headers, params })
  }
  public apiexplorer(data: any) {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(remsUrl + 'reportserv/api_explorer', data, { 'headers': headers });
  }
  public apiexplorer_downloadapis(data: any) {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(remsUrl + 'reportserv/api_explorer', data, { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public exceldownload(data: any) {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(remsUrl + 'reportserv/api_explorer', data, { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public getppr_data(page, data: any) {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(remsUrl + 'reportserv/get_branchwisegl_pprdata?page=' + page, data, { 'headers': headers });
  }

  public get_ppr_excel(data: any) {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post(remsUrl + 'reportserv/prepare_branchwisegl_pprdata', data, { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public get_Branchwisegl_Summary_new(data, page): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    let params: any = new HttpParams();
    params = { 'page': page }
    return this.http.post<any>(remsUrl + "reportserv/branchwise_gl_summary_ppr?page=" + page, data, { 'headers': headers, params });
  }
  public getVendorManualRun(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(remsUrl + "reportserv/vendorbalance_mannual_stamp", data, { 'headers': headers, params })
  }
  public Bulkupload(formData): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
    const options = {
      headers: headers,
      responseType: 'blob' as 'json'
    };
    return this.http.post<any>(remsUrl + "venserv/migration_vendor_create", formData, { 'headers': headers, responseType: 'blob' as 'json' })
      .pipe(
        catchError(this.handleResponse)
      );

  }



  public IMmigrationDownloadReportpdf(formData): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = new HttpHeaders({ 'Authorization': 'Token ' + token });
    const options = {
      headers: headers,
      responseType: 'blob' as 'json'
    };
    return this.http.post<any>(remsUrl + "venserv/iam_bulk_vendor", formData, { 'headers': headers, responseType: 'blob' as 'json' })


      .pipe(
        catchError(this.handleResponse)
      );
  }
  public getVendorDownloadReportpdf(id, date): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "reportserv/download_vendorstatement_pdf?supplier_id=" + id + '&from_date=' + date, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public getVendorDownloadReport(id, date): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "reportserv/download_vendorstatement?supplier_id=" + id + '&from_date=' + date, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public getVendorDetailsName(d): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(remsUrl + "reportserv/fetch_vendorbalance_merge?Type=Name", d, { 'headers': headers, params })
  }
  public getVendorDetails(data): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    let params: any = new HttpParams();
    return this.http.post<any>(remsUrl + "reportserv/fetch_vendorbalance_merge", data, { 'headers': headers, params })
  }
  public getvensearch(query: any, page: any): Observable<any> {
    let data: any = { 'branch': query }
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'reportserv/search_suppliername_dropdown?query=' + query + '&page=' + page, { 'headers': headers })
  }
  public getRole(): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "reportserv/fetch_role_report", { 'headers': headers })
  }
  public cbs_fileupload(data:any){
    this.reset();
    const getToken =localStorage.getItem("sessionData")
    let tokenValue =JSON.parse(getToken);
    let token= tokenValue.token
    const headers ={'Authorization':'Token ' + token}
    return this.http.post<any>(remsUrl + 'reportserv/cbs_file_upload', data ,{'headers':headers})
  }
  public branchsyncapi(): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "usrserv/empl_branch_scheduler", { 'headers': headers })
  }
  public empsyncapi(): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "usrserv/employee_sync", { 'headers': headers })
  }
    public getnTbForecastPrepare(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "reportserv/ntb_ppr_prepare_excel", data, { 'headers': headers });
  }
  public ntb_detailcereport_xl(): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "reportserv/ntb_ppr_excel_download/NTB_WITH_PPR_REPORT", { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public getposubmodFK(mep, keyvalue): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      if ((mep == null) || (mep == undefined) || (mep == "")) {
        return this.http.get<any>(remsUrl + "mstserv/searchcommodity?query=", { 'headers': headers })
      }
      else {
        return this.http.get<any>(MicroUrl + "prserv/mep_pr?mep_no="+mep+"&name="+keyvalue, { 'headers': headers })
      }
    }
  
    public getposubmodFKdd(mep, keyvalue, pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      if ((mep == null) || (mep == undefined) || (mep == "")) {
        return this.http.get<any>(remsUrl + "mstserv/searchcommodity?query=" + keyvalue + '&page=' + pageno, { 'headers': headers })
      }
      else {
        return this.http.get<any>(MicroUrl + "prserv/mep_pr?mep_no="+mep+"&name="+keyvalue+'&page='+pageno, { 'headers': headers })
      }
    }

  
  public getPrpoRpts(): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "prserv/get_prpo_report_status", { 'headers': headers })
  }
  public getPrpoGrnDet(po, page): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "prserv/po_grn_details?po_no="+ po +"&page=" + page, { 'headers': headers })
  }

   public po_details_report(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "prserv/prpo_common_reports?report_type=2&is_summary=1", data, { 'headers': headers });
  }

  public po_detail_download(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(remsUrl + "prserv/prpo_common_reports?report_type=2&is_summary=0", data,  { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public getPRPOAssets(id, sno,page): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "prserv/search_assetid_get?asset_id="+ id+"&serial_no="+sno+"&page="+page, { 'headers': headers })
  } 
  public getpdtclasstype(data,page): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "mstserv/pdtclasstype?data="+data+"&page="+page, { 'headers': headers })
  }
  
  public getPOAssetSummary(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'prserv/prpo_common_reports?report_type=3&is_summary=1', data, { headers })

  }
  
  public getPOAssetDownload(data): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "prserv/prpo_common_reports?report_type=3&is_summary=0", data, { 'headers': headers, responseType: 'blob' as 'json' })
  }
  public wisefintb(data,bscc,jv,jw,fa,expense) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
 
      console.log("upload api",data)
      console.log("upload file",bscc,jv,jw,fa,expense)
      let json = Object.assign({}, data);
      let formData = new FormData();
      formData.append("data", JSON.stringify(json));
      formData.append("bscc", bscc);
      formData.append("jv", jv);
      formData.append("jw", jw);
      formData.append("fa", fa);
      formData.append("expense", expense);
      formData.append("user_id", '1');
     
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      appURL + "reportserv/wisefin_tb_upload" ,formData,{ headers: headers }
    );
  }
  
  public prepareWisefintb(data): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "reportserv/prepare_wisefin_tb", data, { 'headers': headers})
  }
  public wisefin_tb_summary() {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
      
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      appURL + "reportserv/wisefin_tb_summary" ,{ headers: headers }
    );
  }
  
  public tb_s3_download(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      appURL + "reportserv/wisefin_tb_excel_download/Integrity",{ headers: headers , responseType: "blob" as "json"}
    );
  }
  
    public tb_status_tb(date): Observable<any> {
      this.reset();
      const getToken = localStorage.getItem("sessionData");
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token; 
      const headers = { Authorization: "Token " + token };
      return this.http.delete<any>(
        appURL + "integrityserv/tb_interintegrity?date="+date,{ headers: headers }
      );
    }
      public download_TB_template(type): Observable<any> {
          this.reset();
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);
          let token = tokenValue.token;
          const headers = { Authorization: "Token " + token };
          return this.http.get<any>(
            appURL + 'reportserv/TB_creation_template?type='+type,
            { headers: headers, responseType: "blob" as "json" }
          );
        }
  
 public glfileupload(formData: FormData): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(appURL + 'reportserv/upload_narration', formData, { 'headers': headers });

  }
   public getglsummaryapi(data,page): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "reportserv/prepare_glstmt?page="+page, data, { 'headers': headers})
  }
public gl_statement_ref_api(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      appURL + "reportserv/glstmt_file_summary",{ headers: headers}
    );
  }
   public gl_file_download(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(remsUrl + "reportserv/glstmt_download", { 'headers': headers, responseType: 'blob' as 'json' });
  }
  public fileupload_ref_api(): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token; 
    const headers = { Authorization: "Token " + token };
    return this.http.get<any>(
      appURL + "reportserv/narration_file_summary",{ headers: headers}
    );
  }
  public getsupplierDropdownFKdd(keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    keyvalue == undefined || typeof keyvalue == "object" ? keyvalue = "" : keyvalue
  
    return this.http.get<any>(appURL+"venserv/supplier_list?query="+ keyvalue + '&page=' + pageno, { 'headers': headers })
  
  }
    public getproductfn(comid,prod,key, pageno): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      key == undefined || typeof key == "object" ? key = "" : key
      // return
      if(comid && !prod){
      return this.http.get<any>(appURL + "prserv/cpMap/" + comid +'?query='+ key + '&page=' + pageno, { 'headers': headers })
    } else if(comid && prod){
      return this.http.get<any>(MicroUrl + "prserv/prpo_cp/"+comid+"?request_type=" + prod + "&query="+key + "&page="+ pageno, {'headers': headers })
  
    } else if(!comid && prod){
      return this.http.get<any>(MicroUrl + "mstserv/producttype_get_product/"+prod+"?query="+key + "&page="+ pageno, {'headers': headers })
  
    }else {
      return this.http.get<any>(appURL +'mstserv/productsearch?query='+key+'&page='+pageno,{ 'headers': headers })
    }
    }
     public getproductType(): Observable<any> {
        this.reset();
        const getToken: any = localStorage.getItem('sessionData')
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(appURL + 'mstserv/productclassification', { 'headers': headers })
      }
        public getPOListNew(): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "prserv/po_reports_submodule", { 'headers': headers })
  }
   public getGRNAssetSummary(data): Observable<any> {
    this.reset();
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + 'prserv/prpo_common_reports?report_type=5&is_summary=1&is_prdetails=1&page=1', data ,{ headers })

  }
      public DownloadExcel(obj): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
 
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(MicroUrl + 'prserv/prpo_common_reports?report_type=5&is_summary=0&is_prdetails=1', obj,{ 'headers': headers, responseType: 'blob' as 'json' })
}
  public getDepartmentScrolls(empkeyvalue, pageno): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    if (empkeyvalue === null) {
      empkeyvalue = "";

    }
    let urlvalue = remsUrl + 'prserv/reports_search_parno?query=' + empkeyvalue + '&page=' + pageno;

    return this.http.get(urlvalue, {
      headers: new HttpHeaders()
        .set('Authorization', 'Token ' + token)
    }
    )
  }
  public getDepartmentFilters(empkeyvalue): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'prserv/reports_search_parno?query=' + empkeyvalue, { 'headers': headers })
  }

   public getgrnAssets(id,page, sno): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "prserv/search_assetid_new?query="+ id+"&serialno_query="+sno+"&page="+page, { 'headers': headers })
}
  public getbranch(branchkeyvalue,page): Observable<any> {
     this.reset();
     const getToken: any = localStorage.getItem('sessionData')
     let tokenValue = JSON.parse(getToken);
     let token = tokenValue.token
     const headers = { 'Authorization': 'Token ' + token }
     return this.http.get<any>(remsUrl + "usrserv/search_branch?query=" + branchkeyvalue+'&page=' + page, { 'headers': headers })
   }
    public getProductNames(): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "mstserv/product_search?query=&page=1", { 'headers': headers })
  }
  public getsupplierDropdown(): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    // return this.http.get<any>(PRPOUrl+"venserv/landlordbranch_list?query=", {'headers': headers })
    return this.http.get<any>(remsUrl+"venserv/supplier_list?query=", {'headers': headers })
  
  }

   public getgrnSummary(data,page): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "prserv/prpo_common_reports?report_type=5&is_summary=1&is_prdetails=1&page="+page, data , { 'headers': headers })
}
public getassetDropdownFKdd(keyvalue, pageno): Observable<any> {
    this.reset();
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    keyvalue == undefined || typeof keyvalue == "object" ? keyvalue = "" : keyvalue
  
    return this.http.get<any>(appURL+"venserv/search_assetid_new?query="+ keyvalue + '&page=' + pageno, { 'headers': headers })
  
  }

 public input_getproductType(): Observable<any> {
        this.reset();
        const getToken: any = localStorage.getItem('sessionData')
        let tokenValue = JSON.parse(getToken);
        let token = tokenValue.token
        const headers = { 'Authorization': 'Token ' + token }
        return this.http.get<any>(appURL + 'mstserv/productclassification', { 'headers': headers })
      }
   public get_prod_name(data,page): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + "mstserv/product_search?query="+data+"&page="+page, { 'headers': headers })
  }
   public get_prod_name_type(data,id,page): Observable<any> {
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'mstserv/producttype_get_product/'+id+'?query='+data+'&page='+page, { 'headers': headers })
  }
      public grnupdatexldownload(obj): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
 
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(MicroUrl + 'prserv/grn_asset_report', obj,{ 'headers': headers, responseType: 'blob' as 'json' })
}
public grnbulkupload(file) {
    this.reset();
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
      let formData = new FormData();
      formData.append("file", file);
    const headers = { Authorization: "Token " + token };
    return this.http.post<any>(
      appURL + "prserv/grn_asset_other_attribute_update_fields" ,formData,{ headers: headers }
    );
  }
    public grnfile_id_download(id): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
 
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.get<any>(MicroUrl + 'prserv/prpo_filedownload/'+id,{ 'headers': headers, responseType: 'blob' as 'json' })
}
 public grnupdate_finalsubmit(obj): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
 
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(MicroUrl + 'prserv/grn_asset_otherattribute_bulk_update', obj,{ 'headers': headers })
}

 public trangbtl(data: any): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.post<any>(MicroUrl + "reportserv/tran_gl_tb_prepare", data, { 'headers': headers });
  }

   public gettrantbdownload(): Observable<any> {
    const getToken: any = localStorage.getItem('sessionData')
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token };
    return this.http.get<any>(MicroUrl + "reportserv/tran_gl_tb_download ", { 'headers': headers ,  responseType: 'blob' as 'json'});
  }


  public pcafilterapi(query,page): Observable<any> {
    this.reset();
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.get<any>(remsUrl + 'prserv/reports_search_pcano?query='+query+'&page='+page, { 'headers': headers })
  }
    public pcareportdownload(bpa, type): Observable<any> {

  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
if (!bpa || Object.keys(bpa).length === 0) {
  this.dict = {};
} else {
  this.dict = { pca_no: bpa };
}
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(MicroUrl + 'prserv/prpo_common_reports?report_type=6&is_summary=' + type, this.dict,{ 'headers': headers, responseType: 'blob' as 'json' })
}
  public getReportpca(bpa, type): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  let dict = {
    pca_no: bpa,
  }
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(MicroUrl + 'prserv/prpo_common_reports?report_type=6&is_summary=' + type, dict, { 'headers': headers })
}
  
  public geemployeeqrySummary(data): Observable<any> {   
    const getToken = localStorage.getItem("sessionData")
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token
    const headers = { 'Authorization': 'Token ' + token }
    return this.http.post<any>(remsUrl + "monoserv/get_onward_data", data , { 'headers': headers })

}
 public geteqbranch(branchkeyvalue,page): Observable<any> {
     this.reset();
     const getToken: any = localStorage.getItem('sessionData')
     let tokenValue = JSON.parse(getToken);
     let token = tokenValue.token
     const headers = { 'Authorization': 'Token ' + token }
     return this.http.get<any>(remsUrl + "usrserv/search_branch?query=" + branchkeyvalue+'&page=' + page, { 'headers': headers })
   }
  public getStatus(): Observable<any> {
      this.reset();
      const getToken: any = localStorage.getItem('sessionData')
      let tokenValue = JSON.parse(getToken);
      let token = tokenValue.token
      const headers = { 'Authorization': 'Token ' + token }
      return this.http.get<any>(remsUrl + "prserv/get_allstatus/3", { 'headers': headers })
    }
  public DownloadeqExcel(obj): Observable<any> {
  this.reset();
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
 
  const headers = { 'Authorization': 'Token ' + token }
  return this.http.post<any>(MicroUrl + 'prserv/prpo_common_reports?report_type=5&is_summary=0&is_prdetails=1', obj,{ 'headers': headers, responseType: 'blob' as 'json' })
}
   
public TBclosing_summary(): Observable<any> {
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.get<any>(remsUrl + "reportserv/tb_cb_summary", { 'headers': headers });
}
public TBclosing_ExcelPrepare(data): Observable<any> {
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.post<any>(remsUrl + "reportserv/tb_cb_report", data, { 'headers': headers });
}
public TBclosing_Download(): Observable<any> {
  const getToken: any = localStorage.getItem('sessionData')
  let tokenValue = JSON.parse(getToken);
  let token = tokenValue.token
  const headers = { 'Authorization': 'Token ' + token };
  return this.http.get<any>(remsUrl + "reportserv/tb_cb_excel_download", { 'headers': headers, responseType: 'blob' as 'json' });
}

}