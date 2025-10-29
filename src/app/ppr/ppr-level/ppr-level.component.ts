import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PprService } from '../ppr.service';
import { NgxSpinnerService } from "ngx-spinner";
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, debounce, skip } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ErrorhandlingService } from '../errorhandling.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SharePprService } from '../share-ppr.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable'; 


export interface branchList {
  id: number
  name: string
}
export interface bsList {
  id: number
  name: string
}
export interface ccList {
  id: number
  name: string
}
export interface finyearList {
  finyer: string
}
export interface sectorList {
  id: number
  name: string
}
export interface businessList {
  id: number
  name: string
}
export interface expensegrpList {
  id: number
  name: string
}
export interface iDeptList {
  name: string;
  id: number;
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
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-ppr-level',
  templateUrl: './ppr-level.component.html',
  styleUrls: ['./ppr-level.component.scss'],
  providers: [{ provide: DateAdapter, useClass: PickDateAdapter },{ provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },DatePipe]
})
export class PprLevelComponent implements OnInit {

  panelOpenState = false;
  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;

  //bs

  @ViewChild('bsInput') bsInput: any;
  @ViewChild('bs') matAutocompletebs: MatAutocomplete;

  //cc
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;

  //  finyear
  @ViewChild('finyearInput') finyearInput: any;

  //sector
  @ViewChild('sectornameInput') sectornameInput: any;

  //business
  @ViewChild('businessInput') businessInput: any;
  @ViewChild('business_name') business_nameautocomplete: MatAutocomplete;

  //expense_grp
  @ViewChild('expenseInput') expenseInput: any;

  @ViewChild('bsclear_nameInput') bsclear_name;

  //   @ViewChild("template1") template1: TemplateRef<any>;
  //  @ViewChild("template2") template2: TemplateRef<any>;
  //  selectedTemplate: TemplateRef<any>;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('employeeDeptInput') employeeDeptInput: any;
  @ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
  public chipSelectedEmployeeDept: iDeptList[] = [];
  public chipSelectedEmployeeDeptid = [];
  expensegrpList: iDeptList[];

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('preformattedDiv', { static: false }) pdfContent: ElementRef;
  @ViewChild('expansionPanel') expansionPanel: MatExpansionPanel;  
  @ViewChild('supplierContactInput') supplierContactInput: any;
  @ViewChild('supplier_name') matAutocompletesupp: MatAutocomplete;
  @ViewChild('pprlevels') pprlevelsRef!: ElementRef<HTMLTableElement>;


