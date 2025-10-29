import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {ShareService} from '../share.service'
import {VfmService} from "../vfm.service";
import { fromEvent, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
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
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class InsuranceComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('autocompleteemp') matemp:any;

  insuranceForm:FormGroup
  vehicleid: any;
  vendorList: any;
  issubmitbtn:boolean=true
  iseditbtn:boolean=false
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousid: boolean = true
  has_presentids:boolean=true;
  has_presenntids:any

  radiocheck: any[] = [
    { value: 1, display: 'YES' },
    { value: 0, display: 'NO' }
  ]
  vehicledetailid: any;
  branchemployee: any;
  empselectedname: any;
  startlimit: Date;
  endlimit: Date;
  select: Date;
  vendor:boolean
  selectend: Date;
  total: number;
  tourdatenot: boolean;
  dateedit:boolean
  vendor_id: any;
  constructor(private datePipe: DatePipe,private router: Router,private shareservice:ShareService, private notification :NotificationService,private fb:FormBuilder,private vfmService:VfmService) { }

  ngOnInit(): void {
    let data=this.shareservice.vehiclesummaryData.value;
    this.vehicleid=data['id']
    this.vehicledetailid=this.shareservice.vehicledetailData.value;
    this.insuranceForm = this.fb.group({
      policy_no: [''],
      start_date:[''],
      end_date: [''],
      vendor_id: [''],
      is_claimed: [''],
      insurance_value:[''],
      premium_amount:['']
    })
    if(this.vehicledetailid!=0){
    this.vfmService.getinsurancedetailslist(this.vehicledetailid)
    .subscribe((results: any) => {
      console.log("res",results)
      this.issubmitbtn = false;
      this.iseditbtn=true;
      let start_date=this.datePipe.transform(results['start_date'], 'yyyy-MM-dd')
      let end_date  =this.datePipe?.transform(results['end_date'], 'yyyy-MM-dd')
      let policy_no=results['policy_no']
      let premium_amount=results['premium_amount']
      let vendor_id=results['vendor_id']
      this.vendor_id=results['vendor_id'].id
      let is_claimed=results['is_claimed']
      let insurance_value=results['insurance_value']
      var vendordetail = '('+vendor_id.code+') ' +vendor_id.name
     

      this.insuranceForm.patchValue({
        start_date: start_date,
        policy_no:policy_no,
        end_date: end_date,
        vendor_id:vendordetail,
        is_claimed:is_claimed,
        insurance_value:insurance_value,
        premium_amount:premium_amount
      })
    })
  }
    this.insuranceForm.get('vendor_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        // this.isLoading = true;
      }),
      switchMap(value => 
        this.vfmService.getvendorchanges(value).pipe(
          catchError(error => {
            // console.error('Error fetching vendor changes:', error);
            // Return an empty array or any fallback value to continue the stream
            return of({ data: [] });
          })
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchemployee = datas;
    });
    this.getvendor();
  }
  getvendor() {
    this.vfmService.getvendorname() .subscribe(res=>{
        this.branchemployee = res['data']
      }
    )

  }
  back(){
    this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Vehicle Insurance" }, skipLocationChange: true });                              
  }
  fromdateSelection(event: string) {
    // this.showdates=false
    // this.showstartdate=true
    // console.log("fromdate", event)
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate() )
    this.selectend = this.select
    this.total=0
    this.tourdatenot = true;
    
    this.insuranceForm.patchValue({
      end_date:null
    })
    if (this.dateedit ){
      this.dateedit = false;
      this.notification.showError("Tour Start Date is changed so change the details according to it.");
    }
   
  }
  autocompleteemps() {
    setTimeout(() => {
      if (this.matemp && this.autocompletetrigger && this.matemp.panel) {
        fromEvent(this.matemp.panel.nativeElement, 'scroll').pipe(
          map(x => this.matemp.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.matemp.panel.nativeElement.scrollTop;
          const scrollHeight = this.matemp.panel.nativeElement.scrollHeight;
          const elementHeight = this.matemp.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          // console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.vfmService.getvendorpage(this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                let pagination = data['pagination'];
                this.branchemployee = this.branchemployee.concat(dts);

                if (this.branchemployee.length > 0) {
                  this.has_nextid = pagination.has_next;
                  this.has_presentids = pagination.has_previous;
                  this.has_presenntids = pagination.index;

                }
              })
            }
          }
        })
      }
    })
  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }
  numberOnly1(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }
  employeenameselect(value) {
    this.vendor=true
    this.empselectedname = value.id
  }
  submitForm(){
    if (this.insuranceForm.value.policy_no === "") {
      this.notification.showError("Please Enter Policy No");
      return false;
    }
    if (this.insuranceForm.value.start_date === "") {
      this.notification.showError("Please Select Start Date");
      return false;
    }  
    if (this.insuranceForm.value.end_date === "") {
      this.notification.showError("Please Select End Date");
      return false;
    } 
   
    if (this.insuranceForm.value.vendor_id === "") {
      this.notification.showError("Please Select vendor");
      return false;
    } 
    if (this.insuranceForm.value.is_claimed === "") {
      this.notification.showError("Please Select Is Claimed");
      return false;
    } 
    if (this.insuranceForm.value.insurance_value === "") {
      this.notification.showError("Please Enter Isurance Value");
      return false;
    } 
    if (this.insuranceForm.value.premium_amount === "") {
      this.notification.showError("Please Enter Premium Amount");
      return false;
    } 
    //5898
    let premiumamt=this.insuranceForm.value.premium_amount
    let insuranceval=this.insuranceForm.value.insurance_value
    if(premiumamt>insuranceval){
       this.notification.showError('Premium Amount sholud be less than or equal to Insurance value')
       return false;
    }
    ///
   
  this.insuranceForm.value.start_date = this.datePipe.transform(this.insuranceForm.value.start_date, 'yyyy-MM-dd');
  this.insuranceForm.value.end_date = this.datePipe.transform(this.insuranceForm.value.end_date, 'yyyy-MM-dd');
  this.insuranceForm.value.vendor_id = this.empselectedname
  this.vfmService.createinsurancemakers(this.insuranceForm.value,this.vehicleid)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit(); 
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Vehicle Insurance" }, skipLocationChange: true });                              
          
                                                  
        
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  Editform(){
    if (this.insuranceForm.value.policy_no === "") {
      this.notification.showError("Please Enter Policy No");
      return false;
    }
    if (this.insuranceForm.value.start_date === "") {
      this.notification.showError("Please Select Start Date");
      return false;
    }  
    if (this.insuranceForm.value.end_date === "") {
      this.notification.showError("Please Select End Date");
      return false;
    } 
    
    if (this.insuranceForm.value.vendor_id === "") {
      this.notification.showError("Please Select vendor");
      return false;
    } 
    if (this.insuranceForm.value.is_claimed === "") {
      this.notification.showError("Please Select Is Claimed");
      return false;
    } 
    if (this.insuranceForm.value.insurance_value === "") {
      this.notification.showError("Please Enter Isurance Value");
      return false;
    } 
    if (this.insuranceForm.value.premium_amount === "") {
      this.notification.showError("Please Enter Premium Amount");
      return false;
    } 

    //5898
    let premiumamt=this.insuranceForm.value.premium_amount
    let insuranceval=this.insuranceForm.value.insurance_value
    if(premiumamt>insuranceval){
       this.notification.showError('Premium Amount sholud be less than or equal to Insurance value')
       return false;
    }
    ///
  this.insuranceForm.value.start_date = this.datePipe.transform(this.insuranceForm.value.start_date, 'yyyy-MM-dd');
  this.insuranceForm.value.end_date = this.datePipe.transform(this.insuranceForm.value.end_date, 'yyyy-MM-dd');
  if(this.vendor){
    this.insuranceForm.value.vendor_id=this.empselectedname
  }
  else{
    this.insuranceForm.value.vendor_id=this.vendor_id
  }
    this.vfmService.editinsurancemakerdetail(this.vehicleid,this.vehicledetailid,this.insuranceForm.value)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit();
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Vehicle Insurance" }, skipLocationChange: true });                              
                                                
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
}
