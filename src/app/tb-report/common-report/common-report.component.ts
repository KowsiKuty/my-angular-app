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
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
export interface tb_list{
  id:number
  name:string
  code:string
  glno:number
}
@Component({
  selector: 'app-common-report',
  templateUrl: './common-report.component.html',
  styleUrls: ['./common-report.component.scss'],
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
export class CommonReportComponent implements OnInit {
  @ViewChild("closeaddpopup") closeaddpopup;
  @ViewChild('businessInput') businessInput: any;
  @ViewChild('business_name') business_nameautocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('glContactInput')glContactInput:any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  @ViewChild('branch_dos') matAutocompletebranch_dos: MatAutocomplete;
  @ViewChild('branch_do_Input') branch_do_Input: any;
  @ViewChild('gl_no')matAutocompletegl:MatAutocomplete;

   //bs

   @ViewChild('bsInput') bsInput: any;
   @ViewChild('bs') matAutocompletebs: MatAutocomplete;
 
   //cc
   @ViewChild('ccInput') ccInput: any;
   @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;

   @ViewChild('bsclear_nameInput') bsclear_name;
  div_Amt_show: string;
  divamount: any;
  from_date_balance: string;
  to_date_balance: string;
  has_next: boolean=true;
  has_previous: any;
  presentpage: any;
  summary_list: any = [];
  original_data: any = [];
  businessList: any;
  isLoading: boolean;
  has_nextbra: boolean;
  has_previousbra: boolean;
  currentpagebra: number;
  reports_value:any;
  Amount_List:any=[{"id":"C","name":"Crores"},{"id":"L","name":"Lakhs"},{"id":"A","name":"Actuals"}]
  view_List:any=[{"id":1 ,"name":"Bank As a Whole","type":"Bank_As_Whole"},{"id":2,"name":"Branch Wise","type":"Branch_View"}]
  branchList: any;
  xlsx_param:any;
  has_next_child: any;
  has_previous_child: any;
  presentpage_child: any;
  tb_child_report_list: any;
  original_child_data:any = [];  
  flages:any;
  repor_name:any;
  gl_List: any;
  has_nextgl: boolean;
  has_previousgl: boolean;
  currentpagegl: number;
  frm_date: string;
  previous_frm_date: string;
  previous_to_date: string;
  from_head_date: string;
  to_head_date: string;
  data_branch_id: any;
  data_subcat_id: any;
  brach_dd_hide: boolean=false;
  branch_wise_data: boolean;
  fromdate: string;
  todate: string;
  view_edit: any;
  Branch_data_show_hide: boolean=false;
  role_per:any;
  view_branch:boolean=false;
  branch_name_show:any;
  table_headers: boolean;
  Do_permission: any;
  branch_name_headers:boolean;
  do_view:boolean;
  branch_do_List: any;
  branch_value_code: any;
  has_previous_do_bra: any;
  currentpage_do_bra: any;
  has_next_do_bra: any;
  bsList: any;
  ccList: any;
  total_pages: any;
  page_size: any;
  page_index: any;
  chiled_page_size: number;
  chiledpage_index: number;
  child_total_pages: any;
  end_of_reo: boolean;
  chid_datess: any;
  TB_end_of_reo: boolean;
  alldate: any;
  amount_division:any= 100000;
  child_xlsx_param: any;
  child_repor_name: any;
  arrow_icon_up: boolean=true;
  totalFromBalance: number;
  totalToBalance: number;
  total_child_FromBalance: number;
  total_child_ToBalance: number;
  total_child_amount: number;
  type: number;
  maxDate: Date = new Date();
  brnach_login_id: any;

  constructor(private fb:FormBuilder ,private errorHandler: ErrorhandlingService,private datePipe: DatePipe, public tbservice: TbReportService , private dataService:TbReportService,private vrtshardserv:VertSharedService,private SpinnerService:NgxSpinnerService,private toastr: ToastrService) { }
  common_report:FormGroup;
  ngOnInit(): void {
    this.common_report=this.fb.group({
      from_date:[],
      to_date:[],
      branch:[],
      business:[],
      amount:[],
      gl_no_id:[],
      view:[],
      branch_do:[],
      bs_id:[],
      cc_id:[],
    })
    this.role_per=this.vrtshardserv.role_permission.value
    console.log("rolessssssssss",this.role_per)
    this.branch_value_code=this.vrtshardserv.Branch_value.value
    this.Do_permission=this.vrtshardserv.Branch_value_do.value    
    this.branch_name_show=this.vrtshardserv.Branch_value_show.value;
    this.brnach_login_id=this.vrtshardserv.Branchwiselogin_id.value;
    console.log("Do_permission",this.Do_permission['empbranch_ids']?.length)
    if(this.role_per.name=="Admin"){
      this.branch_name_headers=false;
      this.view_branch=true;
      this.brach_dd_hide=false;
      this.table_headers=false;
      this.brnach_login_id=""
    }else{
      if(this.Do_permission['empbranch_ids']?.length !=0){
        this.branch_name_headers=true;
        this.view_branch=false;
        this.brach_dd_hide=true;
        this.table_headers=true; 
        this.brnach_login_id=""       
      }else{
        this.branch_name_headers=true;
        this.view_branch=false;
        this.brach_dd_hide=false;
        this.table_headers=true;
        this.brnach_login_id=this.vrtshardserv.Branchwiselogin_id.value;
      }
     
    }
    
   this.reports_value= this.vrtshardserv.dropdown_data.value
   console.log("this.reportsval",this.reports_value)
  }

   getLastDayOfMonth(date,month ) {
    // Create a Date object for the first day of the next month
    let firstDayOfNextMonth:any = new Date(date, month + 1, 1);
    console.log("first",firstDayOfNextMonth)
    // Subtract one day to get the last day of the target month
    return new Date(firstDayOfNextMonth - 1);
    
}

 formatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
toda_reset_fun(){
  this.Branch_data_show_hide=false;
  if(this.role_per.name=="Admin"){
  this.common_report.controls['business'].reset('')
  this.common_report.controls['amount'].reset('')
  this.common_report.controls['gl_no_id'].reset('')
  this.common_report.controls['branch'].reset('')
  this.common_report.controls['branch_do'].reset('')
  this.common_report.controls['view'].reset('')
  this.common_report.controls['bs_id'].reset('')
  this.common_report.controls['cc_id'].reset('')
  // }else if(this.Do_permission['empbranch_ids'].length !=0 && this.role_per.name !="Admin"){
  //   this.common_report.controls['bs_id'].reset('')
  //   this.common_report.controls['cc_id'].reset('')
  //   this.common_report.controls['business'].reset('')
  // this.common_report.controls['amount'].reset('')
  // this.common_report.controls['gl_no_id'].reset('')
  // this.common_report.controls['branch'].reset('')
  }else{
    this.common_report.controls['bs_id'].reset('')
    this.common_report.controls['cc_id'].reset('')
    this.common_report.controls['business'].reset('')
  this.common_report.controls['amount'].reset('')
  this.common_report.controls['gl_no_id'].reset('')
  }
}

branch_hide(branch){
  this.summary_list = []
  this.original_data = [];
  this.Branch_data_show_hide=false
  if(branch.id==1){
    this.brach_dd_hide=false;
    this.branch_name_headers=false;
    this.do_view=false;
    this.common_report.controls['branch'].reset('')
    this.common_report.controls['branch_do'].reset('')
    this.common_report.controls['gl_no_id'].reset('')
    this.common_report.controls['business'].reset('')
    this.common_report.controls['amount'].reset('')
    this.common_report.controls['bs_id'].reset('')
    this.common_report.controls['cc_id'].reset('')
  }else if(branch.id==2){
    this.branch_name_headers=true;
    this.brach_dd_hide=true;
    this.do_view=false;
    this.common_report.controls['branch'].reset('')
    this.common_report.controls['branch_do'].reset('')
    this.common_report.controls['gl_no_id'].reset('')
    this.common_report.controls['business'].reset('')
    this.common_report.controls['amount'].reset('')
    this.common_report.controls['bs_id'].reset('')
    this.common_report.controls['cc_id'].reset('')
  }else{
    this.branch_name_headers=true;
    this.brach_dd_hide=true;
    this.table_headers=false;
    this.do_view=true;    
    this.common_report.controls['branch'].reset('')
    this.common_report.controls['branch_do'].reset('')
    this.common_report.controls['gl_no_id'].reset('')
    this.common_report.controls['business'].reset('')
    this.common_report.controls['amount'].reset('')
    this.common_report.controls['bs_id'].reset('')
    this.common_report.controls['cc_id'].reset('')
  }
  }

  do_view_dd(branch){
    this.common_report.controls['branch'].reset('')
if(branch == "" || branch ==null || branch==undefined){
  this.brach_dd_hide=false;
   this.branch_name_headers=true;
}else{
  this.brach_dd_hide=true;
  this.branch_name_headers=true;
}
  }

  bs_cc_clear() {
    this.common_report.controls['cc_id'].reset('')
  }

  tb_common_summary(event ,page=1){
    this.TB_end_of_reo = true
    console.log("Eventss",event)   
    if(this.common_report.value.from_date==""|| this.common_report.value.from_date==undefined || this.common_report.value.from_date==null ){
      this.toastr.warning("Please Select Date 1")
      return false
    }
    if(this.common_report.value.to_date==""|| this.common_report.value.to_date==undefined || this.common_report.value.to_date==null ){
      this.toastr.warning("Please Select Date 2")
      return false
    }
    if(this.role_per.name=="Admin"){
    if(this.common_report.value.view == "" || this.common_report.value.view == undefined || this.common_report.value.view==null){
      this.toastr.warning("Please Select View Type")
      return false
    }
    if(this.common_report.value.view.id == 2){
      if(this.common_report.value.branch == null || this.common_report.value.branch == undefined || this.common_report.value.branch == ''){
        this.toastr.warning("Please Select Branch")
        return false
      }
    }
  }
    if(this.common_report.value.amount?.id=="C" ){
      this.div_Amt_show="Amount In Crores"
        }else if(this.common_report.value.amount?.id=="A"){
          this.div_Amt_show="Amount In Actuals"
        }else{
          this.div_Amt_show="Amount In Lakhs"
        }
        this.divamount=this.common_report.value.amount?.id??""
    // this.TBsummaryObjNew = { "method": "post", 
    // "url": this.ppr_env + "reportserv/get_transaction_drcr",
    //  "data":event,
    //  ScrollPagination:true,
    //  nospinner:true,
    // }
    let fromDate = new Date(this.common_report.value.from_date) 
    let toDate = new Date(this.common_report.value.to_date) 
console.log("llastdate",this.frm_date)
let previousYear = fromDate.getFullYear() - 1;
let lastDayOfMarch = this.getLastDayOfMonth(previousYear, 2); 
let formattedDate =this. formatDate(lastDayOfMarch);
this.frm_date= this.datePipe.transform(formattedDate, 'dd-MM-yyyy');
console.log("frmdate",this.frm_date);
    this.from_date_balance=this.datePipe.transform(this.common_report.value.from_date, 'yyyy-MM-dd') 
  this.to_date_balance=this.datePipe.transform(this.common_report.value.to_date, 'yyyy-MM-dd')
  let previousYearFromDate = new Date(fromDate.getFullYear() - 1, fromDate.getMonth(), fromDate.getDate());
  let previousYearToDate = new Date(toDate.getFullYear() - 1, toDate.getMonth(), toDate.getDate());  
  this.previous_frm_date=this.datePipe.transform(previousYearFromDate, 'dd-MM-yyyy')
  this.previous_to_date=this.datePipe.transform(previousYearToDate, 'dd-MM-yyyy')
  this.from_head_date=this.datePipe.transform(this.common_report.value.from_date, 'dd-MM-yyyy')
  this.to_head_date=this.datePipe.transform(this.common_report.value.to_date, 'dd-MM-yyyy')
  console.log(" this.from_head_date", this.from_head_date,this.to_head_date)
  console.log("previousYearFromDate",previousYearFromDate)
  console.log("previousYearToDate",previousYearToDate)
  let branch_id
  let branch_name=this.common_report.value.branch?.name??""
  let business_id=this.common_report.value.business?.id??""
  let business_name =this.common_report.value.business?.name??""
  let gl_no=this.common_report.value.gl_no_id?.microsubcatcode??""
  let gl_name=this.common_report.value.gl_no_id?.name??""
  let view_name
  let bs_ids=this.common_report.value.bs_id?.id??""
  let cc_id=this.common_report.value.cc_id?.id??""
  if(this.role_per.name=="Admin"){
    view_name=this.common_report.value.view?.type??""
    }
    let branch_view_in={"id":2,"name":"Branch Wise","type":"Branch_View"}
    if(this.brnach_login_id ==""){
     if(this.common_report.value.branch_do==="" || this.common_report.value.branch_do=== null || this.common_report.value.branch_do === undefined){

      branch_id=this.common_report.value.branch?.id??""
    }else{
    if(this.common_report.value.branch==="" || this.common_report.value.branch=== null || this.common_report.value.branch === undefined){
       branch_id=this.common_report.value.branch_do?.id??""
    }else{
     branch_id=this.common_report.value.branch_do?.id??""
    }
  }
}else{
  branch_id= this.brnach_login_id
  view_name=branch_view_in?.type
}     
if(this.common_report.value.business=="" || this.common_report.value.business == undefined || this.common_report.value.business==null){
  this.common_report.controls['bs_id'].reset('')
this.common_report.controls['cc_id'].reset('')
}
if(this.common_report.value.bs_id == "" || this.common_report.value.bs_id == null || this.common_report.value.bs_id == undefined){
  this.common_report.controls['cc_id'].reset('')
}
  this.xlsx_param = {  
   
    "Amount":this.div_Amt_show,
    "Branch Name":branch_name,    
    "Business Name":business_name,
    "BS Name":this.common_report.value.bs_id?.name??"",
    "CC Name":this.common_report.value.cc_id?.name??"",
    "GL Name":gl_name,    
    "Date 2": this.to_head_date,
    "Date 1":this.from_head_date,
  }

if(this.reports_value=="5"){
  this.flages=4
  this.repor_name="Cost of funds Report"
  this.child_repor_name="Cost of funds "
}
if(this.reports_value=="6"){
  this.flages=5
   this.repor_name="Gross Income Report"
   this.child_repor_name="Gross Income "
}if(this.reports_value=="7"){
  this.flages=2
   this.repor_name="Non Interest Income Report"
   this.child_repor_name="Non Interest Income "
}if(this.reports_value=="8"){
  this.flages=1
   this.repor_name="Establishment cost Report"
   this.child_repor_name="Establishment cost "
}if(this.reports_value=="9"){
  this.flages=3
   this.repor_name="Other Operating Expenses Report"
   this.child_repor_name="Other Operating Expenses "
}
let branch_flags
        if(this.role_per.name=="Admin"){
          branch_flags=view_name
        // }else if(this.Do_permission['empbranch_ids'].length !=0 && this.role_per.name !="Admin"){
        //   branch_flags=5
        }else{
          branch_flags=2
        }
console.log("this.flagesss",this.flages)
  let flag=this.flages
  this.page_index=0
  this.page_size=100
    let param=
    // {
    //   "fromdate":this.from_date_balance,
    //   "todate":this.to_date_balance,
    //   "branch_id":branch_id,
    //   "div_amount":this.divamount,
    //   "business_id":business_id,
    //   "gl":gl_no,
    //   "branch_flag":branch_flags,
    //   "bs_id":bs_ids,
    //   "cc_id":cc_id,
    // }
    {  "ls_group":"All_Reports",
      "type":view_name, 
      "fromdate":this.from_date_balance,
      "todate":this.to_date_balance,
      "branch_id": branch_id,
      "do_code": "",
      "business_id": business_id,
      "bs_id": bs_ids,
      "cc_id": cc_id,
      "subcatunique_no": gl_no,
      "flag": this.flages,
      "page_index": this.page_index,
      "page_size": this.page_size
  }
    console.log("param",param)
    this.SpinnerService.show()
      this.dataService.tb_business_summary(param,page)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["DATA"]; 
        this.amount_division = (this.common_report.value.amount?.id == 'L' ? 100000  : (this.common_report.value.amount?.id == 'C' ? 10000000 : (this.common_report.value.amount?.id == 'A' ? 1 : 100000)))      
        let dataPagination = results['pagination'];
        this.Branch_data_show_hide=true

        this.summary_list=datas 
        this.original_data = [...this.summary_list];
        

        if(this.summary_list.length!=0){
          this.total_pages=datas[0]["Total_Row"]
          console.log("total",datas[0]["Total_Row"])        
          let count = 100*1
          let value = this.total_pages-count
          if(value<0){
            this.TB_end_of_reo = false
            let totalFromBalance = 0;
            let totalToBalance = 0;
            this.summary_list.forEach(item => {
              totalFromBalance += parseFloat(item.frombalance);
              totalToBalance += parseFloat(item.tobalance);
            });
            console.log('Total FromBalance:', totalFromBalance);
            console.log('Total ToBalance:', totalToBalance);
        
              this.totalFromBalance = totalFromBalance;
              this.totalToBalance = totalToBalance;
          }
          // console.log("dataPagination=>",dataPagination)
          // this.has_next = dataPagination.has_next;
          // this.has_previous = dataPagination.has_previous;
          // this.presentpage = dataPagination.index; 
          // if(this.role_per.name=="Admin"){

          // }else{
          //   this.Branch_name_Show=this.summary_list[0].branch_name
          // console.log("  this.tb_gl_report_list[0].branch_name",  this.summary_list[0].branch_name)
          // }
        }
        else{
          this.toastr.warning("","No Data Found" ,{timeOut:1200})
        }
      }, error => {
        // this.Branch_data_show_hide=false;
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


  }


  Branchfield_Event(data){
    console.log("Branchfield_Event",data)
    this.common_report.patchValue({
      branch : data
    })
  }
  Businessfield_Event(data){
    console.log("Businessfield_Event",data)
    this.common_report.patchValue({
      business : data
    })
  }

  popupopen() {
    const myModalEl = document.getElementById('transaction');
    const myModal = new (bootstrap as any).Modal(myModalEl, {
      keyboard: false,
      backdrop: 'static'
    });
    myModal.show();
  } 
  
  
  
  closedpopup() {
  this.closeaddpopup.nativeElement.click();
  }
  dates:any;
  TB_from_summary(dates_view,data,datess,page=1){
    this.tb_child_report_list=[]
    this.original_child_data = [];  
    this.end_of_reo = true
    this.alldate = datess
    this.data_branch_id=data.branch_id
        if(this.common_report.value.business=="" || this.common_report.value.business == undefined || this.common_report.value.business==null){
          this.common_report.controls['bs_id'].reset('')
        this.common_report.controls['cc_id'].reset('')
        }
        if(this.common_report.value.bs_id == "" || this.common_report.value.bs_id == null || this.common_report.value.bs_id == undefined){
          this.common_report.controls['cc_id'].reset('')
        }
        this.view_edit=dates_view
         if(dates_view=="BR_View"){
          this.branch_wise_data=false;
          this.todate=this.to_date_balance
          this.fromdate=this.from_date_balance
        }else {
          this.branch_wise_data=true;
          this.dates=this.to_date_balance
        }
    console.log("datas",data)
    // let param
    this.data_subcat_id=data.microsubcatcode
    let bs_ids=this.common_report.value.bs_id?.id??""
    let cc_id=this.common_report.value.cc_id?.id??""
    let business_id=this.common_report.value.business?.id??""
    let view_name=this.common_report.value.view?.type??""
    this.chiled_page_size=100
    this.chiledpage_index=0
    this.chid_datess=datess
    let param
  if(dates_view=="BR_View"){
    param=

    {  "ls_group":"All_Reports",
      "type":dates_view, 
      "fromdate":this.from_date_balance,    
      "todate":this.to_date_balance,
      "branch_id": data?.branch_id??"",
      "do_code": "",
      "business_id": business_id,
      "bs_id": bs_ids,
      "cc_id": cc_id,
      "subcatunique_no": data.microsubcatcode,
      "flag": this.flages,
      "page_index": this.chiledpage_index, 
      "page_size": this.chiled_page_size
  }
  }else{
   param=

    {  "ls_group":"All_Reports",
      "type":dates_view, 
      "fromdate":datess,
      "todate":"",
      "branch_id": data?.branch_id??"",
      "do_code": "",
      "business_id": business_id,
      "bs_id": bs_ids,
      "cc_id": cc_id,
      "subcatunique_no": data.microsubcatcode,
      "flag": this.flages,
      "page_index": this.chiledpage_index, 
      "page_size": this.chiled_page_size
  }
}
  this.child_xlsx_param = {  
    "Amount":this.div_Amt_show,
    "Branch Name":this.common_report.value.branch?.name??"",    
    "Business Name":this.common_report.value.business?.name??"",
    "BS Name":this.common_report.value.bs_id?.name??"",
    "CC Name":this.common_report.value.cc_id?.name??"",
    "GL Name":data.subcat_name ? data.subcat_name : '',    
    "Date 2": this.to_head_date,
    "Date 1":this.from_head_date,
  }
    this.SpinnerService.show()
      this.dataService.tb_business_summary(param,page)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["DATA"]; 
        // let dataPagination = results['pagination'];       
        this.tb_child_report_list=datas 
        this.original_child_data = [...this.tb_child_report_list];  
        if(this.tb_child_report_list.length!=0){
          this.child_total_pages=datas[0]["Total_Row"]  
          let count = 100*1
          let value = this.child_total_pages-count
          if(value<0){
            this.end_of_reo = false
            if(dates_view=="BR_View"){
              let totalFromBalance = 0;
              let totalToBalance = 0;
              this.tb_child_report_list.forEach(item => {
                totalFromBalance += parseFloat(item.frombalance);
                totalToBalance += parseFloat(item.tobalance);
              });
              console.log('Total FromBalance:', totalFromBalance);
              console.log('Total ToBalance:', totalToBalance);
              this.total_child_FromBalance = totalFromBalance;
              this.total_child_ToBalance = totalToBalance;
            }else{
              let totalamount = 0;
              this.tb_child_report_list.forEach(item => {
                totalamount += parseFloat(item.amount);
              });
              console.log('Total FromBalance:', totalamount);
              this.total_child_amount = totalamount;
            }
          }    
          this.popupopen()
        }
        else{
          this.toastr.warning("","No Data Found" ,{timeOut:1200})
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }) 
  }

  todate_fun(){
    this.common_report.controls['to_date'].reset('')
  }
  
onScrollchild(){
  let page=this.presentpage_child+1
  this.end_of_reo=true;
  // if(this.view_edit=="fromdate"){
  //   this.dates=this.from_date_balance
  //     }else
       if(this.view_edit=="BR_View"){
        this.todate=this.to_date_balance
        this.fromdate=this.from_date_balance
      }else {
       this.fromdate=this.to_date_balance
      }
     let view_name=this.common_report.value.view?.id??""     
    let param
     let bs_ids=this.common_report.value.bs_id?.id??""
  let cc_id=this.common_report.value.cc_id?.id??""
  if(this.common_report.value.business=="" || this.common_report.value.business == undefined || this.common_report.value.business==null){
    this.common_report.controls['bs_id'].reset('')
  this.common_report.controls['cc_id'].reset('')
  }
  if(this.common_report.value.bs_id == "" || this.common_report.value.bs_id == null || this.common_report.value.bs_id == undefined){
    this.common_report.controls['cc_id'].reset('')
  }
     let business_id=this.common_report.value.business?.id??""
  this.chiledpage_index++ 
  let page_count=this.chiled_page_size*(this.chiledpage_index)
console.log("pagcount",page_count)
let counts=this.child_total_pages-page_count
console.log("countss",counts)
if(this.view_edit=="BR_View"){
 
  param=  {    "ls_group":"All_Reports",
    "type":this.view_edit, 
    "fromdate":this.datePipe.transform(this.common_report.value.from_date, 'yyyy-MM-dd'),
    "todate":this.datePipe.transform(this.common_report.value.to_date, 'yyyy-MM-dd'),
    "branch_id": this.data_branch_id?this.data_branch_id:"",
    "do_code": "",
    "business_id": business_id,
    "bs_id": bs_ids,
    "cc_id": cc_id,
    "subcatunique_no":  this.data_subcat_id,
    "flag": this.flages,
    "page_index": this.chiledpage_index, 
    "page_size": this.chiled_page_size
}
}else{
    param= 
    {  "ls_group":"All_Reports",
    "type":this.view_edit, 
    "fromdate":this.alldate,
    "todate":'',
    "branch_id": this.data_branch_id?this.data_branch_id:"",
    "do_code": "",
    "business_id": business_id,
    "bs_id": bs_ids,
    "cc_id": cc_id,
    "subcatunique_no":  this.data_subcat_id,
    "flag": this.flages,
    "page_index": this.chiledpage_index, 
    "page_size": this.chiled_page_size
}
}
  
    if(counts>0){  
      this.dataService.tb_business_summary(param,page)
      .subscribe((results: any[]) => {
      let datas = results["DATA"]; 
 
      this.tb_child_report_list = this.tb_child_report_list.concat(datas);
      this.original_child_data = [...this.tb_child_report_list];  

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      });
      // }

}else{
  this.end_of_reo=false;
  if(this.view_edit=="BR_View"){
    let totalFromBalance = 0;
    let totalToBalance = 0;
    this.tb_child_report_list.forEach(item => {
      totalFromBalance += parseFloat(item.frombalance);
      totalToBalance += parseFloat(item.tobalance);
    });
    console.log('Total FromBalance:', totalFromBalance);
    console.log('Total ToBalance:', totalToBalance);
    this.total_child_FromBalance = totalFromBalance;
    this.total_child_ToBalance = totalToBalance;
  }else{
    let totalamount = 0;
    this.tb_child_report_list.forEach(item => {
      totalamount += parseFloat(item.amount);
    });
    console.log('Total FromBalance:', totalamount);
    this.total_child_amount = totalamount;
  }
}
}

bs_clear() {
  this.common_report.controls['bs_id'].reset('')
  this.common_report.controls['cc_id'].reset('')
}
  Business_dropdown() {
    let prokeyvalue: String = "";
    this.getbusiness(prokeyvalue);
    this.common_report.get('business').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbusinessdropdown( value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;
       
      })
  }
 
  autocompletebusinessnameScroll() {
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
    let isApiCallInProgress = false;
    setTimeout(() => {
      if (
        this.business_nameautocomplete &&
        this.autocompleteTrigger &&
        this.business_nameautocomplete.panel
      ) {
        fromEvent(this.business_nameautocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.business_nameautocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.business_nameautocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.business_nameautocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.business_nameautocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true && !isApiCallInProgress) {
                isApiCallInProgress = true;
                this.dataService.getbusinessdropdown( this.businessInput.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.businessList = this.businessList.concat(datas);
                    if (this.businessList.length >= 0) {
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
  business_id = 0;
  private getbusiness(prokeyvalue) {
    this.dataService.getbusinessdropdown( prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;

      })
  }

  public displayfnbusiness(business_name?: tb_list): string | undefined {
    return business_name ? business_name.name : undefined;

  }

  branchname() {
    let bran_do
    let branch_flag
    if(this.role_per.name=="Admin"){
      if(this.common_report.value.view?.id===2){
        branch_flag =2
      }
    bran_do=this.common_report.value.branch_do?.code??""
    }else{
    bran_do=this.branch_value_code
    }
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.common_report.get('branch').valueChanges
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
    let bran_do
    let branch_flag
    if(this.role_per.name=="Admin"){
      if(this.common_report.value.view?.id===2){
        branch_flag =2
      }
    bran_do=this.common_report.value.branch_do?.code??""
    }else{
    bran_do=this.branch_value_code
    }
    this.tbservice.getbranchdropdown(prokeyvalue, 1,bran_do,branch_flag)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
  
      })
  }
  
  autocompletebranchnameScroll() {
    let bran_do
    let branch_flag
    if(this.role_per.name=="Admin"){
      if(this.common_report.value.view?.id===2){
        branch_flag =2
      }
    bran_do=this.common_report.value.branch_do?.code??""
    }else{
    bran_do=this.branch_value_code
    }
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

  branch_do_name() {
    let prokeyvalue: String = "";
    this.getbranch_do_id(prokeyvalue);
    this.common_report.get('branch_do').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.tbservice.getbranch_do_dropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branch_do_List = datas;
   
  
      })
  }
  
  private getbranch_do_id(prokeyvalue) {
    this.tbservice.getbranch_do_dropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branch_do_List = datas;
  
      })
  }
  
  autocompletebranch_do_nameScroll() {
    this.has_next_do_bra = true
    this.has_previous_do_bra = true
    this.currentpage_do_bra = 1
    setTimeout(() => {
      if (
        this.matAutocompletebranch_dos &&
        this.autocompleteTrigger &&
        this.matAutocompletebranch_dos.panel
      ) {
        fromEvent(this.matAutocompletebranch_dos.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebranch_dos.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebranch_dos.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebranch_dos.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebranch_dos.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next_do_bra === true) {
                this.tbservice.getbranch_do_dropdown(this.branch_do_Input.nativeElement.value, this.currentpage_do_bra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branch_do_List = this.branch_do_List.concat(datas);
                    if (this.branch_do_List.length >= 0) {
                      this.has_next_do_bra = datapagination.has_next;
                      this.has_previous_do_bra = datapagination.has_previous;
                      this.currentpage_do_bra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  
  public displayfnbranch_do(branch?: tb_list): string | undefined {
    return branch ?  branch.code +"-"+  branch.name: undefined;
  
  }


  selectbsSection(data) {
    this.cc_bs_id = data.id
  }



  onScroll(){
    let page=this.presentpage+1
    this.TB_end_of_reo = true
    if(this.common_report.value.from_date==""||this.common_report.value.from_date==undefined || this.common_report.value.from_date==null ){
      this.toastr.warning("Please Select Date 1")
      return false
    }
    if(this.common_report.value.to_date==""|| this.common_report.value.to_date==undefined || this.common_report.value.to_date==null ){
      this.toastr.warning("Please Select Date 2")
      return false
    }
    if(this.common_report.value.amount.id=="C" ){
      this.div_Amt_show="Amount In Crores"
        }else if(this.common_report.value.amount.id=="A"){
          this.div_Amt_show="Amount In Actuals"
        }else{
          this.div_Amt_show="Amount In Lakhs"
        }
        if(this.reports_value=="5"){
          this.flages=4
          this.repor_name="Cost of funds Report"
          this.child_repor_name="Cost of funds "
        }
        if(this.reports_value=="6"){
          this.flages=5
           this.repor_name="Gross Income Report"
           this.child_repor_name="Gross Income "
        }if(this.reports_value=="7"){
          this.flages=2
           this.repor_name="Non Interest Income Report"
           this.child_repor_name="Non Interest Income "
        }if(this.reports_value=="8"){
          this.flages=1
           this.repor_name="Establishment cost Report"
           this.child_repor_name="Establishment cost "
        }if(this.reports_value=="9"){
          this.flages=3
           this.repor_name="Other Operating Expenses Report"
           this.child_repor_name="Other Operating Expenses "
        }
        console.log("this.flagesss",this.flages)
          let flag=this.flages
        console.log("this.div_Amt_show",this.div_Amt_show)
        this.from_date_balance=this.datePipe.transform(this.common_report.value.from_date, 'yyyy-MM-dd') 
        this.to_date_balance=this.datePipe.transform(this.common_report.value.to_date, 'yyyy-MM-dd')       
        let branch_id
        let business_id=this.common_report.value.business?.id??""
         let gl_no=this.common_report.value.gl_no_id?.microsubcatcode??""
         let view_name
       let bs_ids=this.common_report.value.bs_id?.id??""
       let cc_id=this.common_report.value.cc_id?.id??""
       if(this.common_report.value.business=="" || this.common_report.value.business == undefined || this.common_report.value.business==null){
        this.common_report.controls['bs_id'].reset('')
      this.common_report.controls['cc_id'].reset('')
      }
      if(this.common_report.value.bs_id == "" || this.common_report.value.bs_id == null || this.common_report.value.bs_id == undefined){
        this.common_report.controls['cc_id'].reset('')
      }

      if(this.role_per.name=="Admin"){
        view_name=this.common_report.value.view?.type??""
        }
        let branch_view_in={"id":2,"name":"Branch Wise","type":"Branch_View"}
        if(this.brnach_login_id ==""){
         if(this.common_report.value.branch_do==="" || this.common_report.value.branch_do=== null || this.common_report.value.branch_do === undefined){

          branch_id=this.common_report.value.branch?.id??""
        }else{
        if(this.common_report.value.branch==="" || this.common_report.value.branch=== null || this.common_report.value.branch === undefined){
           branch_id=this.common_report.value.branch_do?.id??""
        }else{
         branch_id=this.common_report.value.branch_do?.id??""
        }
      }
    }else{
      branch_id= this.brnach_login_id
      view_name=branch_view_in?.type
    }     
         
         let branch_flags
        if(this.role_per.name=="Admin"){
          branch_flags=view_name
        // }else if(this.Do_permission['empbranch_ids'].length !=0 && this.role_per.name !="Admin"){
        //   branch_flags=5
        }else{
          branch_flags=2
        }
        this.page_index++
        let pag_count=this.page_size*(this.page_index)
        console.log("pagcount",pag_count)
        let countss=this.total_pages-pag_count
        console.log("countss",countss)
          let param= {  "ls_group":"All_Reports",
            "type":view_name, 
            "fromdate":this.from_date_balance,
            "todate":this.to_date_balance,
            "branch_id": branch_id,
            "do_code": "",
            "business_id": business_id,
            "bs_id": bs_ids,
            "cc_id": cc_id,
            "subcatunique_no": "",
            "flag": this.flages,
            "page_index": this.page_index,
            "page_size": this.page_size
        }
    if(countss>0){
    // this.SpinnerService.show()
    this.dataService.tb_business_summary(param,page)
    .subscribe((results: any[]) => {
      // this.SpinnerService.hide()
      let datas = results["DATA"];   
      this.page_index=this.page_index
      // this.tb_gl_report_list=datas
      
      // let dataPagination = results['pagination'];
      // console.log("dataPagination=>",dataPagination)
      // this.has_next = dataPagination.has_next;
      // this.has_previous = dataPagination.has_previous;
      // this.presentpage = dataPagination.index;  
       
      this.summary_list = this.summary_list.concat(datas);
      this.original_data = [...this.summary_list];
      console.log("sum",this.summary_list)
      }, error => {
        // this.Branch_data_show_hide=false;
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      });
    }else{
      this.TB_end_of_reo=false;
      let totalFromBalance = 0;
    let totalToBalance = 0;
    this.summary_list.forEach(item => {
      totalFromBalance += parseFloat(item.frombalance);
      totalToBalance += parseFloat(item.tobalance);
    });
    console.log('Total FromBalance:', totalFromBalance);
    console.log('Total ToBalance:', totalToBalance);

      this.totalFromBalance = totalFromBalance;
      this.totalToBalance = totalToBalance;
  }
  }
  tb_reset(){
    this.common_report.reset()
    this.Branch_data_show_hide=false;
    this.summary_list = []
    this.original_data = [];
  }


  gl_number() {
    if(this.reports_value=="5"){
      this.flages=4
      this.repor_name="Cost of funds Report"
      this.child_repor_name="Cost of funds "
    }
    if(this.reports_value=="6"){
      this.flages=5
       this.repor_name="Gross Income Report"
       this.child_repor_name="Gross Income "
    }if(this.reports_value=="7"){
      this.flages=2
       this.repor_name="Non Interest Income Report"
       this.child_repor_name="Non Interest Income "
    }if(this.reports_value=="8"){
      this.flages=1
       this.repor_name="Establishment cost Report"
       this.child_repor_name="Establishment cost "
    }if(this.reports_value=="9"){
      this.flages=3
       this.repor_name="Other Operating Expenses Report"
       this.child_repor_name="Other Operating Expenses "
    }
    let prokeyvalue: String = "";
    this.getglid(prokeyvalue);
    this.common_report.get('gl_no_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.tbservice.tb_gl_master_api(value, 1,this.flages,"")
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
    if(this.reports_value=="5"){
      this.flages=4
      this.repor_name="Cost of funds Report"
      this.child_repor_name="Cost of funds "
    }
    if(this.reports_value=="6"){
      this.flages=5
       this.repor_name="Gross Income Report"
       this.child_repor_name="Gross Income "
    }if(this.reports_value=="7"){
      this.flages=2
       this.repor_name="Non Interest Income Report"
       this.child_repor_name="Non Interest Income "
    }if(this.reports_value=="8"){
      this.flages=1
       this.repor_name="Establishment cost Report"
       this.child_repor_name="Establishment cost "
    }if(this.reports_value=="9"){
      this.flages=3
       this.repor_name="Other Operating Expenses Report"
       this.child_repor_name="Other Operating Expenses "
    }
    this.isLoading = true;
    this.tbservice.tb_gl_master_api(prokeyvalue, 1,this.flages,"")    
      .subscribe((results: any[]) => {
        this.isLoading = false;
        let datas = results["data"];
        this.gl_List = datas;
  
      })
  }
  
  autocompleteglnameScroll() {

    if(this.reports_value=="5"){
      this.flages=4
      this.repor_name="Cost of funds Report"
      this.child_repor_name="Cost of funds "
    }
    if(this.reports_value=="6"){
      this.flages=5
       this.repor_name="Gross Income Report"
       this.child_repor_name="Gross Income "
    }if(this.reports_value=="7"){
      this.flages=2
       this.repor_name="Non Interest Income Report"
       this.child_repor_name="Non Interest Income "
    }if(this.reports_value=="8"){
      this.flages=1
       this.repor_name="Establishment cost Report"
       this.child_repor_name="Establishment cost "
    }if(this.reports_value=="9"){
      this.flages=3
       this.repor_name="Other Operating Expenses Report"
       this.child_repor_name="Other Operating Expenses "
    }

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
                this.tbservice.tb_gl_master_api(this.glContactInput.nativeElement.value, this.currentpagegl + 1,this.flages,"")
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
    return gl ? gl.glno +" - "+ gl.name: undefined;
  
  }

  bsname_dropdown() {
 let business_id=this.common_report.value.business?.id??""
 if(this.common_report.value.business=="" || this.common_report.value.business == undefined || this.common_report.value.business ==null){
  this.toastr.warning("Please Select Business")
  return false
 }
    let prokeyvalue: String = "";
    this.getbsid(prokeyvalue);
    this.common_report.get('bs_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbsdropdown(business_id, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;
        // this.expand=false
        this.bsclear_name.nativeElement.value = ''

      })
  }

  private getbsid(prokeyvalue) {
     let business_id=this.common_report.value.business?.id??""
     if(this.common_report.value.business=="" || this.common_report.value.business == undefined || this.common_report.value.business ==null){
      this.toastr.warning("Please Select Business")
      return false
     }
    this.dataService.getbsdropdown(business_id, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;

      })
  }

  cc_bs_id = 0
  currentpagebs: any = 1
  has_nextbs: boolean = true
  has_previousbs: boolean = true
  autocompletebsnameScroll() {
     let business_id=this.common_report.value.business?.id??""
     if(this.common_report.value.business=="" || this.common_report.value.business == undefined || this.common_report.value.business ==null){
      this.toastr.warning("Please Select Business")
      return false
     }
    this.has_nextbs = true
    this.has_previousbs = true
    this.currentpagebs = 1
    let isApiCallInProgress = false; 
    setTimeout(() => {
      if (
        this.matAutocompletebs &&
        this.autocompleteTrigger &&
        this.matAutocompletebs.panel
      ) {
        fromEvent(this.matAutocompletebs.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebs.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebs.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebs.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebs.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbs === true  && !isApiCallInProgress) {
                isApiCallInProgress = true;
                this.dataService.getbsdropdown(business_id, this.bsInput.nativeElement.value, this.currentpagebs + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bsList = this.bsList.concat(datas);
                    if (this.bsList.length >= 0) {
                      this.has_nextbs = datapagination.has_next;
                      this.has_previousbs = datapagination.has_previous;
                      this.currentpagebs = datapagination.index;
                    }
                    isApiCallInProgress = false;
                  })
              }
            }
          });
      }
    });
  }

  public displayfnbs(bs?: tb_list): string | undefined {
    return bs ? bs.name : undefined;

  }


  ccname_dropdown() {
    if(this.common_report.value.bs_id=="" || this.common_report.value.bs_id == undefined || this.common_report.value.bs_id ==null){
      this.toastr.warning("Please Select BS")
      return false
     }
    let prokeyvalue: String = "";
    this.getccid(prokeyvalue);
    this.common_report.get('cc_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getccdropdown(this.cc_bs_id, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;
        // for (let levelslist of this.levelslist) {

        //   levelslist.expanded = false
        // }
        // this.data4aexp = true
        // this.dataaexp = true
        // this.dataaexpone = true
        // this.levelsdatavalueoneexp = ''
        // this.levels4adatas = ''
        // this.levelstwodatas = ''
        // this.levelsonedatas = ''
        // this.levelsdatas = ''
        // this.levels5adatas = ''
      })
  }



  private getccid(prokeyvalue) {
    if(this.common_report.value.bs_id=="" || this.common_report.value.bs_id == undefined || this.common_report.value.bs_id ==null){
      this.toastr.warning("Please Select BS")
      return false
     }
    this.dataService.getccdropdown(this.cc_bs_id, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;

      })
  }

  currentpagecc: any = 1
  has_nextcc: boolean = true
  has_previouscc: boolean = true
  autocompletccnameScroll() {
    if(this.common_report.value.bs_id=="" || this.common_report.value.bs_id == undefined || this.common_report.value.bs_id ==null){
      this.toastr.warning("Please Select BS")
      return false
     }
    this.has_nextcc = true
    this.has_previouscc = true
    this.currentpagecc = 1
    let isApiCallInProgress = false;
    setTimeout(() => {
      if (
        this.matAutocompletecc &&
        this.autocompleteTrigger &&
        this.matAutocompletecc.panel
      ) {
        fromEvent(this.matAutocompletecc.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletecc.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletecc.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletecc.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletecc.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcc === true && !isApiCallInProgress) {
                isApiCallInProgress = true;
                this.dataService.getccdropdown(this.cc_bs_id, this.ccInput.nativeElement.value, this.currentpagecc + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ccList = this.ccList.concat(datas);
                    if (this.ccList.length >= 0) {
                      this.has_nextcc = datapagination.has_next;
                      this.has_previouscc = datapagination.has_previous;
                      this.currentpagecc = datapagination.index;
                    }
                    isApiCallInProgress = false;
                  })
              }
            }
          });
      }
    });
  }


  public displayfncc(cc_name?: tb_list): string | undefined {
    return cc_name ? cc_name.name : undefined;

  }

  hide_icon(){
    this.arrow_icon_up = false
    setTimeout(() => {
      this.Screendownload();
  }, 500);  
}

  Screendownload() {  
    if (this.common_report.value.from_date == "" || this.common_report.value.from_date == undefined || this.common_report.value.from_date == null) {
        this.toastr.warning("Please Select From Date");
        return false;
    }
    if (this.common_report.value.to_date == "" || this.common_report.value.to_date == undefined || this.common_report.value.to_date == null) {
        this.toastr.warning("Please Select To Date");
        return false;
    }
    this.SpinnerService.show()

    let profit = document.getElementById('datatable');
    console.log("profit=>", profit);

    const p_table: XLSX.WorkSheet = XLSX.utils.table_to_sheet(profit);
    console.log("p_table=>", p_table);

    let profitability: any = XLSX.utils.sheet_to_json(p_table, { header: 1 });
    const arr = Array(profitability[0].length).fill("");
    let cal = Math.floor(arr.length / 2);
    console.log(arr, cal);
    profitability.splice(0, 0, arr);
    console.log("profitability=>", profitability);

    let max_length = Math.max(arr.length);
    let head_report = [];
    head_report.push(Array(max_length).fill(""));
    head_report.push(Array(max_length + 1).fill(""));
    console.log("head_report=>", head_report);

    let header_position = Math.floor(max_length / 2);
    head_report[1].splice(header_position, 0, this.repor_name);

    let xlsxparam: any = {};
    let xlsx_len = 1;
    for (let xlsx in this.xlsx_param) {
        console.log("xlsx_param 1=>", xlsx);
        console.log("xlsx_param 2=>", this.xlsx_param);
        if (this.xlsx_param[xlsx] != "") {
            xlsxparam[xlsx] = this.xlsx_param[xlsx];
        }
    }
    console.log("xlsx=>", xlsxparam);
    if (Object.values(xlsxparam).length != 0) {
        xlsx_len = Object.values(xlsxparam).length;
    }
    for (let xlsx in xlsxparam) {
        for (let i = 1; i <= xlsx_len; i++) {
            head_report[0].splice(xlsx_len[i], 0, xlsx + ":" + xlsxparam[xlsx]);
            break;
        }
    }
    profitability.splice(0, 0, head_report[0]);
    profitability.splice(0, 0, head_report[1]);

    console.log("table=>", profitability);
    let filteredProfitability = profitability.map(row => row.filter(cell => {
        if (typeof cell === 'string') {
            return !cell.includes('Branch View') && !cell.includes('visibility');
        } else if (typeof cell === 'object' && cell.hasOwnProperty('v') && typeof cell.v === 'string') {
            return !cell.v.includes('Branch View') && !cell.v.includes('visibility');
        }
        return true;
    }));
    console.log("filteredProfitability=>", filteredProfitability);

    // Convert filtered data to worksheet
    let worksheet = XLSX.utils.json_to_sheet(filteredProfitability, { skipHeader: true });
    console.log("worksheet=>", worksheet);

    // Calculate column widths
    const colWidths = filteredProfitability[0].map((col: any, i: number) => {
        let maxLength = 0;
        filteredProfitability.forEach((row: any) => {
            const cell = row[i] ? row[i].toString() : "";
            maxLength = Math.max(maxLength, cell.length);
        });
        return { wch: maxLength + 2 }; // Add padding for better appearance
    });

    // Assign column widths
    worksheet['!cols'] = colWidths;

    const new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, this.repor_name);  
    XLSX.writeFile(new_workbook, this.repor_name + ".xlsx");
    this.arrow_icon_up = true
    this.SpinnerService.hide()
}



  Screen_childdownload() {
    let profit = document.getElementById('datastable');
    console.log("profit=>", profit);

    const p_table: XLSX.WorkSheet = XLSX.utils.table_to_sheet(profit);
    console.log("p_table=>", p_table);

    let profitability: any = XLSX.utils.sheet_to_json(p_table, { header: 1 });
    const arr = Array(profitability[0].length).fill("");
    let cal = Math.floor(arr.length / 2);
    console.log(arr, cal);
    profitability.splice(0, 0, arr);
    console.log("profitability=>", profitability);

    let max_length = Math.max(arr.length);
    let head_report = [];
    head_report.push(Array(max_length).fill(""));
    head_report.push(Array(max_length + 1).fill(""));
    console.log("head_report=>", head_report);

    let header_position = Math.floor(max_length / 2);
    head_report[1].splice(header_position, 0, this.view_edit == "BR_View" ? this.child_repor_name + 'Branch Report' : this.child_repor_name + 'BSCC Report');

    let xlsxparam: any = {};
    let xlsx_len = 1;
    for (let xlsx in this.child_xlsx_param) {
        console.log("xlsx_param 1=>", xlsx);
        console.log("xlsx_param 2=>", this.child_xlsx_param);
        if (this.child_xlsx_param[xlsx] != "") {
            xlsxparam[xlsx] = this.child_xlsx_param[xlsx];
        }
    }
    console.log("xlsx=>", xlsxparam);
    if (Object.values(xlsxparam).length != 0) {
        xlsx_len = Object.values(xlsxparam).length;
    }
    for (let xlsx in xlsxparam) {
        for (let i = 1; i <= xlsx_len; i++) {
            head_report[0].splice(xlsx_len[i], 0, xlsx + ":" + xlsxparam[xlsx]);
            break;
        }
    }
    profitability.splice(0, 0, head_report[0]);
    profitability.splice(0, 0, head_report[1]);
    console.log("table=>", profitability);

    let worksheet = XLSX.utils.json_to_sheet(profitability, { skipHeader: true });
    console.log("worksheet=>", worksheet);

    // Calculate column widths
    const colWidths = profitability[0].map((col: any, i: number) => {
        let maxLength = 0;
        profitability.forEach((row: any) => {
            const cell = row[i] ? row[i].toString() : "";
            maxLength = Math.max(maxLength, cell.length);
        });
        return { wch: maxLength + 2 }; // Add padding for better appearance
    });

    // Assign column widths
    worksheet['!cols'] = colWidths;

    const new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, this.repor_name);
    XLSX.writeFile(new_workbook, this.repor_name + ".xlsx");
    this.arrow_icon_up = true
}



