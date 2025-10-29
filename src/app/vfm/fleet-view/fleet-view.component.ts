import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment'
import {VfmService} from "../vfm.service";
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {ShareService} from '../share.service'
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NotificationService } from '../notification.service'
import { formatDate, DatePipe } from '@angular/common';
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
  selector: 'app-fleet-view',
  templateUrl: './fleet-view.component.html',
  styleUrls: ['./fleet-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class FleetViewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>(); 
  @ViewChild('closebutton') closebutton;
  dropDownTag = "Vehicle Insurance";
  dropDownValue:any[]= [
    { id: 1,
      text: "Vehicle Insurance" },
    { id: 2,
      text: "Vehicle Fastag"},
    {
      id: 3,
      text: "Trip Details"
    },
    {
      id: 4,
      text: "Vehicle Service History"
    },
    {
      id: 5,
      text: "VFM Documents"
    },
    {
      id: 6,
      text: "Asset Details"
    },
     {
      id: 7,
      text: "Monthly Run Detail"
    }
  ]
  rejectFrom:FormGroup
  checkerFrom:FormGroup
  approveFrom:FormGroup
  btnName: any;
  issubmitbtn:boolean=true
  iseditbtn:boolean=false
  insurancelist: any;
  fleetList: any;
  isdown:boolean=false
  pagesize = 10;
  has_next = true;
  has_previous = true;
  next_runmodifyDetails=true
  previous_runmodifyDetails=true
  has_next1 = true;
  next_serviceDetails = true;
  previous_serviceDetails = true;
  previous_tripmodify = true
  next_tripmodify = true
  has_nextmodify=true
  next_servicemodifyDetails=true;
  next_fastDetails=true
  previous_runDetails=true
  next_runDetails=true
  previous_fastDetails=true
  has_previous1 = true;
  claimhas_modifynext=true
  claimhas_modifyprevious=true
  next_documentDetails = true
  next_tripDetails = true
  has_previousmodify=true
  previous_tripDetails = true
  viewscreen=false
  previous_documentDetails = true
  vehicledetailpage: number = 1;
  presentpage: number = 1;
  vehicleservicemodifypage:number=1
  claimpresentpage:number=1
  claimhas_previous=true
  claimhas_next=true
  insurancehas_next=true
  fasttagdetailpage:number=1
  claimpresentmodifypage:number=1
  vehicledocumentepage:number = 1;
  isfleetList:boolean=true
  isfastmodify:boolean=true
  isinsuranceList:boolean=true
  insurancepresentpage:number=1
  fasttagmodifypage:number=1
  vehicleservicepage:number=1
  vehicletrippage:number=1
  vehiclerunpage:number=1
  vehicletripmodifypage:number=1
  vehicledocumentemodifypage:number=1
  vehicledetailmodifypage:number=1
  vehiclerunmodifypage:number=1
  vehicleid: any;
  isfastDetails:boolean=true
  isvehicleservicemodifyDetails:boolean=true
  isclaimmodifyList:boolean=true
  isvehiclerunDetails:boolean=true
  istripmodify:boolean=true
  isvehicleList:boolean=true
  isclaimList:boolean=true
  isvehicleserviceDetails:boolean=true
  isvehiclerunmodifyDetails:boolean=true
  isdocumentDetails:boolean=true
  isdocumentmodifyDetails:boolean=true
  isvehiclemodifyList:boolean=true
  istripDetails:boolean=true
  vehicledetailList: any;
  fasttagList: any;
  vehicleserviceList: any;
  data: any
  vehicleData: any;
  vehicledocumentList: any;
  vehicletripList: any;
  maker: any;
  isPendingChecker=false
  ismodify=false
  isedit=false
  isapprove = false
  data_final: any
  owner: any;
  previous_fastmodify=true
  previous_servicemodifyDetails=true
  isvendorList=false
  isownList=false
  status: any;
  next_fastmodify=true
  next_documentmodifyDetails=true
  previous_documentmodifyDetails=true
  claimForm:FormGroup
  claimid: any;
  insurancehas_previous=true
  ismodifysum=false
  claimList: any;
  claimeditid: any;
  claimsumid: any;
  insuranceList: any;
  request_status: any;
  fasttagmodifyList: any;
  vehicletripmodifyList: any;
  vehicleservicemodifyList: any;
  vehicledocumentmodifyList: any;
  vehicledetailmodifyList: any;
  startdate: any;
  enddate: any;
  insured: any;
  claimamout: any;
  claim_amt: any;
  total: number;
  value: any;
  isfc:boolean=false
  ispc:boolean=false
  vehiclerunList: any;
  vehiclerunmodifyList: any;
  pc_applicable: string;
  fc_applicable: any;
  paramsData: any;
  claimmodifyList: any;
  cid: any;
  diablebtn: boolean;
  SpinnerService: any;
  constructor(private datePipe: DatePipe,private notification :NotificationService,private route: ActivatedRoute,private router: Router,private vfmService:VfmService,private shareservice:ShareService,private fb:FormBuilder) { }

  ngOnInit(): void {
    let data=this.shareservice.vehiclesummaryData.value;
    this.vehicleid=data['id']
    this.status=data['approval_status'].status
    this.request_status=data['request_status'].text
    this.claimForm = this.fb.group({
      claim_date: [''],
      claim_amount: [''],
      settled_amount:[''],
      claim_status:1,
      reason:[]
    })
    this.vfmService.getvehicledetail(this.vehicleid)
    .subscribe((results: any) => {
      this.vehicleData=results
      this.owner =results['ownership_type'].text
      this.pc_applicable=results['pc_applicable']
      this.fc_applicable=results['fc_applicable']
     
      if(this.owner=="Rental"){
        this.isvendorList=true
        this.isownList=false
      }
      else{
        this.isvendorList=false
        this.isownList=true
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
      this.maker=results['is_maker']
      
      console.log('this.maker==>',this.maker)
      if (this.request_status == "Modification" && this.status != "Draft" && this.status != "Approved") {
        this.viewscreen = true;
      }
      if(this.maker==true){
        this.isdown=true
        if(this.status=="Draft"){
          this.isedit=true
        }
        else{
          this.isedit=false
        }
        if(this.status=="Draft"&&this.request_status=="Modification"){
          this.ismodifysum=true
        }
        else{
          this.ismodifysum=false
        }
        if(this.status=="Approved"&&this.request_status=="Onboard"||this.status=="Approved"&&this.request_status=="Modification"){
          this.ismodify=true
        }
        else{
          this.ismodify=false
        }
       if(this.status=="Draft"){
          this.isPendingChecker=true
          this.isapprove=false
        }
        else{
          this.isPendingChecker=false
          this.isapprove=false
        }
      }
      else{
        this.isdown=false
        if(this.status=="Pending checker"){
        this.isPendingChecker=false
        this.isapprove=true
        }
        else{
          this.isPendingChecker=false
        this.isapprove=false
        }
      }
      console.log("res",results)

    })
    this.rejectFrom = this.fb.group({
      comments: ['']
    })
    this.approveFrom = this.fb.group({
      comments: ['']
    })
    this.checkerFrom = this.fb.group({
      comments: ['']
    })
    this.btnName = "Vehicle Insurance"
    this.getvehicle(this.presentpage,this.pagesize)
    this.getinsurance(this.presentpage,this.pagesize)
    this.getQueryParams()
  }
  numberOnly1(event) {
    return (event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
  }
  changes_view() {
    // modify
    this.shareservice.vehicleId.next(this.vehicleid)
    this.router.navigate(["vfm/modify"], {
      skipLocationChange: true
    })
  }
  backButton(){
    this.router.navigate(['vfm/fleet_summary'], { skipLocationChange: true })
  }
  getQueryParams() {
    this.route.queryParams.subscribe(params => {
      this.paramsData = params.status;
      if (this.paramsData == "Vehicle Insurance") {
        this.btnName = "Vehicle Insurance"
        this.dropDownTag="Vehicle Insurance"
        this.getvehicle(this.presentpage,this.pagesize)
        if(this.status=="Draft"&&this.request_status=="Modification"){
        this.getinsurance(this.insurancepresentpage,this.pagesize)
        }
      } 
      else if (this.paramsData == "Vehicle Fastag") {
        this.btnName = "Vehicle Fastag"
        this.dropDownTag = "Vehicle Fastag"
        this.getfasttag(this.fasttagdetailpage,this.pagesize)
        if(this.status=="Draft"&&this.request_status=="Modification"){
        this.getfasttagmodify(this.fasttagmodifypage,this.pagesize)
        }
      } 
      else if (this.paramsData == "Trip Details") {
        this.btnName = "Trip Details"
        this.dropDownTag = "Trip Details"
        this.gettripdetails(this.vehicletrippage,this.pagesize)
        if(this.status=="Draft"&&this.request_status=="Modification"){
          this.gettripmodify(this.vehicletripmodifypage,this.pagesize)
          }
      } 
      else if (this.paramsData == "Vehicle Service History") {
        this.btnName = "Vehicle Service History"
        this.dropDownTag = "Vehicle Service History"
        this.getvehicleservice(this.vehicleservicepage,this.pagesize)
        if(this.status=="Draft"&&this.request_status=="Modification"){
          this.getvehicleservicemodify(this.vehicleservicemodifypage,this.pagesize)
          }
      } 
      else if (this.paramsData == "VFM Documents") {
        this.btnName = "VFM Documents"
        this.dropDownTag = "VFM Documents"
        this.getdocumentservice(this.vehicledocumentepage,this.pagesize)
        if(this.status=="Draft"&&this.request_status=="Modification"){
          this.getdocumentmodifyservice(this.vehicledocumentemodifypage,this.pagesize)
          }
      }
      else if (this.paramsData == "Asset Details") {
        this.btnName = "Asset Details"
        this.dropDownTag = "Asset Details"
        this.getvehicledetail(this.vehicledetailpage,this.pagesize)
        if(this.status=="Draft"&&this.request_status=="Modification"){
        this.getvehiclemodifydetail(this.vehicledetailmodifypage,this.pagesize)
        }
      }
      else if (this.paramsData == "Monthly Run Detail") {
        this.btnName = "Monthly Run Detail"
        this.dropDownTag = "Monthly Run Detail"
        this.getrundetail(this.vehiclerunpage,this.pagesize)
        if(this.status=="Draft"&&this.request_status=="Modification"){
        this.getrunmodifydetail(this.vehiclerunmodifypage,this.pagesize)
          }
      }
    })
  }
  claimsubmit(){
   
    if (this.claimForm.value.claim_amount === ""||this.claimForm.value.claim_amount==null) {
      this.notification.showError("Please Enter Claim Amount");
      return false;
    } 
    if (this.claimForm.value.claim_status === "") {
      this.notification.showError("Please Enter Claim Status");
      return false;
    } 
    if (this.claimForm.value.claim_date === "") {
      this.notification.showError("Please Choose Claim Date");
      return false;
    } 
    if (this.claimForm.value.settled_amount === "") {
      this.notification.showError("Please Enter Settled Amount");
      return false;
    } 
    // if(this.claimamout>this.insured){
    //   this.notification.showError("Claim Amount Not Exceed Insured Amount");
    // }
    // if(this.value>this.insured){
    //   this.notification.showError("Claim Amount Not Exceed Insured Amount");
    // }
  this.claimForm.value.claim_date = this.datePipe.transform(this.claimForm.value.claim_date, 'yyyy-MM-dd');
  this.vfmService.createclaim(this.claimForm.value,this.claimid)
  .subscribe(res => {
    console.log("incires", res)
    if (res.status === "success") {
      this.closebutton.nativeElement.click();
      this.claimForm = this.fb.group({
        claim_amount:[''],
        claim_date:[''],
        settled_amount:[''],
        reason:['']
      })
      this.notification.showSuccess("Success....")
      this.onSubmit.emit(); 
      return true;
    }else {
      this.notification.showError(res.description)
      return false;
    }
  })
  }
  modify(){
    this.vfmService.modify(this.vehicleid)
  .subscribe(res => {
    console.log("incires", res)
    if (res.status === "success") {
      this.notification.showSuccess("Success....")
      this.onSubmit.emit(); 
      this.router.navigate(['vfm/fleet_summary'], { skipLocationChange: true })
      return true;
    }else {
      this.notification.showError(res.description)
      return false;
    }
  })
  }
  claimedit(){
    if (this.claimForm.value.claim_amount === ""||this.claimForm.value.claim_amount==null) {
      this.notification.showError("Please Enter Claim Amount");
      return false;
    } 
    if (this.claimForm.value.claim_status === "") {
      this.notification.showError("Please Enter Claim Status");
      return false;
    } 
    if (this.claimForm.value.claim_date === "") {
      this.notification.showError("Please Choose Claim Date");
      return false;
    } 
    if (this.claimForm.value.settled_amount === "") {
      this.notification.showError("Please Enter Settled Amount");
      return false;
    }
    // if(this.claimamout>this.insured){
    //   this.notification.showError("Claim Amount Not Exceed Insured Amount");
    // }
    // if(this.value>this.insured){
    //   this.notification.showError("Claim Amount Not Exceed Insured Amount");
    // }
  this.claimForm.value.claim_date = this.datePipe.transform(this.claimForm.value.claim_date, 'yyyy-MM-dd');
  this.vfmService.editclaim(this.claimeditid,this.claimsumid,this.claimForm.value)
  .subscribe(res => {
    console.log("incires", res)
    if (res.status === "success") {
      this.closebutton.nativeElement.click();
      this.claimForm = this.fb.group({
        claim_amount:[''],
        claim_date:[''],
        settled_amount:[''],
        reason:['']
      })
      this.notification.showSuccess("Success....")
      this.onSubmit.emit(); 
      return true;
    }else {
      this.notification.showError(res.description)
      return false;
    }
  })
  }
  claimadd(e,s,v,p){
     this.claimid=e
     this.startdate=s
     this.enddate=v
     this.insured=p
  }
  claimamt(e){
     this.claimamout=e.target.value
    //  if(this.claimamout>this.insured){
    //   this.claimForm.patchValue({
    //     claim_amount:""
    //   })
    //  }
    //  this.value=parseInt(this.claimamout) + this.total;
    //  console.log("value",this.value)
    //  if(this.value>this.insured){
    //   this.claimForm.patchValue({
    //     claim_amount:""
    //   })
    //  }
  }
  claimmodifysummary(e){
    this.claimsumid=e
    if(this.status=="Draft"&&this.request_status=="Modification"){
      this.getclaimmodify(this.claimpresentmodifypage,this.pagesize)
      }
  }
  claimsummary(e){
    this.claimsumid=e
    this.getclaim(this.claimpresentpage,this.pagesize)
   
  }
  claiminsuranceEdit(e){
    this.claimeditid=e
    
      this.vfmService.getclaimdetailslist(this.claimeditid)
      .subscribe((results: any) => {
        console.log("res",results)
        this.issubmitbtn = false;
        this.iseditbtn=true;
        let claim_date=this.datePipe.transform(results['claim_date'], 'yyyy-MM-dd')
        let claim_amount=results['claim_amount']
        let settled_amount=results['settled_amount']
        let reason=results['reason']
        this.claimForm.patchValue({
          claim_date: claim_date,
          claim_amount:claim_amount,
          settled_amount:settled_amount,
          reason:reason
         
        })
      })
  }
  getclaim(pageNumber,pageSize) {
    this.vfmService.getclaimSummary(pageNumber, this.claimsumid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.claimList = datas;
        this.total = 0;
        for(let i=0;i<datas.length;i++){
           this.claim_amt=datas[i].claim_amount
           this.total +=this.claim_amt
           console.log("total",this.total)
        }
        if (this.claimList.length >= 0) {
          this.claimhas_next = datapagination.has_next;
          this.claimhas_previous = datapagination.has_previous;
          this.claimpresentpage = datapagination.index;
          this.isfleetList = true;
        } else if (this.claimList.length == 0) {
          this.isclaimList = false;
        }
      })

  }
  claim_previousClick() {
    if (this.claimhas_previous === true) {
      this.getclaim(this.claimpresentpage + 1,this.pagesize)
    }
  }

  claim_nextClick() {
    if (this.claimhas_next === true) {
      this.getclaim(this.claimpresentpage - 1,this.pagesize)
    }
  }
  getclaimmodify(pageNumber,pageSize) {
    this.vfmService.getclaimmodifySummary(pageNumber, this.claimsumid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.claimmodifyList = datas;
        this.total = 0;
        for(let i=0;i<datas.length;i++){
           this.claim_amt=datas[i].claim_amount
           this.total +=this.claim_amt
           console.log("total",this.total)
        }
        if (this.claimmodifyList.length >= 0) {
          this.claimhas_modifynext = datapagination.has_next;
          this.claimhas_modifyprevious = datapagination.has_previous;
          this.claimpresentmodifypage = datapagination.index;
          this.isfleetList = true;
        } else if (this.claimmodifyList.length == 0) {
          this.isclaimmodifyList = false;
        }
      })

  }
  claim_previousmodifyClick() {
    if (this.claimhas_modifyprevious === true) {
      this.getclaimmodify(this.claimpresentmodifypage + 1,this.pagesize)
    }
  }

  claim_nextmodifyClick() {
    if (this.claimhas_modifynext === true) {
      this.getclaimmodify(this.claimpresentmodifypage - 1,this.pagesize)
    }
  }
  getvehicle(pageNumber,pageSize) {
    this.vfmService.getinsuranceSummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.fleetList = datas;
        if (this.fleetList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isfleetList = true;
        } else if (this.fleetList.length == 0) {
          this.isfleetList = false;
        }
      })

  }
  pre_nextClick() {
    if (this.has_next === true) {
      this.getvehicle(this.presentpage + 1,this.pagesize)
    }
  }

  pre_previousClick() {
    if (this.has_previous === true) {
      this.getvehicle(this.presentpage - 1,this.pagesize)
    }
  }
  getinsurance(pageNumber,pageSize) {
    this.vfmService.getinsurancemodifySummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.insuranceList = datas;
        if (this.insuranceList.length >= 0) {
          this.insurancehas_next = datapagination.has_next;
          this.insurancehas_previous = datapagination.has_previous;
          this.insurancepresentpage = datapagination.index;
          this.isinsuranceList = true;
        } else if (this.insuranceList.length == 0) {
          this.isinsuranceList = false;
        }
      })

  }
  insurancepre_nextClick() {
    if (this.insurancehas_next === true) {
      this.getinsurance(this.insurancepresentpage + 1,this.pagesize)
    }
  }

  insurancepre_previousClick() {
    if (this.insurancehas_previous === true) {
      this.getvehicle(this.insurancepresentpage - 1,this.pagesize)
    }
  }
  getvehicledetail(pageNumber,pageSize) {
    this.vfmService.getvehicledetailsummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.vehicledetailList = datas;
        if (this.vehicledetailList.length >= 0) {
          this.has_next1 = datapagination.has_next;
          this.has_previous1 = datapagination.has_previous;
          this.vehicledetailpage = datapagination.index;
          this.isvehicleList = true;
        } else if (this.vehicledetailList.length == 0) {
          this.isvehicleList = false;
        }
      })

  }
  vehiclepreviousClick() {
    if (this.has_next1 === true) {
      this.getvehicledetail(this.vehicledetailpage + 1,this.pagesize)
    }
  }

  vehiclenextClick() {
    if (this.has_previous1 === true) {
      this.getvehicledetail(this.vehicledetailpage - 1,this.pagesize)
    }
  }
  getvehiclemodifydetail(pageNumber,pageSize) {
    this.vfmService.getvehicledetailmodifysummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.vehicledetailmodifyList = datas;
        if (this.vehicledetailmodifyList.length >= 0) {
          this.has_nextmodify = datapagination.has_next;
          this.has_previousmodify = datapagination.has_previous;
          this.vehicledetailmodifypage = datapagination.index;
          this.isvehiclemodifyList = true;
        } else if (this.vehicledetailmodifyList.length == 0) {
          this.isvehiclemodifyList = false;
        }
      })

  }
  vehiclepreviousmodifyClick() {
    if (this.has_next1 === true) {
      this.getvehicledetail(this.vehicledetailmodifypage + 1,this.pagesize)
    }
  }

  vehiclenextmodifyClick() {
    if (this.has_previous1 === true) {
      this.getvehicledetail(this.vehicledetailmodifypage - 1,this.pagesize)
    }
  }
  getfasttag(pageNumber,pageSize) {
    this.vfmService.getfasttagdetailsummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.fasttagList = datas;
        if (this.fasttagList.length >= 0) {
          this.next_fastDetails = datapagination.has_next;
          this.previous_fastDetails = datapagination.has_previous;
          this.fasttagdetailpage = datapagination.index;
          this.isfastDetails = true;
        } else if (this.fasttagList.length == 0) {
          this.isfastDetails = false;
        }
      })

  }
  previosfastDetails() {
    if (this.next_fastDetails === true) {
      this.getvehicledetail(this.fasttagdetailpage + 1,this.pagesize)
    }
  }

  nextfastDetails() {
    if (this.previous_fastDetails === true) {
      this.getvehicledetail(this.fasttagdetailpage - 1,this.pagesize)
    }
  }
  getfasttagmodify(pageNumber,pageSize) {
    this.vfmService.getfasttagmodifysummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.fasttagmodifyList = datas;
        if (this.fasttagmodifyList.length >= 0) {
          this.next_fastmodify = datapagination.has_next;
          this.previous_fastmodify = datapagination.has_previous;
          this.fasttagmodifypage = datapagination.index;
          this.isfastmodify = true;
        } else if (this.fasttagmodifyList.length == 0) {
          this.isfastmodify = false;
        }
      })

  }
  previosfastmodify() {
    if (this.previous_fastmodify === true) {
      this.getvehicledetail(this.fasttagmodifypage + 1,this.pagesize)
    }
  }

  nextfastmodify() {
    if (this.next_fastmodify === true) {
      this.getvehicledetail(this.fasttagmodifypage - 1,this.pagesize)
    }
  }
  getvehicleservice(pageNumber,pageSize) {
    this.vfmService.getservicedetailsummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.vehicleserviceList = datas;
        if (this.vehicleserviceList.length >= 0) {
          this.next_serviceDetails = datapagination.has_next;
          this.previous_serviceDetails = datapagination.has_previous;
          this.vehicleservicepage = datapagination.index;
          this.isvehicleserviceDetails = true;
        } else if (this.vehicleserviceList.length == 0) {
          this.isvehicleserviceDetails = false;
        }
      })

  }
  previousserviceDetails() {
    if (this.next_serviceDetails === true) {
      this.getvehicledetail(this.vehicleservicepage + 1,this.pagesize)
    }
  }

  nextserviceDetails() {
    if (this.previous_serviceDetails === true) {
      this.getvehicledetail(this.vehicleservicepage - 1,this.pagesize)
    }
  }
  getvehicleservicemodify(pageNumber,pageSize) {
    this.vfmService.getservicedetailmodifysummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.vehicleservicemodifyList = datas;
        if (this.vehicleservicemodifyList.length >= 0) {
          this.next_servicemodifyDetails = datapagination.has_next;
          this.previous_servicemodifyDetails = datapagination.has_previous;
          this.vehicleservicemodifypage = datapagination.index;
          this.isvehicleservicemodifyDetails = true;
        } else if (this.vehicleservicemodifyList.length == 0) {
          this.isvehicleservicemodifyDetails = false;
        }
      })

  }
  previousservicemodifyDetails() {
    if (this.next_servicemodifyDetails === true) {
      this.getvehicledetail(this.vehicleservicemodifypage + 1,this.pagesize)
    }
  }

  nextservicemodifyDetails() {
    if (this.previous_servicemodifyDetails === true) {
      this.getvehicledetail(this.vehicleservicemodifypage - 1,this.pagesize)
    }
  }
  getdocumentservice(pageNumber,pageSize) {
    this.vfmService.getdocumentdetailsummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.vehicledocumentList = datas;
        if (this.vehicledocumentList.length >= 0) {
          this.next_documentDetails = datapagination?.has_next;
          this.previous_documentDetails = datapagination?.has_previous;
          this.vehicledocumentepage = datapagination?.index;
          this.isdocumentDetails = true;
        } else if (this.vehicledocumentList.length == 0) {
          this.isdocumentDetails = false;
        }
      })

  }
  previousdocumentDetails() {
    if (this.previous_documentDetails === true) {
      this.getdocumentservice(this.vehicledocumentepage + 1,this.pagesize)
    }
  }

  nextdocumentDetails() {
    if (this.next_documentDetails === true) {
      this.getvehicledetail(this.vehicledocumentepage - 1,this.pagesize)
    }
  }
  getdocumentmodifyservice(pageNumber,pageSize) {
    this.vfmService.getdocumentmodifydetailsummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.vehicledocumentmodifyList = datas;
        if (this.vehicledocumentmodifyList.length >= 0) {
          this.next_documentmodifyDetails = datapagination.has_next;
          this.previous_documentmodifyDetails = datapagination.has_previous;
          this.vehicledocumentemodifypage = datapagination.index;
          this.isdocumentmodifyDetails = true;
        } else if (this.vehicledocumentmodifyList.length == 0) {
          this.isdocumentDetails = false;
        }
      })

  }
  previousdocumentmodifyDetails() {
    if (this.previous_documentmodifyDetails === true) {
      this.getdocumentservice(this.vehicledocumentemodifypage + 1,this.pagesize)
    }
  }

  nextdocumentmodifyDetails() {
    if (this.next_documentmodifyDetails === true) {
      this.getvehicledetail(this.vehicledocumentemodifypage - 1,this.pagesize)
    }
  }
  gettripdetails(pageNumber,pageSize) {
    this.vfmService.gettripdetailsummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.vehicletripList = datas;
        if (this.vehicletripList.length >= 0) {
          this.next_tripDetails = datapagination.has_next;
          this.previous_tripDetails = datapagination.has_previous;
          this.vehicletrippage = datapagination.index;
          this.istripDetails = true;
        } else if (this.vehicletripList.length == 0) {
          this.istripDetails = false;
        }
      })

  }
  previousTripDetails() {
    if (this.previous_tripDetails === true) {
      this.gettripdetails(this.vehicletrippage + 1,this.pagesize)
    }
  }

  nextTripDetails() {
    if (this.next_tripDetails === true) {
      this.gettripdetails(this.vehicletrippage - 1,this.pagesize)
    }
  }
  getrundetail(pageNumber,pageSize) {
    this.vfmService.getrundetailsummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.vehiclerunList = datas;
        if (this.vehiclerunList.length >= 0) {
          this.next_runDetails = datapagination.has_next;
          this.previous_runDetails = datapagination.has_previous;
          this.vehiclerunpage = datapagination.index;
          this.isvehiclerunDetails = true;
        } else if (this.vehiclerunList.length == 0) {
          this.isvehiclerunDetails = false;
        }
      })

  }
  previousrunDetails() {
    if (this.previous_runDetails === true) {
      this.getrundetail(this.vehiclerunpage + 1,this.pagesize)
    }
  }

  nextrunDetails() {
    if (this.next_runDetails === true) {
      this.getrundetail(this.vehiclerunpage - 1,this.pagesize)
    }
  }
  getrunmodifydetail(pageNumber,pageSize) {
    this.vfmService.getrunmodifydetailsummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.vehiclerunmodifyList = datas;
        if (this.vehiclerunmodifyList.length >= 0) {
          this.next_runmodifyDetails = datapagination.has_next;
          this.previous_runmodifyDetails = datapagination.has_previous;
          this.vehiclerunmodifypage = datapagination.index;
          this.isvehiclerunmodifyDetails = true;
        } else if (this.vehiclerunmodifyList.length == 0) {
          this.isvehiclerunDetails = false;
        }
      })

  }
  previousrunmodifyDetails() {
    if (this.previous_runDetails === true) {
      this.getrunmodifydetail(this.vehiclerunmodifypage + 1,this.pagesize)
    }
  }

  nextrunmodifyDetails() {
    if (this.next_runDetails === true) {
      this.getrunmodifydetail(this.vehiclerunmodifypage - 1,this.pagesize)
    }
  }
  gettripmodify(pageNumber,pageSize) {
    this.vfmService.gettripmodifysummary(pageNumber, this.vehicleid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.vehicletripmodifyList = datas;
        if (this.vehicletripmodifyList.length >= 0) {
          this.next_tripmodify = datapagination.has_next;
          this.previous_tripmodify = datapagination.has_previous;
          this.vehicletripmodifypage = datapagination.index;
          this.istripmodify = true;
        } else if (this.vehicletripmodifyList.length == 0) {
          this.istripmodify = false;
        }
      })

  }
  previousTripmodify() {
    if (this.previous_tripmodify === true) {
      this.gettripdetails(this.vehicletripmodifypage + 1,this.pagesize)
    }
  }

  nextTripmodify() {
    if (this.next_tripmodify === true) {
      this.gettripdetails(this.vehicletripmodifypage - 1,this.pagesize)
    }
  }
  onDropDownChange(data) {
    let ddValue = data.value;
    if (ddValue == "Vehicle Insurance") {
      this.btnName = "Vehicle Insurance"
      this.getvehicle(this.presentpage,this.pagesize)
      if(this.status=="Draft"&&this.request_status=="Modification"){
      this.getinsurance(this.insurancepresentpage,this.pagesize)
      }
    } 
    else if (ddValue == "Vehicle Fastag") {
      this.btnName = "Vehicle Fastag"
      this.getfasttag(this.fasttagdetailpage,this.pagesize)
      if(this.status=="Draft"&&this.request_status=="Modification"){
      this.getfasttagmodify(this.fasttagmodifypage,this.pagesize)
      }
    } 
    else if (ddValue == "Trip Details") {
      this.btnName = "Trip Details"
      this.gettripdetails(this.vehicletrippage,this.pagesize)
      if(this.status=="Draft"&&this.request_status=="Modification"){
        this.gettripmodify(this.vehicletripmodifypage,this.pagesize)
        }
    } 
    else if (ddValue == "Vehicle Service History") {
      this.btnName = "Vehicle Service History"
      this.getvehicleservice(this.vehicleservicepage,this.pagesize)
      if(this.status=="Draft"&&this.request_status=="Modification"){
        this.getvehicleservicemodify(this.vehicleservicemodifypage,this.pagesize)
        }
    } 
    else if (ddValue == "VFM Documents") {
      this.btnName = "VFM Documents"
      this.getdocumentservice(this.vehicledocumentepage,this.pagesize)
      if(this.status=="Draft"&&this.request_status=="Modification"){
        this.getdocumentmodifyservice(this.vehicledocumentemodifypage,this.pagesize)
        }
    }
    else if (ddValue == "Asset Details") {
      this.btnName = "Asset Details"
      this.getvehicledetail(this.vehicledetailpage,this.pagesize)
      if(this.status=="Draft"&&this.request_status=="Modification"){
      this.getvehiclemodifydetail(this.vehicledetailmodifypage,this.pagesize)
      }
    }
    else if (ddValue == "Monthly Run Detail") {
      this.btnName = "Monthly Run Detail"
      this.getrundetail(this.vehiclerunpage,this.pagesize)
      if(this.status=="Draft"&&this.request_status=="Modification"){
      this.getrunmodifydetail(this.vehiclerunmodifypage,this.pagesize)
        }
    }
  }
  vehicledetailEdit(data){
    this.shareservice.vehicledetailData.next(data)
    this.router.navigateByUrl('vfm/vehicle_detail');
  }
  fasttagEdit(data){
    this.shareservice.vehicledetailData.next(data)
    this.router.navigateByUrl('vfm/fast_tag');
  }
  insuranceEdit(data){
    this.shareservice.vehicledetailData.next(data)
    this.router.navigateByUrl('vfm/insurance');
    //5018
    // this.getvehicle(1,10);
    //       this.getinsurance(1,10);

  }
  vehicleServiceEdit(data){
    this.shareservice.vehicledetailData.next(data)
    this.router.navigateByUrl('vfm/service_detail');
  }
  vehicleRunEdit(data){
    this.shareservice.vehicledetailData.next(data)
    this.router.navigateByUrl('vfm/monthly_detail');
  }
  vehicleDocumentEdit(data,name){
    this.vfmService.documentdownload(data)
  .subscribe((results) => {
    let binaryData = [];
    binaryData.push(results)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    link.download = name
    link.click();
    })
    
  }
  fileDeleted(data){
    this.vfmService.fileDelete(data,this.vehicleid)
    .subscribe(res => {
      console.log("incires", res)
      if (res.status === "success") {
        this.notification.showSuccess("Deleted Successfully....")
        this.onSubmit.emit();
        this.getdocumentservice(this.vehicledocumentepage,this.pagesize)
        return true;
      }else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  vehicleTripEdit(data){
    this.shareservice.vehicledetailData.next(data)
    this.router.navigateByUrl('vfm/trip_detail');
  }
  addForm(data) {
    if (data == "Vehicle Insurance") {
    this.data = {id:0}
    this.shareservice.vehicledetailData.next(this.data['id'])
    this.router.navigate(['vfm/insurance'], { skipLocationChange: isSkipLocationChange })

    } else if (data == "Vehicle Fastag") {
      this.data = {id:0}
      this.shareservice.vehicledetailData.next(this.data['id'])
    this.router.navigate(['vfm/fast_tag'], { skipLocationChange: isSkipLocationChange })
      
    } else if (data == "Trip Details") {
      this.data = {id:0}
      this.shareservice.vehicledetailData.next(this.data['id'])
    this.router.navigate(['vfm/trip_detail'], { skipLocationChange: isSkipLocationChange })
     
    } else if (data == "Vehicle Service History") {
      this.data = {id:0}
      this.shareservice.vehicledetailData.next(this.data['id'])
    this.router.navigate(['vfm/service_detail'], { skipLocationChange: isSkipLocationChange })
     
    } else if (data == "VFM Documents") {
      this.data = {id:0}
      this.shareservice.vehicledetailData.next(this.data['id'])
    this.router.navigate(['vfm/document'], { skipLocationChange: isSkipLocationChange })
      
    } 
    else if (data == "Asset Details") {
      this.data = {id:0}
      this.shareservice.vehicledetailData.next(this.data['id'])
      this.router.navigate(['vfm/vehicle_detail'], { skipLocationChange: isSkipLocationChange })
        
      }
      else if (data == "Monthly Run Detail") {
        this.data = {id:0}
        this.shareservice.vehicledetailData.next(this.data['id'])
        this.router.navigate(['vfm/monthly_detail'], { skipLocationChange: isSkipLocationChange })
          
        }
  }
  rejectRemarks(){
    this.data_final={   
      "status":0,
      "remarks":this.rejectFrom.value.comments,
      }
      this.service(this.data_final)
    }
    approveRemarks(){
      this.data_final={   
        "status":3,
        "remarks":this.approveFrom.value.comments,
        }
        this.service(this.data_final)
    }
    checkerRemarks(){
      this.data_final={   
        "status":2,
        "remarks":this.checkerFrom.value.comments,
        }
        this.service(this.data_final)
    }
    service(data){
      this.vfmService.rejectvehiclemaker(data,this.vehicleid)
      .subscribe(res=>{
        if (res.status === "success") {
          if(data.status==2){
          this.notification.showSuccess("Submitted To Approver Successfully....")
          this.router.navigate(['vfm/fleet_summary'], { skipLocationChange: true })

         
         

          }
          if(data.status==3){
            this.notification.showSuccess("Approved Successfully....")
            this.router.navigate(['vfm/fleet_summary'], { skipLocationChange: true })

          
  


            } 
            if(data.status==0){
              this.notification.showSuccess("Rejected Successfully....")
              this.router.navigate(['vfm/fleet_summary'], { skipLocationChange: true })

            
            
              

              }   
             
        }else {
          if(res.description=="INVALID COMMENT"){
            this.notification.showError("FILL THE REMARK")
            }
            else{
            this.notification.showError(res.description)
            }
        }
      })
    }



    claim_data = [];
    modificationdata:any;
    claimChangesViewSummary() {
      this.claim_data = [];
      this.vfmService.getmodification(this.vehicleid)
        .subscribe(result => {
          this.modificationdata = result['data']
          this.modificationdata.forEach(element => {
            if (element.action == 2)//edit
            {
              if (element.type_name == 8) {
                this.claim_data.push(element)
              }
            }
            if (element.action == 1)//create
            {
              if (element.type_name == 8) {
                this.claim_data.push({ "new_data": element.data, "action": element.action, "type_name": element.type_name })
              }
            }
          });
        })
  
  
    }

    // BUGID:5018 for VEHICLE INU=SURANCE DLT
    vinsurancedlt(id,index){
      // this.fleetList.splice(index,1)
      this.vfmService.vinsurancedlt(id)
      .subscribe(result => {
        if (result.message == "Successfully Deleted") {
          this.notification.showSuccess("Deleted")
          this.diablebtn=true;
          this.getvehicle(1,10);
          this.getinsurance(1,10);
                }
        else {
          this.notification.showInfo("Try  Again....")
          // this.ngOnInit();
        }
        
      })
  }
  vinsurancedltcreate(id,index){
    this.vfmService.vinsurancedlt(id)
    .subscribe(result => {
      if (result.message == "Successfully Deleted") {
        this.notification.showSuccess("Deleted")
        this.diablebtn=true;
        this.getvehicle(1,10);
        this.getinsurance(1,10);
              }
      else {
        this.notification.showInfo("Try  Again....")
        // this.ngOnInit();
      }
      
    })
  }

  //5018 FASTTAG DELETE
  fasttagedlt(id,index){
    // this.fleetList.splice(index,1)
    this.vfmService.fasttagedlt(id)
    .subscribe(result => {       
      if (result.message == "Successfully Deleted") {
        this.notification.showSuccess("Deleted")
        this.getfasttagmodify(1,10);
        this.getfasttag(1,10)
              }
      else {
        this.notification.showInfo("Try  Again....")
        // this.ngOnInit();
      }
      
    })
}
fasttagedltcreate(id,index){
  this.vfmService.fasttagedlt(id)
  .subscribe(result => {       
    if (result.message == "Successfully Deleted") {
      this.notification.showSuccess("Deleted")
      this.getfasttag(1,10)
      this.getfasttagmodify(1,10);
            }
    else {
      this.notification.showInfo("Try  Again....")
      // this.ngOnInit();
    }
    
  })
}

 //5018 TRIP DETAILS DELETE
 tripdtlltcreate(id,index){
  // this.fleetList.splice(index,1)
  this.vfmService.tripdtllt(id)
  .subscribe(result => {       
    if (result.message == "Successfully Deleted") {
      this.notification.showSuccess("Deleted")
      this.gettripdetails(1,10)
      this.gettripmodify(1,10)
            }
    else {
      this.notification.showInfo("Try  Again....")
      // this.ngOnInit();
    }
    
  })
}
tripdtllt(id,index){
  // this.fleetList.splice(index,1)
  this.vfmService.tripdtllt(id)
  .subscribe(result => {       
    if (result.message == "Successfully Deleted") {
      this.notification.showSuccess("Deleted")
      this.gettripmodify(1,10)
      this.gettripdetails(1,10)
            }
    else {
      this.notification.showInfo("Try  Again....")
      // this.ngOnInit();
    }
    
  })
}

//5018 TRIP DETAILS DELETE
ServiceHisdltcreate(id,index){
  // this.fleetList.splice(index,1)
  this.vfmService.ServiceHisdlt(id)
  .subscribe(result => {       
    if (result.message == "Successfully Deleted") {
      this.notification.showSuccess("Deleted")
      this.getvehicleservice(1,10)
      this.getvehicleservicemodify(1,10)
            }
    else {
      this.notification.showInfo("Try  Again....")
      // this.ngOnInit();
    }
    
  })
}
ServiceHisdlt(id,index){
  // this.fleetList.splice(index,1)
  this.vfmService.ServiceHisdlt(id)
  .subscribe(result => {       
    if (result.message == "Successfully Deleted") {
      this.notification.showSuccess("Deleted")
      this.getvehicleservicemodify(1,10)
      this.getvehicleservice(1,10)
            }
    else {
      this.notification.showInfo("Try  Again....")
      // this.ngOnInit();
    }
    
  })
}

assetdtldltcreate(id,index){
  this.vfmService.assetdtldlt(id).subscribe(
    result  => {
      if(result.message == "Successfully Deleted"){
        this.notification.showSuccess("Deleted")
        this.getvehicledetail(1,10)
        this.getvehiclemodifydetail(1,10)
      }
      else{
        this.notification.showInfo("Try Again....")
      }
    }
  )
}

assetdtldlt(id,index){
  // this.SpinnerService.show();
  this.vfmService.assetdtldlt(id).subscribe(
    result  => {
      if(result.message == "Successfully Deleted"){
        this.notification.showSuccess("Deleted")
        this.getvehiclemodifydetail(1,10)
        this.getvehicledetail(1,10)
      }
      else{
        this.notification.showInfo("Try Again....")
      }
    }
  )
}

monthlyrundltcreate(id,index){
  this.vfmService.monthlyrundlt(id).subscribe(
    result  => {
      if(result.message == "Successfully Deleted"){
        this.notification.showSuccess("Deleted")
        this.getrundetail(1,10)
        this.getrunmodifydetail(1,10)
      }
      else{
        this.notification.showInfo("Try Again....")
      }
    }
  )
}
monthlyrundlt(id,index){
  this.vfmService.monthlyrundlt(id).subscribe(
    result  => {
      if(result.message == "Successfully Deleted"){
        this.notification.showSuccess("Deleted")
        this.getrunmodifydetail(1,10)
        this.getrundetail(1,10)
      }
      else{
        this.notification.showInfo("Try Again....")
      }
    }
  )
}

  // directorNameDelete(index: number) {
  //   this.directorNameList.splice(index, 1);
  //   console.log("delete",this.directorNameList)
  //   let count = this.vendorEditForm.value.director_count
  //   this.array = this.directorNameList.length
  //   this.list = this.array.toString();
  //   if (count === this.list){
  //       this.addButton = true;
  //   } else {
  //     this.addButton =false;
  //   }
  // }
}
