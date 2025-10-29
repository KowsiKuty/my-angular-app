import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
// const crmurl = environment.apiURLS
const crmurl = environment.apiURL
// const token_n = environment.token

@Injectable({
  providedIn: 'root'
})



export class MasterApiServiceService {

  subscriptions: Subscription[] = [];
  constructor(private spinner: NgxSpinnerService, private http: HttpClient, private notification: NotificationService) {

  }
  method;
  body;
  responsetype;
  showsuccess;
  token = null;
  productID: any;
  leadId: number = null;
  taskObject: any = null;
  leadWithTasks: any = [];
  isReload = new Subject();

  editableComponentAPI: any = {
    address: 'lead_address',
    bank: 'lead_bank',
    contact: 'lead_contactinfo',
    family: 'lead_familyinfo'
  }

  dropdownUrl = {
    branch_id: '',
    bank_id: '',
    pincode: 'mstserv/pincode?query=',
    city_name: 'mstserv/new_city_search?query=',
    state_name: 'mstserv/state_search?query=',
    district_name: 'mstserv/district_search?query=',
    marital_status: ''
  }


  unsubscibe() {
    console.log(this.subscriptions)
    this.subscriptions?.forEach(element => {
      element.unsubscribe()
    })
    this.subscriptions = [];
  }

  nullify() {
    console.log('Nullifying')
    this.taskObject = null;
    this.leadWithTasks = []
  }

  getproductid() {
    return this.productID;
  }
  getToken() {
    let token = '';
    const getToken = localStorage.getItem("sessionData");
    if (getToken) {
      let tokenValue = JSON.parse(getToken);
      token = tokenValue.token
    }
    this.token = { 'headers': { 'Authorization': 'Token ' + token } }
  }


  handlePut(response: any) {
    this.spinner.hide();
    if (response?.status == 'success' || response?.message == 'success') {
      this.notification.showSuccess(response.message);
    }
    else if (response['description']) {
      this.notification.showError(response.description);
    }
    else if (response?.status == 'error') {
      this.notification.showError(response?.message)
    }
    return response;
  }

  handleGet(response: any, url) {
    // if (url.includes('prodserv/lead_mapping_summary?')){
    //   this.leadWithTasks = response['data'];
    // }
    this.spinner.hide();
    return response;
  }

  postCall(url, body) {
    this.getToken()
    return this.http.post<any>(`${crmurl}${url}`, body, this.token).pipe(
      map((response: any) =>
        this.handlePut(response)
      ),
      catchError((err) =>
        this.spinner.hide()
      )
    )
  }
  getCall(url) {
    this.getToken();
    return this.http.get<any>(`${crmurl}${url}`, this.token).pipe(
      map((response: any) => this.handleGet(response, url)
      ),
      catchError((err) => this.spinner.hide()
      )
    )
  }

  createTask(data) {
    this.spinner.show()
    let url = 'prodserv/tasktemplate'
    return this.postCall(url, data);
  }
  getTask(params) {
    this.spinner.show()
    let url = 'prodserv/tasktemplate?' + params
    return this.getCall(url);
  }
  getTasklist(params) {
    // this.spinner.show()
    let url = 'prodserv/tasksummary?' + params;
    return this.getCall(url)
  }
  getProductList(params) {
    // this.spinner.show()
    let url = 'prodserv/product?' + params;
    return this.getCall(url)
  }
  getMappedList(params) {
    // this.spinner.show()
    let url = 'prodserv/lead_mapping_summary?' + params;

    return this.getCall(url)
  }
  mapLeadProduct(data) {
    this.spinner.show()
    let url = 'prodserv/lead_mapping'
    return this.postCall(url, data);
  }

  getEmployeeTask(data) {
    this.spinner.show();
    let url = 'prodserv/leadtask';
    return this.postCall(url, data)
  }

  taskStatusUpdate(params, data) {
    this.spinner.show();
    let url = 'prodserv/leadtask_action?' + params;
    return this.postCall(url, data);
  }
  leadTaskUpdate(params, data) {
    this.spinner.show();
    let url = 'prodserv/lead_to_customer?' + params;
    return this.postCall(url, data);
  }

  createActivity(data) {
    this.spinner.show();
    let url = 'prodserv/employee_task';
    return this.postCall(url, data);
  }
  createNote(data) {
    this.spinner.show();
    let url = 'prodserv/agenttask_note';
    return this.postCall(url, data);
  }
  getNotes(params) {
    // this.spinner.show();
    let url = 'prodserv/agenttask_note?' + params;
    return this.getCall(url);
  }

  getLeads(params): Observable<any> {
    this.spinner.show()
    let url = 'prodserv/get_lead_list?' + params;
    return this.getCall(url);
  }

  updateEditDetails(urlSource, data): Observable<any> {
    //urlSource is used before, because of separate API calls .. now its not needed
    this.spinner.show()
    let url = "prodserv/lead_details_update";

    return this.postCall(url, data);
  }

  updateDuplicate(data) {
    this.spinner.show()
    let url = "prodserv/duplicate_data"
    return this.postCall(url, data)
  }
  getDuplicateLeads(params) {
    // this.spinner.show()
    let url = "prodserv/duplicate_data?" + params
    return this.getCall(url)
  }

  getDropdown(key, value) {
    let path = this.dropdownUrl[key]
    let url = path + value;
    return this.getCall(url)
  }
  getCampaignData(id) {
    let url = 'prodserv/campaign_info/'+id
    return this.getCall(url)
  }
  getVendorListCounts(id) {
    let url = 'crmrepserv/campaign_report?campaign='+id+'&is_flag='+false
    return this.getCall(url)
  }
}

