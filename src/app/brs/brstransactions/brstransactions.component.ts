import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "src/app/service/notification.service";
import { MatTableDataSource } from "@angular/material/table";
import { BrsApiServiceService } from "../brs-api-service.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { LedgerData } from "../models/ledger-data";
import { SelectionModel } from "@angular/cdk/collections";
import { BstatementData } from "../models/bstatement-data";
import { Location } from "@angular/common";
import { AutoknockoffData } from "../models/autoknockoff-data";
import { DatePipe } from "@angular/common";
import {
  fromEvent,
  interval,
  Observable,
  Observer,
  Subscription,
  timer,
} from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
// import { resourceLimits } from "worker_threads";
import { MatAccordion, MatExpansionPanel } from "@angular/material/expansion";
import { SharedService } from "../../service/shared.service";
import { TaService } from "../../ta/ta.service";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { ToastrService } from "ngx-toastr";
import { param } from "jquery";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { environment } from "src/environments/environment";
import { COMMA, ENTER, I, P } from "@angular/cdk/keycodes";
import { error } from "console";
import { TnebShareService } from "src/app/tneb/tneb-share.service";
// import { catlistss } from "src/app/ECF/ecf-inventory/ecf-inventory.component";

declare var bootstrap: any;
interface Item {
  name: string;
  id: string;
  value: string;
}
interface popupEntry {
  data: {
    digit: string;
    fas_type: number;
    fas_id: number[];
    cbs_type: number;
    cbs_id: number[];
  }[];
}
interface Payload {
  Date: string;
  edit: number;
  tag_id: popupEntry[];
  parent_id_fas?: any;
  parent_id_cbs?: any;
  type_fas?: any;
  type_cbs?: any;
}

interface popupEntry {
  digit: string;
  fas_type: number;
  fas_id: number[];
  cbs_type: number;
  cbs_id: number[];
}

