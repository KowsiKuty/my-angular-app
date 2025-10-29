import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'n umeric' } },
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
  selector: 'app-renovation-form',
  templateUrl: './renovation-form.component.html',
  styleUrls: ['./renovation-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class RenovationFormComponent implements OnInit {
  @Input() max: any;
  tomorrow = new Date();
  renovationForm: FormGroup;
  idValue: any;
  premiseId: number;
  refTypeData: any;
  refTypeIdData: any;
  refIdValue: any;
  paidByData: any;
  refTypeID: number;
  isAllocation= false;
  allocationData: string;
  isECFno = false;
  RenovationBtn = false;
  ECNo: any;
  allocation:any;

  constructor(private fb: FormBuilder, private router: Router, private datePipe: DatePipe,
    private remsshareService: RemsShareService, private shareService: SharedService,
    private remsService2: Rems2Service,
    private remsService: RemsService, private toastr: ToastrService,
    private notification: NotificationService, ) { }
  ngOnInit(): void {
    this.renovationForm = this.fb.group({
      sanction_order_number: [''],
      date: ['', Validators.required],
      amount: [''],
      paid_by: ['', Validators.required],
      allocation: [''],
      remarks: [''],
      description: ['', Validators.required],
      ref_id: [''],
      ref_type: [''],
      premise_id: ['', Validators.required],
      ecf_no: ['', Validators.required]
    })
    this.getPremiseId();
    this.getRenovatinEdit();
    this.getRefType();
    this.getPaidBy();
  }
  getPremiseId() {
    this.premiseId = this.remsshareService.premiseViewID.value
  }
  getRenovatinEdit() {
    let data: any = this.remsshareService.renovationForm.value;
    console.log(">getIDrenovation", data.id)
    this.idValue = data.id;
    if (data === '') {
      this.refIdValue = this.premiseId;
      this.renovationForm.patchValue({
        sanction_order_number: '',
        date: '',
        amount: '',
        paid_by: '',
        allocation: '',
        remarks: '',
        rent_type: '',
        security_deposit: '',
        description: '',
        ref_type: '',
        premise_id: '',
        ecf_no: ''
      })
    } else {
      // if (data.paid_by.id == 1) {
      //   this.isECFno = true;
      //   this.isECFno = data.ecf_no;
      // }
      // else if (data.paid_by.id == 3) {
      //   this.isECFno = true;
      //   this.isAllocation = true;
      //   this.isECFno = data.ecf_no;
      //   this.isAllocation = data.allocation;
      // }
      // else {
      //   this.isECFno = false;
      //   this.isAllocation = false;
      // }
      this.remsService.getRenovatinEdit(data.id)
        .subscribe((result) => {
          this.refIdValue = this.premiseId
          this.refTypeID = result.ref_type.id
          this.getRefIdValue(this.refTypeID)

          if (result.paid_by.id == 1) {
            this.isECFno = true;
            this.isAllocation = false;
            this.ECNo = result.ecf_no;
          }
          if (result.paid_by.id == 3) {
            this.isECFno = true;
            this.isAllocation = true;
            this.ECNo = result.ecf_no;
            this.allocation = result.allocation;
          }
          // if (result.allocation == null) {
          //   this.isAllocation = false;
            this.renovationForm.patchValue({
              sanction_order_number: data.sanction_order_number,
              date: result.date,
              amount: result.amount,
              paid_by: result.paid_by.id,
              remarks: result.remarks,
              rent_type: result.rent_type,
              security_deposit: result.security_deposit,
              description: result.description,
              ref_type: result.ref_type.id,
              ref_id: result.ref_id.id,
              premise_id: result.premise_id,
              ecf_no: this.ECNo,
              allocation: this.allocation,
            })
          // } else {
          //   this.renovationForm.patchValue({
          //     sanction_order_number: data.sanction_order_number,
          //     date: result.date,
          //     amount: result.amount,
          //     paid_by: result.paid_by.id,
          //     remarks: result.remarks,
          //     rent_type: result.rent_type,
          //     security_deposit: result.security_deposit,
          //     description: result.description,
          //     ref_type: result.ref_type.id,
          //     ref_id: result.ref_id.id,
          //     premise_id: result.premise_id,
          //     allocation: result.allocation,
          //     ecf_no: this.isECFno
          //   })
          // }

        })
    }
  }
  renovationFormCreate() {
    this.RenovationBtn = true;
    if (this.renovationForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter Ref Type', { timeOut: 1500 });
      this.RenovationBtn = false;
      return false;
    }
    if (this.renovationForm.value.ref_id === "") {
      this.toastr.warning('', 'Please Enter ID', { timeOut: 1500 });
      this.RenovationBtn = false;
      return false;
    }
    if (this.renovationForm.value.date === "") {
      this.toastr.warning('', 'Select Date', { timeOut: 1500 });
      this.RenovationBtn = false;
      return false;
    }
    // if (this.renovationForm.value.sanction_order_number === "") {
    //   this.toastr.warning('', 'Please Enter Order Number', { timeOut: 1500 });
    //   this.RenovationBtn = false;
    //   return false;
    // }
    if (this.renovationForm.value.description === "") {
      this.toastr.warning('', 'Please Enter Description', { timeOut: 1500 });
      this.RenovationBtn = false;
      return false;
    }
    if (this.renovationForm.value.amount === "") {
      this.toastr.warning('', 'Please Enter Amount', { timeOut: 1500 });
      this.RenovationBtn = false;
      return false;
    } 
    if (this.renovationForm.value.paid_by === "") {
      this.toastr.warning('', 'Please Enter Paid By', { timeOut: 1500 });
      this.RenovationBtn = false;
      return false;
    }
    // if (this.renovationForm.value.remarks === "") {
    //   this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
    //   this.RenovationBtn = false;
    //   return false;
    // }
 

    if (this.renovationForm.value.paid_by == 2) {
      this.renovationForm.value.ecf_no = null;
    }if (this.renovationForm.value.paid_by == 1 || this.renovationForm.value.paid_by == 2) {
      this.renovationForm.value.allocation = null;
    }
    const Date = this.renovationForm.value;
    Date.date = this.datePipe.transform(Date.date, 'yyyy-MM-dd');
    this.renovationForm.value.premise_id = this.premiseId;
    if (this.idValue == undefined) {
      this.remsService.renovationFormCreate(this.renovationForm.value, '')
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.RenovationBtn = false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.RenovationBtn = false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Renovations & Additions" }, skipLocationChange: true });
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.renovationFormCreate(this.renovationForm.value, this.idValue)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.RenovationBtn = false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.RenovationBtn = false;
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Renovations & Additions" }, skipLocationChange: true });
          }
        })
    }
  }
  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Renovations & Additions" }, skipLocationChange: true });
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
        console.log("renoav", result)
        this.refTypeIdData = result.data
      })
  }
  getPaidBy() {
    this.remsService2.getPaidBy()
      .subscribe((result) => {
        this.paidByData = result.data
      })
  }

  paidBy(data) {
    if (data.id == 1) {
      this.isAllocation = false;
      this.isECFno = true;
    }
    if (data.id == 3) {
      this.isECFno = true;
      this.isAllocation = true;
    }
    if (data.id == 2) {
      this.isECFno = false;
      this.isAllocation = false;
    }
    console.log("Padididiid", data)
  }

  // DropDown(data){
  //   if (data.id == 1) {
  //     this.isECFno=true;
  //   }else{
  //     this.isECFno=false;
  //   }
  //   console.log("DropDown", data)
  // }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  omit_special_chars(event) {
    var k;
    k = event.charCode;
    return ((k > 59 && k < 61)||(k > 61 && k < 63)||(k > 63 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57) ||(k>31 && k<34)||(k>37 && k<39)
    ||(k>39 && k<43) ||(k>43 && k<49));
  }
}
