import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
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
import { PageEvent } from '@angular/material/paginator'
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatSelectionList } from '@angular/material/list';
import { format } from 'path';

import { url } from 'inspector';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { icon } from 'src/app/AppAutoEngine/import-services/CommonimportFiles';
import { data } from 'jquery';
import { DomSanitizer } from '@angular/platform-browser';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';


export interface commoditylistss {
  id: string;
  name: string;
}
export interface ApproverListss {
  id: string;
  name: string;
  code: string;
  designation: string
  limit: number;
}
// export interface approverListss {
//   id: string;
//   name: string;
//   code: string;
//   designation : string
//   limit: number;
// }

export interface supplierss {
  id: string;
  name: string;
  code: string;
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
  selector: 'app-ecfap',
  templateUrl: './ecfap.component.html',
  styleUrls: ['./ecfap.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EcfapComponent implements OnInit {
  typelist: any = [{ "id": 1, "name": "ECF Wise" }, { "id": 3, "name": "Supplier Wise" }];
  ecfsuptype: any
  ecfemptype:any
  sub_module_url: any
  ECF_Sub_Menu_List: any
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
  url = environment.apiURL
  ecfmodelurl = environment.apiURL
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
    id: "ecfap-0260"
  };
  // choose_supplier_field_1: any = {
  //   label: "Choose Supplier",
  //   method: "get",
  //   url: this.ecfmodelurl + "venserv/search_supplierdetails_ecf",
  //   params: "&code=&panno=&gstno=",
  //   searchkey: "name",
  //   displaykey: "name",
  //   wholedata: true,
  //   required: true,
  //   formcontrolname: "name",
  //   id: "ecfap-0261"
  // };
  choose_supplier_field_1: any = {
    label: "Choose Supplier",
    searchkey: "name",
    displaykey: "name",
    wholedata: true,
    required: true,
    formcontrolname: "name",
    id: "ecfap-0261"
  };
  choose_supplier_field_approve_report:any;
  ecf_approval_commonbranch_approve_report: any;
  ecf_approval_commodity_approve_report: any;
  approval_frtodate_approve_report:any;
  choose_supplier_field_common_report:any;
  ecf_approval_commonbranch_common_report:any;
  approval_frtodate_common_report:any;
  raiser_common_report:any;
  ecfstatuss_common_report:any;
  id: any;
  filename: any;
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
  PaymentAdvisoryForm: boolean
  Emppanel: any;
  InvNopanel: any;
  BranchGSTpanel: any;
  Branchnamecard:any;
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
  SummaryApicommonecfObjNew: any;
  SummaryApibatchwiseObjNew: any
  TypeList: any;
  StatusList: any;
  ApprovalStatusList = []
  batchStatusList: any;
  apptypelist: any = [{ "id": 1, "name": "Batch Wise Approval" }, { "id": 2, "name": "ECF Wise Approval" }];
  ecfSearchForm: FormGroup;
  SupplierWiseECFForm: FormGroup;
  ecf_summary_data: any;
  Supp_ecf_summary: any;
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
  views: any;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closetranbutton') closetranbutton;
  @ViewChild('closefilebutton') closefilebutton;
  @ViewChild('closedpaybutton') closedpaybutton;
  @ViewChild('closeAttachment') closeAttachment;
  @ViewChild('cboxSummary') summaryBoxComponent: any;
  ApproverForm: FormGroup;
  ApproverList: Array<ApproverListss>;
  // approverList: Array<approverListss>;
  @ViewChild('approverInput') approverInput: any;
  @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  // @ViewChild('appInput') appInput:any;
  // @ViewChild('approver') matappAutocomplete: MatAutocomplete;
  @ViewChild('supplierInput') supplierInput: any;
  @ViewChild('supp') matsuppAutocomplete: MatAutocomplete;
  @ViewChild('supplierInputs') supplierInputs: any;
  @ViewChild('supps') matsuppsAutocomplete: MatAutocomplete;
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
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
  @ViewChild('closetempbutton') closetempbutton;
  @ViewChild('closefrmtempCreate') closefrmtempCreate;
  @ViewChild('closeECFinvRptDwnld') closeECFinvRptDwnld;
  @ViewChild('closeECFAppRptDwnld') closeECFAppRptDwnld;
  @ViewChild('closecmnrptDwnld') closecmnrptDwnld;
  restcommonformummary:any= []


  PFSearchForm: any;
  has_pfpagenext = true;
  has_pfpageprevious = true;
  ispfsummarypage: boolean = true;
  pfpresentpage: number = 1;
  pfpagesize = 10;

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
  @ViewChild('matsupplierAutocomplete') matsupplierAutocomplete: MatAutocomplete;
  @ViewChild('raiserbrInput') raiserbrInput: any;
  @ViewChild('supplierbrInput') supplierbrInput: any;
  commonForm: FormGroup
  commonSummary: any
  searchData: any = {}
  commonpresentpage: number = 1;

  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  Branchlist: Array<branchListss>;
  supplierlist: Array<supplierListss>;
  EcfStatusList: any;

  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]

  frmInvHdr: FormGroup;
  invoiceheaderdetailForm: FormGroup
  InvoiceDetailForms: FormGroup
  creditdetForm: FormGroup
  DebitDetailForm: FormGroup
  ccbsForm: FormGroup
  apinvHeader_id = this.shareservice.invheaderid.value;
  crno = this.shareservice.crno.value;
  showinvoicediv = true
  showdebitdiv = false
  headerdata: any = [];
  invtotamount: any
  OtherAmount: any
  taxableamt: any
  Roundoffamount: any;
  invDetailList: any;
  invDebitList: any;
  invDebitTot: number;
  invCreditList: any;
  invCreditTot: number;
  getgstapplicable: any
  gstAppl: boolean
  paytoid: any
  INVsum: any
  INVamt: any
  totalamount: any
  cdtsum: any
  debitsum: any
  ecpappsumdataapi: any;
  batchappsumdataapi: any;
  frmLiq: FormGroup
  @ViewChild('matbranchAutocomplete') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  @ViewChild('branchmatAuto') branchmatAuto: MatAutocomplete;
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
  ecfsummarytype: any = 1
  approvaltype = 2;
  checked = true;
  @ViewChild('raisertyperole') matempraiserAutocomplete: MatAutocomplete;
  @ViewChild('raiserInput') raiserInput: any;
  Raiserlist: any
  has_nextemp = true;
  has_previousemp = true;
  currentpageemp: number = 1;
  branchList: Array<any> = [];
  has_branchnext: boolean = true;
  has_branchprevious: boolean = false;
  has_branchpresentpage: number = 1;
  employeeBranch: any
  empModuleRoles: any
  COPermission = 0
  DOPermission = 0
  MakerPermFlg = false
  commodityList: Array<commoditylistss>
  @ViewChild('closeCommonentry') closeCommonentry;

  SelectSupplierForm: FormGroup
  supplierNameData: any;
  suplist: any
  selectsupplierlist: any;
  supplierdata: any
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  submitbutton = false;
  SupplierDetailForm: FormGroup
  @ViewChild('supclosebuttons') supclosebuttons;
  // templatebutton: any;
  searchvar: any
  templatebutton: any
  suppliertemplatebutton: any
  ecfURL = environment.apiURL
  supplierdata_name: any;
  SummaryecfapData: any
  SummaryApiecfapObjNew: any
  SummaryApitransactionObjNew: any;
  SummaryApidetailObjNew: any;
  ecfabs: any;
  serachreset: any[];
  supplierlists: any;
  suppliersearchs: any;
  supplierdatass: any;
  choosesupplierfield: any;
  choosesupplierfield1: any;
  restformfile: any[];
  restformfile1: any[];
  createTempForm: FormGroup
  frmPaymentAdvisory: FormGroup
  CommonRptDwnldForm:FormGroup
  ECFinvRptDwnldForm:any
  ECFAppRptDwnldForm:any
  frmCreateTemp : FormGroup
  @ViewChild('uploadclose') uploadclose;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild("navTabs", { static: false }) navTabs: ElementRef;
  SummaryApiviewecfObjNew: any;
  commonsearchsearch: any
  supplierfield: any
  commonbranch: any
  commonsumbutton: any
  raiser: any
  ecfdroptype: any = { label: "ECF Type" };
  ecfreporttype: any = { label: "Report Type" };
  frtodatereport:any
  taskPopups: boolean = false
  frtodate: any
  approval_frtodate: any
  Invoice: any
  report_status: any={label: "Report Status"}
  approval_report: any={label: "Report Status"}
  ECF_Wise_Approval: any
  ECF_Wise_Approvalsumbutton: any
  ecf_approval_Supplier_name: any
  ecf_approval_type: any
  ecf_approval_type_approver_report:any
  ecf_approval_type_common_report:any;
  ecf_approval_branch: any
  ecf_approval_commonbranch: any
  ecf_approval_commodity: any
  approval_report_status: any;
  Batch_Wise_Approval: any
  batch_Batch_Status: any
  coverid: any
  covertype: any
  SummaryApisupplierwiseObjNew: any;
  ecfunlock: any;
  SummaryApiecfwiseObjNew: any
  commchecks: any;
  ecftypechecks: any;
  is_checked: any;
  current_selected_data: any;
  Summaryecfwisedata:any
  ecfstatuss:any;
  ecfsearches:any; 
  ecfsearch: any
  ecfreport :any
  commoninvoicestatustype: any = { label: "Invoice Status" };
  enable_ddl = false
  supplydown: any
  branchdown: any;
  commoditydown: any;
  typedown: any = { label: "ECF Type" };
  statusdown: any;
  @ViewChild('fileInput') fileInput;
  ecfReportSummaryPath : any
  ECFReportSummaryForm:boolean;
  frmECFReportSummary:FormGroup;
  reportList:any;
  SummarycommonecfData:any;
  globalpayload:any;
  ecpappsumdata:any;
  selectedSubmoduleName:any;
  constructor(private sharedService: SharedService, private ecfservice: EcfapService, private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService, private fb: FormBuilder, private notification: NotificationService, private shareservice: ShareService,
    private activatedroute: ActivatedRoute, private datePipe: DatePipe, private router: Router, private ecfservices: EcfService,
    private toastr: ToastrService, public sanitizer:DomSanitizer) {



    // let payloadbodydata = {
    //   apstatus: "",
    //   aptype: "",
    //   branch: "",
    //   branch_id: "",
    //   commodity_id: "",
    //   crno: "",
    //   end_date: "",
    //   maxamt: "",
    //   minamt: "",
    //   purpose: "",
    //   start_date: "",
    //   supplier_id: "",
    //   type: true
    // };
    // this.ecpappsumdataapi = {
    //   method: "post",
    //   url: this.url + "ecfapserv/batchheadersearch",
    //  params: "&ecf_approver=true" + "?submodule=" + this.ecf_approval_sub_module_name,
    //   data: payloadbodydata
    // }

    // this.SummaryApicommonecfObjNew = {
    //   method: "post",
    //   url: this.url + "ecfapserv/ecfap_common_summary",
    //   params: "",
    //   data: {}
    // }

    // this.batchappsumdataapi = {
    //   method: "post",
    //   url: this.url + "ecfapserv/batchsearch",
    //   params: "&ecf_approver=true",
    //   data: {}
    // }

    this.templatebutton = [
      {
        icon: "filter_list", "tooltip": "Show More",
        function: this.ecf_inv_filter.bind(this)
      },
      {
        icon: "download", "tooltip": "Report Download",
        function: this.downloadpopupinventory.bind(this),
      },
      // { icon: "arrow_upward", "tooltip": "Select Supplier", function: this.getsupplierpopup.bind(this) }, 
      { icon: "add", "tooltip": "Create ECF", function: this.showadd.bind(this) }]
    this.suppliertemplatebutton = [
      { icon: "arrow_upward", "tooltip": "Select Supplier", function: this.getsupplierpopup.bind(this) }]
    this.SummaryecfapData = [{ "columnname": "Invoice CR No", "key": "apinvoiceheader_crno", style: { cursor: "pointer", color: "blue" }, function: true, clickfunction: this.linkView.bind(this) }, { "columnname": "ECF Type", "key": "aptype", "type": "object", "objkey": "text" }, { "columnname": "ECF Date", "key": "apdate", "type": 'Date', "datetype": "dd-MMM-yyyy" }, { "columnname": "Batch No", "key": "batch_no", function: true, validate: true, validatefunction: this.branchcode.bind(this) },
    { "columnname": "Batch Status", "key": "batch_status", function: true, validate: true, validatefunction: this.branchstatus.bind(this) }, { "columnname": "Supplier Name", "key": "supplier_data", "type": "object", "objkey": "name_code" },
    { "columnname": "Raiser", "key": "raiser_name" }, { "columnname": "Raiser Branch", "key": "raiserbranch_branch", "type": "object", "objkey": "name_code" }, { "columnname": "Invoice No", "key": "invoice_no" }, { "columnname": "Invoice Amount", "key": "totalamount", "prefix": "₹", "type": 'Amount' },
    { "columnname": "Invoice Date", "key": "invoicedate", "type": 'date', "datetype": "dd-MMM-yyyy" }, { "columnname": "GST No", "key": "supplier_data", "type": "object", "objkey": "gstno" }, { "columnname": "Invoice Status", "key": "ap_status" },
    { "columnname": "View Entry", "key": "apinvoicehdr_status", function: true, validate: true, button: true, validatefunction: this.apinvoicehdr.bind(this), clickfunction: this.CommonViewEntry.bind(this) },
    { "columnname": "Download Covernote", "key": "ecfstatus", function: true, validate: true, button: true, validatefunction: this.download.bind(this), clickfunction: this.coverNotedownload_common_click.bind(this) }]
    // this.commonbranch = {
    //   label: "Raiser Branch",
    //   method: "get",
    //   url: this.ecfmodelurl + "usrserv/search_branch",
    //   params: "",
    //   searchkey: "query",
    //   displaykey: "name",
    //   Outputkey: "id"
    // };
    this.commonbranch = {
      label: " Branch",
      method: "get",
      url: this.ecfmodelurl + "usrserv/search_branch",
      params: "",
      searchkey: "query",
      displaykey: "name",
      Outputkey: "id",
      prefix: 'code',
      separator: "hyphen"
    };
    this.supplierfield = {
      label: "Supplier",
      method: "get",
      url: this.ecfmodelurl + "venserv/landlordbranch_list",
      params: "",
      searchkey: "query",
      displaykey: "name",
      Outputkey: "id"
    };
    this.raiser = {
      label: "ECF Type",
      method: "get",
      url: this.ecfmodelurl + "usrserv/memosearchemp",
      params: "",
      searchkey: "query",
      displaykey: "full_name",
      Outputkey: "id"
      // formkey: "id"
    };

    this.commonsumbutton = [
    // {
    //   icon: "filter_list", "tooltip": "Show More",
    //   function: this.taskPopup.bind(this)
    // },

    // {
    //   icon: "arrow_upward",
    //   "tooltip": "Select Supplier",
    //   function: this.getsupplierpopup.bind(this)
    // },


    { icon: "download", "tooltip": "Report Download", function: this.downloadpopup.bind(this) }]

    this.ecf_approval_branch = {
      label: "Raiser Branch",
      method: "get",
      url: this.ecfmodelurl + "usrserv/search_branch",
      params: "",
      searchkey: "query",
      displaykey: "name",
    };
    this.ecf_approval_Supplier_name = {
      label: "Supplier Name",
      searchkey: "query",
      displaykey: "name",
      url: this.ecfURL + "venserv/landlordbranch_list",
      params: "&query=",
      Outputkey: "id",
      // formkey: "id"
    };

   

    this.batch_Batch_Status = {
      label: "Batch Status",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/get_ecfstatus",
      params: "&batch=true",
      searchkey: "name",
      displaykey: "text",
      outputkey: "id",
      formkey: "id"
    };
    this.ECF_Wise_Approvalsumbutton = [
      {
        icon: "filter_list", "tooltip": "Show More",
        function: this.approval_filter.bind(this)
      },
      {
      icon: "arrow_upward", "tooltip": "Select Supplier",
      function: this.approval_supplier.bind(this)
    },
   
    {
      icon: "download", "tooltip": "Report Download",
      function: this.downloadpopupapproval.bind(this),
    }]

    // this.SummaryApisupplierwiseObjNew = {
    //   method: "post",
    //   url: this.url + "ecfapserv/vow_summary",
    //   data: {}
    // }


  }

  ngOnInit(): void {
    this.ecfSearchForm = this.fb.group({
      type: 1,
      crno: [''],
      aptype: [''],
      apstatus: [''],
      ecfstatus: [''],
      minamt: [''],
      maxamt: [''],
      branch: [''],
      batchno: [''],
      supplier: [''],
      invoice_no: [''],
      commodity_id: [''],
      start_date: [''],
      end_date: [''],

    })

    this.ecfstatuss = {
      label: "ECF Status",
      searchkey: "query",
      displaykey: "text",
      // displaykey: " notename:new FormControl(''),text",
      url: this.ecfURL + "ecfapserv/get_inventory_status",
      Outputkey: "id",
      formcontrolname: "ecfstatus",
      valuekey: "id",
      id: "ecfap-0023"
    }
    // this.summarysearchecf()
    // this.approvalsummary()
    this.batchSearchForm = this.fb.group({
      type: 2,
      batchno: [''],
      fromdate: [''],
      todate: [''],
      batchcount: [''],
      batchstatus: [''],
      branch: ['']
    })
    this.SupplierWiseECFForm = this.fb.group({
      type: 3,
      crno: [''],
      aptype: [''],
      apstatus: [''],
      ecfstatus: [''],
      branch: [''],
      batchno: [''],
      supplier_id: [''],
      invoice_no: [''],
      commodity_id: [''],

    })

    this.ecfapprovalform = this.fb.group({
      type: true,
      crno: [''],
      aptype: [''],
      apstatus: [''],
      minamt: [''],
      maxamt: [''],
      commodity_id: [''],
      supplier:[''],
      branch: [''],
      purpose:[''],
      start_date: [''],
      end_date: [''],
    })

    this.ecf_approval_commodity = {
      label: "Commodity",
      searchkey: "name",
      displaykey: "name",
      url: this.ecfURL + "mstserv/commoditysearch",
      params: "&name=&code=",
      valuekey: "id",
      formkey: "id",
      formcontrolname: "commodity_id",
    };
      this.approval_report = {
       label: "Report Status",
       method: "get",
       url: this.ecfmodelurl + "ecfapserv/get_status",
       params: "&type=common_summary",
       displaykey: "text",
       formkey: "id",
       Outputkey: "id",
       valuekey: "id",
       formcontrolname: "apstatus",
       id:"ecfap-0092"
      }
    this.approval_frtodate = {
      fromobj: { label: 'Transaction From', "formcontrolname": "start_date" },
      toobj: { label: 'Transaction To', "formcontrolname": "end_date" },
    };

     


    this.batchapprovalform = this.fb.group({
      type: false,
      batchno: [''],
      fromdate: [''],
      todate: [''],
      batchcount: [''],
      batchstatus: [''],
      branch: ['']
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
      crno: [''],
      apinvoiceheader_crno: [''],
      ecftype: ['']
    })

    this.PFSearchForm = this.fb.group({
      supplier_id: [''],
      crno: [''],
      apinvoiceheader_crno: [''],
      ecftype: ['']
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
    this.frmLiq = this.fb.group({
      advno: [''],
      supplier: [''],
      amount: ['']

    })

    this.SupplierDetailForm = this.fb.group({
      invoiceno: [''],
      invoicedate: [''],
      supplier_name: [''],
      suppliergst: [''],
      pincode: [''],
      address: ['']
    })
    this.frmCreateTemp = this.fb.group({
      invoiceno: [''],
      invoicedate: [''],
      totalamount: [''],
      invoiceamount: [''],
      filevalue: new FormArray([])
      
    })
    this.CommonRptDwnldForm = this.fb.group({
      crno:[''],
      invoiceheader_crno: [''],
      aptype:[''],
      apstatus:[''],
      minamt:[''],
      maxamt:[''],
      invoice_no :[''],
      batch_no :[''],
      invoice_amount :[''],
      branchdetails_id  :[''],
      raiser_name: [''],
      commodity_id:[''],
      supplier_id:[''],
      branch:[''],
      purpose:[''],
      start_date:[''],
      end_date:[''],
      suppliergst_no:[''],
      apinvoiceheaderstatus_id:[''],
    })

    this.frmECFReportSummary = this.fb.group({
      aptype: [''],
      report_type:[''],
      supplier_id:[''],
      raiserbranch:[''],
      apinvoiceheaderstatus_id:[''],
      raisedby:[''],
      from_date: [''],
      to_date: [''],
      branchdetails_id: [''],
    })

    this.choose_supplier_field_common_report = {
      label: "Supplier",
      method: "get",
      url: this.ecfmodelurl + "venserv/search_suppliername_ecf",
      params: "&sup_id=&name=",
      searchkey: "name",
      displaykey: "name",
      wholedata: true,
      required: true,
      formcontrolname: "supplier_id",
      id: "ecfap-0260"
    };

    this.ecf_approval_commonbranch_common_report = {
      label: "Raiser Branch",
      method: "get",
      url: this.ecfmodelurl + "usrserv/search_branch",
      params: "",
      searchkey: "query",
      displaykey: "codename",
      // formkey: "id",
      Outputkey: "id",
      // prefix: 'code',
      // separator: "hyphen",
      formcontrolname: "branchdetails_id",
    };


    this.raiser_common_report = {
      label: "Raiser",
      method: "get",
      url: this.ecfmodelurl + "usrserv/memosearchemp",
      params: "",
      searchkey: "query",
      displaykey: "full_name",
      formcontrolname: "raiser_name",
      Outputkey: "id"
      // formkey: "id"
    };


    // this.ecfstatuss_common_report = {
    //   label: "ECF Status",
    //   searchkey: "query",
    //   displaykey: "text",
    //   url: this.ecfURL + "ecfapserv/get_inventory_status",
    //   Outputkey: "id",
    //   formcontrolname: "ecfstatus",
    //   valuekey: "id",
    //   id: "ecfap-0023"
    // }

    this.approval_frtodate_common_report = {
      fromobj: { label: 'Transaction From', "formcontrolname": "start_date" },
      toobj: { label: 'Transaction To', "formcontrolname": "end_date" },
    };
    this.getradio(1)
    this.getradioold(2);

    this.activatedroute.queryParams.subscribe(
      params => {
        if (params) {
          if (params.comefrom == "batchview") {
            this.ecfsummaryForm = true
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
            this.CommonSummaryForm = false;
            this.ecfapprovalsummaryForm = false
            this.ecfapprovalviewForm = false
            this.AppInvoiceDetailViewForm = false
            this.getradio(2);
            this.dataclear('')

          }

          else if (params.comefrom == "invoicedetail") {
            this.ecfsummaryForm = true
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
            this.getradio(1);
            this.dataclear('')
          }
          else if (params.comefrom == "invoicedetailview") {
            this.ecfviewForm = true
          }
          this.summarysearch('', 1);
          // this.batchsummarysearch(1);
        }
        else if (params.comefrom == "common") {
          this.ecfsummaryForm = true
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
          this.dataclear('')
          this.SpinnerService.show()
          this.ecfservices.getdd(params?.name)
            .subscribe(result => {
              if (result) {
                result.name = result.branch_name
                this.branchrole = {'id' : result.id, 'name': result.branch_name, 'code' : result?.code}
                
                this.enable_ddl = result?.enable_ddl
                 if(this.enable_ddl == false){                  
                   this.commonForm.controls['branchdetails_id'].setValue(this.branchrole)
                   this.CommonRptDwnldForm.controls['branchdetails_id'].setValue(this.branchrole)
                  //  this.SummaryApicommonecfObjNew = {
                  //    method: "post",
                  //    url: this.url + "ecfapserv/ecfap_common_summary",
                  //    params: "",
                  //    data: {"branchdetails_id":this.branchrole}
                  //  }
                 }

                const getToken = localStorage.getItem("sessionData")
                let tokendata = JSON.parse(getToken)
                this.ecfservices.getempModuleRole({ "employee_id": tokendata.employee_id, "module": "ECF Claim" })
                  .subscribe(result => {
                    if (result) {
                      this.SpinnerService.hide()
                      this.empModuleRoles = result
                      this.COPermission = result.filter(x => x == "CO Permission").length
                      this.DOPermission = result.filter(x => x == "DO Permission").length
                      if (this.COPermission > 0) {
                        this.MakerPermFlg = false
                      }
                      else if (this.DOPermission > 0) {
                        this.MakerPermFlg = false
                      }
                      else if (this.COPermission == 0 && this.DOPermission == 0) {
                        this.MakerPermFlg = true
                        // this.commonForm.controls['raiserbranch_id'].setValue(this.branchrole)
                        // this.CommonRptDwnldForm.controls['raiserbranch_id'].setValue(this.branchrole)
                      }

                      this.resetcommon('')
                    }
                  })
              }
            })


        }

        let comefrom = this.shareservice.comefrom.value
        if (comefrom == "bounce") {
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
          this.BounceSummaryForm = false;
          this.BounceDetailForm = false
          this.InvoiceDetailViewForm = false
          this.CommonSummaryForm = true
          this.ecfapprovalsummaryForm = false
          this.ecfapprovalviewForm = false
          this.AppInvoiceDetailViewForm = false
          this.dataclear('')
          // this.bounceSummarySearch(1)
        }

        if (params.comefrom == "batchappview") {
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
          this.CommonSummaryForm = false;
          this.ecfapprovalsummaryForm = true
          this.ecfapprovalviewForm = false
          this.AppInvoiceDetailViewForm = false
          this.dataclear('')
          this.getradioold(2);
          this.ecfapprovalsummarysearch(1)
          // this.batchappsummarysearch(1)
          this.batchsummary("")

        }
      })
    const getToken = localStorage.getItem("sessionData")
    let tokendata = JSON.parse(getToken)

    this.createdbyid = tokendata.employee_id
    let datas = this.sharedService.menuUrlData;


    datas?.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "ECF Claim") {
        this.ECF_Sub_Menu_List = subModule;
        console.log("ECF_Sub_Menu_List", this.ECF_Sub_Menu_List);
        if (this.ECF_Sub_Menu_List?.length > 0) {
          this.ECF_Sub_Menu_List.forEach(sub => sub.active = false);
          const defaultTab = this.ECF_Sub_Menu_List.find(sub => sub.name === 'ECF Inventory');
          console.log("defaultTab", defaultTab);
          if (defaultTab) {
            defaultTab.active = true;
            this.selectedSubmoduleName = defaultTab.name;           
          }
          this.ecfsummaryForm = true
          // this.get_dd(defaultTab?.name)
          // console.log("defaultTab_name", defaultTab?.name);
        }
      }
    });


    this.ecfradioForm = this.fb.group({
      type: [2]
    })

    this.ApproverForm = this.fb.group({
      approvedby: [''],
      approvedbranch: ['']
    })

    this.commonForm = this.fb.group({
      crno: [''],
      batch_no: [''],
      invoiceheader_crno: [''],
      aptype: [''],
      raiser_name: [''],
      branchdetails_id: [''],
      supplier: [''],
      invoice_no: [''],
      invoice_amount: [''],
      minamt: [''],
      maxamt: [''],
      apinvoiceheaderstatus_id: [''],
      start_date: [''],
      end_date: [''],
      suppliergst_no: [''],
      invoice_status: [''],
    })

    this.ECFinvRptDwnldForm = this.fb.group({
      crno: [''],
      aptype: [''],
      apstatus: [''],
      ecfstatus: [''],
      minamt: [''],
      maxamt: [''],
      branch:[''],
      batchno:[''],
      supplier_id:[''],
      invoice_no:[''],
      commodity_id:[''],
      start_date:[''],
      end_date:[''],
    })

    this.supplydown = {
      label: "Supplier",
      method: "get",
      url: this.ecfmodelurl + "venserv/search_suppliername_ecf",
      params: "&sup_id=&name=",
      searchkey: "name",
      displaykey: "name",
      wholedata: true,     
      // Outputkey: "id",
      formcontrolname: "supplier_id",
      id:"ecfap-0167"
    }
    this.branchdown = {
      label: "Branch",
      method: "get",
      url: this.ecfURL + "usrserv/search_branch",
      params: "&query",
      searchkey: "query",
      displaykey: "codename",
      Outputkey: "id",
      id: "ecfap-0027",
      formcontrolname: "branch",
      // suffix: 'code',
      // separator: "hyphen"
    }
    this.commoditydown = {
      label: "Commodity Name",
      method: "get",
      url: this.ecfURL + "mstserv/commoditysearch",
      params: "&name=&code=",
      searchkey: "query",
      displaykey: "name",
      Outputkey: "id",
      id: "ecfap-0028",
      formcontrolname: "commodity_id"
    }

    this.ECFAppRptDwnldForm = this.fb.group({
      crno:[''],
      aptype:[''],
      apstatus:[''],
      minamt:[''],
      maxamt:[''],
      commodity_id:[''],
      supplier_id:[''],
      branch:[''],
      purpose:[''],
      start_date:[''],
      end_date:[''],
    })

    this.choose_supplier_field_approve_report = {
      label: "Choose Supplier",
      method: "get",
      url: this.ecfmodelurl + "venserv/search_suppliername_ecf",
      params: "&sup_id=&name=",
      searchkey: "name",
      displaykey: "name",
      wholedata: true,
      // required: true,
      formcontrolname: "supplier_id",
      id: "ecfap-0260"
    };

    this.ecf_approval_commonbranch_approve_report = {
      label: "Branch",
      method: "get",
      url: this.ecfmodelurl + "usrserv/search_branch",
      params: "",
      searchkey: "query",
      displaykey: "codename",
      // formkey: "id",
      Outputkey: "id",
      formcontrolname: "branch",
      // suffix: 'code',
      // separator: "hyphen"
    };

    this.ecf_approval_commodity_approve_report = {
      label: "Commodity",
      searchkey: "name",
      displaykey: "name",
      url: this.ecfURL + "mstserv/commoditysearch",
      params: "&name=&code=",
      valuekey: "id",
      formkey: "id",
      formcontrolname: "commodity_id",
    };
    this.approval_frtodate_approve_report = {
      fromobj: { label: 'Transaction From', "formcontrolname": "start_date" },
      toobj: { label: 'Transaction To', "formcontrolname": "end_date" },
    };
    this.commoninvoicestatustype = {
      label: "Invoice Status",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/get_common_status",
      params: "",
      searchkey: "query",
      displaykey: "text",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "invoice_status",
      // fronentdata: true,
      // data: this.commonStatusList,
    };

    this.frtodate = {
      fromobj: { label: 'Transaction From', "formcontrolname": "start_date" },
      toobj: { label: 'Transaction To', "formcontrolname": "end_date" },
    };

