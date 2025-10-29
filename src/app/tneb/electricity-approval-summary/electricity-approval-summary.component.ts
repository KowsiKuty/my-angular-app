import { Component, OnInit, Output,EventEmitter, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
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
import { TnebShareService } from '../tneb-share.service';
import { NgxSpinnerService } from 'ngx-spinner';

export interface branchList{
  id:number
  name:string
  code:string
}

@Component({
  selector: 'app-electricity-approval-summary',
  templateUrl: './electricity-approval-summary.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./electricity-approval-summary.component.scss']
})
export class ElectricityApprovalSummaryComponent implements OnInit {
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
   
    if(event.code =="Escape"){
      this.spinner.hide();
    }
    
  }
 // branch dropdown
 @ViewChild('branchContactInput') branchContactInput:any;
 @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;
 @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger; 
 approvalDetailSearch: FormGroup;
 EleApprovalSummaryList: any;
 ispaymentpage: boolean = true;
 paymentcurrentpage: number = 1;
 paymentpresentpage: number = 1;
 pagesizepayment = 10;
 has_paymentnext = true;
 has_paymentprevious = true;
 isLoading= false;
 branchlist:any;
selecteddata:any={'Modified':4,'Submitted':0,'Resubmitted':2,'Approved':1,'Rejected':3};
 constructor(private spinner:NgxSpinnerService,private tnebshareservice:TnebShareService,private router:Router,private tnebService: TnebService, private fb:FormBuilder) { }

 ngOnInit(): void {
   this.approvalDetailSearch=this.fb.group({
     branch_id:[''],
     'consumerno':new FormControl(''),
     'status':new FormControl('')
   })
   this.getSummaryList();
 }
 
 clickApprovalConsumerNo(list){
   this.tnebshareservice.viewelecdetails.next(list);
   this.router.navigate(['/tneb/elctcodoapproval'], {skipLocationChange: true})
 }


 // summary List
 getSummaryList(filter = "", sortOrder = 'asc',
   pageNumber = 1, pageSize = 10) {
   this.tnebService.getEleApprovalSummaryLis(filter, sortOrder, pageNumber, pageSize)
     .subscribe((results: any[]) => {
       console.log("eleapprovalSumy", results)
       let datas = results["data"];
       this.EleApprovalSummaryList = datas;
       let datapagination = results["pagination"];
       this.EleApprovalSummaryList = datas;
       if (this.EleApprovalSummaryList.length === 0) {
         this.ispaymentpage = false
       }
       if (this.EleApprovalSummaryList.length > 0) {
         this.has_paymentnext = datapagination.has_next;
         this.has_paymentprevious = datapagination.has_previous;
         this.paymentpresentpage = datapagination.index;
         this.ispaymentpage = true
       }
     })
 }
 searchsummarydata(){
  this.tnebService.getEleApprovalSummaryLis('', '', 1, 10)
  .subscribe((results: any[]) => {
    console.log("eleapprovalSumy", results)
    let datas = results["data"];
    this.EleApprovalSummaryList = datas;
    let datapagination = results["pagination"];
    this.EleApprovalSummaryList = datas;
    if (this.EleApprovalSummaryList.length === 0) {
      this.ispaymentpage = false
    }
    if (this.EleApprovalSummaryList.length > 0) {
      this.has_paymentnext = datapagination.has_next;
      this.has_paymentprevious = datapagination.has_previous;
      this.paymentpresentpage = datapagination.index;
      this.ispaymentpage = true
    }
  })

 }
 nextClickPayment() {
   if (this.has_paymentnext === true) {
     this.getSummaryList("", 'asc', this.paymentpresentpage + 1, 10)
   }
 }

 previousClickPayment() {
   if (this.has_paymentprevious === true) {
     this.getSummaryList("", 'asc', this.paymentpresentpage - 1, 10)
   }
 }



 branchname(){
   let prokeyvalue: String = "";
     this.getbranchid(prokeyvalue);
     this.approvalDetailSearch.get('branch_id').valueChanges
       .pipe(
         debounceTime(100),
         distinctUntilChanged(),
         tap(() => {
           this.isLoading = true;
         }),
         switchMap(value => this.tnebService.getbranchdropdown(value,1)
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
   this.tnebService.getbranchdropdown(prokeyvalue,1)
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.branchlist = datas;

     })
 }

 public displaydiss2(branchtype?: branchList): string | undefined {
   return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
   
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
                 this.tnebService.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra+ 1)
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

}
