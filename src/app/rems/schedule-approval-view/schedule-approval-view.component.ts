import { Component, OnInit } from '@angular/core';
import { RemsService } from '../rems.service'
import { RemsShareService } from '../rems-share.service'
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service'
import { Router } from '@angular/router'
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
  selector: 'app-schedule-approval-view',
  templateUrl: './schedule-approval-view.component.html',
  styleUrls: ['./schedule-approval-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ScheduleApprovalViewComponent implements OnInit {
  premisesID: number;
  leaseAgreementId: number;
  leaseAgreement: any;
  landLordDetails: any;
  personDetails: any;
  occupacnyList: any;
  upComingRentSchedules: any;
  scheduleApproval: FormGroup;
  rentScheduleId: number;
  defaultDate = new FormControl(new Date())
  currentDate: any = new Date();
  statusValue: number;
  premisecode: any;
  premisename: any;

  constructor(private remsService: RemsService, private shareService: RemsShareService,
    private fb: FormBuilder, private datePipe: DatePipe, private toastr:
      ToastrService, private notification: NotificationService, private router: Router,
  ) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.scheduleApproval = this.fb.group({
      painting_date: [''],
      rentamount: [''],
      content: [''],
      landlord_allocation: new FormArray([

      ]),
    })
  }

  array() {
    let group = new FormGroup({
      landlord_id: new FormControl(''),
      landlord: new FormControl(''),
      rent_amount: new FormControl(''),
      share: new FormControl(''),

    })

    return group
  }
  getFormArray(): FormArray {
    return this.scheduleApproval.get('landlord_allocation') as FormArray;
  }

  getQueryParams() {
    let json: any = this.shareService.scheduleApprovaleView.value
    this.premisecode = json.lease_agreement.premise.code;
    this.premisename = json.lease_agreement.premise.name
    this.leaseAgreementId = json.lease_agreement_id;
    this.premisesID = json.lease_agreement.premise.id
    this.getAgreement()
    this.upComingRentSchedule();

  }
  getAgreement() {
    this.remsService.getparticularAgreement(this.premisesID, this.leaseAgreementId)
      .subscribe(result => {
        this.leaseAgreement = result;
        this.occupacnyList = result.occupancy.data;
        this.landLordDetails = result.landlord_allocation_ratio.data;
      })
  }

  upComingRentSchedule() {
    this.remsService.upComingRentSchedule(this.leaseAgreementId)
      .subscribe(result => {
        this.upComingRentSchedules = result.data;
        this.rentScheduleId = result.data[0].rentschedule_id
        let totalamt = result.data[0].rent_amount
        this.scheduleApproval.patchValue({
          "rentamount": totalamt
        })
        for(let list of result.data){
          this.personDetails = list.landlord_details;
          for (let detail of this.personDetails) {
            let landlord_id: FormControl = new FormControl('');
            let rent_amount: FormControl = new FormControl('');
            let landlord: FormControl = new FormControl('');
            let share: FormControl = new FormControl('');
            landlord_id.setValue(detail.landlord_id);
            rent_amount.setValue(detail.rent_amount)
            landlord.setValue(detail.landlord_name);
            share.setValue(detail.share);
            this.getFormArray().push(new FormGroup({
              landlord_id: landlord_id,
              rent_amount: rent_amount,
              landlord: landlord,
              share: share
            }))
          }
          break;
        }
        
       
      })
  }

  setDate(date: string) {
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    return this.currentDate;
  }

  amtclick(e){
    let amt = e.target.value
    let datas = this.scheduleApproval.value.landlord_allocation
    this.getFormArray().clear()
    for (let i=0; i<datas.length; i++) {
        let Rentamt: FormControl = new FormControl('');
        let Landlord_id: FormControl = new FormControl('');
        let Share: FormControl = new FormControl('');
        let Landlord: FormControl = new FormControl('');
    
        let sharept = datas[i].share
        let landlord_id1 = datas[i].landlord_id
        let landlord1 = datas[i].landlord
        let share1 = datas[i].share
        Rentamt.setValue(amt * (sharept/100));
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


  numberOnly(event): boolean {
    const input = event.target.value;
    if (input.length === 0 && event.which === 48) {
      event.preventDefault();
    }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return (k == 46 || (k >= 48 && k <= 57));
  }

  scheduleApprove(status) {
    let data = this.scheduleApproval.value;
    if (data.painting_date == "" || data.painting_date == null || data.painting_date == undefined) {
      this.toastr.warning('', 'Select Date', { timeOut: 1500 });
      return false;
    }
    if (data.rentamount == "" || data.rentamount == null || data.rentamount == undefined) {
      this.toastr.warning('', 'Please Enter Amount', { timeOut: 1500 });
      return false;
    }
    if (data.content == "" || data.content == null || data.content == undefined) {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }

    let obj = this.scheduleApproval.value.landlord_allocation
    let rentAmt = obj.map(x => x.rent_amount);
    let sum: any = rentAmt.reduce((a, b) => a + b, 0);

    if (sum != this.scheduleApproval.value.rentamount) {
      this.notification.showError("Rent Amount and landlord Share amount Not Matched")
      return false;
    }
    
    this.statusValue = status
    let josn = {
      painting_date: this.currentDate,
      status: this.statusValue
    }
    this.remsService.scheduleApprover(this.scheduleApproval.value, josn, this.rentScheduleId)
      .subscribe(result => {
        if (result.statusText == "Internal Server Error") {
          this.notification.showError("Internal Server Error")
        } else if (result.code === "PERMISSION DENIED") {
          this.notification.showError("PERMISSION DENIED")
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.router.navigate(['/rems/rems/scheduleApproval'], { skipLocationChange: isSkipLocationChange });
        }
      })
  }
  backtosum(){
    this.shareService.backtosum.next('schedule_approval')
  }
}
