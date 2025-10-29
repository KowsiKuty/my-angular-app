import { Component, OnInit, ViewChild, ElementRef, LOCALE_ID } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { DrsService } from "../drs.service";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { ErrorhandlingService } from "src/app/ppr/errorhandling.service";
import * as XLSX from 'xlsx';
import { SharedDrsService } from "../shared-drs.service";
import * as html2pdf from 'html2pdf.js';
import { Router } from "@angular/router";
import { saveAs } from 'file-saver';
import jsPDF from "jspdf";
import { fromEvent } from 'rxjs';
import ExcelJS from 'exceljs';
// import { DecimalPipe } from "@angular/common";
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, debounce, skip } from 'rxjs/operators';
import { registerLocaleData } from '@angular/common';
import localeEnIN from '@angular/common/locales/en-IN';
import { forkJoin } from "rxjs";
import { PprService } from "src/app/ppr/ppr.service";

registerLocaleData(localeEnIN);

export interface drs {

  name: string;
  code: number;

}

@Component({
  selector: 'app-drs-summary-template',
  templateUrl: './drs-summary-template.component.html',
  styleUrls: ['./drs-summary-template.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-IN' }
  ]
})
export class DrsSummaryTemplateComponent implements OnInit {
  public myMath = Math;

  YES = 'YES';
  NO = 'NO';

  @ViewChild('preformattedDiv', { static: false }) pdfContent: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('StageContactInput') StageContactInput: any;
  @ViewChild('stagesum') matAutocompletestage: MatAutocomplete;

  report_data: any;
  showLeftArrow: boolean = true;
  report_data_name: any;
  templatesummary: FormGroup;
  endDate: any;
  peryear: string;
  preyearrecord: any;
  curDate: string;
  preheader: boolean = false;
  pretable: boolean = false;
  amount: string[];
  YearLength=[]
  QuarterlyLength=[]
  HalfYearLength=[]
  amountinvalue: any;
  templatemodal: FormGroup;
  monthdata: any;
  monthcondition: boolean = false;
  @ViewChild('myModal') myModal: ElementRef
  @ViewChild('report_group_close') report_group_close: ElementRef;
  @ViewChild('Audit_return_close')Audit_return_close;
  modaldate: string;
  numcon: number = 0;
  monthcondition2: boolean = false;
  monthdata2: any;
  monthdata3: any;
  monthcondition3: boolean = false;
  sub_childs1:any
  add: boolean = true;
  modaldate1: string;
  modaldate2: string;
  modaldate3: string;
  Schedulermaster: any;
  SchedulermasterQuarter:any={}
  SchedulermasterQuarterChild:any={}
  SchedulermasterQuarterChildSecond:any={}
  Schedulermaster1:any;
  ReportName:any
  openpopup: boolean = false
  template: any[] = [];
  templatename: any;
  child: any;
  child1:any;
  highlightedIndex: number = -1;
  highlightedIndex1: number = -1;
  template1: any[] = [];
  highlightedIndexFirstRow: number = -1;
  highlightedIndexSecondRow: number = -1;
  drsschdular: boolean = false;
  drssummary: boolean = false;
  tempsummary: boolean = true;
  downloadbtn: boolean = false;
  Expand_schedule: boolean;
  isLoading: boolean;
  Stage_list_: any;
  has_nextbra: boolean;
  has_previousbra: boolean;
  currentpagebra: number;
  has_next: boolean;
  has_previous: boolean;
  currentpage: number;
  stage: any;
  report_datas: any;
  report_data_extand: any;
  stagedownload: any;
  parms: any;
  Stage_minus: any;
  Flag_boolean: boolean;
  QuarterData:any={}
  Flag_booleans: boolean;
  sub_childs: any;
  allSubChilds: any;
  finyear: string;
  month_date: string;
  mon_finyear: string;
  pre_finyear: string;
  peryears: string;
  finyears: string;
  pre_finyears: string;
  finyearss: string;
  pre_finyearss: string;
  expandedItemId: any;
  expandedItemIdQuarter: any;
  disablestage = false
  // lineheader: boolean= false;
  drs_summary_file:FormGroup;
  finyearList=[]
  pdffile: boolean = false;
  excels: boolean= false;
  ViewFullData:any
  QuarterDropData=['Quarter 1','Quarter 2','Quarter 3','Quarter 4']

  constructor(private elementRef: ElementRef, private errorHandler: ErrorhandlingService, private fb: FormBuilder, private drsService: DrsService, private SpinnerService: NgxSpinnerService, private toastr: ToastrService, public datepipe: DatePipe, private drsservice: SharedDrsService, private router: Router,private dataService:PprService) { }
  ngOnInit(): void {
    this.drsservice.isSideNav = true;
    document.getElementById("mySidenav").style.width = "50px";
    document.getElementById("main").style.marginLeft = "40px";
    document.getElementById("main").style.transition = "margin-left 0.5s";
    this.templatesummary = this.fb.group({
      date: '',
      amount: '',
      stage: '',
      ischeck:'true',
      quarter:'',
      finyear:''
    }),
      this.templatemodal = this.fb.group({
        modaldate: ''
      })
    this.templatesummary.get('ischeck')?.valueChanges.subscribe(checked => {
    if (checked) {
      this.is_checked = true
      this.templatesummary.controls['stage'].reset()
    } else {
       this.is_checked = false
       this.templatesummary.controls['stage'].reset()
    }
  });
    this.drs_summary_file=this.fb.group({
      remarks:''
    })
    const currentDate = new Date();
    this.endDate = new Date(currentDate.getTime() - 0 * 24 * 60 * 60 * 1000);
    this.report_data_name = this.drsservice.View_name.value
    this.ViewFullData=this.drsservice.ViewFullData.value

    if (this.templatesummary.controls["amount"].value == "") {
      this.templatesummary.patchValue({
        "amount": 'Crore',
      })

    }
  }

