import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TbReportService } from '../tb-report.service';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { VertSharedService } from '../vert-shared.service';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import localeEnIN from '@angular/common/locales/en-IN';
import { registerLocaleData } from '@angular/common';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
import {Chart,registerables} from 'chart.js';
Chart.register(...registerables);
import { jsPDF } from 'jspdf';

registerLocaleData(localeEnIN);
export interface branchList {
  id: number
  name: string
  code:string
}
export interface finyearList {
  finyer: string
}
interface BusinessValue {
  amount: string;
  code: string;
  name: string;
}
@Component({
  selector: 'app-vert-report',
  templateUrl: './vert-report.component.html',
  styleUrls: ['./vert-report.component.scss']
})
export class VertReportComponent implements OnInit {
  finyearList: any;
  from_month = [
    { id: 1, month: 'Apr', month_id: 4 },
    { id: 2, month: 'May', month_id: 5 },
    { id: 3, month: 'Jun', month_id: 6 },
    { id: 4, month: 'Jul', month_id: 7 },
    { id: 5, month: 'Aug', month_id: 8 },
    { id: 6, month: 'Sep', month_id: 9 },
    { id: 7, month: 'Oct', month_id: 10 },
    { id: 8, month: 'Nov', month_id: 11 },
    { id: 9, month: 'Dec', month_id: 12 },
    { id: 10, month: 'Jan', month_id: 1 },
    { id: 11, month: 'Feb', month_id: 2 },
    { id: 12, month: 'Mar', month_id: 3 },
  ]
  isLoading: boolean;
  branchList: any;
  has_nextbra: boolean;
  has_previousbra: boolean;
  currentpagebra: number;
  first_header: number;
  first_header_Agl: number;
  first_header_CIG: number;
  first_header_Retail: number;
  first_header_Trading: number;
  first_header_KVB: number;
  first_headert: number;
  first_headerr: number;
  first_headerss: number;
  first_headers: number;
    last_index: number;
    last_header_index: number;
    view_List:any=[{"id":1 ,"name":"Bank As a Whole"},{"id":2,"name":"Branch Wise"}]
    Amount_List:any=[{"id":"C","name":"Crores"},{"id":"L","name":"Lakhs"},{"id":"A","name":"Actuals"}]
  data_not_found: boolean;
  div_Amt_show: string;
  businessList: any;
  has_nextbss: any;
  has_previousbss: any;
  currentpagebss: any;
  card_hide:boolean=false;
  header_names: any;
  value_header_lastValue: any;
  branch_list: any;
  view_branch: boolean=false;
  role_per:any;
  Branch_data_show_hide:boolean=true;
  table_headers:boolean;
  brach_dd_hide:boolean=false;
  branch_do_List: any;
  branch_name_headers: boolean;
  do_view: boolean;
  Do_permission: any;
  branch_value_code: any;
  has_previous_do_bra: any;
  currentpage_do_bra: any;
  has_next_do_bra: any;
  ccList: any;
  bsList: any;
  branch_name_show: any;
  vertical_summary: boolean = true;
  chart_summary: boolean =false;
  Component_Summary : any;
  label_data:Array<any>=[];
  label_amount:Array<any>=[];
  color_list:Array<any>=[];
  currentIndex: number = 0;
  displayedData: any[] = [];
  public Chart: any;
  title = 'angulardashboard';
  canvas: any;
  canvas1: any;
  ctx: any;
  ctx1: any;
  myChart:any;
  myChart1:any;
  myChart1lijne:any;
  level_dash_name: any;
  Some_lable: boolean = true;
  All_lable: boolean = false;
  brnach_login_id: any;
  pdf_download:boolean = false;
  runupdatestatus:boolean = false;
  constructor(private dataService:TbReportService,private errorHandler: ErrorhandlingService, private fb: FormBuilder,private vrtshardserv:VertSharedService,private SpinnerService:NgxSpinnerService,private toastr: ToastrService) { }
  verSearchForm:FormGroup;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
  @ViewChild('businessInput') businessInput: any;
  @ViewChild('business_name') business_nameautocomplete: MatAutocomplete;
  @ViewChild('branch_dos') matAutocompletebranch_dos: MatAutocomplete;
  @ViewChild('branch_do_Input') branch_do_Input: any;

    //bs

    @ViewChild('bsInput') bsInput: any;
    @ViewChild('bs') matAutocompletebs: MatAutocomplete;
  
