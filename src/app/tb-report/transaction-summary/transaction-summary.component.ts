import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TbReportService } from '../tb-report.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DatePipe, formatDate, registerLocaleData } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import { environment } from "src/environments/environment";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { VertSharedService } from '../vert-shared.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {default as _rollupMoment, Moment} from 'moment';
import * as _moment from 'moment';
import localeEnIN from '@angular/common/locales/en-IN';
import * as XLSX from 'xlsx';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
registerLocaleData(localeEnIN);

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface tb_list{
  glno: any;
  id:number
  name:string
  code:string
  finyer:string
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Component({
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss'],
  providers:[
    { provide: MAT_DATE_FORMATS, useValue: { display: { monthYear: 'MMM, YYYY' } } },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ],
})
export class TransactionSummaryComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('glContactInput')glContactInput:any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  @ViewChild('gl_no')matAutocompletegl:MatAutocomplete;

  maxDate: Date = new Date();
  gltransaction: FormGroup;
  branchList: any;
  has_nextbra: boolean;
  has_previousbra: boolean;
  currentpagebra: number;
  isLoading: boolean;
  finyearList: any;
  has_next: boolean;
  has_previous: boolean;
  currentpage: number;
  presentpage: any;
  GL_data: any;
  data_found: boolean;
  dcflage:any=[{"id":"1","name":"Debit"},{"id":"2","name":"Credit"}]
  totalcount = 0
  gl_List: any;
  has_nextgl: boolean;
  has_previousgl: boolean;
  currentpagegl: number;


  constructor(private fb:FormBuilder ,private datePipe: DatePipe,private errorHandler: ErrorhandlingService, public tbservice: TbReportService , private dataService:TbReportService,private vrtshardserv:VertSharedService,private SpinnerService:NgxSpinnerService,private toastr: ToastrService) {} 

  ngOnInit(): void {
    this.gltransaction=this.fb.group({
      from_date:[],
      to_date:[],
      branch:[],
      drcr:[],
      finyear:[],
      gl_no_id:[],
      Description:[]
    })
  }

  todate_reset_fun(){

  }

  branchname() {

    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    let bran_do = ""
    let branch_flag =2
    this.gltransaction.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.tbservice.getbranchdropdown(value, 1,bran_do,branch_flag)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
   
  
      })
  }
  
  private getbranchid(prokeyvalue) {
    let bran_do = ""
    let branch_flag =2
    this.tbservice.getbranchdropdown(prokeyvalue, 1,bran_do,branch_flag)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
  
      })
  }
  
  autocompletebranchnameScroll() {
    let bran_do = ""
    let branch_flag =2
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
    let isApiCallInProgress = false; 
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
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true && !isApiCallInProgress) {
                isApiCallInProgress = true;
                this.tbservice.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra + 1,bran_do,branch_flag)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                    isApiCallInProgress = false;
                  })
              }
            }
          });
      }
    });
  }
  
  public displayfnbranch(branch?: tb_list): string | undefined {
    return branch ?  branch.code +"-"+  branch.name: undefined;
  
  }

  gltransaction_reset(){
    this.gltransaction.reset()
  }
  gl_summary(pagenumber=1){
    let date=''
    if(this.gltransaction.value.finyear=='' || this.gltransaction.value.finyear== undefined || this.gltransaction.value.finyear==null){
      this.toastr.warning("","Please choose Finyear")
      return false
    }
    if(this.gltransaction.value.from_date=='' || this.gltransaction.value.from_date== undefined || this.gltransaction.value.from_date==null){
      this.toastr.warning("","Please choose From date")
      return false
    }
    if(this.gltransaction.value.to_date=='' || this.gltransaction.value.to_date== undefined || this.gltransaction.value.to_date==null){
      this.toastr.warning("","Please choose To date")
      return false
    }
    let fromdate=this.datePipe.transform(this.gltransaction.value.from_date,'yyyy-MM-dd')
    let todate=this.datePipe.transform(this.gltransaction.value.to_date,'yyyy-MM-dd')
    let search_val={
      "fromdate":fromdate,
      "todate":todate,
      "branch_id":this.gltransaction.value.branch?this.gltransaction.value.branch.id:"",
      "finyear":this.gltransaction.value.finyear?this.gltransaction.value.finyear.finyer:"",
      "d_c_flag":this.gltransaction.value.drcr?this.gltransaction.value.drcr.id:"",
      "subcatunique_no":this.gltransaction.value.gl_no_id?this.gltransaction.value.gl_no_id.microsubcatcode:"",
      "remarks":this.gltransaction.value.Description?this.gltransaction.value.Description:""
    }
    this.SpinnerService.show()
    this.tbservice.gl_statement(search_val,pagenumber).subscribe(results=>{
      this.SpinnerService.hide()
      console.log("results=>",results)
      let data=results['data']
      this.GL_data=data
      let datapagination = results["pagination"];
      if(this.GL_data.length == 0){
        this.data_found=false
        this.has_next = false;
        this.has_previous = false;
        this.presentpage = 1;
      }
  
      if (this.GL_data.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.presentpage = datapagination.index;
        this.data_found=true
        this.totalcount = results.count
      }

    },error=>{
      this.SpinnerService.hide()
    })
  }

  previousClick() {
    if (this.has_previous === true) {
      this.gl_summary(this.presentpage - 1);
    }
  }
  nextClick() { 
    if (this.has_next === true) {
      this.gl_summary(this.presentpage + 1)
    }
  }


  finyear_dropdown(){
    let prokeyvalue: String = "";
      this.getfinyear(prokeyvalue);
      this.gltransaction.get('finyear').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getfinyeardropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.finyearList = datas;
  
        })
  }
  
  @ViewChild('finyearInput')finyearInput:any;
  @ViewChild('fin_year')fin_yearauto:MatAutocomplete
  autocompletefinyearScroll(){
    this.has_next=true;
  this.has_previous=true;
  this.currentpage=1;
    setTimeout(() => {
      if (
        this.fin_yearauto &&
        this.autocompleteTrigger &&
        this.fin_yearauto.panel
      ) {
        fromEvent(this.fin_yearauto.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.fin_yearauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.fin_yearauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.fin_yearauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.fin_yearauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getfinyeardropdown(this.finyearInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.finyearList = this.finyearList.concat(datas);
                    if (this.finyearList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  
  private getfinyear(prokeyvalue){
    this.dataService.getfinyeardropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
  
      })
  }
  public displayfnfinyear(fin_year?: tb_list): string | undefined {
    return fin_year ? fin_year.finyer : undefined;
    
  }
  todate_fun(){
    this.gltransaction.controls['to_date'].reset('')
  }


  backend_download(){
    let date=''
    if(this.gltransaction.value.finyear=='' || this.gltransaction.value.finyear== undefined || this.gltransaction.value.finyear==null){
      this.toastr.warning("","Please choose Finyear")
      return false
    }
    if(this.gltransaction.value.from_date=='' || this.gltransaction.value.from_date== undefined || this.gltransaction.value.from_date==null){
      this.toastr.warning("","Please choose From date")
      return false
    }
    if(this.gltransaction.value.to_date=='' || this.gltransaction.value.to_date== undefined || this.gltransaction.value.to_date==null){
      this.toastr.warning("","Please choose To date")
      return false
    }
    let fromdate=this.datePipe.transform(this.gltransaction.value.from_date,'yyyy-MM-dd')
    let todate=this.datePipe.transform(this.gltransaction.value.to_date,'yyyy-MM-dd')
    let search_val={
      "fromdate":fromdate,
      "todate":todate,
      "branch_id":this.gltransaction.value.branch?this.gltransaction.value.branch.id:"",
      "finyear":this.gltransaction.value.finyear?this.gltransaction.value.finyear.finyer:"",
      "d_c_flag":this.gltransaction.value.drcr?this.gltransaction.value.drcr.id:"",
      "subcatunique_no":this.gltransaction.value.gl_no_id?this.gltransaction.value.gl_no_id.microsubcatcode:"",
      "remarks":this.gltransaction.value.Description?this.gltransaction.value.Description:""
    }
  this.SpinnerService.show()
    this.dataService.gl_statement_download(search_val).subscribe((results: any) => {
      this.SpinnerService.hide()
      console.log("results",results)
      if(results.status==="Success"){
        this.toastr.success("", 'File Generate Start...', { timeOut: 1500 })
      }else{
        this.toastr.warning(results)
      }
    })
  }

gl_number() {
  let prokeyvalue: String = "";
  this.getglid(prokeyvalue);
  this.gltransaction.get('gl_no_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.tbservice.tb_gl_master_api(value, 1,"","gl")
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.gl_List = datas;
 

    })
}

private getglid(prokeyvalue) {
  this.tbservice.tb_gl_master_api(prokeyvalue, 1,"","gl")
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.gl_List = datas;

    })
}

autocompleteglnameScroll() {
  this.has_nextgl = true
  this.has_previousgl = true
  this.currentpagegl = 1
  let isApiCallInProgress = false;
  setTimeout(() => {
    if (
      this.matAutocompletegl &&
      this.autocompleteTrigger &&
      this.matAutocompletegl.panel
    ) {
      fromEvent(this.matAutocompletegl.panel.nativeElement, 'scroll')
        .pipe(
          map(() => this.matAutocompletegl.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(() => {
          const scrollTop = this.matAutocompletegl.panel.nativeElement.scrollTop;
          const scrollHeight = this.matAutocompletegl.panel.nativeElement.scrollHeight;
          const elementHeight = this.matAutocompletegl.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextgl === true && !isApiCallInProgress) {
              isApiCallInProgress = true;
              this.tbservice.tb_gl_master_api(this.glContactInput.nativeElement.value, this.currentpagegl + 1,"","gl")
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.gl_List = this.gl_List.concat(datas);
                  if (this.gl_List.length >= 0) {
                    this.has_nextgl = datapagination.has_next;
                    this.has_previousgl = datapagination.has_previous;
                    this.currentpagegl = datapagination.index;
                  }
                  isApiCallInProgress = false;
                })
            }
          }
        });
    }
  });
}

public displayfngl(gl?: tb_list): string | undefined {
  return gl ? gl.glno +"-"+gl.name: undefined;

}

}