  public displaystage(stage?: drs): string | undefined {
    return stage ? stage.name : undefined;
  }
  is_checked = true;
  SeachFunction(data){
    if(!this.ViewFullData?.Quarter){
      this.template_summary(data)
    }
    else{
      this.QuarterSummary()
    }
    
  }
  template_summary(data) {
    if (!data.date) {
      this.toastr.warning("", "Please choose Date");
      return;
    }
    if(!this.is_checked && (data?.stage == ""|| data?.stage == null || data?.stage == undefined)){
    this.showLeftArrow = data.stage && data.stage.id !== 99 ? true : false;
    this.amountinvalue = data.amount ? data.amount : "Crore";
  
    this.curDate = this.datepipe.transform(data.date, "yyyy-MM-dd");
    this.finyear = this.convertToFinancialYear(this.curDate); // Convert to FY format
    this.peryear = this.convertToFinancialYear(this.curDate); // Get previous year date
    let yearRange = this.finyear;
          let formattedFY = `FY${yearRange.slice(2, 4)}-${yearRange.slice(7, 9)}`;
    console.log("Formated Fin-Year",formattedFY);
    this.finyear= formattedFY
  
    let master_id = this.drsservice.View_values.value;
    let flags_in = this.drsservice.schedule_flag.value;
    
    this.Flag_boolean = flags_in === 0;
    this.Flag_booleans = !this.Flag_boolean;
  
    this.stage = this.templatesummary.controls["stage"].value;
    const parts = this.curDate.split("-");
        const year = parseInt(parts[0]);
        const month = parts[1];
        const day = parts[2];
        const newYear = year - 1;
        this.peryear = newYear + '-' + month + '-' + day
  
    // this.pre_finyear = this.convertToFinancialYear(this.finyear); // Get previous FY
    const years = this.finyear.match(/\d+/g); // Extract numbers
          if (years && years.length === 2) {
            const startYear = +years[0] - 1;
            const endYear = +years[1] - 1;
            this.pre_finyear = `FY${startYear}-${endYear}`;
          }
    
          console.log("Previous fin-year:",this.pre_finyear); 
            let stage_id
          if(this.templatesummary.controls["stage"].value.id == 99){
            stage_id=-1
          }else{
            stage_id=this.templatesummary.controls["stage"].value.id
          }
       let check_box_value
          if(this.templatesummary.controls["stage"].value?.id == 99){
            check_box_value = 2
          }else if(this.templatesummary.controls["stage"].value?.id){
          check_box_value = 2
          }else{
          check_box_value = 1
          }
  
    const currentYearParams = {
      "finyear": this.finyear,
      "reportmaster_id": master_id,
      "fis_mis_date": this.curDate || '',
      "div_amount": this.amountinvalue,
      "stage": stage_id,
      "check_box":check_box_value
    };
  
    const previousYearParams = {
      "finyear": this.pre_finyear,
      "reportmaster_id": master_id,
      "fis_mis_date": this.peryear,
      "div_amount": this.amountinvalue,
      "stage": stage_id,
      "check_box":check_box_value
    };
  
    this.SpinnerService.show();
  
    forkJoin({
      currentYearData: this.drsService.total_summary(currentYearParams),
      previousYearData: this.drsService.total_summary(previousYearParams)
    }).subscribe({ 
      next: ({ currentYearData, previousYearData }) => {
        this.downloadbtn = true;
        this.preheader = true;
        this.pretable = true;
    
        this.report_data = currentYearData?.["data"] || [];
        this.preyearrecord = previousYearData?.["data"] || [];
    
        console.log("Total Current Year Amount:", this.report_data);
        console.log("Total Previous Year Amount:", this.preyearrecord);
    
        this.report_data_name = this.drsservice.View_name.value;
        this.Expand_schedule = false;
        this.rtb_summary()
      },
      error: (error) => {
        console.error("API Error:", error);
        this.toastr.error("Failed to fetch data. Please try again.");
        this.SpinnerService.hide();
        this.rtb_summary()

      },
      complete: () => {
        this.SpinnerService.hide();
      }
    });
  }
  else if(!this.is_checked && (data?.stage != ""|| data?.stage != null || data?.stage != undefined)) {
     this.showLeftArrow = data.stage && data.stage.id !== 99 ? true : false;
    this.amountinvalue = data.amount ? data.amount : "Crore";
  
    this.curDate = this.datepipe.transform(data.date, "yyyy-MM-dd");
    this.finyear = this.convertToFinancialYear(this.curDate); // Convert to FY format
    this.peryear = this.convertToFinancialYear(this.curDate); // Get previous year date
    let yearRange = this.finyear;
          let formattedFY = `FY${yearRange.slice(2, 4)}-${yearRange.slice(7, 9)}`;
    console.log("Formated Fin-Year",formattedFY);
    this.finyear= formattedFY
  
    let master_id = this.drsservice.View_values.value;
    let flags_in = this.drsservice.schedule_flag.value;
    
    this.Flag_boolean = flags_in === 0;
    this.Flag_booleans = !this.Flag_boolean;
  
    this.stage = this.templatesummary.controls["stage"].value;
    const parts = this.curDate.split("-");
        const year = parseInt(parts[0]);
        const month = parts[1];
        const day = parts[2];
        const newYear = year - 1;
        this.peryear = newYear + '-' + month + '-' + day
  
    // this.pre_finyear = this.convertToFinancialYear(this.finyear); // Get previous FY
    const years = this.finyear.match(/\d+/g); // Extract numbers
          if (years && years.length === 2) {
            const startYear = +years[0] - 1;
            const endYear = +years[1] - 1;
            this.pre_finyear = `FY${startYear}-${endYear}`;
          }
    
          console.log("Previous fin-year:",this.pre_finyear); 
           let stage_id
          if(data.stage?.id == 99){
            stage_id=-1
          }else{
            stage_id=data.stage?.id
          }
          let check_box_value
          if(this.templatesummary.controls["stage"].value?.id == 99){
            check_box_value = 2
          }else if(this.templatesummary.controls["stage"].value?.id){
          check_box_value = 2
          }else{
          check_box_value = 1
          }
  
    const currentYearParams = {
      "finyear": this.finyear,
      "reportmaster_id": master_id,
      "fis_mis_date": this.curDate || '',
      "div_amount": this.amountinvalue,
      "stage": stage_id,
      "check_box":check_box_value
    };
  
    const previousYearParams = {
      "finyear": this.pre_finyear,
      "reportmaster_id": master_id,
      "fis_mis_date": this.peryear,
      "div_amount": this.amountinvalue,
      "stage": stage_id,
      "check_box":check_box_value
    };
  
    this.SpinnerService.show();
  
    forkJoin({
      currentYearData: this.drsService.total_summary(currentYearParams),
      previousYearData: this.drsService.total_summary(previousYearParams)
    }).subscribe({ 
      next: ({ currentYearData, previousYearData }) => {
        this.downloadbtn = true;
        this.preheader = true;
        this.pretable = true;
    
        this.report_data = currentYearData?.["data"] || [];
        this.preyearrecord = previousYearData?.["data"] || [];
    
        console.log("Total Current Year Amount:", this.report_data);
        console.log("Total Previous Year Amount:", this.preyearrecord);
    
        this.report_data_name = this.drsservice.View_name.value;
        this.Expand_schedule = false;
        this.Expand2_summary()
      },
      error: (error) => {
        console.error("API Error:", error);
        this.toastr.error("Failed to fetch data. Please try again.");
        this.SpinnerService.hide();
        this.Expand2_summary()

      },
      complete: () => {
        this.SpinnerService.hide();
      }
    });
  }
  else if(this.is_checked){
    this.showLeftArrow = data.stage && data.stage.id !== 99 ? true : false;
    this.amountinvalue = data.amount ? data.amount : "Crore";
  
    this.curDate = this.datepipe.transform(data.date, "yyyy-MM-dd");
    this.finyear = this.convertToFinancialYear(this.curDate); // Convert to FY format
    this.peryear = this.convertToFinancialYear(this.curDate); // Get previous year date
    let yearRange = this.finyear;
          let formattedFY = `FY${yearRange.slice(2, 4)}-${yearRange.slice(7, 9)}`;
    console.log("Formated Fin-Year",formattedFY);
    this.finyear= formattedFY
  
    let master_id = this.drsservice.View_values.value;
    let flags_in = this.drsservice.schedule_flag.value;
    
    this.Flag_boolean = flags_in === 0;
    this.Flag_booleans = !this.Flag_boolean;
  
    this.stage = this.templatesummary.controls["stage"].value;
    const parts = this.curDate.split("-");
        const year = parseInt(parts[0]);
        const month = parts[1];
        const day = parts[2];
        const newYear = year - 1;
        this.peryear = newYear + '-' + month + '-' + day
  
    // this.pre_finyear = this.convertToFinancialYear(this.finyear); // Get previous FY
    const years = this.finyear.match(/\d+/g); // Extract numbers
          if (years && years.length === 2) {
            const startYear = +years[0] - 1;
            const endYear = +years[1] - 1;
            this.pre_finyear = `FY${startYear}-${endYear}`;
          }
    
          console.log("Previous fin-year:",this.pre_finyear); 
          let stage_id
          if(data.stage?.id == 99){
            stage_id=-1
          }else{
            stage_id=data.stage?.id
          }
          let check_box_value
          if(this.templatesummary.controls["stage"].value?.id == 99){
            check_box_value = 2
          }else if(this.templatesummary.controls["stage"].value?.id){
          check_box_value = 2
          }else{
          check_box_value = 1
          }
  
    const currentYearParams = {
      "finyear": this.finyear,
      "reportmaster_id": master_id,
      "fis_mis_date": this.curDate || '',
      "div_amount": this.amountinvalue,
      "stage": stage_id,
      "check_box":check_box_value
    };
  
    const previousYearParams = {
      "finyear": this.pre_finyear,
      "reportmaster_id": master_id,
      "fis_mis_date": this.peryear,
      "div_amount": this.amountinvalue,
      "stage": stage_id,
      "check_box":check_box_value
    };
  
    this.SpinnerService.show();
  
    forkJoin({
      currentYearData: this.drsService.total_summary(currentYearParams),
      previousYearData: this.drsService.total_summary(previousYearParams)
    }).subscribe({ 
      next: ({ currentYearData, previousYearData }) => {
        this.downloadbtn = true;
        this.preheader = true;
        this.pretable = true;
    
        this.report_data = currentYearData?.["data"] || [];
        this.preyearrecord = previousYearData?.["data"] || [];
    
        console.log("Total Current Year Amount:", this.report_data);
        console.log("Total Previous Year Amount:", this.preyearrecord);
    
        this.report_data_name = this.drsservice.View_name.value;
        this.Expand_schedule = false;
        // this.rtb_summary()
      },
      error: (error) => {
        console.error("API Error:", error);
        this.toastr.error("Failed to fetch data. Please try again.");
        this.SpinnerService.hide();
        // this.rtb_summary()

      },
      complete: () => {
        this.SpinnerService.hide();
      }
    });
  }
  else{
    console.log("else")
  }
  console.log('flagbool',this.Flag_booleans)
if(this.templatesummary.controls["stage"].value.id == 99){
  this.Expand_summary(this.templatesummary.value)
}
  
  }
  showaudittotal = false;
  rtbreport_data:any
  rtb_summary(){
    let data = this.templatesummary.value
     this.showLeftArrow = data.stage && data.stage.id !== 99 ? true : false;
    this.amountinvalue = data.amount ? data.amount : "Crore";
  
    this.curDate = this.datepipe.transform(data.date, "yyyy-MM-dd");
    this.finyear = this.convertToFinancialYear(this.curDate); // Convert to FY format
    this.peryear = this.convertToFinancialYear(this.curDate); // Get previous year date
    let yearRange = this.finyear;
          let formattedFY = `FY${yearRange.slice(2, 4)}-${yearRange.slice(7, 9)}`;
    console.log("Formated Fin-Year",formattedFY);
    this.finyear= formattedFY
  
    let master_id = this.drsservice.View_values.value;
    let flags_in = this.drsservice.schedule_flag.value;
    
    this.Flag_boolean = flags_in === 0;
    this.Flag_booleans = !this.Flag_boolean;
  
    this.stage = this.templatesummary.controls["stage"].value;
    const parts = this.curDate.split("-");
        const year = parseInt(parts[0]);
        const month = parts[1];
        const day = parts[2];
        const newYear = year - 1;
        this.peryear = newYear + '-' + month + '-' + day
  
    // this.pre_finyear = this.convertToFinancialYear(this.finyear); // Get previous FY
    const years = this.finyear.match(/\d+/g); // Extract numbers
          if (years && years.length === 2) {
            const startYear = +years[0] - 1;
            const endYear = +years[1] - 1;
            this.pre_finyear = `FY${startYear}-${endYear}`;
          }
           let stage_id
          if(this.templatesummary.controls["stage"].value.id == 99){
            stage_id=-1
          }else{
            stage_id=this.templatesummary.controls["stage"].value.id
          }
          let check_box_value
          if(this.templatesummary.controls["stage"].value?.id == 99){
            check_box_value = 2
          }else if(this.templatesummary.controls["stage"].value?.id){
          check_box_value = 2
          }else{
          check_box_value = 1
          }
    
          console.log("Previous fin-year:",this.pre_finyear); 
    let payload ={"finyear": this.pre_finyear,
      "reportmaster_id": master_id,
      "fis_mis_date": this.peryear,
      "div_amount": this.amountinvalue,
      "stage": stage_id,
    }
    this.SpinnerService.show()
    this.drsService.rtb_summary(payload).subscribe({
      next:({data})=>{
         this.rtbreport_data = data
         this.showaudittotal = true
      },
      error:(error)=>{
        console.log(error)
        this.toastr.error(error)
      },
      complete:()=>{
        this.SpinnerService.hide()
      }
    })
  }

//   template_summary(data) {
//     if (data.date == null || data.date == undefined || data.date == "") {
//       this.toastr.warning("", "Please choose Date")
//       return false
//     }
//     if (data.stage == null || data.stage == undefined || data.stage == "") {
//       this.showLeftArrow = false;
//       // this.toastr.warning("","Please Select Stage")
//       // return false
//     } else {
//       this.showLeftArrow = true;

//     }
//     if (data.amount == "" || data.amount == null || data.amount == undefined) {
//       this.amountinvalue = "Crore"
//     } else {
//       this.amountinvalue = data.amount
//     }
//     // this.Stage_minus= this.templatesummary.,
//     this.curDate = this.datepipe.transform(data.date, "yyyy-MM-dd")
//     const financialYear = this.convertToFinancialYear(this.curDate);
//       console.log("Year calculate",financialYear)
//       let yearRange = financialYear;
//       let formattedFY = `FY${yearRange.slice(2, 4)}-${yearRange.slice(7, 9)}`;
// console.log("Formated Fin-Year",formattedFY);
// this.finyear= formattedFY
//     const parts = this.curDate.split("-");
//     const year = parseInt(parts[0]);
//     const month = parts[1];
//     const day = parts[2];
//     const newYear = year - 1;
//     this.peryear = newYear + '-' + month + '-' + day
//     let master_id = this.drsservice.View_values.value
//     let flags_in = this.drsservice.schedule_flag.value
//     console.log("Flag_check=>",flags_in)
//     if(flags_in==0){
//       this.Flag_boolean= true
//       this.Flag_booleans= false
//     }else{
//       this.Flag_boolean= false
//       this.Flag_booleans= true

//     }
//     this.stage = this.templatesummary.controls["stage"].value
//     if (data.stage == null || data.stage == "" || data.stage == undefined) {
//       this.parms = {
//         "finyear": this.finyear,
//         "reportmaster_id": master_id,
//         "fis_mis_date": this.curDate ? this.curDate : '',
//         "div_amount": this.amountinvalue,
//         "stage": -1,
//       }

//     } else {
//       this.parms = {
//         "finyear": this.finyear,
//         "reportmaster_id": master_id,
//         "fis_mis_date": this.curDate ? this.curDate : '',
//         "div_amount": this.amountinvalue,
//         "stage": this.stage?.id ?? '',
//       }

//     }

//     this.SpinnerService.show()
//     this.drsService.total_summary(this.parms).subscribe((results: any) => {
//       // this.SpinnerService.hide()
//       this.downloadbtn = true
//       this.preheader = true
//       this.pretable = true
//       this.report_data = results["data"]
//       console.log("Total Current Amount:", this.report_data)
//       this.report_data_name = this.drsservice.View_name.value
//       this.preyear()
//       this.Expand_schedule = false
//       // this.template_summary("")
//     });
//   }

//   preyear() {
    
//     let master_id = this.drsservice.View_values.value
//     let flags_in = this.drsservice.schedule_flag.value
//     console.log("Flag_check=>",flags_in)
//     if(flags_in==0){
//       let flag= 0
//       this.Flag_booleans= false
//     }else{
//       let flag= 1
//       this.Flag_boolean= false
//       this.Flag_booleans= true

//     }
//     // this.finyear = "FY24-25"; // Example input

//       const years = this.finyear.match(/\d+/g); // Extract numbers
//       if (years && years.length === 2) {
//         const startYear = +years[0] - 1;
//         const endYear = +years[1] - 1;
//         this.pre_finyear = `FY${startYear}-${endYear}`;
//       }

//       console.log("Previous fin-year:",this.pre_finyear); 

//     if (this.stage == "" || this.stage == null || this.stage == undefined) {
//       this.parms = {
//         "finyear": this.pre_finyear,
//         "reportmaster_id": master_id,
//         "fis_mis_date": this.peryear,
//         "div_amount": this.amountinvalue,
//         "stage": -1,
//       }

//     } else {
//       this.parms = {
//         "finyear": this.pre_finyear,
//         "reportmaster_id": master_id,
//         "fis_mis_date": this.peryear,
//         "div_amount": this.amountinvalue,
//         "stage": this.stage?.id ?? '',
//       }
//     }

//     // let parms = {
//     //   "reportmaster_id":master_id,
//     //   "fis_mis_date":this.peryear,
//     //   "div_amount":this.amountinvalue,
//     //   "stage": this.stage?.id?? '',
//     //   }
//     // this.SpinnerService.show()
//     this.drsService.total_summary(this.parms).subscribe((results: any) => {
//       this.SpinnerService.hide()
//       this.preyearrecord = results["data"]
//       console.log("Total Previous Year  Amount:", this.preyearrecord)
//     });

//   }

