import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ProofingService } from "../proofing.service";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { DatePipe, formatDate } from "@angular/common";
import { NotificationService } from "../notification.service";
import { ShareService } from "../share.service";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  NativeDateAdapter,
} from "@angular/material/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { element } from "protractor";

// const Colors = ["#22fa92", "#b6a330", "#62fbb1", "#8dd55d", "#b2c072", "#24fbbe", "#50f8fc","#e4ff98","#41e740"];
const Colors = ["#faf8d4", "#e9eff5", "#f7f6f2"];
const datePickerFormat = {
  parse: { dateInput: { month: "short", year: "numeric", day: "numeric" } },
  display: {
    dateInput: "input",
    monthYearLabel: { year: "numeric", month: "short" },
    dateA11yLabel: { year: "numeric", month: "long", day: "numeric" },
    monthYearA11yLabel: { year: "numeric", month: "long" },
  },
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === "input") {
      return formatDate(date, "dd-MMM-yyyy", this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: "app-proofing-map",
  templateUrl: "./proofing-map.component.html",
  styleUrls: ["./proofing-map.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: datePickerFormat },
    DatePipe,
  ],
  // encapsulation: ViewEncapsulation.None
})
export class ProofingMapComponent implements OnInit {
  selectedDate = new Date();
  partially = new FormControl("");
  unmap = new FormControl("");
  sumofDebit: number = 0; // Replace with your actual value
  sumofCredit: number = 0; // Replace with your actual value
  refno: string = "";
  partiallypagination: boolean = false;
  unmappedpagination: boolean = false;
  patternpagination: boolean = false;
  showMatchedFlag: boolean = true;
  showdisableicon: boolean = true;
  disableshowicon: boolean = false;
  accoutnumber: any;
  statusboolean: boolean;
  checkbox = new FormControl("");
  // getRandomColor() {
  // throw new Error('Method not implemented.');
  // }

  tablerowstyles = (color) => {
    let styles = {
      "background-color": color,
    };
    return styles;
  };
  @ViewChild("closebutton") closebutton;
  @ViewChild("selectall") selectall: any;
  @ViewChild("closeaddpopup") closeaddpopup;
  @ViewChild("closeaddpopups") closeaddpopups;
  @ViewChild("closefilepopup") closefilepopup;
  dp: boolean[][] = null;
  images: any;
  tempId: any;
  accountid: any;
  uploadForm: FormGroup;
  paritallymapid: any;
  iconcondiction: boolean = false;
  // knockForm: FormGroup;
  proofingList = [];
  ProofingList_Desc = [];
  iconclass = null;
  transactionMapFilter = [
    { id: [1, 2, 3], value: "All" },
    { id: [1], value: "Auto Knockoff" },
    { id: [2], value: "Partially Mapped" },
    { id: 4, value: "Unmapped" },
    { id: [3], value: "Mapped" },
  ];
  mapfiltervalue = "All";
  balanceMapFilter: string[] = ["All", "Mapped", "Partially Mapped"];
  sortby: string[] = ["Date", "Debit", "Credit"];
  sorttype: string[] = ["Ascending", "Descending"];
  matchcolumn: string[] = [
    "All",
    "Amount",
    "Description",
    "ReferenceNo",
    "UserReference",
  ];
  sorttype_filter1: any;
  matchcolumn_filter: any;
  sortby_filter1: any;
  sorttype_filter2: any;
  sortby_filter2: any;
  colorarray = [];
  creditrowCount: any = 0;
  knockoffList = [];
  selectedList = [];
  LabelList: Array<any>;
  checkedItems: any = [];
  noofchars: any = 8;
  noofcharsdesc: any = 8;
  noofcharsrefno: any = 8;
  noofcharsuserrefno: any = 8;
  RemarksLabelid: any;
  RemarksRefNo: any;
  remarks: any;
  presentpage: any;
  paterenpresentpage: any;
  ShowMappingFlag: boolean = false;
  ShowMatchedFlag = false;
  Filtertype: any = "All";
  BalanceFiltertype: any = "All";
  finaljson: any;
  uploadFileList: Array<any>;
  templateDDList: Array<any>;
  AccountList: Array<any>;
  from_Date: any = null;
  to_Date: any = null;
  colorvalue = "";
  PrevColorValue = "";
  proofinglabelSort: Array<any>;
  jsonLabel: Array<any>;
  fromdate = new FormControl(new Date());
  todate = new FormControl(new Date());
  showpopup: boolean = false;
  accounts: any[] = [
    { id: 1, text: "Excel Upload" },
    { id: 2, text: "Data Fetch" },
  ];
  noofDebit: number = 0;
  noofCredit: number = 0;
  // selectedCheckboxState = new Map<any, boolean>();
  selectedCheckboxState: Map<string, boolean> = new Map();

  PartillyMappedId: any;
  selected: any;
  unmapped_net_balance: any;
  partially_net_balance: any;
  total_unmapped_balance: any;
  length_of_credit_autoknockoff: any;
  length_of_debit_autoknockoff: any;
  sum_of_credit_autoknockoff: any;
  sum_of_debit_autoknockoff: any;
  length_of_credit_partial: any;
  length_of_debit_partial: any;
  sum_of_credit_partial: any;
  sum_of_debit_partial: any;
  length_of_credit_unmap: any;
  length_of_debit_unmap: any;
  sum_of_credit_unmap: any;
  sum_of_debit_unmap: any;
  selectedAll: boolean;
  userDescription: FormGroup;
  tableid: number;
  descriptonDataList: any = [];
  attachmentsList: any = [];
  lableDocumentList: any = [];
  labelTableId: number;
  transactionFile: any;
  labelFile: any;
  attachmentTransactionList: any;
  attachmentLabelList: any;
  lableDataList: any;
  labeldatas: any;
  labelTransactionImages: FormGroup;
  autoknocklist = [];
  automapselectedlist = [];
  sortedlist = [];
  headerarray = [];
  unmappedlist: any;
  partiallymappedlist: any;
  mappedlist: any;
  manualmappedlist = [];
  manualpartiallymappedlist = [];
  autotopartialarray = [];
  accountobject;
  closingbalance: any;
  partially_closingbalance: any;
  unmapped_closingbalance: any;
  knockoff_closingbalance: any;
  totalcount_unmap: number;
  totalcount_partial: number;
  partial_map_size: number;
  patteren_map_size: number;
  knockoffstatus: any;
  knockofftotal: any;
  patterntotal: any;
  patternlistdata: any = [];
  parmap_pagination: Array<any> = [];
  unmap_pagination: Array<any> = [];
  filterdict = {
    All: [1, 2, 3],
    "Auto Knockoff": [1],
    "Partially Mapped": [2],
    Unmapped: [3],
  };

  titles = {
    title1: "Auto knockoff (Suggestion)",
    title2: "Manual Mapping Process",
    title5: "Mapped (Suggestion)",
    title3: "Partially Mapped (Suggestion)",
    title4: "Unmapped (Suggestion)",
    title6: "Auto to Partial mapping",
    title7: "Pattern (Suggestion)",
  };

  showautoknockoff: boolean = true;
  showmapped: boolean = true;
  showunmapped: boolean = true;
  showpartiallymapped: boolean = true;
  showpatternsuggestion: boolean = true;
  title1: boolean = true;
  title2 = true;
  title3 = true;
  title4 = true;
  title5 = true;
  title7 = true;

  autoarrayname = "Auto Knockoff";
  partialarrayname = "Partially Mapped";
  unmappedarrayname = "Unmapped";
  mappedarrayname = "Mapped";
  patternarrayname = "pattern";

  pipeinput: any = [];
  descinput: string = "";
  desclength: number;

  startlimit = 0;
  autoendlimit: number;
  mapendlimit: number;
  parmapendlimit: number;
  unmapendlimit: number;
  patternlimit: number;
  offsetlimit: number = 30;

  autoselectall: boolean = true;
  autohighlight: boolean = false;
  autotopartialflag: boolean = false;
  showautoknockbtn = false;
  autoinput = "";
  refnoinput = "";
  debitinput = "";
  creditinput = "";

  pautoinput = "";
  prefnoinput = "";
  pdebitinput = "";
  pcreditinput = "";

  uautoinput = "";
  urefnoinput = "";
  udebitinput = "";
  ucreditinput = "";

  knockautoinput = "";
  knockrefnoinput = "";
  knockdebitinput = "";
  knockcreditinput = "";

  patternaccountinput = "";
  patternDateinput = "";
  patterndebitinput = "";
  patterncreditinput = "";
  patternLabelinput = "";
  patterndesinput = "";