  stateList: Array<any>
  aa: any;
  year: any;
  Apr: string;
  May: string;
  Jun: string;
  Jul: string;
  Aug: string;
  Sep: string;
  Oct: string;
  Nov: string;
  Dec: string;
  Jan: string;
  Feb: string;
  Mar: string;
  nextyear: any;
  headercheckone: any;
  summarydata: any;
  qsummarydata: any;
  headercheck: any;
  businessview: any;
  pprSearchForm: FormGroup;
  fileuploade: FormGroup;
  branchList: Array<branchList>;
  isLoading = false;
  bsList: Array<bsList>;
  ccList: Array<ccList>;
  finyearList: Array<finyearList>;
  sectorList: Array<sectorList>;
  businessList: Array<businessList>;
  // expensegrpList:Array<expensegrpList>;
  tabcheck_ppr: boolean = true;
  tabcheck_pprbuilder: boolean = false;
  tabcheck_pprreviewer: boolean = false;
  tabcheck_pprapprover: boolean = false;
  tabcheck_pprreport: boolean = false;
  variance_analysis: boolean = false;
  cost_allocation: boolean = false
  amount_type: any;
  amountval_type: any;
  exampleModalCenter: any;
  supplierList: any;
  supplieramountList: any;
  levelsdatas: any
  levelsdatavalueexp: any;
  leveltwo: any;
  level4a: { level_id: any; finyear: any; yearterm: any; divAmount: any; branch_id: any; sectorname: any; bizname: any; bs_code: any; cc_code: any; expensegrp: any[]; };
  level4avalue: any;
  levels5adatas: any;
  levelsdatavalueoneexp: any;
  dataaexp: boolean = true;
  levelsdatavalueone: any;
  dataaexpone: boolean = true;
  aindex: any = [];
  amount: any
  levels4a2datas: any;
  levels4a3datas: any;
  finy: any;
  has_next: boolean;
  has_previous: any;
  currentpage: any;
  index_cat: any;
  branch: any;
  ccbs: any;
  gldate: any;
  income: any;
  incomehr: number;
  lableincomehr: string;
  total_level: any;
  pdfSrc: any;
  nums: any;
  presentpage: number;
  indexval: any;
  tabledata:boolean = false;
  incomes_data:any;
  name_indexval: any;
  Search_value:any;
  Xlx_param :{Fin_year:string; Select_View:string; Select_Amount:string; Branch:string; Sector:string; Business:string; BS:string; CC:string; From_Month:string; To_Month:string}
  subcatparam: { branch_id: any; finyear: any; year_term: any; divAmount: any; sectorname: any; businesscontrol: any; bs_name: any; cc_name: any; category_id: any; };
  subcattotaldata: any;
  ind: number;
  incometotal: any;
  levels_net_before_after:boolean=false
  beforeallocation: any;
  beforetax: any;
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
  pprreport_header: any = []
  previousmonthid: any;
  frommonthid: any = 12;
  finyrstart: any;
  finyrlast: any;
  businessviewheader: any = [];
  colspanlength: number;
  headerdata: string[];
  endyear_ind: number = 8;
  startyear_ind: number = 9;
  start_month_arr: any = [];
  PPRMenuList
  month = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'YTD']
  quarterly = ['YTD', 'Quarterly_1', 'Quarterly_2', 'Quarterly_3', 'Quarterly_4']
  type: any
  supplier_chkval: any;
  fyer: String;
  dialogRef: any
  data_input: any;
  tabvales: any;
  masterbusinesssegment_name_params: any;
  tabcheck_supplier: boolean = true;
  tabcheck_ccbs: boolean = false;
  tabcheck_ecf: boolean = false;
  has_next_expence = true;
  has_previous_expence = true;
  currentpage_expence: number = 1;
  presentpage_expence: number = 1;
  index_expense: any;
  currentpagebra: any = 1
  has_nextbra: boolean = true
  has_previousbra: boolean = true
  download_types=[
    {"id":1,"type":"Summary Report"},
    {"id":2,"type":"Overall Report"},
  ]
  pprreport_excel:any
  rest: string;
  ppr_report_search:boolean=false;
  levelslist:any;
  levelstwodatass:any;
  allocation_al4_level: any;
  allocation_al4b_level: any[];
  income_total_level: any;
  beforeallocation_level: any;
  level_label_expand_data:any=[]
  level_code: any;
  level_label_expand: any={};
  levels_data_dynamic: any;
  report_chart: boolean=false;
  level_amount_key: any;
  has_previous_cat: any;
  has_next_cat: any;
  presentpage_cat: any;
  transaction_gl: any;
  gl_transaction_data: any[] = [];
  has_previous_pop:any;
  presentpage_pop:any;
  has_next_pop:any;
  month_val:any
  parms_val:any;
  from_month_data:number = 4;
  to_month:number =3;
  gl_transaction_from: FormGroup;
  current_date = new Date();
  isPanelClosed: boolean = false;
  subcat_bizdata: any;
  div_amount_list=[
    {"id":"A","name":"Absolute"},
    {"id":"T","name":"Thousands"},
    {"id":"L","name":"Lakhs"},
  ]
  amount_popup: any;
  rec_count: number;
  corebuz:boolean = true;
  supplier_list: any;
  constructor(private errorHandler: ErrorhandlingService, private formBuilder: FormBuilder, private dataService: PprService, private shareService: SharedService, private SpinnerService: NgxSpinnerService,private pprsharedservice :SharePprService,
    public dialog: MatDialog, private toastr: ToastrService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.headercheckone = false;
    this.headercheck = true;
    this.businessview = true
    this.colspanlength = this.month.length
    this.fileuploade = this.formBuilder.group({
      branch: [''],
      ccbs: [''],
      gldata: [''],
      income_file: ['']
    })
    this.pprSearchForm = this.formBuilder.group({
      finyear: [""],
      branch_id: [""],
      year_term: [""],
      divAmount: [""],
      sectorname: [""],
      businesscontrol: [""],
      bs_id: [""],
      cc_id: [""],
      supplier_check: [""],
      frommonth: [''],
      tomonth: [''],
      download_type:"",
    })
    this.gl_transaction_from =  this.formBuilder.group({
      entry_crno:'',
      supplier_name:'',
      transactiondate:'',
      branch_id_pop:'',
      div_amount:''
    })
    
  }

  getState() {
    this.dataService.getState()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        console.log("statenameeeee", datas)

      })
  }

  report_level_Labels() {
    this.SpinnerService.show()
    let flag=0
    this.dataService.report_level_Labels(flag,"")
      .subscribe((results: any[]) => {
        let datas = results["data"];      
          this.levelslist = datas;
        for(let listnet of this.levelslist){
          if(listnet.code=='L9' || listnet.code=='L10' || listnet.code=='L11' || listnet.code=='L12' || listnet.code=='L13'){
            listnet['expanded']=false
          }
        }
        console.log("let listnet of this.levelslist", this.levelslist)
       console.log("statenameeeee", datas);
       for(let label_name  of  this.levelslist){
        this.level_label_expand[label_name.name] = {"name":label_name.name,expanded:false}
       }
       this.SpinnerService.hide()
       console.log("this.level_label",this.level_label_expand)
      })

  }
  getEmployeeList() {

    this.aa = 'hg'
    console.log(this.aa);
    if (this.startyear === undefined || this.startyear === null || this.startyear === '') {

      console.log("false", this.startyear)
      this.year = new Date().getFullYear().toString().substr(-2);
      this.Apr = "Apr-" + this.year;
      this.May = "May-" + this.year
      this.Jun = "Jun-" + this.year
      this.Jul = "Jul-" + this.year
      this.Aug = "Aug-" + this.year
      this.Sep = "Sep-" + this.year
      this.Oct = "Oct-" + this.year
      this.Nov = "Nov-" + this.year
      this.Dec = "Dec-" + this.year
      this.nextyear = parseInt(new Date().getFullYear().toString().substr(-2)) + 1
      this.Jan = "Jan-" + this.nextyear
      this.Feb = "Feb-" + this.nextyear
      this.Mar = "Mar-" + this.nextyear
    } else {
      console.log("true")
      this.year = new Date().getFullYear().toString().substr(-2);
      this.Apr = "Apr-" + this.startyear;
      this.May = "May-" + this.startyear
      this.Jun = "Jun-" + this.startyear
      this.Jul = "Jul-" + this.startyear
      this.Aug = "Aug-" + this.startyear
      this.Sep = "Sep-" + this.startyear
      this.Oct = "Oct-" + this.startyear
      this.Nov = "Nov-" + this.startyear
      this.Dec = "Dec-" + this.startyear
      this.nextyear = parseInt(new Date().getFullYear().toString().substr(-2)) + 1
      this.Jan = "Jan-" + this.lastyear
      this.Feb = "Feb-" + this.lastyear
      this.Mar = "Mar-" + this.lastyear
    }

  }
  // branch dropdown start
  branchname(form,name) {
    let prokeyvalue: String = "";
    this.getbranchid(prokeyvalue);
    form.get(name).valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbranchdropdown(value, 1)
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
      //   for (let levelslist of this.levelslist) {

      //     levelslist.expanded = false
      //   }
      //   this.data4aexp = true
      //   this.dataaexp = true
      //   this.dataaexpone = true
      //   this.levelsdatavalueoneexp = ''
      //   this.levels4adatas = ''
      //   this.levelstwodatas = ''
      //   this.levelsonedatas = ''
      //   this.levelsdatas = ''
      //   this.levels5adatas = ''

      })
  }

  private getbranchid(prokeyvalue) {
    this.dataService.getbranchdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;

      })
  }

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
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.dataService.getbranchdropdown(this.branchContactInput.nativeElement.value, this.currentpagebra + 1)
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
  public displayfnsup(branch?: branchList): string | undefined {
    return branch ? branch.name : undefined;
  }
  // branch dropdown end
  // bs dropdown start

  bsname_dropdown() {
    let prokeyvalue: String = "";
    this.getbsid(prokeyvalue);
    this.pprSearchForm.get('bs_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbsdropdown(this.business_id, value, 1)
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
    this.dataService.getbsdropdown(this.business_id, prokeyvalue, 1)
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
                this.dataService.getbsdropdown(this.business_id, this.bsInput.nativeElement.value, this.currentpagebs + 1)
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

  selectbsSection(data) {
    this.cc_bs_id = data.id
    // for (let levelslist of this.levelslist) {

    //   levelslist.expanded = false
    // }

    // this.levels4adatas = ''
    // this.levelstwodatas = ''
    // this.levelsonedatas = ''
    // this.levelsdatas = ''
    // this.levels5adatas = ''

  }

  bs_cc_clear() {
    this.pprSearchForm.controls['cc_id'].reset('')
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
  }
  // bs dropdown end
  // cc dropdown start

  ccname_dropdown() {
    let prokeyvalue: String = "";
    this.getccid(prokeyvalue);
    this.pprSearchForm.get('cc_id').valueChanges
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


  public displayfncc(cc_name?: ccList): string | undefined {
    return cc_name ? cc_name.name : undefined;

  }
  // cc dropdown end
  // finyear dropdown start
  sector_id = 0;
  startyear: string
  lastyear: string
  finyear_dropdown() {
    let prokeyvalue: String = "";
    this.getfinyear(prokeyvalue);
    this.pprSearchForm.get('finyear').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getfinyeardropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              console.log(value.finyer)
              this.finy = value.finyer
              if (this.finy == undefined) {
                this.startyear = ''
                this.lastyear = ''
              } else {
                this.startyear = this.finy.slice(2, 4)
                this.lastyear = this.finy.slice(5, 9)
              }
              console.log("year=>", this.startyear, this.finy, this.lastyear)
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
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

  @ViewChild('fin_year') fin_yearauto: MatAutocomplete
  autocompletefinyearScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1;
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
                this.dataService.getbbfinyeardropdown(this.finyearInput.nativeElement.value, this.currentpage + 1)
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

  private getfinyear(prokeyvalue) {
    this.dataService.getfinyeardropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.finyearList = datas;
        console.log(this.finyearList)

      })
  }
  public displayfnfinyear(fin_year?: finyearList): string | undefined {
    return fin_year ? fin_year.finyer : undefined;

  }

  // finyear dropdown end
  // sector dropdown start

  Sector_dropdown() {
    let prokeyvalue: String = "";
    this.getsector(prokeyvalue);
    this.pprSearchForm.get('sectorname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getsectordropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        var sectorpush = {

          "description": "ALL",
          "id": "",
          "name": "ALL"

        }
        datas.splice(0, 0, sectorpush)
        this.sectorList = datas;
        console.log("sector=>", this.sectorList)
        this.pprSearchForm.controls['bs_id'].reset('')
        this.pprSearchForm.controls['businesscontrol'].reset('')
        this.pprSearchForm.controls['cc_id'].reset('')

      })
  }


  private getsector(prokeyvalue) {
    this.dataService.getsectordropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        var sectorpush = {

          "description": "ALL",
          "id": "",
          "name": "ALL"

        }
        datas.splice(0, 0, sectorpush)
        this.sectorList = datas;
        console.log("sector=>", this.sectorList)
      })
  }

  @ViewChild('sector_name') sectorAutoComplete: MatAutocomplete;
  autocompletesectorScroll() {
    this.has_next = true;
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
  public displayfnsectorname(sector_name?: sectorList): string | undefined {
    return sector_name ? sector_name.name : undefined;

  }

  selectsectorSection(name) {
    this.sector_id = name.id
  }

  secotralldata_clear() {
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['businesscontrol'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')
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

  }
  // sector dropdown end
  // business dropdown start
  Business_dropdown() {
    let prokeyvalue: String = "";
    this.getbusiness(prokeyvalue);
    this.pprSearchForm.get('businesscontrol').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbusinessdropdown(this.sector_id, value, 1)
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
        this.pprSearchForm.controls['bs_id'].reset('')
        this.pprSearchForm.controls['cc_id'].reset('')
      })
  }
  bs_clear() {
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')
  }
  autocompletebusinessnameScroll() {
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
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
  business_id = 0;
  private getbusiness(prokeyvalue) {
    this.dataService.getbusinessdropdown(this.sector_id, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;

      })
  }

  public displayfnbusiness(business_name?: businessList): string | undefined {
    return business_name ? business_name.name : undefined;

  }

  selectbusinessSection(data) {
    this.business_id = data.id
    this.level4avalue = ''
    this.leveltwo = ''
    this.levelone = ''
    this.levelzero = ''

    if (this.business_id == undefined) {
      this.pprSearchForm.value.bs_id = ' ';
    }

  }

  business_bs_clear() {
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')

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

  }
  // business dropdown end
  // expensegrp dropdown start

  Expensegrp_dropdown() {
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
        switchMap(value => this.dataService.getexpensegrpdropdown(value, 1)
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


  private getexpensegrp(prokeyvalue) {
    this.dataService.getexpensegrpdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // this.expensegrpList = datas;
        this.expenseList = datas

      })
  }

  autocompletexpenseScroll() {
    this.currentpage = 1
    this.has_next = true
    this.has_previous = true
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
          .subscribe(() => {
            const scrollTop = this.matprodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matprodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matprodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getexpensegrpdropdown(this.expInput.nativeElement.value, this.currentpage + 1)
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

  private new_expense_list(ind, data, data1, pageNumber) {
    this.index_expense = ind + 1
    this.SpinnerService.show()

    this.dataService.new_expense_list(data, pageNumber)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()

        let datas = results["data"];

        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {

          for (var val of datas) {
            let a = data

            data1.splice(this.index_expense, 0, val);
            this.index_expense = this.index_expense + 1
          }
          data1[ind].tree_flag = 'N'
          this.summarydata = data1
          this.supplierList = datas;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  index_subcat: any;
  private new_subcat_list(ind, data, data1) {
    this.index_subcat = ind + 1
    this.SpinnerService.show()

    this.dataService.new_subcat_list(data)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()

        let datas = results["data"];
        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {

          for (var val of datas) {
            let a = data
            data1.splice(this.index_subcat, 0, val);
            this.index_subcat = this.index_subcat + 1
          }
          data1[ind].tree_flag = 'N'
          this.summarydata = data1
          this.supplierList = datas;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  tranmonth_cunt: any
  qtr_cnt: any
  openpopup_fn(data, templateRef, tmonth, quarter) {
    this.tabcheck_supplier = true;
    this.tabcheck_ccbs = false;
    this.tabcheck_ecf = false;
    this.tranmonth_cunt = tmonth
    this.qtr_cnt = quarter
    this.data_input = {
      "apexpense_id": data.expense_id,
      "apsubcat_id": data.subcat_id,
      "transactionmonth": tmonth,
      "quarter": quarter,
      // "masterbusinesssegment_name": 'PBLG',
      "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
      "sectorname": this.pprSearchForm.value.sectorname,
      "apinvoicesupplier_id": "",
      // "apinvoicesupplier_id": 1,
      "yearterm": this.type,
      "finyear": this.pprSearchForm.value.finyear,
      "bs_name": this.pprSearchForm.value.bs_name,
      "cc_name": this.pprSearchForm.value.cc_name,
      "divAmount": this.amountval_type,
    }
    this.getsupplierdetails(this.data_input);
    this.dialogRef = this.dialog.open(templateRef, {
      width: '100%',
      height: '100%'
    });
    this.dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }
  closedialog(): void {
    this.dialogRef.close();
  }


  // supplieropenpopup_fn(data,suppliermytemplate) {
  //   this.tabcheck_supplier=true;
  //   this.tabcheck_ccbs=false;
  //   this.tabcheck_ecf=false;
  //   let data1={   
  //     "divAmount":this.amountval_type,
  //     "apexpense_id": data.expense_id,
  //     "apsubcat_id": data.subcat_id,
  //     "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
  //     "sectorname": this.pprSearchForm.value.sectorname,
  //     "yearterm": this.type,
  // }
  // this.getsupplieramountdetails(data1);
  //   this.dialogRef = this.dialog.open(suppliermytemplate, {
  //     width: '100%',
  //     height:'100%'
  //   });
  //   this.dialogRef.afterClosed().subscribe(result => {
  //     //console.log('The dialog was closed');
  //   });
  // }
  closedialog_supplier(): void {
    this.dialogRef.close();
  }


  popuptab_click(data) {
    this.tabvales = data;
    if (this.tabvales == 'supplier') {
      this.tabcheck_supplier = true;
      this.tabcheck_ccbs = false;
      this.tabcheck_ecf = false;
    }
    if (this.tabvales == 'ccbs') {
      this.tabcheck_supplier = false;
      this.tabcheck_ccbs = true;
      this.tabcheck_ecf = false
    }
    if (this.tabvales == 'ccbs') {
      this.getccbsdetails(this.data_input)

    }

  }

  ecf_show(supplier_obj) {

    let input_ecf = {
      "apexpense_id": supplier_obj.apexpense_id,
      "apsubcat_id": supplier_obj.apsubcat_id,
      "apinvoicesupplier_id": supplier_obj.supplier_id,
      "apinvoicebranch_id": this.pprSearchForm.value.branch_id,
      "transactionmonth": this.tranmonth_cunt,
      "quarter": this.qtr_cnt,
      "masterbusinesssegment_name": this.pprSearchForm.value.masterbusinesssegment_name,
      "sectorname": this.pprSearchForm.value.sectorname,
      "yearterm": this.type,
      "divAmount": this.amountval_type,
      "finyear": this.pprSearchForm.value.finyear,
      "bs_name": this.pprSearchForm.value.bs_name,
      "cc_name": this.pprSearchForm.value.cc_name
    }
    this.tabcheck_ecf = true
    this.getecfdetails(input_ecf)
  }
  // suppliergetapi start

  private getsupplierdetails(data) {

    this.dataService.getsupplierdetails(data)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;


      })
  }
  supplierccbsList: any;
  private getccbsdetails(data, pageNumber = 1, pageSize = 10) {

    this.dataService.getccbsdetails(data, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierccbsList = datas;


      })
  }
  supplierecfList: any;
  private getecfdetails(data) {

    this.dataService.getecfdetails(data)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierecfList = datas;


      })
  }

  // private getsupplieramountdetails(ind, data, data1) {
  //   this.SpinnerService.show()

  //   this.dataService.getsupplieramountdetails(data)
  //     .subscribe((results: any[]) => {
  //   this.SpinnerService.hide()

  //       let datas = results["data"];
  //       if (datas.length == 0) {
  //         this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
  //       } else {

  //         for (var val of datas) {
  //           let a = data
  //           data1.splice(ind + 1, 0, val);

  //         }
  //         data1[ind].tree_flag = 'N'
  //         this.summarydata = data1
  //         this.supplierList = datas;
  //       }


  //     }, error => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }
  // suppliergetapi end

  clear_budgetdata() {
    this.ppr_report_search=false;
    this.chipSelectedprod = []
    this.chipSelectedprodid = []
    this.tabledata = false;
    // this.expInput.nativeElement.value = '';
    this.pprSearchForm.reset();
    this.pprSearchForm.controls['finyear'].reset('')
    this.pprSearchForm.controls['year_term'].reset('')
    this.pprSearchForm.controls['divAmount'].reset('')
    this.pprSearchForm.controls['branch_id'].reset('')
    this.pprSearchForm.controls['sectorname'].reset('')
    this.pprSearchForm.controls['businesscontrol'].reset('')
    this.pprSearchForm.controls['bs_id'].reset('')
    this.pprSearchForm.controls['cc_id'].reset('')
    this.pprSearchForm.controls['frommonth'].reset('')
    this.pprSearchForm.controls['tomonth'].reset('')  
    console.log("this.levelslist reset",this.levelslist)
    for (let levelslist of this.levelslist) {
      levelslist.expanded = false
    }
    this.data4aexp = true
    this.dataaexp = true
    this.dataaexpone = true
    this.levelsdatavalueoneexp = ''
    this.levels4adatas = ''
    this.levelstwodatas = ''
    this.levelsonedatas = ''
    this.levelsdatas = ''
    this.levels5adatas = ''

    this.chipSelectedprodid = []
    this.summarydata = []
    this.qsummarydata = []
    this.expenseList = []
    this.amount_type = ''
    this.frommonthsearch("")
        this.tomonthsearch("")


  }

  pprsubModuleData(data) {
    console.log("data=>", data)
    if (data.name == 'Budget Builder') {
      this.tabcheck_ppr = false;
      this.tabcheck_pprreport = false;
      this.tabcheck_pprbuilder = true;
      this.tabcheck_pprreviewer = false;
      this.variance_analysis = false
      this.cost_allocation = false;
      this.report_chart=false;
    }
    if (data.name == 'Budget Reviewer') {
      this.tabcheck_pprreviewer = true;
      this.tabcheck_pprreport = false;
      this.tabcheck_ppr = false
      this.tabcheck_pprbuilder = false
      this.variance_analysis = false
      this.cost_allocation = false;
       this.report_chart=false;
    }
    if (data.name == 'PPR Report') {
      this.tabcheck_pprreviewer = false;
      this.tabcheck_pprreport = false;
      this.tabcheck_ppr = false
      this.tabcheck_pprbuilder = false
      this.variance_analysis = false
      this.cost_allocation = false;
       this.report_chart=false;
    }
    // Variance Analysis
    if (data.name == 'Variance Analysis') {
      this.tabcheck_pprreviewer = false;
      this.tabcheck_pprreport = false;
      this.tabcheck_ppr = false
      this.tabcheck_pprbuilder = false
      this.variance_analysis = true
      this.cost_allocation = false;
       this.report_chart=false;
    }
    // cost_allocation
    if (data.name == 'Cost Allocation') {
      this.tabcheck_pprreviewer = false;
      this.tabcheck_pprreport = false;
      this.tabcheck_ppr = false
      this.tabcheck_pprbuilder = false
      this.variance_analysis = false
      this.cost_allocation = true;
       this.report_chart=false;
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
      console.log(this.chipSelectedprod);
      this.chipSelectedprodid.splice(index, 1);
      console.log(this.chipSelectedprodid);
      this.expInput.nativeElement.value = '';
    }
  }
  public prodSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectprodByName(event.option.value.name);
    this.expInput.nativeElement.value = '';
    console.log('chipSelectedprodid', this.chipSelectedprodid)
  }
  private selectprodByName(prod) {
    let foundprod1 = this.chipSelectedprod.filter(pro => pro.name == prod);
    if (foundprod1.length) {
      return;
    }
    let foundprod = this.expenseList.filter(pro => pro.name == prod);
    if (foundprod.length) {
      this.chipSelectedprod.push(foundprod[0]);
      // this.chipSelectedprodid.push(foundprod[0].id)
      this.chipSelectedprodid.push(foundprod[0].name)
    }
  }

  // levelslist = [
  //   { name: "Level 0-Income", levelind: 0, expanded: false },
  //   { name: "Level 1-HR Cost", levelind: 1, expanded: false },
  //   { name: "Level 2-Other Operating Cost", levelind: 2, expanded: false },
  //   { name: "Level 3", levelind: 3, expanded: false },
  //   { name: 'Net Result Before Allocation', levelind: 4, expanded: false },
  //   { name: "Level 4.A-Rentals", levelind: 5, expanded: false },
  //   // { name: "Level 4.A.2-Electricity", extends: false },
  //   // { name: "Level 4.A.3-Security", extends: false },
  //   { name: "Level 4(B)-Technology", levelind: 6, expanded: false },
  //   { name: "Net result after Infra OH allocation", levelind: 7, expanded: false },
  //   { name: "Level 5", levelind: 8, expanded: false },
  //   { name: "Net result before corporate OH allocation", levelind: 9, expanded: false },
  //   { name: "Level 6", levelind: 10, expanded: false },
  //   { name: "EBT - Earnings Before Tax", levelind: 11, expanded: false },

  // ]
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.levelslist, event.previousIndex, event.currentIndex);
  }
  list: any[] = []
  expand: boolean
  levelone
  frommonthsearch(month) {
    this.frommonthid = month.id
    this.month = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'YTD']
    let startmonth = this.month.findIndex((start) => start == month.month)
    console.log("month=>", startmonth)
    this.month = this.month.filter((m, ind) => {
      if (startmonth <= ind) {
        return m;
      } else {
        return
      }
    })
    let startyear = this.month.findIndex(startind => startind == "Dec")
    this.startyear_ind = startyear + 1
    this.colspanlength = this.month.length
    this.start_month_arr = this.month
    console.log('month=>', this.month)
    // this.pprSearchForm.controls['tomonth'].reset('')
    this.headerdata = this.month
    console.log("colspanlength=>", this.colspanlength)
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
  }
  tomonthsearch(month) {
    if (this.start_month_arr.length != 0) {
      this.month = this.start_month_arr
    }
    let startmonth = this.month.findIndex((start) => start == month.month)
    console.log("month=>", startmonth)
    this.month = this.month.filter((m, ind) => {
      if (startmonth >= ind || m == "YTD") {
        return m;
      } else {
        return
      }
    })
    this.colspanlength = this.month.length
    this.headerdata = this.month
    console.log("month changes=>", this.month)
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
  
  }
  expant_level(i, level) {

    this.expand = level.expanded
    // level.expanded=true
    console.log("expand=>", this.expand)
    this.level_code =level.code
    // if ((this.pprSearchForm.value.finyear === undefined) || (this.pprSearchForm.value.finyear === '')) {

    //   this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
    //   return false;
    // } else {
      // this.pprSearchForm.value.finyear.finyer='FY22-23';
    // }
    // if (this.pprSearchForm.value.year_term === '') {
    //   this.toastr.warning('', 'Please Select Quarterly or Monthly', { timeOut: 1500 });
    //   return false;
    // }
    // if (this.pprSearchForm.value.divAmount === '') {
    //   this.toastr.warning('', 'Please Select Amount', { timeOut: 1500 });
    //   return false;
    // }
    // if ((this.pprSearchForm.value.sectorname == undefined) || (this.pprSearchForm.value.sectorname == '')) {


    //   this.toastr.warning('', 'Please Select Sector', { timeOut: 1500 });
    //   return false;

    // }
    // if ((this.pprSearchForm.value.businesscontrol == undefined) || (this.pprSearchForm.value.businesscontrol == '')) {
    //   this.toastr.warning('', 'Please Select Business', { timeOut: 1500 });
    //   return false;

    // }
    // if(this.pprSearchForm.value.frommonth?.id != undefined){
    //   if(this.pprSearchForm.value.tomonth?.id == undefined){
    //     this.toastr.warning('', 'Please Select To-Month', { timeOut: 1500 });
    //     return false
    //   }
    // }
    var levelzero
    // var levelone
    var leveltwo

    // if (level.code=='INC') {
      if (this.pprSearchForm.value.sectorname.name == 'ALL') {
        this.pprSearchForm.value.sector = ''
      } else {
        this.pprSearchForm.value.sector = this.pprSearchForm.value.sectorname.name
      }
      if (this.businessview == false) {
        levelzero = {
          // "entry_module": 'AP',
          // "finyear": this.pprSearchForm.value.finyear.finyer,
          // "year_term": this.pprSearchForm.value.year_term,
          // "sector_id": this.pprSearchForm.value.sectorname.id,
          // "sectorname": this.pprSearchForm.value.sector,
          // "divAmount": this.pprSearchForm.value.divAmount,
          // "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
          // "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          // 'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          // "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          // "bs_id": this.pprSearchForm.value.bs_id.id,
          // "cc_id": this.pprSearchForm.value.cc_id.id,
          // "branch_id": this.pprSearchForm.value.branch_id.id,
          // "expensegrp_name_arr": this.chipSelectedprodid,
          // 'business_flag': Number(this.pprSearchForm.value.year_term),
          // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
          "finyear": this.pprSearchForm.value.finyear.finyer,
          "sector_id": this.pprSearchForm.value.sectorname.id,
         "divAmount": this.pprSearchForm.value.divAmount,
         "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                   "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
         "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          "branch_id": this.pprSearchForm.value.branch_id?.id??"",
         'business_flag': Number(this.pprSearchForm.value.year_term),
                   "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
                   "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
        }
      } else {
        levelzero = {
          // "entry_module": 'AP',
          // "finyear": this.pprSearchForm.value.finyear.finyer,
          // "year_term": this.pprSearchForm.value.year_term,
          // "sector_id": this.pprSearchForm.value.sectorname.id,
          // "sectorname": this.pprSearchForm.value.sector,
          // "divAmount": this.pprSearchForm.value.divAmount,
          // "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
          // "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          // 'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          // "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          // "bs_id": this.pprSearchForm.value.bs_id.id,
          // "cc_id": this.pprSearchForm.value.cc_id.id,
          // "branch_id": this.pprSearchForm.value.branch_id.id,
          // "expensegrp_name_arr": this.chipSelectedprodid,
          // "from_expense_month":this.pprSearchForm.value.frommonth.month_id,
          // "to_expense_month":this.pprSearchForm.value.tomonth.month_id,
          // 'business_flag':this.pprSearchForm.value.year_term,
          "finyear": this.pprSearchForm.value.finyear.finyer,
          "sector_id": this.pprSearchForm.value.sectorname.id,
         "divAmount": this.pprSearchForm.value.divAmount,
         "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
         "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
         "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
         "branch_id": this.pprSearchForm.value.branch_id?.id??"",
         "year_term": this.pprSearchForm.value.year_term,
         "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
        }
      }
      console.log(levelzero)
      if(level.code=='L9' || level.code=='L10' || level.code=='L11' || level.code=='L12' || level.code=='L13'){
        this.levels_net_before_after=true;
        if (level.code=='L9') {
     
          console.log("two")
          if (this.pprSearchForm.value.sectorname.name == 'ALL') {
            this.pprSearchForm.value.sector = ''
          } else {
            this.pprSearchForm.value.sector = this.pprSearchForm.value.sectorname.name
          }
          if (this.businessview) {
            leveltwo = {
            //   level_id: level.id,
            //   finyear: this.pprSearchForm.value.finyear.finyer,
            //   year_term: this.pprSearchForm.value.year_term,
            //   divAmount: this.pprSearchForm.value.divAmount,
            //   branch_id: this.pprSearchForm.value.branch_id.id,
            //   sectorname: this.pprSearchForm.value.sector,
            //   sector_id: this.pprSearchForm.value.sectorname.id,
            // business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            //   microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            //   microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            //   masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
            //   bs_id: this.pprSearchForm.value.bs_id.id,
            //   bs_name: this.pprSearchForm.value.bs_id.name,
            //   cc_id: this.pprSearchForm.value.cc_id.id,
            //   cc_name: this.pprSearchForm.value.cc_id.name,
            //   expensegrp_name_arr: this.chipSelectedprodid,
            //   "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            //   "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

              
                "finyear":this.pprSearchForm.value.finyear.finyer,
                "year_term": this.pprSearchForm.value.year_term,
                "divAmount":  this.pprSearchForm.value.divAmount,
                "sector_id": this.pprSearchForm.value.sectorname.id,
                "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
                "branch_id":this.pprSearchForm.value.branch_id?.id??"",
                "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
                "from_expense_month": this.pprSearchForm.value.frommonth?.month_id??"",
                "to_expense_month": this.pprSearchForm.value.tomonth?.month_id??"",         
           
            
            }
          } else {
            leveltwo = {
              // level_id:level.id,
    
              // finyear: this.pprSearchForm.value.finyear.finyer,
              // business_flag: Number(this.pprSearchForm.value.year_term),
              // divAmount: this.pprSearchForm.value.divAmount,
              // branch_id: this.pprSearchForm.value.branch_id.id,
              // sectorname: this.pprSearchForm.value.sector,
              // sector_id: this.pprSearchForm.value.sectorname.id,
              // business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
              // microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
              // microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
              // masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
              // bs_id: this.pprSearchForm.value.bs_id.id,
              // bs_name: this.pprSearchForm.value.bs_id.name,
              // cc_id: this.pprSearchForm.value.cc_id.id,
              // cc_name: this.pprSearchForm.value.cc_id.name,
              // expensegrp_name_arr: this.chipSelectedprodid,
              // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
              // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

              "finyear":this.pprSearchForm.value.finyear.finyer,
                "year_term": this.pprSearchForm.value.year_term,
                "divAmount":  this.pprSearchForm.value.divAmount,
                "sector_id": this.pprSearchForm.value.sectorname.id,
                "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
                "branch_id":this.pprSearchForm.value.branch_id?.id??"",
                "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
                "from_expense_month": this.pprSearchForm.value.frommonth?.month_id??"",
                "to_expense_month": this.pprSearchForm.value.tomonth?.month_id??"",  
                "business_flag": Number(this.pprSearchForm.value.year_term),
            }
          }
          if (level.expanded == false) {
    
            console.log("leveltwo=>", leveltwo)
            this.SpinnerService.show()
    
            this.dataService.gettotal_level(level.id, leveltwo)
              .subscribe((results: any[]) => {
                this.SpinnerService.hide()
    
                let levelstwodata = results['data']
    
                let buheader = []
                console.log(results)
                if (results['data'].length == 0) {
                  this.toastr.warning('', 'No Data Found', { timeOut: 1500 });
                  level.expand = false
                }
                if (!this.businessview && this.businessviewheader.length == 0) {
                  const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = levelstwodata[0];
                  buheader.push(eventData)
                  console.log("buheader=>", buheader)
                  let arr = buheader[0]
                  console.log(arr)
                  console.log(Object.keys(arr))
                  this.businessviewheader = Object.keys(arr)
                  console.log('2', this.businessviewheader)
                  console.log(this.businessview)
                  this.colspanlength = this.businessviewheader.length
                  this.headerdata = this.businessviewheader
                  console.log(this.headerdata)              
                }
                // for (let total_level of levelstwodata) {
                //   total_level['title'] = "Expense Group"
                // }
                this.total_level = levelstwodata
                console.log(this.total_level, levelstwodata)
                console.log("this.expand ",this.expand )
                
                
              }, error => {
                level.expanded = false
                this.errorHandler.handleError(error);
                this.SpinnerService.hide();
              })
          } else {
            this.total_level = []
          }
          console.log("this.total_level=>", this.total_level)
        }
        if (level.code == "L10") {
          if (this.pprSearchForm.value.sectorname.name == 'ALL') {
            this.pprSearchForm.value.sector = ''
          } else {
            this.pprSearchForm.value.sector = this.pprSearchForm.value.sectorname.name
          }
          this.data4aexp = true
          let level41value
          // if (!this.businessview) {
          //   level41value = {
          //     "finyear": this.pprSearchForm.value.finyear.finyer,
          //     "sectorname": this.pprSearchForm.value.sector,
          //     "branch_id": this.pprSearchForm.value.branch_id.id,
          //     "bizname": this.pprSearchForm.value.businesscontrol.name,
          //     "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //     "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          //     'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          //     "level_id": level.id,
          //     "bs_id": this.pprSearchForm.value.bs_id.id,
          //     "cc_id": this.pprSearchForm.value.cc_id.id,
          //     "business_flag": Number(this.pprSearchForm.value.year_term),
          //     "divAmount": this.pprSearchForm.value.divAmount,
          //     "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          //     "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
          //   }
          // } else {
          //   level41value = {
          //     "finyear": this.pprSearchForm.value.finyear.finyer,
          //     "sectorname": this.pprSearchForm.value.sector,
          //     "branch_id": this.pprSearchForm.value.branch_id.id,
          //     "bizname": this.pprSearchForm.value.businesscontrol.name,
          //     "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //     "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          //     'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          //     "level_id": level.id,
          //     "bs_id": this.pprSearchForm.value.bs_id.id,
          //     "cc_id": this.pprSearchForm.value.cc_id.id,
          //     "year_term": this.pprSearchForm.value.year_term,
          //     "divAmount": this.pprSearchForm.value.divAmount,
          //     "from_expense_month":this.pprSearchForm.value.frommonth.month_id,
          //     "to_expense_month":this.pprSearchForm.value.tomonth.month_id,
          //   }
          // }
          if (this.businessview) {
            level41value = {
            //   level_id: level.id,
            //   finyear: this.pprSearchForm.value.finyear.finyer,
            //   year_term: this.pprSearchForm.value.year_term,
            //   divAmount: this.pprSearchForm.value.divAmount,
            //   branch_id: this.pprSearchForm.value.branch_id.id,
            //   sectorname: this.pprSearchForm.value.sector,
            //   sector_id: this.pprSearchForm.value.sectorname.id,
            // business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            //   microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            //   microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            //   masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
            //   bs_id: this.pprSearchForm.value.bs_id.id,
            //   bs_name: this.pprSearchForm.value.bs_id.name,
            //   cc_id: this.pprSearchForm.value.cc_id.id,
            //   cc_name: this.pprSearchForm.value.cc_id.name,
            //   expensegrp_name_arr: this.chipSelectedprodid,
            //   "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            //   "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

              
                "finyear":this.pprSearchForm.value.finyear.finyer,
                "year_term": this.pprSearchForm.value.year_term,
                "divAmount":  this.pprSearchForm.value.divAmount,
                "sector_id": this.pprSearchForm.value.sectorname.id,
                "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
                "branch_id":this.pprSearchForm.value.branch_id?.id??"",
                "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
                "from_expense_month": this.pprSearchForm.value.frommonth?.month_id??"",
                "to_expense_month": this.pprSearchForm.value.tomonth?.month_id??"",         
           
            
            }
          } else {
            level41value = {
              // level_id:level.id,
    
              // finyear: this.pprSearchForm.value.finyear.finyer,
              // business_flag: Number(this.pprSearchForm.value.year_term),
              // divAmount: this.pprSearchForm.value.divAmount,
              // branch_id: this.pprSearchForm.value.branch_id.id,
              // sectorname: this.pprSearchForm.value.sector,
              // sector_id: this.pprSearchForm.value.sectorname.id,
              // business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
              // microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
              // microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
              // masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
              // bs_id: this.pprSearchForm.value.bs_id.id,
              // bs_name: this.pprSearchForm.value.bs_id.name,
              // cc_id: this.pprSearchForm.value.cc_id.id,
              // cc_name: this.pprSearchForm.value.cc_id.name,
              // expensegrp_name_arr: this.chipSelectedprodid,
              // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
              // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

              "finyear":this.pprSearchForm.value.finyear.finyer,
                "year_term": this.pprSearchForm.value.year_term,
                "divAmount":  this.pprSearchForm.value.divAmount,
                "sector_id": this.pprSearchForm.value.sectorname.id,
                "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
                "branch_id":this.pprSearchForm.value.branch_id?.id??"",
                "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
                "from_expense_month": this.pprSearchForm.value.frommonth?.month_id??"",
                "to_expense_month": this.pprSearchForm.value.tomonth?.month_id??"",  
                "business_flag": Number(this.pprSearchForm.value.year_term),
            }
          }
          if (level.expanded == false) {
            this.SpinnerService.show()
    
            this.dataService.getafterallocation(level41value)
              .subscribe((results: any[]) => {
                this.SpinnerService.hide()
    
    
                console.log(results)
                // this.level4ashow = false
                if (results['data'].length == 0) {
                  this.toastr.warning('', 'No Data Found', { timeOut: 1500 });
                  return false;
                }
                let data = results['data']
                let buheader = []
                console.log(results)
                if (!this.businessview && this.businessviewheader.length == 0) {
                  const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = data[0];
                  buheader.push(eventData)
                  console.log("buheader=>", buheader)
                  let arr = buheader[0]
                  console.log(arr)
                  console.log(Object.keys(arr))
                  this.businessviewheader = Object.keys(arr)
                  console.log('2', this.businessviewheader)
                  console.log(this.businessview)
                  this.colspanlength = this.businessviewheader.length
                  this.headerdata = this.businessviewheader
                  console.log(this.headerdata)
                }
                for (let levels4a2data of data) {
                  levels4a2data.Padding_left = '10px'
    
                }
                this.incometotal = data
                console.log(this.businessviewheader)
              }, error => {
                level.expanded = false
                this.errorHandler.handleError(error);
                this.SpinnerService.hide();
              })
          } else {
            this.incometotal = []
          }
        }
        if (level.code == "L11") {
          if (this.pprSearchForm.value.sectorname.name == 'ALL') {
            this.pprSearchForm.value.sector = ''
          } else {
            this.pprSearchForm.value.sector = this.pprSearchForm.value.sectorname.name
          }
          this.data4aexp = true
          let level41value
          // if (!this.businessview) {
          //   level41value = {
          //     "finyear": this.pprSearchForm.value.finyear.finyer,
          //     "sectorname": this.pprSearchForm.value.sector,
          //     "branch_id": this.pprSearchForm.value.branch_id.id,
          //     "bizname": this.pprSearchForm.value.businesscontrol.name,
          //     "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //     "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          //     'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          //     "level_id": level.id,
          //     "bs_id": this.pprSearchForm.value.bs_id.id,
          //     "cc_id": this.pprSearchForm.value.cc_id.id,
          //     "business_flag": Number(this.pprSearchForm.value.year_term),
          //     "divAmount": this.pprSearchForm.value.divAmount,
          //     "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          //     "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
          //   }
          // } else {
          //   level41value = {
          //     "finyear": this.pprSearchForm.value.finyear.finyer,
          //     "sectorname": this.pprSearchForm.value.sector,
          //     "branch_id": this.pprSearchForm.value.branch_id.id,
          //     "bizname": this.pprSearchForm.value.businesscontrol.name,
          //     "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //     "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          //     'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          //     "level_id": level.id,
          //     "bs_id": this.pprSearchForm.value.bs_id.id,
          //     "cc_id": this.pprSearchForm.value.cc_id.id,
          //     "year_term": this.pprSearchForm.value.year_term,
          //     "divAmount": this.pprSearchForm.value.divAmount,
          //     "from_expense_month":this.pprSearchForm.value.frommonth.month_id,
          //     "to_expense_month":this.pprSearchForm.value.tomonth.month_id,
          //   }
          // }
          if (this.businessview) {
            level41value = {
            //   level_id: level.id,
            //   finyear: this.pprSearchForm.value.finyear.finyer,
            //   year_term: this.pprSearchForm.value.year_term,
            //   divAmount: this.pprSearchForm.value.divAmount,
            //   branch_id: this.pprSearchForm.value.branch_id.id,
            //   sectorname: this.pprSearchForm.value.sector,
            //   sector_id: this.pprSearchForm.value.sectorname.id,
            // business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            //   microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            //   microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            //   masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
            //   bs_id: this.pprSearchForm.value.bs_id.id,
            //   bs_name: this.pprSearchForm.value.bs_id.name,
            //   cc_id: this.pprSearchForm.value.cc_id.id,
            //   cc_name: this.pprSearchForm.value.cc_id.name,
            //   expensegrp_name_arr: this.chipSelectedprodid,
            //   "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            //   "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

              
                "finyear":this.pprSearchForm.value.finyear.finyer,
                "year_term": this.pprSearchForm.value.year_term,
                "divAmount":  this.pprSearchForm.value.divAmount,
                "sector_id": this.pprSearchForm.value.sectorname.id,
                "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
                "branch_id":this.pprSearchForm.value.branch_id?.id??"",
                "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
                "from_expense_month": this.pprSearchForm.value.frommonth?.month_id??"",
                "to_expense_month": this.pprSearchForm.value.tomonth?.month_id??"",         
           
            
            }
          } else {
            level41value = {
              // level_id:level.id,
    
              // finyear: this.pprSearchForm.value.finyear.finyer,
              // business_flag: Number(this.pprSearchForm.value.year_term),
              // divAmount: this.pprSearchForm.value.divAmount,
              // branch_id: this.pprSearchForm.value.branch_id.id,
              // sectorname: this.pprSearchForm.value.sector,
              // sector_id: this.pprSearchForm.value.sectorname.id,
              // business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
              // microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
              // microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
              // masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
              // bs_id: this.pprSearchForm.value.bs_id.id,
              // bs_name: this.pprSearchForm.value.bs_id.name,
              // cc_id: this.pprSearchForm.value.cc_id.id,
              // cc_name: this.pprSearchForm.value.cc_id.name,
              // expensegrp_name_arr: this.chipSelectedprodid,
              // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
              // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

              "finyear":this.pprSearchForm.value.finyear.finyer,
                "year_term": this.pprSearchForm.value.year_term,
                "divAmount":  this.pprSearchForm.value.divAmount,
                "sector_id": this.pprSearchForm.value.sectorname.id,
                "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
                "branch_id":this.pprSearchForm.value.branch_id?.id??"",
                "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
                "from_expense_month": this.pprSearchForm.value.frommonth?.month_id??"",
                "to_expense_month": this.pprSearchForm.value.tomonth?.month_id??"",  
                "business_flag": Number(this.pprSearchForm.value.year_term),
            }
          }
          if (level.expanded == false) {
            this.SpinnerService.show()
    
            this.dataService.getafterallocation(level41value)
              .subscribe((results: any[]) => {
                this.SpinnerService.hide()
    
    
                console.log(results)
                // this.level4ashow = false
                if (results['data'].length == 0) {
                  this.toastr.warning('', 'No Data Found', { timeOut: 1500 });
                  return false;
                }
                let data = results['data']
                let buheader = []
                console.log(results)
                if (!this.businessview && this.businessviewheader.length == 0) {
                  const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = data[0];
                  buheader.push(eventData)
                  console.log("buheader=>", buheader)
                  let arr = buheader[0]
                  console.log(arr)
                  console.log(Object.keys(arr))
                  this.businessviewheader = Object.keys(arr)
                  console.log('2', this.businessviewheader)
                  console.log(this.businessview)
                  this.colspanlength = this.businessviewheader.length
                  this.headerdata = this.businessviewheader
                  console.log(this.headerdata)
                }
                for (let levels4a2data of data) {
                  levels4a2data.Padding_left = '10px'
    
                }
                this.income_total_level = data
                console.log(this.businessviewheader)
              }, error => {
                level.expanded = false
                this.errorHandler.handleError(error);
                this.SpinnerService.hide();
              })
          } else {
            this.income_total_level = []
          }
        }
        if (level.code == "L13") {
          if (this.pprSearchForm.value.sectorname.name == 'ALL') {
            this.pprSearchForm.value.sector = ''
          } else {
            this.pprSearchForm.value.sector = this.pprSearchForm.value.sectorname.name
          }
          this.data4aexp = true
          let level41value
          // if (!this.businessview) {
          //   level41value = {
          //     "finyear": this.pprSearchForm.value.finyear.finyer,
          //     "branch_id": this.pprSearchForm.value.branch_id.id,
          //     "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //     "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          //     'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          //     "level_id": level.id,
          //     "business_flag": Number(this.pprSearchForm.value.year_term),
          //     "divAmount": this.pprSearchForm.value.divAmount,
          //     "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          //     "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
          //   }
          // } else {
          //   level41value = {
          //     "finyear": this.pprSearchForm.value.finyear.finyer,
          //     "sectorname": this.pprSearchForm.value.sector,
          //     "branch_id": this.pprSearchForm.value.branch_id?.id??"",
          //     "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //     "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          //     'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          //     "level_id": level.id,
          //     "year_term": this.pprSearchForm.value.year_term,
          //     "divAmount": this.pprSearchForm.value.divAmount,
          //     "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          //     "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
          //   }
          // }
          if (this.businessview) {
            level41value = {
            //   level_id: level.id,
            //   finyear: this.pprSearchForm.value.finyear.finyer,
            //   year_term: this.pprSearchForm.value.year_term,
            //   divAmount: this.pprSearchForm.value.divAmount,
            //   branch_id: this.pprSearchForm.value.branch_id.id,
            //   sectorname: this.pprSearchForm.value.sector,
            //   sector_id: this.pprSearchForm.value.sectorname.id,
            // business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            //   microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            //   microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            //   masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
            //   bs_id: this.pprSearchForm.value.bs_id.id,
            //   bs_name: this.pprSearchForm.value.bs_id.name,
            //   cc_id: this.pprSearchForm.value.cc_id.id,
            //   cc_name: this.pprSearchForm.value.cc_id.name,
            //   expensegrp_name_arr: this.chipSelectedprodid,
            //   "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            //   "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

              
                "finyear":this.pprSearchForm.value.finyear.finyer,
                "year_term": this.pprSearchForm.value.year_term,
                "divAmount":  this.pprSearchForm.value.divAmount,
                "sector_id": this.pprSearchForm.value.sectorname.id,
                "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
                "branch_id":this.pprSearchForm.value.branch_id?.id??"",
                "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
                "from_expense_month": this.pprSearchForm.value.frommonth?.month_id??"",
                "to_expense_month": this.pprSearchForm.value.tomonth?.month_id??"",         
           
            
            }
          } else {
            level41value = {
              // level_id:level.id,
    
              // finyear: this.pprSearchForm.value.finyear.finyer,
              // business_flag: Number(this.pprSearchForm.value.year_term),
              // divAmount: this.pprSearchForm.value.divAmount,
              // branch_id: this.pprSearchForm.value.branch_id.id,
              // sectorname: this.pprSearchForm.value.sector,
              // sector_id: this.pprSearchForm.value.sectorname.id,
              // business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
              // microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
              // microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
              // masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
              // bs_id: this.pprSearchForm.value.bs_id.id,
              // bs_name: this.pprSearchForm.value.bs_id.name,
              // cc_id: this.pprSearchForm.value.cc_id.id,
              // cc_name: this.pprSearchForm.value.cc_id.name,
              // expensegrp_name_arr: this.chipSelectedprodid,
              // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
              // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

              "finyear":this.pprSearchForm.value.finyear.finyer,
                "year_term": this.pprSearchForm.value.year_term,
                "divAmount":  this.pprSearchForm.value.divAmount,
                "sector_id": this.pprSearchForm.value.sectorname.id,
                "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
                "branch_id":this.pprSearchForm.value.branch_id?.id??"",
                "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
                "from_expense_month": this.pprSearchForm.value.frommonth?.month_id??"",
                "to_expense_month": this.pprSearchForm.value.tomonth?.month_id??"",  
                "business_flag": Number(this.pprSearchForm.value.year_term),
            }
          }
          if (level.expanded == false) {
            this.SpinnerService.show()
    
            this.dataService.getbeforeallocation(level41value,)
              .subscribe((results: any[]) => {
                this.SpinnerService.hide()
    
                this.beforeallocation = results['data']
                let buheader = []
    
                console.log(results)
    
                if (results['data'].length == 0) {
                  this.toastr.warning('', 'No Data Found', { timeOut: 1500 });
                  return false;
                }
                if (!this.businessview && this.businessviewheader.length == 0) {
                  const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = this.beforeallocation[0];
                  buheader.push(eventData)
                  console.log("buheader=>", buheader)
                  let arr = buheader[0]
                  console.log(arr)
                  console.log(Object.keys(arr))
                  this.businessviewheader = Object.keys(arr)
                  console.log('2', this.businessviewheader)
                  console.log(this.businessview)
                  this.colspanlength = this.businessviewheader.length
                  this.headerdata = this.businessviewheader
                  console.log(this.headerdata)
                }
                for (let levels4a3datas of this.beforeallocation) {
    
                  levels4a3datas.Padding_left = '10px'
    
    
                }
    
                console.log(this.businessviewheader)
              }, error => {
                level.expanded = false
                this.errorHandler.handleError(error);
                this.SpinnerService.hide();
              })
          }
          else {
            this.beforeallocation = []
          }
        }
    
        if (level.code == "L12") {
          if (this.pprSearchForm.value.sectorname.name == 'ALL') {
            this.pprSearchForm.value.sector_id = ''
            this.pprSearchForm.value.sector_name = ''
          } else {
            this.pprSearchForm.value.sector_id = this.pprSearchForm.value.sectorname.id
            this.pprSearchForm.value.sector_name = this.pprSearchForm.value.sectorname.name
    
          }
          // "business_flag": Number(this.pprSearchForm.value.year_term),
          let totalval
          // if (!this.businessview) {
          //   totalval = {
          //     "finyear": this.pprSearchForm.value.finyear?.finyer??"",
          //     "business_flag": Number(this.pprSearchForm.value.year_term),
          //     "sector_id": this.pprSearchForm.value.sector_id,
          //     "divAmount": this.pprSearchForm.value.divAmount,
          //     "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //     "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          //     'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",              
          //     "branch_id": this.pprSearchForm.value.branch_id?.id??"",
          //     "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          //     "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
              
          //   }
          // } else {
          //   totalval = {
          //     // "finyear": this.pprSearchForm.value.finyear.finyer,
          //     // "year_term": this.pprSearchForm.value.year_term,
          //     // "sector_id": this.pprSearchForm.value.sector_id,
          //     // "divAmount": this.pprSearchForm.value.divAmount,
          //     // "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //     // "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          //     // 'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          //     // "branch_id": this.pprSearchForm.value.branch_id?.id??"",
          //     // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          //     // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
          //     "finyear": this.pprSearchForm.value.finyear?.finyer??"",
          //     "year_term": this.pprSearchForm.value.year_term,
          //                   "sector_id": this.pprSearchForm.value.sector_id,
          //     "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //                   "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          //                   "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          //      "branch_id": this.pprSearchForm.value.branch_id?.id??"",
          //      "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          //                   "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
          //     "divAmount": this.pprSearchForm.value.divAmount,
          //   }
          // }
          if (this.businessview) {
            totalval = {
            //   level_id: level.id,
            //   finyear: this.pprSearchForm.value.finyear.finyer,
            //   year_term: this.pprSearchForm.value.year_term,
            //   divAmount: this.pprSearchForm.value.divAmount,
            //   branch_id: this.pprSearchForm.value.branch_id.id,
            //   sectorname: this.pprSearchForm.value.sector,
            //   sector_id: this.pprSearchForm.value.sectorname.id,
            // business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            //   microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            //   microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            //   masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
            //   bs_id: this.pprSearchForm.value.bs_id.id,
            //   bs_name: this.pprSearchForm.value.bs_id.name,
            //   cc_id: this.pprSearchForm.value.cc_id.id,
            //   cc_name: this.pprSearchForm.value.cc_id.name,
            //   expensegrp_name_arr: this.chipSelectedprodid,
            //   "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            //   "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

              
                "finyear":this.pprSearchForm.value.finyear.finyer,
                "year_term": this.pprSearchForm.value.year_term,
                "divAmount":  this.pprSearchForm.value.divAmount,
                "sector_id": this.pprSearchForm.value.sectorname.id,
                "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
                "branch_id":this.pprSearchForm.value.branch_id?.id??"",
                "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
                "from_expense_month": this.pprSearchForm.value.frommonth?.month_id??"",
                "to_expense_month": this.pprSearchForm.value.tomonth?.month_id??"",         
           
            
            }
          } else {
            totalval = {
              // level_id:level.id,
    
              // finyear: this.pprSearchForm.value.finyear.finyer,
              // business_flag: Number(this.pprSearchForm.value.year_term),
              // divAmount: this.pprSearchForm.value.divAmount,
              // branch_id: this.pprSearchForm.value.branch_id.id,
              // sectorname: this.pprSearchForm.value.sector,
              // sector_id: this.pprSearchForm.value.sectorname.id,
              // business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
              // microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
              // microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
              // masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
              // bs_id: this.pprSearchForm.value.bs_id.id,
              // bs_name: this.pprSearchForm.value.bs_id.name,
              // cc_id: this.pprSearchForm.value.cc_id.id,
              // cc_name: this.pprSearchForm.value.cc_id.name,
              // expensegrp_name_arr: this.chipSelectedprodid,
              // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
              // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

              "finyear":this.pprSearchForm.value.finyear.finyer,
                "year_term": this.pprSearchForm.value.year_term,
                "divAmount":  this.pprSearchForm.value.divAmount,
                "sector_id": this.pprSearchForm.value.sectorname.id,
                "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
                "branch_id":this.pprSearchForm.value.branch_id?.id??"",
                "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
                "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
                "from_expense_month": this.pprSearchForm.value.frommonth?.month_id??"",
                "to_expense_month": this.pprSearchForm.value.tomonth?.month_id??"",  
                "business_flag": Number(this.pprSearchForm.value.year_term),
            }
          }
          if (level.expanded == false) {
    
            console.log("leveltwo=>", totalval)
            this.SpinnerService.show()
    
            this.dataService.getbeforetax(totalval)
              .subscribe((results: any[]) => {
                this.SpinnerService.hide()
    
                this.beforetax = results['data']
                console.log(results)
                if (results['data'].length == 0) {
                  this.toastr.warning('', 'No Data Found', { timeOut: 1500 });
                  level.expanded = false
                }
                let buheader = []
                console.log(results)
                if (!this.businessview && this.businessviewheader.length == 0) {
                  const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = this.levels5adatas[0];
                  buheader.push(eventData)
                  console.log("buheader=>", buheader)
                  let arr = buheader[0]
                  console.log(arr)
                  console.log(Object.keys(arr))
                  this.businessviewheader = Object.keys(arr)
                  console.log('2', this.businessviewheader)
                  console.log(this.businessview)
                  this.colspanlength = this.businessviewheader.length
                  this.headerdata = this.businessviewheader
                  console.log(this.headerdata)
                }
                console.log(this.businessviewheader)
              }, error => {
                level.expanded = false
                this.errorHandler.handleError(error);
                this.SpinnerService.hide();
              })
          } else {
            this.beforetax = []
          }
          console.log("this.levelstwodatas=>", this.incometotal)
        }
      }else{
      
      if (this.level_label_expand[level.name].expanded == false) {
        this.SpinnerService.show()
        let buheader = []     
          this.dataService.getdata_level(level.level,levelzero,"").subscribe((results: any[]) => {
          this.SpinnerService.hide()
        
          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });
            level.expand = false
          }
          this.dataaexp = true;    
          let levelsdata = results['data']      
          // for(let datas of levelsdata){
            this.level_label_expand[level.name].lavel_data=levelsdata
          this.level_label_expand[level.name] = {lavel_data:levelsdata, ...this.level_label_expand[level.name], expanded : true}
          // }
          for(let dataloop of this.level_label_expand[level.name]?.lavel_data){
            dataloop['expanded'] =true
            // dataloop['title'] = "Expense Group"
          }
          console.log("le'levelsdata",levelsdata)
          this.levels_data_dynamic=this.level_label_expand[level.name]
          console.log("this.levels_data_dynamic",this.levels_data_dynamic)
       console.log( "// this.level_label_expand_data=[level.code={levelsdata}]",this.level_label_expand[level.name]?.lavel_data)
          console.log("this.level_label_expand[level.name]",levelsdata)
          console.log("level_label_expand_data",this.level_label_expand_data)
          if (this.businessview == false) {
            if (this.businessviewheader.length == 0) {
              const { name, Padding_left, Padding,expanded, tree_flag, expensegrp_id, amount_flag, ...eventData } = levelsdata[0];
              buheader.push(eventData)
              console.log("buheader=>", buheader)
              let arr = buheader[0]
              console.log(arr)
              console.log(Object.keys(arr))
              this.businessviewheader = Object.keys(arr)
              console.log('2', this.businessviewheader)
              console.log(this.businessview)
              this.colspanlength = this.businessviewheader.length
              this.headerdata = this.businessviewheader
              console.log(this.headerdata)
            }
          //   for (let data of levelsdata) {
          //     data['flak'] = 'income'
          //   }
          //   console.log("results=>", levelsdata)
          //   console.log(this.businessviewheader)

          //   for (let level of levelsdata) {
          //     level['title'] = "Expense Group"
          //   }
          //   this.levelsdatas = levelsdata
          //   console.log('levelsdatas=>', this.levelsdatas)
          // } else {
          //   for (let data of levelsdata) {
          //     data['flak'] = 'income'
          //   }
          //   console.log("results=>", levelsdata)
          //   console.log(this.businessviewheader)

          //   for (let level of levelsdata) {
          //     level['title'] = "Expense Group"
          //   }
          //   this.levelsdatas = levelsdata
          //   console.log('levelsdatas=>', this.levelsdatas)
          }
        }, error => {
          level.expanded = false
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
      }else{       
        this.level_label_expand[level.name] = {...this.levelsdatas, ...this.level_label_expand[level.name], expanded : false}
        this.levels_data_dynamic=this.level_label_expand[level.name]
        console.log("this.levels_data_dynamic",this.levels_data_dynamic)
        for(let levels of this.level_label_expand[level.name].lavel_data){

          if( levels.Padding_left=="50px" || levels.Padding_left=="75px" || levels.Padding_left=="100px" || levels.Padding_left=="10px" && levels.expanded===true){
          levels.expanded=false;
          }        
      }
      this.level_label_expand[level.name].lavel_data=[]
        
      }
      }
      console.log("data zero")
   
   
    if (this.type == 'Monthly') {
      console.log("type=>", this.type)
      this.headercheckone = false;
      this.headercheck = true
      this.businessview = true

      console.log(this.colspanlength)
    } else if (this.type == 'Quarterly') {
      console.log("type=>", this.type)
      this.headercheckone = true;
      this.headercheck = false
      this.businessview = true

    }
    else {
      console.log("type else=>", this.type)
      this.businessview = false
      this.headercheckone = true;
      this.headercheck = true
    }
  
  }





  levelzero: any
  expance: boolean = true


  levelsonedatas: any


  levelstwodatas: any


  levelsthreedatas: any


  levels4adatas: any

  data4aexp = true
  title: any

  treelevelclick(i, ind, level, data1) {
    let a = []
    let a2 = ind + 1
    if (level.tree_flag == 'N') {
      if (level.Padding_left == '10px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          // dataloop['expanded'] =true;
          console.log(" dataloop['expanded'] =true10",data1[i].expanded)
          if(data1[i].Padding_left == '50px'||data1[i].Padding_left == '75px'||data1[i].Padding_left == '100px'){
          data1[i].expanded=false;
          }
          a.push(i)
          if (a1.Padding_left == '10px') { break; }
          console.log("Block statement execution no." + i);
        }
      }
      if (level.Padding_left == '50px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          console.log(" dataloop['expanded'] =true50",data1[i].expanded)
          if(data1[i].Padding_left == '75px'||data1[i].Padding_left == '100px'){
          data1[i].expanded=false;
          }
          a.push(i)
          if ((a1.Padding_left == '50px') || (a1.Padding_left == '10px')) { break; }
          console.log("Block statement execution no." + i);
        }
      }
      if (level.Padding_left == '75px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          console.log(" dataloop['expanded'] =true75",data1[i].expanded)
          if(data1[i].Padding_left == '100px'){
          data1[i].expanded=false;
          }
          a.push(i)
          if ((a1.Padding_left == '75px') || (a1.Padding_left == '50px')) { break; }
          console.log("Block statement execution no." + i);
        }
      }
      if (level.Padding_left == '100px') {
        for (let i = a2; i < data1.length; i++) {
          let a1 = data1[i]
          console.log(" dataloop['expanded'] =true100",data1[i].expanded)
          data1[i].expanded=false;
          a.push(i)
          if ((a1.Padding_left == '100px') || (a1.Padding_left == '75px')) { break; }
          console.log("Block statement execution no." + i);
        }
      }
      a.pop()
      const indexSet = new Set(a);

      const arrayWithValuesRemoved = data1.filter((value, i) => !indexSet.has(i));
      arrayWithValuesRemoved[ind].tree_flag = 'Y'
      if (i == level.name) {
        this.levelsdatas = arrayWithValuesRemoved;    
        console.log("this.level.code",this.levelsdatas)  
        this.level_label_expand[level.name] = {lavel_data:this.levelsdatas, ...this.level_label_expand[level.name], expanded : true}
     this.levels_data_dynamic=this.level_label_expand[level.name]
     console.log("this.levels_data_dynamic padding",this.levels_data_dynamic)
      } 
      console.log("this.label/-data",this.level_label_expand[level.name].lavel_data)
 
      console.log(arrayWithValuesRemoved);
    } else {

      if (level.Padding_left == '10px') {
        if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
          this.masterbusinesssegment_name_params = ""
        } else {
          this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
        }

        if (this.pprSearchForm.value.sectorname.name == 'ALL') {
          this.pprSearchForm.value.sector = ''
        } else {
          this.pprSearchForm.value.sector = this.pprSearchForm.value.sectorname.name
        }
        let input_params
        if (this.businessview) {
          input_params = {

          //   "branch_id": this.pprSearchForm.value.branch_id?.id??"",
          //   "finyear": this.pprSearchForm.value.finyear.finyer,
          //   "year_term": this.pprSearchForm.value.year_term,
          //   "divAmount": this.pprSearchForm.value.divAmount,
          //   "sector_id":this.pprSearchForm.value.sectorname.id,            
          //   "sectorname": this.pprSearchForm.value.sector,
          //   "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //   "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          // 'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          //   "expensegrp_name_arr": level.name,
          //   "expensegrp_id": level.expensegrp_id,
          //   "amount_flag": level.amount_flag,
          //   "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          //   "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
          "finyear": this.pprSearchForm.value.finyear.finyer,
"amount_flag": level.amount_flag,
"sector_id":this.pprSearchForm.value.sectorname.id, 
"divAmount": this.pprSearchForm.value.divAmount,
"business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
"branch_id": this.pprSearchForm.value.branch_id?.id??"",
"expensegrp_id": level.expensegrp_id,
"from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
"to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
"year_term": this.pprSearchForm.value.year_term,
          }
        } else {
          input_params = {

            // "branch_id": this.pprSearchForm.value.branch_id?.id??"",
            // "finyear": this.pprSearchForm.value.finyear?.finyer??"",
            // "business_flag": Number(this.pprSearchForm.value.year_term),
            // "divAmount": this.pprSearchForm.value.divAmount,
            // "sectorname": this.pprSearchForm.value.sector,
            // "sector_id":this.pprSearchForm.value.sectorname?.id??"",   
            // "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            // "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            // 'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            // "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
            // "bs_name": this.pprSearchForm.value.bs_id.name,
            // "cc_name": this.pprSearchForm.value.cc_id.name,
            // "expensegrp_name_arr": level.name,
            // "expensegrp_id": level.expensegrp_id,
            // "amount_flag": level.amount_flag,
            // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",

            "finyear": this.pprSearchForm.value.finyear.finyer,
"amount_flag": level.amount_flag,
"sector_id":this.pprSearchForm.value.sectorname.id, 
"divAmount": this.pprSearchForm.value.divAmount,
"business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
"branch_id": this.pprSearchForm.value.branch_id?.id??"",
"expensegrp_id": level.expensegrp_id,
"from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
"to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
"business_flag": Number(this.pprSearchForm.value.year_term),

          }
        }
        this.newexpense_list(i, ind, input_params, data1, 1)

      }
      if ((level.Padding_left == '100px') && (this.supplier_chkval == 'Y')) {
        if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
          this.masterbusinesssegment_name_params = ""
        } else {
          this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
        }
        if (this.pprSearchForm.value.sectorname.name == 'ALL') {
          this.pprSearchForm.value.sector = ''
        } else {
          this.pprSearchForm.value.sector = this.pprSearchForm.value.sectorname.name
        }
        let input_params = {
          "apinvoicebranch_id": this.pprSearchForm.value.branch_id.id,
          "amount_flag": level.amount_flag,
          "divAmount": this.pprSearchForm.value.divAmount,
          "apexpense_id": level.expense_id,
          "apsubcat_id": level.subcat_id,
          "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
          "sectorname": this.pprSearchForm.value.sector,
          "sector_id":this.pprSearchForm.value.sectorname.id,   
          "yearterm": this.pprSearchForm.value.year_term,
          "finyear": this.pprSearchForm.value.finyear.finyer,
          "bs_name": this.pprSearchForm.value.bs_id.name,
          "cc_name": this.pprSearchForm.value.cc_id.name,
          "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
        }
        this.supplieramountdetails(i, ind, input_params, data1);

      }
      let input_params
      if (level.Padding_left == '50px') {
        if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
          this.masterbusinesssegment_name_params = ""
        } else {
          this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
        }
        if (this.pprSearchForm.value.sectorname.name == 'ALL') {
          this.pprSearchForm.value.sector = ''
        } else {
          this.pprSearchForm.value.sector = this.pprSearchForm.value.sectorname.name
        }
        
        if (this.businessview) {
          input_params = {
            // "branch_id": this.pprSearchForm.value.branch_id.id,
            // "finyear": this.pprSearchForm.value.finyear.finyer,
            // "year_term": this.pprSearchForm.value.year_term,
            // "divAmount": this.pprSearchForm.value.divAmount,
            // "sectorname": this.pprSearchForm.value.sector,
            // "sector_id":this.pprSearchForm.value.sectorname.id,   
            // "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            // "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            // 'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            // "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
            // "bs_name": this.pprSearchForm.value.bs_id.name,
            // "cc_name": this.pprSearchForm.value.cc_id.name,
            // "expense_id": level.expense_id,
            // "amount_flag": level.amount_flag,
            // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
            "expense_id": level.expense_id,
            "amount_flag": level.amount_flag,
            "finyear": this.pprSearchForm.value.finyear.finyer,
            "sector_id":this.pprSearchForm.value.sectorname.id,  
            "divAmount": this.pprSearchForm.value.divAmount,
             "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
             "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            "branch_id": this.pprSearchForm.value.branch_id?.id??"",
            "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
             "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
            "year_term": this.pprSearchForm.value.year_term,
            
          }
        } else {
          input_params = {
          //   "branch_id": this.pprSearchForm.value.branch_id.id,
          //   "finyear": this.pprSearchForm.value.finyear.finyer,
          //   "business_flag": Number(this.pprSearchForm.value.year_term),
          //   "divAmount": this.pprSearchForm.value.divAmount,
          //   "sectorname": this.pprSearchForm.value.sector,
          //   "sector_id":this.pprSearchForm.value.sectorname.id,   
          //   "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          //   "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          // 'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          //   "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
          //   "bs_name": this.pprSearchForm.value.bs_id.name,
          //   "cc_name": this.pprSearchForm.value.cc_id.name,
          //   "expense_id": level.expense_id,
          //   "amount_flag": level.amount_flag,
          //   "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          //   "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
          "expense_id": level.expense_id,
          "amount_flag": level.amount_flag,
          "finyear": this.pprSearchForm.value.finyear.finyer,
          "sector_id":this.pprSearchForm.value.sectorname.id,  
          "divAmount": this.pprSearchForm.value.divAmount,
           "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
           "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          "branch_id": this.pprSearchForm.value.branch_id?.id??"",
          "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
           "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
          "business_flag": Number(this.pprSearchForm.value.year_term),
          
          }
        }
        this.new_cat_list(i, ind, input_params, data1)
      }
      if (level.Padding_left == '75px') {
        // if(this.has_next_cat==true){
        //   this.new_cat_list(i, ind, input_params, data1)
        // }else{
        this.newsubcat_list(i, ind, level, data1)       
        // }
      }
    }
  }
  page_nextexpance(i, k, level, levelsdatas) {    
    // if(level.Padding_left == '75px'){
     
    // }else{
    if (level.next === true) {
      this.currentpage = this.presentpage + 1
      this.newsubcat_list(i, k, level, levelsdatas, level.page + 1)
    }
  // }

  }

  page_nextexpancecat(i, k, level, levelsdatas){
    if (level.next === true) {
      this.currentpage = this.presentpage + 1
      this.new_cat_list(i, k, level, levelsdatas, level.page + 1)
    }
  }

  private new_cat_list(i, ind, data, data1,pageNumber = 1) {
    let input_params
    if (this.businessview) {
      input_params = {
        // "branch_id": this.pprSearchForm.value.branch_id.id,
        // "finyear": this.pprSearchForm.value.finyear.finyer,
        // "year_term": this.pprSearchForm.value.year_term,
        // "divAmount": this.pprSearchForm.value.divAmount,
        // "sectorname": this.pprSearchForm.value.sector,
        // "sector_id":this.pprSearchForm.value.sectorname.id,   
        // "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
        // "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
        // 'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
        // "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
        // "bs_name": this.pprSearchForm.value.bs_id.name,
        // "cc_name": this.pprSearchForm.value.cc_id.name,
        // "expense_id": level.expense_id,
        // "amount_flag": level.amount_flag,
        // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
        // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
        "expense_id": data.expense_id,
        "amount_flag": data.amount_flag,
        "finyear": this.pprSearchForm.value.finyear.finyer,
        "sector_id":this.pprSearchForm.value.sectorname.id,  
        "divAmount": this.pprSearchForm.value.divAmount,
         "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
         "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
        "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
        "branch_id": this.pprSearchForm.value.branch_id?.id??"",
        "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
         "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
        "year_term": this.pprSearchForm.value.year_term,
        
      }
    } else {
      input_params = {
      //   "branch_id": this.pprSearchForm.value.branch_id.id,
      //   "finyear": this.pprSearchForm.value.finyear.finyer,
      //   "business_flag": Number(this.pprSearchForm.value.year_term),
      //   "divAmount": this.pprSearchForm.value.divAmount,
      //   "sectorname": this.pprSearchForm.value.sector,
      //   "sector_id":this.pprSearchForm.value.sectorname.id,   
      //   "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
      //   "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
      // 'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
      //   "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
      //   "bs_name": this.pprSearchForm.value.bs_id.name,
      //   "cc_name": this.pprSearchForm.value.cc_id.name,
      //   "expense_id": level.expense_id,
      //   "amount_flag": level.amount_flag,
      //   "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
      //   "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
      "expense_id": data.expense_id,
      "amount_flag": data.amount_flag,
      "finyear": this.pprSearchForm.value.finyear.finyer,
      "sector_id":this.pprSearchForm.value.sectorname.id,  
      "divAmount": this.pprSearchForm.value.divAmount,
       "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
       "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
      "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
      "branch_id": this.pprSearchForm.value.branch_id?.id??"",
      "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
       "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
      "business_flag": Number(this.pprSearchForm.value.year_term),
      
      }
    }
    this.index_cat = ind + 1
    this.SpinnerService.show()
    let expamount = data1[ind].amount_flag
    this.dataService.new_cat_list(i, input_params,pageNumber)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        let page = results['pagination']
          this.has_next_cat = page.has_next;
          this.has_previous_cat = page.has_previous;
          this.presentpage_cat = page.index;
          let index_find_chnage
        for(let dataloop of datas){
          dataloop['expanded'] =true
          this.level_amount_key=dataloop.amount_flag
        }
        
        let buheader = []
        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {
          if (!this.businessview && this.businessviewheader.length == 0) {
            const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = datas[0];
            buheader.push(eventData)
            console.log("buheader=>", buheader)
            let arr = buheader[0]
            console.log(arr)
            console.log(Object.keys(arr))
            this.businessviewheader = Object.keys(arr)
            console.log('2', this.businessviewheader)
            console.log(this.businessview)
            this.colspanlength = this.businessviewheader.length
            this.headerdata = this.businessviewheader
            console.log(this.headerdata)
          }
          // console.log(datas.cat_id)
          // for (var val of datas) {
          //   let a = data
          //   val['flak'] = 'income_data'
          //   // val['cat_id']=data1[ind].cat_id
          //   data1.splice(this.index_cat, 0, val);
          //   this.index_cat = this.index_cat + 1
          // }
          data1[ind].tree_flag = 'N'
           
        
        }
        var finalindex = 0
        let index_find
          for (let val in data1) {
            if(data1[val].name=='Read More' && data1[val].Padding_left == '75px' && data1[val].expanded==true && data1[val].expense_id == data.expense_id){
               index_find=val
          data1.splice(index_find,1)
          index_find_chnage={name:"indexchange" }

            }
            if (data1[val].expense_id == data.expense_id) {
              var inds: number = Number(val) + 1
              if (finalindex == 0) {
                finalindex = ind
              }
              if (data1[inds].Padding_left == '75px') {
                console.log('index of=>', inds)
                finalindex = inds

              } else {
                break;
              }
            }
            // 
          }

          console.log("res=>", finalindex)
          console.log("levelsdatavalue=>", datas)
          console.log("levelsdatavalue1=>", datas)
          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

          }

          console.log("level=>", datas)
         let cat_reverse_index= index_find-1
         for (let i = 0; i < datas.length; i++) {
          let re = datas[i];
          // re['title'] = "Category";
          re['flak'] = 'income';
          if (index_find_chnage?.name === "indexchange") {
            if(i==0){
                  ind = cat_reverse_index+1
                  }else{
                    ind=ind+1
                  }
          } else {
              ind = ind + 1;
          }
          // Insert the element at the correct position in data1
          data1.splice(ind, 0, re);
          console.log("indexss", ind);
      }
      let incomepagenation = {
        "Padding_left": '75px',
        "name": 'Read More',
        "page": page.index,
        "next": page.has_next,
        "previous": page.has_previous,
        // 'title': "Category",
        "expense_id": data.expense_id,
        "colspan": 14,
        'expanded':true,
      }
      data1.splice(ind + 1, 0, incomepagenation)
      let cat_index
          // for (let re of datas) {

          //   re['title'] = "Category"
          //   re['flak'] = 'income'
          //   if(index_find_chnage?.name=="indexchange"){
          //     if(r){
          //     cat_index = cat_reverse_index+1
          //     }else{
          //       cat_index=ind+1
          //     }
          //   }else{
          //     cat_index = ind+1
          //   }
          //   // data1.insert(ind + 1,re);
          //   data1.splice(cat_index, 0, re);
          //  console.log("indexss",ind)
            
          //   // this.aindex.push(ind+1)
          // }
   // if(page.index==1){ 
  
            //  if(page.index==1){
            
          //    }else{
          //  data1.splice(ind + 10, 0, incomepagenation)
          //   }
          // }
          console.log('index', ind, data1)
          let indval: any = []
          for (let i = finalindex + 1; i <= data1.length; i++) {

            if (data1[i].Padding_left == '75px') {

              if (data1[i].name == 'Read More') {
                indval.push(i)
              }

              if (data1[i].name === 'Read More') {
                const index = data1.indexOf(i);
                console.log("indexof ",index)
                // if (index !== -1) {
                    // data1.splice(index, 1); 
                // }
            }
              this.ind = i
              console.log("ind=>", this.ind)
            } else {
              break;
            }
          }
          console.log("val=>", indval)
          if (page.has_next == true) {
            if (indval.length > 1) {
              console.log(indval.length, indval[0])
              data1.splice(indval[0], 1)

            }
          } if (page.has_next == false) {
            for (let i = finalindex + 1; i <= data1.length; i++) {
              if (data1[i].Padding_left == '75px') {
                if (data1[i].name === 'Read More') {
                  data1.splice(i, 1);
                }
              }
              else {
                // break;
                console.log("data else cat")
              }
            }
          }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  newsubcat_list(i, ind, singledata, data1, pageNumber = 1) {
    this.index_subcat = ind + 1
    this.SpinnerService.show()
    if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
      this.masterbusinesssegment_name_params = ""
    } else {

      this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
    }
    if (this.pprSearchForm.value.sectorname.name == 'ALL') {
      this.pprSearchForm.value.sector = ''
    } else {
      this.pprSearchForm.value.sector = this.pprSearchForm.value.sectorname.name
    }
    let data
    if (this.businessview) {
      data = {
        // "branch_id": this.pprSearchForm.value.branch_id.id,
        // "finyear": this.pprSearchForm.value.finyear.finyer,
        // "year_term": this.pprSearchForm.value.year_term,
        // "divAmount": this.pprSearchForm.value.divAmount,
        // "sectorname": this.pprSearchForm.value.sector,
        // "sector_id":this.pprSearchForm.value.sectorname.id,   
        // "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
        // "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
        //   'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
        // "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
        // "bs_name": this.pprSearchForm.value.bs_id.name,
        // "cc_name": this.pprSearchForm.value.cc_id.name,
        // "category_id": singledata.cat_id,
        // "amount_flag": this.level_amount_key,
        // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
        // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
             "category_id":singledata.cat_id,
            "amount_flag":this.level_amount_key,
            "finyear": this.pprSearchForm.value.finyear.finyer,
            "sector_id":this.pprSearchForm.value.sectorname.id,
            "divAmount": this.pprSearchForm.value.divAmount,
            "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
            "branch_id": this.pprSearchForm.value.branch_id?.id??"",
            "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
            "year_term": this.pprSearchForm.value.year_term,
      }
    } else {
      data = {
        // "branch_id": this.pprSearchForm.value.branch_id.id,
        // "finyear": this.pprSearchForm.value.finyear.finyer,
        // "business_flag": Number(this.pprSearchForm.value.year_term),
        // "divAmount": this.pprSearchForm.value.divAmount,
        // "sectorname": this.pprSearchForm.value.sector,
        // "sector_id":this.pprSearchForm.value.sectorname.id,   
        // "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
        // "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
        //   'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
        // "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
        // "bs_name": this.pprSearchForm.value.bs_id.name,
        // "cc_name": this.pprSearchForm.value.cc_id.name,
        // "category_id": singledata.cat_id,
        // "amount_flag": this.level_amount_key,
        // "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
        // "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
        // "year_term": this.pprSearchForm.value.year_term,

        "category_id":singledata.cat_id,
"amount_flag":this.level_amount_key,
"finyear": this.pprSearchForm.value.finyear.finyer,
"business_flag": Number(this.pprSearchForm.value.year_term),
"sector_id":this.pprSearchForm.value.sectorname.id,
"divAmount": this.pprSearchForm.value.divAmount,
 "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
 "microcccode":(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
"business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
"branch_id": this.pprSearchForm.value.branch_id?.id??"",
"from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
"to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
 
      }
    }
    this.dataService.new_subcatlist(i, data, pageNumber)
      .subscribe((results: any[]) => {
        console.log(i)
        this.SpinnerService.hide()

        // if (i == "INC" || i == "HR" || i == "EXP" || i=="AL4A" || i == "AL4B" || i == "AL5" || i == "AL6" || i == 'LPROV') {                                      
          let page = results['pagination']
          this.has_next = page.has_next;
          this.has_previous = page.has_previous;
          this.presentpage = page.index;
          this.dataaexpone = false
          data1[ind].tree_flag = 'N'
          let levelsdatavalue
          let buheader = []
          levelsdatavalue = results['data']
          for(let dataloop of levelsdatavalue){
            dataloop['expanded'] =true
          }
          if (!this.businessview && this.businessviewheader.length == 0) {
            const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = levelsdatavalue[0];
            buheader.push(eventData)
            console.log("buheader=>", buheader)
            let arr = buheader[0]
            console.log(arr)
            console.log(Object.keys(arr))
            this.businessviewheader = Object.keys(arr)
            console.log('2', this.businessviewheader)
            console.log(this.businessview)
            this.colspanlength = this.businessviewheader.length
            this.headerdata = this.businessviewheader
            console.log(this.headerdata)
          }
          var finalindex = 0

          for (let val in data1) {
            if (data1[val].cat_id == singledata.cat_id) {
              var inds: number = Number(val) + 1
              if (finalindex == 0) {
                finalindex = ind
              }
              if (data1[inds].Padding_left == '100px') {
                console.log('index of=>', inds)
                finalindex = inds

              } else {
                break;
              }
            }
          }

          console.log("res=>", finalindex)
          console.log("levelsdatavalue=>", levelsdatavalue)
          console.log("levelsdatavalue1=>", levelsdatavalue)
          if (results['data'].length == 0) {
            this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

          }

          console.log("level=>", levelsdatavalue)
          for (let re of levelsdatavalue) {

            // re['title'] = "Sub Category"
            re['flak'] = 'income'
            ind = ind + 1
            // data1.insert(ind + 1,re);
            data1.splice(ind, 0, re);
            // this.aindex.push(ind+1)
          }
          let incomepagenation = {
            "Padding_left": '100px',
            "name": 'Read More',
            "page": page.index,
            "next": page.has_next,
            "previous": page.has_previous,
            // 'title': "Sub Category",
            "cat_id": singledata.cat_id,
            "colspan": 14,
            'expanded':true,
          }
          data1.splice(ind + 1, 0, incomepagenation)
          console.log('index', ind, data1)
          let indval: any = []
          for (let i = finalindex + 1; i <= data1.length; i++) {

            if (data1[i].Padding_left == '100px') {

              if (data1[i].name == 'Read More') {
                indval.push(i)
              }

              this.ind = i
              console.log("ind=>", this.ind)
            } else {
              break;
            }
          }
          console.log("val=>", indval)
          if (page.has_next == true) {
            if (indval.length > 1) {
              console.log(indval.length, indval[0])
              data1.splice(indval[0], 1)

            }
          } if (page.has_next == false) {
            for (let i = finalindex + 1; i <= data1.length; i++) {
              if (data1[i].Padding_left == '100px') {
                if (data1[i].name === 'Read More') {
                  data1.splice(i, 1);
                }
              }
              else {
                break;
              }
            }
          }
          console.log("ind=>", this.ind)

          console.log(ind)
          // this.levelsdatas=data1
          console.log("data1=>", data1)
          console.log(results)
          finalindex = 0
      
            console.log(data1);
          this.subcat_bizdata = results['dict_value']

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  page_next(i, k, leveldata, levelsdatas) {
    if (leveldata.next === true) {
      this.currentpage = this.presentpage + 1
      this.levelssubcat(i, k, leveldata, levelsdatas, leveldata.page + 1)
    }

  }
  private newexpense_list(i, ind, data, data1, pageNumber) {
    this.index_expense = ind + 1
    this.SpinnerService.show()
    console.log("data1=>", data1)
    this.dataService.new_expenselist(i, data, pageNumber)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()

        let datas = results["data"];
        for(let dataloop of datas){
          dataloop['expanded'] =true
        }
        let buheader = []
        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
          return false;
        } else {
          if (!this.businessview && this.businessviewheader.length == 0) {
            const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = datas[0];
            buheader.push(eventData)
            console.log("buheader=>", buheader)
            let arr = buheader[0]
            console.log(arr)
            console.log(Object.keys(arr))
            this.businessviewheader = Object.keys(arr)
            console.log('2', this.businessviewheader)
            console.log(this.businessview)
            this.colspanlength = this.businessviewheader.length
            this.headerdata = this.businessviewheader
            console.log(this.headerdata)
          }
          for (var val of datas) {
            let a = data
            // val['title'] = 'Expance Head'

            data1.splice(this.index_expense, 0, val);
            this.index_expense = this.index_expense + 1
          }
          data1[ind].tree_flag = 'N'
    
            this.levelsdatas = data1
        
          this.supplierList = datas;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  private supplieramountdetails(i, ind, data, data1) {
    this.SpinnerService.show()

    this.dataService.getsupplieramountdetails(i, data)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()

        let datas = results["data"];
        if (datas.length == 0) {
          this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
        } else {

          for (var val of datas) {
            let a = data
            val['flak'] = 'income_data'

            data1.splice(ind + 1, 0, val);

          }
          data1[ind].tree_flag = 'N'
          if (i == 0) {
            this.levelsdatas = data1
          } else if (i == 5) {
            this.levels4adatas = data1
          } else if (i == 6) {
            this.levels4a2datas = data1
          } else if (i == 8) {
            this.levels4a3datas = data1
          } else if (i == 10) {
            this.levels5adatas = data1
          } else {
            this.levelstwodatas = data1
          }

          this.supplierList = datas;
        }


      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  levelssubcat(level_index, levelexp_index, leveldata, levelsonedatas, pageNumber = 1) {
    console.log(levelexp_index)
    var sub_category
    if (level_index == 0 || level_index == 1) {
      if (this.businessview) {
        sub_category = {
          "entry_module": 'AP',
          "branch_id": this.pprSearchForm.value.branch_id.id,
          "expense_id": leveldata.expense_id,
          "cat_id": leveldata.cat_id,
          "divAmount": this.pprSearchForm.value.divAmount,
          "expensegrp_id": leveldata.expensegrp_id,
          "subcat_id": leveldata.subcat_id,
          "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
          "sector_id": this.pprSearchForm.value.sectorname.id,
          "year_term": this.pprSearchForm.value.year_term,
          "finyear": this.pprSearchForm.value.finyear.finyer,
          "bs_id": this.pprSearchForm.value.bs_id.id,
          "cc_id": this.pprSearchForm.value.cc_id.id,
          "amount_flag": leveldata.amount_flag,
          "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
          "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
        }
      } else {
        sub_category = {
          "entry_module": 'AP',
          "branch_id": this.pprSearchForm.value.branch_id.id,
          "expense_id": leveldata.expense_id,
          "cat_id": leveldata.cat_id,
          "divAmount": this.pprSearchForm.value.divAmount,
          "expensegrp_id": leveldata.expensegrp_id,
          "subcat_id": leveldata.subcat_id,
          "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
          "sector_id": this.pprSearchForm.value.sectorname.id,
          "business_flag": Number(this.pprSearchForm.value.year_term),
          "finyear": this.pprSearchForm.value.finyear.finyer,
          "bs_id": this.pprSearchForm.value.bs_id.id,
          "cc_id": this.pprSearchForm.value.cc_id.id,
          "amount_flag": leveldata.amount_flag,
          "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
        }

      }
    } else {
      sub_category = {

        branch_id: this.pprSearchForm.value.branch_id.id,
        bs_code: this.pprSearchForm.value.bs_id.id,
        cc_code: this.pprSearchForm.value.cc_id.id,
        level_id: leveldata.level_id,
        expense_id: leveldata.expense_id,
        divAmount: this.pprSearchForm.value.divAmount,
        finyear: this.pprSearchForm.value.finyear.finyer,
        business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
        microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
        microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
        masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
        sectorname: this.pprSearchForm.value.sectorname.name,
        yearterm: this.pprSearchForm.value.year_term,
        cat_id: leveldata.cat_id,
        amount_flag: leveldata.amount_flag,
        "from_expense_month":this.pprSearchForm.value.frommonth?.month_id??"",
            "to_expense_month":this.pprSearchForm.value.tomonth?.month_id??"",
      }
    }
    let levelexpind = levelexp_index
    this.SpinnerService.show()

    this.dataService.subexpense_list(level_index, sub_category, pageNumber)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let page = results['pagination']
        this.has_next = page.has_next;
        this.has_previous = page.has_previous;
        this.presentpage = page.index;
        this.dataaexpone = false
        levelsonedatas[levelexp_index].tree_flag = 'N'
        let levelsdatavalue
        let buheader = []
        levelsdatavalue = results['data']
        if (!this.businessview && this.businessviewheader.length == 0) {
          const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = levelsdatavalue[0];
          buheader.push(eventData)
          console.log("buheader=>", buheader)
          let arr = buheader[0]
          console.log(arr)
          console.log(Object.keys(arr))
          this.businessviewheader = Object.keys(arr)
          console.log('2', this.businessviewheader)
          console.log(this.businessview)
          this.colspanlength = this.businessviewheader.length
          this.headerdata = this.businessviewheader
          console.log(this.headerdata)
        }
        var finalindex = 0

        for (let val in levelsonedatas) {
          if (levelsonedatas[val].cat_id == leveldata.cat_id) {
            var inds: number = Number(val) + 1
            if (finalindex == 0) {
              finalindex = levelexp_index
            }
            if (levelsonedatas[inds].Padding_left == '100px') {
              console.log('index of=>', inds)
              finalindex = inds

            } else {
              break;
            }
          }
        }

        console.log("res=>", finalindex)
        console.log("levelsdatavalue=>", levelsdatavalue)
        console.log("levelsdatavalue1=>", levelsdatavalue)
        if (results['data'].length == 0) {
          this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

        }

        console.log("level=>", levelsdatavalue)
        for (let re of levelsdatavalue) {

          // re['title'] = "Sub Category"
          re['flak'] = 'income'
          levelexpind = levelexpind + 1
          // levelsonedatas.insert(levelexpind + 1,re);
          levelsonedatas.splice(levelexpind, 0, re);
          // this.aindex.push(levelexpind+1)
        }
        let incomepagenation = {
          "Padding_left": '100px',
          "name": 'Read More',
          "page": page.index,
          "next": page.has_next,
          "previous": page.has_previous,
          'flak': 'income',
          // 'title': "Sub Category",
          "expense_id": leveldata.expense_id,
          "cat_id": leveldata.cat_id,
          "expensegrp_id": leveldata.expensegrp_id,
          "subcat_id": leveldata.subcat_id,
          "colspan": 14
        }
        levelsonedatas.splice(levelexpind + 1, 0, incomepagenation)
        console.log('index', levelexpind, levelsonedatas)
        let indval: any = []
        for (let i = finalindex + 1; i <= levelsonedatas.length; i++) {

          if (levelsonedatas[i].Padding_left == '100px') {

            if (levelsonedatas[i].name == 'Read More') {
              indval.push(i)
            }

            this.ind = i
            console.log("ind=>", this.ind)
          } else {
            break;
          }
        }
        console.log("val=>", indval)
        if (page.has_next == true) {
          if (indval.length > 1) {
            console.log(indval.length, indval[0])
            levelsonedatas.splice(indval[0], 1)

          }
        } if (page.has_next == false) {
          for (let i = finalindex + 1; i <= levelsonedatas.length; i++) {
            if (levelsonedatas[i].Padding_left == '100px') {
              if (levelsonedatas[i].name === 'Read More') {
                levelsonedatas.splice(i, 1);
              }
            }
            else {
              break;
            }
          }
        }
        console.log("ind=>", this.ind)

        console.log(levelexp_index)
        // this.levelsdatas=levelsonedatas
        console.log("data1=>", levelsonedatas)
        console.log(results)
        finalindex = 0
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    console.log("final data", levelsonedatas)
  }

  levelscategory(i, expand_index, leveldata, levelsonedatas) {
    console.log("sub cat")
    var cat_json
    if (i == 0 || i == 1) {
      if (this.businessview) {
        cat_json = {
          "entry_module": 'AP',
          "branch_id": this.pprSearchForm.value.branch_id.id,
          "expense_id": leveldata.expense_id,
          "divAmount": this.pprSearchForm.value.divAmount,
          "expensegrp_id": leveldata.expensegrp_id,
          "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
          "sector_id": this.pprSearchForm.value.sectorname.id,
          "year_term": this.pprSearchForm.value.year_term,
          "finyear": this.pprSearchForm.value.finyear.finyer,
          "bs_id": this.pprSearchForm.value.bs_id.id,
          "cc_id": this.pprSearchForm.value.cc_id.id,
          "amount_flag": leveldata.amount_flag,
          "from_expense_month":this.pprSearchForm.value.frommonth.month_id,
          "to_expense_month":this.pprSearchForm.value.tomonth.month_id,
        }
      } else {
        cat_json = {
          "entry_module": 'AP',
          "branch_id": this.pprSearchForm.value.branch_id.id,
          "expense_id": leveldata.expense_id,
          "divAmount": this.pprSearchForm.value.divAmount,
          "expensegrp_id": leveldata.expensegrp_id,
          "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
          "business_id": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
          "masterbusinesssegment_name": this.pprSearchForm.value.businesscontrol.name,
          "sector_id": this.pprSearchForm.value.sectorname.id,
          "business_flag": Number(this.pprSearchForm.value.year_term),
          "finyear": this.pprSearchForm.value.finyear.finyer,
          "bs_id": this.pprSearchForm.value.bs_id.id,
          "cc_id": this.pprSearchForm.value.cc_id.id,
          "amount_flag": leveldata.amount_flag
        }
      }
    } else {
      cat_json = {
        branch_id: this.pprSearchForm.value.branch_id.id,
        bs_code: this.pprSearchForm.value.bs_id.id,
        cc_code: this.pprSearchForm.value.cc_id.id,
        level_id: leveldata.level_id,
        expense_id: leveldata.expense_id,
        business_id: this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
        microbscode:(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
          microcccode:(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
        divAmount: this.pprSearchForm.value.divAmount,
        finyear: this.pprSearchForm.value.finyear.finyer,
        // microbscode:this.pprSearchForm.value.bs_id.microbscode,
        // microcccode:this.pprSearchForm.value.cc_id.microcccode,
        masterbusinesssegment_name: this.pprSearchForm.value.businesscontrol.name,
        sectorname: this.pprSearchForm.value.sectorname.name,
        yearterm: this.pprSearchForm.value.year_term,
        "amount_flag": leveldata.amount_flag
      }
    }

    console.log("cat=>", cat_json)
    this.SpinnerService.show()
    this.dataService.category_list(i, cat_json, 1)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()

        if (results.length != 0) {
          this.dataaexpone = false
          levelsonedatas[expand_index].tree_flag = 'N'
          let levelsdatavalueone
          let buheader
          levelsdatavalueone = results['data']
          if (!this.businessview && this.businessviewheader.length == 0) {
            const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = this.levelsdatavalueone[0];
            buheader.push(eventData)
            console.log("buheader=>", buheader)
            let arr = buheader[0]
            console.log(arr)
            console.log(Object.keys(arr))
            this.businessviewheader = Object.keys(arr)
            console.log('2', this.businessviewheader)
            console.log(this.businessview)
            this.colspanlength = this.businessviewheader.length
            this.headerdata = this.businessviewheader
            console.log(this.headerdata)
          }
          for (let re of levelsdatavalueone) {

            re['title'] = "Main Category"
            re['flak'] = 'income'

            levelsonedatas.splice(expand_index + 1, 0, re);
            // this.aindex.push(i+1)

          }
          this.title = "expance "
          console.log("levelsonedatas=>", levelsonedatas)

        }
        if (results['data'].length == 0) {
          this.toastr.warning('', 'No Data Found', { timeOut: 1500 });

        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    console.log("levelsonedatas=>", levelsonedatas)
  }



  level4bshow: boolean = true
  levels4bdatas: any
  business_wise() {
    this.businessviewheader = []
    this.headerdata = []
    this.headercheckone = true;
    this.headercheck = true;
    this.businessview = false;
    this.type = 'Business'
    this.colspanlength = 2
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
//     if(this.pprSearchForm.value.frommonth !="" ){
//       this.pprSearchForm.controls['frommonth'].reset('')
// if(this.pprSearchForm.value.tomonth !=""){
//   this.pprSearchForm.controls['tomonth'].reset('') 
// }
   
//     }
  }
  Quarterly() {
    this.headerdata = []
    this.businessview = true
    this.headercheck = false;
    this.type = 'Quarterly'
    this.headercheckone = true;
    this.colspanlength = this.quarterly.length
    this.headerdata = this.quarterly
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
     if(this.pprSearchForm.value.frommonth != "" ){
      this.pprSearchForm.controls['frommonth'].reset('')
if(this.pprSearchForm.value.tomonth!=""){
  this.pprSearchForm.controls['tomonth'].reset('') 
}
   
    }
  }
  Monthly() {
    this.headerdata = []
    this.type = 'Monthly'
    this.headercheckone = false;
    this.headercheck = true
    this.businessview = true
    this.colspanlength = this.month.length
    this.headerdata = this.month
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

   
  }
  lakhs() {
    this.amount_type = "Amount In Lakhs"
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
  }
  thousands() {
    this.amount_type = "Amount In Thousands"
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
  }
  incomeorhr(level) {
    if (level == 'Level 0-Income') {
      this.incomehr = 0
      this.lableincomehr = 'Income'
      console.log("incomehr=>", this.incomehr)
    }
    if (level == 'Level 1-HR Cost') {
      this.incomehr = 1
      this.lableincomehr = 'HR Cost'
      console.log("incomehr=>", this.incomehr)

    }
  }
  @ViewChild('closepop') closepop
  upload(incomehr, filedetails) {
    console.log("incomehr=>", this.incomehr)
    console.log("file", filedetails)
    console.log("file value", filedetails.value)
    if (this.pprSearchForm.value.finyear == '' || this.pprSearchForm.value.finyear == null || this.pprSearchForm.value.finyear == undefined) {
      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
    }
    if (this.pprSearchForm.value.sectorname == '' || this.pprSearchForm.value.sectorname == null || this.pprSearchForm.value.sectorname == undefined) {
      this.toastr.warning('', 'Please Select Sector', { timeOut: 1500 });
      return false;
    }
    if (filedetails.value.branch == '' || filedetails.value.branch == null || filedetails.value.branch == undefined) {
      this.toastr.warning('', 'Please Choose Branch File', { timeOut: 1500 });
      return false;
    }
    if (filedetails.value.ccbs == '' || filedetails.value.ccbs == null || filedetails.value.ccbs == undefined) {
      this.toastr.warning('', 'Please Choose Core BS File', { timeOut: 1500 });
      return false;
    }
    if (filedetails.value.gldata == '' || filedetails.value.gldata == null || filedetails.value.gldata == undefined) {
      this.toastr.warning('', 'Please Choose GL File', { timeOut: 1500 });
      return false;
    }
    if (filedetails.value.income_file == '' || filedetails.value.income_file == null || filedetails.value.income_file == undefined) {
      this.toastr.warning('', 'Please Choose Income File', { timeOut: 1500 });
      return false;
    }
    this.fileddetails.push({ "branch": this.branch }, { "ccbs": this.ccbs }, { "gldata": this.gldate }, { "income_file": this.income })
    const formData = new FormData();
    for (var file in this.fileddetails) {
      console.log("single file=>", this.fileddetails[file], file)
      console.log("key=>", Object.keys(this.fileddetails[file]))
      let filekeyname
      if (String(Object.keys(this.fileddetails[file])) == 'branch') {
        filekeyname = 'branch'
        formData.append(filekeyname, this.fileddetails[file].branch);

        console.log(String(Object.keys(this.fileddetails[file])))
      }
      if (String(Object.keys(this.fileddetails[file])) == 'ccbs') {
        filekeyname = 'ccbs'
        formData.append(filekeyname, this.fileddetails[file].ccbs);

      }
      if (String(Object.keys(this.fileddetails[file])) == 'gldata') {
        filekeyname = 'gldata'
        formData.append(filekeyname, this.fileddetails[file].gldata);

      }
      if (String(Object.keys(this.fileddetails[file])) == 'income_file') {
        filekeyname = 'income_file'
        formData.append(filekeyname, this.fileddetails[file].income_file);

      }
      console.log("data=>", this.fileddetails[file].branch, filekeyname)
    }
    let finyear = this.pprSearchForm.value.finyear.finyer
    let sector = this.pprSearchForm.value.sectorname.id
    this.SpinnerService.show()
    this.dataService.pprfileupdate(incomehr, finyear, sector, formData)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let data = results['data']
        console.log("data", data)
        console.log("data len", data.length)
        if (data.length == 0) {
          this.toastr.success('', "Succesfully Created", { timeOut: 1500 })
          this.fileddetails = []
          this.fileuploade.controls['branch'].reset('')
          this.fileuploade.controls['ccbs'].reset('')
          this.fileuploade.controls['gldata'].reset('')
          this.fileuploade.controls['income_file'].reset('')
          this.closepop.nativeElement.click();

        }
      }, error => {
        this.closepop.nativeElement.click();
        this.fileuploade.controls['branch'].reset('')
        this.fileuploade.controls['ccbs'].reset('')
        this.fileuploade.controls['gldata'].reset('')
        this.fileuploade.controls['income_file'].reset('')
        this.fileddetails = []
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    console.log("file=>", this.fileddetails)
    console.log("formData=>", formData)
    console.log("filedetails=>", filedetails)
  }
  closepopup() {
    this.fileddetails = []
    this.fileuploade.controls['branch'].reset('')
    this.fileuploade.controls['ccbs'].reset('')
    this.fileuploade.controls['gldata'].reset('')
    this.fileuploade.controls['income_file'].reset('')
  }
  fileddetails: any[] = []
  branchupload_file(e) {

    console.log("event=>", e.target.files[0])
    this.branch = e.target.files[0]

  }
  ccbsuploadfile(e) {
    this.ccbs = e.target.files[0]
    console.log('ccbbs', e.target.files)
  }
  gluploadfile(e) {
    this.gldate = e.target.files[0]
    console.log('gl', e.target.files)

  }
  incomeuploadfile(e) {
    this.income = e.target.files[0]
    console.log('income', e.target.files)

  }
  exceldownload() {
    if ((this.pprSearchForm.value.finyear === undefined) || (this.pprSearchForm.value.finyear === '')) {

      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
    } else {
      // this.pprSearchForm.value.finyear.finyer='FY22-23';
    }
    if (this.pprSearchForm.value.year_term === '') {
      this.toastr.warning('', 'Please Select Quarterly or Monthly', { timeOut: 1500 });
      return false;
    }
    if (this.pprSearchForm.value.divAmount === '') {
      this.toastr.warning('', 'Please Select Amount', { timeOut: 1500 });
      return false;
    }
    if ((this.pprSearchForm.value.sectorname == undefined) || (this.pprSearchForm.value.sectorname == '')) {
      this.toastr.warning('', 'Please Select Sector', { timeOut: 1500 });
      return false;

    }
    if(this.pprSearchForm.value.download_type == undefined || this.pprSearchForm.value.download_type == null || this.pprSearchForm.value.download_type == ""){
      this.toastr.warning('', 'Please Select Download Type', { timeOut: 1500 });
      return false;
    }
    let download_data_type = this.pprSearchForm.value.download_type
    console.log("download_data_type",download_data_type)
    if(this.pprSearchForm.value.download_type == 2){
     this.pprreport_excel = {
      "finyear": this.pprSearchForm.value.finyear.finyer,
      "sectorid": this.pprSearchForm.value.sectorname.id,
      'sector': this.pprSearchForm.value.sectorname.name,
      "divAmount": this.pprSearchForm.value.divAmount,
      "bsname": this.pprSearchForm.value.businesscontrol.name,
      "bsid": this.pprSearchForm.value.bs_id.id,
      "businessid": this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
      "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
      'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
      "businessname": this.pprSearchForm.value.bs_id.name,
      "ccname": this.pprSearchForm.value.cc_id.name,
      "ccid": this.pprSearchForm.value.cc_id.id,
      "branchid": this.pprSearchForm.value.branch_id.id,
      "from_month": this.pprSearchForm.value.frommonth?this.pprSearchForm.value.frommonth.month_id:'',
      "to_month": this.pprSearchForm.value.tomonth?this.pprSearchForm.value.tomonth.month_id:'',
    }
  }
  else{
     this.pprreport_excel ={
      "finyear": this.pprSearchForm.value.finyear.finyer,
      "sectorid": this.pprSearchForm.value.sectorname.id,
      "from_month": this.pprSearchForm.value.frommonth?this.pprSearchForm.value.frommonth.month_id:"",
      "to_month": this.pprSearchForm.value.tomonth?this.pprSearchForm.value.tomonth.month_id:'',
      "businessid":this.pprSearchForm.value.businesscontrol.id?this.pprSearchForm.value.businesscontrol.id:"",
      "microbscode": (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
      "microcccode": (this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
      "branchid": this.pprSearchForm.value.branch_id.id,
    }
  }
    Object.keys(this.pprreport_excel).forEach(key => {
      if (this.pprreport_excel[key] == '' ||this.pprreport_excel[key] == undefined || this.pprreport_excel[key] == null) {
        this.pprreport_excel[key] = '';
      }
    });
    this.SpinnerService.show();
    
    this.dataService.pprreportdownload(this.pprreport_excel,download_data_type)
      .subscribe((results: any) => {
        // this.errorHandler.handleError(results);
        this.SpinnerService.hide();
        if(results.status=="Success"){
        this.toastr.success("", 'File Generate Start...', { timeOut: 1500 })
        }else{
          this.toastr.warning(results)
        }
      })
    this.pdfSrc = undefined

  }


  expantdatas(i, index, singledata, totaldata) {
    console.log("dxrcgjkl")
    let diff = 6
    let a = []
    let a2 = index + 1
    if (singledata.tree_flag == 'N') {
      if (singledata.Padding_left == '10px') {
        for (let i = a2; i < totaldata.length; i++) {
          let a1 = totaldata[i]
          if (totaldata[i].Padding_left == '50px') {
            a.push(i)
          }
          if ((a1.Padding_left == '10px')) { break; }
          console.log("Block statement execution no." + i);
        }
      }

      // a.pop()
      const indexSet = new Set(a);

      const arrayWithValuesRemoved = totaldata.filter((value, i) => !indexSet.has(i));
      arrayWithValuesRemoved[index].tree_flag = 'Y'
      console.log("arrayWithValuesRemoved=>", arrayWithValuesRemoved);
      if (i == 5) {
        this.levels4adatas = arrayWithValuesRemoved
      }
      else if (i == 6) {
        this.levels4a2datas = arrayWithValuesRemoved
      } else if (i == 8) {
        this.levels4a3datas = arrayWithValuesRemoved
      } else if (i == 10) {
        this.levels5adatas = arrayWithValuesRemoved
      }
    } else {

      if (singledata.Padding_left == '10px') {
        if (this.pprSearchForm.value.masterbusinesssegment_name == undefined) {
          this.masterbusinesssegment_name_params = ""
        } else {
          this.masterbusinesssegment_name_params = this.pprSearchForm.value.masterbusinesssegment_name
        }

        if (this.pprSearchForm.value.sectorname.name == 'ALL') {
          this.pprSearchForm.value.sector = ''
        } else {
          this.pprSearchForm.value.sector = this.pprSearchForm.value.sectorname.name
        }
        let input_params
        let levelindex
        if (i == 5) {
          levelindex = 4
        }
        if (i == 6) {
          levelindex = 5
        } else if (i == 8) {
          levelindex = 6

        } else if (i == 10) {
          levelindex = 7

        }
        console.log("levelindex=>", levelindex)
        if (singledata.is_parent == 1 && levelindex != 4) {
          input_params = {
            "finyear": this.pprSearchForm.value.finyear.finyer,
            "sectorname": this.pprSearchForm.value.sector,
            "bizname": this.pprSearchForm.value.businesscontrol.name,
            "level_id": levelindex,
            "year_term": this.pprSearchForm.value.year_term,
            "divAmount": this.pprSearchForm.value.divAmount,
            "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            "parent_id": singledata.id,
            //  'bs_id':singledata.bs_code,
            //  'cc_id':singledata.cc_code,
            "is_parent": 1,
            "branch_id": this.pprSearchForm.value.branch_id.id,
            "from_expense_month":this.pprSearchForm.value.frommonth.month_id,
            "to_expense_month":this.pprSearchForm.value.tomonth.month_id,
            
          }
        } else if (singledata.is_parent == 1 && levelindex == 4) {
          diff = 4
          input_params = {
            "finyear": this.pprSearchForm.value.finyear.finyer,
            "sectorname": this.pprSearchForm.value.sector,
            "bizname": this.pprSearchForm.value.businesscontrol.name,
            "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            "year_term": this.pprSearchForm.value.year_term,
            "divAmount": this.pprSearchForm.value.divAmount,
            "parent_id": singledata.id,
            //  'bs_id':singledata.bs_code,
            //  'cc_id':singledata.cc_code,
            "is_parent": 1,
            "branch_id": this.pprSearchForm.value.branch_id.id,
            "from_expense_month":this.pprSearchForm.value.frommonth.month_id,
            "to_expense_month":this.pprSearchForm.value.tomonth.month_id,
          }
        }
        else {
          input_params = {
            "finyear": this.pprSearchForm.value.finyear.finyer,
            "sectorname": this.pprSearchForm.value.sector,
            "bizname": this.pprSearchForm.value.businesscontrol.name,
            "level_id": levelindex,
            "year_term": this.pprSearchForm.value.year_term,
            "divAmount": this.pprSearchForm.value.divAmount,
            "microbscode":(this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:"",
            'microcccode':(this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"",
            //  'bs_id':singledata.bs_code,
            //  'cc_id':singledata.cc_code,
            "branch_id": this.pprSearchForm.value.branch_id.id,
            "from_expense_month":this.pprSearchForm.value.frommonth.month_id,
            "to_expense_month":this.pprSearchForm.value.tomonth.month_id,
          }
        }
        for (let val in input_params) {
          if (input_params[val] == '' || input_params[val] == undefined || input_params[val] == null) {
            input_params[val] = ''
          }
        }
        this.expantvalue(diff, index, input_params, totaldata)

      }
    }
  }
  expantvalue(i, index, input_params, totaldata) {
    this.SpinnerService.show()

    console.log("input_params", input_params)
    this.dataService.gettech(i, input_params).subscribe((results: any[]) => {
      this.SpinnerService.hide()

      let datas = results["data"];
      if (datas.length == 0) {
        this.toastr.warning('', 'Data Not Found', { timeOut: 1500 });
      } else {
        let buheader = []
        console.log(results)
        if (!this.businessview && this.businessviewheader.length == 0) {
          const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = datas[0];
          buheader.push(eventData)
          console.log("buheader=>", buheader)
          let arr = buheader[0]
          console.log(arr)
          console.log(Object.keys(arr))
          this.businessviewheader = Object.keys(arr)
          console.log('2', this.businessviewheader)
          console.log(this.businessview)
          this.colspanlength = this.businessviewheader.length
          this.headerdata = this.businessviewheader
          console.log(this.headerdata)
        }
        for (var val of datas) {


          val.Padding_left = '50px'


          totaldata.splice(index + 1, 0, val);

        }
        totaldata[index].tree_flag = 'N'
        if (i == 6) {
          this.levels4a2datas = totaldata
        } else if (i == 8) {
          this.levels4a3datas = totaldata
        } else if (i == 10) {
          this.levels5adatas = totaldata
        }
      }
      console.log("totaldata=>", totaldata)

    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }

  ppr_search(){
    
    // for (let levelslist of this.levelslist) {
    //      levelslist.expanded = false
    //     }
   
    if(this.pprSearchForm.value.finyear === '' || this.pprSearchForm.value.finyear === null || this.pprSearchForm.value.finyear === undefined){
      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
    }else{
      if (this.finy == undefined) {
        this.startyear = ''
        this.lastyear = ''
      } else {
        this.startyear = this.finy.slice(2, 4)
        this.lastyear = this.finy.slice(5, 9)
      }
    }
      if (this.pprSearchForm.value.year_term === '' || this.pprSearchForm.value.year_term === null || this.pprSearchForm.value.year_term === undefined) {
      this.toastr.warning('', 'Please Select Quarterly or Monthly', { timeOut: 1500 });
      return false;
    }else{
      let select_view = this.pprSearchForm.value.year_term
      if(select_view == "Quarterly"){
      this.Quarterly()
    }
      if(select_view == "Monthly"){
        this.month = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'YTD']
       this.Monthly()

       if( this.pprSearchForm.value.frommonth !="" ){               
       if(this.pprSearchForm.value.tomonth == null || this.pprSearchForm.value.tomonth == undefined || this.pprSearchForm.value.tomonth == ""){
        this.toastr.warning('', 'Please Select ToMonth', { timeOut: 1500 }); 
        return false
      }   else{
        this.frommonthsearch(this.pprSearchForm.value.frommonth)
        this.tomonthsearch(this.pprSearchForm.value.tomonth)
     }  
    }    
   }       
      if( select_view == "1"){  
       this.business_wise()
      }
    }
    if (this.pprSearchForm.value.divAmount == '' || this.pprSearchForm.value.divAmount == null || this.pprSearchForm.value.divAmount == undefined) {
      this.toastr.warning('', 'Please Select Amount', { timeOut: 1500 });
      return false;
    }else{
      let select_amt = this.pprSearchForm.value.divAmount
      if(select_amt == "L"){
          this.lakhs()
      }
      if(select_amt == "K"){
        this.thousands()
      }
    }
    if (this.pprSearchForm.value.sectorname == undefined || this.pprSearchForm.value.sectorname == '' || this.pprSearchForm.value.sectorname == null) {
      this.toastr.warning('', 'Please Select Sector', { timeOut: 1500 });
      return false;
    }else{
      let serctor = this.pprSearchForm.value.sectorname
      if(serctor == "sector"){

      }
    }
    this.ppr_report_search=true;
    if( this.pprSearchForm.value.branch_id == null){     
    this.pprSearchForm.value.branch_id = ""
   
    }
    if( this.pprSearchForm.value.businesscontrol == null || this.pprSearchForm.value.businesscontrol == undefined){
       this.pprSearchForm.value.businesscontrol=""
     
   
    }
    if(this.pprSearchForm.value.bs_id == null || this.pprSearchForm.value.bs_id == undefined){
       this.pprSearchForm.value.bs_id =""
      
    }
    if(this.pprSearchForm.value.cc_id == null || this.pprSearchForm.value.cc_id == undefined){
      this.pprSearchForm.value.cc_id=""
      
    }
    if(this.pprSearchForm.value.frommonth == null || this.pprSearchForm.value.frommonth == undefined){
       this.pprSearchForm.value.frommonth=""
      
    }
    if(this.pprSearchForm.value.tomonth == null || this.pprSearchForm.value.tomonth == undefined){
      this.pprSearchForm.value.tomonth = ""
      
    }

    this.tabledata = true;
     this.Search_value = {
      "finyear" :(this.pprSearchForm.value.finyear.finyer)?this.pprSearchForm.value.finyear.finyer:"",
      "year_term":(this.pprSearchForm.value.year_term)?this.pprSearchForm.value.year_term:"",
      "divAmount":(this.pprSearchForm.value.divAmount)?this.pprSearchForm.value.divAmount:"",
      "sectorname":(this.pprSearchForm.value.sectorname)?this.pprSearchForm.value.sectorname:"",
      "sector_id": (this.pprSearchForm.value.sectorname.id)?this.pprSearchForm.value.sectorname.id:"",
      "business_id": (this.pprSearchForm.value.businesscontrol.id)?this.pprSearchForm.value.businesscontrol.id:"",
      "branch_id":(this.pprSearchForm.value.branch_id.id)?this.pprSearchForm.value.branch_id.id:"",
      "businesscontrol":(this.pprSearchForm.value.businesscontrol)?this.pprSearchForm.value.businesscontrol:"",
      "bs_id": (this.pprSearchForm.value.bs_id.id)?this.pprSearchForm.value.bs_id.id:"",
      "cc_id": (this.pprSearchForm.value.cc_id.id)?this.pprSearchForm.value.cc_id.id:"",
      "frommonth":(this.pprSearchForm.value.frommonth)?this.pprSearchForm.value.frommonth:"",
      "tomonth":(this.pprSearchForm.value.tomonth)?this.pprSearchForm.value.tomonth:"",
      "from_expense_month":(this.pprSearchForm.value.frommonth.month_id)?this.pprSearchForm.value.month_id:"",
      "to_expense_month":(this.pprSearchForm.value.tomonth.month_id)?this.pprSearchForm.value.month_id:"", 
      "bizname": (this.pprSearchForm.value.businesscontrol.name)?this.pprSearchForm.value.name:"", 
    }
    // this.finy = value.finyer
    let Serach_data
      if(!this.businessview){
        Serach_data = {
      
      "divAmount":(this.pprSearchForm.value.divAmount)?this.pprSearchForm.value.divAmount:"",
      "business_id":(this.pprSearchForm.value.businesscontrol.id)?this.pprSearchForm.value.businesscontrol.id:"",
      "finyear":(this.pprSearchForm.value.finyear.finyer)?this.pprSearchForm.value.finyear.finyer:"",
      "bs_id": (this.pprSearchForm.value.bs_id.id)?this.pprSearchForm.value.bs_id.id:"",
      "cc_id": (this.pprSearchForm.value.cc_id.id)?this.pprSearchForm.value.cc_id.id:"",    
      "from_month":(this.pprSearchForm.value.frommonth.month_id)?this.pprSearchForm.value.frommonth.month_id:"",
      "to_month":(this.pprSearchForm.value.tomonth.month_id)?this.pprSearchForm.value.tomonth.month_id:"",     
      "branch_id": (this.pprSearchForm.value.branch_id.id)?this.pprSearchForm.value.branch_id.id:"",
      "sector_id":(this.pprSearchForm.value.sectorname)?this.pprSearchForm.value.sectorname.id:"",
      "business_flag": Number(this.pprSearchForm.value.year_term),
        }
      
    }else{
      Serach_data = {
        "year_term": (this.pprSearchForm.value.year_term)?this.pprSearchForm.value.year_term:"",
      "divAmount":(this.pprSearchForm.value.divAmount)?this.pprSearchForm.value.divAmount:"",
      "business_id":(this.pprSearchForm.value.businesscontrol.id)?this.pprSearchForm.value.businesscontrol.id:"",
      "finyear":(this.pprSearchForm.value.finyear.finyer)?this.pprSearchForm.value.finyear.finyer:"",
      "bs_id": (this.pprSearchForm.value.bs_id.id)?this.pprSearchForm.value.bs_id.id:"",
      "cc_id": (this.pprSearchForm.value.cc_id.id)?this.pprSearchForm.value.cc_id.id:"",    
      "from_month":(this.pprSearchForm.value.frommonth.month_id)?this.pprSearchForm.value.frommonth.month_id:"",
      "to_month":(this.pprSearchForm.value.tomonth.month_id)?this.pprSearchForm.value.tomonth.month_id:"",     
      "branch_id": (this.pprSearchForm.value.branch_id.id)?this.pprSearchForm.value.branch_id.id:"",
      "sector_id":(this.pprSearchForm.value.sectorname)?this.pprSearchForm.value.sectorname.id:"",
      
    }
  }
  
  this.report_level_Labels()
  
      // this.dataService.ppr_search(1,Serach_data)
      // .subscribe((results:any)=>{       
       
      //   this.incomes_data["income"] =results['data'][0] 
      //   console.log("income",this.incomes_data)
      // })
    
      // this.dataService.ppr_search(2,Serach_data)
      // .subscribe((results:any)=>{
      //   this.incomes_data["Hr"]=results['data'][0]
      //   let buheader = []
      //   console.log(results)
      //   if (!this.businessview && this.businessviewheader.length == 0) {
      //     const { name, Padding_left, Padding, tree_flag, expensegrp_id, amount_flag, ...eventData } = results['data'][0];
      //     buheader.push(eventData)
      //     console.log("buheader=>", buheader)
      //     let arr = buheader[0]
      //     console.log(arr)
      //     console.log(Object.keys(arr))
      //     this.businessviewheader = Object.keys(arr)
      //     console.log('2', this.businessviewheader)
      //     console.log(this.businessview)
      //     this.colspanlength = this.businessviewheader.length
      //     this.headerdata = this.businessviewheader
      //     console.log(this.headerdata)
      //   }

      //   console.log("Hr",this.incomes_data)
      // })
      // this.dataService.ppr_search(3,Serach_data)
      // .subscribe((results:any)=>{
        
      //   this.incomes_data["Expense"]=results['data'][0]
      //   console.log("expance",this.incomes_data)
      // })
 
   
    

  }

   ppr_chart(){
    if(this.pprSearchForm.value.finyear === '' || this.pprSearchForm.value.finyear === null || this.pprSearchForm.value.finyear === undefined){
      this.toastr.warning('', 'Please Select Finyear', { timeOut: 1500 });
      return false;
    }else{
      if (this.finy == undefined) {
        this.startyear = ''
        this.lastyear = ''
      } else {
        this.startyear = this.finy.slice(2, 4)
        this.lastyear = this.finy.slice(5, 9)
      }
    }
      if (this.pprSearchForm.value.year_term === '' || this.pprSearchForm.value.year_term === null || this.pprSearchForm.value.year_term === undefined) {
      this.toastr.warning('', 'Please Select Quarterly or Monthly', { timeOut: 1500 });
      return false;
    }else{
      let select_view = this.pprSearchForm.value.year_term
      if(select_view == "Quarterly"){
      this.Quarterly()
    }
      if(select_view == "Monthly"){
       this.Monthly()

       if( this.pprSearchForm.value.frommonth !="" ){               
       if(this.pprSearchForm.value.tomonth == null || this.pprSearchForm.value.tomonth == undefined || this.pprSearchForm.value.tomonth == ""){
        this.toastr.warning('', 'Please Select ToMonth', { timeOut: 1500 }); 
        return false
      }   else{
        this.frommonthsearch(this.pprSearchForm.value.frommonth)
        this.tomonthsearch(this.pprSearchForm.value.tomonth)
     }  
    }    
   }       
      if( select_view == "1"){  
       this.business_wise()
      }
    }
    if (this.pprSearchForm.value.divAmount == '' || this.pprSearchForm.value.divAmount == null || this.pprSearchForm.value.divAmount == undefined) {
      this.toastr.warning('', 'Please Select Amount', { timeOut: 1500 });
      return false;
    }else{
      let select_amt = this.pprSearchForm.value.divAmount
      if(select_amt == "L"){
          this.lakhs()
      }
      if(select_amt == "K"){
        this.thousands()
      }
    }
    if (this.pprSearchForm.value.sectorname == undefined || this.pprSearchForm.value.sectorname == '' || this.pprSearchForm.value.sectorname == null) {
      this.toastr.warning('', 'Please Select Sector', { timeOut: 1500 });
      return false;
    }else{
      let serctor = this.pprSearchForm.value.sectorname
      if(serctor == "sector"){

      }
    }
    this.ppr_report_search=true;
    if( this.pprSearchForm.value.branch_id == null){     
    this.pprSearchForm.value.branch_id = ""
   
    }
    if( this.pprSearchForm.value.businesscontrol == null || this.pprSearchForm.value.businesscontrol == undefined){
       this.pprSearchForm.value.businesscontrol=""
     
   
    }
    if(this.pprSearchForm.value.bs_id == null || this.pprSearchForm.value.bs_id == undefined){
       this.pprSearchForm.value.bs_id =""
      
    }
    if(this.pprSearchForm.value.cc_id == null || this.pprSearchForm.value.cc_id == undefined){
      this.pprSearchForm.value.cc_id=""
      
    }
    if(this.pprSearchForm.value.frommonth == null || this.pprSearchForm.value.frommonth == undefined){
       this.pprSearchForm.value.frommonth=""
      
    }
    if(this.pprSearchForm.value.tomonth == null || this.pprSearchForm.value.tomonth == undefined){
      this.pprSearchForm.value.tomonth = ""
      
    }

    this.tabledata = false;
this.tabcheck_ppr=false;
   this.ppr_report_search=false;
     this.Search_value = {
      "finyear" :(this.pprSearchForm.value.finyear)?this.pprSearchForm.value.finyear.finyer:"",
      "year_term":(this.pprSearchForm.value.year_term)?this.pprSearchForm.value.year_term:"",
      "divAmount":(this.pprSearchForm.value.divAmount)?this.pprSearchForm.value.divAmount:"",
      "sectorname":(this.pprSearchForm.value.sectorname)?this.pprSearchForm.value.sectorname.id:"",
      "sector_id": (this.pprSearchForm.value.sectorname)?this.pprSearchForm.value.sectorname.id:"",
      "business_id": (this.pprSearchForm.value.businesscontrol)?this.pprSearchForm.value.businesscontrol.id:"",
      "branch_id":(this.pprSearchForm.value.branch_id)?this.pprSearchForm.value.branch_id.id:"",
      "businesscontrol":(this.pprSearchForm.value.businesscontrol)?this.pprSearchForm.value.businesscontrol:"",
      "bs_id": (this.pprSearchForm.value.bs_id)?this.pprSearchForm.value.bs_id.id:"",
      "cc_id": (this.pprSearchForm.value.cc_id)?this.pprSearchForm.value.cc_id.id:"",
      "frommonth":(this.pprSearchForm.value.frommonth)?this.pprSearchForm.value.frommonth.month_id:"",
      "tomonth":(this.pprSearchForm.value.tomonth)?this.pprSearchForm.value.tomonth.month_id:"",     
      "bizname": (this.pprSearchForm.value.businesscontrol)?this.pprSearchForm.value.businesscontrol.name:"", 
    }
    const searchData = {
      "FinYear": this.pprSearchForm.value.finyear?.finyer || "",
      "YearTerm": this.pprSearchForm.value.year_term || "",
      "AmountIn": this.pprSearchForm.value.divAmount ? (this.pprSearchForm.value.divAmount === 'K' ? 'Thousand' : 'Lakh') : "",
      "Branch": this.pprSearchForm.value.branch_id?.name || "",
      "SectorID": this.pprSearchForm.value.sectorname?.name || "",
      "Business": this.pprSearchForm.value.businesscontrol?.name || "",
      "BS": this.pprSearchForm.value.bs_id?.name || "",
      "CC": this.pprSearchForm.value.cc_id?.name || "",
      "FromMonth": this.pprSearchForm.value.frommonth?.month || "",
      "ToMonth": this.pprSearchForm.value.tomonth?.month || "",
  };
    // this.finy = value.finyer
    let Serach_data
      if(!this.businessview){
        Serach_data = {
      
      "divAmount":(this.pprSearchForm.value.divAmount)?this.pprSearchForm.value.divAmount:"",
      "business_id":(this.pprSearchForm.value.businesscontrol.id)?this.pprSearchForm.value.businesscontrol.id:"",
      "finyear":(this.pprSearchForm.value.finyear.finyer)?this.pprSearchForm.value.finyear.finyer:"",
      "bs_id": (this.pprSearchForm.value.bs_id.id)?this.pprSearchForm.value.bs_id.id:"",
      "cc_id": (this.pprSearchForm.value.cc_id.id)?this.pprSearchForm.value.cc_id.id:"",    
      "from_month":(this.pprSearchForm.value.frommonth.month_id)?this.pprSearchForm.value.frommonth.month_id:"",
      "to_month":(this.pprSearchForm.value.tomonth.month_id)?this.pprSearchForm.value.tomonth.month_id:"",     
      "branch_id": (this.pprSearchForm.value.branch_id.id)?this.pprSearchForm.value.branch_id.id:"",
      "sector_id":(this.pprSearchForm.value.sectorname)?this.pprSearchForm.value.sectorname.id:"",
      "business_flag": Number(this.pprSearchForm.value.year_term),
        }
      
    }else{
      Serach_data = {
        "year_term": (this.pprSearchForm.value.year_term)?this.pprSearchForm.value.year_term:"",
      "divAmount":(this.pprSearchForm.value.divAmount)?this.pprSearchForm.value.divAmount:"",
      "business_id":(this.pprSearchForm.value.businesscontrol.id)?this.pprSearchForm.value.businesscontrol.id:"",
      "finyear":(this.pprSearchForm.value.finyear.finyer)?this.pprSearchForm.value.finyear.finyer:"",
      "bs_id": (this.pprSearchForm.value.bs_id.id)?this.pprSearchForm.value.bs_id.id:"",
      "cc_id": (this.pprSearchForm.value.cc_id.id)?this.pprSearchForm.value.cc_id.id:"",    
      "from_month":(this.pprSearchForm.value.frommonth.month_id)?this.pprSearchForm.value.frommonth.month_id:"",
      "to_month":(this.pprSearchForm.value.tomonth.month_id)?this.pprSearchForm.value.tomonth.month_id:"",     
      "branch_id": (this.pprSearchForm.value.branch_id.id)?this.pprSearchForm.value.branch_id.id:"",
      "sector_id":(this.pprSearchForm.value.sectorname)?this.pprSearchForm.value.sectorname.id:"",
      
    }
  }

  // this.SpinnerService.show()

let finyear_value_for_chart=this.pprSearchForm.value.finyear?.finyer??""
this.pprsharedservice.chartparam.next(this.Search_value)
this.pprsharedservice.chartshown.next(searchData)
this.pprsharedservice.finyear_data.next(finyear_value_for_chart)
this. report_chart=true;
  }

  table_header_close(){
    this.ppr_report_search=false;
  }

  monthToNumber: { [key: string]: number } = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  };
  NumberTomonth: { [key: number]: string } = {
    1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
    7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
  };
  gl_transaction(data1,data2,amt,page=1){
    this.expansionPanel.close()
    this.parms_val = data1
    this.month_val = data2
    this.amount_popup = amt
    this.transaction_gl = data1.name
    this.from_month_data = 4
    this.to_month = 3
    let gl_no = data1.glno
    let microsubcatcode = data1.microsubcatcode
    let gl_business_id = ''
    let gl_bs_code = ''
    let divAmount = 'A';
    let business_id = (this.pprSearchForm.value.businesscontrol.id)?this.pprSearchForm.value.businesscontrol.id:""
    let finyear = (this.pprSearchForm.value.finyear.finyer)?this.pprSearchForm.value.finyear.finyer:""
    let bs_code = (this.pprSearchForm.value.bs_id.microbscode)?this.pprSearchForm.value.bs_id.microbscode:""
    let cc_code = (this.pprSearchForm.value.cc_id.microcccode)?this.pprSearchForm.value.cc_id.microcccode:"" 
    let branch_id = (
      this.gl_transaction_from.value.branch_id_pop?.code === 6666 || 
      this.gl_transaction_from.value.branch_id_pop?.code === '6666' || 
      this.pprSearchForm.value.branch_id?.code === 6666 || 
      this.pprSearchForm.value.branch_id?.code === '6666'
  ) ? "" 
  : this.gl_transaction_from.value.branch_id_pop?.id ?? this.pprSearchForm.value.branch_id?.id ?? "";  
    let sector_id = (this.pprSearchForm.value.sectorname)?this.pprSearchForm.value.sectorname.id:""
    let flag = this.pprSearchForm.value.year_term == "1" ? 'Business' : this.pprSearchForm.value.year_term
    let Entry_crno = this.gl_transaction_from.value.entry_crno ? this.gl_transaction_from.value.entry_crno : ''
    let transactiondate = this.gl_transaction_from.value.transactiondate ? this.datepipe.transform(this.gl_transaction_from.value.transactiondate, "yyyy-MM-dd") : '';
    let supplier_id = this.gl_transaction_from.value.supplier_name ? this.gl_transaction_from.value.supplier_name.id : ''
    if(this.pprSearchForm.value.year_term == 'Quarterly'){
      if(data2 === 'Quarterly_1'){
        this.from_month_data = 4
        this.to_month = 6
      }else if(data2 === 'Quarterly_2'){
        this.from_month_data = 7
        this.to_month = 9
      }else if(data2 === 'Quarterly_3'){
        this.from_month_data = 10
        this.to_month = 12
      }else if(data2 === 'Quarterly_4'){
        this.from_month_data = 1
        this.to_month = 3
      }else{
        this.from_month_data = 4
        this.to_month = 3
      }
    }else if(this.pprSearchForm.value.year_term == 'Monthly'){
      if(data2 === 'YTD'){
        this.from_month_data = 4
        this.to_month = 3
      }else{
        const monthNumber = this.monthToNumber[data2] || null; 
        this.from_month_data = monthNumber
        this.to_month = monthNumber
      }
    }else{
      if(this.pprSearchForm.value.businesscontrol){
        gl_bs_code = this.subcat_bizdata.find(item => item.name === data2)?.code || null;
      }else{
        gl_business_id = this.subcat_bizdata.find(item => item.name === data2)?.id || null;
      }
      if(this.pprSearchForm.value.frommonth.month_id){
        this.from_month_data = this.pprSearchForm.value.frommonth.month_id
      }else{
        this.from_month_data = 4
      }
      if(this.pprSearchForm.value.tomonth.month_id){
        this.to_month = this.pprSearchForm.value.tomonth.month_id
      }else{
        this.to_month = 3
      }
    }
    this.SpinnerService.show()
    this.dataService.pprlevel_gltransaction(finyear,branch_id,this.from_month_data,this.to_month,gl_no,divAmount,cc_code,bs_code,business_id,sector_id,gl_business_id,gl_bs_code,flag,Entry_crno,transactiondate,supplier_id,microsubcatcode,page)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.gl_transaction_data = datas
        // this.amount_popup = results['tot_amount'];
        let dataPagination = results['pagination'];
        this.rec_count = results['count'];
        if (datas.length > 0) {
          this.has_next_pop = dataPagination.has_next;
          this.has_previous_pop = dataPagination.has_previous;
          this.presentpage_pop = dataPagination.index;
        } if (datas.length <= 0) {
          this.has_next_pop = false;
          this.has_previous_pop = false;
          this.presentpage_pop = 1;
          this.rec_count = 0
        }
      })
  }
  nextClick() {
    if (this.has_next_pop === true) {         
        this.gl_transaction(this.parms_val,this.month_val,this.amount_popup,this.presentpage_pop + 1)
      }
   
    }
  
  previousClick() {
    if (this.has_previous_pop === true) {      
      this.gl_transaction(this.parms_val,this.month_val,this.amount_popup,this.presentpage_pop - 1)
    }
  }

  // FE Download 
  


async downloadPDF() {
  // const doc = new jsPDF('p', 'pt', 'a4');

  // doc.setFont('helvetica', 'bold');
  // doc.setFontSize(14);
  // const headerText = 'PPR Report';
  // const pageWidth = doc.internal.pageSize.getWidth();
  // const textWidth = doc.getTextWidth(headerText);
  // const headerX = (pageWidth - textWidth) / 2;
  // doc.text(headerText, headerX, 15);

  // const searchData = {
  //     "Fin Year": this.pprSearchForm.value.finyear?.finyer || "",
  //     "Year Term": this.pprSearchForm.value.year_term || "",
  //     "Amount In": this.pprSearchForm.value.divAmount ? (this.pprSearchForm.value.divAmount === 'K' ? 'Thousand' : 'Lakh') : "",
  //     "Branch": this.pprSearchForm.value.branch_id?.name || "",
  //     "Sector ID": this.pprSearchForm.value.sectorname?.name || "",
  //     "Business": this.pprSearchForm.value.businesscontrol?.name || "",
  //     "BS": this.pprSearchForm.value.bs_id?.name || "",
  //     "CC": this.pprSearchForm.value.cc_id?.name || "",
  //     "From Month": this.pprSearchForm.value.frommonth?.month || "",
  //     "To Month": this.pprSearchForm.value.tomonth?.month || "",
  // };

  // let startY = 30;
  // doc.setFontSize(8);
  // Object.entries(searchData).forEach(([key, value]) => {
  //     if (value) {
  //         doc.setFont('helvetica', 'bold');
  //         doc.text(`${key}:`, 10, startY);
  //         doc.setFont('helvetica', 'normal');
  //         doc.text(value.toString(), 100, startY);
  //         startY += 12;
  //     }
  // });

  // startY += 10;

  // const table = document.getElementById('pprlevels') as HTMLTableElement;
  // if (!table) {
  //     console.error('Table not found!');
  //     return;
  // }

  // const tableData: any[] = [];
  // const tableHeaders: any[] = [];
  // let lastYellowHeader = ''; 

  // table.querySelectorAll('tr').forEach((row, rowIndex) => {
  //     const rowData: any[] = [];
  //     let skipRow = false;

  //     row.querySelectorAll('th, td').forEach((cell, cellIndex) => {
  //         const cellElement = cell as HTMLElement;
  //         const cellText = cell.textContent?.trim() || '';

  //         if (cellText.includes('Read More')) {
  //             skipRow = true;
  //             return;
  //         }

  //         const colspan = parseInt(cellElement.getAttribute('colspan') || '1', 10);
  //         const rowspan = parseInt(cellElement.getAttribute('rowspan') || '1', 10);

  //         let textColor = '#000000';
  //         let textAlign: 'left' | 'center' | 'right' = 'center';

  //         const paddingLeft = parseInt(window.getComputedStyle(cellElement).paddingLeft || '0', 10);
  //         const bgColor = window.getComputedStyle(cellElement).backgroundColor;

  //         if (bgColor === 'rgb(255, 255, 0)') {
  //             lastYellowHeader = cellText; 
  //         }

  //         if (paddingLeft === 10) {
  //             textColor = '#000000';
  //             textAlign = 'left';
  //         } else if (paddingLeft === 50) {
  //             textColor = '#c813d5';
  //             textAlign = 'left';
  //         } else if (paddingLeft === 75) {
  //             textColor = '#008000';
  //             textAlign = 'center';
  //         } else if (paddingLeft === 100) {
  //             textColor = '#0000FF';
  //             textAlign = 'right';
  //         }

  //         rowData.push({
  //             content: cellText,
  //             colSpan: colspan,
  //             rowSpan: rowspan,
  //             styles: {
  //                 fillColor: rowIndex === 0
  //                     ? '#00B050'
  //                     : this.rgbaToHex(cellElement.style.backgroundColor) || '#FFFFFF',
  //                 textColor: textColor,
  //                 fontStyle: cell.tagName === 'TH' ? 'bold' : 'normal',
  //                 cellPadding: 3,
  //                 minCellHeight: 8,
  //                 halign: textAlign,
  //                 valign: 'middle',
  //             }
  //         });
  //     });

  //     if (!rowData.some(cell => cell.content.trim())) {
  //         rowData[0].content = lastYellowHeader;
  //         rowData[0].styles.fillColor = '#FFFF00'; 
  //         rowData[0].styles.fontStyle = 'bold';
  //     }

  //     if (!skipRow) {
  //         if (rowIndex === 0) {
  //             tableHeaders.push(...rowData);
  //         } else {
  //             tableData.push(rowData);
  //         }
  //     }
  // });

  // const chunkSize = 10;
  // if(this.pprSearchForm.value.year_term == "1"){
  //   this.corebuz = true
  // }else{
  //   this.corebuz = true
  // }

  // if (this.corebuz) {
  //     const totalColumns = tableHeaders.length;
  //     for (let i = 0; i < totalColumns; i += chunkSize) {
  //         let a = i
  //         const chunkHeaders = tableHeaders.slice(i == 0 ? a+1 : i, i + chunkSize);
  //         chunkHeaders.unshift(tableHeaders[0]);
  //         const chunkData = tableData.map(row =>  row.length <= 2 ? row : [row[0], ...row.slice(i === 0 ? a + 1 : i, i + chunkSize)]
  //       );
        

  //         if (i > 0) {
  //             doc.addPage();
  //             startY = 30;
  //         }

  //         autoTable(doc, {
  //             head: [chunkHeaders],
  //             body: chunkData,
  //             startY: startY,
  //             theme: 'grid',
  //             styles: {
  //                 cellPadding: 2,
  //                 minCellHeight: 8,
  //                 fontSize: 8,
  //                 halign: 'left',
  //                 valign: 'middle',
  //             },
  //             margin: { left: 8, right: 8 },
  //             tableWidth: 'auto',
  //             headStyles: {
  //                 fillColor: '#4CAF50',
  //                 textColor: '#FFFFFF',
  //                 fontStyle: 'bold',
  //             },
  //             alternateRowStyles: { fillColor: '#f3f3f3' },
  //             columnStyles: {
  //                 0: { cellWidth: 'wrap' },
  //             },
  //         });
  //     }
  // } else {
  //     autoTable(doc, {
  //         head: [tableHeaders],
  //         body: tableData,
  //         startY: startY,
  //         theme: 'grid',
  //         styles: {
  //             cellPadding: 2,
  //             minCellHeight: 8,
  //             fontSize: 8,
  //             halign: 'left',
  //             valign: 'middle',
  //         },
  //         margin: { left: 8, right: 8 },
  //         tableWidth: 'auto',
  //         headStyles: {
  //             fillColor: '#4CAF50',
  //             textColor: '#FFFFFF',
  //             fontStyle: 'bold',
  //         },
  //         alternateRowStyles: { fillColor: '#f3f3f3' },
  //         columnStyles: {
  //             0: { cellWidth: 'wrap' },
  //         },
  //     });
  // }

  // doc.save('PPR_Report.pdf');
}





  
  rgbaToHex(rgba: string): string {
    const match = rgba.match(/\d+/g); // Extract numbers from rgba string
    if (!match || match.length < 3) return '#FFFFFF'; // Default white if invalid

    const [r, g, b] = match.map(Number); // Extract RGB values
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}
  



async downloadExcel() {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Extract search form data
    const searchData = {
      "Fin Year": this.pprSearchForm.value.finyear?.finyer || "",
      "Year Term": this.pprSearchForm.value.year_term || "",
      "Amount In": this.pprSearchForm.value.divAmount ? (this.pprSearchForm.value.divAmount === 'K' ? 'Thousand' : 'Lakh') : "",
      "Branch": this.pprSearchForm.value.branch_id?.name || "",
      "Sector ID": this.pprSearchForm.value.sectorname?.name || "",
      "Business": this.pprSearchForm.value.businesscontrol?.name || "",
      "BS": this.pprSearchForm.value.bs_id?.name || "",
      "CC": this.pprSearchForm.value.cc_id?.name || "",
      "From Month": this.pprSearchForm.value.frommonth?.month || "",
      "To Month": this.pprSearchForm.value.tomonth?.month || "",
    };

    const filteredSearchData = Object.entries(searchData)
      .filter(([_, value]) => value)
      .map(([key, value]) => [key, value]);

    let rowIndex = 2;
    worksheet.mergeCells(1, 1, 1, 5);
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = "PPR Report";
    titleRow.getCell(1).font = { bold: true, size: 16 };
    titleRow.getCell(1).alignment = { horizontal: "center" };
    filteredSearchData.forEach(([key, value]) => {
      const row = worksheet.getRow(rowIndex++);
      worksheet.mergeCells(row.number, 1, row.number, 2);
      row.getCell(1).value = { richText: [{ text: `${key}: `, font: { bold: true } }, { text: `${value}` }] };
      row.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
    });

    rowIndex++;
    const table = document.getElementById('pprlevels') as HTMLTableElement;
    const columnWidths: number[] = [];
    const computedStyles = new Map<HTMLElement, CSSStyleDeclaration>();

    let tableRowIndex = 0;
    table.querySelectorAll('tr').forEach((row) => {
      let shouldSkipRow = false;
      let isEmptyRow = true;
      const excelRow = worksheet.getRow(rowIndex + tableRowIndex);

      row.querySelectorAll('th, td').forEach((cell, colIdx) => {
        const cellText = Array.from(cell.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE)
          .map(node => node.textContent?.trim() || '')
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (cellText.includes("Read More")) {
          shouldSkipRow = true; // Skip row if it contains "Read More"
        }
        if (cellText) {
          isEmptyRow = false;
        }
      });

      if (shouldSkipRow || isEmptyRow) {
        return; // Skip empty rows or rows containing "Read More"
      }

      row.querySelectorAll('th, td').forEach((cell, colIdx) => {
        const htmlCell = cell as HTMLTableCellElement;
        const colspan = htmlCell.colSpan || 1;
        const rowspan = htmlCell.rowSpan || 1;
        const excelCell = excelRow.getCell(colIdx + 1);

        if (excelCell.value === null) {
          const cellText = Array.from(cell.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE)
            .map(node => node.textContent?.trim() || '')
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

          const numericValue = parseFloat(cellText);
          if (!isNaN(numericValue)) {
            excelCell.value = numericValue;
            excelCell.numFmt = '0.00';
          } else {
            excelCell.value = cellText;
          }

          const textLength = cellText.length;
          if (!columnWidths[colIdx] || textLength > columnWidths[colIdx]) {
            columnWidths[colIdx] = textLength;
          }
        }

        if (colspan > 1 || rowspan > 1) {
          worksheet.mergeCells(rowIndex + tableRowIndex, colIdx + 1, rowIndex + tableRowIndex + rowspan - 1, colIdx + colspan);
        }

        if (!computedStyles.has(htmlCell)) {
          computedStyles.set(htmlCell, window.getComputedStyle(htmlCell));
        }
        const computedStyle = computedStyles.get(htmlCell)!;

        excelCell.font = {
          size: 12,
          name: computedStyle.fontFamily,
          bold: computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight, 10) >= 700,
          italic: computedStyle.fontStyle === 'italic',
          underline: computedStyle.textDecoration.includes('underline') ? 'single' : undefined,
        };

        excelCell.alignment = {
          horizontal: computedStyle.textAlign as ExcelJS.Alignment['horizontal'],
          vertical: 'middle',
          wrapText: false,
        };

        excelCell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        const bgColor = computedStyle.backgroundColor;
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          excelCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: this.rgbToHex(bgColor) },
          };
        } else {
          excelCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF' },
          };
        }
        const borderColor = computedStyle.borderColor;
        if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent') {
          excelCell.border = {
            top: { style: 'thin', color: { argb: this.rgbToHex(borderColor) } },
            left: { style: 'thin', color: { argb: this.rgbToHex(borderColor) } },
            bottom: { style: 'thin', color: { argb: this.rgbToHex(borderColor) } },
            right: { style: 'thin', color: { argb: this.rgbToHex(borderColor) } },
          };
        }
        const textAlign = computedStyle.textAlign as ExcelJS.Alignment['horizontal'];
        const paddingLeft = parseInt(computedStyle.paddingLeft || '0', 10) / 5;
        const paddingRight = parseInt(computedStyle.paddingRight || '0', 10) / 5;
        excelCell.alignment = {
          horizontal: textAlign,
          vertical: 'middle',
          wrapText: false,
          indent: Math.round(Math.max(paddingLeft, paddingRight)),
        };
      });

      tableRowIndex++; // Only increment if row was valid
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellText = cell.value ? cell.value.toString() : '';
        const estimatedWidth = Math.ceil(cellText.length * 0.1) + 10;
        maxLength = Math.max(maxLength, estimatedWidth);
      });
      column.width = maxLength;
    });

    const columnA = worksheet.getColumn(1);
    let maxLength = 0;

    columnA.eachCell({ includeEmpty: true }, (cell) => {
      const cellText = cell.value ? cell.value.toString() : '';
      const estimatedWidth = cellText.length * 2;
      maxLength = Math.max(maxLength, estimatedWidth);
    });

    columnA.width = maxLength;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'PPR_Report.xlsx');
  } catch (error) {
    console.error('Error generating Excel file:', error);
  }
}

  private rgbToHex(color: string): string {
    if (color.startsWith('#')) {
        if (color.toUpperCase() === '#FFFF0045') return 'FFFF97';
        if (color.toUpperCase() === '#DDEFDD') return '00B050';
        return color.slice(1).toUpperCase();
    }
    if (color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
        return 'FFFFFF';
    }
    const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (!match) return '000000';
    const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(match[3], 10).toString(16).padStart(2, '0');

    const hexColor = `${r}${g}${b}`.toUpperCase();

    if (hexColor === 'FFFF00') return 'FFFF99';  
    if (hexColor === 'DDEFDD') return '00B050'; 

    return hexColor;
}

  supplier_drop() {
    let prokeyvalue: String = "";
    this.get_supplier(prokeyvalue);
    this.gl_transaction_from.get('supplier_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getsupplier(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplier_list = datas;
      })
  }

  private get_supplier(prokeyvalue) {
    this.dataService.getsupplier(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplier_list = datas;

      })
  }

  autocompletesupplierScroll() {
    this.has_nextbra = true
    this.has_previousbra = true
    this.currentpagebra = 1
    setTimeout(() => {
      if (
        this.matAutocompletesupp &&
        this.autocompleteTrigger &&
        this.matAutocompletesupp.panel
      ) {
        fromEvent(this.matAutocompletesupp.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletesupp.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletesupp.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletesupp.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletesupp.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.dataService.getsupplier(this.supplierContactInput.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.supplier_list = this.branchList.concat(datas);
                    if (this.supplier_list.length >= 0) {
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

  close_transaction(){
    this.gl_transaction_from.reset()
    this.gl_transaction_data = []
    this.amount_popup = 0.00
    this.rec_count = 0
    setTimeout(() => {
      this.padding()  
     }, 500);
  }

  padding(){
    document.body.style.paddingRight = '0px';
  }
  reset_pop(){
    this.gl_transaction_from.reset()
    this.gl_transaction(this.parms_val,this.month_val,this.amount_popup)
  }


    
}



export interface expenseListss {
  id: string;
  name: any;
}