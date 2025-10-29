import { Component, OnInit, ViewChild } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../notification.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, FormArray } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../service/shared.service'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from "ngx-spinner";

const isSkipLocationChange = environment.isSkipLocationChange

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-scheduleoverall',
  templateUrl: './scheduleoverall.component.html',
  styleUrls: ['./scheduleoverall.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ScheduleoverallComponent implements OnInit {
  overallSchFrm: FormGroup;
  OverallScheduleList: any;
  has_nextOS: boolean;
  has_previousOS: boolean;
  presentpageOS: any;
  currentepageOS: any
  OverallSchedule_PaginationAvailable: boolean;
  checkedItems: any = [];
  isShow_RO_Button: boolean;
  from_date: any;
  to_date: any;
  fromdate: any;
  todate: any;
  PremisesName: any;
  chk_registered:boolean;
  chk_unregistered:boolean;
  schedule_date:any;
  regularupfrontstatus:any;
  chk_upfront:boolean;
  chk_regular:boolean;
  typeList = [{ id: 7, text: "Not Paid" }, { id: 3, text: "On Hold" }, { id: 2, text: "Terminated" }]
  bulkRunDisable = false
  isBulkRunning : boolean;
  today = new Date();
  lastDay = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  constructor(private shareService: RemsShareService, private remsService: RemsService, private remsshareService: RemsShareService, private datePipe: DatePipe,
    private route: ActivatedRoute, private fb: FormBuilder, private toastr: ToastrService, private sharedService: SharedService,
    private router: Router, private notification: NotificationService, private spinner : NgxSpinnerService) { }

  ngOnInit(): void {
    this.overallSchFrm = this.fb.group({
      from_date: [''],
      to_date: [''],
      premisesName: ['']
    })

    this.schedule_date= new Date();
    this.chk_registered=true;
    this.chk_unregistered=true;
    this.chk_upfront=true;
    this.chk_regular=false;

    this.remsService.bulkRunCheck()
    .subscribe(results => {
      this.isBulkRunning = results.is_running
      if(results.is_running)
      {
        this.notification.showInfo("Bulk Run is in Process")
      }
      this.bulkRunDisable = results.is_running
    })   
  }

  BulkScheduleRunClick(){
    var answer = window.confirm("Run bulk schedule?");
        if (answer) {
          //some code
        }
        else {
          return false;
        }
        let frm = this.overallSchFrm.value
        this.fromdate = this.datePipe.transform(frm.from_date, 'yyyy-MM-dd');
        this.todate = this.datePipe.transform(frm.to_date, 'yyyy-MM-dd');
        if(this.fromdate== '' || this.fromdate == undefined || this.fromdate == null){
          this.notification.showWarning('Please Choose From Date.')
          return false
        }
        if(this.todate== '' || this.todate == undefined || this.todate == null){
          this.notification.showWarning('Please Choose To Date.')
          return false
        }
        
        let json: any = {}
        if(this.chk_registered && this.chk_unregistered)
        {
          json = {"vendor_type":"all"}        
        }
        else if(this.chk_registered)
        {
          json = {"vendor_type": "register"}
        }
        else if(this.chk_unregistered)
        {
          json = {"vendor_type": "unregister"}
        }
        let js: any
        if (this.fromdate !== null)
        {
          js = {
            from_date: this.fromdate
          }
          json = Object.assign({}, json, js)        
        }

        if (this.todate !== null)
        {
          js = {
            to_date: this.todate
          }
          json = Object.assign({}, json, js)        
        }

        if(this.chk_regular)
          js={"regular":true}
        else
          js={"regular":false}
        json = Object.assign({}, json, js)    

        if(this.chk_upfront)
          js={"upfront":true}
        else
          js={"upfront":false}
        json = Object.assign({}, json, js)    

        this.remsService.schedulebulk_entry(json)
        .subscribe(results => {
          if (results.status == 'success' || results.description == "This Record May Be In Modification Or Hold ") {
            this.notification.showSuccess("Successfully updated")
            this.bulkRunDisable =true
          }
          else {
            this.notification.showError(results?.message ? results?.message : results.description)
          }
        });
  }

  rentscheduledate_update_click(){
    var answer = window.confirm("Update schedule date?");
        if (answer) {
          //some code
        }
        else {
          return false;
        }
    console.log("chk_registered",this.chk_registered);
    console.log("chk_unregistered",this.chk_unregistered);
    console.log("chk_upfront",this.chk_upfront);
    console.log("chk_regular",this.chk_regular);
    console.log("schedule_date",this.datePipe.transform(this.schedule_date, 'yyyy-MM-dd'));
    let json: any = {
      accrid_list: this.checkedItems,
      registered:this.chk_registered,
      unregistered:this.chk_unregistered,
      upfront:this.chk_upfront,
      regular:this.chk_regular,
      schedule_date:this.datePipe.transform(this.schedule_date, 'yyyy-MM-dd')
    }
    console.log(json);
    this.remsService.rentscheduledateupdate(json)
      .subscribe(results => {
        if (results.status == 'success') {
          this.notification.showSuccess("Successfully updated")
        }
        else {
          this.notification.showError(results.description)
        }
      });
  }

  SearchClick() {
    this.getOverallSch(1);
  }

  resetClick() {
    this.from_date = null;
    this.to_date = null;
    this.PremisesName = undefined;
    this.bulkRunDisable = this.isBulkRunning
    this.overallSchFrm.controls['from_date'].reset('')
    this.overallSchFrm.controls['to_date'].reset('')
    this.overallSchFrm.controls['premisesName'].reset('')   
  }

  moveToRO() {
    if (this.checkedItems.length === 0) {
      this.notification.showError("Pls select valid schedule !...")
      return false;
    }
    let json: any = {
      accrid_list: this.checkedItems
    }
    this.remsService.moveToRO(json)
      .subscribe(results => {
        if (results.status == 'success') {
          this.notification.showSuccess("Submitted To RO")
          this.getOverallSch(1);
        }
        else {
          this.notification.showError(results.description)
        }
      });
  }

  onScheduleTypeChange(id) {
    this.bulkRunDisable = true
  }

  recordCount =0
  getOverallSch(pageno) {
    let frm = this.overallSchFrm.value
    this.fromdate = this.datePipe.transform(frm.from_date, 'yyyy-MM-dd');
    this.todate = this.datePipe.transform(frm.to_date, 'yyyy-MM-dd');
    this.PremisesName = frm.premisesName
        
    let finaljson: any={}

    let json: any = {}
    if(this.chk_registered)
    {
      json = {"register": true}   
      finaljson = Object.assign({}, finaljson, json)     
    }
    if(this.chk_unregistered)
    {
      json = {"unregister": true}
      finaljson = Object.assign({}, finaljson, json)
    }
   
    if(this.chk_regular)
    {
      json = {"regular": true}    
      finaljson = Object.assign({}, finaljson, json)    
    }

    if(this.chk_upfront)
    {
      json = {"upfront": true}
      finaljson = Object.assign({}, finaljson, json)
    }
   
    if (this.fromdate !== null){
      let json1: any = {
        from_date: this.fromdate
      }
      finaljson = Object.assign({}, finaljson, json1)
    }
    if (this.todate !== null)
    {
      let js = {
        to_date: this.todate
      }
      finaljson = Object.assign({}, finaljson, js)        
    }
   
    if (this.PremisesName !== undefined && this.PremisesName !== ""){
      let json1: any = {
        premise_name: this.PremisesName
      }
      finaljson = Object.assign({}, finaljson, json1)
    }
    finaljson = Object.assign({}, finaljson, {"type":"Overall_Schedule"})
    console.log("json",finaljson);
    this.spinner.show();
    this.remsService.getRemsReport(pageno, finaljson)
      .subscribe((results: any[]) => {
        let datas = results["Data"];
        let datapagination = results["Pagination"];
        this.OverallScheduleList = datas;
        if (this.OverallScheduleList.length > 0) {
          this.recordCount = results["Pagination"]?.schedule_count
          this.has_nextOS = datapagination.has_next;
          this.has_previousOS = datapagination.has_previous;
          this.presentpageOS = datapagination.index;
          this.OverallSchedule_PaginationAvailable = true;
        }
        else
        {
          this.recordCount = 0
        }
        this.spinner.hide();
      });
  }

  nextClickOS() {
    if (this.has_nextOS === true) {
      this.currentepageOS = this.presentpageOS + 1
      this.getOverallSch(this.presentpageOS + 1)
    }
  }
  previousClickOS() {
    if (this.has_previousOS === true) {
      this.currentepageOS = this.presentpageOS - 1
      this.getOverallSch(this.presentpageOS - 1)
    }
  }
  onCheckboxChange(item: any, event: any) {
    let checked = event.currentTarget.checked;
    if (checked) {
      let index = this.checkedItems.indexOf(item.id);
      if (index !== -1) this.checkedItems.splice(index, 1);
      this.checkedItems.push(item.id);
    } else {
      let index = this.checkedItems.indexOf(item.id);
      if (index !== -1) this.checkedItems.splice(index, 1);
    }
  }

  backToRemsSummary() {
    this.router.navigate(['/rems/rems/remsSummary'], { skipLocationChange: isSkipLocationChange });
  }

  BulkFilesList : any
  bulkfilesCount =0
  has_nextFiles: boolean;
  has_previousFiles: boolean;
  presentpageFiles: any;
  
  BulkRunDownload(page =1){
    this.spinner.show();
    this.remsService.getBulkRunFiles(page)
      .subscribe((results: any[]) => {
        this.BulkFilesList = results["data"];
        let datapagination = results["pagination"];
        if (this.BulkFilesList.length > 0) {
          this.bulkfilesCount = results["pagination"]?.count
          this.has_nextFiles = datapagination.has_next;
          this.has_previousFiles = datapagination.has_previous;
          this.presentpageFiles = datapagination.index;
        }
        else
        {
          this.bulkfilesCount = 0
        }
  
        this.spinner.hide();
      });
  }
  nextClickBulkFiles() {
    if (this.has_nextFiles === true) {
      this.presentpageFiles = this.presentpageFiles + 1
      this.BulkRunDownload(this.presentpageFiles)
    }
  }
  previousClickBulkFiles() {
    if (this.has_previousFiles === true) {
      this.presentpageFiles = this.presentpageFiles - 1
      this.BulkRunDownload(this.presentpageFiles)
    }
  }

  DownloadBulkfile(data){
    this.remsService.downloadBulkFile(data.id)
    .subscribe((results) => {

      if(results?.code ==undefined)
      {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;

        link.click();
      }
      else
      {
        this.notification.showError(results.code)
      }
      this.spinner.hide()
    }

    )
  }
}