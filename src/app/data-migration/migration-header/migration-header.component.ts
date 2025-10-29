import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatamigrationserviceService } from '../datamigrationservice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/service/notification.service';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-migration-header',
  templateUrl: './migration-header.component.html',
  styleUrls: ['./migration-header.component.scss']
})
export class MigrationHeaderComponent implements OnInit {

  constructor(private service: DatamigrationserviceService, private SpinnerService: NgxSpinnerService, private Notification: NotificationService, private datepipe: DatePipe, private DataService: DataService) { }
  MigrationHeaderSearch = new FormGroup({
    Date: new FormControl(),
    Status: new FormControl()
  })
  MigrationDetailSearch = new FormGroup({
    Date: new FormControl(),
    Status: new FormControl(),
    CRNo: new FormControl()
  })
  SelectObj: any = {}
  DataMigrateSummary = []
  DataDetailSummary = []
  MonoStatusData = ['Pending for approval', 'AP Maker', 'AP Bounce']
  StatusData = ['Initiate', 'Success', 'Failed']
  MigrationHeader: boolean = true
  MigrationDetail: boolean = false
  MainSearchBool: boolean = false
  MainDetailSearchBool: boolean = false
  count = 0;
  MonoId: any
  mobile_form = new FormGroup({
    mobile_number: new FormControl(),
    otp: new FormControl(),
    mobile_num: new FormControl()
  })
  ShowOtpPopup: boolean = false
  DataMigratePagination = {
    hasNext: false,
    hasPrev: false,
    index: 1,
    limit:10,
    count:0
  }
  DataDetailPagination = {
    hasNext: false,
    hasPrev: false,
    index: 1,
    limit:10,
    count:0
  }
  ngOnInit(): void {
    let data = {}
    this.Summary(data, 1)
  }
  Summary(params, page) {
    this.SpinnerService.show()
    this.service.GetDataMigration(params, page).subscribe(result => {
      this.SpinnerService.hide()
      if (result?.code) {
        this.Notification.showError(result?.code)
      }
      else {
        this.DataMigrateSummary = result['data']
        this.DataMigrateSummary.forEach(data => {
          data.bool = false
        })
        // if (this.DataMigrateSummary.length) {
        this.DataMigratePagination = {
          hasNext: result?.pagination?.has_next,
          hasPrev: result?.pagination?.has_previous,
          index: result?.pagination?.index,
          limit:result?.pagination?.limit,
          count:result?.pagination?.count
        }
        // }

      }


    },
      error => {
        this.SpinnerService.hide()
      })
  }

  DisabledSome() {
    return this.DataMigrateSummary.some(res => res.bool == true)
  }
  InputChangeFunc(event, data) {
    if (event.checked) {
      data.bool = true
      this.SelectObj = data
    }
    else {
      data.bool = false
      this.SelectObj = {}
    }
  }
  PrepareMigrateFunction() {
    let params = {

    }
    this.SpinnerService.show()
    this.service.PrepareMigration(params).subscribe(res => {
      if (res?.status == 'success') {
        this.Notification.showSuccess(res?.status)
        this.Summary({}, this.DataMigratePagination.index)
      }
      else {
        this.Notification.showError(res?.description)
      }
    },
      error => {
        this.SpinnerService.hide()
      })
  }
  MakeMigrate() {
    if (!Object.keys(this.SelectObj).length) {
      this.Notification.showError('Please Select any one check box')
    }
    else {
      let params = {
        id: this.SelectObj?.id,
        mono_status: this.SelectObj?.mono_status

      }
      this.SpinnerService.show()
      this.service.MakeMigration(params).subscribe(res => {
        if (res?.status == "success") {
          this.Notification.showSuccess(res?.message)
          // this.HeaderVisibility()
          this.SearchFunc(this.DataMigratePagination?.index)
          this.SelectObj = {}
        }
        else {
          this.SpinnerService.hide()
          this.Notification.showError(res?.message)
        }
      },
        error => {
          this.SpinnerService.hide()
        })
    }
  }

