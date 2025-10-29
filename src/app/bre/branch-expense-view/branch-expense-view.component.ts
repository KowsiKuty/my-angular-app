import { Component, OnInit, Output, EventEmitter,  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, FormControlDirective,Validators } from '@angular/forms';
import { BreApiServiceService } from '../bre-api-service.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingService } from '../error-handling-service.service';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import { BreShareServiceService } from '../bre-share-service.service';
import {PageEvent} from '@angular/material/paginator'

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
}@Component({
  selector: 'app-branch-expense-view',
  templateUrl: './branch-expense-view.component.html',
  styleUrls: ['./branch-expense-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe, DecimalPipe
  ]
})
export class BranchExpenseViewComponent implements OnInit {

  branchExpID : any
  comefrom : string
  branchExpData : any
  branchExpDetail : any
  branchexpCC : any
  branchExpTrans : any
  isCCBSPage :any = false
  brexpColdet1:any={};
  brexpColdet2:any={};
  brexpColdet3:any={};
  bscclength : number =1
  hold_fromdate :any
  hold_todate :any
  unhold_fromdate :any
  unhold_todate :any

  @Output() onCancel = new EventEmitter<any>();
    constructor(private toastr:ToastrService,private breapiservice:BreApiServiceService,private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService,public datepipe: DatePipe, private shareservice : BreShareServiceService) { }

  ngOnInit(): void {
    this.branchExpID = this.shareservice.brexpid.value
    this.comefrom = this.shareservice.approveComeFrom.value
    this.SpinnerService.show()

    this.breapiservice.branchexp_fetch(this.branchExpID).subscribe((results: any[]) => {
      
      this.SpinnerService.hide()
      console.log("Branch Expense",results)
      this.branchExpData=results
      this.hold_fromdate = results['hold_from_date']
      this.hold_todate = results['hold_to_date']
      this.unhold_fromdate = results['unhold_from_date']
      this.unhold_todate = results['unhold_to_date']
      this.branchexpCC=results["brexpcc"]
      this.isCCBSPage = this.branchexpCC?.data.length > 0 ? true : false
      this.branchExpTrans=results["brexptran"]
      if(this.branchExpTrans?.data != undefined)
      {
        if(this.branchExpTrans.data.length > 0)
        {
          this.brexpColdet1[0] = this.branchExpTrans?.data[0]
          this.brexpColdet1[1] = this.branchExpTrans?.data[1]
          this.brexpColdet1[2] = this.branchExpTrans?.data[2]
          this.brexpColdet1[3] = this.branchExpTrans?.data[3]
        }
        if(this.branchExpTrans.data.length >3)
        {
          this.brexpColdet2[0] = this.branchExpTrans?.data[4]
          this.brexpColdet2[1] = this.branchExpTrans?.data[5]
          this.brexpColdet2[2] = this.branchExpTrans?.data[6]
          this.brexpColdet2[3] = this.branchExpTrans?.data[7]
        }
        if(this.branchExpTrans.data.length >7)
        {
          this.brexpColdet3[0] = this.branchExpTrans?.data[8]
          this.brexpColdet3[1] = this.branchExpTrans?.data[9]
          this.brexpColdet3[2] = this.branchExpTrans?.data[10]
          this.brexpColdet3[3] = this.branchExpTrans?.data[11]
        }
      }
      console.log("this.brexpColdet1---",this.brexpColdet1)
      console.log("this.brexpColdet2---",this.brexpColdet2)
      console.log("this.brexpColdet3---",this.brexpColdet3)

      console.log("this.brexpColdet1.length---",this.brexpColdet1?.length)
      console.log("this.brexpColdet2.length---",this.brexpColdet2?.length)
      console.log("this.brexpColdet3.length---",this.brexpColdet3?.length)
    })

    this.getbrDet(1)
  //   this.breapiservice.branchexpcc_fetch(this.branchExpID).subscribe((results: any[]) => {
  //     console.log("Branch Expense CC",results)
  //     this.branchexpCC=results["data"]
  //   })

  //   this.breapiservice.branchexptrans_fetch(this.branchExpID).subscribe((results: any[]) => {
  //     console.log("Branch Expense Transactions",results)
  //     this.branchExpTrans=results["data"]
  //   })

  }

  rem = new FormControl('', Validators.required);
  isdetpage: boolean = true;
  presentpagedet: number = 1;

  length_det = 0;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  pageSize_det=10;
  showFirstLastButtons:boolean=true;
  handlePageEvent(event: PageEvent) {
      this.length_det = event.length;
      this.pageSize_det = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.presentpagedet=event.pageIndex+1;
      this.getbrDet(this.presentpagedet);
      
    }