    //cc
    @ViewChild('ccInput') ccInput: any;
    @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;
 
    @ViewChild('bsclear_nameInput') bsclear_name;
  ngOnInit(): void {
    this.vrtshardserv.isSideNav = true;
    document.getElementById("mySidenav").style.width = "50px";
    document.getElementById("main").style.marginLeft = "40px";
    document.getElementById("main").style.transition = "margin-left 0.5s";
    this.isLoading = true;
    this.role_per=this.vrtshardserv.role_permission.value
    console.log("rolessssssssss",this.role_per)
    this.branch_value_code=this.vrtshardserv.Branch_value.value
    this.Do_permission=this.vrtshardserv.Branch_value_do.value  
    this.branch_name_show=this.vrtshardserv.Branch_value_show.value;  
    this.brnach_login_id=this.vrtshardserv.brnach_login_code.value;
    console.log("Do_permission",this.Do_permission['empbranch_ids'].length)
    this.isLoading = false;
    if(this.role_per.name=="Admin"){
      this.view_branch=true;
      this.brach_dd_hide=false;
      this.table_headers=false;
      this.brnach_login_id=""
    }else{
      if(this.Do_permission['empbranch_ids'].length !=0){
        this.view_branch=false;
        this.brach_dd_hide=true;
        this.table_headers=true;        
        this.brnach_login_id=""
      }else{
        this.view_branch=false;
        this.brach_dd_hide=false;
        this.table_headers=true;
        this.brnach_login_id=this.vrtshardserv.brnach_login_code.value;
      }
     
    }
this.verSearchForm=this.fb.group({
  finyear:[],
  frommonth:[],
  tomonth:[],
  branch_id:[],
  amount:[],
  business:[],
  view:[],
  branch_do:[],
  bs_id:[],
  cc_id:[]
})
// this.vert_summary_Search()
// this.branch()
  }

  // branch(){
  //   this.SpinnerService.show()
  //   this.dataService.get_branch().subscribe(results=>{
  //     this.SpinnerService.hide()
  //     let data=results['data']
  //     this.branch_list=data      
     
  //     console.log('branch_list',this.branch_list)
  //   } , error => {
  //     this.errorHandler.handleError(error);
  //     this.SpinnerService.hide();
  //     // this.errorHandler.errorHandler(error,'');
  //   })
  // }
  all_data_rest(){

  if(this.role_per.name=="Admin"){
    this.verSearchForm.controls['business'].reset('')
    this.verSearchForm.controls['amount'].reset('')
    // this.verSearchForm.controls['gl_no_id'].reset('')
    this.verSearchForm.controls['branch_id'].reset('')
    this.verSearchForm.controls['branch_do'].reset('')
    this.verSearchForm.controls['view'].reset('')
    // this.verSearchForm.controls['bs_id'].reset('')
    // this.verSearchForm.controls['cc_id'].reset('')
    // }else if(this.Do_permission['empbranch_ids'].length !=0 && this.role_per.name !="Admin"){
      // this.verSearchForm.controls['bs_id'].reset('')
      // this.verSearchForm.controls['cc_id'].reset('')
    //   this.verSearchForm.controls['business'].reset('')
    // this.verSearchForm.controls['amount'].reset('')
    // this.verSearchForm.controls['gl_no_id'].reset('')
    // this.verSearchForm.controls['branch_id'].reset('')
    }else{
      // this.verSearchForm.controls['bs_id'].reset('')
      // this.verSearchForm.controls['cc_id'].reset('')
      this.verSearchForm.controls['business'].reset('')
    this.verSearchForm.controls['amount'].reset('')
    // this.verSearchForm.controls['gl_no_id'].reset('')
    }
  this.card_hide=false;
  }

  bs_clear() {
    this.verSearchForm.controls['bs_id'].reset('')
    this.verSearchForm.controls['cc_id'].reset('')
  }

