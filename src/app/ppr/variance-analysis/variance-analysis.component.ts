import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { PprService } from '../ppr.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';    
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorhandlingService } from '../errorhandling.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as XLSX from 'xlsx';


export interface finyearList{
    finyer:string
  }
  export interface branchList{
    id:number
    name:string
  }
  export interface sectorList{
    id:number
    name:string
  }
  export interface businessList{
    id:number
    name:string
  }
  export interface approverList{
    id:number
    full_name:string
  }
  export interface bsList{
    id:number
    name:string
  }
  export interface ccList{
    id:number
    name:string
  }
  export interface expensegrpList{
    id:number
    name:string
  }
  export interface iDeptList {
    name: string;
    id: number;
  }
  export interface expenseListss {
    id: string;
    name: any;
  }
  export interface monthauto{
    id:number
    month:string
  }

@Component({
  selector: 'app-variance-analysis',
  templateUrl: './variance-analysis.component.html',
  styleUrls: ['./variance-analysis.component.scss']
})
export class VarianceAnalysisComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput:any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;
   //bs
   @ViewChild('bsInput') bsInput:any;
   @ViewChild('bs') matAutocompletebs: MatAutocomplete;
   //cc
   @ViewChild('ccInput') ccInput:any;
   @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;
  //expense_grp
  @ViewChild('expenseInput') expenseInput:any;

  @ViewChild('bsclear_nameInput') bsclear_name;
  has_next: boolean;
  has_previous: boolean;
  currentpage: number;
  index_cat: any;
  pprreport_header: any=[{id:1,month:'Apr' ,month_id:4},
  {id:2,month:'May' ,month_id:5},
  {id:3,month:'Jun' ,month_id:6},
  {id:4,month:'Jul',month_id:7},
  {id:5,month:'Aug',month_id:8},
  {id:6,month:'Sep',month_id:9},
  {id:7,month:'Oct',month_id:10},
  {id:8,month:'Nov',month_id:11},
  {id:9,month:'Dec',month_id:12},
  {id:10,month:'Jan',month_id:1},
  {id:11,month:'Feb' ,month_id:2},
  {id:12,month:'Mar' ,month_id:3}];
  alei=[
    // {"id":1,"flag":'',"name":"None"},
    {"id":1,"flag":"A","name":"Assets"},
    {"id":1,"flag":"L","name":"Liabilities"},
    {"id":1,"flag":"E","name":"Expenses"},
    {"id":1,"flag":"I","name":"Income"},

  ]
  variance_download=[
    {"id":1,"name":"Business","diff":"bs"},
    {"id":1,"name":"Expense","diff":"exp"},
    {"id":1,"name":"Over All Report","diff":"variance"}
  ]
  frommonthid: any=0;
  previousmonthid: any=[];
  varianceheader: any=[];
  to_month: any=0;
  from_monthvar: any=0;
  from_month_variance: any;
  to_month_variance: string;
  varianceexlx:any={
    "finyear": "",
    "sectorname": "",
    "sector_id": "",
    'from_month':"",
    'to_month':"",
    "branch_id":"",
    "bizname": "",
    "microbscode":"", 
    "microcccode":"",
    "biz_id":"",
    "bs_name": "",
    "bs_id":"",
    "cc_name": "",
    "cc_id": "",
    "flag":""
  };
  Aeli_value: any;
  param: { finyear: string; flag: string; branch_id: string; branch_name: string; divAmount: string; year_term: string; sectorname: string; sector_id: string; masterbusinesssegment_name: string; business_id: string; cc_name: string; cc_id: string; bs_name: string; bs_id: string; from_expense_month: string; to_expense_month: string;microbscode:string; microcccode:string; }={
    "finyear":"",
    "flag":'',
    "branch_id":'',
    "branch_name":"",
    "divAmount":'',
    "year_term":'',
    "sectorname":"",
    "sector_id":"",
    "microbscode":"", 
    "microcccode":"",
    "masterbusinesssegment_name":"",
    "business_id":"",
    "cc_name":"",
    "cc_id":"",
    "bs_name":"",
    "bs_id":"",
    "from_expense_month":"",
    "to_expense_month":"",
  };
  difference_down: any="";

constructor(private errorHandler: ErrorhandlingService,private formBuilder: FormBuilder,private dataService: PprService,private toastr:ToastrService,private SpinnerService: NgxSpinnerService,) { }
pprSearchForm: FormGroup;
buildermonthForm:FormGroup;
buildermonthForm1:FormGroup;
approverForm:FormGroup;
summarydata:any;
qsummarydata:any;
readonly separatorKeysCodes: number[] = [ENTER, COMMA];
@ViewChild('employeeDeptInput') employeeDeptInput: any;
  @ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
  public chipSelectedEmployeeDept: iDeptList[] = [];
  public chipSelectedEmployeeDeptid = [];
  expensegrpList: iDeptList[]; 
year:any;
    Apr:string;
    Apr_Act:String;
    Apr_Bgt:String;
    May:string;
    May_Act:String;
    May_Bgt:String;
    Jun:string;
    Jun_Act:String;
    Jun_Bgt:String
    Jul:string;
    Aug:string;
    Sep:string;
    Oct:string;
    Nov:string;
    Dec:string;
    Jan:string;
    Feb:string;
    Mar:string;
    finyearList:Array<finyearList>;  
    branchList: Array<branchList>;
    sectorList:Array<sectorList>;
    businessList:Array<businessList>;
    approverList:Array<approverList>;
    bsList:Array<bsList>;
    ccList:Array<ccList>;
    isLoading = false;
    nextyear:any;
    disableMessage:boolean=true;
ngOnInit(): void {
  this.disableMessage=true;
  this.getEmployeeList();
  this.pprSearchForm = this.formBuilder.group({
      finyear:[""],
      year_term:["Monthly"],
      divAmount:[""],
      branch_id:[""],
      sectorname:[""],
      businesscontrol:[""],
      bs_id:[""],
      cc_id:[""],
      frommonth:[''],
      tomonth:[''],
      flag:[''],
      variance_diff:['']
      
  })
  // this.year_term=1;
  this.buildermonthForm=this.formBuilder.group({

  })
  this.buildermonthForm1=this.formBuilder.group({

  })
  this.approverForm=this.formBuilder.group({
    approvercontrol:[""],

  })
  
}