sortData(property: string, order: 'asc' | 'desc'): void {
  this.summary_list.sort((a, b) => {
    if (order === 'asc') {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
    } else if (order === 'desc') {
      if (a[property] > b[property]) return -1;
      if (a[property] < b[property]) return 1;
    }
    return 0;
  });
}

sortamount(direction): void {
  this.summary_list.sort((a, b) => {
    // Calculate the values for comparison
    const aFromBalance = a.frombalance / this.amount_division * -1;
    const bFromBalance = b.frombalance / this.amount_division * -1;
    const aToBalance = a.tobalance / this.amount_division * -1;
    const bToBalance = b.tobalance / this.amount_division * -1;

    // Determine sort order
    const sortOrder = direction === 'asc' ? 1 : -1;

    // Compare based on the sort order
    if (aFromBalance < bFromBalance) return -1 * sortOrder;
    if (aFromBalance > bFromBalance) return 1 * sortOrder;

    if (aToBalance < bToBalance) return -1 * sortOrder;
    if (aToBalance > bToBalance) return 1 * sortOrder;

    return 0;
  });
}
original_dsummary(){
  this.summary_list = [...this.original_data];  
}

sort_child_amount(direction: 'asc' | 'desc', field: 'frombalance' | 'tobalance'): void {
  this.tb_child_report_list.sort((a, b) => {
    const aValue = field === 'frombalance' 
      ? a.frombalance / this.amount_division * -1 
      : a.tobalance / this.amount_division * -1;
    const bValue = field === 'frombalance' 
      ? b.frombalance / this.amount_division * -1 
      : b.tobalance / this.amount_division * -1;

    const sortOrder = direction === 'asc' ? 1 : -1;

    if (aValue < bValue) return -1 * sortOrder;
    if (aValue > bValue) return 1 * sortOrder;

    return 0;
  });
}

