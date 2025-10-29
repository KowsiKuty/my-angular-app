import { DatePipe, Location } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { BrsApiServiceService } from "src/app/brs/brs-api-service.service";
import { NotificationService } from "src/app/service/notification.service";
import { SharedService } from "src/app/service/shared.service";
import { TaService } from "src/app/ta/ta.service";
import { environment } from "src/environments/environment";
import { ReconServicesService } from "../recon-services.service";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";

import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  findIndex,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import {
  fromEvent,
  interval,
  Observable,
  Observer,
  Subscription,
  timer,
} from "rxjs";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { SelectionModel } from "@angular/cdk/collections";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AutoknockoffData } from "src/app/brs/models/autoknockoff-data";
import { BstatementData } from "src/app/brs/models/bstatement-data";
import { LedgerData } from "src/app/brs/models/ledger-data";
import { InterintegrityApiServiceService } from "src/app/interintegrity/interintegrity-api-service.service";
import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";
export class State {
  constructor(public id: any, public name: any) {}
}
export interface catlistss {
  id: any;
  name: string;
  code: any;
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
export interface subcatlistss {
  id: any;
  name: string;
  code: string;
}
interface Item {
  name: string;
  id: string;
  value: string;
}

interface popupEntry {
  digit: string;
  fas_type: number;
  fas_id: number[];
  cbs_type: number;
  cbs_id: number[];
}
@Component({
  selector: "app-reconexternal",
  templateUrl: "./reconexternal.component.html",
  styleUrls: ["./reconexternal.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ReconexternalComponent implements OnInit {
  paginationdb = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  paginationapi = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  paginationdbrun = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  tablevalue: any;
  current_table_page: number = 1;
  hastable_next: boolean;
  schemavalue: any;
  hasschema_next: boolean;
  hasschema_previous: boolean;
  current_schema_page: number = 1;
  schemaarray: any[] = [];
  tablearray: any[] = [];
  conarray: any[] = [];
  wherearray: any[] = [];
  selectedColumns: string[] = [];
  dbpassword: any;
  dbusername: any;
  dbport: any;
  dbipaddress: any;
  dbqueryform: FormGroup;
  dblink_id: any;
  dbrunintegrityarray: any[] = [];
  viewtabchange: any;
  apicall_id: any;
  @ViewChild(MatAutocompleteTrigger)
  autocompletetableTrigger: MatAutocompleteTrigger;
  @ViewChild("schemaref") schemaref: MatAutocomplete;
  @ViewChild("tableref") tableref: MatAutocomplete;
  @ViewChild("temp") temp: MatAutocomplete;
  @ViewChild("schema_input") schema_input: any;
  @ViewChild("table_input") table_input: any;
  @ViewChild("templateinput") templateinput: any;
  @ViewChild("closeapicalledit") closeapicalledit: ElementRef;
  @ViewChild("closebuttonclosedapi") closebuttonclosedapi: ElementRef;
  @ViewChild("closedblinkedit") closedblinkedit: ElementRef;
  @ViewChild("closebuttonclosedqueery") closebuttonclosedqueery: ElementRef;
  methodarray = ["POST", "GET", "DELETE"];
  apicallcreationform: FormGroup;
  dblinkcreationform: FormGroup;
  dblinkupdateform: FormGroup;
  activeTabIndex1: 0;
  dbsummararray: any[] = [];
  dblinksearch: FormGroup;
  apicallupdateform: FormGroup;
  dbtype: any;
  apisummararray: any[] = [];
  apicallsearch: FormGroup;
  fas_uploadxl: boolean = false;
  fas_apicall: boolean = false;
  fas_dblink: boolean = false;
  cbs_uploadxl: boolean = false;
  cbs_apicall: boolean = false;
  cbs_dblink: boolean = false;
  mainform: FormGroup;
  editform: FormGroup;
  restformfile1: any[];
  restformfile2: any[];
  resettemplate: any[];
  inputdataarray: any[] = [];
  file1input: any = { label: "File1 Input Data" };
  file2input: any = { label: "File2 Input Data" };
  fileuploadsearch: FormGroup;
  uploadsearch: any;
  uploadsearchhistory: any;
  uploadsearchfasys: any;
  uploadsearchcbsys: any;
  uploadsearchfaman: any;
  uploadsearchcbman: any;
  isExpandedscardrecon: boolean = false;
  isExpandedscardrecon1: boolean = false;
  isExpandedscardrecon2: boolean = false;
  isExpandedscardrecon3: boolean = false;
  searchvar2: any = "String";
  searchvarhistory: any = "String";
  searchvarfasys: any = "String";
  searchvarcbsys: any = "String";
  searchvarfaman: any = "String";
  searchvarcbman: any = "String";
  SummaryApinterintegrityObjNew: any;
  interurl = environment.apiURL;
  status_array: any = [
    { value: "Active", id: 1 },
    { value: "Inactive", id: 0 },
  ];
  mainpage: boolean = true;
  routetonext: boolean = false;
  mainscreen: boolean = true;
  faspageform = new FormControl();
  matchunmatchform = new FormControl();
  fas_consolidate_form = new FormControl();
  cbs_consolidate_form = new FormControl();
  file_id: any;
  file1_type: any;
  file2_type: any;
  bankcheckbox: number;
  allcheckbox: any;
  downloadreport: any;
  reportuploadid: any;
  viewdataresult: any;
  recon_status: any;
  status: any;
  recon_fields: any;
  recon_id: any;
  uploadshow1: any;
  formbuilder: any;
  particular_recon_id: any;
  newarrwisefinkeys: {};
  newarrcbskeys: {};
  Optionfield: any = {
    label: "Options",
    fronentdata: true,
    data: [],
    displaykey: "wisefinKeysname",
    Outputkey: "wisefinKeysname",
    // valuekey: "value",
  };
  Optionfield1: any = {
    label: "Options",
    fronentdata: true,
    data: [],
    displaykey: "cbsKeysname",
    Outputkey: "cbsKeysname",
    required: true,
    // valuekey: "value",
  };

  eachwisefinkeys: any[] = [];
  eachcbskeys: any[] = [];
  eachvalue: string;
  eachvalues: string;
  payloadd: { dict_val: any[] };
  payloads: { dict_val: any[] };
  showcustomizereport: any;
  reportcreation: FormGroup;
  get_report_summary: any;
  get_consolidate_summary_api: any;
  fas_consolidate_id: number = 0;
  cbs_consolidate_id: number = 0;
  edit_recon_datas: any;
  report_type: any;
  autokdate1: string;
  recon_name: any;
  filedatas: void;
  match_type: any;
  template_name_api:any;
  report_templateform: FormGroup;
  consolidation_form: FormGroup;
  wisefine_array: any=[]
  cbs_array: any=[]
  showToggle1: boolean=true
  showToggle2: boolean=false
  showToggle3:boolean=false
  recon_tab: boolean=true
  dcs_tab: boolean=false
  dcs_recon : number=0
  fas_header_name: any='File 1'
  cbs_header_name: any='File 2'
  selected_array: any=[]
  consolidate_array: any[]=[]
  consolidatiol_file_array: any[]=[]
  recon_process: boolean=false;
  dcs_recon_form: boolean=true;
  back() {
    this.radiobuttonform.reset();
    // this.allcheckbox = 0;
    // this.multiplecheckbox = 0;
    // this.hidecomparecheckbox = 0;
    // this.isWholeBank = false;
    // this.isSingleBranch = false;
    // this.uploadshow = true;
    // this.disable_gl = 0;
  }
  reconurl = environment.apiURL;
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

  arsStatus: any = {
    searchkey: "",
    params: "",
    displaykey: "value",
    label: "ARS Status",
    Outputkey: "match",
    fronentdata: true,
    data: this.statusList,
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
  combineDataForm: FormGroup;
  externalform: FormGroup;
  externalhistory: FormGroup;
  externaljwreport: FormGroup;
  remarks: FormGroup;
  remarksClose: FormGroup;
  remark: FormGroup;
  resetForm: any;
  resetFormdata: any;
  resetFormstatus: any;
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
  uploadshow: boolean = false;
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
  // Optionfield: any;

  @ViewChild("closebutton") closebtn: ElementRef;
  @ViewChild("closebuttonremarks") closebuttonremarks: ElementRef;
  @ViewChild("closebuttonclosed") closebuttonclosed: ElementRef;
  @ViewChild("closebuttonclosed1") closebuttonclosed1: ElementRef;
  @ViewChild("tabGroup") tabGroup: MatTabGroup;
  @ViewChild("paginationDiv") paginationDiv: ElementRef;
  @ViewChild("inputField") inputField: ElementRef;
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
  activeTabIndex = 0;
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
  isWholeBank: boolean = false;
  isSingleBranch: boolean = false;
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
  @ViewChild("closeaddpopup") closeaddpopup;
  @ViewChild("closeviewpopup") closeviewpopup;
  @ViewChild("closerunpopup") closerunpopup;

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
  file1set:any=null
  file1array:any[]=[]
  file2set:any=null
  file2array:any[]=[]
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

  mainpages: boolean = true;
  summarypage: boolean;
  externalpage: boolean = false;
  summarydatalist: any;
  action_id_fas_array: any[] = [];
  action_id_cbs_array: any[] = [];
  type_array_fas: any[] = [];
  type_array_cbs: any[] = [];

  fasarray: any[] = [];
  cbsarray: any[] = [];

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
  dd_validation_template: number = 1;
  element: any;
  editDatas: any;
  add: any;
  selectAll: boolean = false;
  // bsNameData: any = [];
  // subCategoryList: any = [];
  SummaryApiviewhistoryDObjNew: any;
  fassytammatchsearchlist: any[] = [];
  cbssytammatchsearchlist: any[] = [];
  Optionsysfassearch: any[] = [];
  Optionmanfassearch: any[] = [];
  Optionsyscbssearch: any[] = [];
  Optionmancbssearch: any[] = [];
  searchsysfasvar: any;
  searchmanfasvar: any;
  searchsyscbsvar: any;
  searchmancbsvar: any;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private brsService: BrsApiServiceService,
    private reconService: ReconServicesService,
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
    private elementRef: ElementRef,
    public interService: InterintegrityApiServiceService
  ) {
    this.dateAdapter.setLocale("en-GB");

    this.temp_field = {
      label: "Template Name",
      method: "get",
      url: this.reconurl + "reconserv/wisefin_template",
      params: "&recon_ars=" + this.dd_validation_template,
      searchkey: "name",
      displaykey: "template_name",
      wholedata: true,
    };
    this.uploadsearchhistory = [
      {
        type: "date",
        dateformat: "dd-MMM-yyyy",
        label: "Select Date",
        formvalue: "date",
      },
      { type: "input", label: "GLNO", formvalue: "gl_no" },
      { type: "input", label: "Branch Code", formvalue: "branch_code" },
    ];

    // this.url = this.url.concat("")

    // this.fasOrcbs = "";
    // this.filteredOptions = this.entry_type.slice(); // Initialize filteredOptions with all options
    this.SummaryApinterintegrityObjNew = {
      method: "get",
      url: this.reconurl + "reconserv/multi_integrity_uploads",
      params:'&dcs_recon='+this.dcs_recon ,
    };
    this.uploadsearch = [
      { type: "input", label: "Recon Name", formvalue: "name" },
      { type: "dropdown", inputobj: this.statusfield, formvalue: "status" },
    ];
    this.file1input = {
      label: "File1 Input Data",
      method: "get",
      url: this.interurl + "integrityserv/upload_type",
      params: "",
      // searchkey: "name",
      displaykey: "file1_type",
      wholedata: true,
      required: true,
    };
    this.file2input = {
      label: "File2 Input Data",
      method: "get",
      url: this.interurl + "integrityserv/upload_type",
      params: "",
      // searchkey: "name",
      displaykey: "file1_type",
      wholedata: true,
      required: true,
      // disabled: true,
    };
    this.template_name_api = {
      label: "Template",
      method: "get",
      url: this.arsURL + "brsserv/wisefin_template",
      params:'&recon_ars=0',
      searchkey: "name",
      displaykey: "template_name",
      wholedata: true,
      formcontrolname: 'temp_name'
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
  filearray = [
    { name: "None", id: 0 },
    { name: "Value", id: 1 },
  ];
  filecrdebitarray = [
    { name: "None", id: 0 },
    { name: "Debit", id: 1 },
    { name: "Credit", id: 2 },
    { name: "D-C", id: 3 },
  ];

  @ViewChild(MatSort) sort: MatSort;

  public dataArray: any;
  public dataArrayb: any;
  public dataArrays: any;
  id: any;
  ngOnInit(): void {
    this.dbqueryform = this.fb.group({
      schema: [""],
      table_name: [""],
      where: [""],
      select: ["select *"],
      conditions: this.fb.array([]),
    });
    this.dblinkupdateform = this.fb.group({
      ip_address: [""],
      port: [""],
      db_name: [""],
      user: [""],
      password: [""],
    });
    this.dblinkcreationform = this.fb.group({
      ip_address: [""],
      port: [""],
      db_name: [""],
      user: [""],
      password: [""],
    });
    this.apicallcreationform = this.fb.group({
      api_url: "",
      payloads: "",
      api_name: "",
      params: "",
      methods: "",
      description: "",
    });
    this.apicallupdateform = this.fb.group({
      api_url: "",
      payloads: "",
      api_name: "",
      params: "",
      methods: "",
      description: "",
    });
    this.apicallsearch = this.fb.group({
      api_name: [""],
      methods: [""],
      status: [""],
    });
    this.dblinksearch = this.fb.group({
      db_name: [""],
      username: [""],
    });
    this.mainform = this.fb.group({
      template_name: [""],
      file1_type: [""],
      file2_type: [""],
      periodicity: [""],
    });
    this.editform = this.fb.group({
      template_name: [""],
      file1_type: [""],
      file2_type: [""],
      periodicity: [""],
    });
    this.fileuploadsearch = this.fb.group({
      intigrity: [""],
      status: [""],
    });
    this.interService.inputdata().subscribe((results) => {
      this.inputdataarray = results["data"];
    });
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

    this.taservice.getemployeesdetails().subscribe((results) => {
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

    this.reconService.gettemplates(1).subscribe((result) => {
      this.templates = result["data"];
    });

    this.brsService.getaccountdata(1).subscribe((result) => {
      this.accounts = result["data"];
    });
    this.reconService.getNtemplates(1).subscribe((result) => {
      this.ntemplates = result["data"];
    });

    this.reconService.getActionData1().subscribe((result) => {
      setTimeout(() => {
        this.columnList = result["data"];
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
    });
    this.combineDataForm = this.fb.group({
      rows: this.fb.array([]),
    });
    this.externalform = this.fb.group({
      branch_code: "",
      date: "",
      gl_no: "",
      temp_dd: "",
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
      wisefinuploadfile: "",
    });
    this.bankstmtupload = this.fb.group({
      template_id: "",
      account_id: "",
      filedatas: "",
      cbsuploadfile: "",
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
      start_amount: "",
      Commonfield: "",
      branchcontrol: "",
      tag_number: "",
      entry_gid: "",
      entry_crno: "",
      entry_module: "",
      remark: "",
      dropdownoption: "",
      value: "",
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
      dropdownoption: "",
      value: "",
    });
    this.report_templateform = this.fb.group({
      temp_name: [''],
      fas_column: [''],
      // cbs_column: ['']
    });
    this.consolidation_form = this.fb.group({
      temp_name: [''],
      grp_by: [''],
      consil_filearray: this.fb.array([])
    });
    this.selectedVal = "inter";

    this.getbranch();
    this.radiobuttonform = this.fb.group({
      radioOption: new FormControl(""),
      radioOptioncbs: new FormControl(""),
      runAccount: [null, [Validators.required]],
    });
    this.external(1);

    this.reportcreation = this.fb.group({
      fas_col: [""],
      cbs_col: [""],
      fas_cr_dr: [""],
      cbs_cr_dr: [""],
      report_remark: [""],
    });
    if(this.recon_tab){
this.dcs_recon =0
  this.uploadsearch[0].label='Recon Name'
    }else{
      this.dcs_recon =1 
        this.uploadsearch[0].label='DCS Name'
    }
  }
    
  get consil_filearray() {
    return this.consolidation_form.controls["consil_filearray"] as FormArray;
  }
  proceedmainscreen() {
    let value = this.mainform.value;
    if (
      value.template_name === "" ||
      value.template_name === null ||
      value.template_name === undefined
    ) {
      this.notification.showError("Choose Recon Name");
      return;
    }
    if (
      value.file1_type === "" ||
      value.file1_type === null ||
      value.file1_type === undefined
    ) {
      this.notification.showError("Choose Input 1");
      return;
    }
    if (
      value.file2_type === "" ||
      value.file2_type === null ||
      value.file2_type === undefined
    ) {
      this.notification.showError("Choose Input 2");
      return;
    }
    value.periodicity = parseInt(value.periodicity);
    // this.showsummary = value
    this.mainform.value.cbs_file_type = this.cbs_consolidate_id;
    this.mainform.value.fas_file_type = this.fas_consolidate_id;
    this.mainform.value.recon_flag  = this.dcs_recon ;
    this.SpinnerService.show();
    this.reconService.svae_inegrity(this.mainform.value).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.status) {
        this.notification.showSuccess(res.message);
        // this.fileupload_search()
        this.SummaryApinterintegrityObjNew = {
          method: "get",
          url: this.reconurl + "reconserv/multi_integrity_uploads",
          params:'&dcs_recon='+this.dcs_recon ,
        };
        this.fas_consolidate_form.reset();
        this.cbs_consolidate_form.reset();
        this.cbs_consolidate_id = 0;
        this.fas_consolidate_id = 0;
      } else {
        this.notification.showError(res.description);
      }
    });
    // this.allformreset()
    this.restformfile1 = [];
    this.restformfile2 = [];
    this.mainform.reset();
  }
  get rows(): FormArray {
    return this.combineDataForm.get("rows") as FormArray;
  }

  getdataLedger() {
    this.reconService
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
      this.reconService
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
      this.reconService
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
    this.reconService
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
      this.reconService
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
    this.reconService.confirmingknockoff(data).subscribe((results) => {
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

    this.reconService.manualKnockoff(datas).subscribe((results) => {
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
    const fileExtension = this.uploadfile.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      console.error("Invalid file type. Please upload an XLSX file.");
      this.notification.showError("Unsupported file type");
      this.bankstmtupload.get("cbsuploadfile").reset();
      return;
    }
    this.bankstmtupload.get("filedatas").setValue(this.uploadfile);
  }

  uploadchooses(evt) {
    this.uploadfile = evt.target.files[0];
    const fileExtension = this.uploadfile.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      console.error("Invalid file type. Please upload an XLSX file.");
      this.notification.showError("Unsupported file type");
      this.wisefinUpload.get("wisefinuploadfile").reset();
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
      this.toster.error("Choose File 2 to upload");
      return;
    }

    if (!this.uploadfile) {
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
        recon_type: this.recon_id,
      };
      console.log(this.int_dict);
    }
    this.int_dict["type"] = 5;
    this.int_dict["multi_gl"] = this.multiplecheckbox;
    this.int_dict["comp_gl"] = this.compareglcheckbox;
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
    {
      this.reconService
        .bankstatementUplaodSchedule(
          this.int_gl,
          this.int_dict,
          this.bankstmtupload.get("filedatas").value
          // this.recon_id
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
              this.bankstmtupload.get("cbsuploadfile").reset();
              this.bankstmtupload.get("filedatas").reset();
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
  // //     this.onChangeRBF("",page);
  // //        this.onChangecbs("",page);
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
  //     this.onChangeRBF("",page);
  //        this.onChangecbs("",page);
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
      this.toster.error("Choose File 1 to upload");
      return;
    } else if (!this.uploadfile) {
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
        recon_type: this.recon_id,
        // multi_gl: this.multiplecheckbox,
      };
      console.log(this.int_dict);
    }

    this.int_dict["type"] = 4;
    this.int_dict["multi_gl"] = this.multiplecheckbox;
    this.int_dict["comp_gl"] = this.compareglcheckbox;
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
      this.reconService
        .glUploadSchedule(
          this.int_dict,
          this.int_gl,
          this.wisefinUpload.get("filedata").value
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
              this.wisefinUpload.get("wisefinuploadfile").reset();
              this.wisefinUpload.get("filedata").reset();
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
    this.reconService
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
    this.reconService
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
    this.reconService.AutoknockoffDownload(id).subscribe((results) => {
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
    this.reconService.purgeLedgerServ(dataPl).subscribe((results) => {
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
    this.reconService.purgeStmtServ(dataSt).subscribe((results) => {
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
    this.reconService.fetchgldata(datal).subscribe((results) => {
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

      this.reconService
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
    this.reconService
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
    this.branch_codeid = this.externalform.get("branch_code").value;
    let branch_code =
      this.selectedOption == "particular" ? this.branch_codeid : "";

    let param = {
      date: this.iDate,
      gl_no: '',
      branch_code: '',
      id1: this.file1set,
      id2: this.file2set,
      value: this.externalvalue,
      multi_gl: this.multiplecheckbox,
      comp_gl: this.compareglcheckbox,
      temp_name: this.template_name,
      account:0,
      recon_type: this.recon_id,
    };
    if(this.dcs_recon===0){
      param.account=this.allcheckbox
      param.gl_no=this.glcode_id
      param.branch_code=this.branch_codeid
    }
    // this.recon_id
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
      this.toster.error("Please Upload the Data!");
      this.closebuttonrun.nativeElement.click();
    } else if (!this.cbsFiles && !this.fasFiles) {
      this.notification.showError(
        "Please Select Branch as a Whole or Single!"
      );
      this.closebuttonrun.nativeElement.click();
    } 
    else if(this.file1set===null){
      this.toster.error("Select file 1 to run");
    }
    else if(this.file2set===null){
      this.toster.error("Select file 2 to run");
    }
    else {
      this.SpinnerService.show();
      this.reconService.run_progress(param).subscribe((results) => {
        this.SpinnerService.hide();
        let data = results;
        if (results.code) {
          this.toster.error(results.code);
          this.selectedOption = "";
          this.closebuttonrun.nativeElement.click();
          this.file1array=[]
          this.file1set=null
           this.file2array=[]
          this.file2set=null
        }
        if (data["data"][0]?.key == "scheduler triggered") {
          this.toster.success(data["data"][0]?.key);
          this.selectedOption = "";
          this.closebuttonrun.nativeElement.click();
          this.onChangeRBF("", page);
          this.onChangecbs("", page);
          this.file1array=[]
          this.file1set=null
           this.file2array=[]
          this.file2set=null
        }
       
      });
    }
  }
  params: any;
  onChangeRBF(data, pagenum) {
    //  this.params = data
    if (this.action == 2 || this.action == 4) {
      this.actionChange = true;
    } else {
      this.actionChange = false;
    }
    this.fasOrcbs = 1;
    console.log("page", pagenum);

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
    this.Amountt1 = this.fassearch.get("start_amount").value;
    console.log("data", this.Amountt1);
    this.tag = this.fassearch.get("Commonfield").value;
    this.AmtComparison = this.fassearch.get("AmtComparisons").value;

    this.params = "?page=" + pagenum;
    if (this.externalpage == true) {
      let branch_codeid = this.externalform.get("branch_code").value;
      branch_codeid ? (this.params += "&branch_code=" + branch_codeid) : "";

      let glcode_id = this.externalform.get("gl_no").value;
      glcode_id ? (this.params += "&gl_code=" + glcode_id) : "";

      let run_date = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
      run_date ? (this.params += "&run_date=" + run_date) : "";
    } else {
      let branch_codeid = this.branch_codeid;
      branch_codeid ? (this.params += "&branch_code=" + branch_codeid) : "";

      let glcode_id = this.glcode_id;
      glcode_id ? (this.params += "&gl_code=" + glcode_id) : "";

      // let iDate = this.fasfromdate_date;
      // iDate ? (params += "&process_date=" + iDate) : "";

      let run_date = this.iDate;
      run_date ? (this.params += "&run_date=" + run_date) : "";
    }
    let filterdata_id = this.filterdata_id;
    filterdata_id ? (this.params += "&type=" + filterdata_id) : "";

    // let fasbranch_code = this.branch;
    // fasbranch_code ? (params += "&branch_code=" + fasbranch_code) : "";

    let tag = this.tag;
    tag ? (this.params += "&tagno=" + tag) : "";

    let action = this.action;
    action ? (this.params += "&action=" + action) : "";

    let AmtComparison = this.AmtComparison;
    AmtComparison ? (this.params += "&comparison=" + AmtComparison) : "";

    let fasenddate_date = this.fasenddate_date;
    fasenddate_date ? (this.params += "&to_date=" + fasenddate_date) : "";

    let fasgl_number = this.fasgl_number;
    fasgl_number ? (this.params += "&gl_code=" + fasgl_number) : "";

    let Transactiondatepatch1 = this.Transactiondatepatch1;
    Transactiondatepatch1
      ? (this.params += "&trans_date=" + Transactiondatepatch1)
      : "";

    let DebitandCredit1 = this.DebitandCredit1;
    DebitandCredit1 ? (this.params += "&dr_cr=" + DebitandCredit1) : "";

    let fasothers = this.fasothers;
    fasothers ? (this.params += "&filters=" + fasothers) : "";

    let Amountt1 = this.Amountt1;
    Amountt1 ? (this.params += "&start_amount=" + Amountt1) : "";

    let entry_gid = this.fassearch.get("entry_gid").value;
    entry_gid ? (this.params += "&entry_gid=" + entry_gid) : "";

    let entry_crno = this.fassearch.get("entry_crno").value;
    entry_crno ? (this.params += "&entry_crno=" + entry_crno) : "";

    let entry_module = this.fassearch.get("entry_module").value;
    entry_module ? (this.params += "&entry_module=" + entry_module) : "";

    let remark = this.fassearch.get("remark").value;
    remark ? (this.params += "&remark=" + remark) : "";

    let temp_name = this.fetch_template_name;
    temp_name ? (this.params += "&temp_name=" + temp_name) : "";

    let value = this.externalvalue;
    // value ? (params += "&value=" + value): "";
    let recon_type = this.recon_id;

    this.get_FAS_CBS_data(this.params, value);
    // let newarr =[]
    // newarr.push(data);

    if (data !== "") {
      if (
        JSON.stringify(data).length === 0 ||
        data.display_name === "" ||
        Object.keys(data).length === 0 ||
        data.display_name === null ||
        data.display_name === undefined
      ) {
        this.notification.showError("Choose Option");
        return;
      }
      if (
        JSON.stringify(data).length === 0 ||
        data.values === "" ||
        Object.keys(data).length === 0 ||
        data.values === null ||
        data.values === undefined
      ) {
        this.notification.showError("Enter Value");
        return;
      }
      if (
        this.fassytammatchsearchlist.some(
          (item) => item.display_name === data.display_name
        )
      ) {
        this.notification.showInfo("This filter is already applied");
        return;
      } else {
        this.fassytammatchsearchlist.push(data);
      }
    }

    this.payloadd = {
      dict_val: this.fassytammatchsearchlist,
    };
    this.SpinnerService.show();
    this.reconService
      .MatchingData(this.params, recon_type, value, this.payloadd)
      .subscribe((res) => {
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
              this.SpinnerService.hide();
              // this.notification.showInfo("No Records in FAS Table!");
              this.tabledataManual = [];
              this.nodatafoundfas = true;
            } else {
              this.tabledataManual = res["data"];
              this.SpinnerService.hide();
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
                    value: item.fas_action?.id, // Assuming fas_action is always present
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

              console.log("payload array", this.payloadArray);

              // this.nodatafoundfas = false;
            }
          } else {
            if (res.code) {
              // this.notification.showInfo("No Records in FAS Table!");
              this.SpinnerService.hide();
              this.tabledata = [];
              // this.nodatafoundfas = true;
            } else {
              this.tabledata = res["data"];

              this.SpinnerService.hide();

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
          this.SpinnerService.hide();
        }
      });
    // this.inputField.nativeElement.innerHTML = '';
    this.fassearch.reset();
    this.fasOrcbs = "";

    this.SpinnerService.hide();

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
  onChangecbs(data, pagenum) {
    this.fasOrcbs = 2;
    // if(this.externalpage == true){
    //   this.filterdata_id = 1
    // }

    if (this.action == 2 || this.action == 4) {
      this.actionChange = true;
    } else {
      this.actionChange = false;
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
      let branch_codeid = this.branch_codeid;
      branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";

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
    // value ? (params += "&value=" + value): "";
    let recon_type = this.recon_id;
    if (
      this.ars_status == "System Match Done" ||
      this.ars_status == "Reconciled" ||
      this.ars_status == "PASSED GEFU" ||
      this.ars_status == "PASSED JW" ||
      this.ars_status == "Manual Match Pending" ||
      this.externalvalue == 0
    ) {
      let value = this.externalvalue;
      // let payload={
      //   dict_val:this.cbssytammatchsearchlist
      //  }
      // if(data == ""){
      //   this.payloads={
      //     dict_val:[]
      //   }
      // }
      // else{
      //   this.payloads={
      //     dict_val:[data]
      //   }
      // }

      // if(option===''||option===null||option===undefined){
      //   this.notification.showError('Choose Options')
      //   return
      //  }
      //  if(value===''||value===null||value===undefined){
      //   this.notification.showError('Enter Value')
      //   return
      //  }

      if (data !== "") {
        if (
          JSON.stringify(data).length === 0 ||
          data.display_name === "" ||
          Object.keys(data).length === 0 ||
          data.display_name === null ||
          data.display_name === undefined
        ) {
          this.notification.showError("Choose Option");
          return;
        }
        if (
          JSON.stringify(data).length === 0 ||
          data.values === "" ||
          Object.keys(data).length === 0 ||
          data.values === null ||
          data.values === undefined
        ) {
          this.notification.showError("Enter Value");
          return;
        }
        if (
          this.cbssytammatchsearchlist.some(
            (item) => item.display_name === data.display_name
          )
        ) {
          this.notification.showInfo("This filter is already applied");
          return;
        } else {
          this.cbssytammatchsearchlist.push(data);
        }
      }
      this.payloads = {
        dict_val: this.cbssytammatchsearchlist,
      };
      this.SpinnerService.show();
      this.reconService
        .Matchingcbsdata(params, recon_type, value, this.payloads)
        .subscribe((res) => {
          this.SpinnerService.hide();
          if (this.filterdata_id == 2) {
            // this.url = this.ip + "brsserv/ARS_Dropdown"+"&value="+this.fasOrcbs;

            // this.url= this.url + '&value='+this.fasOrcbs;
            //  this.url= this.url + '?value=' + this.fasOrcbs;

            if (res.code) {
              this.SpinnerService.hide();
              this.nodatafoundcbs = true;
              // this.notification.showInfo("No Records in CBS Table!");
              this.cbstabledataManual = [];
            } else {
              this.cbstabledataManual = res["data1"];
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
                    value: item.cbs_action?.id, // Assuming fas_action is always present
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

              this.SpinnerService.hide();
              console.log("payload array", this.payloadArray);

              // this.nodatafoundcbs = false;
            }
          } else {
            if (res.code) {
              this.SpinnerService.hide();
              this.nodatafoundcbs = true;
              // this.notification.showInfo("No Records in CBS Table!");
              this.cbstabledata = [];
            } else {
              this.cbstabledata = res["data1"];
              this.SpinnerService.hide();
              this.nodatafoundcbs = false;
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
      this.SpinnerService.hide();
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
  //       this.Amountt1 = this.fassearch.get("start_amount").value;
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
    this.onChangeRBF("", this.pagination.index);
  }
  nextClick() {
    this.pagination.index = this.pagination.index + 1;
    this.onChangeRBF("", this.pagination.index);
  }
  previousClickcbs() {
    this.paginationcbs.index = this.paginationcbs.index - 1;
    this.onChangecbs("", this.paginationcbs.index);
  }
  nextClickcbs() {
    this.paginationcbs.index = this.paginationcbs.index + 1;
    this.onChangecbs("", this.paginationcbs.index);
  }
  fasmanualpreviousClick() {
    this.pagination.index = this.pagination.index - 1;
    this.onChangeRBF("", this.pagination.index);
  }
  fasmanualnextClick() {
    this.pagination.index = this.pagination.index + 1;
    this.onChangeRBF("", this.pagination.index);
  }
  wisfinjvpreviousClick() {
    this.paginationwisfinjv.index = this.paginationwisfinjv.index - 1;
    this.combineDataJW();
  }
  wisfinjvnextClick() {
    this.paginationwisfinjv.index = this.paginationwisfinjv.index + 1;
    this.combineDataJW();
  }

  cbsmanualpreviousClick() {
    this.paginationcbs.index = this.paginationcbs.index - 1;
    this.onChangecbs("", this.paginationcbs.index);
  }
  cbsmanualnextClick() {
    this.paginationcbs.index = this.paginationcbs.index + 1;
    this.onChangecbs("", this.paginationcbs.index);
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
    let page = 1;
    this.iDate = this.datepipe.transform(
      this.brsconcile.get("date").value,
      "yyyy-MM-dd"
    );
    this.reconService.integrityUnmatch(this.iDate).subscribe((res) => {
      this.integritydata = res["data"];
      console.log("IntegrityData", this.integritydata);
    });
    if (this.iDate) {
      this.searchvar["params"] = "&date=" + this.iDate;
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
  }

  getglcodeid(item) {
    console.log("item", item);

    let page = 1;
    if (item !== undefined && item !== "" && item !== null) {
      this.glcode_id = item.gl_code;
      this.searchvar1["url"] = this.branchUrl;
      let params = "";
      // params+=this.glcode_id? "&gl_no="+this.glcode_id:''
      params += this.iDate ? "&date=" + this.iDate : "";
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
      this.onChangeRBF("", page);
      this.onChangecbs("", page);
    }
  }

  getfiltersummary(event: MatTabChangeEvent, page): void {
    console.log("info", event);
    this.filterdata_id = event.tab.textLabel;
    console.log("this.filterid", this.filterdata_id);

    if (this.filterdata_id === "System Match") {
      this.filterdata_id = "1";
      this.onChangeRBF("", page);
      this.onChangecbs("", page);
    }
    if (this.filterdata_id === "Manually Matching") {
      this.filterdata_id = "2";
      this.onChangeRBF("", page);
      this.onChangecbs("", page);
    }
    if (this.filterdata_id === "Manually Matched") {
      const selectedItemId = this.columnList[0].id;
      this.onTabChange1(selectedItemId, page);
    }

    // else if(this.filterdata_id === "Partially Matched"){
    //   // this.filterdata_id='3'
    //   // this.onChangeRBFPartial(page)
    //   this.onChangePartial(page)
    //   // this.checkedItems = [];
    // }
    this.cbssytammatchsearchlist = [];
    this.fassytammatchsearchlist = [];
  }

  onTabChange1(itemId: number, page): void {
    this.filterdata_id = "3";
    this.action = itemId;
    this.onChangeRBF("", page);
    this.onChangecbs("", page);
  }

  onTabChange(event, page): void {
    let eventIndex = event.index;
    const selectedItemId = this.columnList[eventIndex].id;
    this.filterdata_id = "3";
    this.action = selectedItemId;
    if (this.action == 2 || this.action == 4) {
      this.actionChange = true;
    } else {
      this.actionChange = false;
    }
    this.onChangeRBF("", page);
    this.onChangecbs("", page);
    this.rows.clear();
    this.cbssytammatchsearchlist = [];
    this.fassytammatchsearchlist = [];
  }

  // getfiltersummary1(event: MatTabChangeEvent, page): void {
  //   this.filterdata_id = event.tab.textLabel;
  //   console.log("this.filterid", this.filterdata_id);

  //   if (this.filterdata_id === "ASSIGN TAG NUMBER") {
  //     this.filterdata_id = "3";
  //     this.action = "1";
  //   this.onChangeRBF("",page);
  //      this.onChangecbs("",page);
  //   } else if (this.filterdata_id === "PASS WISEFIN JV") {
  //     this.filterdata_id = "3";
  //     this.action = "2";
  //   this.onChangeRBF("",page);
  //      this.onChangecbs("",page);
  //   } else if (this.filterdata_id === "CHANGE ENTRY STATUS") {
  //     this.filterdata_id = "3";
  //     this.action = "3";
  //   this.onChangeRBF("",page);
  //      this.onChangecbs("",page);
  //   } else if (this.filterdata_id === "PASS GEFU") {
  //     this.filterdata_id = "3";
  //     this.action = "4";
  //   this.onChangeRBF("",page);
  //      this.onChangecbs("",page);
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
  }
  adddocument(page) {
    let date = this.brsconcile.get("date").value;
    if (date == "" || date == null || date == undefined) {
      this.notification.showWarning("Please Select a date!");
      return false;
    }
    // this.mainpage=false
    // this.summarypage=false
    // this.mainpage=false
    // this.summarypage=true
    this.getsummary(page);
    // this.glcode_id = '';
    // this.iDate = '';
    // this.branch_codeid = '';
  }
  backtomain() {
    this.uploadshow = false;
    this.externalform.reset();
    this.externalform.value.temp_dd = "";
    this.hidebranch = 0;
    this.allcheckbox = "";
    this.multiplecheckbox = 0;
    this.compareglcheckbox = 0;
    this.hidecomparecheckbox = 0;
    this.isSingleBranch = false;
    this.isWholeBank = false;
    this.tabledata = [];
    this.cbstabledata = [];
    this.new_fas_cbs_fetch_values = "";
    this.uploadshow1 = false;
    this.disable_gl = 0;
    this.resettemplate = [];
    this.fetch_template = undefined;
  }
  getbacktomain(page) {
    this.mainpage = true;
    this.summarypage = false;
    this.filterdata_id = "1";
    this.onChangeRBF("", page);
    this.onChangecbs("", page);
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

    this.reconService.arssummarydata(params).subscribe((res) => {
      this.SpinnerService.hide();
      this.summarydatalist = res["data"];
      if (this.summarydatalist.length === 0) {
        this.toster.info("No Data Found");
      }
      this.paginationsum = res.pagination ? res.pagination : this.paginationsum;
    });
    // this.glcode_id = '';
    // this.iDate = '';
    // this.branch_codeid = '';
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
      recon_type: this.recon_id,
    };
    this.reconService.newActions(payload, this.recon_id).subscribe((res) => {
      this.onChangeRBF("", page);
      this.onChangecbs("", page);
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
  fassearchtable(page) {
    let option = this.fassearch.get("dropdownoption").value;
    let value = this.fassearch.get("value").value;
    if (option === "" || option === null || option === undefined) {
      this.notification.showError("Choose Options");
      return;
    }
    if (value === "" || value === null || value === undefined) {
      this.notification.showError("Enter Value");
      return;
    }
    if (
      this.fassytammatchsearchlist.some((item) => item.display_name === option)
    ) {
      this.fassearch.get("dropdownoption").reset();
      this.fassearch.get("value").reset();
      this.notification.showInfo("This filter is already applied");
    } else {
      this.fassytammatchsearchlist.push({
        display_name: option,
        values: value,
      });
      this.fassearch.get("dropdownoption").reset();
      this.fassearch.get("value").reset();
    }
    console.log(this.fassytammatchsearchlist, "fassytammatchsearchlist");
    // return
    this.onChangeRBF("", page);
  }
  fastableclear() {
    this.fassytammatchsearchlist = [];
    this.fassearch.reset();
    this.onChangeRBF("", 1);
  }
  cbstableclear() {
    this.cbssytammatchsearchlist = [];
    this.cbssearch.reset();
    this.onChangecbs("", 1);
  }
  cbssearchtable(page) {
    let option = this.cbssearch.get("dropdownoption").value;
    let value = this.cbssearch.get("value").value;
    if (option === "" || option === null || option === undefined) {
      this.notification.showError("Choose Options");
      return;
    }
    if (value === "" || value === null || value === undefined) {
      this.notification.showError("Enter Value");
      return;
    }
    if (
      this.cbssytammatchsearchlist.some((item) => item.display_name === option)
    ) {
      this.cbssearch.get("dropdownoption").reset();
      this.cbssearch.get("value").reset();
      this.notification.showInfo("This filter is already applied");
    } else {
      this.cbssytammatchsearchlist.push({
        display_name: option,
        values: value,
      });
      this.cbssearch.get("dropdownoption").reset();
      this.cbssearch.get("value").reset();
    }
    // return
    this.onChangecbs("", page);
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
    this.dd_validation_template = 0;
    this.temp_field = {
      label: "Template Name",
      method: "get",
      url: this.reconurl + "reconserv/wisefin_template",
      params: "&recon_ars=" + this.dd_validation_template,
      searchkey: "name",
      displaykey: "template_name",
      wholedata: true,
    };
    let auto_dict = {
      branch_code: this.branch_codeid,
      gl_code: this.glcode_id,
      process_date: this.iDate,
      recon_type: this.recon_id,
    };

    if (
      this.ars_status == "System Match Done" ||
      this.ars_status == "Reconciled" ||
      this.ars_status == "PASSED GEFU" ||
      this.ars_status == "PASSED JW" ||
      this.ars_status == "Manual Match Pending"
    ) {
      this.reconService
        .autofetchdate(auto_dict, this.recon_id)
        .subscribe((results) => {
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
          this.onChangeRBF("", page);
          this.onChangecbs("", page);
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
    this.dd_validation_template = 1;
    this.temp_field = {
      label: "Template Name",
      method: "get",
      url: this.reconurl + "reconserv/wisefin_template",
      params: "&recon_ars=" + this.dd_validation_template,
      searchkey: "name",
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
      this.reconService
        .dynamicheaderfetchdata(this.temp_name)
        .subscribe((results) => {
          let data = results;
          this.datas1 = results;
          this.cbsdatas = this.datas1.cbs;
          this.wisefindatas = this.datas1.wisefin;
          console.log("cbsdatas ====>", this.cbsdatas);
          console.log("wisefindatas ====>", this.wisefindatas);
          this.cbsKeys = Object.keys(data.cbs);
          this.isExpandedscardrecon1 = !!this.cbsKeys;
          this.isExpandedscardrecon3 = !!this.cbsKeys;
          this.wisefinKeys = Object.keys(data.wisefin);
          this.isExpandedscardrecon = !!this.wisefinKeys;
          this.isExpandedscardrecon2 = !!this.wisefinKeys;
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

    if (
      this.ars_status == "System Match Done" ||
      this.ars_status == "Reconciled" ||
      this.ars_status == "PASSED GEFU" ||
      this.ars_status == "PASSED JW" ||
      this.ars_status == "Manual Match Pending"
    ) {
      this.fasfromdate();
      this.fasenddate();
      this.filterdata_id = "1";
      this.onChangeRBF("", page);
      this.onChangecbs("", page);
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
      //     this.onChangeRBF("",page);
      //        this.onChangecbs("",page);
      //       this.getCategoryList();
      //     });
    } else if (this.ars_status == "Pending") {
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
  //     this.onChangeRBF("",page);
  //        this.onChangecbs("",page);
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
    // this.onChangeRBF("",page);
    //  this.onChangecbs("",page);
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
    this.reconService.getcampaignexceldownload(this.filetype).subscribe(
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
  //     this.onChangeRBF("",page);
  //        this.onChangecbs("",page);
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
  //     this.onChangeRBF("",page);
  //        this.onChangecbs("",page);
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
    this.reconService.submitcompare(payload).subscribe((res) => {
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
    this.particular_recon_id = col.id;
    this.fetch_template = col.template_name;
    this.fetch_template_name = col.template_name.template_name;
    this.temp_field = {
      label: "Template Name",
      method: "get",
      url: this.reconurl + "reconserv/wisefin_template",
      params: "",
      searchkey: "name",
      displaykey: "template_name",
      wholedata: true,
      defaultvalue: this.fetch_template,
    };
    this.getexternalsummary(data1, data2, data3, header);
    this.filterdata_id = "1";
    this.fetchsummary(page);
    this.reconService
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
        console.log("Optionsyscbssearch===========>", this.Optionsyscbssearch);
        this.cbsKeys.forEach((item) => {
          this.eachvalues = item;
          // this.eachwisefinkeys.push(item);
          this.newarrcbskeys = {
            cbsKeysname: this.eachvalues,
          };
          this.eachcbskeys.push(this.newarrcbskeys);
          console.log(" this.newarrcbskeys====>", this.newarrcbskeys);
          console.log("this.eachcbskeys", this.eachcbskeys);

          // Logs the id of each item
        });
        console.log("this.eachcbskeys", this.eachcbskeys);

        this.Optionfield1 = {
          label: "Options",
          fronentdata: true,
          data: this.eachcbskeys,
          displaykey: "cbsKeysname",
          Outputkey: "cbsKeysname",
          // valuekey: "value",
        };

        this.Optionsyscbssearch = [
          {
            type: "dropdown",
            inputobj: this.Optionfield1,
            formvalue: "display_name",
          },
          { type: "input", label: "Value", formvalue: "values" },
        ];
        this.Optionmancbssearch = [
          {
            type: "dropdown",
            inputobj: this.Optionfield1,
            formvalue: "display_name",
          },
          { type: "input", label: "Value", formvalue: "values" },
        ];
        console.log("Optionmancbssearch===========>", this.Optionmancbssearch);
        console.log("wisefinKeys ====>", this.wisefinKeys);
        this.wisefinKeys.forEach((item) => {
          this.eachvalue = item;
          // this.eachwisefinkeys.push(item);
          this.newarrwisefinkeys = {
            wisefinKeysname: this.eachvalue,
          };
          this.eachwisefinkeys.push(this.newarrwisefinkeys);
          console.log(" this.newarrwisefinkeys====>", this.newarrwisefinkeys);
          console.log("this.eachwisefinkeys", this.eachwisefinkeys);

          // Logs the id of each item
        });

        console.log("this.eachwisefinkeys", this.eachwisefinkeys);

        this.Optionfield = {
          label: "Options",
          fronentdata: true,
          data: this.eachwisefinkeys,
          displaykey: "wisefinKeysname",
          Outputkey: "wisefinKeysname",
          required: true,
          // valuekey: "value",
        };

        this.Optionsysfassearch = [
          {
            type: "dropdown",
            inputobj: this.Optionfield,
            formvalue: "display_name",
          },
          {
            type: "input",
            label: "Value",
            formvalue: "values",
            required: true,
          },
        ];
        console.log("Optionsysfassearch===========>", this.Optionsysfassearch);

        this.Optionmanfassearch = [
          {
            type: "dropdown",
            inputobj: this.Optionfield,
            formvalue: "display_name",
          },
          { type: "input", label: "Value", formvalue: "values" },
        ];
      });

    console.log("Optionmanfassearch===========>", this.Optionmanfassearch);
  }

  fetchsummary(page) {
    this.onChangeRBF("", page);
    this.onChangecbs("", page);
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
        start_amount: this.fasdatavalue,
      });
    }
    // console.log("start_amount",this.fasdatavalue);

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
      recon_type: this.recon_id,
    };

    if (this.type === 1) {
      this.reconService.editfastagnumber(this.arr).subscribe((res) => {
        if (res.status) {
          this.toster.success(res.message);
          // this.arr = [];
          this.reconService
            .newActions(payload, this.recon_id)
            .subscribe((res) => {
              this.SpinnerService.show();
              if (res.code) {
                this.notification.showError(res.code);
              } else {
                this.notification.showSuccess(res.message);
                this.onChangeRBF("", page);
                this.onChangecbs("", page);
                this.SpinnerService.hide();
              }
            });
          // this.closetagnumber.nativeElement.click();
          this.fassearch.get("edittag_number").reset();
          this.fassearch.get("edittag_number2").reset();

          // this.onChangeRBF("",page);
          //  this.onChangecbs("",page);
          this.arr = [];
        } else {
          this.toster.error(res.code);
          // this.closetagnumber.nativeElement.click();
          this.fassearch.get("edittag_number").reset();
          this.fassearch.get("edittag_number2").reset();
        }
      });
    } else {
      this.reconService.newActions(payload, this.recon_id).subscribe((res) => {
        this.SpinnerService.hide();
        if (res.code) {
          this.notification.showError(res.code);
        } else {
          this.notification.showSuccess(res.message);
          this.onChangeRBF("", page);
          this.onChangecbs("", page);
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

    this.reconService
      .systemreportdownload(
        this.iDate,
        this.glcode_id,
        this.branch_codeid,
        this.externalvalue
      )
      .subscribe(
        (data) => {
          // this.SpinnerService.hide()
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
    this.reconService
      .manualreportdownload(
        this.fr_date,
        this.to_date,
        this.glcode_id,
        this.branch_codeid,
        this.iDate,
        this.externalvalue
      )
      .subscribe(
        (data) => {
          this.SpinnerService.hide();
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
    };
    this.SpinnerService.show();
    this.reconService.autofetchDownload(body).subscribe(
      (res) => {
        let data = res;
        console.log("schedule", data["data"][0]?.key);
        if (res.code) {
          this.toster.error(res.code);
          this.SpinnerService.hide();
        }
        if (data["data"][0]?.key == "scheduler triggered") {
          this.toster.success("Scheduler Triggered!");
          this.SpinnerService.hide();
        }
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
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
    // this.downloadreport=this.data.id
    console.log("downloadreport", this.downloadreport);
    this.reconService
      .overallmatechs(
        this.particular_recon_id
        // this.iDate,
        // this.glcode_id,
        // this.branch_codeid,
        // this.externalvalue,
        // this.fetch_template_name
        // this.downloadreport
      )
      .subscribe(
        (data) => {
          this.SpinnerService.hide();
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
    if (value === 0) return "0";
    if (isNaN(value)) return null;
    if (value) {
      let numberParts = value?.toString()?.split(".");
      let rupees = numberParts[0];
      let paise = numberParts.length > 1 ? "." + numberParts[1] : "";

      let lastThree = rupees?.substring(rupees.length - 3);
      let otherNumbers = rupees?.substring(0, rupees.length - 3);
      if (otherNumbers !== "") {
        lastThree = "," + lastThree;
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
        value: event?.id,
        type: type,
        digit: data?.fas_tag_alpha || data?.cbs_tag_alpha || "",
        newdata: false,
      };

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
          if (data?.[key] === "") {
            data1["newdata"] = true;
          }
          this.payloadArray.push(data1);
        }
      } else {
        this.payloadArray.push(data1);
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

    this.reconService.actionRefresh(id, type).subscribe((res) => {
      this.SpinnerService.show();
      if (res.status) {
        this.notification.showInfo("Action Removed!");
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
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
    let data = {
      data: this.payloadArray,
      value: this.externalvalue,
    };
    this.reconService.newActionSave(data).subscribe((res) => {
      this.SpinnerService.show();
      if (res.status) {
        this.notification.showSuccess("Saved Successfully!..");
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
        console.log("payloadArray", this.payloadArray);
      } else if (res.code) {
        this.notification.showError(res.code);
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
      } else if (res.description) {
        this.notification.showError(res.description);
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
      }
      this.onChangeRBF("", page);
      this.onChangecbs("", page);
      this.SpinnerService.hide();
    });
  }
  selectedRecFas() {
    let data = {
      data: this.payloadArray,
      Date: this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      ),
      branch_code: this.branch_codeid,
      gl_code: this.glcode_id,
      temp_name: this.fetch_template_name,
    };
    this.SpinnerService.show();
    this.reconService.selectedRecFas(data).subscribe((res) => {
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
  selectedRecCbs() {
    let data = {
      data: this.payloadArray,
      Date: this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      ),
      branch_code: this.branch_codeid,
      gl_code: this.glcode_id,
      temp_name: this.fetch_template_name,
    };
    this.SpinnerService.show();
    this.reconService.selectedRecCbs(data).subscribe((res) => {
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
    this.selectedRecFas();
    this.selectedRecCbs();
  }
  submitManual(page) {
    let array = [];
    for (let a of this.payloadArray) {
      if (a?.newdata) {
        array.push(a);
      }
      console.log("payloadArray", this.payloadArray);
    }
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }

    let data = {
      data: this.payloadArray,
      Date: this.iDate,
      branch_code: this.branch_codeid,
      gl_code: this.glcode_id,
      value: this.externalvalue,
      temp_name: this.fetch_template_name,
      recon_type: this.recon_id,
    };
    // let confirm = window.confirm("Are you sure want to Submit the Records?")

    // if(confirm == false){
    //   return false;
    // } else if(confirm == true) {
    this.reconService.newActions(data, this.recon_id).subscribe((res) => {
      this.SpinnerService.show();
      if (res.status) {
        this.notification.showSuccess("Submitted Successfully!");
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.active_status();
        this.SpinnerService.hide();
        this.payloadArray = [];
      } else if (res.description) {
        this.notification.showError(res.description);
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
        this.payloadArray = [];
      } else if (res.code) {
        this.notification.showError(res.code);
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
        this.payloadArray = [];
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
    this.reconService
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
    // this.closeviewpopup.nativeElement.click();
    this.reconService
      .viewData(date, gl_code, branchcode, value, history, this.recon_id, page)
      .subscribe((res) => {
        this.viewdataresult = res;
        // if(this.viewdataresult.description){
        //   this.

        // }
        if (res.code) {
          this.notification.showError(res.description);
          // this.viewDataLists= [];
          this.SpinnerService.hide();
        }
        this.viewDataLists = res["data"];
        this.viewDataLists.forEach((item) => {
          this.reportuploadid = item.id;
          console.log(this.reportuploadid);
          // Logs the id of each item
        });

        console.log("reportuploadid", this.reportuploadid);
        console.log("viewDataLists ====>", this.viewDataLists);
        // // this.viewdata_temp_name = this.viewDataLists.temp_name
        // this.viewdata_temp_names = this.viewDataLists.map(item => item.template_name);
        // console.log("viewdata_temp_names ====>", this.viewdata_temp_names);
        // this.temp_field = {
        //   label: "Template Name",  "method": "get", "url": this.arsURL + "brsserv/wisefin_template" ,params: "", "searchkey": "query", "displaykey": "template_name", wholedata: true,
        //   defaultvalue: this.viewdata_temp_names,
        // };
      });
    this.SpinnerService.hide();
  }
  viewDataAndHistory(page) {
    this.popupopen1();
    this.viewData(page);
    this.viewhistory(page);
  }
  addclick() {
    this.popupopen();
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
    // this.closeviewpopup.nativeElement.click();
    this.reconService
      .viewData(date, gl_code, branchcode, value, history, this.recon_id, page)
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
    this.reconService.viewData_download(id).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        if(data.status === 4){
          link.download ="Report.xlsx";
        }else{
          link.download = FILE + ".xlsx";
        }
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
    this.reconService
      .deleteFileData(id, date, type, status)
      .subscribe((res) => {
        if (res.status) {
          this.SpinnerService.hide();
          this.notification.showSuccess("Successfully Changed!");
          // this.viewData(page);
        } else {
          this.SpinnerService.hide();
          this.notification.showError(res.code);
        }
      });
    this.SpinnerService.hide();
  }

  runprocess() {
    if (this.allcheckbox !== 1 && this.allcheckbox !== 0 && this.dcs_recon===0) {
      this.notification.showError(
        'Please select either "Yes" or "No" in Run Account'
      );
      return;
    }

    // if(this.disable_gl !== 1)
    //   {
    //     this.notification.showWarning("Enter GL no");
    //     return false;
    //   }
    this.popupopen2();

    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }

    let gl_code = ''
    let branchcode=''
    if(this.dcs_recon===0){
      gl_code = this.glcode_id;
      branchcode = this.branch_codeid;
    }else if(this.dcs_recon===1){
      gl_code = '';
      branchcode ='';
    }

    let date = this.iDate;
    let value = this.externalvalue;
    let multi_gl = 0;
    this.SpinnerService.show();
    // this.closerunpopup.nativeElement.click();
    this.reconService
      .run_process(
        date,
        gl_code,
        branchcode,
        value,
        this.template_name,
        this.multiplecheckbox,
        this.compareglcheckbox,
        this.recon_id
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
    this.matchstatus = event?.id;
    console.log("arsStatus", this.matchstatus);
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
  // this.onChangeRBF("",page);
  //    this.onChangecbs("",page);
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

    this.reconService.closeData(data).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess("Closed Successfully!");
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.remarksClose.reset();
        this.SpinnerService.hide();
        this.closebuttonclosed.nativeElement.click();
      } else if (res.code) {
        this.notification.showError(res.code);
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
      } else if (res.description) {
        this.notification.showError(res.description);
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
      }
      this.onChangeRBF("", page);
      this.onChangecbs("", page);
      this.SpinnerService.hide();
    });
  }

  dataSave(page) {
    let data = {
      data: this.payArr,
    };
    this.SpinnerService.show();

    this.reconService.actionSave(data).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess("Saved Successfully!..");
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
        console.log("payloadArray", this.payloadArray);
      } else if (res.code) {
        this.notification.showError(res.code);
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
      } else if (res.description) {
        this.notification.showError(res.description);
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
      }
      this.onChangeRBF("", page);
      this.onChangecbs("", page);
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
    this.reconService.newActionSubmit(data).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess("Submitted Successfully!..");
        this.closebuttonremarks.nativeElement.click();
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.showpopup = false;
        this.SpinnerService.hide();
        this.remarks.reset();
        console.log("payArr", this.payArr);
        this.payArr = [];
      } else if (res.code) {
        this.notification.showError(res.code);
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
      } else if (res.description) {
        this.notification.showError(res.description);
        this.onChangeRBF("", page);
        this.onChangecbs("", page);
        this.SpinnerService.hide();
      }
      this.onChangeRBF("", page);
      this.onChangecbs("", page);
      this.SpinnerService.hide();
    });
  }
  getCombinedata() {
    this.reconService
      .getCombineData(
        this.iDate,
        this.glcode_id,
        this.branch_codeid,
        this.action,
        this.externalvalue,
        this.fetch_template_name,
        this.paginationwisfinjv.index
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
    this.reconService
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
    this.reconService
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
    this.onChangeRBF("", page);
    this.onChangecbs("", page);
    // this.getclosedfas(page);
    // this.getclosedcbs(page);
  }
  resetcombineDataJWpage() {
    this.paginationwisfinjv.index = 1;
    this.combineDataJW();
  }
  combineDataJW() {
    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
    }
    this.reconService
      .getCombineData(
        this.iDate,
        this.glcode_id,
        this.branch_codeid,
        this.action,
        this.externalvalue,
        this.fetch_template_name,
        this.paginationwisfinjv.index
      )
      .subscribe((res) => {
        let data = res["data"];
        this.paginationwisfinjv = res.pagination;
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
                branch_code: this.branch_codeid,
                gl_no: this.glcode_id,
                date: this.iDate,
              });

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
                    this.reconService
                      .getbsscroll(this.glcode_id, value, this.recon_id, 1)
                      .pipe(
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
                    this.reconService
                      .getCategoryListScroll(
                        this.glcode_id,
                        value,
                        this.recon_id,
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
                    this.reconService
                      .getsubCategoryListScroll(
                        this.glcode_id,
                        this.catId,
                        value,
                        1,
                        this.recon_id
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
                    this.reconService
                      .getccscroll(
                        this.glcode_id,
                        this.bsId,
                        value,
                        this.recon_id,
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
    if (this.action == 2 || this.action == 4) {
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
      };
      this.SpinnerService.show();
      this.reconService.combineSave(data).subscribe((res) => {
        if (res.status) {
          this.notification.showSuccess("Saved Successfully!");
          this.remark.reset();
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
      this.notification.showWarning("Enter Remarks!");
      return false;
    }
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

      if (!this.category || !this.subcategory || !this.bs || !this.cc) {
        anyFieldEmpty = true;
        formValid = false;
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
    if (this.action == 2) {
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
    };

    this.SpinnerService.show();
    this.reconService.combineSave(data).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess("Submitted Successfully!");
        this.rows.clear();
        this.combineDataJW();
        this.remark.reset();
        this.SpinnerService.hide();
        this.CombineArray = [];
        this.CombineArraySubmit = [];
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
      branch_code: [this.branch_codeid],
      gl_no: [this.glcode_id],
      date: [this.iDate],
    });

    // this.disableedit = false;
    this.recon_id;
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
          this.reconService
            .getCategoryListScroll(this.glcode_id, value, this.recon_id, 1)
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
    newRow
      .get("sub_category")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.reconService
            .getsubCategoryListScroll(
              this.glcode_id,
              this.catId,
              this.recon_id,
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

    newRow
      .get("cc")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.reconService
            .getccscroll(this.glcode_id, this.bsId, value, this.recon_id, 1)
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

    newRow
      .get("bs")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.reconService
            .getbsscroll(this.glcode_id, value, this.recon_id, 1)
            .pipe(
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

        this.reconService.getDeletedata(id).subscribe((res) => {
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
    this.reconService.getCategoryList(gl_code).subscribe((res) => {
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
                this.reconService
                  .getCategoryListScroll(
                    this.glcode_id,
                    this.categoryInput.nativeElement.value,
                    this.currentpagedrop + 1,
                    this.recon_id
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
    this.reconService.getSubCategory(this.glcode_id, id, 1).subscribe((res) => {
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
                this.reconService
                  .getsubCategoryListScroll(
                    this.glcode_id,
                    this.catId,
                    this.subcategoryInput.nativeElement.value,
                    this.recon_id,
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
    this.reconService.getbs(this.glcode_id).subscribe((results) => {
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
                this.reconService
                  .getbsscroll(
                    this.glcode_id,
                    this.bsInput.nativeElement.value,
                    this.recon_id,
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
    this.reconService.getcc(this.glcode_id, bsId, 1).subscribe((results) => {
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
                this.reconService
                  .getccscroll(
                    this.glcode_id,
                    this.bsId,
                    this.ccInput.nativeElement.value,
                    this.recon_id,
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
      this.notification.showWarning("Please Choose a Date!");
      return false;
    }

    if (this.glcode_id == null || this.glcode_id == undefined) {
      this.glcode_id = "";
    }

    if (this.branch_codeid == null || this.branch_codeid == undefined) {
      this.branch_codeid = "";
    }

    this.reconService
      .reportdownload(
        this.iDate,
        this.branch_codeid,
        this.glcode_id,
        id,
        this.externalvalue
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

  externalreportdownload(id) {
    this.branch_codeid = this.externaljwreport.get("branch_code").value;
    this.glcode_id = this.externaljwreport.get("gl_no").value;
    this.iDate = this.datepipe.transform(
      this.externaljwreport.get("date").value,
      "yyyy-MM-dd"
    );

    if (this.iDate == "" || this.iDate == null || this.iDate == undefined) {
      this.notification.showWarning("Please Choose a Date!");
      return false;
    }

    if (this.glcode_id == null || this.glcode_id == undefined) {
      this.glcode_id = "";
    }

    if (this.branch_codeid == null || this.branch_codeid == undefined) {
      this.branch_codeid = "";
    }

    this.reconService
      .reportdownload(
        this.iDate,
        this.branch_codeid,
        this.glcode_id,
        id,
        this.externalvalue
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
    if (this.iDate == "" || this.iDate == null || this.iDate == undefined) {
      this.notification.showWarning("Please Choose a Date!");
      return false;
    }

    this.reconService.integrityUnmatchreportdownload(this.iDate).subscribe(
      (data) => {
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
    this.getwisefinedata( this.template_name)
this.getcbsdata( this.template_name)
  }
  allglclick(id) {
    if (id === 1) {
      this.allcheckbox = id;
      this.uploadshow1 = true;
      // this.multiplecheckbox = id;
      // this.compareglcheckbox = id;
      // this.isWholeBank = true;
      this.disable_gl = 0;
      this.hidebranch = 1;
    } else if (id === 0) {
      this.allcheckbox = id;
      this.uploadshow1 = false;
      // this.isWholeBank = true;
      this.hidebranch = 1;
      this.disable_gl = 1;
    }
    this.radiobuttonform.get("runAccount")?.setValue(id);
    this.radiobuttonform.get("runAccount")?.markAsTouched();
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
  // bankradioclick(id: number) {
  //   if (id === 1) {
  //     this.hidebranch = this.isWholeBank ? 1 : 0;
  //     if (this.isWholeBank) {
  //       this.externalform.get("branch_code").reset();
  //       this.externalform.get("branch_code").setValue("");
  //     }
  //   }
  //   if (id === 0) {
  //     this.hidebranch = this.isSingleBranch ? 0 : 1;
  //   }
  //   }
  bankradioclicks(isWholeBank) {
    if (isWholeBank) {
      this.hidebranch = 1;
      this.isSingleBranch = false; // Uncheck single branch
      this.externalform.get("branch_code").reset();
      this.externalform.get("branch_code").setValue("");
    } else {
      this.hidebranch = 0;
    }
  }
  banksradioclicks(id) {
    if (id === 1) {
      this.isWholeBank = true;
      this.isSingleBranch = false; // Uncheck single branch
      this.hidebranch = 1;
      this.externalform.get("branch_code").reset();
      this.externalform.get("branch_code").setValue("");
    } else if (id === 0) {
      this.isSingleBranch = true;
      this.isWholeBank = false; // Uncheck whole bank
      this.hidebranch = 0;
    }
  }

  get_FAS_CBS_data(params, value) {
    this.reconService
      .get_fas_cbs_fetch_data(params, this.recon_id, value)
      .subscribe((results) => {
        let data = results["data1"];
        this.new_fas_cbs_fetch_values = data[0];
        console.log(
          this.new_fas_cbs_fetch_values,
          "this.new_fas_cbs_fetch_values"
        );
      });
  }
  SummaryinterintegrityData: any = [
    { columnname: "Recon Name", key: "integrity_name" },
    { columnname: "Last Run Date", key: "run_date" },
    {
      columnname: "Status",
      key: "status",
      toggle: true,
      function: true,
      clickfunction: this.deletetemplate.bind(this),
      validate: true,
      validatefunction: this.togglefunction.bind(this),
    },
    {
      columnname: "Report",
      key: "right",
      function: true,
      validate: true,
      validatefunction: this.icon.bind(this),
      clickfunction: this.openpopup.bind(this),
    },
    {
      columnname: " Edit",
      icon: "edit",
      style: { color: "black", cursor: "pointer" },
      button: true,
      function: true,
      clickfunction: this.editrecon.bind(this),
    },
    {
      columnname: " Action",
      icon: "arrow_right_alt",
      style: { color: "black", cursor: "pointer", fontWeight: 700 },
      button: true,
      function: true,
      clickfunction: this.routetonextpage.bind(this),
    },
  ];
  openpopup(data) {
    
   
    var myModal = new (bootstrap as any).Modal(document.getElementById("reconreport"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
    this.recon_name = data.integrity_name;
    this.report_templateform.reset()
    // this.faspageform.reset()
    this.match_type=data?.type
    this.recon_id = data.id;
    if (data.report_type === 0) {
      this.report_type = data.report_type;
      this.showcustomizereport = true;
      this.getreportsummary();
    } else {
      this.report_type = data.report_type;
      this.showcustomizereport = false;
    }
    if(data.template_name!==null){
      this.getData(data.template_name)
      let datas={
        "template_name":data.template_name,
      }
      
      this.report_templateform.patchValue({
        temp_name: datas,
        // fas_column: Array.isArray(data.fas_extra_column) ? data.fas_extra_column : (data.fas_extra_column ? [data.fas_extra_column] : []),
      });
      this.selected_array=data.fas_extra_column
    }
  }
  icon() {
    let config = {
      value: "Report",
      class: "btn btn-outline-success border_radius",
      function: true,
    };
    return config;
  }
  searchupload(e) {
    this.SummaryApinterintegrityObjNew = {
      method: "get",
      url: this.reconurl + "reconserv/multi_integrity_uploads",
      params: e+'&dcs_recon='+this.dcs_recon ,
    };
  }
  statusfield: any = {
    label: "status",
    fronentdata: true,
    data: this.status_array,
    displaykey: "value",
    Outputkey: "value",
    valuekey: "value",
  };

  deletetemplate(data) {
    // this.id = data.id;
    // this.status= data.recon_status;
    console.log("", data);
    let status: any = "";
    if (data.recon_status == 0) {
      this.status = 1;
    } else {
      this.status = 0;
    }
    this.reconService
      .inter_file_statuschange(data.id, this.status)
      .subscribe((res) => {
        if (res.status) {
          this.notification.showSuccess(res.message);
          this.SummaryApinterintegrityObjNew = {
            method: "get",
            url: this.reconurl + "reconserv/multi_integrity_uploads",
            params:'&dcs_recon='+this.dcs_recon ,
          };
        } else {
          this.notification.showError(res.description);
        }
      });
    // if (res.status == "success") {
    //    this.notification.showSuccess(res.message)
    //    this.SummaryApinterintegrityObjNew = {
    //    method: "get",
    //    url: this.reconurl + "reconserv/multi_integrity_uploads",
    //    }
    //    }
    // else {
    //     this.notification.showError(res.description);
    //      }
    //     })
  }
  togglefunction(data) {
    let config: any = {
      disabled: false,
      style: "",
      class: "",
      value: "",
      checked: "",
      function: true,
    };
    if (data.recon_status == 0) {
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: false,
        function: true,
      };
    } else if (data.recon_status == 1) {
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "",
        checked: true,
        function: true,
      };
    }
    return config;
  }
  routetonextpage(data) {
    // this.routetonext=true
    this.recon_id = data.id;
    this.mainpage = false;
    this.file_id = data.id;
    this.file1_type = data.file1_type;
    this.file2_type = data.file2_type;
    this.uploadshow = true;
    console.log(this.file_id, "id");
    console.log(this.file1_type, "file1_type");
    console.log(this.file2_type, "file2_type");
    if (this.file1_type === "UPLOAD EXCEL") {
      this.fas_uploadxl = true;
      this.fas_apicall = false;
      this.fas_dblink = false;
    }
    if (this.file1_type === "API CALL") {
      this.fas_uploadxl = false;
      this.fas_apicall = true;
      this.fas_dblink = false;
    }

    if (this.file1_type === "DB LINK") {
      this.fas_uploadxl = false;
      this.fas_apicall = false;
      this.fas_dblink = true;
    }
    if (this.file2_type === "UPLOAD EXCEL") {
      this.cbs_uploadxl = true;
      this.cbs_apicall = false;
      this.cbs_dblink = false;
    }
    if (this.file2_type === "API CALL") {
      this.cbs_uploadxl = false;
      this.cbs_apicall = true;
      this.cbs_dblink = false;
    }

    if (this.file2_type === "DB LINK") {
      this.cbs_uploadxl = false;
      this.cbs_apicall = false;
      this.cbs_dblink = true;
    }
    this.wisefinUpload.get("wisefinuploadfile").reset();
    this.wisefinUpload.get("filedata").reset();
    this.bankstmtupload.get("cbsuploadfile").reset();
    this.bankstmtupload.get("filedatas").reset();
  }
  fileuploadsummary(params) {
    this.SpinnerService.show();
    this.reconService
      .inter_file_summary(this.pagination.index, params)
      .subscribe((res) => {
        this.SpinnerService.hide();
        this.summarylists = res["data"];
        this.pagination = res.pagination;
      });
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("reconexternal"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen1() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("viewData"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("actionmodal"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  //  closedpopup() {
  //   this.closeaddpopup.nativeElement.click();
  // }
  history_status(col) {
    let config: any = {
      value: "",
    };

    if (col.status == 1) {
      config = {
        value: "Active",
      };
    } else if (col.status == 0) {
      config = {
        value: "Inactive",
      };
    } else if (col.status == 4) {
      config = {
        value: "Success",
      };
    } else if (col.status == 3) {
      config = {
        value: "Processing",
      };
    } else if (col.status == 2) {
      config = {
        value: "Started",
      };
    } else if (col.status == 10) {
      config = {
        value: "Rulefailed",
      };
    } else if (col.status) {
      config = {
        value: "",
      };
    }
    return config;
  }
  app_type(apptyp) {
    let config: any = {
      value: "",
    };

    if (apptyp.type == 4) {
      config = {
        value: "FAS",
      };
    } else if (apptyp.type == 5) {
      config = {
        value: "CBS",
      };
    } else if (apptyp.type == 6) {
      config = {
        value: "ARS",
      };
    } else if (apptyp.type) {
      config = {
        value: "",
      };
    }
    return config;
  }
  //   SummaryviewhistoryData:any = [
  //     {columnname: "Date", key: "date","type": 'date',"datetype": "dd-MMM-yyyy"},
  //       {columnname:"Type",key:"type",validate: true,validatefunction: this.app_type.bind(this),},
  //       {columnname:"GL No",key:"kd_accountno"},
  //       {columnname:"Branch Code",key:"kd_branchcode"},
  //       {columnname:"Status",key:"status",icon: "sync",style: { cursor: "pointer", color: "green" },
  //       validate: true,validatefunction: this.history_status.bind(this),function: true, button:true, clickfunction: this.viewhistory(1).bind(this)},
  //       {columnname: "Fetch Summary", key: "view", icon: "fa fa-eye",style: { cursor: "pointer", color: "green" },
  //       function: true, button:true, clickfunction: this.handleButtonClick(col.kd_accountno, col.kd_branchcode, col.date, 'Headers', 1, col ).bind(this)},
  //  ]
  // {
  //   branchcontrol : data.fasdatavalue,
  //   Transactiondatepatch : data.fasdatavalue,
  //   DebitandCredit: data.fasdatavalue,
  //   Commonfield : data.fasdatavalue,
  //   start_amount : data.fasdatavalue,
  //   AmtComparisons:data.fasdatavalue
  // }
  searchsysfasupload(data) {
    this.fassearch.patchValue(data);
    this.onChangeRBF("", 1);
  }
  compfield: any = {
    label: "Comp",
    fronentdata: true,
    data: this.Comparisons,
    displaykey: "value",
    Outputkey: "value",
    valuekey: "value",
  };
  searchsyscbsupload(data) {
    this.cbssearch.patchValue(data);
    this.onChangecbs("", 1);
  }
  searchmanfasupload(data) {
    this.fassearch.patchValue(data);
    this.onChangeRBF("", 1);
  }
  searchmancbsupload(data) {
    this.cbssearch.patchValue(data);
    this.onChangecbs("", 1);
  }
  searchuploadhistory(data) {
    this.externalhistory.patchValue(data);
    this.viewhistory(1);
  }
  file1inputdata(e) {
    console.log("event", e);
    this.mainform.patchValue({
      file1_type: e.id,
    });
  }
  file2inputdata(e) {
    console.log("event", e);
    this.mainform.patchValue({
      file2_type: e.id,
    });
  }

  dropdownOptionfas: any = {
    method: "get",
    label: "Options",
    url: this.reconurl + "reconserv/cbs_wisefine_template",
    // params:"temp_name",
    searchkey: "query",
    displaykey: "wisefinKeys",
    Outputkey: "wisefinKeys",
  };
  dropdownOptioncbs: any = {
    method: "get",
    label: "Options",
    url: this.reconurl + "reconserv/cbs_wisefine_template",
    // params:"temp_name",
    searchkey: "query",
    displaykey: "cbsKeys",
    Outputkey: "cbsKeys",
  };
  Optiondata(e) {
    console.log("optionvalue====>", e);
    this.fassearch.patchValue({
      dropdownoption: e,
    });
    // this.ddformvalue = e
  }

  summaryreset(data, pagenum) {
    //  this.params = data
    if (this.action == 2 || this.action == 4) {
      this.actionChange = true;
    } else {
      this.actionChange = false;
    }
    this.fasOrcbs = 1;
    console.log("page", pagenum);

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
    this.Amountt1 = this.fassearch.get("start_amount").value;
    console.log("data", this.Amountt1);
    this.tag = this.fassearch.get("Commonfield").value;
    this.AmtComparison = this.fassearch.get("AmtComparisons").value;

    this.params = "?page=" + pagenum;
    if (this.externalpage == true) {
      let branch_codeid = this.externalform.get("branch_code").value;
      branch_codeid ? (this.params += "&branch_code=" + branch_codeid) : "";

      let glcode_id = this.externalform.get("gl_no").value;
      glcode_id ? (this.params += "&gl_code=" + glcode_id) : "";

      let run_date = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
      run_date ? (this.params += "&run_date=" + run_date) : "";
    } else {
      let branch_codeid = this.branch_codeid;
      branch_codeid ? (this.params += "&branch_code=" + branch_codeid) : "";

      let glcode_id = this.glcode_id;
      glcode_id ? (this.params += "&gl_code=" + glcode_id) : "";

      // let iDate = this.fasfromdate_date;
      // iDate ? (params += "&process_date=" + iDate) : "";

      let run_date = this.iDate;
      run_date ? (this.params += "&run_date=" + run_date) : "";
    }
    let filterdata_id = this.filterdata_id;
    filterdata_id ? (this.params += "&type=" + filterdata_id) : "";

    // let fasbranch_code = this.branch;
    // fasbranch_code ? (params += "&branch_code=" + fasbranch_code) : "";

    let tag = this.tag;
    tag ? (this.params += "&tagno=" + tag) : "";

    let action = this.action;
    action ? (this.params += "&action=" + action) : "";

    let AmtComparison = this.AmtComparison;
    AmtComparison ? (this.params += "&comparison=" + AmtComparison) : "";

    let fasenddate_date = this.fasenddate_date;
    fasenddate_date ? (this.params += "&to_date=" + fasenddate_date) : "";

    let fasgl_number = this.fasgl_number;
    fasgl_number ? (this.params += "&gl_code=" + fasgl_number) : "";

    let Transactiondatepatch1 = this.Transactiondatepatch1;
    Transactiondatepatch1
      ? (this.params += "&trans_date=" + Transactiondatepatch1)
      : "";

    let DebitandCredit1 = this.DebitandCredit1;
    DebitandCredit1 ? (this.params += "&dr_cr=" + DebitandCredit1) : "";

    let fasothers = this.fasothers;
    fasothers ? (this.params += "&filters=" + fasothers) : "";

    let Amountt1 = this.Amountt1;
    Amountt1 ? (this.params += "&start_amount=" + Amountt1) : "";

    let entry_gid = this.fassearch.get("entry_gid").value;
    entry_gid ? (this.params += "&entry_gid=" + entry_gid) : "";

    let entry_crno = this.fassearch.get("entry_crno").value;
    entry_crno ? (this.params += "&entry_crno=" + entry_crno) : "";

    let entry_module = this.fassearch.get("entry_module").value;
    entry_module ? (this.params += "&entry_module=" + entry_module) : "";

    let remark = this.fassearch.get("remark").value;
    remark ? (this.params += "&remark=" + remark) : "";

    let temp_name = this.fetch_template_name;
    temp_name ? (this.params += "&temp_name=" + temp_name) : "";

    let value = this.externalvalue;
    // value ? (params += "&value=" + value): "";
    let recon_type = this.recon_id;

    this.get_FAS_CBS_data(this.params, value);

    this.payloadd = {
      dict_val: [],
    };
    this.SpinnerService.show();
    this.reconService
      .MatchingData(this.params, recon_type, value, this.payloadd)
      .subscribe((res) => {
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
              this.SpinnerService.hide();
              // this.notification.showInfo("No Records in FAS Table!");
              this.tabledataManual = [];
              this.nodatafoundfas = true;
            } else {
              this.tabledataManual = res["data"];
              this.SpinnerService.hide();
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
                    value: item.fas_action?.id, // Assuming fas_action is always present
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

              console.log("payload array", this.payloadArray);

              // this.nodatafoundfas = false;
            }
          } else {
            if (res.code) {
              // this.notification.showInfo("No Records in FAS Table!");
              this.SpinnerService.hide();
              this.tabledata = [];
              // this.nodatafoundfas = true;
            } else {
              this.tabledata = res["data"];

              this.SpinnerService.hide();

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
          this.SpinnerService.hide();
        }
      });
    // this.inputField.nativeElement.innerHTML = '';
    this.fassearch.reset();
    this.fassytammatchsearchlist = [];
    this.fasOrcbs = "";

    this.SpinnerService.hide();

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
  summaryreset1(data, pagenum) {
    this.fasOrcbs = 2;
    // if(this.externalpage == true){
    //   this.filterdata_id = 1
    // }

    if (this.action == 2 || this.action == 4) {
      this.actionChange = true;
    } else {
      this.actionChange = false;
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
      let branch_codeid = this.branch_codeid;
      branch_codeid ? (params += "&branch_code=" + branch_codeid) : "";

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
    // value ? (params += "&value=" + value): "";
    let recon_type = this.recon_id;
    if (
      this.ars_status == "System Match Done" ||
      this.ars_status == "Reconciled" ||
      this.ars_status == "PASSED GEFU" ||
      this.ars_status == "PASSED JW" ||
      this.ars_status == "Manual Match Pending" ||
      this.externalvalue == 0
    ) {
      let value = this.externalvalue;
      this.payloads = {
        dict_val: [],
      };
      this.SpinnerService.show();
      this.reconService
        .Matchingcbsdata(params, recon_type, value, this.payloads)
        .subscribe((res) => {
          this.SpinnerService.hide();
          if (this.filterdata_id == 2) {
            // this.url = this.ip + "brsserv/ARS_Dropdown"+"&value="+this.fasOrcbs;

            // this.url= this.url + '&value='+this.fasOrcbs;
            //  this.url= this.url + '?value=' + this.fasOrcbs;

            if (res.code) {
              this.SpinnerService.hide();
              this.nodatafoundcbs = true;
              // this.notification.showInfo("No Records in CBS Table!");
              this.cbstabledataManual = [];
            } else {
              this.cbstabledataManual = res["data1"];
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
                    value: item.cbs_action?.id, // Assuming fas_action is always present
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

              this.SpinnerService.hide();
              console.log("payload array", this.payloadArray);

              // this.nodatafoundcbs = false;
            }
          } else {
            if (res.code) {
              this.SpinnerService.hide();
              this.nodatafoundcbs = true;
              // this.notification.showInfo("No Records in CBS Table!");
              this.cbstabledata = [];
            } else {
              this.cbstabledata = res["data1"];
              this.SpinnerService.hide();
              this.nodatafoundcbs = false;
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
      this.cbssytammatchsearchlist = [];
      this.fasOrcbs = "";
      // this.inputField.nativeElement.innerHTML = '';
    } else if (this.ars_status == "Pending") {
      this.cbstabledataManual = [];
      this.cbstabledata = [];
      this.SpinnerService.hide();
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
  resethistory() {
    this.viewhistory(1);
    this.externalhistory.reset();
  }

  resetsummary() {
    this.mainform.reset();
    this.restformfile1 = [];
    this.restformfile2 = [];
  }
  customizeordefault(value, id) {
    this.showcustomizereport = value;
    if (value) {
      this.getreportsummary();
    } else {
      this.reportcreation.reset();
    }
    this.defaultorcustomfunction(id);
  }
  addtosummary() {
    this.reportcreation.value.recon_type = this.recon_id;
    this.reportcreation.value.recon_flag = this.dcs_recon;
    console.log(this.reportcreation.value);
    let array = [];
    array.push(this.reportcreation.value);
    this.SpinnerService.show();
    this.reconService.Addreport(array).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.reportcreation.reset();
        this.getreportsummary();
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  get_report_summary_datas = [
    { columnname: "File 1", key: "fas_col" },
    { columnname: "File 1 Cr/Dr", key: "fas_cr_dr" },
    { columnname: "File 2", key: "cbs_col" },
    { columnname: "File 2 Cr/Dr", key: "cbs_cr_dr" },
    { columnname: "Remark", key: "report_remark" },
    {
      columnname: "Delete",
      icon: "delete",
      style: { color: "rgb(219, 121, 121)", cursor: "pointer" },
      button: true,
      key: "delete",
      function: true,
      clickfunction: this.deletereport.bind(this),
    },
  ];
  getreportsummary() {
    this.get_report_summary = {
      method: "get",
      url: this.ip + "reconserv/customize_report",
      params: "&recon_type=" + this.recon_id+"&dcs_recon="+this.dcs_recon,
    };
  }
  defaultorcustomfunction(id) {
    let data = {
      type: id,
      id: this.recon_id,
      recon_flag:this.dcs_recon
    };
    this.SpinnerService.show();
    this.reconService.defaultorcustomize(data).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.SummaryApinterintegrityObjNew = {
          method: "get",
          url: this.reconurl + "reconserv/multi_integrity_uploads",
          params:'&dcs_recon='+this.dcs_recon ,
        };
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  deletereport(data) {
    this.SpinnerService.show();
    this.reconService.deletereconreport(data.id).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.getreportsummary();
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  statementreport() {
    this.reconService
      .statement_download(this.particular_recon_id)
      .subscribe((res) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(res);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download =
          "Statement Report" +
          this.datepipe.transform(new Date(), "dd/MM/yyyy") +
          ".xlsx";
        link.click();
      });
  }
  fasconsolidate(event) {
    console.log(event);
    if (event.checked === true) {
      this.fas_consolidate_id = 1;
    } else {
      this.fas_consolidate_id = 0;
    }
  }
  cbsconsolidate(event) {
    console.log(event);
    if (event.checked === true) {
      this.cbs_consolidate_id = 1;
    } else {
      this.cbs_consolidate_id = 0;
    }
  }
  editrecon(data) {
    var myModal = new (bootstrap as any).Modal(document.getElementById("edit_recon"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();

    this.edit_recon_datas = data;
    this.editform.get("template_name").patchValue(data.integrity_name);
    this.cbs_consolidate_id = data.cbs_file_type;
    this.fas_consolidate_id = data.fas_file_type;
    for (let x of this.inputdataarray) {
      if (data.file1_type === x.file1_type) {
        this.editform.patchValue({
          file1_type: x.id,
        });
      }
      if (data.file2_type === x.file1_type) {
        this.editform.patchValue({
          file2_type: x.id,
        });
      }
    }
    console.log(data);
  }
  updaterecon() {
    this.editform.value.cbs_file_type = this.cbs_consolidate_id;
    this.editform.value.fas_file_type = this.fas_consolidate_id;
    this.editform.value.id = this.edit_recon_datas.id;
    this.editform.value.recon_flag = this.dcs_recon;
    this.SpinnerService.show();
    this.reconService.svae_inegrity(this.editform.value).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.SummaryApinterintegrityObjNew = {
          method: "get",
          url: this.reconurl + "reconserv/multi_integrity_uploads",
          params:'&dcs_recon='+this.dcs_recon ,
        };
        this.editform.reset();
        this.fas_consolidate_form.reset();
        this.cbs_consolidate_form.reset();
        this.cbs_consolidate_id = 0;
        this.fas_consolidate_id = 0;
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  api_search(type) {
    this.type = type;
    let value = this.apicallsearch.value;
    console.log(value, "value");
    let params = "";
    if (value.api_name) {
      params += "&api_name=" + value.api_name;
    }
    if (value.methods) {
      params += "&methods=" + value.methods;
    }
    if (value.status) {
      params += "&status=" + value.status;
    }
    this.getapicallsummary(params);
    this.popupopenapicall();
  }
  getapicallsummary(params) {
    this.SpinnerService.show();
    this.interService
      .getapi_summary(this.paginationapi.index, params)
      .subscribe((res) => {
        this.SpinnerService.hide();
        this.apisummararray = res["data"];
        this.paginationapi = res.pagination;
      });
  }
  popupopenapicall() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("apicallpopup"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  db_search(type) {
    this.dbtype = type;
    let value = this.dblinksearch.value;
    console.log(value, "value");
    let params = "";
    if (value.db_name) {
      params += "&db_name=" + value.db_name;
    }
    if (value.username) {
      params += "&user_name=" + value.username;
    }
    this.dbsummary(params);
    this.popupopendb();
  }
  dbsummary(params) {
    this.SpinnerService.show();
    this.interService
      .dbsummary(this.paginationdb.index, params)
      .subscribe((res) => {
        this.SpinnerService.hide();
        this.dbsummararray = res["data"];
        this.paginationdb = res.pagination;
        console.log(this.dbsummararray, "dbsummararray");
      });
  }
  popupopendb() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("dblinkpopup"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  apicall_submit() {
    let validation = this.apicallcreationform.value;
    if (
      validation.api_name === "" ||
      validation.api_name === null ||
      validation.api_name === undefined
    ) {
      this.notification.showError("Enter Api Name");
      return;
    }
    if (
      validation.api_url === "" ||
      validation.api_url === null ||
      validation.api_url === undefined
    ) {
      this.notification.showError("Enter Api Url");
      return;
    }
    if (
      validation.methods === "" ||
      validation.methods === null ||
      validation.methods === undefined
    ) {
      this.notification.showError("Choose Methods");
      return;
    }
    if (
      validation.params === "" ||
      validation.params === null ||
      validation.params === undefined
    ) {
      this.notification.showError("Enter Params");
      return;
    }
    if (
      validation.payloads === "" ||
      validation.payloads === null ||
      validation.payloads === undefined
    ) {
      this.notification.showError("Enter Payload");
      return;
    }
    if (
      validation.description === "" ||
      validation.description === null ||
      validation.description === undefined
    ) {
      this.notification.showError("Enter Description");
      return;
    }
    let value = this.apicallcreationform.value;
    console.log("value", value);
    if (value.payloads) {
      try {
        value.payloads = JSON.parse(value.payloads);
      } catch (error) {
        console.error("Error parsing payloads:", error);
      }
    }
    if (value.params) {
      try {
        value.params = JSON.parse(value.params);
      } catch (error) {
        console.error("Error parsing payloads:", error);
      }
    }

    this.interService.apicall_creation(value).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.apicallcreationform.reset();
        this.closebuttonclosedapi.nativeElement.click();
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  api_reset() {
    this.apicallsearch.reset();
    this.api_search(this.type);
  }
  editapicalls(data) {
    this.apicall_id = data.id;
    this.closebuttonclosedapi.nativeElement.click();
    this.apicallupdateform.patchValue({
      api_url: data.api_url,
      payloads: data.payoads,
      api_name: data.api_name,
      params: data.params,
      methods: data.methods,
      description: data.description,
    });
    this.popupopenapiedit();
  }
  popupopenapiedit() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("editapicall"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  apicallaction(sum) {
    console.log(sum, "sum");
    this.autokdate1 = this.datepipe.transform(
      this.externalform.controls["date"].value,
      "yyyy-MM-dd"
    );
    let payload = {
      api_name: sum.api_name,
      api_url: sum.api_url,
      methods: sum.methods,
      params: sum.params,
      payloads: sum.payoads,
      type: this.type,
      date: this.autokdate1,
      temp_name: this.template_name,
      int_type: this.file_id,
    };
    console.log(payload);
    this.SpinnerService.show();
    this.interService.apicall_action(payload).subscribe((res) => {
      this.SpinnerService.hide();
      console.log(res);
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.closebuttonclosedapi.nativeElement.click();
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  prevpageapi() {
    this.paginationapi.index = this.paginationapi.index - 1;
    this.api_search(this.type);
  }
  nextpageapi() {
    this.paginationapi.index = this.paginationapi.index + 1;
    this.api_search(this.type);
  }
  apicall_update() {
    let validation = this.apicallupdateform.value;
    if (
      validation.api_name === "" ||
      validation.api_name === null ||
      validation.api_name === undefined
    ) {
      this.notification.showError("Enter Api Name");
      return;
    }
    if (
      validation.api_url === "" ||
      validation.api_url === null ||
      validation.api_url === undefined
    ) {
      this.notification.showError("Enter Api Url");
      return;
    }
    if (
      validation.methods === "" ||
      validation.methods === null ||
      validation.methods === undefined
    ) {
      this.notification.showError("Choose Methods");
      return;
    }
    if (
      validation.params === "" ||
      validation.params === null ||
      validation.params === undefined
    ) {
      this.notification.showError("Enter Params");
      return;
    }
    if (
      validation.payloads === "" ||
      validation.payloads === null ||
      validation.payloads === undefined
    ) {
      this.notification.showError("Enter Payload");
      return;
    }
    if (
      validation.description === "" ||
      validation.description === null ||
      validation.description === undefined
    ) {
      this.notification.showError("Enter Description");
      return;
    }

    let value = this.apicallupdateform.value;
    console.log("value", value);
    if (value.payloads) {
      try {
        value.payloads = JSON.parse(value.payloads);
      } catch (error) {
        console.error("Error parsing payloads:", error);
      }
    }
    if (value.params) {
      try {
        value.params = JSON.parse(value.params);
      } catch (error) {
        console.error("Error parsing payloads:", error);
      }
    }
    value.id = this.apicall_id;
    this.interService.apicall_creation(value).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.apicallupdateform.reset();
        this.closeapicalledit.nativeElement.click();
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  dblinktabchange(event) {
    this.viewtabchange = event.tab.textLabel;
    console.log("ssssss", this.viewtabchange);
    if (this.viewtabchange === "DB Link Summary") {
    }
    if (this.viewtabchange === "Run summary") {
      this.getdblinkrunsummary();
    }
  }
  getdblinkrunsummary() {
    this.SpinnerService.show();
    this.interService
      .dblink_runintegrity(this.file_id, this.paginationdbrun.index)
      .subscribe((res) => {
        this.SpinnerService.hide();
        this.dbrunintegrityarray = res["data"];
        console.log("dbrunintegrityarray", this.dbrunintegrityarray);
        if (res.pagination) {
          this.paginationdbrun = res.pagination;
        }
      });
  }
  dblink_submit() {
    let validation = this.dblinkcreationform.value;
    if (
      validation.ip_address === "" ||
      validation.ip_address === null ||
      validation.ip_address === undefined
    ) {
      this.notification.showError("Enter Ip Address");
      return;
    }
    if (
      validation.port === "" ||
      validation.port === null ||
      validation.port === undefined
    ) {
      this.notification.showError("Enter Port");
      return;
    }
    if (
      validation.db_name === "" ||
      validation.db_name === null ||
      validation.db_name === undefined
    ) {
      this.notification.showError("Enter Connection name");
      return;
    }
    if (
      validation.user === "" ||
      validation.user === null ||
      validation.user === undefined
    ) {
      this.notification.showError("Enter User");
      return;
    }
    if (
      validation.password === "" ||
      validation.password === null ||
      validation.password === undefined
    ) {
      this.notification.showError("Enter Password");
      return;
    }
    let value = this.dblinkcreationform.value;
    console.log("value", value);
    this.SpinnerService.show();
    this.interService.db_linkcreation(value).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.db_search(this.dbtype);
        this.dblinkcreationform.reset();
        this.closebuttonclosed1.nativeElement.click();
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  db_reset() {
    this.dblinksearch.reset();
    this.db_search(this.dbtype);
  }
  toggledbtemp(data) {
    console.log(data);
    let status: any = "";
    if (data.status === 0) {
      status = 1;
    } else {
      status = 0;
    }
    this.interService.dblink_statuschange(data.id, status).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.db_search(this.dbtype);
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  editdblinks(data) {
    this.dblink_id = data.id;
    this.closebuttonclosed1.nativeElement.click();
    this.dblinkupdateform.patchValue({
      ip_address: data.ip_address,
      port: data.port,
      db_name: data.db_name,
      user: data.user,
      password: data.password,
    });
    this.popupopendbedit();
  }
  popupopendbedit() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("editdblink"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopendbquerry() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("dbquerry"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  dbgetquery(data) {
    this.clearfullquery();
    this.closebuttonclosed1.nativeElement.click();
    console.log(data, "data");
    this.dbpassword = data.password;
    this.dbusername = data.user;
    this.dbport = data.port;
    this.dbipaddress = data.ip_address;

    this.schemadropdown();
    this.popupopendbquerry();
  }
  clearfullquery() {
    this.dbqueryform.reset();
    let formArray = this.dbqueryform.get("conditions") as FormArray;
    formArray.clear();
    this.dbqueryform.get("select").patchValue("select *");
    this.tablearray = [];
    this.wherearray = [];
    this.selectedColumns = [];
  }
  schemadropdown() {
    this.interService
      .dbschema(
        this.dbusername,
        this.dbpassword,
        this.dbport,
        this.dbipaddress,
        1,
        ""
      )
      .subscribe((res) => {
        this.schemaarray = res["schemas"];
      });
  }
  prevpage1() {
    this.paginationdb.index = this.paginationdb.index - 1;
    this.db_search(this.dbtype);
  }

  nextpage2() {
    this.paginationdb.index = this.paginationdb.index + 1;
    this.db_search(this.dbtype);
  }
  deletesummaryid(data) {
    console.log(data.id, "id");
    this.interService.delete_dblink_summary(data.id).subscribe((res) => {
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.closebuttonclosed1.nativeElement.click();
        this.getdblinkrunsummary();
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  prevpageadrun() {
    this.paginationdbrun.index = this.paginationdbrun.index - 1;
    this.getdblinkrunsummary();
  }
  nextpagedbrun() {
    this.paginationdbrun.index = this.paginationdbrun.index + 1;
    this.getdblinkrunsummary();
  }
  dblink_update() {
    let validation = this.dblinkupdateform.value;
    if (
      validation.ip_address === "" ||
      validation.ip_address === null ||
      validation.ip_address === undefined
    ) {
      this.notification.showError("Enter Ip Address");
      return;
    }
    if (
      validation.port === "" ||
      validation.port === null ||
      validation.port === undefined
    ) {
      this.notification.showError("Enter Port");
      return;
    }
    if (
      validation.db_name === "" ||
      validation.db_name === null ||
      validation.db_name === undefined
    ) {
      this.notification.showError("Enter Connection name");
      return;
    }
    if (
      validation.user === "" ||
      validation.user === null ||
      validation.user === undefined
    ) {
      this.notification.showError("Enter User");
      return;
    }
    if (
      validation.password === "" ||
      validation.password === null ||
      validation.password === undefined
    ) {
      this.notification.showError("Enter Password");
      return;
    }
    let value = this.dblinkupdateform.value;
    console.log("value", value);
    value.id = this.dblink_id;
    this.SpinnerService.show();
    this.interService.db_linkcreation(value).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.status) {
        this.notification.showSuccess(res.message);
        this.db_search(this.dbtype);
        this.dblinkupdateform.reset();
        this.closedblinkedit.nativeElement.click();
      } else {
        this.notification.showError(res.description);
      }
    });
  }
  schemavalidate() {
    this.dbqueryform.get("table_name").reset();
    this.dbqueryform.get("where").reset();
    this.interService
      .dbschema(
        this.dbusername,
        this.dbpassword,
        this.dbport,
        this.dbipaddress,
        1,
        this.schema_input.nativeElement.value
      )
      .subscribe((res) => {
        this.schemaarray = res["schemas"];
      });
  }
  autocompletewisefinxlScroll() {
    this.hasschema_next = true;
    this.hasschema_previous = true;
    this.current_schema_page = this.current_schema_page + 1;
    setTimeout(() => {
      if (this.schemaref && this.autocompleteTrigger && this.schemaref.panel) {
        fromEvent(this.schemaref.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.schemaref.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.schemaref.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.schemaref.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.schemaref.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hasschema_next === true) {
                // this.schema_input.nativeElement.value
                this.interService
                  .dbschema(
                    this.dbusername,
                    this.dbpassword,
                    this.dbport,
                    this.dbipaddress,
                    this.current_schema_page,
                    this.schema_input.nativeElement.value
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["schemas"];

                    this.schemaarray = this.schemaarray.concat(datas);
                    this.current_schema_page = this.current_schema_page + 1;
                  });
              }
            }
          });
      }
    });
  }
  schemaselect(data) {
    this.schemavalue = data;
    this.dbqueryform
      .get("select")
      .patchValue("select * from " + this.schemavalue);
    this.dbqueryform.get("table_name").reset();
    this.dbqueryform.get("where").reset();
    this.selectedColumns = [];
    this.tablearray = [];
    this.wherearray = [];
    let formArray = this.dbqueryform.get("conditions") as FormArray;
    formArray.clear();
    this.interService
      .dbtable(
        this.dbusername,
        this.dbpassword,
        this.dbport,
        this.dbipaddress,
        this.schemavalue,
        1,
        ""
      )
      .subscribe((res) => {
        this.tablearray = res["tables"];
      });
  }
  checkshecma() {
    let value = this.dbqueryform.get("schema").value;
    if (value === "" || value === null || value === undefined) {
      this.notification.showWarning("Select Schema");
      return;
    }
  }
  searchtable() {
    this.interService
      .dbtable(
        this.dbusername,
        this.dbpassword,
        this.dbport,
        this.dbipaddress,
        this.schemavalue,
        1,
        this.table_input.nativeElement.value
      )
      .subscribe((res) => {
        this.tablearray = res["tables"];
      });
  }
  autocompletetableScroll() {
    this.hastable_next = true;
    this.current_table_page = this.current_table_page + 1;
    setTimeout(() => {
      if (
        this.tableref &&
        this.autocompletetableTrigger &&
        this.tableref.panel
      ) {
        fromEvent(this.tableref.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.tableref.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetableTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.tableref.panel.nativeElement.scrollTop;
            const scrollHeight = this.tableref.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.tableref.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hasschema_next === true) {
                // this.schema_input.nativeElement.value
                this.interService
                  .dbtable(
                    this.dbusername,
                    this.dbpassword,
                    this.dbport,
                    this.dbipaddress,
                    this.schemavalue,
                    this.current_table_page,
                    this.table_input.nativeElement.value
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["tables"];

                    this.tablearray = this.tablearray.concat(datas);
                    this.current_table_page = this.current_table_page + 1;
                  });
              }
            }
          });
      }
    });
  }
  tableselect(data) {
    this.tablevalue = data;
    this.dbqueryform
      .get("select")
      .patchValue("select * from " + this.schemavalue + "." + this.tablevalue);
    this.dbqueryform.get("where").reset();
    this.selectedColumns = [];
    this.wherearray = [];
    let formArray = this.dbqueryform.get("conditions") as FormArray;
    formArray.clear();
    this.interService
      .dbwhere(
        this.dbusername,
        this.dbpassword,
        this.dbport,
        this.dbipaddress,
        this.schemavalue,
        this.tablevalue,
        1
      )
      .subscribe((res) => {
        this.wherearray = res["columns"];
      });
  }
  checktable_schema() {
    let value = this.dbqueryform.get("schema").value;
    if (value === "" || value === null || value === undefined) {
      this.notification.showWarning("Select Schema");
      return;
    }
    let table = this.dbqueryform.get("table_name").value;
    if (table === "" || table === null || table === undefined) {
      this.notification.showWarning("Select table");
      return;
    }
  }
  toggleSelection(column: string, event: MouseEvent) {
    event.stopPropagation();
    // this.columnvalue=column
    if (this.selectedColumns.includes(column)) {
      this.selectedColumns = this.selectedColumns.filter((c) => c !== column);
    } else {
      this.selectedColumns.push(column);
    }

    this.dbqueryform.get("where")?.patchValue(this.selectedColumns.join(", "));
    if (this.selectedColumns.length > 0) {
      this.dbqueryform
        .get("select")
        .patchValue(
          "select " +
            this.selectedColumns.join(", ") +
            " from " +
            this.schemavalue +
            "." +
            this.tablevalue
        );
    }
    if (this.selectedColumns.length === 0) {
      this.dbqueryform
        .get("select")
        .patchValue(
          "select * from " + this.schemavalue + "." + this.tablevalue
        );
    }
  }
  adddbconditions() {
    let value = this.dbqueryform.get("schema").value;
    if (value === "" || value === null || value === undefined) {
      this.notification.showWarning("Select Schema");
      return;
    }
    let table = this.dbqueryform.get("table_name").value;
    if (table === "" || table === null || table === undefined) {
      this.notification.showWarning("Select table");
      return;
    }
    let validate = this.dbqueryform.get("conditions").value;
    for (let x of validate) {
      let index = validate.findIndex((item) => item === x);
      if (x.con === "" || x.column === "" || x.value === "") {
        this.notification.showWarning(
          "Fill condition " + (index + 1) + " datas to add another condition"
        );
        return;
      }
    }
    let form;
    if (this.conditions.length === 0) {
      form = this.fb.group({
        con: [""],
        column: [""],
        value: [""],
      });
      form.array = ["where"];
    }
    if (this.conditions.length > 0) {
      form = this.fb.group({
        con: [""],
        column: [""],
        value: [""],
      });
      form.array = ["AND", "OR", "None"];
    }

    this.conditions.push(form);
  }
  get conditions() {
    return this.dbqueryform.controls["conditions"] as FormArray;
  }
  deleteLesson(lessonIndex: number) {
    this.conditions.removeAt(lessonIndex);
    this.conditionadd();
  }
  conditionadd() {
    let conditionsArray = this.dbqueryform.get("conditions").value;
    console.log(conditionsArray);
    let queryBase;
    if (this.selectedColumns.length > 0) {
      queryBase =
        "select " +
        this.selectedColumns.join(", ") +
        " from " +
        this.schemavalue +
        "." +
        this.tablevalue;
    }
    if (this.selectedColumns.length === 0) {
      queryBase = "select * from " + this.schemavalue + "." + this.tablevalue;
    }
    let conditionParts = [];

    for (let condition of conditionsArray) {
      if (condition.value) {
        conditionParts.push(
          ` ${condition.con} ${condition.column} = ${condition.value}`
        );
      } else {
        conditionParts.push(` ${condition.con} ${condition.column}`);
      }
    }
    let whereClause =
      conditionParts.length > 0 ? "" + conditionParts.join("") : "";

    let finalQuery = queryBase + whereClause;

    this.dbqueryform.get("select").patchValue(finalQuery.trim());
  }
  executequery() {
    let query = this.dbqueryform.get("select").value;
    console.log(typeof query);

    this.autokdate1 = this.datepipe.transform(
      this.externalform.controls["date"].value,
      "yyyy-MM-dd"
    );
    this.interService
      .executequery(
        this.dbusername,
        this.dbpassword,
        this.dbport,
        this.dbipaddress,
        query,
        this.dbtype,
        this.autokdate1,
        this.template_name,
        this.file_id
      )
      .subscribe((res) => {
        console.log(res);
        let response = res["data"];
        if (response) {
          this.notification.showSuccess(response[0].key);
          this.closebuttonclosedqueery.nativeElement.click();
        }
        if (res.description) {
          this.notification.showError(res.description);
        }
      });
  }
  fileInputs: { file: File | null }[] = [{ file: null }];
  
  addFileInput() {
    const index = this.fileInputs.length;
    this.fileInputs.push({ file: null });
    this.wisefinUpload.addControl("wisefinuploadfile", new FormControl(null));
  }

  uploadfileArray: File[] = []; 

  uploadchooses1(event: any, index: number) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      console.error("Invalid file type. Please upload an XLSX file.");
      this.notification.showError("Unsupported file type");
      this.wisefinUpload.get("wisefinuploadfile").reset();
      return;
    }
    this.uploadfileArray[index] = selectedFile;
    this.wisefinUpload.get("filedata").setValue(this.uploadfileArray);
    console.log("Files array:", this.uploadfileArray);
  }

  removeFile(index: number) {
    if(this.fileInputs.length===1){
      this.notification.showError('At least one file needs to be upload')
      return
    }
    this.fileInputs.splice(index, 1);
    this.uploadfileArray.splice(index, 1);
    this.wisefinUpload.removeControl("wisefinuploadfile");
  }
  submitFiles() {
    if(this.uploadfileArray.length===0){
      this.notification.showError('At least one file needs to be upload')
      return
    }
    if (this.currentUser == "admin") {
      this.branchCodeEmp = this.brsconcile.controls["branch"].value;
    } else {
      this.branchCodeEmp = this.empbranchid;
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

    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
      this.int_dict = {
        gl_branch: this.branch_codeid,
        gl_code: this.glcode_id,
        date: this.iDate,
        value: this.externalvalue,
        recon_type: this.recon_id,
      };
      console.log(this.int_dict);
    }
    this.int_dict["type"] = 4;
    this.int_dict["multi_gl"] = this.multiplecheckbox;
    this.int_dict["comp_gl"] = this.compareglcheckbox;
    if (
      this.template_name == "" ||
      this.template_name == undefined ||
      this.template_name == null
    ) {
      this.int_dict["temp_name"] = "";
    } else {
      this.int_dict["temp_name"] = this.template_name;
    }
    console.log(this.int_dict);
    {
      this.reconService
        .glUploadSchedule1(
          this.int_dict,
          this.int_gl,
          this.uploadfileArray
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

              this.getSchedulerstatus();
              this.wisefinUpload.get("wisefinuploadfile").reset();
              this.wisefinUpload.get("filedata").reset();
              this.uploadfileArray=[]
            } else {
              this.notification.showError(results.code);
              
            }
          },
          (error) => {
            this.SpinnerService.hide();
          }
        );
    }
  }

  //cbs file multiple upload

  fileInputss: { file: File | null }[] = [{ file: null }];
  addFileInputs() {
    const index = this.fileInputss.length;
    this.fileInputss.push({ file: null });
    this.bankstmtupload.addControl("cbsuploadfile", new FormControl(null));
  }

  uploadfileArrays: File[] = []; // Store multiple files

  uploadchoosess1(event: any, index: number) {
    const selectedFiles = event.target.files[0];

    if (!selectedFiles) return;

    const fileExtension = selectedFiles.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      console.error("Invalid file type. Please upload an XLSX file.");
      this.notification.showError("Unsupported file type");
      this.bankstmtupload.get("cbsuploadfile").reset();
      return;
    }
    this.uploadfileArrays[index] = selectedFiles;
    // this.bankstmtupload.get("filedatas").setValue(this.uploadfileArrays);
    console.log("Files array:", this.uploadfileArrays);
  }

  removeFiles(index: number) {
    if(this.fileInputss.length===1){
      this.notification.showError('At least one file needs to be upload')
      return
    }
    this.fileInputss.splice(index, 1);
    this.uploadfileArrays.splice(index, 1);
    this.bankstmtupload.removeControl("cbsuploadfile");
  }
  submitFiless() {
    if(this.uploadfileArrays.length===0){
      this.notification.showError('At least one file needs to be upload')
      return
    }
    if (this.currentUser == "admin") {
      this.branchCodeEmp = this.brsconcile.controls["branch"].value;
    } else {
      this.branchCodeEmp = this.empbranchid;
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

    if (this.externalpage == true) {
      this.branch_codeid = this.externalform.get("branch_code").value;
      this.glcode_id = this.externalform.get("gl_no").value;
      this.iDate = this.datepipe.transform(
        this.externalform.get("date").value,
        "yyyy-MM-dd"
      );
      this.int_dict = {
        gl_branch: this.branch_codeid,
        gl_code: this.glcode_id,
        date: this.iDate,
        value: this.externalvalue,
        recon_type: this.recon_id,
      };
      console.log(this.int_dict);
    }
    this.int_dict["type"] = 5;
    this.int_dict["multi_gl"] = this.multiplecheckbox;
    this.int_dict["comp_gl"] = this.compareglcheckbox;
    if (
      this.template_name == "" ||
      this.template_name == undefined ||
      this.template_name == null
    ) {
      this.int_dict["temp_name"] = "";
    } else {
      this.int_dict["temp_name"] = this.template_name;
    }
    console.log(this.int_dict);
    {
      this.reconService
        .bankstatementUplaodSchedule2(
          this.int_gl,
          this.int_dict,
          this.uploadfileArrays
          // this.bankstmtupload.get("filedata").value
        )
        .subscribe(
          (results) => {
            this.SpinnerService.hide();
            this.pagination = results.pagination
              ? results.pagination
              : this.pagination;
            if (results.status == "success") {
              this.schudulers = "schedule";
              this.cbs_file = results;
              this.notification.showSuccess("SUCCESSFULLY UPLOAD");

              this.getSchedulerstatus();
              this.resetModal(); 
              this.uploadfileArrays=[]
              this.bankstmtupload.get("cbsuploadfile").reset();
              this.bankstmtupload.get("filedatas").reset();
            } else {
              this.notification.showError(results.code);
            }
          },
          (error) => {
            this.SpinnerService.hide();
          }
        );
    }
  }
  matchorunmatch(value,id){
    // this.showcustomizereport=value
    let data={
      "type":id,
      "id":this.recon_id,
      "recon_flag":this.dcs_recon
    }
    this.SpinnerService.show()
    this.reconService.matchandunmatch_api(data).subscribe(res=>{
      this.SpinnerService.hide()
      if(res.status){
        this.notification.showSuccess(res.message)
        this.SummaryApinterintegrityObjNew = {
          method: "get",
          url: this.reconurl + "reconserv/multi_integrity_uploads",
          params:'&dcs_recon='+this.dcs_recon ,
          }
      }else{
        this.notification.showError(res.description)
      }
    })
  }
  choosetempname(event){
    if(event){
      this.getData(event.template_name)
    }
    // else{
    //   this.report_templateform.get('fas_column').reset()
    //   this.report_templateform.get('cbs_column').reset()
    // }

  }
  getData(name)
  {
    let payload = {
      "name" : name
    }
    this.SpinnerService.show()
    this.reconService.recon_report_template(payload).subscribe(results =>{
      this.SpinnerService.hide()
      console.log(results)
      this.wisefine_array=results
      // this.wisefine_array=results['wisefin']
      // this.cbs_array=results['cbs']
      
    })

  }
  submit_template_fields(){
    if(this.selected_array.length===0){
      this.notification.showError('columns is empty')
      return
    }
    console.log(this.report_templateform.value)
    let x =this.report_templateform.value
    x.id=this.recon_id
    x.temp_name=this.report_templateform.get('temp_name').value.template_name
    x.recon_flag=this.dcs_recon
    x.fas_column=this.selected_array
    this.reconService.submit_template_name(x).subscribe(res=>{
      if(res.status){
        this.notification.showSuccess(res.message)
        this.SummaryApinterintegrityObjNew = {
          method: "get",
          url: this.reconurl + "reconserv/multi_integrity_uploads",
          params:'&dcs_recon='+this.dcs_recon ,
          }
      }else{
        this.notification.showError(res.description)
      }
    })
  }

  resetModal() {
    this.fileInputss = [{ file: null }]; 
    this.fileInputs = [{ file: null }];
    this.uploadfileArray = [];
    this.uploadfileArrays = []; 
    this.bankstmtupload.reset(); 
    this.wisefinUpload.reset();
  }
  cancelUpload() {
    this.resetModal();
  }
  fileuploadpopup(data) {
    var myModal = new (bootstrap as any).Modal(document.getElementById(data), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  reconordcs_toggle(id) {
    if (id === 1) {
    this.dcs_recon_form=true
    this.recon_tab=true
    this.dcs_tab=false
    this.showToggle1=true
    this.showToggle2=false
    this.showToggle3=false
    this.recon_process=false;
    this.mainscreen=true;
    this.dcs_recon =0
   this.uploadsearch[0].label='Recon Name'
   this.SummaryApinterintegrityObjNew = {
    method: "get",
    url: this.reconurl + "reconserv/multi_integrity_uploads",
    params:'&dcs_recon='+this.dcs_recon ,
    }
    this.SummaryinterintegrityData[0].columnname='Recon Name'
    this.template_name_api.params='&recon_ars=0' 
     this.temp_field.params='&recon_ars=0'
    }
    if (id === 2) {
    this.dcs_recon_form=true
    this.recon_tab=false
    this.dcs_tab=true
    this.showToggle1=false
    this.showToggle2=true
    this.showToggle3=false
    this.dcs_recon =1
    this.mainscreen=true;
    this.recon_process=false;
  this.uploadsearch[0].label='DCS Name'
  this.SummaryApinterintegrityObjNew = {
    method: "get",
    url: this.reconurl + "reconserv/multi_integrity_uploads",
    params:'&dcs_recon='+this.dcs_recon ,
    }
    this.SummaryinterintegrityData[0].columnname='DCS Name'
    this.template_name_api.params='&recon_ars=2' 
    this.temp_field.params='&recon_ars=2'
    }
     if (id === 3) {
    this.recon_tab=false
    this.dcs_tab=false
    this.showToggle1=false
    this.showToggle2=false
    this.showToggle3=true
    this.dcs_recon =2
    this.mainscreen=false;
    this.recon_process=true;
    this.dcs_recon_form=false
    }
  }
  getwisefinedata(name){
    this.SpinnerService.show()
    this.brsService.getwisefie_data(name).subscribe(results => {
      this.SpinnerService.hide()
      let value=results['data'][0]
      if(value?.customize_temp_wisefin===null){
        this.fas_header_name="File 1" 
      }else{
        this.fas_header_name=value.customize_temp_wisefin 
      }  
    })
    
  }
  getcbsdata(name){
    this.SpinnerService.show()
    this.brsService.getcbsdata(name).subscribe(results => {
      this.SpinnerService.hide()
     let value=results['data'][0]
     if(value?.customize_temp_cbs===null){
      this.cbs_header_name="File 2" 
    }else{
      this.cbs_header_name=value.customize_temp_cbs 
    }
    })
   
  }
  selectedarray(data){
    if(this.selected_array.includes(data)){

    }else{
      this.selected_array.push(data)
    }
  }
  remove(data){
    this.selected_array = this.selected_array.filter(x => x !== data);
  }
  file2select(event,id){
  
    if (event.checked === true) {
      this.file2array.push(id)
     } else {
       const index = this.file2array.indexOf(id);
         this.file2array.splice(index, 1);
     }
     this.file2set=this.file2array.join(',')
     if(this.file2set===''||  this.file2set===null){
      this.file2set=null
    }
     console.log(this.file2set)
  }
  file1select(event, id) {
   
    if (event.checked === true) {
     this.file1array.push(id)
    } else {
      const index = this.file1array.indexOf(id);
        this.file1array.splice(index, 1);
    }
    this.file1set=this.file1array.join(',')
    if(this.file1set==='' ||  this.file1set===null){
      this.file1set=null
    }
    console.log(this.file1set)
  }
  consolidationpopup(){
    var myModal = new (bootstrap as any).Modal(document.getElementById("consolidation"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
    this.template_name_api.params='&recon_ars=3'
    this.addfiles()
    this.getconsolidatesummary()
  }
  consolidation_select(data){
    if(this.consolidate_array.includes(data)){

    }else{
      this.consolidate_array.push(data)
    }
  }
  consolidation_remove(data){
    this.consolidate_array = this.consolidate_array.filter(x => x !== data);
  }
  consolidation_submit(){
    let temp=this.consolidation_form.get('temp_name').value?.template_name
    if(temp===''||temp===null||temp===undefined){
      this.notification.showError('choose Template')
      return
    }
    if(this.consolidate_array.length===0){
      this.notification.showError('Choose Columns')
      return
    }
    if(this.consolidatiol_file_array.length===0){
      this.notification.showError('At least one file needs to be upload')
      return
    }
    let data={
      temp_name:temp,
      grp_by:this.consolidate_array
    }
   
this.reconService.consolidate_file_upload(data,this.consolidatiol_file_array).subscribe(res=>{
  if(res.code){
    this.notification.showError(res.description)
  }else{
    this.notification.showSuccess(res.description)
    this.closeconsolidate()
  }
})

  }
  addfiles() {
    const form = this.fb.group({
        file:[''],
    });
  
    this.consil_filearray.push(form);
  }
  remove_files(i){
    if(this.consil_filearray.length===1){
      this.notification.showError('At least one file needs to be upload')
      return
    }
    this.consil_filearray.removeAt(i);
    // this.consolidatiol_file_array[i]=[]
    console.log(this.consil_filearray.value)
    
  }
  closeconsolidate(){
    this.consil_filearray.clear()
    this.consolidation_form.reset()
    this.consolidate_array=[]
    this.consolidatiol_file_array=[]
  }
  consolidatefilechoose(event: any, index: number) {
    let form= this.consolidation_form.controls["consil_filearray"] as FormArray;
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx") {
      console.error("Invalid file type. Please upload an XLSX file.");
      this.notification.showError("Unsupported file type");
      form.at(index).get("file").reset();
      return;
    }
    this.consolidatiol_file_array[index]=selectedFile
    form.at(index).get("file").setValue(selectedFile);
  }
  consolidate_summary_header = [
    { columnname: "Job Code", key: "cons_code" },
    { columnname: "No. Of Files", key: "no_of_file" },
    { columnname: "Template Name", key: "temp_name" },
    {
      columnname: "Status",
      key: "status",
      validate: true,
      validatefunction: this.status_bind.bind(this),
    },
    {
      columnname: "Download",
      icon: "download",
      style: { color: "rgb(0, 0, 0)", cursor: "pointer" },
      button: true,
      key: "download",
      function: true,
      clickfunction: this.download_consolidate_report.bind(this),
    },
  ];
  getconsolidatesummary() {
    this.get_consolidate_summary_api = {
      method: "get",
      url: this.ip + "reconserv/cons_data",
      params:'',
    };
  }
  status_bind(status){
    let config: any = {
      style: "",
      value: "",
      class: ""
    };
    if (status.status == 2) {
      config = {
        class: "",
        style: "",
        value: "Start",
      }
    }
    else if (status.status == 10){
      config = {
        class: "",
        style: "",
        value: "Failed",
      }
    }
    else if (status.status == 3){
      config = {
        class: "",
        style: "",
        value: "Processing",
      }
    }
    else if (status.status == 4){
      config = {
        class: "",
        style: "",
        value: "Success",
      }
    }
    else if (status.status == 0){
      config = {
        class: "",
        style: "",
        value: "Inactive",
      }
    }
    else if (status.status == 1){
      config = {
        class: "",
        style: "",
        value: "Active",
      }
    }
    else if (status.status){
      config = {
        class: "",
        style: "",
        value: status.status,
      }
    }
    return config
  }
  download_consolidate_report(data){
    // if(data.status!==4){
    //   this.notification.showError("Status Success only Able to Download ")
    //   return
    // }
    this.SpinnerService.show()
    this.reconService
      .download_consolidate(
        data.id
      )
      .subscribe((results) => {
        this.SpinnerService.hide()
        if(results.code){
          this.notification.showError(results.description)
        }else{
          let binaryData = [];
          binaryData.push(results);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "consolidation" + ".xlsx";
          link.click();
        }
      
      });

  }
}