export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
export interface catlistss {
  id: any;
  name: string;
  code: any;
}
export interface subcatlistss {
  id: any;
  name: string;
  code: string;
}
export interface bslistss {
  id: any;
  name: string;
  code: any;
}
export interface cclistss {
  id: any;
  name: string;
  code: any;
}
export interface entype {
  id: any;
  name: string;
}
export class State {
  constructor(public id: any, public name: any) {}
}
@Component({
  selector: "app-brstransactions",
  templateUrl: "./brstransactions.component.html",
  styleUrls: ["./brstransactions.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class BrstransactionsComponent implements OnInit {
  ip = environment.apiURL;
  accUrl: any = this.ip + "brsserv/ars_unmatch_record";
  branchUrl: any = this.ip + "brsserv/ars_unmatch_record";
  url: any = this.ip + "brsserv/ARS_Dropdown";

  StatusList: any = [
    { id: "1", value: "SYSTEM MATCH DONE" },
    { id: "2", value: "MANUAL MATCH PENDING" },
    { id: "3", value: "PASSED JW" },
    { id: "4", value: "PASSED GEFU" },
    { id: "5", value: "RECONCILED" },
  ];

  externalstatus: any = {
    searchkey: "",
    params: "",
    displaykey: "value",
    label: "Status",
    Outputkey: "match",
    fronentdata: true,
    data: this.StatusList,
  };

  Summarylist: any = [{ id: "1", value: "01/01/23--123456789--1111" }];

  externalsummary: any = {
    searchkey: "",
    params: "",
    displaykey: "value",
    label: "Select Summary",
    Outputkey: "match",
    fronentdata: true,
    data: this.Summarylist,
  };

  statusList: any = [
    { id: "1", value: "System Match Done" },
    { id: "3", value: "Manual Match Pending" },
    { id: "4", value: "Passed JW" },
    { id: "5", value: "Passed GEFU" },
    { id: "6", value: "Reconciled" },
    { id: "2", value: "Pending" },
  ];
  amountList: any = [
    { id: "1", value: "FAS Balance" },
    { id: "2", value: "CBS Balance" },
    { id: "3", value: "Difference" },
  ];
  conditionList: any = [
    { id: "2", name: "Greater than" },
    { id: "3", name: "Less than " },
    { id: "1", name: "Equal to" },
  ];
  arsStatus: any = {
    searchkey: "",
    params: "",
    displaykey: "value",
    label: "ARS Status",
    Outputkey: "match",
    fronentdata: true,
    data: this.statusList,
  };

  arsAmount: any = {
    searchkey: "",
    params: "",
    displaykey: "value",
    label: "Amount Type",
    Outputkey: "matchs",
    fronentdata: true,
    data: this.amountList,
     formcontrolname: 'amount_type'
  };
  arsAmountconditions: any = {
    searchkey: "",
    params: "",
    displaykey: "name",
    label: "Condition",
    Outputkey: "matchs",
    fronentdata: true,
    data: this.conditionList,
     formcontrolname: 'amount_con'
  };

  searchvar: any = {
    method: "get",
    searchkey: "gl_no",
    params: "",
    displaykey: "gl_code",
    label: "Account/GL",
    disabled: false,
    defaultvalue: "",
    wholedata: true,
  };
  searchvar1: any = {
    method: "get",
    searchkey: "branch_code",
    url: this.branchUrl,
    params: "",
    displaykey: "branch",
    label: "Branch Code",
    disabled: false,
    defaultvalue: "",
    wholedata: true,
    Depkey: "gl_code",
    DepValue: "gl_no",
  };
  template_search_summary_apis:any;
  entry_table_summary_get:any;
  template_search_summary_api_history:any;
  sumarytable_get_gl_count:any;
  autofetch_summary_wgl:any
  combineDataForm: FormGroup;
  externalform: FormGroup;
  externalhistory: FormGroup;
  externaljwreport: FormGroup;
  remarks: FormGroup;
  remarksClose: FormGroup;
  remark: FormGroup;
  resetForm: any;
  resetFormpopup: any;
  resetintegritytype: any;
  reset_template_name: any;
  branch_name_reset: any;
  resetFormdata: any;
  resetFormstatus: any;
  resetamounttype: any;
  resetamount_con: any;
  arr: popupEntry[] = [];
  brsconcile: FormGroup;
  digit: FormGroup;
  wisefinUpload: FormGroup;
  bankstmtupload: FormGroup;
  actionKnock: FormGroup;
  externalpagechip: boolean = true;
  showfirsttable: boolean = true;
  showknockofftable: boolean = false;
  displaybuttons: boolean = true;
  confirmbutton: boolean = false;
  showuploads: boolean = true;
  confirmknockoff: boolean = false;
  showBRS: boolean = false;
  showGLentry: boolean = true;
  showmanualtagno: boolean = false;
  Swiper: any;
  templates: any;
  accounts: any;
  ntemplates: any;
  ars_status: any;
  filterForm: FormGroup;
  pipe: DatePipe;
  isExpanded: boolean = true;
  isExpandeds: boolean = true;
  showmanualtagnocbs: boolean = false;
  datal: any;
  mirror: any;
  selectedValue: any;
  isLoading: boolean = false;
  selectednew: any = {};
  fas_edit: any;
  columnList: any[];
  // checkboxLabel: any;
  fileuploadprogress: boolean = false;
  fileuploadcomplete: boolean = false;
  valuess: any;
  subscription: Subscription;
  schedulerstat: any;
  wisefinscheduler: any;
  cbsscheduler: any;
  showstatuss: boolean = true;
  displayactionK: boolean = false;
  empbranchid: any;
  currentUser: string;
  makerUser: boolean;
  branchCodeEmp: any;
  adminUsers: boolean;
  interRole: any;
  interPermission: any;
  adminUser: boolean = false;
  normalUser: boolean = false;
  run_proces: boolean = false;
  showedit: boolean = false;
  fasselectoptionreset:any
  fasselectoptionresetunsave:any
  cbsselectoptionresetunsave:any
  cbsselectoptionreset:any
  schuduler: string;
  schudulers: string;
  wisfin_file: any;
  cbs_file: any;
  has_nexttab: any;
  has_previoustab: any;
  presentpagetab: any;
  match: any;
  total: any;
  unmatch: any;
  savepayloads: any =[];
  @ViewChild("closebutton") closebtn: ElementRef;
  @ViewChild("closebuttonremarks") closebuttonremarks: ElementRef;
  @ViewChild("closebuttonclosed") closebuttonclosed: ElementRef;
  @ViewChild("tabGroup") tabGroup: MatTabGroup;
  @ViewChild("paginationDiv") paginationDiv: ElementRef;
  @ViewChild("inputField") inputField: ElementRef;
  @ViewChild('closebuttonautofetch') closebuttonautofetch:ElementRef
  categoryList: Array<catlistss>;
  subCategoryList: Array<subcatlistss>;
  bsNameData: Array<bslistss>;
  ccNameData: Array<cclistss>;

  entryOptions: any[] = [
    { id: 1, name: "Debit" },
    { id: 2, name: "Credit" },
  ];

  @Output() linesChange = new EventEmitter<any>();

  selectedTabIndex = 0;
  int_branch: any;
  int_gl: any;
  int_dict: any;
  fasdatavalue: any;
  gl_data1: any;
  gl_data2: any;
  gl_data3: any;
  fasheadervalue: any;
  fasHeaders: any = [];
  cbsdatavalue: any;
  cbsheadervalue: any;
  action: any;
  fas_action: any;
  edittagvar: any;
  chipSelectedObj: any = [];
  selectedOption: any;
  selectedMainTabIndex: number = 0;
  selectedSubTabIndex: number = 0;
  actionChange: boolean = false;
  // categoryList: any = [];
  @ViewChild("cattype") matcatAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("categoryInput") categoryInput: any;
  @ViewChild("subcategorytype") matsubcatAutocomplete: MatAutocomplete;
  @ViewChild("subcategoryInput") subcategoryInput: any;
  @ViewChild("bstype") matbsAutocomplete: MatAutocomplete;
  @ViewChild("bsInput") bsInput: any;
  @ViewChild("cctype") matccAutocomplete: MatAutocomplete;
  @ViewChild("ccInput") ccInput: any;
  @ViewChild("entype") matenAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  // entry_type: any = [
  //   {  id: 1,name: "Debit" },
  //   {  id: 2,name: "Credit" }
  // ]\
  filteredStates: Observable<any[]>;

  states: State[] = [
    { id: 1, name: "Debit" },
    { id: 2, name: "Credit" },
  ];
  entry_type = [
    { id: 1, name: "Debit" },
    { id: 2, name: "Credit" },
  ];
  listOfObjs: Item[] = [
    { name: "System Match", id: "1", value: "1" },
    { name: "Manual Match", id: "2", value: "2" },
    { name: "All", id: "3", value: "3" },
  ];
  Comparisons: any = [
    { id: "1", value: "Equal" },
    { id: "2", value: "Less than Equal" },
    { id: "3", value: "Greater than Equal" },
  ];
  fasheaderlist: Item[] = [
    { name: "Branch Code", id: "1", value: "1" },
    { name: "Transaction Date", id: "2", value: "2" },
    { name: "Amount", id: "3", value: "3" },
    { name: "Tag Number", id: "4", value: "4" },
    { name: "Dr/Cr", id: "5", value: "5" },
    { name: "Entry Gid", id: "6", value: "6" },
    { name: "Entry Crno", id: "7", value: "7" },
    { name: "Entry Module", id: "8", value: "8" },
    { name: "Remark", id: "9", value: "9" },
  ];
  cbsheaderlist: Item[] = [
    { name: "Branch Code", id: "1", value: "1" },
    { name: "Transaction Date", id: "2", value: "2" },
    { name: "Amount", id: "3", value: "3" },
    { name: "Tag Number", id: "4", value: "4" },
    { name: "Dr/Cr", id: "5", value: "5" },
    { name: "Narration", id: "6", value: "6" },
  ];
  fasmanualheaderlist: Item[] = [
    { name: "Branch Code", id: "1", value: "1" },
    { name: "Transaction Date", id: "2", value: "2" },
    { name: "Amount", id: "3", value: "4" },
    { name: "Dr/Cr", id: "4", value: "4" },
    { name: "Tag Number", id: "5", value: "5" },
    // { name: "Action", id: "6", value: "6" },
    { name: "Entry Gid", id: "7", value: "7" },
    { name: "Entry Crno", id: "8", value: "8" },
    { name: "Entry Module", id: "9", value: "9" },
    { name: "Remark", id: "10", value: "10" },
  ];
  cbsmanualheaderlist: Item[] = [
    { name: "Branch Code", id: "1", value: "1" },
    { name: "Transaction Date", id: "2", value: "2" },
    { name: "Amount", id: "3", value: "3" },
    { name: "Tag Number", id: "4", value: "4" },
    { name: "Dr/Cr", id: "5", value: "5" },
    // { name: "Action", id: "4", value: "4" },
    { name: "Narration", id: "6", value: "6" },
  ];
  tabledata: any = [];
  parentCheck: any = [];
  recorddata: any;
  integritydata: any;
  iDate: string;
  glcode_id: any;
  branchcode: any;
  branch_code: any;
  branch_codeid: any;
  countlist: any;
  iarsDate: string;
  filterdata_id: any;
  cbstabledata: any = [];
  fas_amount: any;
  fas_unmatch_count: any;
  cbs_match_count: any;
  fas_match_count: any;
  cbs_unmatch_count: any;
  cbs_amount: any;

  mainpage: boolean = true;
  summarypage: boolean;
  externalpage: boolean = false;
  summarydatalist: any[]=[]
  action_id_fas_array: any[] = [];
  action_id_cbs_array: any[] = [];
  type_array_fas: any[] = [];
  type_array_cbs: any[] = [];

  fasarray: any[] = [];
  cbsarray: any[] = [];
  fas_file_name: any;
  cbs_file_name: any;
  uploadedfasFileName: any
  uploadedcbsFileName: any
  fassearch: FormGroup;
  cbssearch: FormGroup;
  fasbranch_code: any;
  fasgl_number: any;
  fastranactiondate: any;
  fascreditdebit: any;
  fasothers: any;
  cbsbranch_code: any;
  cbsglnumber: any;
  cbstranactiondate: any;
  cbscreditdebit: any;
  cbsamount: any;
  fasfromdate_date: string;
  fasenddate_date: string;
  cbs_unmatch_amount: any;
  fas_unmatch_amount: any;
  actiontype: any;
  fasaction: FormGroup;
  cbsaction: FormGroup;
  cbsactiontype: any;
  fasactiontype: any;
  edit_tag_no: any;
  filetype: number;
  tag_no_id: any;
  tag_type_no: any;
  tagnumber: any;
  actionid: any;
  fas_update_date: any;
  fas_branchcode: any;
  fas_gl_code: any;
  action_id: any;
  fas_action_id: any;
  patch_action: string;
  Gid1: any;
  Transactiondatepatch1: any;
  DebitandCredit1: any;
  Amountt1: any;
  branch: any;
  tag: any;
  cbsglnumber2: any;
  AmtComparison: any;
  tag_no_id2: any;
  tag_no2_id: any;
  tag_type_no2: any;
  tagnumber2: any;
  edit_tag_no2: any;
  tag_type2_no: any;
  fas_gl_no: any;
  cbs_gl_no: any;
  fasBrsPayload: {
    data: {
      digit: any;
      fas_id: any[];
      fas_type: number;
      cbs_id: any[];
      cbs_type: number;
    }[];
  };
  canEdit: any;
  touchedfasAction: any = [];
  touchedcbsAction: any = [];
  type: any;
  cbs_edit: any;
  tabledatasystem: any = [];
  type_array_fas_edit: any = [];
  type_array_cbs_edit: any = [];
  tabledataManual: any = [];
  cbstabledataManual: any = [];
  fas_color_id: any;
  cbs_color_id: any;
  parentIdfas: any = [];
  parentIdcbs: any = [];
  action_id_fas_array_assign: any = [];
  action_id_cbs_array_assign: any = [];
  type_array_fas_assign: any = [];
  type_array_cbs_assign: any = [];
  selectednews: any = {};
  fas_tag_alpha: any;
  payload: any;
  payloadArray: any = [];
  chipSelectedId: any = [];
  @ViewChild("DropInput") DropInput: any;
  @ViewChild("field") field: any;

  readonly separatorsKeysCodes: number[] = [ENTER, COMMA];
  viewDataLists: any = [];
  viewHistoryLists: any = [];
  runprocessList: any = [];
  runprocesscbs: any = [];
  runprocessfas: any = [];
  fasFiles: any = [];
  cbsFiles: any = [];
  nodatafound: boolean = false;
  paginationBottom: number = 0;
  nodatafoundfas: boolean = false;
  nodatafoundcbs: boolean = false;
  persistedData: any;
  fasFilesIds: any;
  cbsFilesIds: any;
  selectedStatus: any;
  matchstatus: any;
  matchgl: any;
  matchsummary: any;
  eventId: any;
  dataId: any;
  typeId: any;
  digitValue: string;
  key: any;
  fas_edit_array: any = [];
  newdataArray: any = [];
  int_dict_whole: any;
  int_dict_wholeCbs: any;
  data1: any = {};
  cbs_edit_array: any;
  fromDateee: any;
  toDateee: any;
  validation: boolean = false;
  page: number = 1;
  chipSelectedObj1: any = [];
  chipSelectedId1: any = [];
  narration: any;
  narrationn: any;
  chipSelectedObj3: any = [];
  chipSelectedId3: any = [];
  chipSelectedObj2: any = [];
  chipSelectedId2: any = [];
  payArr: any = [];
  combinedData: any = [];
  catId: any;
  has_nextsub: any;
  has_previoussub: any;
  currentpagesub: number;
  bsId: any;
  ccId: any;
  cccode: any;
  ccdataid: any;
  combinePayload: any = [];
  CombineArray: any = [];
  CombineArraySubmit: any = [];
  currentpagebs: any;
  has_nextbs: any;
  has_previousbs: any;
  currentpagecc: number;
  has_nextcc: any;
  has_previouscc: any;
  has_nextcat: any;
  has_previouscat: any;
  currentpagecat: any;
  entry_typeId: any;
  currentpagedrop: number = 1;
  has_nextdrop: boolean = true;
  has_previousdrop: boolean = true;
  has_nextccdrop: boolean = true;
  has_previousccdrop: boolean = true;
  currentpageccdrop: number = 1;
  filteredOptions: any = [];
  category: any;
  subcategory: any;
  bs: any;
  cc: any;
  readonlyy: boolean = false;
  deleteIcon: boolean = false;
  edit_type: any;
  showpopup: boolean = false;
  filtername: string;
  closedArray: any = [];
  closedcheckedItems: any = [];
  onlyread: boolean = false;
  fasOrcbs: any;
  deleteVisible: boolean = false;
  trans_date: any;
  disableedit: boolean = false;
  closedList: any = [];
  closedListfas: any = [];
  closedListcbs: any = [];
  convertedDate: string;
  selectedRecFasList: any = [];
  selectedRecCbsList: any = [];
  externalvalue = 1;
  temp_name: any;
  cbsKeys: string[];
  wisefinKeys: string[];
  datas1: any;
  cbsdatas: any;
  wisefindatas: any;
  dd_show: boolean = false;
  table_show: boolean = true;
  arsURL = environment.apiURL;
  temp_field: any;
  temp_field_arsaction: any;
  inttype: any;
  statuslists: any;
  branch_datas: any;
  template_name: any;
  compareform: FormGroup;
  disable_gl: number;
  multiplecheckbox: any = 0;
  compareglcheckbox: any = 0;
  hidebranch: number = 0;
  hidecomparecheckbox: any;
  fetch_template: any;
  viewdata_temp_name: any;
  viewdata_temp_names: any;
  fetch_template_name: any;
  new_fas_cbs_fetch_values: any;
  radiobuttonform: FormGroup;
  dd_validation_template: number=1;
  autofetchsumlist: any[]=[]
  autofetchsumlist_gl_branch: any[]=[]
  viewtabchange: any;
  int_type: any;
  faspagesize: any=10
  cbspagesize: any=10
  optionneedtopatch: any;
  selectallcondition: boolean=false
  faspatchyes: any;
  optionneedtopatchcbs: any;
  selectallconditioncbs: boolean=false
  cbspatchyes: any;
  fassytammatchsearchlist: any[]=[]
  cbssytammatchsearchlist: any[]=[]
  resetfasselectalloption:any
  resetcbsselectalloption:any
  showhidebuttons: any;
  faspageform=new FormControl()
  jwpagelimitform=new FormControl()
  summarytableform=new FormControl()
  cbspageform=new FormControl()
  fasselectall=new FormControl()
  fas_tag_no=new FormControl()
  cbs_tag_no=new FormControl()
  fas_tag_no_select=new FormControl()
  cbs_tag_no_select=new FormControl()
  cbsselectall=new FormControl()
  entrytableselectformbs=new FormControl()
  entrytableselectformentrytype=new FormControl()
  entrytableselectformcc=new FormControl()
  entrytableselectformdesc=new FormControl()
  entrytabledescform=new FormControl()
  entrytableccform=new FormControl()
  entrytablebsform=new FormControl()
  entrytable_entry_type_form=new FormControl()
  summarytabselectall=new FormControl()
  fasmatchedselectform=new FormControl()
  cbsmatchedselectform=new FormControl()
  sumamrytableremarks=new FormControl()
  
  unqiueDates: any = [];
  summarypagesize: any=10
  int_type_wholedata: any;
  fileform: FormGroup;
  firstempname: any;
  fas_count_manualmatching: any;
  cbs_count_manualmatching: any;
  summarytable_count: any='0'
  GL_count: any='0'
  fas_count_sysandmanualmatched: any;
  cbs_count_sysandmanualmatched: any;
  jw_branch_code: any;
  subcatgl_id: any;
  subtab_action_id: any;
  firstempname_autof: any;
  branch_codeid_autofetch: any
  glcode_id_autofetch: any
  autofetch_summary_with_gl: { method: string; url: string; params: string; };
  view_data_current: { method: string; url: string; params: string; };
  // bsNameData: any = [];
  // subCategoryList: any = [];

  amountType: any;
  amountlistcondition: any;
  selectallarray: any[]=[]
  credit_amount: any='0'
  debit_amount: any='0'
  total_count: any='0'
  jwpagelimit_value: any=10
  bs_selectall_value: any;
  cc_selectall_value: any;
  new_test_array: any;
 
  

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private brsService: BrsApiServiceService,
    private toster: ToastrService,
    private router: Router,
    config: NgbCarouselConfig,
    private SpinnerService: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    public datepipe: DatePipe,
    private route: ActivatedRoute,
    private sharedservice: SharedService,
    private taservice: TaService,
    private dateAdapter: DateAdapter<Date>,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.dateAdapter.setLocale("en-GB");

   
    // this.url = this.url.concat("")

    // this.fasOrcbs = "";
    // this.filteredOptions = this.entry_type.slice(); // Initialize filteredOptions with all options
    this.inttype = {
      label: "Integrity Name",
      method: "get",
      url: this.arsURL + "brsserv/dropdown_int_temp",
      params:'',
      searchkey: "name",
      displaykey: "integrity_name",
      wholedata: true,
      required:true
    };
    this.statuslists = {
      label: "ARS Status",
      method: "get",
      url: "",
      params:'',
      searchkey: "name",
      displaykey: "ars_status",
      wholedata: true,
    };
   
    this.branch_datas = {
      label: "Branch Name",
      method: "get",
      url: this.arsURL + "usrserv/search_branch",
      params:'',
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      required:true
    };
    
    this.temp_field = {
      label: "Template Name",
      method: "get",
      url: this.arsURL + "brsserv/wisefin_template",
      params: "&recon_ars="+this.dd_validation_template,
      searchkey: "query",
      displaykey: "template_name",
      wholedata: true,
    };
  }
  selectedFile: any = null;

  // dataSource : any[] = [];
  summarylist: any = [];
  summarylists = [];
  knockofflists = [];
  uploadfile: any;
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  paginationauto = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  paginationwisfinjv = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  paginationcbs = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  paginationsum = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  account_id: any;
  accountid: any;
  pageEvent: PageEvent;
  branchFetch: any;
  branchFetchs: any;
  myForm: FormGroup;

  displayedColumns: string[] = [
    "gl_date",
    "branch_code",
    "line_description",
    "gl_doc_no",
    "credit_amount",
    "debit_amount",
    "select",
  ];
  displayedColumnss: string[] = [
    "transaction_date",
    "branch_code",
    "description",
    "credit_amount",
    "debit_amount",
    "select",
  ];
  displayedCoulmnsA: string[] = [
    "ref_1",
    "gl_date",
    "branch_code",
    "line_description",
    "gl_doc_no",
    "debit_amount_ledger",
    "credit_amount_ledger",
    "description",
    "transaction_date",
    "credit_amount_statement",
    "debit_amount_statement",
    "select",
  ];
  public dataSource: MatTableDataSource<LedgerData>;
  public dataSources: MatTableDataSource<BstatementData>;
  public dataSourceA: MatTableDataSource<AutoknockoffData>;

  public newDataSource: MatTableDataSource<AutoknockoffData>;
  selection = new SelectionModel<LedgerData>(true, []);
  selectionLedger = new SelectionModel<LedgerData>(true, []);
  selections = new SelectionModel<BstatementData>(true, []);
  selectionA = new SelectionModel<AutoknockoffData>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginators: MatPaginator;
  @ViewChild(MatPaginator) paginatorss: MatPaginator;
  @ViewChild("sortCol1") sortCol1: MatSort;
  @ViewChild("sortCol2") sortCol2: MatSort;
  @ViewChild("sortCol3") sortCol3 = new MatSort();
  @ViewChild(MatAutocompleteTrigger)
  autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild("assetid") matassetidauto: any;
  @ViewChild("inputassetid") inputasset: any;
  @ViewChild("autocompleteemp") matemp: any;
  @ViewChild("branchInput") brinput: any;

  @ViewChild("matSorts") matSorts = new MatSort();
  @ViewChild("pageCol1") pageCol1: MatPaginator;
  @ViewChild("pageCol2") pageCol2: MatPaginator;
  @ViewChild("pageCol3") pageCol3: MatPaginator;
  @ViewChild("closebuttontag") closetagnumber: ElementRef;
  @ViewChild("closebuttontagcbs") closebuttontagcbs: ElementRef;

  @ViewChild("closebuttonrun") closebuttonrun: ElementRef;

  tabLenth: any;
  count: any;
  data: any;
  public selectedVal: string;
  ledgerSelect = [];
  bankSelect = [];
  fasdataid: number;
  cbsdataid: number;
  checkedfasItems: any = [];
  checkedcbsItems: any = [];
  checkedItems: any = [];
  partialtabledata: any = [];
  has_presentid: number = 1;
  has_nextid: boolean = true;
  has_previousid: boolean = true;
  branchid: any;
  branchemployee: any;
  has_nextemp: boolean = true;
  has_previousemp: boolean = true;
  has_presentemp: number = 1;
  branchlist: any;
  has_presentids: boolean = true;
  has_presenntids: any;
  1;
  statusupdatebranchid: any;
  empselectedname: any;
  pagenumb: any;
  maker: any;
  employeedata: any;
  statusarray: any;
  has_next = true;
  has_previous = true;
  presentpage: number;
  branchdata: [];
  empList: [];
  send_value = "";
  cbssystemhas_next = true;
  cbssystemhas_previous = true;
  fasmanualhas_next = true;
  fasmanualhas_previous = true;
  cbsmanualhas_next = true;
  cbsmanualhas_previous = true;
  summaryhas_next = true;
  summaryhas_previous = true;
  reporttype: any;
  fr_date: any;
  to_date: any;
  selectedRowIndex: number = -1;
  selectedRowIndices: number[] = [];
  selectedRowIndices2: number[] = [];

  cbs_compare_total = 0;
  fas_compare_total = 0;
  pagearray:any[]=[10,20,50,100]
  @ViewChild(MatSort) sort: MatSort;

  public dataArray: any;
  public dataArrayb: any;
  public dataArrays: any;
  id: any;
  @ViewChild('getdatapanel') getdatapanel:MatExpansionPanel
 
  reportlist1:any[]=[{name:'Pass Wisefin JW Report',id:1},{name:'Pass GEFU Report',id:2},{name:'Matched Tag Number Report',id:3},{name:'ARS Summary Report',id:4}]
  reportlist2:any[]=[{name:'Overall Report',id:1},{name:'System Match Report',id:2},{name:'Manual Match Report',id:3}]
  ngOnInit(): void {
    this.fasOrcbs = "";
    let userdata = this.sharedservice.transactionList;
    console.log("USER DATE", userdata);
    userdata.forEach((element) => {
      if (element.name == "ARS") {
        this.interRole = element.role;

        let set = new Set(this.interRole);
        console.log("ROLES ADDED", set);

        if (set["code"] == "ROL1") {
          console.log("MAKER");
        }
      }
    });

    this.brsService.getemployeesdetails().subscribe((results) => {
      console.log("results", results);
      this.empbranchid = results["employee_branch_code"];
      this.taservice
        .getUsageCode(this.empbranchid, 1)

        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchFetch = datas[0].code;
          this.branchFetchs = datas[0].name;
          // console.log("Branch FETCH List", typeof this.branchFetch);
          // console.log("Employee Branch code", this.branchFetchs);
        });
    });
    if (this.interRole) {
      this.interRole.forEach((element) => {
        if (element.name.toLowerCase() == "admin") {
          this.interPermission = element.code;
          this.adminUser = true;
          // this.adminUser = true;
          this.adminUsers = true;
          this.currentUser = "admin";

          // console.log("PERMISSION", this.interPermission);
        }
        if (element.name.toLowerCase() == "maker") {
          this.interPermission = element.code;
          this.normalUser = true;
          this.makerUser = true;
          this.currentUser = "maker";
          console.log("PERMISSION", this.interPermission);
        }
      });
    }

    this.brsService.gettemplates(1).subscribe((result) => {
      this.templates = result["data"];
    });

    this.brsService.getaccountdata(1).subscribe((result) => {
      this.accounts = result["data"];
    });
    this.brsService.getNtemplates(1).subscribe((result) => {
      this.ntemplates = result["data"];
    });

    this.brsService.getActionData1().subscribe((result) => {
      setTimeout(() => {
        this.columnList = result["data"];
        // console.log(this.columnList,'columnListcolumnListcolumnListcolumnListcolumnListcolumnList')
      }, 1000);
      // this.columnList = result["data"];

      console.log("columnList", this.columnList);
    });

    this.digit = this.fb.group({
      digit: "",
    });

    this.remarks = this.fb.group({
      remarks: "",
    });
    this.remark = this.fb.group({
      remark: "",
    });
    this.remarksClose = this.fb.group({
      remarksClose: "",
    });

    this.brsconcile = this.fb.group({
      cheque_Fromdate: "",
      cheque_Todate: "",
      chequeNum: "",
      cheq_status: "",
      cusName: "",
      chequeAmount: "",
      bankname: "",
      stmt_Fromdate: "",
      stmt_Todate: "",
      filedata: "",
      cheqNums: "",
      fileinput: "",
      filedatas: "",
      exclude_ledger_id: "",
      exclude_statement_id: "",
      mirror: 0,
      branch: "",
      branchs: "",
      date: "",
      account_id: "",
      fromdate: "",
      todate: "",
      tagnumber: "",
      status: "",
      filereportdown:'',
      amount_type:'',
      amount_con:'',
      amount: [{ value: '', disabled: true }]
    });
    this.combineDataForm = this.fb.group({
      rows: this.fb.array([]),
    });
    this.externalform = this.fb.group({
      branch_code: "",
      date: "",
      gl_no: "",
      temp_dd: "",
      filereportdown:""
    });
    this.externalhistory = this.fb.group({
      branch_code: "",
      date: "",
      gl_no: "",
      status: "",
    });
    this.externaljwreport = this.fb.group({
      branch_code: "",
      date: "",
      gl_no: "",
    });

    this.wisefinUpload = this.fb.group({
      template_id: "",
      account_id: "",
      filedata: "",
      entry_status: "",
      entry_gl: "",
      fColumnName: null,
      fColumnValue: null,
      fColumnName1: null,
      fColumnValue1: null,
      startDate: null,
      endDate: null,
    });
    this.bankstmtupload = this.fb.group({
      template_id: "",
      account_id: "",
      filedatas: "",
    });

    this.actionKnock = this.fb.group({
      actions: "",
      description: "",
      arn: "",
      arn_date: "",
    });
    this.fasaction = this.fb.group({
      actions: "",
    });
    this.cbsaction = this.fb.group({
      actions: "",
    });

    this.filterForm = this.fb.group({
      fromDate: "",
      toDate: "",
    });
    this.myForm = this.fb.group({
      filterProduct: "",
    });
    this.fassearch = this.fb.group({
      branchcode: "",
      glnumber: "",
      tranactiondate: "",
      creditdebit: "",
      others: "",
      fasfromdate: "",
      fasenddate: "",
      edittag_number: "",
      edittag_number2: "",
      Gid: "",
      Transactiondatepatch: "",
      DebitandCredit: "",
      AmtComparisons: "",
      Amountt: "",
      Commonfield: "",
      branchcontrol: "",
      tag_number: "",
      entry_gid: "",
      entry_crno: "",
      entry_module: "",
      remark: "",
      dropdownoption:'',
      value:''

    });
    this.cbssearch = this.fb.group({
      cbsbranchcode: "",
      cbsglnumber: "",
      cbstranactiondate: "",
      cbscreditdebit: "",
      cbsamount: "",
      Transactiondatepatchcbs: "",
      DebitandCreditcbs: "",
      Amounttcbs: "",
      AmtComparisons: "",
      Commonfieldcbs: "",
      branchcontrolcbs: "",
      narration: "",
      tag_number: "",
      dropdownoption:'',
      value:''
    });

    this.selectedVal = "inter";

    this.getbranch();
    this.radiobuttonform = this.fb.group({
      radioOption: new FormControl(""),
      radioOptioncbs: new FormControl(""),
    });
    this.fileform = this.fb.group({
     
      file_cbs_upload: null,
      file_fas_upload:null
    
    })
  }

  get rows(): FormArray {
    return this.combineDataForm.get("rows") as FormArray;
  }

  getdataLedger() {
    this.brsService
      .getLedgerdata(this.wisefinUpload.value, this.pagination.index, 1)
      .subscribe((results) => {
        if (!results) {
          return false;
        }

        this.summarylist = results["data"];

        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;
      });
  }
  get fromDate() {
    return this.filterForm.get("fromDate");
  }
  get toDate() {
    return this.filterForm.get("toDate");
  }

  viewglData() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;

    if (this.brsconcile.controls["account_id"].value == "") {
      this.notification.showError("Select Wisefin Account");
    } else {
      this.SpinnerService.show();
      this.brsService
        .getLedgerdata(
          this.brsconcile.controls["account_id"].value.acc_no,
          this.pagination.index,
          this.branchCodeEmp
        )
        .subscribe((results) => {
          if (!results) {
            return false;
          }
          this.SpinnerService.hide();

          this.dataArray = results["data"];
          this.dataSource = new MatTableDataSource<LedgerData>(this.dataArray);
          this.dataSource.paginator = this.pageCol1;
          this.dataSource.sort = this.sortCol1;
        });
    }
  }
  showbrs() {
    this.brsconcile.get("mirror").setValue(1);
  }

  showinter() {
    this.brsconcile.get("mirror").setValue(0);
  }

  viewbsData() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;

    if (this.brsconcile.controls["account_id"].value == "") {
      this.notification.showError("Select CBS Account");
    } else {
      this.SpinnerService.show();
      this.brsService
        .getStatementdata(
          this.brsconcile.controls["account_id"].value.acc_no,
          this.pagination.index,
          this.branchCodeEmp
        )
        .subscribe((results) => {
          if (!results) {
            return false;
          }
          this.SpinnerService.hide();
          this.dataArrayb = results["data"];
          this.dataSources = new MatTableDataSource<BstatementData>(
            this.dataArrayb
          );
          this.dataSources.paginator = this.pageCol2;
          this.dataSources.sort = this.sortCol2;
        });
    }
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1;
    }
    this.viewglData();
  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1;
    }
    this.viewglData();
  }

  getStmtdata() {
    this.brsService
      .getStatementdata(this.bankstmtupload.value, this.pagination.index, 1)
      .subscribe((results) => {
        if (!results) {
          return false;
        }
        this.summarylists = results["data"];

        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;
        this.dataSources.filteredData.length = this.tabLenth;
      });
  }
  prevpages() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1;
    }
    this.getStmtdata();
  }

  nextpages() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1;
    }
    this.getStmtdata();
  }

  autoknockoff() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;

    if (
      this.brsconcile.controls["account_id"].value == "" &&
      this.brsconcile.controls["account_id"].value == ""
    ) {
      this.notification.showError("Select Wisefin and CBS Accounts");
    } else if (this.brsconcile.controls["account_id"].value == "") {
      this.notification.showError("Select Wisefin Account");
    } else if (this.brsconcile.controls["account_id"].value == "") {
      this.notification.showError("Select CBS Account");
    } else {
      this.SpinnerService.show();
      let data = {
        ledger_account_id: this.brsconcile.controls["account_id"].value.acc_no,
        statement_account_id:
          this.brsconcile.controls["account_id"].value.acc_no,
        mirror: this.brsconcile.controls["mirror"].value,
        exclude_ledger_id: "",
        exclude_statement_id: "",
      };
      this.isExpandeds = false;
      this.brsService
        .autoknockoff(
          this.brsconcile.controls["account_id"].value.acc_no,
          this.brsconcile.controls["account_id"].value.acc_no,
          this.brsconcile.controls["mirror"].value,
          this.branchCodeEmp
        )
        .subscribe((results) => {
          this.SpinnerService.hide();
          this.showfirsttable = false;
          this.showknockofftable = true;
          this.displaybuttons = false;
          this.confirmbutton = true;
          this.showuploads = true;
          this.showstatuss = true;

          this.dataArrays = results["data"];
          this.newDataSource = new MatTableDataSource<AutoknockoffData>(
            this.dataArrays
          );

          this.newDataSource.sort = this.matSorts;
        });
    }
  }

  prevpagess() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index + 1;
    }
    this.autoknockoff();
  }
  nextpagess() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1;
    }
    this.autoknockoff();
  }

  confirmsknockoff() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;
    let data = {
      ledger_account_id: this.brsconcile.controls["account_id"].value.acc_no,
      statement_account_id: this.brsconcile.controls["account_id"].value.acc_no,
      mirror: this.brsconcile.controls["mirror"].value,
      branch_code: this.branchCodeEmp,
    };

    this.SpinnerService.show();
    this.brsService.confirmingknockoff(data).subscribe((results) => {
      this.SpinnerService.hide();
      this.showfirsttable = false;
      this.showknockofftable = true;
      this.displaybuttons = false;
      this.confirmbutton = true;
      this.autoknockoff();

      this.pagination = results.pagination
        ? results.pagination
        : this.pagination;

      if (results.status == "success") {
        this.notification.showSuccess(results.message);
        this.getSchedulerstatus();
      } else {
        this.notification.showError(results.description);
        this.getSchedulerstatus();
      }
    });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }
  manualknockoff() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;

    let ledgerSelect = [];
    this.selection.selected.forEach((s) => ledgerSelect.push(s.id));
    console.log(typeof ledgerSelect);

    let bankSelect = [];
    this.selections.selected.forEach((l) => bankSelect.push(l.id));
    console.log(typeof bankSelect);

    let datas = {
      data: [
        {
          bank_stmt_id: bankSelect,

          ledger_stmt_id: ledgerSelect,

          mirror: this.brsconcile.controls["mirror"].value,
          branch_code: this.branchCodeEmp,
        },
      ],
    };
    console.log(datas);
    this.SpinnerService.show();

    this.brsService.manualKnockoff(datas).subscribe((results) => {
      this.SpinnerService.hide();

      if (results.status == "success") {
        this.notification.showSuccess("Manual KnockOff Completed");
        this.selection = new SelectionModel<LedgerData>(true, []);
        this.selections = new SelectionModel<BstatementData>(true, []);
      } else {
        this.notification.showError(results.description);
      }
    });
  }

  toNumber(value) {
    return Number(value);
  }
  gotoMaster() {
    this.router.navigate(["brs/brsmaster"], {});
  }

  uploadchoose(evt) {
    this.uploadfile = evt.target.files[0];
    const fileExtension = this.uploadfile.name.split('.').pop().toLowerCase();
          if (fileExtension !== 'xlsx') {
            console.error('Invalid file type. Please upload an XLSX file.');
            this.notification.showError("Unsupported file type");
            this.bankstmtupload.get('filedatas').reset()
            return;
          }
    this.bankstmtupload.get("filedatas").setValue(this.uploadfile);
  }

  uploadchooses(evt) {
    this.uploadfile = evt.target.files[0];
    const fileExtension = this.uploadfile.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx') {
      console.error('Invalid file type. Please upload an XLSX file.');
      this.notification.showError("Unsupported file type");
      this.wisefinUpload.get('filedata').reset()
      return;
    }
    this.wisefinUpload.get("filedata").setValue(this.uploadfile);
  }

  bankstmtuploads() {
    if (this.currentUser == "admin") {
      this.branchCodeEmp = this.brsconcile.controls["branch"].value;
    } else {
      this.branchCodeEmp = this.empbranchid;
    }
    var dates = this.datepipe.transform(
      this.brsconcile.value.date,
      "yyyy-MM-dd"
    );

    if (
      this.bankstmtupload.get("filedatas").value == "" ||
      this.bankstmtupload.get("filedatas").value == undefined ||
      this.bankstmtupload.get("filedatas").value == null
    ) {
      this.toster.warning("Please Select File");
      return false;
    }

    if (!this.selectedOption) {
      this.notification.showWarning(
        "Please Select a Single Branch or Whole Bank!"
      );
      return false;
    }

    if (this.dd_show == true) {
      if (
        this.template_name == "" ||
        this.template_name == undefined ||
        this.template_name == null
      ) {
        this.toster.warning("Please Select Template name");
        return false;
      }
    }
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );

      // this.ars_status = sum.ars_status;

      this.int_dict = {
        gl_branch: this.branch_codeid,
        gl_code: this.glcode_id,
        date: this.iDate,
        value: this.externalvalue,
      };
      console.log(this.int_dict);
    }
    this.int_dict["type"] = 5;
    this.int_dict["multi_gl"] = this.multiplecheckbox;
    this.int_dict["comp_gl"] = this.compareglcheckbox;
    this.int_dict["int_type"] = this.int_type;
    if (
      this.template_name == "" ||
      this.template_name == undefined ||
      this.template_name == null
    ) {
      this.int_dict["temp_name"] = "";
    } else {
      this.int_dict["temp_name"] = this.template_name;
    }
    // if(this.dd_show == true){
    //   this.int_dict["temp_name"] = this.template_name;
    // }
    this.SpinnerService.show();
    // this.brsService
    // .arscbsfieldvalidate(
    //   this.int_gl,
    //   this.int_dict,
    //   this.bankstmtupload.get("filedatas").value
    // )
    // .subscribe((results) => {
    //   if (results.status == "success") {

    // let branch_code = (this.selectedOption == "particular" ? this.branch_codeid : "");
    // this.int_dict_wholeCbs = {
    //   gl_branch: branch_code,
    //   gl_code: this.glcode_id,
    //   date: this.iDate,
    //   type: 5
    // };

    this.brsService
      .bankstatementUplaodSchedule(
        this.int_gl,
        this.int_dict,
        this.bankstmtupload.get("filedatas").value,
        
      )
      .subscribe(
        (results) => {
          this.SpinnerService.hide();
          this.pagination = results.pagination
            ? results.pagination
            : this.pagination;
          if (results.status == "success") {
            this.schuduler = "scheduless";
            this.cbs_file = results;
            this.notification.showSuccess("SUCCESSFULLY UPLOAD");
            // this.selectedOption = '';

            this.getSchedulerstatus();
          } else {
            this.notification.showError(results.code);
            this.SpinnerService.hide();
            // this.selectedOption = '';
          }
        },
        (error) => {
          this.SpinnerService.hide();
          // this.selectedOption = '';
        }
      );
  }
  // } else {
  //   this.notification.showError(results.code);
  //   this.SpinnerService.hide();

  // }
  // });
  // }
  // manualSave(page) {

  //   console.log("payloadArray", this.payloadArray)
  //   this.payloadArray=[]
  //   // this.showedit = true;
  //   let payload = {
  //     Date: this.iDate,
  //     edit: 1,
  //     parent_id_fas: [],
  //     parent_id_cbs: [],
  //     type_fas: [],
  //     type_cbs: [],
  //     tag_id: [],
  //   };

  //   if (this.type === 1) {
  //     payload.parent_id_fas = null;
  //     payload.parent_id_cbs = null;
  //     payload.type_fas = this.type_array_fas_assign;
  //     payload.type_cbs = this.type_array_cbs_assign;
  //     payload.tag_id = this.arr;
  //   } else {
  //     payload.parent_id_fas = this.action_id_fas_array;
  //     payload.parent_id_cbs = this.action_id_cbs_array;
  //     payload.type_fas = this.type_array_fas;
  //     payload.type_cbs = this.type_array_cbs;
  //     payload.tag_id = [];
  //   }

  //   // let payload = {
  //   //   parent_id_fas: this.action_id_fas_array,
  //   //   parent_id_cbs: this.action_id_cbs_array,
  //   //   type_fas: this.type_array_fas,
  //   //   type_cbs: this.type_array_cbs,
  //   //   Date: this.iDate,
  //   //   edit: 1,
  //   // };

  //   // let payload1 = {
  //   //   parent_id_fas: null,
  //   //   parent_id_cbs: null,
  //   //   type_fas: this.type_array_fas_assign,
  //   //   type_cbs: this.type_array_cbs_assign,
  //   //   Date: this.iDate,
  //   //   edit: 1,
  //   //   tag_id: this.arr
  //   // };

  // //   if(this.type === 1) {
  //     // this.tagnumber = this.fassearch.get("edittag_number").value;

  //     // if (
  //     //   this.tagnumber === "" ||
  //     //   this.tagnumber === null ||
  //     //   this.tagnumber === undefined
  //     // ) {
  //     //   this.toster.error("Please enter a Tag Number!");
  //     //   return;
  //     // }

  //     this.addEntry(this.tagnumber, this.tag_no_id, this.tag_type_no);
  //     // this.tag_no_id = []
  //     // this.tag_type_no = []
  // //     console.log("tetsingTheData", this.arr);

  // //   this.brsService.newActionSave(payload).subscribe((res) => {
  // //     this.SpinnerService.show();
  // //     if (res.code) {
  // //       this.notification.showError(res.code);
  // //       this.SpinnerService.hide();
  // //     } else {
  // //       this.notification.showSuccess("Saved Successfully!..");
  // //       this.onChangeRBF(page);
  // //       this.onChangecbs(page);
  // //       this.fasaction.patchValue({
  // //         actions: this.tabledata.fas_action,
  // //       });
  // //       this.cbsaction.patchValue({
  // //         actions: this.cbstabledata.cbs_action,
  // //       });
  // //       // this.fassearch.patchValue({
  // //       //   edittag_number : this.tagnumber,
  // //       // })
  // //       // this.fassearch.get("edittag_number").reset();
  // //       this.fasaction.get("actions").reset();
  // //       this.cbsaction.get("actions").reset();
  // //       // this.action_id_fas_array = [];
  // //       // this.action_id_cbs_array = [];
  // //       // this.type_array_fas = [];
  // //       // this.type_array_cbs = [];
  // //       // this.action_id_fas_array_assign = [];
  // //       // this.action_id_cbs_array_assign = [];
  // //       // this.type_array_fas_assign = [];
  // //       // this.type_array_cbs_assign = [];

  // //       this.SpinnerService.hide();
  // //     }
  // //     // this.showedit = true;
  // //   });
  // //   // this.fasaction.get("actions").reset();
  // // }
  // // else {
  //   this.brsService.newActionSave(payload).subscribe((res) => {
  //     this.SpinnerService.show();
  //     if (res.code) {
  //       this.notification.showError(res.code);
  //       this.SpinnerService.hide();
  //     } else {
  //       this.notification.showSuccess("Saved Successfully!..");
  //       this.onChangeRBF(page);
  //       this.onChangecbs(page);
  //       this.fasaction.patchValue({
  //         actions: this.tabledata.fas_action,
  //       });
  //       this.cbsaction.patchValue({
  //         actions: this.cbstabledata.cbs_action,
  //       });
  //       this.fasaction.get("actions").reset();
  //       this.cbsaction.get("actions").reset();
  //       // this.action_id_fas_array = [];
  //       // this.action_id_cbs_array = [];
  //       // this.type_array_fas = [];
  //       // this.type_array_cbs = [];
  //       // this.action_id_fas_array_assign = [];
  //       // this.action_id_cbs_array_assign = [];
  //       // this.type_array_fas_assign = [];
  //       // this.type_array_cbs_assign = [];

  //       this.SpinnerService.hide();
  //     }
  //     // this.showedit = true;
  //   });
  // }
  // }

  gluploads() {
    if (this.currentUser == "admin") {
      this.branchCodeEmp = this.brsconcile.controls["branch"].value;
    } else {
      this.branchCodeEmp = this.empbranchid;
    }
    if (
      this.wisefinUpload.get("filedata").value == "" ||
      this.wisefinUpload.get("filedata").value == undefined ||
      this.wisefinUpload.get("filedata").value == null
    ) {
      this.toster.warning("Please Select File");
      return false;
    }

    if (!this.selectedOption) {
      this.notification.showWarning(
        "Please Select a Single Branch or Whole Bank!"
      );
      return false;
    }
    if (this.dd_show == true) {
      if (
        this.template_name == "" ||
        this.template_name == undefined ||
        this.template_name == null
      ) {
        this.toster.warning("Please Select Template name");
        return false;
      }
    }
    this.SpinnerService.show();

    // this.brsService
    //   .arsfasfieldvalidate(
    //     this.int_dict,
    //     this.int_gl,
    //     this.wisefinUpload.get("filedata").value
    //   )
    //   .subscribe((results) => {
    //     if (results.status == "success")

    // let branch_code = (this.selectedOption == "particular" ? this.branch_codeid : "");

    // this.int_dict_whole = {
    //   gl_branch: branch_code,
    //   gl_code: this.glcode_id,
    //   date: this.iDate,
    //   type: 4
    // };
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );

      // this.ars_status = sum.ars_status;

      this.int_dict = {
        gl_branch: this.branch_codeid,
        gl_code: this.glcode_id,
        date: this.iDate,
        value: this.externalvalue,
        // int_type:this.int_type
      };
      console.log(this.int_dict);
    }

    this.int_dict["type"] = 4;
    this.int_dict["multi_gl"] = this.multiplecheckbox;
    this.int_dict["comp_gl"] = this.compareglcheckbox;
    this.int_dict["int_type"] = this.int_type;
    if (
      this.template_name == "" ||
      this.template_name == undefined ||
      this.template_name == null
    ) {
      this.int_dict["temp_name"] = "";
    } else {
      this.int_dict["temp_name"] = this.template_name;
    }
    // if(this.dd_show == true){
    //   this.int_dict["temp_name"] = this.template_name;
    // }

    console.log(this.int_dict);

    {
      this.brsService
        .glUploadSchedule(
          this.int_dict,
          this.int_gl,
          this.wisefinUpload.get("filedata").value,
          
        )
        .subscribe(
          (results) => {
            this.SpinnerService.hide();
            this.pagination = results.pagination
              ? results.pagination
              : this.pagination;
            if (results.status == "success") {
              this.schudulers = "schedule";
              this.wisfin_file = results;
              this.notification.showSuccess("SUCCESSFULLY UPLOAD");
              // this.selectedOption= '';
              this.getSchedulerstatus();
            } else {
              this.notification.showError(results.code);
              // this.selectedOption= '';
            }
          },
          (error) => {
            this.SpinnerService.hide();
            // this.selectedOption = '';
          }
        );
      // } else {
      //   this.notification.showError(results.code);
    }
    // });
  }

  gotoBack() {
    this.router.navigate(["/brstransactions"], {});
    this.isExpandeds = true;
  }

  showHistory() {
    if (this.currentUser == "admin") {
      this.branchCodeEmp = this.brsconcile.controls["branchs"].value;
    } else {
      this.branchCodeEmp = this.empbranchid;
    }

    this.router.navigate(["brs/knockoff"], {
      queryParams: { branchCodeEmp: this.branchCodeEmp },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceA.filter = filterValue.trim().toLowerCase();
  }
  applyFilterb(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSources.filter = filterValue.trim().toLowerCase();
  }
  applyFilterss(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter((element) =>
      element.line_description
        .trim()
        .toLowerCase()
        .includes(this.dataSource.filter)
    ).length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    let newArray = this.dataSource.data.filter((element) =>
      element.line_description
        .trim()
        .toLowerCase()
        .includes(this.dataSource.filter)
    );
    this.selection.select(...newArray);
  }

  checkboxLabel(row?: LedgerData): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.line_description + 1
    }`;
  }

  isAllSelecteds() {
    const numSelecteds = this.selections.selected.length;
    const numRowss = this.dataSources.data.filter((element) =>
      element.description.trim().toLowerCase().includes(this.dataSources.filter)
    ).length;
    return numSelecteds === numRowss;
  }

  toggleAllRowss() {
    if (this.isAllSelecteds()) {
      this.selections.clear();
      return;
    }
    let newArray = this.dataSources.data.filter((element) =>
      element.description.trim().toLowerCase().includes(this.dataSources.filter)
    );

    this.selections.select(...newArray);
  }
  checkboxLabels(rows?: BstatementData): string {
    if (!rows) {
      return `${this.isAllSelecteds() ? "deselect" : "select"} all`;
    }
    return `${this.selections.isSelected(rows) ? "deselect" : "select"} row ${
      rows.description + 1
    }`;
  }
  getDateRange(value) {
    this.SpinnerService.hide();
    this.dataSourceA = new MatTableDataSource<AutoknockoffData>(
      this.dataArrays
    );
    const fromDate = value.fromDate;
    const toDate = value.toDate;
    this.dataSourceA.data = this.dataSourceA.data.filter(
      (e) => e.gl_date > fromDate && e.gl_date < toDate
    );
    console.log(fromDate, toDate);
  }

  getLedgerDownload() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;
    this.brsService
      .downloadLedger(
        this.brsconcile.controls["account_id"].value.acc_no,
        this.branchCodeEmp
      )
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "LedgerData" + ".xlsx";
        link.click();
      });
  }

  getStmtDownload() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;
    this.brsService
      .downloadStmt(
        this.brsconcile.controls["account_id"].value.acc_no,
        this.branchCodeEmp
      )
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "StatementData" + ".xlsx";
        link.click();
      });
  }

  downloadAuto() {
    let id = 14;
    this.brsService.AutoknockoffDownload(id).subscribe((results) => {
      let binaryData = [];
      binaryData.push(results);
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "AutoknockoffData" + ".xlsx";
      link.click();
    });
  }

  purgeLedger() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;
    let dataPl = {
      account_id: this.brsconcile.controls["account_id"].value.acc_no,
      type: "ledger",
      branch_code: this.branchCodeEmp,
    };
    this.brsService.purgeLedgerServ(dataPl).subscribe((results) => {
      if (results.status == "success") {
        this.notification.showSuccess("Files Purged Successfully");
        // this.closebtn.nativeElement.click();
      } else {
        this.notification.showError(results.description);
      }
    });
  }
  purgeStatement() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;

    let dataSt = {
      account_id: this.brsconcile.controls["account_id"].value.acc_no,
      type: "statement",
      branch_code: this.branchCodeEmp,
    };
    this.brsService.purgeStmtServ(dataSt).subscribe((results) => {
      if (results.status == "success") {
        this.notification.showSuccess("Files Purged Successfully");
        // this.closebtn.nativeElement.click();
      } else {
        this.notification.showError(results.description);
      }
    });
  }

  purgeHistory() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;
    this.router.navigate(["brs/purge"], {
      queryParams: { branchCodeEmp: this.branchCodeEmp },
    });
  }

  changeColumn(event) {
    if (this.wisefinUpload.controls["entry_status"].value == 1) {
      this.showGLentry = false;
    }
    if (this.wisefinUpload.controls["entry_status"].value == 0) {
      this.showGLentry = true;
    }
  }

  backtoHome() {  
    this.showfirsttable = true;
    this.showknockofftable = false;
    this.displaybuttons = true;
    this.confirmbutton = false;
    this.showuploads = true;
    this.isExpandeds = true;
    this.viewbsData();
    this.viewglData();
  }

  selectedRow(row) {
    this.selection.selected.forEach((s) => console.log(s.id));
  }
  gotoIntegrity() {
    this.router.navigate(["brs/integrity"], {});
  }

  addfilters() {}
  getSchedulerstatus() {
    if (this.schuduler == "scheduless" || this.schudulers == "schedule") {
      this.run_proces = true;
    } else {
      this.run_proces = false;
    }

    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;

    this.subscription = timer(0, 20000)
      .pipe(
        switchMap(() => this.brsService.schedulerStatus(this.branchCodeEmp))
      )
      .subscribe((result) => {
        this.schedulerstat = result.knockoff_scheduler;
        this.wisefinscheduler = result.wisefin_scheduler;
        this.cbsscheduler = result.statement_scheduler;
        console.log("Scheduler Status", this.schedulerstat);
        if (result.knockoff_scheduler == 0) {
          this.subscription.unsubscribe();
        }
      });
  }

  checkStatusSched() {
    this.getSchedulerstatus();
  }

  glfetch() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;

    let datal = {
      account_id: this.brsconcile.controls["account_id"].value.acc_no,
      from_date: this.datepipe.transform(
        this.wisefinUpload.controls["startDate"].value,
        "yyyy-MM-dd"
      ),
      to_date: this.datepipe.transform(
        this.wisefinUpload.controls["endDate"].value,
        "yyyy-MM-dd"
      ),
      file: 0,
      branch_code: this.branchCodeEmp,
    };
    this.SpinnerService.show();
    this.brsService.fetchgldata(datal).subscribe((results) => {
      this.SpinnerService.hide();
      this.pagination = results.pagination
        ? results.pagination
        : this.pagination;
      if (results.status == "success") {
        this.notification.showSuccess(results.message);
        this.getSchedulerstatus();
      } else {
        this.notification.showError(results.description);
      }
    });
  }

  actionknockoff() {
    this.displayactionK = true;
  }

  actionknockoffss() {
    this.branchCodeEmp =
      this.currentUser == "admin"
        ? this.brsconcile.controls["branchs"].value
        : this.empbranchid;

    console.log("SELECTION", this.selection.selected);
    this.selection.selected.forEach((s) => this.ledgerSelect.push(s.id));
    console.log(typeof this.ledgerSelect);

    console.log("SELECTION", this.selections.selected);
    this.selections.selected.forEach((l) => this.bankSelect.push(l.id));
    console.log(typeof this.bankSelect);

    let dataObj = {
      bank_stmt_id: this.bankSelect,
      ledger_stmt_id: this.ledgerSelect,
      description: this.actionKnock.controls["description"].value,
      branch_code: this.branchCodeEmp,
      arn: this.actionKnock.controls["arn"].value,
      arn_date: this.datepipe.transform(
        this.actionKnock.controls["arn_date"].value,
        "yyyy-MM-dd"
      ),
    };

    if (
      Array.isArray(dataObj.ledger_stmt_id) &&
      dataObj.ledger_stmt_id.length === 0
    ) {
      delete dataObj.ledger_stmt_id;
    }

    if (
      Array.isArray(dataObj.bank_stmt_id) &&
      dataObj.bank_stmt_id.length === 0
    ) {
      delete dataObj.bank_stmt_id;
    }

    let datas = {
      data: dataObj,
    };

    if (this.ledgerSelect.length == 0 && this.bankSelect.length == 0) {
      this.notification.showError(
        "Please select wisefin or CBS data to proceed"
      );
    } else if (this.actionKnock.controls["actions"].value == 0) {
      this.notification.showError("Please select Actions from the Dropdown");
    } else {
      this.SpinnerService.show();

      this.brsService
        .actionKnockoff(this.actionKnock.controls["actions"].value, datas)
        .subscribe((results) => {
          this.SpinnerService.hide();

          if (results.status == "success") {
            console.log("BEFORE ARRAY VALUES", this.ledgerSelect);

            this.ledgerSelect.splice(0, this.ledgerSelect.length);
            this.notification.showSuccess("Action KnockOff Completed");
            this.displayactionK = false;
            this.actionKnock.reset();
            this.viewbsData();
            this.viewglData();
            this.bankSelect.length = 0;
            this.selection = new SelectionModel<LedgerData>(true, []);
            this.selections = new SelectionModel<BstatementData>(true, []);
          } else {
            this.notification.showError(results.description);
          }
        });
    }
  }

  selectHandler(row: LedgerData) {
    this.selection.toggle(row);
  }

  autocompleteid() {
    setTimeout(() => {
      if (
        this.matassetidauto &&
        this.autocompletetrigger &&
        this.matassetidauto.panel
      ) {
        fromEvent(this.matassetidauto.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matassetidauto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe((data) => {
            const scrollTop = this.matassetidauto.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matassetidauto.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matassetidauto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            console.log("CALLLLL", atBottom);
            if (atBottom) {
              if (this.has_nextid) {
                this.taservice
                  .getUsageCode(
                    this.inputasset.nativeElement.value,
                    this.has_presentid + 1
                  )
                  .subscribe((data) => {
                    let dts = data["data"];
                    console.log("h--=", data);
                    console.log("SS", dts);
                    console.log("GGGgst", this.branchlist);
                    this.has_presentid++;
                    let pagination = data["pagination"];
                    this.branchlist = this.branchlist.concat(dts);
                    console.log("BTRANCHES", this.branchlist);

                    if (this.branchlist.length > 0) {
                      this.has_nextid = pagination.has_next;
                      this.has_presentids = pagination.has_previous;
                      this.has_presenntids = pagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  displayfnbranch(conoffice): string | undefined {
    return conoffice ? "(" + conoffice.code + ") " + conoffice.name : undefined;
  }
  displayFn(subject) {
    return subject.full_name;
  }
  getbranch() {
    this.taservice.getbranchname().subscribe((x) => {
      this.branchlist = x["data"];
      this.branchdata = x["data"];
      console.log("branchlist", this.branchlist);
    });
  }
  setSelectedBranchCode() {
    const selectedBranch = this.brsconcile.get("branchs").value;
    if (selectedBranch) {
      this.brsconcile.get("branchs").setValue(selectedBranch.code);
    }
  }
  branchslist() {
    this.brsService
      .getarsbranchname(this.iDate, this.glcode_id)
      .subscribe((result) => {
        let data = result["data"];
        this.branchlist = data;
      });
  }

  selectBranch(e) {
    let page = 1;
    this.branch_codeid = e.branch;
    console.log("brachcode", this.branch_codeid);
  }

  run_progress(page: any) {
    var dates = this.datepipe.transform(
      this.brsconcile.value.date,
      "yyyy-MM-dd"
    );
    // if (
    //   this.schudulers == "" ||
    //   this.schudulers == null ||
    //   this.schudulers == undefined
    // ) {
    //   this.toster.warning("Please Upload The Wisefin Data");
    //   return false;
    // }
    // if (
    //   this.schuduler == "" ||
    //   this.schuduler == null ||
    //   this.schuduler == undefined
    // ) {
    //   this.toster.warning("Please Upload The CBS Data");
    //   return false;
    // }

    let branch_code =
      this.selectedOption == "particular" ? this.branch_codeid : "";

    let param = {
      date: this.iDate,
      gl_no: this.glcode_id,
      branch_code: branch_code,
      id1: this.fasFilesIds,
      id2: this.cbsFilesIds,
      value: this.externalvalue,
      multi_gl: this.multiplecheckbox,
      comp_gl: this.compareglcheckbox,
      temp_name: this.template_name,
      int_type:this.int_type
    };
    // console.log(param)
    // if (this.externalpage == true){
    //   let param = {
    //     date: this.datepipe.transform(this.externalform.get("date").value,"yyyy-MM-dd"),
    //     branch_code:  this.externalform.get("branch_code").value,
    //     gl_no: this.externalform.get("gl_no").value,
    //     id1: this.fasFilesIds,
    //     id2: this.cbsFilesIds,
    //     value: this.externalvalue
    //   };
    // }

    if (this.fasFiles.length == 0 && this.cbsFiles.length == 0) {
      this.toster.warning("Please Upload the Data!");
      this.closebuttonrun.nativeElement.click();
    } else if (!this.selectedOption) {
      this.notification.showWarning(
        "Please Select Branch as a Whole or Single!"
      );
      this.closebuttonrun.nativeElement.click();
    } else {
      // console.log(param)
      this.SpinnerService.show();
      this.brsService.run_progress(param).subscribe((results) => {
        this.SpinnerService.hide();
        let data = results;
        if (results.code) {
          this.toster.error(results.code);
          this.selectedOption = "";
          this.closebuttonrun.nativeElement.click();
        }
        if (data["data"][0]?.key == "scheduler triggered") {
          this.toster.success(data["data"][0]?.key);
          this.selectedOption = "";
          this.closebuttonrun.nativeElement.click();
          this.onChangeRBF(page);
          this.onChangecbs(page);
        }
      });
    }
  }
  onChangeRBF(pagenum) {
    console.log("this.filterid change", this.filterdata_id);
    if (this.showhidebuttons === 3) {
      this.actionChange = false;
    } else {
      this.actionChange = true;
    }
    this.fasOrcbs = 1;
    console.log("page", pagenum);
    // this.SpinnerService.show();

    this.fasbranch_code = this.fassearch.get("branchcode").value;
    this.fasgl_number = this.fassearch.get("glnumber").value;
    this.fastranactiondate = this.fassearch.get("tranactiondate").value;
    this.fascreditdebit = this.fassearch.get("creditdebit").value;
    this.fasothers = this.fassearch.get("others").value;
    this.Gid1 = this.fassearch.get("Gid").value;

    this.branch = this.fassearch.get("branchcontrol").value;
    this.Transactiondatepatch1 = this.fassearch.get(
      "Transactiondatepatch"
    ).value;
    this.DebitandCredit1 = this.fassearch.get("DebitandCredit").value;
    this.Amountt1 = this.fassearch.get("Amountt").value;
    this.tag = this.fassearch.get("Commonfield").value;
    this.AmtComparison = this.fassearch.get("AmtComparisons").value;

    let params = "?page=" + pagenum;
if(this.filterdata_id!=='1'){
  let branch_codeid = this.branch_codeid;
  branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";
}
    if (this.externalpage == true) {
      let branch_codeid = this.externalform.get("branch_code").value;
      branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";

      let glcode_id = this.externalform.get("gl_no").value;
      glcode_id ? (params += "&gl_code=" + glcode_id) : "";

      let run_date = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
      run_date ? (params += "&run_date=" + run_date) : "";
    } else {
     

      let glcode_id = this.glcode_id;
      glcode_id ? (params += "&gl_code=" + glcode_id) : "";

      // let iDate = this.fasfromdate_date;
      // iDate ? (params += "&process_date=" + iDate) : "";

      let run_date = this.iDate;
      run_date ? (params += "&run_date=" + run_date) : "";
    }
    let filterdata_id = this.filterdata_id;
    filterdata_id ? (params += "&type=" + filterdata_id) : "";

    // let fasbranch_code = this.branch;
    // fasbranch_code ? (params += "&branch_code=" + fasbranch_code) : "";

    let tag = this.tag;
    tag ? (params += "&tagno=" + tag) : "";

    let action = this.action;
    action ? (params += "&action=" + action) : "";

    let AmtComparison = this.AmtComparison;
    AmtComparison ? (params += "&comparison=" + AmtComparison) : "";

    let fasenddate_date = this.fasenddate_date;
    fasenddate_date ? (params += "&to_date=" + fasenddate_date) : "";

    let fasgl_number = this.fasgl_number;
    fasgl_number ? (params += "&gl_code=" + fasgl_number) : "";

    let Transactiondatepatch1 = this.Transactiondatepatch1;
    Transactiondatepatch1
      ? (params += "&trans_date=" + Transactiondatepatch1)
      : "";

    let DebitandCredit1 = this.DebitandCredit1;
    DebitandCredit1 ? (params += "&dr_cr=" + DebitandCredit1) : "";

    let fasothers = this.fasothers;
    fasothers ? (params += "&filters=" + fasothers) : "";

    let Amountt1 = this.Amountt1;
    Amountt1 ? (params += "&start_amount=" + Amountt1) : "";

    let entry_gid = this.fassearch.get("entry_gid").value;
    entry_gid ? (params += "&entry_gid=" + entry_gid) : "";

    let entry_crno = this.fassearch.get("entry_crno").value;
    entry_crno ? (params += "&entry_crno=" + entry_crno) : "";

    let entry_module = this.fassearch.get("entry_module").value;
    entry_module ? (params += "&entry_module=" + entry_module) : "";

    let remark = this.fassearch.get("remark").value;
    remark ? (params += "&remark=" + remark) : "";

    let temp_name = this.fetch_template_name;
    temp_name ? (params += "&temp_name=" + temp_name) : "";
    let page_size = this.faspagesize;

    page_size ? (params += "&page_size=" + page_size) : "";
    let int_type = this.int_type;

    let action_id = this.subtab_action_id;
    action_id ? (params += "&action_id=" + action_id) : "";

    int_type ? (params += "&int_type=" + int_type) : "";
    let value = this.externalvalue;
    // value ? (params += "&value=" + value): "";

    // this.SpinnerService.show();
    this.get_FAS_CBS_data(params, value);
    let payload={
      dict_val:this.fassytammatchsearchlist
    }
    this.SpinnerService.show();
    this.brsService.MatchingData(params, value,payload).subscribe((res) => {
      this.SpinnerService.hide();
      // for(let a of this.payloadArray){
      //   if(a?.newdata == false){    //newdata = true
      //     this.newdataArray.push(a)
      //   }
      //     console.log("New Array",this.newdataArray);
      //   }
      // this.newdataArray = this.payloadArray.filter(item => item.newdata === false);
      // console.log("New Array",this.newdataArray);

      if (
        this.ars_status == "System Match Done" ||
        this.ars_status == "Reconciled" ||
        this.filterdata_id == 4 ||
        this.ars_status == "PASSED GEFU" ||
        this.ars_status == "PASSED JW" ||
        this.ars_status == "Manual Match Pending" ||
        this.externalvalue == 0
      ) {
        if (this.filterdata_id == 2) {
          if (res.code) {
            // this.SpinnerService.hide();
            // this.notification.showInfo("No Records in FAS Table!");
            this.tabledataManual = [];
            this.nodatafoundfas = true;
            this.fas_count_manualmatching='0'
          } else {
            this.tabledataManual = res["data"];
            for(let x of this.tabledataManual){
              this.fas_count_manualmatching=x.fas_count
            }
            console.log(this.fas_count_manualmatching,'fas count')
            // Filter out items with fas_edit equal to 1
            this.fas_edit_array = this.tabledataManual.filter(
              (item) => item.fas_edit === 1
            );
            console.log("fas_edit_array", this.fas_edit_array);
            // Loop through the filtered array

            for (const item of this.fas_edit_array) {
              let isAlreadyPresent = false;
              

              // for (let i = 0; i < this.payloadArray.length; i++) {
              //   if (this.payloadArray[i].id === item.id && this.payloadArray[i].type === item.type) {
              //       isAlreadyPresent = true;
              //       // If the item is already present, splice it from payloadArray
              //       this.payloadArray.splice(i, 1);
              //       break;
              //   }
              // }

              // Check if item with same id and type is already present in payloadArray
              // for (const [index, i] of this.payloadArray.entries()) {
              //   if (i?.id === item?.id && i?.type === item?.type) {
              //     if(i?.value === item.value){
              //       isAlreadyPresent = true;
              //       break;
              //     }
              //     else if(i?.value !== item?.value){
              //       this.payloadArray.splice(index, 1);
              //       isAlreadyPresent = true;
              //       break;
              //     }
              //   }
              // }
              for (const i of this.payloadArray) {
                if (i?.id === item?.id) {
                  isAlreadyPresent = true;
                  break;
                }
              }

              // If item is not already present, add it to payloadArray
              if (!isAlreadyPresent) {
                // let type = ''; // Assuming type is determined elsewhere
                let digit = ""; // Assuming digit is determined elsewhere
                // if (item.fas_edit) {
                //     this.type = 1;
                // } else{
                //     this.type = 2;
                // }
                if (item.fas_tag_alpha) {
                  digit = item.fas_tag_alpha;
                } else {
                  digit = "";
                }
                const data1 = {
                  id: item.id,
                  value: item.fas_action?.desp, // Assuming fas_action is always present
                  action_id:item.fas_action.id,
                  type: 1,
                  digit: digit,
                  newdata: false,
                };
                if (item.fas_action === "") {
                  data1["newdata"] = true;
                }
                this.payloadArray.push(data1);
                console.log("payload array", this.payloadArray);
              }
            }

            // this.SpinnerService.hide();
            console.log("payload array", this.payloadArray);

            // this.nodatafoundfas = false;
          }
        } else {
          if (res.code) {
            // this.notification.showInfo("No Records in FAS Table!");
            // this.SpinnerService.hide();
            this.tabledata = [];
            // this.nodatafoundfas = true;
            this.fas_count_sysandmanualmatched='0'
          } else {
            this.tabledata = res["data"];

            // this.SpinnerService.hide();
            for(let x of this.tabledata){
              this.fas_count_sysandmanualmatched=x.fas_count
            }
              console.log(this.fas_count_sysandmanualmatched,'fas count')
            // this.nodatafoundfas = false;
          }
        }

        // this.fasaction.patchValue({
        //           actions: this.tabledata.fas_action,
        //         });

        this.pagination = res.pagination ? res.pagination : this.pagination;
      } else if (this.ars_status == "Pending") {
        this.tabledataManual = [];
        this.tabledata = [];
        // this.SpinnerService.hide();
      }
      console.log(this.tabledataManual.length,'lengthlelengthlelengthle')
    });
    // this.inputField.nativeElement.innerHTML = '';
    this.fassearch.reset();
    this.fasOrcbs = "";

    // this.SpinnerService.hide();

    // if(this.ars_status == "Pending"){
    //   this.SpinnerService.show();
    //   // let params = "?page=" + pagenum;

    //   // this.brsService.MatchingData(params).subscribe((res) => {
    //   //   this.SpinnerService.hide();
    //   //   this.tabledata = res["data"];
    //   //   if(this.tabledata.length == 0){
    //       this.notification.showError("No records found!");
    // //     }
    // //     if(res.code){
    // //       this.notification.showError(res.code);
    // //       this.SpinnerService.hide();
    // //     }
    // // });
    // }
    
  }
  onChangecbs(pagenum) {
    this.fasOrcbs = 2;
    // if(this.externalpage == true){
    //   this.filterdata_id = 1
    // }

    if (this.showhidebuttons === 3) {
      this.actionChange = false;
    } else {
      this.actionChange = true;
    }
    this.cbsbranch_code = this.cbssearch.get("branchcontrolcbs").value;
    this.cbsglnumber = this.cbssearch.get("cbsglnumber").value;
    this.cbsglnumber2 = this.cbssearch.get("tag_number").value;
    this.cbstranactiondate = this.cbssearch.get(
      "Transactiondatepatchcbs"
    ).value;
    this.cbscreditdebit = this.cbssearch.get("DebitandCreditcbs").value;
    this.cbsamount = this.cbssearch.get("Amounttcbs").value;
    this.narration = this.cbssearch.get("Commonfieldcbs").value;
    this.AmtComparison = this.cbssearch.get("AmtComparisons").value;

    let params = "?page=" + pagenum;
    if(this.filterdata_id!=='1'){
      let branch_codeid = this.branch_codeid;
      branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";
    }
    if (this.externalpage == true) {
      let branch_codeid = this.externalform.get("branch_code").value;
      branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";

      let glcode_id = this.externalform.get("gl_no").value;
      glcode_id ? (params += "&gl_code=" + glcode_id) : "";

      let run_date = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
      run_date ? (params += "&run_date=" + run_date) : "";
    } else {
      // let branch_codeid = this.branch_codeid;
      // branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";

      let glcode_id = this.glcode_id;
      glcode_id ? (params += "&gl_code=" + glcode_id) : "";

      // let iDate = this.fasfromdate_date;
      // iDate ? (params += "&process_date=" + iDate) : "";

      let run_date = this.iDate;
      run_date ? (params += "&run_date=" + run_date) : "";
    }
    
    let filterdata_id = this.filterdata_id;
    filterdata_id ? (params += "&type=" + filterdata_id) : "";

    let action = this.action;
    action ? (params += "&action=" + action) : "";

    // let branch_codeid = this.branch_codeid;
    // branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";

    // let glcode_id = this.glcode_id;
    // glcode_id ? (params += "&gl_code=" + glcode_id) : "";

    // let run_date = this.iDate;
    // run_date ? (params += "&run_date=" + run_date) : "";

    let AmtComparison = this.AmtComparison;
    AmtComparison ? (params += "&comparison=" + AmtComparison) : "";

    let fasenddate_date = this.fasenddate_date;
    fasenddate_date ? (params += "&to_date=" + fasenddate_date) : "";

    let cbsbranch_code = this.cbsbranch_code;
    cbsbranch_code ? (params += "&branch_code=" + cbsbranch_code) : "";

    let cbsglnumber2 = this.cbsglnumber2;
    cbsglnumber2 ? (params += "&tagno=" + cbsglnumber2) : "";

    let cbsglnumber = this.cbsglnumber;
    cbsglnumber ? (params += "&gl_code=" + cbsglnumber) : "";

    let cbstranactiondate = this.cbstranactiondate;
    cbstranactiondate ? (params += "&trans_date=" + cbstranactiondate) : "";

    let cbscreditdebit = this.cbscreditdebit;
    cbscreditdebit ? (params += "&dr_cr=" + cbscreditdebit) : "";

    let cbsamount = this.cbsamount;
    cbsamount ? (params += "&start_amount=" + cbsamount) : "";

    let narration = this.narration;
    narration ? (params += "&tagno=" + narration) : "";

    let temp_name = this.fetch_template_name;
    temp_name ? (params += "&temp_name=" + temp_name) : "";

    let int_type = this.int_type;
    int_type ? (params += "&int_type=" + int_type) : "";

    let action_id = this.subtab_action_id;
    action_id ? (params += "&action_id=" + action_id) : "";

    let page_size = this.cbspagesize;
    page_size ? (params += "&page_size=" + page_size) : "";

    // value ? (params += "&value=" + value): "";
    if (
      this.ars_status == "System Match Done" ||
      this.ars_status == "Reconciled" ||
      this.ars_status == "PASSED GEFU" ||
      this.ars_status == "PASSED JW" ||
      this.ars_status == "Manual Match Pending" ||
      this.externalvalue == 0
    ) {
      // this.SpinnerService.show();

      let value = this.externalvalue;
     let payload={
      dict_val:this.cbssytammatchsearchlist
     }
     this.SpinnerService.show();
      this.brsService.Matchingcbsdata(params, value,payload).subscribe((res) => {
        this.SpinnerService.hide();
        if (this.filterdata_id == 2) {
          // this.url = this.ip + "brsserv/ARS_Dropdown"+"&value="+this.fasOrcbs;

          // this.url= this.url + '&value='+this.fasOrcbs;
          //  this.url= this.url + '?value=' + this.fasOrcbs;

          if (res.code) {
            // this.SpinnerService.hide();
            this.nodatafoundcbs = true;
            // this.notification.showInfo("No Records in CBS Table!");
            this.cbstabledataManual = [];
            this.cbs_count_manualmatching='0'
          } else {
            this.cbstabledataManual = res["data1"];
            for(let x of this.cbstabledataManual ){
              this.cbs_count_manualmatching=x.cbs_count
            }
            console.log(this.cbs_count_manualmatching,'cbs count')
            this.cbs_edit_array = this.cbstabledataManual.filter(
              (item) => item.cbs_edit === 1
            );
            console.log("cbs_edit_array", this.cbs_edit_array);
            // Loop through the filtered array
            for (const item of this.cbs_edit_array) {
              let isAlreadyPresent = false;

              for (const i of this.payloadArray) {
                if (i?.id === item?.id) {
                  isAlreadyPresent = true;
                  break;
                }
              }

              if (!isAlreadyPresent) {
                // let type = ''; // Assuming type is determined elsewhere
                let digit = ""; // Assuming digit is determined elsewhere
                // if (item.fas_edit) {
                //     this.type = 1;
                // } else{
                //     this.type = 2;
                // }
                if (item.cbs_tag_alpha) {
                  digit = item.cbs_tag_alpha;
                } else {
                  digit = "";
                }
                const data1 = {
                  id: item.id,
                  value: item.cbs_action?.desp, // Assuming fas_action is always present
                  action_id:item.cbs_action?.id,
                  type: 2,
                  digit: digit,
                  newdata: false,
                };
                if (item.fas_action === "") {
                  data1["newdata"] = true;
                }
                this.payloadArray.push(data1);
                console.log("payload array", this.payloadArray);
              }
            }

            // this.SpinnerService.hide();
            console.log("payload array", this.payloadArray);

            // this.nodatafoundcbs = false;
          }
        } else {
          if (res.code) {
            // this.SpinnerService.hide();
            this.nodatafoundcbs = true;
            // this.notification.showInfo("No Records in CBS Table!");
            this.cbstabledata = [];
            this.cbs_count_sysandmanualmatched='0'
          } else {
            this.cbstabledata = res["data1"];
            // this.SpinnerService.hide();
            this.nodatafoundcbs = false;
            for(let x of this.cbstabledata ){
              this.cbs_count_sysandmanualmatched=x.cbs_count
            }
            console.log(this.cbs_count_sysandmanualmatched,'cbs count')
            
          }
        }
        this.fas_match_count = this.cbstabledata[0]?.fas_match_count;
        this.fas_unmatch_count = this.cbstabledata[0]?.fas_unmatch_count;
        this.cbs_match_count = this.cbstabledata[0]?.cbs_match_count;
        this.cbs_unmatch_count = this.cbstabledata[0]?.cbs_unmatch_count;
        this.cbs_amount = this.cbstabledata[0]?.cbs_match_amount;
        this.fas_amount = this.cbstabledata[0]?.fas_match_amount;
        this.total = this.cbstabledata[0]?.overall;
        this.cbs_unmatch_amount = this.cbstabledata[0]?.cbs_unmatch_amount;
        this.fas_unmatch_amount = this.cbstabledata[0]?.fas_unmatch_amount;
        this.paginationcbs = res.pagination
          ? res.pagination
          : this.paginationcbs;
      });
      this.cbssearch.reset();
      this.fasOrcbs = "";
      // this.inputField.nativeElement.innerHTML = '';
    } else if (this.ars_status == "Pending") {
      this.cbstabledataManual = [];
      this.cbstabledata = [];
      // this.SpinnerService.hide();
    }
    // this.SpinnerService.hide();

    // else if(this.ars_status == "Pending"){
    //   this.SpinnerService.show();
    //   // let params = "?page=" + pagenum;

    //   // this.brsService.Matchingcbsdata(params).subscribe((res) => {
    //   //   this.SpinnerService.hide();
    //   //   this.tabledata = res["data"];
    //   //   if(this.tabledata.length == 0){
    //   //     this.notification.showError("No records found!");
    //   //   }
    //   //   if(res.code){
    //       this.notification.showError("No records found!..");
    //       this.SpinnerService.hide();
    // //     }
    // // });
  }

  //   onChangeRBF(pagenum) {
  //     console.log("page", pagenum);
  //     this.SpinnerService.show();

  //       this.fasbranch_code = this.fassearch.get("branchcode").value;
  //       this.fasgl_number = this.fassearch.get("glnumber").value;
  //       this.fastranactiondate = this.fassearch.get("tranactiondate").value;
  //       this.fascreditdebit = this.fassearch.get("creditdebit").value;
  //       this.fasothers = this.fassearch.get("others").value;
  //       this.Gid1 = this.fassearch.get("Gid").value;

  //       this.branch = this.fassearch.get("branchcontrol").value;
  //       this.Transactiondatepatch1 = this.fassearch.get("Transactiondatepatch").value;
  //       this.DebitandCredit1 = this.fassearch.get("DebitandCredit").value;
  //       this.Amountt1 = this.fassearch.get("Amountt").value;
  //       this.tag = this.fassearch.get("Commonfield").value;
  //       this.AmtComparison = this.fassearch.get('AmtComparisons').value;

  //       let params = "?page=" + pagenum;

  //       let filterdata_id = this.filterdata_id;
  //       filterdata_id ? (params += "&type=" + filterdata_id) : "";

  //       let fasbranch_code = this.fasbranch_code;
  //       fasbranch_code ? (params += "&branch_code=" + fasbranch_code) : "";

  //       let tag = this.tag;
  //       tag ? (params += "&tagno=" + tag) : "";

  //       let action = this.action;
  //       action ? (params += "&action=" + action) : "";

  //       let AmtComparison = this.AmtComparison;
  //       AmtComparison ? (params += "&comparison=" + AmtComparison) : "";

  //       let branch_codeid = this.branch_codeid;
  //       branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";

  //       let glcode_id = this.glcode_id;
  //       glcode_id ? (params += "&gl_code=" + glcode_id) : "";

  //       let iDate = this.fasfromdate_date;
  //       iDate ? (params += "&process_date=" + iDate) : "";

  //       let run_date = this.iDate;
  //       run_date ? (params += "&run_date=" + run_date) : "";

  //       let fasenddate_date = this.fasenddate_date;
  //       fasenddate_date ? (params += "&to_date=" + fasenddate_date) : "";

  //       let fasgl_number = this.fasgl_number;
  //       fasgl_number ? (params += "&gl_code=" + fasgl_number) : "";

  //       let Transactiondatepatch1 = this.Transactiondatepatch1;
  //       Transactiondatepatch1 ? (params += "&from_date=" + Transactiondatepatch1) : "";

  //       let DebitandCredit1 = this.DebitandCredit1;
  //       DebitandCredit1 ? (params += "&dr_cr=" + DebitandCredit1) : "";

  //       let fasothers = this.fasothers;
  //       fasothers ? (params += "&filters=" + fasothers) : "";

  //       let Amountt1 = this.Amountt1;
  //       Amountt1 ? (params += "&start_amount=" + Amountt1): "";

  //       this.brsService.MatchingData(params).subscribe((res) => {
  // this.SpinnerService.show();
  //           if (this.ars_status == "System Match Done" || this.ars_status == "Reconciled") {
  //                           if(this.filterdata_id == 2){

  //               if(res.code){
  //                 this.SpinnerService.hide();
  //                 this.notification.showInfo("No Records in FAS Table!");
  //                 this.tabledataManual = [];
  //                 // this.nodatafoundfas = true;
  //               }
  //               else {
  //                 this.tabledataManual = res["data"];

  //                 this.SpinnerService.hide();

  //                 // this.nodatafoundfas = false;

  //               }
  //             }
  //             else {
  //               if(res.code){
  //                   this.notification.showInfo("No Records in FAS Table!");
  //                   this.SpinnerService.hide();
  //                   this.tabledata = [];
  //                   // this.nodatafoundfas = true;

  //               }
  //               else {
  //                 this.tabledata = res["data"];

  //                 this.SpinnerService.hide();

  //                 // this.nodatafoundfas = false;

  //               }
  //         }

  // // this.fasaction.patchValue({
  // //           actions: this.tabledata.fas_action,
  // //         });

  //         this.pagination = res.pagination ? res.pagination : this.pagination;
  // }
  // else if(this.ars_status == "Pending"){
  //   this.tabledataManual = [];
  //   this.tabledata = [];
  //   this.SpinnerService.hide();
  // }

  //       });
  //       // this.inputField.nativeElement.innerHTML = '';
  //       this.fassearch.reset();
  //         // this.SpinnerService.hide();

  //         // if(this.ars_status == "Pending"){
  //     //   this.SpinnerService.show();
  //     //   // let params = "?page=" + pagenum;

  //     //   // this.brsService.MatchingData(params).subscribe((res) => {
  //     //   //   this.SpinnerService.hide();
  //     //   //   this.tabledata = res["data"];
  //     //   //   if(this.tabledata.length == 0){
  //     //       this.notification.showError("No records found!");
  //     // //     }
  //     // //     if(res.code){
  //     // //       this.notification.showError(res.code);
  //     // //       this.SpinnerService.hide();
  //     // //     }
  //     // // });
  //     // }
  // }
  //   onChangecbs(pagenum) {
  //   if (this.ars_status == "System Match Done" || this.ars_status == "Reconciled") {
  //     this.SpinnerService.show();
  // //  if(this.glcode_id===''||this.glcode_id===null||this.glcode_id===undefined){
  //       //     this.glcode_id=''
  //       //   }
  //       //   if(this.branch_codeid===''||this.branch_codeid===null||this.branch_codeid===undefined){
  //       //     this.branch_codeid=''
  //       this.cbsbranch_code = this.cbssearch.get("branchcontrolcbs").value;
  //       this.cbsglnumber = this.cbssearch.get("cbsglnumber").value;
  //       this.cbsglnumber2 = this.cbssearch.get("Commonfieldcbs").value;
  //       this.cbstranactiondate = this.cbssearch.get("Transactiondatepatchcbs").value;
  //       this.cbscreditdebit = this.cbssearch.get("DebitandCreditcbs").value;
  //       this.cbsamount = this.cbssearch.get("Amounttcbs").value;
  //       this.AmtComparison = this.cbssearch.get('AmtComparisons').value;

  // //   }

  //       let params = "?page=" + pagenum;

  //       let filterdata_id = this.filterdata_id;
  //       filterdata_id ? (params += "&type=" + filterdata_id) : "";

  //       let action = this.action;
  //       action ? (params += "&action=" + action) : "";

  //       let branch_codeid = this.branch_codeid;
  //       branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";

  //       let glcode_id = this.glcode_id;
  //       glcode_id ? (params += "&gl_code=" + glcode_id) : "";

  //       let iDate = this.fasfromdate_date;
  //       iDate ? (params += "&process_date=" + iDate) : "";

  //       let run_date = this.iDate;
  //       run_date ? (params += "&run_date=" + run_date) : "";

  //       let AmtComparison = this.AmtComparison;
  //       AmtComparison ? (params += "&comparison=" + AmtComparison) : "";

  //       let fasenddate_date = this.fasenddate_date;
  //       fasenddate_date ? (params += "&to_date=" + fasenddate_date) : "";

  //       let cbsbranch_code = this.cbsbranch_code;
  //       cbsbranch_code ? (params += "&branch_code=" + cbsbranch_code) : "";

  //       let cbsglnumber2 = this.cbsglnumber2;
  //       cbsglnumber2 ? (params += "&tagno=" + cbsglnumber2) : "";

  //       let cbsglnumber = this.cbsglnumber;
  //       cbsglnumber ? (params += "&gl_code=" + cbsglnumber) : "";

  //       let cbstranactiondate = this.cbstranactiondate;
  //       cbstranactiondate ? (params += "&from_date=" + cbstranactiondate) : "";

  //       let cbscreditdebit = this.cbscreditdebit;
  //       cbscreditdebit ? (params += "&dr_cr=" + cbscreditdebit) : "";

  //       let cbsamount = this.cbsamount;
  //       cbsamount ? (params += "&start_amount=" + cbsamount) : "";

  //       this.brsService.Matchingcbsdata(params).subscribe((res) => {
  //       if(this.filterdata_id == 2){
  //         if(res.code){
  //           this.SpinnerService.hide();
  //           this.nodatafoundcbs = true;
  //           this.notification.showInfo("No Records in CBS Table!");
  //           this.cbstabledataManual = [];
  //         }
  //         else {
  //             this.cbstabledataManual = res["data1"]

  //             this.SpinnerService.hide();

  //             this.nodatafoundcbs = false;
  //           }
  //       }
  //       else {
  //         if(res.code){
  //           this.SpinnerService.hide();
  //           this.nodatafoundcbs = true;
  //           this.notification.showInfo("No Records in CBS Table!");
  //           this.cbstabledata = [];

  //         }
  //         else {
  //           this.cbstabledata = res["data1"];

  //           this.SpinnerService.hide();

  //           this.nodatafoundcbs = false;

  //         }
  //       }
  //         this.fas_match_count = this.cbstabledata[0].fas_match_count;
  //         this.fas_unmatch_count = this.cbstabledata[0].fas_unmatch_count;
  //         this.cbs_match_count = this.cbstabledata[0].cbs_match_count;
  //         this.cbs_unmatch_count = this.cbstabledata[0].cbs_unmatch_count;
  //         this.cbs_amount = this.cbstabledata[0].cbs_match_amount;
  //         this.fas_amount = this.cbstabledata[0].fas_match_amount;
  //         this.total = this.cbstabledata[0].overall;
  //         this.cbs_unmatch_amount = this.cbstabledata[0].cbs_unmatch_amount;
  //         this.fas_unmatch_amount = this.cbstabledata[0].fas_unmatch_amount;
  //       this.paginationcbs = res.pagination
  //           ? res.pagination
  //           : this.paginationcbs;
  //     });
  //       this.cbssearch.reset();
  //       // this.inputField.nativeElement.innerHTML = '';

  //       }
  //   else if(this.ars_status == "Pending"){
  //         this.cbstabledataManual = [];
  //         this.cbstabledata = [];
  //         this.SpinnerService.hide();
  //       }
  //     // this.SpinnerService.hide();

  //     // else if(this.ars_status == "Pending"){
  //     //   this.SpinnerService.show();
  //     //   // let params = "?page=" + pagenum;

  //     //   // this.brsService.Matchingcbsdata(params).subscribe((res) => {
  //     //   //   this.SpinnerService.hide();
  //     //   //   this.tabledata = res["data"];
  //     //   //   if(this.tabledata.length == 0){
  //     //   //     this.notification.showError("No records found!");
  //     //   //   }
  //     //   //   if(res.code){
  //     //       this.notification.showError("No records found!..");
  //     //       this.SpinnerService.hide();
  //     // //     }
  //     // // });
  //   }
  //   onChangePartial(pagenum) {
  //     if (this.ars_status == "System Match Done") {
  //       this.SpinnerService.show();
  //       //  if(this.glcode_id===''||this.glcode_id===null||this.glcode_id===undefined){
  //       //     this.glcode_id=''
  //       //   }
  //       //   if(this.branch_codeid===''||this.branch_codeid===null||this.branch_codeid===undefined){
  //       //     this.branch_codeid=''
  //       // this.cbsbranch_code = this.cbssearch.get("branchcontrolcbs").value;
  //       // this.cbsglnumber = this.cbssearch.get("cbsglnumber").value;
  //       // this.cbsglnumber2 = this.cbssearch.get("Commonfieldcbs").value;
  //       // this.cbstranactiondate = this.cbssearch.get("Transactiondatepatchcbs").value;
  //       // this.cbscreditdebit = this.cbssearch.get("DebitandCreditcbs").value;
  //       // this.cbsamount = this.cbssearch.get("Amounttcbs").value;
  //       // this.AmtComparison = this.fassearch.get('AmtComparisons').value;

  //       //   }

  //       let params = "?page=" + pagenum;

  //       // let filterdata_id = this.filterdata_id;
  //       // filterdata_id ? (params += "&type=" + filterdata_id) : "";

  //       // let action = this.action;
  //       // action ? (params += "&action=" + action) : "";
  //       let branch_codeid = this.branch_codeid;
  //       let glcode_id = this.glcode_id;
  //       let iDate = this.iDate;
  //       let fas_ids = this.checkedfasItems;
  //       let cbs_ids = this.checkedcbsItems;

  //       let body = {
  //         "fas_id": fas_ids,
  //         "cbs_id": cbs_ids,
  //         "gl_no":glcode_id,
  //         "branch_code":branch_codeid,
  //         "date":iDate
  //       }

  //       // branch_codeid ? (params += "&branch_code1=" + glcode_id) : "";

  //       // let pagenum = pagenum;

  //       // glcode_id ? (params += "&gl_code=" + branch_codeid) : "";

  //       // iDate ? (params += "&process_date=" + iDate) : "";

  //       // let AmtComparison = this.AmtComparison;
  //       // AmtComparison ? (params += "&comparison=" + AmtComparison) : "";

  //       // let fas_id = this.checkedfasItems;
  //       // fas_id ? (params += "&fas_id=" + fas_id) : "";

  //       // let cbs_id = this.checkedcbsItems;
  //       // cbs_id ? (params += "&cbs_id=" + cbs_id) : "";

  //       this.brsService.MatchingPartialdata(params,body).subscribe((res) => {
  //         // this.partialtabledata = res["data"];
  //         const json_data = res.data;

  //         // Iterate through each array called "data" and display its contents
  //         json_data.forEach((obj: any) => {
  //           if ("data" in obj) {
  //             const partialtabledata = obj["data"];
  //             partialtabledata.forEach((item: any) => {
  //               console.log("Arrays : ",item);
  //             });
  //           }
  //         });

  //         this.SpinnerService.hide();
  //         if (res.code) {
  //           this.toster.error(res.code);
  //         }

  //         // this.fas_match_count = this.cbstabledata[0].fas_match_count;
  //         // this.fas_unmatch_count = this.cbstabledata[0].fas_unmatch_count;
  //         // this.cbs_match_count = this.cbstabledata[0].cbs_match_count;
  //         // this.cbs_unmatch_count = this.cbstabledata[0].cbs_unmatch_count;
  //         // this.cbs_amount = this.cbstabledata[0].cbs_match_amount;
  //         // this.fas_amount = this.cbstabledata[0].fas_match_amount;
  //         // this.total = this.cbstabledata[0].overall;
  //         // this.cbs_unmatch_amount = this.cbstabledata[0].cbs_unmatch_amount;
  //         // this.fas_unmatch_amount = this.cbstabledata[0].fas_unmatch_amount;
  //         // this.paginationcbs = res.pagination
  //         //   ? res.pagination
  //         //   : this.paginationcbs;
  //       });
  //       // this.cbssearch.reset();
  //     }
  //   }

  historynextclick() {
    this.pagination.index = this.pagination.index + 1;
    this.viewhistory(this.pagination.index);
  }
  historypreviousclick() {
    this.pagination.index = this.pagination.index - 1;
    this.viewhistory(this.pagination.index);
  }

  previousClick() {
    this.pagination.index = this.pagination.index - 1;
    this.onChangeRBF(this.pagination.index);
  }
  nextClick() {
    this.pagination.index = this.pagination.index + 1;
    this.onChangeRBF(this.pagination.index);
  }
  previousClickcbs() {
    this.paginationcbs.index = this.paginationcbs.index - 1;
    this.onChangecbs(this.paginationcbs.index);
  }
  nextClickcbs() {
    this.paginationcbs.index = this.paginationcbs.index + 1;
    this.onChangecbs(this.paginationcbs.index);
  }
  fasmanualpreviousClick() {
    this.pagination.index = this.pagination.index - 1;
    this.onChangeRBF(this.pagination.index);
    this.selectallcondition=false
    // this.fasselectoptionreset=[]
    this.fasselectoptionresetunsave=[]
    this.fasmatchedselectform.reset()
    let uncheck_event={source: 'MatCheckbox', checked: false}
    this.fasmatchedselectall(uncheck_event,1)
  }
  fasmanualnextClick() {
    this.pagination.index = this.pagination.index + 1;
    this.onChangeRBF(this.pagination.index);
    this.selectallcondition=false
    // this.fasselectoptionreset=[]
    this.fasselectoptionresetunsave=[]
    this.fasmatchedselectform.reset()
    let uncheck_event={source: 'MatCheckbox', checked: false}
    this.fasmatchedselectall(uncheck_event,1)
  }
  wisfinjvpreviousClick(){
    this.paginationwisfinjv.index = this.paginationwisfinjv.index - 1;
    this.combineDataJW()
  }
  wisfinjvnextClick(){
    this.paginationwisfinjv.index = this.paginationwisfinjv.index + 1;
    this.combineDataJW()
  }

  cbsmanualpreviousClick() {
    this.paginationcbs.index = this.paginationcbs.index - 1;
    this.onChangecbs(this.paginationcbs.index);
    this.selectallconditioncbs=false
    // this.cbsselectoptionreset=[]
    this.cbsselectoptionresetunsave=[]
    this.cbsmatchedselectform.reset()
    let uncheck_event={source: 'MatCheckbox', checked: false}
    this.cbsmatchedselectall(uncheck_event,2)
  }
  cbsmanualnextClick() {
    this.paginationcbs.index = this.paginationcbs.index + 1;
    this.onChangecbs(this.paginationcbs.index);
    this.selectallconditioncbs=false
    // this.cbsselectoptionreset=[]
    this.cbsselectoptionresetunsave=[]
    this.cbsmatchedselectform.reset()
    let uncheck_event={source: 'MatCheckbox', checked: false}
    this.cbsmatchedselectall(uncheck_event,2)
  }
  summaryprevious() {
    this.paginationsum.index = this.paginationsum.index - 1;
    this.getsummary(this.paginationsum.index);
  }
  summarynext() {   
    this.paginationsum.index = this.paginationsum.index + 1;
    this.getsummary(this.paginationsum.index);
  }

  onCheckboxChange(event, value, index) {
    let checked = event.currentTarget.checked;
    if (checked) {
      this.parentCheck.push(value.id);
      console.log("Parent Checkbox Id", this.parentCheck);
      this.recorddata = value;
      console.log("Record DATA", this.recorddata);
    } else {
      let index = this.parentCheck.indexOf(value.id);
      if (index !== -1) this.parentCheck.splice(index, 1);
    }
  }

  actionfasclick(data, type, index) {
    this.type = type.id;
    console.log("type", this.type);
    this.fas_edit = data.fas_edit;
    console.log("fas edit", this.fas_edit);

    this.action_id = data.id;
    this.fas_update_date = data.fas_update_date;
    this.fas_branchcode = data.fas_branch_code;
    this.fas_gl_code = data.fas_gl_number;

    console.log("Clicked on action:", type);
    console.log("Index:", index);
    this.edittagvar = index;

    console.log("selectedRowIndices2:", index);

    if (type.id === 1) {
      const selectedIndex = this.selectedRowIndices.indexOf(index);
      if (selectedIndex !== -1) {
      } else {
        this.selectedRowIndices.push(index);
      }
      console.log("selectedRowIndices1:", this.selectedRowIndices);
      console.log(
        "selectedRowIndices:",
        this.selectedRowIndices.includes(index)
      );
    }

    if (type.id === 1) {
      this.showmanualtagno = true;
    }
    // else if(type.id === 2 || type.id === 3 || type.id === 4){
    //   this.showmanualtagno = false;
    // }

    if (type.id === 1) {
      this.action_id_fas_array_assign.push(this.action_id);
      this.type_array_fas_assign.push(this.type);
      console.log("actionfasarrayassi", this.action_id_fas_array_assign);
      console.log("type fas arrayassi", this.type_array_fas_assign);
    } else if (type.id === 2 || type.id === 3 || type.id === 4) {
      this.action_id_fas_array.push(this.action_id);
      this.type_array_fas.push(this.type);
      console.log("actionfasarray", this.action_id_fas_array);
      console.log("type fas array", this.type_array_fas);
    }

    if (!this.type_array_fas_edit.includes(this.type)) {
      this.type_array_fas_edit.push(this.type);
    }
    if (!this.parentIdfas.includes(this.action_id)) {
      this.parentIdfas.push(this.action_id);
    }

    this.touchedfasAction.push(2);
    console.log("touched", this.type_array_fas_edit);

    this.actionKnock.get("actions").reset();
    this.addiconfas(data);
  }

  checkIntegritys() {
    if(this.int_type===''||this.int_type===null||this.int_type===undefined){
      this.notification.showError('Choose Integrity type')
       this.brsconcile.get('date').reset()
      this.iDate=''
      return
    }
    let page = 1;
    this.iDate = this.datepipe.transform(
      this.brsconcile.get("date").value,
      "yyyy-MM-dd"
    );
    this.brsService.integrityUnmatch(this.iDate).subscribe((res) => {
      this.integritydata = res["data"];
      console.log("IntegrityData", this.integritydata);
    });
    if (this.iDate) {
      this.searchvar["params"] = "&date=" + this.iDate+
      "&int_type="+this.int_type+"&type=1";
      this.searchvar["url"] = this.accUrl;
      this.searchvar = Object.assign({}, this.searchvar);
    } else {
      this.searchvar = {
        method: "get",
        searchkey: "gl_no",
        params: "",
        displaykey: "gl_code",
        label: "Account/GL",
        disabled: false,
        defaultvalue: "",
        wholedata: true,
      };
      this.searchvar = Object.assign({}, this.searchvar);
    }
    this.statuslists = {
      label: "ARS Status",
      method: "get",
      url: this.arsURL + "brsserv/ars_status_change",
      params:'&date='+this.iDate+'&int_type='+this.int_type,
      searchkey: "name",
      displaykey: "ars_status",
      wholedata: true,
    };
  }

  getglcodeid(item) {
    console.log("item", item);
    if(item===''||item===null||item===undefined){
      this.glcode_id = "";
    this.branch_codeid = "";
    }
    let page = 1;
    if (item !== undefined && item !== "" && item !== null) {
      this.glcode_id = item.gl_code;
      this.searchvar1["url"] = this.branchUrl;
      let params = "";
      // params+=this.glcode_id? "&gl_no="+this.glcode_id:''
      params += this.iDate ? "&date=" + this.iDate : "";
      params += this.int_type ? "&int_type=" + this.int_type : "";
      this.searchvar1["params"] = params;

      this.searchvar1 = Object.assign({}, this.searchvar1);
    }
    console.log("glcode_id", this.glcode_id);
  }
  arsfilterdate() {
    this.iarsDate = this.datepipe.transform(
      this.brsconcile.get("fromdate").value,
      "yyyy-MM-dd"
    );
  }

  summaryTab(event: MatTabChangeEvent, page) {
    this.filtername = event.tab.textLabel;
    if (this.filtername == "History Table") {
      this.filterdata_id = "4";
      this.onChangeRBF(page);
      this.onChangecbs(page);
    }
  }
  viewdatatabchange(event){
    this.viewtabchange = event.tab.textLabel;
    if(this.viewtabchange==='Auto fetch summary'){
      this.refresh_sum(3)
    }else if(event.tab.textLabel==='Current'){
      this.refresh_sum(2)
    }
  }

  getfiltersummary(event: MatTabChangeEvent, page): void {
    console.log("info", event);
    this.filterdata_id = event.tab.textLabel;
    console.log("this.filterid", this.filterdata_id);
    this.faspatchyes=false
    this.selectallcondition=false
    this.optionneedtopatch=undefined
    this.cbspatchyes=false
    this.selectallconditioncbs=false
    this.optionneedtopatchcbs=undefined
    this.cbssytammatchsearchlist=[]
    this.fassytammatchsearchlist=[]
    this.faspagesize=10
    this.cbspagesize=10
    this.faspageform.reset()
    this.cbspageform.reset()
    this.fasselectall.reset()
    this.cbsselectall.reset()
    this.resetfasselectalloption=[]
    this.resetcbsselectalloption=[]
    this.fas_count_manualmatching=''
    this.cbs_count_manualmatching=''
    this.fas_count_sysandmanualmatched=''
    this.cbs_count_sysandmanualmatched=''
    this.fas_tag_no.reset()
    this.cbs_tag_no.reset()
    this.cbs_tag_no_select.reset()
    this.fas_tag_no_select.reset()
    if (this.filterdata_id === "System Matched") {
      this.filterdata_id = "1";
      this.onChangeRBF(page);
      this.onChangecbs(page);
    }
    if (this.filterdata_id === "Manually Matching") {
      this.filterdata_id = "2";
      this.onChangeRBF(page);
      this.onChangecbs(page);
    }
    if (this.filterdata_id === "Manually Matched") {
      const selectedItemId = this.columnList[0]?.id;
      const showhide_id = this.columnList[0]?.type_1;
      this.onTabChange1(selectedItemId, page,showhide_id);
    }
   
    // else if(this.filterdata_id === "Partially Matched"){
    //   // this.filterdata_id='3'
    //   // this.onChangeRBFPartial(page)onTabChange1
    //   this.onChangePartial(page)
    //   // this.checkedItems = [];
    // }
   
  }

  onTabChange1(itemId: number, page,id): void {
    this.filterdata_id = "3";
    this.action = id;
    this.showhidebuttons = id;
    this.subtab_action_id = itemId;
    if (this.showhidebuttons===3) {
      this.actionChange = false;
    } else {
      this.actionChange = true;
    }
    this.onChangeRBF(page);
    this.onChangecbs(page);
  }

  onTabChange(event, page): void {
    console.log(event,'eventsss')
    this.cbspagesize=10
    this.faspagesize=10
    this.cbspageform.reset()
    this.faspageform.reset()
    let eventIndex = event.index;
    const selectedItemId = this.columnList[eventIndex].id;
    this.subtab_action_id = this.columnList[eventIndex].id;
    const showhide_id = this.columnList[eventIndex].type_1;
    this.filterdata_id = "3";
    this.action = showhide_id;
    this.showhidebuttons = showhide_id;
    if (this.showhidebuttons === 3) {
      this.actionChange = false;
    } else {
      this.actionChange = true;
    }
    this.onChangeRBF(page);
    this.onChangecbs(page);
    this.rows.clear();
    this.cbssytammatchsearchlist=[]
    this.fassytammatchsearchlist=[]
    this.fas_count_sysandmanualmatched=''
    this.cbs_count_sysandmanualmatched=''
    this.cbsmatchedselectform.reset()
    this.fasmatchedselectform.reset()
    let uncheck_event={source: 'MatCheckbox', checked: false}
    this.fasmatchedselectall(uncheck_event,1)
    this.cbsmatchedselectall(uncheck_event,2)
  }

  // getfiltersummary1(event: MatTabChangeEvent, page): void {
  //   this.filterdata_id = event.tab.textLabel;
  //   console.log("this.filterid", this.filterdata_id);

  //   if (this.filterdata_id === "ASSIGN TAG NUMBER") {
  //     this.filterdata_id = "3";
  //     this.action = "1";
  //     this.onChangeRBF(page);
  //     this.onChangecbs(page);
  //   } else if (this.filterdata_id === "PASS WISEFIN JV") {
  //     this.filterdata_id = "3";
  //     this.action = "2";
  //     this.onChangeRBF(page);
  //     this.onChangecbs(page);
  //   } else if (this.filterdata_id === "CHANGE ENTRY STATUS") {
  //     this.filterdata_id = "3";
  //     this.action = "3";
  //     this.onChangeRBF(page);
  //     this.onChangecbs(page);
  //   } else if (this.filterdata_id === "PASS GEFU") {
  //     this.filterdata_id = "3";
  //     this.action = "4";
  //     this.onChangeRBF(page);
  //     this.onChangecbs(page);
  //   }
  // }
  reset() {
    this.brsconcile.reset();
    this.resetForm = [];
    this.summarydatalist = [];
    this.resetFormstatus = [];
    this.glcode_id = "";
    this.branch_codeid = "";
    this.iDate = "";
    this.resetintegritytype=[]
    this.inttype.defaultvalue=undefined
    this.summarytableform.reset()
    this.summarytable_count='0'
    this.GL_count='0'
    this.summarypagesize=10
  }
  adddocument(page) {
    if(this.int_type===''||this.int_type===null||this.int_type===undefined){
      this.notification.showError('Select Integrity Name')
      return
    }
    let date = this.brsconcile.get("date").value;
    if (date == "" || date == null || date == undefined) {
      this.notification.showError("Select a date");
      return false;
    }
    this.getdatapanel.close()
    // this.mainpage=false
    // this.summarypage=false
    // this.mainpage=false
    // this.summarypage=true
    this.getsummary(page);
    // this.glcode_id = '';
    // this.iDate = '';
    // this.branch_codeid = '';
    
  }
  getbacktomain(page) {
    this.mainpage = true;
    this.summarypage = false;
    this.filterdata_id = "1";
    this.onChangeRBF(page);
    this.onChangecbs(page);
  }
  getsummary(pagenum) {
   
    this.SpinnerService.show();

    let params = "?page=" + pagenum;

    let branch_codeid = this.branch_codeid;
    let glcode_id = this.glcode_id;

    console.log("branch_codeid", branch_codeid);
    console.log("glcode_id", glcode_id);

    branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";

    // let pagenum = pagenum;

    glcode_id ? (params += "&gl_no=" + glcode_id) : "";

    let iDate = this.iDate;
    iDate ? (params += "&date=" + iDate) : "";

    let tag_no = this.brsconcile.get("tagnumber").value;
    tag_no ? (params += "&tag_no=" + tag_no) : "";

    let status = this.matchstatus;
    status ? (params += "&match=" + status) : "";
    let amountTyp = this.amountType;
    amountTyp ? (params += "&amount_type=" + amountTyp) : "";
    let amount = this.brsconcile.value.amount;
    amount ? (params += "&amount=" + amount) : "";
    let amt_count = this.amountlistcondition;
    amt_count ? (params += "&amt_count=" + amt_count) : "";
    let int_type = this.int_type;
    int_type ? (params += "&int_type=" + int_type) : "";
    let page_size = this.summarypagesize;
    page_size ? (params += "&page_size=" + page_size) : "";

    this.brsService.arssummarydata(params).subscribe((res) => {
      this.SpinnerService.hide();
     
      this.summarydatalist = res["data"];
      if(res?.count===0||!res?.hasOwnProperty('count')){
        this.summarytable_count='0'
      }
      else{
        this.summarytable_count=res?.count
      }
      if (this.summarydatalist.length === 0) {
        this.toster.info("No Data Found");
      }
      this.paginationsum = res.pagination ? res.pagination : this.paginationsum;
    });
    // this.glcode_id = '';
    // this.iDate = '';
    // this.branch_codeid = '';
    this.summarytabselectall.reset()
    this.selectallarray = []
  }

  NewSave(page) {
    let payload = {
      parent_id_fas: this.action_id_fas_array,
      parent_id_cbs: this.action_id_cbs_array,
      type_fas: this.type_array_fas,
      type_cbs: this.type_array_cbs,
      Date: this.iDate,
      branch_code: this.fas_branchcode,
      gl_code: this.fas_gl_code,
      edit: 1,
    };
    this.brsService.newActions(payload).subscribe((res) => {
      this.onChangeRBF(page);
      this.onChangecbs(page);
      this.SpinnerService.hide();

      if (res.code) {
        this.notification.showError(res.code);
      } else {
        this.notification.showSuccess(res.message);
        this.fasaction.patchValue({
          actions: this.tabledata.fas_action,
        });
      }
    });
    // this.fasaction.get("actions").reset();
  }

  actioncbsclick(data, type, index) {
    // const id = type.id;
    console.log("idddddddddd", type.id);

    this.cbsactiontype = type.type;
    let type_id = 1;
    let page = 1;
    let actionid = data.id;
    console.log("Clicked on action:", type);
    console.log("Index:", index);
    this.edittagvar = index;
    // Store the index globally

    console.log("selectedRowIndices2:", index);

    if (type.id === 1) {
      const selectedIndex = this.selectedRowIndices2.indexOf(index);
      if (selectedIndex !== -1) {
      } else {
        this.selectedRowIndices2.push(index);
      }
      console.log("selectedRowIndices1:", this.selectedRowIndices2);
      console.log(
        "selectedRowIndices:",
        this.selectedRowIndices2.includes(index)
      );
    }

    if (type.id === 1) {
      this.showmanualtagnocbs = true;
    }
    // else if(type.id === 2 || type.id === 3 || type.id === 4){
    //   this.showmanualtagnocbs = false;
    // }

    if (type.id == 1) {
      this.action_id_cbs_array_assign.push(this.action_id);
      this.type_array_cbs_assign.push(type.id);
    } else if (type.id === 2 || type.id === 3 || type.id === 4) {
      this.action_id_cbs_array.push(this.action_id);
      this.type_array_cbs.push(type.id);
    }

    if (!this.parentIdcbs.includes(actionid)) {
      this.parentIdcbs.push(actionid);
    }

    if (!this.type_array_cbs_edit.includes(type.id)) {
      this.type_array_cbs_edit.push(type.id);
    }

    this.touchedcbsAction.push(1);
    console.log("touched", this.touchedcbsAction);

    this.actionKnock.get("actions").reset();

    this.addiconcbs(data);
  }

  newAction() {}
  changeTab(tabIndex: number): void {
    this.selectedTabIndex = tabIndex;
  }
  resetfasaction(value){
    if(value)
      this.fassearch.get('value').reset()
  }
  fassearchtable(page) {
   let option= this.fassearch.get('dropdownoption').value
   let value=this.fassearch.get('value').value
   if(option===''||option===null||option===undefined){
    this.notification.showError('Choose Options')
    return
   }
   if(value===''||value===null||value===undefined){
    this.notification.showError('Enter Value')
    return
   }
   if(this.fassytammatchsearchlist.some(item => item.display_name === option)){
    this.fassearch.get('dropdownoption').reset()
    this.fassearch.get('value').reset()
    this.notification.showInfo('This filter is already applied')
    return
   }
   else{
    this.fassytammatchsearchlist.push({display_name:option,values:value})
    this.fassearch.get('dropdownoption').reset()
    this.fassearch.get('value').reset()
   }
   console.log(this.fassytammatchsearchlist,'fassytammatchsearchlist')
    // return
    this.onChangeRBF(page);
  }
  fastableclear() {
    this.faspatchyes=false
    this.selectallcondition=false
    this.optionneedtopatch=undefined
    this.fassytammatchsearchlist=[]
    this.fassearch.reset();
    this.faspagesize=10
    this.faspageform.reset()
    this.onChangeRBF(1);
  }
  cbstableclear() {
    this.cbspatchyes=false
    this.selectallconditioncbs=false
    this.optionneedtopatchcbs=undefined
    this.cbssytammatchsearchlist=[]
    this.cbssearch.reset();
    this.cbspagesize=10
    this.cbspageform.reset()
    this.onChangecbs(1);
  }
  resetcbsvalue(value){
if(value){
  this.cbssearch.get('value').reset()
}
  }
  cbssearchtable(page) {
    let option= this.cbssearch.get('dropdownoption').value
   let value=this.cbssearch.get('value').value
   if(option===''||option===null||option===undefined){
    this.notification.showError('Choose Options')
    return
   }
   if(value===''||value===null||value===undefined){
    this.notification.showError('Enter Value')
    return
   }
   if(this.cbssytammatchsearchlist.some(item => item.display_name === option)){
    this.cbssearch.get('dropdownoption').reset()
    this.cbssearch.get('value').reset()
    this.notification.showInfo('This filter is already applied')
    return
   }
   else{
    this.cbssytammatchsearchlist.push({display_name:option,values:value})
    this.cbssearch.get('dropdownoption').reset()
    this.cbssearch.get('value').reset()
   }
    // return
    this.onChangecbs(page);
  }
  fasfromdate() {
    this.fasfromdate_date = this.datepipe.transform(
      this.fassearch.get("fasfromdate").value,
      "yyyy-MM-dd"
    );
    console.log("this.fasfromdate_date", this.fasfromdate_date);
  }
  fasenddate() {
    this.fasenddate_date = this.datepipe.transform(
      this.fassearch.get("fasenddate").value,
      "yyyy-MM-dd"
    );
    console.log("this.fasenddate_date", this.fasenddate_date);

    // this.iDate = '';
    // this.glcode_id = '';
    // this.branch_code = '';
  }
  external(page) {
    this.mainpage = false;
    this.summarypage = true;
    this.externalpage = true;
    this.externalpagechip = false;
    this.externalvalue = 0;
    // this.filterdata_id = 1;\
    this.dd_validation_template=0    
    this.temp_field = {
      label: "Template Name",
      method: "get",
      url: this.arsURL + "brsserv/wisefin_template",
      params: "&recon_ars="+this.dd_validation_template,
      searchkey: "query",
      displaykey: "template_name",
      wholedata: true,
    };
    let auto_dict = {
      branch_code: this.branch_codeid,
      gl_code: this.glcode_id,
      process_date: this.iDate,
    };

    if (
      this.ars_status == "System Match Done" ||
      this.ars_status == "Reconciled" ||
      this.ars_status == "PASSED GEFU" ||
      this.ars_status == "PASSED JW" ||
      this.ars_status == "Manual Match Pending"
    ) {
      this.brsService.autofetchdate(auto_dict).subscribe((results) => {
        this.fr_date = results.data[0].from_date;
        this.to_date = results.data[0].to_date;
        console.log("Actions", this.fr_date, this.to_date);
        this.fassearch.patchValue({
          fasfromdate: this.fr_date,
          fasenddate: this.to_date,
        });

        this.fasfromdate();
        this.fasenddate();
        this.filterdata_id = "1";
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.getCategoryList();
      });
    } else if (this.ars_status == "Pending") {
      this.tabledata = [];
      this.cbstabledata = [];
    }
  }

  viewfascbstable(sum, page) {
    this.mainpage = false;
    this.summarypage = true;
    this.externalpage = false;
    this.externalpagechip = true;
    this.branch_codeid = sum.kd_branchcode;
    this.glcode_id = sum.kd_accountno;
    this.externalvalue = 1;
    this.ars_status = sum.ars_status;
    this.temp_name = sum.temp_name;
    this.fetch_template_name = sum.temp_name;
    // if(this.temp_name == "None" || this.temp_name == null ){
    //   this.dd_show = true
    //   this.table_show = false
    // }
    this.dd_validation_template=1
    this.temp_field = {
      label: "Template Name",
      method: "get",
      url: this.arsURL + "brsserv/wisefin_template",
      params: "&recon_ars="+this.dd_validation_template,
      searchkey: "query",
      displaykey: "template_name",
      wholedata: true,
    };
    if (this.ars_status == "Pending") {
      this.dd_show = true;
      this.table_show = false;
    } else {
      if (this.externalpage == false) {
        this.dd_show = false;
        this.table_show = true;
      } else if (this.externalpage == true) {
        this.table_show = true;
      }
      this.brsService
        .dynamicheaderfetchdata(this.temp_name)
        .subscribe((results) => {
          let data = results;
          this.datas1 = results;
          this.cbsdatas = this.datas1.cbs;
          this.wisefindatas = this.datas1.wisefin;
          console.log("cbsdatas ====>", this.cbsdatas);
          console.log("wisefindatas ====>", this.wisefindatas);
          this.cbsKeys = Object.keys(data.cbs);
          this.wisefinKeys = Object.keys(data.wisefin);
          console.log("cbsKeys ====>", this.cbsKeys);
          console.log("wisefinKeys ====>", this.wisefinKeys);
        });
    }
    this.int_dict = {
      gl_branch: this.branch_codeid,
      gl_code: this.glcode_id,
      date: this.iDate,
      value: this.externalvalue,
    };
    console.log(this.int_dict);

    let auto_dict = {
      branch_code: this.branch_codeid,
      gl_code: this.glcode_id,
      process_date: this.iDate,
    };
   
    if(this.ars_status == "System Match Done" || this.ars_status == "Reconciled" || this.ars_status == "PASSED GEFU"  
    || this.ars_status == "PASSED JW" || this.ars_status == "Manual Match Pending" ){ 
      this.fasfromdate();
      this.fasenddate();
      this.filterdata_id = "1";
      this.onChangeRBF(page);
      this.onChangecbs(page);
      this.getCategoryList();
//       this.brsService.autofetchdate(auto_dict).subscribe((results) => {
//       this.fr_date = results.data[0].from_date;
//       this.to_date = results.data[0].to_date;
//       console.log("Actions", this.fr_date, this.to_date);
//       this.fassearch.patchValue({
//         fasfromdate: this.fr_date,
//         fasenddate: this.to_date,
//       });

// //       let from_date = this.datepipe.transform(
// //         this.fr_date,
// //         "dd/MM/yyyy"
// //       );
     
// //       const fromDate = new Date(from_date); 
// //       this.fassearch.get('fasfromdate').setValue(fromDate,  { emitEvent: true });

// //       let to_date = this.datepipe.transform(
// //         this.to_date,
// //         "dd/MM/yyyy"
// //       );

// //       const dateString = to_date;
// // const dateParts = dateString.split('/'); // Split the date string into day, month, and year
// // const day = parseInt(dateParts[0], 10); // Parse day as an integer
// // const month = parseInt(dateParts[1], 10) - 1; // Parse month as an integer (subtract 1 as months are 0-indexed in Date)
// // const year = parseInt(dateParts[2], 10); // Parse year as an integer

// // const toDate = new Date(year, month, day);

// // console.log(toDate); 
// //       // const toDate = new Date(to_date); 
// //       this.fassearch.get('fasenddate').setValue(toDate, { emitEvent: true });

//       this.fasfromdate();
//       this.fasenddate();
//       this.filterdata_id = "1";
//       this.onChangeRBF(page);
//       this.onChangecbs(page);
//       this.getCategoryList();
//     });
    }
    else if (this.ars_status == "Pending"){
      // if(results.data.length === 0){
      // this.SpinnerService.show();
      // this.fasfromdate();
      // this.fasenddate(1);
      // this.SpinnerService.hide();
      this.tabledata = [];
      this.cbstabledata = [];
      // this.notification.showError("No records found!..");

      // }
    }
    this.temp_field_arsaction = {
      label: "Template Name",
      method: "get",
      url: this.arsURL + "brsserv/account_template_mapping",
      params: "&no="+this.glcode_id,
      searchkey: "query",
      displaykey: "template_name",
      wholedata: true,
    };
  }
  backtoDateFormat(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB"); // 'en-GB' specifies the format as DD/MM/YYYY
    console.log(formattedDate); // Output: "31/01/2024"
  }

  selectednewfuc(i) {
    let variableName = "variable_" + i;
    // this.selectednew=
    let va = {
      default: true,
      i: i,
    };
    this.selectednew[variableName] = va;
  }
  selectednewfucn(i) {
    let variableName = "variable_" + i;
    // this.selectednew=
    let va = {
      default: true,
      i: i,
    };
    this.selectednews[variableName] = va;
  }
  selectednewfucncancel(i) {
    let variableName = "variable_" + i;
    // this.selectednew=
    let value = {
      default: false,
      i: i,
    };
    this.selectednews[variableName] = value;
  }
  selectednewfuccancel(i) {
    let variableName = "variable_" + i;
    // this.selectednew=
    let value = {
      default: false,
      i: i,
    };
    this.selectednew[variableName] = value;
  }

  // selectednewfucrefreshcbs(data,page){
  //   let id = data.id;
  //   this.brsService.actionRefreshcbs(id).subscribe((res) => {
  //     this.SpinnerService.show();
  //     if(res.status){
  //       this.notification.showInfo("Action Removed!");
  //       this.onChangeRBF(page);
  //       this.onChangecbs(page);
  //       // this.fasaction.get("actions").reset();
  //       // this.cbsaction.get("actions").reset();
  //       this.SpinnerService.hide();

  //     }
  //   })
  // }

  backtoTaskSummary() {
    this.radiobuttonform.get("radioOption").reset();
    this.radiobuttonform.get("radioOptioncbs").reset();
    this.multiplecheckbox = 0;
    this.compareglcheckbox = 0;
    this.mainpage = true;
    this.summarypage = false;
    this.branch_codeid = "";
    this.glcode_id = "";
    this.matchstatus = "";
    this.action = "";
    this.fasenddate_date = "";
    this.changeTab(0);
    this.payloadArray = [];
    this.payArr = [];
    this.chipSelectedObj = [];
    this.chipSelectedObj1 = [];
    this.chipSelectedObj2 = [];
    this.chipSelectedObj3 = [];
    this.rows.clear();
    this.CombineArray = [];
    this.selectedOption = "";
    this.externalform.reset();
    // this.onChangeRBF(page);
    // this.onChangecbs(page);
    this.faspatchyes=false
    this.selectallcondition=false
    this.optionneedtopatch=undefined
    this.cbspatchyes=false
    this.selectallconditioncbs=false
    this.optionneedtopatchcbs=undefined
    this.faspagesize=10
    this.cbspagesize=10
    this.faspageform.reset()
    this.cbspageform.reset()
    this.fasselectall.reset()
    this.cbsselectall.reset()
    this.resetfasselectalloption=[]
    this.resetcbsselectalloption=[]
    this.new_fas_cbs_fetch_values=[]
    this.inttype.defaultvalue=this.int_type_wholedata
    this.fas_count_manualmatching=''
    this.cbs_count_manualmatching=''
    this.fas_count_sysandmanualmatched=''
    this.cbs_count_sysandmanualmatched=''
    this.fas_tag_no.reset()
    this.cbs_tag_no.reset()
    this.cbs_tag_no_select.reset()
    this.fas_tag_no_select.reset()
  }

  // fas
  edittagnumber(data, type) {
    console.log("dataaaa", data);
    if (type === 4) {
      this.edit_tag_no = data.fas_tag_no;
      this.tag_no_id = data.id;
      this.tag_type_no = type;
    }

    if (type === 1) {
      this.edit_tag_no = data.cbs_tag_no;
      this.tag_no_id = data.id;
      this.tag_type_no = type;
    }
    // this.fas_gl_no = data.fas_gl_number;
  }

  // cbs
  // edittagnumber2(data, type) {
  //   console.log("dataaaa", data);
  //   this.edit_tag_no2 = data.cbs_tag_no;
  //   this.tag_no2_id = data.id;
  //   this.tag_type_no2 = type;
  //   this.cbs_gl_no = data.cbs_gl_number;
  // }

  // editcbstagnumber(data,type){
  //   this.edit_tag_no=data.cbs_tag_no
  //   this.tag_no_id=data.id
  //   this.tag_type_no=type
  //   // this.tagnumber=this.fassearch.get('edittag_number').value

  // }

  getexceldownload(id) {
    let data = id;
    if (data === 4) {
      this.filetype = 4;
    } else if (data === 5) {
      this.filetype = 5;
    }
    this.brsService.getcampaignexceldownload(this.filetype).subscribe(
      (data) => {
        // this.SpinnerService.hide()
        let binaryData = [];
        binaryData.push(data);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download =
          this.datepipe.transform(new Date(), "dd/MM/yyyy") + ".xlsx";
        link.click();
      },
      (error) => {
        // this.SpinnerService.hide()
      }
    );
  }
  // getexceldownloadfas(id) {
  //   let data = id;
  //   let fileType;

  //   // Determine the file type based on the provided ID
  //   if (data === 4) {

  //     fileType = 4;
  //   } else if (data === 5) {
  //     fileType = 5;
  //   }

  //   // Request the Excel file from the service
  //   this.brsService.getcampaignexceldownload(fileType).subscribe(
  //     (responseData) => {
  //       // Check if response data is valid
  //       if (responseData && responseData.byteLength > 0) {
  //         // Convert the response data to ArrayBuffer
  //         let arrayBuffer = new Uint8Array(responseData).buffer;

  //         // Create a blob from the arrayBuffer
  //         let blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  //         // Create a URL for the blob
  //         let downloadUrl = window.URL.createObjectURL(blob);

  //         // Create a link element and set its properties
  //         let link = document.createElement("a");
  //         link.href = downloadUrl;
  //         link.download = this.datepipe.transform(new Date(), "dd/MM/yyyy") + ".xlsx";

  //         // Simulate a click on the link to trigger the download
  //         link.click();
  //       } else {
  //         // Handle empty or invalid response data
  //         console.error("Empty or invalid response data received");
  //         // Show error message to the user
  //         // Notify the user that the download failed
  //       }
  //     },
  //     (error) => {
  //       // Handle errors
  //       console.error("Error downloading Excel file:", error);
  //       // Show error message to the user
  //       // Notify the user that the download failed
  //     }
  //   );
  // }

  // savemanualmatch(page) {
  //   this.showedit = false;
  //   let payload = {
  //     parent_id_fas: this.action_id_fas_array,
  //     parent_id_cbs: this.action_id_cbs_array,
  //     type_fas: this.type_array_fas,
  //     type_cbs: this.type_array_cbs,
  //     Date: this.iDate,
  //     branch_code: this.fas_branchcode,
  //     gl_code: this.fas_gl_code,
  //     edit: 2,
  //   };

  //   this.brsService.newActions(payload).subscribe((res) => {
  //     this.SpinnerService.hide();
  //     if (res.code) {
  //       this.notification.showError(res.code);
  //     } else {
  //       this.notification.showSuccess(res.message);
  //       // this.onChangeRBF(page)
  //       // this.onChangecbs(page)
  //     }
  //   });
  //   this.fasaction.get("actions").reset();

  //   // if (this.tagnumber !== 's') {
  //   //       this.toster.error("Enter single Digit letter");
  //   //       return;
  //   //     }
  //   this.tagnumber = this.fassearch.get("edittag_number").value;
  //   this.tagnumber2 = this.fassearch.get("edittag_number2").value;

  //   let digit = [];
  //   digit.push(this.tagnumber);

  //   let fas_id = [];
  //   fas_id.push(this.tag_no_id);

  //   let cbs_id = [];
  //   cbs_id.push(this.tag_no2_id);

  //   let payloadd = {
  //     data: [
  //       {
  //         digit: digit,
  //         fas_id: fas_id,
  //         fas_type: this.tag_type_no,
  //         gl_code: this.branch_codeid,
  //         cbs_id: cbs_id,
  //         cbs_type: this.tag_type_no2,
  //       },
  //     ],
  //   };
  //   console.log("tag1", this.tag_no_id);

  //   // console.log('tag2',this.tag_no_id2)

  //   this.brsService.editfastagnumber(payloadd).subscribe((res) => {
  //     if (res.status) {
  //       this.toster.success(res.message);
  //       this.closetagnumber.nativeElement.click();
  //       this.fassearch.get("edittag_number").reset();
  //       this.onChangeRBF(page);
  //       this.onChangecbs(page);
  //     } else {
  //       this.toster.error(res.code);
  //       this.closetagnumber.nativeElement.click();
  //       this.fassearch.get("edittag_number").reset();
  //     }
  //   });
  // }
  // submittagnumber(page) {
  //   this.tagnumber = this.fassearch.get("edittag_number").value;
  //   if (
  //     this.fassearch.value.edittag_number === "" ||
  //     this.fassearch.value.edittag_number === null ||
  //     this.fassearch.value.edittag_number === undefined
  //   ) {
  //     this.toster.error("Enter Tag Number");
  //     return;
  //   }
  //   if (this.tagnumber !== 'a') {
  //     this.toster.error("Enter single Digit letter");
  //     return;
  //   }

  //   let payload = {
  //     data: [
  //       {
  //         digit: this.tagnumber,
  //         fas_id: this.tag_no_id,
  //         fas_type: this.tag_type_no,
  //         gl_code: this.branch_codeid,
  //         cbs_id: this.tag_no_id,
  //         cbs_type: this.tag_type_no,
  //       },
  //     ],
  //   };
  //   this.brsService.editfastagnumber(payload).subscribe((res) => {
  //     if (res.status) {
  //       this.toster.success(res.message);
  //       this.closetagnumber.nativeElement.click();
  //       this.fassearch.get("edittag_number").reset();
  //       this.onChangeRBF(page);
  //       this.onChangecbs(page);
  //     } else {
  //       this.toster.error(res.code);
  //       this.closetagnumber.nativeElement.click();
  //       this.fassearch.get("edittag_number").reset();
  //     }
  //   });
  // }

  addiconfas(data) {
    let compare = data.id;
    let fas_com_amount = data.fas_amount;
    this.fas_compare_total = this.fas_compare_total + fas_com_amount;
    this.fasarray.push({ id: compare });
    data.isCompareClicked = true;
  }
  addiconcbs(data) {
    let compare = data.id;
    let cbs_comp_amount = data.cbs_amount;
    this.cbs_compare_total = this.cbs_compare_total + cbs_comp_amount;
    this.cbsarray.push({ id: compare });
    data.isCompareClicked = true;
  }
  compareamount(page) {
    let payload = {
      fas: this.fasarray,
      cbs: this.cbsarray,
    };
    this.brsService.submitcompare(payload).subscribe((res) => {
      if (res.description) {
        this.toster.error(res.description);
      } else {
        this.toster.success(res.message);
      }
    });
  }

  getcbssearch(data: any, header: string) {
    this.cbsdatavalue = data;

    if (header === "Branch Code") {
      this.cbssearch.patchValue({
        branchcontrolcbs: this.cbsdatavalue,
      });
    }
    // if (header === "Tag Number") {
    //   this.cbssearch.patchValue({
    //     tag_number: this.cbsdatavalue,
    //   });
    // }
    // if (header === "Narration") {
    //   this.cbssearch.patchValue({
    //     narration: this.cbsdatavalue,
    //   });
    // }
    if (header === "Dr/Cr") {
      this.cbssearch.patchValue({
        DebitandCreditcbs: this.cbsdatavalue,
      });
    }
    if (header === "Amount") {
      this.cbssearch.patchValue({
        Amounttcbs: this.cbsdatavalue,
      });
    }
    if (header === "Date") {
      this.cbssearch.patchValue({
        Transactiondatepatchcbs: this.cbsdatavalue,
      });
    }
    if (header === "Tag Number" || header === "Narration") {
      this.cbssearch.patchValue({
        Commonfieldcbs: this.cbsdatavalue,
      });
    }
  }
  formatDate(dateString: string): string {
    const parts = dateString.split("-");
    return `${parts[0]}/${parts[1]}/${parts[2]}`;
  }

  handleButtonClick(
    data1: any,
    data2: any,
    data3: any,
    header: string,
    page,
    col
  ) {
    console.log(col, "col");
    this.fetch_template = col.template_name;
    this.fetch_template_name = col.template_name.template_name;
    this.temp_field = {
      label: "Template Name",
      method: "get",
      url: this.arsURL + "brsserv/wisefin_template",
      params: "",
      searchkey: "query",
      displaykey: "template_name",
      wholedata: true,
      defaultvalue: this.fetch_template,
    };
    this.getexternalsummary(data1, data2, data3, header);
    this.filterdata_id = "1";
    this.fetchsummary(page);
    this.brsService
      .dynamicheaderfetchdata(this.fetch_template_name)
      .subscribe((results) => {
        let data = results;
        this.datas1 = results;
        this.cbsdatas = this.datas1.cbs;
        this.wisefindatas = this.datas1.wisefin;
        console.log("cbsdatas ====>", this.cbsdatas);
        console.log("wisefindatas ====>", this.wisefindatas);
        this.cbsKeys = Object.keys(data.cbs);
        this.wisefinKeys = Object.keys(data.wisefin);
        console.log("cbsKeys ====>", this.cbsKeys);
        console.log("wisefinKeys ====>", this.wisefinKeys);
      });
  }
  fetchsummary(page) {
    this.onChangeRBF(page);
    this.onChangecbs(page);
    // this.active_status();
    this.SpinnerService.hide();
    this.payloadArray = [];
  }

  getexternalsummary(data1: any, data2: any, data3: any, header: string) {
    this.gl_data1 = data1;
    this.gl_data2 = data2;
    // this.gl_data3 = this.formatDate(data3);
    this.gl_data3 = data3;
    const parts = this.gl_data3.split("-");
    const formattedDate = new Date(
      Number(parts[2]),
      Number(parts[1]) - 1,
      Number(parts[0])
    );

    console.log(this.gl_data1, this.gl_data2, this.gl_data3);
    if (header == "Headers") {
      this.externalform.patchValue({ gl_no: this.gl_data1 });
      this.externalform.patchValue({ branch_code: this.gl_data2 });
      this.externalform.patchValue({ date: formattedDate });
    }
  }

  getfassearch(data: any, header: string) {
    this.fasdatavalue = data;

    if (header === "Branch Code") {
      this.fassearch.patchValue({
        branchcontrol: this.fasdatavalue,
      });
    }
    if (header === "Branch date") {
      this.fassearch.patchValue({
        Transactiondatepatch: this.fasdatavalue,
      });
    }
    if (header === "Dr/Cr") {
      this.fassearch.patchValue({
        DebitandCredit: this.fasdatavalue,
      });
    }
    if (header === "Amount") {
      this.fassearch.patchValue({
        Amountt: this.fasdatavalue,
      });
    }
    // if (header === "Tag Number") {
    //   this.fassearch.patchValue({
    //     tag_number: this.fasdatavalue,
    //   });
    // }
    // if (header === "Remark") {
    //   this.fassearch.patchValue({
    //     remark: this.fasdatavalue,
    //   });
    // }
    // if (header === "Entry Crno") {
    //   this.fassearch.patchValue({
    //     entry_crno: this.fasdatavalue,
    //   });
    // }
    // if (header === "Entry Gid") {
    //   this.fassearch.patchValue({
    //     entry_gid: this.fasdatavalue,
    //   });
    // }
    if (header === "Entry Module") {
      this.fassearch.patchValue({
        entry_module: this.fasdatavalue,
      });
    }
    if (
      header === "Tag Number" ||
      header === "Remark" ||
      header === "Entry Crno" ||
      header === "Entry Gid" ||
      header === "Entry Module"
    ) {
      this.fassearch.patchValue({
        Commonfield: this.fasdatavalue,
      });
    }
  }

  addEntry(digit_val: string, id_val: number, type_val: number) {
    const existingEntry = this.arr.find((entry) => entry.digit === digit_val);

    if (existingEntry) {
      if (type_val === 4) {
        existingEntry.fas_id.push(id_val);
      } else {
        existingEntry.cbs_id.push(id_val);
      }
    } else {
      // const new_entry: popupEntry = {
      //   data: [
      //     {
      //       digit: digit_val,
      //       fas_type: 4,
      //       fas_id: type_val === 4 ? [id_val] : [],
      //       cbs_type: 1,
      //       cbs_id: type_val === 1 ? [id_val] : [],
      //     },
      //   ],
      // };
      const new_entry = {
        digit: digit_val,
        fas_type: 4,
        fas_id: type_val === 4 ? [id_val] : [],
        cbs_type: 1,
        cbs_id: type_val === 1 ? [id_val] : [],
      } as popupEntry;
      this.arr.push(new_entry);
    }
  }
  singleChar(event: KeyboardEvent, index) {
    const inputValue = (event.target as HTMLInputElement).value;
    const regex = /^[a-zA-Z]$/;
    if (inputValue.length >= 1 || !regex.test(event.key)) {
      this.notification.showInfo("Only one letter allowed!");
      event.preventDefault();
      return;
    } else {
      console.log("digit", this.payloadArray[index]["digit"]);
      console.log("eventkey", event.key);

      this.payloadArray[index]["digit"] = event.key;
      this.payloadArray[index]["newdata"] = true;
    }
    console.log("event", event);
  }
  submittagnumber(page) {
    this.tagnumber = this.fassearch.get("edittag_number").value;

    if (
      this.tagnumber === "" ||
      this.tagnumber === null ||
      this.tagnumber === undefined
    ) {
      this.toster.error("Enter Tag Number");
      return;
    }

    // if (!/^[a-zA-Z]$/.test(this.tagnumber)) {
    //   this.toster.error("Enter a single alphabetical character");
    //   return;
    // }

    this.addEntry(this.tagnumber, this.tag_no_id, this.tag_type_no);
    // this.tag_no_id = []
    // this.tag_type_no = []
    console.log("tetsingTheData", this.arr);
    this.closetagnumber.nativeElement.click();
    this.closebuttontagcbs.nativeElement.click();
    // this.closebuttontag.nativeElement.click();
    this.fassearch.get("edittag_number").reset();
    this.fassearch.get("edittag_number2").reset();
  }

  submitmanualmatch(page) {
    console.log("payloadArray", this.payloadArray);
    this.payloadArray = [];

    // this.tagnumber = this.fassearch.get("edittag_number").value;

    // if (
    //   this.tagnumber === "" ||
    //   this.tagnumber === null ||
    //   this.tagnumber === undefined
    // ) {
    //   this.toster.error("Please enter a Tag Number!");
    //   return;
    // }

    // if (!/^[a-zA-Z]$/.test(this.tagnumber)) {
    //   this.toster.error("Enter a single alphabetical character");
    //   return;
    // }

    this.addEntry(this.tagnumber, this.tag_no_id, this.tag_type_no);
    // this.tag_no_id = []
    // this.tag_type_no = []

    // console.log("tetsingTheData", this.arr);

    // this.closetagnumber.nativeElement.click();
    // this.closebuttontagcbs.nativeElement.click();
    // this.closebuttontag.nativeElement.click();
    // this.fassearch.get("edittag_number").reset();
    // this.fassearch.get("edittag_number2").reset();

    let payload = {
      parent_id_fas: this.parentIdfas,
      parent_id_cbs: this.parentIdcbs,
      type_fas: this.type_array_fas_edit,
      type_cbs: this.type_array_cbs_edit,
      Date: this.iDate,
      branch_code: this.branch_codeid,
      gl_code: this.glcode_id,
      edit: 0,
      cbs_flag: this.touchedcbsAction,
      fas_flag: this.touchedfasAction,
    };

    if (this.type === 1) {
      this.brsService.editfastagnumber(this.arr).subscribe((res) => {
        if (res.status) {
          this.toster.success(res.message);
          // this.arr = [];
          this.brsService.newActions(payload).subscribe((res) => {
            this.SpinnerService.show();
            if (res.code) {
              this.notification.showError(res.code);
            } else {
              this.notification.showSuccess(res.message);
              this.onChangeRBF(page);
              this.onChangecbs(page);
              this.SpinnerService.hide();
            }
          });
          // this.closetagnumber.nativeElement.click();
          this.fassearch.get("edittag_number").reset();
          this.fassearch.get("edittag_number2").reset();

          // this.onChangeRBF(page);
          // this.onChangecbs(page);
          this.arr = [];
        } else {
          this.toster.error(res.code);
          // this.closetagnumber.nativeElement.click();
          this.fassearch.get("edittag_number").reset();
          this.fassearch.get("edittag_number2").reset();
        }
      });
    } else {
      this.brsService.newActions(payload).subscribe((res) => {
        this.SpinnerService.hide();
        if (res.code) {
          this.notification.showError(res.code);
        } else {
          this.notification.showSuccess(res.message);
          this.onChangeRBF(page);
          this.onChangecbs(page);
        }
      });
      this.action_id_fas_array = [];
      this.action_id_cbs_array = [];
      this.type_array_fas = [];
      this.type_array_cbs = [];
      this.fasaction.get("actions").reset();
      this.cbsaction.get("actions").reset();
    }
  }

  systemreportdownload() {
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }
this.SpinnerService.show()
    this.brsService
      .systemreportdownload(
        this.iDate,
        this.glcode_id,
        this.branch_codeid,
        this.externalvalue,
        this.int_type
      )
      .subscribe(
        (data) => {
          this.SpinnerService.hide()
          this.externalform.get('filereportdown').reset()
          let binaryData = [];
          binaryData.push(data);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download =
            "System match report" +
            this.datepipe.transform(new Date(), "dd/MM/yyyy") +
            ".xlsx";
          link.click();
        },
        (error) => {
          // this.SpinnerService.hide()
        }
      );
  }

  manualreportdownload() {
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }
    this.SpinnerService.show();
    this.brsService
      .manualreportdownload(
        this.fr_date,
        this.to_date,
        this.glcode_id,
        this.branch_codeid,
        this.iDate,
        this.externalvalue,
        this.temp_name,
        this.int_type
      )
      .subscribe(
        (data) => {
          this.SpinnerService.hide();
          this.externalform.get('filereportdown').reset()
          let binaryData = [];
          binaryData.push(data);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download =
            "Manual Match Report" +
            this.datepipe.transform(new Date(), "dd/MM/yyyy") +
            ".xlsx";
          link.click();
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
  }
  autofetchDownload() {
    let body = {
      date: this.iDate,
      gl_no: this.glcode_id,
      branch_code: this.branch_codeid,
      temp_name:this.template_name,
      int_type: this.int_type,
      
    };
    this.SpinnerService.show();
    this.brsService.autofetchDownload(body).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let data = res;
        // console.log("schedule", data["data"][0]?.key);
        if (res.code) {
          this.toster.error(res.code);
         
        }
        if (data["data"][0]?.key == "scheduler triggered") {
          this.toster.success(data["data"][0]?.key);
        
        }
      }
    );
  
  }
  autofetchsum(){
    this.SpinnerService.show()
    this.brsService.auto_fetch_summary(this.iDate,this.glcode_id,this.branch_codeid,this.paginationauto.index,this.int_type).subscribe(res=>{
this.SpinnerService.hide()
this.autofetchsumlist=res['data']
if(res.pagination){
  this.paginationauto=res?.pagination 
}

    })
  }
  deletesummaryid(data){
this.brsService.delete_autofetch(data.id).subscribe(res=>{
  if(res.status){
    this.notification.showSuccess(res.message)
    this.paginationauto.index=1
    this.refresh_sum(3)
    this.refresh_sum(5)
    this.closebuttonautofetch.nativeElement.click()
  }
  else{
    this.notification.showError(res.description)
  }
})
  }
  prevpageapi(){
this.paginationauto.index=this.paginationauto.index-1
this.autofetchsum()
  }
  nextpageapi(){
    this.paginationauto.index=this.paginationauto.index+1
    this.autofetchsum()
  }
  overallreportdownload() {
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }
    this.SpinnerService.show();
    this.brsService
      .overallmatech(
        this.iDate,
        this.glcode_id,
        this.branch_codeid,
        this.externalvalue,
        this.temp_name,
        this.int_type
        // this.fetch_template_name
      )
      .subscribe(
        (data) => {
          this.SpinnerService.hide();
          this.externalform.get('filereportdown').reset()
          let binaryData = [];
          binaryData.push(data);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download =
            "Overall Report" +
            this.datepipe.transform(new Date(), "dd/MM/yyyy") +
            ".xlsx";
          link.click();
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
  }

  handleActionClick(index: number, type: any) {
    console.log("Clicked on action:", type);
    console.log("Index:", index);
    this.edittagvar = index;

    console.log("selectedRowIndices2:", index);

    if (type.id === 1) {
      const selectedIndex = this.selectedRowIndices.indexOf(index);
      if (selectedIndex !== -1) {
      } else {
        this.selectedRowIndices.push(index);
      }
      console.log("selectedRowIndices1:", this.selectedRowIndices);
      console.log(
        "selectedRowIndices:",
        this.selectedRowIndices.includes(index)
      );
    }
  }

  handleActioncbsClick(index: number, type: any) {
    console.log("Clicked on action:", type);
    console.log("Index:", index);
    this.edittagvar = index;
    // Store the index globally

    console.log("selectedRowIndices2:", index);

    if (type.id === 1) {
      const selectedIndex = this.selectedRowIndices2.indexOf(index);
      if (selectedIndex !== -1) {
      } else {
        this.selectedRowIndices2.push(index);
      }
      console.log("selectedRowIndices1:", this.selectedRowIndices2);
      console.log(
        "selectedRowIndices:",
        this.selectedRowIndices2.includes(index)
      );
    }
  }

  formatNumberWithCommas(value: number): string {
    if (isNaN(value)) return null;
    if (value) {
      let numberParts = value?.toString()?.split(".");
      let rupees = numberParts[0];
      let paise = numberParts.length > 1 ? "." + numberParts[1] : "";

      let lastThree = rupees?.substring(rupees.length - 3);
      let otherNumbers = rupees?.substring(0, rupees.length - 3);
      if (otherNumbers != "" && otherNumbers != "-") {
        lastThree = "," + lastThree;
      }
      else if (otherNumbers == "-") {
        lastThree = "-" + lastThree;
      }
      const formattedRupees =
        otherNumbers?.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      return formattedRupees + paise;
    }
  }

  isfasSelect(selectedId, e) {
    console.log("event =>", e);
    let particular_id = selectedId;

    if (e.checked == true) {
      console.log("select particular id", particular_id);
      this.checkedfasItems.push(particular_id);
      console.log("checked ids array", this.checkedfasItems);
    }
    if (e.checked == false) {
      this.checkedfasItems = this.checkedfasItems.filter(
        (item) => item !== particular_id
      );
      console.log("unchecked ids", this.checkedfasItems);
    }
  }

  iscbsSelect(selectedId, e) {
    console.log("event =>", e);
    let particular_id = selectedId;

    if (e.checked == true) {
      console.log("select particular id", particular_id);
      this.checkedcbsItems.push(particular_id);
      console.log("checked ids array", this.checkedcbsItems);
    }
    if (e.checked == false) {
      this.checkedcbsItems = this.checkedcbsItems.filter(
        (item) => item !== particular_id
      );
      console.log("unchecked ids", this.checkedcbsItems);
    }
  }

  getRowColorfas(sum: any, i: number): string {
    this.fas_color_id = sum.fas_color_id;

    const matchRow = this.tabledata.find((fasRow) => {
      const cbsRow = this.cbstabledata.find(
        (cbsRow) => cbsRow.cbs_color_id === fasRow.fas_color_id
      );
      return (
        cbsRow &&
        cbsRow.cbs_color_id === fasRow.fas_color_id &&
        fasRow.fas_color_id === this.fas_color_id
      );
    });

    if (this.fas_color_id === "") {
      return "row-color-11";
    } else if (matchRow) {
      return "row-color-" + matchRow.fas_color_id;
    }
  }

  getRowColorcbs(sum: any, i: number): string {
    this.cbs_color_id = sum.cbs_color_id;

    const matchRow = this.cbstabledata.find((cbsRow) => {
      const fasRow = this.tabledata.find(
        (fasRow) => fasRow.fas_color_id === cbsRow.cbs_color_id
      );
      return (
        fasRow &&
        fasRow.fas_color_id === cbsRow.cbs_color_id &&
        cbsRow.cbs_color_id === this.cbs_color_id
      );
    });

    if (this.cbs_color_id === "") {
      return "row-color-11";

      // } else if (this.hasDuplicatescbs(this.cbs_color_id)) {
      //     return 'row-color-10';
      // return 'row-color-11';

      // } else if (this.hasDuplicatescbs(this.cbs_color_id)) {
      //     return 'row-color-10';
    } else if (matchRow) {
      return "row-color-" + matchRow.cbs_color_id;
    }
  }

  hasDuplicatescbs(cbs_color_id): boolean {
    const duplicates = this.cbstabledata.filter(
      (obj) => obj.cbs_color_id === cbs_color_id
    );
    return duplicates.length > 1;
  }

  hasDuplicatesfas(fas_color_id): boolean {
    const duplicates = this.tabledata.filter(
      (obj) => obj.fas_color_id === fas_color_id
    );
    return duplicates.length > 1;
  }

  refreshActions(event, data, type, key, index) {
    // this.fasOrcbs = type;
    if (data && data.fas_tag_alpha) {
      this.digitValue += data.fas_tag_alpha;
    } else {
      this.digitValue += "";
    }

    if (data && data.cbs_tag_alpha) {
      this.digitValue += data.cbs_tag_alpha;
    } else {
      this.digitValue += "";
    }

    if (event == "") {
      if (data?.[key] !== "") {
        this.clearActions(data, type, 1);
        this.payloadArray = this.payloadArray.filter(
          (item) => item.id !== data?.id
        );
        console.log("payload array", this.payloadArray);
      }
      this.payloadArray = this.payloadArray.filter(
        (item) => item.id !== data?.id
      );
      console.log("payload array", this.payloadArray);
    } else {
      let data1 = {
        id: data?.id,
        value: event?.type_1,
        action_id: event?.id,
        type: type,
        digit: "",
        newdata: false,
      };
      if(event.type_1===3){
        data1.digit = data?.fas_tag_alpha || data?.cbs_tag_alpha
      }

      if (this.payloadArray.length >= 0) {
        let isAlreadyPresent = false;

        for (const [index, i] of this.payloadArray.entries()) {
          if (i?.id === data1?.id && i?.type === data1?.type) {
            if (i?.value === data1?.value) {
              isAlreadyPresent = true;
              break;
            } else if (i?.value !== data1?.value) {
              this.payloadArray.splice(index, 1);
              isAlreadyPresent = true;
              break;
            }
          }
        }
        if (!isAlreadyPresent) {
          if (data?.[key] === "" || event?.type_1 !== data?.[key]) {
            data1["newdata"] = true;
        }
          // if (data?.[key] === "") {
          //   data1["newdata"] = true;
          // }
          this.payloadArray.push(data1);
          this.savepayloads.push(data1);
        }
      } else {
        this.payloadArray.push(data1);
        this.savepayloads.push(data1);
      }

      console.log("payload array", this.payloadArray);

      if (type == 1) {
        this.addiconfas(data);
      } else if (type == 2) {
        this.addiconcbs(data);
      }
      // console.log("payloadArray",this.payloadArray);
    
    }
  }

  clearActions(data, type, page) {
    let id = data.id;

    this.brsService.actionRefresh(id, type).subscribe((res) => {
      this.SpinnerService.show();
      if (res.status) {
        this.notification.showInfo("Action Removed!");
        this.onChangeRBF(page);
        this.onChangecbs(page);
        // this.fasaction.get("actions").reset();
        // this.cbsaction.get("actions").reset();
        this.SpinnerService.hide();
      }
    });
  }
  removechip(obj) {
    const index = this.chipSelectedObj.indexOf(obj);
    if (index >= 0) {
      this.chipSelectedObj.splice(index, 1);
      console.log(this.chipSelectedObj);
      this.chipSelectedId.splice(index, 1);
      console.log(this.chipSelectedId);
      this.DropInput.nativeElement.value = "";
    }
  }
  venSelected(event: MatAutocompleteSelectedEvent): void {
    let select = this.fasheaderlist;
    this.DropInput.nativeElement.value = "";
    console.log("event.option.value", event.option.value);
    this.selectvenByName(event.option.value.id);
    console.log("chipSelectedvenid", this.chipSelectedObj);
    this.fasheaderlist = select;
  }
  selectvenByName(ven) {
    let foundemp1 = this.chipSelectedObj.filter((e) => e.id == ven);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.fasheaderlist.filter((e) => e.id == ven);
    if (foundemp.length) {
      this.chipSelectedObj.push(foundemp[0]);
      this.chipSelectedId.push(foundemp[0].id);
    }
  }
  clickOption() {
    let select = this.fasheaderlist;
    this.fasheaderlist = select;
  }
  removechip1(obj) {
    const index = this.chipSelectedObj1.indexOf(obj);
    if (index >= 0) {
      this.chipSelectedObj1.splice(index, 1);
      console.log(this.chipSelectedObj1);
      this.chipSelectedId1.splice(index, 1);
      console.log(this.chipSelectedId1);
      this.DropInput.nativeElement.value = "";
    }
  }
  venSelected1(event: MatAutocompleteSelectedEvent): void {
    let select = this.cbsheaderlist;
    this.field.nativeElement.value = "";
    console.log("event.option.value", event.option.value);
    this.selectvenByName1(event.option.value.id);
    console.log("chipSelectedvenid", this.chipSelectedObj);
    this.cbsheaderlist = select;
  }
  selectvenByName1(ven) {
    let foundemp1 = this.chipSelectedObj1.filter((e) => e.id == ven);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.cbsheaderlist.filter((e) => e.id == ven);
    if (foundemp.length) {
      this.chipSelectedObj1.push(foundemp[0]);
      this.chipSelectedId1.push(foundemp[0].id);
    }
  }
  clickOption1() {
    let select = this.cbsheaderlist;
    this.cbsheaderlist = select;
  }
  removechip2(obj) {
    const index = this.chipSelectedObj2.indexOf(obj);
    if (index >= 0) {
      this.chipSelectedObj2.splice(index, 1);
      console.log(this.chipSelectedObj1);
      this.chipSelectedId2.splice(index, 1);
      console.log(this.chipSelectedId1);
      this.DropInput.nativeElement.value = "";
    }
  }
  venSelected2(event: MatAutocompleteSelectedEvent): void {
    let select = this.fasmanualheaderlist;
    this.field.nativeElement.value = "";
    console.log("event.option.value", event.option.value);
    this.selectvenByName2(event.option.value.id);
    console.log("chipSelectedvenid", this.chipSelectedObj);
    this.cbsheaderlist = select;
  }
  selectvenByName2(ven) {
    let foundemp1 = this.chipSelectedObj2.filter((e) => e.id == ven);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.fasmanualheaderlist.filter((e) => e.id == ven);
    if (foundemp.length) {
      this.chipSelectedObj2.push(foundemp[0]);
      this.chipSelectedId2.push(foundemp[0].id);
    }
  }
  clickOption2() {
    let select = this.fasmanualheaderlist;
    this.fasmanualheaderlist = select;
  }
  removechip3(obj) {
    const index = this.chipSelectedObj3.indexOf(obj);
    if (index >= 0) {
      this.chipSelectedObj3.splice(index, 1);
      console.log(this.chipSelectedObj1);
      this.chipSelectedId3.splice(index, 1);
      console.log(this.chipSelectedId1);
      this.DropInput.nativeElement.value = "";
    }
  }
  venSelected3(event: MatAutocompleteSelectedEvent): void {
    let select = this.cbsmanualheaderlist;
    this.field.nativeElement.value = "";
    console.log("event.option.value", event.option.value);
    this.selectvenByName3(event.option.value.id);
    console.log("chipSelectedvenid", this.chipSelectedObj);
    this.cbsmanualheaderlist = select;
  }
  selectvenByName3(ven) {
    let foundemp1 = this.chipSelectedObj3.filter((e) => e.id == ven);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.cbsmanualheaderlist.filter((e) => e.id == ven);
    if (foundemp.length) {
      this.chipSelectedObj3.push(foundemp[0]);
      this.chipSelectedId3.push(foundemp[0].id);
    }
  }
  clickOption3() {
    let select = this.cbsmanualheaderlist;
    this.cbsmanualheaderlist = select;
  }
  saveManual(page) {
    let array = [];
    for (let a of this.payloadArray) {
      if (a?.newdata) {
        array.push(a);
      }
    }
    for (let item of this.payloadArray) {
      if (item?.newdata) {
          item.newdata = false; 
      }
  }
  this.savepayloads = [...this.payloadArray];
    let data = {
      data: this.payloadArray,
      value: this.externalvalue,
    };
    console.log(data,'data')
    // this.payloadArray=[]
    // return
    this.brsService.newActionSave(data).subscribe((res) => {
      this.SpinnerService.show();
      if (res.status) {
        this.notification.showSuccess("Saved Successfully!..");
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
        console.log("payloadArray", this.payloadArray);
        this.faspatchyes=false
        this.selectallcondition=false
        this.optionneedtopatch=undefined
        this.cbspatchyes=false
        this.selectallconditioncbs=false
        this.optionneedtopatchcbs=undefined
        this.fasselectall.reset()
        this.cbsselectall.reset()
        this.resetfasselectalloption=[]
        this.resetcbsselectalloption=[]
      } else if (res.code) {
        this.notification.showError(res.code);
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
      } else if (res.description) {
        this.notification.showError(res.description);
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
      }
      this.onChangeRBF(page);
      this.onChangecbs(page);
      this.SpinnerService.hide();
    });
  }
  selectedRecFas(payload) {
    this.new_test_array=payload
    console.log("payloadArray", this.payloadArray);
    console.log("savedArray", this.savepayloads);
    let data = {
      data: payload,
      Date: this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      ),
      branch_code: this.branch_codeid,
      gl_code: this.glcode_id,
      temp_name: this.fetch_template_name,
    };
    this.SpinnerService.show();
    this.brsService.selectedRecFas(data).subscribe((res) => {
      if (res["data"]) {
        this.selectedRecFasList = res["data"];
        this.SpinnerService.hide();
      } else if (res.code) {
        // this.notification.showError(res.code);
        this.selectedRecFasList = [];
        this.SpinnerService.hide();
      }
    });
  }
  selectedRecCbs(payload) {
    let data = {
      data: payload,
      Date: this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      ),
      branch_code: this.branch_codeid,
      gl_code: this.glcode_id,
      temp_name: this.fetch_template_name,
    };
    this.SpinnerService.show();
    this.brsService.selectedRecCbs(data).subscribe((res) => {
      if (res["data"]) {
        this.selectedRecCbsList = res["data"];
        this.SpinnerService.hide();
      } else if (res.code) {
        // this.notification.showError(res.code);
        this.selectedRecCbsList = [];
        this.SpinnerService.hide();
      }
    });
  }
  selectedManual(page) {
    this.new_test_array=[]
    console.log(this.payloadArray,'the.payloadarray')
    const combinedPayload = [...this.payloadArray, ...(this.savepayloads  || [])];
    const uniquePayload = Array.from(
        new Map(combinedPayload.map(item => [item.id, item])).values()
    );

    this.selectedRecFas(uniquePayload);
    this.selectedRecCbs(uniquePayload);
    // this.selectedRecFas();
    // this.selectedRecCbs();
    this.popupopenviewdatamanualSubmit()
    // this.fasselectall.reset()
    // this.cbsselectall.reset()
    // this.resetfasselectalloption=[]
    // this.resetcbsselectalloption=[]
  }
  submitManual(page) {
    // let array = [];
    // for (let a of this.payloadArray) {
    //   // if (a?.newdata) {
    //   //   array.push(a);
    //   // }
    //   console.log("payloadArray", this.payloadArray);
    // }
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }
    const combinedPayloads = [...(this.payloadArray|| []), ...(this.savepayloads  || [])];
    let data = {
      data: this.new_test_array,
      Date: this.iDate,
      branch_code: this.branch_codeid,
      gl_code: this.glcode_id,
      value: this.externalvalue,
      temp_name: this.fetch_template_name,
      int_type:this.int_type
    };
    // let confirm = window.confirm("Are you sure want to Submit the Records?")

    // if(confirm == false){
    //   return false;
    // } else if(confirm == true) {
    this.brsService.newActions(data).subscribe((res) => {
      this.SpinnerService.show();
      if (res.status) {
        this.notification.showSuccess("Submitted Successfully!");
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.active_status();
        this.SpinnerService.hide();
        this.payloadArray = [];
        this.savepayloads = [];
        this.fas_tag_no.reset()
        this.cbs_tag_no.reset()
        this.cbs_tag_no_select.reset()
        this.fas_tag_no_select.reset()
        // this.selectedRecFasList=[]
        // this.selectedRecCbsList=[]
      } else if (res.description) {
        this.notification.showError(res.description);
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
        this.payloadArray = [];
        this.savepayloads = [];
        this.fas_tag_no.reset()
        this.cbs_tag_no.reset()
        this.cbs_tag_no_select.reset()
        this.fas_tag_no_select.reset()
      } else if (res.code) {
        this.notification.showError(res.code);
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
        this.payloadArray = [];
        this.savepayloads = [];
        this.fas_tag_no.reset()
        this.cbs_tag_no.reset()
        this.cbs_tag_no_select.reset()
        this.fas_tag_no_select.reset()
      }
    });
  }
  // }
  active_status() {
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }
    let Date = this.iDate,
      branch_code = this.branch_codeid,
      gl_code = this.glcode_id,
      value = this.externalvalue;
    this.SpinnerService.show();
    this.brsService
      .newActionsCreate(
        Date,
        branch_code,
        gl_code,
        value,
        this.fetch_template_name
      )
      .subscribe((res) => {
        if (res.status) {
          this.notification.showSuccess("Status Updated!");
          // this.onChangeRBF(page)
          // this.onChangecbs(page)
          this.SpinnerService.hide();

          // this.payloadArray=[];
        } else {
          this.notification.showError("Unexpected Error!");
          // this.onChangeRBF(page)
          // this.onChangecbs(page)
          this.SpinnerService.hide();
        }
      });
    this.SpinnerService.hide();
  }

  viewData(page) {
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      let rawDate = this.externalform.get("date").value; // Get the raw date value
      this.iDate = rawDate
        ? this.datepipe.transform(rawDate, "yyyy-MM-dd")
        : ""; // Transform if not undefined, else set to empty string
    }
    let history = 0;
    let date = this.iDate,
      gl_code = this.glcode_id,
      branchcode = this.branch_codeid;
    let value = this.externalvalue;

    this.SpinnerService.show();
    this.brsService
      .viewData(date, gl_code, branchcode, value, history, page,this.int_type)
      .subscribe((res) => {
        this.viewDataLists = res["data"];
        console.log("viewDataLists ====>", this.viewDataLists);
        // // this.viewdata_temp_name = this.viewDataLists.temp_name
        // this.viewdata_temp_names = this.viewDataLists.map(item => item.template_name);
        // console.log("viewdata_temp_names ====>", this.viewdata_temp_names);
        // this.temp_field = {
        //   label: "Template Name",  "method": "get", "url": this.arsURL + "brsserv/wisefin_template" ,params: "", "searchkey": "query", "displaykey": "template_name", wholedata: true,
        //   defaultvalue: this.viewdata_temp_names,
        // };
        if (res.code) {
          this.notification.showInfo(res.description);
          // this.viewDataLists= [];
          this.SpinnerService.hide();
        }
      });
    this.SpinnerService.hide();
  }
  viewDataAndHistory(page) {
    this.viewData(page);
    this.viewhistory(page);
    this.viewdata_current()//package summary
    this.popupopenviewData()
  }
  viewhistory(page) {
    if (this.externalpage == true) {
      this.branch_codeid = this.externalhistory.get("branch_code").value;
      this.glcode_id = this.externalhistory.get("gl_no").value;
      let rawDate = this.externalhistory.get("date").value; // Get the raw date value
      this.iDate = rawDate
        ? this.datepipe.transform(rawDate, "yyyy-MM-dd")
        : ""; // Transform if not undefined, else set to empty string
    }
    let history = 1;
    let date = this.iDate,
      gl_code = this.glcode_id,
      branchcode = this.branch_codeid;
    let value = this.externalvalue;

    this.SpinnerService.show();
    this.brsService
      .viewData(date, gl_code, branchcode, value, history, page,this.int_type)
      .subscribe((res) => {
        this.viewHistoryLists = res["data"];
        console.log("viewHistoryData ====>", this.viewHistoryLists);

        this.pagination = res.pagination ? res.pagination : this.pagination;
        if (res.code) {
          this.notification.showInfo(res.description);
          // this.viewDataLists= [];
          this.SpinnerService.hide();
        }
      });
    this.SpinnerService.hide();
  }

  downloadFile(data) {
    let file = data.file_name;
    let id = data.id;
    let fileName = file;

    let FILE = fileName.split(".")[0];
    this.SpinnerService.show();
    this.brsService.viewData_download(id,this.int_type).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = FILE + ".xlsx";
        link.click();
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
  }
  deleteFile(data) {
    let id = data.id;
    let date = this.iDate;
    let type = data.type;
    let status = data.status;

    let del = confirm("Are you sure, Do you want to change the status?");
    if (del == false) {
      return false;
    }
    this.SpinnerService.show();
    this.brsService.deleteFileData(id, date, type, status).subscribe((res) => {
      if (res.status) {
        this.SpinnerService.hide();
        this.notification.showSuccess("Successfully Changed!");
        // this.viewData(page);
        this.refresh_sum(2)
      } else {
        this.SpinnerService.hide();
        this.notification.showError(res.code);
      }
    });
    this.SpinnerService.hide();
  }

  runprocess() {
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }
    let date = this.iDate;
    let gl_code = this.glcode_id;
    let branchcode = this.branch_codeid;
    let value = this.externalvalue;
    let multi_gl = 0;
    this.SpinnerService.show();
    this.brsService
      .run_process(
        date,
        gl_code,
        branchcode,
        value,
        this.template_name,
        this.multiplecheckbox,
        this.compareglcheckbox,
        this.int_type
      )
      .subscribe((res) => {
        this.SpinnerService.hide();
        if (res.code) {
          this.fasFiles = [];
          this.cbsFiles = [];
          return false;
        }
        this.runprocessfas = res["data"];
        this.runprocesscbs = res["data"];
        // this.fasFiles = this.runprocessfas.filter(item => item.type === '4');
        // this.cbsFiles = this.runprocesscbs.filter(item => item.type === '5');
        this.fasFiles = this.runprocessfas.filter((item) => item.type === "4");

        this.cbsFiles = this.runprocesscbs.filter((item) => item.type === "5");
        this.fasFilesIds = this.extractIds(res.data, "4");
        this.cbsFilesIds = this.extractIds(res.data, "5");
      });
      this.popupopenactionmodal()
  }
  extractIds(data: any[], type: string): string[] {
    return data.filter((item) => item.type === type).map((item) => item.id);
  }
  onTableScroll(event: any) {
    const scrollTop = event.target.scrollTop;
    this.paginationDiv.nativeElement.style.top = `${scrollTop}px`;
  }
  clearSelection(): void {
    // e.stopPropagation();
    this.selectedStatus = "";
  }
  selectStatus(event) {
    this.matchstatus = event?.ars_status;
    console.log("arsStatus", this.matchstatus);
  }
  selectAmount(event) {
    this.amountType = event?.id;
    console.log("arsStatus", this.matchstatus);
    if (event && event.value) {
      this.brsconcile.get('amount')?.enable();
    } else {
      this.brsconcile.get('amount_con')?.reset();
      this.brsconcile.get('amount')?.disable();
      this.brsconcile.get('amount')?.reset();
    }
  }
  selectcondition(event){
    console.log(event,'.....')
    if(event.name){
      this.amountlistcondition=event.id
      console.log(this.amountlistcondition)
    }
    else{
      this.brsconcile.get('amount_type')?.reset();
      this.brsconcile.get('amount')?.disable();
      this.brsconcile.get('amount')?.reset();
    }
  
   
  }

  selectgl(event) {
    this.externalhistory.patchValue({
      status: event,
    });
  }

  selectsummary(event) {
    this.matchsummary = event?.id;
    console.log("arsStatus", this.matchsummary);
  }

  onMainTabChange(event: any): void {
    this.selectedMainTabIndex = event.index;
  }

  onSubTabChange(index: number): void {
    this.selectedSubTabIndex = index;
    console.log("Selected sub tab id:", this.columnList[index].id);
  }

  // getfiltersummary(event: MatTabChangeEvent, page): void {
  //   let selectedTabId: string;

  //   switch (event.tab.textLabel) {
  //     case "System Match":
  //       selectedTabId = "1";
  //       break;
  //     case "Manually Matching":
  //       selectedTabId = "2";
  //       break;
  //     case "Manually Matched":
  //       this.onTabChange(event,page)
  //       break;
  //     // Add cases for other tabs if needed
  //     default:
  //       selectedTabId = ""; // Set default value if necessary
  //   }

  //   console.log("Selected tab ID:", selectedTabId);

  //   // Set this.filterdata_id to the selected tab ID
  //   this.filterdata_id = selectedTabId;

  //   // Call functions based on selected tab
  //   this.onChangeRBF(page);
  //   this.onChangecbs(page);
  // }

  isCheckedClose(data, event, type) {
    let id = data.id;
    let payload = {
      id: id,
      type: type,
    };
    if (event.checked) {
      this.closedArray.push(payload);
      this.closedcheckedItems.push(id);
    }
    if (!event.checked) {
      this.closedArray = this.closedArray.filter((item) => item.id !== id);
      console.log("payArr", this.payArr);
      this.closedcheckedItems = this.closedcheckedItems.filter(
        (item) => item !== id
      );
    }
  }

  isChecked(data, event, type) {
    let id = data.id;
    let dict = {
      id: id,
      type: type,
      action: this.action,
    };
    if (event.checked) {
      this.payArr.push(dict);
      console.log("payArr", this.payArr);
      this.checkedItems.push(id);
    }
    if (!event.checked) {
      this.payArr = this.payArr.filter((item) => item.id !== id);
      console.log("payArr", this.payArr);
      this.checkedItems = this.checkedItems.filter((item) => item !== id);
    }
  }

  closeSubmit(page) {
    let data = {
      data: this.closedArray,
      remark: this.remarksClose.value.remarksClose,
    };
    if (this.closedArray.length == 0) {
      this.notification.showWarning("Select any record to Close!");
      return false;
    }
    if (
      this.remarksClose.value.remarksClose == "" ||
      this.remarksClose.value.remarksClose == undefined ||
      this.remarksClose.value.remarksClose == null
    ) {
      this.notification.showWarning("Enter Remarks!");
      return false;
    }
    this.SpinnerService.show();

    this.brsService.closeData(data).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess("Closed Successfully!");
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.remarksClose.reset();
        this.SpinnerService.hide();
        this.closebuttonclosed.nativeElement.click();
      } else if (res.code) {
        this.notification.showError(res.code);
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
      } else if (res.description) {
        this.notification.showError(res.description);
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
      }
      this.onChangeRBF(page);
      this.onChangecbs(page);
      this.SpinnerService.hide();
    });
  }

  dataSave(page) {
    let data = {
      data: this.payArr,
    };
    this.SpinnerService.show();

    this.brsService.actionSave(data).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess("Saved Successfully!..");
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
        console.log("payloadArray", this.payloadArray);
      } else if (res.code) {
        this.notification.showError(res.code);
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
      } else if (res.description) {
        this.notification.showError(res.description);
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
      }
      this.onChangeRBF(page);
      this.onChangecbs(page);
      this.SpinnerService.hide();
    });
  }
  getRemarks() {
    if (this.payArr.length == 0) {
      this.notification.showWarning("Select any Record to Generate TagNumber!");
      return false;
    } else {
      this.showpopup = true;
    }
  }
  dataSubmit(page) {
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }
    let data = {
      data: this.payArr,
      gl_code: this.glcode_id,
      branch_code: this.branch_codeid,
      Date: this.iDate,
      action: this.action,
      remark: this.remarks.value.remarks,
      value: this.externalvalue,
      temp_name: this.fetch_template_name,
      int_type:this.int_type
    };
    if (this.payArr.length == 0) {
      this.notification.showWarning("Select any Record to Generate TagNumber!");
      return false;
    }
    if (
      this.remarks.value.remarks == "" ||
      this.remarks.value.remarks == null ||
      this.remarks.value.remarks == undefined
    ) {
      this.notification.showWarning("Please Enter the Remarks!");
      return false;
    }
    this.SpinnerService.show();
    this.brsService.newActionSubmit(data).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess("Submitted Successfully!..");
        this.closebuttonremarks.nativeElement.click();
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.showpopup = false;
        this.SpinnerService.hide();
        this.remarks.reset();
        console.log("payArr", this.payArr);
        this.payArr = [];
      } else if (res.code) {
        this.notification.showError(res.code);
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
      } else if (res.description) {
        this.notification.showError(res.description);
        this.onChangeRBF(page);
        this.onChangecbs(page);
        this.SpinnerService.hide();
      }
      this.onChangeRBF(page);
      this.onChangecbs(page);
      this.SpinnerService.hide();
    });
    this.fasmatchedselectform.reset()
    this.cbsmatchedselectform.reset()
  }
  getCombinedata() {
    this.brsService
      .getCombineData(
        this.iDate,
        this.glcode_id,
        this.branch_codeid,
        this.action,
        this.externalvalue,
        this.fetch_template_name,
        this.paginationwisfinjv.index,
        this.int_type,
        this.jwpagelimit_value
      )
      .subscribe((res) => {
        let data = res["data"];
        this.SpinnerService.show();
        if (data) {
          this.combinedData = res["data"];
          this.SpinnerService.hide();
          data.forEach((item, index) => {
            const idExists = this.rows.value.some((val) => val.id === item.id);
            const entryType = item.debit_credit;
            const existingFormGroup = this.rows.controls.find(
              (control) => control.value.id === item.id
            );

            if (!idExists) {
              const ExistRow = this.fb.group({
                entry_type: [item.debit_credit.name],
                category: [item.category],
                sub_category: [item.sub_category],
                bs: [item.bs],
                cc: [item.cc],
                description: [item.description],
                amount: [item.amount],
                tag_no: [item.tag_no],
                id: [item.id],
                narration: [item.narration],
                branch_code: this.branch_codeid,
                gl_no: this.glcode_id,
                date: this.iDate,
              });
            }
          });
          this.SpinnerService.hide();
        }
      });
  }

  getclosedfas(page) {
    this.brsService
      .getClosedRecordfas(
        page,
        this.iDate,
        this.glcode_id,
        this.branch_codeid,
        2
      )
      .subscribe((res) => {
        if (res["data"]) {
          this.closedListfas = res["data"];
          this.SpinnerService.hide();
        } else if (res.code) {
          this.notification.showError(res.code);
          this.closedListfas = [];
          this.SpinnerService.hide();
        }
      });
    this.SpinnerService.hide();
  }
  getclosedcbs(page) {
    this.brsService
      .getClosedRecordcbs(
        page,
        this.iDate,
        this.glcode_id,
        this.branch_codeid,
        1
      )
      .subscribe((res) => {
        if (res["data1"]) {
          this.closedListcbs = res["data1"];
          this.SpinnerService.hide();
        } else if (res.code) {
          this.notification.showError(res.code);
          this.closedListcbs = [];
          this.SpinnerService.hide();
        }
      });
    this.SpinnerService.hide();
  }

  closed(page) {
    this.onChangeRBF(page);
    this.onChangecbs(page);
    // this.getclosedfas(page);
    // this.getclosedcbs(page);
    this.popupopenclosedata()
  }
  resetcombineDataJWpage(){
    this.branch_name_reset=[]
    this.remark.reset();
    this.jwpagelimitform.reset()
    this.jwpagelimit_value=10
    this.paginationwisfinjv.index=1
    this.combineDataJW()
    this.popupopencombineDataJW()
   this.entrytableselectformbs.reset()
   this.entrytableselectformcc.reset()
   this.entrytableselectformdesc.reset()
   this.entrytableselectformentrytype.reset()
   this.entrytabledescform.reset()
   this.entrytable_entry_type_form.reset()
   this.entrytableccform.reset()
   this.entrytablebsform.reset()
   this.bs_selectall_value=''
   this.cc_selectall_value=''
   
  }
  combineDataJW() {
    this.rows.clear()
    // this.combinedData=[]
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }
    this.SpinnerService.show()
    this.brsService
      .getCombineData(
        this.iDate,
        this.glcode_id,
        this.branch_codeid,
        this.action,
        this.externalvalue,
        this.fetch_template_name,
        this.paginationwisfinjv.index,
        this.int_type,
        this.jwpagelimit_value
      )
      .subscribe((res) => {
        this.SpinnerService.hide()
        if(res?.count===0.0||!res?.hasOwnProperty('count')){
          this.debit_amount='0'
        }
        else{
          this.debit_amount=res?.count
        }
        if(res?.glcount===0.0||!res?.hasOwnProperty('glcount')){
          this.credit_amount='0'
        }
        else{
          this.credit_amount=res?.glcount
        }
        if(res?.totalcount===0||!res?.hasOwnProperty('totalcount')){
          this.total_count='0'
        }
        else{
          this.total_count=res?.totalcount
        }
        let data = res["data"];
        if(res.pagination ){
          this.paginationwisfinjv = res.pagination 
        }
        this.SpinnerService.show();
        if (res["data"]) {
          this.combinedData = res["data"];

          const edit_type = data.every((item) => item.edit_type === 2);
          if (edit_type) {
            this.readonlyy = true;
          } else {
            this.readonlyy = false;
          }
          data.forEach((item, index) => {
            const idExists = this.rows.value.some((val) => val.id === item.id);
            const entryType = item.debit_credit;
            this.edit_type = item.edit_type;
            let tag_no = item.tag_no;
            if (
              this.glcode_id == "" ||
              this.glcode_id == null ||
              this.glcode_id == undefined
            ) {
              this.glcode_id = item.gl_no;
            }
            const existingFormGroup = this.rows.controls.find(
              (control) => control.value.id === item.id
            );

            if (!idExists) {
              const ExistRow = this.fb.group({
                entry_type: [item.debit_credit.name],
                category: [item.category],
                sub_category: [item.sub_category],
                bs: [item.bs],
                cc: [item.cc],
                trans_date: [item.transaction_date],
                description: [item.description],
                amount: [item.amount],
                tag_no: [item.tag_no],
                id: [item.id],
                edit_type: [item.edit_type],
                narration: [item.narration],
                branch_code: [item.branch_code],
                gl_no: this.glcode_id,
                date: this.iDate,
                readonly:true
              });
if(item.bs===null&&item.cc===null&&item.description===null){
  ExistRow.addControl('resetfield', new FormControl(true));
}
if(item.debit_credit){
  ExistRow.addControl('resetentrytype', new FormControl(false));
}
              if (tag_no == null || tag_no == "" || tag_no == undefined) {
                this.deleteVisible = true;
              } else {
                this.deleteVisible = false;
              }

              // if(this.edit_type == 0){
              //   this.disableedit = true;
              // } else {
              //   this.disableedit  = false;
              // }
              // if(this.id == null){
              //   this.onlyread = true;
              // }
              // else {
              //   this.onlyread = false;
              // }

              this.filteredStates = ExistRow.get(
                "entry_type"
              ).valueChanges.pipe(
                startWith(""),
                map((state) =>
                  state ? this.filterStates(state) : this.states.slice()
                )
              );

              ExistRow.get("bs")
                .valueChanges.pipe(
                  debounceTime(100),
                  distinctUntilChanged(),
                  tap(() => {
                    this.isLoading = true;
                  }),
                  switchMap((value) =>
                    this.brsService.getbsscroll(this.glcode_id, value, 1).pipe(
                      finalize(() => {
                        this.isLoading = false;
                      })
                    )
                  )
                )
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  this.bsNameData = datas;
                  this.linesChange.emit(this.combineDataForm.value["rows"]);
                });

              ExistRow.get("category")
                .valueChanges.pipe(
                  debounceTime(100),
                  distinctUntilChanged(),
                  tap(() => {
                    this.isLoading = true;
                  }),
                  switchMap((value) =>
                    this.brsService
                      .getCategoryListScroll(this.glcode_id, value, 1)
                      .pipe(
                        finalize(() => {
                          this.isLoading = false;
                        })
                      )
                  )
                )
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  this.categoryList = datas;
                  this.linesChange.emit(this.combineDataForm.value["rows"]);
                });
              ExistRow.get("sub_category")
                .valueChanges.pipe(
                  debounceTime(100),
                  distinctUntilChanged(),
                  tap(() => {
                    this.isLoading = true;
                  }),
                  switchMap((value) =>
                    this.brsService
                      .getsubCategoryListScroll(
                        this.glcode_id,
                        this.catId,
                        value,
                        1
                      )
                      .pipe(
                        finalize(() => {
                          this.isLoading = false;
                        })
                      )
                  )
                )
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  this.subCategoryList = datas;
                  this.linesChange.emit(this.combineDataForm.value["rows"]);
                });

              ExistRow.get("cc")
                .valueChanges.pipe(
                  debounceTime(100),
                  distinctUntilChanged(),
                  tap(() => {
                    this.isLoading = true;
                  }),
                  switchMap((value) =>
                    this.brsService
                      .getccscroll(this.glcode_id, this.bsId, value, 1)
                      .pipe(
                        finalize(() => {
                          this.isLoading = false;
                        })
                      )
                  )
                )
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  this.ccNameData = datas;
                  this.linesChange.emit(this.combineDataForm.value["rows"]);
                });
              this.rows.push(ExistRow);
            }
          });

          console.log("this.rows", this.rows);
          this.SpinnerService.hide();
        } else if (res.code) {
          this.notification.showError(res.code);
          this.SpinnerService.hide();
        }
      });
  }
  _filterOptions(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.entryOptions.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  combineSave() {
    let formValid = true;
    let anyFieldEmpty = false;
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }

    let others = {
      branch_code: this.branch_codeid,
      //  "gl_no": this.glcode_id,
      date: this.iDate,
      edit_type: 1,
      action: this.action,
      remark: this.remark.value.remark,
      value: this.externalpage,
    };

    let formArray = this.combineDataForm.get("rows") as FormArray;

    formArray.controls.forEach((control) => {
      const controlId = control.value.id;
      const idExists = this.CombineArray.some((val) => val.id === controlId);
      const combinedObject = { ...control.value, ...others };
      // const category = control.value.category;
      // const subcategory = control.value.sub_category;
      // const bs = control.value.bs;
      // const cc = control.value.cc;
      // const narration = control.value.narration;
      // const amount = control.value.amount;
      // let date = control.value.trans_date;
      const isAmountDisabled = control.get("amount").disabled;

      const entryType = control.get("entry_type").value;
      const category = control.get("category").value;
      const subcategory = control.get("sub_category").value;
      const bs = control.get("bs").value;
      const cc = control.get("cc").value;
      const narration = control.get("narration").value;
      const amount = control.get("amount").value;
      const date = control.get("trans_date").value;
      const description = control.get("description").value;
      const tag_no = control.get("tag_no").value;

      if (date) {
        const originalDate = new Date(date);
        originalDate.setDate(originalDate.getDate());

        this.convertedDate = this.datepipe.transform(
          originalDate,
          "yyyy-MM-dd"
        );
        console.log("convertedDate", this.convertedDate);
      } else {
        this.convertedDate = "";
      }
      combinedObject.trans_date = this.convertedDate;
      combinedObject.entry_type = entryType;
      combinedObject.category = category;
      combinedObject.sub_category = subcategory;
      combinedObject.bs = bs;
      combinedObject.cc = cc;
      combinedObject.narration = narration;
      combinedObject.amount = amount;
      combinedObject.description = description;
      combinedObject.tag_no = tag_no;

      if (!amount && !isAmountDisabled) {
        anyFieldEmpty = true;
        formValid = false;
      }

      if (category === null) {
        combinedObject.category = "";
      }
      if (subcategory === null) {
        combinedObject.sub_category = "";
      }
      if (bs === null) {
        combinedObject.bs = "";
      }
      if (cc === null) {
        combinedObject.cc = "";
      }
      if (narration === null) {
        combinedObject.narration = "";
      }
      this.CombineArray.push(combinedObject);
    });
    if (this.action == 2 || this.action == 1) {
      if (!formValid) {
        if (anyFieldEmpty) {
          this.notification.showWarning("Please Enter Amount!");
          this.CombineArray = [];
        }
        return;
      }
      if (this.CombineArray.length == 0) {
        this.notification.showInfo("No Record Found!");
        return false;
      }
      let data = {
        data: this.CombineArray,
        value: this.externalvalue,
        branch_code: this.branch_codeid,
        gl_no: this.glcode_id,
        date: this.iDate,
        temp_name: this.fetch_template_name,
        int_type:this.int_type
      };
      this.SpinnerService.show();
      this.brsService.combineSave(data).subscribe((res) => {
        if (res.status) {
          this.notification.showSuccess("Saved Successfully!");
          this.remark.reset();
          this.branch_name_reset=[]
          this.rows.clear();
          this.combineDataJW();
          this.CombineArray = [];
          this.SpinnerService.hide();
        } else if (res.code) {
          this.notification.showError(res.description);
          this.CombineArray = [];
          this.SpinnerService.hide();
        }
      });
      this.CombineArray = [];
    }
  }

  combineSubmit() {
    if (
      this.remark.value.remark == "" ||
      this.remark.value.remark == null ||
      this.remark.value.remark == undefined
    ) {
      this.notification.showError("Enter Remarks!");
      return false;
    }
    // if(this.action===2){
    //   if(this.jw_branch_code===''||this.jw_branch_code===undefined||this.jw_branch_code===null){
    //     this.notification.showError("Select Branch Code");
    //     return
    //   }
    // }
  
    let formValid = true;
    let anyFieldEmpty = false;
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }

    let others = {
      branch_code: this.branch_codeid,
      // "gl_no": this.glcode_id,
      date: this.iDate,
      edit_type: 2,
      action: this.action,
      remark: this.remark.value.remark,
      value: this.externalpage,
    };

    let formArray = this.combineDataForm.get("rows") as FormArray;

    formArray.controls.forEach((control) => {
      let controlId = control.value.id;
      let idExists = this.CombineArraySubmit.some(
        (val) => val.id === controlId
      );
      let combinedObject = { ...control.value, ...others };

      this.category = control.value.category;
      this.subcategory = control.value.sub_category;
      this.bs = control.value.bs;
      this.cc = control.value.cc;
      this.narrationn = control.value.narration;
      //  let date = control.value.trans_date;

      const entryType = control.get("entry_type").value;
      const category = control.get("category").value;
      const subcategory = control.get("sub_category").value;
      const bs = control.get("bs").value;
      const cc = control.get("cc").value;
      const narration = control.get("narration").value;
      const amount = control.get("amount").value;
      const date = control.get("trans_date").value;
      const description = control.get("description").value;
      const tag_no = control.get("tag_no").value;
      const branch_code = control.get("branch_code").value;

      if (date) {
        const originalDate = new Date(date);
        originalDate.setDate(originalDate.getDate());

        this.convertedDate = this.datepipe.transform(
          originalDate,
          "yyyy-MM-dd"
        );
        console.log("convertedDate", this.convertedDate);
      } else {
        this.convertedDate = "";
      }

      combinedObject.trans_date = this.convertedDate;
      combinedObject.entry_type = entryType;
      combinedObject.category = category;
      combinedObject.sub_category = subcategory;
      combinedObject.bs = bs;
      combinedObject.cc = cc;
      combinedObject.narration = narration;
      combinedObject.amount = amount;
      combinedObject.description = description;
      combinedObject.tag_no = tag_no;
      combinedObject.branch_code = branch_code;

     if(this.action===2){
      if (!this.category || !this.subcategory || !this.bs || !this.cc || !control.value.branch_code
        || !control.value.amount
        || !control.value.description
        || !control.value.entry_type
        || !control.value.gl_no
      ) {
        anyFieldEmpty = true;
        formValid = false;
      }
     }
     if(this.action===1){
      if (!control.value.branch_code
        || !control.value.amount
        // || !control.value.description
        || !control.value.entry_type
        || !control.value.gl_no
        // || !control.value.narration
      ) {
        anyFieldEmpty = true;
        formValid = false;
      }
     }

      if (this.category === null) {
        combinedObject.category = "";
      }
      if (this.narrationn == null) {
        combinedObject.narration = "";
      }

      if (this.subcategory === null) {
        combinedObject.sub_category = "";
      }

      if (this.bs === null) {
        combinedObject.bs = "";
      }

      if (this.cc === null) {
        combinedObject.cc = "";
      }

      //  if (!idExists) {
      this.CombineArraySubmit.push(combinedObject);
      //  }
    });
    if (this.action == 2 ||this.action==1 ) {
      if (!formValid) {
        // Show warning only if any field is empty
        if (anyFieldEmpty) {
          this.notification.showWarning("Please fill in all required fields!");
          this.CombineArraySubmit = [];
        }
        return; // Exit the function if the form is not valid
      }
    }
    if (this.CombineArraySubmit.length == 0) {
      this.notification.showInfo("No Record Found!");
      return false;
    }
 

    //  this.SpinnerService.show();
    let data = {
      data: this.CombineArraySubmit,
      value: this.externalvalue,
      branch_code: this.branch_codeid,
      gl_no: this.glcode_id,
      date: this.iDate,
      temp_name: this.fetch_template_name,
      int_type:this.int_type
    };

    this.SpinnerService.show();
    this.brsService.combineSave(data).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess("Submitted Successfully!");
        this.rows.clear();
        this.combineDataJW();
        // this.branch_name_reset=[]
        // this.remark.reset();
        this.SpinnerService.hide();
        this.CombineArray = [];
        this.CombineArraySubmit = [];
        if(this.action==2){
          this.entrytablesummary()
        }
       
       
      
      } else if (res.code) {
        this.notification.showError(res.description);
        this.CombineArraySubmit = [];
        this.SpinnerService.hide();
      }
    });
    
    this.CombineArraySubmit = [];
  }

  isReadOnly(ind): boolean {
    let control = this.rows.at(ind);
    let edit_type = control.get("edit_type").value;

    return edit_type === 0;
  }
  isReadOnly1(ind): boolean {
    let control = this.rows.at(ind);
    let edit_type = control.get("edit_type").value;

    return edit_type === 2;
  }
  addRecord() {
    const newRow = this.fb.group({
      entry_type: ["", Validators.required],
      branch: ["", Validators.required],
      category: ["", Validators.required],
      sub_category: ["", Validators.required],
      bs: ["", Validators.required],
      cc: ["", Validators.required],
      cbsgl: ["", Validators.required],
      description: ["", Validators.required],
      amount: ["", Validators.required],
      tag_no: ["", Validators.required],
      narration: [""],
      id: [null],
      edit_type: [""],
      trans_date: [""],
      delete: [""],
      branch_code: [''],
      gl_no: [''],
      date: [''],
      readonly:false,
      resetfield:true,
      resetentrytype:true,
    });

    // this.disableedit = false;

    this.rows.push(newRow);

    newRow
      .get("category")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.brsService.getCategoryListScroll(this.glcode_id, value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
        this.linesChange.emit(this.combineDataForm.value["rows"]);
      });
    newRow
      .get("sub_category")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.brsService
            .getsubCategoryListScroll(this.glcode_id, this.catId, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subCategoryList = datas;
        this.linesChange.emit(this.combineDataForm.value["rows"]);
      });

    newRow
      .get("cc")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.brsService.getccscroll(this.glcode_id, this.bsId, value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccNameData = datas;
        this.linesChange.emit(this.combineDataForm.value["rows"]);
      });

    newRow
      .get("bs")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.brsService.getbsscroll(this.glcode_id, value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsNameData = datas;
        this.linesChange.emit(this.combineDataForm.value["rows"]);
      });
  }

  selected() {
    let select = this.columnList;
    this.columnList = select;
  }

  deleteRecord(index) {
    let i = index;

    let row = this.rows.at(i);
    let id = row.value.id;

    let confirm = window.confirm("Are you sure want to Delete this Record!");
    if (confirm == true) {
      if (id == null) {
        this.rows.removeAt(i);
      } else {
        this.SpinnerService.show();

        this.brsService.getDeletedata(id).subscribe((res) => {
          if (res.status) {
            this.rows.removeAt(i);
            this.notification.showSuccess("Deleted Successfully!");
            this.rows.clear();
            this.combineDataJW();
            this.SpinnerService.hide();
          } else {
            this.notification.showError(res.code);
            this.SpinnerService.hide();
          }
        });
        this.SpinnerService.hide();
      }
    } else if (confirm == false) {
      return false;
    }
    this.SpinnerService.hide();
  }

  getCategoryList() {
    let gl_code = this.glcode_id;
    this.brsService.getCategoryList(gl_code).subscribe((res) => {
      this.categoryList = res["data"];
      console.log("categoryList", this.categoryList);
    });
  }

  categoryScroll() {
    setTimeout(() => {
      if (
        this.matcatAutocomplete &&
        this.matcatAutocomplete &&
        this.matcatAutocomplete.panel
      ) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextdrop === true) {
                this.brsService
                  .getCategoryListScroll(
                    this.glcode_id,
                    this.categoryInput.nativeElement.value,
                    this.currentpagedrop + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.categoryList.length >= 0) {
                      this.categoryList = this.categoryList.concat(datas);
                      this.has_nextdrop = datapagination.has_next;
                      this.has_previousdrop = datapagination.has_previous;
                      this.currentpagedrop = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  getCategoryId(id) {
    this.catId = id;
    this.getSubCategory(this.catId);
  }
  getSubCategory(id) {
    this.brsService.getSubCategory(this.glcode_id, id, 1).subscribe((res) => {
      let data = res["data"];
      this.subCategoryList = data;
    });
  }
  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.name : undefined;
  }

  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.name : undefined;
  }

  get cattype() {
    return this.combineDataForm.get("category");
  }
  subcategoryScroll() {
    setTimeout(() => {
      if (
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete.panel
      ) {
        fromEvent(this.matsubcatAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matsubcatAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextdrop === true) {
                this.brsService
                  .getsubCategoryListScroll(
                    this.glcode_id,
                    this.catId,
                    this.subcategoryInput.nativeElement.value,
                    this.currentpagedrop + 1
                  )
                  .subscribe((results) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.subCategoryList.length >= 0) {
                      this.subCategoryList = this.subCategoryList.concat(datas);
                      this.has_nextdrop = datapagination.has_next;
                      this.has_previousdrop = datapagination.has_previous;
                      this.currentpagedrop = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  getbs() {
    this.brsService.getbs(this.glcode_id).subscribe((results) => {
      let datas = results["data"];
      this.bsNameData = datas;
      this.catId = datas.id;
    });
  }
  public displaybsFn(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }
  bsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.matbsAutocomplete &&
        this.matbsAutocomplete.panel
      ) {
        fromEvent(this.matbsAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextdrop === true) {
                this.brsService
                  .getbsscroll(
                    this.glcode_id,
                    this.bsInput.nativeElement.value,
                    this.currentpagedrop + 1
                  )
                  .subscribe((results) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.bsNameData.length >= 0) {
                      this.bsNameData = this.bsNameData.concat(datas);
                      this.has_nextdrop = datapagination.has_next;
                      this.has_previousdrop = datapagination.has_previous;
                      this.currentpagedrop = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  bsid(id) {
    this.bsId = id;
    this.getcc(this.bsId);
  }

  getcc(bsId) {
    this.brsService.getcc(this.glcode_id, bsId, 1).subscribe((results) => {
      let datas = results["data"];
      this.ccNameData = datas;
      this.ccId = datas.id;
    });
  }
  public displayccFn(cctype?: cclistss): string | undefined {
    return cctype ? cctype.name : undefined;
  }

  displayentryFn(entryType): string | undefined {
    return entryType ? entryType.name : undefined;
  }
  entype(id) {
    this.entry_typeId = id;
  }
  // filterOptions(value: string) {
  //   this.filteredOptions = this.entry_type.filter(option =>
  //     option.name.toLowerCase().includes(value.toLowerCase())
  //   );
  // }
  openAutocomplete() {
    this.autocomplete.openPanel();
  }
  filterStates(name: string) {
    return this.states.filter(
      (state) => state.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }
  ccScroll() {
    setTimeout(() => {
      if (
        this.matccAutocomplete &&
        this.matccAutocomplete &&
        this.matccAutocomplete.panel
      ) {
        fromEvent(this.matccAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matccAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matccAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matccAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matccAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextdrop === true) {
                this.brsService
                  .getccscroll(
                    this.glcode_id,
                    this.bsId,
                    this.ccInput.nativeElement.value,
                    this.currentpagedrop + 1
                  )
                  .subscribe((results) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.ccNameData.length >= 0) {
                      this.ccNameData = this.ccNameData.concat(datas);
                      this.has_nextdrop = datapagination.has_next;
                      this.has_previousdrop = datapagination.has_previous;
                      this.currentpagedrop = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  getccdata(id) {
    this.ccdataid = id;
  }
  getEntry() {
    this.entry_type = [
      { id: 1, name: "Debit" },
      { id: 2, name: "Credit" },
    ];
  }
  // reportdownloadJW(){
  //   this.brsService
  //   .integrityUnmatchreportdownload(this.iDate)
  //   .subscribe(
  //     (data) => {
  //       // this.SpinnerService.hide()
  //       let binaryData = [];
  //       binaryData.push(data);
  //       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
  //       let link = document.createElement("a");
  //       link.href = downloadUrl;
  //       link.download ="Pass Wisefin JW Report" +
  //         this.datepipe.transform(new Date(), "dd/MM/yyyy") + ".xlsx";
  //       link.click();
  //     },
  //     (error) => {
  //       // this.SpinnerService.hide()
  //     }
  //   );
  // }
  reportdownload(id) {
    if (this.externalpage == true) {
    }

    if (this.iDate == "" || this.iDate == null || this.iDate == undefined) {
      this.notification.showError("Choose a Date");
      this.brsconcile.get('filereportdown').reset()
      return false;
    }

    if (this.glcode_id == null || this.glcode_id == undefined) {
      this.glcode_id = "";
    }

    if (this.branch_codeid == null || this.branch_codeid == undefined) {
      this.branch_codeid = "";
    }
this.SpinnerService.show()
    this.brsService
      .reportdownload(
        this.iDate,
        this.branch_codeid,
        this.glcode_id,
        id,
        this.externalvalue,
        this.int_type
      )
      .subscribe(
        (data) => {
          this.SpinnerService.hide()
          this.brsconcile.get('filereportdown').reset()
          console.log("DAta", data);
          if (data.type == "application/json") {
            this.notification.showInfo("No Data Found!");
            return false;
          } else {
            let binaryData = [];
            binaryData.push(data);
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement("a");
            link.href = downloadUrl;
            let name =
              id == 1
                ? "Pass Wisefin JW Report_"
                : id == 2
                ? "Pass GEFU Report_"
                : "";
            link.download =
              name +
              this.datepipe.transform(new Date(), "dd/MM/yyyy") +
              ".xlsx";
            link.click();
          }
        },
        (error) => {
          // this.SpinnerService.hide()
        }
      );
  }

  externalreportdownload(id) {
    this.branch_codeid = this.externaljwreport.get("branch_code").value;
    this.glcode_id = this.externaljwreport.get("gl_no").value;
    this.iDate = this.datepipe.transform(
      this.externaljwreport.get("date").value,
      "yyyy-MM-dd"
    );

    if (this.iDate == "" || this.iDate == null || this.iDate == undefined) {
      this.notification.showError("Choose a Date");
      return false;
    }

    if (this.glcode_id == null || this.glcode_id == undefined) {
      this.glcode_id = "";
    }

    if (this.branch_codeid == null || this.branch_codeid == undefined) {
      this.branch_codeid = "";
    }

    this.brsService
      .reportdownload(
        this.iDate,
        this.branch_codeid,
        this.glcode_id,
        id,
        this.externalvalue,
        this.int_type
      )
      .subscribe(
        (data) => {
          console.log("DAta", data);
          if (data.type == "application/json") {
            this.notification.showInfo("No Data Found!");
            return false;
          } else {
            let binaryData = [];
            binaryData.push(data);
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement("a");
            link.href = downloadUrl;
            let name =
              id == 1
                ? "Pass Wisefin JW Report_"
                : id == 2
                ? "Pass GEFU Report_"
                : "";
            link.download =
              name +
              this.datepipe.transform(new Date(), "dd/MM/yyyy") +
              ".xlsx";
            link.click();
          }
        },
        (error) => {
          // this.SpinnerService.hide()
        }
      );
  }

  reportdownloadUnmatch() {
    if(this.int_type===''||this.int_type===null||this.int_type===undefined){
      this.notification.showError('Select Integrity Name')
      this.brsconcile.get('filereportdown').reset()
      return
    }
    if (this.iDate == "" || this.iDate == null || this.iDate == undefined) {
      this.notification.showError(" Choose a Date");
      this.brsconcile.get('filereportdown').reset()
      return false;
    }
    let params=''

    let branch_codeid = this.branch_codeid;
    let glcode_id = this.glcode_id;

    console.log("branch_codeid", branch_codeid);
    console.log("glcode_id", glcode_id);
    let iDate = this.iDate;
    iDate ? (params += "?date=" + iDate) : "";
    branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";

    glcode_id ? (params += "&gl_no=" + glcode_id) : "";

    let tag_no = this.brsconcile.get("tagnumber").value;
    tag_no ? (params += "&tag_no=" + tag_no) : "";

    let status = this.matchstatus;
    status ? (params += "&match=" + status) : "";
    let amountTyp = this.amountType;
    amountTyp ? (params += "&amount_type=" + amountTyp) : "";
    let amount = this.brsconcile.value.amount;
    amount ? (params += "&amount=" + amount) : "";
    let amt_count = this.amountlistcondition;
    amt_count ? (params += "&amt_count=" + amt_count) : "";
    let int_type = this.int_type;
    int_type ? (params += "&int_type=" + int_type) : "";
this.SpinnerService.show()
    this.brsService.integrityUnmatchreportdownload(params).subscribe(
      (data) => {
        this.SpinnerService.hide()
        this.brsconcile.get('filereportdown').reset()
        // this.SpinnerService.hide()
        let binaryData = [];
        binaryData.push(data);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        let date = this.iDate;
        date = this.datepipe.transform(new Date(), "dd/MM/yyyy");
        link.download = "ARS Report_" + this.iDate + ".xlsx";
        link.click();
        
      },
      (error) => {
        // this.SpinnerService.hide()
      }
    );
  }

  tempdatas(e) {
    console.log("template_event", e);
    this.externalform.patchValue({
      temp_dd: e,
    });
    this.template_name = e.template_name;
  }
  multipleglclick(id) {
    if (id === 1) {
      this.externalform.get("gl_no").setValue("");
      this.disable_gl = 1;
      this.multiplecheckbox = id;
    }
    if (id === 0) {
      this.disable_gl = 0;
      this.multiplecheckbox = id;
      this.hidecomparecheckbox = 2;
      this.compareglcheckbox = id;
    }
  }
  compareglclick(id) {
    if (id === 1) {
      this.hidecomparecheckbox = id;
      this.compareglcheckbox = id;
    }
    if (id === 0) {
      this.compareglcheckbox = id;
      this.hidecomparecheckbox = id;
    }
  }
  bankradioclick(id) {
    if (id === 1) {
      this.hidebranch = 1;
      this.externalform.get("branch_code").reset();
      this.externalform.get("branch_code").setValue("");
    }
    if (id === 0) {
      this.hidebranch = 0;
    }
  }
  get_FAS_CBS_data(params, value) {
    this.brsService
      .get_fas_cbs_fetch_data(params, value)
      .subscribe((results) => {
        let data = results["data1"];
        this.new_fas_cbs_fetch_values = data[0];
      });
  }
  popupopenviewdatamanualSubmit() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("manualSubmit"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopenclosedata() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("closed"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopencombineDataJW() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("combineDataJW"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopenviewData() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("viewData"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopenactionmodal() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("actionmodal"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  inttypeselect(data){
    console.log('datas',data)
    this.int_type=data.id
    this.int_type_wholedata=data
    if(data !==''){
      this.getRunDates()
    }
    if(data===''){
      this.brsconcile.get('date').reset()
      this.iDate=''
    }
    
    
  }
  selectall(event){
   
console.log(event.checked)
if(event.checked){
  if(this.optionneedtopatch===''||this.optionneedtopatch===null||this.optionneedtopatch===undefined){
    this.notification.showError("choose action")
    event.source.checked = false;
   
    return
  }
  this.selectallcondition=true
for(let x of this.tabledataManual){
  if(x.fas_action){
console.log('Do you wish to overwrite the saved data?')
this.fassavedatavalidation()
  }
}
}else{
  this.selectallcondition=false
  // this.fasselectoptionreset=[]
  this.fasselectoptionresetunsave=[]
  this.resetfasselectalloption=[]
}
  }
  faspageselection(x){
    this.faspagesize=x
    this.selectallcondition=false
    // this.fasselectoptionreset=[]
    this.fasselectoptionresetunsave=[]
    this.onChangeRBF(this.pagination.index);
    
  }
  cbspageselection(x){
    this.cbspagesize=x
    this.selectallconditioncbs=false
    // this.cbsselectoptionreset=[]
    this.cbsselectoptionresetunsave=[]
    this.onChangecbs(this.paginationcbs.index);
  }
  fassavedatavalidation() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("fasvalidation"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  cbssavedatavalidation() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("cbsvalidation"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  openglcountpopup(){
    if(this.int_type===''||this.int_type===null||this.int_type===undefined){
      this.notification.showError('Select Integrity Name')
     
      return
    }
    if (this.iDate == "" || this.iDate == null || this.iDate == undefined) {
      this.notification.showError(" Choose a Date");
    
      return false;
    }
    var myModal = new (bootstrap as any).Modal(document.getElementById("getglcount"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
    this.getglcountlist()
  }
  selectalloption(event){
console.log(event)
if(event===''){
  // this.fasselectoptionreset=[]
  this.fasselectoptionresetunsave=[]
}

this.optionneedtopatch=event

  }
  yesnopatch(value){
    this.selectallcondition=true
if(value){//yes
  this.fasselectoptionreset=[]
this.faspatchyes=value

}
else{
  this.faspatchyes=value
}
  }
  selectallcbs(event){
    if(event.checked){
   
      if(this.optionneedtopatchcbs===''||this.optionneedtopatchcbs===null||this.optionneedtopatchcbs===undefined){
        this.notification.showError("choose action")
        event.source.checked = false;
       
        return
      }
      this.selectallconditioncbs=true
    for(let x of this.cbstabledataManual){
      if(x.cbs_action){
    console.log('Do you wish to overwrite the saved data?')
    this.cbssavedatavalidation()
      }
    }
    }else{
      this.selectallconditioncbs=false
      // this.cbsselectoptionreset=[]
      this.cbsselectoptionresetunsave=[]
      this.resetcbsselectalloption=[]
    }
  }
  cbsselectoption(event){
    console.log(event)
    if(event===''){
      // this.cbsselectoptionreset=[]
      this.cbsselectoptionresetunsave=[]
    }
    
    this.optionneedtopatchcbs=event
  }
  yesnopatchcbs(value){
    this.selectallconditioncbs=true
    if(value){//yes
    this.cbsselectoptionreset=[]
    this.cbspatchyes=value
  
    }
    else{
      this.cbspatchyes=value
    }
  }
  frontpagereport(id){
    // console.log(id,'id')
if(id===1){
  this.reportdownload(id)
}
else if(id===2){
  this.reportdownload(id)
}
else if(id===3){
  this.reportdownload(id)
}
else if(id===4){
  this.reportdownloadUnmatch()
}
  }

actionpagereport(id){
if(id===1){
this.overallreportdownload()
}
else if(id===2){
this.systemreportdownload()
}
else if(id===3){
this.manualreportdownload()
}
  }
  getRunDates()
  {
    this.brsService.rundatesIntegrity(this.int_type).subscribe((results) => {
      // this.SpinnerService.hide();
      // let data = results["data"]
      const datesArray = results.data[0];
      this.unqiueDates = [...new Set(datesArray)];
  })
}
dateClass = (d: Date) => {
  let newDate = this.datepipe.transform(d, "yyyy-MM-dd");
  if (this.unqiueDates.includes(newDate)) {
    console.log("DATES", newDate)
    return "highlighted-date";
  }
  return "";
};
summarypageselection(x){
  if(this.int_type===''||this.int_type===null||this.int_type===undefined){
    this.notification.showError('Select Integrity Name')
    this.summarytableform.reset()
    return
  }
  let date = this.brsconcile.get("date").value;
  if (date == "" || date == null || date == undefined) {
    this.notification.showError("Select a date");
    this.summarytableform.reset()
    return false;
  }
  this.summarypagesize=x
  this.getsummary(1);
}
wisefinfileupload(e) {
  const file = e.target.files[0];
  if (file) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx') {
      console.error('Invalid file type. Please upload an XLSX file.');
      this.notification.showError("Unsupported file type");
      return;
    }
    
    this.uploadedfasFileName = file;
    this.fas_file_name = file.name;
    this.fileform.get('file_fas_upload').reset();
  }
}
cbsfileupload(e){
  console.log(e)
      const files= e.target.files[0];
      if (files ) {
        const fileExtension = files.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'xlsx') {
          console.error('Invalid file type. Please upload an XLSX file.');
          this.notification.showError("Unsupported file type");
          return;
        }
        this.uploadedcbsFileName =files; 
        this.cbs_file_name=files.name
        this.fileform.get('file_cbs_upload').reset()
      }
     
    }
deleteFilefas() {

  this.fileform.get('file_fas_upload').reset()
  this.fas_file_name=''
  this.uploadedfasFileName=undefined
}
deletecbsFile(){

  this.fileform.get('file_cbs_upload').reset()
  this.cbs_file_name=''
  this.uploadedcbsFileName=undefined
}
clicktoupload(){
    
  console.log(this.uploadedfasFileName,this.uploadedcbsFileName)
  if(this.firstempname===''||this.firstempname===null||this.firstempname===undefined){
    this.notification.showError('Choose Template')
    return
  }
  if(this.uploadedfasFileName===undefined||this.uploadedcbsFileName===undefined){
    this.notification.showError('Upload both files')
    return
  }
  let date = this.brsconcile.get("date").value;
  let payload={
    "temp_name":this.firstempname,"date":this.iDate,"auto":0,'int_type':this.int_type
  }
  this.SpinnerService.show()
this.brsService.ars_fileattachment(this.uploadedfasFileName,this.uploadedcbsFileName,payload,).subscribe(results => {
  this.SpinnerService.hide()
console.log(results,'results')
let value=results
if(value.status){
  this.notification.showSuccess(value.message)
  this.fas_file_name=''
  this.cbs_file_name=''
  this.uploadedfasFileName=undefined
  this.uploadedcbsFileName=undefined
}
else{
  this.notification.showError(value.description)
}
 
})

}
tempdatasss(event){
  console.log(event)
  this.firstempname=event.template_name
}
viewsummary(){
  if(this.int_type===''||this.int_type===null||this.int_type===undefined){
    this.notification.showError('Select Integrity Name')
   
    return
  }
  if (this.iDate == "" || this.iDate == null || this.iDate == undefined) {
    this.notification.showError(" Choose a Date");
  
    return false;
  }
  var myModal = new (bootstrap as any).Modal(document.getElementById("viewsummaryfile"), {
    backdrop: "static",
    keyboard: false,
  });
  myModal.show();
 this.apifunction()



this.resetallautofetch()
}
template_summary_table=[ { columnname: "Job Code", key: "job_code" }, { columnname: "FAS File ", key: "fas_gen_filename" },
  { columnname: "CBS File", key: "cbs_gen_filename" },
  { columnname: "Date", key: "date" },
 
  { columnname: "Tempalte Name", key: "template_name" },
  {
    columnname: "Status",
    key:"status",
    function:true, validate: true, validatefunction: this.uploadsummarystatus.bind(this),
  },
  {
    columnname: "Run process",
    key:"right",
    function: true,
    validate: true, validatefunction: this.icon.bind(this),
    clickfunction: this.sechedulefun.bind(this),
  },        
  {
    columnname: "Delete",
    icon: "delete",
    style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
    button: true,
    key: "delete",
    function: true,
    clickfunction: this.deleteDatauploadsummary.bind(this),
  },
  ]
  template_summary_tablehistory=[ { columnname: "Job code", key: "job_code" },{ columnname: "Template name ", type: "object",objkey:"template_name",key:'template_name' },
    { columnname: "Date", key: "date" },
   
    {
      columnname: "Status",
      key:"status",
      function:true, validate: true, validatefunction: this.uploadsummarystatus.bind(this),
    },
    {
      columnname: "Download",
      icon: "arrow_downward",
      style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
      button: true,
      key: "get",
      function: true,
      clickfunction: this.dowloadData.bind(this),
    },
    {
      columnname: "Delete",
      icon: "delete",
      style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
      button: true,
      key: "delete",
      function: true,
      clickfunction: this.deleteData.bind(this),
    }
    ]
    entry_table_summary_data=[ { columnname: "Job code", key: "JW_code" },{ columnname: "File name ",key:'file_name' },
      {
        columnname: "Entry Table Status",
        key:"integrity_status",
        function:true, validate: true, validatefunction: this.entrytablesummary_integrity_status.bind(this),
      },
      {
        columnname: "Status",
        key:"status",
        function:true, validate: true, validatefunction: this.entrytablesummarystatus.bind(this),
      },
      {
        columnname: "Download",
        icon: "download",
        style: {cursor: "pointer" },
        button: true,
        key: "delete",
        function: true,
        clickfunction: this.downloadmonojw.bind(this),
      },
      {
        columnname: "Delete",
        icon: "delete",
        style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
        button: true,
        key: "delete",
        function: true,
        clickfunction: this.deletemonojw.bind(this),
      }
      ]
  sechedulefun(data){
console.log(data)
let [day, month, year] = data.date.split('-');
let raw ={
  "temp_name":data.template_name,
  "date":year+'-'+month+'-'+day,
  "job_code":data.job_code,
  'int_type':this.int_type
}
this.SpinnerService.show()
this.brsService.ars_schedule(raw).subscribe(results => {
  this.SpinnerService.hide()
  if(results.code){
    this.notification.showInfo(results.code)
  }
  // let res={
  //   data:[
  //     {"key": "scheduler triggered"}
  //     ]
  // }
  if(results['data']){
this.notification.showSuccess(results['data'][0].key)
this.historyapifunction()
  }
  

})
  }
  icon(){
    let config ={
      "value":"Run Process",
      class:'btn btn-outline-success border_radius',
      function:true
    }
    return config
  }
  deleteData(data){
    
    this.SpinnerService.show()
    this.brsService.ars_schedule_delete(data.id).subscribe(results => {
      this.SpinnerService.hide()
      if(results.status){
        this.notification.showSuccess(results.message)
        this.apifunction()
        this.historyapifunction()
      }
      
    
    })
  }
  deleteDatauploadsummary(data){
    
    this.SpinnerService.show()
    this.brsService.ars_schedule_delete_uploadsum(data.id).subscribe(results => {
      this.SpinnerService.hide()
      if(results.status){
        this.notification.showSuccess(results.message)
        this.apifunction()
      }
      
    
    })
  }
  apifunction(){
    this.template_search_summary_apis = {
      method: "get",
      url: this.ip + "brsserv/multiple_uploads",
      params:"&int_type="+this.int_type+"&date="+this.iDate
    };
  }
  historyapifunction(){
    if(this.iDate){
      this.template_search_summary_api_history = {
        method: "get",
        url: this.ip + "brsserv/run_multiple_gl_scheduler",
        params:"&date="+this.iDate+"&int_type="+this.int_type
      };
    }
    else{
      this.template_search_summary_api_history = {
        method: "get",
        url: this.ip + "brsserv/run_multiple_gl_scheduler",
      
      };
    }

   
  }
  uploadsummarystatus(data){
    let config: any = {
      value: '',
    };
if(data.status===1){
config={
  value:'Active'
}
}
else if(data.status===2){
  config={
    value:'Started'
  }
}
else if(data.status===3){
  config={
    value:'Processing'
  }
}
else if(data.status===4){
  config={
    value:'Success'
  }
  
}
else if(data.status===10){
  config={
    value:'Failed'
  }
  
}
return config
  }
  viewdata_current_type(data){
    console.log(data,'datadatadatadata')
    let config: any = {
      value: '',
    };
if(data.type==='4'){
config={
  value:'FAS'
}
}
else if(data.type==='5'){
  config={
    value:'CBS'
  }
}
else if(data.type==='6'){
  config={
    value:'ARS'
  }
}

return config 
}

  entrytablesummarystatus(data){
    let config: any = {
      value: '',
    };
if(data.status===1){
config={
  value:'Active'
}
}
else if(data.status===2){
  config={
    value:'Started'
  }
}
else if(data.status===3 ){
  config={
    value:'Processing'
  }
}
else if(data.status===4 ){
  config={
    value:'Success'
  }
  
}
else if(data.status===10 ){
  config={
    value:'Failed'
  }  
}
return config
  }
  entrytablesummary_integrity_status(data){
    let config: any = {
      value: '',
    };
    if(data.integrity_status===1){
      config={
        value:'Active'
      }
      }
      else if(data.integrity_status===2){
        config={
          value:'Started'
        }
      }
      else if(data.integrity_status===3){
        config={
          value:'Processing'
        }
      }
      else if(data.integrity_status===4){
        config={
          value:'Success'
        }
        
      }
      else if(data.integrity_status===10){
        config={
          value:'Failed'
        }
        
      }
      return config
  }
  entrytablesummary(){
    this.entry_table_summary_get = {
      method: "get",
      url: this.ip + "brsserv/jw_entry_ars",
      params:"&int_type="+this.int_type
    };
  }
  dowloadData(data){
    
    this.SpinnerService.show()
    this.brsService.ars_schedule_download(data.id).subscribe(results => {
      this.SpinnerService.hide()
      // let binaryData = [];
      // binaryData.push(data);
      // let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      // let link = document.createElement("a");
      // link.href = downloadUrl;
      // link.download =
      //   data?.job_code +'_'
      //   +
      //   this.datepipe.transform(new Date(), "dd/MM/yyyy") +
      //   ".xlsx";
      // link.click();

      let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        let date = this.iDate;
        date = this.datepipe.transform(new Date(), "dd/MM/yyyy");
        link.download = "ARS Report_" + this.iDate + ".xlsx";
        link.click();
      
    
    })
  }
  fasmatchedselectall(event,type){
    console.log(event)
    if(event.checked){
      for(let x of this.tabledata){
        console.log(x)
        this.isChecked(x,event,type)
      }
    }else{
      for(let x of this.tabledata){
        console.log(x)
        this.isChecked(x,event,type)
      }
    }

  }
  cbsmatchedselectall(event,type){
    if(event.checked){
      for(let x of this.cbstabledata){
        console.log(x)
        this.isChecked(x,event,type)
      }
    }else{
      for(let x of this.cbstabledata){
        console.log(x)
        this.isChecked(x,event,type)
      }
    }
  }
  branch_datas_select(event){
    console.log('clicked')
    console.log(event.code)
    this.jw_branch_code=event.code
  }
  refresh_sum(type){
if(type===1){
  this.historyapifunction()
}else if(type===2){
  this.viewdata_current()
}else if(type===3){
  this.autofetchsummary_withgl()
}else if(type===4){
  this.entrytablesummary()
}else if(type===5){
  this.autofetchsummary_wogl()
}
  }
  downloadautofetch(id){
    console.log(id,'idddd')
    this.SpinnerService.show()
    this.brsService.ars_autofetch_download(id.id).subscribe(res=>{
this.SpinnerService.hide()
let binaryData = [];
        binaryData.push(res);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        let date = this.iDate;
        date = this.datepipe.transform(new Date(), "dd/MM/yyyy");
        link.download = "ARS Auto Fetch" + this.iDate + ".xlsx";
        link.click();
    }
    )
  }
  deletemonojw(data){
    this.SpinnerService.show()
this.brsService.delete_mono_jw(data.id).subscribe(res=>{
  this.SpinnerService.hide()
  if(res.status){
    this.notification.showSuccess(res.message)
    this.entrytablesummary()
  }
  else{
    this.notification.showError(res.description)
  }
})

  }
  downloadmonojw(data){
    this.SpinnerService.show()
    this.brsService.mono_jw_download(data.id).subscribe(res=>{
this.SpinnerService.hide()
let binaryData = [];
        binaryData.push(res);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        let date = this.iDate;
        date = this.datepipe.transform(new Date(), "dd/MM/yyyy");
        link.download = "Mono JW" + this.iDate + ".xlsx";
        link.click();
    }
    )
  }
  submitmonojw(){
    if (
      this.remark.value.remark == "" ||
      this.remark.value.remark == null ||
      this.remark.value.remark == undefined
    ) {
      this.notification.showError("Enter Remarks!");
      return false;
    }
    if(this.action===2){
      if(this.jw_branch_code===''||this.jw_branch_code===undefined||this.jw_branch_code===null){
        this.notification.showError("Select Branch Code");
        return
      }
    }
      let payload={
        jw_remarks: this.remark.value.remark,
        // jw_branch: this.branch_codeid,
        gl_no: this.glcode_id,
        date: this.iDate,
        jw_entry_type: this.fetch_template_name,
        int_type:this.int_type,
        jw_branch:this.jw_branch_code

      }
      this.SpinnerService.show()
      this.brsService.passjw_success(payload).subscribe((res) => {
        this.SpinnerService.hide()
        if(res.status){
          this.notification.showSuccess(res.message)
          // this.entrytablesummary()
        }
      })
      this.branch_name_reset=[]
      this.remark.reset();

  }
  getsubcatgl(data,i){
    console.log(data,'data',i,'index')
    this.brsService.getsubcatagorygl(data.id).subscribe(res=>{
      this.subcatgl_id=res['data'][0].id
      const formArray = this.rows;
      const formGroup = formArray.at(i) as FormGroup;
      formGroup.get('gl_no').patchValue( this.subcatgl_id)

    })
  }
  get_temp_daata(event){
    console.log(event)
    this.firstempname_autof=event.template_name
  }
  autofetchsumwithout_gl(){
    this.SpinnerService.show()
    this.brsService.auto_fetch_summary_withoutgl(this.iDate,this.paginationauto.index,this.int_type).subscribe(res=>{
this.SpinnerService.hide()
this.autofetchsumlist_gl_branch=res['data']
if(res.pagination){
  this.paginationauto=res?.pagination 
}

    })
  }
  resetallautofetch(){
    this.resetFormpopup = [];
    this.reset_template_name=[]
    this.glcode_id_autofetch=''
    this.branch_codeid_autofetch=''
    this.firstempname_autof=''
  }
  getglcodeid_autofetch(item) {
    console.log("item", item);

    let page = 1;
    if (item !== undefined && item !== "" && item !== null) {
      this.glcode_id_autofetch = item.gl_code;
      this.searchvar1["url"] = this.branchUrl;
      let params = "";
      params += this.iDate ? "&date=" + this.iDate : "";
      params += this.int_type ? "&int_type=" + this.int_type : "";
      this.searchvar1["params"] = params;

      this.searchvar1 = Object.assign({}, this.searchvar1);
    }
    console.log("glcode_id", this.glcode_id_autofetch);
  }
  selectBranch_autofetch(e) {
    let page = 1;
    this.branch_codeid_autofetch = e.branch;
    console.log("brachcode", this.branch_codeid_autofetch);
  }
  autofetchDownload_viewsummary() {
    if(this.firstempname_autof===''||this.firstempname_autof===null||this.firstempname_autof===undefined){
this.notification.showError("Choose Template")
return
    }
    if(this.glcode_id_autofetch===''||this.glcode_id_autofetch===null||this.glcode_id_autofetch===undefined){
      this.glcode_id_autofetch=''
    }
    if(this.branch_codeid_autofetch===''||this.branch_codeid_autofetch===null||this.branch_codeid_autofetch===undefined){
      this.branch_codeid_autofetch=''
    }
    let body = {
      date: this.iDate,
      gl_no: this.glcode_id_autofetch,
      branch_code: this.branch_codeid_autofetch,
      temp_name:this.firstempname_autof,
      int_type: this.int_type,
    };
    this.SpinnerService.show();
    this.brsService.autofetchDownload(body).subscribe(
      (res) => {
        this.SpinnerService.hide();
        let data = res;
        if (res.code) {
          this.toster.error(res.code);
         
        }
        if (data["data"][0]?.key == "scheduler triggered") {
          this.toster.success(data["data"][0]?.key);
        this.refresh_sum(5)
        }
      }
    );
  
  }
  autofetch_summary_wogl=[
    // { columnname: "Template Name", key: "temp_name" }, 
    { columnname: "Date", key: "date" },{ columnname: "GL NO ",key:'kd_accountno' },
    // { columnname: "Branch", key: "kd_branchcode" },
   
    {
      columnname: "Status",
      key:"status",
      function:true, validate: true, validatefunction: this.uploadsummarystatus.bind(this),
    },
    { columnname: "File name", key: "file_name" },
    {
      columnname: "Download",
      icon: "arrow_downward",
      style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
      button: true,
      key: "get",
      function: true,
      clickfunction: this.downloadautofetch.bind(this),
    },
    {
      columnname: "Delete",
      icon: "delete",
      style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
      button: true,
      key: "delete",
      function: true,
      clickfunction: this.deletesummaryid.bind(this),
    }
    ]
    autofetch_summary_withgl=[
      { columnname: "Date", key: "date" },{ columnname: "GL NO ",key:'kd_accountno' },
      { columnname: "Branch", key: "kd_branchcode" },
     
      {
        columnname: "Status",
        key:"status",
        function:true, validate: true, validatefunction: this.uploadsummarystatus.bind(this),
      },
      { columnname: "File name", key: "file_name" },
      {
        columnname: "Download",
        icon: "arrow_downward",
        style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
        button: true,
        key: "get",
        function: true,
        clickfunction: this.downloadautofetch.bind(this),
      },
      {
        columnname: "Delete",
        icon: "delete",
        style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
        button: true,
        key: "delete",
        function: true,
        clickfunction: this.deletesummaryid.bind(this),
      }
      ]
      view_data_current_sum=[
        { columnname: "Date", key: "date" },{ columnname: "File Name",key:'file_name' },
        {
          columnname: "Type",
          key:"type",
          function:true, validate: true, validatefunction: this.viewdata_current_type.bind(this),
        },
       
        {
          columnname: "Status",
          key:"status",
          function:true, validate: true, validatefunction: this.uploadsummarystatus.bind(this),
        },
        {
          columnname: "Download",
          icon: "arrow_downward",
          style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
          button: true,
          key: "get",
          function: true,
          clickfunction: this.downloadFile.bind(this),
        },
        {
          columnname: "Delete",
          icon: "delete",
          style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
          button: true,
          key: "delete",
          function: true,
          clickfunction: this.deleteFile.bind(this),
        }
        ]
  autofetchsummary_wogl(){
    this.autofetch_summary_wgl = {
      method: "get",
      url: this.ip + "brsserv/auto_fetch",
      params:"&date="+this.iDate+"&int_type="+this.int_type
    };
  }
  autofetchsummary_withgl(){
    this.autofetch_summary_with_gl = {
      method: "get",
      url: this.ip + "brsserv/auto_fetch",
      params:"&date="+this.iDate+"&int_type="+this.int_type+"&gl_no=" + this.glcode_id + "&branch=" + this.branch_codeid 
    };
  }
  viewdata_current(){
    this.view_data_current = {
      method: "get",
      url: this.ip + "brsserv/ars_process_status?gl_code=",
      params:"&date="+this.iDate+"&int_type="+this.int_type+"&gl_code=" + this.glcode_id + "&branch_code=" + this.branch_codeid+ "&value=" + this.externalvalue + "&history=" + 0
    };
  }
  summarytableselectall(event){
    if(event.checked===true){
      for(let x of this.summarydatalist){
       if(x.ars_status==='Pending'){
        if(this.selectallarray.includes(x.id)){

        }else{
          this.selectallarray.push(x.id)
          x.checked=true
        }
       }
      }
    }
    else{
      for(let x of this.summarydatalist){
        if(x.ars_status==='Pending'){
          x.checked=false
        }
       
      }
      this.selectallarray = []
    }
    if(this.selectallarray.length===0 && event.checked===true){
      this.notification.showError("'Pending' Status only able to select")
      this.summarytabselectall.reset()
    }
    console.log(this.selectallarray,'this.selectallarray')
  }
  summarytableselect(event,data){
    if(event.checked===true){
      this.selectallarray.push(data.id)
      data.checked=true
    }
    else{
      if(this.selectallarray.includes(data.id)){
        this.selectallarray.splice(this.selectallarray.indexOf(data.id),1)
      }
      data.checked=false
    }
   
    console.log(this.selectallarray,'this.selectallarray')
  }
  summarytablesubmit(){
    let validation=this.sumamrytableremarks.value
    if(validation===null||validation===''||validation===undefined){
this.notification.showError("Enter Remarks")
return
    }
    if(this.selectallarray.length===0){
      this.notification.showError("Atleast one row should be selected")
return
    }
    let payload={
      "remarks":validation,
      'id':this.selectallarray
    }
    console.log(payload,'payload')
    this.brsService.summarytable_remark_submit(payload).subscribe((res=>{
      if(res.status){
        this.notification.showSuccess(res.message)
        this.sumamrytableremarks.reset()
        this.getsummary(1)
       
        this.selectallarray=[]
      }else{
        this.notification.showError(res.description)
      }
    }))
  }
  gl_count_list_header=[ { columnname: "Account Number", key: "kd_accountno" },
    { columnname: "Branch Code", key: "kd_branchcode" },

    ]
  getglcountlist(){

      this.sumarytable_get_gl_count = {
        method: "get",
        url: this.ip + "brsserv/ars_gl_counts",
        params:"&date="+this.iDate+"&int_type="+this.int_type
      };
      this.brsService.get_gl_count(this.iDate,this.int_type).subscribe((res=>{
        if(res.glcount===0 ||!res?.hasOwnProperty('glcount')){
          this.GL_count='0'
        }
        else{
          this.GL_count=res?.glcount
        }
      }))

  }
  download_gl_count(){
    let payload={
      "date":this.iDate,
      "int_type":this.int_type
  }
    this.brsService.get_glcount_download(payload).subscribe((res=>{
      let binaryData = [];
      binaryData.push(res);
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Gl Count" + ".xlsx";
      link.click();
    }))
  }
  getsummarypagelimit(event){
    console.log(event)
    if(event.data==='.'||event.data==='e'){
      this.notification.showInfo('This field only accepts integers. Decimal points are not allowed')
      this.summarytableform.reset()
      this.summarytableform.setValue(this.summarypagesize)
      return
    }

    if(this.int_type===''||this.int_type===null||this.int_type===undefined){
      this.notification.showError('Select Integrity Name')
      this.summarytableform.reset()
      return
    }
    let date = this.brsconcile.get("date").value;
    if (date == "" || date == null || date == undefined) {
      this.notification.showError("Select a date");
      this.summarytableform.reset()
      return false;
    }
    this.summarypagesize=this.summarytableform.value

    setTimeout(() => {
      this.getsummary(1);
    }, 1000);
  }
  faspageselectioninputfield(event){
    if(event.data==='.'||event.data==='e'){
      this.notification.showInfo('This field only accepts integers. Decimal points are not allowed')
      this.faspageform.reset()
      this.faspageform.setValue(this.faspagesize)
      return
    }
    this.faspagesize=this.faspageform.value
    this.selectallcondition=false
    // this.fasselectoptionreset=[]
    this.fasselectoptionresetunsave=[]
    setTimeout(() => {
      this.onChangeRBF(this.pagination.index);
    }, 1000);
   
  }
  cbspageselectioninputfield(event){
    if(event.data==='.'||event.data==='e'){
      this.notification.showInfo('This field only accepts integers. Decimal points are not allowed')
      this.cbspageform.reset()
      this.cbspageform.setValue(this.cbspagesize)
      return
    }
    this.cbspagesize=this.cbspageform.value
    this.selectallconditioncbs=false
    // this.cbsselectoptionreset=[]
    this.cbsselectoptionresetunsave=[]
    setTimeout(() => {
      this.onChangecbs(this.paginationcbs.index);
    }, 1000);
  }
  passentrysummarytable(){
    if(this.int_type===''||this.int_type===null||this.int_type===undefined){
      this.notification.showError('Select Integrity Name')
      return
    }
    let date = this.brsconcile.get("date").value;
    if (date == "" || date == null || date == undefined) {
      this.notification.showError("Select a date");
      return false;
    }
    if(this.selectallarray.length===0){
      this.notification.showError("Atleast one row should be selected")
return
    }
    let payload={
     'id':this.selectallarray,
      'date':this.iDate,
      'int_type':this.int_type
    }
    console.log(payload,'payload')
    this.brsService.summarytable_pass_entry(payload).subscribe((res=>{
      if(res.status){
        this.notification.showSuccess(res.message)
        this.sumamrytableremarks.reset()
        this.getsummary(1)
       
        this.selectallarray=[]
      }else{
        this.notification.showError(res.description)
      }
    }))
  }
  jwpagelimit(event){
    if(event.data==='.'||event.data==='e'){
      this.notification.showInfo('This field only accepts integers. Decimal points are not allowed')
      this.jwpagelimitform.reset()
      this.jwpagelimitform.setValue(this.jwpagelimit_value)
      return
    }
    this.jwpagelimit_value=this.jwpagelimitform.value
    setTimeout(() => {
      this.paginationwisfinjv.index=1
      this.combineDataJW()
    }, 1000);
  }
  bsidselectall(data) {
    this.getcc(data.id);
    this.bs_selectall_value=data
  }
  getccdataselectall(data) {
    this.cc_selectall_value=data
  }
  entrytableselectallbs(event) {
    let formArray = this.combineDataForm.get("rows") as FormArray;
    if (event.checked === true) {
      if (this.bs_selectall_value === '' || this.bs_selectall_value === null || this.bs_selectall_value === undefined) {
        this.notification.showError("Select BS Value")
        this.entrytableselectformbs.reset()
        return
      }
      formArray.controls.forEach((control) => {
        if (control.get("bs").value === '' || control.get("bs").value === null || control.get("bs").value === undefined) {
          control.get("bs").setValue(this.bs_selectall_value)
        }
      })
    } else {
      formArray.controls.forEach((control) => {
        if (control.value.resetfield) {
          control.get("bs").reset()
        }
      })
    }
  }
  entrytableselectallcc(event) {
    let formArray = this.combineDataForm.get("rows") as FormArray;
    if (event.checked === true) {
      if (this.cc_selectall_value === '' || this.cc_selectall_value === null || this.cc_selectall_value === undefined) {
        this.notification.showError("Select CC Value")
        this.entrytableselectformcc.reset()
        return
      }
      formArray.controls.forEach((control) => {
        if (control.get("cc").value === '' || control.get("cc").value === null || control.get("cc").value === undefined) {
          control.get("cc").setValue(this.cc_selectall_value)
        }
      })
    } else {
      formArray.controls.forEach((control) => {
        if (control.value.resetfield) {
          control.get("cc").reset()
        }
      })
    }
  }
  entrytableselectalldescription(event) {
    let formArray = this.combineDataForm.get("rows") as FormArray;
    if (event.checked === true) {
      if (this.entrytabledescform.value === '' || this.entrytabledescform.value === null || this.entrytabledescform.value === undefined) {
        this.notification.showError("Enter a Description")
        this.entrytableselectformdesc.reset()
        return
      }
      formArray.controls.forEach((control) => {
        if (control.get("description").value === '' || control.get("description").value === null || control.get("description").value === undefined) {
          control.get("description").patchValue(this.entrytabledescform.value)
        }
      })
    } else {
      formArray.controls.forEach((control) => {
        if (control.value.resetfield) {
          control.get("description").reset()
        }
      })
    }
  }
  entrytableselectallentrytype(event){
    let formArray = this.combineDataForm.get("rows") as FormArray;
    if (event.checked === true) {
      if (this.entrytable_entry_type_form.value === '' || this.entrytable_entry_type_form.value === null || this.entrytable_entry_type_form.value === undefined) {
        this.notification.showError("Choose Entry Type")
        this.entrytableselectformentrytype.reset()
        return
      }
      formArray.controls.forEach((control) => {
        if (control.get("entry_type").value === '' || control.get("entry_type").value === null || control.get("entry_type").value === undefined) {
          control.get("entry_type").patchValue(this.entrytable_entry_type_form.value)
        }
      })
    } else {
      formArray.controls.forEach((control) => {
        if (control.value.resetentrytype) {
          control.get("entry_type").reset()
        }
      })
    }
  }
  summarydeatilstab(event){
let name = event.tab.textLabel;
console.log(event)
if(name==='Upload Summary'){
  this.apifunction()
}else if(name==='Run Summary'){
  this.historyapifunction()
}
else if(name==='Auto fetch summary'){
  this.refresh_sum(5)
  this.temp_field = {
    label: "Template Name",
    method: "get",
    url: this.arsURL + "brsserv/wisefin_template",
    params: "",
    searchkey: "query",
    displaykey: "template_name",
    wholedata: true,
    required:true
  };
}
  }
  entrytabletabchange(event){
    let name = event.tab.textLabel;
    console.log(name)
    if(name==='Entry Table'){
      this.combineDataJW()
    }
    else if(name==='Mono JW'){
      this.refresh_sum(4)
    }
  }
  fas_tag_selectall_fun(event){
 
    if(event.checked){
      if(this.fas_tag_no.value===''||this.fas_tag_no.value===null||this.fas_tag_no.value===undefined){
        this.notification.showError('Enter Tag Number')
        this.fas_tag_no_select.reset()
        return
      }
      this.tabledataManual.forEach((item, index) => {
        item.fas_tag_alpha=this.fas_tag_no.value
        
        
      })
      this.payloadArray.forEach((item, index) => {
       if(item.value===3&&item.type===1){
        if (!this.payloadArray[index]) {
          this.payloadArray[index] = {}; 
        }
        this.payloadArray[index]["digit"] = this.fas_tag_no.value;
        this.payloadArray[index]["newdata"] = true;
       }
      })
    }else{
      this.fas_tag_no.reset()
      this.tabledataManual.forEach((item, index) => {
        item.fas_tag_alpha=''
        
      })
      this.payloadArray.forEach((item, index) => {
      if(item.value===3&&item.type===1){
        if (!this.payloadArray[index]) {
          this.payloadArray[index] = {}; 
        }
        this.payloadArray[index]["digit"] = '';
        this.payloadArray[index]["newdata"] = false;
      }
      })
    }
    console.log(this.payloadArray,'payloadArray')
    console.log(this.tabledataManual,'tabledataManual2')
  }
  fasinput(event){
    const inputValue = (event.target as HTMLInputElement).value;
    const regex = /^[a-zA-Z]$/;
    if (inputValue.length >= 1 || !regex.test(event.key)) {
      this.notification.showInfo("Only one letter allowed!");
      event.preventDefault();
      return;
  }
}
cbsinput(event){
  const inputValue = (event.target as HTMLInputElement).value;
  const regex = /^[a-zA-Z]$/;
  if (inputValue.length >= 1 || !regex.test(event.key)) {
    this.notification.showInfo("Only one letter allowed!");
    event.preventDefault();
    return;
}
}
cbs_tag_selectall_fun(event){
  if(event.checked){
    if(this.cbs_tag_no.value===''||this.cbs_tag_no.value===null||this.cbs_tag_no.value===undefined){
      this.notification.showError('Enter Tag Number')
      this.cbs_tag_no_select.reset()
      return
    }
    this.cbstabledataManual.forEach((item, index) => {
      item.cbs_tag_alpha=this.cbs_tag_no.value
      
    })
    this.payloadArray.forEach((item, index) => {
     if(item.value===3&&item.type===2){
      if (!this.payloadArray[index]) {
        this.payloadArray[index] = {}; 
      }
      this.payloadArray[index]["digit"] = this.cbs_tag_no.value;
      this.payloadArray[index]["newdata"] = true;
     }
    })
  }else{
    this.cbs_tag_no.reset()
    this.cbstabledataManual.forEach((item, index) => {
      item.cbs_tag_alpha=''
      
    })
    this.payloadArray.forEach((item, index) => {
    if(item.value===3&&item.type===2){
      if (!this.payloadArray[index]) {
        this.payloadArray[index] = {}; 
      }
      this.payloadArray[index]["digit"] = '';
      this.payloadArray[index]["newdata"] = false;
    }
    })
  }
  console.log(this.payloadArray,'cbspayloadArray')
  console.log(this.cbstabledataManual,'cbstabledataManual')
}
}