  autolength: number;
  mapinput = "";
  maplength: number;
  unmapinput = "";
  unmaplength: number;
  @ViewChild("divscroll") divscroll: ElementRef;
  subcriptions: Subscription[] = [];
  new_date = "";
  role: any;
  account_type: any;
  typelist: any = [
    { name: "Excel Upload", id: 1 },
    { name: "Data Fetch", id: 2 },
  ];
  selectedType = 1;
  currentDate: string;
  Data: any;
  refrence_crno: any;
  unmappedcurrentpage: number = 1;
  autocurrentpage: number = 1;
  partiallycurrentpage: number = 1;
  parterncurrentpage: number = 1;
  unmappage: number = 1;
  parmappage: number = 1;
  knockoffpage: number = 1;
  patterenpage: number = 1;
  partial_hasnext: boolean = false;
  partial_hasprevious: boolean = false;
  unmap_hasnext: boolean = false;
  unmap_hasprevious: boolean = false;
  knockoff_hasprevious: boolean = false;
  knockoff_hasnext: boolean = false;
  pattern_hasnext: boolean = false;
  pattern_hasprevious: boolean = false;
  accNumber: any;
  partially_search: any;
  mapsearch: any;
  proofingmap: any;
  filter: any;
  dataknockoff: any;
  statussummary: any;
  statusData: any;
  proofUrl = environment.apiURL;
  temp: any = {
    label_name: "",
    selected: false,
  };
  rulebutton: any;
  payloads: any;
  mappingp: any;
  mappingun: any;
  mappingknockoff: any;
  partternclick: any;
  pageSize: any = 10;
  currentunmappedpage: any;
  currentpagemappage: any;
  currentpartiallymappage: any;
  currentpatterntpamge: any;
  debit_credit = [
    { deb_cre: "D", value: "Debit" },
    { deb_cre: "C", value: "Credit" },
  ];
  statusfield: any = {
    label: "Dr/Cr",
    fronentdata: true,
    data: this.debit_credit,
    displaykey: "value",
    Outputkey: "deb_cre",
    valuekey: "deb_cre",
  };
  patternlist: any;
  creditaccount: any = [];
  mapppingdata:any
  ischecked:boolean
  unmappedid:any= []
  partiallymapped=new FormControl()
  unmappedform=new FormControl()
  knockoffform=new FormControl()
  patternform=new FormControl()
  partiallymappedsize: any=10
  unmappedsize: any=10
  knockoffsize: any=10
  pattersize: any=10
  constructor(
    private shareService: ShareService,
    private router: Router,
    private notification: NotificationService,
    private SpinnerService: NgxSpinnerService,
    private datePipe: DatePipe,
    private proofingService: ProofingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private toastr: ToastrService
  ) {
    // this.dataknockoff = {
    //   "account_no":this.knockoffstatus,
    //   "type": 3
    // }
    // console.log("showconsole", this.dataknockoff)
    // this.statussummary= { "method": "post", "url": this.proofUrl + "prfserv/schedular_status" ,data: this.dataknockoff }
    this.statusData = [
      { columnname: "Created date", key: "created_date" },
      { columnname: "Remarks", key: "remarks" },
    ];
    this.filter = {
      label: "filter",
      fronentdata: true,
      data: this.transactionMapFilter,
      displaykey: "value",
      Outputkey: "id",
      defaultvalue: { id: [1, 2, 3], value: "All" },
    };
    this.proofingmap = {
      label: "Account",
      method: "get",
      url: this.proofUrl + "prfserv/accounts",
      params: "",
      searchkey: "query",
      displaykey: "account_id_name",
      wholedata: true,
    };
    const currentDateObj = new Date();
    this.currentDate = currentDateObj.toISOString().split("T")[0];
    console.log(this.currentDate);

    this.mapsearch = [
      {
        type: "dropdown",
        inputobj: this.proofingmap,
        formvalue: "account_number",
      },
      {
        type: "input",
        label: "Pattern",
        formvalue: "pattern",
      },
      {
        type: "date",
        label: "Uploaded Date",
        defaultvalue: this.currentDate,
        datetype: "YYYY-MM-DD",
        formvalue: "transdate",
        disabled: true,
      },
      // { type: "dropdown", inputobj: this.filter, formvalue: "filter_type" },
      {
        type: "input",
        label: "Description Search",
        formvalue: "Descri_search",
      },
      { type: "input", label: "Reference No", formvalue: "ref_no" },
      { type: "dropdown", inputobj: this.statusfield, formvalue: "trans_typ" },
      // {
      //   type: "radiobutton",
      //   radiobuttondata: this.typelist,
      //   formvalue: "divamount",
      //   defaultvalue: 1,
      // },
    ];
    this.rulebutton = [
      {
        icon: "autorenew",
        tooltip: "Knockoff",
        function: this.knockoff.bind(this),
        name: "Knockoff",
      },
      {
        icon: "cloud_upload",
        tooltip: "RULE_UPDATE",
        function: this.rule_update.bind(this),
        name: "RULE UPDATE",
      },
      {
        icon: "message",
        tooltip: "Knockoff Status",
        function: this.knockoff_status_button.bind(this),
        name: "knockoff Status",
      },
      {
        icon: "message",
        tooltip: "rule Status",
        function: this.rule_status_button.bind(this),
        name: "Rule Status",
      },
    ];
  }
  ngOnDestroy() {
    // this.subcriptions.forEach(element => {
    //   element.unsubscribe()
    // })
    this.shareService.unsubscibe();
  }

  ngOnInit(): void {
    this.getTemplateDD();
    // this.getAccountList();
    this.color_choosing();
  //   this.checkSelectedListpar()
  // this.checkSelectedListmap()
    // this.Dynamic_colors(100);
    // this.get_Label();
    // let accno = this.accountobject.account_number
    // console.log ("asassadasa", accno)
    this.resetlimit();
    let sub1 = this.shareService.accountobject.subscribe((value) => {
      this.accountobject = value;
      console.log("accountobject", this.accountobject);
      this.accountid = this.accountobject?.id;
      if (
        this.accountid != "" &&
        this.accountid != undefined &&
        this.accountid != null
      ) {
        // this.gettemplates();
      }
      this.accNumber = this.accountobject?.account_number;
      console.log("Account NUMS", this.accNumber);

      // this.accountobject?.id ? this.gettemplates() : this.accountid = null;
      console.log("accountobject 2", this.accountobject);
    });
    this.shareService.subcriptions.push(sub1);
    // this.subcriptions.add(accountsubscribe);
  }

  // uppercase(){
  //   return this.uautoinput.toUpperCase
  // }
  resetlimit() {
    this.autoendlimit = this.offsetlimit;
    this.mapendlimit = this.offsetlimit;
    this.parmapendlimit = this.offsetlimit;
    this.unmapendlimit = this.offsetlimit;
  }
  show() {
    this.showpopup = true;
  }

