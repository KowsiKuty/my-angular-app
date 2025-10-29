import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Rems2Service } from '../rems2.service'


@Component({
  selector: 'app-rent-confirmation',
  templateUrl: './rent-confirmation.component.html',
  styleUrls: ['./rent-confirmation.component.scss']
})
export class RentConfirmationComponent implements OnInit {

  ispaymentpage: boolean = true;
  paymentDetailsList: any;
  paymentcurrentpage: number = 1;
  paymentpresentpage: number = 1;
  pagesizepayment = 10;
  has_paymentnext = true;
  has_paymentprevious = true;

  invoiceList:Array<any>;
  has_nextinv = true;
  has_previousinv = true;
  currentpageinv: number = 1;
  presentpageinv: number = 1;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  ExpList: Array<any>
  presentexp: number = 1;
  currentexp: number = 1;
  pageSizeexp = 10;
  is_exppage: boolean;
  has_previousexp = false;
  has_nextexp = false;
  ExpID:any;
  document:any;
  isinvpage:Boolean;
  ExpensesForm: FormGroup;
  data:any;


  constructor(private fb: FormBuilder, private datePipe: DatePipe, private router: Router, private remsshareService: RemsShareService, private route: ActivatedRoute,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService,private remsService2: Rems2Service) { }
    

  ngOnInit(): void {

    this.getPaymentList();
    this.Expsummary();
    this.getinvoicedetsummary();

  }

  getPaymentList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.remsService.getPaymentDetailsList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        console.log("payment", results)
        let datas = results["data"];
        this.paymentDetailsList = datas;
        let datapagination = results["pagination"];
        this.paymentDetailsList = datas;
        if (this.paymentDetailsList.length === 0) {
          this.ispaymentpage = false
        }
        if (this.paymentDetailsList.length > 0) {
          this.has_paymentnext = datapagination.has_next;
          this.has_paymentprevious = datapagination.has_previous;
          this.paymentpresentpage = datapagination.index;
          this.ispaymentpage = true
        }
      })
  }

  nextClickPayment() {
    if (this.has_paymentnext === true) {
      this.paymentcurrentpage = this.paymentpresentpage + 1
      this.getPaymentList("", 'asc', this.paymentpresentpage + 1, 10)
    }
  }

  previousClickPayment() {
    if (this.has_paymentprevious === true) {
      this.paymentcurrentpage = this.paymentpresentpage - 1
      this.getPaymentList("", 'asc', this.paymentpresentpage - 1, 10)
    }

    
  }
  getinvoicedetsummary(pageNumber = 1, pageSize = 10) {
    this.remsService.getinvoicesummary(pageNumber, pageSize )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        console.log("getinvoicee", datas);
        let datapagination = results["pagination"];
        this.invoiceList = datas;
        if (this.invoiceList.length >= 0) {
          this.has_nextinv = datapagination.has_next;
          this.has_previousinv = datapagination.has_previous;
          this.presentpageinv = datapagination.index;
          this.isinvpage = true;
        } else if (this.invoiceList.length == 0) {
          this.isinvpage = false;
        }
      })
      

  
    
  
}
nextClick () {
      
  if (this.has_nextinv === true) {
    this.currentpageinv= this.presentpageinv + 1
    this.getinvoicedetsummary(this.presentpageinv + 1,10)
  
  }
  }
  
previousClick() {

  if (this.has_previousinv === true) {
    this.currentpageinv= this.presentpageinv - 1
    this.getinvoicedetsummary(this.presentpageinv - 1,10)
    
  }
  }

InvoiceEdit(data){
  this.remsshareService.getinvoicedetail.next(data);
  this.router.navigate(['/rems/invdetails']);
  return data;
}
fuctionforres(){
  this.data = {id:0}
  this.remsshareService.getinvoicedetail.next(this.data)
  this.router.navigateByUrl('/rems/invdetails');
}
deleteinvoice(data){
  let value = data.id
  console.log("deleteinv", value)
  this.remsService.deleteinvoiceform(value)
  .subscribe(result =>  {
   this.notification.showSuccess("Successfully deleted....")
   this.getinvoicedetsummary();
   return true
  

  })

}


  ExpEdit(data) {
    this.remsshareService.ExpensesForm.next(data)
    this.router.navigate(['/rems/ExpensesDetails'],{ skipLocationChange: true });
    return data;
  }
  ExpDelete(data) {
  
    let value = data.id
    this.remsService2.expDeleteForm(value, this.ExpID)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.Expsummary();
        return true
  
      })
  }
  Expsummary(pageNumber=1,pageSize=10) {
    this.remsService2.expsummary(pageNumber, pageSize, this.ExpID)
    .subscribe((result) => {
      console.log("eb", result) 
      let datas = result['data'];
      let datapagination = result["pagination"];
      this.ExpList = datas;
      console.log("re", this.ExpList)
      if (this.ExpList.length === 0) {
        this.is_exppage = false
      }
      if (this.ExpList.length >= 0) {
        this.has_nextexp = datapagination.has_next;
        this.has_previousexp = datapagination.has_previous;
        this.presentexp = datapagination.index;
        this.is_exppage = true
      }  
    })
   }
  
  
   previousClickExp() {
    if (this.has_previousexp === true) {
        this.currentexp = this.presentexp- 1
        this.Expsummary(this.presentexp - 1)
      }
  
  }
  nextClickExp() {
    if (this.has_nextexp === true) {
        this.currentexp = this.presentexp + 1
        this.Expsummary(this.presentexp + 1)
      }
  
  }
  fuctionforreset(){
    this.data = {id:0}
    this.remsshareService.ExpensesForm.next(this.data)
    this.router.navigateByUrl('/rems/ExpensesDetails');
  }
  fileDownload(id, fileName) {
    this.remsService.fileDownloads(id)
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }

}