  convertToFinancialYear(dateStr: string): string {
    const selectedDate = new Date(dateStr);
  
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
  
    const startYear = month < 4 ? year - 1 : year;
    const endYear = startYear + 1;
  
    
    return `${startYear}-${endYear}`;
   
  }
  Expand_summary(data) {
    if (this.Expand_schedule == true) {
      this.Expand_schedule = false
      return false
    } else {
      if (this.templatesummary.controls["date"].value == null || this.templatesummary.controls["date"].value == undefined || this.templatesummary.controls["date"].value == "") {
        this.toastr.warning("", "Please choose Date")
        return false
      }
      if (this.templatesummary.controls["amount"].value == "" || this.templatesummary.controls["amount"].value == null || this.templatesummary.controls["amount"].value == undefined) {
        this.amountinvalue = "Crore"
      } else {
        this.amountinvalue = this.templatesummary.controls["amount"].value
      }
      this.stage = this.templatesummary.controls["stage"].value
      this.curDate = this.datepipe.transform(this.templatesummary.controls["date"].value, "yyyy-MM-dd")
      
      const parts = this.curDate.split("-");
      const year = parseInt(parts[0]);
      const month = parts[1];
      const day = parts[2];
      const newYear = year - 1;
      this.peryear = newYear + '-' + month + '-' + day
      let master_id = this.drsservice.View_values.value
      let stage_id
          if(this.templatesummary.controls["stage"].value.id == 99){
            stage_id=-1
          }else{
            stage_id=this.templatesummary.controls["stage"].value.id
          }
      let parms = {
        "finyear": this.finyear,
        "reportmaster_id": master_id,
        "fis_mis_date": this.curDate ? this.curDate : '',
        "div_amount": this.amountinvalue,
        "stage": stage_id,
      }
      this.SpinnerService.show()
      this.drsService.audit_col_summary(parms).subscribe((results: any) => {
        this.downloadbtn = true
        this.preheader = true
        this.pretable = true
        this.report_datas = results["data"]
        console.log("Audit Amount :", this.report_datas)
        this.report_data_name = this.drsservice.View_name.value
        this.Expand_schedule = true
      });
      this.Expand2_summary()

    }


  }
  Expand2_summary() {
    if (this.templatesummary.controls["date"].value == null || this.templatesummary.controls["date"].value == undefined || this.templatesummary.controls["date"].value == "") {
      this.toastr.warning("", "Please choose Date")
      return false
    }
    if (this.templatesummary.controls["amount"].value == "" || this.templatesummary.controls["amount"].value == null || this.templatesummary.controls["amount"].value == undefined) {
      this.amountinvalue = "Crore"
    } else {
      this.amountinvalue = this.templatesummary.controls["amount"].value
    }
    this.stage = this.templatesummary.controls["stage"].value
    this.curDate = this.datepipe.transform(this.templatesummary.controls["date"].value, "yyyy-MM-dd")
    const parts = this.curDate.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1];
    const day = parts[2];
    const newYear = year - 1;
    this.peryear = newYear + '-' + month + '-' + day
    let master_id = this.drsservice.View_values.value
     let stage_id
          if(this.templatesummary.controls["stage"].value.id == 99){
            stage_id=-1
          }else{
            stage_id=this.templatesummary.controls["stage"].value.id
          }
           let parms 

