import { Component, OnInit,EventEmitter,ViewChild,Output,Renderer2,ElementRef } from '@angular/core';
import { FormControl, FormGroup,FormBuilder, FormArray, FormControlName } from '@angular/forms';
import { TaService } from '../ta.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ShareService } from 'src/app/ta/share.service';
import { NotificationService } from '../notification.service'
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorHandlingService } from '../error-handling.service';
import {PageEvent} from '@angular/material/paginator'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
// import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
export interface paymodelistss {
  code: string;
  id: string;
  name: string;
}
export interface Paymodelist{
  name:string,
  code:string,
  id:string
}
export interface Glnumner{
  glno:string,
  id:any,
  name:any
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
  selector: 'app-ap-user-summary',
  templateUrl: './ap-user-summary.component.html',
  styleUrls: ['./ap-user-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})

export class ApUserSummaryComponent implements OnInit {
  // @Output() onCancel = new EventEmitter<any>();
  @ViewChild('closebutton') closebutton;
  @ViewChild('ccid') cccid: any;
  @ViewChild('bsid') bsssid: any;
  @ViewChild('bssid') matbssidauto: MatAutocomplete;
  @ViewChild('assetid') matassetidauto: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  show_approvebtn: boolean = true;
  amtapprove: boolean = false;
  has_presentemp: any = 1
  data: any
  summaryForm: any;
  statusList = []
  tokenValues: any;
  sumadvance: number = 0;
  netpay: number;
  itemdisable: boolean;
  applevel: any;
  filesystem_error: boolean;
  branchList = []
  apvl: boolean = false;
  empbrid: boolean = false;
  getAdvanceapproveList: any;
  ccbslist: any;
  changeapprover: boolean;
  firstscreen:boolean=false;
  secondscreen:boolean=false;
  createsummary: boolean = true;
  isapprovepay_btnenable:boolean=true;
  getapuserList:any;
  has_next=true;
  reason: any;
  fileid: any;
  p = 1;
  PaymodeList: any
  ppxid:any
  creditglForm: FormGroup
  ERAList: any;
  expenceformview: FormGroup;
  payableSelected =false
  cdtsum: any;
  TA_DailyDim_Enb:boolean=false;
  TA_ExpenceData_Enb:boolean=false;
  TA_Lodge_Enb:boolean=false;
  TA_Inci_Enb:boolean=false;
  TA_Local_Enb:boolean=false;
  TA_Misc_Enb:boolean=false;
  TA_Pack_Enb:boolean=false;
  jpgUrls: string;
  file_window: Window;
  action: string[];
  startdate: any;
  requestdate: any;
  employee_code: any;
  employee_name: any;
  empdesignation: any;
  empgrade: any;
  fileextension: any;
  has_previous=true;
  invalidpermission: boolean = false;
  pagesize=10;
  tourgid: any;
  getapprovesumm_has_next=true;
  getapprovesumm_has_previous=true;
  reasonchange: any = null;
  statusId: any;
  laststatus: any;
  loginid: any;
  images: any;
  resultimage: any;
  attachmentlist=[];
  imageUrl = environment.apiURL;
  movetootherno: boolean = true;
  currentpage: number = 1;
  rejectreason: boolean;
  getapprovesumm_currentpage: number = 1;
  getapprovexpenceList:any;
  tourApprovalSearchForm : FormGroup;
  expenceform: FormGroup;
  approved=3;
  id:any;
  ap_verify: any;
  fileData: File = null;
  actionapprove: boolean = false;
  actionreject: boolean = false;
  actionreturn: boolean = false;
  showreason: boolean = false;
  returnreason: boolean;
  isLoading: boolean=false;
  employeelist: any;
  branchlist: any;
  branchid: any;
  getclaimrequest: any;
  approvepayform:any= FormGroup;
  tourmodell: any;
  tourrr: any;
  approvedamt: number;
  eligibleamt: Number;
  claimedamt: Number;
  remarks: any;
  advancelist: any;
  expenceid: any;
  approvedbyid: any;
  showattachment: boolean = false
  showeditfile: boolean = true;
  viewpdfimageeee: Window;
  file_downloaded: boolean;
  reapprove: boolean = false;
  pageadsize = 10
  presentpage = 1
  pageSize = 10
  result:any;
  advance_statusid: any;
  status_id:any;
  returnreasonap:boolean=false;
  submitbtn:boolean=false;
  ap:any;
  commonapForm:FormGroup
  TypeList:any
  StatusList:any
  searchData: any={}
  iscommonsummarypage: boolean
  has_commonpageprevious= false
  has_commonpagenext= false
  Advance= false
  requestno: any = null;
  select: any;
  enddatee: any;
  advanceform: FormGroup
  dataa: any
  approvesum: number = 0;
  lastcomment: any = null;
  s = 1;
  crnumber:any;
  key:any;
  alreadymaked: any;
  ccbsresult: any;
  advanceamtid: any;
  advancedetail: any[] = [];
  pagesizecommon = 10;
  getcommontotalcount:any
  length_commonecf = 0;
  commonpresentpage: number = 1;
  ecf_summary_data:any;
  ecfpresentpage: number = 1;
  pagesizeecf = 10;
  showDatepicker: boolean = false;
  attachment_view: boolean = false;
  selectedDate: string = ''; 
  disablecretditdetails:number=1;
  crd_details_saved:number=0;
  crd_details_amntsaved:boolean=false;
  commonSummary: any[] = []
  datepickerVisibility: boolean[] = [];
  Date:FormGroup;
  Ecf_type= [{'id':8,'text':'TCF'},{'id':11,'text':'TAF'}];
  // paymodedropdown=[
  //   {name:'CREDITGL',id:'2',code:'PM002'},
  // ];
  paymodedropdown:Array<any>=[];
  ERAid:any;
  creditglform:FormGroup;
  constructor(private taService: TaService, private SpinnerService:NgxSpinnerService,
    private toastr: ToastrService,
    private fb:FormBuilder,private datePipe: DatePipe, private shareservice: ShareService,private el: ElementRef,
    private notification: NotificationService,private router: Router,private errorHandler : ErrorHandlingService,private renderer: Renderer2) { }
    @ViewChild('closedbuttons') closedbuttons;
    @ViewChild('closefile') closefile;

  Display(subject){
    return subject.name
  }
  // displayPaymode
 
  ngOnInit(): void {

    this.summaryForm = new FormGroup({
      tourno: new FormControl(''),
      // status: new FormControl(1),
      status: new FormControl(''),
      requestdate: new FormControl(''),
      branch:new FormControl(''),
      employee:new FormControl('')
    })
     
    this.tourApprovalSearchForm = this.fb.group({
      tourno:[''],
      requestdate:[''],
      
    })
    this.creditglForm = this.fb.group({
      paymode_id: [''],
      glnum: [''],
      category_code: [''],
      subcategory_code: [''],
      bs_code:[''],
      cc_code:[''],

    })
    this.expenceformview=this.fb.group({
      creditdtl: new FormArray([
        this.creditdetails(),
        
      ])
    })
    this.expenceform = this.fb.group({
      tourgid: this.id,
      appcomment: null,
      empbranchid: null,
      approvedby: null,
      approval: null,
      action: null,
      brnid:null,
      ccbs: new FormArray([
      ])
    })
    this.approvepayform =this.fb.group({
      'crno':new FormControl(),
      'ecf_raiser':new FormControl(),
      'ecf_type':new FormControl(),
      'ecf_amount':new FormControl(),
      'ecf_status':new FormControl(),
      'commodity_name':new FormControl(),
      'invoice_date':new FormControl(),
      'with_paper':new FormControl(),
      'inward_date':new FormControl(),
      
    });
    this.tourmodell = {
      requestno: this.id,
      expencetypee: "",
      comments: "",
      bank: "",
      approval: "",
      remarks: ""
    }
    this.Date=this.fb.group({
      commondate:['']
    })
    this.commonapForm = this.fb.group({
      
      crno:[''],
      aptype:[''],
      apstatus:[''],
      tour_id:[''],
    });
    this.creditglform=this.fb.group({
      'paymode':new FormControl(),
      'creditgl':new FormControl()
    });
    // this.formArray.controls[0].disable();
    // this.expenceformview.value.creditdtl[0].controls.disable();
    // this.expenceformview.get('creditdtl').controls[0].disable();
    // this.expenceformview.get('creditdtl').controls[0].readonly = true;


    // const creditdtlArray = this.expenceformview.get('creditdtl') as FormArray;
    // creditdtlArray.controls[0].readonly

    this.commonSummarySearch(1);
    // this.getecftype();
    this.getecfstatus();
    // let data=this.shareservice.expensesummaryData.value;
    // console.log("the expence summaru",data)
    // const expense_summary = JSON.parse(localStorage.getItem('expense_details'));
    // this.result=expense_summary['result'];
    // console.log("the result of",this.result);
    // this.status_id = expense_summary.claim_status_id

  //   this.shareservice.dropdownvalue.next(data)

  // this.expenceform.get('expentype').valueChanges.subscribe(x => {
  //   this.tourmodell.expencetypee = x
  // })

  // this.expenceform.get('comments').valueChanges.subscribe(x => {
  //   this.tourmodell.comments = x
  // })

    this.expenceform.get('empbranchid').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taService.getUsageCode(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        console.log("Branch List", this.branchlist)
      });

    this.expenceform.get('approval').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.taService.setemployeeValues(value?value:' ', this.branchid, '', this.id,1))
      )
      .subscribe((results: any[]) => {
        let datas = results;
        this.employeelist = datas['data'];
        console.log("Employee List", this.employeelist)
      });

  

  
    