  MainSearchFunc() {
    this.MainSearchBool = true
    this.SearchFunc(1)
  }
  SearchFunc(page) {
    let DataMigrationForm = this.MigrationHeaderSearch.value
    let params = {

    }
    if (DataMigrationForm?.Status) {
      params['status'] = DataMigrationForm?.Status
    }
    if (DataMigrationForm?.Date) {
      let DateFormat = this.datepipe.transform(DataMigrationForm?.Date, 'yyyy-MM-dd')
      params['date'] = DateFormat
    }
    this.Summary(params, page)
  }
  ClearFunc() {
    this.MigrationHeaderSearch.reset()
    this.MainSearchBool = false
    this.Summary({}, 1)
  }
  MainDetailSearchFunc() {
    this.MainDetailSearchBool = true
    this.SearchMigration(1)
  }
  SummaryMigration(params, page) {
    this.SpinnerService.show()
    this.service.GetMakeMigration(params, page).subscribe(result => {
      this.SpinnerService.hide()
      if (result?.code) {
        this.Notification.showError(result?.code)
      }
      else {
        this.DataDetailSummary = result['data']
        // if (this.DataDetailSummary.length) {
        this.DataDetailPagination = {
          hasNext: result?.pagination?.has_next,
          hasPrev: result?.pagination?.has_previous,
          index: result?.pagination?.index,
          limit:result?.pagination?.limit,
          count:result?.pagination?.count
        }
        // }

      }

    },
      error => {
        this.SpinnerService.hide()
      })
  }
  SearchMigration(page) {
    let DataMigrationForm = this.MigrationDetailSearch.value
    let params = {
      'mono_id': this.MonoId
    }
    if (DataMigrationForm?.Status) {
      params['status'] = DataMigrationForm?.Status
    }
    if (DataMigrationForm?.Date) {
      let DateFormat = this.datepipe.transform(DataMigrationForm?.Date, 'yyyy-MM-dd')
      params['date'] = DateFormat
    }
    if (DataMigrationForm?.CRNo) {
      params['crno'] = DataMigrationForm?.CRNo
    }
    this.SummaryMigration(params, page)
  }
  ClearMigrationFunc() {
    this.MigrationDetailSearch.reset()
    this.MainDetailSearchBool = false
    let params = {
      'mono_id': this.MonoId
    }
    this.SummaryMigration(params, 1)
  }
  HeaderVisibility(data) {
    this.MigrationDetailSearch.reset()
    this.MigrationDetail = true
    this.MigrationHeader = false
    this.MonoId = data
    let params = {
      'mono_id': data
    }
    this.SummaryMigration(params, 1)
  }
  ArrowBackFunc() {
    this.MigrationDetail = false
    this.MigrationHeader = true
    this.MonoId = ''
    this.MigrationHeaderSearch.reset()
    this.Summary({}, this.DataMigratePagination?.index)
  }
  FirstHead() {
    this.DataMigratePagination.index = 1
    if (this.MainSearchBool) {
      this.SearchFunc(this.DataMigratePagination.index)
    }
    else {
      this.Summary({}, this.DataMigratePagination?.index)
    }
  }
  PrevHead() {
    this.DataMigratePagination.index = this.DataMigratePagination.index - 1
    if (this.MainSearchBool) {
      this.SearchFunc(this.DataMigratePagination.index)
    }
    else {
      this.Summary({}, this.DataMigratePagination?.index)
    }

  }
  NextHead() {
    this.DataMigratePagination.index = this.DataMigratePagination.index + 1
    if (this.MainSearchBool) {
      this.SearchFunc(this.DataMigratePagination.index)
    }
    else {
      this.Summary({}, this.DataMigratePagination?.index)
    }
  }
  LastHead() {
    this.DataMigratePagination.index = this.LastPageCount(this.DataMigratePagination)
    if (this.MainSearchBool) {
      this.SearchFunc(this.DataMigratePagination.index)
    }
    else {  
      this.Summary({}, this.DataMigratePagination?.index)
    }
  }
  FirstDetail() {
    this.DataDetailPagination.index = 1
    if (this.MainDetailSearchBool) {
      this.SearchMigration(this.DataDetailPagination.index)
    }
    else {
      let params = {
        'mono_id': this.MonoId
      }
      this.SummaryMigration(params, this.DataDetailPagination?.index)
    }

  }
  PrevDetail() {
    this.DataDetailPagination.index = this.DataDetailPagination.index - 1
    if (this.MainDetailSearchBool) {
      this.SearchMigration(this.DataDetailPagination.index)
    }
    else {
      let params = {
        'mono_id': this.MonoId
      }
      this.SummaryMigration(params, this.DataDetailPagination?.index)
    }

  }
  NextDetail() {
    this.DataDetailPagination.index = this.DataDetailPagination.index + 1
    if (this.MainDetailSearchBool) {
      this.SearchMigration(this.DataDetailPagination.index)
    }
    else {
      let params = {
        'mono_id': this.MonoId
      }
      this.SummaryMigration(params, this.DataDetailPagination?.index)
    }
  }
  LastDetail() {
    this.DataDetailPagination.index = this.LastPageCount(this.DataDetailPagination)
    if (this.MainDetailSearchBool) {
      this.SearchMigration(this.DataDetailPagination.index)
    }
    else {
      let params = {
        'mono_id': this.MonoId
      }
      this.SummaryMigration(params, this.DataDetailPagination?.index)
    }
  }
  mobilelogin() {
    let obj = JSON.parse(localStorage.getItem("sessionData"))
    this.DataService.gen_otp(this.mobile_form.value, 'validate_OTP', obj?.employee_id, '')
      .then(data => {
        if (data.user_id) {
          this.Notification.showSuccess('Successfully Created')
          this.closePopup()
          this.TruncateTableFunc()
        }
        else {
          if (data['validation_status'].Description) {
            this.Notification.showError(data['validation_status'].Description)
          }
          else {
            this.Notification.showError('Unauthorized Request')
          }
        }
      })
  }
  gen_otp() {
    this.mobile_form.get('otp').setValue('');
    this.count = 35;
    let mob = this.mobile_form.value.mobile_number
    let timeout = setInterval(() => {
      if (this.count > 0) {
        this.count -= 1;
      } else {
        clearInterval(timeout);
      }
    }, 500);

    let obj = JSON.parse(localStorage.getItem("sessionData"))
    this.DataService.gen_otp(this.mobile_form.value, 'gen_OTP', obj.employee_id, '')
      .then(data => {
        if (data['validation_status'].Status == 'Success') {
        } else {
          if (data['validation_status'].Description) {
            this.Notification.showWarning(data['validation_status'].Description)
          }
          else {
            this.Notification.showWarning(data['validation_status'].ErrorMessage)
          }

        }
        //     }).finally(function () {
      });
    // }
    // else {
    //   this.mobile_flag = false;
    //   this.notification.showWarning("You are trying to login from outside KVB environment.Kindly access the App via KVB environment and update your mobile number in the xxxxxxxxxx for getting the OTP")
    // }
  }
  TruncateFunc() {
    this.SpinnerService.show()
    this.service.PhoneNumberGet().subscribe(result => {
      this.SpinnerService.hide()
      if (result?.status == 'Success') {
        this.ShowOtpPopup = true
        let phone = result?.phone_no.toString()
        let sliceval = phone.slice(6)
        let str = 'XXXXXX' + sliceval
        this.mobile_form.patchValue({
          mobile_number: result?.phone_no,
          mobile_num: str
        })
        this.gen_otp()
      }
      else {
        this.SpinnerService.hide()
        this.Notification.showError(result?.phone_no)
      }
    },
      error => {
        this.SpinnerService.hide()
      })
  }
  closePopup() {
    this.ShowOtpPopup = false
    this.mobile_form.reset()
  }
  TruncateTableFunc() {
    this.service.TruncateTable().subscribe(result => {
      if (result?.Status == 'success') {
        this.Notification.showSuccess(result?.Message)
      }
      else {
        this.Notification.showError(result?.Message)
      }
    })
  }
  LastPageCount(data){
    let count=data?.count/data?.limit
    let Num=Math.floor(count)
    if(count%1!=0){
      return Num+1
    }
    else{
      return Num
    }
  }
}
