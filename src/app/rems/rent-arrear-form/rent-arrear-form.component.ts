import { Component, OnInit } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { SharedService } from '../../service/shared.service';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
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
  selector: 'app-rent-arrear-form',
  templateUrl: './rent-arrear-form.component.html',
  styleUrls: ['./rent-arrear-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class RentArrearFormComponent implements OnInit {
  rentArrearForm: FormGroup;
  defaultDate = new FormControl(new Date())
  idValue: any;
  toDate: any;
  fromDate: any;
  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService, private shareService: SharedService, private datePipe: DatePipe,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.rentArrearForm = this.fb.group({
      arrear_no: ['', Validators.required],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      amount: ['', Validators.required],
      remarks: ['', Validators.required],

    })
    this.getEditAgreement();
  }

  getEditAgreement() {
    let data: any = this.remsshareService.rentArrearForm.value;
    console.log(">>fucaaaArreaeak", data)
    this.idValue = data.id;
    if (data === '') {
      this.rentArrearForm.patchValue({
        arrear_no: '',
        from_date: '',
        to_date: '',
        amount: '',
        remarks: '',

      })
    } else {
      this.rentArrearForm.patchValue({
        arrear_no: data.arrear_no,
        from_date: data.from_date,
        to_date: data.to_date,
        amount: data.amount,
        remarks: data.remarks
      })
    }
  }

  setDate(date: string) {
    this.fromDate = date;
    this.toDate = this.fromDate;
  }
  rentArrearCreate() {
    if (this.rentArrearForm.value.arrear_no === "") {
      this.toastr.warning('', 'Please Enter Arrear', { timeOut: 1500 });
      return false;
    } if (this.rentArrearForm.value.from_date === "") {
      this.toastr.warning('', 'Please Enter From Date', { timeOut: 1500 });
      return false;
    }
    if (this.rentArrearForm.value.to_date === "") {
      this.toastr.warning('', 'Please Enter TO Date', { timeOut: 1500 });
      return false;
    } if (this.rentArrearForm.value.amount === "") {
      this.toastr.warning('', 'Please Enter Amount', { timeOut: 1500 });
      return false;
    } if (this.rentArrearForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    const fromDate = this.rentArrearForm.value;
    fromDate.from_date = this.datePipe.transform(fromDate.from_date, 'yyyy-MM-dd');
    const toDate = this.rentArrearForm.value;
    toDate.to_date = this.datePipe.transform(toDate.to_date, 'yyyy-MM-dd');
    if (this.idValue == undefined) {
      this.remsService.rentArrearForm(this.rentArrearForm.value, '')
        .subscribe(result => {
          console.log(">>>LEAAGREEErentArrearForm", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.notification.showError("Some Thing Wrong")
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/agreementView'], { queryParams: { status: "rent_arrear" }, skipLocationChange: true });
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.rentArrearForm(this.rentArrearForm.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.notification.showError("Some Thing Wrong")
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/agreementView'], { queryParams: { status: "rent_arrear" }, skipLocationChange: true });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/agreementView'], { queryParams: { status: "rent_arrear" }, skipLocationChange: true });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
