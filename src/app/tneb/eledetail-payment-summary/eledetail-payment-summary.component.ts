import { Component, OnInit,Output,EventEmitter, ViewChild, ViewEncapsulation, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { TnebService } from '../tneb.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/service/notification.service';
import { ShareService } from 'src/app/atma/share.service';
import { SharedService } from 'src/app/service/shared.service';

export interface branchList{
  id:number
  name:string
  code:string
}

export interface occupancy{
  id:number
  occupancy_name:string;
  occupancy_code:string;
}



@Component({
  selector: 'app-eledetail-payment-summary',
  templateUrl: './eledetail-payment-summary.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./eledetail-payment-summary.component.scss']
})
export class EledetailPaymentSummaryComponent implements OnInit {
  paymentdetails: any;
  occupancydata: any;
  occupancy_hasnext=true;
  occupancy_hasprevious=true;
  occupancy_currentpage=1;
  count=0;
  branch_Id: any;
  billstatusdata: any;
  occupancydropdown=[];

  occupancypagination={
    has_next:true,
    has_previous:true,
    index:1,
  }
  select: Date;
  approverdata: any;


  popupbillstatus:any
  premisesTypeData: any;
  usageList: any;
  billpaymentstatus: number;

  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
   
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
// branch dropdown
@ViewChild('opendialog') dialogref:TemplateRef<any>;
@ViewChild('branchContactInput') branchContactInput:any;
@ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;
@ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
@ViewChild('closebutton' ) closebutton

detailPaymentSearch:FormGroup;
paymentsummaryList: Array<any>=[];
ispaymentpage: boolean = true;
paymentcurrentpage: number = 1;
paymentpresentpage: number = 1;
pagesizepayment = 10;
has_paymentnext:boolean= false;
has_paymentprevious:boolean=false;
isLoading= false;
branchlist:any;
conumernumber:any;
detailsdata:any={};

billstatus=[{"name":'New',"id":1},{"name":'Paid',"id":2}]
invoice=[
  {'name':'asdf','id':1}
]

remarksbill=''
detailPaymentapprove:FormGroup
constructor(private spinner:NgxSpinnerService,private matdialog:MatDialog,private router:Router,private shareService:SharedService,
  private tnebService: TnebService, private fb:FormBuilder,private datepipe:DatePipe,private notification:NotificationService) { }

ngOnInit(): void {
  this.detailPaymentSearch=this.fb.group({
    branch_id:new FormControl(''),
    'consumerno':new FormControl(''),
    'branch':new  FormControl(''),
    'bill_txnfromdate':new FormControl(''),
    'bill_txntodate':new FormControl(''),
    'occupancy':new FormControl(''),
    'ownership':new FormControl(''),
    'paystatus':new FormControl(''),
    'invstatus':new FormControl(''),
    'billtransactiondate':new FormControl(''),
    'billpaymentstatus':new FormControl(''),

    'ownership_type':new FormControl(''),
    'invoice':new FormControl(''),
  })
  this.detailPaymentapprove = this.fb.group({
    remarks:['']
  })
  // this.getSummaryList();
  // this.paymentsummary(1)
  this.getbillstatusdata()

  // this.searchsummary()
  this.getbranchId()
  this.newpaymentstatuscall()

  this.premisesType()

  this.getUsage()

}

clickPaymentConsumerNo(list){
  list.summarycheck=2

  this.shareService.submodulestneb.next(list);
  // this.router.navigate(['/tneb/viewEleDetail'], {skipLocationChange: true})
  this.router.navigate(['/tneb/electricityexpense/addElectricity'], { skipLocationChange: true })
}

summaryView(list){

}



// summary List
// getSummaryList() {
//   this.tnebService.getpaymenttransactionsummary('',this.paymentpresentpage)
//     .subscribe((results: any[]) => {
//       console.log("elePaymentSumy", results)
//       let datas = results["data"];
//       this.count=results['count']
//       this.paymentsummaryList = datas;
//       let datapagination = results["pagination"];
//       this.paymentsummaryList = datas;
//       // if (this.paymentsummaryList.length === 0) {
//       //   this.ispaymentpage = false
//       // }
//       // if (this.paymentsummaryList.length > 0) {
//         this.has_paymentnext = datapagination.has_next;
//         this.has_paymentprevious = datapagination.has_previous;
//         this.paymentpresentpage = datapagination.index;
//         this.ispaymentpage = true
//       // }
//     })
// }

// nextClickPayment() {
//   if (this.has_paymentnext === true) {
//     this.paymentpresentpage += 1;
//     this.getSummaryList();
//   }
// }

// previousClickPayment() {
//   if (this.has_paymentprevious === true) {
//     this.paymentpresentpage -= 1;
//     this.getSummaryList();
//   }


// }




branchname(){
  let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.detailPaymentSearch.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.tnebService.getbranch(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        console.log("branch", datas)

      })


}
private getbranchid(prokeyvalue)
{
  this.tnebService.getbranch(prokeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchlist = datas;

    })
}

