import { Component, OnInit } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { SharedService } from '../../service/shared.service';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, tap, map, takeUntil, switchMap, finalize } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

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
  selector: 'app-rent-schedule-leased',
  templateUrl: './rent-schedule-leased.component.html',
  styleUrls: ['./rent-schedule-leased.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class RentScheduleLeasedComponent implements OnInit {
  ScheduleLeasedForm: FormGroup;
  rentschedule_termid: number;
  DateisDisabled: boolean;
  leaseAgrementId: number;
  previousScheduledate: any;
  premiseID: number;
  defaultDate = new FormControl(new Date())
  toDate: any;
  fromDate: any;
  terminateList = [{ id: 'yes', name: "Yes" }, { id: 'no', name: "No" }]
  holdList = [{ id: 'yes', name: "Yes" }, { id: 'no', name: "No" }]
  rentTypeData: any;
  frqData: any;
  termPeriod: any;
  ss: any;
  aa: any;
  rentamount: any;
  amenitiesamount: any;
  maintenanceamount: any;
  others: any;
  recurringamount: any;
  agreementStartDate: any;
  agreementEndDate: any;
  start: any;
  end: any;
  scheduleFirstTerm: any;
  type_Id: any;
  isRentAmont: boolean;
  isamenities: boolean;
  ismaintenance: boolean;
  isRentIncrement: boolean;
  isAmenitiesIncrement: boolean;
  isMaintenanceIncrement: boolean;
  term1: any;
  lastRentAmount: any;
  rentSchedulButton = false
  detailsList = [];
  landlordId = [];
  landlordDetails = [];
  isDisabled = true;
  sum: any;
  terminatefromdate: any;

  constructor(private fb: FormBuilder, private router: Router, private datePipe: DatePipe,
    private remsshareService: RemsShareService, private remsService: RemsService, private toastr:
      ToastrService, private notification: NotificationService,) { }


  ngOnInit(): void {
    let leaseAgreementId: any = this.remsshareService.rentForm1.value;
    this.leaseAgrementId = leaseAgreementId;
    this.previousScheduledate = this.remsshareService.previousScheduledate;
    this.lastRentAmount = this.remsshareService.lastrentamount.value
    let lastRentIncrement = this.remsshareService.lastrentincrement.value
    var number: any = this.lastRentAmount;
    var percentToGet: any = lastRentIncrement;
    var percent = this.lastRentAmount + ((percentToGet / 100) * number);
    this.term1 = Math.round(percent)
    let id: any = this.remsshareService.scheduleType.value;
    this.type_Id = id;
    if (this.type_Id == 1) {
      this.isRentAmont = true;
      this.isRentIncrement = true;
      this.isamenities = false;
      this.isAmenitiesIncrement = false;
      this.ismaintenance = false;
      this.isMaintenanceIncrement = false;
    } if (this.type_Id == 2) {
      this.isRentAmont = false;
      this.isRentIncrement = false;
      this.isamenities = true;
      this.isAmenitiesIncrement = true;
      this.ismaintenance = false;
      this.isMaintenanceIncrement = false;


    } if (this.type_Id == 3) {
      this.isRentAmont = false;
      this.isRentIncrement = false;
      this.isamenities = false;
      this.isAmenitiesIncrement = false;
      this.ismaintenance = true;
      this.isMaintenanceIncrement = true;
    }

    this.ScheduleLeasedForm = this.fb.group({
      renttype: [''],
      term_number: [''],
      start_date: [''],
      end_date: [''],
      term_period: [''],
      rent_amount: ['', [Validators.required,Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/)]],
      amenties_amount: [''],
      maintenance_amount: [''],
      rent_increment: ['', Validators.required],
      amenties_increment: [''],
      maintenance_increment: [''],
      recurring_frequency: [''],
      recurring_date: [''],
      remarks: [''],
      edit_flag: false,
      landlord_allocation: new FormArray([
      ]),
    })
    this.getScheduleLeasedEdit();
    this.getRentType();
    this.getRecurringFrequency();
  }

  array() {
    let group = new FormGroup({
      landlord_id: new FormControl(''),
      rent_amount: new FormControl('', [Validators.required,Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/)]),
      share: new FormControl(''),
      landlord: new FormControl('')
    })

    return group
  }
  getFormArray(): FormArray {
    return this.ScheduleLeasedForm.get('landlord_allocation') as FormArray;
  }

  detailsList1(form) {
    return form.controls.landlord_allocation.controls;
  }

  getScheduleLeasedEdit() {
    let dataa: any = this.remsshareService.rentForm.value;
    this.rentschedule_termid = dataa.id;
    this.termPeriod = dataa.term_period;
    if (dataa === '') {
      this.DateisDisabled = false;
      let schedule = this.remsshareService.firstTermEnddate.value
      this.scheduleFirstTerm = schedule
      let terminatefrom = this.remsshareService.terminateStartdate.value
      this.terminatefromdate = terminatefrom
      if (this.terminatefromdate == "None" || this.terminatefromdate == undefined) {
        if (this.scheduleFirstTerm) {
          let firstTermEndDate: any = this.remsshareService.firstTermEnddate.value;
          const termdata = new Date(firstTermEndDate)
          this.agreementStartDate = new Date(termdata.getFullYear(), termdata.getMonth(), termdata.getDate() + 1)
        }
        else {
          let date1: any = this.remsshareService.agreementStartdate.value;
          this.start = date1;
          const date = new Date(this.start)
          this.agreementStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        }
        let date2: any = this.remsshareService.agreementEnddate.value;
        this.end = date2;
        const datee = new Date(this.end)
        this.agreementEndDate = new Date(datee.getFullYear(), datee.getMonth(), datee.getDate())

      } else {

        let date1: any = this.remsshareService.terminateStartdate.value;
        this.start = date1;
        const date = new Date(this.start)
        this.agreementStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

        let date2: any = this.remsshareService.terminateEnddate.value;
        this.end = date2;
        const datee = new Date(this.end)
        this.agreementEndDate = new Date(datee.getFullYear(), datee.getMonth(), datee.getDate())

      }


      let details: any = this.remsshareService.agreementDetails.value;

      for (let detail of details.landlord_allocation_ratio.data) {
        let landlord_id: FormControl = new FormControl('');
        let rent_amount: FormControl = new FormControl('', [Validators.required,Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/)]);
        let share: FormControl = new FormControl('');
        let landlord: FormControl = new FormControl('');

        landlord_id.setValue(detail.landlord_id.id);
        rent_amount.setValue(detail.rent_amount);
        share.setValue(detail.share);
        landlord.setValue(detail.landlord_id.name);
        this.getFormArray().push(new FormGroup({
          landlord_id: landlord_id,
          rent_amount: rent_amount,
          share: share,
          landlord: landlord
        }))
      }

      this.ScheduleLeasedForm.patchValue({
        renttype: '',
        term_number: '',
        start_date: '',
        end_date: '',
        term_period: '',
        rent_amount: '',
        amenties_amount: '',
        maintenance_amount: '',
        rent_increment: '',
        amenties_increment: '',
        maintenance_increment: '',
        recurring_frequency: '',
        recurring_date: '',
        remarks: '',
        edit_flag: false,
      });

      if (this.lastRentAmount) {
        if (this.type_Id == 1) {
          this.isDisabled = false;
          this.ScheduleLeasedForm.patchValue({
            "rent_amount": this.term1
          })
        }
        if (this.type_Id == 2) {
          this.isDisabled = false;
          this.ScheduleLeasedForm.patchValue({
            "amenties_amount": this.term1
          })
        }
        if (this.type_Id == 3) {
          this.isDisabled = false;
          this.ScheduleLeasedForm.patchValue({
            "maintenance_amount": this.term1
          })
        }
      }
    } else {
      this.DateisDisabled = true;
      this.remsService.getparticularOwnedRentsch(this.leaseAgrementId, this.rentschedule_termid)
        .subscribe((data) => {
          this.isDisabled = false;
          const start_data = new Date(data.start_date)
          this.agreementStartDate = new Date(start_data.getFullYear(), start_data.getMonth(), start_data.getDate())
          const ed_data = new Date(data.end_date)
          this.agreementEndDate = new Date(ed_data.getFullYear(), ed_data.getMonth(), ed_data.getDate())

          for (let detail of data.landlord) {
            let landlord_id: FormControl = new FormControl('');
            let rent_amount: FormControl = new FormControl('');
            let share: FormControl = new FormControl('');
            let landlord: FormControl = new FormControl('');

            landlord_id.setValue(detail.landlord_id);
            rent_amount.setValue(detail.rent_amount);
            share.setValue(detail.share);
            landlord.setValue(detail.landlord_name);
            this.getFormArray().push(new FormGroup({
              landlord_id: landlord_id,
              rent_amount: rent_amount,
              share: share,
              landlord: landlord
            }))
          }

          this.ScheduleLeasedForm.patchValue({
            term_number: data.term_number,
            start_date: data.start_date,
            end_date: data.end_date,
            term_period: this.termPeriod,
            rent_amount: data.rent_amount,
            amenties_amount: data.amenties_amount,
            maintenance_amount: data.maintenance_amount,
            rent_increment: data.rent_increment,
            amenties_increment: data.amenties_increment,
            maintenance_increment: data.maintenance_increment,
            recurring_frequency: data?.recurring_frequency.id,
            recurring_date: data.recurring_date,
            remarks: data.remarks,
            edit_flag: data.edit_flag,
            renttype: data?.renttype.id,
          });
        })
    }
    console.log("DateisDisabled",this.DateisDisabled);
  }

  amtclick(e) {
    this.isDisabled = false;
    let amt = e.target.value
    let datas = this.ScheduleLeasedForm.value.landlord_allocation
    this.getFormArray().clear()
    for (let i = 0; i < datas.length; i++) {
      let Rentamt: FormControl = new FormControl('');
      let Landlord_id: FormControl = new FormControl('');
      let Share: FormControl = new FormControl('');
      let Landlord: FormControl = new FormControl('');

      let sharept = datas[i].share
      let roundvalue = amt * (sharept / 100)
      // let value = Math.round(roundvalue)
      let value = roundvalue.toFixed(2)
      let landlord_id1 = datas[i].landlord_id
      let landlord1 = datas[i].landlord
      let share1 = datas[i].share
      Rentamt.setValue(value)
      Landlord_id.setValue(landlord_id1);
      Landlord.setValue(landlord1);
      Share.setValue(share1);
      this.getFormArray().push(new FormGroup({
        rent_amount: Rentamt,
        share: Share,
        landlord: Landlord,
        landlord_id: Landlord_id
      }))



    }


  }

  setDate(event: string) {
    const date = new Date(event)
    this.ss = date
    this.toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  }

  enddate(event: string) {

    const date = new Date(event)
    this.aa = date

    if (this.rentschedule_termid == undefined) {
      this.termPeriod = (this.aa.getMonth() - this.ss.getMonth() + 1) +
        (12 * (this.aa.getFullYear() - this.ss.getFullYear()))
    } else {
      const etdate = new Date(this.agreementStartDate)
      this.ss = etdate
      this.termPeriod = (this.aa.getMonth() - this.ss.getMonth() + 1) +
        (12 * (this.aa.getFullYear() - this.ss.getFullYear()))
    }
  }

  rentAmount(event) {
    if (this.others != undefined) {
      this.others = this.others
    } else {
      this.amenitiesamount = 0;
      this.maintenanceamount = 0;
      this.others = 0;
    }
    this.recurringamount = parseInt(this.rentamount) + parseInt(this.others);
  }

  amenitiesAmount(event) {
    if (this.others != undefined) {
      this.others = this.others
    } else {
      this.rentamount = 0;
      this.maintenanceamount = 0;
      this.others = 0;
    }
    this.recurringamount = parseInt(this.amenitiesamount) + parseInt(this.others);
  }

  maintenanceAmount(event) {
    if (this.others != undefined) {
      this.others = this.others
    } else {
      this.rentamount = 0;
      this.amenitiesamount = 0;
      this.others = 0;
    }
    this.recurringamount = parseInt(this.maintenanceamount) + parseInt(this.others);
  }

  othersAmount(event) {
    if (this.rentamount != undefined || this.amenitiesamount != undefined || this.maintenanceamount != undefined) {
      this.rentamount = this.rentamount
      this.amenitiesamount = this.amenitiesamount
      this.maintenanceamount = this.maintenanceamount
    } else {
      this.rentamount = 0;
      this.amenitiesamount = 0;
      this.maintenanceamount = 0;
    }
    if (this.type_Id == 1) {
      this.recurringamount = parseInt(this.rentamount) + parseInt(this.others);

    } if (this.type_Id == 2) {
      this.recurringamount = parseInt(this.amenitiesamount) + parseInt(this.others);

    } if (this.type_Id == 3) {
      this.recurringamount = parseInt(this.maintenanceamount) + parseInt(this.others);

    }

  }


  ScheduleLeasedFormCreate() {
   this.rentSchedulButton = true;
    
    const startDate = this.ScheduleLeasedForm.value;
    startDate.start_date = this.datePipe.transform(startDate.start_date, 'yyyy-MM-dd');

    const endDate = this.ScheduleLeasedForm.value;
    endDate.end_date = this.datePipe.transform(endDate.end_date, 'yyyy-MM-dd');

    if (this.ScheduleLeasedForm.value.renttype === "") {
      this.toastr.error('Add Rent Type Field', 'Select Any one Rent Type', { timeOut: 1500 });
      this.rentSchedulButton = false;
      return false;
    }
    if (this.ScheduleLeasedForm.value.term_number === "") {
      this.toastr.error('Add Term Number Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.rentSchedulButton = false;
      return false;
    }
    if (this.ScheduleLeasedForm.value.start_date === "" || this.ScheduleLeasedForm.value.start_date === null) {
      this.toastr.error('Please Enter Start Date');
      this.rentSchedulButton = false;
      return false;
    }
    if (this.ScheduleLeasedForm.value.end_date === "" || this.ScheduleLeasedForm.value.end_date === null) {
      this.toastr.error('Please Enter End Date');
      this.rentSchedulButton = false;
      return false;
    }
    if (this.ScheduleLeasedForm.value.end_date < this.ScheduleLeasedForm.value.start_date) {
      this.toastr.error('Select Valid Date', 'End date must be greater than Start date');
      this.rentSchedulButton = false;
      return false;
    }

    let newFromDate = new Date(startDate.start_date);
    let newToDate = new Date(endDate.end_date);
    if (this.previousScheduledate !== undefined && this.rentschedule_termid === undefined) {
      for (let k = 0; k < this.previousScheduledate.length; k++) {
        let dateCheckFrom = new Date(this.previousScheduledate[k].from_date);
        let dateCheckTo = new Date(this.previousScheduledate[k].to_date);
        if (newFromDate >= dateCheckFrom && newFromDate <= dateCheckTo) {
          this.toastr.error('Select Valid Date', 'Schedule already created for ' + newFromDate, { timeOut: 1500 });
          return false;
        }
        if (newToDate >= dateCheckFrom && newToDate <= dateCheckTo) {
          this.toastr.error('Select Valid Date', 'Schedule already created for ' + newToDate, { timeOut: 1500 });
          // this.rentSchedulButton = false;
          return false;
        }
      }
    }
    // return false;
    if (this.type_Id == 1) {
      if (this.ScheduleLeasedForm.value.rent_amount === "") {
        this.toastr.error('Add Rent Amount Field', 'Empty value not Allowed', { timeOut: 1500 });
        this.rentSchedulButton = false;
        return false;
      }
      if (this.ScheduleLeasedForm.value.rent_increment === "") {
        this.toastr.error('Add Rent Increment% Field', 'Empty value not Allowed', { timeOut: 1500 });
        this.rentSchedulButton = false;
        return false;
      }
      let obj = this.ScheduleLeasedForm.value.landlord_allocation
      let rentamountcheck = this.ScheduleLeasedForm.value.rent_amount
      console.log(", rentamountcheck", rentamountcheck)
      console.log(", obj", obj)
      let rentAmt = obj.map(x => +x.rent_amount);
      let sum: any = rentAmt.reduce((a, b) => a + b, 0);
      sum = sum.toFixed(2)
      if (sum != +rentamountcheck) {
        this.notification.showError("Schedule Amount and landlord Share amount Not Matched")
        this.rentSchedulButton = false;
        return false;
      }
    }

    if (this.type_Id == 2) {
      if (this.ScheduleLeasedForm.value.amenties_amount === "") {
        this.toastr.error('Add Amenities Amount Field', 'Empty value not Allowed', { timeOut: 1500 });
        this.rentSchedulButton = false;
        return false;
      }
      if (this.ScheduleLeasedForm.value.amenties_increment === "") {
        this.toastr.error('Add Amenities Increment% Field', 'Empty value not Allowed', { timeOut: 1500 });
        this.rentSchedulButton = false;
        return false;
      }
      let obj = this.ScheduleLeasedForm.value.landlord_allocation
      let amenitiesAmountcheck = this.ScheduleLeasedForm.value.amenties_amount
      console.log(", amenitiesAmountcheck", amenitiesAmountcheck)
      console.log(", obj", obj)
      let rentAmt = obj.map(x => +x.rent_amount);
      let sum: any = rentAmt.reduce((a, b) => a + b, 0);
      if (sum != +amenitiesAmountcheck) {
        this.notification.showError("Schedule Amount and landlord Share amount Not Matched")
        this.rentSchedulButton = false;
        return false;
      }
    }
    if (this.type_Id == 3) {
      if (this.ScheduleLeasedForm.value.maintenance_amount === "") {
        this.toastr.error('Add Maintenance Amount Field', 'Empty value not Allowed', { timeOut: 1500 });
        this.rentSchedulButton = false;
        return false;
      }
      if (this.ScheduleLeasedForm.value.maintenance_increment === "") {
        this.toastr.error('Add Maintenance Increment% Field', 'Empty value not Allowed', { timeOut: 1500 });
        this.rentSchedulButton = false;
        return false;
      }
      let obj = this.ScheduleLeasedForm.value.landlord_allocation
      let maintainenceamountcheck = this.ScheduleLeasedForm.value.maintenance_amount
      console.log(", maintainenceamountcheck", maintainenceamountcheck)
      console.log(", obj", obj)

      let rentAmt = obj.map(x => +x.rent_amount);
      let sum: any = rentAmt.reduce((a, b) => a + b, 0);
      if (sum != +maintainenceamountcheck) {
        this.notification.showError("Schedule Amount and landlord Share amount Not Matched")
        this.rentSchedulButton = false;
        return false;
      }
    }
    if (this.ScheduleLeasedForm.value.recurring_frequency === "") {
      this.toastr.error('Add Recurring Frequency Field', 'Select Any One Recurring Frequency', { timeOut: 1500 });
      this.rentSchedulButton = false;
      return false;
    }
    if (this.ScheduleLeasedForm.value.recurring_date === "") {
      this.toastr.error('Add Recurring Day Field', 'Empty value not Allowed', { timeOut: 1500 });
      this.rentSchedulButton = false;
      return false;
    }
    if (this.ScheduleLeasedForm.value.recurring_date > 28) {
      this.toastr.error('Recurring Date Should Allow Numbers From 1 to 28');
      this.rentSchedulButton = false;
      return false;
    }

    if (this.type_Id == 1) {
      this.ScheduleLeasedForm.value.amenties_amount = 0
      this.ScheduleLeasedForm.value.maintenance_amount = 0
      this.ScheduleLeasedForm.value.amenties_increment = 0
      this.ScheduleLeasedForm.value.maintenance_increment = 0
    }
    if (this.type_Id == 2) {
      this.ScheduleLeasedForm.value.rent_amount = 0
      this.ScheduleLeasedForm.value.maintenance_amount = 0
      this.ScheduleLeasedForm.value.rent_increment = 0
      this.ScheduleLeasedForm.value.maintenance_increment = 0
    }
    if (this.type_Id == 3) {
      this.ScheduleLeasedForm.value.amenties_amount = 0
      this.ScheduleLeasedForm.value.rent_amount = 0
      this.ScheduleLeasedForm.value.amenties_increment = 0
      this.ScheduleLeasedForm.value.rent_increment = 0

    }

    if (this.rentschedule_termid == undefined) {
      this.remsService.rentFormCreate(this.ScheduleLeasedForm.value, '', this.leaseAgrementId)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.rentSchedulButton = false;
          }
          else if (result.id === undefined) {
            this.notification.showError(result.description)
            this.rentSchedulButton = false;
            return false
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/agreementView'], { queryParams: { status: "rent" }, skipLocationChange: isSkipLocationChange });
          }
          this.rentschedule_termid = result.id;
        })
    }
    else {
      this.ScheduleLeasedForm.value
      this.remsService.rentFormCreate(this.ScheduleLeasedForm.value, this.rentschedule_termid, this.leaseAgrementId)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.rentSchedulButton = false;
          }
          else if (result.id === undefined) {
            this.notification.showError(result.description)
            this.rentSchedulButton = false;
            return false
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/agreementView'], { queryParams: { status: "rent" }, skipLocationChange: isSkipLocationChange });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/agreementView'], { queryParams: { status: "rent" }, skipLocationChange: isSkipLocationChange });

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  getRentType() {
    this.remsService.getRentType()
      .subscribe((result) => {
        this.rentTypeData = result.data
      })
  }
  getRecurringFrequency() {
    this.remsService.getRecurringFrq()
      .subscribe((result) => {
        this.frqData = result.data
      })
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    // return (k == 46 || (k >= 48 && k <= 57));
  }


  validate(e) {
    var t = e.target.value;
    console.log("--------->", t)
    console.log("--------->t.includes . ", t.includes("."))

    if(t.includes(".") == true ){
      e.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
    }
    else{
      t =  e.target.value 
    }
  }
}
