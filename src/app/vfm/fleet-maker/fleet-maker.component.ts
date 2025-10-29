import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {VfmService} from "../vfm.service";
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit,Output,EventEmitter,ViewChild,HostListener,ElementRef, ɵbypassSanitizationTrustUrl, Sanitizer } from '@angular/core';
import { NotificationService } from '../notification.service'
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent, of } from 'rxjs';
import {ShareService} from '../share.service'
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);
      } else {
          return date.toDateString();
      }
  }
}
@Component({
  selector: 'app-fleet-maker',
  templateUrl: './fleet-maker.component.html',
  styleUrls: ['./fleet-maker.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class FleetMakerComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
  @ViewChild('assetid') matassetidauto: any;
  @ViewChild('premiseid') premiseassetidauto: any;
  @ViewChild('permitassetid') permitmatassetidauto:MatAutocomplete;
  @ViewChild('departmentid') deptmatassetidauto:MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild('inputassetid') inputasset: any;
  @ViewChild('premiseassetid') premiseasset: any;
  @ViewChild('autocompleteemp') matemp:any;
  @ViewChild('permitinputassetid') permitinputasset:any;
  

  vehicleForm : FormGroup;
  branchemployee: any;
  isvendorList:boolean=false
  isSumbitbtn:boolean
  dept:boolean
  branchlist: any
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousid: boolean = true
  has_presentids:boolean=true;
  inch:boolean
  emplyeeid:boolean
  prevalue:boolean
  has_presenntids:any;
  issubmitbtn:boolean=true
  iseditbtn:boolean=false
  isownership:boolean=false
  isexcecutive:boolean=false
  isfc:boolean=false
  ispc:boolean=false
  ownerShipData:any[]= [
    {id:1 ,text:"Own"},
    {id:2 ,text:"Rental"}
  ]
  fuelTypeList:any[]= [
    {id:1, text:"diesel"},
    {id:2, text:"petrol"},
    {id:3, text:"electric"}
  ]
  usertypeList:any[]= [
    {id: 1, text: "Common Use"},
    {id: 2, text: "By Executive"}
  ]
  radiocheck: any[] = [
    { value: 1, display: 'YES' },
    { value: 0, display: 'NO' }
  ]
  radiocheck1: any[] = [
    { value: 1, display: 'YES' },
    { value: 0, display: 'NO' }
  ]
  statusupdatebranchid: any;
  vendorData: any;
  empselectedname: any;
  vehicleid: any;
  ownershiptype: any;
  vendor:boolean
  owner_id: any;
  branch:boolean
  permittedlist: any;
  incharge_id: any;
  pc_applicable: any;
  fc_applicable: any;
  usage_type: any;
  branch_id: any;
  inchargeid: any;
  vendor_type: any;
  execute: any;
  employee: any;
  emp_id: any;
  designationlist: any;
  designation: any;
  deptlist: any;
  deptid: any;
  premiselist: any;
  preid: any;
  premise: any;
  department: any;
  employeename: any;
  

  constructor(private datePipe: DatePipe,private shareservice:ShareService,private fb:FormBuilder, private notification :NotificationService,private router: Router,private vfmService:VfmService) { }

  ngOnInit(): void {
    this.vehicleid=this.shareservice.vehiclesummaryData.value;
    this.vehicleForm = this.fb.group({
      vehicle_no: [''],
      user_type:null,
      vehicle_model: [''],
      fuel_type: [''],
      ownership_type: [''],
      incharge: [''],
      vendor_id: [''],
      branch_id: [''],
      pc_applicable:[''],
      fc_applicable:[''],
      premise_id:[''],
      pc_end_date:null,
      fc_end_date:null,
      engine_no:[''],
      chassis_no:[''],
      employee_id:[''],
      department_id:null

    })
    this.getdept()
    this.getvendor()
    this.getpermit()
    if(this.vehicleid!=0){
    this.vfmService.getvehicledetail(this.vehicleid)
    .subscribe((results: any) => {
      console.log("res",results)
      this.issubmitbtn = false;
      this.iseditbtn=true;
      let vehicle_no=results['vehicle_no']
      let vehicle_model=results['vehicle_model']
      let ownership_type=results['ownership_type'].id
      this.owner_id=results['ownership_type'].id
      let fuel_type=results['fuel_type'].id
      let engine_no=results['engine_no']
      let chassis_no=results['chassis_no']
      let premise=results['premise']
      let department=results['department']
      let branch_id=results['branch']
      this.branch_id=results['branch'].id
      let vendor_type=results['vendor']
      this.pc_applicable=results['pc_applicable']
      this.fc_applicable=results['fc_applicable']
      let pc_end_date=this.datePipe.transform(results['pc_end_date'], 'yyyy-MM-dd')
      let fc_end_date=this.datePipe.transform(results['fc_end_date'], 'yyyy-MM-dd')
      let incharge=results['incharge'].name
      this.inchargeid=results['incharge'].id
      this.premise= results['premise'].id
      this.department= results['department'].id
      var branchdetail = '('+branch_id.code+') ' +branch_id.name
      var premisedetail = '('+premise.code+') ' +premise.name
      var departmentdetail = '('+department.code+') ' +department.name
      if(this.owner_id==1){
        this.usage_type=results['usage_type'].id
        if(this.usage_type==2){
          this.employeename =results['employee'].fullname
          this.employee=results['employee'].id
          this.designation =results['employee'].designation
          this.isexcecutive=true
        }
        else{
          this.isexcecutive=false
        }
        this.isownership=true
        if(this.pc_applicable=="NO"){
          this.ispc=false
        }
        else{
          this.ispc=true
        }
        if(this.fc_applicable=="NO"){
          this.isfc=false
        }
        else{
          this.isfc=true
        }
      }
      if(this.owner_id==2){
        this.isvendorList=true
      this.vendor_type=results['vendor'].id
        var vendordetail = '('+vendor_type.code+') ' +vendor_type.name
      }
      this.vehicleForm.patchValue({ 
        vehicle_no: vehicle_no,
        user_type:this.usage_type,
        vehicle_model: vehicle_model,
        fuel_type: fuel_type,
        ownership_type: ownership_type,


        incharge: incharge,
        branch_id: branchdetail,
        employee_id:this.employeename,

        pc_applicable:this.pc_applicable,
        fc_applicable:this.fc_applicable,
        pc_end_date:pc_end_date,

        premise_id:premisedetail,

        fc_end_date:fc_end_date,
        engine_no:engine_no,
        chassis_no:chassis_no,

        vendor_id: vendordetail,
        department_id:departmentdetail
      })
    })
    
  }
    // this.vehicleForm.get('branch_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       // this.isLoading = true;
    //     }),
    //     switchMap(value => this.vfmService.getUsage(this.deptid,value, 1))
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.branchlist = datas;
    //     console.log("Branch List", this.branchlist)
    //   });
    //   this.vehicleForm.get('premise_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       // this.isLoading = true;
    //     }),
    //     switchMap(value => this.vfmService.getpremise(this.statusupdatebranchid,value, 1))
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.premiselist = datas;
    //     console.log("Branch List", this.premiselist)
    //   });
      // this.vehicleForm.get('vendor_id').valueChanges
      // .pipe(
      //   debounceTime(100),
      //   distinctUntilChanged(),
      //   tap(() => {
      //     // this.isLoading = true;
      //   }),
      //   switchMap(value => this.vfmService.getvendorchanges(value))
      // )
      // .subscribe((results: any[]) => {
      //   let datas = results["data"];
      //   this.branchemployee = datas;
      // });
      this.vehicleForm.get('vendor_id').valueChanges
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

      this.vehicleForm.get('incharge').valueChanges
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
      this.vehicleForm.get('department_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
    
        }),
  
        switchMap(value => this.vfmService.getdepartmentlist(value))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.deptlist = datas;
       console.log("permit List",this.deptlist)
      });
      this.vehicleForm.get('employee_id').valueChanges
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
   
  }
  getpermit(){
    this.vfmService.getpermitlist()
      .subscribe(result => {
        this.permittedlist = result['data']
        
      })
  }
  getdept(){
    this.vfmService.getdept()
      .subscribe(result => {
        this.deptlist = result['data']
        
      })
  }
  inchargeval(){
    this.vfmService.getpermitlist()
    .subscribe(result => {
      this.permittedlist = result['data']
      
    })
  }
  incharge(e){
    this.inch=true
    this.incharge_id=e
  }
  excecutive(e){
    this.execute=e
    if(this.execute=="By Executive"){
      this.isexcecutive=true
    }
    else{
      this.isexcecutive=false
    }
  }
  departmentval(e){
    this.dept=true
     this.deptid=e
     this.vfmService.getbranch(this.deptid) .subscribe(res=>{
      this.branchlist = res['data']
    }
  )
  }
  permitupdate(e){
    this.getvendor();
    this.ownershiptype=e
    if(this.ownershiptype=="Own"){
      this.isownership=true
      this.isvendorList=false
    }
    else{
      this.isownership=false
      this.isvendorList=true
    }
   
  }
  fcvalue(e){
    if(e==1){
      this.isfc=true
    }
    else{
      this.isfc=false
    }
  }
  pcvalue(e){
    if(e==1){
      this.ispc=true
    }
    else{
      this.ispc=false
    }
  }
  employeenameselect(e) {
    this.vendor=true
    this.empselectedname = e
  }
  emp(e,f){
    this.emplyeeid=true
    this.emp_id=e
    this.designation=f
    // this.getdesignation();
  }
  // getdesignation(){
  //   this.vfmService.getdesignation(this.emp_id)
  //     .subscribe(result => {
  //       this.designationlist = result
  //       this.designation=result['designation']
  //       console.log("design",this.designation)
  //     })
  // }
  submitForm(){
    if (this.vehicleForm.value.vehicle_no === "") {
      this.notification.showError("Please Enter  Vehicle No");
      return false;
    }
    if (this.vehicleForm.value.vehicle_model === "") {
      this.notification.showError("Please Enter Vehicle Model");
      return false;
    }  
    if (this.vehicleForm.value.ownership_type === "") {
      this.notification.showError("Please Select Ownership Type");
      return false;
    }
    // if (this.vehicleForm.value.premise_id === "") {
    //   this.notification.showError("Please Enter Premise Name");
    //   return false;
    // }  
    // if (this.vehicleForm.value.department_id.id  === undefined|| this.vehicleForm.value.department_id === "") {
    //   this.notification.showError("Please Select Valid Department");
    //   return false;
    // } 

    if (this.vehicleForm.value.branch_id.id  === undefined|| this.vehicleForm.value.branch_id === "") {
      this.notification.showError("Please Select Valid Branch");
      return false;
    }
    if (this.vehicleForm.value.premise_id.id  === undefined|| this.vehicleForm.value.premise_id === "") {
      this.notification.showError("Please Select Valid Premises");
      return false;
    } 
    if (this.vehicleForm.value.fuel_type === "") {
      this.notification.showError("Please Select Fuel Type");
      return false;
    } 
   
    if (this.vehicleForm.value.incharge.id === undefined || this.vehicleForm.value.incharge === "") {
      this.notification.showError("Please Select Valid Incharge");
      return false;
    } 
    if(this.ownershiptype=="Rental"){
      if (this.vehicleForm.value.vendor_id.id === undefined || this.vehicleForm.value.vendor_id === "") {
        this.notification.showError("Please Select Valid Vendor Type");
        return false;
      } 
    }
    if(this.ownershiptype=="Own"){
      if (this.vehicleForm.value.user_type === null || this.vehicleForm.value.user_type === ""  ) {
        this.notification.showError("Please Select Usage Type");
        return false;
      }  
      if (this.vehicleForm.value.pc_applicable === "") {
        this.notification.showError("Please Select Pc Applicable");
        return false;
      } 
      if (this.vehicleForm.value.fc_applicable === "") {
        this.notification.showError("Please Select Fc Applicable");
        return false;
      } 
    }
    if(this.execute=="By Executive"){
      if (this.vehicleForm.value.employee_id.id === undefined ||  this.vehicleForm.value.employee_id === "") {
        this.notification.showError("Please Select Valid Employee");
        return false;
      } 
      
    }
  this.vehicleForm.value.pc_end_date = this.datePipe.transform(this.vehicleForm.value.pc_end_date, 'yyyy-MM-dd');
  this.vehicleForm.value.fc_end_date = this.datePipe.transform(this.vehicleForm.value.fc_end_date, 'yyyy-MM-dd');
  this.vehicleForm.value.branch_id =  this.statusupdatebranchid
  this.vehicleForm.value.incharge = this.incharge_id
  this.vehicleForm.value.premise_id = this.preid
  this.vehicleForm.value.vendor_id = this.empselectedname
  this.vehicleForm.value.employee_id=this.emp_id
  this.vehicleForm.value.department_id=this.deptid
  console.log("bbbbbbb", this.vehicleForm.value)
  this.vfmService.createvehiclemakers(this.vehicleForm.value)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.isSumbitbtn=true
        this.onSubmit.emit(); 
        this.router.navigateByUrl('vfm/fleet_summary');
          
                                                  
        
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  Editform(){
    if (this.vehicleForm.value.vehicle_no === "") {
      this.notification.showError("Please Enter  Vehicle No");
      return false;
    }
    if (this.vehicleForm.value.vehicle_model === "") {
      this.notification.showError("Please Enter Vehicle Model");
      return false;
    }  
    if (this.vehicleForm.value.ownership_type === "") {
      this.notification.showError("Please Select Ownership Type");
      return false;
    }      

    // if (this.vehicleForm.value.department_id.id  === undefined|| this.vehicleForm.value.department_id === "") {
    //   this.notification.showError("Please Select Valid Department");
    //   return false;
    // } 

    if (this.vehicleForm.value.branch_id.id  === undefined|| this.vehicleForm.value.branch_id === "") {
      this.notification.showError("Please Select Valid Branch");
      return false;
    }
    if (this.vehicleForm.value.premise_id.id  === undefined|| this.vehicleForm.value.premise_id === "") {
      this.notification.showError("Please Select Valid Premises");
      return false;
    }  
   
    if (this.vehicleForm.value.fuel_type === "") {
      this.notification.showError("Please Select Fuel Type");
      return false;
    } 
    
   
    // if (this.vehicleForm.value.premise_id=== "") {
    //   this.notification.showError("Please Enter Premise Name");
    //   return false;
    // }  
    
    if (this.vehicleForm.value.incharge.id  === undefined|| this.vehicleForm.value.incharge === "") {
      this.notification.showError("Please Select Valid Incharge");
      return false;
    } 
    if(this.ownershiptype=="Rental"){
      if ( this.vehicleForm.value.vendor_id.id  === undefined || this.vehicleForm.value.vendor_id === "") {
        this.notification.showError("Please Select Valid Vendor Type");
        return false;
      } 
    }
    if(this.ownershiptype=="Own"){
      if (this.vehicleForm.value.user_type === null || this.vehicleForm.value.user_type === "") {
        this.notification.showError("Please Select Usage Type");
        return false;
      } 
  
      if (this.vehicleForm.value.pc_applicable === "") {
        this.notification.showError("Please Select Pc Applicable");
        return false;
      } 
      if (this.vehicleForm.value.fc_applicable === "") {
        this.notification.showError("Please Select Fc Applicable");
        return false;
      } 
    }
    if(this.execute=="By Executive"){
      if (this.vehicleForm.value.employee_id.id  === undefined || this.vehicleForm.value.employee_id === "") {
        this.notification.showError("Please Select Valid Employee");
        return false;
      } 
     
    }
    this.vehicleForm.value.pc_end_date = this.datePipe.transform(this.vehicleForm.value.pc_end_date, 'yyyy-MM-dd');
    this.vehicleForm.value.fc_end_date = this.datePipe.transform(this.vehicleForm.value.fc_end_date, 'yyyy-MM-dd');
    if(this.branch){
      this.vehicleForm.value.branch_id=this.statusupdatebranchid
    }
    else{
      this.vehicleForm.value.branch_id=this.branch_id
    }
    if(this.dept){
      this.vehicleForm.value.department_id=this.deptid
    }
    else{
      this.vehicleForm.value.department_id=this.department
    }
    if(this.inch){
      this.vehicleForm.value.incharge=this.incharge_id
    }
    else{
      this.vehicleForm.value.incharge=this.inchargeid
    }
    if(this.vendor){
      this.vehicleForm.value.vendor_id=this.empselectedname
    }
    else{
      this.vehicleForm.value.vendor_id=this.vendor_type
    }
    if(this.emplyeeid){
      this.vehicleForm.value.employee_id=this.emp_id
    }
    else{
      this.vehicleForm.value.employee_id=this.employee
    }
    if(this.prevalue){
      this.vehicleForm.value.premise_id=this.preid
    }
    else{
      this.vehicleForm.value.premise_id=this.premise
    }
    this.vfmService.editvehiclemakers(this.vehicleid,this.vehicleForm.value)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Success....")
        this.onSubmit.emit();
        this.router.navigateByUrl('vfm/fleet_summary');
                                                
        
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  branchname(e) {
    this.branch=true
    this.statusupdatebranchid = e
    this.vfmService.getpremisedata(this.statusupdatebranchid) .subscribe(res=>{
      this.premiselist = res['data']
    }
  )
  }
  premiseval(e){
    this.prevalue=true
    this.preid=e
  }
  
  getvendor() {
    this.vfmService.getvendorname().subscribe(
      x => {
        this.branchemployee = x['data']
      }
    )

  }
  back(){
    this.router.navigateByUrl('vfm/fleet_summary');
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
  depautocompleteid(){
    setTimeout(()=>{
      if(this.deptmatassetidauto && this.autocompletetrigger && this.deptmatassetidauto.panel){
        fromEvent(this.deptmatassetidauto.panel.nativeElement,'scroll').pipe(
          map(x=> this.deptmatassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data=>{
          const scrollTop=this.deptmatassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight=this.deptmatassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight=this.deptmatassetidauto.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1<=scrollTop +elementHeight;
          console.log("CALLLLL",atBottom)
          if(atBottom){
  
            if(this.has_nextid){
              this.vfmService.getdeptpage(this.has_presentid + 1).subscribe(data=>{
                let dts=data['data'];
                console.log('h--=',data);
                console.log("SS",dts)
                console.log("GGGgst",this.deptlist)
                let pagination=data['pagination'];
                this.deptlist=this.deptlist.concat(dts);
                if(this.deptlist.length>0){
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

                // if (this.branchlist.length > 0) {
                //   this.has_nextid = pagination.has_next;
                //   this.has_presentids = pagination.has_previous;
                //   this.has_presenntids = pagination.index;

                // }
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
              this.vfmService.getUsage(this.deptid,this.inputasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
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
  premiseautocompleteid() {
    setTimeout(() => {
      if (this.premiseassetidauto && this.autocompletetrigger && this.premiseassetidauto.panel) {
        fromEvent(this.premiseassetidauto.panel.nativeElement, 'scroll').pipe(
          map(x => this.premiseassetidauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompletetrigger.panelClosingActions)
        ).subscribe(data => {
          const scrollTop = this.premiseassetidauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.premiseassetidauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.premiseassetidauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          console.log("CALLLLL", atBottom)
          if (atBottom) {

            if (this.has_nextid) {
              this.vfmService.getpremise(this.statusupdatebranchid,this.premiseasset.nativeElement.value, this.has_presentid + 1).subscribe(data => {
                let dts = data['data'];
                console.log('h--=', data);
                console.log("SS", dts)
                console.log("GGGgst", this.premiselist)
                let pagination = data['pagination'];
                this.premiselist = this.premiselist.concat(dts);

                if (this.premiselist.length > 0) {
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


  public displayWithBranch(producttype?: branchList): string | undefined {
    return producttype ? "("+producttype.code +" )"+producttype.name : undefined;
    
  } 
  public displayWithdept(producttype?: deptList): string | undefined {
    return producttype ? "("+producttype.code +" )"+producttype.name : undefined;
    
  } 
  public displayWithPremise(producttype?: premiseList): string | undefined {
    return producttype ? "("+producttype.code +" )"+producttype.name : undefined;
    
  } 
  public displayWithEmployee(producttype?: employeeList): string | undefined {
    return producttype ? producttype.full_name : undefined;
    
  } 
  public displayWithIncharge(producttype?: inchargeList): string | undefined {
    return producttype ? producttype.full_name : undefined;
    
  } 
  public displayWithVendor(producttype?: vendorList): string | undefined {
    return producttype ? producttype.name : undefined;
    
  } 
}

export interface  branchList{
  id: string;
  name: string;
  code:string;
}
export interface  deptList{
  id: string;
  name: string;
  code:string;
}
export interface  premiseList{
  id: string;
  name: string;
  code:string;
}
export interface  employeeList{
  id: string;
  full_name: string;
  code:string;
}
export interface  inchargeList{
  id: string;
  full_name: string;
  code:string;
}
export interface  vendorList{
  id: string;
  name: string;
  code:string;
}