  getbrDet(page)
  {
    this.SpinnerService.show()
    this.breapiservice.brexpdtl_fetch(this.branchExpID,page).subscribe((results: any[]) => {
      this.SpinnerService.hide()
      console.log("Branch Expense detail",results)
      this.branchExpDetail=results["data"]
      if (this.branchExpDetail?.length > 0) {
        this.length_det=results?.['count'];
        // this.has_nextdet = results['pagination']?.has_next;
        // this.has_previousdet = results['pagination']?.has_previous;
        this.presentpagedet = results['pagination']?.index;
        this.isdetpage = true
        console.log("this.branchExpDetail---->>>>>>>>",this.branchExpDetail)
        this.bscclength = this.branchExpDetail?.debit_detail?.data?.length
        console.log("this.bscclength---", this.bscclength)
      }
      else
      {
        this.length_det=0;
        this.isdetpage = false
      }
    })
  }
  viewBacks()
  {
    this.onCancel.emit()
  }

  brExpReject()
  {
    let rem = this.rem.value
    if(rem == undefined || rem == null || rem == "")
    {
      this.toastr.error("Please Enter Remarks")
      return false
    }

    let data ={
      "id":this.branchExpID,
      "remarks":rem
     }
    this.disabled = true
    this.breapiservice.branchexpReject(data).subscribe((results) => {
    this.disabled = false
    if(results.status == "success"){
                  this.toastr.success(results.message,results.status)  
                  this.onCancel.emit()
        }
        else
        {
         this.toastr.error(results.description,results.code)      
      }
  })
  }
  getcurrency(val){
    if(val == undefined || val == null || val == ''){
      return
    }
    let values = Number(val)
    return (values.toFixed(2))
  }
  disabled = false
  brExpApprove()
  {
    let rem = this.rem.value
    if(rem == undefined || rem == null || rem == "")
    {
      this.toastr.error("Please Enter Remarks")
      return false
    }

    let data ={
      "id":this.branchExpID,
      "remarks":rem
     }
    this.disabled = true
    this.breapiservice.branchexpApprove(data).subscribe((results) => {
      this.disabled = false
      if(results.status == "success"){
                  this.toastr.success(results.message,results.status)  
                  this.onCancel.emit()
        }
        else
        {
         this.toastr.error(results.description,results.code)      
      }
  })
  }

  viewtrnlist:any=[];
  presentpagebrexpApp:number = 1;
  pageSize:any
  viewtrn()
  {
    this.SpinnerService.show()
    this.breapiservice.getViewTrans(this.branchExpID).subscribe(data=>{
      this.viewtrnlist=data['data'];
      this.presentpagebrexpApp = data['pagination']?.index
      this.SpinnerService.hide()
    })
  }
  name:any;
branch:any;
desig: any
view(dt){
  debugger
  this.name=dt?.emp?.name
  this.branch=dt?.emp_branch?.name
  this.desig=dt?.emp?.designation
 }

 hold_from_date = new FormControl('');
 unhold_from_date = new FormControl('');
 unhold_to_date = new FormControl('');

 brExpHold()
 {
   let rem = this.rem.value
   let date = this.hold_from_date.value
   if(date == undefined || date == null || date == "")
   {
     this.toastr.error("Please Select Hold from date")
     return false
   }
  if(rem == undefined || rem == null || rem == "")
   {
     this.toastr.error("Please Enter Remarks")
     return false
   }

   let data ={
     "id":this.branchExpID,
     "from_date":  this.datepipe.transform(date,'yyyy-MM-dd'),
     "remark":rem
    }
    this.disabled = true
    this.breapiservice.expense_hold(data).subscribe((results) => {
      this.disabled = false
     if(results.status == "success"){
                 this.toastr.success(results.message,results.status)  
                 this.onCancel.emit()
       }
       else
       {
        this.toastr.error(results.description,results.code)      
     }
 })
 }


 brExpUnhold()
 {
   let rem = this.rem.value
   let fromdate = this.unhold_from_date.value
   let todate = this.unhold_to_date.value
   if(fromdate == undefined || fromdate == null || fromdate == "")
   {
     this.toastr.error("Please Select UnHold from date")
     return false
   }
   if(todate == undefined || todate == null || todate == "")
   {
     this.toastr.error("Please Select UnHold To date")
     return false
   }
  if(rem == undefined || rem == null || rem == "")
   {
     this.toastr.error("Please Enter Remarks")
     return false
   }

   let data ={
     "id":this.branchExpID,
     "from_date":  this.datepipe.transform(fromdate,'yyyy-MM-dd'),
     "to_date":  this.datepipe.transform(todate,'yyyy-MM-dd'),
     "remark":rem
    }
    this.disabled = true
    this.breapiservice.expense_unhold(data).subscribe((results) => {
      this.disabled = false

     if(results.status == "success"){
                 this.toastr.success(results.message,results.status)  
                 this.onCancel.emit()
       }
       else
       {
        this.toastr.error(results.description,results.code)      
     }
 })
 }

 brExpCancel()
 {
   let rem = this.rem.value
  if(rem == undefined || rem == null || rem == "")
   {
     this.toastr.error("Please Enter Remarks")
     return false
   }

   let data ={
     "id":this.branchExpID,
     "remark":rem
    }
    this.disabled = true
    this.breapiservice.expense_cancel(data).subscribe((results) => {
    this.disabled = false

     if(results.status == "success"){
                 this.toastr.success(results.message,results.status)  
                 this.onCancel.emit()
       }
       else
       {
        this.toastr.error(results.description,results.code)      
     }
 })
 }



}