    this.taService.getstatus()
      .subscribe(res => {
        this.statusList = res
        const exp_list = this.statusList.filter(function (record) { return record.name != "FORWARD" });
        this.statusList = exp_list
        console.log("statusList", this.statusList)
      })
    this.taService.getbranchSummary()
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.branchList = datas;
    // this.gettourapusersummary(this.currentpage,10)


      });
      // (this.expenceform.get('ccbs') as FormArray).push(this.createccbs())  
      this.getbusinesssegmentValue();
  }
  //ngOnint over
  createapuser(){
    this.createsummary=true;
    this.firstscreen=false;
    this.getapprovesumm('',this.getapprovesumm_currentpage)
    // this.getapprovesumm('',this.getapprovesumm_currentpage)
   
  }
  handleDateChange(event: MatDatepickerInputEvent<Date>, index): void {
      this.commonSummary[index].apdate = event.value;
    }

  // onKeyDown(event: KeyboardEvent) {
    //   if (event.keyCode !== 8 && event.keyCode !== 13 && (event.keyCode < 48 || event.keyCode > 57)) {
      //     event.preventDefault();
    //   }
    
  onKeyDown(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(event.key === 'Tab'){
      return true;
    }
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }
  advanceGet(id,adv_id){
    let params=id+'?adv_id='+adv_id;
    this.SpinnerService.show();
      this.taService.getadvanceEditsummary(params)
        .subscribe(result => {
          // console.log("claim .....", result)
          this.SpinnerService.hide();
          if(result?.code!=null &&result?.code!=undefined && result?.code!='' ){
            this.notification.showError(result?.code);
            this.notification.showError(result?.description);
          }
          else{
          this.approvedamt = result.appamount
          this.eligibleamt = result.eligible_amount
          this.claimedamt = result.reqamount
          this.tourgid=result?.requestno;
          this.reason=result?.reason;
          this.startdate=result?.startdate;
          this.requestdate=result?.enddate;
          this.employee_code=result?.approve[0].approvedby_code;
          this.employee_name=result?.approve[0].approvedby;
          this.empdesignation=result?.approve[0].empdesignation;
          this.empgrade=result?.approve[0].empgrade;
          let datas = result;
          if (result.approver_branch_data) {
            let branchdetail = result.approver_branch_data
            const myform = this.expenceform
            this.remarks = result.approver_comment;
            myform.patchValue({
              "approval": branchdetail,
              "empbranchid": "(" + branchdetail.branch_code + ") " + branchdetail.branch_name,
              "appcomment": this.remarks
            })
            this.branchid = branchdetail.branch_id
          }
  
          this.advancedetail = datas['detail'];
          console.log("Claim Request......", this.advancedetail)
          for (var i = 0; i < this.advancedetail.length; i++) {
            // this.tourid= this.advancedetail[i].tourid;
            this.expenceid = this.advancedetail[i].expenseid;
            console.log("Claim Request......", this.expenceid)
          }
          if (this.approvedamt < this.sumadvance) {
            this.netpay = this.sumadvance - this.approvedamt
          }
          else {
            this.netpay = this.approvedamt - this.sumadvance
          }
        
          let ccbsparams=id+'&adv_id='+adv_id;
          this.taService.getadvanceccbsEditview(ccbsparams).subscribe(result => {
            if(result?.code!=null && result?.code!=undefined && result?.code!=''){
                     this.notification.showError(result?.code);
                     this.notification.showError(result?.description);
            }
            else{

            
            this.ccbslist = result;
            this.itemdisable = true;
            console.log("the edit",this.ccbslist)
            const length = result.length;
            // (this.expenceform.get('ccbs') as FormArray).clear()
          const myform = (this.expenceform.get('ccbs') as FormArray)
          for (var i = 1; i < length; i++) {
            myform.push(this.createccbs())

          }
          result.forEach(element => {
            element.ccid = element.cc_data;
            element.bsid = element.bs_data;
          });
          const ccbsform = this.expenceform
          ccbsform.patchValue({
            ccbs: result
          })
          if (length > 0) {
            if (this.status_id != -1 && this.status_id != 5) {
              (this.expenceform.get('ccbs') as FormArray)
              this.itemdisable = true;
            }
          }
        }
        })
        if (this.approvedamt < this.sumadvance) {
          this.netpay = Number(this.sumadvance) - this.approvedamt
        }
        else {
          this.netpay = Number(this.approvedamt) - this.sumadvance
        }
      }
          })
       
        this.getadvanceapprovesumm();
  
  }
  public displayPaymode(paymode?: Paymodelist): string | undefined {
   
    return paymode ? paymode.name : undefined;
  }
  public displayFngl(gl?:Glnumner):string | undefined{
    return gl?gl.glno :undefined;
  }
  tourApproverapSearch(){
    let form_value = this.summaryForm.value;
     this.send_value=''
    if(form_value.tourno)
    {
      this.send_value=this.send_value+"&tour_no="+form_value.tourno
      // this.send_value=this.send_value+"&tour_no="+form_value.tourno
    }
    if(form_value.requestdate)
    {
      let date=this.datePipe.transform(form_value.requestdate,"dd-MMM-yyyy");
      this.send_value=this.send_value+"&request_date="+date
    }
    if(form_value.branch)
    {
      this.send_value=this.send_value+"&branch="+form_value.branch
    }
    if(form_value.status){
      this.send_value=this.send_value+"&status="+form_value.status;
    }
    if(form_value.employee){
     this.send_value=this.send_value+"&employee"+form_value.employye;
    }

    this.gettourapusersummary(1,this.send_value)
    

  }
  commonSummarySearch(pageNumber = 1)
  { 
    if(this.commonapForm){
      let search=this.commonapForm.value
    
      this.searchData.crno = search.crno ;
      this.searchData.aptype = search.aptype;
      this.searchData.apstatus = search.apstatus;
      this.searchData.tour_id = search.tour_id;
    
              //   this.searchData.batch_no = search.batch_no;
              //   this.searchData.invoiceheader_crno = search.invoiceheader_crno;
              //   
              //   this.searchData.raiser_name = search.raiser_name.id;
              //   this.searchData.raiserbranch_id = search.raiserbranch_id.id;
              //   this.searchData.invoice_no = search.invoice_no;
              //   this.searchData.invoice_amount = search.invoice_amount;
              //   this.searchData.minamt = search.minamt;
              //   this.searchData.maxamt = search.maxamt;
              //   this.searchData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
          for (let i in this.searchData) 
          {
              if (this.searchData[i] === null || this.searchData[i] === "") {
                delete this.searchData[i];
              }
          }    
        }
          else {
        this.searchData.crno=''
        this.searchData.aptype=''
        this.searchData.apstatus=''
        this.searchData.tour_id=''
      }
    
    this.SpinnerService.show()
    this.taService.getapusercommenSummary(pageNumber,this.searchData)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.commonSummary = result['data']
          let datapagination = result["pagination"];
          this.getcommontotalcount = result?.count
          this.length_commonecf = result?.count
          if (this.commonSummary.length === 0) {
            this.iscommonsummarypage = false
          }
          if (this.commonSummary.length > 0) {
            this.has_commonpagenext = datapagination.has_next;
            this.has_commonpageprevious = datapagination.has_previous;
            this.commonpresentpage = datapagination.index;
            this.iscommonsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
        console.log("Myyyyyyy",this.commonSummary)
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }
  
  openModal() {
    const modal = this.el.nativeElement.querySelector('#my-modalpreview2');
    this.renderer.setStyle(modal, 'display', 'block');
    const modal2= this.el.nativeElement.querySelector('#my-modalpreview3');
    this.renderer.setStyle(modal2, 'display', 'block');
  }
  toggleInvoiceDate() {
    const dropdown = document.getElementById("withoutPaperDropdown") as HTMLSelectElement;
    const invoiceDateHeader = document.getElementById("invoiceDateHeader");
    const invoiceDateInput = document.getElementById("invoiceDate") as HTMLInputElement;

    if (dropdown.value === "yes") {
      invoiceDateInput.style.display = "table-cell";
  } else {
      invoiceDateInput.style.display = "none";
  }
}
enableDatepicker(index:number) {
  this.datepickerVisibility[index] = true;
}

disableDatepicker(index:number) {
  this.datepickerVisibility[index] = false;
}
updateDate(index: number) {
  this.commonSummary[index].apdate = this.commonSummary[index].apdate;
}
approvepay(){this.notification.showSuccess("Payed Successfully")}
  Resetecfinventory()
  {
    this.commonapForm.controls['tour_id'].reset(""),
    this.commonapForm.controls['crno'].reset(""),
    this.commonapForm.controls['aptype'].reset(""),
    this.commonapForm.controls['apstatus'].reset("")
  }

  getecfstatus() {
    this.taService.getecfstatus()
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.StatusList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  getecftype() {
    this.taService.getecftype()
      .subscribe(result => {
        if (result['data'] != undefined) {
          let ecftypes = result["data"]
          this.TypeList = ecftypes.filter(type => type.id != 1 && type.id != 6)
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  showview(data:any)
  {

  }
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  pageSize_ecf=10;
  showFirstLastButtons:boolean=true;
  pageSize_commonecf = 10
  handlecommonPageEvent(event: PageEvent) {
    this.length_commonecf = event.length;
    this.pageSize_commonecf = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.commonpresentpage=event.pageIndex+1;
    this.ecfpresentpage = this.commonpresentpage
    this.commonSummarySearch(this.commonpresentpage);
    
  }
  resetap(){
    this.send_value=""
    this.summaryForm = this.fb.group({ 
      tourno:[''],
      requestdate:[''],
      branch:[''],
      status:[''],
      employee:['']
    })
    this.gettourapusersummary(1,this.send_value)
  }
  gettourapusersummary(
    pageNumber,pageSize) {
      this.SpinnerService.show();
 
    this.taService.getapuserSummary(pageNumber,this.send_value)
      .subscribe((results: any[]) => {
        
       
        this.SpinnerService.hide();
        
        let datas = results["data"];
        this.getapuserList = datas;
        let datapagination = results["pagination"];
      
       
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        
      })
    }
   
  
  
    TourapusernextClick() {
      console.log('test')
      if (this.has_next === true) {
        this.gettourapusersummary(this.currentpage + 1,this.pagesize)
      }
    }
    TourapuserpreviousClick() {
      if (this.has_previous === true) {
        this.gettourapusersummary(this.currentpage - 1,this.pagesize)
      }
    }
    TourapprovenextClick() {
      console.log('test')
      if (this.has_next === true) {
        this.getapprovesumm(this.send_value,this.getapprovesumm_currentpage +1)
      }
    }
    TourapprovepreviousClick() {
      if (this.has_previous === true) {
        this.getapprovesumm(this.send_value,this.getapprovesumm_currentpage -1)
      }
    }
    getapprovesumm(val,
      pageNumber) {
      this.SpinnerService.show();

      this.taService.getapSummary(this.approved,pageNumber,val,'')
        .subscribe((results: any[]) => {
          this.SpinnerService.hide()
          let datas = results["data"];
          this.getapprovexpenceList = datas;
          let datapagination = results["pagination"];
          this.getapprovexpenceList = datas;
          if (this.getapprovexpenceList.length === 0) {
           
          }
          if (this.getapprovexpenceList.length > 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.getapprovesumm_currentpage = datapagination.index;
           
          }
        })
    
    }
    send_value:String=""
    tourApproverSearch(){
      let form_value = this.tourApprovalSearchForm.value;
       this.send_value=''
      if(form_value.tourno)
      {
        this.send_value=this.send_value+"&tour_no="+form_value.tourno
        // this.send_value=this.send_value+"&tour_no="+form_value.tourno
      }
      if(form_value.requestdate)
      {
        let date=this.datePipe.transform(form_value.requestdate,"dd-MMM-yyyy");
        this.send_value=this.send_value+"&request_date="+date
      }
  
      this.getapprovesumm(this.send_value,1)
      
  
    }
    reset(){
      this.send_value=""
      this.tourApprovalSearchForm = this.fb.group({ 
        tourno:[''],
        requestdate:[''],
        
      })
      this.getapprovesumm(this.send_value,this.getapprovesumm_currentpage)
    }
    approveexpenceEdit(approvexpence){
      if(approvexpence.aptype==8){
      this.id=approvexpence.tour_id;
      this.crnumber = approvexpence.crno;
      this.key = 2;
      this.ap_verify='ap_verify';
      this.createsummary=false;
      this.firstscreen=false;
      this.secondscreen=true;
      this.getclaimrequestsumm();
      this.getERA(this.id,4,'0');
    }
      else{
        this.id=approvexpence.tour_id;
        this.crnumber = approvexpence.crno;
        this.key = 1;
        this.ap_verify='ap_verify';
        this.Advance=true;
        this.createsummary=false;
        this.firstscreen=false;
        this.secondscreen=false;
        this.advanceGet(approvexpence.tour_id,approvexpence.adv_id)
      }

    }

    datas: any
    // addForm() {
  
    //   let result = this.tourrr;
    //   console.log("nn", result)
    //   let re = {
    //     "requestno": result.requestno,
    //     "expenseid": result.expencetypee,
    //     "requestercomment": result.comments
    //   }
    //   console.log("ddd", re)
  
    //   this.getclaimrequest.push(re);
    //   console.log("ss", this.getclaimrequest)
    //   this.datas = re
    //   let data = this.shareservice.dropdownvalue.next(this.datas)
    //   console.log("data", data)
    //   this.resetclick();
      // this.tourmodel.expencetype='';
      // this.tourmodel.comments='';
      // this.tourmodel.reset();  
    // }
  
    resetclick() {
      this.tourmodell.expencetypee = '';
      this.tourmodell.comments = '';
    }
    getclaimrequestsumm() {
      this.SpinnerService.show();
      this.taService.getclaimaprequestsummary(this.id, this.ap_verify)
        .subscribe(result => {
          // console.log("claim .....", result)
          this.SpinnerService.hide();
          this.approvedamt = result.approved_amount
          this.eligibleamt = result.eligible_amount
          this.claimedamt = result.claimed_amount
          this.tourgid=result?.tour_id;
          this.reason=result?.treason;
          this.startdate=result?.tstartdate;
          this.requestdate=result?.tenddate;
          this.employee_code=result?.maker_data?.code;
          this.employee_name=result?.maker_data?.full_name;
          this.empdesignation=result?.maker_data?.designation;
          this.empgrade=result?.maker_data?.grade;
          let datas = result['data'];
          if (result.approver_branch_data) {
            let branchdetail = result.approver_branch_data
            const myform = this.expenceform
            this.remarks = result.approver_comment;
            myform.patchValue({
              "approval": branchdetail,
              "empbranchid": "(" + branchdetail.branch_code + ") " + branchdetail.branch_name,
              "appcomment": this.remarks
            })
            this.branchid = branchdetail.branch_id
          }
  
          this.getclaimrequest = datas;
          console.log("Claim Request......", this.getclaimrequest)
          for (var i = 0; i < this.getclaimrequest.length; i++) {
            // this.tourid= this.getclaimrequest[i].tourid;
            this.expenceid = this.getclaimrequest[i].expenseid;
            console.log("Claim Request......", this.expenceid)
          }
          this.taService.getadvanceEditsummary(this.id)
            .subscribe((result: any[]) => {
              this.advancelist = result['detail']
              this.advancelist = this.advancelist.filter(function (element) {
                return element.paid_advance_amount !== 0
              })
              this.sumadvance = 0;
              this.advancelist.forEach(element => {
                this.sumadvance += Number(element.paid_advance_amount)
              });
              console.log(this.advancelist);
            })
          if (this.approvedamt < this.sumadvance) {
            this.netpay = this.sumadvance - this.approvedamt
          }
          // else if(this.sumadvance == 0){
          //   this.netpay =this.approvedamt
          // }
          else {
            this.netpay = this.approvedamt - this.sumadvance
          }
  
          this.taService.getclaimccbsEditview(this.id).subscribe(result => {
            this.ccbslist = result;
            this.itemdisable = true;
            console.log("the edit",this.ccbslist)
            const length = result.length;
            // (this.expenceform.get('ccbs') as FormArray).clear()
          const myform = (this.expenceform.get('ccbs') as FormArray)
          for (var i = 0; i < length; i++) {
            myform.push(this.createccbs())

          }
          result.forEach(element => {
            element.ccid = element.cc_data;
            element.bsid = element.bs_data;
          });
          const ccbsform = this.expenceform
          ccbsform.patchValue({
            ccbs: result
          })
          if (length > 0) {
            if (this.status_id != -1 && this.status_id != 5) {
              (this.expenceform.get('ccbs') as FormArray)
              this.itemdisable = true;
            }
          }
        })
        if (this.approvedamt < this.sumadvance) {
          this.netpay = Number(this.sumadvance) - this.approvedamt
        }
        else {
          this.netpay = Number(this.approvedamt) - this.sumadvance
        }

          })
       
        this.getadvanceapprovesumm();
    }
    getadvanceapprovesumm(pageNumber = 1, pageSize = 10) {
      this.taService.getapproveflowapalllist(this.id, this.ap_verify)
        .subscribe(result => {
          console.log("Tourmaker", result)
          let datas = result['approve'];
          this.getAdvanceapproveList = datas;
          let mainelement = datas[datas.length - 1]
          this.approvedbyid = mainelement.id
          let lastbefore = datas[datas.length - 2]
          this.laststatus = mainelement.status
          this.reasonchange = mainelement.comment
  
          if (this.loginid == lastbefore.approver_id && this.statusId == 3 && this.laststatus == 2) {
            this.changeapprover = true;
            this.actionapprove = true;
            this.returnreason = false;
            this.rejectreason = false;
          }
          else {
            this.changeapprover = false;
            this.returnreason = true;
            this.rejectreason = true;
          }
  
          if ((this.statusId == 3 || this.statusId == 4 || this.statusId == 5) && this.laststatus != 2) {
            this.invalidpermission = true;
          }
          else {
            this.invalidpermission = false;
          }
  
          if (this.loginid != mainelement.approver_id && this.loginid != lastbefore.approver_id && this.applevel == 2) {
            this.movetootherno = false;
          }
          // if (mainelement.applevel == 2 && lastbefore.applevel == 2 && this.applevel == 1) {
          //   this.invalidpermission = true;
          // 
        })
    }
    brclear() {
      let myform = this.expenceform
      myform.patchValue({
        "empbranchid": null,
        "approval": null
      })
      this.apvl = false;
      this.empbrid = false;
    }
    empclear() {
      this.expenceform.patchValue({
        approval: null
      })
      this.apvl = false;
    }
    selectBranch(e) {
      console.log("e", e.value)
      let branchvalue = e
      this.branchid = branchvalue
      this.expenceform.patchValue({
        "approval": undefined
      })
  
    }
    remarksupdate(value) {
      this.remarks = value.target.value;
    }
    back() {
      // 
      // this.data = { index: 6 }
      // this.shareservice.summaryData.next(this.data)
      // this.router.navigateByUrl('ta/ta_summary');
      this.createsummary=true;
    this.firstscreen=false;
    this.secondscreen=false;
    this.Advance=false;
    (this.expenceform.get('ccbs') as FormArray).clear()
    if(this.expenceformview.get('creditdtl').valid){
      (this.expenceformview.get('creditdtl') as FormArray).reset();
      this.cdtsum=''
      for(let i=0;i<this.expenceformview.get('creditdtl').value.length;i++){
        if(i>0){
        this.removecreditd(i)
        }
      }
      
    }
    this.getapprovesumm('',this.getapprovesumm_currentpage,);
    
    }
    omit_special_char(event) {
      var k;
      k = event.charCode;  //         k = event.keyCode;  (Both can be used)
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 13 || k == 32 || (k >= 48 && k <= 57));
    }
    reasonupdate(event) {
      this.reasonchange = event.target.value;
    }
    approveclaim() {
      if (this.reasonchange == null || this.reasonchange == '') {
        this.notification.showError("Please Enter Reason")
        return false;
      }
      let payload = {
        "id": this.approvedbyid,
        "apptype": "claim",
        "tourgid": this.id,
        "appcomment": this.reasonchange,
        "status": "3",
        "approvedby": 0
      }
      this.approve_service(payload,this.fileData);
    }
  
    returnclaim() {
this.returnreasonap=true;
      this.submitbtn=false;
      if (this.reasonchange == null || this.reasonchange == '') {
        this.notification.showError("Please Enter Reason")
        return false;
      }
      let payload = {
        "id": this.approvedbyid,
        "apptype": "ap_verify",
        "appcomment": this.reasonchange,
        "tour_id": this.id
      }
      this.return_service(payload);
    }
  
    rejectclaim() {
      if (this.reasonchange == null || this.reasonchange == '') {
        this.notification.showError("Please Enter Reason")
        return false;
      }
  
      let payload = {
        "id": this.approvedbyid,
        "apptype": "ap_verify",
        "appcomment": this.reasonchange,
        "tour_id": this.id
      }
      this.reject_service(payload)
    }
    approve_service(data,file_data) {
      this.SpinnerService.show();
      this.taService.approvetourmaker(data,file_data)
        .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.SpinnerService.hide();
            this.notification.showWarning("Duplicate! Code Or Name ...")
          } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.SpinnerService.hide()
            this.notification.showError("INVALID_DATA!...")
          }
          else if (res.status == 'success') {
            this.SpinnerService.hide()
            //Bug 7135 Fix ** Starts ** Developer: Hari ** Date:24/04/2023
            let actionvalue = this.expenceform.value.action
            if(actionvalue == 'APPROVE')
            this.notification.showSuccess("Approved Successfully")
            else if(actionvalue == 'MOVE TO OTHER')
            this.notification.showSuccess("Forwarded Successfully")
              //Bug 7135 Fix ** Ends **  Developer: Hari ** Date:24/04/2023
            this.data = { index: 2 }
            // this.sharedService.summaryData.next(this.data)
            // this.router.navigateByUrl('ta/ta_summary');
            // this.onSubmit.emit();
            return true
          }
          else {
            this.SpinnerService.hide()
            this.notification.showError(res.description)
  
          }
  
        })
    }
  
    reject_service(data) {
      this.SpinnerService.show()
      this.taService.rejecttourmaker(data,'')
        .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.SpinnerService.hide()
            this.notification.showWarning("Duplicate! Code Or Name ...")
          } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.SpinnerService.hide()
            this.notification.showError("INVALID_DATA!...")
          }
          else if (res.status == 'success') {
            this.SpinnerService.hide()
            this.notification.showSuccess("Rejected Successfully")
            this.data = { index: 2 }
            // this.sharedService.summaryData.next(this.data)
            // this.router.navigateByUrl('ta/ta_summary');
            // this.onSubmit.emit();
            this.back();
            return true
          }
          else {
            this.SpinnerService.hide()
            this.notification.showError(res.description)
  
          }
        })
    }
    return_service(data) {
      this.SpinnerService.show()
      this.taService.returntourmaker(data,'')
        .subscribe(res => {
          if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
            this.SpinnerService.hide()
            this.notification.showWarning("Duplicate! Code Or Name ...")
          } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
            this.SpinnerService.hide()
            this.notification.showError("INVALID_DATA!...")
          }
          else if (res.status == 'success') {
            this.SpinnerService.hide()
            this.notification.showSuccess("Returned Successfully")
            this.data = { index: 2 }
            // this.sharedService.summaryData.next(this.data)
            // this.router.navigateByUrl('ta/ta_summary');
            // this.onSubmit.emit();
this.back();
            return true
          }
          else {
            this.SpinnerService.hide()
            this.notification.showError(res.description)
  
          }
        })
    }
    expenseEdit(data) {
      this.data = data
      console.log("dd", this.data)
       
      let a =this.shareservice.id.next(this.id)
      console.log("the the id ",a)
      let ap='ap';



     let b= this.shareservice.expenseedit.next(this.data);
     console.log('expence id ',b)
      var datas = JSON.stringify(Object.assign({}, data))
    localStorage.setItem("expense_edit", datas)
      if (this.data.expenseid == 1) {
        this.TA_ExpenceData_Enb=true;
        this.secondscreen=false;
        this.shareservice.TA_Ap_Exp_Enb_type.next(true);
        // this.router.navigateByUrl('ta/travel');
      }
      else if (this.data.expenseid == 2) {
        // this.router.navigateByUrl('ta/daily');
        this.TA_DailyDim_Enb=true;
        this.secondscreen=false;
        this.shareservice.TA_Ap_Exp_Enb_type.next(true);
      }
      else if (this.data.expenseid == 3) {
        this.TA_Inci_Enb=true;
        this.secondscreen=false;
        this.shareservice.TA_Ap_Exp_Enb_type.next(true);
        // this.router.navigateByUrl('ta/inci');
      }
      else if (this.data.expenseid == 4) {
        this.TA_Local_Enb=true;
        this.secondscreen=false;
        this.shareservice.TA_Ap_Exp_Enb_type.next(true);
        // this.router.navigateByUrl('ta/local')
      }
      else if (this.data.expenseid == 5) {
        this.TA_Lodge_Enb=true;
        this.secondscreen=false;
        this.shareservice.TA_Ap_Exp_Enb_type.next(true);
        // this.router.navigateByUrl('ta/lodge')
      }
      else if (this.data.expenseid == 6) {
        this.TA_Misc_Enb=true;
        this.secondscreen=false;
        this.shareservice.TA_Ap_Exp_Enb_type.next(true);
        // this.router.navigateByUrl('ta/misc')
      }
      else if (this.data.expenseid == 7) {
        this.TA_Pack_Enb=true;
        this.secondscreen=false;
        this.shareservice.TA_Ap_Exp_Enb_type.next(true);
        // this.router.navigateByUrl('ta/pack')
      }
      else if (this.data.expenseid == 8) {
        this.router.navigateByUrl('ta/deput')
      }
    }
    expense_navigate(){
      console.log('123_1')
      this.TA_DailyDim_Enb=false;
      this.TA_ExpenceData_Enb=false;
      this.TA_Lodge_Enb=false;
      this.TA_Inci_Enb=false;
      this.TA_Local_Enb=false;
      this.TA_Misc_Enb=false;
        this.secondscreen=true;
        this.TA_Pack_Enb=false;
        this.shareservice.TA_Ap_Exp_Enb_type.next(null);
    }
    getimages() {
      this.taService.getfetchimages(this.id)
        .subscribe((results) => {
          this.attachment_view = true
          this.showattachment = true
          this.resultimage = results[0].url
          const file_ext = ['pdf', 'jpg', 'png', 'PDF', 'JPG', 'JPEG', 'jpeg', 'image']
          this.attachmentlist = results
          // this.count = this.attachmentlist.length
          console.log("barcode", results)
  
          for (var i = 0; i < results.length; i++) {
  
            var downloadUrl = results[i].url;
            let stringValue = results[i].file_name.split('.')
            this.fileextension = stringValue.pop();
            if (file_ext.includes(this.fileextension)) {
              continue
            }
            else if (this.file_downloaded == false) {
              this.viewpdfimageeee = window.open(downloadUrl, '_blank');
              console.log('barcode', downloadUrl)
              this.fileid = results[i].id
              console.log("this.fileid", this.fileid)
              this.getcall()
            }
          }
          this.file_downloaded = true;
        })
    }
    getcall() {
      this.taService.getfetchimages1(this.fileid)
        .subscribe((results) => {
          console.log("results", results)
        })
    }

  actionchange() {
    let actionvalue = this.expenceform.value.action
    if (actionvalue == 'APPROVE' && this.applevel == 1 || actionvalue == 'MOVE TO OTHER') {
      this.amtapprove = false;
      this.actionapprove = true;
      this.actionreject = false;
      this.actionreturn = false;
      this.showreason = false;
      const myForm = this.expenceform;
      myForm.patchValue({
        "approval": undefined,
        "empbranchid": null,
        "remarks": null,
      });
    }
    else if (actionvalue == 'APPROVE' && this.applevel == 2) {
      this.amtapprove = true;
      this.actionreject = false;
      this.actionreturn = false;
      this.actionapprove = false;
      this.showreason = true;
    }
    else if (actionvalue == 'REJECT') {
      this.amtapprove = false;
      this.actionreject = true
      this.actionreturn = false;
      this.actionapprove = false;
      this.showreason = true;
    }
    else if (actionvalue == 'RETURN') {
      this.amtapprove = false;
      this.actionreturn = true;
      this.actionreject = false;
      this.actionapprove = false;
      this.showreason = true;
    }
  }
  displayFn(subject) {
    return subject ? "(" + subject.code + ")" + subject.full_name : undefined;
  }
  submitvaluecheck() {
    let values = this.expenceform.value;
    if (values.empbranchid && values.approval && values.appcomment && !this.invalidpermission) {
      return false;
    }
    else {
      return true
    }

  }
  approvefirst() {
    const myform = this.expenceform.value;
    if (myform.empbranchid == null || myform.empbranchid == '') {
      this.notification.showError('Please Select Branch')
      return false
    }
    if (this.remarks == null || this.remarks == '') {
      this.notification.showError("Please Enter Remarks")
      return false;
    }

    if (myform.approval == null || myform.approval == '') {
      this.notification.showError('Please Select Approver')
      return false
    }

    if (this.changeapprover) {
      let payload = {
        "id": this.approvedbyid,
        "apptype": "claim",
        "tour_id": this.id,
        "comment": myform.appcomment,
        "approver": myform.approval.id
      }
      this.taService.claimapproveupdate(payload).subscribe(results => {
        if (results.status == "success") {
          this.notification.showSuccess("Updated Successfully")
          this.data = { index: 2 }
          // this.shareservice.summaryData.next(this.data)
          this.router.navigateByUrl('ta/ta_summary');
          this.onSubmit.emit();
          return true
        }
        else {
          this.notification.showError(results.description)
        }
      })
    }
    else {
      let payload = {
        "id": this.approvedbyid,
        "apptype": "claim",
        "tourgid": this.id,
        "appcomment": myform.appcomment,
        "status": "3",
        "approvedby": myform.approval.id
      }
      this.approve_service(payload,this.fileData)
    }


  }
  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    this.filesystem_error = false;
    let id = pdf_id;
    this.fileid = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.fileextension === "pdf") {
      this.jpgUrls = this.imageUrl + "taserv/download_documents/" + id + "?type=pdf&token=" + token
      // this.file_window = window.open(this.pdfUrls, "_blank", 'width=600,height=400,left=200,top=200')
    }
    else if (this.fileextension === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
      // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {

      this.jpgUrls = this.imageUrl + "taserv/download_documents/" + id + "?type=" + this.fileextension + "&token=" + token
    }
    else {
      this.filesystem_error = true;
    }
  }
  getimagedownload(url, file_name) {
    this.taService.getfetchimagesss(url)
    // .subscribe(result=>{
    // this.pdfimages=result
    // }
    // )
  }
    autocompleteid() {
      setTimeout(() => {
        if (this.matassetidauto && this.autocompletetrigger && this.matassetidauto.panel) {
          fromEvent(this.matassetidauto.panel.nativeElement, 'scroll').pipe(
            map(x => this.matassetidauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          ).subscribe(data => {
            const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.matassetidauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.matassetidauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            console.log("CALLLLL", atBottom)
            if (atBottom) {
  
              if (this.has_nextemp) {
                this.taService.getbranchvalues(this.has_presentemp).subscribe(data => {
                  let dts = data['data'];
                  console.log('h--=', data);
                  console.log("SS", dts)
                  console.log("GGGgst", this.branchlist)
                  let pagination = data['pagination'];
                  this.branchlist = this.branchlist.concat(dts);
  
                  if (this.branchlist.length > 0) {
                    this.has_nextemp = pagination.has_next;
                    this.has_previousemp = pagination.has_previous;
                    this.has_presentemp = pagination.index;
  
                  }
                })
              }
            }
          })
        }
      })
    }
    csview(subject) {
      return subject ? subject.name : undefined;
    }
    ccbsreadonly(status) {
      if (this.applevel == 1) {
        return true;
      }
      else {
        return false;
      }
    }
    removeSection1(index, ccbs) {
      // (<FormArray>this.expenceform.get('ccbs')).removeAt(index);

      (this.expenceform.get('ccbs') as FormArray).removeAt(index);
      // this.ccbslist.indexOf(element=>element.);
      
     
    }
    ccbsbtn() {
      let sum = this.expenceform.value.ccbs.map(item => Number(item?.percentage))?.reduce((prev, next) => prev + next);
      return sum
    }
  
    ccbsamt() {
      return this.getclaimrequest.map(item => Number(item?.approvedamount))?.reduce((prev, next) => prev + next);
    }
    percen_calc(event, ind) {
      let value = (event.target.value / this.ccbsamt()) * 100;
      if (value > 0) {
        const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
        myForm.patchValue({
          percentage: value
        });
      }
    }
  
  
    ccbs_validation(ind, field = 'percentage') {
      const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
      // let value = evt.target.value;
      if (field == 'percentage') {
        if (this.ccbsbtn() > 100) {
          this.notification.showError('Please Enter Valid Percentage as Total Percentage can not be greater than 100');
          myForm.patchValue({
            percentage: null,
            amount: null
          });
        }
      }
      else {
        let sum = this.expenceform.value.ccbs.map(item => Number(item.amount)).reduce((prev, next) => prev + next);
        if (sum > this.ccbsamt) {
          this.notification.showError('Please Enter Valid Amount, as Total CCBS Amount can not be greater than ' + sum);
          myForm.patchValue({
            amount: null,
            percentage: null
          });
        }
      }
  
    }
  
    amount_calc(event, ind) {
      var value = (event.target.value / 100) * this.ccbsamt();
      if (value > 0) {
        const myForm = (<FormArray>this.expenceform.get('ccbs')).at(ind);
        myForm.patchValue({
          amount: value
        });
      }
    }
    amt:any
    sumpercent:any
    
    addccbs() {
      this.amt = this.ccbsamt();
  
      if (this.amt == null || this.amt == 0) {
        this.notification.showError("Amount Can't be ZERO (0)")
        return false
      }
  
      var sum_percent: number = 0;
      let percentlist = (this.expenceform.get('ccbs') as FormArray).value
      percentlist.forEach(element => {
        if (element.ccbs_edit_status != 0 || element.ccbs_edit_status == 1 || element.ccbs_edit_status == null) {
          sum_percent = sum_percent + parseFloat(element.percentage);
        }
      });
      if (sum_percent < 100 && this.amt != null) {
         (this.expenceform.get('ccbs') as FormArray).push(this.createccbs());
         this.ccbslist=(this.expenceform.get('ccbs') as FormArray).value;
      }
      else {
        this.notification.showError("Check CCBS Percentage or Amount...")
      }
    }
    createccbs() {
      let group = this.fb.group({
        id: 0,
        bsid: null,
        ccid: '',
        amount: null,
        tourgid: this.id,
        percentage: null,
      });
      return group;
    }
    bisinesslist:any;
    checkind(ind) {
      (<FormArray>this.expenceform.get("ccbs")).at(ind).get('bsid').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taService.getbusinesssegmentValue(value, 1))
        )
        .subscribe((results: any[]) => {
          let datas = results['data'];
          this.bisinesslist = datas;
        });
      return true
    }
    getbusinesssegmentValue() {
      this.taService.getbusinesssegmentValue('', 1)
        .subscribe(result => {
          this.bisinesslist = result['data']
          console.log("bisinesslist", this.bisinesslist)
        })
    }
    bsview(subject) {
      return subject ? subject.name : undefined;
    }
    has_nextbsid: boolean = true;
    has_presentbsid: number = 1;
    bsidget() {
      setTimeout(() => {
        if (this.matbssidauto && this.autocompletetrigger && this.matbssidauto.panel) {
          fromEvent(this.matbssidauto.panel.nativeElement, 'scroll').pipe(
            map(x => this.matbssidauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          ).subscribe(data => {
            const scrollTop = this.matbssidauto.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbssidauto.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbssidauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            console.log("CALLLLL", atBottom)
            if (atBottom) {
  
              if (this.has_nextbsid) {
                this.taService.getbusinesssegmentValue(this.bsssid.nativeElement.value, this.has_presentbsid + 1).subscribe(data => {
                  let dts = data['data'];
                  console.log('h--=', data);
                  console.log("SS", dts)
                  console.log("GGGgst", this.bisinesslist)
                  let pagination = data['pagination'];
                  this.bisinesslist = this.bisinesslist.concat(dts);
  
                  if (this.bisinesslist.length > 0) {
                    this.has_nextbsid = pagination.has_next;
                    this.has_presentbsid = pagination.has_previous;
                    this.has_presentbsid = pagination.index;
  
                  }
                })
              }
            }
          })
        }
      })
  
    }
    bs:any;
    getBS(id, ind) {
      this.bs = id
      const myForm = (<FormArray>this.expenceform.get("ccbs")).at(ind);
      myForm.patchValue({
        ccid: undefined
      });
  
      this.getcostcenterValue()
    }
    costlist:any;
    checkccind(ind) {
      (<FormArray>this.expenceform.get("ccbs")).at(ind).get('ccid').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taService.getcostcenterValue(value, this.bs))
        )
        .subscribe((results: any[]) => {
          let datas = results['data'];
          this.costlist = datas;
        });
      return true
    }
    getcostcenterValue() {
      this.taService.getcostcenterValue('', this.bs)
        .subscribe(result => {
          this.costlist = result['data']
          console.log("costlist", this.costlist)
        })
    }
    isDisabled:boolean=false
    comentscl() {
      if (this.tourmodell.comments != "") {
        this.isDisabled = false;
      }
      else {
        this.isDisabled = false;
      }
  
    }
    submitccbs() {
      let formdata = JSON.parse(JSON.stringify(this.expenceform.value));
      let sum_percent: number = 0;
      let amount: number = 0;
       let compare_ccbs: [number, number][] = [];
      let percentlist = (this.expenceform.get('ccbs') as FormArray).value
      // let percentlist = 
      percentlist.forEach(element => {
        if (element.percentage < 0) {
          this.notification.showError("Percentage Can't be Zero")
          throw new Error
        }
        if (element.ccid == null || element.bsid == null) {
          this.notification.showError("Please select CCBS")
          throw new Error
        }
        sum_percent = sum_percent + Number(element.percentage)
        amount = amount + Number(element.amount)
        compare_ccbs.push([element.ccid,element.bsid])
      });
      let uniqueSet = new Set(compare_ccbs.map(item => JSON.stringify(item)));
      if ((compare_ccbs.length !== uniqueSet.size)){
        this.notification.showError("Don't Enter Same CC BS in Split CCBS")
        return false;
      }
      if (sum_percent == 100 && this.approvedamt == amount && amount != 0) {
        this.closebutton.nativeElement.click();
        this.submitForm()
      }
      else {
        this.notification.showError("Total Percentage Must be 100")
        return false;
      }
    }
    isdeleted:boolean=false;
    submitForm() {
    
      this.SpinnerService.show()
      let formdata = JSON.parse(JSON.stringify(this.expenceform.value));
      // let formdata = this.expenceform.value;
      console.log('the submit ccbs formdata',formdata);
      let ccbsdata = formdata.ccbs
      let sum_percent: number = 0;
      let amount: number = 0;
      ccbsdata.forEach(element => {
        if (element.id == 0) {
          delete element.id;
        }
        if (element.ccid == null || element.bsid == null) {
          this.notification.showError("Please Select CCBS")
          throw new Error
        }
        if (element.percentage < 0.1) {
          this.notification.showError("Please Enter CCBS Percentage")
          throw new Error
        }
  
        element.ccid = element.ccid.id;
        element.bsid = element.bsid.id;
        element.percentage = Number(element.percentage)
        sum_percent = sum_percent + Number(element.percentage)
        element.amount = Number(element.amount)
        amount = amount + Number(element.amount)
      });
  
      if (sum_percent != 100) {
        this.notification.showError("Check CCBS Percentage")
        return false;
      }
      // if (this.claimedamt != amount) {
      if (this.approvedamt != amount) {
        this.notification.showError("Check CCBS Amount")
        return false
      }
    //  if(ccbsdata.id=null ){
    //      ccbsdata
    //  }
    //  else{
    //     this.isdeleted=false;
    //  }
     
      let apsubmit={
        
        'ccbs':ccbsdata
      }
      // let payload;
      // if (this.isonbehalf) {
      //   payload = {
      //     "tourgid": formdata.tourgid,
      //     "approvedby": formdata.approval.id,
      //     "appcomment": formdata.appcomment,
      //     "ccbs": ccbsdata,
      //     "onbehalfof": this.onbehalfid
      //   }
      // }
      // else {
      //   payload = {
      //     "tourgid": formdata.tourgid,
      //     "approvedby": formdata.approval.id,
      //     "appcomment": formdata.appcomment,
      //     "ccbs": ccbsdata
      //   }
      // }
      this.taService.Submit_ccbs_expence_ap(apsubmit)
    .subscribe(res => {
      console.log("dailydeimres", res)
      this.SpinnerService.hide()
      if (res.message === "Successfully Created" && res.status === "success" || res.message === "Successfully Updated" && res.status === "success") {
        this.notification.showSuccess( res.message )
        return true;
      }
      else {
        this.notification.showError(res.description)
        return false;
      }
    })
    this.SpinnerService.hide();
          }
          returnExpenceCheckerclaim() {
            this.returnreasonap=true;
            this.submitbtn=false;
            if (this.reasonchange == null || this.reasonchange == '') {
              this.notification.showError("Please Enter Reason")
              return false;
            }
            let payload = {
              "id": this.approvedbyid,
              "apptype": "ap_verify",
              "appcomment": this.reasonchange,
              "tour_id": this.id,
              "key":'checker'
            }
            this.return_service(payload);
          }
          returnTourMaker() {
            this.returnreasonap=true;
            this.submitbtn=false;
            if (this.reasonchange == null || this.reasonchange == '') {
              this.notification.showError("Please Enter Reason")
              return false;
            }
            let payload = {
              "id": this.approvedbyid,
              "apptype": "ap_verify",
              "appcomment": this.reasonchange,
              "tour_id": this.id,
              "key":'tour_maker'
            }
            this.return_service(payload);
          }
  ecf_raiser:any;
  ecf_type:any;
  ecf_amount:any;
  ecf_status:any;
  commodity_name:any;
  invoice_date:any;
  with_paper:any;
  apdate:any;
  approve_screen(list){
    this.crnumber=list.crno
    this.ecf_raiser=list.approvername
    this.ecf_type=list.aptype
    this.ecf_amount=list.apamount
    this.ecf_status=list.ecfstatus
    this.commodity_name=list.commodity_id.name
    this.invoice_date=list.apdate
    this.with_paper=list.papertype
    this.apdate=(list.apdate)
    // this.approvepayform.get('crno').patchValue(list.crno)
    //   this.approvepayform.get('ecf_raiser').patchValue(list.approvername)
    //   this.approvepayform.get('ecf_type').patchValue(list.aptype)
    //   this.approvepayform.get('ecf_amount').patchValue(list.apamount)
    //   this.approvepayform.get('ecf_status').patchValue(list.ecfstatus)
    //   this.approvepayform.get('commodity_name').patchValue({name:list.commodity_id.name})
    //   this.approvepayform.get('invoice_date').patchValue(list.apdate)
    //   this.approvepayform.get('with_paper').patchValue(list.papertype)
    //   this.approvepayform.get('inward_date').patchValue(list.apdate)


      // 'ecf_raiser':new FormControl(),
      // 'ecf_type':new FormControl(),
      // 'ecf_amount':new FormControl(),
      // 'ecf_status':new FormControl(),
      // 'commodity_name':new FormControl(),
      // 'invoice_date':new FormControl(),
      // 'with_paper':new FormControl(),
      // 'inward_date':new FormControl(),
  }
  employeeid:any
  approve_pay(){ 
    if (this.reasonchange == null || this.reasonchange == '') {
      this.notification.showError("Please Enter Reason")
      return false;
    }
    if (!this.attachment_view) {
      this.notification.showError('Please view the attachments')
      return false;
    } 
    this.SpinnerService.show()
    this.employeeid=JSON.parse(localStorage.getItem('sessionData'))['employee_id']
    let data:any={"crno":this.crnumber,"approvedby":this.employeeid, "tour_id":this.id, "key":this.key}
    this.taService.ap_approval_and_pay(data).subscribe(res => {
      this.SpinnerService.hide()  
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('Successfully Approved')
        this.commonSummarySearch(this.currentpage);
        this.back();
        // this.closebutton.nativeElement.click();
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }
  closefile_window() {
    this.file_window.close()
  }
  aptypeid: any;
  getPaymode(ind) {
    this.payableSelected = false

    let text =""
    if(this.aptypeid == 7)
    {
      text ="cr"
    }
    this.taService.getallPaymode()
    .subscribe((results: any[]) => {
      let paymodedata = results["data"];
      this.PaymodeList = paymodedata;
      console.log("paymodelist",this.PaymodeList)
      this.PaymodeList = paymodedata.filter(pay => pay.code === 'PM004')
      this.getERA(this.id,this.PaymodeList,ind)

      const creditdtlsdatas = this.expenceform.value.creditdtl
      for (let i=0; i < creditdtlsdatas.length; i++) 
      {
        let paymodecode = creditdtlsdatas[i].paymode_id?.code
        let gl_flag = this.PaymodeList.filter(pay => pay.code === paymodecode)[0]?.gl_flag
        if (gl_flag === 'Payable' && ind !== i)
        {
          this.payableSelected = true
          break;
        }
        else
        {
          this.payableSelected = false
        }
      }
      if(this.aptypeid == 3 && ind == 0)
      {
        this.PaymodeList  =paymodedata.filter(pay => (this.payableSelected === false && pay.code === 'PM004')  )
      }
    
      else if(this.aptypeid == 4 && this.ppxid  == "E" && ind == 0)
      {
        this.PaymodeList  =paymodedata.filter(pay => (this.payableSelected === false && pay.code === 'PM004'))
      }
      // 
    })   
  }
  getCreditSections(form) {
    // console.log(form);
    return form.controls.creditdtl.controls;
  }
  paymodecode:any
  paymode_id:any
  creditids:any
  bank_id:any
  getERA(id,paymodeid,ind) {
    
    let tour_id=id
    let accno:''
    this.SpinnerService.show()
    this.taService.getcreditpaymodesummaryy(1,tour_id, paymodeid, accno)
        .subscribe(result => {
          this.SpinnerService.hide();
          if(result.code!="" && result.code!=null && result.code!=undefined){
            this.notification.showError(result?.code);
            this.notification.showError(result?.description);
          }else{
            if(paymodeid == '4'){
           
              this.ERAList = result.data
          
              if(this.ERAList?.length > 0)
              {
              
              for(let i=0;i<this.ERAList.length;i++){
               let accdtls = this.ERAList[i]
               if((i>0)&& this.expenceformview['controls']['creditdtl'].value.length==1){
                // (this.expenceformview.get('creditdtl') as FormArray).push(this.creditdetails());
                this.addcreditSection()
               }
               
               this.ERAid=accdtls?.id;
               this.paymodecode = accdtls.paymode.code
               this.paymode_id= accdtls.paymode.id
               this.creditids = accdtls.bank.id
               this.bank_id= accdtls.bank.id
                let amount=parseFloat(accdtls?.credit_details[0]?.sum_of_approved_amount).toFixed(2)

               this.expenceformview.get('creditdtl')['controls'][i].get('paymode_id').setValue(accdtls?.paymode)
               this.expenceformview.get('creditdtl')['controls'][i].get('accno').setValue(accdtls?.account_number)
               this.expenceformview.get('creditdtl')['controls'][i].get('refno').setValue(accdtls?.account_number)
               this.expenceformview.get('creditdtl')['controls'][i].get('bank').setValue(accdtls?.bank?.name)
               this.expenceformview.get('creditdtl')['controls'][i].get('branch').setValue(accdtls?.bankbranch?.name)
               this.expenceformview.get('creditdtl')['controls'][i].get('ifsccode').setValue(accdtls?.bankbranch?.ifsccode)
               this.expenceformview.get('creditdtl')['controls'][i].get('benificiary').setValue(accdtls?.beneficiary_name)
               this.expenceformview.get('creditdtl')['controls'][i].get('glno').setValue(accdtls?.credit_details[0])
               this.expenceformview.get('creditdtl')['controls'][i].get('amount').setValue(amount)
               this.cdtsum=accdtls?.net_amount;
               this.isapprovepay_btnenable=true;
               if(this.expenceformview.get('creditdtl').valid){
                if(this.expenceformview['controls']['creditdtl'].value.length>1){
                  this.crd_details_saved=2;
                  this.crd_details_amntsaved=true;
                }
                else{
                  this.crd_details_saved=0;
                  this.crd_details_amntsaved=false;
                }
               }
               
               console.log(this.expenceformview.get('creditdtl')['controls'])
                }
              };
              this.getPaymode_drpdwn();
              if(this.ERAList?.length == 0){
                window.alert("Employee don't have an Account Number")
                return false
              }
            }
            
            else {
            this.toastr.warning("Employee don't have an Account Number and against era number are missing")
            }  
          }
        })
      
  }
    creditdetails(){
      let group=this.fb.group({
        'paymode_id':new FormControl(),
        'accno':new FormControl(),
        'refno':new FormControl(),
        'bank':new FormControl(),
        'branch':new FormControl(),
        'ifsccode':new FormControl(),
        'benificiary':new FormControl(),
        'glno':new FormControl(),
        'amount':new FormControl(),
        'amountmatched':new FormControl()


      })
      return group
    }
    
   addcreditSection(exceedAmt = 0, paymode = "") {    
    // this.getCreditSections(form)
    const control = <FormArray>this.expenceformview.get('creditdtl');
    control.push(this.creditdetails());
    this.disablecretditdetails = this.expenceformview.value.creditdtl.length
    console.log('details number',this.disablecretditdetails)
    this.isapprovepay_btnenable=false
    // let index = creditDtl.length;
    // this.disablecretditdetails=index;
    if (this.disablecretditdetails==1){

    }
    // if(exceedAmt != 0)
    // {
     
    // } else if(paymode =="PM004")
    // {
      
    // this.getPaymode(index)
    // this.getERA(this.id,4,index)
    
  }
  removecreditd(index){
    var form = this.expenceformview.get('creditdtl') as FormArray;
    form.removeAt(index);
    this.isapprovepay_btnenable=true
    this.disablecretditdetails = this.expenceformview.value.creditdtl.length
  }
  amountchange(index){
    let sum=this.cdtsum.toFixed(2);
    
    console.log('summ',sum);
    if(this.expenceformview.value.creditdtl[index].amountmatched!='' || this.expenceformview.value.creditdtl[index].amountmatched!=null || this.expenceformview.value.creditdtl[index].amountmatched!=undefined){
      let amountmatched:any = parseFloat(this.expenceformview.value.creditdtl[index].amountmatched).toFixed(2);
      // let amountmatched = this.expenceformview.value.creditdtl[index].amountmatched
      // this.expenceformview.get('creditdtl')['controls'][index].get('amountmatched').setValue(amountmatched);
      let Totalamt = Number(sum) - Number(amountmatched)
      let creditrows = (this.expenceformview.get('creditdtl') as FormArray);
      if( Totalamt<0){
        creditrows.at(0).patchValue({
          'amount': this.cdtsum.toFixed(2)
        });
        creditrows.at(index).patchValue({
          'amount': '0.00',
          'amountmatched':''
        });
        this.notification.showError("Please enter less than Net Amount");
        return false;
      }
      else{
      if(!isNaN(amountmatched) ){
        creditrows.at(index).patchValue({
          'amount': amountmatched
        });
      }
      else{
        creditrows.at(index).patchValue({
          'amount': '0.00'
        });
       
      }
      
      if (!isNaN(Totalamt)) {
        creditrows.at(0).patchValue({
          'amount': Totalamt.toFixed(2)
        });
      }
      else {
        creditrows.at(0).patchValue({
          'amount': this.cdtsum.toFixed(2)
        });
      }
    }
      
  }    
  }
  creditgllist:Array<any>=[]
  Paymode:Array<any>=[]
  getPaymode_drpdwn(){
    this.taService.getPaymode().subscribe(result=>{
      
      this.paymodedropdown=result['data']
    },(error:HttpErrorResponse)=>{
      this.notification.showWarning(error.status+error.message);
    })
  }
  getcreditgl(index){
     let id=this.expenceformview.value.creditdtl[index].paymode_id.id;
    let crediglname=this.expenceformview.value.creditdtl[index].paymode_id.name;
    // this.creditglform.patchValue({
    //   'paymode':crediglname
    // })
    this.taService.getcreditgl(id).subscribe(result=>{
      this.creditgllist=result['data'];
    },(error:HttpErrorResponse)=>{
      this.notification.showWarning(error.status+error.message);
    })
  }  
  submitcredit() {
    let payload=[]
    let data={};
    for(let i=0;i<this.expenceformview.get('creditdtl')['value'].length;i++){
      if(this.expenceformview.get('creditdtl')['value'].length==2){
        if(this.expenceformview.get('creditdtl')['value'][1]['paymode_id']=="" || this.expenceformview.get('creditdtl')['value'][1]['paymode_id']==null || this.expenceformview.get('creditdtl')['value'][1]['paymode_id']==undefined){
          this.notification.showError("Please Select Paymode");
          return false;
        }
        if(this.expenceformview.get('creditdtl')['value'][1]['glno']=="" || this.expenceformview.get('creditdtl')['value'][1]['glno']==undefined || this.expenceformview.get('creditdtl')['value'][1]['glno']==null ){
           this.notification.showError("Please Select Gl Number");
           return false;
        }
        if(this.expenceformview.get('creditdtl')['value'][1]['amount']=="" || this.expenceformview.get('creditdtl')['value'][1]['amount']==undefined || this.expenceformview.get('creditdtl')['value'][1]['amount']==null ){
          this.notification.showError("Please enter a amount change");
          return false;
       }
        
      }
      data ={ 
        "id":this.ERAid,
        "tour_id": this.id,
          "paymode_id": this.expenceformview.get('creditdtl')['value'][i]['paymode_id'].id,
          "bank_id": this.bank_id,
          "glno":  this.expenceformview.get('creditdtl')['value'][i]['glno'].glno,
          "account_no":  this.expenceformview.get('creditdtl')['value'][i]['accno'],
          "amount":  this.expenceformview.get('creditdtl')['value'][i]['amount'],
          
          "type": "claim"
        
        }
        payload.push(data);
    
      }
     
  this.SpinnerService.show();
    this.taService.createtourcreditdetails(payload)
      .subscribe((res) => {
        this.SpinnerService.hide();
      if (res.status=="success"){
        this.toastr.success(res.message);
        this.isapprovepay_btnenable=true;
        this.crd_details_amntsaved=true;
      }
     else{
        this.toastr.error(res.description);
        this.crd_details_amntsaved=false;
    }
    },
    (error)=>{
      this.toastr.error(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  
  }
}
