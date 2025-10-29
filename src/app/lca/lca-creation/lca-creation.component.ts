import { Component, OnInit,ViewChild,ElementRef,Output,EventEmitter } from '@angular/core';
import { AbstractControl,FormGroup,FormArray,FormBuilder,FormControl,Validators,FormControlName } from '@angular/forms';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExceptionHandlingService } from 'src/app/JV/exception-handling.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LcaService } from '../lca.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe, CurrencyPipe } from '@angular/common';
import { LcasharedService} from '../lcashared.service'
import { C } from '@angular/cdk/keycodes';





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
export interface approverListss {
  id: string;
  name: string;
  code: string;
  limit: number;
}
export interface commoditylistss {
  id: string;
  name: string;
}
export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}
export interface raiserlists {
  id: string;
  full_name: string;
  name: string
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
  selector: 'app-lca-creation',
  templateUrl: './lca-creation.component.html',
  styleUrls: ['./lca-creation.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LcaCreationComponent implements OnInit {
  lcacreateform:FormGroup
  lcadeatilsform:FormGroup
  lcaheaderform:FormGroup
  beneficiaryform:FormGroup
  approverForm:FormGroup;
  categoryid:any
  submitted = false;
  createflag = false;
  todayDate: Date;
  formattedTodayDate:any
  ValueArray = [];
  payloadarray=[];
  categoryNameData: Array<catlistss>;
  subcategoryNameData: Array<subcatlistss>;
  ccNameData: Array<cclistss>;
  bsNameData:any
  bsidd: any
  bscode:any
  ccidd: any
  cccode: any
  totalcount = 1
  isLoading = false;
  ModeList:any
  testarray=[]
  approverList: Array<approverListss>;
  currentpageapp:any=1
  has_nextapp:boolean=true
  has_previousapp:boolean=true
  createdbyid:any;
  lcaheaderdetailsshared:any
  viewpop:boolean=false
  openpopup:boolean=false
  open:boolean=false
  beneficiarypaydet:any
  benepaydet:any
  @ViewChild('appInput') appInput:any;
  @ViewChild('approver') matappAutocomplete: MatAutocomplete;
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('raisertyperole') matraiserAutocomplete: MatAutocomplete;
   batchArray = []
   Paymodelist:any
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  BeneficiaryDetails:any
  getdetailtable:any
  commodityid:any
  beneamt:any;
  minDate:any;
  startDate: Date;
  endDate:any;
  Detailstypelist:any
  today:Date;
  i:any
  @ViewChild('fileInputs', { static: false }) InputVar: ElementRef;
  @ViewChild('cattype') matcatAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any;
  @ViewChild('ccInput') ccInput: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  commodityList: Array<commoditylistss>
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @Output() linesChange = new EventEmitter<any>();
  @ViewChild('brInput') brInput:any;
  @ViewChild('branchmatAuto') branchmatAuto: MatAutocomplete;
  brList : Array<branchListss>
  Branchlist: Array<branchListss>;
  expenseTypeList:any
  @ViewChild('exptype') matexpAutocomplete: MatAutocomplete;
  @ViewChild('exptypeInput') exptypeInput: any;
  // {'value':0},{'value':1},
  booleanvaluedropdown=[{'value':"True"},{'value':"False"}]
  branchnamecode:any
  branch_id:any
  behalfdata:any
  branchappid:any
  onbehalfoff:boolean
  Raiserlist:any
  constructor(private errorHandler:ExceptionHandlingService,private spinnerservice:NgxSpinnerService,
    private lcaservice:LcaService,private fb:FormBuilder,private toastr:ToastrService,private notification:NotificationService,
    private datepipe:DatePipe,private sharedservice :LcasharedService,private router: Router) { }

  ngOnInit(): void {
   
      this.lcacreateform = this.fb.group({
      invamt:new FormControl(''),
      jedcat_code:[''],
      jedsubcat_code:[''],
      jedbs_code: [''],
      jedcc_code: [''],
      jedglno:[''],
      purpose:[''],
      dynamicFields: this.fb.array([])
    });
    this.beneficiaryform=this.fb.group({
      mode:['']
    })
    this.today=new Date();
    this.todayDate = new Date();
    this.formattedTodayDate = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.lcaheaderform =this.fb.group({
      lcadata: [this.formattedTodayDate],
      branchcodename:[''],
      empnamecode:[''],
      headeramt:[''],
      lcamode: [''],
      commadity:[''],
      filevalue: this.fb.array([]),
    });
    this.approverForm=this.fb.group({
      
      branch_id:[''],
      approvedby:[''],
      
    });

    this.getjournalstatus();
    this.getpaymode();
    this.getjvview();
    this.benedetails('')
    // this.getdetailsstatus()
    // this.getcommodity();

    this.lcaservice.getexptypedropdown({},1).subscribe((results) => {
      this.expenseTypeList=results['data']
      console.log("expenseTypeList",this.expenseTypeList)
    })


  }
  getDynamicFormControlName(column: any, index: number): string {
    return `${column.column_name}_${index}`;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      // return false;
      event.preventDefault();
    }
    return true;
  }
  expencetypecolumnlist=[];
  expensevalues:any
  patchedcommodity:any
  lcamodevalue:any
  patchedcommoditycode:any
  Coldet1:any=[]
  Coldet2:any=[]
  Coldet3:any=[]
  onExpenseTypeChange(exp) {
    this.lcamodevalue=exp
    this.lcaservice.expencecolumnget(exp.id).subscribe((results) => {
      let datas = results['data'];
      this.expensevalues = results['data'];
      console.log("the patched deatils",this.expensevalues)
      let collist = datas;
      if (collist?.length > 1) {
        let remcol = collist[0];
        delete collist[0];
  
        collist.push(remcol);
      }
      console.log("collist------", collist);
  
      this.expencetypecolumnlist = [];
      this.Coldet1=[]
      this.Coldet2=[]
      this.Coldet3=[]
      const dynamicFieldNames = []; 
      for (let i = 0; i < collist.length; i++) {
        if (collist[i] != undefined) {
          this.expencetypecolumnlist.push(collist[i]);
          dynamicFieldNames.push(`${collist[i].column_name}_${i}`);
        }
      }
      console.log("getenpencetypedata", this.expencetypecolumnlist);
  
      // const dynamicFieldsArray = this.lcacreateform.get('dynamicFields') as FormArray;
      // dynamicFieldsArray.clear();

      // dynamicFieldNames.forEach(fieldName => {
      //   dynamicFieldsArray.push(this.fb.control({ [fieldName]: '' }));
      // });
  
      this.expencetypecolumnlist.forEach((column, index) => {
        const columnName = column.column_name;
        const defaultValue = '';
  
        this.lcacreateform.addControl(`${columnName}_${index}`, new FormControl(defaultValue));
      });
      this.lcaheaderform.patchValue({
        commadity: this.expencetypecolumnlist[0]?.expense_type_id?.commodity_id?.name,
      });
      this.lcacreateform.patchValue({
        jedcat_code: this.expencetypecolumnlist[0]?.expense_type_id?.category_code?.name,
        jedsubcat_code: this.expencetypecolumnlist[0]?.expense_type_id?.subcategory_code?.name,
        jedglno: this.expencetypecolumnlist[0]?.expense_type_id?.subcategory_code?.glno,
      });
      this.patchedcommodity=this.expencetypecolumnlist[0]?.expense_type_id?.commodity_id?.id
      this.patchedcommoditycode=this.expencetypecolumnlist[0]?.expense_type_id?.commodity_id?.code
      console.log("43567890-", this.patchedcommodity);
  
      this.expencetypecolumnlist.forEach((column, index) => {
        const columnName = column.column_name;
        const defaultValue = '';
        this.lcacreateform.get(`${columnName}_${index}`).patchValue(defaultValue);
      });
      
    for(let i=0; i<this.expencetypecolumnlist?.length;i++)
      {
        if(i <= 4)
        {
          this.Coldet1.push(this.expencetypecolumnlist[i])
        }
        if(i > 4 && i <= 9)
        {
          this.Coldet2.push(this.expencetypecolumnlist[i])
        }
        if(i > 9 && i <= 14)
        {
          this.Coldet3.push(this.expencetypecolumnlist[i])
        }
      }
      console.log("is.Coldet1-->>",this.Coldet1)
      console.log("is.Coldet2-->>",this.Coldet2)
      console.log("is.Coldet3-->>",this.Coldet3)
    });

    
  }
  
  
  currentpageexp:any=1
  has_nextexp = true;
  has_previousexp = true;
  isexppage: boolean = true;
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
                this.lcaservice.getexptypedropdown(this.exptypeInput.nativeElement.value == '' ? {} : {expense_name : this.exptypeInput.nativeElement.value}, this.currentpageexp + 1)
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
  getFormArrayControls(formGroup: FormGroup, controlName: string): AbstractControl[] {
    const formArray = formGroup.get(controlName) as FormArray;
    return formArray ? formArray.controls : [];
  }

