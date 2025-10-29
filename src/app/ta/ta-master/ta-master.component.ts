import { Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren,ViewChild,ViewContainerRef} from '@angular/core';
import {ShareService} from '../share.service';
import { SharedService } from 'src/app/service/shared.service';
import {AssignApproverComponent}from'../assign-approver/assign-approver.component';
import { HolidaydiemSummaryComponent } from '../holidaydiem-summary/holidaydiem-summary.component';
import { GradeeligibilityMasterComponent } from '../gradeeligibility-master/gradeeligibility-master.component'
import { CommondropdownMasterComponent } from '../commondropdown-master/commondropdown-master.component'
import { DateRelaxationMasterComponent } from '../date-relaxation-master/date-relaxation-master.component'
import { OnbehalfSummaryComponent } from '../onbehalf-summary/onbehalf-summary.component';
import { OnbehalfMasterComponent } from '../onbehalf-master/onbehalf-master.component';
import { ClaimAllowanceMasterComponent } from '../claim-allowance-master/claim-allowance-master.component';
import { HolidayMasterComponent } from '../holiday-master/holiday-master.component';
import { TravelreasonexpenseComponent } from '../travelreasonexpense/travelreasonexpense.component';
import { TaEmployeemappingComponent } from '../ta-employeemapping/ta-employeemapping.component';        
@Component({
  selector: 'app-ta-master',
  templateUrl: './ta-master.component.html',
  styleUrls: ['./ta-master.component.scss']
})
export class TaMasterComponent implements OnInit {

  isassignaprover:boolean
  isholidaydeim:boolean
  isgradeeligible:boolean
  iscommondropdown:boolean
  isdaterelaxation:boolean
  isonbehalf:boolean
  isclaimallowance:boolean
  isholidaymaster : boolean
  istravelreasonexpense : boolean
  isemployeemapping : boolean
  istarawdata : boolean
  subModuleList: [];

  // vendorMasterList = [];
  // vendorMasterList = [
    //  {name: "Holiday Diem",index:2,component:HolidaydiemSummaryComponent},
    //  {name: "Grade Eligibility",index:3,component:GradeeligibilityMasterComponent},
    //  {name: "Common Dropdown",index:4,component:CommondropdownMasterComponent},
    //  {name: "Date Relaxation",index:5,component:DateRelaxationMasterComponent},
    //  {name: "Onbehalf Of",index:6,component:OnbehalfMasterComponent},
    //  {name: 'Claim Allowance',index:7,component:ClaimAllowanceMasterComponent},
    //  {name:'Holiday Master', index: 12, component: HolidayMasterComponent },
    //  {name:'Tour Reason/Expense', index : 13, component : TravelreasonexpenseComponent},
    //  {name:'Employee Mapping',index:14,component:TaEmployeemappingComponent},
     
     
  // ];

  activeItem: string;
  activeComponent: any;
  tabs=[];  
  
