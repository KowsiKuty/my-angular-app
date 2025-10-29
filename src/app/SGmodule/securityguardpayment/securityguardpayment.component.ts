import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { SGService } from '../SG.service';
import { SGShareService } from '../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTabChangeEvent } from '@angular/material/tabs';
// import {faChevronLeft, faChevronRight} from '@fortawesome/fontawesome-free-solid';


import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// import {BranchcertSummaryComponent} from '../branchcert-summary/branchcert-summary.component'
import { BranchcertSummaryComponent } from '../branchcert-summary/branchcert-summary.component'
import { InvoiceSummaryComponent } from '../invoice-summary/invoice-summary.component'
import * as moment from 'moment';

import { DatePipe, formatDate } from '@angular/common';


import { default as _rollupMoment, Moment } from 'moment';

import { MatDatepicker } from '@angular/material/datepicker';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, count } from 'rxjs/operators';

import { SharedService } from '../../service/shared.service'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment';


const moment1 = _rollupMoment || moment;



export interface branchList {
  id: number
  name: string
  code: string
}
export interface premiseList {
  id: number
  name: string
  code: string
}

export interface approver_IN {
  id: string;
  name: string;
}






export interface approvalBranch {
  id: string;
  name: string;
  code: string;
}

export interface productlistss {
  id: number,
  name: string,
  code: string
}

export interface approver {
  id: string;
  full_name: string;
  code: string
}

export interface branchlistss {
  id: number,
  name: string,
  code: string
}

export interface primeslistss {
  id: number,
  name: string,
  code: string
}

