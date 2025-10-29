import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from 'src/app/atma/notification.service'
import { ReportserviceService } from '../reportservice.service'
import { ErrorHandlingService } from 'src/app/atma/error-handling.service';
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Idle ,DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
// import { COMMA, ENTER } from '@angular/cdk/keycodes/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
// import { SSL_OP_NO_TLSv1_1 } from 'constants';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';


registerLocaleData(localeIn, 'en-IN');
export const PICK_FORMAT={
  parse:{dateInput:{year:'numeric',month:'short',day:'numeric'}},
  display:{
    dateInput:'input',
    monthYearLabel:{'year':'numeric',month:'short'},
    dateAllyLabel:{year:'numeric',month:'long',day:'numeric'},
    monthYearAllyLabel:{year:'numeric',month:'long'}
  }
}

class pDateAdapter extends NativeDateAdapter{
  format(date: Date, displayFormat: Object): string {
    if(displayFormat==='input'){
      return formatDate(date,'dd-MMM-yyyy',this.locale)
    }
    else{
      return date.toDateString();
    }
  }
}


export interface branch {
  name: string;
 id : number;
 code:string;
}


 export interface subcat 
 {
  id:string,
  code:string,
  name:string;
  microsubcatcode:string
 }
export interface cc{
  id:string,
  code:string,
  name:string;
  microcccode:string
}

export interface glno{
 
  no:string
}
export interface empbranch{
  id:string,
  codename:string
}
export interface exp{
  id:string,
  name:string
}
export interface gllist{
  id:number;
  no:string;
}
@Component({
  selector: 'app-trialbalance',
  templateUrl: './trialbalance.component.html',
  styleUrls: ['./trialbalance.component.scss'],
  providers:[
    {provide:DateAdapter,useClass:pDateAdapter},
    {provide:MAT_DATE_FORMATS,useValue:PICK_FORMAT}
    
  ]
})
export class TrialbalanceComponent implements OnInit {

trialbalForm: FormGroup;
// tbcreateform:any= FormGroup;
fromdate = new FormControl(new Date());
todate = new FormControl(new Date());

smscreateform:any= FormGroup;
first:boolean=false;
second:boolean=false;
third:boolean=false;
fourth:boolean=false;
five:boolean=false;
fifth:boolean=false;
sixth:boolean=false;
module_name:any;
latest_date: string;
valid_date=new Date();
idletime:any='';
downloadForecastFlag = true;
loadsummary:boolean=true;
// role:boolean=true;
//subcat
  @ViewChild('subcatinput') subcat: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompletesubcatTrigger: MatAutocompleteTrigger;
  @ViewChild('subcat') matsubcatAutocomplete: MatAutocomplete;
//branch
  @ViewChild(MatAutocomplete) matbranchAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompletebranchTrigger: MatAutocompleteTrigger;
  @ViewChild('branchInput') branch: ElementRef;
  

//cc
@ViewChild(MatAutocompleteTrigger) autocompleteccTrigger: MatAutocompleteTrigger;
@ViewChild('ccInput') cc: ElementRef;
@ViewChild('checker') matccAutocomplete: MatAutocomplete;
//glno
@ViewChild(MatAutocompleteTrigger) autocompleteglnoTrigger: MatAutocompleteTrigger;
@ViewChild('glnoInput') glno: ElementRef;
@ViewChild('glnochecker') matglnoAutocomplete: MatAutocomplete;
public opts: branch[];
// readonly separatorKeysCodes: number[] =  [ENTER, COMMA];

  has_designnext: boolean = false;
  has_designpre: boolean = false;
  designpage: number = 0;
  subcatList: any[] = [];
  gl_no:any[]=[]
  fruitCtrl = new FormControl();
  fromDate: Date | null = null;
  toDate: Date | null = null;
  fromDate_stbsummary: Date | null = null;
  searchForm!: FormGroup;
  tableData: any[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  ppr_pagesize:number=10;
  currentPage: number = 1;
  // opts:any= [];
  options:any=[];
  isLoading: boolean = false;
  has_previous: boolean = false;
  has_next: boolean = true;
  present_page: number = 1;
  creatable:boolean=false;
  has_branext:boolean = true;
  has_braprevious:boolean = false;
  branch_presentpage : number = 1;
  selectedKeys: branch[] = [];
  selectedKeyscc: cc[]=[]
  // opts:Array<any>= [];
  frmData :any= new FormData();
  has_glnonext:boolean=true;
  has_glnoprevious:boolean=false;
  glno_presentpage : number = 1;

  has_ccnext:boolean=true;
  has_ccprevious:boolean=false;
  cc_presentpage : number =1;
  items: any[] = [];
  visible = true;
  selectable = true;
  removable = false;
  addOnBlur = true;
  
dateRanges: any[] =[];
  formGroup: any;
  apiData: any;

  subcatunique_no: any ; 
  ccunique_no: any ; 

ccList: any[]=[];
  sub: any[]=[];
  //  cc : any[]=[];
   selectedSubcats: any= []; 
  //  subcat:any[]=[]
  //  glno:any[]=[]
  selectedCCs: cc[] = [];

  spinner: any;

  branchIds:any;
  chipSelectedBranchid =[]

  public chipSelectedBranch = [];
  enabale_exp:boolean=false;
  ntbfromDate: any;

  constructor(private errorHandler: ErrorHandlingService,private service: ReportserviceService,private fb: FormBuilder,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService,public datepipe: DatePipe,private toastr:ToastrService, private idletimeout:Idle) { }

  ngOnInit(): void {
    this.trialbalForm = this.fb.group({
      fromdate: new FormControl(),
      todate: new FormControl(),
      FROMDATE:new FormControl(),
      TODATE: new FormControl(),
      bankreconfromdate:new FormControl(),
      bankrecontodate:new FormControl(),
      fareconfromdate:new FormControl(),
      farecontodate:new FormControl(),
      fa_ppr_fromdate:new FormControl(),
      fa_ppr_todate:new FormControl(),
      glreconinvoicedate:new FormControl(),
      branch_gl_fromdate:new FormControl(),
      branch_gl_todate:new FormControl(),
      branchgl_empbranch:new FormControl(),
      branchgl_expen:new FormControl(),
      branchgl_no:new FormControl(),
      branch_withppr_fromdate:new FormControl(),
      branch_withppr_todate:new FormControl(),
      branch_withppr_empbranch:new FormControl(),
      branch_withppr_expen:new FormControl(),
      branch_withppr_glno:new FormControl(),
      ntb_fromdate: new FormControl(),
      ntb_todate:new FormControl(),
    });
    console.log("TB started")
    this.searchForm = this.fb.group({
      selectedOption:['Trial Balance',Validators.required],
      fromDate: [null],
      toDate: [null],
      selectedBranch: [],
      GlNo: [],
      subcatName:[],
      ccName:[],
      CBFile:[],
      from_ledger:new FormControl(),
      to_ledger:new FormControl(),
      glreconinvoicedate:new FormControl()
      });
      // this.fetchTableData(1)
      // this.fetchTableData(this.currentPage); 
      // Fetch initial data
      // this.appService.getItemss(1, "").subscribe(data => {
      //   this.options = data['data'];
      // });
      // this.service.selectedbranch(1, "").subscribe(data => {
      //   this.opts = data['data'];
      // });
      this.service.subcatList(1,'').subscribe(data =>{
         this.subcatList =data['data'];
        
  })
  this.trialbalForm.get('branchgl_empbranch').valueChanges.pipe(
    debounceTime(2000),
    distinctUntilChanged(),
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap(value =>this.service.getempbranchedrop(value,1)
    .pipe(
      finalize(()=>{
        this.isLoading=false;
      }),
    ))
  ).subscribe((res:any)=>{
    this.empbranchnamelist=res['data']
  })
  this.trialbalForm.get('branch_withppr_empbranch').valueChanges.pipe(
    debounceTime(2000),
    distinctUntilChanged(),
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap(value =>this.service.getempbranchedrop(value,1)
    .pipe(
      finalize(()=>{
        this.isLoading=false;
      }),
    ))
  ).subscribe((res:any)=>{
    this.pprempbranchnamelist=res['data']
  })

  this.trialbalForm.get('branchgl_expen').valueChanges.pipe(
    debounceTime(2000),
    distinctUntilChanged(),
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap(value =>this.service.getexpense(value,1)
    .pipe(
      finalize(()=>{
        this.isLoading=false;
      }),
    ))
  ).subscribe((res:any)=>{
    this.expense_list=res['data']
  })
  this.trialbalForm.get('branch_withppr_expen').valueChanges.pipe(
    debounceTime(2000),
    distinctUntilChanged(),
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap(value =>this.service.getexpense(value,1)
    .pipe(
      finalize(()=>{
        this.isLoading=false;
      }),
    ))
  ).subscribe((res:any)=>{
    this.pprexpense_list=res['data']
  });
  this.trialbalForm.get('branchgl_no').valueChanges.pipe(
    debounceTime(2000),
    distinctUntilChanged(),
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap(value =>this.service.getglno_list(value,1)
    .pipe(
      finalize(()=>{
        this.isLoading=false;
      }),
    ))
  ).subscribe((data:any)=>{
    this.glno_list=data['data']
  })

  this.trialbalForm.get('branch_withppr_glno').valueChanges.pipe(
    debounceTime(2000),
    distinctUntilChanged(),
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap(value =>this.service.getglno_list(value,1)
    .pipe(
      finalize(()=>{
        this.isLoading=false;
      }),
    ))
  ).subscribe((data:any)=>{
    this.ppr_glno_list=data['data'];
  })



  this.service.gl_noList(1,'').subscribe(data =>{
    this.gl_no =data['data'];
   
})
     this.service.ccList(1,'').subscribe(data =>{
        this.ccList = data['data'];
     })
      // this.searchForm.get('selectedBranch')?.valueChanges.pipe(
      //   tap(() => {
      //     this.isLoading = true;
      //   }),
      //   switchMap((value: any) => this.service.selectedbranch(1, value).pipe(
      //     finalize(() => {
      //       this.isLoading = false;
      //     })
      //   ))
      // ).subscribe(data => {
      //   this.opts = data['data'];
      // });
    // this.service.getBranches().subscribe((data: any[]) => {
    //   this.opts = data;
    // }, error => {
    //   console.error('Error fetching branches', error);
    // });
    if (this.branchControl !== null) {
      this.branchControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.selectedbranch(1,value)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          let datapagination = results["pagination"];
          this.opts = datas;
          // console.log("totalEmployeeList", datas)
          if (this.opts.length >= 0) {
            this.has_branext = datapagination.has_next;
            // console.log('this.has_next', this.has_next);
            this.has_braprevious = datapagination.has_previous;
            this.branch_presentpage = datapagination.index;
          }
        })
        this.searchForm.get('selectedBranch').valueChanges.pipe(
          debounceTime(2000),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.selectedbranch(1,value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          this.opts=results['data'];
          if(this.opts.length>0){
            let datapagination=results["pagination"];
            this.has_branext=datapagination.has_next;
            this.has_braprevious=datapagination.has_previous;
            this.branch_presentpage=datapagination.index;
          }
        },(error) => {
        })
    }