  branch_hide(branch){
    this.Branch_data_show_hide=false
    this.transformed_report_list = []
    this.card_hide = false
    if(branch.id==1){
      this.brach_dd_hide=false;
      this.branch_name_headers=false;
      this.do_view=false;
      this.verSearchForm.controls['branch_id'].reset('')
      this.verSearchForm.controls['amount'].reset('')
      this.verSearchForm.controls['business'].reset('')
      this.verSearchForm.controls['bs_id'].reset('')
      this.verSearchForm.controls['cc_id'].reset('')
      this.verSearchForm.controls['branch_do'].reset('')
      // this.verSearchForm.controls['view'].reset('')
    }else if(branch.id==2){
      this.branch_name_headers=true;
      this.brach_dd_hide=true;
      this.do_view=false;
      this.verSearchForm.controls['branch_id'].reset('')
      this.verSearchForm.controls['amount'].reset('')
      this.verSearchForm.controls['business'].reset('')
      this.verSearchForm.controls['bs_id'].reset('')
      this.verSearchForm.controls['cc_id'].reset('')
      this.verSearchForm.controls['branch_do'].reset('')
      // this.verSearchForm.controls['view'].reset('')
    }else{
      this.branch_name_headers=true;
      this.brach_dd_hide=true;
      this.table_headers=false;
      this.do_view=true;    
      this.verSearchForm.controls['branch_id'].reset('')
      this.verSearchForm.controls['amount'].reset('')
      this.verSearchForm.controls['business'].reset('')
      this.verSearchForm.controls['bs_id'].reset('')
      this.verSearchForm.controls['cc_id'].reset('')
      this.verSearchForm.controls['branch_do'].reset('')
      // this.verSearchForm.controls['view'].reset('')
    }
    }

    do_view_dd(branch){
      this.verSearchForm.controls['branch_id'].reset('')
  if(branch == "" || branch ==null || branch==undefined){
    this.brach_dd_hide=false;
     this.branch_name_headers=true;
  }else{
    this.brach_dd_hide=true;
    this.branch_name_headers=true;
  }
    }

