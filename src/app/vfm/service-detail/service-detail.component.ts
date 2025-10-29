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
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ServiceDetailComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('autocompleteemp') matemp:any;
  serviceForm:FormGroup
  usageList:any[]= [
    { id: 1,
      text: "General" },
    { id: 2,
      text: "Annual"},
    {
      id: 3,
      text: "Accident"
    },
    {
      id: 4,
      text: "Repair"
    },
    {
      id: 5,
      text: "Other"
    }
  ]
  radiocheck: any[] = [
    { value: 1, display: 'YES' },
    { value: 0, display: 'NO' }
  ]
  vehicleid: any;
  vehicledetailid: any;
  issubmitbtn:boolean=true
  iseditbtn:boolean=false
  startlimit: Date;
  endlimit: Date;
  select: Date;
  selectend: Date;
  total: number;
  tourdatenot: boolean;
  isaccident:boolean=false
  dateedit:boolean
  branchemployee: any;
  has_presentid: number = 1;
  service:boolean
  has_nextid: boolean = true;
  has_previousid: boolean = true
  has_presentids:boolean=true;
  has_presenntids:any
  vendor: boolean;
  empselectedname: any;
  vendor_id: any;
  id: any;
  type: any;

  constructor(private datePipe: DatePipe,private router: Router,private shareservice:ShareService, private notification :NotificationService,private fb:FormBuilder,private vfmService:VfmService) { }


  ngOnInit(): void {
    let data=this.shareservice.vehiclesummaryData.value;
    this.vehicleid=data['id']
    this.vehicledetailid=this.shareservice.vehicledetailData.value;
    this.serviceForm = this.fb.group({
      service_by: [''],
      service_date:[''],
      next_service_date: [''],
      type: [''],
      // spare_replace: [''],
      vehicle_odo:[''],
      service_cost:[''],
      insurance_claimed: null
    })
    if(this.vehicledetailid!=0){
    this.vfmService.getservicedetailslist(this.vehicledetailid)
    .subscribe((results: any) => {
      console.log("res",results)
      this.issubmitbtn = false;
      this.iseditbtn=true;
      let service_date=this.datePipe.transform(results['service_date'], 'yyyy-MM-dd')
      let next_service_date=this.datePipe.transform(results['next_service_date'], 'yyyy-MM-dd')
      let vendor_id=results['service_by']
      let vehicle_odo=results['vehicle_odo']
      let service_cost=results['service_cost']
      this.vendor_id=results['service_by'].id
      let type=results['type'].text
      this.type=results['type'].id
      // let spare_replace=results['spare_replace']
      if(type=="Accident"){
        this.isaccident=true
      }
      let insurance_claimed=results['insurance_claimed']
      var vendordetail = '('+vendor_id.code+') ' +vendor_id.name
     

      this.serviceForm.patchValue({
        service_date: service_date,
        service_by:vendordetail,
        next_service_date: next_service_date,
        type:type,
        vehicle_odo:vehicle_odo,
        // spare_replace:spare_replace,
        insurance_claimed:insurance_claimed,
        service_cost:service_cost
      })
    })
  }
  this.serviceForm.get('service_by').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        // this.isLoading = true;
      }),
      switchMap(value => this.vfmService.getvendorchanges(value))
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchemployee = datas;
    });
