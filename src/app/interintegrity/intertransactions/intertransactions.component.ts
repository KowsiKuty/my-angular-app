import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup, FormBuilder, FormControl, FormArray } from "@angular/forms";
import { Integrityleft } from "../models/integrityleft";
import { Integrityright } from "../models/integrityright";
import { Integritydiff } from "../models/integritydiff";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { InterintegrityApiServiceService } from "../interintegrity-api-service.service";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/service/notification.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { SelectionModel } from "@angular/cdk/collections";
import { Location } from "@angular/common";
import { DatePipe } from "@angular/common";
import { IntegrityComponent } from "src/app/brs/integrity/integrity.component";
import { Autoknockoffdata } from "../models/autoknockoffdata";
import { SharedService } from "../../service/shared.service";
declare var $: any;
import { ConfirmdialogComponent } from "../confirmdialog/confirmdialog.component";
import { error } from "console";
import { AdmindialogComponent } from "./admindialog/admindialog.component";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { ToastrService } from "ngx-toastr";
import { UserdialogComponent } from "../userdialog/userdialog.component";
import { ActivatedRoute } from "@angular/router";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatCalendarCellCssClasses } from "@angular/material/datepicker";
import * as moment from "moment";
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { TaService } from "../../ta/ta.service";
import { fromEvent, of } from "rxjs";
import { event } from "jquery";
import { BrsApiServiceService } from "src/app/brs/brs-api-service.service";
import { environment } from "src/environments/environment";

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
declare var bootstrap: any;
interface ValueInputs {
  value: string;
  viewValue: string;
}
interface Item {
  name: string;
  id: string;
  value: string;
}

interface iface_typeValues {
  value: string;
  viewoption: string;
  id: number;
}

