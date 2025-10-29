import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { RemsShareService } from '../rems-share.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
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
  selector: 'app-insurance-detail-create',
  templateUrl: './insurance-detail-create.component.html',
  styleUrls: ['./insurance-detail-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class InsuranceDetailCreateComponent implements OnInit {
  inputInsuranceNumberValue = ""
  minFromDate = new Date();
  maxToDate = new Date().setDate(15);
  InsuranceDetailForm: FormGroup;
  InsurancetypeList: Array<any>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  startDate: any;
  endDate: any;
  premiseId: number;
  refTypeData: any;
  refTypeIdData: any;
  refIdValue: any;
  InsButton = false;
  constructor(private fb: FormBuilder, private router: Router, private remsshareService: RemsShareService,
    private dataService: RemsService, private toastr: ToastrService, private remsService2: Rems2Service,
    private datePipe: DatePipe,
    private notification: NotificationService, ) { }
  ngOnInit(): void {
    this.InsuranceDetailForm = this.fb.group({
      insurancetype_id: ['', Validators.required],
      insurancenumber: ['', Validators.required],
      premiumamount: ['', Validators.required],
      start_date: [''],
      end_date: [''],
      remarks: ['', Validators.required],
      ref_type: ['', Validators.required],
      ref_id: ['', Validators.required],
      premise_id: ''
    })
    this.getInsuranceFK();
    this.getPremiseId();
    this.getRefType();
  }
  getPremiseId() {
    this.premiseId = this.remsshareService.premiseViewID.value
  }
  getInsuranceFK() {
    this.dataService.getInsuranceFK()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.InsurancetypeList = datas;
      })
  }
  InsuranceDetailCreateSubmit() {
    this.InsButton = true;

    if (this.InsuranceDetailForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter   Type', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.ref_id === "") {
      this.toastr.warning('', 'Please Enter   ID', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    } if (this.InsuranceDetailForm.value.insurancetype_id === "") {
      this.toastr.warning('', 'Please Enter  Insurance Type', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.insurancenumber === "") {
      this.toastr.warning('', 'Please Enter Insurance Certificate Number ', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.insurancenumber.trim() === "") {
      this.toastr.warning('', 'Please Enter Insurance Certificate Number', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.insurancenumber.trim().length > 20) {
      this.toastr.warning('', 'Please Enter  Insurance Certificate Number', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.premiumamount === "") {
      this.toastr.warning('', 'Please Enter  Premium Amount', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.premiumamount.trim() === "") {
      this.toastr.warning('', 'Please Enter  Insurance Type', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.premiumamount.trim().length > 20) {
      this.toastr.warning('', 'Not more than 20 characters', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
   
    if (this.InsuranceDetailForm.value.start_date === "") {
      this.toastr.warning('', 'Select Start Date', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.end_date === "") {
      this.toastr.warning('', 'Select End Date', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.end_date < this.InsuranceDetailForm.value.start_date) {
      this.toastr.warning('Select Valid Date', 'End date must be greater than Start date');
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter  Remarks', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }
    if (this.InsuranceDetailForm.value.remarks.trim() === "") {
      this.toastr.warning('', 'Please Enter  Remarks', { timeOut: 1500 });
      this.InsButton = false;
      return false;
    }

    let data = this.InsuranceDetailForm.value
    const startDate = this.InsuranceDetailForm.value;
    startDate.start_date = this.datePipe.transform(startDate.start_date, 'yyyy-MM-dd');
    const toDate = this.InsuranceDetailForm.value;
    toDate.end_date = this.datePipe.transform(toDate.end_date, 'yyyy-MM-dd');
    this.InsuranceDetailForm.value.premise_id = this.premiseId
    this.dataService.InsuranceDetailCreateSubmit(data)
      .subscribe(result => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.InsButton = false;
        }
        else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate! [INVALID_DATA! ...]")
          this.InsButton = false;
        }
        else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showWarning("UNEXPECTED warning")
          this.InsButton = false;
        } else if (result.code === "INVALID_DATE" && result.description === "INVALID DATE") {
          this.notification.showWarning("Choose First Start Date")
          this.InsButton = false;
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Insurance Details" }, skipLocationChange: true });
        }
        console.log("Insurane Form SUBMIT", result)
        return true
      })
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode> 46 &&(charCode > 48 || charCode > 57) ){
  //   return false;
  //   }
  //   return true;
  // }
  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Insurance Details" }, skipLocationChange: true });
  }

  setDate(date: string) {
    this.startDate = date;
    this.endDate = this.startDate;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  getRefType() {

    this.dataService.getRefType(this.premiseId)
      .subscribe((result) => {
        this.refTypeData = result.data
        console.log(">v", this.refTypeData)
      })
  }
  getRefIdValue(refType) {
    let refTypeID = refType.value
    this.remsService2.getRefTypeId(this.premiseId, refTypeID)
      .subscribe((result) => {
        this.refTypeIdData = result.data
      })
  }
} 