       this.searchForm.get('subcatName')?.valueChanges.pipe(
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value: any) => this.service.subcatList(1,value).pipe(
          finalize(() => {
            this.isLoading = false;
          })
        ))
      ).subscribe(data => {
        this.subcatList = data['data'];
      });

      this.searchForm.get('GlNo')?.valueChanges.pipe(
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value: any) => this.service.gl_noList(1,value).pipe(
          finalize(() => {
            this.isLoading = false;
          })
        ))
      ).subscribe(data => {
        this.gl_no = data['data'];
      });



      this.searchForm.get('ccName')?.valueChanges.pipe(
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value: any) => this.service.ccList(1,value).pipe(
          finalize(() => {
            this.isLoading = false;
          })
        ))
      ).subscribe(data => {
        this.ccList = data['data'];
      });
      this.filerecon_summary()
      this.filedtp_summary()
      this.bankrecon_summary()
      this.Fa_recon_summary();
      this.glrecon_summary()
      this.TBclosing_summary();
      // this.year_for_LTB();
    }

      
  vendorreport(){
    this.SpinnerService.show();
    // let data;
    // data=this.validation_fun()
    if(this.trialbalForm.value.fromdate==undefined) {
      this.notification.showError('Please  Choose any one Filter!!  ');
      this.SpinnerService.hide();
      this.trialbalForm.reset();
    return false
    }
    
    this.trialbalForm = this.fb.group({
      fromdate: new FormControl(),
      todate: new FormControl(),
    });
    this.latest_date =this.datepipe.transform(this.valid_date, 'yyyy-MM-dd');
   
    
    // this.service.report_(0,0)
    // .subscribe(data => {
    //   let binaryData = [];
    //     binaryData.push(data)
    //     let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    //     let link = document.createElement('a');
    //     link.href = downloadUrl;
    //     let date: Date = new Date();
    //     link.download = 'Vendorreport'+ date +".xlsx";
    //     link.click();
  
    //   this.SpinnerService.hide();
    //   // this.vendorSearchForm.reset();
  
    // },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    
    
  }
  manualRun(){
    let dynamic_year=new Date();
    let yeat_d=dynamic_year.getFullYear();
    this.SpinnerService.show();
    let d = [{
          "operators": "DATE BETWEEN",
          "value1date": yeat_d.toString()+"-04-01",
          "value2date": this.datepipe.transform(dynamic_year,'yyyy-MM-dd'),
          "module": "TRIAL BALANCE",
          "scheduler":1
    }]
    this.service.manualRunTB(d)
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('No Data')
          this.SpinnerService.hide()
        }
        else{
          let datas = results;
          if (datas === undefined){
            this.toastr.warning("No Records")
            this.SpinnerService.hide()
          }
          else{
            if (datas.message == "Successfully Inserted"){
              this.toastr.success("Manual Run Data Inserted Successfully")
              this.SpinnerService.hide()
            }
            else if (datas.message == "Data not inserted"){
              this.toastr.success("Data not available")
              this.SpinnerService.hide()
            }
          }
        }        
        },(error)=>{
          this.SpinnerService.hide()
          this.toastr.warning(error.status+error.statusText)
        })
      }
  
  detailmanualRun(){
    let dynamic_year=new Date();
    let yeat_d=dynamic_year.getFullYear();
    this.SpinnerService.show();
    let d = [{
          "operators": "DATE BETWEEN",
          "value1date": yeat_d.toString()+"-04-01",
          "value2date": this.datepipe.transform(dynamic_year,'yyyy-MM-dd'),
          "module": "TRIAL BALANCE",
          "scheduler":1
    }]
    this.service.detailsmanualRunTB(d)
      .subscribe((results: any) => {
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('No Data')
          this.SpinnerService.hide()
        }
        else{
          let datas = results;
          if (datas === undefined){
            this.toastr.warning("No Records")
            this.SpinnerService.hide()
          }
          else{
            if (datas.message == "Successfully Inserted"){
              this.toastr.success("Detail Manual Run Data Inserted Successfully")
              this.SpinnerService.hide()
            }
            else if (datas.message == "Data not inserted"){
              this.toastr.success("Data not available")
              this.SpinnerService.hide()
            }
          }
        }        
        },(error)=>{
          this.SpinnerService.hide()
          this.toastr.warning(error.status+error.statusText)
        })
      }

  detailtb_correction_run(){
    debugger
    let dynamic_year=new Date();
    let yeat_d=dynamic_year.getFullYear();
    this.SpinnerService.show();
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):'',

    };
    this.service.detail_tb_correction_run(data)
      .subscribe((results: any) => {
        debugger
        console.log("getList", results);
        if(results.code == "INVALID_DATA"){
          this.toastr.warning('No Data')
          this.SpinnerService.hide()
        }
        else{
          let datas = results;
          if (datas === undefined){
            this.toastr.warning("No Records")
            this.SpinnerService.hide()
          }
          else{
            if (datas.message == "Successfully Inserted"){
              this.toastr.success("Detail Manual Run Data Inserted Successfully")
              this.SpinnerService.hide()
            }
            else if (datas.message == "Data not inserted"){
              this.toastr.success("Data not available")
              this.SpinnerService.hide()
            }
          }
        }        
        },(error)=>{
          this.SpinnerService.hide()
          this.toastr.warning(error.status+error.statusText)
        })
      }
      onFromDateChange(selectedDate: Date) {
        this.fromDate = selectedDate;
        this.trialbalForm.get('TODATE')?.setValue(selectedDate);  // Set the "To" date to match the "From" date
      }
  
      ondateChange_stb(date:Date){
        this.fromDate_stbsummary=date;
        this.searchForm.get('toDate')?.setValue(date);
      }
  onDateChange(){
    this.latest_date=this.datepipe.transform(this.trialbalForm.get('fromdate').value,'dd-MM-yyyy');
  }
  onGLRDateChange(){
    this.latest_date=this.datepipe.transform(this.trialbalForm.get('glreconinvoicedate').value,'dd-MM-yyyy');
  }
  
  onDateChangebank(){
    this.latest_date=this.datepipe.transform(this.trialbalForm.get('bankreconfromdate').value,'dd-MM-yyyy');
  }
  onFADateChange(){
    this.latest_date=this.datepipe.transform(this.trialbalForm.get('fareconfromdate').value,'dd-MM-yyyy');
  }
  onFA_ppr_dateChange(){
    this.latest_date=this.datepipe.transform(this.trialbalForm.get('fa_ppr_fromdate').value,'dd-MM-yyyy');
  }
  on_branchgl_dateChange(){
    this.latest_date=this.datepipe.transform(this.trialbalForm.get('branch_gl_fromdate').value,'dd-MM-yyyy');
  }
  public branchControl = new FormControl();
  tb_report_download(){
    // let fromdate:any=this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'';
    // let todate:any=this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):'';
    if(this.third == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.third=true
    let data:any={
      "from_date":"",//this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'',
      "to_date":"",//this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):''
      };
    this.service.trial_balancereport_xl(data)
    .subscribe(fullXLS=>{
      if(fullXLS['type']=='application/json'){
        this.toastr.warning("INVALID DATA");
        this.third=false;
      }
      else{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Trial_Balance_Download'+ date +".xlsx";
        link.click();
        this.third=false;
        this.toastr.success('Excel Download Successfully');
      }
     
    },
    (error)=>{
      this.third=false;
      this.toastr.warning(error.description)
    });
  }
  forecastPrepare(){
    if(this.first == true){
      this.toastr.warning('Already Progress')
      return true
    }
    let fromdate:any=this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'';
    let todate:any=this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):'';
    
    this.first=true
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):'',
     "enb":"1" 
    };
    this.SpinnerService.show();
    // this.toastr.warning('Wait for 3 minutes','',{timeOut:180000,progressBar:true,progressAnimation:'decreasing'});
    
   
    this.service.getTbForecastPrepare(data).subscribe(result=>{
      console.log(result);
      this.first=false;
      this.SpinnerService.hide();
      if (result['status'] == "success") {
        this.toastr.success(result['message']);
     }
     else{
      this.toastr.warning(result['description']);

     }  
      //  if(result['code']!=undefined && result['code']!=""){
      //   this.first=false;
      //   this.toastr.clear();
      //   this.toastr.warning(result['code']);
      //   this.toastr.warning(result['description']);
      // }
      // else{
      //   setTimeout(() => {
      //     /** spinner ends after 3 seconds */
      //     this.SpinnerService.hide();
      //     }, 3000);
      //   alert('Success');
      //   this.first=false;
      // }
      
    },
    (error)=>{
      this.first=false;
      this.toastr.warning(error.status+error.statusText)
    });
    // setTimeout(()=>{
    //   this.first=false;
    //   this.downloadForecastFlag = false;
    //   this.toastr.success('Excel Prepared Successfully');
    //   // this.toastr.success('Excel Prepared Successfully','',{timeOut:3000});
    // },300000);
    // console.log('final Execute');
  }
  

  ReconPrepare(){
    if(this.five == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.five=true
    this.ReconStop= true;
    // this.SpinnerService.show();
    this.toastr.success('Started preparing Excel.')
    console.log('Started preparing Excel.');
    this.service.getTbEXcelPrepare().subscribe(result=>{
      console.log(result);
     
    this.ReconPrepareEX = false;
    this.ReconDownload = true
    this.five=false
      if(result['code']!=undefined && result['code']!=""){
        // this.SpinnerService.hide();
        this.five=false;
        this.toastr.clear();
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);
      }
      
    }
    (error)=>{
      this.five=false;
      this.toastr.warning(error.description)
    }});
   
  }

  dt_tbforecastPrepare(){
    if(this.second == true){
      this.toastr.warning('Already Progress')
      return true
    }
    let fromdate:any=this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'';
    let todate:any=this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):'';
    
    this.second=true
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):'',
     "enb":"1" 
    };
    this.SpinnerService.show();
    this.toastr.warning('Wait for 3 minutes','',{timeOut:180000,progressBar:true,progressAnimation:'decreasing'});
    
   
    this.service.getdetTbForecastPrepare(data).subscribe(result=>{
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.SpinnerService.hide();
        this.second=false;
        this.toastr.clear();
        // this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.SpinnerService.hide();
          }, 3000);
        alert('Success');
        this.second=false;
      }
      
    },
    (error)=>{
      this.second=false;
      this.toastr.warning(error.description)
    });
    setTimeout(()=>{
      this.second=false;
      this.downloadForecastFlag = false;
      this.toastr.success('Excel Prepared Successfully');
      // this.toastr.success('Excel Prepared Successfully','',{timeOut:3000});
    },300000);
    console.log('final Execute');
  }
   simple_TBPrepare(){
    if(this.second == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.second=true
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('FROMDATE').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('FROMDATE').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.trialbalForm.get('TODATE').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('TODATE').value,'yyyy-MM-dd'):'',
     "enb":"1" 
    };
    this.SpinnerService.show();
    
   
    this.service.getSimpleTbPrepare(data).subscribe(result=>{
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.SpinnerService.hide();
        this.second=false;
        this.toastr.clear();
        // this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.SpinnerService.hide();
          }, 3000);
        alert('Success');
        this.second=false;
        if (result['status'] == "success") {
          this.toastr.success('Excel Prepared Successfully');
      }
        // this.toastr.success('Excel Prepared Successfully');

      }
      
    },
    (error)=>{
      this.second=false;
      this.toastr.warning(error.description)
    });
  
  }

  simple_TrailBalPrepare(){
    if(this.second == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.second=true
    let data:any={
      "from_date":this.datepipe.transform(this.searchForm.get('fromDate').value,'yyyy-MM-dd')?this.datepipe.transform(this.searchForm.get('fromDate').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.searchForm.get('toDate').value,'yyyy-MM-dd')?this.datepipe.transform(this.searchForm.get('toDate').value,'yyyy-MM-dd'):'',
     "enb":"1" 
    };
    this.SpinnerService.show();
    
   
    this.service.getSimpleTbPrepare(data).subscribe(result=>{
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.SpinnerService.hide();
        this.second=false;
        this.toastr.clear();
        // this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.SpinnerService.hide();
          }, 3000);
        alert('Success');
        this.second=false;
        if (result['status'] == "success") {
          this.toastr.success('Excel Prepared Successfully');
      }
        // this.toastr.success('Excel Prepared Successfully');

      }
      
    },
    (error)=>{
      this.second=false;
      this.toastr.warning(error.description)
    });
  
      
     
  
  }
  TB_Recon_Download() {
    this.five=false
    // this.second = true;
    this.SpinnerService.show();
    this.service.getdetTbReconDownload().subscribe(
      (response: any) => {
        this.ReconPrepareEX= true
        this.ReconStop=false
        this.ReconDownload = false
        this.SpinnerService.hide();
        // this.second = false;

        if (response?.code) {
          this.toastr.warning(response['code']);
          this.toastr.warning(response['description']);
        } else {
        
            this.toastr.success("Successfully Downloaded");

            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `Detailed_Trail_Balance_Recon_Report_${formattedDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.SpinnerService.hide();
        this.second = false;
        this.toastr.warning(error.description);
      }
    );
  }



  tb_detail_report_download(){
    if(this.fourth == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.fourth=true
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):'', 
    };
    this.service.trial_balancedetailcereport_xl(data)
    .subscribe(fullXLS=>{
      if(fullXLS['type']=='application/json'){
        this.toastr.warning("INVALID DATA");
        this.fourth=false;
      }
      else{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Trial_Balance_Download'+ date +".xlsx";
        link.click();
        this.fourth=false;
        this.toastr.success('Excel Download Successfully');
      }
     
    },
    (error)=>{
      this.fourth=false;
      this.toastr.warning(error.description)
    });
  }
  simple_TbDownload(){
    if(this.fourth == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.fourth=true
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('FROMDATE').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('FROMDATE').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.trialbalForm.get('TODATE').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('TODATE').value,'yyyy-MM-dd'):'', 
    };
    this.service.getSimpleTbDownload(data)
    .subscribe(fullXLS=>{
      if(fullXLS['type']=='application/json'){
        this.toastr.warning("NO RECORD FOUND");
        this.fourth=false;
      }
      else{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Simple Trial_Balance Download '+ date +".csv";
        link.click();
        this.fourth=false;
        this.toastr.success('Excel Download Successfully');
      }
     
    },
    (error)=>{
      this.fourth=false;
      this.toastr.warning(error.description)
    });
  }
  tb_new_detail_report_download(){
    if(this.fifth == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.fifth=true
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):'', 
    };
    this.service.trial_balancedetailcereport_xl1(data)
    .subscribe(fullXLS=>{
      if(fullXLS['type']=='application/json'){
        this.toastr.warning("INVALID DATA");
        this.fifth=false;
      }
      else{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Trial_Balance_Download'+ date +".xlsx";
        link.click();
        this.fifth=false;
        this.toastr.success('Excel Download Successfully');
      }
     
    },
    (error)=>{
      this.fifth=false;
      this.toastr.warning(error.description)
    });
  }

  tb_detail_report_zipdownload(){
    if(this.sixth == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.sixth=true
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):'', 
    };
    this.service.detail_trial_balancedetailcereport_zip(data)
    .subscribe(fullXLS=>{
      if(fullXLS['type']=='application/json'){
        this.toastr.warning("INVALID DATA");
        this.sixth=false;
      }
      else{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Trial_Balance_Download'+ date +".zip";
        link.click();
        this.sixth=false;
        this.toastr.success('Zipfile Download Successfully');
      }
     
    },
    (error)=>{
      this.sixth=false;
      this.toastr.warning(error.description)
    });
  }



  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchTableData(this.currentPage);
  }

  searchFormData() {
    if (this.searchForm.valid) {

      // if (this.isDateRangeSelected()) {
      //   this.fetchTableData(this.currentPage);
      // }
      if(this.isDetails()){
        this.fetchTableData(this.currentPage);
      }
      const formData = this.searchForm.value;
      this.service.searchData(formData.fromDate, formData.toDate, formData.selectedBranch, formData.GlNo)
        .subscribe((data) => {
          console.log('API Response:', data);
         
        }, (error) => {
          console.error('API Error:', error);
        });
    }
    //  else {
    //   console.error('Form is invalid.');
    // }
    
  }
  public branchintreface(data?:branch):string | undefined{
    return data? data.code!=undefined?+data.code+' - '+data.name:undefined:undefined;
  }
  public apsubcatintreface(data?:subcat):string | undefined{
    return data?data.microsubcatcode +'-'+data.name:undefined;
  }
  public subcatintreface(data?:subcat):string | undefined{
    return data?data.microsubcatcode +'-'+data.name:undefined;
  }
  public apcctintreface(data?:cc):string | undefined{
    return data?data.microcccode +'-'+data.name:undefined;
  }
  public glnointreface(data?:glno):string | undefined{
    return data?data.no:undefined;
  }
  fetchTableData(present_page: number) {

    if(this.searchForm.get('selectedOption').value==''){
      this.toastr.warning("Please Select The TB Type")
    }
    let glno: any = this.searchForm.get('GlNo')?.value ? this.searchForm.get('GlNo')?.value.no : '';
    let from_date:any=this.datepipe.transform(this.searchForm.value.fromDate, 'yyyy-MM-dd')?this.datepipe.transform(this.searchForm.value.fromDate, 'yyyy-MM-dd'):'';
    let to_date:any=this.datepipe.transform(this.searchForm.value.toDate, 'yyyy-MM-dd')?this.datepipe.transform(this.searchForm.value.toDate, 'yyyy-MM-dd'):'';
  
    // this.summaryLoaded = true
    this.searchForm.get('selectedOption').value;

    let record: string = '';
    const selectedOption = this.searchForm.get('selectedOption')?.value;
    
    if (selectedOption === 'Trial Balance') {
      record = 'Trial Balance';
    }
    //  else if (selectedOption === 'DATERANGE') {
    //   record = 'DATERANGE';
    // }
    else if(selectedOption === 'Detail Trial Balance') {
      record = 'Detail Trial Balance';
    }
    else if(selectedOption === 'Simple Trial Balance') {
      record = 'Simple Trial Balance';
    }
    else if(selectedOption === 'GL Trial Balance') {
      record = 'GL Trial Balance';
    } else if (selectedOption === 'Tran GL TB') {
      record = 'GL TB';
    }
    

if (record == ''){

}
    const formData = this.searchForm.value;
    const { fromDate, toDate, glNo, selectedBranch} = formData;
    let subcatName = '';
    let ccName = '';
    if(formData.subcatName!=null && formData.subcatName['microsubcatcode']!=undefined){
      subcatName = formData.subcatName['microsubcatcode'];
    }
    if(formData.ccName!=null && formData.ccName['microcccode']!=undefined){
      ccName = formData.ccName['microcccode'];
    }
    const selectedCCIds = this.selectedCCs.map(cc => cc.id).join(',');


    this.SpinnerService.show();

    if (record === 'Trial Balance') {
      this.service.getsum1(record, glno, this.chipSelectedBranchid, present_page, from_date, to_date)
  .subscribe(
    (data) => {
      this.SpinnerService.hide();
      if(data?.code!='' && data?.code!=null && data?.code!=undefined){
            this.notification.showError(data.code);
            this.notification.showError(data.description);
      }else{
      this.handleResponseData(data);
    }
    },
    (error: HttpErrorResponse) => {
      this.SpinnerService.hide();
      this.toastr.warning(error?.message);
    }
  );
        
    }
    //  +
    else if (record === 'Detail Trial Balance') {
      this.service.getsum3(record, this.chipSelectedBranchid, subcatName, ccName, from_date, to_date, present_page)
        .subscribe(
          (data) => {
              this.SpinnerService.hide();
              if(data?.code!='' && data?.code!=null && data?.code!=undefined){
                this.notification.showError(data.code);
                this.notification.showError(data.description);
          }else{
            this.handleResponseData(data);
          }},
          (error: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.toastr.warning(error?.message);
          }
        );
    }
    else if (record === 'Simple Trial Balance') {
      this.service.getsum2(record, glno, this.chipSelectedBranchid, present_page, from_date, to_date)
        .subscribe(
          (data) => {
              this.SpinnerService.hide();
              if(data?.code!='' && data?.code!=null && data?.code!=undefined){
                this.notification.showError(data.code);
                this.notification.showError(data.description);
          }else{
            this.handleResponseData(data);
          }},
          (error: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.toastr.warning(error?.message);
          }
        );
    }
    else if (record === 'GL Trial Balance') {
      this.service.getsum4(record,from_date,to_date,present_page,)
        .subscribe(
          (data) => {
              this.SpinnerService.hide();
              if(data?.code!='' && data?.code!=null && data?.code!=undefined){
                this.notification.showError(data.code);
                this.notification.showError(data.description);
          }else{
            this.handleResponseData(data);
          }},
          (error: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.toastr.warning(error?.message);
          }
        );
    }
     else if (record === 'GL TB') {
      if( from_date == "" || from_date == null || from_date == undefined){
        this.notification.showError("Please Select From Date")
        this.SpinnerService.hide()
        return true
      }
      if( to_date == "" || to_date == null || to_date == undefined){
        this.notification.showError("Please Select TO Date")
         this.SpinnerService.hide()
        return true
      }
      else{
      this.service.getsum4(record, from_date, to_date, present_page,)
        .subscribe(
          (data) => {
            this.SpinnerService.hide();
            if (data?.code != '' && data?.code != null && data?.code != undefined) {
              this.notification.showError(data.code);
              this.notification.showError(data.description);
            } else {
              this.handleResponseData(data);
            }
          },
          (error: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.toastr.warning(error?.message);
          }
        );
      }
    }
    else{
      this.service.getsum1(record, glno, this.chipSelectedBranchid, present_page, from_date, to_date)
      .subscribe(
        (data) => {
          this.SpinnerService.hide();
          if(data?.code!='' && data?.code!=null && data?.code!=undefined){
            this.notification.showError(data.code);
            this.notification.showError(data.description);
      }else{
          this.handleResponseData(data);
        }},
        (error: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.toastr.warning(error?.message);
        }
      );
    }
  }

  handleResponseData(data: any): void {
    this.SpinnerService.hide();
    if (data['ERROR'] == 'NO MATCHING RECORD') {
      this.toastr.error("No Record Found");
    } else {
      // this.toastr.success("Summary");
      this.tableData = data.data;
      this.loadsummary= false;
      const pagination = data?.pagination;
      this.has_previous = pagination.has_previous;
      this.has_next = pagination.has_next;
      this.present_page = pagination.index;
    }

  }
  
  isSimpleTB(): boolean {
    return this.searchForm.get('selectedOption')?.value === 'Simple Trial Balance';
  }
  isDetails(): boolean{
    return this.searchForm.get('selectedOption')?.value === 'Detail Trial Balance';
  }
  isGl(): boolean{
    return this.searchForm.get('selectedOption')?.value === 'GL Trial Balance';
  }
  isNormal(): boolean{
    return (this.searchForm.get('selectedOption')?.value === 'Trial Balance');
  }
  isLedgertb():boolean{
    return (this.searchForm.get('selectedOption')?.value === 'Ledger Trail Balance')
  }
  trangltbsummary():boolean{
    return (this.searchForm.get('selectedOption')?.value === 'Tran GL TB')
  }
  
 
  resetForm() {
    this.searchForm.reset();
    this.searchForm.patchValue({
      'selectedOption':'Trial Balance'
    });
    this.chipSelectedBranch = []; 
    this.selectedKeys=[]
    this.tableData = [];
    this.loadsummary=true;
    this.trangldb = false;
    // this.fetchTableData(1)
  }
  previousClick() {
    if (this.has_previous=== true) {
      this.present_page -=1;
      this.fetchTableData(this.present_page);
    }
  }
  nextClick() {
    if (this.has_next=== true) {
      this.present_page +=1;
      this.fetchTableData(this.present_page);
    }
  }
  branch_id:any=[]
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.branch_id.push({name: value.trim()});
    }

   
    if (input) {
      input.value = '';
    }
  }

  summary_table:boolean=true;
  ledger_summary:boolean=false;
  trangldb: boolean = false;
onOptionChange(): void {
  const selectedOption = this.searchForm.get('selectedOption')?.value;
  this.tableData=[];
  this.loadsummary=true;


  if (selectedOption === 'Trial Balance'  || selectedOption === 'Detail Trial Balance' ||selectedOption === 'Simple Trial Balance'||selectedOption === 'GL Trial Balance' || selectedOption === 'Tran GL TB') {
    
    // if (!this.isDateRangeSelected()) {
    //   this.searchForm.get('fromDate')?.reset();
    //   this.searchForm.get('toDate')?.reset();
    // } else {
    //   this.searchForm.get('selectedBranch')?.reset('');
    //   this.searchForm.get('GlNo')?.reset('');
    // }
    
   
    // this.fetchTableData(this.currentPage);
    this.trangldb = false;
    this.summary_table=true;
    this.ledger_summary=false;
    this.selectedKeys=[]
    this.searchForm.get('branchControl')?.reset();
    this.chipSelectedBranch = []; 
    this.searchForm.get('fromDate')?.reset();
    this.searchForm.get('toDate')?.reset();
    this.searchForm.get('selectedBranch')?.reset();
    this.searchForm.get('GlNo')?.reset();
   
  }
  else if(selectedOption === 'Ledger Trail Balance'){
    this.summary_table=false;
    this.ledger_summary=true;
     this.trangldb = false;
    this.ledger_reset();

  }
 


}


  
 



autocompletebranch(){
  console.log('second');
  setTimeout(()=>{
    if(this.matbranchAutocomplete && this.autocompletebranchTrigger && this.matbranchAutocomplete.panel){
      fromEvent(this.matbranchAutocomplete.panel.nativeElement,'scroll').pipe(
        map(x=>this.matbranchAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompletebranchTrigger.panelClosingActions)
      ).subscribe(
        x=>{
          const scrollTop=this.matbranchAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight=this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight=this.matbranchAutocomplete.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
          if(atBottom){
           if(this.has_branext){
            this.service.selectedbranch(this.branch_presentpage+1,this.branch.nativeElement.value).subscribe((data:any)=>{
               let dear:any=data['data'];
               console.log('second');
               let pagination=data['pagination']
               this.opts=this.opts.concat(dear);
               if(this.opts.length>0){
                 this.has_branext=pagination.has_next;
                 this.has_braprevious=pagination.has_previous;
                 this.branch_presentpage=pagination.index;
               }
             })
           }
          }
        }
      )
    }
  })
}

autocompletesubcat(){
  console.log('subcat');
  setTimeout(()=>{
    if(this.matsubcatAutocomplete && this.autocompletesubcatTrigger && this.matsubcatAutocomplete.panel){
      fromEvent(this.matsubcatAutocomplete.panel.nativeElement,'scroll').pipe(
        map(x=>this.matsubcatAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompletesubcatTrigger.panelClosingActions)
      ).subscribe(
        x=>{
          const scrollTop=this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight=this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight=this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
          if(atBottom){
           if(this.has_designnext){
            this.service.subcatList(this.designpage+1,this.subcat.nativeElement.value).subscribe((data:any)=>{
               let subcat:any=data['data'];
               console.log('second');
               let pagination=data['pagination']
               this.subcatList=this.subcatList.concat(subcat);
               if(this.subcatList.length>0){
                 this.has_designnext=pagination.has_next;
                 this.has_designpre=pagination.has_previous;
                 this.designpage=pagination.index;
               }
             })
           }
          }
        }
      )
    }
  })
}


autocompleteCC(){

  console.log('CC');
  setTimeout(()=>{
    if(this.matccAutocomplete && this.autocompleteccTrigger && this.matccAutocomplete.panel){
      fromEvent(this.matccAutocomplete.panel.nativeElement,'scroll').pipe(
        map(x=>this.matccAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteccTrigger.panelClosingActions)
      ).subscribe(
        x=>{
          const scrollTop=this.matccAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight=this.matccAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight=this.matccAutocomplete.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
          if(atBottom){
           if(this.has_ccnext){
            this.service.ccList(this.cc_presentpage+1,this.cc.nativeElement.value).subscribe((data:any)=>{
               let cc:any=data['data'];
               console.log('cc');
               let pagination=data['pagination']
               this.ccList=this.ccList.concat(cc);
               if(this.ccList.length>0){
                 this.has_ccnext=pagination.has_next;
                 this.has_ccprevious=pagination.has_previous;
                 this.cc_presentpage=pagination.index;
               }
             })
           }
          }
        }
      )
    }
  })
}


autocompleteglno(){

  console.log('glno');
  setTimeout(()=>{
    if(this.matglnoAutocomplete && this.autocompleteglnoTrigger && this.matglnoAutocomplete.panel){
      fromEvent(this.matglnoAutocomplete.panel.nativeElement,'scroll').pipe(
        map(x=>this.matglnoAutocomplete.panel.nativeElement.scrollTop),
        takeUntil(this.autocompleteglnoTrigger.panelClosingActions)
      ).subscribe(
        x=>{
          const scrollTop=this.matglnoAutocomplete.panel.nativeElement.scrollTop;
          const scrollHeight=this.matglnoAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight=this.matglnoAutocomplete.panel.nativeElement.clientHeight;
          const atBottom=scrollHeight-1 <= scrollTop+elementHeight;
          if(atBottom){
           if(this.has_glnonext){
            this.service.gl_noList(this.glno_presentpage+1,this.glno.nativeElement.value).subscribe((data:any)=>{
               let glno:any=data['data'];
               console.log('glno');
               let pagination=data['pagination']
               this.gl_no=this.gl_no.concat(glno);
               if(this.gl_no.length>0){
                 this.has_glnonext=pagination.has_next;
                 this.has_glnoprevious=pagination.has_previous;
                 this.glno_presentpage=pagination.index;
               }
             })
           }
          }
        }
      )
    }
  })
}

public BranchSelected(event: MatAutocompleteSelectedEvent): void {
  ;
  this.selectbranchByName(event.option.value.name);
  this.branch.nativeElement.value = '';
}
private selectbranchByName(branchName) {
  let foundbranch1 = this.chipSelectedBranch.filter(branch => branch.name == branchName);

  if (foundbranch1.length) {
    // console.log('found in chips');
    return;
  }
  let foundbranch = this.opts.filter(branch => branch.name == branchName);
  if (foundbranch.length) {
   
    this.chipSelectedBranch.push(foundbranch[0]);
    this.chipSelectedBranchid.push(foundbranch[0].id)
    
    let employeebranchId = foundbranch[0].id
    this.branchIds = employeebranchId
    
  }
}
public removeEmployee(branch: branch): void {
  const index = this.chipSelectedBranch.indexOf(branch);
  if (index >= 0) {

    this.chipSelectedBranch.splice(index, 1);
  
    this.chipSelectedBranchid.splice(index, 1);

    this.branch.nativeElement.value = '';
  }

}

reportExcelDownload(){
  if(this.second == true){
    this.toastr.warning('Already Progress')
    return true
  }
  
  this.second=true
  let data:any={
    "from_date":this.datepipe.transform(this.searchForm.get('fromDate').value,'yyyy-MM-dd')?this.datepipe.transform(this.searchForm.get('fromDate').value,'yyyy-MM-dd'):'',
    "to_date":this.datepipe.transform(this.searchForm.get('toDate').value,'yyyy-MM-dd')?this.datepipe.transform(this.searchForm.get('toDate').value,'yyyy-MM-dd'):'',
   "enb":"1" 
  };
  this.SpinnerService.show();
  this.toastr.warning('Wait for 3 minutes','',{timeOut:20000,progressBar:true,progressAnimation:'decreasing'});
  
 
  this.service.tb_reportExceldownload(data).subscribe(result=>{
    console.log(result);
   
    this.SpinnerService.hide();
    if(result.code!=undefined && result.code!="" && result.code!=null){
      // this.notification.showWarning(result.code);
      this.notification.showWarning(result.code);
      this.second=false;
      // this.toastr.clear();
      // this.toastr.warning(result['code']);
      // this.toastr.error(result['description']);
    }
    else{
    
      if(result['status'] == "SUCCESS"){
        this.toastr.success(result['description']);
      }
      // setTimeout(() => {
      //   /** spinner ends after 3 seconds */
      //   this.SpinnerService.hide();
      //   }, 3000);
      // alert('Success');
      this.second=false;
    }
    
  },
  (error)=>{
    this.second=false;
    this.toastr.warning(error.description)
  });
  // setTimeout(()=>{
  //   this.second=false;
  //   this.downloadForecastFlag = false;
  //   this.toastr.success('Excel Prepared Successfully');
  //   // this.toastr.success('Excel Prepared Successfully','',{timeOut:3000});
  // },300000);
  console.log('final Execute');
}

valid_arr: FormData = new FormData();
selectedFile: File | null = null;
onFileSelected(event: any): void {
  const file: File = event.target.files[0];

  if (file && (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    this.selectedFile = file;
    console.log('Selected file:', file.name);
    this.valid_arr.append('file', file, file.name); 
  } else {
    console.error('No file selected or file is not an Excel file');
    this.toastr.error('Please select an Excel file');
    this.selectedFile = null;
  }
}
  
uploadFile() {
  this.SpinnerService.show()
  if (this.selectedFile) {
    if (!this.valid_arr.has('file')) {
      this.toastr.error('Please select a file');
      return;
    }
    this.service.upload(this.valid_arr).subscribe(response => {
        console.log('Upload successful:', response);
        this.SpinnerService.hide()
        if(response['status'] == "success"){
          this.toastr.success(response['message']);}
        this.resetUpload()
      },
      error => {
        console.error('Upload failed:', error);
        this.SpinnerService.hide()
        if(error['status'] == "error"){
          this.toastr.error(error['message']);}
        this.resetUpload()
      }
    );
  } else {
    console.error('No file selected to upload');
    this.SpinnerService.hide()
    this.toastr.error('Please select a file');
    this.resetUpload()
  }
}
resetUpload(): void {
  this.selectedFile = null;
  this.valid_arr = new FormData(); 
  this.searchForm.get('CBFile')?.reset();
  
}
ReconStop:boolean=false;
ReconPrepareEX:boolean=true;
ReconDownload:boolean=false;
stop(){
//   if (!this.first) {
//     console.log('No preparation in progress to stop.');
//     return;
//   }

//   this.first = false;
//   console.log('Preparation has been stopped.');
//   this.toastr.warning('Preparation has been stopped.')
// }

this.ReconDownload = true
this.five=false
this.SpinnerService.show();
this.service.TB_Recon_Stop().subscribe(result=>{
  console.log(result);
  this.ReconStop= true;
    this.ReconPrepareEX = false;
   
  this.SpinnerService.hide();
  if(result.code!=undefined && result.code!="" && result.code!=null){
    this.toastr.warning(result['code']);
    this.toastr.warning(result['description']);
  }
  else{
  
    if(result['status'] == "success"){
      this.toastr.success("Stopped Successfully");
    }
   
  }
  
},
(error)=>{
  // this.second=false;
  this.toastr.error(error.description)
});


}
// Recon_Download(){
//   this.ReconPrepareEX=false;
//   this.ReconStop=true
//   this.ReconDownload = false
// }
icon: boolean = false;

click(){
    this.icon = !this.icon;
  }
  simpleReconStop:boolean=false;
  simpleReconPrepareEX:boolean=true;
  simpleReconDownload:boolean=false;
  btn_spinner:boolean=false;
  btn_spinner2:boolean=false;
  simpleReconPrepare(){
    if(this.btn_spinner == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.btn_spinner=true
    this.simpleReconStop= true;
    // this.SpinnerService.show();
    this.toastr.success('Started preparing Excel.')
    console.log('Started preparing Excel.');
    this.service.getsimpleTbEXcelPrepare().subscribe(result=>{
      console.log(result);
     
    this.simpleReconPrepareEX = false;
    this.simpleReconDownload = true
    this.btn_spinner=false
      if(result['code']!=undefined && result['code']!=""){
        // this.SpinnerService.hide();
        this.btn_spinner=false;
        this.toastr.clear();
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);
      }
      
    }
    (error)=>{
      this.btn_spinner=false;
      this.toastr.warning(error.status+error.statusText)
    }});
   
  }
  simple_reconstop(){
 
    
    this.simpleReconDownload = true
    this.btn_spinner=false
    this.SpinnerService.show();
    this.service.Simple_TB_Recon_Stop().subscribe(result=>{
      console.log(result);
      this.simpleReconStop= true;
        this.simpleReconPrepareEX = false;
       
      this.SpinnerService.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
      
        if(result['status'] == "success"){
          this.toastr.success("Stopped Successfully");
          this.filedtp_summary();
        }
       
      }
      
    },
    (error)=>{
      this.btn_spinner=false;
      this.toastr.warning(error.status+error.statusText)
    });      
  }
  SIMPLE_TB_Recon_Download() {
    this.btn_spinner2=true;
    this.service.simple_getTbReconDownload(this.dtb_tb_summary?.filename).subscribe(
      (res: any) => {
        this.simpleReconPrepareEX= true
        this.simpleReconStop=false
        this.simpleReconDownload = false
        this.btn_spinner2=false;

        if (res?.code) {
          this.toastr.warning(res['code']);
          this.toastr.warning(res['description']);
        } else {
        
            this.toastr.success("Successfully Downloaded");

            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `Simple_TB_With_DTB_Recon _${formattedDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.btn_spinner2 = false;
        this.toastr.warning(error.status+error.statusText)
      }
    );
  }
  pprReconStop:boolean=false;
  pprReconPrepareEX:boolean=true;
  pprReconDownload:boolean=false;
  btn_ppr_spinner:boolean=false;
  btn_ppr_spinner2:boolean=false;

  PPR_ReconPrepare(){
    if(this.btn_ppr_spinner == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.btn_ppr_spinner=true
    this.pprReconStop= true;
    // this.SpinnerService.show();
    this.toastr.success('Started preparing Excel.')
    console.log('Started preparing Excel.');
    this.service.PPRTBEXcelPrepare().subscribe(result=>{
      console.log(result);
     
    this.pprReconPrepareEX = false;
    this.pprReconDownload = true
    this.btn_ppr_spinner=false
      if(result['code']!=undefined && result['code']!=""){
        // this.SpinnerService.hide();
        this.btn_ppr_spinner=false;
        this.toastr.clear();
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);
      }
      
    }
    (error)=>{
      this.btn_ppr_spinner=false;
      this.toastr.warning(error.status+error.statusText)
    }});
   
  }
  PPR_reconstop(){
 
  
    this.pprReconDownload = false;
    this.btn_ppr_spinner=false;
    this.pprReconStop= false;
    this.SpinnerService.show();
    this.service.PPR_TB_Recon_Stop().subscribe(result=>{
      console.log(result);
      this.pprReconPrepareEX = false; 
      this.SpinnerService.hide();
      if(result.code!=undefined && result.code!="" && result.code!=null){
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
      
        if(result['status'] == "success"){
          this.toastr.success("Stopped Successfully");
          this.filerecon_summary();
        }
       
      }
      
    },
    (error)=>{
      this.btn_ppr_spinner=false;
      this.toastr.warning(error.status+error.statusText)
    });      
  }
  PPR_TB_Recon_Download() {
    this.btn_ppr_spinner2=true;
    this.service.PPRTbReconDownload(this.ppr_summary?.filename).subscribe(
      (res: any) => {
        this.pprReconPrepareEX= true
        this.pprReconStop=false
        this.pprReconDownload = false
        this.btn_ppr_spinner2=false;

        if (res?.code) {
          this.toastr.warning(res['code']);
          this.toastr.warning(res['description']);
        } else {
        
            this.toastr.success("Successfully Downloaded");

            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `Simple_DTB_With_PPR_Recon_${formattedDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.btn_ppr_spinner2 = false;
        this.toastr.warning(error.status+error.statusText)
      }
    );
  }
  ppr_summary:any
  filerecon_summary(){
    this.SpinnerService.show();
    this.service.PPRTbReconsummary().subscribe(result=>{
      this.SpinnerService.hide();
      if(result?.code!=undefined && result?.code!=null && result?.code!=''){
        this.notification.showWarning(result?.code);
        this.notification.showWarning(result?.description);
      }else{
        this.ppr_summary=result.querydata
      }
    },(error:HttpErrorResponse)=>{
      this.SpinnerService.hide();
      this.notification.showError(error.status + error.message);
    })
  }
  dtb_tb_summary:any;
  dtb_closingbal:any;
  filedtp_summary(){
    this.SpinnerService.show();
    this.service.Tb_DTB_Reconsummary().subscribe(result=>{
      this.SpinnerService.hide();
      if(result?.code!=undefined && result?.code!=null && result?.code!=''){
        this.notification.showWarning(result?.code);
        this.notification.showWarning(result?.description);
      }else{
        this.dtb_tb_summary=result.TB_WITH_DTB;
        this.dtb_closingbal=result.CB_RECON;
      }
    },(error:HttpErrorResponse)=>{
      this.SpinnerService.hide();
      this.notification.showError(error.status + error.message);
    })
  }
  

  btn_spinner_cltb:boolean=false;
  closing_balPrepareEX:boolean=false;

  closingbalPrepare(){
    if(this.btn_spinner_cltb == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.btn_spinner_cltb=true
    this.closing_balPrepareEX=true;
    // this.SpinnerService.show();
    this.toastr.success('Started preparing Excel.')
    this.service.Closingbal_EXcelPrepare().subscribe(result=>{
      this.btn_spinner_cltb=false;
      this.closing_balPrepareEX=false;
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.toastr.clear();
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);
      }
      
    }
    (error)=>{
      this.btn_spinner_cltb=false;
      this.toastr.warning(error.status+error.statusText)
    }});
   
  }

  btn_spinner_cltbd:boolean=false;

  ClosingBal__Download() {
    this.btn_spinner_cltbd=true;
    this.service.closingbal_tb_Download(this.dtb_closingbal?.filename).subscribe(
      (res: any) => {
        
        this.btn_spinner_cltbd=false;

        if (res?.type=='application/json') {
          this.toastr.warning("UNEXPECTED_ERROR");
        } else {
        
            this.toastr.success("Successfully Downloaded");

            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `Closing_Balance_Download _${formattedDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.btn_spinner_cltbd = false;
        this.toastr.warning(error.status+error.statusText)
      }
    );
  }
  bankrecon_data:any
  bankrecon_summary(){
    this.SpinnerService.show();
    this.service.bankrecon_TB_summary().subscribe(result=>{
      this.SpinnerService.hide();
      if(result?.code!=undefined && result?.code!=null && result?.code!=''){
        this.notification.showWarning(result?.code);
        this.notification.showWarning(result?.description);
      }else{
        this.bankrecon_data=result.CB_RECON
      }
    },(error:HttpErrorResponse)=>{
      this.SpinnerService.hide();
      this.notification.showError(error.status + error.message);
    })
  }
  btn_spinner_bankrecon:boolean=false;
  bankrecon_btn:boolean=false;
  bankrecon_excelPrepare(){
    if(this.trialbalForm.get('bankreconfromdate').value==null || this.trialbalForm.get('bankreconfromdate').value==undefined || this.trialbalForm.get('bankreconfromdate').value==''){
      this.toastr.warning('Please Select From Date');
      return false;
    }
    if(this.trialbalForm.get('bankrecontodate').value==null || this.trialbalForm.get('bankrecontodate').value==undefined || this.trialbalForm.get('bankrecontodate').value==''){
      this.toastr.warning('Please Select To Date');
      return false;
    }
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('bankreconfromdate').value,'yyyy-MM-dd'),
      "to_date":this.datepipe.transform(this.trialbalForm.get('bankrecontodate').value,'yyyy-MM-dd'),
    };
    if(this.btn_spinner_bankrecon == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.btn_spinner_bankrecon=true
    this.bankrecon_btn=true;
    this.toastr.success('Started preparing Excel.')
    this.service.bankrecon_ExcelPrepare(data).subscribe(result=>{
      this.btn_spinner_bankrecon=false;
      this.bankrecon_btn=false;
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.toastr.clear();
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);
          this.bankrecon_summary();
      }
      
    }
    (error)=>{
      this.btn_spinner_bankrecon=false;
      this.toastr.warning(error.status+error.statusText)
    }});
   
  }
  btn_spinner_bankrecondow:boolean=false;
  Bankrecon__Download() {
    this.btn_spinner_bankrecondow=true;
    this.service.bankrecon_tb_Download(this.bankrecon_data?.filename).subscribe((res: any) => {  
        this.btn_spinner_bankrecondow=false;

        if (res?.type=='application/json') {
          this.toastr.warning("UNEXPECTED_ERROR");
        } else {
        
            this.toastr.success("Successfully Downloaded");

            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `Bank_Recon_Download _${formattedDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.btn_spinner_bankrecondow = false;
        this.toastr.warning(error.status+error.statusText)
      }
    );
  }
  glrecon_data:any
  glrecon_summary(){
    this.SpinnerService.show();
    this.service.glrecon_TB_summary().subscribe(result=>{
      this.SpinnerService.hide();
      if(result?.code!=undefined && result?.code!=null && result?.code!=''){
        this.notification.showWarning(result?.code);
        this.notification.showWarning(result?.description);
      }else{
        this.glrecon_data=result.CB_RECON
      }
    },(error:HttpErrorResponse)=>{
      this.SpinnerService.hide();
      this.notification.showError(error.status + error.message);
    })
  }
  btn_spinner_glrecon:boolean=false;
  glrecon_btn:boolean=false;
  glrecon_excelPrepare(){
    console.log(this.trialbalForm.get('glreconinvoicedate').value)
    if(this.trialbalForm.get('glreconinvoicedate').value==null || this.trialbalForm.get('glreconinvoicedate').value==undefined || this.trialbalForm.get('glreconinvoicedate').value==''){
      this.toastr.warning('Please Select Invoice Date');
      return false;
    }

    let from_date:any=this.datepipe.transform(this.trialbalForm.get('glreconinvoicedate').value,'yyyy-MM-dd')
     
    if(this.btn_spinner_glrecon == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.btn_spinner_glrecon=true
    this.glrecon_btn=true;
    this.toastr.success('Started preparing Excel.')
    this.service.glrecon_ExcelPrepare(from_date).subscribe(result=>{
      this.btn_spinner_glrecon=false;
      this.glrecon_btn=false;
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.toastr.clear();
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);
          this.glrecon_summary();
      }
      
    }
    (error)=>{
      this.btn_spinner_glrecon=false;
      this.toastr.warning(error.status+error.statusText)
    }});
   
  }
  btn_spinner_glrecondow:boolean=false;
  glrecon_Download() {
    this.btn_spinner_glrecondow=true;
    this.service.glrecon_tb_Download(this.glrecon_data?.filename).subscribe((res: any) => {  
        this.btn_spinner_glrecondow=false;

        if (res?.type=='application/json') {
          this.toastr.warning("UNEXPECTED_ERROR");
        } else {
        
            this.toastr.success("Successfully Downloaded");

            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `GL_Recon_Download _${formattedDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.btn_spinner_glrecondow = false;
        this.toastr.warning(error.status+error.statusText)
      }
    );
  }
  fa_internal_recon:any
  fa_ppr_recon:any
  Fa_recon_summary(){
    this.SpinnerService.show();
    this.service.Fa_recon_TB_summary().subscribe(result=>{
      this.SpinnerService.hide();
      if(result?.code!=undefined && result?.code!=null && result?.code!=''){
        this.notification.showWarning(result?.code);
        this.notification.showWarning(result?.description);
      }else{
        this.fa_internal_recon=result.internal_rec;
        this.fa_ppr_recon=result.fa_ppr_rec;

      }
    },(error:HttpErrorResponse)=>{
      this.SpinnerService.hide();
      this.notification.showError(error.status + error.message);
    })
  }
  btn_spinner_farecon:boolean=false;
  farecon_btn:boolean=false;
  FA_internal_excelPrepare(){
    if(this.trialbalForm.get('fareconfromdate').value==null || this.trialbalForm.get('fareconfromdate').value==undefined || this.trialbalForm.get('fareconfromdate').value==''){
      this.toastr.warning('Please Select From Date');
      return false;
    }
    if(this.trialbalForm.get('farecontodate').value==null || this.trialbalForm.get('farecontodate').value==undefined || this.trialbalForm.get('farecontodate').value==''){
      this.toastr.warning('Please Select To Date');
      return false;
    }
    let data:any={
      "fromdate":this.datepipe.transform(this.trialbalForm.get('fareconfromdate').value,'yyyy-MM-dd'),
      "todate":this.datepipe.transform(this.trialbalForm.get('farecontodate').value,'yyyy-MM-dd'),
    };
    if(this.btn_spinner_farecon == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.btn_spinner_farecon=true
    this.farecon_btn=true;
    this.toastr.success('Started preparing Excel.')
    this.service.FA_internal_ExcelPrepare(data).subscribe(result=>{
      this.btn_spinner_farecon=false;
      this.farecon_btn=false;
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.toastr.clear();
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);
          this.Fa_recon_summary();

      }
      
    }
    (error)=>{
      this.btn_spinner_farecon=false;
      this.toastr.warning(error.status+error.statusText)
    }});
   
  }
  btn_spinner_farecondow:boolean=false;
  farecondown:boolean=false;
  FA_internal_recon_Download() {
    this.btn_spinner_farecondow=true;
    this.farecondown=true;
    this.service.FA_internal_recon_Download(this.fa_internal_recon?.filename).subscribe((res: any) => {  
        this.btn_spinner_farecondow=false;
        this.farecondown=false;

        if (res?.type=='application/json') {
          this.toastr.warning("UNEXPECTED_ERROR");
        } else {
        
            this.toastr.success("Successfully Downloaded");
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `FA_Internal_Recon_Report _${formattedDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.btn_spinner_farecondow = false;
        this.farecondown=false;
        this.toastr.warning(error.status+error.statusText)
      }
    );
  }
  btn_spinner_fadata:boolean=false;
  fa_data_btn:boolean=false;
  FA_ppr_excelPrepare(){
    if(this.trialbalForm.get('fa_ppr_fromdate').value==null || this.trialbalForm.get('fa_ppr_fromdate').value==undefined || this.trialbalForm.get('fa_ppr_fromdate').value==''){
      this.toastr.warning('Please Select From Date');
      return false;
    }
    if(this.trialbalForm.get('fa_ppr_todate').value==null || this.trialbalForm.get('fa_ppr_todate').value==undefined || this.trialbalForm.get('fa_ppr_todate').value==''){
      this.toastr.warning('Please Select To Date');
      return false;
    }
    let data:any={
      "fromdate":this.datepipe.transform(this.trialbalForm.get('fa_ppr_fromdate').value,'yyyy-MM-dd'),
      "todate":this.datepipe.transform(this.trialbalForm.get('fa_ppr_todate').value,'yyyy-MM-dd'),
    };
    if(this.btn_spinner_fadata == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.btn_spinner_fadata=true
    this.fa_data_btn=true;
    this.toastr.success('Started preparing Excel.')
    this.service.FA_ppr_ExcelPrepare(data).subscribe(result=>{
      this.btn_spinner_fadata=false;
      this.fa_data_btn=false;
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.toastr.clear();
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);
          this.Fa_recon_summary();
      }
      
    }
    (error)=>{
      this.btn_spinner_fadata=false;
      this.toastr.warning(error.status+error.statusText)
    }});
   
  }
  btn_spinner_fadatadow:boolean=false;
  fadatadown:boolean=false;
  FA_PPR__Download() {
    this.btn_spinner_fadatadow=true;
    this.fadatadown=true;
    this.service.FA_ppr_recon_Download(this.fa_ppr_recon?.filename).subscribe((res: any) => {  
        this.btn_spinner_fadatadow=false;
        this.fadatadown=false;

        if (res?.type=='application/json') {
          this.toastr.warning("UNEXPECTED_ERROR");
        } else {
        
            this.toastr.success("Successfully Downloaded");
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `FA_With_PPR_Recon_Report _${formattedDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.btn_spinner_fadatadow = false;
        this.fadatadown=false;
        this.toastr.warning(error.status+error.statusText)
      }
    );
  }
  // Years:number[]=[];
  // months=[{'id':1,'name':'Jan'},{'id':1,'name':'Feb'},{'id':1,'name':'Mar'},{'id':1,'name':'Apr'},{'id':1,'name':'May'},{'id':1,'name':'Jun'},
  //   {'id':1,'name':'Jul'},{'id':1,'name':'Aug'},{'id':1,'name':'Sep'},{'id':1,'name':'Oct'},{'id':1,'name':'Nov'},{'id':1,'name':'Dec'}]

  // year_for_LTB(){
  //   const currentYear =new Date().getFullYear();
  //   const startYear=2000;
  //   for(let year=currentYear;year >=startYear; year--){
  //     this.Years.push(year)
  //   }
  // }


  ledger_reset(){
    this.searchForm.controls['from_ledger'].reset('');
    this.searchForm.controls['to_ledger'].reset('');
    this.ledger_tblist=[];
  }
  ledger_errordate(){
    if(!(this.searchForm.get('from_ledger').value)){
      this.searchForm.get('to_ledger').reset('');
      this.toastr.warning("Please Select From Date");
      return false;
    }else{
      const FromDate=this.searchForm.get('from_ledger').value;
      const ToDate=this.searchForm.get('to_ledger').value
      if(FromDate&&ToDate){
        const d= new Date(FromDate) <new Date(ToDate) ;
        if(!d){
          this.searchForm.get('to_ledger').reset('');
        this.toastr.warning('To Date Must be Greater than From Date');
        return false;

        }
      }
    }
  }
  ledgerFromDate:any;
  ledgerToDate:any;
  Fin_Type:any;
  FilterFromDate = (d: Date | null): boolean => {
    const month = (d || new Date()).getMonth(); 
    return month === 0 || month === 3 || month === 6 || month === 9; 
  };
  FilterToDate = (d: Date | null): boolean => {
    const month = (d || new Date()).getMonth(); 
    return month === 2 || month === 5 || month === 8 || month === 11; 
  };
  onDateChangefromledger(event: any) {
   this.ledgerFromDate = event.value;
    console.log('Selected Date: ',  this.ledgerFromDate);
    this.checkDateRange();
  }
  onDateChangetoledger(event: any) {
    this.ledgerToDate = event.value;
    console.log('Selected Date: ',  this.ledgerToDate );
    this.checkDateRange();
  }
  checkDateRange() {
    if (this.ledgerFromDate && this.ledgerToDate) {
      const monthsDifference = this.calculateMonthDifference(this.ledgerFromDate, this.ledgerToDate);

      if (monthsDifference === 2) {
        this.Fin_Type = 'fin_qtr';
      } else if (monthsDifference === 11) {
        this.Fin_Type = 'fin_year';
      } else {
        this.toastr.error("Please Select the Fin Year or Fin Quater");
        this.searchForm.controls['to_ledger'].reset('');
      }
    }
  }
  calculateMonthDifference(startDate: Date, endDate: Date): number {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthDiff = endDate.getMonth() - startDate.getMonth();
    return yearDiff * 12 + monthDiff;
  }
  ledger_tblist: Array<any> = [];
  prev_ledger:boolean=false;
  next_ledger:boolean=true;
  ledger_page:number=1;
  

  fetch_Ledgersummary(page){
    if(this.searchForm.get('from_ledger').value==null ||this.searchForm.get('from_ledger').value==undefined || this.searchForm.get('from_ledger').value==''){
      this.toastr.warning('Please Select the From Date');
      return false;
    }
    if(this.searchForm.get('to_ledger').value == null ||this.searchForm.get('to_ledger').value == undefined || this.searchForm.get('to_ledger').value == ''){
      this.toastr.warning('Please Select The To Date');
      return false;
    }
    let data:any={
      'from_date':this.datepipe.transform(this.searchForm.get('from_ledger').value,'yyyy-MM-dd'),
      'to_date':this.datepipe.transform(this.searchForm.get('to_ledger').value,'yyyy-MM-dd'),
      'type':this.Fin_Type
    }
    this.SpinnerService.show();
    this.service.LedgerSummary_data(data,page).subscribe((results)=>{
      this.SpinnerService.hide()
      if(results && results['data']){
        this.ledger_tblist=results['data'];
        let pagination=results['pagination']
        if(this.ledger_tblist.length>0){
          this.prev_ledger=pagination.has_previous;
          this.next_ledger=pagination.has_next;
          this.ledger_page=pagination.index;
        }
      }else if(results && results['code'] && results['description']){
        this.toastr.error(results['description'])
      }else{
        this.toastr.warning(results['description'])
      }      
    },(error)=>{
      this.toastr.error(error.status+error.statusText)

    })
  }
  btn_spinner_ledgertb:boolean=false;
  ledgertb_btn:boolean=false;
  Ledgertb_excelPrepare(){
    if(this.searchForm.get('from_ledger').value==null ||this.searchForm.get('from_ledger').value==undefined || this.searchForm.get('from_ledger').value==''){
      this.toastr.warning('Please Select the From Date');
      return false;
    }
    if(this.searchForm.get('to_ledger').value == null ||this.searchForm.get('to_ledger').value == undefined || this.searchForm.get('to_ledger').value == ''){
      this.toastr.warning('Please Select The To Date');
      return false;
    }
    let data:any={
      'from_date':this.datepipe.transform(this.searchForm.get('from_ledger').value,'yyyy-MM-dd'),
      'to_date':this.datepipe.transform(this.searchForm.get('to_ledger').value,'yyyy-MM-dd'),
      'type':this.Fin_Type
    }
    if(this.btn_spinner_ledgertb == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.btn_spinner_ledgertb=true
    this.ledgertb_btn=true;
    this.toastr.success('Started preparing Excel.')
    this.service.Ledgertb_excelPrepare(data).subscribe(result=>{
      this.btn_spinner_ledgertb=false;
      this.ledgertb_btn=false;
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.toastr.clear();
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);

      }
      
    }
    (error)=>{
      this.btn_spinner_ledgertb=false;
      this.toastr.warning(error.status+error.statusText)
    }});
   
  }
  btn_spinner_ledtbdow:boolean=false;
  ledgertb_dow:boolean=false;
  Ledger_tb_Download() {
    this.btn_spinner_ledtbdow=true;
    this.ledgertb_dow=true;
    this.service.Ledger_tb_Download().subscribe((res: any) => {  
        this.btn_spinner_ledtbdow=false;
        this.ledgertb_dow=false;

        if (res?.type=='application/json') {
          this.toastr.warning("UNEXPECTED_ERROR");
        } else {
        
            this.toastr.success("Successfully Downloaded");
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `Ledger_TrailBalance_Report _${formattedDate}.xlsx`;
            document.body.appendChild(a );
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.btn_spinner_ledtbdow = false;
        this.ledgertb_dow=false;
        this.toastr.warning(error.status+error.statusText)
      }
    );
  }
  Ledger_previous(){
    if(this.prev_ledger==true){
      this.fetch_Ledgersummary(this.ledger_page-1)
    }
  }
  Ledger_next(){
    if(this.next_ledger==true){
      this.fetch_Ledgersummary(this.ledger_page+1)
    }
  }
 

  onGLDateChange(selectedDate: any) {
    this.fromDate = selectedDate;
    this.searchForm.get('toDate')?.setValue(selectedDate);
    console.log('Updated To Date:', this.searchForm.get('toDate')?.value);
  }
  onTBGLDateChange(selectedDate: any) {
    this.fromDate = selectedDate;
    this.trialbalForm.get('todate')?.setValue(selectedDate);
  }

  GLtb_checked:boolean=false;
  gltb_checkboxchange(event){
    this.GLtb_checked=event.checked;
  }
  GLPrepare(){
    if(this.first == true){
      this.toastr.warning('Already Progress')
      return true
    }
    if(this.searchForm.get('fromDate').value==''||this.searchForm.get('fromDate').value==undefined || this.searchForm.get('fromDate').value==null){
      this.toastr.warning("Please Select The  Date")
      return false;
    }
  
    let fromdate:any=this.datepipe.transform(this.searchForm.get('fromDate').value,'yyyy-MM-dd')||'';
    let todate:any=this.datepipe.transform(this.searchForm.get('toDate').value,'yyyy-MM-dd')||'';
    let type:any;
    if(this.GLtb_checked){
      type='fin_year'
    }else{
      type=''
    }
    this.first=true
    let data:any={
      "from_date":this.datepipe.transform(this.searchForm.get('fromDate').value,'yyyy-MM-dd')||'',
      "to_date":this.datepipe.transform(this.searchForm.get('toDate').value,'yyyy-MM-dd')||'',
      "enb":"1" ,
      "type":type

    };
    this.SpinnerService.show();
       this.service.getGLTbPrepare(data).subscribe(result=>{
      console.log(result);
      this.first=false;
      this.SpinnerService.hide();
      if(result['status']=='success'){
        this.toastr.success(result['message'])
      }
      else {
        this.toastr.warning(result['description']);
      }
      
    },
    (error)=>{
      this.first=false;
      this.toastr.warning(error.status+error.statusText)
    });
  }

  GLtb_report_download(){
    // let fromdate:any=this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'';
    // let todate:any=this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):'';
    if(this.third == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.third=true
    let data:any={
      "from_date":"",//this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('fromdate').value,'yyyy-MM-dd'):'',
      "to_date":"",//this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('todate').value,'yyyy-MM-dd'):''
      };
    this.service.GL_report_Download()
    .subscribe(fullXLS=>{
      if(fullXLS['type']=='application/json'){
        this.toastr.warning("INVALID DATA");
        this.third=false;
      }
      else{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Trial_Balance_Download'+ date +".xlsx";
        link.click();
        this.third=false;
        this.toastr.success('Excel Download Successfully');
      }
     
    },
    (error)=>{
      this.third=false;
      this.toastr.warning(error.description)
    });
  }


  btn_spin_brangl_xl:boolean=false;
  branchgl_btn:boolean=false;
  branchgltb_excelPrepare(){
    if(this.trialbalForm.get('branch_gl_fromdate').value==null || this.trialbalForm.get('branch_gl_fromdate').value==undefined || this.trialbalForm.get('branch_gl_fromdate').value==''){
      this.toastr.warning('Please Select From Date');
      return false;
    }
    if(this.trialbalForm.get('branch_gl_todate').value==null || this.trialbalForm.get('branch_gl_todate').value==undefined || this.trialbalForm.get('branch_gl_todate').value==''){
      this.toastr.warning('Please Select To Date');
      return false;
    }
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('branch_gl_fromdate').value,'yyyy-MM-dd'),
      "to_date":this.datepipe.transform(this.trialbalForm.get('branch_gl_todate').value,'yyyy-MM-dd'),
      'branch':this.trialbalForm.get('branchgl_empbranch').value?this.trialbalForm.get('branchgl_empbranch').value.id:'',
      'expense_id':this.trialbalForm.get('branchgl_expen').value?this.trialbalForm.get('branchgl_expen').value.id:'',
      'gl_no':this.trialbalForm.get('branchgl_no').value?this.trialbalForm.get('branchgl_no').value.no:'',
      'type':'prepare'
    };
    if(this.btn_spin_brangl_xl == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.btn_spin_brangl_xl=true
    this.branchgl_btn=true;
    this.toastr.success('Started preparing Excel.')
    this.service.branch_gl_ExcelPrepare(data).subscribe(result=>{
      this.btn_spin_brangl_xl=false;
      this.branchgl_btn=false;
      this.toastr.clear();
      if(result['code']!=undefined && result['code']!=""){
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);
      }
      
    }
    (error)=>{
      this.btn_spin_brangl_xl=false;
      this.toastr.warning(error.status+error.statusText)
    }});
   
  }


  branchwisegl_tblist: Array<any> = [];
  prev_branchgl:boolean=false;
  next_branchgl:boolean=true;
  branchgl_page:number=1;
  

  branchwisegl_summary(page){
    if(this.trialbalForm.get('branch_gl_fromdate').value==null ||this.trialbalForm.get('branch_gl_fromdate').value==undefined || this.trialbalForm.get('branch_gl_fromdate').value==''){
      this.toastr.warning('Please Select the From Date');
      return false;
    }
    if(this.trialbalForm.get('branch_gl_todate').value == null ||this.trialbalForm.get('branch_gl_todate').value == undefined || this.trialbalForm.get('branch_gl_todate').value == ''){
      this.toastr.warning('Please Select The To Date');
      return false;
    }
    let data:any={
      'from_date':this.datepipe.transform(this.trialbalForm.get('branch_gl_fromdate').value,'yyyy-MM-dd'),
      'to_date':this.datepipe.transform(this.trialbalForm.get('branch_gl_todate').value,'yyyy-MM-dd'),
      'branch':this.trialbalForm.get('branchgl_empbranch').value?this.trialbalForm.get('branchgl_empbranch').value.id:'',
      'expense_id':this.trialbalForm.get('branchgl_expen').value?this.trialbalForm.get('branchgl_expen').value.id:'',
      'gl_no':this.trialbalForm.get('branchgl_no').value?this.trialbalForm.get('branchgl_no').value.no:'',
      'type':'summary'
      
    }
    this.SpinnerService.show();
    this.service.Branchwisegl_Summary(data,page).subscribe((results)=>{
      this.SpinnerService.hide()
        this.branchwisegl_tblist=results['data'];
        let pagination=results['pagination']
        if(this.branchwisegl_tblist.length>0){
          this.prev_branchgl=pagination.has_previous;
          this.next_branchgl=pagination.has_next;
          this.branchgl_page=pagination.index; 
        }    
    })
  }
  branchwisegl_reset(){
    this.trialbalForm.get('branch_gl_fromdate')?.reset('')
    this.trialbalForm.get('branch_gl_todate')?.reset('')
    this.trialbalForm.get('branchgl_empbranch')?.reset('')
    this.trialbalForm.get('branchgl_expen')?.reset('')
    this.trialbalForm.get('branchgl_no')?.reset('')
    this.branchwisegl_tblist=[]
  }

  branchgl_previous(){
    if(this.prev_branchgl==true){
      this.branchwisegl_summary(this.branchgl_page-1)
    }
  }
  branchgl_next(){
    if(this.next_branchgl==true){
      this.branchwisegl_summary(this.branchgl_page+1)
    }
  }

  btn_spinner_branchglbdow:boolean=false;
  brangltb_dow:boolean=false;
  branchwisegl_tb_Download() {
    this.btn_spinner_branchglbdow=true;
    this.brangltb_dow=true;
    this.service.branchwise_gl_Download().subscribe((res: any) => {  
        this.btn_spinner_branchglbdow=false;
        this.brangltb_dow=false;

        if (res?.type=='application/json') {
          this.toastr.warning("UNEXPECTED_ERROR");
          this.SpinnerService.hide();
        } else {
        
            this.toastr.success("Successfully Downloaded");
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `GL_Report_${formattedDate}.xlsx`;
            document.body.appendChild(a );
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.btn_spinner_branchglbdow = false;
        this.brangltb_dow=false;
        this.toastr.warning(error.status+error.statusText)
      }
    );
  }
  @ViewChild('empbranchinfo') matempbranchname:MatAutocomplete
  @ViewChild('empbranInput') matempbranchinput:ElementRef;
  @ViewChild('branchglinfo') matbranchglno:MatAutocomplete
  @ViewChild('branchglInput') matbranchglnoinput:ElementRef;
  @ViewChild('expense') matexpensename:MatAutocomplete
  @ViewChild('expInput') matexpinput:ElementRef;
  @ViewChild('pprbranchglinfo') matbranchglnoinput_ppr:ElementRef;
  @ViewChild('pprbranchglinfo') matbranchglnoppr:MatAutocomplete;
  @ViewChild('pprempbranchinfo') ppr_matempbranchname:MatAutocomplete
  @ViewChild('pprempbranInput') pprmatempbranchinput:ElementRef;
  @ViewChild('pprexpense') pprmatexpensename:MatAutocomplete
  @ViewChild('pprexpInput') pprmatexpinput:ElementRef;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  public getemployeebranchinterface(data?:empbranch):string|undefined{
    return data?data.codename:undefined;
  }
  public getexpenseinterface(data?:exp):string|undefined{
    return data?data.name:undefined;
  }
  public getbranchglnointerface(data?:gllist):string|undefined{
    return data?data.no:undefined;
  }
  public ppr_getbranchglnointerface(data?:gllist):string|undefined{
    return data?data.no:undefined;
  }
 


  empbranchnamelist:Array<any>=[];
  has_empbranchpage:number=1;
  has_empbranchpre:boolean=false;
  has_empbranchnxt:boolean=false;
  employee_branchdrop(){
    this.service.getempbranchedrop('',1).subscribe(data=>{
      this.empbranchnamelist=data['data']
      let datapagination = data["pagination"];
      if (this.empbranchnamelist.length > 0) {
        this.has_empbranchnxt = datapagination.has_next;
        this.has_empbranchpre = datapagination.has_previous;
        this.has_empbranchpage = datapagination.index;
      }
    })
  }
  expense_list:Array<any>=[];
  exp_prev:boolean=false;
  exp_next:boolean=false;
  exp_page:number=1;

  expense_dropdown(){
    this.service.getexpense('',1).subscribe(data=>{
      this.expense_list=data['data'];
      let pagination =data['pagination'];
      if(this.expense_list.length>0){
        this.exp_prev=pagination.has_previous;
        this.exp_next=pagination.has_next;
        this.exp_page=pagination.index;
      }
    })
  }
  glno_list:Array<any>=[]
  glno_next:boolean=false;
  glno_prev:boolean=false;
  glno_page:number=1;
  glilist_dropdown(){
    this.service.getglno_list('',1).subscribe(data=>{
      this.glno_list=data['data'];
      let pagination=data['pagination']
      if(this.glno_list.length>0){
        this.glno_next=pagination.has_next;
        this.glno_list=pagination.has_previous;
        this.glno_page=pagination.index;
      }
    })
  }
  autocompleteScrollglno(){
    setTimeout(()=>{
      if(this.matbranchglno && this.autocompleteTrigger && this.matbranchglno.panel){
        fromEvent(this.matbranchglno.panel.nativeElement,'scroll')
        .pipe(
          map(x =>this.matbranchglno.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(x=>{
          const scrollTop =this.matbranchglno.panel.nativeElement.scrollTop;
          const scrollHeight = this.matbranchglno.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchglno.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if(atBottom){
              if(this.glno_next ===true){
                this.service.getglno_list(this.matbranchglnoinput.nativeElement.value,this.glno_page+1)
                .subscribe((data: any[]) => {
                  let datas = data["data"];
                  let pagination = data["pagination"];
                  this.glno_list = this.glno_list.concat(datas);
                  if(this.glno_list.length>0){
                    this.glno_next=pagination.has_next;
                    this.glno_list=pagination.has_previous;
                    this.glno_page=pagination.index;
                  }
                                  
                })
              }
            }
        })
      }
    })
  }
  autocompleteScrollexpence(){
    setTimeout(() => {
      if (
        this.matexpensename &&
        this.autocompleteTrigger &&
        this.matexpensename.panel
      ) {
        fromEvent(this.matexpensename.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matexpensename.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matexpensename.panel.nativeElement.scrollTop;
            const scrollHeight = this.matexpensename.panel.nativeElement.scrollHeight;
            const elementHeight = this.matexpensename.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.exp_next === true) {
                this.service.getexpense(this.matexpinput.nativeElement.value,this.exp_page+1)
                  .subscribe((data: any[]) => {
                    let datas = data["data"];
                    let pagination = data["pagination"];
                    this.expense_list = this.expense_list.concat(datas);
                    if (this.expense_list.length > 0) {
                      this.exp_next = pagination.has_next;
                      this.exp_prev = pagination.has_previous;
                      this.exp_page = pagination.index;
                    }
                  })
              }
            }
          });
      }
    });
}

  autocompleteScrollempbranch(){
    setTimeout(() => {
      if (
        this.matempbranchname &&
        this.autocompleteTrigger &&
        this.matempbranchname.panel
      ) {
        fromEvent(this.matempbranchname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempbranchname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempbranchname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempbranchname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempbranchname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_empbranchnxt === true) {
                this.service.getempbranchedrop(this.matempbranchinput.nativeElement.value,this.has_empbranchpage+1)
                  .subscribe((data: any[]) => {
                    let datas = data["data"];
                    let datapagination = data["pagination"];
                    this.empbranchnamelist = this.empbranchnamelist.concat(datas);
                    if (this.empbranchnamelist.length > 0) {
                      this.has_empbranchnxt = datapagination.has_next;
                      this.has_empbranchpre = datapagination.has_previous;
                      this.has_empbranchpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
}
pprdata_list:Array<any>=[];
pprdata_has_next:boolean=false;
pprdata_has_previous:boolean=false;
pprdata_present_page:number=1;
pprdata_enable:boolean=false;
hide_column_ppr:boolean=false;
ppr_gl_hide:boolean=false;
ppr_branch:boolean=false;
total_count_inp:number=0;
selected_id_color :number;
expand_getenable(i,detail){
  this.selected_id_color = i;
  this.branchwiseglppr_tblist[i]['enb'] =!this.branchwiseglppr_tblist[i]['enb'];
  if(this.branchwiseglppr_tblist[i]['enb']){
    this.branchwiseglppr_tblist = this.branchwiseglppr_tblist.map((res,ind)=>{
      return {...res, enb:ind === i?true:false}
    });

  }
  if(this.branchwiseglppr_tblist[i]['enb']==false){
    this.selected_id_color=null;
    return;
  }
  this.expand_getdata(detail)
}
custom_spinner=false;
expand_getdata(detail,page=1){
console.log(page);

   let body={
      "glno":detail?.GL_No,
      "invoice_date":this.datepipe.transform(detail?.Date,'yyyy-MM-dd'),
      "branch_id":detail?.Branch_Code
   }
   this.custom_spinner =true;
    this.service.getppr_data(page,body).subscribe(res=>{
      this.custom_spinner =false;
      if(res['code']!=null && res['code']!='' && res['code']!= undefined){
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
      else{
          this.pprdata_list=res['data'];

          if(this.pprdata_list?.length >0){
            this.total_count_inp= res['count'];
            
            this.pprdata_has_next=res['pagination']?.has_next;
            this.pprdata_has_previous=res['pagination']?.has_previous;
            this.pprdata_present_page =res['pagination']?.index


          }

      }
    },
      (error:HttpErrorResponse)=>{
        this.notification.showError(error.status+error.message);
        this.SpinnerService.hide();
        this.custom_spinner =false;

      }
    )
}
pprdatagl_next(data){
  this.expand_getdata(data,this.pprdata_present_page+1);

}
pprdatagl_previous(data){
  this.expand_getdata(data,this.pprdata_present_page-1);

}
prev_branchglppr:boolean=false;
next_branchglppr:boolean=false;
branchglppr_page:number =1;
branchwiseglppr_tblist=[];
pprgl_no:string;
ppr_brn:string;
gl_col_hide=true;
brn_col_hide=true;

branchwiseglppr_summary(page){
  this.selected_id_color=null;
  if (this.ppr_gl_hide){
    this.pprgl_no= this.trialbalForm.get('branch_withppr_glno').value?this.trialbalForm.get('branch_withppr_glno').value.no:''; 

  }
  if(this.ppr_branch){
    this.ppr_branch= this.trialbalForm.get('branch_withppr_empbranch').value?this.trialbalForm.get('branch_withppr_empbranch').value.no:''; 
  }
  if(this.trialbalForm.get('branch_withppr_fromdate').value==null ||this.trialbalForm.get('branch_withppr_fromdate').value==undefined || this.trialbalForm.get('branch_withppr_fromdate').value==''){
    this.toastr.warning('Please Select the From Date');
    return false;
  }
  if(this.trialbalForm.get('branch_withppr_todate').value == null ||this.trialbalForm.get('branch_withppr_todate').value == undefined || this.trialbalForm.get('branch_withppr_todate').value == ''){
    this.toastr.warning('Please Select The To Date');
    return false;
  }
  if(this.trialbalForm.get('branch_withppr_empbranch').value!='' && this.trialbalForm.get('branch_withppr_empbranch').value!= null && this.trialbalForm.get('branch_withppr_empbranch').value!= undefined){
    this.brn_col_hide =false;
    this.ppr_brn = this.trialbalForm.get('branch_withppr_empbranch').value?.code;
    this.ppr_branch=true;
    
  }
  if(this.trialbalForm.get('branch_withppr_glno').value!='' && this.trialbalForm.get('branch_withppr_glno').value!= null && this.trialbalForm.get('branch_withppr_glno').value!= undefined){
    this.gl_col_hide =false;
    this.pprgl_no =this.trialbalForm.get('branch_withppr_glno').value?.no;
    this.ppr_gl_hide =true;
  }
  if(this.trialbalForm.get('branch_withppr_empbranch').value=='' || this.trialbalForm.get('branch_withppr_empbranch').value == null || this.trialbalForm.get('branch_withppr_empbranch').value== undefined){
    this.brn_col_hide =true;
    // this.ppr_brn = this.trialbalForm.get('branch_withppr_empbranch').value?.code;
    this.ppr_branch=false;
    
  }
  if(this.trialbalForm.get('branch_withppr_glno').value=='' || this.trialbalForm.get('branch_withppr_glno').value== null || this.trialbalForm.get('branch_withppr_glno').value== undefined){
    this.gl_col_hide =true;
    // this.pprgl_no =this.trialbalForm.get('branch_withppr_glno').value?.no;
    this.ppr_gl_hide =false;
  }
  let data:any={
    'from_date':this.datepipe.transform(this.trialbalForm.get('branch_withppr_fromdate').value,'yyyy-MM-dd'),
    'to_date':this.datepipe.transform(this.trialbalForm.get('branch_withppr_todate').value,'yyyy-MM-dd'),
    'branch':this.trialbalForm.get('branch_withppr_empbranch').value?this.trialbalForm.get('branch_withppr_empbranch').value.id:'',
    'expense_id':this.trialbalForm.get('branch_withppr_expen').value?this.trialbalForm.get('branch_withppr_expen').value.id:'',
    'gl_no':this.trialbalForm.get('branch_withppr_glno').value?this.trialbalForm.get('branch_withppr_glno').value.no:'',
    'type':'summary'
    
  }
  this.SpinnerService.show();
  this.service.get_Branchwisegl_Summary_new(data,page).subscribe((results)=>{
    this.SpinnerService.hide();
    if(results?.code!=null && results?.code !='' && results?.code != undefined){
      this.notification.showError(results.code);
      this.notification.showError(results.description);
      this.branchwiseglppr_tblist=[];
      return;
    }
    
      this.branchwiseglppr_tblist=results['data'];
      let pagination=results['pagination']
      if(this.branchwiseglppr_tblist.length>0){
        this.prev_branchglppr=pagination.has_previous;
        this.next_branchglppr=pagination.has_next;
        this.branchglppr_page=pagination.index; 
      }    
  })
}
branchwiseglppr_reset(){
  this.trialbalForm.get('branch_withppr_fromdate')?.reset('')
  this.trialbalForm.get('branch_withppr_todate')?.reset('')
  this.trialbalForm.get('branch_withppr_empbranch')?.reset('')
  this.trialbalForm.get('branch_withppr_expen')?.reset('')
  this.trialbalForm.get('branch_withppr_glno')?.reset('')
  this.branchwiseglppr_tblist=[];
  this.brn_col_hide =true;
  this.ppr_branch=false;
  this.gl_col_hide =true;
    this.ppr_gl_hide =false;
}

branchglppr_previous(){
  if(this.prev_branchglppr==true){
    this.branchwiseglppr_summary(this.branchglppr_page-1)
  }
}
branchglppr_next(){
  if(this.next_branchglppr==true){
    this.branchwiseglppr_summary(this.branchglppr_page+1)
  }
}
 ppr_glno_list:Array<any>=[]
  ppr_glno_next:boolean=false;
  ppr_glno_prev:boolean=false;
  ppr_glno_page:number=1;
 
  ppr_glilist_dropdown(){
    this.service.getglno_list('',1).subscribe(data=>{
      this.ppr_glno_list=data['data'];
      let pagination=data['pagination']
      if(this.ppr_glno_list.length>0){
        this.ppr_glno_next=pagination.has_next;
        this.ppr_glno_prev=pagination.has_previous;
        this.ppr_glno_page=pagination.index;
      }
    })
  }
  ppr_autocompleteScrollglno(){
    setTimeout(()=>{
      if(this.matbranchglnoppr && this.autocompleteTrigger && this.matbranchglnoppr.panel){
        fromEvent(this.matbranchglnoppr.panel.nativeElement,'scroll')
        .pipe(
          map(x =>this.matbranchglnoppr.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        ).subscribe(x=>{
          const scrollTop =this.matbranchglnoppr.panel.nativeElement.scrollTop;
          const scrollHeight = this.matbranchglnoppr.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchglnoppr.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if(atBottom){
              if(this.glno_next ===true){
                this.service.getglno_list(this.matbranchglnoinput_ppr.nativeElement.value,this.ppr_glno_page+1)
                .subscribe((data: any[]) => {
                  let datas = data["data"];
                  let pagination = data["pagination"];
                  this.ppr_glno_list = this.ppr_glno_list.concat(datas);
                  if(this.ppr_glno_list.length>0){
                    this.ppr_glno_next=pagination.has_next;
                    this.ppr_glno_prev=pagination.has_previous;
                    this.ppr_glno_page=pagination.index;
                  }
                                  
                })
              }
            }
        })
      }
    })
  }

  pprempbranchnamelist:Array<any>=[];
  pprhas_empbranchpage:number=1;
  pprhas_empbranchpre:boolean=false;
  pprhas_empbranchnxt:boolean=false;
  ppremployee_branchdrop(){
    this.service.getempbranchedrop('',1).subscribe(data=>{
      this.pprempbranchnamelist=data['data']
      let datapagination = data["pagination"];
      if (this.pprempbranchnamelist.length > 0) {
        this.pprhas_empbranchnxt = datapagination.has_next;
        this.pprhas_empbranchpre = datapagination.has_previous;
        this.pprhas_empbranchpage = datapagination.index;
      }
    })
  }
  pprautocompleteScrollempbranch(){
    setTimeout(() => {
      if (
        this.ppr_matempbranchname &&
        this.autocompleteTrigger &&
        this.ppr_matempbranchname.panel
      ) {
        fromEvent(this.ppr_matempbranchname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.ppr_matempbranchname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.ppr_matempbranchname.panel.nativeElement.scrollTop;
            const scrollHeight = this.ppr_matempbranchname.panel.nativeElement.scrollHeight;
            const elementHeight = this.ppr_matempbranchname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_empbranchnxt === true) {
                this.service.getempbranchedrop(this.pprmatempbranchinput.nativeElement.value,this.pprhas_empbranchpage+1)
                  .subscribe((data: any[]) => {
                    let datas = data["data"];
                    let datapagination = data["pagination"];
                    this.pprempbranchnamelist = this.pprempbranchnamelist.concat(datas);
                    if (this.pprempbranchnamelist.length > 0) {
                      this.pprhas_empbranchnxt = datapagination.has_next;
                      this.pprhas_empbranchpre = datapagination.has_previous;
                      this.pprhas_empbranchpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
}
pprexpense_list:Array<any>=[];
pprexp_prev:boolean=false;
pprexp_next:boolean=false;
pprexp_page:number=1;
pprexpense_dropdown(){

  this.service.getexpense('',1).subscribe(data=>{
    this.pprexpense_list=data['data'];
    let pagination =data['pagination'];
    if(this.pprexpense_list.length>0){
      this.pprexp_prev=pagination.has_previous;
      this.pprexp_next=pagination.has_next;
      this.pprexp_page=pagination.index;
    }
  })
}
pprautocompleteScrollexpence(){
  setTimeout(() => {
    if (
      this.pprmatexpensename &&
      this.autocompleteTrigger &&
      this.pprmatexpensename.panel
    ) {
      fromEvent(this.pprmatexpensename.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.pprmatexpensename.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.pprmatexpensename.panel.nativeElement.scrollTop;
          const scrollHeight = this.pprmatexpensename.panel.nativeElement.scrollHeight;
          const elementHeight = this.pprmatexpensename.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.pprexp_next === true) {
              this.service.getexpense(this.pprmatexpinput.nativeElement.value,this.pprexp_page+1)
                .subscribe((data: any[]) => {
                  let datas = data["data"];
                  let pagination = data["pagination"];
                  this.pprexpense_list = this.pprexpense_list.concat(datas);
                  if (this.pprexpense_list.length > 0) {
                    this.pprexp_next = pagination.has_next;
                    this.pprexp_prev = pagination.has_previous;
                    this.pprexp_page = pagination.index;
                  }
                })
            }
          }
        });
    }
  });
}

ispprLoading:boolean=false;
branch_wise_download(data){
  data['enb_down'] =true;
  this.ispprLoading=true;
 
  let payload ={
    'glno':data?.GL_No,
    'gl_description':data?.GL_Description,
    'invoice_date':this.datepipe.transform(data?.Date,'yyyy-MM-dd'),
    'branch_id':data?.Branch_Code,
    'opening_balance':data?.Opening_Balance,
    'debit':data?.Debit,
    'credit':data?.Credit,
    'closing_balance':data.Closing_Balance
  }
  this.service.get_ppr_excel(payload).subscribe(fullXLS=>{
    this.ispprLoading=false;
    data['enb_down'] =false;

    if(fullXLS['type']=='application/json'){
      this.toastr.warning("INVALID DATA");
      this.third=false;
    }
    else{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Branchwisegl_ppr_download'+ date +".xlsx";
      link.click();
      this.third=false;
      this.toastr.success('Excel Download Successfully');
    }

  },(error:HttpErrorResponse)=>{
    this.ispprLoading=false;
    data['enb_down'] =false;
  
    this.notification.showError(error.status+error.message);
    this.SpinnerService.hide();
  })
}

onntbDateChange(selectedDate: any) {
    this.ntbfromDate = selectedDate;
    this.trialbalForm.get('ntb_todate')?.reset();
  }
  reset_ntb(){
    this.trialbalForm.get('ntb_fromdate')?.reset();
    this.trialbalForm.get('ntb_todate')?.reset();
  }
ntb_tbforecastPrepare(){
    if(this.second == true){
      this.toastr.warning('Already Progress')
      return true
    }
    let fromdate:any=this.datepipe.transform(this.trialbalForm.get('ntb_fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('ntb_fromdate').value,'yyyy-MM-dd'):'';
    let todate:any=this.datepipe.transform(this.trialbalForm.get('ntb_todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('ntb_todate').value,'yyyy-MM-dd'):'';
    
    this.second=true
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('ntb_fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('ntb_fromdate').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.trialbalForm.get('ntb_todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('ntb_todate').value,'yyyy-MM-dd'):'',
    };
    this.SpinnerService.show();
    this.toastr.warning('Wait for 3 minutes','',{timeOut:180000,progressBar:true,progressAnimation:'decreasing'});
    
   
    this.service.getnTbForecastPrepare(data).subscribe(result=>{
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.SpinnerService.hide();
        this.second=false;
        this.toastr.clear();
        // this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        setTimeout(() => {
          /** spinner ends after 3 seconds */
          this.SpinnerService.hide();
          }, 3000);
        alert('Success');
        this.second=false;
      }
      
    },
    (error)=>{
      this.second=false;
      this.toastr.warning(error.description)
    });
    setTimeout(()=>{
      this.second=false;
      this.downloadForecastFlag = false;
      this.toastr.success('Excel Prepared Successfully');
      // this.toastr.success('Excel Prepared Successfully','',{timeOut:3000});
    },300000);
    console.log('final Execute');
  }

   ntb_detail_report_download(){
    if(this.fourth == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.fourth=true
    let data:any={
      "from_date":this.datepipe.transform(this.trialbalForm.get('ntb_fromdate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('ntb_fromdate').value,'yyyy-MM-dd'):'',
      "to_date":this.datepipe.transform(this.trialbalForm.get('ntb_todate').value,'yyyy-MM-dd')?this.datepipe.transform(this.trialbalForm.get('ntb_todate').value,'yyyy-MM-dd'):'', 
    };
    this.service.ntb_detailcereport_xl()
    .subscribe(fullXLS=>{
      if(fullXLS['type']=='application/json'){
        this.toastr.warning("INVALID DATA");
        this.fourth=false;
      }
      else{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'Trial_Balance_Download'+ date +".xlsx";
        link.click();
        this.fourth=false;
        this.toastr.success('Excel Download Successfully');
      }
     
    },
    (error)=>{
      this.fourth=false;
      this.toastr.warning(error.description)
    });
  }
stb_sumprepare_spinner: boolean = false;
   preparetrangltb() {
    if (this.stb_sumprepare_spinner == true) {
      this.toastr.warning('Already Progress')
      return true
    }
    this.stb_sumprepare_spinner = true
    if(this.searchForm.value.fromDate == null || this.searchForm.value.fromDate == "" || this.searchForm.value.fromDate == undefined){
      this.notification.showError("Please Select From Date")
       this.stb_sumprepare_spinner = false
       this.SpinnerService.hide();
      return true
    }
    if(this.searchForm.value.toDate == null || this.searchForm.value.toDate == "" || this.searchForm.value.toDate == undefined){
      this.notification.showError("Please Select To Date")
       this.stb_sumprepare_spinner = false
       this.SpinnerService.hide();
      return true
    }
    let data: any = {
      "from_date": this.datepipe.transform(this.searchForm.get('fromDate').value, 'yyyy-MM-dd') ? this.datepipe.transform(this.searchForm.get('fromDate').value, 'yyyy-MM-dd') : '',
      "to_date": this.datepipe.transform(this.searchForm.get('toDate').value, 'yyyy-MM-dd') ? this.datepipe.transform(this.searchForm.get('toDate').value, 'yyyy-MM-dd') : '',
      "enb": "1"
    };
    
    this.SpinnerService.show();
    this.service.trangbtl(data).subscribe(result => {
      console.log(result);
      if (result['code'] != undefined && result['code'] != "") {
        this.SpinnerService.hide();
        this.stb_sumprepare_spinner = false;
        this.toastr.clear();
        this.toastr.warning(result['description']);
      }
      else {
        setTimeout(() => {
          this.SpinnerService.hide();
        }, 3000);
        alert('Success');
        this.stb_sumprepare_spinner = false;
        if (result['status'] == "success") {
          this.toastr.success('Excel Prepared Successfully');
        }

      }

    },
      (error) => {
        this.stb_sumprepare_spinner = false;
        this.toastr.warning(error.description)
      });




    console.log('final Execute');
  }
   stb_sumdown_spinner: boolean = false;
   trangldownload() {
    if (this.stb_sumdown_spinner == true) {
      this.toastr.warning('Already Progress')
      return true
    }
    this.stb_sumdown_spinner = true
    this.service.gettrantbdownload()
      .subscribe(fullXLS => {
        if (fullXLS['type'] == 'application/json') {
          this.toastr.warning("NO RECORD FOUND");
          this.stb_sumdown_spinner = false;
        }
        else {
          console.log(fullXLS);
          let binaryData = [];
          binaryData.push(fullXLS)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = 'Tran GL TrialBalance Download ' + date + ".csv";
          link.click();
          this.stb_sumdown_spinner = false;
          this.toastr.success('Excel Download Successfully');
        }

      },
        (error) => {
          this.stb_sumdown_spinner = false;
          this.toastr.warning(error.description)
        });
  }


  
  TBclosing_data:any
  TBclosing_summary(){
    this.SpinnerService.show();
    this.service.TBclosing_summary().subscribe(result=>{
      this.SpinnerService.hide();
      if(result?.code!=undefined && result?.code!=null && result?.code!=''){
        this.notification.showWarning(result?.code);
        this.notification.showWarning(result?.description);
      }else{
        this.TBclosing_data=result.TB_CB
      }
    },(error:HttpErrorResponse)=>{
      this.SpinnerService.hide();
      this.notification.showError(error.status + error.message);
    })
  }
  btn_spinner_tbClosing:boolean=false;
  tbClosing_btn:boolean=false;
  tbClosing_excelPrepare(){
    if(this.trialbalForm.get('bankreconfromdate').value==null || this.trialbalForm.get('bankreconfromdate').value==undefined || this.trialbalForm.get('bankreconfromdate').value==''){
      this.toastr.warning('Please Select Date');
      return false;
    }
    
    let data:any={
      "date":this.datepipe.transform(this.trialbalForm.get('bankreconfromdate').value,'yyyy-MM-dd'),
    };
    if(this.btn_spinner_tbClosing == true){
      this.toastr.warning('Already Progress')
      return true
    }
    this.btn_spinner_tbClosing=true
    this.tbClosing_btn=true;
    this.toastr.success('Started preparing Excel.')
    this.service.TBclosing_ExcelPrepare(data).subscribe(result=>{
      this.btn_spinner_tbClosing=false;
      this.tbClosing_btn=false;
      console.log(result);
      if(result['code']!=undefined && result['code']!=""){
        this.toastr.clear();
        this.toastr.warning(result['code']);
        this.toastr.warning(result['description']);
      }
      else{
        if (result['status'] == "success") {
          this.toastr.success(result['message']);
          this.TBclosing_summary();
      }
      
    }
    (error)=>{
      this.btn_spinner_tbClosing=false;
      this.toastr.warning(error.status+error.statusText)
    }});
   
  }
  // btn_spinner_bankrecondow:boolean=false;
  tbClosing__Download() {
    this.btn_spinner_tbClosing=true;
    this.service.TBclosing_Download().subscribe((res: any) => {  
        this.btn_spinner_tbClosing=false;

        if (res?.type=='application/json') {
          this.toastr.warning("UNEXPECTED_ERROR");
        } else {
        
            this.toastr.success("Successfully Downloaded");

            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            a.href = url;
            a.download = `TB_Closing_Balance_Download _${formattedDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.SpinnerService.hide();
        }
      },
      (error) => {
        this.btn_spinner_tbClosing=false;
        this.toastr.warning(error.status+error.statusText)
      }
    );
  }
}