export interface Shift {
  id: number
  Shift: string
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-securityguardpayment',
  templateUrl: './securityguardpayment.component.html',
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ['./securityguardpayment.component.scss'],
  providers: [BranchcertSummaryComponent, InvoiceSummaryComponent,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SecurityguardpaymentComponent implements OnInit {

  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branchtype') matAutocompletebrach: MatAutocomplete;

  // Premise dropdown
  @ViewChild('PremiseContactInput') PremiseContactInput: any;
  @ViewChild('primestype') matAutocompletepremise: MatAutocomplete;

  @ViewChild('PremiseContactInput') clear_premises;

  // Vendor dropdown
  @ViewChild('VendorContactInput') VendorContactInput: any;
  @ViewChild('producttype') matAutocompletevendor: MatAutocomplete;


  @ViewChild('VendorContactInput') clear_agency;


  //approval branch
  @ViewChild('appBranchInput') appBranchInput: any;
  @ViewChild('approvalBranch') matAutocompleteappbranch: MatAutocomplete;


  // Approver dropdown
  @ViewChild('ApproverContactInput') ApproverContactInput: any;
  @ViewChild('employee') matAutocompleteapprover: MatAutocomplete;
  @ViewChild('ApproverContactInputtwo') ApproverContactInputtwo: any;

  @ViewChild('ApproverContactInput') clear_appBranch;

  // popup-screens
  @ViewChild('addaprover') addaprover;
  @ViewChild('rejected') rejected;
  @ViewChild('review') review;
  @ViewChild('makerchecker') makerchecker;



  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  Securityguardpayment: FormGroup

  AtttendaceFormEntry: FormGroup
  isAttendance: FormGroup
  FromAra: FormGroup
  getemployeedate: FormGroup
  movetochekerform: FormGroup
  approverform: FormGroup
  maxDate: Date;
  // isinvoice=false
  // isBrachcerscreen=false
  // isattendance=false
  isAttendanceEntry = false
  Systemgenerationbill = false
  sgprovision: boolean = false
  minimumwages: boolean = false
  onsubmitshow: boolean = false
  idValue: any;
  Displaydate: any

  Displaymonth: any
  Monthlydraft: any = false
  premisesArray = [];
  agencyArray = [];
  isPremisesAddress = false;
  updatelineName1: string;
  updatelineName2: string;
  updatelineName3: string;
  updatecityName: string;
  updatedistrictName: string;
  updatestateName: string;
  updatepinCode: string;
  premisesname: string;


  employeelist = []
  demo = 0;
  SGList: any;
  formSGB = ""

  ShiftV: Shift[] = [
    { id: 1, Shift: 'Shift 1' },
    { id: 2, Shift: 'Shift 2' },
    { id: 3, Shift: 'Shift 3' }
  ];






  //branch screen

  // branch dropdown
  @ViewChild('branchbranchInput') branchbranchInput: any;
  @ViewChild('branchtype') matAutocompletebrachbranch: MatAutocomplete;

  // Premise dropdown
  @ViewChild('branchsiteInput') branchsiteInput: any;
  @ViewChild('producttype') matAutocompletebranchsite: MatAutocomplete;



  ispaymentpage: boolean = true;
  summaryList: any;
  paymentcurrentpage: number = 1;
  paymentpresentpage: number = 1;
  pagesizepayment = 10;
  has_paymentnext = true;
  has_paymentprevious = true;
  premise_Id: number;
  branch_Id: number;

  branchcertList: any
  branchcert: FormGroup
  // isLoading=false
  premiselistt: any
  branchlist_bc: any
  moveToApproverForm: FormGroup;
  ApproverForm: FormGroup;
  rejectForm: FormGroup;
  reviewForm: FormGroup;
  yes = "Yes"
  no = "No"
  isShowHistorySummary = false;
  // count=0
  fromBranch = ""
  bc_statusList: any = [{ id: 3, value: "Approved" }, { id: 0, value: "Rejected" }, { id: 4, value: "Review" },
  { id: 2, value: "Pending Checker" }]


  //branch-view screen

  branchcert_view = [{ id: true, name: "YES" }, { id: false, name: "NO" }]
  branchcertification: FormGroup
  guard_type: Array<any> = [];
  branchList: Array<approvalBranch>;
  leaveunarmed: any;
  sleepingunarmed: any;
  isOvertimeunarmed: any;
  overtimeunarmed: any;
  overtimereasonunarmed: any;
  typeunarmed: any;
  unarmedId: any;
  leave: any;
  sleeping: any;
  isOvertime: any;
  overtime: any;
  overtimereason: any;
  type: any;
  armedId: any;
  branchView: any;
  premise_Name: any;
  branch_Name: any;
  bc_historyData: any;
  branchDetails: any;
  moveToApproverForm_bc: FormGroup;
  ApproverForm_bc: FormGroup;
  rejectForm_bc: FormGroup;
  reviewForm_bc: FormGroup;
  branchCerSingleGet_Id: any;
  isAttendanceAdmin: FormGroup;



  //invoice-summary
  // branch dropdown
  @ViewChild('in_BranchInput') in_BranchInput: any;
  @ViewChild('branchtype') matAutocompletein_branch: MatAutocomplete;

  // Premise dropdown
  @ViewChild('in_PremiseInput') in_PremiseInput: any;
  @ViewChild('premisetype') matAutocompletein_premise: MatAutocomplete;


  InvoiceSearchForm: FormGroup;
  invoiceSearchList: any;
  premiselist_In: any;
  branchlist_In: any
  branchCertifate_Id: any;
  dataentrysite: any;
  invoicemonth: any;
  // nationalhdaysat: any;
  // aguardhdaysat: any;
  // sguardhdaysat: any;
  // aguardhdaysatfri: any;
  // sguardhdaysatfri: any;
  securitypan: any;
  securityagencename: any;
  servicetaxno: any;
  // noofdays: any;
  invoiceno: any;
  invoicedate: any;
  aguarddutiespday: any;
  aguarddutiesmonth: any;
  abillamt: any;
  sbillamt: any;
  unaguarddutiespday: any;
  unaguarddutiesmonth: any;
  totlbillamt: any;
  cgstamt: any;
  sgstamt: any;
  totalgst: any;
  totlamtpayable: any;
  gst_no: any;
  isShowAddInvoice = false;
  branchCertifate_status: any;
  isMaker: any;
  isChecker: any;
  isInvoiceStatus: any;
  isInvoiceStatus_name: any;
  created_By: any;
  createdDate: any;
  approved_By: any;
  approvedDate: any;
  approval_branch: any;
  isInvoicepage: boolean = true;
  invoiceSummaryList: any;
  invoicecurrentpage: number = 1;
  invoicepresentpage: number = 1;
  pagesizeinvoice = 10;
  has_invoicenext = true;
  has_invoiceprevious = true;
  in_statusList: any = [{ id: 3, value: "Approved" }, { id: 0, value: "Rejected" }, { id: 4, value: "Review" },
  { id: 2, value: "Pending Checker" }, { id: 5, value: "Pending Header" }, { id: 6, value: "Rejected in ECF" }]
  IDForApproverUpdate: any


  //invoice-view screen
  invoiceView: FormGroup;
  moveToCheckerForm_in: FormGroup;
  ApproverForm_in: FormGroup;
  rejectForm_in: FormGroup;
  reviewForm_in: FormGroup;
  moveToHeaderForm_in: FormGroup;
  branchCertifate_Id_invce: any;
  getInvoiceData: any;
  employeeList_In: Array<approver>;
  invoiceDate: any;
  invoice_Id: any;
  invoicehistoryData: any;
  view: any;
  fromInvoice = "BC tab"
  fromInvoice1 = "System Bill"
  permission: any;
  fromsystab = ""

  @ViewChild('rejectModalMovetoChecker_in') rejectModalMovetoChecker_in;
  @ViewChild('rejectModalMovetoHeader_in') rejectModalMovetoHeader_in;
  @ViewChild('closebutton_in') closebutton_in;




  constructor(private fb: FormBuilder, private toastr: ToastrService, private datepipe: DatePipe, private route: ActivatedRoute,
    private router: Router, private sgservice: SGService, private shareservice: SGShareService, private SpinnerService: NgxSpinnerService,
    private shareService: SharedService, private notification: NotificationService, private errorHandler: ErrorHandlingService,
    private branchCertSummary: BranchcertSummaryComponent, private invoiceSummary: InvoiceSummaryComponent,
  ) {
    // fontawesome.library.add(faChevronLeft, faChevronRight);
  }


  monthdate = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate.setValue(ctrlValue);
    datepicker.close();
    this.isAttendance.patchValue({
      monthdate: this.monthdate.value
    })
    this.count = 0
  }


  //branch-summary screen
  count_bc = 0;
  monthdate_bc = new FormControl(moment());

  chosenYearHandler_bc(normalizedYear: Moment) {
    const ctrlValue = this.monthdate_bc.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate_bc.setValue(ctrlValue);
  }

  chosenMonthHandler_bc(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate_bc.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate_bc.setValue(ctrlValue);
    datepicker.close();
    this.branchcert.patchValue({
      monthdate_bc: this.monthdate_bc.value
    })
    this.count_bc = 0
  }

  //invoice-summary
  count_In = 0;
  monthdate_In = new FormControl(moment());

  chosenYearHandler_In(normalizedYear: Moment) {
    const ctrlValue = this.monthdate_In.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate_In.setValue(ctrlValue);
  }

  chosenMonthHandler_In(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate_In.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate_In.setValue(ctrlValue);
    datepicker.close();
    this.InvoiceSearchForm.patchValue({
      monthdate_In: this.monthdate_In.value
    })
    this.count_In = 0
  }


  demoval: number = 0

  ngOnInit(): void {
    this.maxDate=new Date();
    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Security Guard") {
        this.SGList = subModule;
        console.log("subModule", this.SGList)
      }
    })

    // this.isattendance=true

    this.getemployeedate = this.fb.group({
      premise_id: [''],
      date: [''],
      branch_id: ['']
    })

    this.isAttendance = this.fb.group({

      monthdate: [''],
      branch_id: [''],
      premise_id: [''],
      agency_id: [''],
      employee: this.fb.array([]),
      date: ['']

    })

    this.FromAra = this.fb.group({
      array: this.fb.array([

      ])
    })

    this.AtttendaceFormEntry = this.fb.group({
      id: [''],
      attendance: [''],
      non_uniform: [''],
      is_sleep: [''],

      is_alcoholic: [''],
      unplanned_leave: [''],
      is_ot: [''],
      ot_hrs: [''],
      shift: ['']
    })

    this.Securityguardpayment = this.fb.group({
      dataentrysite: [''],
      invoicemonth: [''],
      // nationalhdaysat: [''],
      // aguardhdaysat: [''],
      // sguardhdaysat: [''],
      // aguardhdaysatfri: [''],
      // sguardhdaysatfri: [''],
      securitypan: [''],
      securityagencename: [''],
      servicetaxno: [''],
      // noofdays: [''],
      invoiceno: [''],
      invoicedate: [''],
      aguarddutiespday: [''],
      aguarddutiesmonth: [''],
      billamt: [''],
      unaguarddutiespday: [''],
      unaguarddutiesmonth: [''],
      cgstamt: [''],
      sgstamt: [''],
      totalgst: [''],
      totlamtpayable: [''],
      totlbillamt: ['']

    })

    this.movetochekerform = this.fb.group({
      premise_id: [''],
      branch_id: [''],
      month: [''],
      year: [''],
      status: [''],
      remarks: [''],
      // patch1:[''],
      approver: [''],
      approval_branch: [''],

    })

    this.approverform = this.fb.group({
      premise_id: [''],
      branch_id: [''],

      month: [''],
      year: [''],
      status: [''],
      remarks: ['']
    })



    //branch-summary screen
    this.branchcert = this.fb.group({
      monthdate_bc: [''],
      premise_id: [''],
      branch_id: [''],
      status: ['']
    })


    //branch view screen
    this.branchcertification = this.fb.group({
      id: [''],
      monthdate: [''],
      month: [''],
      year: [''],
      premise_id: [''],
      branch_id: [''],
      premise_id1: [''],
      branch_id1: [''],

      is_salary_credited: [''],
      is_esi_esf_remitted: [''],
      is_staisfied: [''],
      // armed 
      is_overtime: [''],
      overtime: [''],
      overtime_reason: [''],
      is_sleeping: [''],
      is_leave: [''],
      is_armedId: [''],
      // unarmed
      is_overtimeunarmed: [''],
      overtimeunarmed: [''],
      overtime_reasonunarmed: [''],
      is_sleepingunarmed: [''],
      is_leaveunarmed: [''],
      is_unarmedId: [''],
      // approval_branch_name: [''],
      approval_branch: [''],
      approver: [''],

    })


    this.moveToApproverForm_bc = this.fb.group({
      remarks: ['']
    })
    this.ApproverForm_bc = this.fb.group({
      remarks: ['']
    })
    this.rejectForm_bc = this.fb.group({
      remarks: ['']
    })
    this.reviewForm_bc = this.fb.group({
      remarks: ['']
    })


    //invoice-summary screen
    this.InvoiceSearchForm = this.fb.group({
      monthdate: [''],
      premise_id: [''],
      branch_id: [''],
      status: ['']
    })


    //invoice-view screen
    this.invoiceView = this.fb.group({
      dataentrysite: [''],
      invoicemonth: [''],
      // nationalhdaysat: [''],

      // aguardhdaysat: [''],
      // sguardhdaysat: [''],
      // aguardhdaysatfri: [''],
      // sguardhdaysatfri: [''],

      securitypan: [''],
      securityagencename: [''],
      // servicetaxno:[''],

      // noofdays: [''],
      invoiceno: [''],
      invoicedate: [''],

      aguarddutiespday: [''],
      aguarddutiesmonth: [''],

      unaguarddutiespday: [''],
      unaguarddutiesmonth: [''],

      gst_no: [''],
      abillamt: [''],
      sbillamt: [''],

      totlbillamt: [''],

      approval_branch_name: [''],
      // approval_branch: [''],
      approver: ['', Validators.required],

      cgstamt: [''],
      sgstamt: [''],
      igstamt: [''],
      totalgst: [''],
      totlamtpayable: [''],

    })

    this.moveToCheckerForm_in = this.fb.group({
      remarks: ['']
    })
    this.moveToHeaderForm_in = this.fb.group({
      remarks: ['']
    })
    this.ApproverForm_in = this.fb.group({
      remarks: ['']
    })
    this.rejectForm_in = this.fb.group({
      remarks: ['']
    })
    this.reviewForm_in = this.fb.group({
      remarks: ['']
    })



    // const routeparam=this.route.snapshot.paramMap;
    // const demo1 = Number(routeparam.get('id'));
    // this.demoval=demo1;


    // if(this.demoval==0)
    // {
    //   this.isinvoice=false
    //   this.isBrachcerscreen=false
    //   this.isattendance=true
    //   this.isAttendanceEntry=false
    //   this.Systemgenerationbill=false
    //   this.Monthlydraft=false
    //   this.minimumwages=false
    //   this.totallist=[]

    // }
    // if(this.demoval==1)
    // {
    //   this.isinvoice=false
    //   this.isBrachcerscreen=true
    //   this.isattendance=false
    //   this.isAttendanceEntry=false
    //   this.Monthlydraft=false
    //   this.Systemgenerationbill=false
    //   this.minimumwages=false
    //   this.branchCertSummary.getSummaryList("")
    // }
    // if(this.demoval==2)
    // {
    //   this.isinvoice=true
    //   this.isBrachcerscreen=false
    //   this.isattendance=false
    //   this.Monthlydraft=false
    //   this.isAttendanceEntry=false
    //   this.Systemgenerationbill=false
    //   this.minimumwages=false
    //   this.invoiceSummary.getInvoiceSummaryList("")
    // }
    // if(this.demoval==3)
    // {
    //   this.isinvoice=false
    //   this.isBrachcerscreen=false
    //   this.isattendance=false
    //   this.Monthlydraft=false
    //   this.isAttendanceEntry=false
    //   this.Systemgenerationbill=true
    //   this.shareservice.key1.next(this.formSGB)
    //   this.minimumwages=false
    //   // this.router.navigate(['/paymentfreeze'],{ skipLocationChange:true})
    // }

  }


  // subModuleData(event: MatTabChangeEvent) {
  //   console.log("data",event)
  //   const tab = event.tab.textLabel;
  //   console.log(tab)
  //   if(tab=="Attendance")
  //   {
  //     this.isinvoice=false
  //     this.isBrachcerscreen=false
  //     this.isattendance=true
  //     this.isAttendanceEntry=false
  //     this.Systemgenerationbill=false
  //     this.minimumwages=false
  //     this.sgprovision=false
  //     this.totallist=[]
  //     this.Monthlydraft=false
  //   this.isAttendance=this.fb.group({

  //     monthdate:[''],
  //     branch_id:[''],
  //     premise_id:[''],
  //     agency_id:[''],   
  //     employee:this.fb.array([]),
  //     date:['']

  //   })
  //     this.data = [
  //       {
  //         "approval_data":{

  //         },
  //           "attendance": {



  //           }, "attendance_count": [

  //         ],

  //           "employee": [

  //           ]
  //       }
  //   ]
  //   this.Date =[]
  //   this.onsubmitshow=false;
  //   }
  //   if(tab=="Branch Certification")
  //   {
  //     this.isinvoice=false
  //     this.isBrachcerscreen=true
  //     this.isattendance=false
  //     this.isAttendanceEntry=false
  //     this.Systemgenerationbill=false
  //     this.minimumwages=false
  //     this.Monthlydraft=false
  //     this.sgprovision=false
  //   }
  //   if(tab=="Invoice Data Entry")
  //   {
  //     this.isinvoice=true
  //     this.isBrachcerscreen=false
  //     this.isattendance=false
  //     this.isAttendanceEntry=false
  //     this.Systemgenerationbill=false
  //     this.minimumwages=false
  //     this.Monthlydraft=false
  //     this.sgprovision=false
  //   }
  //   if(tab=="System Generated Bill")
  //   {
  //     this.isinvoice=false
  //     this.isBrachcerscreen=false
  //     this.isattendance=false
  //     this.isAttendanceEntry=false
  //     this.shareservice.key1.next(this.formSGB)
  //     this.Systemgenerationbill=true
  //     this.minimumwages=false
  //     this.Monthlydraft=false
  //     this.sgprovision=false
  //     // this.router.navigate(['/paymentfreeze'],{ skipLocationChange:true})
  //   }
  //   if(tab=="SG Report")
  //   {
  //     this.isinvoice=false
  //     this.isBrachcerscreen=false
  //     this.isattendance=false
  //     this.isAttendanceEntry=false
  //     this.Systemgenerationbill=false
  //     this.minimumwages=false
  //     this.Monthlydraft=false
  //     this.sgprovision=true
  //     // this.router.navigate(['/paymentfreeze'],{ skipLocationChange:true})
  //   }


  // }


  // // Total number of Whole mouth

  // wholemontharmedguard:number=0;
  // wholemounthsecgusrd:number=0;
  // noofdaysv:number=0;
  // dutyperdayarm:number=0;
  // dutyperdaysg:number=0;


  // Noofday(event)
  // {
  //   this.noofdaysv=parseFloat(event.target.value)

  //   this.wholemounthsecgusrd=this.noofdaysv*this.dutyperdaysg
  //   this.wholemontharmedguard=this.noofdaysv*this.dutyperdayarm
  // }
  // noofdutiesdayarm(event)
  // {
  //   this.dutyperdayarm=parseFloat(event.target.value)
  //   this.wholemontharmedguard=this.noofdaysv*this.dutyperdayarm

  // }
  // noofdutiesdaysg(event)
  // {
  //   this.dutyperdaysg=parseFloat(event.target.value)
  //   this.wholemounthsecgusrd=this.dutyperdaysg*this.noofdaysv

  // }

  // // Total bill amount

  // Totalbillamt:number=0;
  // Sgamount:number=0;
  // Agamount:number=0;

  // billamountofSG(event)
  // {
  //   this.Sgamount=parseFloat(event.target.value)
  //   this.Totalbillamt=this.Sgamount+this.Agamount
  // }

  // billamountofAG(event)
  // {
  //   this.Agamount=parseFloat(event.target.value)
  //   this.Totalbillamt=this.Sgamount+this.Agamount
  // }

  // // GST and Total amount calculation

  // sgst:number=0;
  // cgst:number=0;
  // gst:number=0;

  // alltotalamount:number=0;

  // findcgst(event)
  // {
  //   this.cgst=parseFloat(event.target.value)
  //   this.gst=this.sgst+this.cgst
  //   this.alltotalamount=this.gst+this.Totalbillamt
  // }

  // findsgst(event)
  // {
  //   this.sgst=parseFloat(event.target.value)
  //   this.gst=this.sgst+this.cgst;
  //   this.alltotalamount=this.gst+this.Totalbillamt
  // }



  // onResetclick(){

  //   this.wholemontharmedguard=0;
  //   this.wholemounthsecgusrd=0;
  //   this.noofdaysv=0;
  //   this.dutyperdayarm=0;
  //   this.dutyperdaysg=0;
  //   this.Totalbillamt=0;
  //   this.Sgamount=0;
  //   this.Agamount=0;

  //   this.sgst=0;
  //   this.cgst=0;
  //   this.gst=0;

  //   this.alltotalamount=0;
  //   this.Securityguardpayment.reset();
  // }

  // onSubmitClick(){

  //   this.Securityguardpayment.patchValue({
  //     aguarddutiesmonth:this.wholemontharmedguard,
  //     totalgst: this.gst,
  //     totlamtpayable:this.alltotalamount,
  //     totlbillamt: this.Totalbillamt,
  //     unaguarddutiesmonth:this.wholemounthsecgusrd
  //   })


  //   console.log("onsubmit click",this.Securityguardpayment)
  //   // if (this.idValue == undefined) {
  //   //   this.sgservice.InvoicedataEntry(this.Securityguardpayment.value, '')
  //   //     .subscribe(result => {
  //   //       if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
  //   //         this.notification.showError("Duplicate! [INVALID_DATA! ...]")
  //   //       }
  //   //       else {
  //   //         this.notification.showSuccess("Success")

  //   //       }
  //   //       this.idValue = result.id;
  //   //     })
  //   // } else {
  //   //   this.sgservice.InvoicedataEntry(this.Securityguardpayment.value, this.idValue)
  //   //     .subscribe(result => {
  //   //       if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
  //   //         this.notification.showError("Duplicate! [INVALID_DATA! ...]")
  //   //       }
  //   //       else {
  //   //         this.notification.showSuccess("Success...")

  //   //       }
  //   //     })
  //   //   }


  // }




  urls: string;
  urlAttendance: string;
  urlBranchCertificate: string;
  urlInvoice: string;
  urlSysBill: string;
  urlSGReport: string;
  urladminSG: string;

  isattendance: boolean;
  isBrachcerscreen: boolean;
  isinvoice: boolean;
  isadminsg: boolean;
  monthly_scheduler:boolean=false

  isBranchAddForm: boolean;
  isBranchViewForm: boolean;
  isBC_updateForm: boolean;

  isInvoiceAddForm: boolean;
  isInvoiceViewForm: boolean;
  isIN_updateForm: boolean;
  subModuleData(data) {
    this.urls = data.url;
    this.urlAttendance = "/attendance";
    this.urlBranchCertificate = "/branchcertification";
    this.urlInvoice = "/invoicedataentry";
    this.urladminSG = "/sg_admin";
    this.isattendance = this.urlAttendance === this.urls ? true : false;
    this.isBrachcerscreen = this.urlBranchCertificate === this.urls ? true : false;
    this.isinvoice = this.urlInvoice === this.urls ? true : false;
    this.isadminsg = this.urladminSG === this.urls ? true : false;

    if (this.isattendance) {
      this.isinvoice = false
      this.isInvoiceAddForm = false;
      this.isInvoiceViewForm = false;
      this.isIN_updateForm = false;
      this.isBrachcerscreen = false
      this.isBranchAddForm = false
      this.isBranchViewForm = false
      this.isBC_updateForm = false
      this.isattendance = true
      this.isAttendanceEntry = false
      this.isadminsg = false
      this.monthly_scheduler=false
      this.Systemgenerationbill = false
      this.sgprovision = false
      this.totallist = []
      this.Monthlydraft = false
      this.isAttendance = this.fb.group({

        monthdate: [''],
        branch_id: [''],
        premise_id: [''],
        agency_id: [''],
        employee: this.fb.array([]),
        date: ['']

      })
      this.data = [
        {
          "approval_data": {

          },
          "attendance": {



          }, "attendance_count": [

          ],

          "employee": [

          ]
        }
      ]
      this.Date = []
      this.onsubmitshow = false;
    } else if (this.isBrachcerscreen) {
      this.branchcert = this.fb.group({
        monthdate_bc: [''],
        premise_id: [''],
        branch_id: [''],
        status: ['']
      })
      this.send_value = ""
      this.hasNextSearch_BC_Page = ""
      this.paymentpresentpage = 1
      this.getSummaryList(this.send_value, this.paymentpresentpage);
      this.isBrachcerscreen = true
      this.isBranchAddForm = false
      this.isBranchViewForm = false
      this.isBC_updateForm = false
      this.isinvoice = false
      this.isInvoiceAddForm = false;
      this.isInvoiceViewForm = false;
      this.isIN_updateForm = false;
      this.isattendance = false
      this.isAttendanceEntry = false
      this.Monthlydraft = false
      this.Systemgenerationbill = false
      this.sgprovision = false
      this.isadminsg = false
      this.monthly_scheduler=false

    } else if (this.isinvoice) {
      this.InvoiceSearchForm = this.fb.group({
        monthdate_In: [''],
        premise_id: [''],
        branch_id: [''],
        status: ['']
      })
      this.IN_send_value = ""
      this.hasNextSearch_IN_Page = ""
      this.invoicepresentpage = 1
      this.getInvoiceSummaryList(this.IN_send_value, this.invoicepresentpage);
      this.isinvoice = true
      this.isInvoiceAddForm = false;
      this.isInvoiceViewForm = false;
      this.isIN_updateForm = false;
      this.isBrachcerscreen = false
      this.isBranchAddForm = false
      this.isBranchViewForm = false
      this.isBC_updateForm = false
      this.isattendance = false
      this.isAttendanceEntry = false
      this.Systemgenerationbill = false
      this.Monthlydraft = false
      this.sgprovision = false
      this.isadminsg = false
      this.monthly_scheduler=false
    }
    else if (this.isadminsg) {
      this.isinvoice = false
      this.isInvoiceAddForm = false;
      this.isInvoiceViewForm = false;
      this.isIN_updateForm = false;
      this.isBrachcerscreen = false
      this.isBranchAddForm = false
      this.isBranchViewForm = false
      this.isBC_updateForm = false
      this.isattendance = false
      this.isAttendanceEntry = false
      this.Systemgenerationbill = false
      this.Monthlydraft = false
      this.sgprovision = false
      this.isadminsg = true
      this.monthly_scheduler=false
    }
    else if(data.url==='/sg_scheduler'){
      this.isinvoice = false
      this.isInvoiceAddForm = false;
      this.isInvoiceViewForm = false;
      this.isIN_updateForm = false;
      this.isBrachcerscreen = false
      this.isBranchAddForm = false
      this.isBranchViewForm = false
      this.isBC_updateForm = false
      this.isattendance = false
      this.isAttendanceEntry = false
      this.Systemgenerationbill = false
      this.Monthlydraft = false
      this.sgprovision = false
      this.isadminsg = false
      this.monthly_scheduler=true
    }

  }

  sys() {
    this.isinvoice = false
    this.isInvoiceAddForm = false;
    this.isInvoiceViewForm = false;
    this.isIN_updateForm = false;
    this.isBrachcerscreen = false
    this.isBranchAddForm = false
    this.isBranchViewForm = false
    this.isBC_updateForm = false
    this.isattendance = false
    this.isAttendanceEntry = false
    this.Systemgenerationbill = true
    this.shareservice.key1.next(this.fromsystab)
    this.Monthlydraft = false
    this.sgprovision = false
    this.isadminsg = false
    this.monthly_scheduler=false
  }
  sg_report() {
    this.isinvoice = false
    this.isInvoiceAddForm = false;
    this.isInvoiceViewForm = false;
    this.isIN_updateForm = false;
    this.isBrachcerscreen = false
    this.isBranchAddForm = false
    this.isBranchViewForm = false
    this.isBC_updateForm = false
    this.isattendance = false
    this.isAttendanceEntry = false
    this.Systemgenerationbill = false
    this.Monthlydraft = false
    this.sgprovision = true
    this.isadminsg = false
    this.monthly_scheduler=false
  }

  //branch
  branchAddCancel() {
    this.isBranchAddForm = false;
    this.isBrachcerscreen = true;
    this.isBranchViewForm = false;
    this.isBC_updateForm = false
  }

  branchAddSubmit() {
    this.isBranchAddForm = false;
    this.isBrachcerscreen = true;
    this.getSummaryList(this.send_value, this.paymentpresentpage);
    this.isBranchViewForm = false;
    this.isBC_updateForm = false
  }

  BC_updateAddCancel() {
    this.isBC_updateForm = false;
    this.isBranchAddForm = false;
    this.isBrachcerscreen = false;
    this.isBranchViewForm = true;
  }

  BC_updateAddSubmit() {
    this.isBranchAddForm = false;
    this.isBrachcerscreen = false;
    this.isBranchViewForm = true;
    this.isBC_updateForm = false;
    this.getbranchView();
  }


  //invoice
  invoiceAddCancel() {
    this.isInvoiceAddForm = false;
    this.isinvoice = true;
    this.isInvoiceViewForm = false;
    this.isIN_updateForm = false;
  }

  invoiceAddSubmit() {
    this.isInvoiceAddForm = false;
    this.isinvoice = true;
    this.isInvoiceViewForm = false;
    this.isIN_updateForm = false;
    this.getInvoiceSummaryList(this.IN_send_value, this.invoicepresentpage)
  }


  IN_updateAddCancel() {
    this.isInvoiceAddForm = false;
    this.isinvoice = false;
    this.isInvoiceViewForm = true;
    this.isIN_updateForm = false;
  }

  IN_updateAddSubmit() {
    this.isInvoiceAddForm = false;
    this.isinvoice = false;
    this.isInvoiceViewForm = true;
    this.isIN_updateForm = false;
    this.invoiceUpdate();
  }
  //sys bill -back
  sysCancel() {
    this.isInvoiceAddForm = false;
    this.isinvoice = false;
    this.isInvoiceViewForm = true;
    this.isIN_updateForm = false;
    this.Systemgenerationbill = false;
    this.invoiceUpdate();

  }








  // branch screen- summary

  // summary List
  getSummaryList(val,
    pageNumber = 1) {
    this.SpinnerService.show()
    this.sgservice.getSummaryDetails(val, pageNumber)
      .subscribe((results: any[]) => {
        console.log("branchlist", results)
        let datas = results["data"];
        this.summaryList = datas;
        this.SpinnerService.hide()
        let datapagination = results["pagination"];
        this.summaryList = datas;
        if (this.summaryList.length === 0) {
          this.ispaymentpage = false
        }
        if (this.summaryList.length > 0) {
          this.has_paymentnext = datapagination.has_next;
          this.has_paymentprevious = datapagination.has_previous;
          this.paymentpresentpage = datapagination.index;
          this.ispaymentpage = true
        }
        this.send_value = ""
      })
  }

  nextClickPayment() {
    if (this.has_paymentnext === true) {
      this.getSummaryList(this.hasNextSearch_BC_Page, this.paymentpresentpage + 1)
    }
  }

  previousClickPayment() {
    if (this.has_paymentprevious === true) {
      this.getSummaryList(this.hasNextSearch_BC_Page, this.paymentpresentpage - 1)
    }


  }

  send_value: String = ""
  hasNextSearch_BC_Page: any = ""
  getbranchSearch() {
    let form_value = this.branchcert.value;

    if (form_value.branch_id != "") {
      this.send_value = this.send_value + "&branch_id=" + form_value.branch_id.id
    }
    if (form_value.premise_id != "") {
      this.send_value = this.send_value + "&premise_id=" + form_value.premise_id.id
    }
    if (form_value.monthdate_bc != "") {
      let month = this.datepipe.transform(form_value.monthdate_bc, "M");
      let year = this.datepipe.transform(form_value.monthdate_bc, "yyyy")
      this.send_value = this.send_value + "&month=" + month + "&year=" + year
    }
    if (form_value.status != "") {
      this.send_value = this.send_value + "&status=" + form_value.status
    }
    if (form_value.status == '0') {
      this.send_value = this.send_value + "&status=" + form_value.status
    }
    this.hasNextSearch_BC_Page = this.send_value
    this.paymentpresentpage = 1;
    this.getSummaryList(this.send_value, this.paymentpresentpage)

  }


  reset() {
    this.send_value = ""
    this.hasNextSearch_BC_Page = ""
    this.branchcert = this.fb.group({
      monthdate_bc: [''],
      premise_id: [''],
      branch_id: [''],
      status: ['']
    })
    this.paymentpresentpage = 1;
    this.getSummaryList(this.send_value, this.paymentpresentpage);
    this.getbranchid();
    this.getpremiseid();
  }


  mothfind(month, year) {
    return new Date(year, month - 1)
    // return this.datepipe.transform(obj, 'dd-MMM-yyyy h:mm')
  }



  addBranchcertification() {
    // this.router.navigate(['SGmodule/branch'], { skipLocationChange: true })
    this.isBranchAddForm = true;
    this.isBrachcerscreen = false;
    this.isBranchViewForm = false;
  }

  summaryView(data) {
    this.shareservice.branchData.next(data)
    this.shareservice.key.next(this.fromBranch)
    this.isBranchAddForm = false;
    this.isBrachcerscreen = false;
    this.isBranchViewForm = true;
    this.getbranchView();
    // this.router.navigate(['SGmodule/branchview'], { skipLocationChange: true })
  }
  branchname() {
    // let prokeyvalue: String = "";
    //   this.getbranchid(prokeyvalue);
    //   this.branchcert.get('branch_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //       }),
    //       switchMap(value => this.sgservice.getbranchdropdown(value,1)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.branchlist_bc = datas;
    //       console.log("branch", datas)

    //     })
    let a = this.branchbranchInput.nativeElement.value
    this.sgservice.getbranchdropdown(a, 1)
      //  .subscribe(x =>{
      //    console.log("dd value data", x)
      //  })
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist_bc = datas;
      })


  }
  getbranchid() {
    this.sgservice.getbranchdropdown("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist_bc = datas;

      })
  }

  public displaydiss2(branchtype?: branchList): string | undefined {
    return branchtype ? "(" + branchtype.code + " )" + branchtype.name : undefined;

  }
  premisename() {
    // let prokeyvalue: String = "";
    //   this.getpremiseid(prokeyvalue);
    //   this.branchcert.get('premise_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //       }),
    //       switchMap(value => this.sgservice.getpremisedropdown(value,1)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.premiselistt = datas;
    //       console.log("product", datas)

    //     })
    let a = this.branchsiteInput.nativeElement.value
    this.sgservice.getpremisedropdown(a, 1)
      //  .subscribe(x =>{
      //    console.log("dd value data", x)
      //  })
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiselistt = datas;

      })



  }
  getpremiseid() {
    this.sgservice.getpremisedropdown("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiselistt = datas;

      })
  }

  public displaydiss1(producttype?: premiseList): string | undefined {
    return producttype ? "(" + producttype.code + " )" + producttype.name : undefined;

  }


  // Branch  dropdown

  currentpagebra_bc: any = 1
  has_nextbra_bc: boolean = true
  has_previousbra_bc: boolean = true
  autocompleteBranchBranchScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletebrachbranch &&
        this.autocompleteTrigger &&
        this.matAutocompletebrachbranch.panel
      ) {
        fromEvent(this.matAutocompletebrachbranch.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrachbranch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrachbranch.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrachbranch.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrachbranch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra_bc === true) {
                this.sgservice.getbranchdropdown(this.branchbranchInput.nativeElement.value, this.currentpagebra_bc + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchlist_bc = this.branchlist_bc.concat(datas);
                    if (this.branchlist_bc.length >= 0) {
                      this.has_nextbra_bc = datapagination.has_next;
                      this.has_previousbra_bc = datapagination.has_previous;
                      this.currentpagebra_bc = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // Premies dropdown
  currentpagepre_bc: any = 1
  has_nextpre_bc: boolean = true
  has_previouspre_bc: boolean = true
  autocompleteBranchSiteScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletebranchsite &&
        this.autocompleteTrigger &&
        this.matAutocompletebranchsite.panel
      ) {
        fromEvent(this.matAutocompletebranchsite.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebranchsite.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebranchsite.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebranchsite.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebranchsite.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpre_bc === true) {
                this.sgservice.getpremisedropdown(this.branchsiteInput.nativeElement.value, this.currentpagepre_bc + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.premiselistt = this.premiselistt.concat(datas);
                    if (this.premiselistt.length >= 0) {
                      this.has_nextpre_bc = datapagination.has_next;
                      this.has_previouspre_bc = datapagination.has_previous;
                      this.currentpagepre_bc = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }










  // branch-view screen
  getbranchView() {
    let data = this.shareservice.branchData.value
    this.branchDetails = data
    this.branchCerSingleGet_Id = this.branchDetails?.id
    console.log("branchdetails", data)
    this.premise_Name = "(" + data.premise.code + ") " + data.premise.name
    this.branch_Name = "(" + data.branch.code + ") " + data.branch.name
    this.sgservice.getbranchView(this.branchDetails)
      .subscribe((result) => {
        let datas = result['data'];
        this.branchView = datas[0]
        console.log("branchView", this.branchView)
        this.getBranchEditForm(this.branchView);
        this.bc_approvalFlow();
      })

  }

  // patchvalue
  getBranchEditForm(branchView) {
    let data = branchView;
    let mon_year = data.month + '-' + data.year
    console.log("mon_year", mon_year)

    for (let i = 0; i < data.guard_type.length; i++) {
      // unarmed
      this.leaveunarmed = data.guard_type[0].is_leave
      this.sleepingunarmed = data.guard_type[0].is_sleeping
      this.isOvertimeunarmed = data.guard_type[0].is_overtime
      this.overtimeunarmed = data.guard_type[0].overtime
      this.overtimereasonunarmed = data.guard_type[0].overtime_reason
      this.typeunarmed = data.guard_type[0].type.name
      this.unarmedId = data.guard_type[0].id
      // armed
      this.leave = data.guard_type[1].is_leave
      this.sleeping = data.guard_type[1].is_sleeping
      this.isOvertime = data.guard_type[1].is_overtime
      this.overtime = data.guard_type[1].overtime
      this.overtimereason = data.guard_type[1].overtime_reason
      this.type = data.guard_type[1].type.name
      this.armedId = data.guard_type[1].id

    }

    this.branchcertification.patchValue({
      premise_id: this.premise_Name,
      branch_id: this.branch_Name,
      monthdate: mon_year,
      is_salary_credited: data.is_salary_credited,
      is_esi_esf_remitted: data.is_esi_esf_remitted,
      is_staisfied: data.is_staisfied,
      approval_branch: '(' + data.approver.branch_code + ') ' + data.approver.branch_name,
      // approval_branch: data.approval_branch.id,
      approver: data.approver.name,

      // unarmed
      is_overtimeunarmed: this.isOvertimeunarmed,
      overtimeunarmed: this.overtimeunarmed,
      overtime_reasonunarmed: this.overtimereasonunarmed,
      is_sleepingunarmed: this.sleepingunarmed,
      is_leaveunarmed: this.leaveunarmed,
      is_unarmedId: this.unarmedId,
      // armed 
      is_overtime: this.isOvertime,
      overtime: this.overtime,
      overtime_reason: this.overtimereason,
      is_sleeping: this.sleeping,
      is_leave: this.leave,
      is_armedId: this.armedId,

    })
  }


  //approval Flow summary

  bc_approvalFlow() {
    let branchGet_id = this.branchView?.id
    this.sgservice.getIdentificationHistory(branchGet_id)
      .subscribe(result => {
        console.log("bc_approvalFlow", result)
        this.bc_historyData = result.data;
      })
  }

  //update Button 
  updateButton_bc() {
    this.shareservice.brachEditValue.next(this.branchView);
    this.shareservice.premisesName.next(this.premise_Name);
    this.shareservice.brachName.next(this.branch_Name);
    // this.router.navigate(['SGmodule/branchcertifyedit'], { skipLocationChange: true })
    this.isBranchAddForm = false;
    this.isBrachcerscreen = false;
    this.isBranchViewForm = false;
    this.isBC_updateForm = true;
  }


  backTobranchSummary() {
    if (this.shareservice.key.value == "BC tab") {
      // this.router.navigate(['SGmodule/invoiceView'], { skipLocationChange: true })
      this.isInvoiceViewForm = true;
      this.isBranchViewForm = false;
      this.invoiceUpdate();
    } else {
      // this.router.navigate(['SGmodule/securityguardpayment',1], { skipLocationChange: true })
      // this.onCancel.emit()
      this.isBranchAddForm = false;
      this.isBrachcerscreen = true;
      this.isBranchViewForm = false;
      this.isBC_updateForm = false;
      this.getSummaryList(this.send_value, this.paymentpresentpage);
    }

  }





  // submit to checker button 
  year: any;
  month: any;
  branchId: any;
  moveToApproverPopupForm_bc() {
    let json = {
      "status": 2,
    }
    this.sgservice.movetoApprover(this.moveToApproverForm_bc.value, this.branchCerSingleGet_Id, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Approver!...")
          this.getbranchView();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }

  // approver button 
  ApproverPopupForm_bc() {

    let json = {
      "status": 3,
    }
    this.sgservice.approver(this.ApproverForm_bc.value, this.branchCerSingleGet_Id, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Approved Successfully!...")
          this.getbranchView();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }

  // reject button 
  rejectPopupForm_bc() {

    let json = {
      "status": 0,

    }
    this.sgservice.reject(this.rejectForm_bc.value, this.branchCerSingleGet_Id, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Rejected!...")
          this.getbranchView();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }


  // reject button 
  reviewPopupForm_bc() {


    let json = {
      "status": 4,

    }
    this.sgservice.review(this.reviewForm_bc.value, this.branchCerSingleGet_Id, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("updated!...")
          this.getbranchView();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }





  //invoice-summary
  // invoice summary List
  getInvoiceSummaryList(IN_val,
    pageNumber = 1) {
    this.SpinnerService.show()
    this.sgservice.getInvoiceSummaryList(IN_val, pageNumber)
      .subscribe((results: any[]) => {
        console.log("invoicelist", results)
        let datas = results["data"];
        this.invoiceSummaryList = datas;
        this.SpinnerService.hide()
        let datapagination = results["pagination"];
        this.invoiceSummaryList = datas;
        if (this.invoiceSummaryList.length === 0) {
          this.isInvoicepage = false
        }
        if (this.invoiceSummaryList.length > 0) {
          this.has_invoicenext = datapagination.has_next;
          this.has_invoiceprevious = datapagination.has_previous;
          this.invoicepresentpage = datapagination.index;
          this.isInvoicepage = true
        }
        this.IN_send_value = ""
      })
  }

  nextClickInvoice() {
    if (this.has_invoicenext === true) {
      this.getInvoiceSummaryList(this.hasNextSearch_IN_Page, this.invoicepresentpage + 1)
    }
  }

  previousClickInvoice() {
    if (this.has_invoiceprevious === true) {
      this.getInvoiceSummaryList(this.hasNextSearch_IN_Page, this.invoicepresentpage - 1)
    }


  }



  // invoice search
  IN_send_value: String = ""
  hasNextSearch_IN_Page: any = ""
  getInvoiceSearch() {
    let form_value = this.InvoiceSearchForm.value;

    if (form_value.branch_id != "") {
      this.IN_send_value = this.IN_send_value + "&branch_id=" + form_value.branch_id.id
    }
    if (form_value.premise_id != "") {
      this.IN_send_value = this.IN_send_value + "&premise_id=" + form_value.premise_id.id
    }
    if (form_value.monthdate_In != "") {
      let month = this.datepipe.transform(form_value.monthdate_In, "M");
      let year = this.datepipe.transform(form_value.monthdate_In, "yyyy")
      this.IN_send_value = this.IN_send_value + "&month=" + month + "&year=" + year
    }
    if (form_value.status != "") {
      this.IN_send_value = this.IN_send_value + "&status=" + form_value.status
    }
    if (form_value.status == '0') {
      this.IN_send_value = this.IN_send_value + "&status=" + form_value.status
    }
    this.hasNextSearch_IN_Page = this.IN_send_value
    this.invoicepresentpage = 1;
    this.getInvoiceSummaryList(this.IN_send_value, this.invoicepresentpage)

  }



  IN_reset() {
    this.IN_send_value = ""
    this.hasNextSearch_IN_Page = ""
    this.InvoiceSearchForm = this.fb.group({
      monthdate_In: [''],
      premise_id: [''],
      branch_id: [''],
      status: ['']
    })
    this.invoicepresentpage = 1
    this.getInvoiceSummaryList(this.IN_send_value, this.invoicepresentpage);
    this.getbranch_Invoice();
    this.getpremise_Invoice();

  }

  invoiceSummaryView(data) {
    this.shareservice.invoiceSummaryDetails.next(data)
    this.isInvoiceAddForm = false;
    this.isinvoice = false;
    this.isInvoiceViewForm = true;
    this.invoiceUpdate();
    // this.router.navigate(['SGmodule/invoiceView'], { skipLocationChange: true })
  }


  mothfind_IN(month, year) {
    return new Date(year, month - 1)
    // return this.datepipe.transform(obj, 'dd-MMM-yyyy h:mm')
  }




  //premise drop down

  premise_Invoice() {
    // let prokeyvalue: String = "";
    // this.getpremise_Invoice(prokeyvalue);
    // this.InvoiceSearchForm.get('premise_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.sgservice.getpremisedropdown(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.premiselist_In = datas;
    //   })
    let a = this.in_PremiseInput.nativeElement.value
    this.sgservice.getpremisedropdown(a, 1)
      //  .subscribe(x =>{
      //    console.log("dd value data", x)
      //  })
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiselist_In = datas;
      })


  }
  getpremise_Invoice() {
    this.sgservice.getpremisedropdown("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiselist_In = datas;
      })
  }

  public display_premise_In(premisetype?: premiseList): string | undefined {
    return premisetype ? "(" + premisetype.code + " )" + premisetype.name : undefined;
  }

  get premisetype() {
    return this.InvoiceSearchForm.value.get('premise_id');
  }

  // branch drop down
  branch_Invoice() {
    let prokeyvalue: String = "";
    // this.getbranch_Invoice(prokeyvalue);
    // this.InvoiceSearchForm.get('branch_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.sgservice.getbranchdropdown(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.branchlist_In = datas;
    //     console.log("branch", datas)

    //   })
    //  console.log("branch value changess check1", this.in_BranchInput)

    //  console.log("branch value changess check2", this.in_BranchInput.nativeElement)


    console.log("branch value changess check3", this.in_BranchInput.nativeElement.value)
    let a = this.in_BranchInput.nativeElement.value
    this.sgservice.getbranchdropdown(a, 1)
      //  .subscribe(x =>{
      //    console.log("dd value data", x)
      //  })
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist_In = datas;
        console.log("branch", datas)

      })
  }

  getbranch_Invoice() {
    this.sgservice.getbranchdropdown("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist_In = datas;

      })
  }

  public display_branch_In(branchtype?: branchList): string | undefined {
    return branchtype ? "(" + branchtype.code + " )" + branchtype.name : undefined;
  }

  get branchtype() {
    return this.InvoiceSearchForm.value.get('branch_id');
  }


  AddInvoice() {
    // this.router.navigate(['SGmodule/addInvoice'], { skipLocationChange: true })
    this.isInvoiceAddForm = true;
    this.isinvoice = false;
    this.isInvoiceViewForm = false;
  }

  // Branch  dropdown

  currentpagebra_In: any = 1
  has_nextbra_In: boolean = true
  has_previousbra_In: boolean = true
  branch_InvoiceScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletein_branch &&
        this.autocompleteTrigger &&
        this.matAutocompletein_branch.panel
      ) {
        fromEvent(this.matAutocompletein_branch.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletein_branch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletein_branch.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletein_branch.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletein_branch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra_In === true) {
                this.sgservice.getbranchdropdown(this.in_BranchInput.nativeElement.value, this.currentpagebra_In + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchlist_In = this.branchlist_In.concat(datas);
                    if (this.branchlist_In.length >= 0) {
                      this.has_nextbra_In = datapagination.has_next;
                      this.has_previousbra_In = datapagination.has_previous;
                      this.currentpagebra_In = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // Premies dropdown
  currentpagepre_In: any = 1
  has_nextpre_In: boolean = true
  has_previouspre_In: boolean = true
  premise_InvoiceScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletein_premise &&
        this.autocompleteTrigger &&
        this.matAutocompletein_premise.panel
      ) {
        fromEvent(this.matAutocompletein_premise.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletein_premise.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletein_premise.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletein_premise.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletein_premise.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpre_In === true) {
                this.sgservice.getpremisedropdown(this.in_PremiseInput.nativeElement.value, this.currentpagepre_In + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.premiselist_In = this.premiselist_In.concat(datas);
                    if (this.premiselist_In.length >= 0) {
                      this.has_nextpre_In = datapagination.has_next;
                      this.has_previouspre_In = datapagination.has_previous;
                      this.currentpagepre_In = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }








  //invoice-view screen
  monthly_draft_get_api_list: any
  igstptach: any;

  invoiceUpdate() {
    let data = this.shareservice.invoiceSummaryDetails.value;
    
    console.log("invoiceSummaryDetails", data)
    this.monthly_draft_get_api_list = data
    this.view = data;
    this.branchCertifate_Id_invce = data.branchcertification_id

    this.sgservice.getInvoiceData(this.branchCertifate_Id_invce, data.id)
      .subscribe(result => {
        console.log("getInvoiceData", result)
        let datas = result.data;
        this.getInvoiceData = datas[0]
        let data = this.getInvoiceData
        this.permission = data.isheader
        let Date = data.invoicedate
        if (data.igstamt != null) {
          this.igstptach = data.igstamt.toLocaleString()
        }
        this.invoiceDate = this.datepipe.transform(Date, 'yyyy-MM-dd')
        this.invoiceView.patchValue({
          dataentrysite: data.dataentrysite,
          invoicemonth: data.invoicemonth,
          // nationalhdaysat: data.nationalhdaysat,
          // aguardhdaysat: data.aguardhdaysat,
          // sguardhdaysat: data.sguardhdaysat,
          // aguardhdaysatfri: data.aguardhdaysatfri,
          // sguardhdaysatfri: data.sguardhdaysatfri,
          securitypan: data.securitypan,
          securityagencename: data.securityagencename,
          // servicetaxno: data.servicetaxno,
          gst_no: data.gst_no,
          // noofdays: data.noofdays,
          invoiceno: data.invoiceno,
          invoicedate: this.invoiceDate,
          aguarddutiespday: data.aguarddutiespday,
          aguarddutiesmonth: data.aguarddutiesmonth,
          abillamt: data.abillamt.toLocaleString(),
          sbillamt: data.sbillamt.toLocaleString(),
          unaguarddutiespday: data.unaguarddutiespday,
          unaguarddutiesmonth: data.unaguarddutiesmonth,
          totlbillamt: data.totlbillamt.toLocaleString(),
          cgstamt: data.cgstamt.toLocaleString(),
          sgstamt: data.sgstamt.toLocaleString(),
          igstamt: this.igstptach,
          totalgst: data.totalgst.toLocaleString(),
          totlamtpayable: data.totlamtpayable.toLocaleString(),
          approval_branch_name: data.approver.branch_code + '-' + data.approver.branch_name,
          // approval_branch: data.approver.id,
          approver: data.approver,
        })
        this.maxDate=this.maxDate;
        console.log("max_",this.maxDate);
        this.invoiceapprovalFlow();
      })
  }


  backToInvoiceSummary() {
    // this.router.navigate(['SGmodule/securityguardpayment',2], { skipLocationChange: true })
    this.isInvoiceAddForm = false;
    this.isinvoice = true;
    this.isInvoiceViewForm = false;
    this.isIN_updateForm = false;
    this.getInvoiceSummaryList(this.IN_send_value, this.invoicepresentpage)
  }

  branchViewScreen() {
    this.shareservice.branchData.next(this.view)
    this.shareservice.key.next(this.fromInvoice)
    // this.router.navigate(['SGmodule/branchview'], { skipLocationChange: true })
    this.isInvoiceAddForm = false;
    this.isinvoice = false;
    this.isInvoiceViewForm = false;
    this.isIN_updateForm = false;
    this.isBranchAddForm = false;
    this.isBrachcerscreen = false;
    this.isBranchViewForm = true;
    this.isBC_updateForm = false;
    this.Systemgenerationbill = false;
    this.getbranchView();

  }

  systemGenerateBillScreen() {
    this.shareservice.searchdata.next(this.view)
    this.shareservice.key1.next(this.fromInvoice1)
    this.shareservice.agencyname.next(this.getInvoiceData)
    // this.router.navigate(['SGmodule/paymentfreeze'], { skipLocationChange: true })
    this.Systemgenerationbill = true;
    this.isInvoiceAddForm = false;
    this.isinvoice = false;
    this.isInvoiceViewForm = false;
    this.isIN_updateForm = false;
    this.isBranchAddForm = false;
    this.isBrachcerscreen = false;
    this.isBranchViewForm = false;
    this.isBC_updateForm = false;
  }

  // invoice update 
  updateButton_in() {
    this.shareservice.invoiceEditValue.next(this.getInvoiceData);
    this.shareservice.branchCertifateId.next(this.branchCertifate_Id_invce)
    this.isInvoiceAddForm = false;
    this.isinvoice = false;
    this.isInvoiceViewForm = false;
    this.isIN_updateForm = true;
    this.isBranchAddForm = false;
    this.isBrachcerscreen = false;
    this.isBranchViewForm = false;
    this.isBC_updateForm = false;
    this.Systemgenerationbill = false;
    // this.router.navigate(['SGmodule/invoiceUpdate'], { skipLocationChange: true })
  }


  // submit to checker button 

  moveToCheckerPopupForm_in() {
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "status": 2,
      "invoice_id": invoiceGet_id,
    }

    this.sgservice.movetoCheckerInvoice(this.moveToCheckerForm_in.value, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Checker!...")
          this.invoiceUpdate();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }


  // submit to header button 

  moveToHeaderPopupForm_in() {
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "status": 5,
      "invoice_id": invoiceGet_id,
    }
    this.sgservice.movetoHeaderInvoice(this.moveToHeaderForm_in.value, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Header!...")
          this.invoiceUpdate();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }

  // approver button 
  ApproverPopupForm_in() {
    this.SpinnerService.show()
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "status": 3,
      "invoice_id": invoiceGet_id,
    }
    this.sgservice.approverInvoice(this.ApproverForm_in.value, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Approved Successfully!...")
          this.closebutton_in.nativeElement.click();
          // this.invoiceUpdate();
          this.ToECF();
          // this.SpinnerService.hide()
        } else {
          this.notification.showError(res.description)
          this.SpinnerService.hide()
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )

  }

  // reject button 
  rejectPopupForm_in() {
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "status": 0,
      "invoice_id": invoiceGet_id,
    }
    this.sgservice.rejectInvoice(this.rejectForm_in.value, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Rejected!...")
          this.invoiceUpdate();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }


  // reject button 
  reviewPopupForm_in() {
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "status": 4,
      "invoice_id": invoiceGet_id,
    }
    this.sgservice.reviewInvoice(this.reviewForm_in.value, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("updated!...")
          this.invoiceUpdate();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }

  //delete invoice
  getDeleteInvoice_in() {
    let invoiceGet_id = this.getInvoiceData?.id
    this.sgservice.getDeleteInvoice(invoiceGet_id)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Deleted!...")
          this.invoiceUpdate();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }


  //invoice approval Flow 

  invoiceapprovalFlow() {
    let invoiceGet_id = this.getInvoiceData?.id
    this.sgservice.invoiceapprovalFlow(invoiceGet_id)
      .subscribe(result => {
        console.log("invoiceapprovalFlow", result)
        this.invoicehistoryData = result.data;
      })
  }


  // to ECF Push 
  Talbillamount: any
  daatot: any
  ToECF() {
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "invoice_id": invoiceGet_id,
    }
    this.SpinnerService.show()

    this.sgservice.ToECFPush(json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to ECF!...")
          this.invoiceUpdate();
          this.SpinnerService.hide();
        } else {
          this.notification.showError(res.description)
          this.invoiceUpdate();
          this.SpinnerService.hide();
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.invoiceUpdate()
          this.SpinnerService.hide();
        }
      )

  }


  coverNotedownload_in() {
    this.sgservice.coverNotedownload(this.getInvoiceData?.id)
      .subscribe((results) => {
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Covernote.pdf";
        link.click();
      })
  }


  jpgUrls: string;
  fileextension: any;
  showPopupImages: boolean = true
  imageUrl = environment.apiURL
  docFileView_in(id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.fileextension === "pdf") {
      this.showPopupImages = false
      window.open(this.imageUrl + "sgserv/sg_document/" + id + "?token=" + token, "_blank");
    }
    else if (this.fileextension === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
      // this.showPopupImages = true
      // this.jpgUrls = this.imageUrl + "sgserv/sg_document/" + id + "?token=" + token;
      // console.log("url", this.jpgUrls)
      this.showPopupImages = false
      window.open(this.imageUrl + "sgserv/sg_document/" + id + "?token=" + token, "_blank");
    }
    else {
      // this.fileDownload(id, file_name)
      // this.showPopupImages = false
      this.showPopupImages = false
      window.open(this.imageUrl + "sgserv/sg_document/" + id + "?token=" + token, "_blank");
    }
  }

  fileDownload(id, fileName) {
    this.sgservice.fileDownload(id)
      .subscribe((results) => {
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }




  //approver drop down
  In_approvername() {
    let approverkeyvalue: String = "";
    // this.getIn_approvername(approverkeyvalue);

    this.invoiceView.get('approver').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.sgservice.getEmployeeFilter(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList_In = datas;

      })

  }

  private getIn_approvername(approverkeyvalue) {
    this.sgservice.getEmployeeFilter(approverkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList_In = datas;
      })
  }

  public displayFnEmployee_In(employee?: approver_IN): string | undefined {
    return employee ? employee.name : undefined;
  }

  get employee() {
    return this.invoiceView.value.get('approver');
  }




































































  keyPressNumbers(event) {
    console.log(event.which)
    var charCode = (event.which) ? event.which : event.keyCode;
    console.log(event.keycode)
    // Only Numbers 0-9
    if (event.keyCode == 32) {
      return true;
    }
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      this.toastr.warning('', 'Please Enter the Number only', { timeOut: 1500 });
      return false;
    } else {
      return true;
    }
  }
  keyPressAlpha(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp) || event.keyCode == 32) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Please Enter the Letter only', { timeOut: 1500 });
      return false;

    }
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp) || event.keyCode == 32) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });
      return false;

    }
  }


  // Attendance


  Date: any = []


  data: any = [
    {
      "approval_data": {

      },
      "attendance": {



      }, "attendance_count": [

      ],

      "employee": [

      ]
    }
  ]

  click() {
    let result = [];
    let keys = Object.keys(this.data[0].attendance)
    for (let i = 0; i < keys.length; i++) {

      result.push(Object.keys(this.data[0].attendance)[i])
    }


    return result;
  }

  savedisable = false

  finddateisthere(Date1) {
    let result = [];
    let keys = Object.keys(this.data[0].attendance)
    for (let i = 0; i < keys.length; i++) {

      result.push(Object.keys(this.data[0].attendance)[i])
    }


    if (result.indexOf(Date1) == -1) {

      return false
    }
    else {

      return true
    }

  }

  find1() {

    return undefined
  }


  checktotalpresent(emp_id) {
    let datelenth = this.Date.length;
    let key = this.data[0]?.attendance;
    // console.log("console",key)
    if (Object.keys(key).length == 0) {
      return true;
    }

    let count = 0, mem_present_Count = 0;

    for (let i = 0; i < datelenth; i++) {
      let val = this.Date[i];
      let obj = this.data[0].attendance[val]
      // console.log("obj data",obj)
      // console.log("object value",Object.values(emp_id))
      let is_valid = false

      for (let k = 0; k < obj?.length; k++) {
        if (obj[k]?.emp_id == emp_id) {
          mem_present_Count++
        }
      }

      for (let j = 0; j < obj?.length; j++) {
        if (obj[j]?.emp_id == emp_id) {
          if (obj[j]?.atd == false || obj[j]?.atd == true) {
            is_valid = true
          }
          // if(obj[j]?.atd == undefined )
          // {
          //   return true;
          // }
        }
      }
      if (is_valid == true) {
        count++
      }

    }

    if (count == datelenth) {
      return false
    }
    else if (mem_present_Count == 0) {
      return true
    }
    else {
      return true
    }

  }

  total_present_validater(employee_Array) {
    for (let i = 0; i < employee_Array?.length; i++) {
      if (this.checktotalpresent(employee_Array[i]?.id) == true) {
        return true
      }
    }
    return false;
  }


  find(val, emp_id) {
    let obj = this.data[0].attendance[val]


    for (let i = 0; i < obj?.length; i++) {
      if (obj[i].emp_id == emp_id) {

        return obj[i]?.atd;
      }
    }

    return undefined
  }


  algol(val, emp_id) {
    let obj = this.data[0].attendance[val]


    for (let i = 0; i < obj.length; i++) {
      if (obj[i].emp_id == emp_id) {
        if (obj[i]?.alco == true) {
          return true;
        }
        else if (obj[i]?.alco == false) {
          return false;
        }
        else if (obj?.alco == undefined) {
          return undefined;
        }

      }
    }

  }

  sleep(val, emp_id) {
    let obj = this.data[0].attendance[val]


    for (let i = 0; i < obj.length; i++) {
      if (obj[i].emp_id == emp_id) {
        if (obj[i]?.sleep == true) {
          return true;
        }
        else if (obj[i]?.sleep == false) {
          return false;
        }
        else if (obj?.sleep == undefined) {
          return undefined;
        }

      }
    }

  }

  uniform(val, emp_id) {
    let obj = this.data[0].attendance[val]


    for (let i = 0; i < obj.length; i++) {
      if (obj[i].emp_id == emp_id) {
        if (obj[i]?.unif == true) {
          return true;
        }
        else if (obj[i]?.unif == false) {
          return false;
        }
        else if (obj?.unif == undefined) {
          return undefined;
        }

      }
    }

  }

  unplanedleave(val, emp_id) {
    let obj = this.data[0].attendance[val]


    for (let i = 0; i < obj.length; i++) {
      if (obj[i].emp_id == emp_id) {
        if (obj[i]?.unpl == true) {
          return true;
        }
        else if (obj[i]?.unpl == false) {
          return false;
        }
        else if (obj?.unpl == undefined) {
          return undefined;
        }

      }
    }

  }

  // Shift(val,emp_id)
  // {
  //   for(let i=0;i<val.length;i++)
  //   {
  //     let obj=this.data[0].attendance[val[i]]

  //     for(let i=0;i<obj.length;i++)
  //     {
  //       if(obj[i].emp_id==emp_id)
  //       {     

  //         return obj[i].shift ;
  //       }
  //     }

  //   }


  // }

  findval(Date1, val, sepdate) {

    let value = []

    for (let i = 0; i < Date1.length; i++) {
      let check = val.indexOf(Date1[i])
      if (check == -1) {
        value.push(Date1[i])
      }

    }

    let check = value.indexOf(sepdate)
    if (check != -1) {
      return true
    }

  }
  listarr = []
  partial_update = false

  async datedetails(formdata, Date1) {

    // date for find

    console.log("formdata", formdata)
    console.log("date", Date1)
    this.getemployeedate.patchValue({

      premise_id: formdata.premise_id.id,
      date: Date1,
      branch_id: formdata.branch_id.id

    })

    this.save(1)


    var varDate = new Date(Date1); //dd-mm-YYYY
    var today = new Date();

    if (varDate > today) {
      this.toastr.warning('', 'This Date is Greater than today Date ', { timeOut: 1500 })
      return false
    }


    this.isinvoice = false
    this.isBrachcerscreen = false
    this.isattendance = false
    this.isAttendanceEntry = true
    this.Monthlydraft = false

    this.Displaydate = Date1

    this.isAttendance.patchValue({

      date: this.Displaydate
    })

    await this.sgservice.getattendancedependate(this.getemployeedate.value, 1).then((result => {
      let datas = result['data']

      this.employeelist = datas
      console.log("vlaue", this.employeelist)
    }));



    let employeelist = this.data[0].employee

    const add = this.FromAra.get("array") as FormArray


    while (add.length !== 0) {
      add.removeAt(0)
    }

    let value = this.finddateisthere(Date1)
    let datepresentlist;


    if (value) {

      datepresentlist = this.data[0].attendance[Date1]
      if (this.employeelist.length == employeelist.length) {
        for (let k = 0; k < this.employeelist.length; k++) {
          this.AtttendaceFormEntry = this.fb.group({
            id: this.employeelist[k].employee.id,
            attendance: this.employeelist[k].attendance,
            non_uniform: this.employeelist[k].non_uniform,
            is_sleep: this.employeelist[k].is_sleep,
            is_alcoholic: this.employeelist[k].is_alcoholic,
            unplanned_leave: this.employeelist[k].unplanned_leave,
            is_ot: this.employeelist[k].is_ot,
            ot_hrs: this.employeelist[k].ot_hrs,
            shift: this.employeelist[k]?.shift
          })
          add.push(this.AtttendaceFormEntry)
        }

      }
      else {

        this.partial_update = true
        for (let k = 0; k < this.employeelist.length; k++) {

          this.AtttendaceFormEntry = this.fb.group({
            id: this.employeelist[k].employee.id,
            attendance: this.employeelist[k].attendance,
            non_uniform: this.employeelist[k].non_uniform,
            is_sleep: this.employeelist[k].is_sleep,
            is_alcoholic: this.employeelist[k].is_alcoholic,
            unplanned_leave: this.employeelist[k].unplanned_leave,
            is_ot: this.employeelist[k].is_ot,
            ot_hrs: this.employeelist[k].ot_hrs,
            shift: this.employeelist[k]?.shift
          })
          add.push(this.AtttendaceFormEntry)
        }
        console.log("asfnkdf")
        this.listarr = []
        this.listarr = employeelist

        // for(let i=0 ; i < this.employeelist.length ;i++)
        // {
        //   for(let j=0 ; j< this.listarr.length ;j++)
        //   {
        //     if(this.employeeList[i].employee.id == this.listarr[j].id)
        //     {
        //       this.listarr.splice(j,1)
        //       break;
        //     }
        //   }
        // }

        for (let k = 0; k < this.listarr.length; k++) {
          this.AtttendaceFormEntry = this.fb.group({
            id: this.listarr[k].id,
            attendance: false,
            non_uniform: false,
            is_sleep: false,
            is_alcoholic: false,
            unplanned_leave: false,
            is_ot: false,
            ot_hrs: null,
            shift: 1

          })
          console.log("add value ", add.value)
          let contains = false
          for (let y = 0; y < add.value.length; y++) {
            if (add.value[y].id == this.listarr[k].id) {
              contains = true
              break;
            }
          }
          if (!contains) {
            add.push(this.AtttendaceFormEntry)
          }

        }

      }
      this.upadated = true
    }

    else {
      for (let k = 0; k < employeelist.length; k++) {
        this.AtttendaceFormEntry = this.fb.group({
          id: employeelist[k].id,
          attendance: false,
          non_uniform: false,
          is_sleep: false,
          is_alcoholic: false,
          unplanned_leave: false,
          is_ot: false,
          ot_hrs: null,
          shift: 1

        })

        add.push(this.AtttendaceFormEntry)
      }
      this.upadated = false
    }


  }

  save(pagenumber) {

    this.sgservice.getattendancedependate(this.getemployeedate.value, pagenumber).then((result) => {
      let datas = result['data']


      this.employeelist = datas

      let datapagination = result["pagination"];


      if (this.employeelist.length >= 0) {
        this.has_nextype = datapagination.has_next;
        this.has_pretype = datapagination.has_previous;
        this.presentpagtype = datapagination.index;
      }
    })

  }

  presentpagtype: number = 1
  has_nextype: boolean = false
  has_pretype: boolean = false

  entrypreviousClick() {
    if (this.has_pretype == true) {
      this.save(this.presentpagtype--)
    }

  }
  entrynextClick() {
    if (this.has_nextype == true) {
      this.save(this.presentpagtype++)
    }

  }



  class: any
  upadated: boolean = false

  onCancelAttedanceenty(data) {
    this.isinvoice = false
    this.isBrachcerscreen = false
    this.isattendance = true
    this.isAttendanceEntry = false
    this.Monthlydraft = false
    this.isAttendance.patchValue({
      date: ''
    })
    const addarr = this.FromAra.get("array") as FormArray

    while (addarr.length != 0) {
      addarr.removeAt(0);
    }

    let month = this.datepipe.transform(data.monthdate, "M");
    let year = this.datepipe.transform(data.monthdate, "yyyy")
    let primiseid = this.createformate().premise_id
    let vendorid = this.createformate().agency_id
    let branch_id = this.createformate().branch_id




    this.sgservice.getattendacedetails(primiseid, branch_id, month, year, vendorid, this.presentpagetype).then((result) => {

      let datas = result["data"];

      this.data = datas
      if (this.data[0].approval_data.created_by) {
        this.attendance_Maker_Name = this.data[0].approval_data.created_by.name
        if (this.data[0].approval_data.approver != null) {
          this.attendance_Checker_Name = this.data[0].approval_data.approver.name
        } else {
          this.attendance_Checker_Name = undefined
        }
      } else {
        this.attendance_Maker_Name = undefined
        this.attendance_Checker_Name = undefined
      }

      if (this.data.length == 0) {
        this.data = [
          {
            "approval_data": {

            },
            "attendance": {



            }, "attendance_count": [

            ],

            "employee": [

            ]
          }
        ]
      }

      // this.monthly_salary_vale(this.isAttendance.value)
    })

    this.submitted = true

    this.partial_update = false
  }
  employee_total(id) {
    for (let i = 0; i < this.employee_salary_list?.length; i++) {
      if (this.employee_salary_list[i]?.id == id) {
        return this.employee_salary_list[i]?.salary
      }
    }

  }
  createformate() {
    let data = this.isAttendance.controls

    let obj = new createattdance()

    obj.agency_id = data['agency_id'].value.id
    obj.branch_id = data['branch_id'].value.id
    obj.premise_id = data['premise_id'].value.id
    obj.employee = data['employee'].value
    obj.date = data['date'].value

    return obj

  }

  keyPressAmounts(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[0-9.]/.test(inp) || event.keyCode == 32) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Number only accepted ', { timeOut: 1500 });
      return false;

    }
  }

  onsaveAttedanceenty() {


    const addarr = this.FromAra.get("array") as FormArray

    for (let i = 0; i < addarr.length; i++) {
      if (this.getvalue(i).is_ot == true) {
        if (this.getvalue(i).ot_hrs == "" || this.getvalue(i).ot_hrs == null) {
          let empid = this.getvalue(i).id
          let value;
          for (let i = 0; i < this.data[0].employee.length; i++) {
            if (this.data[0].employee[i].id == empid) {
              value = " Employee --" + this.data[0].employee[i].name
              this.toastr.warning(value, 'Overtime Hours Empty', { timeOut: 2000 });;
              return false
            }
          }

        }
      }
    }

    for (let i = 0; i < addarr.length; i++) {
      if (this.getvalue(i).is_ot == true) {
        if (this.getvalue(i).ot_hrs == "0" || this.getvalue(i).ot_hrs == "9") {
          let empid = this.getvalue(i).id
          let value;
          for (let i = 0; i < this.data[0].employee.length; i++) {
            if (this.data[0].employee[i].id == empid) {
              value = " Employee --" + this.data[0].employee[i].name
              this.toastr.warning(value, 'Overtime Hours Should be 1 to 8', { timeOut: 2000 });;
              return false
            }
          }

        }
      }
    }

    const add = this.isAttendance.get("employee") as FormArray
    while (add.length != 0) {
      add.removeAt(0);
    }



    // let datepresentlist=this.data[0].attendance[this.Displaydate]
    if (this.upadated == true && this.partial_update == false) {
      for (let i = 0; i < addarr.length; i++) {
        for (let j = 0; j < this.employeelist.length; j++) {

          if (addarr.value[i].id == this.employeelist[j].employee.id) {
            if (addarr.value[i].attendance != this.employeelist[j].attendance || addarr.value[i].is_sleep != this.employeelist[j].is_sleep
              || addarr.value[i].is_alcoholic != this.employeelist[j].is_alcoholic || addarr.value[i].is_ot != this.employeelist[j].is_ot
              || addarr.value[i].ot_hrs != this.employeelist[j].ot_hrs
              || addarr.value[i].unplanned_leave != this.employeelist[j].unplanned_leave || addarr.value[i].non_uniform != this.employeelist[j].non_uniform
              || addarr.value[i].shift != this.employeelist[j].shift
            ) {
              if (addarr.controls[i].value.is_ot == false) {
                addarr.controls[i].value.ot_hrs = 0
              }
              if (addarr.controls[i].value.attendance == false) {
                addarr.controls[i].value.shift = null
              }
              add.push(addarr.controls[i])
              break;
            }
          }
        }
      }
    }
    else {
      for (let i = 0; i < addarr.length; i++) {
        if (addarr.controls[i].value.is_ot == false) {
          addarr.controls[i].value.ot_hrs = null
        }
        if (addarr.controls[i].value.attendance == false) {
          addarr.controls[i].value.shift = null
        }
        add.push(addarr.controls[i])
      }

    }




    while (addarr.length != 0) {
      addarr.removeAt(0);
    }
    // console.log("value of attendance",this.createformate())

    this.sgservice.postAttendancedetails(this.createformate(), '')
      .subscribe(result => {
        if (result.status == "success") {
          this.notification.showSuccess("Success")
        } else {
          this.notification.showError(result.description)
        }

        this.save(1)
      })

    this.submitted = false
    this.partial_update = false

  }

  submitted: boolean = true
  // form control check value
  click1(i) {
    console.log("controls value", this.getcontrols(i))
  }

  onCheckChange(i, datas) {

    const arr = this.getvalue2(i)

    if (datas == true) {
      arr.patchValue({
        unplanned_leave: false,
        non_uniform: false,
        is_sleep: false,
        is_alcoholic: false,

      })

    }
    if (datas == false) {
      arr.patchValue({
        unplanned_leave: false,
        non_uniform: false,
        is_sleep: false,
        is_alcoholic: false,
        is_ot: datas,
        ot_hrs: null
      })

    }

  }

  presenttoall() {
    let fullarr = this.value1()
    for (let i = 0; i < fullarr.length; i++) {
      this.getvalue2(i).patchValue({
        attendance: true
      })
      this.onCheckChange(i, this.getvalue2(i).value.attendance)
    }

  }
  onCheckChangeot(i, ot_value) {
    const arr = this.getvalue2(i)

    if (ot_value == false) {
      arr.patchValue({
        ot_hrs: null
      })

    }

  }

  display(ot_is, i) {

    if (ot_is == false) {
      return null
    }
    else {
      return this.getvalue(i).ot_hrs
    }
  }





  value1() {
    return (this.FromAra.get("array") as FormArray).controls
  }

  getcontrols(i) {
    return (this.FromAra.get("array") as FormArray).controls[i].value
  }

  getvalue(i) {


    return (this.FromAra.get("array") as FormArray).controls[i].value
  }

  getvalue2(i) {


    return (this.FromAra.get("array") as FormArray).controls[i]
  }

  getvalue1(i, args) {
    // let value1=this.getvalue(i)

    (this.FromAra.get("array") as FormArray).controls[i].value.args = false

    return (this.FromAra.get("array") as FormArray).controls[i].value
  }
  getvaluearr() {
    return (this.FromAra.get("array") as FormArray).value
  }



  // Attendacelist:any
  // employeelist:any[]
  // datelist:any[]
  finddayscount(year, month) {

    return new Date(year, month, 0).getDate();

  }

  totallist = [];

  // has_nexttab:boolean=false
  // has_previousetab:boolean=false
  // value:number=0
  // index:number=0
  // datefilter =""

  // tablepaginations:pagination

  // tablepreviousClick(data)
  // {
  //   let month=this.datepipe.transform(data.monthdate,"M");
  //   let year=this.datepipe.transform(data.monthdate,"yyyy")
  //   let primiseid=data.premise_id
  //   let vendorid=data.vendorid
  //   let branch_id=data.branch_id

  //   this.dateorder--
  //   this.sgservice.getattendacedetails(primiseid,branch_id,month,year,this.dateorder).then((result)=>{

  //     let datas = result["data"];
  //     this.data=datas

  //   })


  //   this.tablepaginations.index--;
  //   if(this.tablepaginations.index==2)
  //   {
  //     this.tablepaginations.has_next=true
  //     this.tablepaginations.has_previous=true
  //     this.Date=[]
  //     for(let i=10;i<20;i++)
  //     {
  //       this.Date.push(this.totallist[i])
  //     }
  //   }
  //   else if(this.tablepaginations.index==1)
  //   {
  //     this.tablepaginations.has_next=true
  //     this.tablepaginations.has_previous=false
  //     this.Date=[]
  //     for(let i=0;i<10;i++)
  //     {
  //       this.Date.push(this.totallist[i])
  //     }
  //   }

  //   this.has_nexttab=this.tablepaginations.has_next
  //   this.has_previousetab=this.tablepaginations.has_previous
  //   this.index=this.tablepaginations.index


  // }
  // tablenextClick(data){

  //   let month=this.datepipe.transform(data.monthdate,"M");
  //   let year=this.datepipe.transform(data.monthdate,"yyyy")
  //   let primiseid=data.premise_id
  //   let vendorid=data.vendorid
  //   let branch_id=data.branch_id
  //   this.dateorder++

  //   this.sgservice.getattendacedetails(primiseid,branch_id,month,year,this.dateorder).then((result)=>{

  //     let datas = result["data"];
  //     this.data=datas

  //   })

  //   this.tablepaginations.index++

  //   if(this.tablepaginations.index==2)
  //   {
  //     this.tablepaginations.has_next=true
  //     this.tablepaginations.has_previous=true
  //     this.Date=[]
  //     for(let i=10;i<20;i++)
  //     {
  //       this.Date.push(this.totallist[i])
  //     }

  //   }
  //   else if(this.tablepaginations.index==3)
  //   {
  //     this.tablepaginations.has_next=false
  //     this.tablepaginations.has_previous=true
  //     this.Date=[]
  //     for(let i=20;i<this.totallist.length;i++)
  //     {
  //       this.Date.push(this.totallist[i])
  //     }

  //   }
  //   this.has_nexttab=this.tablepaginations.has_next
  //   this.has_previousetab=this.tablepaginations.has_previous
  //   this.index=this.tablepaginations.index
  // }
  count = 0
  employee_salary_list: any
  selectedMonth: any; selectedyear: any
  async Datelistfind(data) {

    if (data.branch_id === "") {
      this.toastr.warning('', 'Please Select the Branch', { timeOut: 1500 });
      return false
    }
    if (data.premise_id === "") {
      this.toastr.warning('', 'Please Select the Premises', { timeOut: 1500 });
      return false
    }
    if (data.agency_id === "") {
      this.toastr.warning('', 'Please Select the Agency', { timeOut: 1500 });
      return false
    }
    if (data.monthdate === "") {

      this.toastr.warning('', 'Please Select the Year and Month', { timeOut: 1500 });
      return false
    }


    if (data.monthdate != "" && this.count == 0) {
      this.Date = [];
      this.totallist = [];

      let month = parseInt(this.datepipe.transform(data.monthdate, "MM"));
      let year = parseInt(this.datepipe.transform(data.monthdate, "yyyy"))
      this.selectedMonth = month
      this.selectedyear = year
      console.log("selected month", this.selectedMonth)
      console.log("selected year", this.selectedyear)

      let getdaycount = this.finddayscount(year, month)

      for (let i = 1; i <= getdaycount; i++) {
        let str;
        if (i < 10 && month < 10) {
          str = year + "-0" + month + "-0" + i;
        }

        else if (i > 10 && month < 10) {
          str = year + "-0" + month + "-" + i;
        }
        else if (i < 10 && month > 10) {
          str = year + "-" + month + "-0" + i;
        }
        else if (i == 10 && month < 10) {
          str = year + "-0" + month + "-" + i
        }
        else if (i < 10 && month == 10) {
          str = year + "-" + month + "-0" + i
        }
        else {
          str = year + "-" + month + "-" + i
        }
        this.totallist.push(str)
      }


      for (let j = 0; j < this.totallist.length; j++) {
        this.Date.push(this.totallist[j])
      }

    }

    console.log("date", this.totallist)
    this.count++;
    this.dateorder = 0;

    this.dateorder++;

    let month = this.datepipe.transform(data.monthdate, "M");
    let year = this.datepipe.transform(data.monthdate, "yyyy")
    let primiseid = this.createformate().premise_id
    let vendorid = this.createformate().agency_id
    let branch_id = this.createformate().branch_id
    this.Displaymonth = data.monthdate

    // this.monthly_salary_vale(this.isAttendance.value)


    console.log(" mouth " + month + " year " + year + " primiseid " + primiseid + " vendorid " + vendorid + " branch _id " + branch_id)

    // this.service(primiseid,branch_id,month,year,this.dateorder)
    this.SpinnerService.show()
    this.sgservice.getattendacedetails(primiseid, branch_id, month, year, vendorid, this.presentpagetype).then((result) => {

      let datas = result["data"];
      this.data = datas
      if (this.data.length != 0) {
        if (this.data[0].approval_data.created_by) {
          this.attendance_Maker_Name = this.data[0].approval_data.created_by.name
          if (this.data[0].approval_data.approver != null) {
            this.attendance_Checker_Name = this.data[0].approval_data.approver.name
          } else {
            this.attendance_Checker_Name = undefined
          }
        } else {
          this.attendance_Maker_Name = undefined
          this.attendance_Checker_Name = undefined
        }
        this.IDForApproverUpdate = this.data[0].approval_data.id
        console.log("this.IDForApproverUpdate", this.IDForApproverUpdate)
      }


      if (this.data.length == 0) {
        this.data = [
          {
            "approval_data": {

            },
            "attendance": {



            }, "attendance_count": [

            ],

            "employee": [

            ]
          }
        ]
      }
      // this.monthly_salary_vale(this.isAttendance.value)

      console.log("sub", this.data)
      this.SpinnerService.hide()
    })

    console.log("Total attendance details", this.data)

    let intmonth = parseInt(month)
    let intyear = parseInt(year)

    this.movetochekerform.patchValue({
      premise_id: primiseid,
      branch_id: branch_id,
      month: intmonth,
      year: intyear,

    })
    this.approverform.patchValue({
      premise_id: primiseid,
      branch_id: branch_id,
      month: intmonth,
      year: intyear,
    })

    this.onsubmitshow = true

  }

  arraList: any = [];
  presentAll(data, employee_Id, checklinedata) {
    this.SpinnerService.show()
    let presentMonthAndYear = new Date();
    let getpresentMonthForValidation = presentMonthAndYear.getMonth() + 1;
    let getpresentyearForValidation = presentMonthAndYear.getFullYear();
    if (getpresentMonthForValidation == this.selectedMonth && getpresentyearForValidation == this.selectedyear) {
      this.notification.showWarning("Present All is not allowed")
      this.SpinnerService.hide()
      return false
    }

    const datelist = data.monthdate
    let Date_new = this.datepipe.transform(datelist, 'yyyy-MM-dd')

    var varDate = new Date(Date_new); //dd-mm-YYYY
    var today = new Date();

    if (varDate > today) {
      this.toastr.warning('', 'This Date is Greater than today Date ', { timeOut: 1500 })
      this.SpinnerService.hide();
      return false
    }

    this.arraList = [];
    let month = this.datepipe.transform(data.monthdate, "M");
    let year = this.datepipe.transform(data.monthdate, "yyyy")
    let primiseid = this.createformate().premise_id
    let vendorid = this.createformate().agency_id
    let branch_id = this.createformate().branch_id
    this.arraList.push(employee_Id);
    let MONTH = Number(month)
    let YEAR = Number(year)
    let json = {
      "month": MONTH,
      "year": YEAR,
      "vendor_id": vendorid,
      "premise_id": primiseid,
      "branch_id": branch_id,
      "emp_arr": this.arraList
    }

    this.sgservice.presentAll(json)
      .subscribe((res) => {
        console.log("presentAll", res)
        if (res.status == "success") {
          // this.notification.showSuccess("Moved to ECF!...")
          this.getvalueatt(this.isAttendance.value, this.presentpagetype)
          this.SpinnerService.hide();
        } else {
          this.notification.showError(res.description)
          this.SpinnerService.hide();
        }


      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )


  }
  attendance_Checker_Name: any;
  attendance_Maker_Name: any;
  getvalueatt(data, pagenumber) {
    let month = this.datepipe.transform(data.monthdate, "M");
    let year = this.datepipe.transform(data.monthdate, "yyyy")
    let primiseid = this.createformate().premise_id
    let vendorid = this.createformate().agency_id
    let branch_id = this.createformate().branch_id

    console.log(" mouth " + month + " year " + year + " primiseid " + primiseid + " vendorid " + vendorid + " branch _id " + branch_id)

    // this.service(primiseid,branch_id,month,year,this.dateorder)





    this.sgservice.getattendacedetails(primiseid, branch_id, month, year, vendorid, pagenumber).then((result) => {

      let datas = result["data"];

      this.data = datas
      if (this.data[0].approval_data.created_by) {
        this.attendance_Maker_Name = this.data[0].approval_data.created_by.name
        if (this.data[0].approval_data.approver != null) {
          this.attendance_Checker_Name = this.data[0].approval_data.approver.name
        } else {
          this.attendance_Checker_Name = undefined
        }
      } else {
        this.attendance_Maker_Name = undefined
        this.attendance_Checker_Name = undefined
      }
      if (this.data.length == 0) {

        this.data = [
          {
            "approval_data": {

            },
            "attendance": {



            }, "attendance_count": [

            ],

            "employee": [

            ]
          }
        ]
      }
      // this.monthly_salary_vale(this.isAttendance.value)

      console.log("sub", this.data)
      let datapagination = result["pagination"];

      if (this.data[0]?.employee?.length >= 0) {
        this.has_nexttype = datapagination.has_next;
        this.has_previoustype = datapagination.has_previous;
        this.presentpagetype = datapagination.index;
      }


    })
  }
  attendancepreviousClick() {
    if (this.has_previoustype == true) {
      this.getvalueatt(this.isAttendance.value, this.presentpagetype--)
    }



  }
  attdancenextClick() {
    if (this.has_previoustype == true) {
      this.getvalueatt(this.isAttendance.value, this.presentpagetype++)
    }

  }
  has_previoustype: boolean = false
  has_nexttype: boolean = false
  presentpagetype: number = 1

  // service(primiseid,branch_id,month,year,dateorder)
  // {
  //   return this.sgservice.getattendacedetails(primiseid,branch_id,month,year,dateorder).pipe(map(result=>{
  //     let datas=result['data']
  //     console.log("this in pipes",datas)
  //     this.data=datas
  //   }))
  // }

  dateorder: any = 0;

  // Onsearch(data)
  // {
  //   // let month=this.datepipe.transform(data.monthdate,"M");
  //   // let year=this.datepipe.transform(data.monthdate,"yyyy")
  //   // let primiseid=this.createformate().premise_id
  //   // let vendorid=this.createformate().agency_id
  //   // let branch_id=this.createformate().branch_id

  //   // console.log(" mouth "+month+" year "+year+" primiseid "+primiseid+" vendorid "+vendorid + " branch _id "+ branch_id)



  //   // this.sgservice.getattendacedetails(primiseid,branch_id,month,year,this.dateorder).subscribe((result)=>{

  //   //   let datas = result["data"];

  //   //   this.data=datas
  //   //   console.log("sub on serch",this.data)

  //   // })

  //   // console.log("finished exsicutions on search",this.data)

  // }

  // Attdance screen dropdowns

  // branch value

  branchlist: any
  isLoadingbranch = false

  brachname() {
    // let prokeyvalue: String = "";
    //   this.getbranch(prokeyvalue);
    //   this.isAttendance.get('branch_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoadingbranch = true;
    //       }),
    //       switchMap(value => this.sgservice.getBranch(value)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoadingbranch = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.branchlist= datas;


    //     })

    let a = this.branchContactInput.nativeElement.value
    this.sgservice.getBranch(a)
      //  .subscribe(x =>{
      //    console.log("dd value data", x)
      //  })
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
      })

  }
  getbranch() {
    this.sgservice.getBranch("")
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
  }

  public displaybranch(producttype?: branchlistss): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);


    return producttype ? "(" + producttype.code + ") " + producttype.name : undefined;

  }

  premise_list: any;
  // branch_IID=0;
  branchFocusOut(data) {
    this.premisesArray = [];
    this.premise_list = data.premise;
    // this.branch_IID =data.id;
    //premises array
    for (let i = 0; i < this.premise_list.length; i++) {
      let premise_id = this.premise_list[i].id
      this.premisesArray.push(premise_id)
    }
    console.log("premisesArray", this.premisesArray)
    this.getprimes()

  }


  premiseFocusOut(data) {
    console.log("premises-- focusout", data)
    this.isPremisesAddress = true;
    this.premisesname = "(" + data?.code + ") " + data?.name
    this.updatelineName1 = data?.address?.line1;
    this.updatelineName2 = data?.address?.line2;
    this.updatelineName3 = data?.address?.line3;
    this.updatecityName = data?.address?.city?.name;
    this.updatedistrictName = data?.address?.district?.name;
    this.updatestateName = data?.address?.state?.name;
    this.updatepinCode = data?.address?.pincode?.no;
    this.agencyArray = [];
    let premiseId = data.id;
    //agency array
    for (let i = 0; i < this.premise_list.length; i++) {
      if (premiseId == this.premise_list[i].id) {
        this.agencyArray = this.premise_list[i].vendor
      }

    }
    console.log("agencyArray", this.agencyArray)
    this.getcatven()

    this.isAttendanceAdmin.controls['agency_id'].reset('')

  }

  clearPremisesAndAgency() {
    this.clear_premises.nativeElement.value = '';
    this.clear_agency.nativeElement.value = '';
    this.isPremisesAddress = false;
  }

  // vendor
  empvendorlist: any
  productname() {

    // let prokeyvalue: String = "";
    //   this.getcatven(this.agencyArray,prokeyvalue);
    //   this.isAttendance.get('agency_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //       }),
    //       switchMap(value => this.sgservice.getAgency(this.agencyArray,value)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.empvendorlist = datas;
    //       console.log("product", datas)

    //     })
    let a = this.VendorContactInput.nativeElement.value
    this.sgservice.getAgency(this.agencyArray, a)
      //  .subscribe(x =>{
      //    console.log("dd value data", x)
      //  })
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empvendorlist = datas;
      })

  }
  getcatven() {
    this.sgservice.getAgency(this.agencyArray, "")
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empvendorlist = datas;

      })
  }

  public displaydis(producttype?: productlistss): string | undefined {
    // return producttype ? producttype.name : undefined;
    return producttype ? "(" + producttype.code + ") " + producttype.name : undefined;

  }


  // primes


  primeslist: any
  isLoadingprimes = false

  primiesname() {
    // let prokeyvalue: String = "";
    //   this.getprimes(this.premisesArray,prokeyvalue);
    //   this.isAttendance.get('premise_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoadingprimes = true;
    //       }),
    //       switchMap(value => this.sgservice.getpremises(this.premisesArray,value,1)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoadingprimes = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.primeslist= datas;



    //     })
    let a = this.PremiseContactInput.nativeElement.value
    this.sgservice.getpremises(this.premisesArray, a, 1)
      //  .subscribe(x =>{
      //    console.log("dd value data", x)
      //  })
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primeslist = datas;


      })


  }
  getprimes() {
    this.sgservice.getpremises(this.premisesArray, "", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.primeslist = datas;

      })
    this.empvendorlist = [];
  }

  public displayprimes(producttype?: primeslistss): string | undefined {
    //console.log('id', producttype.id);
    // this.selecteddrop=producttype.id
    // console.log('name', this.selecteddrop);


    return producttype ? "(" + producttype.code + ") " + producttype.name : undefined;

  }

  // appbranch based employee
  employeeList: any
  isLoading: boolean = false
  appBranch_Id = 0;
  approvername() {
    let approverkeyvalue: String = "";
    // this.getApprover(this.appBranch_Id,approverkeyvalue);

    // this.movetochekerform.get('approver').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.sgservice.appBranchBasedEmployee(this.appBranch_Id,value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.employeeList = datas;

    //   })
    let a = this.ApproverContactInput.nativeElement.value
    this.sgservice.appBranchBasedEmployee(this.appBranch_Id, a, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })

  }

  approvernameAlternate() {
    let a = this.ApproverContactInputtwo.nativeElement.value
    this.sgservice.appBranchBasedEmployee(this.appBranch_Id, a, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })

  }

  private getApprover(id, approverkeyvalue) {
    this.sgservice.appBranchBasedEmployee(id, approverkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })
  }

  public displayFnEmployee(employee?: approver): string | undefined {
    return employee ? employee.full_name : undefined;
  }

  //approval branch

  appBranchList: any
  approvalBranchClick() {
    // let approvalbranchkeyvalue: String = "";
    // this.getApprovalBranch(approvalbranchkeyvalue);
    // this.movetochekerform.get('approval_branch').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.sgservice.getBranchLoadMore(value,1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.appBranchList = datas;

    //   })
    let a = this.appBranchInput.nativeElement.value
    this.sgservice.getBranchLoadMore(a, 1)
      //  .subscribe(x =>{
      //    console.log("dd value data", x)
      //  })
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appBranchList = datas;
      })

  }

  getApprovalBranch() {
    this.sgservice.getBranchLoadMore("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appBranchList = datas;
      })
  }

  public displayFnappBranch(branch?: approvalBranch): string | undefined {

    return branch ? "(" + branch.code + " )" + branch.name : undefined;
  }


  FocusApprovalBranch(data) {
    console.log("appbranch", data)
    this.appBranch_Id = data.id;
    console.log("id", this.appBranch_Id)
    this.getApprover(data.id, '')
  }
  clearAppBranch() {
    this.clear_appBranch.nativeElement.value = '';
  }


  onCheckCondition() {
    const datelist = this.isAttendance.value.monthdate
    let Date_new = this.datepipe.transform(datelist, 'yyyy-MM-dd')

    var varDate = new Date(Date_new); //dd-mm-YYYY
    var today = new Date();
    if (varDate > today) {
      this.toastr.warning('', 'This Date is Greater than today Date ', { timeOut: 1500 })
      return false
    }

    this.makerchecker.nativeElement.click();

  }


  movetoapprove() {

    if (this.movetochekerform.value.approval_branch.id === undefined || this.movetochekerform.value.approval_branch === "") {
      this.toastr.warning('', 'Select Any one Approval Branch', { timeOut: 1000 });
      return false
    }
    if (this.movetochekerform.value.approver.id === undefined || this.movetochekerform.value.approver === "") {
      this.toastr.warning('', 'Select Any one the Approver', { timeOut: 1000 });
      return false
    }

    if (this.movetochekerform.value.remarks == "") {
      this.toastr.warning('', 'Please Enter the Remark', { timeOut: 1000 });
      return false
    }
    this.movetochekerform.patchValue({
      status: 2,
      // approver:this.movetochekerform.value.approver.id,
      // approval_branch:this.movetochekerform.value.approval_branch.id,

    })
    this.movetochekerform.value.approver = this.movetochekerform.value.approver.id,
      this.movetochekerform.value.approval_branch = this.movetochekerform.value.approval_branch.id,

      console.log("move to app", this.movetochekerform.value)
    this.sgservice.postmakerchekker(this.movetochekerform.value)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Approver!...")
          this.getvalueatt(this.isAttendance.value, this.presentpagetype)
          this.movetochekerform.reset()


          this.makerchecker.nativeElement.click();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })


  }

  monthly_salary_vale(data) {
    this.employee_salary_list = [];
    if (this.data[0]?.approval_data?.approval_status?.id != 1) {
      let month = this.datepipe.transform(data.monthdate, "M");
      let year = this.datepipe.transform(data.monthdate, "yyyy")
      let primiseid = this.createformate().premise_id
      let vendorid = this.createformate().agency_id
      let branch_id = this.createformate().branch_id
      let employee_salaryobject = new monthlydraft();

      employee_salaryobject.branch_id = branch_id;
      employee_salaryobject.premise_id = primiseid;
      employee_salaryobject.year = parseInt(year);
      employee_salaryobject.month = parseInt(month);
      employee_salaryobject.vendor_id = vendorid;

      this.sgservice.employee_mothly_salary(this.presentpagetype, employee_salaryobject).subscribe((result) => {
        let dataz = result['data'];

        this.employee_salary_list = dataz

      })

    }

  }

  ApproverPopupForm() {
    console.log("approver branch", this.approverform.value.remarks)
    if (this.approverform.value.remarks == "") {
      this.toastr.warning('', 'Please Enter the Remark', { timeOut: 1000 });
      return false
    }
    this.approverform.patchValue({
      status: 3,

    })
    this.sgservice.postmakerchekker(this.approverform.value)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Approved Successfully!...")
          this.getvalueatt(this.isAttendance.value, this.presentpagetype)
          this.approverform.reset()
          this.addaprover.nativeElement.click();
        } else {
          this.notification.showError(res.description)

        }
        return true
      })
    console.log("form value", this.approverform.value)
  }
  rejectPopupForm() {
    if (this.approverform.value.remarks == "") {
      this.toastr.warning('', 'Please Enter the Remark', { timeOut: 1000 });
      return false
    }
    this.approverform.patchValue({
      status: 0,

    })
    console.log("form value", this.approverform.value)
    this.sgservice.postmakerchekker(this.approverform.value)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Rejected!...")
          this.getvalueatt(this.isAttendance.value, this.presentpagetype)
          this.rejected.nativeElement.click();
          this.approverform.reset()
        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }
  reviewPopupForm() {
    if (this.approverform.value.remarks == "") {
      this.toastr.warning('', 'Please Enter the Remark', { timeOut: 1000 });
      return false
    }
    this.approverform.patchValue({
      status: 4,

    })

    console.log("form value", this.approverform.value)
    this.sgservice.postmakerchekker(this.approverform.value)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Reviewed!...")
          this.getvalueatt(this.isAttendance.value, this.presentpagetype)
          this.review.nativeElement.click();
          this.approverform.reset()
        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }

  functinoncheck() {

    if ((this.data[0]?.approval_data?.approval_status?.id == 1) && (this.data[0]?.approval_data?.ismaker == true)) {
      return true
    }
  }



  approve(data) {
    console.log("name", data)
    this.movetochekerform.patchValue({
      approval_branch: data.branch_id,
      patch1: data.branch_code + "-" + data.branch_name
    })


  }

  // approval flow
  historyData: any = []

  approvalFlow() {
    this.historyData = [];
    let atten_id = this.data[0]?.approval_data?.id
    if (atten_id == undefined) {

      return false
    }
    this.sgservice.getattedanceHistory(atten_id)
      .subscribe(result => {
        console.log("approvalFlow", result)
        this.historyData = result.data;
      })
  }


  monthydraftlist: any
  primises: any
  branchshow: any
  vendorshow: any
  ViewSummary = [];
  ViewSummary_index: any;

  montlyDraft(data) {
    this.ViewSummary = []

    let month = parseInt(this.datepipe.transform(data.monthdate, "M"));
    let year = parseInt(this.datepipe.transform(data.monthdate, "yyyy"))
    let primiseid = this.createformate().premise_id
    let vendorid = this.createformate().agency_id
    let branch_id = this.createformate().branch_id
    this.primises = data.premise_id.name
    this.branchshow = data.branch_id.name
    this.vendorshow = data.agency_id.name
    let monthysubmit = new monthlydraft()

    monthysubmit.branch_id = branch_id
    monthysubmit.premise_id = primiseid
    monthysubmit.vendor_id = vendorid
    monthysubmit.month = month
    monthysubmit.year = year

    console.log("monthly objects", monthysubmit)
    this.sgservice.postMonthlydraft(monthysubmit).subscribe((result) => {
      let data = result
      console.log("name", data)
      this.daat = []
      this.daat.push(data)
      if (this.daat[0]?.armed_miniwages_total != null && this.daat[0]?.unarmed_miniwages_total != null) {
        this.Totalbillamount = this.daat[0]?.armed_miniwages_total?.grand_total + this.daat[0]?.unarmed_miniwages_total?.grand_total
      }
      if (this.daat[0]?.armed_miniwages_total == null && this.daat[0]?.unarmed_miniwages_total != null) {
        this.Totalbillamount = 0 + this.daat[0]?.unarmed_miniwages_total?.grand_total
      }
      if (this.daat[0]?.armed_miniwages_total != null && this.daat[0]?.unarmed_miniwages_total == null) {
        this.Totalbillamount = this.daat[0]?.armed_miniwages_total?.grand_total + 0
      }
      if (this.daat[0]?.armed_miniwages_total == null && this.daat[0]?.unarmed_miniwages_total == null) {
        this.Totalbillamount = ''
      }



      // for (let i = 0; i < this.Armedlist.length; i++) {
      if (this.daat[0]?.armed_miniwages != null) {
        let armedallowancelist = this.daat[0]?.armed_miniwages.extra_allowance
        for (let j = 0; j < armedallowancelist.length; j++) {
          let amt_json = {
            "amount": armedallowancelist[j].charges
          }
          if (this.ViewSummary.length == 0) {
            let first_item = {
              "name": armedallowancelist[j].name,
              "armedcharges": [
                amt_json
              ]
            }
            this.ViewSummary.push(first_item)
          } else {
            let key_check = 'b'
            for (let k = 0; k < this.ViewSummary.length; k++) {
              if (armedallowancelist[j].name == this.ViewSummary[k].name) {
                key_check = 'a'
                this.ViewSummary_index = k
              }
            }
            if (key_check == 'a') {
              this.ViewSummary[this.ViewSummary_index]["armedcharges"].push(amt_json)
            } else {
              let final_value = {
                "name": armedallowancelist[j].name,
                "armedcharges": [
                  amt_json
                ]
              }
              this.ViewSummary.push(final_value)
            }
          }
        }
      }
      // }
      console.log("armed_miniwages", this.ViewSummary)



      // for (let i = 0; i < this.securitylist.length; i++) {
      if (this.daat[0]?.unarmed_miniwages != null) {
        let armedallowancelist = this.daat[0]?.unarmed_miniwages.extra_allowance
        for (let j = 0; j < armedallowancelist.length; j++) {
          let amt_json = {
            "amount": armedallowancelist[j].charges
          }
          if (this.ViewSummary.length == 0) {
            let first_item = {
              "name": armedallowancelist[j].name,
              "unarmedcharges": [
                amt_json
              ]
            }
            this.ViewSummary.push(first_item)
          } else {
            let key_check = 'c'
            for (let k = 0; k < this.ViewSummary.length; k++) {
              if (armedallowancelist[j].name == this.ViewSummary[k].name) {
                key_check = 'd'
                this.ViewSummary_index = k
              }
            }
            if (key_check == 'd') {
              if (this.ViewSummary[this.ViewSummary_index]["unarmedcharges"] == undefined) {
                this.ViewSummary[this.ViewSummary_index]["unarmedcharges"] = [amt_json]
              } else {
                this.ViewSummary[this.ViewSummary_index]["unarmedcharges"].push(amt_json)
              }
            } else {
              let final_value = {
                "name": armedallowancelist[j].name,
                "unarmedcharges": [
                  amt_json
                ]
              }
              this.ViewSummary.push(final_value)
            }
          }
        }
      }
      // }
      console.log("unarmed_miniwages", this.ViewSummary)


      if (this.daat[0]?.armed_miniwages_total != null) {
        let armedallowancelist = this.daat[0]?.armed_miniwages_total.extra_allowance
        for (let j = 0; j < armedallowancelist.length; j++) {
          let amt_json = {
            "amount": armedallowancelist[j].charges
          }
          if (this.ViewSummary.length == 0) {
            let first_item = {
              "name": armedallowancelist[j].name,
              "armedchargestotal": [
                amt_json
              ]
            }
            this.ViewSummary.push(first_item)
          } else {
            let key_check = 'e'
            for (let k = 0; k < this.ViewSummary.length; k++) {
              if (armedallowancelist[j].name == this.ViewSummary[k].name) {
                key_check = 'f'
                this.ViewSummary_index = k
              }
            }
            if (key_check == 'f') {
              if (this.ViewSummary[this.ViewSummary_index]["armedchargestotal"] == undefined) {
                this.ViewSummary[this.ViewSummary_index]["armedchargestotal"] = [amt_json]
              } else {
                this.ViewSummary[this.ViewSummary_index]["armedchargestotal"].push(amt_json)
              }
            } else {
              let final_value = {
                "name": armedallowancelist[j].name,
                "armedchargestotal": [
                  amt_json
                ]
              }
              this.ViewSummary.push(final_value)
            }
          }
        }
      }

      if (this.daat[0]?.unarmed_miniwages_total != null) {
        let armedallowancelist = this.daat[0]?.unarmed_miniwages_total.extra_allowance
        for (let j = 0; j < armedallowancelist.length; j++) {
          let amt_json = {
            "amount": armedallowancelist[j].charges
          }
          if (this.ViewSummary.length == 0) {
            let first_item = {
              "name": armedallowancelist[j].name,
              "unarmedchargestotal": [
                amt_json
              ]
            }
            this.ViewSummary.push(first_item)
          } else {
            let key_check = 'g'
            for (let k = 0; k < this.ViewSummary.length; k++) {
              if (armedallowancelist[j].name == this.ViewSummary[k].name) {
                key_check = 'h'
                this.ViewSummary_index = k
              }
            }
            if (key_check == 'h') {
              if (this.ViewSummary[this.ViewSummary_index]["unarmedchargestotal"] == undefined) {
                this.ViewSummary[this.ViewSummary_index]["unarmedchargestotal"] = [amt_json]
              } else {
                this.ViewSummary[this.ViewSummary_index]["unarmedchargestotal"].push(amt_json)
              }
            } else {
              let final_value = {
                "name": armedallowancelist[j].name,
                "unarmedchargestotal": [
                  amt_json
                ]
              }
              this.ViewSummary.push(final_value)
            }
          }
        }
      }
      console.log("unarmed_miniwages_total", this.ViewSummary)




    })


  }
  montlyDraftdownload(data) {
    let month = parseInt(this.datepipe.transform(data.monthdate, "M"));
    let year = parseInt(this.datepipe.transform(data.monthdate, "yyyy"))
    let primiseid = this.createformate().premise_id
    let vendorid = this.createformate().agency_id
    let branch_id = this.createformate().branch_id
    this.primises = data.premise_id.name
    this.branchshow = data.branch_id.name
    this.vendorshow = data.agency_id.name
    let monthysubmit = new monthlydraft()

    monthysubmit.branch_id = branch_id
    monthysubmit.premise_id = primiseid
    monthysubmit.vendor_id = vendorid
    monthysubmit.month = month
    monthysubmit.year = year

    this.sgservice.monthlydraftdownload(monthysubmit).subscribe((result) => {
      let data = result
      console.log("name", data)

      let binaryData = [];
      binaryData.push(data)
      console.log("class name", new Blob(binaryData))

      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      console.log("download url", downloadUrl)
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "MonthlyDraft.pdf";
      link.click();

    })
  }

  monlydraftcancel() {
    this.isinvoice = false
    this.isBrachcerscreen = false
    this.isattendance = true
    this.isAttendanceEntry = false
    this.Systemgenerationbill = false
    this.minimumwages = false
    this.Monthlydraft = false
  }

  Totalamdaamount: any
  Totalunamdamount: any
  Totalamount: any
  sgstamount: any
  cgstamount: any
  daat = []
  Totalbillamount: any
  calculation() {
    this.Totalamdaamount = this.daat[0]?.amount_data?.present_armemp + this.daat[0]?.amount_data?.ot_armemp
    this.Totalamdaamount = this.Totalamdaamount - (this.daat[0]?.amount_data?.nonuniform_armemp + this.daat[0]?.amount_data?.alcoholic_armemp + this.daat[0]?.amount_data?.unplanleave_armemp + this.daat[0]?.amount_data?.sleep_armemp)

    this.Totalunamdamount = this.daat[0]?.amount_data?.present_unarmemp + this.daat[0]?.amount_data?.ot_unarmemp
    this.Totalunamdamount = this.Totalunamdamount - (this.daat[0]?.amount_data?.nonuniform_unarmemp + this.daat[0]?.amount_data?.alcoholic_unarmemp + this.daat[0]?.amount_data?.unplanleave_unarmemp + this.daat[0]?.amount_data?.sleep_unarmemp)

    this.Totalamount = this.Totalunamdamount + this.Totalamdaamount
    this.sgstamount = this.Totalamount * (9 / 100)
    this.cgstamount = this.Totalamount * (9 / 100)


  }

  currentpagebra: any = 1
  has_nextbra: boolean = true
  has_previousbra: boolean = true
  autocompletebranchnameScroll() {

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
                this.sgservice.getBranchLoadMore(this.branchContactInput.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchlist = this.branchlist.concat(datas);
                    if (this.branchlist.length >= 0) {
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

  // Premies dropdown
  currentpagepre: any = 1
  has_nextpre: boolean = true
  has_previouspre: boolean = true
  autocompletePremisenameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletepremise &&
        this.autocompleteTrigger &&
        this.matAutocompletepremise.panel
      ) {
        fromEvent(this.matAutocompletepremise.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletepremise.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletepremise.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletepremise.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletepremise.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpre === true) {
                this.sgservice.getpremises(this.premisesArray, this.PremiseContactInput.nativeElement.value, this.currentpagepre + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.primeslist = this.primeslist.concat(datas);
                    if (this.primeslist.length >= 0) {
                      this.has_nextpre = datapagination.has_next;
                      this.has_previouspre = datapagination.has_previous;
                      this.currentpagepre = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // vendor dropdown

  currentpageven: any = 1
  has_nextven: boolean = true
  has_previousven: boolean = true
  autocompleteVendornameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletevendor &&
        this.autocompleteTrigger &&
        this.matAutocompletevendor.panel
      ) {
        fromEvent(this.matAutocompletevendor.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletevendor.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletevendor.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletevendor.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletevendor.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextven === true) {
                this.sgservice.getvendordropdown(this.VendorContactInput.nativeElement.value, this.currentpageven + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empvendorlist = this.empvendorlist.concat(datas);
                    if (this.empvendorlist.length >= 0) {
                      this.has_nextven = datapagination.has_next;
                      this.has_previousven = datapagination.has_previous;
                      this.currentpageven = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  // approval branch
  currentpageappbranch: any = 1
  has_nextappbranch: boolean = true
  has_previousappbranch: boolean = true
  autocompleteapprovalBranchScroll() {

    setTimeout(() => {
      if (
        this.matAutocompleteappbranch &&
        this.autocompleteTrigger &&
        this.matAutocompleteappbranch.panel
      ) {
        fromEvent(this.matAutocompleteappbranch.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteappbranch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteappbranch.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteappbranch.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteappbranch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextappbranch === true) {
                this.sgservice.getBranchLoadMore(this.appBranchInput.nativeElement.value, this.currentpageappbranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.appBranchList = this.appBranchList.concat(datas);
                    if (this.appBranchList.length >= 0) {
                      this.has_nextappbranch = datapagination.has_next;
                      this.has_previousappbranch = datapagination.has_previous;
                      this.currentpageappbranch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // Approver(employee) dropdown
  currentpageaddpay: any = 1
  has_nextaddpay: boolean = true
  has_previousaddpay: boolean = true
  autocompleteapprovernameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompleteapprover &&
        this.autocompleteTrigger &&
        this.matAutocompleteapprover.panel
      ) {
        fromEvent(this.matAutocompleteapprover.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteapprover.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteapprover.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteapprover.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteapprover.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextaddpay === true) {
                this.sgservice.appBranchBasedEmployee(this.appBranch_Id, this.ApproverContactInput.nativeElement.value, this.currentpageaddpay + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
                      this.has_nextaddpay = datapagination.has_next;
                      this.has_previousaddpay = datapagination.has_previous;
                      this.currentpageaddpay = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  total_count(emp_id) {
    let arrof_attendacce_count = this.data[0].attendance_count;
    for (let i = 0; i < arrof_attendacce_count.length; i++) {
      if (arrof_attendacce_count[i].id == emp_id) {
        return arrof_attendacce_count[i]?.present;
      }
    }
    return '0'

  }

  value_check_emp_salary() {
    if (this.data[0]?.approval_data?.approval_status?.id == undefined || this.data[0]?.approval_data?.approval_status?.id == 1) {
      return false
    }
    else if (this.data[0]?.approval_data?.approval_status?.id != 1) {
      return true
    }
  }



  movetoapproveUpdate() {

    if (this.movetochekerform.value.approval_branch.id === undefined || this.movetochekerform.value.approval_branch === "") {
      this.toastr.warning('', 'Select Any one Approval Branch', { timeOut: 1000 });
      return false
    }
    if (this.movetochekerform.value.approver.id === undefined || this.movetochekerform.value.approver === "") {
      this.toastr.warning('', 'Select Any one the Approver', { timeOut: 1000 });
      return false
    }
    // this.movetochekerform.patchValue({
    //   status:2,
    //   // approver:this.movetochekerform.value.approver.id,
    //   // approval_branch:this.movetochekerform.value.approval_branch.id,

    // })
    // this.movetochekerform.value.approver = this.movetochekerform.value.approver.id,
    // this.movetochekerform.value.approval_branch = this.movetochekerform.value.approval_branch.id,
    let dataToUpdate = {
      "id": this.IDForApproverUpdate,
      "approver": this.movetochekerform.value.approver.id,
      "approval_branch": this.movetochekerform.value.approval_branch.id,
    }


    console.log("move to app", this.movetochekerform.value)
    this.sgservice.updateApproverInAttendence(dataToUpdate)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Updated!...")
          this.Datelistfind(this.isAttendance.value)
          this.movetochekerform.reset("")


          // this.makerchecker.nativeElement.click();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })


  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





























}
// {
// incidents_data": {
//   "present_armemp": 2,
//   "nonuniform_armemp": 0,
//   "sleep_armemp": 1,
//   "alcoholic_armemp": 1,
//   "ot_armemp": 0,
//   "unplanleave_armemp": 0,
//   "present_unarmemp": 0,
//   "nonuniform_unarmemp": 0,
//   "sleep_unarmemp": 0,
//   "alcoholic_unarmemp": 0,
//   "ot_unarmemp": 0,
//   "unplanleave_unarmemp": 0
// },
// "penalty_data": {
//   "nonuniform": {
//       "penalty": "Nonuniform",
//       "amount": 100,
//       "id": 1,
//       "shift": null
//   },
//   "sleep": {
//       "penalty": "Sleeping",
//       "amount": 100,
//       "id": 2,
//       "shift": null
//   },
//   "alcoholic": {
//       "penalty": "Alcoholic",
//       "amount": 100,
//       "id": 3,
//       "shift": null
//   },
//   "unplanleave": {
//       "penalty": "Unplanned leave",
//       "amount": null,
//       "id": 4,
//       "shift": 2
//   },
//   "armed_wages": 542.2307692307693,
//   "unarmed_wages": 542.2307692307693,
//   "ot_armed": 67.77884615384616,
//   "ot_unarmed": 67.77884615384616
// },
// "amount_data": {
//   "present_armemp": 1084.4615384615386,
//   "nonuniform_armemp": 0,
//   "sleep_armemp": 100,
//   "alcoholic_armemp": 100,
//   "ot_armemp": 0.0,
//   "unplanleave_armemp": 0,
//   "present_unarmemp": 0.0,
//   "nonuniform_unarmemp": 0,
//   "sleep_unarmemp": 0,
//   "alcoholic_unarmemp": 0,
//   "ot_unarmemp": 0.0,
//   "unplanleave_unarmemp": 0
// }
// }
// export class pagination{
//   has_next:boolean
//   has_previous:boolean
//   value:number
//   index:number
// }

class createattdance {
  branch_id: any
  premise_id: any
  agency_id: any
  employee: any

  date: any
}

class monthlydraft {
  premise_id: any
  branch_id: any
  vendor_id: any
  month: any
  year: any
}