import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, FormControlName } from '@angular/forms';
import { SharedService } from '../../service/shared.service';
import { EcfapService } from '../ecfap.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { NotificationService } from '../notification.service';
import { ShareService } from '../share.service';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EcfService } from 'src/app/ECF/ecf.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/inward/inward.service';
import { PageEvent } from '@angular/material/paginator'
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { Idle } from '@ng-idle/core';
import { style } from '@angular/animations/animations';


export interface approverListss {
  id: string;
  name: string;
  limit: number;
}

export interface supplierss {
  id: string;
  name: string;
}

export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}
export interface supplierListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}
export interface channelListss {
  id: any;
  name: string;
}
export interface courierListss {
  id: any;
  name: string;
}
export interface raiserlists {
  id: string;
  full_name: string;
  name: string
}

export interface SupplierName {
  id: number;
  name: string;
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
  selector: 'app-ap',
  templateUrl: './ap.component.html',
  styleUrls: ['./ap.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ApComponent implements OnInit {
  SummaryApiviewfailedObjNew: any;
  inward_frtodate: any
  searchvar: any = "string";
  CommonCrno: any;
  today=new Date()
  @ViewChild("navTabs", { static: false }) navTabs: ElementRef;
  ecfmodelurl = environment.apiURL
  inwardUrl = environment.apiURL
  choose_supplier_field: any = {
    label: "Choose Supplier",
    method: "get",
    url: this.ecfmodelurl + "venserv/search_suppliername_ecf",
    params: "&sup_id=&name=",
    searchkey: "name",
    displaykey: "name",
    wholedata: true,
    required: true,
    formcontrolname: "name",
    id: "ap-0500"
  };
  templatebutton: any;
  frtodate: any;
  inwardsearch: any;
  SummaryApiinwardObjNew: any;
  Channels = [
    { id: "1", name: "Courier" },
    { id: "2", name: "HandDelivery" },
    { id: "3", name: "Post" }
  ];
  reports = [
    { id: "1", text: "APPROVED BY ME" },
    { id: "2", text: "ALL" },
    { id: "3", text: "BOUNCED BY ME" },
    { id: "4", text: "RE AUDIT BY ME" },
  ];
  // ap_reports = [
  //   { id: "1", text: "SUBMITED BY ME" },
  //   { id: "2", text: "APPROVED BY ME" },
  //   { id: "3", text: "REJECTED BY ME" },
  //   { id: "4", text: "RE_PROCCESSED_BY_ME" },
  //   { id: "5", text: "ALL" },
  //   { id: "6", text: "BOUNCED BY ME" },
  //   { id: "7", text: "RE AUDIT BY ME" },
  // ];
  pays_list = [
    { value: "E", text: "EMPLOYEE" },
    { value: "S", text: "SUPPLIER" }
  ];
  audits_list = [
    { id: "2", text: "NON PO" },
    { id: "3", text: "EMP REIMB" },
    { id: "4", text: "ADVANCE" },
    { id: "5", text: "TCF" },
    { id: "6", text: "CRN" },
    { id: "7", text: "TAF" },
    { id: "8", text: "DTPC" },
    { id: "9", text: "RENT" },
    { id: "10", text: "SGB" },
    { id: "11", text: "PETTYCASH" },
    { id: "12", text: "ICR" },
    { id: "13", text: "BRE" },
    { id: "14", text: "LOF" },
    { id: "15", text: "PVF" },
  ]
  ecfabs: any;
  ecf_field: any = {
    label: "ECF Type",
    required: true,
  }
  choose_supplier_field_1: any = {
    label: "Choose Supplier",
    searchkey: "name",
    displaykey: "name",
    wholedata: true,
    required: true,
    formcontrolname: "name",
    id: "ap-0501"
  };
  restfiled: any = [];
  SummarycommonDatarestfiled: any = [];
  SummarymakerFilesrestfiled: any = [];
  SummaryrejectFilesrestfiled: any = [];
  SummaryfailedDatarestfiled: any = [];
  @ViewChild('fileInput', { static: false }) InputVars: ElementRef;
  sub_module_url: any
  AP_Sub_Menu_List: any
  ecfsummary: any;
  ecfsummaryPath: any;
  apapprovalPath: any;
  preparePaymentPath: any;
  bounceSummaryPath: any;
  paymentfilepath: any
  paymentfilesummary: any;
  paymentfileForm: any
  commonSummaryPath: any
  ecfapprovalsummarypath: any;
  apmakersummarypath: any
  bouncesummarypath: any
  rejectsummarypath: any;
  failedTranspath: any;
  advanceSummarypath: any;
  apInwardpath: any;
  apReportSummarypath: any;
  paymentAdviceSummarypath: any;
  paymentqueSummarypath: any;
  schedualerpath: any
  schedularform: boolean;
  aptype_id: any

  ecfsummaryForm: boolean;
  ecfcreateForm: boolean;
  ecfviewForm: boolean;
  batchviewForm: boolean;
  InvoiceDetailForm: boolean;
  APApprovalForm: boolean;
  APApprovalForms: boolean;
  preparePaymentForm: boolean;
  PreparepaymentForms: boolean;
  BounceSummaryForm: boolean;
  BounceDetailForm: boolean;
  CommonSummaryForm: boolean;
  InvoiceDetailsForm: boolean;
  InvoiceDetailApprovalForm: boolean;
  InvoiceDetailViewForm: boolean;
  commonInvViewForm: boolean;
  ecfapprovalsummaryForm: boolean;
  ecfapprovalviewForm: boolean;
  AppInvoiceDetailViewForm: boolean;
  APmakerForm: boolean;
  APECFmakeForm: boolean;
  APCreateForm: boolean;
  APApproverForm: boolean;
  APBounceForm: boolean;
  APRejectForm: boolean;
  APApproverInvoiceForm: boolean;
  APFailedTransForm: boolean;
  APAdvSummaryForm: boolean;
  APInwardSummaryForm: boolean;
  APReportSummaryForm: boolean;
  count:any;
  // ecfwiseMaker : boolean = true
  // invwiseMaker : boolean
  PaymentAdviceForm: boolean;
  payment_q_summary: boolean;
  TypeList: any;
  StatusList: any;
  batchStatusList: any;
  typelist: any = [{ "id": 1, "name": "Batch Wise" }, { "id": 2, "name": "ECF Wise" }];
  apptypelist: any = [{ "id": 1, "name": "Batch Wise Approval" }, { "id": 2, "name": "ECF Wise Approval" }];
  ecfSearchForm: FormGroup;
  ecf_summary_data: any;
  has_pagenext = true;
  has_pageprevious = true;
  issummarypage: boolean = true;
  ecfpresentpage: number = 1;
  pagesizeecf = 10;
  gettotalcount: any;
  ecfradioForm: FormGroup;
  batchSearchForm: FormGroup;
  batch_summary_data: any;
  has_batchpagenext = true;
  has_batchpageprevious = true;
  isbatchsummarypage: boolean = true;
  batchpresentpage: number = 1;
  pagesizebatch = 10;
  has_apbatchpagenext = true;
  has_apbatchpageprevious = true;
  isapbatchsummarypage: boolean = true;
  apbatchpresentpage: number = 1;
  appagesizebatch = 10;
  PPSearchForm: any;
  pagesizepp = 10;
  has_pppagenext = true;
  has_pppageprevious = true;
  isppsummarypage: boolean = true;
  pppresentpage: number = 1;
  pppagesize = 10;
  batchsubmitform: any
  getbatchtotalcount: any;
  getapbatchtotalcount: any;
  batchviewlist: any
  showbatchview: boolean = false
  has_bviewpagenext = true;
  has_bviewpageprevious = true;
  isbatchviewpage: boolean = true;
  bvpresentpage: number = 1;
  pagesizebview = 10;
  ecfheaderid: any;
  @ViewChild('closebutton') closebutton;
  @ViewChild('courierclose') courierclose;
  @ViewChild('submitclosebutton') submitclosebutton;
  @ViewChild('closeview') closeview;
  @ViewChild('closetranbutton') closetranbutton;
  @ViewChild('closedpaybutton') closedpaybutton;
  ApproverForm: FormGroup;
  approverList: Array<approverListss>;
  @ViewChild('appInput') appInput: any;
  @ViewChild('approver') matappAutocomplete: MatAutocomplete;
  @ViewChild('supplierInput') supplierInput: any;
  @ViewChild('supp') matsuppAutocomplete: MatAutocomplete;
  @ViewChild('supplierInputs') supplierInputs: any;
  @ViewChild('supps') matsuppsAutocomplete: MatAutocomplete;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closedbuttonss') closedbuttonss;
  @ViewChild('closeRptDwnld') closeRptDwnld;
  @ViewChild('failedclosedbutton')failedclosedbutton;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @Output() onCancel = new EventEmitter<any>();
  @ViewChild('manualModal') manualModal: ElementRef
  isLoading = false;
  currentpageapp: any = 1
  has_nextapp: boolean = true
  has_previousapp: boolean = true
  createdbyid: any;
  formbuilder: FormBuilder
  bounceForm: FormGroup
  showbounceSummary = false
  showbounceView = true
  bounceSummary: any;
  has_bounceviewpagenext = true;
  has_bounceviewpageprevious = true;
  isbounceviewpage: boolean = true;
  bouncepresentpage: number = 1;
  pagesizebounceview = 10;
  @ViewChild('closedbutton') closedbutton;
  @ViewChild('closebuttons') closebuttons;
  @ViewChild('closeErrView') closeErrView;
  @ViewChild('closeCommonentry') closeCommonentry;
  @ViewChild('navTabsWrapper', { static: false }) navTabsWrapper!: ElementRef;
  todate = new Date();
  audittype: any;
  PFSearchForm: any;
  has_pfpagenext = true;
  has_pfpageprevious = true;
  ispfsummarypage: boolean = true;
  pfpresentpage: number = 1;
  pfpagesize = 10;
  isInwno: boolean = false;
  PaymentFileForm: any;
  supplierList: any
  currentpagesupp: any = 1
  has_nextsupp: boolean = true
  has_previoussupp: boolean = true
  ppsupplierList: any
  currentpageppsupp: any = 1
  has_nextppsupp: boolean = true
  has_previousppsupp: boolean = true
  SubmitPreparepayForm: FormGroup;

  @ViewChild('matraiserAutocomplete') matraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserbrInput') raiserbrInput: any;
    @ViewChild('matsupplierAutocomplete') matsupplierAutocomplete: MatAutocomplete;
    @ViewChild('supplierbrInput') supplierbrInput: any;
  commonForm: FormGroup
  commonSummary: any
  searchData: any = {}
  commonpresentpage: number = 1;

  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  Branchlist: Array<branchListss>;
  ecfStatusList: any;

  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]

  frmInvHdr: FormGroup;
  invoiceheaderdetailForm: FormGroup
  InvoiceDetailForms: FormGroup
  creditdetForm: FormGroup
  CreaditDetailForm: FormGroup
  DebitDetailForm: FormGroup
  ccbsForm: FormGroup
  apinvHeader_id = this.shareservice.invheaderid.value;
  crno = this.shareservice.crno.value;
  showinvoicediv = true
  showdebitdiv = false
  headerdata: any=[]
  invtotamount: any
  Roundoffamount: any;
  OtherAmount: any
  taxableamt: any
  invDetailList: any;
  invDebitList: any;
  invDebitTot: number;
  invCreditList: any;
  invCreditTot: number;
  getgstapplicable: any
  gstAppl: boolean
  changeHistPaytoid: any
  INVsum: any
  INVamt: any
  totalamount: any
  cdtsum: any
  debitsum: any
  payList: any

  frmLiq: FormGroup
  @ViewChild('matbranchAutocomplete') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  tranrecords: any;
  ecf_approval_data: any;
  batch_approval_data: any;
  ecfapprovalform: FormGroup;
  batchapprovalform: FormGroup;
  approveTypeForm: FormGroup;

  has_apppagenext = true;
  has_apppageprevious = true;
  isappsummarypage: boolean = true;
  ecfapppresentpage: number = 1;
  pagesizeappecf = 10;
  getapptotalcount: any;

  has_appbatchpagenext = true;
  has_appbatchpageprevious = true;
  isbatchappsummarypage: boolean = true;
  batchapppresentpage: number = 1;
  pagesizeappbatch = 10;
  getbatchapptotalcount: any;
  apsummaryform: FormGroup;
  apinvsummaryform: FormGroup;
  apecfsummaryform: FormGroup;
  apECFapproverSearchForm: FormGroup
  apapprovalsummaryform: FormGroup
  apInvapprovalsummaryform: FormGroup
  APapprovesubmitform: FormGroup
  yesnolist: any
  apbounceform: FormGroup
  aprejectform: FormGroup
  apfailedTransform: FormGroup
  apAdvSummaryform: FormGroup
  paymentAdviceForm: FormGroup
  viewPaymentDetForm: FormGroup
  isChecked: boolean = true
  cli: boolean = false;
  entryerror: any = ""
  FailedInitStat: any = []
  rejectmodeList: any = []
  rejectStat: any = ""
  remark: any;
  rem = new FormControl('', Validators.required);
  purpose = new FormControl('');
  InwardsummarySearchForm: FormGroup
  ChannelList: any
  CourierList: any
  submit_btn: number;
  popup_heading: string;
  @ViewChild('Channel') matChannelAutocomplete: MatAutocomplete;
  @ViewChild('channelInput') channelInput: any;

  @ViewChild('Courier') matCourierAutocomplete: MatAutocomplete;
  @ViewChild('CourierInput') CourierInput: any;
  @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  @ViewChild('raisertyperole') matempraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any;


  @ViewChild('courierInput') courierInput: any;
  Raiserlist: any
  has_nextemp = true;
  has_previousemp = true;
  currentpageemp: number = 1;
  frmFailedChg: FormGroup
  rejectChgStatForm: FormGroup
  dispatchviewForm: FormGroup
  AuditChecklistSummaryForm: FormGroup;
  auditchklistAddForm: FormGroup
  AuditChecklistSummary: boolean
  frmRptDownld: FormGroup
  APReportSummaryPath: boolean
  frmAPReportSummary: FormGroup;

  SelectSupplierForm: FormGroup
  supplierNameData: any;
  suplist: any
  selectsupplierlist: any;
  supplierdata: any
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  submitbutton = false;
  paymentAdvSummary: any;
  SupplierDetailForm: FormGroup
  @ViewChild('supclosebuttons') supclosebuttons;
  @ViewChild('cboxSummary') summaryBoxComponent: any;
  reportList: any;
  SummaryApiapprovalObjNew: any;
  approvalbutton: any;
  supplierlists: any;
  suppliersearchs: any;
  supplierdatass: any;
  SummaryApicommonObjNew: any;
  SummaryApiviewentryObjNew: any;
  apunlock: any;
  commonbutton: any;
  SummaryApiadvancedObjNew: any;
  auditbutton: any;
  SummaryApiauditObjNew: any;
  searchecftype: any;
  makerdroptype: any = {};
  makerstatusdroptype: any = {};
  statusdroptype: any = { label: "Reports Status" };
  rep_status: any = { label: "Reports Status" };
  report_status: any = { label: "Reports Status" };
  attachedFiles_value: any;
  rejmode_list: any;
  couriers_list: any;
  auditsearch: any;
  ecf_type_id: any;
  cover_note_id: any;
  pageIndexInward: number = 0;
  failed_field: any = { label: "Change Status To" }
  commonstatusdroptype: any = { label: "Reports Status" };
  commoninvoicestatusdroptype: any = { label: "Invoice Status" };
  maker_type: any;
  maker_frtodate: any;
  ap_type: any;
  bounce_type: any = { label: "Invoice Status" };
  bounce_frtodate: any
  ap_frtodate: any;
  failedbutton: any;
  filterbutton: any;
  SummaryApipaymentObjNew: any;
  paybutton: any;
  common_Raise_branch: any
  common_raise_emp: any
  isecftyact: any;
  issupact: any;
  israiact: any;
  israibract: any;
  isinvnoact: any;
  isinamtac: any;
  isinvstsact: any;
  isinvdateact: any;
  SummaryApiaprepObjNew:any;
  modify:any;
  supplierlist: Array<supplierListss>;
  constructor(private sharedService: SharedService, private ecfservice: EcfapService, private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService, private fb: FormBuilder, private notification: NotificationService, private shareservice: ShareService,
    private activatedroute: ActivatedRoute, private datePipe: DatePipe, private router: Router, private ecfservices: EcfService,
    private toastr: ToastrService, private dataService: DataService, private inwshareservice: ShareService, private renderer: Renderer2, private el: ElementRef,
    private idle: Idle) {
    // this.SummaryApiinwardObjNew = {
    //   "method": "post",
    //   "url": this.ecfmodelurl + "inwdserv/apinward_summarysearch",
    //   body: {},OverallCount: "Total Count"
    // }
    this.templatebutton = [
      {
        icon: "filter_list", "tooltip": "Show More",
        function: this.approval_filter.bind(this)
      },
      {
        icon: "download", "tooltip": "Report Download",
        function: this.downloadFileXLSX.bind(this),
      },
      { icon: "add", "tooltip": "Add Inward", function: this.inwardRoute.bind(this) }
    ]
    this.inwardsearch = [
      { "type": "input", "label": "Inward No", "formvalue": "inward_no" },
      { "type": "dropdown", inputobj: this.couriertype, "formvalue": "courier_id" },
      { type: "dropdown", inputobj: this.channeldropdown, formvalue: "channel_id" },

      // {
      //   type: "twodates",
      //   fromobj: { label: "From Date", formvalue: "fromdate" },
      //   toobj: { label: "To Date", formvalue: "todate" },
      // },
      // { "type": "dropdown", inputobj: this.raisers_name, "formvalue": "created_by" },
      // { "type": "input", "label": "AWB NO", "formvalue": "awb_no" },
    ]
    // this.SummaryApiapprovalObjNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
    //   params: "&summary_type=approver_summary",
    //   data: {},OverallCount: "Total Count"
    // }
    this.failedbutton = [
      {
        icon: "filter_list", "tooltip": "Show More",
        function: this.failed_filter.bind(this)
      },
    ]
    this.filterbutton = [
      {
        icon: "filter_list", "tooltip": "Show More",
        function: this.reject_filter.bind(this)
      }
    ]
    this.approvalbutton = [
      {
        icon: "filter_list", "tooltip": "Show More",
        function: this.ap_filter.bind(this)
      },
      {
        icon: "download", "tooltip": "Report Download",
        function: this.approverRptDwnld.bind(this),
      },
      { icon: "arrow_upward", "tooltip": "Select Supplier", function: this.getsupplierpopup.bind(this) },
    ]
    // this.SummaryApicommonObjNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
    //   params: "&apflag=1",
    //   data: {},OverallCount: "Total Count"
    // }
    // this.SummaryApiviewentryObjNew = {
    //   method: "get",
    //   url: this.ecfmodelurl + "entryserv/fetch_commonentrydetails/" + this.CommonTransCrno,
    //   params: "",
    // };
    this.SummaryApiviewfailedObjNew = {
      method: "get",
      url: this.ecfmodelurl + "entryserv/fetch_commonentrydetails/" + this.failedTransCrno,
      params: "",
    };
    this.commonbutton = [
      {
        icon: "filter_list", "tooltip": "Show More",
        function: this.common_filter.bind(this)
      },
      {
        icon: "download", "tooltip": "Report Download",
        function: this.commonRptDwnld.bind(this),
      },
      { icon: "arrow_upward", "tooltip": "Select Supplier", function: this.getsupplierpopup.bind(this) },
    ]
    // this.SummaryApiadvancedObjNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/advance_summary",
    //   params: "",
    //   data: {},OverallCount: "Total Count"
    // }
    this.auditbutton = [
      { icon: "add", "tooltip": "Add", function: this.addclick.bind(this) }
    ]
    // this.SummaryApiauditObjNew = {
    //   method: "get",
    //   url: this.ecfmodelurl + "ecfapserv/get_ecfauditchecklist/" + this.searchecftype,
    //   params: "",
    // };
    this.auditsearch = [
      { "type": "dropdown", inputobj: this.audittype, "formvalue": "ecftype" },
    ]

    this.SummaryApipaymentObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/inv_pymtfile",
      params: "",
      data: {}
    }
    this.paybutton = [
      {
        icon: "filter_list", "tooltip": "Show More",
        function: this.payment_filter.bind(this)
      },
      { icon: "arrow_upward", "tooltip": "Select Supplier", function: this.getsupplierpopup.bind(this) },]
 
      // this.SummaryApiaprepObjNew = {
      //   method: "post",
      //   "url": this.ecfmodelurl + "ecfapserv/apreportfile_summary",
      //   params: "",
      //   data: {}
      // }
    }

  ngOnInit(): void {
    this.ecfSearchForm = this.fb.group({
      crno: [''],
      aptype: [''],
      apstatus: [''],
      minamt: [''],
      maxamt: [''],

    })

    this.batchSearchForm = this.fb.group({
      batchno: [''],
      fromdate: [''],
      todate: [''],
      batchcount: [''],
      batchstatus: ['']
    })

    this.ecfapprovalform = this.fb.group({
      crno: [''],
      aptype: [''],
      apstatus: [''],
      minamt: [''],
      maxamt: ['']
    })
    this.batchapprovalform = this.fb.group({
      batchno: [''],
      fromdate: [''],
      todate: [''],
      batchcount: [''],
      batchstatus: ['']
    })

    this.apbatchSearchForm = this.fb.group({
      batchno: [''],
      fromdate: [''],
      todate: [''],
      batchcount: ['']
    })

    this.approveTypeForm = this.fb.group({
      type: [1]
    })

    this.PPSearchForm = this.fb.group({
      supplier_id: [''],
      crno: [],
      apinvoiceheader_crno: [],
      ecftype: [],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [],
      invoice_amount: [],

    })

    this.PFSearchForm = this.fb.group({
      supplier_id: [''],
      apinvoiceheader_crno: [''],
      ecftype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [],
      invoice_amount: [],
    })

    this.bounceForm = this.fb.group({
      crno: [''],
      aptype: [''],
      minamt: [''],
      maxamt: [''],
      raiser_name: [''],
      branch_id: [''],
      invoice_no: [''],
      invoice_amount1: [''],
    })

    this.PaymentFileForm = this.fb.group({
      callbackrefno: [''],
      pvno: ['']
    })

    this.SubmitPreparepayForm = this.fb.group({
      remarks: [''],
    })

    this.ecfradioForm = this.fb.group({
      type: [2]
    })

    this.apECFSearchForm = this.fb.group({
      crno: [''],
      aptype: [''],
      apstatus: [''],
      minamt: [''],
      maxamt: [''],

    })
    this.apECFapproverSearchForm = this.fb.group({
      crno: [''],
      aptype: [''],
      apstatus: [''],
      minamt: [''],
      maxamt: [''],

    })
    this.frmLiq = this.fb.group({
      advno: [''],
      supplier: [''],
      amount: ['']

    })

    this.apecfsummaryform = this.fb.group({
      type: true,
      crno: [''],
      aptype: [''],
      minamt: [''],
      maxamt: ['']
    })

    this.APapprovesubmitform = this.fb.group({
      id: [''],
      apinvoiceheaderstatus: [''],
      remarks: ['', Validators.required]
    })
    this.ap_inward_sub_module_name = this.shareservice.submodule_name.value
    if(this.ap_inward_sub_module_name === 'AP Inward'){
      this.getInwardsummary('',"AP Inward",1)
    }

    this.InwardsummarySearchForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      channel_id: [''],
      courier_id: [''],
      awb_no: [''],
      inward_no: '',
      docnumber: '',
      created_by: [''],
    })
    this.modify = this.shareservice.apmodification.value
    this.inward_frtodate = {
      fromobj: { label: 'From Date', "formcontrolname": "fromdate" },
      toobj: { label: 'To Date', "formcontrolname": "todate" },
    };
    this.frmFailedChg = this.fb.group({
      TransChangeStat: [''],
      cbsrefno: [''],
      remarks: [''],
      crno: ['']
    })
    this.failed_field = {
      label: "Change Status To",
      params: "",
      searchkey: "query",
      displaykey: "text",
      wholedata: true,
      valuekey: "id",
      fronentdata: true,
      required: true,
      formcontrolname: "TransChangeStat",
      data: this.FailedInitStat,
      id: "ap-0437"
    };
    this.rejectChgStatForm = this.fb.group({
      mode: [''],
      courier: [''],
      date: [''],
      awbno: [''],
      name: [''],
      address: [''],
      state: [''],
      district: [''],
      city: [''],
      pincode: [''],
      remarks: [''],
    })

    this.rejmode_list = {
      label: "Mode",
      searchkey: "query",
      url: this.ecfmodelurl + "ecfapserv/apdispatch",
      params: "&dropdown=true",
      formcontrolname: 'mode',
      displaykey: "text",
      Outputkey: "id",
      valuekey: "id",
      id: "ap-0199",
      required: true
    }
    this.couriers_list = {
      label: "Courier",
      searchkey: "query",
      url: this.ecfmodelurl + "mstserv/courier_search",
      params: "",
      formcontrolname: 'courier',
      displaykey: "name",
      wholedata:true,
      // valuekey: "id",
      id: "ap-0201",
      required: true
    }

    this.dispatchviewForm = this.fb.group({
      mode: [''],
      courier: [''],
      date: [''],
      awbno: [''],
      name: [''],
      address: [''],
      state: [''],
      district: [''],
      city: [''],
      pincode: [''],
      remarks: [''],
    })

    this.AuditChecklistSummaryForm = this.fb.group({
      ecftype: [''],
    })

    this.auditchklistAddForm = this.fb.group({
      ecftype: [''],
      group: [''],
      question: [''],
      solution: [''],
    })
    this.ecf_field = {
      label: "ECF Type",
      fronentdata: true,
      data: this.audittypelist,
      displaykey: "text",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "ecftype",
      id: "ap-0476",
      required: true,
    }

    this.frmRptDownld = this.fb.group({
      from_date: [''],
      to_date: [''],
      apinvoiceheaderstatus_id: [''],
    })


    this.frmAPReportSummary = this.fb.group({
      aptype: [''],
      report_type: [''],
      supplier_id: [''],
      branch: [''],
      raiserbranch: [''],
      apinvoiceheaderstatus_id: [''],
      raisedby: [''],
      from_date: [''],
      to_date: [''],
    })

    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']
    })
    this.SupplierDetailForm = this.fb.group({
      invoiceno: [''],
      invoicedate: [''],
      supplier_name: [''],
      suppliergst: [''],
      pincode: [''],
      address: ['']
    })


    this.InwardsummarySearchForm.get('courier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getCourierFKdd(this.CourierInput.nativeElement.value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    this.getChannelFK();
    this.getCourierFK();
    this.id_get();
    // this.ecfservice.getDispatchMode()
    //   .subscribe(result => {
    //     this.rejectmodeList = result.data
    //   })

    // this.activatedroute.queryParams.subscribe(
    //   params => {
    //     if (params) {
    //       if (params.comefrom == "batchview") {
    //         this.ecfsummaryForm = true
    //         this.ecfcreateForm = false
    //         this.ecfviewForm = false
    //         this.batchviewForm = false
    //         this.commonInvViewForm = false
    //         this.APApprovalForm = false
    //         this.APApprovalForms = false;
    //         this.preparePaymentForm = false
    //         this.PreparepaymentForms = false;
    //         this.paymentfileForm = false;
    //         this.BounceSummaryForm = false
    //         this.BounceDetailForm = false
    //         this.CommonSummaryForm = false;
    //         this.ecfapprovalsummaryForm = false
    //         this.ecfapprovalviewForm = false
    //         this.AppInvoiceDetailViewForm = false
    //         this.APmakerForm = false
    //         this.APECFmakeForm = false
    //         this.APCreateForm = false
    //         this.APApproverForm = false
    //         this.APReportSummaryForm = false
    //         this.ecfradioForm.patchValue(
    //           {
    //             type: 1,
    //           })
    //         this.getradio(this.typelist[0]);
    //       }
    //       else if (params.comefrom == "invoicedetail") {
    //         this.ecfsummaryForm = true
    //         this.ecfcreateForm = false
    //         this.ecfviewForm = false
    //         this.batchviewForm = false
    //         this.commonInvViewForm = false
    //         this.APApprovalForm = false
    //         this.APApprovalForms = false;
    //         this.preparePaymentForm = false
    //         this.PreparepaymentForms = false;
    //         this.paymentfileForm = false;
    //         this.BounceSummaryForm = false
    //         this.BounceDetailForm = false
    //         this.CommonSummaryForm = false
    //         this.ecfapprovalsummaryForm = false
    //         this.ecfapprovalviewForm = false
    //         this.AppInvoiceDetailViewForm = false
    //         this.APmakerForm = false
    //         this.APECFmakeForm = false
    //         this.APCreateForm = false
    //         this.APApproverForm = false
    //         this.APReportSummaryForm = false

    //         this.ecfradioForm.patchValue(
    //           {
    //             type: 2,
    //           })
    //         this.getradio(this.typelist[1]);
    //       }
    //       else if (params.comefrom == "invoicedetailview") {
    //         this.ecfviewForm = true
    //       }
    //       this.summarysearch(1);
    //       this.batchsummarysearch(1);
    //     }
    //     else if (params.comefrom == "common") {
    //       this.ecfsummaryForm = true
    //       this.ecfcreateForm = false
    //       this.ecfviewForm = false
    //       this.batchviewForm = false
    //       this.commonInvViewForm = false
    //       this.APApprovalForm = false
    //       this.APApprovalForms = false;
    //       this.preparePaymentForm = false
    //       this.PreparepaymentForms = false;
    //       this.paymentfileForm = false;
    //       this.BounceSummaryForm = false
    //       this.BounceDetailForm = false
    //       this.CommonSummaryForm = false
    //       this.ecfapprovalsummaryForm = false
    //       this.ecfapprovalviewForm = false
    //       this.AppInvoiceDetailViewForm = false
    //       this.APmakerForm = false
    //       this.APECFmakeForm = false
    //       this.APCreateForm = false
    //       this.APApproverForm = false
    //       this.APReportSummaryForm = false

    //       this.commonSummarySearch('', 1)
    //     }

    //     let comefrom = this.shareservice.comefrom.value
    //     if (comefrom == "bounce") {
    //       this.ecfsummaryForm = false
    //       this.ecfcreateForm = false
    //       this.ecfviewForm = false
    //       this.batchviewForm = false
    //       this.commonInvViewForm = false
    //       this.APApprovalForm = false
    //       this.APApprovalForms = false;
    //       this.preparePaymentForm = false
    //       this.PreparepaymentForms = false;
    //       this.paymentfileForm = false;
    //       this.BounceSummaryForm = false;
    //       this.BounceDetailForm = false
    //       this.CommonSummaryForm = true
    //       this.ecfapprovalsummaryForm = false
    //       this.ecfapprovalviewForm = false
    //       this.AppInvoiceDetailViewForm = false
    //       this.APmakerForm = false
    //       this.APECFmakeForm = false
    //       this.APCreateForm = false
    //       this.APApproverForm = false
    //       this.APReportSummaryForm = false
    //       // this.bounceSummarySearch(1)
    //       this.dataclear('')
    //       this.overallreset()
    //       this.rptFormat = 4
    //       this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 22 || x.id == 23 || x.id == 37)
    //     }

    //     if (params.comefrom == "batchappview") {
    //       this.ecfsummaryForm = false
    //       this.ecfcreateForm = false
    //       this.ecfviewForm = false
    //       this.batchviewForm = false
    //       this.commonInvViewForm = false
    //       this.APApprovalForm = false
    //       this.APApprovalForms = false;
    //       this.preparePaymentForm = false
    //       this.PreparepaymentForms = false;
    //       this.paymentfileForm = false;
    //       this.BounceSummaryForm = false
    //       this.BounceDetailForm = false
    //       this.CommonSummaryForm = false;
    //       this.ecfapprovalsummaryForm = true
    //       this.ecfapprovalviewForm = false
    //       this.AppInvoiceDetailViewForm = false
    //       this.APmakerForm = false
    //       this.APECFmakeForm = false
    //       this.APCreateForm = false
    //       this.APApproverForm = false
    //       this.APReportSummaryForm = false

    //       this.ecfradioForm.patchValue(
    //         {
    //           type: 1,
    //         })
    //       this.getradio(this.apptypelist[0]);
    //       this.ecfapprovalsummarysearch(1)
    //       this.batchappsummarysearch(1)

    //     }
    //   })
    const getToken = localStorage.getItem("sessionData")
    let tokendata = JSON.parse(getToken)

    this.createdbyid = tokendata.employee_id
    let datas = this.sharedService.menuUrlData;


    datas?.forEach((element) => {
      let subModule = element.submodule;

      if (element.name === "Accounts Payable") {
        this.AP_Sub_Menu_List = subModule;
        console.log("AP_Sub_Menu_List", this.AP_Sub_Menu_List)
        if (this.AP_Sub_Menu_List?.length > 0) {
          this.AP_Sub_Menu_List.forEach(sub => sub.active = false);

          const defaultTab = this.AP_Sub_Menu_List.find(sub => sub.name === 'AP Inward');
          if (defaultTab) {
            defaultTab.active = true;

          }
          console.log("defaultTab", defaultTab)
          let sub_name = defaultTab?.name
          console.log("sub_name", sub_name)
          this.APInwardSummaryForm = true
          this.getInwardsummary('',sub_name,1)
        }
      }
    });
    this.ecfSearchForm = this.fb.group({
      crno: [''],
      aptype: [''],
      apstatus: [''],
      minamt: [''],
      maxamt: [''],

    })

    this.batchSearchForm = this.fb.group({
      batchno: [''],
      fromdate: [''],
      todate: [''],
      batchcount: [''],
      batchstatus: ['']
    })

    this.ecfradioForm = this.fb.group({
      type: [2]
    })

    this.ApproverForm = this.fb.group({
      approvedby: [''],
      approvedbranch: ['']
    })

    this.apsummaryform = this.fb.group({
      crno: [''],
      batch_no: [''],
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [''],
      invoice_amount: [''],
      minamt: [''],
      maxamt: [''],
      is_originalinvoice: ['']
    })
    this.apinvsummaryform = this.fb.group({
      type: false,
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [''],
      invoice_amount: [''],
      supplier_id: [''],
      from_date: [''],
      to_date: [''],
      apinvoiceheaderstatus_id: [''],
      invoice_status: [''],
      minamt: [''],
      maxamt: [''],
    })
    this.maker_frtodate = {
      fromobj: { label: 'From Date', "formcontrolname": "from_date" },
      toobj: { label: 'To Date', "formcontrolname": "to_date" },
    };
    this.apbounceform = this.fb.group({
      crno: [''],
      batch_no: [''],
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [''],
      invoice_amount: [''],
      minamt: [''],
      maxamt: [''],
      is_originalinvoice: [''],
      supplier_id: [''],
      from_date: [''],
      to_date: [''],
      apinvoiceheaderstatus_id: [''],
    })
    this.bounce_frtodate = {
      fromobj: { label: 'From Date', "formcontrolname": "from_date" },
      toobj: { label: 'To Date', "formcontrolname": "to_date" },
    };
    this.aprejectform = this.fb.group({
      crno: [''],
      batch_no: [''],
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [''],
      invoice_amount: [''],
      minamt: [''],
      maxamt: [''],
      is_originalinvoice: [''],
      supplier_id: [''],
      invoice_status: [''],
    })
    this.apfailedTransform = this.fb.group({
      apinvoiceheaderstatus_id: ["26"],
      crno: [''],
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [''],
      invoice_amount: [''],
      minamt: [''],
      maxamt: [''],
      is_originalinvoice: [''],
      supplier_id: [''],
      invoice_status: ['']
    })
    this.apAdvSummaryform = this.fb.group({
      payto: [''],
      raiserbranch_id: [''],
      ppxheader_fromdate: [''],
      ppxheader_todate: [''],
    })
    this.apapprovalsummaryform = this.fb.group({
      crno: [''],
      batch_no: [''],
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [''],
      invoice_amount: [''],
      minamt: [''],
      maxamt: [''],

    })

    this.apInvapprovalsummaryform = this.fb.group({
      crno: [''],
      batch_no: [''],
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [''],
      invoice_amount: [''],
      minamt: [''],
      maxamt: [''],
      supplier_id: ['',],
      from_date: [''],
      to_date: [''],
      inwfrom_date: [''],
      inwto_date: [''],
      invoice_status: [''],
      apinvoiceheaderstatus_id: [''],

    })
    this.ap_frtodate = {
      fromobj: { label: 'From Date', "formcontrolname": "from_date" },
      toobj: { label: 'To Date', "formcontrolname": "to_date" },
    };


    this.batchsubmitform = this.fb.group({
      'ecfhdr': this.fb.array([
        // this.fb.group({
        // 'id':new FormControl(''),
        // })
      ])
    })
    this.commonForm = this.fb.group({
      crno: [''],
      batch_no: [''],
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      invoice_no: [''],
      invoice_amount: [''],
      minamt: [''],
      maxamt: [''],
      supplier_id: [''],
      from_date: [''],
      to_date: [''],
      apinvoiceheaderstatus_id: [''],
      invoice_status: [''],
    })

    this.common_Raise_branch = {
      label: "Raiser Branch",
      method: "get",
      url: this.ecfmodelurl + "usrserv/search_branch",
      params: "",
      searchkey: "query",
      displaykey: "name",
      Outputkey: "id",
      // valuekey: "id",
      // formkey: "id",
      prefix: 'code',
      formcontrolname: "raiserbranch_id",
      separator: "hyphen"
      // suffix: 'limit',
    };
    this.common_raise_emp = {
      label: "Employee",
      method: "get",
      url: this.ecfmodelurl + "usrserv/memosearchemp",
      params: "",
      searchkey: "query",
      formcontrolname: "raiser_name",
      displaykey: "full_name",
      Outputkey: "id",
      // valuekey: "id",
      // formkey: "id",
    };

    this.frmInvHdr = this.fb.group({
      rsrCode: new FormControl(''),
      rsrEmp: new FormControl(''),
      gst: new FormControl(''),
      branchGST: new FormControl(''),

      supplier: new FormControl(''),
      supName: new FormControl(''),
      supGST: new FormControl(''),
      status: new FormControl(''),

      invNo: new FormControl(''),
      invDate: new FormControl(''),
      taxableAmt: new FormControl(''),
      invAmt: new FormControl(''),
      is_recur: new FormControl(0),
      service_type: new FormControl(1),
      recur_fromdate: new FormControl(""),
      recur_todate: new FormControl(''),
      pmd: new FormControl(''),
      is_pca: new FormControl(''),
      pca_no: new FormControl(''),
      is_capitalized:new FormControl(''),
      notename:new FormControl(''),

    })
    this.InvoiceDetailForms = this.fb.group({
      roundoffamt: [''],
      invoicedtls: new FormArray([
      ]),

      creditdtl: new FormArray([
      ])
    });
    this.CreaditDetailForm = this.fb.group({
      is_tds_applicable: [''],
      payment_instruction: ['']
    })
    this.DebitDetailForm = this.fb.group({
      debitdtl: new FormArray([
      ])
    });

    this.paymentAdviceForm = this.fb.group({
      start_date: [''],
      end_date: [''],
      apinvoiceheaderstatus_id: [''],
      crno: [''],
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      raiserbranch_id: [''],
      empbranch_id_list: [''],
      invoice_no: [''],
      invoice_amount: [''],
      minamt: [''],
      maxamt: [''],
    })
    this.viewPaymentDetForm = this.fb.group({
      UTR_No: [''],
      paid_amount: [''],
      paid_date: [''],
      paymode: [''],
      pvno: [''],

    })
        this.frmAPReportSummary.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;

      })
        this.frmAPReportSummary.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierlist = datas;

      })
    this.getecftype('');
    this.get_common_status();
    this.audit_get_ecftype('');
    this.getreptype();
    this.getecfstatus();
    this.getBatchstatus();
    this.getStatus();
    this.getyesno();
    this.getpaytype();
  }


  id_get() {
    console.log("----------------->", this.apinvHeader_id)
  }

  //   getradioMaker(n){
  //     if(n == 1)
  //     {
  //       this.ecfwiseMaker = true
  //       this.invwiseMaker = false
  //       this.apecfsummaryform.patchValue({'type': true})
  //       this.apecfSummarySearch(1)
  //     }
  //     else
  //     {
  //       this.ecfwiseMaker = false
  //       this.invwiseMaker = true
  //       this.apinvsummaryform.patchValue({'type': false})
  //       this.apinvSummarySearch(1)
  //     }

  // }
  audittypelist:any
    audit_get_ecftype(e) {
    this.ecfservice.audit_get_ecftype()
      .subscribe(result => {
        if (result['data'] != undefined) {
          let ecftypes = result["data"]
           this.audittypelist = ecftypes.filter(type => type.id != 6)
          this.ecf_field = {
            label: "ECF Type",
            fronentdata: true,
            data: this.audittypelist,
            displaykey: "text",
            Outputkey: "id",
            valuekey: "id",
            formcontrolname: "ecftype",
            id: "ap-0476",
            required: true,
          }
        }
    })
  }
      
  getecftype(e) {
    this.ecfservice.getecftype()
      .subscribe(result => {
        if (result['data'] != undefined) {
          let ecftypes = result["data"]
         this.TypeList = ecftypes.filter(type => type.id != 6)
         this.SummarybounceFiles 
          = [
              {
                columnname: "Invoice CR No",
                key: "apinvoiceheader_crno",
                // style: { cursor: "pointer", color: " #3684BF" },
                headicon:true,headertype:'headinput',payloadkey:'invoiceheader_crno',label:'Invoice CR No',
                function: true,
                clickfunction: this.bouncesummary.bind(this),
                clickFunction: this.bouncesummary_search.bind(this),
                validate:true,validatefunction:this.bounce_invcrno.bind(this),
              },
              { columnname: "Invoice Type", key: "aptype", type: "object", objkey: "text" ,
              headicon:true,headertype: 'headoptiondropdown',payloadkey:'aptype',
              inputobj:{
                  label: "Invoice Type",
                  displaykey: "text",
                  Outputkey: "id",
                  fronentdata: true,
                  data: ecftypes,
                  valuekey: "id",
              },clickFunction: this.bouncesummary_search.bind(this),
              // validate: true, validatefunction: this.bounce_ecfvalid.bind(this),
              },
              { columnname: "Supplier Name", key: "supplier_data", validate: true, validatefunction: this.apbounce_data.bind(this),
                headicon:true,headertype:'headdropdown',payloadkey: "supplier_id",
                inputobj:{
                  label: "Choose Supplier",
                  method: "get",
                  url: this.ecfmodelurl + "venserv/search_suppliername_ecf",
                  params: "&sup_id=&name=",
                  searchkey: "name",
                  displaykey: "name",
                  Outputkey: "id",
                  // wholedata: true,
                // required: true,
                formcontrolname: "supplier_data",
                // id: "ap-0500"
                },
                clickFunction: this.bouncesummary_search.bind(this),
              },
              { columnname: "Raiser", key: "raiser_name",
                headicon :true,headertype:'headdropdown',payloadkey:"raiser_name",
                inputobj:{
                  label: "Raiser Name",
                  method: "get",
                  url: this.ecfmodelurl + "usrserv/memosearchemp",
                  params: "",
                  searchkey: "query",
                  displaykey: "full_name",
                  Outputkey: "id",
                  formcontrolname:'raiser_name'
                },clickFunction: this.bouncesummary_search.bind(this), validate: true, validatefunction: this.bounceraiser_valid.bind(this),
              },
              {
                columnname: "Raiser Branch",
                key: "raiserbranch_branch",
                type: "object",
                objkey: "name_code",
                headicon:true,headertype:'headdropdown',payloadkey: "raiserbranch_id",
                inputobj:{
                  label: 'Raiser Branch',
                  searchkey: "query",
                  displaykey: "name",
                  url: this.ecfmodelurl + "usrserv/search_branch",
                  Outputkey: "id",
                  prefix:"code",
                  separator: "hyphen",
                  formcontrolname:'raiserbranch_branch'
                },clickFunction: this.bouncesummary_search.bind(this), validate: true, validatefunction: this.bounce_raiserbrvalid.bind(this),
              },
              {
              columnname: "Invoice Branch", key: "invoicebranch", type: "object", objkey: "name_code", "headicon": true, headertype: 'headdropdown', payloadkey: "branchdetails_id",
              inputobj: {
                label: 'Invoice Branch',
                method: 'get',
                url: this.ecfmodelurl+ '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname: "invoicebranch",
                Outputkey: "id",

              }, clickFunction: this.bouncesummary_search.bind(this),
              // validate: true, validatefunction: this.raiser_branch_data.bind(this),
            },
              { columnname: "Invoice No", key: "invoice_no",
                headicon: true, headertype: 'headinput',payloadkey: "invoice_no",label: "Invoice No",
                clickFunction: this.bouncesummary_search.bind(this),validate: true, validatefunction: this.bounce_invnovalid.bind(this)     },
              {
                columnname: "Invoice Amount",
                key: "totalamount",
                prefix: "₹",
                type: "Amount",
                headicon:true,headinput: true, headerdicon: "filter",headertype: 'minmaxAmnt',
                payloadkey_1:'minamt',payloadkey_2:'maxamt',label1:'Min Amount',label2:'Max Amount',
                clickFunction: this.bouncesummary_search.bind(this),
                style: { "display": "flex", "justify-content": "end" }
              },
              {
                columnname: "Invoice Date",
                key: "invoicedate",
                type: "Date",
                datetype: "dd-MMM-yyyy",
                headicon:true,headinput: true,headertype: 'startendDate',
                payloadkey_1:'from_date',payloadkey_2 :'to_date', label1:'Start Date',label2:'End Date',
                clickFunction: this.bouncesummary_search.bind(this)
              },
              {
                columnname: "Updated Date",
                key: "updated_date",
                type: "Date",
                datetype: "dd-MMM-yyyy",
              },
              { columnname: "Ageing", key: "ageing" },
              {
                columnname: "Invoice Status",
                key: "apinvoicehdr_status",
                type: "object",
                objkey: "text",
              },
            ];
          this.audittype = {
            // label: "ECF Type",
            // searchkey: "query",
            // displaykey: "text",
            // url: this.ecfmodelurl + "ecfapserv/get_ecftype",
            // Outputkey: "id",
            label: "Invoice Type",
            fronentdata: true,
            data: this.TypeList,
            displaykey: "text",
            Outputkey: "id",
            valuekey: "id"
          }
          this.auditsearch = [
            { "type": "dropdown", inputobj: this.audittype, "formvalue": "ecftype" },
          ]
          this.makerdroptype = {
            label: "ECF Type",
            params: "",
            searchkey: "query",
            displaykey: "text",
            Outputkey: "id",
            fronentdata: true,
            data: this.TypeList,
          };
          // this.makersearch = [
          //   {
          //     type: "input",
          //     label: "Invoice Header CR No",
          //     formvalue: "invoiceheader_crno", id: "ap-0130"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.makerdroptype,
          //     formvalue: "aptype", id: "ap-0131"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.supplierfield,
          //     formvalue: "supplier_id", id: "ap-0134"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.commonbranch,
          //     formvalue: "aptype", id: "ap-0135"
          //   },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.approverfield,
          //   //   formvalue: "raiser_name", id: "ap-0136"
          //   // },
          //   // { type: "input", label: "Invoice No", formvalue: "invoice_no", id: "ap-0137" },
          //   // {
          //   //   type: "input",
          //   //   label: "Invoice Amount",
          //   //   formvalue: "invoice_amount", id: "ap-0138"
          //   // },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.makerstatusdroptype,
          //   //   formvalue: "invoice_status", id: "ap-0141"
          //   // },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.statusdroptype,
          //   //   formvalue: "apinvoiceheaderstatus_id", id: "ap-0142"
          //   // },
          //   // {
          //   //   type: "twodates",
          //   //   fromobj: { label: "From Date", formvalue: "from_date", id: "ap-0139" },
          //   //   toobj: { label: "To Date", formvalue: "to_date", id: "ap-0140" },
          //   // },

          // ];
          // this.bouncesearch = [
          //   {
          //     type: "input",
          //     label: "Invoice Header CR No",
          //     formvalue: "invoiceheader_crno", id: "ap-0164"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.makerdroptype,
          //     formvalue: "aptype", id: "ap-0166"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.supplierfield,
          //     formvalue: "supplier_id", id: "ap-0168"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.commonbranch,
          //     formvalue: "raiserbranch_id", id: "ap-0169"
          //   },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.approverfield,
          //   //   formvalue: "raiser_name", id: "ap-0170"
          //   // },
          //   // { type: "input", label: "Invoice No", formvalue: "invoice_no", id: "ap-0173" },
          //   // {
          //   //   type: "input",
          //   //   label: "Invoice Amount",
          //   //   formvalue: "invoice_amount", id: "ap-0174"
          //   // },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.makerstatusdroptype,
          //   //   formvalue: "invoice_status", id: "ap-0177"
          //   // },
          //   // {
          //   //   type: "twodates",
          //   //   fromobj: { label: "From Date", formvalue: "from_date", id: "ap-0175" },
          //   //   toobj: { label: "To Date", formvalue: "to_date", id: "ap-0176" },
          //   // },
          // ];
          // this.rejectsearch = [{
          //   type: "input",
          //   label: "Invoice Header CR No",
          //   formvalue: "invoiceheader_crno",
          //   id: "ap-0182"
          // }, { type: "dropdown", inputobj: this.makerdroptype, formvalue: "aptype", id: "ap-0184" },
          // {
          //   type: "dropdown",
          //   inputobj: this.supplierfield,
          //   formvalue: "supplier_id", id: "ap-0186"
          // },
          // {
          //   type: "dropdown",
          //   inputobj: this.commonbranch,
          //   formvalue: "raiserbranch_id", id: "ap-0187"
          // },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.approverfield,
          //   //   formvalue: "raiser_name", id: "ap-0188"
          //   // },
          //   // { type: "input", label: "Invoice No", formvalue: "invoice_no", id: "ap-0189" },
          //   // { type: "input", label: "Invoice Amount", formvalue: "invoice_amount", id: "ap-0190" }
          // ]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  getreptype() {
    let data = {}
    this.ecfservice.getreptype(data)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.reportList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
branchlist:any
  getRaiserbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.commonForm.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }

  getbranch() {
  console.log("getbranch--->");
    this.ecfservice.getbranchscroll('',1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branchlist = datas;
    })
  }
  getsupplierbranch() {
  console.log("getsupplierbranch--->");
    this.ecfservice.getsupplierscroll('',1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.supplierlist = datas;
    })
  }
  getRaiserbranchftran() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.apfailedTransform.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  getRaiserbranch_apadv() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.apAdvSummaryform.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }

  getbranchdropdown() {
    this.branchdropdown('');
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.bounceForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }

  getraiserdropdownftrn() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.apfailedTransform.get('raiser_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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

  branchdropdown(branchkeyvalue) {
    this.ecfservices.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.Branchlist = datas;
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
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
                this.ecfservices.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
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
  getpaytype() {
    this.ecfservice.getpayto('')
      .subscribe(result => {
        if (result) {
          this.payList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  get branchtype() {
    return this.bounceForm.get('branch_id');
  }
  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
  }

  getheaderbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.bounceForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }

  raiseBranchScroll() {
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
                this.ecfservices.getbranchscroll(this.raiserbrInput.nativeElement.value, this.currentpage + 1)
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

raisebranchScroll() {
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
                this.ecfservices.getbranchscroll(this.raiserbrInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.branchlist.length >= 0) {
                      this.branchlist = this.branchlist.concat(datas);
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

  get raiseBranchtype() {
    return this.bounceForm.get('raiserbranch_id');
  }

  supplierBranchScroll() {
    setTimeout(() => {
      if (
        this.matsupplierAutocomplete &&
        this.matsupplierAutocomplete &&
        this.matsupplierAutocomplete.panel
      ) {
        fromEvent(this.matsupplierAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsupplierAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsupplierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsupplierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsupplierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getsupplierscroll(this.supplierbrInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.supplierlist.length >= 0) {
                      this.supplierlist = this.supplierlist.concat(datas);
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


  get supplierBranchtype() {
    return this.bounceForm.get('supplier_id');
  }

  public displayFnsupplierrole(branchtyperole?: supplierListss): string | undefined {
    return branchtyperole ? branchtyperole.code + "-" + branchtyperole.name : undefined;
  }

  ecfStatusList2: any
  getecfstatus() {
    this.ecfservice.getecfstatus()
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.StatusList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getBatchstatus() {
    this.ecfservice.getBatchstatus()
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.batchStatusList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  getStatus() {
    this.ecfservice.getStatus()
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.ecfStatusList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  overallreset() {
    console.log("Reset button clicked");
    if (this.summaryBoxComponent) {
      this.summaryBoxComponent?.resetAllFilters();
    } else {
      setTimeout(() => {
        if (this.summaryBoxComponent) {
          this.summaryBoxComponent?.resetAllFilters();
        }
      });
    }
  }
  commonStatusList: any
  apMakerStatusList: any
  apRejectStatusList: any
  apFailedStatusList: any
  apApprovalStatusList: any
  FailedInitStatussummary:any
  get_common_status() {
    this.ecfservice.get_common_status()
      .subscribe(result => {
        if (result['data'] != undefined) {
          let data = result['data']
          this.apApprovalStatusList =  data.filter(x=> (x.id == 8 || x.id == 52))
          this.commonStatusList = data.filter(x => (x.id != 2 && x.id != 35 && x.id != 36 && x.id != 34))
          this.apMakerStatusList = data.filter(x => (x.text == 'AP MAKER' || x.text == 'AP RE-PROCCESS' || x.text == 'AP RE-AUDIT'))
          this.apRejectStatusList = data.filter(x => (x.id == 10 || x.id == 40))
          this.FailedInitStatussummary = data.filter(x => (x.id == 9 || x.id == 13|| x.id == 15 || x.id == 27 || x.id == 28 
            || x.id == 38  || x.id == 25 ))
          this.FailedInitStatus = data.filter(x => (x.id == 8 ||x.id == 9 || x.id == 13|| x.id == 15 || x.id == 27 || x.id == 28 || x.id == 29
            || x.id == 38 || x.id == 39 || x.id == 25 || x.id == 12))
          console.log('apRejectStatusList------', this.apRejectStatusList)
          console.log('FailedInitStatus------', this.FailedInitStatus)
          this.apFailedStatusList = data.filter(x => (x.id != 2))
          this.makerstatusdroptype = {
            label: "Invoice Status",
            params: "",
            searchkey: "query",
            displaykey: "text",
            Outputkey: "id",
            valuekey: "id",
            fronentdata: true,
            data: this.apMakerStatusList,
            formcontrolname: "invoice_status",
            id: "ap-0141"
          };
          this.commoninvoicestatusdroptype = {
            label: "Invoice Status",
            params: "",
            searchkey: "query",
            displaykey: "text",
            Outputkey: "id",
            valuekey: "id",
            formcontrolname: "invoice_status",
            fronentdata: true,
            data: this.commonStatusList,
          };
          // this.makersearch = [
          //   {
          //     type: "input",
          //     label: "Invoice Header CR No",
          //     formvalue: "invoiceheader_crno", id: "ap-0130"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.makerdroptype,
          //     formvalue: "aptype", id: "ap-0131"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.supplierfield,
          //     formvalue: "supplier_id", id: "ap-0134"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.commonbranch,
          //     formvalue: "raiserbranch_id", id: "ap-0135"
          //   },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.approverfield,
          //   //   formvalue: "raiser_name", id: "ap-0136"
          //   // },
          //   // { type: "input", label: "Invoice No", formvalue: "invoice_no", id: "ap-0137" },
          //   // {
          //   //   type: "input",
          //   //   label: "Invoice Amount",
          //   //   formvalue: "invoice_amount", id: "ap-0138"
          //   // },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.makerstatusdroptype,
          //   //   formvalue: "invoice_status", id: "ap-0141"
          //   // },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.statusdroptype,
          //   //   formvalue: "apinvoiceheaderstatus_id", id: "ap-0142"
          //   // },
          //   // {
          //   //   type: "twodates",
          //   //   fromobj: { label: "From Date", formvalue: "from_date", id: "ap-0139" },
          //   //   toobj: { label: "To Date", formvalue: "to_date", id: "ap-0140" },
          //   // },

          // ];

          // this.bouncesearch = [
          //   {
          //     type: "input",
          //     label: "Invoice Header CR No",
          //     formvalue: "invoiceheader_crno", id: "ap-0164"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.makerdroptype,
          //     formvalue: "aptype", id: "ap-0166"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.supplierfield,
          //     formvalue: "supplier_id", id: "ap-0168"
          //   },
          //   {
          //     type: "dropdown",
          //     inputobj: this.commonbranch,
          //     formvalue: "raiserbranch_id", id: "ap-0169"
          //   },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.approverfield,
          //   //   formvalue: "raiser_name", id: "ap-0170"
          //   // },
          //   // { type: "input", label: "Invoice No", formvalue: "invoice_no", id: "ap-0173" },
          //   // {
          //   //   type: "input",
          //   //   label: "Invoice Amount",
          //   //   formvalue: "invoice_amount", id: "ap-0174"
          //   // },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.makerstatusdroptype,
          //   //   formvalue: "invoice_status", id: "ap-0177"
          //   // },
          //   // {
          //   //   type: "twodates",
          //   //   fromobj: { label: "From Date", formvalue: "from_date", id: "ap-0175" },
          //   //   toobj: { label: "To Date", formvalue: "to_date", id: "ap-0176" },
          //   // },
          // ];
          // this.rejectsearch = [{
          //   type: "input",
          //   label: "Invoice Header CR No",
          //   formvalue: "invoiceheader_crno",
          //   id: "ap-0182"
          // }, { type: "dropdown", inputobj: this.makerdroptype, formvalue: "aptype", id: "ap-0184" },
          // {
          //   type: "dropdown",
          //   inputobj: this.supplierfield,
          //   formvalue: "supplier_id", id: "ap-0186"
          // },
          // {
          //   type: "dropdown",
          //   inputobj: this.commonbranch,
          //   formvalue: "raiserbranch_id", id: "ap-0187"
          // },
          //   // {
          //   //   type: "dropdown",
          //   //   inputobj: this.approverfield,
          //   //   formvalue: "raiser_name", id: "ap-0188"
          //   // },
          //   // { type: "input", label: "Invoice No", formvalue: "invoice_no", id: "ap-0189" },
          //   // { type: "input", label: "Invoice Amount", formvalue: "invoice_amount", id: "ap-0190" }
          // ]

          // this.SummarycommonDatarestfiled = ['crno','invoiceheader_crno', 'aptype', 'supplier_id', 'raiser_name', 'raiserbranch_id', 'invoice_no', 'minamt', 'maxamt', 'invoice_status', 'start_date', 'end_date'];
          // this.SummarymakerFilesrestfiled = ['invoiceheader_crno','aptype', 'supplier_id', 'raiser_name', 'raiserbranch_id', 'invoice_no', 'minamt', 'maxamt', 'invoice_status', 'from_date', 'to_date', 'inwfrom_date', 'inwto_date'];
          // this.SummaryrejectFilesrestfiled = ['invoiceheader_crno','aptype', 'supplier_id', 'raiser_name', 'raiserbranch_id', 'invoice_no', 'minamt', 'maxamt', 'invoice_status', 'from_date', 'to_date'];
          // this.SummaryfailedDatarestfiled = ['invoiceheader_crno','aptype', 'supplier_id', 'raiser_name', 'raiserbranch_id', 'invoice_no', 'minamt', 'maxamt', 'invoice_status', 'from_date', 'to_date'];
           
          this.SummarycommonData = [
            { columnname: "CR No", key: "crno", headicon: true, headertype: 'headinput', payloadkey: "crno", label: "CR No", clickFunction: this.commonsearch.bind(this), validate: true, validatefunction: this.input_data.bind(this) },
            { columnname: "Invoice CR No", key: "apinvoiceheader_crno", headicon: true, headertype: 'headinput', payloadkey: "invoiceheader_crno", label: "Invoice CR No", function: true, clickfunction: this.comlinkview.bind(this), clickFunction: this.commonsearch.bind(this), "style": { color: " #3684BF", cursor: "pointer" }, validate: true, validatefunction: this.invoice_crno.bind(this) },
            {
              columnname: "Invoice Type", key: "aptype", type: "object", objkey: "text", headicon: true, headertype: 'headoptiondropdown', payloadkey: "aptype",
              // inputobj: {
              //   label: "Invoice Type",
              //   params: "",
              //   searchkey: "query",
              //   displaykey: "text",
              //   Outputkey: "id",
              //   fronentdata: true,
              //   data: this.TypeList,
              //   valuekey: "id",
              //   formcontrolname: "aptype"
              // },
              inputobj: {
                label: "Invoice Type",
                searchkey: "query",
                displaykey: "text",
                url: this.ecfmodelurl + "ecfapserv/get_ecftype",
                Outputkey: "id",
                formcontrolname: "aptype",
                },
              clickFunction: this.commonsearch.bind(this)
            },
            {
              columnname: "Supplier", key: "supplier_data", "headicon": true, headertype: 'headdropdown', payloadkey: "supplier_id",
              inputtooltip: "Search by Supplier",
              inputobj: {
                label: 'Supplier',
                method: 'get',
                url: this.ecfmodelurl + 'venserv/landlordbranch_list',
                params: '',
                searchkey: 'query',
                displaykey: 'name',
                formcontrolname: "supplier_id",
                Outputkey: "id",

              }, clickFunction: this.commonsearch.bind(this),
              validate: true, validatefunction: this.apcommon_data.bind(this),
            },
            // { columnname: "Supplier", key: "supplier_data", type: "object", objkey: "name", },
            {
              columnname: "Raiser", key: "raiser_name", "headicon": true, headertype: 'headdropdown', payloadkey: "raiser_name",
              inputobj: {
                label: 'Raiser',
                method: 'get',
                url: this.ecfmodelurl + '/usrserv/memosearchemp',
                params: '',
                searchkey: 'query',
                displaykey: 'full_name',
                formcontrolname: "raiser_name",
                Outputkey: "id",

              }, clickFunction: this.commonsearch.bind(this),
              // validate: true, validatefunction: this.raiser_data.bind(this),
            },
            {
              columnname: "Raiser Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", "headicon": true, headertype: 'headdropdown', payloadkey: "raiserbranch_id",
              inputobj: {
                label: 'Raiser Branch',
                method: 'get',
                url: this.ecfmodelurl+ '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname: "raiserbranch_branch",
                Outputkey: "id",

              }, clickFunction: this.commonsearch.bind(this),
              // validate: true, validatefunction: this.raiser_branch_data.bind(this),
            },
            {
              columnname: "Invoice Branch", key: "invoicebranch", type: "object", objkey: "name_code", "headicon": true, headertype: 'headdropdown', payloadkey: "branchdetails_id",
              inputobj: {
                label: 'Invoice Branch',
                method: 'get',
                url: this.ecfmodelurl+ '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname: "invoicebranch",
                Outputkey: "id",

              }, clickFunction: this.commonsearch.bind(this),
              // validate: true, validatefunction: this.raiser_branch_data.bind(this),
            },
              {
              columnname: "Transaction Date", key: "apdate", "type": 'Date', "datetype": "dd-MMM-yyyy",
              "headicon": true, headertype: 'startendDate', payloadkey_1: "start_date", payloadkey_2: "end_date", common_key: { ecf_date: "ecf_date" },
              label1: "Start Date", label2: "End Date", clickFunction: this.commonsearch.bind(this),
              //  validate: true, validatefunction: this.invoiceno_date.bind(this)
            },
            {
              columnname: "Invoice No", key: "invoice_no", headicon: true, headertype: 'headinput', payloadkey: "invoice_no",
              label: "CR No", clickFunction: this.commonsearch.bind(this),
              //  validate: true, validatefunction: this.invoiceno_data.bind(this) 
            },
            {
              columnname: "Invoice Amount", key: "totalamount", "prefix": "₹", "type": 'Amount', headicon: true, headertype: 'minmaxAmnt',
              payloadkey_1: "minamt", payloadkey_2: "maxamt", common_key: { inv_amount: "inv_amount" }, label1: "Min Amount", label2: "Max Amount",
              clickFunction: this.commonsearch.bind(this),style: { 'display': 'flex', 'justify-content': 'end' }
              // validate: true, validatefunction: this.invoiceno_amnt.bind(this)
            },
            {
              columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy",
              "headicon": true, headertype: 'startendDate', payloadkey_1: "invoice_from_date", payloadkey_2: "invoice_to_date", common_key: { ecf_date: "ecf_date" },
              label1: "Start Date", label2: "End Date", clickFunction: this.commonsearch.bind(this),
              //  validate: true, validatefunction: this.invoiceno_date.bind(this)
            },
            {
              columnname: "Invoice Status", key: "apinvoicehdr_status", type: "object", objkey: "text",
              headicon: true, headertype: 'headoptiondropdown', payloadkey: "invoice_status",
              inputobj: {
                label: "Invoice Status",
                params: "",
                searchkey: "query",
                displaykey: "text",
                Outputkey: "id",
                fronentdata: true,
                data: this.commonStatusList,
                valuekey: "id",
                formcontrolname: "apinvoicehdr_status"
              }, clickFunction: this.commonsearch.bind(this),
              // validate: true, validatefunction: this.invoice_type_data.bind(this)
            },
            {
              columnname: "View Entry", "key": "view entry", validate: true, button: true, function: true, tooltip: true,
              clickfunction: this.CommonViewEntry.bind(this), validatefunction: this.view_entry.bind(this)
            },
            {
              columnname: "Download Covernote", key: "Download CoverNote", icon: "download", "style": { color: "green", cursor: "pointer" },
              button: true, function: true, tooltip: true, clickfunction: this.coverNotedownload.bind(this),
            },
            {
              columnname: "Action",
              key: "Click to Unlock",
              icon: "lock_open", "style": { color: "green", cursor: "pointer" },
              button: true, function: true, tooltip: true,
              clickfunction: this.unlock.bind(this),
            },
          ]
          this.SummaryapprovalData = [

              { columnname: "Invoice CR No", key: "apinvoiceheader_crno",payloadkey: "invoiceheader_crno","headicon": true, headertype: 'headinput',
                label: "Invoice CR No", headerdicon: "filter_list", clickFunction: this.approvesearch.bind(this),inputicon: "search",
                function: true, clickfunction: this.applinkview.bind(this), "style": { color: " #3684BF", cursor: "pointer" }, },
              {columnname: "Invoice Type", key: "aptype",type: "object",objkey: "text",headicon: true, headerdicon: "filter_list", headertype: 'headoptiondropdown',payloadkey: "aptype",
                inputobj: {
                label: "Invoice Type",
                searchkey: "query",
                displaykey: "text",
                url: this.ecfmodelurl + "ecfapserv/get_ecftype",
                Outputkey: "id",
                formcontrolname: "aptype",
                },
              validate: true, validatefunction: this.aptype_data.bind(this),function:true,
              clickFunction: this.approvesearch.bind(this)
              },
              { columnname: "Supplier", key: "supplier_data", "headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
                  payloadkey: "supplier_id",
                  inputobj :{
                  label: "Supplier",
                  method: "get",
                  url: this.ecfmodelurl + "venserv/landlordbranch_list",
                  params: "",
                  searchkey: "query",
                  displaykey: "name",
                  Outputkey: "id",
                  formcontrolname: "supplier_id",
                },
                  clickFunction: this.approvesearch.bind(this),function:true,
                  validate: true, validatefunction: this.apsupply_data.bind(this),
                },

              { columnname: "Raiser", key: "raiser_name","headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
                  payloadkey: "raiser_name",   
                  inputobj: {
                  label: "Raiser",
                  method: "get",
                  url: this.ecfmodelurl + "usrserv/memosearchemp",
                  params: "",
                  searchkey: "query",
                  displaykey: "full_name",
                  Outputkey: "id",
                  formcontrolname: "raiser_name",
                },
                clickFunction: this.approvesearch.bind(this),function:true,
                // validate: true, validatefunction: this.apraiser_data.bind(this),
                },
              { columnname: "Raiser Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", "headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
                payloadkey: "raiserbranch_id",   
                inputobj:{
                label: "Raiser Branch",
                method: "get",
                url: this.ecfmodelurl + "usrserv/search_branch",
                params: "",
                searchkey: "query",
                displaykey: "name",
                Outputkey: "id",
                prefix: 'code',
                separator: "hyphen",
                formcontrolname: "raiserbranch_id",
              },
                clickFunction: this.approvesearch.bind(this),function:true,
                // validate: true, validatefunction: this.apbranch_data.bind(this),
              },
              {
              columnname: "Invoice Branch", key: "invoicebranch", type: "object", objkey: "name_code", "headicon": true, headertype: 'headdropdown', payloadkey: "branchdetails_id",
              inputobj: {
                label: 'Invoice Branch',
                method: 'get',
                url: this.ecfmodelurl+ '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname: "invoicebranch",
                Outputkey: "id",

              }, clickFunction: this.approvesearch.bind(this),
              // validate: true, validatefunction: this.raiser_branch_data.bind(this),
            },
              { columnname: "Invoice No", key: "invoice_no", payloadkey: "invoice_no", "headicon": true, headertype: 'headinput',
              label: "Invoice No", headerdicon: "filter_list", clickFunction: this.approvesearch.bind(this), inputicon: "search",
              validate: true, validatefunction: this.apinvoice_data.bind(this),
              },

              { columnname: "Invoice Amount", prefix: "₹",  key: "totalamount",type: 'Amount', headicon: true, headinput: true, headerdicon: "filter",
                headertype: 'minmaxAmnt', payloadkey_1: "minamt",payloadkey_2: "maxamt",label1: "Min Amount",
                label2: "Max Amount", clickFunction: this.approvesearch.bind(this),inputicon: "search",
                // validate: true, validatefunction: this.apamount_data.bind(this),
                style:{ 'display': 'flex', 'justify-content': 'end' }
              },


              { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy", "headicon": true, payloadkey_1: "from_date", payloadkey_2: "to_date",
              label1: "Start Date",label2:"End Date", headerdicon: "date_range", headertype: 'startendDate', 
              clickFunction: this.approvesearch.bind(this),
              //  validate: true, validatefunction: this.apdate_data.bind(this), 
              },

              { columnname: "Inward Date", key: "inward_date", "type": 'Date', "datetype": "dd-MMM-yyyy", "headicon": true, payloadkey_1: "inwfrom_date", payloadkey_2: "inwto_date",
              label1: "Start Date",label2:"End Date", headerdicon: "date_range", headertype: 'startendDate', 
              clickFunction: this.approvesearch.bind(this),
              //  validate: true, validatefunction: this.apinwarddate_data.bind(this),
              },

              { columnname: "Invoice Status", key: "apinvoicehdr_status", type: "object", objkey: "text",
                  headicon: true, headertype: 'headoptiondropdown', payloadkey: "apinvoiceheaderstatus_id",
                      inputobj: {
                        label: "Invoice Status",
                        fronentdata: true,
                        data: this.apApprovalStatusList,
                        displaykey: "text",
                        Outputkey: "id",
                        // valuekey: "id",
                        formcontrolname: "invoice_status"
                      },
                  clickFunction: this.approvesearch.bind(this)
                },
          
              { columnname: "Paymode", key: "paymode_fields",type: "object", objkey: "paymode_names"},
            
              { columnname: "Updated Date", key: "updated_date" },
            
              { columnname: "Ageing", key: "approver_ageing" },
	
          ]
          this.SummarymakerFiles = [
            { columnname: "Invoice CR No", key: "apinvoiceheader_crno", headicon: true, headertype: 'headinput', payloadkey: "invoiceheader_crno", label: "Invoice CR No", clickFunction: this.makersumSearch.bind(this), validate: true, validatefunction: this.invoice_cr_maker.bind(this) },
            {
              columnname: "Invoice Type", key: "aptype", type: "object", objkey: "text",
              headicon: true, headertype: 'headoptiondropdown', payloadkey: "aptype",
              // inputobj: {
              //   label: "Invoice Type",
              //   params: "",
              //   searchkey: "query",
              //   displaykey: "text",
              //   Outputkey: "id",
              //   fronentdata: true,
              //   data: this.datas,
              //   valuekey: "id",
              //   formcontrolname: "aptype"
              // }, 
              inputobj: {
                label: "Invoice Type",
                searchkey: "query",
                displaykey: "text",
                url: this.ecfmodelurl + "ecfapserv/get_ecftype",
                Outputkey: "id",
                formcontrolname: "aptype",
                },
              clickFunction: this.makersumSearch.bind(this), validate: true, validatefunction: this.ecf_type_data.bind(this)
            },
            // {
            //   columnname: "Supplier Name",
            //   key: "supplier_data",
            //   type: "object",
            //   objkey: "name",
            // },
            {
              columnname: "Supplier", key: "supplier_data", validate: true, validatefunction: this.apcommon_data.bind(this),
              "headicon": true, headertype: 'headdropdown', payloadkey: "supplier_id",
              inputobj: {
                label: 'Supplier',
                method: 'get',
                url: this.ecfmodelurl + 'venserv/search_suppliername_ecf',
                params: '&sup_id=' + '&name=',
                searchkey: 'name',
                displaykey: 'name',
                formcontrolname: "supplier_id",
                Outputkey: "id",

              }, clickFunction: this.makersumSearch.bind(this),
            },
            {
              columnname: "Raiser", key: "raiser_name", "headicon": true, headertype: 'headdropdown', payloadkey: "raiser_name",
              inputobj: {
                label: 'Raiser',
                method: 'get',
                url: this.ecfmodelurl + '/usrserv/memosearchemp',
                params: '',
                searchkey: 'query',
                displaykey: 'full_name',
                formcontrolname:"raiser_name",
                Outputkey: "id",

              }, clickFunction: this.makersumSearch.bind(this),
              // validate: true, validatefunction: this.raiser_data.bind(this),
            },
            // {
            //   columnname: "Employee Branch",
            //   key: "raiserbranch_branch",
            //   type: "object",
            //   objkey: "name",
            // },
            {
              columnname: "Raiser Branch",
              key: "raiserbranch_branch",
              type: "object",
              objkey: "name_code",
              "headicon": true, headertype: 'headdropdown', payloadkey: "raiserbranch_id",
              inputobj: {
                label: 'Raiser Branch',
                method: 'get',
                url: this.ecfmodelurl + '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname:"raiserbranch_branch",
                Outputkey: "id",

              }, clickFunction: this.makersumSearch.bind(this),
              validate: true, validatefunction: this.raiser_branch__reject_data.bind(this),
            },
            {
              columnname: "Invoice Branch", key: "invoicebranch", type: "object", objkey: "name_code", "headicon": true, headertype: 'headdropdown', payloadkey: "branchdetails_id",
              inputobj: {
                label: 'Invoice Branch',
                method: 'get',
                url: this.ecfmodelurl+ '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname: "invoicebranch",
                Outputkey: "id",

              }, clickFunction: this.makersumSearch.bind(this),
              // validate: true, validatefunction: this.raiser_branch_data.bind(this),
            },
            {
              columnname: "PO No",
              key: "raiser_name",
              validate: true,
              validatefunction: this.po_no_data.bind(this),
            },
            {
              columnname: "Invoice No", key: "invoice_no",
              headicon: true, headertype: 'headinput', payloadkey: "invoice_no",
              label: "CR No", clickFunction: this.makersumSearch.bind(this),
              validate: true, validatefunction: this.invoiceno_data.bind(this)
            },
            {
              columnname: "Invoice Amount",
              key: "totalamount",
              prefix: "₹",
              type: "Amount",
              headicon: true, headertype: 'minmaxAmnt', payloadkey: "invoice_amount",
              payloadkey_1: "minamt", payloadkey_2: "maxamt", label1: "Min Amount", label2: "Max Amount",
              clickFunction: this.makersumSearch.bind(this), 
              style: { 'display': 'flex', 'justify-content': 'end' }
              // validate: true, validatefunction: this.invoiceno_amnt.bind(this),
            },
            // {
            //   columnname: "Invoice Date",
            //   key: "invoicedate",
            //   validate: true,
            //   validatefunction: this.highlight.bind(this),
            // },
            {
              columnname: "Invoice Date",
              key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy",
              "headicon": true, headertype: 'startendDate', payloadkey_1: "from_date", payloadkey_2: "to_date",
              label1: "Start Date", label2: "End Date", clickFunction: this.makersumSearch.bind(this), 
              // validate: true, validatefunction: this.invoicenomaker_date.bind(this)
            },
            {
              columnname: "Inward Date",
              key: "inward_date", "type": 'Date', "datetype": "dd-MMM-yyyy",
              "headicon": true, headertype: 'startendDate', payloadkey_1: "inwfrom_date", payloadkey_2: "inwto_date",
              label1: "Start Date", label2: "End Date", clickFunction: this.makersumSearch.bind(this),
              //  validate: true, validatefunction: this.inwardnomaker_date.bind(this)
            },
            // {columnname: "Due Days",key: "due_days"},
            {
              columnname: "Invoice Status",
              key: "apinvoicehdr_status",
              type: "object",
              objkey: "text",
              headicon: true, headertype: 'headoptiondropdown', payloadkey: "invoice_status",
              inputobj: {
                label: "Invoice Status",
                params: "",
                searchkey: "query",
                displaykey: "text",
                Outputkey: "id",
                fronentdata: true,
                data: this.apMakerStatusList,
                valuekey: "id",
                formcontrolname: "aptype"
              }, clickFunction: this.makersumSearch.bind(this), validate: true, validatefunction: this.invoice_type_data.bind(this)

            },
            {
              columnname: "Barcode No", key: "barcode"
            },
            { columnname: "Ageing", key: "ageing" },
            {
              columnname: "Action",
              key: "View & Invoice",
              icon: "arrow_forward",
              style: { cursor: "pointer", color: "black" },
              button: true,
              function: true,
              tooltip: true,
              clickfunction: this.apmakerview.bind(this),
            },
          ];

          this.SummaryrejectFiles = [
            {
              columnname: "Invoice CR No",
              key: "apinvoiceheader_crno",
              headicon: true, headertype: 'headinput', payloadkey: "invoiceheader_crno", label: "Invoice CR No",
              clickFunction: this.rejectsumSearch.bind(this),
              validate: true, validatefunction: this.invoice_crno_reject.bind(this),
              style: { cursor: "pointer", color: "#3684bf" },
              function: true,
              clickfunction: this.rejectdata.bind(this),
            },
            {
              columnname: "Invoice Type", key: "aptype", type: "object", objkey: "text",
              headicon: true, headertype: 'headoptiondropdown', payloadkey: "aptype",
              inputobj: {
                label: "Invoice Type",
                params: "",
                searchkey: "query",
                displaykey: "text",
                Outputkey: "id",
                fronentdata: true,
                data: this.datas,
                valuekey: "id",
                formcontrolname: "aptype"
              }, clickFunction: this.rejectsumSearch.bind(this), validate: true, validatefunction: this.ecf_type_data.bind(this)
            },
            // {
            //   columnname: "Supplier",
            //   key: "supplier_data",
            //   type: "object",
            //   objkey: "name_code",
            // },
            {
              columnname: "Supplier", key: "supplier_data", validate: true, validatefunction: this.apreject_data.bind(this),
              "headicon": true, headertype: 'headdropdown', payloadkey: "supplier_id",
              inputobj: {
                label: 'Supplier',
                method: 'get',
                url: this.ecfmodelurl + 'venserv/search_suppliername_ecf',
                params: '&sup_id=' + '&name=',
                searchkey: 'name',
                displaykey: 'name',
                formcontrolname: "supplier_id",
                Outputkey: "id",

              }, clickFunction: this.rejectsumSearch.bind(this),
            },
            {
              columnname: "Raiser", key: "raiser_name",
              "headicon": true, headertype: 'headdropdown', payloadkey: "raiser_name",
              inputobj: {
                label: 'Raiser',
                method: 'get',
                url: this.ecfmodelurl + '/usrserv/memosearchemp',
                params: '',
                searchkey: 'query',
                displaykey: 'full_name',
                // formcontrolname:"supplier_id",
                Outputkey: "id",

              }, clickFunction: this.rejectsumSearch.bind(this),
              validate: true, validatefunction: this.raiser_data.bind(this),
            },
            {
              columnname: "Raiser Branch",
              key: "raiserbranch_branch",
              type: "object",
              objkey: "name_code",
              "headicon": true, headertype: 'headdropdown', payloadkey: "raiserbranch_id",
              inputobj: {
                label: 'Raiser Branch',
                method: 'get',
                url: this.ecfmodelurl + '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname:"raiserbranch_branch",
                Outputkey: "id",

              }, clickFunction: this.rejectsumSearch.bind(this),
              validate: true, validatefunction: this.raiser_branch__reject_data.bind(this)
            },
            {
              columnname: "Invoice Branch", key: "invoicebranch", type: "object", objkey: "name_code", "headicon": true, headertype: 'headdropdown', payloadkey: "branchdetails_id",
              inputobj: {
                label: 'Invoice Branch',
                method: 'get',
                url: this.ecfmodelurl+ '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname: "invoicebranch",
                Outputkey: "id",

              }, clickFunction: this.rejectsumSearch.bind(this),
              // validate: true, validatefunction: this.raiser_branch_data.bind(this),
            },
            {
              columnname: "Invoice No", key: "invoice_no",
              headicon: true, headertype: 'headinput', payloadkey: "invoice_no",
              label: "CR No", clickFunction: this.rejectsumSearch.bind(this),
              validate: true, validatefunction: this.invoiceno_data.bind(this)
            },
            {
              columnname: "Invoice Amount",
              key: "totalamount",
              prefix: "₹",
              type: "Amount",
              headicon: true, headertype: 'minmaxAmnt', payloadkey: "invoice_amount",
              payloadkey_1: "minamt", payloadkey_2: "maxamt", label1: "Min Amount", label2: "Max Amount",
              clickFunction: this.rejectsumSearch.bind(this), 
              style: { 'display': 'flex', 'justify-content': 'end' }
              // validate: true, validatefunction: this.invoiceno_amnt.bind(this)
            },
            {
              columnname: "Invoice Date",
              key: "invoicedate",
              type: "Date",
              datetype: "dd-MMM-yyyy",
              "headicon": true, headertype: 'startendDate', payloadkey_1: "from_date", payloadkey_2: "to_date",
              label1: "Start Date", label2: "End Date", clickFunction: this.rejectsumSearch.bind(this), validate: true, validatefunction: this.invoicenomaker_date.bind(this)
            },
            {
              columnname: "Invoice Status",
              key: "apinvoicehdr_status",
              type: "object",
              objkey: "text",
              headicon: true, headertype: 'headoptiondropdown', payloadkey: "invoice_status",
              inputobj: {
                label: "Invoice Status",
                params: "",
                searchkey: "query",
                displaykey: "text",
                Outputkey: "id",
                fronentdata: true,
                data: this.apRejectStatusList,
                valuekey: "id",
                formcontrolname: "aptype"
              }, clickFunction: this.rejectsumSearch.bind(this), validate: true, validatefunction: this.invoice_type_data.bind(this)

            },
            { columnname: "Ageing", key: "ageing" },
            {
              columnname: "Action",
              key: "View",
              // icon: "arrow_forward",
              validate: true,
              button: true,
              function: true,
              tooltip: true,
              clickfunction: this.actionreject.bind(this),
              validatefunction: this.rejectvalid.bind(this),
            },
          ];

          this.SummaryfailedData = [
            {
              columnname: "Invoice CR No", key: "apinvoiceheader_crno",
              headicon: true, headertype: 'headinput', payloadkey: "invoiceheader_crno", label: "Invoice CR No",
              clickFunction: this.failedsearchfun.bind(this),
              validate: true, validatefunction: this.invoice_cr_maker.bind(this),

            },
            {
              columnname: "Invoice Type", key: "aptype", "type": "object", "objkey": "text",
              headicon: true, headertype: 'headoptiondropdown', payloadkey: "aptype",
              inputobj: {
                label: "Invoice Type",
                params: "",
                searchkey: "query",
                displaykey: "text",
                Outputkey: "id",
                fronentdata: true,
                data: this.datas,
                valuekey: "id",
                formcontrolname: "aptype"
              }, clickFunction: this.failedsearchfun.bind(this), validate: true, validatefunction: this.ecf_type_data.bind(this)
            },
            {
              columnname: "Supplier Name", key: "supplier_data", "type": "object", "objkey": "name",
              validate: true, validatefunction: this.apfailed_data.bind(this),
              "headicon": true, headertype: 'headdropdown', payloadkey: "supplier_id",
              inputobj: {
                label: 'Supplier',
                method: 'get',
                url: this.ecfmodelurl + 'venserv/search_suppliername_ecf',
                params: '&sup_id=' + '&name=',
                searchkey: 'name',
                displaykey: 'name',
                formcontrolname: "supplier_id",
                Outputkey: "id",

              }, clickFunction: this.failedsearchfun.bind(this),
            },
            // { columnname: "Supplier", key: "supplier_data", validate: true, validatefunction: this.apfailed_data.bind(this), },
            {
              columnname: "Raiser", key: "raiser_name",
              "headicon": true, headertype: 'headdropdown', payloadkey: "raiser_name",
              inputobj: {
                label: 'Raiser',
                method: 'get',
                url: this.ecfmodelurl + '/usrserv/memosearchemp',
                params: '',
                searchkey: 'query',
                displaykey: 'full_name',
                Outputkey: "id",
                formcontrolname:"raiser_name"

              }, clickFunction: this.failedsearchfun.bind(this),
              validate: true, validatefunction: this.raiser_data.bind(this),
            },
            {
              columnname: "Raiser Branch", key: "raiserbranch_branch", "type": "object", "objkey": "name_code",
              "headicon": true, headertype: 'headdropdown', payloadkey: "raiserbranch_id",
              inputobj: {
                label: 'Raiser Branch',
                method: 'get',
                url: this.ecfmodelurl + '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname:"raiserbranch_branch",
                Outputkey: "id",

              }, clickFunction: this.failedsearchfun.bind(this),
              validate: true, validatefunction: this.raiser_branch__reject_data.bind(this)
            },
            {
              columnname: "Invoice Branch", key: "invoicebranch", type: "object", objkey: "name_code", "headicon": true, headertype: 'headdropdown', payloadkey: "branchdetails_id",
              inputobj: {
                label: 'Invoice Branch',
                method: 'get',
                url: this.ecfmodelurl+ '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname: "invoicebranch",
                Outputkey: "id",

              }, clickFunction: this.failedsearchfun.bind(this),
              // validate: true, validatefunction: this.raiser_branch_data.bind(this),
            },
            {
              columnname: "Invoice No", key: "invoice_no",
              headicon: true, headertype: 'headinput', payloadkey: "invoice_no",
              label: "CR No", clickFunction: this.failedsearchfun.bind(this),
              validate: true, validatefunction: this.invoiceno_data.bind(this)
            },
            {
              columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy",
              "headicon": true, headertype: 'startendDate', payloadkey_1: "from_date", payloadkey_2: "to_date",
              label1: "Start Date", label2: "End Date", clickFunction: this.failedsearchfun.bind(this), validate: true, validatefunction: this.invoicenomaker_date.bind(this)
            },
            {
              columnname: "Invoice Amount", key: "totalamount", "prefix": "₹", "type": 'Amount',
              headicon: true, headertype: 'minmaxAmnt',
              payloadkey_1: "minamt", payloadkey_2: "maxamt", common_key: { inv_amount: "inv_amount" }, label1: "Min Amount", label2: "Max Amount",
              clickFunction: this.failedsearchfun.bind(this),
              //  validate: true, validatefunction: this.invoiceno_amnt.bind(this)
              style: { 'display': 'flex', 'justify-content': 'end' }
            },
            {
              columnname: "Invoice Status", key: "apinvoicehdr_status", "type": "object", "objkey": "text",
              headicon: true, headertype: 'headoptiondropdown', payloadkey: "invoice_status",
              inputobj: {
                label: "Invoice Status",
                params: "",
                searchkey: "query",
                displaykey: "text",
                Outputkey: "id",
                fronentdata: true,
                data: this.FailedInitStatussummary,
                valuekey: "id",
                formcontrolname: "aptype"
              }, clickFunction: this.failedsearchfun.bind(this), validate: true, validatefunction: this.invoice_type_data.bind(this)
            },
            {
              columnname: "View Entry", key: "view entry", function: true, button: true, tooltip: true, icon: "visibility", "style": { color: "green", cursor: "pointer" },
              clickfunction: this.failedViewEntry.bind(this)
            },
            // {
            //   columnname: "Change Status", key: "status", function: true, button: true, icon: "arrow_forward", "style": { color: "black", cursor: "pointer" },
            //   clickfunction: this.failedChangeStat.bind(this), validatefunction: this.ecfinward.bind(this)
            // },
            {
              columnname: "Change Status", key: "Change Status", function: true, button: true, tooltip: true,
              clickfunction: this.failedChangeStat.bind(this), validate: true, validatefunction: this.apfailedarrow.bind(this)
            },
            {
              columnname: "Repush", key: "Repush", function: true, button: true, tooltip: true, icon: "refresh", "style": { color: "blue", cursor: "pointer" },
              clickfunction: this.Repushcall.bind(this), validatefunction: this.ecfinward.bind(this)
            }
          ]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  getyesno() {
    this.ecfservice.getinvyesno()
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.yesnolist = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  approvername() {
    let appkeyvalue: String = "";
    this.getapprover(appkeyvalue);

    this.ApproverForm.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getapproverscroll(1, this.batchArray[0]?.commodity_id?.id, this.createdbyid, "", value)
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
    this.ecfservice.getapproverscroll(1, this.batchArray[0]?.commodity_id?.id, this.createdbyid, "", appkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;
      })
  }

  public displayFnApprover(approver?: approverListss): string | undefined {
    return approver ? approver.name : undefined;
  }

  get approver() {
    return this.ApproverForm.get('approvedby');
  }

  autocompleteapproverScroll() {

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
          .subscribe(() => {
            const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextapp === true) {
                this.ecfservice.getapproverscroll(this.currentpageapp + 1, this.batchArray[0]?.commodity_id?.id, this.createdbyid, "", this.appInput.nativeElement.value)
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
  ap_inward_sub_module_name:any;
  ap_maker_sub_module_name: any;
  ap_approver_sub_module_name: any;
  ap_common_sub_module_name: any;
  ap_bounce_sub_module_name: any;
  ap_reject_sub_module_name: any;
  ap_advance_sub_module_name: any;
  ap_aduit_sub_module_name: any;
  ap_shcedular_sub_module_name: any;
  ap_report_sub_module_name: any;
  ap_failed_sub_module_name: any;
  ECFAPSubModule(data) {
    this.sub_module_url = data.url;
    console.log("submoduleurl", this.sub_module_url)
    if (this.sub_module_url != '/apreportsummary') {
      console.log('timer stop event called')
      this.stopCountdown()
    }
    this.ecfsummary = "/ecfbatchsummary"
    this.paymentfilesummary = "/paymentfile"
    this.ecfsummaryPath = this.ecfsummary === this.sub_module_url ? true : false;
    this.apapprovalPath = "/apapproval" === this.sub_module_url ? true : false;
    this.preparePaymentPath = "/preparepayment" === this.sub_module_url ? true : false;
    this.bounceSummaryPath = "/apbounce" === this.sub_module_url ? true : false;
    this.paymentfilepath = this.paymentfilesummary === this.sub_module_url ? true : false;
    this.commonSummaryPath = "/commonsummary" === this.sub_module_url ? true : false;
    this.ecfapprovalsummarypath = "/ecfapprovalsummary" === this.sub_module_url ? true : false;
    this.apmakersummarypath = "/apmakersummary" === this.sub_module_url ? true : false;
    this.bouncesummarypath = "/apbouncesummary" === this.sub_module_url ? true : false;
    this.rejectsummarypath = "/aprejectsummary" === this.sub_module_url ? true : false;
    this.failedTranspath = "/apfailedtransaction" === this.sub_module_url ? true : false;
    this.advanceSummarypath = "/apadvancesummary" === this.sub_module_url ? true : false;
    this.apInwardpath = "/apinwardsummary" === this.sub_module_url ? true : false;
    this.AuditChecklistSummary = "/auditchecklistsummary" === this.sub_module_url ? true : false;
    this.apReportSummarypath = "/apreportsummary" === this.sub_module_url ? true : false;
    this.paymentAdviceSummarypath = "/paymentadvicesummary" === this.sub_module_url ? true : false;
    this.paymentqueSummarypath = "/paymentqueuesummary" === this.sub_module_url ? true : false;
    this.schedualerpath = "/apschedulersummary" === this.sub_module_url ? true : false;
    if (this.apInwardpath) {
      this.ap_inward_sub_module_name = data.name;
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = true
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.payment_q_summary = false
      this.schedularform = false
      this.getInwardsummary('',data?.name, 1)
      this.overallinward_reset()
    }
    // if (this.ecfsummaryPath) {
    //   this.ecfsummaryForm = true
    //   this.ecfcreateForm = false
    //   this.ecfviewForm = false
    //   this.batchviewForm = false
    //   this.APApprovalForm = false
    //   this.APApprovalForms = false
    //   this.preparePaymentForm = false
    //   this.PreparepaymentForms = false
    //   this.BounceSummaryForm = false
    //   this.paymentfileForm = false
    //   this.InvoiceDetailApprovalForm = false
    //   this.InvoiceDetailForm = false
    //   this.InvoiceDetailViewForm = false
    //   this.CommonSummaryForm = false
    //   this.BounceDetailForm = false
    //   this.commonInvViewForm = false
    //   this.ecfapprovalsummaryForm = false
    //   this.ecfapprovalviewForm = false
    //   this.AppInvoiceDetailViewForm = false
    //   this.APmakerForm = false
    //   this.APECFmakeForm = false
    //   this.APCreateForm = false
    //   this.APApproverForm = false
    //   this.APBounceForm = false
    //   this.APRejectForm = false
    //   this.APFailedTransForm = false
    //   this.APAdvSummaryForm = false
    //   this.APApproverInvoiceForm = false
    //   this.APInwardSummaryForm = false
    //   this.isecfview = false
    //   this.ispoview = false
    //   this.isinwardAdd = false
    //   this.AuditChecklistSummary = false
    //   this.APReportSummaryForm = false
    //   this.PaymentAdviceForm = false
    //   this.payment_q_summary = false
    //   this.schedularform = false
    //   this.summarysearch(1)
    //   this.batchsummarysearch(1)
    //   this.Resetecfinventory()
    //   this.resetbatch()
    // }
    else if (this.ecfapprovalsummarypath) {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = true
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.payment_q_summary = false
      this.schedularform = false
      this.ecfapprovalsummarysearch(1)
      this.batchappsummarysearch(1)
      this.Resetecfinventory()
      this.resetbatchapp()
    }
    else if (this.apapprovalPath) {
      this.ap_approver_sub_module_name = data.name;
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = true
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.payment_q_summary = false
      this.schedularform = false
      this.dataclear('')
      this.overallreset_approval()
      this.resetapappInv()
      this.rptFormat = 2
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 23 || x.id == 49 || x.id == 50)
      this.ap_type = {
        label: "Report Status",
        params: "",
        searchkey: "query",
        displaykey: "text",
        Outputkey: "id",
        fronentdata: true,
        data: this.ecfStatusList2,
        valuekey: "id",
        id: "ap-0252",
        formcontrolname: "apinvoiceheaderstatus_id",
      };

    } else if (this.bouncesummarypath) {
      this.ap_bounce_sub_module_name = data.name;
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = true
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.rptFormat = 3
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 37 || x.id == 46)
      this.PaymentAdviceForm = false
      this.payment_q_summary = false
      this.schedularform = false
      this.dataclear('')
      this.overallreset_bounce()
      this.resetapbounce()
      this.debitbacks()
      this.bounce_type = {
        label: "Invoice Status",
        params: "",
        searchkey: "query",
        displaykey: "text",
        Outputkey: "id",
        fronentdata: true,
        data: this.ecfStatusList2,
        valuekey: "id",
        id: "ap-0177",
        formcontrolname: "apinvoiceheaderstatus_id",
      };
    } else if (this.rejectsummarypath) {
      this.ap_reject_sub_module_name = data.name;
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = true
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.payment_q_summary = false
      this.schedularform = false
      // this.aprejectSummarySearch(1)
      this.dataclear('')
      this.overallreset_reject()
      this.resetapreject()
    } else if (this.preparePaymentPath) {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = true
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.schedularform = false
      this.payment_q_summary = false
      this.ppSummarySearch(1)
      this.resetpp()
    } else if (this.bounceSummaryPath) {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = true
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APECFmakeForm = false
      this.APmakerForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.schedularform = false
      this.payment_q_summary = false
      this.dataclear('')
      this.overallreset()
      this.bounceSummarySearch(1)
    } else if (this.paymentfilepath) {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = true
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.schedularform = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.payment_q_summary = false
      // this.PFSummarySearch(1)
      this.dataclear('')
      this.overallreset()
      this.resetpf()
    }
    else if (this.commonSummaryPath) {
      this.ap_common_sub_module_name = data?.name
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.CommonSummaryForm = true
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.InvoiceDetailForm = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.payment_q_summary = false
      this.schedularform = false
      this.dataclear('')
      this.overallreset()
      // this.resetcommon()
      this.rptFormat = 4
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 22 || x.id == 23 || x.id == 37 || x.id == 46 || x.id == 49 || x.id == 50)
      this.commonstatusdroptype = {
        label: "Reports Status",
        params: "",
        searchkey: "query",
        displaykey: "text",
        Outputkey: "id",
        valuekey: "id",
        fronentdata: true,
        formcontrolname: "apinvoiceheaderstatus_id",
        data: this.ecfStatusList2,
      };
    }
    else if (this.apmakersummarypath) {
      this.ap_maker_sub_module_name = data?.name
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = true
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.schedularform = false
      this.payment_q_summary = false
      this.dataclear('')
      this.overallreset_maker()
      this.resetapinv()
      this.rptFormat = 1
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 22 || x.id == 49)
      this.maker_type = {
        label: "Report Status",
        params: "",
        searchkey: "query",
        displaykey: "text",
        Outputkey: "id",
        fronentdata: true,
        data: this.ecfStatusList2,
        valuekey: "id",
        id: "ap-0142",
        formcontrolname: "apinvoiceheaderstatus_id",
      };
    } else if (this.failedTranspath) {
      this.ap_failed_sub_module_name = data?.name
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = true
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.schedularform = false
      this.payment_q_summary = false
      this.overallreset_failed()
      // this.failedTransSummarySearch(1)
      // this.failedsearchfun()
      // this.searchfailedTransData["apinvoiceheaderstatus_id"] = "26";
      // this.SummaryfailedObjNew = {
      //   method: "post",
      //   url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
      //   // params: "",
      //   data: this.searchfailedTransData,     
      // }
      this.failedsearchfun('')
      // this.resetfailedTrans()
      // this.getStatDropFailed()
    } else if (this.advanceSummarypath) {
      this.ap_advance_sub_module_name = data?.name
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = true
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.AuditChecklistSummary = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.schedularform = false
      this.payment_q_summary = false
      // this.advanceSummarySearch(1)
      this.resetAdvSummary()
      this.overallreset_advance()
    }
    else if (this.AuditChecklistSummary) {
      this.ap_aduit_sub_module_name = data?.name
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.AuditChecklistSummary = true
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.payment_q_summary = false
      // this.getAuditChksummary()
      let search = this.AuditChecklistSummaryForm.value
      if (search.ecftype == '' || search.ecftype == null || search.ecftype == undefined) {
        search.ecftype = 0
      }
      this.searchecftype = search.ecftype
      this.SummaryApiauditObjNew = {
        method: "get",
        url: this.ecfmodelurl + "ecfapserv/get_ecfauditchecklist/" + this.searchecftype,
        params: "&submodule=" + this.ap_aduit_sub_module_name,OverallCount: "Total Count"
      };
    }
    else if (this.apReportSummarypath) {
      this.ap_report_sub_module_name = data?.name
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.schedularform = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.get_Summary(1)
      this.APReportSummaryForm = true
      this.PaymentAdviceForm = false
      this.payment_q_summary = false
      // this.startCountdown();
    }
    else if (this.paymentAdviceSummarypath) {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.schedularform = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = true
      this.payment_q_summary = false
      this.rptFormat = 5
      this.paymentAdviceSearch(1)
    }
    else if (this.paymentqueSummarypath) {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.schedularform = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.payment_q_summary = true
      this.rptFormat = 5
      this.resetDooScore()
      // this.paymentAdviceSearch(1)
    }

    else if (this.schedualerpath) {
      this.ap_shcedular_sub_module_name = data?.name
      this.sharedService.ap_shcedular_sub_module_name = this.ap_shcedular_sub_module_name
      console.log("ap_shcedular_sub_module_name", this.ap_shcedular_sub_module_name)
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailApprovalForm = false
      this.InvoiceDetailForm = false
      this.InvoiceDetailViewForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.APReportSummaryForm = false
      this.PaymentAdviceForm = false
      this.payment_q_summary = false
      this.schedularform = true
    }

  }

  getradio(n) {
    if (n.id == 1) {
      this.batchsummarysearch(1)
    } else {
      this.summarysearch(1)
    }
    this.batchArray = []
  }

  batchsummarysearch(pageNumber = 1) {
    this.SpinnerService.show()
    let data = this.batchSearchForm.value
    this.ecfservice.ecfbatchSearch(this.batchSearchForm.value, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.batch_summary_data = result['data']
          let datapagination = result["pagination"];
          this.getbatchtotalcount = datapagination?.count
          if (this.batch_summary_data.length === 0) {
            this.isbatchsummarypage = false
          }
          if (this.batch_summary_data.length > 0) {
            this.has_batchpagenext = datapagination.has_next;
            this.has_batchpageprevious = datapagination.has_previous;
            this.batchpresentpage = datapagination.index;
            this.isbatchsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickbatch() {
    if (this.has_batchpagenext === true) {
      this.batchsummarysearch(this.batchpresentpage + 1)
    }
  }

  previousClickbatch() {
    if (this.has_batchpageprevious === true) {
      this.batchsummarysearch(this.batchpresentpage - 1)
    }
  }


  summarysearch(pageNumber = 1) {

    this.SpinnerService.show()
    let data = this.ecfSearchForm.value
    if (data.maxamt != "" && data.minamt == "") {
      this.notification.showError("Please Enter Min Amount")
      this.SpinnerService.hide()
      return false
    }
    if (data.maxamt == "" && data.minamt != "") {
      this.notification.showError("Please Enter Max Amount")
      this.SpinnerService.hide()
      return false
    }
    this.ecfservice.ecfsummarySearch(this.ecfSearchForm?.value, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.ecf_summary_data = result['data']
          if (this.ecf_summary_data?.length > 0) {
            for (let i in this.ecf_summary_data) {
              if (this.batchArray?.length > 0) {
                for (let j in this.batchArray) {
                  if (this.ecf_summary_data[i].id == this.batchArray[j].id) {
                    this.ecf_summary_data[i].select = true
                  } else {
                    this.ecf_summary_data[i].select = false
                  }
                }
              }
              else {
                this.ecf_summary_data[i].select = false
              }
            }
          }
          console.log("ecf_summary_data", this.ecf_summary_data)
          let datapagination = result["pagination"];
          this.gettotalcount = datapagination?.count
          if (this.ecf_summary_data.length === 0) {
            this.issummarypage = false
          }
          if (this.ecf_summary_data.length > 0) {
            this.has_pagenext = datapagination.has_next;
            this.has_pageprevious = datapagination.has_previous;
            this.ecfpresentpage = datapagination.index;
            this.issummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickPayment() {
    if (this.has_pagenext === true) {
      this.summarysearch(this.ecfpresentpage + 1)
    }
  }

  previousClickPayment() {
    if (this.has_pageprevious === true) {
      this.summarysearch(this.ecfpresentpage - 1)
    }
  }

  Resetecfinventory() {
    this.ecfSearchForm.controls['crno'].reset(""),
      this.ecfSearchForm.controls['aptype'].reset(""),
      this.ecfSearchForm.controls['apstatus'].reset(""),
      this.ecfSearchForm.controls['minamt'].reset(""),
      this.ecfSearchForm.controls['maxamt'].reset(""),
      this.batchArray = [];
    this.summarysearch(1);

  }

  resetbatch() {
    this.batchSearchForm.controls['batchno'].reset(""),
      this.batchSearchForm.controls['batchstatus'].reset(""),
      this.batchSearchForm.controls['batchcount'].reset(""),
      // this.batchSearchForm.controls['fromdate'].reset(""),
      // this.batchSearchForm.controls['todate'].reset(""),
      this.batchsummarysearch(1);

  }


  ecfapprovalsummarysearch(pageNumber = 1) {

    this.SpinnerService.show()
    let data = this.ecfapprovalform.value
    if (data.maxamt != "" && data.minamt == "") {
      this.notification.showError("Please Enter Min Amount")
      this.SpinnerService.hide()
      return false
    }
    if (data.maxamt == "" && data.minamt != "") {
      this.notification.showError("Please Enter Max Amount")
      this.SpinnerService.hide()
      return false
    }
    this.ecfservice.ecfapprovalsummarySearch(this.ecfapprovalform?.value, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.ecf_approval_data = result['data']

          let datapagination = result["pagination"];
          this.getapptotalcount = datapagination?.count
          if (this.ecf_approval_data.length === 0) {
            this.isappsummarypage = false
          }
          if (this.ecf_approval_data.length > 0) {
            this.has_apppagenext = datapagination.has_next;
            this.has_apppageprevious = datapagination.has_previous;
            this.ecfapppresentpage = datapagination.index;
            this.isappsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickappPayment() {
    if (this.has_apppagenext === true) {
      this.ecfapprovalsummarysearch(this.ecfapppresentpage + 1)
    }
  }

  previousClickappPayment() {
    if (this.has_apppageprevious === true) {
      this.ecfapprovalsummarysearch(this.ecfapppresentpage - 1)
    }
  }

  Resetecfappinventory() {
    this.ecfapprovalform.controls['crno'].reset(""),
      this.ecfapprovalform.controls['aptype'].reset(""),
      this.ecfapprovalform.controls['apstatus'].reset(""),
      this.ecfapprovalform.controls['minamt'].reset(""),
      this.ecfapprovalform.controls['maxamt'].reset(""),
      this.ecfapprovalsummarysearch(1);

  }

  batchappsummarysearch(pageNumber = 1) {
    this.SpinnerService.show()
    let data = this.batchapprovalform.value
    this.ecfservice.ecfapprovalbatchsummarySearch(this.batchapprovalform.value, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.batch_approval_data = result['data']
          let datapagination = result["pagination"];
          this.getbatchapptotalcount = datapagination?.count
          if (this.batch_approval_data.length === 0) {
            this.isbatchappsummarypage = false
          }
          if (this.batch_approval_data.length > 0) {
            this.has_appbatchpagenext = datapagination.has_next;
            this.has_appbatchpageprevious = datapagination.has_previous;
            this.batchapppresentpage = datapagination.index;
            this.isbatchappsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickbatchapp() {
    if (this.has_appbatchpagenext === true) {
      this.batchappsummarysearch(this.batchapppresentpage + 1)
    }
  }

  previousClickbatchapp() {
    if (this.has_appbatchpageprevious === true) {
      this.batchappsummarysearch(this.batchapppresentpage - 1)
    }
  }

  resetbatchapp() {
    this.batchapprovalform.controls['batchno'].reset(""),
      this.batchapprovalform.controls['batchstatus'].reset(""),
      this.batchapprovalform.controls['batchcount'].reset(""),
      // this.batchapprovalform.controls['fromdate'].reset(""),
      // this.batchapprovalform.controls['todate'].reset(""),
      this.batchappsummarysearch(1);

  }


  showadd() {
    let data = ''
    this.shareservice.ecfheaderedit.next(data)
    this.shareservice.editkey.next("create")
    this.shareservice.modificationFlag.next("create")
    this.ecfsummaryForm = false
    this.ecfcreateForm = true
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false;
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    return data;
  }
  apcreateback() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.commonInvViewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false;
    this.preparePaymentForm = false
    this.PreparepaymentForms = false;
    this.paymentfileForm = false;
    this.BounceSummaryForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = true
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APBounceForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.rptFormat = 1
    this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 22 || x.id == 49)
    this.dataclear('')
    this.overallreset()

  }


  backview() {
    this.ecfsummaryForm = true
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false;
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.summarysearch(1);
    this.batchsummarysearch(1);
  }

  appbackview() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = true
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.ecfapprovalsummarysearch(1);
    this.batchappsummarysearch(1);
  }


  detailview() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = true
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APCreateForm = false
    this.APECFmakeForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  ecfappdetailview() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = true
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  backviews() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = true
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    if (this.shareservice.batchviewdatas.value != "") {
      this.getApproveType(1)
      this.approveTypeForm.get('type').setValue(1)
    }
    else {
      this.getApproveType(2)
      this.approveTypeForm.get('type').setValue(2)
    }

  }

  submitmodify() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = true
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  ppbackviews() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = true
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.ppSummarySearch(1)
  }


  ecfcreateSubmit() { }
  ecfcreateCancel() {
    this.ecfsummaryForm = true
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.BounceSummaryForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.summarysearch(1);
    this.batchsummarysearch(1);
  }


  invsubmit() {
    this.ecfsummaryForm = true
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.BounceSummaryForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.summarysearch(1);
    this.batchsummarysearch(1);
  }


  invcancel() {
    this.modify = this.shareservice.apmodification.value
    if(this.modify =='modify'){
    this.APApproverInvoiceForm = true
    this.APECFmakeForm = false
    }else{
    this.APECFmakeForm = true
    this.APApproverInvoiceForm = false
    }
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.BounceSummaryForm = false
    this.InvoiceDetailForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    // this.ecfwiseMaker = false
    // this.invwiseMaker = false
    this.dataclear('')
    this.overallreset()
    this.overallreset_maker()
    // this.overallreset_approval()
    this.resetapinv()
    this.rptFormat = 1
    this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 22 || x.id == 49)
  }


  paymentdata: any
  liqdata: any
  // getpaystatus(crno) {
  //   this.SpinnerService.show();
  //   this.ecfservice.getpaymentstatus(crno)
  //     .subscribe(result => {
  //       this.SpinnerService.hide();
  //       if (result?.message =="This is direct Paid case") {
  //         this.paymentdata = []
  //         this.notification.showInfo("This is Direct Paid Case.So Payment Option can't be Available");
  //         return false;
  //       }else{
  //         this.paymentdata = result['data']
  //         let datas = this.paymentdata
  //         for(let i=0;i<datas.length;i++){
  //           this.liqdata = datas[i].liquedation_data
  //         }

  //       }
  //     }, error => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }
  batchviewid: any
  showbatchviewview(data, pageNumber = 1) {
    console.log("dataaaaaaa", data)
    this.batchviewid = data
    this.ecfservice.batchview(data, pageNumber)
      .subscribe(result => {
        console.log("viewresult", result)
        this.batchviewlist = result['data']
        let datapagination = result["pagination"];

        if (this.batchviewlist.length === 0) {
          this.isbatchviewpage = false
        }
        if (this.batchviewlist.length > 0) {
          this.has_bviewpagenext = datapagination.has_pagenext;
          this.has_bviewpageprevious = datapagination.has_pageprevious;
          this.bvpresentpage = datapagination.index;
          this.isbatchviewpage = true
        }
      })
  }

  nextClickbview() {
    if (this.has_bviewpagenext === true) {
      this.showbatchviewview(this.batchviewid, this.bvpresentpage + 1)
    }
  }

  previousClickbview() {
    if (this.has_bviewpageprevious === true) {
      this.showbatchviewview(this.batchviewid, this.bvpresentpage - 1)
    }
  }

  showview(data) {
    console.log("dataaaas", data)
    this.ecfheaderid = data.id
    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.shareservice.ecfviewdata.next(data)
    this.shareservice.crno.next(data?.crno)
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = true
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  showappview(data) {
    console.log("dataaaas", data)
    this.ecfheaderid = data.id
    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.shareservice.ecfviewdata.next(data)
    this.shareservice.crno.next(data?.crno)
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = true
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }


  batchid: any
  showecfview(data, text) {
    this.batchid = data.id
    let datas = {
      "batchno": data?.batchno,
      "batchamount": data?.batchamount,
      "batchcount": data?.batchcount,
      "batchdate": data?.batch_date,
      "raisername": data?.raisername,
      "raiserbranch": data?.branchname,
      "approvername": data?.approvername
    }
    // this.closebutton.nativeElement.click()
    this.shareservice.batchdatas.next(datas)
    this.shareservice.batchviewid.next(this.batchid)
    this.shareservice.batchdate.next(data.batch_date)
    this.shareservice.batchamt.next(data.batchamount)
    this.shareservice.batchviewdatas.next(data)
    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.shareservice.batchview.next(text)
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = true
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }




  delete(id) {
    this.SpinnerService.show()
    var answer = window.confirm("Are you sure to delete?");
    if (answer) {
      //some code
      this.ecfservice.ecfhdrdelete(id)
        .subscribe(result => {
          this.SpinnerService.hide();
          if (result.status == "success") {
            this.ecfservice.ppxdelete(id).subscribe(result => {
              let datas = result
            })
            this.notification.showSuccess("Deleted Successfully")
            this.summarysearch(1)
          } else {
            this.notification.showError(result.description)
            this.SpinnerService.hide();
            return false;
          }

        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }

        )
    }
    else {
      this.SpinnerService.hide();
      return false;
    }


  }

  showedit(data) {
    this.shareservice.ecfheaderdata.next(data)
    this.shareservice.ecfheaderedit.next(data?.id)
    this.shareservice.editkey.next('edit')
    this.shareservice.modificationFlag.next('edit')
    this.ecfsummaryForm = false
    this.ecfcreateForm = true
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }



  numberOnlyandDot(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  coverNotedownload(data) {
    this.cover_note_id = data.apheader_id
    this.ecf_type_id = data.aptype_id
    this.SpinnerService.show()
    if (this.ecf_type_id != 4) {
      this.ecfservice.ecfcoverNotedownload(this.cover_note_id)
        .subscribe((results) => {

          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "ExpenseClaimForm.pdf";
          link.click();
          this.SpinnerService.hide()
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }

        )
    } else {

      // this.ecfservice.coverNoteadvdownload(id)
      this.ecfservice.ecfcoverNotedownload(this.cover_note_id)
        .subscribe((results) => {

          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "ExpenseClaimForm.pdf";
          link.click();
          this.SpinnerService.hide()
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }

        )
    }


  }

  batchcovernotedownload(id) {
    this.ecfservice.batchcoverNotedownload(id)
      .subscribe((results) => {

        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "ExpenseClaimForm.pdf";
        link.click();
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  checkboxclick(ind) {
    console.log
  }
  batchArray = []
  commcheck: any;
  ecftypecheck: any;
  onselectionchange(e, data) {
    data.select = true
    this.commcheck = data?.commodity_id?.id
    this.ecftypecheck = data?.aptype_id
    console.log("e", e)
    console.log("e1", e.checked)
    console.log("data", data)
    if (e.checked == true) {
      this.batchArray.push(data)
    } else {
      for (let i = 0; i < this.batchArray.length; i++) {
        if (this.batchArray[i].id == data.id) {
          this.batchArray.splice(i, 1)
        }

      }
      if (this.batchArray.length <= 0) {
        this.commcheck = ""
        this.ecftypecheck = ""
      }
    }
    console.log("batcharray", this.batchArray)

  }
  showapprovepop: boolean = false
  commodityname: any
  checkbatch() {
    this.ApproverForm.controls['approvedby'].reset("");
    if (this.batchArray?.length <= 0) {
      this.showapprovepop = false
      this.notification.showError("Please Select Any One Data");
      return false;
    } else {
      this.commodityname = this.batchArray[0].commodity_id?.name
      this.showapprovepop = true
    }
  }

  batchsubmit() {

    const dataas = this.ApproverForm?.value
    if (dataas.approvedby == "" || dataas.approvedby == null || dataas.approvedby == undefined) {
      this.notification.showError("Please Choose Approver Name");
      return false
    }
    if (typeof (dataas?.approvedby) == 'object') {
      dataas.approvedby = dataas?.approvedby?.id
    } else if (typeof (dataas?.approvedby) == 'number') {
      dataas.approvedby = dataas?.approvedby
    } else {
      this.notification.showError("Please Choose Anyone Approver Name From the Dropdown");
      return false;
    }
    console.log("batcharray1", this.batchArray)
    for (let x of this.batchArray) {
      let id: FormControl = new FormControl('');
      const batchFormArray = this.batchsubmitform.get("ecfhdr") as FormArray;
      id.setValue(x?.id)
      batchFormArray.push(new FormGroup({
        id: id
      }))
    }
    let datas = {
      "commodity_id": this.batchArray[0]?.commodity_id?.id,
      "ecftype": 1,
      "doctype": this.batchArray[0]?.aptype_id,
      "remark": this.batchArray[0]?.remark,
      "branch": this.batchArray[0]?.branch[0]?.id,
      "ecfhdr": this.batchsubmitform?.value?.ecfhdr,
      "approvedby_id": dataas?.approvedby
    }
    console.log("datas", datas)
    this.ecfservice.submitbatch(datas).subscribe(result => {
      console.log("resultssss", result)
      if (result?.id != undefined) {
        this.notification.showSuccess("Success");
        this.closedbutton.nativeElement.click();
        // for(let i = 0;i<this.ecf_summary_data.length;i++){
        //   this.ecf_summary_data[i].select = false
        // }
        this.batchArray = [];
        this.commcheck = ""
        this.ecftypecheck = ""
        this.summarysearch(1)

      } else {
        this.notification.showError(result?.description)
        return false;
      }
    })
  }

  appback() {
    this.closedbutton.nativeElement.click()
  }

  getApproveType(id) {
    if (id == 1) {
      this.batchSummarySearch();
    }
    else {
      this.approvalECFSearch();
    }
  }
  batchSummary: any
  // searchData: any ={}
  apbatchSearchForm: any
  batchSummarySearch(pageNumber = 1) {
    if (this.apbatchSearchForm) {
      let search = this.apbatchSearchForm.value
      if ((search.fromdate !== null && search.fromdate !== '')) {
        var fromDate = this.datePipe.transform(search.fromdate, 'yyyy-MM-dd')
        this.searchData.fromdate = fromDate
      }
      else {
        this.searchData.fromdate = ""
      }
      if ((search.todate !== null && search.todate !== '')) {
        var toDate = this.datePipe.transform(search.todate, 'yyyy-MM-dd')
        this.searchData.todate = toDate
      }
      else {
        this.searchData.todate = ""
      }
      this.searchData.batchcount = search.batchcount ? search.batchcount : "";
      this.searchData.batchno = search.batchno ? search.batchno : "";
      this.searchData.batchstatus = search.batchstatus ? search.batchstatus : "";

    }

    this.SpinnerService.show()
    let data = this.apbatchSearchForm.value
    this.ecfservice.approvedbatchSearch(this.searchData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.batchSummary = result['data']
          let datapagination = result["pagination"];
          this.getapbatchtotalcount = datapagination?.count
          if (this.batchSummary.length === 0) {
            this.isapbatchsummarypage = false
          }
          if (this.batchSummary.length > 0) {
            this.has_apbatchpagenext = datapagination.has_next;
            this.has_apbatchpageprevious = datapagination.has_previous;
            this.apbatchpresentpage = datapagination.index;
            this.isapbatchsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickapbatch() {
    if (this.has_apbatchpagenext === true) {
      this.batchSummarySearch(this.apbatchpresentpage + 1)
    }
  }

  previousClickapbatch() {
    if (this.has_apbatchpageprevious === true) {
      this.batchSummarySearch(this.apbatchpresentpage - 1)
    }
  }

  resetapbatch() {
    this.apbatchSearchForm.controls['batchno'].reset(""),
      this.apbatchSearchForm.controls['fromdate'].reset(""),
      this.apbatchSearchForm.controls['todate'].reset(""),
      this.apbatchSearchForm.controls['batchcount'].reset(""),
      this.batchSummarySearch(1);
  }

  approvalECFSummary: any
  // searchData: any ={}
  apECFSearchForm: any
  ecfApprovalCount: any
  isapECFsummarypage: boolean = true;
  apECFpresentpage: number = 1;

  approvalECFSearch(pageNumber = 1) {
    this.SpinnerService.show()
    let data = this.apECFSearchForm.value
    if (data.maxamt != "" && data.minamt == "") {
      this.notification.showError("Please Enter Min Amount")
      this.SpinnerService.hide()
      return false
    }
    if (data.maxamt == "" && data.minamt != "") {
      this.notification.showError("Please Enter Max Amount")
      this.SpinnerService.hide()
      return false
    }
    this.ecfservice.approvedECFSearch(this.apECFSearchForm?.value, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.approvalECFSummary = result['data']
          let datapagination = result["pagination"];
          this.ecfApprovalCount = datapagination?.count
          if (this.approvalECFSummary.length === 0) {
            this.isapECFsummarypage = false
          }
          if (this.approvalECFSummary.length > 0) {
            this.has_apbatchpagenext = datapagination.has_next;
            this.has_apbatchpageprevious = datapagination.has_previous;
            this.apECFpresentpage = datapagination.index;
            this.isapECFsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickapECF() {
    if (this.has_apbatchpagenext === true) {
      this.approvalECFSearch(this.apECFpresentpage + 1)
    }
  }

  previousClickapECF() {
    if (this.has_apbatchpageprevious === true) {
      this.approvalECFSearch(this.apECFpresentpage - 1)
    }
  }

  resetapECF() {
    this.apECFSearchForm.controls['crno'].reset(""),
      this.apECFSearchForm.controls['aptype'].reset(""),
      this.apECFSearchForm.controls['apstatus'].reset(""),
      this.apECFSearchForm.controls['minamt'].reset(""),
      this.apECFSearchForm.controls['maxamt'].reset(""),
      this.batchSummarySearch(1);
    this.approvalECFSearch(1);
  }

  batchView(data) {
    this.shareservice.batchviewdatas.next(data)
    this.shareservice.ecfwiseApprove.next('')
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = true
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.paymentfileForm = false
    this.BounceSummaryForm = false
    this.BounceDetailForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.commonInvViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  ecfwiseAPapprove(data) {
    this.shareservice.batchviewdatas.next('')
    this.shareservice.ecfwiseApprove.next(data)
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = true
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.paymentfileForm = false
    this.BounceSummaryForm = false
    this.BounceDetailForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  batchEdit(data) {
    this.shareservice.ecfheaderedit.next(data?.id)
    this.router.navigate(['ECFAP/createecf'])
  }
  ppSummary: any;
  getpptotalcount: any
  ppSummarySearch(pageNumber = 1) {
    // if(this.PPSearchForm){
    let searchData = this.PPSearchForm.value
    if (searchData.apinvoiceheader_crno == null || searchData.apinvoiceheader_crno == undefined || searchData.apinvoiceheader_crno == "") {
      delete searchData.apinvoiceheader_crno
    }

    if (searchData.crno == null || searchData.crno == undefined || searchData.crno == "") {
      delete searchData.crno
    }

    if (searchData.invoice_no == null || searchData.invoice_no == undefined || searchData.invoice_no == "") {
      delete searchData.invoice_no
    }
    if (searchData.invoice_amount == null || searchData.invoice_amount == undefined || searchData.invoice_amount == "") {
      delete searchData.invoice_amount
    }
    if (searchData.ecftype == null || searchData.ecftype == undefined || searchData.ecftype == "") {
      delete searchData.ecftype
    }

    if (typeof (searchData.supplier_id) == 'object') {
      searchData.supplier_id = searchData?.supplier_id?.id
    } else if (typeof (searchData.supplier_id) == 'number') {
      searchData.supplier_id = searchData?.supplier_id
    } else if (searchData.supplier_id == null || searchData.supplier_id == undefined || searchData.supplier_id == "") {
      delete searchData.supplier_id
    }
    if (typeof (searchData.raiserbranch_id) == 'object') {
      searchData.raiserbranch_id = searchData?.raiserbranch_id?.id
    } else if (typeof (searchData.raiserbranch_id) == 'number') {
      searchData.raiserbranch_id = searchData?.raiserbranch_id
    } else if (searchData.raiserbranch_id == null || searchData.raiserbranch_id == undefined || searchData.raiserbranch_id == "") {
      delete searchData.raiserbranch_id
    }
    if (typeof (searchData.raiser_name) == 'object') {
      searchData.raiser_name = searchData?.raiser_name?.id
    } else if (typeof (searchData.raiser_name) == 'number') {
      searchData.raiser_name = searchData?.raiser_name
    } else if (searchData.raiser_name == null || searchData.raiser_name == undefined || searchData.raiser_name == "") {
      delete searchData.raiser_name
    }
    //   if((search.fromdate !== null && search.fromdate !== '')  ){
    //     var fromDate=this.datePipe.transform(search.fromdate, 'yyyy-MM-dd')
    //     this.searchData.fromdate=fromDate
    //   }
    //   else
    //   {
    //     this.searchData.fromdate=""
    //   }
    //   if((search.todate !== null && search.todate !== '')  ){
    //     var toDate=this.datePipe.transform(search.todate, 'yyyy-MM-dd')
    //     this.searchData.todate=toDate
    //   }
    //   else
    //   {
    //     this.searchData.todate=""
    //   }
    //   this.searchData.batchcount = search.batchcount ? search.batchcount : "";
    //   this.searchData.batchno = search.batchno ? search.batchno : "";
    //   this.searchData.batchstatus = search.batchstatus ? search.batchstatus : "";

    // }

    // this.SpinnerService.show()
    // let data = this.PPSearchForm.value
    // this.ecfservice.approvedbatchSearch(this.searchData, pageNumber)
    this.SpinnerService.show()
    this.ecfservice.getpreparepayment(searchData, pageNumber)
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result['data'] != undefined) {
          this.ppSummary = result['data']
          console.log("ppsummary", this.ppSummary)
          let datapagination = result["pagination"];
          this.getpptotalcount = datapagination?.count
          this.length_payment = datapagination?.count
          if (this.ppSummary.length === 0) {
            this.isppsummarypage = false
          }
          if (this.ppSummary.length > 0) {
            this.has_pppagenext = datapagination.has_next;
            this.has_pppageprevious = datapagination.has_previous;
            this.pppresentpage = datapagination.index;
            this.isppsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickpp() {
    if (this.has_pppagenext === true) {
      this.ppSummarySearch(this.pppresentpage + 1)
    }
  }

  previousClickpp() {
    if (this.has_pppageprevious === true) {
      this.ppSummarySearch(this.pppresentpage - 1)
    }
  }

  resetpp() {
    this.PPSearchForm.controls['supplier_id'].reset(""),
      this.PPSearchForm.controls['crno'].reset(""),
      this.PPSearchForm.controls['apinvoiceheader_crno'].reset(""),
      this.PPSearchForm.controls['ecftype'].reset(""),
      this.PPSearchForm.controls['raiserbranch_id'].reset(""),
      this.PPSearchForm.controls['raiser_name'].reset(""),
      this.PPSearchForm.controls['invoice_no'].reset(""),
      this.PPSearchForm.controls['invoice_amount'].reset(""),
      this.ppSummarySearch(1);
  }

  pfSummary: any;
  getpftotalcount: any
  expand_Payfile = false

  PFSummarySearch(e, pageNumber = 1) {
    // if(this.PFSearchForm){

    let searchData = this.PFSearchForm.value

    if (searchData.apinvoiceheader_crno == null || searchData.apinvoiceheader_crno == undefined || searchData.apinvoiceheader_crno == "") {
      delete searchData.apinvoiceheader_crno
    }

    if (searchData.invoice_no == null || searchData.invoice_no == undefined || searchData.invoice_no == "") {
      delete searchData.invoice_no
    }
    if (searchData.invoice_amount == null || searchData.invoice_amount == undefined || searchData.invoice_amount == "") {
      delete searchData.invoice_amount
    }
    if (searchData.ecftype == null || searchData.ecftype == undefined || searchData.ecftype == "") {
      delete searchData.ecftype
    }

    if (typeof (searchData.supplier_id) == 'object') {
      searchData.supplier_id = searchData?.supplier_id?.id
    } else if (typeof (searchData.supplier_id) == 'number') {
      searchData.supplier_id = searchData?.supplier_id
    } else if (searchData.supplier_id == null || searchData.supplier_id == undefined || searchData.supplier_id == "") {
      delete searchData.supplier_id
    }
    if (typeof (searchData.raiserbranch_id) == 'object') {
      searchData.raiserbranch_id = searchData?.raiserbranch_id?.id
    } else if (typeof (searchData.raiserbranch_id) == 'number') {
      searchData.raiserbranch_id = searchData?.raiserbranch_id
    } else if (searchData.raiserbranch_id == null || searchData.raiserbranch_id == undefined || searchData.raiserbranch_id == "") {
      delete searchData.raiserbranch_id
    }
    if (typeof (searchData.raiser_name) == 'object') {
      searchData.raiser_name = searchData?.raiser_name?.id
    } else if (typeof (searchData.raiser_name) == 'number') {
      searchData.raiser_name = searchData?.raiser_name
    } else if (searchData.raiser_name == null || searchData.raiser_name == undefined || searchData.raiser_name == "") {
      delete searchData.raiser_name
    }
    //   if((search.fromdate !== null && search.fromdate !== '')  ){
    //     var fromDate=this.datePipe.transform(search.fromdate, 'yyyy-MM-dd')
    //     this.searchData.fromdate=fromDate
    //   }
    //   else
    //   {
    //     this.searchData.fromdate=""
    //   }
    //   if((search.todate !== null && search.todate !== '')  ){
    //     var toDate=this.datePipe.transform(search.todate, 'yyyy-MM-dd')
    //     this.searchData.todate=toDate
    //   }
    //   else
    //   {
    //     this.searchData.todate=""
    //   }
    //   this.searchData.batchcount = search.batchcount ? search.batchcount : "";
    //   this.searchData.batchno = search.batchno ? search.batchno : "";
    //   this.searchData.batchstatus = search.batchstatus ? search.batchstatus : "";

    // }

    // this.SpinnerService.show()
    // let data = this.PPSearchForm.value
    // this.ecfservice.approvedbatchSearch(this.searchData, pageNumber)
    this.SpinnerService.show()
    this.SummaryApipaymentObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/inv_pymtfile",
      data: searchData
    }
    this.ecfservice.paymentfilesearch(searchData, pageNumber)
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result['data'] != undefined) {
          this.pfSummary = result['data']
          console.log("pfsummary", this.pfSummary)
          let datapagination = result["pagination"];
          this.getpftotalcount = datapagination?.count
          this.length_pf = datapagination?.count
          if (this.pfSummary.length === 0) {
            this.ispfsummarypage = false
          }
          if (this.pfSummary.length > 0) {
            this.has_pfpagenext = datapagination.has_next;
            this.has_pfpageprevious = datapagination.has_previous;
            this.pfpresentpage = datapagination.index;
            this.ispfsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
    this.expand_Payfile = false

  }

  nextClickpf() {
    if (this.has_pfpagenext === true) {
      this.PFSummarySearch(this.pfpresentpage + 1)
    }
  }

  previousClickpf() {
    if (this.has_pfpageprevious === true) {
      this.PFSummarySearch(this.pfpresentpage - 1)
    }
  }

  resetpf() {
    this.PFSearchForm.controls['supplier_id'].reset(""),
      this.PFSearchForm.controls['apinvoiceheader_crno'].reset(""),
      this.PFSearchForm.controls['ecftype'].reset(""),
      this.PFSearchForm.controls['raiserbranch_id'].reset(""),
      this.PFSearchForm.controls['raiser_name'].reset(""),
      this.PFSearchForm.controls['invoice_no'].reset(""),
      this.PFSearchForm.controls['invoice_amount'].reset(""),
      this.PFSummarySearch(1);
  }

  ppView(data) {
    this.shareservice.batchviewdatas.next(data)
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = true
    this.PreparepaymentForms = false
    this.paymentfileForm = false
    this.BounceSummaryForm = false
    this.BounceDetailForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }



  ppEdit(data) {
    this.shareservice.ecfheaderedit.next(data?.id)
    this.router.navigate(['ECFAP/createecf'])
  }

  ppBtnEnable = false
  hdrselFlag = [false, false, false, false, false, false, false, false, false, false]
  hdrselect(e, i, id) {
    this.ecfservice.lockcheck(id, 4)
      .subscribe(result => {
        if (result['status'] == "success") {
          this.ppSummary[i].select = true
          if (e.checked == true) {
            this.hdrselFlag[i] = true
            this.ppSummary[i].select = true

          }
          else {
            this.hdrselFlag[i] = false
            this.ppSummary[i].select = false
          }
          let flag = false
          for (let x = 0; x < this.ppSummary.length; x++) {
            if (this.hdrselFlag[x] == true) {
              flag = true
              break
            }
          }
          if (flag)
            this.ppBtnEnable = true
          else
            this.ppBtnEnable = false
        }
        else {
          this.notification.showWarning(result['message'])
        }
      })
  }


  preparePay() {
    let flag = false
    for (let x = 0; x < this.ppSummary.length; x++) {
      if (this.hdrselFlag[x] == true) {
        flag = true
        break
      }
    }
    if (!flag) {
      this.notification.showError("Please Select an invoice.")
    }
    else {
      if (this.SubmitPreparepayForm.value.remarks == '') {
        this.notification.showInfo("please enter remarks.")
        return false
      }
      this.SpinnerService.show()
      let data = this.ppSummary.filter(x => x.select == true)

      for (let i = 0; i < data.length; i++) {
        this.ecfservice.getDebitCredit(data[i].id, 0, 2)
          .subscribe(result => {
            console.log("Credit result", data[i].id, "-> ", result)
            if (result.code == undefined) {
              let dat = result.data
              let creditres = dat.filter(x => x.is_display == "YES" && (x?.paymode?.code == "PM005" || x?.paymode?.code == "PM008" || x?.paymode?.code == "PM004" || x?.paymode?.code == "PM001"))
              console.log("creditres", creditres)
              if (creditres.length > 0) {
                let paymentData: any
                if (creditres[0]?.paymode?.code == "PM005") {
                  paymentData = {
                    "paymentheader_date": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                    "paymentheader_amount": creditres[0]?.amount,
                    "paymode": "NEFT",
                    "bankdetails_id": creditres[0]?.debit_bankdetails.id,
                    "beneficiaryname": creditres[0]?.supplierpayment_details["data"][0]?.beneficiary,
                    "bankname": creditres[0]?.supplierpayment_details["data"][0]?.bank_id?.name,
                    "ifsc_code": creditres[0]?.supplierpayment_details["data"][0].branch_id?.ifsccode,
                    "accno": creditres[0]?.supplierpayment_details["data"][0]?.account_no,
                    "debitbankacc": creditres[0]?.supplierpayment_details["data"][0]?.account_no,
                    "remarks": this.SubmitPreparepayForm?.value?.remarks,
                    "payment_dtls": [{ "apinvhdr_id": data[i]?.id, "apcredit_id": creditres[0]?.id, "paymntdtls_amt": creditres[0]?.amount }]
                  }
                }

                if (creditres[0]?.paymode?.code == "PM004") {

                  paymentData = {
                    "paymentheader_date": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                    "paymentheader_amount": creditres[0]?.amount,
                    "paymode": "NEFT",
                    "bankdetails_id": creditres[0]?.debit_bankdetails.id,
                    "beneficiaryname": creditres[0]?.employeeaccount_details?.beneficiary_name,
                    "bankname": creditres[0]?.employeeaccount_details?.bank_name,
                    "ifsc_code": creditres[0]?.employeeaccount_details?.bankbranch?.ifsccode,
                    "accno": creditres[0]?.employeeaccount_details?.account_number,
                    "debitbankacc": creditres[0]?.employeeaccount_details?.account_number,
                    "remarks": this.SubmitPreparepayForm?.value?.remarks,
                    "payment_dtls": [{ "apinvhdr_id": data[i]?.id, "apcredit_id": creditres[0]?.id, "paymntdtls_amt": creditres[0]?.amount }]
                  }
                }
                if (creditres[0]?.paymode?.code == "PM001" || creditres[0]?.paymode?.code == "PM008") {

                  paymentData = {
                    "paymentheader_date": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                    "paymentheader_amount": creditres[0]?.amount,
                    "paymode": "NEFT",
                    "bankdetails_id": creditres[0]?.debit_bankdetails.id,
                    "beneficiaryname": "EXPENSES MANAGEMENT CELL",
                    "bankname": "KARUR VYSYA BANK",
                    "ifsc_code": "KVBL0001903",
                    "accno": creditres[0]?.refno,
                    "debitbankacc": creditres[0]?.refno,
                    "remarks": this.SubmitPreparepayForm?.value?.remarks,
                    "payment_dtls": [{ "apinvhdr_id": data[i]?.id, "apcredit_id": creditres[0]?.id, "paymntdtls_amt": creditres[0]?.amount }]
                  }
                }

                this.ecfservice.preparePayment(paymentData)
                  .subscribe(result => {
                    console.log("result", result)
                    this.SpinnerService.hide()
                    if (result.status != undefined) {
                      this.notification.showError(result?.message)
                      return false
                    } else {
                      if (i == data.length - 1) {
                        this.notification.showSuccess("Saved Successfully!")
                        this.SubmitPreparepayForm.patchValue({ remarks: "" })
                        this.ppSummary = []
                        this.ppSummarySearch();
                        this.hdrselFlag = [false, false, false, false, false, false, false, false, false, false]
                      }
                    }
                  },
                    error => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  )
              }
            }

          })

      }
      // this.notification.showSuccess("Saved Successfully!")
      this.ppbackviews()
    }

  }




  getbouncetotalcount: any
  isbouncesummarypage: boolean
  has_bouncepageprevious = false
  has_bouncepagenext = false
  pagesizebounce = 10;
  bounceSummarySearch(pageNumber = 1) {
    if (this.bounceForm) {
      let search = this.bounceForm.value

      this.searchData.crno = search.crno;
      this.searchData.aptype = search.aptype;
      this.searchData.minamt = search.minamt;
      this.searchData.maxamt = search.maxamt;
      for (let i in this.searchData) {
        if (this.searchData[i] === null || this.searchData[i] === "") {
          delete this.searchData[i];
        }
      }
    }
    else {
      this.searchData = {}
    }

    this.SpinnerService.show()
    this.ecfservice.getBounceSummary(this.searchData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.bounceSummary = result['data']
          let datapagination = result["pagination"];
          this.getbouncetotalcount = datapagination?.count
          if (this.bounceSummary.length === 0) {
            this.isbouncesummarypage = false
          }
          if (this.bounceSummary.length > 0) {
            this.has_bouncepagenext = datapagination.has_next;
            this.has_bouncepageprevious = datapagination.has_previous;
            this.bouncepresentpage = datapagination.index;
            this.isbouncesummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickbounce() {
    if (this.has_bouncepagenext === true) {
      this.bounceSummary(this.bouncepresentpage + 1)
    }
  }

  previousClickbounce() {
    if (this.has_bouncepageprevious === true) {
      this.bounceSummary(this.bouncepresentpage - 1)
    }
  }

  resetbounce() {
    this.bounceForm.controls['crno'].reset(),
      this.bounceForm.controls['aptype'].reset(),
      this.bounceForm.controls['minamt'].reset(),
      this.bounceForm.controls['maxamt'].reset(),
      this.bounceSummarySearch(1);
  }

  bounceView(data) {
    this.shareservice.bounceapdata.next(data)
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.BounceDetailForm = true
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.CommonSummaryForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }


  bouncebackviews() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = true
    this.BounceDetailForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.bounceSummarySearch(1)
    this.dataclear('')
    this.overallreset()
    this.rptFormat = 3
    this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 37 || x.id == 46)
  }


  pvno: any
  pvnoget(list) {
    this.popupopen13()
    this.pvno = list?.pvno
  }
  utrsubmit() {
    let utrdata = this.PaymentFileForm.value
    if (utrdata?.callbackrefno == null || utrdata?.callbackrefno == "" || utrdata?.callbackrefno == undefined) {
      this.notification.showError("Please Enter UTR No")
      return false;
    }
    utrdata.pvno = this.pvno
    this.SpinnerService.show()
    this.ecfservice.paymentfilesubmit(utrdata)
      .subscribe(result => {
        this.SpinnerService.hide()
        console.log("pfresult", result)
        if (result?.message == "Successfully Updated") {
          this.notification.showSuccess("Paid Successfully")
          this.closedpaybutton.nativeElement.click()
          this.PaymentFileForm.controls['callbackrefno'].reset("")
          this.PFSummarySearch(1)
        } else {
          this.notification.showError(result?.description)
          return false
        }
      })
  }

  utrback() {
    this.closedpaybutton.nativeElement.click()
    this.PaymentFileForm.controls['callbackrefno'].reset("")
  }

  suppliername() {
    let suppkeyvalue: String = "";
    this.getsupplier(suppkeyvalue);

    this.PFSearchForm.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;

      })

  }

  ppsuppliername() {
    let ppsuppkeyvalue: String = "";
    this.getppsupplier(ppsuppkeyvalue);

    this.PPSearchForm.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ppsupplierList = datas;

      })

  }
  pfsuppliername() {
    let ppsuppkeyvalue: String = "";
    this.getppsupplier(ppsuppkeyvalue);

    this.PFSearchForm.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ppsupplierList = datas;

      })

  }
  private getsupplier(suppkeyvalue) {
    this.ecfservice.getsupplierscroll(suppkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      })
  }

  private getppsupplier(ppsuppkeyvalue) {
    this.ecfservice.getsupplierscroll(ppsuppkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ppsupplierList = datas;
      })
  }

  public displayFnSupplier(supplier?: supplierss): string | undefined {
    return supplier ? supplier.name : undefined;
  }

  get supplier() {
    return this.PFSearchForm.get('supplier_id');
  }

  public displayFnppSupplier(ppsupplier?: supplierss): string | undefined {
    return ppsupplier ? ppsupplier.name : undefined;
  }

  get ppsupplier() {
    return this.PPSearchForm.get('supplier_id');
  }

  // supplierScroll() {

  //   setTimeout(() => {
  //     if (
  //       this.matsuppAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matsuppAutocomplete.panel
  //     ) {
  //       fromEvent(this.matsuppAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(() => this.matsuppAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(()=> {
  //           const scrollTop = this.matsuppAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matsuppAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matsuppAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_nextsupp === true) {
  //               this.ecfservice.getsupplierscroll(this.supplierInput.nativeElement.value, this.currentpagesupp + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.supplierList = this.supplierList.concat(datas);
  //                   if (this.supplierList.length >= 0) {
  //                     this.has_nextsupp = datapagination.has_next;
  //                     this.has_previoussupp = datapagination.has_previous;
  //                     this.currentpagesupp = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  defaultHeight = 30;
  prevHeight = 0;
  listenScroll(evt) {

    let value = evt.target;
    const offsetHeight = value.offsetHeight;
    const scrollHeight = value.scrollHeight;
    const scrollTop = value.scrollTop;//current scrolled distance
    var height = this.defaultHeight;
    console.log("prev", this.prevHeight)
    console.log("current", scrollTop)
    if (this.prevHeight > scrollTop) {
      height -= 0.5
    }
    else {
      height += 0.5
    }
    this.prevHeight = scrollTop;

    console.log("prev_updated", this.prevHeight)
    if (height <= 30) {
      height = 30
    }
    else if (height > 70) {
      height = 70;
    }
    this.defaultHeight = height;
  }

  PPsupplierScroll() {

    setTimeout(() => {
      if (
        this.matsuppsAutocomplete &&
        this.autocompleteTrigger &&
        this.matsuppsAutocomplete.panel
      ) {
        fromEvent(this.matsuppsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matsuppsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matsuppsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsuppsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsuppsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextppsupp === true) {
                this.ecfservice.getsupplierscroll(this.supplierInputs.nativeElement.value, this.currentpageppsupp + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ppsupplierList = this.ppsupplierList.concat(datas);
                    if (this.ppsupplierList.length >= 0) {
                      this.has_nextppsupp = datapagination.has_next;
                      this.has_previousppsupp = datapagination.has_previous;
                      this.currentpageppsupp = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  invdtlview() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = true
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false;
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.InvoiceDetailForm = true
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }
  gotoinvdtlview() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = true
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  gotoappinvdtlview() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = true
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  movetodetails() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = true
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false;
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  movetoappdetails() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false;
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = true
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  movtodtl() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = true
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }


  gotoapapproval() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = true
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }

  gotoheader() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.InvoiceDetailApprovalForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = true
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
  }
  iscommonsummarypage: boolean
  has_commonpageprevious = false
  has_commonpagenext = false
  pagesizecommon = 10;
  getcommontotalcount: any
  expand_Common = false

  commonSummarySearch(value, pageNumber = 1) {
    {
      this.searchData = {};
      
      if (this.commonForm) {
        let search = this.commonForm.value

        this.searchData.crno = search.crno;
        this.searchData.batch_no = search.batch_no;
        this.searchData.invoiceheader_crno = search.invoiceheader_crno;
        if (value == 'ecf') {
          this.searchData['aptype'] = this.commnvalue?.id;
          this.isecftyact = true;
        }
        else if (value == 'supplier') {
          this.issupact = true;
          this.searchData['supplier_id'] = this.commnvalue?.id
        }
        else if (value == 'raiser') {
          this.israiact = true;
          this.searchData['raiser_name'] = this.commnvalue?.id
        }
        else if (value == 'raiserbr') {
          this.israibract = true;
          this.searchData['raiserbranch_id'] = this.commnvalue?.id
        }
        else if (value == 'invsts') {
          this.isinvstsact = true;
          this.searchData['invoice_status'] = this.commnvalue?.id
        }
        // this.searchData.raiser_name = search.raiser_name.id;
        // this.searchData.raiserbranch_id = search.raiserbranch_id.id;
        if (search.invoice_no != '' && search.invoice_no != null && search.invoice_no != undefined) {
          this.searchData['invoice_no'] = search.invoice_no;
          this.isinvnoact = true;
        }
        if (search.minamt !== '' && search.minamt !== null && search.minamt !== undefined
          && search.maxamt !== '' && search.maxamt !== null && search.maxamt !== undefined) {
          // this.searchData['invoice_amount'] = search.invoice_amount;
          this.searchData.minamt = search.minamt;
          this.searchData.maxamt = search.maxamt; this.isinamtac = true;
        }

        // this.searchData.invoice_no = search.invoice_no;
        // this.searchData.invoice_amount = search.invoice_amount;
        this.searchData.minamt = search.minamt;
        this.searchData.maxamt = search.maxamt;
        this.searchData.is_originalinvoice = search.is_originalinvoice
        // this.searchData.supplier_id = search.supplier_id.id
        this.searchData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd');
        this.searchData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
        this.searchData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
        // this.searchData.invoice_status = search.invoice_status;

        for (let i in this.searchData) {
          if (this.searchData[i] === null || this.searchData[i] === "" || this.searchData[i] == undefined) {
            delete this.searchData[i];
          }
        }
      }
      else {
        this.searchData = {}
      }

      if (this.searchData?.from_date != undefined && this.searchData?.to_date == undefined) {
        this.notification.showError("Please select To Date")
        return false
      }
      if (this.searchData?.to_date != undefined && this.searchData?.from_date == undefined) {
        this.notification.showError("Please select From Date")
        return false
      }

      this.SpinnerService.show()
      if (pageNumber == 1) {
        this.pageIndex_common = 0;
      }

      // this.SummaryApicommonObjNew = {
      //   method: "post",
      //   url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
      //   params: "&apflag=1",
      //   data: this.searchData,OverallCount: "Total Count"
      // }

      this.ecfservice.getAPCommonSummary(this.searchData, pageNumber)
        .subscribe(result => {
          if (result['data'] != undefined) {
            this.commonSummary = result['data']
            let datapagination = result["pagination"];
            this.getcommontotalcount = datapagination?.count
            this.length_common = datapagination?.count
            if (this.commonSummary.length === 0) {
              this.iscommonsummarypage = false
            }
            if (this.commonSummary.length > 0) {
              this.has_commonpagenext = datapagination.has_next;
              this.has_commonpageprevious = datapagination.has_previous;
              this.commonpresentpage = datapagination.index;
              this.iscommonsummarypage = true
              this.commnvalue = ''
              this.commonForm.controls['aptype'].reset('')
              this.commonForm.controls['invoice_status'].reset('')
              this.cosearch('')
            }

            else {
              this.length_common = 0;
              this.iscommonsummarypage = false
            }

            this.SpinnerService.hide()
          } else {
            this.notification.showError(result?.message)
            this.SpinnerService.hide()
            return false
          }
        },

          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }

        )
    }
    this.expand_Common = false
  }

  nextClickcommon() {
    if (this.has_commonpagenext === true) {
      this.commonSummarySearch('', this.commonpresentpage + 1)
    }
  }

  previousClickcommon() {
    if (this.has_commonpageprevious === true) {
      this.commonSummarySearch('', this.commonpresentpage - 1)
    }
  }

  resetcommon() {
    this.commonForm.controls['crno'].reset(""),
      this.commonForm.controls['aptype'].reset(""),
      this.commonForm.controls['minamt'].reset(""),
      this.commonForm.controls['maxamt'].reset(""),
      this.commonForm.controls['batch_no'].reset(""),
      this.commonForm.controls['invoiceheader_crno'].reset(""),
      this.commonForm.controls['raiser_name'].reset(""),
      this.commonForm.controls['raiserbranch_id'].reset(""),
      this.commonForm.controls['invoice_no'].reset(""),
      this.commonForm.controls['invoice_amount'].reset(""),
      this.commonForm.controls['from_date'].reset(""),
      this.commonForm.controls['to_date'].reset(""),
      this.commonForm.controls['apinvoiceheaderstatus_id'].reset(""),
      // this.commonForm.controls['is_originalinvoice'].reset("")
      this.commonForm.controls['supplier_id'].reset(""),
      this.commonForm.controls['invoice_status'].reset(""),
      this.commonSummarySearch('', 1);
  }
  commonView(data) {
    if (this.commonForm.value.apinvoiceheaderstatus_id == 11) {
      this.bounceView(data);
    }
  }
  raiserBr: any;
  backdata: any
  invheaderidd: any
  api_type: number
  is_lockapicall: boolean = true
  
  Emppanel: any;
  InvNopanel: any;
  BranchGSTpanel: any;
  Pmdpanel: any;
  InvDatepanel: any;
  InvAmtpanel: any;
  TaxableAmtpanel: any;
  Statuspanel: any;
  Supplierpanel: any;
  SupGSTpanel: any;
  Service_typepanel: any;
  Recur_fromdatepanel: any;
  Recur_todatepanel: any;
  Gstpanel: any;
  Is_pcapanel: any;
  Pca_nopanel: any;
  Is_recurpanel: any;
  is_pca = ""
  Is_capitalized:any

  linkView(data, tdata) {
    if (tdata == "bounceview") {
      this.is_lockapicall = false
      this.api_type = 3
      this.APapprovesubmitform.controls['remarks'].reset("")
    }
    else if (tdata == "apapproverview") {
      this.is_lockapicall = true
      this.api_type = 2
      this.APapprovesubmitform.controls['remarks'].reset("")
    }
    else {
      this.is_lockapicall = false
    }
    if (this.is_lockapicall != false) {
      this.SpinnerService.show();
      this.ecfservice.lockcheck(data.id, this.api_type)
        .subscribe(result => {
          this.SpinnerService.hide();
          if (result['status'] == "success") {
            this.backdata = tdata
            this.invheaderidd = data.id
            this.shareservice.invheaderid.next(data.id)
            this.shareservice.invhdrstatus.next(data.apinvoicehdr_status.text)
            this.apinvHeader_id = data.id
            console.log("linkview if ------", this.apinvHeader_id)
            this.raiserBr = data.raiserbranch_branch.name
            this.ecfheaderid = data.apheader_id
            this.shareservice.crno.next(data?.crno)
            this.ecfsummaryForm = false
            this.ecfcreateForm = false
            this.ecfviewForm = false
            this.batchviewForm = false

            this.InvoiceDetailForm = false
            this.commonInvViewForm = true

            if (tdata == 'apapproverview' && (data.apinvoicehdr_status.text == 'CHECKER' || data.apinvoicehdr_status.text == 'CHECKER MODIFIED')) {
              this.shareservice.detailsview.next('apapproverview')
              this.InvoiceDetailForm = true
              this.commonInvViewForm = false
            }
            else {
              this.getCommontInvHdr();
            }
            this.APApprovalForm = false
            this.APApprovalForms = false;
            this.preparePaymentForm = false
            this.PreparepaymentForms = false;
            this.paymentfileForm = false;
            this.BounceSummaryForm = false
            this.BounceDetailForm = false
            this.CommonSummaryForm = false
            this.ecfapprovalsummaryForm = false
            this.ecfapprovalviewForm = false
            this.AppInvoiceDetailViewForm = false
            this.APmakerForm = false
            this.APECFmakeForm = false
            this.APCreateForm = false
            this.APApproverForm = false
            this.APBounceForm = false
            this.APRejectForm = false
            this.APFailedTransForm = false
            this.APAdvSummaryForm = false
            this.APApproverInvoiceForm = false
            this.APInwardSummaryForm = false
            this.isecfview = false
            this.ispoview = false
            this.isinwardAdd = false
          }
          else {
            this.notification.showWarning(result['message'])
          }
        })
    }
    else {
      this.backdata = tdata
      this.invheaderidd = data.id
      this.shareservice.invheaderid.next(data.id)
      this.shareservice.invhdrstatus.next(data.apinvoicehdr_status?.text)
      this.apinvHeader_id = data.id
      console.log("linkview else ------", this.apinvHeader_id)
      this.raiserBr = data.raiserbranch_branch?.name
      this.ecfheaderid = data.apheader_id
      this.shareservice.crno.next(data?.crno)
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false

      this.commonInvViewForm = true
      this.showdebitdiv = false;
      this.showinvoicediv = true;
      this.InvoiceDetailForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false;
      this.preparePaymentForm = false
      this.PreparepaymentForms = false;
      this.paymentfileForm = false;
      this.BounceSummaryForm = false
      this.BounceDetailForm = false
      this.CommonSummaryForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APAdvSummaryForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      if (tdata != 'apapproverview')
        this.getCommontInvHdr();
    }
  }

  apmakerview(datas) {
    this.ecfservice.lockcheck(datas.id, 1)
      .subscribe(result => {
        this.SpinnerService.show();
        if (result['status'] == "success") {
          this.shareservice.invhdrdata.next(datas)
          this.shareservice.invheaderid.next(datas.id)
          this.shareservice.editkey.next('edit')
          this.shareservice.detailsview.next('AP')
          this.shareservice.po_no.next(datas.po_no)
          this.ecfsummaryForm = false
          this.ecfcreateForm = false
          this.ecfviewForm = false
          this.batchviewForm = false
          this.commonInvViewForm = false
          this.APApprovalForm = false
          this.APApprovalForms = false;
          this.preparePaymentForm = false
          this.PreparepaymentForms = false;
          this.paymentfileForm = false;
          this.BounceSummaryForm = false
          this.BounceDetailForm = false
          this.CommonSummaryForm = false
          this.ecfapprovalsummaryForm = false
          this.ecfapprovalviewForm = false
          this.AppInvoiceDetailViewForm = false
          this.APmakerForm = false
          this.APECFmakeForm = false
          this.APCreateForm = false
          this.APApproverForm = false
          this.APBounceForm = false
          this.APRejectForm = false
          this.APBounceForm = false
          this.APFailedTransForm = false
          this.APAdvSummaryForm = false
          this.APApproverInvoiceForm = false
          this.APInwardSummaryForm = false
          this.isecfview = false
          this.ispoview = false
          this.isinwardAdd = false
          this.InvoiceDetailForm = true
        }
        else {
          this.SpinnerService.hide();
          this.notification.showWarning(result['message'])
        }
      })
  }


  ecfapviewid: number = 0
  ecfcrno: any
  ecflinkView(datas) {
    this.ecfapviewid = datas?.id
    this.ecfcrno = datas?.crno
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.commonInvViewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false;
    this.preparePaymentForm = false
    this.PreparepaymentForms = false;
    this.paymentfileForm = false;
    this.BounceSummaryForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = true
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    // this.ecfwiseMaker = false
    // this.invwiseMaker = false
    // this.apSummarySearch()
    this.apinvSummarySearch('', 1)

  }

  ecfapplinkView(datas) {
    this.ecfapviewid = datas?.id
    this.ecfcrno = datas?.crno
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.commonInvViewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false;
    this.preparePaymentForm = false
    this.PreparepaymentForms = false;
    this.paymentfileForm = false;
    this.BounceSummaryForm = false
    this.BounceDetailForm = false
    this.CommonSummaryForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = true
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.dataclear('')
    this.overallreset()
    this.resetapappInv()
    this.rptFormat = 2
    this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 23 || x.id == 49 || x.id == 50)
  }

  isapsummarypage: boolean
  has_appageprevious = false
  has_appagenext = false
  pagesizeap = 10;
  getaptotalcount: any
  apSummaryData: any
  searchapData: any = {}
  appresentpage: number = 1;
  apSummarySearch(pageNumber = 1) {
    if (this.apsummaryform) {
      let search = this.apsummaryform.value

      this.searchapData.crno = search.crno;
      this.searchapData.batch_no = search.batch_no;
      this.searchapData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchapData.aptype = search.aptype;
      this.searchapData.raiser_name = search.raiser_name.id;
      this.searchapData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchapData.invoice_no = search.invoice_no;
      this.searchapData.invoice_amount = search.invoice_amount;
      this.searchapData.minamt = search.minamt;
      this.searchapData.maxamt = search.maxamt;
      this.searchapData.is_originalinvoice = search.is_originalinvoice

      for (let i in this.searchapData) {
        if (this.searchapData[i] === null || this.searchapData[i] === "") {
          delete this.searchapData[i];
        }
      }
    }
    else {
      this.searchapData = {}
    }
    if (pageNumber == 1) {
      this.pageIndexmk = 0;
    }
    this.SpinnerService.show()
    this.ecfservice.getapSummary(this.searchapData, this.ecfapviewid, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.apSummaryData = result['data']
          let datapagination = result["pagination"];
          this.getaptotalcount = datapagination?.count
          if (this.apSummaryData.length === 0) {
            this.isapsummarypage = false
          }
          if (this.apSummaryData.length > 0) {
            this.has_appagenext = datapagination.has_next;
            this.has_appageprevious = datapagination.has_previous;
            this.appresentpage = datapagination.index;
            this.isapsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickap() {
    if (this.has_appagenext === true) {
      this.apSummarySearch(this.appresentpage + 1)
    }
  }

  previousClickap() {
    if (this.has_appageprevious === true) {
      this.apSummarySearch(this.appresentpage - 1)
    }
  }

  resetap() {
    this.apsummaryform.controls['crno'].reset(""),
      this.apsummaryform.controls['aptype'].reset(""),
      this.apsummaryform.controls['minamt'].reset(""),
      this.apsummaryform.controls['maxamt'].reset(""),
      this.apsummaryform.controls['batch_no'].reset(""),
      this.apsummaryform.controls['invoiceheader_crno'].reset(""),
      this.apsummaryform.controls['raiser_name'].reset(""),
      this.apsummaryform.controls['raiserbranch_id'].reset(""),
      this.apsummaryform.controls['invoice_no'].reset(""),
      this.apsummaryform.controls['invoice_amount'].reset(""),
      this.apsummaryform.controls['is_originalinvoice'].reset(""),
      this.apSummarySearch(1);
  }


  isapinvsummarypage: boolean
  has_apinvpageprevious = false
  has_apinvpagenext = false
  pagesizeapinv = 10;
  getapinvtotalcount: any
  apinvSummaryData: any
  searchapinvData: any = {}
  apinvpresentpage: number = 1;
  expand_InvMaker = false
  apinvSummarySearch(e, pageNumber = 1) {
    if (this.apinvsummaryform) {
      let search = this.apinvsummaryform.value
      this.searchapinvData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchapinvData.aptype = search.aptype;
      this.searchapinvData.raiser_name = search.raiser_name?.id;
      this.searchapinvData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchapinvData.invoice_no = search.invoice_no;
      this.searchapinvData.invoice_amount = search.invoice_amount;
      this.searchapinvData.supplier_id = search.supplier_id.id
      this.searchapinvData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd');
      this.searchapinvData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
      this.searchapinvData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id
      this.searchapinvData.invoice_status = search.invoice_status
      if (e == 'ecf') {
        this.searchapinvData.aptype = this.commnvalue?.id;
      }
      else if (e == 'supplier') {
        this.searchapinvData.supplier_id = this.commnvalue?.id
      }
      else if (e == 'raiser') {
        this.searchapinvData.raiser_name = this.commnvalue?.id
      }
      else if (e == 'raiserbr') {
        this.searchapinvData.raiserbranch_id = this.commnvalue?.id
      }
      else if (e == 'invsts') {
        this.searchapinvData.invoice_status = this.commnvalue?.id
      }
      for (let i in this.searchapinvData) {
        if (this.searchapinvData[i] === null || this.searchapinvData[i] === "") {
          delete this.searchapinvData[i];
        }
      }
    }
    else {
      this.searchapinvData = {}
    }
    if (this.searchapinvData?.from_date != undefined && this.searchapinvData?.to_date == undefined) {
      this.notification.showError("Please select To Date")
      return false
    }
    if (this.searchapinvData?.to_date != undefined && this.searchapinvData?.from_date == undefined) {
      this.notification.showError("Please select From Date")
      return false
    }
    if (pageNumber == 1) {
      this.pageIndexmk = 0;
    }
    // this.SummaryObjmakerNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
    //   data: this.searchapinvData,
    //   params: "&summary_type=maker_summary",OverallCount: "Total Count"
    // };
    this.SpinnerService.show()
    this.ecfservice.getapinvSummary(this.searchapinvData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.apinvSummaryData = result['data']
          let datapagination = result["pagination"];
          this.aptype_id = this.apinvSummaryData?.aptype_id
          this.getapinvtotalcount = datapagination?.count
          this.length_batch = datapagination?.count
          if (this.apinvSummaryData.length === 0) {
            this.isapinvsummarypage = false
          }
          if (this.apinvSummaryData.length > 0) {
            this.has_apinvpagenext = datapagination.has_next;
            this.has_apinvpageprevious = datapagination.has_previous;
            this.apinvpresentpage = datapagination.index;
            this.isapinvsummarypage = true
            this.apinvsummaryform.controls['invoice_status'].reset('')
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
    this.expand_InvMaker = false
  }

  nextClickapinv() {
    if (this.has_apinvpagenext === true) {
      this.apinvSummarySearch('', this.apinvpresentpage + 1)
    }
  }

  previousClickapinv() {
    if (this.has_apinvpageprevious === true) {
      this.apinvSummarySearch('', this.apinvpresentpage - 1)
    }
  }

  resetapinv() {
    this.apinvsummaryform.controls['aptype'].reset(""),
      this.apinvsummaryform.controls['invoiceheader_crno'].reset(""),
      this.apinvsummaryform.controls['raiser_name'].reset(""),
      this.apinvsummaryform.controls['raiserbranch_id'].reset(""),
      this.apinvsummaryform.controls['invoice_no'].reset(""),
      this.apinvsummaryform.controls['invoice_amount'].reset(""),
      this.apinvsummaryform.controls['supplier_id'].reset(""),
      this.apinvsummaryform.controls['from_date'].reset(""),
      this.apinvsummaryform.controls['to_date'].reset(""),
      this.apinvsummaryform.controls['apinvoiceheaderstatus_id'].reset(""),
      this.apinvsummaryform.controls['invoice_status'].reset("")
    // this.apinvSummarySearch(1);
  }


  isapbouncesummarypage: boolean
  has_apbouncepageprevious = false
  has_apbouncepagenext = false
  pagesizeapbounce = 10;
  getapbouncetotalcount: any
  apbounceSummaryData: any
  searchapbounceData: any = {}
  apbouncepresentpage: number = 1;
  expand_Bounce = false
  apbounceSummarySearch(value, pageNumber = 1) {
    if (this.apbounceform) {
      let search = this.apbounceform.value
      this.searchapbounceData.crno = search.crno;
      this.searchapbounceData.batch_no = search.batch_no;
      if (search.invoiceheader_crno != '' && search.invoiceheader_crno != null && search.invoiceheader_crno != undefined) {
        this.searchapbounceData.invoiceheader_crno = search.invoiceheader_crno;
        this.isinvcrnoact_bnce = true;
      }
      // this.searchapbounceData.aptype = search.aptype;
      // this.searchapbounceData.raiser_name = search.raiser_name.id;
      // this.searchapbounceData.raiserbranch_id = search.raiserbranch_id.id;
      if (search.invoice_no != '' && search.invoice_no != null && search.invoice_no != undefined) {
        this.searchapbounceData.invoice_no = search.invoice_no;
        this.isinvnoact_bnce = true;
      }
      if (search.invoice_amount != '' && search.invoice_amount != null && search.invoice_amount != undefined) {
        this.searchapbounceData.invoice_amount = search.invoice_amount;
        this.isinamtact_bnce = true;
      }
      this.searchapbounceData.minamt = search.minamt;
      this.searchapbounceData.maxamt = search.maxamt;
      this.searchapbounceData.is_originalinvoice = search.is_originalinvoice
      // this.searchapbounceData.supplier_id = search.supplier_id.id;
      if (search.from_date != '' && search.from_date != null && search.from_date != undefined &&
        search.to_date != '' && search.to_date != null && search.to_date != undefined) {
        this.searchapbounceData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd')
        this.searchapbounceData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
        this.isinvdateact_bnce = true;
      }
      this.searchapbounceData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;

      if (value == 'ecf') {
        this.searchapbounceData.aptype = this.bouncevalue?.id;
        this.isecftyact_bnce = true;
      }
      else if (value == 'invsts') {
        this.searchapbounceData.invoice_status = this.bouncevalue?.id;
        this.isinvstsact_bnce = true;
      }
      else if (value == 'supplier') {
        this.searchapbounceData.supplier_id = this.bouncevalue?.id
        this.issupact_bnce = true;
      }
      else if (value == 'raiser') {
        this.searchapbounceData.raiser_name = this.bouncevalue?.id
        this.israiact_bnce = true;
      }
      else if (value == 'raiserbr') {
        this.searchapbounceData.raiserbranch_id = this.bouncevalue?.id
        this.israibract_bnce = true;
      }
      else if (value == 'invsts') {
        this.searchapbounceData.invoice_status = this.bouncevalue?.id
      }
      for (let i in this.searchapbounceData) {
        if (this.searchapbounceData[i] === null || this.searchapbounceData[i] === "") {
          delete this.searchapbounceData[i];
        }
      }
    }
    else {
      this.searchapbounceData = {}
    }
    if (this.searchapbounceData?.from_date != undefined && this.searchapbounceData?.to_date == undefined) {
      this.notification.showError("Please select To Date")
      return false
    }
    if (this.searchapbounceData?.to_date != undefined && this.searchapbounceData?.from_date == undefined) {
      this.notification.showError("Please select From Date")
      return false
    }
    if (pageNumber == 1) {
      this.pageIndex_bounce = 0;
    }
    // this.SummaryObjbounceNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
    //   data: this.searchapbounceData,
    //   params: "&summary_type=bounce_summary",OverallCount: "Total Count"
    // };
    this.SpinnerService.show()
    this.ecfservice.getapbounceSummary(this.searchapbounceData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.apbounceSummaryData = result['data']
          let datapagination = result["pagination"];
          this.getapbouncetotalcount = datapagination?.count
          this.length_bounce = datapagination?.count
          if (this.apbounceSummaryData.length === 0) {
            this.isapbouncesummarypage = false
          }
          if (this.apbounceSummaryData.length > 0) {
            this.has_apbouncepagenext = datapagination.has_next;
            this.has_apbouncepageprevious = datapagination.has_previous;
            this.apbouncepresentpage = datapagination.index;
            this.isapbouncesummarypage = true
            this.apbounceform.controls['aptype'].reset('')
            this.bncesearch('')
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
    this.expand_Bounce = false
  }

  nextClickapbounce() {
    if (this.has_apbouncepagenext === true) {
      this.apbounceSummarySearch('', this.apbouncepresentpage + 1)
    }
  }

  previousClickapbounce() {
    if (this.has_apbouncepageprevious === true) {
      this.apbounceSummarySearch('', this.apbouncepresentpage - 1)
    }
  }

  resetapbounce() {
    this.apbounceform.controls['crno'].reset(""),
      this.apbounceform.controls['aptype'].reset(""),
      this.apbounceform.controls['minamt'].reset(""),
      this.apbounceform.controls['maxamt'].reset(""),
      this.apbounceform.controls['batch_no'].reset(""),
      this.apbounceform.controls['invoiceheader_crno'].reset(""),
      this.apbounceform.controls['raiser_name'].reset(""),
      this.apbounceform.controls['raiserbranch_id'].reset(""),
      this.apbounceform.controls['invoice_no'].reset(""),
      this.apbounceform.controls['invoice_amount'].reset(""),
      this.apbounceform.controls['is_originalinvoice'].reset(""),
      this.apbounceform.controls['supplier_id'].reset(""),
      this.apbounceform.controls['from_date'].reset(""),
      this.apbounceform.controls['to_date'].reset(""),
      this.bncesearch('cleared')
    this.searchapbounceData = {}
    // this.apbounceSummarySearch(1);
  }


  isaprejectsummarypage: boolean
  has_aprejectpageprevious = false
  has_aprejectpagenext = false
  pagesizeapreject = 10;
  getaprejecttotalcount: any
  aprejectSummaryData: any
  searchaprejectData: any = {}
  aprejectpresentpage: number = 1;
  expand_Reject = false
  aprejectSummarySearch(value, pageNumber = 1) {
    if (this.aprejectform) {
      let search = this.aprejectform.value

      this.searchaprejectData.crno = search.crno;
      this.searchaprejectData.batch_no = search.batch_no;
      if (search.invoiceheader_crno != '' && search.invoiceheader_crno != null && search.invoiceheader_crno != undefined) {
        this.searchaprejectData.invoiceheader_crno = search.invoiceheader_crno;
        this.isinvcrnoact_rej = true;
      }
      // this.searchaprejectData.aptype = search.aptype;
      // this.searchaprejectData.raiser_name = search.raiser_name?.id;
      // this.searchaprejectData.raiserbranch_id = search.raiserbranch_id?.id;
      if (search.invoice_no != '' && search.invoice_no != null && search.invoice_no != undefined) {
        this.searchaprejectData.invoice_no = search.invoice_no;
        this.isinvcrnoact_rej = true;
      }
      if (search.invoice_amount != '' && search.invoice_amount != null && search.invoice_amount != undefined) {
        this.searchaprejectData.invoice_amount = search.invoice_amount;
        this.isinvcrnoact_rej = true;
      }
      if (search.from_date != '' && search.from_date != null && search.from_date != undefined &&
        search.to_date != '' && search.to_date != null && search.to_date != undefined) {
        this.searchaprejectData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd')
        this.searchaprejectData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
        this.isinvdateact_rej = true;
      }
      this.searchaprejectData.minamt = search.minamt;
      this.searchaprejectData.maxamt = search.maxamt;
      this.searchaprejectData.is_originalinvoice = search.is_originalinvoice
      // this.searchaprejectData.supplier_id = search.supplier_id?.id;


      if (value == 'ecf') {
        this.searchaprejectData.aptype = this.rejectvalue?.id;
        this.isecftyact_rej = true;
      }
      else if (value == 'invsts') {
        this.searchaprejectData.invoice_status = this.rejectvalue?.id;
        this.isinvstsact_rej = true;
      }
      else if (value == 'supplier') {
        this.searchaprejectData.supplier_id = this.rejectvalue?.id
        this.issupact_rej = true;
      }
      else if (value == 'raiser') {
        this.searchaprejectData.raiser_name = this.rejectvalue?.id
        this.israiact_rej = true;
      }
      else if (value == 'raiserbr') {
        this.searchaprejectData.raiserbranch_id = this.rejectvalue?.id
        this.israibract_rej = true;
      }
      else if (value == 'invsts') {
        this.searchaprejectData.invoice_status = this.rejectvalue?.id
      }
      for (let i in this.searchaprejectData) {
        if (this.searchaprejectData[i] === null || this.searchaprejectData[i] === "") {
          delete this.searchaprejectData[i];
        }
      }
    }
    else {
      this.searchaprejectData = {}
    }
    if (pageNumber == 1) {
      this.pageIndex_reject = 0;
    }
    // this.SummaryObjrejectNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
    //   data: this.searchaprejectData,
    //   params: "&summary_type=rejected_summary",OverallCount: "Total Count"
    // };
    this.SpinnerService.show()
    this.ecfservice.getaprejectSummary(this.searchaprejectData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.aprejectSummaryData = result['data']
          let datapagination = result["pagination"];
          this.getaprejecttotalcount = datapagination?.count
          // this.length_reject = datapagination?.count
          if (this.aprejectSummaryData.length === 0) {
            this.isaprejectsummarypage = false
          }
          if (this.aprejectSummaryData.length > 0) {
            this.has_aprejectpagenext = datapagination.has_next;
            this.has_aprejectpageprevious = datapagination.has_previous;
            // this.aprejectpresentpage = datapagination.index;
            this.length_reject = datapagination?.count
            this.aprejectpresentpage = datapagination.index;
            this.isaprejectsummarypage = true
            this.aprejectform.controls['aptype'].reset('')
            this.rejsearch('')
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
    this.expand_Reject = false
  }

  nextClickapreject() {
    if (this.has_aprejectpagenext === true) {
      this.aprejectSummarySearch('', this.aprejectpresentpage + 1)
    }
  }

  previousClickapreject() {
    if (this.has_aprejectpageprevious === true) {
      this.aprejectSummarySearch('', this.aprejectpresentpage - 1)
    }
  }

  resetapreject() {
    this.aprejectform.controls['crno'].reset(""),
      this.aprejectform.controls['aptype'].reset(""),
      this.aprejectform.controls['minamt'].reset(""),
      this.aprejectform.controls['maxamt'].reset(""),
      this.aprejectform.controls['batch_no'].reset(""),
      this.aprejectform.controls['invoiceheader_crno'].reset(""),
      this.aprejectform.controls['raiser_name'].reset(""),
      this.aprejectform.controls['raiserbranch_id'].reset(""),
      this.aprejectform.controls['invoice_no'].reset(""),
      this.aprejectform.controls['invoice_amount'].reset(""),
      this.aprejectform.controls['is_originalinvoice'].reset(""),
      this.aprejectform.controls['supplier_id'].reset(""),
      this.aprejectform.controls['invoice_status'].reset("")
    // this.aprejectSummarySearch(1);
    this.rejsearch('cleared')
    this.searchaprejectData = {}
  }


  isapappsummarypage: boolean
  has_apapppageprevious = false
  has_apapppagenext = false
  pagesizeapapp = 10;
  getapapptotalcount: any
  apappSummaryData: any
  searchapappData: any = {}
  apapppresentpage: number = 1;
  apappSummarySearch(pageNumber = 1) {
    if (this.apapprovalsummaryform) {
      let search = this.apInvapprovalsummaryform.value

      this.searchapappData.crno = search.crno;
      this.searchapappData.batch_no = search.batch_no;
      this.searchapappData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchapappData.aptype = search.aptype;
      this.searchapappData.raiser_name = search.raiser_name?.id;
      this.searchapappData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchapappData.invoice_no = search.invoice_no;
      this.searchapappData.invoice_amount = search.invoice_amount;
      this.searchapappData.minamt = search.minamt;
      this.searchapappData.maxamt = search.maxamt;
      this.searchapappData.supplier_id = search.supplier_id.id;

      for (let i in this.searchapappData) {
        if (this.searchapappData[i] === null || this.searchapappData[i] === "") {
          delete this.searchapappData[i];
        }
      }
    }
    else {
      this.searchapappData = {}
    }
    if (this.searchapappData?.from_date != undefined && this.searchapappData?.to_date == undefined) {
      this.notification.showError("Please select To Date")
      return false
    }
    if (this.searchapappData?.to_date != undefined && this.searchapappData?.from_date == undefined) {
      this.notification.showError("Please select From Date")
      return false
    }
    this.SpinnerService.show()
    this.ecfservice.getapappSummary(this.searchapappData, this.ecfapviewid, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.apappInvSummaryData = result['data']
          let datapagination = result["pagination"];
          this.getapappInvtotalcount = datapagination?.count
          this.length_approve = datapagination?.count
          if (this.apappInvSummaryData.length === 0) {
            this.isapappInvsummarypage = false
          }
          if (this.apappInvSummaryData.length > 0) {
            this.has_apappInvpagenext = datapagination.has_next;
            this.has_apappInvpageprevious = datapagination.has_previous;
            this.apappInvpresentpage = datapagination.index;
            this.isapappInvsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickapapp() {
    if (this.has_apapppagenext === true) {
      this.apappSummarySearch(this.apapppresentpage + 1)
    }
  }

  previousClickapapp() {
    if (this.has_apapppageprevious === true) {
      this.apappSummarySearch(this.apapppresentpage - 1)
    }
  }

  resetapapp() {
    this.apInvapprovalsummaryform.controls['crno'].reset(""),
      this.apInvapprovalsummaryform.controls['aptype'].reset(""),
      this.apInvapprovalsummaryform.controls['minamt'].reset(""),
      this.apInvapprovalsummaryform.controls['maxamt'].reset(""),
      this.apInvapprovalsummaryform.controls['supplier_id'].reset(""),
      this.apInvapprovalsummaryform.controls['invoiceheader_crno'].reset(""),
      this.apInvapprovalsummaryform.controls['raiser_name'].reset(""),
      this.apInvapprovalsummaryform.controls['raiserbranch_id'].reset(""),
      this.apInvapprovalsummaryform.controls['invoice_no'].reset(""),
      this.apInvapprovalsummaryform.controls['invoice_amount'].reset(""),
      this.apInvapprovalsummaryform.controls['invoice_amount'].reset(""),
      this.apappSummarySearch(1);
  }

  isapappInvsummarypage: boolean
  has_apappInvpageprevious = false
  has_apappInvpagenext = false
  pagesizeapappInv = 10;
  getapappInvtotalcount: any
  apappInvSummaryData: any
  searchapappInvData: any = {}
  apappInvpresentpage: number = 1;
  expand_approval = false
  apappInvSummarySearch(value, pageNumber = 1) {
    if (this.apInvapprovalsummaryform) {
      let search = this.apInvapprovalsummaryform.value

      this.searchapappInvData.crno = search.crno;
      this.searchapappInvData.batch_no = search.batch_no;

      if (search.invoiceheader_crno != '' && search.invoiceheader_crno != null && search.invoiceheader_crno != undefined) {
        this.searchapappInvData.invoiceheader_crno = search.invoiceheader_crno;
        this.isinvcrnoact_app = true;
      }
      // this.searchapappInvData.aptype = search.aptype;
      // this.searchapappInvData.raiser_name = search.raiser_name?.id;
      // this.searchapappInvData.raiserbranch_id = search.raiserbranch_id.id;
      // this.searchapappInvData.supplier_id = search.supplier_id.id;
      if (search.invoice_no != '' && search.invoice_no != null && search.invoice_no != undefined) {
        this.searchapappInvData.invoice_no = search.invoice_no;
        this.isinvnoact_app = true;
      }
      if (search.invoice_amount != '' && search.invoice_amount != null && search.invoice_amount != undefined) {
        this.searchapappInvData.invoice_amount = search.invoice_amount;
        this.isinamtact_app = true;
      }
      // this.searchapappInvData.minamt = search.minamt;
      // this.searchapappInvData.maxamt = search.maxamt;
      if (search.from_date != '' && search.from_date != null && search.from_date != undefined &&
        search.to_date != '' && search.to_date != null && search.to_date != undefined) {
        this.searchapappInvData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd')
        this.searchapappInvData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
        this.isinvdateact_app = true
      }
      if (search.inwfrom_date != '' && search.inwfrom_date != null && search.inwfrom_date != undefined &&
        search.inwto_date != '' && search.inwto_date != null && search.inwto_date != undefined) {
        this.searchapappInvData.inwfrom_date = this.datePipe.transform(search.inwfrom_date, 'yyyy-MM-dd');
        this.searchapappInvData.inwto_date = this.datePipe.transform(search.inwto_date, 'yyyy-MM-dd');
        this.isInwdateact_app = true
      }
      this.searchapappInvData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;

      if (value == 'ecf') {
        this.searchapappInvData.aptype = this.appvalue?.id;
        this.isecftyact_app = true;
      }
      // else if(value == 'invsts' ){
      //   this.searchapappInvData.invoice_status = this.appvalue?.id;
      //   this.isinvstsact_app = true;
      // }
      else if (value == 'supplier') {
        this.searchapappInvData.supplier_id = this.appvalue?.id
        this.issupact_app = true;
      }
      else if (value == 'raiser') {
        this.searchapappInvData.raiser_name = this.appvalue?.id
        this.israiact_app = true;
      }
      else if (value == 'raiserbr') {
        this.searchapappInvData.raiserbranch_id = this.appvalue?.id
        this.israibract_app = true;
      }
      else if (value == 'invsts') {
        this.searchapappInvData.invoice_status = this.appvalue?.id
        this.isinvstsact_app = true;
      }

      for (let i in this.searchapappInvData) {
        if (this.searchapappInvData[i] === null || this.searchapappInvData[i] === "") {
          delete this.searchapappInvData[i];
        }
      }
    }
    else {
      this.searchapappInvData = {}
    }
    if (pageNumber == 1) {
      this.pageIndex_approve = 0;
    }
    // this.SummaryApiapprovalObjNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
    //   params: "&summary_type=approver_summary",
    //   data: this.searchapappInvData,OverallCount: "Total Count"
    // }
    this.SpinnerService.show()
    this.ecfservice.getapAPPInvSummary(this.searchapappInvData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.apappInvSummaryData = result['data']
          let datapagination = result["pagination"];
          this.getapappInvtotalcount = datapagination?.count
          this.length_approve = datapagination?.count
          if (this.apappInvSummaryData.length === 0) {
            this.isapappInvsummarypage = false
          }
          if (this.apappInvSummaryData.length > 0) {
            this.has_apappInvpagenext = datapagination.has_next;
            this.has_apappInvpageprevious = datapagination.has_previous;
            this.apappInvpresentpage = datapagination.index;
            this.isapappInvsummarypage = true
            this.apInvapprovalsummaryform.controls['aptype'].reset('')
            this.apInvapprovalsummaryform.controls['invoice_status'].reset('')
            this.appsearch('')
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
    this.expand_approval = false
  }

  nextClickapappInv() {
    if (this.has_apappInvpagenext === true) {
      this.apappInvSummarySearch('', this.apappInvpresentpage + 1)
    }
  }

  previousClickapappInv() {
    if (this.has_apappInvpageprevious === true) {
      this.apappInvSummarySearch('', this.apappInvpresentpage - 1)
    }
  }

  resetapappInv() {
    this.apInvapprovalsummaryform.controls['crno'].reset(""),
      this.apInvapprovalsummaryform.controls['aptype'].reset(""),
      this.apInvapprovalsummaryform.controls['minamt'].reset(""),
      this.apInvapprovalsummaryform.controls['maxamt'].reset(""),
      this.apInvapprovalsummaryform.controls['batch_no'].reset(""),
      this.apInvapprovalsummaryform.controls['invoiceheader_crno'].reset(""),
      this.apInvapprovalsummaryform.controls['raiser_name'].reset(""),
      this.apInvapprovalsummaryform.controls['raiserbranch_id'].reset(""),
      this.apInvapprovalsummaryform.controls['invoice_no'].reset(""),
      this.apInvapprovalsummaryform.controls['invoice_amount'].reset(""),
      this.apInvapprovalsummaryform.controls['from_date'].reset(""),
      this.apInvapprovalsummaryform.controls['to_date'].reset(""),
      this.apInvapprovalsummaryform.controls['supplier_id'].reset(""),
      this.apInvapprovalsummaryform.controls['invoice_status'].reset(''),
      this.apInvapprovalsummaryform.controls['apinvoiceheaderstatus_id'].reset("")
    // this.apappInvSummarySearch(1);
    this.appsearch('cleared')
    this.searchapappInvData = {}
    this.apappInvSummarySearch('', 1);
  }

  isapecfsummarypage: boolean
  has_apecfpageprevious = false
  has_apecfpagenext = false
  pagesizeecfap = 10;
  getecfaptotalcount: any
  apecfSummaryData: any
  searchapecfData: any = {}
  apecfpresentpage: number = 1;
  apecfSummarySearch(pageNumber = 1) {
    if (this.apecfsummaryform) {
      let search = this.apecfsummaryform.value

      this.searchapecfData.crno = search.crno;
      this.searchapecfData.aptype = search.aptype;
      this.searchapecfData.minamt = search.minamt;
      this.searchapecfData.maxamt = search.maxamt;

      for (let i in this.searchapecfData) {
        if (this.searchapecfData[i] === null || this.searchapecfData[i] === "") {
          delete this.searchapecfData[i];
        }
      }
    }
    else {
      this.searchapecfData = {}
    }

    this.SpinnerService.show()
    this.ecfservice.getapecfSummary(this.searchapecfData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.apecfSummaryData = result['data']
          let datapagination = result["pagination"];
          this.getecfaptotalcount = datapagination?.count
          if (this.apecfSummaryData.length === 0) {
            this.isapecfsummarypage = false
          }
          if (this.apecfSummaryData.length > 0) {
            this.has_apecfpagenext = datapagination.has_next;
            this.has_apecfpageprevious = datapagination.has_previous;
            this.apecfpresentpage = datapagination.index;
            this.isapecfsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickapecf() {
    if (this.has_apecfpagenext === true) {
      this.apecfSummarySearch(this.apecfpresentpage + 1)
    }
  }

  previousClickapecf() {
    if (this.has_apecfpageprevious === true) {
      this.apecfSummarySearch(this.apecfpresentpage - 1)
    }
  }

  resetapecf() {
    this.apecfsummaryform.controls['crno'].reset(""),
      this.apecfsummaryform.controls['aptype'].reset(""),
      this.apecfsummaryform.controls['minamt'].reset(""),
      this.apecfsummaryform.controls['maxamt'].reset(""),
      this.apecfSummarySearch(1);
  }

  isapappecfsummarypage: boolean
  has_apappecfpageprevious = false
  has_apappecfpagenext = false
  pagesizeecfapapp = 10;
  getappecfaptotalcount: any
  apappecfSummaryData: any
  searchapappecfData: any = {}
  apappecfpresentpage: number = 1;
  apappecfSummarySearch(pageNumber = 1) {
    if (this.apECFapproverSearchForm) {
      let search = this.apECFapproverSearchForm.value

      this.searchapappecfData.crno = search.crno;
      this.searchapappecfData.aptype = search.aptype;
      this.searchapappecfData.minamt = search.minamt;
      this.searchapappecfData.maxamt = search.maxamt;

      for (let i in this.searchapappecfData) {
        if (this.searchapappecfData[i] === null || this.searchapappecfData[i] === "") {
          delete this.searchapappecfData[i];
        }
      }
    }
    else {
      this.searchapappecfData = {}
    }

    this.SpinnerService.show()
    this.ecfservice.getapappecfSummary(this.searchapappecfData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.apappecfSummaryData = result['data']
          let datapagination = result["pagination"];
          this.getappecfaptotalcount = datapagination?.count
          if (this.apappecfSummaryData.length === 0) {
            this.isapappecfsummarypage = false
          }
          if (this.apappecfSummaryData.length > 0) {
            this.has_apappecfpagenext = datapagination.has_next;
            this.has_apappecfpageprevious = datapagination.has_previous;
            this.apecfpresentpage = datapagination.index;
            this.isapappecfsummarypage = true
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickapappecf() {
    if (this.has_apappecfpagenext === true) {
      this.apappecfSummarySearch(this.apappecfpresentpage + 1)
    }
  }

  previousClickapappecf() {
    if (this.has_apappecfpageprevious === true) {
      this.apappecfSummarySearch(this.apappecfpresentpage - 1)
    }
  }

  resetapappecf() {
    this.apECFapproverSearchForm.controls['crno'].reset(""),
      this.apECFapproverSearchForm.controls['aptype'].reset(""),
      this.apECFapproverSearchForm.controls['minamt'].reset(""),
      this.apECFapproverSearchForm.controls['maxamt'].reset(""),
      this.apappecfSummarySearch(1);
  }


  isfailedTranssummarypage: boolean
  has_failedTranspageprevious = false
  has_failedTranspagenext = false
  pagesizefailedTrans = 10;
  getfailedTranstotalcount: any
  failedTransSummaryData: any
  searchfailedTransData: any = { apinvoiceheaderstatus_id: "26" };
  failedTranspresentpage: number = 1;
  errordescrip = " "
  expand_Failed = false
  failedTransSummarySearch(value, pageNumber = 1) {
    console.log("initial searchfailedTransData-------->", this.searchfailedTransData)
    if (this.apfailedTransform) {
      let search = this.apfailedTransform.value
      // this.searchfailedTransData.apinvoiceheaderstatus_id = "26";
      this.searchfailedTransData.crno = search.crno;
      this.searchfailedTransData.batch_no = search.batch_no;
      if (search.invoiceheader_crno != '' && search.invoiceheader_crno != null && search.invoiceheader_crno != undefined) {
        this.searchfailedTransData.invoiceheader_crno = search.invoiceheader_crno;
        this.isinvcrnoact_failtr = true;
      }
      // this.searchfailedTransData.aptype = search.aptype;
      // this.searchfailedTransData.raiser_name = search.raiser_name?.id;
      // this.searchfailedTransData.raiserbranch_id = search.raiserbranch_id.id;
      if (search.invoice_no != '' && search.invoice_no != null && search.invoice_no != undefined) {
        this.searchfailedTransData.invoice_no = search.invoice_no;
        this.isinvnoact_failtr = true;
      }
      if (search.invoice_amount != '' && search.invoice_amount != null && search.invoice_amount != undefined) {
        this.searchfailedTransData.invoice_amount = search.invoice_amount;
        this.isinamtact_failtr = true;
      }
      if (search.from_date != '' && search.from_date != null && search.from_date != undefined
        && search.to_date != '' && search.to_date != null && search.to_date != undefined
      ) {
        this.searchfailedTransData.from_date = search.from_date;
        this.searchfailedTransData.to_date = search.to_date;
        this.isinvcrnoact_failtr = true;
      }
      this.searchfailedTransData.minamt = search.minamt;
      this.searchfailedTransData.maxamt = search.maxamt;
      this.searchfailedTransData.is_originalinvoice = search.is_originalinvoice
      //  this.searchfailedTransData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd');
      //  this.searchfailedTransData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
      //  this.isinvdateact_failtr = true;
      if (value == 'ecf') {
        this.searchfailedTransData.aptype = this.failtrvalue?.id;
        this.isecftyact_failtr = true;
      }
      else if (value == 'supplier') {
        this.searchfailedTransData.supplier_id = this.failtrvalue?.id
        this.issupact_failtr = true;
      }
      else if (value == 'raiser') {
        this.searchfailedTransData.raiser_name = this.failtrvalue?.id
        this.israiact_failtr = true;
      }
      else if (value == 'raiserbr') {
        this.searchfailedTransData.raiserbranch_id = this.failtrvalue?.id
        this.israibract_failtr = true;
      }
      else if (value == 'invsts') {
        this.searchfailedTransData.invoice_status = this.failtrvalue?.id
        this.isinvstsact_failtr = true;
      }


      for (let i in this.searchfailedTransData) {
        if (this.searchfailedTransData[i] === null || this.searchfailedTransData[i] === "") {
          delete this.searchfailedTransData[i];
        }
      }
    }
    // else {
    //   // this.searchfailedTransData = {}
    //   console.log("in else before searchfailedTransData-------->", this.searchfailedTransData)
    //   this.searchfailedTransData["apinvoiceheaderstatus_id"] = 26
    //   console.log("in else after searchfailedTransData-------->", this.searchfailedTransData)

    // }
    this.searchfailedTransData.apinvoiceheaderstatus_id = "26";
    this.SummaryfailedObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
      params:"&apflag=1",
      data: this.searchfailedTransData,OverallCount: "Total Count"
    }
    this.SpinnerService.show()
    this.ecfservice.getfailedTransSummary(this.searchfailedTransData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.failedTransSummaryData = result['data']
          let datapagination = result["pagination"];
          this.getfailedTranstotalcount = datapagination?.count
          this.length_failedTrans = datapagination?.count
          if (this.failedTransSummaryData.length === 0) {
            this.isfailedTranssummarypage = false
          }
          if (this.failedTransSummaryData.length > 0) {
            this.has_failedTranspagenext = datapagination.has_next;
            this.has_failedTranspageprevious = datapagination.has_previous;
            this.failedTranspresentpage = datapagination.index;
            this.isfailedTranssummarypage = true
            this.apfailedTransform.controls['aptype'].reset('');
            this.failtrsearch('');
          }
          if (this.failedTranspresentpage == 1)
            this.pageIndex_failedTrans = 0;

          for (let i in this.failedTransSummaryData) {
            this.errordescrip = this.failedTransSummaryData[i]?.error_description
          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
    this.expand_Failed = false
  }
  length_failedTrans = 0;
  pageSize_failedTrans = 10;
  pageIndex_failedTrans = 0;
  handlefailedTransPageEvent(event: PageEvent) {
    this.length_failedTrans = event.length;
    this.pageSize_failedTrans = event.pageSize;
    this.pageIndex_failedTrans = event.pageIndex;
    this.failedTranspresentpage = event.pageIndex + 1;
    this.failedTransSummarySearch(this.failedTranspresentpage);

  }
  nextClickfailedTrans() {
    if (this.has_failedTranspagenext === true) {
      this.failedTransSummarySearch(this.failedTranspresentpage + 1)
    }
  }

  previousClickfailedTrans() {
    if (this.has_failedTranspageprevious === true) {
      this.failedTransSummarySearch(this.failedTranspresentpage - 1)
    }
  }

  resetfailedTrans() {
    this.apfailedTransform.controls['crno'].reset(""),
      this.apfailedTransform.controls['aptype'].reset(""),
      this.apfailedTransform.controls['minamt'].reset(""),
      this.apfailedTransform.controls['maxamt'].reset(""),
      this.apfailedTransform.controls['invoiceheader_crno'].reset(""),
      this.apfailedTransform.controls['raiser_name'].reset(""),
      this.apfailedTransform.controls['raiserbranch_id'].reset(""),
      this.apfailedTransform.controls['invoice_no'].reset(""),
      this.apfailedTransform.controls['invoice_amount'].reset(""),
      this.apfailedTransform.controls['is_originalinvoice'].reset(""),
      this.apfailedTransform.controls['invoice_status'].reset(""),
      this.failtrsearch('cleared')
    this.searchfailedTransData = { apinvoiceheaderstatus_id: 26 }
    // this.failedTransSummarySearch(1)
  }

  failedViewEntrypresentpage = 1
  failedViewEntrySummary: any = {}
  showViewEntry: boolean = false

  pagesizefailedViewEntry = 10;
  getfailedViewEntrytotalcount: any
  // failedViewEntrypresentpage: number = 1;
  failedTransCrno: any
  failedViewEntry(crno) {
    this.faildpopup();
    let page = 1
    let crndata = crno.apinvoiceheader_crno
    this.open = true
    // this.showViewEntry = true
    this.failedTransCrno = crndata

    this.SpinnerService.show()
    this.SummaryApiviewfailedObjNew = {
      method: "get",
      url: this.ecfmodelurl + "entryserv/fetch_commonentrydetails/" + this.failedTransCrno,
      params: "",
    };
    this.ecfservice.getViewEntry(crndata, page)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result['data'] != undefined) {
          this.failedViewEntrySummary = result['data']
          console.log("This are the view data------------->>>>>>>>>>>>>>>>......", this.failedViewEntrySummary)
          let datapagination = result["pagination"];

          if (this.failedViewEntrySummary.length > 0) {
            this.length_FailedViewEntry = result?.count
            this.failedViewEntrypresentpage = datapagination.index;
            let err = this.failedViewEntrySummary[this.failedViewEntrySummary.length - 1].errordescription
            if (err != undefined && err != null && err != '' && err != '0') {
              this.viewEntryError(err, this.failedViewEntrySummary.length - 1)
            }
            else {
              this.closeErrorDescription()
            }

          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  length_FailedViewEntry = 0;
  pageSize_FailedViewEntry = 10
  pageIndexFailedViewEntry = 0
  handleFailedViewEntry(event: PageEvent) {
    this.length_FailedViewEntry = event.length;
    this.pageSize_FailedViewEntry = event.pageSize;
    this.pageIndexFailedViewEntry = event.pageIndex;
    this.failedViewEntrypresentpage = event.pageIndex + 1;
    this.failedViewEntry(this.failedTransCrno);
  }

  open: boolean = false
  showNewLine: boolean = false;
  selectedErrorDescription = " ";
  selectedRowIndex = -1;
  viewEntryError(errordescription: string, index: number) {
    this.selectedErrorDescription = errordescription;
    this.selectedRowIndex = index;
    this.showNewLine = true;
  }

  closeErrorDescription() {
    this.showNewLine = false;
    this.selectedErrorDescription = '';
    this.selectedRowIndex = -1;
  }
  viewerrorBack() {
    this.failedViewEntrypresentpage = 1
    this.submitclosebutton.nativeElement.click();
    // this.failedTransSummarySearch(1)
  }
  FailedInitStatus: any
  getStatDropFailed() {
    this.ecfservice.getStatusDropFailed()
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.FailedInitStatus = result['data']

        }
      })
  }


  failedInitType: any = ""
  failedInitTypestat: string = ""
  statusfalg: boolean = false
  // failedChangeStat(data) {
  //   this.apinvHeader_id = data.id
  //   console.log("failedChangeStat ------", this.apinvHeader_id)
  //   this.failedTransCrno = data.crno
  //   this.showcbsrefno = false
  //   this.failedInitType = data.apinvoicehdr_status?.id
  //   this.failedInitTypestat = data.apinvoicehdr_status?.text
  //   if (this.failedInitType == 13) {
  //     this.statusfalg = true
  //     // x.id == 9 || x.id == 14 || || x.id == 12
  //     this.FailedInitStat = this.FailedInitStatus.filter(x => x.id == 27)
  //   }
  //   else if (this.failedInitType == 25) {
  //     this.statusfalg = true
  //     this.FailedInitStat = this.FailedInitStatus.filter(x => x.id == 9 || x.id == 12)
  //   }
  // }
  neftinitiated = false;
  failedChangeStat(data) {
    this.apinvHeader_id = data.id
    console.log("failedChangeStat ------", this.apinvHeader_id)
    this.failedTransCrno = data.crno
    this.showcbsrefno = false
    this.failedInitType = data.apinvoicehdr_status?.id
    this.failedInitTypestat = data.apinvoicehdr_status?.text
    if (this.failedInitType == 13) {
      this.statusfalg = true
      this.FailedInitStat =[]
      this.faildpopup2()
      // x.id == 9 || x.id == 14 || || x.id == 12
      this.FailedInitStat = this.FailedInitStatus.filter(x => x.id == 27)
      this.failed_field = {
        label: "Change Status To",
        params: "",
        searchkey: "query",
        displaykey: "text",
        wholedata: true,
        valuekey: "id",
        required: true,
        fronentdata: true,
        formcontrolname: "TransChangeStat",
        data: this.FailedInitStat,
        id: "ap-0437"
      };
    }
    else if (this.failedInitType == 25) {
      this.statusfalg = true
       this.FailedInitStat =[]
      this.faildpopup2()
      this.FailedInitStat = this.FailedInitStatus.filter(x => x.id == 9 || x.id == 8)
      this.failed_field = {
        label: "Change Status To",
        params: "",
        searchkey: "query",
        displaykey: "text",
        Outputkey: "id",
        valuekey: "id",
        required: true,
        fronentdata: true,
        formcontrolname: "TransChangeStat",
        data: this.FailedInitStat,
        id: "ap-0437"
      };
    }
     else if (this.failedInitType == 28) {
      this.statusfalg = true
      this.neftinitiated = true
       this.FailedInitStat =[]
      this.faildpopup2()
      this.FailedInitStat = this.FailedInitStatus.filter(x => x.id ==15)
      this.failed_field = {
        label: "Change Status To",
        params: "",
        searchkey: "query",
        displaykey: "text",
        Outputkey: "id",
        valuekey: "id",
        required: true,
        fronentdata: true,
        formcontrolname: "TransChangeStat",
        data: this.FailedInitStat,
        id: "ap-0437"
      };
    }
  }

  showcbsrefno = false
  statusChange(id) {
    if ((id == 27 || id == 14) && this.failedInitType == 13)
      this.showcbsrefno = true
    else if ((id != 27 && id != 14) && this.failedInitType == 13)
      this.showcbsrefno = false
    else if (id == 9 && this.failedInitType == 25)
      this.showcbsrefno = true
    else if (id != 9 && this.failedInitType == 25)
      this.showcbsrefno = false

  }
  apinitiatereset() {
    this.frmFailedChg.controls['TransChangeStat'].reset(""),
      this.frmFailedChg.controls['cbsrefno'].reset(""),
      this.frmFailedChg.controls['remarks'].reset(""),
      this.frmFailedChg.controls['crno'].reset("")
  }

  SubmitChangeStatus() {
    let stat = this.frmFailedChg.value.TransChangeStat
    let cbsrefno = this.frmFailedChg.value.cbsrefno ? this.frmFailedChg.value.cbsrefno : ""
    let remarks = this.frmFailedChg.value.remarks
    // let crno = this.frmFailedChg.value.crno
    let crno = this.failedTransCrno
    let entry_refno = this.failedTransCrno
    if (stat == "" || stat == undefined || stat == null) {
      this.notification.showWarning("Please select Status")
      return false
    }
    if ((cbsrefno == "" || cbsrefno == undefined || cbsrefno == null) && this.showcbsrefno) {
      this.notification.showWarning("Please enter CBS Ref NO.")
      return false
    }
    if (remarks == "" || remarks == undefined || remarks == null) {
      this.notification.showWarning("Please enter Remarks")
      return false
    }
    this.ecfservice.failedTransChangeStat({ 'apinvoiceheader_id': this.apinvHeader_id, 'apinvoiceheaderstatus': stat, 'cbsrefno': cbsrefno, 'remarks': remarks })
      .subscribe(result => {
        if (result['status'] == "success") {
          this.notification.showSuccess(result?.message)
          this.SpinnerService.hide()
          this.failedclosedbutton.nativeElement.click();
        }
        else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          this.failedclosedbutton.nativeElement.click();
        }
      })
  }
  Repushcall(data) {
    this.SpinnerService.show()
    let f_data = data?.id
    let f_satus = data.apinvoicehdr_status.text
    this.ecfservice.Repushfailedtrans(f_data, f_satus).subscribe(results => {
      if (results?.code) {
        this.SpinnerService.hide()
        this.notification.showError(results?.description);
      }
      if (results?.status == "success") {
        this.SpinnerService.hide()
        this.notification.showSuccess(results?.status)
      }

      else if (results?.status != undefined) {
        this.SpinnerService.hide()
        this.notification.showError(results?.status)
      }

    })

  }
  errormessage(data) {
    this.apinvHeader_id = data.id
    console.log("errormessage ------", this.apinvHeader_id)
    let stat = this.frmFailedChg.value.TransChangeStat
    let cbsrefno = this.frmFailedChg.value.cbsrefno ? this.frmFailedChg.value.cbsrefno : ""
    let remarks = this.frmFailedChg.value.remarks
    // let crno = this.frmFailedChg.value.crno
    let crno = this.failedTransCrno
    let entry_refno = this.failedTransCrno
    this.ecfservice.failedTransChangeStat({ 'id': this.apinvHeader_id, 'apinvoiceheaderstatus': stat, 'cbsrefno': cbsrefno, 'remarks': remarks, 'crno': crno, 'entry_refno': entry_refno })
      .subscribe(result => {
        let entryerror = remarks;
      })
  }

  isAdvsummarypage: boolean
  has_advpageprevious = false
  has_advpagenext = false
  pagesizeadvSummary = 10;
  getadvSummarytotalcount: any
  advSummaryData: any
  searchadvSummaryData: any = {}
  advSummarypresentpage: number = 1;
  advanceSummarySearch(pageNumber = 1) {
    if (this.apAdvSummaryform) {
      let search = this.apAdvSummaryform.value
      this.searchadvSummaryData.payto = search.payto;
      this.searchadvSummaryData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchadvSummaryData.ppxheader_fromdate = search.ppxheader_fromdate;
      this.searchadvSummaryData.ppxheader_todate = search.ppxheader_todate;

      if (this.apAdvSummaryform.value.ppxheader_fromdate == "" && this.apAdvSummaryform.value.ppxheader_todate != "") {
        this.notification.showWarning("Please Select  From Date.")
        return false
      }
      if (this.apAdvSummaryform.value.ppxheader_fromdate != "" && this.apAdvSummaryform.value.ppxheader_todate == "") {
        this.notification.showWarning("Please Select To Date.")
        return false
      }
      this.searchadvSummaryData.ppxheader_fromdate = this.datePipe.transform(search.ppxheader_fromdate, 'yyyy-MM-dd');
      this.searchadvSummaryData.ppxheader_todate = this.datePipe.transform(search.ppxheader_todate, 'yyyy-MM-dd');

      for (let i in this.searchadvSummaryData) {
        if (this.searchadvSummaryData[i] === null || this.searchadvSummaryData[i] === "") {
          delete this.searchadvSummaryData[i];
        }
      }
    }
    else {
      this.searchadvSummaryData = {}
    }
    // if (pageNumber == 1) {
    //   this.pageIndex_adv = 0;
    // }
    this.SpinnerService.show()
    this.ecfservice.getAdvanceSummary(this.searchadvSummaryData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.advSummaryData = result['data']
          let datapagination = result["pagination"];
          this.getadvSummarytotalcount = datapagination?.count
          this.length_adv = datapagination?.count
          if (this.advSummaryData.length === 0) {
            this.isAdvsummarypage = false
          }
          if (this.advSummaryData.length > 0) {
            this.has_advpagenext = datapagination.has_next;
            this.has_advpageprevious = datapagination.has_previous;
            this.advSummarypresentpage = datapagination.index;
            this.isAdvsummarypage = true
          }
          if (this.advSummarypresentpage == 1)
            this.pageIndex_adv = 0
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  nextClickAdvSummary() {
    if (this.has_advpagenext === true) {
      this.advanceSummarySearch(this.advSummarypresentpage + 1)
    }
  }

  previousClickAdvSummary() {
    if (this.has_advpageprevious === true) {
      this.advanceSummarySearch(this.advSummarypresentpage - 1)
    }
  }

  resetAdvSummary() {
    this.apAdvSummaryform.controls['payto'].reset(""),
      this.apAdvSummaryform.controls['raiserbranch_id'].reset(""),
      this.apAdvSummaryform.controls['ppxheader_fromdate'].reset(""),
      this.apAdvSummaryform.controls['ppxheader_todate'].reset(""),
      this.advSummarypresentpage = 1
    this.advanceSummarySearch(1);
  }
  commonbackview(text = "") {
    if (text != "")
      this.backdata = text
    if (this.backdata == 'apcommon') {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.InvoiceDetailForm = false
      this.CommonSummaryForm = true
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      // this.dataclear('')
      this.overallreset()
      // this.overallreset_approval()
      // this.resetcommon()
      this.rptFormat = 4
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 22 || x.id == 23 || x.id == 37 || x.id == 46 || x.id == 49 || x.id == 50)
    } else if (this.backdata == 'apapproverview') {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APApproverInvoiceForm = true
      this.InvoiceDetailForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.overallreset();
      this.overallreset_approval()
      // this.dataclear('')
      // this.resetapappInv()
      this.rptFormat = 2
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 23 || x.id == 49 || x.id == 50)
    } else if (this.backdata == 'bounceview') {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.InvoiceDetailForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = true
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.rptFormat = 3
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 37 || x.id == 46)
      this.dataclear('')
      this.overallreset()
      this.overallreset_bounce()
      this.resetapbounce()
      this.restfiled = []
    } else if (this.backdata == 'aprejectview') {
      this.restfiled = []
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = false
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = true
      this.APFailedTransForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      this.dataclear('')
      this.overallreset()
      this.overallreset_reject()
      // this.aprejectSummarySearch(1)
      this.resetapreject()
      this.overallreset();
    } else {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ecfviewForm = false
      this.batchviewForm = false
      this.APApprovalForm = false
      this.APApprovalForms = false
      this.preparePaymentForm = false
      this.PreparepaymentForms = false
      this.BounceSummaryForm = false
      this.paymentfileForm = false
      this.CommonSummaryForm = false
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.APmakerForm = true
      this.APECFmakeForm = false
      this.APCreateForm = false
      this.APApproverForm = false
      this.APBounceForm = false
      this.APRejectForm = false
      this.APFailedTransForm = false
      this.APApproverInvoiceForm = false
      this.APInwardSummaryForm = false
      this.isecfview = false
      this.ispoview = false
      this.isinwardAdd = false
      // this.ecfwiseMaker = false
      // this.invwiseMaker = false
      // this.apSummarySearch(1)
      // this.resetap()
      this.overallreset();
    }
  }
  // commonbackview(text = "") {
  //   if (text != "")
  //     this.backdata = text
  //   if (this.backdata == 'apcommon') {
  //     this.ecfsummaryForm = false
  //     this.ecfcreateForm = false
  //     this.ecfviewForm = false
  //     this.batchviewForm = false
  //     this.APApprovalForm = false
  //     this.APApprovalForms = false
  //     this.preparePaymentForm = false
  //     this.PreparepaymentForms = false
  //     this.BounceSummaryForm = false
  //     this.paymentfileForm = false
  //     this.InvoiceDetailForm = false
  //     this.CommonSummaryForm = true
  //     this.BounceDetailForm = false
  //     this.commonInvViewForm = false
  //     this.ecfapprovalsummaryForm = false
  //     this.ecfapprovalviewForm = false
  //     this.AppInvoiceDetailViewForm = false
  //     this.APmakerForm = false
  //     this.APECFmakeForm = false
  //     this.APCreateForm = false
  //     this.APApproverForm = false
  //     this.APBounceForm = false
  //     this.APRejectForm = false
  //     this.APFailedTransForm = false
  //     this.APApproverInvoiceForm = false
  //     this.APInwardSummaryForm = false
  //     this.isecfview = false
  //     this.ispoview = false
  //     this.isinwardAdd = false
  //     this.dataclear('')
  //     // this.resetcommon()
  //     this.rptFormat = 4
  //     this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 22 || x.id == 23 || x.id == 37 || x.id == 46 || x.id == 49 || x.id == 50)
  //   } else if (this.backdata == 'apapproverview') {

  //     this.ecfsummaryForm = false
  //     this.ecfcreateForm = false
  //     this.ecfviewForm = false
  //     this.batchviewForm = false
  //     this.APApprovalForm = false
  //     this.APApprovalForms = false
  //     this.preparePaymentForm = false
  //     this.PreparepaymentForms = false
  //     this.BounceSummaryForm = false
  //     this.paymentfileForm = false
  //     this.CommonSummaryForm = false
  //     this.BounceDetailForm = false
  //     this.commonInvViewForm = false
  //     this.ecfapprovalsummaryForm = false
  //     this.ecfapprovalviewForm = false
  //     this.AppInvoiceDetailViewForm = false
  //     this.APmakerForm = false
  //     this.APECFmakeForm = false
  //     this.APCreateForm = false
  //     this.APApproverForm = false
  //     this.APBounceForm = false
  //     this.APRejectForm = false
  //     this.APFailedTransForm = false
  //     this.APApproverInvoiceForm = true
  //     this.InvoiceDetailForm = false
  //     this.APInwardSummaryForm = false
  //     this.isecfview = false
  //     this.ispoview = false
  //     this.isinwardAdd = false
  //     this.dataclear('')
  //     this.resetapappInv()
  //     this.rptFormat = 2
  //     this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 23 || x.id == 49 || x.id == 50)

  //   } else if (this.backdata == 'bounceview') {

  //     this.ecfsummaryForm = false
  //     this.ecfcreateForm = false
  //     this.ecfviewForm = false
  //     this.batchviewForm = false
  //     this.APApprovalForm = false
  //     this.APApprovalForms = false
  //     this.preparePaymentForm = false
  //     this.PreparepaymentForms = false
  //     this.BounceSummaryForm = false
  //     this.paymentfileForm = false
  //     this.CommonSummaryForm = false
  //     this.BounceDetailForm = false
  //     this.commonInvViewForm = false
  //     this.ecfapprovalsummaryForm = false
  //     this.ecfapprovalviewForm = false
  //     this.AppInvoiceDetailViewForm = false
  //     this.APmakerForm = false
  //     this.APECFmakeForm = false
  //     this.APCreateForm = false
  //     this.APApproverForm = false
  //     this.APBounceForm = true
  //     this.APRejectForm = false
  //     this.APFailedTransForm = false
  //     this.APApproverInvoiceForm = false
  //     this.APInwardSummaryForm = false
  //     this.isecfview = false
  //     this.ispoview = false
  //     this.isinwardAdd = false
  //     this.rptFormat = 3
  //     this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 37 || x.id == 46)
  //     this.dataclear('')
  //     this.resetapbounce()
  //     this.restfiled = []
  //   } else if (this.backdata == 'aprejectview') {
  //     this.restfiled = []
  //     this.ecfsummaryForm = false
  //     this.ecfcreateForm = false
  //     this.ecfviewForm = false
  //     this.batchviewForm = false
  //     this.APApprovalForm = false
  //     this.APApprovalForms = false
  //     this.preparePaymentForm = false
  //     this.PreparepaymentForms = false
  //     this.BounceSummaryForm = false
  //     this.paymentfileForm = false
  //     this.CommonSummaryForm = false
  //     this.BounceDetailForm = false
  //     this.commonInvViewForm = false
  //     this.ecfapprovalsummaryForm = false
  //     this.ecfapprovalviewForm = false
  //     this.AppInvoiceDetailViewForm = false
  //     this.APmakerForm = false
  //     this.APECFmakeForm = false
  //     this.APCreateForm = false
  //     this.APApproverForm = false
  //     this.APBounceForm = false
  //     this.APRejectForm = true
  //     this.APFailedTransForm = false
  //     this.APApproverInvoiceForm = false
  //     this.APInwardSummaryForm = false
  //     this.isecfview = false
  //     this.ispoview = false
  //     this.isinwardAdd = false
  //     this.dataclear('')
  //     // this.aprejectSummarySearch(1)
  //     this.resetapreject()

  //   } else {
  //     this.ecfsummaryForm = false
  //     this.ecfcreateForm = false
  //     this.ecfviewForm = false
  //     this.batchviewForm = false
  //     this.APApprovalForm = false
  //     this.APApprovalForms = false
  //     this.preparePaymentForm = false
  //     this.PreparepaymentForms = false
  //     this.BounceSummaryForm = false
  //     this.paymentfileForm = false
  //     this.CommonSummaryForm = false
  //     this.BounceDetailForm = false
  //     this.commonInvViewForm = false
  //     this.ecfapprovalsummaryForm = false
  //     this.ecfapprovalviewForm = false
  //     this.AppInvoiceDetailViewForm = false
  //     this.APmakerForm = true
  //     this.APECFmakeForm = false
  //     this.APCreateForm = false
  //     this.APApproverForm = false
  //     this.APBounceForm = false
  //     this.APRejectForm = false
  //     this.APFailedTransForm = false
  //     this.APApproverInvoiceForm = false
  //     this.APInwardSummaryForm = false
  //     this.isecfview = false
  //     this.ispoview = false
  //     this.isinwardAdd = false
  //     // this.ecfwiseMaker = false
  //     // this.invwiseMaker = false
  //     // this.apSummarySearch(1)
  //     // this.resetap()
  //     this.resetapinv()
  //   }
  // }

  ecftypeid: any;
  payto_id: any;
  invdtladdonid: any;
  debitdata: any;
  invhdrstatus: any;
  liqDetails: any;
  isCapitalizedStat: any;
  istdsapplic: any
  tdslist: any
  paymentInstr: any
  transaction_branch
  SummarycommoninvoiceapData: any
  SummaryApicommoninvoceapObjNew: any
  showRecurDates = false
  PCA_Det = []
  credit_ref_no:any
  ecftype_id:any
  // commoninvoiceheader_view() {
  //   this.SummaryApicommoninvoceapObjNew = {
  //     method: "get",
  //     url: this.ecfmodelurl + "ecfapserv/invoiceheader/"+this.apinvHeader_id,
  //     params: "&type=all",
  //   }
  //   this.getCommontInvHdr()
  // }
  
  @ViewChild('closeAttachment') closeAttachment;
  attachmentback() {
    this.closeAttachment.nativeElement.click()
  }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0009"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  is_component = false
  tcsadded= false;
  commoditynamepanel:any
  BranchName:any
  msme:any
  msme_reg_no:any
  showreg:boolean = false;
  getCommontInvHdr() {
    this.SpinnerService.show();
    this.ecfservice.getInvHdrComplete(this.apinvHeader_id, 1)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result.code == undefined) {
          this.headerdata = result['data']
          this.allFiles = []
          for(let i=0; i< this.headerdata.length; i++){
              this.allFiles =this.headerdata[i].file_data
          }
          this.length_attachments = this.allFiles.length;
          this.updatePagedFiles() 
          
          let num: number = +this.headerdata[0].totalamount;
          let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
          amt = amt ? amt.toString() : '';
          num = +this.headerdata[0].invoiceamount;
          let taxableamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
          taxableamt = taxableamt ? taxableamt.toString() : '';
          this.Emppanel = this.headerdata[0].raisername + ' - ' + this.headerdata[0].raisercode
          this.InvNopanel = this.headerdata[0]?.invoiceno
          this.BranchGSTpanel = this.headerdata[0]?.raisorbranchgst
          this.BranchName = this.headerdata[0]?.invoice_branch?.name_code
          this.Pmdpanel = this.headerdata[0]?.pmd_data?.location
          this.InvDatepanel = this.datePipe.transform(this.headerdata[0]?.invoicedate, 'dd-MMM-yyyy')
          this.InvAmtpanel = amt
          this.TaxableAmtpanel = taxableamt
          this.Statuspanel = this.shareservice.invhdrstatus.value
          this.Supplierpanel = this.headerdata[0].supplier_id?.name + ' - ' + this.headerdata[0].supplier_id?.code
          this.SupGSTpanel = this.headerdata[0].supplier_id?.gstno
          this.commoditynamepanel = this.headerdata[0]?.commodity?.name
          this.Service_typepanel = this.headerdata[0]?.servicetype?.text
          this.ecftype_id = this.headerdata[0].ecftype
          this.credit_ref_no = this.headerdata[0]?.credit_refno
          this.Recur_fromdatepanel = this.datePipe.transform(this.headerdata[0]?.recur_fromdate, 'dd-MMM-yyyy')
          this.Recur_fromdatepanel = this.datePipe.transform(this.headerdata[0]?.recur_fromdate, 'dd-MMM-yyyy')
          this.Recur_todatepanel = this.datePipe.transform(this.headerdata[0]?.recur_todate, 'dd-MMM-yyyy')
          this.Gstpanel = this.headerdata[0]?.invoicegst == 'Y' ? 'Yes' : 'No'
          this.Is_pcapanel = this.headerdata[0]?.is_pca ? 'Yes' : 'No'
          this.Pca_nopanel = this.headerdata[0]?.pca_no
          this.Is_recurpanel = this.headerdata[0]?.is_recur?.text
          this.Is_capitalized = this.headerdata[0]?.is_capitalized === true ||this.headerdata[0]?.is_capitalized === 'true' ? 'Yes' : 'No';
          this.msme = this.headerdata[0]?.is_msme === true  ? 'Yes' : 'No';
             if(this.headerdata[0]?.is_msme){
              this.showreg = true;
              this.msme_reg_no = this.headerdata[0]?.msme_reg_no
            }
            else{
              this.showreg = false
            }
           this.frmInvHdr.patchValue(
              {
                rsrCode: this.headerdata[0].raisercode,
                rsrEmp: this.headerdata[0].raisername + ' - ' + this.headerdata[0].raisercode,
                supplier: this.headerdata[0].supplier_id?.name + ' - ' + this.headerdata[0].supplier_id?.code,
                supGST: this.headerdata[0].supplier_id?.gstno,
                status: this.shareservice.invhdrstatus.value,
                branchGST: this.headerdata[0]?.raisorbranchgst,
                invNo: this.headerdata[0]?.invoiceno,
                invDate: this.datePipe.transform(this.headerdata[0]?.invoicedate, 'dd-MMM-yyyy'),
                invAmt: amt,
                taxableAmt: taxableamt,
                gst: this.headerdata[0]?.invoicegst == 'Y' ? 'Yes' : 'No',
                is_recur: this.headerdata[0]?.is_recur?.text,
                service_type: this.headerdata[0]?.servicetype?.text,
                recur_fromdate: this.datePipe.transform(this.headerdata[0]?.recur_fromdate, 'dd-MMM-yyyy'),
                recur_todate: this.datePipe.transform(this.headerdata[0]?.recur_todate, 'dd-MMM-yyyy'),
                pmd: this.headerdata[0]?.pmd_data?.location,
                is_pca: this.headerdata[0]?.is_pca ? 'Yes' : 'No',
                pca_no: this.headerdata[0]?.pca_no,
                notename:this.headerdata[0]?.apheader_details?.notename ,
              })
            if (this.headerdata[0]?.is_pca) {
              this.PCA_Det = []
              this.PCA_Det.push({ 'pca_no': this.headerdata[0]?.pca_no, pca_bal_amt: this.headerdata[0]?.pca_bal_amt })
            }
            if (this.headerdata[0]?.servicetype?.id == 2 || this.headerdata[0]?.servicetype?.id == 3)
              this.showRecurDates = true
            else
              this.showRecurDates = false
              
          this.ecftypeid = this.headerdata[0]?.aptype_id
          this.payto_id = this.headerdata[0]?.payto_id
          this.isCapitalizedStat = this.headerdata[0]?.fa_repush?.id

          this.transaction_branch = this.headerdata[0]?.apheader_details.branch?.code + "-" + this.headerdata[0]?.apheader_details.branch?.name
          console.log('this.isCapitalizedStat------', this.isCapitalizedStat)
          console.log('this.backdata------', this.backdata)
          this.condit()
          if (this.ecftypeid == 14) {
            this.istdsapplic = undefined
          }
          if (this.headerdata[0]?.is_tds_applicable?.text != undefined && this.headerdata[0]?.is_tds_applicable?.text != null && this.headerdata[0]?.is_tds_applicable?.text != ''){
            this.istdsapplic = this.headerdata[0]?.is_tds_applicable?.text
            this.tdslist = this.headerdata[0]?.is_tds_applicable
            this.CreaditDetailForm.patchValue({
              is_tds_applicable: this.istdsapplic
            })
            console.log("tdslist--->",this.tdslist)
          }
          else
            this.istdsapplic = undefined

          if (this.headerdata[0]?.payment_instruction != undefined && this.headerdata[0]?.payment_instruction != null && this.headerdata[0]?.payment_instruction != ''){
            this.paymentInstr = this.headerdata[0]?.payment_instruction
            this.CreaditDetailForm.patchValue({
              payment_instruction:this.paymentInstr
            })
          }
          else
            this.paymentInstr = undefined
          if (this.payto_id == undefined || this.payto_id == "")
            this.payto_id = this.headerdata[0]?.ppx
          if (this.headerdata[0] !== undefined && this.headerdata[0] !== null) {
            this.crno = this.headerdata[0].apinvoiceheader_crno
            this.invhdrstatus = this.shareservice.invhdrstatus.value
            if (this.ecftypeid == 4 && this.invhdrstatus == 'PAID') {
              this.SpinnerService.show();
              this.ecfservice.getppxdetails(this.crno)
                .subscribe(result => {
                  this.SpinnerService.hide();
                  this.liqDetails = result?.data

                  let supemp
                  if (this.headerdata[0].payto_id == "S")
                    supemp = this.headerdata[0].supplier_id.name
                  else
                    supemp = this.headerdata[0].raisername
                  this.frmLiq.patchValue(
                    {
                      advno: this.headerdata[0].apinvoiceheader_crno,
                      supplier: supemp,
                      amount: this.headerdata[0].invoiceamount
                    })
                })
            }
            // this.frmInvHdr.patchValue(
            //   {
            //     rsrName: this.headerdata[0].raisername,
            //     rsrBranch: this.raiserBr,
            //     supplier: this.headerdata[0].supplier_id?.name,
            //     gst: this.headerdata[0].invoicegst == 'Y' ? 'Yes' : 'No',
            //     status: this.shareservice.invhdrstatus.value,
            //   }
            // )
            if (this.ecftypeid != 4) {
              this.invDetailList = this.headerdata[0].invoicedetails.data
              this.is_component = this.headerdata[0].invoicedetails.data[0].is_component ?? false
             for (let i = 0; i < this.invDetailList.length; i++) {
                if (this.invDetailList[i].productname?.toLowerCase().trim() === "tax collected at source") {
                  this.tcsadded = true;
                }
              }
              let amtdata = this.invDetailList.map(x => x.amount)
              let taxamount = this.invDetailList.map(x => x.taxamount)
              this.taxableamt = this.invDetailList.reduce((sum, x) => sum + Number(x.taxable_amount || 0), 0);
              this.OtherAmount = this.headerdata[0].otheramount
              this.Roundoffamount = this.headerdata[0].roundoffamt
              if(this.ecftype_id ==1){
                this.INVsum = Number(amtdata.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2))+Number(taxamount.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2))
              }
              else{
              this.INVsum = amtdata.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
              }
              let cred = this.headerdata[0].ecfap_credit;
              this.invCreditList = cred.filter(x => x.amount >= 0 && x.is_display == "YES")
              let credamtdata = this.invCreditList.map(x => x.amount)
              this.cdtsum = credamtdata.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
            }
            else {
              this.adddebits(this.headerdata[0].invoicedetails.data[0])

              let cred = this.headerdata[0].ecfap_credit;
              this.invCreditList = cred.filter(x => x.amount >= 0 && x.is_display == "YES")
              let credamtdata = this.invCreditList.map(x => x.amount)
              this.cdtsum = credamtdata.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);

            }
          }
          else {
            this.toastr.error('Invoice Hdr not available');
            return false;
          }
        }
        else {
          console.log("Error while fetching Invoice Header.")
        }

      }, error => {
        console.log("Error while fetching Inv Header data")
        this.SpinnerService.hide();
      }
      )

  }



  condit() {
    if (this.ecftypeid == 2 || this.payto_id == 'S' || this.ecftypeid == 14) {
      this.SummarycommoninvoiceapData = [
        { columnname: "Invoice CR No", key: "apinvoiceheader_crno" },
        { columnname: "GST Applicable", key: "invoicegst" },
        { columnname: "Supplier Name", key: "supplier_id", type: "object", objkey: "name", },
        { columnname: "Supplier GST No", key: "supplier_id", "type": 'object', objkey: "gstno", },
        { columnname: "Supplier State", key: "supplierstate_id", "type": 'object', objkey: "name", },
        { columnname: "Place Of Supply", key: "place_of_supply", "type": 'object', objkey: "name", },
        { columnname: "Taxable Amount", key: "invoiceamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Tax Amount", key: "taxamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Total Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Physical Verification", key: "is_originalinvoice", type: "object", objkey: "text", },
        { columnname: "Is Recurring", key: "is_recur", type: "object", objkey: "text", },
        { columnname: "Recurring Type", key: "servicetype", type: "object", objkey: "text", },
        { columnname: "Invoice Status", key: "apinvoiceheader_status", type: "object", objkey: "text", },
        {
          columnname: "Attached PDF", key: "test", function: true,
          clickfunction: this.filefun.bind(this),
        },

      ]
    }
    else if (this.payto_id != 'E') {
      this.SummarycommoninvoiceapData = [
        { columnname: "Invoice CR No", key: "apinvoiceheader_crno" },
        { columnname: "GST Applicable", key: "invoicegst" },
        { columnname: "Invoice No", key: "invoiceno", },
        { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
        { columnname: "Place Of Supply", key: "place_of_supply", "type": 'object', objkey: "name", },
        { columnname: "Taxable Amount", key: "invoiceamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Total Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Physical Verification", key: "is_originalinvoice", type: "object", objkey: "text", },
        { columnname: "Is Recurring", key: "is_recur", type: "object", objkey: "text", },
        { columnname: "Recurring Type", key: "servicetype", type: "object", objkey: "text", },
        { columnname: "Invoice Status", key: "apinvoiceheader_status", type: "object", objkey: "text", },
        {
          columnname: "Attached PDF", key: "test", function: true,
          clickfunction: this.filefun.bind(this),
        },
      ]
    }
    else if (this.ecftypeid == 7) {
      this.SummarycommoninvoiceapData = [
        { columnname: "Invoice CR No", key: "apinvoiceheader_crno" },
        { columnname: "GST Applicable", key: "invoicegst" },
        { columnname: "Credit Ref No", key: "credit_refno" },
        { columnname: "Place Of Supply", key: "place_of_supply", "type": 'object', objkey: "name", },
        { columnname: "Taxable Amount", key: "invoiceamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Total Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Physical Verification", key: "is_originalinvoice", type: "object", objkey: "text", },
        { columnname: "Is Recurring", key: "is_recur", type: "object", objkey: "text", },
        { columnname: "Recurring Type", key: "servicetype", type: "object", objkey: "text", },
        { columnname: "Invoice Status", key: "apinvoiceheader_status", type: "object", objkey: "text", },
        {
          columnname: "Attached PDF", key: "test", function: true,
          clickfunction: this.filefun.bind(this),
        },
      ]
    }
    else if (this.headerdata[0]?.servicetype?.id == 2 || this.headerdata[0]?.servicetype?.id == 3) {
      this.SummarycommoninvoiceapData = [
        { columnname: "Invoice CR No", key: "apinvoiceheader_crno" },
        { columnname: "GST Applicable", key: "invoicegst" },
        { columnname: "Place Of Supply", key: "place_of_supply", "type": 'object', objkey: "name", },
        { columnname: "Taxable Amount", key: "invoiceamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Total Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Physical Verification", key: "is_originalinvoice", type: "object", objkey: "text", },
        { columnname: "Is Recurring", key: "is_recur", type: "object", objkey: "text", },
        { columnname: "Recurring Type", key: "servicetype", type: "object", objkey: "text", },
        { columnname: "Recurring From", key: "recur_fromdate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
        { columnname: "Recurring To", key: "recur_todate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
        { columnname: "Invoice Status", key: "apinvoiceheader_status", type: "object", objkey: "text", },
        {
          columnname: "Attached PDF", key: "test", function: true,
          clickfunction: this.filefun.bind(this),
        },
      ]
    }
    else {
      this.SummarycommoninvoiceapData = [
        { columnname: "Invoice CR No", key: "apinvoiceheader_crno" },
        { columnname: "GST Applicable", key: "invoicegst" },
        { columnname: "Place Of Supply", key: "place_of_supply", "type": 'object', objkey: "name", },
        { columnname: "Taxable Amount", key: "invoiceamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Total Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
        { columnname: "Physical Verification", key: "is_originalinvoice", type: "object", objkey: "text", },
        { columnname: "Is Recurring", key: "is_recur", type: "object", objkey: "text", },
        { columnname: "Recurring Type", key: "servicetype", type: "object", objkey: "text", },
        { columnname: "Invoice Status", key: "apinvoiceheader_status", type: "object", objkey: "text", },
        {
          columnname: "Attached PDF", key: "test", function: true,
          clickfunction: this.filefun.bind(this),
        },
      ]
    }
  }
  adddebits(detail) {
    this.invtotamount = String(detail.totalamount).replace(/,/g, '')
    let data = detail?.ecfap_debit
    if (data?.length != undefined) {
      this.invDebitList = data.filter(x => x.is_display == "YES" && x.amount > 0)
      let amtdata = this.invDebitList.map(x => x.amount)
      this.debitsum = amtdata.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
      console.log("debitdata", this.invDebitList)
      if (this.ecftypeid != 4) {
        this.showinvoicediv = false
        this.showdebitdiv = true
      }
    }
  }

  debitClose() {
    this.showinvoicediv = true
    this.showdebitdiv = false
  }

  debitbacks() {
    this.debitClose()
  }

  getfiles(data) {
    this.SpinnerService.show()
    this.ecfservice.filesdownload(data?.file_id)
      .subscribe((results) => {

        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }

  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  pdfurl: any
  jpgUrlsAPI: any

  data(datas) {
    let id = datas?.file_id
    let filename = datas?.file_name
    // this.ecfservice.downloadfile(id)




    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = filename.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

      this.showimageHeaderAPI = true
      this.showimagepdf = false
      this.jpgUrlsAPI = this.imageUrl + "ecfserv/ecffile/" + id + "?token=" + token;
    }
    if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
      this.showimagepdf = true
      this.showimageHeaderAPI = false
      this.ecfservice.downloadfile(id)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl
        }, (error) => {
          this.errorHandler.handleError(error);
          this.showimagepdf = false
          this.showimageHeaderAPI = false
          this.SpinnerService.hide();
        })
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      this.showimagepdf = false
      this.showimageHeaderAPI = false
    }

  }

  overallback() {
    this.shareservice.comefrom.next("invoicedetail")
    this.router.navigate(['ECFAP/ecfapsummary'], { queryParams: { comefrom: "invoicedetail" }, skipLocationChange: true })
  }

  viewtrnlstCount: number
  viewtrnlist: any = [];

  viewtrnCurrentPage = 1
  viewtrn(page = 1) {
    this.view_trans()
    this.name = '';
    this.designation = '';
    this.branch = '';
    this.viewtrnlist = []
    this.SpinnerService.show()
    this.ecfservice.getViewTrans(this.apinvHeader_id, page).subscribe(data => {
      this.SpinnerService.hide()
      this.viewtrnlist = data['data'];
      this.SummaryApiviewObjNew = {
        method: "get",
        url: this.ecfmodelurl + "ecfapserv/view_transaction/" + this.apinvHeader_id,
        params: "",
      };
      this.viewtrnlstCount = data?.count
      let pagination = data['pagination']

      this.viewtrnCurrentPage = pagination?.index;
      if (this.viewtrnlist.length > 0) {
        this.length_viewtrn = data?.count
        this.viewtrnCurrentPage = pagination.index;
      }
      // this.view_summary()
    })
  }

  length_viewtrn = 0;
  pageSize_Viewtrn = 10
  pageIndexViewtrn = 0
  handleViewtrn(event: PageEvent) {
    this.length_viewtrn = event.length;
    this.pageSize_Viewtrn = event.pageSize;
    this.pageIndexViewtrn = event.pageIndex;
    this.viewtrnCurrentPage = event.pageIndex + 1;
    this.viewtrn(this.viewtrnCurrentPage);
  }

  name: any;
  designation: any
  branch: any;
  view(dt) {
    this.name = dt.from_user.name + ' - ' + dt.from_user.code
    this.designation = dt.from_user.designation
    this.branch = dt.from_user_branch.name + ' - ' + dt.from_user_branch.code
  }
  viewto(dt) {
    this.name = dt.to_user.name + ' - ' + dt.to_user.code
    this.designation = dt.to_user.designation
    this.branch = dt.to_user_branch.name + ' - ' + dt.to_user_branch.code
  }

  tranback() {
    this.closetranbutton.nativeElement.click()
  }

  approveap(is_approve_pay) {
    let data = this.APapprovesubmitform.value
    data.id = this.invheaderidd
    data.apinvoiceheaderstatus = 41
    if (data?.remarks == "" || data?.remarks == null || data?.remarks == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    this.SpinnerService.show()
    this.ecfservice.apapprovereaudit(data, is_approve_pay).subscribe(result => {
      this.SpinnerService.hide()
      console.log("approveresult", result)
      if (result?.status == "success") {
        this.notification.showSuccess("Transaction Initiated Successfully")
        this.ecfsummaryForm = false
        this.ecfcreateForm = false
        this.ecfviewForm = false
        this.batchviewForm = false
        this.APApprovalForm = false
        this.APApprovalForms = false
        this.preparePaymentForm = false
        this.PreparepaymentForms = false
        this.BounceSummaryForm = false
        this.paymentfileForm = false
        this.CommonSummaryForm = false
        this.BounceDetailForm = false
        this.commonInvViewForm = false
        this.ecfapprovalsummaryForm = false
        this.ecfapprovalviewForm = false
        this.AppInvoiceDetailViewForm = false
        this.APmakerForm = false
        this.APECFmakeForm = false
        this.APCreateForm = false
        this.APApproverForm = false
        this.APBounceForm = false
        this.APRejectForm = false
        this.APFailedTransForm = false
        this.APAdvSummaryForm = false
        this.APApproverInvoiceForm = true
        this.APInwardSummaryForm = false
        this.isecfview = false
        this.ispoview = false
        this.isinwardAdd = false
        this.dataclear('')
        this.overallreset()
        this.resetapappInv()
        this.rptFormat = 2
        this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 23 || x.id == 49 || x.id == 50)
      } else {
        this.notification.showError(result?.message)
        return false
      }
    })
  }

  reauditap() {
    let data = this.APapprovesubmitform.value
    data.apinvoiceheader_id = this.invheaderidd
    data.apinvoiceheaderstatus = 12
    if (data?.remarks == "" || data?.remarks == null || data?.remarks == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    this.SpinnerService.show()
    this.ecfservice.apapprovereaudit(data).subscribe(result => {
      this.SpinnerService.hide()
      console.log("reauditresult", result)
      if (result?.status == "success") {
        this.notification.showSuccess("Re Audited Successfully")
        this.ecfsummaryForm = false
        this.ecfcreateForm = false
        this.ecfviewForm = false
        this.batchviewForm = false
        this.APApprovalForm = false
        this.APApprovalForms = false
        this.preparePaymentForm = false
        this.PreparepaymentForms = false
        this.BounceSummaryForm = false
        this.paymentfileForm = false
        this.CommonSummaryForm = false
        this.BounceDetailForm = false
        this.commonInvViewForm = false
        this.ecfapprovalsummaryForm = false
        this.ecfapprovalviewForm = false
        this.AppInvoiceDetailViewForm = false
        this.APmakerForm = false
        this.APECFmakeForm = false
        this.APCreateForm = false
        this.APApproverForm = false
        this.APBounceForm = false
        this.APRejectForm = false
        this.APFailedTransForm = false
        this.APAdvSummaryForm = false
        this.APApproverInvoiceForm = true
        this.APInwardSummaryForm = false
        this.isecfview = false
        this.ispoview = false
        this.isinwardAdd = false
        this.dataclear('')
        this.overallreset()
        this.rptFormat = 2
        this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 23 || x.id == 49 || x.id == 50)
      } else {
        this.notification.showError(result?.message)
        return false
      }
    })
  }
  getbouncedchecklist() {
    this.checkInvID = this.headerdata[0].id
    this.checkinvdate = this.datePipe.transform(this.headerdata[0].invoicedate, 'yyyy-MM-dd')
    this.ecfservice.getBouncedChecklist(this.checkInvID).subscribe(data => {
      this.checklist = data['data'];

      console.log('check=', data);
    })
  }

  checkInvID: any
  checkinvdate: any
  checklist: any;
  // getBounced() {
  //   this.checklist = []
  //   this.checkInvID = this.apinvHeader_id
  //   this.checkinvdate = this.datePipe.transform(this.headerdata[0].invoicedate, 'yyyy-MM-dd')
  //   this.ecfservice.getBouncedChecklist(this.checkInvID).subscribe(data => {
  //     this.checklist = data['data'];
  // for(let i=0;i<this.checklist.length;i++){
  //   this.checklist[i]['clk']=data['data'][i].value.id == 1 ? true : false;;       
  //   this.checklist[i]['value']=data['data'][i].value.id       
  // }
  // console.log('check=', data);
  // if(this.checklist == undefined || this.checklist == null || this.checklist?.length == 0)
  // { 
  //   this.ecfservice.getAuditChecklist(this.ecftypeid).subscribe(data=>{
  //   this.checklist=data['data'];
  //   for(let i=0;i<this.checklist.length;i++){
  //     this.checklist[i]['clk']=false;
  //     this.checklist[i]['value']=2;       
  //   }
  //   console.log('check=',data);
  // })
  // }
  //   })

  // }
  getBounced() {
    this.audit()
    this.checklist = []
    this.checkInvID = this.apinvHeader_id
    this.auditchecklistsummary()
    console.log("getBounced ------", this.apinvHeader_id)
    this.checkinvdate = this.datePipe.transform(this.headerdata[0].invoicedate, 'yyyy-MM-dd')
    this.ecfservice.getBouncedChecklist(this.checkInvID).subscribe(data => {
      this.checklist = data['data'];
      // for(let i=0;i<this.checklist.length;i++){
      //   this.checklist[i]['clk']=data['data'][i].value.id == 1 ? true : false;;       
      //   this.checklist[i]['value']=data['data'][i].value.id       
      // }
      console.log('check=', data);
      // if(this.checklist == undefined || this.checklist == null || this.checklist?.length == 0)
      // { 
      //   this.ecfservice.getAuditChecklist(this.ecftypeid).subscribe(data=>{
      //   this.checklist=data['data'];
      //   for(let i=0;i<this.checklist.length;i++){
      //     this.checklist[i]['clk']=false;
      //     this.checklist[i]['value']=2;       
      //   }
      //   console.log('check=',data);
      // })
      // }
    })
  }

  getquestion() {
    this.audichecklist()
    this.checkInvID = this.headerdata[0].id
    this.checkinvdate = this.datePipe.transform(this.headerdata[0].invoicedate, 'yyyy-MM-dd')
    this.ecfservice.getAuditChecklist(this.ecftypeid).subscribe(data => {
      this.checklist = data['data'];
      for (let i = 0; i < this.checklist.length; i++) {
        this.checklist[i]['clk'] = true;
        this.checklist[i]['value'] = 1;
      }
      console.log('check=', data);
    })
  }
  dedupeChkType = ['exact',
    'supplier',
    'invoice_amount',
    'invoiceno',
    'invoice_date']

  exactList: any;
  withoutSuppList: any;
  withoutInvAmtList: any;
  withoutInvNoList: any;
  withoutInvDtList: any;

  presentpage: number = 1;
  identificationSize: number = 10;

  //Dedup
  getdedup() {
    this.dedupe()
    this.checkInvID = this.headerdata[0].id
    //dedupe for type(exact)
    this.ecfservice.getInwDedupeChk(this.checkInvID, this.dedupeChkType[0], 1)
      .subscribe(result => {
        this.exactList = result['data']
        console.log("exactList", this.exactList)

        // let dataPagination = result['pagination'];
        // if (this.exactList.length >= 0) {
        //   this.has_next = dataPagination.has_next;
        //   this.has_previous = dataPagination.has_previous;
        //   this.presentpage = dataPagination.index;
        //   this.isSummaryPagination = true;
        // } if (this.exactList <= 0) {
        //   this.isSummaryPagination = false;
        // }        
      }, error => {
        console.log("No data found")
      }
      )
    //dedupe for type(WITHOUT_SUPPLIER)
    this.ecfservice.getInwDedupeChk(this.checkInvID, this.dedupeChkType[1], 1)
      .subscribe(result => {
        this.withoutSuppList = result['data']
        console.log("WITHOUT_SUPPLIER List", this.withoutSuppList)
        // let dataPagination = result['pagination'];
        // if (this.exactList.length >= 0) {
        //   this.has_next = dataPagination.has_next;
        //   this.has_previous = dataPagination.has_previous;
        //   this.presentpage = dataPagination.index;
        //   this.isSummaryPagination = true;
        // } if (this.exactList <= 0) {
        //   this.isSummaryPagination = false;
        // }        
      }, error => {
        console.log("No data found")
      }
      )

    //dedupe for type(WITHOUT_INVOICE_AMOUNT)
    this.ecfservice.getInwDedupeChk(this.checkInvID, this.dedupeChkType[2], 1)
      .subscribe(result => {
        this.withoutInvAmtList = result['data']
        console.log("WITHOUT_INVOICE_AMOUNT List", this.withoutInvAmtList)
        // let dataPagination = result['pagination'];
        // if (this.exactList.length >= 0) {
        //   this.has_next = dataPagination.has_next;
        //   this.has_previous = dataPagination.has_previous;
        //   this.presentpage = dataPagination.index;
        //   this.isSummaryPagination = true;
        // } if (this.exactList <= 0) {
        //   this.isSummaryPagination = false;
        // }        
      }, error => {
        console.log("No data found")
      }
      )

    //dedupe for type(WITHOUT_INVOICE_NUMBER)
    this.ecfservice.getInwDedupeChk(this.checkInvID, this.dedupeChkType[3], 1)
      .subscribe(result => {
        this.withoutInvNoList = result['data']
        console.log("WITHOUT_INVOICE_NUMBER List", this.withoutInvNoList)
        //   let dataPagination = result['pagination'];
        //   if (this.exactList.length >= 0) {
        //     this.has_next = dataPagination.has_next;
        //     this.has_previous = dataPagination.has_previous;
        //     this.presentpage = dataPagination.index;
        //     this.isSummaryPagination = true;
        //   } if (this.exactList <= 0) {
        //    this.isSummaryPagination = false;
        //   }        
      }, error => {
        console.log("No data found")
      }
      )

    //dedupe for type(WITHOUT_INVOICE_DATE)
    this.ecfservice.getInwDedupeChk(this.checkInvID, this.dedupeChkType[4], 1)
      .subscribe(result => {
        this.withoutInvDtList = result['data']
        console.log("WITHOUT_INVOICE_DATE List", this.withoutInvDtList)
        // let dataPagination = result['pagination'];
        // if (this.exactList.length >= 0) {
        //   this.has_next = dataPagination.has_next;
        //   this.has_previous = dataPagination.has_previous;
        //   this.presentpage = dataPagination.index;
        //   this.isSummaryPagination = true;
        // } if (this.exactList <= 0) {
        //   this.isSummaryPagination = false;
        // }        
      }, error => {
        console.log("No data found")
      }
      )
    this.SpinnerService.hide();
  }

  hdrSelectable = [false, false, false, false, false]
  enableHdrSelect(i) {

  }


  auditcheck: any = [];

  submitted() {
    this.auditcheck = []

    this.SpinnerService.show()
    for (let i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i]['clk']) {
        let dear: any = {
          'ecfauditchecklist_id': this.checklist[i]['id'],
          'apinvoiceheader_id': this.checkInvID,
          'value': this.checklist[i]['value']
        };
        this.auditcheck.push(dear)
      }
    } let obj = {
      'auditchecklist': this.auditcheck
    }
    console.log('obj', obj);

    this.ecfservice.audiokservie(obj).subscribe(result => {
      console.log("result", result)
      this.SpinnerService.hide()
      if (result.status != "Success") {
        this.notification.showError(result?.message)
        return false
      }
      else {
        this.notification.showSuccess("Saved Successfully!")
      }
    },
      (error) => {
        alert(error.status + error.statusText);
      }
    )
    //this.auditclose.nativeElement.click();
  }

  notokflag = false
  chklstValid = false
  ok(i: any, dt) {
    this.notokflag = false
    this.checklist[i]['clk'] = true
    this.checklist[i]['value'] = 1
    let val = 1;
    let dear: any = {
      "ecfauditchecklist_id": dt.id,
      "apinvoiceheader_id": this.checkInvID,
      "value": val
    };
    console.log(dear)
    console.log("check bounce", dear)
    for (let i = 0; i < this.auditcheck.length; i++) {
      if (this.auditcheck[i].ecfauditchecklist_id == dt.id) {
        this.auditcheck.splice(i, 1)
      }
    }
    this.auditcheck.push(dear)
    console.log("bo", this.auditcheck)

    for (let i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i]['clk'] == false) {
        this.notokflag = true
      }
    }
    if (this.notokflag == true)
      this.chklstValid = false
    else
      this.chklstValid = true

  }
  notok(i: any, dt) {
    this.notokflag = false
    this.checklist[i]['clk'] = false
    this.checklist[i]['value'] = 2

    let d = 2;
    let dear: any = {
      "ecfauditchecklist_id": dt.id,
      "apinvoiceheader_id": this.checkInvID,
      "value": d
    };
    console.log("check bounce", dear)
    for (let i = 0; i < this.auditcheck.length; i++) {
      if (this.auditcheck[i].ecfauditchecklist_id == dt.id) {
        this.auditcheck.splice(i, 1)
      }
    }
    this.auditcheck.push(dear)
    console.log("bo", this.auditcheck)
    for (let i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i]['clk'] == false) {
        this.notokflag = true
      }
    }
    if (this.notokflag == true)
      this.chklstValid = false
    else
      this.chklstValid = true
  }
  nap(i: any, dt) {
    let d = 3
    let dear: any = {
      "ecfauditchecklist_id": dt.id,
      "apinvoiceheader_id": this.checkInvID,
      "value": d
    };
    console.log("check bounce", dear)
    for (let i = 0; i < this.auditcheck.length; i++) {
      if (this.auditcheck[i].ecfauditchecklist_id == dt.id) {
        this.auditcheck.splice(i, 1)
      }
    }
    this.auditcheck.push(dear)
    console.log("bo", this.auditcheck)
  }
  bouio: any
  bounce() {
    this.cli = true;
    this.auditcheck = []
    for (let i = 0; i < this.checklist.length; i++) {
      let dear: any = {
        "ecfauditchecklist_id": this.checklist[i].id,
        "apinvoiceheader_id": this.checkInvID,
        "value": this.checklist[i]['clk'] == true ? 1 : 2
      };
      this.auditcheck.push(dear)
    }
    this.remark = this.rem.value;
    if (this.rem.value != 'other' || this.rem.value != 'Other' || this.rem.value != 'OTHER')
      this.bouio = {
        "status_id": "11",
        "invoicedate": this.checkinvdate,
        "remarks": this.remark.toString()
      };
    this.purpose = this.purpose.value
    if (this.rem.value === 'other' || this.rem.value === 'Other' || this.rem.value === 'OTHER') {
      this.bouio = {
        "status_id": "11",
        "invoicedate": this.checkinvdate,
        "remarks": this.purpose
      };
    }
    let obj = {
      'auditchecklist': this.auditcheck
    }
    this.ecfservice.audiokservie(obj).subscribe(data => {
      console.log(data)
      this.ecfservice.bounce(this.checkInvID, this.bouio).subscribe(data => {
        console.log(data)
        if (data['status'] != "Falied") {
          this.notification.showSuccess("Successfully Bounced.");
          this.commonbackview()
        }
      }
      )
    }
    )
    console.log("check bounce", obj)
    //  this.auditclose.nativeElement.click();
  }


  disables() {
    for (let i = 0; i < this.auditcheck.length; i++) {
      if (this.auditcheck[i].value == 2) {
        return true;

      }
    }
  }


  valid_arr: Array<any> = [];
  uploaddata(event: any) {
    this.formData = new FormData();

    console.log(event.target.files.length);
    for (let i = 0; i < event.target.files.length; i++) {
      // this.formData.append('file',event.target.files[i])
      // console.log("event",event.target.files[i])
      this.valid_arr.push(event.target.files[i]);
      console.log("valid_arr", this.valid_arr)
    }
  }
  formData: FormData = new FormData();

  apreject() {
    if (this.APapprovesubmitform?.value?.remarks == "" || this.APapprovesubmitform?.value?.remarks == null || this.APapprovesubmitform?.value?.remarks == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false
    }
    // if(this.valid_arr?.length < 1){
    //   this.notification.showError("Please Upload File.")
    //   return false
    // }
    let data = {
      "apinvoiceheader_id": this.shareservice.invheaderid.value,
      "apinvoiceheaderstatus": 10,
      "remarks": this.APapprovesubmitform?.value?.remarks
    }
    this.formData.append('data', JSON.stringify(data));
    let reqData = this.valid_arr
    for (let i = 0; i < reqData.length; i++) {
      this.formData.append("file", reqData[i])
    }

    this.SpinnerService.show()
    this.ecfservice.apReauditRej(this.formData).subscribe(result => {
      this.SpinnerService.hide()
      if (result?.status == "success") {
        this.notification.showSuccess("Rejected Successfully")
        this.closedbutton.nativeElement.click();
        this.formData = new FormData();
        this.valid_arr = []
        this.ecfsummaryForm = false
        this.ecfcreateForm = false
        this.ecfviewForm = false
        this.batchviewForm = false
        this.APApprovalForm = false
        this.APApprovalForms = false
        this.preparePaymentForm = false
        this.PreparepaymentForms = false
        this.BounceSummaryForm = false
        this.paymentfileForm = false
        this.CommonSummaryForm = false
        this.BounceDetailForm = false
        this.commonInvViewForm = false
        this.ecfapprovalsummaryForm = false
        this.ecfapprovalviewForm = false
        this.AppInvoiceDetailViewForm = false
        this.APmakerForm = false
        this.APECFmakeForm = false
        this.APCreateForm = false
        this.APApproverForm = false
        this.APBounceForm = true
        this.APRejectForm = false
        this.APFailedTransForm = false
        this.APApproverInvoiceForm = false
        this.APInwardSummaryForm = false
        this.isecfview = false
        this.ispoview = false
        this.isinwardAdd = false
        this.rptFormat = 3
        this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 37 || x.id == 46)
        this.dataclear('')
        this.overallreset()
        this.resetapbounce()
      } else {
        this.notification.showError(result?.message)
        return false
      }
    })
  }

  apreaudit() {
    if (this.APapprovesubmitform?.value?.remarks == "" || this.APapprovesubmitform?.value?.remarks == null || this.APapprovesubmitform?.value?.remarks == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false
    }
    let data = {
      "apinvoiceheader_id": this.shareservice.invheaderid.value,
      "apinvoiceheaderstatus": 12,
      "remarks": this.APapprovesubmitform?.value?.remarks
    }

    this.SpinnerService.show()
    this.ecfservice.apReauditRej(data).subscribe(result => {
      this.SpinnerService.hide
      if (result?.status == "success") {
        this.notification.showSuccess("Success")
        this.ecfsummaryForm = false
        this.ecfcreateForm = false
        this.ecfviewForm = false
        this.batchviewForm = false
        this.APApprovalForm = false
        this.APApprovalForms = false
        this.preparePaymentForm = false
        this.PreparepaymentForms = false
        this.BounceSummaryForm = false
        this.paymentfileForm = false
        this.CommonSummaryForm = false
        this.BounceDetailForm = false
        this.commonInvViewForm = false
        this.ecfapprovalsummaryForm = false
        this.ecfapprovalviewForm = false
        this.AppInvoiceDetailViewForm = false
        this.APmakerForm = false
        this.APECFmakeForm = false
        this.APCreateForm = false
        this.APApproverForm = false
        this.APBounceForm = true
        this.APRejectForm = false
        this.APFailedTransForm = false
        this.APAdvSummaryForm = false
        this.APApproverInvoiceForm = false
        this.APInwardSummaryForm = false
        this.isecfview = false
        this.ispoview = false
        this.isinwardAdd = false
        this.rptFormat = 3
        this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 37 || x.id == 46)
        this.dataclear('')
        this.overallreset()
        this.resetapbounce()
      } else {
        this.notification.showError(result?.message)
        return false
      }
    })
  }

  apreprocess() {

    if (this.APapprovesubmitform?.value?.remarks == "" || this.APapprovesubmitform?.value?.remarks == null || this.APapprovesubmitform?.value?.remarks == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false
    }
    // if(this.valid_arr?.length < 1){
    //   this.notification.showError("Please Upload File.")
    //   return false
    // }
    let data = {
      "apinvoiceheader_id": this.shareservice.invheaderid.value,
      "apinvoiceheaderstatus": 24,
      "remarks": this.APapprovesubmitform?.value?.remarks
    }
    this.formData.append('data', JSON.stringify(data));

    let reqData = this.valid_arr
    for (let i = 0; i < reqData.length; i++) {
      this.formData.append("file", reqData[i])
    }

    this.SpinnerService.show()
    this.ecfservice.apReauditRej(this.formData).subscribe(result => {
      this.SpinnerService.hide()
      if (result?.status == "success") {
        this.notification.showSuccess("Success")
        this.closedbutton.nativeElement.click();
        this.formData = new FormData();
        this.valid_arr = []
        this.ecfsummaryForm = false
        this.ecfcreateForm = false
        this.ecfviewForm = false
        this.batchviewForm = false
        this.APApprovalForm = false
        this.APApprovalForms = false
        this.preparePaymentForm = false
        this.PreparepaymentForms = false
        this.BounceSummaryForm = false
        this.paymentfileForm = false
        this.CommonSummaryForm = false
        this.BounceDetailForm = false
        this.commonInvViewForm = false
        this.ecfapprovalsummaryForm = false
        this.ecfapprovalviewForm = false
        this.AppInvoiceDetailViewForm = false
        this.APmakerForm = false
        this.APECFmakeForm = false
        this.APCreateForm = false
        this.APApproverForm = false
        this.APBounceForm = true
        this.APRejectForm = false
        this.APFailedTransForm = false
        this.APAdvSummaryForm = false
        this.APApproverInvoiceForm = false
        this.APInwardSummaryForm = false
        this.isecfview = false
        this.ispoview = false
        this.isinwardAdd = false
        this.rptFormat = 3
        this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 37 || x.id == 46)
        this.dataclear('')
        this.overallreset()
        this.resetapbounce()
      } else {
        this.notification.showError(result?.message)
        return false
      }
    })
  }

  movetodtlwise() {
    this.isChecked = false
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = true
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.dataclear('')
    this.overallreset()
    this.resetapappInv()
    this.rptFormat = 2
    this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 23 || x.id == 49 || x.id == 50)
  }

  movetoappwise() {
    this.isChecked = true
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = true
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isecfview = false
    this.ispoview = false
    this.isinwardAdd = false
    this.apappecfSummarySearch(1)
    this.resetapappecf()
  }

  getChannelFK() {
    this.dataService.getChannelFKdd("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ChannelList = datas;
        console.log("channel list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  currentpageCourier: number = 1;
  has_nextCourier = true;
  has_previousCourier = true;
  autocompleteCourierScroll() {
    setTimeout(() => {
      if (
        this.matCourierAutocomplete &&
        this.autocompleteTrigger &&
        this.matCourierAutocomplete.panel
      ) {
        fromEvent(this.matCourierAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matCourierAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matCourierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matCourierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matCourierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextCourier === true) {
                this.dataService.getCourierFKdd(this.CourierInput.nativeElement.value, this.currentpageCourier + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.CourierList = this.CourierList.concat(datas);
                    // console.log("emp", datas)
                    if (this.CourierList.length >= 0) {
                      this.has_nextCourier = datapagination.has_nextCourier;
                      this.has_previousCourier = datapagination.has_previousCourier;
                      this.currentpageCourier = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }


  displayFncourier(courier?: courierListss): string | undefined {
    return courier ? courier.name : undefined;
  }

  getCourierFK() {
    this.dataService.getCourierFKdd("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CourierList = datas;
        console.log("CourierList list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  serviceCallInwardSummary(searchInwardSummary, pageno) {
    this.SpinnerService.show()
    this.ecfservice.getInwardSummarySearch(searchInwardSummary, pageno)
      .subscribe((result) => {
        console.log(" InwardSummary", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.inwardSummaryList = datass;
        this.SpinnerService.hide()
        console.log(" serviceCallInwardSummary", this.inwardSummaryList)
        if (this.inwardSummaryList.length > 0) {
          this.SpinnerService.hide()
          this.length_inward = result?.total_count
          this.has_nextinw = datapagination.has_next;
          this.has_previousinw = datapagination.has_previous;
          this.currentpageinw = datapagination.index;
          this.toggleSearch('')
          this.InwardsummarySearchForm.controls['channel_id'].reset('')
          this.resetInwardnew()
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  expand_inward = false
  // expand_Common = false

  selectedSupplier: any;
  selectedbranch(value) {
    console.log(value)
    this.selectedSupplier = value
    this.getInwardsummary('courier','', 1)
  }
  selectedraiser(value) {
    console.log(value)
    this.selectedSupplier = value
    this.getInwardsummary('raiser','', 1)
  }
  selectedchannel(value) {
    console.log(value)
    this.selectedSupplier = value
    this.getInwardsummary('channel','', 1)
  }

  getInwardsummary(data,sub_name, page = this.currentpageinw) {

    
    let searchInward = this.InwardsummarySearchForm.value
    if (searchInward.fromdate !== '' && searchInward.todate === '') {
      this.notification.showError("Please enter 'To date' ")
      return false
    }
    else if (searchInward.todate !== '' && searchInward.fromdate === '') {
      this.notification.showError("Please enter 'From date' ")
      return false
    }
    if (searchInward.fromdate != '' && searchInward.fromdate != null && searchInward.fromdate != undefined) {
      searchInward.fromdate = this.datePipe.transform(searchInward.fromdate, 'yyyy-MM-dd')
      searchInward.todate = this.datePipe.transform(searchInward.todate, 'yyyy-MM-dd')
    }
    if ((searchInward.created_by != '' && searchInward.created_by != null && searchInward.created_by != undefined)) {
      if (typeof (searchInward.created_by) == 'object')
        searchInward.created_by = searchInward.created_by.id
    }
    if ((searchInward.courier_id != '' && searchInward.courier_id != null && searchInward.courier_id != undefined)) {
      if (typeof (searchInward.courier_id) == 'object')
        searchInward.courier_id = searchInward.courier_id.id
    }
    else {
      searchInward.courier_id = searchInward.courier_id
    }
    if (data == 'courier') {
      searchInward.courier_id = this.selectedSupplier.id
    }
    if (data == 'raiser') {
      searchInward.created_by = this.selectedSupplier.id
    }
    if (data == 'channel') {
      searchInward.channel_id = this.selectedSupplier.id
    }
    for (let i in searchInward) {
      if (searchInward[i] === null || searchInward[i] === "") {
        delete searchInward[i];
      }
    }
    if (page == 1) {
      this.pageIndexInward = 0;
    }
    console.log("search inward data", searchInward)

    // if (hint == 'next') {
    //   this.serviceCallInwardSummary(searchInward, this.currentpageinw + 1, 10)
    // }
    // else if (hint == 'previous') {
    //   this.serviceCallInwardSummary(searchInward, this.currentpageinw - 1, 10)
    // }
    // else {
    //   this.serviceCallInwardSummary(searchInward, 1, 10)
    // }
    this.SummaryApiinwardObjNew = {
      "method": "post",
      "url": this.ecfmodelurl + "inwdserv/apinward_summarysearch",
      params: "&submodule=" + sub_name,
      data: searchInward,OverallCount: "Total Count"
    }
    this.expand_inward = false
  }
  length_inward = 0;
  pageSize_inward = 10;
  handleInwardPageEvent(event: PageEvent) {
    console.log("event-------->", event)
    this.length_inward = event.length;
    this.pageSize_inward = event.pageSize;
    this.pageIndexInward = event.pageIndex;
    this.currentpageinw = event.pageIndex + 1;
    this.getInwardsummary('', this.currentpageinw);

  }

  isinwardAdd: boolean;
  isecfview: boolean;
  ispoview: boolean;
  inwardSummaryList: Array<any>;
  pageSize = 10;
  currentpageinw: any = 1
  has_nextinw: boolean = true
  has_previousinw: boolean = true
  inwardRoute() {
    let dataToShare = ''
    this.inwshareservice.inwardData.next(dataToShare)
    // this.router.navigate(['inward/inwardForm'])
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isinwardAdd = true;
    this.isecfview = false;
    this.ispoview = false;
    return dataToShare
  }


  resetInward() {
    console.log("this.CourierList..........", this.CourierList)
    this.InwardsummarySearchForm.reset()
    this.currentpageinw = 1
    this.getInwardsummary('', 1);
  }
  resetInwardnew() {
    this.InwardsummarySearchForm.reset()

  }
  downloadFileXLSX() {
    let type = 'inwardsummary'
    // this.downrep = e
    let inwardexcel;
    if (type == "inwardsummary") {
      inwardexcel = this.InwardsummarySearchForm.value
    }

    if (inwardexcel.fromdate !== '' && inwardexcel.todate === '') {
      this.notification.showError("Please enter 'To date' ")
      return false
    }
    else if (inwardexcel.todate !== '' && inwardexcel.fromdate === '') {
      this.notification.showError("Please enter 'From date' ")
      return false
    }
    if (inwardexcel.fromdate != '' || inwardexcel.fromdate != null || inwardexcel.fromdate != undefined) {
      inwardexcel.fromdate = this.datePipe.transform(inwardexcel.fromdate, 'yyyy-MM-dd')
      inwardexcel.todate = this.datePipe.transform(inwardexcel.todate, 'yyyy-MM-dd')
    }
    for (let i in inwardexcel) {
      if (inwardexcel[i] === null || inwardexcel[i] === "") {
        delete inwardexcel[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.DownloadExcels(type, this.apinward_fields)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Inward Report.xlsx"
        link.click();
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  downrep: any;
  downloadFileXLSX1(type) {
    this.downrep = type
    let inwardexcel;
    if (type == "inwardsummary") {
      inwardexcel = this.InwardsummarySearchForm.value
    }

    if (inwardexcel.fromdate !== '' && inwardexcel.todate === '') {
      this.notification.showError("Please enter 'To date' ")
      return false
    }
    else if (inwardexcel.todate !== '' && inwardexcel.fromdate === '') {
      this.notification.showError("Please enter 'From date' ")
      return false
    }
    if (inwardexcel.fromdate != '' || inwardexcel.fromdate != null || inwardexcel.fromdate != undefined) {
      inwardexcel.fromdate = this.datePipe.transform(inwardexcel.fromdate, 'yyyy-MM-dd')
      inwardexcel.todate = this.datePipe.transform(inwardexcel.todate, 'yyyy-MM-dd')
    }
    for (let i in inwardexcel) {
      if (inwardexcel[i] === null || inwardexcel[i] === "") {
        delete inwardexcel[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.DownloadExcel(type, inwardexcel)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Inward Report.xlsx"
        link.click();
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  editInwardMaker(dataToShare) {
    this.shareservice.inwardData.next(dataToShare)
    // this.router.navigate(['inward/inwardForm'])
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APApproverInvoiceForm = false
    this.APInwardSummaryForm = false
    this.isinwardAdd = true;
    this.isecfview = false;
    this.ispoview = false;
    return dataToShare
  }

  inwardCreateEditSubmit() {
    this.getInwardsummary('', 1)
    this.APInwardSummaryForm = true;
    this.isecfview = false;
    this.ispoview = false;
    this.isinwardAdd = false;
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APApproverInvoiceForm = false

    this.getInwardsummary('', 1)
    this.overallinward_reset()

  }

  inwardCreateEditCancel() {
    this.isinwardAdd = false;
    this.isecfview = false;
    this.ispoview = false;
    this.APInwardSummaryForm = true;
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APApproverInvoiceForm = false


    // this.getInwardsummary('')
    this.restfiled = []
    // this.overallinward_reset()
    this.getInwardsummary('',"AP Inward",1)
  }

  ecfviewCancel() {

    this.APInwardSummaryForm = false;
    this.isecfview = false;
    this.ispoview = false;
    this.isinwardAdd = true
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APApproverInvoiceForm = false


  }

  poviewCancel() {

    this.APInwardSummaryForm = false;
    this.isecfview = false;
    this.ispoview = false;
    this.isinwardAdd = true;
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APApproverInvoiceForm = false


  }

  searchdata() {
    this.APInwardSummaryForm = false;
    this.isecfview = true;
    this.ispoview = false;
    this.isinwardAdd = false
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APApproverInvoiceForm = false


  }

  searchpodata() {
    this.APInwardSummaryForm = false;
    this.isecfview = false;
    this.ispoview = true;
    this.isinwardAdd = false
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm = false
    this.APApprovalForms = false
    this.preparePaymentForm = false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailApprovalForm = false
    this.InvoiceDetailForm = false
    this.InvoiceDetailViewForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.APmakerForm = false
    this.APECFmakeForm = false
    this.APCreateForm = false
    this.APApproverForm = false
    this.APBounceForm = false
    this.APRejectForm = false
    this.APFailedTransForm = false
    this.APAdvSummaryForm = false
    this.APApproverInvoiceForm = false
    this.APApproverInvoiceForm = false


  }
  getinvRaiserbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.apinvsummaryform.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  getinvappRaiserbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.apInvapprovalsummaryform.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  getappRaiserbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.apapprovalsummaryform.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  // getmakRaiserbranch() {
  //   let branchkeyvalue: String = "";
  //   this.branchdropdown(branchkeyvalue);
  //   this.apinvsummaryform.get('raiserbranch_id').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //       }),

  //       switchMap(value => this.ecfservice.getbranchscroll(value, 1)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Branchlist = datas;
  //     })
  //   this.frmAPReportSummary.get('raisedby').valueChanges
  //   .pipe(
  //     debounceTime(100),
  //     distinctUntilChanged(),
  //     tap(() => {
  //       this.isLoading = true;
  //       console.log('inside tap')

  //     }),
  //     switchMap(value => this.ecfservice.getbranchscroll(value, 1)
  //       .pipe(
  //         finalize(() => {
  //           this.isLoading = false
  //         }),
  //       )
  //     )
  //   )
  //   .subscribe((results: any[]) => {
  //     let datas = results["data"];
  //     this.Branchlist = datas;

  //   })

  // }

  getmakRaiserbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.apinvsummaryform.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;

      })

    this.frmAPReportSummary.get('raiserbranch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;

      })

  }
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons: boolean = true;
  length_batch = 0;
  pageSize_batch = 10;
  pageIndexmk = 0
  handlebatchPageEvent(event: PageEvent) {
    this.length_batch = event.length;
    this.pageSize_batch = event.pageSize;
    this.pageIndexmk = event.pageIndex;
    this.appresentpage = event.pageIndex + 1;
    this.apinvSummarySearch('', this.appresentpage);

  }

  length_common = 0;
  pageIndex_common = 0;
  pageSize_common = 10;
  presentpagecommon: number = 1
  handleCommonSearchPageEvent(event: PageEvent) {
    this.length_common = event.length;
    this.pageSize_common = event.pageSize;
    this.pageIndex_common = event.pageIndex;
    this.commonpresentpage = event.pageIndex + 1;
    this.commonSummarySearch('', this.commonpresentpage)

  }


  length_approve = 0;
  pageSize_approve = 10
  pageIndex_approve = 0;
  handleapprovePageEvent(event: PageEvent) {
    this.length_approve = event.length;
    this.pageSize_approve = event.pageSize;
    this.pageIndex_approve = event.pageIndex;
    this.apappInvpresentpage = event.pageIndex + 1;
    this.apappInvSummarySearch(this.apappInvpresentpage);

  }
  length_payment = 0;
  pageSize_payment = 10
  pageIndex_payment = 0;
  handlepaymentPageEvent(event: PageEvent) {
    this.length_payment = event.length;
    this.pageSize_payment = event.pageSize;
    this.pageIndex_payment = event.pageIndex;
    this.pppresentpage = event.pageIndex + 1;
    this.ppSummarySearch(this.pppresentpage);

  }
  length_bounce = 0;
  pageSize_bounce = 10;
  pageIndex_bounce = 0;
  handlebouncePageEvent(event: PageEvent) {
    this.length_bounce = event.length;
    this.pageSize_bounce = event.pageSize;
    this.pageIndex_bounce = event.pageIndex;
    this.apbouncepresentpage = event.pageIndex + 1;
    this.apbounceSummarySearch('', this.apbouncepresentpage);

  }
  length_reject = 0;
  pageSize_reject = 10;
  pageIndex_reject = 0;
  handlerejecyPageEvent(event: PageEvent) {
    this.length_reject = event.length;
    this.pageSize_reject = event.pageSize;
    this.pageIndex_reject = event.pageIndex;
    this.aprejectpresentpage = event.pageIndex + 1;
    this.aprejectSummarySearch('', this.aprejectpresentpage);

  }
  length_pf = 0;
  pageSize_pf = 10
  pageIndex_pf = 0
  handlepfPageEvent(event: PageEvent) {
    this.length_pf = event.length;
    this.pageSize_pf = event.pageSize;
    this.pageIndex_pf = event.pageIndex;
    this.pfpresentpage = event.pageIndex + 1;
    this.PFSummarySearch(this.pfpresentpage);

  }
  length_adv = 0;
  pageSize_adv = 10
  pageIndex_adv = 0
  handleadvPageEvent(event: PageEvent) {
    this.length_adv = event.length;
    this.pageSize_adv = event.pageSize;
    this.pageIndex_adv = event.pageIndex;
    this.advSummarypresentpage = event.pageIndex + 1;
    this.advanceSummarySearch(this.advSummarypresentpage);

  }
  unlock(id) {
    this.apunlock = id.id
    this.ecfservice.lockapi(id.id)
      .subscribe(result => {
        if (result['status'] == "success") {
          this.notification.showSuccess("Successfully Unlocked")
        }
        else {
          this.notification.showError(JSON.stringify(result?.message))
        }
      })
  }



  data1(datas) {

    this.showimageHeaderAPI = false
    this.showimagepdf = false
    let id = datas?.file_id
    let filename = datas?.file_name
    // this.ecfservice.downloadfile(id)




    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = filename.split('.')


    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG" || stringValue[1] === "pdf" || stringValue[1] === "PDF" ||
      stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
      stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
      this.jpgUrlsAPI = window.open(this.imageUrl + "ecfapserv/ecffile/" + id + "?token=" + token, '_blank');
    }

    // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
    // stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

    //     // this.showimageHeaderAPI = true
    //     // this.showimagepdf = false


    //   }
    //   if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
    //     // this.showimagepdf = true
    //     // this.showimageHeaderAPI = false
    //     this.ecfservice.downloadfile1(id)
    //       // .subscribe((data) => {
    //       //   let dataType = data.type;
    //       //   let binaryData = [];
    //       //   binaryData.push(data);
    //       //   let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    //       //   window.open(downloadLink, "_blank");
    //       // }, (error) => {
    //       //   this.errorHandler.handleError(error);
    //       //   this.showimagepdf = false
    //       //   this.showimageHeaderAPI = false
    //       //   this.SpinnerService.hide();
    //       // })
    //   }
    //   if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
    //   stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
    //     // this.showimagepdf = false
    //     // this.showimageHeaderAPI = false
    //   }  

  }

  
  pagedFiles = [];
  allFiles = [];
  pagesize_attach = 10;
  pageIndexAttach = 0;
  AttachPresentpage = 1;
  length_attachments =0
  updatePagedFiles() {
    const startIndex = this.pageIndexAttach * this.pagesize_attach;
    const endIndex = startIndex + this.pagesize_attach;
    this.pagedFiles = this.allFiles.slice(startIndex, endIndex);
    console.log("this.pagedFiles---", this.pagedFiles)
  }
    
  handleAttachmentsPageEvent(event: PageEvent) {
    this.pagesize_attach = event.pageSize;
    this.pageIndexAttach = event.pageIndex;
    this.AttachPresentpage = event.pageIndex + 1;
    this.updatePagedFiles();
  }
   
  attachedFile = new FormArray([])
  filefun() {
    this.popup()
    let data = this.headerdata[0]
    let arr = new FormArray([])
    let dataForfILE = data.file_data
    if (data.file_data == "" || data.file_data == null || data.file_data == undefined) {
      dataForfILE = []
    } else {
      for (let file of dataForfILE) {
        let file_id: FormControl = new FormControl('');
        let file_name: FormControl = new FormControl('');
        file_id.setValue(file.file_id);
        file_name.setValue(file.file_name)
        arr.push(new FormGroup({
          file_id: file_id,
          file_name: file_name
        }))
      }
    }
    this.attachedFile = arr;
    this.attachedFiles_value = arr.value
    this.attachs_summary()
  }
  suppliername_common() {
    let suppkeyvalue: String = "";
    this.getsupplier(suppkeyvalue);

    this.commonForm.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;

      })

  }
  suppliername_mk() {
    let suppkeyvalue: String = "";
    this.getsupplier(suppkeyvalue);

    this.apinvsummaryform.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;

      })

    this.frmAPReportSummary.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;

      })

  }





  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any

  filepreview(files) {
    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
      stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {
      // this.showimageHeaderPreview = true
      // this.showimageHeaderPreviewPDF = false
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
        const newTab = window.open();
        newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
        newTab.document.close();
      }
    }
    // if (stringValue[1] === "pdf" || stringValue[1] === "PDF") {
    //   // this.showimageHeaderPreview = false
    //   // this.showimageHeaderPreviewPDF = true
    //   const reader: any = new FileReader();
    //   reader.readAsDataURL(files);
    //   reader.onload = (_event) => {
    //   this.pdfurl = reader.result
    //   const link = document.createElement('a');
    //   link.href = this.pdfurl;
    //   link.target = '_blank'; // Open in a new tab
    //   link.click();
    //   }
    // }

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
  deletefileUpload(invdata, i) {
    console.log("invdata", invdata)
    this.valid_arr.splice(i, 1);

  }

  fileback() {
    this.closedbuttons.nativeElement.click()
  }
  filebackk() {
    this.closedbuttonss.nativeElement.click()
  }
  getraiserdropdowninward() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.InwardsummarySearchForm.get('created_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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
  getraiserdropdown() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.commonForm.get('raiser_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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

    this.frmAPReportSummary.get('raisedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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
  getraiserdropdownmk() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.apinvsummaryform.get('raiser_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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
  getraiserdropdownap() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.apInvapprovalsummaryform.get('raiser_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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
    return this.commonForm.get('raiser_name');
  }
  get raisertyperoleInw() {
    return this.InwardsummarySearchForm.get('created_by');
  }
  getrm(rmkeyvalue) {
    this.ecfservice.getrmcode(rmkeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.Raiserlist = datas;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide()
      })
  }

  raiserScroll() {
    setTimeout(() => {
      if (
        this.matempraiserAutocomplete &&
        this.matempraiserAutocomplete &&
        this.matempraiserAutocomplete.panel
      ) {
        fromEvent(this.matempraiserAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempraiserAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempraiserAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempraiserAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempraiserAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextemp === true) {
                this.ecfservice.getrmscroll(this.raiserInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Raiserlist.length >= 0) {
                      this.Raiserlist = this.Raiserlist.concat(datas);
                      this.has_nextemp = datapagination.has_next;
                      this.has_previousemp = datapagination.has_previous;
                      this.currentpageemp = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  getappRaiserbranchap() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.apInvapprovalsummaryform.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  suppliernameap() {
    let suppkeyvalue: String = "";
    this.getsupplier(suppkeyvalue);

    this.apInvapprovalsummaryform.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;

      })

  }
  suppliername_bo() {
    let suppkeyvalue: String = "";
    this.getsupplier(suppkeyvalue);

    this.apbounceform.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;

      })

  }
  getraiserdropdownbo() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.apbounceform.get('raiser_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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
  getRaiserbranch_bo() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.apbounceform.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  suppliernamere() {
    let suppkeyvalue: String = "";
    this.getsupplier(suppkeyvalue);

    this.aprejectform.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getsupplierscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;

      })

  }
  getRaiserbranchre() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.aprejectform.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  getraiserdropdownre() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.aprejectform.get('raiser_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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
  getRaiserbranchpp() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.PPSearchForm.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  getraiserdropdownpp() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.PPSearchForm.get('raiser_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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
  getRaiserbranchpf() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.PFSearchForm.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  getraiserdropdownpf() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.PFSearchForm.get('raiser_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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

  //REJECT CHANGE STATUS

  courierlist: any;
  reject_empname: any
  reject_empaddress: any
  showRejectStatChg(data) {
    this.apinvHeader_id = data.id
    console.log("showRejectStatChg ------", this.apinvHeader_id)
    this.reject_empname = data.raiser_name
    this.reject_empaddress = data.raiserbranch_branch?.address
    let add = data.raiserbranch_branch?.address
    this.rejectChgStatForm.controls['name'].setValue(data.raiser_name)
    this.rejectChgStatForm.controls['address'].setValue(add?.line1)
    this.rejectChgStatForm.controls['city'].setValue(add?.city?.name)
    this.rejectChgStatForm.controls['district'].setValue(add?.district?.name)
    this.rejectChgStatForm.controls['state'].setValue(add?.state?.name)
    this.rejectChgStatForm.controls['pincode'].setValue(add?.pincode?.no)
    this.ecfservice.getDispatchMode()
      .subscribe(result => {
        this.rejectmodeList = result.data
      })

    this.ecfservice.getCourierDrop('', 1)
      .subscribe(result => {
        this.courierlist = result.data
      })

    this.rejectChgStatForm.get('courier').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservice.getCourierDrop(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.courierlist = datas;

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  autocompletecourierScroll() {
    setTimeout(() => {
      if (
        this.matCourierAutocomplete &&
        this.autocompleteTrigger &&
        this.matCourierAutocomplete.panel
      ) {
        fromEvent(this.matCourierAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matCourierAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matCourierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matCourierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matCourierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextCourier === true) {
                this.ecfservice.getCourierDrop(this.courierInput.nativeElement.value, this.currentpageCourier + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.courierlist = this.courierlist.concat(datas);
                    // console.log("emp", datas)
                    if (this.courierlist.length >= 0) {
                      this.has_nextCourier = datapagination.has_nextCourier;
                      this.has_previousCourier = datapagination.has_previousCourier;
                      this.currentpageCourier = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  displayFnCourier(courier?: any) {
    return courier ? courier?.name : undefined;
  }

  modeselect(text) {
    this.rejectStat = text
    console.log("rejectStat-->",this.rejectStat)
  }
  rejectChgStatus() {
    const frm = this.rejectChgStatForm.value

    if (frm.mode == "" || frm.mode == undefined || frm.mode == null) {
      this.notification.showWarning("Please Select Mode")
      return false
    }
    if (frm.date == "" || frm.date == undefined || frm.date == null) {
      this.notification.showWarning("Please Select Date")
      return false
    }
    if ((frm.courier == "" || frm.courier == undefined || frm.courier == null) && this.rejectStat == 1) {
      this.notification.showWarning("Please Select Courier")
      return false
    }
    if ((frm.awbno == "" || frm.awbno == undefined || frm.awbno == null) && this.rejectStat == 1) {
      this.notification.showWarning("Please Enter AWB No.")
      return false
    }
    // if((frm.address == "" || frm.address == undefined || frm.address == null) && this.rejectStat =='COURIER')
    // {
    //   this.notification.showWarning("Please Enter Address")
    //   return false
    // }
    // if((frm.state == "" || frm.state == undefined || frm.state == null) && this.rejectStat =='COURIER')
    // {
    //   this.notification.showWarning("Please Enter State")
    //   return false
    // }
    // if((frm.district == "" || frm.district == undefined || frm.district == null) && this.rejectStat =='COURIER')
    // {
    //   this.notification.showWarning("Please Select District")
    //   return false
    // }
    // if((frm.city == "" || frm.city == undefined || frm.city == null) && this.rejectStat =='COURIER')
    // {
    //   this.notification.showWarning("Please Select City")
    //   return false
    // }
    // if((frm.pincode == "" || frm.pincode == undefined || frm.pincode == null) && this.rejectStat =='COURIER')
    // {
    //   this.notification.showWarning("Please Enter Pincode")
    //   return false
    // }
    let data
    if (this.rejectStat == 1) {
      data = {
        "apinvoiceheader_id": this.apinvHeader_id,
        "courier_id": this.rejectChgStatForm.value.courier?.id,
        "dispatch_date": this.datePipe.transform(this.rejectChgStatForm.value.date, 'yyyy-MM-dd'),
        "dispatch_awbno": this.rejectChgStatForm.value.awbno,
        "dispatch_mode": this.rejectChgStatForm.value.mode,
        "dispatch_to": this.rejectChgStatForm.value.name,
        "address": {
          "line1": this.reject_empaddress?.line1,
          "city_id": this.reject_empaddress?.city_id,
          "district_id": this.reject_empaddress?.district_id,
          "state_id": this.reject_empaddress?.state_id,
          "pincode_id": this.reject_empaddress?.pincode_id
        },
        "remarks": this.rejectChgStatForm.value.remarks,
        "dispatch_status_id": 38
      }
    }
    else {
      data = {
        "apinvoiceheader_id": this.apinvHeader_id,
        "courier_id": 0,
        "dispatch_date": this.datePipe.transform(this.rejectChgStatForm.value.date, 'yyyy-MM-dd'),
        "dispatch_awbno": "",
        "dispatch_mode": this.rejectChgStatForm.value.mode,
        "dispatch_to": this.rejectChgStatForm.value.name,
        "address": {},
        "remarks": this.rejectChgStatForm.value.remarks,
        "dispatch_status_id": 38
      }
    }

    this.ecfservice.rejectDispatch(data)
      .subscribe(result => {
        if (result['status'] != "Falied") {
          this.notification.showSuccess("Successfully Status Changed")
          // this.aprejectSummarySearch(1)
          this.courierclose.nativeElement.click()
          this.rejectChgStatForm.reset()
          this.overallreset()
          this.SpinnerService.hide()
          // this.closebutton.nativeElement.click()
        }
        else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          // this.closebutton.nativeElement.click()
          this.courierclose.nativeElement.click()
        }
      })
  }

  dispatchdet: any
  viewDispatchDetails(data) {
    this.ecfservice.getdispatchdetails(data.id)
      .subscribe(result => {
        let res = result
        this.dispatchdet = res
        if (this.dispatchdet?.status == 'Falied') {
          this.notification.showError(this.dispatchdet?.message)
          this.closeview.nativeElement.click()
        }
        else if (res['dispatch_mode']['text'] == "COURIER") {
          this.dispatchviewForm.controls['mode'].setValue(res['dispatch_mode']['text'])
          this.dispatchviewForm.controls['date'].setValue(this.datePipe.transform(res['dispatch_date'], 'dd-MMM-yyyy'))
          this.dispatchviewForm.controls['courier'].setValue(res['courier']['name'])
          this.dispatchviewForm.controls['awbno'].setValue(res['dispatch_awbno'])
          this.dispatchviewForm.controls['name'].setValue(res['dispatch_to'])
          this.dispatchviewForm.controls['address'].setValue(res['address']['line1'])
          this.dispatchviewForm.controls['city'].setValue(res['address']['city_id']['name'])
          this.dispatchviewForm.controls['district'].setValue(res['address']['district_id']['name'])
          this.dispatchviewForm.controls['state'].setValue(res['address']['state_id']['name'])
          this.dispatchviewForm.controls['pincode'].setValue(res['address']['pincode_id']['no'])
          this.dispatchviewForm.controls['remarks'].setValue(res['remarks'])

        }
        else if (res['dispatch_mode']['text'] == "DIRECT") {
          this.dispatchviewForm.controls['mode'].setValue(res['dispatch_mode']['text'])
          this.dispatchviewForm.controls['date'].setValue(this.datePipe.transform(res['dispatch_date'], 'dd-MMM-yyyy'))
          this.dispatchviewForm.controls['name'].setValue(res['dispatch_to'])
          this.dispatchviewForm.controls['remarks'].setValue(res['remarks'])

        }
      })
  }
  repush() {
    this.SpinnerService.show()
    this.ecfservice.repushInv(this.apinvHeader_id)
      .subscribe(result => {
        if (result['status'] == "Success") {
          this.notification.showSuccess("Successfully Status Changed")
        }
        else {
          this.notification.showError(result?.message)
        }
        this.SpinnerService.hide()
      })
  }

  changeHistoryInvHdr: any = []
  changeHistoryInvdtl: any = []
  changeHistoryCreddtl: any = []
  changeHistoryDbtdtl: any = []

  getChangeHistory() {
    this.popupopen5();
    this.getHdrChngHist()
    this.getDtlChngHist()
    this.getCredChngHist()
    this.getDebitChngHist()
  }
  getHdrChngHist(hdrPage = 1) {
    this.SpinnerService.show()
    this.ecfservice.getInvHdrChngHist(this.apinvHeader_id, hdrPage)
      .subscribe(result => {
        this.changeHistoryInvHdr = result?.data ? result?.data : []
        if (this.changeHistoryInvHdr.length > 0) {
          this.presentpageHdrChgHist = result.pagination?.index
          this.length_HdrChgHist = result.pagination?.count

        }
        this.changeHistPaytoid = this.changeHistoryInvHdr[0]?.payto_id
        // this.changeHistPaytoid = "S"

        if (this.changeHistPaytoid == undefined || this.changeHistPaytoid == "")
          this.changeHistPaytoid = this.changeHistoryInvHdr[0]?.ppx
      })
  }
  length_HdrChgHist = 0;
  pageIndex_HdrChgHist = 0;
  pageSize_HdrChgHist = 10;
  presentpageHdrChgHist: number = 1
  handleHdrChgHistPageEvent(event: PageEvent) {
    this.length_HdrChgHist = event.length;
    this.pageSize_HdrChgHist = event.pageSize;
    this.pageIndex_HdrChgHist = event.pageIndex;
    this.presentpageHdrChgHist = event.pageIndex + 1;
    this.getHdrChngHist(this.presentpageHdrChgHist)

  }


  getDtlChngHist(Page = 1) {
    this.SpinnerService.show()
    this.ecfservice.getInvDtlChngHist(this.apinvHeader_id, Page)
      .subscribe(result => {
        let data = result?.data ? result?.data : []
        if (data.length > 0) {
          this.changeHistoryInvdtl = result?.data ? result?.data : []
          if (this.changeHistoryInvdtl.length > 0) {
            this.presentpageDtlChgHist = result.pagination?.index
            this.length_DtlChgHist = result.pagination?.count
          }

        }

        this.SpinnerService.hide()
      })
  }
  length_DtlChgHist = 0;
  pageIndex_DtlChgHist = 0;
  pageSize_DtlChgHist = 10;
  presentpageDtlChgHist: number = 1
  handleDtlChgHistPageEvent(event: PageEvent) {
    this.length_DtlChgHist = event.length;
    this.pageSize_DtlChgHist = event.pageSize;
    this.pageIndex_DtlChgHist = event.pageIndex;
    this.presentpageDtlChgHist = event.pageIndex + 1;
    this.getDtlChngHist(this.presentpageDtlChgHist)

  }


  getCredChngHist(credPage = 1) {
    this.SpinnerService.show()
    this.ecfservice.getCredChngHist(this.apinvHeader_id, credPage)
      .subscribe(result => {
        this.changeHistoryCreddtl = result?.data ? result?.data : []
        if (this.changeHistoryCreddtl.length > 0) {
          this.presentpageCredChgHist = result.pagination?.index
          this.length_CredChgHist = result.pagination?.count
        }

        this.SpinnerService.hide()
      })
  }
  length_CredChgHist = 0;
  pageIndex_CredChgHist = 0;
  pageSize_CredChgHist = 10;
  presentpageCredChgHist: number = 1
  handleCredChgHistPageEvent(event: PageEvent) {
    this.length_CredChgHist = event.length;
    this.pageSize_CredChgHist = event.pageSize;
    this.pageIndex_CredChgHist = event.pageIndex;
    this.presentpageCredChgHist = event.pageIndex + 1;
    this.getCredChngHist(this.presentpageCredChgHist)

  }


  getDebitChngHist(debitPage = 1) {
    this.SpinnerService.show()
    this.ecfservice.getDebitChngHist(this.apinvHeader_id, debitPage)
      .subscribe(result => {
        this.changeHistoryDbtdtl = result?.data ? result?.data : []
        if (this.changeHistoryDbtdtl.length > 0) {
          this.presentpageDebChgHist = result.pagination?.index
          this.length_DebChgHist = result.pagination?.count
        }

        this.SpinnerService.hide()
      })
  }
  length_DebChgHist = 0;
  pageIndex_DebChgHist = 0;
  pageSize_DebChgHist = 10;
  presentpageDebChgHist: number = 1
  handleDebChgHistPageEvent(event: PageEvent) {
    this.length_DebChgHist = event.length;
    this.pageSize_DebChgHist = event.pageSize;
    this.pageIndex_DebChgHist = event.pageIndex;
    this.presentpageDebChgHist = event.pageIndex + 1;
    this.getDebitChngHist(this.presentpageDebChgHist)

  }

  currentpageAuditChklst: number = 1;
  has_nextAuditChklst = true;
  has_previousAuditChklst = true;


  getAuditChksummary(page = 1) {
    let search = this.AuditChecklistSummaryForm.value
    if (search.ecftype == '' || search.ecftype == null || search.ecftype == undefined) {
      search.ecftype = 0
    }
    this.searchecftype = search.ecftype
    // this.SummaryApiauditObjNew = {
    //   method: "get",
    //   url: this.ecfmodelurl + "ecfapserv/get_ecfauditchecklist/" + this.searchecftype,
    //   params: "",OverallCount: "Total Count"
    // };
    this.ecfservice.getAuditChecklistPagination(search.ecftype, page).subscribe(data => {
      if (data?.data) {
        this.checklist = data['data'];
        let pagination = data['pagination']
        this.length_audit = pagination?.count
        this.currentpageAuditChklst = pagination.index
        this.has_nextAuditChklst = pagination.has_next
        this.has_previousAuditChklst = pagination.has_previous
      }
      else {
        this.checklist = []
        this.currentpageAuditChklst = 1
        this.has_nextAuditChklst = false
        this.has_previousAuditChklst = false
      }
    })
  }

  length_audit = 0;
  pageSize_audit = 10
  pageIndex_audit = 0
  handleAuditChklstPageEvent(event: PageEvent) {
    this.length_audit = event.length;
    this.pageSize_audit = event.pageSize;
    this.pageIndex_audit = event.pageIndex;
    this.currentpageAuditChklst = event.pageIndex + 1;
    this.getAuditChksummary(this.currentpageAuditChklst);

  }

  nextAuditChklst() {
    if (this.has_nextAuditChklst === true) {
      this.getAuditChksummary(this.currentpageAuditChklst + 1)
    }
  }

  previousAuditChklst() {
    if (this.has_previousAuditChklst === true) {
      this.getAuditChksummary(this.currentpageAuditChklst - 1)
    }
  }
  // resetAuditChklst() {
  //   this.AuditChecklistSummaryForm.reset()
  //   this.getAuditChksummary(1)
  // }
  resetAuditChklst(e) {
    this.AuditChecklistSummaryForm.reset()
    this.getAuditChksummary(1)
    this.auditysearch(e)
  }
  addAuditChklst() {
    let fill = {}
    if (this.auditchklistAddForm.get('ecftype').value == null || this.auditchklistAddForm.get('ecftype').value == '' || this.auditchklistAddForm.get('ecftype').value == undefined) {
      this.notification.showError("Please Select ECF Type")
      return false
    }
    if (this.auditchklistAddForm.get('group').value == null || this.auditchklistAddForm.get('group').value == '' || this.auditchklistAddForm.get('group').value == undefined) {
      this.notification.showError("Please Enter the Group")
      return false
    }
    if (this.auditchklistAddForm.get('question').value == null || this.auditchklistAddForm.get('question').value == '' || this.auditchklistAddForm.get('question').value == undefined) {
      this.notification.showError("Please Enter the Question")
      return false
    }
    if (this.auditchklistAddForm.get('solution').value == null || this.auditchklistAddForm.get('solution').value == '' || this.auditchklistAddForm.get('solution').value == undefined) {
      this.notification.showError("Please Enter the Solution")
      return false
    }
    this.SpinnerService.show();
    let data = {
      "type_id": this.auditchklistAddForm.value.ecftype,
      "group": this.auditchklistAddForm.value.group,
      "question": this.auditchklistAddForm.value.question,
      "solution": this.auditchklistAddForm.value.solution
    }
    if (this.AuditChklstId != "") {
      data['id'] = this.AuditChklstId
    }
    this.ecfservice.addAuditChklst(data).subscribe((results) => {
      console.log("results", results)
      this.SpinnerService.hide();
      if (results?.id) {
        this.auditchklistAddForm.reset();
        if (this.AuditChklstId != "") {
          this.notification.showSuccess("Edited Successfully.")
        }
        else {
          this.notification.showSuccess("Added Successfully.")
        }
        // this.getAuditChksummary()
        let search = this.AuditChecklistSummaryForm.value
        if (search.ecftype == '' || search.ecftype == null || search.ecftype == undefined) {
          search.ecftype = 0
        }
        this.searchecftype = search.ecftype
        this.SummaryApiauditObjNew = {
          method: "get",
          url: this.ecfmodelurl + "ecfapserv/get_ecfauditchecklist/" + this.searchecftype,
          params: "",OverallCount: "Total Count"
        };
        this.AuditChklstId = ""
      }
      else {
        this.auditchklistAddForm.reset();
        this.AuditChklstId = ""
        this.toastr.error(JSON.stringify(results))
      }
    },
      (error) => {
        this.SpinnerService.hide();
        this.toastr.warning(error)
      });
  }

  AuditChklstId = ""
  editAuditChklst(data) {
    this.getauditadd();
    this.AuditChklstId = data.id
    this.auditchklistAddForm.patchValue(
      {
        ecftype: data.invoice_type_id,
        group: data.group,
        question: data.question,
        solution: data.solution,
      }
    )
  }
  addAudChkBack() {
    this.AuditChklstId = ""
    this.auditchklistAddForm.reset();
    this.closedbuttons.nativeElement.click()
  }

  deleteChklst(data) {
    this.SpinnerService.show()
    var answer = window.confirm("Are you sure to delete?");
    if (answer) {
      this.ecfservice.deleteAuditChklst(data?.id)
        .subscribe(result => {
          this.SpinnerService.hide();
          if (result.status == "Success") {
            this.notification.showSuccess(result?.message)
            // this.getAuditChksummary(1)
            let search = this.AuditChecklistSummaryForm.value
            if (search.ecftype == '' || search.ecftype == null || search.ecftype == undefined) {
              search.ecftype = 0
            }
            this.searchecftype = search.ecftype
            this.SummaryApiauditObjNew = {
              method: "get",
              url: this.ecfmodelurl + "ecfapserv/get_ecfauditchecklist/" + this.searchecftype,
              params: "",OverallCount: "Total Count"
            };
          } else {
            this.notification.showError(result.message)
            this.SpinnerService.hide();
            return false;
          }

        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }

        )
    }
    else {
      this.SpinnerService.hide();
      return false;
    }
  }

  apinvMakerRptDwnld() {
    if (this.apinvsummaryform) {
      let search = this.apinvsummaryform.value

      this.searchapinvData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchapinvData.aptype = search.aptype;
      this.searchapinvData.raiser_name = search.raiser_name?.id;
      this.searchapinvData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchapinvData.invoice_no = search.invoice_no;
      this.searchapinvData.invoice_amount = search.invoice_amount;
      this.searchapinvData.supplier_id = search.supplier_id.id
      this.searchapinvData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd')
      this.searchapinvData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
      this.searchapinvData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
      this.searchapinvData.invoice_status = search.invoice_status;
      for (let i in this.searchapinvData) {
        if (this.searchapinvData[i] === null || this.searchapinvData[i] === "") {
          delete this.searchapinvData[i];
        }
      }
    }
    else {
      this.searchapinvData = {}
    }

    if (this.searchapinvData.from_date == "" || this.searchapinvData.from_date == undefined || this.searchapinvData.from_date == null) {
      delete this.searchapinvData.from_date
    }

    if (this.searchapinvData.to_date != "" && this.searchapinvData.to_date != undefined && this.searchapinvData.to_date != null) {
      this.searchapinvData.to_date = this.datePipe.transform(this.searchapinvData.to_date, 'yyyy-MM-dd');
    }
    else {
      delete this.searchapinvData.to_date
    }
    if (this.searchapinvData?.from_date != undefined && this.searchapinvData?.to_date == undefined) {
      this.notification.showError("Please select To Date")
      return false
    }
    if (this.searchapinvData?.to_date != undefined && this.searchapinvData?.from_date == undefined) {
      this.notification.showError("Please select From Date")
      return false
    }
    this.SpinnerService.show()
    this.ecfservice.getRptDownloads(this.rptFormat, this.searchapinvData, this.makerep)
      .subscribe((results) => {

        if (results?.code == undefined) {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "AP Maker Pending Report.xlsx";

          link.click();
        }
        else {
          this.notification.showError(results.code)
        }
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }
 failedRptDwnld() {
    this.globalpayload['is_failed']=1;
    this.SpinnerService.show()
    this.ecfservice.apFailedtranssummaydown(this.searchapbounceData, this.globalpayload)
      .subscribe((results) => {
        if (results?.code == undefined) {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "AP Failed Transaction Report.xlsx";
          link.click();
        }
        else {
          this.notification.showError(results.code)
        }
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }


  approverRptDwnld() {
    if (this.apapprovalsummaryform) {
      let search = this.apInvapprovalsummaryform.value

      this.searchapappData.crno = search.crno;
      this.searchapappData.batch_no = search.batch_no;
      this.searchapappData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchapappData.aptype = search.aptype;
      this.searchapappData.raiser_name = search.raiser_name?.id;
      this.searchapappData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchapappData.invoice_no = search.invoice_no;
      this.searchapappData.invoice_amount = search.invoice_amount;
      this.searchapappData.minamt = search.minamt;
      this.searchapappData.maxamt = search.maxamt;
      this.searchapappData.supplier_id = search.supplier_id.id;
      this.searchapappData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd');
      this.searchapappData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
      this.searchapappData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
      for (let i in this.searchapappData) {
        if (this.searchapappData[i] === null || this.searchapappData[i] === "") {
          delete this.searchapappData[i];
        }
      }
    }
    else {
      this.searchapappData = {}
    }
    if (this.searchapappData.from_date == "" || this.searchapappData.from_date == undefined || this.searchapappData.from_date == null) {
      delete this.searchapappData.from_date
    }

    if (this.searchapappData.to_date != "" && this.searchapappData.to_date != undefined && this.searchapappData.to_date != null) {
      this.searchapappData.to_date = this.datePipe.transform(this.searchapappData.to_date, 'yyyy-MM-dd');
    }
    else {
      delete this.searchapappData.to_date
    }
    // if(this.searchapappData.apinvoiceheaderstatus_id == "" || this.searchapappData.apinvoiceheaderstatus_id == undefined || this.searchapappData.apinvoiceheaderstatus_id == null)
    // {
    //   this.notification.showError("Please select Invoice Status")
    //   return false
    // }
    if (this.searchapappData?.from_date != undefined && this.searchapappData?.to_date == undefined) {
      this.notification.showError("Please select To Date")
      return false
    }
    if (this.searchapappData?.to_date != undefined && this.searchapappData?.from_date == undefined) {
      this.notification.showError("Please select From Date")
      return false
    }
    this.SpinnerService.show()
    this.ecfservice.getRptDownloads(this.rptFormat, this.searchapappData, this.apprep)
      .subscribe((results) => {

        if (results?.code == undefined) {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "AP Approver Pending Report.xlsx";

          link.click();
        }
        else {
          this.notification.showError(results.code)
        }
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }


  bounceRptDwnld() {
    if (this.apbounceform) {
      let search = this.apbounceform.value

      this.searchapbounceData.crno = search.crno;
      this.searchapbounceData.batch_no = search.batch_no;
      this.searchapbounceData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchapbounceData.aptype = search.aptype;
      this.searchapbounceData.raiser_name = search.raiser_name.id;
      this.searchapbounceData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchapbounceData.invoice_no = search.invoice_no;
      this.searchapbounceData.invoice_amount = search.invoice_amount;
      this.searchapbounceData.minamt = search.minamt;
      this.searchapbounceData.maxamt = search.maxamt;
      this.searchapbounceData.is_originalinvoice = search.is_originalinvoice
      this.searchapbounceData.supplier_id = search.supplier_id.id;
      this.searchapbounceData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd')
      this.searchapbounceData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
      this.searchapbounceData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;

      for (let i in this.searchapbounceData) {
        if (this.searchapbounceData[i] === null || this.searchapbounceData[i] === "") {
          delete this.searchapbounceData[i];
        }
      }
    }
    else {
      this.searchapbounceData = {}
    }

    if (this.searchapbounceData.from_date == "" || this.searchapbounceData.from_date == undefined || this.searchapbounceData.from_date == null) {
      delete this.searchapbounceData.from_date
    }

    if (this.searchapbounceData.to_date != "" && this.searchapbounceData.to_date != undefined && this.searchapbounceData.to_date != null) {
      this.searchapbounceData.to_date = this.datePipe.transform(this.searchapbounceData.to_date, 'yyyy-MM-dd');
    }
    else {
      delete this.searchapbounceData.to_date
    }
    if (this.searchapbounceData?.from_date != undefined && this.searchapbounceData?.to_date == undefined) {
      this.notification.showError("Please select To Date")
      return false
    }
    if (this.searchapbounceData?.to_date != undefined && this.searchapbounceData?.from_date == undefined) {
      this.notification.showError("Please select From Date")
      return false
    }
    this.SpinnerService.show()
    this.ecfservice.getRptDownloads(this.rptFormat, this.searchapbounceData, this.bouncesummary_fields)
      .subscribe((results) => {

        if (results?.code == undefined) {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "AP Bounce Report.xlsx";

          link.click();
        }
        else {
          this.notification.showError(results.code)
        }
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  commonRptDwnld() {
    if (this.commonForm) {
      let search = this.commonForm.value

      this.searchData.crno = search.crno;
      this.searchData.batch_no = search.batch_no;
      this.searchData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchData.aptype = search.aptype;
      this.searchData.raiser_name = search.raiser_name.id;
      this.searchData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchData.invoice_no = search.invoice_no;
      this.searchData.invoice_amount = search.invoice_amount;
      this.searchData.minamt = search.minamt;
      this.searchData.maxamt = search.maxamt;
      this.searchData.is_originalinvoice = search.is_originalinvoice
      this.searchData.supplier_id = search.supplier_id.id
      this.searchData.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd');
      this.searchData.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd');
      this.searchData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
      this.searchData.invoice_status = search.invoice_status;

      for (let i in this.searchData) {
        if (this.searchData[i] === null || this.searchData[i] === "") {
          delete this.searchData[i];
        }
      }
    }
    else {
      this.searchData = {}
    }

    if (this.searchData?.from_date != undefined && this.searchData?.to_date == undefined) {
      this.notification.showError("Please select To Date")
      return false
    }
    if (this.searchData?.to_date != undefined && this.searchData?.from_date == undefined) {
      this.notification.showError("Please select From Date")
      return false
    }

    if (this.searchData.from_date == "" || this.searchData.from_date == undefined || this.searchData.from_date == null) {
      delete this.searchData.from_date
    }

    if (this.searchData.to_date != "" && this.searchData.to_date != undefined && this.searchData.to_date != null) {
      this.searchData.to_date = this.datePipe.transform(this.searchData.to_date, 'yyyy-MM-dd');
    }
    else {
      delete this.searchData.to_date
    }
    this.SpinnerService.show()
    this.ecfservice.getRptDownloads(this.rptFormat, this.searchData, this.commonrep)
      .subscribe((results) => {

        if (results?.code == undefined) {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "AP Common Report.xlsx";

          link.click();
        }
        else {
          this.notification.showError(results.code)
        }
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }


  rptFormat: number
  rptDwnld(fmt) {
    this.resetRptDwnldForm()
    this.rptFormat = fmt

    if (this.rptFormat == 1) {
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 22 || x.id == 49)
    }
    else if (this.rptFormat == 2) {
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 23 || x.id == 49 || x.id == 50)
    }
    else if (this.rptFormat == 3) {
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 37 || x.id == 46)
    }
    else if (this.rptFormat == 4) {
      this.ecfStatusList2 = this.ecfStatusList.filter(x => x.id == 48 || x.id == 22 || x.id == 23 || x.id == 37)
    }
  }

  getRptDownload() {
    let frm = this.frmRptDownld.value

    if (frm.from_date != "" && frm.from_date != undefined && frm.from_date != null) {
      frm.from_date = this.datePipe.transform(frm.from_date, 'yyyy-MM-dd');
    }
    else {
      delete frm.from_date
    }

    if (frm.to_date != "" && frm.to_date != undefined && frm.to_date != null) {
      frm.to_date = this.datePipe.transform(frm.to_date, 'yyyy-MM-dd');
    }
    else {
      delete frm.to_date
    }
    if (frm.apinvoiceheaderstatus_id == "" || frm.apinvoiceheaderstatus_id == undefined || frm.apinvoiceheaderstatus_id == null) {
      this.notification.showError("Please select Invoice Status")
      return false
    }
    // if((this.rptFormat ==3 || this.rptFormat ==4) && (frm.apinvoiceheaderstatus_id == "" || frm.apinvoiceheaderstatus_id == undefined
    //                                                   || frm.apinvoiceheaderstatus_id == null))
    //   {
    //     this.notification.showError("Please select Invoice Status")
    //     return false
    //   }
    if (frm?.from_date != undefined && frm?.to_date == undefined) {
      this.notification.showError("Please select To Date")
      return false
    }
    if (frm?.to_date != undefined && frm?.from_date == undefined) {
      this.notification.showError("Please select From Date")
      return false
    }
    this.SpinnerService.show()
    this.ecfservice.getRptDownload(this.rptFormat, frm)
      .subscribe((results) => {

        if (results?.code == undefined) {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          if (this.rptFormat == 1) {
            link.download = "AP Maker Pending Report.xlsx";
          }
          else if (this.rptFormat == 2) {
            link.download = "AP Approver Pending Report.xlsx";
          }
          else if (this.rptFormat == 3) {
            link.download = "AP Bounce Report.xlsx";
          }
          else if (this.rptFormat == 4) {
            link.download = "AP Common Report.xlsx";
          }

          link.click();
          this.resetRptDwnldForm()
          this.closeRptDwnld.nativeElement.click()
        }
        else {
          this.notification.showError(results.code)
          this.resetRptDwnldForm()
        }
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }
  resetRptDwnldForm() {
    this.frmRptDownld.controls['from_date'].reset()
    this.frmRptDownld.controls['to_date'].reset()
    this.frmRptDownld.controls['apinvoiceheaderstatus_id'].reset()
    this.frmRptDownld.reset()
  }
  rptDwnldBack() {
    this.closeRptDwnld.nativeElement.click()
  }

  CommonViewEntryPage = 1
  commonViewEntrySummary: any = []

  pagesizeCommonViewEntry = 10;
  CommonViewEntrypresentpage: number = 1;
  CommonTransCrno: any
  CommonViewEntry(crno, num) {
    this.popupopen1();
    let page = 1
    this.CommonTransCrno = crno.apinvoiceheader_crno
    this.SpinnerService.show()
    this.SummaryApiviewentryObjNew = {
      method: "get",
      url: this.ecfmodelurl + "entryserv/fetch_commonentrydetails/" + this.CommonTransCrno,
      params: "",
    };
    this.commonViewEntrySummary = []
    this.ecfservice.getViewEntry(this.CommonTransCrno, page)
      .subscribe(result => {
        this.SpinnerService.hide();
        if (result['data'] != undefined) {
          this.commonViewEntrySummary = result['data']
          let datapagination = result["pagination"];

          if (this.commonViewEntrySummary.length > 0) {
            this.length_CmnViewEntry = result?.count
            this.CommonViewEntrypresentpage = datapagination?.index;

            let err = this.commonViewEntrySummary[this.commonViewEntrySummary.length - 1].errordescription
            if (err != undefined && err != null && err != '' && err != '0') {
              this.viewEntryError(err, this.commonViewEntrySummary.length - 1)
            }
            else {
              this.closeErrorDescription()
            }

          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }
  length_CmnViewEntry = 0;
  pageSize_CmnViewEntry = 10
  pageIndexCmnViewEntry = 0
  handleCmnViewEntry(event: PageEvent) {
    this.length_CmnViewEntry = event.length;
    this.pageSize_CmnViewEntry = event.pageSize;
    this.pageIndexCmnViewEntry = event.pageIndex;
    this.CommonViewEntrypresentpage = event.pageIndex + 1;
    this.CommonViewEntry(this.CommonTransCrno, this.CommonViewEntrypresentpage);
  }

  closeCommonEntryClick() {
    this.CommonViewEntrypresentpage = 1
    this.closeCommonentry.nativeElement.click();
  }

  ResetAPRptSummary() {
    this.frmAPReportSummary.controls['aptype'].reset(""),
      this.frmAPReportSummary.controls['supplier_id'].reset(""),
      this.frmAPReportSummary.controls['raiserbranch'].reset(""),
      this.frmAPReportSummary.controls['apinvoiceheaderstatus_id'].reset(""),
      this.frmAPReportSummary.controls['raisedby'].reset(""),
      this.frmAPReportSummary.controls['from_date'].reset(""),
      this.frmAPReportSummary.controls['to_date'].reset("")
  }

  // APRptSummarydownload(value) {
  //   console.log(value)
  //   let search = this.frmAPReportSummary.value
  //   // if (search.from_date == '' || search.from_date == null || search.from_date == undefined ||
  //   //   search.to_date == '' || search.to_date == null || search.to_date == undefined) {
  //   //   this.notification.showError("Please select 'From date and To date' ")
  //   //   return false
  //   // } if (search.from_date != '' && search.to_date == '') {
  //   //   this.notification.showError("Please select 'To date' ")
  //   //   return false
  //   // }
  //   // else if (search.to_date != '' && search.from_date == '') {
  //   //   this.notification.showError("Please select 'From date' ")
  //   //   return false
  //   // }
  //   // if (search.from_date != '' || search.from_date != null || search.from_date != undefined) {
  //   //   search.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd')
  //   //   search.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd')
  //   // }
  //   // if ((search.raisedby != '' || search.raisedby != null || search.raisedby != undefined)
  //   //   && typeof (search.raisedby) == 'object') {
  //   //   search.raisedby = search.raisedby.id
  //   // }

  //   // if ((search.supplier_id != '' || search.supplier_id != null || search.supplier_id != undefined)
  //   //   && typeof (search.supplier_id) == 'object') {
  //   //   search.supplier_id = search.supplier_id.id
  //   // }

  //   // if ((search.raiserbranch != '' || search.raiserbranch != null || search.raiserbranch != undefined)
  //   //   && typeof (search.raiserbranch) == 'object') {
  //   //   search.raiserbranch = search.raiserbranch.id
  //   // }
  //   // search.report_type = type

  //   search.report_type = search?.report_name
  //   let type = search?.report_name
  //   for (let i in search) {
  //     if (search[i] === null || search[i] === "") {
  //       delete search[i];
  //     }
  //   }
  //   this.SpinnerService.show()
  //   this.ecfservice.apRptSummarydownload1(value?.file_id)
  //     .subscribe((results) => {
  //       this.SpinnerService.hide()
  //       console.log("results", results)
  //       if (results.type == "application/json") {
  //         this.toastr.warning('Failed', 'Report Download')
  //         return false
  //       }
  //       let binaryData = [];
  //       binaryData.push(results)
  //       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //       let link = document.createElement('a');
  //       link.href = downloadUrl;
  //       link.download = "AP " + type;
  //       link.click();
  //     },
  //       error => {
  //         this.errorHandler.handleError(error);
  //         this.SpinnerService.hide();
  //       }

  //     )
  // }
  APRptSummarydownload(value) {
    console.log(value)
    let search = this.frmAPReportSummary.value
    // if (search.from_date == '' || search.from_date == null || search.from_date == undefined ||
    //   search.to_date == '' || search.to_date == null || search.to_date == undefined)
    // {
    //   this.notification.showError("Please select 'From date and To date' ")
    //   return false
    // } if (search.from_date != '' && search.to_date == '') {
    //   this.notification.showError("Please select 'To date' ")
    //   return false
    // }
    // else if (search.to_date != '' && search.from_date == '') {
    //   this.notification.showError("Please select 'From date' ")
    //   return false
    // }
    // if (search.from_date != '' || search.from_date != null || search.from_date != undefined) {
    //   search.from_date = this.datePipe.transform(search.from_date, 'yyyy-MM-dd')
    //   search.to_date = this.datePipe.transform(search.to_date, 'yyyy-MM-dd')
    // }
    // if ((search.raisedby != '' || search.raisedby != null || search.raisedby != undefined) 
    //       && typeof(search.raisedby ) =='object')
    //   {
    //   search.raisedby = search.raisedby.id
    // }
    
    // if ((search.supplier_id != '' || search.supplier_id != null || search.supplier_id != undefined) 
    //       && typeof(search.supplier_id ) =='object')
    //   {
    //   search.supplier_id = search.supplier_id.id
    // }
    
    // if ((search.raiserbranch != '' || search.raiserbranch != null || search.raiserbranch != undefined) 
    //       && typeof(search.raiserbranch ) =='object')
    //   {
    //   search.raiserbranch = search.raiserbranch.id
    // }
    search.report_type = search?.report_type
    let type = value?.report_name
    for (let i in search) {
      if (search[i] === null || search[i] === "") {
        delete search[i];
      }
    }
    this.SpinnerService.show()
    this.ecfservice.apRptSummarydownload1(value?.file_id)
    .subscribe((results) => {
      this.SpinnerService.hide()
      console.log("results", results)
      if (results.type == "application/json") {
        this.toastr.warning('Failed', 'Report Download')
        return false
      }
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "AP " + type.replace(/ /g, "_") +".xlsx";
      link.click();
    },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

    )
  }
  public displaytest(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }
  public displayFn(Suppliertype?: SupplierName): string | undefined {
    return Suppliertype ? Suppliertype.name : undefined;
  }
  getsuppdd() {
    
    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.commonForm.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getsuppliernamescroll(this.suplist, value, 1, 1)
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

  }

  getsuppddapp() {

    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.apInvapprovalsummaryform.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getsuppliernamescroll(this.suplist, value, 1, 1)
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

  }

  getsuppddbnce() {

    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.apbounceform.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getsuppliernamescroll(this.suplist, value, 1, 1)
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

  }
  getsuppddrej() {

    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.aprejectform.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getsuppliernamescroll(this.suplist, value, 1, 1)
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

  }
  getsuppliername(id, suppliername) {
    this.ecfservice.getsuppliername(id, suppliername, 1)
      .subscribe((results) => {
        if (results) {
          let datas = results["data"];
          this.supplierNameData = datas;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
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
                this.ecfservice.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, 1, this.currentpage + 1)
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
  default = true
  alternate = false

  // SelectSuppliersearch() {
  //   let searchsupplier = this.SelectSupplierForm?.value;
  //   if (searchsupplier?.code === "" && searchsupplier?.panno === "" && searchsupplier?.gstno === "") {
  //     this.getsuppliername("", "");
  //   }
  //   else {
  //     // this.SelectSupplierForm.controls['name'].enable();

  //     this.alternate = true;
  //     this.default = false;
  //     this.Testingfunctionalternate();
  //   }

  //   if (searchsupplier?.name != "") {
  //     this.Testingfunctionalternate();

  //   }
  // }
  suppliers: any;
  SelectSuppliersearch(e) {
    this.suppliers = e
    let searchsupplier = this.SelectSupplierForm?.value;
    if (this.suppliers?.code === "" && this.suppliers?.panno === "" && this.suppliers?.gstno === "") {
      this.getsuppliername("", "");
    }
    else {
      // this.SelectSupplierForm.controls['name'].enable();

      this.alternate = true;
      this.default = false;
      this.Testingfunctionalternate();
    }
    if (searchsupplier?.name != "") {
      this.Testingfunctionalternate();
    }
  }
  searchsupplier: any
  // Testingfunctionalternate() {
  //   this.searchsupplier = this.SelectSupplierForm.value;
  //   this.ecfservice.getselectsupplierSearch(this.searchsupplier, 1)
  //     .subscribe(result => {
  //       if (result['data']?.length == 0) {
  //         this.notification.showError("No Results Found...")
  //        this.dataclear('')
  //         return false;
  //       }
  //       if (result['data']?.length > 0) {
  //         this.selectsupplierlist = result['data']
  //         console.log("this.searchsupplier?.gstno?.length", this.searchsupplier?.gstno?.length)
  //         if (this.searchsupplier?.gstno?.length == 15 || this.searchsupplier?.panno?.length == 10) {
  //           let supplierdata = {
  //             "id": this.selectsupplierlist[0]?.id,
  //             "name": this.selectsupplierlist[0]?.name,
  //             "code": this.selectsupplierlist[0]?.code
  //           }
  //           this.supplierdata = supplierdata
  //           this.SelectSupplierForm.patchValue({ name: supplierdata })
  //           this.getsuppView(supplierdata)
  //         } else {

  //           let supplierdata = {
  //             "id": this.selectsupplierlist[0]?.id,
  //             "name": this.selectsupplierlist[0]?.name,
  //             "code": this.selectsupplierlist[0]?.code
  //           }
  //           this.supplierdata = supplierdata
  //           this.SelectSupplierForm.patchValue({ name: supplierdata })
  //           this.getsuppView(supplierdata)
  //         }
  //       }
  //     }, error => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }

  Testingfunctionalternate() {
    this.searchsupplier = this.SelectSupplierForm.value;
    this.ecfservice.getselectsupplierSearch(this.suppliers, 1)
      .subscribe(result => {
        if (result['data']?.length == 0) {
          this.notification.showError("No Results Found...")
          return false;
        }
        else if (result['data']?.length > 0) {
          this.supplierlists = result['data']
          console.log("selecteddata===========>", this.supplierlists)
          console.log("this.searchsupplier?.gstno?.length", this.searchsupplier?.gstno?.length)
          this.choose_supplier_field_1 = {
            label: "Choose Supplier",
            method: "get",
            url: this.ecfmodelurl + "venserv/search_supplierdetails_ecf",
            params: '&code=' + this.suppliers.code + '&panno=' + this.suppliers.panno + '&gstno=' + this.suppliers.gstno,
            searchkey: "name",
            displaykey: "name",
            wholedata: true,
            required: true,
            formcontrolname: "name",
            id: "ap-0501"
          };
          if (this.searchsupplier?.gstno?.length == 15 || this.searchsupplier?.panno?.length == 10) {
            let supplierdatass = {
              code: this.supplierlists[0].code,
              id: this.supplierlists[0].id,
              name: this.supplierlists[0].name,
            };
            this.suppliersearchs = supplierdatass
            this.SelectSupplierForm.patchValue({ name: this.supplierdatass })
            this.getsuppView(this.supplierdatass)
          } else {

            let supplierdatass = {
              code: this.supplierlists[0].code,
              id: this.supplierlists[0].id,
              name: this.supplierlists[0].name,
            };
            this.supplierdatass = supplierdatass
            this.SelectSupplierForm.patchValue({ name: supplierdatass })
            this.getsuppView(supplierdatass)
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  dataclear(e) {
    this.SelectSupplierForm.controls['gstno'].reset("")
    this.SelectSupplierForm.controls['code'].reset("")
    this.SelectSupplierForm.controls['panno'].reset("")
    this.SelectSupplierForm.controls['name'].reset("")
    this.alternate = false
    this.default = true
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
    this.submitbutton = false;
  }
  SupplierName: any
  SupplierCode: any
  SupplierGSTNumber: string;
  SupplierPANNumber: string;
  Address: string;
  City: string;
  line1: any;
  line2: any;
  line3: any;
  stateid: any
  statename: any
  getsuppView(data) {
    if (!data?.id) {
      return;
    }
    this.ecfservice.getsupplierView(data?.id)
      .subscribe(result => {
        if (result) {
          this.SupplierName = result?.name
          this.SupplierCode = result?.code
          this.SupplierGSTNumber = result?.gstno
          this.SupplierPANNumber = result?.panno
          this.Address = result?.address_id
          this.line1 = result?.address_id?.line1
          this.line2 = result?.address_id?.line2
          this.line3 = result?.address_id?.line3
          this.City = result?.address_id?.city_id?.name
          this.stateid = result?.address_id?.state_id?.id
          this.statename = result?.address_id?.state_id?.name
          let supplierdata = {
            "id": result?.id,
            "name": result?.name,
            "code": result?.code
          }
          this.supplierdata = supplierdata
          this.submitbutton = true;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  supplierModalSubmit() {
    if (this.APECFmakeForm == true) {
      this.apinvsummaryform.patchValue({ supplier_id: this.supplierdata })
    }
    else if (this.APApproverInvoiceForm == true) {
      this.apInvapprovalsummaryform.patchValue({ supplier_id: this.supplierdata })
    }
    else if (this.CommonSummaryForm == true) {
      this.commonForm.patchValue({ supplier_id: this.supplierdata })
    }
    else if (this.APBounceForm == true) {
      this.apbounceform.patchValue({ supplier_id: this.supplierdata })
    }
    else if (this.APRejectForm == true) {
      this.aprejectform.patchValue({ supplier_id: this.supplierdata })
    }
    else if (this.paymentfileForm == true) {
      this.PFSearchForm.patchValue({ supplier_id: this.supplierdata })
    }

  }
  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  isPaymentAdvicepage: boolean
  pageSize_paymentAdvice = 10;
  getpaymentAdvtotalcount: any
  paymentAdvPresentPage = 1
  lengthPaymentAdv = 0
  pageIndex_paymentadv = 0
  paymentAdviceSearch(value, pageNumber = 1) {
    if (this.paymentAdviceForm) {
      let search = this.paymentAdviceForm.value

      this.searchData.crno = search.crno;
      if (search.invoiceheader_crno != '' && search.invoiceheader_crno != null && search.invoiceheader_crno != undefined) {
        this.searchData.invoiceheader_crno = search.invoiceheader_crno;
        this.isinvcrnoact_pmtadv = true;
      }
      // this.searchData.aptype = search.aptype;
      // this.searchData.raiser_name = search.raiser_name.id;
      // this.searchData.raiserbranch_id = search.raiserbranch_id.id;
      if (search.invoice_no != '' && search.invoice_no != null && search.invoice_no != undefined) {
        this.searchData.invoice_no = search.invoice_no;
        this.isinvcrnoact_pmtadv = true;
      }
      if (search.start_date != '' && search.start_date != null && search.start_date != undefined &&
        search.end_date != '' && search.end_date != null && search.end_date != undefined
      ) {

        this.searchData.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd');
        this.searchData.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd');
        this.isinvcrnoact_pmtadv = true;
      }
      if (search.invoice_amount != '' && search.invoice_amount != null && search.invoice_amount != undefined) {
        this.searchData.invoice_amount = search.invoice_amount;
        this.isinvcrnoact_pmtadv = true;
      }

      // this.searchData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;

      if (value == 'ecf') {
        this.searchData.aptype = this.pmtadvvalue?.id;
        this.isecftyact_pmtadv = true;
      }
      else if (value == 'supplier') {
        this.searchData.supplier_id = this.pmtadvvalue?.id
        this.issupact_pmtadv = true;
      }
      else if (value == 'raiser') {
        this.searchData.raiser_name = this.pmtadvvalue?.id
        this.israiact_pmtadv = true;
      }
      else if (value == 'raiserbr') {
        this.searchData.raiserbranch_id = this.pmtadvvalue?.id
        this.israibract_pmtadv = true;
      }
      else if (value == 'invsts') {
        this.searchData.apinvoiceheaderstatus_id = this.pmtadvvalue?.id
        this.isinvstsact_pmtadv = true;
      }

      for (let i in this.searchData) {
        if (this.searchData[i] === null || this.searchData[i] === "") {
          delete this.searchData[i];
        }
      }
    }
    else {
      this.searchData = {}
    }

    if (this.searchData?.start_date != undefined && this.searchData?.end_date == undefined) {
      this.notification.showError("Please select To Date")
      return false
    }
    if (this.searchData?.end_date != undefined && this.searchData?.start_date == undefined) {
      this.notification.showError("Please select From Date")
      return false
    }

    this.SpinnerService.show()
    this.ecfservice.getPaymentAdvSummary(this.searchData, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.paymentAdvSummary = result['data']
          let datapagination = result["pagination"];
          this.lengthPaymentAdv = result?.count
          if (this.paymentAdvSummary.length === 0) {
            this.isPaymentAdvicepage = false
          }
          if (this.paymentAdvSummary.length > 0) {
            this.paymentAdvPresentPage = datapagination.index;
            this.isPaymentAdvicepage = true
            this.paymentAdviceForm.controls['aptype'].reset('')
            this.paymentAdviceForm.controls['apinvoiceheaderstatus_id'].reset('')
            this.pmtadvsearch('')
          }
          else {
            this.lengthPaymentAdv = 0;
            this.isPaymentAdvicepage = false
          }

          this.SpinnerService.hide()
        } else {
          this.notification.showError(result?.message)
          this.SpinnerService.hide()
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  resetPaymentAdvice() {
    this.paymentAdviceForm.controls['crno'].reset(""),
      this.paymentAdviceForm.controls['aptype'].reset(""),
      this.paymentAdviceForm.controls['invoiceheader_crno'].reset(""),
      this.paymentAdviceForm.controls['raiser_name'].reset(""),
      this.paymentAdviceForm.controls['raiserbranch_id'].reset(""),
      this.paymentAdviceForm.controls['invoice_no'].reset(""),
      this.paymentAdviceForm.controls['start_date'].reset(""),
      this.paymentAdviceForm.controls['end_date'].reset(""),
      this.paymentAdviceForm.controls['apinvoiceheaderstatus_id'].reset(""),
      this.pmtadvsearch('cleared')
    this.searchData = {}
    this.paymentAdviceSearch(1);
  }


  handlePaymentAdvPageEvent(event: PageEvent) {
    this.lengthPaymentAdv = event.length;
    this.pageSize_paymentAdvice = event.pageSize;
    this.pageIndex_paymentadv = event.pageIndex;
    this.paymentAdvPresentPage = event.pageIndex + 1;
    this.paymentAdviceSearch(this.paymentAdvPresentPage);
  }
  paymentAdvRptDwnld() {
    if (this.paymentAdviceForm) {
      let search = this.paymentAdviceForm.value

      this.searchData.crno = search.crno;
      this.searchData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchData.aptype = search.aptype;
      this.searchData.raiser_name = search.raiser_name.id;
      this.searchData.raiserbranch_id = search.raiserbranch_id.id;
      this.searchData.invoice_no = search.invoice_no;
      this.searchData.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd');
      this.searchData.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd');
      this.searchData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;

      for (let i in this.searchData) {
        if (this.searchData[i] === null || this.searchData[i] === "") {
          delete this.searchData[i];
        }
      }
    }
    else {
      this.searchData = {}
    }

    if (this.searchData?.start_date != undefined && this.searchData?.end_date == undefined) {
      this.notification.showError("Please select To Date")
      return false
    }
    if (this.searchData?.end_date != undefined && this.searchData?.start_date == undefined) {
      this.notification.showError("Please select From Date")
      return false
    }

    if (this.searchData.start_date == "" || this.searchData.start_date == undefined || this.searchData.start_date == null) {
      delete this.searchData.start_date
    }

    if (this.searchData.end_date != "" && this.searchData.end_date != undefined && this.searchData.end_date != null) {
      this.searchData.end_date = this.datePipe.transform(this.searchData.end_date, 'yyyy-MM-dd');
    }
    else {
      delete this.searchData.end_date
    }
    this.SpinnerService.show()
    this.ecfservice.getRptDownload(this.rptFormat, this.searchData)
      .subscribe((results) => {

        if (results?.code == undefined) {
          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "Payment Advice Report.xlsx";

          link.click();
        }
        else {
          this.notification.showError(results.code)
        }
        this.SpinnerService.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )
  }

  paymentDetailsData: any
  viewPaymentDet(data) {
    this.viewPaymentDetForm.controls['UTR_No'].setValue(data.UTR_No)
    this.viewPaymentDetForm.controls['paid_amount'].setValue(data.paid_amount)
    this.viewPaymentDetForm.controls['paid_date'].setValue(this.datePipe.transform(data.paid_date, 'dd-MMM-yyyy'))
    this.viewPaymentDetForm.controls['paymode'].setValue(data.paymode)
    this.viewPaymentDetForm.controls['pvno'].setValue(data.pvno)
  }
  getPaymentAdvRsrbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.paymentAdviceForm.get('raiserbranch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
      })
  }
  getPaymentAdvRaiserdropdown() {
    // this.getrm('');

    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.paymentAdviceForm.get('raiser_name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.ecfservice.getrmscroll(value, 1)
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
  getsupplierindex(dtl) {
    this.popupopen11()
    this.SupplierDetailForm.patchValue({
      suppliergst: dtl?.supplier_gst,
      invoiceno: dtl?.invoiceno,
      invoicedate: this.datePipe.transform(dtl?.invoicedate, 'dd-MMM-yyyy'),
      supplier_name: dtl?.supplier_name,
      pincode: dtl?.pincode,
      address: dtl?.address
    })
  }
  supplierBack() {
    this.supclosebuttons.nativeElement.click();
  }

  dooScoreChk = false
  dooScoreChange(e: boolean) {
    this.dooScoreChk = e;
    if (this.dooScoreChk)
      this.getDooScoresummary()
  }
  DooScoreSummary: any;
  currentpageDoo: any = 1
  has_nextDoo: boolean = true
  has_previousDoo: boolean = true

  reportcolumn: any
  reportsummary: any;
  getDooScoresummary(pageno = 1) {
    let search = { report_type: '', from_date: "", to_date: "" }
    let data = this.frmAPReportSummary.value

    // search.designation = 'DOO'
    search.from_date = this.datePipe.transform(data.from_date, 'yyyy-MM-dd') != null ? this.datePipe.transform(data.from_date, 'yyyy-MM-dd') : ""
    search.to_date = this.datePipe.transform(data.to_date, 'yyyy-MM-dd') != null ? this.datePipe.transform(data.to_date, 'yyyy-MM-dd') : ""

    if (search.from_date != '' && search.to_date == '') {
      this.notification.showWarning("Please Select To Date")
      return false
    }
    if (search.from_date == '' && search.to_date != '') {
      this.notification.showWarning("Please Select From Date")
      return false
    }
    search.report_type = data?.report_type
    this.SpinnerService.show()
    this.ecfservice.getapRptSummary(search, pageno)
      .subscribe((result) => {
        this.SpinnerService.hide();
        //   result ={
        //     "data": [
        //         {
        //             "activitydate": "03-02-2025",
        //             "activitystatus": "Invoice Forwarded for Approval",
        //             "approver": "bala - empl8",
        //             "approverbranch": "CENTRAL OFFICE - 1101",
        //             "currentstatus": "INVOICE APPROVED",
        //             "ecfcrno": "NPO2502030014",
        //             "invoiceamount": "2500.00",
        //             "invoicecrno": "NPO2502030014A1",
        //             "invoicedate": "03-02-2025",
        //             "invoiceno": "inv345y",
        //             "invoicetype": "NON PO",
        //             "maker": "sarathamani - TRN005",
        //             "makerbranch": "CENTRAL OFFICE - 1101",
        //             "month": "Feb-2025",
        //             "remarks": "fwd",
        //             "sno": 1,
        //             "submitteddate": "02-02-2025",
        //             "tat": 1,
        //             "taxableamount": "2500.00"
        //         },
        //         {
        //             "activitydate": "03-02-2025",
        //             "activitystatus": "Invoice Returned",
        //             "approver": "bala - empl8",
        //             "approverbranch": "EXPENSES MANAGEMENT CELL - 1903",
        //             "currentstatus": "INVOICE APPROVED",
        //             "ecfcrno": "NPO2502030013",
        //             "invoiceamount": "23456.00",
        //             "invoicecrno": "NPO2502030013A1",
        //             "invoicedate": "03-02-2025",
        //             "invoiceno": "inv56789",
        //             "invoicetype": "NON PO",
        //             "maker": "ishwarya - vsolv231",
        //             "makerbranch": "CENTRAL OFFICE - 1101",
        //             "month": "Feb-2025",
        //             "remarks": "return",
        //             "sno": 2,
        //             "submitteddate": "02-02-2025",
        //             "tat": 1,
        //             "taxableamount": "23456.00"
        //         },
        //         {
        //             "activitydate": "03-02-2025",
        //             "activitystatus": "Invoice Rejected",
        //             "approver": "vikneshtest - vikneshtest",
        //             "approverbranch": "CENTRAL OFFICE - 1101",
        //             "currentstatus": "INVOICE REJECTED",
        //             "ecfcrno": "NPO2502030011",
        //             "invoiceamount": "150.00",
        //             "invoicecrno": "NPO2502030011A1",
        //             "invoicedate": "03-02-2025",
        //             "invoiceno": "dootest",
        //             "invoicetype": "NON PO",
        //             "maker": "TamilSelvi S - vsolv23",
        //             "makerbranch": "EXPENSES MANAGEMENT CELL - 1903",
        //             "month": "Feb-2025",
        //             "remarks": "no",
        //             "sno": 3,
        //             "submitteddate": "01-02-2025",
        //             "tat": 2,
        //             "taxableamount": "150.00"
        //         },
        //         {
        //             "activitydate": "02-02-2025",
        //             "activitystatus": "Invoice Approved",
        //             "approver": "vikneshtest - vikneshtest",
        //             "approverbranch": "CENTRAL OFFICE - 1101",
        //             "currentstatus": "INVOICE APPROVED",
        //             "ecfcrno": "NPO2502030004",
        //             "invoiceamount": "78906.00",
        //             "invoicecrno": "NPO2502030004A1",
        //             "invoicedate": "03-02-2025",
        //             "invoiceno": "inv45678",
        //             "invoicetype": "NON PO",
        //             "maker": "ishwarya - vsolv231",
        //             "makerbranch": "CENTRAL OFFICE - 1101",
        //             "month": "Feb-2025",
        //             "remarks": "ok",
        //             "sno": 4,
        //             "submitteddate": "01-02-2025",
        //             "tat": 1,
        //             "taxableamount": "78906.00"
        //         },
        //         {
        //             "activitydate": null,
        //             "activitystatus": null,
        //             "approver": "vikneshtest - vikneshtest",
        //             "approverbranch": "CENTRAL OFFICE - 1101",
        //             "currentstatus": "PENDING IN ECF APPROVAL",
        //             "ecfcrno": "NPO2501270001",
        //             "invoiceamount": "1005.00",
        //             "invoicecrno": "NPO2501270001A1",
        //             "invoicedate": "27-01-2025",
        //             "invoiceno": "sadadadad",
        //             "invoicetype": "NON PO",
        //             "maker": "viknesh - vs0290",
        //             "makerbranch": "CENTRAL OFFICE - 1101",
        //             "month": "Feb-2025",
        //             "remarks": null,
        //             "sno": 5,
        //             "submitteddate": "02-02-2025",
        //             "tat": 3,
        //             "taxableamount": "1005.00"
        //         },
        //         {
        //             "activitydate": "02-02-2025",
        //             "activitystatus": "Invoice Returned",
        //             "approver": "vikneshtest - vikneshtest",
        //             "approverbranch": "CENTRAL OFFICE - 1101",
        //             "currentstatus": "PENDING IN ECF APPROVAL",
        //             "ecfcrno": "NPO2501270001",
        //             "invoiceamount": "1005.00",
        //             "invoicecrno": "NPO2501270001A1",
        //             "invoicedate": "27-01-2025",
        //             "invoiceno": "sadadadad",
        //             "invoicetype": "NON PO",
        //             "maker": "viknesh - vs0290",
        //             "makerbranch": "CENTRAL OFFICE - 1101",
        //             "month": "Feb-2025",
        //             "remarks": "no",
        //             "sno": 6,
        //             "submitteddate": "01-02-2025",
        //             "tat": 1,
        //             "taxableamount": "1005.00"
        //         }
        //     ],
        //     "pagination": {
        //         "count": 6,
        //         "has_next": false,
        //         "has_previous": false,
        //         "index": 1,
        //         "limit": 10
        //     }
        // }

        let datass = result['data'];

        let datapagination = result["pagination"];
        this.DooScoreSummary = datass;
        if (this.DooScoreSummary.length > 0) {
          this.has_nextDoo = datapagination.has_next;
          this.has_previousDoo = datapagination.has_previous;
          this.currentpageDoo = datapagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  dooTodate=new Date()
  dooFromdate = new Date()
onDateChange() {
  const from_date = new Date(this.frmAPReportSummary?.value?.from_date);
  this.dooFromdate = from_date;
  let oneMonthLater = new Date(from_date.getFullYear(), from_date.getMonth() + 1, from_date.getDate());
  const today = new Date();
  if (oneMonthLater > today) {
    oneMonthLater = today;
  }
  // oneMonthLater.setHours(0, 0, 0, 0);
  // this.dooTodate = oneMonthLater;
}

  DooScoreDwnld() {
    let search = { designation: 'DOO', from_date: "", to_date: "" }
    let data = this.frmAPReportSummary.value

    search.designation = 'DOO'
    search.from_date = this.datePipe.transform(data.from_date, 'yyyy-MM-dd') != null ? this.datePipe.transform(data.from_date, 'yyyy-MM-dd') : ""
    search.to_date = this.datePipe.transform(data.to_date, 'yyyy-MM-dd') != null ? this.datePipe.transform(data.to_date, 'yyyy-MM-dd') : ""

    if (search.from_date != '' && search.to_date == '') {
      this.notification.showWarning("Please Select To Date")
      return false
    }
    if (search.from_date == '' && search.to_date != '') {
      this.notification.showWarning("Please Select From Date")
      return false
    }

    this.SpinnerService.show()
    this.ecfservice.DooScoredownload(search)
      .subscribe((results) => {
        this.SpinnerService.hide()
        console.log("results", results)
        if (results.type == "application/json") {
          this.toastr.warning('Failed', 'Report Download')
          return false
        }
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Doo Scorecard.xlsx";
        link.click();
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }

      )

  }

  resetDooScore() {
    this.frmAPReportSummary.reset()
    // this.getDooScoresummary(1)
    this.get_Summary(1)
    this.handleReportSearchPageEvent({pageIndex:0,pageSize:10,length:this.length_rep} as PageEvent)
  }

  Report_status: any;
  has_reppageprevious: boolean = false;
  has_reppagenext: boolean = false;
  rep_value: any;


  // generate_report(page) {
  //   this.rep_value = {}
  //   if (this.frmAPReportSummary) {
  //     this.rep_value = this.frmAPReportSummary.value
  //     if (this.rep_value.report_type == '' || this.rep_value.report_type == undefined || this.rep_value.report_type == null) {
  //       this.notification.showError('Please Select Report Type')
  //       return
  //     }
  //     if (this.rep_value.from_date == '' || this.rep_value.from_date == undefined || this.rep_value.from_date == null ||
  //       this.rep_value.to_date == '' || this.rep_value.to_date == undefined || this.rep_value.to_date == null) {
  //       this.notification.showError('please select from date and to date')
  //       return
  //     }
  //     if (this.rep_value.from_date != '' && this.rep_value.to_date == '') {
  //       this.notification.showWarning("Please Select To Date")
  //       return false
  //     }
  //     if (this.rep_value.from_date == '' && this.rep_value.to_date != '') {
  //       this.notification.showWarning("Please Select From Date")
  //       return false
  //     }
  //     this.rep_value.from_date = this.datePipe.transform(this.rep_value.from_date, 'yyyy-MM-dd') != null ? this.datePipe.transform(this.rep_value.from_date, 'yyyy-MM-dd') : ""
  //     this.rep_value.to_date = this.datePipe.transform(this.rep_value.to_date, 'yyyy-MM-dd') != null ? this.datePipe.transform(this.rep_value.to_date, 'yyyy-MM-dd') : ""


  //     for (let i in this.rep_value) {
  //       if (this.rep_value[i] === null || this.rep_value[i] === "") {
  //         delete this.rep_value[i];
  //       }
  //     }
  //   }
  //   else {
  //     this.rep_value = {}
  //   }
  //   this.SpinnerService.show()
  //   if (page == 1) {
  //     this.pageIndex_rep = 0;
  //   }
  //   this.ecfservice.apRptSummarydownload(this.rep_value).subscribe((results) => {
  //     if (results.status == 'success') {
  //       this.notification.showSuccess(results?.message)
  //       this.SpinnerService.hide()
  //       this.get_Summary(1)
  //       console.log('summary called')
  //     }
  //     else if (results.status == 'failed') {
  //       this.notification.showSuccess(results?.description)
  //       this.SpinnerService.hide()
  //       // this.get_Summary(1)
  //       // console.log('summary called')
  //     }
  //     else {
  //       this.notification.showError(results?.description)
  //       this.SpinnerService.hide()
  //     }
  //   },
  //     error => {
  //       this.errorHandler.handleError(error)
  //       this.SpinnerService.hide()
  //     })

  // }
    generate_report(page){
    this.rep_value = {} 
    if(this.frmAPReportSummary){
      this.rep_value =this.frmAPReportSummary.value  
      if(this.rep_value.report_type == '' || this.rep_value.report_type == undefined || this.rep_value.report_type == null){
        this.notification.showError('Please Select Report Type')
        return
      }
      if(this.rep_value.from_date == '' || this.rep_value.from_date == undefined || this.rep_value.from_date == null ||
        this.rep_value.to_date == '' || this.rep_value.to_date == undefined || this.rep_value.to_date == null)
      {
        this.notification.showError('please select from date and to date')
        return
      }
      if(this.rep_value.from_date !=  '' && this.rep_value.to_date == ''){
        this.notification.showWarning("Please Select To Date")
        return false
      }
      if(this.rep_value.from_date ==  '' && this.rep_value.to_date != ''){
        this.notification.showWarning("Please Select From Date")
        return false
      }
    this.rep_value.from_date = this.datePipe.transform(this.rep_value.from_date, 'yyyy-MM-dd') != null ? this.datePipe.transform(this.rep_value.from_date, 'yyyy-MM-dd') : ""
    this.rep_value.to_date = this.datePipe.transform(this.rep_value.to_date, 'yyyy-MM-dd') != null ? this.datePipe.transform(this.rep_value.to_date, 'yyyy-MM-dd') : ""
    this.rep_value.branch = this.frmAPReportSummary?.value?.branch?.id ? this.frmAPReportSummary?.value?.branch?.id : ''
    this.rep_value.supplier_id = this.frmAPReportSummary?.value?.supplier_id?.id ? this.frmAPReportSummary?.value?.supplier_id?.id : ''
    for (let i in this.rep_value) 
      {
          if (this.rep_value[i] === null || this.rep_value[i] === "") {
            delete this.rep_value[i];
          }
        }    
      }
    else{
      this.rep_value={}
    }
    this.SpinnerService.show()
    if (page == 1) {
      this.pageIndex_rep = 0;
    }
    this.ecfservice.apRptSummarydownload(this.rep_value).subscribe((results) =>{
      if(results.status == 'success'){
         this.notification.showSuccess(results?.message)
         this.SpinnerService.hide()
         this.get_Summary(1)
         console.log('summary called')
      }
      else if(results.status == 'failed'){
        this.notification.showSuccess(results?.description)
        this.SpinnerService.hide()
        // this.get_Summary(1)
        // console.log('summary called')
     }
      else{
        this.notification.showError(results?.description)
        this.SpinnerService.hide()
      }
    },
  error =>{
    this.errorHandler.handleError(error)
    this.SpinnerService.hide()
  })
   
  }
generate_btn_disable: boolean = false
  get_Summary(page) {
    let data = {}
    this.ecfservice.getrepSummary(data, page, this.ap_report_sub_module_name).subscribe((results) => {
      if (results != undefined) {
        this.SpinnerService.hide()
        this.DooScoreSummary = results['data']
        this.startCountdown()
        if(results?.message){
          this.generate_btn_disable = true
          this.notification.showError(results?.message)
        }
        else{
          this.generate_btn_disable = false
        }
        this.Report_status = this.DooScoreSummary?.report_status
        let datapagination = results["pagination"];
        this.length_rep = datapagination?.count
        if (this.DooScoreSummary.length === 0) {
          this.isPaymentAdvicepage = false
        }
        if (this.DooScoreSummary.length > 0) {
          this.paymentAdvPresentPage = datapagination.index;
          this.has_reppagenext = datapagination.has_next;
          this.has_reppageprevious = datapagination.has_previous;
          this.presentpagerep = datapagination.index;
          // this.isPaymentAdvicepage = true
        }
        else {
          this.length_rep = 0;
          this.isPaymentAdvicepage = false
        }
      }

    },
      error => {
        this.errorHandler.handleError(error)
        this.SpinnerService.hide()
      })
  }

  length_rep = 0;
  pageIndex_rep = 0;
  pageSize_rep = 10;
  presentpagerep: number = 1
  handleReportSearchPageEvent(event: PageEvent) {
    this.length_rep = event.length;
    this.pageSize_rep = event.pageSize;
    this.pageIndex_rep = event.pageIndex;
    this.presentpagerep = event.pageIndex + 1;
    this.get_Summary(this.presentpagerep)

  }
  prevDooScoreSummary() {
    this.getDooScoresummary(this.currentpageDoo - 1)
  }
  nextDooScoreSummary() {
    this.getDooScoresummary(this.currentpageDoo + 1)
  }
  scrollLeft() {
    this.navTabs.nativeElement.scrollBy({ left: -200, behavior: "smooth" });
  }

  scrollRight() {
    this.navTabs.nativeElement.scrollBy({ left: 200, behavior: "smooth" });
  }
  setActiveTab(selectedSub: any) {
    console.log("Tab clicked:", selectedSub);
    this.AP_Sub_Menu_List.forEach(sub => sub.active = false);
    selectedSub.active = true;
    this.ECFAPSubModule(selectedSub);
  }

  ecfinward(edit) {
    let config: any = {
      style: '',
      icon: '',
      class: '',
      value: '',
      id: "",
      function: false
    };
    if (edit?.inwardstatus != 'Completed') {
      config = {
        style: { cursor: "pointer", color: "green" },
        icon: "edit",
        class: '',
        value: '',
        id: "ap-0063",
        function: true
      };
    }
    else {
      config = {
        style: { cursor: "pointer", color: "green" },
        icon: "visibility",
        class: ' ',
        value: '',
        function: true
      };
    }
    return config;
  }
 couriervalid(data) {
    let config: any = {
      value: "",
      headercolor:''
    };
    if(this.apinward_fields?.courier_id){
       config.headercolor='green'
    }
    if (data?.courier_id?.name) {
      config = {
        value: data.courier_id.name,
      };
    }
    return config;
  }
  awbnovalid(data) {
    let config: any = {
      value: "",
      // headercolor:''
    };
    //  if(this.apinward_fields?.awbno){
    //   config.headercolor='green'
    // }
    if (data?.awbno) {
      config.value =data?.awbno
    }
    return config;
  }
  apinward_fields: any;
  inward_no(data){
    let config:any={
      value:'',
      // headercolor:''
    };
    // if(this.apinward_fields?.inward_no){
    //   config.headercolor='green'
    // }
    if(data?.no){
      config.value = data?.no
    }
    return config
  }
  raiser_valid(data){
    let config:any={
      value:'',
      // headercolor:''
    };
    // if(this.apinward_fields?.created_by){
    //   config.headercolor='green'
    // }
    if(data?.raised_by){
      config.value =data?.raised_by.full_name
    }
    return config
  }
  channelvalid(data){
    let config:any={
      value:'',
      // headercolor:''
    };
    // if(this.apinward_fields?.channel_id){
    //   config.headercolor ='green'
    // }
    if(data?.channel_id){
      config.value=data?.channel_id.name
    }
    return config;
  }
 Summaryinwarddata = [
    { "columnname": "Inward No", "key": "no", headicon: true, headertype: 'headinput',payloadkey: "inward_no",label: "Inward No",clickFunction: this.apinwardsearch.bind(this),validate: true, validatefunction: this.inward_no.bind(this) },
    { "columnname": "Date", "key": "date", "type": 'Date', "datetype": "dd-MMM-yyyy",headicon:true,payloadkey_1:'fromdate',payloadkey_2 :'todate',
       label1:'Start Date',label2:'End Date',headertype: 'startendDate', dateformat: 'dd/MM/yyyy',clickFunction: this.apinwardsearch.bind(this) },
    { "columnname": "Channel", "key": "channel_id", "type": "Object", "objkey": "name",headicon:true, headerdicon: "filter_list",
      headertype: 'headoptiondropdown',payloadkey:'channel_id',
    inputobj:{
        label: "Channel",
        displaykey: "name",
        Outputkey: "id",
        fronentdata: true,
        data: this.Channels,
        formcontrolname:  'channel_id',
        valuekey: "id",
    },clickFunction: this.apinwardsearch.bind(this),validate: true, validatefunction: this.channelvalid.bind(this) },
    {
      "columnname": "Courier", "key": "courier_id", "type": "Object", "objkey": "name",headicon:true,headertype:'headdropdown',payloadkey: "courier_id",
      inputobj:{
        label: 'courier',
        searchkey: "query",
        displaykey: "name",
        formcontrolname:  'courier_id',
        url: this.inwardUrl + "mstserv/courier_search",
         Outputkey: "id",
         params: "",
      },clickFunction: this.apinwardsearch.bind(this), validate: true, validatefunction: this.couriervalid.bind(this),
    },
    { "columnname": "No of Packets", "key": "noofpockets" },
    { "columnname": "AWB No", "key": "awbno",headicon:true,headertype:'headinput',payloadkey:'awb_no',label:"AWB No",clickFunction: this.apinwardsearch.bind(this)   ,validate: true, validatefunction: this.awbnovalid.bind(this), },
    { "columnname": "Raiser Name", "key": "raised_by", "type": "Object", "objkey": "full_name",headicon :true,headertype:'headdropdown',payloadkey:"created_by",
      inputobj:{
        label: "Raiser Name",
        method: "get",
        url: this.ecfmodelurl + "usrserv/memosearchemp",
        params: "",
        searchkey: "query",
        displaykey: "full_name",
        formcontrolname:'raised_by',
        Outputkey: "id",
      },clickFunction: this.apinwardsearch.bind(this), validate: true, validatefunction: this.raiser_valid.bind(this),
     },
    { "columnname": "Status", "key": "inwardstatus" },
    {
      "columnname": "Action", "key": "edits", validate: true, button: true, function: true,
      clickfunction: this.editInwardMaker.bind(this), validatefunction: this.ecfinward.bind(this)
    },
  ]
  @ViewChild ('inwardSummary') inwardsummaryreset:any;
overallinward_reset(){
  console.log("Reset button clicked");
  if (this.inwardsummaryreset?.resetAllFilters) {
    this.inwardsummaryreset.resetAllFilters();
  }
  else {
      setTimeout(() => {
        if (this.inwardsummaryreset) {
          this.inwardsummaryreset.resetAllFilters();
        }
      });
    }
  }
  apinwardsearch(e) {
    this.apinward_fields = e
    console.log('this.apinward_fields---->',this.apinward_fields);
    this.SummaryApiinwardObjNew = {
        "method": "post",
        "url": this.ecfmodelurl + "inwdserv/apinward_summarysearch",
        params: "&submodule=" + this.ap_inward_sub_module_name,
        data: e,OverallCount: "Total Count"
      }
  }

  inwardrep: any;
  apinward_summary(e) {
    this.getInwardsummary('','',1)
    this.inwardrep = e
    this.SummaryApiinwardObjNew = {
      "method": "post",
      "url": this.ecfmodelurl + "inwdserv/apinward_summarysearch",
      params: "&submodule=" + this.ap_inward_sub_module_name,
      data: e,OverallCount: "Total Count"
    }
    // let data = {
    //   created_by: this.InwardsummarySearchForm.value.created_by.id,
    //   awb_no: this.InwardsummarySearchForm.value.awb_no,
    //   fromdate: this.InwardsummarySearchForm.value.fromdate = this.datePipe.transform(this.InwardsummarySearchForm.value.fromdate, 'yyyy-MM-dd') ? this.datePipe.transform(this.InwardsummarySearchForm.value.fromdate, 'yyyy-MM-dd') : "",
    //   todate: this.InwardsummarySearchForm.value.todate = this.datePipe.transform(this.InwardsummarySearchForm.value.todate, 'yyyy-MM-dd') ? this.datePipe.transform(this.InwardsummarySearchForm.value.todate, 'yyyy-MM-dd') : ""
    // }
    // let payloadbodydata = { ...data, ...e };
    // this.SummaryApiinwardObjNew = {
    //   "method": "post",
    //   "url": this.ecfmodelurl + "inwdserv/apinward_summarysearch",
    //   data: payloadbodydata
    // }
  }
  couriertype: any = {
    label: "Courier",
    searchkey: "query",
    displaykey: "name",
    url: this.inwardUrl + "mstserv/courier_search",
    Outputkey: "id",
    // wholedata: true,
    params: "",
    formcontrolname: 'courier',
  }
  raisers_name: any = {
    label: "Employee",
    method: "get",
    url: this.ecfmodelurl + "usrserv/memosearchemp",
    params: "",
    searchkey: "query",
    displaykey: "full_name",
    Outputkey: "id",
    // formkey: "id"
    id: "ap-0188",
    formcontrolname: "raiser_name",
  };
  raisers_names: any = {
    label: "Raiser Name",
    method: "get",
    url: this.ecfmodelurl + "usrserv/memosearchemp",
    params: "",
    searchkey: "query",
    displaykey: "full_name",
    Outputkey: "id",
    // formkey: "id"
    id: "ap-0056",
    formcontrolname: "created_by",
  };
  channeldropdown: any = {
    label: "Channel",
    fronentdata: true,
    data: this.Channels,
    displaykey: "name",
    Outputkey: "id",
    valuekey: "id"
  }
  applinkview(data) {
    this.linkView(data, "apapproverview")
    // this.commoninvoiceheader_view()
  }
  // SummaryapprovalData: any = [
  //   { columnname: "Invoice CR No", key: "apinvoiceheader_crno", function: true, clickfunction: this.applinkview.bind(this), "style": { color: " #3684bf", cursor: "pointer" }, },
  //   { columnname: "ECF Type", key: "aptype", type: "object", objkey: "text", },
  //   { columnname: "Supplier", key: "supplier_data", type: "object", objkey: "name", },
  //   { columnname: "Employee", key: "raiser_name" },
  //   { columnname: "Employee Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", },
  //   { columnname: "Invoice No", key: "invoice_no" },
  //   { columnname: "Invoice Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
  //   { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
  //   { columnname: "Ageing", key: "ageing" },
  //   { columnname: "Invoice Status", key: "apinvoicehdr_status", type: "object", objkey: "text" },
  //   { columnname: "Paymode", key: "paymode_fields",type: "object", objkey: "paymode_names"},
  //   { columnname: "Updated Date", key: "updated_date" },
  //   { columnname: "Inward Date", key: "inward_date" },
  //   { columnname: "Due Day's", key: "due_days" },
  // ]

  apapproval_data(data) {
    let config: any = {
      value: "",
    };
    if (data?.supplier_data?.name) {
      config = {
        value: data?.supplier_data?.name + "-" + data?.supplier_data?.code,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }

  apsupply_data(data) {
    let config: any = {
      value: "",
    };
    if (data?.supplier_data?.name) {
      config.value= data?.supplier_data?.name + "-" + data?.supplier_data?.code
    } else {
      config.value="-"
    }
    return config;
  }
  aptype_data(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
    if (this.globalpayload?.aptype) {
      config.headercolor= "green"
    }
     if(data?.aptype?.text) {
      config.value= data?.aptype?.text
    }
    return config;
  }
SummaryapprovalData: any 
//  = [

//      { columnname: "Invoice CR No", key: "apinvoiceheader_crno",payloadkey: "invoiceheader_crno","headicon": true, headertype: 'headinput',
//        label: "Invoice CR No", headerdicon: "filter_list", clickFunction: this.approvesearch.bind(this),inputicon: "search",
//        function: true, clickfunction: this.applinkview.bind(this), "style": { color: " #3684BF", cursor: "pointer" }, },
//      {columnname: "Invoice Type", key: "aptype",type: "object",objkey: "text",headicon: true, headerdicon: "filter_list", headertype: 'headoptiondropdown',payloadkey: "aptype",
//        inputobj: {
//        label: "Invoice Type",
//        searchkey: "query",
//        displaykey: "text",
//        url: this.ecfmodelurl + "ecfapserv/get_ecftype",
//        Outputkey: "id",
//        formcontrolname: "aptype",
//       },
//     validate: true, validatefunction: this.aptype_data.bind(this),function:true,
//     clickFunction: this.approvesearch.bind(this)
//     },
//       { columnname: "Supplier", key: "supplier_data", "headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
//           payloadkey: "supplier_id",
//           inputobj :{
//           label: "Supplier",
//           method: "get",
//           url: this.ecfmodelurl + "venserv/landlordbranch_list",
//           params: "",
//           searchkey: "query",
//           displaykey: "name",
//           Outputkey: "id",
//           formcontrolname: "supplier_id",
//         },
//           clickFunction: this.approvesearch.bind(this),function:true,
//           validate: true, validatefunction: this.apsupply_data.bind(this),
//         },

//    { columnname: "Raiser", key: "raiser_name","headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
//       payloadkey: "raiser_name",   
//       inputobj: {
//       label: "Raiser",
//       method: "get",
//       url: this.ecfmodelurl + "usrserv/memosearchemp",
//       params: "",
//       searchkey: "query",
//       displaykey: "full_name",
//       Outputkey: "id",
//       formcontrolname: "raiser_name",
//     },
//     clickFunction: this.approvesearch.bind(this),function:true,
//     // validate: true, validatefunction: this.apraiser_data.bind(this),
//      },
//          { columnname: "Raiser Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", "headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
//            payloadkey: "raiserbranch_id",   
//           inputobj:{
//            label: "Raiser Branch",
//            method: "get",
//            url: this.ecfmodelurl + "usrserv/search_branch",
//            params: "",
//            searchkey: "query",
//            displaykey: "name",
//            Outputkey: "id",
//            prefix: 'code',
//            separator: "hyphen",
//            formcontrolname: "raiserbranch_id",
//          },
//           clickFunction: this.approvesearch.bind(this),function:true,
//           // validate: true, validatefunction: this.apbranch_data.bind(this),
//          },
//     { columnname: "Invoice No", key: "invoice_no", payloadkey: "invoice_no", "headicon": true, headertype: 'headinput',
//      label: "Invoice No", headerdicon: "filter_list", clickFunction: this.approvesearch.bind(this), inputicon: "search",
//      validate: true, validatefunction: this.apinvoice_data.bind(this),
//     },

//       { columnname: "Invoice Amount", prefix: "₹",  key: "totalamount",type: 'Amount', headicon: true, headinput: true, headerdicon: "filter",
//       headertype: 'minmaxAmnt', payloadkey_1: "minamt",payloadkey_2: "maxamt",label1: "Min Amount",
//       label2: "Max Amount", clickFunction: this.approvesearch.bind(this),inputicon: "search",
//       // validate: true, validatefunction: this.apamount_data.bind(this),
//     },


//       { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy", "headicon": true, payloadkey_1: "from_date", payloadkey_2: "to_date",
//        label1: "Start Date",label2:"End Date", headerdicon: "date_range", headertype: 'startendDate', 
//        clickFunction: this.approvesearch.bind(this),
//       //  validate: true, validatefunction: this.apdate_data.bind(this), 
//       },

//        { columnname: "Inward Date", key: "inward_date", "type": 'Date', "datetype": "dd-MMM-yyyy", "headicon": true, payloadkey_1: "inwfrom_date", payloadkey_2: "inwto_date",
//        label1: "Start Date",label2:"End Date", headerdicon: "date_range", headertype: 'startendDate', 
//        clickFunction: this.approvesearch.bind(this),
//       //  validate: true, validatefunction: this.apinwarddate_data.bind(this),
//        },

//        { columnname: "Invoice Status", key: "apinvoicehdr_status", type: "object", objkey: "text",
//           headicon: true, headertype: 'headoptiondropdown', payloadkey: "apinvoiceheaderstatus_id",
//               inputobj: {
//                 label: "Invoice Status",
//                 fronentdata: true,
//                 data: this.apApprovalStatusList,
//                 displaykey: "text",
//                 Outputkey: "value",
//                 valuekey: "id",
//                 formcontrolname: "invoice_status"
//               },
//           clickFunction: this.approvesearch.bind(this)
//         },
  @ViewChild('approvalSummary') approvalsummaryBoxComponent: any;
overallreset_approval(){
    console.log("Reset button clicked");
    if (this.approvalsummaryBoxComponent) {
      this.approvalsummaryBoxComponent?.resetAllFilters();
    } else {
      setTimeout(() => {
        if (this.approvalsummaryBoxComponent) {
          this.approvalsummaryBoxComponent?.resetAllFilters();
        }
      });
    }
}
  apprep: any;
  approvesearch(e) {
    this.apprep = e
    this.SummaryApiapprovalObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
      params: "&summary_type=approver_summary" + "&submodule=" + this.ap_approver_sub_module_name,
      data: e,OverallCount: "Total Count"
    }
  }
  approvaltype: any = {
    label: "ECF Type",
    searchkey: "query",
    displaykey: "text",
    url: this.ecfmodelurl + "ecfapserv/get_ecftype",
    Outputkey: "id",
  }
  supplier_name: any = {
    label: "Supplier Name",
    searchkey: "query",
    displaykey: "name",
    url: this.ecfmodelurl + "venserv/landlordbranch_list",
    params: "&query=",
    Outputkey: "id",
    disabled: false,
  }

  Raiser_branch: any = {
    label: "Raiser Branch",
    method: "get",
    url: this.ecfmodelurl + "usrserv/search_branch",
    params: "",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
    prefix: 'code',
    separator: "hyphen",
    // suffix: 'limit',
    formcontrolname: "raiserbranch_id"
  };
  raises: any = {
    label: "Employee",
    method: "get",
    url: this.ecfmodelurl + "usrserv/memosearchemp",
    params: "",
    searchkey: "query",
    displaykey: "full_name",
    Outputkey: "id",
    id: "ap-0245",
    formcontrolname: "raiser_name",
  };
  // report_status: any = {
  //   label: "Report Status",
  //   fronentdata: true,
  //   data: this.reports,
  //   displaykey: "text",
  //   Outputkey: "id",
  //   valuekey: "id"
  // }
  approvalsearch: any = [
    { "type": "input", "label": "Invoice Header CR No", "formvalue": "invoiceheader_crno" },
    { "type": "dropdown", inputobj: this.approvaltype, "formvalue": "aptype" },
    { "type": "dropdown", inputobj: this.supplier_name, "formvalue": "supplier_id" },
    { "type": "dropdown", inputobj: this.Raiser_branch, "formvalue": "raiserbranch_id" },
    // { "type": "dropdown", inputobj: this.raises, "formvalue": "raiser_name" },
    // { "type": "input", "label": "Invoice No", "formvalue": "invoice_no" },
    // { "type": "input", "label": "Invoice Amount", "formvalue": "invoice_amount" },
    // { type: "dropdown", inputobj: this.report_status, formvalue: "apinvoiceheaderstatus_id" },
    // {
    //   type: "twodates",
    //   fromobj: { label: "From Date", formvalue: "from_date" },
    //   toobj: { label: "To Date", formvalue: "to_date" },
    // },



  ]
  suppliersearch: any = [
    { "type": "input", "label": "Supplier GST Number", "formvalue": "gstno" },
    { "type": "input", "label": "Supplier Code", "formvalue": "code" },
    { "type": "input", "label": "PAN Number", "formvalue": "panno" },
  ]
  choosesupplierdata(e) {
    this.ecfabs = e;
    console.log("event", e);
    this.getsuppView(this.ecfabs)
  }
  choosesupplierdata1(e) {
    this.ecfabs = e;
    console.log("event", e);
    this.getsuppView(this.ecfabs)
  }
  getsupplierpopup() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0044"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  view_entry(commonap) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      id: "",
      button: false,
      function: false,
      tooltipValue: ""
    };
    if (commonap?.apinvoicehdr_status?.id == 9 || commonap?.apinvoicehdr_status?.id == 13
      || commonap?.apinvoicehdr_status?.id == 15 || commonap?.apinvoicehdr_status?.id == 25 || commonap?.apinvoicehdr_status?.id == 14 || commonap?.apinvoicehdr_status?.id == 27 || commonap?.apinvoicehdr_status?.id == 28 ||
      commonap?.apinvoicehdr_status?.id == 29 || commonap?.apinvoicehdr_status?.id == 38 || commonap?.apinvoicehdr_status?.id == 39) {
      config = {
        style: { color: "green", cursor: "pointer" },
        tooltipValue: "View",
        icon: "visibility",
        disabled: false,
        function: true,
        button: true,
      }
    }
    else if (commonap?.apinvoicehdr_status?.id != 9 && commonap?.apinvoicehdr_status?.id != 13
      && commonap?.apinvoicehdr_status?.id != 15 && commonap?.apinvoicehdr_status?.id != 25 && commonap?.apinvoicehdr_status?.id != 14 && commonap?.apinvoicehdr_status?.id != 27 && commonap?.apinvoicehdr_status?.id != 28 &&
      commonap?.apinvoicehdr_status?.id != 29 && commonap?.apinvoicehdr_status?.id != 38 && commonap?.apinvoicehdr_status?.id != 39) {
      config = {
        disabled: true,
        style: { color: "black" },
        tooltipValue: "View",
        icon: "-",
        function: false,
        button: false,
      }
    }
    // else {
    //   config = {
    //     disabled: false,
    //     icon: "-",
    //     function: false
    //   }
    // }
    return config
  }
  ok_notok(data) {
    let config: any = {
      value: '',
    };
    if (data?.value.text == 'OK') {
      config = {
        value: 'OK',
      }
    }
    else if (data?.value.text == 'NOT_OK') {
      config = {
        value: 'NOT_OK',
      }
    }
    else {
      config = {
        value: 'NAP',
      }
    }
    return config
  }
  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0043"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  comlinkview(data) {
    this.linkView(data, "apcommon")
  }
  apcommon_data(data) {
    let config: any = {
      value: "",
      // headercolor: ""
    };
    // if (this.globalpayload?.supplier_id) {
    //   config.headercolor= "green"
    // }
    if (data?.supplier_data?.name) {
      config = {
        value: data?.supplier_data?.name + "-" + data?.supplier_data?.code,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }

  datas: any = [
    {
      "data": [],
      "id": 2,
      "text": "NON PO"
    },
    {
      "data": [],
      "id": 3,
      "text": "EMP REIMB"
    },
    {
      "data": [],
      "id": 4,
      "text": "ADVANCE"
    },
    {
      "data": [],
      "id": 13,
      "text": "PETTYCASH"
    },
    {
      "data": [],
      "id": 14,
      "text": "ICR"
    }
  ]
  // headerbutton:any=[{icon:"replay", reset: true}]
  SummarycommonData: any
  // = [
  //   { columnname: "CR No", key: "crno", headicon: true, headertype: 'headinput',payloadkey: "crno",label: "CR No",clickFunction: this.commonsearch.bind(this), validate: true, validatefunction: this.input_data.bind(this) },
  //   { columnname: "Invoice CR No", key: "apinvoiceheader_crno",headicon: true, headertype: 'headinput',payloadkey: "invoiceheader_crno",label: "Invoice CR No", function: true, clickfunction: this.comlinkview.bind(this),clickFunction: this.commonsearch.bind(this), "style": { color: " #3684BF", cursor: "pointer" },validate: true, validatefunction: this.invoice_crno.bind(this) },
  //   { columnname: "ECF Type", key: "aptype", type: "object", objkey: "text",headicon: true, headertype: 'headoptiondropdown',payloadkey: "aptype",
  //       inputobj: {
  //     label: "ECF Type",
  //     params: "",
  //     searchkey: "query",
  //     displaykey: "text",
  //     Outputkey: "id",
  //     fronentdata: true,
  //     data: this.datas,    
  //     valuekey: "id",
  //     formcontrolname: "aptype"
  //   },
  //     clickFunction: this.commonsearch.bind(this),validate: true, validatefunction: this.ecf_type_data.bind(this) },
  //   { columnname: "Supplier", key: "supplier_data", "headicon": true, headertype: 'headdropdown', payloadkey: "supplier_id",
  //     inputobj: {
  //       label: 'Supplier',
  //       method: 'get',
  //       url: this.ecfmodelurl + 'venserv/landlordbranch_list',
  //       params: '',
  //       searchkey: 'query',
  //       displaykey: 'name',
  //       formcontrolname: "supplier_id",
  //       Outputkey: "id",

  //     }, clickFunction: this.commonsearch.bind(this),
  //     validate: true, validatefunction: this.apcommon_data.bind(this), },
  //   // { columnname: "Supplier", key: "supplier_data", type: "object", objkey: "name", },
  //   { columnname: "Raiser", key: "raiser_name", "headicon": true, headertype: 'headdropdown',  payloadkey: "raiser_name",
  //      inputobj: {
  //       label: 'Raiser',
  //       method: 'get',
  //       url: this.ecfmodelurl + '/usrserv/memosearchemp',
  //       params: '',
  //       searchkey: 'query',
  //       displaykey: 'full_name',
  //       // formcontrolname:"supplier_id",
  //       Outputkey: "id",

  //     }, clickFunction: this.commonsearch.bind(this),
  //     validate: true, validatefunction: this.raiser_data.bind(this),
  //   },
  //   { columnname: "Raiser Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", "headicon": true, headertype: 'headdropdown',  payloadkey: "raiserbranch_id",
  //        inputobj: {
  //       label: 'Raiser Branch',
  //       method: 'get',
  //       url: this.ecfmodelurl + '/usrserv/search_branch',
  //       params: '',
  //       searchkey: 'query',
  //       displaykey: 'fullname',
  //       // formcontrolname:"supplier_id",
  //       Outputkey: "id",

  //     }, clickFunction: this.commonsearch.bind(this),
  //     validate: true, validatefunction: this.raiser_branch_data.bind(this),
  //   },
  //   { columnname: "Invoice No", key: "invoice_no", headicon: true, headertype: 'headinput',payloadkey: "invoice_no",
  //     label: "CR No",clickFunction: this.commonsearch.bind(this),
  //      validate: true, validatefunction: this.invoiceno_data.bind(this)  },
  //   { columnname: "Invoice Amount", key: "totalamount", "prefix": "₹", "type": 'Amount', headicon: true, headertype: 'minmaxAmnt',payloadkey: "invoice_amount",
  //     payloadkey_1: "minamt",payloadkey_2: "maxamt",common_key: {inv_amount: "inv_amount"},label1: "Min Amount",label2: "Max Amount",
  //     clickFunction: this.commonsearch.bind(this) },
  //   { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy",
  //      "headicon": true,headertype: 'startendDate', payloadkey_1: "start_date", payloadkey_2: "end_date",common_key:{ecf_date: "ecf_date"}, 
  //    label1: "Start Date",label2:"End Date",clickFunction: this.commonsearch.bind(this),
  //    },
  //   { columnname: "Invoice Status", key: "apinvoicehdr_status", type: "object", objkey: "text",
  //     headicon: true, headertype: 'headoptiondropdown',payloadkey: "aptype",
  //     inputobj: {
  //     label: "Invoice Status",
  //     params: "",
  //     searchkey: "query",
  //     displaykey: "text",
  //     Outputkey: "id",
  //     fronentdata: true,
  //     data: this.commonStatusList,    
  //     valuekey: "id",
  //     formcontrolname: "aptype"
  //   },validate: true, validatefunction: this.ecf_type_data.bind(this)
  //    },
  //   {
  //     columnname: "View Entry", "key": "view", validate: true, button: true, function: true,
  //     clickfunction: this.CommonViewEntry.bind(this), validatefunction: this.view_entry.bind(this)
  //   },
  //   {
  //     columnname: "Download Covernote", icon: "download", "style": { color: "green", cursor: "pointer" },
  //     button: true, function: true, clickfunction: this.coverNotedownload.bind(this),
  //   },
  //   {
  //     columnname: "Action",
  //     icon: "lock_open", "style": { color: "green", cursor: "pointer" },
  //     button: true, function: true,
  //     clickfunction: this.unlock.bind(this),
  //   },
  // ]
  globalpayload: any;

  invoice_cr_maker(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.invoiceheader_crno) {
    //   config.headercolor= "green"
    // }
    if (data?.apinvoiceheader_crno) {
      config.value = data?.apinvoiceheader_crno
    }
    return config;
  }
  input_data(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.crno) {
    //   config.headercolor= "green"
    // }
    if (data?.crno) {
      config.value = data?.crno
    }
    return config;
  }
  invoiceno_data(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.invoice_no) {
    //   config.headercolor= "green"
    // }
    if (data?.invoice_no) {
      config.value = data?.invoice_no
    }
    return config;
  }


  apmaker_sup_date(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.supplier_data) {
    //   config.headercolor= "green"
    // }
    if (data?.name) {
      config = {
        value: data?.name,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }
  invoiceno_amnt(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.minamt && this.globalpayload?.maxamt) {
    //   config.headercolor= "green"
    // }
    if (data?.totalamount) {
      config.value = data?.totalamount
    }
    return config;
  }
  invoiceno_date(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.start_date && this.globalpayload?.end_date) {
    //   config.headercolor= "green"
    // }
    if (data?.invoicedate) {
      config.value = formatDate(data.invoicedate, 'dd-MMM-yyyy', 'en-US')
    }
    return config;
  }
  invoicenomaker_date(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.from_date && this.globalpayload?.to_date) {
    //   config.headercolor= "green"
    // }
    if (data?.invoicedate) {
      config.value = formatDate(data.invoicedate, 'dd-MMM-yyyy', 'en-US')
    }
    return config;
  }
  inwardnomaker_date(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.inwfrom_date && this.globalpayload?.inwto_date) {
    //   config.headercolor= "green"
    // }
    if (data?.inward_date) {
      config.value = formatDate(data.inward_date, 'dd-MMM-yyyy', 'en-US')
    }
    return config;
  }
  invoice_crno(data) {
    let config: any = {
      value: "",
      // headercolor:"",
      function: false,
      clickfunction: ""
    };
    if (this.globalpayload?.apinvoiceheader_crno) {
      // config.headercolor= "green",
      config.function = true,
        config.clickfunction = this.comlinkview.bind(this),
        config.style = { color: " #3684BF", cursor: "pointer" }

    }
    if (data?.apinvoiceheader_crno) {
      config.value = data?.apinvoiceheader_crno
      config.function = true,
        config.clickfunction = this.comlinkview.bind(this),
        config.style = { color: " #3684BF", cursor: "pointer" }
    }
    return config;
  }
  invoice_crno_reject(data) {
    let config: any = {
      value: "",
      // headercolor:"",
      function: false,
      clickfunction: ""
    };
    if (this.globalpayload?.apinvoiceheader_crno) {
      // config.headercolor= "green",
      config.function = true,
        config.clickfunction = this.rejectdata.bind(this),
        config.style = { color: " #3684BF", cursor: "pointer" }

    }
    if (data?.apinvoiceheader_crno) {
      config.value = data?.apinvoiceheader_crno
      config.function = true,
        config.clickfunction = this.rejectdata.bind(this),
        config.style = { color: " #3684BF", cursor: "pointer" }
    }
    return config;
  }
  ecf_type_data(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.aptype) {
    //   config.headercolor= "green"
    // }
    if (data?.aptype) {
      config.value = data?.aptype?.text
    }
    return config;
  }
  invoice_type_data(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.invoice_status) {
    //   config.headercolor= "green"
    // }
    if (data?.apinvoicehdr_status) {
      config.value = data?.apinvoicehdr_status?.text
    }
    return config;
  }
  raiser_data(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.raiser_name) {
    //   config.headercolor= "green"
    // }
    if (data?.raiser_name) {
      config.value = data?.raiser_name
    }
    return config;
  }
  raiser_branch_data(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.raiserbranch_id) {
    //   config.headercolor= "green"
    // }
    if (data?.raiserbranch_branch) {
      config.value = data?.raiserbranch_branch?.name_code
    }
    return config;
  }
  raiser_branch__reject_data(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    // if (this.globalpayload?.raiserbranch_id) {
    //   config.headercolor= "green"
    // }
    if (data?.raiserbranch_branch) {
      config.value = data?.raiserbranch_branch?.name_code
    }
    return config;
  }
  SummaryviewentryData: any = [
    { columnname: "Type", key: "type" },
    { columnname: "GL No", key: "gl" },
    { columnname: "GL Description", key: "glnodescription" },
    { columnname: "Module", key: "module" },
    { columnname: "Entry Status", key: "entry_new_status" },
    { columnname: "Transaction Date", key: "transactiondate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Amount", key: "amount" },
    { columnname: "CBS Ref No", key: "ackrefno" }
  ]
  commontype: any = {
    label: "ECF Type",
    searchkey: "query",
    displaykey: "text",
    url: this.ecfmodelurl + "ecfapserv/get_ecftype",
    Outputkey: "id",
  }
  supply_name: any = {
    label: "Supplier Name",
    searchkey: "query",
    displaykey: "name",
    url: this.ecfmodelurl + "venserv/landlordbranch_list",
    params: "&query=",
    Outputkey: "id",
    disabled: false,
  }
  Raise_branch: any = {
    label: "Raiser Branch",
    method: "get",
    url: this.ecfmodelurl + "usrserv/search_branch",
    params: "",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
    prefix: 'code',
    separator: "hyphen"
    // suffix: 'limit',
  };
  raise_emp: any = {
    label: "Employee",
    method: "get",
    url: this.ecfmodelurl + "usrserv/memosearchemp",
    params: "",
    searchkey: "query",
    displaykey: "full_name",
    Outputkey: "id"
  };
  // rep_status: any = {
  //   label: "Report Status",
  //   fronentdata: true,
  //   data: this.ap_reports,
  //   displaykey: "text",
  //   Outputkey: "id",
  //   valuekey: "id"
  // }
  inv_status: any = {
    label: "Invoice Status",
    method: "get",
    url: this.ecfmodelurl + "ecfapserv/get_common_status",
    params: "",
    searchkey: "query",
    displaykey: "text",
    Outputkey: "id"
  };
  commonapsearch: any = [
    { "type": "input", "label": "CR No", "formvalue": "crno" },
    { "type": "input", "label": "Invoice Header CR No", "formvalue": "invoiceheader_crno" },
    { "type": "dropdown", inputobj: this.commontype, "formvalue": "aptype" },
    { "type": "dropdown", inputobj: this.supply_name, "formvalue": "supplier_id" },
    // { "type": "dropdown", inputobj: this.Raise_branch, "formvalue": "raiserbranch_id" },
    // { "type": "dropdown", inputobj: this.raise_emp, "formvalue": "raiser_name" },
    // { "type": "input", "label": "Invoice No", "formvalue": "invoice_no" },
    // { "type": "input", "label": "Invoice Amount", "formvalue": "invoice_amount" },
    // { type: "dropdown", inputobj: this.inv_status, formvalue: "invoice_status" },
    // { type: "dropdown", inputobj: this.rep_status, formvalue: "apinvoiceheaderstatus_id" },
    // {
    //   type: "twodates",
    //   fromobj: { label: "From Date", formvalue: "from_date", id: "ap-0339" },
    //   toobj: { label: "To Date", formvalue: "to_date", id: "ap-0340" },
    // },
  ]
  commonrep: any;
  commonsearch(e) {
    // if( e?.crno == '' || e?.crno == undefined || e?.crno == null){
    //   this.comlinkview(e)
    // }
    // else{
    console.log("Filter payload received:", e);
    this.commonrep = e
    this.globalpayload = e
    this.SummaryApicommonObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
      params: "&apflag=1"+ "&submodule=" + this.ap_common_sub_module_name,
      data: e,OverallCount: "Total Count"
    }
    // }
  }

  // SummarycommoninvoiceapData: any = [
  //   { columnname: "Invoice CR No", key: "apinvoiceheader_crno", function: true, clickfunction: this.linkView.bind(this), "style": { color: " #3684bf", cursor: "pointer" }, },
  //   { columnname: "ECF Type", key: "aptype", type: "object", objkey: "text", },
  //   { columnname: "ECF Date", key: "apdate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
  //   { columnname: "Batch No", key: "batch_no", validate: true, validatefunction: this.branchno_data.bind(this), },
  //   { columnname: "Batch Status", key: "batch_status", validate: true, validatefunction: this.status_data.bind(this), },
  //   { columnname: "Supplier", key: "supplier_data", validate: true, validatefunction: this.suppliers_data.bind(this), },
  //   { columnname: "Raiser", key: "raiser_name" },
  //   { columnname: "Raiser Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", },
  //   { columnname: "Invoice No", key: "invoice_no" },
  //   { columnname: "Invoice Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
  //   { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
  //   { "columnname": "GST No", "key": "supplier_data", "type": "object", "objkey": "gstno" },
  //   { columnname: "Invoice Status", key: "ap_status", type: "object", objkey: "text" },
  //   {
  //     columnname: "View Entry", key: "test", function: true,
  //     clickfunction: this.CommonViewEntry.bind(this),
  //     validate: true, validatefunction: this.view_etry.bind(this)
  //   },
  //   {
  //     columnname: "Download Covernote", icon: "download", "style": { color: "green", cursor: "pointer" },
  //     button: true, function: true, clickfunction: this.coverNotedownload.bind(this),
  //     validate: true, validatefunction: this.downloadcovernote.bind(this),
  //   }
  // ]

  pay_lists: any = {
    label: "Pay To",
    fronentdata: true,
    data: this.pays_list,
    displaykey: "text",
    Outputkey: "value",
    valuekey: "id"
  }
  Ra_branch: any = {
    label: "Raiser Branch",
    method: "get",
    url: this.ecfmodelurl + "usrserv/search_branch",
    params: "",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
    prefix: 'code',
    separator: "hyphen"
    // suffix: 'limit',
  };
  advancedsearch: any = [
    { type: "dropdown", inputobj: this.pay_lists, formvalue: "payto" },
    { "type": "dropdown", inputobj: this.Ra_branch, "formvalue": "raiserbranch_id" },
    {
      type: "twodates",
      fromobj: { label: "From Date", formvalue: "ppxheader_fromdate" },
      toobj: { label: "To Date", formvalue: "ppxheader_todate" },
    },
  ]
  adv_by(adv) {
    let config: any = {
      value: '',
    };
    if (adv?.Payto == 'E') {
      config = {
        value: "Employee",
      };
    } else if (adv?.Payto == 'S')
      config = {
        value: "SUPPLIER",
      };
    return config;
  }
  SummaryadvancedData: any = [
    { columnname: "Po No", key: "po_no" },
    { columnname: "Invoice CR No", key: "invoiceheader_crno" },
   {
      columnname: "Advance By", "key": "Payto", validate: true, validatefunction: this.adv_by.bind(this),
      headicon: true, headertype: 'headoptiondropdown', payloadkey: "payto",
      inputobj: {
              label: "Advance By",
              fronentdata: true,
              data: this.pays_list,
              displaykey: "text",
              Outputkey: "value",
              valuekey: "id",
              formcontrolname: "payto"
            },
      clickFunction: this.advancesearch.bind(this)
    },
    { columnname: "Branch Name and Code", key: "raiserbranch_name", headicon: true, headertype: 'headdropdown', payloadkey: "raiserbranch_id",
            inputobj: {
              label: "Raiser Branch",
              method: "get",
              url: this.ecfmodelurl + "usrserv/search_branch",
              params: "",
              searchkey: "query",
              displaykey: "codename",
              Outputkey: "id",
              formcontrolname: "raiserbranch_id"
              // prefix: 'code',
              // separator: "hyphen"
            },
      clickFunction: this.advancesearch.bind(this)
     },
    { columnname: "PPX Header Date", key: "ppxheader_date", "type": 'Date', "datetype": "dd-MMM-yyyy",
      "headicon": true, headertype: 'startendDate', payloadkey_1: "ppxheader_fromdate", payloadkey_2: "ppxheader_todate",
      label1: "From Date", label2: "To Date", clickFunction: this.advancesearch.bind(this),
     },
    { columnname: "Debit GL Number", key: "debit_glno" },
    { columnname: "PPX Header Amount", key: "ppxheader_amount", "prefix": "₹", "type": 'Amount',style: { "display": "flex", "justify-content": "end" } },
    { columnname: "Liquidation Amount", key: "ppxheader_liquidation_amt", "prefix": "₹", "type": 'Amount', style: { "display": "flex", "justify-content": "end" } },
    { columnname: "PPX Header Balance", key: "ppxheader_balance_amt", "prefix": "₹", "type": 'Amount', style: { "display": "flex", "justify-content": "end" } },

    { columnname: "Remarks", key: "remarks" },
  ]
  advancesearch(e) {
    this.SummaryApiadvancedObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/advance_summary",
      params: "&submodule=" + this.ap_advance_sub_module_name,
      data: e,OverallCount: "Total Count"
    }
  }
  addclick() {
    this.getauditadd();
  }
  getauditadd() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0041"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  Summaryauditdata: any = [
    { columnname: "Question", key: "question" },
    // { "columnname": "Action", "key": "edits", button: true, function: true, clickfunction: this.editAuditChklst.bind(this), icon: "edit", "style": { color: "green", cursor: "pointer" }, },
    // { "columnname": "", "key": "delete", button: true, function: true, clickfunction: this.deleteChklst.bind(this), icon: "delete", "style": { color: "black", cursor: "pointer" }, },

    {
      "columnname": "Action", "key": "active_inactive", button: true, icon: "wb_sunny",
      function: true, clickfunction: this.InactiveFunc.bind(this), "style": { color: "green", cursor: "pointer" },
    },
  ]

  InactiveFunc(data, status) {
    this.SpinnerService.show()
    this.ecfservice.ActiveInActive(data?.id, status).subscribe(result => {
      this.SpinnerService.hide()
      if (result?.status == 'Success') {
        this.notification.showSuccess(result?.message)
        this.getAuditChksummary()
      }
      else {
        this.notification.showError(result?.message)
      }
    },
      error => {
        this.SpinnerService.hide()
      })
  }
   addbuttonhide: boolean = false
  auditsummarydata(e){
     if(!e?.data){
      this.notification.showError(e?.message)
      this.addbuttonhide = true
    }
    else{
      this.addbuttonhide = false
    }
  }
  apfailedsummarydata(e){
     if(!e?.data){ 
      this.notification.showError(e?.message)
    }
  }
  auditysearch(e) {
    if (e.ecftype == '' || e.ecftype == null || e.ecftype == undefined) {
      e.ecftype = 0
    }
    this.searchecftype = e.ecftype
    this.SummaryApiauditObjNew = {
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/get_ecfauditchecklist/" + this.searchecftype,
      params: '&submodule=' + this.ap_aduit_sub_module_name,OverallCount: "Total Count"
    }
    // if (e && e.ecftype) {
    //   this.SummaryApiauditObjNew = {
    //     method: "get",
    //     url: this.ecfmodelurl + "ecfapserv/get_ecfauditchecklist/" + e.ecftype,
    //     params: e
    //   };
    // } else {
    //   this.SummaryApiauditObjNew = {
    //     method: "get",
    //     url: this.ecfmodelurl + "ecfapserv/get_ecfauditchecklist/" + this.searchecftype,
    //     params: ""
    //   };
    // }
  }
  SummaryviewData: any = [
    { columnname: "Type", key: "Type" },
    { columnname: "Status", key: "comments" },
    { columnname: "From Date", key: "created_date", "type": 'date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Remarks", key: "remarks" }, // tooltip for this  <td style="width: 255px;"><div style="width: 250px;overflow: hidden;"[matTooltip]="dtl.remarks" matTooltipClass="custom-tooltipnew">{{dtl.remarks}}</div></td>
    { columnname: "Employee Name", key: "from_user", type: "object", objkey: "name", suffix: "View Details", function: true, clickfunction: this.view.bind(this) },
    { columnname: "Approver Name ", key: "to_user", type: "object", objkey: "name", suffix: "View Details", function: true, clickfunction: this.viewto.bind(this) },
  ]
  SummaryApiviewObjNew: any;
  // view_summary() {
  //   this.SummaryApiviewObjNew = {
  //     FeSummary: true,
  //     data: this.viewtrnlist
  //   }
  // }
  SummaryObjmakerNew: any 
  // = {
  //   method: "post",
  //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
  //   data: {},
  //   params: "&summary_type=maker_summary",OverallCount: "Total Count"
  // };
  apinvoice_data(data) {
    let config: any = {
      value: "",
    };
    if (data?.supplier_data?.name) {
      config = {
        value: data?.supplier_data?.name + "-" + data?.supplier_data?.code,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }

  SummarymakerFiles: any
  // = [
  //   { columnname: "Invoice CR No", key: "apinvoiceheader_crno", headicon: true, headertype: 'headinput',payloadkey: "invoiceheader_crno",label: "Invoice CR No",clickFunction: this.makersumSearch.bind(this), validate: true, validatefunction: this.invoice_cr_maker.bind(this) },
  //   { columnname: "ECF Type", key: "aptype", type: "object", objkey: "text" ,
  //     headicon: true, headertype: 'headoptiondropdown',payloadkey: "aptype",
  //     inputobj: {
  //     label: "ECF Type",
  //     params: "",
  //     searchkey: "query",
  //     displaykey: "text",
  //     Outputkey: "id",
  //     fronentdata: true,
  //     data: this.datas,    
  //     valuekey: "id",
  //     formcontrolname: "aptype"
  //   },clickFunction: this.makersumSearch.bind(this), validate: true, validatefunction: this.ecf_type_data.bind(this) 
  //   },
  //   // {
  //   //   columnname: "Supplier Name",
  //   //   key: "supplier_data",
  //   //   type: "object",
  //   //   objkey: "name",
  //   // },
  //   { columnname: "Supplier", key: "supplier_data", validate: true, validatefunction: this.apinvoice_data.bind(this),
  //     "headicon": true, headertype: 'headdropdown', payloadkey: "supplier_id",  
  //     inputobj: {
  //       label: 'Supplier',
  //       method: 'get',
  //       url: this.ecfmodelurl + 'venserv/landlordbranch_list',
  //       params: '',
  //       searchkey: 'name',
  //       displaykey: 'name',
  //       formcontrolname: "supplier_id",
  //       Outputkey: "id",

  //     },clickFunction: this.makersumSearch.bind(this),
  //    },
  //   { columnname: "Raiser", key: "raiser_name","headicon": true, headertype: 'headdropdown',  payloadkey: "raiser_name",
  //      inputobj: {
  //       label: 'Raiser',
  //       method: 'get',
  //       url: this.ecfmodelurl + '/usrserv/memosearchemp',
  //       params: '',
  //       searchkey: 'query',
  //       displaykey: 'full_name',
  //       // formcontrolname:"supplier_id",
  //       Outputkey: "id",

  //     }, clickFunction: this.makersumSearch.bind(this),
  //     validate: true, validatefunction: this.raiser_data.bind(this),},
  //   // {
  //   //   columnname: "Employee Branch",
  //   //   key: "raiserbranch_branch",
  //   //   type: "object",
  //   //   objkey: "name",
  //   // },
  //   {
  //     columnname: "Raiser Branch",
  //     key: "raiserbranch_branch",
  //     type: "object",
  //     objkey: "name_code",
  //     "headicon": true, headertype: 'headdropdown',  payloadkey: "raiserbranch_id",
  //       inputobj: {
  //       label: 'Raiser Branch',
  //       method: 'get',
  //       url: this.ecfmodelurl + '/usrserv/search_branch',
  //       params: '',
  //       searchkey: 'query',
  //       displaykey: 'fullname',
  //       // formcontrolname:"supplier_id",
  //       Outputkey: "id",

  //     }, clickFunction: this.makersumSearch.bind(this),
  //     validate: true, validatefunction: this.raiser_branch_data.bind(this),
  //   },
  //   {
  //     columnname: "PO No",
  //     key: "raiser_name",
  //     validate: true,
  //     validatefunction: this.po_no_data.bind(this),
  //   },
  //   { columnname: "Invoice No", key: "invoice_no" },
  //   {
  //     columnname: "Invoice Amount",
  //     key: "totalamount",
  //     prefix: "₹",
  //     type: "Amount",
  //   },
  //   // {
  //   //   columnname: "Invoice Date",
  //   //   key: "invoicedate",
  //   //   validate: true,
  //   //   validatefunction: this.highlight.bind(this),
  //   // },
  //   {
  //     columnname: "Invoice Date",
  //     key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy",
  //   },
  //   {
  //     columnname: "Inward Date",
  //     key: "inward_date", "type": 'Date', "datetype": "dd-MMM-yyyy",
  //   },
  //   // {columnname: "Due Days",key: "due_days"},
  //   {
  //     columnname: "Invoice Status",
  //     key: "apinvoicehdr_status",
  //     type: "object",
  //     objkey: "text",
  //   },
  //   {
  //     columnname: "Barcode No",key: "barcode"},
  //   { columnname: "Ageing", key: "ageing" },
  //   {
  //     columnname: "Action",
  //     key: "arrow",
  //     icon: "arrow_forward",
  //     style: { cursor: "pointer", color: "black" },
  //     button: true,
  //     function: true,
  //     clickfunction: this.apmakerview.bind(this),
  //   },
  // ];

  po_no_data(data) {
    let config: any = {
      value: "",
    };

    if (data.aptype_id == 1) {
      config = {
        value: data.po_no,
      };
    } else if (data.aptype_id != 1) {
      config = {
        value: "-",
      };
    }
    return config;
  }

  highlight(data) {
    let config: any = {
      value: "",
    };

    if (data.highlight == "YES") {
      config = {
        value: "More than six month",
      };
    } else {
      config = {
        value: data.invoicedate,
      };
    }
    return config;
  }

  commonbranch: any = {
    label: "Raiser Branch",
    method: "get",
    url: this.ecfmodelurl + "usrserv/search_branch",
    params: "&query=",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
    prefix: 'code',
    separator: "hyphen"
    // suffix: 'limit',
  };
  supplierfield: any = {
    label: "Supplier Name",
    method: "get",
    url: this.ecfmodelurl + "venserv/landlordbranch_list",
    params: "",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
  };
  approverfield: any = {
    label: "Empolyee",
    method: "get",
    url: this.ecfmodelurl + "usrserv/memosearchemp",
    params: "",
    searchkey: "query",
    displaykey: "full_name",
    Outputkey: "id",
    formcontrolname: "raiser_name"
  };
  makerbutton: any = [
    {
      icon: "filter_list", "tooltip": "Show More",
      function: this.maker_filter.bind(this)
    },
    {
      function: this.apinvMakerRptDwnld.bind(this),
      icon: "download", "tooltip": "Report Download", id: "ap-0143"
    }
  ];
  makersearch: any = [
    {
      type: "input",
      label: "Invoice Header CR No",
      formvalue: "invoiceheader_crno", id: "ap-0130"
    },
    { type: "dropdown", inputobj: this.makerdroptype, formvalue: "aptype", id: "ap-0131" },
    {
      type: "dropdown",
      inputobj: this.supplierfield,
      formvalue: "supplier_id", id: "ap-0134"
    },
    {
      type: "dropdown",
      inputobj: this.commonbranch,
      formvalue: "raiserbranch_id", id: "ap-0135"
    },
    // {
    //   type: "dropdown",
    //   inputobj: this.approverfield,
    //   formvalue: "raiser_name", id: "ap-0136"
    // },
    // { type: "input", label: "Invoice No", formvalue: "invoice_no", id: "ap-0137" },
    // { type: "input", label: "Invoice Amount", formvalue: "invoice_amount", id: "ap-0138" },
    // {
    //   type: "dropdown",
    //   inputobj: this.makerstatusdroptype,
    //   formvalue: "invoice_status", id: "ap-0141"
    // },
    // {
    //   type: "dropdown",
    //   inputobj: this.statusdroptype,
    //   formvalue: "apinvoiceheaderstatus_id", id: "ap-0142"
    // },
    // {
    //   type: "twodates",
    //   fromobj: { label: "From Date", formvalue: "from_date", id: "ap-0139" },
    //   toobj: { label: "To Date", formvalue: "to_date", id: "ap-0140" },
    // },
  ];
    @ViewChild('makerSummary') makersummaryBoxComponent: any;
  overallreset_maker(){
        console.log("Reset button clicked");
    if (this.makersummaryBoxComponent) {
      this.makersummaryBoxComponent?.resetAllFilters();
    } else {
      setTimeout(() => {
        if (this.makersummaryBoxComponent) {
          this.makersummaryBoxComponent?.resetAllFilters();
        }
      });
    }
  }
    @ViewChild('failedSummary') failedsummaryBoxComponent: any;
  overallreset_failed(){
        console.log("Reset button clicked");
    if (this.failedsummaryBoxComponent) {
      this.failedsummaryBoxComponent?.resetAllFilters();
    } else {
      setTimeout(() => {
        if (this.failedsummaryBoxComponent) {
          this.failedsummaryBoxComponent?.resetAllFilters();
        }
      });
    }
  }
    @ViewChild('advanceSummary') advancesummaryBoxComponent: any;
  overallreset_advance(){
        console.log("Reset button clicked");
    if (this.advancesummaryBoxComponent) {
      this.advancesummaryBoxComponent?.resetAllFilters();
    } else {
      setTimeout(() => {
        if (this.advancesummaryBoxComponent) {
          this.advancesummaryBoxComponent?.resetAllFilters();
        }
      });
    }
  }
  makerep: any;
  makersumSearch(data) {
    this.makerep = data
    this.globalpayload = data
    console.log("Filter payload received:", data);
    this.SummaryObjmakerNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
      data: data,
      params: "&summary_type=maker_summary" + "&submodule=" + this.ap_maker_sub_module_name,OverallCount: "Total Count"
    };
  }

  apinwardsummarydata(e){
    if(!e?.data){
      this.notification.showError(e?.message)
    }
  }
  apmakersummarydata(e){
    if(!e?.data){
      this.notification.showError(e?.message)
    }
  }
  apapproversummarydata(e){
    if(!e?.data){
      this.notification.showError(e?.message)
    }
  }
  apcommonsummarydata(e){
    if(!e?.data){
      this.notification.showError(e?.message)
    }
  }
  apbouncesummarydata(e){
    if(!e?.data){
      this.notification.showError(e?.message)
    }
  }
  aprejectsummarydata(e){
    if(!e?.data){
      this.notification.showError(e?.message)
    }
  }
  apadvancesummarydata(e){
    if(!e?.data){
      this.notification.showError(e?.message)
    }
  }
  bouncesearch: any = [
    {
      type: "input",
      label: "Invoice Header CR No",
      formvalue: "invoiceheader_crno", id: "ap-0164"
    },
    { type: "dropdown", inputobj: this.makerdroptype, formvalue: "aptype", id: "ap-0166" },
    {
      type: "dropdown",
      inputobj: this.supplierfield,
      formvalue: "supplier_id", id: "ap-0168"
    },
    {
      type: "dropdown",
      inputobj: this.commonbranch,
      formvalue: "raiserbranch_id", id: "ap-0169"
    },
    // {
    //   type: "dropdown",
    //   inputobj: this.approverfield,
    //   formvalue: "raiser_name", id: "ap-0170"
    // },
    // { type: "input", label: "Invoice No", formvalue: "invoice_no", id: "ap-0173" },
    // { type: "input", label: "Invoice Amount", formvalue: "invoice_amount", id: "ap-0174" },
    // {
    //   type: "dropdown",
    //   inputobj: this.makerstatusdroptype,
    //   formvalue: "invoice_status", id: "ap-0177"
    // },
    // {
    //   type: "twodates",
    //   fromobj: { label: "From Date", formvalue: "from_date", id: "ap-0175" },
    //   toobj: { label: "To Date", formvalue: "to_date", id: "ap-0176" },
    // },
  ];
  bouncebutton: any = [
    {
      icon: "filter_list", "tooltip": "Show More",
      function: this.bounce_filter.bind(this)
    },
    {
      function: this.bounceRptDwnld.bind(this), icon: "download", "tooltip": "Report Download",
      id: "ap-0179"
    },
  ];
  bouncerep: any;
  // bouncesumSearch(data) {
  //   this.bouncerep = data
  //   this.SummaryObjbounceNew = {
  //     method: "post",
  //     url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
  //     data: data,
  //     params: "&summary_type=bounce_summary" + "&submodule=" + this.ap_bounce_sub_module_name,OverallCount: "Total Count"
  //   };
  // }

  SummaryObjbounceNew: any 
  // = {
  //   method: "post",
  //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
  //   data: {},
  //   params: "&summary_type=bounce_summary",OverallCount: "Total Count"
  // };
  bouncesummary(data) {
    this.linkView(data, "bounceview");
  }
  apbounce_data(data) {
    let config: any = {
      value: "",
    };
    if (data?.supplier_data?.name) {
      config = {
        value: data?.supplier_data?.name + "-" + data?.supplier_data?.code,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }

  bouncesummary_fields:any;
  bounce_invcrno(data){
    let config:any={
      value:'',
      function:'',
      clickfunction: '',
      style:''
      // headercolor:''
    };
    // if(this.bouncesummary_fields?.invoiceheader_crno){
    //   // config.headercolor='green'
    //   config.function= true,
    //   config.clickfunction = this.bouncesummary.bind(this)
    //   config.style = { cursor: "pointer", color: " #3684BF" }
    // }
    if(data?.apinvoiceheader_crno){
      config.value =data?.apinvoiceheader_crno
      config.function= true,
      config.clickfunction = this.bouncesummary.bind(this)
      config.style = { cursor: "pointer", color: " #3684BF" }
    }
    return config
  }
    bounce_ecfvalid(data){
    let config:any={
      value:'',
      headercolor:''
    };
    if(this.bouncesummary_fields?.aptype){
      config.headercolor ='green'
    }
    if(data?.aptype){
      config.value=data?.aptype?.text
    }
    return config;
  }
  bounce_invnovalid(data){
    let config:any={
      value:'',
      headercolor:''
    };
    if(this.bouncesummary_fields?.invoice_no){
      config.headercolor='green'
    }
    if(data?.invoice_no){
      config.value = data?.invoice_no
    }
    return config
  }
    bounce_raiserbrvalid(data){
      let config: any = {
      value: "",
      headercolor:''
    };
    if(this.bouncesummary_fields?.supplier_id){
       config.headercolor='green'
    }
    if (data?.raiserbranch_branch?.name_code) {
      config = {
        value: data.raiserbranch_branch.name_code,
      };
    }
    // else {
    //   config = {
    //     value: "-",
    //   };
    // }
    return config;
  }
   bounceraiser_valid(data){
    let config:any={
      value:'',
      headercolor:''
    };
    if(this.bouncesummary_fields?.raiser_name){
      config.headercolor='green'
    }
    if(data?.raiser_name){
      config.value =data?.raiser_name
    }
    return config
  }
@ViewChild('bounceSummary') bouncesummaryreset: any;
overallreset_bounce(){
  console.log("Reset button clicked");
  if (this.bouncesummaryreset) {
    this.bouncesummaryreset.resetAllFilters();
  }
  else {
      setTimeout(() => {
        if (this.bouncesummaryreset) {
          this.bouncesummaryreset.resetAllFilters();
        }
      });
    }
  }
  bouncesummary_search(e){
    this.bouncesummary_fields=e
    this.SummaryObjbounceNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
      data: e,
      params: "&summary_type=bounce_summary" + "&submodule=" + this.ap_bounce_sub_module_name,OverallCount: "Total Count"
    };
  }

SummarybounceFiles: any 
= [
    {
      columnname: "Invoice CR No",
      key: "apinvoiceheader_crno",
      // style: { cursor: "pointer", color: " #3684BF" },
      headicon:true,headertype:'headinput',payloadkey:'invoiceheader_crno',label:'Invoice CR No',
      function: true,
      clickfunction: this.bouncesummary.bind(this),
      clickFunction: this.bouncesummary_search.bind(this),
      validate:true,validatefunction:this.bounce_invcrno.bind(this),
    },
    { columnname: "Invoice Type", key: "aptype", type: "object", objkey: "text" ,
    headicon:true,headertype: 'headoptiondropdown',payloadkey:'aptype',
    inputobj:{
        label: "Invoice Type",
        displaykey: "text",
        Outputkey: "id",
        fronentdata: true,
        data: this.audits_list,
        valuekey: "id",
    },clickFunction: this.bouncesummary_search.bind(this),
    // validate: true, validatefunction: this.bounce_ecfvalid.bind(this),
    },
    { columnname: "Supplier Name", key: "supplier_data", validate: true, validatefunction: this.apbounce_data.bind(this),
      headicon:true,headertype:'headdropdown',payloadkey: "supplier_id",
      inputobj:{
        label: "Choose Supplier",
        method: "get",
        url: this.ecfmodelurl + "venserv/search_suppliername_ecf",
        params: "&sup_id=&name=",
        searchkey: "name",
        displaykey: "name",
        Outputkey: "id",
        // wholedata: true,
       // required: true,
       formcontrolname: "supplier_data",
       // id: "ap-0500"
      },
      clickFunction: this.bouncesummary_search.bind(this),
     },
    { columnname: "Raiser", key: "raiser_name",
      headicon :true,headertype:'headdropdown',payloadkey:"raiser_name",
      inputobj:{
        label: "Raiser Name",
        method: "get",
        url: this.ecfmodelurl + "usrserv/memosearchemp",
        params: "",
        searchkey: "query",
        displaykey: "full_name",
        Outputkey: "id",
        formcontrolname:'raiser_name'
      },clickFunction: this.bouncesummary_search.bind(this), validate: true, validatefunction: this.bounceraiser_valid.bind(this),
     },
    {
      columnname: "Raiser Branch",
      key: "raiserbranch_branch",
      type: "object",
      objkey: "name_code",
      headicon:true,headertype:'headdropdown',payloadkey: "raiserbranch_id",
      inputobj:{
        label: 'Raiser Branch',
        searchkey: "query",
        displaykey: "name",
        url: this.ecfmodelurl + "usrserv/search_branch",
        Outputkey: "id",
        prefix:"code",
        separator: "hyphen",
        formcontrolname:'raiserbranch_branch'
      },clickFunction: this.bouncesummary_search.bind(this), validate: true, validatefunction: this.bounce_raiserbrvalid.bind(this),
    },
    { columnname: "Invoice No", key: "invoice_no",
      headicon: true, headertype: 'headinput',payloadkey: "invoice_no",label: "Invoice No",
      clickFunction: this.bouncesummary_search.bind(this),validate: true, validatefunction: this.bounce_invnovalid.bind(this)     },
    {
      columnname: "Invoice Amount",
      key: "totalamount",
      prefix: "₹",
      type: "Amount",
      headicon:true,headinput: true, headerdicon: "filter",headertype: 'minmaxAmnt',
      payloadkey_1:'minamt',payloadkey_2:'maxamt',label1:'Min Amount',label2:'Max Amount',
      clickFunction: this.bouncesummary_search.bind(this),
      style: { "display": "flex", "justify-content": "end" }
    },
    {
      columnname: "Invoice Date",
      key: "invoicedate",
      type: "Date",
      datetype: "dd-MMM-yyyy",
      headicon:true,headinput: true,headertype: 'startendDate',
      payloadkey_1:'from_date',payloadkey_2 :'to_date', label1:'Start Date',label2:'End Date',
      clickFunction: this.bouncesummary_search.bind(this)
    },
    {
      columnname: "Updated Date",
      key: "updated_date",
      type: "Date",
      datetype: "dd-MMM-yyyy",
    },
    { columnname: "Ageing", key: "ageing" },
    {
      columnname: "Invoice Status",
      key: "apinvoicehdr_status",
      type: "object",
      objkey: "text",
    },
  ];

  //...............reject..................//

  // rejectsearch: any = [{
  //   type: "input",
  //   label: "Invoice Header CR No",
  //   formvalue: "invoiceheader_crno",
  //   id: "ap-0182"
  // }, { type: "dropdown", inputobj: this.makerdroptype, formvalue: "aptype", id: "ap-0184" },
  // {
  //   type: "dropdown",
  //   inputobj: this.supplierfield,
  //   formvalue: "supplier_id", id: "ap-0186"
  // },
  // {
  //   type: "dropdown",
  //   inputobj: this.commonbranch,
  //   formvalue: "raiser_name", id: "ap-0187"
  // },
  //   // {
  //   //   type: "dropdown",
  //   //   inputobj: this.approverfield,
  //   //   formvalue: "raiser_name", id: "ap-0188"
  //   // },
  //   // { type: "input", label: "Invoice No", formvalue: "invoice_no", id: "ap-0189" },
  //   // { type: "input", label: "Invoice Amount", formvalue: "invoice_amount", id: "ap-0190" }
  // ]
  @ViewChild('rejectSummary') rejectsummaryBoxComponent: any;
  overallreset_reject(){
        console.log("Reset button clicked");
    if (this.rejectsummaryBoxComponent) {
      this.rejectsummaryBoxComponent?.resetAllFilters();
    } else {
      setTimeout(() => {
        if (this.rejectsummaryBoxComponent) {
          this.rejectsummaryBoxComponent?.resetAllFilters();
        }
      });
    }
  }
  rejectsumSearch(rej) {
    this.globalpayload = rej
    console.log("Filter payload received:", rej);
    this.SummaryObjrejectNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
      data: rej,
      params: "&summary_type=rejected_summary" + "&submodule=" + this.ap_reject_sub_module_name,OverallCount: "Total Count"
    };
  }

  SummaryObjrejectNew: any 
  // = {
  //   method: "post",
  //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
  //   data: {},
  //   params: "&summary_type=rejected_summary",OverallCount: "Total Count"
  // };
  rejectdata(data) {
    this.linkView(data, "aprejectview")
  }
  apreject_data(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    if (data?.supplier_data?.name) {
      config = {
        value: data?.supplier_data?.name + "-" + data?.supplier_data?.code,
        // headercolor: "green"
      };
    } else {
      config = {
        value: "-",
        // headercolor:"green"
      };
    }
    return config;
  }
  SummaryrejectFiles: any
  //  = [
  //   {
  //     columnname: "Invoice CR No",
  //     key: "apinvoiceheader_crno",
  //     style: { cursor: "pointer", color: "#3684bf" },
  //     function: true,
  //     clickfunction: this.rejectdata.bind(this),
  //   },
  //   { columnname: "ECF Type", key: "aptype", type: "object", objkey: "text" },
  //   // {
  //   //   columnname: "Supplier",
  //   //   key: "supplier_data",
  //   //   type: "object",
  //   //   objkey: "name_code",
  //   // },
  //   { columnname: "Supplier", key: "supplier_data", validate: true, validatefunction: this.apreject_data.bind(this), },
  //   { columnname: "Employee", key: "raiser_name" },
  //   {
  //     columnname: "Employee Branch",
  //     key: "raiserbranch_branch",
  //     type: "object",
  //     objkey: "name_code",
  //   },
  //   { columnname: "Invoice No", key: "invoice_no" },
  //   {
  //     columnname: "Invoice Amount",
  //     key: "totalamount",
  //     prefix: "₹",
  //     type: "Amount",
  //   },
  //   {
  //     columnname: "Invoice Date",
  //     key: "invoicedate",
  //     type: "Date",
  //     datetype: "dd-MMM-yyyy",
  //   },
  //   { columnname: "Ageing", key: "ageing" },
  //   {
  //     columnname: "Invoice Status",
  //     key: "apinvoicehdr_status",
  //     type: "object",
  //     objkey: "text",
  //   },
  //   {
  //     columnname: "Action",
  //     key: "apinvoicehdr_status_id",
  //     validate: true,
  //     button: true,
  //     function: true,
  //     clickfunction: this.actionreject.bind(this),
  //     validatefunction: this.rejectvalid.bind(this),
  //   },
  //   ];

  rejectvalid(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
      id: "",
      tooltipValue: ""
    };

    if (data?.apinvoicehdr_status_id == 40) {
      config = {
        disabled: false,
        style: "",
        tooltipValue: "View",
        icon: "arrow_forward",
        class: "",
        value: "",
        function: true,
        id: "ap-0194"
      };
    } else if (data?.apinvoicehdr_status_id != 40) {
      config = {
        disabled: false,
        style: "",
        tooltipValue: "View",
        icon: "arrow_forward",
        class: "",
        value: "",
        function: true,
        id: "ap-0195"
      };
    }
    return config;
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0004"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  apinvoicehdr_popuopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0005"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  actionreject(data) {
    if (data?.apinvoicehdr_status_id == 40) {
      this.apinvoicehdr_popuopen()
      this.ecfservice.getdispatchdetails(data.id).subscribe((result) => {
        let res = result;
        this.dispatchdet = res;
        if (this.dispatchdet?.status == "Falied") {
          this.notification.showError(this.dispatchdet?.message);
          this.closeview.nativeElement.click();
        } else if (res["dispatch_mode"]["text"] == "COURIER") {
          this.dispatchviewForm.controls["mode"].setValue(
            res["dispatch_mode"]["text"]
          );
          this.dispatchviewForm.controls["date"].setValue(
            this.datePipe.transform(res["dispatch_date"], "dd-MMM-yyyy")
          );
          this.dispatchviewForm.controls["courier"].setValue(
            res["courier"]["name"]
          );
          this.dispatchviewForm.controls["awbno"].setValue(
            res["dispatch_awbno"]
          );
          this.dispatchviewForm.controls["name"].setValue(res["dispatch_to"]);
          this.dispatchviewForm.controls["address"].setValue(
            res["address"]["line1"]
          );
          this.dispatchviewForm.controls["city"].setValue(
            res["address"]["city_id"]["name"]
          );
          this.dispatchviewForm.controls["district"].setValue(
            res["address"]["district_id"]["name"]
          );
          this.dispatchviewForm.controls["state"].setValue(
            res["address"]["state_id"]["name"]
          );
          this.dispatchviewForm.controls["pincode"].setValue(
            res["address"]["pincode_id"]["no"]
          );
          this.dispatchviewForm.controls["remarks"].setValue(res["remarks"]);
        } else if (res["dispatch_mode"]["text"] == "DIRECT") {
          this.dispatchviewForm.controls["mode"].setValue(
            res["dispatch_mode"]["text"]
          );
          this.dispatchviewForm.controls["date"].setValue(
            this.datePipe.transform(res["dispatch_date"], "dd-MMM-yyyy")
          );
          this.dispatchviewForm.controls["name"].setValue(res["dispatch_to"]);
          this.dispatchviewForm.controls["remarks"].setValue(res["remarks"]);
        }
      });
    } else if (data?.apinvoicehdr_status_id != 40) {
      this.popupopen()
      this.apinvHeader_id = data.id;
      console.log("actionreject ------", this.apinvHeader_id)
      this.reject_empname = data.raiser_name;
      this.reject_empaddress = data.raiserbranch_branch?.address;
      let add = data.raiserbranch_branch?.address;
      this.rejectChgStatForm.controls["name"].setValue(data.raiser_name);
      this.rejectChgStatForm.controls["address"].setValue(add?.line1);
      this.rejectChgStatForm.controls["city"].setValue(add?.city?.name);
      this.rejectChgStatForm.controls["district"].setValue(add?.district?.name);
      this.rejectChgStatForm.controls["state"].setValue(add?.state?.name);
      this.rejectChgStatForm.controls["pincode"].setValue(add?.pincode?.no);
      this.ecfservice.getDispatchMode().subscribe((result) => {
        this.rejectmodeList = result.data;
      });

      this.ecfservice.getCourierDrop("", 1).subscribe((result) => {
        this.courierlist = result.data;
      });

      this.rejectChgStatForm
        .get("courier")
        .valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log("inside tap");
          }),
          switchMap((value) =>
            this.ecfservice.getCourierDrop(value, 1).pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
          )
        )
        .subscribe(
          (results: any[]) => {
            let datas = results["data"];
            this.courierlist = datas;
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
    }
  }
  popupopen5() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0026"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popup() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0037"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  view_trans() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0014"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  audichecklist() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0021"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  audit() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0019"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  dedupe() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0018"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  getliquid_det() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0016"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  rejectbutton: any = [
    { icon: "arrow_upward", "tooltip": "Select Supplier", function: this.getsupplierpopup.bind(this), id: "ap-0185" }
  ];
  SummaryApiattachedFileObjNew: any;
  SummaryattachedFileData: any = [
    { columnname: "File Name", key: "file_name", tooltip: true },
    {
      columnname: "View", icon: "open_in_new",
      "style": { color: "blue", cursor: "pointer" },
      button: true, function: true,
      clickfunction: this.data1.bind(this)
    },
    {
      columnname: "Download", icon: "download",
      "style": { color: "green", cursor: "pointer" },
      button: true, function: true,
      clickfunction: this.getfiles.bind(this)
    }
  ]

  attachs_summary() {
    this.SummaryApiattachedFileObjNew = {
      FeSummary: true,
      data: this.attachedFiles_value
    }
  }
  SummaryApiauditchecklistviewObjNew: any;
  SummaryauditchecklistviewData: any = [
    { columnname: "Question", key: "question" },
    { columnname: "OK/NOT-OK", key: "ok", validate: true, validatefunction: this.ok_notok.bind(this), },
  ]

  auditchecklistsummary() {
    this.audit()
    this.checkInvID = this.apinvHeader_id
    this.checklist = []
    this.checkinvdate = this.datePipe.transform(this.headerdata[0].invoicedate, 'yyyy-MM-dd')
    this.SummaryApiauditchecklistviewObjNew = {
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/get_bounceauditchecklist/" + this.checkInvID,

    }
  }
  attachpopup() {
    this.bounceview();
  }
  bounceview() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0038"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  addsclick() {
    this.popupopen10()
  }
  popupopen10() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("approverreject"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  bounceApprovePopup(text) {
    if (text == 'reg') {
      this.submit_btn = 1
      this.popup_heading = 'Reject'
    }
    else if (text == 'rep') {
      this.submit_btn = 2
      this.popup_heading = 'ReProcess'
    }
    this.popupopen10()
  }
  approval_filter() {
    this.expand_inward = !this.expand_inward
  }
  approval_close() {
    this.expand_inward = false
    this.InwardsummarySearchForm.controls['awb_no'].reset(""),
      this.InwardsummarySearchForm.controls['created_by'].reset(""),
      this.InwardsummarySearchForm.controls['fromdate'].reset(""),
      this.InwardsummarySearchForm.controls['todate'].reset("")
  }
  inward_reset() {
    this.InwardsummarySearchForm.controls['awb_no'].reset(""),
      this.InwardsummarySearchForm.controls['created_by'].reset(""),
      this.InwardsummarySearchForm.controls['fromdate'].reset(""),
      this.InwardsummarySearchForm.controls['todate'].reset("")
    // this.SummaryApiinwardObjNew = {
    //   "method": "post",
    //   "url": this.ecfmodelurl + "inwdserv/apinward_summarysearch",
    //   body: {},OverallCount: "Total Count"
    // }
  }
  popupopen11() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0049"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  SummaryviewfailedData: any = [
    { columnname: "Type", key: "type" },
    { columnname: "GL No", key: "gl" },
    { columnname: "GL Description", key: "glnodescription" },
    { columnname: "Module", key: "module" },
    { columnname: "Entry Status", key: "entry_new_status" },
    { columnname: "Transaction Date", key: "transactiondate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Amount", key: "amount" },
    { columnname: "CBS Ref No", key: "ackrefno" },
    // {
    //   columnname: "Error", key: "view", icon: "visibility",
    //   style: { cursor: "pointer", color: "green" },
    //   button: true, function: true, clickfunction: this.viewEntryError.bind(this),
    // },
  ]
  popupopen12() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("Errorview"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  popupopen13() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0013"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  apfailedarrow(right) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      id: "",
      button: false,
      function: false,
      tooltipValue: "",

    };
    if (right?.apinvoicehdr_status?.id != 13 || right?.pinvoicehdr_status?.id != 25) {
      config = {
        disabled: false,
        tooltipValue: "Change Status",
        style: { cursor: "pointer", color: "black" },
        icon: 'arrow_forward',
        class: '',
        value: '',
        button: true,
        function: true
      };
    }
    else if (right?.apinvoicehdr_status?.id != 13 && right?.apinvoicehdr_status?.id != 25) {
      config = {
        disabled: true,
        style: { cursor: "pointer", color: "yellow" },
        tooltipValue: "Change Status",
        icon: 'arrow_forward',
        class: '',
        value: '',
        button: false,
        function: false
      };
    }
    return config;
  }

  apfailed_data(data) {
    let config: any = {
      value: "",
      // headercolor:""
    };
    //  if (this.globalpayload?.supplier_id) {
    //   config.headercolor= "green"
    // }
    if (data?.supplier_data?.name) {
      config = {
        value: data?.supplier_data?.name + "-" + data?.supplier_data?.code,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }
  SummaryfailedData: any
  // = [{ columnname: "Invoice CR No", key: "apinvoiceheader_crno" },
  // { columnname: "ECF Type", key: "aptype", "type": "object", "objkey": "text" },
  // { columnname: "Supplier Name", key: "supplier_data", "type": "object", "objkey": "name" },
  // // { columnname: "Supplier", key: "supplier_data", validate: true, validatefunction: this.apfailed_data.bind(this), },
  // { columnname: "Employee", key: "raiser_name" },
  // { columnname: "Employee Branch", key: "raiserbranch_branch", "type": "object", "objkey": "name_code" },
  // { columnname: "Invoice No", key: "invoice_no" },
  // { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
  // { columnname: "Invoice Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
  // { columnname: "Invoice Status", key: "apinvoicehdr_status", "type": "object", "objkey": "text" },
  // {
  //   columnname: "View Entry", key: "view", function: true, button: true, icon: "visibility", "style": { color: "green", cursor: "pointer" },
  //   clickfunction: this.failedViewEntry.bind(this)
  // },
  // // {
  // //   columnname: "Change Status", key: "status", function: true, button: true, icon: "arrow_forward", "style": { color: "black", cursor: "pointer" },
  // //   clickfunction: this.failedChangeStat.bind(this), validatefunction: this.ecfinward.bind(this)
  // // },
  // {columnname: "Change Status", key: "status", function: true, button: true,
  //   clickfunction: this.failedChangeStat.bind(this), validate: true, validatefunction: this.apfailedarrow.bind(this)},
  // {
  //   columnname: "Repush", key: "repush", function: true, button: true, icon: "refresh", "style": { color: "blue", cursor: "pointer" },
  //   clickfunction: this.Repushcall.bind(this), validatefunction: this.ecfinward.bind(this)
  // }
  // ]
  SummaryfailedObjNew: any
  failedsummary() {
    // this.searchfailedTransData["apinvoiceheaderstatus_id"] = "26"
    this.searchfailedTransData =
    {
      "apinvoiceheaderstatus_id": "26",
    }
    this.SummaryfailedObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
      params: "&apflag=1",
      data: this.searchfailedTransData,OverallCount: "Total Count"
    }
    console.log("searchfailedTransData--initial", this.searchfailedTransData)
  }
  failedvalidate(data) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      id: "",
      function: false
    };
    if (data?.apinvoicehdr_status?.id != 13 && data?.apinvoicehdr_status?.id != 25) {
      config = {
        disabled: true,
        style: { color: "grey", cursor: "pointer" },
        icon: "arrow_forward",
        class: '',
        value: '',
        id: "",
        function: false
      }
    }
    return config
  }
  faildpopup() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0033"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  faildpopup2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ap-0035"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  failedsearch: any = [
    {
      type: "input",
      label: "Invoice Header CR No",
      formvalue: "invoiceheader_crno", id: "ap-0257"
    },
    {
      type: "input",
      label: "Invoice No",
      formvalue: "invoice_no", id: "ap-0257"
    },
    { type: "dropdown", inputobj: this.approvaltype, formvalue: "aptype", id: "ap-0131" },
    {
      type: "input",
      label: "Employee",
      formvalue: "raiser_name", id: "ap-0257"
    },
    // {
    //   type: "input",
    //   label: "Invoice Amount",
    //   formvalue: "invoice_amount", id: "ap-0257"
    // },
    // {
    //   type: "input",
    //   label: "Minimum Amount",
    //   formvalue: "minamt", id: "ap-0257"
    // },
    // {
    //   type: "input",
    //   label: "Maximum Amount",
    //   formvalue: "maxamt", id: "ap-0257"
    // },
    // { type: "dropdown", inputobj: this.Raiser_branch, formvalue: "raiser_name", id: "ap-0131" },
  ]
  failedsearchfun(failed) {
    this.globalpayload = failed || {}; // Ensure it's always at least an object
    console.log("Filter payload received:", failed);
    // if (failed && Object.keys(failed).length > 0) {
    //   failed["apinvoiceheaderstatus_id"] = "26";
    // }

    this.globalpayload["apinvoiceheaderstatus_id"] = "26"; // Always add
    this.SummaryfailedObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
      params: "submodule=" + this.ap_failed_sub_module_name,
      data: this.globalpayload,OverallCount: "Total Count"
    }
  }

  commonsummarysearchs(common) {
    let searchInward = this.commonForm.value
    // if (searchInward.from_date !== null || searchInward.to_date === null) {
    //   this.notification.showError("Please enter 'To date' ")
    //   return false
    // }
    // else if (searchInward.to_date !== null || searchInward.from_date === null ) {
    //   this.notification.showError("Please enter 'From date' ")
    //   return false
    // }
    if (searchInward.from_date != '' && searchInward.from_date != null && searchInward.from_date != undefined) {
      searchInward.from_date = this.datePipe.transform(searchInward.from_date, 'yyyy-MM-dd')
      searchInward.to_date = this.datePipe.transform(searchInward.to_date, 'yyyy-MM-dd')
    }
    if ((searchInward.created_by != '' && searchInward.created_by != null && searchInward.created_by != undefined)) {
      if (typeof (searchInward.created_by) == 'object')
        searchInward.created_by = searchInward.created_by.id
    }
    for (let i in searchInward) {
      if (searchInward[i] === null || searchInward[i] === "") {
        delete searchInward[i];
      }
    }
    console.log("search inward data", searchInward)
    // if (hint == 'next') {
    //   this.serviceCallInwardSummary(searchInward, this.currentpageinw + 1, 10)
    // }
    // else if (hint == 'previous') {
    //   this.serviceCallInwardSummary(searchInward, this.currentpageinw - 1, 10)
    // }
    // else {
    //   this.serviceCallInwardSummary(searchInward, 1, 10)
    // }
    // this.SummaryApicommonObjNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
    //   params: "&apflag=1",
    //   data: searchInward,OverallCount: "Total Count"
    // }
    this.expand_Common = false
  }
  // common_Raise_branch: any = {
  //   label: "Raiser Branch",
  //   method: "get",
  //   url: this.ecfmodelurl + "usrserv/search_branch",
  //   params: "",
  //   searchkey: "query",
  //   displaykey: "name",
  //   Outputkey: "id",
  //   valuekey: "id",
  //   formkey: "id",
  //   prefix: 'code',
  //   formcontrolname: "raiserbranch_id",
  //   separator: "hyphen"
  //   // suffix: 'limit',
  // };
  // common_raise_emp: any = {
  //   label: "Employee",
  //   method: "get",
  //   url: this.ecfmodelurl + "usrserv/memosearchemp",
  //   params: "",
  //   searchkey: "query",
  //   formcontrolname: "raiser_name",
  //   displaykey: "full_name",
  //   Outputkey: "id",
  //   valuekey: "id",
  //   formkey: "id",
  // };
  common_frtodate: any = {
    fromobj: { label: "From Date", formvalue: "from_date", id: "ap-0339", "formcontrolname": "from_date" },
    toobj: { label: "To Date", formvalue: "to_date", id: "ap-0340", "formcontrolname": "to_date" },
  };

  common_filter() {
    this.expand_Common = !this.expand_Common
  }

  common_close() {
    this.expand_Common = false
    this.commonForm.controls['apinvoiceheaderstatus_id'].reset(""),
      this.commonForm.controls['invoice_amount'].reset(""),
      this.commonForm.controls['from_date'].reset(""),
      this.commonForm.controls['to_date'].reset(""),
      this.commonForm.controls['invoice_no'].reset(""),
      this.commonForm.controls['raiserbranch_id'].reset(""),
      this.commonForm.controls['raiser_name'].reset(""),
      this.commonForm.controls['invoice_status'].reset("")
  }

  reject_filter() {
    this.expand_Reject = !this.expand_Reject
  }
  reject_close() {
    this.expand_Reject = false
    this.aprejectform.controls['raiser_name'].reset(""),
      this.aprejectform.controls['invoice_no'].reset("")
    this.aprejectform.controls['invoice_amount'].reset("")
  }
  bounce_filter() {
    this.expand_Bounce = !this.expand_Bounce
  }
  bounce_close() {
    this.expand_Bounce = false
    this.apInvapprovalsummaryform.controls['raiser_name'].reset(""),
      this.apbounceform.controls['invoice_no'].reset(""),
      this.apbounceform.controls['invoice_amount'].reset(""),
      this.apbounceform.controls['from_date'].reset(""),
      this.apbounceform.controls['to_date'].reset(""),
      this.apbounceform.controls['apinvoiceheaderstatus_id'].reset("")
  }
  ap_filter() {
    this.expand_approval = !this.expand_approval
  }
  ap_close() {
    this.expand_approval = false
    this.apInvapprovalsummaryform.controls['to_date'].reset(""),
      this.apInvapprovalsummaryform.controls['from_date'].reset(""),
      this.apInvapprovalsummaryform.controls['invoice_amount'].reset(""),
      this.apInvapprovalsummaryform.controls['invoice_no'].reset(""),
      this.apInvapprovalsummaryform.controls['raiser_name'].reset(""),
      this.apInvapprovalsummaryform.controls['apinvoiceheaderstatus_id'].reset("")
  }
  maker_filter() {
    this.expand_InvMaker = !this.expand_InvMaker
  }
  maker_close() {
    this.expand_InvMaker = false
    this.apinvsummaryform.controls['raiser_name'].reset(""),
      this.apinvsummaryform.controls['invoice_no'].reset(""),
      this.apinvsummaryform.controls['invoice_amount'].reset(""),
      this.apinvsummaryform.controls['from_date'].reset(""),
      this.apinvsummaryform.controls['to_date'].reset(""),
      this.apinvsummaryform.controls['apinvoiceheaderstatus_id'].reset(""),
      this.apinvsummaryform.controls['invoice_status'].reset("")
  }
  failed_filter() {
    this.expand_Failed = !this.expand_Failed
  }
  failed_close() {
    this.expand_Failed = false
    this.apfailedTransform.controls['minamt'].reset(""),
      this.apfailedTransform.controls['maxamt'].reset(""),
      this.apfailedTransform.controls['invoiceheader_crno'].reset(""),
      this.apfailedTransform.controls['raiserbranch_id'].reset(""),
      this.apfailedTransform.controls['invoice_amount'].reset("")
  }
  failed_reset() {
    // this.apfailedTransform.controls['minamt'].reset(""),
    //   this.apfailedTransform.controls['maxamt'].reset(""),
    //   this.apfailedTransform.controls['invoiceheader_crno'].reset(""),
    //   this.apfailedTransform.controls['raiserbranch_id'].reset(""),
    //   this.apfailedTransform.controls['invoice_amount'].reset("")
    this.searchfailedTransData["apinvoiceheaderstatus_id"] = "26";
    console.log("searchfailedTransData-- reset", this.searchfailedTransData)
    this.SummaryfailedDatarestfiled = ['invoiceheader_crno', 'aptype', 'supplier_id', 'raiser_name', 'raiserbranch_id', 'invoice_no', 'minamt', 'maxamt', 'invoice_status', 'from_date', 'to_date'];
    this.SummaryfailedObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
      params: "&apflag=1",
      data: this.searchfailedTransData,OverallCount: "Total Count"
    }
  }
  maker_reset() {
    // this.apinvsummaryform.controls['raiser_name'].reset(""),
    // this.apinvsummaryform.controls['invoice_no'].reset(""),
    // this.apinvsummaryform.controls['invoice_amount'].reset(""),
    // this.apinvsummaryform.controls['from_date'].reset(""),
    // this.apinvsummaryform.controls['to_date'].reset(""),
    // this.apinvsummaryform.controls['apinvoiceheaderstatus_id'].reset(""),
    // this.apinvsummaryform.controls['invoice_status'].reset("")
    // this.SummarymakerFilesrestfiled = ['invoiceheader_crno', 'aptype', 'supplier_id', 'raiser_name', 'raiserbranch_id', 'invoice_no', 'minamt', 'maxamt', 'invoice_status', 'from_date', 'to_date', 'inwfrom_date', 'inwto_date'];
    // this.SummaryObjmakerNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
    //   data: {},
    //   params: "&summary_type=maker_summary",OverallCount: "Total Count"
    // };
  }
  ap_reset() {
    this.apInvapprovalsummaryform.controls['to_date'].reset(""),
      this.apInvapprovalsummaryform.controls['from_date'].reset(""),
      this.apInvapprovalsummaryform.controls['invoice_amount'].reset(""),
      this.apInvapprovalsummaryform.controls['invoice_no'].reset(""),
      this.apInvapprovalsummaryform.controls['raiser_name'].reset(""),
      this.apInvapprovalsummaryform.controls['apinvoiceheaderstatus_id'].reset("")
    // this.SummaryApiapprovalObjNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
    //   params: "&summary_type=approver_summary",
    //   data: {},OverallCount: "Total Count"
    // }
  }
  bounce_reset() {
    this.apInvapprovalsummaryform.controls['raiser_name'].reset(""),
      this.apbounceform.controls['invoice_no'].reset(""),
      this.apbounceform.controls['invoice_amount'].reset(""),
      this.apbounceform.controls['from_date'].reset(""),
      this.apbounceform.controls['to_date'].reset(""),
      this.apbounceform.controls['apinvoiceheaderstatus_id'].reset("")
    // this.SummaryObjbounceNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
    //   data: {},
    //   params: "&summary_type=bounce_summary",OverallCount: "Total Count"
    // };
  }
  // reject_reset() {
  //   // this.aprejectform.controls['raiser_name'].reset(""),
  //   // this.aprejectform.controls['invoice_no'].reset("")
  //   // this.aprejectform.controls['invoice_amount'].reset("")
  //   this.SummaryrejectFilesrestfiled = ['invoiceheader_crno', 'aptype', 'supplier_id', 'raiser_name', 'raiserbranch_id', 'invoice_no', 'minamt', 'maxamt', 'invoice_status', 'from_date', 'to_date'];
  //   this.SummaryObjrejectNew = {
  //     method: "post",
  //     url: this.ecfmodelurl + "ecfapserv/ap_invoice_summary/0",
  //     data: {},
  //     params: "&summary_type=rejected_summary",OverallCount: "Total Count"
  //   };
  // }

  commonreset(e) {
    this.commonForm.controls['invoice_status'].reset(""),
      this.commonForm.controls['apinvoiceheaderstatus_id'].reset(""),
      this.commonForm.controls['from_date'].reset(""),
      this.commonForm.controls['to_date'].reset(""),
      this.commonForm.controls['supplier_id'].reset(""),
      this.commonForm.controls['invoice_amount'].reset(""),
      this.commonForm.controls['invoice_no'].reset(""),
      this.commonForm.controls['raiserbranch_id'].reset("")
    this.commonForm.controls['raiser_name'].reset("")
    this.commonForm.controls['aptype'].reset("")
    this.commonForm.controls['invoiceheader_crno'].reset("")
    // this.SummarycommonDatarestfiled = ['crno','invoiceheader_crno', 'aptype', 'supplier_id', 'raiser_name', 'raiserbranch_id', 'invoice_no', 'minamt', 'maxamt', 'invoice_status', 'start_date', 'end_date'];
    // this.SummarycommonDatarestfiled = ['crno'];
    // this.SummaryApicommonObjNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
    //   params: "&apflag=1",
    //   data: {},OverallCount: "Total Count"
    // }
  }

  resetcommonap(e) {
    this.SummarycommonDatarestfiled = ['crno', 'invoiceheader_crno', 'aptype', 'supplier_id', 'raiser_name', 'raiserbranch_id', 'invoice_no', 'minamt', 'maxamt', 'invoice_status', 'start_date', 'end_date'];
    this.globalpayload = "";
    // this.SummaryApicommonObjNew = {
    //   method: "post",
    //   url: this.ecfmodelurl + "ecfapserv/ecfap_common_summary",
    //   params: "&apflag=1",
    //   data: {},OverallCount: "Total Count"
    // }
  }

  payment_data(data) {
    let config: any = {
      value: "",
    };
    if (data?.supplier_id?.name) {
      config = {
        value: data?.supplier_id?.name + "-" + data?.supplier_id?.code,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }
  SummarypaymentData: any = [
    { columnname: "Batch No", key: "batchno" },
    { columnname: "CR No", key: "crno" },
    { columnname: "Invoice CR No", key: "apinvoiceheader_crno" },
    { columnname: "ECF Type", key: "ecftype" },
    { columnname: "ECF Date", key: "ecfdate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "ECF Amount", key: "ecfamount", "prefix": "₹", "type": 'Amount' },
    { columnname: "Invoice No", key: "invoiceno" },
    // { columnname: "Supplier", key: "supplier_id", type: "object", objkey: "name", },
    { columnname: "Supplier", key: "supplier_data", validate: true, validatefunction: this.payment_data.bind(this), },
    { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Invoice Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
    { columnname: "Invoice Status", key: "apinvoiceheaderstatus" },
    {
      columnname: "Select", "key": "Click to Pay", icon: "paid", "style": { color: "blue", cursor: "pointer" }, button: true, function: true,
      clickfunction: this.pvnoget.bind(this)
    },
  ]

  paymentrep: any
  paymentsearch(e) {
    this.paymentrep = e
    this.SummaryApipaymentObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/inv_pymtfile",
      params: "",
      data: e
    }
  }
  paytype: any = {
    label: "ECF Type",
    searchkey: "query",
    displaykey: "text",
    url: this.ecfmodelurl + "ecfapserv/get_ecftype",
    Outputkey: "id",
  }
  sub_name: any = {
    label: "Supplier Name",
    searchkey: "query",
    displaykey: "name",
    url: this.ecfmodelurl + "venserv/landlordbranch_list",
    params: "&query=",
    Outputkey: "id",
    disabled: false,
  }
  Rai_branch: any = {
    label: "Raiser Branch",
    method: "get",
    url: this.ecfmodelurl + "usrserv/search_branch",
    params: "",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
    prefix: 'code',
    separator: "hyphen"
    // suffix: 'limit',
  }
  rai_emp: any = {
    label: "Employee",
    method: "get",
    url: this.ecfmodelurl + "usrserv/memosearchemp",
    params: "",
    searchkey: "query",
    displaykey: "full_name",
    Outputkey: "id"
  }
  paysearch: any = [
    { "type": "input", "label": "Invoice Header CR No", "formvalue": "apinvoiceheader_crno" },
    { "type": "dropdown", inputobj: this.paytype, "formvalue": "ecftype" },
    { "type": "dropdown", inputobj: this.sub_name, "formvalue": "supplier_id" },
    { "type": "dropdown", inputobj: this.Rai_branch, "formvalue": "raiserbranch_id" },
    // { "type": "dropdown", inputobj: this.rai_emp, "formvalue": "raiser_name" },
    // { "type": "input", "label": "Invoice No", "formvalue": "invoice_no" },
    // { "type": "input", "label": "Invoice Amount", "formvalue": "invoice_amount" },
  ]

  empdrop: any = {
    label: "Employee",
    method: "get",
    url: this.ecfmodelurl + "usrserv/memosearchemp",
    params: "",
    searchkey: "query",
    displaykey: "full_name",
    Outputkey: "id",
    id: "ap-0320",
    formcontrolname: "raiser_name",
  };

  payment_filter() {
    this.expand_Payfile = !this.expand_Payfile
  }

  payment_reset() {
    this.PFSearchForm.controls['raiser_name'].reset(""),
      this.PFSearchForm.controls['invoice_no'].reset(""),
      this.PFSearchForm.controls['invoice_amount'].reset("")
    this.SummaryApipaymentObjNew = {
      method: "post",
      url: this.ecfmodelurl + "ecfapserv/inv_pymtfile",
      data: {}
    }
  }

  payment_close() {
    this.expand_Payfile = false
    this.PFSearchForm.controls['raiser_name'].reset(""),
      this.PFSearchForm.controls['invoice_no'].reset(""),
      this.PFSearchForm.controls['invoice_amount'].reset("")
  }

  iscourier: boolean = false;
  isAwbno: boolean = false;
  israiser: boolean = false;
  ischannel: boolean = false;
  toggleSearch(data: any) {
    
    if (data == 'Inwno') {
      this.isInwno = !this.isInwno;
      this.iscourier = false;
      this.isAwbno = false;
      this.israiser = false;
      this.ischannel = false;
    }
    else if (data == 'courier') {
      this.iscourier = !this.iscourier;
      this.isInwno = false;
      this.isAwbno = false;
      this.israiser = false;
      this.ischannel = false;
    }
    else if (data == 'Awbno') {
      this.isAwbno = !this.isAwbno
      this.iscourier = false;
      this.isInwno = false;
      this.israiser = false;
      this.ischannel = false;
    }
    else if (data == 'raiser') {
      this.israiser = !this.israiser
      this.iscourier = false;
      this.isInwno = false;
      this.isAwbno = false;
      this.ischannel = false;
    }
    else if (data == 'channel') {
      this.ischannel = !this.ischannel
      this.israiser = false;
      this.iscourier = false;
      this.isInwno = false;
      this.isAwbno = false;
    }

    else if (data == '') {
      this.iscourier = false;
      this.isInwno = false;
      this.isAwbno = false;
      this.israiser = false;
      this.ischannel = false;
    }
  }
  commnvalue: any
  com_summ(ty, value) {
    
    // this.commnvalue = ''
    if (value == 'ecftype') {
      this.commnvalue = ty
      this.commonSummarySearch('ecf', 1)
    }

  }
  iscrno: boolean = false;
  isInvcrno: boolean = false;
  isecftype: boolean = false;
  cosearch(data: any) {
    if (data == 'crno') {
      this.iscrno = !this.iscrno;
      this.isInvcrno = false;
      this.isecftype = false;
    }
    else if (data == 'Invcrno') {
      this.isInvcrno = !this.isInvcrno;
      this.iscrno = false;
      this.isecftype = false;
    }
    else if (data == 'ecftype') {
      this.isecftype = !this.isecftype
      this.isInvcrno = false;
      this.iscrno = false;
    }
    else if (data == '') {
      this.iscrno = false;
      this.isInvcrno = false;
      this.isecftype = false;
    }

  }

  appvalue: any = null
  app_summ(ty, value) {

    // this.commnvalue = ''
    if (value == 'ecftype') {
      this.appvalue = ty
      this.apappInvSummarySearch('ecf', 1)
    }
    else if (value == 'supplier') {
      this.appvalue = ty
      this.apappInvSummarySearch('supplier', 1)
    }
    else if (value == 'raiser') {
      this.appvalue = ty
      this.apappInvSummarySearch('raiser', 1)
    }
    else if (value == 'raiserbr') {
      this.appvalue = ty
      this.apappInvSummarySearch('raiserbr', 1)
    }
    else if (value == 'invsts') {
      this.appvalue = ty
      this.apappInvSummarySearch('invsts', 1)
    }

  }
  iscrno_app: boolean = false;
  isInvcrno_app: boolean = false;
  isecftype_app: boolean = false;
  issupplier_app: boolean = false;
  israiser_app: boolean = false;
  israiserbr_app: boolean = false;
  isinvno_app: boolean = false;
  isinvamt_app: boolean = false;
  isinvsts_app: boolean = false;
  isinvdate_app: boolean = false;
  isInwdate_app: boolean = false;
  isinvcrnoact_app: any
  isecftyact_app: any;
  issupact_app: any;
  israiact_app: any;
  israibract_app: any;
  isinvnoact_app: any;
  isinamtact_app: any;
  isinvstsact_app: any;
  isinvdateact_app: any;
  isInwdateact_app: any;

  appsearch(data: any) {
    if (data == 'invcrno') {
      if (data === 'invcrno') {
        setTimeout(() => {
          this.iscrno_app = true;
        }, 10);
      } else {
        this.iscrno_app = false;
      }

    }
    else if (data == 'ecftype') {
      if (data === 'ecftype') {
        setTimeout(() => {
          this.isecftype_app = true;
        }, 10);
      } else {
        this.isecftype_app = false;
      }
    }
    else if (data == 'supplier') {
      if (data === 'supplier') {
        setTimeout(() => {
          this.issupplier_app = true;
        }, 10);
      } else {
        this.issupplier_app = false;
      }
    }
    else if (data == 'raiser') {
      if (data === 'raiser') {
        setTimeout(() => {
          this.israiser_app = true;
        }, 10);
      } else {
        this.israiser_app = false;
      }
    }
    else if (data == 'raiserbr') {
      if (data === 'raiserbr') {
        setTimeout(() => {
          this.israiserbr_app = true;
        }, 10);
      } else {
        this.israiserbr_app = false;
      }
    }
    else if (data == 'invamt') {
      if (data === 'invamt') {
        setTimeout(() => {
          this.isinvamt_app = true;
        }, 10);
      } else {
        this.isinvamt_app = false;
      }
    }
    else if (data == 'invno') {
      if (data === 'invno') {
        setTimeout(() => {
          this.isinvno_app = true;
        }, 10);
      } else {
        this.isinvno_app = false;
      }
    }
    else if (data == 'invsts') {
      if (data === 'invsts') {
        setTimeout(() => {
          this.isinvsts_app = true;
        }, 10);
      } else {
        this.isinvsts_app = false;
      }
    }
    else if (data == 'date') {
      if (data === 'date') {
        setTimeout(() => {
          this.isinvdate_app = true;
        }, 10);
      } else {
        this.isinvdate_app = false;
      }
    }
    else if (data == 'INW_date') {
      if (data === 'INW_date') {
        setTimeout(() => {
          this.isInwdate_app = true;
        }, 10);
      } else {
        this.isInwdate_app = false;
      }
    }
    else if (data == 'invsts') {
      if (data === 'invsts') {
        setTimeout(() => {
          this.isinvsts_app = true;
        }, 10);
      } else {
        this.isinvsts_app = false;
      }
    }
    else if (data == '') {
      this.iscrno_app = false;
      this.isecftype_app = false;
      this.issupplier_app = false;
      this.israiser_app = false;
      this.israiserbr_app = false;
      this.isinvno_app = false;
      this.isinvamt_app = false;
      this.isinvsts_app = false;
      this.isinvdate_app = false;
      this.isInwdate_app = false;
      this.isinvsts_app = false;
    }
    else if (data == 'cleared') {
      this.isinvcrnoact_app = false;
      this.isecftyact_app = false;
      this.issupact_app = false;
      this.israiact_app = false;
      this.israibract_app = false;
      this.isinvnoact_app = false;
      this.isinamtact_app = false;
      this.isinvdateact_app = false;
      this.isInwdateact_app = false;
      this.isinvstsact_app = false;
    }

  }

  timer: any
  count1: number = 60
  isRunning: boolean = false;
  startCountdown(event?: Event) {
    if (this.APReportSummaryForm == true) {
      if (event) event.preventDefault();
      if (this.isRunning) {
        console.log('Timer already running');
        return;
      }
      this.isRunning = true;
      console.log('countdown Started')
      this.count1 = 60;
      this.timer = setInterval(() => {
        if (this.count1 > 0) {
          this.count1--;

        } else {
          clearInterval(this.timer);
          this.isRunning = false;
          this.startCountdown();
          this.get_Summary(1)
          this.handleReportSearchPageEvent({pageIndex:0,pageSize:10,length:this.length_rep} as PageEvent)
        }
        // if(this.count1 == 0)
      }, 1000);
    }
  }
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formattedSeconds}Sec`;
  }
  // ${formattedMinutes}Min:
  stopCountdown() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.isRunning = false;
      // this.count1 = 60
      console.log('Timer manually stopped');
    }
  }


  ngAfterViewInit() {
    if (this.navTabsWrapper) {
      this.navTabsWrapper.nativeElement.style.overflowX = 'auto';
      this.navTabsWrapper.nativeElement.style.display = 'flex';
    }
  }

  bouncevalue: any = null
  bnce_summ(ty, value) {

    // this.commnvalue = ''
    if (value == 'ecftype') {
      this.bouncevalue = ty
      this.apbounceSummarySearch('ecf', 1)
    }
    else if (value == 'supplier') {
      this.bouncevalue = ty
      this.apbounceSummarySearch('supplier', 1)
    }
    else if (value == 'raiser') {
      this.bouncevalue = ty
      this.apbounceSummarySearch('raiser', 1)
    }
    else if (value == 'raiserbr') {
      this.bouncevalue = ty
      this.apbounceSummarySearch('raiserbr', 1)
    }
    else if (value == 'invsts') {
      this.bouncevalue = ty
      this.apbounceSummarySearch('invsts', 1)
    }

  }
  iscrno_bnce: boolean = false;
  isInvcrno_bnce: boolean = false;
  isecftype_bnce: boolean = false;
  issupplier_bnce: boolean = false;
  israiser_bnce: boolean = false;
  israiserbr_bnce: boolean = false;
  isinvno_bnce: boolean = false;
  isinvamt_bnce: boolean = false;
  isinvsts_bnce: boolean = false;
  isinvdate_bnce: boolean = false;
  isInwdate_bnce: boolean = false;
  isinvcrnoact_bnce: any
  isecftyact_bnce: any;
  issupact_bnce: any;
  israiact_bnce: any;
  israibract_bnce: any;
  isinvnoact_bnce: any;
  isinamtact_bnce: any;
  isinvstsact_bnce: any;
  isinvdateact_bnce: any;
  isInwdateact_bnce: any;

  bncesearch(data: any) {
    if (data == 'invcrno') {
      if (data === 'invcrno') {
        setTimeout(() => {
          this.iscrno_bnce = true;
        }, 10);
      } else {
        this.iscrno_bnce = false;
      }

    }
    else if (data == 'ecftype') {
      if (data === 'ecftype') {
        setTimeout(() => {
          this.isecftype_bnce = true;
        }, 10);
      } else {
        this.isecftype_bnce = false;
      }
    }
    else if (data == 'supplier') {
      if (data === 'supplier') {
        setTimeout(() => {
          this.issupplier_bnce = true;
        }, 10);
      } else {
        this.issupplier_bnce = false;
      }
    }
    else if (data == 'raiser') {
      if (data === 'raiser') {
        setTimeout(() => {
          this.israiser_bnce = true;
        }, 10);
      } else {
        this.israiser_bnce = false;
      }
    }
    else if (data == 'raiserbr') {
      if (data === 'raiserbr') {
        setTimeout(() => {
          this.israiserbr_bnce = true;
        }, 10);
      } else {
        this.israiserbr_bnce = false;
      }
    }
    else if (data == 'invamt') {
      if (data === 'invamt') {
        setTimeout(() => {
          this.isinvamt_bnce = true;
        }, 10);
      } else {
        this.isinvamt_bnce = false;
      }
    }
    else if (data == 'invno') {
      if (data === 'invno') {
        setTimeout(() => {
          this.isinvno_bnce = true;
        }, 10);
      } else {
        this.isinvno_bnce = false;
      }
    }
    else if (data == 'invsts') {
      if (data === 'invsts') {
        setTimeout(() => {
          this.isinvsts_bnce = true;
        }, 10);
      } else {
        this.isinvsts_bnce = false;
      }
    }
    else if (data == 'date') {
      if (data === 'date') {
        setTimeout(() => {
          this.isinvdate_bnce = true;
        }, 10);
      } else {
        this.isinvdate_bnce = false;
      }
    }
    else if (data == 'INW_date') {
      if (data === 'INW_date') {
        setTimeout(() => {
          this.isInwdate_bnce = true;
        }, 10);
      } else {
        this.isInwdate_bnce = false;
      }
    }
    else if (data == 'invsts') {
      if (data === 'invsts') {
        setTimeout(() => {
          this.isinvsts_bnce = true;
        }, 10);
      } else {
        this.isinvsts_bnce = false;
      }
    }
    else if (data == '') {
      this.iscrno_bnce = false;
      this.isecftype_bnce = false;
      this.issupplier_bnce = false;
      this.israiser_bnce = false;
      this.israiserbr_bnce = false;
      this.isinvno_bnce = false;
      this.isinvamt_bnce = false;
      this.isinvdate_bnce = false;
      this.isInwdate_bnce = false;
      this.isinvsts_bnce = false;
    }
    else if (data == 'cleared') {
      this.isinvcrnoact_bnce = false;
      this.isecftyact_bnce = false;
      this.issupact_bnce = false;
      this.israiact_bnce = false;
      this.israibract_bnce = false;
      this.isinvnoact_bnce = false;
      this.isinamtact_bnce = false;
      this.isinvdateact_bnce = false;
      this.isInwdateact_bnce = false;
      this.isinvstsact_bnce = false;
    }

  }


  rejectvalue: any = null
  rej_summ(ty, value) {

    // this.commnvalue = ''
    if (value == 'ecftype') {
      this.rejectvalue = ty
      this.aprejectSummarySearch('ecf', 1)
    }
    else if (value == 'supplier') {
      this.rejectvalue = ty
      this.aprejectSummarySearch('supplier', 1)
    }
    else if (value == 'raiser') {
      this.rejectvalue = ty
      this.aprejectSummarySearch('raiser', 1)
    }
    else if (value == 'raiserbr') {
      this.rejectvalue = ty
      this.aprejectSummarySearch('raiserbr', 1)
    }
    else if (value == 'invsts') {
      this.rejectvalue = ty
      this.aprejectSummarySearch('invsts', 1)
    }

  }
  iscrno_rej: boolean = false;
  isInvcrno_rej: boolean = false;
  isecftype_rej: boolean = false;
  issupplier_rej: boolean = false;
  israiser_rej: boolean = false;
  israiserbr_rej: boolean = false;
  isinvno_rej: boolean = false;
  isinvamt_rej: boolean = false;
  isinvsts_rej: boolean = false;
  isinvdate_rej: boolean = false;
  isInwdate_rej: boolean = false;
  isinvcrnoact_rej: any
  isecftyact_rej: any;
  issupact_rej: any;
  israiact_rej: any;
  israibract_rej: any;
  isinvnoact_rej: any;
  isinamtact_rej: any;
  isinvstsact_rej: any;
  isinvdateact_rej: any;
  isInwdateact_rej: any;

  rejsearch(data: any) {
    if (data == 'invcrno') {
      if (data === 'invcrno') {
        setTimeout(() => {
          this.iscrno_rej = true;
        }, 10);
      } else {
        this.iscrno_rej = false;
      }

    }
    else if (data == 'ecftype') {
      if (data === 'ecftype') {
        setTimeout(() => {
          this.isecftype_rej = true;
        }, 10);
      } else {
        this.isecftype_rej = false;
      }
    }
    else if (data == 'supplier') {
      if (data === 'supplier') {
        setTimeout(() => {
          this.issupplier_rej = true;
        }, 10);
      } else {
        this.issupplier_rej = false;
      }
    }
    else if (data == 'raiser') {
      if (data === 'raiser') {
        setTimeout(() => {
          this.israiser_rej = true;
        }, 10);
      } else {
        this.israiser_rej = false;
      }
    }
    else if (data == 'raiserbr') {
      if (data === 'raiserbr') {
        setTimeout(() => {
          this.israiserbr_rej = true;
        }, 10);
      } else {
        this.israiserbr_rej = false;
      }
    }
    else if (data == 'invamt') {
      if (data === 'invamt') {
        setTimeout(() => {
          this.isinvamt_rej = true;
        }, 10);
      } else {
        this.isinvamt_rej = false;
      }
    }
    else if (data == 'invno') {
      if (data === 'invno') {
        setTimeout(() => {
          this.isinvno_rej = true;
        }, 10);
      } else {
        this.isinvno_rej = false;
      }
    }
    else if (data == 'invsts') {
      if (data === 'invsts') {
        setTimeout(() => {
          this.isinvsts_rej = true;
        }, 10);
      } else {
        this.isinvsts_rej = false;
      }
    }
    else if (data == 'date') {
      if (data === 'date') {
        setTimeout(() => {
          this.isinvdate_rej = true;
        }, 10);
      } else {
        this.isinvdate_rej = false;
      }
    }
    else if (data == 'INW_date') {
      if (data === 'INW_date') {
        setTimeout(() => {
          this.isInwdate_rej = true;
        }, 10);
      } else {
        this.isInwdate_rej = false;
      }
    }
    else if (data == 'invsts') {
      if (data === 'invsts') {
        setTimeout(() => {
          this.isinvsts_rej = true;
        }, 10);
      } else {
        this.isinvsts_rej = false;
      }
    }
    else if (data == '') {
      this.iscrno_rej = false;
      this.isecftype_rej = false;
      this.issupplier_rej = false;
      this.israiser_rej = false;
      this.israiserbr_rej = false;
      this.isinvno_rej = false;
      this.isinvamt_rej = false;
      this.isinvdate_rej = false;
      this.isInwdate_rej = false;
      this.isinvsts_rej = false;
    }
    else if (data == 'cleared') {
      this.isinvcrnoact_rej = false;
      this.isecftyact_rej = false;
      this.issupact_rej = false;
      this.israiact_rej = false;
      this.israibract_rej = false;
      this.isinvnoact_rej = false;
      this.isinamtact_rej = false;
      this.isinvdateact_rej = false;
      this.isInwdateact_rej = false;
      this.isinvstsact_rej = false;
    }

  }


  failtrvalue: any = null
  failtrsumm(ty, value) {

    // this.commnvalue = ''
    if (value == 'ecftype') {
      this.failtrvalue = ty
      this.failedTransSummarySearch('ecf', 1)
    }
    else if (value == 'supplier') {
      this.failtrvalue = ty
      this.failedTransSummarySearch('supplier', 1)
    }
    else if (value == 'raiser') {
      this.failtrvalue = ty
      this.failedTransSummarySearch('raiser', 1)
    }
    else if (value == 'raiserbr') {
      this.failtrvalue = ty
      this.failedTransSummarySearch('raiserbr', 1)
    }
    else if (value == 'invsts') {
      this.failtrvalue = ty
      this.failedTransSummarySearch('invsts', 1)
    }

  }
  iscrno_failtr: boolean = false;
  isInvcrno_failtr: boolean = false;
  isecftype_failtr: boolean = false;
  issupplier_failtr: boolean = false;
  israiser_failtr: boolean = false;
  israiserbr_failtr: boolean = false;
  isinvno_failtr: boolean = false;
  isinvamt_failtr: boolean = false;
  isinvsts_failtr: boolean = false;
  isinvdate_failtr: boolean = false;
  isInwdate_failtr: boolean = false;
  isinvcrnoact_failtr: any
  isecftyact_failtr: any;
  issupact_failtr: any;
  israiact_failtr: any;
  israibract_failtr: any;
  isinvnoact_failtr: any;
  isinamtact_failtr: any;
  isinvstsact_failtr: any;
  isinvdateact_failtr: any;
  isInwdateact_failtr: any;

  failtrsearch(data: any) {
    if (data == 'invcrno') {
      if (data === 'invcrno') {
        setTimeout(() => {
          this.iscrno_failtr = true;
        }, 10);
      } else {
        this.iscrno_failtr = false;
      }

    }
    else if (data == 'ecftype') {
      if (data === 'ecftype') {
        setTimeout(() => {
          this.isecftype_failtr = true;
        }, 10);
      } else {
        this.isecftype_failtr = false;
      }
    }
    else if (data == 'supplier') {
      if (data === 'supplier') {
        setTimeout(() => {
          this.issupplier_failtr = true;
        }, 10);
      } else {
        this.issupplier_failtr = false;
      }
    }
    else if (data == 'raiser') {
      if (data === 'raiser') {
        setTimeout(() => {
          this.israiser_failtr = true;
        }, 10);
      } else {
        this.israiser_failtr = false;
      }
    }
    else if (data == 'raiserbr') {
      if (data === 'raiserbr') {
        setTimeout(() => {
          this.israiserbr_failtr = true;
        }, 10);
      } else {
        this.israiserbr_failtr = false;
      }
    }
    else if (data == 'invamt') {
      if (data === 'invamt') {
        setTimeout(() => {
          this.isinvamt_failtr = true;
        }, 10);
      } else {
        this.isinvamt_failtr = false;
      }
    }
    else if (data == 'invno') {
      if (data === 'invno') {
        setTimeout(() => {
          this.isinvno_failtr = true;
        }, 10);
      } else {
        this.isinvno_failtr = false;
      }
    }
    else if (data == 'invsts') {
      if (data === 'invsts') {
        setTimeout(() => {
          this.isinvsts_failtr = true;
        }, 10);
      } else {
        this.isinvsts_failtr = false;
      }
    }
    else if (data == 'date') {
      if (data === 'date') {
        setTimeout(() => {
          this.isinvdate_failtr = true;
        }, 10);
      } else {
        this.isinvdate_failtr = false;
      }
    }
    else if (data == 'INW_date') {
      if (data === 'INW_date') {
        setTimeout(() => {
          this.isInwdate_failtr = true;
        }, 10);
      } else {
        this.isInwdate_failtr = false;
      }
    }
    else if (data == 'invsts') {
      if (data === 'invsts') {
        setTimeout(() => {
          this.isinvsts_failtr = true;
        }, 10);
      } else {
        this.isinvsts_failtr = false;
      }
    }
    else if (data == '') {
      this.iscrno_failtr = false;
      this.isecftype_failtr = false;
      this.issupplier_failtr = false;
      this.israiser_failtr = false;
      this.israiserbr_failtr = false;
      this.isinvno_failtr = false;
      this.isinvamt_failtr = false;
      this.isinvdate_failtr = false;
      this.isInwdate_failtr = false;
      this.isinvsts_failtr = false;
    }
    else if (data == 'cleared') {
      this.isinvcrnoact_failtr = false;
      this.isecftyact_failtr = false;
      this.issupact_failtr = false;
      this.israiact_failtr = false;
      this.israibract_failtr = false;
      this.isinvnoact_failtr = false;
      this.isinamtact_failtr = false;
      this.isinvdateact_failtr = false;
      this.isInwdateact_failtr = false;
      this.isinvstsact_failtr = false;
    }

  }
  pmtadvvalue: any = null
  pmtadvsumm(ty, value) {

    // this.commnvalue = ''
    if (value == 'ecftype') {
      this.pmtadvvalue = ty
      this.paymentAdviceSearch('ecf')
    }
    else if (value == 'supplier') {
      this.pmtadvvalue = ty
      this.paymentAdviceSearch('supplier')
    }
    else if (value == 'raiser') {
      this.pmtadvvalue = ty
      this.paymentAdviceSearch('raiser')
    }
    else if (value == 'raiserbr') {
      this.pmtadvvalue = ty
      this.paymentAdviceSearch('raiserbr')
    }
    else if (value == 'invsts') {
      this.pmtadvvalue = ty
      this.paymentAdviceSearch('invsts')
    }

  }
  iscrno_pmtadv: boolean = false;
  isInvcrno_pmtadv: boolean = false;
  isecftype_pmtadv: boolean = false;
  issupplier_pmtadv: boolean = false;
  israiser_pmtadv: boolean = false;
  israiserbr_pmtadv: boolean = false;
  isinvno_pmtadv: boolean = false;
  isinvamt_pmtadv: boolean = false;
  isinvsts_pmtadv: boolean = false;
  isinvdate_pmtadv: boolean = false;
  isInwdate_pmtadv: boolean = false;
  isinvcrnoact_pmtadv: any
  isecftyact_pmtadv: any;
  issupact_pmtadv: any;
  israiact_pmtadv: any;
  israibract_pmtadv: any;
  isinvnoact_pmtadv: any;
  isinamtact_pmtadv: any;
  isinvstsact_pmtadv: any;
  isinvdateact_pmtadv: any;
  isInwdateact_pmtadv: any;

  pmtadvsearch(data: any) {
    if (data == 'invcrno') {
      if (data === 'invcrno') {
        setTimeout(() => {
          this.iscrno_pmtadv = true;
        }, 10);
      } else {
        this.iscrno_pmtadv = false;
      }

    }
    else if (data == 'ecftype') {
      if (data === 'ecftype') {
        setTimeout(() => {
          this.isecftype_pmtadv = true;
        }, 10);
      } else {
        this.isecftype_pmtadv = false;
      }
    }
    else if (data == 'supplier') {
      if (data === 'supplier') {
        setTimeout(() => {
          this.issupplier_pmtadv = true;
        }, 10);
      } else {
        this.issupplier_pmtadv = false;
      }
    }
    else if (data == 'raiser') {
      if (data === 'raiser') {
        setTimeout(() => {
          this.israiser_pmtadv = true;
        }, 10);
      } else {
        this.israiser_pmtadv = false;
      }
    }
    else if (data == 'raiserbr') {
      if (data === 'raiserbr') {
        setTimeout(() => {
          this.israiserbr_pmtadv = true;
        }, 10);
      } else {
        this.israiserbr_pmtadv = false;
      }
    }
    else if (data == 'invamt') {
      if (data === 'invamt') {
        setTimeout(() => {
          this.isinvamt_pmtadv = true;
        }, 10);
      } else {
        this.isinvamt_pmtadv = false;
      }
    }
    else if (data == 'invno') {
      if (data === 'invno') {
        setTimeout(() => {
          this.isinvno_pmtadv = true;
        }, 10);
      } else {
        this.isinvno_pmtadv = false;
      }
    }
    else if (data == 'date') {
      if (data === 'date') {
        setTimeout(() => {
          this.isinvdate_pmtadv = true;
        }, 10);
      } else {
        this.isinvdate_pmtadv = false;
      }
    }
    else if (data == 'INW_date') {
      if (data === 'INW_date') {
        setTimeout(() => {
          this.isInwdate_pmtadv = true;
        }, 10);
      } else {
        this.isInwdate_pmtadv = false;
      }
    }
    else if (data == 'invsts') {
      if (data === 'invsts') {
        setTimeout(() => {
          this.isinvsts_pmtadv = true;
        }, 10);
      } else {
        this.isinvsts_pmtadv = false;
      }
    }
    else if (data == '') {
      this.iscrno_pmtadv = false;
      this.isecftype_pmtadv = false;
      this.issupplier_pmtadv = false;
      this.israiser_pmtadv = false;
      this.israiserbr_pmtadv = false;
      this.isinvno_pmtadv = false;
      this.isinvamt_pmtadv = false;
      this.isinvdate_pmtadv = false;
      this.isInwdate_pmtadv = false;
      this.isinvsts_pmtadv = false;
    }
    else if (data == 'cleared') {
      this.isinvcrnoact_pmtadv = false;
      this.isecftyact_pmtadv = false;
      this.issupact_pmtadv = false;
      this.israiact_pmtadv = false;
      this.israibract_pmtadv = false;
      this.isinvnoact_pmtadv = false;
      this.isinamtact_pmtadv = false;
      this.isinvdateact_pmtadv = false;
      this.isInwdateact_pmtadv = false;
      this.isinvstsact_pmtadv = false;
    }

  }
 
    downloadreport(data) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      id: "",
      button: false,
      function: false,
      tooltipValue: ""
    };
    if (data.dd?.report_status != 'Completed') {
      config = {
        style: { color: "green", cursor: "pointer" },
        tooltipValue: "download",
        icon: "download",
        disabled: false,
        function: true,
        button: true,
      }
    }
    else if(data.dd?.report_status == 'Completed'){
      config = {
        disabled: true,
        style: { color: "black" },
        tooltipValue: "download",
        icon: "-",
        function: false,
        button: false,
      }
    }
    return config
  }
   SummaryaprepData: any = [
    { columnname: "Report Name", key: "report_name" },
    { columnname: "Created By", key: "created_by", type: "object", objkey: "name_code", },
    { columnname: "Created Date", key: "created_date", "type": 'date', "datetype": "dd-MMM-yyyy" },
    { columnname: "From Date", key: "from_date", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "To Date", key: "to_date", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Report Status", key: "report_status" },
    {
      columnname: "Download", icon: "download",
      button: true, function: true, clickfunction: this.APRptSummarydownload.bind(this),
      validate: true, validatefunction: this.downloadreport.bind(this),
    }
  ]
  //  apreportSearch(e) {
  //     this.SummaryApiaprepObjNew = {
  //       method: "post",
  //       "url": this.ecfmodelurl + "ecfapserv/apreportfile_summary",
  //       params: "",
  //       data: e
  //     }
  //   }
selectedDetail:any
    addpodetails(data){
      this.selectedDetail = data;
      var myModal = new (bootstrap as any).Modal(
          document.getElementById("addpocomponent"),
          {
            backdrop: 'static',
            keyboard: false
          }
        );
        myModal.show(); 
    }
  @ViewChild('closecomponent')closecomponent;
  compoback(){
    this.closecomponent.nativeElement.click()
  }
  ngOnDestroy() {
  this.stopCountdown();  // cleanup interval
}
}
 




