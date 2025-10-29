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
}

@Component({
  selector: 'app-tb-report',
  templateUrl: './tb-report.component.html',
  styleUrls: ['./tb-report.component.scss'],
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
export class TBReportComponent implements OnInit {
  @ViewChild("closeaddpopup") closeaddpopup;
  @ViewChild('businessInput') businessInput: any;
  @ViewChild('business_name') business_nameautocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('glContactInput')glContactInput:any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  @ViewChild('branch_dos') matAutocompletebranch_dos: MatAutocomplete;
  @ViewChild('branch_do_Input') branch_do_Input: any;
    //bs

    @ViewChild('bsInput') bsInput: any;
    @ViewChild('bs') matAutocompletebs: MatAutocomplete;
  
    //cc
    @ViewChild('ccInput') ccInput: any;
    @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;
 
    @ViewChild('bsclear_nameInput') bsclear_name;
 
  TBsummaryObjNew:any;
  TB_child_summaryObjNew:any;
  ppr_env=environment.apiURL
  reportsearch: any;
  tb_reports: boolean=true;
  tb_gl: boolean;
  laksh_amount:any
  div_Amt_show: string;
  divamount: any;
  Amount_List:any=[{"id":"C","name":"Crores"},{"id":"L","name":"Lakhs"},{"id":"A","name":"Actuals"}]
  view_List:any=[{"id":1 ,"name":"Bank As a Whole","type":"Bank_As_Whole"},{"id":2,"name":"Branch Wise","type":"Branch_View"}]
  isLoading: boolean;
  businessList: any;
  has_nextbra: boolean;
  has_previousbra: boolean;
  currentpagebra: number;
  branchList: any;
  from_date_balance: string;
  to_date_balance: string;
  has_next: boolean=true;
  has_previous: boolean;
  presentpage: any;
  summary_list: any = [];
  original_data: any = [];
  tb_child_report_list: any;
  original_child_data : any = [];  
  has_next_child: any;
  has_previous_child: any;
  presentpage_child: any;
  has_nextbss: boolean;
  has_previousbss: boolean;
  currentpagebss: number;
  from_head_date: string;
  to_head_date: string;
  dates: string;
  data_business_id: any;
  data_branch_id: any;
  view_branch: boolean=false;
  role_per:any;
  Branch_data_show_hide:boolean=false;
  table_headers:boolean;
  brach_dd_hide:boolean=false;
  branch_wise_data: boolean;
  view_edit: any;
  todate: string;
  fromdate: string;
  do_view: boolean;
  Do_permission:any;
  branch_name_headers:boolean;
  branch_do_List: any;
  branch_value_code: any;
  has_next_do_bra: boolean;
  has_previous_do_bra: boolean;
  currentpage_do_bra: number;
  bsList: any;
  ccList: any;
  total_pages: any;
  page_index: number=0;
  page_size: number=100;
  end_of_report: boolean;
  chiled_page_size: number;
  chiledpage_index: number;
  child_total_pages: number;
  child_view_date: any;
  childend_of_report: boolean;
  pagesss: number;
  cc_id: any;
  amount_division:any= 100000;
  ccunique: any;
  child_xlsx_param: any;
  arrow_icon_up:boolean =true;
  totalFromBalance: number;
  totalToBalance: number;
  total_child_FromBalance: number;
  total_child_ToBalance: number;
  total_child_amount: number;
  maxDate: Date = new Date();
  brnach_login_id: any;

  constructor(private fb:FormBuilder ,private datePipe: DatePipe,private errorHandler: ErrorhandlingService, public tbservice: TbReportService , private dataService:TbReportService,private vrtshardserv:VertSharedService,private SpinnerService:NgxSpinnerService,private toastr: ToastrService) { 
    // this.Branchfield = {
    //   label: "Branch Name",
    //   method: "get",
    //   url: this.ppr_env +"usrserv/empbranch_search" ,
    //   // "userserv/empbranch_search"
    //   params: "",
    //   searchkey: "query",
    //   displaykey: "codename",
    //   // wholedata: true,
    //   Outputkey:"id"
    // }
    // this.Businessfield = {
    //   label: "Core BS",
    //   method: "get",
    //   url: this.ppr_env + "pprservice/ppr_mstbusiness_segment",
    //   params: "",
    //   searchkey: "query",
    //   displaykey: "name",
    //   // wholedata: true,
    //   Outputkey:"id"
    // }
    // this.laksh_amount = {
    //   label: "Amount Dinamination",
    //  data:[{"id":"C","name":"Crores"},{"id":"L","name":"Lakhs"},{"id":"A","name":"Actuals"}],
    //   params: "",
    //   searchkey: "",
    //   displaykey: "name",    
    //   Outputkey:"id",
    //   fronentdata:true,
    // }
  }
  tb_report:FormGroup;
  branch_name_show:any;
  ngOnInit(): void {
    this.tb_report=this.fb.group({
      from_date:[],
      to_date:[],
      branch:[],
      business:[],
      amount:[],
      view:[],
      branch_do:[],
      bs_id:[],
      cc_id:[]
    })
    this.role_per=this.vrtshardserv.role_permission.value
    console.log("rolessssssssss",this.role_per)
    this.branch_value_code=this.vrtshardserv.Branch_value.value
    this.Do_permission=this.vrtshardserv.Branch_value_do.value    
    this.branch_name_show=this.vrtshardserv.Branch_value_show.value;
    this.brnach_login_id=this.vrtshardserv.Branchwiselogin_id.value;
    console.log("Do_permission",this.Do_permission['empbranch_ids'].length,"branch_name_show",this.branch_name_show,this.brnach_login_id)
    if(this.role_per.name=="Admin"){
      this.view_branch=true;
      this.brach_dd_hide=true;
      this.table_headers=false;
      this.brnach_login_id=""
    }else{
      if(this.Do_permission['empbranch_ids'].length !=0){
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


// this.tb_summary({})
// this.reportsearch = [{"type":"twodates","fromobj":{label: "From Date",formvalue:"fromdate"},"toobj":{label: "To Date",formvalue:"todate"}}, {"type":"dropdown",inputobj:this.Branchfield,formvalue:"branch_id"},{"type":"dropdown",inputobj:this.Businessfield,formvalue:"business_id"},{"type":"dropdown",inputobj: this.laksh_amount,formvalue:"div_amount" }]
  }
  xlsx_param: any;
  Businessfield:any 
  Branchfield:any;
//   TBsummaryData:any  = [{ "columnname": "Branch Name", "key": "branch_name"},
//   {"columnname": "Business Name", "key": "business_name","style":{color:"blue",cursor:"pointer"}, function :true , clickfunction:this.tb_child_data.bind(this)},   
//   {"columnname": "Transaction Date", "key": "transactiondate",}, 
//   {"columnname": "Credit Amount", "key": "credit_amount", "type":"Amount"}, 
//   {"columnname": "Debit Amount", "key": "debit_amount","type":"Amount"},    
// ]
// TB_child_summaryData:any=[
//   { "columnname": "Business Name", "key": "bs_name"},
//   {"columnname": "Category", "key": "cc_name",},   
//   {"columnname": "Credit Amount" , "key": "credit_amount","type":"Amount"},
//   {"columnname": "Debit Amount ", "key": "debit_amount","type":"Amount"},
//   {"columnname": "Transaction Date", "key": "transactiondate",}
// ]

toda_reset_fun(){
  if(this.role_per.name=="Admin"){
    this.tb_report.controls['business'].reset('')
    this.tb_report.controls['amount'].reset('')
    this.tb_report.controls['gl_no_id'].reset('')
    this.tb_report.controls['branch'].reset('')
    this.tb_report.controls['branch_do'].reset('')
    this.tb_report.controls['view'].reset('')
    this.tb_report.controls['bs_id'].reset('')
    this.tb_report.controls['cc_id'].reset('')
    // }else if(this.Do_permission['empbranch_ids'].length !=0 && this.role_per.name !="Admin"){
    //   this.tb_report.controls['bs_id'].reset('')
    //   this.tb_report.controls['cc_id'].reset('')
    //   this.tb_report.controls['business'].reset('')
    // this.tb_report.controls['amount'].reset('')
    // this.tb_report.controls['gl_no_id'].reset('')
    // this.tb_report.controls['branch'].reset('')
    }else{
      this.tb_report.controls['bs_id'].reset('')
      this.tb_report.controls['cc_id'].reset('')
      this.tb_report.controls['business'].reset('')
    this.tb_report.controls['amount'].reset('')
    this.tb_report.controls['gl_no_id'].reset('')
    }
  this.Branch_data_show_hide=false;
}

bs_clear() {
  this.tb_report.controls['bs_id'].reset('')
  this.tb_report.controls['cc_id'].reset('')
}

  branch_hide(branch){
    this.summary_list = []
    this.original_data = []
    this.Branch_data_show_hide=false
    if(branch.id==1){
      this.brach_dd_hide=false;
      this.branch_name_headers=false;
      this.do_view=false;
      this.tb_report.controls['branch'].reset('')
      this.tb_report.controls['branch_do'].reset('')
      this.tb_report.controls['business'].reset('')
      this.tb_report.controls['amount'].reset('')
      this.tb_report.controls['branch'].reset('')
      this.tb_report.controls['bs_id'].reset('')
      this.tb_report.controls['cc_id'].reset('')
    }else if(branch.id==2){
      this.branch_name_headers=true;
      this.brach_dd_hide=true;
      this.do_view=false;
      this.tb_report.controls['branch'].reset('')
      this.tb_report.controls['branch_do'].reset('')
      this.tb_report.controls['business'].reset('')
      this.tb_report.controls['amount'].reset('')
      this.tb_report.controls['branch'].reset('')
      this.tb_report.controls['bs_id'].reset('')
      this.tb_report.controls['cc_id'].reset('')
    }else{
      this.branch_name_headers=true;
      this.brach_dd_hide=true;
      this.table_headers=false;
      this.do_view=true;    
      this.tb_report.controls['branch'].reset('')
      this.tb_report.controls['branch_do'].reset('')
      this.tb_report.controls['business'].reset('')
      this.tb_report.controls['amount'].reset('')
      this.tb_report.controls['branch'].reset('')
      this.tb_report.controls['bs_id'].reset('')
      this.tb_report.controls['cc_id'].reset('')
    }
    }
  
    do_view_dd(branch){
      this.tb_report.controls['branch'].reset('')
  if(branch == "" || branch ==null || branch==undefined){
    this.brach_dd_hide=false;
     this.branch_name_headers=true;
  }else{
    this.brach_dd_hide=true;
    this.branch_name_headers=true;
  }
    }

    
bs_cc_clear() {
  this.tb_report.controls['cc_id'].reset('')
} 

  tb_summary(event,page=1){
    this.page_index = 0
    this.end_of_report = true
    console.log("Eventss",event)   
    if(this.tb_report.value.from_date==""|| this.tb_report.value.from_date==undefined || this.tb_report.value.from_date==null ){
      this.toastr.warning("Please Select Date 1")
      return false
    }
    if(this.tb_report.value.to_date==""|| this.tb_report.value.to_date==undefined || this.tb_report.value.to_date==null ){
      this.toastr.warning("Please Select Date 2")
      return false
    }
    if(this.role_per.name=="Admin"){
    if(this.tb_report.value.view == "" || this.tb_report.value.view == undefined || this.tb_report.value.view==null){
      this.toastr.warning("Please Select View Type")
      return false
    }
    if(this.tb_report.value.view.id == 2){
      if(this.tb_report.value.branch == null || this.tb_report.value.branch == undefined || this.tb_report.value.branch == ''){
        this.toastr.warning("Please Select Branch")
        return false
      }
    }
  }
  if(this.tb_report.value.business=="" || this.tb_report.value.business == undefined || this.tb_report.value.business==null){
    this.tb_report.controls['bs_id'].reset('')
this.tb_report.controls['cc_id'].reset('')
  }
  if(this.tb_report.value.bs_id == "" || this.tb_report.value.bs_id == null || this.tb_report.value.bs_id == undefined){
    this.tb_report.controls['cc_id'].reset('')
  }
    if(this.tb_report.value.amount?.id=="C" ){
      this.div_Amt_show="Amount In Crores"
        }else if(this.tb_report.value.amount?.id=="A"){
          this.div_Amt_show="Amount In Actuals"
        }else{
          this.div_Amt_show="Amount In Lakhs"
        }
        this.divamount=this.tb_report.value.amount?this.tb_report.value.amount.id:""
    // this.TBsummaryObjNew = { "method": "post", 
    // "url": this.ppr_env + "reportserv/get_transaction_drcr",
    //  "data":event,
    //  ScrollPagination:true,
    //  nospinner:true,
    // }
    this.from_date_balance=this.datePipe.transform(this.tb_report.value.from_date, 'yyyy-MM-dd') 
  this.to_date_balance=this.datePipe.transform(this.tb_report.value.to_date, 'yyyy-MM-dd')
  this.from_head_date=this.datePipe.transform(this.tb_report.value.from_date, 'dd-MM-yyyy')
  this.to_head_date=this.datePipe.transform(this.tb_report.value.to_date, 'dd-MM-yyyy')
  let branch_id
  let business_id=this.tb_report.value.business?.id??""
  let view_name
let bs_id=this.tb_report.value.bs_id?.id??""
let cc_id=this.tb_report.value.cc_id?.id??""
if(this.role_per.name=="Admin"){
view_name=this.tb_report.value.view?.type??""
}
let branch_view_in={"id":2,"name":"Branch Wise","type":"Branch_View"}
if(this.brnach_login_id ==""){
  if(this.tb_report.value.branch_do==="" || this.tb_report.value.branch_do=== null || this.tb_report.value.branch_do === undefined){

    branch_id=this.tb_report.value.branch?.id??""
  }else{
  if(this.tb_report.value.branch==="" || this.tb_report.value.branch=== null || this.tb_report.value.branch === undefined){
     branch_id=this.tb_report.value.branch_do?.id??""
  }else{
   branch_id=this.tb_report.value.branch_do?.id??""
  }
}
}else{
  branch_id= this.brnach_login_id
  view_name=branch_view_in?.type
}

// if(this.tb_report.value.view?.id==1){
  // if(child_views === 'GL_View'){
  //   view_name=child_views
  //   this.popupopen()
  // }else{

  // }
// }
// else if(this.tb_report.value.view?.id==2){
  // if(child_views === 'BR_View'){
  //   view_name=child_views
  //   this.popupopen()
  // }else{
  // view_name=this.tb_report.value.view?.type
  // }
// }
  // let branch_flags
  // if(this.role_per.name=="Admin"){
  //   branch_flags=view_name
  // }else if(this.Do_permission['empbranch_ids'].length !=0 && this.role_per.name !="Admin"){
  //   branch_flags=5
  // }else{
  //   branch_flags=2
  // }

    let param={
      "ls_group":event,
      "type":view_name, 
      "fromdate": this.from_date_balance,
      "todate": this.to_date_balance,
      "branch_id": branch_id,
      "do_code": "",
      "business_id": business_id,
      "bs_id": bs_id,
      "cc_id": cc_id,
      "subcatunique_no":"",
      "ccunique_no":'',
      "flag": "",
      "page_index": this.page_index,
      "page_size":   this.page_size
    }

    this.xlsx_param={        
       "Amount" :this.div_Amt_show,
       "Branch Name": this.tb_report.value.branch?.name??"",
       "Business Name": this.tb_report.value.business?.name??"",
       "BS Name":this.tb_report.value.bs_id?.name??"",
       "CC Name":this.tb_report.value.cc_id?.name??"",
      "Date 1": this.from_head_date, 
      "Date 2": this.to_head_date,}
    console.log("param",param)
    this.SpinnerService.show()
      this.dataService.tb_business_summary(param,page)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["DATA"];  
        this.amount_division = (this.tb_report.value.amount?.id == 'L' ? 100000  : (this.tb_report.value.amount?.id == 'C' ? 10000000 : (this.tb_report.value.amount?.id == 'A' ? 1 : 100000)))     
        // let dataPagination = results['pagination'];
        view_name=""
        this.summary_list=datas 
        this.original_data = [...this.summary_list];
        this.Branch_data_show_hide=true
        if(this.summary_list.length!=0){
          this.total_pages=datas[0]["Total_Row"]
          console.log("total",datas[0]["Total_Row"])
          let count = 100*1
          let value = this.total_pages-count
          if(value<0){
            this.end_of_report = false
            let totalFromBalance = 0;
            let totalToBalance = 0;
            this.summary_list.forEach(item => {
              totalFromBalance += parseFloat(item.from_amount);
              totalToBalance += parseFloat(item.to_amount);
            });
            console.log('Total FromBalance:', totalFromBalance);
            console.log('Total ToBalance:', totalToBalance);
        
              this.totalFromBalance = totalFromBalance;
              this.totalToBalance = totalToBalance;
          }
          // if(this.role_per.name=="Admin"){

          // }else{          
          //   // this.Branch_name_Show=this.summary_list[0].branch_name
          // console.log("  this.summary_list[0].branch_name",  this.summary_list[0].branch_name)
          // }     
          // console.log("dataPagination=>",dataPagination)
          // this.has_next = dataPagination.has_next;
          // this.has_previous = dataPagination.has_previous;
          // this.presentpage = dataPagination.index;  
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
  glreport(){
    this.tb_gl=true;
    this.tb_reports=false;
  }

  Branchfield_Event(data){
    console.log("Branchfield_Event",data)
    this.tb_report.patchValue({
      branch : data
    })
  }
  Businessfield_Event(data){
    console.log("Businessfield_Event",data)
    this.tb_report.patchValue({
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

  tb_child_data(datas,data, child_view,page=1){
    this.childend_of_report = true
    this.view_edit=data
    console.log("datas",data)
    if(data=="BR_View"){
    this.branch_wise_data=false;
    this.todate=this.to_date_balance
    this.fromdate=this.from_date_balance
    }else {
      this.branch_wise_data=true;
      this.dates=this.to_date_balance
    }
    this.child_view_date=child_view
    this.data_business_id= datas.business_id
    this.data_branch_id=datas.branch_id
    this.cc_id=datas.cc_id
    this.ccunique = datas.ccunique_no
    let bs_id=this.tb_report.value.bs_id?.id??""
    let cc_id=this.tb_report.value.cc_id?.id??""
    let param
    this.chiled_page_size=100
    this.chiledpage_index=0
      if(data=="BR_View"){
        param={
          "ls_group":'TB_Report',
          "type":data, 
          "fromdate":this.from_date_balance,
          "todate": this.to_date_balance,
          "branch_id": datas?.branch_id??"",
          "do_code": "",
          "business_id":"",
          "bs_id": datas.business_id,
          "cc_id": datas.cc_id,
          "subcatunique_no":"",
          "flag": "",
          "page_index":this.chiledpage_index ,
          "page_size": this.chiled_page_size,
          "ccunique_no":datas.ccunique_no ? datas.ccunique_no : ''
        }
      }else{
        param={
          "ls_group":'TB_Report',
          "type":data, 
          "fromdate":child_view,
          "todate": "",
          "branch_id": datas?.branch_id??"",
          "do_code": "",
          "business_id": "",
          "bs_id": datas.business_id,
          "cc_id":datas.cc_id,
          "subcatunique_no":"",
          "flag": "",
          "page_index":this.chiledpage_index ,
          "page_size": this.chiled_page_size,
          "ccunique_no":datas.ccunique_no ? datas.ccunique_no : ''
        }
      }
      this.child_xlsx_param={        
        "Amount" :this.div_Amt_show,
        "Branch Name": this.tb_report.value.branch?.name??"",
        "Business Name": this.tb_report.value.business?.name??"",
        "Business Segment ": datas.business_name ? datas.business_name : '',
        "Cost Center ": datas.cc_name ? datas.cc_name:'',
        "Date 1": this.from_head_date, 
        "Date 2": this.to_head_date,}
        this.SpinnerService.show()
        this.dataService.tb_business_summary(param,page)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide()
          let datas = results["DATA"];   
          this.tb_child_report_list=datas
          let dataPagination = results['pagination'];
          console.log("dataPagination=>",dataPagination)
          
          this.tb_child_report_list=datas 
          this.original_child_data = [...this.tb_child_report_list];  
          if(this.tb_child_report_list.length!=0){
            this.child_total_pages=datas[0]["Total_Row"]
            let count = 100*1
            let value = this.child_total_pages-count
            if(value<0){
              this.childend_of_report = false
              if(data=="BR_View"){
                let totalFromBalance = 0;
                let totalToBalance = 0;
                this.tb_child_report_list.forEach(item => {
                  totalFromBalance += parseFloat(item.from_amount);
                  totalToBalance += parseFloat(item.to_amount);
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
    this.tb_report.controls['to_date'].reset('')
  }

  Business_dropdown() {
    let prokeyvalue: String = "";
    this.getbusiness(prokeyvalue);
    this.tb_report.get('business').valueChanges
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
    this.has_nextbss = true
    this.has_previousbss = true
    this.currentpagebss = 1
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
              if (this.has_nextbss === true && !isApiCallInProgress) {
                isApiCallInProgress = true; 
                this.dataService.getbusinessdropdown( this.businessInput.nativeElement.value, this.currentpagebss + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.businessList = this.businessList.concat(datas);
                    if (this.businessList.length >= 0) {
                      this.has_nextbss = datapagination.has_next;
                      this.has_previousbss = datapagination.has_previous;
                      this.currentpagebss = datapagination.index;
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

    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    let bran_do
    let branch_flag
    if(this.role_per.name=="Admin"){
      if(this.tb_report.value.view?.id===2){
        branch_flag =2
      }
    bran_do=this.tb_report.value.branch_do?.code??""
    }else{
    bran_do=this.branch_value_code
    }
    this.tb_report.get('branch').valueChanges
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
      if(this.tb_report.value.view?.id===2){
        branch_flag =2
      }
    bran_do=this.tb_report.value.branch_do?.code??""
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
      if(this.tb_report.value.view?.id===2){
        branch_flag =2
      }
    bran_do=this.tb_report.value.branch_do?.code??""
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
    this.tb_report.get('branch_do').valueChanges
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
    this.end_of_report = true
    if(this.tb_report.value.from_date==""||this.tb_report.value.from_date==undefined || this.tb_report.value.from_date==null ){
      this.toastr.warning("Please Select Date 1")
      return false
    }
    if(this.tb_report.value.to_date==""|| this.tb_report.value.to_date==undefined || this.tb_report.value.to_date==null ){
      this.toastr.warning("Please Select Date 2")
      return false
    }
    if(this.role_per.name=="Admin"){
      if(this.tb_report.value.view == "" || this.tb_report.value.view == undefined || this.tb_report.value.view==null){
        this.toastr.warning("Please Select View Type")
        return false
      }
    }
    if(this.tb_report.value.business=="" || this.tb_report.value.business == undefined || this.tb_report.value.business==null){
      this.tb_report.controls['bs_id'].reset('')
  this.tb_report.controls['cc_id'].reset('')
    }
    if(this.tb_report.value.bs_id == "" || this.tb_report.value.bs_id == null || this.tb_report.value.bs_id == undefined){
      this.tb_report.controls['cc_id'].reset('')
    }
    if(this.tb_report.value.amount?.id=="C" ){
      this.div_Amt_show="Amount In Crores"
        }else if(this.tb_report.value.amount.id=="A"){
          this.div_Amt_show="Amount In Actuals"
        }else{
          this.div_Amt_show="Amount In Lakhs"
        }
        console.log("this.div_Amt_show",this.div_Amt_show)
        this.from_date_balance=this.datePipe.transform(this.tb_report.value.from_date, 'yyyy-MM-dd') 
        this.to_date_balance=this.datePipe.transform(this.tb_report.value.to_date, 'yyyy-MM-dd')
        let branch_id
        let business_id=this.tb_report.value.business?.id??""
        let view_name=this.tb_report.value.view?.type??""
        if(this.brnach_login_id ==""){
        if(this.tb_report.value.branch_do==="" || this.tb_report.value.branch_do=== null || this.tb_report.value.branch_do === undefined){

          branch_id=this.tb_report.value.branch?.id??""
        }else{
        if(this.tb_report.value.branch==="" || this.tb_report.value.branch=== null || this.tb_report.value.branch === undefined){
           branch_id=this.tb_report.value.branch_do?.id??""
        }else{
         branch_id=this.tb_report.value.branch_do?.id??""
        }
      }
    }else{
      branch_id= this.brnach_login_id
      view_name="Branch_View"
    }
      let bs_id=this.tb_report.value.bs_id?.id??""
      let cc_id=this.tb_report.value.cc_id?.id??""
        let branch_flags
        if(this.role_per.name=="Admin"){
          branch_flags=view_name
        // }else if(this.Do_permission['empbranch_ids'].length !=0 && this.role_per.name !="Admin"){
        //   branch_flags=5
        }else{
          branch_flags=2
        }
        this.page_index++   
        let pagesscountes =100
        let pag_count=pagesscountes*(this.page_index) 
        console.log("pagcount",pag_count)    
        let countss=this.total_pages-pag_count
        console.log("countss",countss)
     
          let param=
          // {
          //   "fromdate":this.from_date_balance,
          //   "todate":this.to_date_balance,
          //   "branch_id":branch_id,
          //   "div_amount":this.divamount,
          //   "business_id":business_id,
          //   "branch_flag":branch_flags,
          //   "bs_id":bs_id,
          //   "cc_id":cc_id,
          // }
          {
            "ls_group":'TB_Report',
            "type":view_name, 
            "fromdate": this.from_date_balance,
            "todate": this.to_date_balance,
            "branch_id": branch_id?branch_id:"",
            "do_code": "",
            "business_id": business_id,
            "bs_id": bs_id,
            "cc_id": cc_id,
            "subcatunique_no":"",
            "ccunique_no":'',
            "flag": "",
            "page_index": this.page_index,
            "page_size": pagesscountes
          }
    // if(this.has_next===true){
    // // this.SpinnerService.show()
    // this.dataService.tb_business_summary(param,page)
    // .subscribe((results: any[]) => {
    //   // this.SpinnerService.hide()
    //   let datas = results["data"];   
    //   // this.tb_gl_report_list=datas
      
    //   let dataPagination = results['pagination'];
    //   console.log("dataPagination=>",dataPagination)
    //   this.has_next = dataPagination.has_next;
    //   this.has_previous = dataPagination.has_previous;
    //   this.presentpage = dataPagination.index;  
       
    //   this.summary_list = this.summary_list.concat(datas);
    //   }, error => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   });

    // }
    
    
    if (countss >0) {
    // this.SpinnerService.show()
    this.dataService.tb_business_summary(param,page)
    .subscribe((results: any[]) => {
      // this.SpinnerService.hide()
      let datas = results["DATA"];   
      // this.summary_list=datas
      let dataPagination = results['pagination'];
      console.log("dataPagination=>",dataPagination)
      
      // this.summary_list=datas 
      if(this.summary_list.length!=0){
      //   console.log("dataPagination=>",dataPagination)
      //   this.has_next = dataPagination.has_next;
      //   this.has_previous = dataPagination.has_previous;
      //   this.presentpage = dataPagination.index;  
        this.summary_list = this.summary_list.concat(datas);
        this.original_data = [...this.summary_list];
      }
      else{
        this.toastr.warning("","No Data Found" ,{timeOut:1200})
      }
    }, error => {
      // this.Branch_data_show_hide=false;
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }else{
    this.end_of_report=false;
    let totalFromBalance = 0;
    let totalToBalance = 0;
    this.summary_list.forEach(item => {
      totalFromBalance += parseFloat(item.from_amount);
      totalToBalance += parseFloat(item.to_amount);
    });
    console.log('Total FromBalance:', totalFromBalance);
    console.log('Total ToBalance:', totalToBalance);

      this.totalFromBalance = totalFromBalance;
      this.totalToBalance = totalToBalance;
  }
    
  }
  tb_reset(){
    this.tb_report.reset()
    this.Branch_data_show_hide=false;
    this.summary_list = []
    this.original_data = [];
  }

  onScrollchild(){
    let page=this.presentpage_child+1
    this.childend_of_report = true
    let bs_id=this.tb_report.value.bs_id?.id??""
    let cc_id=this.tb_report.value.cc_id?.id??""
    let param
    this.chiledpage_index++
    let page_count=this.chiled_page_size*(this.chiledpage_index)
    console.log("pagcount",page_count)
    let counts=this.child_total_pages-page_count
    console.log("countss",counts)
      if(this.view_edit=="BR_View"){

        param={
          "ls_group":'TB_Report',
          "type":this.view_edit, 
          "fromdate":this.from_date_balance,
          "todate":this.to_date_balance,
          "branch_id":this.data_branch_id?this.data_branch_id:"",
          "do_code": "",
          "business_id": "",
          "bs_id": this.data_business_id,
          "cc_id": this.cc_id,
          "subcatunique_no":"",
          "flag": "",
          "page_index":this.chiledpage_index,
          "page_size":this.chiled_page_size,
          "ccunique_no":this.ccunique
        }
      
      }else{
        param={
          "ls_group":'TB_Report',
          "type":this.view_edit, 
          "fromdate":this.child_view_date,
          "todate": "",
          "branch_id":this.data_branch_id?this.data_branch_id:"",
          "do_code": "",
          "business_id": "",
          "bs_id": this.data_business_id,
          "cc_id": this.cc_id,
          "subcatunique_no":"",
          "flag": "",
          "page_index":this.chiledpage_index,
          "page_size":this.chiled_page_size,
          "ccunique_no":this.ccunique
        }
      }
     
      
      if(counts>0){
      this.dataService.tb_business_summary(param,page)
      .subscribe((results: any[]) => {
        let datas = results["DATA"];   
        if(this.tb_child_report_list.length!=0){
        this.tb_child_report_list = this.tb_child_report_list.concat(datas);
        this.original_child_data = [...this.tb_child_report_list]; 
        }
        else{
          this.toastr.warning("","No Data Found" ,{timeOut:1200})
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
     }else{
      this.childend_of_report=false;
      if(this.view_edit=="BR_View"){
        let totalFromBalance = 0;
        let totalToBalance = 0;
        this.tb_child_report_list.forEach(item => {
          totalFromBalance += parseFloat(item.from_amount);
          totalToBalance += parseFloat(item.to_amount);
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

  
  bsname_dropdown() {
    let business_id=this.tb_report.value.business?.id??""
    if(this.tb_report.value.business=="" || this.tb_report.value.business == undefined || this.tb_report.value.business ==null){
      this.toastr.warning("Please Select Business")
      return false
     }
    let prokeyvalue: String = "";
    this.getbsid(prokeyvalue);
    this.tb_report.get('bs_id').valueChanges
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
     let business_id=this.tb_report.value.business?.id??""
     if(this.tb_report.value.business=="" || this.tb_report.value.business == undefined || this.tb_report.value.business ==null){
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
     let business_id=this.tb_report.value.business?.id??""
     if(this.tb_report.value.business=="" || this.tb_report.value.business == undefined || this.tb_report.value.business ==null){
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
              if (this.has_nextbs === true && !isApiCallInProgress) {
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
    if(this.tb_report.value.bs_id=="" || this.tb_report.value.bs_id == undefined || this.tb_report.value.bs_id ==null){
      this.toastr.warning("Please Select BS")
      return false
     }
    let prokeyvalue: String = "";
    this.getccid(prokeyvalue);
    this.tb_report.get('cc_id').valueChanges
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
    if(this.tb_report.value.bs_id=="" || this.tb_report.value.bs_id == undefined || this.tb_report.value.bs_id ==null){
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
    if(this.tb_report.value.bs_id=="" || this.tb_report.value.bs_id == undefined || this.tb_report.value.bs_id ==null){
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
  Screendownload() {  
    var wsrows = [
        { hpt: 12 }, 
        { hpx: 16 }, 
    ];

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
    head_report[1].splice(header_position, 0, 'Business Report');

    let xlsxparam: any = {};
    let xlsx_len = 1;
    for (let xlsx in this.xlsx_param) {
        console.log("xlsx_param 1=>", xlsx);
        console.log("xlsx_param 2=>", this.xlsx_param);
        if (this.xlsx_param[xlsx] !== "") {
            xlsxparam[xlsx] = this.xlsx_param[xlsx];
        }
    }
    console.log("xlsx=>", xlsxparam);
    if (Object.values(xlsxparam).length !== 0) {
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

    // Calculate column widths
    const colWidths = filteredProfitability[0].map((_, i) => {
        let maxLength = 0;
        filteredProfitability.forEach(row => {
            const cell = row[i] ? row[i].toString() : "";
            maxLength = Math.max(maxLength, cell.length);
        });
        return { wch: maxLength + 2 }; // Add padding for better appearance
    });

    // Convert filtered data to worksheet
    let worksheet = XLSX.utils.json_to_sheet(filteredProfitability, { skipHeader: true });
    console.log("worksheet=>", worksheet);

    // Apply column widths to the worksheet
    worksheet['!cols'] = colWidths;

    // Create new workbook and write file
    const new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, worksheet, 'TB Report');
    XLSX.writeFile(new_workbook, "TB_Report.xlsx");
    this.arrow_icon_up = true
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
  head_report[1].splice(header_position, 0, this.view_edit == "BR_View" ? 'Business Branch Report' : 'Business Transaction Report');

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

  // Calculate column widths
  const colWidths = profitability[0].map((_, i) => {
      let maxLength = 0;
      profitability.forEach(row => {
          const cell = row[i] ? row[i].toString() : "";
          maxLength = Math.max(maxLength, cell.length);
      });
      return { wch: maxLength + 2 }; // Add padding for better appearance
  });

  // Convert filtered data to worksheet
  let worksheet = XLSX.utils.json_to_sheet(profitability, { skipHeader: true });
  console.log("worksheet=>", worksheet);

  // Apply column widths to the worksheet
  worksheet['!cols'] = colWidths;

  // Create new workbook and write file
  const new_workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(new_workbook, worksheet, "TB Business Transaction Report");
  XLSX.writeFile(new_workbook, "TB Business Transaction Report.xlsx");
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


sortamount(direction: 'asc' | 'desc', field: 'frombalance' | 'tobalance'): void {
  this.summary_list.sort((a, b) => {
    const aValue = field === 'frombalance' 
      ? a.from_amount / this.amount_division * -1 
      : a.to_amount / this.amount_division * -1;
    const bValue = field === 'frombalance' 
      ? b.from_amount / this.amount_division * -1 
      : b.to_amount / this.amount_division * -1;

    const sortOrder = direction === 'asc' ? 1 : -1;

    if (aValue < bValue) return -1 * sortOrder;
    if (aValue > bValue) return 1 * sortOrder;

    return 0;
  });
}

sort_child_amount(direction: 'asc' | 'desc', field: 'frombalance' | 'tobalance'): void {
  this.tb_child_report_list.sort((a, b) => {
    const aValue = field === 'frombalance' 
      ? a.from_amount / this.amount_division * -1 
      : a.to_amount / this.amount_division * -1;
    const bValue = field === 'frombalance' 
      ? b.from_amount / this.amount_division * -1 
      : b.to_amount / this.amount_division * -1;

    const sortOrder = direction === 'asc' ? 1 : -1;

    if (aValue < bValue) return -1 * sortOrder;
    if (aValue > bValue) return 1 * sortOrder;

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

hide_icon(){
  this.arrow_icon_up = false
  setTimeout(() => {
    this.Screendownload();
}, 500);  
}
  
original_dsummary(){
  this.summary_list = [...this.original_data];  
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
  if(this.tb_report.value.from_date==""||this.tb_report.value.from_date==undefined || this.tb_report.value.from_date==null ){
    this.toastr.warning("Please Select Date 1")
    return false
  }
  if(this.tb_report.value.to_date==""|| this.tb_report.value.to_date==undefined || this.tb_report.value.to_date==null ){
    this.toastr.warning("Please Select Date 2")
    return false
  }
  this.from_date_balance=this.datePipe.transform(this.tb_report.value.from_date, 'yyyy-MM-dd') 
  this.to_date_balance=this.datePipe.transform(this.tb_report.value.to_date, 'yyyy-MM-dd')
  let amount_div
  if(this.tb_report.value.amount?.id=="C" ){
    amount_div=this.tb_report.value.amount?.id
      }else if(this.tb_report.value.amount?.id=="A"){
        amount_div=this.tb_report.value.amount?.id
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
    "flag":"",
    "type":1,
    "file_name":"TB Business Report",
    "branch_id":branch_id,
    "business_id":this.tb_report.value.business?.id??"",
    "bs_id":this.tb_report.value.bs_id?.id??"",
    "cc_id":this.tb_report.value.cc_id?.id??"",
    "div_amt":amount_div
}
this.SpinnerService.show()
  this.dataService.backeend_download(param).subscribe((results: any) => {
      // let datas = results["data"];
      this.SpinnerService.hide()
     console.log("results",results)
if(results.status==="Success"){
  this.toastr.success("", 'File Generate Start...', { timeOut: 1500 })
}else{
  this.toastr.warning(results)
}
    })
}

}