  enableemployee:boolean=false
  getjvview() {
    this.spinnerservice.show()
    this.lcaservice.creationdetails()
      .subscribe(result => {
        if (result) {
          this.spinnerservice.hide();
          let res= result
          this.getdetailtable=res;
          this.lcaheaderform.patchValue({
            branchcodename: this.getdetailtable.branch,
            empnamecode:this.getdetailtable.employee
          })
          if(this.lcaheaderform.value.branchcodename == "" ||this.lcaheaderform.value.branchcodename == null || this.lcaheaderform.value.branchcodename ==undefined )
            {
              this.enableemployee=true
            }
        }
        if(result?.code)
        {
          this.spinnerservice.hide()
          this.notification.showError(result?.description)
        }
        
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }
  getraiserdropdown() {
    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.lcaheaderform.get('empnamecode').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.lcaservice.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Raiserlist = datas;
      })



  }
  public displayFnraiserrole(raisertyperole?: raiserlists): string | undefined {
    return raisertyperole ? raisertyperole.full_name : undefined;
  }

  get raisertyperole() {
    return this.lcaheaderform.get('empnamecode');
  }
  getrm(rmkeyvalue) {
    this.lcaservice.getrmcode(rmkeyvalue)
      .subscribe(results => {
        if(results){
        let datas = results["data"];
        this.Raiserlist = datas;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }

  raiserScroll() {
    setTimeout(() => {
      if (
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete &&
        this.matraiserAutocomplete.panel
      ) {
        fromEvent(this.matraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.lcaservice.getrmscroll(this.raiserInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Raiserlist.length >= 0) {
                      this.Raiserlist = this.Raiserlist.concat(datas);
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
  getcommoditydata(datas) {
    this.commodityid = datas.id
  }
  getcommoditydd() {
    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.lcaheaderform.get('commadity').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.lcaservice.getcommodityscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityList = datas;
      })
  }
  getjournalstatus(){
    this.lcaservice.getjournalstatus()
    .subscribe(result =>{
      if(result){
      let ModeList = result['data']
      this.ModeList = ModeList
      }
      if(result?.code)
      {
        this.spinnerservice.hide()
        this.notification.showError(result?.description)
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  submitLcaHeaderForm() {
    if (this.lcaheaderform.value.headeramt==null || this.lcaheaderform.value.headeramt==undefined ||this.lcaheaderform.value.headeramt== '') {
      this.notification.showError("Enter the Amount in HeaderForm")
      return false
    }
    if(this.lcaheaderform.value.lcamode == null || this.lcaheaderform.value.lcamode == undefined || this.lcaheaderform.value.lcamode == "")
    {
      this.notification.showError("Please Choose LCA Mode")
      return false;
    }
    if(this.lcaheaderform.value.commadity == null || this.lcaheaderform.value.commadity == undefined || this.lcaheaderform.value.commadity == "")
    {
      this.notification.showError("Please Choose Commadity")
      return false;
    }
  
     const fileValueArray = this.lcaheaderform.get('filevalue') as FormArray;


  return true;  
  }

  // getdetailsstatus(){
  //   this.lcaservice.getdetstatus()
  //   .subscribe(result =>{
  //     if(result){
  //     let Detailstypelist = result['data']
  //     this.Detailstypelist = Detailstypelist
  //     }
  //     if(result?.code)
  //     {
  //       this.spinnerservice.hide()
  //       this.notification.showError(result?.description)
  //     }
  //   },(error) => {
  //     this.errorHandler.handleError(error);
  //     this.spinnerservice.hide()
  //   })
  // }

  public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.name : undefined;
  }

  get commoditytype() {
    return this.lcaheaderform.get('commadity');
  }
  // get fromDate() {
  //   return this.lcaheaderform.get('fromdate');
  // }

  // get toDate() {
  //   return this.lcaheaderform.get('todate');
  // }
  getcommodity(commoditykeyvalue) {
    this.lcaservice.getcommodity(commoditykeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.commodityList = datas;
        }
        if(results?.code)
        {
          this.spinnerservice.hide()
          this.notification.showError(results?.description)
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      })
  }
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
              if (this.has_next === true) {
                this.lcaservice.getcommodityscroll(this.commodityInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.commodityList.length >= 0) {
                      this.commodityList = this.commodityList.concat(datas);
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
  // getcommodity(){
  //   let data={ "ecf_amount":this.lcaheaderform.value.headeramt,"ecf_raiserid":this.getdetailtable.employee_id}
  //   this.lcaservice.getcommodity(data)
  //   .subscribe(result =>{
  //     if(result){
  //     let commoditylist = result['data']
  //     this.CommodityList = commoditylist
  //     }
  //   },(error) => {
  //     this.errorHandler.handleError(error);
  //     this.spinnerservice.hide()
  //   })
  // }
  benedetails(status)
  {
  
    this.lcaservice.getbeneficiary(4)
    .subscribe((results: any[]) => {
      if(results){
      let datas = results["data"];
      this.BeneficiaryDetails = datas;
      this.beneficiarypaydet=results["pay"]
      this.benepaydet=this.beneficiarypaydet[0].paymode_details?.data[0]
      }

    })
  }

  getpaymode(){
    this.lcaservice.getpaymodestaus()
    .subscribe(result =>{
      if(result){
      let PaymodeList = result['data']
      this.Paymodelist = PaymodeList
      }
      if(result?.code)
      {
        this.spinnerservice.hide()
        this.notification.showError(result?.description)
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }
  getcatdropdown() {
    this.getcat('')
  }
  getcat(catkeyvalue) {
    this.lcaservice.getcat(catkeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.categoryNameData = datas;
        this.categoryid = datas.id;
        }

      })
  }
  categoryname:any
  cid(data) {
    this.categoryid = data['id'];
    this.categoryname=data?.code
    this.getsubcat(this.categoryid, "");
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
                this.lcaservice.getcategoryscroll(this.categoryInput.nativeElement.value, this.currentpage + 1)
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
  get cattype() {
    return this.lcacreateform.get('jedcat_code');
  }
  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.code : undefined;
  }
  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.code : undefined;
  }

  get subcategorytype() {
    return this.lcacreateform.get('jedsubcat_code');
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
                this.lcaservice.getsubcategoryscroll(this.categoryid, this.subcategoryInput.nativeElement.value, this.currentpage + 1)
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



  subcatid: any;
  GLNumb
  getsubcat(id, subcatkeyvalue) {
    this.lcaservice.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.subcategoryNameData = datas;
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })
  }
  getGLNumber(data, index) {
    this.GLNumb = data.glno
    this.lcacreateform.get('jedglno').setValue(data.glno)

  }

  public displaybsFn(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }

  get bstype() {
    return this.lcacreateform.get('jedbs_code');
  }
  getbsdropdown() {
    this.getbs('')
  }

  getbs(bskeyvalue) {
    this.lcaservice.getbs(bskeyvalue)
      .subscribe((results: any[]) => {
      if(results){
        let datas = results["data"];
        this.bsNameData = datas;
        this.categoryid = datas.id;
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }

  bsScroll() {
    if (this.autocompleteTrigger) {
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
                this.lcaservice.getbsscroll(this.bsInput.nativeElement.value, this.currentpage + 1)
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
  else{
    console.error('Autocomplete trigger is not available.');
  }
  }
  
  bsid(data, code) {
    this.bsidd = data['id'];
    this.bscode = code;
    this.getcc(this.bsidd, "");
  }
  public displayccFn(cctype?: cclistss): string | undefined {
    return cctype ? cctype.name : undefined;
  }

  get cctype() {
    return this.lcacreateform.get('jedcc_code');
  }
  ccid: any;
  getcc(bssid, cckeyvalue) {
    this.lcaservice.getcc(bssid, cckeyvalue)
      .subscribe((results: any[]) => {
        if(results){
        let datas = results["data"];
        this.ccNameData = datas;
        this.ccid = datas.id;
        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide()
      })

  }

  ccScroll() {
    if (this.autocompleteTrigger) {
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
                this.lcaservice.getccscroll(this.bsidd, this.ccInput.nativeElement.value, this.currentpage + 1)
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
  else
  {
    console.error('Autocomplete trigger is not available.');
  }
  }
  resetlca()
  {    
    this.lcaheaderform.controls['lcamode'].reset(""),
    // this.lcacreateform.controls['fromdate'].reset(""),
    // this.lcacreateform.controls['todate'].reset(""),
    this.lcacreateform.controls['invamt'].reset(""),
    this.lcacreateform.controls['jedcat_code'].reset(""),
    this.lcacreateform.controls['jedsubcat_code'].reset(""),
    this.lcacreateform.controls['purpose'].reset(""),
    this.lcacreateform.controls['jedbs_code'].reset(""),
    this.lcacreateform.controls['jedcc_code'].reset(""),
    this.lcacreateform.controls['jedglno'].reset(""),
    this.lcacreateform.controls['paymodeid'].reset("")
  }
  exexpdetArray:any=[]
  submitflag:boolean=true
  submitlca() {
    let hasError = false;
    if (!this.submitLcaHeaderForm()) {
      return;
    }
    const jvdetaildata = this.lcacreateform?.value

 
    if(jvdetaildata.invamt == null||jvdetaildata.invamt == undefined||jvdetaildata.invamt == "")
    {
      this.notification.showError("Please Enter the Amount")
      return false;
    }
    if(jvdetaildata.jedbs_code == null||jvdetaildata.jedbs_code == undefined||jvdetaildata.jedbs_code == "")
    {
      this.notification.showError("Please Choose BS")
      return false;
    }
    if(jvdetaildata.jedcc_code== null||jvdetaildata.jedcc_code==undefined||jvdetaildata.jedcc_code=="")
    {
      this.notification.showError("Please Choose CC")
      return false;
    }
    if(jvdetaildata.purpose== null||jvdetaildata.purpose==undefined||jvdetaildata.purpose=="")
    {
      this.notification.showError("Please Enter the Purpose")
      return false;
    }

    // if (Object.values(jvdetaildata).some(value => value === null || value === undefined || value === "")) {
    //   this.notification.showError("Please fill in all the details");
    //   hasError = true;
    //   return false;
    // }

    this.beneamt=this.lcaheaderform.value.headeramt       
     if (this.lcacreateform.valid) {
      this.submitted = true;
        const lcacreateformvalue=this.lcacreateform.value;
  
      const formvalue = this.fb.group({
       
        invamt: this.lcacreateform.value.invamt,
        jedcat_code: this.expencetypecolumnlist[0]?.expense_type_id?.category_code?.name,
        jedsubcat_code: this.expencetypecolumnlist[0]?.expense_type_id?.subcategory_code?.name,
        jedbs_code: this.lcacreateform.value.jedbs_code.name,
        jedcc_code: this.lcacreateform.value.jedcc_code.name,
        jedglno:this.expencetypecolumnlist[0]?.expense_type_id?.subcategory_code?.glno,
        paymodeid: this.lcacreateform.value.paymodeid,
        purpose: this.lcacreateform.value.purpose,
        mode:this.lcacreateform.value.lcamode
      });
      // if (Object.values(formvalue.value).some(value => value === null || value === undefined || value === "")) {
      //   this.notification.showError("Please enter valid values in the form");
      //   hasError = true;
      //   return false;
      // }
      // this.ValueArray.push(formvalue);
      this.expensevalues.forEach(expenseValue => {
        let exexpdet = {
          "expense_type_id": expenseValue.expense_type_id.id,
          "column_id": expenseValue.id,
          "column_name": expenseValue.column_name,
          "column_value": null   
        };
      
        for (let index = 0; index < this.expencetypecolumnlist.length; index++) {
          const column = this.expencetypecolumnlist[index];
          const columnName = column.column_name;
          const dynamicFormControlName = this.getDynamicFormControlName(column, index);
          const dynamicFormControlValue = this.lcacreateform.get(dynamicFormControlName)?.value;
  
          if (columnName === expenseValue.column_name) {
            if (column.column_type === 'Boolean' || column.column_type === 'Date' || column.column_type === 'Textbox') {
              if (dynamicFormControlValue == null || dynamicFormControlValue == undefined || dynamicFormControlValue === "") {
                this.notification.showError(`Please enter a valid value for ${columnName}`);
                break; 
              }
              if (column.column_type === 'Integer' && isNaN(Number(dynamicFormControlValue))) {
                this.notification.showError(`Please enter a valid number for ${columnName}`);
                break;
              }
            }
  
            exexpdet.column_value = dynamicFormControlValue;
          }
        }
        if (Object.values(exexpdet).some(value => value === null || value === undefined || value === "")) {
          this.notification.showError("Please enter valid values in exexpdet");
          return false;
        }
        this.exexpdetArray.push(exexpdet);
      });
      console.log("333333333333333",this.exexpdetArray)
   
 
      const payloadvalue = this.fb.group({
       
        "lcadamount": Number(this.lcacreateform.value.invamt),
        "lcadcat_code": this.expencetypecolumnlist[0]?.expense_type_id?.category_code?.code,
        "lcadsubcat_code":this.expencetypecolumnlist[0]?.expense_type_id?.subcategory_code?.code,
        "lcadbs_code": this.lcacreateform.value.jedbs_code.code,
        "lcadcc_code": this.lcacreateform.value.jedcc_code.code,
        "lcadglno":this.expencetypecolumnlist[0]?.expense_type_id?.subcategory_code?.glno,
        "lcaddescription": this.lcacreateform.value.purpose,
        "lcadbranch":1,
        "lcadtype":1,
        "expdet":[this.exexpdetArray]
    
      });      
      if (Object.values(payloadvalue.value).some(value => value === null || value === undefined || value === "")) {
        this.notification.showError("Please enter valid values in the payload");
        hasError = true;
        return false;
      }
      this.ValueArray.push(formvalue);
  
     
      if (!hasError) {
        this.notification.showSuccess("Form Submitted Successfully");
        this.payloadarray.push(payloadvalue.value);
        console.log('The FormArray values are--->>', this.payloadarray);
        this.lcacreateform.reset();
      }
      
    }
     else 
    {
      this.notification.showError('Please fill in the details properly');
    }
 
  }
  
  
  // private isFormDataNotEmpty(): boolean {
  //   const formData = this.lcacreateform.value;
  //   console.log("The FormArray values are",formData)
  //   return Object.values(formData).some(value => value !== null && value !== undefined && value !== '');
  // }
  
  goback()
  {
      // this.lcacreateform.controls['fromdate'].reset(""),
      // this.lcacreateform.controls['todate'].reset(""),
      this.lcacreateform.controls['invamt'].reset(""),
      this.lcacreateform.controls['jedcat_code'].reset(""),
      this.lcacreateform.controls['jedsubcat_code'].reset(""),
      this.lcacreateform.controls['jedbs_code'].reset(""),
      this.lcacreateform.controls['jedcc_code'].reset(""),
      this.lcacreateform.controls['jedglno'].reset(""),
      this.lcacreateform.controls['paymodeid'].reset(""),
      this.lcacreateform.controls['purpose'].reset(""),
      this.lcacreateform.controls['mode'].reset("")
  }

  getccdata(code, id) {
    this.ccidd = code
    this.cccode = id

  }
  uplimage:any [] = []
  uploadList = []
  // fileupload(event){
  //   let imagesList = [];
  //   for (var i = 0; i < event.target.files.length; i++) {
  //     this.uplimage.push(event.target.files[i]);
      
  //   }
  // }
  fileupload(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.uplimage.push(event.target.files[i]);
    }
  
    const fileControls = this.uplimage.map(file => this.fb.control(file));
    this.lcaheaderform.setControl('filevalue', this.fb.array(fileControls));
  }
  
    // this.InputVar.nativeElement.value = '';
    // imagesList.push(this.uplimage);
    // this.uploadList = [];
    // imagesList.forEach((item) => {
    //   let s = item;
    //   s.forEach((it) => {
    //     let io = it.name;
    //     this.uploadList.push(io);
    //   });
    // });

    resetFileInput(): void {
      this.InputVar.nativeElement.value = '';
    }
  
    updateUploadList(): void {
      this.uploadList = this.uplimage.map(file => file.name);
    }
  characterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 32 || charCode > 32)) {
      return false;
    }
    return true;
  }
  characterandnumberonly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57) && (charCode < 32 || charCode > 32)) {
      return false;
    }
    return true;
  }
  totalAmount:Number
  calculateTotalAmount(): Number {
    let totalAmount:Number =0;
  
    for (const data of this.ValueArray) {
      totalAmount = Number(totalAmount) + Number(data.value.invamt);
    }
    this.beneamt=totalAmount
    return totalAmount;
  }
  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  data:any 
  wholeform(){ 
       if(Number(this.lcaheaderform.value.headeramt) != Number(this.beneamt))
      {
        this.notification.showError("The Header and Details Amount is not Equal");
        return false;
      }
    this.testarray = []
    
    let jvdata={
      "lcabranch":this.getdetailtable.branch_id,
      "lcatype":1,
      "lcarefno":"",
      "lcadescription":this.ValueArray[0].value.purpose,
      "lcatransactiondate":this.lcaheaderform.value.lcadata,
      "lcaamount":Number(this.lcaheaderform.value.headeramt),
      "lcamode":this.lcamodevalue.LCA_name,
      "commodity":this.patchedcommoditycode,
      "approved_by":this.approverForm.get('approvedby').value.id,
      "expense_type_id":this.expencetypecolumnlist[0].expense_type_id.id,
      "LCADetail": [],
     
    }
    let value_bene ={
      "lcadtype": 2,
      "lcaddescription": "okay",
      "lcadamount":Number(this.lcaheaderform.value.headeramt),
      "lcadcat_code":this.benepaydet.category_id.code,
      "lcadsubcat_code":this.benepaydet?.sub_category_id.code,
      "lcadglno": this.benepaydet?.glno,
      "lcadbranch":this.getdetailtable.branch_id,
      "accountno": this.BeneficiaryDetails[0]?.account_number,
      "paymode": this.beneficiarypaydet[0].code

    };
   
    this.payloadarray.forEach((ele)=>{
      ele['lcadtype']=1;
      jvdata['LCADetail'].push(ele);
    });

    value_bene['lcadtype']=2;
    jvdata['LCADetail'].push(value_bene);
  
    console.log("The JV data's are",jvdata)
  
  
  
    this.spinnerservice.show()
    this.lcaservice.createlca(jvdata, this.uplimage)
    .subscribe(result =>{
      this.spinnerservice.hide()
      if(result?.code)
      {
        this.notification.showError(result?.description)
        return false;
        this.glback();
      }
      if(result?.id != undefined){
      this.notification.showSuccess("Created Successfully")
      this.glback()
      }
    },(error) => {
      this.errorHandler.handleError(error);
      this.spinnerservice.hide()
    })
  }
  deleteData(data: any) {
    const index = this.ValueArray.indexOf(data);
  
    if (index !== -1) {
      this.ValueArray.splice(index, 1);
    }
  }

  glback(){
    this.onCancel.emit();
    // this.router.navigate(['lca/lcasummary'])
  }
  approvername() {
    let appkeyvalue: String = "";
    this.getapprover(appkeyvalue);
    let branch_id = this.getdetailtable?.branch_id
    this.createdbyid=this.getdetailtable?.employee_id
    this.lcaheaderform.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.lcaservice.getapproverscroll(1,this.patchedcommodity,this.createdbyid,branch_id,value)
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
    // let branch_id = this.lcaheaderform.controls['branchcodename'].value?.id ? this.lcaheaderform.controls['branchcodename'].value?.id : ""
    // this.lcaservice.getapproverscroll(1,this.batchArray[0]?.commodity_id?.id,this.createdbyid,branch_id,appkeyvalue)
    let branch_id = this.getdetailtable?.branch_id
    this.createdbyid=this.getdetailtable?.employee_id
    this.lcaservice.getapproverscroll(1,this.patchedcommodity,this.createdbyid,branch_id,appkeyvalue)  
    .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;
      })
  }
  
  public displayFnApprover(approver?: approverListss): string | undefined {
    return approver ? approver.name + ' - ' + approver.code : undefined;
  }

  get approver() {
    return this.lcaheaderform.get('approvedby');
  }

  autocompleteapproverScroll() {
    this.createdbyid=this.getdetailtable?.employee_id
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
                this.lcaservice.getapproverscroll( this.currentpageapp + 1,this.patchedcommodity,this.createdbyid,"",this.appInput.nativeElement.value)
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

  getBranches(keyvalue) 
  {
     
   this.lcaservice.branchget(keyvalue)
     .subscribe((results: any[]) => {
       let datas = results["data"];
       this.brList = datas;
     })
   }
     getbranchname(){
       let keyvalue: String = "";  
       this.getBranches(keyvalue) 
       this.lcaheaderform.get('branchcodename').valueChanges
       .pipe(
         debounceTime(100),
         distinctUntilChanged(),
         tap(() => {
           this.isLoading = true;
           console.log('inside tap')
   
         }),
         switchMap(value => this.lcaservice.branchget(value)
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
                this.lcaservice.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
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
               this.lcaservice.getbranchscroll(this.brInput.nativeElement.value, this.currentpage + 1)
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

   closeModal() {
    this.openpopup=false
    this.open = false;

  }
  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
  pdfurl: any
  filepreview(files) {

    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
    stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = true

      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.pdfurl = reader.result
      }
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
     stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
    }


  }


  deleteUpload(s, index) {
    console.log("svalue", s);
    if (Array.isArray(s)) {
      s.splice(index, 1); 
    }
    let value = this.lcaheaderform.get('filevalue') as FormArray;
    value.removeAt(index);
  }

  closeview(){
    this.viewpop = false;
    this.openpopup=true;
   }
}