apr_name_2:any;
month_amt:any;
amount_change_month(i,data,formvalue,total_data,Month_val){
  let a= data
  if(Month_val=='YTD'){
    if(formvalue==''){
      this.month_amt="0.00"
      formvalue="0.00"
    }else{
      this.month_amt=(parseFloat(formvalue)/12).toFixed(4);
    }
  let b=(parseFloat(formvalue)/12).toFixed(4);
  total_data[i]['YTD'][2]=formvalue
  total_data[i]['Apr'][2]=this.month_amt
  total_data[i]['May'][2]=this.month_amt
  total_data[i]['Jun'][2]=this.month_amt
  total_data[i]['Jul'][2]=this.month_amt
  total_data[i]['Aug'][2]=this.month_amt
  total_data[i]['Sep'][2]=this.month_amt
  total_data[i]['Oct'][2]=this.month_amt
  total_data[i]['Nov'][2]=this.month_amt
  total_data[i]['Dec'][2]=this.month_amt
  total_data[i]['Jan'][2]=this.month_amt
  total_data[i]['Feb'][2]=this.month_amt
  total_data[i]['Mar'][2]=this.month_amt
  total_data[i]['change_flag']='Y'

  this.summarydata=total_data
  }else{
    let a21=total_data[i][Month_val][2]
    let b=((parseFloat(total_data[i]['YTD'][2])-parseFloat(a21))+parseFloat(formvalue)).toFixed(2);
    total_data[i]['YTD'][2]=b
    if(b=='NaN'){
      b=parseFloat(formvalue).toFixed(2);
    }
  
  total_data[i]['YTD'][2]=b
  total_data[i][Month_val][2]=parseFloat(formvalue).toFixed(2);

  this.summarydata=total_data
  }
  // this.apr_name=formvalue.ytd_name_2
  // this.buildermonthForm.value.apr_name[i]=formvalue.ytd_name_2

}
qttly_amount:any;
amount_change_qtr(i,data,formvalue,total_data,Month_val){
  let a= data
  if(Month_val=='YTD'){
    if(formvalue==''){
      this.qttly_amount="0.00"
      formvalue="0.00"
    }else{
      this.qttly_amount=(parseFloat(formvalue)/12).toFixed(2);
    }
 
  total_data[i]['YTD'][2]=formvalue
  total_data[i]['Quarterly_1'][2]=this.qttly_amount
  total_data[i]['Quarterly_2'][2]=this.qttly_amount
  total_data[i]['Quarterly_3'][2]=this.qttly_amount
  total_data[i]['Quarterly_4'][2]=this.qttly_amount

  this.qsummarydata=total_data
  }else{
    let a21=total_data[i][Month_val][2]
    let b=((parseFloat(total_data[i]['YTD'][2])-parseFloat(a21))+parseFloat(formvalue)).toFixed(2);
    total_data[i]['YTD'][2]=b
    if(b=='NaN'){
      b=parseFloat(formvalue).toFixed(2);
    }
  
  total_data[i]['YTD'][2]=b
  total_data[i][Month_val][2]=parseFloat(formvalue).toFixed(2);

  this.qsummarydata=total_data
  }
}

