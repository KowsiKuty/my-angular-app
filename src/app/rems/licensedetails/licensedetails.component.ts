import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { RemsService } from '../rems.service';
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { isBoolean } from 'util';
import { RemsShareService } from '../rems-share.service'
import { Rems2Service } from '../rems2.service'

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
  selector: 'app-licensedetails',
  templateUrl: './licensedetails.component.html',
  styleUrls: ['./licensedetails.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LicensedetailsComponent implements OnInit {
  // minFromDate = new Date();
  // maxToDate = new Date().setDate(15);
  inputLicenseNumberValue = ""
  licensetypeList: Array<any>;
  LicenseDetailsForm: FormGroup
  Contract = false;
  fromdate: any;
  todate: Date;
  renewaldate: Date;
  premiseId: any;
  paramsValue: any;
  refTypeData: any;
  startdate: any;
  enddate: any;
  // startDate: any;
  // endDate: any;
  refTypeIdData: any;
  LicenseBtn = false;
  constructor(private fb: FormBuilder, private router: Router, private remsshareService: RemsShareService,
    private remsservice: RemsService, private notification: NotificationService, private remsService2: Rems2Service,
    private toastr: ToastrService, private datePipe: DatePipe) { }
  ngOnInit(): void {
    this.LicenseDetailsForm = this.fb.group({
      licensetype_id: ['', Validators.required],
      licensenumber: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      renewal_date: [],
      remarks: ['', Validators.required],
      ref_type: ['', Validators.required],
      ref_id: ['', Validators.required],
      premise_id: ''
    })
    this.getLicense();
    this.getPremiseId();
    this.getRefType();
  }
  getPremiseId() {
    this.premiseId = this.remsshareService.premiseViewID.value
  }
  private getLicense() {
    this.remsservice.getLicense()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.licensetypeList = datas;
      })
  }
  startDateSelection(event: string) {
    console.log("fromdate", event)
    const date = new Date(event)
    this.startdate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  endDateSelection(event: string) {
    console.log("todate", event)
    const date = new Date(event)
    this.enddate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    // this.total=this.selectto-this.select;
    // this.totall =this.total/(1000 * 60 * 60 * 24)
    //  console.log("baba",this.totall)
  }

  LicensedetailsCreateForm() {
    this.LicenseBtn = true;
    if (this.LicenseDetailsForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter   Type', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;
    } if (this.LicenseDetailsForm.value.ref_id === "") {
      this.toastr.warning('', 'Please Enter   ID', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;
    }
    if (this.LicenseDetailsForm.value.licensetype_id === "" || this.LicenseDetailsForm.value.licensetype_id === undefined
      || this.LicenseDetailsForm.value.licensetype_id === null) {
      this.toastr.warning('', 'Please Enter  License Name', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;
    }

    if (this.LicenseDetailsForm.value.start_date === "") {
      this.toastr.warning('', 'Please Enter Start Date', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;
    }
    if (this.LicenseDetailsForm.value.end_date === "") {
      this.toastr.warning('', 'Please Enter   End Date', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;
    }
    if (this.LicenseDetailsForm.value.renewal_date === "" || this.LicenseDetailsForm.value.renewal_date === null
      || this.LicenseDetailsForm.value.renewal_date === undefined) {
      this.toastr.warning('', 'Please Enter   Renewal Date', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;
    }
    if (this.LicenseDetailsForm.value.licensenumber.trim() === "") {
      this.toastr.warning('', 'Please Enter License Number', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;
    }
    if (this.LicenseDetailsForm.value.remarks.trim() === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;
    }
    if (this.LicenseDetailsForm.value.end_date < this.LicenseDetailsForm.value.start_date) {
      this.toastr.warning('', 'End date must be greater than Start date', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;
    }
    if (this.LicenseDetailsForm.value.renewal_date < this.LicenseDetailsForm.value.start_date) {
      this.toastr.warning('', 'Renewal date should be inbetween both start and end date', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;
    }
    if (this.LicenseDetailsForm.value.renewal_date > this.LicenseDetailsForm.value.end_date) {
      this.toastr.warning('', 'Renewal date should be inbetween both start and end date', { timeOut: 1500 });
      this.LicenseBtn = false;
      return false;

    }

    let data = this.LicenseDetailsForm.value
    const startDate = this.LicenseDetailsForm.value;
    startDate.start_date = this.datePipe.transform(startDate.start_date, 'yyyy-MM-dd');
    const toDate = this.LicenseDetailsForm.value;
    toDate.end_date = this.datePipe.transform(toDate.end_date, 'yyyy-MM-dd');
    this.LicenseDetailsForm.value.premise_id = this.premiseId
    this.remsservice.licensedetailsCreateForm(data)
      .subscribe(res => {
        let code = res.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.LicenseBtn = false;
        }
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          this.LicenseBtn = false;
        } if (res.code === "INVALID_DATE" && res.description === "INVALID DATE") {
          this.notification.showWarning("Renewal date should be inbetween both start and end date")
          this.LicenseBtn = false;
        } else {
          this.notification.showSuccess("Successfully created!...")
          this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Licenses & Certificate" }, skipLocationChange: true });
          return true
        }
      })
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Licenses & Certificate" }, skipLocationChange: true });

  }
  // setDate(date: string) {
  //   this.fromdate = date;
  //   this.todate = this.fromdate;
  // }

  getRefType() {

    this.remsservice.getRefType(this.premiseId)
      .subscribe((result) => {
        this.refTypeData = result.data
      })
  }


  getRefIdValue(refType) {
    this.remsService2.getRefTypeId(this.premiseId, refType)
      .subscribe((result) => {
        this.refTypeIdData = result.data
      })
  }

}