  calculateDiff(sentDate) {
    // console.log(sentDate)
    var date1: any = new Date(sentDate);
    var date2: any = new Date();
    var diffDays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  getTemplateDD() {
    this.proofingService.getTemplateDD().subscribe((results: any) => {
      let data = results["data"];
      this.templateDDList = data;
    });
  }

  getAccountList() {
    this.proofingService.getAccount_List().subscribe((results: any) => {
      let data = results["data"];
      this.AccountList = data;
    });
  }

  tempDD(id) {
    this.tempId = id;
    return this.tempId;
  }

  gettemplates() {
    console.log("Template Id", this.accountobject.cbs_template.id);
    this.proofingService
      .getTemplateDetails(this.accountobject.cbs_template.id)
      .subscribe((response) => {
        this.resetlimit();
        this.accountid = this.accountobject.id;
        this.headerarray = response.details;
        this.headerarray.splice(3, 5);
        this.headerarray.push({
          sys_col_name: "",
          column_name: "Debit",
          class: "proofingheaderamount",
        });
        this.headerarray.push({
          sys_col_name: "",
          column_name: "Credit",
          class: "proofingheaderamount",
        });
        this.autoknocklist = [];
        this.partiallymappedlist = [];
        this.mappedlist = [];
        this.unmappedlist = [];
        // console.log(this.headerarray)
      });
    this.checkedItems = [];
    this.noofCredit = 0;
    this.noofDebit = 0;
    this.sumofCredit = 0;
    this.sumofDebit = 0;
    this.ShowMappingFlag = false;
    this.autotopartialflag = false;
    this.selectedList = [];
  }

  // mapfilterchanged() {
  //   let value = this.mapfiltervalue;
  //   this.showautoknockoff = false;
  //   this.showmapped = false;
  //   this.showunmapped = false;
  //   this.showpatternsuggestion = false;
  //   this.showpartiallymapped = false;
  //   if (value == "All") {
  //     this.showautoknockoff = true;
  //     this.showmapped = true;
  //     this.showunmapped = true;
  //     this.showpatternsuggestion = true
  //     this.showpartiallymapped = true;
  //   } else if (value == "Auto Knockoff") {
  //     this.showautoknockoff = true;
  //   } else if (value == "Mapped") {
  //     this.showmapped = true;
  //   } else if (value == "Unmapped") {
  //     this.showunmapped = true;
  //   } else if (value == "Partially Mapped") {
  //     this.showpartiallymapped = true;
  //   } else if (value == "Pattern"){
  //     this.showpatternsuggestion = true
  //   }
  // }
  OnBalanceFilterChange(e) {
    if (e.isUserInput == true) {
      this.BalanceFiltertype = e.source.value;
    }
  }
  OnSortTypeChange(e) {
    if (e.isUserInput == true) {
      this.sorttype_filter1 = e.source.value;
    }
  }
  OnMatchColumnChange(e) {
    if (e.isUserInput == true) {
      this.matchcolumn_filter = e.source.value;
    }
  }
  selectedaccountlist;
  selectedsortvalue;
  selectmatchcolum;
  selsectsorttypeitem;

  // @ViewChild('selectedElement') selectDropdown: MatSelect;
  ClearAll(e) {
    console.log("datas=>", e);
    this.fromdate.reset();
    this.todate.reset();
    this.from_Date = null;
    this.to_Date = null;
    this.accountid = "";
    this.account_type = 1;
    this.selectedaccountlist = "";
    this.selectedsortvalue = "";
    this.selectmatchcolum = "";
    this.selsectsorttypeitem = "";
    this.ProofingList_Desc = [];
    this.colorarray = [];
    this.knockoffList = [];
    this.proofingList = [];
    this.checkedItems = [];
    this.checkbox.reset();
    this.patternlist = [];
    this.selectedList = [];
    this.Selectedid = [];
    this.noofCredit = 0;
    this.noofDebit = 0;
    this.sumofCredit = 0;
    this.sumofDebit = 0;
    this.ShowMappingFlag = false;
    this.autotopartialflag = false;
    this.Filtertype = "All";
    this.BalanceFiltertype = "All";
    this.sortby_filter1 = "Date";
    this.sorttype_filter1 = "Ascending";
    this.matchcolumn_filter = "All";
    this.closingbalanceshown = false;
    this.showpartiallymapped = false;
    this.showmapped = false;
    this.showunmapped = false;
    this.showpatternsuggestion = false;
    this.selectedCheckboxState.forEach((value, key) => {
      this.selectedCheckboxState.set(key, false);
    });
    this.presentpage = 1;
    this.partiallycurrentpage = 1;
    this.unmappage = 1;
    this.knockoffpage = 1;
    this.paterenpresentpage = 1
    this.partiallymapped.reset()
    this.unmappedform.reset()
    this.knockoffform.reset()
    this.patternform.reset()
    this.partiallymappedsize=10
    this.unmappedsize=10
    this.knockoffsize=10
    this.pattersize=10 

    this.shareService.accountobject.next(null);
    this.partiallymap_func('');
    this.unmapped('');
    this.mapped_func('');
    this.pattern_suggestion('');
}


  // End of AddRefNo($event)

  fromDatechange(date: string) {
    this.from_Date = date;
    if (this.from_Date) {
      this.from_Date = this.datePipe.transform(this.from_Date, "yyyy-MM-dd");
    }
    return this.from_Date;
  }

  toDatechange(date: string) {
    this.to_Date = date;
    if (this.to_Date) {
      this.to_Date = this.datePipe.transform(this.to_Date, "yyyy-MM-dd");
    }
    return this.to_Date;
  }

  accountype(e, index) {
    this.account_type = e;
    // this.typelist=e.value;
    this.balanceObject = null;
    this.proofingList = [];
    this.autoknocklist = [];
    this.unmappedlist = [];
    this.mappedlist = [];
    this.partiallymappedlist = [];
    // window.location.reload();
  }

  displaydownload: boolean = false;
  downloadexlsearch() {
    let name = "Proofing Map";

    this.proofingService
      .transactiondownload(this.accountid, this.finaljson)
      .subscribe((data: any) => {
        let binaryData = [];
        binaryData.push(data);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = name + ".xlsx";
        link.click();
      });
  }
  valuenames: any = [];
  balanceObject: {
    dayentry_sumdebitamt: number;
    dayentry_sumcreditamt: number;
    dayentry_closingbalc: number;
    dayentry_openingbalc: number;
  } = null;
  colorsData: Array<any> = [];
  color_picker: Array<any> = [];
  color_match_pick: Array<any> = [];
  color_choosing() {
    //   this.color_picker=['rgba(0, 171, 13, 0.25)', 'rgb(183 64 58 / 43%)', 'rgb(187, 238, 164)', 'rgb(158, 148, 177)', 'rgb(255, 255, 153)','rgb(255, 204, 153 )','rgba(122, 95, 158, 0.2)','rgb(227, 210, 245)',
    //   'rgb(250 235 215)','rgb(211, 235, 233)','rgb(217, 235, 211)','rgba(70, 136, 145, 0.8)','rgba(70, 28, 5, 0.25)','rgba(0, 16, 255, 0.25)','rgba(255, 197, 15, 0.25)','rgba(255, 57, 15, 0.25)','rgba(255, 15, 119, 0.25)','rgba(15, 255, 247, 0.25)','rgba(22, 21, 20, 0.2)',
    //   'rgba(157, 94, 140, 0.2)','rgba(158, 151, 95, 0.71)','rgba(117, 35, 51, 0.41)','rgba(149, 222, 239, 0.74)','rgba(40, 237, 85, 0.15)','rgba(240, 149, 165, 0.74)','rgba(182, 240, 54, 0.74)',
    //   'rgba(240, 149, 165, 0.74)','rgba(182, 240, 149, 0.74)','rgb(40 167 69 / 19%)', 'rgb(103 58 183 / 25%)','rgba(15, 114, 91, 0.25)', 'rgb(132, 190, 255)','rgba(36, 41, 22, 0.36)','rgba(92, 41, 94, 0.36)','rgba(33, 108, 79, 0.36)','rgba(33, 108, 255, 0.36)','rgba(2, 0, 81, 0.26)','rgba(57, 0, 81, 0.26)','rgba(115, 31, 57, 0.26)','rgba(41, 35, 37, 0.26)','rgba(117, 35, 133, 0.29)','rgba(88, 166, 153, 0.53)','rgba(40, 237, 35, 0.22)','rgba(99, 142, 113, 0.15)','rgba(247, 255, 113, 0.15)','rgba(247, 203, 166, 1)','rgba(131, 203, 166, 0.39)','rgba(0, 173, 235, 0.53)','rgba(165, 105, 235, 0.53)','rgba(165, 105, 88, 0.53)','rgba(118, 255, 232, 0.43)','rgba(255, 117, 254, 0.43)','rgba(0, 70, 255, 0.17)','rgba(211, 255, 50, 0.17)','rgba(211, 255, 50, 0.17)','rgba(211, 81, 50, 0.17)','rgba(11, 183, 50, 0.17)','rgba(123, 73, 99, 0.17)','rgba(0, 211, 122, 0.17)','rgba(0, 131, 0, 0.17)','rgba(195, 131, 255, 0.17)','rgba(195, 131, 111, 0.17)','rgba(248, 30, 111, 0.17)','rgba(201, 88, 53, 0.35)','rgba(124, 143, 53, 0.35)','rgba(70, 214, 142, 0.35)']

    //   // this.color_match_pick=[ 'rgb(103 58 183 / 25%)', 'rgb(132, 190, 255)', 'rgb(183 64 58 / 43%)', 'rgb(187, 238, 164)', 'rgb(158, 148, 177)', 'rgb(255, 255, 153)','rgb(255, 204, 153 )','rgb(227, 210, 245)','rgb(250 235 215)', 'rgb(40 167 69 / 19%)']
    // }
    this.color_picker = [
      "rgb(132, 190, 255)",
      "rgb(183 64 58 / 43%)",
      "rgb(187, 238, 164)",
      "rgb(158, 148, 177)",
      "rgb(255, 255, 153)",
      "rgb(255, 204, 153 )",
      "rgb(227, 210, 245)",
      "rgb(250 235 215)",
      "rgb(40 167 69 / 19%)",
      "rgb(255 215 64)",
      "rgba(139, 70, 150, 0.57)",
      "rgba(245, 40, 145, 0.8)",
      "rgba(245, 40, 15, 0.35)",
      "rgba(245, 120, 162, 0.29)",
      "rgba(245, 243, 120, 0.29)",
      "rgba(245, 255, 2, 0.73)",
      "rgba(255, 54, 3, 0.43)",
      "rgba(255, 54, 255, 0.43)",
      "rgba(54, 149, 255, 0.43)",
      "rgba(255, 54, 98, 0.43)",
      "rgba(63, 54, 255, 0.44)",
      "rgba(63, 174, 255, 0.44)",
      "rgba(112, 124, 132, 0.44)",
      "rgba(101, 40, 102, 0.46)",
      "rgba(102, 107, 9, 0.44)",
      "rgba(9, 107, 83, 0.44)",
      "rgba(9, 84, 168, 0.44)",
      "rgba(72, 208, 164, 0.44)",
      "rgba(209, 80, 73, 0.44)",
      "rgba(0, 189, 0, 0.44)",
      "rgba(139, 0, 189, 0.44)",
      "rgba(250, 255, 0, 0.37)",
      "rgba(0, 255, 185, 0.96)",
      "rgba(255, 37, 255, 0.44)",
      "rgba(140, 189, 255, 0.44)",
      "rgba(255, 140, 173, 0.91)",
      "rgba(255, 255, 173, 0.91)",
      "rgba(0, 255, 217, 0.24)",
      "rgba(217, 0, 217, 0.24)",
      "rgba(255, 255, 89, 0.32)",
      "rgba(0, 255, 66, 0.24)",
      "rgba(154, 213, 39, 0.8)",
      "rgba(0, 255, 185, 0.24)",
      "rgba(0, 253, 185, 1)",
      "rgba(168, 255, 0, 0.5)",
      "rgba(255, 0, 70, 0.5)",
      "rgba(83, 255, 0, 0.5)",
      "rgba(83, 111, 0, 0.5)",
      "rgba(83, 111, 126, 0.5)",
      "rgba(255, 255, 4, 0.63)",
      "rgba(5, 14, 255, 0.4)",
      "rgba(255, 14, 255, 0.4)",
      "rgba(154, 99, 128, 0.8)",
      "rgba(231, 32, 151, 0.4)",
      "rgba(0, 255, 0, 0.4)",
      "rgba(255, 255, 0, 0.4)",
      "rgba(255, 2, 253, 0.4)",
      "rgba(255, 0, 0, 0.59)",
      "rgba(0, 73, 192, 0.59)",
      "rgba(89, 73, 192, 0.59)",
      "rgba(89, 226, 195, 0.59)",
      "rgba(89, 226, 0, 0.59)",
      "rgba(227, 0, 84, 0.59)",
      "rgba(245, 40, 145, 0.8)",
      "rgba(39, 214, 186, 0.18)",
      "rgba(227, 0, 255, 0.59)",
      "rgba(255, 255, 0, 0.3)",
      "rgba(255, 76, 0, 0.3)",
      "rgba(0, 0, 239, 0.44)",
      "rgba(114, 206, 239, 0.44)",
      "rgba(66, 80, 85, 0.33)",
      "rgba(175, 99, 17, 0.33)",
      "rgba(175, 99, 135, 0.33)",
      "rgba(175, 212, 135, 0.33)",
      "rgba(212, 178, 255, 0.5)",
      "rgba(61, 238, 124, 1)",
      "rgba(39, 140, 214, 0.55)",
      "rgba(212, 178, 172, 0.67)",
      "rgba(212, 255, 172, 0.67)",
      "rgba(0, 0, 255, 0.24)",
      "rgb(103 58 183 / 25%)",
      "rgba(17, 17, 104, 0.24)",
      "rgba(245, 199, 39, 0.8)",
      "rgba(126, 199, 39, 0.8)",
      "rgba(126, 199, 39, 0.32)",
      "rgba(126, 117, 39, 0.32)",
      "rgba(38, 255, 243, 0.32)",
      "rgba(255, 38, 109, 0.32)",
      "rgba(154, 213, 128, 0.8)",
      "rgba(255, 38, 255, 0.32)",
      "rgba(255, 38, 78, 0.32)",
      "rgba(255, 206, 78, 0.32)",
      "rgba(0, 206, 78, 0.32)",
      "rgba(0, 206, 255, 0.32)",
      "rgba(44, 0, 255, 0.32)",
      "rgba(53, 46, 89, 0.32)",
      "rgba(53, 247, 89, 0.32)",
      "rgba(255, 247, 89, 0.32)",
      "rgba(98, 255, 255, 1)",
      "rgba(97, 255, 184, 1)",
      "rgba(255, 255, 184, 1)",
      "rgba(255, 0, 184, 0.26)",
      "rgba(78, 201, 184, 0.26)",
      "rgba(78, 0, 184, 0.26)",
      "rgba(78, 32, 255, 0.26)",
      "rgba(74, 62, 124, 0.26)",
      "rgba(255, 238, 124, 0.26)",
      "rgba(41, 238, 124, 0.26)",
      "rgba(41, 238, 124, 1)",
      "rgba(255, 238, 124, 1)",
      "rgba(61, 238, 124, 1)",
      "rgba(123, 237, 236, 1)",
      ,
      "rgba(123, 237, 46, 1)",
      "rgba(197, 124, 162, 0.8)",
      "rgba(197, 124, 223, 0.8)",
    ];
  }
  Dynamic_colors(n: number) {
    //   this.colorsData=['rgba(255, 99, 71, 0.5)','rgb(255, 99, 71)','hsl(13, 86%, 73%)','hsl(213, 32%, 86%)',
    //   'rgb(178, 228, 178)','rgba(255, 102, 114, 0.8)','rgba(255, 226, 114, 0.8)','rgba(7, 91, 236, 0.4)',
    //   'rgba(7, 240, 179, 0.2)','rgba(183, 226, 179, 0.2)'
    // ];
    const colors = [];
    for (let i = 0; i < n; i++) {
      const hue = Math.floor(Math.random() * 128) + 128;
      // const saturation = Math.floor(Math.random() * 100);
      // const lightness = Math.floor(Math.random() * 100);
      const saturation = Math.floor(Math.random() * 128) + 128; // Range: 50-100
      // const lightness = 90; // Range: 70-100
      const lightness = Math.floor(Math.random() * 128) + 128; // Range: 70-100
      // const alpha = Math.random().toFixed(1);
      const alpha = Math.random().toFixed(1);
      // this.colorsData.push(`rgba(${hue}, ${saturation}, ${lightness}, ${alpha})`);
      this.colorsData.push(`rgb(${hue}, ${saturation}, ${lightness})`);
    }
    return this.colorsData;
  }
  closingbalanceshown: boolean = false;
  account_number;
  getautoknockoff(mapping) {
    // this.accountid=this.shareService.accountobject.value['id'];
    // console.log(a);
    if (
      !mapping ||
      !mapping.account_number ||
      Object.keys(mapping).length === 0
    ) {
      this.notification.showWarning("Please Select Account...");
      return false;
    }
    this.selectedList = [];
    this.paritallymapid = mapping.account_number.id;
    console.log("iddddssss", this.paritallymapid);
    this.ShowMappingFlag = false;
    console.log("Account Type", this.account_type);
    if (this.account_type == null) {
      this.account_type = 1;
    }

    //   if(this.from_Date=='' || this.from_Date== null || this.from_Date == undefined){
    //     this.notification.showError('Please Select From Date');
    //     return false;
    // }
    // if (this.to_Date == '' || this.to_Date == null || this.to_Date == undefined) {
    //   this.notification.showError('Please Select To Date');
    //   return false;
    // }
    // this.SpinnerService.show();
    let params = `?account_id=${this.accountid}`;
    // var keynames = [];
    // var valuenames = [];
    // let valupar = this.partially.value;
    // let unma = this.unmap.value;
    // let payload = {
    //   filter_type: this.filterdict[this.mapfiltervalue],
    //   account_number: this.accNumber,
    //   // "fromdate": this.from_Date,
    //   // "todate": this.to_Date,
    //   account_type: this.account_type,
    //   Descri_search: valupar,
    //   ref_no: unma,
    // };
    let sampleaccount = mapping.account_number.account_number;
    this.datevaluecheck();
    let data;
    if (data == "labelled") {
      this.parmappage = 1;
      this.unmappage = 1;
    }
    // let page =
    //   "&par_map_page=" + this.parmappage + "&unmap_page=" + this.unmappage;
    // let new_date=this.new_date+'&parmappage=' + this.parmappage + '&unmampage=' + this.unmappage+'&tag='+data;
    // let new_date =
    //   this.new_date +
    //   "&par_map_page=" +
    //   this.parmappage +
    //   "&unmap_page=" +
    //   this.unmappage;
    this.mapppingdata = mapping
    mapping["account_type"] = this.account_type;
    mapping["account_number"] = sampleaccount;
    if (this.mapfiltervalue != "Mapped") {
      this.closingbalanceshown = true;
      this.showpartiallymapped = true;
      this.showmapped = true;
      this.showunmapped = true;
      this.showpatternsuggestion = true;
      this.SpinnerService.show();
      this.partiallymappedlist = [];
      this.unmappedlist = [];
      this.Selectedid = [];
      this.patternlist = [];
      this.Selectedid = []
      this.selectedCheckboxState.forEach((value, key) => {
        this.selectedCheckboxState.set(key, false);
      });
      this.presentpage = 1;
    this.partiallycurrentpage = 1;
    this.unmappage = 1;
    this.knockoffpage = 1;
    this.paterenpresentpage = 1
    this.partiallymapped.reset()
    this.unmappedform.reset()
    this.knockoffform.reset()
    this.patternform.reset()
    this.partiallymappedsize=10
    this.unmappedsize=10
    this.knockoffsize=10
    this.pattersize=10
      this.partiallymap_func(mapping);
      this.unmapped(mapping);
      this.mapped_func(mapping);
      this.pattern_suggestion(mapping);
      this.sum_cr_db_to();
      this.checkbox.reset();
    

      // this.proofingService.autoknockoff(mapping, page).subscribe(
      //   (results) => {
      //     this.partiallymappedlist = [];
      //     this.SpinnerService.hide();

      //     // this.removefromselectedList(data)+
      //     if (
      //       results.code != undefined &&
      //       results.code != null &&
      //       results.code != ""
      //     ) {
      //       this.SpinnerService.hide();
      //       this.notification.showError(results.code);
      //       this.notification.showError(results.description);
      //       this.proofingList = [];
      //       this.autoknocklist = [];
      //       this.unmappedlist = [];
      //       // this.mappedlist = []
      //       this.partiallymappedlist = [];
      //       this.closingbalanceshown = false;
      //     } else {
      //       if (results?.datas === "No Records Found") {
      //         this.notification.showWarning(results?.datas);
      //         this.SpinnerService.hide();
      //         this.closingbalanceshown = false;
      //       }
      //       this.resetlimit();
      //       this.proofingList = [];
      //       this.autoknocklist = [];
      //       this.unmappedlist = [];
      //       // this.mappedlist = []
      //       this.partiallymappedlist = [];

      //       this.closingbalance = results?.overall_closingbalance;
      //       this.partially_closingbalance = results?.closing_balance_partially;
      //       this.unmapped_closingbalance = results?.closing_balance_unmapped;
      //       this.totalcount_partial = results?.totalrecords_of_partially;
      //       results.auto_map?.forEach((element, index) => {
      //         // element.arrayname = this.autoarrayname
      //         element.index = index;
      //         element.selected = true;
      //         // element.date = element.date.slice(0, 10);
      //         element.aging = this.calculateDiff(element.trans_date);
      //       });
      //       results.unmapped?.data.forEach((element, index) => {
      //         // element.arrayname = this.unmappedarrayname;
      //         element.index = index;
      //         // element.date = element.date.slice(0, 10);
      //         element.aging = this.calculateDiff(element.trans_date);
      //       });
      //       results.partially_map?.data.forEach((element, index) => {
      //         // element.arrayname = this.partialarrayname;partially_map
      //         element.index = index;
      //         // element.date = element.date.slice(0, 10);
      //         element.aging = this.calculateDiff(element.trans_date);
      //       });

      //       let refrence_crno = [];
      //       this.autoknocklist = results?.auto_map;
      //       //     this.unmappedlist.forEach((element, index) => {
      //       //       this.unmappedlist[index].selected=false
      //       // });

      //       // this.Dynamic_colors(this.partiallymappedlist?.length);
      //       for (let i = 0; i < this.partiallymappedlist?.length; i++) {
      //         refrence_crno.push({
      //           name: this.partiallymappedlist[i].reference_no,
      //         });

      //         // })(this.partiallymappedlist[i].reference_no);
      //         // refrence_crno[i]={'name':res};
      //         // refrence_crno[i]={'badge':this.colorsData};
      //         // console.log(refrence_crno);

      //         // let badge=this.colorsData;
      //         // this.partiallymappedlist[i]['badge']=this.colorsData
      //         this.Data = this.partiallymappedlist;
      //       }

      //       // if(refrence_crno?.length>0){
      //       //   refrence_crno = refrence_crno.filter((item, index, self) =>
      //       //   index === self.findIndex((t) => (
      //       //       t.name === item.name
      //       //   ))
      //       //   );

      //       //   }
      //       const keys = ["name"];
      //       const filtered = refrence_crno.filter(
      //         (
      //           (s) => (o) =>
      //             ((k) => !s.has(k) && s.add(k))(
      //               keys.map((k) => o[k]).join("|")
      //             )
      //         )(new Set())
      //       );
      //       // console.log

      //       console.log("after remove duplicate", filtered);
      //       let color = {};
      //       filtered.forEach((element, index) => {
      //         // element.badge=this.colorsData[index]
      //         element.badge = this.color_picker[index];
      //         // console.log("refrence_crno color patched ", );
      //         // refrence_crno.push({'badge':this.colorsData.});
      //         // this.partiallymappedlist[index].badge=this.colorsData[index];
      //         // this.partiallymappedlist[index].badge=this.color_picker[index];
      //         // this.partiallymappedlist=refrence_crno;
      //         this.partiallymappedlist.forEach((e) => {
      //           if (e.reference_no === element.name) {
      //             e.badge = this.color_picker[index];
      //             // element.badge=this.color_picker[index]
      //           }
      //           // else{
      //           //   e.badge=this.color_picker[index]
      //           // }
      //         });
      //       });
      //       // this.partiallymappedlist.forEach((element,index)=>)

      //       // console.log('prttial summary',this.partiallymappedlist)

      //       // for (let j=0;j<refrence_crno.length;j++){
      //       //   refrence_crno['badge']=this.colorsData;
      //       //   console.log('refrence_crno',refrence_crno)
      //       // }
      //       // for(let a=0;a<this)
      //       // for(let j=0;j<this.Data.length;j++){
      //       //   this.Data[j]['reference_no']=

      //       // }var output = {};

      //       // for (var i = 0; i < input.length; i++) {
      //       //   var obj = input[i];
      //       //   output[i] = {'name': obj.reference_no};
      //       // }
      //       this.valuenames = valuenames;
      //       // this.selectedList = [];

      //       console.log("Before hide()");
      //       this.SpinnerService.hide();
      //       console.log("After hide()");
      //       // if(results?.code ==="UNEXPECTED_ERROR"){
      //     }
      //   },
      //   (error: HttpErrorResponse) => {
      //     this.SpinnerService.hide();
      //     this.notification.showWarning(error.status + error.statusText);
      //     this.closingbalanceshown = false;
      //   }
      // );
    } else {
      if (this.from_Date) {
        params += "&fromdate=" + this.from_Date;
      }
      if (this.to_Date) {
        params += "&todate=" + this.to_Date;
      }
      this.proofingService.getmappeddata(params).subscribe(
        (response) => {
          this.SpinnerService.hide();
          this.gettemplatesMapped();
          this.mappedlist = response.data;
          this.mappedlist.sort((val1, val2) => {
            return val1.rule_reference_no - val2.rule_reference_no;
          });
          console.log("mapped list for chosing color" + this.mappedlist);
        },
        (error) => {
          this.SpinnerService.hide();
        }
      );
    }

    // let p_load = {
    //   acc_id: this.accountid,
    //   from_date: this.from_Date,
    //   to_date: this.to_Date,
    // };

    this.balanceObject = null;
    if (this.account_type == 1) {
      this.balanceObject = null;
    } else {
      this.proofingService.fetch_balance(mapping).subscribe((res) => {
        if (typeof res === "string" || res.length == 0) {
          this.notification.showError("CLOSING BALANCE NOT FOUND :" + res);
        } else {
          res = res[0];
          this.balanceObject = res;
        }
      });
    }
  }

  getRowCount(check: string): number {
    const count = this.partiallymappedlist.filter(
      (item) => item.rule_reference_no === check
    ).length;
    return count;
  }
  payload: any;
  manualknockoff() {
    this.SpinnerService.show();
    this.payload = {};
    this.role = 2;
    this.payload.account_id = this.accountid;
    this.payload.account_no = this.accNumber;
    this.showMatchedFlag = this.sumofDebit === this.sumofCredit;
    if (this.selectedList?.length > 0) {
      if (!this.refno && this.showMatchedFlag) {
        // this.notification.showError('Please Enter Label/Ref No');
        // return false;
      } else if (!this.showMatchedFlag && !this.refno) {
        this.notification.showError("Please Enter Label/Ref No");
        this.SpinnerService.hide();
        return false;
      }

      if (!this.remarks) {
        this.notification.showError("Please Enter Remarks");
        this.SpinnerService.hide();
        return false;
      }
      let transactionarray = this.selectedList.map((element) => element.id);
      let parmapid = [];
      this.selectedList.forEach((element) => {
        if (element?.arrayname === "Partially Mapped") {
          parmapid.push(element.id);
        }
      });
      console.log("partial mapped list", parmapid);
      let unmaped = [];
      this.selectedList.forEach((element) => {
        if (element?.arrayname === "Unmapped") {
          unmaped.push(element.id);
        }
      });
      console.log("unmaped mapped list", unmaped);
      let dta = [
        {
          transaction_id: transactionarray,
          labelcolor: this.refno,
          description: this.remarks,
          PUM: parmapid,
          UM: unmaped,
        },
      ];
      if (this.ShowMatchedFlag) {
        this.payload.partially_mapped = dta;
      } else {
        this.payload.partially_unmapped = dta;
      }
    }

    this.createlabelmapped();
  }

  datevaluecheck() {
    let page =
      "&parmappage=" + this.parmappage + "&unmampage=" + this.unmappage;
    if (this.from_Date != null && this.to_Date != null) {
      // this.new_date = `&fromdate=${this.from_Date}&todate=${this.to_Date}${page} `
      this.new_date = `&fromdate=${this.from_Date}&todate=${this.to_Date} `;
    } else if (this.from_Date != null && this.to_Date == null) {
      this.new_date = `&fromdate=${this.from_Date}`;
    } else if (this.from_Date == null && this.to_Date != null) {
      this.new_date = `&todate=${this.to_Date}`;
    } else {
      this.new_date = null;
    }
    // if(this.unmap_hasnext==true || this.partial_hasnext==true){
    //   let body = 'parmappage=' + this.parmappage + '&unmampage=' + this.unmappage
    // }
  }

  createlabelmapped() {
    this.payload.account_id = this.paritallymapid;
    this.payload.account_no = this.knockoffstatus;
    this.SpinnerService.show();
    console.log("payloadrole", this.payload);
    console.log("rolepayload", this.role);
    this.proofingService.createlablemapping(this.payload, this.role).subscribe(
      (response) => {
        // this.SpinnerService.hide();
        if (response.status == "success") {
          this.notification.showSuccess("Process completed successfully :)");         
          this.SpinnerService.hide();
          this.closepopupmapping();
          this.ProofingList_Desc = [];
          this.colorarray = [];
          this.knockoffList = [];
          this.proofingList = [];
          this.checkedItems = [];
          // this.patternlist = [];
          // this.mappedlist = [];
          // this.unmappedlist = [];
          // this.partiallymappedlist = [];
          // this.selectedCheckboxState.set(this.Selectedid , false)
          // this.removefromselectedList('')
          this.selectedCheckboxState.forEach((value, key) => {
            this.selectedCheckboxState.set(key, false);
          });
          this.selectedList = [];
          this.Selectedid = [];
          this.ShowMappingFlag = false;
          this.refno = "";
          this.remarks = "";
          this.showautoknockoff= true;
          this.showmapped = true;
          this.showunmapped = true;
          this.showpartiallymapped = true;
          this.showpatternsuggestion= true;
          this.noofCredit = 0;
          this.noofDebit = 0;
          this.sumofCredit = 0;
          this.sumofDebit = 0;
          // this.getautoknockoff('');
       
    this.presentpage = 1;
    this.partiallycurrentpage = 1;
    this.unmappage = 1;
    this.knockoffpage = 1;
    this.paterenpresentpage = 1
    this.partiallymap_func('');
    this.unmapped('');
    this.mapped_func('');
    this.pattern_suggestion(this.mapppingdata);

          // this.getRandomColor();
          // let tag = "labelled";
          // this.getautoknockoff('');

          // this.Mappedafter();
        } else {
          this.SpinnerService.hide();
          this.notification.showError(response.description);
        }
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.notification.showError(error.status + error.message);
      }
    );
  }

  createlabel(data) {
    if (
      data.account_number.account_number === "" ||
      data.account_number.account_number === null ||
      data.account_number.account_number === undefined
    ) {
      this.notification.showWarning("Select  GL Number");
    } else {
      this.paritallymapid = data.account_number.id;
      this.knockoffstatus = data.account_number.account_number;
      this.accoutnumber = data.account_number.account_number;
      let payload = {
        account_id: this.paritallymapid,
      };
      this.SpinnerService.show();
      this.proofingService.createlable(payload).subscribe(
        (response) => {
          // this.SpinnerService.hide();
          if (response.status == "Success") {
            this.notification.showSuccess(response.message);

            this.selectedList = [];
            this.Selectedid = [];
            this.SpinnerService.hide();
            this.popupopen();
            this.dataknockoff = {
              account_no: this.knockoffstatus,
              type: 1,
            };
            this.statussummary = {
              method: "post",
              url: this.proofUrl + "prfserv/schedular_status",
              data: this.dataknockoff,
            };
            this.iconcondiction = false;
            // this.getRandomColor();
            let tag = "labelled";
            this.getautoknockoff(this.presentpage);
            this.refno = "";
            this.remarks = "";
            // this.Mappedafter();
          } else {
            this.SpinnerService.hide();
            this.notification.showError(response.description);
          }
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.notification.showError(error.status + error.message);
        }
      );
    }
  }

  popupopenrmapping() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("myModal"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }

  closepopupmapping() {
    this.closefilepopup.nativeElement.click();
  }
  refresh() {
    this.dataknockoff = {
      account_no: this.knockoffstatus,
      type: 1,
    };
    this.statussummary = {
      method: "post",
      url: this.proofUrl + "prfserv/schedular_status",
      data: this.dataknockoff,
    };
  }

  refresh1() {
    this.dataknockoff = {
      account_no: this.knockoffstatus,
      type: 2,
    };
    this.statussummary = {
      method: "post",
      url: this.proofUrl + "prfserv/schedular_status",
      data: this.dataknockoff,
    };
  }
  closepopup() {
    this.closeaddpopup.nativeElement.click();
  }
  closepopupprocess() {
    this.closeaddpopup.nativeElement.click();
  }

  knockoff_status_button() {
    this.popupopen();
    this.dataknockoff = {
      account_no: this.knockoffstatus,
      type: 1,
    };
    this.statussummary = {
      method: "post",
      url: this.proofUrl + "prfserv/schedular_status",
      data: this.dataknockoff,
    };
  }

  rule_status_button() {
    this.popupopenrule();
    this.dataknockoff = {
      account_no: this.knockoffstatus,
      type: 2,
    };
    this.statussummary = {
      method: "post",
      url: this.proofUrl + "prfserv/schedular_status",
      data: this.dataknockoff,
    };
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(document.getElementById("exampleModal"), {
      backdrop: "static",
      keyboard: false,
    });
    myModal.show();
  }

  popupopenrule() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("exampleModalrule"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  knockoff(data) {
    console.log("knockofff", data);
    this.iconcondiction = true;
    this.payload = {};

    this.payload.account_id = data;

    this.role = 1;
    // this.SpinnerService.show()
    if (this.autoknocklist?.length > 0) {
      let automappedarray = this.autoknocklist.filter(
        (element) => element.selected
      );

      automappedarray = automappedarray.map((element) => element.label_id);
      automappedarray = [...new Set(automappedarray)];
      automappedarray = automappedarray.map((element) => {
        let idfilteredarray = this.autoknocklist
          .filter((ele) => ele.label_id === element)
          .map((element) => element.id);
        return { label_id: element, id: idfilteredarray };
      });
      console.log(automappedarray);
      this.payload.auto_mapped = automappedarray;
    }
    // this.SpinnerService.hide()
    this.createlabel(data);
  }

  rule_update(data) {
    if (
      data.account_number.account_number === "" ||
      data.account_number.account_number === null ||
      data.account_number.account_number === undefined
    ) {
      this.notification.showWarning("Select  GL Number");
    } else {
      let page = 1;
      let payload = data.account_number.id;
      this.knockoffstatus = data.account_number.account_number;
      this.accoutnumber = data.account_number.account_number;
      this.SpinnerService.show();
      this.proofingService.rule_updatefun(page, payload).subscribe(
        (response) => {
          if (response.status == "Success") {
            this.notification.showSuccess(response.message);
            this.SpinnerService.hide();
            this.popupopenrule();
            this.dataknockoff = {
              account_no: this.knockoffstatus,
              type: 2,
            };
            this.statussummary = {
              method: "post",
              url: this.proofUrl + "prfserv/schedular_status",
              data: this.dataknockoff,
            };
            this.getautoknockoff(this.presentpage);
          } else {
            this.SpinnerService.hide();
            this.notification.showError(response.description);
          }
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.notification.showError(error.status + error.message);
        }
      );
    }
  }

  groupbytoarrays(ref_label, arrayname, ref_value, selectedvalue) {
    var array = [];
    if (arrayname == this.partialarrayname) {
      array = this.partiallymappedlist;
    } else if (arrayname == this.unmappedarrayname) {
      array = this.unmappedlist;
    }
    return array.filter((element) => {
      element.arrayname = arrayname;
      if (element[ref_label] == ref_value) {
        element.selected = selectedvalue;
        return element;
      }
    });
  }

  Selectedid = [];
  mapcheckboxchanged(val, type,check) {
    let groupbyobject = "label_id";
    this.ischecked = check.checked
  
    val.arrayname = type;
    let groupbyid = val[groupbyobject];
    if (type != this.autoarrayname) {
      // let selectdvalue: boolean = val.selected;
      if (this.ischecked) {
        this.addinselectedList(val);
        this.Selectedid.push(val.id);
        console.log(this.Selectedid)
        this.showpatternsuggestion = false
      } else {
        this.removefromselectedList(val);
        this.showpatternsuggestion = true
      }
      //other arrays partial,unmappedjj;
      // var filteredarray = this.groupbytoarrays(groupbyobject, type, groupbyid, selectdvalue)
      // console.log(filteredarray)
      // for (let item of filteredarray) {
      //   if (val.selected) {
      //     this.addinselectedList(item);
      //   }
      //   else {
      //     this.removefromselectedList(item)
      //   }
      // }
    }
    //Move from Auto knock list to partiall list not to the mapped list
    else {
      let filterarray = this.autoknocklist.filter((element) => {
        return element[groupbyobject] == groupbyid;
      });

      for (let item of filterarray) {
        item.arrayname = type;
        if (!val.selected) {
          this.addinautotopartial(item);
          this.autoknocklist[item.index].selected = false;
        } else {
          this.autoknocklist[item.index].selected = true;
          this.removefromautotopartial(item);
        }
      }
    }
    this.checksum();
  }
  colorindex: number;

  insertcolorintoarray(array) {
    let fieldname = "rule_reference_no";
    array.forEach((element, index) => {
      if (index == 0) {
        this.colorindex = 0;
        element.rowstyle = this.tablerowstyles(Colors[0]);
      } else {
        if (element[fieldname] == array[index - 1][fieldname]) {
          element.rowstyle = this.tablerowstyles(Colors[this.colorindex]);
        } else {
          this.colorindex == 2 ? (this.colorindex = 0) : (this.colorindex += 1);
          element.rowstyle = this.tablerowstyles(Colors[this.colorindex]);
        }
      }
    });
    return array;
  }
  colorfilter(field, arrayname) {
    var fieldname = field;
    fieldname = "rule_reference_no";
    if (this.partialarrayname == arrayname) {
      this.partiallymappedlist = this.insertcolorintoarray(
        this.partiallymappedlist
      );
    } else if (arrayname == this.autoarrayname) {
      this.autoknocklist = this.insertcolorintoarray(this.autoknocklist);
    } else if (arrayname == this.unmappedarrayname) {
      this.unmappedlist = this.insertcolorintoarray(this.unmappedlist);
    } else if (arrayname == this.mappedarrayname) {
      this.mappedlist = this.insertcolorintoarray(this.mappedlist);
    }
  }

  enablecolors(evt, array) {
    if (evt.checked) {
      this.colorfilter("", array);
    } else {
      this.removecolors(array);
    }
  }

  removecolors(arrayname) {
    if (this.partialarrayname == arrayname) {
      this.partiallymappedlist.forEach((element) => {
        element.rowstyle = null;
      });
    } else if (this.autoarrayname == arrayname) {
      this.autoknocklist.forEach((element) => {
        element.rowstyle = null;
      });
    } else if (this.mappedarrayname == arrayname) {
      this.mappedlist.forEach((element) => {
        element.rowstyle = null;
      });
    } else if (this.unmappedarrayname == arrayname) {
      this.unmappedlist.forEach((element) => {
        element.rowstyle = null;
      });
    }
  }

  addinselectedList(data) {
    this.selectedList.push(data);
    this.checkselectedlist();
  }

  removefromselectedList(data) {
    let index = this.selectedList.findIndex(
      (element) => element.id === data.id
    );
    this.selectedList.splice(index, 1);
    this.Selectedid.splice(index, 1);
    this.checkselectedlist();
  }

  addinautotopartial(data) {
    this.autotopartialarray.push(data);
    this.checkautotopartiallist();
  }

  removefromautotopartial(data) {
    let index = this.autotopartialarray.findIndex(
      (element) => element.id === data.id
    );
    this.autotopartialarray.splice(index, 1);
    this.checkautotopartiallist();
  }

  checkselectedlist() {
    this.selectedList.length > 0
      ? (this.ShowMappingFlag = true)
      : (this.ShowMappingFlag = false);
    let check = this.selectedList.filter((element) => {
      return element.arrayname == this.autoarrayname;
    });
    if (check?.length > 0) {
      // this.autoselectall = false;
    } else {
      // this.autoselectall = true;
    }
  }

  checkautotopartiallist() {
    this.autotopartialarray.length > 0
      ? (this.autotopartialflag = true)
      : (this.autotopartialflag = false);
    let check = this.autotopartialarray.filter((element) => {
      return element.arrayname == this.autoarrayname;
    });
    if (check?.length > 0) {
      this.autoselectall = false;
    } else {
      this.autoselectall = true;
    }
  }

  checksum() {
    this.sumofCredit = 0;
    this.sumofDebit = 0;
    let credit = this.selectedList.filter((element) => {
      this.sumofCredit += element.creditamount;
      // console.log(element.creditamount);
      return element.creditamount != 0;
    });
    let debit = this.selectedList.filter((element) => {
      this.sumofDebit += element.debitamount;
      return element.debitamount != 0;
    });
    this.noofCredit = credit.length;
    this.noofDebit = debit.length;
    if (this.sumofCredit == this.sumofDebit) {
      this.ShowMatchedFlag = true;
    } else {
      this.ShowMatchedFlag = false;
    }
    // this.sumofCredit = credit.reduce((pre_value,cur_value)=>pre_value+cur_value);
    // this.sumofDebit = debit.reduce((pre_value,cur_value)=>pre_value+cur_value);
  }

  tablescrolled(scrollelement, arrayname) {
    const limit = this.offsetlimit;
    let value = scrollelement.target;

    const offsetHeight = value.offsetHeight;
    const scrollHeight = value.scrollHeight;
    const scrollTop = value.scrollTop; //current scrolled distance
    const upgradelimit = scrollHeight - offsetHeight - 50;

    if (scrollTop > upgradelimit) {
      console.log("bottom");
      if (this.partialarrayname == arrayname) {
        this.parmapendlimit += limit;
      } else if (arrayname == this.autoarrayname) {
        this.autoendlimit += limit;
      } else if (arrayname == this.unmappedarrayname) {
        this.unmapendlimit += limit;
      } else if (arrayname == this.mappedarrayname) {
        this.mapendlimit += limit;
      } else if (arrayname == this.patternarrayname) {
        this.patternlimit += limit;
      }
    }
  }

  nextClick(data) {
    if (data === "partialnext") {
      // let body = 'parmappage=' + this.parmappage + '&unmampage=' + this.unmappage
      // this.partiallymappedlist
      if (this.partial_hasnext === true) {
        this.parmappage += 1;
        this.presentpage = this.partiallycurrentpage + 1;
        this.partial_map_size = this.partiallymappedlist?.length;
        // this.getautoknockoff("");
        this.partiallymap_func(this.mappingp);
        this.currentpartiallymappage = this.presentpage;
      }
    }
  }

  unmapnextclick(data) {
    if (data === "unmapnext") {
      if (this.unmap_hasnext === true) {
        this.unmappage += 1;
        this.presentpage = this.unmappage;
        this.unmapped(this.mappingun);
        this.currentunmappedpage = this.presentpage;
        // this.getautoknockoff("");
        // this.partiallymap_func(data)
      }
    }
  }

  unmappreviousclick(data) {
    if (data === "unmapprevious") {
      if (this.unmap_hasprevious == true) {
        this.unmappage -= 1;
        this.presentpage = this.unmappage;
        this.unmapped(this.mappingun);
        // this.getautoknockoff("");
        // this.checkSelectedListPar();
      }
    }
  }
  knockoffclick(data) {
    if (data === "knockffprevious") {
      if (this.knockoff_hasprevious == true) {
        this.knockoffpage -= 1;
        this.presentpage = this.autocurrentpage - 1;
        this.mapped_func(this.mappingknockoff);
        // this.getautoknockoff("");
        // this.checkSelectedListPar();
      }
    }
  }

  knockoffnextclick(data) {
    if (data === "knockoffnext") {
      if (this.knockoff_hasnext === true) {
        this.knockoffpage += 1;
        this.presentpage = this.autocurrentpage + 1;
        this.mapped_func(this.mappingknockoff);
        this.currentpagemappage = this.presentpage;
        // this.getautoknockoff("");
        // this.partiallymap_func(data)
      }
    }
  }
  previousClick(data) {
    if (data === "partialprevious") {
      if (this.partial_hasprevious === true) {
        this.parmappage -= 1;
        this.presentpage = this.partiallycurrentpage - 1;
        this.partial_map_size = this.partiallymappedlist?.length;
        this.partiallymap_func(this.mappingp);
        // this.checkSelectedListPar();
      }
    }
  }

  partternnextclick(patternn) {
    if (patternn === "patternnext" && this.pattern_hasnext) {
      this.paterenpresentpage = this.patterenpage + 1;
      this.pattern_suggestion(this.partternclick);
      this.currentpagemappage = this.paterenpresentpage;
    }
  }

  partternpreviousclick(patternp) {
    if (patternp === "patternprevious" && this.pattern_hasprevious) {
      this.paterenpresentpage = this.patterenpage - 1;
      this.patteren_map_size = this.patternlist?.length;
      this.pattern_suggestion(this.partternclick);
    }
  }

  // partternmapcheckboxchanged(val, type, dataa, code) {
  //   val.arrayname = type;
  //   if (code === "multiple") {
  //     for (let x of val) {
  //       x.arrayname = type;
  //       this.selectedCheckboxState.set(x.id, dataa.checked);
  //       if (dataa.checked) {
  //         this.addinselectedList(x); 
  //         if (!this.Selectedid.includes(x.id)) {
  //           this.Selectedid.push(x.id);
  //         }
  //         this.showautoknockoff = false;
  //         this.showmapped = false;
  //         this.showunmapped = false;
  //         this.showpartiallymapped = false;
  //       } else {
  //         this.removefromselectedList(x);
  //         this.Selectedid = this.Selectedid.filter((id) => id !== x.id);
  //         if (this.Selectedid.length === 0) {
  //           this.showautoknockoff = true;
  //           this.showmapped = true;
  //           this.showunmapped = true;
  //           this.showpartiallymapped = true;
  //         }
  //       }
  //     }
  //   } else if (code === "single") {
  //     this.selectedCheckboxState.set(val.id, dataa.checked);
  //     val.selected = dataa.checked;
  
  //     if (dataa.checked) {
  //       this.addinselectedList(val);
  //       if (!this.Selectedid.includes(val.id)) {
  //         this.Selectedid.push(val.id);
  //       }
  //       this.showautoknockoff = false;
  //       this.showmapped = false;
  //       this.showunmapped = false;
  //       this.showpartiallymapped = false;
  //     } else {
  //       this.removefromselectedList(val);
  //       this.Selectedid = this.Selectedid.filter((id) => id !== val.id);
  //       if (this.Selectedid.length === 0) {
  //         this.showautoknockoff = true;
  //         this.showmapped = true;
  //         this.showunmapped = true;
  //         this.showpartiallymapped = true;
  //       }
  //     }
  //   }
  //   this.checksum();
  // }
  partternmapcheckboxchanged(val, type, dataa, code, uniqueId) {
    if (code === 'multiple') {
      for (let x of val) {
        const uniqueKey = uniqueId;
        this.selectedCheckboxState.set(uniqueKey, dataa.checked);
        x.arrayname = type;
  
        if (dataa.checked) {
          this.addinselectedList(x);
          if (!this.Selectedid.includes(uniqueKey)) {
            this.Selectedid.push(uniqueKey);
          }
          this.showautoknockoff = false;
          this.showmapped = false;
          this.showunmapped = false;
          this.showpartiallymapped = false;
        } else {
          this.removefromselectedList(x);
          this.Selectedid = this.Selectedid.filter((id) => id !== uniqueKey);
          if (this.Selectedid.length === 0) {
            this.showautoknockoff = true;
            this.showmapped = true;
            this.showunmapped = true;
            this.showpartiallymapped = true;
          }
        }
      }
    } else if (code === 'single') {
      this.selectedCheckboxState.set(uniqueId, dataa.checked);
      val.selected = dataa.checked;
  
      if (dataa.checked) {
        this.addinselectedList(val);
        if (!this.Selectedid.includes(uniqueId)) {
          this.Selectedid.push(uniqueId);
        }
        this.showautoknockoff = false;
        this.showmapped = false;
        this.showunmapped = false;
        this.showpartiallymapped = false;
      } else {
        this.removefromselectedList(val);
        this.Selectedid = this.Selectedid.filter((id) => id !== uniqueId);
        if (this.Selectedid.length === 0) {
          this.showautoknockoff = true;
          this.showmapped = true;
          this.showunmapped = true;
          this.showpartiallymapped = true;
        }
      }
    }
    this.checksum();
  }
  
  


  checkSelectedListpar() {
    this.partiallymappedlist.forEach((element, index) => {
      if (this.Selectedid.includes(element.id)) {
        this.partiallymappedlist[index].selected = true;
        // this.unmappedlist[index].selected=true;
      }
    });
  }
  
  checkSelectedListmap() {
    this.unmappedlist.forEach((element, index) => {
      if (this.Selectedid.includes(element.id)) {
        this.unmappedlist[index].selected = true;
      }
    });
  }

  partiallymap_func(mapping) {
    let datass = mapping || {};
    this.mappingp = mapping;
    let page = 1;
    this.knockoffstatus = mapping.account_number;
    // let payload
    if (this.presentpage > 1) {
      this.payloads = {
        account_type: this.account_type,
        account_number: this.knockoffstatus,
        id: this.paritallymapid,
        filter_type: this.filterdict[this.mapfiltervalue],
        transdate: datass.transdate,
        Descri_search: datass.Descri_search,
        ref_no: datass.ref_no,
        page: this.presentpage,
        page_size:this.partiallymappedsize
      };
    } else {
      this.payloads = {
        account_type: this.account_type,
        account_number: this.knockoffstatus,
        id: this.paritallymapid,
        filter_type: this.filterdict[this.mapfiltervalue],
        transdate: datass.transdate,
        Descri_search: datass.Descri_search,
        ref_no: datass.ref_no,
        page: page,
        page_size:this.partiallymappedsize
      };
    }

    console.log("adasdasdasd", datass);

    this.SpinnerService.show();
    this.proofingService.partiallymap(this.payloads).subscribe(
      (response: any) => {
        this.SpinnerService.hide();
        console.log("UploadFile", response);

        if (response?.description) {
          this.notification.showError(response.description);
        }

        let file = response["data"];
        let datapagination = response["pagination"];
        this.partiallymappedlist = file;
        this.totalcount_partial = response?.count;
        console.log("Results from API", response["data"]);
        response.data.forEach((element, index) => {
          // element.arrayname = this.partialarrayname;partially_map
          element.index = index;
          // element.date = element.date.slice(0, 10);
          element.aging = this.calculateDiff(element.trans_date);
        });

        if (this.partiallymappedlist?.length >= 0) {
          this.partiallypagination = true;
          this.partial_hasnext = datapagination.has_next;
          this.partial_hasprevious = datapagination.has_previous;
          this.partiallycurrentpage = datapagination.index;
        }
        let refrence_crno = [];
        for (let i = 0; i < this.partiallymappedlist?.length; i++) {
          refrence_crno.push({
            name: this.partiallymappedlist[i].rule_reference_no,
          });
          const keys = ["name"];
          const filtered = refrence_crno.filter(
            (
              (s) => (o) =>
                ((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|"))
            )(new Set())
          );
          // console.log

          console.log("after remove duplicate", filtered);
          let color = {};
          filtered.forEach((element, index) => {
            // element.badge=this.colorsData[index]
            element.badge = this.color_picker[index];
            // console.log("refrence_crno color patched ", );
            // refrence_crno.push({'badge':this.colorsData.});
            // this.partiallymappedlist[index].badge=this.colorsData[index];
            // this.partiallymappedlist[index].badge=this.color_picker[index];
            // this.partiallymappedlist=refrence_crno;

            this.partiallymappedlist.forEach((e) => {
              if (e.rule_reference_no === element.name) {
                e.badge = this.color_picker[index];
                // element.badge=this.color_picker[index]
              }
              // else{
              //   e.badge=this.color_picker[index]
              // }
            });
          });
        }
      },
      (error: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.notification.showWarning(error.status + error.message);
      }
    );
  }

  unmapped(mapping) {
    let datass = mapping || {};
    let page = 1;
    this.mappingun = mapping;
    this.knockoffstatus = mapping.account_number;
    if (this.presentpage > 1) {
      this.payloads = {
        account_type: this.account_type,
        account_number: this.knockoffstatus,
        id: this.paritallymapid,
        filter_type: this.filterdict[this.mapfiltervalue],
        transdate: datass.transdate,
        Descri_search: datass.Descri_search,
        ref_no: datass.ref_no,
        page: this.presentpage,
        page_size:this.unmappedsize
      };
    } else {
      this.payloads = {
        account_type: this.account_type,
        account_number: this.knockoffstatus,
        id: this.paritallymapid,
        filter_type: this.filterdict[this.mapfiltervalue],
        transdate: datass.transdate,
        Descri_search: datass.Descri_search,
        ref_no: datass.ref_no,
        page: page,
        page_size:this.unmappedsize
      };
    }
    console.log("adasdasdasd", datass);

    this.SpinnerService.show();
    this.proofingService.unmapped_ser(this.payloads).subscribe(
      (response: any) => {
        this.SpinnerService.hide();
        console.log("UploadFile", response);

        if (response?.description) {
          this.notification.showError(response.description);
        }

        let file = response["data"];
        let datapagination = response["pagination"];
        this.unmappedlist = file;
        this.totalcount_unmap = response?.count;
        console.log("Results from API", response["data"]);
        response.data.forEach((element, index) => {
          // element.arrayname = this.partialarrayname;partially_map
          element.index = index;
          // element.date = element.date.slice(0, 10);
          element.aging = this.calculateDiff(element.trans_date);
        });
 
        if (this.unmappedlist?.length >= 0) {
          this.unmappedpagination = true;
          this.unmap_hasnext = datapagination.has_next;
          this.unmap_hasprevious = datapagination.has_previous;
          this.unmappage = datapagination.index;
        }
      },
      (error: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.notification.showWarning(error.status + error.message);
      }
    );
  }

  mapped_func(mapping) {
    let datass = mapping || {};
    let page = 1;
    this.mappingknockoff = mapping;
    this.knockoffstatus = mapping.account_number;
    if (this.presentpage > 1) {
      this.payloads = {
        account_type: this.account_type,
        account_number: this.knockoffstatus,
        id: this.paritallymapid,
        filter_type: this.filterdict[this.mapfiltervalue],
        transdate: datass.transdate,
        Descri_search: datass.Descri_search,
        ref_no: datass.ref_no,
        page: this.presentpage,
        page_size:this.knockoffsize
      };
    } else {
      this.payloads = {
        account_type: this.account_type,
        account_number: this.knockoffstatus,
        id: this.paritallymapid,
        filter_type: this.filterdict[this.mapfiltervalue],
        transdate: datass.transdate,
        Descri_search: datass.Descri_search,
        ref_no: datass.ref_no,
        page: page,
        page_size:this.knockoffsize
      };
    }

    console.log("adasdasdasd", datass);

    this.SpinnerService.show();
    this.proofingService.mapped_ser(this.payloads).subscribe(
      (response: any) => {
        this.SpinnerService.hide();
        console.log("UploadFile", response);

        if (response?.description) {
          this.notification.showError(response.description);
        }

        let file = response["data"];
        let datapagination = response["pagination"];
        this.mappedlist = file;
        this.knockofftotal = response?.count;
        console.log("Results from API", response["data"]);
        response.data.forEach((element, index) => {
          // element.arrayname = this.partialarrayname;partially_map
          element.index = index;
          // element.date = element.date.slice(0, 10);
          element.aging = this.calculateDiff(element.trans_date);
        });
        if (this.mappedlist?.length >= 0) {
          this.partiallypagination = true;
          this.knockoff_hasnext = datapagination.has_next;
          this.knockoff_hasprevious = datapagination.has_previous;
          this.knockoffpage = datapagination.index;
          this.autocurrentpage = datapagination.index;
        }
      },
      (error: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.notification.showWarning(error.status + error.message);
      }
    );
  }
  pattern_suggestion(pattern) {
    let datass = pattern || {};
    let page = 1;
    this.partternclick = pattern;

    if (this.paterenpresentpage > 1) {
      this.payloads = {
          id: this.paritallymapid,
          page: this.paterenpresentpage,
          page_size:this.pattersize,
          ...(datass.pattern ? { pattern: datass.pattern } : {}),
          ...(datass.trans_typ ? { trans_typ: datass.trans_typ } : {}),
      };
  } else {
      this.payloads = {
          id: this.paritallymapid,
          page: page,
          page_size:this.pattersize,
          ...(datass.pattern ? { pattern: datass.pattern } : {}),
          ...(datass.trans_typ ? { trans_typ: datass.trans_typ } : {}),
      };
  }
  
    console.log("adasdasdasd", datass);

    this.SpinnerService.show();
    this.proofingService.pattern_suggestion(this.payloads).subscribe(
        (response: any) => {
            this.SpinnerService.hide();
            if (response?.description) {
                this.notification.showError(response.description);
            }
            let pattern = response["data"] || [];
            this.patterntotal = response?.count || 0;
            let datapagination = response["pagination"] || {};
            this.patternlist = pattern; 

            this.patternlist = pattern.map((element) => {
                element.selected =
                    this.selectedCheckboxState.get(element.id) || false;
                return element;
            });

            if (this.patternlist?.length >= 0) {
                this.patternpagination = true;
                this.pattern_hasnext = datapagination.has_next || false;
                this.pattern_hasprevious = datapagination.has_previous || false;
                this.patterenpage = datapagination.index || 1;
            }
        },
        (error: HttpErrorResponse) => {
            this.SpinnerService.hide();
            this.notification.showWarning(error.status + error.message);
        }
    );
}


  rowVisibility: boolean[] = [];

  opensubtab(index: number) {
    // Toggle the visibility for the clicked row
    this.rowVisibility[index] = !this.rowVisibility[index];
  }
  sum_cr_db_to() {
    let payload = {
      id: this.paritallymapid,
    };
    this.SpinnerService.show();
    this.proofingService.sum_of_amount(payload).subscribe(
      (response: any) => {
        this.SpinnerService.hide();
        console.log("UploadFile", response);

        if (response?.description) {
          this.notification.showError(response.description);
        }
        let file = response["data"];
        //autoknockoffcounts
        this.length_of_credit_autoknockoff =
          file[0].autoknockoff_suggest.credit_count;
        this.length_of_debit_autoknockoff =
          file[0].autoknockoff_suggest.debit_count;
        this.sum_of_credit_autoknockoff =
          file[0].autoknockoff_suggest.credit_sum;
        this.sum_of_debit_autoknockoff = file[0].autoknockoff_suggest.debit_sum;
        this.knockoff_closingbalance =
          file[0].autoknockoff_suggest.closing_balance;

        ///unmappedlistcounts
        this.length_of_credit_unmap = file[2].unmapped.credit_count;
        this.length_of_debit_unmap = file[2].unmapped.debit_count;
        this.sum_of_credit_unmap = file[2].unmapped.credit_sum;
        this.sum_of_debit_unmap = file[2].unmapped.debit_sum;
        this.unmapped_closingbalance = file[2].unmapped.closing_balance;
        this.unmapped_net_balance = file[2].unmapped.net_bal_unmap;
        ///partiallylistcount
        this.length_of_credit_partial = file[1].partially_suggest.credit_count;
        this.length_of_debit_partial = file[1].partially_suggest.debit_count;
        this.sum_of_credit_partial = file[1].partially_suggest.credit_sum;
        this.sum_of_debit_partial = file[1].partially_suggest.debit_sum;
        this.partially_net_balance = file[1].partially_suggest.net_bal_part;
        this.partially_closingbalance =
          file[1].partially_suggest.closing_balance;
        this.total_unmapped_balance =
          this.unmapped_net_balance + this.partially_net_balance;
        this.closingbalance = file[3].closing_balance;
      },
      (error: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.notification.showWarning(error.status + error.message);
      }
    );
  }
  panelclosed(arrayname, scrollcontrol) {
    scrollcontrol.scrollTop = scrollcontrol.offsetHeight;
    let limit = this.offsetlimit;
    if (this.partialarrayname == arrayname) {
      this.parmapendlimit = limit;
    } else if (arrayname == this.autoarrayname) {
      this.autoendlimit = limit;
      this.showautoknockbtn = false;
    } else if (arrayname == this.unmappedarrayname) {
      this.unmapendlimit = limit;
    } else if (arrayname == this.mappedarrayname) {
      this.mapendlimit = limit;
    } else if (arrayname == this.patternarrayname) {
      this.patternlimit = limit;
    }
  }

  listselectall(list, value) {
    console.log("checkbox", value);
    if (value) {
      list.forEach((element) => {
        element.selected = true;
      });
    } else {
      list.forEach((element) => {
        element.selected = false;
      });
    }
    return list;
  }
  selectallcheckbox(arrayname) {
    if (this.partialarrayname == arrayname) {
    } else if (arrayname == this.autoarrayname) {
      this.autoknocklist = this.listselectall(
        this.autoknocklist,
        this.autoselectall
      );
    } else if (arrayname == this.unmappedarrayname) {
    } else if (arrayname == this.mappedarrayname) {
    }
  }
  downloadxl(arrayname) {
    if (this.accountid == null) {
      this.notification.showError("Account No Not Seleced");
      return;
    }
    if (this.account_type == null) {
      this.account_type = 1;
    }
    let payload = {
      account_type: this.account_type,
      filter_type: [arrayname],
      account_id: this.accountid,
    };

    let params = "excel=1&role=1&todate=" + this.to_Date;
    this.proofingService
      .dataDownload(payload, params)
      .subscribe((data: any) => {
        let binaryData = [];
        binaryData.push(data);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = arrayname + ".xlsx";
        link.click();
      });
  }
  gettemplatesMapped() {
    console.log("Template Id", this.accountobject.cbs_template.id);
    this.proofingService
      .getTemplateDetails(this.accountobject.cbs_template.id)
      .subscribe((response) => {
        this.resetlimit();
        this.accountid = this.accountobject.id;
        this.headerarray = response.details;
        this.headerarray.splice(3, 5);
        this.headerarray.push({
          sys_col_name: "",
          column_name: "Debit",
          class: "proofingheaderamount",
        });
        this.headerarray.push({
          sys_col_name: "",
          column_name: "Credit",
          class: "proofingheaderamount",
        });
        this.headerarray.push({
          sys_col_name: "",
          column_name: "Proofing Date",
          class: "proofingheaderamount",
        });
        this.headerarray.push({
          sys_col_name: "",
          column_name: "Batch Code",
          class: "proofingheaderamount",
        });
        this.headerarray.push({
          sys_col_name: "",
          column_name: "Label",
          class: "proofingheaderamount",
        });
        // this.autoknocklist = [];
        // this.partiallymappedlist = [];
        // this.mappedlist = [];
        // this.unmappedlist = [];
        // console.log(this.headerarray)
      });
    this.checkedItems = [];
    this.noofCredit = 0;
    this.noofDebit = 0;
    this.sumofCredit = 0;
    this.sumofDebit = 0;
    this.ShowMappingFlag = false;
    this.autotopartialflag = false;
    this.selectedList = [];
  }
  getpartiallymappedsize(event){
    console.log(event)
    if(event.data==='.'||event.data==='e'){
      this.notification.showInfo('This field only accepts integers. Decimal points are not allowed')
      this.partiallymapped.reset()
      // this.partiallymapped.setValue(this.partiallymappedsize)
      return
    }
if(this.partiallymapped.value===null){
  this.partiallymappedsize=10
}else{
  this.partiallymappedsize=this.partiallymapped.value
}
  

    setTimeout(() => {
      this.partiallymap_func(this.mappingp);
    }, 1000);
  }
  getknockoffsize(event){
    console.log(event)
    if(event.data==='.'||event.data==='e'){
      this.notification.showInfo('This field only accepts integers. Decimal points are not allowed')
      this.knockoffform.reset()
      // this.partiallymapped.setValue(this.partiallymappedsize)
      return
    }

    if(this.knockoffform.value===null){
      this.knockoffsize=10
    }else{
      this.knockoffsize=this.knockoffform.value
    }
    

    setTimeout(() => {
      this.mapped_func(this.mappingknockoff);
    }, 1000);
  }
  getunmappedsize(event){
    console.log(event)
    if(event.data==='.'||event.data==='e'){
      this.notification.showInfo('This field only accepts integers. Decimal points are not allowed')
      this.unmappedform.reset()
      // this.unmappedform.setValue(this.partiallymappedsize)
      return
    }
if(this.unmappedform.value===null){
  this.unmappedsize=10
}else{
  this.unmappedsize=this.unmappedform.value
}
    

    setTimeout(() => {
      this.unmapped(this.mappingun);
    }, 1000);
  }
  getpattersize(event){
    console.log(event)
    if(event.data==='.'||event.data==='e'){
      this.notification.showInfo('This field only accepts integers. Decimal points are not allowed')
      this.knockoffform.reset()
      // this.partiallymapped.setValue(this.partiallymappedsize)
      return
    }
    if(this.patternform.value===null){
      this.pattersize=10
    }else{
      this.pattersize=this.patternform.value
    }

    

    setTimeout(() => {
      this.pattern_suggestion(this.partternclick);
    }, 1000);
  }
}

import { Pipe, PipeTransform } from "@angular/core";
import { Subscription } from "rxjs";
import { E } from "@angular/cdk/keycodes";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { data } from "jquery";

@Pipe({
  name: "FilterPipe",
})
export class FilterPipe implements PipeTransform {
  prevvalue: any;
  execute: boolean = false;
  tablerowstyles = (color) => {
    let styles = {
      "background-color": color,
    };
    return styles;
  };

  colorindex: number;
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NotificationService
  ) {}
  transform(array: any[], filtervalues: any[]): any[] {
    console.log("Pipe hits");

    let value = JSON.stringify(filtervalues);
    if (value == this.prevvalue) {
      this.execute = false;
    } else {
      this.prevvalue = value;
      this.execute = true;
    }
    let fieldname = "rule_reference_no";
    let filteredarray = [];

    if (this.execute) {
      filteredarray = array.filter((element, index) => {
        if (index == 0) {
          this.colorindex = 0;
          element.rowstyle = this.tablerowstyles(Colors[0]);
        } else {
          if (element[fieldname] == array[index - 1][fieldname]) {
            element.rowstyle = this.tablerowstyles(Colors[this.colorindex]);
          } else {
            this.colorindex == 2
              ? (this.colorindex = 0)
              : (this.colorindex += 1);
            element.rowstyle = this.tablerowstyles(Colors[this.colorindex]);
          }
        }

        if (!array || !filtervalues || !filtervalues.length) {
          return array;
        }

        for (let items of filtervalues) {
          let inputvalue = items.value.slice(0, items.length);
          element.rowstyle = null;

          if (inputvalue) {
            return String(element[items.name])
              .toLowerCase()
              .includes(inputvalue.toLowerCase());
          } else {
            return element;
          }
        }
      });
    } else {
      return array;
    }

    filteredarray?.length == 0
      ? this.notification.showInfo("No Data Found")
      : "";
    if (filtervalues[0]?.highlight) {
      this.insertcolorintoarray(filteredarray);
    }

    return filteredarray;
  }

  insertcolorintoarray(array) {
    let fieldname = "rule_reference_no";
    array.forEach((element, index) => {
      if (index == 0) {
        this.colorindex = 0;
        element.rowstyle = this.tablerowstyles(Colors[0]);
      } else {
        if (element[fieldname] == array[index - 1][fieldname]) {
          element.rowstyle = this.tablerowstyles(Colors[this.colorindex]);
        } else {
          this.colorindex == 2 ? (this.colorindex = 0) : (this.colorindex += 1);
          element.rowstyle = this.tablerowstyles(Colors[this.colorindex]);
        }
      }
    });
    return array;
  }
  removecolors(array) {
    array.forEach((element) => {
      element.rowstyle = null;
    });
  }
  
}

@Pipe({
  name: "FilterPipes",
})
export class FilterPipes implements PipeTransform {
  prevvalue: any;
  execute: boolean = false;
  tablerowstyles = (color) => {
    let styles = {
      "background-color": color,
    };
    return styles;
  };
  colorindex: number;
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NotificationService
  ) {}
  transform(array: any, filtervalues: any) {
    console.log("Pipe hits");
    let value = JSON.stringify(filtervalues);
    if (value == this.prevvalue) {
      this.execute = false;
    } else {
      this.prevvalue = value;
      this.execute = true;
    }
    //the above logics to check whether input has changed or not.
    let fieldname = "rule_reference_no";
    var filteredarray = [];
    if (this.execute) {
      filteredarray = array.filter((element, index) => {
        if (index == 0) {
          this.colorindex = 0;
          element.rowstyle = this.tablerowstyles(Colors[0]);
        } else {
          if (element[fieldname] == array[index - 1][fieldname]) {
            element.rowstyle = this.tablerowstyles(Colors[this.colorindex]);
          } else {
            this.colorindex == 2
              ? (this.colorindex = 0)
              : (this.colorindex += 1);
            element.rowstyle = this.tablerowstyles(Colors[this.colorindex]);
          }
        }

        for (let items of filtervalues) {
          let inputvalue = items.value.slice(0, items.length);
          // if (element[items.name].includes(items.value)) {
          //   check = true;
          // }
          element.rowstyle = null;
          if (inputvalue) {
            return String(element[items.name]).includes(inputvalue);
          } else {
            return element;
          }
        }

        // console.log(check)
        // if (check) {
        //   console.log(element)
        //   return element

        // }
      });
    } else {
      return array;
    }
    filteredarray?.length == 0
      ? this.notification.showInfo("No Data Found")
      : "";
    if (filtervalues[0].highlight) {
      this.insertcolorintoarray(filteredarray);
    }
    return filteredarray;
  }
  insertcolorintoarray(array) {
    let fieldname = "rule_reference_no";
    array.forEach((element, index) => {
      if (index == 0) {
        this.colorindex = 0;
        element.rowstyle = this.tablerowstyles(Colors[0]);
      } else {
        if (element[fieldname] == array[index - 1][fieldname]) {
          element.rowstyle = this.tablerowstyles(Colors[this.colorindex]);
        } else {
          this.colorindex == 2 ? (this.colorindex = 0) : (this.colorindex += 1);
          element.rowstyle = this.tablerowstyles(Colors[this.colorindex]);
        }
      }
    });
    return array;
  }
  removecolors(array) {
    array.forEach((element) => {
      element.rowstyle = null;
    });
  }
 
}