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
  selector: 'app-recurring-form',
  templateUrl: './recurring-form.component.html',
  styleUrls: ['./recurring-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class RecurringFormComponent implements OnInit {
  iList: any;
  recurringScheduleForm: FormGroup;
  defaultDate = new FormControl(new Date())
  idValue: any;
  todayDate: any;
  toDate: any;
  fromDate: any;
  ownedscheduleId: any;

  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService, private shareService: SharedService, private datePipe: DatePipe,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.recurringScheduleForm = this.fb.group({
      term_number: ['',Validators.required],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      term_period: ['', Validators.required],
      rent_amount: ['', Validators.required],
      amenities_amount: ['', Validators.required],
      maintenance_amount: ['', Validators.required],
      recurring_amount: ['', Validators.required],
      recurring_date: ['', Validators.required],
      recurring_period: ['', Validators.required],
      others: ['', Validators.required],
      remarks: ['', Validators.required],

    })
    this.getRecurringSchedule();
    this.getRecurringPeriod();

  }
  setDate(date: string) {
    this.fromDate = date;
    this.toDate = this.fromDate;
  }


  getRecurringSchedule() {
    let data: any = this.remsshareService.recurringForm.value;
    let id = this.remsshareService. scheduleId.value;
    this.ownedscheduleId = id;
    this.idValue = data.id;
    if (data === '') {
      this.recurringScheduleForm.patchValue({
        term_number: '',
        from_date: '',
        to_date: '',
        term_period: '',
        rent_amount: '',
        amenities_amount: '',
        maintenance_amount: '',
        recurring_amount: '',
        recurring_date: '',
        recurring_period: '',
        others: '',
        remarks: '',

      })
    } else {
      this.recurringScheduleForm.patchValue({
        term_number: data.term_number,
        from_date: data.from_date,
        to_date: data.to_date,
        term_period: data.term_period,
        rent_amount: data.rent_amount,
        amenities_amount: data.amenities_amount,
        maintenance_amount: data.maintenance_amount,
        recurring_amount: data.recurring_amount,
        recurring_date: data.recurring_date,
        recurring_period: data.recurring_period.id,
        others: data.others,
        remarks: data.remarks
      })
    }
  }

  recurringScheduleFormCreate() {
    if (this.recurringScheduleForm.value.term_number === "") {
      this.toastr.warning('', 'Please Enter Term Number', { timeOut: 1500 });
      return false;
    }
    if (this.recurringScheduleForm.value.from_date === "") {
      this.toastr.warning('', 'Please Enter From Date', { timeOut: 1500 });
      return false;
    }
    if (this.recurringScheduleForm.value.to_date === "") {
      this.toastr.warning('', 'Please Enter TO Date', { timeOut: 1500 });
      return false;
    } if (this.recurringScheduleForm.value.term_period === "") {
      this.toastr.warning('', 'Please Enter Term Period', { timeOut: 1500 });
      return false;
    } if (this.recurringScheduleForm.value.rent_amount === "") {
      this.toastr.warning('', 'Please Enter Rent Amount', { timeOut: 1500 });
      return false;
    }
    if (this.recurringScheduleForm.value.amenities_amount === "") {
      this.toastr.warning('', 'Please Enter Amenities Amount', { timeOut: 1500 });
      return false;

    } if (this.recurringScheduleForm.value.maintenance_amount === "") {
      this.toastr.warning('', 'Please Enter Maintance', { timeOut: 1500 });
      return false;
    } if (this.recurringScheduleForm.value.others === "") {
      this.toastr.warning('', 'Please Enter others', { timeOut: 1500 });
      return false;
    }
    if (this.recurringScheduleForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    if (this.recurringScheduleForm.value.recurring_amount === "") {
      this.toastr.warning('', 'Please Enter Recurring Amount', { timeOut: 1500 });
      return false;
    }
    if (this.recurringScheduleForm.value.recurring_period === "") {
      this.toastr.warning('', 'Please Enter Recurring Period', { timeOut: 1500 });
      return false;
    }
    if (this.recurringScheduleForm.value.recurring_date === "") {
      this.toastr.warning('', 'Please Enter Recurring Date', { timeOut: 1500 });
      return false;
    }

    const fromDate = this.recurringScheduleForm.value;
    fromDate.from_date = this.datePipe.transform(fromDate.from_date, 'yyyy-MM-dd');
    const toDate = this.recurringScheduleForm.value;
    toDate.to_date = this.datePipe.transform(toDate.to_date, 'yyyy-MM-dd');
    this.recurringScheduleForm.value.owned_rentschedule_id = this.ownedscheduleId 
    if (this.idValue == undefined) {
      this.remsService.ownRecurringFormCreate(this.recurringScheduleForm.value, '')
        .subscribe(result => {
          console.log("ownArrears", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.notification.showError("Some Thing Wrong")
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/ownedscheduleview'], { queryParams: { status: "recurring" }, skipLocationChange: true });
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.ownRecurringFormCreate(this.recurringScheduleForm.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.notification.showError("Some Thing Wrong")
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/ownedscheduleview'], { queryParams: { status: "recurring" }, skipLocationChange: true });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/ownedscheduleview'], { queryParams: { status: "recurring" }, skipLocationChange: true });

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  


    
  

  getRecurringPeriod() {
    this.remsService.getRentType()
      .subscribe((result) => {
        this.iList = result.data
      })
  }

}