  xlsx_param: any
  finyear_dropdown() {
  this.dataService.getfinyeardropdown("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;

      })
    }
    to_reset(){  
      this.verSearchForm.controls['tomonth'].reset('')
     }

    branchname() {
      let bran_do
      let branch_flag
      if(this.role_per.name=="Admin"){
        if(this.verSearchForm.value.view?.id===2){
          branch_flag =2
        }
      bran_do=this.verSearchForm.value.branch_do?.code??""
      }else{
      bran_do=this.branch_value_code
      }
      let prokeyvalue: String = "";
      this.getbranchid(prokeyvalue);
      this.verSearchForm.get('branch_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getbranchdropdown(value, 1,bran_do,branch_flag)
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
        if(this.verSearchForm.value.view?.id===2){
          branch_flag =2
        }
      bran_do=this.verSearchForm.value.branch_do?.code??""
      }else{
      bran_do=this.branch_value_code
      }
      this.dataService.getbranchdropdown(prokeyvalue, 1,bran_do,branch_flag)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchList = datas;
  
        })
    }
  
    autocompletebranchnameScroll() {
      let bran_do
      let branch_flag
      if(this.role_per.name=="Admin"){
        if(this.verSearchForm.value.view?.id===2){
          branch_flag =2
        }
      bran_do=this.verSearchForm.value.branch_do?.code??""
      }else{
      bran_do=this.branch_value_code
      }
      this.has_nextbra = true
      this.has_previousbra = true
      this.currentpagebra = 1
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
                if (this.has_nextbra === true) {
                  this.dataService.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra + 1,bran_do,branch_flag)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.branchList = this.branchList.concat(datas);
                      if (this.branchList.length >= 0) {
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
  
    public displayfnbranch(branch?: branchList): string | undefined {
      return branch ? branch.code +"-"+branch.name: undefined;
  
    }

    
    branch_do_name() {
      let prokeyvalue: String = "";
      this.getbranch_do_id(prokeyvalue);
      this.verSearchForm.get('branch_do').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getbranch_do_dropdown(value, 1)
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
      this.dataService.getbranch_do_dropdown(prokeyvalue, 1)
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
                  this.dataService.getbranch_do_dropdown(this.branch_do_Input.nativeElement.value, this.currentpage_do_bra + 1)
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
    
    public displayfnbranch_do(branch?: branchList): string | undefined {
      return branch ?  branch.code +"-"+  branch.name: undefined;
    
    }

    public displayfnfinyear(fin_year?: finyearList): string | undefined {
      return fin_year ? fin_year.finyer : undefined;
  
    }

      selectbsSection(data) {
    this.cc_bs_id = data.id
  }


amount_array=[]
transformed_report_list: any[] = [];
header_name:any;
sector:any;
vertical_report_list:any;
cardWidth:any;
vertical_headers:any=[]
excludeIndex: number = -1;
headers_data:any;
RunDate:any;
RunFinyear:any;
RunFrom_mon:any;
RunTo_mon:any;
vert_summary_Search(data,value){
    if(this.verSearchForm.value.finyear=="" || this.verSearchForm.value.finyear == undefined || this.verSearchForm.value.finyear==null){
        this.toastr.warning("Please Select Finyear")
        return  false
    }
    if(this.verSearchForm.value.frommonth=="" || this.verSearchForm.value.frommonth == undefined || this.verSearchForm.value.frommonth==null){
        this.toastr.warning("Please Select From Month")
        return  false
    }
    if(this.verSearchForm.value.frommonth !=""){
        if(this.verSearchForm.value.tomonth=="" || this.verSearchForm.value.tomonth== undefined || this.verSearchForm.value.tomonth==null){
        this.toastr.warning("Please Select To Month")
        return  false
    }
    }
    if(this.role_per?.name=="Admin"){
      if(this.verSearchForm.value.view == "" || this.verSearchForm.value.view == undefined || this.verSearchForm.value.view==null){
        this.toastr.warning("Please Select View Type")
        return false
      }
    }
    if(this.verSearchForm.value.view?.id == 2){
      if(this.verSearchForm.value.branch_id == "" || this.verSearchForm.value.branch_id == undefined || this.verSearchForm.value.branch_id==null){
        this.toastr.warning("Please Select Branch")
        return false
      }
    }
    if(this.verSearchForm.value.business=="" || this.verSearchForm.value.business == undefined || this.verSearchForm.value.business==null){
      this.verSearchForm.controls['bs_id'].reset('')
  this.verSearchForm.controls['cc_id'].reset('')
    }
    if(this.verSearchForm.value.bs_id == "" || this.verSearchForm.value.bs_id == null || this.verSearchForm.value.bs_id == undefined){
      this.verSearchForm.controls['cc_id'].reset('')
    }
    if(this.verSearchForm.value.amount?.id=="C" ){
      this.div_Amt_show="Amount In Crores"
        }else if(this.verSearchForm.value.amount?.id=="A"){
          this.div_Amt_show="Amount In Actuals"
        }else{
          this.div_Amt_show="Amount In Lakhs"
        }
       
let finyear=this.verSearchForm.value.finyear?.finyer??"";
let from_month=this.verSearchForm.value.frommonth?.month_id??"";
let to_month=this.verSearchForm.value.tomonth?.month_id??"";
let branch
let amount=this.verSearchForm.value.amount?.id??"";
let business=this.verSearchForm.value.business?.code??""
let view_name=this.verSearchForm.value.view?.id??2
let bs_id=this.verSearchForm.value.bs_id?.id??""
let cc_id=this.verSearchForm.value.cc_id?.id??""
if(this.brnach_login_id ===""){
if(this.verSearchForm.value.branch_do==="" || this.verSearchForm.value.branch_do=== null || this.verSearchForm.value.branch_do === undefined){

  branch=this.verSearchForm.value.branch_id?.code??""
}else{
if(this.verSearchForm.value.branch_id==="" || this.verSearchForm.value.branch_id=== null || this.verSearchForm.value.branch_id === undefined){
  branch=this.verSearchForm.value.branch_do?.code??""
}else{
  branch=this.verSearchForm.value.branch_do?.code??""
}
}
}else{
  branch=this.brnach_login_id
}
let branch_flags
if(this.role_per.name=="Admin"){
  branch_flags=view_name
// }else if(this.Do_permission['empbranch_ids'].length !=0 && this.role_per.name !="Admin"){
//   branch_flags=5
}else{
  branch_flags=2
}
let report_type=1;
this.xlsx_param= { 
  "Amount":this.verSearchForm.value.amount?.name??"",
    "Business Name":this.verSearchForm.value.business?.name??"",
  "Branch Name":this.verSearchForm.value.branch_id?.name??"",
  "BS Name":this.verSearchForm.value.bs_id?.name??"",
  "CC Name":this.verSearchForm.value.cc_id?.name??"",  
  "To Month":this.verSearchForm.value.tomonth?.month??"",  
  "From Month":this.verSearchForm.value.frommonth?.month??"",
  "Finyear": this.verSearchForm.value.finyear?.finyer??"",

   };
  if(this.verSearchForm.value.business ==="" || this.verSearchForm.value.business === null || this.verSearchForm.value.business === undefined){
    this.cardWidth = 'fit-content';
  }else{
    this.cardWidth = '100%';
  }

this.SpinnerService.show()
    this.dataService.vert_report_summary(finyear,from_month,to_month,report_type,branch,amount,business,branch_flags,bs_id,cc_id)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide()
      this.card_hide=true;
      let datas = results["data"]; 
      let headssss = [];
      let heads_data = [];

      for (let a of datas) {
          if (a.headers) {
              heads_data = a.headers;
              headssss.push(a.headers);        
          }
          if(a.business_name){
          this.header_names=a.business_name
          }
          // if(a?.report_run_data){
            // this.runupdatestatus=true
            // let date=a?.report_run_data?.date??""
            // this.RunDate= date.split(',')[0];
            // this.RunFinyear=a?.report_run_data?.finyear??""
            // let from_months=a?.report_run_data?.from_month??""
            // let to_months=a?.report_run_data?.to_month??""

            // const monthObject = this.from_month.find(m => m.month_id ===  from_months);  
            // const tomonthObject = this.from_month.find(m => m.month_id === to_months); 
            // this.RunFrom_mon=monthObject.month
            // this.RunTo_mon=tomonthObject.month
          //   datas.pop()
          // }else{
          // this.runupdatestatus=false
          // }
      }
      datas.pop()
      let condition = this.header_names.length - 2
      this.value_header_lastValue = this.header_names[condition];
      this.header_name = heads_data;   
      this.vertical_report_list=datas
      console.log("this.header",this.header_name)

  // this.vertical_report_list.splice(-1,1)
  if(datas.length>1){
    this.data_not_found=false;
  for(let head of this.header_name){
   for(let data of head.business){
this.vertical_headers.push(data)
   }
  }
  this.vertical_headers.splice(0,1)


console.log("excl",this.excludeIndex)
  // this.transformed_report_list = this.vertical_report_list.map(item => {  
  //   const amounts = this.header_name.map(sec => {
  //     return sec.business.map(hsec => {
  //       const found = item.business_values.find(bv => bv.name === hsec);
  //       return found ? found.amount : 0.00;
  //     });
  //   }).flat();
  //   return {
  //     ...item,
  //     business_values: {
  //       Amount: amounts.slice(1) 
  //     }
  //   };
  // }); 

  this.transformed_report_list = this.vertical_report_list.map(item => {
    const amounts = this.header_name.map(sec => {
      return sec.business.map(hsec => {
        const found = item.business_values.find(bv => bv.name === hsec);
        const amount = found ? parseFloat(found.amount) : 0.00;
        return isNaN(amount) ? 0.00 : amount; 
      });
    }).flat();
  
    return {
      ...item,
      business_values: {
        Amount: amounts.slice(1).map(amount => amount) 
      }
    };
  });
  

  this.vertical_headers=Array.from(new Set(this.vertical_headers))
  let vertical_sum_amount = [];

  for (let item of this.transformed_report_list) {
      if (item.name === "L0 - Net Income" || item.name === "L1 - Direct Establishment Cost" || item.name==="L2 - Direct Operating Costs"||item.name==="L4(a) - Allocated Cost: Premises"||item.name==="L4(b) - Allocated Cost: Technology"||item.name==="L5 - Allocated Cost: Business to Business" ||item.name==="L6 - Allocated Cost: Corporate") {
          let amountArray = item.business_values.Amount.map(parseFloat);
  
          if (vertical_sum_amount.length === 0) {
              vertical_sum_amount = amountArray;
          } else {
              vertical_sum_amount = vertical_sum_amount.map((sum, index) => sum + amountArray[index]);
          }
      }
  }
  this.transformed_report_list = this.transformed_report_list.map(item => {
    if (item.name === 'Operating Profit') {
      return {
        ...item,
        business_values: {
          Amount: vertical_sum_amount
        }
      };
    }
    return item;
  });
  let vertical_sum_amounts=[]
  for (let item of this.transformed_report_list) {
    if (item.name === "Operating Profit" || item.name === "L7 - Provisions" ) {
        let amountArray = item.business_values.Amount.map(parseFloat);

        if (vertical_sum_amounts.length === 0) {
          vertical_sum_amounts = amountArray;
        } else {
          vertical_sum_amounts = vertical_sum_amounts.map((sum, index) => sum + amountArray[index]);
        }
    }
}
this.transformed_report_list = this.transformed_report_list.map(item => {
  if (item.name === 'Net Profit') {
    return {
      ...item,
      business_values: {
        Amount: vertical_sum_amounts
      }
    };
  }
  if(value == 'dash'){
    this.vertical_summary = false
    this.chart_summary = true
    this.Some_lable = true
    this.All_lable = false
    this.show_original_data('L0 - Net Income')
  }
  return item; 
});

if(this.verSearchForm.value?.business?.code){
}else{
this.transformed_report_list = this.transformed_report_list.map(item => {
  if (item.business_values && Array.isArray(item.business_values.Amount)) {
      const sumExcludingLast = item.business_values.Amount.slice(0, -1).reduce((sum, value) => {
          const amount = parseFloat(value) || 0; 
          return sum + amount; 
      }, 0);
      const updatedAmount = [...item.business_values.Amount];
      updatedAmount[updatedAmount.length - 1] = sumExcludingLast;

      return {
          ...item,
          business_values: {
              ...item.business_values,
              Amount: updatedAmount 
          },
      };
  }

  return item; 
});
}
console.log(this.transformed_report_list,"Final data");



}else{
  this.data_not_found=true;
  this.transformed_report_list=[];
  this.toastr.warning("No Data Found")
}

}, error => {
  // this.Branch_data_show_hide=false;
  this.errorHandler.handleError(error);
  this.SpinnerService.hide();
})
}

reset(){
    this.verSearchForm.reset()
    this.card_hide=false;
}
    
bs_cc_clear() {
  this.verSearchForm.controls['cc_id'].reset('')
} 

Business_dropdown() {
  let report_type=1;
  let prokeyvalue: String = "";
  this.getbusiness(prokeyvalue);
  this.verSearchForm.get('business').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.getbusiness_dropdown( value, 1,report_type)
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
  let report_type=1;
  this.has_nextbss = true
  this.has_previousbss = true
  this.currentpagebss = 1
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
            if (this.has_nextbss === true) {
              this.dataService.getbusiness_dropdown( this.businessInput.nativeElement.value, this.currentpagebss + 1,report_type)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.businessList = this.businessList.concat(datas);
                  if (this.businessList.length >= 0) {
                    this.has_nextbss = datapagination.has_next;
                    this.has_previousbss = datapagination.has_previous;
                    this.currentpagebss = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}
business_id = 0;
private getbusiness(prokeyvalue) {
  let report_type=1;
  this.dataService.getbusiness_dropdown( prokeyvalue, 1,report_type)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.businessList = datas;

    })
}

public displayfnbusiness(business_name?: BusinessValue): string | undefined {
  return business_name ? business_name.name : undefined;

}


bsname_dropdown() {
  let business_id=this.verSearchForm.value.business?.id??""
  let prokeyvalue: String = "";
  this.getbsid(prokeyvalue);
  this.verSearchForm.get('bs_id').valueChanges
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
    let business_id=this.verSearchForm.value.business?.id??""
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
    let business_id=this.verSearchForm.value.business?.id??""
  this.has_nextbs = true
  this.has_previousbs = true
  this.currentpagebs = 1
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
            if (this.has_nextbs === true) {
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
                })
            }
          }
        });
    }
  });
}

