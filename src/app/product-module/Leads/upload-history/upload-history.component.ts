import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApicallserviceService } from 'src/app/AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { DatePipe, formatDate } from '@angular/common';
import { LeadsmainService } from '../leadsmain.service';
import { MasterApiServiceService } from '../../ProductMaster/master-api-service.service';
import { tap, concatMap } from 'rxjs/operators';
@Component({
  selector: 'app-upload-history',
  templateUrl: './upload-history.component.html',
  styleUrls: ['./upload-history.component.scss'],
  providers: [imp.LogFile, imp.UtilFiles, imp.APIServicesPath, imp.Master, imp.ProductAPI]
})
export class UploadHistoryComponent implements OnInit {

  constructor(private fb: FormBuilder, private service: ApicallserviceService, private masterApi: MasterApiServiceService,
    private spin: imp.NgxSpinnerService, private log: imp.LogFile, private productpath: imp.ProductAPI,
    private notify: imp.ToastrService, private error: imp.ErrorHandlingServiceService,
    private path: imp.APIServicesPath, private master: imp.Master, private datepipe: DatePipe,
    private prodservice: LeadsmainService) { }

  LeadHistorySearchForm: FormGroup
  leadSummary: any = []
  showMain: boolean = true;
  showNewleads: boolean = false;
  showDuplicateleads: boolean = false;
  showRejectedleads: boolean = false;

  newLeadsList = [];
  duplicateLeadsList = [];
  LeadHistoryObjects = {
    LeadHistoryList: '',
    has_nextLeadHistory: false,
    has_previousLeadHistory: false,
    presentpageLeadHistory: 1,
    SourceList: ''
  }

  showUpload: boolean = false;
  isShowfilter: boolean = false;

  ngOnInit(): void {

    this.LeadHistorySearchForm = this.fb.group({
      "source_id": "",
      "from_date": "",
      "to_date": ""
    })

    this.getSourceData()
    this.LeadHistorySearch('')

  }

  serviceCallLeadHistorySummaryget(search, pageno) {
    this.service.ApiCall('get', this.productpath.ProductsAPI.LeadHistory + "?page=" + pageno + "&", search)
      .subscribe(result => {
        this.spin.hide()
        this.log.logging("LeadHistory Summary", result)
        let page = result['pagination']
        this.LeadHistoryObjects.LeadHistoryList = result['data']
        if (this.LeadHistoryObjects.LeadHistoryList?.length > 0) {
          this.LeadHistoryObjects.has_nextLeadHistory = page.has_next;
          this.LeadHistoryObjects.has_previousLeadHistory = page.has_previous;
          this.LeadHistoryObjects.presentpageLeadHistory = page.index;
        }
      }, (error) => {
        this.error.handleError(error);
        this.spin.hide();
      })
  }

  LeadHistorySearch(hint: any) {
    let data = this.LeadHistorySearchForm.value;

    let obj = {
      source_id: data?.source_id,
      from_date: data?.from_date,
      to_date: data?.to_date
    }

    console.log("obj data b4 api", obj)
    for (let i in obj) {
      this.log.logging("index i", i)
      if (i == "from_date" && (obj[i] != null || obj[i] != "" || obj[i] != undefined)) {
        obj.from_date = this.datepipe.transform(obj.from_date, 'yyyy-MM-dd')
      }
      if (i == "to_date" && (obj[i] != null || obj[i] != "" || obj[i] != undefined)) {
        obj.to_date = this.datepipe.transform(obj.to_date, 'yyyy-MM-dd')
      }
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.spin.show();

    if (hint == 'next') {
      this.serviceCallLeadHistorySummaryget(obj, this.LeadHistoryObjects.presentpageLeadHistory + 1)
    }
    else if (hint == 'previous') {
      this.serviceCallLeadHistorySummaryget(obj, this.LeadHistoryObjects.presentpageLeadHistory - 1)
    }
    else {
      this.serviceCallLeadHistorySummaryget(obj, 1)
    }

  }

  resetLeadHistory() {
    this.LeadHistorySearchForm.reset('')
    this.LeadHistorySearch('')
  }


  getSourceData() {
    this.service.ApiCall("get", this.productpath.ProductsAPI.Source)
      .subscribe(results => {

        console.log(results)
        let data = results["data"]

        this.LeadHistoryObjects.SourceList = data

      })
  }

  viewNewLead(val) {

    if (val.new_count == 0) {
      this.notify.warning("No entries Found...!")
      return;
    }
    this.showMain = false;
    this.showNewleads = true;
    this.showDuplicateleads = false;
    this.showRejectedleads = false;
    //new Count 
    this.getParticularLeads(val, 'new_lead_id');
  }

  getParticularLeads(params, arraykey) {
    //To avoid call back Hell,I used this approach..
    this.prodservice.getupdaterecords(params.id).pipe(
      tap((user) =>
        console.log(user)
      ), // tap to set some variables
      concatMap((user) => {
        //arraykey is the keyname to access which leads data has to be stored.
        if (user[arraykey].length == 0) {
          return user;
        }
        else {
          let params = "lead_id=" + user[arraykey].join(",")
          return this.masterApi.getLeads(params)
        }

      }
      )
    ).subscribe(results => {
      this.leadSummary = results;
    });
  }

  backtoTable() {
    this.showMain = true;
    this.showNewleads = false;
    this.showDuplicateleads = false;
    this.showRejectedleads = false;
  }


  goToUpload() {
    this.showUpload = !this.showUpload;
    this.showMain = !this.showMain;
  }

  leadSts(value) {
    if (value == 'reload') {
      this.LeadHistorySearch('')
    }
    this.goToUpload();
    //refres api
  }

  duplicateLeads = []
  viewDuplicate(val) {
    if (val.duplicate_count == 0) {
      this.notify.warning("No entries Found...!")
      return;
    }
    this.source_id = val.id;
    this.showMain = false;
    this.showNewleads = false;
    this.showDuplicateleads = true;
    this.showRejectedleads = false;
    // this.getParticularLeads(val, 'duplicated_entry')
    this.prodservice.getupdaterecords(val.id).pipe(
      tap(response => this.leadSummary = response.duplicated_entry), concatMap((res) => {
        let params = "lead_id=" + this.leadSummary.map(element => element.lead_id).join(",")
        return this.masterApi.getLeads(params)
      })).subscribe(results => {
        // let ca = results.forEach((element, index) => element.duplicated = this.leadSummary[index].lead_date)
        this.duplicateLeads = results
        // console.log(ca)
      });
  }

  viewReject(val) {
    if (val.reject_count == 0) {
      this.notify.warning("No entries Found...!")
      return;
    }
    this.showMain = false;
    this.showNewleads = false;
    this.showDuplicateleads = false;
    this.showRejectedleads = true;
    this.prodservice.getupdaterecords(val.id).subscribe(results => {

      this.leadSummary = results;

      if (results.status == 'success') {

      }
      else {

      }
    });
  }

  merge: number = 3;
  reject: number = 4
  auto: number = 0;
  manual: number = 1;
  source_id: number = null;
  // status-3 -> merge status-4 reject
  //type 1 manual type 0 auto
  update(type, status) {
    var payload: any = {
      type: type,
      status: status
    }
    if (type == 0) {
      payload.lead_source_id = this.source_id

    } else {
      payload.lead_data = {};
    }

    this.duplicateUpdate(payload);
  }



  duplicateUpdate(payload) {
    this.masterApi.updateDuplicate(payload).subscribe(res => {
      if (res.status == 'success') {
        this.backtoTable();
      }
    })
  }

  showFilter()
  {
    this.isShowfilter = !this.isShowfilter;
  }

















}