            if(this.templatesummary.controls["stage"].value.id == 99){
parms = {
      "finyear": this.finyear,
      "reportmaster_id": master_id,
      "fis_mis_date":this.curDate,
      "div_amount": this.amountinvalue,
      "stage": stage_id ?? '',
      "check_box":1
    }
            }else{
              parms = {
      "finyear": this.finyear,
      "reportmaster_id": master_id,
      "fis_mis_date":this.curDate,
      "div_amount": this.amountinvalue,
      "stage": stage_id ?? '',
    }
            }
  

    this.SpinnerService.show()
    this.drsService.drs_summary(parms,this.templatesummary.controls["stage"].value?.id).subscribe((results: any) => {
      this.SpinnerService.hide()
      this.downloadbtn = true
      this.preheader = true
      this.pretable = true
      this.showaudittotal = false
      this.report_data_extand = results["data"]
      console.log("Common Amount :", this.report_data_extand)
      this.report_data_name = this.drsservice.View_name.value
      this.Expand_schedule = true
    });

  }

  downloadPDF() {
    let pdf = new jsPDF('p', 'pt', 'a4');

    pdf.html(this.pdfContent.nativeElement, {
      callback: (pdf) => {
        pdf.save(this.report_data_name + ".pdf");
      },
      html2canvas: {
        scale: 0.5,
        // Add other options if necessary
      },
      margin: [7, 10, 0, 10], // Adjust margins as an array
    });
  }





  month_summary(data) {
    if (this.templatemodal.controls["modaldate"].value == null || this.templatemodal.controls["modaldate"].value == "") {
      this.toastr.warning("Please Choose The Date")
      return false
    }
    let master_id = this.drsservice.View_values.value
    this.modaldate = this.datepipe.transform(data.modaldate, "yyyy-MM-dd")
    this.month_date= this.modaldate
    const financialYear = this.convertToFinancialYear(this.month_date);
    console.log("Year calculate for Month:",financialYear)
    let yearRange = financialYear;
    let formattedFY = `FY${yearRange.slice(2, 4)}-${yearRange.slice(7, 9)}`;
    console.log("Formated Fin-Year",formattedFY);
    this.mon_finyear= formattedFY
    let parms = {
      "finyear": this.mon_finyear,
      "reportmaster_id": master_id,
      "fis_mis_date": this.modaldate,
      "div_amount": this.amountinvalue
    }
    this.SpinnerService.show()
    this.drsService.drs_summary(parms,"").subscribe((results: any) => {
      this.SpinnerService.hide()
      if (this.numcon == 0) {
        this.modaldate1 = this.datepipe.transform(data.modaldate, "yyyy-MM-dd")
        this.monthcondition = true
        this.monthdata = results["data"]
        this.templatemodal.reset()
        this.report_group_close.nativeElement.click();
        this.numcon = 2
        return false
      }
      if (this.numcon == 2) {
        this.modaldate2 = this.datepipe.transform(data.modaldate, "yyyy-MM-dd")
        this.monthcondition2 = true
        this.monthdata2 = results["data"]
        this.templatemodal.reset()
        this.report_group_close.nativeElement.click();
        this.numcon = 3
        return false
      }
      if (this.numcon == 3) {
        this.modaldate3 = this.datepipe.transform(data.modaldate, "yyyy-MM-dd")
        this.monthcondition3 = true
        this.monthdata3 = results["data"]
        this.templatemodal.reset()
        this.report_group_close.nativeElement.click();
        this.numcon = null
        this.add = false
        return false
      }

    })
  }

  amountdrop() {
    this.amount = ["Hundred", "Thousand", "Lakhs", "Crore", "Absolute amount"]

  }
  Stagedrop() {
   
    let flag = 3

    let prokeyvalue: String = "";
     if ( this.templatesummary.value.date == null ||  this.templatesummary.value.date == "" ||  this.templatesummary.value.date == undefined) {
      this.toastr.warning("Please Choose The Date")
      return false
    }
   
 this.SpinnerService.show()
    let date = this.datepipe.transform(this.templatesummary.value.date, "yyyy-MM-dd")
    this.get_template_stage_drop(prokeyvalue, flag);
    this.templatesummary.get('stage').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),

        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.drsService.Stage_drops(value, 1, flag,date)
          .pipe(
            finalize(() => {
              console.log(value)

            }),
          )
        )
      )
      .subscribe((results: any) => {
        this.SpinnerService.hide()
        let stage_value = results["data"]
        this.Stage_list_ = stage_value;
        console.log("report_create_dropdown", this.Stage_list_)
        this.isLoading = false
      })

  }
  private get_template_stage_drop(prokeyvalue, flag) {
    
      if ( this.templatesummary.value.date == null ||  this.templatesummary.value.date == "" ||  this.templatesummary.value.date == undefined) {
      this.toastr.warning("Please Choose The Date")
      return false
    }
    this.SpinnerService.show()
     let date = this.datepipe.transform(this.templatesummary.value.date, "yyyy-MM-dd")
    this.drsService.Stage_drops(prokeyvalue, 1, flag,date)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let stage_value = results["data"];
        this.Stage_list_ = stage_value;
      })

  }

  autocompleteStageScroll() {
    let flag = 3
    this.has_next = true
    this.has_previous = true
    this.currentpage = 1
      if ( this.templatesummary.value.date == null ||  this.templatesummary.value.date == "" ||  this.templatesummary.value.date == undefined) {
      this.toastr.warning("Please Choose The Date")
      return false
    }
     let date = this.datepipe.transform(this.templatesummary.value.date, "yyyy-MM-dd")
    setTimeout(() => {
      if (
        this.matAutocompletestage &&
        this.autocompleteTrigger &&
        this.matAutocompletestage.panel
      ) {
        fromEvent(this.matAutocompletestage.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletestage.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletestage.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletestage.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletestage.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.drsService.Stage_drops(this.StageContactInput.nativeElement.value, this.currentpage + 1, flag,date)
                  .subscribe((results: any[]) => {
                    let stage_value = results["data"];
                    let datapagination = results["pagination"];
                    this.Stage_list_ = this.Stage_list_.concat(stage_value);
                    if (this.Stage_list_.length >= 0) {
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
  backtosummary() {
    this.drsschdular = true;
    this.drssummary = true;
    this.tempsummary = false;
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "12rem";
    this.drsservice.isSideNav = false;
    this.downloadbtn = false
  }

  downloadExcel(): void {
    const content = document.querySelector('.preformatted');
    const header = document.querySelector('.preformatted header') as HTMLElement;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const headerValue = `${header.querySelector('b').textContent} ${header.querySelector('p').textContent}`;
    const headerRow = worksheet.addRow([headerValue]);
    headerRow.font = { color: { argb: '008000' }, bold: true, size: 16 };

    const contentRows = content.querySelectorAll('tr');

    contentRows.forEach((row) => {
      const cellValues = Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent || '');

      
      if (cellValues[1] === '' && cellValues[2] === '') {
        const cell2 = worksheet.getCell(worksheet.addRow(cellValues).getCell(1).address);

        cell2.font = { color: { argb: '008000' }, bold: true, size: 12 };

      } else if (cellValues[0] == "Total") {
        const cell3 = worksheet.getCell(worksheet.addRow(cellValues).getCell(1).address);

        cell3.font = { bold: true, size: 12 };

      } else {
        worksheet.addRow(cellValues);
      }
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, this.report_data_name + '.xlsx');
    });
   
  }
 
reportMain(data){
  this.report_item(data)
  this.report_item1(data)
}
  report_item(item) {
     let stage_id
         if(this.templatesummary.controls["stage"].value.id == 99 || !this.templatesummary.controls["stage"].value.id ){
            stage_id=-1
          }else{
            stage_id=this.templatesummary.controls["stage"].value.id 
          }
    console.log("Item",item,this.curDate)
    let input_params = {
      "finyear": this.finyear,
      "reporttype_id": item.id,
      "fis_mis_date": this.curDate,
      "div_amount": this.templatesummary.controls["amount"].value,
      "stage": stage_id ?? ''
    }
    console.log("Params",this.amountinvalue)
    this.SpinnerService.show()
    this.drsService.scheduler_master_list(input_params).subscribe((results: any) => {
      this.SpinnerService.hide()
      this.Schedulermaster = results["data"]
    });
  }
  report_item1(item) {
     let stage_id
    if(this.templatesummary.controls["stage"].value.id == 99 || !this.templatesummary.controls["stage"].value.id ){
      stage_id=-1
    }else{
      stage_id=this.templatesummary.controls["stage"].value.id 
    }
    let format=this.MinusYear(this.curDate)
    console.log("Item",item)
    let input_params = {
      "finyear": this.finyear,
      "reporttype_id": item.id,
      "fis_mis_date": format,
      "div_amount": this.templatesummary.controls["amount"].value,
      "stage": stage_id ?? ''
    }
    console.log("Params",this.amountinvalue)
    this.SpinnerService.show()
    this.drsService.scheduler_master_list(input_params).subscribe((results: any) => {
      this.SpinnerService.hide()
      this.Schedulermaster1 = results["data"]
    });
  }
  PanelOpened(data) {
      let stage_id
          if(this.templatesummary.controls["stage"].value.id == 99 || !this.templatesummary.controls["stage"].value.id ){
            stage_id=-1
          }else{
            stage_id=this.templatesummary.controls["stage"].value.id 
          }
    let input_params = {
      "finyear": this.finyear,
      "schedulermaster_id": data.id,
      "fis_mis_date": this.curDate,
      "div_amount": this.amountinvalue,
      "stage": stage_id ?? ''
    }
    this.SpinnerService.show()
    this.drsService.scheduler_type_list(input_params).subscribe((results: any) => {
      this.SpinnerService.hide()
      this.child = results["data"]
    });
    let input_params1 = {
      "finyear": this.finyear,
      "schedulermaster_id": data.id,
      "fis_mis_date": this.MinusYear(this.curDate),
      "div_amount": this.amountinvalue,
      "stage": stage_id ?? ''
    }
    this.SpinnerService.show()
    this.drsService.scheduler_type_list(input_params1).subscribe((results: any) => {
      this.SpinnerService.hide()
      this.child1 = results["data"]
    });

  }
 
  // getSubChilds(parentId: number) {
  //   return this.allSubChilds.filter(sub => sub.parent_id === parentId); // Modify according to your API structure
  // }
  isExpanded(data1: any): boolean {
    return this.expandedItemId === data1.id; // Check if this item should be expanded
  }
  isExpandedQuarter(data1: any): boolean {
    return this.expandedItemIdQuarter === data1.id; // Check if this item should be expanded
  }
  expandedItem: any = null;
  PanelOpeneds(data) {
    if (this.expandedItemId === data.id) {
      this.expandedItemId = null; // Collapse if it's already open
    } else {
      this.expandedItemId = data.id; // Expand the new item
    }
  
      if (data.sub_level === 1) {
        if (!('isExpanded' in data)) {
          data.isExpanded = false;
        }
        data.isExpanded = !data.isExpanded;
      }
    let input_params = {
      "finyear": this.finyear,
      "schedulermaster_id": data.id,
      "fis_mis_date": this.curDate,
      "div_amount": this.amountinvalue
    }
    this.SpinnerService.show()
    this.drsService.scheduler_type_list(input_params).subscribe((results: any) => {
      this.SpinnerService.hide()
      this.sub_childs = results["data"]
    });
    let input_paramss = {
      "finyear": this.finyear,
      "schedulermaster_id": data.id,
      "fis_mis_date": this.MinusYear(this.curDate),
      "div_amount": this.amountinvalue
    }
    this.SpinnerService.show()
    this.drsService.scheduler_type_list(input_paramss).subscribe((results: any) => {
      this.SpinnerService.hide()
      this.sub_childs1 = results["data"]
    });

  }
  schedularclear() {
    this.child = []
    this.Schedulermaster = []
  }
  amount1(event: Event, item) {
    this.openpopup = true
    let input_params = {
      "template_id": item.id,
      "flag": 1,
      "fis_mis_date": this.curDate,
      "div_amount": this.amountinvalue
    }
    this.SpinnerService.show()
    this.drsService.fetch_template(input_params).subscribe((results: any) => {
      this.SpinnerService.hide()

      this.template = results.report_amount
      this.template1 = results.template_name
      this.templatename = results.name
    });
    event.stopPropagation();
  }
  amount2(event: Event, item) {
    this.openpopup = true
    let input_params = {
      "template_id": item.id,
      "flag": 1,
      "fis_mis_date": this.MinusYear(this.curDate),
      "div_amount": this.amountinvalue
    }
    this.SpinnerService.show()
    this.drsService.fetch_template(input_params).subscribe((results: any) => {
      this.SpinnerService.hide()

      this.template = results.report_amount
      this.template1 = results.template_name
      this.templatename = results.name
    });
    event.stopPropagation();
  }

  colosemodal() {
    this.openpopup = false
    this.template = []
    this.template1 = []
    this.highlightedIndex = -1;
    this.highlightedIndex1 = -1;
  }
  highlightCorrespondingItem(index: number) {
    this.highlightedIndex = index;
    this.highlightedIndex1 = index;
  }
  highlightCorrespondingItem1(index: number) {
    this.highlightedIndex1 = index;
    this.highlightedIndex = index;
  }
  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  downloads_screens(data){
if(data==='pdf'){
this.excels=false;
this.pdffile=true;
this.drs_summary_file.reset()
}else{
this.excels=true;
this.pdffile=false;
this.drs_summary_file.reset()
}
  }

  arrdate = []
  downloadBEpdf(data) {

    if (data.date == null || data.date == undefined || data.date == "") {
      this.toastr.warning("", "Please choose Date")
      return false
    }
    // if (data.stage == null || data.stage == undefined || data.stage == "") {
    //   this.toastr.warning("", "Please Select Stage")
    //   return false
    // }
    if (data.amount == "" || data.amount == null || data.amount == undefined) {
      this.amountinvalue = "Crore"
    } else {
      this.amountinvalue = data.amount
    }
    this.stagedownload = this.templatesummary.controls["stage"].value

    this.curDate = this.datepipe.transform(data.date, "yyyy-MM-dd")
    this.curDate = this.datepipe.transform(data.date, "yyyy-MM-dd");
    this.finyears = this.convertToFinancialYear(this.curDate); // Convert to FY format
    this.peryears = this.convertToFinancialYear(this.curDate); // Get previous year date
    let yearRanges = this.finyears;
          let formattedFYs = `FY${yearRanges.slice(2, 4)}-${yearRanges.slice(7, 9)}`;
    this.finyears= formattedFYs
    console.log("download finyear",this.finyears);


    const yearss = this.finyears.match(/\d+/g); // Extract numbers
    if (yearss && yearss.length === 2) {
      const startYear = +yearss[0] - 1;
      const endYear = +yearss[1] - 1;
      this.pre_finyears = `FY${startYear}-${endYear}`;
    }
    console.log("download pre-finyear",this.pre_finyears);
    this.download_fin.push(this.finyears)
    this.download_fin.push(this.pre_finyears)
    console.log(this.download_fin)


    const parts = this.curDate.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1];
    const day = parts[2];
    const newYear = year - 1;
    this.peryear = newYear + '-' + month + '-' + day
    let master_id = this.drsservice.View_values.value
    this.arrdate.push(this.curDate)
    this.arrdate.push(this.peryear)
    if (this.stagedownload == "" || this.stagedownload == null || this.stagedownload == undefined) {
      this.parms = {
        "finyear": this.download_fin,
        "reportmaster_id": master_id,
        "fis_mis_date": this.arrdate,
        "div_amount": this.amountinvalue,
        "stage": -1,
        "content":this.drs_summary_file?.value?.remarks?this.drs_summary_file?.value?.remarks:''
      }

    } else {
      this.parms = {
        "finyear": this.download_fin,
        "reportmaster_id": master_id,
        "fis_mis_date": this.arrdate,
        "div_amount": this.amountinvalue,
        "stage": this.stagedownload?.id ?? '',
        "content":this.drs_summary_file?.value?.remarks?this.drs_summary_file?.value?.remarks:''
      }
    }
    // let parms = {
    //   "reportmaster_id":master_id,
    //   "fis_mis_date":this.arrdate,
    //   "div_amount":this.amountinvalue,
    //   "stage": this.stagedownload?.id?? '', 
    //   }
    this.SpinnerService.show()
    this.drsService.drs_summary_pdfdownload(this.parms).subscribe((results: any) => {
      this.SpinnerService.hide()
      let data =  results["data"]
      // let binaryData = [];
      // binaryData.push(results)
      // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      // let link = document.createElement('a');
      // link.href = downloadUrl;
      // let date: Date = new Date();
      // link.download = this.report_data_name + ".pdf";
      // link.click();
      if(data[0].status == "SUCCESS"){
      this.toastr.success('Successfully Download Initiated');
      this.drs_summary_file.reset()
      this.Audit_return_close.nativeElement.click()
      this.arrdate = []
      this.download_fin= []
      }
      
    });
  }
  arrdate1 = []
 download_fin= []
  downloadBEExcel(data) {

    if (data.date == null || data.date == undefined || data.date == "") {
      this.toastr.warning("", "Please choose Date")
      return false
    }
    // if (data.stage == null || data.stage == undefined || data.stage == "") {
    //   this.toastr.warning("", "Please Select Stage")
    //   return false
    // }
    if (data.amount == "" || data.amount == null || data.amount == undefined) {
      this.amountinvalue = "Crore"
    } else {
      this.amountinvalue = data.amount
    }
    this.stagedownload = this.templatesummary.controls["stage"].value
    this.curDate = this.datepipe.transform(data.date, "yyyy-MM-dd")

    this.curDate = this.datepipe.transform(data.date, "yyyy-MM-dd")
    this.curDate = this.datepipe.transform(data.date, "yyyy-MM-dd");
    this.finyears = this.convertToFinancialYear(this.curDate); // Convert to FY format
    this.peryears = this.convertToFinancialYear(this.curDate); // Get previous year date
    let yearRanges = this.finyears;
          let formattedFYs = `FY${yearRanges.slice(2, 4)}-${yearRanges.slice(7, 9)}`;
    this.finyearss= formattedFYs
    console.log("download finyear",this.finyearss);


    const yearss = this.finyearss.match(/\d+/g); // Extract numbers
    if (yearss && yearss.length === 2) {
      const startYear = +yearss[0] - 1;
      const endYear = +yearss[1] - 1;
      this.pre_finyearss = `FY${startYear}-${endYear}`;
    }
    console.log("download pre-finyear",this.pre_finyearss);
    this.download_fin.push(this.finyearss)
    this.download_fin.push(this.pre_finyearss)
    console.log(this.download_fin)

    const parts = this.curDate.split("-");
    const year = parseInt(parts[0]);
    const month = parts[1];
    const day = parts[2];
    const newYear = year - 1;
    this.peryear = newYear + '-' + month + '-' + day
    let master_id = this.drsservice.View_values.value
    this.arrdate1.push(this.curDate)
    this.arrdate1.push(this.peryear)
    if (this.stagedownload == "" || this.stagedownload == null || this.stagedownload == undefined) {
      this.parms = {
        "finyear": this.download_fin,
        "reportmaster_id": master_id,
        "fis_mis_date": this.arrdate1,
        "div_amount": this.amountinvalue,
        "stage": -1,
        "content":this.drs_summary_file?.value?.remarks?this.drs_summary_file?.value?.remarks:''
      }

    } else {
      this.parms = {
        "finyear": this.download_fin,
        "reportmaster_id": master_id,
        "fis_mis_date": this.arrdate1,
        "div_amount": this.amountinvalue,
        "stage": this.stagedownload?.id ?? '',
        "content":this.drs_summary_file?.value?.remarks?this.drs_summary_file?.value?.remarks:''
      }
    }

    this.SpinnerService.show()
    this.drsService.drs_summary_exceldownload(this.parms).subscribe((results: any) => {
      this.SpinnerService.hide()
      let data =  results["data"]
      // let binaryData = [];
      // binaryData.push(results)
      // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      // let link = document.createElement('a');
      // link.href = downloadUrl;
      // let date: Date = new Date();
      // link.download = this.report_data_name + ".xlsx";
      // link.click();
        if(data[0].status == "SUCCESS"){
      this.toastr.success('Successfully Download Initiated');
      this.drs_summary_file.reset()
      this.Audit_return_close.nativeElement.click()
      this.arrdate1 = []
      this.download_fin= []
        }
    });

  }
 MinusYear(val) {
  let newDate = new Date(val);
  let year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  let date = newDate.getDate();
  let format = (year - 1) + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0');
  return format;
}


    getfinyear(prokeyvalue) {
        this.dataService.getfinyeardropdown(prokeyvalue, 1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.finyearList = datas;
    
          })
      }
        public displayfnfinyear(fin_year:any) {
          return fin_year ? fin_year.finyer : undefined;
      
        }
  
  QuarterSummary(){
    let form=this.templatesummary.value
    let params={
      "finyear":form.finyear?.finyer,
      "reportmaster_id":this.ViewFullData?.id,
      "div_amount":form.amount,
      "stage":-1,
      "Quarter":form.quarter=='Quarter 1'?1:form.quarter=='Quarter 2'?2:form.quarter=='Quarter 3'?3:form.quarter=='Quarter 4'?4:''
    }
    this.SpinnerService.show()
    this.drsService.QuarterSummary(params).subscribe(res=>{
      this.SpinnerService.hide()
      this.YearLength=[]
      this.QuarterlyLength=[]
      this.HalfYearLength=[]
      this.preheader=true
      this.pretable=true
      this.Flag_booleans=true
      this.QuarterData=res['data'][0]
      for(let i of this.QuarterData?.Header){
        if(i.includes('Q')){
          this.QuarterlyLength.push(i)
        }
        else if(i.includes('H')){
          this.HalfYearLength.push(i)
        }
        else if(i.includes('Y')){
          this.YearLength.push(i)
        }
      }

    })
  }
  SliceFunc(data){
    return data.slice(3)
  } 
  QuarterFilFunc(data,id){
    let val=this.QuarterData[data]?.filter(res=>res?.id==id)
    let amount=val.length?val[0]?.name!='Total'?'amount':'total_amount':''
    return val.length?val[0][amount]:[]
  }
  PopQuarterFilFunc(data,id){
    let val=this.SchedulermasterQuarter[data]?.filter(res=>res?.id==id)
    // let amount=val.length?val[0]?.name!='Total'?'amount':'total_amount':''
    return val.length?val[0]['amount']:[]
  }
  PopQuarterFChildFilFunc(data,id){
    let val=this.SchedulermasterQuarterChild[data]?.filter(res=>res?.id==id)
    // let amount=val.length?val[0]?.name!='Total'?'amount':'total_amount':''
    return val.length?val[0]['report_amount']:[]
  }
  PopQuarterSChildFilFunc(data,id){
    let val=this.SchedulermasterQuarterChildSecond[data]?.filter(res=>res?.id==id)
    // let amount=val.length?val[0]?.name!='Total'?'amount':'total_amount':''
    return val.length?val[0]['report_amount']:[]
  }
  TableDataReturn(){
    if(Object.keys(this.QuarterData)?.length){
      let head=this.QuarterData?.Header[0]
      return this.QuarterData[head]
    }
    else{
      return []
    }
  }
  PopTableDataReturn(){
    if(Object.keys(this.SchedulermasterQuarter)?.length){
      let head=this.SchedulermasterQuarter?.Header[0]
      return this.SchedulermasterQuarter[head]
    }
    else{
      return []
    }
  }
  PopTableDataFChildReturn(){
    if(Object.keys(this.SchedulermasterQuarterChild)?.length){
      let head=this.SchedulermasterQuarterChild?.Header[0]
      return this.SchedulermasterQuarterChild[head]
    }
    else{
      return []
    }
  }
  PopTableDataSChildReturn(){
    if(Object.keys(this.SchedulermasterQuarterChildSecond)?.length){
      let head=this.SchedulermasterQuarterChildSecond?.Header[0]
      return this.SchedulermasterQuarterChildSecond[head]
    }
    else{
      return []
    }
  }
  QuarterMain(data){
    let form=this.templatesummary.value
    let params={
      "finyear": form.finyear?.finyer,
      "reporttype_id": data?.id,
      "div_amount": form.amount,
      "stage": -1,
      "Quarter": form.quarter=='Quarter 1'?1:form.quarter=='Quarter 2'?2:form.quarter=='Quarter 3'?3:form.quarter=='Quarter 4'?4:''
    }
    this.SpinnerService.show()
    this.drsService.QuarterParticularGet(params).subscribe(result=>{
      this.SpinnerService.hide()
      this.SchedulermasterQuarter=result['data'][0]
      this.getTitle()
    })
    
  }
   PanelOpenendQuarter(data){
    let form=this.templatesummary.value
    let params={
       "finyear": form.finyear?.finyer,
      "schedulermaster_id": data?.id,
      "div_amount": "Crore",
      "stage": -1,
      "Quarter":form.quarter=='Quarter 1'?1:form.quarter=='Quarter 2'?2:form.quarter=='Quarter 3'?3:form.quarter=='Quarter 4'?4:''
    }
        this.SpinnerService.show()
    this.drsService.QuarterParticularSubListGet(params).subscribe(result=>{
      this.SpinnerService.hide()
      this.SchedulermasterQuarterChild=result['data'][0]
    })

  }
   PanelOpenendsQuarter(data){
    if(this.expandedItemIdQuarter==data.id){
      this.expandedItemIdQuarter=null
    }
    else{
      this.expandedItemIdQuarter=data.id
    }
    let form=this.templatesummary.value
    let params={
       "finyear": form.finyear?.finyer,
      "schedulermaster_id": data?.id,
      "div_amount": "Crore",
      "stage": -1,
      "Quarter":form.quarter=='Quarter 1'?1:form.quarter=='Quarter 2'?2:form.quarter=='Quarter 3'?3:form.quarter=='Quarter 4'?4:''
    }
        this.SpinnerService.show()
    this.drsService.QuarterParticularSubListGet(params).subscribe(result=>{
      this.SpinnerService.hide()
      this.SchedulermasterQuarterChildSecond=result['data'][0]
    })

  }
  schedularQuarterclear(){
    this.SchedulermasterQuarter={}
    this.SchedulermasterQuarterChild={}
    this.SchedulermasterQuarterChildSecond={}
  }
  ClassDefineFunc(data){
    let QuarSome=this.QuarterData['Header'].some(val=>val.includes('Q'))
    let HalfSome=this.QuarterData['Header'].some(val=>val.includes('H'))
    let YearSome=this.QuarterData['Header'].some(val=>val.includes('Y'))
    let Quarval=QuarSome?1:''
    let Halfval=QuarSome && HalfSome?2:HalfSome?1:''
    let Yearval=QuarSome && HalfSome && YearSome?3:(HalfSome && YearSome) || (QuarSome && YearSome)?2:YearSome?1:''
    let classVal='Class'
    if(data.includes('Q')){
      return classVal+Quarval
    }
    else if(data.includes('H')){
      return classVal+Halfval
    }
    else if (data.includes('Y')){
      return classVal+Yearval
    }
    else{
      return ''
    }
    //  let classVal='Class'
    // if(data.includes('Q')){
    //   return classVal+1
    // }
    // else if(data.includes('H')){
    //   return classVal+2
    // }
    // else if (data.includes('Y')){
    //   return classVal+3
    // }
    // else{
    //   return ''
    // }
  }
  
  ClasSchMstr(data){
    let QuarSome=this.SchedulermasterQuarter['Header'].some(val=>val.includes('Q'))
    let HalfSome=this.SchedulermasterQuarter['Header'].some(val=>val.includes('H'))
    let YearSome=this.SchedulermasterQuarter['Header'].some(val=>val.includes('Y'))
    let Quarval=QuarSome?1:''
    let Halfval=QuarSome && HalfSome?2:HalfSome?1:''
    let Yearval=QuarSome && HalfSome && YearSome?3:(HalfSome && YearSome) || (QuarSome && YearSome)?2:YearSome?1:''
    let classVal='ClassQtr'
    if(data.includes('Q')){
      return classVal+Quarval
    }
    else if(data.includes('H')){
      return classVal+Halfval
    }
    else if (data.includes('Y')){
      return classVal+Yearval
    }
    else{
      return ''
    }
  }
  schMasQtrWid 
  schMasHalfWid 
  schMasYearWid 
  getTitle(){
    let data = this.SchedulermasterQuarter?.Header
    this.schMasQtrWid =0  
    this.schMasHalfWid =0  
    this.schMasYearWid =0  
    for(let i=0; i<data.length; i++ ){
      if(data[i].includes('Q')){
            this.schMasQtrWid = this.schMasQtrWid +103
          }
          else if(data[i].includes('H')){
            this.schMasHalfWid = this.schMasHalfWid + 103
          }
          else if(data[i].includes('Y')){
            this.schMasYearWid = this.schMasYearWid + 103
          }
    }
    
  }
   
  ClasSchMstrChild(data){
    let QuarSome=this.SchedulermasterQuarterChild['Header'].some(val=>val.includes('Q'))
    let HalfSome=this.SchedulermasterQuarterChild['Header'].some(val=>val.includes('H'))
    let YearSome=this.SchedulermasterQuarterChild['Header'].some(val=>val.includes('Y'))
    let Quarval=QuarSome?1:''
    let Halfval=QuarSome && HalfSome?2:HalfSome?1:''
    let Yearval=QuarSome && HalfSome && YearSome?3:(HalfSome && YearSome) || (QuarSome && YearSome)?2:YearSome?1:''
    let classVal='Class'
    if(data.includes('Q')){
      return classVal+Quarval
    }
    else if(data.includes('H')){
      return classVal+Halfval
    }
    else if (data.includes('Y')){
      return classVal+Yearval
    }
    else{
      return ''
    }
  }
  ClasSchMstrChildSec(data){
    let QuarSome=this.SchedulermasterQuarterChildSecond['Header'].some(val=>val.includes('Q'))
    let HalfSome=this.SchedulermasterQuarterChildSecond['Header'].some(val=>val.includes('H'))
    let YearSome=this.SchedulermasterQuarterChildSecond['Header'].some(val=>val.includes('Y'))
    let Quarval=QuarSome?1:''
    let Halfval=QuarSome && HalfSome?2:HalfSome?1:''
    let Yearval=QuarSome && HalfSome && YearSome?3:(HalfSome && YearSome) || (QuarSome && YearSome)?2:YearSome?1:''
    let classVal='Class'
    if(data.includes('Q')){
      return classVal+Quarval
    }
    else if(data.includes('H')){
      return classVal+Halfval
    }
    else if (data.includes('Y')){
      return classVal+Yearval
    }
    else{
      return ''
    }
  }
}