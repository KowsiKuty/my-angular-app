import { Component, OnInit, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SGShareService } from './../share.service';
import { NotificationService } from '../notification.service';
import { SGService } from '../SG.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
export interface branchList {
  id: number
  name: string
  code: string
}
export interface premiseList {
  id: number
  name: string
  code: string
}
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-invoice-summary',
  templateUrl: './invoice-summary.component.html',
  styleUrls: ['./invoice-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class InvoiceSummaryComponent implements OnInit {
  //approver
  @ViewChild('premisetype') matpremiseAutocomplete: MatAutocomplete;
  @ViewChild('premiseInput') premiseInput: any;
  //approval branch
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput:any;
  @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;

  // Premise dropdown
  @ViewChild('PremiseContactInput') PremiseContactInput:any;
  @ViewChild('premisetype') matAutocompletepremise: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  InvoiceSearchForm: FormGroup;
  invoiceSearchList: any;
  premiselist: any;
  branchlist: any
  isLoading = false;
  branchCertifate_Id: any;
  dataentrysite: any;
  invoicemonth: any;
  nationalhdaysat: any;
  aguardhdaysat: any;
  sguardhdaysat: any; 
  aguardhdaysatfri: any; 
  sguardhdaysatfri : any;
  securitypan : any;
  securityagencename: any;
  servicetaxno: any;
  noofdays : any;
  invoiceno : any;
  invoicedate : any;
  aguarddutiespday : any;
  aguarddutiesmonth : any;
  abillamt: any;
  sbillamt: any;
  unaguarddutiespday: any;
  unaguarddutiesmonth : any;
  totlbillamt : any;
  cgstamt : any;
  sgstamt : any;
  totalgst : any;
  totlamtpayable : any;
  gst_no: any;
  isShowHistorySummary = false;
  isShowAddInvoice = false;
  branchCertifate_status:any;
  isMaker: any;
  isChecker: any;
  isInvoiceStatus: any;
  moveToApproverForm:FormGroup;
  ApproverForm:FormGroup;
  rejectForm:FormGroup;
  reviewForm:FormGroup;
  isInvoiceStatus_name: any;
  created_By: any;
  createdDate: any;
  approved_By: any;
  approvedDate: any;
  approval_branch: any;
  count = 0;


  ispaymentpage: boolean = true;
  invoiceSummaryList: any;
  paymentcurrentpage: number = 1;
  paymentpresentpage: number = 1;
  pagesizepayment = 10;
  has_paymentnext = true;
  has_paymentprevious = true;
  premise_Id: any;
  branch_Id: any;

  constructor(private sgservice: SGService, private fb: FormBuilder, private router: Router, private shareservice: SGShareService,
    private notification: NotificationService,private datepipe:DatePipe, private SpinnerService: NgxSpinnerService,) { }

    monthdate = new FormControl(moment());

    chosenYearHandler(normalizedYear: Moment) {
      const ctrlValue = this.monthdate.value;
      ctrlValue.year(normalizedYear.year());
      this.monthdate.setValue(ctrlValue);
    }
  
    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
      const ctrlValue = this.monthdate.value;
      ctrlValue.month(normalizedMonth.month());
      this.monthdate.setValue(ctrlValue);
      datepicker.close();
      this.InvoiceSearchForm.patchValue({
        monthdate:this.monthdate.value
      })
      this.count=0
    }

  ngOnInit(): void {
    this.InvoiceSearchForm = this.fb.group({
      monthdate: [''],
      premise_id: [''],
      branch_id: ['']
    })
  
    this.getInvoiceSummaryList(this.send_value,this.paymentpresentpage);

  }



  // invoice summary List
  getInvoiceSummaryList(val,
    pageNumber = 1) {
      this.SpinnerService.show()
    this.sgservice.getInvoiceSummaryList(val,pageNumber)
      .subscribe((results: any[]) => {
        console.log("invoicelist", results)
        let datas = results["data"];
        this.invoiceSummaryList = datas;
        this.SpinnerService.hide()
        let datapagination = results["pagination"];
        this.invoiceSummaryList = datas;
        if (this.invoiceSummaryList.length === 0) {
          this.ispaymentpage = false
        }
        if (this.invoiceSummaryList.length > 0) {
          this.has_paymentnext = datapagination.has_next;
          this.has_paymentprevious = datapagination.has_previous;
          this.paymentpresentpage = datapagination.index;
          this.ispaymentpage = true
        }
      })
  }

  nextClickPayment() {
    if (this.has_paymentnext === true) {
      this.getInvoiceSummaryList(this.send_value, this.paymentpresentpage + 1)
    }
  }

  previousClickPayment() {
    if (this.has_paymentprevious === true) {
      this.getInvoiceSummaryList(this.send_value, this.paymentpresentpage - 1)
    }


  }



