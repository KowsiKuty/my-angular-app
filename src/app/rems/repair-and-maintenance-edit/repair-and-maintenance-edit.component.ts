import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { RemsService } from '../rems.service'
import { RemsShareService } from '../rems-share.service'
import { NotificationService } from '../notification.service'
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';


interface Insurance {
  id: number;
  Name: string;
}

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
  selector: 'app-repair-and-maintenance-edit',
  templateUrl: './repair-and-maintenance-edit.component.html',
  styleUrls: ['./repair-and-maintenance-edit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class RepairAndMaintenanceEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Input() max: any;
  tomorrow = new Date();
  repaireditForm: FormGroup;
  isRepairEditForm: boolean;
  currentDate: any = new Date();
  defaultDate = new FormControl(new Date());
  TypeidList: any;
  premiseId: any;
  refidList: any;
  refTypeList: any;
  InsuranceList = [{ 'id': '1', 'name': true, 'show': 'Yes' }, { 'id': '0', 'name': false, 'show': 'No' }]
  refTypeID: number;
  RMEditButton = false;

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private router: Router, private notification: NotificationService,
    private remsService: RemsService, private shareService: RemsShareService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.repaireditForm = this.formBuilder.group({
      ref_type: ['', Validators.required],
      ref_id: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      damage_amount: ['', Validators.required],
      is_insurance_claimed: ['', Validators.required],
      amount_claimed: ['', Validators.required],
      rm_type: ['', Validators.required],
      remarks: ['', Validators.required]
    })
    this.getrepairEdit();
    this.getTypedetails();
    this.getPremiseId();
    this.getRefType();
  }

  private getRefType() {
    this.remsService.getRefType(this.premiseId)
      .subscribe((results: any[]) => {
        let refdata = results["data"];
        this.refTypeList = refdata;
      })
  }

  dependentid(s) {
    this.remsService.getRefID(this.premiseId, s)
      .subscribe((results: any[]) => {
        let refdata = results["data"];
        this.refidList = refdata;
      })
  }
  getPremiseId() {
    this.premiseId = this.shareService.premiseViewID.value
  }
  setDate(date: string) {
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    return this.currentDate;
  }

  private getTypedetails() {
    this.remsService.getTypedetails()
      .subscribe((results: any[]) => {
        let databb = results["data"];
        this.TypeidList = databb;
      })
  }



  getrepairEdit() {
    let data: any = this.shareService.repairEditValue.value;
    this.remsService.repairparticular(data.id)
      .subscribe((result) => {
        let body = JSON.stringify(data)
        this.refTypeID = result.ref_type.id
        this.dependentid(this.refTypeID)
        let RefType = result.ref_type.id
        let RefId = result.ref_id.id
        let Description = result.description
        let DateOccur = result.date
        let AmountDamage = result.damage_amount
        let InsuranceClaim = result.is_insurance_claimed
        let AmountClaim = result.amount_claimed
        let Type = data.rm_type_id
        let Remarks = result.remarks
        this.repaireditForm.patchValue({
          ref_type: RefType,
          ref_id: RefId,
          description: Description,
          date: DateOccur,
          damage_amount: AmountDamage,
          is_insurance_claimed: InsuranceClaim,
          amount_claimed: AmountClaim,
          remarks: Remarks,
          rm_type: Type
        })
      })
  }


  submitForm() {
    this.RMEditButton = true;
    if (this.repaireditForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter Type', { timeOut: 1500 });
      this.RMEditButton = false;
      return false;
    }
    else if (this.repaireditForm.value.ref_id === "") {
      this.toastr.warning('', 'Please Enter ID', { timeOut: 1500 });
      this.RMEditButton = false;
      return false;
    }
    else if (this.repaireditForm.value.description === "") {
      this.toastr.warning('', 'Please Enter Description', { timeOut: 1500 });
      this.RMEditButton = false;
      return false;
    }
    else if (this.repaireditForm.value.date === "") {
      this.toastr.warning('', 'Please Enter Date', { timeOut: 1500 });
      this.RMEditButton = false;
      return false;
    }
    else if (this.repaireditForm.value.damage_amount === "") {
      this.toastr.warning('', 'Please Enter Damage Amount', { timeOut: 1500 });
      this.RMEditButton = false;
      return false;
    }
    else if (this.repaireditForm.value.is_insurance_claimed === "") {
      this.toastr.warning('', 'Please Enter Insurance Claimed', { timeOut: 1500 });
      this.RMEditButton = false;
      return false;
    }
    else if (this.repaireditForm.value.amount_claimed === "") {
      this.toastr.warning('', 'Please Enter Amount Claimed', { timeOut: 1500 });
      this.RMEditButton = false;
      return false;
    }
    else if (this.repaireditForm.value.rm_type === "") {
      this.toastr.warning('', 'Please Enter Type', { timeOut: 1500 });
      this.RMEditButton = false;
      return false;
    }
    else if (this.repaireditForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      this.RMEditButton = false;
      return false;
    }

    if(this.repaireditForm.value.is_insurance_claimed === false){
      if (this.repaireditForm.value.amount_claimed!=0) {
        this.toastr.warning('', 'Claimed Amount should be 0', { timeOut: 1500 });
        this. RMEditButton=false;
        return false;
      }

    }
    if(this.repaireditForm.value.is_insurance_claimed === true){
      if (this.repaireditForm.value.amount_claimed > this.repaireditForm.value.damage_amount) {
        this.toastr.warning('', 'claimed Amount should be less than or equal to amount of damage', { timeOut: 1500 });
        this. RMEditButton=false;
        return false;
      }

    }

    let data: any = this.shareService.repairEditValue.value
    this.remsService.repairEdit(this.createFormate(), data.id, this.premiseId)
      .subscribe(res => {
        let code = res.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.RMEditButton = false;
        }
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          this.RMEditButton = false;
        }
        else {
          this.notification.showSuccess("Successfully Updated!...")
          this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Repairs & Maintenance" }, skipLocationChange: true });
        }
      })


  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Repairs & Maintenance" }, skipLocationChange: true });
  }


  createFormate() {
    let data = this.repaireditForm.controls;

    let objrepairedit = new repairedit();
    objrepairedit.ref_type = data['ref_type'].value;
    objrepairedit.ref_id = data['ref_id'].value;
    objrepairedit.description = data['description'].value;
    objrepairedit.date = data['date'].value;
    objrepairedit.damage_amount = data['damage_amount'].value;
    objrepairedit.is_insurance_claimed = data['is_insurance_claimed'].value;
    objrepairedit.amount_claimed = data['amount_claimed'].value;
    objrepairedit.remarks = data['remarks'].value;
    objrepairedit.rm_type = data['rm_type'].value;
    let dateValue = this.repaireditForm.value;
    objrepairedit.date = this.datePipe.transform(dateValue.date, 'yyyy-MM-dd');
    return objrepairedit;
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }

  only_num(event) {
    var k;
    k = event.charCode;
    return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  only_char(event) {
    var a;
    a = event.which;
    if ((a > 32) && (a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

class repairedit {
  ref_type: number;
  ref_id: number;
  description: string;
  date: string;
  damage_amount: number;
  is_insurance_claimed: number;
  amount_claimed: number;
  rm_type: string
  remarks: string;
}