  constructor(private componentFactoryResolver: ComponentFactoryResolver,public sharedService:ShareService,public SharedService:SharedService,private apcser:SharedService)
  {
  }
  listicons:any={};
  // constructor(private router: Router,private apcser:SharedService,private toastr:ToastrService) { }
  menugrid:any;
  admin:boolean=false;
  masterlist:any;
  ngOnInit(): void {
   
    this.masterlist=this.SharedService.masterList
    let mytamodule=this.SharedService.MyModuleName
    for (let i=0;i<this.masterlist.length;i++){
      if (mytamodule==this.masterlist[i].name){
         let datalist=this.masterlist[i].submodule
        //  this.subModuleList = datalist;
         for (let i=0;i<datalist.length;i++){
            let data=datalist[i]
            let role=data.role
          for (let i=0;i<role.length;i++){
            let rolename=role[i].name
            if (rolename === 'Maker'){
                
              this.subModuleList=datalist;
              this.subModuleData(data)
         }
          

      }
    }
  }
    }
    
    // this.SharedService.masterList
  } ///endof ngOnInit
  name:any
  onbehalfofpermission:any
  daterelaxation:any;
  employeemapping:any;
  commondropdown:any;
  Holiday_Diem:any;
  grade_eligiblity:any;
  claim_allowance:any;
  travelreasonexpense:any;
  Holiday_master:any;
  tarawdata:any;
  subModuleData(data) {
  this.name = data.name;
  let role=data.role
  this.onbehalfofpermission = "Onbehalf Employee";
  this.daterelaxation = "Date Relaxation";
  this.employeemapping = "Employee Mapping";
  this.commondropdown="Common Dropdown";
  this.Holiday_Diem="Holiday Diem";
this.grade_eligiblity="Grade Eligibility";
  this.claim_allowance="Claim Allowance";
  this.travelreasonexpense="Tour Reason/Expense";
  this.Holiday_master="Holiday Master";
  this.tarawdata="TA Raw Data"; 
    
  this.isonbehalf = this.onbehalfofpermission === this.name ? true : false;
  this.isdaterelaxation = this.daterelaxation === this.name ? true : false;
  this.isemployeemapping= this.employeemapping === this.name ? true : false;
  this.iscommondropdown= this.commondropdown === this.name ? true : false;
  this.isholidaydeim= this.Holiday_Diem === this.name ? true : false;
  this.isgradeeligible= this.grade_eligiblity === this.name ? true : false;
  this.isclaimallowance= this.claim_allowance === this.name ? true : false;
  this.istravelreasonexpense=this.travelreasonexpense === this.name ? true : false;
  this.isholidaymaster=this.Holiday_master === this.name ? true : false;
  this.istarawdata=this.tarawdata ===this.name ? true : false;
  //   if(data.index=== 1){
  //     this.isassignaprover=true
  //     this.isholidaydeim=false 
  //     this.isgradeeligible=false
  //     this.iscommondropdown=false
  //     this.isdaterelaxation=false
  //     this.isonbehalf=false
  //     this.isclaimallowance=false
  //     this.isholidaymaster = false
  //     this.istravelreasonexpense = false
  //     this.isemployeemapping = false
  //   }
    if(this.isholidaydeim){
      this.isassignaprover=false
      this.isholidaydeim=true 
      this.isgradeeligible=false
      this.iscommondropdown=false
      this.isdaterelaxation=false
      this.isonbehalf=false
      this.isclaimallowance=false
      this.isholidaymaster = false
      this.istravelreasonexpense = false
      this.isemployeemapping = false
    }
    if(this.isgradeeligible){
      this.isassignaprover=false
      this.isholidaydeim=false
      this.isgradeeligible=true
      this.iscommondropdown=false
      this.isdaterelaxation=false
      this.isonbehalf=false
      this.isclaimallowance=false
      this.isholidaymaster = false
      this.istravelreasonexpense = false
      this.isemployeemapping = false
    }
    if(this.iscommondropdown){
      this.isassignaprover=false
      this.isholidaydeim=false
      this.isgradeeligible=false
      this.iscommondropdown=true
      this.isonbehalf=false
      this.isdaterelaxation=false
      this.isclaimallowance=false
      this.isholidaymaster = false
      this.istravelreasonexpense = false
      this.isemployeemapping = false
    }
    if(this.isdaterelaxation){
      this.isassignaprover=false
      this.isholidaydeim=false
      this.isgradeeligible=false
      this.iscommondropdown=false
      this.isdaterelaxation=true
      this.isonbehalf=false
      this.isclaimallowance=false
      this.isholidaymaster = false
      this.istravelreasonexpense = false
      this.isemployeemapping = false
    }
   
  //  if(data.index == 9){
  //     this.isassignaprover=true

  //   }
  
   if(this.isonbehalf ){
    this.isonbehalf=true
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=false
    this.isholidaymaster = false
    this.istravelreasonexpense = false
    this.isemployeemapping = false
   }
   if(data.index == 7){
    this.isonbehalf=false
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=true
    this.isholidaymaster = false
    this.istravelreasonexpense = false
    this.isemployeemapping = false
   }
   if(this.isholidaymaster){
    this.isonbehalf=false
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=false
    this.isholidaymaster = true
    this.istravelreasonexpense = false
    this.isemployeemapping = false
   }
   if(this.istravelreasonexpense){
    this.isonbehalf=false
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=false
    this.isholidaymaster = false
    this.isemployeemapping = false
    this.istravelreasonexpense = true
   }
   if(this.isemployeemapping){
    this.isonbehalf=false
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=false
    this.isholidaymaster = false
    this.istravelreasonexpense = false
    this.isemployeemapping = true

   }
   if(this.isholidaymaster){
    this.isonbehalf=false
    this.isassignaprover=false
    this.isholidaydeim=false
    this.isgradeeligible=false
    this.iscommondropdown=false
    this.isdaterelaxation=false
    this.isclaimallowance=false
    this.istravelreasonexpense = false
    this.isholidaymaster = true
    this.isemployeemapping = false
      }
    
      if(this.istarawdata){
        this.isonbehalf=false
        this.isassignaprover=false
        this.isholidaydeim=false
        this.isgradeeligible=false
        this.iscommondropdown=false
        this.isdaterelaxation=false
        this.isclaimallowance=false
        this.isholidaymaster = false
        this.istravelreasonexpense = false
        this.istarawdata = true
        this.isemployeemapping = false
          }
   
  }

}