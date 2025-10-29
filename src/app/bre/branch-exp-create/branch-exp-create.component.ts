import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators,FormArray } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { BreApiServiceService } from '../bre-api-service.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingService } from '../error-handling-service.service';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { BreShareServiceService } from '../bre-share-service.service'; 
import {PageEvent} from '@angular/material/paginator'
import { NotificationService } from 'src/app/service/notification.service';

const moment = _moment;
export interface Status {
  id: number;
  text: string;
}
export interface exptypelistss {
  id: string;
  expense_name: string;
}
export interface commoditylistss {
  id: string;
  text: string;
}
export interface branch{
  id:string;
  name:string;
  code:string;
}

export interface SupplierName {
  id: number;
  name: string;
}
export interface catlistss {
  id: any;
  name: string;
  code: any
}
export interface subcatlistss {
  id: any;
  name: string;
  code: string;
}
export interface bslistss {
  id: any;
  name: string;
  code: any
}
export interface cclistss {
  id: any;
  name: string;
  code: any
}
export interface hsnlistss {
  id: any;
  name: string;
  code: string;
}

export interface taxtypefilterValue {
  id: number;
  subtax: {id: any,name:any,glno:any};
  taxrate: number;
}

export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}
export interface approverListss {
  id: string;
  name: string;
  code : string
  limit: number;
  employee_id : any;
  designation :string;
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
  selector: 'app-branch-exp-create',
  templateUrl: './branch-exp-create.component.html',
  styleUrls: ['./branch-exp-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})

export class BranchExpCreateComponent implements OnInit {
  BranchExpCreateForm =true
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;
  SelectSupplierForm: FormGroup;
  expencecreate:FormGroup;
  brexpcolumns:FormGroup;
  exptypeCommodity : any
  default = true
  alternate = false
  suplist: any 
  isLoading:boolean=false;
  supplierNameData: any;
  selectsupplierlist: any;
  JsonArray = [];
  submitbutton = false;
  inputSUPPLIERValue = "";
  supplierindex:any
  supplierid:any
  supp:any 
  SupplierName:any 
  SupplierCode:any
  SupplierGSTNumber:any
  SupplierPANNumber:any
  Address:any
  line1:any
  line2:any
  line3:any
  City:any
  stateid:any
  statename:any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  @Output() linesChange = new EventEmitter<any>();
  commodityList: Array<commoditylistss>
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  branchList: Array<any>=[];
  has_branchnext:boolean=true;
  has_branchprevious:boolean=false;
  has_branchpresentpage:number=1;
  @ViewChild('exptype') matexpAutocomplete: MatAutocomplete;
  @ViewChild('exptypeInput') exptypeInput: any;
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild('cattype') matcatAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('branchref') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchidInput') branchidInput: any;
  @ViewChild('branchidInput') subInput: any;
  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('hsntype') mathsnAutocomplete: MatAutocomplete;
  @ViewChild('hsnInput') hsnInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('taxtype') mattactypeAutocomplete: MatAutocomplete;
  @ViewChild('taxtypeInput') taxtypeInput: any; comid :any;

  @ViewChild('brInput') brInput:any;
  @ViewChild('branchmatAuto') branchmatAuto: MatAutocomplete;
  brList : Array<branchListss>
  columnform:FormGroup;
  expenseTypeList : any
  statustype:Status[]=[{'id':1,'text':"Transactional Commodity"},
  {'id':2,'text':"Contractual Commodity"}
  ]
  checkedtds: boolean = false;
  checkedgst: boolean = false;
  expencetypecolumnlist=[];
  ccbsForm:FormGroup;
  allocationBSCCForm:FormGroup;
  paymentDetForm:FormGroup;
  paymentScheduleForm:FormGroup
  categoryNameData: Array<catlistss>;
  subcategoryNameData: Array<subcatlistss>;
  bsNameData: Array<bslistss>;
  ccNameData: Array<cclistss>;
  catid: any
  bssid: any
  hsnList: Array<hsnlistss>
  taxlist: any
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  brFormValid = false
  @ViewChild('ccbsclose') ccbsclose;
  @ViewChild('payclose') payclose;
  createdbyid: any
  
  approverList: Array<approverListss>;
  currentpageapp:any=1
  has_nextapp:boolean=true
  has_previousapp:boolean=true
  @ViewChild('appInput') appInput:any;
  @ViewChild('approver') matappAutocomplete: MatAutocomplete;

  @ViewChild('closedbuttons') closedbuttons;
  @Output() onSubmit = new EventEmitter<any>();
  recurring_day_list=[{'value' :1},{'value' :2},{'value' :3},{'value' :4},{'value' :5},{'value' :6},{'value' :7},{'value' :8},{'value' :9},{'value' :10},
                      {'value' :11},{'value' :12},{'value' :13},{'value' :14},{'value' :15},{'value' :16},{'value' :17},{'value' :18},{'value' :19},{'value' :20},
                      {'value' :21},{'value' :22},{'value' :23},{'value' :24},{'value' :25},{'value' :26},{'value' :27},{'value' :28}]
  monthFilter = (m: Moment | null): boolean => {
    const dateNum = (m || moment()).date();
    return dateNum <= 28;
  } 
  firstDetailAmount: any;
  constructor(private fb: FormBuilder, private toastr:ToastrService,private breapiservice:BreApiServiceService,private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService,public datepipe: DatePipe,private shareservice : BreShareServiceService,private notification:NotificationService ) { }

  ngOnInit(): void {
    const getToken = localStorage.getItem("sessionData")
    let tokendata = JSON.parse(getToken)

    this.createdbyid = tokendata.employee_id
    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']

    })
    this.expencecreate = this.fb.group({
      expense_type_id:[''],
      branch_id: [''],
      commodity_id: [''],
      is_gst: [''],
      supplier:[''],
      supplier_id:[''],
      payment_detail:[''],
      amount:[''],
      from_date:[''],
      to_date:[''],
      cc_code:[''],
      bs_code:[''],
      category_code:[''],
      subcategory_code:[''],
      recurring_date:[''],
      recurring_period:[''],
      hsn:[''],
      hsn_percentage:[''],
      is_tds:[''],
      suppliertaxtype:[''],

      
    })
    this.brexpcolumns = this.fb.group({})
    this.columnform = this.fb.group({})
    this.ccbsForm = this.fb.group({

      ccbsdtl: new FormArray([
      ])
    })
    this.allocationBSCCForm = this.fb.group({

      ccbsdtl: new FormArray([
      ])
    })
    this.paymentDetForm = this.fb.group({
      from_date:[''],
      to_date: [''],
      amount: [''],
      recurring_period: [''],
      recurring_date:[''],

    })

    this.paymentScheduleForm = this.fb.group({
      paydtl: new FormArray([
    ]),
    branch_id:[''],
    approvedby:[''],
    remarks:[''],
  
  })
    this.breapiservice.getexptypedropdown({},1).subscribe((results) => {
      this.expenseTypeList=results['data'].filter(x=>x.status ==1)
      console.log("expenseTypeList",this.expenseTypeList)
    })
    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);