@Component({
  selector: "app-intertransactions",
  templateUrl: "./intertransactions.component.html",
  styleUrls: ["./intertransactions.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class IntertransactionsComponent implements OnInit {
  url = environment.apiURL
  integrityCheck: FormGroup;
  wisefinUpload: FormGroup;
  wisefinTbUpload: FormGroup;
  bankstmtupload: FormGroup;
  showFilters: boolean = false;
  templates: any;
  ntemplates: any;
  nbranch: any;
  uploadfile: any;
  uploadbscc: any;
  uploadjv: any;
  uploadjw: any;
  uploadfa: any;
  uploadcbcc: any;
  restformintertrans:any
  isExpandedscardinter:boolean = false
  showknockofftable: boolean = true;
  knockofflists = [];
  templateText: string
  acceptfiles = { EXCEL: '.xls, .xlsx, .xlsm, .csv' }
  isExpanded: boolean = true;
  myForm: FormGroup;
  selectedValue: Item;
  defaultValue = "non_zero";
  autokdate: any;
  endDates: any;
  showViewData: boolean = false;
  interRole: any;
  interPermission: any;
  adminUser: boolean = false;
  normalUser: boolean = false;
  startDate: any;
  endDate: any;
  statusCheck: any;
  confirmModals: boolean;
  roles: any = [];
  initialDate: any;
  dateLists: any = [];
  unqiueDates: any = [];
  filetype: number;
  activeTabIndex: 0
  activeTabIndex1: 0
  @Input() file_id: any
  @Input() file1_type: any
  @Input() file2_type: any
  @Input() integrity_name: any
  integritytranscationsearch:any
  integritytranscationsearchvar:any= "String"
  intergritytransactionfield:any
  @Output() type_id = new EventEmitter<any>();
  @ViewChild('closeintegritytransactionpopup')closeintegritytransactionpopup
  @ViewChild("closebuttonclosed") closebuttonclosed: ElementRef;
  @ViewChild("closebuttonclosedapi") closebuttonclosedapi: ElementRef;
  @ViewChild("closebuttonclosedqueery") closebuttonclosedqueery: ElementRef;
  @ViewChild("closeapicalledit") closeapicalledit: ElementRef;
  @ViewChild("closedblinkedit") closedblinkedit: ElementRef;
  valuess: ValueInputs[] = [
    { value: " = 0", viewValue: " = 0" },
    { value: " ≠ 0 ", viewValue: "≠ 0 " },
  ];
  Submoduledatas = [
    { name: 'File Upload' },
    { name: 'View Data' },
    { name: 'History' },

  ]
  methodarray = ['POST', 'GET', 'DELETE']

  typeValues = [
    { value: "EXTERNAL", viewoption: "EXTERNAL", id: 1 },
    { value: "WISEFIN", viewoption: "WISEFIN", id: 2 }
  ];
  statusTypeList = [
    { status: "EXTERNAL", value: "EXTERNAL", id: 2},
    { status: "WISEFIN", value: "WISEFIN",id: 1 }
  ];

  center: any;
  fromdatess: any;
  previousRunYes: number;
  overwrite: number;
  previousRunYess: number;
  confirmvalue: any;
  isGlPresent: number;
  isBankPresent: number;
  highlightedDates: any;
  empbranchid: any;
  currentUser: string;
  makerUser: boolean;
  branchCodeEmp: any;
  adminUsers: boolean;
  pagesize: any;
  selectedPageSize: any;
  Knocksummary: any;
  ledger: any;
  ledgerdec: any;
  statement: any;
  statementdec: any;
  differ: any;
  differdec: any;
  order: number;
  orderdcc: number;
  has_nexttab: any;
  has_previoustab: any;
  presentpagetab: any = 1
  currentpage: number;
  filterValchage: any;
  match: any;
  overall: any;
  unmatch: any;
  selectedCheckbox: number | null = null;
  selectedCheckbox2: number | null = null;
  slecteddata: any;
  slecteddata2: any;
  autokdate1: string;
  integrityfile: any;
  integrityfile2: any;
  type2Files: any;
  type1Files: any;
  document_summery: any;
  isSummaryPagination: boolean;
  data_found: boolean;
  filterValchagename: any;
  isfileUpload: boolean = true;
  isviewData: boolean = false;
  fas_uploadxl: boolean = false
  fas_apicall: boolean = false
  fas_dblink: boolean = false
  cbs_uploadxl: boolean = false
  cbs_apicall: boolean = false
  cbs_dblink: boolean = false
    ;
  isHistory: boolean = false;
  sum: any;
  dblinkcreationform: FormGroup;
  dblinksearch: FormGroup;
  dbsummararray: any[] = []
  apisummararray: any[] = []
  apicallcreationform: FormGroup;
  apicallsearch: FormGroup;
  dbpassword: any;
  dbusername: any;
  dbport: any;
  dbipaddress: any;
  dbqueryform: FormGroup;
  schemaarray: any[] = []
  tablearray: any[] = []
  conarray: any[] = []
  wherearray: any[] = []
  selectedColumns: string[] = [];
  isLoading: boolean = false;
  schemavalue: any;
  tablevalue: any;
  apicallqueryform: FormGroup;
  columnvalue: any;
  templatename: any;
  type: any;
  dbtype: any;
  hasschema_next: boolean;
  hasschema_previous: boolean;
  current_schema_page: number = 1
  current_table_page: number = 1
  hastable_next: boolean;
  dblinkupdateform: FormGroup;
  dblink_id: any;
  apicallupdateform: FormGroup;
  apicall_id: any;
  hastemplate_next: boolean;
  current_template_page: number;
  viewtabchange: any;
  dbrunintegrityarray: any[]=[]
  integrity_transaction_summary:any
  interintegrity_trans_summaryapi:any
  integrity_transactions_summary:any
  interintegrity_transaction_summaryapi:any
  status_modi: number=0
  statusfield: any
  restforminter:any
  negativevalue: any;
  positivevalue: any;
  commoncount: any='0'
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>,
    private taservice: TaService,
    public interService: InterintegrityApiServiceService,
    private sharedservice: SharedService,
    private notification: NotificationService,
    public datepipe: DatePipe,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    config: NgbCarouselConfig,
    private SpinnerService: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private brsService: BrsApiServiceService,
    public documentService: InterintegrityApiServiceService
  ) {
    this.statusfield = {
      label: "Upload Type",
      fronentdata: true,
      data: this.statusTypeList,
      displaykey: "value",
      Outputkey: "id",
      valuekey: "status",
    };
      this.integritytranscationsearch = [{ type: "date", label: "Uploaded Date", formvalue: "date"},{ type: "dropdown", inputobj: this.statusfield, formvalue: "test"},{ "type": "input", "label": "File Name", "formvalue": "name" }]

      this.intergritytransactionfield = { label: "Template", "method": "get", "url": this.url + "integrityserv/template", params: "", "searchkey": "template_name", "displaykey": "template_name",  wholedata: true}

       this.integrity_transactions_summary = [{columnname: "Date", "key": "date"},{columnname: "Name", "key": "file_name"},{columnname: "Type", "key": "type", validate: true,validatefunction: this.typestatus.bind(this)},{columnname: "Status", "key": "status", validate: true,validatefunction: this.status.bind(this)},{"columnname": "Download", "key": "download",icon: 'download',"style":{cursor: "pointer"}, button: true,function: true,clickfunction: this.s3_download_status.bind(this)},{"columnname": "Delete", "key": "delete",icon: 'delete',"style":{cursor: "pointer"}, button: true,function: true,clickfunction: this.status_modify_data.bind(this)}]
       this.dateAdapter.setLocale("en-GB");
    this.interintegrity_trans_summaryapi = { method: "get",
      url: this.url + "integrityserv/auto_fetch_summary",
      params: ""}
       this.integrity_transaction_summary = [{"columnname": "Date", "key": "date"},{"columnname": "Status", "key": "integrity_status",validate: true,validatefunction: this.statusfunction.bind(this)},{"columnname": "Download", "key": "download",icon: 'file_download',"style":{cursor: "pointer"}, button: true,function: true,clickfunction: this.s3_download.bind(this)},{"columnname": "Delete", "key": "delete",icon: 'delete',"style":{cursor: "pointer"}, button: true,function: true,clickfunction: this.tb_delete.bind(this)}]
   

    }

  displayedColumns: string[] = [
    "account_no",
    "date",
    "branch_code",
    "running_balance",
  ];
  displayedColumns1: string[] = [
    "account_name",
    "date",
    "branch_code",
    "running_balance",
  ];
  displayedCoulmnsA: string[] = [
    "gl_accountno", "bs_accountno",
    "gl_runningbalance",
    "bs_runningbalance",
    "difference",
  ];

  listOfObjs: Item[] = [
    { name: "Zero", id: "1", value: "zero" },
    { name: "Non zero", id: "2", value: "non_zero" },
    { name: "Positive", id: "3", value: "positive" },
    { name: "Negative", id: "4", value: "negative" },
    { name: "All", id: "5", value: "all" },
  ];

  @ViewChild("confirmmodal") confirmmodal: ElementRef;
  @ViewChild("sortCol1") sortCol1 = new MatSort();
  @ViewChild("sortCol2") sortCol2 = new MatSort();
  @ViewChild("sortCol3") sortCol3 = new MatSort();
  public acc_no = "";
  public runnbalance = "";
  public InterSelectDate = "";
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  paginationtemp = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
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
  zero: any;
  non_zero: any;
  positive: any;
  negative: any;

  public dataArray: any;
  public dataArrayb: any;
  public dataArrays: any;

  // displayedColumns: string[] = [ 'gl_date', 'line_description', 'credit_amount', 'debit_amount', 'select',];
  // displayedColumnss: string[] = [ 'transaction_date','description',  'credit_amount', 'debit_amount', 'select',];
  // displayedCoulmnsA : string[] = ['gl_date', 'line_description', 'debit_amount_ledger', 'credit_amount_ledger', 'description', 'transaction_date','credit_amount_statement','debit_amount_statement','select'];
  public dataSource: MatTableDataSource<Integrityleft>;
  public dataSources: MatTableDataSource<Integrityright>;
  public dataSourceA: MatTableDataSource<Autoknockoffdata>;
  selection = new SelectionModel<Autoknockoffdata>(true, []);
  @ViewChild("pageCol1") pageCol1: MatPaginator;
  @ViewChild("pageCol2") pageCol2: MatPaginator;
  @ViewChild("pageCol3") pageCol3: MatPaginator;
  @ViewChild('popupclose') popupclose: any;
  frommmDate: any;
  @ViewChild(MatAutocompleteTrigger)
  autocompletetrigger: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autocompletetableTrigger: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autocomplettemplateTrigger: MatAutocompleteTrigger;
  @ViewChild("assetid") matassetidauto: any;
  @ViewChild("inputassetid") inputasset: any;
  @ViewChild("autocompleteemp") matemp: any;
  @ViewChild("branchInput") brinput: any;
  @ViewChild("emp") emp: any;
  @ViewChild('schemaref') schemaref: MatAutocomplete;
  @ViewChild('tableref') tableref: MatAutocomplete;
  @ViewChild('temp') temp: MatAutocomplete;
  @ViewChild('schema_input') schema_input: any;
  @ViewChild('table_input') table_input: any;
  @ViewChild('templateinput') templateinput: any;
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
  branchFetch: any;
  branchFetchs: any;
  uploadtype: any;
  cheacktable1: any[] = []
  cheacktable2: any[] = []
  shouldShowModal: boolean = true;
  @ViewChild('myModal') myModal: ElementRef;

  // public dataSource : MatTableDataSource<Integrityleft>;
  //  dataSources = new MatTableDataSource(this.Data1);
  //  dataSources1 = new MatTableDataSource(this.Data2);

  ngOnInit(): void {
    console.log(this.file_id, 'id')
    console.log(this.file1_type, 'file1_type')
    console.log(this.file2_type, 'file2_type')
    if (this.file1_type === 'UPLOAD EXCEL') {
      this.fas_uploadxl = true
      this.fas_apicall = false
      this.fas_dblink = false
    }
    if (this.file1_type === 'API CALL') {
      this.fas_uploadxl = false
      this.fas_apicall = true
      this.fas_dblink = false
    }

    if (this.file1_type === 'DB LINK') {
      this.fas_uploadxl = false
      this.fas_apicall = false
      this.fas_dblink = true
    }
    if (this.file2_type === 'UPLOAD EXCEL') {
      this.cbs_uploadxl = true
      this.cbs_apicall = false
      this.cbs_dblink = false
    }
    if (this.file2_type === 'API CALL') {
      this.cbs_uploadxl = false
      this.cbs_apicall = true
      this.cbs_dblink = false
    }

    if (this.file2_type === 'DB LINK') {
      this.cbs_uploadxl = false
      this.cbs_apicall = false
      this.cbs_dblink = true
    }

    let userdata = this.sharedservice.transactionList;
    console.log("userdata", userdata);
    userdata.forEach((element) => {
      console.log("element", element.name);
      if (element.name == "InterIntegrity") {
        this.interRole = element.role;
        let set = new Set(this.interRole);
        console.log("ROLES ADDED", set);
        if (set["code"] == "ROL1") {
          console.log("MAKER");
        }
      }
    });

    this.interService.getemployeesdetails().subscribe((results) => {
      console.log("results", results);
      this.empbranchid = results["employee_branch_code"];
      console.log("this.empbranchid", this.empbranchid);
      this.taservice
        .getUsageCode(this.empbranchid, 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.branchFetch = datas[0].code;
          this.branchFetchs = datas[0].name;
          console.log("Branch FETCH List", typeof (this.branchFetch))
          console.log("Employee Branch code", this.branchFetchs)
        });
    });
    console.log("this.interRole", this.interRole)
    if (this.interRole) {
      this.interRole.forEach((element) => {
        if (element.name.toLowerCase() == "admin") {
          this.interPermission = element.code;
          this.adminUser = true;
          this.adminUsers = true;
          this.currentUser = "admin";
        }
        if ((element.name.toLowerCase() == "maker") || (element.name.toLowerCase() == "checker")) {
          this.interPermission = element.code;
          this.normalUser = true;
          this.makerUser = true;
          this.currentUser = "maker";
          console.log("PERMISSION", this.interPermission)
        }
        console.log("this.makerUser", this.makerUser)
      });
    }

    this.integrityCheck = this.fb.group({
      acc_no: null,
      runnbalance: null,
      InterSelectDate: null,
      autoknockDate: null,
      templatename: null,
      fromDatess: null,
      branch: [null],
      branchs: "",
      ctrl_uploadtype: null,
      threshold_field:0
    });
    this.wisefinTbUpload = this.fb.group({
      wisefinuploadbscc: "",
      wisefinuploadjv: '',
      wisefinuploadjw: "",
      wisefinuploadfa: "",
      wisefinuploadcbcc: "",

    });
    this.wisefinUpload = this.fb.group({
      template_id: "",
      wisefinuploadfile: '',
      account_id: "",
      filedatas: "",
      entry_status: "",
      entry_gl: "",
      fColumnName: null,
      fColumnValue: null,
      fColumnName1: null,
      fColumnValue1: null,
      Interdate: null,
      runDate: null,
    });
    this.bankstmtupload = this.fb.group({
      template_id: "",
      cbsuploadfile: '',
      account_id: "",
      filedatas: "",
      cbsdate: null,
    });
    this.apicallcreationform = this.fb.group({
      api_url: '',
      payloads: '',
      api_name: '',
      params: '',
      methods: '',
      description: '',
    })
    this.apicallupdateform = this.fb.group({
      api_url: '',
      payloads: '',
      api_name: '',
      params: '',
      methods: '',
      description: '',
    })
    this.apicallsearch = this.fb.group({
      api_name: [''],
      methods: [''],
      status: ['']
    })
    this.dblinkupdateform = this.fb.group({
      ip_address: [''],
      port: [''],
      db_name: [''],
      user: [''],
      password: ['']
    })
    this.dblinkcreationform = this.fb.group({
      ip_address: [''],
      port: [''],
      db_name: [''],
      user: [''],
      password: ['']
    })
    this.dblinksearch = this.fb.group({
      db_name: [''],
      username: ['']
    })
    this.dbqueryform = this.fb.group({
      schema: [''],
      table_name: [''],
      where: [''],
      select: ['select *'],
      conditions: this.fb.array([])
    })
    this.apicallqueryform = this.fb.group({
      schema: [''],
      table_name: [''],
      where: [''],
      select: ['select *']
    })
    this.interService.gettemplates(1).subscribe((result) => {
      this.templates = result["data"];
    });
    // this.interService.getNtemplates(1).subscribe((result) => {
    //   this.ntemplates = result["data"];
    // });
    this.interService.getBranches(1).subscribe((result) => {
      this.nbranch = result["data"];
    });
    this.myForm = this.fb.group({
      filterProduct: [""],
    });

    const currentDate = new Date();
    this.startDate = new Date();
    this.endDate = new Date(currentDate.getTime() - 0 * 24 * 60 * 60 * 1000);
    // console.log("END DATE", this.endDate)
    // console.log("MODULE NAME", this.sharedservice.MyModuleName);
    // console.log("ROLE NAME", this.sharedservice.transactionList)
    this.route.queryParamMap.subscribe((params) => {
      const runDates = params.get("date");
      // this.route.queryParamMap.subscribe(params => {
      //   const paramValue = params.get('paramName');
      //   console.log(paramValue);
      // console.log(runDates)
      // this.wisefinUpload.controls['runDate'].setValue(runDates)
      this.initialDate = runDates;
      // console.log("INTIAL DATE ", this.initialDate)
      // this.wisefinUpload.setValue('account_id') = account_ids
      // this.page = +params['toDate'] || 0;
      // console.log("DATE PARAM", this.page)
      // console.log("ACCOUNT NUMBER", account_id)
    });
    this.gethistorydata();
    this.integrityCheck
      .get("branch")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          // this.isLoading = true;
        }),
        switchMap((value) => this.taservice.getUsageCode(value, 1))
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchlist = datas;
        // console.log("Branch List", this.branchlist)
      });

    this.getbranch();
    this.branchslist();
    this.gettemplateval();
    this.getRunDates();
  }
  getRunDates()
  {
    this.interService.rundatesIntegrity(this.file_id).subscribe((results) => {
      // this.SpinnerService.hide();
      // let data = results["data"]
      const datesArray = results.data[0];
      this.unqiueDates = [...new Set(datesArray)];
  })
}
  get conditions() {
    return this.dbqueryform.controls["conditions"] as FormArray;
  }
  deleteLesson(lessonIndex: number) {
    this.conditions.removeAt(lessonIndex);
    // let conditionsArray = this.dbqueryform.get('conditions').value;
    // conditionsArray[lessonIndex].DELETE
    this.conditionadd()
  }
  highlightDates = [
    new Date("2023-02-01"),
    new Date("2023-02-05"),
    new Date("2023-02-10"),
  ];

  dateClass = (d: Date) => {
    let newDate = this.datepipe.transform(d, "yyyy-MM-dd");
    if (this.unqiueDates.includes(newDate)) {
      console.log("DATES", newDate)
      return "highlighted-date";
    }
    return "";
  };

  formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    // console.log("DATE FORMATS", `${year}-${month}-${day}`)
    return `${year}-${month}-${day}`;
  }

  getDateString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  showfilter() {
    this.dialog.open(DialogContents, {
      width: "200px",
      // data: { name: this.name, animal: this.animal },cxz
      position: {
        top: "260px",
        right: "0px",
      },
    });
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // console.log(filterValue);
    this.dataSources.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilter(event: Event) {
    const filterValues = (event.target as HTMLInputElement).value;
    this.Knocksummary.filter = filterValues.trim().toLowerCase();
  }
  applyFilterss(event: Event) {
    let selectedValue = (event.target as HTMLInputElement).value;
    // console.log(selectedValue);
  }

  // onChangeRBF(event: Event) {
  //   this.integrityValidation();
  //   let filterVal = this.myForm.value.filterProduct;
  //   this.overwrite = 0;
  //   this.interService
  //     .autoknockoff(this.autokdate,this.overwrite, this.branchCodeEmp, this.uploadtype,filterVal)
  //     .subscribe((results) => {
  //       this.SpinnerService.hide();
  //       this.knockofflists = results["data"];
  //       this.showknockofftable = true;
  //       this.showViewData = false;
  //       this.pagination = results.pagination
  //         ? results.pagination
  //         : this.pagination;
  //       this.dataArrays = results["data"];
  //       this.dataSourceA = new MatTableDataSource<Autoknockoffdata>(
  //         this.dataArrays
  //       );
  //     });
  // }


  intrun() {
    if (this.selectedCheckbox2 == null) {
      this.notification.showError("Please check file to run")
      return false
    }
    if (this.selectedCheckbox == null) {
      this.notification.showError("Please check file to run")
      return false
    }
    this.SpinnerService.show();
    let PARMS_DATE = {
      "id1": this.slecteddata,
      "id2": this.slecteddata2,
      'temp_name': this.integrityCheck.get("templatename").value,
      'int_type': this.file_id,
      'threshold':this.integrityCheck.get("threshold_field").value,
    }
    this.interService.implementing_conditions(PARMS_DATE).subscribe((results) => {
      this.SpinnerService.hide();
      let data = results["data"]
      if (data == undefined) {
        this.notification.showError(results.code)
        return false
      }
      if (data[0].key == "scheduler triggered") {
        this.notification.showSuccess("Process Started")
        this.popupclose.nativeElement.click()
      }
    });

  }

  status_modify(type) {
    let date = this.datepipe.transform(this.integrityCheck.controls["InterSelectDate"].value, "dd-MM-yyyy");
    let status = 0
    this.SpinnerService.show();
    this.interService.status_modify(date, type, status).subscribe((results) => {
      this.SpinnerService.hide();
      if (results.status == "success") {
        this.notification.showSuccess("successfully updated");
        this.runint()
      } else {
        this.notification.showError(results.description);
      }

    });

  }


  tb_delete(date) {
    let dateParts: string[] = date.date.split('-'); // Splitting the string into parts

    // Creating a Date object manually
    let year: number = parseInt(dateParts[2]);
    let month: number = parseInt(dateParts[1]) - 1; // Months in JavaScript are zero-indexed (0-11)
    let day: number = parseInt(dateParts[0]);

    let dateObject: Date = new Date(year, month, day);

    // let dateObject = this.parseDateString(date, format);
    let date_tb_sum = this.datepipe.transform(dateObject, 'yyyy-MM-dd');
    this.SpinnerService.show();
    this.interService.tb_status_tb(date_tb_sum).subscribe((results) => {
      this.SpinnerService.hide();
      if (results.status == "success") {
        this.notification.showSuccess("successfully updated");
        //  this.runint();
        this.tbsummary();
      } else {
        this.notification.showError(results.description);
      }

    });

  }

  s3_download(data) {
    console.log(data,'download data')
    this.autokdate1 = this.datepipe.transform(this.integrityCheck.controls["InterSelectDate"].value, "yyyy-MM-dd");
    this.SpinnerService.show();
    this.interService.tb_s3_download(this.autokdate1, this.file_id,data.id).subscribe((results: any[]) => {
      this.SpinnerService.hide();
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'EXCEL_report.xlsx';
      link.click();
    });

  }

  runint() {
    let threshold=this.integrityCheck.get("threshold_field").value
    if(threshold===''||threshold===null||threshold===undefined){
      this.notification.showError(' Enter the threshold value')
      return
    }
    if (this.integrityCheck.controls["InterSelectDate"].value == "" || this.integrityCheck.controls["InterSelectDate"].value == null) {
      this.autokdate1 = ""
      this.notification.showError("choose date to proceed")
      return false;
    } else {
      this.autokdate1 = this.datepipe.transform(this.integrityCheck.controls["InterSelectDate"].value, "yyyy-MM-dd");
      const myModal = new (bootstrap as any).Modal(this.myModal.nativeElement);
      myModal.show();
    }
    let template = this.integrityCheck.get("templatename").value.template_name
        this.SpinnerService.show();
    this.interService.integrity_file(this.autokdate1, template, this.file_id).subscribe((results) => {
      this.SpinnerService.hide();
      if (results.code == "UNEXPECTED_ERROR") {
        this.notification.showError(results.description)
        this.type1Files = []
        this.type2Files = []
        this.data_found = false;
        return false
      }
      this.integrityfile = results["data"]
      this.integrityfile2 = results["data"]
      this.type1Files = this.integrityfile.filter(item => item.type === '1');
      this.type2Files = this.integrityfile.filter(item => item.type === '2');
      this.data_found = true;
    });

  }
  tbsummary() {
    // this.interService.tb_fetch_summary().subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.document_summery = results["data"];
    //   let dataPagination = results['pagination'];
    //   console.log("datasupload", datas)
    //   if (datas.length >= 0) {
    //     this.has_nexttab = dataPagination.has_next;
    //     this.has_previoustab = dataPagination.has_previous;
    //     this.presentpagetab = dataPagination.index;
    //     this.isSummaryPagination = true;
    //     this.data_found = true;
    //   }
    //   if (datas.length <= 0) {
    //     this.data_found = false;
    //     this.notification.showError("NO Data Found")
    //   }
    // });
    this.popupopenwisefintb()
    this.reset()
  }

  getexceldownloadfas(id) {
    let data = id;
    if (data === 1) {
      this.filetype = 1;
    }
    else if (data === 2) {
      this.filetype = 2;
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

  toggleCheckbox(index: number, data) {
    console.log("data", data);
    this.slecteddata = data;
    if (this.selectedCheckbox === index) {
      this.selectedCheckbox = null;
      const selectedIndex = this.cheacktable1.indexOf(this.slecteddata);
      if (selectedIndex !== -1) {
        this.cheacktable1.splice(selectedIndex, 1);
      }
    } else {
      this.selectedCheckbox = index;
      this.cheacktable1.push(this.slecteddata);
    }
  }


  toggleCheckbox2(index: number, data) {
    console.log("data", data)
    this.slecteddata2 = data
    if (this.selectedCheckbox2 === index) {
      this.selectedCheckbox2 = null;
      const selectedIndex = this.cheacktable2.indexOf(this.slecteddata2);
      if (selectedIndex !== -1) {
        this.cheacktable2.splice(selectedIndex, 1);
      }
    } else {
      this.selectedCheckbox2 = index;
      this.cheacktable2.push(this.slecteddata2);
    }
  }

  onPageChange(event: any) {
    this.selectedPageSize = event.pageSize;
    console.log('Selected Page Size:', this.selectedPageSize);
    this.autokdate = this.datepipe.transform(
      this.integrityCheck.controls["InterSelectDate"].value,
      "yyyy-MM-dd"
    );
    let filterVal = this.myForm.value.filterProduct;
    let page = 1;
    let led_acc = "";
    let download = 0
    this.SpinnerService.show();
    this.interService
      .knock_off_summary(page, this.autokdate, filterVal, this.selectedPageSize, led_acc, this.file_id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        this.knockofflists = results["data"];
        this.showknockofftable = true;
        this.showViewData = false;
        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;
        this.Knocksummary = results["data"];
        this.dataSourceA = new MatTableDataSource<Autoknockoffdata>(
          this.Knocksummary
        );
      });

  }

  onChangeRBF(pageNumber = 1) {
    if (this.integrityCheck.controls["InterSelectDate"].value == null || this.integrityCheck.controls["InterSelectDate"].value == undefined || this.integrityCheck.controls["InterSelectDate"].value == "") {
      this.notification.showError("Please Choose Date");
      this.myForm.controls["filterProduct"].reset()
      return false
    }
    this.filterValchage = this.myForm.value.filterProduct.id;
    this.filterValchagename = this.myForm.value.filterProduct.name;
    let filterVal = this.myForm.value.filterProduct.id;
    this.overwrite = 0;
    if (this.selectedPageSize == 25 || this.selectedPageSize == 50 || this.selectedPageSize == 100) {
      this.pagesize = this.selectedPageSize
    } else {
      this.pagesize = 10;
    }
    this.autokdate = this.datepipe.transform(
      this.integrityCheck.controls["InterSelectDate"].value,
      "yyyy-MM-dd"
    );
    let page = pageNumber;
    let led_acc = "";
    let download = 0
    this.SpinnerService.show();
    this.interService
      .knock_off_summary(page, this.autokdate, filterVal, this.pagesize, led_acc, this.file_id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        this.knockofflists = results["data"];
        this.integritycount()
        if (results.code == "UNEXPECTED_ERROR") {
          this.notification.showInfo(results.description);
        }
        this.showknockofftable = true;
        this.showViewData = false;
        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;
        this.Knocksummary = results["data"];
        this.isExpandedscardinter = !!this.Knocksummary;
        let dataPagination = results['pagination'];
        this.has_nexttab = dataPagination.has_next;
        this.has_previoustab = dataPagination.has_previous;
        this.presentpagetab = dataPagination.index;
        
      });

  }

  integritycount() {
    // this.commoncount=undefined
     this.commoncount='Loading'
    this.SpinnerService.show()
    this.interService
      .integrity_count(this.autokdate, this.file_id)
      .subscribe((results) => {
        this.SpinnerService.hide()
        let data = results["data"];
        this.unmatch = data[0].unmatch
        this.match = data[0].zero
        this.overall = data[0].total
        this.negativevalue=data[0].negative
        this.positivevalue=data[0].positive
        let formvalue=this.myForm.get('filterProduct').value
        if(formvalue.id==='1'){
          this.commoncount= this.match
        }else if(formvalue.id==='2'){
          this.commoncount= this.unmatch
        }
        else if(formvalue.id==='3'){
          this.commoncount= this.positivevalue
        }
        else if(formvalue.id==='4'){
          this.commoncount= this.negativevalue
        }
        else if(formvalue.id==='5'){
          this.commoncount=   this.overall
        }
       
        console.log(data)
        console.log(this.commoncount,'commoncount')
      });

  }

  led_acc(Data) {
    if (this.myForm.value.filterProduct == null || this.myForm.value.filterProduct == undefined || this.myForm.value.filterProduct == "") {
      return false
    }
    console.log("Data", Data)
    if (Data == 1) {
      this.order = 1;
    }
    if (Data == 3) {
      this.order = 3;
    }
    if (Data == 5) {
      this.order = 5;
    }
    let filterVal = this.myForm.value.filterProduct.id;
    if (this.selectedPageSize == 25 || this.selectedPageSize == 50 || this.selectedPageSize == 100) {
      this.pagesize = this.selectedPageSize
    } else {
      this.pagesize = 10;
    }
    this.autokdate = this.datepipe.transform(
      this.integrityCheck.controls["InterSelectDate"].value,
      "yyyy-MM-dd"
    );
    let page = 1;
    let led_acc = 1;
    let download = 0
    this.SpinnerService.show();
    this.interService
      .knock_off_summary(page, this.autokdate, filterVal, this.pagesize, this.order, this.file_id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        this.knockofflists = results["data"];
        this.showknockofftable = true;
        this.showViewData = false;
        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;
        this.Knocksummary = results["data"];
        this.dataSourceA = new MatTableDataSource<Autoknockoffdata>(
          this.Knocksummary
        );
      });

  }

  previousClick() {
    if (this.has_previoustab == true) {
      this.currentpage = this.presentpagetab - 1;
      this.onChangeRBF(this.presentpagetab - 1)

    }
  }
  nextClick() {
    if (this.has_nexttab == true) {
      this.currentpage = this.presentpagetab + 1;
      this.onChangeRBF(this.presentpagetab + 1)

    }
  }

  led_dcc(data) {
    if (this.myForm.value.filterProduct == null || this.myForm.value.filterProduct == undefined || this.myForm.value.filterProduct == "") {
      return false
    }
    console.log("data", data)
    if (data == 2) {
      this.orderdcc = 2;
    }
    if (data == 4) {
      this.orderdcc = 4;
    }
    if (data == 6) {
      this.orderdcc = 6;
    }
    let filterVal = this.myForm.value.filterProduct.id;
    if (this.selectedPageSize == 25 || this.selectedPageSize == 50 || this.selectedPageSize == 100) {
      this.pagesize = this.selectedPageSize
    } else {
      this.pagesize = 10;
    }
    this.autokdate = this.datepipe.transform(
      this.integrityCheck.controls["InterSelectDate"].value,
      "yyyy-MM-dd"
    );
    let page = 1;
    let led_acc = 2;
    let download = 0
    this.SpinnerService.show();
    this.interService
      .knock_off_summary(page, this.autokdate, filterVal, this.pagesize, this.orderdcc, this.file_id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        this.knockofflists = results["data"];
        this.showknockofftable = true;
        this.showViewData = false;
        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;
        this.Knocksummary = results["data"];
        this.dataSourceA = new MatTableDataSource<Autoknockoffdata>(
          this.Knocksummary
        );
      });

  }

  intigritydownload() {
    if (this.integrityCheck.controls["InterSelectDate"].value == null || this.integrityCheck.controls["InterSelectDate"].value == undefined || this.integrityCheck.controls["InterSelectDate"].value == "") {
      this.notification.showError("Please Choose Date");
      return false
    }
    if (this.filterValchage == null || this.filterValchage == "" || this.filterValchage == undefined) {
      this.notification.showError("Please choose filter")
      return false
    }
    let filter = this.filterValchage
    let date = this.autokdate
    let page = 1
    this.interService.intigritydownload(date, this.file_id).subscribe((results: any[]) => {
      this.SpinnerService.hide();
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "excel_report" + ".xlsx";
      link.click();
    });

  }

  craetewisefintb() {
    // console.log("file:",this.uploadbscc,this.uploadjv, this.uploadjw,this.uploadfa,this.uploadcbcc)
    // let bscc = this.uploadbscc;
    let jv = this.wisefinTbUpload.get("wisefinuploadjv").value;
    let jw = this.wisefinTbUpload.get("wisefinuploadjw").value;
    let fa = this.wisefinTbUpload.get("wisefinuploadfa").value;
    let expense = this.wisefinTbUpload.get("wisefinuploadcbcc").value;
    let date = this.datepipe.transform(
      this.integrityCheck.controls["InterSelectDate"].value,
      "yyyy-MM-dd",
    )
    // if (
    //   this.integrityCheck.controls["InterSelectDate"].value == null ||
    //   this.integrityCheck.controls["InterSelectDate"].value == ""
    // ) {
    //   this.notification.showError("Please choose a date to proceed");
    //   return false;
    // }
    if (
      date == null || date == ""
    ) {
      this.notification.showError("Please select date");
      return false;
    }
    if (
      this.wisefinTbUpload.get("wisefinuploadbscc").value == null ||
      this.wisefinTbUpload.get("wisefinuploadbscc").value == ""
    ) {
      this.notification.showError("Please select valid BSCC file to upload");
      return false;
    }
    if (
      this.wisefinTbUpload.get("wisefinuploadjv").value == null ||
      this.wisefinTbUpload.get("wisefinuploadjv").value == ""
    ) {
      this.notification.showError("Please select valid JV file to upload");
      return false;
    }
    if (
      this.wisefinTbUpload.get("wisefinuploadjw").value == null ||
      this.wisefinTbUpload.get("wisefinuploadjw").value == ""
    ) {
      this.notification.showError("Please select valid JW file to upload");
      return false;
    }
    if (
      this.wisefinTbUpload.get("wisefinuploadfa").value == null ||
      this.wisefinTbUpload.get("wisefinuploadfa").value == ""
    ) {
      this.notification.showError("Please select valid FA file to upload");
      return false;
    }
    if (
      this.wisefinTbUpload.get("wisefinuploadcbcc").value == null ||
      this.wisefinTbUpload.get("wisefinuploadcbcc").value == ""
    ) {
      this.notification.showError("Please select valid EXPENSE file to upload");
      return false;
    }
    this.uploadtype = this.integrityCheck.controls["ctrl_uploadtype"].value;
    let datal = {
      // "bscc": this.uploadbscc,
      // "jv": this.uploadjv,
      // "jw": this.uploadjw,
      // "fa": this.uploadfa,
      // "expense": this.uploadcbcc,
      "date": date,
    };
    // console.log("this.wisefinUpload.get(filedatas).value",this.wisefinUpload.get("filedatas").value)
    this.SpinnerService.show();
    this.interService
      .wisefintb(datal, this.uploadbscc, jv, jw, fa, expense)
      .subscribe((results) => {
        this.SpinnerService.hide();
        if (results['data'] == undefined) {
          this.notification.showError(results.code);
        }
        if (results['data'][0].key == "scheduler triggered") {
          this.notification.showSuccess("scheduler triggered");
          this.wisefinUpload.reset()
        }

      });
  }

  uploadtbbscc(evt) {
    this.uploadbscc = evt.target.files[0];
    const fileExtension = this.uploadbscc.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx') {
      console.error('Invalid file type. Please upload an XLSX file.');
      this.notification.showError("Unsupported file type");
      this.wisefinTbUpload.get("wisefinuploadbscc").reset()
      return;
    }
    // this.wisefinTbUpload.get("wisefinuploadbscc").setValue(this.uploadbscc);
  }
  uploadchoosesjv(evt) {
    this.uploadjv = evt.target.files[0];
    const fileExtension = this.uploadjv.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx') {
      console.error('Invalid file type. Please upload an XLSX file.');
      this.notification.showError("Unsupported file type");
      this.wisefinTbUpload.get("wisefinuploadjv").reset()
      return;
    }
    this.wisefinTbUpload.get("wisefinuploadjv").setValue(this.uploadjv);
  }
  uploadchoosesjw(evt) {
    this.uploadjw = evt.target.files[0];
    const fileExtension = this.uploadjw.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx') {
      console.error('Invalid file type. Please upload an XLSX file.');
      this.notification.showError("Unsupported file type");
      this.wisefinTbUpload.get("wisefinuploadjw").reset()
      return;
    }
    this.wisefinTbUpload.get("wisefinuploadjw").setValue(this.uploadjw);
  }
  uploadchoosesfa(evt) {
    this.uploadfa = evt.target.files[0];
    const fileExtension = this.uploadfa.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx') {
      console.error('Invalid file type. Please upload an XLSX file.');
      this.notification.showError("Unsupported file type");
      this.wisefinTbUpload.get("wisefinuploadfa").reset()
      return;
    }
    this.wisefinTbUpload.get("wisefinuploadfa").setValue(this.uploadfa);
  }
  uploadchoosesexpense(evt) {
    this.uploadcbcc = evt.target.files[0];
    const fileExtension = this.uploadcbcc.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx') {
      console.error('Invalid file type. Please upload an XLSX file.');
      this.notification.showError("Unsupported file type");
      this.wisefinTbUpload.get("wisefinuploadcbcc").reset()
      return;
    }
    this.wisefinTbUpload.get("wisefinuploadcbcc").setValue(this.uploadcbcc);
  }

  uploadchooses(evt) {
    this.uploadfile = evt.target.files[0];
    const fileExtension = this.uploadfile.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx') {
      console.error('Invalid file type. Please upload an XLSX file.');
      this.notification.showError("Unsupported file type");
      this.wisefinUpload.get("wisefinuploadfile").reset()
      return;
    }
    this.wisefinUpload.get("filedatas").setValue(this.uploadfile);
  }

  viewglData() {
    console.log(this.integrityCheck.controls["InterSelectDate"].value);
    console.log(this.integrityCheck.controls["ctrl_uploadtype"].value);
    if (this.currentUser == "admin") {
      if (
        this.integrityCheck.controls["branch"].value == null ||
        this.integrityCheck.controls["branch"].value == ""
      ) {
        this.notification.showError("Please select a Branch");
        return false;
      }
    }
    if (this.currentUser == "admin") {
      this.branchCodeEmp = this.integrityCheck.controls["branchs"].value;
    } else {
      this.branchCodeEmp = this.empbranchid;
    }
    if (
      this.integrityCheck.controls["InterSelectDate"].value == null ||
      this.integrityCheck.controls["InterSelectDate"].value == ""
    ) {
      this.notification.showError("Please choose a date to proceed");
      return false;
    }
    if (
      this.integrityCheck.controls["ctrl_uploadtype"].value == null ||
      this.integrityCheck.controls["ctrl_uploadtype"].value == ""
    ) {
      this.notification.showError("Please select valid Type(WISEFIN/EXTERNAL)");
      return false;
    }
    this.uploadtype = this.integrityCheck.controls["ctrl_uploadtype"].value;
    this.showknockofftable = false;
    this.showViewData = true;
    this.SpinnerService.show();
    this.interService
      .getLedgerdata(
        this.datepipe.transform(this.integrityCheck.controls["InterSelectDate"].value, "yyyy-MM-dd"),
        this.wisefinUpload.controls["template_id"].value,
        this.pagination.index,
        this.branchCodeEmp,
        this.uploadtype
      )
      .subscribe((results) => {
        if (!results) {
          return false;
        }
        this.SpinnerService.hide();
        this.dataArray = results["data"];
        this.dataSource = new MatTableDataSource<Integrityleft>(this.dataArray);
        this.dataSource.paginator = this.pageCol1;
        this.dataSource.sort = this.sortCol1;
      });
  }

  viewbsData() {
    if (this.currentUser == "admin") {
      if (
        this.integrityCheck.controls["branch"].value == null ||
        this.integrityCheck.controls["branch"].value == ""
      ) {
        this.notification.showError("Please select a Branch");
        return false;
      }
    }
    if (this.currentUser == "admin") {
      this.branchCodeEmp = this.integrityCheck.controls["branchs"].value;
    } else {
      this.branchCodeEmp = this.empbranchid;
    }
    if (
      this.integrityCheck.controls["InterSelectDate"].value == null ||
      this.integrityCheck.controls["InterSelectDate"].value == ""
    ) {
      this.notification.showError("Please choose a date to proceed");
      return false;
    }
    if (
      this.integrityCheck.controls["ctrl_uploadtype"].value == null ||
      this.integrityCheck.controls["ctrl_uploadtype"].value == ""
    ) {
      this.notification.showError("Please select valid Type(WISEFIN/EXTERNAL)");
      return false;
    }
    this.uploadtype = this.integrityCheck.controls["ctrl_uploadtype"].value;
    this.showknockofftable = false;
    this.showViewData = true;
    this.SpinnerService.show();
    this.interService
      .getStatementdata(
        this.datepipe.transform(
          this.integrityCheck.controls["InterSelectDate"].value,
          "yyyy-MM-dd"
        ),
        this.bankstmtupload.controls["account_id"].value,
        this.pagination.index,
        this.branchCodeEmp,
        this.uploadtype
      )
      .subscribe((results) => {
        console.log(results);
        if (!results) {
          return false;
        }
        this.SpinnerService.hide();
        this.dataArrayb = results["data"];
        this.dataSources = new MatTableDataSource<Integrityright>(
          this.dataArrayb
        );
        this.dataSources.paginator = this.pageCol2;
        this.dataSources.sort = this.sortCol2;
      });
  }


  gluploads() {
    console.log("file:", this.uploadbscc, this.uploadjv, this.uploadjw)
    if (
      this.integrityCheck.controls["InterSelectDate"].value == null ||
      this.integrityCheck.controls["InterSelectDate"].value == ""
    ) {
      this.notification.showError("Please choose a date to proceed");
      return false;
    }
    if (
      this.wisefinUpload.get("filedatas").value == null ||
      this.wisefinUpload.get("filedatas").value == ""
    ) {
      this.notification.showError("Please select valid file to upload");
      return false;
    }
    this.uploadtype = this.integrityCheck.controls["ctrl_uploadtype"].value;
    let datal = {
      "type": 1,
      "date": this.datepipe.transform(
        this.integrityCheck.controls["InterSelectDate"].value,
        "yyyy-MM-dd"
      ),
      'temp_name': this.integrityCheck.get("templatename").value,
      'int_type': this.file_id
    };
    console.log("this.wisefinUpload.get(filedatas).value", this.wisefinUpload.get("filedatas").value)
    this.SpinnerService.show();
    this.interService
      .document_upload(datal, this.wisefinUpload.get("filedatas").value)
      .subscribe((results) => {
        this.SpinnerService.hide();
        if (results.status == "success") {
          this.notification.showSuccess("File Insert Successfully");
          this.wisefinUpload.reset()
        } else {
          if(results.description){
            this.notification.showError(results.description);
            
          }else{
            this.notification.showError(results.code);
          }
          
        }
      });
  }

  // gluploads() {
  //   if (this.currentUser == "admin") {
  //     if (this.integrityCheck.controls["branch"].value == null ||
  //       this.integrityCheck.controls["branch"].value == ""
  //     ) {
  //       this.notification.showError("Please select a Branch");
  //       return false;
  //     }
  //   }
  //   if (this.currentUser == "admin") {
  //     this.branchCodeEmp = this.integrityCheck.controls["branchs"].value;
  //   } else {
  //     this.branchCodeEmp = this.empbranchid;
  //   }
  //   if (
  //     this.integrityCheck.controls["InterSelectDate"].value == null ||
  //     this.integrityCheck.controls["InterSelectDate"].value == ""
  //   ) {
  //     this.notification.showError("Please choose a date to proceed");
  //     return false;
  //   }
  //   if (
  //     this.wisefinUpload.get("filedatas").value == null ||
  //     this.wisefinUpload.get("filedatas").value == ""
  //   ) {
  //     this.notification.showError("Please select valid file to upload");
  //     return false;
  //   }
  //   this.uploadtype=this.integrityCheck.controls["ctrl_uploadtype"].value;
  //   this.checkPreviousGlUpload();
  //   if (this.isGlPresent == 0) { //NOT UPLOADED
  //     let datal = {
  //       template_id: this.wisefinUpload.controls["template_id"].value,
  //       gl_date: this.datepipe.transform(
  //         this.integrityCheck.controls["InterSelectDate"].value,
  //         "yyyy-MM-dd"
  //       ),
  //       file: 1,
  //       branch_code: this.branchCodeEmp,
  //       upload_type:this.uploadtype
  //     };
  //     console.log("this.wisefinUpload.get(filedatas).value",this.wisefinUpload.get("filedatas").value)
  //     this.SpinnerService.show();
  //     this.interService
  //       .glUpload(datal, this.wisefinUpload.get("filedatas").value)
  //       .subscribe((results) => {
  //         this.SpinnerService.hide();
  //         this.pagination = results.pagination
  //           ? results.pagination
  //           : this.pagination;
  //         if (results.status == "success") {
  //           this.notification.showSuccess("Files Uploaded Successfully");
  //         } else {
  //           this.notification.showError(results.description);
  //         }
  //       });
  //   } else {
  //     let myDialog = this.dialog.open(UserdialogComponent, {
  //       disableClose: true,
  //       position: {
  //         top: "5%",
  //       },
  //     });
  //     myDialog.afterClosed().subscribe((data) => {
  //       this.confirmvalue = data;
  //       if (this.confirmvalue == 1) {
  //         let datal = {
  //           template_id: this.wisefinUpload.controls["template_id"].value,
  //           date: this.datepipe.transform(
  //             this.integrityCheck.controls["InterSelectDate"].value,
  //             "yyyy-MM-dd"
  //           ),
  //           file: 1,
  //           branch_code: this.branchCodeEmp,
  //         };
  //         this.overwrite = 1;
  //         this.SpinnerService.show();
  //         this.interService
  //           .glUploads(
  //             datal,
  //             this.wisefinUpload.get("filedatas").value,
  //             this.overwrite
  //           )
  //           .subscribe((results) => {
  //             this.SpinnerService.hide();
  //             this.pagination = results.pagination
  //               ? results.pagination
  //               : this.pagination;
  //             if (results.status == "success") {
  //               this.notification.showSuccess("Files Uploaded Successfully");
  //             } else {
  //               this.notification.showError(results.description);
  //             }
  //           });
  //       }
  //     });
  //   }
  // }

  // bankstmt_upload() {
  //   if (this.currentUser == "admin") {
  //     this.branchCodeEmp = this.integrityCheck.controls["branchs"].value;
  //   } else {
  //     this.branchCodeEmp = this.empbranchid;
  //   }
  //   this.uploadtype=this.integrityCheck.controls["ctrl_uploadtype"].value;
  //   this.checkPreviousBankUpload();
  //   if (this.isBankPresent == 0) {
  //     let datal = {
  //       template_id: this.bankstmtupload.controls["template_id"].value,
  //       date: this.datepipe.transform(
  //         this.integrityCheck.controls["InterSelectDate"].value,
  //         "yyyy-MM-dd"
  //       ),
  //       branch_code: this.branchCodeEmp,
  //       upload_type: this.uploadtype
  //     };
  //     this.SpinnerService.show();
  //     this.interService
  //       .bankstatementUplaod(datal, this.bankstmtupload.get("filedatas").value)
  //       .subscribe((results) => {
  //         this.SpinnerService.hide();
  //         this.pagination = results.pagination
  //           ? results.pagination
  //           : this.pagination;
  //         if (results.status == "success") {
  //           this.notification.showSuccess("Files Uploaded Successfully");
  //         } else {
  //           this.notification.showError(results.description);
  //         }
  //       });
  //   } else {
  //     let myDialog = this.dialog.open(UserdialogComponent, {
  //       disableClose: true,
  //       position: {
  //         top: "5%",
  //       },
  //     });
  //     myDialog.afterClosed().subscribe((data) => {
  //       this.confirmvalue = data;
  //       if (this.confirmvalue == 1) {
  //         let datal = {
  //           template_id: this.bankstmtupload.controls["template_id"].value,
  //           date: this.datepipe.transform(
  //             this.integrityCheck.controls["InterSelectDate"].value,
  //             "yyyy-MM-dd"
  //           ),
  //           branch_code: this.branchCodeEmp,
  //         };
  //         this.overwrite = 1;
  //         this.SpinnerService.show();
  //         this.interService
  //           .bankstatementUplaods(
  //             datal,
  //             this.bankstmtupload.get("filedatas").value,
  //             this.overwrite
  //           )
  //           .subscribe((results) => {
  //             this.SpinnerService.hide();
  //             this.pagination = results.pagination
  //               ? results.pagination
  //               : this.pagination;
  //             if (results.status == "success") {
  //               this.notification.showSuccess("Files Uploaded Successfully");
  //             } else {
  //               this.notification.showError(results.description);
  //             }
  //           });
  //       }
  //     });
  //   }
  // }

  bankstmt_upload() {
    if (
      this.integrityCheck.controls["InterSelectDate"].value == null ||
      this.integrityCheck.controls["InterSelectDate"].value == ""
    ) {
      this.notification.showError("Please choose a date to proceed");
      return false;
    }
    if (
      this.bankstmtupload.get("filedatas").value == null ||
      this.bankstmtupload.get("filedatas").value == ""
    ) {
      this.notification.showError("Please select valid file to upload");
      return false;
    }
    let datal = {
      "type": 2,
      "date": this.datepipe.transform(
        this.integrityCheck.controls["InterSelectDate"].value,
        "yyyy-MM-dd"
      ),
      'temp_name':this.integrityCheck.get("templatename").value,
      'int_type': this.file_id
    };
    this.SpinnerService.show();
    this.interService
      .document_upload(datal, this.bankstmtupload.get("filedatas").value)
      .subscribe((results) => {
        this.SpinnerService.hide();
        if (results.status == "success") {
          this.notification.showSuccess("File Insert Successfully");
          this.bankstmtupload.reset()
        } else {
          if(results.description){
            this.notification.showError(results.description);
            
          }else{
            this.notification.showError(results.code);
          }
          
        }
      });
  }
  uploadchoose(evt) {
    this.uploadfile = evt.target.files[0];
    const fileExtension = this.uploadfile.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx') {
      console.error('Invalid file type. Please upload an XLSX file.');
      this.notification.showError("Unsupported file type");
      this.bankstmtupload.get("cbsuploadfile").reset()
      return;
    }
    this.bankstmtupload.get("filedatas").setValue(this.uploadfile);
  }

  integrityValidation() {
    if (this.currentUser == "admin") {
      if (this.integrityCheck.controls["branch"].value == null || this.integrityCheck.controls["branch"].value == "") {
        this.notification.showError("Please select a Branch");
        return false;
      } else {
        this.branchCodeEmp = this.integrityCheck.controls["branchs"].value;
      }
    } else {
      this.branchCodeEmp = this.empbranchid;
    }
    if (
      this.integrityCheck.controls["InterSelectDate"].value == null ||
      this.integrityCheck.controls["InterSelectDate"].value == ""
    ) {
      this.notification.showError("Please choose a date to proceed");
      return false;
    }
    this.autokdate = this.datepipe.transform(
      this.integrityCheck.controls["InterSelectDate"].value,
      "yyyy-MM-dd"
    );

    if (this.integrityCheck.controls["ctrl_uploadtype"].value == null || this.integrityCheck.controls["ctrl_uploadtype"].value == "") {
      this.notification.showError("Please select Upload Type");
      return false;
    } else {
      this.uploadtype = this.integrityCheck.controls["ctrl_uploadtype"].value;
    }
  }

  showdataAdmindiff() {
    this.integrityValidation();
    this.interService
      .IntegrityRunStatus(this.autokdate, this.branchCodeEmp, this.uploadtype)
      .subscribe((results) => {
        this.statusCheck = results;
        if (this.statusCheck.previous_run == true) {
          let myDialog = this.dialog.open(AdmindialogComponent, {
            disableClose: true,
            position: {
              top: "5%",
            },
          });
          myDialog.afterClosed().subscribe((data) => {
            this.confirmvalue = data;
            if (this.confirmvalue == 1) {
              this.overwrite = 1;
              this.SpinnerService.show();
              this.interService
                .autoknockoff(
                  this.autokdate,
                  this.overwrite,
                  this.branchCodeEmp,
                  this.uploadtype, "non_zero"
                )
                .subscribe((results) => {
                  this.SpinnerService.hide();
                  this.knockofflists = results["data"];
                  this.showknockofftable = true;
                  this.showViewData = false;
                  this.pagination = results.pagination
                    ? results.pagination
                    : this.pagination;
                  this.dataArrays = results["data"];
                  this.dataSourceA = new MatTableDataSource<Autoknockoffdata>(
                    this.dataArrays
                  );
                });
            } else {
              this.overwrite = 0;
              this.interService
                .autoknockoff(this.autokdate, this.overwrite, this.branchCodeEmp, this.uploadtype, "non_zero")
                .subscribe((results) => {
                  this.SpinnerService.hide();
                  this.knockofflists = results["data"];
                  this.showknockofftable = true;
                  this.showViewData = false;
                  this.pagination = results.pagination
                    ? results.pagination
                    : this.pagination;
                  this.dataArrays = results["data"];
                  this.dataSourceA = new MatTableDataSource<Autoknockoffdata>(
                    this.dataArrays
                  );
                });
            }
          });
        } else {
          this.overwrite = 0;
          this.interService
            .autoknockoff(this.autokdate, this.overwrite, this.branchCodeEmp, this.uploadtype, "non_zero")
            .subscribe((results) => {
              this.SpinnerService.hide();
              this.knockofflists = results["data"];
              this.showknockofftable = true;
              this.showViewData = false;
              this.pagination = results.pagination
                ? results.pagination
                : this.pagination;
              this.dataArrays = results["data"];
              this.dataSourceA = new MatTableDataSource<Autoknockoffdata>(
                this.dataArrays
              );
            });
        }
      });
  }

  backtoHome() {
    this.showknockofftable = false;
  }

  selectedRow(row) {
    // this.selection.selected.forEach(
    //    s => console.log(s.id)
    // )
  }
  purgeleadger() {
    let dataPl = {
      template_id: this.wisefinUpload.controls["template_id"].value,
      type: "ledger",
    };
    this.interService.purgeLedgerServ(dataPl).subscribe((results) => {
      if (results.status == "success") {
        this.notification.showSuccess("Files Purged Successfully");
      } else {
        this.notification.showError(results.description);
      }
    });
  }

  purgecbs() {
    let dataSt = {
      template_id: this.bankstmtupload.controls["template_id"].value,
      type: "statement",
    };
    this.interService.purgeStmtServ(dataSt).subscribe((results) => {
      if (results.status == "success") {
        this.notification.showSuccess("Files Purged Successfully");
      } else {
        this.notification.showError(results.description);
      }
    });
  }
  adddocument() {
    this.closebuttonclosed.nativeElement.click();
    // this.router.navigate(["interintegrity/documentdetails"], {});
  }

  knockOffHistory() {
    this.router.navigate(["interintegrity/knock"], {});
  }
  gotoBRS(rowdata) {
    console.log("Row Data", rowdata);
    this.interService.closedate(rowdata.id).subscribe((results) => {
      this.endDates = results.knockoff_date;
      this.router.navigate(["brs/integrity"], {
        queryParams: {
          account_id: rowdata.acc_no,
          acc_id: rowdata.account_id,
          toDate: rowdata.date_ledger,
          fromDate: this.endDates,
        },
      });
    });
  }

  glfetchfile() {
    if (this.currentUser == "admin") {
      this.branchCodeEmp = this.integrityCheck.controls["branchs"].value;
    } else {
      this.branchCodeEmp = this.empbranchid;
    }
    this.checkPreviousGlUpload();
    if (this.isGlPresent == 0) {
      let datal = {
        date: this.datepipe.transform(
          this.integrityCheck.controls["InterSelectDate"].value,
          "yyyy-MM-dd"
        ),
        file: 0,
        branch_code: this.branchCodeEmp,
      };
      let file = 0;
      this.SpinnerService.show();
      this.interService.glFetch(datal, file).subscribe((results) => {
        this.SpinnerService.hide();
        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;
        if (results.status == "success") {
          this.notification.showSuccess("Files Fetched Successfully");
        } else {
          this.notification.showError(results.description);
        }
      });
    } else {
      let myDialog = this.dialog.open(UserdialogComponent, {
        disableClose: true,
        position: {
          top: "5%",
        },
      });
      myDialog.afterClosed().subscribe((data) => {
        this.confirmvalue = data;
        if (this.confirmvalue == 1) {
          let datal = {
            date: this.datepipe.transform(
              this.integrityCheck.controls["InterSelectDate"].value,
              "yyyy-MM-dd"
            ),
            file: 0,
            branch_code: this.branchCodeEmp,
          };
          let file = 0;
          this.overwrite = 1;
          this.SpinnerService.show();
          this.interService
            .glFetchS(datal, file, this.overwrite)
            .subscribe((results) => {
              this.SpinnerService.hide();
              this.pagination = results.pagination
                ? results.pagination
                : this.pagination;
              if (results.status == "success") {
                this.notification.showSuccess("Files Fetched Successfully");
              } else {
                this.notification.showError(results.description);
              }
            });
        } else {
          this.showknockofftable = true;
        }
      });
    }
  }


  public newValue($event: any) {
    console.log("DATA FROM", $event);
  }

  checkPreviousGlUpload() {
    if (this.currentUser == "admin") {
      this.branchCodeEmp = this.integrityCheck.controls["branchs"].value;
    } else {
      this.branchCodeEmp = this.empbranchid;
    }
    this.uploadtype = this.integrityCheck.controls["ctrl_uploadtype"].value;
    this.autokdate = this.datepipe.transform(
      this.integrityCheck.controls["InterSelectDate"].value,
      "yyyy-MM-dd"
    );
    this.isGlPresent = 0;
    this.interService
      .IntegrityRunStatus(this.autokdate, this.branchCodeEmp, this.uploadtype)
      .pipe(
        map((results) => results?.gl_data),
        catchError((error) => {
          console.error(
            "An error occurred while fetching previous runs:",
            error
          );
          return of(null);
        })
      )
      .subscribe(
        (glData) => {
          if (typeof glData === "boolean") {
            this.isGlPresent = glData ? 1 : 0;
          } else {
            console.warn("Unexpected type for glData:", typeof glData);
          }
        },
        (error) => {
          console.error(
            "An error occurred while subscribing to previous runs:",
            error
          );
        }
      );
  }
  //bank_data
  checkPreviousBankUpload() {
    if (this.currentUser == "admin") {
      this.branchCodeEmp = this.integrityCheck.controls["branchs"].value;
    } else {
      this.branchCodeEmp = this.empbranchid;
    }
    this.uploadtype = this.integrityCheck.controls["ctrl_uploadtype"].value;
    this.autokdate = this.datepipe.transform(
      this.integrityCheck.controls["InterSelectDate"].value,
      "yyyy-MM-dd"
    );
    this.isBankPresent = 0;
    this.interService
      .IntegrityRunStatus(this.autokdate, this.branchCodeEmp, this.uploadtype)
      .pipe(map((results) => results?.bank_data))
      .subscribe((bankData) => {
        this.isBankPresent = bankData ? 1 : 0;
      });
  }


  gethistorydata() {
    this.interService.getknockoffSearchDate().subscribe((results) => {
      if (!results) {
        return false;
      }
      this.SpinnerService.hide();
      this.dateLists = results["data"];
      const transactionDates = this.dateLists?.map(
        (item) => item.transaction_date
      );
      // this.unqiueDates = [...new Set(transactionDates)];
      this.pagination = results.pagination
        ? results.pagination
        : this.pagination;
    });
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
            if (atBottom) {
              if (this.has_nextid) {
                this.taservice
                  .getUsageCode(
                    this.inputasset.nativeElement.value,
                    this.has_presentid + 1
                  )
                  .subscribe((data) => {
                    let dts = data["data"];
                    this.has_presentid++;
                    let pagination = data["pagination"];
                    this.branchlist = this.branchlist.concat(dts);
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
    });
  }
  setSelectedBranchCode() {
    const selectedBranch = this.integrityCheck.get("branchs").value;
    if (selectedBranch) {
      this.integrityCheck.get("branchs").setValue(selectedBranch.code);
    }
  }
  branchslist() {
    this.taservice.getUsageCode("", 1).subscribe((result) => {
      let data = result["data"];
      this.branchlist = data;
    });
  }

  selectBranch(e) {
    let branchvalue = e.code;
    this.integrityCheck.get("branchs").setValue(branchvalue);
  }

  //New Changes @21 JAN by Hari 
  subModuleData(data) {
    if (data.name == 'File Upload') {
      this.isfileUpload = true;
      this.isviewData = false;
      this.isHistory = false;
    }
    if (data.name == 'View Data') {
      this.isfileUpload = false;
      this.isviewData = true;
      this.isHistory = false;
    }
    if (data.name == 'History') {
      this.isfileUpload = false;
      this.isviewData = false;
      this.isHistory = true;
    }
  }

  onFileSelected(evt) {

  }

  formatIndianRupeeWithCommas(value: number): string {

    if (isNaN(value)) return null;

    let numberParts = value.toString().split('.');
    let rupees = numberParts[0];
    let paise = numberParts.length > 1 ? '.' + numberParts[1] : '';

    let lastThree = rupees.substring(rupees.length - 3);
    let otherNumbers = rupees.substring(0, rupees.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const formattedRupees = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    return '₹ ' + formattedRupees + paise;
  }
  selectrunbal(event: MatDatepickerInputEvent<Date>, page) {
    //   const nonZeroObj = this.listOfObjs.find(obj => obj.value === 'non_zero');
    //   if (nonZeroObj) {
    //   this.integrityCheck.get('filterProduct').patchValue({
    //     name: "non zero", 
    //     id: "2", 
    //     value: "non_zero"
    //   });
    //   this.onChangeRBF();
    // }
    let date = event;
    console.log("date", date);
    if (date) {
      const nonZeroObj = this.listOfObjs.find(obj => obj.value === 'non_zero');
      if (nonZeroObj) {
        this.myForm.get('filterProduct').patchValue(nonZeroObj);
      }
      this.onChangeRBF(page)
    }
    this.interintegrity_transaction_summaryapi ={ method: "get",
      url: this.url + "integrityserv/s3_excel_upload",
      params: "&int_type="+this.file_id + "&test=1" }
  }
  dblink_submit() {
    let validation = this.dblinkcreationform.value
    if (validation.ip_address === '' || validation.ip_address === null || validation.ip_address === undefined) {
      this.notification.showError('Enter Ip Address')
      return
    }
    if (validation.port === '' || validation.port === null || validation.port === undefined) {
      this.notification.showError('Enter Port')
      return
    }
    if (validation.db_name === '' || validation.db_name === null || validation.db_name === undefined) {
      this.notification.showError('Enter Connection name')
      return
    }
    if (validation.user === '' || validation.user === null || validation.user === undefined) {
      this.notification.showError('Enter User')
      return
    }
    if (validation.password === '' || validation.password === null || validation.password === undefined) {
      this.notification.showError('Enter Password')
      return
    }
    let value = this.dblinkcreationform.value
    console.log('value', value)
    this.SpinnerService.show()
    this.interService.db_linkcreation(value).subscribe(res => {
      this.SpinnerService.hide()
      if (res.status) {
        this.notification.showSuccess(res.message)
        this.db_search(this.dbtype)
        this.dblinkcreationform.reset()
        this.closebuttonclosed.nativeElement.click();
      }
      else {
        this.notification.showError(res.description)
      }

    })

  }
  db_search(type) {
    this.dbtype = type
    let value = this.dblinksearch.value
    console.log(value, 'value')
    let params = ''
    if (value.db_name) {
      params += '&db_name=' + value.db_name
    }
    if (value.username) {
      params += '&user_name=' + value.username
    }
    this.dbsummary(params)
    this.popupopen1()
  }
  db_reset() {
    this.dblinksearch.reset()
    this.db_search(this.dbtype)
  }
  getbacktomain() {
    this.type_id.emit(false)
  }
  dbsummary(params) {
    this.SpinnerService.show()
    this.interService.dbsummary(this.paginationdb.index, params).subscribe(res => {
      this.SpinnerService.hide()
      this.dbsummararray = res['data']
      this.paginationdb = res.pagination
      console.log(this.dbsummararray, 'dbsummararray')
    })
  }
  prevpage() {
    this.paginationdb.index = this.paginationdb.index - 1
    this.db_search(this.dbtype)
  }


  nextpage() {
    this.paginationdb.index = this.paginationdb.index + 1
    this.db_search(this.dbtype)
  }
  toggledbtemp(data) {
    console.log(data)
    let status: any = ''
    if (data.status === 0) {
      status = 1
    }
    else {
      status = 0
    }
    this.interService.dblink_statuschange(data.id, status).subscribe(res => {
      if (res.status) {
        this.notification.showSuccess(res.message)
        this.db_search(this.dbtype)
      }
      else {
        this.notification.showError(res.description)
      }

    })
  }
  api_search(type) {
    this.type = type
    let value = this.apicallsearch.value
    console.log(value, 'value')
    let params = ''
    if (value.api_name) {
      params += '&api_name=' + value.api_name
    }
    if (value.methods) {
      params += '&methods=' + value.methods
    }
    if (value.status) {
      params += '&status=' + value.status
    }
    this.getapicallsummary(params)
    this.popupopenapicall()
  }
  api_reset() {
    this.apicallsearch.reset()
    this.api_search(this.type)
  }
  apicall_submit() {
    let validation = this.apicallcreationform.value
    if (validation.api_name === '' || validation.api_name === null || validation.api_name === undefined) {
      this.notification.showError('Enter Api Name')
      return
    }
    if (validation.api_url === '' || validation.api_url === null || validation.api_url === undefined) {
      this.notification.showError('Enter Api Url')
      return
    }
    if (validation.methods === '' || validation.methods === null || validation.methods === undefined) {
      this.notification.showError('Choose Methods')
      return
    }
    if (validation.params === '' || validation.params === null || validation.params === undefined) {
      this.notification.showError('Enter Params')
      return
    }
    if (validation.payloads === '' || validation.payloads === null || validation.payloads === undefined) {
      this.notification.showError('Enter Payload')
      return
    }
    if (validation.description === '' || validation.description === null || validation.description === undefined) {
      this.notification.showError('Enter Description')
      return
    }
    let value = this.apicallcreationform.value
    console.log('value', value)
    if (value.payloads) {
      try {
        value.payloads = JSON.parse(value.payloads);
      } catch (error) {
        console.error('Error parsing payloads:', error);
      }
    }
    if (value.params) {
      try {
        value.params = JSON.parse(value.params);
      } catch (error) {
        console.error('Error parsing payloads:', error);
      }
    }

    this.interService.apicall_creation(value).subscribe(res => {
      if (res.status) {
        this.notification.showSuccess(res.message)
        this.apicallcreationform.reset()
        this.closebuttonclosedapi.nativeElement.click();
      } else {
        this.notification.showError(res.description)
      }
    })
  }
  prevpageapi() {
    this.paginationapi.index = this.paginationapi.index - 1
    this.api_search(this.type)
  }
  nextpageapi() {
    this.paginationapi.index = this.paginationapi.index + 1
    this.api_search(this.type)
  }
  dbgetquery(data) {
    this.clearfullquery()
    this.closebuttonclosed.nativeElement.click();
    console.log(data, 'data')
    this.dbpassword = data.password
    this.dbusername = data.user
    this.dbport = data.port
    this.dbipaddress = data.ip_address

    this.schemadropdown()
    this.popupopendbquerry()
  }
  schemadropdown() {
    this.interService.dbschema(this.dbusername, this.dbpassword, this.dbport, this.dbipaddress, 1, '').subscribe(res => {
      this.schemaarray = res['schemas']
    })
  }
  schemavalidate() {
    this.dbqueryform.get('table_name').reset()
    this.dbqueryform.get('where').reset()
    this.interService.dbschema(this.dbusername, this.dbpassword, this.dbport, this.dbipaddress, 1, this.schema_input.nativeElement.value).subscribe(res => {
      this.schemaarray = res['schemas']
    })

  }
  schemaselect(data) {
    this.schemavalue = data
    this.dbqueryform.get('select').patchValue('select * from ' + this.schemavalue)
    this.dbqueryform.get('table_name').reset()
    this.dbqueryform.get('where').reset()
    this.selectedColumns = []
    this.tablearray = []
    this.wherearray = []
    let formArray = this.dbqueryform.get('conditions') as FormArray;
    formArray.clear()
    this.interService.dbtable(this.dbusername, this.dbpassword, this.dbport, this.dbipaddress, this.schemavalue, 1, '').subscribe(res => {
      this.tablearray = res['tables']
    })

  }
  searchtable() {
    this.interService.dbtable(this.dbusername, this.dbpassword, this.dbport, this.dbipaddress, this.schemavalue, 1, this.table_input.nativeElement.value).subscribe(res => {
      this.tablearray = res['tables']
    })
  }
  checkshecma() {
    let value = this.dbqueryform.get('schema').value
    if (value === '' || value === null || value === undefined) {
      this.notification.showWarning('Select Schema')
      return
    }
  }
  tableselect(data) {
    this.tablevalue = data
    this.dbqueryform.get('select').patchValue('select * from ' + this.schemavalue + '.' + this.tablevalue)
    this.dbqueryform.get('where').reset()
    this.selectedColumns = []
    this.wherearray = []
    let formArray = this.dbqueryform.get('conditions') as FormArray;
    formArray.clear()
    this.interService.dbwhere(this.dbusername, this.dbpassword, this.dbport, this.dbipaddress, this.schemavalue, this.tablevalue, 1).subscribe(res => {
      this.wherearray = res['columns']
    })
  }
  checktable_schema() {
    let value = this.dbqueryform.get('schema').value
    if (value === '' || value === null || value === undefined) {
      this.notification.showWarning('Select Schema')
      return
    }
    let table = this.dbqueryform.get('table_name').value
    if (table === '' || table === null || table === undefined) {
      this.notification.showWarning('Select table')
      return
    }
  }
  toggleSelection(column: string, event: MouseEvent) {
    event.stopPropagation();
    // this.columnvalue=column
    if (this.selectedColumns.includes(column)) {

      this.selectedColumns = this.selectedColumns.filter(c => c !== column);
    } else {

      this.selectedColumns.push(column);
    }

    this.dbqueryform.get('where')?.patchValue(this.selectedColumns.join(', '));
    if (this.selectedColumns.length > 0) {
      this.dbqueryform.get('select').patchValue('select ' + this.selectedColumns.join(', ') + ' from ' + this.schemavalue + '.' + this.tablevalue)
    }
    if (this.selectedColumns.length === 0) {
      this.dbqueryform.get('select').patchValue('select * from ' + this.schemavalue + '.' + this.tablevalue)
    }
  }

  adddbconditions() {
    let value = this.dbqueryform.get('schema').value
    if (value === '' || value === null || value === undefined) {
      this.notification.showWarning('Select Schema')
      return
    }
    let table = this.dbqueryform.get('table_name').value
    if (table === '' || table === null || table === undefined) {
      this.notification.showWarning('Select table')
      return
    }
    let validate = this.dbqueryform.get('conditions').value
    for (let x of validate) {
      let index = validate.findIndex(item => item === x);
      if (x.con === '' || x.column === '' || x.value === '') {
        this.notification.showWarning('Fill condition '+ (index+1) +' datas to add another condition')
        return
      }
    }
    let form
    if (this.conditions.length === 0) {
      form = this.fb.group({
        con: [''],
        column: [''],
        value: [''],
      });
      form.array = ['where']
    }
    if (this.conditions.length > 0) {
      form = this.fb.group({
        con: [''],
        column: [''],
        value: [''],
      });
      form.array = ['AND', 'OR', 'None']
    }

    this.conditions.push(form);
  }
  conditionadd() {
    let conditionsArray = this.dbqueryform.get('conditions').value;
    console.log(conditionsArray)
    let queryBase
    if (this.selectedColumns.length > 0) {
      queryBase = 'select ' + this.selectedColumns.join(', ') + ' from ' + this.schemavalue + '.' + this.tablevalue
    }
    if (this.selectedColumns.length === 0) {
      queryBase = 'select * from ' + this.schemavalue + '.' + this.tablevalue
    }
    let conditionParts = [];

    for (let condition of conditionsArray) {
      if (condition.value) {
        conditionParts.push(` ${condition.con} ${condition.column} = ${condition.value}`);
      } else {
        conditionParts.push(` ${condition.con} ${condition.column}`);
      }
    }
    let whereClause = conditionParts.length > 0 ? '' + conditionParts.join('') : '';

    let finalQuery = queryBase + whereClause;

    this.dbqueryform.get('select').patchValue(finalQuery.trim());
  }
  executequery() {
    let query = this.dbqueryform.get('select').value;
    console.log(typeof (query))
    // let value = this.dbqueryform.get('schema').value
    // if (value === '' || value === null || value === undefined) {
    //   this.notification.showWarning('Select Schema')
    //   return
    // }
    // let table = this.dbqueryform.get('table_name').value
    // if (table === '' || table === null || table === undefined) {
    //   this.notification.showWarning('Select table')
    //   return
    // }
    // let validate = this.dbqueryform.get('conditions').value
    // for (let x of validate) {
    //   if (x.con === '' || x.column === '' || x.value === '') {
    //     this.notification.showWarning('Fill Above condition datas')
    //     return
    //   }
    // }
    this.autokdate1 = this.datepipe.transform(this.integrityCheck.controls["InterSelectDate"].value, "yyyy-MM-dd");
    this.interService.executequery(this.dbusername, this.dbpassword, this.dbport, this.dbipaddress, query, this.dbtype, this.autokdate1, this.templatename, this.file_id).subscribe(res => {
      console.log(res)
      let response=res['data']
      if(response){
        this.notification.showSuccess(response[0].key)
        this.closebuttonclosedqueery.nativeElement.click();
      }
      if(res.description){
        this.notification.showError(res.description)
      }
    })
  }
  clearfullquery() {
    this.dbqueryform.reset()
    let formArray = this.dbqueryform.get('conditions') as FormArray;
    formArray.clear()
    this.dbqueryform.get('select').patchValue('select *')
    this.tablearray = []
    this.wherearray = []
    this.selectedColumns = []
  }
  getapicallsummary(params) {
    this.SpinnerService.show()
    this.interService.getapi_summary(this.paginationapi.index, params).subscribe(res => {
      this.SpinnerService.hide()
      this.apisummararray = res['data']
      this.paginationapi = res.pagination
    })
  }
  apicallaction(sum) {
    console.log(sum, 'sum')
    this.autokdate1 = this.datepipe.transform(this.integrityCheck.controls["InterSelectDate"].value, "yyyy-MM-dd");
    let payload = {
      "api_name": sum.api_name,
      'api_url': sum.api_url,
      'methods': sum.methods,
      'params': sum.params,
      'payloads': sum.payoads,
      'type': this.type,
      'date': this.autokdate1,
      'temp_name': this.templatename,
      'int_type': this.file_id
    }
    console.log(payload)
    this.SpinnerService.show()
    this.interService.apicall_action(payload).subscribe(res => {
      this.SpinnerService.hide()
      console.log(res)
      if (res.status) {
        this.notification.showSuccess(res.message)
        this.closebuttonclosedapi.nativeElement.click();
      }
      else {
        this.notification.showError(res.description)
      }
    })
  }
  tempselect(data) {
    this.templatename = data
  }
  templatearray: any[] = []
  gettemplateval() {
    this.interService.newtemplate(this.paginationtemp.index,'').subscribe(results => {
      this.templatearray = results['data']
      this.paginationtemp = results.pagination
    })
  }
  searchtemp(){
    this.paginationtemp.index=1
    this.interService.newtemplate(this.paginationtemp.index,this.templateinput.nativeElement.value).subscribe(results => {
      this.templatearray = results['data']
      this.paginationtemp = results.pagination
    })
  }
  autocompletewisefinxlScroll() {
    this.hasschema_next = true;
    this.hasschema_previous = true;
    this.current_schema_page = this.current_schema_page + 1
    setTimeout(() => {
      if (
        this.schemaref &&
        this.autocompleteTrigger &&
        this.schemaref.panel
      ) {
        fromEvent(this.schemaref.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.schemaref.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.schemaref.panel.nativeElement.scrollTop;
            const scrollHeight = this.schemaref.panel.nativeElement.scrollHeight;
            const elementHeight = this.schemaref.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hasschema_next === true) {
                // this.schema_input.nativeElement.value           
                this.interService.dbschema(this.dbusername, this.dbpassword, this.dbport, this.dbipaddress, this.current_schema_page, this.schema_input.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["schemas"];

                    this.schemaarray = this.schemaarray.concat(datas);
                    this.current_schema_page = this.current_schema_page + 1
                  })
              }
            }
          });
      }
    });
  }
  autocompletetableScroll() {
    this.hastable_next = true;
    this.current_table_page = this.current_table_page + 1
    setTimeout(() => {
      if (
        this.tableref &&
        this.autocompletetableTrigger &&
        this.tableref.panel
      ) {
        fromEvent(this.tableref.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.tableref.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetableTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.tableref.panel.nativeElement.scrollTop;
            const scrollHeight = this.tableref.panel.nativeElement.scrollHeight;
            const elementHeight = this.tableref.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hasschema_next === true) {
                // this.schema_input.nativeElement.value           
                this.interService.dbtable(this.dbusername, this.dbpassword, this.dbport, this.dbipaddress, this.schemavalue, this.current_table_page, this.table_input.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["tables"];

                    this.tablearray = this.tablearray.concat(datas);
                    this.current_table_page = this.current_table_page + 1
                  })
              }
            }
          });
      }
    });
  }
  autocompletetemplateScroll(){
    setTimeout(() => {
      if (
        this.temp &&
        this.autocomplettemplateTrigger &&
        this.temp.panel
      ) {
        fromEvent(this.temp.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.temp.panel.nativeElement.scrollTop),
            takeUntil(this.autocomplettemplateTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.temp.panel.nativeElement.scrollTop;
            const scrollHeight = this.temp.panel.nativeElement.scrollHeight;
            const elementHeight = this.temp.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.paginationtemp.has_next === true) {
                // this.schema_input.nativeElement.value           
                this.interService.newtemplate(this.paginationtemp.index+1,this.templateinput.nativeElement.value).subscribe(results => {
                    let datas = results["data"];

                    this.templatearray = this.templatearray.concat(datas);
                   this.paginationtemp=results.pagination
                  })
              }
            }
          });
      }
    });
  }
  editdblinks(data) {
    this.dblink_id = data.id
    this.closebuttonclosed.nativeElement.click();
    this.dblinkupdateform.patchValue({
      ip_address: data.ip_address,
      port: data.port,
      db_name: data.db_name,
      user: data.user,
      password: data.password

    })
    this.popupopendbedit()
  }
  dblink_update() {
    let validation = this.dblinkupdateform.value
    if (validation.ip_address === '' || validation.ip_address === null || validation.ip_address === undefined) {
      this.notification.showError('Enter Ip Address')
      return
    }
    if (validation.port === '' || validation.port === null || validation.port === undefined) {
      this.notification.showError('Enter Port')
      return
    }
    if (validation.db_name === '' || validation.db_name === null || validation.db_name === undefined) {
      this.notification.showError('Enter Connection name')
      return
    }
    if (validation.user === '' || validation.user === null || validation.user === undefined) {
      this.notification.showError('Enter User')
      return
    }
    if (validation.password === '' || validation.password === null || validation.password === undefined) {
      this.notification.showError('Enter Password')
      return
    }
    let value = this.dblinkupdateform.value
    console.log('value', value)
    value.id = this.dblink_id
    this.SpinnerService.show()
    this.interService.db_linkcreation(value).subscribe(res => {
      this.SpinnerService.hide()
      if (res.status) {
        this.notification.showSuccess(res.message)
        this.db_search(this.dbtype)
        this.dblinkupdateform.reset()
        this.closedblinkedit.nativeElement.click();
      }
      else {
        this.notification.showError(res.description)
      }

    })
  }
  editapicalls(data) {
    this.apicall_id = data.id
    this.closebuttonclosedapi.nativeElement.click();
    this.apicallupdateform.patchValue({
      api_url: data.api_url,
      payloads: data.payoads,
      api_name: data.api_name,
      params: data.params,
      methods: data.methods,
      description: data.description,
    })
    this.popupopenapiedit()
  }
  apicall_update() {
    let validation = this.apicallupdateform.value
    if (validation.api_name === '' || validation.api_name === null || validation.api_name === undefined) {
      this.notification.showError('Enter Api Name')
      return
    }
    if (validation.api_url === '' || validation.api_url === null || validation.api_url === undefined) {
      this.notification.showError('Enter Api Url')
      return
    }
    if (validation.methods === '' || validation.methods === null || validation.methods === undefined) {
      this.notification.showError('Choose Methods')
      return
    }
    if (validation.params === '' || validation.params === null || validation.params === undefined) {
      this.notification.showError('Enter Params')
      return
    }
    if (validation.payloads === '' || validation.payloads === null || validation.payloads === undefined) {
      this.notification.showError('Enter Payload')
      return
    }
    if (validation.description === '' || validation.description === null || validation.description === undefined) {
      this.notification.showError('Enter Description')
      return
    }

    let value = this.apicallupdateform.value
    console.log('value', value)
    if (value.payloads) {
      try {
        value.payloads = JSON.parse(value.payloads);
      } catch (error) {
        console.error('Error parsing payloads:', error);
      }
    }
    if (value.params) {
      try {
        value.params = JSON.parse(value.params);
      } catch (error) {
        console.error('Error parsing payloads:', error);
      }
    }
    value.id = this.apicall_id
    this.interService.apicall_creation(value).subscribe(res => {
      if (res.status) {
        this.notification.showSuccess(res.message)
        this.apicallupdateform.reset()
        this.closeapicalledit.nativeElement.click();
      } else {
        this.notification.showError(res.description)
      }
    })
  }
  dblinktabchange(event){
    this.viewtabchange = event.tab.textLabel;
    console.log('ssssss',this.viewtabchange)
    if(this.viewtabchange==='DB Link Summary'){

    }
    if(this.viewtabchange==='Run summary'){
      this.getdblinkrunsummary()
    }
  }
  getdblinkrunsummary(){
    this.SpinnerService.show()
    this.interService.dblink_runintegrity(this.file_id,this.paginationdbrun.index).subscribe(res=>{
      this.SpinnerService.hide()
      this.dbrunintegrityarray=res['data']
      console.log('dbrunintegrityarray',this.dbrunintegrityarray)
      if(res.pagination){
        this.paginationdbrun=res.pagination
      }
    })
  }
  prevpageadrun(){
    this.paginationdbrun.index= this.paginationdbrun.index-1
this.getdblinkrunsummary()
  }
  nextpagedbrun(){
    this.paginationdbrun.index= this.paginationdbrun.index+1
this.getdblinkrunsummary()
  }
  deletesummaryid(data){
console.log(data.id,'id')
this.interService.delete_dblink_summary(data.id).subscribe(res=>{
  if(res.status){
    this.notification.showSuccess(res.message)
    this.closebuttonclosed.nativeElement.click();
    this.getdblinkrunsummary()
  }
  else{
    this.notification.showError(res.description)
    
  }
})
  }
  popupopen1() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("dblinkpopup"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
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
  popupopenapicall() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("apicallpopup"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopenapiedit() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("editapicall"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }
  popupopenviewdata() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("viewdata"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
    this.interintegrity_transaction_summaryapi ={ method: "get",
      url: this.url + "integrityserv/s3_excel_upload",
      params:"&int_type="+this.file_id + "&test=1"
    }
  }
  popupopenwisefintb() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("myModal1"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }

  statusfunction(status){
    let config: any = {
      disabled: false,
      style: "",
      class: "",
      value: "",
      checked: "",
      function: false,
    };

    if(status.integrity_status == 0){
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "Start",
        checked: "",
        function: false,
      };
    }

    else if(status.integrity_status == 1){
      config = {
        disabled: false,
        style: "",
        class: "",
        value: "Active",
        checked: "",
        function: false,
      };
    }
else if(status.integrity_status == 2){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Started",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 3){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Processing",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 4){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Success",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 5){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed BSCC FILE",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 6){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed JVFILE",
    checked: "",
    function: false,
  };
}

else if(status.integrity_status == 7){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed JW FILE",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 8){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed FAFILE",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 9){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed Minor FILE",
    checked: "",
    function: false,
  };
}
else if(status.integrity_status == 10){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: "Failed",
    checked: "",
    function: false,
  };
}