public displayfnbs(bs?: branchList): string | undefined {
  return bs ? bs.name : undefined;

}


ccname_dropdown() {
  let prokeyvalue: String = "";
  this.getccid(prokeyvalue);
  this.verSearchForm.get('cc_id').valueChanges
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
  this.has_nextcc = true
  this.has_previouscc = true
  this.currentpagecc = 1
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
            if (this.has_nextcc === true) {
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
                })
            }
          }
        });
    }
  });
}


public displayfncc(cc_name?: branchList): string | undefined {
  return cc_name ? cc_name.name : undefined;

}

Screendownload() {  
    
  if(this.verSearchForm.value.finyear=="" || this.verSearchForm.value.finyear == undefined || this.verSearchForm.value.finyear==null){
    this.toastr.warning("Please Select Finyear")
    return  false
}
if(this.verSearchForm.value.frommonth=="" || this.verSearchForm.value.frommonth == undefined || this.verSearchForm.value.frommonth==null){
    this.toastr.warning("Please Select Frommonth")
    return  false
}
if(this.verSearchForm.value.frommonth !=""){
    if(this.verSearchForm.value.tomonth=="" || this.verSearchForm.value.tomonth== undefined || this.verSearchForm.value.tomonth==null){
    this.toastr.warning("Please Select Tomonth")
    return  false
}
}
  var wsrows = [
    { hpt: 12 }, 
    { hpx: 16 }, 
  ];
  // let header=[['PPR Report']]

  let profit=document.getElementById('datatable')
 
  console.log("profit=>",profit)
  
  const p_table:XLSX.WorkSheet=XLSX.utils.table_to_sheet(profit)
 
  console.log("p_table=>",p_table)
  
  let profitability:any=XLSX.utils.sheet_to_json(p_table,{ header: 1 }); 
  const arr = Array(profitability[0].length).fill("")
  let cal=Math.floor(arr.length/2)
  console.log(arr,cal);
  profitability.splice(0,0,arr)
  console.log("profitability=>",profitability)
  let max_length=Math.max(arr.length)
  let head_report = []
  head_report.push(Array(max_length).fill(""))
  head_report.push(Array(max_length+1).fill(""))
  console.log("head_report=>",head_report)
  let header_position=Math.floor(max_length/2)
  head_report[1].splice(header_position,0,'Vertical Report')
  let xlsxparam:any={}
  let xlsx_len=1
  for(let xlsx in this.xlsx_param){
    console.log("xlsx_param 1=>",xlsx);
    console.log("xlsx_param 2=>",this.xlsx_param);
    if(this.xlsx_param[xlsx] != ""){
      xlsxparam[xlsx]=this.xlsx_param[xlsx]
    }
  }
  console.log("xlsx=>",xlsxparam)
  if(Object.values(xlsxparam).length!=0){
    xlsx_len=Object.values(xlsxparam).length
  }
  for(let xlsx in xlsxparam){
    for(let i=1;i<=xlsx_len;i++){
      head_report[0].splice(xlsx_len[i],0,xlsx+":"+xlsxparam[xlsx])
      break;
    }
  }
  profitability.splice(0,0,head_report[0])
  profitability.splice(0,0,head_report[1])
  console.log("table=>",profitability)
  let worksheet = XLSX.utils.json_to_sheet(profitability, { skipHeader: true });
  console.log("worksheet=>",worksheet)
  console.log("worksheet=>",worksheet)
  const new_workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(new_workbook, worksheet, ' Vertical Report');
  XLSX.writeFile(new_workbook, "Vertical's.xls");
// }
}
vert_chart(){
  this.vertical_summary = false
  this.chart_summary = true
  this.Component_Summary = [
    {
        "balance_amount": "3000.00",
        "cat_name": {
            "id": 5,
            "name": "Grants for Specific Schemes (MME)"
        },
        "subcat_name": {
            "id": 6,
            "name": "Other Allowance"
        },
        "vendor_data": {
            "code": "CD001",
            "id": 1,
            "name": "Amazon"
        }
    },
    {
        "balance_amount": "20000.00",
        "cat_name": {
            "id": 5,
            "name": "Grants for Specific Schemes (MME)"
        },
        "subcat_name": {
            "id": 6,
            "name": "Other Allowance"
        },
        "vendor_data": {
            "code": "CD002",
            "id": 2,
            "name": "Flipkart"
        }
    },
    {
        "balance_amount": "50000.00",
        "cat_name": {
            "id": 5,
            "name": "Grants for Specific Schemes (MME)"
        },
        "subcat_name": {
            "id": 6,
            "name": "Other Allowance"
        },
        "vendor_data": {
            "code": "CD002",
            "id": 2,
            "name": "Flipkart"
        }
    },
    {
      "balance_amount": "60000.00",
      "cat_name": {
          "id": 5,
          "name": "Grants for Specific Schemes (MME)"
      },
      "subcat_name": {
          "id": 6,
          "name": "Other Allowance"
      },
      "vendor_data": {
          "code": "CD002",
          "id": 2,
          "name": "Ajio"
      }
  },
] 
  for(let i=0;i<this.Component_Summary.length;i++){ 
  this.label_data.push(this.Component_Summary[i].vendor_data.name)
  this.label_amount.push(this.Component_Summary[i].balance_amount)
  const hue = (i * 30) % 360;
  const saturation = 70; // Adjust as needed
  const lightness = 50 // Adjust as needed
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  this.color_list.push(color);
  }
  setTimeout(() => {
    this.chart()
  }, 500);  
}
chart(){
this.canvas = document.getElementById('myChart');
this.canvas1 = document.getElementById('myChart1');
this.ctx = this.canvas.getContext('2d')
this.ctx1 = this.canvas1.getContext('2d')
  let delayed;
this.myChart= new Chart(this.ctx, {
  type: 'doughnut',
  
  data: {
     
      labels:this.label_data,
      datasets: [{
          label: 'Total cases.',
          data:this.label_amount,
          backgroundColor:this.generateRandomColors(this.transformed_report_list.length),
          borderWidth: 1
      }]
  },
  options: {animation: {
    onComplete: () => {
      delayed = true;
    },
    delay: (context) => {
      let delay = 0;
      if (context.type === 'data' && context.mode === 'default' && !delayed) {
        delay = context.dataIndex * 300 + context.datasetIndex * 100;
      }
      return delay;
    },
  },
  plugins:{
    legend:{
      position:'right'
      },
      title: {
        display: true, // Display the title
        // text: 'Component Amount', // Title text
      },
  },
  scales: {
    x: {
      grid: {
        display: false, // Hide horizontal grid lines
      },
      beginAtZero: true,
    },
  },
  layout:{
    padding:{
      left: 0, // Adjust the left padding
      right: 0, // Adjust the right padding
      top: 0,
      bottom: 0
    }
  }

}

});
this.chart2()

}
  