    this.SelectSupplierForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.breapiservice.getsuppliernamescroll(this.suplist, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierNameData = datas;
      })

    this.getsuppliername(this.suplist, "");
    
    this.breapiservice.getAMBranchdropdown(1,'').subscribe(data=>{
      this.branchList=data['data'];
    });
    this.expencecreate.get('branch_id').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap((value:any)=>this.breapiservice.getAMBranchdropdown(1,value).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.branchList=data['data'];
    });

   
    this.gethsn('')
    this.getcommodity('');
    this.getRecurringperiod();
    this.expencecreate.get('expense_type_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        // console.log('inside tap')

      }),

      switchMap(value => this.breapiservice.getexptypedropdown(this.exptypeInput.nativeElement.value== '' ? {}:{'expense_name':this.exptypeInput.nativeElement.value},1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.expenseTypeList = datas;
     
    })

    this.expencecreate.get('hsn').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        // console.log('inside tap')

      }),

      switchMap(value => this.breapiservice.gethsnscroll(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.hsnList = datas;
     
    })
    this.getbranchrole();
  }
  showbranch = false
  showbranchdata = false
  branchrole: any
  branchroleid: any
  branchrolesidd: any
  roledata: any
  branchdata : any
  getbranchrole() {
    this.breapiservice.getbranchrole()
      .subscribe(result => {
        // if (result) {
        //   let roledata = result?.enable_ddl
        //   this.roledata = result?.enable_ddl
        //   if (roledata == false) {
        //     this.showbranch = false
        //     this.showbranchdata = true
        //     this.branchrole = result?.code+"-"+result?.branch_name
        //     this.branchroleid = result?.id
        //     this.branchdata ={ "id" : result?.id, "name": result?.branch_name,"code":result?.code}
        //     this.expencecreate.patchValue({
        //       branch_id: this.branchrole
        //     })
        //   } else {
            this.branchroleid = result?.id
            this.branchrole = result?.branch_name
            this.showbranch = true
            this.showbranchdata = false
            let datas = {
              "id": result?.id,
              "code": result?.code,
              "name": result?.branch_name
            }
            this.branchdata = datas
            
            this.expencecreate.patchValue({
              branch_id: datas
            })
        //  }
        // }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  public displayFnexptype(exptype?: exptypelistss): string | undefined {
    return exptype ? exptype.expense_name : undefined;
  }

  
 
  currentpageexp:any=1
  has_previousexp:any;
  has_nextexp:any= true
  exptypeScroll() {
    setTimeout(() => {
      if (
        this.matexpAutocomplete &&
        this.matexpAutocomplete &&
        this.matexpAutocomplete.panel
      ) {
        fromEvent(this.matexpAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matexpAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matexpAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matexpAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matexpAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextexp === true) {
                this.breapiservice.getexptypedropdown(this.exptypeInput.nativeElement.value == '' ? {} : {expense_name : this.exptypeInput.nativeElement.value}, this.currentpageexp + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.expenseTypeList.length >= 0) {
                      this.expenseTypeList = this.expenseTypeList.concat(datas);
                      this.has_nextexp = datapagination.has_next;
                      this.has_previousexp = datapagination.has_previous;
                      this.currentpageexp = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.text : undefined;
  }

  get commoditytype() {
    return this.expencecreate.get('commodity_id');
  }

  getcommodity(commoditykeyvalue) {
    this.breapiservice.getcommodityexp()
      .subscribe(results => {
        let datas = results["data"];
        this.commodityList = datas;

      })
  }

  recurringPeriodList : any
  getRecurringperiod() {
    this.breapiservice.getRecurringPeriod()
      .subscribe(results => {
        let datas = results["data"];
        this.recurringPeriodList = datas;
      })
  }

  PayDetailList : any
  getPayDetList() {
    this.breapiservice.getSupplierPayDet(this.supplierid)
      .subscribe(results => {
        let datas = results["data"];
        this.PayDetailList = datas;

      })
  }
  currentpagecom:any;
  has_previouscom:any;
  has_nextcom:any;
  commodityScroll() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.matcommodityAutocomplete &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.breapiservice.getcommodityscroll(this.commodityInput.nativeElement.value, this.currentpagecom + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.commodityList.length >= 0) {
                      this.commodityList = this.commodityList.concat(datas);
                      this.has_nextcom = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  public displayFnhsn(hsntype?: hsnlistss): string | undefined {
    return hsntype ? hsntype.code : undefined;
  }

  
  nohsnpercent: any
  nohsn: any
  gethsn(hsnkeyvalue) {
    this.breapiservice.gethsn(hsnkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
        console.log("hsnList", datas)
        this.nohsn =datas.filter(x=>x.id == 1)[0]
        this.nohsnpercent =+(datas.filter(x=>x.id == 1)[0].igstrate)

        this.expencecreate.patchValue({
          hsn: this.nohsn
        })
      })
  }

 hsnScroll() {
    setTimeout(() => {
      if (
        this.mathsnAutocomplete &&
        this.mathsnAutocomplete &&
        this.mathsnAutocomplete.panel
      ) {
        fromEvent(this.mathsnAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mathsnAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mathsnAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mathsnAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mathsnAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.breapiservice.gethsnscroll(this.hsnInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.hsnList.length >= 0) {
                      this.hsnList = this.hsnList.concat(datas);
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
  SelectSuppliersearch() {
    let searchsupplier = this.SelectSupplierForm.value;
    if (searchsupplier.code === "" && searchsupplier.panno === "" && searchsupplier.gstno === "") {
      this.getsuppliername("", "");
    }
    else {
      this.alternate = true;
      this.default = false;
      this.Testingfunctionalternate();
    }
  }
  successdata: any
  searchsupplier:any
  Testingfunctionalternate() {
    this.searchsupplier = this.SelectSupplierForm.value;
    this.breapiservice.getselectsupplierSearch(this.searchsupplier, 1)
      .subscribe(result => {
        if (result['data']?.length == 0) {
          if(this.searchsupplier.code != '' && this.searchsupplier.code != undefined && this.searchsupplier.code != null)
            this.notification.showError("Enter Valid Supplier Code.")
          if(this.searchsupplier.gstno != '' && this.searchsupplier.gstno != undefined && this.searchsupplier.gstno != null)
            this.notification.showError("Enter Valid GST Number.")
          if(this.searchsupplier.panno != '' && this.searchsupplier.panno != undefined && this.searchsupplier.panno != null)
            this.notification.showError("Enter Valid PAN Number.")
          
          this.dataclear()
          return false;
        }
        if (result['data']?.length > 0) {
          this.selectsupplierlist = result['data']
          console.log("this.searchsupplier?.gstno?.length",this.searchsupplier?.gstno?.length)
          if (this.searchsupplier?.gstno?.length == 15 || this.searchsupplier?.panno?.length == 10) {
            let supplierdata = {
              "id": this.selectsupplierlist[0]?.id,
              "name": this.selectsupplierlist[0]?.name
            }
            this.supplierid = supplierdata?.id
            this.SelectSupplierForm.patchValue({ name: supplierdata })
            this.getsuppView(supplierdata)
          }else{
           
            let supplierdata = {
              "id": this.selectsupplierlist[0]?.id,
              "name": this.selectsupplierlist[0]?.name
            }
            this.supplierid = supplierdata?.id
            this.SelectSupplierForm.patchValue({ name: supplierdata })
            this.getsuppView(supplierdata)
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  getsuppliername(id, suppliername) {
    this.breapiservice.getsuppliername(id, suppliername)
      .subscribe((results) => {
        let datas = results["data"];
        this.supplierNameData = datas;

      })

  }

  accno : any
  bankname : any
  ifsccode : any
  getsuppaydet(pay)
  {
    this.accno = pay.account_no
    this.bankname = pay.bank_id.name
    this.ifsccode = pay.branch_id.ifsccode
  }

  taxname : any
  ratename : any
  taxrate : any
  isexcempted : any
  threshold : any
  excemrate : any

  gettaxdet(tax)
  {
    this.taxname = tax?.subtax?.name
    this.ratename = tax?.taxrate?.name
    this.taxrate = tax?.taxrate?.rate
    this.isexcempted = tax?.isexcempted
    this.threshold = tax?.excemthrosold
    this.excemrate = tax?.excemrate

  }
  dataclear() {
    this.SelectSupplierForm.controls['gstno'].reset("")
    this.SelectSupplierForm.controls['code'].reset("")
    this.SelectSupplierForm.controls['panno'].reset("")
    this.SelectSupplierForm.controls['name'].reset("")

    this.SupplierName = "";
    this.SupplierCode = "";
    this.SupplierGSTNumber = "";
    this.SupplierPANNumber = "";
    this.Address = "";
    this.line1 = "";
    this.line2 = "";
    this.line3 = "";
    this.City = "";
    this.suplist = "";
    this.JsonArray = [];
    this.alternate = false
    this.default = true
    this.submitbutton = false;
  }

  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  numberOnlyandDotminus(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57) && ((charCode < 45 || charCode > 46))) {
      return false;
    }
    return true;
  }
  supplierScroll() {
    setTimeout(() => {
      if (
        this.matsupAutocomplete &&
        this.matsupAutocomplete &&
        this.matsupAutocomplete.panel
      ) {
        fromEvent(this.matsupAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsupAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsupAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsupAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsupAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.breapiservice.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.supplierNameData.length >= 0) {
                      this.supplierNameData = this.supplierNameData.concat(datas);
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
  public displayFn(Suppliertype?: SupplierName): string | undefined {
    return Suppliertype ? Suppliertype.name : undefined;
  }
  get Suppliertype() {
    return this.SelectSupplierForm.get('name');
  }
  public displaytest(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }

  getsuppView(data) {
    this.SpinnerService.show();

    this.breapiservice.getsupplierView(data.id)
      .subscribe(result => {
        this.SpinnerService.hide();

        let datas = result
        console.log("SUPPLIER",datas)
        this.supplierid = datas.id

        this.SupplierName = result?.name
        this.SupplierCode = result?.code;
        this.SupplierGSTNumber = result?.gstno;
        this.stateid = result.address_id?.state_id;
        this.SupplierPANNumber=result?.panno
        this.line1=result?.address_id?.line1
        // this.line2=result?.line2
        // this.line3=result?.line3
        this.City=result?.name
        this.submitbutton = true;
      })}
      autocompletebranchname(){
        console.log('second');
        setTimeout(()=>{
          if(this.matbranchAutocomplete && this.autocompleteTrigger && this.matbranchAutocomplete.panel){
            fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
              map(x=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            ).subscribe(
              x=>{
                const scrollTop=this.matbranchAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight=this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight=this.matbranchAutocomplete.panel.nativeElement.clientHeight;
                const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
                if(atBottom){
                 if(this.has_branchnext){
                   
                  this.breapiservice.getAMBranchdropdown( this.has_branchpresentpage+1,this.expencecreate.get('branch_id').value).subscribe((data:any)=>{
                     let dear:any=data['data'];
                     console.log('second');
                     let pagination=data['pagination']
                     this.branchList=this.branchList.concat(dear);
                     if(this.branchList.length>0){
                       this.has_branchnext=pagination.has_next;
                       this.has_branchprevious=pagination.has_previous;
                       this.has_branchpresentpage=pagination.index;
                     }
                   })
                 }
                }
              }
            )
          }
        })
      }
    
  
      branchScroll() {
        setTimeout(() => {
          if (
            this.matbranchAutocomplete &&
            this.matbranchAutocomplete &&
            this.matbranchAutocomplete.panel
          ) {
            fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.breapiservice.getbranchscroll(this.brInput.nativeElement.value, this.currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        if (this.brList.length >= 0) {
                          this.brList = this.brList.concat(datas);
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
    
      kyenbdata(event:any){
        let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
        console.log(d.test(event.key))
        if(d.test(event.key)==true){
          return false;
        }
        return true;
      }
      selectionChangeType(event) {
        console.log("event",event) 
        if(event.isUserInput && event.source.selected == true){
          if(event.source.value.text=='Transactional Commodity'){
            this.comid = 1 
          }
          if(event.source.value.text=='Contractual Commodity'){
            this.comid = 2
          }
        } 
      }
      public branchintreface(data?:branch):string | undefined{
        return data?data.code +' - '+data.name:undefined;
      }
      onTextChange(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        console.log('Input changed:', inputValue);
        this.chkFormValid()
      }
  chkFormValid()
  {
    this.brFormValid = true
    const brExpForm = this.expencecreate.value
    if(brExpForm.expense_type_id?.id == undefined || brExpForm.expense_type_id?.id == null || brExpForm.expense_type_id?.id == "")
    {
      this.brFormValid = false
    }
    else if(this.supplierid == undefined || this.supplierid == null || this.supplierid == "")
    {
      this.brFormValid = false
    }
    else if(this.checkedgst == true && (brExpForm.hsn?.id == undefined || brExpForm.hsn?.id == null || brExpForm.hsn?.id == ""))
    {
      this.brFormValid = false
    }
    else if(brExpForm.payment_detail == undefined || brExpForm.payment_detail == null || brExpForm.payment_detail == "")
    {
      this.brFormValid = false
    }
    else if(brExpForm.amount == undefined || brExpForm.amount == null || brExpForm.amount == "")
      {
        this.brFormValid = false
      }
    else if(brExpForm.branch_id?.id == undefined || brExpForm.branch_id?.id == null || brExpForm.branch_id?.id == "")
    {
      this.brFormValid = false
    }
    else if(brExpForm.commodity_id?.id == undefined || brExpForm.commodity_id?.id == null || brExpForm.commodity_id?.id == "")
    {
      this.brFormValid = false
    }
    else if(this.checkedtds == true && (brExpForm.suppliertaxtype?.id == undefined || brExpForm.suppliertaxtype?.id == null || brExpForm.suppliertaxtype?.id == ""))
    {
      this.brFormValid = false
    }
    else if(this.filearr.length <=0)
    {
      this.brFormValid = false
    }
    else
    {
      let j=0
      for (let i in this.brexpcolumns.value) 
      { 
        let cols = this.brexpcolumns.value
        let sss =cols[this.expencetypecolumnlist[j]['column_name']]
        console.log("ssssssss....",sss)
          if (this.brexpcolumns.value[i] == undefined || this.brexpcolumns.value[i] == null ||this. brexpcolumns.value[i] == "") {
            this.brFormValid = false
          }
          j++
        }   
      }
  }
  Branchcallingfunction()
      {
        this.expencecreate.controls['supplier'].patchValue(this.SupplierName)
        this.expencecreate.controls['supplier_id'].patchValue(this.supplierid)    
        this.getPayDetList();
        this.gettaxtype()
        this.accno = ""
        this.bankname = ""
        this.ifsccode = ""
        this.taxname = ""
        this.ratename = ""
        this.taxrate = ""
        this.isexcempted = ""
        this.threshold = ""
        this.excemrate = ""
        this.chkFormValid()
      }
  changeValuegst(value) {
      this.checkedgst = !value;
      console.log("this.checkedgst",this.checkedgst)
      if(this.checkedgst)
      {
        this.expencecreate.controls["hsn"].reset()
      }
      else
      {
        this.expencecreate.patchValue({hsn: this.nohsn})
      }
      this.chkFormValid()
    }
  changeValuetds(value) {
      this.checkedtds = !value;
      console.log("this.checkedtds",this.checkedtds)
      if(this.checkedtds && (this.supplierid =="" || this.supplierid == undefined || this.supplierid == null))
      {
        this.toastr.info("Please Select Supplier")
        return false
      }
      else if(! this.checkedtds)
      {
      this.expencecreate.patchValue({suppliertaxtype: ""})

      }
      this.chkFormValid()
  }

  hsnChange()
  {

  }
  vendorid: any  
  gettaxtype() {  
    this.breapiservice.getvendorid(this.supplierid)
      .subscribe(result => {
        if(result)
        {
          this.vendorid = result["data"][0].supplierbranch_id.vendor_id
          this.breapiservice.gettdstaxtype1(this.vendorid)
            .subscribe(results => {
              this.taxlist = results["data"]
            }) 
            this.checkedtds = false 
            this.expencecreate.patchValue({
              suppliertaxtype: "",
              is_tds: false,
            })
        }
      })
  }
  gettaxtypeScroll() {
    setTimeout(() => {
      if (
        this.mattactypeAutocomplete &&
        this.mattactypeAutocomplete &&
        this.mattactypeAutocomplete.panel
      ) {
        fromEvent(this.mattactypeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattactypeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattactypeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattactypeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattactypeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.breapiservice.gettdstaxtype1Scroll(this.vendorid, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.taxlist.length >= 0) {
                      this.taxlist = this.taxlist.concat(datas);
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

  public displayFnFilter(filterdata?: taxtypefilterValue | any): string | undefined {
    if(filterdata.subtax !== undefined )
    {
    return filterdata ? filterdata.subtax.name + " - " + filterdata.taxrate?.rate : undefined;
    }
    else
    {
      return filterdata
    }
  }

  expensetype : any
  exptypeCategory : any
  exptypeSubCategory : any
  brexpColdet1:any=[]
  brexpColdet2:any=[]
  brexpColdet3:any=[]
  getExpColumns(exp)
  {
           
  this.expencecreate.patchValue({
    branch_id: this.branchdata,
    hsn : this.nohsn,
    supplier: "",
    is_gst: false,
    payment_detail: "",
    commodity_id : "",
    is_tds: false,
    suppliertaxtype: "",
  })
  this.SupplierName=""
  this.supplierid = undefined
  this.checkedgst =false
  this.checkedtds = false 
  this.PayDetailList =undefined
  this.taxlist =undefined
  this.accno = ""
  this.bankname = ""
  this.ifsccode = ""
  this.taxname = ""
  this.ratename = ""
  this.taxrate = ""
  this.isexcempted = ""
  this.threshold = ""
  this.excemrate = ""
  this.brFormValid = false
  this.ccbsFormValid = false
  this.brexpcolumns = new FormGroup({})
  this.expencetypecolumnlist = []
  this.brexpColdet1=[]
  this.brexpColdet2=[]
  this.brexpColdet3=[]
  this.allocationBSCCForm.reset();
  this.ccbsbacks()
  this.SelectSupplierForm.reset();
  this.dataclear()
  this.supplierid = undefined

    this.expensetype = exp.expense_name
    this.exptypeCommodity = exp.commodity_id
    this.exptypeCategory = exp.category_code
    this.exptypeSubCategory = exp.subcategory_code
    this.addAllocccbsSection();
    this.brexpcolumns =new FormGroup({})
    this.breapiservice.expencecolumnget(exp.id).subscribe((results) => {
      let datas = results['data'];
    
       
      let collist=datas
      if(collist?.length >1)
      {
        let remcol = collist[0]
        delete collist[0]

        collist.push(remcol)
      }
      console.log("collist------",collist)


      this.expencetypecolumnlist= []
      for(let i =0 ;i<collist.length ;i++)
      {
        if(collist[i] != undefined)
        {
          this.expencetypecolumnlist.push(collist[i])
        }
      }
      console.log("getenpencetypedata",this.expencetypecolumnlist)
      for(let i=0;i<this.expencetypecolumnlist?.length;i++)
      {
        this.brexpcolumns.addControl(this.expencetypecolumnlist[i]['column_name'], new FormControl(''));
        console.log("this.brexpcolumns------",this.brexpcolumns.value)
      }

      for(let i=0; i<this.expencetypecolumnlist?.length;i++)
      {
        if(i <= 4)
        {
          this.brexpColdet1.push(this.expencetypecolumnlist[i])
        }
        if(i > 4 && i <= 9)
        {
          this.brexpColdet2.push(this.expencetypecolumnlist[i])
        }
        if(i > 9 && i <= 14)
        {
          this.brexpColdet3.push(this.expencetypecolumnlist[i])
        }
      }
      console.log("is.brexpColdet1-->>",this.brexpColdet1)
      console.log("is.brexpColdet2-->>",this.brexpColdet2)
      console.log("is.brexpColdet3-->>",this.brexpColdet3)
    })

    this.chkFormValid()
  }
  getExpColumnsnew(exp)
  {
    this.breapiservice.expencecolumnget(exp.id).subscribe((results) => {
      let datas = results;
      this.expencetypecolumnlist=datas['data']
      console.log("getenpencetypedata",this.expencetypecolumnlist)

      const columnsArray = this.expencecreate.get("columns") as FormArray;

      for(let i=0;i<this.expencetypecolumnlist?.length;i++)
      {       
        columnsArray.controls.push(this.expencetypecolumnlist[i]['column_name'], new FormControl(''));
        console.log("columnsArray",this.expencecreate.get("columns"))
      }
    })

    this.chkFormValid()
  }
  addccbsSection() {
 
    const control = <FormArray>this.ccbsForm.get('ccbsdtl');
    control.push(this.ccbsdetail());
  }
  
  showCCBS = false
  getCCBS(i)
  {
    if(!this.ccbsSubmit)
    {
      this.allocationBSCCForm.get('ccbsdtl')['controls'][i].get('category_code').setValue(this.exptypeCategory)
      this.allocationBSCCForm.get('ccbsdtl')['controls'][i].get('subcategory_code').setValue(this.exptypeSubCategory)
      this.allocationBSCCForm.get('ccbsdtl')['controls'][i].get('glno').setValue(this.exptypeSubCategory?.glno)
      this.allocationBSCCForm.get('ccbsdtl')['controls'][i].get('ccbspercentage').setValue("100")
    }
  }

  showccbs()
  {
    this.showCCBS = true

  }
  addAllocccbsSection() {
 
    const control = <FormArray>this.allocationBSCCForm.get('ccbsdtl');
    control.push(this.ccbsdetail());
    this.getCCBS(this.allocationBSCCForm.value.ccbsdtl.length-1)
  }
  removeccbsSection(i) {

    const control = <FormArray>this.ccbsForm.get('ccbsdtl');
    control.removeAt(i);

  }

  removeAllocccbsSection(i) {

    const control = <FormArray>this.allocationBSCCForm.get('ccbsdtl');
    control.removeAt(i);

  }

previousCharCode : any =0
charCode : any = 0
getCharCode(e)
{
  this.previousCharCode = this.charCode
  this.charCode = (e.which) ? e.which : e.keyCode;
}

  ccbsdetail() {
    let group = new FormGroup({
      id: new FormControl(),
      branch_exp_id: new FormControl(),    
      category_code: new FormControl(''),
      subcategory_code: new FormControl(''),
      cc_code: new FormControl(''),
      bs_code: new FormControl(''),
      code: new FormControl(),
      ccbspercentage: new FormControl("100"),
      glno: new FormControl(),
      remarks: new FormControl(''),
      amount: new FormControl(0.0),   
    })
    group.get('category_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.breapiservice.getcategoryscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.categoryNameData = datas;
      this.linesChange.emit(this.allocationBSCCForm.value['ccbsdtl']);
    })

  // group.get('subcategory_code').valueChanges
  //   .pipe(
  //     debounceTime(100),
  //     distinctUntilChanged(),
  //     tap(() => {
  //       this.isLoading = true;
  //     }),
  //     switchMap(value => this.breapiservice.getsubcategoryscroll(this.catid, value, 1)
  //       .pipe(
  //         finalize(() => {
  //           this.isLoading = false
  //         }),
  //       )
  //     )
  //   )
  //   .subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.subcategoryNameData = datas;

  //  })

   group.get('bs_code').valueChanges
   .pipe(
     debounceTime(100),
     distinctUntilChanged(),
     tap(() => {
       this.isLoading = true;
     }),
     switchMap(value => this.breapiservice.getbsscroll(value, 1)
       .pipe(
         finalize(() => {
           this.isLoading = false
         }),
       )
     )
   )
   .subscribe((results: any[]) => {
     let datas = results["data"];
     this.bsNameData = datas;

  })
  group.get('cc_code').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.breapiservice.getccscroll(this.bssid, value, 1)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.ccNameData = datas;

 })

    return group
  }

  alloccbsdetail() {
    let group = new FormGroup({
      id: new FormControl(),    
      branch_exp_id: new FormControl(),    
      category_code: new FormControl(),
      subcategory_code: new FormControl(),
      cc_code: new FormControl(),
      bs_code: new FormControl(),
      code: new FormControl(),
      ccbspercentage: new FormControl("100"),
      glno: new FormControl(''),
      remarks: new FormControl(''),
      amount: new FormControl(0.0),   
    })
    group.get('category_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.breapiservice.getcategoryscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.categoryNameData = datas;
      this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
    })

  group.get('subcategory_code').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.breapiservice.getsubcategoryscroll(this.catid, 1, value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.subcategoryNameData = datas;

    })
    return group
  }
  getbsdropdown(){
    this.getbs('')
  }
   getccbsSections(form) {
  
    return form.controls.ccbsdtl.controls;
  }
  getAllocccbsSections(form) {
  
    return form.controls.ccbsdtl.controls;
  }
  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.code : undefined;
  }

  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.code : undefined;
  }
  getcat(catkeyvalue) {
  
    this.breapiservice.getcat(catkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryNameData = datas;
        this.catid = datas.id;


      })
  }

  getsubcat(id, subcatkeyvalue) {
    this.breapiservice.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryNameData = datas;


      })
  }

  cid(data, subcat="",i) {
    this.catid = data['id'];
    this.ccbsForm.get('ccbsdtl')['controls'][i].get('subcategory_code').setValue('')
    // this.ccbsForm.get('debitdtl')['controls'][i].get('glno').setValue('')
   
    this.getsubcat(this.catid, subcat);
  }
  cidAlloc(data, subcat="",i) {
    this.catid = data['id'];
    this.allocationBSCCForm.get('ccbsdtl')['controls'][i].get('subcategory_code').setValue('')
    // this.allocationBSCCForm.get('ccbsdtl')['controls'][i].get('glno').setValue('')
   
    this.getsubcat(this.catid, subcat);
  }

  categoryScroll() {
    setTimeout(() => {
      if (
        this.matcatAutocomplete &&
        this.matcatAutocomplete &&
        this.matcatAutocomplete.panel
      ) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                
                this.breapiservice.getcategoryscroll('', this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];  
                    let datapagination = results["pagination"];
                    if (this.categoryNameData.length >= 0) {
                      this.categoryNameData = this.categoryNameData.concat(datas);
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
  subcategoryScroll() {
    setTimeout(() => {
      if (
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete.panel
      ) {
        fromEvent(this.matsubcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.breapiservice.getsubcategoryscroll(this.catid, this.currentpage + 1, '')
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.subcategoryNameData.length >= 0) {
                      this.subcategoryNameData = this.subcategoryNameData.concat(datas);
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

  getGLNumber(data, index) {
    this.allocationBSCCForm.get('ccbsdtl')['controls'][index].get('glno').setValue(data.glno)
  }
  getbs(bskeyvalue) {
    this.breapiservice.getbs(bskeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsNameData = datas;
        this.catid = datas.id;
       
      })
  }
  bsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.matbsAutocomplete &&
        this.matbsAutocomplete.panel
      ) {
        fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.breapiservice.getbsscroll('', this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.bsNameData.length >= 0) {
                      this.bsNameData = this.bsNameData.concat(datas);
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
  bsidd: any

  bsid(data, code) {
    this.bssid = data['id'];
    this.bsidd = code;
    this.getcc(this.bssid, "");
  }
  public displayccFn(cctype?: cclistss): string | undefined {
    return cctype ? cctype.name : undefined;
  }

  ccid: any;
  getcc(bssid, cckeyvalue) {
    this.breapiservice.getcc(bssid, cckeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccNameData = datas;
        this.ccid = datas.id;

      })

  }

  ccScroll() {
    setTimeout(() => {
      if (
        this.matccAutocomplete &&
        this.matccAutocomplete &&
        this.matccAutocomplete.panel
      ) {
        fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.breapiservice.getccscroll(this.bssid, this.ccInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.ccNameData.length >= 0) {
                      this.ccNameData = this.ccNameData.concat(datas);
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
  deleteccbs(section, ind) {
    let id = section.value.id

   
      this.removeccbsSection(ind)
    
  }
  ccbsdata : any
  ccbsFormValid = false
  ccbsSubmit = false
  ccbsform() {
    this.ccbsFormValid = true

    this.ccbsdata = this.allocationBSCCForm.value.ccbsdtl;
    let percent = this.ccbsdata.map(x => Number(x.ccbspercentage))
    let sumpercent = percent.reduce((a,b) => a+b, 0)
   
    if(sumpercent != 100)
    {
      this.ccbsFormValid = false
      this.toastr.info("Sum of CCBS Percentage should be 100")
      return false
    }
    for(let i= 0; i< this.ccbsdata.length ;i++)
    {
      if(this.ccbsdata[i]?.category_code?.code == undefined || this.ccbsdata[i]?.category_code?.code == null || this.ccbsdata[i]?.category_code?.code == "")
      {
        this.ccbsFormValid = false
        this.toastr.info("Please Select Category Code")
        return false
      }
      else if(this.ccbsdata[i]?.subcategory_code?.code == undefined || this.ccbsdata[i]?.subcategory_code?.code == null || this.ccbsdata[i]?.subcategory_code?.code == "")
      {
        this.ccbsFormValid = false
        this.toastr.info("Please Select Sub Category Code")
        return false
      }
      else if(this.ccbsdata[i]?.bs_code?.code == undefined || this.ccbsdata[i]?.bs_code?.code == null || this.ccbsdata[i]?.bs_code?.code == "")
      {
        this.ccbsFormValid = false
        this.toastr.info("Please Select BS Code")
        return false
      }
      else if(this.ccbsdata[i]?.cc_code?.code == undefined || this.ccbsdata[i]?.cc_code?.code == null || this.ccbsdata[i]?.cc_code?.code == "")
      {
        this.ccbsFormValid = false
        this.toastr.info("Please Select CC Code")
        return false
      }
     
    }
    
    this.ccbsSubmit =true

  }

  ccbsbacks() {
    const ccbsdata = this.ccbsForm.value.ccbsdtl;
  
    let ccbscontrol = this.ccbsForm.controls["ccbsdtl"] as FormArray;
    ccbscontrol.clear()
  }

  deleteallocccbs(section, ind) {
    let id = section.value.id

   
      this.removeAllocccbsSection(ind)
    
  }
  characterandnumberonly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode >90)  && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57)){ 
    return false;
    }
    return true;
  }
  public displaybsFn(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }
  ccidd: any
  cccodeid: any
  getccdata(code, id) {
    this.ccidd = code
    this.cccodeid = id

  }

  fromDate : any
  todateEnab = false
  fromdateChange()
  {
    if(this.paymentDetForm.value.from_date !=undefined && this.paymentDetForm.value.from_date != null && this.paymentDetForm.value.from_date != "")
      {
        this.fromDate = this.paymentDetForm.value.from_date 
        this.todateEnab =true
      }
    else
    {
      this.todateEnab =false
    }
    this.chkPayFormValid()
  }
  payFormValid = false
  chkPayFormValid()
  {
    this.payFormValid = true
    const payForm = this.paymentDetForm.value
    if(payForm.from_date == undefined || payForm.from_date == null || payForm.from_date == "")
    {
      this.payFormValid = false
    }
    else if(payForm.to_date == undefined || payForm.to_date == null || payForm.to_date == "")
    {
      this.payFormValid = false
    }
    else if(payForm.amount == undefined || payForm.amount == null || payForm.amount == "")
    {
      this.payFormValid = false
    }
    else if(payForm.recurring_period == undefined || payForm.recurring_period == null || payForm.recurring_period == "")
    {
      this.payFormValid = false
    }
    else if(payForm.recurring_period !=1 && (payForm.recurring_date == undefined || payForm.recurring_date == null || payForm.recurring_date == ""))
    {
      this.payFormValid = false
    }

    const value = this.expencecreate.value.amount
    const amounts = this.expencecreate.get('amount')?.value
    

    this.paymentDetForm.patchValue({amount:amounts})
  }
  isPaymentSchpage: boolean = false;
  presentpagePaymentSch: number = 1;
  length_PaymentSch = 0
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons:boolean=true;
  recurfrom : any
  recurto :any
  recurCalc = false
  is_submit:boolean = false
  split_amnt:any
  addedAmount:number = 0
  paymentSchedule()
  {
    this.split_amnt = 0;
    this.addedAmount = 0;
    // debugger
    let f_date = this.datepipe.transform(this.paymentDetForm.value.from_date,'yyyy-MM-dd')
    let t_date = this.datepipe.transform(this.paymentDetForm.value.to_date,'yyyy-MM-dd')
    if(f_date === t_date){
      this.notification.showError("From Date and To Date cannot be same!")
      return
    }
    let ccbsdata =[]
    for(let i=0; i<this.allocationBSCCForm.value.ccbsdtl.length; i++)
    {
      let data={
        "category_code": this.allocationBSCCForm.value.ccbsdtl[i].category_code.code,
        "subcategory_code": this.allocationBSCCForm.value.ccbsdtl[i].subcategory_code.code,
        "bs_code": this.allocationBSCCForm.value.ccbsdtl[i].bs_code.name,
        "cc_code": this.allocationBSCCForm.value.ccbsdtl[i].cc_code.name,
        "bs_cc_percentage": this.allocationBSCCForm.value.ccbsdtl[i].ccbspercentage
          }
      ccbsdata.push(data)
    }
    let data ={
      "from_date":this.datepipe.transform(this.paymentDetForm.value.from_date,'yyyy-MM-dd'),
      "to_date":this.datepipe.transform(this.paymentDetForm.value.to_date,'yyyy-MM-dd'),
      "recurring_date":this.paymentDetForm.value.recurring_period == 1 ? 1 :this.paymentDetForm.value.recurring_date,
      "recurring_period":this.paymentDetForm.value.recurring_period,
      "amount":Number(this.paymentDetForm.value.amount),
      "data" : ccbsdata
    }

    this.SpinnerService.show()
    this.breapiservice.getPaymentSchedule(data, this.presentpagePaymentSch).subscribe((results) => {
    this.SpinnerService.hide()
    if(results.code != undefined){
        this.toastr.error(results.description,results.code)      
      }
      else
      {
        this.is_submit = true;
        this.recurCalc = true

        this.brexpSubmitEnab = true

        this.paySchedule = results['data']
        // console.log("payment schedule",this.paySchedule[0].detail_amount)
        this.firstDetailAmount = this.paySchedule[0][0].detail_amount;

        this.length_PaymentSch=results['count'];
        this.presentpagePaymentSch = results['pagination']?.index;
        if(this.paySchedule[0].length>0){
          for(let i=0;i<this.paySchedule[0].length;i++){
            // let amount = 0;
            this.addedAmount+=Number(this.paySchedule[0][i].amount)
            console.log('new amount',this.addedAmount) 
          }
        }
        // this.split_amnt = this.paySchedule[0][0].amount
        this.split_amnt = this.addedAmount
        console.log('ccbs amount',this.split_amnt)
        this.isPaymentSchpage = true
        this.recurfrom  = undefined
        this.recurto = undefined
        
      }
    })
  }

  pageIndexPayment =0
  pageSize_paymentSch=10;
  handlePageEventSchedule(event: PageEvent) {
      this.length_PaymentSch = event.length;
      this.pageSize_paymentSch = event.pageSize;
      this.pageIndexPayment = event.pageIndex;
      this.presentpagePaymentSch=event.pageIndex+1;
      this.paymentSchedule()
      
    }

  paySchedule : any
  brexpSubmitEnab = false
  branch_exp_id : any
  // brexpcreate()
  // {
  //   let data ={data:[{
  //     "expense_type_id":this.expencecreate.value.expense_type_id.id,
  //     "supplier_id":this.supplierid,
  //     "branch_id":this.expencecreate.value.branch_id?.id,
  //     "from_date":this.datepipe.transform(this.paymentDetForm.value.from_date ,'yyyy-MM-dd'),
  //     "to_date":this.datepipe.transform(this.paymentDetForm.value.to_date,'yyyy-MM-dd'),
  //     "cc_code":this.allocationBSCCForm.value.ccbsdtl[0].cc_code?.code,
  //     "bs_code":this.allocationBSCCForm.value.ccbsdtl[0].bs_code?.code,
  //     "category_code":this.allocationBSCCForm.value.ccbsdtl[0].category_code?.code,
  //     "subcategory_code":this.allocationBSCCForm.value.ccbsdtl[0].subcategory_code?.code,
  //     "recurring_date":this.datepipe.transform(this.paymentDetForm.value.from_date,'yyyy-MM-dd'),
  //     "recurring_period":this.paymentDetForm.value.recurring_period,
  //     "hsn": this.checkedgst ? this.expencecreate.value.hsn?.code : this.nohsn?.code,
  //     "hsn_percentage": this.checkedgst ? this.expencecreate.value.hsn?.igstrate : this.nohsnpercent,
  //     "is_tds":this.expencecreate.value.is_tds == true ? 1 :0,
  //     "tax_section":this.expencecreate.value.suppliertaxtype?.subtax?.id,
  //     "amount":this.paymentDetForm.value.amount,
  //     "paymode_type": this.expencecreate.value.payment_detail?.paymode_id?.id
  // }]}
  //   console.log("data....-------", data);

   
  //   this.breapiservice.branchexpcreate(data).subscribe((results) => {
  //     this.SpinnerService.show();
  //     console.log("results",results)
  //     if(results.code != undefined){
  //       this.SpinnerService.hide();
  //       this.toastr.error(results.description,results.code)        
  //     }
  //     else {
  //       this.branch_exp_id =results[0].id
  //       let dtldata = {
  //         "data":
  //         [
  //           {
  //             "branch_exp_id":this.branch_exp_id,
  //             "deatail_status":1,
  //             "remarks":this.paymentDetForm.value.remarks ,
  //             "from_date":this.datepipe.transform(this.paymentDetForm.value.from_date ,'yyyy-MM-dd'),
  //             "to_date":this.datepipe.transform(this.paymentDetForm.value.to_date ,'yyyy-MM-dd'),
  //             "recurring_period":this.paymentDetForm.value.recurring_period,
  //             "recurring_date":this.datepipe.transform(this.paymentDetForm.value.recurring_date,'yyyy-MM-dd'),
  //             "amount":this.paymentDetForm.value.amount
  //         } 
  //         ] 
  //     }
  //       this.breapiservice.branchexpdtlcreate(dtldata).subscribe((results) => {
  //         console.log("detail results",results)
  //         if(results.code != undefined){
  //       this.toastr.error(results.description,results.code)        
  //         }
  //         else
  //         {
  //             this.paySchedule = results['data']
  //         }
  //       })

  //       let ccbsform = this.allocationBSCCForm.value.ccbsdtl;

  //       for(let i=0; i< ccbsform.length ; i++)
  //       {
  //         ccbsform[i].branch_exp_id = this.branch_exp_id
  //         ccbsform[i].amount = this.paymentDetForm.value.amount
  //         delete ccbsform[i].id
  //         ccbsform[i].category_code = ccbsform[i].category_code.code
  //         ccbsform[i].subcategory_code = ccbsform[i].subcategory_code.code
  //         ccbsform[i].cc_code = ccbsform[i].cc_code.code
  //         ccbsform[i].bs_code = ccbsform[i].bs_code.code

  //       }

  //       this.breapiservice.branchexpCCcreate({data:ccbsform}).subscribe((results) => {
  //         if(results.code != undefined){
  //       this.toastr.error(results.description,results.code)        
  //         }
  //       })
  //       let columndetail:any =[]
  //       let j=0
  //       for(let i in this.brexpcolumns.value)
  //       {
          
  //         let col ={
  //                 "expense_type_id" : this.expencecreate.value.expense_type_id.id,
  //                 "expense_no_id" : this.branch_exp_id, 
  //                 "column_id" : this.expencetypecolumnlist[j].id,
  //                 "column_name" : this.expencetypecolumnlist[j].column_name,
  //                 "column_value" : this.expencetypecolumnlist[j].column_type_id ==2 ? (this.datepipe.transform(this.brexpcolumns.value[i],'yyyy-MM-dd')) : this.brexpcolumns.value[i] 
  //                 }
  //                 columndetail.push(col)
  //                 j++
  //       }
  //       this.breapiservice.branchexpTranscreate({data:columndetail}).subscribe((results) => {
  //           if(results.code != undefined){
  //       this.toastr.error(results.description,results.code)      
  //           }
  //       })

      
  //       this.SpinnerService.hide()
       
  //     }
  //   },
  //   (error)=>{  
  //     this.SpinnerService.hide();
  //     this.toastr.warning(error)
  //   });
  // }

deletePayment()
{
  this.is_submit = false
  this.paySchedule = []
  this.payFormValid =false
  this.pageIndexPayment =0
  this.length_PaymentSch=0
  this.presentpagePaymentSch =1
  this.paymentDetForm.controls['from_date'].reset()
  this.paymentDetForm.controls["to_date"].reset()
  this.paymentDetForm.controls['amount'].reset()
  this.paymentDetForm.controls["recurring_period"].reset()
  this.paymentDetForm.controls["recurring_date"].reset()
  this.brexpSubmitEnab = false

}


// uploadFile:any={};
// getfiledetails(e) {
//   this.uploadFile ={}
//    for (var i = 0; i < e.target.files.length; i++) {
//     this.uploadFile.push(e.target.files[i])
//   }
// }

fileback() {
  this.closedbuttons.nativeElement.click();
}

showimageHeaderPreview: boolean = false
showimageHeaderPreviewPDF: boolean = false
jpgUrls: any
pdfurl: any
filepreview(files) {
  let stringValue = files.name.split('.')
  if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
    stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
    const reader: any = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = (_event) => {
    this.jpgUrls = reader.result
    const newTab = window.open();
    newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
    newTab.document.close();
    }
  }
  if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
    const reader: any = new FileReader();
    reader.onload = (_event) => {
      const fileData = reader.result;
      const blob = new Blob([fileData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
    reader.readAsArrayBuffer(files);
  }
  if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
    stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
    this.showimageHeaderPreview = false
    this.showimageHeaderPreviewPDF = false
  }
}

brexpSubmitForm()
{
  if(this.paymentScheduleForm.value.approvedby?.id == undefined || this.paymentScheduleForm.value.approvedby?.id == null || this.paymentScheduleForm.value.approvedby?.id == '')
  {
    this.toastr.error("Please Choose Approver")
    return false
  }
  else if(this.paymentScheduleForm.value.remarks == undefined || this.paymentScheduleForm.value.remarks == null || this.paymentScheduleForm.value.remarks == '')
  {
    this.toastr.error("Please Enter Remarks")
    return false
  }

  let data =[{
    "expense_type_id":this.expencecreate.value.expense_type_id.id,
    "supplier_id":this.supplierid,
    "branch_id":this.expencecreate.value.branch_id?.id,
    "from_date":this.datepipe.transform(this.paymentDetForm.value.from_date ,'yyyy-MM-dd'),
    "to_date":this.datepipe.transform(this.paymentDetForm.value.to_date,'yyyy-MM-dd'),
    "cc_code":this.allocationBSCCForm.value.ccbsdtl[0].cc_code?.code,
    "bs_code":this.allocationBSCCForm.value.ccbsdtl[0].bs_code?.code,
    "category_code":this.allocationBSCCForm.value.ccbsdtl[0].category_code?.code,
    "subcategory_code":this.allocationBSCCForm.value.ccbsdtl[0].subcategory_code?.code,
    "recurring_date": this.paymentDetForm.value.recurring_period == 1 ? 1 :this.paymentDetForm.value.recurring_date,
    "recurring_period":this.paymentDetForm.value.recurring_period,
    "hsn": this.checkedgst ? this.expencecreate.value.hsn?.code : this.nohsn?.code,
    "hsn_percentage": this.checkedgst ? this.expencecreate.value.hsn?.igstrate : this.nohsnpercent,
    "is_tds":this.expencecreate.value.is_tds == true ? 1 :0,
    "tax_section":this.expencecreate.value.suppliertaxtype?.subtax?.id,
    "amount":Number(this.paymentDetForm.value.amount),
    "paymode_type": this.expencecreate.value.payment_detail?.paymode_id?.id,
    "file_key": this.filenames,
    "account_no":this.expencecreate.value.payment_detail?.account_no,
    "tax_rate": this.expencecreate.value.suppliertaxtype?.taxrate?.rate,
    "is_gst": this.expencecreate.value.is_gst == true ? 1 :0,
}]
  console.log("data....-------", data);
  this.formData.append("data",JSON.stringify(data));

  this.breapiservice.brexpCreate(this.formData).subscribe((results) => {
    this.SpinnerService.show();
    console.log("results",results)
    if(results.code != undefined){
      this.SpinnerService.hide();
      this.toastr.error(results.description,results.code)        
      return false    
    }
    else {
      this.branch_exp_id =results[0].id
      let dtldata = {
        "data":
        [
          {
            "branch_exp_id":this.branch_exp_id,
            "deatail_status":1,
            "remarks":this.paymentDetForm.value.remarks ,
            "from_date":this.datepipe.transform(this.paymentDetForm.value.from_date ,'yyyy-MM-dd'),
            "to_date":this.datepipe.transform(this.paymentDetForm.value.to_date ,'yyyy-MM-dd'),
            "recurring_period":this.paymentDetForm.value.recurring_period,
            "recurring_date":this.paymentDetForm.value.recurring_period == 1 ? 1 :this.paymentDetForm.value.recurring_date,
            "amount":Number(this.paymentDetForm.value.amount)
        } 
        ] 
      }
      this.breapiservice.branchexpdtlcreate(dtldata).subscribe((results) => {
        console.log("detail results",results)
        if(results.code != undefined){
          this.SpinnerService.hide();
          this.toastr.error(results.description,results.code)        
          return false    
        }
        else
        {
          let ccbsform = this.allocationBSCCForm.value.ccbsdtl;

          for(let i=0; i< ccbsform.length ; i++)
          {
            ccbsform[i].branch_exp_id = this.branch_exp_id
            ccbsform[i].amount = this.paymentDetForm.value.amount
            delete ccbsform[i].id
            ccbsform[i].category_code = ccbsform[i].category_code.code
            ccbsform[i].subcategory_code = ccbsform[i].subcategory_code.code
            ccbsform[i].cc_code = ccbsform[i].cc_code.code
            ccbsform[i].bs_code = ccbsform[i].bs_code.code
            ccbsform[i].ccbspercentage = +ccbsform[i].ccbspercentage
            // ccbsform[i].amount = this.paymentDetForm.value.amount
            ccbsform[i].amount =Number(this.firstDetailAmount)
            
          }
    
          this.breapiservice.branchexpCCcreate({data:ccbsform}).subscribe((results) => {
            if(results.code != undefined){
              this.SpinnerService.hide();
              this.toastr.error(results.description,results.code)    
              return false    
            }

            let columndetail:any =[]
            let j=0
            for(let i in this.brexpcolumns.value)
            {
              
              let col ={
                      "expense_type_id" : this.expencecreate.value.expense_type_id.id,
                      "expense_no_id" : this.branch_exp_id, 
                      "column_id" : this.expencetypecolumnlist[j].id,
                      "column_name" : this.expencetypecolumnlist[j].column_name,
                      "column_value" : this.expencetypecolumnlist[j].column_type_id ==2 ? (this.datepipe.transform(this.brexpcolumns.value[i],'yyyy-MM-dd')) : this.brexpcolumns.value[i] 
                      }
                      columndetail.push(col)
                      j++
            }
            this.breapiservice.branchexpTranscreate({data:columndetail}).subscribe((results) => {
                if(results.code != undefined){
                  this.SpinnerService.hide();
                  this.toastr.error(results.description,results.code)  
                  return false    
                }


                let submitdata ={
                  id:this.branch_exp_id,
                  approved_by : this.paymentScheduleForm.value.approvedby?.id,
                  remarks : this.paymentScheduleForm.value.remarks
                  }
              this.breapiservice.branchexpSubmit(submitdata).subscribe((results) => {
              if(results.code != undefined){
                this.SpinnerService.hide();
                this.toastr.error(results.description,results.code)      
                return false    
              }
              else
              {
                this.toastr.success("Created Successfully")
                this.SpinnerService.hide()
                this.onSubmit.emit()
              }
              })
            })
          })
        }          
        })    
   
    }
  },
  (error)=>{  
    this.SpinnerService.hide();
    this.toastr.warning(error)
  });



}
formData: FormData = new FormData();
filenames=[]
filearr =[]
uploaddata(event:any){
  this.formData = new FormData();
  this.filearr =[]
  this.filenames=[]

  console.log(event.target.files.length);
  for(let i=0;i<event.target.files.length;i++)
  {
    this.formData.append('file_'+(i+1),event.target.files[i])
    this.filearr.push(event.target.files[i]);
    this.filenames.push("file_"+(i+1))
  } 
} 

deletefileUpload(file) {
  // this.filearr[i].splice(i,1);
  // this.filenames.splice(i,1);
  const index = this.filearr.indexOf(file);

  if (index !== -1) {
    this.filearr.splice(index, 1);
    this.filenames.splice(index, 1);
  }
  this.fileback()
}
   recurDateFilter()
   {
    if(true)
    {
     
    
    }
   }

   BranchExpViewForm = false
   showview(brexp)
   {
    this.shareservice.brexpid.next(brexp.id)
    this.shareservice.approveComeFrom.next("Create") 
    this.BranchExpViewForm = true
    this.BranchExpCreateForm = false

   }

   viewBacks()
   {
    this.BranchExpCreateForm = true
    this.BranchExpViewForm = false   
   }


  getBranches(keyvalue) 
  {
     
   this.breapiservice.branchget(keyvalue)
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.brList = datas;
     })
   }
     getbranchname(){
       let keyvalue: String = "";  
       this.getBranches(keyvalue) 
       this.paymentScheduleForm.get('branch_id').valueChanges
       .pipe(
         debounceTime(100),
         distinctUntilChanged(),
         tap(() => {
           this.isLoading = true;
           console.log('inside tap')
   
         }),
         switchMap(value => this.breapiservice.branchget(value)
           .pipe(
             finalize(() => {
               this.isLoading = false
             }),
           )
         )
       )
       .subscribe((results: any[]) => {
         let datas = results["data"];
         this.brList = datas;
   
       })
   
     }
    
 
 appbranchScroll() {
   setTimeout(() => {
     if (
       this.branchmatAuto &&
       this.branchmatAuto &&
       this.branchmatAuto.panel
     ) {
       fromEvent(this.branchmatAuto.panel.nativeElement, 'scroll')
         .pipe(
           map(x => this.branchmatAuto.panel.nativeElement.scrollTop),
           takeUntil(this.autocompleteTrigger.panelClosingActions)
         )
         .subscribe(x => {
           const scrollTop = this.branchmatAuto.panel.nativeElement.scrollTop;
           const scrollHeight = this.branchmatAuto.panel.nativeElement.scrollHeight;
           const elementHeight = this.branchmatAuto.panel.nativeElement.clientHeight;
           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
           if (atBottom) {
             if (this.has_next === true) {
               this.breapiservice.getbranchscroll(this.brInput.nativeElement.value, this.currentpage + 1)
                 .subscribe((results: any[]) => {
                   let datas = results["data"];
                   let datapagination = results["pagination"];
                   if (this.brList.length >= 0) {
                     this.brList = this.brList.concat(datas);
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
 
  public displayFnBranch(branchtype?: branchListss): string | undefined {
     return branchtype ? branchtype.code + " - " + branchtype.name : undefined;
   } 
 
   approvername() {
    let appkeyvalue: String = "";
    this.getapprover(appkeyvalue);
    let branch_id = this.paymentScheduleForm.controls['branch_id'].value?.id ? this.paymentScheduleForm.controls['branch_id'].value?.id : ""
  
    this.paymentScheduleForm.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.breapiservice.getECFapproverscroll(1,this.exptypeCommodity,this.createdbyid,branch_id,value)
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

  private getapprover(appkeyvalue) {
    let branch_id = this.paymentScheduleForm.controls['branch_id'].value?.id ? this.paymentScheduleForm.controls['branch_id'].value?.id : ""
   
    this.breapiservice.getECFapproverscroll(1,this.exptypeCommodity,this.createdbyid,branch_id,appkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;
      })
  }
  
  public displayFnApprover(approver?: approverListss): string | undefined {
    return approver ?  approver.name + ' - ' + approver.code +' - ' +approver.limit + ' - '+ approver.designation : undefined;
  }

  get approver() {
    return this.paymentScheduleForm.get('approvedby');
  }

  autocompleteapproverScroll() {
    let branch_id = this.paymentScheduleForm.controls['branch_id'].value?.id ? this.paymentScheduleForm.controls['branch_id'].value?.id : ""
  
    setTimeout(() => {
      if (
        this.matappAutocomplete &&
        this.autocompleteTrigger &&
        this.matappAutocomplete.panel
      ) {
        fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(()=> {
            const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextapp === true) {
                this.breapiservice.getECFapproverscroll( this.currentpageapp + 1,this.exptypeCommodity,this.createdbyid,branch_id,this.appInput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.approverList = this.approverList.concat(datas);
                    if (this.approverList.length >= 0) {
                      this.has_nextapp = datapagination.has_next;
                      this.has_previousapp = datapagination.has_previous;
                      this.currentpageapp = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  brexpCancel()
  {
    var answer = window.confirm("Do you want to Cancel the Branch expense Creation? ");
    if (answer) {
     
  this.expencecreate.reset();
        
  this.expencecreate.patchValue({
    branch_id: this.branchdata,
    hsn : this.nohsn,
    suppliertaxtype : ""
  })
  this.checkedgst =false
  this.checkedtds = false 
  this.PayDetailList =undefined
  this.taxlist =undefined
  this.accno = ""
  this.bankname = ""
  this.ifsccode = ""
  this.taxname = ""
  this.ratename = ""
  this.taxrate = ""
  this.isexcempted = ""
  this.threshold = ""
  this.excemrate = ""
  this.brFormValid = false
  this.showCCBS = false
  this.ccbsFormValid = false
  this.brexpcolumns = new FormGroup({})
  this.expencetypecolumnlist = []
  this.brexpColdet1=[]
  this.brexpColdet2=[]
  this.brexpColdet3=[]
  this.allocationBSCCForm.reset();
  this.ccbsSubmit= false
  this.SelectSupplierForm.reset();
  this.dataclear()
  this.supplierid = undefined
  this.exptypeCommodity = ""
  this.brexpSubmitEnab = false
  this.payFormValid = false
  this.paySchedule =[]
  this.recurCalc = false
  this.paymentDetForm.reset()
  this.formData = new FormData();
  this.paymentScheduleForm.reset()
  this.filenames =[]
  this.filearr =[]
  }
  else
  {
    return false
  }
}
getamount(value){
  if(value == undefined || value == null || value == ''){
    return
  }
  let values = Number(value)
  return (values.toFixed(2))
}

clearField(index: number, controlName: string) {
  const crnglArray = this.allocationBSCCForm.get('ccbsdtl') as FormArray;
  const row = crnglArray.at(index) as FormGroup;
  row.get(controlName)?.reset();
  if (controlName === 'category_code') {
    // this.catid = row.value.category_code.id
    // console.log("gjhhhgsssssssss",this.catid)
    row.get('subcategory_code')?.reset();
    row.get('glno')?.reset();
  }
  if (controlName === 'subcategory_code') {
    row.get('glno')?.reset();
  }
    if (controlName === 'bs_code') {
    row.get('cc_code')?.reset();
  }
}

}
