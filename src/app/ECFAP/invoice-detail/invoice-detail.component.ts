import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList,ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, FormControlDirective, Validators } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import { EcfapService } from '../ecfap.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../../service/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { fromEvent, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ErrorHandlingService } from '../error-handling.service';
// import { async } from '@angular/core/testing';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import {PageEvent} from '@angular/material/paginator'
import { DomSanitizer } from '@angular/platform-browser';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { MatCheckboxChange } from '@angular/material/checkbox';

export interface paymodelistss {
  code: string;
  id: string;
  name: string;
}

export interface debbanklistss {
  bankbranch: { bank: { name: string } }
  account_no: string;
  id: string;
  accountholder: string;
}

export interface commoditylistss {
  id: string;
  name: string;
}

export interface branchListss {
  id: any;
  name: string;
  code: string;

}

export interface prodlistss {
  code: any;
  id: any;
  name: string;
  uom_id: {
    code: any,
    id: any,
    name: string
  }
}

export interface hsnlistss {
  id: any;
  name: string;
  code: string;
}

export interface uomlistss {
  id: any;
  name: string;
  code: string;
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


export interface productcodelists {
  id: string;
  bsproduct_code: string;
  bsproduct_name: string;
}

export interface SupplierName {
  id: number;
  name: string;
}

export interface taxtypefilterValue {
  id: number;
  subtax: { id: any, name: any, glno: any };
  taxrate: number;
}

export interface paytofilterValue {
  id: string;
  text: string;
}
export interface ppxfilterValue {
  id: string;
  text: string;
}

export interface OriginalInv {
  id: string;
  text: string;
}

export interface cred {
  id: string;
  text: string;
}

export interface approverListss {
  id: string;
  name: string;
  limit: number;
}

export interface PCAlists {
  amount: number;
  balance_amount: number;
  pca_no: string;
}

interface DisplayItem {
  label: string;
  value: string;
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
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe, DecimalPipe
  ]
})
export class InvoiceDetailComponent implements OnInit {
  fromecf = false
  showheaderdata = true
  showinvocedetail = false

  ecfheaderForm: FormGroup
  TypeList: any
  commodityList: Array<commoditylistss>
  uploadList = [];
  images: string[] = [];
  // @ViewChild('takeInput', { static: false })
  @ViewChild('fileInput') fileInput;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closedPobuttons') closedPobuttons;
  @ViewChild('addcomponentbuttons')addcomponentbuttons;
  @ViewChild('fileuploadBack') fileuploadBack;
  @ViewChild('uploadclose') uploadclose;
  @ViewChild('ap_approval_closebtn') ap_approval_closebtn;
  @ViewChild('fileclosedbuttons') fileclosedbuttons;
  InputVar: ElementRef;
  ppxList: any
  advancetypeList: any
  payList: any
  isLoading = false;
  attachmentlist: any
  showppxmodal = false
  ppxLoad = true
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  showppx = false
  showpayto = false
  showsupptype = true
  showadvance = false
  showgstapply = false
  showgsttt = true
  inveditFlag = false
  SupptypeList: any
  ecfheaderid: any
  aptypeid: any
  paytoid: any
  ppxid: any
  tomorrow = new Date();
  showviewinvoice = false
  showviewinvoices = false
  showeditinvhdrform = true
  showaddbtn = false
  showaddbtns = true
  disableinvhdrsave = false
  invheadersave = false
  showadddebits = false
  showadddebit = true
  invdtlsave = false
  showdebitpopup = true
  showccbspopup = true
  showPOdiv: boolean = false;

  showtaxtypes = [true, true, true, true, true, true, true, true, true]
  showtaxrates = [true, true, true, true, true, true, true, true, true]
  showaddinvheader = false
  hideinv = false
  darefile: any = []
  ecffile:any =[]
  fullfile: any = []
  grnfile: any = []
  file_name:any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onBounce = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onApproveBack = new EventEmitter<any>();
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('pcaAutocomplete') pcaAutocomplete: MatAutocomplete;
  @ViewChild('pcaInput') pcaInput: any;
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  trueorfalse = [{ 'value': true, 'display': 'True' }, { 'value': false, 'display': 'False' }]
  PCAYesorno = [{ 'id': 1, 'display': 'YES' }, { 'id': 0, 'display': 'NO' }]
  ecf_field: any
  pca_field: any
  commodity_name: any = { label: "Commodity Name" }
  Recurring_type_field: any
  Recurring_type_field2: any
  Recurring_field: any
  // ecftypedata =[
  //   {id:2,text:"NON PO"},
  //   {id:3,text:"EMP REIMB"},
  //   {id:4,text:"ADVANCE"},
  //   {id:8,text:"TCF"},
  //   {id:6,text:"SLI"},
  //   {id:7,text: "CRN"},
  //   {id:11,text: "TAF"},
  //   {id:17,text:"DTPC"},
  //   {id:15,text:"RENT"},
  //   {id:9,text:"SGB"},
  //   {id:13,text:"PETTYCASH"},
  //   {id:14,text:"ICR"},
  //   {id:18,text:"BRE"},
  //   {id:19,text:"LOF"},
  //   {id:20,text:"PVF"},
  //   ]
  showinvoicediv = true

  showdebitdiv = false
  OverallForm: FormGroup

  SelectSupplierForm: FormGroup
  SupplierCode: string;
  SupplierGSTNumber: string;
  SupplierPANNumber: string;
  Address: string;
  City: string;
  line1: any;
  line2: any;
  line3: any;
  default = true
  alternate = false
  JsonArray = []
  submitbutton = false;
  suplist: any
  inputSUPPLIERValue = "";
  supplierNameData: any;
  selectsupplierlist: any;
  gstyesno: any
  supplierid: any
  supp: any
  supplierindex: any
  stateid: any
  Invoicedata: any
  date: any
  ecfid: any
  invoiceno: any
  invheaderdata: any
  invoiceheaderres: any
  ivoicehid: any
  @Output() linesChange = new EventEmitter<any>();
  @ViewChild('Suppliertype') matsupAutocomplete: MatAutocomplete;
  @ViewChild('suppInput') suppInput: any;
  SupplierName: any
  toto: any
  amt: any
  sum: any
  AddinvDetails = true
  delinvid: any
  getsuplist: any
  discreditbtn = false
  supplierdata: any
  //declaration sugu
  // invHdrID=56;
  type1 = ['exact',
    'supplier',
    'invoice_amount',
    'invoiceno',
    'invoice_date']


  typeid: number;
  data: any = [];
  array: any = [{ "auditchecklist": [] }];
  bo: any = [];
  invoicedate: any;
  sta = 3;
  cli: boolean = false;
  remark: any;
  rem = new FormControl('');
  purpose = new FormControl('');
  showthreshold = false
  // Approverlist: Array<approverListss>;
  // Branchlist: Array<branchListss>;
  SubmitoverallForm: FormGroup

  submitoverallbtn = false
  ECFData: any
  tdsList: any
  // @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  // @ViewChild('branchInput') branchInput: any;
  // @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  // @ViewChild('approverInput') approverInput: any;
  auditflage: boolean = false;
  dedupflage: boolean = false;
  invoiceheaderdetailForm: FormGroup
  InvoiceDetailForm: FormGroup
  POInvoiceDetailForm: FormGroup
  gstchecked: boolean
  invhedsaved: boolean = true
  creditdetForm: FormGroup
  payInstr_len = 60
  prodList: Array<prodlistss>
  hsnList: Array<hsnlistss>
  uomList: Array<uomlistss>
  @ViewChild('hsntype') mathsnAutocomplete: MatAutocomplete;
  @ViewChild('productInput') productInput: any;
  @ViewChild('productPoInput')productPoInput:any
  @ViewChild('prodAutocom') matProdAutocomplete: MatAutocomplete;
   @ViewChild('PoprodAutocom') matpoProdAutocomplete: MatAutocomplete;
  @ViewChild('hsnInput') hsnInput: any;
  @ViewChild('uomtype') matuomAutocomplete: MatAutocomplete;
  @ViewChild('uomInput') uomInput: any;
  @ViewChild('taxtype') mattactypeAutocomplete: MatAutocomplete;
  @ViewChild('taxtypeInput') taxtypeInput: any;
  @ViewChild('closeglbutton') closeglbutton;
  hsncodess: any
  totaltax: any
  indexDet: any
  invoicedetailsdata: any
  ccbsdata: any
  ccbspercentage: any
  AdddebitDetails = true
  INVsum: any
  INVamt: any
  totalamount: any
  totaltaxable: any
  overalltotal: any
  igstrate: any
  cgstrate: any
  sgstrate: any
  gsttype: any
  type: any

  ecfheaderidd: any


  creditglForm: FormGroup
  accDetailList: any
  accList: any
  showaccno = [false, false, false, false, false, false, false, false, false]
  creditbrnchList: any
  credittranList: any
  showtranspay = [false, false, false, false, false, false, false, false, false]
  showtaxtype = [false, false, false, false, false, false, false, false, false]
  showtaxrate = [false, false, false, false, false, false, false, false, false]
  showeraacc = [false, false, false, false, false, false, false, false, false]
  readonlydebit = [false, false, false, false, false, false, false, false, false]
  // splitdebit = [false, false, false,false, false, false,false, false, false]
  showkvbacc = [false, false, false, false, false, false, false, false, false]
  showglpopup = false
  showglpopup2 = false
  showkvbacpopup = false

  glList: any
  taxlist: any
  taxratelist: any
  taxrate: number = 0

  getcredit = true
  paymodesList: any

  PaymodeList: any
  payableSelected = false
  debbankList: any
  addcreditindex: any
  @ViewChild('debitclosebtn') debitclosebtn;
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttons') closebuttons;
  @ViewChild('closebuttonsgl') closebuttonsgl;
  @ViewChild('creditbuttonclose') creditbuttonclose;
  @ViewChild('ccbsOpen') ccbsOpen;
  @ViewChild('supclosebuttons') supclosebuttons;

  @ViewChild('ccbsclose') ccbsclose;
  @ViewChild('auditclose') auditclose;


  @ViewChild('paymode_id') matpaymodeAutocomplete: MatAutocomplete;
  @ViewChild('paymodeInput') paymodeInput: any;
  @ViewChild('debbank') matdebbankAutocomplete: MatAutocomplete;
  @ViewChild('debbankInput') debbankInput: any;


  // @ViewChild('cattype') cattype: MatAutocomplete;
  // @ViewChild('cattype1') matcatAutocomplete1: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  // @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('producttype') matproductAutocomplete: MatAutocomplete;
  @ViewChild('bsproductInput') bsproductInput: any;
  // @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  // @ViewChild('bstype1') matbsAutocomplete1: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  // @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('closeppxbutton') closeppxbutton;
  @ViewChild('closeppxbuttoncrn')closeppxbuttoncrn;
  @ViewChild('LiqConfirmClose') LiqConfirmClose;
  @ViewChild('uploadinput') uploadinput: any;
  @ViewChild('branchCd') matBrAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;


  @ViewChild('closecrnbutton') closecrnbutton;
  @ViewChild('closekvbbutton') closekvbbutton;

  // inwardHdrNo = this.shareservice.inwardHdrNo.value

  DebitDetailForm: FormGroup
  ccbsForm: FormGroup
  categoryNameData: Array<catlistss>;
  categoryData: Array<catlistss>;

  subcategoryNameData: Array<subcatlistss>;
  bsNameData: Array<bslistss>;
  ccNameData: Array<cclistss>;
  businesslist: Array<productcodelists>
  catid: any
  bssid: any
  brList: Array<branchListss>
  name: any;
  designation: any;
  branch: any;

  SGST = false
  CGST = false
  IGST = false
  invoicenumber: any
  value: any
  invtotamount: any
  invtaxamount: any
  invtaxableamount: any
  invdate: any
  invgst: any
  raisorbranchgst: any
  inputSUPPLIERgst: any
  LiqConfirmPopup = false
  ContinueCreditSave = false
  payment: any
  bank_br: any
  tdsappl: any

  showsuppname = true
  showsuppgst = true
  showsuppstate = true
  ppxdata: any
  ppxForm: FormGroup
  raisedbyid: any
  raisercode: any


  originalInv: Array<OriginalInv>;
  @ViewChild('OriginalInvInput') OrgInvInput: any;
  @ViewChild('isOriginalInv') OriginalInvAutoComplete: MatAutocomplete;

  apHdrRes: any
  invHdrRes: any;
  invDetailList: any;
  invDebitList: any;
  invDebitTot: number;
  invCreditList: any;
  invCreditTot: number;
  getgstapplicable: any
  gstAppl: boolean

  // apheader_id=this.shareservice.apheader_id.value;
  apinvHeader_id = this.shareservice.invheaderid.value;
  ecfcrno = this.shareservice.crno.value;
  po_no = this.shareservice.po_no.value;
  crno: any;
  apheader_id = 1
  frmInvHdr: FormGroup;
  getinvoiceheaderresults: any
  creditid: any;
  invDetails: any = {}
  invDet: any
  invCredDet: any
  quelength: any;
  invdtlsaved: boolean = false
  debitsaved: boolean = false
  creditsaved: boolean
  ccbssaved: boolean = false
  // viewtrnlist: any = [];
  supplierGSTflag: boolean
  supplierGSTType: string
  productRCMflag = false
  invdtls: any

  crnglForm: FormGroup
  crnForm: FormGroup
  POInvoiceForm: FormGroup
  showgrnpopup = false
  crnLoad = true
  crndata: any
  showcrnmodal = false
  showcrnnotify = false
  SupplierDetailForm: FormGroup
  showpetty: boolean = false;
  invsupplierdataindex: any;
  inputGstValue = "";
  kvbaccForm: FormGroup;
  modificationFlag: any
  ecfhdrid: any
  noteddview:any;
  approverList: Array<approverListss>;
  @ViewChild('appInput') appInput: any;
  @ViewChild('approver') matappAutocomplete: MatAutocomplete;
  @ViewChild('brInput') brInput: any;
  @ViewChild('branchmatAuto') branchmatAuto: MatAutocomplete;
  currentpageapp: any = 1
  has_nextapp: boolean = true
  has_previousapp: boolean = true
  movedata: any
  OverallAPForm: FormGroup
  APapprovesubmitform: FormGroup
  tdslist: any
  hdrAuditFlag = [false, false, false, false, false];
  hdrDedupeFlag = [false, false, false, false, false];
  // @ViewChildren('fileInput') fileInput: QueryList<ElementRef>;
  taxableinvoiceamount: any;
  RecurYesorno = [{ 'value': 1, 'display': 'YES' }, { 'value': 0, 'display': 'NO' }]
  changesInAP = false
  viewrsrEmp: string;
  viewrsrBr: any;
  viewbranchGST: any;
  viewpmd: any;
  viewecftype: any;
  viewremarks: any;
  viewinvoiceno: any;
  viewinvoicedate: any;
  viewtotalamount: string;
  viewinvoiceamount: string;
  viewcommodity_id: any;
  viewsupplier: string;
  viewsuppliergst: any;
  viewstatus: any;
  viewphysical_verif: any;
  viewis_pca: any;
  viewpca_no: any;
  viewis_recur: any;
  viewservice_type: any;
  viewrecur_fromdate: any;
  viewrecur_todate: any;
  view_invoicegst: string;
  view_is_captalized: string;
  viewecftypeText: string;
  SummaryApipreviouslyAttechedFilesObjNew: any;
  SummaryApiCurrentlyAttechedFilesObjNew: any;
  packageattacheFile: any;
  credit_GL: any;
  ecfURL = environment.apiURL;
  disableppx: boolean
  tdsapplicable1: any = {
    label: "Is TDS Applicable",
    method: "get",
    url: this.ecfURL + "ecfapserv/get_yes_or_no_dropdown",
    params: "&type=tds",
    displaykey: "text",
    formcontrolname: 'is_tds_applicable',
    required: true,
    valuekey: 'id',
    id: "invoice-detail-0106"
    //  id:"invoice-detail-0107"
  }
  paywholedata: any;
  edit_credit_gl: any;
  resettds1: any[];
  resettds: any[];
  choosed_tds_value: any;
  uploadFileTypes = ['Invoice', 'Email', 'Supporting Documents', 'Others']
  displayData: DisplayItem[] = []
  view_is_captilized: string;
  remarks_heading: string;
  submit_approver: number;
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
    id: "invoice-detail-0280"
  };
  choose_supplier_field_1: any = {
    label: "Choose Supplier",
    searchkey: "name",
    displaykey: "name",
    wholedata: true,
    required: true,
    formcontrolname: "name",
    id: "invoice-detail-0281"
  };
  searchvar: any
  url = environment.apiURL
  view_gst_key_in: string;
  view_prepaid_expense: string;
  view_captalisedflag: string;
  creditrefno:any;
  apcheckermodify:any
  constructor(private service: EcfapService, private router: Router, private formBuilder: FormBuilder, private toastr: ToastrService, public datepipe: DatePipe,
    private shareservice: ShareService, private spinner: NgxSpinnerService, private notification: NotificationService, private errorHandler: ErrorHandlingService,
    private activatedroute: ActivatedRoute, private decimalpipe: DecimalPipe,public sanitizer:DomSanitizer, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.movedata = this.shareservice.detailsview.value
    this.modificationFlag = this.shareservice.modificationFlag.value
    this.isCaptalized = this.shareservice.captalised.value
    this.apcheckermodify = this.shareservice.apmodification.value
    console.log("mf---->", this.modificationFlag)
    this.ecfhdrid = this.shareservice.ecfheaderedit.value
    let pos = {

      "code": "1903",
      "codename": "(1903) EXPENSES MANAGEMENT CELL",
      "fullname": "(1903) EXPENSES MANAGEMENT CELL",
      "id": 259,
      "name": "EXPENSES MANAGEMENT CELL"

    }
    if (this.movedata != 'apapproverview') {
      this.getbranchrole();
    }

    this.frmInvHdr = this.formBuilder.group({
      rsrCode: new FormControl(''),
      rsrEmp: new FormControl(''),
      gst: new FormControl(''),
      branchGST: new FormControl(''),
      rsrBr: new FormControl(''),
      supplier: new FormControl(''),
      supGST: new FormControl(''),
      status: new FormControl(''),
      ecftype: new FormControl(''),
      invNo: new FormControl(''),
      invDate: new FormControl(''),
      taxableAmt: new FormControl(''),
      invAmt: new FormControl(''),
      commodity: new FormControl(''),
      commodity_id: new FormControl(''),
      mep_no: new FormControl(''),
      physical_verif: new FormControl(''),
      remarks: new FormControl(''),
      prepaid_expense: new FormControl(''),
      gst_keyin: new FormControl(''),
      id: new FormControl(),
      suppname: new FormControl(),
      suppstate: new FormControl(),
      invoiceno: new FormControl(),
      credit_refno: new FormControl(''),
      msme:new FormControl(''),
      msme_reg_no:new FormControl(''),
      invoicedate: new FormControl(''),
      invoiceamount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(),
      otheramount: new FormControl(0),
      roundoffamt: new FormControl(0),
      invtotalamt: new FormControl(0),
      apheader_id: new FormControl(0),
      dedupinvoiceno: new FormControl(0),
      supplier_id: new FormControl(''),
      suppliergst: new FormControl(''),
      supplierstate_id: new FormControl(''),
      raisorbranchgst: new FormControl(''),
      invoicegst: new FormControl(''),
      place_of_supply: new FormControl(pos),
      branchdetails_id: new FormControl(this.branchdata),
      pmd: new FormControl(''),
      bankdetails_id: new FormControl(1),
      entry_flag: new FormControl(0),
      barcode: new FormControl(''),
      creditbank_id: new FormControl(1),
      manual_gstno: new FormControl(''),
      captalisedflag: new FormControl(''),
      manualsupp_name: new FormControl(''),
      filevalue: new FormArray([]),
      file_key: new FormArray([]),
      filekey: new FormArray([]),
      filedataas: new FormArray([]),
      debitbank_id: new FormControl(''),
      apinvoiceheader_crno: new FormControl(''),
      invoicestatus: new FormControl('DRAFT'),
      is_tds_applicable: new FormControl(''),
      paymentinstrctn: new FormControl(''),
      edit_flag: new FormControl(''),
      is_recur: new FormControl(0),
      service_type: new FormControl(1),
      recur_fromdate: new FormControl(""),
      recur_todate: new FormControl(''),
      is_pca: new FormControl(0),
      pca_no: new FormControl(''),
      pca_name: new FormControl(''),
      pca_bal_amt: new FormControl(''),
      refinv_crno:new FormControl(''),
      // notename: [''],
      notename: new FormControl(''),

    })
    this.POInvoiceDetailForm =this.formBuilder.group({
      podetls: this.formBuilder.array([])
    })
    this.pca_field = {
      label: "Is PCA",
      fronentdata: true,
      data: this.PCAYesorno,
      displaykey: "display",
      valuekey: "id",
      formcontrolname: "is_pca",
      id: "invoice-detail-0040",
    }
    this.ecf_field = {
      label: "ECF Type",
      fronentdata: true,
      data: this.TypeList,
      displaykey: "text",
      // Outputkey: "id",
      valuekey: "id",
      formcontrolname: "ecftype",
      id: "invoice-detail-0028",
    }
    this.Recurring_type_field = {
      label: "Recurring Type",
      fronentdata: true,
      data: this.RecurringTypes,
      displaykey: "text",
      valuekey: "id",
      formcontrolname: "service_type",
      id: "invoice-detail-0043",
    }
    this.Recurring_type_field2 = {
      label: "Recurring Type",
      fronentdata: true,
      data: this.RecurringTypes1,
      displaykey: "text",
      valuekey: "id",
      formcontrolname: "service_type",
      id: "invoice-detail-0044",
    }
    this.Recurring_field = {
      label: "Is Recurring",
      fronentdata: true,
      data: this.RecurYesorno,
      displaykey: "display",
      // Outputkey: "id",
      valuekey: "value",
      formkey: "value",
      formcontrolname: "is_recur",
      id: "invoice-detail-0028",
    }
    this.InvoiceDetailForm = this.formBuilder.group({
      roundoffamt: [''],
      otheramount: [0],
      invoicedtls: new FormArray([
      ]),

      creditdtl: new FormArray([
      ]),
      payment_instruction: [''],
      is_tds_applicable: ['']
    });


    this.SupplierDetailForm = this.formBuilder.group({
      invoiceno: [''],
      invoicedate: [''],
      supplier_name: [''],
      suppliergst: [''],
      pincode: [''],
      address: ['']
    })
    this.POInvoiceForm = this.formBuilder.group({
      poheader: new FormArray([
      ]),
    })


    this.creditdetForm = this.formBuilder.group({
      supName: new FormControl(''),
      isexcempted: new FormControl(''),
      TDSSection: new FormControl(''),
      TDSRate: new FormControl(''),
      thresholdValue: new FormControl(''),
      amountPaid: new FormControl(''),
      normaltdsRate: new FormControl(''),
      balThroAmt: new FormControl(''),
      debitbank_id: new FormControl(''),
      payment_instruction: [''],
      is_tds_applicable: [''],
      startdate: new FormControl(''),
      enddate: [''],

    }),

      this.DebitDetailForm = this.formBuilder.group({

        debitdtl: new FormArray([
        ])
      });

    this.ccbsForm = this.formBuilder.group({

      ccbsdtl: new FormArray([
      ])
    })


    this.creditglForm = this.formBuilder.group({
      name: [''],
      glnum: [''],
      category_code: [''],
      subcategory_code: [''],
      bs_code: [''],
      cc_code: [''],

    })

    this.kvbaccForm = this.formBuilder.group({
      accno: [''],
      confirmaccno: ['']
    })

this.crnglForm = this.formBuilder.group({
  crnglArray: this.formBuilder.array([
    this.getcrndetails()
  ])
});


    this.crnForm = this.formBuilder.group({
      crndtl: new FormArray([
      ])
    })

    this.ppxForm = this.formBuilder.group({
      ppxdtl: new FormArray([
      ]),
      crndtl:new FormArray([])
    })

    this.OverallForm = this.formBuilder.group({
      branch_id: [''],
      batch_wise: ['Y'],
      approvedby: [''],
      // payment_instruction:[''],
      // is_tds_applicable:['']
    })

    this.SelectSupplierForm = this.formBuilder.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']
    })
    this.OverallAPForm = this.formBuilder.group({
      remarks: ['']
    })
    // this.spinner.show();
    this.getecftype()
    this.gettds()
    if (this.movedata == 'AP' || this.movedata == 'apapproverview')
      this.getGstValidated()
    if (this.movedata != 'apapproverview') {
      // this.getecftype()
      this.gethsn('')
      this.getProduct('')
      this.getdebbank()
      this.gettds()
      this.getcat('')
      this.getRecurringType()
    }
    this.SubmitoverallForm = this.formBuilder.group({
      apheader_id: [''],
      approver_branch: [''],
      approved_by: [''],
      aptype: [''],
      tds: [''],
      remarks: [''],
      remark: ['']
    })

    this.APapprovesubmitform = this.formBuilder.group({
      id: [''],
      apinvoiceheaderstatus: [''],
      remarks: ['', Validators.required]
    })
    this.OverallForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getbranchscroll(this.brInput.nativeElement.value, 1)
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
    this.getApHdr();

  }

  private valueChangesSubscription: Subscription | null = null;

  // Unsubscribe when the component is destroyed
  ngOnDestroy() {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  branchdata: any = {}
  raiserbranchposid: any
  getbranchrole() {
    this.service.getbranchrole()
      .subscribe(result => {
        if (result) {
          let roledata = result?.enable_ddl
          this.raiserbranchposid = result?.id
          if (roledata == false) {
            this.branchdata = { "id": result?.id, "name": result?.branch_name, "code": result?.code }

          } else {
            let datas = {
              "id": result?.id,
              "code": result?.code,
              "name": result?.branch_name
            }
            this.branchdata = datas

          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.spinner.hide()
      })
  }
  getcrndetails(): FormGroup {
    return this.formBuilder.group({
      category_code: [''],
      subcategory_code: [''],
      creditglno: [''],
      cc_code: [''],
      bs_code: ['']
    });
  }

  location
  location_id
  branch_code: any;
  transaction_branch: any;
  poDetails: any
  creditGLPaymode: any
  pofiledetails=[]
  getApHdr() {
    // this.spinner.show(); 
    // this.service.getHdrSummary(this.apheader_id)
    // .subscribe(result => {  
    //   if (result.code == undefined)
    //   { 
    //     this.apHdrRes = result
    //     let apres = this.apHdrRes

    //     this.location = apres.location
    //     this.location_id = apres.location_id

    //     if(apres.apinvoiceheader[0].entry_flag == 1)
    //     {
    //       this.creditEntryFlag = 1
    //     }
    //     else
    //     {
    //       this.creditEntryFlag = 0
    //     }
    //     this.aptypeid = apres.aptype.id
    //     this.getPaymodes()

    //     this.crno = apres.crno
    //     this.paytoid = apres.payto.id
    //     this.raisedbyid = apres.raisedby.id
    //     if (apres.crno !== null && apres.crno !== undefined && apres.crno !== "")
    //     {
    //       this.fromecf = true
    //       this.SubmitoverallForm.patchValue(
    //         {
    //           apheader_id : apres.id,
    //           approver_branch : apres.approver_branch.name,
    //           approved_by: apres.approvername,
    //           aptype: apres.aptype.id,
    //           tds: apres.tds.text,
    //           remarks: apres.remark
    //         })
    //     }
    //     else
    //     {
    //       this.fromecf = false
    //       this.SubmitoverallForm.patchValue(
    //         {
    //           apheader_id : apres.id,
    //           aptype: apres.aptype.id,
    //         })
    //     }
    // this.spinner.show();
    this.service.getallPaymode().subscribe(result => {
      // console.log("payresult",result)
      this.paymodesList = result['data']
      // this.spinner.hide();
      this.creditGLPaymode = this.paymodesList.filter(x => x.code == 'PM002')[0]
      this.spinner.show();
      this.service.getInvHdr(this.apinvHeader_id, this.movedata)
        .subscribe(result => {
          // console.log("rescheck",result)
          if (result.code == undefined) {
            this.spinner.hide();
            this.invHdrRes = result.data[0]
                const isCapitalized = this.invHdrRes?.is_capitalized ?? false;

              this.frmInvHdr.patchValue({
                captalisedflag: isCapitalized
              });
            this.ppxid = this.invHdrRes?.ppx
            this.aptypeid = this.invHdrRes.aptype_id
            console.log("aptypeid----------", this.aptypeid)
            if (this.aptypeid == 1 && this.movedata !='apapproverview') {
              this.service.getpodetails({ 'po_no': this.po_no }).subscribe(result => {
                this.poDetails = result
                this.poDetails = this.poDetails['data']
                if (this.poDetails == undefined) {
                  this.toastr.error('PO Data not Avaiable')
                  this.spinner.hide();
                }
                this.getInvHdr();
              })
            }
            if ((this.aptypeid == 1 && this.movedata == 'apapproverview')) {
              this.getInvHdr(); 
            }
            if (this.aptypeid == 13 || this.aptypeid == 3 || (this.aptypeid == 4 && this.ppxid == 'E')) {
              this.creditdetForm.patchValue({
                payment_instruction: this.invHdrRes?.payment_instruction,
                is_tds_applicable: 1
              })
            } else {
              this.creditdetForm.patchValue({
                payment_instruction: this.invHdrRes?.payment_instruction,
                is_tds_applicable: this.invHdrRes?.is_tds_applicable?.id
              })
            }

            // if (this.creditsaved || this.aptypeid == 13 || this.aptypeid == 3 || (this.aptypeid == 4 && this.ppxid == 'E')) {
            //   this.tdsapplicable1 = {
            //     label: "Is TDS Applicable",
            //     method: "get",
            //     url: this.ecfURL + "ecfapserv/get_yes_or_no_dropdown",
            //     params: "&type=tds",
            //     formcontrolname: 'is_tds_applicable',
            //     searchkey: "query",
            //     displaykey: "text",
            //     required: true,
            //     formkey: 'id',
            // disabled: true,
            //   }
            // }
            // else {
            //   this.tdsapplicable1 = {
            //     label: "Is TDS Applicable",
            //     method: "get",
            //     url: this.ecfURL + "ecfapserv/get_yes_or_no_dropdown",
            //     params: "&type=tds",
            //     formcontrolname: 'is_tds_applicable',
            //     searchkey: "query",
            //     displaykey: "text",
            //     required: true,
            //     formkey: 'id',
            //     disabled: true,
            //   }
            // }
            this.transaction_branch = this.invHdrRes?.branchdetails_id?.code + "-" + this.invHdrRes?.branchdetails_id?.name
            console.log("tranbranch", this.transaction_branch)
            this.branch_code = this.invHdrRes?.branchdetails_id?.code
            if (this.aptypeid != 1)
              this.getInvHdr();
          }
          else {
            this.spinner.hide();
            this.toastr.error(result?.description)
            if(result.description ==  "You already play a maker role for this record"){
              this.overallback()
            }
            console.log("Error while fetching Invoice Header.")
          }

        }, error => {
          console.log("Error while fetching Inv Header data")
          this.spinner.hide();
        }
        )
      // this.invdtls = this.apHdrRes.apinvoiceheader[0].apinvoicedetails
      //   }
      //   else
      //   {
      //     console.log("Error while fetching AP Header data")
      //     this.spinner.hide();  
      //   }
      // })
    })

  }

  gettds() {
    // this.spinner.show()
    this.service.gettdsapplicable().subscribe(result => {
      // this.spinner.hide()
      this.tdslist = result['data']
    })
  }
  creditEntryFlag = false
  checkAdvance = false
  branchGST: any
  branchdet: any
  attachedFile = new FormArray([])
  Liq_data: any
  Total_Row_Mono_ppx : number
  continue_mono_ppx = 1
  mono_ppx_called_count =0
  mono_liq_payload : any
  page_indexMonoLiq = 0
  ppxpagination:any
  ppxcount:any;
  crn_id:any;
  ppx_id:any;
  msme:any;
  showreg = false;
  msme_reg_no :any;
  getInvHdr() {
    console.log("invhdrresult", this.invHdrRes)
    if (this.invHdrRes !== undefined && this.invHdrRes !== null) {
      let num: number = +this.invHdrRes.totalamount;
      let totamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      totamt = totamt ? totamt.toString() : '';

      num = +this.invHdrRes.invoiceamount;
      let invamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      invamt = invamt ? invamt.toString() : '';

      num = +this.invHdrRes.invoiceamount;
      let taxableamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      taxableamt = taxableamt ? taxableamt.toString() : '';
      this.taxableinvoiceamount = taxableamt
      console.log("tinvamt", this.taxableinvoiceamount)
      this.aptypeid = this.invHdrRes.aptype_id
      console.log("this.aptypeid", this.aptypeid)
      let suppname: any
      let suppgst: any
      if (this.aptypeid == 3) {
        suppname = this.invHdrRes.manualsupp_name
        suppgst = this.invHdrRes.manual_gstno
      } else if (this.aptypeid == 13) {
        suppname = this.invHdrRes.supplier_name,
          suppgst = this.invHdrRes.suppliergst

      } else {
        suppname = this.invHdrRes.supplier_id?.name,
          suppgst = this.invHdrRes.supplier_id?.gstno

      }

      if (this.movedata == 'ECF' && this.invHdrRes.invoicegst == 'Y')
        this.frmInvHdr.get('invoicegst').setValue('YES');
      else if (this.movedata == 'ECF' && this.invHdrRes.invoicegst == 'N')
        this.frmInvHdr.get('invoicegst').setValue('NO');

      if ((this.movedata == 'AP' || this.movedata == 'apapproverview') && this.invHdrRes.invoicegst == 'Y')
        this.frmInvHdr.get('invoicegst').setValue(true);
      else if ((this.movedata == 'AP' || this.movedata == 'apapproverview') && this.invHdrRes.invoicegst == 'N')
        this.frmInvHdr.get('invoicegst').setValue(false);

      this.branchdet = this.invHdrRes?.branchdetails_id?.name + ' - ' + this.invHdrRes?.branchdetails_id?.code
      if (this.invHdrRes?.pmd_data?.gstno != undefined)
        this.branchGST = this.invHdrRes?.pmd_data?.gstno
      else
        this.branchGST = this.invHdrRes?.branchdetails_id?.gstin
      // if(typeof(this.invHdrRes?.pmd_data?.id) == 'number')
      // {
      //   this.branchdet = this.invHdrRes?.pmd_data?.location
      //   this.branchGST = this.invHdrRes?.pmd_data?.gstno
      // }
      // else
      // {
      //   this.branchdet = this.invHdrRes?.branchdetails_id?.name + ' - ' +this.invHdrRes?.branchdetails_id?.code
      //   this.branchGST = this.invHdrRes?.branchdetails_id?.gstin
      // }
      let captalised
      if (this.movedata == 'ECF')
        captalised = this.isCaptalized == true ? 'Yes' : 'No'
      else
        captalised = this.isCaptalized

      this.view_is_captilized = this.isCaptalized == true ? 'YES' : 'NO'
      this.frmInvHdr.patchValue(
        {
          id: this.apinvHeader_id,
          apheader_id: this.invHdrRes.apheader_id,
          rsrCode: this.invHdrRes.raisercode,
          rsrEmp: this.invHdrRes.raisername + ' - ' + this.invHdrRes.raisercode,
          rsrBr: this.branchdet,
          pmd: this.invHdrRes?.pmd_data?.location,
          ecftype: this.invHdrRes.aptype_id,
          supplier: suppname + ' - ' + this.invHdrRes.supplier_id?.code,
          suppliergst: suppgst,
          status: this.invHdrRes?.apinvoiceheader_status,
          branchGST: this.branchGST,
          invoiceno: this.invHdrRes?.invoiceno,
          invoicedate: this.invHdrRes.invoicedate,
          totalamount: totamt,
          invoiceamount: invamt,
          commodity_id: this.invHdrRes?.commodity,
          purpose: this.invHdrRes?.remarks,
          physical_verif: this.invHdrRes?.is_originalinvoice?.text,
          supplier_id: this.invHdrRes.supplier_id?.id,
          supplierstate_id: this.invHdrRes?.supplierstate_id?.id,
          credit_refno: this.invHdrRes?.credit_refno,
          msme: this.invHdrRes?.is_msme == true ? "YES":"NO",
          msme_reg_no: this.invHdrRes?.msme_reg_no,
          taxamount: this.invHdrRes?.taxamount,
          otheramount: this.invHdrRes?.otheramount,
          roundoffamt: this.invHdrRes?.roundoffamt,
          dedupinvoiceno: this.invHdrRes?.dedupinvoiceno,
          raisorbranchgst: this.invHdrRes?.raisorbranchgst,
          place_of_supply: this.invHdrRes?.place_of_supply,
          branchdetails_id: this.invHdrRes?.branchdetails_id,
          bankdetails_id: this.invHdrRes?.bankdetails_id,
          entry_flag: this.invHdrRes?.entry_flag,
          barcode: "",
          creditbank_id: this.invHdrRes?.creditbank_id,
          manualsupp_name: this.invHdrRes?.manualsupp_name,
          manual_gstno: this.invHdrRes?.manual_gstno,
          is_capitalized: this.invHdrRes?.is_capitalized,
          remarks: this.invHdrRes?.remarks,
          filevalue: [],
          file_key: [],
          // filedataas: this.filefun(),
          // filekey: this.filefun(),
          apinvoiceheader_crno: this.invHdrRes?.apinvoiceheader_crno,
          debitbank_id: this.invHdrRes?.debitbank_id,
          invoicestatus: this.invHdrRes?.invoice_status,
          is_tds_applicable: this.aptypeid == 13 ? 1 : this.invHdrRes?.is_tds_applicable?.id,
          paymentinstrctn: this.invHdrRes?.paymentinstrctn,
          prepaid_expense: this.invHdrRes?.prepaid_expense,
          gst_keyin: this.invHdrRes?.gst_keyin,
          is_recur: this.invHdrRes?.is_recur?.id,
          service_type: this.invHdrRes?.servicetype?.id,
          recur_fromdate: this.invHdrRes?.recur_fromdate,
          recur_todate: this.invHdrRes?.recur_todate,
          is_pca: this.invHdrRes?.is_pca ? 1 : 0,
          pca_no: this.invHdrRes?.pca_no,
          pca_name: this.invHdrRes?.pca_name,
          pca_bal_amt: this.invHdrRes?.pca_bal_amt,
          notename:this.invHdrRes?.notename ,


        }
      )
       console.log("notename",this.invHdrRes?.notename)
      this.noteddview = this.invHdrRes?.notename
      this.viewrsrEmp = this.invHdrRes.raisername + ' - ' + this.invHdrRes.raisercode;
      this.viewrsrBr = this.branchdet;
      this.viewbranchGST = this.branchGST;
      this.viewpmd = this.invHdrRes?.pmd_data?.location;
      this.viewecftype = this.invHdrRes.aptype_id
      // Assigning a variable to hold the text to show in the view
      this.viewecftypeText = "";

      // Calling the API
      this.spinner.show();
      this.service.getecftype()
        .subscribe(
          result => {
            if (result) {
              // Extracting the 'data' array from the API response
              let TypeList = result["data"];
              this.spinner.hide();
              // Filtering TypeList for specific IDs
              this.TypeList = TypeList.filter(a =>
                [2, 3, 4, 7, 13, 14, 17, 19, 20, 18, 9, 8, 11, 15,1].includes(a.id)
              );

              // Finding the text for the received ID (this.viewecftype)
              const matchedType = this.TypeList.find(a => a.id === this.viewecftype);
              if (matchedType) {
                // Assigning the text to the view variable
                this.viewecftypeText = matchedType.text;
              } else {
                // Default message if no match is found
                this.viewecftypeText = "Type not found";
              }
            }
          },
          error => {
            // Handling API errors
            this.errorHandler.handleError(error);
            this.spinner.hide();
          }
        );

      console.log("this.viewecftype ==========> ", this.viewecftype)
      console.log("this.viewecftypeText ==========> ", this.viewecftypeText)
      this.viewremarks = this.invHdrRes?.remarks;
      this.viewinvoiceno = this.invHdrRes?.invoiceno;
      this.viewinvoicedate = this.invHdrRes.invoicedate;
      this.viewtotalamount = totamt;
      this.viewinvoiceamount = invamt;
      this.viewcommodity_id = this.invHdrRes?.commodity.name;
      this.viewsupplier = suppname + ' - ' + this.invHdrRes.supplier_id?.code;
      this.viewsuppliergst = suppgst;
      this.viewstatus = this.invHdrRes?.apinvoiceheader_status;
      this.view_captalisedflag = this.invHdrRes?.is_capitalized === "true" ? "Yes" : "No";
      this.view_invoicegst = this.invHdrRes?.invoicegst === "Y" ? "Yes" : "No";
      this.creditrefno = this.invHdrRes?.credit_refno
      this.msme = this.invHdrRes.is_msme == true ? "YES":"NO"
      if(this.invHdrRes.is_msme){
        this.showreg = true;
        this.msme_reg_no = this.invHdrRes?.msme_reg_no
      }
      else{
        this.showreg = false;
      }
      this.view_prepaid_expense = this.invHdrRes?.prepaid_expense === "true" ? "Yes" : "No";
      this.view_gst_key_in = this.invHdrRes?.gst_keyin === "true" ? "Yes" : "No";
      this.viewphysical_verif = this.invHdrRes?.is_originalinvoice?.text;
      this.viewis_pca = this.invHdrRes?.is_pca ? "YES" : "NO";
      this.viewpca_no = this.invHdrRes?.pca_no;
      this.viewis_recur = this.invHdrRes?.is_recur.text;
      console.log("this.viewis_recur=====>", this.viewis_recur)
      this.viewservice_type = this.invHdrRes?.servicetype?.text;
      this.viewrecur_fromdate = this.invHdrRes?.recur_fromdate;
      this.viewrecur_todate = this.invHdrRes?.recur_todate;

      if (this.movedata == 'ECF' && this.invHdrRes.invoicegst == 'Y')
        this.view_invoicegst = 'YES';
      else if (this.movedata == 'ECF' && this.invHdrRes.invoicegst == 'N')
        this.view_invoicegst = 'NO';

      if ((this.movedata == 'AP' || this.movedata == 'apapproverview') && this.invHdrRes.invoicegst == 'Y')
        this.view_invoicegst = 'YES';
      else if ((this.movedata == 'AP' || this.movedata == 'apapproverview') && this.invHdrRes.invoicegst == 'N')
        this.view_invoicegst = 'NO';

      this.view_is_captalized = this.invHdrRes?.invoicedetails?.data[0]?.is_capitalized === true ? 'YES' : 'NO';
      if (this.aptypeid == 14) {
        this.kvbacaccno = this.invHdrRes?.invoiceno
        this.ICRAccNo = this.invHdrRes?.invoiceno
      }

      if (this.aptypeid == 2 && this.invHdrRes?.is_pca) {
        this.spinner.show();
        this.service.getPCA(this.invHdrRes?.commodity.id, this.invHdrRes?.pca_no, 1)
          .subscribe(result => {
            if (result.data?.length > 0) {
              this.PCA_Det = []
              this.PCA_Det.push(result.data[0])
              this.PCA_bal_amount = +result.data[0]?.balance_amount
              this.frmInvHdr.get('pca_no').setValue(this.PCA_Det[0]);
              this.spinner.hide();
            }
            else {
              this.PCA_bal_amount = 0
              this.spinner.hide();
            }
          })
      }
      if (this.invHdrRes?.is_pca)
        this.PCAyesno = 1
      else
        this.PCAyesno = 0
      if (this.invHdrRes?.servicetype?.id == 2 || this.invHdrRes?.servicetype?.id == 3)
        this.showRecurDates = true
      else
        this.showRecurDates = false

      if (this.invHdrRes?.servicetype?.id == 2)
        this.showRecurMonth = true
      else
        this.showRecurMonth = false
      const invhdr = this.frmInvHdr.value
      this.filefun()

      console.log("this.frmInvHdr.value-----", this.frmInvHdr.value)
      if (this.invHdrRes.invoicegst == "Y") {
        this.gstchecked = true
      }
      else {
        this.gstchecked = false
      }
      this.InvoiceDetailForm.patchValue({ roundoffamt: this.invHdrRes.roundoffamt })
      let other =this.invHdrRes?.invoicedetails['data'][0]?.otheramount ?
      this.invHdrRes?.invoicedetails['data'][0]?.otheramount :this.invHdrRes?.otheramount
      this.InvoiceDetailForm.patchValue({otheramount: other })
      this.creditdetForm.patchValue({ supName: this.invHdrRes.supplier_id?.name })
      this.crno = this.invHdrRes.apinvoiceheader_crno

      this.typeid = this.invHdrRes.aptype_id
      this.raisedbyid = this.invHdrRes.raisedby
      this.raisercode = this.invHdrRes.raisercode
      // console.log("this.raisedbyid",this.raisedbyid)
      this.invoicedate = this.invHdrRes.invoicedate
      this.Roundoffsamount = this.invHdrRes.roundoffamt
      this.paytoid = this.invHdrRes.payto_id

      this.invdtladdonid = this.invHdrRes?.invoicedetails['data'][0]?.id
      // console.log("invdtladdonid",this.invdtladdonid )
      //this.aptype = this.invHdrRes.invoicetype
      this.getgstapplicable = this.invHdrRes.invoicegst
      // console.log("getgstapplicable",this.getgstapplicable)
      if (this.getgstapplicable == "Y") {
        this.gstAppl = true
      }
      else {
        this.gstAppl = false
      }
      if (this.aptypeid != 13 && this.aptypeid != 4 && this.aptypeid != 3 && this.movedata != 'apapproverview') {
        if (this.invHdrRes?.supplier_id?.gstno != "" && this.invHdrRes?.supplier_id?.gstno != null && this.invHdrRes?.supplier_id?.gstno != undefined) {
          this.spinner.show();
          this.service.GetpettycashGSTtype(this.invHdrRes?.supplier_id?.gstno, this.branchGST)
            .subscribe((results: any[]) => {
              this.gsttype = results['Gsttype']
              this.type = results['Gsttype']
              this.spinner.hide();
            })
        }
      }
      console.log("resinv", this.invHdrRes?.manual_gstno)
      if (this.aptypeid == 3 && this.getgstapplicable == 'Y' && this.invHdrRes?.manual_gstno != "" && this.invHdrRes?.manual_gstno != null && this.invHdrRes?.manual_gstno != undefined && this.movedata != 'apapproverview') {
        this.spinner.show();
        this.service.GetpettycashGSTtype(this.invHdrRes?.manual_gstno, this.branchGST)
          .subscribe((results: any[]) => {
            this.gsttype = results['Gsttype']
            this.type = results['Gsttype']
            this.spinner.hide();
          })
      }
      //this.invheadertotamount = this.invHdrRes.totalamount
      //this.totalamount = this.invHdrRes.totalamount
      this.suppid = this.invHdrRes?.supplier_id?.id
      let invamount = Number(this.invHdrRes.invoiceamount)
      this.totalamount = Number(this.invHdrRes.totalamount)
      let roundamount = Number(this.invHdrRes.roundoffamt)
      this.taxableamount = +this.invHdrRes.invoiceamount;
      // this.taxableamount = this.invHdrRes.invoice_amount
      this.invoiceno = this.invHdrRes.invoiceno
      // let supgst = (this.invHdrRes.supplier_id?.gstno ? this.invHdrRes.supplier_id?.gstno : "").substr(0,2)
      // let branchgst = (this.invHdrRes.raisorbranchgst ? this.invHdrRes.raisorbranchgst : "").substr(0,2)
      // if(supgst == branchgst)
      // {
      //   this.supplierGSTflag = true
      //   this.supplierGSTType = "SGST & CGST"
      // }
      // else
      // {
      //   this.supplierGSTflag = true
      //   this.supplierGSTType = "IGST"
      // }


      let id
      let crn
      this.service.gethsn("nohsn")
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.NOHSN = datas[0];
        })

      if (this.aptypeid == 2) {
        id = { "supplier_id": this.suppid, "ppxlique_invhdrcrno": this.crno }
        crn = { "crn_supplier_id": this.suppid }
      }
      else if (this.aptypeid == 3) {
        id = { "raisedby": this.raisedbyid, "ppxlique_invhdrcrno": this.crno }
      }
      
      if (this.aptypeid == 2) {
        this.mono_liq_payload = {
          "Type": "PAYMENT_SUPPLIER",
          "group": "PAYMENT_SUPPLIER",
          "Filter": {
            "Employee_gid": this.raisedbyid,
            "Supplier_gid": this.suppid,
            "Page_Index": this.page_indexMonoLiq,
            "Page_Size": 5,
            "Branch_code": this.invHdrRes?.branchdetails_id?.code
          },
          "Entity_gid": 1,
          "Sub_Type": "PPX"
        }
      }
      else if (this.aptypeid == 3) {
        this.mono_liq_payload = {
          "Type": "PAYMENT_EMPLOYEE",
          "group": "PAYMENT_EMPLOYEE",
          "Filter": {
            "Employee_gid": this.raisedbyid,
            "Supplier_gid": null,
            "Page_Index": this.page_indexMonoLiq,
            "Page_Size": 5
          },
          "Entity_gid": 1,
          "Sub_Type": "PPX"
        }
      }
      if (this.mono_liq_payload != undefined) {
        this.ppxdata = []
        this.crndata = []
        if (this.movedata == 'ECF') {
           if (id != undefined) {
                this.ppx_id = id
                this.getppxdata(this.ppx_id,1,1);
            }
             if (crn != undefined) {
                this.crn_id = crn
                this.getcrndata(this.crn_id,1,0);
                }
                this.getDebCredData();
        //   this.spinner.show();
        //   this.service.mono_ppx_liquidation(this.mono_liq_payload).subscribe(result => {
        //     if (result) {
        //       // this.Liq_data = {
        //       //   "data": [],
        //       //   "micro_data": [],
        //       //   "status": "success"
        //       // }
        //       this.spinner.hide();
        //       this.Liq_data = result
        //       let status = this.Liq_data?.status
        //       this.mono_ppx_called_count +=1
        //       if(status == 'success'){
        //         let micro_data = this.Liq_data['micro_data'] ? this.Liq_data['micro_data'] : []
        //         let ppxdata = this.Liq_data['data'] ? this.Liq_data['data'] : []
        //         this.Total_Row_Mono_ppx =ppxdata[0]?.Total_Row ? ppxdata[0]?.Total_Row : 0
        //         for(let i=0; i<ppxdata.length; i++)
        //         {
        //           let liquidated = micro_data.filter(x => x.refno == ppxdata[i].invoiceheader_crno)
        //           let liq_amts = liquidated.map(x => x.amount)
        //           let sum_of_liqamt = liq_amts.reduce((a, b) => Number(a) + Number(b),0);
        //           let ecfqty =ppxdata[i].ecfqty ? Number(ppxdata[i].ecfqty) : 0
        //           ppxdata[i].ppxheader_balance = ppxdata[i].ppxheader_balance - +sum_of_liqamt - ecfqty
        //           ppxdata[i].crno = ppxdata[i].invoiceheader_crno
        //           if(ppxdata[i].ppxheader_balance <= 0)
        //             delete ppxdata[i]            
        //         } 
                
        //         // ppxdata = ppxdata.filter(x => x.raiser_branch.code == this.invHdrRes.branchdetails_id.code)
        //         // for(let i=0; i<ppxdata.length; i++)
        //         // {
        //         //   let ppxdetails = ppxdata[i].ppxdetails.data
        //         //   let current_crno
        //         //   if(ppxdetails.length>0)
        //         //   {
        //         //     current_crno = ppxdetails.filter(x => x.current_crno == this.crno)[0]?.current_crno
        //         //     if(current_crno == undefined && ppxdata[i].ppxdetails_balance <=0)
        //         //     {
        //         //       delete ppxdata[i]
        //         //       continue;
        //         //     }
        //         //   }
        //         //   else if(ppxdata[i].ppxdetails_balance <= 0)
        //         //     delete ppxdata[i]
        //         // }
        //         console.log("ppxdata----", ppxdata)
        //         for(let i=0; i<ppxdata.length; i++)
        //         {
        //           if(ppxdata[i] != undefined && ppxdata[i] != null)
        //           this.ppxdata.push(ppxdata[i])
        //         }
        //         if (this.ppxdata.length >0)
        //         {
        //           this.checkAdvance = true
        //         }
        //         else
        //         {
        //           this.checkAdvance = false
        //         }
        //         this.continue_mono_ppx = Math.ceil( this.Total_Row_Mono_ppx / 5)
        //         if(this.continue_mono_ppx <= 1){
        //           this.getDebCredData()}
        //           else{
        //         for(let i=1; i<this.continue_mono_ppx; i++){
        //           this.page_indexMonoLiq =this.page_indexMonoLiq+1
        //           this.mono_liq_payload.Filter.Page_Index = this.page_indexMonoLiq
        //           this.getMono_ppx_liq()
        //         }   
        //       }
        //       } 
        //       else{
        //         this.getDebCredData()
        //       }
            
        //     }
        //   })
        } 
        else if (this.movedata == 'AP') {
          this.spinner.show();
               if (id != undefined) {
                this.ppx_id = id
                this.getppxdata(this.ppx_id,1,0);
                }
                if (crn != undefined) {
                this.crn_id = crn
                this.getcrndata(this.crn_id,1,0);
                }
                this.getDebCredData();
      //     this.service.getppxheader(id).subscribe(result => {
      //       if (result) {
      //         let ppxdata = result['data'] ? result['data'] : []
      //         this.spinner.hide();
      //         this.ppxpagination = result?.pagination
      //         this.ppxcount= result.count;
      //         // ppxdata = ppxdata.filter(x => x.raiser_branch.code == this.invHdrRes.branchdetails_id.code)
      //         for (let i = 0; i < ppxdata.length; i++) {
      //           let ppxdetails = ppxdata[i].ppxdetails.data
      //           let current_crno
      //           ppxdata[i].crno = ppxdata[i].invoiceheader_crno
      //           if (ppxdetails.length > 0) {
      //             current_crno = ppxdetails.filter(x => x.current_crno == this.crno)[0]?.current_crno
      //             if (current_crno == undefined && ppxdata[i].ppxdetails_balance <= 0) {
      //               delete ppxdata[i]
      //               continue;
      //             }
      //           }
      //           else if (ppxdata[i].ppxdetails_balance <= 0)
      //             delete ppxdata[i]
      //         }
      //         console.log("ppxdata----", ppxdata)
      //         for (let i = 0; i < ppxdata.length; i++) {
      //           if (ppxdata[i] != undefined && ppxdata[i] != null)
      //             this.ppxdata.push(ppxdata[i])
      //         }
      //         if (this.ppxdata.length > 0) {
      //           this.checkAdvance = true
      //         }
      //         else {
      //           this.checkAdvance = false
      //         }
      //       }
      //       this.getDebCredData() 
      //     })

      //      if(crn != undefined)
      //     {
      //   this.service.getppxheader(crn).subscribe(result => {
      //     if (result['data'] != undefined) {
      //       let crndata = result['data']
      //       // let crndata = datas.filter(x => (Number(x.AP_liquedate_limit) > 0 ))
      //       for(let i=0; i<crndata.length; i++)
      //       {
      //         let crndetails = crndata[i].ppxdetails.data
      //         let current_crno
      //         if(crndetails.length>0)
      //         {
      //           current_crno = crndetails.filter(x => x.current_crno == this.crno)[0]?.current_crno
      //           if(current_crno == undefined && crndata[i].AP_liquedate_limit <=0)
      //           {
      //             delete crndata[i]
      //             continue;
      //           }
      //           if(current_crno == undefined && crndata[i].liquedate_limit <=0)
      //           {
      //             delete crndata[i]
      //             continue;
      //           }
      //           if(crndata[i].AP_liquedate_limit < crndata[i].liquedate_limit)
      //           {
      //             crndata[i].AP_liquedate_limit = crndata[i].liquedate_limit
      //           }
      //         }
      //         else if(crndata[i].AP_liquedate_limit <= 0)
      //           delete crndata[i]
      //       }
      //       console.log("crndata----", crndata)
      //       for(let i=0; i<crndata.length; i++)
      //       {
      //         if(crndata[i] != undefined && crndata[i] != null)
      //         this.crndata.push(crndata[i])
      //       }
      //       if (this.crndata.length >0)
      //       {
      //         this.showcrnnotify = true
      //       }
      //       else
      //       {
      //         this.showcrnnotify = false
      //       }
      //     }else{
      //       this.notification.showError(result.description)
      //       return false
      //     }
      //        },
      //     error => {
      //       this.spinner.hide();
      //     }
      //   )
      //    this.getDebCredData();
      // }
        }
      }
      if((this.aptypeid == 2 || this.aptypeid == 3) && this.movedata =='apapproverview')
        this.getDebCredData() 
     
      if (this.suppid != undefined) {
        this.service.getbankaccDetails(this.suppid)
          .subscribe(res => {
            if (res['data'] != undefined) {
              this.accDetailList = res['data']
              this.accList = res['data']

              // this.getDebCredData()
            }
            if(this.aptypeid != 2 && this.aptypeid != 3)
              this.getDebCredData() 
          })
      }
      else {
        if(this.aptypeid != 2 && this.aptypeid != 3)
          this.getDebCredData()
      }
    }
    else {
      this.toastr.error('Invoice Hdr not available');
      this.spinner.hide();
      return false;
    }
    console.log("this.frmInvHdr.value--------", this.frmInvHdr.value)
  }

  getMono_ppx_liq(){  
    this.service.mono_ppx_liquidation(this.mono_liq_payload).subscribe(result=>{
      if(result)
      {
        this.Liq_data = result;
        let status = this.Liq_data?.status
        this.mono_ppx_called_count +=1
        if(status == 'success'){
          let micro_data = this.Liq_data['micro_data'] ? this.Liq_data['micro_data'] : []
          let ppxdata = this.Liq_data['data'] ? this.Liq_data['data'] : []
          this.Total_Row_Mono_ppx =ppxdata[0]?.Total_Row
          for(let i=0; i<ppxdata.length; i++)
          {
            let liquidated = micro_data.filter(x => x.refno == ppxdata[i].invoiceheader_crno)
            let liq_amts = liquidated.map(x => x.amount)
            let sum_of_liqamt = liq_amts.reduce((a, b) => Number(a) + Number(b),0);
            let ecfqty =ppxdata[i].ecfqty ? Number(ppxdata[i].ecfqty) : 0
            ppxdata[i].ppxheader_balance = ppxdata[i].ppxheader_balance - +sum_of_liqamt - ecfqty
            ppxdata[i].crno = ppxdata[i].invoiceheader_crno
            if(ppxdata[i].ppxheader_balance <= 0)
              delete ppxdata[i]            
          } 
          
          // ppxdata = ppxdata.filter(x => x.raiser_branch.code == this.invHdrRes.branchdetails_id.code)
          // for(let i=0; i<ppxdata.length; i++)
          // {
          //   let ppxdetails = ppxdata[i].ppxdetails.data
          //   let current_crno
          //   if(ppxdetails.length>0)
          //   {
          //     current_crno = ppxdetails.filter(x => x.current_crno == this.crno)[0]?.current_crno
          //     if(current_crno == undefined && ppxdata[i].ppxdetails_balance <=0)
          //     {
          //       delete ppxdata[i]
          //       continue;
          //     }
          //   }
          //   else if(ppxdata[i].ppxdetails_balance <= 0)
          //     delete ppxdata[i]
          // }
          console.log("ppxdata----", ppxdata)
          for(let i=0; i<ppxdata.length; i++)
          {
            if(ppxdata[i] != undefined && ppxdata[i] != null)
            this.ppxdata.push(ppxdata[i])
          }
          if (this.ppxdata.length >0)
          {
            this.checkAdvance = true
          }
          else
          {
            this.checkAdvance = false
          }
          this.continue_mono_ppx = Math.ceil( this.Total_Row_Mono_ppx / 5)
          if(this.continue_mono_ppx > this.mono_ppx_called_count){
            this.page_indexMonoLiq =this.page_indexMonoLiq+1
            this.mono_liq_payload.Filter.Page_Index = this.page_indexMonoLiq
          }
        }   
        if(this.continue_mono_ppx == this.mono_ppx_called_count){
          this.getDebCredData()   
        }     
      }
    })
    
  }

  getDebCredData() {
    if (this.aptypeid != 4) {
      if (this.invHdrRes.invoicedetails == null || this.invHdrRes.invoicedetails == undefined) {
        this.addinvdtlSection()
      }
      else {
        this.invDetailList = this.invHdrRes.invoicedetails.data
        console.log("invDetailList", this.invDetailList)
        this.getinvoicedtlrecords();
        if (this.invDetailList.length > 0) {
          this.debitsaved = true
          for (let i = 0; i < this.invDetailList.length; i++) {
            let id = Number(this.invDetailList[i]?.id)
            if (id > 0) {
              this.spinner.show();
              this.service.getDebitCredit(this.apinvHeader_id, id, 1)
                .subscribe(result => {
                  console.log("getInvdebit", result)
                  this.spinner.hide()
                  if (result) {
                    let data = result?.data
                    this.spinner.hide();
                    data = data.filter(x => x.is_display == "YES" && x.amount >= 0)
                    if (data.length > 0) {
                      let cat_check = data.filter(x => x.category_code?.status == "Failed"|| x.bs_code?.status === "Failed").length
                      this.spinner.hide();
                      if (cat_check > 0) {
                        this.debitSectionSaved[i] = false
                      }
                      else {
                        this.debitSectionSaved[i] = true
                      }
                    }
                    else {
                      this.debitSectionSaved[i] = false
                    }
                  }

                })
            }
          }
        }
      }
      this.spinner.show();
      this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
        .subscribe(result => {
          this.spinner.hide()
          if (result) {
            this.creditres = result.data;
            let cred = result.data;
            this.spinner.hide();
            this.invCreditList = cred.filter(x => (x.is_display == "YES" && (x.amount > 0 && x.paymode.gl_flag == 'Adjustable') ||
              (x.amount >= 0 && x.paymode.gl_flag == 'Payable')))
            console.log("Invoice Credit Detail ", this.invCreditList);
            this.getcredit = true

            if (this.invCreditList?.length == 0 && this.aptypeid == 3) {
              this.paymodecode[0] = 'PM004'
              this.addcreditSection()
              // console.log("ppp--->",this.paymodesList)
              let datas = this.paymodesList?.filter(x => x.code == 'PM004')
              // console.log("paydatass===>",datas[0])
              this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])

              if (datas[0].paymode_details?.data?.length == 0) {
                this.notification.showError("Paymode Details Empty")
              }
              else {
                let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

                let gl = datas[0].paymode_details['data'][0]?.glno
                let catcode = paymode_details['data'][0]?.category_id?.code
                let subcat = paymode_details['data'][0]?.sub_category_id?.code
                this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
              }

              this.showaccno[0] = true
              this.getERA(datas[0].id, 0)
            } else if (this.invCreditList?.length == 0 && this.aptypeid == 13) {
              this.paymodecode[0] = 'PM001'
              this.addcreditSection()
              // console.log("ppp--->",this.paymodesList)
              let datas = this.paymodesList?.filter(x => x.code == 'PM001')
              // console.log("paydatass===>",datas[0])
              this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
              if (datas[0].paymode_details?.data?.length == 0) {
                this.notification.showError("Paymode Details Empty")
              }
              else {
                let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

                let gl = datas[0].paymode_details['data'][0]?.glno
                let catcode = paymode_details['data'][0]?.category_id?.code
                let subcat = paymode_details['data'][0]?.sub_category_id?.code
                this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
              }
              this.showaccno[0] = true
              this.getERA(datas[0].id, 0)
            }
            else if (this.invCreditList?.length == 0 && (this.aptypeid == 2 || this.aptypeid == 1 || this.aptypeid == 6)) {
              this.addcreditSection()
              //   let datas = this.paymodesList?.filter(x=>x.code == 'PM005')
              //   // console.log("paydatass===>",datas[0])
              //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
              //   if(datas[0].paymode_details?.data?.length == 0)
              //   {
              //     this.notification.showError("Paymode Details Empty")
              //   }
              //   else
              //   {
              //     let paymode_details=datas[0].paymode_details ? datas[0].paymode_details:undefined

              //     let gl=datas[0].paymode_details['data'][0]?.glno
              //     let catcode = paymode_details['data'][0]?.category_id?.code
              //     let subcat = paymode_details['data'][0]?.sub_category_id?.code
              //     this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
              //     this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
              //     this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
              //   }
              //   this.showaccno[0] = true  
              //   this.showtaxtype[0] = false
              //   this.showtaxrate[0] = false
              //   this.showtaxtypes[0] = true
              //   this.showtaxrates[0] = true 
              this.getaccno(0)
            }
            else if (this.invCreditList?.length == 0 && (this.aptypeid == 7)) {
              this.paymodecode[0] = 'PM009'
              this.addcreditSection()
            }
            else if (this.invCreditList?.length == 0 && (this.aptypeid == 14)) {
              this.paymodecode[0] = 'PM008'
              this.addcreditSection()
              let datas = this.paymodesList?.filter(x => x.code == 'PM008')
              // this.getaccno(0)
              // console.log("paydatass===>",datas[0])
              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('bank').setValue("KARUR VYSYA BANK")
              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('ifsccode').setValue("KVBL0001903")
              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('branch').setValue("EXPENSES MANAGEMENT CELL")
              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('benificiary').setValue("EXPENSES MANAGEMENT CELL")
              this.creditdetForm.patchValue({
                is_tds_applicable: 1
              })
              if (datas[0].paymode_details?.data?.length == 0) {
                this.notification.showError("Paymode Details Empty")
              }
              else {
                let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

                let gl = datas[0].paymode_details['data'][0]?.glno
                let catcode = paymode_details['data'][0]?.category_id?.code
                let subcat = paymode_details['data'][0]?.sub_category_id?.code
                this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
              }
              this.showtaxtype[0] = false
              this.showtaxrate[0] = false
              this.showtaxtypes[0] = true
              this.showtaxrates[0] = true
            }
            else {
              this.getcreditrecords(this.invCreditList);
            }
            this.spinner.hide();
            // if(this.checkAdvance == true)
            // {
            //   this.notification.showInfo("Please Check for Advance");
            // }
            // if(this.showcrnnotify == true)
            // {
            //   this.notification.showInfo("Please Check for CRN");
            // }
          }
        }, error => {
          // console.log("Inv Credit Detail data not found")
          this.spinner.hide();
        }
        )
    }
    else {
      this.gettaxrate = 0
      this.invtotamount = this.invHdrRes.invoicedetails.data[0].amount
      let debEntryFlag = this.invHdrRes.invoicedetails.data[0].entry_flag
      this.invdtladdonid = this.invHdrRes.invoicedetails.data[0].id
      if (debEntryFlag == 0) {
        this.spinner.show();
        this.service.entryDebit({ crno: this.crno, invoiceheader_id: this.apinvHeader_id, invoicedetails_id_list: [this.invdtladdonid] })
          .subscribe(result => {
            if (result.status == "success") {
              this.spinner.hide();
              this.debitsaved = false
              // this.service.updateDebEntryFlag(this.invHdrRes.invoicedetails.data[0].id, { "entry_flag":1 })
              // .subscribe(result => {
              //   console.log("Debit entry flag update--", result)
              //   if(result.status != "success")
              //   {
              //     this.spinner.hide();
              //     this.notification.showError(result.message)
              //   }
              //   else
              //   {
              //     this.debitEntryFlag[0] = true
              //   }})
              this.spinner.show();
              this.service.getDebitCredit(this.apinvHeader_id, this.invdtladdonid, 1)
                .subscribe(result => {
                  console.log("getInvdebit", result)
                  if (result) {
                    this.spinner.hide();
                    let data = result.data
                    this.debitdata = data.filter(x => x.is_display == "YES" && x.amount >= 0)
                    let dbtdataas = this.debitdata
                    // this.service.getautobscc(this.raisedbyid).subscribe(results => {

                    //   if (results?.business_segment?.id != undefined && results?.cost_centre?.id != undefined) {
                    //     let bsccdata = results
                    //     for (let i in dbtdataas) {
                    //       if(dbtdataas[i]?.category_code?.code != 'GST'){
                    //       this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs_code').setValue(bsccdata?.business_segment)
                    //       this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc_code').setValue(bsccdata?.cost_centre)
                    //       }
                    //     }
                    //   }
                    // })
                    this.getdebitrecords(this.debitdata)

                  }
                })
            }
            else {
              this.spinner.hide();
              this.notification.showError(result.message)
            }
          })
      }
      else {
        this.debitEntryFlag[0] = true
        this.debitsaved = true
        this.spinner.show();
        this.service.getDebitCredit(this.apinvHeader_id, this.invdtladdonid, 1)
          .subscribe(result => {
            console.log("getInvdebit", result)
            if (result) {
              this.spinner.hide();
              let data = result.data
              this.debitdata = data.filter(x => x.is_display == "YES" && x.amount >= 0)
              let dbtdataas = this.debitdata
              // this.service.getautobscc(this.raisedbyid).subscribe(results => {

              //   if (results?.business_segment?.id != undefined && results?.cost_centre?.id != undefined) {
              //     let bsccdata = results
              //     for (let i in dbtdataas) {
              //       if(dbtdataas[i]?.category_code?.code != 'GST'){
              //       this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs_code').setValue(bsccdata?.business_segment)
              //       this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc_code').setValue(bsccdata?.cost_centre)
              //       }
              //     }
              //   }
              // })
              this.getdebitrecords(this.debitdata)
            }
          })
      }

      let credEntryFlag = this.invHdrRes.entry_flag
      if (credEntryFlag == 0) {
        this.spinner.show();
        this.service.entryCredit({ crno: this.crno, invoiceheader_id: this.apinvHeader_id, invoicedetails_id: "0" })
          .subscribe(result => {
            if (result) {
              console.log("entry Credit result --", result)
              if (result.status !== "success") {
                this.spinner.hide();
                this.toastr.warning(result.message)
              }
              else {
                // this.service.updateCredEntryFlag(this.apinvHeader_id, { "entry_flag":1 })
                // .subscribe(result => {
                //   console.log("Credit entry flag update--", result)
                //   if(result.status == "success")
                //   {
                this.creditEntryFlag = true
                this.spinner.show();
                this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
                  .subscribe(result => {
                    if (result) {
                      this.spinner.hide();
                      this.creditres = result.data;
                      let cred = result.data;
                      this.invCreditList = cred.filter(x => (x.is_display == "YES" && (x.amount > 0 && x.paymode.gl_flag == 'Adjustable') ||
                        (x.amount >= 0 && x.paymode.gl_flag == 'Payable')))
                      console.log("Invoice Credit Detail ", this.invCreditList);
                      if (this.invCreditList?.length == 0 && this.aptypeid == 4 && this.ppxid == "E") {
                        this.paymodecode[0] = 'PM004'
                        this.addcreditSection()
                        console.log("ppp--->", this.paymodesList)
                        let datas = this.paymodesList.filter(x => x.code == 'PM004')
                        console.log("paydatass===>", datas[0])
                        this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
                        this.showaccno[0] = true
                        this.getERA(datas[0].id, 0)
                        if (datas[0].paymode_details?.data?.length == 0) {
                          this.notification.showError("Paymode Details Empty")
                        }
                        else {
                          let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

                          let gl = datas[0].paymode_details['data'][0]?.glno
                          let catcode = paymode_details['data'][0]?.category_id?.code
                          let subcat = paymode_details['data'][0]?.sub_category_id?.code
                          this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                          this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                          this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
                        }
                      } else if (this.invCreditList?.length == 0 && this.aptypeid == 4 && this.ppxid == 'S') {
                        // this.paymodecode[0]='PM005'
                        this.addcreditSection()
                        this.getaccno(0)
                        // let datas = this.paymodesList.filter(x=>x.code == 'PM005')
                        // console.log("paydatass===>",datas[0])
                        // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
                        // this.showaccno[0] = true  
                        // this.showtaxtype[0] = false
                        // this.showtaxrate[0] = false
                        // this.showtaxtypes[0] = true
                        // this.showtaxrates[0] = true   
                      } else {
                        this.getcreditrecords(this.invCreditList);
                      }
                    }
                  }, error => {
                    console.log("Inv Credit Detail data not found")
                    this.spinner.hide();
                  }
                  )
                //   }
                //   else
                //   {
                //     this.spinner.hide();
                //     this.toastr.warning(result.message)
                //   }
                // })
              }
            }
          }
          )
      }
      else {
        this.creditEntryFlag = true
        this.spinner.show();
        this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
          .subscribe(result => {
            if (result) {
              this.spinner.hide();
              this.creditres = result.data;
              let cred = result.data;
              this.invCreditList = cred.filter(x => (x.is_display == "YES" && (x.amount > 0 && x.paymode.gl_flag == 'Adjustable') ||
                (x.amount >= 0 && x.paymode.gl_flag == 'Payable')))
              console.log("Invoice Credit Detail ", this.invCreditList);
              if (this.invCreditList?.length == 0 && this.aptypeid == 4 && this.ppxid == "E") {
                this.paymodecode[0] = 'PM004'
                this.addcreditSection()
                console.log("ppp--->", this.paymodesList)
                let datas = this.paymodesList.filter(x => x.code == 'PM004')
                console.log("paydatass===>", datas[0])
                this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
                this.showaccno[0] = true

                this.getERA(datas[0].id, 0)
              } else if (this.invCreditList?.length == 0 && this.aptypeid == 4 && this.ppxid == 'S') {
                // this.paymodecode[0]='PM005'
                this.addcreditSection()
                // let datas = this.paymodesList.filter(x=>x.code == 'PM005')
                // console.log("paydatass===>",datas[0])
                // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
                // this.showaccno[0] = true  
                this.getaccno(0)
                // this.showtaxtype[0] = false
                // this.showtaxrate[0] = false
                // this.showtaxtypes[0] = true
                // this.showtaxrates[0] = true   
              } else {
                this.getcreditrecords(this.invCreditList);
              }
            }
          }, error => {
            console.log("Inv Credit Detail data not found")
            this.spinner.hide();
          }
          )
      }



    }

  }

  hsnindex: any
  getindex(index) {
    // console.log("hsnnn", this.hsnindex)
    this.hsnindex = index
    this.isLoading = true
    this.service.getproduct()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.isLoading = false
        this.prodList = datas;
        console.log("this.prodList..", this.prodList)
      })
  }

  NOHSN: any
  debitEntryFlag = [false, false, false, false, false, false, false]
  prevInvVal = []
  ispocomponentsavedFlags: boolean[] = [];
  getinvoicedtlrecords() {
    console.log("this.frmInvHdr.value--------", this.frmInvHdr.value)
    let datas = this.invDetailList
if (datas && datas.length > 0 && this.aptypeid === 1) {
  // datas.forEach((parent, index) => {
  //   const childData = parent?.invoicedetail_child?.data;
  //   if (childData?.length > 0) {
  //     this.ispocomponentsaved = true;
  //     this.savedChildDataMap[index] = childData;
      this.getpatchpodetailsdata(datas);
  //   }
  // });
}

    if (datas.length == 0) {
      console.log("data invoice details ---->", datas)
      if (this.aptypeid == 1) {
        this.invdtlsaved = false
        if (this.selectionArray.length == 0) {
          this.showPOdiv = true;
          let con = this.POInvoiceForm.get('poheader') as FormArray
          con.clear()
          
          let datas = this.poDetails
          for (let details of datas) {
            let apinvoiceheader_id: FormControl = new FormControl('');
            let id: FormControl = new FormControl('');
            let grn_detail_id : FormControl =new FormControl('')
            let grn_header_id :FormControl = new FormControl('')
            let productcode: FormControl = new FormControl('');
            let product_id: FormControl = new FormControl('');
            let productname: FormControl = new FormControl('');
            let hsn: FormControl = new FormControl(this.NOHSN);
            let hsn_percentage: FormControl = new FormControl(0.25);
            let grn_code: FormControl = new FormControl('');
            let uom: FormControl = new FormControl('');
            let unitprice: FormControl = new FormControl(0);
            let qty: FormControl = new FormControl(0);
            let qty_read: FormControl = new FormControl(0);
            let balance: FormControl = new FormControl(0);
            let quantity: FormControl = new FormControl(0);
            let amount: FormControl = new FormControl(0);
            let cgst: FormControl = new FormControl('0');
            let sgst: FormControl = new FormControl('0');
            let igst: FormControl = new FormControl('0');
            let discount: FormControl = new FormControl('0');
            let taxable_amount: FormControl = new FormControl(0);
            let taxamount: FormControl = new FormControl('0');
            let totalamount: FormControl = new FormControl('0');
            let roundoffamt: FormControl = new FormControl('0');
            let dtltotalamt: FormControl = new FormControl(0);
            let is_rcmproduct: FormControl = new FormControl('N');
            let is_blockedproduct: FormControl = new FormControl('N');
            let is_capitalized: FormControl = new FormControl(false);
            let invoiceno: FormControl = new FormControl('');
            let invoicedate: FormControl = new FormControl('');
            let supplier_name: FormControl = new FormControl('');
            let suppliergst: FormControl = new FormControl('');
            let pincode: FormControl = new FormControl(0);
            let address: FormControl = new FormControl('');
            let otheramount: FormControl = new FormControl('0');
            let entry_flag: FormControl = new FormControl(0);
            let edit_flag: FormControl = new FormControl(0);
            let po_num: FormControl = new FormControl(0);
            let module_type: FormControl = new FormControl(2);
            let select: FormControl = new FormControl(0);
            let is_capitalized_type : FormControl = new FormControl('')
            let file :FormControl = new FormControl('')

            const poFormArray = this.POInvoiceForm.get("poheader") as FormArray;

            // if(details.entry_flag == 1)
            // {
            //   this.debitEntryFlag[i] =true
            // }
            // else
            // {
            //   this.debitEntryFlag[i] =false
            // }
            id.setValue(details.id)
            grn_detail_id.setValue(details?.grndetail_id)
            grn_header_id.setValue(details?.inwardheader?.id)
            apinvoiceheader_id.setValue(this.apinvHeader_id)
            // this.product[i] = {code:details.productcode,name:details.productname}
            // this.prodRcm[i] = details.is_rcmproduct
            // this.prodBlock[i] = details.is_blockedproduct
            // this.showrcm[i]= true
            product_id.setValue(details?.podetails_id?.product_data?.id)
            this.po_prod_id = details?.podetails_id?.product_data?.id
            productname.setValue(details.podetails_id?.product_name)
            productcode.setValue(details?.product_code)
            grn_code.setValue(details.inwardheader?.code)
            is_capitalized.setValue(details?.podetails_id?.capitalized)
            uom.setValue(details.podetails_id.uom)
            this.isshowsub[details] = details?.podetails_id?.capitalized ?? false;
            // is_capitalized_type.setValue(details?.is_capitalized_type)
            let num: number = +details.podetails_id.unitprice;
            let up = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
            up = up ? up.toString() : '';
            unitprice.setValue(up)

            num = +details.podetails_id.qty;
            let qty1 = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
            qty1 = qty1 ? qty1.toString() : '';
            qty.setValue(qty1)
            balance.setValue(+details.balance_quantity)




            // num = +details.amount;
            // let amt1 = new Intl.NumberFormat("en-GB").format(num); 
            // amt1 = amt1 ? amt1.toString() : '';
            // amt.setValue(amt1)
            po_num.setValue(this.po_no)
            file.setValue(details?.file)
            let lineIndex = con.length;
            file.setValue(details?.file); 
            this.pofiledetails[lineIndex] = details?.file || [];


            poFormArray.push(new FormGroup({
              apinvoiceheader_id: apinvoiceheader_id,
              id: id,
              productname: productname,
              productcode: productcode,
              product_id:product_id,
              grn_code: grn_code,
              hsn: hsn,
              hsn_percentage: hsn_percentage,
              uom: uom,
              unitprice: unitprice,
              qty: qty,
              quantity: quantity,
              qty_read: qty_read,
              balance: balance,
              amount: amount,
              taxable_amount: taxable_amount,
              cgst: cgst,
              sgst: sgst,
              igst: igst,
              grn_header_id:grn_header_id,
              grn_detail_id:grn_detail_id,
              discount: discount,
              taxamount: taxamount,
              totalamount: totalamount,
              roundoffamt: roundoffamt,
              dtltotalamt: dtltotalamt,
              is_rcmproduct: is_rcmproduct,
              is_blockedproduct: is_blockedproduct,
              is_capitalized: is_capitalized,
              invoiceno: invoiceno,
              invoicedate: invoicedate,
              supplier_name: supplier_name,
              suppliergst: suppliergst,
              pincode: pincode,
              address: address,
              otheramount: otheramount,
              entry_flag: entry_flag,
              po_num: po_num,
              module_type: module_type,
              select: select,
              file:file

            }))
            quantity.valueChanges.pipe(
              debounceTime(20)
            ).subscribe(value => {
              this.calcTotaldtl(unitprice, quantity, amount, 0, totalamount, 0, taxable_amount)
              if (!this.POInvoiceForm.valid) {
                return;
              }

              this.linesChange.emit(this.POInvoiceForm.value['poheader']);
            }
            )

          }

          return false
        }
        else if (this.selectionArray.length > 0) {
          this.invdtlsaved = false
          datas = this.selectionArray
          let i = 0
          for (let details of datas) {
            let apinvoiceheader_id: FormControl = new FormControl('');
            let grn_detail_id : FormControl =new FormControl('')
            let grn_header_id :FormControl = new FormControl('')
            let id: FormControl = new FormControl('');
            let description: FormControl = new FormControl('');
            let grn_code: FormControl = new FormControl('');
            let product_id :FormControl = new FormControl('');
            let productcode: FormControl = new FormControl('');
            let productname: FormControl = new FormControl('');
            let hsn: FormControl = new FormControl('');
            let hsn_percentage: FormControl = new FormControl('');
            let uom: FormControl = new FormControl('');
            let unitprice: FormControl = new FormControl(0);
            let quantity: FormControl = new FormControl(0);
            let amount: FormControl = new FormControl(0);
            let taxable_amount: FormControl = new FormControl(0);
            let cgst: FormControl = new FormControl(0);
            let sgst: FormControl = new FormControl(0);
            let igst: FormControl = new FormControl(0);
            let discount: FormControl = new FormControl(0);
            let taxamount: FormControl = new FormControl(0);
            let totalamount: FormControl = new FormControl(0);
            let roundoffamt: FormControl = new FormControl('');
            let otheramount: FormControl = new FormControl('');
            let dtltotalamt: FormControl = new FormControl(0);
            let is_rcmproduct: FormControl = new FormControl('');
            let is_blockedproduct: FormControl = new FormControl('');

            let is_capitalized: FormControl = new FormControl(false)
            // let entry_flag: FormControl = new FormControl(0)
            let invoiceno: FormControl = new FormControl('');
            let invoicedate: FormControl = new FormControl('');
            let supplier_name: FormControl = new FormControl('');
            let suppliergst: FormControl = new FormControl('');
            let pincode: FormControl = new FormControl('');
            let address: FormControl = new FormControl('');
            let is_capitalized_type : FormControl = new FormControl('')
            let file :FormControl = new FormControl('')

            const invdetFormArray = this.InvoiceDetailForm.get("invoicedtls") as FormArray;

            if (details.entry_flag == 1) {
              this.debitEntryFlag[i] = true
            }
            else {
              this.debitEntryFlag[i] = false
            }
            apinvoiceheader_id.setValue(details.apinvoiceheader_id)
            id.setValue(details.id)
            grn_detail_id.setValue(details?.grn_detail_id)
            grn_header_id.setValue(details?.grn_header_id)
            grn_code.setValue(details.grn_code)
            product_id.setValue(details?.product_id)
            this.po_prod_id = details?.product_id
            productcode.setValue(details.productcode)
            is_rcmproduct.setValue(details.is_rcmproduct)
            is_blockedproduct.setValue(details.is_blockedproduct)
            this.product[i] = { code: details.productcode, name: details.productname }
            this.prodRcm[i] = details.is_rcmproduct == 'Y' ? 'Yes' : 'No'
            this.prodBlock[i] = details.is_blockedproduct == 'Y' ? 'Yes' : 'No'
            this.showrcm[i] = true

            // this.service.getproduct(details.productname)
            // .subscribe((results: any[]) => {
            //   let datas = results["data"];
            //   let prod = datas[0];
            //   this.prodRcm[i] = prod.product_isrcm
            //   this.prodBlock [i] = prod.product_isblocked
            //   this.showrcm[i]= true
            //   if(prod.product_isrcm == "Y")
            //   {
            //     this.productRCMflag = true
            //   }
            // i++;
            // })

            productname.setValue({ code: details.productcode, name: details.productname,id :details?.product_id })
            this.product[i] = { code: details.productcode, name: details.productname }
           if (details.productname.toLowerCase() === "tax collected at source".toLowerCase()) {
              this.tcsAdded = true;
            }
            description.setValue(details.description)
            if (details?.hsn?.code == "UNEXPECTED_ERROR") {
              this.hsn[i] = "UNEXPECTED_ERROR"
              hsn.setValue("")
              hsn_percentage.setValue("")
              cgst.setValue(0)
              sgst.setValue(0)
              igst.setValue(0)
              taxamount.setValue(0)
            }
            else if (details.hsn?.Status == "Failed") {
              this.hsn[i] = "Failed"
              hsn.setValue("NO HSN")
              hsn_percentage.setValue(0)
              cgst.setValue(0)
              sgst.setValue(0)
              igst.setValue(0)
              taxamount.setValue(0)
            }
            else {
              this.hsn[i] = this.NOHSN
              hsn.setValue(this.NOHSN)
              hsn_percentage.setValue(this.NOHSN?.igstrate)
              let num = +details.cgst;
              let cgstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              cgstt = cgstt ? cgstt.toString() : '';
              cgst.setValue(cgstt)

              num = +details.sgst;
              let sgstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              sgstt = sgstt ? sgstt.toString() : '';
              sgst.setValue(sgstt)

              num = +details.igst;
              let igstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              igstt = igstt ? igstt.toString() : '';
              igst.setValue(igstt)

              num = +details.taxamount;
              let tax = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              tax = tax ? tax.toString() : '';
              taxamount.setValue(tax)
            }
            uom.setValue(details.uom)

            // let num: number = +details.unitprice;
            // let up = new Intl.NumberFormat("en-GB").format(num); 
            // up = up ? up.toString() : '';
            unitprice.setValue(details.unitprice)

            // num = +details.quantity;
            // let qty = new Intl.NumberFormat("en-GB").format(num); 
            // qty = qty ? qty.toString() : '';
            quantity.setValue(details.quantity)

            // num = +details.amount;
            // let amt = new Intl.NumberFormat("en-GB").format(num); 
            // amt = amt ? amt.toString() : '';
            amount.setValue(details.amount)

            let num1 = +(details.unitprice.replace(/,/g, ""))
            let qty = +(details.quantity)
            let amt = new Intl.NumberFormat("en-GB").format(num1 *qty); 
            amt = amt ? amt.toString() : '';
            taxable_amount.setValue(amt)

            // num = +details.discount;
            // let dis = new Intl.NumberFormat("en-GB").format(num); 
            // dis = dis ? dis.toString() : '';
            discount.setValue(details.discount)

            // num = +details.totalamount;
            // let tot = new Intl.NumberFormat("en-GB").format(num); 
            // tot = tot ? tot.toString() : '';
            totalamount.setValue(details.totalamount)

            roundoffamt.setValue(details.roundoffamt)
            // entry_flag.setValue(details.entry_flag)
            invoiceno.setValue(details?.invoiceno)
            invoicedate.setValue(details?.invoicedate)
            suppliergst.setValue(details?.supplier_gst ? details?.supplier_gst : "")
            supplier_name.setValue(details?.supplier_name)
            pincode.setValue(details?.pincode)
            address.setValue(details?.address)
            is_capitalized.setValue(details.is_capitalized)
            this.isshowsub[i] = details?.is_capitalized ?? false;
            // is_capitalized_type.setValue(details?.is_capitalized_type)

            if (this.aptypeid == 13) {
              if (details?.supplier_name != undefined && details?.supplier_name != "" && details?.supplier_name != null)
                this.supplierGSTflag = true
              else
                this.supplierGSTflag = false
            }

            let num = +details.totalamount;
            let tot = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
            tot = tot ? tot.toString() : '';
            file.setValue(details?.file)
            this.pofiledetails =details?.file
            if (this.pofiledetails.length > 0) {
                const formData: FormData = new FormData();

                const filesPayload = this.pofiledetails.map((fileItem: any) => ({
                  id: this.apinvHeader_id,
                  grn_no: details.grn_code|| '',
                  file_id: fileItem.file_id || '',
                  file_name: fileItem.file_name || ''
                }));
                  for (let file of this.pofiledetails){
                    this.grnfile.push({ file_name: file.file_name,document_type:details.grn_code   }) 
                  }
                // this.grnfile = filesPayload
              console.log("this.grnfile", this.grnfile)
                  this.fullfile = [...this.ecffile, ...this.grnfile]
                  console.log("this.fullfile", this.fullfile)
               console.log("filesPayload",filesPayload)
                formData.append('data', JSON.stringify(filesPayload));

                this.spinner.show();
                console.log('formData',formData)
                this.service.poinvoiceheadercreate(formData).subscribe({
                  next: (result: any) => {
                    this.spinner.hide();
                    if (result.status === 'success') {
                      console.log('✅ Files uploaded successfully');
                    }
                    else if(result.status === 'Failed'|| result?.code){
                      this.notification.showError(result)

                    }
                  },
                  error: () => {
                    this.spinner.hide();
                    console.error('❌ File upload failed');
                  }
                });
              }

            invdetFormArray.push(new FormGroup({
              id: id,
              grn_code: grn_code,
              productcode: productcode,
              productname: productname,
              product_id:product_id,
              description: description,
              hsn: hsn,
              hsn_percentage: hsn_percentage,
              uom: uom,
              unitprice: unitprice,
              quantity: quantity,
              amount: amount,
              cgst: cgst,
              sgst: sgst,
              igst: igst,
              grn_header_id:grn_header_id,
              grn_detail_id:grn_detail_id,
              discount: discount,
              taxable_amount: taxable_amount,
              taxamount: taxamount,
              totalamount: totalamount,
              roundoffamt: roundoffamt,
              is_rcmproduct: is_rcmproduct,
              is_blockedproduct: is_blockedproduct,
              is_capitalized: is_capitalized,
              // entry_flag : entry_flag,
              invoiceno: invoiceno,
              invoicedate: invoicedate,
              suppliergst: suppliergst,
              supplier_name: supplier_name,
              pincode: pincode,
              address: address,
              is_capitalized_type:is_capitalized_type,
              file:file

            }))

            this.prevInvVal.push(this.InvoiceDetailForm.value.invoicedtls[i])

            hsn.valueChanges
              .pipe(
                debounceTime(100),
                distinctUntilChanged(),
                tap(() => {
                  this.isLoading = true;
                }),
                switchMap(value => this.service.gethsnscroll(value, 1)
                  .pipe(
                    finalize(() => {
                      this.isLoading = false
                      if (value === "") {

                        this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('hsn_percentage').reset()
                        this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('cgst').reset(0)
                        this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('sgst').reset(0)
                        this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('igst').reset(0)
                        this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('taxamount').reset(0)
                        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)

                      }
                    }),

                  )

                )
              )
              .subscribe((results: any[]) => {
                let datas = results["data"];
                this.hsnList = datas;
                this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
              })

            this.valueChangesSubscription = productname?.valueChanges
              .pipe(
                debounceTime(1500),
                distinctUntilChanged(),
                tap(() => {
                  this.isLoading = true;
                }),
                switchMap(value => {
                  if (!value || typeof value === 'object') {
                    this.isLoading = false;
                    return of([]);
                  }
                  let Value
                  if (value.name == undefined) {
                    Value = value
                  } else {
                    Value = value.name
                  }
                  return this.service.getproduct(Value)
                    .pipe(
                      finalize(() => {
                        this.isLoading = false
                      }),
                    )
                })
              )
              .subscribe((results: any) => {
                this.isLoading = true;
                if (results) {
                  let datas = results["data"];
                  this.prodList = datas;
                  this.isLoading = false;
                }

              })

              this.valueChangesSubscription = is_capitalized_type?.valueChanges
              .pipe(
                debounceTime(1500),
                distinctUntilChanged(),
                tap(() => {
                  this.isLoading = true;
                }),
                switchMap(value => {
                  if (!value || typeof value === 'object') {
                    this.isLoading = false;
                    return of([]);
                  }
                  let Value
                  if (value.name == undefined) {
                    Value = value
                  } else {
                    Value = value.name
                  }
                  return this.service.getsubcatfacl(Value,1)
                    .pipe(
                      finalize(() => {
                        this.isLoading = false
                      }),
                    )
                })
              )
              .subscribe((results: any) => {
                this.isLoading = true;
                if (results) {
                  let datas = results["data"];
                  this.fa_subcategoryNameData = datas;
                  this.isLoading = false;
                }

              })

            // productname.valueChanges
            // .pipe(
            //   debounceTime(100),
            //   distinctUntilChanged(),
            //   tap(() => {
            //     this.isLoading = true;
            //   }),
            //   switchMap(value => this.service.getproduct(value)
            //     .pipe(
            //       finalize(() => {
            //         this.isLoading = false
            //       }),
            //     )
            //   )
            // )
            // .subscribe((results: any[]) => {
            //   let datas = results["data"];
            //   this.prodList = datas;
            //   this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
            // })
            this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)


            unitprice.valueChanges.pipe(
              debounceTime(20)
            ).subscribe(value => {
              // this.calcTotalM(value)
              this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
              if (!this.InvoiceDetailForm.valid) {
                return;
              }

              this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
            }
            )

            quantity.valueChanges.pipe(
              debounceTime(20)
            ).subscribe(value => {
              // this.calcTotalM(value)
              this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
              if (!this.InvoiceDetailForm.valid) {
                return;
              }

              this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
            }
            )

            amount.valueChanges.pipe(
              debounceTime(20)
            ).subscribe(value => {
              // this.calcTotalM(value)
              this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
              if (!this.InvoiceDetailForm.valid) {
                return;
              }

              this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
            }
            )

            taxamount.valueChanges.pipe(
              debounceTime(20)
            ).subscribe(value => {
              // this.calcTotalM(value)
              this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
              if (!this.InvoiceDetailForm.valid) {
                return;
              }

              this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
            }
            )


            totalamount.valueChanges.pipe(
              debounceTime(20)
            ).subscribe(value => {
              // this.calcTotalM(value)
              this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
              if (!this.InvoiceDetailForm.valid) {
                return;
              }

              this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
            }
            )

            discount.valueChanges.pipe(
              debounceTime(20)
            ).subscribe(value => {
              // this.calcTotalM(value)
              this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
              if (!this.InvoiceDetailForm.valid) {
                return;
              }

              this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
            }
            )
            i++;
          }
          this.cdtsum = this.totalamount
          return false
        }
      }
      else{
      this.addinvdtlSection()
      this.invdtlsaved = false
      return false
      }
    }
    else {
      this.invdtlsaved = true

      let i = 0

      for (let details of datas) {
        let apinvoiceheader_id: FormControl = new FormControl('');
        let id: FormControl = new FormControl('');
        let description: FormControl = new FormControl('');
        let grn_code: FormControl = new FormControl('');
        let productcode: FormControl = new FormControl('');
        let productname: FormControl = new FormControl('');
        let product_id :FormControl = new FormControl('');
        let hsn: FormControl = new FormControl('');
        let hsn_percentage: FormControl = new FormControl('');
        let uom: FormControl = new FormControl('');
        let unitprice: FormControl = new FormControl(0);
        let quantity: FormControl = new FormControl(0);
        let amount: FormControl = new FormControl(0);
        let taxable_amount: FormControl = new FormControl(0);
        let cgst: FormControl = new FormControl(0);
        let sgst: FormControl = new FormControl(0);
        let igst: FormControl = new FormControl(0);
        let discount: FormControl = new FormControl(0);
        let taxamount: FormControl = new FormControl(0);
        let totalamount: FormControl = new FormControl(0);
        let roundoffamt: FormControl = new FormControl('');
        let otheramount: FormControl = new FormControl('');
        let dtltotalamt: FormControl = new FormControl(0);
        let is_rcmproduct: FormControl = new FormControl('');
        let is_blockedproduct: FormControl = new FormControl('');

        let is_capitalized: FormControl = new FormControl(false)
        // let entry_flag: FormControl = new FormControl(0)
        let invoiceno: FormControl = new FormControl('');
        let invoicedate: FormControl = new FormControl('');
        let supplier_name: FormControl = new FormControl('');
        let suppliergst: FormControl = new FormControl('');
        let pincode: FormControl = new FormControl('');
        let address: FormControl = new FormControl('');
        let is_capitalized_type :FormControl = new FormControl('')

        const invdetFormArray = this.InvoiceDetailForm.get("invoicedtls") as FormArray;

        if (details.entry_flag == 1) {
          this.debitEntryFlag[i] = true
        }
        else {
          this.debitEntryFlag[i] = false
        }
        apinvoiceheader_id.setValue(details.apinvoiceheader_id)
        id.setValue(details.id)
        grn_code.setValue(details.grn_code)
        productcode.setValue(details.productcode)
        is_rcmproduct.setValue(details.is_rcmproduct)
        product_id.setValue(details?.product?.id)
        this.po_prod_id = details?.product?.id
        is_blockedproduct.setValue(details.is_blockedproduct)
        this.product[i] = { code: details.productcode, name: details.productname }
        this.prodRcm[i] = details.is_rcmproduct == 'Y' ? 'Yes' : 'No'
        this.prodBlock[i] = details.is_blockedproduct == 'Y' ? 'Yes' : 'No'
        this.showrcm[i] = true

        // this.service.getproduct(details.productname)
        // .subscribe((results: any[]) => {
        //   let datas = results["data"];
        //   let prod = datas[0];
        //   this.prodRcm[i] = prod.product_isrcm
        //   this.prodBlock [i] = prod.product_isblocked
        //   this.showrcm[i]= true
        //   if(prod.product_isrcm == "Y")
        //   {
        //     this.productRCMflag = true
        //   }
        // i++;
        // })

        productname.setValue({ code: details.productcode, name: details.productname,id :details?.product?.id  })
        this.product[i] = { code: details.productcode, name: details.productname,id :details?.product?.id }
        if (details.productname.toLowerCase() === "tax collected at source".toLowerCase()) {
              this.tcsAdded = true;
            }
        description.setValue(details.description)
        if (details.hsn.code == "UNEXPECTED_ERROR") {
          this.hsn[i] = "UNEXPECTED_ERROR"
          hsn.setValue("")
          hsn_percentage.setValue("")
          cgst.setValue(0)
          sgst.setValue(0)
          igst.setValue(0)
          taxamount.setValue(0)
        }
        else if (details.hsn?.Status == "Failed") {
          this.hsn[i] = "Failed"
          hsn.setValue("NO HSN")
          hsn_percentage.setValue(0)
          cgst.setValue(0)
          sgst.setValue(0)
          igst.setValue(0)
          taxamount.setValue(0)
        }
        else {
          this.hsn[i] = details.hsn
          hsn.setValue(details.hsn)
          hsn_percentage.setValue(details.hsn_percentage)
          let num = +details.cgst;
          let cgstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
          cgstt = cgstt ? cgstt.toString() : '';
          cgst.setValue(cgstt)

          num = +details.sgst;
          let sgstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
          sgstt = sgstt ? sgstt.toString() : '';
          sgst.setValue(sgstt)

          num = +details.igst;
          let igstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
          igstt = igstt ? igstt.toString() : '';
          igst.setValue(igstt)

          num = +details.taxamount;
          let tax = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
          tax = tax ? tax.toString() : '';
          taxamount.setValue(tax)
        }
        uom.setValue(details.uom)

        let num: number = +details.unitprice;
        let up = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        up = up ? up.toString() : '';
        unitprice.setValue(up)

        num = +details.quantity;
        let qty = new Intl.NumberFormat("en-GB").format(num);
        qty = qty ? qty.toString() : '';
        quantity.setValue(qty)

        num = +details.amount;
        let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        amt = amt ? amt.toString() : '';
        amount.setValue(amt)

        num = +details.discount;
        let dis = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        dis = dis ? dis.toString() : '';
        discount.setValue(dis)

        num = +details.taxable_amount;
        let taxbleamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        taxbleamt = taxbleamt ? taxbleamt.toString() : '';
        taxable_amount.setValue(taxbleamt)

        num = +details.totalamount;
        let tot = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        tot = tot ? tot.toString() : '';
        totalamount.setValue(tot)

        roundoffamt.setValue(details.roundoffamt)
        // entry_flag.setValue(details.entry_flag)

        invoiceno.setValue(details?.invoiceno)
        invoicedate.setValue(details?.invoicedate)
        suppliergst.setValue(details?.supplier_gst ? details?.supplier_gst : "")
        supplier_name.setValue(details?.supplier_name)
        pincode.setValue(details?.pincode)
        address.setValue(details?.address)
        is_capitalized.setValue(details.is_capitalized)
        if (details.is_capitalized === true) {
          this.isshowsub[i] = true;
        } else {
          this.isshowsub[i] = false;
        }
        is_capitalized_type.setValue({code :details?.is_capitalized_type,name :details?.is_capitalized_type})
        if (this.aptypeid == 13) {
          if (details?.supplier_name != undefined && details?.supplier_name != "" && details?.supplier_name != null)
            this.supplierGSTflag = true
          else
            this.supplierGSTflag = false
        }

        invdetFormArray.push(new FormGroup({
          id: id,
          grn_code: grn_code,
          productcode: productcode,
          productname: productname,
          product_id:product_id,
          description: description,
          hsn: hsn,
          hsn_percentage: hsn_percentage,
          uom: uom,
          unitprice: unitprice,
          quantity: quantity,
          amount: amount,
          taxable_amount: taxable_amount,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          discount: discount,
          taxamount: taxamount,
          totalamount: totalamount,
          roundoffamt: roundoffamt,
          is_rcmproduct: is_rcmproduct,
          is_blockedproduct: is_blockedproduct,
          is_capitalized: is_capitalized,
          // entry_flag : entry_flag,
          invoiceno: invoiceno,
          invoicedate: invoicedate,
          suppliergst: suppliergst,
          supplier_name: supplier_name,
          pincode: pincode,
          address: address,
          is_capitalized_type:is_capitalized_type

        }))
        this.prevInvVal.push(this.InvoiceDetailForm.value.invoicedtls[i])

        hsn.valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => this.service.gethsnscroll(value, 1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                  if (value === "") {

                    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('hsn_percentage').reset()
                    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('cgst').reset(0)
                    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('sgst').reset(0)
                    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('igst').reset(0)
                    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('taxamount').reset(0)
                    this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)

                  }
                }),

              )

            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.hsnList = datas;
            this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
          })

        this.valueChangesSubscription = productname?.valueChanges
          .pipe(
            debounceTime(1500),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => {
              if (!value || typeof value === 'object') {
                this.isLoading = false;
                return of([]);
              }
              let Value
              if (value.name == undefined) {
                Value = value
              } else {
                Value = value.name
              }
              return this.service.getproduct(Value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
            })
          )
          .subscribe((results: any) => {
            this.isLoading = true;
            if (results) {
              let datas = results["data"];
              this.prodList = datas;
              this.isLoading = false;
            }
          })

                this.valueChangesSubscription = is_capitalized_type?.valueChanges
              .pipe(
                debounceTime(1500),
                distinctUntilChanged(),
                tap(() => {
                  this.isLoading = true;
                }),
                switchMap(value => {
                  if (!value || typeof value === 'object') {
                    this.isLoading = false;
                    return of([]);
                  }
                  let Value
                  if (value.name == undefined) {
                    Value = value
                  } else {
                    Value = value.name
                  }
                  return this.service.getsubcatfacl(Value,1)
                    .pipe(
                      finalize(() => {
                        this.isLoading = false
                      }),
                    )
                })
              )
              .subscribe((results: any) => {
                this.isLoading = true;
                if (results) {
                  let datas = results["data"];
                  this.fa_subcategoryNameData = datas;
                  this.isLoading = false;
                }

              })

        // productname.valueChanges
        // .pipe(
        //   debounceTime(100),
        //   distinctUntilChanged(),
        //   tap(() => {
        //     this.isLoading = true;
        //   }),
        //   switchMap(value => this.service.getproduct(typeof(value== 'object') ? value.name : value)
        //     .pipe(
        //       finalize(() => {
        //         this.isLoading = false
        //       }),
        //     )
        //   )
        // )
        // .subscribe((results: any[]) => {
        //   let datas = results["data"];
        //   this.prodList = datas;
        //   this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
        // })

        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)


        unitprice.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          // this.calcTotalM(value)
          this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
          if (!this.InvoiceDetailForm.valid) {
            return;
          }

          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
        }
        )

        quantity.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          // this.calcTotalM(value)
          this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
          if (!this.InvoiceDetailForm.valid) {
            return;
          }

          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
        }
        )

        amount.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          // this.calcTotalM(value)
          this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
          if (!this.InvoiceDetailForm.valid) {
            return;
          }

          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
        }
        )

        taxamount.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          // this.calcTotalM(value)
          this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
          if (!this.InvoiceDetailForm.valid) {
            return;
          }

          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
        }
        )


        totalamount.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          // this.calcTotalM(value)
          this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
          if (!this.InvoiceDetailForm.valid) {
            return;
          }

          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
        }
        )

        discount.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {
          // this.calcTotalM(value)
          this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable_amount)
          if (!this.InvoiceDetailForm.valid) {
            return;
          }

          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
        }
        )
        i++;
      }
      this.cdtsum = this.totalamount
    }
  }

  previousCharCode: any = 0
  charCode: any = 0
  getCharCode(e) {
    this.previousCharCode = this.charCode
    this.charCode = (e.which) ? e.which : e.keyCode;
  }

  invHdrChangeToCurrency(ctrlname) {
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = this.frmInvHdr.get(ctrlname).value;
      a = a.replace(/,/g, "");
      if (a && !isNaN(+a)) {
        let num: number = +a;
        num = +(num.toFixed(2))
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(num);
        temp = temp ? temp.toString() : '';
        this.frmInvHdr.get(ctrlname).setValue(temp)
      }
    }
  }

  invhdramtDecimalChg(ctrl, ctrlname) {
    let amt = ctrl.value
    amt = amt.replace(/,/g, "");

    if (+amt >= 0) {
      let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
      temp = temp ? temp.toString() : '';
      this.frmInvHdr.get(ctrlname).setValue(temp)

    }
  }

  invDtlChangeToCurrency(ctrlname, i) {
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get(ctrlname).value;
      a = a.replace(/,/g, "");
      if (a && !isNaN(+a)) {
        let num: number = +a;
        num = +(num.toFixed(2))
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(num);
        temp = temp ? temp.toString() : '';
        this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get(ctrlname).setValue(temp)
      }
    }
  }

  invdtlamtDecimalChg(ctrl, ctrlname, i) {
    let amt = ctrl.value
    amt = amt.replace(/,/g, "");

    if (+amt >= 0) {
      if (ctrlname == 'roundoffamt') {
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
        temp = temp ? temp.toString() : '';
        this.InvoiceDetailForm.get(ctrlname).setValue(temp)
      }
      else if (ctrlname == 'otheramount') {
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
        temp = temp ? temp.toString() : '';
        this.InvoiceDetailForm.get(ctrlname).setValue(temp)
      }
      else {
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
        temp = temp ? temp.toString() : '';
        this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get(ctrlname).setValue(temp)
      }

    }
  }

  creditChangeToCurrency(ctrlname, i) {
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = this.InvoiceDetailForm.get('creditdtl')['controls'][i].get(ctrlname).value;
      a = a.replace(/,/g, "");
      if (a && !isNaN(+a)) {
        let num: number = +a;
        num = +(num.toFixed(2))
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(num);
        temp = temp ? temp.toString() : '';
        this.InvoiceDetailForm.get('creditdtl')['controls'][i].get(ctrlname).setValue(temp)
      }
    }
  }

  creditamtDecimalChg(ctrl, ctrlname, i) {
    let amt = ctrl.value
    amt = amt.replace(/,/g, "");

    if (+amt >= 0) {
      let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
      temp = temp ? temp.toString() : '';
      this.InvoiceDetailForm.get('creditdtl')['controls'][i].get(ctrlname).setValue(temp)

    }
  }

  debitChangeToCurrency(i) {
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = this.DebitDetailForm.get('debitdtl')['controls'][i].get('amt').value;
      a = a.replace(/,/g, "");
      if (a && !isNaN(+a)) {
        let num: number = +a;
        num = +(num.toFixed(2))
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(num);
        temp = temp ? temp.toString() : '';
        this.DebitDetailForm.get('debitdtl')['controls'][i].get('amt').setValue(temp)
      }
    }
  }
  debitamtDecimalChg(ctrl, ctrlname, i) {
    let amt = ctrl.value
    amt = amt.replace(/,/g, "");

    if (+amt >= 0) {
      let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
      temp = temp ? temp.toString() : '';
      this.DebitDetailForm.get('debitdtl')['controls'][i].get(ctrlname).setValue(temp)

    }
  }

  ccbsChangeToCurrency(i) {
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = this.ccbsForm.get('ccbsdtl')['controls'][i].get('amount').value;
      a = a.replace(/,/g, "");
      if (a && !isNaN(+a)) {
        let num: number = +a;
        num = +(num.toFixed(2))
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(num);
        temp = temp ? temp.toString() : '';
        this.ccbsForm.get('ccbsdtl')['controls'][i].get('amount').setValue(temp)
      }
    }
  }

  ppxChangeToCurrency(i) {
    if (this.ppxLoad == false) {
      if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
        let a = String(this.ppxForm.get('ppxdtl')['controls'][i].get('liquidate_amt').value);
        a = a.replace(/,/g, "");
        if (a && !isNaN(+a)) {
          let num: number = +a;
          num = +(num.toFixed(2))
          let temp = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(num);
          temp = temp ? temp.toString() : '';
          this.ppxForm.get('ppxdtl')['controls'][i].get('liquidate_amt').setValue(temp)
        }
      }
    }
  }

  ppxamtDecimalChg(ctrl, ctrlname, i) {
    let amt = ctrl.value
    amt = amt.replace(/,/g, "");

    if (+amt >= 0) {
      let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
      temp = temp ? temp.toString() : '';
      this.ppxForm.get('ppxdtl')['controls'][i].get(ctrlname).setValue(temp)

    }
  }

  crnCat: any;
  crnSubcat: any;
  crnGL: any;

  reductionflag = false
  prevCredVal = []
  getcreditrecords(datas) {
    this.getcredit = true
    this.crnCat = []
    this.crnSubcat = []
    this.crnGL = []
    this.selectedppxdata = []
    this.selectedcrndata = []
    // this.creditdetForm.patchValue({
    //     payment_instruction:[''],
    //     is_tds_applicable:['']
    // })
    for (let i = 0; i < datas.length; i++) {
      if (datas[i]?.paymode?.code == 'PM001' || datas[i]?.paymode?.code == 'PM004') {
        this.showaccno[i] = true
        this.paymodecode[i] = datas[i]?.paymode?.code
        //  this.getERA(datas[i]?.paymode?.id,i)
      }

      if (datas[i]?.paymode?.code == 'PM008') {
        this.showaccno[i] = true
        this.paymodecode[i] = datas[i]?.paymode?.code
      }
    }
    console.log("datas", datas);
    let creditdet = datas;
    if (creditdet != undefined) {
      let i = 0
      for (let data of creditdet) {
        let id: FormControl = new FormControl('');
        let paymode_id: FormControl = new FormControl('');
        let creditbank_id: FormControl = new FormControl('');
        let subtax_id: FormControl = new FormControl('');

        let refno: FormControl = new FormControl('');
        let suppliertaxtype: FormControl = new FormControl('');
        let suppliertaxrate: FormControl = new FormControl('');
        let taxexcempted: FormControl = new FormControl('');

        let amount: FormControl = new FormControl('');
        let taxableamount: FormControl = new FormControl('');
        let ddtranbranch: FormControl = new FormControl('');
        let credittotal: FormControl = new FormControl('');
        let ddpaybranch: FormControl = new FormControl('');

        let category_code: FormControl = new FormControl('');
        let subcategory_code: FormControl = new FormControl('');
        let bank: FormControl = new FormControl('');
        let branch: FormControl = new FormControl('');
        let ifsccode: FormControl = new FormControl('');
        let benificiary: FormControl = new FormControl('');
        let amountchange: FormControl = new FormControl('');
        let accno: FormControl = new FormControl('');
        let cc_code: FormControl = new FormControl('');
        let bs_code: FormControl = new FormControl('');
        let ccbspercentage: FormControl = new FormControl('');
        let glno: FormControl = new FormControl('');
        let debitbank_id: FormControl = new FormControl('');
        let entry_type: FormControl = new FormControl('2');


        const creditdetailformArray = this.aptypeid != 1 ? this.InvoiceDetailForm.get("creditdtl") as FormArray :
          this.InvoiceDetailForm.get("creditdtl") as FormArray

        if (i == 0) {

          this.creditdetForm.patchValue(
            {
              debitbank_id: data.debit_bankdetails ? data.debit_bankdetails : undefined
            })
        }
        id.setValue(data.id)
        paymode_id.setValue(data.paymode)

        creditbank_id.setValue(data.creditbank_id)
        this.creditids = data.creditbank_id?.id
        subtax_id.setValue(data.subtax_id)
        glno.setValue(data.glno)

      //   if(data?.paymode?.code == 'PM005' && this.aptypeid == 2){
      //   accno.setValue(data.refno)
      // }
      if(this.aptypeid == 7 || data.paymode.code =='PM002'){
        accno.setValue(data.glno)
        // paymode_id.setValue('')
        if(this.aptypeid == 7 && data?.category_code?.code != undefined ){
          paymode_id.setValue(data.paymode)
        }
        if(this.aptypeid == 7 && data?.category_code?.code == undefined ){
          paymode_id.setValue("")
        }
      if(data.paymode.code != 'PM009' && this.aptypeid != 7){
        paymode_id.setValue(data.paymode)
      }
      }else if(data.paymode.code != 'PM009'){
        paymode_id.setValue(data.paymode)
      }
      else{
        paymode_id.setValue(data.paymode)
      }
        // if(this.aptypeid == 7 || data.paymode.code =='PM002')
        //   accno.setValue(data?.refno) 

        suppliertaxtype.setValue(data.suppliertaxtype)
        suppliertaxrate.setValue(data.suppliertaxrate ==  "0.0" ? "" :data.suppliertaxrate)
        taxexcempted.setValue(data.taxexcempted == 'Y' ? 'Yes' : 'No')
    
        let num: number = +data.amount
        let amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        amount.setValue(amt)
        console.log("amount",amt)
    
        num = +data.taxableamount
        let taxbleamt = new Intl.NumberFormat("en-GB").format(num); 
        // taxbleamt = taxbleamt ? taxbleamt.toString() : '';
        taxbleamt = taxbleamt === "0" ? "" : taxbleamt;
        taxableamount.setValue(taxbleamt)

        ddtranbranch.setValue(this.transaction_branch)
        ddpaybranch.setValue(data.ddpaybranch)
        this.categoryid = data.category_code.code
        category_code.setValue(data.category_code)
        this.subcategoryid = data.subcategory_code
        subcategory_code.setValue(data.subcategory_code)
        this.bscode = data.bs_code
        bs_code.setValue(data.bs_code)
        this.cccode = data.cc_code
        cc_code.setValue(data.cc_code)


        this.bankdetailsids = data.debit_bankdetails
        debitbank_id.setValue(data.debit_bankdetails)

        console.log("data.paymode.gl_flag==", data.paymode.gl_flag)
        if (data.paymode.gl_flag == "Payable") {

          console.log(data.paymode.name)
          if (data.paymode.name == "KVBAC") {

            accno.setValue(data?.refno)
            refno.setValue(data?.refno)
            bank.setValue("KARUR VYSYA BANK")
            ifsccode.setValue("KVBL0001903")
            branch.setValue("EXPENSES MANAGEMENT CELL")
            benificiary.setValue("EXPENSES MANAGEMENT CELL")
          }
          else {
            let accdet
            if (this.aptypeid == 1 || this.aptypeid == 2 || this.aptypeid == 7 || this.aptypeid == 15 || this.aptypeid == 19
              || this.aptypeid == 18 || this.aptypeid == 16 || (this.aptypeid == 4 && this.ppxid == 'S')) {
              if (data?.supplierpayment_details == null || data?.supplierpayment_details == undefined) {
                this.notification.showError("Supplier Account Information not available.  Account No. " + data.refno + " is deactivated. Please select the Account detail")
                accno.setValue("")
                refno.setValue("")
                bank.setValue("")
                ifsccode.setValue("")
                branch.setValue("")
                benificiary.setValue("")

              }
              else if (data.supplierpayment_details.data?.length < 1) {
                this.notification.showError("Supplier Account Information not available.  Account No. " + data.refno + " is deactivated. Please select the Account Detail")
                accno.setValue("")
                refno.setValue("")
                bank.setValue("")
                ifsccode.setValue("")
                branch.setValue("")
                benificiary.setValue("")
              }
              else {
                accdet = data.supplierpayment_details["data"][0]
                accno.setValue(accdet?.account_no)
                refno.setValue(accdet?.account_no)
                bank.setValue(accdet?.bank_id?.name)
                ifsccode.setValue(accdet?.branch_id?.ifsccode)
                branch.setValue(accdet?.branch_id?.name)
                benificiary.setValue(accdet?.beneficiary)
                for (let i = 0; i < datas.length; i++) {
                  if (datas[i].refno == data.refno) {
                    this.paymodecode[i] = datas[i]?.paymode?.code
                    this.showaccno[i] = true
                    //  this.getaccno(datas[i]?.paymode?.id,i)
                  }
                }
              }
            }
            else if (this.aptypeid == 3 || (this.aptypeid == 4 && this.ppxid == 'E')) {
              if (data?.employeeaccount_details == null || data?.employeeaccount_details == undefined) {
                this.notification.showError("Employee Account Information not available.  Account No. " + data.refno + " is deactivated. Please select the Account Detail")
                accno.setValue("")
                refno.setValue("")
                bank.setValue("")
                ifsccode.setValue("")
                branch.setValue("")
                benificiary.setValue("")
              }
              else if (data?.employeeaccount_details.data?.length < 1) {
                this.notification.showError("Employee Account Information not available.  Account No. " + data.refno + " is deactivated. Please select the Account Detail")
                accno.setValue("")
                refno.setValue("")
                bank.setValue("")
                ifsccode.setValue("")
                branch.setValue("")
                benificiary.setValue("")
              }
              else {
                accdet = data.employee_account_dtls
                accno.setValue(accdet?.account_number)
                refno.setValue(accdet?.account_number)
                bank.setValue(accdet?.bank_name)
                ifsccode.setValue(accdet?.bankbranch?.ifsccode)
                branch.setValue(accdet?.bankbranch?.name)
                benificiary.setValue(accdet?.beneficiary_name)
                for (let i = 0; i < datas.length; i++) {
                  if (datas[i].refno == data.refno) {
                    this.showaccno[i] = true
                    this.paymodecode[i] = data?.paymode?.code
                    // this.getERA(data.paymode_id,i)
                    console.log("data", data)
                  }
                }

              }
            }
          }
        }
        else {
          if (i != 0 && data.glno != "151515" && data.glno != "151516" && data.glno != "151517") {
            num = +data.amount
            let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
            amt = amt ? amt.toString() : '';
            amountchange.setValue(amt)
          }
        }

        credittotal.setValue(0)
        if (data.paymode.code == 'PM006') {
          refno.setValue(data.refno)
          let advno = data.refno

          for (let j = 0; j < this.ppxdata?.length; j++) {
            if (this.ppxdata[j].crno  == advno) {
              this.selectedppxdata.push(this.ppxdata[j])
              let n = this.selectedppxdata.length - 1
              this.selectedppxdata[n].crno = advno
              this.selectedppxdata[n].liquidate_amt = data.amount
            }
          }
        }
      if(data.paymode.code == 'PM009' && this.aptypeid !=7)
      {
        refno.setValue(data.refno)
        let advno = data.refno
  
        for (let j = 0; j< this.crndata.length; j++)
        {
          if (this.crndata[j].invoiceheader_crno == advno)
          {
            this.selectedcrndata.push(this.crndata[j])
            let n = this.selectedcrndata.length-1
            this.selectedcrndata[n].liquidate_amt = data.amount
          }
        }
      }
        if (data.paymode.code == 'PM002') {
          refno.setValue(data.glno)
        }


        console.log("this.selectedppxdata==", this.selectedppxdata)
        console.log("this.selectedcrndata==",this.selectedcrndata)


        // if(data.paymode.code == 'PM010')
        // {
        //   refno.setValue(data.refno)
        //   let advno = data.refno

        //   for (let j = 0; j< this.crndata.length; j++)
        //   {
        //     if (this.crndata[j].crno == advno)
        //     {
        //       this.selectedcrndata.push(this.crndata[j])
        //       let n = this.selectedcrndata.length-1
        //       this.selectedcrndata[n].liquidate_amt = data.amount
        //     }
        //   }
        // }
        // console.log("this.selectedcrndata==",this.selectedcrndata)

        // if(data.paymode.code == 'PM011')
        // {
        //   if(data.creditglno == 0)
        //   {
        //     category_code.setValue("")  
        //     subcategory_code.setValue("")   
        //     glno.setValue(0)         
        //   }
        //   else
        //   {
        //     category_code.setValue(data.category_code)
        //     subcategory_code.setValue(data.subcategory_code)  
        //     glno.setValue(data.creditglno)  
        //   }
        //   this.crnCat.push(data.category_code)
        //   this.crnSubcat.push(data.subcategory_code)
        //   this.crnGL.push(data.creditglno)
        // }
        creditdetailformArray.push(new FormGroup({
          paymode_id: paymode_id,
          creditbank_id: creditbank_id,
          subtax_id: subtax_id,
          glno: glno,

          refno: refno,
          suppliertaxtype: suppliertaxtype,
          suppliertaxrate: suppliertaxrate,
          taxexcempted: taxexcempted,
          amount: amount,

          taxableamount: taxableamount,
          ddtranbranch: ddtranbranch,
          ddpaybranch: ddpaybranch,
          category_code: category_code,
          subcategory_code: subcategory_code,
          accno: accno,

          id: id,
          bank: bank,
          branch: branch,
          ifsccode: ifsccode,
          benificiary: benificiary,

          amountchange: amountchange,
          credittotal: credittotal,
          cc_code: cc_code,
          bs_code: bs_code,
          ccbspercentage: ccbspercentage,
          entry_type: entry_type,
          debitbank_id: debitbank_id,

        }))

        this.prevCredVal.push(this.InvoiceDetailForm.value['creditdtl'][i])
        amount.valueChanges.pipe(
          debounceTime(20)
        ).subscribe(value => {

          this.creditdatasums()
          if (!this.InvoiceDetailForm.valid) {
            return;
          }
          this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
        }
        )

        amountchange.valueChanges.pipe(
          debounceTime(500)
        ).subscribe(value => {

          this.amountReduction()
          if (!this.InvoiceDetailForm.valid) {
            return;
          }
          this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
        }
        )
        if (data.suppliertaxtype != "" && data.suppliertaxtype != undefined && data.suppliertaxtype != null) {
          this.CreditDessss(data.paymode, i, data.suppliertaxtype, true)
        }
        else {
          this.CreditDessss(data.paymode, i, "", true)
        }
        if (this.aptypeid != 2 && data.paymode?.code == 'PM008') {
          this.ICRAccNo = data.refno
          this.kvbacaccno = data.refno
        }

        i++

      }
    }

    let dta1 = this.InvoiceDetailForm.value.creditdtl

    if (dta1.length === 0) {
      const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
      control.push(this.creditdetails());

      let num: number = +this.totalamount
      let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      amt = amt ? amt.toString() : '';
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
    }
    else {
      this.creditsaved = true
      if (this.aptypeid == 7 && (datas[0].glno == "" || datas[0].glno == "0" || datas[0].glno == undefined))
        this.creditsaved = false
    }

    this.getcredit = false
    this.reductionflag = true

    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
    let chktds = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')
    if (chktds.length > 0) {
      this.tdsChoosed = true
      this.creditdetForm.patchValue({ is_tds_applicable: 0 })
    }
    else {
      this.tdsChoosed = false
      this.creditdetForm.patchValue({ is_tds_applicable: 1 })
    }
    this.creditdatasums()
    this.amountReduction()
  }

  indexvalueOninvdetails(index) {
    this.indexDet = index
  }

  addinvdtlSection() {
    if (this.aptypeid != 1) {
      const control = <FormArray>this.InvoiceDetailForm.get('invoicedtls');
      let n = control.length
      control.push(this.INVdetail());
      //this.getProduct('');
      if (this.aptypeid != 3 && this.aptypeid != 13) {
        if (this.getgstapplicable === "N") {
          this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('hsn').setValue(this.NOHSN);
          this.hsn[n] = "NO HSN"
          this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('hsn_percentage').setValue(this.NOHSN?.igstrate);
          this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('sgst').setValue(0)
          this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('cgst').setValue(0)
          this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('igst').setValue(0)
          this.InvoiceDetailForm.get('invoicedtls')['controls'][n].get('taxamount').setValue(0)
        }
      }
    }
    else {
      const control = <FormArray>this.POInvoiceForm.get('poheader');
      let n = control.length
      control.push(this.podetails());
    }
  }

  INVdetail() {
    let group = new FormGroup({
      apinvoiceheader_id: new FormControl(''),
      id: new FormControl(''),
      productcode: new FormControl(''),
      productname: new FormControl(''),
      description: new FormControl(''),
      hsn: new FormControl(''),
      hsn_percentage: new FormControl(''),
      uom: new FormControl(''),
      unitprice: new FormControl(0),
      quantity: new FormControl(0),
      amount: new FormControl(0),
      cgst: new FormControl(0),
      sgst: new FormControl(0),
      igst: new FormControl(0),
      discount: new FormControl(0),
      taxable_amount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0),
      roundoffamt: new FormControl(0),
      dtltotalamt: new FormControl(0),
      is_rcmproduct: new FormControl(''),
      is_blockedproduct: new FormControl(''),
      is_capitalized: new FormControl(this.isCaptalized),
      invoiceno: new FormControl(''),
      invoicedate: new FormControl(''),
      supplier_name: new FormControl(''),
      suppliergst: new FormControl(''),
      pincode: new FormControl(''),
      address: new FormControl(''),
      is_capitalized_type:new FormControl('')

    });

    this.valueChangesSubscription = group.get('productname')?.valueChanges
      .pipe(
        debounceTime(1500),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => {
          if (!value || typeof value === 'object') {
            this.isLoading = false;
            return of([]);
          }
          let Value
          if (value.name == undefined) {
            Value = value
          } else {
            Value = value.name
          }
          return this.service.getproduct(Value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
        })
      )
      .subscribe((results: any) => {
        this.isLoading = true;
        if (results) {
          let datas = results["data"];
          this.prodList = datas;
          this.isLoading = false;
        }
      })

      this.valueChangesSubscription = group.get('is_capitalized_type')?.valueChanges
      .pipe(
        debounceTime(1500),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => {
          if (!value || typeof value === 'object') {
            this.isLoading = false;
            return of([]);
          }
          let Value
          if (value.name == undefined) {
            Value = value
          } else {
            Value = value.name
          }
          return this.service.getproduct(Value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
        })
      )
      .subscribe((results: any) => {
        this.isLoading = true;
        if (results) {
          let datas = results["data"];
          this.fa_subcategoryNameData = datas;
          this.isLoading = false;
        }
      })


    // group.get('productname').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //   }),
    //   switchMap(value => this.service.getproduct(typeof(value== 'object') ? value.name : value)
    //     // .pipe(
    //     //   finalize(() => {
    //     //     this.isLoading = false
    //     //   }),
    //     // )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   this.isLoading = false
    //   let datas = results["data"];
    //   this.prodList = datas;
    //   this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    // })


    group.get('hsn').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.service.gethsnscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              if (value === "" || value.id === undefined) {
                this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('hsn_percentage').reset()
                this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('cgst').reset(0)
                this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('sgst').reset(0)
                this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('igst').reset(0)
                this.InvoiceDetailForm.get('invoicedtls')['controls'][this.hsnindex].get('taxamount').reset(0)
                this.calcTotalM(group);

              }
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
      })


    // group.get('uom').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.service.uomscroll(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.uomList = datas;
    //     this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    //   })


    group.get('unitprice').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      // this.datasums()
      if (!this.InvoiceDetailForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    }
    )


    group.get('quantity').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    }
    )


    group.get('taxable_amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    }
    )

    group.get('sgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    }
    )

    group.get('cgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    }
    )

    group.get('igst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    }
    )

    group.get('amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    }
    )

    group.get('taxamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    }
    )

    group.get('discount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
    }
    )
    return group;
  }

  calcTotalM(group: FormGroup) {
    const Unitprice = +String(group.controls['unitprice'].value).replace(/,/g, '');
    const quantity = +String(group.controls['quantity'].value).replace(/,/g, '');
    const discounts = +String(group.controls['discount'].value).replace(/,/g, '');
    const roundoff = +group.controls['roundoffamt'].value;
    let num = quantity * Unitprice

    let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(+num);
    amt = amt ? amt.toString() : '';
    group.controls['amount'].setValue((amt), { emitEvent: false });

    this.totaltaxable = +num - discounts
    let tottax = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.totaltaxable);
    tottax = tottax ? tottax.toString() : '';
    group.controls['taxable_amount'].setValue((tottax), { emitEvent: false });

    let taxamount = +String(group.controls['taxamount'].value).replace(/,/g, '');
    this.overalltotal = this.totaltaxable + taxamount

    num = +this.overalltotal
    let tot = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    tot = tot ? tot.toString() : '';
    group.controls['totalamount'].setValue((tot), { emitEvent: false });
    this.INVdatasums();
  }


  public displayFnuom(uomtype?: uomlistss): string | undefined {
    return uomtype ? uomtype.name : undefined;
  }

  get uomtype() {
    return this.InvoiceDetailForm.get('uom');
  }

  getuom(uomkeyvalue) {
    this.service.getuom(uomkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomList = datas;
        // console.log("uomList", datas)

      })
  }

  // uomScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matuomAutocomplete &&
  //       this.matuomAutocomplete &&
  //       this.matuomAutocomplete.panel
  //     ) {
  //       fromEvent(this.matuomAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matuomAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matuomAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matuomAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matuomAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.service.uomscroll(this.uomInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   if (this.uomList.length >= 0) {
  //                     this.uomList = this.uomList.concat(datas);
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  public displayFnProduct(product?: prodlistss): string | undefined {

    return product ? product.name : undefined;
  }

  getProduct(keyvalue) {
    this.isLoading = true
    this.service.getproduct(keyvalue)
      .subscribe((results: any[]) => {
        this.isLoading = false
        let datas = results["data"];
        this.prodList = datas;
        console.log("this.prodList..", this.prodList)
      })
  }

  productClear(ind) {
    this.product[ind] = {}
    this.hsn[ind] = {}
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('productname').setValue("");
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn').setValue("");
    this.showrcm[ind] = false
  }

  prodChange = [false, false, false, false, false, false]
  prodRcm = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  prodBlock = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  product = [{}, {}, {}, {}, {}, {}]
  hsn = [{}, {}, {}, {}, {}, {}]
  showrcm = [false, false, false, false, false, false, false, false, false, false, false]
  productChange(prod: any, ind) {
    this.showrcm[ind] = true
    this.prodChange[ind] = true
    this.prodRcm[ind] = prod.product_isrcm == 'Y' ? 'Yes' : 'No'
    this.prodBlock[ind] = prod.product_isblocked == 'Y' ? 'Yes' : 'No'
    this.product[ind] = prod

    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('is_rcmproduct').setValue(prod.product_isrcm);
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('is_blockedproduct').setValue(prod.product_isblocked);

    console.log("prod value...", prod)
    console.log(prod.product_isrcm)
    if (prod.product_isrcm == "Y") {
      this.productRCMflag = true
    }
    else {
      this.productRCMflag = false
    }


    if (this.productRCMflag || this.prodBlock[ind] == 'Yes') {
      const invdate = new Date(this.frmInvHdr?.value?.invoicedate);
      const currDate = new Date();
      invdate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      if (invdate < currDate) {
        if (!window.confirm('RCM Invoices should be paid within 60 days from the date of Invoice"')) {
          return false
        }
      }
    }
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('uom').setValue(prod.uom_id.name)

    // if(this.productRCMflag == true )
    // {
    //   this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn').setValue(prod.hsn_id);	
    //   this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(prod.hsn_id.igstrate);
    //   this.getgst(ind)
    // }

    if (this.productRCMflag || this.prodBlock[ind] == 'Yes' ||
      (this.productRCMflag == false && this.getgstapplicable == "N" && this.aptypeid != 3 && this.aptypeid != 13)) {
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn').setValue(this.NOHSN);
      this.hsn[ind] = this.NOHSN
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(this.NOHSN?.igstrate);
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('sgst').setValue(0)
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('cgst').setValue(0)
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('igst').setValue(0)
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('taxamount').setValue(0)
    }
    else {
      const hsnObj = prod?.hsn_id ? prod.hsn_id : { id: null, code: this.NOHSN, igstrate: this.NOHSN?.igstrate ?? 0 };
      this.hsn[ind] = hsnObj;
      this.hsn[ind] = prod?.hsn_id ? prod?.hsn_id : this.NOHSN
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn').setValue(prod?.hsn_id ? prod?.hsn_id : this.NOHSN);
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(prod?.hsn_id?.igstrate ? prod?.hsn_id?.igstrate : this.NOHSN?.igstrate);
      // this.getgst(ind)
        if (hsnObj.id) {
          this.getgst(ind);
        }
    }
  }


  public displayFnhsn(hsntype?: hsnlistss): string | undefined {
    return hsntype ? hsntype.code : undefined;
  }

  get hsntype() {
    return this.InvoiceDetailForm.get('hsn');
  }

  hsnpercent: any
  hsncode: any
  gethsn(hsnkeyvalue) {
    this.service.gethsn(hsnkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
        console.log("hsnList", datas)
      })
  }

  gethsncode(hsn, ind) {
    this.hsn[ind] = hsn
    this.hsnpercent = hsn.igstrate
    this.hsncode = hsn.code
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(this.hsnpercent)
  }
    getpohsncode(hsn, ind) {
    this.hsn[ind] = hsn
    this.hsnpercent = hsn.igstrate
    this.hsncode = hsn.code
    this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('hsn_percentage').setValue(this.hsnpercent)
  }

  hsnScroll() {
    setTimeout(() => {
      if (
        this.mathsnAutocomplete &&
        this.autocompleteTrigger &&
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
                this.service.gethsnscroll(this.hsnInput.nativeElement.value, this.currentpage + 1)
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

  getgst(index) {
    if ((this.movedata == 'AP' || this.movedata == 'apapproverview')) {
      if (this.frmInvHdr.get('invoicegst').value == true) {
        this.getgstapplicable = 'Y'
        console.log("The Gst Is Applicable")
      }
      if (this.frmInvHdr.get('invoicegst').value == false) {
        this.getgstapplicable = 'N'
        console.log("  Not Applicable")
      }
    }
    if (this.productRCMflag || this.prodBlock[index] == 'Yes')
      return false
    if ((this.aptypeid === 7 && this.getgstapplicable !== "N") || (this.aptypeid === 3 && this.getgstapplicable !== "N") ||
     (this.aptypeid === 1 && this.getgstapplicable !== "N") ||
      (this.aptypeid === 13 && this.getgstapplicable !== "N") || (this.aptypeid === 2 && this.getgstapplicable !== "N") ||
      (this.aptypeid === 14 && this.getgstapplicable !== "N") && this.aptypeid !== 4 && this.aptypeid !== 8) {
      const overalloffIND = this.InvoiceDetailForm.value.invoicedtls;
      console.log("overalloffIND.....", overalloffIND)
      if (this.prodChange[index] || (!this.prodChange[index] && this.getgstapplicable === "Y")) {
        this.hsncodess = overalloffIND[index]?.hsn?.code;
        console.log("this.hsncodess...", this.hsncodess)
        const hsnObj = overalloffIND[index]?.hsn;
        let id = hsnObj.id ?? null;
        let unit = String(overalloffIND[index].unitprice).replace(/,/g, '')
        let units = Number(unit)
        let qtyy: any = Number(String(overalloffIND[index].quantity).replace(/,/g, ''))
        let dis = Number(String(overalloffIND[index].discount).replace(/,/g, ''))
        if (qtyy === null || qtyy === undefined) {
          qtyy = 0
        }

        if ((this.hsncodess === "" || this.hsncodess === undefined || this.hsncodess === null)
          || (qtyy === "" || qtyy === undefined || qtyy === null)
          || (unit === "" || unit === undefined || unit === null) ||
          (this.gsttype === "" || this.gsttype === undefined || this.gsttype === null)) {
          return false
        }

        if ((this.hsncodess !== "" || this.hsncodess !== undefined || this.hsncodess !== null)
          || (qtyy !== "" || qtyy !== undefined || qtyy !== null)
          || (unit !== "" || unit !== undefined || unit !== null)
          || (this.gsttype !== "" || this.gsttype !== undefined || this.gsttype !== null)) {
          let json = {
            "id": id,
            "code": this.hsncodess,
            "unitprice": units,
            "qty": qtyy,
            "discount": dis,
            "type": this.gsttype
          }
          console.log("jsoooon", json)
          this.spinner.show()
          this.service.GSTcalculation(json)
            .subscribe(result => {
              this.spinner.hide()
              // console.log("gstttres", result)
              this.igstrate = result.igst
              this.sgstrate = result.sgst
              this.cgstrate = result.cgst

              this.totaltax = this.igstrate + this.sgstrate + this.cgstrate


              let num: number = +(this.igstrate)
              let igstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              igstt = igstt ? igstt.toString() : '';


              num = +(this.sgstrate)
              let sgstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              sgstt = sgstt ? sgstt.toString() : '';


              num = +(this.cgstrate)
              let cgstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              cgstt = cgstt ? cgstt.toString() : '';

              num = +(this.totaltax)
              let tot = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              tot = tot ? tot.toString() : '';

              this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('igst').setValue(igstt)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('sgst').setValue(sgstt)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('cgst').setValue(cgstt)
              this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('taxamount').setValue(tot)






            })
        }
      }
    }



    // }
  }
  // getgst(data, index) {
  //   // console.log("hsndataaa", data)
  //    if (this.getgstapplicable === "Y" ) {
  //     let overalloffIND = this.InvoiceDetailForm.value.invoicedtls;

  //     this.hsncodess = overalloffIND[index].hsn.code;

  //     let unit = overalloffIND[index].unitprice
  //     let units = Number(unit)
  //     let qtyy = overalloffIND[index].quantity
  //     if (qtyy === null || qtyy === undefined) {
  //       qtyy = 0
  //     }

  //     if ((this.hsncodess === "" || this.hsncodess === undefined || this.hsncodess === null)
  //       || (qtyy === "" || qtyy === undefined || qtyy === null)
  //       || (unit === "" || unit === undefined || unit === null)) {
  //       return false
  //     }


  //     if ((this.hsncodess !== "" || this.hsncodess !== undefined || this.hsncodess !== null)
  //       || (qtyy !== "" || qtyy !== undefined || qtyy !== null)
  //       || (unit !== "" || unit !== undefined || unit !== null)) {

  //       let json = {
  //         "code": this.hsncodess,
  //         "unitprice": units,
  //         "qty": qtyy,
  //         "discount": 0,
  //         "type": this.type
  //       }
  //       // console.log("jsoooon", json)
  //       this.service.GSTcalculation(json)
  //         .subscribe(result => {
  //           // console.log("gstttres", result)
  //           this.igstrate = result.igst
  //           this.sgstrate = result.sgst
  //           this.cgstrate = result.cgst

  //           this.totaltax = this.igstrate + this.sgstrate + this.cgstrate


  //           this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('sgst').setValue(this.sgstrate)
  //           this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('cgst').setValue(this.cgstrate)
  //           this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('igst').setValue(this.igstrate)
  //           this.InvoiceDetailForm.get('invoicedtls')['controls'][index].get('taxamount').setValue(this.totaltax)
  //         })
  //     }
  //    }
  // }

  calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, discount, taxable) {
    if (this.aptypeid != 1) {
      const Quantity = Number(String(quantity.value).replace(/,/g, ''))
      const unitsprice = Number(String(unitprice.value).replace(/,/g, ''))
      const taxAmount = Number(String(taxamount.value).replace(/,/g, ''))
      const discounts = Number(String(discount.value).replace(/,/g, ''))
      let amt = (Quantity * unitsprice).toFixed(2)

      let num: number = +amt
      let tottax = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      tottax = tottax ? tottax.toString() : '';
      amount.setValue((tottax), { emitEvent: false });

      let taxblenum = +amt - discounts
      let taxbleamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(taxblenum);
      taxbleamt = taxbleamt ? taxbleamt.toString() : '';
      taxable.setValue((taxbleamt), { emitEvent: false });

      num = +(+taxblenum + taxAmount)
      let fixnum = num.toFixed(2)
      let tot = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(+fixnum);
      tot = tot ? tot.toString() : '';
      this.overalltotal = tot;
      totalamount.setValue((this.overalltotal), { emitEvent: false });
    }
    else {
      const Quantity = Number(String(quantity.value).replace(/,/g, ''))
      const unitsprice = Number(String(unitprice.value).replace(/,/g, ''))
      const taxAmount = Number(String(taxamount.value).replace(/,/g, ''))
      const discounts = Number(String(discount.value).replace(/,/g, ''))
      let amt = (Quantity * unitsprice).toFixed(2)

      let num: number = +amt
      let tottax = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      tottax = tottax ? tottax.toString() : '';
      amount.setValue((tottax), { emitEvent: false });

      let taxblenum = +amt - discounts
      let taxbleamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(taxblenum);
      taxbleamt = taxbleamt ? taxbleamt.toString() : '';
      taxable.setValue((taxbleamt), { emitEvent: false });

      num = +(+taxblenum + taxAmount)
      let fixnum = num.toFixed(2)
      let tot = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(+fixnum);
      tot = tot ? tot.toString() : '';
      this.overalltotal = tot;
      totalamount.setValue((this.overalltotal), { emitEvent: false });
      // let taxable = (Quantity * unitsprice).toFixed(2)

      // let num: number = +taxable
      // let tottax = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      // tottax = tottax ? tottax.toString() : '';
      // amount.setValue((tottax), { emitEvent: false });
      // totalamount.setValue((tottax), { emitEvent: false });
    }

    this.INVdatasums();
  }

  getinvdtlSections(forms) {
    return forms.controls.invoicedtls.controls;
  }

  removeinvdtlSection(i) {
    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtls');
    control.removeAt(i);
    this.notification.showSuccess("Invoice Detail line deleted Successfully")
    this.INVdatasums()
  }
  Roundoffsamount: any
  OtherAmount: any
  INVdatasums() {
    this.INVamt = this.InvoiceDetailForm.value['invoicedtls'].map(x => Number((String(x.totalamount).replace(/,/g, ''))));
    let taxableamts = this.InvoiceDetailForm.value['invoicedtls'].map(x => Number((String(x.taxable_amount).replace(/,/g, ''))));
    this.totaltaxable =  taxableamts.reduce((a, b) => a + b,0).toFixed(2) ;
    this.Roundoffsamount = Number(this.InvoiceDetailForm.value.roundoffamt)
    this.OtherAmount = Number(this.InvoiceDetailForm.value.otheramount)
    let INVsum = (this.INVamt.reduce((a, b) => a + b, 0));
    this.INVsum = INVsum+Number(this.Roundoffsamount)+ + this.OtherAmount
    let num: number = +this.INVsum;
    this.INVsum = +(num.toFixed(2))
    if (this.INVsum > 0)
      this.totalamount = this.INVsum
    console.log('this.INVsum', this.INVsum);
  }

  invdtladdonid: any
  invdtltaxableamount: any
  invdtloverallamount: any
  invdtltaxamount: any
  cgstval: any
  sgstval: any
  igstval: any
  gettaxrate: any


  getsupplierindex(index, section) {
    this.popupopen3();
    this.invsupplierdataindex = index

    this.SupplierDetailForm.patchValue({
      suppliergst: section?.value?.suppliergst,
      invoiceno: section?.value?.invoiceno,
      invoicedate: section?.value?.invoicedate,
      supplier_name: section?.value?.supplier_name,
      pincode: section?.value?.pincode,
      address: section?.value?.address
    })
  }
  suppliersubmitForm() {
    console.log("suppdetform", this.SupplierDetailForm.value)
    const supplierName = this.SupplierDetailForm.controls['supplier_name'].value;
    const pincode = String(this.SupplierDetailForm.controls['pincode'].value);
    const Address = this.SupplierDetailForm.controls['address'].value;
    console.log("supplierName", supplierName)
    if (this.getgstapplicable == 'Y' && this.SupplierDetailForm.value.suppliergst == "" || this.SupplierDetailForm.value.suppliergst == null || this.SupplierDetailForm.value.suppliergst == undefined) {
      this.notification.showError("Please Enter Supplier Gst No");
      return false;
    }
    if (supplierName == "" || supplierName == null || supplierName == undefined) {
      this.notification.showError("Please Enter Supplier Name");
      return false;
    }
    if (pincode == "" || pincode == null || pincode == undefined) {
      this.notification.showError("Please Enter Pincode");
      return false;
    }
    if (this.SupplierDetailForm.value.invoiceno == "" || this.SupplierDetailForm.value.invoiceno == null || this.SupplierDetailForm.value.invoiceno == undefined) {
      this.notification.showError("Please Enter Invoice No");
      return false;
    }
    if (this.SupplierDetailForm.value.invoicedate == "" || this.SupplierDetailForm.value.invoicedate == null || this.SupplierDetailForm.value.invoicedate == undefined) {
      this.notification.showError("Please Choose Date");
      return false;
    }
    if (Address == "" || Address == null || Address == undefined) {
      this.notification.showError("Please Enter Address");
      return false;
    }
    if (pincode.length != 6) {
      window.alert("Pincode Must be Six Digits")
      return false
    }
    // if (this.aptypeid == 13 && this.getgstapplicable == 'Y' && this.GSTtext != "Valid GST"){
    //   window.confirm("Do you want to proceed without valid GST number?")
    //   if(!confirm)
    //     return false
    // }
    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.invsupplierdataindex].get('invoiceno').setValue(this.SupplierDetailForm.value.invoiceno)
    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.invsupplierdataindex].get('supplier_name').setValue(supplierName)
    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.invsupplierdataindex].get('pincode').setValue(pincode)
    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.invsupplierdataindex].get('suppliergst').setValue(this.SupplierDetailForm.value.suppliergst)
    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.invsupplierdataindex].get('invoicedate').setValue(this.SupplierDetailForm.value.invoicedate)
    this.InvoiceDetailForm.get('invoicedtls')['controls'][this.invsupplierdataindex].get('address').setValue(Address)

    this.frmInvHdr.patchValue({
      supName: this.SupplierDetailForm.value.supplier_name,
      supGST: this.SupplierDetailForm.value.suppliergst
    })
    if (this.aptypeid == 13 && this.getgstapplicable == 'Y' && this.movedata != 'apapproverview') {
      this.service.GetpettycashGSTtype(this.SupplierDetailForm.value.suppliergst, this.branchGST)
        .subscribe(result => {
          this.gsttype = result['Gsttype']
          this.type = result['Gsttype']
          this.getgst(this.invsupplierdataindex)
        })

      this.gstAppl = true
    }
    this.supclosebuttons.nativeElement.click();
    this.supplierGSTflag = true
  }
  supplierResetform() {
    this.SupplierDetailForm.controls['supplier_name'].enable();
    this.SupplierDetailForm.controls['pincode'].enable();
    this.SupplierDetailForm.controls['address'].enable();
    this.SupplierDetailForm.controls['invoiceno'].enable()
    this.SupplierDetailForm.controls['invoicedate'].enable()
    this.SupplierDetailForm.controls['address'].enable()
    this.SupplierDetailForm.controls['suppliergst'].reset("")
    this.SupplierDetailForm.controls['supplier_name'].reset("")
    this.SupplierDetailForm.controls['pincode'].reset("")
    this.SupplierDetailForm.controls['invoiceno'].reset("")
    this.SupplierDetailForm.controls['invoicedate'].reset("")
    this.SupplierDetailForm.controls['address'].reset("")
    this.GSTtext = ""
  }
  supplierbackform() {
    this.supclosebuttons.nativeElement.click();
  }

  adddebits(section, data, index) {
    let invdtldatas = this.invoicedetailsdata

    if (invdtldatas[index].productname != section.value.productname) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].description != section.value.description) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].hsn != section.value.hsn.code) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].hsn_percentage != section.value.hsn_percentage) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].uom.name != section.value.uom.name) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].unitprice != section.value.unitprice) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].quantity != section.value.quantity) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].amount != section.value.amount) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].cgst != section.value.cgst) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].sgst != section.value.sgst) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].igst != section.value.igst) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].taxamount != section.value.taxamount) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else if (invdtldatas[index].totalamount != section.value.totalamount) {
      this.notification.showInfo("Please save the changes you have done")
      this.showdebitpopup = false
      return false

    }
    else {
      // this.adddebit(section, data, index)

    }
  }


  getdebitresrecords: any
  getdebittdatas: any
  creditslno: any
  creditslnos: any
  showdefaultslno: boolean
  showaltslno: boolean
  debitdata: any[]
  isCaptalized: boolean
  ICRAccNo: string = ''
  getinvindex: any
  invdtladdonIndex: any
  RoundOffandOtherSum: any = 0
  isCapitalizedArr :any
  adddebit(section, data, index) {
    if (!this.invdtlsaved) {
      this.notification.showError("Kindly save Invoice Detail")
      return false
    }
    this.invdtladdonIndex = index
    this.debitsaved = this.debitSectionSaved[index]
    let datas = this.DebitDetailForm.get('debitdtl') as FormArray
    datas.clear()
    if ((Number(this.Roundoffsamount) != 0 || Number(this.OtherAmount) != 0))
      this.RoundOffandOtherSum = +this.Roundoffsamount + +this.OtherAmount

    // console.log("debitsec", section)
    if (this.invoicedetailsdata != undefined && this.invoicedetailsdata[index] != undefined) {
      let datas = this.invoicedetailsdata[index]
      this.invdtltaxableamount = this.invoicedetailsdata[index].taxable_amount
      if (index == 0)
        this.invtotamount = +((+this.invoicedetailsdata[index].totalamount + +this.RoundOffandOtherSum).toFixed(2))
      else
        this.invtotamount = +this.invoicedetailsdata[index].totalamount

      this.invdtltaxamount = this.invoicedetailsdata[index].taxamount
      this.cgstval = +String(this.invoicedetailsdata[index].cgst).replace(/,/g, '')
      this.sgstval = +String(this.invoicedetailsdata[index].sgst).replace(/,/g, '')
      this.igstval = +String(this.invoicedetailsdata[index].igst).replace(/,/g, '')
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = datas.id
      this.isCaptalized =this.invoicedetailsdata[index].is_capitalized 
      this.isCapitalizedArr = this.invoicedetailsdata[index].is_capitalized ? 1 : 0;
      console.log( this.isCapitalizedArr)
    }
    else {
      let sections = section.value
      this.invdtltaxableamount = sections.taxable_amount
      if (index == 0)
        this.invtotamount = +((Number(String(sections.totalamount).replace(/,/g, '')) + +this.RoundOffandOtherSum).toFixed(2))
      else
        this.invtotamount = Number(String(sections.totalamount).replace(/,/g, ''))
      this.invdtltaxamount = sections.taxamount
      this.cgstval = +String(sections.cgst).replace(/,/g, '')
      this.sgstval = +String(sections.sgst).replace(/,/g, '')
      this.igstval = +String(sections.igst).replace(/,/g, '')
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = sections.id
      this.isCaptalized = sections.is_capitalized
      this.isCapitalizedArr = sections.is_capitalized ? 1 : 0;
      console.log(this.isCapitalizedArr)
    }
    if (this.invdtladdonid == undefined || this.invdtladdonid == "") {
      this.notification.showWarning("Please save the Invoice Detail Changes")
      this.spinner.hide();
      return false;
    }
    else {
      this.spinner.show();
      this.service.getDebitCredit(this.apinvHeader_id, this.invdtladdonid, 1)
        .subscribe(result => {
          this.spinner.hide();
          console.log("getInvdebit", result)
          if (result) {
            this.showinvoicediv = false
            this.showdebitdiv = true
            let data = result.data
            this.debitdata = data.filter(x => x.is_display == "YES" && x.amount >= 0)
            let dbtdataas = this.debitdata

            // this.service.getautobscc(this.raisedbyid).subscribe(results => {

            //   if (results?.business_segment?.id != undefined && results?.cost_centre?.id != undefined) {
            //     let bsccdata = results
            //     for (let i in dbtdataas) {
            //       if(dbtdataas[i]?.category_code?.code != 'GST'){
            //       this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs_code').setValue(bsccdata?.business_segment)
            //       this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc_code').setValue(bsccdata?.cost_centre)
            //       }
            //     }
            //   }
            // })
            this.getinvindex = index
            this.getdebitrecords(this.debitdata)
          }
        })
    }


  }

  filterdebitinvdtl(debitdata, invdtlid): any[] {
    let debitdtl = []
    debitdtl = debitdata.filter(data => data.apinvoicedetail == invdtlid && data.amount !== 0)
    return debitdtl
  }

  getExpenseCat(cat) {
    if (this.expenseTaxID != undefined)
      this.DebitDetailForm.get('debitdtl')['controls'][this.expenseTaxID].get('category_code').setValue(cat)
  }

  getExpenseBs(bs) {
    if (this.expenseTaxID != undefined)
      this.DebitDetailForm.get('debitdtl')['controls'][this.expenseTaxID].get('bs_code').setValue(bs)
  }
  getExpenseCc(cc) {
    if (this.expenseTaxID != undefined)
      this.DebitDetailForm.get('debitdtl')['controls'][this.expenseTaxID].get('cc_code').setValue(cc)
  }

  getExpenseSubcat(subcat) {
    if (this.expenseTaxID != undefined)
      this.DebitDetailForm.get('debitdtl')['controls'][this.expenseTaxID].get('subcategory_code').setValue(subcat)
  }
  expenseTaxID: any
  prevDebVal = []

  debitmodified = false
  getdebitrecords(datas) {
    this.prevDebVal = []

    let debitcontrol = this.DebitDetailForm.controls["debitdtl"] as FormArray;
    debitcontrol.clear()
    console.log("dbtdara", datas)
    // if(datas.length == 0){
    //   const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    //   control.push(this.debitdetail());
    // }
    if (datas.length === 0) {
      let catdata = {
        "code": "GST Tax",
        "id": 232,
        "name": "GST TAX"
      }

      let igstdata = {
        "code": "IGST",
        "id": 1251,
        "glno": 179000065,
        "name": "IGST"
      }

      let cgstdata = {
        "code": "CGST",
        "id": 1252,
        "glno": 179000045,
        "name": "CGST"
      }
      let sgstdata = {
        "code": "SGST",
        "id": 1253,
        "glno": 179000035,
        "name": "SGST"
      }
      let ccdata = {
        "code": "003",
        "id": 218,
        "name": "GST"

      }

      let bs_code = {
        "code": "0",
        "id": 52,
        "name": "GST",
        "no": 0
      }
      let cc_code = {
        "code": "0",
        "id": 218,
        "name": "GST",
        "no": 0
      }

      let taxamt: number = +String(this.InvoiceDetailForm.value.invoicedtls[this.getinvindex].taxamount).replace(/,/g, '')
      for (let i = 0; i <= 2; i++) {
        if (i === 0 && this.getgstapplicable == "Y") {
          if (this.aptypeid == 7) {
            this.service.getcat('suspense', this.aptypeid)
              .subscribe((results: any[]) => {
                let datas = results["data"];
                let crncat = datas.filter(x => x.id == 235)[0];
                let crnsubcat
                this.catid = crncat.id;
                this.service.getsubcat(this.catid, 'emc')
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    crnsubcat = datas[0];
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(crncat)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(crnsubcat)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('glno').setValue(crnsubcat.glno)

                  })

              })
          }
          this.adddebitSection()
          this.readonlydebit[i] = false

          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amt').setValue(this.invdtltaxableamount)
          this.debitdatasums()
        }

        if ((i == 1 && this.getgstapplicable == "Y") &&
          (this.gstchangeflag[this.getinvindex] == false && this.type === "IGST") || (this.gstchangeflag[this.getinvindex] == true && this.type === "SGST & CGST")) {
          this.adddebitSection()
          this.readonlydebit[i] = true

          this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(igstdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('glno').setValue(igstdata.glno)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs_code').setValue(bs_code)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc_code').setValue(cc_code)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.igstval)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')

          let dbtamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(taxamt);
          dbtamt = dbtamt ? dbtamt.toString() : '';
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(dbtamt)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amt').setValue(dbtamt)
        }
        if ((i == 1 && this.getgstapplicable == "Y") &&
          (this.gstchangeflag[this.getinvindex] == false && this.type === "SGST & CGST") || (this.gstchangeflag[this.getinvindex] == true && this.type === "IGST")) {
          this.adddebitSection()
          this.readonlydebit[i] = true

          this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(cgstdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('glno').setValue(cgstdata.glno)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs_code').setValue(bs_code)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc_code').setValue(cc_code)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.cgstval)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')

          let dbtamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(taxamt / 2);
          dbtamt = dbtamt ? dbtamt.toString() : '';
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(dbtamt)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amt').setValue(dbtamt)
        }

        if ((i == 2 && this.getgstapplicable == "Y") &&
          (this.gstchangeflag[this.getinvindex] == false && this.type === "SGST & CGST") || (this.gstchangeflag[this.getinvindex] == true && this.type === "IGST")) {
          this.adddebitSection()
          this.readonlydebit[i] = true

          this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(catdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(sgstdata)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('glno').setValue(sgstdata.glno)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs_code').setValue(bs_code)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc_code').setValue(cc_code)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.sgstval)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')

          let dbtamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(taxamt / 2);
          dbtamt = dbtamt ? dbtamt.toString() : '';
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(dbtamt)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amt').setValue(dbtamt)
        }
        if (this.igstval == 0 && this.cgstval == 0 && this.sgstval == 0 && i == 0 && this.getgstapplicable == "N") {
          this.adddebitSection()
          if (this.aptypeid == 7) {
            this.service.getcat('suspense', this.aptypeid)
              .subscribe((results: any[]) => {
                let datas = results["data"];
                let crncat = datas.filter(x => x.id == 235)[0];
                let crnsubcat
                this.catid = crncat.id;
                this.service.getsubcat(this.catid, 'emc')
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    crnsubcat = datas[0];
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(crncat)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(crnsubcat)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('glno').setValue(crnsubcat.glno)

                  })

              })
          }
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invtotamount)
          this.debitdatasums()
        }
      }
    }
    else {
      let i = 0
      let flg = false
      if (this.aptypeid != 4 && this.aptypeid != 1) {
        let totaltax: number = +this.InvoiceDetailForm.value.invoicedtls[this.getinvindex].taxamount;
        totaltax = +(totaltax.toFixed(2))

        let cgst: number = +this.InvoiceDetailForm.value.invoicedtls[this.getinvindex].cgst;
        cgst = +(cgst.toFixed(2))

        let sgst: number = +this.InvoiceDetailForm.value.invoicedtls[this.getinvindex].sgst;
        sgst = +(sgst.toFixed(2))

        let igst: number = +this.InvoiceDetailForm.value.invoicedtls[this.getinvindex].igst;
        igst = +(igst.toFixed(2))

        if (this.getgstapplicable == 'Y' && this.gsttype == 'SGST & CGST' && Math.abs(totaltax) == Math.abs(igst)) {
          this.gstchangeflag[this.getinvindex] = true
        }
        else if (this.getgstapplicable == 'Y' && this.gsttype == 'IGST' && Math.abs(totaltax) == Math.abs(cgst + sgst)) {
          this.gstchangeflag[this.getinvindex] = true
        }
        else {
          this.gstchangeflag[this.getinvindex] = false
        }

        let debitgstchangeflag = false
        if (this.gstchangeflag[this.getinvindex] == true && (this.gsttype == 'SGST & CGST' && datas.length == 3) || (this.gsttype == 'IGST' && datas.length == 2)) {
          debitgstchangeflag = true
          this.debitmodified = true
        }

        let deldeb
        if (this.gsttype == 'SGST & CGST' && this.gstchangeflag[this.getinvindex] == true) {
          deldeb = datas.filter(x => x.subcategory_code.code == 'SGST')[0]?.id
          if (deldeb != undefined && deldeb != null) {
            this.service.credDebitDel(deldeb)
              .subscribe(result => {
                console.log(result?.status)
                if (result.status == "success") {
                  this.removedebitSection(2, false)
                  datas = datas.filter(x => x.id != deldeb)
                }
              })
          }

        }
      }
      for (let debit of datas) {
        let id: FormControl = new FormControl('');
        let apinvoicedetail_id: FormControl = new FormControl('');
        let category_code: FormControl = new FormControl('');
        let subcategory_code: FormControl = new FormControl('');
        let glno: FormControl = new FormControl('');
        let gldesc: FormControl = new FormControl('');
        // let bsproduct_code: FormControl = new FormControl('');
        // let bsproduct_code_id: FormControl = new FormControl('');
        let amt: FormControl = new FormControl('');
        let amount: FormControl = new FormControl('');
        let deductionamount: FormControl = new FormControl(0);
        let bs_code: FormControl = new FormControl('');
        let cc_code: FormControl = new FormControl('');
        let ccbspercentage: FormControl = new FormControl('');
        let taxableamount: FormControl = new FormControl(0);
        let entry_type: FormControl = new FormControl('1');
        let paymode_id: FormControl = new FormControl('8');
        const debitFormArray = this.DebitDetailForm.get("debitdtl") as FormArray;

        id.setValue(debit.id)
        apinvoicedetail_id.setValue(debit.apinvoicedetail_id)
        let code = (debit.category_code?.code ? debit.category_code?.code : "").toLowerCase().trim()
        let subcode = (debit.subcategory_code?.code ? debit.subcategory_code?.code : "").toLowerCase().trim()
        if (code == null || code == "dummy" || code.indexOf("unexpected error") >= 0 || code.indexOf("unexpected_error") >= 0 || code.indexOf("invalid_data") >= 0) {
          category_code.setValue("")
          glno.setValue("")
        }
        else {

          if (this.location != null && this.invSubmitFlag && (subcode.indexOf("CGST") >= 0 || subcode.indexOf("SGST") >= 0 || subcode.indexOf("IGST") >= 0)) {
            category_code.setValue(this.location.category_code)
          }
          else {
            category_code.setValue(debit.category_code)
            glno.setValue(debit.glno)
          }
        }

        if (subcode == "dummy" || subcode.indexOf("unexpected error") >= 0 || subcode.indexOf("unexpected_error") >= 0 || subcode.indexOf("invalid_data") >= 0) {
          subcategory_code.setValue("")
          glno.setValue("")
        }
        else {
          if (this.location != null && this.invSubmitFlag && subcode.indexOf("CGST") >= 0) {
            subcategory_code.setValue(this.location.cgst_code)
            glno.setValue(this.location.cgst_code.glno)
          }
          else if (this.location != null && this.invSubmitFlag && subcode.indexOf("SGST") >= 0) {
            subcategory_code.setValue(this.location.sgst_code)
            glno.setValue(this.location.sgst_code.glno)
          }
          else if (this.location != null && this.invSubmitFlag && subcode.indexOf("IGST") >= 0) {
            subcategory_code.setValue(this.location.igst_code)
            glno.setValue(this.location.igst_code.glno)
          }
          else if (this.gstchangeflag[this.getinvindex] == true && this.gsttype == 'SGST & CGST' && i != 0) {
            subcategory_code.setValue({
              "code": "IGST",
              "gl_description": "INPUT TAX CREDIT-IGST",
              "glno": 179000065,
              "id": 1251,
              "name": "IGST",
              "no": "997"
            })
            glno.setValue(179000065)
            bs_code.setValue({
              "code": "0",
              "id": 52,
              "name": "GST",
              "no": 0
            })
            cc_code.setValue({
              "code": "0",
              "id": 218,
              "name": "GST",
              "no": 0
            })
            ccbspercentage.setValue(100)
            gldesc.setValue('INPUT TAX CREDIT-IGST/UTGST')
            let num = +String(this.InvoiceDetailForm.value.invoicedtls[this.getinvindex].taxamount).replace(/,/g, '');
            let dbtamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
            dbtamt = dbtamt ? dbtamt.toString() : '';
            amt.setValue(dbtamt)
            amount.setValue(dbtamt)
          }
          else if (this.gstchangeflag[this.getinvindex] == true && this.gsttype == 'IGST' && i != 0) {
            subcategory_code.setValue({
              "code": "CGST",
              "gl_description": "INPUT TAX CREDIT-CGST",
              "glno": 179000045,
              "id": 1252,
              "name": "CGST",
              "no": "998"
            })
            glno.setValue(179000045)
            bs_code.setValue({
              "code": "0",
              "id": 52,
              "name": "GST",
              "no": 0
            })
            cc_code.setValue({
              "code": "0",
              "id": 218,
              "name": "GST",
              "no": 0
            })
            ccbspercentage.setValue(100)
            gldesc.setValue('INPUT TAX CREDIT-CGST')
            let num = (+String(this.InvoiceDetailForm.value.invoicedtls[this.getinvindex].taxamount).replace(/,/g, '')) / 2;
            let dbtamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
            dbtamt = dbtamt ? dbtamt.toString() : '';
            amt.setValue(dbtamt)
            amount.setValue(dbtamt)
          }
          else {
            subcategory_code.setValue(debit.subcategory_code)
            glno.setValue(debit.glno)
            bs_code.setValue(debit.bs_code)
            cc_code.setValue(debit.cc_code)
            // let expenseLines = datas.filter(x => x.category_code?.code!= "GST Tax")
            // let amts = expenseLines.map(x => Number((x.amount).replace(/,/g, '')))
            // let amtsum= amts.reduce((a, b) => a + b,0);
            if (this.RoundOffandOtherSum != 0 && this.invdtladdonIndex == 0 && i == 0) {
              if (+debit.deductionamount == 0) {
                // let ded = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.RoundOffandOtherSum);
                let ded = new Intl.NumberFormat("en-GB",
                  { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.RoundOffandOtherSum);
                let dedamt = ded ? ded.toString() : '';
                deductionamount.setValue(dedamt)

                let num: number = +debit.amount;
                // let dbtamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                let dbtamt = new Intl.NumberFormat("en-GB",
                  { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                dbtamt = dbtamt ? dbtamt.toString() : '';
                amt.setValue(dbtamt)

                num = +debit.amount + this.RoundOffandOtherSum;
                // dbtamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                dbtamt = new Intl.NumberFormat("en-GB",
                  { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                dbtamt = dbtamt ? dbtamt.toString() : '';
                amount.setValue(dbtamt)
              }
              else {
                let num: number = +debit.deductionamount;
                let ded = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                let dedamt = ded ? ded.toString() : '';
                deductionamount.setValue(dedamt)

                num = +debit.amount - this.RoundOffandOtherSum;
                let dbtamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                dbtamt = dbtamt ? dbtamt.toString() : '';
                amt.setValue(dbtamt)

                num = +debit.amount;
                // dbtamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                dbtamt = new Intl.NumberFormat("en-GB",
                  { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                dbtamt = dbtamt ? dbtamt.toString() : '';
                amount.setValue(dbtamt)
              }
            }
            else {
              let num: number = +debit.deductionamount;
              // let ded = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              let ded = new Intl.NumberFormat("en-GB",
                { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              let dedamt = ded ? ded.toString() : '';
              deductionamount.setValue(dedamt)

              num = +debit.amount;
              // let dbtamt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              let dbtamt = new Intl.NumberFormat("en-GB",
                { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              dbtamt = dbtamt ? dbtamt.toString() : '';
              amt.setValue(dbtamt)
              amount.setValue(dbtamt)
            }

            ccbspercentage.setValue(debit.ccbspercentage)
            gldesc.setValue(debit?.subcategory_code?.gl_description)

          }
        }

        if (debit.category_code.code == "GST")
          ccbspercentage.setValue(100)
        else
          ccbspercentage.setValue(debit.ccbspercentage)
        if (+debit.amount == this.invdtltaxableamount)
          ccbspercentage.setValue(100)
        let debtax = Number((this.cgstval + this.sgstval + this.igstval) / 2)
        if (debit.amount <= debtax) {
          if (flg == false) {
            this.expenseTaxID = i
            flg = true
          }
          this.readonlydebit[i] = true
        }
        else {
          this.readonlydebit[i] = false
        }


        debitFormArray.push(new FormGroup({
          id: id,
          apinvoicedetail_id: apinvoicedetail_id,
          category_code: category_code,
          subcategory_code: subcategory_code,
          glno: glno,
          gldesc: gldesc,
          // bsproduct_code: bsproduct_code,
          // bsproduct_code_id: bsproduct_code_id,
          amt: amt,
          amount: amount,
          deductionamount: deductionamount,
          bs_code: bs_code,
          cc_code: cc_code,
          ccbspercentage: ccbspercentage,
          taxableamount: taxableamount,
          entry_type: entry_type,
          paymode_id: paymode_id,
        }))

        this.prevDebVal.push(this.DebitDetailForm.value.debitdtl[i])
        i++;

        category_code.valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => {
              if (!value || typeof value === 'object') {
                this.isLoading = false;
                return of([]);
              }
              let Value
              if(value.code == undefined){
                Value = value
              }else{
                Value = value.code
              }
              return this.service.getcategoryscroll(this.isCaptalized ? 'facl' : Value, 1,this.aptypeid)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
          })
          )
          .subscribe((results: any) => {
            let datas = results["data"] ?? [];
            if (this.aptypeid != 7)
              datas = datas.filter(x => x.code != "SUSPENSE")
            else
              datas = datas.filter(x => x.code == "SUSPENSE")
            if (this.isCaptalized == false) {
              datas = datas.filter(x => x.code != "FACL")
            }
            this.categoryNameData = datas;
            let datapagination = results["pagination"];
            if (datapagination != undefined) {
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.currentpage = datapagination.index;
            }
            this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
          })

        subcategory_code.valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => {
              if (!value || typeof value === 'object') {
                this.isLoading = false;
                return of([]);
              }
              let Value
              if(value.name == undefined){
                Value = value
              }else{
                Value = value.name
              }
              return this.service.getsubcategoryscroll(this.catid, Value, 1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
           })
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.subcategoryNameData = datas;
            let datapagination = results["pagination"];
            if (datapagination != undefined) {
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.currentpage = datapagination.index;
            }

          })
        // let bskeyvalue: String = "";
        // this.getbs(bskeyvalue);
        bs_code.valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => {
              if (!value || typeof value === 'object') {
                this.isLoading = false;
                return of([]);
              }
              let Value
              if(value.name == undefined){
                Value = value
              }else{
                Value = value.name
              }
              return this.service.getbsscroll(Value, 1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            })
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.bsNameData = datas;
            let datapagination = results["pagination"];
            if (datapagination != undefined) {
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.currentpage = datapagination.index;
            }
            // console.log("bsdata", this.bsNameData)
            this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
          })

        cc_code.valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => {
              if (!value || typeof value === 'object') {
                this.isLoading = false;
                return of([]);
              }
              let Value
              if(value.name == undefined){
                Value = value
              }else{
                Value = value.name
              }
              return this.service.getccscroll(this.bssid, Value, 1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            })
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.ccNameData = datas;
            let datapagination = results["pagination"];
            if (datapagination != undefined) {
              this.has_next = datapagination.has_next;
              this.has_previous = datapagination.has_previous;
              this.currentpage = datapagination.index;
            }
            // console.log("ccdata", this.ccNameData)
            this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
          })

        // let businesskeyvalue: String = "";
        // this.getbusinessproduct(businesskeyvalue);
        // bsproduct_code.valueChanges
        //   .pipe(
        //     debounceTime(100),
        //     distinctUntilChanged(),
        //     tap(() => {
        //       this.isLoading = true;
        //     }),
        //     switchMap(value => this.service.getbusinessproductscroll(value, 1)
        //       .pipe(
        //         finalize(() => {
        //           this.isLoading = false
        //         }),
        //       )
        //     )
        //   )
        //   .subscribe((results: any[]) => {
        //     let datas = results["data"];
        //     this.businesslist = datas;
        //     // console.log("bsdata", this.bsNameData)
        //     this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        //   })

        this.debitdatasums();

      }
      for (let i = 0; i < this.DebitDetailForm.value.debitdtl.length; i++) {
        let code = this.DebitDetailForm.value.debitdtl[i].category_code?.code
        let subcode=this.DebitDetailForm.value.debitdtl[i].subcategory_code?.code
        if (code == undefined)
          code = ''
        if (subcode == undefined)
          subcode = ''
        code = code.toLowerCase().trim()
        subcode=subcode.toLowerCase().trim()
        if (code.indexOf('gst') >= 0  && subcode.indexOf('gst') >= 0) {
          this.readonlydebit[i] = true
        }
        else {
          this.readonlydebit[i] = false
        }
      }
      // }
    }

    if (this.gstchangeflag[this.getinvindex] == true && this.gsttype == 'IGST' && datas.length == 2) {
      this.adddebitSection()

      this.DebitDetailForm.get('debitdtl')['controls'][2].get('apinvoicedetail_id').setValue(this.DebitDetailForm.value?.debitdtl[0].apinvoicedetail_id)
      this.DebitDetailForm.get('debitdtl')['controls'][2].get('category_code').setValue({
        "code": "GST Tax",
        "id": 232,
        "name": "GST TAX",
        "no": 999
      })
      this.DebitDetailForm.get('debitdtl')['controls'][2].get('subcategory_code').setValue({
        "code": "SGST",
        "gl_description": "INPUT TAX CREDIT-SGST/UTGST",
        "glno": 179000035,
        "id": 1253,
        "name": "SGST",
        "no": "999"
      })
      this.DebitDetailForm.get('debitdtl')['controls'][2].get('glno').setValue(179000035)
      this.DebitDetailForm.get('debitdtl')['controls'][2].get('bs_code').setValue({
        "code": "0",
        "id": 52,
        "name": "GST",
        "no": 0
      })
      this.DebitDetailForm.get('debitdtl')['controls'][2].get('cc_code').setValue({
        "code": "0",
        "id": 218,
        "name": "GST",
        "no": 0
      })
      this.DebitDetailForm.get('debitdtl')['controls'][2].get('gldesc').setValue('INPUT TAX CREDIT-SGST/UTGST')
      this.DebitDetailForm.get('debitdtl')['controls'][2].get('amount').setValue(this.DebitDetailForm.value?.debitdtl[1].amount)
      this.DebitDetailForm.get('debitdtl')['controls'][2].get('amt').setValue(this.DebitDetailForm.value?.debitdtl[1].amount)
      this.DebitDetailForm.get('debitdtl')['controls'][2].get('deductionamount').setValue(0)
      this.DebitDetailForm.get('debitdtl')['controls'][2].get('remarks').setValue('GST')
    }
    this.debitdatasums();

  }

  deletePOInv(ind) {
    this.selectionArray.splice(ind, 1)
  }

  deleteinvdetail(section, ind) {
    let delinvdtlid
    let id = this.aptypeid != 1 ? section.value.id : section.id

    if (id != undefined && id != "" && id != null) {
      delinvdtlid = id
    }
    if(section.getRawValue().productname.name == 'Tax collected at source'){
      this.tcsAdded = false
    }

    if (delinvdtlid != undefined && delinvdtlid != "" && delinvdtlid != null) {
      var answer = window.confirm("Are you sure to delete?");
      if (!answer) {
        return false;
      }

      this.spinner.show();

      this.service.invdtldelete(delinvdtlid)
        .subscribe(result => {
          this.spinner.hide();

          if (result.code != undefined) {
            this.notification.showError(result.description)
            return false
          }
        })
    }

    this.showrcm[ind] = false
    this.prodChange[ind] = false
    this.prodRcm[ind] = ''
    this.prodBlock[ind] = ''
    this.product[ind] = {}
    if (this.aptypeid == 13 || this.aptypeid == 3) {
      this.GSTtext = ''
      this.supplierResetform()
    }
    this.removeinvdtlSection(ind)
    this.INVdatasums()
    this.debitEntryFlag[ind] = false
  }

  datasums() {
    this.amt = this.InvoiceDetailForm.value['invoiceheader'].map(x => x.totalamount);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
  }

  invSubmitFlag = false
  non_rcmentry = false
  invdetlist: any = []
  gstchangeflag = [false, false, false, false, false, false, false, false, false, false, false, false]
  credentrycalled = false
  ispocomponentsaved = false;
  savedChildData:any

  submitinvoicedtl() {
    if (this.movedata == 'AP' || this.movedata == 'apapproverview') {
      if (this.frmInvHdr.get('invoicegst').value == true) {
        this.getgstapplicable = 'Y'
        console.log("The Gst Is Applicable")
      }
      if (this.frmInvHdr.get('invoicegst').value == false) {
        this.getgstapplicable = 'N'
        console.log("  Not Applicable")
      }
    }
    
    // const invoicedtlss = this.InvoiceDetailForm.value.invoicedtls
    const invoicedtlss = this.InvoiceDetailForm.getRawValue().invoicedtls;

    console.log("invoicedtlss", invoicedtlss)
    this.gstchangeflag = [false, false, false, false, false, false, false, false, false, false, false, false]
    let invdata = []
    let index = 0
    for (let i in invoicedtlss) {
      const totalAmountFromForm = String(this.frmInvHdr.get('totalamount').value).replace(/,/g, '');
      const taxableamt = String(this.frmInvHdr.get('invoiceamount').value).replace(/,/g, '');

      // if(this.istcs){
      // const normalTotal = invoicedtlss
      //   .filter(x => x.productname !== "Tax collected at source")
      //   .reduce((sum, row) => sum + Number(row.amount || 0), 0);
      // const tcsTotal = invoicedtlss.filter(x => x.productname.name == "Tax collected at source").reduce((sum, row) => sum + Number(row.amount || 0), 0)
      // this.totaltaxable = normalTotal - tcsTotal;
      // }

      const row = invoicedtlss[i];


      if (!row.description || !row.productname || !row.hsn 
          || !row.unitprice || row.unitprice === 0 
          || !row.quantity || row.quantity === 0) {
        this.toastr.error(`Please fill mandatory fields in row ${i + 1}`);
        this.invdtlsaved = false;
        return false;
      }
      if (this.aptypeid == 3 || this.aptypeid == 13) {
        if ((invoicedtlss[i].supplier_name == '') || (invoicedtlss[i].supplier_name == null) || (invoicedtlss[i].supplier_name == undefined)) {
          this.toastr.error('Please give Supplier Details.');
          this.invdtlsaved = false
          return false;
        }

        if (this.getgstapplicable == 'Y' && (invoicedtlss[i].suppliergst == '') || (invoicedtlss[i].suppliergst == null) || (invoicedtlss[i].suppliergst == undefined)) {
          this.toastr.error('Supplier GST not Available.');
          this.invdtlsaved = false
          return false;
        }
        if ((invoicedtlss[i].invoiceno == '') || (invoicedtlss[i].invoiceno == null) || (invoicedtlss[i].invoiceno == undefined)) {
          this.toastr.error('Please Enter Invoice No.');
          this.invdtlsaved = false
          return false;
        }

        if ((invoicedtlss[i].invoicedate == '') || (invoicedtlss[i].invoicedate == null) || (invoicedtlss[i].invoicedate == undefined)) {
          this.toastr.error('Please Select Invoice Date');
          this.invdtlsaved = false
          return false;
        }
      }
      if (Number(taxableamt) !== +this.totaltaxable) {
        this.toastr.error('The Invoice Header Taxable Amount And The Total Taxable Amount is Not Equal');
        this.invdtlsaved = false;
        return false;
      }
      if ((Number(totalAmountFromForm) !== this.INVsum)) {
        if (!this.productRCMflag) {
          this.toastr.error('The Invoice Header Amount And The Invoice Total Amount is Not Equal');
          this.invdtlsaved = false;
          return false;
        }
      }
      if ((invoicedtlss[i].description == '') || (invoicedtlss[i].description == null) || (invoicedtlss[i].description == undefined)) {
        this.toastr.error('Please Enter Particulars');
        this.invdtlsaved = false
        return false;
      }
      if ((invoicedtlss[i].productname.name == '') || (invoicedtlss[i].productname.name == null) || (invoicedtlss[i].productname.name == undefined)) {
        this.toastr.error('Please choose product');
        this.invdtlsaved = false
        return false;
      }

      if (this.aptypeid == 13 && (invoicedtlss[i].supplier_name == '' || invoicedtlss[i].supplier_name == null || invoicedtlss[i].supplier_name == undefined)) {
        this.toastr.error('Please give Supplier Details.');
        this.invdtlsaved = false
        return false;
      }

      if ((this.hsn[i] == '' && this.getgstapplicable === 'Y') || (this.hsn[i] == null && this.getgstapplicable === 'Y') || (this.hsn[i] == undefined && this.getgstapplicable === 'Y')) {
        this.toastr.error('Please Choose hsncode');
        this.invdtlsaved = false
        return false;
      }

      if ((invoicedtlss[i].unitprice == 0) || (invoicedtlss[i].unitprice == null) || (invoicedtlss[i].unitprice == undefined)) {
        this.toastr.error('Please Enter Unit Price');
        this.invdtlsaved = false
        return false;
      }

      if ((invoicedtlss[i].quantity == 0) || (invoicedtlss[i].quantity == null) || (invoicedtlss[i].quantity == undefined)) {
        this.toastr.error('Please Enter Quantity');
        this.invdtlsaved = false
        return false;
      }

      if ((invoicedtlss[i].amount == 0) || (invoicedtlss[i].amount == null) || (invoicedtlss[i].amount == undefined)) {
        this.toastr.error('Please Enter Amount');
        this.invdtlsaved = false
        return false;
      }
      if(invoicedtlss[i].is_capitalized == true){
        if(typeof invoicedtlss[i].is_capitalized_type !== 'object'){
        if(invoicedtlss[i].is_capitalized_type == ""||invoicedtlss[i].is_capitalized_type == null ||invoicedtlss[i].is_capitalized_type == undefined){
        this.toastr.error('Please Selected Capitalized type for Capitalized Line');
        this.invdtlsaved = false
        return false;
        }
      }
        if(typeof invoicedtlss[i].is_capitalized_type === 'object'){
        if(invoicedtlss[i].is_capitalized_type.code == ""||invoicedtlss[i].is_capitalized_type.code == null ||invoicedtlss[i].is_capitalized_type.code == undefined){
        this.toastr.error('Please Selected Capitalized type for Capitalized Line');
        this.invdtlsaved = false
        return false;
        }
      }
      }
      let totaltax: number = +(String(invoicedtlss[i].taxamount).replace(/,/g, ''));
      totaltax = +(totaltax.toFixed(2))

      let cgst: number = +(String(invoicedtlss[i].cgst).replace(/,/g, ''));
      cgst = +(cgst.toFixed(2))

      let sgst: number = +(String(invoicedtlss[i].sgst).replace(/,/g, ''));
      sgst = +(sgst.toFixed(2))

      let igst: number = +(String(invoicedtlss[i].igst).replace(/,/g, ''));
      igst = +(igst.toFixed(2))

      let taxsum = cgst + sgst + igst
      if (totaltax > taxsum || totaltax < taxsum) {
        this.toastr.error('Tax amount Mismatch');
        this.invdtlsaved = false
        return false;
      }
      if (this.getgstapplicable == 'Y' && this.gsttype == 'SGST & CGST' && Math.abs(totaltax) == Math.abs(igst) && +invoicedtlss[i].hsn_percentage != 0) {
        this.gstchangeflag[i] = true
      }
      else if (this.getgstapplicable == 'Y' && this.gsttype == 'IGST' && Math.abs(totaltax) == Math.abs(cgst + sgst) && +invoicedtlss[i].hsn_percentage != 0) {
        this.gstchangeflag[i] = true
      }
      else {
        this.gstchangeflag[i] = false
      }
      invoicedtlss[i].apinvoiceheader_id = this.apinvHeader_id
      if (invoicedtlss[i].id === "" || invoicedtlss[i].id === undefined) {
        delete invoicedtlss[i].id
      }
      let prevValues: any
      if (this.prevInvVal.length > index)
        prevValues = JSON.stringify(this.prevInvVal[index])

      let currValues = JSON.stringify(this.InvoiceDetailForm.value.invoicedtls[index])

      let change_flag = false
      if (currValues != prevValues)
        change_flag = true

      if (invoicedtlss[i].id == undefined) {
        invoicedtlss[i].roundoffamt = this.Roundoffsamount
        change_flag = true
      }
      else {

        if (this.invDetailList[0]?.roundoffamt != this.Roundoffsamount) {
          invoicedtlss[i].roundoffamt = this.Roundoffsamount
          change_flag = true
        }

      }
      if (invoicedtlss[i].discount == ''|| invoicedtlss[i].discount == null|| invoicedtlss[i].discount == undefined) {
        invoicedtlss[i].discount = 0
      }
      if (invoicedtlss[i].is_capitalized == true) {
        invoicedtlss[i].is_capitalized = 1
      }
      else {
        invoicedtlss[i].is_capitalized = 0
      }

      if (change_flag) {
        invoicedtlss[i].unitprice = String(invoicedtlss[i].unitprice).replace(/,/g, '');
        invoicedtlss[i].quantity = +(String(invoicedtlss[i].quantity).replace(/,/g, ''));
        invoicedtlss[i].amount = String(invoicedtlss[i].amount).replace(/,/g, '');
        invoicedtlss[i].taxable_amount = String(invoicedtlss[i].taxable_amount).replace(/,/g, '');
        invoicedtlss[i].cgst = String(invoicedtlss[i].cgst).replace(/,/g, '');
        invoicedtlss[i].sgst = String(invoicedtlss[i].sgst).replace(/,/g, '');
        invoicedtlss[i].igst = String(invoicedtlss[i].igst).replace(/,/g, '');
        invoicedtlss[i].discount = String(invoicedtlss[i].discount).replace(/,/g, '');
        invoicedtlss[i].taxamount = String(invoicedtlss[i].taxamount).replace(/,/g, '');
        invoicedtlss[i].totalamount = String(invoicedtlss[i].totalamount).replace(/,/g, '');
        invoicedtlss[i].roundoffamt = String(invoicedtlss[i].roundoffamt).replace(/,/g, '');
        let other_amt = this.InvoiceDetailForm.value.otheramount ? this.InvoiceDetailForm.value.otheramount : 0
        invoicedtlss[i].otheramount = String(other_amt).replace(/,/g, '');

        invoicedtlss[i].entry_flag = 0
        invoicedtlss[i].apinvoiceheader_id = this.apinvHeader_id
        invoicedtlss[i].dtltotalamt = this.INVsum

        invoicedtlss[i].productcode = this.product[i].code
        invoicedtlss[i].product_id = this.product[i].id
        invoicedtlss[i].productname = this.product[i].name

        invoicedtlss[i].hsn = this.hsn[i]?.code ? this.hsn[i]?.code : this.hsn[i]


        if (invoicedtlss[i].invoicedate == "None" || invoicedtlss[i].invoicedate == null || invoicedtlss[i].invoicedate == "" || invoicedtlss[i].invoicedate == undefined) {
          invoicedtlss[i].invoicedate = ""
        } else {
          invoicedtlss[i].invoicedate = this.datepipe.transform(invoicedtlss[i]?.invoicedate, 'yyyy-MM-dd');
        }

        if (invoicedtlss[i].pincode == "" || invoicedtlss[i].pincode == null || invoicedtlss[i].pincode == undefined || invoicedtlss[i].pincode == "None") {
          invoicedtlss[i].pincode = ""
        } else {
          invoicedtlss[i].pincode = invoicedtlss[i].pincode
        }
        console.log("invoicedate", invoicedtlss[i].invoicedate)
        if (this.modificationFlag == 'modification') {
          invoicedtlss[i].edit_flag = 1
        } else if (this.modificationFlag == 'edit') {
          invoicedtlss[i].edit_flag = 0
        }
        if(invoicedtlss[i].is_capitalized == true){
          invoicedtlss[i].is_capitalized_type = invoicedtlss[i].is_capitalized_type.code
        }
        if (this.movedata == 'ECF')
          invoicedtlss[i].module_type = 1
        else if (this.movedata == 'AP')
          invoicedtlss[i].module_type = 2
        if(this.aptypeid == 1){
          invoicedtlss[i].grn_header_id= invoicedtlss[i]?.grn_header_id ?? 'None',
          invoicedtlss[i].grn_detail_id= invoicedtlss[i]?.grn_detail_id ?? 'None'
        if (
            invoicedtlss[i].grn_header_id === undefined ||
            invoicedtlss[i].grn_header_id === null ||
            invoicedtlss[i].grn_header_id === '' ||
            invoicedtlss[i].grn_header_id === 'None'
          ) {
            delete invoicedtlss[i].grn_header_id;
          }

          if (
            invoicedtlss[i].grn_detail_id === undefined ||
            invoicedtlss[i].grn_detail_id === null ||
            invoicedtlss[i].grn_detail_id === '' ||
            invoicedtlss[i].grn_detail_id === 'None'
          ) {
            delete invoicedtlss[i].grn_detail_id;
          }
      }


        
if (this.poinvaddflag == true && this.aptypeid == 1 && this.savedChildDataMap[i]?.length > 0) {
  const podtls: any[] = this.savedChildDataMap[i].map(c => {
    // Initial object
    let obj: any = {
      grn_code: this.grncode,
      grn_header_id: c.grn_header_id ?? 'None',
      grn_detail_id: c.grn_detail_id ?? 'None',
      productcode: c.productname?.code,
      productname: c.productname?.name,
      description: c.description ?? '',
      hsn: c.hsn.code,
      hsn_percentage: c.hsn_percentage,
      uom: c.uom ?? c.productname.uom_id.name,
      unitprice: String(c.unitprice.replace(/,/g, '')),
      quantity: Number(c.quantity),
      amount: String(c.amount.replace(/,/g, '')),
      cgst: c.cgst,
      sgst: c.sgst,
      igst: c.igst,
      discount: "0",
      taxable_amount: String(c.taxable_amount.replace(/,/g, '')),
      taxamount: c.taxamount ? String(c.taxamount).replace(/,/g, '') : '0',
      totalamount: String(c.totalamount.replace(/,/g, '')),
      roundoffamt: "0",
      is_rcmproduct: c.is_rcmproduct,
      is_blockedproduct: c.is_blockedproduct,
      is_capitalized: 0,
      invoiceno: "",
      invoicedate: "",
      suppliergst: "",
      supplier_name: "",
      pincode: "",
      address: "",
      apinvoicedetail_id: 0,
      otheramount: "0",
      entry_flag: 0,
      dtltotalamt: Number(c.totalamount),
      module_type: 2
    };

    Object.keys(obj).forEach(key => {
      if (obj[key] === 'None') {
        delete obj[key];
      }
    });

    return obj;
  });

    let invCopy = { ...invoicedtlss[i], is_component: 1, component: podtls };
    invdata.push(invCopy);
} else {
    invdata.push(invoicedtlss[i]);
}

        console.log("invdata", invdata)
        this.debitSectionSaved[i] = false
      }
      index++
    }
  

    if (this.productRCMflag === false && (this.INVsum > this.totalamount || this.INVsum < this.totalamount)) {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      this.invdtlsaved = false
      return false
    }
    else {
      this.totalamount = this.INVsum
      let num: number = +this.totalamount;
      let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      amt = amt ? amt.toString() : '';
    }

    if (invdata.length > 0) {
      this.creditEntryFlag = false
      this.spinner.show();

      this.service.invDetAddEdit(invdata)
        .subscribe(result => {
          if (result.invoicedetails[0]?.code != undefined) {
            this.spinner.hide();
            this.notification.showError(result.invoicedetails[0].description)
            this.invdtlsaved = false
          }
          else {
            console.log("invdetEDIT RESULT ", result)
            this.changesInAP = true
            this.invdtlsaved = true
            let invdetRes = result.invoicedetails
            this.Roundoffsamount = invdetRes[0].roundoffamt
            // if (invdetRes[0].apinvoicedetails_child) {
            // invdetRes.forEach((row, index) => {
            //   const invpochilddetails = row.apinvoicedetails_child?.data ?? [];
            //   if (invpochilddetails.length > 0) {
            //     this.ispocomponentsaved = true;
            //     this.savedChildDataMap[index] = invpochilddetails;
                this.getpatchpodetailsdata(invdetRes);
                this.tcsAdded = true;
            //   }
            // });
            // }

            this.invSubmitFlag = true
            for (let i = 0; i < invdetRes.length; i++) {
              this.invdetlist.push(invdetRes[i].id)
            }
            this.spinner.show()
            this.service.entryDebit({ crno: this.crno, invoiceheader_id: this.apinvHeader_id, invoicedetails_id_list: this.invdetlist })
              .subscribe(result => {
                this.spinner.hide()
                if (result.status == "success") {
                  // this.service.updateDebEntryFlag(invdetRes[i].id, { "entry_flag":1 })
                  // .subscribe(result => {
                  //   console.log("Debit entry flag update--", result)
                  //   if(result.status != "success")
                  //   {
                  //     this.spinner.hide();
                  //     this.notification.showError(result.message)
                  //   }  
                  //   else
                  //   {
                  //     this.spinner.hide();
                  //     this.debitEntryFlag[i] =true 
                  //   }
                  // })
                  this.debitsaved = false
                  this.invdetlist = []
                  console.log("entryDebit result --", result.status)


                  // this.spinner.show()
                  if (this.credentrycalled == false && this.invDetailList.length > 0) {
                    if (this.invDetailList[0].entry_flag == true)
                      this.credentrycalled = true
                  }
                  if (this.credentrycalled == true && this.aptypeid == 7) {
                    this.creditEntryFlag = true
                    let creditcontrol = this.InvoiceDetailForm.controls["creditdtl"] as FormArray;
                    creditcontrol.clear()
                    this.spinner.show()
                    this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
                      .subscribe(result => {
                        this.spinner.hide();
                        if (result.code == undefined) {
                          this.creditres = result.data
                          console.log("cdtres", this.creditres)
                          let cred = result.data;
                          console.log("cred", cred)
                          this.invCreditList = cred.filter(x => (x.is_display == "YES" && (x.amount > 0 && x.paymode.gl_flag == 'Adjustable') ||
                            (x.amount >= 0 && x.paymode.gl_flag == 'Payable')))
                          this.getcreditrecords(this.invCreditList)
                        }
                      })
                  }
                  else {
                    this.credentrycalled = true
                    this.spinner.show()
                    this.service.entryCredit({ crno: this.crno, invoiceheader_id: this.apinvHeader_id, invoicedetails_id: "0" })
                      .subscribe(result => {
                        if (result) {
                          console.log("entry Credit result --", result)
                          if (result.status !== "success") {
                            this.spinner.hide();
                            this.notification.showError(result.message)
                            this.invdtlsaved = false
                          }
                          else {
                            // this.service.updateCredEntryFlag(this.apinvHeader_id, { "entry_flag":1 })
                            // .subscribe(result => {
                            //   console.log("Credit entry flag update--", result)
                            //   if(result.status == "success")
                            //   {
                            this.creditEntryFlag = true
                            let creditcontrol = this.InvoiceDetailForm.controls["creditdtl"] as FormArray;
                            creditcontrol.clear()
                            this.spinner.show()
                            this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
                              .subscribe(result => {
                                this.spinner.hide();
                                if (result.code == undefined) {
                                  this.creditres = result.data
                                  console.log("cdtres", this.creditres)
                                  let cred = result.data;
                                  console.log("cred", cred)
                                  this.invCreditList = cred.filter(x => (x.is_display == "YES" && (x.amount > 0 && x.paymode.gl_flag == 'Adjustable') ||
                                    (x.amount >= 0 && x.paymode.gl_flag == 'Payable')))
                                  if (this.invCreditList?.length == 0 && (this.aptypeid == 2 || this.aptypeid == 6)) {
                                    console.log("invCreditList", this.invCreditList)
                                    // this.paymodecode[0]='PM005'
                                    this.addcreditSection()
                                    // let datas = this.paymodesList.filter(x=>x.code == 'PM005')
                                    // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])

                                    // if(datas[0].paymode_details?.data?.length == 0)
                                    // {
                                    //   this.notification.showError("Paymode Details Empty")
                                    // }
                                    // else
                                    // {
                                    //   let paymode_details=datas[0].paymode_details ? datas[0].paymode_details:undefined

                                    //   let gl=datas[0].paymode_details['data'][0]?.glno
                                    //   let catcode = paymode_details['data'][0]?.category_id?.code
                                    //   let subcat = paymode_details['data'][0]?.sub_category_id?.code
                                    //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                                    //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                                    //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
                                    // } this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
                                    // this.showaccno[0] = true  
                                    this.getaccno(0)  
                                    this.creditdetForm.patchValue({
                                      is_tds_applicable:1
                                    })
                                    // this.showtaxtype[0] = false
                                    // this.showtaxrate[0] = false
                                    // this.showtaxtypes[0] = true
                                    // this.showtaxrates[0] = true   
                                  }
                                  else if (this.invCreditList?.length == 0 && (this.aptypeid == 14)) {
                                    console.log("invCreditList", this.invCreditList)
                                    this.paymodecode[0] = 'PM008'
                                    this.addcreditSection()
                                    let datas = this.paymodesList.filter(x => x.code == 'PM008')
                                    console.log("paydatass===>", datas[0])
                                    this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])

                                    if (datas[0].paymode_details?.data?.length == 0) {
                                      this.notification.showError("Paymode Details Empty")
                                    }
                                    else {
                                      let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

                                      let gl = datas[0].paymode_details['data'][0]?.glno
                                      let catcode = paymode_details['data'][0]?.category_id?.code
                                      let subcat = paymode_details['data'][0]?.sub_category_id?.code
                                      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                                      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                                      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
                                    }
                                    // this.getaccno(0)
                                    // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('bank').setValue("KARUR VYSYA BANK")
                                    // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('ifsccode').setValue("KVBL0001903")
                                    // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('branch').setValue("EXPENSES MANAGEMENT CELL")
                                    // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('benificiary').setValue("EXPENSES MANAGEMENT CELL")
                                    this.creditdetForm.patchValue({
                                      is_tds_applicable: 1
                                    })
                                    this.showtaxtype[0] = false
                                    this.showtaxrate[0] = false
                                    this.showtaxtypes[0] = true
                                    this.showtaxrates[0] = true
                                  }
                                  else if (this.invCreditList?.length == 0 && (this.aptypeid == 3)) {
                                    console.log("invCreditList", this.invCreditList)
                                    this.paymodecode[0] = 'PM004'
                                    this.addcreditSection()
                                    let datas = this.paymodesList?.filter(x => x.code == 'PM004')
                                    // console.log("paydatass===>",datas[0])
                                    this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])

                                    if (datas[0].paymode_details?.data?.length == 0) {
                                      this.notification.showError("Paymode Details Empty")
                                    }
                                    else {
                                      let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

                                      let gl = datas[0].paymode_details['data'][0]?.glno
                                      let catcode = paymode_details['data'][0]?.category_id?.code
                                      let subcat = paymode_details['data'][0]?.sub_category_id?.code
                                      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                                      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                                      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
                                    }
                                    this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
                                    this.showaccno[0] = true
                                    this.getERA(datas[0].id, 0)
                                    this.showtaxtype[0] = false
                                    this.showtaxrate[0] = false
                                    this.showtaxtypes[0] = true
                                    this.showtaxrates[0] = true
                                  }
                                  else if (this.invCreditList?.length == 0 && (this.aptypeid == 13)) {
                                    console.log("invCreditList", this.invCreditList)
                                    this.paymodecode[0] = 'PM001'
                                    this.addcreditSection()
                                    console.log("ppp--->", this.paymodesList)
                                    let datas = this.paymodesList.filter(x => x.code == 'PM001')
                                    console.log("paydatass===>", datas[0])
                                    this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])

                                    if (datas[0].paymode_details?.data?.length == 0) {
                                      this.notification.showError("Paymode Details Empty")
                                    }
                                    else {
                                      let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

                                      let gl = datas[0].paymode_details['data'][0]?.glno
                                      let catcode = paymode_details['data'][0]?.category_id?.code
                                      let subcat = paymode_details['data'][0]?.sub_category_id?.code
                                      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                                      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                                      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
                                    }
                                    this.showaccno[0] = true
                                    this.getERA(datas[0].id, 0)
                                    this.showtaxtype[0] = false
                                    this.showtaxrate[0] = false
                                    this.showtaxtypes[0] = true
                                    this.showtaxrates[0] = true
                                    // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('bank').setValue("KARUR VYSYA BANK")
                                    // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('branch').setValue("EXPENSES MANAGEMENT CELL")
                                    // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('ifsccode').setValue("KVBL0001903")
                                    // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('benificiary').setValue("EXPENSES MANAGEMENT CELL")
                                    // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue("999999999")

                                  }
                                  else {
                                    this.getcreditrecords(this.invCreditList)
                                  }
                                }
                              })
                            // }
                            // else
                            // {
                            //   this.spinner.hide();
                            //   this.notification.showError(result.message)
                            // }
                            // })
                            this.spinner.hide()
                            this.notification.showSuccess("Successfully Invoice Details Saved")
                             const details = this.InvoiceDetailForm.get('invoicedtls') as FormArray;
                             details.markAsPristine();
                          }
                        }
                      }
                      )
                  }

                }
                else {
                  this.invdetlist = []
                  this.spinner.hide();
                  this.notification.showError(result.message)
                  this.invdtlsaved = false
                }
              })
            this.invoicedetailsdata = result.invoicedetails

            let dataa = this.InvoiceDetailForm?.value?.invoicedtls
            console.log("invdataa", dataa)
            for (let i in dataa) {
              this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('id').setValue(this.invoicedetailsdata[i].id)
            }
            console.log("this.invoicedetailsdata", this.invoicedetailsdata)
            this.invdtlsaved = true
            return true
          }
        })
    }
    else {
      this.notification.showError("There are no changes to save.");
      this.invdtlsaved = false
    }

  }








  public displayFnOriginalInv(OriginalInv?: OriginalInv): string | undefined {
    return OriginalInv ? OriginalInv.text : undefined;
  }

  // autocompleteOriginalInv(){
  //   setTimeout(() => {
  //     if (
  //       this.autocompleteOriginalInv &&
  //       this.autocompleteTrigger &&
  //       this.OriginalInvAutoComplete.panel
  //     ) {
  //       fromEvent(this.OriginalInvAutoComplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.OriginalInvAutoComplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.OriginalInvAutoComplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.OriginalInvAutoComplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.OriginalInvAutoComplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.service.getInwardOrgInv(this.OrgInvInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.originalInv = this.originalInv.concat(datas);
  //                   if (this.originalInv.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  invDetDelete(invDetid: any) {
    this.spinner.show();
    this.service.invdtldelete(invDetid)
      .subscribe(result => {
        if (result.code != undefined) {
          this.notification.showError(result.description)
          this.spinner.hide();
        }
        else {
          this.notification.showSuccess('Deleted Successfully');
          this.getInvHdr();
          this.spinner.hide();
        }
      })
  }

  invNoFilter(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (! ((charCode >= 47 && charCode <= 57) || (charCode >= 65 && charCode <= 90)
        || (charCode >= 97 && charCode <= 122) || charCode ==45 ) ) {
      return false;
    }
  }
numberOnlyandDot(event: KeyboardEvent, val: string): boolean {
  const input = event.target as HTMLInputElement;
  const char = event.key;
  if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(char)) {
    return true;
  }
  val = (val || '').replace(/,/g, '');
  if (!/[0-9.]/.test(char)) {
    event.preventDefault();
    return false;
  }

  const newVal = val + char;
  if (newVal === '.') {
    return true;
  }
  if ((newVal.match(/\./g) || []).length > 1) {
    event.preventDefault();
    return false;
  }
  const parts = newVal.split('.');
  if (parts.length === 2 && parts[1].length > 2) {
    event.preventDefault();
    return false;
  }
  const num = parseFloat(newVal);
  if (!isNaN(num) && num > 9999999999) {
    event.preventDefault();
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

  kvbaccOnFocus() {
    if (this.kvbaccForm.value.accno == '')
      this.kvbacaccno = ''
  }
  kvbacaccno = ''
  getKvbacChar(e) {
    console.log(e.key)
    if (this.kvbaccForm.value.accno.length == 16)
      return false
    if (this.kvbaccForm.value.accno == '')
      this.kvbacaccno = ''
    const charCode = (e.which) ? e.which : e.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      this.kvbacaccno = this.kvbacaccno + String(e.key)
      let mskchar = '*'
      let mskstr = mskchar.repeat(this.kvbacaccno.length)

      this.kvbaccForm.controls['accno'].setValue(mskstr)
      return false
    }
    else {
      return false
    }
  }

  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  backform() {
    //this.router.navigate(['/ap/apHeader'], { skipLocationChange: true });
  }

  creditaddonindex: any
  getcreditindex: any
  amountchangedata: any

  addoncreditindex(indexx, data) {
    this.creditaddonindex = indexx
    this.getcreditindex = indexx
    this.amountchangedata = data
    // console.log("secdata",data)
  }

  public displayPaymode(paymode?: paymodelistss): string | undefined {
    return paymode ? paymode.name : undefined;
  }

  getPaymodes() {
    let text = ""
    if (this.aptypeid == 7) {
      text = "cr"
    }
    this.service.getallPaymode()
      .subscribe((results: any[]) => {
        this.paymodesList = results["data"];
        console.log("this.paymodesList----", this.paymodesList)
      })
  }

  adjPaymodes = []
  getAdjPaymodes() {
    if (this.tdsChoosed) {
      this.adjPaymodes = this.paymodesList.filter(x => x.code == 'PM002' || x.code == 'PM007')
    }
    else {
      this.adjPaymodes = this.paymodesList.filter(x => x.code == 'PM002')
    }
  }

  // adjPaymodes =[]
  // getadjPaymodes(){//this.frmECFNoHdr.get('taxableAmount').
  //   if(this.tdsChoosed){
  //     this.adjPaymodes = this.PaymodeList.filter(x => x.code =='PM002' || x.code =='PM007' )
  //   }
  //   else{
  //     this.adjPaymodes = this.PaymodeList.filter(x => x.code =='PM002')
  //   }
  // }
  getPaymode(ind, getacc = false) {
    if (this.creditsaved == true)
      return false
    let paymodedata = this.paymodesList

    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
    for (let i = 0; i < creditdtlsdatas.length; i++) {
      let paymodecode = creditdtlsdatas[i].paymode_id?.code
      let gl_flag = paymodedata.filter(pay => pay.code === paymodecode)[0]?.gl_flag
      if (gl_flag === 'Payable' && ind !== i) {
        this.payableSelected = true
        break;
      }
      else {
        this.payableSelected = false
      }
    }
    if (this.aptypeid == 2 && ind == 0) {
      this.PaymodeList = paymodedata.filter(pay => (this.payableSelected === false && pay.code === 'PM005'))
    } else if (this.aptypeid == 2 && ind != 0) {
      this.PaymodeList = paymodedata.filter(pay => (pay.code === 'PM006' && this.checkAdvance == true) || (pay.code === 'PM010' && this.showcrnnotify == true))
    } else if (this.aptypeid == 3 && ind == 0) {
      this.PaymodeList = paymodedata.filter(pay => (this.payableSelected === false && pay.code === 'PM004'))
    } else if (this.aptypeid == 3 && ind != 0) {
      this.PaymodeList = paymodedata.filter(pay => (pay.code === 'PM006' && this.checkAdvance == true))
    } else if (this.aptypeid == 4 && this.ppxid == "S" && ind == 0) {
      this.PaymodeList = paymodedata.filter(pay => (this.payableSelected === false && pay.code === 'PM005'))
    } else if (this.aptypeid == 4 && this.ppxid == "S" && ind != 0) {
      this.PaymodeList = paymodedata.filter(pay => (pay.code === 'PM007' && !this.fullliq))
    } else if (this.aptypeid == 4 && this.ppxid == "E" && ind == 0) {
      this.PaymodeList = paymodedata.filter(pay => (this.payableSelected === false && pay.code === 'PM004'))
    }
    else if (this.aptypeid == 4 && this.ppxid == "E" && ind != 0) {
      this.PaymodeList = paymodedata.filter(pay => (pay.code === 'PM007' && !this.fullliq))
    }
    else if (this.aptypeid == 7) {
      this.PaymodeList = paymodedata.filter(pay => (pay.code === 'PM009'))
    } 
    // else if(this.aptypeid == 7)
    // {
    //   this.PaymodeList  =paymodedata.filter(pay =>pay.code === 'PM002'  )
    // }
    else if (this.aptypeid == 14 && ind == 0) {
      this.PaymodeList = paymodedata.filter(pay => pay.code === 'PM008')
      this.PaymodeList.push(this.creditGLPaymode)
    }
    // else if(this.aptypeid == 14 && ind != 0)
    // {
    //   this.PaymodeList  =paymodedata.filter(pay => pay.code === 'PM002' )
    // }
    else if (this.aptypeid == 13 && ind == 0) {
      this.PaymodeList = paymodedata.filter(pay => pay.code === 'PM001')
    }
    else if (this.aptypeid == 16 && ind == 0) {
      this.PaymodeList = paymodedata.filter(pay => pay.code === 'PM010')
    }
    // else if(this.aptypeid == 13 && ind != 0)
    // {
    //   this.PaymodeList  =paymodedata.filter(pay => pay.code === 'PM002' )
    // }
    // this.PaymodeList = this.PaymodeList.filter(pay => (this.payableSelected === false && pay.gl_flag === 'Payable') || (pay.code=='PM006' && this.checkAdvance == true) || 
    // (pay.code =='PM007' && !this.fullliq) || (pay.code=='PM010' && this.showcrnnotify == true) )

    if (getacc)
      this.getaccno(ind)


  }


  public displaydebbank(debbank?: debbanklistss | any): string | undefined {
    console.log("debbank...", debbank)
    if (debbank?.code !== "INVALID_BANK_ID") {
      return debbank ? debbank.bankbranch?.bank?.name + "-" + debbank?.account_no : undefined;
    }
  }


  getdebbank() {
    
    this.service.getdebbankacc("")
      .subscribe((results: any[]) => {
      
        let debbankdata = results["data"];
        this.debbankList = debbankdata;
        // console.log("pll", this.PaymodeList)
        this.creditdetForm.patchValue(
          {
            debitbank_id: this.debbankList[0] ? this.debbankList[0] : undefined
          })
        this.bankdetailsids = this.debbankList[0]

      })
  }

  getCreditSections(form) {
    return form.controls.creditdtl.controls;
  }

  tdsAppl(e) {
    if (e.checked == true)
      this.addcreditSection(0, 'PM007')
  }

  tdsChange(id) {
    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

    let tds = creditdtlsdatas.filter(x => x.paymode_id?.code === 'PM007').length > 0 ? true : false
    if (id == 0 && !tds) {
      this.addcreditSection(0, 'PM007')
    }
  }

  addcreditSection(exceedAmt = 0, paymode = "", btnClk = false) {

    // if ( this.bankdetailsids?.code =="INVALID_BANK_ID" || this.bankdetailsids === '' || this.bankdetailsids === null || this.bankdetailsids === undefined) {
    //   this.toastr.error('Please Choose Debit Bank')
    //   return false
    // }

    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

    for (let i in creditdtlsdatas) {
      if (creditdtlsdatas[i].paymode_id?.code === 'PM007' && (creditdtlsdatas[i].suppliertaxtype === '' ||
        creditdtlsdatas[i].suppliertaxtype === null || creditdtlsdatas[i].suppliertaxtype === undefined)) {
        this.toastr.error('Please Choose Taxtype')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
    }
    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.push(this.creditdetails());
    let creditDtl = this.InvoiceDetailForm.value.creditdtl

    let index = creditDtl.length - 1
    this.amtChangeFlag[index] = false
    if (exceedAmt != 0) {
      let paymodetds = this.paymodesList.filter(x => x.code == 'PM007')[0]
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('paymode_id').setValue(paymodetds)

      this.paymodecode[index] = paymodetds.code
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('category_code').setValue(paymodetds?.paymode_details?.data[0]?.category_id.code)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('subcategory_code').setValue(paymodetds?.paymode_details?.data[0]?.sub_category_id.code)
      let type = this.InvoiceDetailForm.value.creditdtl[index - 1].suppliertaxtype
      console.log("type----", type)
      this.showtaxtype[index] = true
      this.showtaxtypes[index] = false
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('suppliertaxtype').setValue(type)
      let num = +exceedAmt
      let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      amt = amt ? amt.toString() : '';
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').setValue(amt)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('suppliertaxrate').setValue(type.taxrate.rate)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('glno').setValue(type.subtax.glno)

      let taxableamt2 = Number(String(this.InvoiceDetailForm.value.creditdtl[index].taxableamount).replace(/,/g, ''))
      let taxrate2 = this.InvoiceDetailForm.value.creditdtl[index].suppliertaxrate
      this.spinner.show()
      this.service.gettdstaxcalculation(taxableamt2, taxrate2)
        .subscribe(result => {
          let amt = Math.round(result.tdsrate)
          this.spinner.hide()
          let num = +amt
          let amtch = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
          amtch = amtch ? amtch.toString() : '';
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(amtch)
        })
    } else if (paymode == "PM007") {
      // this.popupopen2()  
      let paymodetds = this.paymodesList.filter(x => x.code == 'PM007')[0]
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('paymode_id').setValue(paymodetds)
      this.paymodecode[index] = paymodetds.code
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('category_code').setValue(paymodetds?.paymode_details?.data[0]?.category_id.code)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('subcategory_code').setValue(paymodetds?.paymode_details?.data[0]?.sub_category_id.code)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').setValue(this.taxableinvoiceamount)
      this.showtaxtype[index] = true
      this.showtaxrate[index] = true
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.gettaxtype("", index)
    }
    else if (paymode == "PM006") {

      let paymodeppx = this.paymodesList.filter(x => x.code == 'PM006')[0]
      this.paymodecode[index] = paymodeppx.code
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('paymode_id').setValue(paymodeppx)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.showaccno[index] = false
      this.getcredit = false
      this.CreditDessss(paymodeppx, index)
    }
    else if (paymode == "PM009") {

      let paymodeppx = this.paymodesList.filter(x => x.code == 'PM009')[0]
      this.paymodecode[index] = paymodeppx.code
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('paymode_id').setValue(paymodeppx)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.showaccno[index] = false
      this.getcredit = false
      this.CreditDessss(paymodeppx, index)
    } else if (btnClk) {

      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

      let chktds = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')
      if (chktds.length > 0) {
        // this.popupopen2()          
        return false
      }
      else {

        let paymodecreditgl = this.paymodesList.filter(x => x.code == 'PM002')[0]
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('paymode_id').setValue(paymodecreditgl)
        this.paymodecode[index] = paymodecreditgl.code
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('category_code').setValue(paymodecreditgl?.paymode_details?.data[0]?.category_id.code)
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('subcategory_code').setValue(paymodecreditgl?.paymode_details?.data[0]?.sub_category_id.code)
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').setValue(0)
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
        this.showaccno[index] = false
        this.getcredit = false
        this.CreditDessss(paymodecreditgl, index)
        // this.popupopen2() 
      }

    }

    if (index === 0) {
      this.creditsaved = false
      let num: number = +this.totalamount
      let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      amt = amt ? amt.toString() : '';

      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)

      this.getcredit = false
      this.creditdatasums()
    }
  }
  removecreditSection(i, paymodename, msgthrow = 1) {
    if (paymodename == 'LIQ') {
      let advno = this.InvoiceDetailForm.value.creditdtl[i].refno
      for (let i = 0; i < this.selectedppxdata.length; i++) {
        if (this.selectedppxdata[i].crno == advno) {
          this.selectedppxdata = this.selectedppxdata.slice(i, 1)
          this.getPPXsum()
          this.selectedppxdata =[]
          break
        }
      }
    }
    if (paymodename == 'CRNGL'  ) {
      let advno = this.InvoiceDetailForm.value.creditdtl[i].refno
      for (let i = 0; i < this.selectedcrndata.length; i++) {
        if (this.selectedcrndata[i].crno == advno) {
          this.selectedcrndata = this.selectedcrndata.slice(i, 1)
          this.getCRNsum()
          this.selectedcrndata =[]
          break
        }
      }
    }
    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    const removedItem = control.at(i)?.value;
    const removedAmount = parseFloat((removedItem?.amount || '0').toString().replace(/,/g, '')) || 0;
    control.removeAt(i);

    let dta1 = this.InvoiceDetailForm.value.creditdtl
    if (msgthrow != 0)
      this.notification.showSuccess((paymodename != undefined ? paymodename : "Credit ") + " line deleted Successfully")

    if (dta1.length === 0) {
      const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
      control.push(this.creditdetails());
    }
    // if (this.InvoiceDetailForm.value.creditdtl.length === 1) {
    //   // let num: number = +this.totalamount
    //   // let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    //   // amt = amt ? amt.toString() : '';
    //   // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
    //   let num = parseFloat(this.totalamount) || 0;
    //   let amt = new Intl.NumberFormat("en-GB", {style: 'decimal',minimumFractionDigits: 2,maximumFractionDigits: 2}).format(num);
    //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt);
    // }
    if (paymodename === 'LIQ' || paymodename === 'CRNGL') {
    const firstCtrl = control.at(0).get('amount');
    let currentFirstAmt = parseFloat((firstCtrl?.value || '0').toString().replace(/,/g, '')) || 0;
    const updatedAmt = currentFirstAmt + removedAmount;

    const formattedAmt = new Intl.NumberFormat('en-GB', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(updatedAmt);

    firstCtrl?.setValue(formattedAmt);
  }
    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

    for (let i = 0; i < creditdtlsdatas.length; i++) {
      this.paymodecode[i] = creditdtlsdatas[i].paymode_id?.code
      if (creditdtlsdatas[i].paymode_id?.code == 'PM006'|| creditdtlsdatas[i].paymode_id?.code == 'PM009' || creditdtlsdatas[i].paymode_id?.code == 'PM007' ||
        creditdtlsdatas[i].paymode_id.gl_flag === "Payable")
        this.amtChangeFlag[i] = false
      else
        this.amtChangeFlag[i] = true
    }
    this.creditdatasums()
  }
  credit: any
  
get crnglArray(): FormArray {
  return this.crnglForm.get('crnglArray') as FormArray;
}

  paymodecode = ['', '', '', '', '', '', '', '']
  taxableamount: any

  amtChangeFlag = [true, true, true, true, true, true, true, true]
  taxableCalc = false
  CreditDessss(pay, index, taxtype = "", getcred = false) {
    this.paywholedata = pay

    this.credit_GL = {
      label: "Credit Gl",
      method: "get",
      url: this.ecfURL + "mstserv/paymodecreditgl/" + this.paywholedata.id,
      displaykey: "glno",
      wholedata: true,
      formControlName: "glnum"
      // required: true,
    };
    if (pay.name != "LIQ" && pay.name != "CRNGL") {
      if (pay.paymode_details?.data?.length != 0) {
        this.creditsaved = false
      }
      else {
        this.notification.showError("Paymode Details Empty")
        this.creditsaved = true
      }
    }
    console.log("paycode", pay)
    this.getcreditindex = index

    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
    pay = this.paymodesList.filter(x => x.code == pay.code)[0]
    console.log("PaymodeListtssss====>",pay)

    console.log("pay", pay)
    this.paymodecode[index] = pay.code
    if (pay.gl_flag === "Payable") {
      if (this.suppid != undefined)
        this.accList = this.accDetailList.filter(x => x.paymode_id?.code == pay?.code)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('suppliertaxtype').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('suppliertaxrate').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxexcempted').reset("N")
      this.amtChangeFlag[index] = false
      this.payableSelected = true
      let paymode_details = pay.paymode_details ? pay.paymode_details : undefined
      console.log("paymode_details>>", paymode_details)
      if (paymode_details != undefined && pay.name != "LIQ") {
        let gl = paymode_details['data'][0]?.glno
        let catcode = paymode_details['data'][0]?.category_id?.code
        let subcat = paymode_details['data'][0]?.sub_category_id?.code
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('category_code').setValue(catcode)
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('subcategory_code').setValue(subcat)
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('glno').setValue(gl)
      }
    }
    else {
      this.payableSelected = false
    }

    if (this.paymodecode[index] === 'PM005' || this.paymodecode[index] === 'PM010'
      || this.paymodecode[index] === 'PM004' || this.paymodecode[index] === 'PM001') {
      if (this.paymodecode[index] == 'PM005') {
        this.getaccno(index)
        this.showtranspay[index] = false
        this.showtaxtype[index] = false
        this.showtaxrate[index] = false
        this.showtaxtypes[index] = true
        this.showtaxrates[index] = true
        // this.popupopen2()  
      }
      else if (this.paymodecode[index] == 'PM004' || this.paymodecode[index] == 'PM001') {
        this.getERA(pay.id, index)

      }
      this.showaccno[index] = true
    }
    else {
      if (this.paymodecode[index] == 'PM002' || this.paymodecode[index] == 'PM006') {
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('accno').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
        // this.popupopen2()
      }
      this.showaccno[index] = false
    }
    if (this.paymodecode[index] === 'PM003') {
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('refno').reset()
      this.showtranspay[index] = true
      this.showaccno[index] = false
    } else {
      this.showtranspay[index] = false
      // this.showaccno[index]=false
    }
    if (this.paymodecode[index] === 'PM007') {
      this.amtChangeFlag[index] = false
      this.showtaxtype[index] = true
      this.showtaxrate[index] = true
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.showgrnpopup = false
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('refno').reset()
      let paymode_details = pay.paymode_details ? pay.paymode_details : undefined
      let catcode = paymode_details['data'][0]?.category_id?.code
      let subcat = paymode_details['data'][0]?.sub_category_id?.code
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('category_code').setValue(catcode)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('subcategory_code').setValue(subcat)
      if (!getcred && !this.taxableCalc) {
        this.taxableCalc = true
        let creditForm = this.InvoiceDetailForm.value.creditdtl
        let ppxDet = creditForm.filter(x => x.paymode_id?.code == 'PM006')
        let ppxAmt = ppxDet.map(x => x.amount)
        let ppxsum = ppxAmt?.reduce((a, b) => Number(String(a).replace(/,/g, '')) + Number(String(b).replace(/,/g, '')), 0);
        if ((creditForm[0].paymode_id?.code == 'PM005' || creditForm[0].paymode_id?.code == 'PM004') && ppxsum > 0) {
          this.taxableamount = this.taxableamount - ppxsum
        }

        let crnDet = creditForm.filter(x => x.paymode_id?.code == 'PM009')
        let crnAmt = crnDet.map(x => x.amount)
        let crnsum = crnAmt?.reduce((a, b) => Number(String(a).replace(/,/g, '')) + Number(String(b).replace(/,/g, '')), 0);

        if ((creditForm[0].paymode_id?.code == 'PM005' || creditForm[0].paymode_id?.code == 'PM004') && crnsum > 0) {
          this.taxableamount = this.taxableamount - crnsum
        }
        let num: number = Number(this.taxableamount)
        let taxbleAmt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        taxbleAmt = taxbleAmt ? taxbleAmt.toString() : '';

        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').setValue(taxbleAmt)
      }
      else if (!getcred) {
        let num: number = Number(this.taxableamount)
        let taxbleAmt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        taxbleAmt = taxbleAmt ? taxbleAmt.toString() : '';

        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').setValue(taxbleAmt)
        this.gettaxtype(taxtype, index)
      }
    } else {
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = true
      this.showtaxrates[index] = true
    }
    if (this.paymodecode[index] == 'PM006') {
      this.amtChangeFlag[index] = false

      if (this.getcredit == false) {
        this.showppxmodal = true
        this.popupopen15()

        // if (this.showppxmodal == true) {
        // }
        this.getPpxrecords(1)
      }
    }
    else {
      if (this.showppxmodal == true) {
        // this.popupopen15()
        this.closeppx()
      }
    }
    if (this.paymodecode[index] == 'PM010') {
      let acc_no = this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('accno').value
       this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('accno').setValue(acc_no)
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('suppliertaxtype').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('suppliertaxrate').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('accno').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      // if (this.getcredit == false) {
      //   this.showcrnmodal = true
      //   this.getCrnrecords(1)
      // }
    }
   
    if (this.paymodecode[index] == 'PM002') {
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('glno').reset()
      if (this.getcredit == false) {
        this.showglpopup = true
        // this.popupopen2()
        this.popupopen11()
        // if (this.showglpopup == true) {
        // }
        // if(this.aptypeid != 7)
        //   this.showglpopup = true
        // else
        //   this.showglpopup2 = true
        this.creditglForm.patchValue({
          name: pay.name
        })
        // if(this.aptypeid == 7)
        // {
        //   this.creditglForm.patchValue({
        //     glnum: this.invCreditList[index].glno,
        //     category_code: this.invCreditList[index].category_code,
        //     subcategory_code: this.invCreditList[index].subcategory_code,
        //     cc_code: this.invCreditList[index].cc_code,
        //     bs_code: this.invCreditList[index].bs_code,
        //   })
        // }
        this.getcreditgl(this.paymodecode[index], pay?.id)
      }


      // let chkTdsAdvCrn = creditdtlsdatas.filter (x=>x.paymode_id?.code =='PM007' ||x.paymode_id?.code =='PM006' || x.paymode_id?.code =='PM011')
      // if(chkTdsAdvCrn.length >0)
      // {
      //   this.toastr.error("Kindly select CreditGL before the TDS, Advance or CRN Entries.")
      //   this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('paymode_id').reset()
      //   return false
      // }
    }
    else {
      if (this.showglpopup == true) {
        this.showglpopup = false
      }
      else if (this.showglpopup2 == true) {
        this.showglpopup2 = false
      }
    }
  if (this.paymodecode[index] == 'PM009') {
      this.amtChangeFlag[index] = false

      if (this.getcredit == false) {
        this.showgrnpopup = true
        // this.popupopen15()

      if (this.showgrnpopup == true &&this.aptypeid == 7 && this.movedata != 'AP' && !this.creditsaved&& this.movedata != 'apapproverview') {
        this.crnglpopupopen()
      }
        this.getCrnrecords(1)
      }
      if(this.movedata != 'AP' && this.movedata != 'apapproverview'){
      if (index < this.crnCat.length) {
        this.crnglForm.get('category_code').setValue(this.crnCat[index])
        if ((this.crnSubcat[index].code).indexOf("INVALID_DATA") >= 0)
          this.crnglForm.get('subcategory_code').setValue("")
        else
          this.crnglForm.get('subcategory_code').setValue(this.crnSubcat[index])
        this.crnglForm.get('glno').setValue(this.crnGL[index])
        this.crnselcid(this.crnCat[index], this.crnSubcat[index], index)
      }
    }
    else if(this.movedata == 'AP' ||this.movedata == 'apapproverview'){
     const crnglArray = this.crnglForm.get('crnglArray') as FormArray;
        const row = crnglArray.at(0) as FormGroup;
        row.get('category_code')?.setValue(creditdtlsdatas[index].category_code);
        row.get('subcategory_code')?.setValue(creditdtlsdatas[index].subcategory_code);
        row.get('creditglno')?.setValue(creditdtlsdatas[index].glno);
    }
    }
    else {
      if (this.showgrnpopup == true) {
        // this.popupopen15()
        this.closecrnliq()
      }
    }
    if (this.paymodecode[index] == 'PM011') {
      let datas = this.InvoiceDetailForm.value.creditdtl
      if (this.getcredit == false) {

      }
      if (datas[index].glno == 0) {
        this.dataclears()
        // if(index == 0){
        //   this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amount').setValue(this.taxableamount)
        //   }
      }
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('refno').reset()

      this.showgrnpopup = true
      // this.popupopen2()

      if (this.showgrnpopup == true && this.aptypeid == 7 && this.movedata != 'AP' && !this.creditsaved&& this.movedata != 'apapproverview') {
        this.crnglpopupopen()
      }
      else{
        this.getCrnrecords(1)
        // this.crnliqpopup()
      }
      if(this.movedata != 'AP'){
      if (index < this.crnCat.length) {
        this.crnglForm.get('category_code').setValue(this.crnCat[index])
        if ((this.crnSubcat[index].code).indexOf("INVALID_DATA") >= 0)
          this.crnglForm.get('subcategory_code').setValue("")
        else
          this.crnglForm.get('subcategory_code').setValue(this.crnSubcat[index])
        this.crnglForm.get('glno').setValue(this.crnGL[index])
        this.crnselcid(this.crnCat[index], this.crnSubcat[index], index)
      }
    }
      else{
        this.crnglForm.get('category_code').setValue(datas?.category_code)
        this.crnglForm.get('subcategory_code').setValue(datas?.subcategory_code)
        this.crnglForm.get('glno').setValue(datas?.creditglno)
      }

      this.creditdatasums()
    } else {
      if (this.showgrnpopup == true) {
        this.showgrnpopup = false
      }
    }


    if (this.paymodecode[index] === "PM008") {
      this.showeraacc[index] = false
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = true
      this.showtaxrates[index] = true
      this.showtranspay[index] = false

      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').setValue("KARUR VYSYA BANK")
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').setValue("KVBL0001903")
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').setValue("EXPENSES MANAGEMENT CELL")
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').setValue("EXPENSES MANAGEMENT CELL")
      if (this.getcredit == false) {
        if (this.aptypeid == 2) {
          this.showkvbacpopup = false
          this.showaccno[index] = true
          this.getaccno(0)
        }
        else {
          this.showkvbacpopup = true
          // this.popupopen2()
          this.popupopen12()
          let mskchar = '*'
          let mskstr = mskchar.repeat(this.ICRAccNo.length)

          // if (this.showkvbacpopup) {
          // }
          this.showaccno[index] = false
          this.kvbaccForm.patchValue({
            accno: mskstr,
            confirmaccno: this.ICRAccNo,
          })
        }
      }
    }
    else {
      this.closekvbac()
    }

    for (let i = 0; i < creditdtlsdatas.length; i++) {
      if (creditdtlsdatas[i].paymode_id?.code == 'PM006' || creditdtlsdatas[i].paymode_id?.code == 'PM007' ||
        creditdtlsdatas[i].paymode_id.gl_flag === "Payable")
        this.amtChangeFlag[i] = false
      else
        this.amtChangeFlag[i] = true
    }
  }

  accountno: any
  getacc(acc, index) {

    this.accountno = acc.account_no
    this.creditids = acc?.bank_id?.id

    this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('refno').setValue(acc?.account_no)
    this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').setValue(acc?.bank_id.name)
    this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').setValue(acc?.branch_id.name)
    this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').setValue(acc?.branch_id.ifsccode)
    this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').setValue(acc?.beneficiary)
    // this.getcreditpaymodesummary(index)
  }

  getcreditpaymodesummary(index) {
    if (this.accountno === undefined) {
      this.accountnumber = this.accnumm
    } else {
      this.accountnumber = this.accountno
    }
    this.service.getcreditpaymodesummaryy(1, 10, 5, this.suppid, this.accountnumber)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.creditListed = datas
          console.log("cpres", datas)
          for (let i of this.creditListed) {

            let accno = i.account_no
            let bank = i.bank_id.name
            let branch = i.branch_id.name
            let ifsc = i.branch_id.ifsccode
            let beneficiary = i.beneficiary
            this.creditids = i.bank_id.id

            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('refno').setValue(accno)
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').setValue(bank)
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').setValue(branch)
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').setValue(ifsc)
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').setValue(beneficiary)
          }

        }

      })
  }

  optionsummary = false
  firstsummary = true
  creditListed: any
  arraydata: any
  accno: any
  creditids: any
  bankdetailsids: any
  accountnumber: any

  getbankdetailsid(det: any) {
    this.bankdetailsids = det
  }

  // getcreditpaymodesummary(index) {
  //   let ind = index
  //   if (this.accountno === undefined) {
  //     this.accountnumber = this.accnumm
  //   } else {
  //     this.accountnumber = this.accountno
  //   }
  //   this.service.getcreditpaymodesummaryy(1, 10, 5, this.suppid, this.accountnumber)
  //     .subscribe((results: any[]) => {
  //       if(results)
  //       {
  //         let datas = results["data"];
  //       this.creditListed = datas
  //       console.log("cpres", datas)
  //       for (let i of this.creditListed) {

  //         let accno = i.account_no
  //         let bank = i.bank_id.name
  //         let branch = i.branch_id.name
  //         let ifsc = i.branch_id.ifsccode
  //         let beneficiary = i.beneficiary
  //         this.creditids = i.bank_id.id

  //         this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('refno').setValue(accno)
  //         this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').setValue(bank)
  //         this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').setValue(branch)
  //         this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').setValue(ifsc)
  //         this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').setValue(beneficiary)
  //       }

  //       }

  //     })
  // }

  // choosetype(index) {
  //   this.showtaxtype[index] = true
  //   this.showtaxtypes[index] = false
  //   this.gettaxtype()

  // }

  gstamtchange(i) {
    if (this.gsttype == 'IGST') {
      this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('igst').setValue(0)
    }
    else if (this.gsttype == 'SGST & CGST') {
      this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('cgst').setValue(0)
      this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('sgst').setValue(0)
    }
  }
  chooserate(index) {
    this.showtaxrate[index] = true
    this.showtaxrates[index] = false
  }

  taxrateid: any
  taxratename: any
  vendorid: any
  maintaintaxlist: any
  othertaxlist: any
  ERAList: any
  BRAList: any
  eraaccno: any

  getERA(paymodeid, ind) {
    // console.log("paymodeid",this.paymodecode[index])
    let code
    if (this.paymodecode[ind] == 'PM004') {
      code = this.raisercode
    }
    else {
      code = this.branch_code
    }

    this.service.getbradata(code)
      .subscribe(result => {

        this.BRAList = result['data']
        console.log("BRALIST", this.BRAList)
        if (result['data'].length == 0) {
          window.alert("Account Detail does not exists.")
          return false
        }
        if (result.data != undefined) {
          if (this.paymodecode[ind] == 'PM004') {

            this.ERAList = result.data

            if (this.invCreditList.length > 0) {
              let credAccNo = this.invCreditList[ind].refno
              if (credAccNo != "") {
                let accdet = this.ERAList.filter(x => x.acno == credAccNo)[0]
                console.log("credAccNo====>", credAccNo)
                if (accdet != undefined && accdet != null) {
                  this.eraaccno = accdet.id
                  console.log("accno====>", accdet)
                  this.creditids = accdet.bankbranch_id?.bank?.id
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('accno').setValue(accdet.id)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('refno').setValue(accdet.acno)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(accdet?.bank_id?.name)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(accdet?.bankbranch_id?.name)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(accdet?.bankbranch_id?.ifsccode)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(accdet.beneficiaryname)
                }
              }
            }
            if (this.ERAList?.length == 1) {
              let accdtls = this.ERAList[0]
              this.creditids = accdtls.bankbranch_id?.bank?.id
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('accno').setValue(accdtls.id)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('refno').setValue(accdtls.acno)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(accdtls?.bank_id?.name)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(accdtls.bankbranch_id?.name)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(accdtls.bankbranch_id?.ifsccode)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(accdtls.beneficiaryname)
            }
          }
          else if (this.paymodecode[ind] == 'PM001') {
            if (this.invCreditList.length > 0) {
              let credAccNo = this.invCreditList[ind].refno
              if (credAccNo != "") {
                let accdet = this.BRAList.filter(x => x.acno == credAccNo)[0]
                console.log("credAccNo====>", credAccNo)
                if (accdet != undefined && accdet != null) {
                  console.log("accno====>", accdet)
                  this.creditids = accdet.bankbranch_id?.bank?.id
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('accno').setValue(accdet.acno)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('refno').setValue(accdet.acno)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(accdet?.bank_id?.name)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(accdet?.bankbranch_id?.name)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(accdet?.bankbranch_id?.ifsccode)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(accdet.beneficiaryname)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('glno').setValue("999999999")
                }
              }
            }
            if (this.ERAList?.length == 1) {
              let accdtls = this.ERAList[0]
              this.creditids = accdtls.bankbranch_id?.bank?.id
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('accno').setValue(accdtls.acno)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('refno').setValue(accdtls.acno)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(accdtls?.bank_id?.name)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(accdtls.bankbranch_id?.name)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(accdtls.bankbranch_id?.ifsccode)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(accdtls.beneficiaryname)
              this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('glno').setValue(999999999)
            }
            // this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('accno').setValue(BRAList[0]?.acno)
            // this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('refno').setValue(BRAList[0]?.acno)
            // this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(BRAList[0]?.bank_id?.name)
            // this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(BRAList[0]?.bankbranch_id?.name)
            // this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(BRAList[0]?.bankbranch_id?.ifsccode)
            // this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(BRAList[0]?.beneficiaryname)
            // this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('glno').setValue("999999999")              
          }
        }
      })
  }

  getEraAccDet(acc, ind) {
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('accno').setValue(acc.id)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('refno').setValue(acc.acno)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(acc.bank_id?.name)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(acc.bankbranch_id?.name)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(acc.bankbranch_id?.ifsccode)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(acc.beneficiaryname)
  }

  getBraAccDet(acc, ind) {
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('accno').setValue(acc.acno)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('refno').setValue(acc.acno)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(acc.bank_id?.name)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(acc.bankbranch_id?.name)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(acc.bankbranch_id?.ifsccode)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(acc.beneficiaryname)
  }



  gettaxtype(taxtype = "", ind = 0) {
    this.service.getvendorid(this.suppid)
      .subscribe(result => {
        if (result) {
          this.vendorid = result["data"][0].supplierbranch_id.vendor_id
          this.service.gettdstaxtype1(this.vendorid)
            .subscribe(results => {
              this.taxlist = results["data"]
              if (this.taxlist.length == 0) {
                this.notification.showError("Tax Details not available for the Supplier.")
                this.removecreditSection(ind, 'TDS', 0)
                this.creditdetForm.controls['is_tds_applicable'].setValue(1)
              }
              if (taxtype != "") {
                let tax = this.taxlist.filter(x => x.subtax.name == taxtype)[0]
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('suppliertaxtype').setValue(taxtype)
                this.gettaxrates(tax, ind, true)
              }
            })
        }
      })
  }

  gettaxtypeScroll() {
    setTimeout(() => {
      if (
        this.mattactypeAutocomplete &&
        this.autocompleteTrigger &&
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
                this.service.gettdstaxtype1Scroll(this.vendorid, this.currentpage + 1)
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

  subtaxid: any;
  gettaxrates(tax, ind, getcred = false) {
    this.taxrateid = tax.subtax.tax.id
    this.subtaxid = tax.subtax.id
    // Get Supplier Details

    console.log("tax---", tax)
    let tdsCalc = false
    if ((this.suppid !== null && this.suppid !== undefined && this.suppid !== "") && (this.paytoid == "S" || this.paytoid == "B")) {
      this.service.getsupplierdet(this.suppid, this.apinvHeader_id, this.taxrateid, this.subtaxid)
        .subscribe(result => {
          if (result) {
            let supplierdata = result["data"];
            console.log("supplier details>>", supplierdata)
            if (supplierdata?.length > 0) {
              this.supplierdata = supplierdata[0]
              this.creditdetForm.patchValue(
                {
                  // supName : this.invHdrRes.supplier.name,
                  isexcempted: this.supplierdata.isexcempted == 'Y' ? 'Yes' : 'No'
                })

              if (this.supplierdata.isexcempted === "Y") {
                this.showthreshold = true

                let num: number = Number(this.supplierdata.excemthrosold_amt)
                let thresAmt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                thresAmt = thresAmt ? thresAmt.toString() : '';

                num = Number(this.supplierdata.paid_invoiceamount)
                let paidInvAmt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                paidInvAmt = paidInvAmt ? paidInvAmt.toString() : '';

                num = +this.supplierdata.excemthrosold_amt - +this.supplierdata.paid_invoiceamount
                let balAmt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                balAmt = balAmt ? balAmt.toString() : '';

                if (this.supplierdata.is_throsold == true) {
                  paidInvAmt = thresAmt
                  balAmt = "0"
                }

                this.creditdetForm.patchValue(
                  {
                    TDSSection: tax.subtax.name,
                    TDSRate: this.supplierdata.vendor_data.data[0].excemrate,
                    thresholdValue: thresAmt,
                    amountPaid: paidInvAmt,
                    normaltdsRate: tax.taxrate.rate,
                    balThroAmt: balAmt,
                    startdate: this.datepipe.transform(this.supplierdata.excemfrom, 'dd-MMM-yyyy'),
                    enddate: this.datepipe.transform(this.supplierdata.excemto, 'dd-MMM-yyyy')
                  }
                )
                if (getcred == false) {
                  if (this.supplierdata.is_throsold == false) {
                    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('taxexcempted').setValue("Yes")
                    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('suppliertaxrate').setValue(this.supplierdata.vendor_data.data[0].excemrate)
                    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('glno').setValue(tax.subtax.glno)

                    let exceedAmt = this.supplierdata.current_exide_amt
                    if (exceedAmt == null || exceedAmt == undefined) {
                      tdsCalc = true

                      num = +this.taxableamount
                      let taxbleAmt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                      taxbleAmt = taxbleAmt ? taxbleAmt.toString() : '';
                      this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('taxableamount').setValue(taxbleAmt)
                      this.gettaxcalc(ind)
                    }
                    else {
                      tdsCalc = true
                      num = +this.supplierdata.current_tds_applicable_amt
                      let tdsApplAmt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                      tdsApplAmt = tdsApplAmt ? tdsApplAmt.toString() : '';
                      this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('taxableamount').setValue(tdsApplAmt)
                      this.gettaxcalc(ind, exceedAmt)
                    }
                  }
                }
              }
              else {
                this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('taxexcempted').setValue('No')
                this.showthreshold = false
              }
            }
          }
        }, error => {
          console.log("Error while getting supplier info..", error)
          this.spinner.hide();
        }
        )
    }

    // this.taxratename = tax.subtax.name
    console.log("suppliertax.....", tax)
    // console.log("this.taxratename.....", this.taxratename)

    if (getcred == false && tdsCalc == false) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('suppliertaxrate').setValue(tax.taxrate.rate)
      this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('glno').setValue(tax.subtax.glno)

      this.gettaxcalc(ind)
    }
  }

  gettaxid(data) {
    this.taxrateid = data.id

    // this.taxratename = data.subtax_type
    this.gettdstaxrates()
  }

  maintaintaxratelist: any
  othertaxratelist: any
  gettdstaxrates() {
    this.service.gettdstaxrate(this.vendorid, this.taxrateid)
      .subscribe(result => {
        this.taxratelist = result['data']
        this.maintaintaxratelist = this.taxratelist.filter(dept => dept.dflag === "M");
        this.othertaxratelist = this.taxratelist.filter(dept => dept.dflag === "O");

      })

  }
  taxindex: any


  gettaxcalc(index, exceedAmt = 0) {
    this.taxindex = index

    let creditdata = this.InvoiceDetailForm.value.creditdtl
    let taxrate = creditdata[index].suppliertaxrate
    let taxableamt = String(creditdata[index].taxableamount).replace(/,/g, '')

    if (taxrate === undefined || taxrate === "" || taxrate === null || taxableamt === undefined || taxableamt === "" || taxableamt === null) {
      return false
    }

    if (taxrate != undefined || taxrate != "" || taxrate != null || taxableamt != undefined || taxableamt != "" || taxableamt != null) {

      this.service.gettdstaxcalculation(taxableamt, taxrate)
        .subscribe(results => {
          console.log("taxres", results)
          let amount = Math.round(results.tdsrate)
          let num = +amount
          let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
          amt = amt ? amt.toString() : '';
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(amt)
          if (exceedAmt > 0) {
            this.addcreditSection(exceedAmt = exceedAmt)
          }
        })
    }

  }
  suppid: any
  creditList: any
  paymodename: any
  creditListeds: any
  getcreditsummary(pageNumber = 1, pageSize = 10) {
    this.service.getcreditsummary(pageNumber, pageSize, this.suppid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.creditListeds = datas;
        for (var i = 0; i < datas.length; i++) {
          this.paymodename = datas[i].paymode_id.name
        }
      })

  }

  accdata: any
  accnumm: any
  // getaccno(paymode, index) {
  //   console.log("suppid",this.suppid)
  //   this.service.getbankaccno(paymode, this.suppid)
  //     .subscribe(res => {
  //       if(res['data'] != undefined)
  //       {
  //         this.accDetailList = res['data']
  //         console.log("account details...", this.accDetailList)
  //         if (this.accDetailList?.length == 1)
  //         {
  //           this.accdata = this.accDetailList[0]?.id
  //           this.accnumm = this.accDetailList[0]?.account_no

  //           this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('accno').setValue(this.accdata) 
  //           this.getcreditpaymodesummary(index)                    
  //         } 
  //         else if (this.accDetailList?.length > 1)
  //         {
  //           let credAccNo = this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('refno').value
  //           if (credAccNo != "")
  //           {
  //             let id = this.accDetailList.filter(x => x.account_no == credAccNo)[0]?.id
  //             if (id != undefined && id != null)
  //             {
  //               this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('accno').setValue(id) 
  //               this.accnumm = credAccNo
  //             }              
  //           }   
  //         }         
  //       }
  //     })

  // }

  supplierPaymodes: any
  getaccno(index) {
    this.supplierPaymodes = [];
    let seen = [];
    for (let i = 0; i < this.accDetailList.length; i++) {
      if (seen.indexOf(this.accDetailList[i]?.paymode_id?.code) == -1) {
        seen.push(this.accDetailList[i].paymode_id?.code);
        this.supplierPaymodes.push(this.accDetailList[i].paymode_id);
      }
    }

    console.log(seen)
    if (this.supplierPaymodes?.length == 1) {
      let paymodedata = this.paymodesList.filter(x => x.code == this.supplierPaymodes[0]?.code)[0]
      this.paymodecode[index] = paymodedata?.code
      if (paymodedata?.code == 'PM005' || paymodedata?.code == 'PM008' || paymodedata?.code == 'PM003')
        this.showaccno[index] = true
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('paymode_id').setValue(paymodedata)
      let datas = this.paymodesList.filter(x => x.code == paymodedata?.code)
      // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])

      if (datas[0].paymode_details?.data?.length == 0) {
        this.notification.showError("Paymode Details Empty")
      }
      else {
        let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

        let gl = datas[0].paymode_details['data'][0]?.glno
        let catcode = paymode_details['data'][0]?.category_id?.code
        let subcat = paymode_details['data'][0]?.sub_category_id?.code
        this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
        this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
        this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
      }
    }
    console.log("account details...", this.accDetailList)
    if (this.accDetailList?.length == 1) {
      this.accdata = this.accDetailList[0]?.id
      this.accnumm = this.accDetailList[0]?.account_no
      this.creditids = this.accDetailList[0]?.bank_id?.id
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('accno').setValue(this.accdata)

      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('refno').setValue(this.accDetailList[0]?.account_no)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').setValue(this.accDetailList[0]?.bank_id.name)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').setValue(this.accDetailList[0]?.branch_id.name)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').setValue(this.accDetailList[0]?.branch_id.ifsccode)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').setValue(this.accDetailList[0]?.beneficiary)
    }
    else if (this.accDetailList?.length > 1) {
      let paymode = this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('paymode_id').value
      this.accList = this.accDetailList.filter(x => x.paymode_id?.code == paymode?.code)
      let credAccNo = this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('refno').value
      if (credAccNo != "") {
        let data = this.accDetailList.filter(x => x.account_no == credAccNo)[0]
        if (data?.id != undefined && data?.id != null) {
          this.creditids = data?.bank_id?.id
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('accno').setValue(data.id)
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('refno').setValue(data?.account_no)
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').setValue(data?.bank_id.name)
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').setValue(data?.branch_id.name)
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').setValue(data?.branch_id.ifsccode)
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').setValue(data?.beneficiary)
          this.accnumm = credAccNo
        }
      }
    }
    let creditgl = this.supplierPaymodes.filter(x => x.code == 'PM002')[0]
    if (creditgl == undefined) {
      this.supplierPaymodes.push(this.creditGLPaymode)
    }
  }

  getcreditgl(payid, id) {
    this.service.creditglno(id)
      .subscribe(res => {
        this.glList = res['data']
      })
  }

  creditglData: any
  getgl(gl) {
    this.creditglData = gl
    // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('accno').setValue(this.creditgllno)

    // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('glno').setValue(this.creditgllno)
    // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('refno').setValue(this.creditgllno)
    // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('category_code').setValue(gl?.category_id)
    // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('subcategory_code').setValue(gl?.sub_category_id)
  }
  crnback(){
    this.closebuttonsgl.nativeElement.click()
  }
  glsubmitForm() {
    if(this.aptypeid != 7){
    if (this.creditglData?.glno == '' || this.creditglData?.glno == undefined) {
      this.notification.showError('Please Choose Credit GL')
      return false
    }
    this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('glno').setValue(this.creditglData?.glno)
    this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('refno').setValue(this.creditglData?.glno)
    this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('category_code').setValue(this.creditglData?.category_id)
    this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('subcategory_code').setValue(this.creditglData?.sub_category_id)
    if (this.aptypeid == 7) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('refno').setValue(this.creditglData.glno)
      // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('accno').setValue(this.creditgllno)
      // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('category_code').setValue(this.creditglForm.value.category_code.code)
      // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('subcategory_code').setValue(this.creditglForm.value.subcategory_code.code)
      // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('bs_code').setValue(this.creditglForm.value.bs_code)
      // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('cc_code').setValue(this.creditglForm.value.cc_code)
      // this.invCreditList[this.getcreditindex].glno = this.creditglForm.value.glnum
      // this.invCreditList[this.getcreditindex].category_code = this.creditglForm.value.category_code
      // this.invCreditList[this.getcreditindex].subcategory_code = this.creditglForm.value.subcategory_code
      // this.invCreditList[this.getcreditindex].bs_code = this.creditglForm.value.bs_code
      // this.invCreditList[this.getcreditindex].cc_code = this.creditglForm.value.cc_code

      this.credit_GL = {
        label: "Credit Gl",
        method: "get",
        url: this.ecfURL + "mstserv/paymodecreditgl/" + this.paywholedata.id,
        displaykey: "glno",
        wholedata: true,
        formControlName: "glnum"
        // defaultvalue: this.edit_credit_gl,
        // required: true,
      };
    }
    this.creditglForm.controls['glnum'].setValue('')
    this.creditglData = {}
    this.showglpopup = false
    this.showglpopup2 = false
    this.closebuttons.nativeElement.click();
  }
}

  closeCreditGL() {
    this.creditglData = {}
    this.creditglForm.reset()
    let gl = this.InvoiceDetailForm.value.creditdtl[this.getcreditindex].glno
    if (gl == '' || gl == undefined || gl == null) {
      this.removecreditSection(this.getcreditindex, 'CREDITGL', 0)
    }
    this.showglpopup = false
    this.showglpopup2 = false
    this.closebuttons.nativeElement.click();
    this.creditglForm.controls['glnum'].setValue('')
  }
  getPpxSections(form) {
    return form.controls.ppxdtl.controls;
  }
  getCrndetSections(form) {
    return form.controls.crndtl.controls;
  }

  ppxDisable = [false, false, false, false, false, false, false]
  getPpxrecords(page) {
    this.ppxLoad = true
    let ppxcontrol = this.ppxForm.controls["ppxdtl"] as FormArray;
    ppxcontrol.clear()
    console.log("this.ppxdata-->", this.ppxdata)
   
  const startIndex = (page - 1) * this.pageSize_ppx;
  const endIndex = startIndex + this.pageSize_ppx;
 let x = startIndex
  let slicedPpxdata = this.ppxdata.slice(startIndex, endIndex);
    if(this.liqflag== 0){
    for (let ppx of slicedPpxdata) {
      // let ecf
      // let ppxdet
      // let bal =+ppx.ppxheader_balance
      // if(this.modificationFlag =="modification" || this.modificationFlag =="edit")
      // { 
      //   ppxdet = ppx.ppxdetails.data   
      //   let data =  ppxdet.filter(x => x.current_crno == this.crno)

      //   if(data.length>0)
      //   {
      //     ecf = data[0]?.ecf_amount
      //     bal = +ppx.ppxheader_balance + data[0].ppxdetails_adjusted
      //   }        
      // }
      let id: FormControl = new FormControl('');
      let name: FormControl = new FormControl('');
      let crno: FormControl = new FormControl('');
      let raiserbranch: FormControl = new FormControl('');
      let ppxheader_date: FormControl = new FormControl('');
      let ppxheader_amount: FormControl = new FormControl('');
      let ecfheader_id: FormControl = new FormControl('');
      let ppxheader_balance: FormControl = new FormControl('');
      let credit_glno: FormControl = new FormControl(0);
      let ppxdetails: FormControl = new FormControl('');
      let ecf_amount: FormControl = new FormControl('');
      let liquidate_amt: FormControl = new FormControl('');
      let adv_debit_cat_code: FormControl = new FormControl('');
      let adv_debit_subcat_code: FormControl = new FormControl('');
      let select: FormControl = new FormControl('');

      const ppxFormArray = this.ppxForm.get("ppxdtl") as FormArray;

      id.setValue(ppx.id)
      name.setValue(this.invHdrRes?.supplier_id?.name)
      crno.setValue(ppx.crno)
      let rsrbr
      if (this.movedata == 'ECF')
        rsrbr = ppx?.raiser_branch?.name + ' - ' + ppx?.raiser_branch?.code
      else
        rsrbr = ppx?.raiser_branch?.name + ' - ' + ppx?.raiser_branch?.code
      raiserbranch.setValue(rsrbr)
      adv_debit_cat_code.setValue(this.movedata == 'ECF' ? ppx.category_code : ppx.adv_debit_cat_code)
      adv_debit_subcat_code.setValue(this.movedata == 'ECF' ? ppx.subcategory_code : ppx.adv_debit_subcat_code)
      ppxheader_date.setValue(this.datepipe.transform(ppx.ppxheader_date, 'dd-MMM-yyyy'))

      let num: number = +ppx.ppxheader_amount
      let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      amt = amt ? amt.toString() : '';
      ppxheader_amount.setValue(amt)

      ecfheader_id.setValue("")

      num = +ppx.ppxheader_balance
      amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      amt = amt ? amt.toString() : '';
      ppxheader_balance.setValue(amt)

      credit_glno.setValue(this.movedata == 'ECF' ? ppx.debit_glno : ppx.adv_debit_glno)
      ppxdetails.setValue(ppx.ppxdetails)

      // num = ecf ? ecf : 0
      // amt = new Intl.NumberFormat("en-GB").format(num); 
      // amt = amt ? amt.toString() : '';
      // ecf_amount.setValue(amt)
      ecf_amount.setValue(0)
      let selectedppx = this.selectedppxdata.filter(x => x.crno == ppx.crno)[0]
       if(selectedppx != undefined){
         liquidate_amt.setValue(selectedppx.liquidate_amt)
         select.setValue(true)
       }
       else{
         liquidate_amt.setValue(0)
         select.setValue(false)
       }

      // if (bal>0)
      // {
      //   this.ppxDisable[x] = false     
      // }
      // else
      // {
      //   this.ppxDisable[x] = true     
      // }
   let selectppx = this.selectedppxdata.find(x => x.crno === ppx.crno);
      if (selectppx) {
        liquidate_amt.setValue(selectppx.liquidate_amt);
        select.setValue(true);
      }
      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

      for (let i in creditdtlsdatas) {
        if (creditdtlsdatas[i].paymode_id?.code == 'PM006' && creditdtlsdatas[i].refno == ppx.crno) {
          if (this.getcreditindex == i) {
            this.ppxDisable[x] = false
          }
          else {
            this.ppxDisable[x] = true
          }
           // num = +creditdtlsdatas[i].amount
          // amt = new Intl.NumberFormat("en-GB").format(num); 
          // amt = amt ? amt.toString() : '';
          liquidate_amt.setValue(creditdtlsdatas[i].amount)
          select.setValue(true)
        }

      }
      ppxFormArray.push(new FormGroup({
        id: id,
        name: name,
        crno: crno,
        raiserbranch: raiserbranch,
        ppxheader_date: ppxheader_date,
        ppxheader_amount: ppxheader_amount,
        ecfheader_id: ecfheader_id,
        ppxheader_balance: ppxheader_balance,
        credit_glno: credit_glno,
        ppxdetails: ppxdetails,
        ecf_amount: ecf_amount,
        liquidate_amt: liquidate_amt,
        adv_debit_cat_code: adv_debit_cat_code,
        adv_debit_subcat_code: adv_debit_subcat_code,
        select: select
      }))
      x++
    }
    }
    if(this.liqflag== 1){
    for (let ppx of slicedPpxdata) {
      let id: FormControl = new FormControl('');
      let name: FormControl = new FormControl('');
      let crno: FormControl = new FormControl('');
      let raiserbranch: FormControl = new FormControl('');
      let ppxheader_date: FormControl = new FormControl('');
      let ppxheader_amount: FormControl = new FormControl('');
      let ecfheader_id: FormControl = new FormControl('');
      let ppxheader_balance: FormControl = new FormControl('');
      let credit_glno: FormControl = new FormControl(0);
      let ppxdetails: FormControl = new FormControl('');
      let ecf_amount: FormControl = new FormControl('');
      let liquidate_amt: FormControl = new FormControl('');
      let adv_debit_cat_code: FormControl = new FormControl('');
      let adv_debit_subcat_code: FormControl = new FormControl('');
      let select: FormControl = new FormControl('');

      const ppxFormArray = this.ppxForm.get("ppxdtl") as FormArray;

      id.setValue(ppx.id)
      name.setValue(this.invHdrRes?.supplier_id?.name)
      crno.setValue(ppx.crno)
      let rsrbr
      if (this.movedata == 'ECF')
        rsrbr = ppx?.branch_name + ' - ' + ppx?.branch_code
      else
        rsrbr = ppx?.raiser_branch?.name + ' - ' + ppx?.raiser_branch?.code
      raiserbranch.setValue(rsrbr)
      adv_debit_cat_code.setValue(this.movedata == 'ECF' ? ppx.category_code : ppx.adv_debit_cat_code)
      adv_debit_subcat_code.setValue(this.movedata == 'ECF' ? ppx.subcategory_code : ppx.adv_debit_subcat_code)
      ppxheader_date.setValue(this.datepipe.transform(ppx.ppxheader_date, 'dd-MMM-yyyy'))

      let num: number = +ppx.ppxheader_amount
      let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      amt = amt ? amt.toString() : '';
      ppxheader_amount.setValue(amt)

      ecfheader_id.setValue("")

      num = +ppx.ppxheader_balance
      amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      amt = amt ? amt.toString() : '';
      ppxheader_balance.setValue(amt)

      credit_glno.setValue(this.movedata == 'ECF' ? ppx.debit_glno : ppx.adv_debit_glno)
      ppxdetails.setValue(ppx.ppxdetails)

      // num = ecf ? ecf : 0
      // amt = new Intl.NumberFormat("en-GB").format(num); 
      // amt = amt ? amt.toString() : '';
      // ecf_amount.setValue(amt)
      ecf_amount.setValue(0)
      let selectedppx = this.selectedppxdata.filter(x => x.crno == ppx.crno)[0]
       if(selectedppx != undefined){
         liquidate_amt.setValue(selectedppx.liquidate_amt)
         select.setValue(true)
       }
       else{
         liquidate_amt.setValue(0)
         select.setValue(false)
       }
   let selectppx = this.selectedppxdata.find(x => x.crno === ppx.crno);
      if (selectppx) {
        liquidate_amt.setValue(selectppx.liquidate_amt);
        select.setValue(true);
      }
      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

      for (let i in creditdtlsdatas) {
        if (creditdtlsdatas[i].paymode_id?.code == 'PM006' && creditdtlsdatas[i].refno == ppx.crno) {
          if (this.getcreditindex == i) {
            this.ppxDisable[x] = false
          }
          else {
            this.ppxDisable[x] = true
          }
           // num = +creditdtlsdatas[i].amount
          // amt = new Intl.NumberFormat("en-GB").format(num); 
          // amt = amt ? amt.toString() : '';
          liquidate_amt.setValue(creditdtlsdatas[i].amount)
          select.setValue(true)
        }

      }
      ppxFormArray.push(new FormGroup({
        id: id,
        name: name,
        crno: crno,
        raiserbranch: raiserbranch,
        ppxheader_date: ppxheader_date,
        ppxheader_amount: ppxheader_amount,
        ecfheader_id: ecfheader_id,
        ppxheader_balance: ppxheader_balance,
        credit_glno: credit_glno,
        ppxdetails: ppxdetails,
        ecf_amount: ecf_amount,
        liquidate_amt: liquidate_amt,
        adv_debit_cat_code: adv_debit_cat_code,
        adv_debit_subcat_code: adv_debit_subcat_code,
        select: select
      }))
      x++
    }
    }
    this.getPPXsum()
    this.ppxLoad = false
    this.length_ppx =this.ppxcount
    this.ppxCurrentPage = page;
    if(page == 1){
      this.pageIndexppx = 0;  
  }

  }

  
  length_ppx = 0;
 
  ppxCurrentPage =1
  pageSize_ppx = 5
  pageIndexppx=0
  handlePpx(event: PageEvent) {
    this.pageSize_ppx = event.pageSize;
    this.pageIndexppx = event.pageIndex;
    this.ppxCurrentPage=event.pageIndex+1;
    this.getPpxrecords(this.ppxCurrentPage);
  }

  selectedppxdata: any = []
  liquidatevalue: any
  ppxCrno: any
  submitppx() {
    const credForm = this.InvoiceDetailForm.value.creditdtl
     let amts = credForm.filter(x=>x?.paymode_id?.code != 'PM006')
     let sumamts = amts.reduce((a, b) => Number(String(a).replace(/,/g, '')) + Number(String(b).replace(/,/g, '')), 0)
     let payamt = this.totalamount -sumamts
    if (this.ppxsum > this.totalamount || this.ppxsum > +payamt) {
      this.notification.showError("Liquidate Amount should not exceed the Invoice amount or Payable Amount.")
      return false
    }
    // for (let i in ppxForm)
     //  {
     //    console.log("ppxForm[i].select--",ppxForm[i].select)
     //    if(ppxForm[i].select == true)
     //    {
     //     ppxselected = true
     //     if(this.selectedppxdata.length >0)
     //     {
     //       for (let j=0; j< this.selectedppxdata.length;j++)
     //       {
     //         if(this.selectedppxdata[j].crno == ppxForm[i].crno)
     //         {
     //           ind = j
               
     //           this.selectedppxdata[j].liquidate_amt=ppxForm[i].liquidate_amt
     //         }
     //       }
     //     }
     //     if(ind == undefined)
     //     {
     //       this.selectedppxdata.push(ppxForm[i])
     //     }        
     //    }
     //  }
      
     if (this.selectedppxdata.length ==0 || this.ppxsum <=0){
      this.notification.showError("Please select an Advance No. and give amount to Liquidate.")
      return false
    }  
    for(let i=0; i<this.selectedppxdata.length; i++){      
      if (Number(String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''))<=0)
        {
         this.notification.showError("Please give a valid amount to liquidate.")
         return false
        }
    }
    let credform = this.InvoiceDetailForm.value.creditdtl
    for(let i= 0;i<this.selectedppxdata.length; i++){
        let liqadded = false
        for (let j=0; j< credform.length;j++){
          if(credform[j].paymode_id?.code =='PM006' && this.selectedppxdata[i].crno == credform[j].refno) {
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amountchange').setValue(this.selectedppxdata[i].liquidate_amt)
            liqadded = true
            break;

          }
          else if(credform[j].paymode_id?.code =='PM006' && credform[j].refno =='' ){
            liqadded = true
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('ddtranbranch').setValue(this.selectedppxdata[i].raiserbranch)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('refno').setValue(this.selectedppxdata[i].crno)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('glno').setValue(this.selectedppxdata[i].credit_glno)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amountchange').setValue(this.selectedppxdata[i].liquidate_amt)
            if (this.liqflag === 0) {
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('category_code').setValue(this.selectedppxdata[i].adv_debit_cat_code)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('subcategory_code').setValue(this.selectedppxdata[i].adv_debit_subcat_code)   
            } 
            else{
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('category_code').setValue(this.selectedppxdata[i].category_code)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('subcategory_code').setValue(this.selectedppxdata[i].subcategory_code)   

            }        
          } 
        }
        if (liqadded == false) {
          // this.selectedppxdata.push(ppxForm[i])
          this.addcreditSection(0,'PM006')
          let len = this.InvoiceDetailForm.value.creditdtl.length-1
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('ddtranbranch').setValue(this.selectedppxdata[i].raiserbranch)
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('refno').setValue(this.selectedppxdata[i].crno)
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('glno').setValue(this.selectedppxdata[i].credit_glno)
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('amountchange').setValue(this.selectedppxdata[i].liquidate_amt)
           if (this.liqflag === 0) {
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('category_code').setValue(this.selectedppxdata[i].adv_debit_cat_code)
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('subcategory_code').setValue(this.selectedppxdata[i].adv_debit_subcat_code)
          } 
          else{
            this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('category_code').setValue(this.selectedppxdata[i].category_code)
            this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('subcategory_code').setValue(this.selectedppxdata[i].subcategory_code)   

          } 
        }  
        credform =this.InvoiceDetailForm.value.creditdtl
    }

    for (let j=0; j< credform.length;j++){
      if(credform[j].paymode_id.code == 'PM006'){
        let chkselected = this.selectedppxdata.filter(x=> x.crno==credform[j].refno)
        if(chkselected.length ==0){
          this.deletecreditdetail(credform[j], j, false)
        }
      }
    }
     
    let ppxcontrol = this.ppxForm.controls["ppxdtl"] as FormArray;
    ppxcontrol.clear()
    this.closeppxbutton.nativeElement.click();
    this.closeppx()
    this.showppxmodal =false
    console.log("this.selectedppx==", this.selectedppxdata)
  }

  ppxamt(e, ind) {
    if (this.ppxLoad == false) {
      let liqamts = this.ppxForm.value['ppxdtl'].map(x => String(x.liquidate_amt).replace(/,/g, ''));
      let amt = liqamts.reduce((a, b) => Number(a) + Number(b), 0);
      let liqamt = String(this.ppxForm.value.ppxdtl[ind].liquidate_amt).replace(/,/g, '')
      let balamt = String(this.ppxForm.value.ppxdtl[ind].ppxheader_balance).replace(/,/g, '')
      let limitamt = String(this.ppxForm.value.ppxdtl[ind].liquidate_limit).replace(/,/g, '')

      if (+liqamt > Number(balamt) || +amt > this.totalamount || +liqamt > +limitamt) {
        let n = liqamt.slice(0, liqamt.length - 1)
        let num: number = +n
        liqamt = new Intl.NumberFormat("en-GB").format(num);
        liqamt = liqamt ? liqamt.toString() : '';
        this.ppxForm.get('ppxdtl')['controls'][ind].get('liquidate_amt').setValue(liqamt)
        this.notification.showError("Liquidate amount should not exceed the Invoice Amount, Balance Amount and Liquidate Limit.")
      }
      else {
        this.ppxChangeToCurrency(ind)
      }
      if(this.ppxForm.value.ppxdtl[ind].select){
        for(let i=0; i<this.selectedppxdata.length; i++){
          if(this.selectedppxdata[i].crno ==this.ppxForm.value.ppxdtl[ind].crno )
            this.selectedppxdata[i].liquidate_amt=this.ppxForm.value.ppxdtl[ind].liquidate_amt
        }
      } 
    }
  }


  closeppx() {
    this.showppxmodal = false
    this.closeppxbutton.nativeElement.click();
    
//     (document.activeElement as HTMLElement)?.blur();
//   const modalEl = document.getElementById('liqdetailspop');
//   const modalInstance = (bootstrap as any).Modal.getInstance(modalEl);
//   if (modalInstance) {
//     modalInstance.hide();
//   }
// const backdrop = document.querySelector('.modal-backdrop');
//   if (backdrop) {
//     backdrop.remove();
//   }

  this.pageIndexppx = 0;
  this.currentPageppx = 1;
  this.pageIndexcrn = 0;
  this.currentPagecrn = 1;
    const credForm = this.InvoiceDetailForm.value.creditdtl
    if (credForm[this.getcreditindex].refno == '' || credForm[this.getcreditindex].refno == undefined)
      this.removecreditSection(this.getcreditindex, credForm[this.getcreditindex].paymode_id?.name, 0)
    if (this.selectedppxdata.length == 0) {
      // const credForm = this.InvoiceDetailForm.value.creditdtl
      for (let i = 0; i < credForm.length; i++) {
        if (credForm[i].paymode_id?.code == 'PM006') {
          if (credForm[i].id != undefined) {
            this.spinner.show();
            this.service.credDebitDel(credForm[i].id)
              .subscribe(result => {
                this.spinner.hide();

                if (result.status == "success") {
                  this.removecreditSection(i, credForm[i].paymode_id?.name, 0)
                }
                else {
                  this.notification.showError(result.description)
                }
              })
          }
          else {
            this.removecreditSection(i, credForm[i].paymode_id?.name, 0)
          }
        }
      }
    }
  }

  ppxsum: any
  ppxselect(e, ind) {
    const ppxForm = this.ppxForm.value.ppxdtl

    for(let i=0; i<this.selectedppxdata.length; i++){
      if(this.selectedppxdata[i].crno ==ppxForm[ind].crno && e.checked){
        this.selectedppxdata[i].liquidate_amt=ppxForm[ind].liquidate_amt
        this.getPPXsum()
        return false
      }
      else if(this.selectedppxdata[i].crno ==ppxForm[ind].crno && ! e.checked){
        this.selectedppxdata = this.selectedppxdata.filter(obj => obj.crno != ppxForm[ind].crno);
        console.log("this.selectedppxdata after deselect---",this.selectedppxdata)
        this.getPPXsum()
        return false
      }
    }

    this.selectedppxdata.push(ppxForm[ind])
    // let addedppx = this.selectedppxdata.filter(x=> x.crno ==ppxForm[ind].crno)[0]
    // if(e.checked==true )
    // {       
    //   let ppxselected =false
    //   for (let i in ppxForm)
    //    {
    //     if(i != ind && ppxForm[i].select == true && this.ppxDisable[i] == false)
    //     {
    //       ppxselected = true
    //     }
    //    }
    //    if (ppxselected == true)
    //    {
    //     this.notification.showError("Please select only one Advance.")
    //     this.ppxForm.get('ppxdtl')['controls'][ind].get('select').setValue(false)
    //     return false         
    //    }
    //}
    this.getPPXsum();
  }

  getPPXsum() {
    if (this.ppxLoad == false) {
      this.ppxsum = 0
     

      for (let i in this.selectedppxdata) {
        this.ppxsum +=+(String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''))
      }
      // const ppxForm = this.ppxForm.value.ppxdtl
  
      // for (let i in ppxForm)
      //  {
      //    if(ppxForm[i].select == true)
      //    {
      //     this.ppxsum +=+(String(ppxForm[i].liquidate_amt).replace(/,/g, ''))
      //    }
      //  }
    }
  }

  creditdetails() {
    let group = new FormGroup({
      invoiceheader_id: new FormControl(this.apinvHeader_id),
      paymode_id: new FormControl(''),
      creditbank_id: new FormControl(''),
      subtax_id: new FormControl(''),
      glno: new FormControl(0),
      refno: new FormControl(''),
      suppliertaxtype: new FormControl(''),
      suppliertaxrate: new FormControl(''),
      taxexcempted: new FormControl('No'),
      amount: new FormControl(0),
      amountchange: new FormControl(''),
      taxableamount: new FormControl(0),
      ddtranbranch: new FormControl(this.transaction_branch),
      ddpaybranch: new FormControl(0),
      category_code: new FormControl(''),
      subcategory_code: new FormControl(''),
      branch: new FormControl(''),
      benificiary: new FormControl(''),
      bank: new FormControl(''),
      ifsccode: new FormControl(''),
      accno: new FormControl(''),
      credittotal: new FormControl(''),
      debitbank_id: new FormControl(''),
      bs_code: new FormControl(''),
      cc_code: new FormControl(''),
      ccbspercentage: new FormControl(''),
      entry_type: new FormControl(2),
    })

    group.get('amountchange').valueChanges.pipe(
      debounceTime(500)
    ).subscribe(value => {

      this.amountReduction()
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
    }
    )
    return group
  }


  public displayFnFilter(filterdata?: taxtypefilterValue | any): string | undefined {
    if (filterdata.subtax !== undefined) {
      return filterdata ? filterdata.subtax.name : undefined;
    }
    else {
      return filterdata
    }
  }
  get filterdata() {
    return this.InvoiceDetailForm.get('suppliertaxtype');
  }
  calcreditamount: any
  fullliq = false

  amountReductionold() {
    let creditForm = this.InvoiceDetailForm.value.creditdtl
    let reductionSum = 0
    let roundoffamt: number = 0
    if (creditForm.length == 1) {
      return false
    }
    for (let i in creditForm) {
      let amtch = +String(creditForm[i].amountchange).replace(/,/g, '')
      if (((amtch >= 0 && creditForm[i].paymode_id?.code == 'PM007') || (amtch > 0 && creditForm[i].paymode_id?.code != 'PM007'))
        && creditForm[i].glno != "151515" && creditForm[i].glno != "151516" && creditForm[i].glno != "151517") {
        reductionSum += amtch
        let num: number = amtch
        let amt = new Intl.NumberFormat("en-GB").format(num);
        amt = amt ? amt.toString() : '';
        this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('amount').setValue(amt)
      }

      if (reductionSum == this.invHdrRes.totalamount) {
        this.fullliq = true
      }
      else {
        this.fullliq = false
      }
    }

    let num: number = Number(this.invHdrRes.totalamount - reductionSum)
    let amt = new Intl.NumberFormat("en-GB").format(num);
    amt = amt ? amt.toString() : '';
    if (creditForm[0].paymode_id?.code == 'PM004' || creditForm[0].paymode_id?.code == 'PM005') {
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
    }


    this.creditdatasums();

  }

  // getCredDelOrNot(creditindex){
  //   let amt =(this.InvoiceDetailForm.value.creditdtl[creditindex].amount).replace(/,/g, '')
  //   if( ((this.paymodecode[creditindex] == 'PM004'|| this.paymodecode[creditindex] == 'PM001' || this.paymodecode[creditindex] == 'PM005'  ||  this.paymodecode[creditindex] == 'PM007'
  //     || this.paymodecode[creditindex] == 'PM008') && +amt ==0) || this.creditsaved){
  //       return true
  //     }
  //   else{
  //     return
  //   }
  // }

  amountReduction() {
    if (this.aptypeid == 7)
      return false
    let creditForm = this.InvoiceDetailForm.value.creditdtl
    let reductionSum = 0
    if (creditForm.length == 1) {
      return false
    }
    let firstCredgl = creditForm.filter(x => x.paymode_id?.code == 'PM002')[0]
    let firstCredglamt = 0
    let firstCredglamtReduced
    let otherCredGlAmtSum = 0
    let CredGlLines = []
    if (firstCredgl != undefined)
      firstCredglamt = +(String(firstCredgl.amountchange).replace(/,/g, '') ? String(firstCredgl.amountchange).replace(/,/g, '') : "")
    CredGlLines = creditForm.filter(x => x.paymode_id?.code == 'PM002')

    // if(this.InvoiceDetailForm.value.creditdtl[0].amount == 0 && CredGlLines.length>1){
    if (CredGlLines.length > 1) {
      let amts = CredGlLines.map(x => String(x.amountchange).replace(/,/g, ''))
      otherCredGlAmtSum = amts.reduce((a, b) => Number(a) + Number(b), 0) - +firstCredglamt
    }
    let j = 0
    let credglamtch = 0
    for (let i in creditForm) {
      let amtch = +String(creditForm[i].amountchange).replace(/,/g, '')
      if (amtch > 0 && (creditForm[i].paymode_id?.code == 'PM002')) {
        credglamtch += amtch
      }
      else if (amtch > 0 && creditForm[i].paymode_id?.code != 'PM002' && j != 0) {
        reductionSum += amtch
      }
      let num: number = amtch
      let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      amt = amt ? amt.toString() : '';
      this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('amount').setValue(amt)
      if (reductionSum == this.invHdrRes.totalamount) {
        this.fullliq = true
      }
      else {
        this.fullliq = false
      }
      j++
    }

    let reducedcreditgl
    if (credglamtch > 0) {
      let num: number = Number(credglamtch - reductionSum)
      reducedcreditgl = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      reducedcreditgl = reducedcreditgl ? reducedcreditgl.toString() : '';
    }

    let neftcreditglreduced = Number(this.invHdrRes.totalamount - credglamtch)
    let creditglreduced2 = Number(neftcreditglreduced - reductionSum)
    if (creditglreduced2 >= 0) {
      let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(creditglreduced2);
      amt = amt ? amt.toString() : '';
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
    }
    else if (neftcreditglreduced <= 0) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(0)
      if (CredGlLines.length == 1) {
        for (let i = 0; i < creditForm.length; i++) {
          if (creditForm[i].paymode_id?.code == 'PM002') {
            this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('amount').setValue(reducedcreditgl)
            break
          }
        }
      }
    }

    if (CredGlLines.length > 1) {
      firstCredglamtReduced = +this.invHdrRes.totalamount - otherCredGlAmtSum - reductionSum
      firstCredglamtReduced = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(firstCredglamtReduced);
    }
    if (this.InvoiceDetailForm.value.creditdtl[0].amount == 0 && CredGlLines.length > 1) {
      for (let i = 0; i < creditForm.length; i++) {
        if (creditForm[i].paymode_id?.code == 'PM002') {
          this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('amount').setValue(firstCredglamtReduced)
          break
        }
      }
    }
    this.creditdatasums();
  }

  amountReduction1() {
    if (this.aptypeid == 7)
      return false
    let creditForm = this.InvoiceDetailForm.value.creditdtl
    let reductionSum = 0
    if (creditForm.length == 1) {
      return false
    }
    let firstCredgl = creditForm.filter(x => x.paymode_id?.code == 'PM002')[0]
    let firstCredglamt = 0
    if (firstCredgl.length > 0)
      firstCredglamt = (firstCredgl.amount).replace(/,/g, '')

    let j = 0
    let credglamtch = 0
    for (let i in creditForm) {
      let amtch = +String(creditForm[i].amountchange).replace(/,/g, '')
      if (amtch > 0 && (creditForm[i].paymode_id?.code == 'PM002')) {
        credglamtch += amtch
        let num: number = amtch
        let amt = new Intl.NumberFormat("en-GB").format(num);
        amt = amt ? amt.toString() : '';
        this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('amount').setValue(amt)
      }
      else if (amtch > 0 && creditForm[i].paymode_id?.code != 'PM002' && j != 0) {
        reductionSum += amtch
        let num: number = amtch
        let amt = new Intl.NumberFormat("en-GB").format(num);
        amt = amt ? amt.toString() : '';
        this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('amount').setValue(amt)
      }

      if (reductionSum == this.invHdrRes.totalamount) {
        this.fullliq = true
      }
      else {
        this.fullliq = false
      }
      j++
    }

    let reducedcreditgl
    if (credglamtch > 0) {
      let num: number = Number(credglamtch - reductionSum)
      reducedcreditgl = new Intl.NumberFormat("en-GB").format(num);
      reducedcreditgl = reducedcreditgl ? reducedcreditgl.toString() : '';
    }

    let neftcreditglreduced = Number(this.invHdrRes.totalamount - credglamtch)
    let creditglreduced2 = Number(neftcreditglreduced - reductionSum)
    if (creditglreduced2 >= 0) {
      let amt = new Intl.NumberFormat("en-GB").format(creditglreduced2);
      amt = amt ? amt.toString() : '';
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
    }
    else if (neftcreditglreduced == 0) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(0)


      this.InvoiceDetailForm.get('creditdtl')['controls'][1].get('amount').setValue(reducedcreditgl)
    }

    if (this.InvoiceDetailForm.value.creditdtl[0].amount == 0 && creditForm.length > 2) {
      for (let i = 0; i < creditForm.length; i++) {
        let CredGlLines = creditForm.filter(x => x.paymode_id?.code == 'PM002')
        let amts = CredGlLines.map(x => String(x.amount).replace(/,/g, ''))
        let otherCredGlAmtSum = amts.reduce((a, b) => Number(a) + Number(b), 0) - +firstCredglamt
        let firstCredglamtReduced = +firstCredglamt - otherCredGlAmtSum - reductionSum

        let amt = firstCredglamtReduced ? firstCredglamtReduced.toString() : '';
        this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('amount').setValue(amt)
      }

    }

    // let credglamt = creditForm.filter(x => x.paymode_id?.code == 'PM002')[0]?.amount 
    //                 ? creditForm.filter(x => x.paymode_id?.code == 'PM002')[0]?.amount : 0

    // credglamt = +(String(credglamt).replace(/,/g, ''))
    // if (reductionSum == 0)
    //   return false 
    // let num: number = Number(this.invHdrRes.totalamount -creditglamt - reductionSum)
    // let amt = new Intl.NumberFormat("en-GB").format(num); 
    // amt = amt ? amt.toString() : '';

    // let neftamt = +String(creditForm[0].amount).replace(/,/g, '');

    // if(((creditForm[0].paymode_id?.code == 'PM004' || creditForm[0].paymode_id?.code == 'PM005') && creditForm.length ==2 ) ||
    //  ((creditForm[0].paymode_id?.code == 'PM004' || creditForm[0].paymode_id?.code == 'PM005') && +neftamt > reductionSum ))
    // {
    //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
    // }
    // else if(creditForm[1].paymode_id?.code == 'PM002' && creditglamt > reductionSum)
    // {
    //   this.InvoiceDetailForm.get('creditdtl')['controls'][1].get('amount').setValue(reducedcreditgl)
    // }


    this.creditdatasums();

  }

  cdtamt: any
  cdtsum: any
  creditdatasums() {
    this.cdtamt = this.InvoiceDetailForm.value['creditdtl'].map(x => String(x.amount).replace(/,/g, ''));
    this.cdtsum = this.cdtamt.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
  }
  CreditData: any
  categoryid: any
  subcategoryid: any
  cccode: any
  bscode: any
  ppxflag = false
  creditres: any

  // submitcredit() {
  //   this.creditsaved = true
  //   let credVal = []
  //   let payment = this.creditdetForm.get('payment_instruction').value
  //   // if(this.creditsaved || this.aptypeid == 13 || this.aptypeid == 3 || (this.aptypeid ==4 && this.ppxid =='E') || this.aptypeid == 14){
  //   //   var tdsappl = this.creditdetForm.get('is_tds_applicable').value
  //   // }
  //   // else{      
  //   //  var tdsappl = this.creditdetForm.get('is_tds_applicable').value.id
  //   // }
  //   // if(this.choosed_tds_value?.id === 0){
  //   //   var tdsappl = this.creditdetForm.get('is_tds_applicable').value.id
  //   // }
  //   // else{
  //   //   var tdsappl = this.creditdetForm.get('is_tds_applicable').value

  //   // }
  //     var tdsappl = this.creditdetForm.get('is_tds_applicable').value

  //   // if(payment == "" || payment == undefined || payment == null)
  //   // {
  //   //   this.toastr.error('Please enter Payment Instructions')
  //   //   return false
  //   // }
  //   if (this.aptypeid != 1 && (tdsappl === "" || tdsappl === undefined || tdsappl === null)) {
  //     this.toastr.error('Please select TDS Applicable')
  //     this.creditsaved = false
  //     return false
  //   }
  //   const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
  //   // if(this.aptypeid ==14 && creditdtlsdatas[0].paymode_id?.code != 'PM008')
  //   //   {
  //   //     this.toastr.error('KVBAC Account Details not Available.')
  //   //     this.creditsaved = false
  //   //     return false
  //   //   }
  //   if (tdsappl == 0) {
  //     let tdsline = creditdtlsdatas.filter(x => x.paymode_id?.code === 'PM007').length > 0 ? true : false

  //     if (!tdsline) {
  //       this.toastr.error('TDS line is Missing')
  //       this.creditsaved = false
  //       return false
  //     }
  //   }
  //   let ppx = creditdtlsdatas.filter(x => x.paymode_id?.code === 'PM006').length > 0 ? true : false
  //   if (this.ppxdata?.length > 0 && !ppx) {
  //     var answer = window.confirm("Do you want to Liquidate?");
  //     if (answer) {
  //       this.showppxmodal = true
  //       if (this.showppxmodal == true) {
  //         this.popupopen2()
  //       }
  //       this.addcreditSection(0, "PM006")
  //       this.creditsaved = false
  //       return false;
  //     }
  //   }
  //   else {
  //     this.showppxmodal = false
  //   }
  //   this.spinner.show()

  //   let bs = '10'
  //   let cc = '101'

  //   let j = 0
  //   for (let i in creditdtlsdatas) {
  //     creditdtlsdatas[i].amount = String(creditdtlsdatas[i].amount).replace(/,/g, '')

  //     if (creditdtlsdatas[i].paymode_id === '' || creditdtlsdatas[i].paymode_id === null || creditdtlsdatas[i].paymode_id === undefined) {
  //       this.toastr.error('Please Choose Paymode')
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     console.log("creditdtlsdatas[i]---------", creditdtlsdatas[i])
  //     if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
  //       (creditdtlsdatas[i].accno == null || creditdtlsdatas[i].accno == undefined || creditdtlsdatas[i].accno == "")) {
  //       this.toastr.error('Please Choose Acc No.')
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
  //       (Number(creditdtlsdatas[i].amount < 0))) {
  //       this.toastr.error('Amount cannot be less than Zero.')
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
  //       (creditdtlsdatas[i].bank == null || creditdtlsdatas[i].bank == undefined || creditdtlsdatas[i].bank == "")) {
  //       this.toastr.error('Bank Name is not available.')
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
  //       (creditdtlsdatas[i].ifsccode == null || creditdtlsdatas[i].ifsccode == undefined || creditdtlsdatas[i].ifsccode == "")) {
  //       this.toastr.error('IFSC Code is not available.')
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
  //       (creditdtlsdatas[i].branch == null || creditdtlsdatas[i].branch == undefined || creditdtlsdatas[i].branch == "")) {
  //       this.toastr.error('Branch Name is not available.')
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
  //       (creditdtlsdatas[i].benificiary == null || creditdtlsdatas[i].benificiary == undefined || creditdtlsdatas[i].benificiary == "")) {
  //       this.toastr.error('Beneficiary Name is not available.')
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     if (creditdtlsdatas[i].paymode_id?.code === 'PM007' && (creditdtlsdatas[i].suppliertaxtype === '' ||
  //       creditdtlsdatas[i].suppliertaxtype === null || creditdtlsdatas[i].suppliertaxtype === undefined)) {
  //       this.toastr.error('Please Choose Taxtype')
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     if (creditdtlsdatas[i].paymode_id?.code === 'PM002' && (creditdtlsdatas[i].refno == '' || creditdtlsdatas[i].refno == null || creditdtlsdatas[i].refno == undefined
  //       || creditdtlsdatas[i].glno == '0' || creditdtlsdatas[i].glno == '' || creditdtlsdatas[i].glno == null || creditdtlsdatas[i].glno == undefined)) {
  //       this.toastr.error('Please select GLNo')
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     if (creditdtlsdatas[i].paymode_id?.code == 'PM002' &&
  //       (creditdtlsdatas[i]?.amount == null || creditdtlsdatas[i]?.amount == "" || creditdtlsdatas[i]?.amount == undefined || Number(creditdtlsdatas[i]?.amount) <= 0)) {
  //       this.toastr.error("Amount cannot be less than Zero")
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     if (creditdtlsdatas[i].id === "") {
  //       delete creditdtlsdatas[i].id
  //     }

  //     if (creditdtlsdatas[i].paymode_id?.code == 'PM006' &&
  //       (creditdtlsdatas[i]?.amount == null || creditdtlsdatas[i]?.amount == "" || creditdtlsdatas[i]?.amount == undefined || Number(creditdtlsdatas[i]?.amount) <= 0)) {
  //       this.toastr.error("Amount cannot be less than Zero")
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }

  //     if (creditdtlsdatas[i].paymode_id?.code == 'PM011' &&
  //       (creditdtlsdatas[i]?.category_code == null || creditdtlsdatas[i]?.category_code == "" || creditdtlsdatas[i]?.category_code == undefined)) {
  //       this.toastr.error("Please give Category Code.")
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }

  //     if (creditdtlsdatas[i].paymode_id?.code == 'PM011' &&
  //       (creditdtlsdatas[i]?.subcategory_code == null || creditdtlsdatas[i]?.subcategory_code == "" || creditdtlsdatas[i]?.subcategory_code == undefined)) {
  //       this.toastr.error("Please give SubCategory Code.")
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }
  //     if (creditdtlsdatas[i].paymode_id?.code == 'PM011' && Number(creditdtlsdatas[i]?.amount) <= 0) {
  //       this.toastr.error("Amount cannot be less than Zero")
  //       this.creditsaved = false
  //       this.spinner.hide()
  //       return false
  //     }

  //     let prevValues: any
  //     if (this.prevCredVal.length > j) {
  //       delete this.prevCredVal[j].accno
  //       prevValues = JSON.stringify(this.prevCredVal[j])
  //     }

  //     let temp = this.InvoiceDetailForm.value.creditdtl[j]
  //     delete temp.accno
  //     let currValues = JSON.stringify(temp)

  //     if (this.aptypeid != 7) {
  //       creditdtlsdatas[i].bs_code = bs
  //       creditdtlsdatas[i].cc_code = cc
  //     }
  //     else {
  //       creditdtlsdatas[i].bs_code = creditdtlsdatas[i].bs_code.code
  //       creditdtlsdatas[i].cc_code = creditdtlsdatas[i].cc_code.code
  //     }

  //     if (typeof (creditdtlsdatas[i].category_code) == 'object')
  //       creditdtlsdatas[i].category_code = creditdtlsdatas[i].category_code.code
  //     if (typeof (creditdtlsdatas[i].subcategory_code) == 'object')
  //       creditdtlsdatas[i].subcategory_code = creditdtlsdatas[i].subcategory_code.code
  //     if (currValues != prevValues) {
  //       if (creditdtlsdatas[i].paymode_id?.code === 'PM002') {
  //         creditdtlsdatas[i].taxableamount = 0
  //         creditdtlsdatas[i].creditbank_id = this.creditids
  //         creditdtlsdatas[i].suppliertaxtype = ""
  //         creditdtlsdatas[i].suppliertaxrate = 0
  //         creditdtlsdatas[i].ddtranbranch = 0
  //         creditdtlsdatas[i].ddpaybranch = 0
  //         creditdtlsdatas[i].refno = creditdtlsdatas[i].refno
  //         creditdtlsdatas[i].glno = creditdtlsdatas[i].glno
  //       }
  //       if (creditdtlsdatas[i].paymode_id?.code === 'PM004' || creditdtlsdatas[i].paymode_id?.code === 'PM001') {
  //         creditdtlsdatas[i].taxableamount = 0
  //         creditdtlsdatas[i].credittotal = this.cdtsum
  //         creditdtlsdatas[i].creditbank_id = this.creditids
  //         creditdtlsdatas[i].suppliertaxtype = ""
  //         creditdtlsdatas[i].suppliertaxrate = 0
  //         creditdtlsdatas[i].ddtranbranch = 0
  //         creditdtlsdatas[i].ddpaybranch = 0
  //         // creditdtlsdatas[i].glno = 0
  //       }
  //       if (creditdtlsdatas[i].paymode_id?.code === 'PM005') {
  //         creditdtlsdatas[i].taxableamount = 0
  //         creditdtlsdatas[i].credittotal = this.cdtsum
  //         creditdtlsdatas[i].creditbank_id = this.creditids
  //         // creditdtlsdatas[i].glno = 0
  //         creditdtlsdatas[i].suppliertaxtype = ""
  //         creditdtlsdatas[i].suppliertaxrate = 0
  //         creditdtlsdatas[i].ddtranbranch = 0
  //         creditdtlsdatas[i].ddpaybranch = 0
  //       }
  //       if (creditdtlsdatas[i].paymode_id?.code === 'PM006') {
  //         creditdtlsdatas[i].taxableamount = 0
  //         creditdtlsdatas[i].credittotal = this.cdtsum
  //         creditdtlsdatas[i].creditbank_id = this.creditids
  //         // creditdtlsdatas[i].glno = 0
  //         creditdtlsdatas[i].suppliertaxtype = ""
  //         creditdtlsdatas[i].suppliertaxrate = 0
  //         creditdtlsdatas[i].ddtranbranch = 0
  //         creditdtlsdatas[i].ddpaybranch = 0
  //       }

  //       if (creditdtlsdatas[i].paymode_id?.code === 'PM007') {
  //         creditdtlsdatas[i].taxableamount = String(creditdtlsdatas[i].taxableamount).replace(/,/g, '')
  //         creditdtlsdatas[i].refno = ""
  //         creditdtlsdatas[i].credittotal = this.cdtsum
  //         creditdtlsdatas[i].creditbank_id = this.creditids
  //         // creditdtlsdatas[i].glno = 0
  //         creditdtlsdatas[i].subtax_id = creditdtlsdatas[i].suppliertaxtype?.subtax?.id ? creditdtlsdatas[i].suppliertaxtype?.subtax?.id : creditdtlsdatas[i].subtax_id
  //         creditdtlsdatas[i].suppliertaxtype = creditdtlsdatas[i].suppliertaxtype?.subtax?.name ? creditdtlsdatas[i].suppliertaxtype?.subtax?.name : creditdtlsdatas[i].suppliertaxtype
  //         // creditdtlsdatas[i].suppliertaxrate = this.taxrate
  //         creditdtlsdatas[i].ddtranbranch = 0
  //         creditdtlsdatas[i].ddpaybranch = 0
  //       }
  //       else
  //         delete creditdtlsdatas[i].subtax_id
  //       if (creditdtlsdatas[i].paymode_id?.code === 'PM003') {
  //         creditdtlsdatas[i].taxableamount = 0
  //         creditdtlsdatas[i].branch = ''
  //         creditdtlsdatas[i].benificiary = ''
  //         creditdtlsdatas[i].bank = ''
  //         creditdtlsdatas[i].ifsccode = 12345
  //         creditdtlsdatas[i].credittotal = this.cdtsum
  //         creditdtlsdatas[i].creditbank_id = 3
  //         // creditdtlsdatas[i].glno = 0
  //         creditdtlsdatas[i].suppliertaxtype = ""
  //         creditdtlsdatas[i].suppliertaxrate = 0
  //         creditdtlsdatas[i].ddtranbranch = 0
  //         creditdtlsdatas[i].ddpaybranch = 0
  //       }

  //       if ((creditdtlsdatas[i]?.refno == null || creditdtlsdatas[i]?.refno == "" || creditdtlsdatas[i]?.refno == undefined) &&
  //         (creditdtlsdatas[i].paymode_id?.code === 'PM008' || creditdtlsdatas[i].paymode_id?.code === 'PM001'
  //           || creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004')) {
  //         this.notification.showError("Refno Cannot Be Empty")
  //         this.creditsaved = false
  //         this.spinner.hide()
  //         return false
  //       }
  //       if (creditdtlsdatas[i].paymode_id?.code === 'PM008') {
  //         if (creditdtlsdatas[i]?.amount < 0) {
  //           this.notification.showError("Amount cannot be less than Zero.")
  //           this.creditsaved = false
  //           this.spinner.hide()
  //           return false
  //         }
  //         creditdtlsdatas[i].taxableamount = 0
  //         creditdtlsdatas[i].credittotal = this.cdtsum
  //         creditdtlsdatas[i].creditbank_id = 0
  //         // creditdtlsdatas[i].glno = 0
  //         creditdtlsdatas[i].suppliertaxtype = ""
  //         creditdtlsdatas[i].suppliertaxrate = 0
  //         creditdtlsdatas[i].ddtranbranch = 0
  //         creditdtlsdatas[i].ddpaybranch = 0
  //       }
  //       if (creditdtlsdatas[i].paymode_id?.code === 'PM010') {
  //         creditdtlsdatas[i].taxableamount = 0
  //         creditdtlsdatas[i].credittotal = this.cdtsum
  //         creditdtlsdatas[i].creditbank_id = this.creditids
  //         // creditdtlsdatas[i].glno = 0
  //         creditdtlsdatas[i].suppliertaxtype = ""
  //         creditdtlsdatas[i].suppliertaxrate = 0
  //         creditdtlsdatas[i].ddtranbranch = 0
  //         creditdtlsdatas[i].ddpaybranch = 0
  //       }

  //       if (creditdtlsdatas[i].paymode_id?.code === 'PM011') {
  //         creditdtlsdatas[i].taxableamount = 0
  //         creditdtlsdatas[i].credittotal = this.cdtsum
  //         creditdtlsdatas[i].creditbank_id = this.creditids
  //         creditdtlsdatas[i].glno = this.crnGL[j]
  //         creditdtlsdatas[i].suppliertaxtype = ""
  //         creditdtlsdatas[i].suppliertaxrate = 0
  //         creditdtlsdatas[i].ddtranbranch = 0
  //         creditdtlsdatas[i].ddpaybranch = 0
  //       }
  //       creditdtlsdatas[i].ccbspercentage = 0
  //       creditdtlsdatas[i].paymode_id = creditdtlsdatas[i].paymode_id.id
  //       creditdtlsdatas[i].debitbank_id = this.bankdetailsids.id

  //       if (this.modificationFlag == 'modification') {
  //         creditdtlsdatas[i].edit_flag = 1
  //       } else if (this.modificationFlag == 'edit') {
  //         creditdtlsdatas[i].edit_flag = 0
  //       }

  //       delete creditdtlsdatas[i].amountchange
  //       if (this.movedata == 'ECF')
  //         creditdtlsdatas[i].module_type = 1
  //       else if (this.movedata == 'AP')
  //         creditdtlsdatas[i].module_type = 2

  //       credVal.push(creditdtlsdatas[i])
  //     }
  //     j++
  //   }

  //   if (credVal?.length == 0) {
  //     this.notification.showError("There are no changes to save.");
  //     this.creditsaved = false
  //     this.spinner.hide();
  //   }
  //   else {
  //     let tot = +this.totalamount
  //     let totamt: any = tot.toFixed(2)

  //     if (this.cdtsum > totamt || this.cdtsum < totamt) {
  //       this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
  //       this.creditsaved = false
  //       this.spinner.hide();
  //       return false
  //     }

  //     this.CreditData = credVal

  //     let cred = { "entry_list": this.CreditData, "payment_instruction": payment, is_tds_applicable: tdsappl }
  //     console.log("cred", cred)
  //     this.spinner.show()
  //     this.service.debitCreditAddEdit(this.apinvHeader_id, cred)
  //       .subscribe(result => {
  //         this.spinner.hide();

  //         if (result.status == "Falied") {
  //           this.creditsaved = false
  //           this.notification.showError(result.message)
  //         }
  //         else {
  //           let creditres = result["data"]
  //           console.log("credit result--", creditres)
  //           this.changesInAP = true
  //           this.spinner.hide()
  //           if (this.movedata == 'AP') {
  //             let i = 0
  //             let ppxdet = []
  //             for (let x in creditres) {
  //               if (creditres[x].paymode_id == 6) {
  //                 let ppxdetailid
  //                 let id = creditres[x].id
  //                 let ppxdetails = this.selectedppxdata[i].ppxdetails["data"]
  //                 let ppx
  //                 if (ppxdetails.length > 0) {
  //                   ppx = ppxdetails.filter(x => x.current_crno == this.crno)[0]
  //                   ppxdetailid = ppx?.id
  //                   console.log("ppxdetailid..", ppxdetailid)
  //                 }
  //                 let ppxdata
  //                 if (ppxdetailid != undefined && this.modificationFlag == "modification") {
  //                   ppxdata = {
  //                     "apppxheader_id": this.selectedppxdata[i].id,
  //                     "apinvoiceheader_id": this.apinvHeader_id,
  //                     "apcredit_id": id,
  //                     "ppxdetails_amount": String(this.selectedppxdata[i].ppxheader_amount).replace(/,/g, ''),
  //                     "ppxdetails_adjusted": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
  //                     "ppxdetails_balance": Number(String(this.selectedppxdata[i].ppxheader_balance).replace(/,/g, '')) -
  //                       Number(String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, '')),
  //                     "ap_amount": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
  //                     "ecf_amount": String(this.selectedppxdata[i].ecf_amt).replace(/,/g, ''),
  //                     "ppxlique_invhdrcrno": this.crno,
  //                     "id": ppxdetailid
  //                   }
  //                 }
  //                 else if (ppxdetailid != undefined && this.modificationFlag == "edit") {
  //                   ppxdata = {
  //                     "apppxheader_id": this.selectedppxdata[i].id,
  //                     "apinvoiceheader_id": this.apinvHeader_id,
  //                     "apcredit_id": id,
  //                     "ppxdetails_amount": String(this.selectedppxdata[i].ppxheader_amount).replace(/,/g, ''),
  //                     "ppxdetails_adjusted": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
  //                     "ppxdetails_balance": Number(String(this.selectedppxdata[i].ppxheader_balance).replace(/,/g, '')) -
  //                       Number(String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, '')),
  //                     "ecf_amount": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
  //                     "ppxlique_invhdrcrno": this.crno,
  //                     "id": ppxdetailid
  //                   }
  //                 }
  //                 else {
  //                   ppxdata = {
  //                     "apppxheader_id": this.selectedppxdata[i].id,
  //                     "apinvoiceheader_id": this.apinvHeader_id,
  //                     "apcredit_id": id,
  //                     "ppxdetails_amount": String(this.selectedppxdata[i].ppxheader_amount).replace(/,/g, ''),
  //                     "ppxdetails_adjusted": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
  //                     "ppxdetails_balance": Number(String(this.selectedppxdata[i].ppxheader_balance).replace(/,/g, '')) -
  //                       Number(String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, '')),
  //                     "ecf_amount": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
  //                     "ppxlique_invhdrcrno": this.crno
  //                   }
  //                 }
  //                 ppxdet.push(ppxdata)
  //                 console.log("ppxdet-->", ppxdet)
  //                 i += 1;
  //               }
  //             }

  //             if (ppxdet.length > 0) {
  //               let data = { "ppxdetails": ppxdet }
  //               this.spinner.show()
  //               this.service.ppxdetails(data, this.movedata).subscribe(result => {
  //                 if (result) {
  //                   console.log("PPX Details Inserted..", result)
  //                   this.spinner.hide()
  //                 }
  //               })
  //             }
  //           }

  //           // i = 0
  //           // let crndet  = []
  //           // for (let x in creditres) {
  //           //   if(creditres[x].paymode_details.code == 'PM010')
  //           //     {
  //           //       let crndetailid 
  //           //       let id = creditres[x].id
  //           //       let crndetails = this.selectedcrndata[i].ppxdetails["data"]
  //           //       let crn
  //           //       if(crndetails.length>0)
  //           //       {
  //           //         crn = crndetails.filter(x => x.current_crno == this.crno)[0]
  //           //         crndetailid = crn?.id
  //           //         console.log("crndetailid..",crndetailid)
  //           //       }
  //           //       let crndata
  //           //       if (crndetailid != undefined)
  //           //       {
  //           //         crndata = { "apppxheader_id" : this.selectedcrndata[i].id,
  //           //                       "apinvoiceheader_id" : this.apinvHeader_id,
  //           //                       "apcredit_id" : id,
  //           //                       "ppxdetails_amount" : String(this.selectedcrndata[i].ppxheader_amount).replace(/,/g, ''),
  //           //                       "ppxdetails_adjusted" : String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, ''),
  //           //                       "ppxdetails_balance" : Number(String(this.selectedcrndata[i].ppxheader_balance).replace(/,/g, ''))-
  //           //                                              Number(String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, '')),
  //           //                       "ap_amount" :         String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, ''),
  //           //                       "ppxlique_crno" : this.crno,
  //           //                       "id" : crndetailid,
  //           //                       "type":2
  //           //                     }
  //           //       }                  
  //           //       else
  //           //       {
  //           //         crndata = { "apppxheader_id" : this.selectedcrndata[i].id,
  //           //                       "apinvoiceheader_id" : this.apinvHeader_id,
  //           //                       "apcredit_id" : id,
  //           //                       "ppxdetails_amount" : String(this.selectedcrndata[i].ppxheader_amount).replace(/,/g, ''),
  //           //                       "ppxdetails_adjusted" :String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, ''),
  //           //                       "ppxdetails_balance" : Number(String(this.selectedcrndata[i].ppxheader_balance).replace(/,/g, ''))-
  //           //                                              Number(String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, '')),
  //           //                       "ap_amount" : String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, ''),
  //           //                       "ppxlique_crno" : this.crno,
  //           //                       "type":2
  //           //                     }
  //           //       }
  //           //       crndet.push(crndata)
  //           //       console.log("crndet-->",crndet)
  //           //       i+=1;
  //           //     }
  //           //   }

  //           // if (crndet.length >0)
  //           // {
  //           //   let data = {"ppxdetails" : crndet}

  //           //   this.service.ppxdetails(data).subscribe(result=>{
  //           //     if(result)
  //           //     {
  //           //       console.log("CRN Details Inserted..", result)            
  //           //     }
  //           //   })      
  //           // }

  //           this.notification.showSuccess("Successfully Credit Details Saved!...")
  //           this.creditsaved = true
  //           let creditcontrol = this.InvoiceDetailForm.controls["creditdtl"] as FormArray;
  //           creditcontrol.clear()
  //           this.spinner.show()
  //           this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
  //             .subscribe(result => {
  //               console.log("result", result)
  //               if (result.code == undefined) {
  //                 this.creditres = result.data
  //                 let cred = result.data;
  //                 this.spinner.hide()
  //                 this.invCreditList = cred.filter(x => (x.is_display == "YES" && (x.amount > 0 && x.paymode.gl_flag == 'Adjustable') ||
  //                   (x.amount >= 0 && x.paymode.gl_flag == 'Payable')))
  //                 this.getcreditrecords(this.invCreditList)
  //               }
  //             })
  //         }
  //       })
  //   }

  // }

  ValidateCredit() {
    this.creditsaved = true
    this.payment = this.creditdetForm.get('payment_instruction')?.value
    this.tdsappl = this.creditdetForm.get('is_tds_applicable')?.value
    if (this.tdsappl === "" || this.tdsappl === undefined || this.tdsappl === null) {
      this.toastr.error('Please select TDS Applicable')
      this.creditsaved = false
      return false
    }
    if(!this.debitsaved){
      this.toastr.error('Please Save the Debit Details')
      this.creditsaved = false
      return false
    }
    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

    for (let i = 0; i < creditdtlsdatas.length; i++) {
      if (creditdtlsdatas[i].paymode_id?.code === 'PM007' && (creditdtlsdatas[i].suppliertaxtype === '' ||
        creditdtlsdatas[i].suppliertaxtype === null || creditdtlsdatas[i].suppliertaxtype === undefined)) {
        this.toastr.error('Please Choose Taxtype')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
    }

    if (this.tdsappl == 0) {
      let tdsline = creditdtlsdatas.filter((x: { paymode_id: { code: string; }; }) => x.paymode_id.code === 'PM007').length > 0 ? true : false

      if (!tdsline) {
        this.toastr.error('TDS line is Missing')
        this.creditsaved = false
        return false
      }
    }
    let ppx = creditdtlsdatas.filter((x: { paymode_id: { code: string; }; }) => x.paymode_id.code === 'PM006').length > 0 ? true : false
    if (this.ppxdata?.length > 0 && !ppx) {
      this.LiqConfirmPopup = true
      this.popupopen16()
      this.creditsaved = false
    }
    else {
      if (this.LiqConfirmPopup == true)
        this.LiqConfirmClose.nativeElement.click()
      this.LiqConfirmPopup = false
      this.submitcredit()
    }
  }
  addPPX() {
    if (this.LiqConfirmPopup == true)
      this.LiqConfirmClose.nativeElement.click()
    this.LiqConfirmPopup = false

    this.showppxmodal = true
    this.popupopen15()
    this.addcreditSection(0, "PM006")
    this.creditsaved = false
  }
  closeliqConfirm() {
    this.LiqConfirmClose.nativeElement.click()
    this.LiqConfirmPopup = false
    this.submitcredit()
  }
  submitcredit() {
    this.creditsaved = true
    let credVal = []
    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
    this.spinner.show()

    let bs = '10'
    let cc = '101'

    let j = 0
    for (let i in creditdtlsdatas) {
      creditdtlsdatas[i].amount = String(creditdtlsdatas[i].amount).replace(/,/g, '')

      if (creditdtlsdatas[i].paymode_id === '' || creditdtlsdatas[i].paymode_id === null || creditdtlsdatas[i].paymode_id === undefined) {
        this.toastr.error('Please Choose Paymode')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      console.log("creditdtlsdatas[i]---------", creditdtlsdatas[i])
      if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
        (creditdtlsdatas[i].accno == null || creditdtlsdatas[i].accno == undefined || creditdtlsdatas[i].accno == "")) {
        this.toastr.error('Please Choose Acc No.')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
        (Number(creditdtlsdatas[i].amount < 0))) {
        this.toastr.error('Amount cannot be less than Zero.')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
        (creditdtlsdatas[i].bank == null || creditdtlsdatas[i].bank == undefined || creditdtlsdatas[i].bank == "")) {
        this.toastr.error('Bank Name is not available.')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
        (creditdtlsdatas[i].ifsccode == null || creditdtlsdatas[i].ifsccode == undefined || creditdtlsdatas[i].ifsccode == "")) {
        this.toastr.error('IFSC Code is not available.')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
        (creditdtlsdatas[i].branch == null || creditdtlsdatas[i].branch == undefined || creditdtlsdatas[i].branch == "")) {
        this.toastr.error('Branch Name is not available.')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      if ((creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004') &&
        (creditdtlsdatas[i].benificiary == null || creditdtlsdatas[i].benificiary == undefined || creditdtlsdatas[i].benificiary == "")) {
        this.toastr.error('Beneficiary Name is not available.')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      if (creditdtlsdatas[i].paymode_id?.code === 'PM007' && (creditdtlsdatas[i].suppliertaxtype === '' ||
        creditdtlsdatas[i].suppliertaxtype === null || creditdtlsdatas[i].suppliertaxtype === undefined)) {
        this.toastr.error('Please Choose Taxtype')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      if (creditdtlsdatas[i].paymode_id?.code === 'PM002' && (creditdtlsdatas[i].refno == '' || creditdtlsdatas[i].refno == null || creditdtlsdatas[i].refno == undefined
        || creditdtlsdatas[i].glno == '0' || creditdtlsdatas[i].glno == '' || creditdtlsdatas[i].glno == null || creditdtlsdatas[i].glno == undefined)) {
        this.toastr.error('Please select GLNo')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      if (creditdtlsdatas[i].paymode_id?.code == 'PM002' &&
        (creditdtlsdatas[i]?.amount == null || creditdtlsdatas[i]?.amount == "" || creditdtlsdatas[i]?.amount == undefined || Number(creditdtlsdatas[i]?.amount) < 0)) {
        this.toastr.error("Amount cannot be less than Zero")
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      if (creditdtlsdatas[i].id === "") {
        delete creditdtlsdatas[i].id
      }

      if (creditdtlsdatas[i].paymode_id?.code == 'PM006' &&
        (creditdtlsdatas[i]?.amount == null || creditdtlsdatas[i]?.amount == "" || creditdtlsdatas[i]?.amount == undefined || Number(creditdtlsdatas[i]?.amount) < 0)) {
        this.toastr.error("Amount cannot be less than Zero")
        this.creditsaved = false
        this.spinner.hide()
        return false
      }

      if (creditdtlsdatas[i].paymode_id?.code == 'PM011' &&
        (creditdtlsdatas[i]?.category_code == null || creditdtlsdatas[i]?.category_code == "" || creditdtlsdatas[i]?.category_code == undefined)) {
        this.toastr.error("Please give Category Code.")
        this.creditsaved = false
        this.spinner.hide()
        return false
      }

      if (creditdtlsdatas[i].paymode_id?.code == 'PM011' &&
        (creditdtlsdatas[i]?.subcategory_code == null || creditdtlsdatas[i]?.subcategory_code == "" || creditdtlsdatas[i]?.subcategory_code == undefined)) {
        this.toastr.error("Please give SubCategory Code.")
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      if (creditdtlsdatas[i].paymode_id?.code == 'PM011' && Number(creditdtlsdatas[i]?.amount) < 0) {
        this.toastr.error("Amount cannot be less than Zero")
        this.creditsaved = false
        this.spinner.hide()
        return false
      }

      let prevValues: any
      if (this.prevCredVal.length > j) {
        delete this.prevCredVal[j].accno
        prevValues = JSON.stringify(this.prevCredVal[j])
      }

      let temp = this.InvoiceDetailForm.value.creditdtl[j]
      delete temp.accno
      let currValues = JSON.stringify(temp)

      if (this.aptypeid != 7) {
        creditdtlsdatas[i].bs_code = bs
        creditdtlsdatas[i].cc_code = cc
      }
      else {
        creditdtlsdatas[i].bs_code = creditdtlsdatas[i].bs_code.code
        creditdtlsdatas[i].cc_code = creditdtlsdatas[i].cc_code.code
      }
      console.log(creditdtlsdatas[i].category_code,creditdtlsdatas[i].subcategory_code)
      if (typeof (creditdtlsdatas[i].category_code) == 'object')
        creditdtlsdatas[i].category_code = creditdtlsdatas[i].category_code.code
      if (typeof (creditdtlsdatas[i].subcategory_code) == 'object')
        creditdtlsdatas[i].subcategory_code = creditdtlsdatas[i].subcategory_code.code
      if (currValues != prevValues) {
        if (creditdtlsdatas[i].paymode_id?.code === 'PM002') {
          creditdtlsdatas[i].taxableamount = 0
          creditdtlsdatas[i].creditbank_id = this.creditids
          creditdtlsdatas[i].suppliertaxtype = ""
          creditdtlsdatas[i].suppliertaxrate = 0
          creditdtlsdatas[i].ddtranbranch = 0
          creditdtlsdatas[i].ddpaybranch = 0
          creditdtlsdatas[i].refno = creditdtlsdatas[i].refno
          creditdtlsdatas[i].glno = creditdtlsdatas[i].glno
        }
        if (creditdtlsdatas[i].paymode_id?.code === 'PM004' || creditdtlsdatas[i].paymode_id?.code === 'PM001') {
          creditdtlsdatas[i].taxableamount = 0
          creditdtlsdatas[i].credittotal = this.cdtsum
          creditdtlsdatas[i].creditbank_id = this.creditids
          creditdtlsdatas[i].suppliertaxtype = ""
          creditdtlsdatas[i].suppliertaxrate = 0
          creditdtlsdatas[i].ddtranbranch = 0
          creditdtlsdatas[i].ddpaybranch = 0
          // creditdtlsdatas[i].glno = 0
        }
        if (creditdtlsdatas[i].paymode_id?.code === 'PM005') {
          creditdtlsdatas[i].taxableamount = String(creditdtlsdatas[i].taxableamount).replace(/,/g, '')
          creditdtlsdatas[i].credittotal = this.cdtsum
          creditdtlsdatas[i].creditbank_id = this.creditids
          // creditdtlsdatas[i].glno = 0
          creditdtlsdatas[i].suppliertaxtype = ""
          creditdtlsdatas[i].suppliertaxrate = 0
          creditdtlsdatas[i].ddtranbranch = 0
          creditdtlsdatas[i].ddpaybranch = 0
        }
        if (creditdtlsdatas[i].paymode_id?.code === 'PM006') {
          creditdtlsdatas[i].taxableamount = 0
          creditdtlsdatas[i].credittotal = this.cdtsum
          creditdtlsdatas[i].creditbank_id = this.creditids
          // creditdtlsdatas[i].glno = 0
          creditdtlsdatas[i].suppliertaxtype = ""
          creditdtlsdatas[i].suppliertaxrate = 0
          creditdtlsdatas[i].ddtranbranch = 0
          creditdtlsdatas[i].ddpaybranch = 0
        }

        if (creditdtlsdatas[i].paymode_id?.code === 'PM007') {
          creditdtlsdatas[i].taxableamount = String(creditdtlsdatas[i].taxableamount).replace(/,/g, '')
          creditdtlsdatas[i].refno = ""
          creditdtlsdatas[i].credittotal = this.cdtsum
          creditdtlsdatas[i].creditbank_id = this.creditids
          // creditdtlsdatas[i].glno = 0
          creditdtlsdatas[i].subtax_id = creditdtlsdatas[i].suppliertaxtype?.subtax?.id ? creditdtlsdatas[i].suppliertaxtype?.subtax?.id : creditdtlsdatas[i].subtax_id
          creditdtlsdatas[i].suppliertaxtype = creditdtlsdatas[i].suppliertaxtype?.subtax?.name ? creditdtlsdatas[i].suppliertaxtype?.subtax?.name : creditdtlsdatas[i].suppliertaxtype
          // creditdtlsdatas[i].suppliertaxrate = this.taxrate
          creditdtlsdatas[i].ddtranbranch = 0
          creditdtlsdatas[i].ddpaybranch = 0
        }
        else
          delete creditdtlsdatas[i].subtax_id
        if (creditdtlsdatas[i].paymode_id?.code === 'PM003') {
          creditdtlsdatas[i].taxableamount = 0
          creditdtlsdatas[i].branch = ''
          creditdtlsdatas[i].benificiary = ''
          creditdtlsdatas[i].bank = ''
          creditdtlsdatas[i].ifsccode = 12345
          creditdtlsdatas[i].credittotal = this.cdtsum
          creditdtlsdatas[i].creditbank_id = 3
          // creditdtlsdatas[i].glno = 0
          creditdtlsdatas[i].suppliertaxtype = ""
          creditdtlsdatas[i].suppliertaxrate = 0
          creditdtlsdatas[i].ddtranbranch = 0
          creditdtlsdatas[i].ddpaybranch = 0
        }

        if ((creditdtlsdatas[i]?.refno == null || creditdtlsdatas[i]?.refno == "" || creditdtlsdatas[i]?.refno == undefined) &&
          (creditdtlsdatas[i].paymode_id?.code === 'PM008' || creditdtlsdatas[i].paymode_id?.code === 'PM001'
            || creditdtlsdatas[i].paymode_id?.code === 'PM005' || creditdtlsdatas[i].paymode_id?.code === 'PM004')) {
          this.notification.showError("Refno Cannot Be Empty")
          this.creditsaved = false
          this.spinner.hide()
          return false
        }
        if (creditdtlsdatas[i].paymode_id?.code === 'PM008') {
          if (creditdtlsdatas[i]?.amount < 0) {
            this.notification.showError("Amount cannot be less than Zero.")
            this.creditsaved = false
            this.spinner.hide()
            return false
          }
          creditdtlsdatas[i].taxableamount = 0
          creditdtlsdatas[i].credittotal = this.cdtsum
          creditdtlsdatas[i].creditbank_id = 0
          // creditdtlsdatas[i].glno = 0
          creditdtlsdatas[i].suppliertaxtype = ""
          creditdtlsdatas[i].suppliertaxrate = 0
          creditdtlsdatas[i].ddtranbranch = 0
          creditdtlsdatas[i].ddpaybranch = 0
        }
        if (creditdtlsdatas[i].paymode_id?.code === 'PM010') {
          creditdtlsdatas[i].taxableamount = 0
          creditdtlsdatas[i].credittotal = this.cdtsum
          creditdtlsdatas[i].creditbank_id = this.creditids
          // creditdtlsdatas[i].glno = 0
          creditdtlsdatas[i].suppliertaxtype = ""
          creditdtlsdatas[i].suppliertaxrate = 0
          creditdtlsdatas[i].ddtranbranch = 0
          creditdtlsdatas[i].ddpaybranch = 0
        }
         if (creditdtlsdatas[i].paymode_id.code === 'PM009') {
         creditdtlsdatas[i].invoiceheader_id = this.apinvHeader_id
        creditdtlsdatas[i].taxableamount = String(creditdtlsdatas[i].taxableamount ).replace(/,/g, '')
         creditdtlsdatas[i].credittotal = this.cdtsum
         creditdtlsdatas[i].creditbank_id = this.creditids
         creditdtlsdatas[i].glno = creditdtlsdatas[i].glno
         creditdtlsdatas[i].suppliertaxtype = ""
         creditdtlsdatas[i].suppliertaxrate = 0
         creditdtlsdatas[i].ddtranbranch = 0
         creditdtlsdatas[i].ddpaybranch = 0
         creditdtlsdatas[i].expense_type = null
         creditdtlsdatas[i].refno = creditdtlsdatas[i].glno
       }

        if (creditdtlsdatas[i].paymode_id?.code === 'PM011') {
          creditdtlsdatas[i].taxableamount = 0
          creditdtlsdatas[i].credittotal = this.cdtsum
          creditdtlsdatas[i].creditbank_id = this.creditids
          creditdtlsdatas[i].glno = this.crnGL[j]
          creditdtlsdatas[i].suppliertaxtype = ""
          creditdtlsdatas[i].suppliertaxrate = 0
          creditdtlsdatas[i].ddtranbranch = 0
          creditdtlsdatas[i].ddpaybranch = 0
        }
        creditdtlsdatas[i].ccbspercentage = 0
        creditdtlsdatas[i].paymode_id = creditdtlsdatas[i].paymode_id.id
        creditdtlsdatas[i].debitbank_id = this.bankdetailsids.id

        if (this.modificationFlag == 'modification') {
          creditdtlsdatas[i].edit_flag = 1
        } else if (this.modificationFlag == 'edit') {
          creditdtlsdatas[i].edit_flag = 0
        }

        delete creditdtlsdatas[i].amountchange
        if (this.movedata == 'ECF')
          creditdtlsdatas[i].module_type = 1
        else if (this.movedata == 'AP')
          creditdtlsdatas[i].module_type = 2

      if(creditdtlsdatas[i].taxableamount == ""){
        creditdtlsdatas[i].taxableamount = 0
      }
        credVal.push(creditdtlsdatas[i])
      }
      j++
    }

    if (credVal?.length == 0) {
      this.notification.showError("There are no changes to save.");
      this.creditsaved = false
      this.spinner.hide();
    }
    else {
      let tot = +this.totalamount
      let totamt: any = tot.toFixed(2)

      if (this.cdtsum > totamt || this.cdtsum < totamt) {
        this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
        this.creditsaved = false
        this.spinner.hide();
        return false
      }

      this.CreditData = credVal

      let cred = { "entry_list": this.CreditData, "payment_instruction": this.payment, is_tds_applicable: this.tdsappl }
      console.log("cred", cred)
      this.service.debitCreditAddEdit(this.apinvHeader_id, cred)
        .subscribe(result => {
          this.spinner.hide();

          if (result.status == "Falied") {
            this.creditsaved = false
            this.notification.showError(result.message)
          }
          else {
            let creditres = result["data"]
            console.log("credit result--", creditres)
            this.changesInAP = true

            if (this.movedata == 'AP'|| this.movedata == 'ECF') {
              let i = 0
              let j = 0
              let ppxdet = []
              let crndet = []
              for (let x in creditres) {
                if (creditres[x].paymode.code == 'PM006') {
                  let ppxdetailid
                  let id = creditres[x].id
                  let ppxdetails = this.selectedppxdata[i].ppxdetails["data"]
                  let ppx
                  if (ppxdetails.length > 0) {
                    ppx = ppxdetails.filter(x => x.current_crno == this.crno)[0]
                    ppxdetailid = ppx?.id
                    console.log("ppxdetailid..", ppxdetailid)
                  }
                  let ppxdata
                  if (ppxdetailid != undefined && this.modificationFlag == "modification") {
                    ppxdata = {
                      "apppxheader_id": this.selectedppxdata[i].id,
                      "apinvoiceheader_id": this.apinvHeader_id,
                      "apcredit_id": id,
                      "ppxdetails_amount": String(this.selectedppxdata[i].ppxheader_amount).replace(/,/g, ''),
                      "ppxdetails_adjusted": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
                      "ppxdetails_balance": Number(String(this.selectedppxdata[i].ppxheader_balance).replace(/,/g, '')) -
                        Number(String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, '')),
                      "ap_amount": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
                      "ecf_amount": String(this.selectedppxdata[i].ecf_amt).replace(/,/g, ''),
                      "ppxlique_invhdrcrno": this.crno,
                      "id": ppxdetailid
                    }
                  }
                  else if (ppxdetailid != undefined && this.modificationFlag == "edit") {
                    ppxdata = {
                      "apppxheader_id": this.selectedppxdata[i].id,
                      "apinvoiceheader_id": this.apinvHeader_id,
                      "apcredit_id": id,
                      "ppxdetails_amount": String(this.selectedppxdata[i].ppxheader_amount).replace(/,/g, ''),
                      "ppxdetails_adjusted": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
                      "ppxdetails_balance": Number(String(this.selectedppxdata[i].ppxheader_balance).replace(/,/g, '')) -
                        Number(String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, '')),
                      "ecf_amount": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
                      "ppxlique_invhdrcrno": this.crno,
                      "id": ppxdetailid
                    }
                  }
                  else {
                    ppxdata = {
                      "apppxheader_id": this.selectedppxdata[i].id,
                      "apinvoiceheader_id": this.apinvHeader_id,
                      "apcredit_id": id,
                      "ppxdetails_amount": String(this.selectedppxdata[i].ppxheader_amount).replace(/,/g, ''),
                      "ppxdetails_adjusted": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
                      "ppxdetails_balance": Number(String(this.selectedppxdata[i].ppxheader_balance).replace(/,/g, '')) -
                        Number(String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, '')),
                      "ecf_amount": String(this.selectedppxdata[i].liquidate_amt).replace(/,/g, ''),
                      "ppxlique_invhdrcrno": this.crno
                    }
                  }
                  ppxdet.push(ppxdata)
                  console.log("ppxdet-->", ppxdet)
                  i += 1;
                }
                 if(creditres[x].paymode.code == 'PM009' && this.showcrnnotify == true)
                  {
                    let ppxdetailid 
                    let id = creditres[x].id
                    console.log("Selected CRN Data", this.selectedcrndata[j]);
                    let ppxdetails = this.selectedcrndata[j].ppxdetails["data"]
                     console.log("ppxdetails..",ppxdetails)
                    let ppx
                    if(ppxdetails.length>0)
                    {
                      ppx = ppxdetails.filter((x: { current_crno: any; }) => x.current_crno == this.crno)[0]
                      ppxdetailid = ppx?.id
                      console.log("ppxdetailid..",ppxdetailid)
                    }
                    let crndata
                    if (ppxdetailid != undefined && this.modificationFlag =="modification")
                    {
                      crndata = { "apppxheader_id" : this.selectedcrndata[j].id,
                                    "apinvoiceheader_id" : this.apinvHeader_id,
                                    "apcredit_id" : id,
                                    "ppxdetails_amount" : String(this.selectedcrndata[j].ppxheader_amount).replace(/,/g, ''),
                                    "ppxdetails_adjusted" : String(this.selectedcrndata[j].liquidate_amt).replace(/,/g, ''),
                                    "ppxdetails_balance" : Number(String(this.selectedcrndata[j].ppxheader_balance).replace(/,/g, ''))-
                                                           Number(String(this.selectedcrndata[j].liquidate_amt).replace(/,/g, '')),
                                    "ap_amount" :         String(this.selectedcrndata[j].liquidate_amt).replace(/,/g, ''),
                                    "ecf_amount" :         String(this.selectedcrndata[j].ecf_amt).replace(/,/g, ''),
                                    "ppxlique_invhdrcrno" : this.crno,
                                    "id" : ppxdetailid
                                  }
                    } 
                    else if (ppxdetailid != undefined && this.modificationFlag =="edit")
                    {
                      crndata = { "apppxheader_id" : this.selectedcrndata[j].id,
                                    "apinvoiceheader_id" : this.apinvHeader_id,
                                    "apcredit_id" : id,
                                    "ppxdetails_amount" : String(this.selectedcrndata[j].ppxheader_amount).replace(/,/g, ''),
                                    "ppxdetails_adjusted" : String(this.selectedcrndata[j].liquidate_amt).replace(/,/g, ''),
                                    "ppxdetails_balance" : Number(String(this.selectedcrndata[j].ppxheader_balance).replace(/,/g, ''))-
                                                           Number(String(this.selectedcrndata[j].liquidate_amt).replace(/,/g, '')),
                                    "ecf_amount" :         String(this.selectedcrndata[j].liquidate_amt).replace(/,/g, ''),
                                    "ppxlique_invhdrcrno" : this.crno,
                                    "id" : ppxdetailid
                                  }
                    }                  
                    else
                    {
                      crndata = { "apppxheader_id" : this.selectedcrndata[j].id,
                                    "apinvoiceheader_id" : this.apinvHeader_id,
                                    "apcredit_id" : id,
                                    "ppxdetails_amount" : String(this.selectedcrndata[j].ppxheader_amount).replace(/,/g, ''),
                                    "ppxdetails_adjusted" :String(this.selectedcrndata[j].liquidate_amt).replace(/,/g, ''),
                                    "ppxdetails_balance" : Number(String(this.selectedcrndata[j].ppxheader_balance).replace(/,/g, ''))-
                                                           Number(String(this.selectedcrndata[j].liquidate_amt).replace(/,/g, '')),
                                    "ecf_amount" : String(this.selectedcrndata[j].liquidate_amt).replace(/,/g, ''),
                                    "ppxlique_invhdrcrno" : this.crno
                                  }
                    }
                    crndet.push(crndata)
                    console.log("crndet-->",crndet)
                    j+=1;
                  }
              }

              if (ppxdet.length > 0) {
                let data = { "ppxdetails": ppxdet }
                this.spinner.show()
                this.service.ppxdetails(data, this.movedata).subscribe(result => {
                  this.spinner.hide()
                  if (result) {
                    console.log("PPX Details Inserted..", result)
                  }
                })
              }
               if (crndet.length > 0) {
                let data = { "ppxdetails": crndet }
                this.spinner.show()
                this.service.ppxdetails(data, this.movedata).subscribe(result => {
                  this.spinner.hide()
                  if (result) {
                    console.log("CRN Details Inserted..", result)
                  }
                })
              }
            }

            // i = 0
            // let crndet  = []
            // for (let x in creditres) {
            //   if(creditres[x].paymode_details.code == 'PM010')
            //     {
            //       let crndetailid 
            //       let id = creditres[x].id
            //       let crndetails = this.selectedcrndata[i].ppxdetails["data"]
            //       let crn
            //       if(crndetails.length>0)
            //       {
            //         crn = crndetails.filter(x => x.current_crno == this.crno)[0]
            //         crndetailid = crn?.id
            //         console.log("crndetailid..",crndetailid)
            //       }
            //       let crndata
            //       if (crndetailid != undefined)
            //       {
            //         crndata = { "apppxheader_id" : this.selectedcrndata[i].id,
            //                       "apinvoiceheader_id" : this.apinvHeader_id,
            //                       "apcredit_id" : id,
            //                       "ppxdetails_amount" : String(this.selectedcrndata[i].ppxheader_amount).replace(/,/g, ''),
            //                       "ppxdetails_adjusted" : String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, ''),
            //                       "ppxdetails_balance" : Number(String(this.selectedcrndata[i].ppxheader_balance).replace(/,/g, ''))-
            //                                              Number(String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, '')),
            //                       "ap_amount" :         String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, ''),
            //                       "ppxlique_crno" : this.crno,
            //                       "id" : crndetailid,
            //                       "type":2
            //                     }
            //       }                  
            //       else
            //       {
            //         crndata = { "apppxheader_id" : this.selectedcrndata[i].id,
            //                       "apinvoiceheader_id" : this.apinvHeader_id,
            //                       "apcredit_id" : id,
            //                       "ppxdetails_amount" : String(this.selectedcrndata[i].ppxheader_amount).replace(/,/g, ''),
            //                       "ppxdetails_adjusted" :String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, ''),
            //                       "ppxdetails_balance" : Number(String(this.selectedcrndata[i].ppxheader_balance).replace(/,/g, ''))-
            //                                              Number(String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, '')),
            //                       "ap_amount" : String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, ''),
            //                       "ppxlique_crno" : this.crno,
            //                       "type":2
            //                     }
            //       }
            //       crndet.push(crndata)
            //       console.log("crndet-->",crndet)
            //       i+=1;
            //     }
            //   }

            // if (crndet.length >0)
            // {
            //   let data = {"ppxdetails" : crndet}

            //   this.service.ppxdetails(data).subscribe(result=>{
            //     if(result)
            //     {
            //       console.log("CRN Details Inserted..", result)            
            //     }
            //   })      
            // }

            this.notification.showSuccess("Successfully Credit Details Saved!...")
            this.creditsaved = true
            let creditcontrol = this.InvoiceDetailForm.controls["creditdtl"] as FormArray;
            creditcontrol.clear()
            this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
              .subscribe(result => {
                console.log("result", result)
                if (result.code == undefined) {
                  this.creditres = result.data
                  let cred = result.data;
                  this.invCreditList = cred.filter(x => (x.is_display == "YES" && (x.amount > 0 && x.paymode.gl_flag == 'Adjustable') ||
                    (x.amount >= 0 && x.paymode.gl_flag == 'Payable')))
                  this.getcreditrecords(this.invCreditList)
                }
              })
          }
        })
    }

  }
  goback() {
    let creditdatas = this.getinvoiceheaderresults['credit']
    if (creditdatas.length != 0) {
      let creditarraydata = this.InvoiceDetailForm.value.creditdtl
      for (let i in creditdatas) {
        for (let j in creditarraydata) {
          if (i == j) {
            if (creditdatas[i].paymode_id != creditarraydata[j].paymode_id) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].refno != creditarraydata[j].refno) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].suppliertaxtype != creditarraydata[j].suppliertaxtype) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].suppliertaxrate != creditarraydata[j].suppliertaxrate) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].taxableamount != creditarraydata[j].taxableamount) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].amount != creditarraydata[j].amount) {
              this.notification.showInfo("Please save the changes you have done")
              return false
            }
            else if (creditdatas[i].glno != creditarraydata[j].glno) {
              this.notification.showInfo("Please save the changes you have done")
              return false

            }
          }


          else {


            this.showheaderdata = true
            this.showinvocedetail = false


            let invdtldatas = this.InvoiceDetailForm.get('invoicedtls') as FormArray
            invdtldatas.clear()
            let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
            crdtdtldatas.clear()



          }
        }
      }
    } else {
      this.showheaderdata = true
      this.showinvocedetail = false


      let invdtldatas = this.InvoiceDetailForm.get('invoicedtls') as FormArray
      invdtldatas.clear()
      let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
      crdtdtldatas.clear()
    }
  }

  gobacks() {
    this.showheaderdata = true
    this.showinvocedetail = false
    let invdtldatas = this.InvoiceDetailForm.get('invoicedtls') as FormArray
    invdtldatas.clear()
    let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
    crdtdtldatas.clear()
  }





  delcreditid: any
  deletecreditdetail(section, ind, confirm = true) {
    let id = section?.value?.id ? section?.value?.id : section.id
    let isTds = section?.value?.paymode_id?.code == 'PM007'
    if (isTds)
      return false
    let paymodename = section?.value?.paymode_id?.name ? section?.value?.paymode_id?.name : section?.paymode_id?.name
    if (id != undefined) {
      if(confirm){
        var answer = window.confirm("Are you sure to delete?");
        if (!answer) 
        {
          return false;
        }
      }

      // let amountchange = String(this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('amountchange').value).replace(/,/g, '')
      // let dta1 = this.InvoiceDetailForm.value.creditdtl
      // let neftamt = dta1.filter(x => x.paymode_id?.code =='PM005' || x.paymode_id?.code =='PM001' || x.paymode_id?.code =='PM004')[0]?.amount

      // let reductionsum =0

      // let deductionlines = dta1.filter(x=> x.paymode_id?.code != 'PM005' && x.paymode_id?.code != 'PM004'
      //                                    && x.paymode_id?.code != 'PM001' && x.paymode_id?.code != 'PM002')
      // reductionsum = deductionlines.reduce((a,b)=>+a.amount + +b.amount,0)

      // let credglamtch = dta1.filter(x => x.paymode_id?.code =='PM002')[0]?.amount
      // if(credglamtch != undefined && credglamtch != null && credglamtch != '')
      // {
      //   credglamtch = +String(credglamtch).replace(/,/g, '')
      //   if (credglamtch+reductionsum == Number(this.invHdrRes.totalamount ))
      //   {
      //     let creditglamt = String(this.InvoiceDetailForm.get('creditdtl')['controls'][1].get('amount').value).replace(/,/g, '')
      //     let num = +creditglamt + +amountchange
      //     let amt = new Intl.NumberFormat("en-GB").format(num); 
      //     amt = amt ? amt.toString() : '';

      //     this.InvoiceDetailForm.get('creditdtl')['controls'][1].get('amount').setValue(amt)
      //   }
      // }
      // else
      // {
      //   let num: number = Number(neftamt) + Number(amountchange)
      //   let amt = new Intl.NumberFormat("en-GB").format(num); 
      //   amt = amt ? amt.toString() : '';

      //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
      // }
      this.spinner.show();
      this.service.credDebitDel(id)
        .subscribe(result => {
          this.spinner.hide();

          if (result.status == "success") {
            // delete section.value.id
            this.removecreditSection(ind, paymodename)
          }
          else if (result.status == "Falied") {
            this.notification.showError(result.message)
          }
          else {
            this.notification.showError(result.description)
          }
        })
    }
    else {
      // let amountchange = String(this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('amountchange').value).replace(/,/g, '')
      // let dta1 = this.InvoiceDetailForm.value.creditdtl
      // let neftamt = dta1.filter(x => x.paymode_id?.code =='PM005' || x.paymode_id?.code =='PM001' || x.paymode_id?.code =='PM004')[0]?.amount

      // let reductionsum =0

      // let deductionlines = dta1.filter(x=> x.paymode_id?.code != 'PM005' && x.paymode_id?.code != 'PM004'
      //                                    && x.paymode_id?.code != 'PM001' && x.paymode_id?.code != 'PM002')
      // reductionsum = deductionlines.reduce((a,b)=>+a.amount + +b.amount,0)

      // let credglamtch = dta1.filter(x => x.paymode_id?.code =='PM002')[0]?.amount
      // if(credglamtch != undefined && credglamtch != null && credglamtch != '')
      // {
      //   credglamtch = +String(credglamtch).replace(/,/g, '')
      //   if (credglamtch+reductionsum == Number(this.invHdrRes.totalamount ))
      //   {
      //     let creditglamt = String(this.InvoiceDetailForm.get('creditdtl')['controls'][1].get('amount').value).replace(/,/g, '')
      //     let num = +creditglamt + +amountchange
      //     let amt = new Intl.NumberFormat("en-GB").format(num); 
      //     amt = amt ? amt.toString() : '';

      //     this.InvoiceDetailForm.get('creditdtl')['controls'][1].get('amount').setValue(amt)
      //   }
      // }
      // else
      // {
      //   let num: number = Number(neftamt) + Number(amountchange)
      //   let amt = new Intl.NumberFormat("en-GB").format(num); 
      //   amt = amt ? amt.toString() : '';

      //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(amt)
      // }


      this.removecreditSection(ind, paymodename)
    }

  }

  // -------debit--------


  getDebitSections(form) {

    return form.controls.debitdtl.controls;
  }
  debitindex: any
  adddebitSection() {

    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.push(this.debitdetail());
    this.readonlydebit[control.length - 1] = false
  }

  adddsplit(section: any, i: number) {

    let cat = section.value.category_code?.code ? section.value.category_code?.code : ""
    let bs = section.value.bs_code?.code ? section.value.bs_code?.name : ""

    if (cat.indexOf('GST') != -1 && bs.indexOf('GST') != -1) {
      return false
    }
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    // control.push(this.debitdetail());
    const dbtdetaildata = this.DebitDetailForm.value.debitdtl;

    if ((typeof (dbtdetaildata[i].category_code) == 'object' && (dbtdetaildata[i].category_code?.code == undefined || dbtdetaildata[i].category_code?.code == ''))
      || (dbtdetaildata[i].category_code == undefined || dbtdetaildata[i].category_code == '')) {
      this.toastr.error('Please Choose Category before Split');
      return false;
    }
    if ((typeof (dbtdetaildata[i].subcategory_code) == 'object' && (dbtdetaildata[i].subcategory_code?.code == undefined || dbtdetaildata[i].subcategory_code?.code == ''))
      || (dbtdetaildata[i].subcategory_code == undefined || dbtdetaildata[i].subcategory_code == '')) {
      this.toastr.error('Please Choose Sub Category before Split');
      return false;
    }
    control.insert(i + 1, this.debitdetail())
    // this.splitdebit[i+1] = true
    // if(this.DebitDetailForm.value.debitdtl.length > i+1)
    // {
    // for(let j=i+2; j< this.DebitDetailForm.value.debitdtl.length; j++)
    // {
    //   this.splitdebit[j] = this.splitdebit[j+1]
    // }
    // }
    this.DebitDetailForm.get('debitdtl')['controls'][i + 1].get('split').setValue(false)
    this.DebitDetailForm.get('debitdtl')['controls'][i + 1].get('category_code').setValue(dbtdetaildata[i].category_code)
    this.DebitDetailForm.get('debitdtl')['controls'][i + 1].get('subcategory_code').setValue(dbtdetaildata[i].subcategory_code)
    this.DebitDetailForm.get('debitdtl')['controls'][i + 1].get('glno').setValue(dbtdetaildata[i].glno)
    this.DebitDetailForm.get('debitdtl')['controls'][i + 1].get('gldesc').setValue(dbtdetaildata[i].gldesc)

    for (let i = 0; i < this.DebitDetailForm.value.debitdtl.length; i++) {
      let code = this.DebitDetailForm.value.debitdtl[i].category_code?.code
      if (code == undefined)
        code = ''
      code = code.toLowerCase().trim()
      if (code.indexOf('gst') >= 0 && code.indexOf('tax') >= 0) {
        this.readonlydebit[i] = true
      }
      else {
        this.readonlydebit[i] = false
      }
    }


  }

  removedebitSection(i, message_show) {
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.removeAt(i);
    this.debitdatasums()
    if (message_show)
      this.notification.showSuccess("Debit line deleted Successfully")

    if (this.aptypeid == 7 && control.length == 1) {
      this.DebitDetailForm.get('debitdtl')['controls'][0].get('amt').setValue(this.invtotamount)
      this.DebitDetailForm.get('debitdtl')['controls'][0].get('amount').setValue(this.invtotamount)
    }
  }

  debitdetail() {
    let group = new FormGroup({
      apinvoicedetail_id: new FormControl(),
      category_code: new FormControl(''),
      subcategory_code: new FormControl(''),
      glno: new FormControl(''),
      gldesc: new FormControl(''),
      // bsproduct_code:new FormControl(''),
      // bsproduct_code_id:new FormControl(''),
      amt: new FormControl(0.0),
      amount: new FormControl(0.0),
      deductionamount: new FormControl(0),
      // debittotal: new FormControl(),
      // cc: new FormControl(),
      // bs: new FormControl(),
      // ccbspercentage: new FormControl(100),
      remarks: new FormControl(''),
      bs_code: new FormControl(''),
      cc_code: new FormControl(''),
      ccbspercentage: new FormControl(0),
      taxableamount: new FormControl(0),
      entry_type: new FormControl('1'),
      paymode_id: new FormControl('8'),
      split: new FormControl(false)
    })

    group.get('amount').valueChanges.pipe(
      debounceTime(100)
    ).subscribe(value => {

      this.debitdatasums();
      if (!this.DebitDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    }
    )

    group.get('category_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => {
          if (!value || typeof value === 'object') {
            this.isLoading = false;
            return of([]);
          }
          let Value
          if(value.name == undefined){
            Value = value
          }else{
            Value = value.name
          }
          return this.service.getcategoryscroll(value, 1,this.aptypeid)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        })
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if (this.aptypeid != 7)
          datas = datas.filter(x => x.code != "SUSPENSE")
        else
          datas = datas.filter(x => x.code == "SUSPENSE")
        if (this.isCaptalized == false) {
          datas = datas.filter(x => x.code != "FACL")
        }
        this.categoryNameData = datas;
        let datapagination = results["pagination"];
        if (datapagination != undefined) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })

    group.get('subcategory_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => {
          if (!value || typeof value === 'object') {
            this.isLoading = false;
            return of([]);
          }
          let Value
          if(value.name == undefined){
            Value = value
          }else{
            Value = value.name
          }
          return this.service.getsubcategoryscroll(this.catid, Value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        })
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryNameData = datas;
        let datapagination = results["pagination"];
        if (datapagination != undefined) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      })
    group.get('bs_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getbsscroll(value, 1)
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
        let datapagination = results["pagination"];
        if (datapagination != undefined) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      })
    // group.get('bsproduct_code').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //   }),
    //   switchMap(value => this.service.getbusinessproductscroll(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.businesslist = datas;
    //   this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    // })


    return group



  }

  calctotaldebitdata(amount: FormControl) {
    this.debitdatasums()
  }






  calamount: any
  subamount: any
  calcTotaldebit(index) {
    let dataOnDetails = this.DebitDetailForm.value.debitdtl
    let percent: any = +dataOnDetails[index].ccbspercentage
    this.calamount = this.invdtltaxableamount * percent / 100


    this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(this.calamount)
    // console.log("test", this.calamount)
    this.debitdatasums()
  }

  calcdebitamount(group: FormGroup) {
    const amount = +group.controls['amount'].value;
    group.controls['amount'].setValue((amount), { emitEvent: false });
    this.debitdatasums()
  }

  dbtamt: any
  dbtsum: any = 0
  debitsum: any

  debitdatasums() {
    if (this.aptypeid == 7) {
      const dbtdetaildata = this.DebitDetailForm.value.debitdtl;

      if (dbtdetaildata.length == 2) {
        let amt2 = String(this.DebitDetailForm.get('debitdtl')['controls'][1].get('amt').value).replace(/,/g, '')
        let amt1: number = +this.invtotamount - +amt2

        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(amt1);
        temp = temp ? temp.toString() : '';
        this.DebitDetailForm.get('debitdtl')['controls'][0].get('amt').setValue(temp)
        let temp2 = this.DebitDetailForm.get('debitdtl')['controls'][0].get('amount').value
        if (temp != temp2)
          this.DebitDetailForm.get('debitdtl')['controls'][0].get('amount').setValue(temp)

        this.dbtsum = +amt1 + +amt2
      }
      else if (dbtdetaildata.length == 1) {
        this.dbtamt = this.DebitDetailForm.value['debitdtl'].map(x => String(x.amount).replace(/,/g, ''));
        this.dbtsum = this.dbtamt.reduce((a, b) => (Number(a) + Number(b)), 0);
      }
    }
    else {
      this.dbtamt = this.DebitDetailForm.value['debitdtl'].map(x => String(x.amount).replace(/,/g, ''));
      this.dbtsum = this.dbtamt.reduce((a, b) => (Number(a) + Number(b)), 0);
    }

    this.debitsum = this.dbtsum.toFixed(2);
    console.log("this.debitsum-->", this.debitsum)
  }
  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.code : undefined;
  }

  // get cattype() {
  //   return this.DebitDetailForm.get('category_code');
  // }
  catadv: any
  // getcatadv(catkeyvalue) {
  //   if (this.isCaptalized == true)
  //   {
  //     catkeyvalue = "Asset Clearing"
  //   }
  //   this.service.getcatadv(catkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       datas = datas.filter(x=> x.code != "SUSPENSE")
  //       this.categoryNameData = datas;
  //       this.catid = 237;
  //       // if (this.aptypeid == 4) {
  //       //   this.categoryNameData = this.categoryNameData.filter(category => category.code == "ADVANCE");
  //       //   console.log("Filtered categories:", this.categoryNameData);
  //       // }
  //     })
  // }
  getcat(catkeyvalue) {
    if (this.isCaptalized == true) {
      catkeyvalue = "facl"
    }
    this.service.getcat(catkeyvalue, this.aptypeid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if (this.aptypeid != 7)
          datas = datas.filter(x => x.code != "SUSPENSE")
        else
          datas = datas.filter(x => x.code == "SUSPENSE")
        if (this.isCaptalized == false) {
          datas = datas.filter(x => x.code != "FACL")
        }
        this.categoryNameData = datas;
        this.catid = datas.id;
        this.getsubcat(this.catid, "");
      })
  }
  // getsubcat(catkeyvalue) {
  //   if (this.isCaptalized == true) {
  //     catkeyvalue = "facl"
  //   }
  //   this.service.getcat(catkeyvalue, this.aptypeid)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       if (this.aptypeid != 7)
  //         datas = datas.filter(x => x.code != "SUSPENSE")
  //       else
  //         datas = datas.filter(x => x.code == "SUSPENSE")
  //       if (this.isCaptalized == false) {
  //         datas = datas.filter(x => x.code != "FACL")
  //       }
  //       this.categoryNameData = datas;
  //       this.catid = datas.id;
  //     })
  // }
    getcrncat(catkeyvalue) {
    if (this.isCaptalized == true) {
      catkeyvalue = "facl"
    }
    this.service.getcat(catkeyvalue, this.aptypeid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryNameData = datas;
        this.catid = datas.id;
      })
  }

  cid(data, subcat = "", i) {
    // this.catid = data['id'];
    this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue('')
    this.DebitDetailForm.get('debitdtl')['controls'][i].get('glno').setValue('')

    // this.getsubcat(i, subcat);
  }

  crncid(data, subcat = "") {
    this.catid = data['id'];
    this.creditglForm.get('subcategory_code').setValue('')
    this.creditglForm.get('glnum').setValue('')

    this.getsubcat(this.catid, subcat);
  }
    crnselcid(data, subcat = "",i) {
    this.catid = data['id'];
    this.crnglForm.get('crnglArray')['controls'][i].get('subcategory_code').setValue('')
    this.crnglForm.get('crnglArray')['controls'][i].get('creditglno').setValue('')
  }

  categoryScroll(i, cattype) {
    setTimeout(() => {
      if (
        cattype &&
        this.autocompleteTrigger &&
        cattype.panel
      ) {
        fromEvent(cattype.panel.nativeElement, 'scroll')
          .pipe(
            map(x => cattype.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = cattype.panel.nativeElement.scrollTop;
            const scrollHeight = cattype.panel.nativeElement.scrollHeight;
            const elementHeight = cattype.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                let cat = "facl"
                if (!this.isCaptalized) {
                  cat = this.categoryInput.nativeElement.value
                }

                if (typeof (this.DebitDetailForm?.value?.debitdtl[i]?.category_code) == 'object')
                  cat = this.DebitDetailForm?.value?.debitdtl[i]?.category_code?.code ? this.DebitDetailForm?.value?.debitdtl[i]?.category_code?.code : ''
                else
                  cat = this.DebitDetailForm?.value?.debitdtl[i]?.category_code
                this.service.getcategoryscroll(cat, this.categoryNameData.length > 0 ? this.currentpage + 1 : 1, this.aptypeid)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    if (this.aptypeid != 7)
                      datas = datas.filter(x => x.code != "SUSPENSE")
                    else
                      datas = datas.filter(x => x.code == "SUSPENSE")
                    if (this.isCaptalized == false) {
                      datas = datas.filter(x => x.code != "FACL")
                    }

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
  // categoryScroll1(i){
  //   setTimeout(() => {
  //     if (
  //       this.matcatAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matcatAutocomplete.panel
  //     ) {
  //       fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               let cat = "facl"
  //               if(!this.isCaptalized)
  //               {
  //                 cat =this.categoryInput.nativeElement.value
  //               }
  //               // if(typeof(this.DebitDetailForm?.value?.debitdtl[i]?.category_code) == 'object')
  //               //   cat =this.DebitDetailForm?.value?.debitdtl[i]?.category_code?.code
  //               // else
  //               //   cat = this.DebitDetailForm?.value?.debitdtl[i]?.category_code
  //               this.service.getcategoryscroll(cat, this.categoryNameData.length > 0 ? this.currentpage + 1 : 1,this.aptypeid)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];  
  //                   datas = datas.filter(x=> x.code != "SUSPENSE")
  //                   if(this.isCaptalized == false)
  //                     {
  //                       datas = datas.filter(x=> x.code != "FACL")
  //                     }

  //                   let datapagination = results["pagination"];
  //                   if (this.categoryData.length >= 0) {
  //                     this.categoryData = this.categoryData.concat(datas);
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  getBranches() {
    let keyvalue: String = "";
    this.service.branchget(keyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.brList = datas;
      })
  }

  branchScroll() {
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
          .subscribe(x => {
            const scrollTop = this.branchmatAuto.panel.nativeElement.scrollTop;
            const scrollHeight = this.branchmatAuto.panel.nativeElement.scrollHeight;
            const elementHeight = this.branchmatAuto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getbranchscroll(this.brInput.nativeElement.value, this.currentpage + 1)
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



  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.code : undefined;
  }

  get subcategorytype() {
    return this.DebitDetailForm.get('subcategory_code');
  }

  subcategoryScroll(i = 0, subcategorytype) {
    setTimeout(() => {
      if (
        subcategorytype &&
        this.autocompleteTrigger &&
        subcategorytype.panel
      ) {
        fromEvent(subcategorytype.panel.nativeElement, 'scroll')
          .pipe(
            map(x => subcategorytype.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = subcategorytype.panel.nativeElement.scrollTop;
            const scrollHeight = subcategorytype.panel.nativeElement.scrollHeight;
            const elementHeight = subcategorytype.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getsubcategoryscroll(this.catid, this.DebitDetailForm?.value?.debitdtl[i]?.subcategory_code, this.currentpage + 1)
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
    // this.spinner.show()
    this.isLoading =true
    this.service.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryNameData = datas;
        // this.spinner.hide()
        this.isLoading =false


      })
  }

  getsubcatDebit(index, subcatkeyvalue) {
    let catid = this.DebitDetailForm.value.debitdtl[index].category_code.id
    if((index == this.debaddindex && this.catid == catid) && catid == undefined){
      return false
    }
    this.debaddindex = index
    this.isLoading =true
    this.catid= catid
    this.service.getsubcat(catid, subcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.isLoading =false
        this.subcategoryNameData = datas;
      })
  }

  public displayFnbp(producttype?: productcodelists): string | undefined {
    return producttype ? producttype.bsproduct_name : undefined;
  }

  get producttype() {
    return this.DebitDetailForm.get('bsproduct_code');
  }
  getbpdropdown() {
    this.getbusinessproduct('')
  }

  getbusinessproduct(businesskeyvalue) {
    this.service.getbusinessproductdd(businesskeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businesslist = datas

      })
  }

  // bpScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matproductAutocomplete &&
  //       this.matproductAutocomplete &&
  //       this.matproductAutocomplete.panel
  //     ) {
  //       fromEvent(this.matproductAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matproductAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matproductAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matproductAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matproductAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.service.getbusinessproductscroll(this.bsproductInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   if (this.businesslist.length >= 0) {
  //                     this.businesslist = this.businesslist.concat(datas);
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  public displaybsFn(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }

  getGLNumber(data, index) {
    this.GLNumb = data.glno
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('glno').setValue(data.glno)
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('gldesc').setValue(data.gl_name)

    // if(this.expenseTaxID != undefined)
    //   this.DebitDetailForm.get('debitdtl')['controls'][this.expenseTaxID].get('glno').setValue(data.glno)

  }
  debitamt(index) {
    let amt = this.DebitDetailForm.get('debitdtl')['controls'][index].get('amt').value
    amt = amt.replace(/,/g, "");

    if (+amt >= 0) {
      let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
      temp = temp ? temp.toString() : '';
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('amt').setValue(temp)
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(temp)
    }

    this.debitdatasums()
  }

  get bstype() {
    return this.DebitDetailForm.get('bs');
  }
  getbs(bskeyvalue) {
    this.service.getbs(bskeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsNameData = datas;
        let datapagination = results["pagination"];
        if (datapagination != undefined) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        this.catid = datas.id;

      })
  }

  bsScroll(i = 0, bstype) {
    setTimeout(() => {
      if (
        bstype &&
        this.autocompleteTrigger &&
        bstype.panel
      ) {
        fromEvent(bstype.panel.nativeElement, 'scroll')
          .pipe(
            map(x => bstype.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = bstype.panel.nativeElement.scrollTop;
            const scrollHeight = bstype.panel.nativeElement.scrollHeight;
            const elementHeight = bstype.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                let bs
                if (typeof (this.DebitDetailForm?.value?.debitdtl[i]?.bs_code) == 'object')
                  bs = this.DebitDetailForm?.value?.debitdtl[i]?.bs_code?.code ? this.DebitDetailForm?.value?.debitdtl[i]?.bs_code?.code : ''
                else
                  bs = this.DebitDetailForm?.value?.debitdtl[i]?.bs_code
                this.service.getbsscroll(bs, this.bsNameData.length > 0 ? this.currentpage + 1 : 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (datapagination != undefined) {
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

  bsid(data, code, i) {
    // this.bssid = data['id'];
    this.bsidd = code;
    this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc_code').reset("")
     // this.getccDebit( "", i);
  }
  crnbsid(data, code) {
    this.bssid = data['id'];
    this.bsidd = code;
    this.creditglForm.get('cc_code').reset("")
    this.getcc(this.bssid, "");
  }
  public displayccFn(cctype?: cclistss): string | undefined {
    return cctype ? cctype.name : undefined;
  }

  get cctype() {
    return this.DebitDetailForm.get('cc');
  }
  ccid: any;
  getcc(bssid, cckeyvalue) {
    this.spinner.show()
    this.service.getcc(bssid, cckeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccNameData = datas;
        this.ccid = datas.id;
        this.spinner.hide()

      })

  }

  getccDebit(ccvalue,index) {
    let bssid = this.DebitDetailForm.value.debitdtl[index].bs_code.id
    this.bssid = bssid
    index = this.debaddindex
    if(bssid == undefined ||bssid == null){
      return false
    }
    this.debaddindex = index
    this.isLoading =true
    this.bssid= bssid

    this.service.getcc(this.bssid, ccvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.isLoading =false
        this.ccNameData = datas;
        this.ccid = datas.id;  
      })
  }

  
  ccScroll(i = 0, cctype) {
    setTimeout(() => {
      if (
        cctype &&
        this.autocompleteTrigger &&
        cctype.panel
      ) {
        fromEvent(cctype.panel.nativeElement, 'scroll')
          .pipe(
            map(x => cctype.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = cctype.panel.nativeElement.scrollTop;
            const scrollHeight = cctype.panel.nativeElement.scrollHeight;
            const elementHeight = cctype.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getccscroll(this.bssid, this.DebitDetailForm?.value?.debitdtl[i]?.cc_code, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (datapagination != undefined) {
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




  back() {
    //this.router.navigate(['ECF/inventory'])

  }

  moveback() {
    // this.router.navigate(['ECF/invdetailcreate'])
  }



  ccidd: any
  cccodeid: any
  getccdata(code, id) {
    this.ccidd = code
    this.cccodeid = id

  }
  categoryClear(ind) {
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('category_code').setValue('')
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('subcategory_code').setValue('')
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('glno').setValue('')
    this.currentpage = 1;
  }
  subcatClear(ind) {
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('subcategory_code').setValue('')
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('glno').setValue('')
    this.getsubcatDebit(ind,'')
  }
  bsClear(ind) {
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('bs_code').setValue('')
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('cc_code').setValue('')
  }
  CCclear(ind) {
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('cc_code').setValue('')
  }

  debitres: any

  remarkss: any
  debitSectionSaved = [false, false, false, false, false, false, false, false, false]
  debitform() {


    this.debitsaved = true

    const Ddetails = this.DebitDetailForm.value.debitdtl;


    const dbtdetaildata = this.DebitDetailForm.value.debitdtl;
    if (typeof (dbtdetaildata[0].category_code) == 'object')
      this.categoryid = dbtdetaildata[0].category_code.code
    if (typeof (dbtdetaildata[0].subcategory_code) == 'object')
      this.subcategoryid = dbtdetaildata[0].subcategory_code.code
    if (typeof (dbtdetaildata[0].bs_code) == 'object')
      this.bscode = dbtdetaildata[0].bs_code?.code
    if (typeof (dbtdetaildata[0].cc_code) == 'object')
      this.cccode = dbtdetaildata[0].cc_code?.code

    let debVal = []
    let j = 0
    for (let i in dbtdetaildata) {

      if (dbtdetaildata[i].category_code?.code == 'GST Tax') {
        j++
        continue;
      }

      let catcode = dbtdetaildata[i].category_code
      if (typeof (dbtdetaildata[i].category_code) == 'object')
        catcode = catcode.code
      if ((catcode == '') || (catcode == null) || (catcode == undefined)) {
        this.toastr.error('Please Choose Category');
        this.debitsaved = false
        return false;
      }

      let subcatcode = dbtdetaildata[i].subcategory_code
      if (typeof (dbtdetaildata[i].subcategory_code) == 'object')
        subcatcode = subcatcode.code
      if ((subcatcode == '') || (subcatcode == null) || (subcatcode == undefined)) {
        this.toastr.error('Please Choose Sub Category');
        this.debitsaved = false
        return false;
      }

      let bscode = dbtdetaildata[i].bs_code
      if (typeof (dbtdetaildata[i].bs_code) == 'object')
        bscode = bscode?.code
      if ((bscode == '') || (bscode == null) || (bscode == undefined)) {
        this.toastr.error('Please Choose Business Segment');
        this.debitsaved = false
        return false;
      }

      let cccode = dbtdetaildata[i].cc_code
      if (typeof (dbtdetaildata[i].cc_code) == 'object')
        cccode = cccode?.code
      if ((cccode == '') || (cccode == null) || (cccode == undefined)) {
        this.toastr.error('Please Choose Cost Centre');
        this.debitsaved = false
        return false;
      }
      dbtdetaildata[i].amount = String(dbtdetaildata[i].amount).replace(/,/g, '') 
       if (+dbtdetaildata[i].amount <= 0) {
         this.toastr.error('Amount should be greater than Zero');
         this.debitsaved=false
         return false;
       }
      // dbtdetaildata[i].bsproduct_code_id = dbtdetaildata[i].bsproduct_code.id 

      // if (dbtdetaildata[i].bsproduct_code_id == '') {
      //   console.log("dbtdetaildata[i].bsproduct_code---",dbtdetaildata[i].bsproduct_code)
      //   this.toastr.error('Please Choose Bussiness Product Code');
      //   return false;
      // }
      if (dbtdetaildata[i].id === "") {
        delete dbtdetaildata[i].id
      }
      // delete dbtdetaildata[i].bsproduct_code
      // if(this.ecftypeid == 4){
      //   dbtdetaildata[i].apinvoicedetail = ""
      //   dbtdetaildata[i].debittotal = this.totalamount
      // }else{
      // dbtdetaildata[i].debittotal = this.invtotamount
      //}
      // dbtdetaildata[i].amount = String(dbtdetaildata[i].amount).replace(/,/g, '')
      let prevValues: any
      if (this.prevDebVal.length > j)
        prevValues = JSON.stringify(this.prevDebVal[j])

      let currValues = JSON.stringify(this.DebitDetailForm.value.debitdtl[j])

      if ((currValues != prevValues) || this.gstchangeflag[this.getinvindex] == true) {
        if (typeof (dbtdetaildata[i].category_code) == 'object')
          dbtdetaildata[i].category_code = dbtdetaildata[i].category_code.code
        if (typeof (dbtdetaildata[i].subcategory_code) == 'object')
          dbtdetaildata[i].subcategory_code = dbtdetaildata[i].subcategory_code.code
        if (typeof (dbtdetaildata[i].bs_code) == 'object')
          dbtdetaildata[i].bs_code = dbtdetaildata[i].bs_code.code
        if (typeof (dbtdetaildata[i].cc_code) == 'object')
          dbtdetaildata[i].cc_code = dbtdetaildata[i].cc_code.code
        dbtdetaildata[i].deductionamount = String(dbtdetaildata[i].deductionamount).replace(/,/g, '')

        if (this.modificationFlag == 'modification') {
          dbtdetaildata[i].edit_flag = 1
        } else if (this.modificationFlag == 'edit') {

          dbtdetaildata[i].edit_flag = 0
        }

        if (dbtdetaildata[i].id === "") {
          delete dbtdetaildata[i].id
        }
        if (this.invdtladdonid === "" || this.invdtladdonid === undefined || this.invdtladdonid === null) {
          delete dbtdetaildata[i].apinvoicedetail_id
        }
        else {
          dbtdetaildata[i].apinvoicedetail_id = this.invdtladdonid
        }
        if (this.movedata == 'ECF')
          dbtdetaildata[i].module_type = 1
        else if (this.movedata == 'AP')
          dbtdetaildata[i].module_type = 2
        debVal.push(dbtdetaildata[i])
      }
      j++
    }

    if (debVal.length > 0) {
      if (Number(this.debitsum) != Number(this.invtotamount)) {
        console.log(this.debitsum, "   +   ", this.invtotamount)
        this.toastr.error('Check Invoice Detail Amount', 'Please Enter Valid Amount');
        this.debitsaved = false
        return false
      }

      let debdet = { "entry_list": debVal }
      this.spinner.show();

      this.service.debitCreditAddEdit(this.apinvHeader_id, debdet)
        .subscribe(result => {
          this.spinner.hide();

          if (result.status != undefined) {
            this.notification.showError(result.message)

          }
          else {
            this.notification.showSuccess("Successfully Debit Details Saved!...")
            this.changesInAP = true
            this.debitres = result["data"]
            console.log("saved debit ", this.debitres)
            this.debitsaved = true
            this.debitSectionSaved[this.invdtladdonIndex] = true
            //check for ccbs
            this.spinner.show();

            this.service.getDebitCredit(this.apinvHeader_id, this.invdtladdonid, 1)
              .subscribe(result => {

                if (result) {
                  this.debitres = result.data
                  this.spinner.hide();
                  console.log(" Debit data ...", this.debitres)

                  let invdbtdatas = this.DebitDetailForm.get('debitdtl') as FormArray
                  invdbtdatas.clear()
                  this.debitdata = this.debitres.filter(x => x.is_display == "YES" && x.amount >= 0)

                  this.getdebitrecords(this.debitdata)
                  if (this.aptypeid != 4)
                    this.debitClose()
                }
              })
          }
        })
    }
    else {
      this.notification.showError("There are no changes to save.");
      this.spinner.hide();
    }

  }

  // ccbsAutosave()
  // {      
  //   this.debdata = this.invdtls.filter(x => x.id == this.invdtladdonid)[0]?.apdebit?.data
  //   this.ccbsdet = this.debdata[0]?.ccbs

  //   if(this.debdata != undefined && this.debdata != null && this.ccbsdet != undefined && this.ccbsdet != null)
  //   {  
  //   for(let deb of this.debitdata)
  //   {
  //     let ccbs

  //     if(deb.ccbs.length==0)
  //     {
  //       ccbs = this.ccbsdet
  //       let ccbsdetails  = []

  //       for(let item of ccbs)
  //       {
  //         delete item.id
  //         item.amount = deb.amount * item.ccbspercentage / 100
  //         ccbsdetails.push(item)
  //       }        

  //       let ccbsdet = {"ccbs" : ccbsdetails}

  //       this.service.ccbsAddEdit(deb.id, ccbsdet)
  //           .subscribe(result => {
  //             if (result.code != undefined) {
  //               this.notification.showError(result.description)      
  //             }
  //             else {
  //               this.ccbsres = result
  //               console.log("this.ccbsres ", this.ccbsres )
  //             }
  //           })  
  //     }  
  //   }
  //   }
  // }

  debitClose() {
    this.showinvoicediv = true
    this.showdebitdiv = false

    let debitcontrol = this.DebitDetailForm.controls["debitdtl"] as FormArray;
    debitcontrol.clear()
  }


  deletedebitdetail(section, ind) {
    if (section.value.category_code.code === "GST Tax") {
      return false
    }
    if(ind == 0){
      this.notification.showWarning("The First Line Can't be Deleted")
      return false;
    }

    let id = section.value.id


    if (id != undefined) {
      var answer = window.confirm("Are you sure to delete?");
      if (!answer) {
        return false;
      }
      this.spinner.show();

      this.service.credDebitDel(id)
        .subscribe(result => {
          this.spinner.hide();

          if (result.status == "success") {
            this.removedebitSection(ind, true)
            const dbtdetaildata = this.DebitDetailForm.value.debitdtl;
            let debtax
            debtax = Number((this.cgstval + this.sgstval + this.igstval) / 2)

            for (let i = 0; i < this.DebitDetailForm.value.debitdtl.length; i++) {
              if (this.DebitDetailForm.value.debitdtl[i].category_code.code !== "GST Tax") {
                this.readonlydebit[i] = false
              }
              else {
                this.readonlydebit[i] = true
              }
            }



          } else {
            this.notification.showError(result.description)
          }
        })


    } else {
      this.removedebitSection(ind, true)
      const dbtdetaildata = this.DebitDetailForm.value.debitdtl;
      let debtax
      debtax = Number((this.cgstval + this.sgstval + this.igstval) / 2)

      for (let i = 0; i < this.DebitDetailForm.value.debitdtl.length; i++) {
        let code = this.DebitDetailForm.value.debitdtl[i].category_code?.code
        if (code == undefined)
          code = ''
        code = code.toLowerCase().trim()
        if (code.indexOf('gst') >= 0 && code.indexOf('tax') >= 0) {
          this.readonlydebit[i] = true
        }
        else {
          this.readonlydebit[i] = false
        }
      }


    }

  }

  debitback() {
    if (this.gstchangeflag[this.getinvindex]) {
      this.notification.showInfo("Please save the Debit details")
      return false
    }

    let datas = this.getdebittdatas
    let debitdatas = this.DebitDetailForm.value.debitdtl
    for (let i in datas) {
      for (let j in debitdatas) {
        if (i == j) {
          if (datas[i].category_code.id != debitdatas[j].category_code.id) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          else if (datas[i].subcategory_code.id != debitdatas[j].subcategory_code.id) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          else if (datas[i].glno != debitdatas[j].glno) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          // else if (datas[i].ccbs.bs_code.code != debitdatas[j].bs.code) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
          // else if (datas[i].ccbs.cc_code.code != debitdatas[j].cc.code) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
          // else if (datas[i].ccbs.remarks != debitdatas[j].remarks) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
          else if (datas[i].amount != debitdatas[j].amount) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          else if (datas[i].deductionamount != debitdatas[j].deductionamount) {
            this.notification.showInfo("Please save the changes you have done")
            return false

          }
          // else if (datas[i].ccbs.ccbspercentage != debitdatas[j].ccbspercentage) {
          //   this.notification.showInfo("Please save the changes you have done")
          //   return false

          // }
        }

        else {
          this.debitclosebtn.nativeElement.click();

        }
      }
    }
  }

  debitbacks() {
    if (this.debitsaved == false) {
      if (!window.confirm("Debit Details not Saved. Do you want to continue?"))
        return false
    }
    this.debitClose()




  }

  // -------ccbs--------

  getbsdropdown() {
    this.getbs('')
  }
  getccbsSections(form) {

    return form.controls.ccbsdtl.controls;
  }
  ccbsindex: any
  addccbsSection() {

    const control = <FormArray>this.ccbsForm.get('ccbsdtl');
    control.push(this.ccbsdetail());
  }

  removeccbsSection(i) {

    const control = <FormArray>this.ccbsForm.get('ccbsdtl');
    control.removeAt(i);
    this.debitdatasums()
  }

  debaddindex: any = 0
  addondebindex(index) {
    this.debaddindex = index
  }

  ccbsamount: any
  calcCCBSAmt(index) {
    let percent = this.DebitDetailForm.value.debitdtl[index].ccbspercentage
     this.ccbsamount = (this.invtotamount - this.RoundOffandOtherSum - this.gettaxrate) * +percent / 100

    let num: number = +this.ccbsamount;
    let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    amt = amt ? amt.toString() : '';
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('amt').setValue(amt)
    // this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(amt)
    if (this.RoundOffandOtherSum != 0 && this.invdtladdonIndex == 0 && index == 0) {
      let num: number = +this.ccbsamount + this.RoundOffandOtherSum;
      let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      amt = amt ? amt.toString() : '';
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(amt)
    }
    else {
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(amt)
    }

    let dbtdata = this.DebitDetailForm.value.debitdtl
    let expnselines = dbtdata.filter(x => x.category_code.code.indexOf('GST') == -1)
    let percents = expnselines.map(x => x.ccbspercentage)
    let percentsum = percents.reduce((a, b) => (+a + +b), 0)
    if (percentsum == 100) {
      let amts = dbtdata.map(x => x.amount.replace(/,/g, ''))
      let amtsum = amts.reduce((a, b) => (+a + +b), 0)
      let diff = amtsum - this.invtotamount
      if (diff != 0) {
        let num = this.DebitDetailForm.get('debitdtl')['controls'][expnselines.length - 1].get('amount').value.replace(/,/g, '')
        num = +num - diff
        let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        amt = amt ? amt.toString() : '';
        this.DebitDetailForm.get('debitdtl')['controls'][expnselines.length - 1].get('amt').setValue(amt)
        this.DebitDetailForm.get('debitdtl')['controls'][expnselines.length - 1].get('amount').setValue(amt)
      }
    }

    this.debitdatasums()
  }

  calcCCBSPerc(index) {
    let dataOnDetails = this.DebitDetailForm.value.debitdtl
    let per: any = ((+String(dataOnDetails[index].amt).replace(/,/g, '') / (this.invtotamount - this.gettaxrate)) * 100).toFixed(2)
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('ccbspercentage').setValue(per)
    this.debitdatasums()
  }

  ccbsdetail() {
    let group = new FormGroup({
      id: new FormControl(),
      cc_code: new FormControl(),
      bs_code: new FormControl(),
      code: new FormControl(),
      ccbspercentage: new FormControl(100),
      glno: new FormControl(''),
      remarks: new FormControl(''),
      amount: new FormControl(0.0),
    })

    group.get('ccbspercentage').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcCCBSAmt(this.debaddindex)
      if (!this.ccbsForm.valid) {
        return;
      }
      this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    }
    )

    group.get('amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcCCBSPerc(this.debaddindex)
      if (!this.ccbsForm.valid) {
        return;
      }
      this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    }
    )

    let bskeyvalue: String = "";
    this.getbs(bskeyvalue);
    group.get('bs_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getbsscroll(value, 1)
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
        this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
      })

    group.get('cc_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getccscroll(this.bssid, value, 1)
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
        // console.log("ccdata", this.ccNameData)
        this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
      })


    return group
  }

  viewccbs(section, data, index) {
    let debitdata = this.debitdata

    if (debitdata[index]?.category_code.name != section.value.category_code.name) {
      this.notification.showInfo("Please save the changes done in Category code")
      this.showccbspopup = false
      return false

    }
    else if (debitdata[index]?.subcategory_code.name != section.value.subcategory_code.name) {
      this.notification.showInfo("Please save the changes done in Subcategory")
      this.showccbspopup = false
      return false

    }
    else if (debitdata[index]?.glno != section.value.glno) {
      this.notification.showInfo("Please save the changes done in GL Number")
      this.showccbspopup = false
      return false

    }
    // else if (debitdata[index]?.bsproduct_code_id != section.value.bsproduct_code_id) {
    //   this.notification.showInfo("Please save the changes done in Business Product code")
    //   this.showccbspopup = false
    //   return false

    // }
    else if (debitdata[index]?.amount != section.value.amount) {
      this.notification.showInfo("Please save the changes done in Amount")
      this.showccbspopup = false
      return false

    }
    else if (debitdata[index]?.deductionamount != section.value.deductionamount) {
      this.notification.showInfo("Please save the changes done in Adjust amount")
      this.showccbspopup = false
      return false

    }
    else {
      // this.addccbs(section, data, index)
    }
  }

  enableUpload = true
  fileToUpload: any;
  ccbsFile: boolean = false
  chooseFile(event: any) {
    this.fileToUpload = []
    this.fileToUpload = event.target.files[0];
    this.ccbsFile = true;
  }

  // uploadFile() {
  //     if(this.ccbsFile==false)
  //     {
  //       this.notification.showWarning("Please select a file to Upload")
  //     }
  //     else
  //     {
  //       this.spinner.show();  
  //       this.service.uploadCcbsFile(this.debitaddonid, this.fileToUpload).subscribe(result=>{
  //         if(result?.data)
  //         {
  //           this.service.getCcbs(this.debitaddonid)
  //           .subscribe(result => {
  //             if (result === undefined)
  //             {
  //                 return false
  //             }

  //             this.getccbsdatas = result["data"]
  //           let ccbs = this.ccbsForm.controls["ccbsdtl"] as FormArray;
  //           ccbs.clear()
  //           this.getccbsrecords(this.getccbsdatas)
  //           this.debitccbssums()
  //           })
  //           this.enableUpload= false
  //           this.notification.showSuccess("Uploaded successfully.")

  //           this.spinner.hide();
  //           this.ccbsFile=false;
  //         }
  //         else
  //         {
  //           this.spinner.hide();
  //           this.notification.showError("Invalid File Format.")
  //           this.ccbsFile=false;
  //         }
  //       }
  //       )
  //     }    
  //   }
  debitaddonid: any
  debitamount: any
  glno: any
  getccbsdatas: any

  debdata: any
  ccbsdet: any

  // addccbs(section, data, index) {
  //   this.uploadinput.nativeElement.value=""
  //   this.fileToUpload =[]
  //   this.enableUpload= true
  //   this.spinner.show();

  //   this.ccbssaved = false
  //   let datas = this.ccbsForm.get('ccbsdtl') as FormArray
  //   datas.clear()
  //   if (this.debitdata != undefined) {
  //     let datas = this.debitdata[index]
  //     this.glno=datas.glno
  //     this.debitamount = String(datas.amount).replace(/,/g, '')    
  //     this.debitaddonid = datas.id

  //   } else {
  //     let sections = section.value
  //     this.glno=sections.glno
  //     this.debitamount = String(sections.amount).replace(/,/g, '')   
  //     this.debitaddonid = sections.id
  //   }

  //   if(this.debitaddonid == undefined){
  //     this.notification.showWarning("Please save the Debit Detail Changes")
  //     this.showccbspopup = false
  //     this.spinner.hide();

  //     return false;

  //   }else{

  //   this.service.getCcbs(this.debitaddonid)
  //     .subscribe(result => {
  //        console.log("getccbsrecords",result)
  //       if (result === undefined)
  //       {
  //           return false
  //       }

  //       this.getccbsdatas = result["data"]
  //       if (this.getccbsdatas.length === 0) 
  //       {
  //         this.addccbsSection()
  //         this.debdata = this.invdtls.filter(x => x.id == this.invdtladdonid)[0]?.apdebit?.data
  //         if(this.debdata != undefined && this.debdata != null)
  //         {
  //           this.ccbsdet = this.debdata[0]?.ccbs[0]
  //           if (this.ccbsdet != undefined && this.ccbsdet != null)
  //           {
  //             this.ccbsForm.get('ccbsdtl')['controls'][0].get('cc_code').setValue(this.ccbsdet.cc_code)
  //             this.ccbsForm.get('ccbsdtl')['controls'][0].get('bs_code').setValue(this.ccbsdet.bs_code)
  //             this.ccbsForm.get('ccbsdtl')['controls'][0].get('code').setValue(this.ccbsdet.code)
  //           }
  //         }

  //         this.ccbsForm.get('ccbsdtl')['controls'][0].get('glno').setValue(this.glno)
  //         this.ccbsForm.get('ccbsdtl')['controls'][0].get('ccbspercentage').setValue(100)
  //         let num: number = +this.debitamount;
  //         let amt = new Intl.NumberFormat("en-GB").format(num); 
  //         amt = amt ? amt.toString() : '';

  //         this.ccbsForm.get('ccbsdtl')['controls'][0].get('amount').setValue(amt)
  //         this.debitccbssums()   
  //       }
  //       else      
  //       {
  //         this.getccbsrecords(this.getccbsdatas)       
  //       }
  //     })
  //   }
  //   this.spinner.hide();
  // }

  getccbsrecords(datas) {
    console.log(datas)

    if (datas.length == 0) {

      const control = <FormArray>this.ccbsForm.get('ccbsdtl');
      control.push(this.ccbsdetail());
    }

    for (let ccbs of datas) {
      let id: FormControl = new FormControl('');

      let cc_code: FormControl = new FormControl('');
      let bs_code: FormControl = new FormControl('');
      let code: FormControl = new FormControl('');
      let ccbspercentage: FormControl = new FormControl('');
      let glno: FormControl = new FormControl('');
      let remarks: FormControl = new FormControl(0);
      let amount: FormControl = new FormControl('');
      const ccbsFormArray = this.ccbsForm.get("ccbsdtl") as FormArray;

      id.setValue(ccbs.id)

      cc_code.setValue(ccbs.cc_code)
      bs_code.setValue(ccbs.bs_code)
      code.setValue(ccbs.code)
      ccbspercentage.setValue(ccbs.ccbspercentage)
      glno.setValue(ccbs.glno)
      remarks.setValue(ccbs.remarks)
      let num: number = +ccbs.amount;
      let amt = new Intl.NumberFormat("en-GB").format(num);
      amt = amt ? amt.toString() : '';

      amount.setValue(amt)

      ccbsFormArray.push(new FormGroup({
        id: id,
        cc_code: cc_code,
        bs_code: bs_code,
        code: code,
        ccbspercentage: ccbspercentage,
        glno: glno,
        remarks: remarks,
        amount: amount,
      }))

      let bskeyvalue: String = "";
      this.getbs(bskeyvalue);
      bs_code.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.getbsscroll(this.bsInput.nativeElement.value, 1)
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
          // console.log("bsdata", this.bsNameData)
          this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
        })

      cc_code.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.getccscroll(this.bssid, value, 1)
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
          // console.log("ccdata", this.ccNameData)
          this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
        })

      this.debitccbssums();

      ccbspercentage.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // console.log("should be called first")
        this.calcCCBSAmt(this.debaddindex)
        if (!this.ccbsForm.valid) {
          return;
        }
        this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
      }
      )

      amount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calcCCBSPerc(this.debaddindex)
        if (!this.ccbsForm.valid) {
          return;
        }
        this.linesChange.emit(this.ccbsForm.value['ccbsdtl']);
      }
      )
    }
    // }
  }

  ccbsdetails: any
  ccbsres: any

  // ccbsform() {
  //   const ccbsdata = this.ccbsForm.value.ccbsdtl;
  //   for (let i in ccbsdata) {

  //     if ((ccbsdata[i].cc_code == '') || (ccbsdata[i].cc_code == null) || (ccbsdata[i].cc_code == undefined)) {
  //       this.toastr.error('Please Choose cc');
  //       return false;
  //     }
  //     if ((ccbsdata[i].bs_code == '') || (ccbsdata[i].bs_code == null) || (ccbsdata[i].bs_code == undefined)) {
  //       this.toastr.error('Please Choose bs');
  //       return false;
  //     }
  //     if (ccbsdata[i].id === "") {
  //       delete ccbsdata[i].id
  //     }
  //     ccbsdata[i].code=ccbsdata[i].cc_code.id
  //     ccbsdata[i].amount = String(ccbsdata[i].amount).replace(/,/g, '');   
  //   }
  //   let percentage =ccbsdata.map(x => x.ccbspercentage )
  //   let percentsum = percentage.reduce((a, b) =>(Number(a) + Number(b)), 0);

  //   if (percentsum != 100) {
  //     this.toastr.error('Total CCBS Percentage should be 100');
  //     return false
  //   }
  //   if (this.ccbsssum > this.debitamount || this.ccbsssum < this.debitamount) {
  //     this.toastr.error('Check Debit Amount', 'Please Enter Valid Amount');
  //     return false
  //   }
  //   this.ccbsdetails = this.ccbsForm.value.ccbsdtl;
  //   let ccbsdet = {"ccbs" : this.ccbsdetails}
  //   this.spinner.show();

  //   this.service.ccbsAddEdit(this.debitaddonid, ccbsdet)
  //       .subscribe(result => {
  //         this.spinner.hide();

  //         if (result.code != undefined) {
  //           this.notification.showError(result.description)

  //         }
  //         else {
  //           this.notification.showSuccess("Successfully CCBS Details Saved!...")
  //           this.ccbsres = result
  //           console.log("this.ccbsres ", this.ccbsres )
  //           this.ccbssaved =true
  //           this.ccbsclose.nativeElement.click();
  //         }
  //       })    
  // }

  delccbsid: any
  // deleteccbs(section, ind) {
  //     let id = section.value.id

  //     if (id != undefined) {
  //       this.delccbsid = id
  //     } else {

  //       if(this.ccbsres == undefined){
  //         this.removeccbsSection(ind)
  //       }else{
  //       for (var i = 0; i < this.ccbsres.length; i++) {
  //         if (i === ind) {
  //           this.delccbsid = this.ccbsres[i].id
  //         }
  //       }
  //     }
  //     }
  //     if(this.delccbsid != undefined){
  //       var answer = window.confirm("Are you sure to delete?");
  //       if (!answer) {
  //         return false;
  //       }
  //       this.spinner.show();

  //     this.service.ccbsdelete(this.delccbsid)
  //       .subscribe(result => {
  //         this.spinner.hide();

  //        if(result.status == "success"){
  //         this.notification.showSuccess("Deleted Successfully")
  //         this.removeccbsSection(ind)
  //        }else{
  //         this.notification.showError(result.description) 
  //        }
  //       })

  //     }else{
  //       this.removeccbsSection(ind)
  //     }
  //   }

  ccbsamt: any
  ccbssum: any
  ccbsssum: any


  debitccbssums() {
    this.ccbsamt = this.ccbsForm.value['ccbsdtl'].map(x => String(x.amount).replace(/,/g, ''));
    this.ccbssum = this.ccbsamt.reduce((a, b) => (Number(a) + Number(b)), 0);
    this.ccbsssum = this.ccbssum
  }

  ccbsback() {
    // let datas = this.getdebittdatas
    // let debitdatas = this.DebitDetailForm.value.debitdtl
    // for (let i in datas) {
    //   for (let j in debitdatas) {
    //     if (i == j) {
    //       if (datas[i].category_code.id != debitdatas[j].category_code.id) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       else if (datas[i].subcategory_code.id != debitdatas[j].subcategory_code.id) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       else if (datas[i].glno != debitdatas[j].glno) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       // else if (datas[i].ccbs.bs_code.code != debitdatas[j].bs.code) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //       // else if (datas[i].ccbs.cc_code.code != debitdatas[j].cc.code) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //       // else if (datas[i].ccbs.remarks != debitdatas[j].remarks) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //       else if (datas[i].amount != debitdatas[j].amount) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       else if (datas[i].deductionamount != debitdatas[j].deductionamount) {
    //         this.notification.showInfo("Please save the changes you have done")
    //         return false

    //       }
    //       // else if (datas[i].ccbs.ccbspercentage != debitdatas[j].ccbspercentage) {
    //       //   this.notification.showInfo("Please save the changes you have done")
    //       //   return false

    //       // }
    //     }

    //     else {
    //       this.closebutton.nativeElement.click();

    //     }
    //   }
    // }
  }

  ccbsbacks() {
    const ccbsdata = this.ccbsForm.value.ccbsdtl;

    let percentage = ccbsdata.map(x => x.ccbspercentage)
    let percentsum = percentage.reduce((a, b) => (Number(a) + Number(b)), 0);

    if (percentsum != 100) {
      this.notification.showWarning('Total CCBS Percentage should be 100');
      return false
    }

    if (Number(this.ccbsssum) != Number(this.debitamount)) {
      this.notification.showWarning("CCBS Amount Mismatch.")
    }
    let ccbscontrol = this.ccbsForm.controls["ccbsdtl"] as FormArray;
    ccbscontrol.clear()
  }



  Rvalue: number = 0;
  Ovalue: number = 0;
  min: number = -1;
  max: number = 1;
  RoundingOFF(e) {
    if (e >= this.max) {
      // this.Rvalue = 0
      this.InvoiceDetailForm.patchValue({
        roundoffamt: 0
      })
      this.toastr.warning("Round off Amount should be between -1 and 1");
      return false
    }
    else if (e < this.min) {
      // this.Rvalue = 0
      this.InvoiceDetailForm.patchValue({
        roundoffamt: 0
      })
      this.toastr.warning("Round off Amount should be between -1 and 1");
      return false
    }
    else if (e < this.max) {
      this.Rvalue = e
      this.INVdatasums()
    }
  }

  AdjustAmount(e, ind) {
    this.debitAdjust(ind)
    this.debitdatasums()
  }

  debitAdjust(ind) {
    let dataOnDetails = this.DebitDetailForm.value.debitdtl
    let amt: any = +(String(dataOnDetails[ind].amt).replace(/,/g, ""));
    let adj: any = +dataOnDetails[ind].deductionamount
    let dbt = amt + adj

    let temp = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(dbt);
    temp = temp ? temp.toString() : '';
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('amount').setValue(dbt.toFixed(2))
  }
  otheradjustmentmaxamount: any;
  otheradjustmentminamount: any;
  // OtherAdjustment(e) {
  //   let data = this.InvoiceHeaderForm.value.invoiceheader
  //   for (let i in data) {
  //     let invamt = Number(data[i].invoiceamount)
  //     let roundamt = Number(data[i].roundoffamt)
  //     this.otheradjustmentmaxamount = invamt + roundamt

  //   }

  //   if (e > this.otheradjustmentmaxamount) {
  //     this.Ovalue = 0
  //     this.toastr.warning("Other Adjustment Amount should not exceed taxable amount");
  //     return false
  //   }
  // }
  percent: any;
  totpercent: any;

  valPercent(index){    
    let percent = (+this.DebitDetailForm.value.debitdtl[index].ccbspercentage).toFixed(2)
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('ccbspercentage').setValue(percent)
    let debitdata = this.DebitDetailForm.value.debitdtl
    let explines = []
    for (let i = 0; i < debitdata.length; i++) {
      let cat = debitdata[i].category_code?.code ? debitdata[i].category_code?.code : debitdata[i].category_code
      if (cat.indexOf('GST') == -1)
        explines.push(debitdata[i])
    }

    this.percent = explines.map(x => Number(x.ccbspercentage));
    this.totpercent = this.percent.reduce((a, b) => a + b, 0);
    if (this.totpercent > 100) {
      this.notification.showWarning("Percentage should not exceed 100")
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('ccbspercentage').setValue(0)
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(0)
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('amt').setValue(0)
      return false
    }

    // if (e > 100) {
    //   let num = String(this.DebitDetailForm.value.debitdtl[i].ccbspercentage)
    //   num.slice(0,num.length-1)
    //   this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(num) 

    //   this.toastr.warning("Percentage should not exceed 100");      
    //   return false
    // }
    // return true
  }


  numberOnlyandDotminus(event, val): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57) && ((charCode < 45 || charCode > 46))) {
      return false;
    }
        
    val = String(val + event.key).replace(/,/g, '') 
    if(+val > 9999999999)
      return false
    else
      return true;
  }

  // backform() {
  //   this.onCancel.emit()

  // }


  approvername() {
    // if ((this.OverallForm.controls['branch_id'].value == '') || (this.OverallForm.controls['branch_id'].value == null) || (this.OverallForm.controls['branch_id'].value == undefined)) {
    //   this.toastr.error('Please Choose Approver Branch');
    //   return false;
    // }
    let appkeyvalue: String = "";
    // this.getapprover(appkeyvalue);
    let comm = this.shareservice.commodity_id.value
    let branch = this.OverallForm.controls['branch_id']?.value.id
    this.getapprover(appkeyvalue, branch);
    this.OverallForm.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.service.getapproverscroll(1, comm, this.invHdrRes.raisedby, branch, value)
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

  private getapprover(appkeyvalue, branch) {
    let comm = this.shareservice.commodity_id.value
    this.service.getapproverscroll(1, comm, this.invHdrRes.raisedby, branch, appkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;
      })
  }

  public displayFnApprover(approver?: approverListss): string | undefined {
    return approver ? approver.name : undefined;
  }

  get approver() {
    return this.OverallForm.get('approvedby');
  }

  autocompleteapproverScroll() {
    let comm = this.shareservice.commodity_id.value
    let branch = this.OverallForm.controls['branch_id']?.value.id

    if (branch == "" || branch == null || branch == undefined)
      return false

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
                this.service.getapproverscroll(this.currentpageapp + 1, comm, this.invHdrRes.raisedby, branch, this.appInput.nativeElement.value)
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


  overallback() {
    this.shareservice.editkey.next("edit")
    this.shareservice.comefrom.next("invoicedetail")
    this.shareservice.modificationFlag.next('')
    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.shareservice.ecfheaderedit.next(this.ecfhdrid)
    if (!this.changesInAP && this.movedata != 'ECF') {
      this.spinner.show();
      this.service.unlockapi(this.apinvHeader_id)
        .subscribe(result => {
          console.log(result)
          this.spinner.hide();
        })
    }
    if (this.movedata == 'apapproverview') {
      this.onApproveBack.emit()
    }
    else {
      this.onCancel.emit()
    }
    // this.router.navigate(['ECFAP/ecfapsummary'], {queryParams : {comefrom : "invoicedetail"}})
  }


  characterOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122)) {
      return false;
    }
    return true;
  }

  characterandnumberonly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  // ---------overall submit------



  // // get branchtype() {
  // //   return this.SubmitoverallForm.get('approver_branch');
  // // }

  // public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {

  //   return branchtyperole ? +branchtyperole.code +"-"+branchtyperole.name : undefined;

  // }

  // get branchtyperole() {
  //   return this.ecfheaderForm.get('branch');
  // }


  // private branchdropdown(branchkeyvalue) {
  //   this.service.getBranch(branchkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Branchlist = datas;


  //     })
  // }

  // branchScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matbranchAutocomplete &&
  //       this.matbranchAutocomplete &&
  //       this.matbranchAutocomplete.panel
  //     ) {
  //       fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.service.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   if (this.Branchlist.length >= 0) {
  //                     this.Branchlist = this.Branchlist.concat(datas);
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }



  // gettdsapplicable() {
  //   this.service.gettdsapplicability()
  //     .subscribe(result => {
  //     this.tdsList = result['data']
  //     })
  // }

  // public displayFnapprover(approvertype?: approverListss): string | undefined {
  //   return approvertype ? approvertype.full_name : undefined;
  // }

  // // get approvertype() {
  // //   return this.SubmitoverallForm.get('approved_by');
  // // }
  // approvid: any
  // approverid(data) {
  //  this.approvid = data.id
  // }


  // private approverdropdown(approverkeyvalue) {
  //   this.service.getapprover(approverkeyvalue)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Approverlist = datas;


  //     })
  // }

  // approverScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matappAutocomplete &&
  //       this.matappAutocomplete &&
  //       this.matappAutocomplete.panel
  //     ) {
  //       fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matappAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.service.getapproverscroll(this.approverInput.nativeElement.value, this.currentpage + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   if (this.Approverlist.length >= 0) {
  //                     this.Approverlist = this.Approverlist.concat(datas);
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }




  //ECF Type CRN

  getcatdropdowns() {
    this.creditglForm.get('category_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.service.getcategoryscroll(value, 1, this.aptypeid)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        if (this.aptypeid != 7)
          datas = datas.filter(x => x.code != "SUSPENSE")
        else
          datas = datas.filter(x => x.code == "SUSPENSE")
        this.categoryData = datas;
      })
  }

  getsubcatdropdowns() {
    this.getsubcat(this.catid, "");
    this.creditglForm.get('subcategory_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.service.getsubcategoryscroll(this.catid, value, 1)
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
  }

  public displaycrncatFn(crncattype?: catlistss): string | undefined {
    return crncattype ? crncattype.name : undefined;
  }

  get crncattype() {
    return this.creditglForm.get('category_code');
  }

  public displaycrnsubcatFn(crnsubcategorytype?: subcatlistss): string | undefined {
    return crnsubcategorytype ? crnsubcategorytype.code : undefined;
  }

  get crnsubcategorytype() {
    return this.creditglForm.get('subcategory_code');
  }

  getcrnGLNumber(data) {
    // this.crnglForm.patchValue({
    //   creditglno : data.glno
    // })
    this.creditglForm.get('glnum').setValue(data?.glno)
  }
    getgetcrnGLNumber(data) {
    this.crnglForm.get('crnglArray')['controls'][0].get('creditglno').setValue(data?.glno)
    // this.creditglForm.get('glnum').setValue(data?.glno)
  }

  crnsubmitForm() {
    let data = this.crnglForm?.value?.crnglArray

    for (let i in data) {
      if (data[i].category_code == undefined || data[i].category_code == null || data[i].category_code == "") {
        this.notification.showError("Please choose Category Code.")
        return false
      }
      if (data[i].subcategory_code == undefined || data[i].subcategory_code == null || data[i].subcategory_code == "") {
        this.notification.showError("Please choose SubCategory Code.")
        return false
      }
      if (data[i].creditglno == undefined || data[i].creditglno == null || data[i].creditglno == "") {
        this.notification.showError("GL No. should not be empty.")
        return false
      }
    }

    // if(data?.category_code == undefined || data?.category_code == null || data?.category_code == "")
    // {
    //   this.notification.showError("Please choose Category Code.")
    //   return false
    // }

    // if(data?.subcategory_code == undefined || data?.subcategory_code == null || data?.subcategory_code == "")
    // {
    //   this.notification.showError("Please choose SubCategory Code.")
    //   return false
    // }

    // if(data?.creditglno == undefined || data?.creditglno == null || data?.creditglno == "")
    // {
    //   this.notification.showError("GL No. should not be empty.")
    //   return false
    // }

    for (let i in data) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('glno').setValue(data[i]?.creditglno)
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('category_code').setValue(data[i]?.category_code.code)
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('subcategory_code').setValue(data[i]?.subcategory_code.code)
    }
    // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('glno').setValue(data.creditglno)
    // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('category_code').setValue(data?.category_code?.code)
    // this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('subcategory_code').setValue(data?.subcategory_code?.code)
    this.crnCat = data[this.getcreditindex]?.category_code
    this.crnSubcat = data[this.getcreditindex]?.subcategory_code
    this.crnGL = data[this.getcreditindex]?.creditglno
    this.closebuttonsgl.nativeElement.click();
  }

  dataclears() {
    // this.crnglForm.controls['category_code'].reset("")
    // this.crnglForm.controls['subcategory_code'].reset("")
    // this.crnglForm.controls['creditglno'].reset("")
    let data = this.crnglForm.value.crnglArray
    for (let i in data) {
      this.crnglForm.get('crnglArray')['controls'][i].get('category_code').reset()
      this.crnglForm.get('crnglArray')['controls'][i].get('subcategory_code').reset()
      this.crnglForm.get('crnglArray')['controls'][i].get('creditglno').reset()
    }
  }

  closeCRNGL() {
    this.showgrnpopup = false
    this.closebuttons.nativeElement.click();
  }


  crnDisable = [false, false, false, false, false, false, false]
  iscrn = false;
  getCrnrecords(page) {
    this.crnLoad = true
    let crncontrol = this.ppxForm.controls["crndtl"] as FormArray;
    crncontrol.clear()
    this.iscrn = true
    console.log("this.crndata-->", this.crndata)
  const startIndex = (page - 1) * this.pageSize_crn;
  const endIndex = startIndex + this.pageSize_crn;
  let x = startIndex
  this.crndata = this.crndata.slice(startIndex, endIndex);
    let ecfid
    if (this.ecfheaderid != undefined) {
      ecfid = this.ecfheaderid
    } else {
      ecfid = this.ecfheaderidd
    }

    for (let crn of this.crndata) {
      let id: FormControl = new FormControl('');
      let name: FormControl = new FormControl('');

      let crno: FormControl = new FormControl('');
      let branchName: FormControl = new FormControl('');
      let branchCode: FormControl = new FormControl('');
      let raiserbranch:FormControl = new FormControl('')
      let apinvoiceheader_id: FormControl = new FormControl('');
      let credit_id: FormControl = new FormControl('');
      let ppxheader_date: FormControl = new FormControl('');
      let ppxheader_amount: FormControl = new FormControl('');
      let ecfheader_id: FormControl = new FormControl('');
      let ppxheader_balance: FormControl = new FormControl('');
      let ecf_amount: FormControl = new FormControl(0);
      let liquedate_limit: FormControl = new FormControl(0);
      let ap_amount: FormControl = new FormControl('');
      let ppxdetails: FormControl = new FormControl('');
      let liquidate_amt: FormControl = new FormControl('');
      let process_amount: FormControl = new FormControl('');
      let select: FormControl = new FormControl('');
      let creditglno: FormControl = new FormControl('');
      let adv_debit_cat_code: FormControl = new FormControl('');
      let adv_debit_subcat_code: FormControl = new FormControl('');
      const crnFormArray = this.ppxForm.controls["crndtl"] as FormArray;

      id.setValue(crn.id)
      name.setValue(crn.payto_name)
      crno.setValue(crn.invoiceheader_crno)
      ppxheader_date.setValue(crn.ppxheader_date)
      branchName.setValue(crn.emp_branch_details?.name)
      branchCode.setValue(crn.emp_branch_details?.code)
      apinvoiceheader_id.setValue(crn.apinvoiceheader_id)
      credit_id.setValue(crn.credit_id)
      ppxheader_amount.setValue(crn.ppxheader_amount)
      ecfheader_id.setValue(ecfid)
      ppxheader_balance.setValue(crn.ppxheader_balance)
      ecf_amount.setValue(crn.ecf_amount)
      liquedate_limit.setValue(crn.liquedate_limit)
      ap_amount.setValue(crn.ap_amount)
      ppxdetails.setValue(crn.ppxdetails)
      liquidate_amt.setValue(0)
      process_amount.setValue(crn.process_amount)
      creditglno.setValue(crn.credit_glno)

      adv_debit_cat_code.setValue(crn.adv_debit_cat_code)
      adv_debit_subcat_code.setValue(crn.adv_debit_subcat_code)
      select.setValue(false)
      let rsrbr
      if (this.movedata == 'ECF')
        rsrbr = crn?.raiser_branch?.name + ' - ' + crn?.raiser_branch?.code
      else
        rsrbr = crn?.raiser_branch?.name + ' - ' + crn?.raiser_branch?.code
      raiserbranch.setValue(rsrbr)

      // if (crn.ppxheader_balance > 0) {
      //   this.crnDisable[x] = false
      // }
      // else {
      //   this.crnDisable[x] = true
      // }
      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
      for (let i in creditdtlsdatas) {
        if (creditdtlsdatas[i].paymode_id?.code == 'PM009' && creditdtlsdatas[i].refno == crn.crno) {
          if (this.getcreditindex == i) {
            this.crnDisable[x] = false
          }
          else {
            this.crnDisable[x] = true
          }
          liquidate_amt.setValue(creditdtlsdatas[i].amount)
          select.setValue(true)
        }
      }
      crnFormArray.push(new FormGroup({
        id: id,
        name: name,
        crno: crno,
        branchName: branchName,
        branchCode: branchCode,
        raiserbranch:raiserbranch,
        apinvoiceheader_id: apinvoiceheader_id,
        credit_id: credit_id,
        ppxheader_date: ppxheader_date,
        ppxheader_amount: ppxheader_amount,
        ecfheader_id: ecfheader_id,
        ppxheader_balance: ppxheader_balance,
        ecf_amount: ecf_amount,
        liquedate_limit: liquedate_limit,
        ap_amount: ap_amount,
        ppxdetails: ppxdetails,
        liquidate_amt: liquidate_amt,
        process_amount: process_amount,
        select: select,
        creditglno: creditglno,
        adv_debit_cat_code: adv_debit_cat_code,
        adv_debit_subcat_code: adv_debit_subcat_code,
      }))
      x++
    }
    this.getCRNsum()
    this.crnLoad = false
  }

  selectedcrndata: any = []
  crnliquidatevalue: any
  crnCrno: any
  submitcrn() {
    this.selectedcrndata = []
    const crnForm = this.crnForm.value.crndtl

    let crnselected = false
    let ind
    if (this.crnsum > this.totalamount) {
      this.notification.showError("Liquidate Amount should not exceed the Invoice amount.")
      return false
    }
    for (let i in crnForm) {
      console.log("crnForm[i].select--", crnForm[i].select)
      if (crnForm[i].select == true) {
        crnselected = true
        if (this.selectedcrndata.length > 0) {
          for (let j = 0; j < this.selectedcrndata.length; j++) {
            if (this.selectedcrndata[j].advno == crnForm[i].advno) {
              ind = j

              this.selectedcrndata[j].liquidate_amt = crnForm[i].liquidate_amt
            }
            else {
              this.selectedcrndata.push(crnForm[i])
            }
          }
        }
        else {
          this.selectedcrndata.push(crnForm[i])
        }
      }
    }
    if (crnselected == true) {
      let n
      if (ind != undefined) {
        n = ind
      }
      else {
        n = this.selectedcrndata.length - 1
      }
      if (Number(this.selectedcrndata[n].liquidate_amt) <= 0) {
        this.notification.showError("Please give a valid amount to liquidate.")
      }
      else {
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('refno').setValue(this.selectedcrndata[n].advno)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue(this.selectedcrndata[n].liquidate_amt)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('glno').setValue(this.selectedcrndata[n].creditglno)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('category_code').setValue(this.selectedcrndata[n].adv_debit_cat_code)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('subcategory_code').setValue(this.selectedcrndata[n].adv_debit_subcat_code)
        let crncontrol = this.crnForm.controls["crndtl"] as FormArray;
        crncontrol.clear()
        this.closecrnbutton.nativeElement.click();
        this.showcrnmodal = false
      }
    }
    else {
      this.notification.showError("Please select an CRN No. and give amount to Liquidate.")
    }
    console.log("this.selectedcrn==", this.selectedcrndata)
  }

  crnamt(e, ind) {
    if (this.crnLoad == false) {
      let liqamts = this.ppxForm.value['crndtl'].map(x => String(x.liquidate_amt).replace(/,/g, ''));
      let amt = liqamts.reduce((a, b) => Number(a) + Number(b), 0);

      let liqamt = String(this.ppxForm.value.crndtl[ind].liquidate_amt).replace(/,/g, '')
      let balamt = String(this.ppxForm.value.crndtl[ind].ppxheader_balance).replace(/,/g, '')
      let limitamt = String(this.ppxForm.value.crndtl[ind].liquedate_limit).replace(/,/g, '')

      if (+liqamt > Number(balamt) || +amt > this.totalamount || +liqamt > +limitamt) {
        let n = liqamt.slice(0, liqamt.length - 1)
        let num: number = +n
        liqamt = new Intl.NumberFormat("en-GB").format(num);
        liqamt = liqamt ? liqamt.toString() : '';
        this.ppxForm.get('crndtl')['controls'][ind].get('liquidate_amt').setValue(liqamt)
        this.notification.showError("Liquidate amount should not exceed the Invoice Amount, Balance Amount and Liquidate Limit.")
      }
      else {
        this.crnChangeToCurrency(ind)
      }
    }
  }

  crnChangeToCurrency(i) {
    if (this.crnLoad == false) {
      if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
        let a = String(this.ppxForm.get('crndtl')['controls'][i].get('liquidate_amt').value);
        a = a.replace(/,/g, "");
        if (a && !isNaN(+a)) {
          let num: number = +a;
          num = +(num.toFixed(2))
          let temp = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(num);
          temp = temp ? temp.toString() : '';
          this.ppxForm.get('crndtl')['controls'][i].get('liquidate_amt').setValue(temp)
        }
      }
    }
  }

  crnamtDecimalChg(ctrl, ctrlname, i) {
    let amt = ctrl.value
    amt = amt.replace(/,/g, "");

    if (+amt >= 0) {
      let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
      temp = temp ? temp.toString() : '';
      this.ppxForm.get('crndtl')['controls'][i].get(ctrlname).setValue(temp)
    }
  }

  closecrn() {
    this.showcrnmodal = false
    this.closecrnbutton.nativeElement.click();
  }

  crnsum: any
  crnselect(e, ind) {
    const crnForm = this.crnForm.value.crndtl

    if (e.checked == true) {
      let crnselected = false
      for (let i in crnForm) {
        if (i != ind && crnForm[i].select == true && this.crnDisable[i] == false) {
          crnselected = true
        }
      }
      if (crnselected == true) {
        this.notification.showError("Please select only one CRN.")
        this.crnForm.get('crndtl')['controls'][ind].get('select').setValue(false)
        return false
      }
    }

    this.getCRNsum();
  }

  getCRNsum() {
      if (this.crnLoad == false) {
      this.crnsum = 0    

    for (let i = 0; i < this.selectedcrndata.length; i++) {
      const amt = parseFloat(String(this.selectedcrndata[i].liquidate_amt || 0).replace(/,/g, '')) || 0;
      this.crnsum += amt;
    }
    }
    
  }

  getCrnSections(form) {
    return form.controls.crndtl.controls;
  }

  getconfirmacc(e) {
    this.kvbaccForm.get('confirmaccno').setValue(e.target.value)
  }
  kvbbackForm() {
    this.closekvbbutton.nativeElement.click();
  }

  kvbsubmitForm() {
    let accdetails = this.kvbaccForm?.value
    if (accdetails?.accno == "" || accdetails?.accno == null || accdetails?.accno == undefined) {
      this.notification.showError("Please Enter Account Number");
      return false;
    }
    if (accdetails?.confirmaccno == "" || accdetails?.confirmaccno == null || accdetails?.confirmaccno == undefined) {
      this.notification.showError("Please Enter Confirm Account Number");
      return false;
    }
    if (accdetails?.confirmaccno != this.kvbacaccno) {
      this.notification.showError("Confirm Account Number Does Not Match with Account Number");
      return false;
      // } else if (this.kvbacaccno != accdetails?.confirmaccno) {
      //   this.notification.showError("Account Number Does Not Match with Confirm Account Number");
      //   return false;
    } else {
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('accno').setValue(this.kvbaccForm?.value?.confirmaccno)
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('refno').setValue(this.kvbaccForm?.value?.confirmaccno)
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('bank').setValue("KARUR VYSYA BANK")
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('branch').setValue("EXPENSES MANAGEMENT CELL")
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('ifsccode').setValue("KVBL0001903")
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('benificiary').setValue("EXPENSES MANAGEMENT CELL")
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('glno').setValue("999999999")

      this.ICRAccNo = this.kvbaccForm?.value?.confirmaccno
      this.closekvbbutton.nativeElement.click();
    }
  }

  closekvbac() {
    if (this.showkvbacpopup == true) {
      this.showkvbacpopup = false
      this.closekvbbutton.nativeElement.click();
    }
  }


  showApprover = false
  batchwiseSelect(val) {
    if (val == 'Y')
      this.showApprover = false
    else if (val == 'N')
      this.showApprover = true
  }


  OverallFormSubmit() {
    if (this.frmInvHdr.value.gst_keyin == true && this.invheadersave && this.invdtlsaved == false) {
      this.notification.showError("Please save Invoice Detail.")
      return false
    }

    if (this.frmInvHdr.value.gst_keyin == true && this.invheadersave && this.invdtlsaved && this.debitsaved == false) {
      this.notification.showError("Please save Debit.")
      return false
    }

    let submitform = this.OverallForm.value
    let credform = this.creditdetForm.value
    if (submitform.batch_wise == 'N' && (submitform.approvedby?.id == null || submitform.approvedby?.id == undefined || submitform.approvedby?.id == "")) {
      this.notification.showError("Please select Approver.")
      return false
    }

    // if(submitform?.is_tds_applicable == "" || submitform?.is_tds_applicable == null || submitform?.is_tds_applicable == undefined){
    //   this.notification.showError("Please select Is TDS Applicable.")
    //   return false
    // }

    if (submitform?.is_tds_applicable == true) {
      submitform.is_tds_applicable = 1
    } else {
      submitform.is_tds_applicable = 0
    }
    let input
    if (submitform.approvedby == null || submitform.approvedby == undefined || submitform.approvedby == "")
      input = { id: this.apinvHeader_id, payment_instruction: credform?.payment_instruction, is_tds_applicable: credform?.is_tds_applicable }
    else
      input = { id: this.apinvHeader_id, approvedby: submitform.approvedby.id, payment_instruction: credform?.payment_instruction, is_tds_applicable: credform?.is_tds_applicable }

    this.spinner.show();
    this.service.OverallAPSubmit(input)

      .subscribe(result => {
        this.spinner.hide();

        if (result.status != "success") {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully ECF Created!...")
          this.onSubmit.emit()
          this.submitoverallbtn = true
          this.shareservice.comefrom.next("invoicedetail")
          this.router.navigate(['ECFAP/ecfapsummary'], { queryParams: { comefrom: "invoicedetail" } })
        }
      })
  }

  filterText(ctrl, ctrlname, ind) {
    let text = String(ctrl.value).trim();
    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i)
      let charcode = text.charCodeAt(i)
      if ((charcode < 65 || charcode > 90) && (charcode < 96 || charcode > 122) && (charcode < 48 || charcode > 57) && (charcode != 32)) {
        text = text.replace(char, "");
        i = i - 1
      }
    }
    if (ctrlname == "desc")
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('description').setValue(text)
    else if (ctrlname == "ccbsrem")
      this.ccbsForm.get('ccbsdtl')['controls'][ind].get('remarks').setValue(text)
    else if (ctrlname == "remarks")
      this.SubmitoverallForm.get('remark').setValue(text)
  }


  GstNooo: any
  GSTtext = ""
  supdetDisable = false
  validationGstNo(e) {
    // let gstno = e.target.value;
    let gstno = e;
    if (gstno != '' && gstno.length < 15) {
      this.notification.showError("Please Enter Valid GST No")
      return false;
    }
    if (gstno != '' && gstno.length == 15) {
      this.spinner.show();
      let gst = gstno
      gst = gst.slice(2, -3);
      this.GstNooo = gst;


      // this.service.getBracnhGSTNo(gstno)
      //   .subscribe(res => {
      //     console.log("gstres", res)
      //     let result = res.validation_status
      //     if (result === false) {
      //       // this.notification.showWarning("Please Enter a Valid GST Number")
      //       // this.SupplierDetailForm.controls['suppliergst'].reset();
      //       this.SupplierDetailForm.controls['supplier_name'].reset("");
      //       this.SupplierDetailForm.controls['pincode'].reset("");
      //       this.SupplierDetailForm.controls['address'].reset("");
      this.service.getEmpBanch(gstno)
        .subscribe(res => {
          console.log("empbranhc", res)
          let result = res.data
          if (result.length == 0) {
            this.service.getBracnhGSTNo(gstno)
              .subscribe(res => {
                console.log("gstres", res)
                let result = res.validation_status
                if (result?.errorCode != undefined) {
                  // this.notification.showWarning("Please Enter a Valid GST Number")
                  // this.SupplierDetailForm.controls['suppliergst'].reset();
                  this.GSTtext = ""
                  this.SupplierDetailForm.controls['supplier_name'].reset("");
                  this.SupplierDetailForm.controls['pincode'].reset("");
                  this.SupplierDetailForm.controls['address'].reset("");
                  this.spinner.hide();
                } else {
                  this.notification.showSuccess(" GST Number Validated...")
                  this.GSTtext = "Valid GST"
                  this.SupplierDetailForm.patchValue({
                    supplier_name: result?.tradeNam,
                    pincode: result?.pradr?.addr?.pncd,
                    address: result?.pradr?.addr?.bno + "," + result?.pradr?.addr?.st + "," + result?.pradr?.addr?.loc + "," + result?.pradr?.addr?.stcd
                  });
                  this.spinner.hide();
                }
              },
                error => {
                  this.notification.showWarning("GST validation failure")
                  this.spinner.hide();
                }
              )
          }
          else {
            this.notification.showError("KVB GST Numbers. cannot be used. ")
            this.spinner.hide();
            //   } else {
            //     this.notification.showSuccess(" GST Number Validated...")
            //     this.GSTtext = "Valid GST"
            //     this.SupplierDetailForm.patchValue({
            //       supplier_name: result?.tradeNam,
            //       pincode: result?.pradr?.addr?.pncd,
            //       address: result?.pradr?.addr?.bno + "," + result?.pradr?.addr?.st + "," + result?.pradr?.addr?.loc + "," + result?.pradr?.addr?.stcd
            //     });
            //     this.spinner.hide();
            //   }
            // },
            //   error => {
            //     this.notification.showWarning("GST validation failure")
            //     this.spinner.hide();
            //   }
            // )
          }
        })
    }
  }

  viewtrnlstCount: number
  viewtrnlist: any = [];
  viewtrnHasNext = false
  viewtrnHasPrevious = false
  viewtrnCurrentPage = 1
  viewtrn(page =1)
  {
    this.viewtrnlist=[]
    this.spinner.show()
    this.popupopen1()
    this.name = ''; 
    this.designation = ''; 
    this.branch = ''; 
    this.SummaryApiviewObjNew = {
      method: "get",
      url: this.url + "ecfapserv/view_transaction/" + this.apinvHeader_id,
      params: ""
    }
    this.service.getViewTrans(this.apinvHeader_id, page).subscribe(data=>{
      this.spinner.hide()
      this.viewtrnlist=data['data'];
      this.viewtrnlstCount =data?.count
      let pagination = data['pagination']
      
      
      this.viewtrnCurrentPage = pagination?.index;
      if (this.viewtrnlist.length > 0) {
        this.length_viewtrn =data?.count
        this.viewtrnCurrentPage = pagination.index;
      }
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

  catviewdata: any
  subcatviewdata: any
  glviewdata: any
  getgldata(datas) {

    this.catviewdata = datas?.value?.category_code?.code
    this.subcatviewdata = datas?.value?.subcategory_code?.code
    this.glviewdata = datas?.value?.glno
  }

  glback() {
    this.closeglbutton.nativeElement.click();
  }

  OverallAPFormSubmit() {
    if (this.inveditFlag) {
      this.notification.showError("Please save Invoice Header.")
      return false
    }
    if (this.aptypeid != 4 && this.aptypeid != 1 && this.invdtlsaved == false) {
      this.notification.showError("Please save Invoice Detail.")
      return false
    }
    else if (this.aptypeid == 1 && this.invdtlsaved == false) {
      this.notification.showError("Please save Invoice Detail.")
      return false
    }
    const totalAmountFromForm = String(this.frmInvHdr.get('invoiceamount').value).replace(/,/g, '');
    if (this.aptypeid != 4 && Number(totalAmountFromForm) !== +this.totaltaxable) {
      this.toastr.error('The Invoice Header Taxable Amount And The Total Taxable Amount is Not Equal');
      return false;
    }
    for (let i = 0; i < this.InvoiceDetailForm.value.invoicedtls.length; i++) {
      if (!this.debitSectionSaved[i]) {
        this.notification.showWarning("Please Save Debit (Section - " + (i + 1) + ").")
        return false
      }
    }
    if (this.debitmodified && this.debitsaved == false) {
      this.notification.showError("Please save Debit Details.")
      return false
    }
    if (this.creditsaved == false) {
      this.notification.showError("Please save Credit Details.")
      return false
    }
    if (this.dedupe_flag == false) {
      this.notification.showError("Kindly do Dedupe Check.")
      return false
    }
    let apapprovedata = this.OverallAPForm?.value
    // if(apapprovedata?.remarks == "" || apapprovedata?.remarks == null || apapprovedata?.remarks == undefined){
    //   this.notification.showError("Please Enter Remarks")
    //   return false;
    // }
    console.log("apapprovedata", apapprovedata)
    console.log("apinvHeader_id", this.apinvHeader_id)
    let modify = this.shareservice.apmodification.value
    modify = modify == 'modify'? 'modify':'';
    this.spinner.show()
    this.service.apsubmit(apapprovedata, this.apinvHeader_id,modify).subscribe(result => {
      console.log("apresult", result)
      if (result?.message == "This AP in 'AP BOUNCE' status") {
        this.notification.showError(result?.message)
        this.spinner.hide()
        this.onCancel.emit()
      } else if (result?.status == "success") {
        this.spinner.hide()
        this.notification.showSuccess("Submitted Successfully")
        this.shareservice.apmodification.next(modify)
        this.onCancel.emit()
      } else {
        this.spinner.hide()
        this.notification.showError(result?.message)
        return false
      }
    })
  }



  onDateChange(event: any) {
    const ecfdate = new Date(this.invHdrRes?.ecf_date); // Convert ecfdate to a Date object
    const selectedDate = new Date(event.value); // Set the selected date

    const sixMonthsAgo = new Date(ecfdate.getFullYear(), ecfdate.getMonth() - 6, ecfdate.getDate()); // Calculate the date six months before ecfdate

    // Set the time values to zero (optional if you want to compare dates only)
    selectedDate.setHours(0, 0, 0, 0);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    if (selectedDate < sixMonthsAgo) {
      alert('Invoice Date is greater than six months');
    }
  }

  checkInvID: any
  checkinvdate: any
  checklist: any;
  auditChkSolution: any
  getquestionView() {
    this.checkInvID = this.apinvHeader_id
    this.checkinvdate = this.datepipe.transform(this.invHdrRes.invoicedate, 'yyyy-MM-dd')
    this.service.getBouncedChecklist(this.checkInvID).subscribe(data => {
      this.checklist = data['data'];
      // this.auditChkSolution = this.checklist.map(x => x.solution)
      for (let i = 0; i < this.checklist.length; i++) {
        this.checklist[i]['clk'] = data['data'][i].value.id == 1 ? true : false;;
      }
    })
  }
  getquestion() {
    this.popupopen5();
    this.checkInvID = this.apinvHeader_id
    this.checkinvdate = this.datepipe.transform(this.invHdrRes.invoicedate, 'yyyy-MM-dd')
    this.service.getBouncedChecklist(this.checkInvID).subscribe(data => {
      this.checklist = data['data'];
      // this.auditChkSolution = this.checklist.map(x => x.solution)
      for (let i = 0; i < this.checklist.length; i++) {
        this.checklist[i]['clk'] = data['data'][i].value.id == 1 ? true : false;;
        this.checklist[i]['value'] = data['data'][i].value.id
      }
      console.log('check=', data);
      if (this.checklist == undefined || this.checklist == null || this.checklist?.length == 0) {
        this.service.getAuditChecklist(this.aptypeid).subscribe(data => {
          this.checklist = data['data'];
          // this.auditChkSolution = this.checklist.map(x => x.solution)
          for (let i = 0; i < this.checklist.length; i++) {
            this.checklist[i]['clk'] = false;
            this.checklist[i]['value'] = 2;
          }
          console.log('check=', data);
        })
      }
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
  dedupe_flag = false
  presentpageDedExact =1
 presentpageDedWithoutSup =1
 presentpageDedWithoutInvAmt =1
 presentpageDedWithoutInvNo =1
 presentpageDedWithoutDate =1
 
 dedExactCount =0
 dedWithoutSupCount =0
 dedWithoutInvAmtCount =0
 dedWithoutInvNoCount =0
 dedWithoutDateCount =0
 pageSizeOptions = [5, 10, 25];
 showFirstLastButtons:boolean=true;
  getdedup() {
    this.popupopen4();
    this.dedupe_flag = true
    this.checkInvID = this.invHdrRes.id
    // this.getDedupeExact(1) 
    this.exact_match()
    // this.getDedupeWithoutSupp(1)
    this.without_supp()
    // this.getDedupeWithoutInvAmt(1)
    this.without_inv_amnt()
    // this.getDedupeWithoutInvNo(1)
    this.without_inv_no()
    // this.getDedupeWithoutInvDate(1)
    this.without_inv_date()
    
  }
  getDedupeExact(page){  
    this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[0], page)
    .subscribe(result => {
      this.exactList = result['data']
      console.log("exactList",this.exactList)
  
      let dataPagination = result['pagination'];
      if (this.exactList.length >= 0) {
        this.length_DedExact =dataPagination?.count
        this.presentpageDedExact = dataPagination.index;
      } 
      if(this.exactList.length ==1)
        this.pageIndexDedExact =0
    },error=>{
      this.errorHandler.handleError(error);
            this.spinner.hide();
    }            
    )
  }
  length_DedExact = 0;
  pageSize_DedExact = 10
  pageIndexDedExact=0
  handleDedExact(event: PageEvent) {
    this.length_DedExact = event.length;
    this.pageSize_DedExact = event.pageSize;
    this.pageIndexDedExact = event.pageIndex;
    this.presentpageDedExact=event.pageIndex+1;
    this.getDedupeExact(this.presentpageDedExact);  
  }

  getDedupeWithoutSupp(page){  
    this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[1], page)
    .subscribe(result => {
      this.withoutSuppList = result['data']
      console.log("withoutSuppList",this.withoutSuppList)
  
      let dataPagination = result['pagination'];
      if (this.withoutSuppList.length >= 0) {
        this.length_DedWithoutSupp =dataPagination?.count
        this.presentpageDedWithoutSup = dataPagination.index;
      } 
      if(this.withoutSuppList.length ==1)
        this.pageIndexDedWithoutSupp =0
    },error=>{
      this.errorHandler.handleError(error);
            this.spinner.hide();
    }            
    )
  }

  length_DedWithoutSupp = 0;
pageSize_DedWithoutSupp = 10
pageIndexDedWithoutSupp=0
handleDedWithoutSupp(event: PageEvent) {
  this.length_DedWithoutSupp = event.length;
  this.pageSize_DedWithoutSupp = event.pageSize;
  this.pageIndexDedWithoutSupp = event.pageIndex;
  this.presentpageDedWithoutSup=event.pageIndex+1;
  this.getDedupeWithoutSupp(this.presentpageDedWithoutSup);  
}

getDedupeWithoutInvAmt(page){  
  this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[2], page)
  .subscribe(result => {
    this.withoutInvAmtList = result['data']
    console.log("withoutInvAmtList",this.withoutInvAmtList)

    let dataPagination = result['pagination'];
    if (this.withoutInvAmtList.length >= 0) {
      this.length_DedWithoutInvAmt =dataPagination?.count
      this.presentpageDedWithoutInvAmt = dataPagination.index;
    } 
    if(this.withoutInvAmtList.length ==1)
      this.pageIndexDedWithoutInvAmt =0
  },error=>{
    this.errorHandler.handleError(error);
          this.spinner.hide();
  }            
  )
}

length_DedWithoutInvAmt = 0;
pageSize_DedWithoutInvAmt = 10
pageIndexDedWithoutInvAmt=0
handleDedWithoutInvAmt(event: PageEvent) {
  this.length_DedWithoutInvAmt = event.length;
  this.pageSize_DedWithoutInvAmt = event.pageSize;
  this.pageIndexDedWithoutInvAmt = event.pageIndex;
  this.presentpageDedWithoutInvAmt=event.pageIndex+1;
  this.getDedupeWithoutInvAmt(this.presentpageDedWithoutInvAmt);  
}


getDedupeWithoutInvNo(page){  
  this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[3], page)
  .subscribe(result => {
    this.withoutInvNoList = result['data']
    console.log("withoutInvNoList",this.withoutInvNoList)

    let dataPagination = result['pagination'];
    if (this.withoutInvNoList.length >= 0) {
      this.length_DedWithoutInvNo =dataPagination?.count
      this.presentpageDedWithoutInvNo = dataPagination.index;
    } 
    if(this.withoutInvNoList.length ==1)
      this.pageIndexDedWithoutInvNo =0
  },error=>{
    this.errorHandler.handleError(error);
          this.spinner.hide();
  }            
  )
}

length_DedWithoutInvNo = 0;
pageSize_DedWithoutInvNo = 10
pageIndexDedWithoutInvNo=0
handleDedWithoutInvNo(event: PageEvent) {
  this.length_DedWithoutInvNo = event.length;
  this.pageSize_DedWithoutInvNo = event.pageSize;
  this.pageIndexDedWithoutInvNo = event.pageIndex;
  this.presentpageDedWithoutInvNo=event.pageIndex+1;
  this.getDedupeWithoutInvNo(this.presentpageDedWithoutInvNo);  
}

getDedupeWithoutInvDate(page){  
  this.service.getInwDedupeChk(this.checkInvID,this.dedupeChkType[4], page)
  .subscribe(result => {
    this.withoutInvDtList = result['data']
    console.log("withoutInvDtList",this.withoutInvDtList)

    let dataPagination = result['pagination'];
    if (this.withoutInvDtList.length >= 0) {
      this.length_DedWithoutInvDate =dataPagination?.count
      this.presentpageDedWithoutDate = dataPagination.index;
    } 
    if(this.withoutInvDtList.length ==1)
      this.pageIndexDedWithoutInvDate =0
  },error=>{
    this.errorHandler.handleError(error);
          this.spinner.hide();
  }            
  )
}

length_DedWithoutInvDate = 0;
pageSize_DedWithoutInvDate = 10
pageIndexDedWithoutInvDate=0
handleDedWithoutInvDate(event: PageEvent) {
  this.length_DedWithoutInvDate = event.length;
  this.pageSize_DedWithoutInvDate = event.pageSize;
  this.pageIndexDedWithoutInvDate = event.pageIndex;
  this.presentpageDedWithoutDate=event.pageIndex+1;
  this.getDedupeWithoutInvDate(this.presentpageDedWithoutDate);  
}

  hdrSelectable = [false, false, false, false, false]
  enableHdrSelect(i) {

  }

  auditcheck: any = [];

  submitted() {
    this.auditcheck = []
    let chklstlen = this.checklist.length
    let napcount = this.checklist.filter(x => x.value == 3).length
    if (chklstlen == napcount) {
      this.notification.showError("You have selected all the checklists as 'NA'")
      return false
    }
    this.spinner.show()
    for (let i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i]['clk']) {
        let dear: any = {
          'ecfauditchecklist_id': this.checklist[i]['id'],
          'apinvoiceheader_id': this.checkInvID,
          'value': this.checklist[i]['value']
        };
        this.auditcheck.push(dear)
      }
    //   let data={
    // "status_id":"11",
    // "invoicedate":this.checkinvdate,
    // "remarks":this.rem.value.solution
    // };
    // this.bouio.push(data)
    } let obj = {
      'auditchecklist': this.auditcheck
    }
    console.log('obj', obj);

    this.service.audiokservie(obj).subscribe(result => {
      console.log("result", result)
      this.spinner.hide()
      if (result.status != "Success") {
        this.notification.showError(result?.message)
        return false
      }
      else {
        this.changesInAP = true
        this.notification.showSuccess("Saved Successfully!")
      }
    },
      (error) => {
        alert(error.status + error.statusText);
      }
    )
    this.auditclose.nativeElement.click();
  }

  notokflag = false
  chklstValid = false
  ok(i: any, dt) {
    this.notokflag = false
    this.checklist[i]['clk'] = true
    this.checklist[i]['value'] = 1
    this.Notoklist = []
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
      if (this.checklist[i]['value'] == 2)
        this.Notoklist.push(this.checklist[i])

    }
    if (this.notokflag == true)
      this.chklstValid = false
    else
      this.chklstValid = true

  }

  Notoklist = []
  notok(i: any, dt) {
    this.notokflag = false
    this.checklist[i]['clk'] = false
    this.checklist[i]['value'] = 2
    this.Notoklist = []

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
      if (this.checklist[i]['value'] == 2)
        this.Notoklist.push(this.checklist[i])

    }
    if (this.notokflag == true)
      this.chklstValid = false
    else
      this.chklstValid = true
  }
  nap(i: any, dt) {
    this.notokflag = false
    this.checklist[i]['clk'] = true
    this.checklist[i]['value'] = 3
    this.Notoklist = []
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
    for (let i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i]['clk'] == false) {
        this.notokflag = true
      }

      if (this.checklist[i]['value'] == 2)
        this.Notoklist.push(this.checklist[i])

    }
    if (this.notokflag == true)
      this.chklstValid = false
    else
      this.chklstValid = true
  }

  bouio: any
  bounce() {
    // this.spinner.show()
    this.cli = true;
    this.auditcheck = []
    this.bouio = []
    if (this.rem.value == '' || this.rem.value == undefined || this.rem.value == null) {
      this.notification.showError('Please Choose Solution.')
      return false
    }
    this.spinner.show()
    for (let i = 0; i < this.checklist.length; i++) {
      let dear: any = {
        "ecfauditchecklist_id": this.checklist[i].id,
        "apinvoiceheader_id": this.checkInvID,
        "value": this.checklist[i]['value']
      };
      this.auditcheck.push(dear)
      // if (this.auditcheck[i].value == 2) {
      //   let data = {
      //     "status_id": "11",
      //     "invoicedate": this.checkinvdate,
      //     "remarks": this.checklist[i].solution
      //   };
      //   this.bouio.push(data)
      // }
    }
       this.remark=this.rem.value;
       if(this.rem.value != 'other' || this.rem.value !=  'Other'|| this.rem.value !=  'OTHER'){
         let dd={
           "status_id":"11",
           "invoicedate":this.checkinvdate,
           "remarks":this.remark.toString()
         };
         this.bouio.push(dd)
       }

     this.purpose=this.purpose.value
     if(this.rem.value === 'other' || this.rem.value === 'Other'|| this.rem.value === 'OTHER')
     {
      this.bouio =[]
       let dd={
         "status_id":"11",
         "invoicedate":this.checkinvdate,
         "remarks":this.purpose
     };
     this.bouio.push(dd)
     }
    let obj = {
      'auditchecklist': this.auditcheck
    }
    this.service.audiokservie(obj).subscribe(data => {
      console.log(data)
      if (data['status'] == "Success") {
        this.service.bounce(this.checkInvID, this.bouio).subscribe(datas => {
          console.log(datas)
          if (datas[0]?.id) {
            console.log("check bounce", obj)
            this.onCancel.emit()
            this.auditclose.nativeElement.click();
            this.spinner.hide()
            this.notification.showSuccess("Data Bounced");
            // this.onCancel.emit()
          }
          else {
            this.spinner.hide()
            this.notification.showError("Not able to Bounce")
          }
        }
        )
      }
      else {
        this.spinner.hide()
        this.notification.showError("Not able to Bounce");
      }
    }
    )
  }


  disables() {
    for (let i = 0; i < this.auditcheck.length; i++) {
      if (this.auditcheck[i].value == 2) {
        return true;

      }
    }
  }

  InvoiceFormSubmit() {
    let data = {
      "id": this.apinvHeader_id
    }
    const totalAmountFromForm = String(this.frmInvHdr.get('invoiceamount').value).replace(/,/g, '');

    if (this.aptypeid != 4 && this.aptypeid != 1 && this.invdtlsaved == false) {
      this.notification.showError("Please save Invoice Detail.")
      return false
    }
    if (this.aptypeid == 4 && this.debitsaved == false) {
      this.notification.showError("Please save Debit Detail.")
      return false
    }
    else if (this.aptypeid == 1 && this.invdtlsaved == false) {
      this.notification.showError("Please save Invoice Detail.")
      return false
    }
    for (let i = 0; i < this.InvoiceDetailForm.value.invoicedtls.length; i++) {
      if (!this.debitSectionSaved[i]) {
        this.notification.showWarning("Please Save Debit (Section - " + (i + 1) + ").")
        return false
      }
    }
    if (!this.creditsaved) {
      this.notification.showError("Please save Credit.")
      return false
    }
    if (this.aptypeid != 4 && Number(totalAmountFromForm) !== +this.totaltaxable) {
      this.toastr.error('The Invoice Header Taxable Amount And The Total Taxable Amount is Not Equal');
      return false;
    }
    this.spinner.show()
    this.service.InvoiceAPSubmit(data).subscribe(result => {
      if (result?.status == "success") {
        this.notification.showSuccess("Success")
        this.shareservice.editkey.next("edit")
        this.shareservice.comefrom.next("invoicedetail")
        this.shareservice.modificationFlag.next('')
        this.shareservice.ecfheader.next(this.ecfheaderid)
        this.shareservice.ecfheaderedit.next(this.ecfhdrid)
        this.spinner.hide()
        this.onCancel.emit()
      } else {
        this.notification.showError(result?.description)
        this.spinner.hide()
        return false;
      }
    })
  }

  showdtledit() {
    this.invdtlsaved = false
    this.modificationFlag = 'edit'
    // if (this.aptypeid == 1) {
    //   this.selectionArray = []
    //   this.showPOdiv = true
    //   let datas = this.InvoiceDetailForm.get('invoicedtls') as FormArray
    //   datas.clear()
    //   this.getinvoicedtlrecords()
    // }

  }
  showcreditedit() {
    this.creditsaved = false
    this.modificationFlag = 'edit'
    // this.tdsapplicable.disabled = false;
  }
  showdebitedit() {
    this.debitSectionSaved[this.invdtladdonIndex] = false
    this.debitsaved = false
    this.modificationFlag = 'edit'
  }
  showinvhededit() {
    this.modificationFlag = 'edit';
    this.invhedsaved = false
    this.inveditFlag = !this.inveditFlag
    // this.editorDisabled = !this.editorDisabled
    this.disableinvhdrsave = false
  }
  onselectionchange(event) {
    console.log("this.frmInvHdr.value--------", this.frmInvHdr.value)

    if (event.checked == true) {
      this.gstchecked = true

    }
    else {
      this.gstchecked = false
    }
  }

  tdsChoosed = false
  gettdschoosen(tdsdata) {
    console.log("tdsdata", tdsdata)
    if (this.aptypeid != 13) {
      if (tdsdata?.id == 0) {
        const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
        let chktds = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')
        if (chktds.length > 0)
          return false
        let chkadv_or_crn = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM006' || x.paymode_id?.code == 'PM011')
        if (chkadv_or_crn.length > 0) {
          this.creditdetForm.patchValue({
            is_tds_applicable: 1
          })
          this.toastr.error("Kindly select TDS before the Advance or CRN Liquidation.")
          return false
        }
        this.tdsChoosed = true
        this.addcreditSection(0, 'PM007')

        // for (let i = 1; i < this.InvoiceDetailForm.value.creditdtl.length; i++) {
        //   this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('paymode_id').setValue(datas[0])
        // }

      }
      else {
        this.tdsChoosed = false
        this.showthreshold = false
        const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
        let tdslines = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')
        if (tdslines.length > 0) {
          let idfiltered = tdslines.filter(x => x.id != undefined)
          let ids = idfiltered.map(x => x.id)
          for (let n = 0; n < ids.length; n++) {
            this.spinner.show();
            this.service.credDebitDel(ids[n])
              .subscribe(result => {
                this.spinner.hide();

                if (result.status == "success") {
                  this.taxableCalc = false
                }
                else {
                  this.notification.showError(result.description)
                }
                if (n == ids.length - 1)
                  this.spinner.hide()
              })
          }
        }
        do {
          let creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
          for (let i = 0; i < creditdtlsdatas.length; i++) {
            creditdtlsdatas[i].index = i
          }
          let tdsline = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')[0]
          let tdslineind
          if (tdsline == undefined)
            break
          else
            tdslineind = tdsline?.index
          this.removecreditSection(tdslineind, 'TDS', 0)
        } while (true)
        this.amountReduction()
      }
    }
  }

  addCRNline(){
    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

    for (let i in creditdtlsdatas) {
      if (creditdtlsdatas[i].paymode_id?.code === 'PM007' && (creditdtlsdatas[i].suppliertaxtype === '' ||
        creditdtlsdatas[i].suppliertaxtype === null || creditdtlsdatas[i].suppliertaxtype === undefined)) {
        this.toastr.error('Please Choose Taxtype')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      let amt = parseFloat(String(creditdtlsdatas[i].amount).replace(/,/g, '')) || 0;
      if (creditdtlsdatas[i].paymode_id?.code === 'PM005' && amt === 0) {
        this.toastr.error('The Invoice Amount is Fully Liquatated!...')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
    }

    if (this.crndata?.length > 0) {
      this.showgrnpopup = true
      if (this.showgrnpopup == true) {
        this.showppxmodal = false;
        this.crnliqpopup()
        this.addcreditSection(0,'PM009')
        this.getcrndata(this.crn_id,1, 0)
      }
    }
    else {
      this.showgrnpopup = false
      this.toastr.error("No Advance available for Liquidation.")
    }
  }
  addPPXline() {
    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

    for (let i in creditdtlsdatas) {
      if (creditdtlsdatas[i].paymode_id?.code === 'PM007' && (creditdtlsdatas[i].suppliertaxtype === '' ||
        creditdtlsdatas[i].suppliertaxtype === null || creditdtlsdatas[i].suppliertaxtype === undefined)) {
        this.toastr.error('Please Choose Taxtype')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
      let amt = parseFloat(String(creditdtlsdatas[i].amount).replace(/,/g, '')) || 0;
      if (creditdtlsdatas[i].paymode_id?.code === 'PM005' && amt === 0) {
        this.toastr.error('The Invoice Amount is Fully Liquatated!...')
        this.creditsaved = false
        this.spinner.hide()
        return false
      }
    }
    // if(this.movedata == 'ECF' && this.Liq_data.micro_data.length > 0){
    //    this.addcreditSection(0,'PM006')
    // }

    if (this.ppxdata?.length > 0) {
      // this.getPpxrecords(1)
      this.showppxmodal = true
      if (this.showppxmodal == true) {
        this.showgrnpopup == false
        this.popupopen15()
        this.addcreditSection(0,'PM006')
        this.getppxdata(this.ppx_id,1, this.liqflag)
      }
    }
    else {
      this.showppxmodal = false
      this.toastr.error("No Advance available for Liquidation.")
    }
  }
  getecftype() {
    // this.spinner.show()
    this.service.getecftype()
      .subscribe(result => {
        // this.spinner.hide()
        if (result) {
          let TypeList = result["data"]
          this.TypeList = TypeList.filter(a => a.id == 1 ||a.id == 2 || a.id == 3 || a.id == 4 || a.id == 7 || a.id == 13 || a.id == 14 || a.id == 17 || a.id == 19 || a.id == 20 || a.id == 18 || a.id == 9 || a.id == 8 || a.id == 11 || a.id == 15)
          this.ecf_field = {
            label: "ECF Type",
            fronentdata: true,
            data: this.TypeList,
            displaykey: "text",
            // Outputkey: "id",
            valuekey: "id",
            formcontrolname: "ecftype",
            id: "invoice-detail-0028",
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.spinner.hide();
      })
  }
  getcommoditydd() {
    let commoditykeyvalue: String = "";
    this.getcommodity();
    this.ecfheaderForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getcommodityscroll(value, 1)
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
  getcommodity() {
    let data = { "ecf_amount": this.invHdrRes?.totalamount, "ecf_raiserid": this.invHdrRes?.approver_id }
    this.service.geAPcommodity(data)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.commodityList = datas;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.spinner.hide();
      })
  }
  public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.name : undefined;
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
                this.service.getcommodityscroll(this.commodityInput.nativeElement.value, this.currentpage + 1)
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
  filefun() {
    let data = this.invHdrRes
    let arr = new FormArray([])
    let dataForfILE = data.file_data
    this.darefile = data["file_data"]
    for (let file of this.darefile){
      this.ecffile.push({ file_name: file.file_name, document_type:file.document_type   }) 
    }
    this.fullfile = [...this.ecffile, ...this.grnfile]
console.log("this.fullfile", this.fullfile)
    console.log("this.ecffile", this.ecffile)
    console.log("file_data=====>", data)
    console.log("file_data1=====>", dataForfILE)
    if (data.file_data == "" || data.file_data == null || data.file_data == undefined) {
      dataForfILE = []
    } else {
      for (let file of dataForfILE) {
        let file_id: FormControl = new FormControl('');
        let file_name: FormControl = new FormControl('');
        let document_type: FormControl = new FormControl('');
        let file_module: FormControl = new FormControl('');
        file_id.setValue(file.file_id);
        file_name.setValue(file.file_name);
        document_type.setValue(file.document_type);
        file_module.setValue(file?.file_reftype?.text)
        arr.push(new FormGroup({
          file_id: file_id,
          file_name: file_name,
          document_type: document_type,
          file_module: file_module
        }))

      }

    }
    this.attachedFile = arr;
    this.SummaryApipreviouslyAttechedFilesObjNew = {
      FeSummary: true,
      data: this.fullfile
    }
    this.packageattacheFile = this.fullfile

    console.log("this.attttttttt=======>", this.packageattacheFile)

    // this.preattachfile_summary()
  }

  valid_arr: Array<any> = [];
  fileArray_n: Array<any> = [];
  file_process_data: any = {};
  file_process_data2: any = {};
  //server side file upload
  getFileDetails(e, filetype) {
    this.valid_arr = []
    console.log('befor   this.file_process_data2------------->>>>>>>>>>>', this.file_process_data2)

    for (var i = 0; i < e.target.files.length; i++) {
      this.valid_arr.push(e.target.files[i]);
    }
    if (this.file_process_data2[filetype] == undefined) {
      this.file_process_data2[filetype] = this.valid_arr;
    }
    else if (this.file_process_data2[filetype] != undefined) {
      if (this.file_process_data2[filetype].length == 0) {
        this.file_process_data2[filetype] = this.valid_arr;
      }
      else {
        let Files = this.file_process_data2[filetype]
        for (let file of this.valid_arr) {
          Files.push(file)
        }
        this.file_process_data2[filetype] = Files;
      }
    }
    for (let i = 0; i < this.uploadFileTypes.length; i++) {
      if (this.file_process_data2[this.uploadFileTypes[i]]?.length == 0)
        delete this.file_process_data2[this.uploadFileTypes[i]]
    }
    // 🔑 Reset input so re-upload works
    e.target.value = '';
    console.log('this.file_process_data2------------->>>>>>>>>>>', this.file_process_data2)
  }

  // getFileDetails( e, filetype) {
  //   this.popupopen();
  //   // console.log("this.frmInvHdr.value-----", this.frmInvHdr.value)

  //   // let identity: any = "file" + index;

  //   // let data = this.frmInvHdr.value
  //   this.valid_arr =[]
  //   console.log('befor   this.file_process_data------------->>>>>>>>>>>' ,this.file_process_data)
  //   let data
  //   data = this.frmInvHdr.value

  //   for (var i = 0; i < e.target.files.length; i++) {
  //     data?.filevalue?.push(e?.target?.files[i])
  //     data?.filedataas?.push(e?.target?.files[i])
  //     this.valid_arr.push(e.target.files[i]);
  //   }
  //   // let dg_n: any = {};
  //   // dg_n["file" + index] = this.valid_arr
  //   // this.file_process_data["file" + index] = this.valid_arr;
  //   // //this.fileArray_n.push(dg_n);
  //   // console.log(this.fileArray_n);
  //   if (e.target.files.length > 0) {
  //     // if (data?.file_key.length < 1) {
  //     //   data?.file_key?.push("file" + index);
  //     // }
  //     if( data?.file_key.length < 1) {
  //       data?.file_key?.push(this.uploadFileTypes[0]);
  //       data?.file_key?.push(this.uploadFileTypes[1]);
  //       data?.file_key?.push(this.uploadFileTypes[2]);
  //       data?.file_key?.push(this.uploadFileTypes[3]);
  //     } 
  //   }
  //   if(this.file_process_data[filetype] == undefined){
  //     this.file_process_data[filetype]=this.valid_arr;
  //   }
  //   else if(this.file_process_data[filetype] != undefined){
  //     if(this.file_process_data[filetype].length ==0){
  //       this.file_process_data[filetype]=this.valid_arr;
  //     }
  //     else{
  //       let Files = this.file_process_data[filetype]
  //       for(let file of this.valid_arr){
  //         Files.push(file)
  //       }
  //       this.file_process_data[filetype]=Files;
  //     }
  //   }
  //   console.log('this.file_process_data------------->>>>>>>>>>>' ,this.file_process_data)

  // }

  uploadSubmit() {
    let data
    data = this.frmInvHdr.value;
    for (var i = 0; i < this.valid_arr.length; i++) {
      data?.filevalue?.push(this.valid_arr[i])
      data?.filedataas?.push(this.valid_arr[i])
    }

    if (this.valid_arr.length > 0) {
      if (data?.file_key.length < 1) {
        data?.file_key?.push(this.uploadFileTypes[0]);
        data?.file_key?.push(this.uploadFileTypes[1]);
        data?.file_key?.push(this.uploadFileTypes[2]);
        data?.file_key?.push(this.uploadFileTypes[3]);
      }
    }
    this.file_process_data = this.file_process_data2
    this.file_process_data2 = {}
    this.uploadclose.nativeElement.click()
    this.closedbuttons.nativeElement.click()
    this.fileUploaded = this.fileUploadChk()
    console.log('this.file_process_data------------->>>>>>>>>>>', this.file_process_data)

  }

  fileuploadSubmit() {
    let data
    data = this.frmInvHdr.value;
    for (var i = 0; i < this.valid_arr.length; i++) {
      data?.filevalue?.push(this.valid_arr[i])
      data?.filedataas?.push(this.valid_arr[i])
    }

    if (this.valid_arr.length > 0) {
      if (data?.file_key.length < 1) {
        data?.file_key?.push(this.uploadFileTypes[0]);
        data?.file_key?.push(this.uploadFileTypes[1]);
        data?.file_key?.push(this.uploadFileTypes[2]);
        data?.file_key?.push(this.uploadFileTypes[3]);
      }
    }
    this.file_process_data = this.file_process_data2
    this.file_process_data2 = {}
    // this.uploadclose.nativeElement.click()
    this.fileclosedbuttons.nativeElement.click()

    console.log('this.file_process_data------------->>>>>>>>>>>', this.file_process_data)

  }

  uploadback() {
    this.uploadPopShow = false
    this.file_process_data2 = {}
    this.uploadclose.nativeElement.click()
  }

  fileuploadback() {
    this.uploadPopShow = false
    this.file_process_data2 = {}
    // this.uploadclose.nativeElement.click()
    this.fileclosedbuttons.nativeElement.click()
  }

  deletefileUpload(invdata, i, type) {
    // let filesValue = this.fileInput.toArray()
    // let filesValueLength = filesValue?.length
    // for (let i = 0; i < filesValueLength; i++) {
    //   filesValue[i].nativeElement.value = ""
    // }
    // let filedata = invdata.filevalue
    // let file_key = invdata.file_key;
    // // this.fileInput:any=this.fileInput.toArray();
    // // this.fileInput.splice(i,1);
    // let index_id: any = "file0"
    // this.file_process_data[index_id].splice(i, 1);
    // this.fileArray_n.splice(i, 1);
    // console.log(this.fileArray_n);
    // filedata.splice(i, 1)
    // file_key.splice(i, 1)
    let filedata = invdata.filevalue
    let filedatas = invdata.filedataas
    let file_key = invdata.file_key;
    // this.fileInput:any=this.fileInput.toArray();
    // this.fileInput.splice(i,1);
    this.file_process_data[type].splice(i, 1);
    filedata.splice(i, 1)
    filedatas.splice(i, 1)

    if ((this.file_process_data[this.uploadFileTypes[0]]?.length == 0 || this.file_process_data[this.uploadFileTypes[0]]?.length == undefined)
      && (this.file_process_data[this.uploadFileTypes[1]]?.length == 0 || this.file_process_data[this.uploadFileTypes[1]]?.length == undefined)
      && (this.file_process_data[this.uploadFileTypes[2]]?.length == 0 || this.file_process_data[this.uploadFileTypes[2]]?.length == undefined)
      && (this.file_process_data[this.uploadFileTypes[3]]?.length == 0 || this.file_process_data[this.uploadFileTypes[3]]?.length == undefined)) {
      this.fileInput.nativeElement.value = ""
      // file_key =[]
      this.frmInvHdr.controls['file_key'].setValue([])
    }
    console.log('this.file_process_data------------->>>>>>>>>>>', this.file_process_data)
    this.fileUploaded = this.fileUploadChk()
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

  // filedatas: any
  // fileindex: any
  // getfiledetails() {
  //   console.log("this.frmInvHdr.value-----",this.frmInvHdr.value)

  //   console.log("file_process_data", this.file_process_data)
  //   this.filedatas = this.frmInvHdr.value.filedataas.value
  //   console.log("this.filedatas", this.filedatas)

  // }
  filedatas: any
  getfiledetails() {
    this.popupopen()
    this.filedatas = this.frmInvHdr.value['filekey']
  }

  notespopup(){
    this.popupopen10();
  }

  fileback() {
    this.closedbuttons.nativeElement.click();
  }
  filePOback(){
    this.closedPobuttons.nativeElement.click();
  }
  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
  pdfurl: any
  filepreview(files) {
    this.popupopen9();
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
  getfiles(data) {
    this.spinner.show()
    this.service.filesdownload(data.file_id)
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        this.spinner.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.spinner.hide();
        }
      )
  }
  fileDeletes(data, index: number, attach) {

    let file_id = data.file_id
    let file_name = data.file_name
    let file_module = data.file_reftype.text

    if (file_module != 'ECF MAKER') {
      this.service.deletefile(file_id)
        .subscribe(result => {
          if (result?.status == 'success') {
            // this.fileList.splice(index, 1);
            this.frmInvHdr.value.filedataas.splice(index, 1)
            this.frmInvHdr.value.filekey.splice(index, 1)
            this.notification.showSuccess("Deleted....")
            // this.closedbuttons.nativeElement.click();
          } else {
            this.notification.showError(result?.description)
            this.closedbuttons.nativeElement.click();
            return false
          }
        })
    }
    else {
      this.notification.showWarning("You Cannot able to delete ECF Level attached file")
    }
  }


  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  jpgUrlsAPI: any
  data1(datas) {
    let id = datas?.file_id
    let filename = datas?.file_name
    let stringValue = filename.split('.')
    let extension = stringValue[stringValue.length - 1]
    this.showimageHeaderAPI = false
    this.showimagepdf = false

    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token

    if (extension === "png" || extension === "jpeg" || extension === "jpg" ||
      extension === "PNG" || extension === "JPEG" || extension === "JPG") {

      this.jpgUrlsAPI = window.open(this.imageUrl + "ecfapserv/ecffile/" + id + "?token=" + token, '_blank');

    }
    else if (extension === "pdf" || extension === "PDF") {
      // this.showimagepdf = true
      // this.showimageHeaderAPI = false
      this.service.downloadfile1(id)
      // .subscribe((data) => {
      //   let dataType = data.type;
      //   let binaryData = [];
      //   binaryData.push(data);
      //   let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      //   window.open(downloadLink, "_blank");
      // }, (error) => {
      //   this.errorHandler.handleError(error);
      //   this.showimagepdf = false
      //   this.showimageHeaderAPI = false
      //   this.SpinnerService.hide();
      // })
    }
    else {
      this.getfiles(datas)
    }
  }


  taxableAmount(e) {
    if (this.inveditFlag) {
      console.log("e.target.value", e)
      let invamount = Number(e)
      let totamount = Number(this.frmInvHdr.value.totalamount)
      console.log("invamount", invamount)
      console.log("totamount", totamount)
      if (invamount > totamount) {
        this.notification.showWarning("Taxable Amount should not be greater than Invoice Amount")
        this.frmInvHdr.get('invoiceamount').setValue(0)
        return false
      }
      if (this.frmInvHdr.value.invoicegst == true && invamount == totamount) {
        this.notification.showWarning("Invoice Amount and Taxable Amount Should not be same for GST Applicable Yes")
        this.frmInvHdr.get('invoiceamount').setValue(0)
        return false
      }
    }
  }

  taxableamount1(e) {
    if (this.inveditFlag) {
      let invamount = Number(e.target.value)
      let totamount = Number(this.frmInvHdr.value.totalamount)
      if (this.frmInvHdr.value.invoicegst == false && invamount != totamount) {
        this.notification.showWarning("Invoice amount and Taxable amount should be same ,if GST is not applicable")
        this.frmInvHdr.get('invoiceamount').setValue(0)
        return false
      }
    }

  }

  hdrdata: any = []
  formData: FormData = new FormData();
  SubmitInvHdr() {
    console.log("this.frmInvHdr.value", this.frmInvHdr.value)
    this.disableinvhdrsave = true
    const invoiceheaderdata = this.frmInvHdr.value
    invoiceheaderdata.invoiceamount = String(invoiceheaderdata.invoiceamount).replace(/,/g, '');
    invoiceheaderdata.totalamount = String(invoiceheaderdata.totalamount).replace(/,/g, '');
    if (this.PCAyesno == 1 && (invoiceheaderdata?.pca_no == '' || invoiceheaderdata?.pca_no == null || invoiceheaderdata?.pca_no == undefined)) {
      this.toastr.error('Please Choose PCA No.');
      this.disableinvhdrsave = false
      return false;
    }
    if (this.PCAyesno == 1 && (+invoiceheaderdata?.totalamount > +this.PCA_bal_amount)) {
      this.toastr.error('Invoice Header amount should not exceed PCA Balance Amount.');
      this.disableinvhdrsave = false
      return false;
    }
    if (+invoiceheaderdata.totalamount <= 0) {
      this.notification.showWarning("Invoice Amount should be Greater than Zero")
      this.disableinvhdrsave = false
      return false
    } if (+invoiceheaderdata.invoiceamount <= 0) {
      this.notification.showWarning("Taxable Amount should be Greater than Zero")
      this.disableinvhdrsave = false
      return false
    }
    if (+invoiceheaderdata.invoiceamount > +invoiceheaderdata.totalamount) {
      this.notification.showWarning("Taxable Amount should not be greater than Invoice Amount")
      this.frmInvHdr.get('invoiceamount').setValue(0)
      this.disableinvhdrsave = false
      return false
    }
    if (this.frmInvHdr.value.invoicegst == true && +invoiceheaderdata.invoiceamount == +invoiceheaderdata.totalamount) {
      this.notification.showWarning("Invoice Amount and Taxable Amount Should not be same for GST Applicable Yes")
      this.frmInvHdr.get('invoiceamount').setValue(0)
      this.disableinvhdrsave = false
      return false
    }
    if (this.frmInvHdr.value.invoicegst == false && +invoiceheaderdata.invoiceamount != +invoiceheaderdata.totalamount) {
      this.notification.showWarning("Invoice amount and Taxable amount should be same ,if GST is not applicable")
      this.frmInvHdr.get('invoiceamount').setValue(0)
      this.disableinvhdrsave = false
      return false
    }
    if (this.modificationFlag == "modification") {
      invoiceheaderdata.edit_flag = 1
    } else if (this.modificationFlag == "edit") {
      invoiceheaderdata.edit_flag = 0
    }
    invoiceheaderdata.module_type = 2
    this.formData = new FormData();

    // let keyvalue = "file0";
    // this.formData.delete(keyvalue);
    // let pairvalue = this.file_process_data[keyvalue];
    for (let type of this.uploadFileTypes) {
      this.formData.delete(type);
      let pairvalue = this.file_process_data[type];
      if (pairvalue != undefined && pairvalue != "") {
        for (let fileindex in pairvalue) {
          //this.formData.append(keyvalue, pairvalue[fileindex])
          // this.formData.append(keyvalue, this.file_process_data[keyvalue][fileindex])
          this.formData.append(type, this.file_process_data[type][fileindex])
        }
      }
    }

    delete invoiceheaderdata.rsrCode
    delete invoiceheaderdata.rsrEmp
    delete invoiceheaderdata.rsrBr
    delete invoiceheaderdata.physical_verif
    delete invoiceheaderdata.ecftype
    delete invoiceheaderdata.supCode
    delete invoiceheaderdata.rsrCode
    delete invoiceheaderdata.branchGST
    delete invoiceheaderdata.taxableAmt
    // delete invoiceheaderdata.mep_no
    delete invoiceheaderdata.invtotalamt
    if(this.aptypeid ==7){
      invoiceheaderdata.refinv_crno = this.invHdrRes?.refinv_crno
    }
    if (this.aptypeid != 2 && this.aptypeid != 1) {
      delete invoiceheaderdata.is_pca
      delete invoiceheaderdata.pca_no
      delete invoiceheaderdata.pca_name
      delete invoiceheaderdata.pca_bal_amt
    }
    else {
      invoiceheaderdata.pca_no = invoiceheaderdata.pca_no?.pca_no
      invoiceheaderdata.pca_name = this.PCA_Det[0]?.pca_name
      invoiceheaderdata.pca_bal_amt = this.PCA_bal_amount
    }
    let gst = invoiceheaderdata.invoicegst == true ? 'Y' : 'N'
    invoiceheaderdata.invoicegst = gst
    invoiceheaderdata.place_of_supply = invoiceheaderdata.place_of_supply.code
    invoiceheaderdata.branchdetails_id = invoiceheaderdata.branchdetails_id.id
    invoiceheaderdata.commodity_id = invoiceheaderdata.commodity_id.id
    invoiceheaderdata.totalamount = +invoiceheaderdata.totalamount
    invoiceheaderdata.invoiceamount = +invoiceheaderdata.invoiceamount
    invoiceheaderdata.taxamount = invoiceheaderdata.totalamount - invoiceheaderdata.invoiceamount
    invoiceheaderdata.invoicedate = this.datepipe.transform(invoiceheaderdata.invoicedate, 'yyyy-MM-dd');
    invoiceheaderdata.recur_fromdate = this.datepipe.transform(invoiceheaderdata.recur_fromdate, 'yyyy-MM-dd');
    invoiceheaderdata.recur_todate = this.datepipe.transform(invoiceheaderdata.recur_todate, 'yyyy-MM-dd');
    // this.isCaptalized = invoiceheaderdata.captalisedflag
    let hdrdata: any = []
    hdrdata.push(this.frmInvHdr.value)
    this.formData.append('data', JSON.stringify(hdrdata));
    this.spinner.show()
    this.service.invoiceheadercreate(this.formData)
      .subscribe(result => {
        this.spinner.hide()
        let invhdrresults = result['invoiceheader']
        if (result?.code == "INVALID_FILETYPE" && result?.description == "Invalid Filetype") {
          this.notification.showError(result?.description)

          this.notification.showInfo("Please Delete the Uploaded File before moving further");
          this.disableinvhdrsave = false
          return false;
        }
        else if (result?.status == "Failed") {
          this.notification.showError(result?.description)
          this.disableinvhdrsave = false
          return false;
        }
        else {
          this.file_process_data = {}
          let supp
          if (this.aptypeid != 14) {
            supp = this.invHdrRes.supplier_id?.name + ' - ' + this.invHdrRes.supplier_id?.code
          }
          else {
            supp = this.frmInvHdr.value.supplier
            this.kvbacaccno = invhdrresults[0].invoiceno
            this.ICRAccNo = invhdrresults[0].invoiceno
          }
          this.apinvHeader_id = invhdrresults[0].id
          this.checkInvID = invhdrresults[0].id
          this.frmInvHdr.patchValue(
            {
              id: result.invoiceheader[0]?.id,
              apheader_id: result.invoiceheader[0]?.apheader_id,
              rsrCode: this.invHdrRes.raisercode,
              rsrEmp: this.invHdrRes.raisername + ' - ' + this.invHdrRes.raisercode,
              rsrBr: this.invHdrRes.branchdetails_id.name + ' - ' + this.invHdrRes.branchdetails_id.code,
              ecftype: this.invHdrRes.aptype_id,
              supplier: supp,
              branchGST: this.invHdrRes?.branchdetails_id?.gstin,
              invoiceno: result.invoiceheader[0]?.invoiceno,
              invoicedate: result.invoiceheader[0]?.invoicedate,
              totalamount: result.invoiceheader[0]?.totalamount,
              invoiceamount: result.invoiceheader[0]?.invoiceamount,
              invoicegst: result.invoiceheader[0]?.invoicegst == 'Y' ? true : false,
              commodity_id: result.invoiceheader[0]?.commodity_id,
              remarks: result.invoiceheader[0]?.remarks,
              supplier_id: this.invHdrRes.supplier_id?.id,
              supplierstate_id: this.invHdrRes?.supplierstate_id?.id,
              credit_refno: this.invHdrRes?.credit_refno,
              msme: this.invHdrRes?.is_msme == true ? "YES":"NO",
              msme_reg_no: this.invHdrRes?.msme_reg_no,
              taxamount: this.invHdrRes?.taxamount,
              otheramount: this.invHdrRes?.otheramount ? this.invHdrRes?.otheramount : 0,
              roundoffamt: this.invHdrRes?.roundoffamt,
              dedupinvoiceno: this.invHdrRes?.dedupinvoiceno,
              raisorbranchgst: this.invHdrRes?.raisorbranchgst,
              place_of_supply: this.invHdrRes?.place_of_supply,
              branchdetails_id: this.invHdrRes?.branchdetails_id,
              bankdetails_id: this.invHdrRes?.bankdetails_id,
              entry_flag: this.invHdrRes?.entry_flag,
              barcode: "",
              creditbank_id: this.invHdrRes?.creditbank_id,
              manualsupp_name: this.invHdrRes?.manualsupp_name,
              manual_gstno: this.invHdrRes?.manual_gstno,
              filevalue: [],
              file_key: [],
              apinvoiceheader_crno: this.invHdrRes?.apinvoiceheader_crno,
              debitbank_id: this.invHdrRes?.debitbank_id,
              invoicestatus: this.invHdrRes?.invoice_status,
              is_tds_applicable: this.invHdrRes?.is_tds_applicable?.id,
              paymentinstrctn: this.invHdrRes?.paymentinstrctn,
              prepaid_expense: result.invoiceheader[0]?.prepaid_expense,
              gst_keyin: result.invoiceheader[0]?.gst_keyin,

            }
          )
          const invdtl = this.InvoiceDetailForm.value.invoicedtls
          for (let i = 0; i < invdtl.length; i++) {
            this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('is_capitalized').setValue(this.isCaptalized)
          }
          if (result.invoiceheader[0]?.gst_keyin == true) {
            const invdtl = this.InvoiceDetailForm.value.invoicedtls
            for (let i = 0; i < invdtl.length; i++) {
              if (this.type == "SGST & CGST") {
                let tax = +(this.invHdrRes?.taxamount)
                let igst = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tax);
                igst = igst ? igst.toString() : '';
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('cgst').setValue(0)
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('sgst').setValue(0)
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('igst').setValue(igst)
              }
              else if (this.type == "IGST") {
                let tax = +(this.invHdrRes?.taxamount)
                let cgst = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tax / 2);
                cgst = cgst ? cgst.toString() : '';
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('cgst').setValue(cgst)
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('sgst').setValue(cgst)
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('igst').setValue(0)
              }
            }
            this.invdtlsaved = false
            this.debitsaved = false
          }
          this.notification.showSuccess("Successfully Invoice Header Saved!...")
          this.changesInAP = true
          this.disableinvhdrsave = true
          this.invheadersave = true
          this.inveditFlag = false
          // this.editorDisabled = true
          if ((this.invHdrRes.invoicegst == "Y" && this.frmInvHdr.value.invoicegst != true) ||
            (this.invHdrRes.invoicegst == "N" && this.frmInvHdr.value.invoicegst != false)) {
            const invdtl = this.InvoiceDetailForm.value.invoicedtls
            for (let i = 0; i < invdtl.length; i++) {
              this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('productname').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('hsn').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('hsn_percentage').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('unitprice').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('quantity').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('amount').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('cgst').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('sgst').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('igst').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('taxamount').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('discount').reset(0),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('totalamount').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('otheramount').reset(""),
                this.InvoiceDetailForm.get('invoicedtls')['controls'][i].get('roundoffamt').reset("")
            }
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.disableinvhdrsave = false
        this.spinner.hide();
      }
      )

  }
  onselectionchangepr(event) {

    if (event.checked == true) {
      this.frmInvHdr.get('prepaid_expense').setValue(true);

    }
    else {

      this.frmInvHdr.get('prepaid_expense').setValue(false);
    }
  }
  onselectionchangegst(event) {

    if (event.checked == true) {
      this.frmInvHdr.get('gst_keyin').setValue(true);

    }
    else {
      this.frmInvHdr.get('gst_keyin').setValue(false);
    }
  }


  //Supplier



  getsuppdd() {
    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.SelectSupplierForm.get('name').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.service.getsuppliernamescroll(this.suplist, value, 1, 1)
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
    // this.getsuppliername(this.suplist, "");
  }
  public displaytest(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }
  public displayFn(Suppliertype?: SupplierName): string | undefined {
    return Suppliertype ? Suppliertype.name : undefined;
  }
  get Suppliertype() {
    return this.SelectSupplierForm.get('name');
  }
  getsuppliername(id, suppliername) {
    this.service.getsuppliername(id, suppliername, 1)
      .subscribe((results) => {
        if (results) {
          let datas = results["data"];
          this.supplierNameData = datas;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.spinner.hide();
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
                this.service.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, 1, this.currentpage + 1)
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


  getsuppindex() {
    this.popupopen8();
    // this.supplierindex = ind
    let invoiceheaders = this.frmInvHdr?.value

    if (invoiceheaders?.invoicegst == "Y") {
      this.SelectSupplierForm.controls['code'].disable();
      this.SelectSupplierForm.controls['panno'].disable();
      this.SelectSupplierForm.controls['name'].disable();
    } else {
      this.SelectSupplierForm.controls['code'].enable();
      this.SelectSupplierForm.controls['panno'].enable();
      this.SelectSupplierForm.controls['name'].enable();
    }
    if (invoiceheaders?.suppname == null) {
      this.dataclear('')
    }
  }
  statename: any
  // getsuppView(data) {
  //   this.supplierid = data?.id
  //   this.service.getsupplierView(data?.id)
  //     .subscribe(result => {
  //       if (result) {
  //         this.SupplierName = result?.name
  //         this.SupplierCode = result?.code
  //         this.SupplierGSTNumber = result?.gstno
  //         this.SupplierPANNumber = result?.panno
  //         this.Address = result?.address_id
  //         this.line1 = result?.address_id?.line1
  //         this.line2 = result?.address_id?.line2
  //         this.line3 = result?.address_id?.line3
  //         this.City = result?.address_id?.city_id?.name
  //         this.stateid = result?.address_id?.state_id?.id
  //         this.statename = result?.address_id?.state_id?.name
  //         // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppname').setValue(this.SupplierName)
  //         // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppliergst').setValue(this.SupplierGSTNumber)
  //         // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplier_id').setValue(this.supplierid)
  //         // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplierstate_id').setValue(this.stateid)
  //         // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppstate').setValue(this.statename)
  //         this.submitbutton = true;
  //       }
  //     }, error => {
  //       this.errorHandler.handleError(error);
  //       this.spinner.hide();
  //     })
  // }
  supplierdata_name: any;
  getsuppView(data) {
    if (!data?.id) {
      return;
    }
    this.supplierid = data?.id
    this.service.getsupplierView(data?.id)
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
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppname').setValue(this.SupplierName)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppliergst').setValue(this.SupplierGSTNumber)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplier_id').setValue(this.supplierid)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplierstate_id').setValue(this.stateid)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppstate').setValue(this.statename)
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
        this.spinner.hide();
      })
  }
  // SelectSuppliersearch() {
  //   let searchsupplier = this.SelectSupplierForm?.value;
  //   if (searchsupplier?.gstno != "" && searchsupplier?.gstno != null && searchsupplier?.gstno != undefined) {
  //     this.service.getEmpBanch(searchsupplier?.gstno)
  //       .subscribe(res => {
  //         console.log("empbranch", res)
  //         let result = res.data
  //         if (result.length > 0) {
  //           this.notification.showError("KVB GST Numbers. cannot be used. ")
  //           this.spinner.hide();
  //         }
  //         this.alternate = true;
  //         this.default = false;
  //         this.Testingfunctionalternate();
  //       })
  //   }
  //   else if (searchsupplier?.code === "" && searchsupplier?.panno === "" && searchsupplier?.gstno === "") {
  //     this.getsuppliername("", "");
  //   }
  //   else {
  //     // this.SelectSupplierForm.controls['name'].enable();
  //     this.alternate = true;
  //     this.default = false;
  //     this.Testingfunctionalternate();
  //   }
  // }
  suppliers: any;
  SelectSuppliersearch(e) {
    this.suppliers = e
    let searchsupplier = this.SelectSupplierForm?.value;
    if (this.suppliers?.gstno != "" && this.suppliers?.gstno != null && this.suppliers?.gstno != undefined) {
      this.service.getEmpBanch(this.suppliers?.gstno)
        .subscribe(res => {
          console.log("empbranch", res)
          let result = res.data
          if (result.length > 0) {
            this.notification.showError("KVB GST Numbers. cannot be used. ")
            this.spinner.hide();
          }
          this.alternate = true;
          this.default = false;
          this.Testingfunctionalternate();
        })
    }
    else if (this.suppliers?.code === "" && this.suppliers?.panno === "" && this.suppliers?.gstno === "") {
      this.getsuppliername("", "");
    }
    else {
      // this.SelectSupplierForm.controls['name'].enable();
      this.alternate = true;
      this.default = false;
      this.Testingfunctionalternate();
    }
  }
  searchsupplier: any
  // Testingfunctionalternate() {
  //   this.searchsupplier = this.SelectSupplierForm.value;
  //   this.service.getselectsupplierSearch(this.searchsupplier, 1)
  //     .subscribe(result => {
  //       if (result['data']?.length > 0) {
  //         this.selectsupplierlist = result['data']
  //         console.log("this.searchsupplier?.gstno?.length", this.searchsupplier?.gstno?.length)
  //         if (this.searchsupplier?.gstno?.length == 15 || this.searchsupplier?.panno?.length == 10) {
  //           let supplierdata = {
  //             "id": this.selectsupplierlist[0]?.id,
  //             "name": this.selectsupplierlist[0]?.name
  //           }
  //           this.supplierid = supplierdata?.id
  //           this.SelectSupplierForm.patchValue({ name: supplierdata })
  //           this.getsuppView(supplierdata)
  //         } else {
  //           let supplierdata = {
  //             "id": this.selectsupplierlist[0]?.id,
  //             "name": this.selectsupplierlist[0]?.name
  //           }
  //           this.supplierid = supplierdata?.id
  //           this.SelectSupplierForm.patchValue({ name: supplierdata })
  //           this.getsuppView(supplierdata)
  //         }
  //       }
  //     }, error => {
  //       this.errorHandler.handleError(error);
  //       this.spinner.hide();
  //     })
  // }
  selectpayloadbodydata: any
  supplierlists: any;
  suppliersearchs: any;
  supplierdatass: any
  Testingfunctionalternate() {
    this.searchsupplier = this.SelectSupplierForm.value;
    this.service.getselectsupplierSearch(this.suppliers, 1)
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
            id: "invoice-detail-0281"
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
        this.spinner.hide();
      })
  }
  Branchcallingfunction() {

    this.frmInvHdr.get('supplier').setValue(this.SupplierName + ' - ' + this.SupplierCode)
    this.frmInvHdr.get('suppliergst').setValue(this.SupplierGSTNumber)
    this.frmInvHdr.get('suppstate').setValue(this.statename)
    this.frmInvHdr.get('supplierstate_id').setValue(this.stateid)
    this.frmInvHdr.get('supplier_id').setValue(this.supplierid)
    //   if(this.branchnamecheck != "PRECIOUS METALS DIVISION" || (this.branchnamecheck == "PRECIOUS METALS DIVISION" && (this.locationname == null || this.locationname == ""))){
    //   this.ecfservice.GetbranchgstnumberGSTtype(this.supplierid, this.raiserbranchid)
    //     .subscribe((results) => {
    //       let datas = results;
    //       this.branchgstnumber = datas?.Branchgst
    //       this.type = datas?.Gsttype
    //     })
    //   }else{
    //   this.ecfservice.GetpettycashGSTtype(this.SupplierGSTNumber,this.raisergst)
    //   .subscribe(results=>{
    //     let datas = results;
    //     this.type = datas?.Gsttype

    //   })
    // }
  }
  dataclear(e) {
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
  approveap(is_approve_pay) {
    let data = this.APapprovesubmitform.value
    data.id = this.apinvHeader_id
    data.apinvoiceheaderstatus = 41
    if (data?.remarks == "" || data?.remarks == null || data?.remarks == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    // this.spinner.show()
    // this.service.apapprovereaudit(data, is_approve_pay).subscribe(result => {
    //   this.spinner.hide()
    //   console.log("approveresult", result)
    //   if (result?.status == "success") {
    //     this.notification.showSuccess("Transaction Initiated Successfully")
    //     this.onApproveBack.emit()
    //   } else {
    //     this.notification.showError(result?.message)
    //     return false
    //   }
    // })
    if (!this.fileUploaded) {
      this.spinner.show()
      this.service.apapprovereaudit(data, is_approve_pay).subscribe(result => {
        this.spinner.hide()
        console.log("approveresult", result)
        if (result?.status == "success") {
          this.notification.showSuccess("Transaction Initiated Successfully")
          this.ap_approval_closebtn.nativeElement.click();
          this.onApproveBack.emit()
        } else {
          this.notification.showError(result?.message)
          return false
        }
      })
    }
    else {
      const invoiceheaderdata = this.frmInvHdr.value
      if (this.aptypeid != 3 && this.aptypeid != 13) {
        invoiceheaderdata.invoicedate = this.datepipe.transform(invoiceheaderdata?.invoicedate, 'yyyy-MM-dd');
      }
      else {
        invoiceheaderdata.invoicedate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
      }
      if (typeof (invoiceheaderdata.branchdetails_id) == 'object') {
        invoiceheaderdata.raisorbranchgst = invoiceheaderdata?.branchdetails_id.gstin
        invoiceheaderdata.place_of_supply = invoiceheaderdata?.branchdetails_id?.code
        invoiceheaderdata.branchdetails_id = invoiceheaderdata?.branchdetails_id?.id
      } else {
        invoiceheaderdata.branchdetails_id = invoiceheaderdata?.branchdetails_id
      }
      // if(this.PMDyesno== 'Y')
      // {
      //   invoiceheaderdata.is_pmd =   true
      // if(typeof(invoiceheaderdata.pmdlocation_id)=='object'){
      //   invoiceheaderdata.raisorbranchgst = invoiceheaderdata?.pmdlocation_id?.gstno
      //   invoiceheaderdata.pmdlocation_id = invoiceheaderdata?.pmdlocation_id?.id
      // }else{  
      //   invoiceheaderdata.pmdlocation_id =   invoiceheaderdata?.pmdlocation_id 
      // }
      // }
      // else
      // {
      //   invoiceheaderdata.is_pmd =   false
      //   delete invoiceheaderdata.pmdlocation_id
      // }
      if (invoiceheaderdata.captalisedflag) {
        invoiceheaderdata.captalisedflag = 'Y'
        invoiceheaderdata.is_fa_capitalized = 1
      }
      else {
        invoiceheaderdata.captalisedflag = 'N'
        invoiceheaderdata.is_fa_capitalized = 0
      }
      // invoiceheaderdata[i].invoiceamount = invoiceheaderdata[i].invoiceamount.replace(/,/g, '')
      // if (this.ecftypeid == 3) {
      //   // invoiceheaderdata[i].invoicegst = 'N'
      //   invoiceheaderdata.invoiceno = "inv" + this.datePipe.transform(new Date(), 'ddMM');
      // } 
      invoiceheaderdata.invoicegst = invoiceheaderdata.invoicegst

      invoiceheaderdata.invoiceamount = +(invoiceheaderdata.invoiceamount.replace(/,/g, ''))
      invoiceheaderdata.totalamount = +(invoiceheaderdata.totalamount.replace(/,/g, ''))
      if (this.aptypeid == 14) {
        invoiceheaderdata.invoiceamount = +invoiceheaderdata.totalamount
      }
      else {
        invoiceheaderdata.invoiceamount = +invoiceheaderdata.invoiceamount
      }
      invoiceheaderdata.invtotalamt = this.sum
      // invoiceheaderdata.raisorbranchgst = this.raisergst
      // invoiceheaderdata.place_of_supply = this.place_of_supply
      invoiceheaderdata.refinv_crno = String(invoiceheaderdata.refinv_crno).trim()
      if (invoiceheaderdata?.suppname == null) {
        invoiceheaderdata.supname = ""
      }
      if (invoiceheaderdata?.taxamount == "") {
        invoiceheaderdata.taxamount = 0
      }

      invoiceheaderdata.apinvoiceheader_crno = invoiceheaderdata?.apinvoiceheader_crno,
        invoiceheaderdata.debitbank_id = invoiceheaderdata?.debitbank_id
      invoiceheaderdata.index = 0
      delete invoiceheaderdata?.suppstate
      invoiceheaderdata.module_type = 2
      if (invoiceheaderdata.service_type == 2 || invoiceheaderdata.service_type == 3) {
        invoiceheaderdata.recur_fromdate = this.datepipe.transform(invoiceheaderdata?.recur_fromdate, 'yyyy-MM-dd');
        invoiceheaderdata.recur_todate = this.datepipe.transform(invoiceheaderdata?.recur_todate, 'yyyy-MM-dd');
      }
      else {
        delete invoiceheaderdata.recur_fromdate
        delete invoiceheaderdata.recur_todate
      }
      if (this.aptypeid != 2 && this.aptypeid != 1) {
        delete invoiceheaderdata.is_pca
        delete invoiceheaderdata.pca_no
        delete invoiceheaderdata.pca_name
      }
      else {
        invoiceheaderdata.pca_no = invoiceheaderdata.pca_no?.pca_no
        invoiceheaderdata.pca_name = this.PCA_Det[0]?.pca_name
      }
      invoiceheaderdata.apheader_id = this.ecfheaderid
      // let Invoicedatas = []
      // Invoicedatas.push(this.frmInvHdr.value)
      // for (let i = 0; i < Invoicedatas.length; i++) {
      //   // let keyvalue = "file" + 0;
      //   // this.formData.delete(keyvalue);
      //   // for (let file in this.file_process_data[keyvalue]) {
      //   //   this.formData.append(keyvalue, this.file_process_data[keyvalue][file])
      //   // }
      //   for( let type of this.uploadFileTypes){
      //   this.formData.delete(type);
      //   let pairvalue = this.file_process_data[type];
      //   if (pairvalue!=undefined  && pairvalue!=""){
      //     for (let fileindex in pairvalue) {
      //       this.formData.append(type,this.file_process_data[type][fileindex])
      //     }
      //   }}
      // }
      let Invoicedatas =[]
    Invoicedatas.push(this.frmInvHdr.value)
    for (let i = 0; i < Invoicedatas.length; i++) {
      let keyvalue = "file" + 0;
      this.formData.delete(keyvalue);
      for(let file in this.file_process_data[keyvalue]){
        this.formData.append(keyvalue,this.file_process_data[keyvalue][file])
      }
    }
      let invheaderresult: boolean;
      this.spinner.show()
      this.formData.append('data', JSON.stringify(Invoicedatas));
      this.service.invoiceheadercreate(this.formData, 'ecfapprover')
        .subscribe(result => {

          if (result.status == 'Failed') {
            this.spinner.hide()
            invheaderresult = false
            this.notification.showError(result?.description)
            return false
          }
          let invhdrresults = result['invoiceheader']
          if (invhdrresults != undefined) {
            if (invhdrresults?.id == undefined) {
              this.spinner.hide()
              invheaderresult = false
              this.notification.showError(invhdrresults?.description)

              return false
            } else {
              invheaderresult = true
            }
          } else {
            this.notification.showError(result?.description)
            if (result?.code == "INVALID_FILETYPE" && result?.description == "Invalid Filetype") {
              this.spinner.hide()
              this.notification.showInfo("Please Delete the Uploaded File before moving further");
              return false;
            }
            return false
          }
          if (invheaderresult == true) {
            console.log("Successfully Invoice Header Saved!...")

            this.service.apapprovereaudit(data, is_approve_pay).subscribe(result => {
              this.spinner.hide()
              console.log("approveresult", result)
              if (result?.status == "success") {
                this.notification.showSuccess("Transaction Initiated Successfully")
                this.ap_approval_closebtn.nativeElement.click();
                this.onApproveBack.emit()
              } else {
                this.notification.showError(result?.message)
                return false
              }
            })
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.spinner.hide();
        })
    }
  }

  modify() {
    let data = this.APapprovesubmitform.value
    data.apinvoiceheader_id = this.apinvHeader_id
    data.apinvoiceheaderstatus = 12
    this.spinner.show()
    this.service.apapprovereaudit(data).subscribe(result => {
      this.spinner.hide()
      console.log("reauditresult", result)
      if (result?.status == "success") {
        console.log("sent to Modification")
        this.movedata = "AP"
        this.shareservice.apmodification.next('modify')
        this.gethsn('')
        this.getProduct('')
        this.getdebbank()
        this.gettds()
        this.getcat('')
        this.getRecurringType()
      } else {
        this.notification.showError(result?.message)
        return false
      }
    })
  }

  reauditap() {
    let data = this.APapprovesubmitform.value
    data.apinvoiceheader_id = this.apinvHeader_id
    data.apinvoiceheaderstatus = 12
    if (data?.remarks == "" || data?.remarks == null || data?.remarks == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    this.spinner.show()
    this.service.apapprovereaudit(data).subscribe(result => {
      this.spinner.hide()
      console.log("reauditresult", result)
      if (result?.status == "success") {
        this.notification.showSuccess("Re Audited Successfully")
        this.ap_approval_closebtn.nativeElement.click();
        this.onApproveBack.emit()
      } else {
        this.notification.showError(result?.message)
        return false
      }
    })
  }


  RecurringTypes: any
  RecurringTypes1: any
  // getRecurringType() {
  //   this.spinner.show()
  //   this.service.getRecurringType()
  //     .subscribe(result => {
  //       this.spinner.hide()
  //       if (result['servicetype_dropdown']) {
  //         let serv = result['servicetype_dropdown']
  //         this.RecurringTypes = serv["data"].filter(x => x.id != 1)
  //         this.RecurringTypes1 = serv["data"].filter(x => x.id == 1)
  //         this.Recurring_type_field = {
  //           label: "Recurring Type",
  //           fronentdata: true,
  //           data: this.RecurringTypes,
  //           displaykey: "text",
  //           valuekey: "id",
  //           formcontrolname: "service_type",
  //           id: "invoice-detail-0043",
  //         }
  //         this.Recurring_type_field2 = {
  //           label: "Recurring Type",
  //           fronentdata: true,
  //           data: this.RecurringTypes1,
  //           displaykey: "text",
  //           valuekey: "id",
  //           formcontrolname: "service_type",
  //           id: "invoice-detail-0044",
  //         }
  //       }

  //     }, error => {
  //       this.errorHandler.handleError(error);
  //       this.spinner.hide();
  //     })
  // }
  getRecurringType() {
    // this.spinner.show()
    this.service.getRecurringType()
      .subscribe(result => {
        // this.spinner.hide()

        if (result['servicetype_dropdown']) {
          let serv = result['servicetype_dropdown']
          this.RecurringTypes = serv["data"].filter(x => x.id != 1)
          this.Recurring_type_field = {
            label: "Recurring Type",
            fronentdata: true,
            data: this.RecurringTypes,
            displaykey: "text",
            valuekey: "id",
            formcontrolname: "service_type",
            id: "invoice-detail-0043",
          }
          this.RecurringTypes1 = serv["data"].filter(x => x.id == 1)
          this.Recurring_type_field2 = {
            label: "Recurring Type",
            fronentdata: true,
            data: this.RecurringTypes1,
            displaykey: "text",
            valuekey: "id",
            formcontrolname: "service_type",
            id: "invoice-detail-0044",
          }
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.spinner.hide();
      })
  }
  showRecurDates = false
  isRecurChanged(val) {
    if (val.value == 0)
      this.showRecurDates = false
    else
      this.showRecurDates = true
  }


  showRecurMonth = false
  serviceTypeChanged(e) {
    let val= e
    if (val.id == 2)
      this.showRecurMonth = true
    else
      this.showRecurMonth = false
  }



  setMonthAndYear(ev, input) {
    let { _d } = ev;
    console.log(_d)
    this.frmInvHdr.get('recur_fromdate').setValue(ev)
    this.frmInvHdr.get('recur_todate').setValue(ev)

    input._destroyPopup();
  }
  selectionArray = []
  poLists: any;
  invoiceheaderrescount: any
  pocrno: any;
  addedamount: any;
  onselectionchangePO(e: MatCheckboxChange, list: any, i: number) {
    const headerArray = this.POInvoiceForm.get('poheader') as FormArray;
    const row: FormGroup = (list && typeof list.get === 'function')
      ? list
      : (headerArray.at(i) as FormGroup);

    const selectControl = row.get('select') as FormControl;
    const qtyControl = row.get('quantity') as FormControl;
    const balanceControl = row.get('balance') as FormControl;

    if (e.checked) {
      const qty = qtyControl?.value;
      const balance = balanceControl?.value;

      if (!qty || Number(qty) === 0) {
        this.notification.showError('Please Enter Current Invoice Qty Read');
        selectControl?.setValue(false, { emitEvent: false });
        return;
      }

      if (Number(qty) > Number(balance || 0)) {
        this.notification.showError('Balance Quantity Exceeds');
        qtyControl.setValue('');
        selectControl?.setValue(false, { emitEvent: false });
        return;
      }

      this.selectionArray = this.selectionArray.filter(x => x.id !== row.value.id);

      const toPush = { ...row.value };
      this.selectionArray.push(toPush);

    } 
    else {
      this.selectionArray = this.selectionArray.filter(x => x.id !== row.value.id);
    }

    
    this.INVsum = this.selectionArray
      .reduce((acc, cur) => acc + Number(String(cur.amount).replace(/,/g, '')), 0);
  }

  create_poInvDtl() {
    if (this.selectionArray.length > 0) {
      const totalAmountFromForm = String(this.frmInvHdr.get('totalamount').value).replace(/,/g, '');

      if (Number(totalAmountFromForm) !== this.INVsum) {
        this.toastr.error('The Invoice Header Amount And The Invoice Total Amount is Not Equal');
        return false;
      }
      let input = []
      for (let i = 0; i < this.selectionArray.length; i++) {
        delete this.selectionArray[i].id
        this.selectionArray[i].unitprice = String(this.selectionArray[i].unitprice).replace(/,/g, '');
        this.selectionArray[i].quantity = +(String(this.selectionArray[i].quantity).replace(/,/g, ''));
        this.selectionArray[i].amount = +(String(this.selectionArray[i].amount).replace(/,/g, ''));
        this.selectionArray[i].totalamount = String(this.selectionArray[i].totalamount).replace(/,/g, '');
        this.selectionArray[i].dtltotalamt = this.INVsum
        this.selectionArray[i].invoicedate = this.datepipe.transform(this.selectionArray[i]?.invoicedate, 'yyyy-MM-dd');

        if (this.modificationFlag == 'modification') {
          this.selectionArray[i].edit_flag = 1
        } else if (this.modificationFlag == 'edit') {
          this.selectionArray[i].edit_flag = 0
        }
        input.push(this.selectionArray[i])
      }

      this.creditEntryFlag = false

      this.service.invDetAddEdit(input)
        .subscribe(result => {
          if (result.invoicedetails[0].code != undefined) {
            this.spinner.hide();
            this.notification.showError(result.invoicedetails[0].description)
            this.invdtlsaved = false
          }
          else {
            this.invdtlsaved = true
            console.log("invdetEDIT RESULT ", result)
            let invdetRes = result.invoicedetails
            this.Roundoffsamount = invdetRes[0].roundoffamt

            this.invSubmitFlag = true
            for (let i = 0; i < invdetRes.length; i++) {
              this.invdetlist.push(invdetRes[i].id)
            }
            this.spinner.show()
            this.service.entryDebit({ crno: this.crno, invoiceheader_id: this.apinvHeader_id, invoicedetails_id_list: this.invdetlist })
              .subscribe(result => {
                this.spinner.hide()
                if (result.status == "success") {
                  this.debitsaved = false
                  this.invdetlist = []
                  console.log("entryDebit result --", result.status)
                }
                else {
                  this.invdetlist = []
                  this.spinner.hide();
                  this.notification.showError(result.message)
                  this.invdtlsaved = false
                }
              })
            // this.spinner.show()
            if (this.credentrycalled == false && this.invDetailList.length > 0) {
              if (this.invDetailList[0].entry_flag == true)
                this.credentrycalled = true
            }
            if (this.credentrycalled == true) {
              this.creditEntryFlag = true
              let creditcontrol = this.POInvoiceForm.controls["creditdtl"] as FormArray;
              creditcontrol.clear()
              this.spinner.show()
              this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
                .subscribe(result => {

                  if (result.code == undefined) {
                    this.creditres = result.data
                    this.spinner.hide();
                    console.log("cdtres", this.creditres)
                    let cred = result.data;
                    console.log("cred", cred)
                    this.invCreditList = cred.filter(x => (x.is_display == "YES" && (x.amount > 0 && x.paymode.gl_flag == 'Adjustable') ||
                      (x.amount >= 0 && x.paymode.gl_flag == 'Payable')))
                    this.getcreditrecords(this.invCreditList)
                  }
                })
            }
            else {
              this.credentrycalled = true
              this.spinner.show()
              this.service.entryCredit({ crno: this.crno, invoiceheader_id: this.apinvHeader_id, invoicedetails_id: "0" })
                .subscribe(result => {
                  if (result) {
                    console.log("entry Credit result --", result)
                    if (result.status !== "success") {
                      this.spinner.hide();
                      this.notification.showError(result.message)
                      this.invdtlsaved = false
                    }
                    else {
                      // this.service.updateCredEntryFlag(this.apinvHeader_id, { "entry_flag":1 })
                      // .subscribe(result => {
                      //   console.log("Credit entry flag update--", result)
                      //   if(result.status == "success")
                      //   {
                      this.creditEntryFlag = true
                      let creditcontrol = this.POInvoiceForm.controls["creditdtl"] as FormArray;
                      creditcontrol.clear()
                      this.spinner.show()
                      this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
                        .subscribe(result => {
                          this.spinner.hide();
                          if (result.code == undefined) {
                            this.creditres = result.data
                            console.log("cdtres", this.creditres)
                            let cred = result.data;
                            console.log("cred", cred)
                            this.invCreditList = cred.filter(x => (x.is_display == "YES" && (x.amount > 0 && x.paymode.gl_flag == 'Adjustable') ||
                              (x.amount >= 0 && x.paymode.gl_flag == 'Payable')))
                            if (this.invCreditList?.length == 0 && (this.aptypeid == 2 || this.aptypeid == 1)) {
                              console.log("invCreditList", this.invCreditList)
                              // this.paymodecode[0]='PM005'
                              this.addcreditSection()
                              // let datas = this.paymodesList.filter(x=>x.code == 'PM005')
                              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])

                              // if(datas[0].paymode_details?.data?.length == 0)
                              // {
                              //   this.notification.showError("Paymode Details Empty")
                              // }
                              // else
                              // {
                              //   let paymode_details=datas[0].paymode_details ? datas[0].paymode_details:undefined

                              //   let gl=datas[0].paymode_details['data'][0]?.glno
                              //   let catcode = paymode_details['data'][0]?.category_id?.code
                              //   let subcat = paymode_details['data'][0]?.sub_category_id?.code
                              //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                              //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                              //   this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
                              // } this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
                              // this.showaccno[0] = true  
                              this.getaccno(0)
                              // this.showtaxtype[0] = false
                              // this.showtaxrate[0] = false
                              // this.showtaxtypes[0] = true
                              // this.showtaxrates[0] = true   
                            }
                            else if (this.invCreditList?.length == 0 && (this.aptypeid == 14)) {
                              console.log("invCreditList", this.invCreditList)
                              this.paymodecode[0] = 'PM008'
                              this.addcreditSection()
                              let datas = this.paymodesList.filter(x => x.code == 'PM008')
                              console.log("paydatass===>", datas[0])
                              this.POInvoiceForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])

                              if (datas[0].paymode_details?.data?.length == 0) {
                                this.notification.showError("Paymode Details Empty")
                              }
                              else {
                                let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

                                let gl = datas[0].paymode_details['data'][0]?.glno
                                let catcode = paymode_details['data'][0]?.category_id?.code
                                let subcat = paymode_details['data'][0]?.sub_category_id?.code
                                this.POInvoiceForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                                this.POInvoiceForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                                this.POInvoiceForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
                              }
                              // this.getaccno(0)
                              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('bank').setValue("KARUR VYSYA BANK")
                              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('ifsccode').setValue("KVBL0001903")
                              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('branch').setValue("EXPENSES MANAGEMENT CELL")
                              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('benificiary').setValue("EXPENSES MANAGEMENT CELL")
                              this.creditdetForm.patchValue({
                                is_tds_applicable: 1
                              })
                              this.showtaxtype[0] = false
                              this.showtaxrate[0] = false
                              this.showtaxtypes[0] = true
                              this.showtaxrates[0] = true
                            }
                            else if (this.invCreditList?.length == 0 && (this.aptypeid == 3)) {
                              console.log("invCreditList", this.invCreditList)
                              this.paymodecode[0] = 'PM004'
                              this.addcreditSection()
                              let datas = this.paymodesList?.filter(x => x.code == 'PM004')
                              // console.log("paydatass===>",datas[0])
                              this.POInvoiceForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])

                              if (datas[0].paymode_details?.data?.length == 0) {
                                this.notification.showError("Paymode Details Empty")
                              }
                              else {
                                let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

                                let gl = datas[0].paymode_details['data'][0]?.glno
                                let catcode = paymode_details['data'][0]?.category_id?.code
                                let subcat = paymode_details['data'][0]?.sub_category_id?.code
                                this.POInvoiceForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                                this.POInvoiceForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                                this.POInvoiceForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
                              }
                              this.POInvoiceForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])
                              this.showaccno[0] = true
                              this.getERA(datas[0].id, 0)
                              this.showtaxtype[0] = false
                              this.showtaxrate[0] = false
                              this.showtaxtypes[0] = true
                              this.showtaxrates[0] = true
                            }
                            else if (this.invCreditList?.length == 0 && (this.aptypeid == 13)) {
                              console.log("invCreditList", this.invCreditList)
                              this.paymodecode[0] = 'PM001'
                              this.addcreditSection()
                              console.log("ppp--->", this.paymodesList)
                              let datas = this.paymodesList.filter(x => x.code == 'PM001')
                              console.log("paydatass===>", datas[0])
                              this.POInvoiceForm.get('creditdtl')['controls'][0].get('paymode_id').setValue(datas[0])

                              if (datas[0].paymode_details?.data?.length == 0) {
                                this.notification.showError("Paymode Details Empty")
                              }
                              else {
                                let paymode_details = datas[0].paymode_details ? datas[0].paymode_details : undefined

                                let gl = datas[0].paymode_details['data'][0]?.glno
                                let catcode = paymode_details['data'][0]?.category_id?.code
                                let subcat = paymode_details['data'][0]?.sub_category_id?.code
                                this.POInvoiceForm.get('creditdtl')['controls'][0].get('category_code').setValue(catcode)
                                this.POInvoiceForm.get('creditdtl')['controls'][0].get('subcategory_code').setValue(subcat)
                                this.POInvoiceForm.get('creditdtl')['controls'][0].get('glno').setValue(gl)
                              }
                              this.showaccno[0] = true
                              this.getERA(datas[0].id, 0)
                              this.showtaxtype[0] = false
                              this.showtaxrate[0] = false
                              this.showtaxtypes[0] = true
                              this.showtaxrates[0] = true
                              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('bank').setValue("KARUR VYSYA BANK")
                              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('branch').setValue("EXPENSES MANAGEMENT CELL")
                              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('ifsccode').setValue("KVBL0001903")
                              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('benificiary').setValue("EXPENSES MANAGEMENT CELL")
                              // this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('glno').setValue("999999999")

                            }
                            else {
                              this.getcreditrecords(this.invCreditList)
                            }
                          }
                        })
                      // }
                      // else
                      // {
                      //   this.spinner.hide();
                      //   this.notification.showError(result.message)
                      // }
                      // })
                      this.spinner.hide()
                      this.notification.showSuccess("Successfully Invoice Details Saved")
                    }
                  }
                }
                )
            }

            this.invoicedetailsdata = result.invoicedetails

            let dataa = this.POInvoiceForm?.value?.invoicedtls
            console.log("invdataa", dataa)
            for (let i in dataa) {
              this.POInvoiceForm.get('invoicedtls')['controls'][i].get('id').setValue(this.invoicedetailsdata[i].id)
            }
            console.log("this.invoicedetailsdata", this.invoicedetailsdata)
            this.invdtlsaved = true
            return true
          }
        })
    }
    else {
      this.notification.showError("No Entries to Save")
    }
  }
  deletePODtl(ind, lists) {
    this.selectionArray.splice(ind, 1)
  }
  poHeaderFormArray(): FormArray {
    return this.POInvoiceForm.get('poheader') as FormArray;
  }
  getpoSections(forms) {
    return forms.controls.poheader.controls;
  }
  podetails() {
    let group = new FormGroup({
      id: new FormControl(''),
      productname: new FormControl(''),
      grn_code: new FormControl(''),
      uom: new FormControl(''),
      unitprice: new FormControl(''),
      qty: new FormControl(''),
      qty_read: new FormControl(''),
      balance: new FormControl(''),
      taxable_amount : new FormControl(''),
      select: new FormControl(0),
      current_invoice_qty: new FormControl(''),
      amt: new FormControl(''),
      po_num: new FormControl(''),
      file:new FormControl('')
    })
    return group
  }
  calctot(e: Event, row: FormGroup, i: number) {
    const headerArray = this.POInvoiceForm.get('poheader') as FormArray;
    const currentRow: FormGroup = (row && typeof row.get === 'function')
      ? row
      : (headerArray.at(i) as FormGroup);

    const selectControl = currentRow.get('select') as FormControl;

    if (selectControl?.value === true) {
      selectControl.setValue(false, { emitEvent: false });

      this.selectionArray = this.selectionArray.filter(
        x => x.id !== currentRow.value.id
      );
    }
  }

  submitPoInvDtl() {
    this.showPOdiv = false
    for (let i = 0; i < this.invDetailList.length; i++) {
      this.spinner.show();

      this.service.invdtldelete(this.invDetailList[i].id)
        .subscribe(result => {

          if (result.code != undefined) {
            this.notification.showError(result.description)
            this.spinner.hide();
            return false
          }
          if (i == this.invDetailList.length - 1)
            this.spinner.hide()
        })


    }
    this.getinvoicedtlrecords()
  }

  PCAyesno = 0
  PCAList
  setPCA(e) {
    let data = e
    this.PCAyesno = data.id
    if (this.PCAyesno == 1) {

      this.service.getPCA(this.invHdrRes?.commodity.id, '', 1)
        .subscribe(result => {
          if (result) {
            this.PCAList = result['data']
          }
        })
    }
    else {
      this.PCA_Det = []
      this.PCA_bal_amount = 0
    }
  }


  PCAScroll() {
    setTimeout(() => {
      if (
        this.pcaAutocomplete &&
        this.pcaAutocomplete &&
        this.pcaAutocomplete.panel
      ) {
        fromEvent(this.pcaAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.pcaAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.pcaAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.pcaAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.pcaAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getPCA(this.invHdrRes?.commodity.id, this.pcaInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.PCAList.length >= 0) {
                      this.PCAList = this.PCAList.concat(datas);
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

  public displayFnPCA(pca?: PCAlists): string | undefined {
    return pca.pca_no ? pca.pca_no : undefined;
  }

  PCA_bal_amount = 0
  PCA_Det = []
  PCAselected() {
    let pca = this.frmInvHdr.value.pca_no
    this.PCA_bal_amount = +pca?.balance_amount
    this.PCA_Det = []
    this.PCA_Det.push(pca)
  }


  icrAccno() {
    let accno = this.frmInvHdr.get('invoiceno').value
    if (accno.length != 16) {
      this.notification.showWarning("Account No. should have 16 digits.")
      this.frmInvHdr.get('invoiceno').setValue('')
    }
  }

  invoice_detail_0019() {
    this.popupopen()
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("create-ecf-0004"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  SummarypreviouslyAttechedFiles: any = [
    // { columnname: "Document Type", key: "document_type" },
    { columnname: "File Name", key: "file_name", tooltip: true },
    // { columnname: "Document Type", key: "document_type" },
    // { columnname: "Module", key: "file_reftype", type: "object", objkey: "text", },
    {
      columnname: "View/Open", key: "view", icon: "open_in_new", "tooltip": "View/Open",
      "style": { color: "blue", cursor: "pointer" },
      button: true, function: true, clickfunction: this.data1.bind(this)
    },
    // {
    //   columnname: "Download ", key: "download", icon: "download",
    //   "style": { color: "green", cursor: "pointer" },
    //   button: true, function: true, clickfunction: this.getfiles.bind(this)
    // },
    {
      columnname: "Delete ", key: "delete", icon: "delete",
      "style": { color: "red", cursor: "pointer" },
      button: true, function: true, clickfunction: this.fileDeletes.bind(this)
    },
  ]

  // preattachfile_summary() {
  //   this.SummaryApipreviouslyAttechedFilesObjNew = {
  //     FeSummary: true,
  //     data: this.packageattacheFile
  //   }
  // }

  SummaryCurrentlyAttechedFiles: any = [
    { columnname: "File Name", key: "file_name" },
    // {
    //   columnname: "View", key: "view", icon: "open_in_new",
    //   "style": { color: "blue", cursor: "pointer" },
    //   button: true, function: true, clickfunction: this.filepreview.bind(this)
    // },
    {
      columnname: "Document Type", key: "view", icon: "open_in_new",
      "style": { color: "blue", cursor: "pointer" },
      button: true, function: true, clickfunction: this.filepreview.bind(this)
    },

    {
      columnname: "Delete ", key: "delete", icon: "delete",
      "style": { color: "red", cursor: "pointer" },
      button: true, function: true, clickfunction: this.deletefileUpload.bind(this)
    },
  ]

  currentattachfile_summary() {
    this.SummaryApiCurrentlyAttechedFilesObjNew = {
      FeSummary: true,
      data: this.packageattacheFile
    }
  }

  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0008"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0003"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen11() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-glpopup"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen12() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-accpopup"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen13() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-glpopup1"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  credit_gl_data(e) {
    console.log("event", e);
    // this.creditglForm.patchValue({
    //   glnum: e,
    // });

    this.edit_credit_gl = e.glno
  }

  SummaryviewData: any = [
    { columnname: "Type", key: "Type" },
    { columnname: "Status", key: "comments" },
    { columnname: "Transaction Date", key: "created_date", "type": 'date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Remarks", key: "remarks", tooltip:true },
    { columnname: "Employee Name", key: "from_user", type: "object", objkey: "name", suffix: "View Details",suffix_style:{color:"green",display:"block"}, function: true, clickfunction: this.view.bind(this) },
    { columnname: "Approver Name ", key: "to_user", type: "object", objkey: "name", suffix: "View Details",suffix_style:{color:"green",display:"block"}, function: true, clickfunction: this.viewto.bind(this) },
  ]
  SummaryApiviewObjNew: any;
  // view_summary() {
  //   // this.SummaryApiviewObjNew = {
  //   //   FeSummary: true,
  //   //   data: this.viewtrnlist
  //   // }
  //   this.popupopen1()
  //   this.SummaryApiviewObjNew = {
  //     method: "get",
  //       url: this.url + "ecfapserv/view_transaction/" + this.apinvHeader_id,
  //       params: ""
  //     }
  //   }
  ecfap_view() {
    this.popupopen6();
  }
  popupopen6() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("create-ecf-0004"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }


  // tdsapplicable: any = {
  //   label: "Is TDS Applicable",
  //   method: "get",
  //   url: this.ecfURL + "ecfapserv/get_yes_or_no_dropdown",
  //   params: "&type=tds",
  //   searchkey: "query",
  //   displaykey: "text",
  //   formcontrolname: 'is_tds_applicable',
  //   required: true,
  //   disabled: true,
  // }

  // tdsdata(e) {
  //   console.log("tdsdata event ---------", e)
  //   if (this.aptypeid != 13) {
  //     if (e?.id == 0) {
  //       this.tdsChoosed = true
  //       const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
  //       let chktds = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')
  //       if (chktds.length > 0)
  //         return false
  //       let chkadv_or_crn = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM006' || x.paymode_id?.code == 'PM011')
  //       if (chkadv_or_crn.length > 0) {
  //         this.toastr.error("Kindly select TDS before the Advance or CRN Liquidation.")
  //         return false
  //       }

  //       this.addcreditSection(0, 'PM007')

  //       // for (let i = 1; i < this.InvoiceDetailForm.value.creditdtl.length; i++) {
  //       //   this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('paymode_id').setValue(datas[0])
  //       // }

  //     }
  //     else {
  //       this.tdsChoosed = false
  //       this.showthreshold = false
  //       const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
  //       let tdslines = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')
  //       if (tdslines.length > 0) {
  //         let idfiltered = tdslines.filter(x => x.id != undefined)
  //         let ids = idfiltered.map(x => x.id)
  //         for (let n = 0; n < ids.length; n++) {
  //           this.spinner.show();
  //           this.service.credDebitDel(ids[n])
  //             .subscribe(result => {
  //               this.spinner.hide();

  //               if (result.status == "success") {
  //                 this.taxableCalc = false
  //               }
  //               else {
  //                 this.notification.showError(result.description)
  //               }
  //               if (n == ids.length - 1)
  //                 this.spinner.hide()
  //             })
  //         }
  //       }
  //       do {
  //         const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
  //         let tdslines = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')
  //         if (tdslines.length == 0)
  //           break
  //         for (let i = 0; i < creditdtlsdatas.length; i++) {
  //           if (creditdtlsdatas[i].paymode_id?.code == 'PM007') {
  //             this.removecreditSection(i, 'TDS', 0)
  //           }
  //         }
  //       } while (true)
  //       this.amountReduction()
  //     }
  //   }
  //   // this.creditdetForm.patchValue({
  //   //   is_tds_applicable: e,
  //   // });
  // }



  tdsdata1(e) {
    this.choosed_tds_value = e
    console.log("tdsdata1 event ---------", e)
    console.log("tdsdata1 form value event ---------", this.creditdetForm.get('is_tds_applicable').value)
    if (this.aptypeid != 13) {
      if (e?.id == 0) {
        this.tdsChoosed = true
        const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
        let chktds = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')
        if (chktds.length > 0)
          return false
        let chkadv_or_crn = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM006' || x.paymode_id?.code == 'PM011')
        if (chkadv_or_crn.length > 0) {
          this.toastr.error("Kindly select TDS before the Advance or CRN Liquidation.")
          return false
        }

        this.addcreditSection(0, 'PM007')

        // for (let i = 1; i < this.InvoiceDetailForm.value.creditdtl.length; i++) {
        //   this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('paymode_id').setValue(datas[0])
        // }

      }
      else {
        this.tdsChoosed = false
        this.showthreshold = false
        const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
        let tdslines = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')
        if (tdslines.length > 0) {
          let idfiltered = tdslines.filter(x => x.id != undefined)
          let ids = idfiltered.map(x => x.id)
          for (let n = 0; n < ids.length; n++) {
            this.spinner.show();
            this.service.credDebitDel(ids[n])
              .subscribe(result => {
                this.spinner.hide();

                if (result.status == "success") {
                  this.taxableCalc = false
                }
                else {
                  this.notification.showError(result.description)
                }
                if (n == ids.length - 1)
                  this.spinner.hide()
              })
          }
        }
        do {
          const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
          let tdslines = creditdtlsdatas.filter(x => x.paymode_id?.code == 'PM007')
          if (tdslines.length == 0)
            break
          for (let i = 0; i < creditdtlsdatas.length; i++) {
            if (creditdtlsdatas[i].paymode_id?.code == 'PM007') {
              this.removecreditSection(i, 'TDS', 0)
            }
          }
        } while (true)
        this.amountReduction()
      }
    }
    // this.creditdetForm.patchValue({
    //   is_tds_applicable: e,
    // });
  }


  popupopen15() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("liqdetailspop"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  
    crnliqpopup() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("crndetailspop"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

// popupopen15() {
//   const ppxModalEl = document.getElementById("liqdetailspop");
//   if (ppxModalEl) {
//     const ppxModal = new (bootstrap as any).Modal(ppxModalEl, {
//       backdrop: "static",
//       keyboard: false,
//     });
//     ppxModal.show();
//   }

//   const crnModalEl = document.getElementById("crndetailspop");
//   if (crnModalEl) {
//     const crnModal = bootstrap.Modal.getInstance(crnModalEl);
//     if (crnModal) crnModal.hide();
//   }
// }

// crnliqpopup() {
//   // Open CRN modal
//   const crnModalEl = document.getElementById("crndetailspop");
//   if (crnModalEl) {
//     const crnModal = new (bootstrap as any).Modal(crnModalEl, {
//       backdrop: "static",
//       keyboard: false,
//     });
//     crnModal.show();
//   }

//   const ppxModalEl = document.getElementById("liqdetailspop");
//   if (ppxModalEl) {
//     const ppxModal = bootstrap.Modal.getInstance(ppxModalEl);
//     if (ppxModal) ppxModal.hide();
//   }
// }



  crnglpopupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("crnglpopup"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }




  popupopen3() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0006"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen4() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0011"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen5() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0012"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  invoice_view() {
    this.popupopen7();
  }
  popupopen7() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0019"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen8() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0022"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen9() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0020"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen10() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0304"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  gstValidResp: any
  SupGSTChecked = false
  getGstValidated() {
    this.spinner.show()
    this.service.gstValidated(this.apinvHeader_id)
      .subscribe(result => {
        this.spinner.hide()
        this.gstValidResp = result
        this.displayData = [
          { label: 'Validated By', value: this.gstValidResp?.created_by },
          { label: 'Validated Date', value: this.datepipe.transform(this.gstValidResp?.created_date, 'dd-MMM-yyyy HH:mm') },
          { label: 'GST Filing Date', value: this.datepipe.transform(this.gstValidResp?.gst_filing_date, 'MMM-yyyy ') },
          { label: 'GST Status', value: this.gstValidResp?.gst_status },
          { label: 'GST Trading Name', value: this.gstValidResp?.gst_trading_name },
          { label: 'GST Type', value: this.gstValidResp?.gst_type },
          { label: 'GST Valid', value: this.gstValidResp?.gst_valid },
          { label: 'GST No.', value: this.gstValidResp?.gstno },
          { label: 'Level', value: this.gstValidResp?.level },
          { label: 'PAN No.', value: this.gstValidResp?.panno },
        ];
        // this.supGstFiling_list = result.gst_filing_list

        let filinglist = result.gst_filing_list
        if (filinglist == undefined || filinglist == null)
          filinglist = ''
        this.supGstFiling_list = filinglist

        if (result?.gst_valid == undefined) {
          this.SupGSTChecked = false
        }
        else {
          this.SupGSTChecked = true
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.spinner.hide();
      })
  }
  supGstFiling_list = ''
  suppGstValidChk() {
    this.service.getBracnhGSTNo(this.frmInvHdr.value.suppliergst)
      .subscribe(res => {
        console.log("gstres", res)
        let data = res.validation_status
        let level = this.movedata == 'AP' ? 'AP Maker' : 'AP Approver'
        data.apinvoiceheader_id = this.apinvHeader_id
        data.level = level
        this.service.gstValidChk(data)
          .subscribe(res => {
            console.log("res", res)
            this.gstValidResp = res
            // this.supGstFiling_list =JSON.stringify( this.gstValidResp?.filing_list)
            this.displayData = [
              { label: 'Validated By', value: this.gstValidResp?.created_by },
              { label: 'Validated Date', value: this.datepipe.transform(this.gstValidResp?.created_date, 'dd-MMM-yyyy HH:mm') },
              { label: 'GST Filing Date', value: this.datepipe.transform(this.gstValidResp?.gst_filing_date, 'MMM-yyyy ') },
              { label: 'GST Status', value: this.gstValidResp?.gst_status },
              { label: 'GST Trading Name', value: this.gstValidResp?.gst_trading_name },
              { label: 'GST Type', value: this.gstValidResp?.gst_type },
              { label: 'GST Valid', value: this.gstValidResp?.gst_valid },
              { label: 'GST No.', value: this.gstValidResp?.gstno },
              { label: 'Level', value: this.gstValidResp?.level },
              { label: 'PAN No.', value: this.gstValidResp?.panno },
            ];
            this.supGstFiling_list = res.gst_filing_list
            this.gst_summary()
            this.SupGSTChecked = true
          })
      },
        error => {
          this.notification.showWarning("GST validation failure")
          this.spinner.hide();
        }
      )
  }

  uploadPopShow = false
  UploadPopupOpen() {
    // this.uploadPopShow = true
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("fileUploaddpopup"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }


  fileUploadClose() {
    this.uploadPopShow = false
    this.fileuploadBack.nativeElement.click()
  }


  // UploadPopupOpen(){
  //   // this.uploadPopShow = true
  //   this.popupopen11()

  // }
  // popupopen11() {
  // var myModal = new (bootstrap as any).Modal(
  // document.getElementById("fileUploaddpopup"),
  // {
  //   backdrop: 'static',
  //   keyboard: false
  // }
  // );
  // myModal.show();
  // }

  approverpopup() {
    this.approval_pop();
    this.remarks_heading = "Approver & Pay";
    this.submit_approver = 1;
  }
  modifypopup() {
    this.approval_pop();
    this.remarks_heading = "Modify";
    this.submit_approver = 2;
  }
  reauditappopup() {
    this.approval_pop();
    this.remarks_heading = "Re-Audit";
    this.submit_approver = 3;
  }
  approval_pop() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("approval_popup"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();

  }

  // ecfap_view() {
  //   this.popupopen6();
  // }
  // popupopen6() {
  //   var myModal = new (bootstrap as any).Modal(
  //     document.getElementById("create-ecf-0004"),
  //     {
  //       backdrop: "static",
  //       keyboard: false,
  //     }
  //   );
  //   myModal.show();
  // }


  dedupe_popup() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0011"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  // dedupe exact match
  Summary_exactmatch: any = [
    { columnname: "Invoice Number", key: "invoiceno" },
    {
      columnname: "Invoice Date", key: "invoice_date", type: "Date",
      datetype: "dd-MMM-yyyy",
    },
    {
      columnname: "Invoice Header Amount",
      key: "invoiceamount",

    },
    {
      columnname: "Status", key: "status", type: "object",
      objkey: "text",
    },
    {
      columnname: "CR No",
      key: "crno",

    },
    {
      columnname: "Supplier Name",
      key: "supplier",
      type: "object",
      objkey: "name",
    },
    {
      columnname: "Branch Name", key: "branch", type: "object",
      objkey: "name",
    },
    {
      columnname: "Employee Name",
      key: "raised_empname",
    },
  ];

  SummaryObj_exactmatch_New: any
  exact_match() {
    this.SummaryObj_exactmatch_New = {
      method: "get",
      url: this.ecfURL + "ecfapserv/ecfdedupe_check/" + this.checkInvID,
      params: "&type=" + this.dedupeChkType[0],
    };
  }

  // dedupe without supplier
  Summary_without_supp: any = [
    { columnname: "Invoice Number", key: "invoiceno" },
    {
      columnname: "Invoice Date", key: "invoice_date", type: "Date",
      datetype: "dd-MMM-yyyy",
    },
    {
      columnname: "Invoice Header Amount",
      key: "invoiceamount",

    },
    {
      columnname: "Status", key: "status", type: "object",
      objkey: "text",
    },
    {
      columnname: "CR No",
      key: "crno",

    },
    {
      columnname: "Supplier Name",
      key: "supplier",
      type: "object",
      objkey: "name",
    },
    {
      columnname: "Branch Name", key: "branch", type: "object",
      objkey: "name",
    },
    {
      columnname: "Employee Name",
      key: "raised_empname",
    },
  ];

  SummaryObj_without_supp_New: any
  without_supp() {
    this.SummaryObj_without_supp_New = {
      method: "get",
      url: this.ecfURL + "ecfapserv/ecfdedupe_check/" + this.checkInvID,
      params: "&type=" + this.dedupeChkType[1],
    };
  }

  // dedupe without invoice amount
  Summary_without_inv_amnt: any = [
    { columnname: "Invoice Number", key: "invoiceno" },
    {
      columnname: "Invoice Date", key: "invoice_date", type: "Date",
      datetype: "dd-MMM-yyyy",
    },
    {
      columnname: "Invoice Header Amount",
      key: "invoiceamount",

    },
    {
      columnname: "Status", key: "status", type: "object",
      objkey: "text",
    },
    {
      columnname: "CR No",
      key: "crno",

    },
    {
      columnname: "Supplier Name",
      key: "supplier",
      type: "object",
      objkey: "name",
    },
    {
      columnname: "Branch Name", key: "branch", type: "object",
      objkey: "name",
    },
    {
      columnname: "Employee Name",
      key: "raised_empname",
    },
  ];

  SummaryObj_without_inv_amnt_New: any
  without_inv_amnt() {
    this.SummaryObj_without_inv_amnt_New = {
      method: "get",
      url: this.ecfURL + "ecfapserv/ecfdedupe_check/" + this.checkInvID,
      params: "&type=" + this.dedupeChkType[2],
    };
  }

  // dedupe without invoice number
  Summary_without_inv_no: any = [
    { columnname: "Invoice Number", key: "invoiceno" },
    {
      columnname: "Invoice Date", key: "invoice_date", type: "Date",
      datetype: "dd-MMM-yyyy",
    },
    {
      columnname: "Invoice Header Amount",
      key: "invoiceamount",

    },
    {
      columnname: "Status", key: "status", type: "object",
      objkey: "text",
    },
    {
      columnname: "CR No",
      key: "crno",

    },
    {
      columnname: "Supplier Name",
      key: "supplier",
      type: "object",
      objkey: "name",
    },
    {
      columnname: "Branch Name", key: "branch", type: "object",
      objkey: "name",
    },
    {
      columnname: "Employee Name",
      key: "raised_empname",
    },
  ];

  SummaryObj_without_inv_no_New: any
  without_inv_no() {
    this.SummaryObj_without_inv_no_New = {
      method: "get",
      url: this.ecfURL + "ecfapserv/ecfdedupe_check/" + this.checkInvID,
      params: "&type=" + this.dedupeChkType[3],
    };
  }

  // dedupe without invoice date
  Summary_without_inv_date: any = [
    { columnname: "Invoice Number", key: "invoiceno" },
    {
      columnname: "Invoice Date", key: "invoice_date", type: "Date",
      datetype: "dd-MMM-yyyy",
    },
    {
      columnname: "Invoice Header Amount",
      key: "invoiceamount",

    },
    {
      columnname: "Status", key: "status", type: "object",
      objkey: "text",
    },
    {
      columnname: "CR No",
      key: "crno",

    },
    {
      columnname: "Supplier Name",
      key: "supplier",
      type: "object",
      objkey: "name",
    },
    {
      columnname: "Branch Name", key: "branch", type: "object",
      objkey: "name",
    },
    {
      columnname: "Employee Name",
      key: "raised_empname",
    },
  ];

  SummaryObj_without_inv_date_New: any
  without_inv_date() {
    this.SummaryObj_without_inv_date_New = {
      method: "get",
      url: this.ecfURL + "ecfapserv/ecfdedupe_check/" + this.checkInvID,
      params: "&type=" + this.dedupeChkType[4],
    };
  }

  SummarygstvalidData: any = [
    { columnname: "GSTR1 FILING DATE", key: "GSTR1FILINGDATE" },
    { columnname: "GSTR3B FILING DATE", key: "GSTR3BFILINGDATE" },
    { columnname: "Month", key: "MONTH" }
  ]
  SummaryApigstvalidObjNew: any;
  gst_summary() {
    this.SummaryApigstvalidObjNew = {
      FeSummary: true,
      data: this.supGstFiling_list
    }
  }
  supplier_popup() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("invoice-detail-0303"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  Apsuppliersearch: any = [
    { "type": "input", "label": "Supplier GST Number", "formvalue": "gstno" },
    { "type": "input", "label": "Supplier Code", "formvalue": "code" },
    { "type": "input", "label": "PAN Number", "formvalue": "panno" },
  ]
  ecfabs: any;
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

  popupopen16() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("SaveYesOrNo"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
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

  ppxselected:boolean = true
  crnselected:boolean = true
  selectedCrnLines : any[]=[]
  ppxdisable: boolean[] = [];
  crnliqdisable: boolean[] = [];
crnliqselect(e, ind) {
  const ppxFormArray = this.ppxForm.get('crndtl') as FormArray;
  const selectedControl = ppxFormArray.at(ind);
  // this.selectedcrndata =[]
  if (e.checked) {
    this.crnselected = false;

    if (
      !selectedControl.get('liquidate_amt')?.value ||
      selectedControl.get('liquidate_amt')?.value === 0
    ) {
      this.notification.showError("Please Enter Liquidation Amount");
      selectedControl.get('select')?.setValue(false, { emitEvent: false });
      this.crnselected = true;
      return;
    }

    const currentValue = selectedControl.value;
    const existingIndex = this.selectedCrnLines.findIndex(x => x.crno === currentValue.crno);
    if (existingIndex !== -1) {
      this.selectedCrnLines[existingIndex] = currentValue;
    } else {
      this.selectedCrnLines.push(currentValue);
    }
    const existingDataIndex = this.selectedcrndata.findIndex(x => x.crno === currentValue.crno);
    if (existingDataIndex !== -1) {
      this.selectedcrndata[existingDataIndex] = currentValue;
    } else {
      this.selectedcrndata.push(currentValue);
    }
    // this.ppxdisable[ind] = false;
    // this.crnliqdisable[ind] = true;
  } else {
    // this.ppxdisable[ind] = true;
    // this.crnliqdisable[ind] = false;

    const currentValue = selectedControl.value;
    this.selectedCrnLines = this.selectedCrnLines.filter(x => x.crno !== currentValue.crno);
    this.selectedcrndata = this.selectedcrndata.filter(x => x.crno !== currentValue.crno);
    this.crnselected = this.selectedCrnLines.length === 0;
  }
  this.getCRNsum();
}

    submitcrnliq(){
    const ppxFormArray = this.ppxForm.get('crndtl') as FormArray;
    const ppxForm = this.ppxForm.value.crndtl;
  
    let ppxselected = false;

    let selectedAdvance: any[] = [];

    this.selectedCrnLines.forEach((formData, index) => {
      if (formData.disable) return;
      const amt = +(String(formData.liquidate_amt).replace(/,/g, '')) || 0;
      if (amt <= 0) {
        this.notification.showError("Please give a valid amount to liquidate.");
        return;
      }

      this.selectedCrnLines[index].disable = true;

      const submittedData = {
        ...formData,
        disable: true
      };
    
      this.selectedcrndata.push(submittedData);
      selectedAdvance.push(submittedData);

      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl;
  for (let i in creditdtlsdatas) {
    const creditItem = creditdtlsdatas[i];
    const paymode = creditItem?.paymode_id?.code;
    const refno = creditItem?.refno;
    const amount = +(String(creditItem.amountchange).replace(/,/g, '')) || 0;

    if (paymode === 'PM009' && amount > 0) {
      const matchedPPX = {
        ...creditItem,
        crno: refno,
        liquidate_amt: creditItem.amountchange,
        disable: true
      };

      // Prevent duplicates
      const alreadyExists = this.selectedcrndata.some(item => item.crno === refno);
      if (!alreadyExists) {
        this.selectedcrndata.push(matchedPPX);
        // selectedAdvance.push(matchedPPX);
      }
    }
  }
  
    });
  

    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl;
  
    // Check if Liquidate Amount exceeds Invoice Amount
    if (this.crnsum > this.totalamount || this.crnsum > creditdtlsdatas[0].amount) {
      this.notification.showError("Liquidate Amount should not exceed the Invoice amount.");
      return false;
    }
  
    if (selectedAdvance.length === 0) {
      this.notification.showError("Please select an Advance No. and give amount to Liquidate.");
      return;
    }
  
    const invalidAdvance = selectedAdvance.find(adv =>
      !adv.liquidate_amt || Number(String(adv.liquidate_amt).replace(/,/g, '')) <= 0
    );
  
    if (invalidAdvance) {
      this.notification.showError("Please give a valid amount to liquidate for all selected advances.");
      return;
    }

    const creditdtlFormArray = this.InvoiceDetailForm.get('creditdtl') as FormArray;

  
    selectedAdvance.forEach((adv) => {
      this.addcreditSection(0, 'PM009');
      const newIndex = creditdtlFormArray.length - 1;
  
      const creditGroup = creditdtlFormArray.at(newIndex);
      creditGroup.get('ddtranbranch')?.setValue(adv.raiserbranch);
      creditGroup.get('refno')?.setValue(adv.crno);
      creditGroup.get('glno')?.setValue(adv.credit_glno);
      creditGroup.get('amountchange')?.setValue(adv.liquidate_amt);
      creditGroup.get('category_code')?.setValue(adv.adv_debit_cat_code);
      creditGroup.get('subcategory_code')?.setValue(adv.adv_debit_subcat_code);
    });
  
  
    const ppxcontrol = this.ppxForm.get('ppxdtl') as FormArray;
    ppxcontrol.clear();
    this.closecrnliq()
    this.closeppxbuttoncrn.nativeElement.click();
    this.selectedCrnLines = []
  
    console.log("this.selectedcrndata==", this.selectedcrndata);
  }

    updateFormArray() {
    const ppxArray = this.ppxForm.get('ppxdtl') as FormArray;
    const crnArray = this.ppxForm.get('crndtl') as FormArray;
    ppxArray.clear();
    crnArray.clear();
// if(this.iscrn == false){
    this.ppxdata.forEach(item => {
        let ppxheader_amount
        let ppxheader_balance
        let num: number = +item.ppxheader_amount
        let amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        ppxheader_amount = amt
  
        let bal =+item.ppxheader_balance
        num = bal
        amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        ppxheader_balance = amt

      ppxArray.push(this.formBuilder.group({
        crno: [item.invoiceheader_crno],
        name: [item.payto_name],
        raiserbranch: [item.raiser_branch?.name + '-' + item.raiser_branch?.code],
        ppxheader_date: [this.datepipe.transform(item.ppxheader_date, 'dd-MMM-yyyy')],
        ppxheader_amount: [ppxheader_amount],
        ppxheader_balance: [ppxheader_balance],
        ecf_amount: [item.ecf_amount],
        liquidate_amt: [item.liquidate_amt],
        select:[item.select],
        id:[item.id],
        ecfheader_id:[item.ecfheader_id],
        credit_glno:[item.adv_debit_glno],
        ppxdetails:[item.ppxdetails],
        adv_debit_cat_code:[item.adv_debit_cat_code],
        adv_debit_subcat_code:[item.adv_debit_subcat_code],
        adv_debit_cc_code:[item.adv_debit_cc_code],
        adv_debit_bs_code:[item.adv_debit_bs_code]
      }));
  
    });
    
    if (this.selectedppxdata.length > 0) {
      // Loop through form and update selection based on `selectedppxdata`
      const ppxFormArray = this.ppxForm.get('ppxdtl') as FormArray;

      ppxFormArray.controls.forEach((control) => {
        const crno = control.get('crno')?.value;
        const balance = control.get('ppxheader_balance')?.value;

        // If crno & balance match, set checkbox to true and disable `liquidate_amt`
        const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
   
        if(this.selectedPpxLines.length > 0){
          ppxFormArray.controls.forEach((control, i) => {
            const ppxItem = this.ppxdata[i];
            const match = this.selectedPpxLines.find(sel => 
              (sel.crno || sel.invoiceheader_crno) === ppxItem.invoiceheader_crno
            );
          
            if (match) {
              control.get('select')?.setValue(true, { emitEvent: false });
              control.get('liquidate_amt')?.setValue(match.liquidate_amt);
            }
          });
        }
       
      for (let i in creditdtlsdatas)
      {         
        if(creditdtlsdatas[i].paymode_id.code == 'PM006' && creditdtlsdatas[i].refno == crno)
        {
          if (creditdtlsdatas) {
            control.get('select')?.setValue(true, { emitEvent: false }); // Automatically check the box
            control.get('liquidate_amt')?.setValue(creditdtlsdatas[i].amount); // Set liquidate amount
            control.get('liquidate_amt')?.disable(); // Disable the field so users can't edit
            control.get('select')?.disable(); // Disable checkbox to prevent deselection (if required)
          } else {
            control.get('select')?.enable(); // Enable checkbox if no match
            control.get('liquidate_amt')?.enable(); // Enable liquidate amount field for manual input
            control.get('liquidate_amt')?.setValue(''); // Clear value if there's no match
          }
        }
      }

      });
    }else if(this.selectedPpxLines.length> 0){
      const ppxFormArray = this.ppxForm.get('ppxdtl') as FormArray;
      ppxFormArray.controls.forEach((control, i) => {
        const ppxItem = this.ppxdata[i];
        const match = this.selectedPpxLines.find(sel => 
          (sel.crno || sel.invoiceheader_crno) === ppxItem.invoiceheader_crno
        );
      
        if (match) {
          control.get('select')?.setValue(true, { emitEvent: false });
          control.get('liquidate_amt')?.setValue(match.liquidate_amt);
        }
      });
  }
// }
// if(this.iscrn == true){
   this.crndata.forEach(item => {
        let ppxheader_amount
        let ppxheader_balance
        let num: number = +item.ppxheader_amount
        let amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        ppxheader_amount = amt
  
        let bal =+item.ppxheader_balance
        num = bal
        amt = new Intl.NumberFormat("en-GB").format(num); 
        amt = amt ? amt.toString() : '';
        ppxheader_balance = amt

      crnArray.push(this.formBuilder.group({
        crno: [item.invoiceheader_crno],
        name: [item.payto_name],
        raiserbranch: [item.raiser_branch?.name + '-' + item.raiser_branch?.code],
        ppxheader_date: [this.datepipe.transform(item.ppxheader_date, 'dd-MMM-yyyy')],
        ppxheader_amount: [ppxheader_amount],
        ppxheader_balance: [ppxheader_balance],
        ecf_amount: [item.ecf_amount],
        liquidate_amt: [item.liquidate_amt],
        select:[false],
        id:[item.id],
        ecfheader_id:[item.ecfheader_id],
        credit_glno:[item.adv_debit_glno],
        ppxdetails:[item.ppxdetails],
        adv_debit_cat_code:[item.adv_debit_cat_code],
        adv_debit_subcat_code:[item.adv_debit_subcat_code],
        adv_debit_cc_code:[item.adv_debit_cc_code],
        adv_debit_bs_code:[item.adv_debit_bs_code]
      }));
  
    });
    if (this.selectedcrndata.length > 0) {
      // Loop through form and update selection based on `selectedppxdata`
      const ppxFormArray = this.ppxForm.get('crndtl') as FormArray;

      ppxFormArray.controls.forEach((control) => {
        const crno = control.get('crno')?.value;
        const balance = control.get('ppxheader_balance')?.value;

        // If crno & balance match, set checkbox to true and disable `liquidate_amt`
        const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
   
        if(this.selectedCrnLines.length > 0){
          ppxFormArray.controls.forEach((control, i) => {
            const ppxItem = this.crndata[i];
            const match = this.selectedCrnLines.find(sel => 
              (sel.crno || sel.invoiceheader_crno) === ppxItem.invoiceheader_crno
            );
          
            if (match) {
              control.get('select')?.setValue(true, { emitEvent: false });
              control.get('liquidate_amt')?.setValue(match.liquidate_amt);
            }
          });
        }
       
      for (let i in creditdtlsdatas)
      {         
        if(creditdtlsdatas[i].paymode_id.code == 'PM009' && creditdtlsdatas[i].refno == crno)
        {
          if (creditdtlsdatas) {
            control.get('select')?.setValue(false); // Automatically check the box
            control.get('liquidate_amt')?.setValue(creditdtlsdatas[i].amount); // Set liquidate amount
            control.get('liquidate_amt')?.disable(); // Disable the field so users can't edit
            control.get('select')?.disable(); // Disable checkbox to prevent deselection (if required)
          } else {
            control.get('select')?.enable(); // Enable checkbox if no match
            control.get('liquidate_amt')?.enable(); // Enable liquidate amount field for manual input
            control.get('liquidate_amt')?.setValue(''); // Clear value if there's no match
          }
        }
      }

      });
    }else if(this.selectedCrnLines.length> 0){
      const ppxFormArray = this.ppxForm.get('crndtl') as FormArray;
      ppxFormArray.controls.forEach((control, i) => {
        const ppxItem = this.crndata[i];
        const match = this.selectedCrnLines.find(sel => 
          (sel.crno || sel.invoiceheader_crno) === ppxItem.invoiceheader_crno
        );
      
        if (match) {
          control.get('select')?.setValue(true, { emitEvent: false });
          control.get('liquidate_amt')?.setValue(match.liquidate_amt);
        }
      });
  }
  // }
  }
currentPage = 1
currentPageppx = 1;

handlepageEvent(event: any) {
  this.pageIndexppx = event.pageIndex;
  this.pageSize_ppx = event.pageSize;
  this.ppxCurrentPage = this.pageIndexppx + 1; 
  this.getppxdata(this.ppx_id, this.ppxCurrentPage, this.liqflag);
}

handlepageCrnEvent(event: any) {
  this.pageIndexcrn = event.pageIndex;
  this.pageSize_crn = event.pageSize;
  this.currentPagecrn = this.pageIndexcrn + 1;  
  this.getcrndata(this.crn_id, this.currentPagecrn, 0);
}

pageIndexcrn = 0;
pageSize_crn = 5;
currentPagecrn = 1;


  ppx_supplier:any
  ppx_branch:any
  selectedPpxLines: any[] = [];
  length_crn=0;
  getcrndata(id,pagenumber,val){
            this.crndata = []
          let flag = val  
        this.service.getppxheader(this.crn_id,pagenumber,0).subscribe(result => {
          if (result['data'] != undefined) {
            let crndata = result['data']
            this.length_crn = result.count;
            // this.liqflag = result.liquidation_flag == "mono" ? 1 : 0
            // let crndata = datas.filter(x => (Number(x.AP_liquedate_limit) > 0 ))
            for(let i=0; i<crndata.length; i++)
            {
              let crndetails = crndata[i].ppxdetails.data
              let current_crno
              if(crndetails.length>0)
              {
                current_crno = crndetails.filter(x => x.current_crno == this.crno)[0]?.current_crno
                if(current_crno == undefined && crndata[i].AP_liquedate_limit <=0)
                {
                  delete crndata[i]
                  continue;
                }
                if(current_crno == undefined && crndata[i].liquedate_limit <=0)
                {
                  delete crndata[i]
                  continue;
                }
                if(crndata[i].AP_liquedate_limit < crndata[i].liquedate_limit)
                {
                  crndata[i].AP_liquedate_limit = crndata[i].liquedate_limit
                }
              }
              else if(crndata[i].AP_liquedate_limit <= 0)
                delete crndata[i]
            }
            console.log("crndata----", crndata)
            for(let i=0; i<crndata.length; i++)
            {
              if(crndata[i] != undefined && crndata[i] != null)
              this.crndata.push(crndata[i])
            }
            if (this.crndata.length >0)
            {
              this.showcrnnotify = true
            }
            else
            {
              this.showcrnnotify = false
            }
          }else{
            this.notification.showError(result.description)
            return false
          }
           this.updateFormArray();
             },
          error => {
            this.spinner.hide();
          })
        
           this.getCRNsum()
      
  }
  

  liqflag:any
  getppxdata(id,pagenumber,val){
    this.ppxdata = []
    let flag = val
    if(flag == 0){
         this.service.getppxheader(id,pagenumber,flag).subscribe(result => {
            if (result) {
              let ppxdata = result['data'] ? result['data'] : []
              this.spinner.hide();
              this.ppxpagination = result?.pagination
              this.ppxcount= result.count;
              this.length_ppx = result.count;
              this.liqflag = result.liquidation_flag == "mono" ? 1 : 0
              // ppxdata = ppxdata.filter(x => x.raiser_branch.code == this.invHdrRes.branchdetails_id.code)
              for (let i = 0; i < ppxdata.length; i++) {
                let ppxdetails = ppxdata[i].ppxdetails.data
                let current_crno
                ppxdata[i].crno = ppxdata[i].invoiceheader_crno               
                if (ppxdetails.length > 0) {
                  current_crno = ppxdetails.filter(x => x.current_crno == this.crno)[0]?.current_crno
                  if (current_crno == undefined && ppxdata[i].ppxdetails_balance <= 0) {
                    delete ppxdata[i]
                    continue;
                  }
                }
                else if (ppxdata[i].ppxdetails_balance <= 0)
                  delete ppxdata[i]
              }
              console.log("ppxdata----", ppxdata)
              for (let i = 0; i < ppxdata.length; i++) {
                if (ppxdata[i] != undefined && ppxdata[i] != null)
                  this.ppxdata.push(ppxdata[i])
              }
              if (this.ppxdata.length > 0) {
                this.checkAdvance = true
              }
              else {
                this.checkAdvance = false
              }
            }
            this.updateFormArray() 
          })
    }
    if(flag == 1){
       this.service.getppxheader(id,pagenumber,flag).subscribe(result => {
            if (result) {
              let ppxdata = result['data'] ? result['data'] : []
              let micro_data = result['micro_data'] ? result['micro_data'] : [];
              this.spinner.hide();
              this.ppxpagination = result?.pagination
              this.ppxcount= result.count;
              this.length_ppx = result.count;
              this.liqflag = result.liquidation_flag == "mono" ? 1 : 0
              // ppxdata = ppxdata.filter(x => x.raiser_branch.code == this.invHdrRes.branchdetails_id.code)
              for (let i = 0; i < ppxdata.length; i++) {
                let ppxdetails = ppxdata[i]
                let current_crno
                ppxdata[i].crno = ppxdata[i].invoiceheader_crno
                let liquidated = micro_data.filter(x => x.refno == ppxdata[i].invoiceheader_crno);
                let liq_amts = liquidated.map(x => Number(x.amount));
                let sum_of_liqamt = liq_amts.reduce((a, b) => a + b, 0);
                let ecfqty = ppxdata[i].ecfqty ? Number(ppxdata[i].ecfqty) : 0;
                ppxdata[i].ppxheader_balance = Number(ppxdata[i].ppxheader_balance) - sum_of_liqamt - ecfqty;
                if (ppxdetails.length > 0) {
                  current_crno = ppxdetails.filter(x => x.current_crno == this.crno)[0]?.current_crno
                  if (current_crno == undefined && ppxdata[i].ppxdetails_balance <= 0) {
                    delete ppxdata[i]
                    continue;
                  }
                }
                else if (ppxdata[i].ppxdetails_balance <= 0)
                  delete ppxdata[i]
              }
              console.log("ppxdata----", ppxdata)
              for (let i = 0; i < ppxdata.length; i++) {
                if (ppxdata[i] != undefined && ppxdata[i] != null)
                  this.ppxdata.push(ppxdata[i])
              }
              if (this.ppxdata.length > 0) {
                this.checkAdvance = true
              }
              else {
                this.checkAdvance = false
              }
            }
            this.updateFormArray() 
          })
    }
          this.getPPXsum()
  }
    closecrnliq() {
    this.showppxmodal = false
    this.closeppxbuttoncrn.nativeElement.click();
  this.pageIndexppx = 0;
  this.currentPageppx = 1;
  this.pageIndexcrn = 0;
  this.currentPagecrn = 1;
    const credForm = this.InvoiceDetailForm.value.creditdtl
    if (credForm[this.getcreditindex].refno == '' || credForm[this.getcreditindex].refno == undefined)
      this.removecreditSection(this.getcreditindex, credForm[this.getcreditindex].paymode_id?.name, 0)
    if (this.selectedcrndata.length == 0) {
      // const credForm = this.InvoiceDetailForm.value.creditdtl
      for (let i = 0; i < credForm.length; i++) {
        if (credForm[i].paymode_id?.code == 'PM009') {
          if (credForm[i].id != undefined) {
            this.spinner.show();
            this.service.credDebitDel(credForm[i].id)
              .subscribe(result => {
                this.spinner.hide();

                if (result.status == "success") {
                  this.removecreditSection(i, credForm[i].paymode_id?.name, 0)
                }
                else {
                  this.notification.showError(result.description)
                }
              })
          }
          else {
            this.removecreditSection(i, credForm[i].paymode_id?.name, 0)
          }
        }
      }
    }
  }


getSerial(index: number): string {
  const rowNumber = Math.floor(index / 26) + 1;        
  const charCode = 97 + (index % 26);                 
  return rowNumber + String.fromCharCode(charCode);    
}

 get poinvdetails(): FormArray {
  return this.POInvoiceDetailForm.get('podetls') as FormArray;
}

createPODetail(): FormGroup {
 let group = new FormGroup({
   productname: new FormControl(''),
  hsn: new FormControl(''),
  hsn_percentage: new FormControl(''),
  unitprice: new FormControl(''),
  quantity: new FormControl(''),
  amount: new FormControl(''),
  discount: new FormControl(''),
  taxable_amount: new FormControl(''),
  cgst: new FormControl(''),
  sgst: new FormControl(''),
  igst: new FormControl(''),
  taxamount: new FormControl(''),
  totalamount: new FormControl(''),
  is_rcmproduct: new FormControl(''),
  is_blockedproduct: new FormControl(''),
  uom: new FormControl('')
  })
      this.valueChangesSubscription = group.get('productname')?.valueChanges
      .pipe(
        debounceTime(1500),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => {
          if (!value || typeof value === 'object') {
            this.isLoading = false;
            return of([]);
          }
          let Value
          if (value.name == undefined) {
            Value = value
          } else {
            Value = value.name
          }
          return this.service.getpoproductscroll(this.po_prod_id,1,Value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
        })
      )
      .subscribe((results: any) => {
        this.isLoading = true;
        if (results) {
          let datas = results["data"];
          this.poprodList = datas;
          this.isLoading = false;
        }
      })



    group.get('hsn').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.service.gethsnscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              if (value === "" || value.id === undefined) {
                this.POInvoiceDetailForm.get('podetls')['controls'][this.hsnindex].get('hsn_percentage').reset()
                this.POInvoiceDetailForm.get('podetls')['controls'][this.hsnindex].get('cgst').reset(0)
                this.POInvoiceDetailForm.get('podetls')['controls'][this.hsnindex].get('sgst').reset(0)
                this.POInvoiceDetailForm.get('podetls')['controls'][this.hsnindex].get('igst').reset(0)
                this.POInvoiceDetailForm.get('podetls')['controls'][this.hsnindex].get('taxamount').reset(0)
                 this.POcalcRow(group); 
              }
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
        this.linesChange.emit(this.POInvoiceDetailForm.value['podetls']);
      })


    group.get('unitprice').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
       this.POcalcRow(group); 
      // this.datasums()
      if (!this.POInvoiceDetailForm.valid) {
        return;
      }

      this.linesChange.emit(this.POInvoiceDetailForm.value['podetls']);
    }
    )


    group.get('quantity').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
       this.POcalcRow(group); 
      if (!this.POInvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.POInvoiceDetailForm.value['podetls']);
    }
    )


    group.get('taxable_amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
       this.POcalcRow(group); 
      if (!this.POInvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.POInvoiceDetailForm.value['podetls']);
    }
    )

    group.get('sgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

       this.POcalcRow(group); 
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.POInvoiceDetailForm.value['podetls']);
    }
    )

    group.get('cgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

       this.POcalcRow(group); 
      if (!this.POInvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.POInvoiceDetailForm.value['podetls']);
    }
    )

    group.get('igst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

       this.POcalcRow(group); 
      if (!this.POInvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.POInvoiceDetailForm.value['podetls']);
    }
    )

    group.get('amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
       this.POcalcRow(group); 
      if (!this.POInvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.POInvoiceDetailForm.value['podetls']);
    }
    )

    group.get('taxamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
       this.POcalcRow(group); 
      if (!this.POInvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.POInvoiceDetailForm.value['podetls']);
    }
    )

    group.get('discount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
       this.POcalcRow(group); 
      if (!this.POInvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.POInvoiceDetailForm.value['podetls']);
    }
    )
    return group;
}
  // POcalcTotalM(group: FormGroup) {
  //   const Unitprice = +String(group.controls['unitprice'].value).replace(/,/g, '');
  //   const quantity = +String(group.controls['quantity'].value).replace(/,/g, '');
  //   // const discounts = +String(group.controls['discount'].value).replace(/,/g, '');
  //   // const roundoff = +group.controls['roundoffamt'].value;
  //   let num = quantity * Unitprice

  //   let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(+num);
  //   amt = amt ? amt.toString() : '';
  //   group.controls['amount'].setValue((amt), { emitEvent: false });

  //   this.totaltaxable = +num 
  //   let tottax = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.totaltaxable);
  //   tottax = tottax ? tottax.toString() : '';
  //   group.controls['taxable_amount'].setValue((tottax), { emitEvent: false });

  //   let taxamount = +String(group.controls['taxamount'].value).replace(/,/g, '');
  //   this.overalltotal = this.totaltaxable + taxamount

  //   num = +this.overalltotal
  //   let tot = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  //   tot = tot ? tot.toString() : '';
  //   group.controls['totalamount'].setValue((tot), { emitEvent: false });
  //   this.POINVdatasums();
  // }
addinvpodetails(){
 this.poinvdetails.push(this.createPODetail());
}
grncode:any
pounitprice = 0;
poinvaddflag = false;
poinvdtlindex:any
// addpodetails(invdtlindex) {
//     this.grncode = (this.InvoiceDetailForm.get('invoicedtls') as FormArray).at(invdtlindex).get('grn_code')?.value ?? "";
//     this.pounitprice = (this.InvoiceDetailForm.get('invoicedtls') as FormArray).at(invdtlindex).get('taxable_amount')?.value ?? 0;
//     this.poinvdtlindex = invdtlindex
//     this.poinvdetails.clear();
//     this.poinvdetails.push(this.createPODetail());
//    var myModal = new (bootstrap as any).Modal(
//       document.getElementById("addpocomponent"),
//       {
//         backdrop: 'static',
//         keyboard: false
//       }
//     );
//     myModal.show();  
// }

addpodetails(invdtlindex) {
  this.grncode = (this.InvoiceDetailForm.get('invoicedtls') as FormArray)
                   .at(invdtlindex).get('grn_code')?.value ?? "";
  this.pounitprice = (this.InvoiceDetailForm.get('invoicedtls') as FormArray)
                      .at(invdtlindex).get('taxable_amount')?.value ?? 0;
  this.poinvdtlindex = invdtlindex;
  const rowChildData = this.savedChildDataMap[invdtlindex];
  if (rowChildData?.length > 0) {
    this.getpodetailsdata([...rowChildData], invdtlindex);
  } 
  else if (this.invDetailList?.length > 0) {
    this.getpatchpodetailsdata(this.invDetailList, invdtlindex);
  }  else {
    this.poinvdetails.clear();
    this.poinvdetails.push(this.createPODetail());
  }

  var myModal = new (bootstrap as any).Modal(
    document.getElementById("addpocomponent"),
    {
      backdrop: 'static',
      keyboard: false
    }
  );
  myModal.show();  
  this.currentpage_poprod = 1;
}


deletepoinvdetail(section, ind: number) {
  const answer = window.confirm("Are you sure to delete?");
  if (!answer) return false;
  // const detailsArray = this.POInvoiceDetailForm.get('podetls') as FormArray;
  // if (detailsArray) {
  //   detailsArray.removeAt(ind); 
  // }
   this.poinvdetails.removeAt(ind);
  this.notification.showSuccess("Deleted successfully");
}

 poinvDtlChangeToCurrency(ctrlname, i) {
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = this.POInvoiceDetailForm.get('podetls')['controls'][i].get(ctrlname).value;
      a = a.replace(/,/g, "");
      if (a && !isNaN(+a)) {
        let num: number = +a;
        num = + (Math.floor(num * 100) /100);
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal' }).format(num);
        temp = temp ? temp.toString() : '';
        this.POInvoiceDetailForm.get('podetls')['controls'][i].get(ctrlname).setValue(temp)
      }
    }
  }

  poinvdtlamtDecimalChg(ctrl, ctrlname, i) {
    let amt = ctrl.value
    amt = amt.replace(/,/g, "");

    if (+amt >= 0) {
      // if (ctrlname == 'roundoffamt') {
      //   let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
      //   temp = temp ? temp.toString() : '';
      //   this.POInvoiceDetailForm.get(ctrlname).setValue(temp)
      // }
      // else if (ctrlname == 'otheramount') {
      //   let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
      //   temp = temp ? temp.toString() : '';
      //   this.POInvoiceDetailForm.get(ctrlname).setValue(temp)
      // }
      // else {
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
        temp = temp ? temp.toString() : '';
        this.POInvoiceDetailForm.get('podetls')['controls'][i].get(ctrlname).setValue(temp)
      // }

    }
  }

    pogetgst(index) {
    if ((this.movedata == 'AP' || this.movedata == 'apapproverview')) {
      if (this.frmInvHdr.get('invoicegst').value == true) {
        this.getgstapplicable = 'Y'
        console.log("The Gst Is Applicable")
      }
      if (this.frmInvHdr.get('invoicegst').value == false) {
        this.getgstapplicable = 'N'
        console.log("  Not Applicable")
      }
    }
    if (this.productRCMflag || this.prodBlock[index] == 'Yes')
      return false
    if ((this.aptypeid === 1 && this.getgstapplicable !== "N")) {
      const overalloffIND = this.POInvoiceDetailForm.value.podetls;
      console.log("overalloffIND.....", overalloffIND)
      if (this.prodChange[index] || (!this.prodChange[index] && this.getgstapplicable === "Y")) {
        this.hsncodess = overalloffIND[index]?.hsn?.code;
        console.log("this.hsncodess...", this.hsncodess)
        let id = overalloffIND[index].hsn.id
        let unit = String(overalloffIND[index].unitprice).replace(/,/g, '')
        let units = Number(unit)
        let qtyy: any = Number(String(overalloffIND[index].quantity).replace(/,/g, ''))
        let dis = Number(String(overalloffIND[index].discount).replace(/,/g, ''))
        if (qtyy === null || qtyy === undefined) {
          qtyy = 0
        }

        if ((this.hsncodess === "" || this.hsncodess === undefined || this.hsncodess === null)
          || (qtyy === "" || qtyy === undefined || qtyy === null)
          || (unit === "" || unit === undefined || unit === null) ||
          (this.gsttype === "" || this.gsttype === undefined || this.gsttype === null)) {
          return false
        }

        if ((this.hsncodess !== "" || this.hsncodess !== undefined || this.hsncodess !== null)
          || (qtyy !== "" || qtyy !== undefined || qtyy !== null)
          || (unit !== "" || unit !== undefined || unit !== null)
          || (this.gsttype !== "" || this.gsttype !== undefined || this.gsttype !== null)) {
          let json = {
            "id": id,
            "code": this.hsncodess,
            "unitprice": units,
            "qty": qtyy,
            "discount": dis,
            "type": this.gsttype
          }
          console.log("jsoooon", json)
          this.spinner.show()
          this.service.GSTcalculation(json)
            .subscribe(result => {
              this.spinner.hide()
              this.igstrate = result.igst
              this.sgstrate = result.sgst
              this.cgstrate = result.cgst

              this.totaltax = this.igstrate + this.sgstrate + this.cgstrate


              let num: number = +(this.igstrate)
              let igstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              igstt = igstt ? igstt.toString() : '';


              num = +(this.sgstrate)
              let sgstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              sgstt = sgstt ? sgstt.toString() : '';


              num = +(this.cgstrate)
              let cgstt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              cgstt = cgstt ? cgstt.toString() : '';

              num = +(this.totaltax)
              let tot = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              tot = tot ? tot.toString() : '';

              this.POInvoiceDetailForm.get('podetls')['controls'][index].get('igst').setValue(igstt)
              this.POInvoiceDetailForm.get('podetls')['controls'][index].get('sgst').setValue(sgstt)
              this.POInvoiceDetailForm.get('podetls')['controls'][index].get('cgst').setValue(cgstt)
              this.POInvoiceDetailForm.get('podetls')['controls'][index].get('taxamount').setValue(tot)
            })
        }
      }
    }
  }
    POINVdatasums() {
    this.INVamt = this.POInvoiceDetailForm.value['podetls'].map(x => Number((String(x.totalamount).replace(/,/g, ''))));
    let taxableamts = this.POInvoiceDetailForm.value['podetls'].map(x => Number((String(x.totalamount).replace(/,/g, ''))));
    this.totaltaxable =  taxableamts.reduce((a, b) => a + b,0).toFixed(2) ;
    this.Roundoffsamount = Number(this.POInvoiceDetailForm.value.roundoffamt ?? 0);
    this.OtherAmount = Number(this.POInvoiceDetailForm.value.otheramount ?? 0);
    let INVsum = (this.INVamt.reduce((a, b) => a + b, 0));
    this.INVsum = INVsum+Number(this.Roundoffsamount)+ + this.OtherAmount
    let num: number = +this.INVsum;
    this.INVsum = +(num.toFixed(2))
    if (this.INVsum > 0)
      this.totalamount = this.INVsum
    console.log('this.INVsum', this.INVsum);
  }

   poproductChange(prod: any, ind) {
    this.showrcm[ind] = true
    this.prodChange[ind] = true
    this.prodRcm[ind] = prod.product_isrcm == 'Y' ? 'Yes' : 'No'
    this.prodBlock[ind] = prod.product_isblocked == 'Y' ? 'Yes' : 'No'
    this.product[ind] = prod

    this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('is_rcmproduct').setValue(prod.product_isrcm);
    this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('is_blockedproduct').setValue(prod.product_isblocked);

    console.log("prod value...", prod)
    console.log(prod.product_isrcm)
    if (prod.product_isrcm == "Y") {
      this.productRCMflag = true
    }
    else {
      this.productRCMflag = false
    }


    if (this.productRCMflag || this.prodBlock[ind] == 'Yes') {
      const invdate = new Date(this.frmInvHdr?.value?.invoicedate);
      const currDate = new Date();
      invdate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      if (invdate < currDate) {
        if (!window.confirm('RCM Invoices should be paid within 60 days from the date of Invoice"')) {
          return false
        }
      }
    }
    this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('uom').setValue(prod.uom_id.name)

    if (this.productRCMflag || this.prodBlock[ind] == 'Yes' ||
      (this.productRCMflag == false && this.getgstapplicable == "N" && this.aptypeid != 3 && this.aptypeid != 13)) {
      this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('hsn').setValue(this.NOHSN);
      this.hsn[ind] = this.NOHSN
      this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('hsn_percentage').setValue(this.NOHSN?.igstrate);
      this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('sgst').setValue(0)
      this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('cgst').setValue(0)
      this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('igst').setValue(0)
      this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('taxamount').setValue(0)
    }
    else {
      this.hsn[ind] = prod?.hsn_id ? prod?.hsn_id : this.NOHSN
      this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('hsn').setValue(prod?.hsn_id ? prod?.hsn_id : this.NOHSN);
      this.POInvoiceDetailForm.get('podetls')['controls'][ind].get('hsn_percentage').setValue(prod?.hsn_id?.igstrate ? prod?.hsn_id?.igstrate : this.NOHSN?.igstrate);
      this.pogetgst(ind)
    }
  }
 savedChildDataMap: { [key: number]: any[] } = {};  

 poaddcompsubmit() {
  const poinvoicedtlss = this.POInvoiceDetailForm.value.podetls;

  let totals = {
    taxable_amount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    taxamount: 0,
    totalamount: 0
  };

  for (let i = 0; i < poinvoicedtlss.length; i++) {
    const row = poinvoicedtlss[i];

    if (!row.productname) { this.toastr.error('Please Select Product'); return false; }
    if (!row.hsn) { this.toastr.error('Please Select HSN'); return false; }
    if (!row.unitprice) { this.toastr.error('Please Enter Unit Price'); return false; }
    if (!row.quantity) { this.toastr.error('Please Enter Quantity'); return false; }
    if (!row.amount) { this.toastr.error('Please Enter Amount'); return false; }

    let cgst = +row.cgst || 0;
    let sgst = +row.sgst || 0;
    let igst = +row.igst || 0;
    let totaltax = +row.taxamount || 0;
    let taxsum = cgst + sgst + igst;
    let pounitprice = String(this.pounitprice).replace(/,/g, '');
    let totalUnitPrice = poinvoicedtlss.map(item => Number(String(item.amount).replace(/,/g, '')) || 0).reduce((sum, current) => sum + current, 0);
    if(Number(pounitprice) != Number(totalUnitPrice)){
     this.toastr.error('Unit Price Mismatch!...');
     return false;  
    }
    if (totaltax !== taxsum) { this.toastr.error('Tax amount Mismatch'); return false; }

    totals.taxable_amount += +row.taxable_amount || 0;
    totals.cgst += cgst;
    totals.sgst += sgst;
    totals.igst += igst;
    totals.taxamount += totaltax;
    totals.totalamount += +row.totalamount || 0;
  }
  const invoicedtls = this.InvoiceDetailForm.get('invoicedtls') as FormArray;
  invoicedtls.at(this.poinvdtlindex).patchValue({
    taxable_amount: totals.taxable_amount,
    cgst: totals.cgst,
    sgst: totals.sgst,
    igst: totals.igst,
    taxamount: totals.taxamount,
    totalamount: totals.totalamount,
    component: poinvoicedtlss.map(c => ({
      ...c,
      unitprice: String(c.unitprice).replace(/,/g, ''),
      quantity: Number(c.quantity),
      amount: String(c.amount).replace(/,/g, ''),
      cgst: String(c.cgst).replace(/,/g, ''),
      sgst: String(c.sgst).replace(/,/g, ''),
      igst: String(c.igst).replace(/,/g, ''),
      taxable_amount: String(c.taxable_amount).replace(/,/g, ''),
      taxamount: String(c.taxamount).replace(/,/g, ''),
      totalamount: String(c.totalamount).replace(/,/g, '')
    }))
  });
  this.savedChildDataMap[this.poinvdtlindex] = poinvoicedtlss;
  this.ispocomponentsavedFlags[this.poinvdtlindex] = true;
  this.poinvaddflag = true;
  this.getpodetailsdata(this.savedChildDataMap[this.poinvdtlindex],this.poinvdtlindex);
  this.addcomponentbuttons.nativeElement.click();
}

  closepoaddcom(){
    this.addcomponentbuttons.nativeElement.click()
  }

  get podetlsTotals() {
  const controls = this.poinvdetails.controls; 

  let totals = {
    taxable_amount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    taxamount: 0,
    totalamount: 0
  };


controls.forEach((ctrl: any) => {
  const taxable = String(ctrl?.value?.taxable_amount ?? '').replace(/,/g, '');
  const cgst = String(ctrl?.value?.cgst ?? '').replace(/,/g, '');
  const sgst = String(ctrl?.value?.sgst ?? '').replace(/,/g, '');
  const igst = String(ctrl?.value?.igst ?? '').replace(/,/g, '');
  const taxamount = String(ctrl?.value?.taxamount ?? '').replace(/,/g, '');
  const totalamount = String(ctrl?.value?.totalamount ?? '').replace(/,/g, '');

  totals.taxable_amount += parseFloat(taxable) || 0;
  totals.cgst += parseFloat(cgst) || 0;
  totals.sgst += parseFloat(sgst) || 0;
  totals.igst += parseFloat(igst) || 0;
  totals.taxamount += parseFloat(taxamount) || 0;
  totals.totalamount += parseFloat(totalamount) || 0;
});

  return totals;
}
getpodetailsdata(childData: any[], parentIndex: number) {
  const invoicedtls = this.InvoiceDetailForm.get('invoicedtls') as FormArray;
  if (!invoicedtls || !invoicedtls.at(parentIndex)) {
    console.error('Parent row not found at index', parentIndex);
    return;
  }

  const parentGroup = invoicedtls.at(parentIndex) as FormGroup;
  let podetlsArray = this.POInvoiceDetailForm.get('podetls') as FormArray;

  if (!podetlsArray) {
    parentGroup.addControl('podetls', this.formBuilder.array([]));
    podetlsArray = parentGroup.get('podetls') as FormArray;
  }
  podetlsArray.clear();

  childData.forEach((child: any) => {
    const row = this.createPODetail();

    const product = child.productname
      ? typeof child.productname === 'object'
        ? { id: child.productname.id ?? null, code: child.productname.code ?? '', name: child.productname.name ?? '' }
        : { id: null, code: '', name: String(child.productname) }
      : null;

    const hsn = child.hsn
      ? typeof child.hsn === 'object'
        ? { id: child.hsn.id ?? null, code: child.hsn.code ?? '', cgstrate: child.hsn.cgstrate ?? 0, sgstrate: child.hsn.sgstrate ?? 0, igstrate: child.hsn.igstrate ?? 0 }
        : { id: null, code: String(child.hsn), cgstrate: 0, sgstrate: 0, igstrate: 0 }
      : null;
    const hsn_percentage = child?.hsn_percentage != null
        ? child.hsn_percentage
        : child?.hsn?.igstrate ?? 0;
    const uom = child.uom
      ? typeof child.uom === 'object'
        ? { id: child.uom.id ?? null, code: child.uom.code ?? '', name: child.uom.name ?? '' }
        : { id: null, code: '', name: String(child.uom) }
      : null;

    row.patchValue({
      productname: product,
      hsn: hsn,
      grn_code: child.grn_code ?? '',
      unitprice: child.unitprice ?? 0,
      quantity: child.quantity ?? 0,
      amount: child.amount ?? 0,
      taxable_amount: child.taxable_amount ?? 0,
      taxamount: child.taxamount ?? 0,
      totalamount: child.totalamount ?? 0,
      hsn_percentage: child.hsn_percentage ?? 0,
      cgst: child.cgst ?? 0,
      sgst: child.sgst ?? 0,
      igst: child.igst ?? 0,
      discount: child.discount ?? 0,
      description: child.description ?? '',
      uom: uom
    });

    podetlsArray.push(row);
  });
}


POcalcRow(group: FormGroup) {
  const Unitprice = +String(group.controls['unitprice'].value).replace(/,/g, '');
  const quantity = +String(group.controls['quantity'].value).replace(/,/g, '');
  
  let num = quantity * Unitprice;

  // Amount
  let amt = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  group.controls['amount'].setValue(amt, { emitEvent: false });

  // Taxable
  group.controls['taxable_amount'].setValue(amt, { emitEvent: false });

  // Tax & Total
  let taxamount = +String(group.controls['taxamount'].value).replace(/,/g, '');
  let total = num + taxamount;
  let tot = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total);
  group.controls['totalamount'].setValue(tot, { emitEvent: false });
}

POcalcTotalM(group: FormGroup) {
  this.POcalcRow(group);  
  this.POINVdatasums();   
}

getpatchpodetailsdata(invoicedetails: any, invdtlindex?: number) {
  if (!invoicedetails) return;
  const parentArray = Array.isArray(invoicedetails)
    ? invoicedetails
    : invoicedetails.data ?? [];
  if (parentArray.length === 0) return;
  this.poinvdetails.clear();
  const parentsToPatch = (invdtlindex != null)
    ? [parentArray[invdtlindex]]
    : parentArray;

  parentsToPatch.forEach((parent: any) => {
    const childRows = parent.invoicedetail_child?.data ?? [];
    if (childRows.length === 0) return;

    childRows.forEach((child: any) => {
      const row = this.createPODetail();
      row.patchValue({
        productname: child.productname ? {
          code: child.productcode ?? '',
          id: child.id ?? null,
          name: child.productname ?? ''
        } : null,
        hsn: child.hsn
          ? typeof child.hsn === 'string'
            ? { code: child.hsn }
            : {
                code: child.hsn?.code ?? '',
                id: child.hsn?.id ?? null,
                cgstrate: child.hsn?.cgstrate ?? 0,
                sgstrate: child.hsn?.sgstrate ?? 0,
                igstrate: child.hsn?.igstrate ?? 0
              }
          : null,
        grn_code: child.grn_code ?? '',
        unitprice: child.unitprice ?? 0,
        quantity: child.quantity ?? 0,
        amount: child.amount ?? 0,
        taxable_amount: child.taxable_amount ?? 0,
        taxamount: child.taxamount ?? 0,
        totalamount: child.totalamount ?? 0,
        hsn_percentage: child.hsn_percentage ?? 0,
        cgst: child.cgst ?? 0,
        sgst: child.sgst ?? 0,
        igst: child.igst ?? 0,
        discount: child.discount ?? 0,
        description: child.description ?? '',
        uom: child.uom ?? ''
      }, { emitEvent: false });

      this.poinvdetails.push(row);
    });
  });
}


  submitcrnliq1() {
    const credForm = this.InvoiceDetailForm.value.creditdtl
     let amts = credForm.filter(x=>x?.paymode_id?.code != 'PM009')
    let sumamts = amts.reduce((a, b) =>(parseFloat(String(a).replace(/,/g, '')) || 0) +(parseFloat(String(b).replace(/,/g, '')) || 0),0);
     let payamt = this.totalamount -sumamts
    if (this.crnsum > this.totalamount || this.crnsum > +payamt) {
      this.notification.showError("Liquidate Amount should not exceed the Invoice amount or Payable Amount.")
      return false
    }
      
     if (this.selectedcrndata.length ==0 || this.crnsum <=0){
      this.notification.showError("Please select an Advance No. and give amount to Liquidate.")
      return false
    }  
    for(let i=0; i<this.selectedcrndata.length; i++){      
      if (Number(String(this.selectedcrndata[i].liquidate_amt).replace(/,/g, ''))<=0)
        {
         this.notification.showError("Please give a valid amount to liquidate.")
         return false
        }
    }
    let credform = this.InvoiceDetailForm.value.creditdtl
    for(let i= 0;i<this.selectedcrndata.length; i++){
        let liqadded = false
        for (let j=0; j< credform.length;j++){
          if(credform[j].paymode_id?.code =='PM009' && this.selectedcrndata[i].crno == credform[j].refno) {
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amountchange').setValue(this.selectedcrndata[i].liquidate_amt)
            liqadded = true
            break;

          }
          else if(credform[j].paymode_id?.code =='PM009' && credform[j].refno =='' ){
            liqadded = true
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('ddtranbranch').setValue(this.selectedcrndata[i].raiserbranch)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('refno').setValue(this.selectedcrndata[i].crno)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('glno').setValue(this.selectedcrndata[i].credit_glno)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amountchange').setValue(this.selectedcrndata[i].liquidate_amt)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('category_code').setValue(this.selectedcrndata[i].adv_debit_cat_code)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('subcategory_code').setValue(this.selectedcrndata[i].adv_debit_subcat_code)            
          } 
        }
        if (liqadded == false) {
          // this.selectedcrndata.push(ppxForm[i])
          this.addcreditSection(0,'PM009')
          let len = this.InvoiceDetailForm.value.creditdtl.length-1
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('ddtranbranch').setValue(this.selectedcrndata[i].raiserbranch)
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('refno').setValue(this.selectedcrndata[i].crno)
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('glno').setValue(this.selectedcrndata[i].credit_glno)
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('amountchange').setValue(this.selectedcrndata[i].liquidate_amt)
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('category_code').setValue(this.selectedcrndata[i].adv_debit_cat_code)
          this.InvoiceDetailForm.get('creditdtl')['controls'][len].get('subcategory_code').setValue(this.selectedcrndata[i].adv_debit_subcat_code)
        }  
        credform =this.InvoiceDetailForm.value.creditdtl
    }

    for (let j=0; j< credform.length;j++){
      if(credform[j].paymode_id.code == 'PM009'){
        let chkselected = this.selectedcrndata.filter(x=> x.crno==credform[j].refno)
        if(chkselected.length ==0){
          this.deletecreditdetail(credform[j], j, false)
        }
      }
    }
     
    const ppxcontrol = this.ppxForm.get('crndtl') as FormArray;
    ppxcontrol.clear();
    this.closecrnliq()
    this.closeppxbuttoncrn.nativeElement.click();
    this.selectedCrnLines = []
    console.log("this.selectedcrn==", this.selectedcrndata)
  }

  istcs = false;
  tcsAdded= false

addinvdtltcs() {
  if (this.tcsAdded) {
    return;
  }
  const control = this.InvoiceDetailForm.get('invoicedtls') as FormArray;
  const newRow = this.INVdetail();
  let tcsproduct
    this.service.getproduct("Tax collected at source").subscribe((res: any) => {
    const products = Array.isArray(res?.data) ? res.data : [];
    tcsproduct = products?.find((p: any) => p.name === "Tax collected at source");

    if (!tcsproduct) {
      this.toastr.error("TCS product not found");
      return false;
    }
      console.log('tcsproduct===>>>',tcsproduct)

  newRow.patchValue({
    productname: tcsproduct,
    quantity: 1
  }, { emitEvent: false });
newRow.get('productname')?.disable();
newRow.get('hsn')?.disable();
newRow.get('quantity')?.disable();

  control.push(newRow);
  const newIndex = control.length - 1;
  this.product[newIndex] = tcsproduct;
  // if (this.getgstapplicable === "N") {    
  //   control.at(newIndex).get('hsn')?.setValue(this.NOHSN);
  //   this.hsn[newIndex] = "NO HSN";
  //   control.at(newIndex).get('hsn_percentage')?.setValue(this.NOHSN?.igstrate);
  //   control.at(newIndex).get('sgst')?.setValue(0);
  //   control.at(newIndex).get('cgst')?.setValue(0);
  //   control.at(newIndex).get('igst')?.setValue(0);
  //   control.at(newIndex).get('taxamount')?.setValue(0);
  // }
  this.tcsAdded = true;
      this.productChange(tcsproduct, newIndex);
    
 
  // this.calcTotalM(newRow);
  // this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtls']);
  })

}
  hsncompindex: any
  poprodList:any
  po_prod_id:any
  getpoindex(index) {
    // console.log("hsnnn", this.hsnindex)
    this.hsncompindex = index
    this.isLoading = true
    this.currentpage_poprod = 1;
    this.service.getpoproduct(this.po_prod_id,this.currentpage_poprod)
      .subscribe((results: any) => {
        let datas = results["data"];
        this.isLoading = false
        this.poprodList = datas;
        console.log("this.prodList..", this.prodList)
        this.has_next_poprod  = results?.pagination?.has_next
        if(this.has_next_poprod){
          this.currentpage_poprod = results?.pagination?.index 
        }
      })
  }
   pocomponentproductChange(prod: any, ind) {
    this.showrcm[ind] = true
    this.prodChange[ind] = true
    this.prodRcm[ind] = prod.product_isrcm == 'Y' ? 'Yes' : 'No'
    this.prodBlock[ind] = prod.product_isblocked == 'Y' ? 'Yes' : 'No'
    this.product[ind] = prod

    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('is_rcmproduct').setValue(prod.product_isrcm);
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('is_blockedproduct').setValue(prod.product_isblocked);

    console.log("prod value...", prod)
    console.log(prod.product_isrcm)
    if (prod.product_isrcm == "Y") {
      this.productRCMflag = true
    }
    else {
      this.productRCMflag = false
    }


    if (this.productRCMflag || this.prodBlock[ind] == 'Yes') {
      const invdate = new Date(this.frmInvHdr?.value?.invoicedate);
      const currDate = new Date();
      invdate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      if (invdate < currDate) {
        if (!window.confirm('RCM Invoices should be paid within 60 days from the date of Invoice"')) {
          return false
        }
      }
    }
    this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('uom').setValue(prod.uom_id.name)

    // if(this.productRCMflag == true )
    // {
    //   this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn').setValue(prod.hsn_id);	
    //   this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(prod.hsn_id.igstrate);
    //   this.getgst(ind)
    // }

    if (this.productRCMflag || this.prodBlock[ind] == 'Yes' ||
      (this.productRCMflag == false && this.getgstapplicable == "N" && this.aptypeid != 3 && this.aptypeid != 13)) {
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn').setValue(this.NOHSN);
      this.hsn[ind] = this.NOHSN
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(this.NOHSN?.igstrate);
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('sgst').setValue(0)
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('cgst').setValue(0)
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('igst').setValue(0)
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('taxamount').setValue(0)
    }
    else {
      const hsnObj = prod?.hsn_id ? prod.hsn_id : { id: null, code: this.NOHSN, igstrate: this.NOHSN?.igstrate ?? 0 };
      this.hsn[ind] = hsnObj;
      this.hsn[ind] = prod?.hsn_id ? prod?.hsn_id : this.NOHSN
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn').setValue(prod?.hsn_id ? prod?.hsn_id : this.NOHSN);
      this.InvoiceDetailForm.get('invoicedtls')['controls'][ind].get('hsn_percentage').setValue(prod?.hsn_id?.igstrate ? prod?.hsn_id?.igstrate : this.NOHSN?.igstrate);
      // this.getgst(ind)
        if (hsnObj.id) {
          this.getgst(ind);
        }
    }
  }

  has_next_poprod= false;
  has_previous_poprod = false;
  currentpage_poprod = 1;
   PoProductScroll() {
    setTimeout(() => {
      if (
        this.matpoProdAutocomplete &&
        this.autocompleteTrigger &&
        this.matpoProdAutocomplete.panel
      ) {
        fromEvent(this.matpoProdAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matpoProdAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matpoProdAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matpoProdAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpoProdAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next_poprod === true) {
                this.service.getpoproductscroll(this.po_prod_id, this.currentpage_poprod + 1,this.productPoInput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.poprodList.length >= 0) {
                      this.poprodList = this.poprodList.concat(datas);
                      this.has_next_poprod = datapagination.has_next;
                      this.has_previous_poprod = datapagination.has_previous;
                      this.currentpage_poprod = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  fa_subcategoryNameData:any
   getfasubcatDebit(index, subcatkeyvalue) {
    this.debaddindex = index
    this.isLoading =true
    this.service.getsubcatfacl(subcatkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.isLoading =false
        this.fa_subcategoryNameData = datas;
      })
  }
  isshowsub:boolean[] =[];
isfacapitalizedchecked(e: any,index) {
  this.isshowsub[index] = e.checked;
  const invoicedtls = this.InvoiceDetailForm.get('invoicedtls') as FormArray;
  if (!e.checked) {
  invoicedtls.at(index).get('is_capitalized_type')?.reset('');
  invoicedtls.at(index).get('is_capitalized_type')?.disable();
  } else {
  invoicedtls.at(index).get('is_capitalized_type')?.enable();
}
}
get showSubCategoryHeader(): boolean {
  return this.isshowsub.some(v => v);
}

   capitalizedsubcategoryScroll(i = 0, subcategorytype) {
    setTimeout(() => {
      if (
        subcategorytype &&
        this.autocompleteTrigger &&
        subcategorytype.panel
      ) {
        fromEvent(subcategorytype.panel.nativeElement, 'scroll')
          .pipe(
            map(x => subcategorytype.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = subcategorytype.panel.nativeElement.scrollTop;
            const scrollHeight = subcategorytype.panel.nativeElement.scrollHeight;
            const elementHeight = subcategorytype.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getsubcategoryscroll(this.catid, this.DebitDetailForm?.value?.debitdtl[i]?.subcategory_code, this.currentpage + 1)
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
  
get isFormChanged(): boolean {
  const details = this.InvoiceDetailForm.get('invoicedtls') as FormArray;
  return details.controls.some(ctrl => ctrl.dirty);
}
viewpofile(){
  var myModal = new (bootstrap as any).Modal(
      document.getElementById("pofilepop"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
}
  Pogetfiles(data) {
    this.spinner.show()
    this.service.filesdownload(data?.file_id)
      .subscribe((results) => {

        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_name;
        link.click();
        this.spinner.hide()
      },
        error => {
          this.errorHandler.handleError(error);
          this.spinner.hide();
        }
      )
  }
    Podata1(datas) {
    let id = datas?.file_id
    let filename = datas?.file_name

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

  }

}