this.frtodatereport = {
      fromobj: { label: 'From Date', "formcontrolname": "from_date" },
      toobj: { label: 'To Date', "formcontrolname": "to_date" },
    };

    this.Invoice = {
      label: "Invoice Status",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/get_common_status",
      params: "",
      displaykey: "text",
      formkey: "id",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "invoice_status",
    }
    this.report_status = {
      label: "Report Status",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/get_ecfstatus",
      params: "&type=common_summary",
      displaykey: "text",
      formkey: "id",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "apinvoiceheaderstatus_id",
    }


    this.batchsubmitform = this.fb.group({
      'ecfhdr': this.fb.array([
        // this.fb.group({
        // 'id':new FormControl(''),
        // })
      ])
    })
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
    this.DebitDetailForm = this.fb.group({
      debitdtl: new FormArray([
      ])
    });


    this.getecftype();
    this.getinventorystatus();
    // this.getEcfstatus();
    this.getBatchstatus();
    this.get_commonAndECF_status();
    this.approval_report_status = {
      label: "Report Status",
      displaykey: "text",
      formkey: "id",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "apstatus",
      fronentdata: true,
      data: this.ApprovalStatusList
    }
    this.getsuppliername(this.suplist, '');
    this.getreptype();
     this.getcommodity('')  
     this.branchdropdown('')

     this.commonForm.get('branchdetails_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getDObranchscroll(value, this.branchrole.code, 1)
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
      this.frmECFReportSummary.get('branchdetails_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getDObranchscroll(value, this.branchrole?.code, 1)
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


    this.ecfSearchForm.get('supplier').valueChanges
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
        this.supplierNameData  = datas;

      })

      this.ECFinvRptDwnldForm.get('supplier_id').valueChanges
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
      // this.ECFAppRptDwnldForm.get('supplier_id').valueChanges
      // .pipe(
      //   debounceTime(100),
      //   distinctUntilChanged(),
      //   tap(() => {
      //     this.isLoading = true;
  
      //   }),
      //   switchMap(value => this.ecfservice.getsuppliernamescroll(this.suplist, value, 1, 1)
      //     .pipe(
      //       finalize(() => {
      //         this.isLoading = false
      //       }),
      //     )
      //   )
      // )
      // .subscribe((results: any[]) => {
      //   let datas = results["data"];
      //   this.supplierNameData = datas;
  
      // })
      this.ECFinvRptDwnldForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getcommodityscroll(value, 1)
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
    
      this.ECFAppRptDwnldForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getcommodityscroll(value, 1)
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

      this.CommonRptDwnldForm.get('supplier_id').valueChanges
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

      this.ecfSearchForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getcommodityscroll(value, 1)
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
      this.ecfapprovalform.get('supplier').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

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

      this.ecfapprovalform.get('branch').valueChanges
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
   
    this.ecfapprovalform.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getcommodityscroll(value, 1)
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
    this.commonForm.get('supplier').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.ecfservice.getsuppliernamescroll(this.suplist,value,1, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierNameData  = datas;

      })

    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']
    })

    this.createTempForm = this.fb.group({
      inv_crnos: [''],
      name: [''],
    })

    this.frmPaymentAdvisory = this.fb.group({
      crno: [''],
      supplier_id: [''],
      branch: [''],
      from_date: [''],
      to_date: ['']
    })

    this.frmECFReportSummary.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservice.getsupplierscroll(value,1)
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
  }
  // get_dd(data){
  //   this.ecfservices.getdd(data)
  //   .subscribe(result => {
  //      if (result) {
  //         this.enable_ddl = result?.enable_ddl
  //     }
  //   })
  // }
  getcommodityECFSumm() {
    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.ecfSearchForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getcommodityscroll(value, 1)
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
  getSupplierWisecommodity() {
    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.SupplierWiseECFForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getcommodityscroll(value, 1)
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
  public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.name : undefined;
  }

  get commoditytype() {
    return this.ecfSearchForm.get('commodity_id');
  }
  getcommodity(commoditykeyvalue) {
    this.ecfservices.getcommodity(commoditykeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.commodityList = datas;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
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
                this.ecfservices.getcommodityscroll(this.commodityInput.nativeElement.value, this.currentpage + 1)
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
  ecftypedata:any = ""
  ecfTypeChange(event) {
  console.log("ecftypeevent--->", event);
  if(event !== ''){
    this.ecftypedata = event.id
    console.log("ecftypedata--->", this.ecftypedata);
  }
  }
  ecfstatusdata:any = ""
  ecfStatusChange(event) {
  console.log("ecfstatusevent--->", event);
  if(event !== ''){
    this.ecfstatusdata = event.id
    console.log("ecfstatusdata--->", this.ecfstatusdata);
  }
  }
  approveecftypedata:any = ""
  approveecfTypeChange(event) {
  console.log("approveecfType--->", event);
  if(event !== ''){
    this.approveecftypedata = event.id
    console.log("approveecftypedata--->", this.approveecftypedata);
  }
  }
  approvalstatusdata:any = ""
  approveecfStatusChange(event) {
  console.log("approvestatusevent--->", event);
  if(event !== ''){
    this.approvalstatusdata = event.id
    console.log("approvalstatusdata--->", this.approvalstatusdata);
  }
  }
  commonecftypedata:any = ""
  commonecfTypeChange(event) {
  console.log("commonecfType--->", event);
  if(event !== ''){
    this.commonecftypedata = event.id
    console.log("commonecftypedata--->", this.commonecftypedata);
  }
  }
  commonstatusdata:any = ""
  commonecfStatusChange(event) {
  console.log("commonstatusevent--->", event);
  if(event !== ''){
    this.commonstatusdata = event.id
    console.log("commonstatusdata--->", this.commonstatusdata);
  }
  }

  getecftype() {
    this.ecfservice.getecftype()
      .subscribe(result => {
        if (result['data'] != undefined) {
          let ecftypes = result["data"]
          this.TypeList = ecftypes.filter(type => type.id != 1 && type.id != 6)
          this.ecfsuptype = {
            label: "ECF Type",
            searchkey: "query",
            displaykey: "text",
            fronentdata: true,
            data: this.TypeList,
            // data: this.Ecf_type,
            Outputkey: "id",
            // fronentdata: true,
            formcontrolname: "aptype"
          }
          this.typedown = {
            label: "ECF Type",
            searchkey: "query",
            displaykey: "text",
            // Outputkey: "id",
            wholedata: true,
            fronentdata: true,
            data: this.TypeList,
            // valuekey: "id",
            id:"ecfap-0022",
            formcontrolname: "aptype"
            };
          this.ecfemptype = {
            label: "ECF Type",
            searchkey: "query",
            displaykey: "text",
            fronentdata: true,
            data: this.TypeList,
            // data: this.Ecf_type,
            Outputkey: "id",
            // fronentdata: true,
          }
          // this.summarysearchecf()
          // this.ecfdroptype = {
          //   label: "ECF Type",
          //   params: "",
          //   searchkey: "query",
          //   displaykey: "text",
          //   Outputkey: "id",
          //   fronentdata: true,
          //   data: this.TypeList,
          // };
          this.ecfdroptype = {
            label: "ECF Type",
            params: "",
            searchkey: "query",
            displaykey: "text",
            Outputkey: "id",
            fronentdata: true,
            data: this.TypeList,
            valuekey: "id",
            id: "ecfap-0173",
            formcontrolname: "aptype"
            };

            this.ecfreporttype = {
            label: "Report Type",
            params: "",
            searchkey: "query",
            displaykey: "text",
            Outputkey: "id",
            fronentdata: true,
            data: this.reportList,
            valuekey: "id",
            id: "ecfap-0173",
            formcontrolname: "report_type"
            };

          this.ecf_approval_type = {
            label: "ECF Type",
            params: "",
            searchkey: "query",
            displaykey: "text",
            fronentdata: true,
            data: this.TypeList,
            Outputkey: "id",
            // formkey: "id",
          }
          // this.approvalsummary()
          this.ecf_approval_type_approver_report = {
            label: "ECF Type",
            params: "",
            searchkey: "query",
            displaykey: "text",
            fronentdata: true,
            data: this.TypeList,
            // Outputkey: "id",
            wholedata: true,
            // formkey: "id",
          }
          // this.commonsumfunc()

          this.Summaryecfwisedata = [
            {columnname: "Invoice Type", key: "aptype",type: "object",objkey: "text",headicon: true, headerdicon: "filter_list", headertype: 'headoptiondropdown',payloadkey: "aptype",
                inputobj: {
                label: "Invoice Type",
                params: "",
                searchkey: "query",
                displaykey: "text",
                Outputkey: "id",
                fronentdata: true,
                data: this.TypeList,
                valuekey: "id",
                formcontrolname: "aptype"
              },
              validate: true, validatefunction: this.ecfwisecolumn.bind(this),function:true,
              clickFunction: this.ecfwisesearch.bind(this)
              },
              {
                columnname: "CR No",
                key: "crno",
                // validate: true,
                payloadkey: "crno",
                headicon: true,
                headertype: "headinput",
                label: "search",
                headerdicon: "filter_list",
                clickFunction: this.ecfwisesearch.bind(this),
                inputicon: "search",
                // function:true,
                // validatefunction: this.ecfwisecolumn2.bind(this),
              },
              {
                columnname: "ECF Date",
                key: "apdate",
                type: "Date",
                datetype: "dd-MMM-yyyy",
              },
              { columnname: "Branch", key: "branch", 
                // array: true, 
                type: "object", objkey: "name_code" ,
                // validate: true,
                // validatefunction: this.branch_sum_data.bind(this),
                headicon: true,
                headertype: "headdropdown",
                // headerdicon: "filter_list",

                payloadkey: "branch",
                inputobj: {
              label: "Branch",
              method: "get",
              url: this.ecfURL + "usrserv/search_branch",
              params: "",
              searchkey: "query",
              displaykey: "fullname",
              Outputkey: "id",
              formcontrolname: "branch",
              // suffix: "code",
              // separator: "hyphen",

            }
          ,
                clickFunction: this.ecfwisesearch.bind(this),
              },
              {
                columnname: "Commodity Name",
                key: "commodity_id",
                type: "Object",
                objkey: "name",
                // validate: true,
                // validatefunction: this.com_data.bind(this),
                headicon: true,
                headertype: "headdropdown",
                headerdicon: "filter_list",
                payloadkey: "commodity_id",
                inputobj: {
                  label: "Commodity Name",
              method: "get",
              url: this.ecfURL + "mstserv/commoditysearch",
              params: "&name=&code=",
              searchkey: "query",
              displaykey: "name",
              Outputkey: "id",
              formcontrolname: "commodity_id",
                },
                clickFunction: this.ecfwisesearch.bind(this),
              },
              // { "columnname": "Batch No", "key": "batch_no", function: true, validate: true, validatefunction: this.ecfwisecolumn3.bind(this) },
              // { "columnname": "Supplier", "key": "supplier_data", "type": "Object", "objkey": "name" },label: "Supplier",
                // method: "get",
                // url: this.ecfmodelurl + "venserv/landlordbranch_list",
                // params: "",
                // searchkey: "query",
                // displaykey: "name",
                // Outputkey: "id",
              {
                columnname: "Supplier",
                key: "supplier_data",
                validate: true,
                validatefunction: this.supply_data.bind(this),
                headicon: true,
                headertype: "headdropdown",
                headerdicon: "filter_list",
                payloadkey: "supplier_id",
                inputobj: {
                  label: 'Supplier',
                  method: 'get',
                  url: this.url + 'venserv/landlordbranch_list',
                  params: '',
                  searchkey: 'query',
                  displaykey: 'name',
                  formcontrolname: "supplier_id",
                  Outputkey: "id",
                },
                clickFunction: this.ecfwisesearch.bind(this),
              },
              { columnname: "ECF Amount", key: "apamount", prefix: "₹", type: "Amount", style: {"display":"flex","justify-content" : "end"} },
              { columnname: "ECF Status", key: "ecfstatus", type: "object", objkey: "text","headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
                payloadkey: "ecfstatus",
                inputobj:{
                label: "ECF Status",
                searchkey: "query",
                displaykey: "text",
                // displaykey: " notename:new FormControl(''),text",
                url: this.ecfURL + "ecfapserv/get_inventory_status",
                Outputkey: "id",
                formcontrolname: "ecfstatus",
                valuekey: "id",
              },
                clickFunction: this.ecfwisesearch.bind(this),function:true,
                //  validate: true, validatefunction: this.statuscommon_data.bind(this),
              },
              { columnname: "Remarks", key: "remark",
                // validate: true,
                // validatefunction: this.ecfvalidateremdata.bind(this)
              },
              {
                columnname: "",
                key: "View",
                tooltip: true,
                icon: "visibility",
                button: true,
                style: { cursor: "pointer", color: "green" },
                function: true,
                clickfunction: this.showview.bind(this),

              },
              {
                columnname: "",
                key: "Edit",
                tooltip: true,
                button: true,
                function: true,
                clickfunction: this.showedit.bind(this),
                validate: true,
                validatefunction: this.ecfwisecolumn5.bind(this),
              },
              {

                columnname: "Action",
                key: "Download",
                tooltip: true,
                button: true,
                function: true,
                clickfunction: this.ecf_summary_data_coverNotedownload.bind(this),
                validate: true,
                validatefunction: this.ecfwisecolumn6.bind(this),
              },
              {
                columnname: "",
                key: "Inactive",
                tooltip: true,
                button: true,
                function: true,
                clickfunction: this.delete.bind(this),
                validate: true,
                validatefunction: this.ecfwisecolumn8.bind(this),
              },
              {
                columnname: "",
                key: "Clone",
                button: true,
                tooltip: true,
                function: true,
                clickfunction: this.createTemp.bind(this),
                validate: true,
                validatefunction: this.ecfwisecolumn9.bind(this),
              },
            ];

            this.ecpappsumdata = [
    {
      columnname: "Invoice Type",
      key: "aptype",
      headicon: true, headerdicon: "filter_list", headertype: 'headoptiondropdown',payloadkey: "aptype",
      inputobj: {
      label: "Invoice Type",
      params: "",
      searchkey: "query",
      displaykey: "text",
      Outputkey: "id",
      fronentdata: true,
      data: this.TypeList,
      valuekey: "id",
      formcontrolname: "aptype"
    },
    clickFunction: this.ecfsummarysearch.bind(this),
      // validate: true,
      // validatefunction: this.ecf_type.bind(this),
    },
    {
      columnname: "CR No",
      key: "crno",
      // validate: true,
      // validatefunction: this.crn_no.bind(this),
      payloadkey: "crno",
      headicon: true,
      headertype: "headinput",
      label: "search",
      headerdicon: "filter_list",
      clickFunction: this.ecfsummarysearch.bind(this),
      inputicon: "search",
      // inputtooltip: "search",
    },
    // {
    //   columnname: "Raiser Branch",
    //   key: "raiser",
    //   validate: true,
    //   validatefunction: this.branch_name.bind(this),
    // },
    {
      columnname: "ECF Date",
      key: "apdate",
      type: "Date",
      datetype: "dd-MMM-yyyy",
    },
    {
      columnname: "Branch",
      key: "branch",
      // array: true,
      "type": "object", "objkey": "name_code",
      //   validate: true,
      // validatefunction: this.branch_search_data.bind(this),
      headicon: true,
      headertype: "headdropdown",
      // headerdicon: "filter_list",
      payloadkey: "branch",
    inputobj: {
    label: "Branch",
    method: "get",
    url: this.ecfURL + "usrserv/search_branch",
    params: "",
    searchkey: "query",
    displaykey: "fullname",
    Outputkey: "id",
    formcontrolname: "branch",
    // suffix: "code",
    // separator: "hyphen",
  },
      clickFunction: this.ecfsummarysearch.bind(this),
      
    },
    {
      columnname: "Commodity",
      key: "commodity_id",
      type: "object",
      objkey: "name",
      // validate: true,
      // validatefunction: this.com_app_data.bind(this),
      headicon: true,
      headertype: "headdropdown",
      headerdicon: "filter_list",
      payloadkey: "commodity_id",
      inputobj: {
         label: "Commodity Name",
    method: "get",
    url: this.ecfURL + "mstserv/commoditysearch",
    params: "&name=&code=",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
    formcontrolname: "commodity_id",
      },
      clickFunction: this.ecfsummarysearch.bind(this),
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
      formcontrolname: "supplier"
    },
        validate: true, validatefunction: this.apsuppliers_data.bind(this),      clickFunction: this.ecfsummarysearch.bind(this),

    },
    { columnname: "ECF Amount", key: "apamount", prefix: "₹", type: "Amount",style: {"display":"flex","justify-content" : "end"} },
    {
      columnname: "ECF Status",
      key: "ecfstatus",
      type: "object",
      objkey: "text",
    },
    { columnname: "Remarks", key: "remark", tooltip: true},
// { columnname: "Remarks", key: "remark", tooltip: true,validate: true,
//       payloadkey: "purpose",
//       headicon: true,
//       headertype: "headinput",
//       label: "search",
//       headerdicon: "filter_list",
//       clickFunction: this.ecfsummarysearch.bind(this),
//       inputicon: "search",
//       function:true,
//       validatefunction: this.remark_data.bind(this)},
    {
      columnname: "Transaction Details",
      key: "Transaction Details",
      tooltip: true,
      icon: "swap_horiz",
      style: { cursor: "pointer" },
      button: true,
      function: true,
      clickfunction: this.transaction_summary.bind(this),
    },
    {
      columnname: "Action",
      key: "Action",
      tooltip: true,
      icon: "arrow_forward",
      style: { cursor: "pointer" },
      button: true,
      function: true,
      clickfunction: this.shoowaction.bind(this),
    },
    // {
    //   columnname: "Covernote", key: "covernote", button: true,
    //   icon: "download", "style": { color: "green", cursor: "pointer" },
    // validate: true, validatefunction: this.covernote.bind(this), function: true, clickfunction: this.approver_ecf_data_coverNotedownload_click.bind(this)
    // }
  ];
              this.SummarycommonecfData = [
     {columnname: "Invoice Type", key: "aptype",type: "object",objkey: "text",headicon: true, headerdicon: "filter_list", headertype: 'headoptiondropdown',payloadkey: "aptype",
      inputobj: {
      label: "Invoice Type",
      params: "",
      searchkey: "query",
      displaykey: "text",
      Outputkey: "id",
      fronentdata: true,
      data: this.TypeList,   
      valuekey: "id",
      formcontrolname: "aptype"
    },
    // validate: true, validatefunction: this.dynamicform.bind(this),
    function:true,
    clickFunction: this.commonsumSearch.bind(this)
    },

    { columnname: "Invoice CR No", key: "apinvoiceheader_crno",payloadkey: "invoiceheader_crno","headicon": true, headertype: 'headinput',
       label: "Invoice CR No", headerdicon: "filter_list", clickFunction: this.commonsumSearch.bind(this),inputicon: "search",
       function: true, clickfunction: this.linkView.bind(this), "style": { color: " #3684BF", cursor: "pointer" },
      // validate: true, validatefunction: this.linkcolor.bind(this),
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
      formcontrolname: "supplier_id"
    },
      clickFunction: this.commonsumSearch.bind(this),function:true,
      validate: true, validatefunction: this.suppliers_data.bind(this),
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
      formcontrolname:"raiser_name"

    },
    clickFunction: this.commonsumSearch.bind(this),function:true,
    // validate: true, validatefunction: this.raisercommon_data.bind(this),
     },

   { columnname: "Raiser Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", "headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
                  payloadkey: "raiserbranch_id",
                  inputobj:{
                    label: " Branch",
                    method: "get",
                    url: this.ecfmodelurl + "usrserv/search_branch",
                    params: "",
                    searchkey: "query",
                    displaykey: "fullname",
                    Outputkey: "id",
                    // prefix: 'code',
                    // separator: "hyphen",
                    formcontrolname:"raiserbranch_id"
                  },
                  clickFunction: this.commonsumSearch.bind(this),function:true,
                //  validate: true, validatefunction: this.branchcommon_data.bind(this),
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
              }, clickFunction: this.commonsumSearch.bind(this),
              // validate: true, validatefunction: this.raiser_branch_data.bind(this),
            },
    { columnname: "Invoice No", key: "invoice_no", payloadkey: "invoice_no", "headicon": true, headertype: 'headinput',
     label: "Invoice No", headerdicon: "filter_list", clickFunction: this.commonsumSearch.bind(this), inputicon: "search",
    //  validate: true, validatefunction: this.invoicecommon_data.bind(this),
    },

    { columnname: "Transaction Date", key: "apdate", "type": 'Date', "headicon": true, payloadkey_1: "start_date", payloadkey_2: "end_date",
      common_key:{ecf_date: "ecf_date"}, label1: "Start Date",label2:"End Date", headerdicon: "date_range", headertype: 'startendDate', 
      "datetype": "dd-MMM-yyyy" , clickFunction: this.commonsumSearch.bind(this),
      //  validate: true, validatefunction: this.datecommon_data.bind(this),
       },
     
      { columnname: "Invoice Amount", prefix: "₹",  key: "totalamount",type: 'Amount', headicon: true, headinput: true, headerdicon: "filter",
      headertype: 'minmaxAmnt', payloadkey_1: "minamt",payloadkey_2: "maxamt",common_key: {inv_amount: "inv_amount"},label1: "Min Amount",
      label2: "Max Amount", clickFunction: this.commonsumSearch.bind(this),inputicon: "search", style: {"display":"flex","justify-content" : "end"}
      //  validate: true, validatefunction: this.amountcommon_data.bind(this),
      },

    { columnname: "Invoice Status", key: "apinvoicehdr_status", type: "object", objkey: "text","headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
      payloadkey: "apinvoiceheaderstatus_id",  
      inputobj:{
      label: "Invoice Status",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/get_common_status",
      params: "",
      // fronentdata: true,
      // data: this.sctcommonstatus,  
      searchkey: "query",
      displaykey: "text",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "apinvoiceheaderstatus_id"
    },
       clickFunction: this.commonsumSearch.bind(this),function:true,
        // validate: true, validatefunction: this.statuscommon_data.bind(this),
     },
    // { columnname: "AP Status", key: "mono_ap_status",  },
    // { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy"},
     { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "headicon": true, payloadkey_1: "invoice_from_date", payloadkey_2: "invoice_to_date",
      common_key:{ecf_date: "ecf_date"}, label1: "Start Date",label2:"End Date", headerdicon: "date_range", headertype: 'startendDate', 
      "datetype": "dd-MMM-yyyy" , clickFunction: this.commonsumSearch.bind(this),
      //  validate: true, validatefunction: this.datecommon_data.bind(this),
       },
    { "columnname": "GST No", "key": "supplier_data", "type": "object", "objkey": "gstno" },

    {"columnname": "View Entry", "key": "apinvoicehdr_status", function: true, validate: true,tooltip:true,
      button: true, validatefunction: this.ecfviewentry.bind(this), clickfunction: this.CommonViewEntry.bind(this)
    },

    {columnname: "Download Covernote", icon: "download", "style": { color: "green", cursor: "pointer" },tooltip:true,
      button: true, function: true, clickfunction: this.coverNotedownload_common_click.bind(this),
      validate: true, validatefunction: this.downloadcovernote.bind(this),
    }
  ]
          this.ecf_approval_type_common_report = {
            label: "ECF Type",
            params: "",
            searchkey: "query",
            displaykey: "text",
            fronentdata: true,
            data: this.TypeList,
            // Outputkey: "id",
            wholedata:true
            // formkey: "id",
          }

          if (!this.branchrole || this.branchrole === "") {
            this.ecf_approval_commonbranch = {
              label: "Branch",
              method: "get",
              url: this.ecfmodelurl + "usrserv/search_branch",
              params: "",
              searchkey: "query",
              displaykey: "name",
              // formkey: "id",
              Outputkey: "id",
              suffix: 'code',
              separator: "hyphen"
            };
          }
          else {
            this.ecf_approval_commonbranch = {
              label: "Branch",
              method: "get",
              url: this.ecfmodelurl + "usrserv/search_branch",
              params: '&co_branch_code=' + this.branchrole.code,
              searchkey: "query",
              displaykey: "name",
              // formkey: "id",
              Outputkey: "id",
              suffix: 'code',
              separator: "hyphen"
            };
          }
          
    this.ecfsearches = [
    { "type": "input", "label": "CR No","formvalue": "crno" },
    { "type": "dropdown", inputobj: this.supplier_data, "formvalue": "supplier_id" },
    { "type": "input", "label": "Invoice No", "formvalue": "invoice_no" },
    { "type": "dropdown", inputobj: this.ecfsuptype, "formvalue": "aptype" },
    { "type": "dropdown", inputobj: this.ecfstatus, "formvalue": "ecfstatus" },
    { "type": "dropdown", inputobj: this.branches, "formvalue": "branch" },
    { "type": "dropdown", inputobj: this.commoditys, "formvalue": "commodity_id" },
  ]

  this.ecfreport = [
    { "type": "dropdown",inputobj:this.ecf_report_type,"formvalue": "report_type" },
    { "type": "dropdown", inputobj: this.reportbranch, "formvalue": "branchdetails_id" },
    // { "type": "date", inputobj: this.frtodatereport },
    {
      type: "twodates",
      fromobj: { label: "From Date", formvalue: "from_date" },
      toobj: { label: "To Date", formvalue: "to_date" },
    }
  ]

  this.ecfsearch = [
    { "type": "input", "label": "CR No","formvalue": "crno" },
    { "type": "dropdown", inputobj: this.supplier_data, "formvalue": "supplier_id" },
    { "type": "input", "label": "Invoice No", "formvalue": "invoice_no" },
    { "type": "dropdown", inputobj: this.ecfemptype, "formvalue": "aptype" },
    // { "type": "dropdown", inputobj: this.ecfstatus, "formvalue": "ecfstatus" },
    // { "type": "dropdown", inputobj: this.branchs, "formvalue": "branch" },
    // { "type": "dropdown", inputobj: this.commodity, "formvalue": "commodity_id" },
  ]
          // this.commonsearchsearch = [
          //   { "type": "input", "label": "Invoice CR No", "formvalue": "invoiceheader_crno" },
          //   { "type": "dropdown", inputobj: this.supplierfield, "formvalue": "supplier_id" },
          //   { "type": "dropdown", inputobj: this.commonbranch, "formvalue": "raiserbranch_id" },
          //   { "type": "dropdown", inputobj: this.raiser, "formvalue": "raiser_name" },
          //   // { "type": "dropdown", inputobj: this.ecfdroptype, "formvalue": "aptype" },
          // ]
          this.ECF_Wise_Approval = [{ "type": "input", "label": "CR No", "formvalue": "crno" },
          { "type": "dropdown", inputobj: this.ecf_approval_Supplier_name, "formvalue": "supplier_id" },
          { "type": "dropdown", inputobj: this.ecf_approval_commonbranch, "formvalue": "branch" },
          { "type": "dropdown", inputobj: this.ecf_approval_type, "formvalue": "aptype" },
          // { "type": "dropdown", inputobj: this.ecf_approval_commodity, "formvalue": "commodity_id" }
        ]

          this.Batch_Wise_Approval = [{ "type": "input", "label": "Batch No", "formvalue": "batchno" },
          { "type": "dropdown", inputobj: this.batch_Batch_Status, "formvalue": "batchstatus" },
          { "type": "input", "label": "ECF Count", "formvalue": "batchcount" },
          { "type": "dropdown", inputobj: this.ecf_approval_commonbranch, "formvalue": "branch" }]
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getRaiserbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    if (this.COPermission == 0 && this.DOPermission > 0) {
      this.CommonRptDwnldForm.get('branchdetails_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),

          switchMap(value => this.ecfservice.getDObranchscroll(value, this.branchrole.code, 1)
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
    else {
      this.commonForm.get('branchdetails_id').valueChanges
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
  }

    getsupplierbranch() {
    console.log("getsupplierbranch--->");
      this.ecfservice.getsupplierscroll('',1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierlist = datas;
      })
  }

  getSearchbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.ecfSearchForm.get('branch').valueChanges
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
      this.ECFinvRptDwnldForm.get('branch').valueChanges
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
      this.ECFAppRptDwnldForm.get('branch').valueChanges
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

  getbatchSearchbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.batchSearchForm.get('branch').valueChanges
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
  getSupplierWiseECFbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.SupplierWiseECFForm.get('branch').valueChanges
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
  getApprovalbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.ecfapprovalform.get('branch').valueChanges
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

  getbatchApprovalbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.batchapprovalform.get('branch').valueChanges
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

  branchdropdown(branchkeyvalue) {
    if (this.COPermission == 0 && this.DOPermission > 0) {
      this.ecfservice.getDObranch(branchkeyvalue, this.branchrole.code)
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
    else {
      this.ecfservice.getbranch(branchkeyvalue)
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


  get branchtype() {
    return this.bounceForm.get('branch_id');
  }
  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
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
                if (this.COPermission == 0 && this.DOPermission > 0) {
                  this.ecfservice.getDObranchscroll(this.raiserbrInput.nativeElement.value, this.branchrole.code, this.currentpage + 1)
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
                else {
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
            }
          });
      }
    });
  }


  get raiseBranchtype() {
    return this.bounceForm.get('raiserbranch_id');
  }


  getinventorystatus() {
    this.ecfservice.getInventoryStatus()
      .subscribe(result => {
        if (result['data'] != undefined) {
          let data = result["data"]
          this.StatusList = data.filter(x=> x.id != 5 && x.id != 7 && x.id != 43 && x.id != 44 && x.id != 45)
          this.statusdown = {
            label: "ECF Status",
            searchkey: "query",
            displaykey: "text",
            // Outputkey: "id",
            wholedata: true,
            fronentdata: true,
            data: this.StatusList,
            valuekey: "id",
            id:"ecfap-0023",
            formcontrolname: "ecfstatus",
          }; 
        
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getEcfstatus() {
    this.ecfservice.getecfstatus()
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.ApprovalStatusList.push(
            {
              "id": 48,
              "text": "ALL"
            })
          for (let i = 0; i < result["data"].length; i++) {
            this.ApprovalStatusList.push(result["data"][i])
          }
          this.approval_report_status = {
            label: "Report Status",
            params: "",
            displaykey: "text",
            formkey: "id",
            Outputkey: "id",
            valuekey: "id",
            formcontrolname: "apstatus",
            fronentdata: true,
            data: this.ApprovalStatusList
          }
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
  commonstatustype: any = { label: "ECF Status" };

  getStatus() {
    this.ecfservice.getStatus()
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.EcfStatusList = result["data"]
          this.commonstatustype = {
            label: "ECF Status",
            params: "",
            searchkey: "query",
            displaykey: "text",
            Outputkey: "id",
            valuekey: "id",
            fronentdata: true,
            formcontrolname: "apinvoiceheaderstatus_id",
            data: this.ecfStatusList,
          };
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  tranid : any
  gettranid(id){
    this.tranid = id
    this.gettran(1)
  }
  tranrecordscount = 0

  tranrecordsCurrentPage =1

  gettran( page =1) {
    // this.popupopenretun()
    this.name = ''; 
    this.designation = ''; 
    this.branch = ''; 
    this.popupopen7();
    this.tranrecords = []
    this.SpinnerService.show()

    this.ecfservice.getheadertransaction(this.tranid, page)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.tranrecords = result["data"]
          let pagination = result['pagination']
          this.tranrecordscount =pagination?.count
          if (this.tranrecords.length > 0) {
            this.length_tranrecords =pagination?.count
            this.tranrecordsCurrentPage = pagination.index;
          }
          this.transaction_summary('');
          this.SpinnerService.hide();
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  length_tranrecords = 0;
   pageSize_tranrecords = 10
   pageIndextranrecords=0
   handleTranrecords(event: PageEvent) {
     this.length_tranrecords = event.length;
     this.pageSize_tranrecords = event.pageSize;
     this.pageIndextranrecords = event.pageIndex;
     this.tranrecordsCurrentPage=event.pageIndex+1;
     this.viewtrn( this.tranrecordsCurrentPage);  
   }

  branchname() {
    this.ecfservices.getbranchscroll('', 1).subscribe(data => {
      this.branchList = data['data'];
    });
    this.ApproverForm.get('approvedbranch').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap((value: any) => this.ecfservices.getbranchscroll(value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.branchList = data['data'];
    });

  }

  getApprover() {
    let branch_id = this.ApproverForm.controls['approvedbranch'].value?.id ? this.ApproverForm.controls['approvedbranch'].value?.id : ""
    this.ecfservice.getECFapproverscroll(1, this.batchArray[0]?.commodity_id?.id, this.createdbyid, branch_id, '').subscribe(data => {
      this.ApproverList = data['data'];
    });
    this.ApproverForm.get('approvedby').valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap((value: any) => this.ecfservice.getECFapproverscroll(1, this.batchArray[0]?.commodity_id?.id, this.createdbyid, branch_id, value).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.ApproverList = data['data'];
    });

  }

  // approvername() {
  //   let appkeyvalue: String = "";
  //   this.getapprover(appkeyvalue);
  //   let branch_id = this.ApproverForm.controls['approvedbranch'].value?.id ? this.ApproverForm.controls['approvedbranch'].value?.id : ""

  //   this.ApproverForm.get('approvedby').valueChanges
  //     .pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;
  //         console.log('inside tap')

  //       }),
  //       switchMap(value => this.ecfservice.getECFapproverscroll(1,this.batchArray[0]?.commodity_id?.id,this.createdbyid,branch_id,value)
  //         .pipe(
  //           finalize(() => {
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.approverList = datas;

  //     })

  // }

  // private getapprover(appkeyvalue) {
  //   let branch_id = this.ApproverForm.controls['approvedbranch'].value?.id ? this.ApproverForm.controls['approvedbranch'].value?.id : ""
  //   this.ecfservice.getECFapproverscroll(1,this.batchArray[0]?.commodity_id?.id,this.createdbyid,branch_id,appkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.approverList = datas;
  //     })
  // }

  public displayFnAprover(approver: ApproverListss): string | undefined {
    return approver ? approver.name + ' - ' + approver.code + ' - ' + approver.limit + ' - ' + approver.designation : undefined;
  }

  get approvertype() {
    return this.ApproverForm.get('approvedby');
  }
  approverScroll() {
    setTimeout(() => {
      if (
        this.matappAutocomplete &&
        this.autocompleteTrigger &&
        this.matappAutocomplete.panel
      ) {
        fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(
            x => {
              const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_nextapp) {

                  this.ecfservice.getECFapproverscroll(this.currentpageapp + 1, this.batchArray[0]?.commodity_id?.id, this.createdbyid, "", this.approverInput.nativeElement.value)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let pagination = results['pagination']
                      this.ApproverList = this.ApproverList.concat(datas);
                      if (this.ApproverList.length > 0) {
                        this.has_nextapp = pagination.has_next;
                        this.has_branchprevious = pagination.has_previous;
                        this.has_branchpresentpage = pagination.index;
                      }
                    })
                }
              }
            }
          )
      }
    });
  }
  // autocompleteapproverScroll() {

  //   setTimeout(() => {
  //     if (
  //       this.matappAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matappAutocomplete.panel
  //     ) {
  //       fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(() => this.matappAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(()=> {
  //           const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_nextapp === true) {
  //               this.ecfservice.getECFapproverscroll( this.currentpageapp + 1,this.batchArray[0]?.commodity_id?.id,this.createdbyid,"",this.appInput.nativeElement.value)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.approverList = this.approverList.concat(datas);
  //                   if (this.approverList.length >= 0) {
  //                     this.has_nextapp = datapagination.has_next;
  //                     this.has_previousapp = datapagination.has_previous;
  //                     this.currentpageapp = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }


  public displayFnBranch(branchtype?: branchListss): string | undefined {
    return branchtype ? branchtype.code + " - " + branchtype.name : undefined;
  }

  approverbranchScroll() {
    setTimeout(() => {
      if (
        this.branchmatAuto &&
        this.autocompleteTrigger &&
        this.branchmatAuto.panel
      ) {
        fromEvent(this.branchmatAuto.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.branchmatAuto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(
            x => {
              const scrollTop = this.branchmatAuto.panel.nativeElement.scrollTop;
              const scrollHeight = this.branchmatAuto.panel.nativeElement.scrollHeight;
              const elementHeight = this.branchmatAuto.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_branchnext) {

                  this.ecfservices.getbranchscroll(this.ApproverForm.get('approvedbranch').value, this.has_branchpresentpage + 1).subscribe((data: any) => {
                    let dear: any = data['data'];
                    console.log('second');
                    let pagination = data['pagination']
                    this.branchList = this.branchList.concat(dear);
                    if (this.branchList.length > 0) {
                      this.has_branchnext = pagination.has_next;
                      this.has_branchprevious = pagination.has_previous;
                      this.has_branchpresentpage = pagination.index;
                    }
                  })
                }
              }
            }
          )
      }
    });
  }

  branchrole: any
  ecf_inventory_sub_module_name: any
  ecf_approval_sub_module_name: any
  ecf_common_sub_module_name: any
  ecf_report_sub_module_name: any
  setActiveTab(selectedSub: any) {
    console.log("Tab clicked:", selectedSub);
    this.ECF_Sub_Menu_List.forEach(sub => sub.active = false);
    selectedSub.active = true;
    this.ECFAPSubModule(selectedSub);
  }
  ECFAPSubModule(data) {
    this.sub_module_url = data.url;
  if(this.sub_module_url != '/ecfreportsummary'){
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
    this.ecfReportSummaryPath = "/ecfreportsummary" === this.sub_module_url?true : false;

    this.COPermission = 0
    this.DOPermission = 0

    if (this.ecfsummaryPath) {
      this.ecf_inventory_sub_module_name = data?.name
      // this.ecfservices.getdd(data?.name)
      //   .subscribe(result => {
      //     if (result) {
      //       this.enable_ddl = result?.enable_ddl
      //       console.log("enable-ddl-value --->", this.enable_ddl)
      //       if(this.enable_ddl == false){                  
      //         this.SummaryApiecfwiseObjNew = {
      //           method: "post",
      //           url: this.url + "ecfapserv/batchheadersearch",
      //           params: "&submodule="+this.ecf_inventory_sub_module_name,
      //           data: data
      //         }

 
      //       }
      //       else{
      //         this.SummaryApiecfwiseObjNew = {
      //           method: "post",
      //           url: this.url + "ecfapserv/batchheadersearch",
      //           params: "&submodule="+this.ecf_inventory_sub_module_name,
      //           data: data
      //         }
      //       }
      //       const getToken = localStorage.getItem("sessionData")
      //       let tokendata = JSON.parse(getToken)
      //       this.ecfservices.getempModuleRole({ "employee_id": tokendata.employee_id, "module": "ECF Claim" })
      //         .subscribe(result => {
      //           if (result) {
      //             this.SpinnerService.hide()
      //             this.empModuleRoles = result
      //             this.COPermission = result.filter(x => x == "CO Permission").length
      //             this.DOPermission = result.filter(x => x == "DO Permission").length
      //             if (this.COPermission > 0) {
      //               this.MakerPermFlg = false
      //             }
      //             else if (this.DOPermission > 0) {
      //               this.MakerPermFlg = false
      //             }
      //             else if (this.COPermission == 0 && this.DOPermission == 0) {
      //               this.MakerPermFlg = true
      //               // this.commonForm.controls['raiserbranch_id'].setValue(this.branchrole)
      //             }

      //             this.resetcommon('')
      //           }
      //         })
      //     }
      //   })
      this.selectedSubmoduleName = data?.name
      console.log("sum_submodule_name--->", data?.name)
      this.ecfsummaryForm = true
      this.ECFReportSummaryForm = false
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
      // this.summarysearch('', 1)
      // this.batchsummarysearch(1)
      this.Resetecfinventory()
      this.resetbatch()
      // this.ResetSupplierECF()
      this.dataclear('')
      this.overallreset()

    }
    else if (this.ecfapprovalsummarypath) {
      this.ecf_approval_sub_module_name = data?.name
      this.ecfsummaryForm = false
      this.ECFReportSummaryForm = false
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
       let payloadbodydata = {
        "type": true,
        "crno": "",
        "aptype": "",
        "apstatus": "",
        "minamt": "",
        "maxamt": "",
        "commodity_id": "",
        "supplier": "",
        "branch": "",
        "purpose": "",
        "start_date": "",
        "end_date": "",
        "supplier_id": ""
        };
        this.ecpappsumdataapi = {
            method: "post",
            url: this.url + "ecfapserv/batchheadersearch",
            params: "&ecf_approver=true" + "&submodule=" + this.ecf_approval_sub_module_name,
            data: payloadbodydata
        }
      this.ecfapprovalviewForm = false
      this.AppInvoiceDetailViewForm = false
      this.dataclear('')
      // this.ecfapprovalsummarysearch(1)
      // this.batchappsummarysearch(1)
      // this.Resetecfinventory()
      // this.searchData = {};
      // this.searchValues ={};
      // this.ecfapprovalsummarysearch('',1)
      // this.ResetSupplierECF()
      // this.resetbatchapp()
       this.overallreset()
    }
    else if (this.apapprovalPath) {
      this.ecfsummaryForm = false
      this.ECFReportSummaryForm = false
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
      // this.batchSummarySearch(1)
      this.resetapbatch()
      this.overallreset()
    } else if (this.preparePaymentPath) {
      this.ecfsummaryForm = false
      this.ecfcreateForm = false
      this.ECFReportSummaryForm = false
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
      this.ppSummarySearch(1)
      this.resetpp()
      this.overallreset()
    } else if (this.bounceSummaryPath) {
      this.ecfsummaryForm = false
      this.ECFReportSummaryForm = false
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
      this.bounceSummarySearch(1)
          this.overallreset()
    } else if (this.paymentfilepath) {
      this.ecfsummaryForm = false
      this.ECFReportSummaryForm = false
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
      this.PFSummarySearch(1)
      this.resetpf()
          this.overallreset()
    }
    else if (this.commonSummaryPath) {
      this.ecfsummaryForm = false
      this.ECFReportSummaryForm = false
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
      this.ecf_common_sub_module_name = data?.name
      this.SpinnerService.show()
      this.ecfservices.getdd(data?.name)
        .subscribe(result => {
          if (result) {
            result.name = result.branch_name
            this.branchrole = {'id' : result.id, 'name': result.branch_name, 'code' : result?.code}
            this.enable_ddl = result?.enable_ddl
            console.log("enable-ddl-value --->", this.enable_ddl)
            if(this.enable_ddl == false){                  
              this.commonForm.controls['branchdetails_id'].setValue(this.branchrole)
              this.CommonRptDwnldForm.controls['branchdetails_id'].setValue(this.branchrole)
              this.SummaryApicommonecfObjNew = {
                     method: "post",
                     url: this.url + "ecfapserv/ecfap_common_summary",
                     params: "&submodule=" + this.ecf_common_sub_module_name,
                     data: {"raiserbranch_id":this.branchrole.id}
                   }

                  // this.commonsumfunc()
              this.SummarycommonecfData = [
                {columnname: "Invoice Type", key: "aptype",type: "object",objkey: "text",headicon: true, headerdicon: "filter_list", headertype: 'headoptiondropdown',payloadkey: "aptype",
                  inputobj: {
                  label: "Invoice Type",
                  params: "",
                  searchkey: "query",
                  displaykey: "text",
                  Outputkey: "id",
                  fronentdata: true,
                  data: this.TypeList,   
                  valuekey: "id",
                  formcontrolname: "aptype"
                },
                // validate: true, validatefunction: this.dynamicform.bind(this),
                function:true,
                clickFunction: this.commonsumSearch.bind(this)
                },

                { columnname: "Invoice CR No", key: "apinvoiceheader_crno",payloadkey: "invoiceheader_crno","headicon": true, headertype: 'headinput',
                  label: "Invoice CR No", headerdicon: "filter_list", clickFunction: this.commonsumSearch.bind(this),inputicon: "search",
                  function: true, clickfunction: this.linkView.bind(this), "style": { color: " #3684BF", cursor: "pointer" },
                  // validate: true, validatefunction: this.linkcolor.bind(this),
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
                  formcontrolname: "supplier_id"
                },
                  clickFunction: this.commonsumSearch.bind(this),function:true,
                  validate: true, validatefunction: this.suppliers_data.bind(this),
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
                  formcontrolname:"raiser_name"

                },
                clickFunction: this.commonsumSearch.bind(this),function:true,
                // validate: true, validatefunction: this.raisercommon_data.bind(this),
                },

              { columnname: "Raiser Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", "headicon": this.enable_ddl, headerdicon: "filter_list", headertype: 'headdropdown',
                  payloadkey: "raiserbranch_id",
                  inputobj:{
                    label: " Branch",
                    method: "get",
                    url: this.ecfmodelurl + "usrserv/search_branch",
                    params: "",
                    searchkey: "query",
                    displaykey: "fullname",
                    Outputkey: "id",
                    // prefix: 'code',
                    // separator: "hyphen",
                    formcontrolname:"raiserbranch_id"
                  },
                  clickFunction: this.commonsumSearch.bind(this),function:true,
                //  validate: true, validatefunction: this.branchcommon_data.bind(this),
                },
               {
              columnname: "Invoice Branch", key: "invoicebranch", type: "object", objkey: "name_code", "headicon": this.enable_ddl, headertype: 'headdropdown', payloadkey: "branchdetails_id",
              inputobj: {
                label: 'Invoice Branch',
                method: 'get',
                url: this.ecfmodelurl+ '/usrserv/search_branch',
                params: '',
                searchkey: 'query',
                displaykey: 'fullname',
                formcontrolname: "invoicebranch",
                Outputkey: "id",
              }, clickFunction: this.commonsumSearch.bind(this),
              // validate: true, validatefunction: this.raiser_branch_data.bind(this),
            },
                { columnname: "Invoice No", key: "invoice_no", payloadkey: "invoice_no", "headicon": true, headertype: 'headinput',
                label: "Invoice No", headerdicon: "filter_list", clickFunction: this.commonsumSearch.bind(this), inputicon: "search",
                //  validate: true, validatefunction: this.invoicecommon_data.bind(this),
                },

                { columnname: "Transaction Date", key: "apdate", "type": 'Date', "headicon": true, payloadkey_1: "start_date", payloadkey_2: "end_date",
                  common_key:{ecf_date: "ecf_date"}, label1: "Start Date",label2:"End Date", headerdicon: "date_range", headertype: 'startendDate', 
                  "datetype": "dd-MMM-yyyy" , clickFunction: this.commonsumSearch.bind(this),
                  //  validate: true, validatefunction: this.datecommon_data.bind(this),
                  },
                
                  { columnname: "Invoice Amount", prefix: "₹",  key: "totalamount",type: 'Amount', headicon: true, headinput: true, headerdicon: "filter",
                  headertype: 'minmaxAmnt', payloadkey_1: "minamt",payloadkey_2: "maxamt",common_key: {inv_amount: "inv_amount"},label1: "Min Amount",
                  label2: "Max Amount", clickFunction: this.commonsumSearch.bind(this),inputicon: "search",style: {"display":"flex","justify-content" : "end"}
                  //  validate: true, validatefunction: this.amountcommon_data.bind(this),
                  },

                { columnname: "Invoice Status", key: "apinvoicehdr_status", type: "object", objkey: "text","headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
                  payloadkey: "apinvoiceheaderstatus_id",  
                  inputobj:{
                  label: "Invoice Status",
                  method: "get",
                  url: this.ecfmodelurl + "ecfapserv/get_common_status",
                  params: "",
                  // fronentdata: true,
                  // data: this.sctcommonstatus,  
                  searchkey: "query",
                  displaykey: "text",
                  Outputkey: "id",
                  valuekey: "id",
                  formcontrolname: "apinvoiceheaderstatus_id"
                },
                  clickFunction: this.commonsumSearch.bind(this),function:true,
                    // validate: true, validatefunction: this.statuscommon_data.bind(this),
                },
                // { columnname: "AP Status", key: "mono_ap_status", },
                // { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy"},
                 { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "headicon": true, payloadkey_1: "invoice_from_date", payloadkey_2: "invoice_to_date",
                common_key:{ecf_date: "ecf_date"}, label1: "Start Date",label2:"End Date", headerdicon: "date_range", headertype: 'startendDate', 
                "datetype": "dd-MMM-yyyy" , clickFunction: this.commonsumSearch.bind(this),
                //  validate: true, validatefunction: this.datecommon_data.bind(this),
                },
                { "columnname": "GST No", "key": "supplier_data", "type": "object", "objkey": "gstno" },

                {"columnname": "View Entry", "key": "apinvoicehdr_status", function: true, validate: true,tooltip:true,
                  button: true, validatefunction: this.ecfviewentry.bind(this), clickfunction: this.CommonViewEntry.bind(this)
                },

                {columnname: "Download Covernote", icon: "download", "style": { color: "green", cursor: "pointer" },tooltip:true,
                  button: true, function: true, clickfunction: this.coverNotedownload_common_click.bind(this),
                  validate: true, validatefunction: this.downloadcovernote.bind(this),
                }
          ]

            }
            else{
                   this.SummaryApicommonecfObjNew = {
                     method: "post",
                     url: this.url + "ecfapserv/ecfap_common_summary",
                     params: "&submodule=" + this.ecf_common_sub_module_name,
                     data: {}
                   }
            }
            const getToken = localStorage.getItem("sessionData")
            let tokendata = JSON.parse(getToken)
            this.ecfservices.getempModuleRole({ "employee_id": tokendata.employee_id, "module": "ECF Claim" })
              .subscribe(result => {
                if (result) {
                  this.SpinnerService.hide()
                  this.empModuleRoles = result
                  this.COPermission = result.filter(x => x == "CO Permission").length
                  this.DOPermission = result.filter(x => x == "DO Permission").length
                  if (this.COPermission > 0) {
                    this.MakerPermFlg = false
                  }
                  else if (this.DOPermission > 0) {
                    this.MakerPermFlg = false
                  }
                  else if (this.COPermission == 0 && this.DOPermission == 0) {
                    this.MakerPermFlg = true
                    // this.commonForm.controls['raiserbranch_id'].setValue(this.branchrole)
                  }

                  this.resetcommon('')
                }
              })
          }
        })
      this.CommonSummaryForm = true
      this.BounceDetailForm = false
      this.commonInvViewForm = false
      this.ecfapprovalsummaryForm = false
      this.ecfapprovalviewForm = false
      this.InvoiceDetailViewForm = false
      this.AppInvoiceDetailViewForm = false
      this.dataclear('')
      this.overallreset()
    }
    else if (this.ecfReportSummaryPath){
      this.ecf_report_sub_module_name = data?.name
      this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.APApprovalForm =false
    this.APApprovalForms =false
    this.preparePaymentForm =false
    this.PreparepaymentForms = false
    this.BounceSummaryForm = false
    this.paymentfileForm = false
    this.InvoiceDetailForm = false
    this.CommonSummaryForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.InvoiceDetailViewForm  = false
    this.AppInvoiceDetailViewForm = false
    this.SpinnerService.show()
    this.ecfservices.getdd(data?.name)
    .subscribe(result => {
      if (result) {
        result.name =result.branch_name
        this.branchrole = {'id' : result.id, 'name': result.branch_name, 'code' : result?.code}
        this.enable_ddl = result?.enable_ddl
        // if(this.enable_ddl == false){
          this.frmECFReportSummary.controls['branchdetails_id'].setValue(this.branchrole)
        // }
        this.get_Summary(1)
        const getToken = localStorage.getItem("sessionData")
        let tokendata = JSON.parse(getToken)
        this.ecfservices.getempModuleRole({"employee_id":tokendata.employee_id,"module":"ECF Claim"})
        .subscribe(result => {
          if (result) {
            this.SpinnerService.hide()
            this.empModuleRoles = result
            this.COPermission = result.filter(x => x=="CO Permission").length
            this.DOPermission = result.filter(x => x=="DO Permission").length
            if(this.COPermission >0 )
            {
              this.MakerPermFlg = false
            }
            else  if(this.DOPermission >0 )
            {
              this.MakerPermFlg = false
            }
            else if(this.COPermission == 0 &&  this.DOPermission == 0)
            {
              this.MakerPermFlg = true
            }
          }
        })
      }
    })
    this.ECFReportSummaryForm = true
    this.dataclear('')
    this.resetDooScore()

    // this.startCountdown();
    }
  }


  getradio(n) {
    if (n == 1) {
      this.ecfSearchForm.patchValue({ 'type': 1 })
      this.summarysearch('', 1)
      this.ecfwisesearch("")
    }
    else if (n == 2) {
      this.batchSearchForm.patchValue({ 'type': 2 })
      // this.batchsummarysearch(1)
      this.batchsummary("")

    }
    else if (n == 3) {
      this.SupplierWiseECFForm.patchValue({ 'type': 3 })
      // this.SupplierECFsearch(1)
      this.supplierwiseSearch("")
    }

    this.ecfsummarytype = n
    this.batchArray = []
  }

  getradioold(n) {
    if (n == 1) {
      this.batchapprovalform.patchValue({ 'type': false })

      let payloadbodydata = {
        type: 2,
        crno: "",
        aptype: "",
        apstatus: "",
        ecfstatus: "",
        minamt: "",
        maxamt: "",
        branch: "",
        batchno: "",
        supplier_id: "",
        invoice_no: "",
        commodity_id: "",
      };




      this.ecpappsumdataapi = {
        method: "post",
        url: this.url + "ecfapserv/batchheadersearch",
        params: "&ecf_approver=true",
        data: payloadbodydata
      }
    }
    else {
      this.ecfapprovalform.patchValue({ 'type': true })
      let payloadbodydatas = {
        type: 1,
        crno: "",
        aptype: "",
        apstatus: "",
        ecfstatus: "",
        minamt: "",
        maxamt: "",
        branch: "",
        batchno: "",
        supplier_id: "",
        invoice_no: "",
        commodity_id: "",
      };
      this.batchappsumdataapi = {
        method: "post",
        url: this.url + "ecfapserv/batchsearch",
        params: "&ecf_approver=true",
        data: payloadbodydatas
      }
    }
    this.approvaltype = n
    this.batchArray = []
    if (n.id == 1) {
      // this.batchsummarysearch(1)
      this.batchsummary("")
      let payloadbodydata = {
        type: 1,
        crno: "",
        aptype: "",
        apstatus: "",
        ecfstatus: "",
        minamt: "",
        maxamt: "",
        branch: "",
        batchno: "",
        supplier_id: "",
        invoice_no: "",
        commodity_id: "",
      };
      this.ecpappsumdataapi = {
        method: "post",
        url: this.url + "ecfapserv/batchheadersearch",
        params: "&ecf_approver=true",
        data: payloadbodydata
      }

    } else {
      this.summarysearch('', 1)
    }
    this.batchArray = []
  }

  batchsummarysearch(e, pageNumber = 1) {

    let branchpayloadbodydata = {
      type: 2,
      batchno: "",
      fromdate: "",
      todate: "",
      batchcount: "",
      batchstatus: "",
      branch: ""
    };

    branchpayloadbodydata = { ...branchpayloadbodydata, ...e };
    console.log("branchpayloadbodydata ======> ", branchpayloadbodydata);
    this.SpinnerService.show()
    let data = this.batchSearchForm.value
    if (typeof (data?.branch) == 'object') {
      data.branch = data?.branch?.id
    } else if (typeof (data?.branch) == 'number') {
      data.branch = data?.branch
    } else {
      data.branch = ""
    }
    this.ecfservice.ecfbatchSearch(branchpayloadbodydata, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.batch_summary_data = result['data']
          // this.batchsummary()
          let datapagination = result["pagination"];
          this.length_batch = result["pagination"]?.count
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


  expand_invent = false
  // summarysearch(e, pageNumber = 1) {

  //   let payloadbodydata = {
  //     type: 1,
  //     crno: "",
  //     aptype: "",
  //     apstatus: "",
  //     ecfstatus: "",
  //     minamt: "",
  //     maxamt: "",
  //     branch: "",
  //     batchno: "",
  //     supplier_id: "",
  //     invoice_no: "",
  //     commodity_id: "",
  //   };

  //   payloadbodydata = { ...payloadbodydata, ...e };
  //   console.log("payloadbodydata ======> ", payloadbodydata);
  //   this.SpinnerService.show()
  //   let data = this.ecfSearchForm.value
  //   if (data.maxamt != "" && data.minamt == "") {
  //     this.notification.showError("Please Enter Min Amount")
  //     this.SpinnerService.hide()
  //     return false
  //   }
  //   if (data.maxamt == "" && data.minamt != "") {
  //     this.notification.showError("Please Enter Max Amount")
  //     this.SpinnerService.hide()
  //     return false
  //   }

  //   if (typeof (data?.branch) == 'object') {
  //     data.branch = data?.branch?.id
  //   } else if (typeof (data?.branch) == 'number') {
  //     data.branch = data.branch
  //   } else {
  //     data.branch = ""
  //   }
  //   if (typeof (data?.supplier_id) == 'object') {
  //     data.supplier_id = data?.supplier_id?.id
  //   } else if (typeof (data?.supplier_id) == 'number') {
  //     data.supplier_id = data.supplier_id
  //   } else {
  //     data.supplier_id = ""
  //   }
  //   if (typeof (data?.commodity_id) == 'object') {
  //     data.commodity_id = data?.commodity_id?.id
  //   } else if (typeof (data?.commodity_id) == 'number') {
  //     data.commodity_id = data.commodity_id
  //   } else {
  //     data.commodity_id = ""
  //   }
  //   if (data.start_date != undefined && data.start_date != "" && data.start_date != null) {
  //     data.start_date = this.datePipe.transform(data.start_date, 'yyyy-MM-dd')
  //   }
  //   else {
  //     delete data.start_date
  //   }
  //   if (data.end_date != undefined && data.end_date != "" && data.end_date != null) {
  //     data.end_date = this.datePipe.transform(data.end_date, 'yyyy-MM-dd')
  //   }
  //   else {
  //     delete data.end_date
  //   }
  //   this.ecfservice.ecfsummarySearch(payloadbodydata, pageNumber)
  //     .subscribe(result => {
  //       if (result['data'] != undefined) {
  //         this.length_ecf = result["pagination"]?.count;
  //         this.ecf_summary_data = result['data']
  //         if (this.ecf_summary_data?.length > 0) {
  //           for (let i in this.ecf_summary_data) {
  //             if (this.batchArray?.length > 0) {
  //               for (let j in this.batchArray) {
  //                 if (this.ecf_summary_data[i].id == this.batchArray[j].id) {
  //                   this.ecf_summary_data[i].select = true
  //                 } else {
  //                   this.ecf_summary_data[i].select = false
  //                 }
  //               }
  //             }
  //             else {
  //               this.ecf_summary_data[i].select = false
  //             }
  //           }
              // if(pageNumber == 1){
              //   this.pageIndexECF = 0;  
              // }
  //         }
  //         console.log("ecf_summary_data", this.ecf_summary_data)
  //         let datapagination = result["pagination"];
  //         this.length_ecf = datapagination?.count
  //         if (this.ecf_summary_data.length === 0) {
  //           this.issummarypage = false
  //         }
  //         if (this.ecf_summary_data.length > 0) {
  //           this.has_pagenext = datapagination.has_next;
  //           this.has_pageprevious = datapagination.has_previous;
  //           this.ecfpresentpage = datapagination.index;
  //           this.issummarypage = true
  //         }
  //         this.SpinnerService.hide()
  //       } else {
  //         this.length_ecf = 0;
  //         this.notification.showError(result?.description)
  //         this.SpinnerService.hide()
  //         return false
  //       }
  //     },
  //       error => {
  //         this.errorHandler.handleError(error);
  //         this.SpinnerService.hide();
  //       }

  //     )
  // }
  summarysearch(e, pageNumber = 1) {
    // this.SpinnerService.show()
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
    if (typeof (data?.branch) == 'object') {
      data.branch = data?.branch?.id
    } else if (typeof (data?.branch) == 'number') {
      data.branch = data.branch
    } else {
      data.branch = ""
    }
    if (typeof (data?.supplier_id) == 'object') {
      data.supplier_id = data?.supplier_id?.id
    } else if (typeof (data?.supplier_id) == 'number') {
      data.supplier_id = data.supplier_id
    } else {
      data.supplier_id = ""
    }
    if (typeof (data?.commodity_id) == 'object') {
      data.commodity_id = data?.commodity_id?.id
    } else if (typeof (data?.commodity_id) == 'number') {
      data.commodity_id = data.commodity_id
    } else {
      data.commodity_id = ""
    }
    if (data.start_date != undefined && data.start_date != "" && data.start_date != null) {
      data.start_date = this.datePipe.transform(data.start_date, 'yyyy-MM-dd')
    }
    else {
      delete data.start_date
    }
    if (data.end_date != undefined && data.end_date != "" && data.end_date != null) {
      data.end_date = this.datePipe.transform(data.end_date, 'yyyy-MM-dd')
    }
    else {
      delete data.end_date
    }
    // this.SummaryApiecfwiseObjNew = {
    //   method: "post",
    //   url: this.url + "ecfapserv/batchheadersearch",
    //   params: "&"+this.ecf_inventory_sub_module_name,
    //   data: data
    // }
    // this.ecfservice.ecfsummarySearch(data, pageNumber)
    //   .subscribe(result => {
    //     if (result['data'] != undefined) {
    //       this.length_ecf = result["pagination"]?.count;
    //       this.ecf_summary_data = result['data']
    //       if (this.ecf_summary_data?.length > 0) {
    //         for (let i in this.ecf_summary_data) {
    //           if (this.batchArray?.length > 0) {
    //             for (let j in this.batchArray) {
    //               if (this.ecf_summary_data[i].id == this.batchArray[j].id) {
    //                 this.ecf_summary_data[i].select = true
    //               } else {
    //                 this.ecf_summary_data[i].select = false
    //               }
    //             }
    //           }
    //           else {
    //             this.ecf_summary_data[i].select = false
    //           }
    //         }
    //       }
    //       console.log("ecf_summary_data", this.ecf_summary_data)
    //       let datapagination = result["pagination"];
    //       this.length_ecf = datapagination?.count
    //       if (this.ecf_summary_data.length === 0) {
    //         this.issummarypage = false
    //       }
    //       if (this.ecf_summary_data.length > 0) {
    //         this.has_pagenext = datapagination.has_next;
    //         this.has_pageprevious = datapagination.has_previous;
    //         this.ecfpresentpage = datapagination.index;
    //         this.issummarypage = true
    //       }
    //       this.SpinnerService.hide()
    //     } else {
    //       this.length_ecf = 0;
    //       this.notification.showError(result?.description)
    //       this.SpinnerService.hide()
    //       return false
    //     }
    //   },
    //     error => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }
    //   )
    // this.ecf_inventory_close()
    this.expand_invent = false
  }
  nextClickPayment() {
    if (this.has_pagenext === true) {
      this.summarysearch('', this.ecfpresentpage + 1)
    }
  }

  previousClickPayment() {
    if (this.has_pageprevious === true) {
      this.summarysearch('', this.ecfpresentpage - 1)
    }
  }

  Resetecfinventory() {
    this.ecfSearchForm.controls['crno'].reset(""),
      this.ecfSearchForm.controls['aptype'].reset(""),
      this.ecfSearchForm.controls['apstatus'].reset(""),
      this.ecfSearchForm.controls['ecfstatus'].reset(""),
      this.ecfSearchForm.controls['minamt'].reset(""),
      this.ecfSearchForm.controls['maxamt'].reset(""),
      this.ecfSearchForm.controls['branch'].reset(""),
      this.ecfSearchForm.controls['batchno'].reset(""),
      this.ecfSearchForm.controls['supplier'].reset(""),
      this.ecfSearchForm.controls['invoice_no'].reset(""),
      this.ecfSearchForm.controls['commodity_id'].reset(""),
      this.ecfSearchForm.controls['start_date'].reset(""),
      this.ecfSearchForm.controls['end_date'].reset(""),
      this.batchArray = [];
      this.searchData = {};
      this.searchValues ={};
      this.summarysearch('', 1);
    this.pageIndexECF = 0;

  }

  resetbatch() {
    this.batchSearchForm.controls['batchno'].reset(""),
      this.batchSearchForm.controls['batchstatus'].reset(""),
      this.batchSearchForm.controls['batchcount'].reset(""),
      this.batchSearchForm.controls['branch'].reset(""),
      // this.batchSearchForm.controls['fromdate'].reset(""),
      // this.batchSearchForm.controls['todate'].reset(""),
      // this.batchsummarysearch(1);
    this.pageIndexBatch = 0;

  }

  ResetSupplierECF() {
    this.SupplierWiseECFForm.controls['crno'].reset(""),
      this.SupplierWiseECFForm.controls['aptype'].reset(""),
      this.SupplierWiseECFForm.controls['apstatus'].reset(""),
      this.SupplierWiseECFForm.controls['ecfstatus'].reset(""),
      this.SupplierWiseECFForm.controls['branch'].reset(""),
      this.SupplierWiseECFForm.controls['batchno'].reset(""),
      this.SupplierWiseECFForm.controls['supplier_id'].reset(""),
      this.SupplierWiseECFForm.controls['invoice_no'].reset(""),
      this.SupplierWiseECFForm.controls['commodity_id'].reset(""),
      this.Supp_ecf_summary = [];
    // this.SupplierECFsearch(1);
    this.supplierwiseSearch("")
    this.pageIndexECF = 0;

  }

  SuppWiseDataLen = 0
  isSuppWiseSumm: boolean = true;

  SupplierECFsearch(e, pageNumber = 1) {
    let supplierpayloadbodydata = {
      type: 3,
      crno: "",
      aptype: "",
      apstatus: "",
      ecfstatus: "",
      branch: "",
      batchno: "",
      supplier_id: "",
      invoice_no: "",
      commodity_id: "",
    };

    supplierpayloadbodydata = { ...supplierpayloadbodydata, ...e };
    console.log("supplierpayloadbodydata ======> ", supplierpayloadbodydata);
    this.SummaryApisupplierwiseObjNew = {
      method: "post",
      url: this.url + "ecfapserv/vow_summary",
      data: supplierpayloadbodydata
    }
    this.SpinnerService.show()
    let data = this.SupplierWiseECFForm.value
    if (typeof (data?.branch) == 'object') {
      data.branch = data?.branch?.id
    } else if (typeof (data?.branch) == 'number') {
      data.branch = data.branch
    } else {
      data.branch = ""
    }
    if (typeof (data?.supplier_id) == 'object') {
      data.supplier_id = data?.supplier_id?.id
    } else if (typeof (data?.supplier_id) == 'number') {
      data.supplier_id = data.supplier_id
    } else {
      data.supplier_id = ""
    }
    if (typeof (data?.commodity_id) == 'object') {
      data.commodity_id = data?.commodity_id?.id
    } else if (typeof (data?.commodity_id) == 'number') {
      data.commodity_id = data.commodity_id
    } else {
      data.commodity_id = ""
    }
    this.ecfservice.SupplierwiseEcfSearch(supplierpayloadbodydata, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.SuppWiseDataLen = result["pagination"]?.count;
          this.Supp_ecf_summary = result['data']

          let datapagination = result["pagination"];
          this.SuppWiseDataLen = datapagination?.count
          if (this.Supp_ecf_summary.length === 0) {
            this.isSuppWiseSumm = false
          }
          if (this.Supp_ecf_summary.length > 0) {
            this.has_pagenext = datapagination.has_next;
            this.has_pageprevious = datapagination.has_previous;
            this.SuppWiseCurrPage = datapagination.index;
            this.isSuppWiseSumm = true
          }
          this.SpinnerService.hide()
        } else {
          this.SuppWiseDataLen = 0;
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

  expand_approval = false
  expand_ecf_inv = false

  ecfapprovalsummarysearch(approval, pageNumber = 1) {

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

    if (typeof (approval?.branch) == 'object') {
      data.branch = approval?.branch?.id
    } else if (typeof (approval?.branch) == 'number') {
      data.branch = approval?.branch
    } else {
      data.branch = ""
    }
    if (typeof (approval?.supplier_id) == 'object') {
      data.supplier_id = approval?.supplier_id?.id
    } else if (typeof (data?.supplier_id) == 'number') {
      data.supplier_id = approval?.supplier_id
    } else {
      data.supplier_id = ""
    }
    if (typeof (data?.commodity_id) == 'object') {
      data.commodity_id = data?.commodity_id?.id
    } else if (typeof (data?.commodity_id) == 'number') {
      data.commodity_id = data?.commodity_id
    } else {
      data.commodity_id = ""
    }
    data.start_date = this.datePipe.transform(data.start_date, 'yyyy-MM-dd') ? this.datePipe.transform(data.start_date, 'yyyy-MM-dd') : ""
    data.end_date = this.datePipe.transform(data.end_date, 'yyyy-MM-dd') ? this.datePipe.transform(data.end_date, 'yyyy-MM-dd') : ""
    this.ecpappsumdataapi = {
      method: "post",
      url: this.url + "ecfapserv/batchheadersearch",
      params: "&ecf_approver=true",
      data: data
    }
    // this.ecfservice.ecfapprovalsummarySearch(this.ecfapprovalform?.value, pageNumber)
    //   .subscribe(result => {
    //     if (result['data'] != undefined) {
    //       this.ecf_approval_data = result['data']

    //       let datapagination = result["pagination"];
    //       this.length_approverecf = result["pagination"]?.count
    //       this.getapptotalcount = datapagination?.count
    //       if (this.ecf_approval_data.length === 0) {
    //         this.isappsummarypage = false
    //       }
    //       if (this.ecf_approval_data.length > 0) {
    //         this.has_apppagenext = datapagination.has_next;
    //         this.has_apppageprevious = datapagination.has_previous;
    //         this.ecfapppresentpage = datapagination.index;
    //         this.isappsummarypage = true
              // if(pageNumber == 1){
              //   this.pageIndexApprove = 0;
              // } 
    //       }
    //       this.SpinnerService.hide()
    //     } else {
    //       this.notification.showError(result?.description)
    //       this.SpinnerService.hide()
    //       return false
    //     }
    //   },
    //     error => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }

    //   )
    // this.approval_close()
    this.expand_approval = false
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

  Resetecfappinventory(reset) {
    this.ecfapprovalform.controls['crno'].reset(""),
      this.ecfapprovalform.controls['aptype'].reset(""),
      this.ecfapprovalform.controls['apstatus'].reset(""),
      this.ecfapprovalform.controls['minamt'].reset(""),
      this.ecfapprovalform.controls['maxamt'].reset(""),
      this.ecfapprovalform.controls['branch'].reset(""),
      this.ecfapprovalform.controls['purpose'].reset(""),
      this.ecfapprovalform.controls['commodity_id'].reset(""),
      this.ecfapprovalform.controls['supplier_id'].reset(""),
      this.ecfapprovalform.controls['start_date'].reset(""),
      this.ecfapprovalform.controls['end_date'].reset("")
    //   this.ecfapprovalsummarysearch(1);
    // this.pageIndexApprove = 0
    let data = {
      type: "true",
      apstatus: "",
    }
    let payloadbodydata = { ...data, ...reset };
    this.ecpappsumdataapi = {
      method: "post",
      url: this.url + "ecfapserv/batchheadersearch",
      params: "&ecf_approver=true",
      data: payloadbodydata
    }
  }

  batchappsummarysearch(batch, pageNumber = 1) {
    this.SpinnerService.show()
    let data = this.batchapprovalform.value
    if (typeof (data?.branch) == 'object') {
      data.branch = data?.branch?.id
    } else if (typeof (data?.branch) == 'number') {
      data.branch = data?.branch
    } else {
      data.branch = ""
    }

    this.ecfservice.ecfapprovalbatchsummarySearch(data, pageNumber)
      .subscribe(result => {
        if (result['data'] != undefined) {
          this.batch_approval_data = result['data']
          let datapagination = result["pagination"];
          this.length_approverbatchecf = result["pagination"]?.count
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

  // nextClickbatchapp() {
  //   if (this.has_appbatchpagenext === true) {
  //     this.batchappsummarysearch(this.batchapppresentpage + 1)
  //   }
  // }

  // previousClickbatchapp() {
  //   if (this.has_appbatchpageprevious === true) {
  //     this.batchappsummarysearch(this.batchapppresentpage - 1)
  //   }
  // }

  resetbatchapp() {
    this.batchapprovalform.controls['batchno'].reset(""),
      this.batchapprovalform.controls['batchstatus'].reset(""),
      this.batchapprovalform.controls['batchcount'].reset(""),
      this.batchapprovalform.controls['branch'].reset(""),
      // this.batchapprovalform.controls['fromdate'].reset(""),
      // this.batchapprovalform.controls['todate'].reset(""),
      // this.batchappsummarysearch(1);
      this.pageIndexBatchApprove = 0;

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
    return data;
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
    this.getradio(this.shareservice.ecfsummarytype.value)
    this.dataclear('')
    this.overallreset()
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
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false


    if (this.shareservice.batchview.value == 'Makerview') {
      this.ecfsummaryForm = true
      this.ecfsummarytype = 1
      this.shareservice.batchview.next('')
      this.summarysearch('', 1);
      this.dataclear('')
      this.overallreset()
    }
    else {
      this.shareservice.batchview.next('')
      this.ecfapprovalsummaryForm = true
      this.approvaltype = this.shareservice.approvaltype.value == 1 ? 1 : 2
      this.dataclear('')
      this.ecfapprovalsummarysearch(1);
      this.overallreset()
      // this.batchappsummarysearch(1);
    }
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
    this.overallreset()
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

    // this.shareservice.approvaltype.next()
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
    // this.summarysearch('', 1);
    // this.batchsummarysearch(1);
    // this.batchsummary("")
    this.getradio(this.shareservice.ecfsummarytype.value)
    // this.dataclear('')
    this.batchsummary("")
    this.overallreset()
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
    this.summarysearch('', 1);
    // this.batchsummarysearch(1);
    this.batchsummary("")
  }


  invcancel() {
    this.ecfsummaryForm = false
    this.ecfcreateForm = true
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
    this.shareservice.ecfsummarytype.next(this.ecfsummarytype)
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
  }

  shoowaction(data) {
    this.showappview(data, false)
  }
  showappview(data, backflag) {
    console.log("dataaaas", data)
    if (!backflag) {
      this.ecfheaderid = data.id
      this.shareservice.ecfheader.next(this.ecfheaderid)
      let datas = this.shareservice.ecfheader.value
      console.log("pettycashidpass", datas)
      this.shareservice.ecfviewdata.next(data)
      this.shareservice.crno.next(data?.crno)
    }

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
    this.shareservice.approvaltype.next(this.approvaltype)
  }


  batchid: any
  showecfview(text, batchOrEcfView, data) {
    if (batchOrEcfView == 'batch') {
      this.batchid = data.id
      // this.closebutton.nativeElement.click()
      this.shareservice.batchviewid.next(this.batchid)
      this.shareservice.batchviewdatas.next(data)
    }

    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.shareservice.batchOrEcfView.next(batchOrEcfView)

    if (this.shareservice.batchview.value == '')
      this.shareservice.batchview.next(text)
    if (text == 'Approvalview')
      this.shareservice.approvaltype.next(1)
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

  }




  // delete(id) {
  //   this.SpinnerService.show()
  //   var answer = window.confirm(" Are you sure you want to inactive?");
  //   if (answer) {
  //     //some code
  //     this.ecfservice.ecfhdrdelete(id.id)
  //       .subscribe(result => {
  //         this.SpinnerService.hide();
  //         if (result.status == "success") {
  //           this.ecfservice.ppxdelete(id).subscribe(result => {
  //             let datas = result
  //           })
  //           this.notification.showSuccess("InActivated successfully")
  //           this.summarysearch('', 1)
  //           this.ecfwisesearch("")
  //         } else {
  //           this.notification.showError(result.description)
  //           this.SpinnerService.hide();
  //           return false;
  //         }
  //       },
  //         error => {
  //           this.errorHandler.handleError(error);
  //           this.SpinnerService.hide();
  //         }
  //       )
  //   }
  //   else {
  //     this.SpinnerService.hide();
  //     return false;
  //   }
  // }

  delete(id) {
    this.SpinnerService.show()
    var answer = window.confirm(" Are you sure you want to inactive?");
    if (answer) {
      //some code
      this.ecfservice.ecfhdrdelete(id.id)
        .subscribe(result => {
          this.SpinnerService.hide();
          if (result.status == "success") {
            this.ecfservice.ppxdelete(id).subscribe(result => {
              let datas = result
            })
            this.notification.showSuccess("InActivated successfully")
            this.summarysearch('',1)
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

  ECFunlock(id) {
    this.ecfservice.ECFunlockapi(id)
      .subscribe(result => {
        if (result['status'] == "success") {
          this.notification.showSuccess("Successfully Unlocked")
        }
        else if (result['status'] == "Failed") {
          this.notification.showSuccess(result['message'])
        }
        else {
          this.notification.showError(JSON.stringify(result))
        }
      })
  }

  ECFunlocks(id) {
    this.ecfunlock = id.id
    this.ecfservice.ECFunlockapi(id.id)
      .subscribe(result => {
        if (result['status'] == "success") {
          this.notification.showSuccess("Successfully Unlocked")
        }
        else if (result['status'] == "Failed") {
          this.notification.showSuccess(result['message'])
        }
        else {
          this.notification.showError(JSON.stringify(result))
        }
      })
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

  }



  numberOnlyandDot(event, val): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    val = String(val + event.key).replace(/,/g, '') 
    if(+val > 9999999999)
      return false
    else
      return true;
  }
  ecf_summary_data_coverNotedownload(data) {

    if (data.ecfstatus.text == 'ECF APPROVED') {
    this.coverNotedownload(data.id, data.ecftype_id)
    }



  }
  coverNotedownload_common_click(data) {
    if (data.ecfstatus.text != 'RETURNED' && data.ecfstatus.text != 'BATCH ECF RETURNED' && data.ecfstatus.text != 'PENDING IN ECF APPROVAL') {
    this.coverNotedownload(data.apheader_id, data.ecftype_id)
    }
  }

  approver_ecf_data_coverNotedownload_click(data) {
    if (data.ecfstatus.text != 'DRAFT' && data.ecfstatus.text != 'PENDING IN ECF APPROVAL' && data.ecfstatus.text != 'READY FOR BATCH' && data.ecfstatus.text != 'DELETE' && data.ecfstatus.text == 'ECF REJECTED') {
      this.coverNotedownload(data.id, data.ecftype_id)
    }
  }
  coverNotedownload(id , ecftype_id) {
    // this.coverid = id.apheader_id
    // this.covertype = id.ecftype_id
    this.SpinnerService.show()
    if (ecftype_id != 4) {
      this.ecfservice.ecfcoverNotedownload(id)
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

      this.ecfservice.coverNoteadvdownload(id)
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

  coverNotedownloads(id, ecftypeid) {
    this.SpinnerService.show()
    if (ecftypeid != 4) {
      this.ecfservice.ecfcoverNotedownload(id)
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

      this.ecfservice.coverNoteadvdownload(id)
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
    let data_id = id?.id
    this.ecfservice.batchcoverNotedownload(data_id)
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
  // onselectionchange(e, data) {
  //   this.is_checked = e.currentaction
  //   this.current_selected_data = e.currentselected

  //   // data.select = true
  //   this.commcheck = this.current_selected_data?.commodity_id?.id
  //   this.ecftypecheck = this.current_selected_data?.aptype_id
  //   this.ecfwisecolumn7.bind(this)
  //   console.log("e", e)
  //   console.log("e1 check???", e.currentaction)
  //   console.log("current_selected_data", this.current_selected_data)
  //   if (this.is_checked == true) {
  //     this.batchArray.push(this.current_selected_data)
  //   } else {
  //     for (let i = 0; i < this.batchArray.length; i++) {
  //       if (this.batchArray[i].id == this.current_selected_data.id) {
  //         this.batchArray.splice(i, 1)
  //       }

  //     }
  //     if (this.batchArray.length <= 0) {
  //       this.commcheck = ""
  //       this.ecftypecheck = ""
  //     }
  //   }
  //   console.log("batcharray", this.batchArray)

  // }

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

  disable_batchsubmit = false
  batchsubmit() {

    this.disable_batchsubmit = true
    const dataas = this.ApproverForm?.value
    if (dataas.approvedby == "" || dataas.approvedby == null || dataas.approvedby == undefined) {
      this.notification.showError("Please Choose Approver Name");
      this.disable_batchsubmit = false
      return false
    }
    if (typeof (dataas?.approvedby) == 'object') {
      dataas.approvedby = dataas?.approvedby?.id
    } else if (typeof (dataas?.approvedby) == 'number') {
      dataas.approvedby = dataas?.approvedby
    } else {
      this.notification.showError("Please Choose Anyone Approver Name From the Dropdown");
      this.disable_batchsubmit = false
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
        this.ApproverForm.controls['approvedbranch'].reset("")
        this.disable_batchsubmit = false
        this.closedbutton.nativeElement.click();
        // for(let i = 0;i<this.ecf_summary_data.length;i++){
        //   this.ecf_summary_data[i].select = false
        // }
        this.batchArray = [];
        this.commcheck = ""
        this.ecftypecheck = ""
        this.summarysearch('', 1)

      } else {
        this.notification.showError(result?.description)
        this.disable_batchsubmit = false
        return false;
      }
    })
  }

  appback() {

    this.ApproverForm.controls['approvedbranch'].reset("")
    this.ApproverForm.controls['approvedby'].reset("")
    this.disable_batchsubmit = false
    this.closedbutton.nativeElement.click()
  }

  getApproveType(id) {
    if (id == 1) {
      // this.batchSummarySearch();
      this.batchsummary("")
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
      this.apbatchSearchForm.controls['batchcount'].reset("")
      // this.batchSummarySearch(1);
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
      // this.batchSummarySearch(1);
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
    if (searchData.apinvoiceheader_crno == null || searchData.apinvoiceheader_crno == undefined) {
      searchData.apinvoiceheader_crno = ""
    }

    if (searchData.crno == null || searchData.crno == undefined) {
      searchData.crno = ""
    }

    if (searchData.ecftype == null || searchData.ecftype == undefined) {
      searchData.ecftype = ""
    }

    if (typeof (searchData.supplier_id) == 'object') {
      searchData.supplier_id = searchData?.supplier_id?.id
    } else if (typeof (searchData.supplier_id) == 'number') {
      searchData.supplier_id = searchData?.supplier_id
    } else if (searchData.supplier_id == null || searchData.supplier_id == undefined || searchData.supplier_id == "") {
      searchData.supplier_id = ""
    } else {
      this.notification.showError("Please Choose Supplier Name from the dropdown")
      return false
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
      this.ppSummarySearch(1);
  }

  pfSummary: any;
  getpftotalcount: any
  PFSummarySearch(pageNumber = 1) {
    // if(this.PFSearchForm){
    let search = this.PFSearchForm.value
    if (search.apinvoiceheader_crno == null || search.apinvoiceheader_crno == undefined) {
      search.apinvoiceheader_crno = ""
    }

    if (search.crno == null || search.crno == undefined) {
      search.crno = ""
    }

    if (search.ecftype == null || search.ecftype == undefined) {
      search.ecftype = ""
    }

    if (typeof (search.supplier_id) == 'object') {
      search.supplier_id = search?.supplier_id?.id
    } else if (typeof (search.supplier_id) == 'number') {
      search.supplier_id = search?.supplier_id
    } else if (search.supplier_id == null || search.supplier_id == undefined || search.supplier_id == "") {
      search.supplier_id = ""
    } else {
      this.notification.showError("Please Choose Supplier Name from the dropdown")
      return false
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
    this.ecfservice.paymentfilesearch(search, pageNumber)
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result['data'] != undefined) {
          this.pfSummary = result['data']
          console.log("pfsummary", this.pfSummary)
          let datapagination = result["pagination"];
          this.getpftotalcount = datapagination?.count
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
      this.PFSearchForm.controls['crno'].reset(""),
      this.PFSearchForm.controls['apinvoiceheader_crno'].reset(""),
      this.PFSearchForm.controls['ecftype'].reset(""),
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
  }



  ppEdit(data) {
    this.shareservice.ecfheaderedit.next(data?.id)
    this.router.navigate(['ECFAP/createecf'])
  }

  ppBtnEnable = false
  hdrselFlag = [false, false, false, false, false, false, false, false, false, false]
  hdrselect(e, i) {
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

      let data = this.ppSummary.filter(x => x.select == true)

      for (let i = 0; i < data.length; i++) {
        this.SpinnerService.show()
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
                this.SpinnerService.show()
                this.ecfservice.preparePayment(paymentData)
                  .subscribe(result => {
                    console.log("result", result)

                    if (result.status != undefined) {
                      this.notification.showError(result?.message)
                      this.SpinnerService.hide()
                      return false
                    } else {
                      if (i == data.length - 1) {
                        this.notification.showSuccess("Saved Successfully!")
                        this.SpinnerService.hide()
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
    this.bounceSummarySearch(1)
  }


  pvno: any
  pvnoget(list) {
    this.popupopen6();
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

   getsupplier(suppkeyvalue) {
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
    return supplier ? supplier.name + ' - ' + supplier.code : undefined;
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
    this.overallreset()
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
    this.overallreset()
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
  }

  expanded = false
  iscommonsummarypage: boolean
  has_commonpageprevious = false
  has_commonpagenext = false
  pagesizecommon = 10;
  getcommontotalcount: any
  mono_status: any
  // commonSummarySearch(pageNumber = 1)
  // {
  //   if (this.commonForm) {
  //     let search = this.commonForm.value
  //     this.searchData = {}
  //     this.searchData.crno = search.crno;
  //     this.searchData.batch_no = search.batch_no;
  //     this.searchData.invoiceheader_crno = search.invoiceheader_crno;
  //     this.searchData.aptype = search.aptype;
  //     this.searchData.raiser_name = search.raiser_name.id;
  //     this.searchData.suppliergst_no = search.suppliergst_no
  //     if (search.start_date != undefined && search.start_date != "" && search.start_date != null) {
  //       this.searchData.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd')
  //     }
  //     if (search.end_date != undefined && search.end_date != "" && search.end_date != null) {
  //       this.searchData.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd')
  //     }
  //     if (search.raiserbranch_id != undefined && search.raiserbranch_id != null && search.raiserbranch_id != '') {
  //       this.searchData.raiserbranch_id = search.raiserbranch_id.id;
  //     }
  //     else if (this.MakerPermFlg) {
  //       this.searchData.raiserbranch_id = this.branchrole.id;
  //     }
  //     else if (this.COPermission == 0 && this.DOPermission > 0) {
  //       this.searchData.do_empbranch_code = this.branchrole.code
  //     }
  //     if (typeof (search.supplier_id) == 'object') {
  //       this.searchData.supplier_id = search?.supplier_id?.id
  //     } else if (typeof (search.supplier_id) == 'number') {
  //       this.searchData.supplier_id = search?.supplier_id
  //     } else if (search.supplier_id == null || search.supplier_id == undefined || search.supplier_id == "") {
  //       this.searchData.supplier_id = ""
  //     }
  //     this.searchData.invoice_no = search.invoice_no;
  //     this.searchData.invoice_amount = search.invoice_amount;
  //     this.searchData.minamt = search.minamt;
  //     this.searchData.maxamt = search.maxamt;
  //     this.searchData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
  //     this.searchData.invoice_status = search.invoice_status;

  //     if (+search.maxamt != 0 && (search.minamt == "" || search.minamt == null || search.minamt == undefined)) {
  //       this.notification.showError("Please Enter Min Amount")
  //       this.SpinnerService.hide()
  //       return false
  //     }
  //     if (search.minamt != 0 && (search.maxamt == "" || search.maxamt == null || search.maxamt == undefined)) {
  //       this.notification.showError("Please Enter Max Amount")
  //       this.SpinnerService.hide()
  //       return false
  //     }
  //     if (+search.minamt > 0 && +search.maxamt < +search.minamt) {
  //       this.notification.showError("Maximum Amount should be greater than Minimum Amount")
  //       return false
  //     }
  //     for (let i in this.searchData) {
  //       if (this.searchData[i] === null || this.searchData[i] === "") {
  //         delete this.searchData[i];
  //       }
  //     }
  //   }
  //   else {
  //     this.searchData = {}
  //   }
  //   // this.SummaryApiecfapObjNew = {
  //   //   method: "post",
  //   //   url: this.url + "ecfapserv/ecfap_common_summary",data: this.searchData,
  //   // };
  //   this.SpinnerService.show()
  //   this.ecfservice.getECFCommonSummary(this.searchData, pageNumber)
  //     .subscribe(result => {
  //       if (result['data'] != undefined) {
  //         this.commonSummary = result['data']
  //         this.mono_status = result['mono_status']
  //         for (let i = 0; i < this.commonSummary.length; i++) {
  //           let crno = this.commonSummary[i].crno
  //           let status = this.mono_status.filter(x => x.ecf_crno == crno)[0]?.ap_status ? this.mono_status.filter(x => x.ecf_crno == crno)[0]?.ap_status : ''
  //           this.commonSummary[i].ap_status = status
  //         }

  //         let datapagination = result["pagination"];
  //         this.getcommontotalcount = datapagination?.count
  //         this.length_commonecf = result["pagination"]?.count
  //         if (this.commonSummary.length === 0) {
  //           this.iscommonsummarypage = false
  //         }
  //         if (this.commonSummary.length > 0) {
  //           this.has_commonpagenext = datapagination.has_next;
  //           this.has_commonpageprevious = datapagination.has_previous;
  //           this.commonpresentpage = datapagination.index;
  //           this.iscommonsummarypage = true
              // if(pageNumber ==1)
              //   this.pageIndexCommon =0
  //         }
  //         this.SpinnerService.hide()
  //       } else {
  //         this.notification.showError(result?.message)
  //         this.SpinnerService.hide()
  //         return false
  //       }
  //     },
  //       error => {
  //         this.errorHandler.handleError(error);
  //         this.SpinnerService.hide();
  //       }

  //     )
  // }

  commonSummarySearch(e, pageNumber = 1) {
    if (this.commonForm) {
      let search = this.commonForm.value
      this.searchData = {}
      this.searchData.crno = search.crno;
      this.searchData.batch_no = search.batch_no;
      this.searchData.invoiceheader_crno = search.invoiceheader_crno;
      this.searchData.aptype = search.aptype;
      // this.searchData.raiser_name = search.raiser_name.id;
      this.searchData.raiser_name = search.raiser_name;
      this.searchData.suppliergst_no = search.suppliergst_no
      if (search.start_date != undefined && search.start_date != "" && search.start_date != null) {
        this.searchData.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd')
        // this.searchData.start_date = search.start_date
      }
      if (search.end_date != undefined && search.end_date != "" && search.end_date != null) {
        this.searchData.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd')
        // this.searchData.end_date = search.end_date
      }
      if (search.raiserbranch_id != undefined && search.raiserbranch_id != null && search.raiserbranch_id != '') {
        this.searchData.raiserbranch_id = search.raiserbranch_id.id;
      }
      else if (this.MakerPermFlg) {
        this.searchData.raiserbranch_id = this.branchrole.id;
      }
      else if (this.COPermission == 0 && this.DOPermission > 0) {
        this.searchData.do_empbranch_code = this.branchrole.code
      }
      if (typeof (search.supplier_id) == 'object') {
        this.searchData.supplier_id = search?.supplier_id?.id
      } else if (typeof (search.supplier_id) == 'number') {
        this.searchData.supplier_id = search?.supplier_id
      } else if (search.supplier_id == null || search.supplier_id == undefined || search.supplier_id == "") {
        this.searchData.supplier_id = ""
      }
      this.searchData.invoice_no = search.invoice_no;
      this.searchData.invoice_amount = search.invoice_amount;
      this.searchData.minamt = search.minamt;
      this.searchData.maxamt = search.maxamt;
      this.searchData.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
      this.searchData.invoice_status = search.invoice_status;
      if (+search.maxamt != 0 && (search.minamt == "" || search.minamt == null || search.minamt == undefined)) {
        this.notification.showError("Please Enter Min Amount")
        this.SpinnerService.hide()
        return false
      }
      if (+search.minamt != 0 && (search.maxamt == "" || search.maxamt == null || search.maxamt == undefined)) {
        this.notification.showError("Please Enter Max Amount")
        this.SpinnerService.hide()
        return false
      }
      if (+search.minamt > 0 && +search.maxamt < +search.minamt) {
        this.notification.showError("Maximum Amount should be greater than Minimum Amount")
        return false
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

        
    // if(field == 'aptype'){
    //   this.searchData['aptype'] =this.selectedItem.id
    // }
    // if(field == 'invoiceheader_crno'){
    //   this.searchData['invoiceheader_crno'] =this.searchValues['crno'];
    // }   
    // if(field == 'supplier'){
    //   this.searchData['supplier_id'] =this.selectedItem.id
    // }  
    // if(field == 'raiser_name'){
    //   this.searchData['raiser_name'] =this.selectedItem.id
    // }
    // if(field == 'branchdetails_id'){
    //   this.searchData['branchdetails_id'] =this.selectedItem.id
    // }
    // if(this.enable_ddl == false){
    //   this.searchData['branchdetails_id'] =this.commonForm.value.branchdetails_id.id
    // }
    // if(field == 'commodity_id'){
    //   this.searchData['commodity_id'] =this.selectedItem.id
    // }
    // if(field == 'apinvoiceheaderstatus_id'){
    //   this.searchData['apinvoiceheaderstatus_id'] =this.selectedItem.id
    // }
    // if(field == 'invoice_status'){
    //   this.searchData['invoice_status'] =this.selectedItem.id
    // }
    // if(field == 'invoice_no'){
    //   this.searchData['invoice_no'] =this.searchValues['invoice_no'];
    // }  
    
    // if(field == 'ecf_date'){
    //   this.searchData['ecf_date'] = 'ecf_date'
    //   this.searchData['start_date'] =this.datePipe.transform(this.commonForm.value.start_date, 'yyyy-MM-dd')
    //   this.searchData['end_date'] =this.datePipe.transform(this.commonForm.value.end_date, 'yyyy-MM-dd')
    // } 
    // if(field == 'inv_amount'){
    //   this.searchData['inv_amount'] = 'inv_amount'
    //   this.searchData['minamt'] =this.commonForm.value.minamt
    //   this.searchData['maxamt'] =this.commonForm.value.maxamt
    // } 
    // if (this.searchData.aptype === '' || this.searchData.aptype === undefined|| this.searchData.aptype === null) {
    //   delete this.searchData.aptype;
    // }
    // if (this.searchData.supplier_id === '' || this.searchData.supplier_id === undefined|| this.searchData.supplier_id === null) {
    //   delete this.searchData.supplier_id
    // }
    // if (this.searchData.branchdetails_id === '' || this.searchData.branchdetails_id === undefined|| this.searchData.branchdetails_id === null) {
    //   delete this.searchData.branchdetails_id;
    // }
    // if (this.searchData.commodity_id === '' || this.searchData.commodity_id === undefined|| this.searchData.commodity_id === null) {
    //   delete this.searchData.commodity_id ;
    // }
    // if (this.searchData.invoice_no === '' || this.searchData.invoice_no === undefined|| this.searchData.invoice_no === null) {
    //   delete this.searchData.invoice_no;
    // }
    // if (this.searchData.apinvoiceheaderstatus_id === '' || this.searchData.apinvoiceheaderstatus_id === undefined
    //   || this.searchData.apinvoiceheaderstatus_id === null) {
    //   delete this.searchData.apinvoiceheaderstatus_id;
    // }
    // if (this.searchData.invoice_status === '' || this.searchData.invoice_status === undefined
    //   || this.searchData.invoice_status === null) {
    //   delete this.searchData.invoice_status;
    // }
 
    // if(this.searchData.start_date === ''|| this.searchData.start_date === undefined|| this.searchData.start_date === null){
    //   delete this.searchData['ecf_date']
    // }

    // if(this.searchData.inv_amount === ''|| this.searchData.inv_amount === undefined|| this.searchData.inv_amount === null){
    //   delete this.searchData['inv_amount']
    // }


    // this.SummaryApiecfapObjNew = {
    //   method: "post",
    //   url: this.url + "ecfapserv/ecfap_common_summary",data: this.searchData,
    // };
    // this.SummaryApicommonecfObjNew = {
    //   method: "post",
    //   url: this.url + "ecfapserv/ecfap_common_summary",
    //   params: "",
    //   data: this.searchData
    // }
    // this.close()
    this.expanded = false
    // this.SpinnerService.show()
    // this.ecfservice.getECFCommonSummary(this.searchData, pageNumber)
    //   .subscribe(result => {
    //     if (result['data'] != undefined) {
    //       this.commonSummary = result['data']
    //       this.mono_status = result['mono_status']
    //       this.expanded = false
    //       for (let i = 0; i < this.commonSummary.length; i++) {
    //         let crno = this.commonSummary[i].crno
    //         let status = this.mono_status.filter(x => x.ecf_crno == crno)[0]?.ap_status ? this.mono_status.filter(x => x.ecf_crno == crno)[0]?.ap_status : ''
    //         this.commonSummary[i].ap_status = status
    //       }
    //       let datapagination = result["pagination"];
    //       this.getcommontotalcount = datapagination?.count
    //       this.length_commonecf = result["pagination"]?.count
    //       if (this.commonSummary.length === 0) {
    //         this.iscommonsummarypage = false
    //       }
    //       if (this.commonSummary.length > 0) {
    //         this.has_commonpagenext = datapagination.has_next;
    //         this.has_commonpageprevious = datapagination.has_previous;
    //         this.commonpresentpage = datapagination.index;
    //         this.iscommonsummarypage = true
    //       }
    //       this.SpinnerService.hide()
    //     } else {
    //       this.notification.showError(result?.message)
    //       this.SpinnerService.hide()
    //       this.expanded = false
    //       return false
    //     }
    //   },
    //     error => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //       this.expanded = false
    //     }
    //   )
  }
  nextClickcommon() {
    if (this.has_commonpagenext === true) {
      this.commonSummarySearch(this.commonpresentpage + 1)
    }
  }

  previousClickcommon() {
    if (this.has_commonpageprevious === true) {
      this.commonSummarySearch(this.commonpresentpage - 1)
    }
  }
  resetcommon(reset) {
    this.commonForm.controls['crno'].reset(""),
      this.commonForm.controls['aptype'].reset(""),
      this.commonForm.controls['minamt'].reset(""),
      this.commonForm.controls['maxamt'].reset(""),
      this.commonForm.controls['batch_no'].reset(""),
      this.commonForm.controls['invoiceheader_crno'].reset(""),
      this.commonForm.controls['raiser_name'].reset(""),
      this.commonForm.controls['supplier'].reset(""),
      this.commonForm.controls['invoice_no'].reset(""),
      this.commonForm.controls['invoice_amount'].reset(""),
      this.commonForm.controls['apinvoiceheaderstatus_id'].reset(""),
      this.commonForm.controls['start_date'].reset(""),
      this.commonForm.controls['end_date'].reset(""),
      this.commonForm.controls['suppliergst_no'].reset(""),

      this.commonForm.controls['invoice_status'].reset("")
     
      if(this.enable_ddl == false){                  
        this.commonForm.controls['branchdetails_id'].setValue(this.branchrole)
      }
      else
      {
        this.commonForm.controls['branchdetails_id'].reset("")
      }
      this.searchData = {};
      this.searchValues ={};
      this.commonSummarySearch('', 1);
    this.pageIndexCommon = 0
  }

  // resetcommon(e){
  //   this.restcommonformummary =['invoiceheader_crno','invoice_no','apdate','totalamount','ap_status','apinvoicehdr_status','start_date','end_date','minamt','maxamt','ecf_date','inv_amount']
  //   this.globalpayload = "";
  //   this.SummaryApicommonecfObjNew = {
  //       method: "post",
  //       url: this.url + "ecfapserv/ecfap_common_summary",
  //       params: "",
  //       data: {}
  //     }
  // }
  headerbutton:any=[{icon:"replay", reset: true}]
sctcommonstatus:any;

  commonStatusList :any =[]
  commonAndECFStatusList : any
  get_commonAndECF_status() {
     this.ecfservice.getecfstatus()
     .subscribe(result => {
       if (result['data'] != undefined) {
         this.ApprovalStatusList = result['data']
         this.commonAndECFStatusList = result["data"]
            this.ecfstatuss_common_report = {
            label: "ECF Status",
            searchkey: "query",
            displaykey: "text",
            // url: this.ecfURL + "ecfapserv/get_inventory_status",
            // Outputkey: "id",
            formcontrolname: "apinvoiceheaderstatus_id",
            // valuekey: "id",
            fronentdata: true,
            data: this.commonAndECFStatusList,
            wholedata: true,
            id: "ecfap-0023"
          }
       }
       this.ecfservice.get_common_status()
         .subscribe(result => {
           if (result['data'] != undefined) {
             let data = result['data']
             this.sctcommonstatus= data
             this.commonStatusList = data
             console.log(" this.commonStatusList", this.commonStatusList)
             this.commonAndECFStatusList =this.commonAndECFStatusList.concat({'id' : -1 , 'text' : '- - - - - - - - - - - - - - - - - - - -'})
             this.commonAndECFStatusList =this.commonAndECFStatusList.concat(data)
           }
          
         }, error => {
           this.errorHandler.handleError(error);
           this.SpinnerService.hide();
         })
     }, error => {
       this.errorHandler.handleError(error);
       this.SpinnerService.hide();
     })
     
   }
 
  commonStatusChange(data){
    if(data.id == -1){
      this.notification.showError('Please choose a Valid Status.')
      this.CommonRptDwnldForm.controls['apinvoiceheaderstatus_id'].reset()
    }
  }
  commonView(data) {
    if (this.commonForm.value.apinvoiceheaderstatus_id == 11) {
      this.bounceView(data);
    }
  }
  raiserBr: any;
  linkView(data) {
    this.shareservice.invheaderid.next(data.id)
    this.shareservice.invhdrstatus.next(data.apinvoicehdr_status?.text)
    this.apinvHeader_id = data.id
    this.raiserBr = data?.raiserbranch_branch?.name
    this.ecfheaderid = data.apheader_id
    this.shareservice.crno.next(data?.crno)
    this.ecfsummaryForm = false
    this.ecfcreateForm = false
    this.ecfviewForm = false
    this.batchviewForm = false
    this.headerdata =[]
    this.commonInvViewForm = true
    this.APApprovalForm = false
    this.showinvoicediv = true
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
    this.getCommontInvHdr();
  }


  showRecurDates = false
  commonbackview() {
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
    this.InvoiceDetailViewForm = false
    this.BounceDetailForm = false
    this.commonInvViewForm = false
    this.ecfapprovalsummaryForm = false
    this.ecfapprovalviewForm = false
    this.AppInvoiceDetailViewForm = false
    this.dataclear('')
    this.overallreset()

    this.resetcommon('')
  }

  ecftypeid: any;
  payto_id: any;
  invdtladdonid: any;
  debitdata: any;
  invhdrstatus: any;
  liqDetails: any;
  PCA_Det = []
  tdsapplicability = ""
  paymentinstructions = ""
  pmd_data = ""
  is_pca = ""
  Is_capitalized:any
  msme:any
  msme_reg_no:any
  showreg:boolean = false;
  commoditynamepanel:any
  tcsadded= false;
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

          this.pmd_data = this.headerdata[0].pmd_data?.location
          this.is_pca = this.headerdata[0].is_pca
          this.files_summary();
          this.ecftypeid = this.headerdata[0]?.aptype_id
          this.payto_id = this.headerdata[0].payto_id
          if (this.payto_id == undefined || this.payto_id == "")
            this.payto_id = this.headerdata[0]?.ppx
          if (this.headerdata[0] !== undefined && this.headerdata[0] !== null) {
            this.crno = this.headerdata[0].apinvoiceheader_crno
            this.invhdrstatus = this.headerdata[0].invoice_status
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
            let num: number = +this.headerdata[0].totalamount;
            let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
            amt = amt ? amt.toString() : '';
            num = +this.headerdata[0].invoiceamount;
            let taxableamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
            taxableamt = taxableamt ? taxableamt.toString() : '';
            this.Emppanel = this.headerdata[0].raisername + ' - ' + this.headerdata[0].raisercode
            this.InvNopanel = this.headerdata[0]?.invoiceno
            this.BranchGSTpanel = this.headerdata[0]?.raisorbranchgst
            this.Branchnamecard = this.headerdata[0]?.invoice_branch?.name_code
            this.Pmdpanel = this.headerdata[0]?.pmd_data?.location
            this.InvDatepanel = this.datePipe.transform(this.headerdata[0]?.invoicedate, 'dd-MMM-yyyy')
            this.InvAmtpanel = amt
            this.TaxableAmtpanel = taxableamt
            this.Statuspanel = this.shareservice.invhdrstatus.value
            this.Supplierpanel = this.headerdata[0].supplier_id?.name + ' - ' + this.headerdata[0].supplier_id?.code
            this.SupGSTpanel = this.headerdata[0].supplier_id?.gstno
            this.commoditynamepanel = this.headerdata[0]?.commodity?.name
            this.Service_typepanel = this.headerdata[0]?.servicetype?.text
            this.Recur_fromdatepanel = this.datePipe.transform(this.headerdata[0]?.recur_fromdate, 'dd-MMM-yyyy')
            this.Recur_fromdatepanel = this.datePipe.transform(this.headerdata[0]?.recur_fromdate, 'dd-MMM-yyyy')
            this.Recur_todatepanel = this.datePipe.transform(this.headerdata[0]?.recur_todate, 'dd-MMM-yyyy')
            this.Gstpanel = this.headerdata[0]?.invoicegst == 'Y' ? 'Yes' : 'No'
            this.Is_pcapanel = this.headerdata[0]?.is_pca ? 'Yes' : 'No'
            this.Pca_nopanel = this.headerdata[0]?.pca_no
            this.Is_recurpanel = this.headerdata[0]?.is_recur?.text
            this.Is_capitalized = this.headerdata[0]?.is_capitalized === true ||this.headerdata[0]?.is_capitalized === 'true' ? 'Yes' : 'No';
            this.msme = this.headerdata[0]?.is_msme == 'true' ? 'Yes' : 'No';
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

              this.tdsapplicability = this.headerdata[0]?.is_tds_applicable?.text
              this.paymentinstructions = this.headerdata[0]?.payment_instruction
              
            if (this.ecftypeid != 4) {
              this.invDetailList = this.headerdata[0].invoicedetails.data
              this.is_component = this.headerdata[0].invoicedetails.data[0].is_component ?? false
            for (let i = 0; i < this.invDetailList.length; i++) {
                if (this.invDetailList[i].productname?.toLowerCase().trim() === "tax collected at source") {
                  this.tcsadded = true;
                  break;
                }
              }
              for(let i=0; i<this.invDetailList.length; i++){
                if(this.invDetailList[i].is_rcmproduct== 'Y')
                  this.invDetailList[i].is_rcmproduct = 'Yes'
                else
                  this.invDetailList[i].is_rcmproduct = 'No'
                
              
                if(this.invDetailList[i].is_blockedproduct== 'Y')
                  this.invDetailList[i].is_blockedproduct = 'Yes'
                else
                  this.invDetailList[i].is_blockedproduct = 'No'
  
              }
              this.frmInvHdr.controls['is_capitalized'].setValue(this.invDetailList[0].is_capitalized ? 'Yes' : 'No')
              this.OtherAmount = this.invDetailList[0]?.otheramount
              let taxableamt = this.invDetailList.map(x=>x.taxable_amount)
              let amtsum = taxableamt.reduce((a, b) => Number(a) + Number(b), 0)
              this.taxableamt = amtsum
              this.Roundoffamount = this.headerdata[0].roundoffamt
              let amtdata = this.invDetailList.map(x => x.totalamount)
              this.INVsum = (amtdata.reduce((a, b) => Number(a) + Number(b), 0) + +this.invDetailList[0]?.otheramount
                + +this.headerdata[0].roundoffamt).toFixed(2);
              let cred = this.headerdata[0].ecfap_credit;
              this.invCreditList = cred.filter(x => x.amount >= 0 && x.is_display == "YES")
              let credamtdata = this.invCreditList.map(x => x.amount)
              this.cdtsum = credamtdata.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
            }
            else {
               this.invDetailList = this.headerdata[0].invoicedetails.data
              this.adddebits(this.headerdata[0].invoicedetails.data[0])
              this.frmInvHdr.controls['is_capitalized'].setValue(this.invDetailList[0].is_capitalized ? 'Yes' : 'No')

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

  // getfiles(data) {
  //   this.SpinnerService.show()
  //   this.ecfservice.filesdownload(data?.file_data[0].file_id)
  //     .subscribe((results) => {

  //       let binaryData = [];
  //       binaryData.push(results)
  //       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //       let link = document.createElement('a');
  //       link.href = downloadUrl;
  //       link.download = data.file_data[0].file_name;
  //       link.click();
  //       this.SpinnerService.hide()
  //     },
  //       error => {
  //         this.errorHandler.handleError(error);
  //         this.SpinnerService.hide();
  //       }
  //     )
  // }
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
  // data1(datas) {
  //   this.showimageHeaderAPI = false
  //   this.showimagepdf = false
  //   let id = datas?.file_data[0].file_id
  //   let filename = datas?.file_data[0].file_name
  //   this.ecfservice.downloadfile(id)

  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   this.tokenValues = token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let stringValue = filename.split('.')


  //   if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg" ||
  //     stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG" || stringValue[1] === "pdf" || stringValue[1] === "PDF" ||
  //     stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt" ||
  //     stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
  //     this.jpgUrlsAPI = window.open(this.imageUrl + "ecfapserv/ecffile/" + id + "?token=" + token, '_blank');
  //   }

  //   // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
  //   // stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

  //   //     // this.showimageHeaderAPI = true
  //   //     // this.showimagepdf = false


  //   //   }
  //   //   if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
  //   //     // this.showimagepdf = true
  //   //     // this.showimageHeaderAPI = false
  //   //     this.ecfservice.downloadfile1(id)
  //   //       // .subscribe((data) => {
  //   //       //   let dataType = data.type;
  //   //       //   let binaryData = [];
  //   //       //   binaryData.push(data);
  //   //       //   let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
  //   //       //   window.open(downloadLink, "_blank");
  //   //       // }, (error) => {
  //   //       //   this.errorHandler.handleError(error);
  //   //       //   this.showimagepdf = false
  //   //       //   this.showimageHeaderAPI = false
  //   //       //   this.SpinnerService.hide();
  //   //       // })
  //   //   }
  //   //   if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
  //   //   stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
  //   //     // this.showimagepdf = false
  //   //     // this.showimageHeaderAPI = false
  //   //   }  

  // }

  // data(datas) {
  //   let id = datas?.file_id
  //   let filename = datas?.file_name
  //   // this.ecfservice.downloadfile(id)




  //   const getToken = localStorage.getItem("sessionData");
  //   let tokenValue = JSON.parse(getToken);
  //   let token = tokenValue.token;
  //   this.tokenValues = token
  //   const headers = { 'Authorization': 'Token ' + token }
  //   let stringValue = filename.split('.')
  //   if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg"||
  //   stringValue[1] === "PNG" || stringValue[1] === "JPEG" || stringValue[1] === "JPG") {

  //       this.showimageHeaderAPI = true
  //       this.showimagepdf = false
  //       this.jpgUrlsAPI = this.imageUrl + "ecfserv/fileview/" + id + "?token=" + token;
  //     }
  //     if (stringValue[1] === "pdf"|| stringValue[1] === "PDF") {
  //       this.showimagepdf = true
  //       this.showimageHeaderAPI = false
  //       this.ecfservice.downloadfile(id)
  //         .subscribe((data) => {
  //           let binaryData = [];
  //           binaryData.push(data)
  //           let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //           let link = document.createElement('a');
  //           link.href = downloadUrl;
  //           this.pdfurl = downloadUrl
  //         }, (error) => {
  //           this.errorHandler.handleError(error);
  //           this.showimagepdf = false
  //           this.showimageHeaderAPI = false
  //           this.SpinnerService.hide();
  //         })
  //     }
  //     if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt"||
  //     stringValue[1] === "ODS" || stringValue[1] === "XLSX" || stringValue[1] === "TXT") {
  //       this.showimagepdf = false
  //       this.showimageHeaderAPI = false
  //     }




  //     }


  overallback() {
    this.shareservice.comefrom.next("invoicedetail")
    this.router.navigate(['ECFAP/ecfapsummary'], { queryParams: { comefrom: "invoicedetail" }, skipLocationChange: true })
  }
  viewtrnlstCount : number
  viewtrnlist: any = [];
  viewtrnHasNext = false
  viewtrnHasPrevious = false
  viewtrnCurrentPage =1
  viewtrn(page =1) {
    this.popupopen3();
    this.viewtrnlist = []
    this.SpinnerService.show()
    this.ecfservice.getViewTrans(this.apinvHeader_id, page).subscribe(data => {
      this.SpinnerService.hide()
      this.viewtrnlist = data['data'];

      this.viewtrnlstCount =data?.count
      let pagination = data['pagination']
      

      this.viewtrnCurrentPage = pagination?.index;
      if (this.viewtrnlist.length > 0) {
        this.length_viewtrn =data?.count
        this.viewtrnCurrentPage = pagination.index;
      }
      this.view_summary()
    })
  }

  length_viewtrn = 0;
  pageSize_Viewtrn = 10
  pageIndexViewtrn=0
  handleViewtrn(event: PageEvent) {
    this.length_viewtrn = event.length;
    this.pageSize_Viewtrn = event.pageSize;
    this.pageIndexViewtrn = event.pageIndex;
    this.viewtrnCurrentPage=event.pageIndex+1;
    this.viewtrn( this.viewtrnCurrentPage);  
  }
  name: any;
  designation: any;
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

  fileback() {
    this.fileViewShow = false
    this.closedbuttons.nativeElement.click()
    this.showCreateTempForm = true
  }

  attachmentback() {
    this.closeAttachment.nativeElement.click()
  }

  length_ecf = 0;
  pageIndexECF = 0;
  pageSizeOptions = [5, 10, 25];
  pageSize_ecf = 10;
  showFirstLastButtons: boolean = true;
  handlePageEvent(event: PageEvent) {
    this.length_ecf = event.length;
    this.pageSize_ecf = event.pageSize;
    this.pageIndexECF = event.pageIndex;
    this.ecfpresentpage = event.pageIndex + 1;
    this.summarysearch('', this.ecfpresentpage);

  }
  pageIndexSuppWise = 0
  SuppWiseCurrPage = 1
  handleSuppWisePageEvent(event: PageEvent) {
    this.SuppWiseDataLen = event.length;
    this.pageSize_ecf = event.pageSize;
    this.pageIndexSuppWise = event.pageIndex;
    this.SuppWiseCurrPage = event.pageIndex + 1;
    // this.SupplierECFsearch(this.SuppWiseCurrPage);
    this.supplierwiseSearch("")

  }
  length_batch = 0;
  pageSize_batch = 10
  pageIndexBatch = 0;
  handlebatchPageEvent(event: PageEvent) {
    this.length_batch = event.length;
    this.pageSize_batch = event.pageSize;
    this.pageIndexBatch = event.pageIndex;
    this.batchpresentpage = event.pageIndex + 1;
    this.batchsummarysearch(this.batchpresentpage);

  }

  length_commonecf = 0;
  pageSize_commonecf = 10
  pageIndexCommon = 0;
  handlecommonPageEvent(event: PageEvent) {
    this.length_commonecf = event.length;
    this.pageSize_commonecf = event.pageSize;
    this.pageIndexCommon = event.pageIndex;
    this.commonpresentpage = event.pageIndex + 1;
    this.commonSummarySearch('',this.commonpresentpage);

  }

  length_approverecf = 0;
  pageSize_approverecf = 10
  pageIndexApprove = 0
  handleappecfPageEvent(event: PageEvent) {
    this.length_approverecf = event.length;
    this.pageSize_approverecf = event.pageSize;
    this.pageIndexApprove = event.pageIndex;
    this.ecfapppresentpage = event.pageIndex + 1;
    this.ecfapprovalsummarysearch(this.ecfapppresentpage);

  }

  length_approverbatchecf = 0;
  pageSize_approverbatchecf = 10
  pageIndexBatchApprove = 0
  handleappbatchPageEvent(event: PageEvent) {
    this.length_approverbatchecf = event.length;
    this.pageSize_approverbatchecf = event.pageSize;
    this.pageIndexBatchApprove = event.pageIndex;
    this.batchapppresentpage = event.pageIndex + 1;
    this.batchappsummarysearch(this.batchapppresentpage);

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

    this.CommonRptDwnldForm.get('raiser_name').valueChanges
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


  changeHistoryInvHdr: any = []
  changeHistoryInvdtl: any = []
  changeHistoryCreddtl: any = []
  changeHistoryDbtdtl: any = []

  getChangeHistory() {
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
        this.paytoid = this.changeHistoryInvHdr[0]?.payto_id
        // this.paytoid = "S"

        if (this.paytoid == undefined || this.paytoid == "")
          this.paytoid = this.changeHistoryInvHdr[0]?.ppx
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
        let data = result?.data
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

  //   ngAfterViewChecked() {
  //     const list = document.getElementsByClassName('mat-paginator-range-label');
  //     list[0].innerHTML = 'Page: ' + this.ecfpresentpage.toString();
  // }

  resetECFinvRptDwnld(){
    this.ECFinvRptDwnldForm.reset()
  }
  backECFinvRptDwnld(){
    this.ECFinvRptDwnldForm.reset()
    this.closeECFinvRptDwnld.nativeElement.click()
  }
  resetECFAppRptDwnld(){
    this.ECFAppRptDwnldForm.reset()
  }
  backECFAppRptDwnld(){
    this.ECFAppRptDwnldForm.reset()
    this.closeECFAppRptDwnld.nativeElement.click()
  }

  resetCmnRptDwnld(){
    this.CommonRptDwnldForm.reset()

   if(!this.enable_ddl)
    this.CommonRptDwnldForm.controls['branchdetails_id'].setValue(this.branchrole)
  }
  backCmnRptDwnld(){
    this.CommonRptDwnldForm.reset()
    this.closecmnrptDwnld.nativeElement.click()
  }

  // getRptDownload(rptFormat) {
  //   let datas = rptFormat
  //   let payloadbodydata = {
  //     type: 1,
  //     crno: "",
  //     aptype: "",
  //     apstatus: "",
  //     ecfstatus: "",
  //     minamt: "",
  //     maxamt: "",
  //     branch: "",
  //     batchno: "",
  //     supplier_id: "",
  //     invoice_no: "",
  //     commodity_id: "",
  //   };
  //   payloadbodydata = { ...payloadbodydata, ...datas };
  //   console.log("payloadbodydata_down ======> ", payloadbodydata);
  //   let format = 1
  //   let data
  //   this.SpinnerService.show()

  //   if (format == 1) {
  //     data = this.ecfSearchForm.value
  //     if (data.maxamt != "" && data.minamt == "") {
  //       this.notification.showError("Please Enter Min Amount")
  //       this.SpinnerService.hide()
  //       return false
  //     }
  //     if (data.maxamt == "" && data.minamt != "") {
  //       this.notification.showError("Please Enter Max Amount")
  //       this.SpinnerService.hide()
  //       return false
  //     }

  //     if (typeof (data?.branch) == 'object') {
  //       data.branch = data?.branch?.id
  //     } else if (typeof (data?.branch) == 'number') {
  //       data.branch = data.branch
  //     } else {
  //       data.branch = ""
  //     }
  //     if (typeof (data?.supplier_id) == 'object') {
  //       data.supplier_id = data?.supplier_id?.id
  //     } else if (typeof (data?.supplier_id) == 'number') {
  //       data.supplier_id = data.supplier_id
  //     } else {
  //       data.supplier_id = ""
  //     }
  //     if (typeof (data?.commodity_id) == 'object') {
  //       data.commodity_id = data?.commodity_id?.id
  //     } else if (typeof (data?.commodity_id) == 'number') {
  //       data.commodity_id = data.commodity_id
  //     } else {
  //       data.commodity_id = ""
  //     }
  //     if (data.start_date != undefined && data.start_date != "" && data.start_date != null) {
  //       data.start_date = this.datePipe.transform(data.start_date, 'yyyy-MM-dd')
  //     }
  //     else {
  //       delete data.start_date
  //     }
  //     if (data.end_date != undefined && data.end_date != "" && data.end_date != null) {
  //       data.end_date = this.datePipe.transform(data.end_date, 'yyyy-MM-dd')
  //     }
  //     else {
  //       delete data.end_date
  //     }
  //   }
  //   else if (format == 2) {
  //     data = this.ecfapprovalform.value
  //     if (data.maxamt != "" && data.minamt == "") {
  //       this.notification.showError("Please Enter Min Amount")
  //       this.SpinnerService.hide()
  //       return false
  //     }
  //     if (data.maxamt == "" && data.minamt != "") {
  //       this.notification.showError("Please Enter Max Amount")
  //       this.SpinnerService.hide()
  //       return false
  //     }

  //     if (typeof (data?.branch) == 'object') {
  //       data.branch = data?.branch?.id
  //     } else if (typeof (data?.branch) == 'number') {
  //       data.branch = data?.branch
  //     } else {
  //       data.branch = ""
  //     }
  //     if (typeof (data?.supplier_id) == 'object') {
  //       data.supplier_id = data?.supplier_id?.id
  //     } else if (typeof (data?.supplier_id) == 'number') {
  //       data.supplier_id = data?.supplier_id
  //     } else {
  //       data.supplier_id = ""
  //     }
  //     if (typeof (data?.commodity_id) == 'object') {
  //       data.commodity_id = data?.commodity_id?.id
  //     } else if (typeof (data?.commodity_id) == 'number') {
  //       data.commodity_id = data?.commodity_id
  //     } else {
  //       data.commodity_id = ""
  //     }
  //   }
  //   else if (format == 3) {
  //     let search = this.commonForm.value
  //     data = {}
  //     data.crno = search.crno;
  //     data.batch_no = search.batch_no;
  //     data.invoiceheader_crno = search.invoiceheader_crno;
  //     data.aptype = search.aptype;
  //     data.raiser_name = search.raiser_name.id;
  //     data.suppliergst_no = search.suppliergst_no
  //     if (search.start_date != undefined && search.start_date != "" && search.start_date != null) {
  //       data.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd')
  //     }
  //     if (search.end_date != undefined && search.end_date != "" && search.end_date != null) {
  //       data.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd')
  //     }
  //     if (search.raiserbranch_id != undefined && search.raiserbranch_id != null && search.raiserbranch_id != '') {
  //       data.raiserbranch_id = search.raiserbranch_id.id;
  //     }
  //     else if (this.MakerPermFlg) {
  //       data.raiserbranch_id = this.branchrole.id;
  //     }
  //     else if (this.COPermission == 0 && this.DOPermission > 0) {
  //       data.do_empbranch_code = this.branchrole.code
  //     }
  //     if (typeof (search.supplier_id) == 'object') {
  //       data.supplier_id = search?.supplier_id?.id
  //     } else if (typeof (search.supplier_id) == 'number') {
  //       data.supplier_id = search?.supplier_id
  //     } else if (search.supplier_id == null || search.supplier_id == undefined || search.supplier_id == "") {
  //       data.supplier_id = ""
  //     }
  //     data.invoice_no = search.invoice_no;
  //     data.invoice_amount = search.invoice_amount;
  //     data.minamt = search.minamt;
  //     data.maxamt = search.maxamt;
  //     data.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
  //     data.invoice_status = search.invoice_status;

  //     if (+search.maxamt != 0 && (search.minamt == "" || search.minamt == null || search.minamt == undefined)) {
  //       this.notification.showError("Please Enter Min Amount")
  //       this.SpinnerService.hide()
  //       return false
  //     }
  //     if (search.minamt != 0 && (search.maxamt == "" || search.maxamt == null || search.maxamt == undefined)) {
  //       this.notification.showError("Please Enter Max Amount")
  //       this.SpinnerService.hide()
  //       return false
  //     }
  //     if (+search.minamt > 0 && +search.maxamt < +search.minamt) {
  //       this.notification.showError("Maximum Amount should be greater than Minimum Amount")
  //       return false
  //     }

  //     for (let i in data) {
  //       if (data[i] === null || data[i] === "") {
  //         delete data[i];
  //       }
  //     }
  //   }
  //   this.ecfservice.getECFRptDownload(format, payloadbodydata)
  //     .subscribe((results) => {

  //       if (results?.code == undefined) {
  //         let binaryData = [];
  //         binaryData.push(results)
  //         let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //         let link = document.createElement('a');
  //         link.href = downloadUrl;
  //         if (format == 1) {
  //           link.download = "ECF Inventory Report.xlsx";
  //         }
  //         else if (format == 2) {
  //           link.download = "ECF Approval Report.xlsx";
  //         }
  //         else if (format == 3) {
  //           link.download = "ECF Common Report.xlsx";
  //         }
  //         link.click();
  //       }
  //       else {
  //         this.notification.showError(results.code)
  //       }
  //       this.SpinnerService.hide()
  //     },
  //       error => {
  //         this.errorHandler.handleError(error);
  //         this.SpinnerService.hide();
  //       }

  //     )
  // }
  downloadpopupinventory() {
    this.popupopen11()
  }
  // getRptDownload(rptFormat) {
  //   let datas = rptFormat
  //   let data
  //   let payloadbodydata = {
  //     type: 1,
  //     crno: "",
  //     aptype: "",
  //     apstatus: "",
  //     ecfstatus: "",
  //     minamt: "",
  //     maxamt: "",
  //     branch: "",
  //     batchno: "",
  //     supplier_id: "",
  //     invoice_no: "",
  //     commodity_id: "",
  //   };
  //   payloadbodydata = { ...payloadbodydata, ...datas };
  //   console.log("payloadbodydata_down ======> ", payloadbodydata);
  //   let format = 1

  //   // let payloadbodydata = {
  //   //   type: 1,
  //   //   crno: "",
  //   //   aptype: "",
  //   //   apstatus: "",
  //   //   ecfstatus: "",
  //   //   minamt: "",
  //   //   maxamt: "",
  //   //   branch: "",
  //   //   batchno: "",
  //   //   supplier_id: "",
  //   //   invoice_no: "",
  //   //   commodity_id: "",
  //   // };
  //   // payloadbodydata = { ...payloadbodydata, ...datas };
  //   // console.log("payloadbodydata_down ======> ", payloadbodydata);
  //   // let format = 1
  //   // let data
  //   // this.SpinnerService.show()

  //   // if (format == 1) {
  //   //   data = this.ecfSearchForm.value
  //   //   if (data.maxamt != "" && data.minamt == "") {
  //   //     this.notification.showError("Please Enter Min Amount")
  //   //     this.SpinnerService.hide()
  //   //     return false
  //   //   }
  //   //   if (data.maxamt == "" && data.minamt != "") {
  //   //     this.notification.showError("Please Enter Max Amount")
  //   //     this.SpinnerService.hide()
  //   //     return false
  //   //   }

  //   //   if (typeof (data?.branch) == 'object') {
  //   //     data.branch = data?.branch?.id
  //   //   } else if (typeof (data?.branch) == 'number') {
  //   //     data.branch = data.branch
  //   //   } else {
  //   //     data.branch = ""
  //   //   }
  //   //   if (typeof (data?.supplier_id) == 'object') {
  //   //     data.supplier_id = data?.supplier_id?.id
  //   //   } else if (typeof (data?.supplier_id) == 'number') {
  //   //     data.supplier_id = data.supplier_id
  //   //   } else {
  //   //     data.supplier_id = ""
  //   //   }
  //   //   if (typeof (data?.commodity_id) == 'object') {
  //   //     data.commodity_id = data?.commodity_id?.id
  //   //   } else if (typeof (data?.commodity_id) == 'number') {
  //   //     data.commodity_id = data.commodity_id
  //   //   } else {
  //   //     data.commodity_id = ""
  //   //   }
  //   //   if (data.start_date != undefined && data.start_date != "" && data.start_date != null) {
  //   //     data.start_date = this.datePipe.transform(data.start_date, 'yyyy-MM-dd')
  //   //   }
  //   //   else {
  //   //     delete data.start_date
  //   //   }
  //   //   if (data.end_date != undefined && data.end_date != "" && data.end_date != null) {
  //   //     data.end_date = this.datePipe.transform(data.end_date, 'yyyy-MM-dd')
  //   //   }
  //   //   else {
  //   //     delete data.end_date
  //   //   }
  //   // }
  //   // else if (format == 2) {
  //   //   data = this.ecfapprovalform.value
  //   //   if (data.maxamt != "" && data.minamt == "") {
  //   //     this.notification.showError("Please Enter Min Amount")
  //   //     this.SpinnerService.hide()
  //   //     return false
  //   //   }
  //   //   if (data.maxamt == "" && data.minamt != "") {
  //   //     this.notification.showError("Please Enter Max Amount")
  //   //     this.SpinnerService.hide()
  //   //     return false
  //   //   }

  //   //   if (typeof (data?.branch) == 'object') {
  //   //     data.branch = data?.branch?.id
  //   //   } else if (typeof (data?.branch) == 'number') {
  //   //     data.branch = data?.branch
  //   //   } else {
  //   //     data.branch = ""
  //   //   }
  //   //   if (typeof (data?.supplier_id) == 'object') {
  //   //     data.supplier_id = data?.supplier_id?.id
  //   //   } else if (typeof (data?.supplier_id) == 'number') {
  //   //     data.supplier_id = data?.supplier_id
  //   //   } else {
  //   //     data.supplier_id = ""
  //   //   }
  //   //   if (typeof (data?.commodity_id) == 'object') {
  //   //     data.commodity_id = data?.commodity_id?.id
  //   //   } else if (typeof (data?.commodity_id) == 'number') {
  //   //     data.commodity_id = data?.commodity_id
  //   //   } else {
  //   //     data.commodity_id = ""
  //   //   }
  //   // }
  //   // else if (format == 3) {
  //   //   let search = this.commonForm.value
  //   //   data = {}
  //   //   data.crno = search.crno;
  //   //   data.batch_no = search.batch_no;
  //   //   data.invoiceheader_crno = search.invoiceheader_crno;
  //   //   data.aptype = search.aptype;
  //   //   data.raiser_name = search.raiser_name.id;
  //   //   data.suppliergst_no = search.suppliergst_no
  //   //   if (search.start_date != undefined && search.start_date != "" && search.start_date != null) {
  //   //     data.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd')
  //   //   }
  //   //   if (search.end_date != undefined && search.end_date != "" && search.end_date != null) {
  //   //     data.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd')
  //   //   }
  //   //   if (search.raiserbranch_id != undefined && search.raiserbranch_id != null && search.raiserbranch_id != '') {
  //   //     data.raiserbranch_id = search.raiserbranch_id.id;
  //   //   }
  //   //   else if (this.MakerPermFlg) {
  //   //     data.raiserbranch_id = this.branchrole.id;
  //   //   }
  //   //   else if (this.COPermission == 0 && this.DOPermission > 0) {
  //   //     data.do_empbranch_code = this.branchrole.code
  //   //   }
  //   //   if (typeof (search.supplier_id) == 'object') {
  //   //     data.supplier_id = search?.supplier_id?.id
  //   //   } else if (typeof (search.supplier_id) == 'number') {
  //   //     data.supplier_id = search?.supplier_id
  //   //   } else if (search.supplier_id == null || search.supplier_id == undefined || search.supplier_id == "") {
  //   //     data.supplier_id = ""
  //   //   }
  //   //   data.invoice_no = search.invoice_no;
  //   //   data.invoice_amount = search.invoice_amount;
  //   //   data.minamt = search.minamt;
  //   //   data.maxamt = search.maxamt;
  //   //   data.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
  //   //   data.invoice_status = search.invoice_status;

  //   //   if (+search.maxamt != 0 && (search.minamt == "" || search.minamt == null || search.minamt == undefined)) {
  //   //     this.notification.showError("Please Enter Min Amount")
  //   //     this.SpinnerService.hide()
  //   //     return false
  //   //   }
  //   //   if (search.minamt != 0 && (search.maxamt == "" || search.maxamt == null || search.maxamt == undefined)) {
  //   //     this.notification.showError("Please Enter Max Amount")
  //   //     this.SpinnerService.hide()
  //   //     return false
  //   //   }
  //   //   if (+search.minamt > 0 && +search.maxamt < +search.minamt) {
  //   //     this.notification.showError("Maximum Amount should be greater than Minimum Amount")
  //   //     return false
  //   //   }

  //   //   for (let i in data) {
  //   //     if (data[i] === null || data[i] === "") {
  //   //       delete data[i];
  //   //     }
  //   //   }
  //   // }
  //   if(rptFormat == 3){
  //      let search=this.CommonRptDwnldForm.value
  //      data ={}
  //      data.crno = search?.crno ;
  //      data.batch_no = search?.batch_no;
  //      data.invoiceheader_crno = search.invoiceheader_crno;
  //      data.aptype = search.aptype;
  //      data.raiser_name = search.raiser_name?.id;
  //      data.suppliergst_no = search.suppliergst_no
  //      if(search.start_date != undefined && search.start_date != "" && search.start_date != null )
  //      {
  //        data.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd')
  //      }
  //      if(search.end_date != undefined && search.end_date != "" && search.end_date != null )
  //      {
  //        data.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd')
  //      }
  //      if(search.raiserbranch_id != undefined && search.raiserbranch_id != null && search.raiserbranch_id !='')
  //      {
  //        data.raiserbranch_id = search.raiserbranch_id.id;
  //      }
  //      else if(this.MakerPermFlg )
  //      {
  //        data.raiserbranch_id = this.branchrole.id;
  //      }
  //      else if(this.COPermission ==0 && this.DOPermission >0)
  //      {
  //        data.do_empbranch_code = this.branchrole.code
  //      }
  //      if(typeof(search.supplier_id)=='object'){
  //        data.supplier_id = search?.supplier_id?.id
  //      }else  if(typeof(search.supplier_id)=='number'){
  //        data.supplier_id = search?.supplier_id
  //      }else if( search.supplier_id == null ||  search.supplier_id == undefined ||  search.supplier_id == ""){
  //        data.supplier_id  = ""
  //      }
  //      data.invoice_no = search.invoice_no;
  //      data.invoice_amount = search.invoice_amount;
  //      let headerstsid
  //      let invstsid
  //      if(search.apinvoiceheaderstatus_id != undefined && search.apinvoiceheaderstatus_id != ''){
  //        headerstsid = this.commonStatusList.filter(x => x.id == search.apinvoiceheaderstatus_id)[0]
  //        invstsid = this.ApprovalStatusList.filter(x => x.id == search.apinvoiceheaderstatus_id)[0]
  //        if(headerstsid)
  //          data.apinvoiceheaderstatus_id = headerstsid?.id
  //        if(invstsid)
  //          data.invoice_status = invstsid?.id
  //      }
      
  //      // if (+search.maxamt != 0 && (search.minamt == "" || search.minamt == null || search.minamt == undefined)) {
  //      //   this.notification.showError("Please Enter Min Amount")
  //      //   this.SpinnerService.hide()
  //      //   return false
  //      // }
  //      // if (search.minamt != 0 && (search.maxamt == "" || search.maxamt == null || search.maxamt == undefined)) {
  //      //   this.notification.showError("Please Enter Max Amount")
  //      //   this.SpinnerService.hide()
  //      //   return false
  //      // }
  //      // if(+search.minamt > 0 && +search.maxamt < +search.minamt)
  //      // {
  //      //   this.notification.showError("Maximum Amount should be greater than Minimum Amount")
  //      //   return false
  //      // }
  //      for (let i in data) 
  //       {
  //           if (data[i] === null || data[i] === "") {
  //             delete data[i];
  //           }
  //         }
  //      this.searchData = data
      
  //      }
  //   this.SpinnerService.show()
  //   this.ecfservice.getECFRptDownload(format, payloadbodydata)
  //     .subscribe((results) => {
  //       if (results?.code == undefined) {
  //         let binaryData = [results];
  //         let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //         let link = document.createElement('a');
  //         link.href = downloadUrl;
  //         link.download = "ECF Inventory Report.xlsx";
  //         link.click();
  //         this.SpinnerService.hide()
  //       } else {
  //         this.notification.showError(results.code);
  //         this.SpinnerService.hide()
  //       }
  //     }, error => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     });
  // }
ecfinventorypayload:any
  getRptDownload(rptFormat)
{
 let data
 this.SpinnerService.show()

 if(rptFormat==1)
 {
  let search=this.ECFinvRptDwnldForm.value
  search.aptype = this.ecftypedata
  search.ecfstatus = this.ecfstatusdata
  // search.branch = this.branchdatas
  // search.commodity_id = this.commoditydatas
  // search.supplier = this.supplierdata1
  // this.ecfinventorypayload = {...search,...this.ecftypedata}1261
  // console.log("ecfinventorypayload",this.ecfinventorypayload)
  data ={}
  data.crno = search?.crno ;
  data.aptype = search.aptype;
  if(search.branch != undefined && search.branch != null && search.branch !='')
    {
      data.branch = search.branch.id;
    }
  else
  {
    delete data.branch 
  }
  if(typeof(search.supplier_id)=='object'){
    data.supplier_id = search?.supplier_id?.id
  }else  if(typeof(search.supplier_id)=='number'){
    data.supplier_id = search?.supplier_id
  }else if( search.supplier_id == null ||  search.supplier_id == undefined ||  search.supplier_id == ""){
    data.supplier_id  = ""
  }
  if(typeof(search.commodity_id)=='object'){
    data.commodity_id = search?.commodity_id?.id
  }else  if(typeof(search.commodity_id)=='number'){
    data.commodity_id = search?.commodity_id
  }else if( search.commodity_id == null ||  search.commodity_id == undefined ||  search.commodity_id == ""){
    data.commodity_id  = ""
  }
  data.invoice_no = search.invoice_no;
  data.invoice_amount = search.invoice_amount;
  data.ecfstatus = search.ecfstatus;
  for (let i in data) 
  {
      if (data[i] === null ||data[i] === undefined || data[i] === "") {
        delete data[i];
      }
    }
 }
 if(rptFormat==2)
  {
   let search=this.ECFAppRptDwnldForm.value
    search.aptype = this.approveecftypedata
    search.apstatus = this.approvalstatusdata
   data ={}
   data.crno = search?.crno ;
   data.aptype = search.aptype;
   if(search.branch != undefined && search.branch != null && search.branch !='')
     {
       data.branch = search.branch.id;
     }
   else
   {
     delete data.branch 
   }
   if(typeof(search.supplier_id)=='object'){
     data.supplier_id = search?.supplier_id?.id
   }else  if(typeof(search.supplier_id)=='number'){
     data.supplier_id = search?.supplier_id
   }else if( search.supplier_id == null ||  search.supplier_id == undefined ||  search.supplier_id == ""){
     data.supplier_id  = ""
   }
   if(typeof(search.commodity_id)=='object'){
    data.commodity_id = search?.commodity_id?.id
  }else  if(typeof(search.commodity_id)=='number'){
    data.commodity_id = search?.commodity_id
  }else if( search.commodity_id == null ||  search.commodity_id == undefined ||  search.commodity_id == ""){
    data.commodity_id  = ""
  }
   data.invoice_no = search.invoice_no;
   data.invoice_amount = search.invoice_amount;
   data.purpose = search.purpose;
   if(search.start_date != undefined && search.start_date != "" && search.start_date != null )
    {
      data.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd')
    }
    if(search.end_date != undefined && search.end_date != "" && search.end_date != null )
    {
      data.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd')
    }
    for (let i in data) 
   {
       if (data[i] === null ||data[i] === undefined || data[i] === "") {
         delete data[i];
       }
     }
   data.apstatus = "";

  }
 if(rptFormat == 3)
 {
  let search=this.CommonRptDwnldForm.value
  search.aptype = this.commonecftypedata
  search.apinvoiceheaderstatus_id = this.commonstatusdata
  data ={}
  data.crno = search?.crno ;
  data.batch_no = search?.batch_no;
  data.invoiceheader_crno = search.invoiceheader_crno;
  data.aptype = search.aptype;
  data.raiser_name = search.raiser_name?.id;
  data.suppliergst_no = search.suppliergst_no
  if(search.start_date != undefined && search.start_date != "" && search.start_date != null )
  {
    data.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd')
  }
  if(search.end_date != undefined && search.end_date != "" && search.end_date != null )
  {
    data.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd')
  }
  if(this.enable_ddl == false )
  {
    data.branchdetails_id = this.branchrole.id;
  }
  else if((search.branchdetails_id != undefined && search.branchdetails_id != null && search.branchdetails_id !='')
          && this.enable_ddl)
    {
      data.branchdetails_id = search.branchdetails_id.id;
    }
  else
  {
    delete data.branchdetails_id 
  }
  if(typeof(search.supplier_id)=='object'){
    data.supplier_id = search?.supplier_id?.id
  }else  if(typeof(search.supplier_id)=='number'){
    data.supplier_id = search?.supplier_id
  }else if( search.supplier_id == null ||  search.supplier_id == undefined ||  search.supplier_id == ""){
    data.supplier_id  = ""
  }
  data.invoice_no = search.invoice_no;
  data.invoice_amount = search.invoice_amount;
  let headerstsid
  let invstsid
  if(search.apinvoiceheaderstatus_id != undefined && search.apinvoiceheaderstatus_id != ''){
    headerstsid = this.commonStatusList.filter(x => x.id == search.apinvoiceheaderstatus_id)[0]
    invstsid = this.ApprovalStatusList.filter(x => x.id == search.apinvoiceheaderstatus_id)[0]
    if(headerstsid)
      data.apinvoiceheaderstatus_id = headerstsid?.id
    // if(invstsid)
    //   data.invoice_status = invstsid?.id
  }
 
  // if (+search.maxamt != 0 && (search.minamt == "" || search.minamt == null || search.minamt == undefined)) {
  //   this.notification.showError("Please Enter Min Amount")
  //   this.SpinnerService.hide()
  //   return false
  // }
  // if (search.minamt != 0 && (search.maxamt == "" || search.maxamt == null || search.maxamt == undefined)) {
  //   this.notification.showError("Please Enter Max Amount")
  //   this.SpinnerService.hide()
  //   return false
  // }
  // if(+search.minamt > 0 && +search.maxamt < +search.minamt)
  // {
  //   this.notification.showError("Maximum Amount should be greater than Minimum Amount")
  //   return false
  // }
  
  for (let i in data) 
  {
      if (data[i] === null ||data[i] === undefined || data[i] === "") {
        delete data[i];
      }
    }

 }
  this.ecfservice.getECFRptDownload(rptFormat,data)
    .subscribe((results) => {

      if(results?.code ==undefined)
      {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        if(rptFormat == 1) 
        {
          link.download = "ECF Inventory Report.xlsx";
          this.ecftypedata = ""
          this.ecfstatusdata = ""
          this.backECFinvRptDwnld()
        }
        else if(rptFormat == 2)
        {
          link.download = "ECF Approval Report.xlsx";
          this.approveecftypedata = ""
          this.approvalstatusdata = ""
          this.backECFAppRptDwnld()
        }
        else if(rptFormat == 3) 
        {
          link.download = "ECF Common Report.xlsx";
          this.commonecftypedata = ""
          this.commonstatusdata = ""
          this.backCmnRptDwnld()
        }
        link.click();
      }
      else
      {
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
  downloadpopupapproval() {
    this.popupopen12()
  }
  getRptDownload2(rptFormat) {
    let datas = rptFormat
    let payloadbodydata = {
      type: true,
      minamt: "",
      maxamt: "",
      branch_id: "",
      purpose: "",
      branch: "",
      start_date: "",
      end_date: "",
      apstatus: ""
    };
    let format = 2
    if (rptFormat) {
      this.payloadbodydata = { ...datas, ...payloadbodydata };
    } else {
      this.payloadbodydata = payloadbodydata
    }

    // let payloadbodydata = {
    //   type: 1,
    //   crno: "",
    //   aptype: "",
    //   apstatus: "",
    //   ecfstatus: "",
    //   minamt: "",
    //   maxamt: "",
    //   branch: "",
    //   batchno: "",
    //   supplier_id: "",
    //   invoice_no: "",
    //   commodity_id: "",
    // };
    // payloadbodydata = { ...payloadbodydata, ...datas };
    // console.log("payloadbodydata_down ======> ", payloadbodydata);
    // let format = 1
    // let data
    // this.SpinnerService.show()

    // if (format == 1) {
    //   data = this.ecfSearchForm.value
    //   if (data.maxamt != "" && data.minamt == "") {
    //     this.notification.showError("Please Enter Min Amount")
    //     this.SpinnerService.hide()
    //     return false
    //   }
    //   if (data.maxamt == "" && data.minamt != "") {
    //     this.notification.showError("Please Enter Max Amount")
    //     this.SpinnerService.hide()
    //     return false
    //   }

    //   if (typeof (data?.branch) == 'object') {
    //     data.branch = data?.branch?.id
    //   } else if (typeof (data?.branch) == 'number') {
    //     data.branch = data.branch
    //   } else {
    //     data.branch = ""
    //   }
    //   if (typeof (data?.supplier_id) == 'object') {
    //     data.supplier_id = data?.supplier_id?.id
    //   } else if (typeof (data?.supplier_id) == 'number') {
    //     data.supplier_id = data.supplier_id
    //   } else {
    //     data.supplier_id = ""
    //   }
    //   if (typeof (data?.commodity_id) == 'object') {
    //     data.commodity_id = data?.commodity_id?.id
    //   } else if (typeof (data?.commodity_id) == 'number') {
    //     data.commodity_id = data.commodity_id
    //   } else {
    //     data.commodity_id = ""
    //   }
    //   if (data.start_date != undefined && data.start_date != "" && data.start_date != null) {
    //     data.start_date = this.datePipe.transform(data.start_date, 'yyyy-MM-dd')
    //   }
    //   else {
    //     delete data.start_date
    //   }
    //   if (data.end_date != undefined && data.end_date != "" && data.end_date != null) {
    //     data.end_date = this.datePipe.transform(data.end_date, 'yyyy-MM-dd')
    //   }
    //   else {
    //     delete data.end_date
    //   }
    // }
    // else if (format == 2) {
    //   data = this.ecfapprovalform.value
    //   if (data.maxamt != "" && data.minamt == "") {
    //     this.notification.showError("Please Enter Min Amount")
    //     this.SpinnerService.hide()
    //     return false
    //   }
    //   if (data.maxamt == "" && data.minamt != "") {
    //     this.notification.showError("Please Enter Max Amount")
    //     this.SpinnerService.hide()
    //     return false
    //   }

    //   if (typeof (data?.branch) == 'object') {
    //     data.branch = data?.branch?.id
    //   } else if (typeof (data?.branch) == 'number') {
    //     data.branch = data?.branch
    //   } else {
    //     data.branch = ""
    //   }
    //   if (typeof (data?.supplier_id) == 'object') {
    //     data.supplier_id = data?.supplier_id?.id
    //   } else if (typeof (data?.supplier_id) == 'number') {
    //     data.supplier_id = data?.supplier_id
    //   } else {
    //     data.supplier_id = ""
    //   }
    //   if (typeof (data?.commodity_id) == 'object') {
    //     data.commodity_id = data?.commodity_id?.id
    //   } else if (typeof (data?.commodity_id) == 'number') {
    //     data.commodity_id = data?.commodity_id
    //   } else {
    //     data.commodity_id = ""
    //   }
    // }
    // else if (format == 3) {
    //   let search = this.commonForm.value
    //   data = {}
    //   data.crno = search.crno;
    //   data.batch_no = search.batch_no;
    //   data.invoiceheader_crno = search.invoiceheader_crno;
    //   data.aptype = search.aptype;
    //   data.raiser_name = search.raiser_name.id;
    //   data.suppliergst_no = search.suppliergst_no
    //   if (search.start_date != undefined && search.start_date != "" && search.start_date != null) {
    //     data.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd')
    //   }
    //   if (search.end_date != undefined && search.end_date != "" && search.end_date != null) {
    //     data.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd')
    //   }
    //   if (search.raiserbranch_id != undefined && search.raiserbranch_id != null && search.raiserbranch_id != '') {
    //     data.raiserbranch_id = search.raiserbranch_id.id;
    //   }
    //   else if (this.MakerPermFlg) {
    //     data.raiserbranch_id = this.branchrole.id;
    //   }
    //   else if (this.COPermission == 0 && this.DOPermission > 0) {
    //     data.do_empbranch_code = this.branchrole.code
    //   }
    //   if (typeof (search.supplier_id) == 'object') {
    //     data.supplier_id = search?.supplier_id?.id
    //   } else if (typeof (search.supplier_id) == 'number') {
    //     data.supplier_id = search?.supplier_id
    //   } else if (search.supplier_id == null || search.supplier_id == undefined || search.supplier_id == "") {
    //     data.supplier_id = ""
    //   }
    //   data.invoice_no = search.invoice_no;
    //   data.invoice_amount = search.invoice_amount;
    //   data.minamt = search.minamt;
    //   data.maxamt = search.maxamt;
    //   data.apinvoiceheaderstatus_id = search.apinvoiceheaderstatus_id;
    //   data.invoice_status = search.invoice_status;

    //   if (+search.maxamt != 0 && (search.minamt == "" || search.minamt == null || search.minamt == undefined)) {
    //     this.notification.showError("Please Enter Min Amount")
    //     this.SpinnerService.hide()
    //     return false
    //   }
    //   if (search.minamt != 0 && (search.maxamt == "" || search.maxamt == null || search.maxamt == undefined)) {
    //     this.notification.showError("Please Enter Max Amount")
    //     this.SpinnerService.hide()
    //     return false
    //   }
    //   if (+search.minamt > 0 && +search.maxamt < +search.minamt) {
    //     this.notification.showError("Maximum Amount should be greater than Minimum Amount")
    //     return false
    //   }

    //   for (let i in data) {
    //     if (data[i] === null || data[i] === "") {
    //       delete data[i];
    //     }
    //   }
    // }
    this.SpinnerService.show()
    this.ecfservice.getECFRptDownload(format, this.payloadbodydata)
      .subscribe((results) => {
        if (results?.code == undefined) {
          let binaryData = [results];
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "ECF Approval Report.xlsx";
          link.click();
          this.SpinnerService.hide();
        } else {
          this.notification.showError(results.code);
          this.SpinnerService.hide();
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      });
  }
  payloadbodydata: any
  downloadpopup(){
    this.popupopen10()
  }
  getRptDownload3(rptFormat) {
    let format = 3;
    let data
    let datass = this.branchrole?.id;
    this.SpinnerService.show();
    const isEmptyObject = (obj: any) =>
      obj && Object.values(obj).every(value => value === "");
    if (rptFormat === "" || isEmptyObject(rptFormat)) {
      this.payloadbodydata = { raiserbranch_id: datass };
    } else {
      this.payloadbodydata = { ...rptFormat, raiserbranch_id: datass };
    }
    if(rptFormat == 3){
       let search=this.CommonRptDwnldForm.value
       data ={}
       data.crno = search?.crno ;
       data.batch_no = search?.batch_no;
       data.invoiceheader_crno = search.invoiceheader_crno;
       data.aptype = search.aptype;
       data.raiser_name = search.raiser_name?.id;
       data.suppliergst_no = search.suppliergst_no
       if(search.start_date != undefined && search.start_date != "" && search.start_date != null )
       {
         data.start_date = this.datePipe.transform(search.start_date, 'yyyy-MM-dd')
       }
       if(search.end_date != undefined && search.end_date != "" && search.end_date != null )
       {
         data.end_date = this.datePipe.transform(search.end_date, 'yyyy-MM-dd')
       }
       if(search.raiserbranch_id != undefined && search.raiserbranch_id != null && search.raiserbranch_id !='')
       {
         data.raiserbranch_id = search.raiserbranch_id.id;
       }
       else if(this.MakerPermFlg )
       {
         data.raiserbranch_id = this.branchrole.id;
       }
       else if(this.COPermission ==0 && this.DOPermission >0)
       {
         data.do_empbranch_code = this.branchrole.code
       }
       if(typeof(search.supplier_id)=='object'){
         data.supplier_id = search?.supplier_id?.id
       }else  if(typeof(search.supplier_id)=='number'){
         data.supplier_id = search?.supplier_id
       }else if( search.supplier_id == null ||  search.supplier_id == undefined ||  search.supplier_id == ""){
         data.supplier_id  = ""
       }
       data.invoice_no = search.invoice_no;
       data.invoice_amount = search.invoice_amount;
       let headerstsid
       let invstsid
       if(search.apinvoiceheaderstatus_id != undefined && search.apinvoiceheaderstatus_id != ''){
         headerstsid = this.commonStatusList.filter(x => x.id == search.apinvoiceheaderstatus_id)[0]
         invstsid = this.ApprovalStatusList.filter(x => x.id == search.apinvoiceheaderstatus_id)[0]
         if(headerstsid)
           data.apinvoiceheaderstatus_id = headerstsid?.id
         if(invstsid)
           data.invoice_status = invstsid?.id
       }
      
       // if (+search.maxamt != 0 && (search.minamt == "" || search.minamt == null || search.minamt == undefined)) {
       //   this.notification.showError("Please Enter Min Amount")
       //   this.SpinnerService.hide()
       //   return false
       // }
       // if (search.minamt != 0 && (search.maxamt == "" || search.maxamt == null || search.maxamt == undefined)) {
       //   this.notification.showError("Please Enter Max Amount")
       //   this.SpinnerService.hide()
       //   return false
       // }
       // if(+search.minamt > 0 && +search.maxamt < +search.minamt)
       // {
       //   this.notification.showError("Maximum Amount should be greater than Minimum Amount")
       //   return false
       // }
       for (let i in data) 
        {
            if (data[i] === null || data[i] === "") {
              delete data[i];
            }
          }
       this.searchData = data
      
    }    
    this.ecfservice.getECFRptDownload(format, this.payloadbodydata)
      .subscribe((results) => {
        if (results?.code == undefined) {
          let binaryData = [results];
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "ECF Common Report.xlsx";
          link.click();
          this.SpinnerService.hide();
        } else {
          this.notification.showError(results.code);
          this.SpinnerService.hide();
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      });
  }

  CommonViewEntryPage = 1
  commonViewEntrySummary: any = []
  isCommonViewEntrypage: boolean
  has_CommonViewEntrypageprevious = false
  has_CommonViewEntrypagenext = false
  pagesizeCommonViewEntry = 10;
  getCommonViewEntrytotalcount: any
  CommonViewEntrypresentpage: number = 1;
  CommonTransCrno: any
  CommonViewEntry(crno) {
    this.popupopen4();
    this.CommonTransCrno = crno.apinvoiceheader_crno
    this.SpinnerService.show()
    this.SummaryApiviewecfObjNew = {
      method: "get",
      // url: this.ecfmodelurl + "ecfapserv/mono_entry_view/" + this.CommonTransCrno,
       url: this.ecfmodelurl + "entryserv/fetch_commonentrydetails/" + this.CommonTransCrno,      
      params: "",
    };
    this.commonViewEntrySummary = []
    // this.ecfservice.getViewEntryMono(this.CommonTransCrno)
    //   .subscribe(result => {
    //     this.SpinnerService.hide();
    //     if (result['data'] != undefined) {
    //       let commonentrydata = result['data']
    //       // let datapagination = result["pagination"];
    //       // this.getCommonViewEntrytotalcount = datapagination?.count
    //       let deb_entry = commonentrydata.filter(x => x.entry_type == 'D')
    //       let cred_entry = commonentrydata.filter(x => x.entry_type == 'C')
    //       if (this.commonViewEntrySummary.length === 0) {
    //         this.isCommonViewEntrypage = false
    //       }
    //       if (deb_entry.length > 0) {
    //         for (let i = 0; i < deb_entry.length; i++) {
    //           this.commonViewEntrySummary.push(deb_entry[i])
    //         }
    //         // this.has_CommonViewEntrypagenext = datapagination.has_next;
    //         // this.has_CommonViewEntrypageprevious = datapagination.has_previous;
    //         // this.CommonViewEntrypresentpage = datapagination.index;
    //         this.isCommonViewEntrypage = true
    //       }
    //       if (cred_entry.length > 0) {
    //         for (let i = 0; i < cred_entry.length; i++) {
    //           this.commonViewEntrySummary.push(cred_entry[i])
    //         }
    //       }
    //       this.SpinnerService.hide()
    //     } else {
    //       this.notification.showError(result?.message)
    //       this.SpinnerService.hide()
    //       return false
    //     }
    //   },
    //     error => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }
    //   )
  }

  // nextClickCommonViewEntry() {
  //   if (this.has_CommonViewEntrypagenext === true) {
  //     this.CommonViewEntryPage = this.CommonViewEntryPage + 1
  //     this.CommonViewEntry()
  //   }
  // }

  // previousClickCommonViewEntry() {
  //   if (this.has_CommonViewEntrypageprevious === true) {
  //     this.CommonViewEntryPage = this.CommonViewEntryPage - 1
  //     this.CommonViewEntry()
  //   }
  // }

  closeCommonEntryClick() {
    this.closeCommonentry.nativeElement.click();
  }
  public displaytest(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }
  public displayFn(Suppliertype?: SupplierName): string | undefined {
    return Suppliertype ? Suppliertype.name : undefined;
  }
  getsuppECFsum() {
    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.ecfSearchForm.get('name').valueChanges
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
        this.matsuppAutocomplete  &&
        this.matsuppAutocomplete  &&
        this.matsuppAutocomplete .panel
      ) {
        fromEvent(this.matsuppAutocomplete .panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsuppAutocomplete .panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsuppAutocomplete .panel.nativeElement.scrollTop;
            const scrollHeight = this.matsuppAutocomplete .panel.nativeElement.scrollHeight;
            const elementHeight = this.matsuppAutocomplete .panel.nativeElement.clientHeight;
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

  // SelectSuppliersearch(e) {
  //   this.suppliers = e
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
  suppliers: any;
  selectpayloadbodydata: any
  // Testingfunctionalternate() {
  //   this.searchsupplier = this.SelectSupplierForm.value;
  //   this.ecfservice.getselectsupplierSearch(this.suppliers, 1)
  //     .subscribe(result => {
  //       if (result['data']?.length == 0) {
  //         this.notification.showError("No Results Found...")
  //         return false;
  //       }
  //       if (result['data']?.length > 0) {
  //         this.selectsupplierlist = result['data']
  //         this.supplierlists = result['data']
  //         console.log("selecteddata===========>", this.supplierlists)
  //         let supplierdatass = {
  //           code: this.supplierlists.code,
  //           id: this.supplierlists[0].id,
  //           name: this.supplierlists[0].name,
  //         };
  //         this.suppliersearchs = supplierdatass
  //         console.log("this.searchsupplier?.gstno?.length", this.searchsupplier?.gstno?.length)
  //         if (this.searchsupplier?.gstno?.length == 15 || this.searchsupplier?.panno?.length == 10) {
  //           let supplierdata = {
  //             "id": this.selectsupplierlist[0]?.id,
  //             "name": this.selectsupplierlist[0]?.name,
  //             "code": this.selectsupplierlist[0]?.code
  //           }
  //           this.supplierdata = supplierdata
  //           this.SelectSupplierForm.patchValue({ name: this.supplierdata })
  //           this.getsuppView(this.supplierdata)
  //         } else {

  //           let supplierdata = {
  //             "id": this.selectsupplierlist[0]?.id,
  //             "name": this.selectsupplierlist[0]?.name,
  //             "code": this.selectsupplierlist[0]?.code
  //           }
  //           this.supplierdatass = supplierdatass
  //           this.SelectSupplierForm.patchValue({ name: supplierdatass })
  //           this.getsuppView(supplierdatass)
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
            id: "ecfap-0261"
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
  // ecfsearch:any

  supplier_data: any = {
    label: "Supplier Name",
    searchkey: "query",
    displaykey: "name",
    url: this.ecfURL + "venserv/landlordbranch_list",
    params: "",
    Outputkey: "id",
    disabled: false,
  }
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
          this.supplierdata_name = supplierdata.name
          this.submitbutton = true;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


  }
  supplierModalSubmit() {
    if (this.ecfsummaryForm == true) {
      this.ecfSearchForm.patchValue({ supplier_id: this.supplierdata })
    }
    else if (this.ecfapprovalsummaryForm == true) {
      this.ecfapprovalform.patchValue({ supplier_id: this.supplierdata })
    }
    else if (this.CommonSummaryForm == true) {
      this.commonForm.patchValue({ supplier_id: this.supplierdata })
    }
  }
  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  getsupplierindex(section) {
    this.popupopen1()
    this.SupplierDetailForm.patchValue({
      suppliergst: section?.supplier_gst,
      invoiceno: section?.invoiceno,
      invoicedate: section?.invoicedate,
      supplier_name: section?.supplier_name,
      pincode: section?.pincode,
      address: section?.address
    })
  }
  supplierBack() {
    this.supclosebuttons.nativeElement.click();
  }

  tempCreateECF: any
  invCrnosForTemplate: any
  createTemp(data) {
    this.popupopen9()
    this.tempCreateECF = data
    this.showCreateTempForm = true
    this.ecfhdrid = data.id
    this.ecfType = data.aptype_id
    this.cloneinvgst = data.invoicegst
    this.SpinnerService.show();
    this.ecfservice.getCompletedInvCrnos(this.tempCreateECF.id)
      .subscribe(result => {
        if (result.data != undefined) {
          this.invCrnosForTemplate = result.data[0]
          if (result.data.length == 0) {
            this.notification.showWarning('No Invoice available for Template Creation.')
            this.closefrmtempCreate.nativeElement.click()
          }
          this.SpinnerService.hide();
        }
      })

  }

  submitCreateTemp() {
    if (this.createTempForm.value.inv_crnos == '' || this.createTempForm.value.inv_crnos == undefined || this.createTempForm.value.inv_crnos == null) {
      this.notification.showError('Please Select Invoice CR Number.')
      return false
    }
    if (this.createTempForm.value.name.trim() == '' || this.createTempForm.value.name == undefined || this.createTempForm.value.name == null) {
      this.notification.showError('Please Enter Template Name')
      return false
    }
    let data = {
      "apinvoiceheader_id": this.createTempForm.value.inv_crnos?.id,
      "name": this.createTempForm.value.name,
      "crno": this.createTempForm.value.inv_crnos?.apinvoiceheader_crno,
      "ecftype": this.invCrnosForTemplate[0]?.ecftype
    }

    this.ecfservice.ecfTemplateCreate(data)
      .subscribe(result => {
        if (result.code != "success") {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
        else {
          this.createTempForm.reset()
          this.notification.showSuccess("Successfully Template Created")
          this.SpinnerService.hide();
          this.closefrmtempCreate.nativeElement.click()
        }
      })
    // this.closefrmtempCreate.nativeElement.click()
  }
  createtempBack() {
    this.createTempForm.reset()
    this.closefrmtempCreate.nativeElement.click()
    this.showCreateTempForm = false
  }
  

  ecfstatus: any = {
    label: "ECF Status",
    searchkey: "query",
    displaykey: "text",
    url: this.ecfURL + "ecfapserv/get_inventory_status",
    Outputkey: "id",
  }

  branches: any = {
    label: "Branch",
    searchkey: "query",
    displaykey: "name",
    url: this.ecfURL + "usrserv/search_branch",
    Outputkey: "id",
  }
  reportbranch:any={
    label: "Branch",
    method: "get",
    searchkey: "query",
    displaykey: "name",
    url: this.ecfURL + "usrserv/search_branch",
    Outputkey: "id",
  }
  ecf_report_type:any={
    label: "Report Type",
    method: "get",
    searchkey: "query",
    displaykey: "name",
    url: this.ecfURL + "ecfapserv/apreport_summary",
    Outputkey: "id",
  }
  branchs: any = {
    label: "Branch",
    method: "get",
    url: this.ecfURL + "usrserv/search_branch",
    params: "",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
    id: "ecfap-0027",
    formcontrolname: "branch",
    suffix: 'code',
    separator: "hyphen"
  }

  commoditys: any = {
    label: "Commodity Name",
    searchkey: "name",
    displaykey: "name",
    url: this.ecfURL + "mstserv/commoditysearch",
    params: "&name=&code=",               
    Outputkey: "id",
  }
  commodity: any = {
    label: "Commodity Name",
    method: "get",
    url: this.ecfURL + "mstserv/commoditysearch",
    params: "&name=&code=",
    searchkey: "query",
    displaykey: "name",
    Outputkey: "id",
    id: "ecfap-0028",
    formcontrolname: "commodity_id"
  }
  // supplier_name = this.SupplierName



  getsupplierpopup() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0016"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  searchupload(e) {

  }
  branch_status: any = {
    label: "Batch Status",
    searchkey: "query",
    displaykey: "text",
    url: this.ecfURL + "ecfapserv/get_ecfstatus",
    params: "&batch=true",
    Outputkey: "id",
  }
  branch_dd: any = {
    label: "Branch",
    searchkey: "query",
    displaykey: "name",
    url: this.ecfURL + "usrserv/search_branch",
    params: "",
    Outputkey: "id",
  }
  branchwisesearch: any = [
    { "type": "input", "label": "Batch No", "formvalue": "batchno" },
    { "type": "dropdown", inputobj: this.branch_status, "formvalue": "batchstatus" },
    { "type": "input", "label": "ECF Count", "formvalue": "batchcount" },
    { "type": "dropdown", inputobj: this.branch_dd, "formvalue": "branch" },

  ]

  // ecpappsumdata: any = [{
  //   columnname: "ECF Type",
  //   key: "recon",
  //   validate: true,
  //   validatefunction: this.ecf_type.bind(this),
  // },
  // {
  //   columnname: "CR No", key: "crno", validate: true,
  //   validatefunction: this.crn_no.bind(this),
  // },
  // // {
  // //   columnname: "Raiser Branch",
  // //   key: "raiser",
  // //   validate: true,
  // //   validatefunction: this.branch_name.bind(this),
  // // },
  // { columnname: "ECF Date", key: "apdate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
  // {
  //   columnname: "Branch",
  //   key: "branch",
  //   "array": true, "objkey": "name_code"
  // },
  // { columnname: "Commodity", "key": "commodity_id", "type": "object", "objkey": "name" },
  // {
  //   columnname: "Supplier", "key": "supplier_data", validate: true,
  //   validatefunction: this.suplier_data.bind(this),
  // },
  // { columnname: "ECF Amount", key: "apamount", "prefix": "₹", "type": 'Amount' },
  // { columnname: "ECF Status", "key": "ecfstatus", "type": "object", "objkey": "text" },
  // { columnname: "Remarks", key: "remark", tooltip: true },
  
 
  // { columnname: "Transaction Details", key: "Transaction Details",tooltip:true , icon: "swap_horiz", style: { cursor: "pointer" }, button: true, function: true, clickfunction: this.transaction_summary.bind(this), },
  // {
  //   columnname: "Action", key: "Action", "tooltip": true,
  //   icon: "arrow_forward",
  //   style: { cursor: "pointer" },
  //   button: true,
  //   function: true,
  //   clickfunction: this.shoowaction.bind(this),
  // },
  //   // {
  //   //   columnname: "Covernote", key: "covernote", button: true,
  //   //   icon: "download", "style": { color: "green", cursor: "pointer" },
  //   // validate: true, validatefunction: this.covernote.bind(this), function: true, clickfunction: this.approver_ecf_data_coverNotedownload_click.bind(this)
  //   // }
  // ]


  apsuppliers_data(data) {
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

//     approvalsummary(){
//   this.ecpappsumdata = [
//     {
//       columnname: "Invoice Type",
//       key: "aptype",
//       headicon: true, headerdicon: "filter_list", headertype: 'headoptiondropdown',payloadkey: "aptype",
//       inputobj: {
//       label: "Invoice Type",
//       params: "",
//       searchkey: "query",
//       displaykey: "text",
//       Outputkey: "id",
//       fronentdata: true,
//       data: this.TypeList,
//       valuekey: "id",
//       formcontrolname: "aptype"
//     },
//     clickFunction: this.ecfsummarysearch.bind(this),
//       // validate: true,
//       // validatefunction: this.ecf_type.bind(this),
//     },
//     {
//       columnname: "CR No",
//       key: "crno",
//       // validate: true,
//       // validatefunction: this.crn_no.bind(this),
//       payloadkey: "crno",
//       headicon: true,
//       headertype: "headinput",
//       label: "search",
//       headerdicon: "filter_list",
//       clickFunction: this.ecfsummarysearch.bind(this),
//       inputicon: "search",
//       // inputtooltip: "search",
//     },
//     // {
//     //   columnname: "Raiser Branch",
//     //   key: "raiser",
//     //   validate: true,
//     //   validatefunction: this.branch_name.bind(this),
//     // },
//     {
//       columnname: "ECF Date",
//       key: "apdate",
//       type: "Date",
//       datetype: "dd-MMM-yyyy",
//     },
//     {
//       columnname: "Branch",
//       key: "branch",
//       // array: true,
//       "type": "object", "objkey": "name_code",
//       //   validate: true,
//       // validatefunction: this.branch_search_data.bind(this),
//       headicon: true,
//       headertype: "headdropdown",
//       // headerdicon: "filter_list",
//       payloadkey: "branch",
//     inputobj: {
//     label: "Branch",
//     method: "get",
//     url: this.ecfURL + "usrserv/search_branch",
//     params: "",
//     searchkey: "query",
//     displaykey: "fullname",
//     Outputkey: "id",
//     formcontrolname: "branch",
//     // suffix: "code",
//     // separator: "hyphen",
//   },
//       clickFunction: this.ecfsummarysearch.bind(this),
      
//     },
//     {
//       columnname: "Commodity",
//       key: "commodity_id",
//       type: "object",
//       objkey: "name",
//       // validate: true,
//       // validatefunction: this.com_app_data.bind(this),
//       headicon: true,
//       headertype: "headdropdown",
//       headerdicon: "filter_list",
//       payloadkey: "commodity_id",
//       inputobj: {
//          label: "Commodity Name",
//     method: "get",
//     url: this.ecfURL + "mstserv/commoditysearch",
//     params: "&name=&code=",
//     searchkey: "query",
//     displaykey: "name",
//     Outputkey: "id",
//     formcontrolname: "commodity_id",
//       },
//       clickFunction: this.ecfsummarysearch.bind(this),
//     },

//      { columnname: "Supplier", key: "supplier_data", "headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
//       payloadkey: "supplier_id",
//       inputobj :{
//       label: "Supplier",
//       method: "get",
//       url: this.ecfmodelurl + "venserv/landlordbranch_list",
//       params: "",
//       searchkey: "query",
//       displaykey: "name",
//       Outputkey: "id",
//       formcontrolname: "supplier"
//     },
//         validate: true, validatefunction: this.apsuppliers_data.bind(this),      clickFunction: this.ecfsummarysearch.bind(this),

//     },
//     { columnname: "ECF Amount", key: "apamount", prefix: "₹", type: "Amount" },
//     {
//       columnname: "ECF Status",
//       key: "ecfstatus",
//       type: "object",
//       objkey: "text",
//     },
//     { columnname: "Remarks", key: "remark", tooltip: true},
// // { columnname: "Remarks", key: "remark", tooltip: true,validate: true,
// //       payloadkey: "purpose",
// //       headicon: true,
// //       headertype: "headinput",
// //       label: "search",
// //       headerdicon: "filter_list",
// //       clickFunction: this.ecfsummarysearch.bind(this),
// //       inputicon: "search",
// //       function:true,
// //       validatefunction: this.remark_data.bind(this)},
//     {
//       columnname: "Transaction Details",
//       key: "Transaction Details",
//       tooltip: true,
//       icon: "swap_horiz",
//       style: { cursor: "pointer" },
//       button: true,
//       function: true,
//       clickfunction: this.transaction_summary.bind(this),
//     },
//     {
//       columnname: "Action",
//       key: "Action",
//       tooltip: true,
//       icon: "arrow_forward",
//       style: { cursor: "pointer" },
//       button: true,
//       function: true,
//       clickfunction: this.shoowaction.bind(this),
//     },
//     // {
//     //   columnname: "Covernote", key: "covernote", button: true,
//     //   icon: "download", "style": { color: "green", cursor: "pointer" },
//     // validate: true, validatefunction: this.covernote.bind(this), function: true, clickfunction: this.approver_ecf_data_coverNotedownload_click.bind(this)
//     // }
//   ];
//   }


  // validatefunction: this.date_data.bind(this),
  ecf_type(data) {
    let config: any = {
      value: "",
      headercolor: ""
    };
// if(this.globalpayloadapproval.aptype){
// config.headercolor= "green"
// }
    if (data.aptype_id == 8) {
      config.value="TCF"
    } if(data.aptype){
      config.value =data.aptype
    }
      
    return config;
  }

  branch_name(data) {
    let config: any = {
      value: "",
    };

    if (data.branch[0]) {
      config = {
        value: data.branch[0]?.code + "-" + data.branch[0]?.name,
      };
    }
    return config;
  }

  crn_no(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
// if(this.globalpayloadapproval.crno){
// config.headercolor = "green";
// }
    if (data.crno != null) {
      config.value=data.crno
    } else {
      config.value="-"
    }
    return config;
  }

  // date_data(data) {
  //   let config: any = {
  //     value: "",
  //   };

  //   if (data.apdate !== "None") {
  //     config = {
  //       "type": 'date',
  //       datetype: "dd-MMM-yyyy",
  //       value: data.apdate,
  //     };
  //   } else {
  //     config = {
  //       value: "-",
  //     };
  //   }
  //   return config;
  // }

  // validatefunction: this.date_data.bind(this),
  // ecf_type(data) {
  //   let config: any = {
  //     value: "",
  //   };

  //   if (data.aptype_id == 8) {
  //     config = {
  //       value: "TCF",
  //     };
  //   } else
  //     config = {
  //       value: data.aptype,
  //     };
  //   return config;
  // }

  // branch_name(data) {
  //   let config: any = {
  //     value: "",
  //   };

  //   if (data.branch[0]) {
  //     config = {
  //       value: data.branch[0]?.code + "-" + data.branch[0]?.name,
  //     };
  //   }
  //   return config;
  // }

  // crn_no(data) {
  //   let config: any = {
  //     value: "",
  //   };

  //   if (data.crno != null) {
  //     config = {
  //       value: data.crno,
  //     };
  //   } else {
  //     config = {
  //       value: "-",
  //     };
  //   }
  //   return config;
  // }

  // date_data(data) {
  //   let config: any = {
  //     value: "",
  //   };

  //   if (data.apdate !== "None") {
  //     config = {
  //       "type": 'date',
  //       datetype: "dd-MMM-yyyy",
  //       value: data.apdate,
  //     };
  //   } else {
  //     config = {
  //       value: "-",
  //     };
  //   }
  //   return config;
  // }

  covernote(data) {
    let config: any = {
      value: "",
    };
    if (data.ecfstatus?.text != 'DRAFT' && data?.ecfstatus?.text != 'PENDING IN ECF APPROVAL' && data?.ecfstatus?.text != 'READY FOR BATCH' && data?.ecfstatus?.text != 'DELETE' && data?.ecfstatus?.text == 'ECF REJECTED') {
      config = {
        icon: "download",
        style: { cursor: "pointer" },
        button: true,
        key: "download",
        function: true,
        // value: data.ecfstatus,
      };
    } else {
      config = {
        icon: "-",
        function: false,
      };
    }
    return config;
  }

  popupopenretun() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0008"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  suplier_data(data) {
    let config: any = {
      value: "",
    };

    if (data.supplier_data?.name) {
      config = {
        value: data.supplier_data?.name + "-" + data.supplier_data?.code,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0015"),
      {
        keyboard: false,
      }
    );
    myModal.show();
  }

  ecfprocess(data) {
    let config: any = {
      value: "-",
      function: true,
    };
    return config;
  }
  ecfpending(data) {
    let config: any = {
      value: "-",
      function: true,
    };
    return config;
  }

  batchappsum: any = [{ columnname: "Batch No", key: "batchno" },
  { columnname: "Batch Date", key: "batch_date", "type": 'Date', datetype: "dd-MMM-yyyy" },
  { columnname: "Batch Amount", "key": "batchamount", "prefix": "₹", "type": 'Amount' },
  { columnname: "ECF Count", key: "batchcount" },
  { columnname: "ECF Processed Count", key: "-", validate: true, validatefunction: this.ecfprocess.bind(this), },
  { columnname: "ECF Pending Count", key: "-", validate: true, validatefunction: this.ecfpending.bind(this), },
  { columnname: "Raiser Name", key: "raisername" },
  { columnname: "Branch", key: "branchname" },
  { columnname: "Batch Status", key: "batchstatus", },
  {
    columnname: "View", "key": "view", icon: "visibility",
    style: { cursor: "pointer", color: "green" },
    button: true,
    function: true,
    clickfunction: this.showecfview.bind(this, 'Approvalview', 'batch'),
  },
  {
    columnname: "Download", key: "action",
    icon: "download",
    style: { cursor: "pointer" },
    validate: true, validatefunction: this.donload_data_batch.bind(this),
    function: true,
    clickfunction: this.batchcovernotedownload.bind(this),
  }
  ]


  branchstatus(branch) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (branch?.batch_status == null || branch?.batch_status == undefined || branch?.batch_status == '') {
      config = {
        disabled: false,
        value: '-',
        function: false
      }
    }
    else {
      config = {
        disabled: false,
        value: branch?.batch_status,
        function: false
      }
    }
    return config
  }
  branchcode(code) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (code?.batch_no == null || code?.batch_no == undefined || code?.batch_no == '') {
      config = {
        disabled: false,
        value: '-',
        function: false
      }
    }
    else {
      config = {
        disabled: false,
        value: code?.batch_no,
        function: false
      }
    }
    return config
  }

  suppliersdata(suppiler) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (suppiler?.batch_no == null || suppiler?.batch_no == undefined || suppiler?.batch_no == '') {
      config = {
        disabled: false,
        value: '-',
        function: false
      }
    }
    else {
      config = {
        disabled: false,
        value: suppiler?.name_code,
        function: false
      }
    }
    return config
  }
  apinvoicehdr(apinvoice) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (apinvoice?.apinvoicehdr_status?.id == 9 || apinvoice?.apinvoicehdr_status?.id == 13 || apinvoice?.apinvoicehdr_status?.id == 15) {
      config = {
        style: { color: "green" },
        icon: "visibility",
        disabled: false,
        function: true
      }
    }
    else if (apinvoice?.apinvoicehdr_status?.id != 9 && apinvoice?.apinvoicehdr_status?.id != 13 && apinvoice?.apinvoicehdr_status?.id != 15) {
      config = {
        disabled: false,
        value: '-',
        function: false
      }
    }
    return config
  }
  download(down) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (down?.ecfstatus?.text != 'RETURNED' && down?.ecfstatus?.text != 'BATCH ECF RETURNED' && down?.ecfstatus?.text != 'PENDING IN ECF APPROVAL') {
      config = {
        style: { color: "green" },
        icon: "download",
        disabled: false,
        function: true
      }
    }
    else if (down?.ecfstatus?.text == 'RETURNED' || down?.ecfstatus?.text == 'BATCH ECF RETURNED' || down?.ecfstatus?.text == 'PENDING IN ECF APPROVAL') {
      config = {
        disabled: false,
        value: '',
        function: false
      }
    }
    return config
  }
  donload_data_batch(data) {
    let config: any = {
      value: "",
    };

    if (data?.batchstatus === 'APPROVED') {
      config = {
        icon: "download",
        style: { cursor: "pointer" },
        button: true,
        key: "download",
        function: true,
        value: data?.batchstatus
      };
    } else {
      config = {
        value: "-",
        function: true,
      };
    }
    return config;
  }
  approver_ecf_data(data) {
    let config: any = {
      value: "",
    };
    if (data.ecfstatus.text != 'DRAFT' && data.ecfstatus.text != 'PENDING IN ECF APPROVAL' && data.ecfstatus.text != 'READY FOR BATCH' && data.ecfstatus.text != 'DELETE' && data.ecfstatus.text == 'ECF REJECTED') {
      this.coverNotedownload(data.id, data.ecftype_id)
      }
    if (data?.batchstatus === 'APPROVED') {
      config = {
        icon: "download",
        style: { cursor: "pointer" },
        button: true,
        key: "download",
        function: true,
        value: data?.batchstatus
      };
    } else {
      config = {
        value: "-",
        function: true,
      };
    }
    return config;
  }


  SummarytransactionData: any = [
    { columnname: "Status", key: "comments" },
    { columnname: "Transaction Date", key: "created_date", "type": 'date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Remarks", key: "remarks",tooltip:true },
    { columnname: "Employee Name", key: "from_user", type: "object", objkey: "name", suffix: "View Details", function: true, clickfunction: this.view.bind(this) },
    { columnname: "Approver Name ", key: "to_user", type: "object", objkey: "name", suffix: "View Details", function: true, clickfunction: this.viewto.bind(this) },
  ]
 transaction_summary(data) {
    // this.SummaryApitransactionObjNew = {
    //   FeSummary: true,
    //   data: this.tranrecords
    // }
    this.name = ''; 
    this.designation = ''; 
    this.branch = ''; 
    this.popupopen7();
    this.SummaryApitransactionObjNew = {
      method: "get",
      url: this.url + "ecfapserv/viewheader_transaction/" + data.id,
      params: ""
    }
  }
  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0017"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  ecfap_list() {
    this.popupopen2();
  }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0009"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen3() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0006"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  view_notes(){
      var myModal = new (bootstrap as any).Modal(
        document.getElementById("ecfap-0289"),
        {backdrop : "static",keyboard:false}
      );
      myModal.show();
  }
  
  popupopen4() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0015"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  ecfap_popup() {
    this.popupopen5();
  }
  popupopen5() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0016"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen6() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0005"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen7() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0008"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  ecfap_exl() {
    this.popupopen8();
  }
  popupopen8() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById(".bd-example-modal-xl"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen9() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("create-ecf-0152"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  suppliersearch: any = [
    { "type": "input", "label": "Supplier GST Number", "formvalue": "gstno" },
    { "type": "input", "label": "Supplier Code", "formvalue": "code" },
    { "type": "input", "label": "PAN Number", "formvalue": "panno" },
  ]
  choosesupplierdata(e) {
    this.ecfabs = e;
    console.log("event", e);
    this.getsuppView(this.ecfabs)
    // this.getsuppdd()
  }
  choosesupplierdata1(e) {
    this.ecfabs = e;
    console.log("event", e);
    this.getsuppView(this.ecfabs)
    // this.getsuppdd()
  }

  SummaryviewData: any = [
    { columnname: "Type", key: "Type" },
    { columnname: "Status", key: "comments" },
    { columnname: "Transaction Date", key: "created_date", "type": 'date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Remarks", key: "remarks",tooltip:true },
    { columnname: "Employee Name", key: "from_user", type: "object", objkey: "name", suffix: "View Details",suffix_style:{color:"green",display:"block"}, function: true, clickfunction: this.view.bind(this) },
    { columnname: "Approver Name ", key: "to_user", type: "object", objkey: "name", suffix: "View Details",suffix_style:{color:"green",display:"block"}, function: true, clickfunction: this.viewto.bind(this) },
  ]
  SummaryApiviewObjNew: any;
  view_summary() {
    // this.SummaryApiviewObjNew = {
    //   FeSummary: true,
    //   data: this.viewtrnlist
    // }
      this.name = ''; 
      this.designation = ''; 
      this.branch = ''; 
    this.popupopen3();
    this.SummaryApiviewObjNew = {
      method: "get",
      url: this.url + "ecfapserv/view_transaction/" + this.apinvHeader_id,
      params: ""
    }
  }



  scrollLeft() {
    this.navTabs.nativeElement.scrollBy({ left: -200, behavior: "smooth" });
  }

  scrollRight() {
    this.navTabs.nativeElement.scrollBy({ left: 200, behavior: "smooth" });
  }

  SummaryviewecfData: any = [
    { columnname: "Type", key: "entry_type", validate: true, validatefunction: this.type_data.bind(this), },
    // { columnname: "GL No", key: "entry_gl" },
    // { columnname: "GL Description", key: "gl_name" },
    { columnname: "GL No", key: "gl" },
    { columnname: "GL Description", key: "glnodescription" },
    { columnname: "Module", key: "module" },
    { columnname: "Transaction Date", key: "transactiondate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    // { columnname: "Module", key: "entry_module" },
    // { columnname: "Transaction Date", key: "entry_transactiondate,entry_transactiontime", "type": 'date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Invoice Amount", key: "amount", "prefix": "₹", "type": 'Amount' },
    { columnname: "CBS Ref No", key: "ackrefno" },

  ]
  viewecf_summary() {
    this.SummaryApiviewecfObjNew = {
      FeSummary: true,
      data: this.commonViewEntrySummary
    }
  }
  type_data(data) {
    let config: any = {
      value: '',
    };
    if (data.entry_type == "D") {
      config = {
        value: 'DEBIT',
      }
    }
    else {
      config = {
        value: 'CREDIT',
      }
    }
    return config
  }

  taskPopup() {
    this.expanded = !this.expanded;
  }

  approval_filter() {
    this.expand_approval = !this.expand_approval
  }
  // ecf_inv_filter() {
  //   this.expand_ecf_inv = !this.expand_ecf_inv
  // }
  statusfun(report) {
    this.report_status = {
      label: "Report Status",
      formcontrolname: "apinvoiceheaderstatus_id",
      disabled: true
    }
  }
  invoicefun(invoice) {
    this.Invoice = {
      label: "Invoice Status",
      formcontrolname: "invoice_status",
      disabled: true
    }


  }
  close() {
    this.expanded = false
    this.commonForm.reset();
    this.commonForm.get('apinvoiceheaderstatus_id')?.enable();
    this.commonForm.get('invoice_status')?.enable();
    this.Invoice = {
      label: "Invoice Status",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/get_common_status",
      params: "",
      displaykey: "text",
      formkey: "id",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "invoice_status",
      disabled: false
    }
  }
  rescommon() {
    // this.commonForm.reset();
    // this.commonForm.get('apinvoiceheaderstatus_id')?.enable();
    // this.commonForm.get('invoice_status')?.enable();
    // this.Invoice = {
    //   label: "Invoice Status",
    //   method: "get",
    //   url: this.ecfmodelurl + "ecfapserv/get_common_status",
    //   params: "",
    //   displaykey: "text",
    //   formkey: "id",
    //   Outputkey: "id",
    //   valuekey: "id",
    //   formcontrolname: "invoice_status",
    //   disabled: false
    // }
      this.commonForm.controls['aptype'].reset(""),
      this.commonForm.controls['batch_no'].reset(""),
      this.commonForm.controls['end_date'].reset(""),
      this.commonForm.controls['invoice_amount'].reset(""),
      this.commonForm.controls['invoice_no'].reset(""),
      this.commonForm.controls['invoice_status'].reset(""),
      this.commonForm.controls['raiserbranch_id'].reset(""),
      this.commonForm.controls['start_date'].reset(""),
      this.commonForm.controls['suppliergst_no'].reset(""),
      this.commonForm.controls['apinvoiceheaderstatus_id'].reset(""),
      this.commonForm.controls['aptype'].reset("")
      if(this.enable_ddl === false){
        this.SummaryApicommonecfObjNew = {
          method: "post",
          url: this.url + "ecfapserv/ecfap_common_summary",
          params: "&submodule=" + this.ecf_common_sub_module_name,
          data: {"raiserbranch_id":this.branchrole.id}
        }
      }
      else{
        this.SummaryApicommonecfObjNew = {
          method: "post",
          url: this.url + "ecfapserv/ecfap_common_summary",
          params: "&submodule=" + this.ecf_common_sub_module_name,
          data: {}
        }
      }
  }

  selectsupplier() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0077"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  approval_supplier() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("ecfap-0016"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  approval_close() {
    this.expand_approval = false
    this.ecfapprovalform.controls['purpose'].reset(""),
      this.ecfapprovalform.controls['start_date'].reset(""),
      this.ecfapprovalform.controls['end_date'].reset(""),
      this.ecfapprovalform.controls['apstatus'].reset("")
  }
  approval_reset() {
      this.ecfapprovalform.controls['apstatus'].reset(""),
      this.ecfapprovalform.controls['purpose'].reset(""),
      this.ecfapprovalform.controls['commodity_id'].reset(""),
      this.ecfapprovalform.controls['start_date'].reset(""),
      this.ecfapprovalform.controls['end_date'].reset("")
      let data = {
        type: "true",
        apstatus: "",
      }
  
      this.ecpappsumdataapi = {
        method: "post",
        url: this.url + "ecfapserv/batchheadersearch",
        params: "&ecf_approver=true",
        data: data
      }
  }
  SummaryApiFilesObjNew: any;
  SummaryFiles: any = [
    { columnname: "File Name", key: "file_name" },
    // { columnname: "File Name", "key": "file_data", "type": "object", "objkey": "file_name" },
    {
      columnname: "View", key: "view", icon: "open_in_new",
      "style": { color: "blue", cursor: "pointer" },
      button: true, function: true, clickfunction: this.data1.bind(this)
    },
    {
      columnname: "Download ", key: "download", icon: "download",
      "style": { color: "green", cursor: "pointer" },
      button: true, function: true, clickfunction: this.getfiles.bind(this)
    },
  ]
  files_summary() {
    this.SummaryApiFilesObjNew = {
      FeSummary: true,
      data: this.headerdata
    }
  }
  ecfviewentry(ecfview) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (ecfview?.apinvoicehdr_status?.id == 9 || ecfview?.apinvoicehdr_status?.id == 13 || ecfview?.apinvoicehdr_status?.id == 14 || ecfview?.apinvoicehdr_status?.id == 15 ||ecfview?.apinvoicehdr_status?.id == 25 || ecfview?.apinvoicehdr_status?.id == 27 || ecfview?.apinvoicehdr_status?.id == 28|| ecfview?.apinvoicehdr_status?.id == 29) {
      config = {
        style: { cursor: "pointer", color: "green" },
        icon: "visibility",
        disabled: false,
        function: true,
        button: true,
        tooltipValue:'View Entry'
      }
    }
    else if (ecfview?.apinvoicehdr_status?.id != 9 && ecfview?.apinvoicehdr_status?.id != 13 && ecfview?.apinvoicehdr_status?.id != 15) {
      config = {
        disabled: true,
        style: {color: "black" },
        icon: '-',
        function: false,
        button: false,
        tooltipValue:'View Entry'
      }
    }
    return config
  }
  // SummarycommonecfData: any = [
  //   { columnname: "Invoice CR No", key: "apinvoiceheader_crno", function: true, clickfunction: this.linkView.bind(this), "style": { color: " #3684bf", cursor: "pointer" }, },
  //   { columnname: "ECF Type", key: "aptype", type: "object", objkey: "text", },
  //   { columnname: "ECF Date", key: "apdate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
  //   { columnname: "Batch No", key: "batch_no", validate: true, validatefunction: this.branchno_data.bind(this), },
  //   { columnname: "Batch Status", key: "batch_status", validate: true, validatefunction: this.status_data.bind(this), },
  //   { columnname: "Supplier", key: "supplier_data", validate: true, validatefunction: this.suppliers_data.bind(this), },    { columnname: "Raiser", key: "raiser_name" },
  //   { columnname: "Raiser Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", },
  //   { columnname: "Invoice No", key: "invoice_no" },
  //   { columnname: "Invoice Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
  //   { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
  //   { "columnname": "GST No", "key": "supplier_data", "type": "object", "objkey": "gstno" },
  //   { columnname: "Invoice Status", key: "ap_status", type: "object", objkey: "text" },
  //   {
  //     "columnname": "View Entry", "key": "apinvoicehdr_status", function: true, validate: true,
  //     button: true, validatefunction: this.ecfviewentry.bind(this), clickfunction: this.CommonViewEntry.bind(this)
  //   },
  //   {
  //     columnname: "Download Covernote", icon: "download", "style": { color: "green", cursor: "pointer" },
  //     button: true, function: true, clickfunction: this.coverNotedownload_common_click.bind(this),
  //     validate: true, validatefunction: this.downloadcovernote.bind(this),
  //   }
  // ]

  
  
 commonsumfunc(){
    console.log("enable_ddl value --->", this.enable_ddl)
    this.SummarycommonecfData = [
     {columnname: "Invoice Type", key: "aptype",type: "object",objkey: "text",headicon: true, headerdicon: "filter_list", headertype: 'headoptiondropdown',payloadkey: "aptype",
      inputobj: {
      label: "Invoice Type",
      params: "",
      searchkey: "query",
      displaykey: "text",
      Outputkey: "id",
      fronentdata: true,
      data: this.TypeList,   
      valuekey: "id",
      formcontrolname: "aptype"
    },
    // validate: true, validatefunction: this.dynamicform.bind(this),
    function:true,
    clickFunction: this.commonsumSearch.bind(this)
    },

    { columnname: "Invoice CR No", key: "apinvoiceheader_crno",payloadkey: "invoiceheader_crno","headicon": true, headertype: 'headinput',
       label: "Invoice CR No", headerdicon: "filter_list", clickFunction: this.commonsumSearch.bind(this),inputicon: "search",
       function: true, clickfunction: this.linkView.bind(this), "style": { color: " #3684BF", cursor: "pointer" },
      // validate: true, validatefunction: this.linkcolor.bind(this),
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
      formcontrolname: "supplier_id"
    },
      clickFunction: this.commonsumSearch.bind(this),function:true,
      validate: true, validatefunction: this.suppliers_data.bind(this),
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
      formcontrolname:"raiser_name"

    },
    clickFunction: this.commonsumSearch.bind(this),function:true,
    // validate: true, validatefunction: this.raisercommon_data.bind(this),
     },

    { columnname: "Raiser Branch", key: "raiserbranch_branch", type: "object", objkey: "name_code", "headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
      payloadkey: "raiserbranch_id",   
      inputobj:{
        label: " Branch",
        method: "get",
        url: this.ecfmodelurl + "usrserv/search_branch",
        params: "",
        searchkey: "query",
        displaykey: "fullname",
        Outputkey: "id",
        // prefix: 'code',
        // separator: "hyphen",
        formcontrolname:"raiserbranch_id"
      },
      clickFunction: this.commonsumSearch.bind(this),function:true,
      //  validate: true, validatefunction: this.branchcommon_data.bind(this),
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

              }, clickFunction: this.commonsumSearch.bind(this),
              // validate: true, validatefunction: this.raiser_branch_data.bind(this),
            },
    { columnname: "Invoice Branch", key: "invoicebranch", type: "object", objkey: "name_code", "headicon": this.enable_ddl, headerdicon: "filter_list", headertype: 'headdropdown',
      payloadkey: "branchdetails_id",   
     inputobj:{
      label: " Branch",
      method: "get",
      url: this.ecfmodelurl + "usrserv/search_branch",
      params: "",
      searchkey: "query",
      displaykey: "fullname",
      Outputkey: "id",
      // prefix: 'code',
      // separator: "hyphen",
      formcontrolname:"branchdetails_id"
    },
     clickFunction: this.commonsumSearch.bind(this),function:true,
    //  validate: true, validatefunction: this.branchcommon_data.bind(this),
    },
    { columnname: "Invoice No", key: "invoice_no", payloadkey: "invoice_no", "headicon": true, headertype: 'headinput',
     label: "Invoice No", headerdicon: "filter_list", clickFunction: this.commonsumSearch.bind(this), inputicon: "search",
    //  validate: true, validatefunction: this.invoicecommon_data.bind(this),
    },

    { columnname: "Transaction Date", key: "apdate", "type": 'Date', "headicon": true, payloadkey_1: "start_date", payloadkey_2: "end_date",
      common_key:{ecf_date: "ecf_date"}, label1: "Start Date",label2:"End Date", headerdicon: "date_range", headertype: 'startendDate', 
      "datetype": "dd-MMM-yyyy" , clickFunction: this.commonsumSearch.bind(this),
      //  validate: true, validatefunction: this.datecommon_data.bind(this),
       },
     
      { columnname: "Invoice Amount", prefix: "₹",  key: "totalamount",type: 'Amount', headicon: true, headinput: true, headerdicon: "filter",
      headertype: 'minmaxAmnt', payloadkey_1: "minamt",payloadkey_2: "maxamt",common_key: {inv_amount: "inv_amount"},label1: "Min Amount",
      label2: "Max Amount", clickFunction: this.commonsumSearch.bind(this),inputicon: "search",style: {"display":"flex","justify-content" : "end"}
      //  validate: true, validatefunction: this.amountcommon_data.bind(this),
      },

    { columnname: "ECF Status", key: "apinvoicehdr_status", type: "object", objkey: "text","headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
      payloadkey: "apinvoiceheaderstatus_id",  
      inputobj:{
      label: "ECF Status",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/get_common_status",
      params: "",
      // fronentdata: true,
      // data: this.sctcommonstatus,  
      searchkey: "query",
      displaykey: "text",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "apinvoiceheaderstatus_id"
    },
       clickFunction: this.commonsumSearch.bind(this),function:true,
        // validate: true, validatefunction: this.statuscommon_data.bind(this),
     },
    { columnname: "AP Status", key: "mono_ap_status", },
    { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy"},
    { "columnname": "GST No", "key": "supplier_data", "type": "object", "objkey": "gstno" },

    {"columnname": "View Entry", "key": "apinvoicehdr_status", function: true, validate: true,tooltip:true,
      button: true, validatefunction: this.ecfviewentry.bind(this), clickfunction: this.CommonViewEntry.bind(this)
    },

    {columnname: "Download Covernote", icon: "download", "style": { color: "green", cursor: "pointer" },tooltip:true,
      button: true, function: true, clickfunction: this.coverNotedownload_common_click.bind(this),
      validate: true, validatefunction: this.downloadcovernote.bind(this),
    }
  ]
  }
  create_btn_disable: boolean = false;
  ecfcommonsummarydata(e){
    console.log("common_sum_data --->",e)
    if(!e?.data)
    this.notification.showError(e?.message)
  }
  ecfapprovalsummarydata(e){
    console.log("approval_sum_data --->",e)
    if(!e?.data)
    this.notification.showError(e?.description)
  }
  ecfinventorysummarydata(e){
    console.log("inventory_sum_data --->",e)
    if(e?.data){
      this.create_btn_disable = false;
    }
    else{
      this.notification.showError(e?.description)
      this.create_btn_disable = true
    }
  }
   linkcolor(data){
     let config: any = {
      value: "",
      color:"",
      headercolor:""
    };
   if (this.globalpayload?.invoiceheader_crno) {
    config.headercolor = "green";
  }
  if (data?.apinvoiceheader_crno) {
    config.value = data?.apinvoiceheader_crno;
  }
    return config;
  }
  dynamicform(data){
     let config: any = {
      value: "",
      color:"",
      headercolor:""
    };
   if (this.globalpayload?.aptype) {
    config.headercolor = "green";
  }
  if (data?.aptype?.text) {
    config.value = data.aptype.text;
  }
    return config;
  }
    suppliers_data(data) {
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

  inputcrno_data(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
    if (this.globalpayload?.invoiceheader_crno) {
      config.headercolor= "green"
    }
     if(data?.invoiceheader_crno) {
      config.value= data?.invoiceheader_crno
    }
    return config;
  }

  raisercommon_data(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
    if (this.globalpayload?.raiser_name) {
      config.headercolor= "green"
    }
     if(data?.raiser_name) {
      config.value= data?.raiser_name
    }
    return config;
  }

   amountcommon_data(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
    if (this.globalpayload?.inv_amount) {
      config.headercolor= "green"
    }
     if(data?.totalamount) {
     config.value = "₹"  +  data.totalamount;}
    return config;
  }

    branchcommon_data(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
    if (this.globalpayload?.branchdetails_id) {
      config.headercolor= "green"
    }
     if(data?.invoicebranch?.name_code) {
      config.value= data?.invoicebranch?.name_code
    }
    return config;
  }
    linkcom(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
    if (this.globalpayload?.invoiceheader_crno) {
      config.headercolor= "green"
    }
     if(data?.apinvoiceheader_crno) {
      config.value= data?.apinvoiceheader_crno
    }
    return config;
  }
    invoicecommon_data(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
    if (this.globalpayload?.invoice_no) {
      config.headercolor= "green"
    }
     if(data?.invoice_no) {
      config.value= data?.invoice_no
    }
    return config;
  }

    datecommon_data(data) {
      let config: any = {
        value: "",
        headercolor:""
      };
      if (this.globalpayload?.start_date && this.globalpayload?.end_date) {
        config.headercolor= "green"
      }
       if(data?.apdate) {
          config.value = formatDate(data.apdate, 'dd-MMM-yyyy','en-US');
      }
      return config;
    }
    statuscommon_data(data) {
    let config: any = {
      value: "",
      headercolor:""
    };
    if (this.globalpayload?.apinvoiceheaderstatus_id) {
      config.headercolor= "green"
    }
     if(data?.apinvoicehdr_status?.text) {
      config.value= data?.apinvoicehdr_status.text
    }
    return config;
  }


  // SummarycommonecfData = [
  //   // { columnname: "ECF Type", key: "aptype", type: "object", objkey: "text", },
  //   {
  //     columnname: "ECF Type",
  //     key: "aptype",
  //     type: "object",
  //     objkey: "text",
  //     headicon: true,
  //     headerdicon: "filter_list",
  //     headertype: 'headoptiondropdown',
  //     payloadkey: "aptype",
  //   inputobj: {
  //     label: "ECF Type",
  //     params: "",
  //     searchkey: "query",
  //     displaykey: "text",
  //     Outputkey: "id",
  //     fronentdata: true,
  //     data: this.TypeList,   
  //     valuekey: "id",
  //     formcontrolname: "aptype"
  //   },
  //   validate: true, validatefunction: this.dynamicform.bind(this),
  // clickFunction: this.commonsumSearch.bind(this)
  //   },
  //   { columnname: "Invoice CR No", key: "apinvoiceheader_crno", function: true, clickfunction: this.linkView.bind(this), "style": { color: " #3684BF", cursor: "pointer" }, },
  //   { columnname: "Supplier", key: "supplier_data", validate: true, validatefunction: this.suppliers_data.bind(this), },
  //   { columnname: "Raiser", key: "raiser_name" },
  //   { columnname: "Branch", key: "invoicebranch", type: "object", objkey: "name_code", },
  //   { columnname: "Invoice No", key: "invoice_no" },
  //   { columnname: "ECF Date", key: "apdate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
  //   { columnname: "Invoice Amount", key: "totalamount", "prefix": "₹", "type": 'Amount' },
  //   { columnname: "ECF Status", key: "apinvoicehdr_status", type: "object", objkey: "text" },
  //   { columnname: "AP Status", key: "ap_status", type: "object", objkey: "text" },
  //   { columnname: "Invoice Date", key: "invoicedate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
  //   { "columnname": "GST No", "key": "supplier_data", "type": "object", "objkey": "gstno" },
  //   {
  //     "columnname": "View Entry", "key": "apinvoicehdr_status", function: true, validate: true,
  //     button: true, validatefunction: this.ecfviewentry.bind(this), clickfunction: this.CommonViewEntry.bind(this)
  //   },
  //   {
  //     columnname: "Download Covernote", icon: "download", "style": { color: "green", cursor: "pointer" },
  //     button: true, function: true, clickfunction: this.coverNotedownload_common_click.bind(this),
  //     validate: true, validatefunction: this.downloadcovernote.bind(this),
  //   }
  // ]
  branchno_data(data) {
    let config: any = {
      value: "",
    };

    if (data.batch_no != null && data.batch_no != undefined && data.batch_no != '') {
      config = {
        value: data.batch_no,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }

  status_data(branchs) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (branchs?.batch_status == null || branchs?.batch_status == undefined || branchs?.batch_status == '') {
      config = {
        disabled: false,
        value: '-',
        function: false
      }
    }
    else {
      config = {
        disabled: false,
        value: branchs?.batch_status,
        function: false
      }
    }
    return config
  }
  view_etry(data) {
    let config: any = {
      icon: "",
      style: "",
      button: false,
      function: false,
      value: "",
    };

    if (data.apinvoicehdr_status?.id == 9 || data.apinvoicehdr_status?.id == 13 || data.apinvoicehdr_status?.id == 15) {
      config = {
        icon: "visibility",
        style: { cursor: "pointer" },
        button: true,
        // key: "visibility",
        function: true,

        // value: "aaaaa",
      };
    }
    else if (data.apinvoicehdr_status?.id != 9 && data.apinvoicehdr_status?.id != 13 && data.apinvoicehdr_status?.id != 15) {
      config = {
        function: false,
        button: false,
        value: "-",
      };
    }
    else {
      config = {
        function: false,
        button: false,
        value: "-",
      };
    }
    return config;
  }

  downloadcovernote(data) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      id: "",
      button: false,
      function: false
    };
    if (data.ecfstatus?.text != 'RETURNED' && data.ecfstatus?.text != 'BATCH ECF RETURNED' && data.ecfstatus?.text != 'PENDING IN ECF APPROVAL') {
      config = {
        disabled: false,
        icon: "download",
        style: { cursor: "pointer",color: "black" },
        button: true,
        key: "download",
        function: true,
        value: data.ecfstatus,
        tooltipValue:'Download Covernote'
      };
    } else {
      config = {
        disabled: true,
        style: {color: "black" },
        // icon: '-',
        function: false,
        button: false,
        tooltipValue:'Download Covernote'
      };
    }
    return config;
  }
  ecfsummarysearch(e) {
    // if (this.ecfapprovalform.value.apstatus) {
    //   let data = {
    //     type: "true",
    //     apstatus: this.ecfapprovalform.value.apstatus,
    //     purpose: this.ecfapprovalform.value.purpose,
    //     start_date: this.ecfapprovalform.value.start_date = this.datePipe.transform(this.ecfapprovalform.value.start_date, 'yyyy-MM-dd') ? this.datePipe.transform(this.ecfapprovalform.value.start_date, 'yyyy-MM-dd') : "",
    //     end_date: this.ecfapprovalform.value.end_date = this.datePipe.transform(this.ecfapprovalform.value.end_date, 'yyyy-MM-dd') ? this.datePipe.transform(this.ecfapprovalform.value.end_date, 'yyyy-MM-dd') : ""
    //   }
    //   let payloadbodydata = { ...data, ...e };
    //   this.ecpappsumdataapi = {
    //     method: "post",
    //     url: this.url + "ecfapserv/batchheadersearch",
    //     params: "&ecf_approver=true",
    //     data: payloadbodydata
    //   }
    // }
    // else {
    //   let data = {
    //     type: "true",
    //     apstatus: "",
    //     purpose: "",
    //     start_date: "",
    //     end_date: ""
    //   }
    //   let payloadbodydata = { ...data, ...e };
    //   this.ecpappsumdataapi = {
    //     method: "post",
    //     url: this.url + "ecfapserv/batchheadersearch",
    //     params: "&ecf_approver=true",
    //     data: payloadbodydata
    //   }
    // }
    let payloadbodydata = {
    "type": true,
    "crno": "",
    "aptype": "",
    "apstatus": "",
    "minamt": "",
    "maxamt": "",
    "commodity_id": "",
    "supplier": "",
    "branch": "",
    "purpose": "",
    "start_date": "",
    "end_date": "",
    "supplier_id": ""
    };
   let approvalpayloadbodydata = { ...payloadbodydata, ...e };
    this.ecpappsumdataapi = {
        method: "post",
        url: this.url + "ecfapserv/batchheadersearch",
        params: "&ecf_approver=true" + "&submodule=" + this.ecf_approval_sub_module_name,
        data: approvalpayloadbodydata
    }
  }
  commonsumSearch(e) {
    this.globalpayload = e || {}
    if (this.enable_ddl === false) {
      this.globalpayload["raiserbranch_id"] = this.branchrole.id;
      this.SummaryApicommonecfObjNew = {
        method: "post",
        url: this.url + "ecfapserv/ecfap_common_summary",
        params: "&submodule=" + this.ecf_common_sub_module_name,
        data: this.globalpayload
      }
    }
    else{
      this.SummaryApicommonecfObjNew = {
        method: "post",
        url: this.url + "ecfapserv/ecfap_common_summary",
        params: "&submodule=" + this.ecf_common_sub_module_name,
        data: this.globalpayload
      }
    }
  }
  batchappsumsearch(e) {
    let data = {
      type: "false"
    }
    let branchpayloadbodydata = { ...data, ...e };
    this.batchappsumdataapi = {
      method: "post",
      url: this.url + "ecfapserv/batchsearch",
      params: "&ecf_approver=true",
      data: branchpayloadbodydata
    }
  }

  downloadbatch(data) {
    let config: any = {
      value: "",
    };

    if (data.batchstatus == 'APPROVED') {
      config = {
        icon: "download",
        style: { cursor: "pointer" },
        button: true,
        key: "download",
        function: true,

        // value: data.batchstatus,
      };
    } else {
      config = {
        value: "-",
        function: true,
      };
    }
    return config;
  }
  processecf(data) {
    let config: any = {
      value: "-",
      function: true,
    };
    return config;
  }
  pendingecf(data) {
    let config: any = {
      value: "-",
      function: true,
    };
    return config;
  }
  SummarybatchwiseData: any = [
    { columnname: "Batch No", key: "batchno" },
    { columnname: "Batch Date", key: "batch_date", "type": 'date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Batch Amount", key: "batchamount", "prefix": "₹", "type": 'Amount' },
    { columnname: "ECF Count", key: "batchcount" },
    { columnname: "ECF Processed Count", key: "-", validate: true, validatefunction: this.processecf.bind(this), },
    { columnname: "ECF Pending Count", key: "-", validate: true, validatefunction: this.pendingecf.bind(this), },
    { columnname: "Raiser Name", key: "raisername" },
    { columnname: "Branch", key: "branchname" },
    { columnname: "Approver Name", key: "approvername" },
    { columnname: "Batch Status", key: "batchstatus" },
    {
      columnname: "View", "key": "view", icon: "visibility",
      style: { cursor: "pointer", color: "green" },
      button: true,
      function: true,
      clickfunction: this.showecfview.bind(this, 'Makerview', 'batch'),
    },
    {
      columnname: "Download", icon: "download", key: "downloadss",
      style: { cursor: "pointer" }, button: true,
      function: true, clickfunction: this.batchcovernotedownload.bind(this),
      validate: true, validatefunction: this.downloadbatch.bind(this),
    }
  ]

  batchsummary(e) {
    let supplierpayloadbodydata = {
      type: 2,
      batchcount: "",
      batchno: "",
      batchstatus: "",
      branch: "",
      fromdate: "",
      todate: "",
    };

    supplierpayloadbodydata = { ...supplierpayloadbodydata, ...e };
    this.SummaryApibatchwiseObjNew = {
      "method": "post", "url": this.ecfURL + "ecfapserv/batchsearch",
      data: supplierpayloadbodydata
    }
  }

  paymentAdvisorySumm: any
  PaymentAdvSearch(page = 1) {

  }
  resetPayAdvisory() {

  }
  getRptDnldPmtAdv() {

  }
  isPymtAdvpage: boolean
  length_PymtAdv = 0;
  pagesize_PymtAdv = 10
  pageIndexPymtAdv = 0;
  pymtAdvpresentpage = 1
  handlePymtAdvPageEvent(event: PageEvent) {
    this.length_PymtAdv = event.length;
    this.pagesize_PymtAdv = event.pageSize;
    this.pageIndexPymtAdv = event.pageIndex;
    this.pymtAdvpresentpage = event.pageIndex + 1;
    this.PaymentAdvSearch(this.pymtAdvpresentpage);

  }

  ecftype_data(data) {
    let config: any = {
      value: "",
    };

    if (data?.aptype_id != 8) {
      config = {
        value: data.aptype,
      };
    } else {
      config = {
        value: "TCF",
      };
    }
    return config;
  }
  crno_data(data) {
    let config: any = {
      value: "",
    };

    if (data?.crno != null) {
      config = {
        value: data.crno,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }
  branch_data(data) {
    let config: any = {
      value: "",
    };

    if (data?.batch_no != undefined && data?.batch_no != null && data?.batch_no != '') {
      config = {
        value: data.batch_no,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }

  edit_etry(data) {
    let config: any = {
      icon: "",
      style: "",
      function: false,
      value: "",
      disabled: false
    };
    if (data?.ecfstatus?.text == 'DRAFT' || data?.ecfstatus?.text == 'READY FOR BATCH' || data?.ecfstatus?.text == 'RETURNED') {
      config = {
        icon: "edit",
        style: { color: "green", cursor: "pointer" },
        function: true,
        id: "ecfap-0074"
      };
    }
    else {
      (data?.ecfstatus?.text != 'DRAFT' && data?.ecfstatus?.text != 'READY FOR BATCH' && data?.ecfstatus?.text != 'RETURNED')
      config = {
        icon: "edit",
        style: { color: "grey", cursor: "pointer" },
        function: false,
        disabled: false,
        id: "ecfap-0075"
      };
    }
    return config;
  }

  date_data(data) {
    let config: any = {
      value: "",
    };

    if (data?.apdate !== "None") {
      config = {
        value: data?.apdate,
      };
    }
    else {
      config = {
        value: "-",
      };
    }

    return config;
  }

  SummarysupplierwiseData: any = [
    { columnname: "ECF Type", key: "aptype", validate: true, validatefunction: this.ecftype_data.bind(this), },
    { columnname: "CR No", key: "crno", validate: true, validatefunction: this.crno_data.bind(this), },
    { columnname: "Batch No", key: "batch_no", validate: true, validatefunction: this.branch_data.bind(this), },
    { columnname: "Supplier", key: "supplier_data", type: "object", objkey: "name", },
    { columnname: "Commodity Name", key: "commodity_id", type: "object", objkey: "name", },
    { columnname: "Branch", "key": "branch", "array": true, "objkey": "name" },
    { columnname: "ECF Date", key: "apdate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
    { columnname: "ECF Amount", key: "apamount", "prefix": "₹", "type": 'Amount' },
    { columnname: "ECF Status", key: "ecfstatus", type: "object", objkey: "text", },
    {
      columnname: "",
      icon: "visibility", "style": { color: "green", cursor: "pointer" },
      button: true, function: true,
      clickfunction: this.showview.bind(this),
    },
    {
      columnname: "Action",
      function: true, clickfunction: this.showedit.bind(this), button: true, id: "ecfap-0074",
      validate: true, validatefunction: this.edit_etry.bind(this)
    },
    {
      columnname: "",
      icon: "lock_open", "style": { color: "green", cursor: "pointer" },
      button: true, function: true,
      clickfunction: this.ECFunlocks.bind(this),
    },
  ]

  supplierwiseSearch(e) {
    let supplierpayloadbodydata = {
      type: 3,
      crno: "",
      aptype: "",
      apstatus: "",
      ecfstatus: "",
      branch: "",
      batchno: "",
      supplier_id: "",
      invoice_no: "",
      commodity_id: "",
    };

    supplierpayloadbodydata = { ...supplierpayloadbodydata, ...e };
    this.SummaryApisupplierwiseObjNew = {
      method: "post",
      url: this.url + "ecfapserv/vow_summary",
      data: supplierpayloadbodydata
    }
  }


  //santhosh


  ecfwisecolumn(ecfwise) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (ecfwise.aptype_id != 8) {
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: ecfwise.aptype,
        function: false
      };
    }
    else if (ecfwise.aptype_id == 8) {
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: "TCF",
        function: false
      };
    }
    return config
  }
  ecfwisecolumn2(ecf) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (ecf.crno != null) {
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: ecf.crno,
        function: false
      };

    }
    else if (ecf.crno === null) {
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: "-",
        function: false
      };
    }
    return config
  }
  ecfwisecolumn3(ecf) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (ecf?.batch_no != undefined && ecf?.batch_no != null && ecf?.batch_no != '') {
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: ecf.batch_no,
        function: false
      };
    }
    else if (ecf?.batch_no == undefined || ecf?.batch_no == null || ecf?.batch_no == '') {
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: '-',
        function: false
      };
    }
    return config
  }
  ecfwisecolumn4(date) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function: false
    };
    if (date?.apdate !== "None") {
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: date.apdate,
        function: true
      };
    }
    else {
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: "-",
        function: false
      };
    }
    return config;
  }
  ecfwisecolumn5(edit) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      tooltipValue:'',
      id: "",
      button: false,
      function: false
    };
    if (edit?.ecfstatus?.text == 'DRAFT' || edit?.ecfstatus?.text == 'READY FOR BATCH' || edit?.ecfstatus?.text == 'RETURNED' || edit?.ecfstatus?.text == 'PENDING IN ECF APPROVAL') {
      config = {
        disabled: false,
        style: { cursor: "pointer", color: "green" },
        icon: "edit",
        class: '',
        value: '',
        tooltipValue: 'Edit',
        id: "ecfap-0038",
        button: true,
        function: true
      };
    }
    else if (edit?.ecfstatus?.text != 'DRAFT' && edit?.ecfstatus?.text != 'READY FOR BATCH' && edit?.ecfstatus?.text != 'RETURNED' && edit?.ecfstatus?.text != 'PENDING IN ECF APPROVAL') {
      config = {
        disabled: true,
        style: { cursor: "pointer", color: "green" },
        icon: "edit",
        class: '',
        value: '',
        tooltipValue: 'Edit',
        id: "ecfap-0039",
        button: false,
        function: false
      };
    }
    return config;
  }
 ecfwisecolumn6(down) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      tooltipValue:'',
      id: "",
      function: false
    };
    if (down?.ecfstatus?.text == 'ECF APPROVED') {
      config = {
        disabled: false,
        style: { cursor: "pointer", color: "green" },
        icon: 'download',
        class: '',
        value: '',
        tooltipValue: 'Download',
        function: true,
        button: true,
      };
    }
    else if (down?.ecfstatus?.text !== 'ECF APPROVED') {
      config = {
        disabled: true,
        style: {color: "grey" },
        icon: 'download',
        class: '',
        value: '',
        tooltipValue: 'Download',
        id: "ecfap-0040",
        function: false,
        button: false,
      };
    }
    return config;
  }

  ecfwisecolumn7(check: any) {
    // this.commchecks = check?.commodity_id?.id
    // this.ecftypechecks = check?.aptype_id
    console.log('commcheck:', this.commcheck);
    console.log('ecftypecheck:', this.ecftypecheck);
    console.log('check:', check);

    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      button: false,
      function: false,
    };

    if (check?.ecfstatus?.text === 'READY FOR BATCH') {
      if (
        (this.commcheck === '' || this.commcheck === null || this.commcheck === undefined ||
          this.ecftypecheck === '' || this.ecftypecheck === null || this.ecftypecheck === undefined) &&
        check.batch_no === null
      ) {
        console.log('1st if working:----->',);
        console.log('this.commcheck:----->', this.commcheck);
        console.log('this.ecftypecheck:----->', this.ecftypecheck);
        console.log('check.batch_no:----->', check.batch_no);
        // If commcheck or ecftypecheck is empty/null AND batch_no is null
        config = {
          disabled: false, // Enable checkbox
          style: '',
          icon: '',
          class: '',
          value: '',
          button: true,
          function: true,
        };
      } else if (
        check.commodity_id.id === this.commcheck &&
        check.aptype_id === this.ecftypecheck &&
        check.batch_no === null
      ) {
        // If commodity_id and aptype_id match commcheck and ecftypecheck, and batch_no is null
        config = {
          disabled: false, // Enable checkbox
          style: '',
          icon: '',
          class: '',
          value: '',
          button: true,
          function: true,
        };
      } else {
        // Disable checkbox for all other conditions
        config = {
          disabled: true,
          style: { cursor: 'pointer', color: 'grey' },
          icon: '',
          class: '',
          value: '',
          button: false,
          function: false,
        };
      }

    } else if (check?.ecfstatus?.text !== 'READY FOR BATCH') {
      // Disable checkbox if status is not 'READY FOR BATCH'
      config = {
        disabled: true,
        style: { cursor: 'pointer', color: 'grey' },
        icon: '',
        class: '',
        value: '',
        button: false,
        function: false,
      };
    }

    return config;
  }

    ecfvalidateremdata(data) {
    let config: any = {
      value: "",
    };
    if (data?.remark) {
      config = {
        value: data?.remark,
      };
    } else {
      config = {
        value: "-",
      };
    }
    return config;
  }
  ecfwisecolumn8(sun) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      tooltipValue: '',
      id: "",
      button: false,
      function: false
    };
    if (sun?.ecfstatus?.text == 'DRAFT' || sun?.ecfstatus?.text == 'READY FOR BATCH' || sun?.ecfstatus?.text == 'PENDING IN ECF APPROVAL' || sun?.ecfstatus?.text == 'RETURNED') {
      config = {
        disabled: false,
        style: { cursor: "pointer", color: "green" },
        icon: 'wb_sunny',
        tooltipValue:'Active/Inactive',
        class: '',
        value: '',
        id: "ecfap-0041",
        button: true,
        function: true
      };
    }
    else if (sun?.ecfstatus?.text != 'DRAFT' && sun?.ecfstatus?.text != 'READY FOR BATCH' && sun?.ecfstatus?.text != 'PENDING IN ECF APPROVAL' && sun?.ecfstatus?.text != 'RETURNED') {
      config = {
        disabled: true,
        style: { color: "grey" },
        icon: 'wb_sunny',
        class: '',
        value: '',
        tooltipValue: 'Active/Inactive',
        id: "ecfap-0042",
        button: false,
        function: false
      };
    }
    return config;
  }
  ecfwisecolumn9(copy) {
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      tooltipValue: '',
      id: "",
      button: false,
      function: false
    };
    if (copy.ecfstatus_id == 3 && (copy.aptype_id == 2 || copy.aptype_id == 3 || 
      copy.aptype_id == 4  || copy.aptype_id == 7  || copy.aptype_id == 13 || copy.aptype_id == 14)) {
      config = {
        disabled: false,
        style: { cursor: "pointer", color: "#673ab7" },
        icon: 'content_copy',
        class: '',
        value: '',
        tooltipValue: 'ECF Clone',
        id: "ecfap-0285",
        button: true,
        function: true
      };
    }
    return config;
  }

  supply_data(data) {
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

// summarysearchecf(){
// this.Summaryecfwisedata = [
//    {columnname: "Invoice Type", key: "aptype",type: "object",objkey: "text",headicon: true, headerdicon: "filter_list", headertype: 'headoptiondropdown',payloadkey: "aptype",
//       inputobj: {
//       label: "Invoice Type",
//       params: "",
//       searchkey: "query",
//       displaykey: "text",
//       Outputkey: "id",
//       fronentdata: true,
//       data: this.TypeList,
//       valuekey: "id",
//       formcontrolname: "aptype"
//     },
//     validate: true, validatefunction: this.ecfwisecolumn.bind(this),function:true,
//     clickFunction: this.ecfwisesearch.bind(this)
//     },
//     {
//       columnname: "CR No",
//       key: "crno",
//       // validate: true,
//       payloadkey: "crno",
//       headicon: true,
//       headertype: "headinput",
//       label: "search",
//       headerdicon: "filter_list",
//       clickFunction: this.ecfwisesearch.bind(this),
//       inputicon: "search",
//       // function:true,
//       // validatefunction: this.ecfwisecolumn2.bind(this),
//     },
//     {
//       columnname: "ECF Date",
//       key: "apdate",
//       type: "Date",
//       datetype: "dd-MMM-yyyy",
//     },
//     { columnname: "Branch", key: "branch", 
//       // array: true, 
//       type: "object", objkey: "name_code" ,
//       // validate: true,
//       // validatefunction: this.branch_sum_data.bind(this),
//       headicon: true,
//       headertype: "headdropdown",
//       // headerdicon: "filter_list",

//       payloadkey: "branch",
//       inputobj: {
//     label: "Branch",
//     method: "get",
//     url: this.ecfURL + "usrserv/search_branch",
//     params: "",
//     searchkey: "query",
//     displaykey: "fullname",
//     Outputkey: "id",
//     formcontrolname: "branch",
//     // suffix: "code",
//     // separator: "hyphen",

//   }
// ,
//       clickFunction: this.ecfwisesearch.bind(this),
//     },
//     {
//       columnname: "Commodity Name",
//       key: "commodity_id",
//       type: "Object",
//       objkey: "name",
//       // validate: true,
//       // validatefunction: this.com_data.bind(this),
//       headicon: true,
//       headertype: "headdropdown",
//       headerdicon: "filter_list",
//       payloadkey: "commodity_id",
//       inputobj: {
//          label: "Commodity Name",
//     method: "get",
//     url: this.ecfURL + "mstserv/commoditysearch",
//     params: "&name=&code=",
//     searchkey: "query",
//     displaykey: "name",
//     Outputkey: "id",
//     formcontrolname: "commodity_id",
//       },
//       clickFunction: this.ecfwisesearch.bind(this),
//     },
//     // { "columnname": "Batch No", "key": "batch_no", function: true, validate: true, validatefunction: this.ecfwisecolumn3.bind(this) },
//     // { "columnname": "Supplier", "key": "supplier_data", "type": "Object", "objkey": "name" },label: "Supplier",
//       // method: "get",
//       // url: this.ecfmodelurl + "venserv/landlordbranch_list",
//       // params: "",
//       // searchkey: "query",
//       // displaykey: "name",
//       // Outputkey: "id",
//     {
//       columnname: "Supplier",
//       key: "supplier_data",
//       validate: true,
//       validatefunction: this.supply_data.bind(this),
//       headicon: true,
//       headertype: "headdropdown",
//       headerdicon: "filter_list",
//       payloadkey: "supplier_id",
//       inputobj: {
//         label: 'Supplier',
//         method: 'get',
//         url: this.url + 'venserv/landlordbranch_list',
//         params: '',
//         searchkey: 'query',
//         displaykey: 'name',
//         formcontrolname: "supplier_id",
//         Outputkey: "id",
//       },
//       clickFunction: this.ecfwisesearch.bind(this),
//     },
//     { columnname: "ECF Amount", key: "apamount", prefix: "₹", type: "Amount" },
//      { columnname: "ECF Status", key: "ecfstatus", type: "object", objkey: "text","headicon": true, headerdicon: "filter_list", headertype: 'headdropdown',
//       payloadkey: "ecfstatus",
//       inputobj:{
//       label: "ECF Status",
//       searchkey: "query",
//       displaykey: "text",
//       // displaykey: " notename:new FormControl(''),text",
//       url: this.ecfURL + "ecfapserv/get_inventory_status",
//       Outputkey: "id",
//       formcontrolname: "ecfstatus",
//       valuekey: "id",
//     },
//        clickFunction: this.ecfwisesearch.bind(this),function:true,
//       //  validate: true, validatefunction: this.statuscommon_data.bind(this),
//      },
//     { columnname: "Remarks", key: "remark",
//       // validate: true,
//       // validatefunction: this.ecfvalidateremdata.bind(this)
//     },
//     {
//       columnname: "",
//       key: "View",
//       tooltip: true,
//       icon: "visibility",
//       button: true,
//       style: { cursor: "pointer", color: "green" },
//       function: true,
//       clickfunction: this.showview.bind(this),

//     },
//     {
//       columnname: "",
//       key: "Edit",
//       tooltip: true,
//       button: true,
//       function: true,
//       clickfunction: this.showedit.bind(this),
//       validate: true,
//       validatefunction: this.ecfwisecolumn5.bind(this),
//     },
//     {

//       columnname: "Action",
//       key: "Download",
//       tooltip: true,
//       button: true,
//       function: true,
//       clickfunction: this.ecf_summary_data_coverNotedownload.bind(this),
//       validate: true,
//       validatefunction: this.ecfwisecolumn6.bind(this),
//     },
//     {
//       columnname: "",
//       key: "Inactive",
//       tooltip: true,
//       button: true,
//       function: true,
//       clickfunction: this.delete.bind(this),
//       validate: true,
//       validatefunction: this.ecfwisecolumn8.bind(this),
//     },
//     {
//       columnname: "",
//       key: "Clone",
//       button: true,
//       tooltip: true,
//       function: true,
//       clickfunction: this.createTemp.bind(this),
//       validate: true,
//       validatefunction: this.ecfwisecolumn9.bind(this),
//     },
//   ];
//   }
  
// supply_data(data) {
//     let config: any = {
//       value: "",
//     };
//    if (this.globalpayload?.supplier_id) {
//       config.headercolor= "green"
//     }
//     if (data?.supplier_data?.name) {
//       config.value=data?.supplier_data.name
//     } else {
//       config.value="-"
//     }
//     return config;
//   }

  com_data(data){
 let config: any = {
      value: "",
      headercolor:""
    };
   if (this.globalpayload?.commodity_id) {
      config.headercolor= "green"
    }
    if (data?.commodity_id?.name) {
      config.value=data?.commodity_id.name
    } 
    return config;
  }
//     com_app_data(data){
//  let config: any = {
//       value: "",
//       headercolor:""
//     };
//    if (this.globalpayloadapproval?.commodity_id) {
//       config.headercolor= "green"
//     }
//     if (data?.commodity_id?.name) {
//       config.value=data?.commodity_id.name
//     } 
//     return config;
//   }

//   branch_search_data(data){
// let config: any = {
//       value: "",
//       headercolor:""
//     };
//    if (this.globalpayloadapproval?.branch) {
//       config.headercolor= "green"
//     }
//     const nameCodes = data.branch.map(b => b.name_code);
//     if (nameCodes) {
//       config.value=nameCodes
//     } 
//     return config;
//   }
  // statuscommon_data(data){
  //   let config: any = {
  //     value: "",
  //   };
  //  if (this.globalpayload?.ecfstatus) {
  //     config.headercolor= "green"
  //   }
  //   if (data?.ecfstatus?.text) {
  //     config.value=data?.ecfstatus?.text
  //   } else {
  //     config.value="-"
  //   }
  //   return config;
  // }
  // reset(){
  //   // this.restformsummary =['crno']
  //   this.globalpayload = "";
  //   this.SummaryApiecfwiseObjNew = {
  //     method: "post",
  //     url: this.url + "ecfapserv/batchheadersearch",
  //     params: "&submodule="+this.ecf_inventory_sub_module_name,
  //     data: {},
  //   };
  // }

  //  resetapproval(){
  //   let e = {}
  //      let data = {
  //       type: "true",
  //       apstatus: "",
  //       purpose: "",
  //       start_date: "",
  //       end_date: "",
  //     };
  //     let payloadbodydata = { ...data, ...e };
  //   // this.restformapprovalsummary =[]
  //   this.ecfSearchForm.reset()
  //   // this.globalpayloadapproval = "";
  //   this.ecpappsumdataapi = {
  //     method: "post",
  //     url: this.url + "ecfapserv/batchheadersearch",
  //     params: "&ecf_approver=true" + "p_submodule=" + this.ecf_approval_sub_module_name,
  //     data: payloadbodydata,
  //   };
  // }
  // Summaryecfwisedata = [{ "columnname": "ECF Type", "key": "aptype", function: true, validate: true, validatefunction: this.ecfwisecolumn.bind(this) },
  //   { "columnname": "CR No", "key": "crno", function: true, validate: true, validatefunction: this.ecfwisecolumn2.bind(this) },
  //   { "columnname": "ECF Date", "key": "apdate", "type": 'Date', "datetype": "dd-MMM-yyyy" },
  //   { "columnname": "Branch", "key": "branch", "array": true, "objkey": "name_code" },
  //   { "columnname": "Commodity Name", "key": "commodity_id", type: "Object", objkey: "name" },
  //   // { "columnname": "Batch No", "key": "batch_no", function: true, validate: true, validatefunction: this.ecfwisecolumn3.bind(this) },
  //   // { "columnname": "Supplier", "key": "supplier_data", "type": "Object", "objkey": "name" },
  //   {
  //     columnname: "Supplier", "key": "supplier_data", validate: true,
  //     validatefunction: this.supply_data.bind(this),
  //   },
  //   { "columnname": "ECF Amount", "key": "apamount", "prefix": "₹", "type": 'Amount' },
  //   { "columnname": "ECF Status", "key": "ecfstatus", type: "Object", objkey: "text" },
  //   { "columnname": "Remarks", "key": "remark",},
  //   { "columnname": "", "key": "View",tooltip:true, icon: "visibility", button: true, style: { cursor: "pointer", color: "green" }, function: true, clickfunction: this.showview.bind(this) },
  //   { "columnname": "", "key": "Edit",tooltip:true, button: true, function: true, clickfunction: this.showedit.bind(this), validate: true, validatefunction: this.ecfwisecolumn5.bind(this) },
  //   { "columnname": "Action", "key": "Download",tooltip:true, button: true, function: true, clickfunction: this.ecf_summary_data_coverNotedownload.bind(this), validate: true, validatefunction: this.ecfwisecolumn6.bind(this) },
  //   { "columnname": "", "key": "Inactive",tooltip:true, button: true, function: true, clickfunction: this.delete.bind(this), validate: true, validatefunction: this.ecfwisecolumn8.bind(this) },
  //   { "columnname": "", "key": "Clone", button: true,tooltip:true, function: true, clickfunction: this.createTemp.bind(this), validate: true, validatefunction: this.ecfwisecolumn9.bind(this) },
  //   ]
  // {"columnname": "", "key": "check","checkbox": true,button: true,function: true,clickfunction: this.onselectionchange.bind(this),validate: true, validatefunction: this.ecfwisecolumn7.bind(this)},
  ecfwisesearch(e) {
    if(this.ecf_inventory_sub_module_name == undefined){
      this.ecf_inventory_sub_module_name = "ECF Inventory"
    }
    let payloadbodydata = {
      type: 1,
      crno: "",
      aptype: "",
      apstatus: "",
      ecfstatus: "",
      minamt: "",
      maxamt: "",
      branch: "",
      batchno: "",
      supplier_id: "",
      invoice_no: "",
      commodity_id: "",
    };
    let branchpayloadbodydata = { ...payloadbodydata, ...e };
    this.SummaryApiecfwiseObjNew = { method: "post", url: this.url + "ecfapserv/batchheadersearch", params: "&submodule="+this.ecf_inventory_sub_module_name, data: branchpayloadbodydata }
  }
  ecf_inv_filter() {
    this.expand_invent = !this.expand_invent
  }
  ecf_inventory_close() {
    this.expand_invent = false
    this.ecfSearchForm.controls['ecfstatus'].reset(""),
      this.ecfSearchForm.controls['branch'].reset(""),
      this.ecfSearchForm.controls['commodity_id'].reset("")
  }
  ecf_inventory_reset() {
    this.ecfSearchForm.controls['ecfstatus'].reset(""),
      this.ecfSearchForm.controls['branch'].reset(""),
      this.ecfSearchForm.controls['commodity_id'].reset("")
      let payloadbodydata = {
        type: 1,
        crno: "",
        aptype: "",
        apstatus: "",
        ecfstatus: "",
        minamt: "",
        maxamt: "",
        branch: "",
        batchno: "",
        supplier_id: "",
        invoice_no: "",
        commodity_id: "",
      };

      // this.SummaryApiecfwiseObjNew = { method: "post", url: this.url + "ecfapserv/batchheadersearch", params:  "&submodule="+this.ecf_inventory_sub_module_name, data: payloadbodydata }
  }

  // ecftype: any = {
  //   label: "ECF Type",
  //   searchkey: "query",
  //   displaykey: "text",
  //   url: this.ecfURL + "ecfapserv/get_ecftype",
  //   // data: this.Ecf_type,
  //   Outputkey: "id",
  //   // fronentdata: true,
  // }

  
  
  @ViewChild('ecfTypeList') ecfTypeList: MatSelectionList;
  @ViewChild('ecfStatusList') ecfStatusList: MatSelectionList;
  isSearchVisible: { [key: string]: boolean } = {};
  searchValues: { [key: string]: any } = {};
 
  // resetSelection() {
  //   this.ecfTypeList.deselectAll(); // Clears all selections
  // }
  
selectedItem: any = null;

selectedECFtype(value, summarytype){
  console.log(value)
  this.selectedItem = value
  if(summarytype ==1){
    this.ecfSearchForm.controls['aptype'].reset()
    this.summarysearch('aptype',1)
  }
  else if(summarytype == 2) {
    this.ecfapprovalform.controls['aptype'].reset()
    this.ecfapprovalsummarysearch('aptype',1)
  }
  else if(summarytype == 3){
    this.commonForm.controls['aptype'].reset()
    this.commonSummarySearch('aptype', 1)
  }
}
selectedSupplier(value, summarytype){
  console.log(value)
  this.selectedItem = value
  
  if(summarytype ==1){
    this.summarysearch('supplier',1)
  }
  else if(summarytype ==2){
    this.ecfapprovalsummarysearch('supplier',1)
  }  
  else if(summarytype == 3){
    this.commonSummarySearch('supplier', 1)
  }
}
selectedbranch(value, summarytype){
  console.log(value)
  this.selectedItem = value
  if(summarytype ==1){
    this.summarysearch('branch',1)
  }
  else if(summarytype ==2){
    this.ecfapprovalsummarysearch('branch',1)
  }
  else if(summarytype == 3){
    this.commonSummarySearch('branchdetails_id', 1)
  }
}
selectedECFstaus(value, summarytype){
  console.log(value)
  this.selectedItem = value
  if(summarytype ==1){
    this.summarysearch('ecfstatus',1)
  }
  else if(summarytype ==2){
    this.ecfapprovalsummarysearch('apstatus',1)
  }
  else if(summarytype == 3){
    this.commonSummarySearch('apinvoiceheaderstatus_id', 1)
  }
}

selectedAPstatus(value, summarytype){
  if(summarytype == 3){
  this.commonSummarySearch('invoice_status', 1)
}
}

selectedraiser(value, summarytype){
  console.log(value)
  this.selectedItem = value
  
  if(summarytype ==1){
    this.summarysearch('raiser',1)
  }
  else if(summarytype ==2){
    this.ecfapprovalsummarysearch('raiser',1)
  }
  else if(summarytype == 3){
    this.commonSummarySearch('raiser', 1)
  }
}

selectedCommodity(value, summarytype){
  console.log(value)
  this.selectedItem = value
  if(summarytype ==1){
    this.summarysearch('commodity_id',1)
  }
  else if(summarytype == 2){
    this.ecfapprovalsummarysearch('commodity_id',1)
  }
  else if(summarytype == 3){
    this.commonSummarySearch('commodity_id', 1)
  }
}  

selectedRaiser(value, summarytype){
  console.log(value)
  this.selectedItem = value
  if(summarytype == 3){
    this.commonSummarySearch('raiser_name', 1)
  }
}     
toggleSrchFld = ""
toggleSearch(field: string) {  
  if(this.toggleSrchFld != "" && this.toggleSrchFld != field )
    this.isSearchVisible[this.toggleSrchFld] = false
  this.isSearchVisible[field] = !this.isSearchVisible[field]; 
  if(this.isSearchVisible[field])
    this.toggleSrchFld =field
}

popupopen10() {
  var myModal = new (bootstrap as any).Modal(
    document.getElementById("ecfap-0286"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  myModal.show();
}
popupopen11() {
  var myModal = new (bootstrap as any).Modal(
    document.getElementById("ecfap-0287"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  myModal.show();
}

popupopen12() {
  var myModal = new (bootstrap as any).Modal(
    document.getElementById("ecfap-0288"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  myModal.show();
}

  
   // submitTemplate(){
   //   if(this.chooseTempForm.value.template == '' || this.chooseTempForm.value.template == undefined || this.chooseTempForm.value.template == null){
   //     this.notification.showError('Please Choose Template')
   //     return false
   //   }
   //   else{
   //     this.SpinnerService.show()
   //     this.ecfservice.getTemplateData(this.selectedTemp?.id)
   //     .subscribe(result => {
   //       this.SpinnerService.hide()
 
   //       if(result.data != undefined){
   //         let data = result.data[0]
   //         data = {'invoice_header' : [data?.invoiceheader_json]}
   //         this.closetempbutton.nativeElement.click();
   //       }
   //       else{
   //         this.notification.showError('No Template Data')
   //         return false
   //       }
   //     })
   //     }
   //   }
   ecfhdrid : any
   ecfType : any
   cloneinvgst =""
   today = new Date();
   getEcfData(data){
     this.showCreateTempForm = true
     this.ecfhdrid = data.id
     this.ecfType = data.aptype_id
     this.cloneinvgst = data.invoicegst
   }
   file_process_data:any={};
   valid_arr:Array<any>=[];
   file_process_data2:any={};
   uploadFileTypes =['Invoice', 'Email','Supporting Documents', 'Others']
   uploadSubmit(){
     let data
     data = this.frmCreateTemp.value
     for (var i = 0; i < this.valid_arr.length; i++) {
       data?.filevalue?.push(this.valid_arr[i])
     }
     
     if (this.valid_arr.length > 0) {
       if(this.invdtladdonid != -1 && data[this.invdtladdonid]?.file_key.length < 1) {
         data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[0]);
         data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[1]);
         data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[2]);
         data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[3]);
       } 
     }
     this.file_process_data = this.file_process_data2
     this.file_process_data2 ={}
     this.uploadclose.nativeElement.click()
     this.showCreateTempForm = true
     this.fileInput.nativeElement.value= ""
     this.fileUploaded = this.fileUploadChk()

     console.log('this.file_process_data------------->>>>>>>>>>>' ,this.file_process_data)
 
   }
   uploadback(){
     this.file_process_data2 ={}
     this.uploadPopShow = false
     this.uploadclose.nativeElement.click()
     this.showCreateTempForm = true
     this.fileInput.nativeElement.value= ""
   }
   resetCreateTmp(){
    this.valid_arr =[]
       this.file_process_data2={}
       this.file_process_data={}
       this.fileUploaded = false
     this.frmCreateTemp.reset()
   }
 
   formData: FormData = new FormData();
  //  submitCreateTmp(){
  //    if(this.ecfType != 3 && this.ecfType != 13){
  //      if(this.frmCreateTemp.value.invoiceno == '' || this.frmCreateTemp.value.invoiceno == undefined || this.frmCreateTemp.value.invoiceno == null){
  //        this.notification.showError('Please Enter Invoice No.')
  //        return false
  //      }
  //      if(this.frmCreateTemp.value.invoicedate == '' || this.frmCreateTemp.value.invoicedate == undefined || this.frmCreateTemp.value.invoicedate == null){
  //        this.notification.showError('Please Select Invoice Date.')
  //        return false
  //      }
  //    }
  //    if(this.frmCreateTemp.value.totalamount == '' || this.frmCreateTemp.value.totalamount == undefined || this.frmCreateTemp.value.totalamount == null){
  //      this.notification.showError('Please Enter Invoice Amount.')
  //      return false
  //    }
  //    if(this.ecfType != 14 && this.frmCreateTemp.value.invoiceamount == '' || this.frmCreateTemp.value.invoiceamount == undefined || this.frmCreateTemp.value.invoiceamount == null){
  //      this.notification.showError('Please Enter Taxable Amount.')
  //      return false
  //    }
  //    if(this.valid_arr.length == 0){
  //      this.notification.showError('Please Upload File.')
  //      return false
  //    }
  //    this.frmCreateTemp.value.totalamount = String(this.frmCreateTemp.value.totalamount).replace(/,/g, '');
  //    this.frmCreateTemp.value.invoiceamount = String(this.frmCreateTemp.value.invoiceamount).replace(/,/g, '');
 
  //    let data = {
  //      "apheader_id": this.ecfhdrid,
  //      "invoiceno": this.ecfType !=3 && this.ecfType != 13 ? this.frmCreateTemp.value.invoiceno : '',
  //      "invoicedate": this.datePipe.transform(
  //                    this.ecfType !=3 && this.ecfType != 13 ? this.frmCreateTemp.value.invoicedate : new Date(), 'yyyy-MM-dd'),
  //      "invoiceamount": +this.frmCreateTemp.value.totalamount,
  //      "taxableamt": this.ecfType != 14 ? +this.frmCreateTemp.value.invoiceamount : +this.frmCreateTemp.value.totalamount,
  //      "file_key":[this.uploadFileTypes[0], this.uploadFileTypes[1], this.uploadFileTypes[2], this.uploadFileTypes[3] ]
  //      }
   
  //      for( let type of this.uploadFileTypes){
  //        this.formData.delete(type);
  //        let pairvalue = this.file_process_data[type];
  //        if (pairvalue!=undefined  && pairvalue!=""){
  //          for (let fileindex in pairvalue) {
  //            this.formData.append(type,this.file_process_data[type][fileindex])
  //          }
  //        }
  //      } 
  //    // this.formData.delete('file0');
  //    // let pairvalue = this.file_process_data['file0'];
  //    // if (pairvalue!=undefined  && pairvalue!=""){
  //    //   for (let fileindex in pairvalue) {
  //    //     this.formData.append('file0',this.file_process_data['file0'][fileindex])
  //    //   }
  //    // }
  //    this.formData.delete('data');    
  //    this.formData.append('data', JSON.stringify(data));
  //    this.SpinnerService.show()
  //    this.ecfservice.dynamicCreateECF(this.formData)
  //    .subscribe(result => {
  //      if (result?.status != "success") {
  //        this.notification.showError(result?.description)
  //        this.SpinnerService.hide()
  //        return false
  //      }
  //      else {
  //        this.resetCreateTmp()
  //        this.notification.showSuccess("Successfully ECF Created")
  //        this.summarysearch('',1)
  //        this.createTmpBack()
 
  //      }
  //    })
  //  }
     submitCreateTmp(){
    if(this.ecfType != 3 && this.ecfType != 13){
      if(this.frmCreateTemp.value.invoiceno == '' || this.frmCreateTemp.value.invoiceno == undefined || this.frmCreateTemp.value.invoiceno == null){
        this.notification.showError('Please Enter Invoice No.')
        return false
      }
      if(this.frmCreateTemp.value.invoicedate == '' || this.frmCreateTemp.value.invoicedate == undefined || this.frmCreateTemp.value.invoicedate == null){
        this.notification.showError('Please Select Invoice Date.')
        return false
      }
    }
    if(this.frmCreateTemp.value.totalamount == '' || this.frmCreateTemp.value.totalamount == undefined || this.frmCreateTemp.value.totalamount == null){
      this.notification.showError('Please Enter Invoice Amount.')
      return false
    }
    if(this.ecfType != 14 && this.frmCreateTemp.value.invoiceamount == '' || this.frmCreateTemp.value.invoiceamount == undefined || this.frmCreateTemp.value.invoiceamount == null){
      this.notification.showError('Please Enter Taxable Amount.')
      return false
    }
    if(this.valid_arr.length == 0){
      this.notification.showError('Please Upload File.')
      return false
    }
    this.frmCreateTemp.value.totalamount = String(this.frmCreateTemp.value.totalamount).replace(/,/g, '');
    this.frmCreateTemp.value.invoiceamount = String(this.frmCreateTemp.value.invoiceamount).replace(/,/g, '');

    let data = {
      "apheader_id": this.ecfhdrid,
      "invoiceno": this.ecfType !=3 && this.ecfType != 13 ? this.frmCreateTemp.value.invoiceno : '',
      "invoicedate": this.datePipe.transform(
                    this.ecfType !=3 && this.ecfType != 13 ? this.frmCreateTemp.value.invoicedate : new Date(), 'yyyy-MM-dd'),
      "invoiceamount": +this.frmCreateTemp.value.totalamount,
      "taxableamt": this.ecfType != 14 ? +this.frmCreateTemp.value.invoiceamount : +this.frmCreateTemp.value.totalamount,
      "file_key":[this.uploadFileTypes[0], this.uploadFileTypes[1], this.uploadFileTypes[2], this.uploadFileTypes[3] ]
      }
  
      for( let type of this.uploadFileTypes){
        this.formData.delete(type);
        let pairvalue = this.file_process_data[type];
        if (pairvalue!=undefined  && pairvalue!=""){
          for (let fileindex in pairvalue) {
            this.formData.append(type,this.file_process_data[type][fileindex])
          }
        }
      } 
    // this.formData.delete('file0');
    // let pairvalue = this.file_process_data['file0'];
    // if (pairvalue!=undefined  && pairvalue!=""){
    //   for (let fileindex in pairvalue) {
    //     this.formData.append('file0',this.file_process_data['file0'][fileindex])
    //   }
    // }
    this.formData.delete('data');    
    this.formData.append('data', JSON.stringify(data));
    this.SpinnerService.show()
    this.ecfservice.dynamicCreateECF(this.formData)
    .subscribe(result => {
      if (result?.status != "success") {
        this.notification.showError(result?.description)
        this.SpinnerService.hide()
        return false
      }
      else {
        this.resetCreateTmp()
        this.notification.showSuccess("Successfully ECF Created")
        this.SpinnerService.hide()
        this.summarysearch('',1)
        this.createTmpBack()

      }
    })
  }
 
   showCreateTempForm = false
  //  createTmpBack(){
  //   console.log(this.file_process_data)
  //   console.log(this.file_process_data2)
  //   if(this.showCreateTempForm){
  //     this.frmCreateTemp.reset()
  //     this.file_process_data={}
  //      this.file_process_data2={}
  //      this.fileUploaded = false
  //      this.closefrmtempCreate.nativeElement.click()
  //    }
  //    this.frmCreateTemp.reset()
  //    this.showCreateTempForm = false
  //  }
   createTmpBack(){
  if(this.showCreateTempForm){
    this.frmCreateTemp.reset()
    this.file_process_data={}
      this.file_process_data2={}
      this.fileUploaded = false
      this.closefrmtempCreate.nativeElement.click()
    }
    this.showCreateTempForm = false
  }
 uploadPopShow = false
 UploadPopupOpen(){
  console.log('this.file_process_data------------->>>>>>>>>>>' ,this.file_process_data)
  console.log('this.file_process_data2------------->>>>>>>>>>>' ,this.file_process_data2)
  console.log('this.valid------------->>>>>>>>>>>' ,this.valid_arr)
  this.showCreateTempForm = false
   this.closefrmtempCreate.nativeElement.click()
   this.uploadPopShow = true
 }
 
 fileUploaded = false
 fileUploadChk(): boolean{
   for(let i=0;i< this.uploadFileTypes.length; i++){
     if(this.file_process_data[this.uploadFileTypes[i]] != undefined ){
       if(this.file_process_data[this.uploadFileTypes[i]].length >0)
         return true
     }
   }
   return false
 }
 
 fileViewShow = false
//  FileViewOpen(){
//    console.log('this.file_process_data------------->>>>>>>>>>>' ,this.file_process_data)
//    console.log('this.file_process_data2------------->>>>>>>>>>>' ,this.file_process_data2)
//    console.log('this.valid------------->>>>>>>>>>>' ,this.valid_arr)
//    this.showCreateTempForm = false
//    this.closefrmtempCreate.nativeElement.click()
//    this.fileViewShow = true
//    console.log(this.valid_arr)
//    console.log(this.file_process_data)
//    console.log(this.file_process_data2)
//  }
FileViewOpen(){
  this.showCreateTempForm = false
  this.closefrmtempCreate.nativeElement.click()
  this.fileViewShow = true
}
 
 getFileDetails( e, filetype) {
   this.valid_arr =[]
   console.log('befor   this.file_process_data2------------->>>>>>>>>>>' ,this.file_process_data2)
 
   for (var i = 0; i < e.target.files.length; i++) {
     this.valid_arr.push(e.target.files[i]);
   }    
   if(this.file_process_data2[filetype] == undefined){
     this.file_process_data2[filetype]=this.valid_arr;
   }
   else if(this.file_process_data2[filetype] != undefined){
     if(this.file_process_data2[filetype].length ==0){
       this.file_process_data2[filetype]=this.valid_arr;
     }
     else{
       let Files = this.file_process_data2[filetype]
       for(let file of this.valid_arr){
         Files.push(file)
       }
       this.file_process_data2[filetype]=Files;
     }
   }
   for(let i=0; i< this.uploadFileTypes.length; i++){
     if(this.file_process_data2[this.uploadFileTypes[i]]?.length == 0)
       delete this.file_process_data2[this.uploadFileTypes[i]]
   }
   console.log('this.file_process_data2------------->>>>>>>>>>>' ,this.file_process_data2)    
 }
 deletefileUpload(i, type) {
   this.file_process_data[type].splice(i,1);
   this.frmCreateTemp.value.filevalue.splice(i, 1)
   console.log('this.file_process_data------------->>>>>>>>>>>' ,this.file_process_data)
   this.fileUploaded = this.fileUploadChk()
   
 }
 filedatas: any
 fileindex: any
 invhdrForm =''
 getfiledetails(datas, ind) {
   this.closefrmtempCreate.nativeElement.click()
   console.log("ddataas",datas)
   this.fileindex = ind
 }
   
 invNoFilter(event): boolean {
   const charCode = (event.which) ? event.which : event.keyCode;
   if (! ((charCode >= 47 && charCode <= 57) || (charCode >= 65 && charCode <= 90)
       || (charCode >= 97 && charCode <= 122) || charCode ==45 ) ) {
     return false;
   }
 }
 filterTexts(ctrl, ctrlname) {
   let text = String(ctrl.value).trim();
   for (let i = 0; i < text.length; i++) {
     let char = text.charAt(i)
     let charcode = text.charCodeAt(i)
     if ((charcode < 65 || charcode > 90) && (charcode < 96 || charcode > 122) && 
     (charcode < 48 || charcode > 57) && (charcode != 32)) {
       text = text.replace(char, "");
       i = i - 1
     }
   }
   if (ctrlname == "invoiceno") {
     this.frmCreateTemp.controls['invoiceno'].setValue(text)
   }
 }
 
 icrAccno(){
   let accno 
   accno = this.frmCreateTemp.controls['invoiceno'].value
   if(accno.length !=16)
   {
     this.notification.showWarning("Account No. should have 16 digits.")
     this.frmCreateTemp.controls['invoiceno'].setValue('')
   } 
 }
 onDateChange(event: any) {
   const ecfdate = new Date(this.frmCreateTemp?.value?.invoicedate); // Convert ecfdate to a Date object
   const selectedDate = new Date(event.value); // Set the selected date
 
   const sixMonthsAgo = new Date(ecfdate.getFullYear(), ecfdate.getMonth() - 6, ecfdate.getDate()); // Calculate the date six months before ecfdate
 
   // Set the time values to zero (optional if you want to compare dates only)
   selectedDate.setHours(0, 0, 0, 0);
   sixMonthsAgo.setHours(0, 0, 0, 0);
 
   if (selectedDate < sixMonthsAgo) {
     alert('Invoice Date is greater than six months');
   }
 }
 previousCharCode: any = 0
 charCode: any = 0
 getCharCode(e) {
   this.previousCharCode = this.charCode
   this.charCode = (e.which) ? e.which : e.keyCode;
 }
 invhdrTempChngeToCurrency(ctrl, ctrlname) {
 
   // console.log(this.previousCharCode , this.charCode)
   if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
     let a = ctrl.value;
     a = a.replace(/,/g, "");
 
     if (a && !isNaN(+a)) {
       let num: number = +a;
       // num = +(num.toFixed(2))
       let temp = new Intl.NumberFormat("en-GB", { style: "decimal" }).format(num);
       temp = temp ? temp.toString() : '';
         this.frmCreateTemp.controls[ctrlname].setValue(temp)
 
     }
 
   }
 }
 
 invhdramtDecimalChg(ctrl, ctrlname, i, frm : any =''){
   let amt = ctrl.value
   amt = amt.replace(/,/g, "");
 
   if(+amt >=0){
     let temp = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(amt);
     temp = temp ? temp.toString() : '';
     this.frmCreateTemp.controls[ctrlname].setValue(temp)
   }
 }
 invamount(section){
   
 
   let invamount 
   invamount= Number(String(section?.value).replace(/,/g, ''))
   
 
   // let taxableamount = Number(String(section?.value?.invoiceamount).replace(/,/g, ''))
   if(invamount <= 0)
   {
     this.notification.showWarning("Invoice amount should not be less than or equal to Zero")
     this.frmCreateTemp.controls['totalamount'].setValue(0)
   } 
   else  if(this.ecfType ==13 && this.cloneinvgst == "N"){
     let amt = section?.value
     this.frmCreateTemp.controls['invoiceamount'].setValue(amt)
   }
 }
 
 
 
 taxableAmount(e){
   let invgst = 'N'
   let totamt = this.frmCreateTemp.value?.totalamount
   if(this.ecfType ==13 && this.cloneinvgst == "N" )
     return false
   
   console.log("e.target.value",e)
   let invamount = Number(String(e).replace(/,/g, ''))
   let totamount = Number(String(totamt).replace(/,/g, ''))
   console.log("invamount",invamount)
   console.log("totamount",totamount)
   if(invamount >0)
   {
     if(invamount > totamount){
       this.notification.showWarning("Taxable Amount should not be greater than Invoice Amount")
       this.frmCreateTemp.controls['invoiceamount'].setValue(0)
 
       return false
     }
     if(this.cloneinvgst == "Y" && invamount == totamount){
       this.notification.showWarning("Invoice Amount and Taxable Amount Should not be same for GST Applicable Yes")
       this.frmCreateTemp.controls['invoiceamount'].setValue(0)
       return false
     } 
   }   
 }
 taxableAmount1()
 {
   
   let totamt = this.frmCreateTemp.value?.totalamount
   let invamt = this.frmCreateTemp.value?.invoiceamount
   if(this.ecfType ==13 && this.cloneinvgst == "N" )
     return false
   let invamount = Number(String(invamt).replace(/,/g, ''))
   let totamount = Number(String(totamt).replace(/,/g, ''))
   console.log("invamount",invamount)
   console.log("totamount",totamount)
   if(this.cloneinvgst == "N" && invamount != totamount ){
     this.notification.showWarning("Invoice amount and Taxable amount should be same ,if GST is not applicable")
     this.frmCreateTemp.controls['invoiceamount'].setValue(0) 
     return false
    }   
 }
 // Taxvalue = 0
 // headertaxableamount: any
 // Taxamount(e,index) {
 // let data = this.InvoiceHeaderForm?.value?.invoiceheader
 // for (let i in data) {
 //   this.headertaxableamount = Number(data[i]?.invoiceamount)
 // }
 // if (e > this.headertaxableamount) {
 //   this.Taxvalue = 0
 //   this.toastr.warning("Tax Amount should not exceed taxable amount");
 //   this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('taxamount').setValue(0)
 //   return false
 // }
 // }
 
 // taxableAmount(e,index,section,frm : any=''){
 // let invgst = frm == '' ? section.value.invoicegst : this.selectedTemp?.invoicegst
 // let totamt = frm == '' ? section.value.totalamount : this.frmInvHdrDet.value?.totalamount
 // if(this.ecfType ==13 && invgst == "N" )
 //   return false
 // console.log("ttamount",section.value)
 // console.log("e.target.value",e)
 // let invamount = Number(String(e).replace(/,/g, ''))
 // let totamount = Number(String(totamt).replace(/,/g, ''))
 // console.log("invamount",invamount)
 // console.log("totamount",totamount)
 // if(invamount >0)
 // {
 //   if(invamount > totamount){
 //     this.notification.showWarning("Taxable Amount should not be greater than Invoice Amount")
 //     if(frm == '')
 //       this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceamount').setValue(0)
 //     else
 //       this.frmInvHdrDet.controls['invoiceamount'].setValue(0)
 //     return false
 //   }
 //   if(invgst == "Y" && invamount == totamount){
 //     this.notification.showWarning("Invoice Amount and Taxable Amount Should not be same for GST Applicable Yes")
 //     if(frm == '')
 //       this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceamount').setValue(0)
 //     else
 //       this.frmInvHdrDet.controls['invoiceamount'].setValue(0)
 //     return false
 //   } 
 // }   
 // }
 

 getreptype(){
    this.ecfservice.getreptype({'classification' :'ECF'})
    .subscribe(result => {
      if (result['data'] != undefined) {
        this.reportList = result["data"]
      }
    }, error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
  }
  timer:any
count1:number=60
isRunning: boolean = false;
startCountdown(event?: Event) {
  if(this.ECFReportSummaryForm == true){
  if (event) event.preventDefault();
  if (this.isRunning) {
    return;
  }
  this.isRunning = true;
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
dooTodate=new Date()
dooFromdate =new Date()
rptSummaryDateChange() {
  const from_date = new Date(this.frmECFReportSummary?.value?.from_date);
  this.dooFromdate = from_date;
  let oneMonthLater = new Date(from_date.getFullYear(), from_date.getMonth() + 1, from_date.getDate());
  const today = new Date();
  if (oneMonthLater > today) {
    oneMonthLater = today;
  }
  // oneMonthLater.setHours(0, 0, 0, 0);
  // this.dooTodate = oneMonthLater;
}


rep_value:any;
// generate_report(page){
//   this.rep_value = {"classification":"ECF"} 
//   if(this.frmECFReportSummary){
//     this.rep_value =this.frmECFReportSummary.value  
//     if(this.rep_value.report_type == '' || this.rep_value.report_type == undefined || this.rep_value.report_type == null){
//       this.notification.showError('Please Select Report Type')
//       return
//     }
//     if(this.rep_value.from_date == '' || this.rep_value.from_date == undefined || this.rep_value.from_date == null ||
//       this.rep_value.to_date == '' || this.rep_value.to_date == undefined || this.rep_value.to_date == null)
//     {
//       this.notification.showError('Please Select From Date and To Date')
//       return
//     }
//     if(this.rep_value.from_date !=  '' && this.rep_value.to_date == ''){
//       this.notification.showWarning("Please Select To Date")
//       return false
//     }
//     if(this.rep_value.from_date ==  '' && this.rep_value.to_date != ''){
//       this.notification.showWarning("Please Select From Date")
//       return false
//     }
//   this.rep_value.from_date = this.datePipe.transform(this.rep_value.from_date, 'yyyy-MM-dd') != null ? this.datePipe.transform(this.rep_value.from_date, 'yyyy-MM-dd') : ""
//   this.rep_value.to_date = this.datePipe.transform(this.rep_value.to_date, 'yyyy-MM-dd') != null ? this.datePipe.transform(this.rep_value.to_date, 'yyyy-MM-dd') : ""
  
//   for (let i in this.rep_value) 
//     {
//         if (this.rep_value[i] === null || this.rep_value[i] === "") {
//           delete this.rep_value[i];
//         }
//       }    
//     }
//   else{
//     this.rep_value={}
//   }
//   this.SpinnerService.show()
//   if (page == 1) {
//     this.pageIndex_rep = 0;
//   }
//   if(this.enable_ddl == false )
//     {
//       this.rep_value.branchdetails_id = this.branchrole.id;
//     }
//     else if((this.rep_value.branchdetails_id != undefined && this.rep_value.branchdetails_id != null && this.rep_value.branchdetails_id !='')
//             && this.enable_ddl)
//       {
//         this.rep_value.branchdetails_id = this.rep_value.branchdetails_id.id;
//       }
//     else
//     {
//       delete this.rep_value.branchdetails_id 
//     }
    
//   this.ecfservice.ECFRptSummarydownload(this.rep_value).subscribe((results) =>{
//     if(results.status == 'success'){
//        this.notification.showSuccess(results?.message)
//        this.SpinnerService.hide()
//        this.get_Summary(1)
//     }
//     else if(results.status == 'failed'){
//       this.notification.showSuccess(results?.description)
//       this.SpinnerService.hide()
//       // this.get_Summary(1)
//    }
//     else{
//       this.notification.showError(results?.description)
//       this.SpinnerService.hide()
//     }
//   },
// error =>{
//   this.errorHandler.handleError(error)
//   this.SpinnerService.hide()
// })
 
// }
generate_report(page){
  this.rep_value = {"classification":"ECF"} 
  if(this.frmECFReportSummary){
    this.rep_value =this.frmECFReportSummary.value  
    if(this.rep_value.report_type == '' || this.rep_value.report_type == undefined || this.rep_value.report_type == null){
      this.notification.showError('Please Select Report Type')
      return
    }
    if(this.rep_value.from_date == '' || this.rep_value.from_date == undefined || this.rep_value.from_date == null ||
      this.rep_value.to_date == '' || this.rep_value.to_date == undefined || this.rep_value.to_date == null)
    {
      this.notification.showError('Please Select From Date and To Date')
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
  
  this.rep_value.supplier_id =this.frmECFReportSummary.value?.supplier_id?.id
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
  if(this.enable_ddl == false )
    {
      this.rep_value.branchdetails_id = this.branchrole.id;
    }
    else if((this.rep_value.branchdetails_id != undefined && this.rep_value.branchdetails_id != null && this.rep_value.branchdetails_id !='')
            && this.enable_ddl)
      {
        this.rep_value.branchdetails_id = this.rep_value.branchdetails_id.id;
      }
    else
    {
      delete this.rep_value.branchdetails_id 
    }
    
  this.ecfservice.ECFRptSummarydownload(this.rep_value).subscribe((results) =>{
    if(results.status == 'success'){
       this.notification.showSuccess(results?.message)
       this.SpinnerService.hide()
       this.get_Summary(1)
    }
    else if(results.status == 'failed'){
      this.notification.showSuccess(results?.description)
      this.SpinnerService.hide()
      // this.get_Summary(1)
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

// ECFRptSummarydownload(value) {
//   let search = this.frmECFReportSummary.value
//   search.report_type = search?.report_name
//   let type = search?.report_type
//   // for (let i in search) {
//   //   if (search[i] === null || search[i] === "") {
//   //     delete search[i];
//   //   }
//   // }
//   this.SpinnerService.show()
//   this.ecfservice.apRptSummarydownload1(value?.file_id)
//   .subscribe((results) => {
//     this.SpinnerService.hide()
//     if (results.type == "application/json") {
//       this.toastr.warning('Failed', 'Report Download')
//       return false
//     }
//     let binaryData = [];
//     binaryData.push(results)
//     let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
//     let link = document.createElement('a');
//     link.href = downloadUrl;
//     link.download = "ECF " + type;
//     link.click();
//   },
//     error => {
//       this.errorHandler.handleError(error);
//       this.SpinnerService.hide();
//     }

//   )
// }
ECFRptSummarydownload(value) {
  let search = this.frmECFReportSummary.value
  search.report_type = value?.report_name
  let type = search?.report_type
  // for (let i in search) {
  //   if (search[i] === null || search[i] === "") {
  //     delete search[i];
  //   }
  // }
  this.SpinnerService.show()
  this.ecfservice.apRptSummarydownload1(value?.file_id)
  .subscribe((results) => {
    this.SpinnerService.hide()
    if (results.type == "application/json") {
      this.toastr.warning('Failed', 'Report Download')
      return false
    }
    let binaryData = [];
    binaryData.push(results)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    link.download = "ECF " + type.replace(/ /g, "_") +".xlsx" ;
    link.click();
  },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }

  )
}
generate_btn_disable: boolean = false
DooScoreSummary: any;
get_Summary(page){
  let data = {
    "classification": "ECF",
    "branchdetails_id": this.branchrole?.id
  }
  
  this.ecfservice.getrepSummary(data,page,this.ecf_report_sub_module_name).subscribe((results) =>{
    if(results != undefined){
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
    let datapagination = results["pagination"];
        this.length_rep = datapagination?.count
        
        if (this.DooScoreSummary.length > 0) {
          this.presentpagerep = datapagination.index;
        }
        else
        {
        this.length_rep = 0;
        }
    }   
  },
error =>{
  this.errorHandler.handleError(error)
  this.SpinnerService.hide()
})
}

resetDooScore(){
  this.frmECFReportSummary.reset()
  this.frmECFReportSummary.controls['branchdetails_id'].setValue(this.branchrole)
  this.get_Summary(1)
  this.handleReportSearchPageEvent({pageIndex:0,pageSize:10,length:this.length_rep} as PageEvent)
}
length_rep = 0;
pageIndex_rep = 0;  
pageSize_rep=10;
presentpagerep: number=1
handleReportSearchPageEvent(event: PageEvent) {
    this.length_rep = event.length;
    this.pageSize_rep = event.pageSize;
    this.pageIndex_rep = event.pageIndex;
    this.presentpagerep=event.pageIndex+1;
    this.get_Summary(this.presentpagerep)
    
  }

   ecfreportsearch(e) {
    let payloadbodydata = {
    report_type:"",
    from_date:"",
    to_date:"",
    branchdetails_id:""
    };
    let branchpayloadbodydata = { ...payloadbodydata, ...e };
    this.SummaryApiecfwiseObjNew = { method: "post", url: this.url + "ecfapserv/ecf_common_report", params:  "&submodule="+this.ecf_inventory_sub_module_name, data: branchpayloadbodydata }
  }

  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

 

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.frmInvHdr.get('notename').value);
  }


  editorDisabled = true;
  enableEditor() {
    this.editorDisabled = false;
  }

    disableEditor() {
    this.editorDisabled = true;
  }

  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }
  onFileSelected(e) { }
  // overallreset(){
  // console.log("Reset button clicked");
  // if (this.summaryBoxComponent?.resetAllFilters) {
  //   this.summaryBoxComponent.resetAllFilters();
  // }
  // }
  overallreset() {
    console.log("Reset button clicked");
    if (this.summaryBoxComponent) {
      this.summaryBoxComponent.resetAllFilters();
    } else {
      setTimeout(() => {
        if (this.summaryBoxComponent) {
          this.summaryBoxComponent.resetAllFilters();
        }
      });
    }
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
  
selectedDetail:any
is_component = false
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