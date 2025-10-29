import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { RemsShareService } from '../rems-share.service'
import { Router } from '@angular/router'
import { RemsService } from '../rems.service';
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-licensedetails-edit',
  templateUrl: './licensedetails-edit.component.html',
  styleUrls: ['./licensedetails-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LicensedetailsEditComponent implements OnInit {
  licensetypeList: Array<any>;
  LicenseDetailsEditForm: FormGroup
  Contract = false;
  fromdate: any;
  todate: Date;
  renewaldate: Date;
  licenceid: number;
  premiseId: any;
  refTypeData: any;
  inputLicenseNumberValue=""
  refTypeIdData: any;
  refTypeID: number;
  LicenseEditBtn=false;

  constructor(private fb: FormBuilder, private router: Router,
    private remsservice: RemsService, private notification: NotificationService, private remsService2: Rems2Service,
    private toastr: ToastrService, private datePipe: DatePipe, private shareservice: RemsShareService, ) { }
  ngOnInit(): void {
    this.LicenseDetailsEditForm = this.fb.group({
      licensetype_id: ['', Validators.required],
      licensenumber: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      renewal_date: [],
      ref_type: ['', Validators.required],
      ref_id: ['', Validators.required],
      remarks: ['', Validators.required],
      premise_id: ''
    })
    this.getLicense();
    this.getLicensedetailsEdit();
    this.getPremiseId();
    this.getRefType();
  }
  getPremiseId() {
    this.premiseId = this.shareservice.premiseViewID.value
  }
  private getLicense() {
    this.remsservice.getLicense()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.licensetypeList = datas;
      })
  }
  getLicensedetailsEdit() {
    let data: any = this.shareservice.licensedetailsEditValue.value
    this.licenceid = data.id;
    console.log(">ofssssss", data)

    this.remsservice.getLicensedetailsEdit(data.id)
      .subscribe((data) => {
        console.log(">of", data)
        this.refTypeID = data.ref_type.id
        this.getRefIdValue(this.refTypeID)
        let Licensetype = data.licensetype.id;
        let Licenseno = data.licensenumber;
        let Startdate = data.start_date;
        let Startdates = this.datePipe.transform(Startdate, 'yyyy-MM-dd');
        let Enddate = data.end_date;
        let Enddates = this.datePipe.transform(Enddate, 'yyyy-MM-dd');
        let Renewaldate = data.renewal_date;
        let Renewaldates = this.datePipe.transform(Renewaldate, 'yyyy-MM-dd');
        let Remarks = data.remarks;
        let RefType = data.ref_type.id;
        let RefTypeId = data.ref_id.id
        this.LicenseDetailsEditForm.patchValue({
          licensetype_id: Licensetype,
          licensenumber: Licenseno,
          start_date: Startdates,
          end_date: Enddates,
          renewal_date: Renewaldates,
          remarks: Remarks,
          ref_type: RefType,
          ref_id: RefTypeId
        })
      })
  }
  LicensedetailseditForm() {
    this. LicenseEditBtn=true;
    if (this.LicenseDetailsEditForm.value.licensenumber.trim() === "") {
      this.toastr.error('Add licensenumber Field', 'Empty value inserted', { timeOut: 1500 });
      this. LicenseEditBtn=false;
      return false;
    }
    if (this.LicenseDetailsEditForm.value.remarks.trim() === "") {
      this.toastr.error('Add remarks Field', 'Empty value inserted', { timeOut: 1500 });
      this. LicenseEditBtn=false;
      return false;
    }
    if (this.LicenseDetailsEditForm.value.renewal_date < this.LicenseDetailsEditForm.value.start_date) {
      this.toastr.error('Select Valid Date', 'Renewal date should be inbetween both start and end date');
      this. LicenseEditBtn=false;
      return false;
    }
    if (this.LicenseDetailsEditForm.value.renewal_date > this.LicenseDetailsEditForm.value.end_date) {
      this.toastr.error('Select Valid Date', 'Renewal date should be inbetween both start and end date');
      this. LicenseEditBtn=false;
      return false;
    }
    let idValue: any = this.shareservice.licensedetailsEditValue.value
    let data = this.LicenseDetailsEditForm.value
    this.LicenseDetailsEditForm.value.premise_id = this.premiseId
    this.remsservice.editLicensedetailsForm(data, idValue.id, this.premiseId)
      .subscribe(res => {
        let code = res.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.LicenseEditBtn=false;
        }
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          this. LicenseEditBtn=false;
        } if (res.code === "INVALID_DATE" && res.description === "INVALID DATE") {
          this.notification.showError("Renewal date should be inbetween both start and end date")
          this. LicenseEditBtn=false;
        }
        else{
        this.notification.showSuccess("Successfully Updated!...")
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
  getRefType() {

    this.remsservice.getRefType(this.premiseId)
      .subscribe((result) => {
        this.refTypeData = result.data
      })
  }

  getRefIdValue(refType) {
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