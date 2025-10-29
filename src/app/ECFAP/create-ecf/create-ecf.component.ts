import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormControlName } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { EcfapService } from '../ecfap.service';
import { EcfService } from 'src/app/ECF/ecf.service';
import { ShareService } from '../share.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { PageEvent } from '@angular/material/paginator';


export interface commoditylistss {
  id: string;
  name: string;
}
export interface approverListss {
  id: string;
  name: string;
  code: string;
  limit: number;
  designation: string;
}
export interface branchListss {
  id: any;
  name: string;
  code: string;
  codename: string;
}


export interface PMDLocationlists {
  id: any;
  location: string;
  code: string;
  codename: string;
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
export interface SupplierName {
  id: number;
  name: string;
}
export interface taxtypefilterValue {
  id: number;
  subtax_type: string;
}
export interface paytofilterValue {
  id: string;
  text: string;
}
export interface ppxfilterValue {
  id: string;
  text: string;
}
export interface pettyfilterValue {
  id: string;
  text: string;
}
export interface clientlists {
  id: string;
  client_code: string;
  client_name: string;
}
export interface rmlists {
  id: string;
  full_name: string;
  name: string
}
export interface emplists {
  id: string;
  full_name: string;
  name: string;
}
export interface productcodelists {
  id: string;
  bsproduct_code: string;
  bsproduct_name: string;
}
export interface paymodelistss {
  code: string;
  id: string;
  name: string;
}
export interface locationlists {
  id: number;
  location: string;
  gstno: string;
}

export interface templatelists {
  id: number;
  name: string;
}

export interface PCAlists {
  amount: number;
  balance_amount: number;
  pca_no: string;
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
  selector: 'app-create-ecf',
  templateUrl: './create-ecf.component.html',
  styleUrls: ['./create-ecf.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class CreateEcfComponent implements OnInit {
  ecfmodelurl = environment.apiURL
  showheaderdata = true
  showinvocedetail = false
  ecfheaderForm: FormGroup
  TypeList: any
  commodityList: Array<commoditylistss>
  clientlist: Array<clientlists>
  rmlist: Array<rmlists>
  emplist: Array<emplists>
  uploadList = [];
  images: string[] = [];
  commid: any
  approverbranch: any = {
    label: "Approver Branch",
    // "method": "get",
    // "url": this.ecfmodelurl + "usrserv/search_employeebranch",
    // params: "",
    // searchkey: "query",
    // displaykey: "name_code",
    // Outputkey: "name",
    // wholedata: true,
    // formcontrolname: 'branch_id',
  }

  @ViewChild('takeInput', { static: false }) InputVar: ElementRef;
  @ViewChild('fileInput') fileInput;
  // @ViewChild('fileInput', { static: false }) InputVars: ElementRef;
  ppxLoad = true
  crnLoad = true
  showbacks = true
  ppxList: any
  ppxdata: any
  crndata: any
  ppxForm: FormGroup
  crnForm: FormGroup
  advancetypeList: any
  payList: any
  isLoading = false;
  attachmentlist: any
  showppxmodal = false
  showcrnmodal = false
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  showppx = false
  disableppx = false
  showpayto = false
  showsupptype = true
  showadvance = false
  showgstapply = false
  showgsttt = true
  SupptypeList: any
  ecfheaderid: any
  ecftypeid: any
  tomorrow = new Date();
  showviewinvoice = false
  showviewinvoices = false
  showeditinvhdrform = false
  invhdrsaved = false
  showaddbtns = true
  disableecfsave = false
  invheadersave = false
  showadddebits = false
  showadddebit = true
  invdtlsave = false
  submitdebitdtlbtn = false
  deletefiledata: any
  showdebitpopup = true
  showtaxtypes = [true, true, true, true, true, true, true, true, true]
  showtaxrates = [true, true, true, true, true, true, true, true, true]
  showaddinvheader = false
  hideinv = false
  showgstaplicable = true
  showsplit = false
  showdelete = false
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  @ViewChild('closebuttons') closebuttons;
  @ViewChild('commoditytype') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild('clientrole') matclientAutocomplete: MatAutocomplete;
  @ViewChild('clientInput') clientInput: any;
  @ViewChild('rmrole') matrmAutocomplete: MatAutocomplete;
  @ViewChild('rmInput') rmInput: any;
  @ViewChild('behalfEmp') matBehalfAutocomplete: MatAutocomplete;
  @ViewChild('behalfInput') behalfInput: any;
  @ViewChild('templatetype') mattemplateAutocomplete: MatAutocomplete;
  @ViewChild('templateInput') templateInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]
  behalfyesorno = [{ 'value': true, 'display': 'Yes' }, { 'value': false, 'display': 'No' }]
  RecurYesorno = [{ 'value': 1, 'display': 'YES' }, { 'value': 0, 'display': 'NO' }]
  PCAYesorno = [{ 'value': 1, 'display': 'YES' }, { 'value': 0, 'display': 'NO' }]
  InvoiceHeaderForm: FormGroup
  SelectSupplierForm: FormGroup
  SupplierCode: string;
  SupplierGSTNumber: string;
  SupplierPANNumber: string;
  Address: string;
  City: string;
  line1: any;
  line2: any;
  line3: any;
  fileArray_n: Array<any> = [];
  file_process_data: any = {};
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
  invoiceheaderid: any
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
  Approverlist: Array<approverListss>;
  Branchlist: Array<branchListss>;
  poslist: Array<branchListss>;
  poscurrentpage: any = 1
  poshas_next: boolean = true
  poshas_previous: boolean = true
  SubmitoverallForm: FormGroup
  submitoverallbtn = false
  ECFData: any
  tdsList: any
  PMDLocationlist: Array<PMDLocationlists>;

  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchtyperole') matbranchroleAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('approvertype') matappAutocomplete: MatAutocomplete;
  @ViewChild('approverInput') approverInput: any;
  @ViewChild('pos') matposAutocomplete: MatAutocomplete;
  @ViewChild('posInput') posInput: any;
  @ViewChild('branchAutocomplete') branchAutocomplete: MatAutocomplete;
  @ViewChild('invbranchInput') invbranchInput: any;

  @ViewChild('pmdlocationAutocomplete') pmdlocationAutocomplete: MatAutocomplete;
  @ViewChild('pmdlocationInput') pmdlocationInput: any;
  @ViewChild('pcaAutocomplete') pcaAutocomplete: MatAutocomplete;
  @ViewChild('pcaInput') pcaInput: any;
  invoiceheaderdetailForm: FormGroup
  InvoiceDetailForm: FormGroup
  hsnList: Array<hsnlistss>
  uomList: Array<uomlistss>
  @ViewChild('hsntype') mathsnAutocomplete: MatAutocomplete;
  @ViewChild('hsnInput') hsnInput: any;
  @ViewChild('uomtype') matuomAutocomplete: MatAutocomplete;
  @ViewChild('uomInput') uomInput: any;
  @ViewChild('taxtype') mattactypeAutocomplete: MatAutocomplete;
  @ViewChild('taxtypeInput') taxtypeInput: any;
  hsncodess: any
  totaltax: any
  indexDet: any
  invoicedetailsdata: any
  delinvdtlid: any
  ccbspercentage: any
  ccbspercentages: any
  AdddebitDetails = true
  INVsum: any
  INVamt: any
  totalamount: any
  totaltaxable: any
  overalltotal: any
  igstrate: any
  cgstrate: any
  sgstrate: any
  type: any
  ecfheaderidd: any
  creditglForm: FormGroup
  accList: any
  accERAList: any
  showaccno = [false, false, false, false, false, false, false, false, false]
  creditbrnchList: any
  credittranList: any
  showtranspay = [false, false, false, false, false, false, false, false, false]
  showtaxtype = [false, false, false, false, false, false, false, false, false]
  showtaxrate = [false, false, false, false, false, false, false, false, false]
  showeraacc = [false, false, false, false, false, false, false, false, false]
  showkvbacc = [false, false, false, false, false, false, false, false, false]
  showglpopup = false
  showgrnpopup = false
  showkvbacpopup = false
  glList: any
  taxlist: any
  taxratelist: any
  PaymodeNonPoList: any
  PaymodeNonPoLists: any
  PaymodeNonPocrnList: any
  PaymodeNonPoliqList: any
  PaymodeAdvVenList: any
  PaymodeAdvERAList: any
  PaymodeAdvBRAList: any
  PaymodeERAList: any
  PaymodeERALists: any
  PaymodeCRNList: any
  paymodeICRList: any
  inveditindex: any

  // PaymodeCRNList = [{ "code": "P0009", "gl_flag": "Adjustable", "id": 11, "name": "CRNGL" }, { "code": "PM002", "gl_flag": "Adjustable", "id": 2, "name": "CREDITGL", }]
  addcreditindex: any
  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttonss') closebuttonss;
  @ViewChild('closedbuttons') closedbuttons;
  @ViewChild('closesbuttons') closesbuttons;
  @ViewChild('uploadclose') uploadclose;
  @ViewChild('closeppxbutton') closeppxbutton;
  @ViewChild('closecrnbutton') closecrnbutton;
  @ViewChild('closeglbutton') closeglbutton;
  @ViewChild('closetempbutton') closetempbutton;
  @ViewChild('closeInvHdrDet') closeInvHdrDet;
  @ViewChild('cattype') matcatAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('producttype') matproductAutocomplete: MatAutocomplete;
  @ViewChild('productInput') productInput: any;
  @ViewChild('kvbacclosebuttons') kvbacclosebuttons: any;
  DebitDetailForm: FormGroup
  categoryNameData: Array<catlistss>;
  subcategoryNameData: Array<subcatlistss>;
  bsNameData: Array<bslistss>;
  ccNameData: Array<cclistss>;
  businesslist: Array<productcodelists>
  invheaderid: any
  catid: any
  bssid: any
  SGST = false
  CGST = false
  IGST = false
  invoicenumber: any
  value: any
  invdate: any
  raisorbranchgst: any
  SupplierDetailForm: FormGroup
  show_suppdetails: boolean
  showsuppname = true
  showsuppgst = true
  showsuppstate = true
  filesHeader: FormGroup;
  showapproverforcreate = true
  showapproverforedit = false
  showsupppopup = true
  readdata = false
  readdatanew = false
  readinvdata = false
  readcreditdata = false
  readinvhdrdata = false
  readecfdata = false
  showsupplierpan = false
  showsuppliercode = false
  showsupplierdata = false
  showtaxforgst = false
  commodityid: any
  disabledate = true
  formData: FormData = new FormData();
  file_length: number = 0
  list: any
  fileextension: any
  totalcount: any
  base64textString = []
  fileData: any
  pdfimgview: any
  file_ext: any = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image'];
  showreasonattach: boolean = true;
  selectedbranchgst: any
  invdetailidforadvance: any
  raisedbyid: any
  shownotify = false
  showcrnnotify = false
  raisergst: any
  place_of_supply: any
  raiserbranchid: any
  createdbyid: any
  // @ViewChildren('fileInput') fileInput: QueryList<ElementRef>
  currncyLength = 0
  ismultilevel: boolean = false
  crnglForm: FormGroup
  creditlen: any;
  ppxshowapi: boolean = false;
  crnshowapi: boolean = false;
  raiseridd: any
  @ViewChild('paymode') matpaymodeAutocomplete: MatAutocomplete;
  @ViewChild('paymodeInput') paymodeInput: any;
  eraaccdata: any
  paymodelists: any
  @ViewChild('autoCompleteInput1') trigger1: MatAutocompleteTrigger;
  @ViewChild('autoCompleteInput2') trigger2: MatAutocompleteTrigger;
  @ViewChild('autoCompleteInput3') trigger3: MatAutocompleteTrigger;
  @ViewChild('autoCompleteInput4') trigger4: MatAutocompleteTrigger;
  @ViewChild('autoCompleteInput5') trigger5: MatAutocompleteTrigger;
  @ViewChild('autoCompleteInput6') trigger6: MatAutocompleteTrigger;
  currentform = null;
  currentfield = null;
  currentind = null;
  currentArray = null;
  defcat: any
  defsubcat: any
  gstcat: any
  cgstdata: any
  sgstdata: any
  igstdata: any
  triggerlist = ['trigger1', 'trigger2', 'trigger3', 'trigger4', 'trigger5', 'trigger6'];
  pettyList: any
  crnindex: any;
  ppxindex: any;
  popupshow: boolean = false;
  popupshowcrn: boolean = false;
  showpetty: boolean = false;
  invsupplierdataindex: any;
  inputGstValue = "";
  kvbaccForm: FormGroup;
  Locationlist: Array<locationlists>;
  @ViewChild('loctype') matlocAutocomplete: MatAutocomplete;
  @ViewChild('locationInput') locationInput: any;
  currentpageloc: any = 1;
  has_nextloc: boolean = true;
  has_previousloc: boolean = true;
  branchnamecheck: any;
  locationname: any;
  pmdrecords: any;
  InvoiceHeader: any = []
  invoiceyesno = [{ 'value': 1, 'display': 'Yes' }, { 'value': 0, 'display': 'No' }];
  ecfresult: any
  previousvalues: any
  prevoiusheadervalues: any
  currentvalues: any
  currentheadervalues: any
  editkey: any
  branchIds: any;
  restformdep: any;
  @ViewChild('brInput') brInput: any;
  @ViewChild('branchmatAuto') branchmatAuto: MatAutocomplete;
  brList: Array<branchListss>
  OverallForm: FormGroup
  currentpageapp: any = 1
  has_nextapp: boolean = true
  has_previousapp: boolean = true
  approverList: Array<approverListss>;
  @ViewChild('appInput') appInput: any;
  @ViewChild('approver') matapproverAutocomplete: MatAutocomplete;
  ECFUpdateForm: FormGroup;
  @ViewChild('closedpaybutton') closedpaybutton;
  chooseTempForm: FormGroup
  // createTempForm : FormGroup
  frmInvHdrDet: FormGroup
  uploadFileTypes = ['Invoice', 'Email', 'Supporting Documents', 'Others']

  ecf_field: any = {
    label: "ECF Type",
    required: true,
  }
  ecf_Commodity_field: any

  ecf_advance_field: any;
  ecf_advance_supplier_field: any;
  // {
  //   label: "Advance Type",
  //   method: "get",
  //   url: this.ecfmodelurl + "ecfapserv/get_advancetype",
  //   params: "",
  //   displaykey: "text",
  //   Outputkey: "id",
  //   valuekey: "id",
  //   formcontrolname: "advancetype"
  // }
  ParentObj: any
  ChildObj: any
  branch: any
  // choosesupplierfield1: any = {
  //   label: "Choose Supplier",
  //   method: "get",
  //   url: this.ecfmodelurl + "venserv/search_supplierdetails_ecf",
  //   params: "&code=&panno=&gstno=",
  //   displaykey: "name",
  //   formcontrolname: 'name',
  //   searchkey: "name",
  //   wholedata: true,
  //   required: true,
  //   id: "create-ecf-0126"
  // }
  choosesupplierfield1: any = {
    label: "Choose Supplier", displaykey: "name",
    formcontrolname: 'name',
    searchkey: "query",
    wholedata: true,
    required: true,
    id: "create-ecf-0126",
    tooltip: true,
    tooltipkey: "name"
  }
  choosesupplierfield: any = {
    label: "Choose Supplier",
    method: "get",
    url: this.ecfmodelurl + "venserv/search_suppliername_ecf",
    params: "&sup_id=&name=",
    searchkey: "name",
    displaykey: "name",
    formcontrolname: 'name',
    wholedata: true,
    required: true,
    id: "create-ecf-0125",
     tooltip: true,
     tooltipkey: "name"
  }
  restformfile: any[];
  restformfile1: any[];
  searchvar: any
  branch_id: any;
  ecf_payment_to_field: any = {
    label: "Payment For",
    method: "get",
    url: this.ecfmodelurl + "ecfapserv/get_yes_or_no_dropdown",
    params: "&type=ppx",
    displaykey: "text",
    valuekey: "id",
    formcontrolname: "payto",
    id: "create-ecf-0010"
  }
  ecf_petty_cash_field: any = {
    label: "Payment For",
    method: "get",
    url: this.ecfmodelurl + "ecfapserv/get_yes_or_no_dropdown",
    params: "&type=ppx",
    searchkey: "name",
    displaykey: "text",
    Outputkey: "id",
    formkey: "id",
    valuekey: "id",
    formcontrolname: "payto",
    id: "create-ecf-0011"
  }
  showsuback = false
  ecf_payment_field: any
  approvernames: any = {
    label: "Approver Name",
    "method": "get",
    "url": this.ecfmodelurl + "ecfapserv/approver_dropdown",
    params: "",
    "searchkey": "query",
    "displaykey": "code",
    prefix: 'name',
    suffix: 'limit',
    required: true,
    // wholedata: true,
    formcontrolname: 'approvedby',
    separator: "hyphen"
  }
  table_view_click: boolean = false;
  copy_view_click: boolean = false;
  selecttemplate: any;
  sub_name:any;
  @Input() submoduleName: string;
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private datePipe: DatePipe,
    private ecfservices: EcfapService, private shareservice: ShareService, private notification: NotificationService,
    private router: Router, private toastr: ToastrService, private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService, private ecfservice: EcfService) {

    // this.approverbranchfield =
    // {
    //   label: "Approver Branch",
    //   "method": "get",
    //   "url": this.ecfmodelurl + "usrserv/search_employeebranch",
    //   params: "",
    //   "searchkey": "query",
    //   "displaykey": "name",
    //   wholedata: true,
    //   required: true
    // }

    // this.approvernamefield =
    // {
    //   label: "Approver Name",
    //   "method": "get",
    //   "url": this.ecfmodelurl + "ecfapserv/approver_dropdown",
    //   SearchbyUrl: true,
    //   params: "&commodityid=" + "&created_by=" + this.raisedbyid + "&query=",
    //   "searchkey": "name",
    //   "displaykey": "name",
    //   wholedata: true,
    //   required: true,
    //   "Depkey": "id",
    //   default_url: this.ecfmodelurl + "ecfapserv/approver_dropdown"
    // }
  }

  ngOnInit(): void {
    const getToken = localStorage.getItem("sessionData")
    let tokendata = JSON.parse(getToken)
    // const params = new URL(window.location.href).searchParams;
    // console.log("params",params)
    // this.ecfheaderidd = localStorage.getItem('ecf_id');

    this.raisedbyid = tokendata.employee_id
    this.raiseridd = tokendata.employee_id
    let data = this.shareservice.ecfheaderedit.value
    this.ecfheaderidd = data
    console.log("ecfheaderid", data)
    let editkey = this.shareservice.editkey.value
    console.log("editkey", editkey)
    this.editkey = editkey
    if (this.editkey == "modification") {
      this.readecfdata = true
    }
    // this.approverbranchfield =
    // {
    //   label: "Approver Branch",
    //   "method": "get",
    //   "url": this.ecfmodelurl + "usrserv/search_employeebranch",
    //   params: "",
    //   "searchkey": "query",
    //   "displaykey": "name",
    //   wholedata: true,
    //   required: true
    // }

    // this.approvernamefield =
    // {
    //   label: "Approver Name",
    //   "method": "get",
    //   "url": this.ecfmodelurl + "prserv/ecf_delmatlimit",
    //   params: "&commodityid=" + "&created_by=" + this.raisedbyid + "&query=",
    //   "searchkey": "query",
    //   "displaykey": "name",
    //   wholedata: true,
    //   required: true,
    //   "Depkey": "id",
    //   "DepValue": "branch_id"
    // }

    this.ecfheaderForm = this.fb.group({
      supplier_type: [1],
      commodity_id: [''],
      aptype: [''],
      apdate: new Date(),
      apamount: [''],
      ppx: [''],
      notename: [''],
      remark: [''],
      payto: [''],
      advancetype: [''],
      ppxno: [''],
      branch: [''],
      // rmcode: [''],
      // client_code: [''],
      is_raisedby_self: [true],
      raised_by: [''],
      location: [''],
      inwarddetails_id: [''],
      is_originalinvoice: [1],
      crno: [''],

    })
    // this.ecf_field = {
    //   label: "ECF Type",
    //   method: "get",
    //   url: this.ecfmodelurl + "ecfapserv/get_ecftype",
    //   params: "",
    //   searchkey: "query",
    //   displaykey: "text",
    //   formkey: "id",
    //   Outputkey: "id",
    //   valuekey: "id",
    //   formcontrolname: "aptype"
    // }
    this.ecf_field = {
      label: "ECF Type",
      fronentdata: true,
      data: this.TypeList,
      displaykey: "text",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "aptype",
      id: "create-ecf-0009",
      required: true,
    }
    this.ecf_Commodity_field = {
      label: "Commodity Name",
      method: "get",
      url: this.ecfmodelurl + "mstserv/commoditysearch",
      params: "&code=" + "&name=",
      searchkey: "name",
      displaykey: "name",
      // Outputkey: "id",
      wholedata: true,
      // formkey: "id",
      required: true,
      formcontrolname: "commodity_id",
      id: "create-ecf-0013"
    }
    this.ecf_payment_field = {
      label: "Payment For",
      method: "get",
      url: this.ecfmodelurl + "ecfapserv/get_ppx",
      displaykey: "text",
      wholedata: true,
      formcontrolname: "ppx"
    }

    // this.ecf_payment_to_field = {
    //   label: "Payment For",
    //   method: "get",
    //   url: this.ecfmodelurl + "ecfapserv/get_yes_or_no_dropdown",
    //   params: "&type=ppx",
    //   searchkey: "text",
    //   displaykey: "text",
    //   formkey: "id",
    //   Outputkey: "id",
    //   formcontrolname: "payto"
    // }



    // this.ecf_advance_field = {
    //   label: "Advance Type",
    //   method: "get",
    //   url: this.ecfmodelurl + "ecfapserv/get_advancetype",
    //   params: "",
    //   displaykey: "text",
    //   Outputkey: "id",
    //   valuekey: "id",
    //   formcontrolname: "advancetype"
    // }
    this.ecf_advance_field = {
      label: "Advance Type",
      fronentdata: true,
      data: this.advancetypeList,
      displaykey: "text",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "advancetype",
      id: "create-ecf-0024"
    }
    this.ecf_advance_supplier_field = {
      label: "Advance Type",
      fronentdata: true,
      data: this.advancefilterlist,
      displaykey: "text",
      Outputkey: "id",
      valuekey: "id",
      formcontrolname: "advancetype",
      id: "create-ecf-0025"
    }
    this.InvoiceHeaderForm = this.fb.group({
      branch_id: [''],
      invtotalamt: [''],
      ecfheader_id: [''],
      dedupinvoiceno: [''],
      suppliergst: [''],
      raisorbranchgst: [''],
      invoicegst: [''],
      invoiceheader: new FormArray([
        // this.INVheader(),
      ]),
    })
    this.SelectSupplierForm = this.fb.group({
      gstno: [''],
      code: [''],
      panno: [''],
      name: ['']
    })
    this.SubmitoverallForm = this.fb.group({
      id: [''],
      approver_branch: [''],
      approvedby_id: [''],
      ecftype: [''],
      tds: [''],
    })
    this.invoiceheaderdetailForm = this.fb.group({
      raisorcode: [''],
      raisorname: [''],
      transbranch: [''],
      gst: [''],
      suppcode: [''],
      suppbranch: [''],
      suppname: [''],
      suppgstno: [''],
      invoiceno: [''],
      invoicedate: [''],
      taxableamt: [0],
      invoiceamt: [''],
      taxamount: [''],
      rndamount: [''],
      otheramount: ['']
    })

    this.InvoiceDetailForm = this.fb.group({
      roundoffamt: [0],
      otheramount: [0],
      invoicedtl: new FormArray([
        // this.INVdetail(),
      ]),

      creditdtl: new FormArray([
        // this.creditdetails(),
      ])

    })

    this.DebitDetailForm = this.fb.group({

      debitdtl: new FormArray([
        // this.debitdetail()
      ])
    })

    this.filesHeader = this.fb.group({
      file_upload: new FormArray([
      ]),
    })
    this.creditglForm = this.fb.group({
      name: [''],
      glnum: ['']
    })
    this.kvbaccForm = this.fb.group({
      accno: [''],
      confirmaccno: ['']
    })
    this.crnglForm = this.fb.group({
      crnglArray: new FormArray([
        this.getcrngldetails()
      ])
    })
    this.SupplierDetailForm = this.fb.group({
      invoiceno: [''],
      invoicedate: [''],
      supplier_name: [''],
      suppliergst: [''],
      pincode: ['']
    })

    this.OverallForm = this.fb.group({
      branch_id: [''],
      batch_wise: ['N'],
      approvedby: [''],
      // payment_instruction:[''],
      // is_tds_applicable:['']
    })

    this.approverbranch = {
    label: "Approver Branch",
    "method": "get",
    "url": this.ecfmodelurl + "usrserv/search_employeebranch",
    params: "",
    searchkey: "query",
    displaykey: "name_code",
    // Outputkey: "name",
    wholedata: true,
    formcontrolname: 'branch_id',
  }
  this.approvernames = {
    label: "Approver Name",
    "method": "get",
    "url": this.ecfmodelurl + "ecfapserv/approver_dropdown",
    params: "",
    "searchkey": "query",
    "displaykey": "name_code_limit",
    // prefix: 'name',
    // suffix: 'limit',
    required: true,
    wholedata: true,
    formcontrolname: 'approvedby',
    tooltip: true,
    tooltipkey: 'name_code_limit'
    // separator: "hyphen"
  }




    // this.ParentObj = { label: "Approver Branch", "method": "get", "url": this.imageUrl + "usrserv/search_employeebranch" , params: "", searchkey: "query", displaykey: "name", formControlName:"branch_id"}

    // this.ChildObj = { label: "Approver Name", "method": "get", "url": this.imageUrl + "ecfapserv/approver_dropdown" , params: "&commodityid=" + this.raisedbyid +"&created_by=" + this.branch , searchkey: "query" ,"displaykey":"name","Depkey":"id","DepValue": "branch_id",formControlName:"approvedby"}
    this.filesHeader = this.fb.group({
      file_upload: new FormArray([
      ]),
    })

    this.ppxForm = this.fb.group({
      ppxdtl: new FormArray([
      ])
    })

    this.crnForm = this.fb.group({
      crndtl: new FormArray([
      ])
    })

    this.ECFUpdateForm = this.fb.group({
      apamount: ['']
    })


    this.chooseTempForm = this.fb.group({
      template: [''],
    })

    // this.createTempForm = this.fb.group({
    //   name: [''],
    // })

    this.frmInvHdrDet = this.fb.group({
      template: [''],
      invoiceno: [''],
      invoicedate: [''],
      totalamount: [''],
      invoiceamount: [''],
      filevalue: new FormArray([])

    })
    console.log('Received submodule name:', this.submoduleName);
    if(this.submoduleName){
      this.sub_name = this.submoduleName
    }
    // else{      
    //   this.sub_name = this.shareservice.submodule_name 
    // }
    console.log("create_sub_name",this.sub_name)
    // this.approvername()
    this.getinvoicedetails();
    this.getecftype();
    this.getsuppliertype();
    this.getPaymode();
    this.getbranchrole(this.sub_name);
    this.getRecurringType()
    this.getadvancetype()
    this.ecfheaderForm.get('advancetype').valueChanges.subscribe(() => {
      this.selectedAdvanceType = null;
    });
    this.ecfheaderForm.get('ppx').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getppxdropdown()
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ppxList = datas;
      })

    this.frmInvHdrDet.get('template').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getInvoiceTemplates(this.ecftypeid, this.templateInput.nativeElement.value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"][0];
        this.templatesList = datas;
      })
  }


  showecfHdredit() {
    this.readecfdata = false
    this.disableecfsave = false
  }
  behalfSelf = true
  getBehalf(data) {
    this.behalfSelf = data.value
  }

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
        switchMap(value => this.ecfservices.getsuppliernamescroll(this.suplist, value, 1, 1)
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

  getcatdropdown() {
    this.getcat('')
  }
  getbsdropdown() {
    this.getbs('')
  }
  getuomdropdown() {
    this.getuom('')
  }
  gethsndropdown() {
    this.gethsn('')
  }
  getcommoditydata(datas) {
    this.commodityid = datas.id
    if(datas?.name == 'Office Supplies'){
      this.notification.showWarning('Enter Unit price and Quantity as per the Bill')
    }
  }
  onBranchChange(branch) {
    this.raisergst = branch?.gstin
    this.place_of_supply = branch
    this.ecfservices.getPMDBranch(branch.code)
      .subscribe(result => {
        if (result) {
          this.PMDbranchdata = result['data']
          if (this.PMDbranchdata.length == 0)
            this.PMDyesno = 'N'
        }
      })
  }
  getbranchdropdown() {
    this.branchdropdown('');
    this.InvoiceHeaderForm.get('branchdetails_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getbranchscroll(value, 1)
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

  getheaderbranch() {
    let branchkeyvalue: String = "";
    this.branchdropdown(branchkeyvalue);
    this.ecfheaderForm.get('branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservices.getbranchscroll(value, 1)
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

  getposbranch() {
    let poskeyvalue: String = "";
    this.posdropdown(poskeyvalue);
    this.InvoiceHeaderForm.get('place_of_supply').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap(value => this.ecfservices.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.poslist = datas;
      })
  }


  getbpdropdown() {
    this.getbusinessproduct('')
  }

  // getapprovedropdowns() {

  //   if (this.ismultilevel == true) {
  //     let approverkeyvalue: String = "";
  //     this.approverdropdown(approverkeyvalue);
  //     this.SubmitoverallForm.get('approvedby_id').valueChanges
  //       .pipe(
  //         debounceTime(100),
  //         distinctUntilChanged(),
  //         tap(() => {
  //           this.isLoading = true;
  //         }),

  //         switchMap(value => this.ecfservices.getdelmatapproverscroll(1, this.commodityid, this.createdbyid, value)
  //           .pipe(
  //             finalize(() => {
  //               this.isLoading = false
  //             }),
  //           )
  //         )
  //       )
  //       .subscribe((results: any[]) => {
  //         let datas = results["data"];
  //         this.Approverlist = datas;
  //       })
  //   } else {
  //     let approverkeyvalue: String = "";
  //     this.approverdropdown(approverkeyvalue);
  //     this.SubmitoverallForm.get('approvedby_id').valueChanges
  //       .pipe(
  //         debounceTime(100),
  //         distinctUntilChanged(),
  //         tap(() => {
  //           this.isLoading = true;
  //         }),

  //         switchMap(value => this.ecfservices.getECFapproverscroll(1, this.commodityid, this.createdbyid, value)
  //           .pipe(
  //             finalize(() => {
  //               this.isLoading = false
  //             }),
  //           )
  //         )
  //       )
  //       .subscribe((results: any[]) => {
  //         let datas = results["data"];
  //         this.Approverlist = datas;
  //       })
  //   }
  // }

  getcatdropdowns() {
    this.getcat('');

  }

  getsubcatdropdowns() {
    this.getsubcat(this.catid, "");

  }



  getcommoditydd() {
    let commoditykeyvalue: String = "";
    this.getcommodity(commoditykeyvalue);
    this.ecfheaderForm.get('commodity_id').valueChanges
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

  getrmdd() {
    let rmkeyvalue: String = "";
    this.getrm(rmkeyvalue);
    this.ecfheaderForm.get('rmcode').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.rmlist = datas.filter(x => x.id != this.raiseridd);
      })
  }

  getclientdd() {
    let clientkeyvalue: String = "";
    this.getclient(clientkeyvalue);
    this.ecfheaderForm.get('client_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getclientscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.clientlist = datas;
      })
  }

  getpaytodropdown() {

    if (this.ecftypeid == 3) {
      this.ecfheaderForm.get('payto').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservices.getpayto(this.ecftypeid)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.payList = datas.filter(a => a.id != 'S');
        })
    }

  }

  getpettydropdown() {
    this.ecfheaderForm.get('payto').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getpayto(3)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pettyList = datas.filter(x => x.id == 'B')
      })
  }

  getbehalfemp() {
    let value: String = "";
    this.getrm(value);
    this.ecfheaderForm.get('raised_by').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getrmscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let dataas = datas.filter(x => x.id != this.raiseridd)
        this.emplist = []
        for (let item of dataas) {
          let val = { id: item.id, full_name: item.full_name, name: item.full_name }
          this.emplist.push(val)
        }
      })
  }

  behalfEmpScroll() {
    setTimeout(() => {
      if (
        this.matBehalfAutocomplete &&
        this.matBehalfAutocomplete &&
        this.matBehalfAutocomplete.panel
      ) {
        fromEvent(this.matBehalfAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matBehalfAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matBehalfAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matBehalfAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matBehalfAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservices.getrmscroll(this.behalfInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let dataas = datas.filter(x => x.id != this.raiseridd)
                    let datapagination = results["pagination"];
                    if (this.emplist.length >= 0) {
                      for (let item of dataas) {
                        let val = { id: item.id, full_name: item.full_name, name: item.full_name }
                        this.emplist.push(val)
                      }
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

  get behalfEmp() {
    return this.ecfheaderForm.get('raised_by');
  }


  getlocation() {
    let lockeyvalue: String = "";
    this.getlocationname(lockeyvalue);

    this.ecfheaderForm.get('location').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservices.getlocationscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Locationlist = datas;

      })

  }

  // calclocation(loc){
  //   let data = this.InvoiceHeader
  //   if(this.ecfheaderidd != "" && this.ecfheaderidd != null && this.ecfheaderidd != undefined){
  //     for(let i in data){
  //     this.ecfservice.GetpettycashGSTtype(data[i].suppliergst,loc?.gstno)
  //     .subscribe(result=>{
  //       this.type = result?.Gsttype
  //     })
  //     }
  //   }
  // }

  private getlocationname(lockeyvalue) {
    this.ecfservices.getlocationscroll(lockeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Locationlist = datas;
      })
  }

  public displayFnlocation(loc?: locationlists): string | undefined {
    return loc ? loc.location : undefined;
  }

  get loc() {
    return this.ecfheaderForm.get('location');
  }

  locationScroll() {

    setTimeout(() => {
      if (
        this.matlocAutocomplete &&
        this.autocompleteTrigger &&
        this.matlocAutocomplete.panel
      ) {
        fromEvent(this.matlocAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matlocAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matlocAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matlocAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matlocAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextloc === true) {
                this.ecfservices.getlocationscroll(this.locationInput.nativeElement.value, this.currentpageloc + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.Locationlist = this.Locationlist.concat(datas);
                    if (this.Locationlist.length >= 0) {
                      this.has_nextloc = datapagination.has_next;
                      this.has_previousloc = datapagination.has_previous;
                      this.currentpageloc = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  getcrngldetails() {
    let group = new FormGroup({
      category_code: new FormControl(''),
      subcategory_code: new FormControl(''),
      debitglno: new FormControl('')

    })
    group.get('category_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getcategoryscroll(value, 1)
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
        this.linesChange.emit(this.crnglForm.value['crnglArray']);
      })

    group.get('subcategory_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getsubcategoryscroll(this.catid, value, 1)
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

  behalfoff_select() {
    if (this.ecfheaderForm.value.onbehalfoff == false) {
      this.ecfheaderForm.controls['behalfoff_branch'].reset()
    }
  }
  invoicegst: any
  ecfstatusid: any
  ecfeditdata: any
  ecfstatusname: any
  ppxid: any
  fileList: any
  paytoid: any
  ecftotalamount: any
  hrFlag = false
  crno: any
  ecfstatus: any
  invoicestatus: any
  server_environment = ''
approverbranchdata: any;
  branchid: any;
  approverbranchclick(e){
    console.log("approverbranchclick data ---->",e)
    this.approverbranchdata = e;
    this.branchid = e.id;
    console.log("approverbranchclick this.OverallForm.value ---->",this.OverallForm.value)
    if(e?.id === ""){
    this.approvernames =
                {
                  label: "Approver Name",
                  "method": "get",
                  "url": this.ecfmodelurl + "ecfapserv/approver_dropdown",
                  params: "&commodityid=" + this.ecfheaderForm.value?.commodity_id?.id + "&created_by=" + this.raisedbyid,
                  "searchkey": "query",
                  Outputkey: "id",
                  required: true,
                  "displaykey": "name_code_limit",
                  // prefix: 'name',
                  // suffix: 'limit',
                  formcontrolname: 'approvedby',
                  // separator: "hyphen"
                  tooltip: true,
                  tooltipkey: 'name_code_limit'
                }
    }
    else{
      this.approvernames =
               {
                 label: "Approver Name",
                 "method": "get",
                 "url": this.ecfmodelurl + "ecfapserv/approver_dropdown",
                 params: "&commodityid=" + this.ecfheaderForm.value?.commodity_id?.id + "&created_by=" + this.raisedbyid +"&branch_id=" + this.OverallForm.value?.branch_id?.id,
                 "searchkey": "query",
                 Outputkey: "id",
                 required: true,
                 "displaykey": "name_code_limit",
                 // prefix: 'name',
                 // suffix: 'limit',
                 formcontrolname: 'approvedby',
                 // separator: "hyphen"
                 tooltip: true,
                 tooltipkey: 'name_code_limit'
               }
    }
  }
  getinvoicedetails() {
    this.SpinnerService.show()
    // this.ecfheaderForm.controls['ppx'].disable();
    this.ecfservices.getOnbehalfofHR()
      .subscribe(result => {
        if (result.data != undefined) {
          this.hrFlag = result.data[0].is_onbehalfoff_hr
          console.log("hrFlag", this.hrFlag)
        }
        if (this.ecfheaderidd != "" && this.ecfheaderidd != undefined && this.ecfheaderidd != null) {
          this.readecfdata = true
          this.disableecfsave = true
          this.ecfservices.getecfheader(this.ecfheaderidd)
            .subscribe(result => {
              this.ecfresult = result
              this.server_environment = result?.environment
              this.ecfstatus = this.ecfresult?.ecfstatus
              this.SpinnerService.hide()
              if (result.id != undefined) {
                this.showapproverforcreate = false
                this.showapproverforedit = true
                this.showeditinvhdrform = true
                let invheader = result['invoice_header']
                this.InvoiceHeader = result['invoice_header']
                this.invoiceheaderres = result['invoice_header']
                if (invheader?.length > 0) {
                  this.invoicestatus = result['invoice_header'][0].invoice_status
                  for (let i in invheader) {
                    this.InvoiceDetailForm.patchValue({
                      roundoffamt: invheader[i]?.roundoffamt,
                      otheramount: invheader[i]?.otheramount
                    })
                  }

                  for (let a of result?.invoice_header) {
                    this.type = a?.gsttype
                  }

                }
                // this.msme = this.invoiceheaderres[0].is_msme
                // this.msme_reg_no = this.invoiceheaderres[0].msme_reg_no
                this.showviewinvoice = true
                this.showviewinvoices = false
                this.invhdrsaved = false
                this.showaddbtns = false
                this.showadddebit = false
                this.showadddebits = true
                // this.showsuback = true
                // this.showeditinvhdrform = false
                let datas = result
                this.ecfeditdata = datas
                this.ecftypeid = result?.aptype_id
                this.ecfstatusid = result?.apstatus_id
                this.ecfstatusname = result?.apstatus
                this.commodityid = result?.commodity_id?.id
                this.ecftotalamount = result?.apamount
                this.raisergst = result?.raiserbranchgst
                this.branchdata = result?.branch
                this.createdbyid = result?.raisedby;
                this.locationname = result?.location?.id
                this.branchnamecheck = result?.branch?.name
                this.SupplierTypeID = result?.supplier_type_id
                this.paytoid = result?.payto_id?.id
                this.selecttemplate = {
                  label: "Select Template",
                  method: "get",
                  url: this.ecfmodelurl + "ecfapserv/ecfap_template",
                  params: "&temptype=summary&ecftype=" + this.ecftypeid + "&name=",
                  searchkey: "",
                  displaykey: "name",
                  formcontrolname: 'template',
                  wholedata: true,
                  required: true,
                  id: "create-ecf-0151"
                }
                if (this.ecftypeid == 3 || this.ecftypeid == 13 || (this.ecftypeid == 4 && this.paytoid == 'E')) {
                  this.show_suppdetails = false
                }
                else {
                  this.show_suppdetails = true
                }
                if (this.ecftypeid == 4) {
                  this.ppxid = result?.ppx_id?.id
                }
                if (this.ecftypeid == 3 || this.ecftypeid == 13) {
                  this.ecfheaderForm.controls['supplier_type'].disable();
                  this.ecfheaderForm.controls['payto'].disable();
                }
                // if (this.ecftypeid == 3) {
                //   this.paytoid = result?.payto_id?.id

                //   if (this.hrFlag) {
                //     this.ecfheaderForm.controls['is_raisedby_self'].enable();
                //     this.ecfheaderForm.controls['raised_by'].enable();
                //   } else {
                //     this.ecfheaderForm.controls['is_raisedby_self'].disable();
                //     this.ecfheaderForm.controls['raised_by'].disable();
                //   }
                // }

                this.previousvalues = JSON.stringify(this.ecfheaderForm.value)
                console.log("previousvalues", this.previousvalues)

                let gst = datas?.invoice_header[0]?.invoicegst ? datas?.invoice_header[0]?.invoicegst : "N"
                // this.InvoiceHeaderForm.patchValue({
                //   invoicegst:gst
                // })
                this.getgstapplicable = gst

                // if (invheader?.length > 0) {
                // if (a?.invoicegst == 'Y') {
                //   this.showtaxforgst = true
                // this.SelectSupplierForm.controls['code'].disable();
                // this.SelectSupplierForm.controls['panno'].disable();
                // this.SelectSupplierForm.controls['name'].disable();
                // } else {
                //   this.showtaxforgst = false
                // this.SelectSupplierForm.controls['code'].enable();
                // this.SelectSupplierForm.controls['panno'].enable();
                // this.SelectSupplierForm.controls['name'].enable();
                //   }
                // }

                if (datas?.aptype_id == 2 || datas?.aptype_id == 7 || datas?.aptype_id == 14) {
                  this.showdatefornonpo = true
                  this.showdate = false
                  this.shownotfornonpo = false
                  this.showfornonpo = true
                  this.showpetty = false
                  this.showsuppgst = true
                  this.showsuppname = true
                  this.showsuppstate = true
                }
                if (datas?.aptype_id == 3) {
                  this.showpayto = true
                  this.showsuppname = false
                  this.showsuppgst = false
                  this.showsuppstate = false
                  this.showdatefornonpo = false
                  this.showdate = true
                  this.shownotfornonpo = true
                  this.showfornonpo = false
                  this.showgsttt = false
                  this.showpetty = false
                  this.showerasuppname = true
                  this.showerasuppgst = true
                }
                if (datas?.aptype_id == 13) {
                  this.showpayto = false
                  this.showsuppname = false
                  this.showsuppgst = false
                  this.showsuppstate = false
                  this.showdatefornonpo = false
                  this.showdate = true
                  this.shownotfornonpo = true
                  this.showfornonpo = false
                  this.showgsttt = false
                  this.showpetty = true
                }
                if (datas?.aptype_id == 4 && datas?.ppx_id?.id == 'E') {
                  this.showppx = true
                  this.showsuppname = false
                  this.showsuppgst = false
                  this.showsuppstate = false
                  this.showgsttt = false
                  this.showadvance = true
                  this.showadvforemployee = true
                  this.showadvforsupplier = false
                  this.showdatefornonpo = false
                  this.showdate = true
                  this.shownotfornonpo = true
                  this.showfornonpo = false
                  this.showpetty = false
                  // this.showgstapply = true
                }
                if (datas?.aptype_id == 4 && datas?.ppx_id?.id == 'S') {
                  this.showppx = true
                  this.showsuppname = true
                  this.showsuppgst = true
                  this.showsuppstate = true
                  this.showgsttt = true
                  this.showadvance = true
                  this.showadvforemployee = false
                  this.showadvforsupplier = true
                  this.showdatefornonpo = false
                  this.showdate = true
                  this.shownotfornonpo = true
                  this.showfornonpo = false
                  this.showpetty = false
                  // this.showgstapply = true
                }

                // let rmcode = {
                //   "id": datas?.rmcode?.id,
                //   "full_name": "(" + datas?.rmcode?.code + ")" + "" + datas?.rmcode?.name
                // }
                // let ppxid
                // if(datas?.ppx_id == "S")
                //     ppxid = {
                //     "data": [],
                //     "id": "S",
                //     "text": "SUPPLIER"
                //     } 
                // else if(datas?.ppx_id == "E")
                //     ppxid = {
                //     "data": [],
                //     "id": "E",
                //     "text": "EMPLOYEE"
                //     }

                console.log("dtsssss", datas)
                let num: number = +datas?.apamount;
                let amt = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
                amt = amt ? amt.toString() : '';

                this.ecfheaderForm.patchValue({
                  supplier_type: datas?.supplier_type_id,
                  commodity_id: datas?.commodity_id,
                  aptype: datas?.aptype_id,
                  branch: datas?.branch,
                  apdate: datas?.apdate,
                  apamount: amt,
                  ppx: datas?.ppx_id,
                  payto: datas?.payto_id,
                  notename: datas?.notename,
                  remark: datas?.remark,
                  advancetype: datas?.advancetype?.id,
                  // rmcode: rmcode,
                  // client_code: datas?.client_code,
                  is_raisedby_self: datas?.is_raisedby_self,
                  raised_by: datas?.raisedby_dtls,
                  location: datas?.location,
                  inwarddetails_id: datas?.inwarddetails_id,
                  crno: datas?.crno

                })

                this.showbacks = false
                this.crno = datas.crno
                this.shareservice.commodity_id.next(datas?.commodity_id.id)
                let comm = this.shareservice.commodity_id.value
                // let branch = this.OverallForm.controls['branch_id'].value
                // this.ParentObj = {
                //   label: "Approver Branch",
                //   "method": "get",
                //   "url": this.imageUrl + "usrserv/search_employeebranch",
                //   params: "",
                //   searchkey: "query",
                //   displaykey: "name",
                //   formControlName: "branch_id",
                //   wholedata: true
                // }
                // this.ChildObj = {
                //   label: "Approver Name",
                //   "method": "get",
                //   "url": this.imageUrl + "ecfapserv/approver_dropdown",
                //   params: "&commodityid=" + comm + "&created_by=" + this.raisedbyid + "&query=", searchkey: "query",
                //   displaykey: "name",
                //   "Depkey": "id",
                //   "DepValue": "branch_id",
                //   formControlName: "approvedby"
                // }
                this.approvernames =
                {
                  label: "Approver Name",
                  "method": "get",
                  "url": this.ecfmodelurl + "ecfapserv/approver_dropdown",
                  params: "&commodityid=" + this.ecfheaderForm.value?.commodity_id?.id + "&created_by=" + this.raisedbyid,
                  "searchkey": "query",
                  Outputkey: "id",
                  required: true,
                  "displaykey": "name_code_limit",
                  // prefix: 'name',
                  // suffix: 'limit',
                  formcontrolname: 'approvedby',
                  // separator: "hyphen",
                  tooltip: true,
                  tooltipkey: 'name_code_limit'
                }
                if (datas?.aptype_id == 3 && datas?.is_raisedby_self == false) {
                  this.raisedbyid = datas?.raisedby_dtls?.id
                }
                if (datas?.crno != null) {
                  this.SubmitoverallForm.patchValue({
                    approver_branch: datas?.data?.approver_branch,
                    approvedby_id: datas?.data?.limit['data'][0]?.employee_id
                  })
                }
                this.crno = datas?.crno
                this.shareservice.crno.next(datas?.crno)
                this.getinvoicehdrrecords(result)

                this.InvoiceHeaderForm.patchValue({
                  invoicegst: this.getgstapplicable
                })

                if (this.InvoiceHeader.length == 0 && this.ecftypeid == 4) {
                  this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicegst').setValue('N')
                }

                this.getcatsubcat(this.ecftypeid)
                let comefrom = this.shareservice.comefrom.value
                console.log("comefrom", comefrom)
                // if(comefrom == "invoicedetail")	
                // {	
                //   this.viewinvheader();	
                //   this.shareservice.comefrom.next("")	
                // }
              }
              else if (result?.status == 'Failed') {
                this.notification.showError(result?.message)
                this.onCancel.emit()
                this.SpinnerService.hide()
              } else {
                this.notification.showError(result?.description);
                this.onCancel.emit()
                this.SpinnerService.hide();
                return false;
              }
            },
              error => {
                this.errorHandler.handleError(error);
                this.onCancel.emit()
                this.SpinnerService.hide();
              }
            )
        }
        else {
          this.invhdrsaved = false
          const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
          control.push(this.INVheader());
          this.SpinnerService.hide()
        }
      })

  }

  InvHeaderFormArray(): FormArray {
    return this.InvoiceHeaderForm.get('invoiceheader') as FormArray;
  }
  data(datas) {
    let id = datas
    this.ecfservices.downloadfile(id)
  }

  getfiles(data) {
    this.SpinnerService.show()
    this.ecfservices.filesdownload(data.file_id)
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

  fileDeletes(data, index: number) {
    this.SpinnerService.show()
    this.ecfservices.deletefile(data.file_id)
      .subscribe(result => {
        if (result?.status == 'success') {
          // this.fileList.splice(index, 1);
          this.SpinnerService.hide()
          this.InvoiceHeaderForm.value.invoiceheader[this.fileindex].filedataas.splice(index, 1)
          this.InvoiceHeaderForm.value.invoiceheader[this.fileindex].filekey.splice(index, 1)
          this.notification.showSuccess("Deleted....")
          this.fileInput.nativeElement.value= ""
          // this.closedbuttons.nativeElement.click();
        } else {
          this.notification.showError(result?.description)
          this.closedbuttons.nativeElement.click();
          this.SpinnerService.hide()
          return false
        }
      })
  }

  viewinvheader() {
    // let invdata = this.ecfheaderForm.value
    // let ecfdates = this.datePipe.transform(invdata.ecfdate, 'yyyy-MM-dd')

    // if (this.ecfeditdata.ecftype_id != invdata.ecftype) {
    //   this.notification.showInfo("Please save the changes you have done")
    //   return false
    // }
    // else if (this.ecfeditdata.supplier_type_id != invdata.supplier_type) {
    //   this.notification.showInfo("Please save the changes you have done")
    //   return false
    // }
    // else if (this.ecfeditdata.commodity_id.id != invdata.commodity_id.id) {
    //   this.notification.showInfo("Please save the changes you have done")
    //   return false
    // }
    // else if (this.ecfeditdata.ecfdate != ecfdates) {
    //   this.notification.showInfo("Please save the changes you have done")
    //   return false
    // }
    // else if (this.ecfeditdata.ecfamount != invdata.ecfamount) {
    //   this.notification.showInfo("Please save the changes you have done")
    //   return false
    // }
    // else if (this.ecfeditdata.remark != invdata.remark) {
    //   this.notification.showInfo("Please save the changes you have done")
    //   return false
    // }


    // else {
    this.showeditinvhdrform = true
    this.disableecfsave = true
    this.readecfdata = true

    // }
  }

  viewinvheaders() {
    this.showeditinvhdrform = true
    this.disableecfsave = true
    this.readecfdata = true
  }
  getinvoicehdrrecords(datas) {
    if (datas?.invoice_header?.length == 0) {
      const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
      control.push(this.INVheader());

      if (this.ecftypeid == 14 || this.ecftypeid == 3 || this.ecftypeid == 4)
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][control.length - 1].get('invoicegst').setValue('N');

    }

    if (this.selectedTemp != undefined) {
      const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
      control.removeAt(0);
    }

    if (this.ecftypeid == 2 && datas?.invoice_header[0]?.is_pca == 1) {
      console.log("1st api call this.commodityid------------->", this.commodityid)
      console.log("1st api call this.ecfheaderForm.value.commodity_id------------->", this.ecfheaderForm.value.commodity_id)
      this.ecfservices.getPCA(this.commodityid, datas?.invoice_header[0]?.pca_no, 1)
        .subscribe(result => {
          if (result.data?.length > 0) {
            this.PCA_Det = []
            this.PCA_Det.push(result.data[0])
            this.PCA_bal_amount = +result.data[0]?.balance_amount
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('pca_no').setValue(this.PCA_Det[0]);
          }
          else {
            this.PCA_bal_amount = 0
          }
        })
    }
    for (let invhdr of datas?.invoice_header) {
      let id: FormControl = new FormControl('');
      let suppname: FormControl = new FormControl('');
      let suppstate: FormControl = new FormControl('');
      let invoiceno: FormControl = new FormControl('');
      let creditrefno: FormControl = new FormControl('');
      let refinv_crno: FormControl = new FormControl('');
      let invoicedate: FormControl = new FormControl('');
      let invoiceamount: FormControl = new FormControl(0);
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl(0);
      let otheramount: FormControl = new FormControl('');
      let roundoffamt: FormControl = new FormControl('');
      let invtotalamt: FormControl = new FormControl('');
      let apheader_id: FormControl = new FormControl('');
      let dedupinvoiceno: FormControl = new FormControl('');
      let supplier_id: FormControl = new FormControl('');
      let suppliergst: FormControl = new FormControl('');
      let supplierstate_id: FormControl = new FormControl('');
      let raisorbranchgst: FormControl = new FormControl('');
      let invoicegst: FormControl = new FormControl('');
      let place_of_supply: FormControl = new FormControl('');
      let branchdetails_id: FormControl = new FormControl('');
      let bankdetails_id: FormControl = new FormControl('');
      let entry_flag: FormControl = new FormControl('');
      let barcode: FormControl = new FormControl('');
      let creditbank_id: FormControl = new FormControl('');
      let manualsupp_name: FormControl = new FormControl('');
      let manual_gstno: FormControl = new FormControl('')
      let filevalue: FormArray = new FormArray([]);
      let file_key: FormArray = new FormArray([]);
      let remarks: FormControl = new FormControl('');
      let is_recur: FormControl = new FormControl('0');
      let service_type: FormControl = new FormControl(1);
      let recur_fromdate: FormControl = new FormControl('');
      let recur_todate: FormControl = new FormControl('');
      let apinvoiceheader_crno: FormControl = new FormControl('');
      let debitbank_id: FormControl = new FormControl('');
      let invoicestatus: FormControl = new FormControl('');
      let is_tds_applicable: FormControl = new FormControl();
      let paymentinstrctn: FormControl = new FormControl('');
      let is_pmd: FormControl = new FormControl('');
      let pmdlocation_id: FormControl = new FormControl('');
      let is_pca: FormControl = new FormControl(0);
      let pca_no: FormControl = new FormControl('');
      let pca_name: FormControl = new FormControl('');
      let pca_bal_amt: FormControl = new FormControl('');
      let captalisedflag: FormControl = new FormControl(false);
      let is_fa_capitalized: FormControl = new FormControl(0);

      id.setValue(invhdr.id)
      if (this.ecftypeid == 2 || (this.ecftypeid == 4 && this.ppxid == "S") || this.ecftypeid == 7 || this.ecftypeid == 14) {
        suppname.setValue(invhdr?.supplier_id?.name)
        supplierstate_id.setValue(invhdr?.supplierstate_id?.id)
        suppstate.setValue(invhdr?.supplierstate_id?.name)
        supplier_id.setValue(invhdr?.supplier_id?.id)
        suppliergst.setValue(invhdr?.supplier_id?.gstno)
      } else {
        suppname.setValue("")
        supplierstate_id.setValue("")
        supplier_id.setValue("")
        suppliergst.setValue("")
        suppstate.setValue("")
      }
      if (invhdr?.pmd_data == '' || invhdr?.pmd_data == undefined || invhdr?.pmd_data == null)
        this.PMDyesno = 'N'
      else
        this.PMDyesno = 'Y'
      if (invhdr?.is_pca)
        this.PCAyesno = 1
      else
        this.PCAyesno = 0

      let num = +invhdr?.totalamount;
      let tot = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      tot = tot ? tot.toString() : '';
      totalamount.setValue(tot)

      num = +invhdr?.invoiceamount;
      let inv = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
      inv = inv ? inv.toString() : '';
      invoiceamount.setValue(inv)

      invoiceno.setValue(invhdr?.invoiceno)
      creditrefno.setValue(invhdr?.creditrefno)
      refinv_crno.setValue(invhdr?.refinv_crno)
      invoicedate.setValue(invhdr?.invoicedate)
      taxamount.setValue(invhdr?.taxamount)
      console.log("totalamount", totalamount)
      console.log("totalamount1", invhdr?.totalamount)
      otheramount.setValue(invhdr?.otheramount)
      roundoffamt.setValue(invhdr?.roundoffamt)
      invtotalamt.setValue("")
      dedupinvoiceno.setValue(invhdr?.dedupinvoiceno)
      apheader_id.setValue(invhdr?.ecfheader_id)
      raisorbranchgst.setValue(invhdr?.raisorbranchgst)
      invoicegst.setValue(invhdr?.invoicegst)
      place_of_supply.setValue(invhdr?.place_of_supply)
      this.place_of_supply = invhdr?.place_of_supply

      branchdetails_id.setValue(invhdr?.branchdetails_id)
      bankdetails_id.setValue(invhdr?.bankdetails_id)
      entry_flag.setValue(invhdr?.entry_flag)
      barcode.setValue("")
      creditbank_id.setValue(invhdr?.creditbank_id)
      manualsupp_name.setValue(invhdr?.manualsupp_name)
      manual_gstno.setValue(invhdr?.manual_gstno)
      console.log("manualgst", invhdr?.manual_gstno)
      remarks.setValue(invhdr?.remarks)
      is_recur.setValue(invhdr?.is_recur?.id == 1 ? 1 : 0)
      // if(invhdr?.is_recur?.id == 1)
      //   this.showRecurFields = true

      service_type.setValue(invhdr?.servicetype?.id)
      if (invhdr?.servicetype?.id == 2 || invhdr?.servicetype?.id == 3)
        this.showRecurDates = true
      else
        this.showRecurDates = false

      if (invhdr?.servicetype?.id == 2)
        this.showRecurMonth = true
      else
        this.showRecurMonth = false
      recur_fromdate.setValue(invhdr?.recur_fromdate)
      recur_todate.setValue(invhdr?.recur_todate)
      filevalue.setValue([])
      file_key.setValue([])
      this.inputGstValue = invhdr?.manual_gstno
      apinvoiceheader_crno.setValue(invhdr?.apinvoiceheader_crno)
      debitbank_id.setValue(invhdr?.debitbank_id)
      invoicestatus.setValue(invhdr?.invoice_status)
      is_tds_applicable.setValue(invhdr?.is_tds_applicable?.id)
      paymentinstrctn.setValue(invhdr?.paymentinstrctn)
      is_pmd.setValue(this.PMDyesno)
      pmdlocation_id.setValue(invhdr?.pmd_data)
      is_pca.setValue(invhdr?.is_pca ? 1 : 0)
      pca_no.setValue(this.PCA_Det[0])
      pca_bal_amt.setValue(invhdr?.pca_bal_amt)
      captalisedflag.setValue(invhdr?.captalisedflag == 'Y' ? true : false)
      is_fa_capitalized.setValue(invhdr?.captalisedflag == 'Y' ? 1 : 0)
      this.InvHeaderFormArray().push(new FormGroup({
        id: id,
        suppname: suppname,
        suppstate: suppstate,
        invoiceno: invoiceno,
        creditrefno: creditrefno,
        refinv_crno: refinv_crno,
        invoicedate: invoicedate,
        invoiceamount: invoiceamount,
        taxamount: taxamount,
        totalamount: totalamount,
        otheramount: otheramount,
        roundoffamt: roundoffamt,
        invtotalamt: invtotalamt,
        dedupinvoiceno: dedupinvoiceno,
        apheader_id: apheader_id,
        supplier_id: supplier_id,
        suppliergst: suppliergst,
        supplierstate_id: supplierstate_id,
        raisorbranchgst: raisorbranchgst,
        invoicegst: invoicegst,
        place_of_supply: place_of_supply,
        branchdetails_id: branchdetails_id,
        bankdetails_id: bankdetails_id,
        entry_flag: entry_flag,
        barcode: barcode,
        creditbank_id: creditbank_id,
        manualsupp_name: manualsupp_name,
        manual_gstno: manual_gstno,
        filevalue: filevalue,
        file_key: file_key,
        remarks: remarks,
        is_recur: is_recur,
        service_type: service_type,
        recur_fromdate: recur_fromdate,
        recur_todate: recur_todate,
        filedataas: this.filefun(invhdr),
        filekey: this.filefun(invhdr),
        debitbank_id: debitbank_id,
        apinvoiceheader_crno: apinvoiceheader_crno,
        invoicestatus: invoicestatus,
        paymentinstrctn: paymentinstrctn,
        is_tds_applicable: is_tds_applicable,
        is_pmd: is_pmd,
        pmdlocation_id: pmdlocation_id,
        is_pca: is_pca,
        pca_no: pca_no,
        pca_bal_amt: pca_bal_amt,
        captalisedflag: captalisedflag,
        is_fa_capitalized: is_fa_capitalized,
      }))

      if (invhdr?.pmd_data != undefined && invhdr?.pmd_data != null && invhdr?.pmd_data != '') {
        this.PMDyesno = 'Y'
        this.ecfservices.getPMDBranch(invhdr?.branchdetails_id.code)
          .subscribe(result => {
            if (result) {
              this.PMDbranchdata = result['data']
              this.getInvHdrColCount()

            }
          })
      }
      else {
        this.PMDyesno = 'N'
      }
      this.prevoiusheadervalues = JSON.stringify(this.InvoiceHeaderForm.value)
      console.log("prevoiusheadervalues", this.prevoiusheadervalues)

      // this.calchdrTotal(invoiceamount, taxamount, totalamount)
      this.datasums()
      place_of_supply.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservices.getbranchscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.poslist = datas;
          this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
        })

      branchdetails_id.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservices.getbranchscroll(value, 1)
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
          this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
        })

      // invoiceamount.valueChanges.pipe(
      //   debounceTime(20)
      // ).subscribe(value => {
      //   this.calchdrTotal(invoiceamount, taxamount, totalamount)
      //   if (!this.InvoiceHeaderForm.valid) {
      //     return;
      //   }
      //   this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      // }
      // )
      // taxamount.valueChanges.pipe(
      //   debounceTime(20)
      // ).subscribe(value => {
      //   this.calchdrTotal(invoiceamount, taxamount, totalamount)
      //   if (!this.InvoiceHeaderForm.valid) {
      //     return;
      //   }
      //   this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      // }
      // )

      pmdlocation_id.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservices.getPMDLocation(this.PMDbranchdata[0].id, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.PMDLocationlist = datas;
          this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
        })
      // if(this.ecfheaderForm.value.commodity_id.id){
      //   pca_no.valueChanges
      //   .pipe(
      //     debounceTime(100),
      //     distinctUntilChanged(),
      //     tap(() => {
      //       this.isLoading = true;
      //       console.log("For if pca_no.valuechanges this.commodityid------------->",this.commodityid)
      //       console.log("For if pca_no.valuechanges this.ecfheaderForm.value.commodity_id------------->",this.ecfheaderForm.value.commodity_id)
      //     }),
      //     switchMap(value => this.ecfservices.getPCA(this.ecfheaderForm.value.commodity_id?.id, value, 1)
      //       .pipe(
      //         finalize(() => {
      //           this.isLoading = false
      //         }),
      //       )
      //     )
      //   )
      //   .subscribe((results: any[]) => {
      //     let datas = results["data"];
      //     this.PCAList = datas;
      //     this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      //   })
      // }
      // if(this.ecfheaderForm.value.commodity_id){
      //   pca_no.valueChanges
      //   .pipe(
      //     debounceTime(100),
      //     distinctUntilChanged(),
      //     tap(() => {
      //       this.isLoading = true;
      //       console.log("For if 2 pca_no.valuechanges this.commodityid------------->",this.commodityid)
      //       console.log("For if 2 pca_no.valuechanges this.ecfheaderForm.value.commodity_id------------->",this.ecfheaderForm.value.commodity_id)
      //     }),
      //     switchMap(value => this.ecfservices.getPCA(this.ecfheaderForm.value.commodity_id, value, 1)
      //       .pipe(
      //         finalize(() => {
      //           this.isLoading = false
      //         }),
      //       )
      //     )
      //   )
      //   .subscribe((results: any[]) => {
      //     let datas = results["data"];
      //     this.PCAList = datas;
      //     this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      //   })
      // }
      //  else{
      //   pca_no.valueChanges
      //   .pipe(
      //     debounceTime(100),
      //     distinctUntilChanged(),
      //     tap(() => {
      //       this.isLoading = true;
      //       console.log("For else pca_no.valuechanges this.commodityid------------->",this.commodityid)
      //       console.log("For else pca_no.valuechanges this.ecfheaderForm.value.commodity_id------------->",this.ecfheaderForm.value.commodity_id)
      //     }),
      //     switchMap(value => this.ecfservices.getPCA(this.ecfheaderForm.value.commodity_id, value, 1)
      //       .pipe(
      //         finalize(() => {
      //           this.isLoading = false
      //         }),
      //       )
      //     )
      //   )
      //   .subscribe((results: any[]) => {
      //     let datas = results["data"];
      //     this.PCAList = datas;
      //     this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      //   })
      //  }
      pca_no.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log("For pca_no.valuechanges this.commodityid------------->", this.commodityid)
            console.log("For pca_no.valuechanges this.ecfheaderForm.value.commodity_id------------->", this.ecfheaderForm.value.commodity_id)
          }),
          switchMap(value => this.ecfservices.getPCA(this.commodityid, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.PCAList = datas;
          this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
        })

      totalamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calchdrTotal(invoiceamount, taxamount, totalamount)
        this.datasums()
        if (!this.InvoiceHeaderForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      }
      )
      // roundoffamt.valueChanges.pipe(
      //   debounceTime(20)
      // ).subscribe(value => {
      //   this.calchdrTotal(invoiceamount, taxamount, totalamount)
      //   if (!this.InvoiceHeaderForm.valid) {
      //     return;
      //   }
      //   this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      // }
      // )
      // otheramount.valueChanges.pipe(
      //   debounceTime(20)
      // ).subscribe(value => {
      //   this.calchdrTotal(invoiceamount, taxamount, totalamount)
      //   if (!this.InvoiceHeaderForm.valid) {
      //     return;
      //   }
      //   this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      // }
      // )


    }
    this.getInvHdrColCount()

  }
  filefun(data) {
    let arr = new FormArray([])
    let dataForfILE = data.file_data
    if (data.file_data == "" || data.file_data == null || data.file_data == undefined) {
      dataForfILE = []
    } else {
      for (let file of dataForfILE) {
        let file_id: FormControl = new FormControl('');
        let file_name: FormControl = new FormControl('');
        let document_type: FormControl = new FormControl('');
        file_id.setValue(file.file_id);
        file_name.setValue(file.file_name)
        document_type.setValue(file.document_type)
        arr.push(new FormGroup({
          file_id: file_id,
          document_type: document_type,
          file_name: file_name
        }))

      }
    }
    return arr;
  }

  calchdrTotal(invoiceamount, taxamount, totalamount: FormControl) {
    let ivAnount = Number(invoiceamount.value)
    let ivAtax = Number(taxamount.value)
    const Taxableamount = ivAnount
    const Taxamount = ivAtax
    let toto = Taxableamount + Taxamount
    this.toto = toto
    totalamount.setValue((this.toto), { emitEvent: false });
    this.datasums();
  }
  gettdsapplicable() {
    this.ecfservices.gettdsapplicability()
      .subscribe(result => {
        this.tdsList = result['data']
      })
  }
  public displayFnpayFilter(filterpaydata?: paytofilterValue): string | undefined {
    return filterpaydata ? filterpaydata.text : undefined;
  }
  get filterpaydata() {
    return this.ecfheaderForm.get('payto');
  }
  public displayFnppxFilter(filterppxdata?: ppxfilterValue): string | undefined {
    return filterppxdata ? filterppxdata.text : undefined;
  }
  get filterppxdata() {
    return this.ecfheaderForm.get('ppx');
  }
  public displayFnpettyFilter(filterpettydata?: pettyfilterValue): string | undefined {
    return filterpettydata ? filterpettydata.text : undefined;
  }
  get filterpettydata() {
    return this.ecfheaderForm.get('payto');
  }
  getecftype() {
    this.ecfservices.getecftype()
      .subscribe(result => {
        if (result) {
          let TypeList = result["data"]
          this.TypeList = TypeList.filter(a => a.id == 2 || a.id == 3 || a.id == 4 || a.id == 7 || a.id == 13 || a.id == 14)
          this.icrtypeid = TypeList.filter(a => a.id == 14)
          this.icrtypeid = this.icrtypeid[0].id
          this.ecf_field = {
            label: "ECF Type",
            fronentdata: true,
            data: this.TypeList,
            displaykey: "text",
            Outputkey: "id",
            valuekey: "id",
            formcontrolname: "aptype",
            id: "create-ecf-0009",
            required: true,
          }
          console.log("sdfghjgfdsfghjgf", this.icrtypeid)
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  icrtypeid: any
  showbranchdata = false
  branchrole: any
  roledata: any
  branchdata: any
  PMDbranchdata: any = []
  raiserbranchposid: any
  getbranchrole(sub_name) {
    this.ecfservices.getbranchrole_create(sub_name)
      .subscribe(result => {
        if (result) {
          this.branchrole = result?.code + "-" + result?.branch_name
          this.roledata = result?.enable_ddl
          this.raiserbranchposid = result
          this.ecfservice.getbranch(result?.code)
            .subscribe((results: any[]) => {
              if (results) {
                let datas = results["data"];
                this.branchdata = datas[0];
                this.ecfheaderForm.patchValue({
                  branch: this.branchdata
                })
                this.ecfservices.getPMDBranch(this.branchdata.code)
                  .subscribe(result => {
                    if (result) {
                      this.PMDbranchdata = result['data']
                    }
                  })
              }

            }, error => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            }
            )
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  PMDyesno = 'N'
  setPMD(data) {
    this.PMDyesno = data.value
    if (this.PMDyesno == 'Y') {

      this.ecfservices.getPMDLocation(this.PMDbranchdata[0].id, '')
        .subscribe(result => {
          if (result) {
            this.PMDLocationlist = result['data']
          }
        })
    }
    else {
      this.InvoiceHeaderForm.value.invoiceheader[0].pmdlocation_id.setValue('')
    }
    this.getInvHdrColCount()

  }
  showdatefornonpo = true
  showdate = false
  shownotfornonpo = false
  showfornonpo = true

  getecf(id) {
    this.ecftypeid = id
    let supprecord = { "id": 1, "text": "SINGLE" }
    let paymentfor = { "id": "E", "text": "EMPLOYEE" }
    let brapaymentfor = { "id": "B", "text": "BRANCH PETTYCASH" }
    if (id === 3) {
      this.showpayto = true
      this.showdatefornonpo = false
      this.showdate = true
      this.shownotfornonpo = true
      this.showfornonpo = false
      this.showppx = false
      this.showadvance = false
      this.showgsttt = false
      this.showpetty = false
      this.getpaytype()
      this.ecfheaderForm.patchValue({
        supplier_type: supprecord?.id,
        payto: paymentfor
      })
      this.ecfheaderForm.controls['supplier_type'].disable();
      this.ecfheaderForm.controls['payto'].disable();
      if (this.hrFlag) {
        this.ecfheaderForm.controls['is_raisedby_self'].enable();
        this.ecfheaderForm.controls['raised_by'].enable();
      }
      else {
        this.ecfheaderForm.controls['is_raisedby_self'].disable();
        this.ecfheaderForm.controls['raised_by'].disable();
      }
    }
    else if (id === 4) {
      this.showppx = true
      this.showadvance = true
      this.showdatefornonpo = false
      this.showdate = true
      this.shownotfornonpo = true
      this.showfornonpo = false
      this.showpayto = false
      this.showpetty = false
      this.getppxtype()
      this.ecfheaderForm.patchValue({
        supplier_type: supprecord?.id

      })
      this.ecfheaderForm.controls['supplier_type'].disable();
      this.ecfheaderForm.controls['payto'].enable();
      this.ecfheaderForm.controls['is_raisedby_self'].disable();
      this.ecfheaderForm.controls['raised_by'].disable();
    } else if (id == 13) {
      this.showppx = false
      this.showadvance = false
      this.showdatefornonpo = false
      this.showdate = true
      this.shownotfornonpo = true
      this.showfornonpo = false
      this.showpayto = false
      this.showpetty = true
      this.getpettydropdown()
      this.ecfheaderForm.patchValue({
        supplier_type: supprecord?.id,
        payto: brapaymentfor
      })
      // this.ecf_petty_cash_field = {
      //   label: "Payment For",
      //   method: "get",
      //   url: this.ecfmodelurl + "ecfapserv/get_yes_or_no_dropdown",
      //   params: "&type=ppx",
      //   searchkey: "name",
      //   displaykey: "text",
      //   Outputkey: "id",
      //   formkey: "id",
      //   valuekey: "id",
      //   formcontrolname: "payto"

      // }
      this.ecfheaderForm.controls['supplier_type'].disable();
      this.ecfheaderForm.controls['payto'].disable();
      this.ecfheaderForm.controls['is_raisedby_self'].disable();
      this.ecfheaderForm.controls['raised_by'].disable();
    } else if (id == 14 || id == 7) {
      this.showdatefornonpo = true
      this.showdate = false
      this.shownotfornonpo = false
      this.showfornonpo = true
      this.showppx = false
      this.showadvance = false
      this.showpayto = false
      this.showsupptype = true
      this.showpetty = false
      this.showsuppgst = true
      this.showsuppname = true
      this.showsuppstate = true
      this.getpettydropdown()
      this.ecfheaderForm.patchValue({
        supplier_type: supprecord?.id,

      })
      this.ecfheaderForm.controls['supplier_type'].disable();

    } else {
      this.ecfheaderForm.controls['supplier_type'].enable();
      this.ecfheaderForm.controls['payto'].enable();
      this.showdatefornonpo = true
      this.showdate = false
      this.shownotfornonpo = false
      this.showfornonpo = true
      this.showppx = false
      this.showadvance = false
      this.showpayto = false
      this.showsupptype = true
      this.showpetty = false
      this.showsuppgst = true
      this.showsuppname = true
      this.showsuppstate = true
      this.ecfheaderForm.controls['is_raisedby_self'].disable();
      this.ecfheaderForm.controls['raised_by'].disable();
    }
    this.getcatsubcat(id)
  }

  getcatsubcat(id) {
    // let catkey :any
    // let subcatkey:any
    // if(id != 7 ){
    //   catkey = "dummy";
    //   subcatkey = "dummy"
    // }
    // if(id == 7){
    //   catkey = "SUSPENSE AC";
    //   subcatkey = "Sundry Creditors - Others"
    // }
    // this.ecfservice.getdefcat(catkey).subscribe(result=>{
    //   this.defcat = result['data'][0]
    //   let categoryid = this.defcat?.id
    //   this.ecfservice.getdefsubcat(categoryid).subscribe(results=>{
    //     this.defsubcat = results['data'][0]

    //   })
    // })
    this.SpinnerService.show();
    this.ecfservices.getdefcat("GST Tax").subscribe(result => {
      let datas = result['data'].filter(x => x.code == "GST Tax")
      this.SpinnerService.hide();
      this.gstcat = datas[0]
      this.ecfservices.getdefsubcat(this.gstcat?.id).subscribe(results => {
        let subdata = results['data']
        this.cgstdata = subdata?.filter(a => a.code == "CGST")
        this.sgstdata = subdata?.filter(b => b.code == "SGST")
        this.igstdata = subdata?.filter(c => c.code == "IGST")

      })
    })



  }
  getppxtype() {
    this.ecfservices.getppxdropdown()
      .subscribe(result => {
        if (result) {
          this.ppxList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  advancefilterlist: any
  advemployeelist: any
  getadvancetype() {
    this.ecfservices.getadvancetype()
      .subscribe(result => {
        if (result) {
          this.advancetypeList = result["data"]
          this.advemployeelist = this.advancetypeList.filter(data => data.id == 3)
          this.ecf_advance_field = {
            label: "Advance Type",
            fronentdata: true,
            data: this.advancetypeList,
            displaykey: "text",
            Outputkey: "id",
            valuekey: "id",
            formcontrolname: "advancetype",
            id: "create-ecf-0024"
          }
          this.advemployeelist = this.advemployeelist[0]?.text
          console.log("The Advance Values are", this.advemployeelist)
          this.advancefilterlist = this.advancetypeList.filter(data => data.id != 3)
          this.ecf_advance_supplier_field = {
            label: "Advance Type",
            fronentdata: true,
            data: this.advancefilterlist,
            displaykey: "text",
            Outputkey: "id",
            valuekey: "id",
            formcontrolname: "advancetype"
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }
  ppxddid: any
  showadvforemployee = false
  showadvforsupplier = false
  getppx(data) {
    let id = data?.id
    let advancerecord = { "id": 3, "text": "Employee advance & Deposits" }
    if (id == "E") {
      this.showsuppname = false
      this.showsuppgst = false
      this.showsuppstate = false
      this.showgsttt = false
      this.showadvforemployee = true
      this.showadvforsupplier = false
      this.ecfheaderForm.patchValue({
        advancetype: advancerecord?.id
      })
      // this.ecfheaderForm.get('ppx').disable({ onlySelf: true });
      this.disableppx = true
      // this.ecfheaderForm.controls['advancetype'].disable();
    }
    if (id == "S") {
      this.showsuppname = true
      this.showsuppgst = true
      this.showsuppstate = true
      this.showgsttt = true
      // this.showgstapply = true
      this.showadvforemployee = false
      this.showadvforsupplier = true
      this.ecfheaderForm.controls['advancetype'].reset();
      this.ecfheaderForm.controls['advancetype'].enable();
      // this.disableppx = true
      // this.ecfheaderForm.get('ppx').disable({ onlySelf: true });
    }




  }
  getpaytype() {
    this.ecfservices.getpayto(this.ecftypeid)
      .subscribe(result => {
        if (result) {
          this.payList = result["data"]
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  getsuppliertype() {
    this.ecfservices.getsuppliertype()
      .subscribe(result => {
        if (result) {
          let SupptypeList = result["data"]
          this.SupptypeList = SupptypeList
          // ?.filter(x => x.id != 2)
        }
      })
  }


  public displayFncommodity(commoditytype?: commoditylistss): string | undefined {
    return commoditytype ? commoditytype.name : undefined;
  }

  get commoditytype() {
    return this.ecfheaderForm.get('commodity_id');
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
  public displayFnclient(clientrole?: clientlists): string | undefined {
    return clientrole ? clientrole.client_name : undefined;
  }
  get clientrole() {
    return this.ecfheaderForm.get('client_code');
  }
  getclient(clientkeyvalue) {
    this.ecfservices.getclientcode(clientkeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.clientlist = datas;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  clientScroll() {
    setTimeout(() => {
      if (
        this.matclientAutocomplete &&
        this.matclientAutocomplete &&
        this.matclientAutocomplete.panel
      ) {
        fromEvent(this.matclientAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matclientAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matclientAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matclientAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matclientAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservices.getclientscroll(this.clientInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.clientlist.length >= 0) {
                      this.clientlist = this.clientlist.concat(datas);
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
  public displayFnrm(rmrole?: rmlists): string | undefined {
    return rmrole ? rmrole?.full_name : undefined;
  }
  public displayFnrmedit(rmrole?: rmlists): string | undefined {
    return rmrole ? rmrole?.name : undefined;
  }
  public displayFnEmp(emprole?: emplists): string | undefined {
    return emprole ? emprole?.name : undefined;
  }
  get emprole() {
    return this.ecfheaderForm.get('raised_by');
  }
  get rmrole() {
    return this.ecfheaderForm.get('rmcode');
  }
  getrm(rmkeyvalue) {
    this.ecfservices.getrmcode(rmkeyvalue)
      .subscribe(results => {
        if (results) {
          let datas = results["data"];
          this.rmlist = datas.filter(x => x.id != this.raiseridd);
          let dataas = datas.filter(x => x.id != this.raiseridd);
          this.emplist = []
          for (let item of dataas) {
            let val = { id: item.id, full_name: item.full_name, name: item.full_name }
            this.emplist.push(val)
          }
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  rmScroll() {
    setTimeout(() => {
      if (
        this.matrmAutocomplete &&
        this.matrmAutocomplete &&
        this.matrmAutocomplete.panel
      ) {
        fromEvent(this.matrmAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matrmAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matrmAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matrmAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matrmAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservices.getrmscroll(this.rmInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.rmlist.length >= 0) {
                      this.rmlist = this.rmlist.concat(datas);
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
  editorDisabled = false;
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
  SupplierTypeID: any;
  ecfresults: any
  SubmitForm() {
    this.showsuback = true
    this.showbacks = false
    this.disableecfsave = true
    const currentDate = this.ecfheaderForm?.value
    // this.previousvalues = JSON.stringify(this.ecfheaderForm.value)
    // console.log("previousvalues",this.previousvalues)
    // this.currentvalues = JSON.stringify(this.ecfheaderForm.value)
    // console.log("previousvalues",this.previousvalues)
    // console.log("currentvalues",this.currentvalues)
    // if(this.currentvalues == this.previousvalues){
    //   this.notification.showError("No Changes Detected");
    //   return false;
    // }
    if (this.ecfheaderForm?.value?.aptype === "") {
      // var answer = window.confirm("Please Select ECF Type");
      // if (answer) {
      //   this.SpinnerService.hide();
      //   return false;

      // }
      // else {
      //   return false;
      // }
      this.toastr.error('Please Select ECF Type');
      this.disableecfsave = false
      this.SpinnerService.hide();
      return false;
    }
    if (currentDate.aptype == 4) {
      if (this.ecfheaderForm?.value?.ppx == "" || this.ecfheaderForm?.value?.ppx == null || this.ecfheaderForm?.value?.ppx == undefined) {
        this.toastr.error('Please Select Payment For');
        this.disableecfsave = false
        this.SpinnerService.hide();
        return false;
      }
    }
    if (this.ecfheaderForm?.value?.commodity_id == undefined || this.ecfheaderForm?.value?.commodity_id <= 0) {
      // this.toastr.error('Please Select Commodity Name');
      this.toastr.error('Please Save Commodity');
      this.disableecfsave = false
      this.SpinnerService.hide();
      return false;
    }
    if (currentDate.aptype == 4 && this.ecfheaderForm?.value?.ppx?.id == "S" &&
      (this.ecfheaderForm?.value?.advancetype === "" || this.ecfheaderForm?.value?.advancetype === null || this.ecfheaderForm?.value?.advancetype === undefined)) {
      this.toastr.error('Please Choose Advance Type.');
      this.disableecfsave = false
      this.SpinnerService.hide();
      return false;
    }
    // if (this.ecfheaderForm?.value?.is_originalinvoice === undefined || this.ecfheaderForm?.value?.is_originalinvoice === null || this.ecfheaderForm?.value?.is_originalinvoice === "") {
    //   this.toastr.error('Please Select Is Original Document');
    //   this.disableecfsave = false
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.ecfheaderForm?.value?.client_code == undefined || this.ecfheaderForm?.value?.client_code <= 0) {
    //   this.toastr.error('Please Select Client Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.ecfheaderForm?.value?.rmcode == undefined || this.ecfheaderForm?.value?.rmcode <= 0) {
    //   this.toastr.error('Please Select RM Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    let amt = String(this.ecfheaderForm?.value?.apamount).replace(/,/g, '');

    if (this.ecfheaderForm?.value?.aptype == 13 && +amt > this.maxpettyamount) {
      this.notification.showError("Amount Should be less than Rs.10000 and greater than Rs.1");
      this.ecfheaderForm.patchValue({ "apamount": null })
      this.disableecfsave = false
      this.SpinnerService.hide();
      return false;
    }
    if (amt == "") {
      this.toastr.error('Please Enter ECF Amount');
      this.disableecfsave = false
      this.SpinnerService.hide();
      return false;
    }
    if (amt == "0" || +amt < 1) {
      this.toastr.error('Please Enter a Valid Amount');
      this.disableecfsave = false
      this.SpinnerService.hide();
      return false;
    }
    if (this.ecfheaderForm?.value?.notename === "" || this.ecfheaderForm?.value?.notename === null || this.ecfheaderForm?.value?.notename === undefined) {
      this.toastr.error('Please Add Notes');
      this.disableecfsave = false
      this.SpinnerService.hide();
      return false;
    }
    // if (this.ecftypeid == 3) {
    //   if (this.hrFlag) {
    //     if (this.ecfheaderForm?.value?.is_raisedby_self == false &&
    //       (this.ecfheaderForm?.value?.raised_by == undefined || this.ecfheaderForm?.value?.raised_by == null || this.ecfheaderForm?.value?.raised_by == "")) {
    //       this.toastr.error('Please Select Employee');
    //       this.disableecfsave = false
    //       this.SpinnerService.hide();
    //       return false;
    //     }
    //   }
    //   else {
    //     currentDate.is_raisedby_self = true
    //     currentDate.raised_by = this.raisedbyid
    //   }
    // }
    // else if (this.ecftypeid != 3) {
    //   currentDate.is_raisedby_self = true
    //   currentDate.raised_by = this.raisedbyid
    // }

    currentDate.is_raisedby_self = true
    currentDate.raised_by = this.raisedbyid
    if (this.ecfheaderForm?.value?.is_raisedby_self == true) {
      currentDate.raised_by = this.raisedbyid
    }
    else {
      this.raisedbyid = this.ecfheaderForm?.value?.raised_by?.id
      currentDate.raised_by = this.ecfheaderForm?.value?.raised_by?.id
    }
    currentDate.apdate = this.datePipe.transform(currentDate?.apdate, 'yyyy-MM-dd');
    if (typeof (currentDate.commodity_id) == 'object') {
      currentDate.commodity_id = this.ecfheaderForm?.value?.commodity_id?.id
    } else if (typeof (currentDate.commodity_id) == 'number') {
      currentDate.commodity_id = currentDate.commodity_id
    } else {
      this.notification.showError("Please Choose any one Commodity Name from the dropdown");
      this.disableecfsave = false
      this.SpinnerService.hide();
      return false;
    }

    // if (typeof (currentDate.client_code) == 'object') {
    //   currentDate.client_code = this.ecfheaderForm?.value?.client_code?.id
    // } else if (typeof (currentDate.client_code) == 'number') {
    //   currentDate.client_code = currentDate?.client_code
    // } 
    // else {
    //   this.notification.showError("Please Choose any one Client Name from the dropdown");
    //   this.SpinnerService.hide();
    //   return false;
    // }

    // if (typeof (currentDate.rmcode) == 'object') {
    //   currentDate.rmcode = this.ecfheaderForm?.value?.rmcode?.id
    // } else if (typeof (currentDate.rmcode) == 'number') {
    //   currentDate.rmcode = currentDate.rmcode
    // } else {
    //   this.notification.showError("Please Choose any one RM Name from the dropdown");
    //   this.SpinnerService.hide();
    //   return false;
    // }

    let branch = this.ecfheaderForm?.value.branch
    if (typeof (branch) == 'object') {
      currentDate.branch = this.ecfheaderForm?.value?.branch?.id
    }
    else {
      currentDate.branch = this.ecfheaderForm?.value?.branch
    }

    if (this.ecftypeid == 3) {
      currentDate.payto = "E"
      currentDate.supplier_type = 1
    }
    if (this.ecftypeid == 2 || this.ecftypeid == 7 || this.ecftypeid == 14) {
      currentDate.payto = ""
    }
    if (this.ecftypeid == 4) {
      currentDate.ppx = this.ecfheaderForm?.value?.ppx?.id ?? this.ecfheaderForm?.value?.ppx;
      currentDate.payto = this.ecfheaderForm?.value?.ppx
      currentDate.supplier_type = 1
    } else {
      currentDate.ppx = ""
    }
    if (this.ecftypeid == 14 || this.ecftypeid == 7) {
      currentDate.supplier_type = 1
    }
    if (this.ecftypeid == 13) {
      currentDate.supplier_type = 1
      if (typeof (currentDate.payto) == 'object') {
        currentDate.payto = currentDate?.payto?.id
      } else {
        currentDate.payto = currentDate?.payto
      }
    }
    if (this.ecftypeid == 4 && this.ecfheaderForm?.value?.ppx?.id == 'E') {
      currentDate.advancetype = 3
    }
    if (this.ecftypeid != 4)
      delete currentDate.advancetype
    if (typeof (currentDate.location) == 'object') {
      currentDate.location = currentDate?.location?.id
    } else if (typeof (currentDate.location) == 'number') {
      currentDate.location = currentDate?.location
    } else {
      currentDate.location = ""
    }
    // currentDate.ecfamount = currentDate.ecfamount.replace(/,/g, '')
    currentDate.inwarddetails_id = 1
    if (this.crno != '' && this.crno != null && this.crno != undefined)
      currentDate.crno = this.crno
    // let previousecfdata = this.ecfresult
    // console.log("previousecfdata",previousecfdata)
    // console.log("focusevent",this.focusedevent)


    // if(previousecfdata.aptype_id == currentDate.aptype && this.focusedevent == true){
    //   this.notification.showError("No Changes Detected");
    //   return false;
    // }
    // else if(previousecfdata.supplier_type_id == currentDate.supplier_type &&  this.supplierfocused == true){
    //   this.notification.showError("No Changes Detected");
    //   return false;
    // }
    // else if(previousecfdata?.commodity_id?.id == currentDate?.commodity_id && this.commodityfocused == true){
    //   this.notification.showError("No Changes Detected");
    //   return false;
    // }
    // else if(previousecfdata?.branch?.id == currentDate?.branch && this.branchfocused == true){
    //   this.notification.showError("No Changes Detected");
    //   return false;
    // }else if(previousecfdata?.is_originalinvoice == currentDate?.is_originalinvoice && this.orginvfocused == true){
    //   this.notification.showError("No Changes Detected");
    //   return false;
    // }else if(previousecfdata?.apamount == currentDate?.apamount && this.amountfocused == true){
    //   this.notification.showError("No Changes Detected");
    //   return false;
    // }else if(previousecfdata?.remark == currentDate?.remark && this.remarkfocused == true){
    //   this.notification.showError("No Changes Detected");
    //   return false;
    // }
    currentDate.module_type = 1
    currentDate.apamount = String(currentDate.apamount).replace(/,/g, '');

    this.SpinnerService.show();
    if (this.ecfheaderidd != "") {
      this.ecfservices.editecfheader(this.ecfheaderForm?.value, this.ecfheaderidd)
        .subscribe(result => {
          if (result.id == undefined) {
            this.notification.showError(result?.description)
            this.SpinnerService.hide()
            return false
          }
          else {
            this.notification.showSuccess("Successfully ECF Header Saved")
            this.SpinnerService.hide();
            this.ecfresults = result
            this.server_environment = result?.server_environment
            this.crno = result?.crno
            this.ecfheaderid = result?.id
            this.ecfheaderidd = result?.id
            this.ecftypeid = result?.aptype
            this.SupplierTypeID = result?.supplier_type
            this.ppxid = result?.ppx
            this.paytoid = result?.payto
            this.raisergst = result?.raiserbranchgst
            this.branchnamecheck = result?.branchname
            this.createdbyid = result?.raisedby
            this.locationname = result?.location
            this.commid = result.commodity_id
            if (this.InvoiceHeader.length == 0 && this.ecftypeid == 14) {
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicegst').setValue('N');
              this.show_suppdetails = false
            }
            if (this.InvoiceHeader.length == 0 && this.ecftypeid == 4) {
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicegst').setValue('N')
              if (this.ppxid == 'E') {
                this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicedate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
              }
            }

            if (this.ecftypeid == 3 || this.ecftypeid == 13 || (this.ecftypeid == 4 && this.paytoid == 'E')) {
              if (this.ecftypeid == 3)
                this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicegst').setValue('N')
              this.show_suppdetails = false
            }
            else {
              this.show_suppdetails = true
            }
            if (this.InvoiceHeader.length == 0)
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('branchdetails_id').setValue(this.branchdata)
            if (this.locationname != "" && this.locationname != null) {
              this.locationbasedcatsubcat();
            }
            this.ecftotalamount = Number(result?.apamount)
            this.disableecfsave = true
            this.readecfdata = true
            this.showviewinvoice = false
            this.showviewinvoices = true

            // if (this.ecftypeid === 13) {
            //   this.InvoiceHeaderForm.patchValue({
            //     invoicegst: "Y"
            //   })

            // }

            if (this.ecftypeid == 3 || this.ecftypeid == 13) {
              this.showsuppname = false
              this.showsuppgst = false
              this.showsuppstate = false
            }
            this.getInvHdrColCount()
            if (this.shareservice.addheader.value == 'Addheader') {
              // const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
              this.addSection()
            }
            this.shareservice.commodity_id.next(result?.commodity_id)
            this.approvernames =
            {
              label: "Approver Name",
              "method": "get",
              "url": this.ecfmodelurl + "ecfapserv/approver_dropdown",
              params: "&commodityid=" + result?.commodity_id + "&created_by=" + this.raisedbyid ,
              "searchkey": "query",
              required: true,
              "displaykey": "name_code_limit",
              // prefix: 'name',
              // suffix: 'limit',
              formcontrolname: 'approvedby',
              // separator: "hyphen",
              tooltip: true,
              tooltipkey: 'name_code_limit'
            }
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.disableecfsave = false
          this.SpinnerService.hide();
        }
        )
    }
    else {
      this.ecfservices.createecfheader(this.ecfheaderForm?.value)
        .subscribe(result => {
          if (result?.id == undefined) {
            this.notification.showError(result?.description)
            this.disableecfsave = false
            this.SpinnerService.hide()
            return false
          }
          else {
            this.notification.showSuccess("Successfully ECF Header Saved")
            this.showeditinvhdrform = true
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('branchdetails_id').setValue(this.branchdata)


            this.SpinnerService.hide()
            this.ecfresults = result
            this.crno = result?.crno
            this.ecfheaderid = result?.id
            this.ecfheaderidd = result?.id
            this.server_environment = result?.server_environment
            this.ecftypeid = result?.aptype
            // console.log("ecftypeid",this.ecftypeid)
            this.ppxid = result?.ppx
            this.paytoid = result?.payto
            this.raisergst = result?.raiserbranchgst
            this.branchnamecheck = result?.branchname
            this.raiserbranchid = result?.branch
            this.createdbyid = result?.raisedby
            this.locationname = result?.location
            if (this.InvoiceHeader.length == 0 && this.ecftypeid == 14) {
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicegst').setValue('N');
              this.show_suppdetails = false
            }
            if (this.InvoiceHeader.length == 0 && this.ecftypeid == 4) {
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicegst').setValue('N')
              if (this.ppxid == 'E') {
                this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicedate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
              }
            }

            if (this.ecftypeid == 3 || this.ecftypeid == 13 || (this.ecftypeid == 4 && this.paytoid == 'E')) {
              if (this.ecftypeid == 3)
                this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicegst').setValue('N')


              this.show_suppdetails = false
            }
            else {
              this.show_suppdetails = true
            }
            if (this.locationname != "" && this.locationname != null) {
              this.locationbasedcatsubcat();
            }
            this.ecftotalamount = Number(result?.apamount)
            // if (this.ecftypeid === 13) {
            //   this.InvoiceHeaderForm.patchValue({
            //     invoicegst: "Y"
            //   })

            // }
            if (this.ecftypeid === 3 || this.ecftypeid === 13) {
              this.showsuppname = false
              this.showsuppgst = false
              this.showsuppstate = false
            }

            if (this.ecftypeid == 4 && this.ecfheaderForm?.value?.ppx?.id == 'S') {
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoicegst').setValue('N')
            }
            this.SupplierTypeID = result?.supplier_type
            this.disableecfsave = true
            this.readecfdata = true
            this.getInvHdrColCount()

            this.shareservice.commodity_id.next(result?.commodity_id)
            this.approvernames =
            {
              label: "Approver Name",
              "method": "get",
              "url": this.ecfmodelurl + "ecfapserv/approver_dropdown",
              params: "&commodityid=" + result?.commodity_id + "&created_by=" + this.raisedbyid,
              "searchkey": "query",
              required: true,
               "displaykey": "name_code_limit",
              // prefix: 'name',
              // suffix: 'limit',
              formcontrolname: 'approvedby',
              // separator: "hyphen",
              tooltip: true,
              tooltipkey: 'name_code_limit'
            }
          }

        }, error => {
          this.errorHandler.handleError(error);
          this.disableecfsave = false
          this.SpinnerService.hide();
        }
        )
    }

  }

  locationbasedcatsubcat() {
    this.ecfservices.getpmd(this.locationname)
      .subscribe(result => {
        // console.log("pmdres",result)
        let datas = result
        this.pmdrecords = datas

      })
  }
  ecfreset() {
    this.ecfheaderForm.controls['aptype'].reset(""),
      this.ecfheaderForm.controls['supplier_type'].setValue(1),
      this.ecfheaderForm.controls['commodity_id'].reset(""),
      this.ecfheaderForm.controls['apamount'].reset(""),
      this.ecfheaderForm.controls['ppx'].reset(""),
      this.ecfheaderForm.controls['notename'].reset(""),
      this.ecfheaderForm.controls['remark'].reset(""),
      this.ecfheaderForm.controls['payto'].reset(""),
      this.ecfheaderForm.controls['client_code'].reset("")
    this.ecfheaderForm.controls['rmcode'].reset("")
    this.ecfheaderForm.controls['advancetype'].reset("")
    this.ecfheaderForm.controls['is_raisedby_self'].reset("")
    this.ecfheaderForm.controls['raised_by'].reset("")
    this.ecfheaderForm.controls['branch'].reset("")

  }
  // -----ECF HEADER ENDS------
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
    this.ecfservices.getsuppliername(id, suppliername, 1)
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
                this.ecfservices.getsuppliernamescroll(this.suplist, this.suppInput.nativeElement.value, 1, this.currentpage + 1)
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

  getSections(forms) {
    return forms.controls.invoiceheader.controls;
  }
  showecfupdate: any
  showinvheaderadd: boolean = false
  addSection() {
    let invoiceheaderdata = this.InvoiceHeaderForm.value.invoiceheader

    let id
    if (this.ecfheaderid != undefined) {
      id = this.ecfheaderid
    } else {
      id = this.ecfheaderidd
    }
    const invdataaas = this.invoiceheaderres
    if (invdataaas != undefined && this.showinvheaderadd == false) {
      for (let index = 0; index < invdataaas.length; index++) {
        if (invoiceheaderdata.length > 0) {
          if (invdataaas[index].invoice_status == "DRAFT") {
            this.toastr.error("Kindly complete the previous Invoice Header(s).")
            return false;
          }
          invoiceheaderdata[index].totalamount = String(invoiceheaderdata[index].totalamount).replace(/,/g, '');
          invoiceheaderdata[index].invoiceamount = String(invoiceheaderdata[index].invoiceamount).replace(/,/g, '');
          if (this.ecftypeid == 2 || (this.ecftypeid == 4 && this.ppxid == 'S') || this.ecftypeid == 14) {
            if ((invdataaas[index]?.invoicegst == invoiceheaderdata[index]?.invoicegst) && (invdataaas[index]?.supplier_id?.id == invoiceheaderdata[index]?.supplier_id) &&
              (invdataaas[index]?.manualsupp_name == invoiceheaderdata[index]?.manualsupp_name) && (invdataaas[index]?.invoiceno == invoiceheaderdata[index]?.invoiceno) &&
              (invdataaas[index]?.invoicedate == invoiceheaderdata[index]?.invoicedate) && (invdataaas[index]?.remarks == invoiceheaderdata[index]?.remarks) &&
              (invdataaas[index]?.totalamount == invoiceheaderdata[index]?.totalamount) && (invdataaas[index]?.invoiceamount == invoiceheaderdata[index]?.invoiceamount) &&
              (invdataaas[index]?.branchdetails_id?.id == invoiceheaderdata[index]?.branchdetails_id?.id) &&
              (invoiceheaderdata[index]?.file_key?.length == 0) && (invdataaas[index]?.pmd_data?.id == invoiceheaderdata[index]?.pmdlocation_id?.id) &&
              ((typeof (invdataaas[index]?.pmd_data?.id) == 'number' && this.PMDyesno == 'Y') || (typeof (invdataaas[index]?.pmd_data?.id) == 'undefined' && this.PMDyesno != 'Y'))) {
              // this.showinvheaderadd = false
            } else {
              this.showinvheaderadd = true
              break;
            }
          } else if (this.ecftypeid == 3) {
            if ((invdataaas[index]?.invoicegst == invoiceheaderdata[index]?.invoicegst) &&
              (invdataaas[index]?.manual_gstno == invoiceheaderdata[index]?.manual_gstno) && (invdataaas[index]?.invoiceno == invoiceheaderdata[index]?.invoiceno) &&
              (invdataaas[index]?.invoicedate == invoiceheaderdata[index]?.invoicedate) && (invdataaas[index]?.remarks == invoiceheaderdata[index]?.remarks) &&
              (invdataaas[index]?.totalamount == invoiceheaderdata[index]?.totalamount) && (invdataaas[index]?.invoiceamount == invoiceheaderdata[index]?.invoiceamount) &&
              (invdataaas[index]?.branchdetails_id?.id == invoiceheaderdata[index]?.branchdetails_id?.id) &&
              (invoiceheaderdata[index]?.file_key?.length == 0) && (invdataaas[index]?.pmd_data?.id == invoiceheaderdata[index]?.pmdlocation_id?.id) &&
              ((typeof (invdataaas[index]?.pmd_data?.id) == 'number' && this.PMDyesno == 'Y') || (typeof (invdataaas[index]?.pmd_data?.id) == 'undefined' && this.PMDyesno != 'Y'))) {
              // this.showinvheaderadd = false
            } else {
              this.showinvheaderadd = true
              break;
            }
          }
          else if (this.ecftypeid == 4 && this.ppxid == 'E') {
            if ((invdataaas[index]?.invoicegst == invoiceheaderdata[index]?.invoicegst) && (invdataaas[index]?.remarks == invoiceheaderdata[index]?.remarks) &&
              (invdataaas[index]?.totalamount == invoiceheaderdata[index]?.totalamount) && (invdataaas[index]?.invoiceamount == invoiceheaderdata[index]?.invoiceamount) &&
              (invdataaas[index]?.branchdetails_id?.id == invoiceheaderdata[index]?.branchdetails_id?.id) &&
              (invoiceheaderdata[index]?.file_key?.length == 0) && (invdataaas[index]?.pmd_data?.id == invoiceheaderdata[index]?.pmdlocation_id?.id) &&
              ((typeof (invdataaas[index]?.pmd_data?.id) == 'number' && this.PMDyesno == 'Y') || (typeof (invdataaas[index]?.pmd_data?.id) == 'undefined' && this.PMDyesno != 'Y'))) {
              // this.showinvheaderadd = false
            } else {
              this.showinvheaderadd = true
              break;
            }
          } else if (this.ecftypeid == 13) {
            if ((invdataaas[index]?.invoicegst == invoiceheaderdata[index]?.invoicegst) && (invdataaas[index]?.invoiceno == invoiceheaderdata[index]?.invoiceno) &&
              (invdataaas[index]?.invoicedate == invoiceheaderdata[index]?.invoicedate) && (invdataaas[index]?.remarks == invoiceheaderdata[index]?.remarks) &&
              (invdataaas[index]?.totalamount == invoiceheaderdata[index]?.totalamount) && (invdataaas[index]?.invoiceamount == invoiceheaderdata[index]?.invoiceamount) &&
              (invdataaas[index]?.branchdetails_id?.id == invoiceheaderdata[index]?.branchdetails_id?.id) &&
              (invoiceheaderdata[index]?.file_key?.length == 0) && (invdataaas[index]?.pmd_data?.id == invoiceheaderdata[index]?.pmdlocation_id?.id) &&
              ((typeof (invdataaas[index]?.pmd_data?.id) == 'number' && this.PMDyesno == 'Y') || (typeof (invdataaas[index]?.pmd_data?.id) == 'undefined' && this.PMDyesno != 'Y'))) {
              // this.showinvheaderadd = false
            } else {
              this.showinvheaderadd = true
              break;
            }
          } else if (this.ecftypeid == 7) {
            if ((invdataaas[index]?.invoicegst == invoiceheaderdata[index]?.invoicegst) && (invdataaas[index]?.supplier_id?.id == invoiceheaderdata[index]?.supplier_id) &&
              (invdataaas[index]?.manualsupp_name == invoiceheaderdata[index]?.manualsupp_name) && (invdataaas[index]?.invoiceno == invoiceheaderdata[index]?.invoiceno) &&
              (invdataaas[index]?.creditrefno == invoiceheaderdata[index]?.creditrefno) &&
              (invdataaas[index]?.invoicedate == invoiceheaderdata[index]?.invoicedate) && (invdataaas[index]?.remarks == invoiceheaderdata[index]?.remarks) && (invdataaas[index]?.refinv_crno == invoiceheaderdata[index]?.refinv_crno) &&
              (invdataaas[index]?.totalamount == invoiceheaderdata[index]?.totalamount) && (invdataaas[index]?.invoiceamount == invoiceheaderdata[index]?.invoiceamount) &&
              (invdataaas[index]?.branchdetails_id?.id == invoiceheaderdata[index]?.branchdetails_id?.id) &&
              (invoiceheaderdata[index]?.file_key?.length == 0) && (invdataaas[index]?.pmd_data?.id == invoiceheaderdata[index]?.pmdlocation_id?.id) &&
              ((typeof (invdataaas[index]?.pmd_data?.id) == 'number' && this.PMDyesno == 'Y') || (typeof (invdataaas[index]?.pmd_data?.id) == 'undefined' && this.PMDyesno != 'Y'))) {
              // this.showinvheaderadd = false
            } else {
              this.showinvheaderadd = true
              break;
              // this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('refinv_crno').setValue(this.filteredText1); 
            }
          } else if (invoiceheaderdata[index]?.apheader_id != id) {
            this.showinvheaderadd = true
            break;
          }
        }

      }
    }
    if (this.showinvheaderadd == true) {
      window.alert("Kindly Save the Invoice Header Entry.")
      return false;
    }
    if (Number(this.sum) < Number(this.ecftotalamount)) {
      this.showecfupdate = false
      const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
      control.push(this.INVheader());
      console.log("headerlength --->", invoiceheaderdata.length)
      if (this.ecftypeid == 14 || this.ecftypeid == 3 || this.ecftypeid == 4)
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][control.length - 1].get('invoicegst').setValue('N');

      if (this.SupplierTypeID == 1) {
        if (this.ecftypeid == 2 || this.ecftypeid == 7 || (this.ecftypeid == 4 && this.ppxid == 'S'))
          this.notification.showInfo("Please Choose GST Applicable")
        if (this.ecftypeid == 2 || this.ecftypeid == 7 || this.ecftypeid == 14 || (this.ecftypeid == 4 && this.ppxid == 'S')) {
          for (let i = 1; i <= invoiceheaderdata.length; i++) {
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppname').setValue(invoiceheaderdata[0].suppname)
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppliergst').setValue(invoiceheaderdata[0].suppliergst)
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppstate').setValue(invoiceheaderdata[0].suppstate)
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplierstate_id').setValue(invoiceheaderdata[0].supplierstate_id)
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplier_id').setValue(invoiceheaderdata[0].supplier_id)
          }
        }

      }

      this.showinvheaderadd = true
    } else if (Number(this.sum) >= Number(this.ecftotalamount)) {
      window.confirm("Already ECF Amount Exceeds.To add one more row you need to update ECF Amount.Do you want to proceed?")
      if (confirm) {
        // this.ECFUpdateForm.controls['apamount'].reset("")
        // this.showecfupdate = true
        this.disableecfsave = false
        this.readecfdata = false
        this.shareservice.addheader.next('Addheader')

      } else {
        this.disableecfsave = true
        this.readecfdata = true
        // this.showecfupdate = false
        //  return false
      }
    }
  }
  removeSection(i) {
    const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
    control.removeAt(i);
    this.InvoiceHeader.pop()
    this.datasums();
  }
  INVheader() {
    // let pos = {

    //     "code": "1903",
    //     "codename": "(1903) EXPENSES MANAGEMENT CELL",
    //     "fullname": "(1903) EXPENSES MANAGEMENT CELL",
    //     "id": 259,
    //     "name": "EXPENSES MANAGEMENT CELL"

    // }
    let group = new FormGroup({
      id: new FormControl(),
      suppname: new FormControl(),
      suppstate: new FormControl(),
      invoiceno: new FormControl(''),
      creditrefno: new FormControl(''),
      refinv_crno: new FormControl(''),
      invoicedate: new FormControl(''),
      invoiceamount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0),
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
      place_of_supply: new FormControl(this.ecfheaderForm?.value.branch),
      branchdetails_id: new FormControl(this.branchdata),
      bankdetails_id: new FormControl(1),
      entry_flag: new FormControl(0),
      barcode: new FormControl(''),
      creditbank_id: new FormControl(1),
      manual_gstno: new FormControl(''),
      manualsupp_name: new FormControl(''),
      filevalue: new FormArray([]),
      file_key: new FormArray([]),
      filedataas: new FormArray([]),
      remarks: new FormControl(''),
      debitbank_id: new FormControl(''),
      apinvoiceheader_crno: new FormControl(''),
      invoicestatus: new FormControl('DRAFT'),
      is_tds_applicable: new FormControl(''),
      paymentinstrctn: new FormControl(''),
      is_pmd: new FormControl(''),
      pmdlocation_id: new FormControl(''),
      is_recur: new FormControl(0),
      service_type: new FormControl(1),
      recur_fromdate: new FormControl(""),
      recur_todate: new FormControl(''),
      is_pca: new FormControl(0),
      pca_no: new FormControl(''),
      pca_bal_amt: new FormControl(''),
      captalisedflag: new FormControl(''),
      is_fa_capitalized: new FormControl(''),

    })

    group.get('place_of_supply').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getbranchscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.poslist = datas;
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      })

    group.get('branchdetails_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getbranchscroll(value, 1)
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
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      })

    group.get('pmdlocation_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservices.getPMDLocation(this.PMDbranchdata[0].id, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.PMDLocationlist = datas;
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      })
    // group.get('invoiceamount').valueChanges.pipe(
    //   debounceTime(20)
    // ).subscribe(value => {
    //   this.calcTotal(group)
    //   if (!this.InvoiceHeaderForm.valid) {
    //     return;
    //   }

    //   this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    // }
    // )
    // group.get('taxamount').valueChanges.pipe(
    //   debounceTime(20)
    // ).subscribe(value => {
    //   this.calcTotal(group)
    //   if (!this.InvoiceHeaderForm.valid) {
    //     return;
    //   }
    //   this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    // }
    // )
    group.get('totalamount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // this.calcTotal(group)
      this.datasums();
      if (!this.InvoiceHeaderForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    }
    )
    //   if(this.ecfheaderForm.value.commodity_id.id){
    //     group.get('pca_no').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //         console.log("For formgroup get if pca_no.valuechanges this.commodityid------------->",this.commodityid);
    //         console.log("For formgroup get if pca_no.valuechanges this.ecfheaderForm.value.commodity_id------------->",this.ecfheaderForm.value.commodity_id);
    //       }),
    //       switchMap(value => this.ecfservices.getPCA(this.ecfheaderForm.value.commodity_id.id, value, 1)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.PCAList = datas;
    //       this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    //     })
    //   }
    //  else{
    //   group.get('pca_no').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log("For formgroup get else pca_no.valuechanges this.commodityid------------->",this.commodityid)
    //       console.log("For formgroup get else pca_no.valuechanges this.ecfheaderForm.value.commodity_id------------->",this.ecfheaderForm.value.commodity_id)
    //     }),
    //     switchMap(value => this.ecfservices.getPCA(this.ecfheaderForm.value.commodity_id, value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.PCAList = datas;
    //     this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
    //   })
    //  }
    group.get('pca_no').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("For formgroup get pca_no.valuechanges this.commodityid------------->", this.commodityid)
          console.log("For formgroup get pca_no.valuechanges this.ecfheaderForm.value.commodity_id------------->", this.ecfheaderForm.value.commodity_id)
        }),
        switchMap(value => this.ecfservices.getPCA(this.commodityid, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {

        let datas = results["data"];
        this.PCAList = datas;
        this.linesChange.emit(this.InvoiceHeaderForm.value['invoiceheader']);
      })
    return group
  }
  calcTotal(group: FormGroup) {
    const Taxableamount = +group.controls['invoiceamount'].value;
    const Taxamount = +group.controls['taxamount'].value;
    const RoundingOff = +group.controls['roundoffamt'].value;
    const Otheramount = +group.controls['otheramount'].value;
    let toto = Taxableamount + Taxamount
    this.toto = toto.toFixed(2)
    group.controls['totalamount'].setValue((this.toto), { emitEvent: false });
    this.datasums();
  }

  datasums() {
    this.amt = this.InvoiceHeaderForm.value['invoiceheader'].map(x => Number(String(x.totalamount).replace(/,/g, '')));
    this.sum = this.amt.reduce((a, b) => a + b, 0);

  }
  showerasuppname: boolean = false
  showerasuppgst: boolean = false
  GSTstatus(data, i) {
    this.gstyesno = data.value
    const datas = this.InvoiceHeaderForm?.value?.invoiceheader
    if (data.value == "N") {
      this.showtaxforgst = false
      this.showsupppopup = true
      if (this.ecftypeid == 3) {
        this.showerasuppname = true
        this.showerasuppgst = true
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('manual_gstno').reset("")
      }
      this.SelectSupplierForm.controls['name'].enable();
      this.SelectSupplierForm.controls['code'].enable();
      this.SelectSupplierForm.controls['panno'].enable();
      this.suppliersearch = [
        { "type": "input", "label": "Supplier GST Number", "formvalue": "gstno", id: "create-ecf-0119" },
        { "type": "input", "label": "Supplier Code", "formvalue": "code", id: "create-ecf-0120" },
        { "type": "input", "label": "PAN Number", "formvalue": "panno", id: "create-ecf-0121" },
        // { "type": "dropdown", inputobj: this.choosesupplierfield, "formvalue": "name",defaultsearch:true},
      ]

      if (this.SupplierTypeID != 1) {
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppname').reset("")
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppstate').reset("")
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppliergst').reset("")
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplier_id').reset("")
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplierstate_id').reset("")
      }
      if (this.SupplierTypeID == 1 && i == 0) {
        for (let j = 0; j < datas?.length; j++) {
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('suppname').reset("")
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('suppstate').reset("")
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('suppliergst').reset("")
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('supplier_id').reset("")
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('supplierstate_id').reset("")
        }
      }
      this.dataclear('')
    }
    if (data.value == "Y") {
      if (this.ecftypeid == 3) {
        this.showerasuppname = true
        this.showerasuppgst = true
      }
      this.showtaxforgst = true
      this.showsupppopup = true
      this.showsuppliercode = true
      this.showsupplierpan = true
      this.SelectSupplierForm.controls['code'].disable();
      this.SelectSupplierForm.controls['panno'].disable();
      this.SelectSupplierForm.controls['name'].disable();
      this.suppliersearch = [
        { "type": "input", "label": "Supplier GST Number", "formvalue": "gstno", id: "create-ecf-0119" },
        { "type": "input", "label": "Supplier Code", "formvalue": "code", id: "create-ecf-0120", disabled: true },
        { "type": "input", "label": "PAN Number", "formvalue": "panno", id: "create-ecf-0121", disabled: true },
        // { "type": "dropdown", inputobj: this.choosesupplierfield, "formvalue": "name",defaultsearch:true},
      ]

      if (this.SupplierTypeID != 1) {
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppname').reset("")
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppstate').reset("")
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppliergst').reset("")
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplier_id').reset("")
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplierstate_id').reset("")
      }
      if (this.SupplierTypeID == 1 && i == 0) {
        for (let j = 0; j < datas?.length; j++) {
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('suppname').reset("")
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('suppstate').reset("")
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('suppliergst').reset("")
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('supplier_id').reset("")
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][j].get('supplierstate_id').reset("")
        }
      }
      this.dataclear('')
    }
  }

  getheaderedit(i) {
    this.showinvheaderadd = true
    this.inveditindex = i
  }

  getsuppindex(ind) {
    this.supplierindex = ind
    let invoiceheaders = this.InvoiceHeaderForm?.value?.invoiceheader[ind]
    if (invoiceheaders?.invoicegst == "" && this.ecftypeid != 4 || invoiceheaders?.invoicegst == null && this.ecftypeid != 4 || invoiceheaders?.invoicegst == undefined && this.ecftypeid != 4) {
      this.toastr.warning('', 'Please Choose GST Applicable Or Not', { timeOut: 1500 });
      this.showsupppopup = false
      return false
    }
    this.popupopen1()
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
  msme_reg_no:any;
  msme:any;
  getsuppView(data) {
    if (!data.id) {
      return;
    }
    this.supplierid = data?.id
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
          this.msme_reg_no = result?.msme_reg_no
          this.msme = result?.msme
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppname').setValue(this.SupplierName)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppliergst').setValue(this.SupplierGSTNumber)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplier_id').setValue(this.supplierid)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('supplierstate_id').setValue(this.stateid)
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][this.supplierindex].get('suppstate').setValue(this.statename)
          this.submitbutton = true;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  // SelectSuppliersearch() {
  //   let searchsupplier = this.SelectSupplierForm?.value;
  //   if ((searchsupplier?.code == "" || searchsupplier?.code == undefined || searchsupplier?.code == null)
  //      && (searchsupplier?.panno == "" || searchsupplier?.panno == undefined || searchsupplier?.panno == null)
  //      && (searchsupplier?.gstno == ""  || searchsupplier?.gstno == undefined  || searchsupplier?.gstno == null)) {
  //     this.getsuppliername("", "");
  //   }
  //   else {
  //     // this.SelectSupplierForm.controls['name'].enable();
  //     this.alternate = true;
  //     this.default = false;
  //     this.Testingfunctionalternate();
  //   }

  //   if(searchsupplier?.name !="" && searchsupplier?.name != null && searchsupplier?.name != undefined)
  //   {
  //     this.Testingfunctionalternate();

  //   }
  // }
  searchsupplier: any
  // Testingfunctionalternate() {
  //   this.searchsupplier = this.SelectSupplierForm.value;
  //   this.ecfservices.getselectsupplierSearch(this.searchsupplier, 1)
  //     .subscribe(result => {
  //       if (result['data']?.length == 0) {
  //         if(this.searchsupplier.code != '' && this.searchsupplier.code != undefined && this.searchsupplier.code != null)
  //           this.notification.showError("Enter Valid Supplier Code.")
  //         if(this.searchsupplier.gstno != '' && this.searchsupplier.gstno != undefined && this.searchsupplier.gstno != null)
  //           this.notification.showError("Enter Valid GST Number.")
  //         if(this.searchsupplier.panno != '' && this.searchsupplier.panno != undefined && this.searchsupplier.panno != null)
  //           this.notification.showError("Enter Valid PAN Number.")

  //         this.dataclear()
  //         return false;
  //       }
  //       if (result['data']?.length > 0) {
  //         this.selectsupplierlist = result['data']
  //         console.log("this.searchsupplier?.gstno?.length",this.searchsupplier?.gstno?.length)
  //         if (this.searchsupplier?.gstno?.length == 15 || this.searchsupplier?.panno?.length == 10) {
  //           let supplierdata = {
  //             "id": this.selectsupplierlist[0]?.id,
  //             "name": this.selectsupplierlist[0]?.name
  //           }
  //           this.supplierid = supplierdata?.id
  //           this.SelectSupplierForm.patchValue({ name: supplierdata })
  //           this.getsuppView(supplierdata)
  //         }else{

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
  //       this.SpinnerService.hide();
  //     })
  // }
  suppliers: any;
  SelectSuppliersearch(e) {
    this.suppliers = e
    let searchsupplier = this.SelectSupplierForm?.value;
    if ((this.suppliers?.code == "" || this.suppliers?.code == undefined || this.suppliers?.code == null)
      && (this.suppliers?.panno == "" || this.suppliers?.panno == undefined || this.suppliers?.panno == null)
      && (this.suppliers?.gstno == "" || this.suppliers?.gstno == undefined || this.suppliers?.gstno == null)
      // && (this.suppliers?.name.name == "" || this.suppliers?.name.name == undefined || this.suppliers?.name.name == null)
    ) {
      this.getsuppliername("", "");
    }
    else {
      // this.SelectSupplierForm.controls['name'].enable();
      // this.alternate = true;
      // this.default = false;
      // this.Testingfunctionalternate();
      if (this.suppliers?.gstno != "" && this.suppliers?.gstno != null && this.suppliers?.gstno != undefined) {
        this.ecfservices.getEmpBanch(this.suppliers?.gstno)
          .subscribe(res => {
            console.log("empbranch", res)
            let result = res.data
            if (result.length > 0) {
              this.notification.showError("KVB GST Numbers. cannot be used. ")
              this.SpinnerService.hide();
              return false
            }
            else {
              this.alternate = true;
              this.default = false;
              this.Testingfunctionalternate();
            }
          })
      }
      else {
        // this.alternate = true;
        // this.default = false;
        this.Testingfunctionalternate();
      }

    }
    if (searchsupplier?.name != "" && searchsupplier?.name != null && searchsupplier?.name != undefined) {
      this.Testingfunctionalternate();
    }
  }
  supplierlists: any;
  suppliersearchs: any;
  // Testingfunctionalternate() {
  //   this.searchsupplier = this.SelectSupplierForm.value;
  //   console.log("this.suppliers", this.suppliers)
  //   console.log("this.searchsupplier", this.searchsupplier)
  //   this.ecfservices.getselectsupplierSearch(this.suppliers, 1)
  //     .subscribe(result => {
  //       if (result['data']?.length == 0) {
  //         if (this.suppliers.code != '' && this.suppliers.code != undefined && this.suppliers.code != null)
  //           this.notification.showError("Enter Valid Supplier Code.")
  //         if (this.suppliers.gstno != '' && this.suppliers.gstno != undefined && this.suppliers.gstno != null)
  //           this.notification.showError("Enter Valid GST Number.")
  //         if (this.suppliers.panno != '' && this.suppliers.panno != undefined && this.suppliers.panno != null)
  //           this.notification.showError("Enter Valid PAN Number.")
  //         this.dataclear('')
  //         return false;
  //       }
  //       if (result['data']?.length > 0) {
  //         this.selectsupplierlist = result['data']
  //         this.supplierlists = result['data']
  //         console.log("selecteddata===========>", this.supplierlists)

  //         console.log("this.searchsupplier?.gstno?.length",this.searchsupplier?.gstno?.length)
  //         let supplierdatass = {
  //           id: this.supplierlists[0].id,
  //           name: this.supplierlists[0].name,
  //         };
  //         this.suppliersearchs = supplierdatass
  //         if (this.suppliers?.gstno?.length == 15 || this.suppliers?.panno?.length == 10) {
  //           let supplierdata = {
  //             "id": this.selectsupplierlist[0]?.id,
  //             "name": this.selectsupplierlist[0]?.name
  //           }
  //             this.alternate = true;
  //             this.default = false;
  //           this.choosesupplierfield1 = {
  //           label: "Choose Supplier",
  //           method: "get",
  //           url: this.ecfmodelurl + "venserv/search_supplierdetails_ecf",
  //           params: '&code=' + this.suppliers.code + '&panno=' + this.suppliers.panno + '&gstno=' + this.suppliers.gstno + '&name=',
  //           displaykey: "name",
  //           formcontrolname: 'name',
  //           searchkey: "query",
  //           wholedata: true,
  //           required: true,
  //           disabled: true,
  //           id: "create-ecf-0126"
  //         }
  //           this.supplierid = supplierdata?.id
  //           this.SelectSupplierForm.patchValue({ name: supplierdata })
  //           this.getsuppView(supplierdata)
  //         } else {
  //           // let supplierdata = {
  //           //   "id": this.selectsupplierlist[0]?.id,
  //           //   "name": this.selectsupplierlist[0]?.name
  //           // }
  //             this.alternate = false;
  //             this.default = true;
  //             this.choosesupplierfield = {
  //               label: "Choose Supplier",
  //               method: "get",
  //               url: this.ecfmodelurl + "venserv/search_suppliername_ecf",
  //               params: "&sup_id=" + "&name=" + "&gstno=" + this.suppliers.gstno,
  //               searchkey: "name",
  //               displaykey: "name",
  //               formcontrolname: 'name',
  //               wholedata: true,
  //               required: true,
  //               disabled: false,
  //               id: "create-ecf-0125"
  //             }
  //           this.supplierid = supplierdatass?.id
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
    this.ecfservices.getselectsupplierSearch(this.suppliers, 1)
      .subscribe(result => {
        if (result?.code){
          this.notification.showError(result?.description)
        }
        if (result['data']?.length == 0) {
          if (this.suppliers.code != '' && this.suppliers.code != undefined && this.suppliers.code != null)
            this.notification.showError("Enter Valid Supplier Code.")
          if (this.suppliers.gstno != '' && this.suppliers.gstno != undefined && this.suppliers.gstno != null)
            this.notification.showError("Enter Valid GST Number.")
          if (this.suppliers.panno != '' && this.suppliers.panno != undefined && this.suppliers.panno != null)
            this.notification.showError("Enter Valid PAN Number.")
          this.dataclear('')
          return false;
        }
        if (result['data']?.length > 0) {
          this.selectsupplierlist = result['data']
          this.supplierlists = result['data']
          console.log("selecteddata===========>", this.supplierlists)
          this.choosesupplierfield1 = {
            label: "Choose Supplier",
            method: "get",
            url: this.ecfmodelurl + "venserv/search_supplierdetails_ecf",
            params: '&code=' + this.suppliers.code + '&panno=' + this.suppliers.panno + '&gstno=' + this.suppliers.gstno + '&name=',
            displaykey: "name",
            formcontrolname: 'name',
            searchkey: "query",
            wholedata: true,
            required: true,
            id: "create-ecf-0126",
            tooltip: true,
            tooltipkey: "name"
          }
          console.log("this.searchsupplier?.gstno?.length",this.searchsupplier?.gstno?.length)
          let supplierdatass = {
            id: this.supplierlists[0].id,
            name: this.supplierlists[0].name,
          };
          this.suppliersearchs = supplierdatass
          if (this.searchsupplier?.gstno?.length == 15 || this.searchsupplier?.panno?.length == 10) {
            let supplierdata = {
              "id": this.selectsupplierlist[0]?.id,
              "name": this.selectsupplierlist[0]?.name
            }
            this.supplierid = supplierdata?.id
            this.SelectSupplierForm.patchValue({ name: supplierdata })
            this.getsuppView(supplierdata)
          } else {
            let supplierdata = {
              "id": this.selectsupplierlist[0]?.id,
              "name": this.selectsupplierlist[0]?.name
            }
            this.supplierid = supplierdatass?.id
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
    this.SelectSupplierForm.controls['name'].enable();
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
      this.choosesupplierfield = {
                label: "Choose Supplier",
                method: "get",
                url: this.ecfmodelurl + "venserv/search_suppliername_ecf",
                params: "&sup_id=" + "&name=" + "&gstno=" + this.suppliers.gstno,
                searchkey: "name",
                displaykey: "name",
                formcontrolname: 'name',
                wholedata: true,
                required: true,
                disabled: false,
                id: "create-ecf-0125",
                tooltip: true,
                tooltipkey: "name"
              }
    this.submitbutton = false;
  }


  // invHdrChangeToCurrency(ctrlname) {   
  //   if(this.charCode  != 46 && !(this.previousCharCode ==46 && this.charCode == 48))
  //   {
  //     let a = this.ecfheaderForm.get(ctrlname).value;
  //     a = a.replace(/,/g, "");
  //     if (a && !isNaN(+a)) 
  //     {
  //       let num: number = +a;
  //       num = +(num.toFixed(2))
  //       let temp = new Intl.NumberFormat("en-GB", {style: 'decimal'}).format(num); 
  //       temp = temp ? temp.toString() : '';
  //       this.ecfheaderForm.get(ctrlname).setValue(temp)      
  //     }
  //   }
  // }

  numberOnlyandDot(event, val): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode >= 47) && (charCode < 48 || charCode > 57)) {
      return false;
    }
    val = String(val + event.key).replace(/,/g, '')
    if (+val > 9999999999)
      return false
    else
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
  valid_arr: Array<any> = [];
  file_process_data2: any = {};
  globalFiles: Array<{ name: string; size: number; id: string }> = []; // New array to store file details


  // getFileDetails(e, filetype) {
  //   this.valid_arr = []
  //   console.log('befor   this.file_process_data------------->>>>>>>>>>>', this.file_process_data)
  //   let data
  //   if (this.invdtladdonid != -1)
  //     data = this.InvoiceHeaderForm.value.invoiceheader;
  //   else
  //     data = this.frmInvHdrDet.value
  //   for (var i = 0; i < e.target.files.length; i++) {
  //     if (this.invdtladdonid != -1) {
  //       data[this.invdtladdonid]?.filevalue?.push(e?.target?.files[i])
  //       data[this.invdtladdonid]?.filedataas?.push(e?.target?.files[i])
  //     }
  //     else {
  //       data?.filevalue?.push(e?.target?.files[i])
  //     }
  //     this.valid_arr.push(e.target.files[i]);
  //   }

  //   if (e.target.files.length > 0) {
  //     if (this.invdtladdonid != -1 && data[this.invdtladdonid]?.file_key.length < 1) {
  //       data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[0]);
  //       data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[1]);
  //       data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[2]);
  //       data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[3]);
  //     }
  //   }
  //   if (this.file_process_data[filetype] == undefined) {
  //     this.file_process_data[filetype] = this.valid_arr;
  //   }
  //   else if (this.file_process_data[filetype] != undefined) {
  //     if (this.file_process_data[filetype].length == 0) {
  //       this.file_process_data[filetype] = this.valid_arr;
  //     }
  //     else {
  //       let Files = this.file_process_data[filetype]
  //       for (let file of this.valid_arr) {
  //         Files.push(file)
  //       }
  //       this.file_process_data[filetype] = Files;
  //     }

  //   }
  //   console.log('this.file_process_data------------->>>>>>>>>>>', this.file_process_data)

  // }


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
    console.log('this.file_process_data2------------->>>>>>>>>>>', this.file_process_data2)
  }
  deletevalidatefunction() {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      class: "",
      value: "",
      function: false,
    }
    if (this.invhdrForm != 'frmInvHdrDet') {
      if (this.readinvhdrdata != false) {
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "delete",
          class: "",
          value: "",
          function: false,
        }
      }
      else {
        config = {
          disabled: false,
          style: { color: "red" },
          icon: "delete",
          class: "",
          value: "",
          function: true,
        }
      }
    }
    else if (this.invhdrForm == 'frmInvHdrDet') {
      config = {
        disabled: false,
        style: { color: "red" },
        icon: "delete",
        class: "",
        value: "",
        function: true,
      }
    }
    return config
  }

  // deletefileUpload(invdata, i, type) {

  //   // let filesValue = this.fileInput.toArray()
  //   // let filesValueLength = filesValue?.length
  //   // for (let i = 0; i < filesValueLength; i++) {
  //   //   filesValue[i].nativeElement.value = ""
  //   // }
  //   let index_id: any = "file" + this.fileindex;
  //   if (invdata == 'frmInvHdrDet') {
  //     this.file_process_data[type].splice(i, 1);
  //     this.frmInvHdrDet.value.filevalue.splice(i, 1)
  //   }
  //   else {
  //     let filedata = invdata.filevalue
  //     let filedatas = invdata.filedataas
  //     let file_key = invdata.file_key;
  //     // this.fileInput:any=this.fileInput.toArray();
  //     // this.fileInput.splice(i,1);
  //     this.file_process_data[type].splice(i, 1);
  //     filedata.splice(i, 1)
  //     filedatas.splice(i, 1)

  //     if (this.file_process_data[this.uploadFileTypes[0]]?.length == 0 && this.file_process_data[this.uploadFileTypes[1]]?.length == 0 &&
  //       this.file_process_data[this.uploadFileTypes[2]]?.length == 0 && this.file_process_data[this.uploadFileTypes[3]]?.length == 0) {
  //       this.fileInput.nativeElement.value = ""
  //       file_key = []
  //     }
  //   }
  //   console.log('this.file_process_data------------->>>>>>>>>>>', this.file_process_data)
  // }

  // deletefileUpload(invdata, i, type) {

  //   // let filesValue = this.fileInput.toArray()
  //   // let filesValueLength = filesValue?.length
  //   // for (let i = 0; i < filesValueLength; i++) {
  //   //   filesValue[i].nativeElement.value = ""
  //   // }
  //   let index_id: any = "file" + this.fileindex;
  //   if (invdata == 'frmInvHdrDet') {
  //     this.file_process_data[type].splice(i, 1);
  //     this.frmInvHdrDet.value.filevalue.splice(i, 1)
  //   }
  //   else {
  //     let filedata = invdata.filevalue
  //     let filedatas = invdata.filedataas
  //     let file_key = invdata.file_key;
  //     // this.fileInput:any=this.fileInput.toArray();
  //     // this.fileInput.splice(i,1);
  //     this.file_process_data[type].splice(i, 1);
  //     filedata.splice(i, 1)
  //     filedatas.splice(i, 1)

  //     if((this.file_process_data[this.uploadFileTypes[0]]?.length == 0 || this.file_process_data[this.uploadFileTypes[0]]?.length == undefined)
  //       && (this.file_process_data[this.uploadFileTypes[1]]?.length == 0 || this.file_process_data[this.uploadFileTypes[1]]?.length == undefined)
  //       && (this.file_process_data[this.uploadFileTypes[2]]?.length == 0 || this.file_process_data[this.uploadFileTypes[2]]?.length == undefined)
  //       && (this.file_process_data[this.uploadFileTypes[3]]?.length == 0 || this.file_process_data[this.uploadFileTypes[3]]?.length == undefined)) 
  //       {
  //       // this.fileInput.nativeElement.value = ""
  //       this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('file_key').setValue([])
  //     }
  //   }

  //   console.log('this.file_process_data------------->>>>>>>>>>>', this.file_process_data)
  //   this.fileUploaded = this.fileUploadChk()

  // }

  deletefileUpload(invdata: any, i: number, type: string) {
  // find the file from current paged list
  const row = this.pagedFiles[i];
  if (!row) return;

  const { file, type: fileType } = row;

  // remove from main file_process_data
  const fileList = this.file_process_data[fileType];
  if (fileList) {
    const idx = fileList.findIndex((f: any) => f.name === file.name);
    if (idx > -1) {
      fileList.splice(idx, 1);
    }
  }

  // also update form if needed
  if (invdata === 'frmInvHdrDet') {
    const fv = this.frmInvHdrDet.get('filevalue') as FormArray;
    if (fv) {
      fv.removeAt(i);
    }
  } else if (invdata) {
    const filedata = invdata.filevalue;
    const filedatas = invdata.filedataas;
    if (filedata && filedatas) {
      const idx = filedata.findIndex((f: any) => f.name === file.name);
      if (idx > -1) {
        filedata.splice(idx, 1);
        filedatas.splice(idx, 1);
      }
    }
  }

  // refresh flattened + paginated list
  this.preparePagedFiles();

  console.log('file_process_data after delete:', this.file_process_data);
}

  submitinvoiceheader() {
    let invheaderresult: boolean
    this.SpinnerService.show();


    const invoiceheaderdata = this.InvoiceHeaderForm?.value?.invoiceheader
    for (let i in invoiceheaderdata) {
      if (this.ecftypeid != 14) {
        if (invoiceheaderdata[i]?.invoicegst == '' || invoiceheaderdata[i]?.invoicegst == null || invoiceheaderdata[i]?.invoicegst == undefined) {
          this.toastr.error('Please Choose GST Applicable or Not');
          this.SpinnerService.hide()
          return false;
        }
      }
      if (invoiceheaderdata[i]?.branchdetails_id == '' || invoiceheaderdata[i]?.branchdetails_id == null || invoiceheaderdata[i]?.branchdetails_id == undefined) {
        this.toastr.error('Please Choose Branch');
        this.SpinnerService.hide()
        return false;
      }
      if ((invoiceheaderdata[i]?.invoiceno == '' || invoiceheaderdata[i]?.invoiceno == null || invoiceheaderdata[i]?.invoiceno == undefined) &&
        this.ecftypeid != 3) {
        this.toastr.error('Please Choose Supplier Name');
        this.SpinnerService.hide()
        return false;
      }
      if ((invoiceheaderdata[i]?.invoiceno == '' || invoiceheaderdata[i]?.invoiceno == null || invoiceheaderdata[i]?.invoiceno == undefined) &&
        (this.ecftypeid != 3 && this.ecftypeid != 13)) {
        this.toastr.error('Please Enter Invoice Number');
        this.SpinnerService.hide()
        return false;
      }
      if ((invoiceheaderdata[i]?.invoicedate == '' || invoiceheaderdata[i]?.invoicedate == null || invoiceheaderdata[i]?.invoicedate == undefined) &&
        (this.ecftypeid != 3 && this.ecftypeid != 13)) {
        this.toastr.error('Please Choose Invoice Date');
        this.SpinnerService.hide()
        return false;
      }
      if (this.ecftypeid != 14) {
        if ((invoiceheaderdata[i]?.invoiceamount == '') || (invoiceheaderdata[i]?.invoiceamount == null) || (invoiceheaderdata[i]?.invoiceamount == undefined)) {
          this.toastr.error('Please Enter Taxable Amount');
          this.SpinnerService.hide()
          return false;
        }
      }
      // if ((invoiceheaderdata[i]?.taxamount == 0 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y' && this.ecftypeid == 2) || (invoiceheaderdata[i]?.taxamount == 0 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y' && this.ecftypeid == 7)) {
      //   this.toastr.error('Please Enter Tax Amount');
      //   this.SpinnerService.hide()
      //   return false;
      // }

      if (this.ecftypeid == 7) {
        if ((invoiceheaderdata[i]?.creditrefno == '') || (invoiceheaderdata[i]?.creditrefno == null) || (invoiceheaderdata[i]?.creditrefno == undefined)) {
          this.toastr.error('Please Enter Credit Ref No');
          this.SpinnerService.hide()
          return false;
        }
      }
      if (invoiceheaderdata[i]?.remarks == '' || invoiceheaderdata[i]?.remarks == undefined) {
        this.toastr.error('Please Enter Purpose');
        this.SpinnerService.hide()
        return false;
      }

      if (invoiceheaderdata[i]?.is_recur.value == 1 && (invoiceheaderdata[i]?.service_type?.value == 1 || invoiceheaderdata[i]?.service_type?.value == undefined || invoiceheaderdata[i]?.service_type?.value == null)) {
        this.toastr.error('Please select Service Type');
        this.SpinnerService.hide()
        return false;
      }

      if ((invoiceheaderdata[i]?.service_type == 2 || invoiceheaderdata[i]?.service_type == 3) && (invoiceheaderdata[i]?.recur_fromdate == '' || invoiceheaderdata[i]?.recur_fromdate == undefined || invoiceheaderdata[i]?.recur_fromdate == null)) {
        this.toastr.error('Please select Recurring From Date');
        this.SpinnerService.hide()
        return false;
      }

      if (invoiceheaderdata[i]?.service_type == 3 && (invoiceheaderdata[i]?.recur_todate == '' || invoiceheaderdata[i]?.recur_todate == undefined || invoiceheaderdata[i]?.recur_todate == null)) {
        this.toastr.error('Please select Recurring To Date');
        this.SpinnerService.hide()
        return false;
      }

      if (invoiceheaderdata[i]?.filedataas.length <= 0 || invoiceheaderdata[i]?.file_key.length == 0 || invoiceheaderdata[i]?.filekey.length == 0) {
        this.toastr.error('Please Upload File');
        this.SpinnerService.hide()
        return false;
      }
      if (invoiceheaderdata[i].id === "" || invoiceheaderdata[i].id === null) {
        delete invoiceheaderdata[i]?.id
      }
      if (this.ecfheaderid != undefined) {
        invoiceheaderdata[i].apheader_id = this.ecfheaderid
      } else {
        invoiceheaderdata[i].apheader_id = this.ecfheaderidd
      }
      invoiceheaderdata[i].invoicedate = this.datePipe.transform(invoiceheaderdata[i]?.invoicedate, 'yyyy-MM-dd');
      if ((invoiceheaderdata[i]?.recur_fromdate != '' && invoiceheaderdata[i]?.recur_fromdate != undefined && invoiceheaderdata[i]?.recur_fromdate == null))
        invoiceheaderdata[i].recur_fromdate = this.datePipe.transform(invoiceheaderdata[i]?.recur_fromdate, 'yyyy-MM-dd');
      if ((invoiceheaderdata[i]?.recur_todate != '' && invoiceheaderdata[i]?.recur_todate != undefined && invoiceheaderdata[i]?.recur_todate == null))
        invoiceheaderdata[i].recur_todate = this.datePipe.transform(invoiceheaderdata[i]?.recur_todate, 'yyyy-MM-dd');

      if (typeof (invoiceheaderdata[i].place_of_supply) == 'object') {
        invoiceheaderdata[i].place_of_supply = invoiceheaderdata[i]?.place_of_supply?.code
      } else {
        invoiceheaderdata[i].place_of_supply = invoiceheaderdata[i]?.place_of_supply
      }
      if (typeof (invoiceheaderdata[i].branchdetails_id) == 'object') {
        invoiceheaderdata[i].branchdetails_id = invoiceheaderdata[i]?.branchdetails_id?.id
      } else {
        invoiceheaderdata[i].branchdetails_id = invoiceheaderdata[i]?.branchdetails_id
      }
      invoiceheaderdata[i].invoiceamount = invoiceheaderdata[i].invoiceamount.replace(/,/g, '')
      invoiceheaderdata[i].totalamount = invoiceheaderdata[i].totalamount.replace(/,/g, '')
      if (this.ecftypeid == 3) {
        // invoiceheaderdata[i].invoicegst = 'N'
        invoiceheaderdata[i].invoiceno = "inv" + this.datePipe.transform(new Date(), 'ddMM');
      }
      invoiceheaderdata[i].invoicegst = this.InvoiceHeaderForm?.value?.invoicegst

      invoiceheaderdata[i].invtotalamt = this.sum
      invoiceheaderdata[i].raisorbranchgst = this.raisergst
      if (invoiceheaderdata[i]?.suppname == null) {
        invoiceheaderdata[i].suppname = ""
      }
      if (invoiceheaderdata[i]?.taxamount == "" && this.InvoiceHeaderForm?.value?.invoicegst === 'N') {
        invoiceheaderdata[i].taxamount = 0
      }
      if (this.ppxid == 'E') {
        invoiceheaderdata[i].invoiceno = "inv" + this.datePipe.transform(new Date(), 'ddMM');
        invoiceheaderdata[i].invoicedate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      }
      // i == this.inveditindex &&
      if (this.editkey == "modification") {
        invoiceheaderdata[i].edit_flag = 1
        invoiceheaderdata[i].apinvoiceheader_crno = this.InvoiceHeader[i]?.apinvoiceheader_crno
        invoiceheaderdata[i].debitbank_id = this.InvoiceHeader[i]?.debitbank_id
      } else if (this.editkey == "edit") {
        invoiceheaderdata[i].edit_flag = 0
        invoiceheaderdata[i].apinvoiceheader_crno = this.InvoiceHeader[i]?.apinvoiceheader_crno
        invoiceheaderdata[i].debitbank_id = this.InvoiceHeader[i]?.debitbank_id
      }
      delete invoiceheaderdata[i]?.suppstate
      // delete invoiceheaderdata[i]?.filekey
    }

    this.Invoicedata = this.InvoiceHeaderForm?.value?.invoiceheader
    let reqData = this.Invoicedata
    for (let i = 0; i < reqData.length; i++) {
      let keyvalue = "file" + i
      let pairvalue = reqData[i]?.filevalue

      for (let fileindex in pairvalue) {
        this.formData.append(keyvalue, pairvalue[fileindex])
      }
    }
    this.formData.append('data', JSON.stringify(this.Invoicedata));
    if (this.ecfstatusid === 2) {
      this.ecfservice.createinvhdrmodification(this.formData)
        .subscribe(result => {
          let invhdrresults = result['invoiceheader']
          for (let i in invhdrresults) {
            if (invhdrresults[i]?.id == undefined) {
              invheaderresult = false
              this.notification.showError(invhdrresults[i]?.description)
              this.SpinnerService.hide()
              return false
            } else {
              invheaderresult = true
            }
          }
          if (invheaderresult == true) {
            this.notification.showSuccess("Successfully Invoice Header Saved!...")
            this.SpinnerService.hide();
            this.invheadersave = true
            this.readinvhdrdata = true
            this.showgstapply = true
            this.invhdrsaved = true
            this.showaddbtns = true

            let data = this.InvoiceHeaderForm?.value?.invoiceheader
            for (let i in data) {
              data[i].id = result?.invoiceheader[i]?.id
            }
            this.invoiceheaderres = result?.invoiceheader
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    } else {
      console.log("this.gfr", this.formData)
      this.ecfservices.invoiceheadercreate(this.formData)
        .subscribe(result => {
          let invhdrresults = result['invoiceheader']
          for (let i in invhdrresults) {
            if (invhdrresults[i]?.id == undefined) {
              invheaderresult = false
              this.notification.showError(invhdrresults[i]?.description)
              this.SpinnerService.hide()
              return false
            } else {
              invheaderresult = true
            }
          }
          if (invheaderresult == true) {
            this.notification.showSuccess("Successfully Invoice Header Saved!...")
            this.SpinnerService.hide();
            this.invheadersave = true
            this.readinvhdrdata = true
            this.showgstapply = true
            this.invhdrsaved = true
            this.showaddbtns = true
            this.AddinvDetails = false
            let data = this.InvoiceHeaderForm?.value?.invoiceheader
            for (let i in data) {
              data[i].id = result?.invoiceheader[i]?.id
            }
            this.invoiceheaderres = result?.invoiceheader
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )
    }
  }


  deleteinvheader(data, section, ind) {
    let id = section?.value?.id
    if (id != undefined) {
      this.delinvid = id
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        this.SpinnerService.show()
        this.ecfservices.invhdrdelete(this.delinvid)
          .subscribe(result => {
            this.SpinnerService.hide()
            if (result?.status === "success") {
              //  this.fileInput.nativeElement.value= ""
              this.notification.showSuccess("Invoice Header line deleted Successfully")
              this.removeSection(ind)
              this.showinvheaderadd = false
              if (this.InvoiceHeaderForm?.value?.invoiceheader?.length === 0) {
                this.addSection()
              }
            } else {
              this.notification.showError(result?.description)
              return false

            }
          }, error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
      }
      else {
        return false;
      }
    } else {
      this.removeSection(ind)
      this.fileInput.nativeElement.value= ""
      this.showinvheaderadd = false
      if (this.InvoiceHeaderForm?.value?.invoiceheader?.length === 0) {
        this.addSection()
      }
    }
  }


  invoiceheaderaddonid: any
  invheadertotamount: any
  invheaderlist: any

  Addinvoices(section, data, index) {
    let datas = this.ecfeditdata['Invheader']
    let invdates = this.datePipe.transform(section.value.invoicedate, 'yyyy-MM-dd')
    let headerdata = this.InvoiceHeaderForm.value.invoiceheader[index]
    if (this.ecftypeid == 2) {
      if (datas[index].supplier_id.name != section.value.suppname) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].supplier_id.id != section.value.supplier_id) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].suppliergst != section.value.suppliergst) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].invoiceno != section.value.invoiceno) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].invoicedate != invdates) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].invoiceamount != section.value.invoiceamount) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].taxamount != section.value.taxamount) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }

      else if (datas[index].roundoffamt != section.value.roundoffamt) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].otheramount != section.value.otheramount) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }
      else if (datas[index].totalamount != section.value.totalamount) {
        this.notification.showInfo("Please save the changes you have done")
        return false
      }

      else {
        this.showheaderdata = false
        this.showinvocedetail = true
        this.invheadersave = true
        this.readinvhdrdata = true
        this.Addinvoice(section, data, index)

      }
    }

    if (this.ecftypeid == 3) {

      this.showheaderdata = false
      this.showinvocedetail = true
      this.invheadersave = true
      this.readinvhdrdata = true
      this.Addinvoice(section, data, index)
    }

    if (this.ecftypeid == 4) {

      this.showheaderdata = false
      this.showinvocedetail = true
      this.invheadersave = true
      this.readinvhdrdata = true
      this.Addinvoice(section, data, index)
    }

  }
  getinvoiceheaderresults: any
  getgstapplicable: any
  supinvno: any
  supinvdate: any
  supname: any
  supgstno: any
  suppincode: any


  Addinvoice(section, data, index) {
    this.SpinnerService.show()
    this.checkmultilevel();
    this.showheaderdata = false
    this.showinvocedetail = true
    let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
    invdtldatas.clear()
    let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
    crdtdtldatas.clear()
    if (this.ecftypeid == 4) {
      let debitdtldatas = this.DebitDetailForm.get('debitdtl') as FormArray
      debitdtldatas.clear()
    }
    // this.invheaderlist = data?.invoiceheader
    // let suppliername = this.invheaderlist[index]?.suppname
    // if (this.invoiceheaderres != undefined) {
    //   let datas = this.invoiceheaderres[index]
    //   this.getgstapplicable = datas?.invoicegst
    //   this.invheadertotamount = Number(datas?.totalamount)
    //   this.invoiceheaderaddonid = datas?.id
    //   this.totalamount = this.invoiceheaderres[index]?.totalamount
    //   this.suppid = this.invoiceheaderres[index]?.supplier_id
    //   let invamount = Number(this.invoiceheaderres[index]?.invoiceamount)
    //   let roundamount = Number(this.invoiceheaderres[index]?.roundoffamt)
    //   let otheramount = Number(this.invoiceheaderres[index]?.otheramount)
    //   this.taxableamount = invamount
    //   this.invoiceno = this.invoiceheaderres[index]?.invoiceno
    //   this.invoiceheaderdetailForm.patchValue({
    //     raisorcode: this.raisergst,
    //     raisorname: [''],
    //     transbranch: [''],
    //     gst: datas?.invoicegst,
    //     suppcode: this.SupplierCode,
    //     suppbranch: this.City,
    //     suppname: suppliername,
    //     suppgstno: datas?.suppliergst,
    //     invoiceno: datas?.invoiceno,



    //     invoicedate: this.datePipe.transform(datas?.invoicedate, 'dd/MM/yyyy'),
    //     taxableamt: this.taxableamount,
    //     taxamount: datas?.taxamount,
    //     invoiceamt: datas?.totalamount,
    //     otheramount: otheramount,
    //     rndamount: roundamount,
    //   })
    // } else {
    let sectiondatas = section?.value
    this.invoiceheaderaddonid = section?.value?.id
    this.invheadertotamount = Number(section?.value?.totalamount)
    this.suppid = sectiondatas?.supplier_id
    this.SupplierGSTNumber = sectiondatas?.suppliergst
    let invamount = Number(sectiondatas?.invoiceamount)
    let roundamount = Number(sectiondatas?.roundoffamt)
    let otheramount = Number(sectiondatas?.otheramount)
    this.taxableamount = invamount
    this.totalamount = sectiondatas?.totalamount
    this.invoiceno = sectiondatas?.invoiceno
    this.getgstapplicable = sectiondatas?.invoicegst
    this.invoiceheaderdetailForm.patchValue({
      raisorcode: this.raisergst,
      raisorname: [''],
      transbranch: [''],
      gst: sectiondatas?.invoicegst,
      suppcode: this.SupplierCode,
      suppbranch: this.City,
      suppname: sectiondatas?.suppname,
      suppgstno: sectiondatas?.suppliergst,
      invoiceno: sectiondatas?.invoiceno,
      invoicedate: this.datePipe.transform(sectiondatas?.invoicedate, 'dd-MMM-yyyy'),
      taxableamt: this.taxableamount,
      invoiceamt: sectiondatas?.totalamount,
      taxamount: sectiondatas?.taxamount,
      otheramount: otheramount,
      rndamount: roundamount,
    })
    // }
    if (this.invoiceheaderaddonid === "" || this.invoiceheaderaddonid === undefined || this.invoiceheaderaddonid === null) {
      this.toastr.warning('', 'Please Create Invoice Header First ', { timeOut: 1500 });
      this.showinvocedetail = false
      this.showheaderdata = true
      this.SpinnerService.hide()
      return false
    }

    if (this.ecftypeid != 3 && this.ecftypeid != 4 && this.ecftypeid != 13) {
      if (this.branchnamecheck != "PRECIOUS METALS DIVISION" || (this.branchnamecheck == "PRECIOUS METALS DIVISION" && (this.locationname == null || this.locationname == ""))) {
        this.ecfservices.GetbranchgstnumberGSTtype(this.suppid, this.raiserbranchid)
          .subscribe((results) => {
            let datas = results;
            this.branchgstnumber = datas?.Branchgst
            this.type = datas?.Gsttype
          })
      } else {
        this.ecfservices.GetpettycashGSTtype(this.SupplierGSTNumber, this.raisergst)
          .subscribe(results => {
            let datas = results;
            this.type = datas?.Gsttype

          })
      }
    }

    this.ecfservice.getinvheaderdetails(this.invoiceheaderaddonid)
      .subscribe(results => {
        if (results.id != undefined) {
          this.getinvoiceheaderresults = results
          this.creditlen = results['credit']

          if (this.ecftypeid == 4) {
            let invoicedtl = results['invoicedtl']
            if (invoicedtl?.length != 0) {
              for (let i in invoicedtl) {
                this.invdetailidforadvance = invoicedtl[i]?.id
              }
            }
          }
          if (this.ecftypeid != 4) {
            if (results['invoicedtl']?.length === 0) {
              this.INVsum = ''
              this.invdtlsave = false
              this.readinvdata = false
            }
          }
          if (results['credit']?.length === 0) {
            this.accdata = ''
            this.eraaccdata = ''
            this.discreditbtn = false
            this.readcreditdata = false
          }
          if (this.locationname != "" && this.locationname != null && results['credit']?.length == 0) {
            this.ecfservices.getpmd(this.locationname)
              .subscribe(result => {
                this.pmdrecords = result
              })
          }
          for (let datas of this.getinvoiceheaderresults?.credit) {
            datas['temp_amount'] = datas?.amount
          }
          if (this.ecftypeid != 4) {
            for (let a of results?.invoicedtl) {
              this.totaltax = a?.taxamount
              if (this.ecftypeid == 13) {
                this.SupplierDetailForm.patchValue({
                  invoiceno: a?.invoiceno,
                  invoicedate: a?.invoicedate,
                  supplier_name: a?.supplier_name,
                  suppliergst: a?.suppliergst,
                  pincode: a?.pincode
                })
              }
            }
          }

          if (results) {
            if (this.ecftypeid != 4) {
              let jsondata: any
              let jsondatas: any
              if (this.ecftypeid == 2) {
                jsondata = { "supplier_id": this.suppid }
                jsondatas = { "crn_supplier_id": this.suppid }
              }
              else if (this.ecftypeid == 3) {
                jsondata = { "raisedby": this.raisedbyid }
              }


              if (jsondata != undefined) {
                this.ecfservices.ppxadvance(jsondata).subscribe(result => {
                  this.ppxshowapi = true
                  if (result['data'] != undefined) {
                    let datas = result['data']
                    this.ppxdata = datas.filter(x => (x.AP_liquedate_limit > 0 && x.liquedate_limit > 0))
                    if (this.ppxdata.length > 0) {
                      var answer = window.confirm("Check For Advance");
                      this.shownotify = true
                    } else {
                      this.shownotify = false
                    }
                    if (this.ppxshowapi == true && (this.crnshowapi == true || this.ecftypeid == 3)) {
                      this.getinvoicedtlrecords(results)
                      this.getcreditrecords(results)

                    }
                  } else {
                    this.notification.showError(result.description)
                    return false
                  }
                },
                  error => {
                    this.errorHandler.handleError(error);
                    this.ppxshowapi = true
                    if (this.ppxshowapi == true && (this.crnshowapi == true || this.ecftypeid == 3)) {
                      this.getinvoicedtlrecords(results)
                      this.getcreditrecords(results)

                    }
                    this.SpinnerService.hide();
                  }
                )
              }

              if (jsondatas != undefined) {
                this.ecfservices.ppxadvance(jsondatas).subscribe(result => {
                  this.crnshowapi = true
                  if (result['data'] != undefined) {
                    let datas = result['data']
                    this.crndata = datas.filter(x => (x.AP_liquedate_limit > 0 && x.liquedate_limit > 0))
                    if (this.crndata.length > 0) {
                      var answer = window.confirm("Check For CRN");
                      this.showcrnnotify = true
                    } else {
                      this.showcrnnotify = false
                    }
                    if (this.ppxshowapi == true && (this.crnshowapi == true || this.ecftypeid == 3)) {
                      this.getinvoicedtlrecords(results)
                      this.getcreditrecords(results)

                    }
                  } else {
                    this.notification.showError(result?.description)
                    return false
                  }
                },
                  error => {
                    this.errorHandler.handleError(error);
                    this.crnshowapi = true
                    if (this.ppxshowapi == true && (this.crnshowapi == true || this.ecftypeid == 3)) {
                      this.getinvoicedtlrecords(results)
                      this.getcreditrecords(results)

                    }
                    this.SpinnerService.hide();
                  }
                )
              }


              // this.getinvoicedtlrecords(results)
              // this.getcreditrecords(results)

              if (this.ecftypeid == 7 || this.ecftypeid == 13 || this.ecftypeid == 14) {
                this.getinvoicedtlrecords(results)
                this.getcreditrecords(results)
              }

              if (this.creditlen == 0) {
                if (this.ecftypeid == 7) {
                  this.addCRNcredit()
                  if (results['invoicedtl'].length > 0) {
                    this.crndatas()
                  }
                }
              }

            } else {
              this.getdebitrecords(results)
              this.getcreditrecords(results)

            }

          }
          this.SpinnerService.hide()
        } else {
          this.notification.showError(results?.description)
          this.SpinnerService.hide();
          return false
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }



  hsnindex: any
  getindex(index) {
    this.hsnindex = index
  }

  getinvoicedtlrecords(datas) {
    if (datas?.invoicedtl?.length === 0) {
      const control = <FormArray>this.InvoiceDetailForm.get('invoicedtl');
      control.push(this.INVdetail());

      if ((this.ecftypeid == 2 && this.InvoiceHeaderForm?.value?.invoicegst == 'N') || (this.ecftypeid == 7 && this.InvoiceHeaderForm?.value?.invoicegst == 'N') || (this.ecftypeid == 3) || (this.ecftypeid == 13) || (this.ecftypeid == 14 && this.InvoiceHeaderForm?.value?.invoicegst == 'N')) {
        for (let i = 0; i < 1; i++) {
          this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn').disable()
          this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn_percentage').disable()
          this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('cgst').disable()
          this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('sgst').disable()
          this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('igst').disable()
        }
      }


    }

    for (let details of datas.invoicedtl) {
      let id: FormControl = new FormControl('');
      let dtltotalamt: FormControl = new FormControl('');
      let invoiceheader_id: FormControl = new FormControl('');
      let productname: FormControl = new FormControl('');
      let productcode: FormControl = new FormControl('');
      let invoice_po: FormControl = new FormControl('');
      let description: FormControl = new FormControl('');
      let hsn: FormControl = new FormControl('');
      let hsn_percentage: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl('');
      let quantity: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let cgst: FormControl = new FormControl('');
      let sgst: FormControl = new FormControl('');
      let igst: FormControl = new FormControl('');
      let discount: FormControl = new FormControl('');
      let taxamount: FormControl = new FormControl('');
      let totalamount: FormControl = new FormControl('');
      let roundoffamt: FormControl = new FormControl('');
      let otheramount: FormControl = new FormControl('');
      let supplier_name: FormControl = new FormControl('');
      let pincode: FormControl = new FormControl('');
      let suppliergst: FormControl = new FormControl('');
      let invoiceno: FormControl = new FormControl('');
      let invoicedate: FormControl = new FormControl('');
      const invdetFormArray = this.InvoiceDetailForm.get("invoicedtl") as FormArray;
      id.setValue(details.id)
      dtltotalamt.setValue(this.totalamount)
      invoiceheader_id.setValue(details?.invoiceheader)
      productname.setValue(details?.productname)
      productcode.setValue(details?.productcode)
      invoice_po.setValue(details?.invoice_po)
      description.setValue(details?.description)
      if (details?.hsn?.code === "UNEXPECTED_ERROR") {
        hsn.setValue("")
      } else {
        hsn.setValue(details?.hsn)
      }
      hsn_percentage.setValue(details?.hsn_percentage)
      uom.setValue(details?.uom)
      unitprice.setValue(details?.unitprice)
      quantity.setValue(details?.quantity)
      amount.setValue(details?.amount)
      cgst.setValue(details?.cgst)
      sgst.setValue(details?.sgst)
      igst.setValue(details?.igst)
      discount.setValue(0)
      taxamount.setValue(details?.taxamount)
      totalamount.setValue(details?.totalamount)
      roundoffamt.setValue(details?.roundoffamt)
      otheramount.setValue(details?.otheramount)
      if (this.ecftypeid == 13) {
        supplier_name.setValue(details?.supplier_name)
        pincode.setValue(details?.pincode)
        suppliergst.setValue(details?.suppliergst)
        invoiceno.setValue(details?.invoiceno)
        invoicedate.setValue(details?.invoicedate)
      } else {
        supplier_name.setValue("")
        pincode.setValue("")
        suppliergst.setValue("")
        invoiceno.setValue("")
        invoicedate.setValue("")
      }

      invdetFormArray.push(new FormGroup({
        id: id,
        dtltotalamt: dtltotalamt,
        invoiceheader_id: invoiceheader_id,
        productname: productname,
        productcode: productcode,
        invoice_po: invoice_po,
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
        discount: discount,
        taxamount: taxamount,
        totalamount: totalamount,
        roundoffamt: roundoffamt,
        otheramount: otheramount,
        supplier_name: supplier_name,
        pincode: pincode,
        suppliergst: suppliergst,
        invoiceno: invoiceno,
        invoicedate: invoicedate
      }))

      hsn.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.gethsnscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
                if (value === "") {

                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('hsn_percentage').reset()
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('cgst').reset(0)
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('sgst').reset(0)
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('igst').reset(0)
                  this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('taxamount').reset(0)
                  this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)

                }
              }),

            )

          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.hsnList = datas;
          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
        })

      uom.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.uomscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.uomList = datas;
          this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
        })

      this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)


      unitprice.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      quantity.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      amount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      taxamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )


      totalamount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      roundoffamt.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

      otheramount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        // this.calcTotalM(value)
        this.calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount)
        if (!this.InvoiceDetailForm.valid) {
          return;
        }

        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      }
      )

    }
  }
  selectedaccno: any
  selectederaaccno: any

  getcreditrecords(datas) {

    if (this.ecftypeid != 7) {
      if (datas?.credit?.length == 0) {
        const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
        control.push(this.creditdetails());
        for (let i = 0; i < 1; i++) {
          this.InvoiceDetailForm.get('creditdtl')['controls'][i].get('amount').setValue(this.totalamount)
        }
        this.creditdatasums()
      }
    }
    let paymodedatas = datas?.credit
    for (let i = 0; i < paymodedatas?.length; i++) {
      if (paymodedatas[i]?.paymode_id?.code == 'PM005') {
        this.showaccno[i] = true
        this.getcreditindex = i
        this.selectedaccno = paymodedatas[i]?.creditrefno
        this.paymodeid = paymodedatas[i]?.paymode_id?.id
        this.paymodecode = paymodedatas[i]?.paymode_id?.code
        this.getaccno(paymodedatas[i]?.paymode_id?.id)
      }
      if (paymodedatas[i]?.paymode_id?.code == 'PM001' || paymodedatas[i]?.paymode_id?.code == 'PM004') {
        this.paymodeid = paymodedatas[i]?.paymode_id?.id
        this.showeraacc[i] = true
        this.selectederaaccno = paymodedatas[i]?.creditrefno
        this.paymodeid = paymodedatas[i]?.paymode_id?.id
        this.paymodecode = paymodedatas[i]?.paymode_id?.code
        this.getERA(i, paymodedatas[i]?.paymode_id?.id)
      }
      if (paymodedatas[i]?.paymode_id?.code == 'PM008') {
        this.showaccno[i] = true

      }
    }
    for (let data of datas?.credit) {
      let id: FormControl = new FormControl('');
      let invoiceheader_id: FormControl = new FormControl('');
      let paymode_id: FormControl = new FormControl('');
      let paymode_ids: FormControl = new FormControl('');
      let creditbank_id: FormControl = new FormControl('');
      let suppliertax_id: FormControl = new FormControl('');
      let creditglno: FormControl = new FormControl('');
      let creditrefno: FormControl = new FormControl('');
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
      let paymodetest_id: FormControl = new FormControl('');
      const creditdetailformArray = this.InvoiceDetailForm.get("creditdtl") as FormArray;


      id.setValue(data?.id)
      invoiceheader_id.setValue(data?.invoiceheader)
      paymode_id.setValue(data?.paymode_id)
      paymode_ids.setValue(data?.paymode_id)
      accno.setValue(data?.creditrefno)
      creditbank_id.setValue(data?.creditbank_id)
      suppliertax_id.setValue(data?.suppliertax_id)
      creditglno.setValue(data?.creditglno)
      creditrefno.setValue(data?.creditrefno)
      suppliertaxtype.setValue(data?.suppliertaxtype)
      suppliertaxrate.setValue(data?.suppliertaxrate)
      taxexcempted.setValue(data?.taxexcempted)
      amount.setValue(data?.amount)
      taxableamount.setValue(data?.taxableamount)
      ddtranbranch.setValue(data?.ddtranbranch)
      ddpaybranch.setValue(data?.ddpaybranch)
      category_code.setValue(data?.category_code)
      subcategory_code.setValue(data?.subcategory_code)
      paymodetest_id.setValue(data?.paymode_id)
      if (data?.credit_bank != undefined) {
        for (let i = 0; i < data?.credit_bank['data']?.length; i++) {
          bank.setValue(data?.credit_bank['data'][i]?.bank_id?.name)
          branch.setValue(data?.credit_bank['data'][i]?.branch_id?.name)
          ifsccode.setValue(data?.credit_bank['data'][i]?.branch_id?.ifsccode)
          benificiary.setValue(data?.credit_bank['data'][i]?.beneficiary)
        }
      } else {
        bank.setValue("")
        branch.setValue("")
        ifsccode.setValue("")
        benificiary.setValue("")
      }
      amountchange.setValue("")
      credittotal.setValue(0)

      if (data?.paymode_id?.code == "PM006") {
        creditrefno.setValue(data.creditrefno)
        let advno = data.creditrefno

        for (let j = 0; j < this.ppxdata.length; j++) {
          if (this.ppxdata[j].crno == advno) {
            this.selectedppxdata.push(this.ppxdata[j])
            let n = this.selectedppxdata.length - 1
            this.selectedppxdata[n].liquidate_amt = data.amount
          }
        }
      }



      if (data?.paymode_id?.code == "PM010") {
        creditrefno.setValue(data.creditrefno)
        let crnno = data.creditrefno

        for (let j = 0; j < this.crndata.length; j++) {
          if (this.crndata[j].crno == crnno) {
            this.selectedcrndata.push(this.crndata[j])
            let n = this.selectedcrndata.length - 1
            this.selectedcrndata[n].liquidate_amt = data.amount
          }
        }
      }



      creditdetailformArray.push(new FormGroup({
        invoiceheader_id: invoiceheader_id,
        paymode_id: paymode_id,
        creditbank_id: creditbank_id,
        suppliertax_id: suppliertax_id,
        creditglno: creditglno,
        creditrefno: creditrefno,
        suppliertaxtype: suppliertaxtype,
        suppliertaxrate: suppliertaxrate,
        taxexcempted: taxexcempted,
        amount: amount,
        taxableamount: taxableamount,
        ddtranbranch: ddtranbranch,
        ddpaybranch: ddpaybranch,
        category_code: category_code,
        subcategory_code: subcategory_code,
        id: id,
        bank: bank,
        branch: branch,
        ifsccode: ifsccode,
        benificiary: benificiary,
        amountchange: amountchange,
        credittotal: credittotal,
        accno: accno,
        paymodetest_id: paymodetest_id,
        paymode_ids: paymode_ids
      }))
      this.calcTotalcreditdatas(amount)

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
        debounceTime(20)
      ).subscribe(value => {

        this.amountReduction()
        if (!this.InvoiceDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
      }
      )
    }
    this.getcredit = false
  }

  calcTotalcreditdatas(amount: FormControl) {
    this.creditdatasums()
  }

  // ---------overall submit------

  public displayFnbranch(branchtype?: branchListss): string | undefined {
    return branchtype ? branchtype.name : undefined;
  }
  get branchtype() {
    return this.SubmitoverallForm.get('approver_branch');
  }
  public displayFnbranchrole(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
  }
  public displayFninvbranch(branchtyperole?: branchListss): string | undefined {
    return branchtyperole ? +branchtyperole.code + "-" + branchtyperole.name : undefined;
  }

  public displayFnPmdLoc(pmdloc?: PMDLocationlists): string | undefined {
    return pmdloc ? pmdloc.location : undefined;
  }
  get branchtyperole() {
    return this.ecfheaderForm.get('branch');
  }
  public displayFnplace(placeofsupply?: branchListss): string | undefined {
    return placeofsupply ? +placeofsupply.code + "-" + placeofsupply.name : undefined;
  }
  get placeofsupply() {
    return this.InvoiceHeaderForm.get('place_of_supply');
  }

  posdropdown(poskeyvalue) {
    this.ecfservice.getbranch(poskeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.poslist = datas;
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  branchdropdown(branchkeyvalue) {
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

  branchroleScroll() {
    setTimeout(() => {
      if (
        this.matbranchroleAutocomplete &&
        this.matbranchroleAutocomplete &&
        this.matbranchroleAutocomplete.panel
      ) {
        fromEvent(this.matbranchroleAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchroleAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchroleAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchroleAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchroleAutocomplete.panel.nativeElement.clientHeight;
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
                this.ecfservices.branchgetScroll(this.branchInput.nativeElement.value, this.currentpage + 1)
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

  posScroll() {
    setTimeout(() => {
      if (
        this.matposAutocomplete &&
        this.matposAutocomplete &&
        this.matposAutocomplete.panel
      ) {
        fromEvent(this.matposAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matposAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matposAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matposAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matposAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.poshas_next === true) {
                this.ecfservices.getbranchscroll(this.posInput.nativeElement.value, this.poscurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.poslist.length >= 0) {
                      this.poslist = this.poslist.concat(datas);
                      this.poshas_next = datapagination.has_next;
                      this.poshas_previous = datapagination.has_previous;
                      this.poscurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  branchinvScroll() {
    setTimeout(() => {
      if (
        this.branchAutocomplete &&
        this.branchAutocomplete &&
        this.branchAutocomplete.panel
      ) {
        fromEvent(this.branchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.branchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.branchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.branchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.branchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservices.getbranchscroll(this.invbranchInput.nativeElement.value, this.currentpage + 1)
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

  branchtest(datas) {
    let gstnos: any
    let gstnoo: any

    let gstno = datas?.gstin
    if (gstno != null && gstno != 'NA' && gstno != undefined && gstno != '' && gstno != "") {
      gstnos = gstno.slice(0, 2);
      gstnoo = JSON.parse(gstnos)
    }


    if (typeof (gstnoo) != 'number' || gstno == null || gstno == 'NA' || gstno == undefined || gstno == '' || gstno == "") {
      this.notification.showInfo("This Branch doesn't have GST No.So you cannot proceed furthur.Please Choose some other branch");
      this.ecfheaderForm.controls['branch'].reset("")
      this.disableecfsave = true;
      return false;
    } else {
      this.disableecfsave = false;
    }
  }

  pmdLocatonScroll() {
    setTimeout(() => {
      if (
        this.pmdlocationAutocomplete &&
        this.pmdlocationAutocomplete &&
        this.pmdlocationAutocomplete.panel
      ) {
        fromEvent(this.pmdlocationAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.pmdlocationAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.pmdlocationAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.pmdlocationAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.pmdlocationAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservices.getPMDLocation(this.PMDbranchdata[0].id, this.pmdlocationInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.PMDLocationlist.length >= 0) {
                      this.PMDLocationlist = this.PMDLocationlist.concat(datas);
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


  public displayFnapprover(approvertype?: approverListss): string | undefined {
    return approvertype ? approvertype.name + ' - ' + approvertype.code + ' - ' + approvertype.limit + ' - ' + approvertype.designation : undefined;

  }

  public displayFnapproveredit(approvertype?: approverListss): string | undefined {
    return approvertype ? approvertype.name : undefined;
  }

  get approvertype() {
    return this.SubmitoverallForm.get('approvedby_id');
  }
  approvid: any
  approverid(data) {
    this.approvid = data?.employee_id?.id
  }


  approverdropdown(approverkeyvalue) {
    if (this.ismultilevel == true) {
      this.ecfservices.getdelmatapprover(this.commodityid, this.createdbyid, approverkeyvalue)
        .subscribe((results: any[]) => {
          if (results) {
            let datas = results["data"];
            if (datas?.length == 0) {
              this.notification.showInfo("No Records Found")
            } else {
              this.Approverlist = datas;
            }
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )
    } else {
      this.ecfservices.getapprover(this.commodityid, this.createdbyid, approverkeyvalue)
        .subscribe((results: any[]) => {
          if (results) {
            let datas = results["data"];
            if (datas?.length == 0) {
              this.notification.showInfo("No Records Found")
            } else {
              this.Approverlist = datas;
            }
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )
    }

  }

  // approverScroll() {
  //   if (this.ismultilevel == true) {
  //     setTimeout(() => {
  //       if (
  //         this.matappAutocomplete &&
  //         this.matappAutocomplete &&
  //         this.matappAutocomplete.panel
  //       ) {
  //         fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
  //           .pipe(
  //             map(x => this.matappAutocomplete.panel.nativeElement.scrollTop),
  //             takeUntil(this.autocompleteTrigger.panelClosingActions)
  //           )
  //           .subscribe(x => {
  //             const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
  //             const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
  //             const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
  //             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //             if (atBottom) {
  //               if (this.has_next === true) {
  //                 this.ecfservices.getdelmatapproverscroll(this.currentpage + 1, this.commodityid, this.createdbyid, this.approverInput.nativeElement.value)
  //                   .subscribe((results: any[]) => {
  //                     let datas = results["data"];
  //                     let datapagination = results["pagination"];
  //                     if (this.Approverlist.length >= 0) {
  //                       this.Approverlist = this.Approverlist.concat(datas);
  //                       this.has_next = datapagination.has_next;
  //                       this.has_previous = datapagination.has_previous;
  //                       this.currentpage = datapagination.index;
  //                     }
  //                   })
  //               }
  //             }
  //           });
  //       }
  //     });
  //   } else {
  //     setTimeout(() => {
  //       if (
  //         this.matappAutocomplete &&
  //         this.matappAutocomplete &&
  //         this.matappAutocomplete.panel
  //       ) {
  //         fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
  //           .pipe(
  //             map(x => this.matappAutocomplete.panel.nativeElement.scrollTop),
  //             takeUntil(this.autocompleteTrigger.panelClosingActions)
  //           )
  //           .subscribe(x => {
  //             const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
  //             const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
  //             const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
  //             const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //             if (atBottom) {
  //               if (this.has_next === true) {
  //                 this.ecfservices.getECFapproverscroll(this.currentpage + 1, this.commodityid, this.createdbyid, this.approverInput.nativeElement.value)
  //                   .subscribe((results: any[]) => {
  //                     let datas = results["data"];
  //                     let datapagination = results["pagination"];
  //                     if (this.Approverlist.length >= 0) {
  //                       this.Approverlist = this.Approverlist.concat(datas);
  //                       this.has_next = datapagination.has_next;
  //                       this.has_previous = datapagination.has_previous;
  //                       this.currentpage = datapagination.index;
  //                     }
  //                   })
  //               }
  //             }
  //           });
  //       }
  //     });
  //   }
  // }

  fileChange(event, ind) {
    let imagesList = [];
    for (var i = 0; i < event?.target?.files?.length; i++) {
      this.images.push(event?.target?.files[i]);
    }
    this.InputVar.nativeElement.value = '';
    imagesList.push(this.images);
    this.uploadList = [];
    imagesList.forEach((item) => {
      let s = item;
      s.forEach((it) => {
        let io = it.name;
        this.uploadList.push(io);
      });
    });
  }

  deleteUpload(s, index) {
    this.uploadList.forEach((s, i) => {
      if (index === i) {
        this.uploadList.splice(index, 1)
        this.images.splice(index, 1);
      }
    })
  }
  ecffid: any
  OverallFormSubmit() {
    this.SpinnerService.show()
    const data = this.SubmitoverallForm?.value
    if (Number(this.sum) > Number(this.ecftotalamount) || Number(this.sum) < Number(this.ecftotalamount)) {
      this.toastr.error('Check ECF Header Amount', 'Please Enter Valid Amount');
      return false;
    }
    if (data?.approvedby_id === "" || data?.approvedby_id === null) {
      this.toastr.warning('', 'Please Choose Approver ', { timeOut: 1500 });
      this.SpinnerService.hide()
      return false;
    }
    if (data?.approver_branch != null && data?.approver_branch != "" && data?.approver_branch != undefined) {
      data.approver_branch = data?.approver_branch?.id
    } else {
      data.approver_branch = ""
    }
    if (this.ecfheaderidd === "") {
      this.ecffid = this.ecfheaderid
    } else {
      this.ecffid = this.ecfheaderidd
    }
    this.ECFData = {
      "id": this.ecffid,
      "approvedby_id": data?.approvedby_id?.id,
      "ecftype": this.ecftypeid,
      "tds": 0,
      "approver_branch": data?.approver_branch
    }
    this.ecfservice.OverallSubmit(this.ECFData)
      .subscribe(result => {
        if (result?.status == 'success') {
          this.notification.showSuccess("Successfully ECF Created!...")
          this.SpinnerService.hide()
          this.onSubmit.emit()
          this.submitoverallbtn = true
        } else {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  // ---------Invoice Details--------
  indexvalueOninvdetails(index) {
    this.indexDet = index
  }
  getinvdtlSections(forms) {
    return forms.controls.invoicedtl.controls;
  }

  addinvdtlSection() {
    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtl');
    control.push(this.INVdetail());
    if (this.ecftypeid == 7) {
      this.addCRNcredit()
    }


    if (this.getgstapplicable === "N") {
      for (let i = 0; i < 30; i++) {
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('hsn_percentage').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('igst').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('cgst').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('sgst').disable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][i].get('taxamount').disable()
      }
    }
  }

  removeinvdtlSection(i) {
    const control = <FormArray>this.InvoiceDetailForm.get('invoicedtl');
    control.removeAt(i);
    this.INVdatasums()
  }

  ppxdetail() {
    let group = new FormGroup({
      apppxheader_id: new FormControl(),
      apinvoiceheader_id: new FormControl(),
      apcredit_id: new FormControl(),
      ppxdetails_amount: new FormControl(),
      ppxdetails_adjusted: new FormControl(),
      ppxdetails_balance: new FormControl(),
      ecf_amount: new FormControl(),
      ecfheader_id: new FormControl(),
      process_amount: new FormControl(),
    })
    return group
  }


  INVdetail() {

    let group = new FormGroup({
      id: new FormControl(),
      dtltotalamt: new FormControl(0),
      invoiceheader_id: new FormControl(),
      productname: new FormControl(''),
      productcode: new FormControl('PRD103'),
      invoice_po: new FormControl(''),
      description: new FormControl(''),
      hsn: new FormControl(''),
      hsn_percentage: new FormControl(''),
      uom: new FormControl(''),
      unitprice: new FormControl(''),
      quantity: new FormControl(''),
      amount: new FormControl(0),
      cgst: new FormControl(0),
      sgst: new FormControl(0),
      igst: new FormControl(0),
      discount: new FormControl(0),
      taxamount: new FormControl(0),
      totalamount: new FormControl(0),
      roundoffamt: new FormControl(0),
      otheramount: new FormControl(0),
      invoiceno: new FormControl(""),
      invoicedate: new FormControl(""),
      supplier_name: new FormControl(""),
      suppliergst: new FormControl(""),
      pincode: new FormControl(0),


    })
    group.get('hsn').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.ecfservice.gethsnscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
              if (value === "" || value.id === undefined) {
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('hsn_percentage').reset()
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('cgst').reset(0)
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('sgst').reset(0)
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('igst').reset(0)
                this.InvoiceDetailForm.get('invoicedtl')['controls'][this.hsnindex].get('taxamount').reset(0)
                this.calcTotalM(group);

              }
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.hsnList = datas;
        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      })


    group.get('uom').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.uomscroll(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.uomList = datas;
        this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
      })


    group.get('unitprice').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      // this.datasums()
      if (!this.InvoiceDetailForm.valid) {
        return;
      }

      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
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
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('sgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('cgst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('igst').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
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
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
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
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('roundoffamt').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )

    group.get('otheramount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      // console.log("should be called first")
      this.calcTotalM(group)
      if (!this.InvoiceDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.InvoiceDetailForm.value['invoicedtl']);
    }
    )
    return group
  }

  public displayFnuom(uomtype?: uomlistss): string | undefined {
    return uomtype ? uomtype.name : undefined;
  }

  get uomtype() {
    return this.InvoiceDetailForm.get('uom');
  }

  getuom(uomkeyvalue) {
    this.ecfservice.getuom(uomkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.uomList = datas;
        }

      },

        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }

  uomScroll() {
    setTimeout(() => {
      if (
        this.matuomAutocomplete &&
        this.matuomAutocomplete &&
        this.matuomAutocomplete.panel
      ) {
        fromEvent(this.matuomAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matuomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matuomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matuomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matuomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.uomscroll(this.uomInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.uomList.length >= 0) {
                      this.uomList = this.uomList.concat(datas);
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



  public displayFnhsn(hsntype?: hsnlistss): string | undefined {
    return hsntype ? hsntype.code : undefined;
  }

  get hsntype() {
    return this.InvoiceDetailForm.get('hsn');
  }
  hsnpercent: any
  hsncode: any
  gethsn(hsnkeyvalue) {
    this.ecfservice.gethsn(hsnkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.hsnList = datas;
        }

      },

        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )
  }
  gethsncode(igstrate, code, ind) {
    this.hsnpercent = igstrate
    this.hsncode = code
    this.InvoiceDetailForm.get('invoicedtl')['controls'][ind].get('hsn_percentage').setValue(this.hsnpercent)
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
                this.ecfservice.gethsnscroll(this.hsnInput.nativeElement.value, this.currentpage + 1)
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
  changeindex: any
  getgst(data, index) {

    this.changeindex = index
    if ((this.getgstapplicable === "Y") && (this.ecftypeid == 2 || this.ecftypeid == 7 || this.ecftypeid == 14 || this.ecftypeid == 13)) {
      let overalloffIND = this.InvoiceDetailForm?.value?.invoicedtl;
      this.hsncodess = overalloffIND[index]?.hsn?.code;
      let unit = overalloffIND[index]?.unitprice
      let units = Number(unit)
      let qtyy = overalloffIND[index]?.quantity
      if (qtyy === null || qtyy === undefined) {
        qtyy = 0
      }
      if ((this.hsncodess === "" || this.hsncodess === undefined || this.hsncodess === null)
        || (qtyy === "" || qtyy === undefined || qtyy === null)
        || (unit === "" || unit === undefined || unit === null)) {
        return false
      }
      if ((this.hsncodess !== "" || this.hsncodess !== undefined || this.hsncodess !== null)
        || (qtyy !== "" || qtyy !== undefined || qtyy !== null)
        || (unit !== "" || unit !== undefined || unit !== null)) {
        //   let json : any
        //   if(this.ecftypeid == 13){
        //   json = {
        //     "code": this.hsncodess,
        //     "unitprice": units,
        //     "qty": qtyy,
        //     "discount": 0,
        //     "type": this.pettycashgsttype
        //   }
        // }else{
        let json = {
          "code": this.hsncodess,
          "unitprice": units,
          "qty": qtyy,
          "discount": 0,
          "type": this.type
        }
        // }
        this.ecfservice.GSTcalculation(json)
          .subscribe(result => {
            this.igstrate = result?.igst
            this.sgstrate = result?.sgst
            this.cgstrate = result?.cgst
            this.totaltax = this.igstrate + this.sgstrate + this.cgstrate
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('sgst').setValue(this.sgstrate)
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('cgst').setValue(this.cgstrate)
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('igst').setValue(this.igstrate)
            this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('taxamount').setValue(this.totaltax)


          })

      }
    }
  }
  calcTotalM(group: FormGroup) {
    const Unitprice = +group.controls['unitprice'].value;
    const quantity = +group.controls['quantity'].value;
    const roundoff = +group.controls['roundoffamt'].value;
    const otheramt = +group.controls['otheramount'].value;
    let qty = Number(quantity)
    let unitprices = Number(Unitprice)
    let roundoffs = Number(roundoff)
    let otheramounts = Number(otheramt)
    this.totaltaxable = qty * unitprices
    group.controls['amount'].setValue((this.totaltaxable).toFixed(2), { emitEvent: false });
    let taxamount = +group.controls['taxamount'].value;
    let taxes = Number(taxamount)
    this.overalltotal = (this.totaltaxable + taxes).toFixed(2)
    group.controls['totalamount'].setValue((this.overalltotal), { emitEvent: false });
    this.INVdatasums();
  }

  calcTotaldtl(unitprice, quantity, amount, taxamount, totalamount, roundoffamt, otheramount: FormControl) {
    const Quantity = Number(quantity.value)
    const unitsprice = Number(unitprice.value)
    const taxAmount = Number(taxamount.value)
    const roundoff = Number(roundoffamt.value)
    const otheramounts = Number(otheramount.value)
    this.totaltaxable = Quantity * unitsprice
    amount.setValue((this.totaltaxable).toFixed(2), { emitEvent: false });
    this.overalltotal = (this.totaltaxable + taxAmount).toFixed(2)
    totalamount.setValue((this.overalltotal), { emitEvent: false });
    this.INVdatasums();
  }
  Roundoffamount: any
  OtherAdjustmentamt: any
  INVdatasums() {
    this.INVamt = this.InvoiceDetailForm.value['invoicedtl'].map(x => Number((x.totalamount)));
    this.Roundoffsamount = this.InvoiceDetailForm?.value?.roundoffamt
    this.OtherAdjustmentamts = this.InvoiceDetailForm?.value?.otheramount
    let INVsum = (this.INVamt.reduce((a, b) => a + b, 0));
    this.INVsum = (INVsum + Number(this.Roundoffsamount) + Number(this.OtherAdjustmentamts)).toFixed(2)
  }
  submitinvoicedtl() {
    let invdtlresult: boolean;
    this.SpinnerService.show()
    const invdetaildata = this.InvoiceDetailForm?.value?.invoicedtl
    let amt = this.InvoiceDetailForm.value['invoicedtl'].map(x => x.amount);
    let amtcheck = amt.reduce((a, b) => a + b, 0);

    if (this.INVsum > this.totalamount || this.INVsum < this.totalamount) {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      this.SpinnerService.hide()
      return false
    }


    for (let i in invdetaildata) {
      if ((invdetaildata[i]?.productname == '') || (invdetaildata[i]?.productname == null) || (invdetaildata[i]?.productname == undefined)) {
        this.toastr.error('Please Enter Item');
        this.SpinnerService.hide()
        return false;
      }
      if ((this.ecftypeid == 2 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y') || (this.ecftypeid == 7 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y')) {
        if ((invdetaildata[i]?.hsn == '') || (invdetaildata[i]?.hsn == null) || (invdetaildata[i]?.hsn == undefined)) {
          this.toastr.error('Please Choose Hsn Code');
          this.SpinnerService.hide()
          return false;
        }
      }

      if ((invdetaildata[i]?.uom == '') || (invdetaildata[i]?.uom == null) || (invdetaildata[i]?.uom == undefined)) {
        this.toastr.error('Please Choose UOM');
        this.SpinnerService.hide()
        return false;
      }
      if ((invdetaildata[i]?.unitprice == '') || (invdetaildata[i]?.unitprice == null) || (invdetaildata[i]?.unitprice == undefined)) {
        this.toastr.error('Please Enter Unit Price');
        this.SpinnerService.hide()
        return false;
      }
      if ((invdetaildata[i]?.quantity == '') || (invdetaildata[i]?.quantity == null) || (invdetaildata[i]?.quantity == undefined)) {
        this.toastr.error('Please Enter Quantity');
        this.SpinnerService.hide()
        return false;
      }
      if (invdetaildata[i]?.id === "" || invdetaildata[i]?.id === null) {
        delete invdetaildata[i].id
      }
      if (this.ecftypeid == 3) {
        let data = this.SupplierDetailForm?.value
        invdetaildata[i].dtltotalamt = this.invheadertotamount
        invdetaildata[i].hsn = "NOHSN-0.0"
        invdetaildata[i].hsn_percentage = 0
        invdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
        invdetaildata[i].productcode = "PRD103"
        if (invdetaildata[i].uom === null) {
          invdetaildata[i].uom = ""
        } else if (typeof (invdetaildata[i]?.uom) == "object") {
          invdetaildata[i].uom = invdetaildata[i]?.uom?.name
        } else {
          invdetaildata[i].uom = invdetaildata[i]?.uom
        }
        invdetaildata[i].discount = 0
        invdetaildata[i].invoice_po = ""
        if (this.InvoiceDetailForm?.value?.roundoffamt != null) {
          invdetaildata[i].roundoffamt = this.InvoiceDetailForm?.value?.roundoffamt
        } else {
          invdetaildata[i].roundoffamt = 0
        }
        if (this.InvoiceDetailForm?.value?.otheramount != null) {
          invdetaildata[i].otheramount = this.InvoiceDetailForm?.value?.otheramount
        } else {
          invdetaildata[i].otheramount = 0
        }
        invdetaildata[i].igst = 0
        invdetaildata[i].cgst = 0
        invdetaildata[i].sgst = 0
        invdetaildata[i].taxamount = 0
        delete invdetaildata[i].invoiceno
        delete invdetaildata[i].supplier_name
        delete invdetaildata[i].pincode
        delete invdetaildata[i].suppliergst
        delete invdetaildata[i].invoicedate
      }
      if (this.ecftypeid == 13) {
        invdetaildata[i].dtltotalamt = this.invheadertotamount
        if (typeof (invdetaildata[i]?.hsn) == 'object') {
          invdetaildata[i].hsn = invdetaildata[i]?.hsn?.code
        } else if (invdetaildata[i]?.hsn == null) {
          invdetaildata[i].hsn = "NOHSN-0.0"
        }
        if (invdetaildata[i]?.hsn_percentage == null) {
          invdetaildata[i].hsn_percentage = 0
        } else {
          invdetaildata[i].hsn_percentage = invdetaildata[i]?.hsn_percentage
        }
        invdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
        invdetaildata[i].productcode = "PRD103"
        if (invdetaildata[i].uom === null) {
          invdetaildata[i].uom = ""
        } else if (typeof (invdetaildata[i]?.uom) == "object") {
          invdetaildata[i].uom = invdetaildata[i]?.uom?.name
        } else {
          invdetaildata[i].uom = invdetaildata[i]?.uom
        }
        invdetaildata[i].discount = 0
        invdetaildata[i].invoice_po = ""
        if (this.InvoiceDetailForm?.value?.roundoffamt != null) {
          invdetaildata[i].roundoffamt = this.InvoiceDetailForm?.value?.roundoffamt
        } else {
          invdetaildata[i].roundoffamt = 0
        }
        if (this.InvoiceDetailForm?.value?.otheramount != null) {
          invdetaildata[i].otheramount = this.InvoiceDetailForm?.value?.otheramount
        } else {
          invdetaildata[i].otheramount = 0
        }
        if (invdetaildata[i].igst == null) {
          invdetaildata[i].igst = 0
        }
        if (invdetaildata[i].cgst == null) {
          invdetaildata[i].cgst = 0
        }
        if (invdetaildata[i].sgst == null) {
          invdetaildata[i].sgst = 0
        }
        if (invdetaildata[i].taxamount == null) {
          invdetaildata[i].taxamount = 0
        }
        invdetaildata[i].invoiceno = invdetaildata[i]?.invoiceno
        invdetaildata[i].supplier_name = invdetaildata[i]?.supplier_name
        invdetaildata[i].pincode = invdetaildata[i]?.pincode
        invdetaildata[i].suppliergst = invdetaildata[i]?.suppliergst
        invdetaildata[i].invoicedate = this.datePipe.transform(invdetaildata[i]?.invoicedate, 'yyyy-MM-dd');

        // delete invdetaildata[i]?.invoiceno
        // delete invdetaildata[i]?.supplier_name
        // delete invdetaildata[i]?.pincode
        // delete invdetaildata[i]?.suppliergst
        // delete invdetaildata[i]?.invoicedate




      }

      if ((this.getgstapplicable === 'Y' && this.ecftypeid == 2) || (this.getgstapplicable === 'Y' && this.ecftypeid == 7) || (this.getgstapplicable === 'Y' && this.ecftypeid == 14)) {
        invdetaildata[i].dtltotalamt = this.invheadertotamount
        invdetaildata[i].hsn = invdetaildata[i]?.hsn?.code
        invdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
        invdetaildata[i].productcode = "PRD103"
        if (invdetaildata[i].uom === null) {
          invdetaildata[i].uom = ""
        } else if (typeof (invdetaildata[i]?.uom) == "object") {
          invdetaildata[i].uom = invdetaildata[i]?.uom?.name
        } else {
          invdetaildata[i].uom = invdetaildata[i]?.uom
        }
        invdetaildata[i].discount = 0
        invdetaildata[i].invoice_po = ""
        if (this.InvoiceDetailForm?.value?.roundoffamt != null) {
          invdetaildata[i].roundoffamt = this.InvoiceDetailForm?.value?.roundoffamt
        } else {
          invdetaildata[i].roundoffamt = 0
        }
        if (this.InvoiceDetailForm?.value?.otheramount != null) {
          invdetaildata[i].otheramount = this.InvoiceDetailForm?.value?.otheramount
        } else {
          invdetaildata[i].otheramount = 0
        }
        delete invdetaildata[i]?.invoiceno
        delete invdetaildata[i]?.supplier_name
        delete invdetaildata[i]?.pincode
        delete invdetaildata[i]?.suppliergst
        delete invdetaildata[i]?.invoicedate


      }
      if ((this.getgstapplicable === 'N' && this.ecftypeid == 2) || (this.getgstapplicable === 'N' && this.ecftypeid == 7) || (this.getgstapplicable === 'N' && this.ecftypeid == 14)) {
        invdetaildata[i].dtltotalamt = this.invheadertotamount
        invdetaildata[i].hsn = "NOHSN-0.0"
        invdetaildata[i].hsn_percentage = 0
        invdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
        invdetaildata[i].productcode = "PRD103"
        if (invdetaildata[i].uom === null) {
          invdetaildata[i].uom = ""
        } else if (typeof (invdetaildata[i]?.uom) == "object") {
          invdetaildata[i].uom = invdetaildata[i]?.uom?.name
        } else {
          invdetaildata[i].uom = invdetaildata[i]?.uom
        }
        invdetaildata[i].discount = 0
        invdetaildata[i].invoice_po = ""
        if (this.InvoiceDetailForm?.value?.roundoffamt != null) {
          invdetaildata[i].roundoffamt = this.InvoiceDetailForm?.value?.roundoffamt
        } else {
          invdetaildata[i].roundoffamt = 0
        }
        if (this.InvoiceDetailForm?.value?.otheramount != null) {
          invdetaildata[i].otheramount = this.InvoiceDetailForm?.value?.otheramount
        } else {
          invdetaildata[i].otheramount = 0
        }
        invdetaildata[i].igst = 0
        invdetaildata[i].cgst = 0
        invdetaildata[i].sgst = 0
        invdetaildata[i].taxamount = 0
        delete invdetaildata[i].invoiceno
        delete invdetaildata[i].supplier_name
        delete invdetaildata[i].pincode
        delete invdetaildata[i].suppliergst
        delete invdetaildata[i].invoicedate

      }
    }
    let headervalue = this.InvoiceHeaderForm?.value?.invoiceheader
    for (let invhdrindex in headervalue) {
      if (headervalue[invhdrindex]?.id === this.invoiceheaderaddonid) {
        headervalue[invhdrindex].roundoffamt = this.InvoiceDetailForm?.value?.roundoffamt
        headervalue[invhdrindex].otheramount = this.InvoiceDetailForm?.value?.otheramount
      }
    }



    if (this.ecfstatusid === 2) {
      this.ecfservice.createinvdtlmodification(this.InvoiceDetailForm?.value?.invoicedtl)
        .subscribe(result => {
          let invdtlsresults = result['invoicedetails']
          for (let i in invdtlsresults) {
            if (invdtlsresults[i]?.id == undefined) {
              invdtlresult = false
              this.notification.showError(invdtlsresults[i]?.description)
              this.SpinnerService.hide()
              return false
            } else {
              invdtlresult = true
            }
          }
          if (invdtlresult == true) {
            this.notification.showSuccess("Successfully Invoice Detail Saved")
            this.SpinnerService.hide()
            this.invdtlsave = true
            this.readinvdata = true
            this.showdebitpopup = true
            this.showadddebit = true
            this.showadddebits = false
            this.invoicedetailsdata = result?.invoicedetails
            let data = this.InvoiceDetailForm?.value?.invoicedtl
            for (let i in data) {
              data[i].id = result?.invoicedetails[i]?.id
            }
            this.ccbspercentage = 100
            this.ccbspercentages = 100
            if (this.ecftypeid == 7) {
              this.crndatas()
            }
            return true
          }
        })

    } else {
      this.ecfservice.invoicedetailcreate(this.InvoiceDetailForm?.value?.invoicedtl)
        .subscribe(result => {
          let invdtlsresults = result['invoicedetails']
          for (let i in invdtlsresults) {
            if (invdtlsresults[i]?.id == undefined) {
              invdtlresult = false
              this.notification.showError(invdtlsresults[i]?.description)
              this.SpinnerService.hide()
              return false
            } else {
              invdtlresult = true
            }
          }
          if (invdtlresult == true) {
            let res = result?.invoicedetails
            this.notification.showSuccess("Successfully Invoice Detail Saved")
            this.SpinnerService.hide()
            this.invdtlsave = true
            this.readinvdata = true
            this.showdebitpopup = true
            this.showadddebit = true
            this.showadddebits = false
            this.AdddebitDetails = false
            this.invoicedetailsdata = result?.invoicedetails
            let data = this.InvoiceDetailForm?.value?.invoicedtl
            for (let i in data) {
              data[i].id = result?.invoicedetails[i]?.id
            }
            this.ccbspercentage = 100
            this.ccbspercentages = 100
            if (this.ecftypeid == 7) {
              this.crndatas()
            }
            return true
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )
    }
  }



  addCRNcredit() {

    let count: any
    if (this.type == "SGST & CGST" && this.getgstapplicable == "Y") {
      count = this.InvoiceDetailForm.value.invoicedtl.length * 3

      let indices = this.InvoiceDetailForm.value.creditdtl.length
      for (let i = indices; i < count; i++) {
        this.addcreditSection()

      }
    } else if (this.type == "IGST" && this.getgstapplicable == "Y") {
      count = this.InvoiceDetailForm.value.invoicedtl.length * 2
      let indices = this.InvoiceDetailForm.value.creditdtl.length
      for (let i = indices; i < count; i++) {
        this.addcreditSection()
      }
    } else if (this.getgstapplicable == "N") {
      count = this.InvoiceDetailForm.value.invoicedtl.length

      this.addcreditSection()

    }


  }

  crndatas() {
    // ---CGST & SGST ---
    let array1 = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30];
    let array2 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31];
    let array3 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32];
    //  -----
    // ----IGST ---
    let array4 = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
    let array5 = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]

    //NON GST
    let array6 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

    let count: any
    // let catdata = { "code": "GST", "id": 73, "name": "GST" }
    // let igstdata = { "code": "I-Payable", "id": 244, "glno": 151512, "name": "IGST-Payable" }
    // let cgstdata = { "code": "C-Payable", "id": 243, "glno": 151513, "name": "CGST-Payable" }
    // let sgstdata = { "code": "S-Payable", "id": 242, "glno": 151514, "name": "SGST-Payable" }
    let creditgl = this.paymodelists?.filter(payid => payid.code == 'PM002')

    // console.log(creditgl)
    if (this.type == "SGST & CGST" && this.getgstapplicable == "Y") {
      count = this.InvoiceDetailForm.value.invoicedtl.length * 3
      for (let i = 0; i < this.InvoiceDetailForm.value.invoicedtl.length; i++) {

        for (let j = i * 3; j < count; j++) {

          if (array1.includes(j)) {

            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].amount)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amountchange').setValue(this.InvoiceDetailForm?.value?.roundoffamt)

          } else if (array2.includes(j)) {
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymode_id').setValue(creditgl[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymode_ids').setValue(creditgl[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymodetest_id').setValue(creditgl[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].cgst)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('creditrefno').setValue("CGST-" + this.InvoiceDetailForm.value.invoicedtl[i].hsn_percentage + "%")
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('creditglno').setValue(this.cgstdata[0]?.glno)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('category_code').setValue(this.gstcat)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('subcategory_code').setValue(this.cgstdata[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymodetest_id').disable();

          } else if (array3.includes(j)) {
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymode_id').setValue(creditgl[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymode_ids').setValue(creditgl[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymodetest_id').setValue(creditgl[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].sgst)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('creditrefno').setValue("SGST-" + this.InvoiceDetailForm.value.invoicedtl[i].hsn_percentage + "%")
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('creditglno').setValue(this.sgstdata[0]?.glno)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('category_code').setValue(this.gstcat)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('subcategory_code').setValue(this.sgstdata[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymodetest_id').disable();

          }
        }
      }
    } else if (this.type == "IGST" && this.getgstapplicable == "Y") {
      count = this.InvoiceDetailForm.value.invoicedtl.length * 2
      for (let i = 0; i < this.InvoiceDetailForm.value.invoicedtl.length; i++) {
        for (let j = i * 2; j < count; j++) {
          if (array4.includes(j)) {
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].amount)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amountchange').setValue(this.InvoiceDetailForm?.value?.roundoffamt)
          } else if (array5.includes(j)) {
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymode_id').setValue(creditgl[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymodetest_id').setValue(creditgl[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymode_ids').setValue(creditgl[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].igst)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('creditrefno').setValue("IGST-" + this.InvoiceDetailForm.value.invoicedtl[i].hsn_percentage + "%")
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('creditglno').setValue(this.igstdata[0]?.glno)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('category_code').setValue(this.gstcat)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('subcategory_code').setValue(this.igstdata[0])
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('paymodetest_id').disable();

          }
        }
      }
    } else if (this.getgstapplicable == "N") {
      count = this.InvoiceDetailForm.value.invoicedtl.length
      for (let i = 0; i < this.InvoiceDetailForm.value.invoicedtl.length; i++) {
        for (let j = i * 1; j < count; j++) {
          if (array6.includes(j)) {
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amount').setValue(this.InvoiceDetailForm.value.invoicedtl[i].amount)
            this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('amountchange').setValue(this.InvoiceDetailForm?.value?.roundoffamt)
          }
        }
      }
    }
    this.creditdatasums()

  }

  deleteinvdetail(section, ind) {
    let id = section.value.id
    if (id != undefined) {
      this.delinvdtlid = id
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        this.SpinnerService.show()
        this.ecfservice.invdtldelete(this.delinvdtlid)
          .subscribe(result => {
            this.SpinnerService.hide()
            if (result?.status == "success") {
              this.notification.showSuccess("Deleted Successfully")
              this.removeinvdtlSection(ind)
              if (this.ecftypeid == 7) {
                if (this.type == "SGST & CGST" && this.getgstapplicable == "Y") {

                  let len_d: any = this.InvoiceDetailForm.value.creditdtl.length - 1;
                  let cdtdatas: any = this.InvoiceDetailForm.value.creditdtl
                  for (let i = len_d - 2; i <= len_d; i++) {

                    (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(i);

                    if (cdtdatas[i]?.id != null) {
                      this.ecfservice.creditdelete(cdtdatas[i]?.id)
                        .subscribe(result => {
                          let data = result
                        })
                    }
                  }
                  let cdt_len = (this.InvoiceDetailForm.value.creditdtl.length - 1);
                  (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(cdt_len);
                }
                if (this.type == "IGST" && this.getgstapplicable == "Y") {


                  let len_d: any = this.InvoiceDetailForm.value.creditdtl.length - 1;
                  let cdtdatas: any = this.InvoiceDetailForm.value.creditdtl
                  for (let i = len_d - 1; i <= len_d; i++) {
                    (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(i);
                    if (cdtdatas[i]?.id != null) {
                      this.ecfservice.creditdelete(cdtdatas[i].id)
                        .subscribe(result => {
                          let data = result
                        })
                    }


                  }
                  let cdt_len = (this.InvoiceDetailForm.value.creditdtl.length - 1);
                  (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(cdt_len);
                }
                if (this.getgstapplicable == "N") {

                  let len_d: any = this.InvoiceDetailForm.value.creditdtl.length;
                  let cdtdatas: any = this.InvoiceDetailForm.value.creditdtl
                  for (let i = len_d; i <= len_d; i++) {
                    (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(i);
                    if (cdtdatas[i]?.id != null) {
                      this.ecfservice.creditdelete(cdtdatas[i].id)
                        .subscribe(result => {
                          let data = result
                        })
                    }
                  }
                  let cdt_len = (this.InvoiceDetailForm.value.creditdtl.length - 1);
                  (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(cdt_len);
                }
              }

              if (this.InvoiceDetailForm?.value?.invoicedtl?.length === 0) {
                this.addinvdtlSection()
              }
            } else {
              this.notification.showError(result?.description)
              return false
            }

          }, error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
      }
      else {
        return false;
      }
    } else {
      this.removeinvdtlSection(ind)
      if (this.ecftypeid == 7) {
        if (this.type == "SGST & CGST" && this.getgstapplicable == "Y") {


          let len_d: any = this.InvoiceDetailForm.value.creditdtl.length - 1;
          for (let i = len_d - 2; i <= len_d; i++) {
            (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(i);
          }
          let cdt_len = (this.InvoiceDetailForm.value.creditdtl.length - 1);
          (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(cdt_len);


        }
        if (this.type == "IGST" && this.getgstapplicable == "Y") {
          let len_d: any = this.InvoiceDetailForm.value.creditdtl.length - 1;
          for (let i = len_d - 1; i <= len_d; i++) {
            (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(i);
          }
          let cdt_len = (this.InvoiceDetailForm.value.creditdtl.length - 1);
          (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(cdt_len);
        }
        if (this.getgstapplicable == "N") {
          let len_d: any = this.InvoiceDetailForm.value.creditdtl.length;
          for (let i = len_d; i <= len_d; i++) {
            (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(i);
          }
          let cdt_len = (this.InvoiceDetailForm.value.creditdtl.length - 1);
          (this.InvoiceDetailForm.get('creditdtl') as FormArray).removeAt(cdt_len);
        }
      }
      if (this.InvoiceDetailForm?.value?.invoicedtl?.length === 0) {
        this.addinvdtlSection()
      }
    }

  }



  invdtladdonid: any
  invdtltaxableamount: number
  invdtltotamount: any
  invdtloverallamount: any
  invdtltaxamount: number
  cgstval: any
  sgstval: any
  igstval: any
  gettaxrate: any

  adddebits(section, data, index) {
    let invdtldatas = this.getinvoiceheaderresults['invoicedtl']

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
    else if (invdtldatas[index].hsn.code != section.value.hsn.code) {
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
      this.adddebit(section, data, index)

    }
  }
  getdebitresrecords: any
  getdebittdatas: any
  creditslno: any
  creditslnos: any
  showdefaultslno: boolean
  showaltslno: boolean
  Roundoffsamount: any
  OtherAdjustmentamts: any

  adddebit(section, data, index) {
    this.SpinnerService.show()
    let datas = this.DebitDetailForm.get('debitdtl') as FormArray
    datas.clear()
    if (this.invoicedetailsdata != undefined) {
      let datas = this.invoicedetailsdata[index]
      this.invdtltaxableamount = this.invoicedetailsdata[index]?.amount
      this.invdtltotamount = this.invoicedetailsdata[index]?.totalamount
      this.invdtloverallamount = this.invoicedetailsdata[index]?.dtltotalamt
      this.invdtltaxamount = this.invoicedetailsdata[index]?.taxamount
      this.cgstval = this.invoicedetailsdata[index]?.cgst
      this.sgstval = this.invoicedetailsdata[index]?.sgst
      this.igstval = this.invoicedetailsdata[index]?.igst
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = datas?.id
    } else {
      let sections = section?.value
      this.invdtltaxableamount = sections?.amount
      this.invdtltotamount = sections?.totalamount
      this.invdtloverallamount = sections?.dtltotalamt
      this.invdtltaxamount = sections?.taxamount
      this.cgstval = sections?.cgst
      this.sgstval = sections?.sgst
      this.igstval = sections?.igst
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = sections?.id
    }
    if (this.invdtladdonid == undefined) {
      this.toastr.warning('', 'Please Create Invoice Detail First ', { timeOut: 1500 });
      this.showdebitpopup = false
      this.SpinnerService.hide()
      return false;
    } else {
      this.ecfservice.getinvdetailsrecords(this.invdtladdonid)
        .subscribe(result => {
          if (result.id != undefined) {
            this.getdebitresrecords = result
            this.getdebittdatas = this.getdebitresrecords['debit']
            let a = this.getdebitresrecords['debit']


            // let invcatdata = { "code": "DUMMY", "id": 81, "name": "DUMMY" }
            // let invsubcatdata = { "code": "DUMMY", "id": 291, "name": "DUMMY", "glno": 888888 }
            // let invcrncatdata = { "code": "SUSPENSE", "id": 74, "name": "SUSPENSE AC" }
            // let invcrnsubcatdata = { "code": "PAYMENT", "id": 260, "name": "Sundry Creditors - Others", "glno": 153104 }
            // let catdata = { "code": "GST", "id": 73, "name": "GST" }
            // let igstdata = { "code": "I-Payable", "id": 244, "glno": 151512, "name": "IGST-Payable" }
            // let cgstdata = { "code": "C-Payable", "id": 243, "glno": 151513, "name": "CGST-Payable" }
            // let sgstdata = { "code": "S-Payable", "id": 242, "glno": 151514, "name": "SGST-Payable" }

            if (a.length === 0) {


              for (let i = 0; i <= 2; i++) {

                if (i === 0 && this.getgstapplicable == "Y" && (this.ecftypeid == 2 || this.ecftypeid == 13 || this.ecftypeid == 14)) {
                  this.adddebitSection()
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.defcat)
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.defsubcat)
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.defsubcat?.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
                  this.debitdatasums()
                }
                if (i === 0 && this.getgstapplicable == "Y" && this.ecftypeid == 7) {
                  this.adddebitSection()
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.defcat)
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.defsubcat)
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.defsubcat?.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(Number(this.invdtltotamount) + Number(this.InvoiceDetailForm?.value?.roundoffamt))
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(this.InvoiceDetailForm?.value?.roundoffamt)
                  this.debitdatasums()
                }
                if (this.locationname == "" || this.locationname == null) {
                  if (i == 1 && this.type === "IGST" && this.getgstapplicable == "Y" && (this.ecftypeid == 2 || this.ecftypeid == 13 || this.ecftypeid == 14)) {
                    this.adddebitSection()
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.gstcat)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.igstdata[0])
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.igstdata[0]?.glno)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.igstval)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
                    this.showsplit = true
                    this.showdelete = true
                  }
                  if (i == 1 && this.type === "SGST & CGST" && this.getgstapplicable == "Y" && (this.ecftypeid == 2 || this.ecftypeid == 13 || this.ecftypeid == 14)) {
                    this.adddebitSection()
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.gstcat)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.cgstdata[0])
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.cgstdata[0]?.glno)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.cgstval)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
                    this.showsplit = true
                    this.showdelete = true
                  }
                  if (i == 2 && this.type === "SGST & CGST" && this.getgstapplicable == "Y" && (this.ecftypeid == 2 || this.ecftypeid == 13 || this.ecftypeid == 14)) {
                    this.adddebitSection()
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.gstcat)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.sgstdata[0])
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.sgstdata[0]?.glno)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.sgstval)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
                    this.showsplit = true
                    this.showdelete = true
                  }
                } else {
                  if (i == 1 && this.type === "IGST" && this.getgstapplicable == "Y" && (this.ecftypeid == 2 || this.ecftypeid == 13 || this.ecftypeid == 14)) {
                    this.adddebitSection()
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.pmdrecords?.category_code)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.pmdrecords?.igst_code)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.pmdrecords?.igst_code?.glno)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.igstval)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
                    this.showsplit = true
                    this.showdelete = true
                  }
                  if (i == 1 && this.type === "SGST & CGST" && this.getgstapplicable == "Y" && (this.ecftypeid == 2 || this.ecftypeid == 13 || this.ecftypeid == 14)) {
                    this.adddebitSection()
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.pmdrecords?.category_code)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.pmdrecords?.cgst_code)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.pmdrecords?.cgst_code?.glno)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.cgstval)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
                    this.showsplit = true
                    this.showdelete = true
                  }
                  if (i == 2 && this.type === "SGST & CGST" && this.getgstapplicable == "Y" && (this.ecftypeid == 2 || this.ecftypeid == 13 || this.ecftypeid == 14)) {
                    this.adddebitSection()
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.pmdrecords?.category_code)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.pmdrecords?.sgst_code)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.pmdrecords?.sgst_code?.glno)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('remarks').setValue('GST')
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.sgstval)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('deductionamount').setValue(0)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
                    this.showsplit = true
                    this.showdelete = true
                  }
                }
                if (this.igstval == 0 && this.cgstval == 0 && this.sgstval == 0 && i == 0 && this.getgstapplicable == "N" && this.ecftypeid != 7) {
                  this.adddebitSection()
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.defcat)
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.defsubcat)
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.defsubcat?.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
                  this.debitdatasums()
                }
                if (this.igstval == 0 && this.cgstval == 0 && this.sgstval == 0 && i == 0 && this.getgstapplicable == "N" && this.ecftypeid == 7) {
                  this.adddebitSection()
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.defcat)
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.defsubcat)
                  // this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.defsubcat?.glno)
                  this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltotamount)
                  this.debitdatasums()
                }
              }
              this.submitdebitdtlbtn = false
              this.readdata = false
              let dbtdataas = this.DebitDetailForm?.value?.debitdtl
              this.ecfservices.getautobscc(this.raisedbyid).subscribe(results => {

                if (results?.business_segment?.id != undefined && results?.cost_centre?.id != undefined) {
                  let bsccdata = results
                  for (let i in dbtdataas) {
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsccdata?.business_segment)
                    this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(bsccdata?.cost_centre)
                  }
                }
              })
            }

            // if (a.length == 1 && this.getgstapplicable == 'Y' && this.ecftypeid == 2) {
            //  for(let i = 1;i<=2;i++){
            //   this.adddebitSection()
            //   this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(invcatdata)
            //   this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(invsubcatdata)
            //   this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(invsubcatdata.glno)
            //   this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.invdtltaxableamount)
            //   this.debitdatasums()
            //  }
            // }
            if (result) {
              this.getdebitrecords(result)
            }
            this.SpinnerService.hide()
          } else {
            this.notification.showError(result?.description)
            this.SpinnerService.hide();
            return false
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
  }

  getdebitrecords(datas) {
    if (this.ecftypeid == 4) {
      if (datas?.debit?.length == 0) {

        for (let i = 0; i < 1; i++) {
          this.adddebitSection()
          // this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.defcat)
          // this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.defsubcat)
          // this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.defsubcat?.glno)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('amount').setValue(this.totalamount)
          this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(100)
          this.debitdatasums()

        }
        let dbtdataas = this.DebitDetailForm?.value?.debitdtl
        this.ecfservices.getautobscc(this.raisedbyid).subscribe(results => {
          let bsccdata = results
          for (let i in dbtdataas) {
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('bs').setValue(bsccdata?.business_segment)
            this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc').setValue(bsccdata?.cost_centre)
          }
        })

      }


    }

    for (let debit of datas?.debit) {
      let id: FormControl = new FormControl('');
      let invoiceheader_id: FormControl = new FormControl('');
      let invoicedetail_id: FormControl = new FormControl('');
      let category_code: FormControl = new FormControl('');
      let subcategory_code: FormControl = new FormControl('');
      let bsproduct: FormControl = new FormControl('');
      let debitglno: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let debittotal: FormControl = new FormControl('');
      let deductionamount: FormControl = new FormControl(0);
      let cc: FormControl = new FormControl('');
      let bs: FormControl = new FormControl('');
      let ccbspercentage: FormControl = new FormControl('');
      let remarks: FormControl = new FormControl('');
      let ccbspercentages: FormControl = new FormControl(100);
      const debitFormArray = this.DebitDetailForm.get("debitdtl") as FormArray;


      id.setValue(debit?.id)
      invoiceheader_id.setValue(debit?.invoiceheader)
      invoicedetail_id.setValue(debit?.invoicedetail)
      category_code.setValue(debit?.category_code)
      subcategory_code.setValue(debit?.subcategory_code)
      debitglno.setValue(debit?.debitglno)
      if (this.ecftypeid != 4) {
        if (debit?.category_code?.code != "GST") {
          amount.setValue(debit?.amount)
        }
        else {
          if (debit?.subcategory_code?.code == "I-Payable") {
            amount.setValue(this.igstval)
          }
          if (debit?.subcategory_code?.code == "C-Payable") {
            amount.setValue(this.cgstval)
          }
          if (debit?.subcategory_code?.code == "S-Payable") {
            amount.setValue(this.sgstval)
          }

        }
      }
      else {
        amount.setValue(debit?.amount)
      }
      debittotal.setValue(0)
      deductionamount.setValue(debit?.deductionamount)
      cc.setValue(debit?.ccbs?.cc_code)
      bs.setValue(debit?.ccbs?.bs_code)
      ccbspercentage.setValue(debit?.ccbs?.ccbspercentage)
      ccbspercentages.setValue(debit?.ccbs?.ccbspercentage)
      remarks.setValue(debit?.ccbs?.remarks)
      bsproduct.setValue(debit?.bsproduct)


      debitFormArray.push(new FormGroup({
        id: id,
        invoiceheader_id: invoiceheader_id,
        invoicedetail_id: invoicedetail_id,
        category_code: category_code,
        subcategory_code: subcategory_code,
        bsproduct: bsproduct,
        debitglno: debitglno,
        amount: amount,
        debittotal: debittotal,
        deductionamount: deductionamount,
        cc: cc,
        bs: bs,
        ccbspercentage: ccbspercentage,
        ccbspercentages: ccbspercentages,
        remarks: remarks,
        ccbsdtl: this.fb.group({
          cc_code: debit?.ccbs?.cc_code,
          bs_code: debit?.ccbs?.bs_code,
          code: debit?.ccbs?.code,
          ccbspercentage: debit?.ccbs?.ccbspercentage,
          remarks: debit?.ccbs.remarks,
          glno: debit?.ccbs?.glno,
          id: debit?.ccbs?.id,
          amount: debit?.ccbs?.amount,
          debit: debit?.ccbs?.debit,

        })
      }))


      category_code.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getcategoryscroll(value, 1)
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
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })

      subcategory_code.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getsubcategoryscroll(this.catid, value, 1)
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

      // let businesskeyvalue: String = "";
      // this.getbusinessproduct(businesskeyvalue);
      // bsproduct.valueChanges
      //   .pipe(
      //     debounceTime(100),
      //     distinctUntilChanged(),
      //     tap(() => {
      //       this.isLoading = true;
      //     }),
      //     switchMap(value => this.ecfservice.getbusinessproductscroll(value, 1)
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
      //     this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      //   })

      let bskeyvalue: String = "";
      this.getbs(bskeyvalue);
      bs.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getbsscroll(value, 1)
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
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })

      cc.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.ecfservice.getccscroll(this.bssid, value, 1)
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
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })
      this.calctotaldebitdata(amount)

      ccbspercentage.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calcTotaldebit(this.debitaddindex)
        if (!this.DebitDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      }
      )

      amount.valueChanges.pipe(
        debounceTime(20)
      ).subscribe(value => {
        this.calcdebiteditamount(amount)
        if (!this.DebitDetailForm.valid) {
          return;
        }
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      }
      )


      // deductionamount.valueChanges.pipe(
      //   debounceTime(20)
      // ).subscribe(value => {
      //   this.calcotheramount(this.debitaddindex)
      //   if (!this.DebitDetailForm.valid) {
      //     return;
      //   }
      //   this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      // }
      // )
    }

  }

  calctotaldebitdata(amount: FormControl) {
    this.debitdatasums()
  }
  // -------credit sections------
  creditaddonindex: any
  getcreditindex: any
  amountchangedata: any

  addoncreditindex(indexx, data) {
    this.creditaddonindex = indexx
    this.getcreditindex = indexx
    this.amountchangedata = data

  }

  getPaymode() {

    this.ecfservice.getPaymode()
      .subscribe((results: any[]) => {
        if (results) {
          let paymodedata = results["data"];
          this.paymodelists = results["data"];

          this.PaymodeNonPoliqList = paymodedata.filter(payid => payid?.code === 'PM002' || payid?.code === 'PM005' || payid?.code === 'PM006');
          this.PaymodeNonPocrnList = paymodedata.filter(payid => payid?.code === 'PM002' || payid?.code === 'PM005' || payid?.code === 'PM010');
          this.PaymodeNonPoLists = paymodedata.filter(payid => payid?.code === 'PM002' || payid?.code === 'PM005');
          this.PaymodeNonPoList = paymodedata.filter(payid => payid?.code === 'PM002' || payid?.code === 'PM005' || payid?.code === 'PM006' || payid?.code === 'PM010');
          this.PaymodeAdvVenList = paymodedata.filter(payid => payid?.code === 'PM002' || payid?.code === 'PM005');
          this.PaymodeAdvERAList = paymodedata.filter(payid => payid?.code == 'PM004');
          this.PaymodeAdvBRAList = paymodedata.filter(payid => payid?.code == 'PM001');
          this.PaymodeERAList = paymodedata.filter(payid => payid?.code === 'PM004' || payid?.code === 'PM006');
          this.PaymodeERALists = paymodedata.filter(payid => payid?.code === 'PM004');
          this.PaymodeCRNList = paymodedata.filter(payid => payid?.code == 'PM011' || payid?.code == 'PM002');
          this.paymodeICRList = paymodedata.filter(payid => payid?.code == 'PM008' || payid?.code == 'PM002')


        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  public displayPaymode(paymode?: paymodelistss): string | undefined {
    return paymode ? paymode.name : undefined;
  }



  getCreditSections(form) {
    return form.controls.creditdtl.controls;
  }

  addcreditSection() {

    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.push(this.creditdetails());
    // var ab:number = 0
    // for(let i=1;i<= this.dtllength;i++){
    //   ab = i*2
    //   for(let j=0;j<control.length;j++){
    //     if(ab==j){
    //       this.InvoiceDetailForm.get('creditdtl')['controls'][j].get('cdtind').setValue(i-1)
    //       break;
    //     }
    //   }

    // }


  }
  removecreditSection(i) {

    const control = <FormArray>this.InvoiceDetailForm.get('creditdtl');
    control.removeAt(i);
    this.creditdatasums()
  }
  credit: any
  paymodeid: any
  paymodecode: any
  taxableamount: any
  getcredit = true

  getpaymodedata(paydata, index) {
    this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('paymode_ids').setValue(paydata)
  }

  CreditDessss(data, pay, index) {
    this.credit = data
    this.getcreditindex = index
    this.paymodeid = pay?.id
    this.paymodecode = pay?.code
    this.crnindex = null;
    this.ppxindex = null;
    // if (this.paymodeid === 5 || this.paymodeid === 8) {
    if (this.paymodecode === "PM005") {
      if (pay?.paymode_details['data'] != undefined) {
        if (pay?.paymode_details['data']?.length > 0) {
          let glnumber = pay?.paymode_details['data'][0]?.glno
          let catcode = pay?.paymode_details['data'][0]?.category_id?.code
          let subcatcode = pay?.paymode_details['data'][0]?.sub_category_id.code
          if (glnumber != "" || glnumber != undefined || glnumber != null) {
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').setValue(glnumber)
          }
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('category_code').setValue(catcode)
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('subcategory_code').setValue(subcatcode)
        }
      }
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amount').setValue(this.totalamount)
      this.creditdatasums()

      this.showaccno[index] = true
      this.showeraacc[index] = false
      this.showkvbacc[index] = false
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.showtranspay[index] = false
      this.showppxmodal = false
      this.showcrnmodal = false
      this.getaccno(this.paymodeid)
    }
    if (this.paymodecode === "PM004" || this.paymodecode === "PM001") {
      if (this.paymodecode === "PM004") {
        if (pay?.paymode_details['data'] != undefined) {
          if (pay?.paymode_details['data']?.length > 0) {

            let glnumber = pay?.paymode_details['data'][0]?.glno
            let catcode = pay?.paymode_details['data'][0]?.category_id?.code
            let subcatcode = pay?.paymode_details['data'][0]?.sub_category_id.code
            if (glnumber != "" || glnumber != undefined || glnumber != null) {
              this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').setValue(glnumber)
            }
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('category_code').setValue(catcode)
            this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('subcategory_code').setValue(subcatcode)
          }
        }
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amount').setValue(this.totalamount)
        this.creditdatasums()
      }
      this.showeraacc[index] = true
      this.showaccno[index] = false
      this.showkvbacc[index] = false
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.showtranspay[index] = false
      this.showppxmodal = false
      this.showcrnmodal = false
      this.getERA(index, pay?.id)
    }


    if (this.paymodecode === "PM003") {
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      this.showtranspay[index] = true
      this.showaccno[index] = false
      this.showeraacc[index] = false
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.showkvbacc[index] = false

    }

    if (this.paymodecode === "PM007") {
      this.showtaxtype[index] = true
      this.showtaxrate[index] = true
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditglno').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('taxableamount').setValue(this.taxableamount)
      this.gettaxtype()
    }

    if (this.paymodecode === "PM006") {
      if (!this.getcredit) {
        this.showppxmodal = true
        this.showcrnmodal = false
        this.showtaxtype[index] = false
        this.showtaxrate[index] = false
        this.showtaxtypes[index] = false
        this.showtaxrates[index] = false
        this.showtranspay[index] = false
        this.getPpxrecords()
        this.creditdatasums()
      }
    }

    if (this.paymodecode === "PM010") {
      if (!this.getcredit) {
        this.showcrnmodal = true
        this.showppxmodal = false
        this.showtaxtype[index] = false
        this.showtaxrate[index] = false
        this.showtaxtypes[index] = false
        this.showtaxrates[index] = false
        this.showtranspay[index] = false
        this.getCrnrecords()
        this.creditdatasums()
      }
    }

    if (this.paymodecode === "PM002") {
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()

      this.showglpopup = true
      this.creditglForm.patchValue({ name: pay.name })
      this.getcreditgl(this.paymodeid)
    } else {
      this.showglpopup = false
    }
    if (this.paymodecode === "PM011") {
      let datas = this.InvoiceDetailForm.value.creditdtl

      if (datas[index].creditglno == 0) {
        this.dataclears()
      } else {
        let data = this.crnglForm.value.crnglArray
        for (let i in data) {
          this.crnglForm.get('crnglArray')['controls'][i].get('category_code').setValue(this.InvoiceDetailForm.value.creditdtl[index].category_code)
          this.crnglForm.get('crnglArray')['controls'][i].get('subcategory_code').setValue(this.InvoiceDetailForm.value.creditdtl[index].subcategory_code)
          this.crnglForm.get('crnglArray')['controls'][i].get('debitglno').setValue(this.InvoiceDetailForm.value.creditdtl[index].creditglno)
        }

      }
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      // if(index == 0){
      // this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amount').setValue(this.taxableamount)
      // }
      this.showgrnpopup = true
      this.creditdatasums()
    } else {
      this.showgrnpopup = false
    }

    if (this.paymodecode === "PM008") {
      this.showaccno[index] = true
      this.showeraacc[index] = false
      this.showkvbacc[index] = false
      this.showtaxtype[index] = false
      this.showtaxrate[index] = false
      this.showtaxtypes[index] = false
      this.showtaxrates[index] = false
      this.showtranspay[index] = false
      this.showkvbacpopup = true
      if (data?.value?.creditrefno == "") {
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('bank').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('branch').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('ifsccode').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('benificiary').reset()
        this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('creditrefno').reset()
      } else {
        this.kvbaccForm.patchValue({
          accno: data?.value?.creditrefno,
          confirmaccno: data?.value?.creditrefno
        })
        // this.kvbaccForm.get('accno').setValue(data[index]?.creditrefno)
        // this.kvbaccForm.get('confirmaccno').setValue(data[index]?.creditrefno)
      }
    }
    else {
      this.showkvbacpopup = false

    }

  }

  dataclears() {
    let data = this.crnglForm.value.crnglArray
    for (let i in data) {
      this.crnglForm.get('crnglArray')['controls'][i].get('category_code').reset()
      this.crnglForm.get('crnglArray')['controls'][i].get('subcategory_code').reset()
      this.crnglForm.get('crnglArray')['controls'][i].get('debitglno').reset()
    }

  }

  accountno: any
  getacc(accountno, index) {
    this.accountno = accountno
    this.getcreditpaymodesummary()
  }
  optionsummary = false
  firstsummary = true
  creditListed: any
  arraydata: any
  accno: any
  creditids: any
  accountnumber: any
  getcreditpaymodesummary(pageNumber = 1, pageSize = 10) {
    if (this.accountno === undefined) {
      this.accountnumber = this.accnumm
    } else {
      this.accountnumber = this.accountno
    }
    this.ecfservice.getcreditpaymodesummaryy(pageNumber, pageSize, this.paymodeid, this.suppid, this.accountnumber)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.creditListed = datas
          for (let i of this.creditListed) {
            let accno = i?.account_no
            let bank = i?.bank_id?.name
            let branch = i?.branch_id?.name
            let ifsc = i?.branch_id?.ifsccode
            let beneficiary = i?.beneficiary
            let creditids = i?.id
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(accno)
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('bank').setValue(bank)
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('branch').setValue(branch)
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('ifsccode').setValue(ifsc)
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('benificiary').setValue(beneficiary)
            this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditbank_id').setValue(creditids)
          }
          this.arraydata = datas.length

          if (this.arraydata === 0) {
            this.optionsummary = true;
            this.firstsummary = false;
          } else {
            this.optionsummary = false;
            this.firstsummary = true;
          }
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  choosetype(index) {
    this.showtaxtype[index] = true
    this.showtaxtypes[index] = false
    this.gettaxtype()
  }

  chooserate(index) {
    this.showtaxrate[index] = true
    this.showtaxrates[index] = false
  }

  getPpxSections(form) {
    return form.controls.ppxdtl.controls;
  }

  getCrnSections(form) {
    return form.controls.crndtl.controls;
  }


  ppxDisable = [false, false, false, false, false, false, false]
  getPpxrecords() {
    this.ppxLoad = true
    let ppxcontrol = this.ppxForm.controls["ppxdtl"] as FormArray;
    ppxcontrol.clear()

    let x = 0
    let ecfid
    if (this.ecfheaderid != undefined) {
      ecfid = this.ecfheaderid
    } else {
      ecfid = this.ecfheaderidd
    }

    for (let ppx of this.ppxdata) {
      let apppxheader_id: FormControl = new FormControl('');
      let name: FormControl = new FormControl('');

      let advno: FormControl = new FormControl('');
      let branchName: FormControl = new FormControl('');
      let branchCode: FormControl = new FormControl('');
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
      let creditindexx: FormControl = new FormControl('');

      const ppxFormArray = this.ppxForm.get("ppxdtl") as FormArray;

      apppxheader_id.setValue(ppx.id)
      name.setValue(ppx.payto_name.name)
      advno.setValue(ppx.crno)
      ppxheader_date.setValue(ppx.ppxheader_date)
      branchName.setValue(ppx.emp_branch_details?.name)
      branchCode.setValue(ppx.emp_branch_details?.code)
      apinvoiceheader_id.setValue(ppx.apinvoiceheader_id)
      credit_id.setValue(ppx.credit_id)

      // let num: number = +ppx.ppxheader_amount
      // let amt = new Intl.NumberFormat("en-GB").format(num); 
      // amt = amt ? amt.toString() : '';
      // ppxheader_amount.setValue(amt)
      ppxheader_amount.setValue(ppx.ppxheader_amount)
      ecfheader_id.setValue(ecfid)
      // num = +ppx.ppxheader_balance
      // amt = new Intl.NumberFormat("en-GB").format(num); 
      // amt = amt ? amt.toString() : '';
      // ppxheader_balance.setValue(amt)

      ppxheader_balance.setValue(ppx.ppxheader_balance)
      ecf_amount.setValue(ppx.ecf_amount)

      // num = +ppx.liquedate_limit
      // amt = new Intl.NumberFormat("en-GB").format(num); 
      // amt = amt ? amt.toString() : '';
      // liquedate_limit.setValue(amt)

      liquedate_limit.setValue(ppx.liquedate_limit)

      // num = +ppx.ap_amount
      // amt = new Intl.NumberFormat("en-GB").format(num); 
      // amt = amt ? amt.toString() : '';
      // ap_amount.setValue(amt)


      ap_amount.setValue(ppx.ap_amount)
      ppxdetails.setValue(ppx.ppxdetails)
      liquidate_amt.setValue(0)
      process_amount.setValue(ppx.process_amount)
      creditglno.setValue(ppx.credit_glno)

      select.setValue(false)

      if (ppx.ppxheader_balance > 0) {
        this.ppxDisable[x] = false
      }
      else {
        this.ppxDisable[x] = true
      }

      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

      for (let i in creditdtlsdatas) {
        if (creditdtlsdatas[i].paymode_id?.code == 'PM006' && creditdtlsdatas[i].creditrefno == ppx.crno) {
          if (this.getcreditindex == i) {
            this.ppxDisable[x] = false
          }
          else {
            this.ppxDisable[x] = true
          }
          liquidate_amt.setValue(creditdtlsdatas[i].amount)
          select.setValue(true)
        }

      }
      ppxFormArray.push(new FormGroup({
        apppxheader_id: apppxheader_id,
        name: name,
        advno: advno,
        branchName: branchName,
        branchCode: branchCode,
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
        creditglno: creditglno

      }))
      x++
    }

    let array = this.ppxForm.value.ppxdtl.map(element => element.advno)

    const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

    if (array.includes(creditdtlsdatas[this.getcreditindex].creditrefno)) {
      array.forEach((element, index) => {
        if (element == creditdtlsdatas[this.getcreditindex].creditrefno) {

        } else {
          this.ppxDisable[index] = true
        }
      })
    } else {

    }
    this.getPPXsum()
    this.ppxLoad = false
  }

  getppxindex(ind) {
    const ppxForm = this.ppxForm.value.ppxdtl[ind]
    if (ppxForm.select) {
      if (ppxForm.creditindexx == this.getcreditindex) {
        this.ppxindex = ind
      }
    } else {
      this.ppxindex = null
    }
  }


  selectedppxdata: any = []
  liquidatevalue: any
  ppxCrno: any
  submitppx() {
    // this.selectedppxdata = []
    this.popupshow = true
    const ppxForm = this.ppxForm?.value?.ppxdtl

    this.selectedppxdata = ppxForm.filter(element => {
      if (element?.select) {
        if (typeof (element?.ppxheader_amount) == 'string') {
          element.ppxheader_amount = Number(element?.ppxheader_amount)
        }
        if (typeof (element?.ppxheader_balance) == 'string') {
          element.ppxheader_balance = Number(element?.ppxheader_balance)
        }
        if (typeof (element?.liquidate_amt) == 'string') {
          element.liquidate_amt = Number(element?.liquidate_amt)
          return element
        }


      }
    }

    );

    if (this.ppxsum > this.totalamount) {
      this.notification.showError("Liquidate Amount should not exceed the Invoice amount.")
      return false
    }

    if (this.ppxindex != null && ppxForm[this.ppxindex].select == true) {
      if (Number(ppxForm[this.ppxindex].liquidate_amt) <= 0) {
        this.notification.showError("Please give a valid amount to liquidate.");
        return false;
      } else {
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(ppxForm[this.ppxindex].advno)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue(Number(ppxForm[this.ppxindex].liquidate_amt))
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(ppxForm[this.ppxindex].creditglno)
        let ppxcontrol = this.ppxForm.controls["ppxdtl"] as FormArray;
        ppxcontrol.clear()
        this.closeppxbutton.nativeElement.click();
        this.showppxmodal = false
      }
    } else if (this.ppxindex != null && ppxForm[this.ppxindex].select != true) {
      this.notification.showError("Please select an PPX No. and give amount to Liquidate.")
      return false;
    }

    else if (this.InvoiceDetailForm.value.creditdtl[this.getcreditindex].creditrefno == '' && this.ppxindex == null) {
      this.notification.showError("Please select an PPX No. and give amount to Liquidate.")
      return false;
    } else {
      this.closeppxbutton.nativeElement.click();
      this.showppxmodal = false;
    }


    // let ppxselected = false
    // let ind
    // if (this.ppxsum > this.totalamount) {
    //   this.notification.showError("Liquidate Amount should not exceed the Invoice amount.")
    //   return false
    // }
    // for (let i in ppxForm) {

    //   if (ppxForm[i].select == true) {
    //     ppxselected = true
    //     if (this.selectedppxdata.length > 0) {
    //       for (let j = 0; j < this.selectedppxdata.length; j++) {
    //         if (this.selectedppxdata[j].advno == ppxForm[i].advno) {
    //           ind = j

    //           this.selectedppxdata[j].liquidate_amt = ppxForm[i].liquidate_amt
    //         }
    //         else {
    //           this.selectedppxdata.push(ppxForm[i])
    //         }
    //       }
    //     }
    //     else {
    //       this.selectedppxdata.push(ppxForm[i])
    //     }
    //   }
    // }
    // if (ppxselected == true) {
    //   let n
    //   if (ind != undefined) {
    //     n = ind
    //   }
    //   else {
    //     n = this.selectedppxdata.length - 1
    //   }
    //   if (Number(this.selectedppxdata[n].liquidate_amt) <= 0) {
    //     this.notification.showError("Please give a valid amount to liquidate.")
    //   }
    //   else {
    //     this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(this.selectedppxdata[n].advno)
    //     this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue(this.selectedppxdata[n].liquidate_amt)
    //     this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(this.selectedppxdata[n].creditglno)
    //     let ppxcontrol = this.ppxForm.controls["ppxdtl"] as FormArray;
    //     ppxcontrol.clear()
    //     this.closeppxbutton.nativeElement.click();
    //     this.showppxmodal = false
    //   }
    // }
    // else {
    //   this.notification.showError("Please select an Advance No. and give amount to Liquidate.")
    // }

  }

  ppxamt(e, ind) {
    this.ppxindex = ind
    if (this.ppxLoad == false) {
      let amt = this.ppxForm.value.ppxdtl[ind].liquidate_amt
      let balamt = this.ppxForm.value.ppxdtl[ind].ppxheader_balance
      let limitamt = this.ppxForm.value.ppxdtl[ind].liquedate_limit
      let amtt = this.ppxForm.value['ppxdtl'].map(x => Number(x.liquidate_amt));
      let totamt = amtt.reduce((a, b) => a + b, 0);
      if (+totamt > this.totalamount) {
        let n = amt.slice(0, amt.length - 1)
        // let num: number = +n
        // amt = new Intl.NumberFormat("en-GB").format(num);
        // amt = amt ? amt.toString() : '';
        this.ppxForm.get('ppxdtl')['controls'][ind].get('liquidate_amt').setValue(n)
        this.notification.showError("Total amount should not exceed the Invoice Amount");
      }

      if (e > Number(balamt) || e > this.totalamount || e > Number(limitamt)) {
        let n = amt.slice(0, amt.length - 1)
        this.ppxForm.get('ppxdtl')['controls'][ind].get('liquidate_amt').setValue(n)
        this.notification.showError("Liquidate amount should not exceed the Invoice amount, Liquidate Limit and Balance amount.")
      }
    }
  }

  closeppx() {
    this.showppxmodal = false
    this.closeppxbutton.nativeElement.click();
  }

  ppxsum: any
  ppxselect(e, ind) {
    const ppxForm = this.ppxForm.value.ppxdtl
    const Invdtl = this.InvoiceDetailForm.value.creditdtl
    this.getppxindex(ind);
    Invdtl[this.getcreditindex].ppxindexx = ind
    ppxForm[ind].creditindexx = this.getcreditindex

    if (e.checked == true) {
      let ppxselected = false
      for (let i in ppxForm) {
        if (i != ind && ppxForm[i].select == true && this.ppxDisable[i] == false) {
          ppxselected = true
        }
      }
      if (ppxselected == true) {
        this.notification.showError("Please select only one Advance.")
        this.ppxForm.get('ppxdtl')['controls'][ind].get('select').setValue(false)
        this.ppxForm.get('ppxdtl')['controls'][ind].get('liquidate_amt').setValue("");
        this.ppxForm.get('ppxdtl')['controls'][ind].get('liquidate_amt').disable();
        throw new Error
      }
    } else {
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue("");
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue("");
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue("");
      this.ppxForm.get('ppxdtl')['controls'][ind].get('liquidate_amt').setValue(0)
      let array = this.ppxForm.value.ppxdtl.map(element => element.advno)
      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
      if (array.includes(creditdtlsdatas[this.getcreditindex].creditrefno)) {
        array.forEach((element, index) => {
          if (element == creditdtlsdatas[this.getcreditindex].creditrefno) {

          } else {
            this.ppxDisable[index] = true
          }
        })
      } else {
        ppxForm.forEach((element, index) => {
          if (element.select == false) {
            this.ppxDisable[index] = false

          }
        })
      }
    }


    this.getPPXsum();
  }

  getPPXsum() {
    this.ppxsum = 0
    const ppxForm = this.ppxForm.value.ppxdtl
    if (this.ppxLoad == false) {


      for (let i in ppxForm) {
        if (ppxForm[i].select == true) {
          this.ppxsum += +ppxForm[i].liquidate_amt
        }
      }
    } else {
      for (let i in ppxForm) {
        if (ppxForm[i].select == true) {
          this.ppxsum += +(String(ppxForm[i].liquidate_amt).replace(/,/g, ''))
        }
      }
    }
  }



  crnDisable = [false, false, false, false, false, false, false, false, false, false]
  getCrnrecords() {
    this.crnLoad = true
    let crncontrol = this.crnForm.controls["crndtl"] as FormArray;
    crncontrol.clear()

    let x = 0
    let ecfid
    if (this.ecfheaderid != undefined) {
      ecfid = this.ecfheaderid
    } else {
      ecfid = this.ecfheaderidd
    }

    for (let crn of this.crndata) {
      let apppxheader_id: FormControl = new FormControl('');
      let name: FormControl = new FormControl('');

      let advno: FormControl = new FormControl('');
      let branchName: FormControl = new FormControl('');
      let branchCode: FormControl = new FormControl('');
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
      let creditindexx: FormControl = new FormControl('');

      const crnFormArray = this.crnForm.get("crndtl") as FormArray;

      apppxheader_id.setValue(crn.id)
      name.setValue(crn.payto_name.name)
      advno.setValue(crn.crno)
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

      select.setValue(false)

      if (crn.ppxheader_balance > 0) {
        this.crnDisable[x] = false
      }
      else {
        this.crnDisable[x] = true
      }

      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl

      for (let i in creditdtlsdatas) {
        if (creditdtlsdatas[i].paymode_id?.code == 'PM010' && creditdtlsdatas[i].creditrefno == crn.crno) {
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
        apppxheader_id: apppxheader_id,
        name: name,
        advno: advno,
        branchName: branchName,
        branchCode: branchCode,
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
        creditglno: creditglno

      }))
      x++
    }

    let array = this.crnForm?.value?.crndtl?.map(element => element.advno)
    const creditdtlsdatas = this.InvoiceDetailForm?.value?.creditdtl

    if (array.includes(creditdtlsdatas[this.getcreditindex]?.creditrefno)) {

      array.forEach((element, index) => {
        if (element == creditdtlsdatas[this.getcreditindex]?.creditrefno) {

        } else {
          this.crnDisable[index] = true
        }
      })
    } else {

    }
    this.getCRNsum()
    this.crnLoad = false
  }

  getcrnindex(ind) {
    const crnForm = this.crnForm.value.crndtl[ind]
    if (crnForm.select) {
      if (crnForm.creditindexx == this.getcreditindex) {
        this.crnindex = ind
      }
    } else {
      this.crnindex = null
    }
  }

  selectedcrndata: any = []
  crnliquidatevalue: any
  crnCrno: any
  submitcrn() {
    this.popupshowcrn = true;

    const crnForm = this.crnForm?.value?.crndtl
    this.selectedcrndata = crnForm.filter(element => {
      if (element?.select) {
        if (typeof (element?.ppxheader_amount) == 'string') {
          element.ppxheader_amount = Number(element?.ppxheader_amount)
        }
        if (typeof (element?.ppxheader_balance) == 'string') {
          element.ppxheader_balance = Number(element?.ppxheader_balance)
        }
        if (typeof (element?.liquidate_amt) == 'string') {
          element.liquidate_amt = Number(element?.liquidate_amt)
        }
        return element
      }
    }

    );

    if (this.crnsum > this.totalamount) {
      this.notification.showError("Liquidate Amount should not exceed the Invoice amount.")
      return false;
    }
    if (this.crnindex != null && crnForm[this.crnindex].select == true) {
      if (Number(crnForm[this.crnindex].liquidate_amt)) {
        this.notification.showError("Please give a valid amount to liquidate.")
        return false;
      } else {
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(crnForm[this.crnindex].advno)
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue(Number(crnForm[this.crnindex].liquidate_amt))
        this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(crnForm[this.crnindex].creditglno)
        let crncontrol = this.crnForm.controls["crndtl"] as FormArray;
        crncontrol.clear()
        this.closecrnbutton.nativeElement.click();
        this.showcrnmodal = false;
      }
    } else if (this.crnindex != null && crnForm[this.crnindex].select != true) {
      this.notification.showError("Please select an CRN No. and give amount to Liquidate.")
      return false;
    }

    else if (this.InvoiceDetailForm.value.creditdtl[this.getcreditindex].creditrefno == '' && this.crnindex == null) {
      this.notification.showError("Please select an CRN No. and give amount to Liquidate.")
      return false;
    } else {
      this.closecrnbutton.nativeElement.click();
      this.showcrnmodal = false;
    }

    // let crnselected = false
    // let ind
    // if (this.crnsum > this.totalamount) {
    //   this.notification.showError("Liquidate Amount should not exceed the Invoice amount.")
    //   return false
    // }
    // for (let i in crnForm) {

    //   if (crnForm[i].select == true) {
    //     crnselected = true
    //     if (this.selectedcrndata.length > 0) {
    //       for (let j = 0; j < this.selectedcrndata.length; j++) {
    //         if (this.selectedcrndata[j].advno == crnForm[i].advno) {
    //           ind = j

    //           this.selectedcrndata[j].liquidate_amt = crnForm[i].liquidate_amt
    //         }
    //         else {
    //           this.selectedcrndata.push(crnForm[i])
    //         }
    //       }
    //     }
    //     else {
    //       this.selectedcrndata.push(crnForm[i])
    //     }
    //   }
    // }
    // if (crnselected == true) {
    //   let n
    //   if (ind != undefined) {
    //     n = ind
    //   }
    //   else {
    //     n = this.selectedcrndata.length - 1
    //   }
    //   if (Number(this.selectedcrndata[n].liquidate_amt) <= 0) {
    //     this.notification.showError("Please give a valid amount to liquidate.")
    //   }
    //   else {
    //     this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(this.selectedcrndata[n].advno)
    //     this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue(this.selectedcrndata[n].liquidate_amt)
    //     this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(this.selectedcrndata[n].creditglno)
    //     let crncontrol = this.crnForm.controls["crndtl"] as FormArray;
    //     crncontrol.clear()
    //     this.closecrnbutton.nativeElement.click();
    //     this.showcrnmodal = false
    //   }
    // }
    // else {
    //   this.notification.showError("Please select an CRN No. and give amount to Liquidate.")
    // }

  }

  crnamt(e, ind) {
    this.crnindex = ind
    if (this.crnLoad == false) {
      let amt = this.crnForm.value.crndtl[ind].liquidate_amt
      let balamt = this.crnForm.value.crndtl[ind].ppxheader_balance
      let limitamt = this.crnForm.value.crndtl[ind].liquedate_limit
      let amtt = this.crnForm.value['crndtl'].map(x => Number(x.liquidate_amt));
      let totamt = amtt.reduce((a, b) => a + b, 0);


      if (+totamt > this.totalamount) {
        let n = amt.slice(0, amt.length - 1)
        // let num: number = +n
        // amt = new Intl.NumberFormat("en-GB").format(num);
        // amt = amt ? amt.toString() : '';
        this.crnForm.get('crndtl')['controls'][ind].get('liquidate_amt').setValue(n)
        this.notification.showError("Total amount should not exceed the Invoice Amount");
      }

      if (e > Number(balamt) || e > this.totalamount || e > Number(limitamt)) {
        let n = amt.slice(0, amt.length - 1)
        this.crnForm.get('crndtl')['controls'][ind].get('liquidate_amt').setValue(n)
        this.notification.showError("Liquidate amount should not exceed the Invoice amount, Liquidate Limit and Balance amount.")
      }
    }
  }

  closecrn() {
    this.showcrnmodal = false
    this.closecrnbutton.nativeElement.click();
  }

  crnsum: any
  crnselect(e, ind) {
    this.getcrnindex(ind);

    const Invdtl = this.InvoiceDetailForm.value.creditdtl
    Invdtl[this.getcreditindex].crnindexx = ind
    const crnForm = this.crnForm.value.crndtl
    crnForm[ind].creditindexx = this.getcreditindex

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
        this.crnForm.get('crndtl')['controls'][ind].get('liquidate_amt').setValue("");
        this.crnForm.get('crndtl')['controls'][ind].get('liquidate_amt').disable();
        throw new Error

      }
    } else {
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue("")
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue("")
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue("")
      this.crnForm.get('crndtl')['controls'][ind].get('liquidate_amt').setValue(0)
      let array = this.crnForm.value.crndtl.map(element => element.advno)
      const creditdtlsdatas = this.InvoiceDetailForm.value.creditdtl
      if (array.includes(creditdtlsdatas[this.getcreditindex].creditrefno)) {
        array.forEach((element, index) => {
          if (element == creditdtlsdatas[this.getcreditindex].creditrefno) {

          } else {
            this.crnDisable[index] = true
          }
        })
      } else {
        crnForm.forEach((element, index) => {
          if (element.select == false) {
            this.crnDisable[index] = false

          }
        })
      }
    }

    this.getCRNsum();
  }

  getCRNsum() {
    this.crnsum = 0
    const crnForm = this.crnForm.value.crndtl
    if (this.crnLoad == false) {
      for (let i in crnForm) {
        if (crnForm[i].select == true) {
          this.crnsum += +crnForm[i].liquidate_amt
        }
      }
    } else {
      for (let i in crnForm) {
        if (crnForm[i].select == true) {
          // this.crnsum += +crnForm[i].liquidate_amt
          this.crnsum += +(String(crnForm[i].liquidate_amt).replace(/,/g, ''))
        }
      }
    }
  }


  taxrateid: any
  taxratename: any
  vendorid: any
  maintaintaxlist: any
  othertaxlist: any
  ERAList: any

  geteracccount(data, ind) {
    // this.getERA(ind)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(data?.account_number)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(data?.bank_name)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(data?.bankbranch?.name)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(data?.bankbranch?.ifsccode)
    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(data?.beneficiary_name)
  }

  getERA(ind, id) {

    if (this.paymodecode == "PM004") {
      this.ecfservices.geterapaymodenew(this.raisedbyid, id)
        .subscribe(result => {

          if (result) {
            if (result['data']?.length == 0) {
              this.notification.showWarning("Employee Account Detail is Empty")
              return false
            } else {
              this.accERAList = result['data']
              let eradatass = result['data']
              if (this.selectederaaccno != undefined) {
                for (let i = 0; i < eradatass?.length; i++) {

                  if (eradatass[i].account_number == this.selectederaaccno) {
                    this.eraaccdata = eradatass[i]?.id
                    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(eradatass[i]?.bank_name)
                    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(eradatass[i]?.bankbranch?.name)
                    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(eradatass[i]?.bankbranch?.ifsccode)
                    this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(eradatass[i]?.beneficiary_name)

                  }
                }
              } else {
                for (let i = 0; i < 1; i++) {
                  this.eraaccdata = eradatass[i]?.id
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(eradatass[i]?.account_number)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('bank').setValue(eradatass[i]?.bank_name)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('branch').setValue(eradatass[i]?.bankbranch?.name)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('ifsccode').setValue(eradatass[i]?.bankbranch?.ifsccode)
                  this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('benificiary').setValue(eradatass[i]?.beneficiary_name)
                }
              }
            }
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )
    }

    if (this.paymodecode == "PM001") {

      this.ecfservice.getbrapaymode(this.paymodeid)
        .subscribe(result => {
          if (result == "None") {
            this.notification.showInfo("The selected branch does not have any account no")
          }
          this.InvoiceDetailForm.get('creditdtl')['controls'][ind].get('creditrefno').setValue(result)
        })

    }
  }
  gettaxtype() {
    this.ecfservice.gettdstaxtype(this.suppid)
      .subscribe(result => {
        if (result) {
          this.vendorid = result.vendor_id
          this.taxlist = result['subtax_list']
          this.maintaintaxlist = this.taxlist.filter(dept => dept.dflag === "M");
          this.othertaxlist = this.taxlist.filter(dept => dept.dflag === "O");
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  gettaxid(data) {
    this.taxrateid = data?.id
    this.taxratename = data?.subtax_type
    this.gettdstaxrates()
  }
  maintaintaxratelist: any
  othertaxratelist: any
  gettdstaxrates() {
    this.ecfservice.gettdstaxrate(this.vendorid, this.taxrateid)
      .subscribe(result => {
        if (result) {
          this.taxratelist = result['data']
          this.maintaintaxratelist = this.taxratelist.filter(dept => dept.dflag === "M");
          this.othertaxratelist = this.taxratelist.filter(dept => dept.dflag === "O");
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  taxindex: any
  taxrate: any
  gettaxcalc(data, index) {
    this.taxindex = index

    let creditdata = this.InvoiceDetailForm.value.creditdtl
    let taxrate = creditdata[index].suppliertaxrate
    this.taxrate = taxrate
    let taxableamt = creditdata[index].taxableamount
    if (taxrate === undefined || taxrate === "" || taxrate === null || taxableamt === undefined || taxableamt === "" || taxableamt === null) {
      return false
    }
    if (taxrate != undefined || taxrate != "" || taxrate != null || taxableamt != undefined || taxableamt != "" || taxableamt != null) {
      this.ecfservice.gettdstaxcalculation(taxableamt, taxrate)
        .subscribe(results => {
          let amount = results.tdsrate
          this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(amount)
        })
    }

  }
  suppid: any
  creditList: any
  paymodename: any
  creditListeds: any
  getcreditsummary(pageNumber = 1, pageSize = 10) {
    this.ecfservice.getcreditsummary(pageNumber, pageSize, this.suppid)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          let datapagination = results["pagination"];
          this.creditListeds = datas;
          for (var i = 0; i < datas?.length; i++) {
            this.paymodename = datas[i]?.paymode_id?.name

          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  accdata: any
  accnumm: any
  getaccno(payid) {
    this.ecfservice.getbankaccno(payid, this.suppid)
      .subscribe(res => {
        if (res) {
          let accList = res['data']
          if (accList?.length == 0) {
            this.notification.showWarning("Supplier Account Detail is Empty")
            return false
          } else {
            this.accList = accList.filter(x => x.is_active != false)
            if (this.selectedaccno != undefined) {
              for (let i = 0; i < this.accList?.length; i++) {
                if (this.accList[i]?.is_active == true && this.accList[i]?.status == 1) {
                  if (this.accList[i].account_no == this.selectedaccno) {
                    this.accdata = this.accList[i]?.id
                    this.accnumm = this.accList[i]?.account_no
                    this.getcreditpaymodesummary()
                  }
                }
              }
            }
            else {
              for (let i = 0; i < 1; i++) {
                if (this.accList[i]?.is_active == true && this.accList[i]?.status == 1) {
                  this.accdata = this.accList[i]?.id
                  this.accnumm = this.accList[i]?.account_no
                  this.getcreditpaymodesummary()

                }
              }
            }
          }
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  getcreditgl(payid) {
    this.ecfservice.creditglno(payid)
      .subscribe(res => {
        if (res) {
          this.glList = res['data']
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  creditgllno: any
  getgl(glno) {
    this.creditgllno = glno
    this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(this.creditgllno)
  }

  crnsubmitForm() {
    let data = this.crnglForm.value.crnglArray
    for (let i in data) {
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue(data[i]?.debitglno)
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('category_code').setValue(data[i]?.category_code)
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('subcategory_code').setValue(data[i]?.subcategory_code)
    }
    this.closebuttons.nativeElement.click();
  }

  glsubmitForm() {
    this.closebuttons.nativeElement.click();
  }

  getconfirmacc(e) {
    this.kvbaccForm.get('confirmaccno').setValue(e.target.value)
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
    if (accdetails?.confirmaccno != accdetails?.accno) {
      this.notification.showError("Confirm Account Number Does Not Match with Account Number");
      return false;
    } else {
      this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue(this.kvbaccForm?.value?.confirmaccno)
      this.kvbacclosebuttons.nativeElement.click();
    }
  }

  creditdetails() {
    let group = new FormGroup({
      id: new FormControl(),
      invoiceheader_id: new FormControl(this.invoiceheaderid),
      paymode_id: new FormControl(''),
      creditbank_id: new FormControl(''),
      suppliertax_id: new FormControl(''),
      creditglno: new FormControl(0),
      creditrefno: new FormControl(''),
      suppliertaxtype: new FormControl(''),
      suppliertaxrate: new FormControl(''),
      taxexcempted: new FormControl('N'),
      amount: new FormControl(0),
      amountchange: new FormControl(''),
      taxableamount: new FormControl(0),
      ddtranbranch: new FormControl(0),
      ddpaybranch: new FormControl(0),
      category_code: new FormControl(''),
      subcategory_code: new FormControl(''),
      branch: new FormControl(''),
      benificiary: new FormControl(''),
      bank: new FormControl(''),
      ifsccode: new FormControl(''),
      accno: new FormControl(''),
      credittotal: new FormControl(''),
      paymodetest_id: new FormControl(''),
      paymode_ids: new FormControl(''),
      crnindexx: new FormControl(''),
      ppxindexx: new FormControl('')
      // cdtind:new FormControl(0),
    })

    group.get('suppliertaxtype').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.gettdstaxtype(this.suppid,)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxlist = datas;
        this.linesChange.emit(this.InvoiceDetailForm.value['creditdtl']);
      })


    group.get('amountchange').valueChanges.pipe(
      debounceTime(20)
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

  public displayFnFilter(filterdata?: taxtypefilterValue): string | undefined {
    return filterdata ? filterdata.subtax_type : undefined;
  }
  get filterdata() {
    return this.InvoiceDetailForm.get('suppliertaxtype');
  }
  calcreditamount: any
  amountReduction() {
    let dataForm = this.InvoiceDetailForm?.value?.creditdtl
    if (this.ecftypeid != 7) {
      for (let data in dataForm) {
        if (data == "0") {
          if (this.getcreditindex == 1) {
            if (dataForm[this.getcreditindex]?.amountchange == "") {
              this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(this.totalamount - dataForm[this.getcreditindex]?.amountchange)
            } else {
              this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(((Number(dataForm[data]?.amount) + dataForm[this.getcreditindex]?.amount) - dataForm[this.getcreditindex]?.amountchange).toFixed(2))
            }
          } else {
            if ((((Number(dataForm[data]?.amount) + dataForm[this.getcreditindex]?.amount) - dataForm[this.getcreditindex]?.amountchange)) < 0) {
              this.notification.showError("Please Check Overall Credit Amount");
              this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditrefno').setValue("")
              this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('creditglno').setValue("")
              this.InvoiceDetailForm.get('creditdtl')['controls'][this.getcreditindex].get('amountchange').setValue("")
              return false;
            }
            this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(((Number(dataForm[data]?.amount) + dataForm[this.getcreditindex]?.amount) - dataForm[this.getcreditindex]?.amountchange).toFixed(2))

          }


          // else {
          //   this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(dataForm[data]?.amount - dataForm[this.getcreditindex]?.amountchange)
          // }
        }
        if (data == this.getcreditindex) {
          this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(dataForm[this.getcreditindex]?.amountchange)

        }
      }
    }
    // else {
    //   for (let data in dataForm) {
    //     if (data == this.getcreditindex) {
    //       this.InvoiceDetailForm.get('creditdtl')['controls'][data].get('amount').setValue(Number(dataForm[this.getcreditindex]?.amount)+Number(dataForm[this.getcreditindex]?.amountchange))

    //     }

    //   }
    // }
    this.creditdatasums()
  }

  getotadjustamount(e, index) {
    let datas = e.target.value
    let ddetails = this.InvoiceDetailForm?.value?.creditdtl

    if (datas >= 1) {
      this.notification.showError("Amount should not exceed One Rupee");
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(0);
      return false
    } else if (datas <= -1) {
      this.notification.showError("Please Enter Valid Amount")
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(0);
      return false
    } else if (datas == "") {
      let outamt = Number(ddetails[index].amount) + Number(this.InvoiceDetailForm?.value?.roundoffamt)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amount').setValue(outamt);
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amountchange').setValue(0);
    }
    else {

      let outamt = Number(ddetails[index].amount) + Number(datas)
      // console.log("outamt",outamt)
      this.InvoiceDetailForm.get('creditdtl')['controls'][index].get('amount').setValue(outamt)
    }
    this.creditdatasums()


  }

  cdtamt: any
  cdtsum: any
  ppxarray: any[] = []
  crnarray: any[] = []
  creditdatasums() {
    this.cdtamt = this.InvoiceDetailForm.value['creditdtl'].map(x => Number(x.amount));
    if (this.ecftypeid != 7) {
      this.cdtsum = this.cdtamt.reduce((a, b) => a + b, 0);
    } else {
      let sum = this.cdtamt.reduce((a, b) => a + b, 0);
      this.cdtsum = sum + Number(this.InvoiceDetailForm?.value?.roundoffamt)
    }
  }
  CreditData: any
  creditid: any
  categoryid: any
  subcategoryid: any
  submitcredit() {
    let showresult: boolean
    this.SpinnerService.show()
    const creditdtlsdatas = this.InvoiceDetailForm?.value?.creditdtl
    // console.log("creditdtlsdatas",creditdtlsdatas)
    if (this.cdtsum > this.totalamount || this.cdtsum < this.totalamount) {
      this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
      this.SpinnerService.hide()
      return false
    }

    for (let i in creditdtlsdatas) {
      if (this.ecftypeid == 7) {
        if (creditdtlsdatas[i].paymode_id == "") {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i].paymodetest_id
        } else {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i].paymode_id
        }
      }
      //  console.log("creditdtlsdatas",creditdtlsdatas)
      if (creditdtlsdatas[i]?.paymode_id === '' || creditdtlsdatas[i]?.paymode_id === null || creditdtlsdatas[i]?.paymode_id === undefined) {
        this.toastr.error('Please Choose Paymode')
        this.SpinnerService.hide()
        return false
      }
      if (creditdtlsdatas[i]?.id === "" || creditdtlsdatas[i]?.id === null) {
        delete creditdtlsdatas[i].id
      }


      if (creditdtlsdatas[i]?.paymode_id?.code === 'PM002' || creditdtlsdatas[i]?.paymode_id?.code === 'PM006' || creditdtlsdatas[i]?.paymode_id?.code === "PM010") {
        if (creditdtlsdatas[i]?.paymode_id?.code === 'PM006' || creditdtlsdatas[i]?.paymode_id?.code === 'PM010') {
          if (creditdtlsdatas[i]?.creditrefno == null || creditdtlsdatas[i]?.creditrefno == "" || creditdtlsdatas[i]?.creditrefno == undefined) {
            this.notification.showError("Refno Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (creditdtlsdatas[i]?.amount == null || creditdtlsdatas[i]?.amount == "" || creditdtlsdatas[i]?.amount == undefined || Number(creditdtlsdatas[i]?.amount) <= 0) {
            this.notification.showError("Amount cannot be less than Zero.")
            this.SpinnerService.hide()
            return false
          }
        }
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        if (this.ecftypeid == 7) {
          if (typeof (creditdtlsdatas[i].category_code) == 'object') {
            creditdtlsdatas[i].category_code = creditdtlsdatas[i]?.category_code?.code
          } else if (typeof (creditdtlsdatas[i].category_code) == 'string') {
            creditdtlsdatas[i].category_code = creditdtlsdatas[i].category_code
          } else {
            creditdtlsdatas[i].category_code = ""
          }
          if (typeof (creditdtlsdatas[i].subcategory_code) == 'object') {
            creditdtlsdatas[i].subcategory_code = creditdtlsdatas[i]?.subcategory_code?.code
          } else if (typeof (creditdtlsdatas[i].subcategory_code) == 'string') {
            creditdtlsdatas[i].subcategory_code = creditdtlsdatas[i].subcategory_code
          } else {
            creditdtlsdatas[i].subcategory_code = ""
          }
        } else {
          creditdtlsdatas[i].category_code = this.categoryid
          creditdtlsdatas[i].subcategory_code = this.subcategoryid
        }
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
        if (typeof (creditdtlsdatas[i]?.paymode_id) == 'object') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id?.id
        } else if (typeof (creditdtlsdatas[i]?.paymode_id) == 'number') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id
        } else {
          this.notification.showError("Please Choose Paymode");
          this.SpinnerService.hide();
          return false;
        }
      }

      if (creditdtlsdatas[i]?.paymode_id?.code === 'PM008') {

        if (creditdtlsdatas[i]?.creditrefno == null || creditdtlsdatas[i]?.creditrefno == "" || creditdtlsdatas[i]?.creditrefno == undefined) {
          this.notification.showError("Refno Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.amount == null || creditdtlsdatas[i]?.amount == "" || creditdtlsdatas[i]?.amount == undefined || Number(creditdtlsdatas[i]?.amount) <= 0) {
          this.notification.showError("Amount cannot be less than Zero.")
          this.SpinnerService.hide()
          return false
        }

        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        if (this.ecftypeid == 7) {
          if (typeof (creditdtlsdatas[i].category_code) == 'object') {
            creditdtlsdatas[i].category_code = creditdtlsdatas[i]?.category_code?.code
          } else if (typeof (creditdtlsdatas[i].category_code) == 'string') {
            creditdtlsdatas[i].category_code = creditdtlsdatas[i].category_code
          } else {
            creditdtlsdatas[i].category_code = ""
          }
          if (typeof (creditdtlsdatas[i].subcategory_code) == 'object') {
            creditdtlsdatas[i].subcategory_code = creditdtlsdatas[i]?.subcategory_code?.code
          } else if (typeof (creditdtlsdatas[i].subcategory_code) == 'string') {
            creditdtlsdatas[i].subcategory_code = creditdtlsdatas[i].subcategory_code
          } else {
            creditdtlsdatas[i].subcategory_code = ""
          }
        } else {
          creditdtlsdatas[i].category_code = this.categoryid
          creditdtlsdatas[i].subcategory_code = this.subcategoryid
        }
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
        creditdtlsdatas[i].creditglno = 0
        if (typeof (creditdtlsdatas[i]?.paymode_id) == 'object') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id?.id
        } else if (typeof (creditdtlsdatas[i]?.paymode_id) == 'number') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id
        } else {
          this.notification.showError("Please Choose Paymode");
          this.SpinnerService.hide();
          return false;
        }
      }

      if (creditdtlsdatas[i]?.paymode_id?.code === 'PM011') {

        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        if (typeof (creditdtlsdatas[i].category_code) == 'object') {
          creditdtlsdatas[i].category_code = creditdtlsdatas[i]?.category_code?.code
        } else if (typeof (creditdtlsdatas[i].category_code) == 'string') {
          creditdtlsdatas[i].category_code = creditdtlsdatas[i].category_code
        } else {
          this.notification.showError("Please Choose Category in the Popup Window")
          this.SpinnerService.hide()
          return false;
        }
        if (typeof (creditdtlsdatas[i].subcategory_code) == 'object') {
          creditdtlsdatas[i].subcategory_code = creditdtlsdatas[i]?.subcategory_code?.code
        } else if (typeof (creditdtlsdatas[i].subcategory_code) == 'string') {
          creditdtlsdatas[i].subcategory_code = creditdtlsdatas[i].subcategory_code
        } else {
          this.notification.showError("Please Choose Sub Category in the Popup Window")
          this.SpinnerService.hide()
          return false;
        }
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
        if (typeof (creditdtlsdatas[i]?.paymode_id) == 'object') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id?.id
        } else if (typeof (creditdtlsdatas[i]?.paymode_id) == 'number') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id
        } else {
          this.notification.showError("Please Choose Paymode");
          this.SpinnerService.hide();
          return false;
        }
      }


      if (creditdtlsdatas[i]?.paymode_id?.code === 'PM003') {

        if (creditdtlsdatas[i]?.creditrefno == "" || creditdtlsdatas[i]?.creditrefno == null || creditdtlsdatas[i]?.creditrefno == undefined) {
          this.notification.showError("Refno Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.bank == "" || creditdtlsdatas[i]?.bank == null || creditdtlsdatas[i]?.bank == undefined) {
          this.notification.showError("Bank Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.branch == "" || creditdtlsdatas[i]?.branch == null || creditdtlsdatas[i]?.branch == undefined) {
          this.notification.showError("Branch Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.benificiary == "" || creditdtlsdatas[i]?.benificiary == null || creditdtlsdatas[i]?.benificiary == undefined) {
          this.notification.showError("Benificiary Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.ifsccode == "" || creditdtlsdatas[i]?.ifsccode == null || creditdtlsdatas[i]?.ifsccode == undefined) {
          this.notification.showError("IFSC Code Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
        creditdtlsdatas[i].creditglno = 0
        if (typeof (creditdtlsdatas[i].paymode_id) == 'object') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id?.id
        } else if (typeof (creditdtlsdatas[i].paymode_id) == 'number') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id
        } else {
          this.notification.showError("Please Choose Paymode");
          this.SpinnerService.hide();
          return false;
        }
      }

      if (creditdtlsdatas[i]?.paymode_id?.code === 'PM004' || creditdtlsdatas[i]?.paymode_id?.code == 'PM001') {
        if (creditdtlsdatas[i]?.paymode_id?.code === 'PM004') {
          if (creditdtlsdatas[i]?.creditrefno == "" || creditdtlsdatas[i]?.creditrefno == null || creditdtlsdatas[i]?.creditrefno == undefined) {
            this.notification.showError("Refno Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (creditdtlsdatas[i]?.bank == "" || creditdtlsdatas[i]?.bank == null || creditdtlsdatas[i]?.bank == undefined) {
            this.notification.showError("Bank Name Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (creditdtlsdatas[i]?.branch == "" || creditdtlsdatas[i]?.branch == null || creditdtlsdatas[i]?.branch == undefined) {
            this.notification.showError("Branch Name Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (creditdtlsdatas[i]?.benificiary == "" || creditdtlsdatas[i]?.benificiary == null || creditdtlsdatas[i]?.benificiary == undefined) {
            this.notification.showError("Benificiary Name Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (creditdtlsdatas[i]?.ifsccode == "" || creditdtlsdatas[i]?.ifsccode == null || creditdtlsdatas[i]?.ifsccode == undefined) {
            this.notification.showError("IFSC Code Cannot Be Empty")
            this.SpinnerService.hide()
            return false
          }
          if (Number(creditdtlsdatas[i]?.amount) < 0) {
            this.notification.showError("Amount cannot be less than Zero.")
            this.SpinnerService.hide()
            return false
          }
        }

        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        if (creditdtlsdatas[i]?.paymode_id?.code == 'PM001') {
          creditdtlsdatas[i].category_code = this.categoryid
          creditdtlsdatas[i].subcategory_code = this.subcategoryid
          creditdtlsdatas[i].creditglno = 0
        }
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
        if (typeof (creditdtlsdatas[i].paymode_id) == 'object') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id?.id
        } else if (typeof (creditdtlsdatas[i].paymode_id) == 'number') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id
        } else {
          this.notification.showError("Please Choose Paymode");
          this.SpinnerService.hide();
          return false;
        }
      }


      if (creditdtlsdatas[i]?.paymode_id?.code === 'PM005') {
        if (creditdtlsdatas[i]?.creditbank_id == "" || creditdtlsdatas[i]?.creditbank_id == null || creditdtlsdatas[i]?.creditbank_id == undefined) {
          this.notification.showError("Account Detail Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.creditrefno == "" || creditdtlsdatas[i]?.creditrefno == null || creditdtlsdatas[i]?.creditrefno == undefined) {
          this.notification.showError("Refno Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.bank == "" || creditdtlsdatas[i]?.bank == null || creditdtlsdatas[i]?.bank == undefined) {
          this.notification.showError("Bank Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.branch == "" || creditdtlsdatas[i]?.branch == null || creditdtlsdatas[i]?.branch == undefined) {
          this.notification.showError("Branch Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.benificiary == "" || creditdtlsdatas[i]?.benificiary == null || creditdtlsdatas[i]?.benificiary == undefined) {
          this.notification.showError("Benificiary Name Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (creditdtlsdatas[i]?.ifsccode == "" || creditdtlsdatas[i]?.ifsccode == null || creditdtlsdatas[i]?.ifsccode == undefined) {
          this.notification.showError("IFSC Code Cannot Be Empty")
          this.SpinnerService.hide()
          return false
        }
        if (Number(creditdtlsdatas[i]?.amount) < 0) {
          this.notification.showError("Amount cannot be less than Zero.")
          this.SpinnerService.hide()
          return false
        }
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = 0
        // creditdtlsdatas[i].category_code = this.categoryid
        // creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        // creditdtlsdatas[i].creditbank_id = this.creditids
        // creditdtlsdatas[i].creditglno = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = ""
        creditdtlsdatas[i].suppliertaxrate = 0
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
        if (typeof (creditdtlsdatas[i].paymode_id) == 'object') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id?.id
        } else if (typeof (creditdtlsdatas[i].paymode_id) == 'number') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id
        } else {
          this.notification.showError("Please Choose Paymode");
          this.SpinnerService.hide();
          return false;
        }


      }

      if (creditdtlsdatas[i]?.paymode_id?.code === 'PM007') {
        creditdtlsdatas[i].invoiceheader_id = this.invoiceheaderaddonid
        creditdtlsdatas[i].taxableamount = this.taxableamount
        creditdtlsdatas[i].category_code = this.categoryid
        creditdtlsdatas[i].subcategory_code = this.subcategoryid
        creditdtlsdatas[i].credittotal = this.cdtsum
        creditdtlsdatas[i].creditbank_id = 0
        creditdtlsdatas[i].creditglno = 0
        creditdtlsdatas[i].suppliertax_id = 0
        creditdtlsdatas[i].suppliertaxtype = this.taxratename
        creditdtlsdatas[i].suppliertaxrate = this.taxrate
        creditdtlsdatas[i].taxexcempted = "N"
        creditdtlsdatas[i].ddtranbranch = 0
        creditdtlsdatas[i].ddpaybranch = 0
        if (typeof (creditdtlsdatas[i].paymode_id) == 'object') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id?.id
        } else if (typeof (creditdtlsdatas[i].paymode_id) == 'number') {
          creditdtlsdatas[i].paymode_id = creditdtlsdatas[i]?.paymode_id
        } else {
          this.notification.showError("Please Choose Paymode");
          this.SpinnerService.hide();
          return false;
        }
      }
      delete creditdtlsdatas[i]?.amountchange
    }



    this.CreditData = this.InvoiceDetailForm?.value?.creditdtl
    if (this.ecfstatusid === 2) {
      this.ecfservice.createcreditmodification(this.CreditData)
        .subscribe(result => {
          if (result) {
            this.creditid = result?.credit

            let creditresult = result['credit']

            for (let i in creditresult) {
              if (creditresult[i]?.id == undefined) {
                showresult = false
                this.notification.showError(creditresult[i]?.description)
                this.SpinnerService.hide()
                return false
              } else {
                showresult = true
              }
            }


            if (showresult == true) {
              this.notification.showSuccess("Successfully Credit Details Saved!...")
              this.SpinnerService.hide()
              let data = this.InvoiceDetailForm?.value?.creditdtl
              for (let i in data) {
                data[i].id = result?.credit[i]?.id
              }
              this.discreditbtn = true
              this.readcreditdata = true
              if (this.popupshow) {
                let ppx = data.filter(x => x.paymode_ids?.code == "PM006")
                if (ppx.length > 0) {
                  let ecfid: any
                  if (this.ecfheaderid != undefined) {
                    ecfid = this.ecfheaderid
                  } else {
                    ecfid = this.ecfheaderidd
                  }

                  for (let ind in this.selectedppxdata) {


                    let value = {
                      "apppxheader_id": this.selectedppxdata[ind]?.apppxheader_id,
                      "apinvoiceheader_id": this.selectedppxdata[ind]?.apinvoiceheader_id,
                      "apcredit_id": this.selectedppxdata[ind]?.credit_id,
                      "ppxdetails_amount": Number(this.selectedppxdata[ind]?.ppxheader_amount),
                      "ppxdetails_adjusted": Number(this.selectedppxdata[ind]?.liquidate_amt),
                      "ppxdetails_balance": Number(this.selectedppxdata[ind]?.ppxheader_amount) - Number(this.selectedppxdata[ind]?.liquidate_amt),
                      "ecf_amount": Number(this.selectedppxdata[ind]?.liquidate_amt),
                      "ecfheader_id": ecfid,
                      "process_amount": this.selectedppxdata[ind]?.process_amount
                    }


                    this.ppxarray.push(value)
                  }

                  let ppxdatas = { "ppxdetails": this.ppxarray }
                  this.ecfservices.ppxadvancecreate(ppxdatas).subscribe(result => {
                    let data = result
                  })
                }
              }
              if (this.popupshowcrn) {
                let crn = data.filter(x => x.paymode_ids?.code == "PM010")
                if (crn.length > 0) {
                  let ecfid: any
                  if (this.ecfheaderid != undefined) {
                    ecfid = this.ecfheaderid
                  } else {
                    ecfid = this.ecfheaderidd
                  }

                  for (let ind in this.selectedcrndata) {


                    let value = {
                      "apppxheader_id": this.selectedcrndata[ind]?.apppxheader_id,
                      "apinvoiceheader_id": this.selectedcrndata[ind]?.apinvoiceheader_id,
                      "apcredit_id": this.selectedcrndata[ind]?.credit_id,
                      "ppxdetails_amount": Number(this.selectedcrndata[ind]?.ppxheader_amount),
                      "ppxdetails_adjusted": Number(this.selectedcrndata[ind]?.liquidate_amt),
                      "ppxdetails_balance": Number(this.selectedcrndata[ind]?.ppxheader_amount) - Number(this.selectedcrndata[ind]?.liquidate_amt),
                      "ecf_amount": Number(this.selectedcrndata[ind]?.liquidate_amt),
                      "ecfheader_id": ecfid,
                      "process_amount": this.selectedcrndata[ind]?.process_amount,
                      "type": 2
                    }


                    this.crnarray.push(value)
                  }

                  let crndatas = { "ppxdetails": this.crnarray }
                  this.ecfservices.ppxadvancecreate(crndatas).subscribe(result => {
                    let data = result
                  })
                }
              }


            }
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    } else {
      this.ecfservice.CreditDetailsSumbit(this.CreditData)
        .subscribe(result => {
          this.creditid = result?.credit
          let creditresult = result['credit']

          for (let i in creditresult) {
            if (creditresult[i]?.id == undefined) {
              showresult = false
              this.notification.showError(creditresult[i]?.description)
              this.SpinnerService.hide()
              return false
            } else {
              showresult = true
            }
          }


          if (showresult == true) {
            this.notification.showSuccess("Successfully Credit Details Saved!...")
            this.SpinnerService.hide()
            this.discreditbtn = true
            this.readcreditdata = true

            let data = this.InvoiceDetailForm?.value?.creditdtl
            for (let i in data) {
              data[i].id = result?.credit[i]?.id
            }
            if (this.popupshow) {
              let ppx = data.filter(x => x.paymode_ids?.code == "PM006")
              if (ppx.length > 0) {
                let ecfid: any
                if (this.ecfheaderid != undefined) {
                  ecfid = this.ecfheaderid
                } else {
                  ecfid = this.ecfheaderidd
                }


                for (let ind in this.selectedppxdata) {
                  let value = {
                    "apppxheader_id": this.selectedppxdata[ind]?.apppxheader_id,
                    "apinvoiceheader_id": this.selectedppxdata[ind]?.apinvoiceheader_id,
                    "apcredit_id": this.selectedppxdata[ind]?.credit_id,
                    "ppxdetails_amount": this.selectedppxdata[ind]?.ppxheader_amount,
                    "ppxdetails_adjusted": this.selectedppxdata[ind]?.liquidate_amt,
                    "ppxdetails_balance": Number(this.selectedppxdata[ind]?.ppxheader_amount) - Number(this.selectedppxdata[ind]?.liquidate_amt),
                    "ecf_amount": this.selectedppxdata[ind]?.liquidate_amt,
                    "ecfheader_id": ecfid,
                    "process_amount": this.selectedppxdata[ind]?.process_amount
                  }
                  this.ppxarray.push(value)
                }

                let ppxdatas = { "ppxdetails": this.ppxarray }
                this.ecfservices.ppxadvancecreate(ppxdatas).subscribe(result => {
                  let data = result
                })
              }
            }
            if (this.popupshowcrn) {
              let crn = data.filter(x => x.paymode_ids?.code == "PM010")
              if (crn.length > 0) {
                let ecfid: any
                if (this.ecfheaderid != undefined) {
                  ecfid = this.ecfheaderid
                } else {
                  ecfid = this.ecfheaderidd
                }

                for (let ind in this.selectedcrndata) {


                  let value = {
                    "apppxheader_id": this.selectedcrndata[ind]?.apppxheader_id,
                    "apinvoiceheader_id": this.selectedcrndata[ind]?.apinvoiceheader_id,
                    "apcredit_id": this.selectedcrndata[ind]?.credit_id,
                    "ppxdetails_amount": this.selectedcrndata[ind]?.ppxheader_amount,
                    "ppxdetails_adjusted": this.selectedcrndata[ind]?.liquidate_amt,
                    "ppxdetails_balance": Number(this.selectedcrndata[ind]?.ppxheader_amount) - Number(this.selectedcrndata[ind]?.liquidate_amt),
                    "ecf_amount": this.selectedcrndata[ind]?.liquidate_amt,
                    "ecfheader_id": ecfid,
                    "process_amount": this.selectedcrndata[ind]?.process_amount,
                    "type": 2
                  }


                  this.crnarray.push(value)
                }

                let crndatas = { "ppxdetails": this.crnarray }
                this.ecfservices.ppxadvancecreate(crndatas).subscribe(result => {
                  let data = result
                })
              }
            }

          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )
    }

  }

  gobacks() {
    this.showheaderdata = true
    this.showinvocedetail = false
    let invdtldatas = this.InvoiceDetailForm.get('invoicedtl') as FormArray
    invdtldatas.clear()
    let crdtdtldatas = this.InvoiceDetailForm.get('creditdtl') as FormArray
    crdtdtldatas.clear()
  }
  delcreditid: any

  deletecreditdetail(section, ind) {

    let id = section.value.id
    if (id != undefined) {
      this.delcreditid = id
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        this.SpinnerService.show();
        let payid = section?.value?.paymode_ids?.code
        this.ecfservice.creditdelete(this.delcreditid)
          .subscribe(result => {
            this.SpinnerService.hide();
            if (result?.status == "success") {
              this.notification.showSuccess("Deleted Successfully");
              let credit = this.InvoiceDetailForm?.value?.creditdtl
              this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(Number(credit[0]?.amount) + Number(credit[ind]?.amount))
              this.removecreditSection(ind)
              if (payid == "PM006" || payid == "PM010") {
                let ecfid: any
                if (this.ecfheaderid != undefined) {
                  ecfid = this.ecfheaderid
                } else {
                  ecfid = this.ecfheaderidd
                }
                this.ecfservices.ppxdelete(ecfid)
                  .subscribe(result => {
                    if (result.status != "success") {
                      this.notification.showError(result?.description)
                    }
                  })
              }
              if (this.InvoiceDetailForm?.value?.creditdtl?.length === 0) {
                this.accdata = ''
                this.eraaccdata = ''
                this.addcreditSection()
              }
            } else {
              this.notification.showError(result?.description)
              return false
            }


          })
      } else {
        return false;
      }
    } else {
      let credit = this.InvoiceDetailForm?.value?.creditdtl
      this.InvoiceDetailForm.get('creditdtl')['controls'][0].get('amount').setValue(Number(credit[0]?.amount) + Number(credit[ind]?.amount))
      this.removecreditSection(ind)
      if (this.InvoiceDetailForm?.value?.creditdtl?.length === 0) {
        this.accdata = ''
        this.eraaccdata = ''
        this.addcreditSection()

      }
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
    this.accdata = ''
    // if (this.ecftypeid == 4) {
    //   let dbtrecord = this.DebitDetailForm?.value?.debitdtl
    //   for (let i = 0; i < dbtrecord?.length; i++) {
    //     this.DebitDetailForm.get('debitdtl')['controls'][i].get('category_code').setValue(this.defcat)
    //     this.DebitDetailForm.get('debitdtl')['controls'][i].get('subcategory_code').setValue(this.defsubcat)
    //     this.DebitDetailForm.get('debitdtl')['controls'][i].get('debitglno').setValue(this.defsubcat?.glno)
    //   }
    // }
  }

  adddsplit() {
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.push(this.debitdetail());
  }

  removedebitSection(i) {
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.removeAt(i);
    this.debitdatasums()
  }

  debitaddindex: any
  addondebitindex(index) {
    this.debitaddindex = index
  }

  debitdetail() {
    let group = new FormGroup({
      id: new FormControl(),
      invoiceheader_id: new FormControl(),
      invoicedetail_id: new FormControl(),
      category_code: new FormControl(''),
      subcategory_code: new FormControl(''),
      debitglno: new FormControl(''),
      bsproduct: new FormControl(''),
      amount: new FormControl(0.0),
      debittotal: new FormControl(),
      deductionamount: new FormControl(0),
      cc: new FormControl(),
      bs: new FormControl(),
      ccbspercentage: new FormControl(100),
      ccbspercentages: new FormControl(100),
      remarks: new FormControl(''),
      ccbsdtl: new FormGroup({
        cc_code: new FormControl(''),
        bs_code: new FormControl(''),
        code: new FormControl(''),
        glno: new FormControl(''),
        ccbspercentage: new FormControl(100),
        amount: new FormControl(this.invdtltotamount),
        remarks: new FormControl(),
      })
    })

    group.get('ccbspercentage').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcTotaldebit(this.debitaddindex)
      if (!this.DebitDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    }
    )

    group.get('amount').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {

      this.calcdebitamount(group)
      if (!this.DebitDetailForm.valid) {
        return;
      }
      this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    }
    )

    // group.get('deductionamount').valueChanges.pipe(
    //   debounceTime(20)
    // ).subscribe(value => {

    //   this.calcotheramount(this.debitaddindex)
    //   if (!this.DebitDetailForm.valid) {
    //     return;
    //   }
    //   this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    // }
    // )


    group.get('category_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getcategoryscroll(value, 1)
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
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })

    group.get('subcategory_code').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getsubcategoryscroll(this.catid, value, 1)
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
    let bskeyvalue: String = "";
    this.getbs(bskeyvalue);
    group.get('bs').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getbsscroll(value, 1)
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
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })

    group.get('cc').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.ecfservice.getccscroll(this.bssid, value, 1)
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
        this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
      })

    // group.get('bsproduct').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.ecfservice.getbusinessproductscroll(value, 1)
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
    //     this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
    //   })
    return group
  }

  addbsproduct(data, i: number) {

    let dbtvalues = this.DebitDetailForm.value.debitdtl
    for (let j = 0; j < dbtvalues.length; j++) {
      this.DebitDetailForm.get('debitdtl')['controls'][j].get('bsproduct').setValue(data)

    }
  }
  getpercent(i) {

    // console.log("e------>",e)
    let dbtdtl = this.DebitDetailForm?.value?.debitdtl

    let cal: number = 0

    for (let ind in dbtdtl) {
      let ind_num: number = Number(ind)
      if (ind_num == 0) {
        dbtdtl[ind_num].ccbspercentage = 100
      } else {
        cal += dbtdtl[ind_num].ccbspercentage

      }
    }
    cal = dbtdtl[0].ccbspercentage - cal
    this.DebitDetailForm.get('debitdtl')['controls'][0].get('ccbspercentage').setValue(cal)
    // console.log("cal1", cal)
    // console.log("e2------>",data)
  }

  calculatepercent(i, dataa) {


    if (Number(dataa.value.ccbspercentage) > 100) {
      this.notification.showWarning("Percentage Should not exceed 100");
      this.DebitDetailForm.get('debitdtl')['controls'][i].get('ccbspercentage').setValue(0);
      return false;
    }

    let debitlist: any[] = []
    debitlist = this.DebitDetailForm.value.debitdtl

    // let x:number = Number(debitlist[0].ccbspercentage)
    let x: number = 100
    let yisfalse = false
    debitlist.forEach((element, ind) => {
      if (ind != 0) {
        x -= Number(element.ccbspercentage)


      }
      // if(x < 0){
      // this.DebitDetailForm.get('debitdtl')['controls'][ind].get('ccbspercentage').setValue(null);
      // yisfalse = true
      // }

    })
    !yisfalse ? this.DebitDetailForm.get('debitdtl')['controls'][0].get('ccbspercentages').setValue(x) : this.DebitDetailForm.get('debitdtl')['controls'][0].get('ccbspercentages').setValue(100);
    this.getamt()
    return true
  }

  getamt() {
    let dbt = this.DebitDetailForm.value.debitdtl

    dbt.forEach((element, index) => {
      let num1: number = 0
      if (index == 0) {

        let amt = this.invdtltaxableamount
        num1 = (amt * Number(element.ccbspercentages) / 100) + this.invdtltaxamount
      } else {
        var amt = this.invdtltaxableamount;
        num1 = (amt * Number(element.ccbspercentage) / 100)
      }
      //  let num1 = (amt * Number(element.ccbspercentage) / 100)
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(num1)
    })
  }

  calamount: any
  subamount: any
  calcTotaldebit(index) {
    if (index != undefined) {
      if (this.ecftypeid != 7) {
        let dataOnDetails = this.DebitDetailForm?.value?.debitdtl
        let percent: any = +dataOnDetails[index]?.ccbspercentage
        this.calamount = (this.invdtltaxableamount * percent / 100)
        this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(this.calamount)
        this.debitdatasums()
      }
    }
    // else{
    // let dataOnDetails = this.DebitDetailForm?.value?.debitdtl
    // let percent: any = +dataOnDetails[index].ccbspercentage
    // this.calamount = (this.invdtltaxableamount * percent / 100)
    // let amount =  this.DebitDetailForm?.value?.debitdtl[0].amount-this.calamount
    // this.DebitDetailForm.get('debitdtl')['controls'][0].get('amount').setValue(amount)
    // this.DebitDetailForm.get('debitdtl')['controls'][0].get('ccbspercentages').setValue(this.DebitDetailForm?.value?.debitdtl[0]?.ccbspercentage - percent)
    // this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(this.calamount)
    // this.debitdatasums()
    // }
    // else{
    //   let dataOnDetails = this.DebitDetailForm?.value?.debitdtl
    // let percent: any = +dataOnDetails[index].ccbspercentage
    // this.calamount = (this.invdtltotamount * percent / 100)
    // this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(this.calamount)
    // this.debitdatasums()
    // }
  }
  otamount: any
  calcotheramount(index) {
    // if (this.ecftypeid != 7) {
    //   let dataOnDetails = this.DebitDetailForm?.value?.debitdtl
    //   let otamt: any = +dataOnDetails[index].deductionamount
    //   this.otamount = (otamt / this.invdtltaxableamount * 100)
    //   this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(otamt)
    //   this.DebitDetailForm.get('debitdtl')['controls'][index].get('ccbspercentage').setValue(this.otamount)
    //   this.debitdatasums()
    // } 
    // else {
    //   let dataOnDetails = this.DebitDetailForm?.value?.debitdtl
    //   console.log("dataOnDetails",dataOnDetails)
    //   let dbtamt:any = Number(+dataOnDetails[index].amount)
    //   let otamt: any = Number(+dataOnDetails[index].deductionamount)
    //   console.log("otamt",otamt)
    //   console.log("dbtamt",dbtamt)
    //   if(otamt != "" && otamt != "-" && otamt != "-0."){
    //   let outamt = Number(+dataOnDetails[index].amount)-otamt
    //   console.log("outamt",outamt)

    //   // this.otamount = (otamt / this.invdtltotamount * 100)
    //   this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(outamt)

    //   // this.DebitDetailForm.get('debitdtl')['controls'][index].get('ccbspercentage').setValue(this.otamount)
    //   this.debitdatasums()
    //   }
    // }
  }

  getadjustamount(e, index) {
    let datas = e.target.value
    if (datas >= 1) {
      this.notification.showError("Amount should not exceed One Rupee");
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('deductionamount').setValue(0);
      return false
    } else if (datas <= -1) {
      this.notification.showError("Please Enter Valid Amount")
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('deductionamount').setValue(0);
      return false
    } else {
      let ddetails = this.DebitDetailForm?.value?.debitdtl
      let outamt = Number(ddetails[index].amount) + Number(datas)
      // console.log("outamt",outamt)
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('amount').setValue(outamt)
    }
    this.debitdatasums()


  }

  calcdebitamount(group: FormGroup) {
    const amount = +group.controls['amount'].value;
    let amountvalue = Number(amount)
    group.controls['amount'].setValue((amountvalue), { emitEvent: false });
    this.debitdatasums()
  }

  calcdebiteditamount(amount: FormControl) {
    const amountt = amount.value
    let amountvalue = Number(amountt)
    amount.setValue((amountvalue), { emitEvent: false });
    this.debitdatasums()
  }

  dbtamt: any
  dbtsum: any
  debitsum: any
  debitdatasums() {
    this.dbtamt = this.DebitDetailForm.value['debitdtl'].map(x => Number((x.amount)));
    this.dbtsum = this.dbtamt.reduce((a, b) => (a + b), 0);
    this.debitsum = (this.dbtsum).toFixed(2)
  }
  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.name : undefined;
  }

  get cattype() {
    return this.DebitDetailForm.get('category_code');
  }
  public displaycrncatFn(crncattype?: catlistss): string | undefined {
    return crncattype ? crncattype.name : undefined;
  }

  get crncattype() {
    return this.crnglForm.get('category_code');
  }
  getcat(catkeyvalue) {
    this.ecfservice.getcat(catkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.categoryNameData = datas;
          this.catid = datas.id;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }


  cid(data) {
    this.catid = data['id'];
    this.getsubcat(this.catid, "");
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
                this.ecfservice.getcategoryscroll(this.categoryInput.nativeElement.value, this.currentpage + 1)
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


  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.code : undefined;
  }

  get subcategorytype() {
    return this.DebitDetailForm.get('subcategory_code');
  }

  public displaycrnsubcatFn(crnsubcategorytype?: subcatlistss): string | undefined {
    return crnsubcategorytype ? crnsubcategorytype.code : undefined;
  }

  get crnsubcategorytype() {
    return this.crnglForm.get('subcategory_code');
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
                this.ecfservice.getsubcategoryscroll(this.catid, this.subcategoryInput.nativeElement.value, this.currentpage + 1)
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
    this.SpinnerService.show()
    this.ecfservice.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.SpinnerService.hide();
          this.subcategoryNameData = datas;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  getGLNumber(data, index) {
    this.GLNumb = data.glno
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('debitglno').setValue(data?.glno)
  }

  getcrnGLNumber(data, index) {
    this.crnglForm.get('crnglArray')['controls'][index].get('debitglno').setValue(data?.glno)
  }

  public displayFnbp(producttype?: productcodelists): string | undefined {
    return producttype ? producttype.bsproduct_name : undefined;
  }

  get producttype() {
    return this.DebitDetailForm.get('bsproduct');
  }
  getbusinessproduct(businesskeyvalue) {
    // this.ecfservice.getbusinessproductdd(businesskeyvalue)
    //   .subscribe((results: any[]) => {
    //     if (results) {
    //       let datas = results["data"];
    //       this.businesslist = datas
    //     }
    //   }, error => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   }
    //   )
  }

  bpScroll() {
    setTimeout(() => {
      if (
        this.matproductAutocomplete &&
        this.matproductAutocomplete &&
        this.matproductAutocomplete.panel
      ) {
        fromEvent(this.matproductAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matproductAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matproductAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matproductAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matproductAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservice.getbsscroll(this.productInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.businesslist.length >= 0) {
                      this.businesslist = this.businesslist.concat(datas);
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

  public displaybsFn(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }

  get bstype() {
    return this.DebitDetailForm.get('bs');
  }
  getbs(bskeyvalue) {
    this.ecfservice.getbs(bskeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.bsNameData = datas;
          this.catid = datas.id;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
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
                this.ecfservice.getbsscroll(this.bsInput.nativeElement.value, this.currentpage + 1)
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
    let dbtvalues = this.DebitDetailForm.value.debitdtl
    this.bssid = data['id'];
    this.bsidd = code;
    for (let j = 0; j < dbtvalues.length; j++) {
      this.DebitDetailForm.get('debitdtl')['controls'][j].get('bs').setValue(data)

    }
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
    this.ecfservice.getcc(bssid, cckeyvalue)
      .subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.ccNameData = datas;
          this.ccid = datas.id;
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

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
                this.ecfservice.getccscroll(this.bssid, this.ccInput.nativeElement.value, this.currentpage + 1)
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
  back() {
    // this.OverallForm.reset();
    this.closebuttonss.nativeElement.click()
    // this.router.navigate(['ECF/inventory'])
  }
  moveback() {
    this.router.navigate(['ECF/invdetailcreate'])
  }
  ccidd: any
  cccodeid: any
  getccdata(ccdata, code, id) {
    let dbtvalues = this.DebitDetailForm.value.debitdtl
    this.ccidd = code
    this.cccodeid = id
    for (let j = 0; j < dbtvalues.length; j++) {
      this.DebitDetailForm.get('debitdtl')['controls'][j].get('cc').setValue(ccdata)
    }
  }
  Ddetails: any
  debitid: any
  remarkss: any
  debitform() {
    let showdebitresult: boolean
    this.SpinnerService.show()
    this.Ddetails = this.DebitDetailForm?.value?.debitdtl;
    const dbtdetaildata = this.DebitDetailForm?.value?.debitdtl;
    if (this.ecftypeid != 4 && this.ecftypeid != 7) {
      if (this.debitsum > this.invdtltotamount || this.debitsum < this.invdtltotamount) {
        this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
        this.SpinnerService.hide()
        return false
      }
    }
    if (this.ecftypeid == 4 || this.ecftypeid == 7) {
      if (this.debitsum > this.totalamount || this.debitsum < this.totalamount || this.debitsum == undefined) {
        this.toastr.error('Check Invoice Header Amount', 'Please Enter Valid Amount');
        this.SpinnerService.hide()
        return false
      }
    }
    for (let i in dbtdetaildata) {
      if (this.ecftypeid == 7) {
        dbtdetaildata[0].ccbspercentage = dbtdetaildata[0]?.ccbspercentages
      }

      if ((dbtdetaildata[i]?.category_code == '') || (dbtdetaildata[i]?.category_code == null)) {
        this.toastr.error('Please Choose Category');
        this.SpinnerService.hide()
        return false;
      }
      if ((dbtdetaildata[i]?.subcategory_code == '') || (dbtdetaildata[i]?.subcategory_code == null)) {
        this.toastr.error('Please Choose Sub Category');
        this.SpinnerService.hide()
        return false;
      }
      // if ((dbtdetaildata[i]?.bsproduct == '') || (dbtdetaildata[i]?.bsproduct == null)) {
      //   this.toastr.error('Please Choose Business Product Name');
      //   this.SpinnerService.hide()
      //   return false;
      // }
      if ((dbtdetaildata[i]?.bs == '') || (dbtdetaildata[i]?.bs == null)) {

        this.toastr.error('Please Choose bs');
        this.SpinnerService.hide()
        return false;
      }
      if ((dbtdetaildata[i]?.cc == '') || (dbtdetaildata[i]?.cc == null)) {
        this.toastr.error('Please Choose cc');
        this.SpinnerService.hide()
        return false;
      }
      if (dbtdetaildata[i]?.id === "" || dbtdetaildata[i]?.id === null) {
        delete dbtdetaildata[i]?.id
      }
      dbtdetaildata[i].invoiceheader_id = this.invoiceheaderaddonid
      if (this.ecftypeid == 4) {
        dbtdetaildata[i].invoicedetail_id = this.invdetailidforadvance
        dbtdetaildata[i].debittotal = Number(this.totalamount)
      } else {
        dbtdetaildata[i].invoicedetail_id = this.invdtladdonid
        dbtdetaildata[i].debittotal = Number(this.invdtltotamount)
      }
      if (typeof (dbtdetaildata[i]?.category_code) == 'object') {
        dbtdetaildata[i].category_code = dbtdetaildata[i]?.category_code?.code
      } else if (typeof (dbtdetaildata[i]?.category_code) == 'string') {
        dbtdetaildata[i].category_code = dbtdetaildata[i]?.category_code
      } else {
        dbtdetaildata[i].category_code = ""
      }
      if (typeof (dbtdetaildata[i]?.subcategory_code) == 'object') {
        dbtdetaildata[i].subcategory_code = dbtdetaildata[i]?.subcategory_code?.code
      } else if (typeof (dbtdetaildata[i]?.subcategory_code) == 'string') {
        dbtdetaildata[i].subcategory_code = dbtdetaildata[i]?.subcategory_code
      } else {
        dbtdetaildata[i].subcategory_code = ""
      }
      // if(typeof(dbtdetaildata[i]?.bsproduct)=='object'){
      // dbtdetaildata[i].bsproduct = dbtdetaildata[i]?.bsproduct?.id
      // }else if(typeof(dbtdetaildata[i]?.bsproduct)=='number'){
      //   dbtdetaildata[i].bsproduct = dbtdetaildata[i]?.bsproduct
      // }else{
      //   dbtdetaildata[i].bsproduct = ""
      // }
      this.categoryid = dbtdetaildata[i]?.category_code
      this.subcategoryid = dbtdetaildata[i]?.subcategory_code
      dbtdetaildata[i].deductionamount = dbtdetaildata[i].deductionamount
      this.ccidd = dbtdetaildata[i]?.cc?.code
      this.bsidd = dbtdetaildata[i]?.bs?.code
      let a = dbtdetaildata[i]?.ccbsdtl
      if (a.id === "") {
        delete a.id
      }
      if (typeof (dbtdetaildata[i]?.cc) == 'object') {
        a.cc_code = dbtdetaildata[i]?.cc?.code
      } else if (typeof (dbtdetaildata[i]?.cc) == 'string') {
        a.cc_code = dbtdetaildata[i]?.cc
      }
      // else{
      //   a.cc_code = ""
      // }
      if (typeof (dbtdetaildata[i]?.bs) == 'object') {
        a.bs_code = dbtdetaildata[i]?.bs?.code
      } else if (typeof (dbtdetaildata[i]?.bs) == 'string') {
        a.bs_code = dbtdetaildata[i]?.bs
      }
      // else{
      //   a.bs_code = ""
      // }
      a.code = dbtdetaildata[i]?.cc?.id
      a.glno = dbtdetaildata[i]?.debitglno
      a.amount = dbtdetaildata[i]?.amount
      a.remarks = dbtdetaildata[i]?.remarks
      a.ccbspercentage = dbtdetaildata[i]?.ccbspercentage
      a.debit = 0
      delete dbtdetaildata[i].cc
      delete dbtdetaildata[i].bs

    }


    this.Ddetails = this.DebitDetailForm?.value?.debitdtl;
    if (this.ecfstatusid === 2) {
      this.ecfservice.createdebitmodification(this.Ddetails)
        .subscribe(result => {
          let debitresults = result['debit']
          for (let i in debitresults) {
            if (debitresults[i]?.id == undefined) {
              showdebitresult = false
              this.notification.showError(debitresults[i]?.description)
              this.SpinnerService.hide()
              return false
            } else {
              showdebitresult = true
            }
          }
          if (showdebitresult == true) {
            this.notification.showSuccess("Successfully Debit Details Saved!...")
            this.SpinnerService.hide()
            if (this.ecftypeid == 4) {
              this.submitdebitdtlbtn = true
              this.readdata = true
            }
            this.debitid = result.debit
            let data = this.DebitDetailForm?.value?.debitdtl
            for (let i in data) {
              data[i].id = result?.debit[i]?.id
            }
            this.closebutton.nativeElement.click();

          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )

    } else {
      this.ecfservice.DebitdetailCreateForm(this.Ddetails)
        .subscribe(result => {
          let debitresults = result['debit']
          for (let i in debitresults) {
            if (debitresults[i]?.id == undefined) {
              showdebitresult = false
              this.notification.showError(debitresults[i]?.description)
              this.SpinnerService.hide()
              return false
            } else {
              showdebitresult = true
            }
          }
          if (showdebitresult == true) {
            this.notification.showSuccess("Successfully Debit Details Saved!...")
            this.SpinnerService.hide()
            if (this.ecftypeid == 4) {
              this.submitdebitdtlbtn = true
              this.readdata = true
            }
            this.debitid = result?.debit
            let data = this.DebitDetailForm?.value?.debitdtl
            for (let i in data) {
              data[i].id = result?.debit[i]?.id
            }
            this.closebutton.nativeElement.click();
          }
        }, error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        )
    }
  }


  deldebitid: any
  deletedebitdetail(section, ind) {
    let id = section.value.id

    if (id != undefined) {
      this.deldebitid = id
      var answer = window.confirm("Are you sure to delete?");
      if (answer) {
        this.SpinnerService.show()
        this.ecfservice.debitdelete(this.deldebitid)
          .subscribe(result => {
            this.SpinnerService.hide()
            if (result.status == "success") {
              this.notification.showSuccess("Deleted Successfully")
              this.removedebitSection(ind)
              if (this.DebitDetailForm?.value?.debitdtl?.length === 0) {
                this.adddebitSection()
              }
            } else {
              this.notification.showError(result?.description)
              return false
            }
          }, error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })

      }
      else {
        return false;
      }
    } else {
      this.removedebitSection(ind)
      if (this.DebitDetailForm?.value?.debitdtl?.length === 0) {
        this.adddebitSection()
      }
    }

  }


  debitbacks() {
    this.closebutton.nativeElement.click();
  }
  Rvalue: number = 0;
  Ovalue: number = 0;
  min: number = -1;
  max: number = 1;
  RoundingOFF(e) {
    if (e >= this.max) {
      this.InvoiceDetailForm.patchValue({ roundoffamt: 0 })
      this.toastr.warning("Amount should not exceed one rupee");
      return false
    }
    else if (e <= this.min) {
      this.InvoiceDetailForm.patchValue({ roundoffamt: 0 })
      this.toastr.warning("Please enter valid amount");
      return false
    }
    else if (e < this.max) {
      this.INVdatasums()
    }
    else if (e > this.min) {
      this.INVdatasums()
    }
  }
  otheradjustmentmaxamount: any;
  otheradjustmentminamount: any;
  OtherAdjustment(e) {
    let data = this.InvoiceHeaderForm?.value?.invoiceheader
    for (let i in data) {
      let invamt = Number(data[i].invoiceamount)
      let roundamt = Number(data[i].roundoffamt)
      let taxamt = Number(data[i].taxamount)
      this.otheradjustmentmaxamount = invamt + taxamt + roundamt
    }
    if (e >= this.otheradjustmentmaxamount) {
      this.InvoiceDetailForm.patchValue({ otheramount: 0 })
      this.toastr.warning("Other Adjustment Amount should not exceed Invoice Header Amount");
      return false
    }
    else {
      this.INVdatasums()
    }
  }
  icrAccno(index, section, frm: any = '') {
    // let accno = section?.value?.invoiceno

    let accno
    if (frm == '')
      accno = section?.value?.invoiceno
    else
      accno = this.frmInvHdrDet.controls['invoiceno'].value

    if (accno.length != 16) {
      this.notification.showWarning("Account No. should have 16 digits.")
      // this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceno').setValue('')
      if (frm == '')
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceno').setValue('')
      else
        this.frmInvHdrDet.controls['invoiceno'].setValue('')
    }
  }
  Taxvalue = 0
  headertaxableamount: any
  Taxamount(e, index) {
    let data = this.InvoiceHeaderForm?.value?.invoiceheader
    for (let i in data) {
      this.headertaxableamount = Number(data[i]?.invoiceamount)
    }
    if (e > this.headertaxableamount) {
      this.Taxvalue = 0
      this.toastr.warning("Tax Amount should not exceed taxable amount");
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('taxamount').setValue(0)
      return false
    }
  }

  taxableAmount(e, index, section, frm: any = '') {
    let invgst = frm == '' ? section.value.invoicegst : this.selectedTemp?.invoicegst
    let totamt = frm == '' ? section.value.totalamount : this.frmInvHdrDet.value?.totalamount
    if (this.ecftypeid == 13 && invgst == "N")
      return false
    console.log("ttamount", section.value)
    console.log("e.target.value", e)
    let invamount = Number(String(e).replace(/,/g, ''))
    let totamount = Number(String(totamt).replace(/,/g, ''))
    console.log("invamount", invamount)
    console.log("totamount", totamount)
    if (invamount > 0) {
      if (invamount > totamount) {
        this.notification.showWarning("Taxable Amount should not be greater than Invoice Amount")
        // this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceamount').setValue(0)
        if (frm == '')
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceamount').setValue(0)
        else
          this.frmInvHdrDet.controls['invoiceamount'].setValue(0)
        return false
      }
      if (invgst == "Y" && invamount == totamount) {
        this.notification.showWarning("Invoice Amount and Taxable Amount Should not be same for GST Applicable Yes")
        // this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceamount').setValue(0)
        if (frm == '')
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceamount').setValue(0)
        else
          this.frmInvHdrDet.controls['invoiceamount'].setValue(0)
        return false
      }
    }
  }
  taxableAmount1(index, section, frm: any = '') {
    let invgst = frm == '' ? section.value.invoicegst : this.selectedTemp?.invoicegst
    let totamt = frm == '' ? section.value.totalamount : this.frmInvHdrDet.value?.totalamount
    let invamt = frm == '' ? section.value.invoiceamount : this.frmInvHdrDet.value?.invoiceamount
    if (this.ecftypeid == 13 && invgst == "N")
      return false
    let invamount = Number(String(invamt).replace(/,/g, ''))
    let totamount = Number(String(totamt).replace(/,/g, ''))
    console.log("invamount", invamount)
    console.log("totamount", totamount)
    if (invgst == "N" && invamount != totamount) {
      this.notification.showWarning("Invoice amount and Taxable amount should be same ,if GST is not applicable")
      if (frm == '')
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceamount').setValue(0)
      else
        this.frmInvHdrDet.controls['invoiceamount'].setValue(0)

      return false
    }
  }
  invamount(index, section, frm: any = '') {
    let gstappl
    let invamount
    if (frm == '') {
      invamount = Number(String(section?.value?.totalamount).replace(/,/g, ''))
      gstappl = section?.value?.invoicegst
    }
    else {
      invamount = Number(String(section?.value).replace(/,/g, ''))
      gstappl = this.selectedTemp?.invoicegst
    }
    // let invamount = Number(String(section?.value?.totalamount).replace(/,/g, ''))
    // let taxableamount = Number(String(section?.value?.invoiceamount).replace(/,/g, ''))
    if (!invamount ||invamount <= 0) {
      this.notification.showWarning("Invoice amount should not be less than or equal to Zero")
      // this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('totalamount').setValue(0)
      if (frm == '')
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('totalamount').setValue(0)
      else
        this.frmInvHdrDet.controls['totalamount'].setValue(0)
    }
    else if (this.ecftypeid == 13 && gstappl == "N") {
      if (frm == '') {
        let amt = section?.value?.totalamount
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceamount').setValue(amt)
      }
      else {
        let amt = section?.value
        this.frmInvHdrDet.controls['invoiceamount'].setValue(amt)
      }
    }


  }
  numberOnlyandDotminus(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57) && ((charCode < 45 || charCode > 46))) {
      return false;
    }
    return true;
  }
  backform() {
    this.onCancel.emit()
  }

  removefrom_batch() {
    if (!window.confirm("Do You want to remove the ECF from Batch"))
      return false
    this.SpinnerService.show();
    let id
    if (this.ecfheaderidd != null && this.ecfheaderidd != undefined && this.ecfheaderidd != '')
      id = this.ecfheaderidd
    else
      id = this.ecfheaderid
    let data = [id]

    this.ecfservices.batch_ecf_remove(data)
      .subscribe(result => {
        this.SpinnerService.hide();

        if (result.status != "success") {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully Removed!...")
          this.onCancel.emit()
        }
      })

  }
  overallback() {
    this.onCancel.emit()
  }
  getsupplierindex(index, section) {
    this.invsupplierdataindex = index

    if (section?.value?.supplier_name == null || section?.value?.supplier_name == "") {
      this.resetsupplierform()
    } else {
      this.SupplierDetailForm.patchValue({
        supplier_name: section?.value?.supplier_name,
        pincode: section?.value?.pincode,
        suppliergst: section?.value?.suppliergst,
        invoiceno: section?.value?.invoiceno,
        invoicedate: section?.value?.invoicedate,
      })
    }
  }
  pettycashgsttype: any
  suppliersubmitForm() {
    let data = this.InvoiceDetailForm.value.invoicedtl

    if (this.SupplierDetailForm.value.supplier_name == "" || this.SupplierDetailForm.value.supplier_name == null || this.SupplierDetailForm.value.supplier_name == undefined) {
      this.notification.showError("Please Enter Supplier Name");
      return false;
    } else if (this.SupplierDetailForm.value.pincode == "" || this.SupplierDetailForm.value.pincode == null || this.SupplierDetailForm.value.pincode == undefined) {
      this.notification.showError("Please Enter Pincode");
      return false;
    }
    else if (this.SupplierDetailForm.value.suppliergst == "" || this.SupplierDetailForm.value.suppliergst == null || this.SupplierDetailForm.value.suppliergst == undefined) {
      this.notification.showError("Please Enter supplier Gst No");
      return false;
    } else if (this.SupplierDetailForm.value.invoiceno == "" || this.SupplierDetailForm.value.invoiceno == null || this.SupplierDetailForm.value.invoiceno == undefined) {
      this.notification.showError("Please Enter Invoice No");
      return false;
    } else if (this.SupplierDetailForm.value.invoicedate == "" || this.SupplierDetailForm.value.invoicedate == null || this.SupplierDetailForm.value.invoicedate == undefined) {
      this.notification.showError("Please Choose Date");
      return false;
    } else {
      if (this.SupplierDetailForm.valid) {

        this.InvoiceDetailForm.get('invoicedtl')['controls'][this.invsupplierdataindex].get('hsn').enable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][this.invsupplierdataindex].get('hsn_percentage').enable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][this.invsupplierdataindex].get('cgst').enable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][this.invsupplierdataindex].get('sgst').enable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][this.invsupplierdataindex].get('igst').enable()
        this.InvoiceDetailForm.get('invoicedtl')['controls'][this.invsupplierdataindex].get('invoiceno').setValue(this.SupplierDetailForm.value.invoiceno)
        this.InvoiceDetailForm.get('invoicedtl')['controls'][this.invsupplierdataindex].get('supplier_name').setValue(this.SupplierDetailForm.value.supplier_name)
        this.InvoiceDetailForm.get('invoicedtl')['controls'][this.invsupplierdataindex].get('pincode').setValue(this.SupplierDetailForm.value.pincode)
        this.InvoiceDetailForm.get('invoicedtl')['controls'][this.invsupplierdataindex].get('suppliergst').setValue(this.SupplierDetailForm.value.suppliergst)
        this.InvoiceDetailForm.get('invoicedtl')['controls'][this.invsupplierdataindex].get('invoicedate').setValue(this.SupplierDetailForm.value.invoicedate)
        this.ecfservices.GetpettycashGSTtype(this.SupplierDetailForm.value.suppliergst, this.raisergst)
          .subscribe(result => {
            this.type = result?.Gsttype

          })
      }
      this.closebuttons.nativeElement.click();
    }

    // if(data[this.invsupplierdataindex]?.supplier_name == null){
    //   this.resetsupplierform()
    // }

  }
  supplierbackform() {
    this.closebuttons.nativeElement.click();
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
  debitdtlid: any
  addsplit(index, data) {
    this.debitdtlid = data?.value?.id
    let ind = index + 1
    const control = <FormArray>this.DebitDetailForm.get('debitdtl');
    control.insert(ind, this.debitdetail())
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('category_code').setValue(data?.value?.category_code)
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('subcategory_code').setValue(data?.value?.subcategory_code)
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('debitglno').setValue(data?.value?.debitglno)
  }
  branchgstnumber: any
  Branchcallingfunction() {
    let prevsupid = this.InvoiceHeaderForm?.value?.invoiceheader[this.supplierindex].supplier_id

    if (this.InvoiceHeaderForm?.value?.invoiceheader[this.supplierindex]?.id != undefined && prevsupid != this.supplierid) {
      var answer = window.confirm("If you change the Supplier, all the details of this Invoice Header will be deleted. Do you want to continue? ");
      if (answer) {
        const header = this.InvoiceHeaderForm.value.invoiceheader
        this.SpinnerService.show()
        let invhdrLen
        if (this.SupplierTypeID == 1)
          invhdrLen = header.length
        else
          invhdrLen = 1

        if (this.ecftypeid == 2 || this.ecftypeid == 7 || this.ecftypeid == 14 || (this.ecftypeid == 4 && this.ppxid == 'S')) {

          for (let i = 0; i < invhdrLen; i++) {
            this.ecfservices.ecfdetailsDelete(this.InvoiceHeaderForm?.value?.invoiceheader[i]?.id)
              .subscribe(result => {
                this.SpinnerService.hide()

                if (result?.status != "success") {
                  this.notification.showError(result?.description)
                  return false
                }
                this.clearInvHdr(i)
              }, error => {
                this.errorHandler.handleError(error);
                this.SpinnerService.hide();
              })
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppname').setValue(this.SupplierName)
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppliergst').setValue(this.SupplierGSTNumber)
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppstate').setValue(this.statename)
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplierstate_id').setValue(this.stateid)
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplier_id').setValue(this.supplierid)
          }
        }

      }
    }
    else if (prevsupid != this.supplierid) {
      this.clearInvHdr(this.supplierindex)
    }

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

  clearInvHdr(i) {
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('id').reset()
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppname').setValue(this.SupplierName)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppliergst').setValue(this.SupplierGSTNumber)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplier_id').setValue(this.supplierid)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplierstate_id').setValue(this.stateid)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppstate').setValue(this.statename)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('branchdetails_id').setValue(this.branchdata)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('invoiceno').setValue('')
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('creditrefno').setValue('')
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('invoicedate').setValue('')
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('invoiceamount').reset(0)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('is_pca').setValue('');
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('pca_no').setValue('');
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('taxamount').setValue(0)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('totalamount').reset(0)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('invoicestatus').setValue('DRAFT')
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('remarks').reset()
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('filevalue').setValue([])
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('file_key').setValue([])
    // delete this.InvoiceHeaderForm.value.invoiceheader[i].filekey
    // delete this.InvoiceHeaderForm.value.invoiceheader[i].filedataas
    // this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('filekey').setValue({})
    // this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('filedataas').setValue({})

    let filekey = this.InvoiceHeaderForm?.value?.invoiceheader[i].filekey

    if (filekey.length > 0) {
      do {
        filekey.splice(0, 1)
      } while (filekey?.length > 0)
    }
    let filedataas = this.InvoiceHeaderForm?.value?.invoiceheader[i].filedataas
    if (filedataas.length > 0) {
      do {
        filedataas.splice(0, 1)
      }
      while (filedataas?.length > 0)
    }

    // for (let i = 0; i < filekey?.length; i++) {
    //   filekey.splice(i, 1)
    // }
    // let filedataas = this.InvoiceHeaderForm?.value?.invoiceheader[i].filedataas

    // for (let i = 0; i < filedataas?.length; i++) {
    //   filedataas.splice(i, 1)
    // }

  }

  showapprover(data) {
    this.approvid = data?.id
    this.showapproverforedit = false
    this.showapproverforcreate = true
  }
  filedatas: any=[]
  fileindex: any
  // getfiledetails(datas, ind) {
  //   console.log("ddataas", datas)
  //   this.fileindex = ind
  //   this.filedatas = datas.value['filekey']
  //   this.popupopen2()
  // }
  invhdrForm = ''
  getfiledetails(datas, ind, frm = '') {
    if (frm != '')
      // this.closeInvHdrDet.nativeElement.click()
      console.log("ddataas", datas)
    this.fileindex = ind
    // this.filedatas = datas.value['filekey']
    if (frm == 'frmInvHdrDet') {
      this.invhdrForm = frm
    }
    else {
      this.invhdrForm = frm
      this.filedatas = datas.value['filekey'] ? datas.value['filekey'] : []
    }
    this.previousattachfile_summary()
    this.popupopen2()
  }
  fileback() {
    // this.popupopen9();
    this.closesbuttons.nativeElement.click();

    if (this.invhdrForm != 'frmInvHdrDet')
      this.invHdrDetBack()
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
  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  jpgUrls: any
  pdfurl: any
  filepreview(files) {
    this.popupopen5();
    const stringValue = files.name.split('.');
    const extension = stringValue[stringValue.length - 1];

    if (["png", "jpeg", "jpg", "PNG", "JPEG", "JPG"].includes(extension)) {
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result;
        const newTab = window.open();
        newTab.document.write('<html><body><img style="width: 500px;" src="' + this.jpgUrls + '" "/></body></html>');
        newTab.document.close();
      };
    }

    if (["pdf", "PDF"].includes(extension)) {
      const reader: any = new FileReader();
      reader.onload = (_event) => {
        const fileData = reader.result;
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      };
      reader.readAsArrayBuffer(files);
    }

    if (["csv", "ods", "xlsx", "txt", "ODS", "XLSX", "TXT"].includes(extension)) {
      this.showimageHeaderPreview = false;
      this.showimageHeaderPreviewPDF = false;
    }

    // Add handling for `globalFiles` if needed
    const globalFile = this.globalFiles.find((file) => file.name === files.name);
    if (globalFile) {
      console.log("Previewing from globalFiles array:", globalFile);
    }
  }


  checkmultilevel() {
    let json = { "id": this.commodityid }

    this.ecfservices.findmultilevel(json)
      .subscribe(resultss => {
        let muldatas = resultss
        this.ismultilevel = muldatas?.is_multilevel

      })
  }
  filterText(ctrl, ctrlname) {
    let text = String(ctrl.value).trim();
    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i)
      let charcode = text.charCodeAt(i)
      if ((charcode < 65 || charcode > 90) && (charcode < 96 || charcode > 122) && (charcode < 48 || charcode > 57) && (charcode != 32)) {
        text = text.replace(char, "");
        i = i - 1
      }
    }

    if (ctrlname == "remarks") {
      this.ecfheaderForm.get('purpose').setValue(text)
    }

  }

  filterAmount(ctrl, ctrlname) {
    let text = String(ctrl.value).trim();
    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i)
      let charcode = text.charCodeAt(i)
      if ((charcode < 65 || charcode > 90) && (charcode < 96 || charcode > 122) && (charcode < 48 || charcode > 57) && (charcode != 32) && (charcode != 46)) {
        text = text.replace(char, "");
        i = i - 1
      }
    }

    if (ctrlname == "apamount") {
      this.ecfheaderForm.get('apamount').setValue(text)
    }
    if (ctrlname == "apamounts") {
      this.ECFUpdateForm.get('apamount').setValue(text)
    }

  }
  filterDecimal(ctrl, ctrlname, ind) {
    let text = String(ctrl.value);

    let flag = false
    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i)
      let charcode = text.charCodeAt(i)
      console.log("charcode...", charcode)
      if (charcode == 46 && flag == false) {
        flag = true
      }
      else if (charcode == 46) {
        text = text.replace(char, "");
        i = i - 1
      }
      else if (charcode != 46 && i == text.length - 1) {
        let num: number = +text;
        num = +(num.toFixed(2))
        if (ctrlname == "apamount") {
          this.ecfheaderForm.get('apamount').setValue(num)
        }
        if (ctrlname == "apamounts") {
          this.ECFUpdateForm.get('apamount').setValue(num)

        } if (ctrlname == "invoiceamount") {
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][ind].get('invoiceamount').setValue(num)

        } if (ctrlname == "totalamount") {
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][ind].get('totalamount').setValue(num)

        }
      }
    }

  }
  filteredText1: any
  filterTextsunder(ctrl, ctrlname, index) {
    let text = String(ctrl.value).trim();
    this.filteredText1 = " ";
    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i);
      let charcode = text.charCodeAt(i);
      if ((charcode >= 65 && charcode <= 90) ||
        (charcode >= 97 && charcode <= 122) ||
        (charcode >= 48 && charcode <= 57) ||
        charcode === 32 ||
        char === '_') {
        this.filteredText1 += char;
      }
    }
    if (ctrlname === "invoceno") {
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceno').setValue(this.filteredText1);
    } else if (ctrlname === "creditrefno") {
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('creditrefno').setValue(this.filteredText1);
    } else
      if (ctrlname === "refinv_crno") {
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('refinv_crno').setValue(this.filteredText1);
      }
      else if (ctrlname === "item") {
        this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('productname').setValue(this.filteredText1);
      } else if (ctrlname === "description") {
        this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('description').setValue(this.filteredText1);
      } else if (ctrlname === "remarks") {
        this.DebitDetailForm.get('debitdtl')['controls'][index].get('remarks').setValue(this.filteredText1);
      }
  }

  invNoFilter(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (! ((charCode >= 47 && charCode <= 57) || (charCode >= 65 && charCode <= 90)
        || (charCode >= 97 && charCode <= 122) || charCode ==45 ) ) {
      return false;
    }
  }

  filterTexts(ctrl, ctrlname, index, frm: any = '') {
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
    if (ctrlname == "invoiceno" && frm == 'frmInvHdrDet') {
      this.frmInvHdrDet.controls['invoiceno'].setValue(text)
    }
    else if (ctrlname == "invoiceno" && frm != 'frmInvHdrDet') {
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceno').setValue(text)
    }
    else if (ctrlname == "creditrefno") {
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('creditrefno').setValue(text)
    }
    else if (ctrlname == "refinv_crno") {
      this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('refinv_crno').setValue(text)
    }

    else if (ctrlname == "item") {
      this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('productname').setValue(text)
    }
    else if (ctrlname == "description") {
      this.InvoiceDetailForm.get('invoicedtl')['controls'][index].get('description').setValue(text)
    }
    else if (ctrlname == "remarks") {
      this.DebitDetailForm.get('debitdtl')['controls'][index].get('remarks').setValue(text)
    }


  }
  catviewdata: any
  subcatviewdata: any
  getgldata(datas) {

    this.catviewdata = datas?.value?.category_code?.code
    this.subcatviewdata = datas?.value?.subcategory_code?.code
  }

  checkamount(e, i, datas) {

    if (Number(datas.value.ccbspercentage) > 100) {
      this.notification.showWarning("Percentage Should not exceed 100");
      return false;
    }

  }

  glback() {
    this.closeglbutton.nativeElement.click();
  }

  previousCharCode: any = 0
  charCode: any = 0
  getCharCode(e) {
    this.previousCharCode = this.charCode
    this.charCode = (e.which) ? e.which : e.keyCode;
  }

  ecfhdrchangeToCurrency(ctrl, ctrlname) {

    // console.log(this.previousCharCode , this.charCode)
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = ctrl.value;
      a = a.replace(/,/g, "");

      if (a && !isNaN(+a)) {
        let num: number = +a;
        // num = +(num.toFixed(2))
        let temp = new Intl.NumberFormat("en-GB").format(num);
        temp = temp ? temp.toString() : '';
        this.ecfheaderForm.get('apamount').setValue(temp)

      }



    }
  }

  ecfamtDecimalChg() {
    let amt = this.ecfheaderForm.value.apamount
    amt = amt.replace(/,/g, "");

    if (amt !== "" && !isNaN(+amt)) {
      let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
      temp = temp ? temp.toString() : '';
      this.ecfheaderForm.get('apamount').setValue(temp, { emitEvent: false })

    }
  }


  invhdrChangeToCurrency(ctrl, ctrlname, i) {

    // console.log(this.previousCharCode , this.charCode)
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = ctrl.value;
      a = a.replace(/,/g, "");

      if (a && !isNaN(+a)) {
        let num: number = +a;
        // num = +(num.toFixed(2))
        let temp = new Intl.NumberFormat("en-GB", { style: "decimal" }).format(num);
        temp = temp ? temp.toString() : '';
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get(ctrlname).setValue(temp)

      }

    }
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
        this.frmInvHdrDet.controls[ctrlname].setValue(temp)
      }
    }
  }

  invhdramtDecimalChg(ctrl, ctrlname, i, frm: any = '') {
    let amt = ctrl.value
    amt = amt.replace(/,/g, "");

    if (+amt >= 0) {
      let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amt);
      temp = temp ? temp.toString() : '';
      // this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get(ctrlname).setValue(temp)
      if (frm == '')
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get(ctrlname).setValue(temp)
      else
        this.frmInvHdrDet.controls[ctrlname].setValue(temp, { emitEvent: false })

    }
  }
  ecfUpdatechangeToCurrency(ctrl, ctrlname) {

    // console.log(this.previousCharCode , this.charCode)
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = ctrl.value;
      a = a.replace(/,/g, "");

      if (a && !isNaN(+a)) {
        let num: number = +a;
        // num = +(num.toFixed(2))
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        temp = temp ? temp.toString() : '';
        this.ECFUpdateForm.get(ctrlname).setValue(temp)
      }

    }

  }


  numberWithCommasDecimal(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  ppxChangeToCurrency(ctrlname, i) {
    if (this.charCode != 46 && !(this.previousCharCode == 46 && this.charCode == 48)) {
      let a = this.ppxForm.get('ppxdtl')['controls'][i].get(ctrlname).value;
      a = a.replace(/,/g, "");
      if (a && !isNaN(+a)) {
        let num: number = +a;
        let temp = new Intl.NumberFormat("en-GB", { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
        temp = temp ? temp.toString() : '';
        this.ppxForm.get('ppxdtl')['controls'][i].get(ctrlname).setValue(temp)
      }
    }
  }

  settodropdown(ind, control, arrayname, formname) {
    this.currentind = ind;
    this.currentform = formname
    this.currentArray = arrayname
    this.currentfield = control.getAttribute('formControlName')
    // console.log("Focus Triggered",this.currentind,this.currentform,this.currentArray,this.currentfield)
  }

  nullify(trigger) {
    trigger.panelClosingActions
      .subscribe(e => {

        let value = this[this.currentform].value[this.currentArray][this.currentind][this.currentfield];
        // console.log("value",value)
        if (!value || typeof (value) == 'object') {
          return ''
        }
        else {
          this.notification.showError('Please use the given dropdown for' + " " + this.currentfield + " " + 'selection..');
          if (this.currentfield == "hsn") {
            (this.InvoiceDetailForm.get('invoicedtl') as FormArray).at(this.currentind).get(this.currentfield).setValue(null);
            (this.InvoiceDetailForm.get('invoicedtl') as FormArray).at(this.currentind).get('hsn_percentage').setValue(null);
          } else if (this.currentfield == "uom") {
            (this.InvoiceDetailForm.get('invoicedtl') as FormArray).at(this.currentind).get(this.currentfield).setValue(null);
          } else if (this.currentfield == "bs") {
            (this.DebitDetailForm.get('debitdtl') as FormArray).at(this.currentind).get(this.currentfield).setValue(null);
          } else if (this.currentfield == "cc") {
            (this.DebitDetailForm.get('debitdtl') as FormArray).at(this.currentind).get(this.currentfield).setValue(null);
          }


        }


      })
  }

  namevalidation(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9 ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  GstNooo: any
  validationGstNo(e, index) {
    let gstno = e.target.value;
    if (gstno != '' && gstno.length == 15) {
      this.SpinnerService.show();
      let gst = gstno
      gst = gst.slice(2, -3);
      this.GstNooo = gst;


      this.ecfservices.getBracnhGSTNo(gstno)
        .subscribe(res => {
          console.log("gstres", res)
          let result = res.validation_status
          if (result === false) {
            this.notification.showWarning("Please Enter a Valid GST Number")
            // this.SupplierDetailForm.controls['suppliergst'].reset();
            this.SpinnerService.hide();
          } else {
            this.notification.showSuccess(" GST Number Validated...")
            this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('manualsupp_name').setValue(result?.tradeNam)
            this.SpinnerService.hide();
          }
        },
          error => {
            this.notification.showWarning("GST validation failure")
            this.SpinnerService.hide();
          }
        )
    }
  }

  resetsupplierform() {
    this.SupplierDetailForm.controls['supplier_name'].reset();
    this.SupplierDetailForm.controls['pincode'].reset();
    this.SupplierDetailForm.controls['suppliergst'].reset();
    this.SupplierDetailForm.controls['invoiceno'].reset();
    this.SupplierDetailForm.controls['invoicedate'].reset();

  }
  maxpettyamount = 10000
  minpettyamount = 1
  pettyamount(event) {

    if (event > this.maxpettyamount) {
      this.notification.showError("Amount Should be less than Rs.10000 and greater than Rs.1");
      this.ecfheaderForm.patchValue({ "apamount": null })
      return false;
    }

  }
  Invoicedatas: any = []
  headerchange: boolean = false
  datadedupe: any
  gotodetail(section, index) {
    if (this.disableecfsave == false) {
      this.toastr.error('Please Save ECF Header');
      return false;
    }

    this.invhdrsaved = true
    this.Invoicedatas = [];
    this.formData = new FormData();
    console.log("headerres", this.invoiceheaderres)
    const invdataaas = this.invoiceheaderres
    const invoiceheaderdata = section.value
    invoiceheaderdata.totalamount = String(invoiceheaderdata.totalamount).replace(/,/g, '');
    invoiceheaderdata.invoiceamount = String(invoiceheaderdata.invoiceamount).replace(/,/g, '');
    if (this.paytoid == 'S' && this.ecftypeid != 14) {
      if (invoiceheaderdata?.invoicegst == "" || invoiceheaderdata?.supplier_id == "" || invoiceheaderdata?.invoicedate == '' ||
        invoiceheaderdata?.invoiceamount == 0 || invoiceheaderdata?.remarks == '' || invoiceheaderdata?.invoiceno == '') {
        this.toastr.error('Please Fill Mandatory Fields.');
        this.invhdrsaved = false
        return false;
      }
    }
    else if (this.paytoid == 'S' && this.ecftypeid == 14) {
      if (invoiceheaderdata?.invoicegst == "" || invoiceheaderdata?.supplier_id == "" || invoiceheaderdata?.invoicedate == '' ||
        invoiceheaderdata?.totalamount == 0 || invoiceheaderdata?.remarks == '' || invoiceheaderdata?.invoiceno == '') {
        this.toastr.error('Please Fill Mandatory Fields.');
        this.invhdrsaved = false
        return false;
      }
    }
    else if (this.ecftypeid == 3 || this.ecftypeid == 13) {
      if (invoiceheaderdata?.invoicegst == "" || invoiceheaderdata?.invoiceamount == 0 || invoiceheaderdata?.remarks == '') {
        this.toastr.error('Please Fill Mandatory Fields.');
        this.invhdrsaved = false
        return false;
      }
    }
    else {
      if (invoiceheaderdata?.invoicegst == "" || invoiceheaderdata?.invoicedate == '' ||
        invoiceheaderdata?.invoiceamount == 0 || invoiceheaderdata?.remarks == '' || invoiceheaderdata?.invoiceno == '') {
        this.toastr.error('Please Fill Mandatory Fields.');
        this.invhdrsaved = false
        return false;
      }
    }
    console.log("headerdata", invoiceheaderdata)
    if (this.ecftypeid != 14 && invoiceheaderdata.invoicegst == "N" && invoiceheaderdata.totalamount != invoiceheaderdata.invoiceamount) {
      this.notification.showWarning("Invoice amount and Taxable amount should be same, if GST is not applicable")
      this.invhdrsaved = false
      return false
    }
    if (this.ecftypeid != 14 && invoiceheaderdata.invoicegst == "Y" && invoiceheaderdata.totalamount == invoiceheaderdata.invoiceamount) {
      this.notification.showWarning("Invoice amount and Taxable amount should not be same, if GST is applicable")
      this.invhdrsaved = false
      return false
    }
    if (this.ecftypeid == 14) {
      let accno = invoiceheaderdata.invoiceno
      if (accno.length != 16) {
        this.notification.showWarning("Account No. should have 16 digits.")
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('invoiceno').setValue('')
        this.invhdrsaved = false
        return false
      }
    }
    if(this.ecftypeid == 13){
      if(invoiceheaderdata.invoiceamount > 10000){
        this.notification.showError("Amount Should be less than Rs.10000 and greater than Rs.1")
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('invoiceamount').setValue('')
        this.InvoiceHeaderForm.get('invoiceheader')['controls'][0].get('totalamount').setValue('')
        this.invhdrsaved = false
        return false
      }
    }
    // if(this.invoiceheaderres != undefined){
    // if(this.invoiceheaderres[index]?.invoicegst == section?.value?.invoicegst){
    //   this.headerchange = false
    // }if(this.invoiceheaderres[index]?.supplier_id?.id == section?.value?.supplier_id){
    //   this.headerchange = false
    // }if(this.invoiceheaderres[index]?.manualsupp_name == section?.value?.manualsupp_name){
    //   this.headerchange = false
    // }if(this.invoiceheaderres[index]?.invoiceno == section?.value?.invoiceno){
    //   this.headerchange = false
    // }if(this.invoiceheaderres[index]?.invoicedate == section?.value?.invoicedate){
    //   this.headerchange = false
    // }if(this.invoiceheaderres[index]?.remarks == section?.value?.remarks){
    //   this.headerchange = false
    // }if(Number(this.invoiceheaderres[index]?.totalamount) == Number(section?.value?.totalamount)){
    //   this.headerchange = false
    // }if(Number(this.invoiceheaderres[index]?.invoiceamount) == Number(section?.value?.invoiceamount)){
    //   this.headerchange = false
    // }else{
    //   this.headerchange = true
    // }
    // if(section.value.id == "" || section.value.id == null || section.value.id == undefined ){
    //   this.notification.showError("Please Create Invoice Header First");
    //   return false;
    // }
    let id
    if (this.ecfheaderid != undefined) {
      id = this.ecfheaderid
    } else {
      id = this.ecfheaderidd
    }

    if (invdataaas != undefined) {
      if (this.ecftypeid == 2 || (this.ecftypeid == 4 && this.ppxid == 'S') || this.ecftypeid == 14) {
        if ((invdataaas[index]?.invoicegst == invoiceheaderdata?.invoicegst) && (invdataaas[index]?.supplier_id?.id == invoiceheaderdata?.supplier_id) &&
          (invdataaas[index]?.manualsupp_name == invoiceheaderdata?.manualsupp_name) && (invdataaas[index]?.invoiceno == invoiceheaderdata?.invoiceno) &&
          (invdataaas[index]?.invoicedate == invoiceheaderdata?.invoicedate) && (invdataaas[index]?.remarks == invoiceheaderdata?.remarks) &&
          (invdataaas[index]?.totalamount == invoiceheaderdata?.totalamount) && (invdataaas[index]?.invoiceamount == invoiceheaderdata?.invoiceamount) &&
          (invdataaas[index]?.branchdetails_id?.id == invoiceheaderdata?.branchdetails_id?.id) &&
          (invoiceheaderdata?.file_key?.length == 0) && (invdataaas[index]?.pmd_data?.id == invoiceheaderdata?.pmdlocation_id?.id) &&
          ((typeof (invdataaas[index]?.pmd_data?.id) == 'number' && this.PMDyesno == 'Y') || (typeof (invdataaas[index]?.pmd_data?.id) == 'undefined' && this.PMDyesno != 'Y')) &&
          (invdataaas[index]?.is_recur?.id == invoiceheaderdata?.is_recur) &&
          (invdataaas[index]?.servicetype?.id == invoiceheaderdata?.service_type) &&
          (invdataaas[index]?.recur_fromdate == invoiceheaderdata?.recur_fromdate) &&
          (invdataaas[index]?.recur_todate == invoiceheaderdata?.recur_todate) &&
          (invdataaas[index]?.is_pca == invoiceheaderdata?.is_pca) &&
          (invdataaas[index]?.pca_no == invoiceheaderdata?.pca_no?.pca_no)) {
          this.headerchange = false

          if (this.ecftypeid == 2) {
            if ((invdataaas[index]?.captalisedflag == 'Y' && invoiceheaderdata?.captalisedflag)
              || invdataaas[index]?.captalisedflag == 'N' && !invoiceheaderdata?.captalisedflag) {
              this.headerchange = false
            } else {
              this.headerchange = true
            }
          }
        }
        else {
          this.headerchange = true
        }
      } else if (this.ecftypeid == 3) {
        if ((invdataaas[index]?.invoicegst == invoiceheaderdata?.invoicegst) &&
          (invdataaas[index]?.manual_gstno == invoiceheaderdata?.manual_gstno) && (invdataaas[index]?.invoiceno == invoiceheaderdata?.invoiceno) &&
          (invdataaas[index]?.invoicedate == invoiceheaderdata?.invoicedate) && (invdataaas[index]?.remarks == invoiceheaderdata?.remarks) &&
          (invdataaas[index]?.totalamount == invoiceheaderdata?.totalamount) && (invdataaas[index]?.invoiceamount == invoiceheaderdata?.invoiceamount) &&
          (invdataaas[index]?.branchdetails_id?.id == invoiceheaderdata?.branchdetails_id?.id) &&
          (invoiceheaderdata?.file_key?.length == 0) && (invdataaas[index]?.pmd_data?.id == invoiceheaderdata?.pmdlocation_id?.id) &&
          ((typeof (invdataaas[index]?.pmd_data?.id) == 'number' && this.PMDyesno == 'Y') || (typeof (invdataaas[index]?.pmd_data?.id) == 'undefined' && this.PMDyesno != 'Y')) &&
          (invdataaas[index]?.is_recur?.id == invoiceheaderdata?.is_recur) &&
          (invdataaas[index]?.servicetype?.id == invoiceheaderdata?.service_type) &&
          (invdataaas[index]?.recur_fromdate == invoiceheaderdata?.recur_fromdate) &&
          (invdataaas[index]?.recur_todate == invoiceheaderdata?.recur_todate)) {
          this.headerchange = false
        } else {
          this.headerchange = true
        }
      } else if (this.ecftypeid == 4 && this.ppxid == 'E') {
        if ((invdataaas[index]?.invoicegst == invoiceheaderdata?.invoicegst) && (invdataaas[index]?.remarks == invoiceheaderdata?.remarks) &&
          (invdataaas[index]?.totalamount == invoiceheaderdata?.totalamount) && (invdataaas[index]?.invoiceamount == invoiceheaderdata?.invoiceamount) &&
          (invdataaas[index]?.branchdetails_id?.id == invoiceheaderdata?.branchdetails_id?.id) && (invdataaas[index]?.invoiceno == invoiceheaderdata?.invoiceno) &&
          (invoiceheaderdata?.file_key?.length == 0) && (invdataaas[index]?.pmd_data?.id == invoiceheaderdata?.pmdlocation_id?.id) &&
          ((typeof (invdataaas[index]?.pmd_data?.id) == 'number' && this.PMDyesno == 'Y') || (typeof (invdataaas[index]?.pmd_data?.id) == 'undefined' && this.PMDyesno != 'Y')) &&
          (invdataaas[index]?.is_recur?.id == invoiceheaderdata?.is_recur) &&
          (invdataaas[index]?.servicetype.id == invoiceheaderdata?.service_type) &&
          (invdataaas[index]?.recur_fromdate == invoiceheaderdata?.recur_fromdate) &&
          (invdataaas[index]?.recur_todate == invoiceheaderdata?.recur_todate)) {
          this.headerchange = false
        } else {
          this.headerchange = true
        }
      } else if (this.ecftypeid == 13) {
        if ((invdataaas[index]?.invoicegst == invoiceheaderdata?.invoicegst) && (invdataaas[index]?.invoiceno == invoiceheaderdata?.invoiceno) &&
          (invdataaas[index]?.invoicedate == invoiceheaderdata?.invoicedate) && (invdataaas[index]?.remarks == invoiceheaderdata?.remarks) &&
          (invdataaas[index]?.totalamount == invoiceheaderdata?.totalamount) && (invdataaas[index]?.invoiceamount == invoiceheaderdata?.invoiceamount) &&
          (invdataaas[index]?.branchdetails_id?.id == invoiceheaderdata?.branchdetails_id?.id) &&
          (invoiceheaderdata?.file_key?.length == 0) && (invdataaas[index]?.pmd_data?.id == invoiceheaderdata?.pmdlocation_id?.id) &&
          ((typeof (invdataaas[index]?.pmd_data?.id) == 'number' && this.PMDyesno == 'Y') || (typeof (invdataaas[index]?.pmd_data?.id) == 'undefined' && this.PMDyesno != 'Y')) &&
          (invdataaas[index]?.is_recur?.id == invoiceheaderdata?.is_recur) &&
          (invdataaas[index]?.servicetype?.id == invoiceheaderdata?.service_type) &&
          (invdataaas[index]?.recur_fromdate == invoiceheaderdata?.recur_fromdate) &&
          (invdataaas[index]?.recur_todate == invoiceheaderdata?.recur_todate)) {
          this.headerchange = false
        } else {
          this.headerchange = true
        }
      } else if (this.ecftypeid == 7) {
        if ((invdataaas[index]?.invoicegst == invoiceheaderdata?.invoicegst) && (invdataaas[index]?.supplier_id?.id == invoiceheaderdata?.supplier_id) &&
          (invdataaas[index]?.manualsupp_name == invoiceheaderdata?.manualsupp_name) && (invdataaas[index]?.invoiceno == invoiceheaderdata?.invoiceno) &&
          (invdataaas[index]?.creditrefno == invoiceheaderdata?.creditrefno) &&
          (invdataaas[index]?.invoicedate == invoiceheaderdata?.invoicedate) && (invdataaas[index]?.remarks == invoiceheaderdata?.remarks) && (invdataaas[index]?.refinv_crno == invoiceheaderdata?.refinv_crno) &&
          (invdataaas[index]?.totalamount == invoiceheaderdata?.totalamount) && (invdataaas[index]?.invoiceamount == invoiceheaderdata?.invoiceamount) &&
          (invdataaas[index]?.branchdetails_id?.id == invoiceheaderdata?.branchdetails_id?.id) &&
          (invoiceheaderdata?.file_key?.length == 0) && (invdataaas[index]?.pmd_data?.id == invoiceheaderdata?.pmdlocation_id?.id) &&
          ((typeof (invdataaas[index]?.pmd_data?.id) == 'number' && this.PMDyesno == 'Y') || (typeof (invdataaas[index]?.pmd_data?.id) == 'undefined' && this.PMDyesno != 'Y')) &&
          (invdataaas[index]?.is_recur?.id == invoiceheaderdata?.is_recur) &&
          (invdataaas[index]?.servicetype?.id == invoiceheaderdata?.service_type) &&
          (invdataaas[index]?.recur_fromdate == invoiceheaderdata?.recur_fromdate) &&
          (invdataaas[index]?.recur_todate == invoiceheaderdata?.recur_todate)) {
          this.headerchange = false
        } else {
          this.headerchange = true
          // this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('refinv_crno').setValue(this.filteredText1); 
        }
      }
    } else if (invoiceheaderdata?.apheader_id == id) {
      this.headerchange = false
    }
    else {
      this.headerchange = true
    }

    // if (invoiceheaderdata?.filedataas.length <= 0 &&
    //   (this.file_process_data[this.uploadFileTypes[0]]?.length == undefined || this.file_process_data[this.uploadFileTypes[0]]?.length == 0)
    //   && (this.file_process_data[this.uploadFileTypes[1]]?.length == undefined || this.file_process_data[this.uploadFileTypes[1]]?.length == 0)
    //   && (this.file_process_data[this.uploadFileTypes[2]]?.length == undefined || this.file_process_data[this.uploadFileTypes[2]]?.length == 0)
    //   && (this.file_process_data[this.uploadFileTypes[3]]?.length == undefined || this.file_process_data[this.uploadFileTypes[3]]?.length == 0)) {
    //   this.toastr.error('Please Upload File');
    //   this.invhdrsaved = false
    //   return false;
    // }
    if (invoiceheaderdata?.filedataas.length === 0 ) {
      if(this.pagedFiles.length === 0 )
      this.toastr.error('Please Upload File');
      this.invhdrsaved = false
      return false;
    }

    // if (this.file_process_data[this.uploadFileTypes[0]]?.length > 0 || this.file_process_data[this.uploadFileTypes[1]]?.length > 0 ||
    //   this.file_process_data[this.uploadFileTypes[2]]?.length > 0 || this.file_process_data[this.uploadFileTypes[3]]?.length > 0)
    if (invoiceheaderdata?.filedataas.length > 0 )
      this.headerchange = true
    if (this.headerchange == true) {
      //  let hdramt = +String(this.ecfheaderForm.value.apamount).replace(/,/g, '')
      //  let invhdramts = this.InvoiceHeaderForm.value.invoiceheader.map(x => String(x.totalamount).replace(/,/g, ''));

      //  let invhdrtotsum = invhdramts.reduce((a,b)=> Number(a )+ Number(b),0)
      if (this.PCAyesno == 1 && (+invoiceheaderdata?.totalamount > +this.PCA_bal_amount)) {
        this.toastr.error('Invoice Header amount should not exceed PCA Balance Amount.');
        this.invhdrsaved = false
        return false;
      }
      //   if(hdramt < invhdrtotsum)
      //  {
      //   this.toastr.error('Total Invoice Header amount should not exceed ECF Header Amount.');
      //   this.invhdrsaved = false
      //   return false;
      //   }
      if ((invoiceheaderdata?.suppname == '' || invoiceheaderdata?.suppname == null || invoiceheaderdata?.suppname == undefined) &&
        (this.ecftypeid != 3 && this.ecftypeid != 13 && !(this.ecftypeid == 4 && this.paytoid == 'E'))) {
        this.toastr.error('Please Choose Supplier Name');
        this.invhdrsaved = false
        return false;
      }
      if (this.PMDbranchdata.length > 0 && (invoiceheaderdata?.is_pmd == '' || invoiceheaderdata?.is_pmd == null || invoiceheaderdata?.is_pmd == undefined)) {
        this.toastr.error('Please Choose Is PMD');
        this.invhdrsaved = false
        return false;

      }
      if (this.PMDyesno == 'Y' && (invoiceheaderdata?.pmdlocation_id == '' || invoiceheaderdata?.pmdlocation_id == null || invoiceheaderdata?.pmdlocation_id == undefined)) {
        this.toastr.error('Please Choose PMD Location');
        this.invhdrsaved = false
        return false;
      }

      if ((invoiceheaderdata?.invoiceno == '' || invoiceheaderdata?.invoiceno == null || invoiceheaderdata?.invoiceno == undefined) &&
        (this.ecftypeid != 3 && this.ecftypeid != 13)) {
        let txt = 'Please Enter Invoice Number'
        if (this.ecftypeid == 14)
          txt = 'Please Enter Account Number'

        this.toastr.error(txt);
        this.invhdrsaved = false
        return false;
      }
      if ((invoiceheaderdata?.invoicedate == '' || invoiceheaderdata?.invoicedate == null || invoiceheaderdata?.invoicedate == undefined) &&
        (this.ecftypeid != 3 && this.ecftypeid != 13)) {
        this.toastr.error('Please Choose Invoice Date');
        this.invhdrsaved = false
        return false;
      }

      if (this.ecftypeid == 2 && (invoiceheaderdata?.is_pca == null || invoiceheaderdata?.is_pca == undefined)) {
        this.toastr.error('Please Choose Is PCA');
        this.invhdrsaved = false
        return false;
      }
      if (this.PCAyesno == 1 && (invoiceheaderdata?.pca_no == '' || invoiceheaderdata?.pca_no == null || invoiceheaderdata?.pca_no == undefined)) {
        this.toastr.error('Please Choose PCA No.');
        this.invhdrsaved = false
        return false;
      }
      if ((invoiceheaderdata?.totalamount == '') || (invoiceheaderdata?.totalamount == null) || (invoiceheaderdata?.totalamount == undefined) || +(invoiceheaderdata?.totalamount == 0)) {
        this.toastr.error('Please Enter Invoice Amount');
        this.invhdrsaved = false
        return false;
      }
      if (this.ecftypeid != 14) {
        if ((invoiceheaderdata?.invoiceamount == '') || (invoiceheaderdata?.invoiceamount == null) || (invoiceheaderdata?.invoiceamount == undefined) || +(invoiceheaderdata?.invoiceamount == 0)) {
          this.toastr.error('Please Enter Taxable Amount');
          this.invhdrsaved = false
          return false;
        }
      }
      // if ((invoiceheaderdata[i]?.taxamount == 0 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y' && this.ecftypeid == 2) || (invoiceheaderdata[i]?.taxamount == 0 && this.InvoiceHeaderForm?.value?.invoicegst === 'Y' && this.ecftypeid == 7)) {
      //   this.toastr.error('Please Enter Tax Amount');
      //   this.SpinnerService.hide()
      //   return false;
      // }

      if (this.ecftypeid == 7) {
        if ((invoiceheaderdata?.creditrefno == '') || (invoiceheaderdata?.creditrefno == null) || (invoiceheaderdata?.creditrefno == undefined)) {
          this.toastr.error('Please Enter Credit Ref No');
          this.invhdrsaved = false
          return false;
        }
        if ((invoiceheaderdata?.refinv_crno == '') || (invoiceheaderdata?.refinv_crno == null) || (invoiceheaderdata?.refinv_crno == undefined)) {
          this.toastr.error('Please Enter Invoice CR No');
          this.invhdrsaved = false
          return false;
        }
      }
      if (invoiceheaderdata?.remarks == '' || invoiceheaderdata?.remarks == undefined) {
        this.toastr.error('Please Enter Purpose');
        this.invhdrsaved = false
        return false;
      }

      if (invoiceheaderdata?.is_recur == 1 && (+invoiceheaderdata?.service_type == 1 || invoiceheaderdata?.service_type == undefined || invoiceheaderdata?.service_type == null)) {
        this.toastr.error('Please select Service Type');
        this.invhdrsaved = false
        return false;
      }

      if ((invoiceheaderdata?.service_type == 2 || invoiceheaderdata?.service_type == 3) && (invoiceheaderdata?.recur_fromdate == '' || invoiceheaderdata?.recur_fromdate == undefined || invoiceheaderdata?.recur_fromdate == null)) {
        this.toastr.error('Please select Recurring From Date');
        this.invhdrsaved = false
        return false;
      }

      if (invoiceheaderdata?.service_type == 3 && (invoiceheaderdata?.recur_todate == '' || invoiceheaderdata?.recur_todate == undefined || invoiceheaderdata?.recur_todate == null)) {
        this.toastr.error('Please select Recurring To Date');
        this.invhdrsaved = false
        return false;
      }

      if (invoiceheaderdata?.id === "" || invoiceheaderdata?.id === null) {
        delete invoiceheaderdata?.is_tds_applicable
      }
      invoiceheaderdata.apheader_id = id
      if (invoiceheaderdata.service_type == '')
        invoiceheaderdata.service_type = 1
      if (!(this.ecftypeid == 4 && this.paytoid == 'E') && this.ecftypeid != 3 && this.ecftypeid != 13) {
        this.datadedupe = {
          "invoiceno": invoiceheaderdata.invoiceno,
          "invoicedate": this.datePipe.transform(invoiceheaderdata?.invoicedate, 'yyyy-MM-dd'),
          "invoiceamount": invoiceheaderdata.totalamount,
          "supplier_id": invoiceheaderdata.supplier_id,
          "ecf_id": id
        }

        this.SpinnerService.show()
        this.ecfservices.DedupeInvoiceChk(this.datadedupe)
          .subscribe(result => {
            let data = result['data'] ? result['data'] : undefined
            if (data != undefined) {
              if (data.length > 0) {
                this.SpinnerService.hide()
                this.toastr.error('This ECF already raised');
                this.invhdrsaved = false
                return false;
              }
              else {
                if (this.ecftypeid!=13 &&(Number(this.sum) > Number(this.ecftotalamount) || Number(this.sum) < Number(this.ecftotalamount))) {
                  let confirm = window.confirm("ECF Header Amount and Invoice Header Amount(s) are not matching. \nDo You want to change the ECF Header's Amount to Sum of Invoice Header Amounts")
                  if (confirm) {

                    let ecfhdrdata
                    if (this.ecfresults != undefined) {
                      ecfhdrdata = {
                        supplier_type: this.ecfresults?.supplier_type_id,
                        commodity_id: this.ecfresults.commodity_id,
                        aptype: this.ecfresults.aptype,
                        apdate: this.datePipe.transform(this.ecfresults?.apdate, 'yyyy-MM-dd'),
                        apamount: String(this.sum),
                        ppx: this.ecfresults.ppx,
                        notename: this.ecfresults.notename,
                        remark: this.ecfresults.remark,
                        payto: this.ecfresults.payto,
                        advancetype: this.ecftypeid == 4 && this.ecfheaderForm?.value?.ppx?.id == 'E' ? 3 : undefined,
                        ppxno: this.ecfresults.ppx,
                        branch: this.ecfresults.branch,
                        is_raisedby_self: true,
                        raised_by: this.raisedbyid,
                        location: this.ecfresults?.location,
                        inwarddetails_id: this.ecfresults.inwarddetails_id,
                        is_originalinvoice: 1,
                        crno: this.ecfresults.crno,
                      }
                    }
                    else {
                      ecfhdrdata = {
                        supplier_type: this.ecfresult.supplier_type_id,
                        commodity_id: this.ecfresult.commodity_id?.id,
                        aptype: this.ecfresult.aptype_id,
                        apdate: this.datePipe.transform(this.ecfresult?.apdate, 'yyyy-MM-dd'),
                        apamount: String(this.sum),
                        ppx: this.ecfresult?.ppx,
                        notename: this.ecfresult.notename,
                        remark: this.ecfresult.remark,
                        payto: this.ecfresult.payto,
                        advancetype: this.ecftypeid == 4 && this.ecfheaderForm?.value?.ppx?.id == 'E' ? 3 : undefined,
                        ppxno: this.ecfresult.commodity_id,
                        branch: this.ecfresult.branch?.id,
                        is_raisedby_self: true,
                        raised_by: this.raisedbyid,
                        location: this.ecfresult?.location,
                        inwarddetails_id: this.ecfresult.inwarddetails_id,
                        is_originalinvoice: this.ecfresult.is_originalinvoice,
                        crno: this.ecfresult.crno,
                      }
                    }

                    this.ecfservices.editecfheader(ecfhdrdata, this.ecfheaderidd)
                      .subscribe(result => {
                        if (result.id == undefined) {
                          this.SpinnerService.hide()
                          this.notification.showError(result?.description)
                          this.invhdrsaved = false
                          return false
                        }
                        else {
                          this.notification.showSuccess("Successfully ECF Header Amount Updated")
                          this.ecfresults = result
                          this.ecfheaderid = result?.id
                          this.ecfheaderidd = result?.id
                          this.crno = result?.crno
                          this.hdrsave(invoiceheaderdata, section, index)
                        }
                      })
                  }
                  else {
                    this.SpinnerService.hide()
                    this.invhdrsaved = false
                    return false
                  }
                }
                else {
                  this.hdrsave(invoiceheaderdata, section, index)
                }
              }
            }
          }
          )

      }
      else if ((this.ecftypeid == 4 && this.paytoid == 'E') || this.ecftypeid == 3 || this.ecftypeid == 13) {
        this.SpinnerService.show()
        if (Number(this.sum) > Number(this.ecftotalamount) || Number(this.sum) < Number(this.ecftotalamount)) {
          let confirm = window.confirm("ECF Header Amount and Invoice Header Amount(s) are not matching. \nDo You want to change the ECF Header's Amount to Sum of Invoice Header Amounts")
          if (confirm) {

            let ecfhdrdata
            if (this.ecfresults != undefined) {
              ecfhdrdata = {
                supplier_type: this.ecfresults?.supplier_type_id,
                commodity_id: this.ecfresults.commodity_id,
                aptype: this.ecfresults.aptype,
                apdate: this.datePipe.transform(this.ecfresults?.apdate, 'yyyy-MM-dd'),
                apamount: String(this.sum),
                ppx: this.ecfresults.ppx,
                notename: this.ecfresults.notename,
                remark: this.ecfresults.remark,
                payto: this.ecfresults.payto,
                advancetype: this.ecftypeid == 4 && this.ecfheaderForm?.value?.ppx?.id == 'E' ? 3 : undefined,
                ppxno: this.ecfresults.ppx,
                branch: this.ecfresults.branch,
                is_raisedby_self: true,
                raised_by: this.raisedbyid,
                location: this.ecfresults?.location,
                inwarddetails_id: this.ecfresults.inwarddetails_id,
                is_originalinvoice: 1,
                crno: this.ecfresults.crno,
              }
            }
            else {
              ecfhdrdata = {
                supplier_type: this.ecfresult.supplier_type_id,
                commodity_id: this.ecfresult.commodity_id?.id,
                aptype: this.ecfresult.aptype_id,
                apdate: this.datePipe.transform(this.ecfresult?.apdate, 'yyyy-MM-dd'),
                apamount: String(this.sum),
                ppx: this.ecfresult?.ppx,
                notename: this.ecfresult.notename,
                remark: this.ecfresult.remark,
                payto: this.ecfresult.payto,
                advancetype: this.ecftypeid == 4 && this.ecfheaderForm?.value?.ppx?.id == 'E' ? 3 : undefined,
                ppxno: this.ecfresult.commodity_id,
                branch: this.ecfresult.branch?.id,
                is_raisedby_self: true,
                raised_by: this.raisedbyid,
                location: this.ecfresult?.location,
                inwarddetails_id: this.ecfresult.inwarddetails_id,
                is_originalinvoice: this.ecfresult.is_originalinvoice,
                crno: this.ecfresult.crno,
              }
            }

            this.ecfservices.editecfheader(ecfhdrdata, this.ecfheaderidd)
              .subscribe(result => {
                if (result.id == undefined) {
                  this.SpinnerService.hide()
                  this.notification.showError(result?.description)
                  this.invhdrsaved = false
                  return false
                }
                else {
                  this.notification.showSuccess("Successfully ECF Header Amount Updated")
                  this.ecfresults = result
                  this.ecfheaderid = result?.id
                  this.ecfheaderidd = result?.id
                  this.crno = result?.crno
                  this.hdrsave(invoiceheaderdata, section, index)
                }
              })
          }
          else {
            this.SpinnerService.hide()
            this.invhdrsaved = false
            return false
          }
        }
        else {
          this.hdrsave(invoiceheaderdata, section, index)
        }
      }

    } else {
      this.shareservice.invheaderid.next(section.value.id)
      this.shareservice.detailsview.next('ECF')
      this.shareservice.ecfheaderedit.next(this.ecfheaderid ? this.ecfheaderid : this.ecfheaderidd)
      this.shareservice.captalised.next(section.value.captalisedflag)
      this.onView.emit()
    }
  }
  hdrsave(invoiceheaderdata, section, index) {
    if (this.ecftypeid != 3 && this.ecftypeid != 13) {
      invoiceheaderdata.invoicedate = this.datePipe.transform(invoiceheaderdata?.invoicedate, 'yyyy-MM-dd');
    }
    else {
      invoiceheaderdata.invoicedate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }
    if (typeof (invoiceheaderdata.place_of_supply) == 'object') {
      invoiceheaderdata.place_of_supply = invoiceheaderdata?.place_of_supply?.code
    } else {
      // invoiceheaderdata?.branchdetails_id?.id
      invoiceheaderdata.place_of_supply = this.raiserbranchposid?.code
    }
    if (typeof (invoiceheaderdata.branchdetails_id) == 'object') {
      invoiceheaderdata.raisorbranchgst = invoiceheaderdata?.branchdetails_id.gstin
      invoiceheaderdata.place_of_supply = invoiceheaderdata?.branchdetails_id?.code
      invoiceheaderdata.branchdetails_id = invoiceheaderdata?.branchdetails_id?.id
    } else {
      invoiceheaderdata.branchdetails_id = invoiceheaderdata?.branchdetails_id
    }
    if (this.PMDyesno == 'Y') {
      invoiceheaderdata.is_pmd = true

      if (typeof (invoiceheaderdata.pmdlocation_id) == 'object') {
        invoiceheaderdata.raisorbranchgst = invoiceheaderdata?.pmdlocation_id?.gstno
        invoiceheaderdata.pmdlocation_id = invoiceheaderdata?.pmdlocation_id?.id
      } else {
        invoiceheaderdata.pmdlocation_id = invoiceheaderdata?.pmdlocation_id
      }
    }
    else {
      invoiceheaderdata.is_pmd = false
      delete invoiceheaderdata.pmdlocation_id
    }
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
    invoiceheaderdata.msmse = this.msme
    invoiceheaderdata.msme_reg_no = this.msme_reg_no

    invoiceheaderdata.invoiceamount = +invoiceheaderdata.invoiceamount
    invoiceheaderdata.totalamount = +invoiceheaderdata.totalamount
    if (this.ecftypeid == 14) {
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
    // i == this.inveditindex &&
    if (this.editkey == "modification") {
      invoiceheaderdata.edit_flag = 1
      invoiceheaderdata.apinvoiceheader_crno = invoiceheaderdata?.apinvoiceheader_crno,
        invoiceheaderdata.debitbank_id = invoiceheaderdata?.debitbank_id
    } else if (this.editkey == "edit") {
      invoiceheaderdata.edit_flag = 0
      invoiceheaderdata.apinvoiceheader_crno = invoiceheaderdata?.apinvoiceheader_crno,
        invoiceheaderdata.debitbank_id = invoiceheaderdata?.debitbank_id

    }
    invoiceheaderdata.index = index
    delete invoiceheaderdata?.suppstate
    invoiceheaderdata.module_type = 1

    // delete invoiceheaderdata[i]?.filekey
    // }
    if (invoiceheaderdata.service_type == 2 || invoiceheaderdata.service_type == 3) {
      invoiceheaderdata.recur_fromdate = this.datePipe.transform(invoiceheaderdata?.recur_fromdate, 'yyyy-MM-dd');
      invoiceheaderdata.recur_todate = this.datePipe.transform(invoiceheaderdata?.recur_todate, 'yyyy-MM-dd');
    }
    else {
      delete invoiceheaderdata.recur_fromdate
      delete invoiceheaderdata.recur_todate
    }
    if (this.ecftypeid != 2 && this.ecftypeid != 1) {
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
    invoiceheaderdata.apheader_id = this.ecfheaderidd ? this.ecfheaderidd : this.ecfheaderid
    this.Invoicedatas.push(section.value)
    let reqData = this.Invoicedatas
    console.log("reqData", reqData)
    for (let i = 0; i < reqData.length; i++) {
      // let keyvalue = "file" + index;
      // this.formData.delete(keyvalue);
      // let pairvalue = this.file_process_data[keyvalue];
      // if (pairvalue != undefined && pairvalue != "") {
      //   for (let fileindex in pairvalue) {
      //     //this.formData.append(keyvalue, pairvalue[fileindex])
      //     this.formData.append(keyvalue, this.file_process_data[keyvalue][fileindex])
      //   }
      // }
      for (let type of this.uploadFileTypes) {
        this.formData.delete(type);
        let pairvalue = this.file_process_data[type];
        if (pairvalue != undefined && pairvalue != "") {
          for (let fileindex in pairvalue) {
            this.formData.append(type, this.file_process_data[type][fileindex])
          }
        }
      }

    }
    let invheaderresult: boolean;
    this.formData.append('data', JSON.stringify(this.Invoicedatas));
    this.ecfservices.invoiceheadercreate(this.formData)
      .subscribe(result => {
        // this.SpinnerService.hide()
        if (result.status == 'Failed') {
          this.SpinnerService.hide()
          invheaderresult = false
          this.notification.showError(result?.description)
          this.invhdrsaved = false
          return false
        }
        let invhdrresults = result['invoiceheader']
        if (invhdrresults != undefined) {
          for (let i in invhdrresults) {
            if (invhdrresults[i]?.id == undefined) {
              invheaderresult = false
              // this.notification.showError(invhdrresults[i]?.description)
              this.SpinnerService.hide()
              this.notification.showError(invhdrresults[i]?.description)
              this.invhdrsaved = false

              return false
            } else {
              invheaderresult = true
            }
          }
        } else {
          this.notification.showError(result?.description)
          if (result?.code == "INVALID_FILETYPE" && result?.description == "Invalid Filetype") {
            // this.notification.showInfo("Please Delete the Uploaded File before moving further");
            this.SpinnerService.hide()
            this.notification.showInfo("Please Delete the Uploaded File before moving further");
            return false;
          }
          return false
        }
        if (invheaderresult == true) {
          this.notification.showSuccess("Successfully Invoice Header Saved!...")
          this.invheadersave = true
          this.readinvhdrdata = true
          this.showgstapply = true
          this.invhdrsaved = true
          this.showaddbtns = true
          this.AddinvDetails = false
          this.showinvheaderadd = false
          let data = this.InvoiceHeaderForm?.value?.invoiceheader
          for (let i in data) {
            data[i].id = result?.invoiceheader[i]?.id
          }
          this.invoiceheaderres = result?.invoiceheader
          this.InvoiceHeaderForm.get('invoiceheader')['controls'][index].get('id').setValue(result?.invoiceheader[0]?.id)
          this.shareservice.invheaderid.next(section.value.id)
          this.shareservice.detailsview.next('ECF')
          this.shareservice.captalised.next(section.value.captalisedflag)
          this.shareservice.ecfheaderedit.next(this.ecfheaderid ? this.ecfheaderid : this.ecfheaderidd)
          this.onView.emit()
        }
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  selectedAdvanceType: string;

  onSelectionChange(event: any) {
    this.selectedAdvanceType = event.source.triggerValue;
  }

  focusedevent: boolean = false
  supplierfocused: boolean = false
  commodityfocused: boolean = false
  branchfocused: boolean = false
  locationfocused: boolean = false
  amountfocused: boolean = false
  remarkfocused: boolean = false
  orginvfocused: boolean = false
  onFocus(e, data) {
    console.log("eeeeee======>", e)
    // console.log("eeeeee======>",e.target.value)
    if (data == "type") {
      this.focusedevent = true
    } else if (data == "suppliertype") {
      this.supplierfocused = true
    } else if (data == "commodity") {
      this.commodityfocused = true
    } else if (data == "branch") {
      this.branchfocused = true
    } else if (data == "location") {
      this.locationfocused = true
    } else if (data == "ecfamount") {
      this.amountfocused = true
    } else if (data == "remarks") {
      this.remarkfocused = true
    } else if (data == "orginv") {
      this.orginvfocused = true
    }
  }

  onDateChange(event: any) {
    const ecfdate = new Date(this.ecfheaderForm?.value?.apdate); // Convert ecfdate to a Date object
    const selectedDate = new Date(event.value); // Set the selected date

    const sixMonthsAgo = new Date(ecfdate.getFullYear(), ecfdate.getMonth() - 6, ecfdate.getDate()); // Calculate the date six months before ecfdate

    // Set the time values to zero (optional if you want to compare dates only)
    selectedDate.setHours(0, 0, 0, 0);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    if (selectedDate < sixMonthsAgo) {
      alert('Invoice Date is greater than six months');
    }
  }

  showApprover = true
  batchwiseSelect(val) {
    if (val == 'Y')
      this.showApprover = false
    else if (val == 'N')
      this.showApprover = true
  }

  getBranches(keyvalue) {

    this.ecfservices.branchget(keyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.brList = datas;
      })
  }
  getbranchname() {
    let keyvalue: String = "";
    this.getBranches(keyvalue)
    this.OverallForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservices.branchget(value)
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
                this.ecfservices.getbranchscroll(this.brInput.nativeElement.value, this.currentpage + 1)
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
    // if ((this.OverallForm.controls['branch_id'].value == '') || (this.OverallForm.controls['branch_id'].value == null) || (this.OverallForm.controls['branch_id'].value == undefined)) {
    //   this.toastr.error('Please Choose Approver Branch');
    //   return false;
    // }
    let appkeyvalue: String = "";
    // this.getapprover(appkeyvalue);
    let comm = this.shareservice.commodity_id.value
    let branch = this.OverallForm.controls['branch_id'].value
    this.getapprover(appkeyvalue, branch);
    this.OverallForm.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.ecfservices.getECFapproverscroll(1, comm, this.raisedbyid, branch.id, value)
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
    this.ecfservices.getECFapproverscroll(1, comm, this.raisedbyid, branch.id, appkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;
      })
  }

  public displayFnApprover(approver?: approverListss): string | undefined {
    return approver ? approver.name + ' - ' + approver.code : undefined;
  }

  get approver() {
    return this.OverallForm.get('approvedby');
  }

  autocompleteapproverScroll() {
    let comm = this.shareservice.commodity_id.value
    let branch = this.OverallForm.controls['branch_id'].value
    // if (branch == "" || branch == null || branch == undefined)
    //   return false
    setTimeout(() => {
      if (
        this.matapproverAutocomplete &&
        this.autocompleteTrigger &&
        this.matapproverAutocomplete.panel
      ) {
        fromEvent(this.matapproverAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matapproverAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matapproverAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matapproverAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matapproverAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextapp === true) {
                this.ecfservices.getECFapproverscroll(this.currentpageapp + 1, comm, this.raisedbyid, branch.id, this.appInput.nativeElement.value)
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
  apinvHeader_id: any;
  viewindex: any
  OverallFormSubmits() {

    let submitform = this.OverallForm.value
    this.apinvHeader_id = this.InvoiceHeaderForm.value.invoiceheader[0].id
    let invheader = this.InvoiceHeaderForm.value.invoiceheader

    let j = 0
    for (let i in invheader) {
      if (this.PCAyesno == 1 && (+(String(invheader[i].invoiceamount).replace(/,/g, '')) > +this.PCA_bal_amount) && this.ecfstatus?.id != 2) {
        this.viewindex = parseInt(i) + 1;
        this.notification.showError("Invoice Amount exceeds the PCA Balnce Amount at line" + " " + this.viewindex)
        return false
      }
      if (invheader[i].invoicestatus != 'PENDING IN ECF APPROVAL') {
        if (invheader[i].invoicestatus != 'INVOICE COMPLETED') {
          this.viewindex = parseInt(i) + 1;
          // this.notification.showError("Please complete the invoice header at line" + " " + this.viewindex)
          this.notification.showError("Invoice, Credit, and Debit details must be saved before submitting. " + " " + this.viewindex)
          return false
        }
      }
      if (invheader[i]?.filedataas.length == 0) {
        this.toastr.error('Please Upload File and Save Invoice Header.');
        return false;
      }
      if (this.file_process_data[this.uploadFileTypes[0]]?.length != undefined ||
        this.file_process_data[this.uploadFileTypes[1]]?.length != undefined ||
        this.file_process_data[this.uploadFileTypes[2]]?.length != undefined ||
        this.file_process_data[this.uploadFileTypes[3]]?.length != undefined) {
        this.toastr.error('Please Save Invoice Header.');
        return false;
      }
      j++
    }
    if (Number(this.sum) > Number(this.ecftotalamount) || Number(this.sum) < Number(this.ecftotalamount)) {
      this.toastr.error('Check ECF Header Amount', 'Please Enter Valid Amount');
      return false;
    }
    console.log("this.ecfresult?.ecfstatus", this.ecfresult?.ecfstatus)

    if (this.ecfresult?.ecfstatus?.text == 'BATCH ECF RETURNED') {
      // submitform.batch_wise = 'Y'
      // submitform.approvedby = this.ecfresult.approver_id
      this.OverallForm.patchValue({
        batch_wise: 'Y',
        approvedby: this.ecfresult?.approver_id || '' // Handle null/undefined approver_id
      });
    }
    else if ((submitform.batch_wise == 'N' || submitform.batch_wise == null) && (submitform.approvedby.id == null || submitform.approvedby.id == undefined || submitform.approvedby.id == "")) {
      this.notification.showError("Please select Approver.")
      return false
    }
    else if ((submitform.batch_wise == 'N' || submitform.batch_wise == null) && submitform.approvedby.id != null && submitform.approvedby.id != undefined && submitform.approvedby.id != "") {
      submitform.approvedby = submitform.approvedby.id
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
      input = { id: this.apinvHeader_id, payment_instruction: submitform?.payment_instruction, is_tds_applicable: submitform?.is_tds_applicable }
    else
      input = { id: this.apinvHeader_id, approvedby: submitform.approvedby, payment_instruction: submitform?.payment_instruction, is_tds_applicable: submitform?.is_tds_applicable }

    this.SpinnerService.show();
    this.ecfservices.OverallAPSubmit(input)

      .subscribe(result => {
        this.SpinnerService.hide();

        if (result.status != "success") {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully ECF Created!...")
          this.closebuttonss.nativeElement.click();
          this.onCancel.emit()
          this.submitoverallbtn = true
          // this.shareservice.comefrom.next("invoicedetail")
          // this.router.navigate(['ECFAP/ecfapsummary'], {queryParams : {comefrom : "invoicedetail"}})
        }
      })
    this.restformdep = []
  }

  ecfupdateback() {
    this.closedpaybutton.nativeElement.click()
  }

  ecfupdatesubmit() {
    const data = this.ecfresults == undefined ? this.ecfresult : this.ecfresults
    console.log("ecfdata", this.ecfresults)
    let amt = String(this.ECFUpdateForm.value.apamount).replace(/,/g, '');
    if (amt == "" || amt == null || amt == undefined) {
      this.notification.showError("Please Enter ECF Amount");
      return false
    }

    let datas = {
      "supplier_type": data?.supplier_type_id,
      "commodity_id": data?.commodity_id?.id,
      "aptype": data?.aptype_id,
      "apdate": this.datePipe.transform(data?.apdate, 'yyyy-MM-dd'),
      "apamount": Number(data?.apamount) + Number(amt),
      "ppx": data?.ppx_id?.id ? data.ppx_id?.id : "",
      "notename": data?.notename,
      "remark": data?.remark,
      "payto": data?.payto_id?.id ? data?.payto_id?.id : "",
      "advancetype": "",
      "ppxno": "",
      "branch": data?.branch?.id,
      "is_raisedby_self": true,
      "raised_by": data?.raisedby,
      "location": "",
      "inwarddetails_id": data?.inwarddetails_id,
      // "is_originalinvoice":data?.is_originalinvoice,
      "crno": data?.crno
    }


    this.SpinnerService.show()
    this.ecfservices.editecfheader(datas, this.ecfheaderidd).subscribe(result => {
      this.SpinnerService.hide()
      if (result.id == undefined) {
        this.notification.showError(result?.description)
        return false
      }
      else {
        this.notification.showSuccess("Success")
        this.readecfdata = true
        this.ecfheaderForm.patchValue({
          apamount: result?.apamount
        })
        const control = <FormArray>this.InvoiceHeaderForm.get('invoiceheader');
        control.push(this.INVheader());
        const header = this.InvoiceHeaderForm.value.invoiceheader
        if (this.SupplierTypeID == 1) {
          if (this.ecftypeid == 2 || this.ecftypeid == 7 || this.ecftypeid == 14 || (this.ecftypeid == 4 && this.paytoid == 'S')) {
            this.notification.showInfo("Please Choose GST Applicable")
            for (let i = 1; i <= header.length; i++) {
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppname').setValue(header[0].suppname)
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppliergst').setValue(header[0].suppliergst)
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('suppstate').setValue(header[0].suppstate)
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplierstate_id').setValue(header[0].supplierstate_id)
              this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('supplier_id').setValue(header[0].supplier_id)
            }
          }
        }
        this.showinvheaderadd = true
        this.closedpaybutton.nativeElement.click()
      }
    })
  }
  imageUrl = environment.apiURL
  tokenValues: any
  showimageHeaderAPI: boolean
  showimagepdf: boolean
  jpgUrlsAPI: any
  data1(datas) {

    // this.showimageHeaderAPI = false
    // this.showimagepdf = false
    let id = datas?.file_id
    let filename = datas?.file_name
    // this.ecfservice.downloadfile(id)

    let stringValue = filename.split('.')
    let extension = stringValue[stringValue.length - 1]
    this.showimageHeaderAPI = false
    this.showimagepdf = false


    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    // const headers = { 'Authorization': 'Token ' + token }
    // let stringValue = filename.split('.')
    // let extension = stringValue[stringValue.length - 1]

    if (extension === "png" || extension === "jpeg" || extension === "jpg" ||
      extension === "PNG" || extension === "JPEG" || extension === "JPG") {

      // this.showimageHeaderAPI = true
      // this.showimagepdf = false

      this.jpgUrlsAPI = window.open(this.imageUrl + "ecfapserv/ecffile/" + id + "?token=" + token, '_blank');

    }
    // if (extension === "pdf" || extension === "PDF") {
    //   // this.showimagepdf = true
    //   // this.showimageHeaderAPI = false
    //   this.ecfservices.downloadfile1(id)
    //   // .subscribe((data) => {
    //   //   let dataType = data.type;
    //   //   let binaryData = [];
    //   //   binaryData.push(data);
    //   //   let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    //   //   window.open(downloadLink, "_blank");
    //   // }, (error) => {
    //   //   this.errorHandler.handleError(error);
    //   //   this.showimagepdf = false
    //   //   this.showimageHeaderAPI = false
    //   //   this.SpinnerService.hide();
    //   // })
    // }
    // if (extension === "csv" || extension === "ods" || extension === "xlsx" || extension === "txt" ||
    //   extension === "ODS" || extension === "XLSX" || extension === "TXT") {
    //   // this.showimagepdf = false
    //   // this.showimageHeaderAPI = false
    // }

    else if (extension === "pdf" || extension === "PDF") {
      // this.showimagepdf = true
      // this.showimageHeaderAPI = false
      this.ecfservices.downloadfile1(id)
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

  InvHdrColCount = 0
  getInvHdrColCount() {
    if (this.ecfheaderForm?.value?.aptype == 7) {
      this.InvHdrColCount = 10
    }
    else if (this.ecfheaderForm?.value?.aptype == 3 || this.ecfheaderForm?.value?.aptype == 13) {
      this.InvHdrColCount = 3
    }
    else if (this.ecftypeid == 4 && this.paytoid == 'E') {
      this.InvHdrColCount = 5
    }
    else if (this.ecftypeid == 2) {
      this.InvHdrColCount = 9
    }
    else {
      this.InvHdrColCount = 8
    }

    // if(this.showRecurFields && !this.showRecurDates)
    //   this.InvHdrColCount += 1
    // else if(this.showRecurDates)
    //   this.InvHdrColCount += 2
    if (this.PMDbranchdata.length > 0 && this.PMDyesno == 'N') {
      this.InvHdrColCount += 1
    }
    else if (this.PMDbranchdata.length > 0 && this.PMDyesno == 'Y') {
      this.InvHdrColCount += 2
    }
    else if (this.PCAyesno == 1) {
      this.InvHdrColCount += 1
    }
  }

  // showRecurFields = false
  // isRecurChanged(val){
  //   if(val.value == 1){
  //     this.showRecurFields = true
  //   }
  //   else{
  //     this.showRecurFields = false
  //   }
  // }

  RecurringTypes: any
  RecurringTypes1: any
  getRecurringType() {
    this.ecfservices.getRecurringType()
      .subscribe(result => {
        if (result['servicetype_dropdown']) {
          let serv = result['servicetype_dropdown']
          this.RecurringTypes = serv["data"].filter(x => x.id != 1)
          this.RecurringTypes1 = serv["data"].filter(x => x.id == 1)
        }

      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  showRecurDates = false
  isRecurChanged(val) {
    if (val.value == 0)
      this.showRecurDates = false
    else
      this.showRecurDates = true
  }


  setMonthAndYear(ev, input, i) {
    // const ctrlValue = this.date.value ?? moment();
    // ctrlValue.month(normalizedMonthAndYear.month());
    // ctrlValue.year(normalizedMonthAndYear.year());
    // this.date.setValue(ctrlValue);
    // datepicker.close();

    let { _d } = ev;
    console.log(_d)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('recur_fromdate').setValue(ev)
    this.InvoiceHeaderForm.get('invoiceheader')['controls'][i].get('recur_todate').setValue(ev)

    input._destroyPopup();
  }

  // chosenYearHandler(ev, input){
  //   let { _d } = ev;
  //   console.log(_d)
  //   this.finform.get('year').patchValue(_d) ;
  //   input._destroyPopup()
  // }

  showRecurMonth = false
  serviceTypeChanged(val) {
    if (val.id == 2)
      this.showRecurMonth = true
    else
      this.showRecurMonth = false
  }

  PCAyesno = 0
  PCAList
  setPCA(data) {
    this.PCAyesno = data.value
    if (this.commodityid) {
      if (this.PCAyesno === 1) {
        this.ecfservices.getPCA(this.commodityid, '', 1)
          .subscribe(result => {
            if (result) {
              this.PCAList = result['data'];
            }
            console.log("click if yes commodity this.commodityid------------->", this.commodityid)
            console.log("click if yes commodity this.ecfheaderForm.value.commodity_id------------->", this.ecfheaderForm.value.commodity_id)
          });
      } else {
        this.PCA_Det = [];
        this.PCA_bal_amount = 0;
      }
    } else {
      if (this.PCAyesno === 1) {
        this.ecfservices.getPCA(this.ecfheaderForm.value.commodity_id, '', 1)
          .subscribe(result => {
            if (result) {
              this.PCAList = result['data'];
            }
            console.log("click if yes, no commodity this.commodityid------------->", this.commodityid)
            console.log("click if yes, no commodity this.ecfheaderForm.value.commodity_id------------->", this.ecfheaderForm.value.commodity_id)
          });
      } else {
        this.PCA_Det = [];
        this.PCA_bal_amount = 0;
      }
    }


    this.getInvHdrColCount()
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
                console.log("scroll if this.commodityid------------->", this.commodityid)
                console.log("scroll if this.ecfheaderForm.value.commodity_id------------->", this.ecfheaderForm.value.commodity_id)
                if (this.has_next === true) {
                  this.ecfservices.getPCA(this.commodityid, this.pcaInput.nativeElement.value, this.currentpage + 1)
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
                // if (this.ecfheaderForm.value.commodity_id?.id) {
                //   this.ecfservices.getPCA(this.commodityid, this.pcaInput.nativeElement.value, this.currentpage + 1)
                //     .subscribe((results: any[]) => {
                //       let datas = results["data"];
                //       let datapagination = results["pagination"];
                //       if (this.PCAList.length >= 0) {
                //         this.PCAList = this.PCAList.concat(datas);
                //         this.has_next = datapagination.has_next;
                //         this.has_previous = datapagination.has_previous;
                //         this.currentpage = datapagination.index;
                //       }
                //     })
                // }
                // else {
                //   console.log("scroll else this.commodityid------------->",this.commodityid)
                //   console.log("scroll else this.ecfheaderForm.value.commodity_id------------->",this.ecfheaderForm.value.commodity_id)
                //   this.ecfservices.getPCA(this.ecfheaderForm.value.commodity_id, this.pcaInput.nativeElement.value, this.currentpage + 1)
                //     .subscribe((results: any[]) => {
                //       let datas = results["data"];
                //       let datapagination = results["pagination"];
                //       if (this.PCAList.length >= 0) {
                //         this.PCAList = this.PCAList.concat(datas);
                //         this.has_next = datapagination.has_next;
                //         this.has_previous = datapagination.has_previous;
                //         this.currentpage = datapagination.index;
                //       }
                //     })
                // }
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
    let pca = this.InvoiceHeaderForm.value.invoiceheader[0].pca_no
    this.PCA_bal_amount = +pca?.balance_amount
    this.PCA_Det = []
    this.PCA_Det.push(pca)
  }

  showTempInvHdrForm = false
  templatesList: any = []
  getTemplates() {
    this.copy_view_click = true
    this.popupopen9();
    this.showTempInvHdrForm = true
    if (this.templatesList.length != 0) {
      return false
    }
    this.SpinnerService.show()
    this.ecfservices.getInvoiceTemplates(this.ecftypeid)
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result.data[0]?.length > 0) {
          this.templatesList = result.data[0]
        }
        else {
          this.templatesList = []
        }
        if (this.templatesList.length == 0)
          this.closetempbutton.nativeElement.click();
      })
  }

  public displayFnTemplate(temp?: templatelists): string | undefined {
    return temp ? temp.name : undefined;
  }

  templateScroll() {
    setTimeout(() => {
      if (
        this.mattemplateAutocomplete &&
        this.mattemplateAutocomplete &&
        this.mattemplateAutocomplete.panel
      ) {
        fromEvent(this.mattemplateAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattemplateAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattemplateAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattemplateAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattemplateAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.ecfservices.getInvoiceTemplates(this.ecftypeid, this.frmInvHdrDet.controls['template'].value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"][0];
                    let datapagination = results["pagination"];
                    if (this.templatesList.length >= 0) {
                      this.templatesList = this.templatesList.concat(datas);
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

  resetTemp() {
    this.chooseTempForm.controls['template'].reset()
    this.selectedTemp = undefined
    this.selectedTempData = undefined
  }

  submitTemplate() {
    // this.popupopen7();
    if (this.chooseTempForm.value.template == '' || this.chooseTempForm.value.template == undefined || this.chooseTempForm.value.template == null) {
      this.notification.showError('Please Choose Template')
      return false
    }
    else {
      this.SpinnerService.show()
      this.ecfservices.getTemplateData(this.selectedTemp?.id)
        .subscribe(result => {
          this.SpinnerService.hide()
          if (result.data != undefined) {
            let data = result.data[0]
            data = { 'invoice_header': [data?.invoiceheader_json] }
            this.selectedTempData = data
            this.closetempbutton.nativeElement.click();
          }
          else {
            this.selectedTempData = undefined
            this.notification.showError('No Template Data')
            return false
          }
        })
    }
  }

  tempBack() {
    this.chooseTempForm.reset()
  }
  selectedTemp: any
  selectedTempData: any
  templateSelect(temp) {
    this.selectedTemp = temp
  }

  resetInvHdrTemp() {
    this.file_process_data = {}
    this.frmInvHdrDet.reset()
  }


  // tempCreateInvSec : any
  // createTemp( section){
  //   this.tempCreateInvSec = section
  // }

  // submitCreateTemp(){
  //   if(this.createTempForm.value.name == '' || this.createTempForm.value.name == undefined || this.createTempForm.value.name == null){
  //     this.notification.showError('Please Enter Template Name')
  //     return false
  //   }
  //     let data ={
  //       "apinvoiceheader_id": this.tempCreateInvSec?.value?.id,
  //       "name": this.createTempForm.value.name,
  //       "crno": this.tempCreateInvSec.value.apinvoiceheader_crno,
  //       "ecftype":this.ecftypeid
  //     }

  //     this.ecfservices.invoiceTemplateCreate(data)
  //     .subscribe(result => {
  //       if (result.code != "success") {
  //         this.notification.showError(result?.description)
  //         this.SpinnerService.hide()
  //         return false
  //       }
  //       else {
  //         this.notification.showSuccess("Successfully Template Created")
  //         this.SpinnerService.hide();
  //       }
  //     })
  // }
  // createtempBack(){
  //   this.createTempForm.reset()
  // }

  submitInvHdrTemp() {
    if (this.frmInvHdrDet.value.template == '' || this.frmInvHdrDet.value.template == undefined || this.frmInvHdrDet.value.template == null) {
      this.notification.showError('Please Select Template.')
      return false
    }
    if (this.ecftypeid != 3 && this.ecftypeid != 13) {
      if (this.frmInvHdrDet.value.invoiceno == '' || this.frmInvHdrDet.value.invoiceno == undefined || this.frmInvHdrDet.value.invoiceno == null) {
        this.notification.showError('Please Enter Invoice No.')
        return false
      }
      if (this.frmInvHdrDet.value.invoicedate == '' || this.frmInvHdrDet.value.invoicedate == undefined || this.frmInvHdrDet.value.invoicedate == null) {
        this.notification.showError('Please Select Invoice Date.')
        return false
      }
    }
    if (this.frmInvHdrDet.value.totalamount == '' || this.frmInvHdrDet.value.totalamount == undefined || this.frmInvHdrDet.value.totalamount == null) {
      this.notification.showError('Please Enter Invoice Amount.')
      return false
    }
    if (this.ecftypeid != 14 && this.frmInvHdrDet.value.invoiceamount == '' || this.frmInvHdrDet.value.invoiceamount == undefined || this.frmInvHdrDet.value.invoiceamount == null) {
      this.notification.showError('Please Enter Taxable Amount.')
      return false
    }
    if (this.frmInvHdrDet.value.filevalue.length == 0) {
      this.notification.showError('Please Upload File.')
      return false
    }
    this.frmInvHdrDet.value.totalamount = String(this.frmInvHdrDet.value.totalamount).replace(/,/g, '');
    this.frmInvHdrDet.value.invoiceamount = String(this.frmInvHdrDet.value.invoiceamount).replace(/,/g, '');
    let data = {
      "template_id": this.selectedTemp?.id,
      "apheader_id": this.ecfheaderidd,
      "invoiceno": this.ecftypeid != 3 && this.ecftypeid != 13 ? this.frmInvHdrDet.value.invoiceno : '',
      "invoicedate": this.datePipe.transform(
        this.ecftypeid != 3 && this.ecftypeid != 13 ? this.frmInvHdrDet.value.invoicedate : new Date(), 'yyyy-MM-dd'),
      "invoiceamount": +this.frmInvHdrDet.value.totalamount,
      "taxableamt": this.ecftypeid != 14 ? +this.frmInvHdrDet.value.invoiceamount : +this.frmInvHdrDet.value.totalamount,
      "file_key": [this.uploadFileTypes[0], this.uploadFileTypes[1], this.uploadFileTypes[2], this.uploadFileTypes[3]]
    }

    for (let type of this.uploadFileTypes) {
      this.formData.delete(type);
      let pairvalue = this.file_process_data[type];
      if (pairvalue != undefined && pairvalue != "") {
        for (let fileindex in pairvalue) {
          this.formData.append(type, this.file_process_data[type][fileindex])
        }
      }
    }

    // this.formData.delete('file0');
    // let pairvalue = this.file_process_data['file0'];
    // if (pairvalue != undefined && pairvalue != "") {
    //   for (let fileindex in pairvalue) {
    //     this.formData.append('file0', this.file_process_data['file0'][fileindex])
    //   }
    // }
    this.formData.delete('data');
    this.formData.append('data', JSON.stringify(data));
    this.SpinnerService.show()
    this.ecfservices.dynamicCreateECF(this.formData)
      .subscribe(result => {
        if (result?.status != "success") {
          this.notification.showError(result?.description)
          this.SpinnerService.hide()
          return false
        }
        else {
          this.resetInvHdrTemp()
          this.notification.showSuccess("Successfully Invoice Created")
          this.file_process_data = {}
          // this.file_process_data["file" + 0] = []
          this.currentattachfile_summary(0)
          this.SpinnerService.show()
          this.ecfservices.getecfheader(this.ecfheaderidd)
            .subscribe(result => {
              if (result.code == undefined) {
                this.SpinnerService.hide();
                this.InvoiceHeader = result['invoice_header']
                this.invoiceheaderres = result['invoice_header']
                this.getinvoicehdrrecords(result)
                this.closeInvHdrDet.nativeElement.click()
                this.showTempInvHdrForm = false
              }
            })
        }
      })

  }

  invHdrDetBack() {
    // this.resetInvHdrTemp()
    if (this.showTempInvHdrForm) {
      this.file_process_data = {}
      this.closeInvHdrDet.nativeElement.click()
    }
    this.frmInvHdrDet.reset()
    this.showTempInvHdrForm = false
    // this.closeInvHdrDet.nativeElement.click()
  }

  Notespopup() {
    this.popupopen();
  }

  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.querySelector(".bd-example-modal-xl"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
    // const modalElement = document.querySelector(".bd-example-modal-xl"); // Use querySelector for a single element
    // if (modalElement) {
    //   const myModal = new (bootstrap as any).Modal(modalElement, {
    //     backdrop: "static",
    //     keyboard: false,
    //   });
    //   myModal.show();
    // } else {
    //   console.error("Modal element with class 'bd-example-modal-xl' not found.");
    // }
  }

  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("create-ecf-0003"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("create-ecf-0004"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  SummaryApipreviouslyAttechedFilesObjNew: any;
  SummaryApiCurrentlyAttechedFilesObjNew: any;
  SummaryCurrentlyAttechedFiles: any = [
    { columnname: "File Name", key: "name" },
    // {
    //   columnname: "View", key: "view", icon: "open_in_new",
    //   "style": { color: "blue", cursor: "pointer" },
    //   button: true, function: true, clickfunction: this.filepreview.bind(this)
    // },
    {
      columnname: "Document Type", key: "doc", icon: "open_in_new",
      "style": { color: "blue", cursor: "pointer" },
      button: true, function: true, clickfunction: this.filepreview.bind(this)
    },
    {
      columnname: "Delete",
      key: "delete",
      button: true,
      function: true,
      validate: true,
      style: { cursor: "pointer" },
      validatefunction: this.deletevalidatefunction.bind(this),
      clickfunction: this.deletefileUpload.bind(this),
      // columnname: "Delete ", key: "delete", icon: "delete",
      // "style": { color: "red", cursor: "pointer" },
      // button: true, function: true, 
      // clickfunction: this.deletefileUpload.bind(this),
      // validate:true,validatefunction:this.deletevalidatefunction.bind(this)
    },
  ]

  SummarypreviousAttechedFiles: any = [
    { columnname: "Document Type", key: "document_type" },
    //   {columnname: "View", key: "view", icon: "open_in_new",
    //   "style": { color: "blue", cursor: "pointer" },
    //   button: true, function: true, clickfunction: this.data1.bind(this)
    // },
    { columnname: "File Name", key: "file_name",tooltip:true },
    // {
    //   columnname: "Download", key: "download", icon: "download",
    //   "style": { color: "blue", cursor: "pointer" },
    //   button: true, function: true, clickfunction: this.getfiles.bind(this)
    // },
    {
      columnname: "Action", key: "action", "tooltip": "View/Open",
      icon: "arrow_forward",
      style: { color: "blue", cursor: "pointer" },
      button: true,
      function: true,
      clickfunction: this.data1.bind(this),
    },
    {
      columnname: "Delete ", key: "delete", icon: "delete",
      "style": { color: "red", cursor: "pointer" },
      button: true, function: true, clickfunction: this.fileDeletes.bind(this)
    },]
  currentattachfile_summary(index) {
    this.SummaryApiCurrentlyAttechedFilesObjNew = {
      FeSummary: true,
      data: this.file_process_data["file" + index]
    }
  }
  previousattachfile_summary() {
    this.SummaryApipreviouslyAttechedFilesObjNew = {
      FeSummary: true,
      data: this.filedatas
    }
  }




  popupopen4() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("create-ecf-0004"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen5() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("create-ecf-0005"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  suppliersearch: any = [
    { "type": "input", "label": "Supplier GST Number", "formvalue": "gstno", id: "create-ecf-0119" },
    { "type": "input", "label": "Supplier Code", "formvalue": "code", id: "create-ecf-0120" },
    { "type": "input", "label": "PAN Number", "formvalue": "panno", id: "create-ecf-0121" },
    // { "type": "dropdown", inputobj: this.choosesupplierfield, "formvalue": "name",defaultsearch:true },
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

  approverdata(approver) {
    console.log("SDsasd", approver)
    this.branch_id = approver
  }
  selectedvaluess(dddddd) {
    console.log("SDsasd", dddddd)
  }

  appbranchdatas(e) {
    console.log("event", e);
    this.OverallForm.patchValue({
      branch_id: e,
    });

  }
  appnamedatas(e) {
    console.log("event", e);
    this.OverallForm.patchValue({
      approvedby: e,
    });
  }
  addclick() {
    this.popupopen6()
  }

  popupopen6() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("approversubmit"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  popupopen7() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("create-ecf-0152"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  popupopen9() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("create-ecf-0152"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }


  uploadPopShow = false
  UploadPopupOpen(i) {
    this.popupopen10()
    this.invdtladdonid = i
    if (i != -1) {
      this.invhdrForm = ''
      if (this.readinvhdrdata != false || this.InvoiceHeaderForm.value.invoiceheader[this.invdtladdonid].invoicegst == '') {
        this.uploadPopShow = false
      }
      else {
        this.uploadPopShow = true
      }
    }
    else if (i == -1) {
      this.closeInvHdrDet.nativeElement.click()
      this.invhdrForm = 'frmInvHdrDet'
      this.uploadPopShow = true
    }
  }
  popupopen10() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("copyfilepopup"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  UploadPopupOpens(i) {
    this.popupopen11()
    this.invdtladdonid = i
    if (i != -1) {
      this.invhdrForm = ''
      if (this.readinvhdrdata != false || this.InvoiceHeaderForm.value.invoiceheader[this.invdtladdonid].invoicegst == '') {
        this.uploadPopShow = false
      }
      else {
        this.uploadPopShow = true
      }
    }
    else if (i == -1) {
      this.closeInvHdrDet.nativeElement.click()
      this.invhdrForm = 'frmInvHdrDet'
      this.uploadPopShow = true
    }
  }

  popupopen11() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("fileUploaddpopup"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }

  uploadback() {
    this.file_process_data2 = {}
    // this.popupopen9()
    this.uploadPopShow = false
    this.closedbuttons.nativeElement.click()
    if (this.invhdrForm != 'frmInvHdrDet') {
      this.invHdrDetBack()
    }
    else {
      this.showTempInvHdrForm = true
    }
    this.fileUploaded = this.fileUploadChk()
  }


  // uploadSubmit() {
  //   let data
  //   if (this.invdtladdonid != -1)
  //     data = this.InvoiceHeaderForm.value.invoiceheader;
  //   else
  //     data = this.frmInvHdrDet.value
  //   for (var i = 0; i < this.valid_arr.length; i++) {
  //     if (this.invdtladdonid != -1) {
  //       data[this.invdtladdonid]?.filevalue?.push(this.valid_arr[i])
  //       data[this.invdtladdonid]?.filedataas?.push(this.valid_arr[i])
  //     }
  //     else {
  //       data?.filevalue?.push(this.valid_arr[i])
  //     }
  //   }

  //   if (this.valid_arr.length > 0) {
  //     if (this.invdtladdonid != -1 && data[this.invdtladdonid]?.file_key.length < 1) {
  //       data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[0]);
  //       data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[1]);
  //       data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[2]);
  //       data[this.invdtladdonid]?.file_key?.push(this.uploadFileTypes[3]);
  //     }
  //   }
  //   this.file_process_data = this.file_process_data2
  //   this.file_process_data2 = {}
  //   this.uploadclose.nativeElement.click()
  //   this.closedbuttons.nativeElement.click()
  //   this.fileInput.nativeElement.value= ""

  //   console.log('this.file_process_data------------->>>>>>>>>>>', this.file_process_data)

  // }

uploadSubmit() {
  let data;
  if (this.invdtladdonid != -1)
    data = this.InvoiceHeaderForm.value.invoiceheader;
  else
    data = this.frmInvHdrDet.value;

  Object.keys(this.file_process_data2).forEach(type => {
    const files = this.file_process_data2[type];
    for (let file of files) {
      if (this.invdtladdonid != -1) {
        data[this.invdtladdonid]?.filevalue?.push(file);
        data[this.invdtladdonid]?.filedataas?.push(file);
      } else {
        data?.filevalue?.push(file);
      }
    }
  });

  if (Object.keys(this.file_process_data2).length > 0) {
    if (this.invdtladdonid != -1 && data[this.invdtladdonid]?.file_key.length < 1) {
      this.uploadFileTypes.forEach(type => {
        data[this.invdtladdonid]?.file_key?.push(type);
      });
    }
  }

  if (!this.file_process_data) {
    this.file_process_data = {};
  }
  Object.keys(this.file_process_data2).forEach(type => {
    if (!this.file_process_data[type]) {
      this.file_process_data[type] = [];
    }
    this.file_process_data[type] = [
      ...this.file_process_data[type],
      ...this.file_process_data2[type]
    ];
  });

  this.file_process_data2 = {};   // clear temp storage
  this.uploadclose.nativeElement.click();
  this.closedbuttons.nativeElement.click();
  this.fileInput.nativeElement.value = "";

  console.log('this.file_process_data -----> ', this.file_process_data);
    this.preparePagedFiles();

}


    backfindsupplier() {
    this.SelectSupplierForm.reset();
  }


allFiles: any[] = [];
pagedFiles: any[] = [];

length_PymtAdv = 0;
pagesize_PymtAdv = 10;
pageIndexPymtAdv = 0;
pymtAdvpresentpage = 1;
pageSizeOptions = [5, 10, 25];
showFirstLastButtons = true;
isPymtAdvpage = true;

preparePagedFiles() {
  this.allFiles = [];

  Object.keys(this.file_process_data).forEach(type => {
    this.file_process_data[type].forEach((file: any) => {
      this.allFiles.push({ type, file });
    });
  });

  this.length_PymtAdv = this.allFiles.length;
  this.updatePagedFiles();
}

updatePagedFiles() {
  const startIndex = this.pageIndexPymtAdv * this.pagesize_PymtAdv;
  const endIndex = startIndex + this.pagesize_PymtAdv;
  this.pagedFiles = this.allFiles.slice(startIndex, endIndex);
}

handlePymtAdvPageEvent(event: PageEvent) {
  this.pagesize_PymtAdv = event.pageSize;
  this.pageIndexPymtAdv = event.pageIndex;
  this.pymtAdvpresentpage = event.pageIndex + 1;
  this.updatePagedFiles();
}

}










