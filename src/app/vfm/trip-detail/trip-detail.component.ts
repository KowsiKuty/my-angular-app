import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import {ShareService} from '../share.service'
import {VfmService} from "../vfm.service";
import { fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
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
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class TripDetailComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild('permitassetid') permitmatassetidauto:MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('assetid') matassetidauto: any;
  @ViewChild('inputassetid') inputasset: any;

   bookedtype:any[]= [
    {id:1 ,text:"Employee"},
    {id:2 ,text:"Branch"}
  ]
  tripdetailForm:FormGroup
  vehicleid: any;
  vehicledetailid: any;
  issubmitbtn:boolean=true
  iseditbtn:boolean=false
  has_presenntids:any;
  startlimit: Date;
  endlimit: Date;
  permittedlist: any;
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousid: boolean = true
  has_presentids:boolean=true;
  select: Date;
  branchlist: any
  selectend: Date;
  total: number;
  isDisabled: boolean=true;
  tourdatenot: boolean;
  dateedit:boolean
  isemployee:boolean
  isbranch:boolean
  inch: boolean;
  inchcharge:boolean
  book:boolean
  incharge_id: any;
  branch: boolean;
  statusupdatebranchid: any;
  bookid: any;
  bookfor: any;
  startvalue: any;
  endvalue: any;
  fuel: any;
  booked_by: any;
  booked_for: any;
  booked_for_type: any;
  mileage_run: any;
  book_for: any;
  start: any;
  end: any;
  constructor(private datePipe: DatePipe,private router: Router,private shareservice:ShareService, private notification :NotificationService,private fb:FormBuilder,private vfmService:VfmService) { }

  ngOnInit(): void {
    let data=this.shareservice.vehiclesummaryData.value;
    this.vehicleid=data['id']
    this.vehicledetailid=this.shareservice.vehicledetailData.value;
    this.tripdetailForm = this.fb.group({
      driver: [''],
      fuel_filled:[''],
      mileage_run: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      from_place: [''],
      to_place: [''],
      reason:[''],
      start_odo: [''],
      end_odo: [''],
      booked_by: [''],
      booked_for: null,
      booked_for_type: [''],
      fuel_amount:['']
    })
    if(this.vehicledetailid!=0){
      this.vfmService.gettripdetailslist(this.vehicledetailid)
      .subscribe((results: any) => {
        console.log("res",results)
        this.issubmitbtn = false;
        this.iseditbtn=true;
        let start_date=this.datePipe.transform(results['start_date'], 'yyyy-MM-dd')
        let end_date=this.datePipe.transform(results['end_date'], 'yyyy-MM-dd')
        let driver=results['driver']
        let fuel_filled=results['fuel_filled']
        let fuel_amount=results['fuel_amount']
        let mileage_run=results['mileage_run']
        this.mileage_run=results['mileage_run']
        let from_place=results['from_place']
        let to_place=results['to_place']
        let reason=results['reason']
        let start_odo=results['start_odo']
        this.start=results['start_odo']
        let end_odo=results['end_odo']
        this.end=results['end_odo']
        let booked_by=results['booked_by'].name
        this.booked_by=results['booked_by'].id
        let booked_for_type=results['booked_for_type'].text
        this.booked_for_type=results['booked_for_type'].id
       
        if(this.booked_for_type==1){
          this.isbranch=false
         }
         else{
          this.isbranch=true
          this.book_for=results['booked_for'].name
          this.booked_for=results['booked_for'].id
         }
        this.tripdetailForm.patchValue({
          start_date: start_date,
          end_date:end_date,
          driver: driver,
          fuel_filled: fuel_filled,
          mileage_run:mileage_run,
          from_place: from_place,
          to_place: to_place,
          reason:reason,
          fuel_amount:fuel_amount,
          start_odo: start_odo,
          end_odo: end_odo,
          booked_by:booked_by,
          booked_for: this.book_for,
          booked_for_type: booked_for_type

        })
      })
    }
    
    this.tripdetailForm.get('booked_for').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        // this.isLoading = true;
      }),
      switchMap(value => this.vfmService.getUsageCode(value, 1))
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchlist = datas;
      console.log("Branch List", this.branchlist)
    });
    this.tripdetailForm.get('booked_by').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
  
      }),

      switchMap(value => this.vfmService.getpermittedlist(value))
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.permittedlist = datas;
     console.log("permit List",this.permittedlist)
    });
    
