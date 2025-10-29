import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import {ShareService} from '../share.service'
import {VfmService} from "../vfm.service";
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
  selector: 'app-fast-tag',
  templateUrl: './fast-tag.component.html',
  styleUrls: ['./fast-tag.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class FastTagComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  fasttagForm:FormGroup
  vehicleid: any;
  vehicledetailid: any;
  issubmitbtn:boolean=true
  iseditbtn:boolean=false

  constructor(private datePipe: DatePipe,private router: Router,private shareservice:ShareService, private notification :NotificationService,private fb:FormBuilder,private vfmService:VfmService) { }

  ngOnInit(): void {
    let data=this.shareservice.vehiclesummaryData.value;
    this.vehicleid=data['id']
    this.vehicledetailid=this.shareservice.vehicledetailData.value;
    this.fasttagForm = this.fb.group({
      recharged_date: [''],
      // recharged_reason:[''],
      recharged_amount: ['']
    })
    if(this.vehicledetailid!=0){
    this.vfmService.getfasttagdetailslist(this.vehicledetailid)
    .subscribe((results: any) => {
      console.log("res",results)
      this.issubmitbtn = false;
      this.iseditbtn=true;
      let recharged_date=this.datePipe.transform(results['recharged_date'], 'yyyy-MM-dd')
      // let recharged_reason=results['recharged_reason']
      let recharged_amount=results['recharged_amount']
     

      this.fasttagForm.patchValue({
        recharged_date: recharged_date,
        // recharged_reason:recharged_reason,
        recharged_amount: recharged_amount
      })
    })
  }
  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }

  submitForm(){
    if (this.fasttagForm.value.recharged_date === "") {
      this.notification.showError("Please Select Recharged Date");
      return false;
    }
    // if (this.fasttagForm.value.recharged_reason === "") {
    //   this.notification.showError("Please Enter Recharged Reason");
    //   return false;
    // }  
    if (this.fasttagForm.value.recharged_amount === "") {
      this.notification.showError("Please Enter Recharged Amount");
      return false;
    } 
   
  this.fasttagForm.value.recharged_date = this.datePipe.transform(this.fasttagForm.value.recharged_date, 'yyyy-MM-dd');
    
  this.vfmService.createfasttagmakers(this.fasttagForm.value,this.vehicleid)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit(); 
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Vehicle FastTag" }, skipLocationChange: true });                              

          
                                                  
        
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  back(){
    this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Vehicle FastTag" }, skipLocationChange: true });                              

  }
  Editform(){
    if (this.fasttagForm.value.recharged_date === "") {
      this.notification.showError("Please Select Recharged Date");
      return false;
    }
    // if (this.fasttagForm.value.recharged_reason === "") {
    //   this.notification.showError("Please Enter Recharged Reason");
    //   return false;
    // }  
    if (this.fasttagForm.value.recharged_amount === "") {
      this.notification.showError("Please Enter Recharged Amount");
      return false;
    } 
  this.fasttagForm.value.recharged_date = this.datePipe.transform(this.fasttagForm.value.recharged_date, 'yyyy-MM-dd');
    this.vfmService.editfasttagmakerdetail(this.vehicleid,this.vehicledetailid,this.fasttagForm.value)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit();
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Vehicle FastTag" }, skipLocationChange: true });                              
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
}
