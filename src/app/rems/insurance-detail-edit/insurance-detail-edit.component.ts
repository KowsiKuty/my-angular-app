import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { isBoolean } from 'util';
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
  selector: 'app-insurance-detail-edit',
  templateUrl: './insurance-detail-edit.component.html',
  styleUrls: ['./insurance-detail-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class InsuranceDetailEditComponent implements OnInit {
  InsuranceDetailEditForm: FormGroup;
  InsurancetypeList: Array<any>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  start_date: any;
  end_date: any;
  premiseId: number;
  refTypeData:any;
  inputInsuranceNumberValue=""
  refTypeIdData: any;
  refIdValue: number;
  refTypeID: number;
  InsEditButton=false;
  constructor(private fb: FormBuilder, private router: Router, private remsshareService: RemsShareService,
    private dataService: RemsService, private toastr: ToastrService, private remsService2: Rems2Service,
    private notification: NotificationService, public datePipe: DatePipe, ) { }
  ngOnInit(): void {
    this.InsuranceDetailEditForm = this.fb.group({
      insurancetype_id: ['', Validators.required],
      insurancenumber: ['', Validators.required],
      premiumamount: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      remarks: ['', Validators.required],
      ref_type: ['', Validators.required],
      ref_id: ['', Validators.required],
      premise_id:''
    })
    this.getInsuranceFK();
    this.getPremiseId();
    this.getinsuranceEdit();
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
  getinsuranceEdit() {
    let data: any = this.remsshareService.InsuranceDetailEdit.value
    this.dataService.getinsuranceEdit(data.id)
      .subscribe((data) => {
        this.refIdValue = this.premiseId
        let insurancetype = data.insurancetype.id;
        let insurancenumber = data.insurancenumber;
        let premiumamount = data.premiumamount;
        let remarks = data.remarks;
        let RefType = data.ref_type.id;
        this.refTypeID = data.ref_type.id;
        let Startdate = data.start_date;
        let Startdates = this.datePipe.transform(Startdate, 'yyyy-MM-dd');
        let Enddate = data.end_date;
        let Enddates = this.datePipe.transform(Enddate, 'yyyy-MM-dd');
        this.getRefIdValue(this.refTypeID)
        this.InsuranceDetailEditForm.patchValue({
          insurancetype_id: insurancetype,
          insurancenumber: insurancenumber,
          premiumamount: premiumamount,
          start_date: Startdates,
          end_date: Enddates,
          remarks: remarks,
          ref_type: RefType,
          ref_id: data.ref_id.id
        })
      })

  }
  InsuranceDetailEditSubmit() {
    this.InsEditButton=true;
    if (this.InsuranceDetailEditForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter   Type', { timeOut: 1500 });
      this.InsEditButton=false;
      return false;
    }
    if (this.InsuranceDetailEditForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter   ID', { timeOut: 1500 });
      this.InsEditButton=false;
      return false;
    }
    if (this.InsuranceDetailEditForm.value.insurancenumber === "") {
      this.toastr.warning('', 'Please Enter  Insurance Certificate Number', { timeOut: 1500 });
      this.InsEditButton=false;
      return false;
    }
    if (this.InsuranceDetailEditForm.value.insurancetype_id === "") {
      this.toastr.warning('', 'Please Enter  Insurance Type', { timeOut: 1500 });
      this.InsEditButton=false;
      return false;
    }

    if (this.InsuranceDetailEditForm.value.insurancenumber.trim().length > 20) {
      this.toastr.warning('', 'Please Enter  Insurance Certificate Number', { timeOut: 1500 });
      this.InsEditButton=false;
      return false;
    }
  
    if (this.InsuranceDetailEditForm.value.end_date < this.InsuranceDetailEditForm.value.start_date) {
      this.toastr.warning('Select Valid Date', 'End date must be greater than Start date');
      this.InsEditButton=false;
      return false;
    }
    if (this.InsuranceDetailEditForm.value.start_date.value === "") {
      this.toastr.warning('', 'Select Start Date', { timeOut: 1500 });
      this.InsEditButton=false;
      return false;
    }
    if (this.InsuranceDetailEditForm.value.end_date.value === "") {
      this.toastr.warning('', 'Select End Date', { timeOut: 1500 });
      this.InsEditButton=false;
      return false;
    }
    if (this.InsuranceDetailEditForm.value.premiumamount === "") {
      this.toastr.warning('', 'Please Enter Premium Amount ', { timeOut: 1500 });
      this.InsEditButton=false;
      return false;
    }
    if (this.InsuranceDetailEditForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter  Remarks', { timeOut: 1500 });
      this.InsEditButton=false;
      return false;
    }
    
 
    let idValue: any = this.remsshareService.InsuranceDetailEdit.value
    let data = this.InsuranceDetailEditForm.value
    const startDate = this.InsuranceDetailEditForm.value;
    startDate.start_date = this.datePipe.transform(startDate.start_date, 'yyyy-MM-dd');
    const toDate = this.InsuranceDetailEditForm.value;
    toDate.end_date = this.datePipe.transform(toDate.end_date, 'yyyy-MM-dd');
    this.InsuranceDetailEditForm.value.premise_id=this.premiseId;
    this.dataService.InsuranceDetailEditSubmit(data, idValue.id)
      .subscribe(result => {
        let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.InsEditButton=false;
        }
        else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate! [INVALID_DATA! ...]")
          this.InsEditButton=false;
        } else if (result.code === "INVALID_DATE" && result.description === "INVALID DATE") {
          this.notification.showWarning("End date must be greater than Start date")
          this.InsEditButton=false;
        }
        else {
          this.notification.showSuccess("Successfully Updated!...")
          this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Insurance Details" }, skipLocationChange: true });
        }
        console.log("Insurane Detail Form SUBMIT", result)
        return true
      })
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  onCancelClick() {
    // this.onCancel.emit()
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Insurance Details" }, skipLocationChange: true });
  }

  setDate(date: string) {
    this.start_date = date;
    this.end_date = this.start_date;
  }

  setDate1(date: string) {
    this.start_date = date;
    this.end_date = this.start_date;
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
      })
  }

  getRefIdValue(refType) {
    let refTypeID = refType.value
    if (refType.value) {
      this.refTypeID = refType.value;
    } else {
      this.refTypeID = refType;
    }
    this.remsService2.getRefTypeId(this.premiseId, this.refTypeID)
      .subscribe((result) => {
        this.refTypeIdData = result.data
      })
  }
} 