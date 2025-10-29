import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {ShareService} from '../share.service'
import {VfmService} from "../vfm.service";
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '../notification.service'
import { Component, OnInit,Output,EventEmitter,ViewChild,HostListener,ElementRef, ɵbypassSanitizationTrustUrl, Sanitizer } from '@angular/core';
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
  selector: 'app-monthly-detail',
  templateUrl: './monthly-detail.component.html',
  styleUrls: ['./monthly-detail.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class MonthlyDetailComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  vehicleid: any;
  vehicledetailid: any;
  monthlyrunForm:FormGroup
  issubmitbtn:boolean=true
  iseditbtn:boolean=false
  monthList: any;
  constructor(private datePipe: DatePipe,private router: Router,private shareservice:ShareService, private notification :NotificationService,private fb:FormBuilder,private vfmService:VfmService) { }


  ngOnInit(): void {
    let data=this.shareservice.vehiclesummaryData.value;
    this.vehicleid=data['id']
    this.vehicledetailid=this.shareservice.vehicledetailData.value;
    this.monthlyrunForm = this.fb.group({
      year: [''],
      month:[''],
      monthly_odo: [''],
      total_fuel: ['']
    })
    if(this.vehicledetailid!=0){
      this.vfmService.getsrundetailslist(this.vehicledetailid)
      .subscribe((results: any) => {
        console.log("res",results)
        this.issubmitbtn = false;
        this.iseditbtn=true;
        let year=this.datePipe.transform(results['year'], 'yyyy-MM-dd')
        let month=results['month'].id
        let monthly_odo=results['monthly_odo']
        let total_fuel=results['total_fuel']
        this.monthlyrunForm.patchValue({
          year: year,
          month:month,
          monthly_odo: monthly_odo,
          total_fuel:total_fuel
        })
      })
    }
    this.getmonth();
  }
  back(){
    this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Monthly Run Detail" }, skipLocationChange: true });                              

  }
  getmonth(){
    this.vfmService.getmonthlist()
      .subscribe(result => {
        this.monthList = result['data']
        
      })
  }
  submitForm(){
    if (this.monthlyrunForm.value.year === "") {
      this.notification.showError("Please Select Year");
      return false;
    }
    if (this.monthlyrunForm.value.month === "") {
      this.notification.showError("Please Select Month");
      return false;
    }  
    if (this.monthlyrunForm.value.monthly_odo === "") {
      this.notification.showError("Please Enter Monthly Odo");
      return false;
    } 
    if (this.monthlyrunForm.value.total_fuel === "") {
      this.notification.showError("Please Enter Total Fuel");
      return false;
    } 
    
    this.monthlyrunForm.value.year = this.datePipe.transform(this.monthlyrunForm.value.year, 'yyyy-MM-dd');
  this.vfmService.createrunmakers(this.monthlyrunForm.value,this.vehicleid)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit();     
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Monthly Run Detail" }, skipLocationChange: true });                              

          
                                                  
        
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  Editform(){
    if (this.monthlyrunForm.value.year === "") {
      this.notification.showError("Please Select Year");
      return false;
    }
    if (this.monthlyrunForm.value.month === "") {
      this.notification.showError("Please Select Month");
      return false;
    }  
    if (this.monthlyrunForm.value.monthly_odo === "") {
      this.notification.showError("Please Enter Monthly Odo");
      return false;
    } 
    if (this.monthlyrunForm.value.total_fuel === "") {
      this.notification.showError("Please Enter Total Fuel");
      return false;
    } 
  this.monthlyrunForm.value.year = this.datePipe.transform(this.monthlyrunForm.value.year, 'yyyy-MM-dd');
  this.vfmService.editrunmakerdetail(this.vehicleid,this.vehicledetailid,this.monthlyrunForm.value)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit();    
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Monthly Run Detail" }, skipLocationChange: true });                              

                                                
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
}