chart2() {
  let delayed;
  this.myChart1 = new Chart(this.ctx1, {
    type: 'bar',
    data: {
      labels: this.label_data,
      datasets: [{
        label: 'Amount',
        data: this.label_amount,
        backgroundColor: this.generateRandomColors(this.transformed_report_list.length),
        borderWidth: 1
      }]
    },
    options: {animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !delayed) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
      plugins: {
          legend: {
              position: 'top',
              display: false,
          // text: 'Component Amount',
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // Hide horizontal grid lines
          },
          beginAtZero: true,
        },
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      }
    }
  });
  const targetElement = document.getElementById('myChart1');
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
}


private generateRandomColors(count: number): string[] {
  const randomColors: string[] = [];
  for (let i = 0; i < count; i++) {
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    randomColors.push(color);
  }
  return randomColors;
}
back_to_vert(){
  this.vertical_summary = true
  this.chart_summary = false
}
show_original_data(name){
  this.level_dash_name = name
  let filtered_branch = this.transformed_report_list.filter(item => item.name == name)
  let hearders = this.header_names
  const targetElement = document.getElementById('myChart1');
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
 this.show_chart(name,filtered_branch,hearders)
}
show_chart(name,filtered_branch,hearders){
  let filter_header = hearders.slice(0, -1)
  let allExceptLastAmount = filtered_branch[0].business_values.Amount.slice(0, -1);
  if(this.myChart1){
    this.myChart1.destroy()
  }
  if(this.myChart){
    this.myChart.destroy()
  }
  this.label_data = filter_header
  this.label_amount = allExceptLastAmount.map((amount: number) => amount * -1);
  setTimeout(() => {
    this.chart()
  }, 500);  
}