else if(status.integrity_status == 10){
  config = {
    disabled: false,
    style: "",
    class: "",
    value: status.integrity_status,
    checked: "",
    function: false,
  };
}
return config
  }


  reset(){
    this.interintegrity_trans_summaryapi = { method: "get",
      url: this.url + "integrityserv/auto_fetch_summary",
      params: ""}
  }

  typestatus(type){
    let config: any = {
      style: "",
      value: "",
      class: ""
    };
    if (type.type == 2) {
      config = {
        class: "",
        style: "",
        value: "External",
      }
    }
    else if (type.type == 1){
      config = {
        class: "",
        style: "",
        value: "Wisefin",
      }
    }
    else if (type.type == 3){
      config = {
        class: "",
        style: "",
        value: "Integrity",
      }
    }
    else if (type.type){
      config = {
        class: "",
        style: "",
        value: type.type,
      }
    }
    return config
  }
  status(status){
    let config: any = {
      style: "",
      value: "",
      class: ""
    };
    if (status.status == 2) {
      config = {
        class: "",
        style: "",
        value: "Started",
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
  searchinterintegritytranscation(summary){
    this.interintegrity_transaction_summaryapi ={ method: "get",
      url: this.url + "integrityserv/s3_excel_upload",
      params:"&int_type="+this.file_id + "&test=1" + summary}
  }
  s3_download_status(data){
    console.log("download",data.id)
    let fileName=data.file_name
    let FILE = fileName.split('.')[0];
    this.SpinnerService.show();
     this.documentService.s3_download(data.id).subscribe((results: any[])=> {
       this.SpinnerService.hide();
       let binaryData = [];
       binaryData.push(results)
       let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
       let link = document.createElement('a');
       link.href = downloadUrl;
       link.download = FILE+".xlsx";
       link.click();
     });
  
   }

   status_modify_data(data){
    console.log("type",data.type)
    console.log("date",data.date)
    console.log("status",status)
    let dataApprove = confirm("Are you sure, Do you want to Delete?")
     if (dataApprove == false) {
       return false;
     }
    // if(data.status == 1){
    //   this.status_modi = 0
    //   console.log("status change 1 to 0",this.status_modi)
    // }
    // if(data.status == 0){
    //   this.status_modi = 1
    // }
    // if(data.status == 4){
    //  this.status_modi = 0
    // }
    // if(data.status == 3){
    //  this.status_modi = 0
    // }
    // if(data.status == 2){
    //  this.status_modi = 0
    // }
    this.SpinnerService.show();
    this.documentService.status_modify(data.date,data.type,this.status_modi).subscribe((results) => {
      this.SpinnerService.hide();
      if (results.status == "success") {
       this.notification.showSuccess("successfully updated");
       this.onChangeRBF()
       this.interintegrity_transaction_summaryapi ={ method: "get",
        url: this.url + "integrityserv/s3_excel_upload",
        params: "&int_type="+this.file_id + "&test=1"}
      } else {
        this.notification.showError(results.description);
      }
  
    });
  }
  close(){
    this.closeintegritytransactionpopup.nativeElement.click()
    this.restforminter = []
  }
  integritytransdata(inter){
    this.integrityCheck.patchValue({
      templatename:inter.template_name
    })
  }
  clicktodowntemp(type,data){
    this.interService.download_integrity_template(type).subscribe((res=>{
      let binaryData = [];
      binaryData.push(res);
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement("a");
      link.href = downloadUrl;
      link.download = data+"_template" + ".xlsx";
      link.click();
    }))
  }
 
}


@Component({
  selector: "dialog-contents",
  templateUrl: "../dialog_contents.html",
})
export class DialogContents { }
