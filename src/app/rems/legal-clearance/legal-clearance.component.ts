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
  selector: 'app-legal-clearance',
  templateUrl: './legal-clearance.component.html',
  styleUrls: ['./legal-clearance.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LegalClearanceComponent implements OnInit {
  legalClearanceForm: FormGroup;
  documentList: any;
  defaultDate = new FormControl(new Date())
  idValue: any;
  premiseId: any;
  refTypeData: any;
  tomorrow = new Date();
  refTypeIdData: any;
  refIdValue: any;
  refTypeID: number;
  LegalClearBtn = false
  constructor(private fb: FormBuilder, private router: Router, private remsService2: Rems2Service,
    private remsshareService: RemsShareService, private datePipe: DatePipe,
    private remsService: RemsService, private toastr:
      ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.legalClearanceForm = this.fb.group({
      document_type_id: ['', Validators.required],
      date: ['', Validators.required],
      remarks: ['', Validators.required],
      ref_type: ['', Validators.required],
      ref_id: ['', Validators.required],
      premise_id: ''
    })
    this.getDocumentType();
    this.getPremiseId();
    this.getRefType();
    this.getEditLegalClearance();

  }
  getPremiseId() {
    this.premiseId = this.remsshareService.premiseViewID.value
  }

  getEditLegalClearance() {
    let data: any = this.remsshareService.legalClearanceForm.value
    this.idValue = data.id;
    if (data === '') {
      this.refIdValue = this.premiseId
      this.legalClearanceForm.patchValue({
        document_type_id: '',
        remarks: '',
        date: '',
        ref_type: '',
        ref_id: ''
      })
    } else {
      this.remsService.getEditLegalClearance(data.id)
        .subscribe((data) => {
          console.log(">>SLegale ", data)
          this.refIdValue = this.premiseId

          this.refTypeID = data.ref_type.id;
          this.getRefIdValue(data.ref_type.id)
          this.legalClearanceForm.patchValue({
            document_type_id: data.document_type.id,
            remarks: data.remarks,
            date: data.date,
            ref_type: data.ref_type.id,
            ref_id: data.ref_id.id,
            premise_id: data.premise.id
          })
        })
    }
  }

  legalClearanceFormCreate() {
    this.LegalClearBtn = true
    if (this.legalClearanceForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter Ref Type', { timeOut: 1500 });
      this.LegalClearBtn = false;
      return false;
    }
    if (this.legalClearanceForm.value.ref_id === "") {
      this.toastr.warning('', 'Please Enter Ref ID', { timeOut: 1500 });
      this.LegalClearBtn = false;
      return false;
    }
    if (this.legalClearanceForm.value.document_type_id === "") {
      this.toastr.warning('', 'Please Enter Document Type', { timeOut: 1500 });
      this.LegalClearBtn = false;
      return false;
    } if (this.legalClearanceForm.value.date === "") {
      this.toastr.warning('', 'Select Date', { timeOut: 1500 });
      this.LegalClearBtn = false;
      return false;
    } if (this.legalClearanceForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      this.LegalClearBtn = false;
      return false;
    }
    const date = this.legalClearanceForm.value;
    date.date = this.datePipe.transform(date.date, 'yyyy-MM-dd');
    this.legalClearanceForm.value.premise_id = this.premiseId;
    if (this.idValue == undefined) {
      this.remsService.legalClearanceForm(this.legalClearanceForm.value, '')
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.LegalClearBtn = false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.LegalClearBtn = false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Legal Clearance" }, skipLocationChange: true });
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.legalClearanceForm(this.legalClearanceForm.value, this.idValue)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.LegalClearBtn = false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.LegalClearBtn = false;
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Legal Clearance" }, skipLocationChange: true });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Legal Clearance" }, skipLocationChange: true });
  }

  getDocumentType() {
    this.remsService.getDocumentType()
      .subscribe(result => {
        this.documentList = result.data;
      })
  }

  getRefType() {

    this.remsService.getRefType(this.premiseId)
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
    this.remsService2.getRefTypeId(this.refIdValue, this.refTypeID)
      .subscribe((result) => {
        this.refTypeIdData = result.data
      })
  }

}
