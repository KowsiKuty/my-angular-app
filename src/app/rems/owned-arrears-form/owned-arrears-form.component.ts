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
  selector: 'app-owned-arrears-form',
  templateUrl: './owned-arrears-form.component.html',
  styleUrls: ['./owned-arrears-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class OwnedArrearsFormComponent implements OnInit {
  rentTermForm: FormGroup;
  defaultDate = new FormControl(new Date())
  idValue: any;
  todayDate: any;
  toDate: any;
  fromDate: any;
  ownedscheduleId: any;
  arrearsPeriod: any;
  ss: any;
  aa: any;

  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService, private shareService: SharedService, private datePipe: DatePipe,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.rentTermForm = this.fb.group({
      // term: ['', Validators.required],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      term_period: ['', Validators.required],
      rent_amount: ['', Validators.required],
      amenities_amount: ['', Validators.required],
      maintenance_amount: ['', Validators.required],
      remarks: ['', Validators.required],

    })
    this.getEditRentTerm();
    // this.todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  }
  
  // setDate(date: string) {
  //   this.fromDate = date;
  //   this.toDate = this.fromDate;
  // }

  setDate(event: string) {
    const date = new Date(event)
    this.ss = date
    this.toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  enddate(event: string){
    
    const date = new Date(event)
    this.aa = date

      this.arrearsPeriod =  this.aa.getMonth() - this.ss.getMonth() +
        (12 * (this.aa.getFullYear() - this.ss.getFullYear()))
        
    
  }


  getEditRentTerm() {
    let data: any = this.remsshareService.rentTermForm.value;
    let id = this.remsshareService. scheduleId.value;
    this.ownedscheduleId = id;
    this.idValue = data.id;
    this.arrearsPeriod = data.term_period;
    if (data === '') {
      this.rentTermForm.patchValue({
        // term: '',
        from_date: '',
        to_date: '',
        term_period: '',
        rent_amount: '',
        amenities_amount: '',
        maintenance_amount: '',
        remarks: '',

      })
    } else {
      this.rentTermForm.patchValue({
        // term: data.term,
        from_date: data.from_date,
        to_date: data.to_date,
        term_period: this.arrearsPeriod,
        rent_amount: data.rent_amount,
        amenities_amount: data.amenities_amount,
        maintenance_amount: data.maintenance_amount,
        remarks: data.remarks
      })
    }
  }

  rentTermFormCreate() {
    if (this.rentTermForm.value.from_date === "") {
      this.toastr.warning('', 'Please Enter From Date', { timeOut: 1500 });
      return false;
    }
    if (this.rentTermForm.value.to_date === "") {
      this.toastr.warning('', 'Please Enter TO Date', { timeOut: 1500 });
      return false;
    } if (this.rentTermForm.value.term_period === "") {
      this.toastr.warning('', 'Please Enter Term Period', { timeOut: 1500 });
      return false;
    } if (this.rentTermForm.value.rent_amount === "") {
      this.toastr.warning('', 'Please Enter Rent Amount', { timeOut: 1500 });
      return false;
    }
    if (this.rentTermForm.value.amenities_amount === "") {
      this.toastr.warning('', 'Please Enter Amenities Amount', { timeOut: 1500 });
      return false;

    } if (this.rentTermForm.value.maintenance_amount === "") {
      this.toastr.warning('', 'Please Enter Maintance', { timeOut: 1500 });
      return false;
    } if (this.rentTermForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }

    const fromDate = this.rentTermForm.value;
    fromDate.from_date = this.datePipe.transform(fromDate.from_date, 'yyyy-MM-dd');
    const toDate = this.rentTermForm.value;
    toDate.to_date = this.datePipe.transform(toDate.to_date, 'yyyy-MM-dd');
    this.rentTermForm.value.owned_rentschedule_id = this.ownedscheduleId 
    if (this.idValue == undefined) {
      this.remsService.ownArrearsFormCreate(this.rentTermForm.value, '')
        .subscribe(result => {
          console.log("ownArrears", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.notification.showError("Some Thing Wrong")
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/ownedscheduleview'], { queryParams: { status: "rent_term" }, skipLocationChange: true });
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.ownArrearsFormCreate(this.rentTermForm.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.notification.showError("Some Thing Wrong")
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/ownedscheduleview'], { queryParams: { status: "rent_term" }, skipLocationChange: true });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/ownedscheduleview'], { queryParams: { status: "rent_term" }, skipLocationChange: true });

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  

}
