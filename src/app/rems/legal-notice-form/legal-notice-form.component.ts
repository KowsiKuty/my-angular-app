import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { SharedService } from '../../service/shared.service';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
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
  selector: 'app-legal-notice-form',
  templateUrl: './legal-notice-form.component.html',
  styleUrls: ['./legal-notice-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LegalNoticeFormComponent implements OnInit {
  legalNoticeForm: FormGroup;
  idValue: any;
  legalNoticeList: any;
  premiseId: any;
  refTypeData: any;
  refTypeIdData: any;
  refIdValue: any;
  legalNoticeStatus: any;
  refTypeID: number;
  statutoryBtn = false;
  constructor(private fb: FormBuilder, private router: Router, private remsService2: Rems2Service,
    private remsshareService: RemsShareService, private shareService: SharedService, private datePipe: DatePipe,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.legalNoticeForm = this.fb.group({
      legal_notice_type_id: [''],
      notice_date: ['', Validators.required],
      due_date: [''],
      hearing_date: [''],
      hearing_location: [''],
      remarks: [''],
      ref_type: [''],
      ref_id: [''],
      notice_status: ['', Validators.required],
      premise_id: "",
    })
    this.getLegalNoticeList();
    this.getLegalNoticeStatus();
    this.getPremiseId();
    this.getEditNotice();
    this.getRefType();
  }
  getPremiseId() {
    this.premiseId = this.remsshareService.premiseViewID.value
    console.log("s.s", this.premiseId)
  }

  getEditNotice() {
    let data: any = this.remsshareService.legalNoticeForm.value;
    console.log("././", data)
    this.idValue = data.id;
    if (data === '') {
      this.refIdValue = this.premiseId
      this.legalNoticeForm.patchValue({
        legal_notice_type_id: '',
        notice_date: '',
        due_date: '',
        hearing_date: '',
        hearing_location: '',
        remarks: '',
        ref_type: '',
        ref_id: '',
        notice_status: ''
      })
    } else {
      this.remsService.getEditNotice(data.id)
        .subscribe((result) => {
          this.refIdValue = this.premiseId
       
          this.refTypeID = result.ref_type.id
          this.getRefIdValue(this.refTypeID)
          this.legalNoticeForm.patchValue({
            legal_notice_type_id: result.legal_notice_type.id,
            notice_date: result.notice_date,
            due_date: result.due_date,
            hearing_date: result.hearing_date,
            hearing_location: result.hearing_location,
            remarks: result.remarks,
            ref_type: result.ref_type.id,
            ref_id: result.ref_id.id,
            notice_status: result.notice_status.id
          })
        })
    }
  }

  legalNoticeFormCreate() {
    this.statutoryBtn = true;
    if (this.legalNoticeForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter Ref Type', { timeOut: 1500 });
      this.statutoryBtn = false;
      return false;
    } if (this.legalNoticeForm.value.ref_id === "") {
      this.toastr.warning('', 'Please Select ID', { timeOut: 1500 });
      this.statutoryBtn = false;
      return false;
    }
    // if (this.legalNoticeForm.value.legal_notice_type_id === "") {
    //   this.toastr.warning('', 'Please Enter  Notice Type', { timeOut: 1500 });
    //   this.statutoryBtn = false;
    //   return false;
    // } 
    if (this.legalNoticeForm.value.notice_date === "") {
      this.toastr.warning('', 'Please Enter Notice Date', { timeOut: 1500 });
      this.statutoryBtn = false;
      return false;
    }
    if (this.legalNoticeForm.value.due_date === "") {
      this.toastr.warning('', 'Please Enter Due Date', { timeOut: 1500 });
      this.statutoryBtn = false;
      return false;
    } if (this.legalNoticeForm.value.hearing_date === "") {
      this.toastr.warning('', 'Please Enter Hearing Date', { timeOut: 1500 });
      this.statutoryBtn = false;
      return false;
    } 
    // if (this.legalNoticeForm.value.hearing_location === "") {
    //   this.toastr.warning('', 'Please Enter Hearing Location', { timeOut: 1500 });
    //   this.statutoryBtn = false;
    //   return false;
    // }
    // if (this.legalNoticeForm.value.remarks === "") {
    //   this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
    //   this.statutoryBtn = false;
    //   return false;
    // }
    if (this.legalNoticeForm.value.notice_status === "") {
      this.toastr.warning('', 'Please Select Status', { timeOut: 1500 });
      this.statutoryBtn = false;
      return false;
    }
    const noticeDate = this.legalNoticeForm.value;
    noticeDate.notice_date = this.datePipe.transform(noticeDate.notice_date, 'yyyy-MM-dd');
    const dueDate = this.legalNoticeForm.value;
    dueDate.due_date = this.datePipe.transform(dueDate.due_date, 'yyyy-MM-dd');
    const hearingDate = this.legalNoticeForm.value;
    hearingDate.hearing_date = this.datePipe.transform(hearingDate.hearing_date, 'yyyy-MM-dd');
    this.legalNoticeForm.value.premise_id = this.premiseId;
    if (this.idValue == undefined) {
      this.remsService.legalNoticeCreate(this.legalNoticeForm.value, '', this.premiseId)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.statutoryBtn = false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.statutoryBtn = false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Legal & Statutory Notice" }, skipLocationChange: true });
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.legalNoticeCreate(this.legalNoticeForm.value, this.idValue, this.premiseId)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.statutoryBtn = false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.statutoryBtn = false;
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Legal & Statutory Notice" }, skipLocationChange: true });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Legal & Statutory Notice" }, skipLocationChange: true });
  }

  getLegalNoticeList() {
    this.remsService.getLegalNoticeList()
      .subscribe(result => {
        let data = result.data;
        this.legalNoticeList = data;
      })
  }


  getLegalNoticeStatus() {
    this.remsService.getLegalNoticeStatus()
      .subscribe(result => {
        let data = result.data;
        this.legalNoticeStatus = data;
      })
  }
  only_char(event) {
    var a;
    a = event.which;
    if ((a > 32) && (a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
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