// invoice search
send_value:String=""
  getInvoiceSearch(){

    // if (this.InvoiceSearchForm.value.premise_id != null){
    //   this.premise_Id = this.InvoiceSearchForm.value.premise_id.id
    //   console.log("premise_Id",this.premise_Id)
    //   } else {
    //     this.premise_Id = null;
    //   }
  
    //   if (this.InvoiceSearchForm.value.branch_id != null){
    //   this.branch_Id = this.InvoiceSearchForm.value.branch_id.id
    //   console.log("branch_Id",this.branch_Id)
    //   } else {
    //     this.branch_Id  = null;
    //   }

    // let month= this.datepipe.transform(this.InvoiceSearchForm.value.monthdate,"M");
    // let year= this.datepipe.transform(this.InvoiceSearchForm.value.monthdate,"yyyy")


    // let val = ''
    // if(month !=null){
    //   if (val == ''){
    //     val = '?month=' + month
    //   }else{
    //     val = val +'&month=' + month
    //   }
      
    // } if(year !=null){
    //   if (val == ''){
    //     val = '?year=' + year
    //   }else{
    //     val = val +'&year=' + year
    //   }
     
    // } if(this.premise_Id){
    //   if (val == ''){
    //     val = '?premise_id=' + this.premise_Id
    //   }else{
    //     val = val +'&premise_id=' + this.premise_Id
    //   }
      
    // } if(this.branch_Id){
    //   if (val == ''){
    //     val = '?branch_id=' + this.branch_Id
    //   }else{
    //     val = val +'&branch_id=' + this.branch_Id
    //   }
     
    // }
    // console.log("value",val)

    // this.sgservice.getInvoiceSearch(val)
    //   .subscribe(result => {
    //     console.log("search->invoice", result)
    //     this.invoiceSummaryList= result['data']
    //   })
    let form_value = this.InvoiceSearchForm.value;

    if(form_value.branch_id != "")
    {
      this.send_value=this.send_value+"&branch_id="+form_value.branch_id.id
    }
    if(form_value.premise_id != "")
    {
      this.send_value=this.send_value+"&premise_id="+form_value.premise_id.id
    }
    if(form_value.monthdate != "")
    {
      let month=this.datepipe.transform(form_value.monthdate,"M");
      let year=this.datepipe.transform(form_value.monthdate,"yyyy")
      this.send_value=this.send_value+"&month="+month+"&year="+year
    }

    this.getInvoiceSummaryList(this.send_value,this.paymentpresentpage)

  }



  reset(){
    this.send_value=""
    this.InvoiceSearchForm = this.fb.group({
      monthdate: [''],
      premise_id: [''],
      branch_id: ['']
    })
    this.getInvoiceSummaryList(this.send_value,this.paymentpresentpage);
    // this.getInvoiceSummaryList();
    // this.InvoiceSearchForm.reset();
  }

  invoiceSummaryView(data){
    this.shareservice.invoiceSummaryDetails.next(data)
    this.router.navigate(['SGmodule/invoiceView'], { skipLocationChange: true })
  }


  mothfind(month,year){
    return new Date(year,month-1)
    // return this.datepipe.transform(obj, 'dd-MMM-yyyy h:mm')
  }




  //premise drop down

  premisename() {
    let prokeyvalue: String = "";
    this.getpremiseid(prokeyvalue);
    this.InvoiceSearchForm.get('premise_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getpremisedropdown(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiselist = datas;
      })


  }
  private getpremiseid(prokeyvalue) {
    this.sgservice.getpremisedropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiselist = datas;
      })
  }

  public displaydiss1(premisetype?: premiseList): string | undefined {
    return premisetype ? "("+premisetype.code +" )"+premisetype.name : undefined;
  }

  get premisetype() {
    return this.InvoiceSearchForm.value.get('premise_id');
  }

  // branch drop down
  branchname() {
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.InvoiceSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.sgservice.getbranchdropdown(value,1)
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

  private getbranchid(prokeyvalue) {
    this.sgservice.getbranchdropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaydiss2(branchtype?: branchList): string | undefined {
    return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
  }

  get branchtype() {
    return this.InvoiceSearchForm.value.get('branch_id');
  }


  AddInvoice() {
    this.router.navigate(['SGmodule/addInvoice'], { skipLocationChange: true })
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
                this.sgservice.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra+ 1)
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

  // Premies dropdown
  currentpagepre:any=1
  has_nextpre:boolean=true
  has_previouspre:boolean=true
  autocompletePremisenameScroll() {
    
    setTimeout(() => {
      if (
        this.matAutocompletepremise&&
        this.autocompleteTrigger &&
        this.matAutocompletepremise.panel
      ) {
        fromEvent(this.matAutocompletepremise.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletepremise.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matAutocompletepremise.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletepremise.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletepremise.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpre=== true) {
                this.sgservice.getpremisedropdown(this.PremiseContactInput.nativeElement.value, this.currentpagepre + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.premiselist = this.premiselist.concat(datas);
                    if (this.premiselist.length >= 0) {
                      this.has_nextpre = datapagination.has_next;
                      this.has_previouspre = datapagination.has_previous;
                      this.currentpagepre = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }




}