sort_child_Data(property: string, order: 'asc' | 'desc'): void {
  this.tb_child_report_list.sort((a, b) => {
    if (order === 'asc') {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
    } else if (order === 'desc') {
      if (a[property] > b[property]) return -1;
      if (a[property] < b[property]) return 1;
    }
    return 0;
  });
}
sort_bscc_amount(direction: 'asc' | 'desc'): void {
  this.tb_child_report_list.sort((a, b) => {
    const aValue = a.amount;
    const bValue = b.amount;

    const sortOrder = direction === 'asc' ? 1 : -1;

    return (aValue - bValue) * sortOrder;
  });
}

original_child_dsummary(){
  this.tb_child_report_list = [...this.original_child_data];  
}

hide_child_icon(){
  this.arrow_icon_up = false
  setTimeout(() => {
    this.Screen_childdownload();
}, 500);  
}

backend_download(){
  if(this.common_report.value.from_date==""||this.common_report.value.from_date==undefined || this.common_report.value.from_date==null ){
    this.toastr.warning("Please Select Date 1")
    return false
  }
  if(this.common_report.value.to_date==""|| this.common_report.value.to_date==undefined || this.common_report.value.to_date==null ){
    this.toastr.warning("Please Select Date 2")
    return false
  }
  if(this.reports_value=="5"){
    this.flages=4
    this.type=3
     this.repor_name="Cost Of Funds Report"
  }
  if(this.reports_value=="6"){
    this.flages=5
    this.type=4
    this.repor_name="Gross Income Report"
  }if(this.reports_value=="7"){
    this.flages=2
    this.type=5
    this.repor_name="Non Interest Income Report"
  }if(this.reports_value=="8"){
    this.flages=1
    this.type=6
    this.repor_name="Establishment Cost Report"
  }if(this.reports_value=="9"){
    this.flages=3
    this.type=7
     this.repor_name="Other Operating Expenses Report"
  }
  this.from_date_balance=this.datePipe.transform(this.common_report.value.from_date, 'yyyy-MM-dd') 
  this.to_date_balance=this.datePipe.transform(this.common_report.value.to_date, 'yyyy-MM-dd')
  let amount_div
  if(this.common_report.value.amount?.id=="C" ){
    amount_div=this.common_report.value.amount?.id
      }else if(this.common_report.value.amount?.id=="A"){
        amount_div=this.common_report.value.amount?.id
      }else{
        amount_div="L"
      }
      let branch_id
      if(this.role_per.name=="Admin"){
        branch_id=""        
        }else{
          branch_id=this.brnach_login_id   
        }
  let param={
    "fromdate":this.from_date_balance,
    "todate":this.to_date_balance,
    "flag":this.flages,
    "type":this.type,
    "file_name":this.repor_name,
    "branch_id":branch_id,
    "business_id":this.common_report.value.business?.id??"",
    "bs_id":this.common_report.value.bs_id?.id??"",
    "cc_id":this.common_report.value.cc_id?.id??"",
    "div_amt":amount_div
  }
  this.SpinnerService.show()
  this.dataService.backeend_download(param)
    .subscribe((results: any) => {
      this.SpinnerService.hide()
      // let datas = results["data"];
      console.log("results",results)
      if(results.status==="Success"){
        this.toastr.success("", 'File Generate Start...', { timeOut: 1500 })
      }else{
        this.toastr.warning(results)
      }
    })
}

}