amount_change_name(i,data,formvalue,total_data,Month_val){
  if(Month_val=='mon'){
    total_data[i]['name']=formvalue
    // total_data[i]['new_data']='N'
    total_data[i]['change_flag']='Y'
    this.summarydata=total_data
  }else{
    total_data[i]['name']=formvalue
    this.qsummarydata=total_data
  }
  

}
// finyear dropdown start
finyear_dropdown(){
  let prokeyvalue: String = "";
    this.getfinyear(prokeyvalue);
    this.pprSearchForm.get('finyear').valueChanges
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
public displayfnfinyear(fin_year?: finyearList): string | undefined {
  return fin_year ? fin_year.finyer : undefined;
  
}

// fin year dropdown end
// branch dropdown start
// branch dropdown start
branchname(){
  let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    this.pprSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbranchdropdown(value,1)
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

private getbranchid(prokeyvalue){
  this.dataService.getbranchdropdown(prokeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchList = datas;

    })
}

currentpagebra:any=1
has_nextbra:boolean=true
has_previousbra:boolean=true
autocompletebranchnameScroll() {
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
        .subscribe(()=> {
          const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
          const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
          const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextbra === true) {
              this.dataService.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra+ 1)
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
  return branch ? branch.name : undefined;
  
}
// branch dropdown end
// sector dropdown start
sector_id=0
Sector_dropdown(){
  let prokeyvalue: String = "";
    this.getsector(prokeyvalue);
    this.pprSearchForm.get('sectorname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getsectordropdown(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sectorList = datas;
        this.secotralldata_clear()
      })
}
@ViewChild('sector_name') sectorAutoComplete:MatAutocomplete;
@ViewChild('sectornameInput') sectornameInput:any;
autocompletesectorScroll(){
  this.has_next =true;
  this.has_previous = true;
  this.currentpage = 1;
  setTimeout(() => {
    if (
      this.sectorAutoComplete &&
      this.autocompleteTrigger &&
      this.sectorAutoComplete.panel
    ) {
      fromEvent(this.sectorAutoComplete.panel.nativeElement, 'scroll')
        .pipe(
          map(() => this.sectorAutoComplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(() => {
          const scrollTop = this.sectorAutoComplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.sectorAutoComplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.sectorAutoComplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextbra === true) {
              this.dataService.getsectordropdown(this.sectornameInput.nativeElement.value, this.currentpage + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.sectorList = this.sectorList.concat(datas);
                  if (this.sectorList.length >= 0) {
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

private getsector(prokeyvalue){
  this.dataService.getsectordropdown(prokeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.sectorList = datas;

    })
}

public displayfnsectorname(sector_name?: sectorList): string | undefined {
  return sector_name ? sector_name.name : undefined;
  
}

selectsectorSection(name){
  this.sector_id=name.id
}

secotralldata_clear(){
  this.pprSearchForm.controls['bs_id'].reset('')
  this.pprSearchForm.controls['businesscontrol'].reset('')
  this.pprSearchForm.controls['cc_id'].reset('')
}
// sector dropdown end
// business dropdown start
Business_dropdown(){
  let prokeyvalue: String = "";
    this.getbusiness(prokeyvalue);
    this.pprSearchForm.get('businesscontrol').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbusinessdropdown(this.sector_id,value,1)
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
        this.business_bs_clear()
      })
}
@ViewChild('businessInput') businessInput:any;
@ViewChild('business_name') business_nameauto:MatAutocomplete;
autocompletebusinessnameScroll() {
  this.currentpagebra=1
  this.has_nextbra=true
  this.has_previousbra=true
  setTimeout(() => {
    if (
      this.business_nameauto &&
      this.autocompleteTrigger &&
      this.business_nameauto.panel
    ) {
      fromEvent(this.business_nameauto.panel.nativeElement, 'scroll')
        .pipe(
          map(() => this.business_nameauto.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(() => {
          const scrollTop = this.business_nameauto.panel.nativeElement.scrollTop;
          const scrollHeight = this.business_nameauto.panel.nativeElement.scrollHeight;
          const elementHeight = this.business_nameauto.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextbra === true) {
              this.dataService.getbusinessdropdown(this.sector_id, this.businessInput.nativeElement.value, this.currentpagebra + 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.businessList = this.businessList.concat(datas);
                  if (this.businessList.length >= 0) {
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

business_id=0;
private getbusiness(prokeyvalue){
  this.dataService.getbusinessdropdown(this.sector_id,prokeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.businessList = datas;

    })
}

public displayfnbusiness(business_name?: businessList): string | undefined {
  return business_name ? business_name.name : undefined;
  
}

selectbusinessSection(data){
  this.business_id=data.id
  if (this.business_id==undefined){
    this.pprSearchForm.value.bs_id = ' ';
  }
}

business_bs_clear(){
  this.pprSearchForm.controls['bs_id'].reset('')
  this.pprSearchForm.controls['cc_id'].reset('')
}
// business dropdown end
// bs dropdown start
    
bsname_dropdown(){
  let prokeyvalue: String = "";
    this.getbsid(prokeyvalue);
    this.pprSearchForm.get('bs_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbsdropdown(this.business_id,value,1)
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
        this.bs_cc_clear()
      })
}

private getbsid(prokeyvalue){
  this.dataService.getbsdropdown(this.business_id,prokeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bsList = datas;

    })
}

cc_bs_id=0
currentpagebs:any=1
has_nextbs:boolean=true
has_previousbs:boolean=true
autocompletebsnameScroll() {
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
        .subscribe(()=> {
          const scrollTop = this.matAutocompletebs.panel.nativeElement.scrollTop;
          const scrollHeight = this.matAutocompletebs.panel.nativeElement.scrollHeight;
          const elementHeight = this.matAutocompletebs.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextbs === true) {
              this.dataService.getbsdropdown(this.business_id,this.bsInput.nativeElement.value, this.currentpagebs+ 1)
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

public displayfnbs(bs?: bsList): string | undefined {
  return bs ? bs.name : undefined;
  
}

selectbsSection(data){
  this.cc_bs_id=data.id
}

bs_cc_clear(){
  this.pprSearchForm.controls['cc_id'].reset('')
}
// bs dropdown end
// cc dropdown start

ccname_dropdown(){
  let prokeyvalue: String = "";
    this.getccid(prokeyvalue);
    this.pprSearchForm.get('cc_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getccdropdown(this.cc_bs_id,value,1)
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

      })
}



private getccid(prokeyvalue){
  this.dataService.getccdropdown(this.cc_bs_id,prokeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccList = datas;

    })
}

currentpagecc:any=1
has_nextcc:boolean=true
has_previouscc:boolean=true
autocompletccnameScroll() {
  this.has_nextcc = true
  this.has_previouscc = true
  this.currentpagecc =1
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
        .subscribe(()=> {
          const scrollTop = this.matAutocompletecc.panel.nativeElement.scrollTop;
          const scrollHeight = this.matAutocompletecc.panel.nativeElement.scrollHeight;
          const elementHeight = this.matAutocompletecc.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextcc === true) {
              this.dataService.getccdropdown(this.cc_bs_id,this.ccInput.nativeElement.value, this.currentpagecc+ 1)
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


public displayfncc(cc_name?: ccList): string | undefined {
  return cc_name ? cc_name.name : undefined;
  
}
// cc dropdown end
// expensegrp dropdown start

Expensegrp_dropdown(){
  let prokeyvalue: String = "";
    this.getexpensegrp(prokeyvalue);
    // this.pprSearchForm.get('expensegrp').valueChanges
      this.expensegrp.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getexpensegrpdropdown(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // this.expensegrpList = datas;
        this.expenseList = datas

      })
}


private getexpensegrp(prokeyvalue){
  this.dataService.getexpensegrpdropdown(prokeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      // this.expensegrpList = datas;
      this.expenseList = datas

    })
}
autocompletexpenseScroll() {
  this.currentpage=1
  this.has_next=true
  this.has_previous=true
  setTimeout(() => {
    if (
      this.matprodAutocomplete &&
      this.autocompleteTrigger &&
      this.matprodAutocomplete.panel
    ) {
      fromEvent(this.matprodAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(() => this.matprodAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(()=> {
          const scrollTop = this.matprodAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.matprodAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matprodAutocomplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_next === true) {
              this.dataService.getexpensegrpdropdown(this.expInput.nativeElement.value, this.currentpage+ 1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  this.expenseList = this.expenseList.concat(datas);
                  if (this.expenseList.length >= 0) {
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
public displayfnexpense(expense_name?: expensegrpList): string | undefined {
  return expense_name ? expense_name.name : undefined;
  
}

public removeEmployeeDept(dept: iDeptList): void {
  const index = this.chipSelectedEmployeeDept.indexOf(dept);
  if (index >= 0) {
    this.chipSelectedEmployeeDept.splice(index, 1);
    this.chipSelectedEmployeeDeptid.splice(index, 1);
    this.employeeDeptInput.nativeElement.value = '';
  }
}

public employeeDeptSelected(event: MatAutocompleteSelectedEvent): void {
  this.selectEmployeeDeptByName(event.option.value.name);
  this.employeeDeptInput.nativeElement.value = '';
}
private selectEmployeeDeptByName(dept) {
  let foundEmployeeDept1 = this.chipSelectedEmployeeDept.filter(employeedept => employeedept.name == dept);
  if (foundEmployeeDept1.length) {
    return;
  }
  let foundEmployeeDept = this.expensegrpList.filter(employeedept => employeedept.name == dept);
  if (foundEmployeeDept.length) {
    this.chipSelectedEmployeeDept.push(foundEmployeeDept[0]);
    this.chipSelectedEmployeeDeptid.push(foundEmployeeDept[0].id)
  }
}

expenseList: expenseListss[];
    public chipSelectedprod: expenseListss[] = [];
    public chipSelectedprodid = [];
    expensegrp = new FormControl();

    @ViewChild('exp') matprodAutocomplete: MatAutocomplete;
    @ViewChild('expInput') expInput: any;
    public removedprod(pro: expenseListss): void {
      const index = this.chipSelectedprod.indexOf(pro);
      if (index >= 0) {
        this.chipSelectedprod.splice(index, 1);
        
        this.chipSelectedprodid.splice(index, 1);
        
        this.expInput.nativeElement.value = '';
      }
    }
    public prodSelected(event: MatAutocompleteSelectedEvent): void {
      
      this.selectprodByName(event.option.value.name);
      this.expInput.nativeElement.value = '';
      
    }
    private selectprodByName(prod) {
      let foundprod1 = this.chipSelectedprod.filter(pro => pro.name == prod);
      if (foundprod1.length) {
        return;}
      let foundprod = this.expenseList.filter(pro => pro.name == prod);
      if (foundprod.length) {
        this.chipSelectedprod.push(foundprod[0]);
        // this.chipSelectedprodid.push(foundprod[0].id)
        this.chipSelectedprodid.push(foundprod[0].name)
      }
  }
  // expensegrp dropdown end


  from_month=[
    {id:1,month:'Apr',month_id:4},
    {id:2,month:'May',month_id:5},
    {id:3,month:'Jun',month_id:6},
    {id:4,month:'Jul',month_id:7},
    {id:5,month:'Aug',month_id:8},
    {id:6,month:'Sep',month_id:9},
    {id:7,month:'Oct',month_id:10},
    {id:8,month:'Nov',month_id:11},
    {id:9,month:'Dec',month_id:12},
    {id:10,month:'Jan',month_id:1},
    {id:11,month:'Feb',month_id:2},
    {id:12,month:'Mar',month_id:3},
  ]


  

supplier_chkval:any;
headercheck:any;
headercheckone:boolean =true;
fyer:String;
type:any;
amountval_type:any;
amount_type:any;
firstyear:any;
lastyear:any;
budnext_yr:any;
addyear:any;
submit_div:boolean =true;
display:boolean=true
@ViewChild('popupvariance') popupvariance;
public displayfrom_month(month?: monthauto): string | undefined {
  return month ? month.month : undefined;
  
}

frommonthsearch(month){
  let tomonthvalidation:any
  if(this.pprSearchForm.value.tomonth=='' ||this.pprSearchForm.value.tomonth==undefined || this.pprSearchForm.value.tomonth==null){
    tomonthvalidation=''
  }else{
    this.pprSearchForm.controls['tomonth'].reset('')
    tomonthvalidation=this.pprSearchForm.value.tomonth
  }
  
  let limt=0
  let headerdata=[]
  var pprreportheader=[
    {id:1,month:'Apr' ,month_id:4},
    {id:2,month:'May' ,month_id:5},
    {id:3,month:'Jun' ,month_id:6},
    {id:4,month:'Jul',month_id:7},
    {id:5,month:'Aug',month_id:8},
    {id:6,month:'Sep',month_id:9},
    {id:7,month:'Oct',month_id:10},
    {id:8,month:'Nov',month_id:11},
    {id:9,month:'Dec',month_id:12},
    {id:10,month:'Jan',month_id:1},
    {id:11,month:'Feb' ,month_id:2},
    {id:12,month:'Mar' ,month_id:3},
  ]
  if(this.pprreport_header==undefined || this.pprreport_header==null || this.pprreport_header== '' || this.pprreport_header.length==0){
    headerdata=pprreportheader
  }else{
    if(tomonthvalidation!=''){
      headerdata=pprreportheader
      
      limt=12-this.previousmonthid
      headerdata.splice(this.previousmonthid,limt)
    }else{
      
    headerdata=pprreportheader

    }
    
  }

//   if (this.finy == undefined) {
//     this.startyear = ''
//     this.lastyear = ''
//   } else {
//     this.startyear = this.finy.slice(2, 4)
//     this.lastyear = this.finy.slice(5, 9)
//     let startyr=this.startyear.toString()
//   let endyr=this.lastyear.toString()
//   for(let month in headerdata){
//     if(!(headerdata[month].month + endyr)){
//     if(headerdata[month].id==1 || headerdata[month].id==2 || headerdata[month].id==3){
//       headerdata[month].month=headerdata[month].month + endyr
//     }else{
//       headerdata[month].month=headerdata[month].month + startyr
//     }
//   }
//   }
// }
if(month==undefined || month== null || month==''){
  this.frommonthid=0
  this.from_monthvar=0

}else{
let data=headerdata
  let indexof_mon=data.findIndex(x=>x.id==month.id)
  if(indexof_mon==0){
    limt=0
    this.frommonthid=month.id
    this.from_monthvar=month.month_id
  }else{
  //   limt=month.id
  

    this.frommonthid=month.id
    this.from_monthvar=month.month_id
    headerdata = headerdata.filter(o => o.id >=this.frommonthid);

  //   headerdata.splice(0,limt-1)
  
  }
}
if(headerdata.length==0){
  headerdata=pprreportheader
}
  this.pprreport_header=headerdata
  
  

}
tomonthsearch(month){
  let headerdata:any=[]
  let frommmonthvalidation:any
  if(this.pprSearchForm.value.frommonth=='' || this.pprSearchForm.value.frommonth==undefined || this.pprSearchForm.value.frommonth==null){
    frommmonthvalidation=''
  }
  let limt=0
  let pprreportheader=[
    {id:1,month:'Apr' ,month_id:4},
    {id:2,month:'May' ,month_id:5},
    {id:3,month:'Jun' ,month_id:6},
    {id:4,month:'Jul',month_id:7},
    {id:5,month:'Aug',month_id:8},
    {id:6,month:'Sep',month_id:9},
    {id:7,month:'Oct',month_id:10},
    {id:8,month:'Nov',month_id:11},
    {id:9,month:'Dec',month_id:12},
    {id:10,month:'Jan',month_id:1},
    {id:11,month:'Feb' ,month_id:2},
    {id:12,month:'Mar' ,month_id:3},
    ]
  
  
  
  
  
  if(this.pprreport_header==undefined || this.pprreport_header==null || this.pprreport_header== '' || this.pprreport_header.length==0){
    headerdata=pprreportheader
  }else{
  if(frommmonthvalidation!='' || frommmonthvalidation!=undefined || frommmonthvalidation!=null){
    headerdata=pprreportheader
    limt=this.frommonthid
    headerdata = headerdata.filter(o => o.id >=limt);
      
  }else{
    headerdata=pprreportheader
  }
    
  
}
var selectindex:any=0

  // if (this.finy == undefined) {
  //   this.startyear = ''
  //   this.lastyear = ''
  // } else {
  //   this.startyear = this.finy.slice(2, 4)
  //   this.lastyear = this.finy.slice(5, 9)
  //   let startyr=this.startyear.toString()
  // let endyr=this.lastyear.toString()
  // 
  // for(let ind in headerdata){
    
  //   if(headerdata[ind].id==1 || headerdata[ind].id==2 || headerdata[ind].id==3){
  //     headerdata[ind].month=headerdata[ind].month + endyr
  //   }else if(headerdata[ind].id==13){
  //     continue;
  //   } else{
  //     headerdata[ind].month=headerdata[ind].month + startyr
  //   }
  
  // }
  // }
  
 
  // if(month.id==1){
  //   limt=0
  // }else{
  //   limt=12-(month.id)
  if(frommmonthvalidation=='' || frommmonthvalidation==undefined || frommmonthvalidation==null){
    this.frommonthid=0
    this.from_monthvar=0
  
  }
  if(month==''||month==undefined || month==null){
    this.previousmonthid=0
    this.to_month=0
  }
  else{
    this.previousmonthid=month.id
    this.to_month=month.month_id
  //   
  // headerdata.splice(selectindex,limt)

  // }
headerdata = headerdata.filter(o => o.id <=month.id);
  }
  
  if(headerdata.length==0){
    headerdata=pprreportheader
  }
  this.pprreport_header=headerdata
  

}
budgetbuildersearech_click(data){
  let montharr_variance=['Apr',
'May',
'Jun',
'Jul',
'Aug',
'Sep',
  'Oct',
  'Nov',
  'Dec',
'Jan',
'Feb',
'Mar',]
this.param={
  "finyear":"",
  "flag":'',
  "branch_id":'',
  "branch_name":"",
  "divAmount":'',
  "year_term":'',
  "sectorname":"",
  "microbscode":"",
  "microcccode": "",
  "sector_id":"",
  "masterbusinesssegment_name":"",
  "business_id":"",
  "cc_name":"",
  "cc_id":"",
  "bs_name":"",
  "bs_id":"",
  "from_expense_month":"",
  "to_expense_month":"",
}
  this.supplier_chkval="N"
  if ((this.pprSearchForm.value.finyear === undefined) || (this.pprSearchForm.value.finyear === null)) {
      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      this.display=false
      return false;
    }else if(this.pprSearchForm.value.finyear === '') {
      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      this.display=false
      return false;
    }else{
      if(this.pprSearchForm.value.finyear.finyer==undefined){
        this.fyer= this.pprSearchForm.value.finyear
        // this.pprSearchForm.value.finyear=this.pprSearchForm.value.finyear
        this.param.finyear=this.pprSearchForm.value.finyear
      }else{
        this.fyer= this.pprSearchForm.value.finyear.finyer
        this.param.finyear=this.pprSearchForm.value.finyear.finyer
        // this.param.finyear=this.pprSearchForm.value.finyear

      }
  }
  let  myArr = this.fyer.toString().split("-");
  this.firstyear=(parseInt(myArr[1])-1)
  this.lastyear=myArr[1]
  
  this.addyear=(parseInt(myArr[1])+1)
  this.budnext_yr=(parseInt(myArr[1])+2)
  if (this.pprSearchForm.value.year_term === undefined || this.pprSearchForm.value.year_term === null ) {
      this.toastr.warning('', 'Please Select Quarterly or Monthly', { timeOut: 1500 });
      this.display=false

      return false;
    }else if(this.pprSearchForm.value.year_term === ''){
      this.toastr.warning('', 'Please Select Quarterly or Monthly', { timeOut: 1500 });
      this.display=false

      return false;
    }else{
      if (data.year_term=='Quarterly'){
        this.headercheck=false;
        this.type='Quarterly'
        this.headercheckone=true;
        this.param.year_term=data.year_term
      }
      else if(data.year_term=='Monthly'){
        this.type='Monthly'
        this.param.year_term=data.year_term
      }
    }
    if (this.pprSearchForm.value.divAmount === undefined || this.pprSearchForm.value.divAmount === null) {
      this.toastr.warning('', 'Please Select Amount', { timeOut: 1500 });
      this.display=false

      return false;
    }else if(this.pprSearchForm.value.divAmount === ''){
      this.toastr.warning('', 'Please Select Amount', { timeOut: 1500 });
      this.display=false

      return false;
    }else{
      this.param.divAmount=this.pprSearchForm.value.divAmount
    }

    if(this.pprSearchForm.value.flag==undefined || this.pprSearchForm.value.flag == null){
      this.toastr.warning('', 'Please Select ALEI', { timeOut: 1500 });
      return false;
      this.pprSearchForm.value.flag=''
    }else if(this.pprSearchForm.value.flag== ''){
      this.toastr.warning('', 'Please Select ALEI', { timeOut: 1500 });
      return false;
    }else{
      this.param.flag=typeof this.pprSearchForm.value.flag=="object"?this.pprSearchForm.value.flag.flag :this.pprSearchForm.value.flag
      let flagindex=this.alei.findIndex(x=> x.flag==this.param.flag)
      this.Aeli_value=this.alei[flagindex].name
    }
    if((data.branch_id==undefined) || (data.branch_id==null)){
      // this.toastr.warning('', 'Please Select Branch', { timeOut: 1500 });
      // this.display=false
      this.param.branch_id=''
      // return false;
      
    }else if(data.branch_id==''){
      this.param.branch_id=''
    }else{
      this.param.branch_id=data.branch_id.id
    }
  
   
    if((data.sectorname==undefined) || (data.sectorname=='')){
      // this.toastr.warning('', 'Please Select Sector', { timeOut: 1500 });
      // this.display=false

      // return false;
      this.param.sectorname=''
      this.param.sector_id=''
    }else{
      let sector1_name=data.sectorname
      this.param.sectorname=this.pprSearchForm.value.sectorname.name
      this.param.sector_id=this.pprSearchForm.value.sectorname.id
      if(this.param.sectorname==undefined){
        this.param.sectorname=sector1_name
      }
    }
    if((data.businesscontrol==undefined) || (data.businesscontrol==null)){
      // this.toastr.warning('', 'Please Select Business', { timeOut: 1500 });
      // this.display=false

      //   return false;
      this.param.masterbusinesssegment_name=''
      this.param.business_id=''
    }else if(data.businesscontrol==''){
      this.param.masterbusinesssegment_name=''
      this.param.business_id=''
    }
    else{
      this.param.masterbusinesssegment_name=this.pprSearchForm.value.businesscontrol.name
      this.param.business_id=this.pprSearchForm.value.businesscontrol.id
    }
    if((data.bs_id==undefined)||(data.bs_id==null)){
      // this.toastr.warning('', 'Please Select BS Name', { timeOut: 1500 });
      // this.display=false

      // return false;
      this.param.bs_name=''
      this.param.bs_id=''
    }else if(data.bs_id==""){
      this.param.bs_name=''
      this.param.bs_id=''
      this.param.microbscode = ''
    }else{
      this.param.bs_name=this.pprSearchForm.value.bs_id.name
      this.param.bs_id=this.pprSearchForm.value.bs_id.id
      this.param.microbscode = this.pprSearchForm.value.bs_id.microbscode
    }
    if((data.cc_id ==undefined)||(data.cc_id==null)){
      // this.toastr.warning('', 'Please Select CC Name', { timeOut: 1500 });
      // this.display=false

      // return false;
      this.param.cc_name=''
      this.param.cc_id=''
    }else if(data.cc_id==""){
      this.param.cc_name=''
      this.param.cc_id=''
      this.param.microcccode = ''
    }else{
      this.param.cc_name=this.pprSearchForm.value.cc_id.name
      this.param.cc_id=this.pprSearchForm.value.cc_id.id
      this.param.microcccode = this.pprSearchForm.value.cc_id.microcccode
    }
   
    this.varianceheader=this.pprreport_header
    if(this.chipSelectedprodid.length==0){
      this.pprSearchForm.value.expensegrp_name_arr=''
    }else{
    this.pprSearchForm.value.expensegrp_name_arr=this.chipSelectedprodid}
    
    if ((data.branch_id==undefined)||(data.branch_id==null)){
      this.param.branch_id=''
      this.param.branch_name=""
    }else if(data.branch_id==''){
      this.param.branch_id=''
      this.param.branch_name=""
    }else{
      if(typeof this.pprSearchForm.value.branch_id === 'object') {
        this.param.branch_name=this.pprSearchForm.value.branch_id.name
        this.param.branch_id=this.pprSearchForm.value.branch_id.id
      }else{
        this.param.branch_name=this.pprSearchForm.value.branch_name
        this.param.branch_id=this.pprSearchForm.value.branch_id
      }
     
    }
    if(data.frommonth==''|| data.frommonth==undefined || data.frommonth ==null){
      this.param.from_expense_month=''
      this.from_month_variance='Apr'
    }else{
      if(data.tomonth==''|| data.tomonth==undefined || data.tomonth ==null){
        this.toastr.warning('','Please Select To Month',{timeOut:1500})
        return false;
      }
      this.param.from_expense_month=this.pprSearchForm.value.frommonth.month_id
      this.from_month_variance=this.pprSearchForm.value.frommonth.month
    }
    if(data.tomonth==''|| data.tomonth==undefined || data.tomonth ==null){
       
      this.param.to_expense_month=''
      this.to_month_variance='Mar'
    }else{
      if(data.frommonth==''|| data.frommonth==undefined || data.frommonth ==null){
        this.toastr.warning('','Please Select From Month',{timeOut:1500})
        return false;
      }
      this.param.to_expense_month=this.pprSearchForm.value.tomonth.month_id
      this.to_month_variance=this.pprSearchForm.value.tomonth.month
    }
  this.SpinnerService.show();
  this.dataService.getbudgetsummary(this.param)
        .subscribe((results: any[]) => {

          this.SpinnerService.hide();
          this.display=true

          let datas = results["data"];
          this.display=true

          if (datas.length!=0){
            this.popupvariance.nativeElement.click()
            if (data.divAmount=='L'){
              this.amountval_type='L'
              this.amount_type='Amount In Lakhs'
            }
            if (data.divAmount=='K'){
              this.amountval_type='K'
              this.amount_type='Amount In Thousands'
            }
            if (data.divAmount=='C'){
              this.amountval_type='C'
              this.amount_type='Amount In Crores'
            }
            this.headercheckone=false;
            this.headercheck=true
          this.submit_div=false;
      this.display=true

          if(data.year_term=='Monthly'){
            this.summarydata= datas}
            else{
              this.qsummarydata= datas
            }}
            else{
              this.headercheckone=true;
            this.headercheck=true
          this.submit_div=true;
      this.display=true

          this.amount_type=''
              this.summarydata=[]
              this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
              return false;
            }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
        console.log("supplier_chkval:", this.supplier_chkval);
     
        
}

//   tree level start
masterbusinesssegment_name_params:any;
overall_expense_id:any;
overall_subcat_id:any;
treelevel_click(ind,data,data1,mon_type){
  let a=[]
  let a2=ind+1 
  if (data.tree_flag=='N'){
    if(data.Padding_left=='10px'){
  for (let i = a2; i < data1.length; i++) {
    let a1=data1[i]
    a.push(i) 
    if (a1.Padding_left=='10px') { break; }
    console.log ("Block statement execution no." + i);
  }}
  if(data.Padding_left=='50px'){
    for (let i = a2; i < data1.length; i++) {
      let a1=data1[i]
      a.push(i) 
      if ((a1.Padding_left=='50px')||(a1.Padding_left=='10px')) { break; }
      console.log ("Block statement execution no." + i);
    }}
    if(data.Padding_left=='75px'){
      for (let i = a2; i < data1.length; i++) {
        let a1=data1[i]
        a.push(i) 
        if ((a1.Padding_left=='75px')||(a1.Padding_left=='50px') ||(a1.Padding_left=='10px')) { break; }
        console.log ("Block statement execution no." + i);
      }}
      if(data.Padding_left=='100px'){
        for (let i = a2; i < data1.length; i++) {
          let a1=data1[i]
          a.push(i) 
          if ((a1.Padding_left=='100px')||(a1.Padding_left=='75px')||(a1.Padding_left=='50px') ||(a1.Padding_left=='10px')) { break; }
          console.log ("Block statement execution no." + i);
        }}
  a.pop()
  const indexSet = new Set(a);

const arrayWithValuesRemoved = data1.filter((value, i) => !indexSet.has(i));
arrayWithValuesRemoved[ind].tree_flag='Y'
if(mon_type=='mon'){
  this.summarydata=arrayWithValuesRemoved;
  }
  if(mon_type=='qtr'){
    this.qsummarydata=arrayWithValuesRemoved;
    }


  }else{
   
  if (data.Padding_left=='10px'){
    // if(this.pprSearchForm.value.masterbusinesssegment_name==undefined){
    //   this.masterbusinesssegment_name_params=""
    //  }else{
    //   this.masterbusinesssegment_name_params=this.pprSearchForm.value.masterbusinesssegment_name
    //  }
    let input_params={
      "expense_grp_id":data.expensegrp_id,
      "branch_id":this.param.branch_id,
      "finyear": this.param.finyear,
      "year_term": this.type,
      "divAmount": this.amountval_type,
      "sectorname":this.param.sectorname,
      "masterbusinesssegment_name":this.param.masterbusinesssegment_name,
      "bs_name":this.param.bs_name,
      "cc_name":this.param.cc_name,
       "microbscode":this.pprSearchForm.value.bs_id.microbscode?this.pprSearchForm.value.bs_id.microbscode:"",
       "microcccode":this.pprSearchForm.value.cc_id.microcccode?this.pprSearchForm.value.cc_id.microcccode:"",
      'from_expense_month':this.param.from_expense_month,
      "to_expense_month":this.param.to_expense_month,
      "amount_flag":data.amount_flag
  }
  this.new_expense_list(ind,input_params,data1,1,mon_type)

  }
 
  if(data.Padding_left=='50px'){
    // if(this.pprSearchForm.value.masterbusinesssegment_name==undefined){
    //   this.masterbusinesssegment_name_params=""
    //  }else{
    //   this.masterbusinesssegment_name_params=this.pprSearchForm.value.masterbusinesssegment_name
    //  }
    let input_params={
      "branch_id":this.param.branch_id,
      "finyear": this.param.finyear,
      "year_term": this.type,
      "divAmount": this.amountval_type,
      "sectorname":this.param.sectorname,
      "masterbusinesssegment_name":this.param.masterbusinesssegment_name,
      "bs_name":this.param.bs_name,
      "cc_name":this.param.cc_name,
      "microbscode":this.pprSearchForm.value.bs_id.microbscode?this.pprSearchForm.value.bs_id.microbscode:"",
      "microcccode":this.pprSearchForm.value.cc_id.microcccode?this.pprSearchForm.value.cc_id.microcccode:"",
      "expense_id":data.expense_id,
      'from_expense_month':this.param.from_expense_month,
      "to_expense_month":this.param.to_expense_month,
      "amount_flag":data.amount_flag
  }
    this.new_builder_cat_list(ind,input_params,data1,mon_type)
  }
if(data.Padding_left=='75px'){
  let input_params={
    "branch_id":this.param.branch_id,
    "finyear": this.param.finyear,
    "year_term": this.type,
    "divAmount": this.amountval_type,
    "sectorname":this.param.sectorname,
    "masterbusinesssegment_name":this.param.masterbusinesssegment_name,
    "microbscode":this.pprSearchForm.value.bs_id.microbscode?this.pprSearchForm.value.bs_id.microbscode:"",
    "microcccode":this.pprSearchForm.value.cc_id.microcccode?this.pprSearchForm.value.cc_id.microcccode:"",
    "bs_name":this.param.bs_name,
    "cc_name":this.param.cc_name,
    "expense_id":data.expense_id,
    "category_id":data.cat_id,
    'from_expense_month':this.param.from_expense_month,
    "to_expense_month":this.param.to_expense_month,
    "amount_flag":data.amount_flag
}
  this.new_buildersubcat_list(ind,input_params,data1,mon_type)
}
if (data.Padding_left=='100px'){
  this.overall_expense_id=data.expense_id
  this.overall_subcat_id=data.subcat_id
  if(this.pprSearchForm.value.masterbusinesssegment_name==undefined){
    this.masterbusinesssegment_name_params=""
   }else{
    this.masterbusinesssegment_name_params=this.pprSearchForm.value.masterbusinesssegment_name
   }
   let input_params={   
    "divAmount":this.amountval_type,
    "apexpense_id": data.expense_id,
    "apsubcat_id": data.subcat_id,
    "masterbusinesssegment_name": this.param.masterbusinesssegment_name,
    "sectorname": this.param.sectorname,
    "yearterm": this.type,
    "finyear":this.param.finyear,
    "bs_name":this.param.bs_name,
    "cc_name":this.param.cc_name,
    "microbscode":this.pprSearchForm.value.bs_id.microbscode?this.pprSearchForm.value.bs_id.microbscode:"",
    "microcccode":this.pprSearchForm.value.cc_id.microcccode?this.pprSearchForm.value.cc_id.microcccode:"",
    "apinvoicebranch_id":this.param.branch_id,
    'from_expense_month':this.param.from_expense_month,
    "to_expense_month":this.param.to_expense_month,
    "amount_flag":data.amount_flag
}
this.getsupplieramountdetails(ind,input_params,data1,mon_type);

}
}
}
index_expense:any;
private new_expense_list(ind,data,data1,pageNumber,mon_type){
  this.index_expense=ind+1
  this.SpinnerService.show()
  
  this.dataService.new_builderexpense_list(data)
    .subscribe((results: any[]) => {
    this.SpinnerService.hide()

      let datas = results["data"];
      
      if (datas.length==0){
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
      }else{
        
      for (var val of datas) {
        let a=data
        
        data1.splice(this.index_expense, 0, val);
        this.index_expense=this.index_expense+1
      }
      data1[ind].tree_flag='N'
      if(mon_type=='mon'){
      this.summarydata=data1
      }
      if(mon_type=='qtr'){
        this.qsummarydata=data1
        }
      this.supplierList = datas;}
      

    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
}
private new_builder_cat_list(ind,data,data1,mon_type){
  this.index_cat=ind+1
  this.SpinnerService.show()
  
    this.dataService.new_variance_cat_list(data)
      .subscribe((results: any[]) => {
      this.SpinnerService.hide()
  
        let datas = results["data"];
        if (datas.length==0){
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        }else{
          
        for (var val of datas) {
          let a=data
          data1.splice(this.index_cat, 0, val);
          this.index_cat=this.index_cat+1
        }
        data1[ind].tree_flag='N'
        if(mon_type=='mon'){
        this.summarydata=data1
        }
        if(mon_type=='qtr'){
          this.qsummarydata=data1
          }
        this.supplierList = datas;}
        
  
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
index_subcat:any;
supplierList:any;
private new_buildersubcat_list(ind,data,data1,mon_type){
this.index_subcat=ind+1
this.SpinnerService.show()

  this.dataService.new_buildersubcat_list(data)
    .subscribe((results: any[]) => {
    this.SpinnerService.hide()

      let datas = results["data"];
      if (datas.length==0){
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
      }else{
        
      for (var val of datas) {
        let a=data
        data1.splice(this.index_subcat, 0, val);
        this.index_subcat=this.index_subcat+1
      }
      data1[ind].tree_flag='N'
      if(mon_type=='mon'){
      this.summarydata=data1
      }
      if(mon_type=='qtr'){
        this.qsummarydata=data1
        }
      this.supplierList = datas;}
      

    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}

private getsupplieramountdetails(ind,data,data1,mon_type){
    this.SpinnerService.show()
      
  this.dataService.variance_getsupplieramountdetails(data)
    .subscribe((results: any[]) => {
    this.SpinnerService.hide()

      let datas = results["data"];
      if (datas.length==0){
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
      }else{
        
      for (var val of datas) {
        let a=data
        data1.splice(ind+1, 0, val);
        
      }
      data1[ind].tree_flag='N'
      if(mon_type=='mon'){
        this.summarydata=data1
        }
        if(mon_type=='qtr'){
          this.qsummarydata=data1
          }
      this.supplierList = datas;}
      

    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}
// suppliergetapi end

//   tree level end
headercol:any;
private getEmployeeList() {
  this.headercheckone=true;
  this.headercheck=true;
  this.headercol=[1,2,3,4,5,6,7,8,9,10,11,12,13]
  
  this.year=new Date().getFullYear().toString().substr(-2);
  this.Apr="Apr-"+this.year;
  // this.Apr_Act="Apr Act-"+this.year;
  // this.Apr_Bgt="Apr Bgt-"+(this.year+1);
  this.May="May-"+this.year
  // this.May_Act="May Act-"+this.year
  // this.May_Bgt="May Bgt-"+(this.year+1)
  this.Jun="Jun-"+this.year
  // this.Jun_Act="Jun Act-"+this.year
  // this.Jun_Bgt="Jun Bgt-"+(this.year+1)
  this.Jul="Jul-"+this.year
  this.Aug="Aug-"+this.year
  this.Sep="Sep-"+this.year
  this.Oct="Oct-"+this.year
  this.Nov="Nov-"+this.year
  this.Dec="Dec-"+this.year
  this.nextyear=parseInt(new Date().getFullYear().toString().substr(-2))+1
  this.Jan="Jan-"+this.nextyear
  this.Feb="Feb-"+this.nextyear
  this.Mar="Mar-"+this.nextyear
  
  
}
addrow_monthly(row_index,pprdata,pprtotaldata){
  let a={
    "Padding_left":"120px",
    "Padding":"10px",
    "new_data":"Y",
    "name":"",
    "YTD":["","",""],
    "Apr":["","",""],
    "May":["","",""],
    "Jun":["","",""],
    "Jul":["","",""],
    "Aug":["","",""],
    "Sep":["","",""],
    "Oct":["","",""],
    "Nov":["","",""],
    "Dec":["","",""],
    "Jan":["","",""],
    "Feb":["","",""],
    "Mar":["","",""]
  }
  let a11=[]
  let a2=row_index+1 
  if(pprdata.Padding_left=='100px'){
    for (let i = a2; i < pprtotaldata.length; i++) {
      let a1=pprtotaldata[i]
      a11.push(i) 
      if ((a1.Padding_left=='50px')||(a1.Padding_left=='10px') ||((a1.Padding_left=='100px'))) { break; }
      console.log ("Block statement execution no." + i);
    }}
    a11.pop
    let a12=a11.length
  let a13=a12-1
  let b=a11[a13]
  
  pprtotaldata.splice(b, 0, a);
  this.summarydata=pprtotaldata

}
addrow_qtr(row_index,pprdata,pprtotaldata){
  let a={
    "Padding_left":"120px",
    "Padding":"10px",
    "new_data":"Y",
    "name":"",
    "YTD":["","",""],
    "Quarterly_1":["","",""],
    "Quarterly_2":["","",""],
    "Quarterly_3":["","",""],
    "Quarterly_4":["","",""],
    
  }
  let a11=[]
  let a2=row_index+1 
  if(pprdata.Padding_left=='100px'){
    for (let i = a2; i < pprtotaldata.length; i++) {
      let a1=pprtotaldata[i]
      a11.push(i) 
      if ((a1.Padding_left=='100px')||(a1.Padding_left=='50px') ||(a1.Padding_left=='10px')) { break; }
      console.log ("Block statement execution no." + i);
    }}
    a11.pop
    let a12=a11.length
  let a13=a12-1
  let b=a11[a13]
  pprtotaldata.splice(b, 0, a);
  this.qsummarydata=pprtotaldata

}

delete_qty(idex,qdata){
  let a=[]
  a.push(idex)
  const indexSet1 = new Set(a);
  const arrayWithValuesRemoved1 = qdata.filter((value, i) => !indexSet1.has(i));
  this.qsummarydata=arrayWithValuesRemoved1

}
delete_month(idex,qdata){
  let a=[]
  a.push(idex)
  const indexSet1 = new Set(a);
  const arrayWithValuesRemoved1 = qdata.filter((value, i) => !indexSet1.has(i));
  this.summarydata=arrayWithValuesRemoved1

}

// employee search start

  Approver_dropdown(){
    let prokeyvalue: String = "";
      this.getapprover(prokeyvalue);
      this.approverForm.get('approvercontrol').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataService.getapproverdropdown(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.approverList = datas;
  
        })
  }


  
  private getapprover(prokeyvalue){
    this.dataService.getapproverdropdown(prokeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;
  
      })
  }
  public displayfnapprover(approver_name?: approverList): string | undefined {
    return approver_name ? approver_name.full_name : undefined;
    
  }
  draft_ary:any;
// employee search end
clear_budgetdata(){
  this.difference_down=""
  this.chipSelectedprod=[]   
  this.chipSelectedprodid=[]   
  // this.expInput.nativeElement.value = '';
  this.pprSearchForm.reset();
  this.chipSelectedprodid=[]
  this.summarydata=[]
  this.expenseList=[]
  this.previousmonthid=0
  this.frommonthid=0
  this.varianceheader=[]
  this.pprreport_header=[
    {id:1,month:'Apr' ,month_id:4},
    {id:2,month:'May' ,month_id:5},
    {id:3,month:'Jun' ,month_id:6},
    {id:4,month:'Jul',month_id:7},
    {id:5,month:'Aug',month_id:8},
    {id:6,month:'Sep',month_id:9},
    {id:7,month:'Oct',month_id:10},
    {id:8,month:'Nov',month_id:11},
    {id:9,month:'Dec',month_id:12},
    {id:10,month:'Jan',month_id:1},
    {id:11,month:'Feb' ,month_id:2},
    {id:12,month:'Mar' ,month_id:3}
  ]
  this.headercheckone=true;
  this.headercheck=true
  this.submit_div=true;
  this.amount_type=''
}
diff_download(event){
  let diff=event.value
  if(diff==undefined){
    diff=""
  } else{
    diff=event.value.diff
  }
  this.difference_down=diff
}
excel_download(diff){
  // let diff=this.difference_down
  if ((this.pprSearchForm.value.finyear === undefined) || (this.pprSearchForm.value.finyear === '') || (this.pprSearchForm.value.finyear === null)) {
    this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
    // this.display=false
    return false;
    this.fyer=''
    this.varianceexlx.finyear=''
  }else{
    if(this.pprSearchForm.value.finyear.finyer==undefined){
      this.fyer= this.pprSearchForm.value.finyear
      this.varianceexlx.finyear=this.pprSearchForm.value.finyear
    }else{
      this.fyer= this.pprSearchForm.value.finyear.finyer
      this.varianceexlx.finyear=this.pprSearchForm.value.finyear.finyer
    }
}


if(this.pprSearchForm.value.flag==undefined || this.pprSearchForm.value.flag == null ){

  this.toastr.warning('', 'Please Select ALEI', { timeOut: 1500 });
  return false;
  // this.pprSearchForm.value.flag=''
}else if(this.pprSearchForm.value.flag==''){
  this.toastr.warning('', 'Please Select ALEI', { timeOut: 1500 });
  return false;
}else{
  this.varianceexlx.flag=typeof this.pprSearchForm.value.flag == 'object' ? this.pprSearchForm.value.flag.flag : this.pprSearchForm.value.flag
}
let  myArr = this.fyer.toString().split("-");
this.firstyear=(parseInt(myArr[1])-1)
this.lastyear=myArr[1]

this.addyear=(parseInt(myArr[1])+1)
this.budnext_yr=(parseInt(myArr[1])+2)
if (this.pprSearchForm.value.year_term === '') {
    
  }
  if (this.pprSearchForm.value.divAmount === '') {
    
  }
  if((this.pprSearchForm.value.branch_id==undefined) || (this.pprSearchForm.value.branch_id==null)){
    // this.toastr.warning('', 'Please Select Branch', { timeOut: 1500 });
    // this.display=false

    // return false;
    this.varianceexlx.branch_id=""
    // this.varianceexlx.bizname=""
  }else if(this.pprSearchForm.value.branch_id==""){
    this.varianceexlx.branch_id=""
  }else{
    this.varianceexlx.branch_id=this.pprSearchForm.value.branch_id.id
    // this.varianceexlx.bizname=this.pprSearchForm.value.branch_id.name
  }

 
  if((this.pprSearchForm.value.sectorname==undefined) || (this.pprSearchForm.value.sectorname=='')){
    this.varianceexlx.sectorname=''
    this.varianceexlx.sector_id=''
    
  }else{
    let sector1_name=this.pprSearchForm.value.sectorname
    this.varianceexlx.sectorname=this.pprSearchForm.value.sectorname.name
    this.varianceexlx.sector_id=this.pprSearchForm.value.sectorname.id
    if(this.varianceexlx.sectorname==undefined){
      this.varianceexlx.sectorname=sector1_name
    }
  }
  if((this.pprSearchForm.value.businesscontrol==undefined) || (this.pprSearchForm.value.businesscontrol=='')){
    // this.toastr.warning('', 'Please Select Business', { timeOut: 1500 });
    // this.display=false

    //   return false;
    this.varianceexlx.bizname=""
    this.varianceexlx.biz_id=""
    this.varianceexlx.masterbusinesssegment_name=''
    this.varianceexlx.masterbusinesssegment_id=""
  }
  else{
    this.varianceexlx.bizname=this.pprSearchForm.value.businesscontrol.name
    this.varianceexlx.biz_id=this.pprSearchForm.value.businesscontrol.id
    this.varianceexlx.masterbusinesssegment_name=this.pprSearchForm.value.businesscontrol.name
    this.varianceexlx.masterbusinesssegment_id=this.pprSearchForm.value.businesscontrol.id       
  }
  if((this.pprSearchForm.value.bs_id==undefined)||(this.pprSearchForm.value.bs_id=='')){
    // this.toastr.warning('', 'Please Select BS Name', { timeOut: 1500 });
    // this.display=false

    // return false;
    this.varianceexlx.bs_name=''
    this.varianceexlx.bs_id=''
    this.varianceexlx.microbscode=""
  }else{
    this.varianceexlx.bs_name=this.pprSearchForm.value.bs_id.name
    this.varianceexlx.bs_id=this.pprSearchForm.value.bs_id.id
    this.varianceexlx.microbscode=this.pprSearchForm.value.bs_id.microbscode
  }
  if((this.pprSearchForm.value.cc_id==undefined)||(this.pprSearchForm.value.cc_id=='')){
    // this.toastr.warning('', 'Please Select CC Name', { timeOut: 1500 });
    // this.display=false

    // return false;
    this.varianceexlx.cc_name=''
    this.varianceexlx.cc_id=''    
    this.varianceexlx.microcccode=""
  }else{
    this.varianceexlx.cc_name=this.pprSearchForm.value.cc_id.name
    this.varianceexlx.cc_id=this.pprSearchForm.value.cc_id.id
    this.varianceexlx.microcccode=this.pprSearchForm.value.cc_id.microcccode
  }
  if (this.pprSearchForm.value.year_term=='Quarterly'){
    this.headercheck=false;
    this.type='Quarterly'
    this.headercheckone=true;
    
  }
  else if(this.pprSearchForm.value.year_term=='Monthly'){
    this.type='Monthly'
    
  }
  this.varianceheader=this.pprreport_header
  if(this.chipSelectedprodid.length==0){
    this.pprSearchForm.value.expensegrp_name_arr=''
  }else{
  this.pprSearchForm.value.expensegrp_name_arr=this.chipSelectedprodid}
  // this.pprSearchForm.value.sectorname=this.pprSearchForm.value.sectorname.name
  
   
  
  if(this.pprSearchForm.value.frommonth==''|| this.pprSearchForm.value.frommonth==undefined || this.pprSearchForm.value.frommonth ==null){
    this.varianceexlx.from_month=''
    this.from_month_variance='Apr'
  }else{
    if(this.pprSearchForm.value.tomonth==''|| this.pprSearchForm.value.tomonth==undefined || this.pprSearchForm.value.tomonth ==null){
      this.toastr.warning('','Please Select To Month',{timeOut:1500})
      return false;
      this.varianceexlx.from_month=''
    }
    this.varianceexlx.from_month=this.pprSearchForm.value.frommonth.month_id
    this.from_month_variance=this.pprSearchForm.value.frommonth.month
  }
  if(this.pprSearchForm.value.tomonth==''|| this.pprSearchForm.value.tomonth==undefined || this.pprSearchForm.value.tomonth ==null){
     
    this.varianceexlx.to_month=''
    this.to_month_variance='Mar'
  }else{
    if(this.pprSearchForm.value.frommonth==''|| this.pprSearchForm.value.frommonth==undefined || this.pprSearchForm.value.frommonth ==null){
      this.toastr.warning('','Please Select From Month',{timeOut:1500})
      return false;
      this.varianceexlx.to_month=''
    }
    this.varianceexlx.to_month=this.pprSearchForm.value.tomonth.month_id
    this.to_month_variance=this.pprSearchForm.value.tomonth.month
  }
  
  this.SpinnerService.show();

  
  if(diff=='bs'){
    this.dataService.variencexlsxdownload(this.varianceexlx,diff).subscribe((data:any) => { 
      this.SpinnerService.hide();
      
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Variance Analysis'+".xlsx";
      link.click();
      this.toastr.success('Success');
      }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }else if(diff=="exp" || diff=="variance"){
    this.toastr.success("",'File Generate Start...',{timeOut:1500})
    this.SpinnerService.hide();

    this.dataService.variencexlsxdownload(this.varianceexlx,diff).subscribe((data:any) => { 
      // this.SpinnerService.hide();
      
      // let binaryData = [];
      // binaryData.push(data)
      // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      // let link = document.createElement('a');
      // link.href = downloadUrl;
      // let date: Date = new Date();
      // link.download = 'Variance Analysis'+".xlsx";
      // link.click();
      // this.toastr.success('Success');
      }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }else{
    let variance_data = document.getElementById('varience');
    const variance_table: XLSX.WorkSheet = XLSX.utils.table_to_sheet(variance_data);
    const new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, variance_table, 'Variance Analysis');
    XLSX.writeFile(new_workbook, "variance Analysis.xlsx");
  this.SpinnerService.hide()
  }
    
}
}