public displaydiss2(branchtype?: branchList): string | undefined {
  return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
  
}

public displayocc(occupancy?: occupancy): string | undefined {
  return occupancy ? "("+occupancy?.occupancy_code+") - " + occupancy.occupancy_name : undefined;
  
}

  // Branch  dropdown

  currentpagebra:any=1
  has_nextbra:boolean=true
  has_previousbra:boolean=true
  autocompletebranchnameScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.tnebService.getbranch(this.branchContactInput.nativeElement.value, this.currentpagebra+ 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchlist = this.branchlist.concat(datas);
                    if (this.branchlist.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
 dialogopen(data:any){
   this.detailsdata=data;
   this.conumernumber=data.consumer_no;
  const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.position = {
        top:  '0'  ,
        // right: '0'
      };
      dialogConfig.width = '60%' ;
      dialogConfig.height = '500px' ;
      console.log(dialogConfig);
    this.matdialog.open(this.dialogref,dialogConfig);
 }
 closedialog(){
   this.matdialog.closeAll();
 }

 paymentsummary(consumerno,branch,occupancy,fromdate,todate,billpaymentstatus,ownership,invoice,page){

  this.spinner.show()

  this.tnebService.getpaymentsummary(consumerno,branch,occupancy,fromdate,todate,billpaymentstatus,ownership,invoice,page).subscribe(
    results=>{
  this.spinner.hide()

      let datas = results["data"];
      this.paymentsummaryList = datas;
      this.count=results['count'];
      let datapagination = results["pagination"];
      if (this.paymentsummaryList.length > 0) {
        this.has_paymentnext = datapagination.has_next;
        this.has_paymentprevious = datapagination.has_previous;
        this.paymentpresentpage = datapagination.index;
        // this.ispaymentpage = true
      }
    }
  )
 }

 searchsummary(){
  let consumer=this.detailPaymentSearch.value.consumerno? this.detailPaymentSearch.value.consumerno:''
  let branch=this.detailPaymentSearch.value.branch?.id ? this.detailPaymentSearch.value.branch.id:''
  let occupancy=this.detailPaymentSearch.value.occupancy?.id ? this.detailPaymentSearch.value.occupancy.id:''
  let billtransactiondate= this.detailPaymentSearch.value.billtransactiondate?  this.datepipe.transform(this.detailPaymentSearch.value.billtransactiondate, 'yyyy-MM-dd') :''
  this.billpaymentstatus= this.detailPaymentSearch.value.billpaymentstatus? this.detailPaymentSearch.value.billpaymentstatus:''

  let billtransactionfromdate=this.detailPaymentSearch.value.bill_txnfromdate?  this.datepipe.transform(this.detailPaymentSearch.value.bill_txnfromdate, 'yyyy-MM-dd') :''
  let billtransactiontodate=this.detailPaymentSearch.value.bill_txntodate?  this.datepipe.transform(this.detailPaymentSearch.value.bill_txntodate, 'yyyy-MM-dd') :''

  let ownership=this.detailPaymentSearch.value.ownership_type? this.detailPaymentSearch.value.ownership_type:'' 

  let invoice=this.detailPaymentSearch.value.invoice? this.detailPaymentSearch.value.invoice:''

  console.log('consumer ,next click search check,',consumer,branch,occupancy,billtransactionfromdate,billtransactiontodate,'billstatus',this.billpaymentstatus,ownership,invoice,this.paymentpresentpage+1)


  this.paymentsummary(consumer,branch,occupancy,billtransactionfromdate,billtransactiontodate,this.billpaymentstatus,ownership,invoice,this.paymentpresentpage=1)

 }     
 previousClickPayment(){
  if(this.has_paymentprevious ){

  let consumer=this.detailPaymentSearch.value.consumerno? this.detailPaymentSearch.value.consumerno:''
  let branch=this.detailPaymentSearch.value.branch?.id ? this.detailPaymentSearch.value.branch.id:''
  let occupancy=this.detailPaymentSearch.value.occupancy?.id ? this.detailPaymentSearch.value.occupancy?.id:''
  let billtransactiondate= this.detailPaymentSearch.value.billtransactiondate?  this.datepipe.transform(this.detailPaymentSearch.value.billtransactiondate, 'yyyy-MM-dd') :''
  let billpaymentstatus= this.detailPaymentSearch.value.billpaymentstatus? this.detailPaymentSearch.value.billpaymentstatus:''
 
  let billtransactionfromdate=this.detailPaymentSearch.value.bill_txnfromdate?  this.datepipe.transform(this.detailPaymentSearch.value.bill_txnfromdate, 'yyyy-MM-dd') :''
  let billtransactiontodate=this.detailPaymentSearch.value.bill_txntodate?  this.datepipe.transform(this.detailPaymentSearch.value.bill_txntodate, 'yyyy-MM-dd') :''
  
  // let ownership_type=this.detailPaymentSearch.value.ownership_type? this.detailPaymentSearch.value.ownership_type:'' 

  let ownership=this.detailPaymentSearch.value.ownership_type? this.detailPaymentSearch.value.ownership_type:'' 

  let invoice=this.detailPaymentSearch.value.invoice? this.detailPaymentSearch.value.invoice:''

  console.log('consumer ,next click search check,',consumer,branch,occupancy,billtransactionfromdate,billtransactiontodate,'billstatus',this.billpaymentstatus,ownership,invoice,this.paymentpresentpage+1)


  this.paymentsummary(consumer,branch,occupancy,billtransactionfromdate,billtransactiontodate,this.billpaymentstatus,ownership,invoice,this.paymentpresentpage-1)
  }
 }
 
 nextClickPayment(){
  if(this.has_paymentnext ){

    let consumer=this.detailPaymentSearch.value.consumerno? this.detailPaymentSearch.value.consumerno:''
    let branch=this.detailPaymentSearch.value.branch?.id ? this.detailPaymentSearch.value.branch.id:''
    let occupancy=this.detailPaymentSearch.value.occupancy?.id ? this.detailPaymentSearch.value.occupancy.id:''
    let billtransactiondate= this.detailPaymentSearch.value.billtransactiondate?  this.datepipe.transform(this.detailPaymentSearch.value.billtransactiondate, 'yyyy-MM-dd') :''
    let billpaymentstatus= this.detailPaymentSearch.value.billpaymentstatus? this.detailPaymentSearch.value.billpaymentstatus:''
  
    let billtransactionfromdate=this.detailPaymentSearch.value.bill_txnfromdate?  this.datepipe.transform(this.detailPaymentSearch.value.bill_txnfromdate, 'yyyy-MM-dd') :''
  let billtransactiontodate=this.detailPaymentSearch.value.bill_txntodate?  this.datepipe.transform(this.detailPaymentSearch.value.bill_txntodate, 'yyyy-MM-dd') :''

  
  let ownership=this.detailPaymentSearch.value.ownership_type? this.detailPaymentSearch.value.ownership_type:'' 

  let invoice=this.detailPaymentSearch.value.invoice? this.detailPaymentSearch.value.invoice:''


    console.log('consumer ,next click search check,',consumer,branch,occupancy,billtransactionfromdate,billtransactiontodate,'billstatus',this.billpaymentstatus,ownership,invoice,this.paymentpresentpage+1)

    this.paymentsummary(consumer,branch,occupancy,billtransactionfromdate,billtransactiontodate,this.billpaymentstatus,ownership,invoice,this.paymentpresentpage+1)
    }
 }
 

 paymentopen(consumerdetails){ 
  console.log('starting',consumerdetails)
  this.approverdata=consumerdetails
  
      let obj = {
        "consumer_no": consumerdetails.consumer_no,
        "contactno": (consumerdetails.consumer_contactno)? consumerdetails.consumer_contactno: "9809809800"
      }

      this.spinner.show()
      this.tnebService.tnebconsumervalidation(obj).subscribe(
        result => {
          this.spinner.hide()

          console.log(result)
          if (result.validation_status && result.validation_status.out_msg.MININFO != 'Invalid Consumer' && result?.validation_status?.bpms_error_msg != "Failed" ) {
            this.popupbillstatus=result?.validation_status?.out_msg?.STATUS
            // this.notification.showSuccess('Consumer Number validated')
            console.log('paymentdetails',this.paymentsummaryList,this.approverdata)
            console.log('after updated',consumerdetails,this.popupbillstatus)

            if(result?.validation_status?.out_msg?.STATUS == "K"){
              this.notification.showSuccess('Consumer Number validated')
            }
            else{
            this.notification.showSuccess('Consumer Number validated.')
            }
          }
          else {
            // this.approverdata.bill.bill_status=''
            this.popupbillstatus=''
            this.notification.showError('Consumer Number validation failed')
          }


        })

    
  
 }

 resetpayment(){
  this.paymentdetails='',
  this.remarksbill=''
  this.popupbillstatus=''
  this.detailPaymentapprove.patchValue({
    'remarks':''
  })
 }

 resetdata(){
  this.detailPaymentSearch.patchValue({
    
    'consumerno':'',
    'branch':'',
    'bill_txnfromdate':'',
    'bill_txntodate':'',
    'occupancy':'',
    'ownership':'',
    'paystatus':'',
    'invstatus':'',
    'billtransactiondate':'',
    'billpaymentstatus':'',
    'ownership_type':'',
    'invoice':'',
    })

    this.newpaymentstatuscall()
    this.select=null
    // this.searchsummary()
    console.log('this.select',this.select)
   
 }

 billpayment(){
  let obj={
    ebbill_id:this.approverdata.id,
    // remarks: this.detailPaymentapprove.value.remarks
  }
  this.spinner.show()
  this.tnebService.ebbillpayment(obj).subscribe(
    result=>{
  this.spinner.hide()

      if(result.message?.MESSAGE == 'SUCCESS' ){
        this.notification.showSuccess('Paid Successfully')
        this.resetpayment()
        this.closebutton.nativeElement.click()
        this.detailPaymentSearch.patchValue({
          billpaymentstatus :1
        })
         this.searchsummary()  
      }
      else{
        this.notification.showError('Payment Failed')
      }
  },(error)=>{
  this.spinner.hide()

  })
 }

 rejectpayment(){
  let remarks = this.detailPaymentapprove.value.remarks
  this.spinner.show()
  this.tnebService.ebbillreject(this.approverdata.id,remarks).subscribe(
    result=>{
      this.spinner.hide()
      if(result.status =='success' ){
        this.notification.showSuccess('Successfully Rejected');
        this.closebutton.nativeElement.click()
        this.detailPaymentSearch.patchValue({
          billpaymentstatus :1
        })
        this.searchsummary()  

      }
      else if(result?.status == "INVALID RESPONSE"){
        this.notification.showError(result?.message?.message)
        // this.closebutton.nativeElement.click()
      }
      else{
        this.notification.showError(result.message)
      }
    }
  )
 }

 getbranchId() {
  this.tnebService.getbranchId()
    .subscribe((results) => {
      this.branch_Id = results.id;
      console.log("branchId", this.branch_Id)
     
    })

}

 getoccupancydata(){
    
  this.tnebService.occupancyidget(this.branch_Id).subscribe(
    result =>{
      this.occupancydata = result['data'];
      let datapagination = result['pagination']
      console.log(result)

      if (this.occupancydata.length >= 0) {
        this.occupancy_hasnext = datapagination.has_next;
        this.occupancy_hasprevious = datapagination.has_previous;
        this.occupancy_currentpage = datapagination.index;
      }
    }
  )
  }

  clickConsumerNo(value) {
    // this.shareService.co_do_consumerno.next(value);
    // // this.router.navigate(['/tneb/viewEleDetail'], {skipLocationChange: true})
    // this.router.navigate(['/tneb/electricityexpense/electricitycodomaker'], { skipLocationChange: true })
  }

  ebfilledpaymenttopay(){
    console.log('crno', this.approverdata)
    this.spinner.show()
    this.tnebService.ebbillfailapi(this.approverdata?.invoiceheader_cron).subscribe(
      result=>{
        this.spinner.hide()
        console.log(result)
        if(result.status == 'success' ){
          this.notification.showSuccess('Paid Successfully')
          this.closebutton.nativeElement.click()
          this.detailPaymentSearch.patchValue({
            billpaymentstatus :1
          })
          this.searchsummary()  
        }
        else{
          this.notification.showError('Payment Failed')
          this.closebutton.nativeElement.click()

        }
    },(error)=>{
    this.spinner.hide()
  
    })
  }

  getbillstatusdata(){
    this.tnebService.ebbillstatusdata().subscribe(
      result=>{
        this.billstatusdata=result['data']
      }
    )
  }

  getoccupancydropdowndata(value){
    this.tnebService.getoccupancydata(value).subscribe(
      result=>{
        this.occupancydata=result['data'];
        
      }
    )
  }

  newpaymentstatuscall(){
    let consumer=this.detailPaymentSearch.value.consumerno? this.detailPaymentSearch.value.consumerno:''
    let branch=this.detailPaymentSearch.value.branch?.id ? this.detailPaymentSearch.value.branch.id:''
    let occupancy=this.detailPaymentSearch.value.occupancy?.id ? this.detailPaymentSearch.value.occupancy.id:''
    let billtransactiondate= this.detailPaymentSearch.value.billtransactiondate?  this.datepipe.transform(this.detailPaymentSearch.value.billtransactiondate, 'yyyy-MM-dd') :''
    let billpaymentstatus= 1
    let billtransactionfromdate=this.detailPaymentSearch.value.bill_txnfromdate?  this.datepipe.transform(this.detailPaymentSearch.value.bill_txnfromdate, 'yyyy-MM-dd') :''
    let billtransactiontodate=this.detailPaymentSearch.value.bill_txntodate?  this.datepipe.transform(this.detailPaymentSearch.value.bill_txntodate, 'yyyy-MM-dd') :''    

    let ownership=this.detailPaymentSearch.value.ownership_type? this.detailPaymentSearch.value.ownership_type:'' 

    this.billpaymentstatus=1;

    let invoice=this.detailPaymentSearch.value.invoice? this.detailPaymentSearch.value.invoice:''

    console.log('consumer ,next click search check,',consumer,branch,occupancy,billtransactionfromdate,billtransactiontodate,'billstatus',this.billpaymentstatus,ownership,invoice,this.paymentpresentpage+1)
    

    this.paymentsummary(consumer,branch,occupancy,billtransactionfromdate,billtransactiontodate,this.billpaymentstatus,ownership,invoice,this.paymentpresentpage=1)
  }

  fromdateSelection(event){
    const date = new Date(event)
    this.select = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    console.log('date check',this.detailPaymentSearch.value.bill_txntodate > this.select)
    if(this.detailPaymentSearch.value.bill_txntodate < this.select){
      this.detailPaymentSearch.patchValue({
        bill_txntodate:''
      })
    }

  }


  premisesType() {
    this.tnebService.premisesType()
      .subscribe((results) => {
        this.premisesTypeData = results.data;
      })
  }

  getUsage() {
    this.tnebService.getUsage()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.usageList = datas;
      })
  }



}