level_show(data){
  if(data == 'All_lable'){
    this.All_lable = true
    this.Some_lable = false
  }else{
    this.All_lable = false
    this.Some_lable = true
  }
}

downloadPDF(){
  this.SpinnerService.show()
  this.pdf_download = true
  setTimeout(() => {
    this.NewdownloadPDF()
  }, 500);
}


 NewdownloadPDF(){
  var doc = new jsPDF('p', 'mm', 'a4');
  var element = document.getElementById('chart-summary');
    
  var canvas1 = document.getElementById('myChart') as HTMLCanvasElement;
  var ctx1 = canvas1.getContext('2d');
  ctx1.save();
  ctx1.globalCompositeOperation = 'destination-over';
  ctx1.fillStyle = 'white';
  ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
  ctx1.restore();

  var canvas2 = document.getElementById('myChart1') as HTMLCanvasElement;
  var ctx2 = canvas2.getContext('2d');
  ctx2.save();
  ctx2.globalCompositeOperation = 'destination-over';
  ctx2.fillStyle = 'white';
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
  ctx2.restore();

  doc.html(element, {
    callback: (pdf) => {
      pdf.save(this.level_dash_name+'.pdf');
    },
    x: 2, 
    y: 2,
    width: 205, 
    windowWidth: element.scrollWidth,
  });
  this.pdf_download = false
  this.SpinnerService.hide()
}
}