this.getpermit();
this.getbranch();
  }
  incharge(e){
    this.inch=true
    this.incharge_id=e
  }
  incharge1(e){
    this.inchcharge=true
  this.bookfor=e
  }
  branchname(e) {
    this.branch=true
    this.statusupdatebranchid = e
  }
  back(){
    this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Trip Details" }, skipLocationChange: true });                              

  }
  getpermit(){
    this.vfmService.getpermitlist()
      .subscribe(result => {
        this.permittedlist = result['data']
        
      })
  }
  getbranch() {
    this.vfmService.getbranchname() .subscribe(res=>{
        this.branchlist = res['data']
      }
    )

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
    
    this.tripdetailForm.patchValue({ 
      end_date:null
    })
    if (this.dateedit ){
      this.dateedit = false;
      this.notification.showError("Tour Start Date is changed so change the details according to it.");
    }
   
  }
  bookType(e){
    this.book=true
    this.bookid=e
    if(e==1){
     this.isbranch=false
    }
    else{
     this.isbranch=true
    }
  }
  startodo(e){
   this.startvalue=e.target.value
   if(this.startvalue==""){
     this.startvalue=this.start
   }
   if(this.endvalue==""||this.endvalue==undefined){
    this.endvalue=this.end
  }
   if(this.startvalue>this.endvalue){
   this.tripdetailForm.patchValue({ 
    end_odo:null,
    mileage_run:null
  })
}
   this.fuel=this.endvalue-this.startvalue
   if (this.fuel< 0) {
    this.notification.showError("Mileage Run Can't be Negative")
    return false
  }
  }
  endodo(e){
   this.endvalue=e.target.value
   if(this.endvalue==""){
    this.endvalue=this.end
  }
  if(this.startvalue==""||this.startvalue==undefined){
    this.startvalue=this.start
  }
   if(this.startvalue>this.endvalue){
    this.tripdetailForm.patchValue({ 
     end_odo:null,
     mileage_run:null
   })
  }
   this.fuel=this.endvalue-this.startvalue
   if (this.fuel< 0) {
    this.notification.showError("Mileage Run Can't be Negative")
    return false
  }
  }
  numberOnly(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }
  submitForm(){
    if (this.tripdetailForm.value.driver === "") {
      this.notification.showError("Please Enter Driver");
      return false;
    }
    if (this.tripdetailForm.value.start_date === "") {
      this.notification.showError("Please Enter Start Date");
      return false;
    }
    if (this.tripdetailForm.value.end_date === "" || this.tripdetailForm.value.end_date == null) {
      this.notification.showError("Please Enter End Date");
      return false;
    }  
    if (this.tripdetailForm.value.fuel_filled === "") {
      this.notification.showError("Please Enter Fuel Filled");
      return false;
    }  
    if (this.tripdetailForm.value.fuel_amount === "") {
      this.notification.showError("Please Enter Fuel Bill");
      return false;
    }  
    // if (this.tripdetailForm.value.mileage_run === "") {
    //   this.notification.showError("Please Enter Mileage Run");
    //   return false;
    // } 

   
    if (this.tripdetailForm.value.from_place === "") {
      this.notification.showError("Please Enter From Place");
      return false;
    } 
    if (this.tripdetailForm.value.to_place === "") {
      this.notification.showError("Please Enter To Place");
      return false;
    } 
    if (this.tripdetailForm.value.start_odo === "") {
      this.notification.showError("Please Enter Start Odo");
      return false;
    }
    if (this.tripdetailForm.value.end_odo === "") {
      this.notification.showError("Please Enter End Odo");
      return false;
    }  
  
    if (this.tripdetailForm.value.booked_by === "") {
      this.notification.showError("Please Enter Booked By");
      return false;
    }
    
    if (this.tripdetailForm.value.reason === "") {
      this.notification.showError("Please Enter Reason");
      return false;
    }
    if(this.bookid==2){
    if (this.tripdetailForm.value.booked_for === "") {
      this.notification.showError("Please Enter Booked For");
      return false;
    }  
  }
    if (this.tripdetailForm.value.booked_for_type === "") {
      this.notification.showError("Please Enter Booked For Type");
      return false;
    } 
   
 
  if(this.bookid==2){
   
  this.tripdetailForm.value.booked_for=this.statusupdatebranchid
  }
  else{
  this.tripdetailForm.value.booked_for=this.incharge_id
  }
  if (this.fuel< 0||this.tripdetailForm.value.mileage_run<0) {
    this.notification.showError("Mileage Run Can't be Negative")
    return false
  }
    this.tripdetailForm.value.start_date = this.datePipe.transform(this.tripdetailForm.value.start_date, 'yyyy-MM-dd');
    this.tripdetailForm.value.end_date = this.datePipe.transform(this.tripdetailForm.value.end_date, 'yyyy-MM-dd');
    this.tripdetailForm.value.booked_by= this.incharge_id
    this.tripdetailForm.value.booked_for_type=this.bookid
    this.tripdetailForm.value.mileage_run=this.fuel
    
  this.vfmService.createtripmakers(this.tripdetailForm.value,this.vehicleid)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit();    
         this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Trip Details" }, skipLocationChange: true });                              

          
                                                  
        
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  Editform(){
    if( this.fuel==""||this.startvalue==undefined){
      this.tripdetailForm.value.mileage_run=this.mileage_run
      }
      else{
      this.tripdetailForm.value.mileage_run=this.fuel
      }
      if (this.tripdetailForm.value.driver === "") {
        this.notification.showError("Please Enter Driver");
        return false;
      }
      if (this.tripdetailForm.value.start_date === "") {
        this.notification.showError("Please Enter Start Date");
        return false;
      }
      if (this.tripdetailForm.value.end_date === "") {
        this.notification.showError("Please Enter End Date");
        return false;
      }  
      if (this.tripdetailForm.value.fuel_filled === "") {
        this.notification.showError("Please Enter Fuel Filled");
        return false;
      }  
      if (this.tripdetailForm.value.fuel_amount === "") {
        this.notification.showError("Please Enter Fuel Bill");
        return false;
      }  
      // if (this.tripdetailForm.value.mileage_run === "") {
      //   this.notification.showError("Please Enter Mileage Run");
      //   return false;
      // } 
     
      if (this.tripdetailForm.value.from_place === "") {
        this.notification.showError("Please Enter From Place");
        return false;
      } 
      if (this.tripdetailForm.value.to_place === "") {
        this.notification.showError("Please Enter To Place");
        return false;
      } 
      if (this.tripdetailForm.value.start_odo === "") {
        this.notification.showError("Please Enter Start Odo");
        return false;
      }
      if (this.tripdetailForm.value.end_odo === "") {
        this.notification.showError("Please Enter End Odo");
        return false;
      }  
     
      if (this.tripdetailForm.value.booked_by === "") {
        this.notification.showError("Please Enter Booked By");
        return false;
      }
      if (this.tripdetailForm.value.booked_for === "") {
        this.notification.showError("Please Enter Booked For");
        return false;
      }  
      if (this.tripdetailForm.value.booked_for_type === "") {
        this.notification.showError("Please Enter Booked For Type");
        return false;
      } 
      if (this.tripdetailForm.value.reason === "") {
        this.notification.showError("Please Enter Reason");
        return false;
      }
     if(this.book){
      this.tripdetailForm.value.booked_for_type=this.bookid
  
     }
     else{
      this.tripdetailForm.value.booked_for_type=this.booked_for_type
     }
      if(this.inch){
        this.tripdetailForm.value.booked_by=this.incharge_id
      }
      else{
        this.tripdetailForm.value.booked_by=this.booked_by
      }
    if(this.bookid==2){
      if(this.branch){
        this.tripdetailForm.value.booked_for=this.statusupdatebranchid
      }
      else{
        this.tripdetailForm.value.booked_for=this.booked_for
      }
     
     
    }
    else{
    if(this.inch){
      this.tripdetailForm.value.booked_for=this.incharge_id
    }
    else{
      this.tripdetailForm.value.booked_for=this.booked_by
    }
   
  }
  if (this.fuel< 0||this.tripdetailForm.value.mileage_run<0) {
    this.notification.showError("Mileage Run Can't be Negative")
    return false
  }
    this.tripdetailForm.value.start_date = this.datePipe.transform(this.tripdetailForm.value.start_date, 'yyyy-MM-dd');
    this.tripdetailForm.value.end_date = this.datePipe.transform(this.tripdetailForm.value.end_date, 'yyyy-MM-dd');
  
      this.vfmService.edittripmakerdetail(this.vehicleid,this.vehicledetailid,this.tripdetailForm.value)
      .subscribe(res => {
        console.log("incires", res)
        if (res.status === "success") {
          this.notification.showSuccess("Success....")
          this.onSubmit.emit();    
          this.router.navigate(['vfm/fleet_view'], { queryParams: { status: "Trip Details" }, skipLocationChange: true });                              

                                                  
          
          return true;
        }else {
          this.notification.showError(res.description)
          return false;
        }
      })
    }
    permitautocompleteid(){
      setTimeout(()=>{
        if(this.permitmatassetidauto && this.autocompletetrigger && this.permitmatassetidauto.panel){
          fromEvent(this.permitmatassetidauto.panel.nativeElement,'scroll').pipe(
            map(x=> this.permitmatassetidauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          ).subscribe(data=>{
            const scrollTop=this.permitmatassetidauto.panel.nativeElement.scrollTop;
            const scrollHeight=this.permitmatassetidauto.panel.nativeElement.scrollHeight;
            const elementHeight=this.permitmatassetidauto.panel.nativeElement.clientHeight;
            const atBottom=scrollHeight-1<=scrollTop +elementHeight;
            console.log("CALLLLL",atBottom)
            if(atBottom){
    
              if(this.has_nextid){
                this.vfmService.getpermitpage(this.has_presentid + 1).subscribe(data=>{
                  let dts=data['data'];
                  console.log('h--=',data);
                  console.log("SS",dts)
                  console.log("GGGgst",this.permittedlist)
                  let pagination=data['pagination'];
                  this.permittedlist=this.permittedlist.concat(dts);
                  if(this.permittedlist.length>0){
                    this.has_nextid=pagination.has_next;
                    this.has_presentid=pagination.has_previous;
                    this.has_presentid=pagination.index;
                    
                  }
                })
              }
            }
          })
        }
      })
     
    }
    autocompleteid() {
      setTimeout(() => {
        if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
          fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
            map(x => this.matassetidauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          ).subscribe(data => {
            const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            console.log("CALLLLL", atBottom)
            if (atBottom) {
  
              if (this.has_nextid) {
                this.vfmService.getUsageCode(this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                  let dts = data['data'];
                  console.log('h--=', data);
                  console.log("SS", dts)
                  console.log("GGGgst", this.branchlist)
                  let pagination = data['pagination'];
                  this.branchlist = this.branchlist.concat(dts);
  
                  if (this.branchlist.length > 0) {
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
 
}