this.getvendor();
  }
  back(){
    this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Vehicle Service History" }, skipLocationChange: true });                              

  }
  getvendor() {
    this.vfmService.getvendorname() .subscribe(res=>{
        this.branchemployee = res['data']
      }
    )

  }
  fromdateSelection(event: string) {
    // this.showdates=false
    // this.showstartdate=true
    // console.log("fromdate", event)
    const date = new Date(event)
    // this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate()) bug id:5900
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate()+ 1 )

    this.selectend = this.select 
    this.total=0
    this.tourdatenot = true;
    
    this.serviceForm.patchValue({ 
      next_service_date:null
    })
    if (this.dateedit ){
      this.dateedit = false;
      this.notification.showError("Tour Start Date is changed so change the details according to it.");
    }
   
  }
  servicetype(e){
    this.service=true
    this.id=e
      if(e==3){
        this.isaccident=true
      }
      else{
        this.isaccident=false
      }
  }
  employeenameselect(value) {
    this.vendor=true
    this.empselectedname = value.id
  }
  submitForm(){
    if (this.serviceForm.value.service_by === "") {
      this.notification.showError("Please Enter Service By");
      return false;
    }
    if (this.serviceForm.value.service_date === "") {
      this.notification.showError("Please Select Service Date");
      return false;
    }  
    if (this.serviceForm.value.next_service_date === "") {
      this.notification.showError("Please Select Next Service Date");
      return false;
    } 
    if (this.serviceForm.value.type === "") {
      this.notification.showError("Please Enter Type");
      return false;
    } 
    if (this.serviceForm.value.vehicle_odo === "") {
      this.notification.showError("Please Enter Vehicle Odo");
      return false;
    } 
    // if (this.serviceForm.value.spare_replace === "") {
    //   this.notification.showError("Please Enter Spare Replace");
    //   return false;
    // } 
    if (this.serviceForm.value.service_cost === "") {
      this.notification.showError("Please Enter Service Cost");
      return false;
    } 
   
  this.serviceForm.value.service_date = this.datePipe.transform(this.serviceForm.value.service_date, 'yyyy-MM-dd');
  this.serviceForm.value.next_service_date = this.datePipe.transform(this.serviceForm.value.next_service_date, 'yyyy-MM-dd');
  this.serviceForm.value.service_by = this.empselectedname
  this.serviceForm.value.type=this.id
  this.vfmService.createservicemakers(this.serviceForm.value,this.vehicleid)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit(); 
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Vehicle Service History" }, skipLocationChange: true });                              

          
                                                  
        
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  Editform(){
    if (this.serviceForm.value.service_by === "") {
      this.notification.showError("Please Enter Service By");
      return false;
    }
    if (this.serviceForm.value.service_date === "") {
      this.notification.showError("Please Select Service Date");
      return false;
    }  
    if (this.serviceForm.value.next_service_date === "") {
      this.notification.showError("Please Select Next Service Date");
      return false;
    } 
    if (this.serviceForm.value.type === "") {
      this.notification.showError("Please Enter Type");
      return false;
    } 
    if (this.serviceForm.value.fuel_reimbused === "") {
      this.notification.showError("Please Enter Fuel Reimbused");
      return false;
    } 
    if (this.serviceForm.value.vehicle_odo === "") {
      this.notification.showError("Please Enter Vehicle Odo");
      return false;
    } 
    if (this.serviceForm.value.reason === "") {
      this.notification.showError("Please Select Reason");
      return false;
    } 
    // if (this.serviceForm.value.spare_replace === "") {
    //   this.notification.showError("Please Enter Spare Replace");
    //   return false;
    // } 
    if (this.serviceForm.value.insurance_claimed === "") {
      this.notification.showError("Please Enter Insurance Claimed");
      return false;
    } 
    if (this.serviceForm.value.service_cost === "") {
      this.notification.showError("Please Enter Service Cost");
      return false;
    } 
    this.serviceForm.value.service_date = this.datePipe.transform(this.serviceForm.value.service_date, 'yyyy-MM-dd');
  this.serviceForm.value.next_service_date = this.datePipe.transform(this.serviceForm.value.next_service_date, 'yyyy-MM-dd');
  if(this.vendor){
    this.serviceForm.value.service_by=this.empselectedname
  }
  else{
    this.serviceForm.value.service_by=this.vendor_id
  } 
  if(this.service){
    this.serviceForm.value.type=this.id
  }
  else{
    this.serviceForm.value.type=this.type
  }
  this.vfmService.editservicemakerdetail(this.vehicleid,this.vehicledetailid,this.serviceForm.value)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit();
        this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Vehicle Service History" }, skipLocationChange: true });                              

                                                
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
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
  numbersonly(event){

    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
