import { Component, OnInit,Output,EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SGShareService } from './../share.service';
import { NotificationService } from '../notification.service';
import { SGService } from '../SG.service';
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
import { NgxSpinnerService } from "ngx-spinner";
export interface branchList{
  id:number
  name:string
  code:string
}
export interface premiseList{
  id:number
  name:string
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
  selector: 'app-branchcert-summary',
  templateUrl: './branchcert-summary.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./branchcert-summary.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class BranchcertSummaryComponent implements OnInit {

  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput:any;
  @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;

  // Premise dropdown
  @ViewChild('PremiseContactInput') PremiseContactInput:any;
  @ViewChild('producttype') matAutocompletepremise: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  
  ispaymentpage: boolean = true;
  summaryList: any;
  paymentcurrentpage: number = 1;
  paymentpresentpage: number = 1;
  pagesizepayment = 10;
  has_paymentnext = true;
  has_paymentprevious = true;
  premise_Id: number;
  branch_Id: number;

  branchcertList:any
  branchcert:any
  isLoading=false
  premiselistt:any
  branchlist:any
  moveToApproverForm:FormGroup;
  ApproverForm:FormGroup;
  rejectForm:FormGroup;
  reviewForm:FormGroup;
  yes = "Yes"
  no = "No"
  isShowHistorySummary = false;
  count=0
  fromBranch = ""
  constructor(private sgservice:SGService,private fb:FormBuilder,private router:Router,private shareservice:SGShareService,
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
    this.branchcert.patchValue({
      monthdate:this.monthdate.value
    })
    this.count=0
  }

  ngOnInit(): void {
    this.branchcert=this.fb.group({
      monthdate:[''],
      premise_id:[''],
      branch_id:['']
    })

    this.getSummaryList(this.send_value,this.paymentpresentpage);

  }

// summary List
  getSummaryList(val,
    pageNumber = 1) {
      this.SpinnerService.show()
    this.sgservice.getSummaryDetails(val,pageNumber)
      .subscribe((results: any[]) => {
        console.log("branchlist", results)
        let datas = results["data"];
        this.summaryList = datas;
        this.SpinnerService.hide()
        let datapagination = results["pagination"];
        this.summaryList = datas;
        if (this.summaryList.length === 0) {
          this.ispaymentpage = false
        }
        if (this.summaryList.length > 0) {
          this.has_paymentnext = datapagination.has_next;
          this.has_paymentprevious = datapagination.has_previous;
          this.paymentpresentpage = datapagination.index;
          this.ispaymentpage = true
        }
      })
  }

  nextClickPayment() {
    if (this.has_paymentnext === true) {
      this.getSummaryList(this.send_value,this.paymentpresentpage + 1)
    }
  }

  previousClickPayment() {
    if (this.has_paymentprevious === true) {
      this.getSummaryList(this.send_value,this.paymentpresentpage - 1)
    }


  }

  send_value:String=""
  getbranchSearch(){

    // if (this.branchcert.value.premise_id != null){
    //   this.premise_Id = this.branchcert.value.premise_id.id
    //   console.log("premise_Id",this.premise_Id)
    //   } else {
    //     this.premise_Id = null;
    //   }
  
    //   if (this.branchcert.value.branch_id != null){
    //   this.branch_Id = this.branchcert.value.branch_id.id
    //   console.log("branch_Id",this.branch_Id)
    //   } else {
    //     this.branch_Id  = null;
    //   }

    // let month= this.datepipe.transform(this.branchcert.value.monthdate,"M");
    // let year= this.datepipe.transform(this.branchcert.value.monthdate,"yyyy")


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

    // this.sgservice.getbranchSearch(val)
    //   .subscribe(result => {
    //     console.log("search->branch", result)
    //     this.summaryList= result['data']
    //   })
    let form_value = this.branchcert.value;

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

    this.getSummaryList(this.send_value,this.paymentpresentpage)

  }


  reset(){
    this.send_value=""
    this.branchcert=this.fb.group({
      monthdate:[''],
      premise_id:[''],
      branch_id:['']
    })
    this.getSummaryList(this.send_value,this.paymentpresentpage);
    // this.getSummaryList();
    // this.branchcert.reset();
  }


  mothfind(month,year){
    return new Date(year,month-1)
    // return this.datepipe.transform(obj, 'dd-MMM-yyyy h:mm')
  }


 
  branchcertification(){
    this.router.navigate(['SGmodule/branch'], { skipLocationChange: true })
  }
  
  summaryView(data){
    this.shareservice.branchData.next(data)
    this.shareservice.key.next(this.fromBranch)
    this.router.navigate(['SGmodule/branchview'], { skipLocationChange: true })
  }
  branchname(){
    let prokeyvalue: String = "";
      this.getbranchid(prokeyvalue);
      this.branchcert.get('branch_id').valueChanges
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
  private getbranchid(prokeyvalue)
  {
    this.sgservice.getbranchdropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaydiss2(branchtype?: branchList): string | undefined {
    return branchtype ? "("+branchtype.code +" )"+branchtype.name : undefined;
    
  }
  premisename(){
    let prokeyvalue: String = "";
      this.getpremiseid(prokeyvalue);
      this.branchcert.get('premise_id').valueChanges
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
          this.premiselistt = datas;
          console.log("product", datas)

        })


  }
  private getpremiseid(prokeyvalue)
  {
    this.sgservice.getpremisedropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiselistt = datas;

      })
  }

  public displaydiss1(producttype?: premiseList): string | undefined {
    return producttype ? "("+producttype.code +" )"+producttype.name : undefined;
    
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
                    this.premiselistt = this.premiselistt.concat(datas);
                    if (this.premiselistt.length >= 0) {
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
