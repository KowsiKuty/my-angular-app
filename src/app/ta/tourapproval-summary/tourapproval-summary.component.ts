import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import {isBoolean} from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NotificationService } from '../notification.service'
import {TaService} from "../ta.service";
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {ShareService} from "../share.service"
import {ActivatedRoute, Router} from "@angular/router";
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
  selector: 'app-tourapproval-summary',
  templateUrl: './tourapproval-summary.component.html',
  styleUrls: ['./tourapproval-summary.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    DatePipe
]
})
export class TourapprovalSummaryComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();  
   
  
  currentDate: any = new Date();
  // date = new Date().toLocaleDateString();
  defaultDate = new FormControl(new Date());
  today = new Date();
  date=new Date();
  has_next=true;
  has_previous=true;
  gettourapproveList:any
  memoSearchForm : FormGroup;
  tourapprovesummarypage:number=1;
  pagesize=10;
  currentpage: number = 1;
  presentpage: number = 1;
  istourappSummaryPagination:boolean;
  data:any;
  toursearch:any;
  latest:any;
  statusList: any;
  status: any;
  tourApprovalSearchForm : FormGroup;
  isTourChecker:boolean=true
  statusId: number = 2
  statusselected: any='PENDING';

  constructor(private  taService:TaService,private spinnerservice:NgxSpinnerService,private sharedService:SharedService,private datePipe: DatePipe,private route: ActivatedRoute,
    private router: Router,private shareservice:ShareService,private fb:FormBuilder,) { }
  
  ngOnInit(): void {
    const heroId = this.route.snapshot.paramMap.get('id');
    
    this.tourApprovalSearchForm = this.fb.group({
      tourno:[''],
      requestdate:[''],
      
    })
    this.getapprovesumm(this.send_value,this.currentpage);
    this.getstatusvalue();
  }
  getstatus(value){
  this.status = value
  console.log("this.status",this.status)
  }
 
  getstatusvalue(){
    this.taService.getstatus()
    .subscribe(res=>{
      this.statusList=res
      console.log("statusList",this.statusList)
    })
  }

  tourview(data){
    this.data = {
      requestno:data['requestno'],
      id:data['tourid'],
      status:data['status'],
      approverid:data['id'],
      approvedby_id:data['approver_id'],
      applevel:data['applevel'],
      employee_name:data['employee_name'],
      employee_code:data['employee_code'],
      empgrade:data['empgrade'],
      empdesignation:data['empdesignation'],
      empgid:data['empgid']
    }
    var datas = JSON.stringify(Object.assign({}, this.data));
      localStorage.setItem('tourmakersummary',datas)
    // this.sharedService.summaryData.next(this.data)
   
    this.router.navigateByUrl('ta/tourmaker');
  }
  searchClick(){
    
  }
  clearclick(){
    this.toursearch.requestno ='',
    this.toursearch.requestdate='' 
    this.toursearch.status='' 

  }


  
// tour maker summary

getapprovesumm(val,
  pageNumber) {
    this.spinnerservice.show()
  this.taService.getTourApprovalSummary(this.statusId,pageNumber,val)
    .subscribe((results: any[]) => {
      this.spinnerservice.hide()
      let datas = results["data"];
      this.gettourapproveList = datas;
      let datapagination = results["pagination"];
      this.gettourapproveList = datas;
      if (this.gettourapproveList.length === 0) {
        this.isTourChecker = false
      }
      if (this.gettourapproveList.length > 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
        this.isTourChecker = true
      }
    })

}

TourapprovenextClick() {
  if (this.has_next === true) {
    this.getapprovesumm(this.send_value,this.currentpage + 1)
  }
}

TourapprovepreviousClick() {
  if (this.has_previous === true) {
    this.getapprovesumm(this.send_value,this.currentpage - 1)
  }


}




  send_value:String=""
  tourApproverSearch(){
    let form_value = this.tourApprovalSearchForm.value;

    if(form_value.tourno != "")
    {
      this.send_value=this.send_value+"&tour_no="+form_value.tourno
    }
    if(form_value.requestdate != "")
    {
      let date=this.datePipe.transform(form_value.requestdate,"dd-MMM-yyyy");
      this.send_value=this.send_value+"&request_date="+date
    }

    this.getapprovesumm(this.send_value,1)

  }


  reset(){
    this.send_value=""
    this.tourApprovalSearchForm = this.fb.group({ 
      tourno:[''],
      requestdate:[''],
      
    })
    this.getapprovesumm(this.send_value,this.currentpage)
  }


  onStatusChange(e) {
    let status_name:any  = e
    if(status_name=="APPROVED"){
      this.statusId= 3
    }
    if(status_name=="PENDING"){
      this.statusId= 2
    }
    if(status_name=="REJECTED"){
      this.statusId= 4
    }
    if(status_name=="RETURNED"){
      this.statusId= 5
    }
    if(status_name=="FORWARDED"){
      this.statusId= 6
    }

    this.getapprovesumm(this.send_value,this.currentpage)
  }

  // onKeyDown(event: KeyboardEvent) {
  //   if (event.keyCode !== 8 && event.keyCode !== 13 && (event.keyCode < 48 || event.keyCode > 57)) {
  //     event.preventDefault();
  //   }
  // 
  onKeyDown(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(event.key === 'Tab'){
       return true;
    }
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  
}
