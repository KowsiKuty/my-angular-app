import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { SharedService } from "../../service/shared.service";
import { PRPOSERVICEService } from "../prposervice.service";
import { PRPOshareService } from "../prposhare.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  FormGroupDirective,
  FormArrayName,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NotificationService } from "../notification.service";
import { Router } from "@angular/router";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Observable, from, fromEvent } from "rxjs";
import { environment } from "src/environments/environment";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  filter,
  switchMap,
  finalize,
  takeUntil,
  map,
} from "rxjs/operators";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from "../error-handling-service.service";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import { formatDate, DatePipe } from "@angular/common";
import { F, I } from "@angular/cdk/keycodes";
import { Console } from "console";
import { data } from "jquery";
import { Renderer } from "html2canvas/dist/types/render/renderer";
import { ReportserviceService } from "src/app/reports/reportservice.service";

export interface commoditylistss {
  id: string;
  name: string;
}

export interface productLists {
  no: string;
  name: string;
  id: number;
  code: string;
}

export interface itemsLists {
  id: string;
  name: string;
}

export interface comlistss {
  id: string;
  name: string;
}

export interface branchlistss {
  id: any;
  name: string;
  code: string;
}
export interface supplierlistss {
  id: string;
  name: string;
}
export interface pcalistss {
  no: string;
  id: string;
  mepno: string;
}
export const PICK_FORMATS = {
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
export interface datesvalue {
  value: any;
}

@Component({
  selector: "app-prpo-tabs-pr",
  templateUrl: "./prpo-tabs-pr.component.html",
  styleUrls: ["./prpo-tabs-pr.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
  ],
})
export class PrpoTabsPRComponent implements OnInit {
  prpoPRList: any;
  urls: string;
  urlprmaker;
  urlprapprover;
  urlbrmaker;
  urlbrapprover;
  Lists: any = [];
 producttype_next = false;
  producttype_pre = false;
  producttype_crtpage = 1;
 prdTypes: any=[]
 @ViewChild("productInput") productInput: any;
  @ViewChild("productauto") productAutocomplete: MatAutocomplete;
  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;

  isPrmaker: boolean;
  isPrmakerTab: boolean;

  isPrapprover: boolean;
  isPrapproverTab: boolean;

  isPrCreateScreenTab: boolean;
  isPrApproverScreenTab: boolean;

  isBrmaker: boolean;
  isBrmakerTab: boolean;

  isBrapprover: boolean;
  isBrapproverTab: boolean;

  isBrCreateScreenTab: boolean;
  isBrApproverScreenTab: boolean;

  prSummaryList: any;
  prSummaryExport: boolean;
  PRSummarySearch: FormGroup;
  BRSummarySearch: FormGroup;
  ViewBR: FormGroup;
  ViewBRApp: FormGroup;
  brSummaryList: any;
  ApproveBR: FormGroup;
  ReturnBR: FormGroup;
  RejectBR: FormGroup;

  searchData: any;
  tokenValues: any;
  jpgUrls: string;
  imageUrl = environment.apiURL;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;
  pgsize = 10;
  isPrSummaryPagination: boolean;
  prtranSummaryList: any;
  PrTranHistoryList: any;
  BrTranHistoryList: any;
  prdetailsList: any;
  isEditBtn: boolean;

  prnodata: any;
  prdate: any;
  prraised: any;
  prcommodity: any;
  dtsdata: any;
  typedata: any;

  has_previousdetail: boolean;
  has_nextdetail: boolean;
  presentpageprdetail: number = 1;
  PRheaderID_Data: any;

  showHeaderimagepopup: boolean;

  showimageHeaderapp: boolean;

  fileListHeader: any;

  fileList: any = [];

  showimageHeader: boolean;

  showimagepopup: boolean;

  showHeaderimagepopupapp: boolean;
  // fileListHeader: any

  approverlist: any;
  isPRApproverExport: boolean;
  PRApproverSearch: FormGroup;
  prapproverList: any;
  PrTranHistoryListapp: any;

  BRApproverSearch: FormGroup;

  presentpageapp: number = 1;
  has_nextapp = true;
  has_previousapp = true;
  has_previousbr = true;
  has_nextbr = true;
  presentpagebr: number = 1;
  // pageSize = 10;
  // tokenValues: any
  // jpgUrls: string;
  // imageUrl = environment.apiURL
  // currentpage: number = 1;
  @Output() onSubmit = new EventEmitter<any>();
  isLoading = false;
  commodityList: Array<commoditylistss>;
  commodityList1: Array<comlistss>;
  productList: Array<productLists>;
  itemList: Array<itemsLists>;
  branchList: Array<branchlistss>;
  supplierList: Array<supplierlistss>;
  PCAList: Array<pcalistss>;
  statuslist: any;
  prdraftsummary: any;
  @ViewChild("supplier") matsupplierAutocomplete: MatAutocomplete;
  @ViewChild("supplierInput") supplierInput: any;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("commodity") matcommodityAutocomplete: MatAutocomplete;
  @ViewChild("commodityInput") commodityInput: any;
  @ViewChild("branch") matbranchAutocomplete: MatAutocomplete;
  @ViewChild("branchInput") branchInput: any;
  @ViewChild("pcano") matpcaAutocomplete: MatAutocomplete;
  @ViewChild("PCAInput") PCAInput: any;
  @ViewChild("comInput") comInput: any;
  @ViewChild("productcat") matproductAutocomplete: MatAutocomplete;
  // @ViewChild("productInput") productInput: any;
  @ViewChild("item") matitemAutocomplete: MatAutocomplete;
  @ViewChild("itemInput") itemInput: any;
  @ViewChild("approved") modal: ElementRef;
  @ViewChild("closebutton") closebutton;
  @ViewChild("closerdbutton") closerdbutton;
  @ViewChild("closertbutton") closertbutton;

  @ViewChild("com") matcommodityyAutocomplete: MatAutocomplete;
  @ViewChild("comInput") commodityyInput: any;
  filekey: any;
  data_final: any;
  showdraft: boolean = false;
  showCommon: boolean = true;
  showAll: boolean = true;
  showApp: boolean = true;
  ccbsfilekey: any;
  prmakid: any;
  prdetails_bfile_id: any;
  prdetailsbfileid: any;
  is_admin: any;
  PoList: any;
  prnumber: any;
  id: any;
  prno: any;
  ccbs_bfile_id: any;
  prappdelid: any;
  prapproveId: any;
  deliverydetailsList: any[] = [];
  grnList: any;
  hasnextgrn: boolean;
  haspreviousgrn: boolean;
  presentpggrn: number = 1;
  PrList: any;
  type_data: void;
  // mepdata: any[]=[]
  pcaa: any;
  mepdata: any[];
  mepvalue: any;
  brsummarylist: any;
  productidss: any;
  productname: any;
  commodittyid: any;
  quantity: number;
  brAppSummaryList: any;
  brdetailsList: any;
  branchhid: any;
  commodityy: any;
  productt: any;
  branchhId: any;
  selectedFiles: File[] = [];
  evy: Promise<unknown>;
  headerid: any;
  headid: any;

  APPROVED = 2;
  REJECTED = 3;
  RETURNED = 11;
  prheadid: any;
  remarks: any;
  prheader_status: number;
  finalstatus: any;
  commoditty: any;
  uomm: any;
  uommm: any;
  filesListHeader: any;
  showHeaderbrimagepopup: boolean;
  showgrnraisedpopup: boolean;
  branchSummary: any;
  BRmakerExcel: FormGroup;
  remakrs: any;
  idd: any;
  remark: any;
  ids: any;
  dialogcl: boolean;
  remarkk: any;
  remarrk: any;
  idss: any;
  idds: any;
  braanchid: any;
  currentpageprodd: any;
  has_nextprodd: boolean;
  has_previousprodd: boolean;
  currentpagecomm: number;
  has_nextcomm: boolean;
  has_previouscomm: boolean;
  grnrList: any;
  panelOpenState: boolean = true;
  isReplace: any;

  totalcount: any;
  prView: boolean = true;
  prdel: boolean = true;
  brmaker: boolean;
  brmakert: boolean = true;
  brappt: boolean = true;
  prsumm: boolean = true;
  prsumm1: boolean = true;
  isdelivery: boolean[] = [];
  product_type: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private shareService: SharedService,
    private prposervice: PRPOSERVICEService,
    private prsharedservice: PRPOshareService,
    private toastr: ToastrService,
    private notification: NotificationService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingServiceService,
    private datepipe: DatePipe,
    private renderer: Renderer2,
    private reportService: ReportserviceService
  ) {}

  ngOnInit(): void {
    let datas = this.shareService.menuUrlData;
    datas?.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "PR") {
        this.prpoPRList = subModule;
        this.isPrmaker = subModule[0].name;
        console.log("prpoParmenuList", this.prpoPRList);
      }
      if (element.name === "Branch") {
        this.prpoPRList = subModule;
        this.isBrmaker = subModule[0].name;
        console.log("prpoParmenuList", this.prpoPRList);
      }
    });

    let value = this.prsharedservice.backtoSummaryValue.value;
    if (value == 1) {
      this.getPRsummary("");
      this.isPrmakerTab = true;
      this.isPrapproverTab = false;
      this.isPrCreateScreenTab = false;
      this.isPrApproverScreenTab = false;
      this.isBrmakerTab = false;
      this.isBrapproverTab = false;
      this.isBrCreateScreenTab = false;
      this.isBrApproverScreenTab = false;
    }
    this.justificationC = this.fb.group({
      justification: [""],
    });
    this.PRSummarySearch = this.fb.group({
      no: [""],
      prheader_status: [""],
      branch_id: [""],
      commodity_id: [""],
      supplier_id: [""],
      amount: [""],
      product_type: [""],
      product_id:[""],
      mepno: [""],
      date: [""],
    });
    this.PRApproverSearch = this.fb.group({
      no: [""],
      commodityname: [""],
      branch_id: [""],
      supplier_id: [""],
      prheader_status: [""],
      product_type: [""],
      product_id:[""],
      amount: [""],
      mepno: [""],
      date: [""],
      
    });

    this.BRmakerExcel = this.fb.group({
      branch_id: [""],
      commodity_id: [""],
      product_id: [""],
      qty: [""],
    });

    // this.getprstatus()
    // this.PRApproverSearch.get('commodityname').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.prposervice.getcommodityFKdd(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.commodityList = datas;

    //   },(error) => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   })

    // this.PRSummarySearch.get('branch_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;

    //   }),
    //   switchMap(value => this.prposervice.getbranchFK(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.branchList = datas;
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.PRApproverSearch.get('branch_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;

    //   }),
    //   switchMap(value => this.prposervice.getbranchFK(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.branchList = datas;
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.PRSummarySearch.get('supplier_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.prposervice.getsupplierDropdownFKdd(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.supplierList = datas;
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.PRApproverSearch.get('supplier_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.prposervice.getsupplierDropdownFKdd(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.supplierList = datas;
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.PRSummarySearch.get('mepno').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.prposervice.getmepFKdd(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.PCAList = datas;
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.PRApproverSearch.get('mepno').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.prposervice.getmepFKdd(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.PCAList = datas;
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.PRSummarySearch.get('commodity_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.prposervice.getcommodityFKdd(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.commodityList = datas;

    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    this.BRSummarySearch = this.fb.group({
      branch_id: [""],
      commodity_id: [""],
      product_id: [""],
      product_type: [""],
      qty: [""],
    });

    this.BRApproverSearch = this.fb.group({
      branch_id: [""],
      commodity_id: [""],
      product_id: [""],
      product_type: [""],
      qty: [""],
    });

    this.ViewBR = this.fb.group({
      branch: [""],
      bs: [""],
      cc: [""],
      uom: [""],
      quantity: [""],
      remarks: [""],
    });

    this.ViewBRApp = this.fb.group({
      branch: [""],
      bs: [""],
      cc: [""],
      uom: [""],
      quantity: [""],
      remarks: [""],
    });

    this.ApproveBR = this.fb.group({
      id: [""],
      prheader_status: [""],
      remarks: [""],
    });

    this.ReturnBR = this.fb.group({
      id: [""],
      prheader_status: [""],
      remarks: [""],
    });

    this.RejectBR = this.fb.group({
      id: [""],
      prheader_status: [""],
      remarks: [""],
    });

    // this.BRSummarySearch.get('branch_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;

    //   }),
    //   switchMap(value => this.prposervice.getbranchFK(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.branchList = datas;
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.BRApproverSearch.get('branch_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;

    //   }),
    //   switchMap(value => this.prposervice.getbranchFK(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.branchList = datas;
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.BRSummarySearch.get('commodity_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.prposervice.getcommodityFKdd(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.commodityList = datas;

    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.BRApproverSearch.get('commodity_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.prposervice.getcommodityFKdd(value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.commodityList = datas;

    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.getbrsummary();

    // this.product_id.valueChanges.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged()
    // ).subscribe(value => {
    //   // this.searchProducts(value);
    //   this.getitemFK()
    // });
    // this.BRSummarySearch.get('product_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.prposervice.getproductfn(this.commodittyid,value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.productList = datas;

    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })
    // this.BRApproverSearch.get('product_id').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     console.log('inside tap')

    //   }),
    //   switchMap(value => this.prposervice.getproductfn(this.commodittyid,value, 1)
    //     .pipe(
    //       finalize(() => {
    //         this.isLoading = false
    //       }),
    //     )
    //   )
    // )
    // .subscribe((results: any[]) => {
    //   let datas = results["data"];
    //   this.productList = datas;
    //   // if(this.productList.length == 0){
    //   //   this.notification.showInfo("No Product Specified!");
    //    this.SpinnerService.hide();
    //   // }
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })
    // this.getBRFirst(1);

    // this.getBRAppFirst(1);
    this.getproductType();

    this.BRSummarySearch.get("branch_id").valueChanges.subscribe((value) => {
      this.braanchid = value ? value.id : null;
    });

    this.BRSummarySearch.get("commodity_id").valueChanges.subscribe((value) => {
      this.commodittyid = value ? value.id : null;
    });

    this.BRSummarySearch.get("product_id").valueChanges.subscribe((value) => {
      this.productidss = value ? value.id : null;
    });

    this.BRSummarySearch.get("qty").valueChanges.subscribe((value) => {
      this.quantity = value;
    });

    this.BRApproverSearch.get("branch_id").valueChanges.subscribe((value) => {
      this.braanchid = value ? value.id : null;
    });

    this.BRApproverSearch.get("commodity_id").valueChanges.subscribe(
      (value) => {
        this.commodittyid = value ? value.id : null;
      }
    );

    this.BRApproverSearch.get("product_id").valueChanges.subscribe((value) => {
      this.productidss = value ? value.id : null;
    });

    this.BRApproverSearch.get("qty").valueChanges.subscribe((value) => {
      this.quantity = value;
    });


    // Listen to changes in "amount"
  // this.PRApproverSearch.get('amount')?.valueChanges.subscribe(val => {
  //   if (val !== null && val !== undefined && val !== '') {
  //     // Always keep numeric value
  //     const numericValue = val.toString().replace(/,/g, '');
  //     if (!isNaN(numericValue)) {
  //       const numberValue = Number(numericValue);

  //       Format with commas for display
  //       const formatted = new Intl.NumberFormat('en-IN').format(numberValue);

  //       Patch formatted string into the input field
  //       this.PRApproverSearch.get('amount')?.setValue(formatted, { emitEvent: false });
  //     }
  //   }
  // });

      // Listen to changes in "amount"
  // this.PRSummarySearch.get('amount')?.valueChanges.subscribe(val => {
  //   if (val !== null && val !== undefined && val !== '') {
  //     Always keep numeric value
  //     const numericValue = val.toString().replace(/,/g, '');
  //     if (!isNaN(numericValue)) {
  //       const numberValue = Number(numericValue);

  //       Format with commas for display
  //       const formatted = new Intl.NumberFormat('en-IN').format(numberValue);

  //       Patch formatted string into the input field
  //       this.PRSummarySearch.get('amount')?.setValue(formatted, { emitEvent: false });
  //     }
  //   }
  // });
  }  



  getproductType(){
    // this.isLoading = true;
    this.prposervice.getproductType().subscribe(
      (results: any[]) => {
        // this.isLoading = false;
        let datas = results["data"];
        // let datapagination = results["pagination"];
        this.Lists = results;
        // this.has_nextprod = datapagination.has_next;
        // this.has_previousprod = datapagination.has_previous;
        // this.currentpageprod = datapagination.index;
      },
      (error) => {
        this.isLoading = false;
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  // searchProducts(query: string) {
  //   this.isLoading = true;
  //   this.prposervice.getproductfn(this.commodittyid, query, 1).subscribe(
  //     (results: any[]) => {
  //       this.isLoading = false;
  //       let datas = results["data"];
  //       let datapagination = results["pagination"];
  //       this.productList = datas;
  //       this.has_nextprod = datapagination.has_next;
  //       this.has_previousprod = datapagination.has_previous;
  //       this.currentpageprod = datapagination.index;
  //       if (this.productList.length == 0) {
  //         this.notification.showInfo("No Product Specified!");
  //         this.SpinnerService.hide();
  //       }
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     }
  //   );
  // }

  productclick(item) {
    this.productidss = item.id;
    this.productname = item.name;
  }

  /////////////////////////////////////////////////////////////////////////////////////

  public displayFnitem(item?: itemsLists): string | undefined {
    return item ? item.name : undefined;
  }

  getbrproduct() {
    this.getitemFK();

    this.BRSummarySearch.get("product_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getproductfn(this.commodittyid, this.product_type, value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.productList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }
  getproduct() {
    this.getitemFK();

    this.PRSummarySearch.get("product_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getproductfn(this.commodittyid, this.product_type, value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.productList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }
  getappproduct() {
    this.getitemFK();

    this.PRApproverSearch.get("product_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getproductfn(this.commodittyid, this.product_type, value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.productList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getbrappproduct() {
    this.getitemFK();

    this.BRApproverSearch.get("product_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getproductfn(this.commodittyid, this.product_type, value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.productList = datas;
          // if(this.productList.length == 0){
          //   this.notification.showInfo("No Product Specified!");
          this.SpinnerService.hide();
          // }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }
  getitemFK() {
    this.SpinnerService.show();
    let rmkeyvalue: String = "";
    this.getRmEmployee(rmkeyvalue);
  }
  private getRmEmployee(rmkeyvalue: any) {
    if (this.BRSummarySearch.get("commodity_id").value) {
      this.commoditty = this.BRSummarySearch?.get("commodity_id")?.value?.id;
    }
    if (this.BRApproverSearch.get("commodity_id").value) {
      this.commoditty = this.BRApproverSearch?.get("commodity_id")?.value?.id;
    }
    // if (
    //   this.commodittyid == undefined ||
    //   this.commodittyid == "" ||
    //   this.commodittyid == null
    // ) {
    //   this.prposervice
    //     .getonlyproduct(this.itemInput.nativeElement.value, 1)
    //     .subscribe((results: any) => {
    //       let datas = results["data"];
    //       this.productList = datas;
    //       this.SpinnerService.hide();
    //       if (this.productList.length == 0) {
    //         this.notification.showInfo("No Product Specified!");
    //         this.SpinnerService.hide();
    //       }
    //     });
    // } else {
      this.prposervice
        .getproductfn(this.commodittyid, this.product_type, rmkeyvalue, 1)
        .subscribe((results: any) => {
          let datas = results["data"];
          this.productList = datas;
          this.SpinnerService.hide();
          if (this.productList.length == 0) {
            this.notification.showInfo("No Product Specified!");
            this.SpinnerService.hide();
          }
        });
    // }
  }
  autocompleteitemScroll() {
    console.log("has next of item==>", this.has_nextprod);
    this.currentpageprodd = 1;
    this.has_nextprodd = true;
    this.has_previousprodd = true;

    setTimeout(() => {
      if (
        this.matitemAutocomplete &&
        this.autocompleteTrigger &&
        this.matitemAutocomplete.panel
      ) {
        fromEvent(this.matitemAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matitemAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matitemAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matitemAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matitemAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextprodd == true) {
                this.prposervice
                  .getproductfn(
                    this.commodittyid,
                    this.product_type,
                    this.itemInput.nativeElement.value,
                    this.currentpageprodd + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.productList = this.productList.concat(datas);
                      if (this.productList.length >= 0) {
                        this.has_nextprodd = datapagination.has_next;
                        this.has_previousprodd = datapagination.has_previous;
                        this.currentpageprodd = datapagination.index;
                      }
                      if (this.productList.length == 0) {
                        this.notification.showInfo("No Product Specified!");
                        this.SpinnerService.hide();
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////

  public displayFnsupplier(supplier?: supplierlistss): any | undefined {
    return supplier ? supplier.name : undefined;
  }

  getprsupplier() {
    this.getSupplier();

    this.PRSummarySearch.get("supplier_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getsupplierDropdownFKdd(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.supplierList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getprappsupplier() {
    this.getSupplier();

    this.PRApproverSearch.get("supplier_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getsupplierDropdownFKdd(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.supplierList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getSupplier() {
    this.SpinnerService.show();
    this.prposervice.getsupplierDropdown().subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.supplierList = datas;
        console.log("supplierList", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  public displayFnPCANo(pca?: pcalistss): any | undefined {
    return pca ? pca.mepno : undefined;
  }

  getprpca() {
    this.getPCA();

    this.PRSummarySearch.get("mepno")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getmepFKdd(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.PCAList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getprapppca() {
    this.getPCA();

    this.PRApproverSearch.get("mepno")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getmepFKdd(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.PCAList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getPCA() {
    this.SpinnerService.show();
    this.prposervice.getmepFK("").subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.PCAList = datas;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  currentpagesupplier = 1;
  has_nextsupplier = true;
  has_previoussupplier = true;
  autocompletesupplierScroll() {
    setTimeout(() => {
      if (
        this.matsupplierAutocomplete &&
        this.autocompleteTrigger &&
        this.matsupplierAutocomplete.panel
      ) {
        fromEvent(this.matsupplierAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matsupplierAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matsupplierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matsupplierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matsupplierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsupplier === true) {
                this.prposervice
                  .getsupplierDropdownFKdd(
                    this.supplierInput.nativeElement.value,
                    this.currentpagesupplier + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.supplierList = this.supplierList.concat(datas);
                      if (this.supplierList.length >= 0) {
                        this.has_nextsupplier = datapagination.has_next;
                        this.has_previoussupplier = datapagination.has_previous;
                        this.currentpagesupplier = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  currentpagepca = 1;
  has_nextpca = true;
  has_previouspca = true;
  autocompletepcaScroll() {
    setTimeout(() => {
      if (
        this.matpcaAutocomplete &&
        this.autocompleteTrigger &&
        this.matpcaAutocomplete.panel
      ) {
        fromEvent(this.matpcaAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matpcaAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matpcaAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matpcaAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matpcaAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpca === true) {
                this.prposervice
                  .getmepFKdd(
                    this.PCAInput.nativeElement.value,
                    this.currentpagepca + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.PCAList = this.PCAList.concat(datas);
                      if (this.PCAList.length >= 0) {
                        this.has_nextpca = datapagination.has_next;
                        this.has_previouspca = datapagination.has_previous;
                        this.currentpagepca = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  subModuleData(data) {
    this.tabchange_reset();
    this.urls = data.url;
    this.urlprmaker = "/prmaker";
    this.urlprapprover = "/prapprover";
    this.urlbrmaker = "/branchprmaker";
    this.urlbrapprover = "/branchprapprover";

    this.isPrmaker = this.urlprmaker === this.urls ? true : false;
    this.isPrapprover = this.urlprapprover === this.urls ? true : false;
    this.isBrmaker = this.urlbrmaker === this.urls ? true : false;
    this.isBrapprover = this.urlbrapprover === this.urls ? true : false;
    this.roleValues = data?.role[0]?.name;
    this.addFormBtn = data?.name;

    if (this.isPrmaker) {
      this.isPrmakerTab = true;
      this.isPrapproverTab = false;
      this.isPrCreateScreenTab = false;
      this.isPrApproverScreenTab = false;
      this.isBrmakerTab = false;
      this.isBrapproverTab = false;
      this.isBrCreateScreenTab = false;
      this.isBrApproverScreenTab = false;
      this.BRSummarySearch.controls["branch_id"].reset();
      this.BRSummarySearch.controls["commodity_id"].reset();
      this.BRSummarySearch.controls["product_id"].reset();
      this.BRSummarySearch.controls["qty"].reset();
      this.BRApproverSearch.controls["branch_id"].reset();
      this.BRApproverSearch.controls["commodity_id"].reset();
      this.BRApproverSearch.controls["product_id"].reset();
      this.BRApproverSearch.controls["qty"].reset();
      this.getPRsummary("");
      this.getprstatus();
    } else if (this.isPrapprover) {
      this.isPrmakerTab = false;
      this.isPrapproverTab = true;
      this.isPrCreateScreenTab = false;
      this.isPrApproverScreenTab = false;
      this.isBrmakerTab = false;
      this.isBrapproverTab = false;
      this.isBrCreateScreenTab = false;
      this.isBrApproverScreenTab = false;
      this.BRSummarySearch.controls["branch_id"].reset();
      this.BRSummarySearch.controls["commodity_id"].reset();
      this.BRSummarySearch.controls["product_id"].reset();
      this.BRSummarySearch.controls["qty"].reset();
      this.BRApproverSearch.controls["branch_id"].reset();
      this.BRApproverSearch.controls["commodity_id"].reset();
      this.BRApproverSearch.controls["product_id"].reset();
      this.BRApproverSearch.controls["qty"].reset();
      this.getPRAppsummary("");
      this.getprstatus();
    } else if (this.isBrmaker) {
      this.isBrmakerTab = true;
      this.isBrapproverTab = false;
      this.isBrCreateScreenTab = false;
      this.isBrApproverScreenTab = false;
      this.isPrmakerTab = false;
      this.isPrapproverTab = false;
      this.isPrCreateScreenTab = false;
      this.isPrApproverScreenTab = false;
      this.BRApproverSearch.controls["branch_id"].reset();
      this.BRApproverSearch.controls["commodity_id"].reset();
      this.BRApproverSearch.controls["product_id"].reset();
      this.BRApproverSearch.controls["qty"].reset();
      this.getBRFirst(1);
    } else if (this.isBrapprover) {
      this.isBrmakerTab = false;
      this.isBrapproverTab = true;
      this.isBrCreateScreenTab = false;
      this.isBrApproverScreenTab = false;
      this.isPrmakerTab = false;
      this.isPrapproverTab = false;
      this.isPrCreateScreenTab = false;
      this.isPrApproverScreenTab = false;
      this.BRSummarySearch.controls["branch_id"].reset();
      this.BRSummarySearch.controls["commodity_id"].reset();
      this.BRSummarySearch.controls["product_id"].reset();
      this.BRSummarySearch.controls["qty"].reset();
      this.getBRAppFirst(1);
    }
  }

  isActiveTab(sub: any): boolean {
    // Check if the current tab is active
    return sub.url === this.urls; // Add your condition based on your logic
  }

  ////////////////////////////////////////////////////////PR Maker

  // getprSummary(pageNumber = 1, pageSize = 10) {
  //   this.SpinnerService.show();
  //   this.prposervice.getprsummary(pageNumber, pageSize)
  //     .subscribe(result => {
  //       this.SpinnerService.hide();
  //       this.prSummaryList = result['data']
  //       let dataPagination = result['pagination'];
  //       if (this.prSummaryList.length > 0) {
  //         this.has_next = dataPagination.has_next;
  //         this.has_previous = dataPagination.has_previous;
  //         this.presentpage = dataPagination.index;
  //       }
  //       console.log("PrSummary", result)
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }

  // nextClick() {
  //   if (this.has_next === true) {
  //     this.getprSummary(this.presentpage + 1, 10)
  //   }
  // }

  // previousClick() {
  //   if (this.has_previous === true) {
  //     this.getprSummary(this.presentpage - 1, 10)
  //   }
  // }

  serviceCallPRSummary(search, pageno, pageSize) {
    // this.SpinnerService.show();
    this.prposervice.getprSearch(search, pageno).subscribe(
      (result) => {
        if(result?.code){
          this.SpinnerService.hide()
          this.notification.showError(result?.description)
          return false
        }
        this.SpinnerService.hide();
        console.log("prsummary", result);
        this.is_admin = result.is_admin;
        this.shareService.is_admin.next(this.is_admin);
        this.prSummaryList = result["data"];
        // let prdetails_bfile_id=this.prSummaryList.prdetails_bfile_id
        // console.log('prdetails_bfile_id===>',prdetails_bfile_id)
        // this.prdetailsblkfile=this.prs
        console.log("prsummaryList", this.prSummaryList);
        let dataPagination = result["pagination"];
        this.totalcount = result.total_count;
        if (this.prSummaryList.length > 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.prSummaryExport = false;
          this.prsumm1 = true;
        }
        if (this.prSummaryList.length == 0) {
          this.prSummaryExport = true;
          this.prsumm1 = false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  getPRsummary(hint) {
    let search = this.PRSummarySearch.value;
    console.log("search==>", search);

        if (search.amount) {
    search.amount = search.amount.toString().replace(/,/g, '');
  }

    //4529
    if (search?.prheader_status == "DRAFT") {
      // if(search.branch_id == '' || search.branch_id == null || search.branch_id == undefined ){

      //   this.notification.showInfo("Please Choose Branch")
      //   return false
      // }

      // if(search.commodity_id == '' || search.commodity_id == null || search.commodity_id == undefined ){

      //   this.notification.showInfo("Please Choose Commodity Name")
      //   return false
      // }

      this.showCommon = false;
      this.showdraft = true;
    } else {
      this.showCommon = true;
      this.showdraft = false;
    }

    let obj;
    if (search?.prheader_status == "DRAFT") {
      obj = {
        no: search?.no,
        prheader_status: search?.prheader_status,
        branch_id: search?.branch_id?.id,
        supplier_id: search?.supplier_id?.id,
        amount: search?.amount,
        mepno: search?.mepno?.no,
        product_type: search?.product_type?.id,
        product_id: search?.product_id?.id,
        date: this.datepipe.transform(search.date, "yyyy-MM-dd"),
        commodity_id: search?.commodity_id?.id,
      };
      console.log("draftobj==>", obj);
    }
    //4529
    else {
      obj = {
        no: search?.no,
        prheader_status: search?.prheader_status,
        branch_id: search?.branch_id?.id,
        supplier_id: search?.supplier_id?.id,
        amount: search?.amount,
        mepno: search?.mepno?.no,
        product_type: search?.product_type?.id,
        product_id: search?.product_id?.id,
        date: this.datepipe.transform(search.date, "yyyy-MM-dd"),
      };
      console.log("approvedobj==>", obj);
    }

    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        delete obj[i];
      }
    }
    // this.SpinnerService.show();

    if (hint == "next") {
      this.serviceCallPRSummary(obj, this.presentpage + 1, 10);
    } else if (hint == "previous") {
      this.serviceCallPRSummary(obj, this.presentpage - 1, 10);
    } else {
      this.serviceCallPRSummary(obj, 1, 10);
    }
  }

  // serviceCallBRSummary(search,pageno,pageSize){
  //   this.prposervice.getbrSearch(search,pageno)
  //   .subscribe(result => {
  //     this.SpinnerService.hide();
  //     console.log("brsummary",result)
  //     this.is_admin = result.is_admin;
  //     this.brSummaryList = result['data']
  //     console.log("brsummaryList", this.brSummaryList)
  //     let dataPagination = result['pagination'];
  //     if (this.brSummaryList.length > 0) {
  //       this.has_next = dataPagination.has_next;
  //       this.has_previous = dataPagination.has_previous;
  //       this.presentpage = dataPagination.index;
  //     }
  //   },(error) => {
  //     this.errorHandler.handleError(error);
  //     this.SpinnerService.hide();
  //   })
  // }

  resetAfterCommodityChange(com) {
    this.commodittyid = com.id;
    console.log("<><><", this.commodittyid);
  }

  resetBranchChange(type, data) {
    this.BRSummarySearch.controls["branch_id"].reset("");
    this.BRApproverSearch.controls["branch_id"].reset("");
    if (type == "removebranch") {
      this.BRSummarySearch.controls["branch_id"].reset("");
      this.BRApproverSearch.controls["branch_id"].reset("");
    }
  }
  resetCommodityChange(type, data) {
    this.BRSummarySearch.controls["commodity_id"].reset("");
    this.BRApproverSearch.controls["commodity_id"].reset("");
    if (type == "removecom") {
      this.BRSummarySearch.controls["commodity_id"].reset("");
      this.BRApproverSearch.controls["commodity_id"].reset("");
    }
  }

  resetAfterProductChange(type, data) {
    // this.BRSummarySearch.controls["branch_id"].reset("")
    // this.BRSummarySearch.controls["commodity_id"].reset("")
    this.BRSummarySearch.controls["product_id"].reset("");
    // this.BRSummarySearch.controls['qty'].reset("");
    // this.BRApproverSearch.controls["branch_id"].reset("")
    // this.BRApproverSearch.controls["commodity_id"].reset("")
    this.BRApproverSearch.controls["product_id"].reset("");
    // this.BRApproverSearch.controls['qty'].reset("");
    let brFormData = this.BRSummarySearch.value.brdetails;
    if (type == "removeProd") {
      this.BRSummarySearch.controls["product_id"].reset("");
      this.BRApproverSearch.controls["product_id"].reset("");
    }
  }

  makerexceldownload() {
    let prno: any;
    let prstatus: any;
    let branchid: any;
    let supid: any;
    let pramt: any;
    let mepno: any;
    let prdate: any;
    let commodity_id: any; //for draft excel download

    let data = this.PRSummarySearch.value;
    if (data.no == null || data.no == undefined || data.no == "") {
      prno = "";
    } else {
      prno = data.no;
    }

    if (
      data.prheader_status == null ||
      data.prheader_status == undefined ||
      data.prheader_status == ""
    ) {
      prstatus = "";
    } else {
      prstatus = data.prheader_status;
    }

    if (data.date == null || data.date == undefined || data.date == "") {
      prdate = "";
    } else {
      prdate = this.datepipe.transform(data.date, "yyyy-MM-dd");
    }

    if (data.amount == null || data.amount == undefined || data.amount == "") {
      pramt = "";
    } else {
      pramt = data.amount;
    }

    if (
      data.branch_id == "" ||
      data.branch_id == undefined ||
      data.branch_id == null
    ) {
      branchid = "";
    } else {
      branchid = data?.branch_id?.id;
    }

    if (
      data.supplier_id == "" ||
      data.supplier_id == undefined ||
      data.supplier_id == null
    ) {
      supid = "";
    } else {
      supid = data?.supplier_id?.id;
    }
    if (data.mepno == "" || data.mepno == undefined || data.mepno == null) {
      mepno = "";
    } else {
      mepno = data?.mepno?.no;
    }
    //for DRAFT EXPORT
    if (
      data.commodity_id == "" ||
      data.commodity_id == undefined ||
      data.commodity_id == null
    ) {
      commodity_id = "";
    } else {
      commodity_id = data?.commodity_id?.id;
    }

    // if(typeof(data.branch_id) == 'object'){
    //   branchid = data?.branch_id?.id
    // }else if(typeof(data.branch_id) == 'number'){
    //   branchid = data?.branch_id
    // }else{
    //   branchid = ""
    // }

    // if(typeof(data.supplier_id) == 'object'){
    //   supid = data?.supplier_id?.id
    // }else if(typeof(data.supplier_id) == 'number'){
    //   supid = data?.supplier_id
    // }else{
    //   supid = ""
    // }

    // if(typeof(data.mepno) == 'object'){
    //   mepno = data?.mepno?.no
    // }else if(typeof(data.mepno) == 'string'){
    //   mepno = data?.mepno
    // }else{
    //   mepno = ""
    // }

    this.SpinnerService.show();
    this.prposervice
      .getPRMakerExcel(
        prno,
        prstatus,
        branchid,
        supid,
        pramt,
        mepno,
        prdate,
        commodity_id
      )
      .subscribe((data) => {
        this.SpinnerService.hide();
         if(data?.code){
          this.SpinnerService.hide()
          this.notification.showError(data?.description)
          return false
        }
        console.log(data["size"]);
        if (data["size"] <= 75) {
          this.toastr.warning("", "Records Not Found", { timeOut: 1500 });
          return false;
        } else {
          let binaryData = [];
          binaryData.push(data);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "PR Maker Report" + ".xlsx";
          link.click();
        }
      });
  }

  checkerexceldownload() {
    let prno: any;
    let prstatus: any;
    let branchid: any;
    let supid: any;
    let pramt: any;
    let mepno: any;
    let prdate: any;
    let commname: any;

    let data = this.PRApproverSearch.value;
    console.log("dataaaas", data);
    console.log("dataaaas1", data.date);
    if (data.no == null || data.no == undefined || data.no == "") {
      prno = "";
    } else {
      prno = data.no;
    }

    if (
      data.prheader_status == null ||
      data.prheader_status == undefined ||
      data.prheader_status == ""
    ) {
      prstatus = "";
    } else {
      prstatus = data.prheader_status;
    }

    if (data.date == null || data.date == undefined || data.date == "") {
      prdate = "";
    } else {
      prdate = this.datepipe.transform(data.date, "yyyy-MM-dd");
    }

    if (data.amount == null || data.amount == undefined || data.amount == "") {
      pramt = "";
    } else {
      pramt = data.amount;
    }

    if (
      data.branch_id == "" ||
      data.branch_id == undefined ||
      data.branch_id == null
    ) {
      branchid = "";
    } else {
      branchid = data?.branch_id?.id;
    }
    if (
      data.supplier_id == "" ||
      data.supplier_id == undefined ||
      data.supplier_id == null
    ) {
      supid = "";
    } else {
      supid = data?.supplier_id?.id;
    }
    if (data.mepno == "" || data.mepno == undefined || data.mepno == null) {
      mepno = "";
    } else {
      mepno = data?.mepno?.no;
    }
    if (
      data.commodityname == "" ||
      data.commodityname == undefined ||
      data.commodityname == null
    ) {
      commname = "";
    } else {
      commname = data?.commodityname?.id;
    }

    // if(typeof(data.branch_id) == 'object'){
    //   branchid = data.branch_id.id
    // }else if(typeof(data.branch_id) == 'number'){
    //   branchid = data.branch_id
    // }else{
    //   branchid = ""
    // }

    // if(typeof(data.supplier_id) == 'object'){
    //   supid = data?.supplier_id?.id
    // }else if(typeof(data.supplier_id) == 'number'){
    //   supid = data?.supplier_id
    // }else{
    //   supid = ""
    // }

    // if(typeof(data.mepno) == 'object'){
    //   mepno = data?.mepno?.no
    // }else if(typeof(data.mepno) == 'string'){
    //   mepno = data?.mepno
    // }else{
    //   mepno = ""
    // }

    // if(typeof(data.commodityname) == 'object'){
    //   commname = data?.commodityname?.id
    // }else if(typeof(data.commodityname) == 'number'){
    //   commname = data?.commodityname
    // }else{
    //   commname = ""
    // }

    this.SpinnerService.show();
    this.prposervice
      .getPRCheckerExcel(
        prno,
        prstatus,
        branchid,
        supid,
        pramt,
        mepno,
        prdate,
        commname
      )
      .subscribe((data) => {
        this.SpinnerService.hide();
        if (data?.code) {
        this.SpinnerService.hide();
        this.notification.showError(data?.description);
        return false;
        }
        if (data["size"] <= 75) {
          this.toastr.warning("", "Records Not Found", { timeOut: 1500 });
          return false;
        } else {
          let binaryData = [];
          binaryData.push(data);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "PR Approver Report" + ".xlsx";
          link.click();
        }
      });
  }

  brmakerexceldownload() {
    let branch_id: any;
    let commodity_id: any;
    let product_id: any;
    let qty: any;

    let status = this.BRSummarySearch.value;
    console.log("all data", status);

    if (
      status.branch_id == "" ||
      status.branch_id == null ||
      status.branch_id == undefined
    ) {
      delete status.branch_id;
    } else {
      branch_id = status.branch_id.id;
    }

    if (
      status.commodity_id == "" ||
      status.commodity_id == null ||
      status.commodity_id == undefined
    ) {
      delete status.commodity_id;
    } else {
      commodity_id = status.commodity_id.id;
    }

    if (
      status.product_id == "" ||
      status.product_id == null ||
      status.product_id == undefined
    ) {
      delete status.product_id;
    } else {
      product_id = status.product_id.id;
    }

    if (status.qty == "" || status.qty == null || status.qty == undefined) {
      delete status.qty;
    } else {
      qty = status.qty;
    }

    let data = {
      branch_id: branch_id,
      commodity_id: commodity_id,
      product_id: product_id,
      qty: qty,
    };

    this.prposervice.getBRMakerExcel(data).subscribe(
      (data) => {
        if (data.type == "application/json") {
          this.SpinnerService.hide();
          this.notification.showError("No Data Found");
        } else {
          let binaryData = [];
          binaryData.push(data);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = "BR Maker Report" + date + ".xlsx";
          link.click();
        }
      },
      (error) => {
        this.toastr.error("An error occurred while generating the report");
      }
    );
  }

  brappmakerexceldownload() {
    let branch_id: any;
    let commodity_id: any;
    let product_id: any;
    let qty: any;

    let status = this.BRApproverSearch.value;
    console.log("all data", status);

    if (
      status.branch_id == "" ||
      status.branch_id == null ||
      status.branch_id == undefined
    ) {
      delete status.branch_id;
    } else {
      branch_id = status.branch_id.id;
    }

    if (
      status.commodity_id == "" ||
      status.commodity_id == null ||
      status.commodity_id == undefined
    ) {
      delete status.commodity_id;
    } else {
      commodity_id = status.commodity_id.id;
    }

    if (
      status.product_id == "" ||
      status.product_id == null ||
      status.product_id == undefined
    ) {
      delete status.product_id;
    } else {
      product_id = status.product_id.id;
    }

    if (status.qty == "" || status.qty == null || status.qty == undefined) {
      delete status.qty;
    } else {
      qty = status.qty;
    }

    let data = {
      branch_id: branch_id,
      commodity_id: commodity_id,
      product_id: product_id,
      qty: qty,
    };

    this.prposervice.getBRAppMakerExcel(data).subscribe(
      (data) => {
        if (data.type == "application/json") {
          this.SpinnerService.hide();
          this.notification.showError("No Data Found");
        } else {
          let binaryData = [];
          binaryData.push(data);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = "BR Approver Maker Report" + date + ".xlsx";
          link.click();
        }
      },
      (error) => {
        this.toastr.error("An error occurred while generating the report");
      }
    );
  }

  // PRSearch() {
  //   let search = this.PRSummarySearch.value;
  //   let obj = {
  //     no: search.no,
  //     prheader_status: search.prheader_status,
  //     branch_id: search.branch_id.id
  //   }
  //   for (let i in obj) {
  //     if (obj[i] == null || obj[i] == "" || obj[i] == undefined ) {
  //       delete obj[i];
  //     }
  //   }
  //   this.SpinnerService.show();
  //   this.prposervice.getprSearch(obj)
  //     .subscribe(result => {
  //       this.SpinnerService.hide();
  //       console.log("identificationData", result)
  //       this.prSummaryList = result['data']
  //       return true
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }

  reset() {
    this.PRSummarySearch.controls["no"].reset("");
    this.PRSummarySearch.controls["prheader_status"].reset("");
    this.PRSummarySearch.controls["branch_id"].reset("");
    this.PRSummarySearch.controls["supplier_id"].reset("");
    this.PRSummarySearch.controls["mepno"].reset("");
    this.PRSummarySearch.controls["amount"].reset("");
    this.PRSummarySearch.controls["date"].reset("");
    this.PRSummarySearch.controls["commodity_id"].reset("");
    this.BRSummarySearch.controls["branch_id"].reset("");
    this.BRSummarySearch.controls["commodity_id"].reset("");
    this.BRSummarySearch.controls["product_id"].reset("");
    this.PRSummarySearch.get('product_type').reset("");
    this.getPRsummary("");
  }

  commentPopup(pdf_id, file_name) {
    if (pdf_id == "" || pdf_id == null || pdf_id == undefined) {
      this.notification.showInfo("No Files Found");
      return false;
    }
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token;
    let id = pdf_id;
    const headers = { Authorization: "Token " + token };
    this.showimagepopup = true;
    this.jpgUrls =
      this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
    console.log("img", this.jpgUrls);
  }

  gettranhistory(data) {
    let headerId = data?.id;
    console.log("headerId", headerId);
    this.SpinnerService.show();
    this.prposervice.getprtransummary(headerId).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getranhistory", datas);
        this.PrTranHistoryList = datas;
        this.totalcount = results["total_count"];
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  getBRtranhistory(data) {
    let headerId = data?.id;
    console.log("headerId", headerId);
    this.SpinnerService.show();
    this.prposervice.getbrtransummary(headerId).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getranhistory", datas);
        this.BrTranHistoryList = datas;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  pr_flag: any;
  Service: boolean = false;
  dataOnHeader(data) {
    this.PRheaderID_Data = data?.id;
    this.prmakid = data.id;
    this.pr_flag = data.flag;
    this.Service = this.pr_flag == "Service"
    if (data.dts == 0) {
      this.dtsdata = "NO";
    } else {
      this.dtsdata = "Yes";
    }
    this.typedata = data?.type;
    this.prnodata = data?.no;
    this.prdate = data?.date;
    this.Quotation_no = data?.quotation?.quot_no;
    this.prraised = data?.created_by?.full_name;
    this.prcommodity = data?.commodity_id?.name;
  }
  Quotation_no: any;
  justification: any;
  showEditor: boolean = true;
  justificationC: FormGroup;

  getprdetails(data, pageNumber = 1, pageSize = 10) {
    let headerId = data?.id;
    this.prdetailsbfileid = data?.prdetails_bfile_id; //7421

    this.SpinnerService.show();
    this.prposervice.getprdetails(headerId, pageNumber, pageSize).subscribe(
      (results) => {
         if(results?.code){
          this.SpinnerService.hide()
          this.notification.showError(results?.description)
          return false
        }
        let dataset = results["data"];
        let prccbs = results["prdetails"];
        // let ccbs_bfile_id=prccbs.ccbs_bfile_id
        this.SpinnerService.hide();
        this.prdetailsList = dataset;
        // this.showEditor = false;
        this.justificationC.get("justification").setValue(
          dataset[0]?.prheader?.justification || "No Justification Provided!"
        )
        // this.justificationC.setValue(dataset[0]?.prheader?.justification || "");
        // this.config.placeholder = dataset[0]?.prheader?.justification || "No Justification Provided!";
        // setTimeout(() => this.showEditor = true, 0);
        let prheader = dataset[0].prheader_id;
        this.type_data = prheader.type_id;
        console.log("getproduct", dataset);
        let datapagination = results["pagination"];
        this.totalcount = results.total_count;
        if (this.prdetailsList.length > 0) {
          this.has_nextdetail = datapagination.has_next;
          this.has_previousdetail = datapagination.has_previous;
          this.presentpageprdetail = datapagination.index;
          this.prView = true;
        }
        if (this.prdetailsList.length == 0) {
          this.prView = false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  assetArray: any = [];
  // assetArray = [
  //   {
  //     asset_id: "A12345",
  //     product: "Laptop",
  //     make: "Dell",
  //     model: "XPS 15",
  //     config: "16GB RAM, 512GB SSD",
  //     unit_price: 1500,
  //     podetail_id: 2343,
  //   },
  //   {
  //     asset_id: "A12346",
  //     product: "Monitor",
  //     make: "HP",
  //     model: "Z27",
  //     config: "27-inch, 4K",
  //     unit_price: 500,
  //     podetail_id: 2344,
  //   },
  //   {
  //     asset_id: "A12347",
  //     product: "Keyboard",
  //     make: "Logitech",
  //     model: "MX Keys",
  //     config: "Wireless",
  //     unit_price: 100,
  //     podetail_id: 2345,
  //   },
  //   {
  //     asset_id: "A12348",
  //     product: "Mouse",
  //     make: "Razer",
  //     model: "DeathAdder",
  //     config: "Wireless, RGB",
  //     unit_price: 70,
  //     podetail_id: 2346,
  //   },
  //   {
  //     asset_id: "A12349",
  //     product: "Smartphone",
  //     make: "Apple",
  //     model: "iPhone 14 Pro",
  //     config: "128GB, Space Gray",
  //     unit_price: 1200,
  //     podetail_id: 2347,
  //   },
  //   {
  //     asset_id: "A12350",
  //     product: "Tablet",
  //     make: "Samsung",
  //     model: "Galaxy Tab S8",
  //     config: "128GB, Wi-Fi",
  //     unit_price: 700,
  //     podetail_id: 2348,
  //   },
  //   {
  //     asset_id: "A12351",
  //     product: "Printer",
  //     make: "Canon",
  //     model: "PIXMA G5020",
  //     config: "Inkjet, Wireless",
  //     unit_price: 250,
  //     podetail_id: 2349,
  //   },
  // ];

  isReplacement: boolean = false;
  product_for: any;
  getbrdetails(data, pageNumber = 1, pageSize = 10) {
    let brheaderId = data.id;
    this.branchhid = data?.branch_id.fullname;
    this.commodityy = data?.commodity_id.name;
    this.productt = data?.product_id.name;
    this.productType = data?.product_type?.name;
    
    console.log("headerid", brheaderId);

    this.SpinnerService.show();
    this.prposervice.getbrdetails(brheaderId, pageNumber, pageSize).subscribe(
      (results) => {
        let dataset = results;
        this.uommm = dataset.uom;
        this.remakrs = dataset.remarks;
        console.log("dataset", dataset);
        this.SpinnerService.hide();
        this.branchhId = data.branch_id.name;
        this.ViewBR.patchValue({
          branch: this.branchhId,
          bs: dataset.bs,
          cc: dataset.cc,
          uom: dataset.uom,
          quantity: dataset.qty,
          remarks: dataset.remarks,
        });
        this.product_forreq = dataset.req_for_product_name,

        this.isReplacement = dataset?.asset_data?.pr_request == 2;
        if (dataset.asset_data.pr_request == 2) {
          this.isReplace = true;
          this.panelOpenState = false;
        // this.assetArray.push(...dataset?.asset_data?.asset);
        this.assetArray = dataset?.asset_data?.asset;
          // this.assetArray = dataset.asset;
        }
        if(dataset?.product_requestfor == 3){
          this.assetArrayy = dataset?.product_requestfor_asset_data?.asset;
          this.product_for = true;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  assetArrayy: any = [];
  databr(data) {

  }
  product_forreq: any;
  productType: any;
  getbrappdetails(data, pageNumber = 1, pageSize = 10) {
    let brheaderId = data.id;
    this.branchhid = data?.branch_id.fullname;
    this.commodityy = data?.commodity_id.name;
    this.productt = data?.product_id.name;
    this.productType = data?.product_type?.name;

    console.log("headerid", brheaderId);

    this.SpinnerService.show();
    this.prposervice.getbrdetails(brheaderId, pageNumber, pageSize).subscribe(
      (results) => {
        let dataset = results;
        this.uomm = dataset.uom;
        this.remakrs = dataset.remarks;
        console.log("dataset", dataset);
        this.SpinnerService.hide();
        this.branchhId = data.branch_id.name;
        this.ViewBRApp.patchValue({
          branch: this.branchhId,
          bs: dataset.bs,
          cc: dataset.cc,
          uom: dataset.uom,
          quantity: dataset.qty,
          remarks: dataset.remarks,
        });
        this.product_forreq = dataset.req_for_product_name,

        this.isReplacement = dataset?.asset_data?.pr_request == 2;
        if (dataset.asset_data.pr_request == 2) {
          this.isReplace = true;
          this.panelOpenState = false;
          // this.assetArray.push(...dataset?.asset_data?.asset);
          this.assetArray = dataset?.asset_data?.asset;
        }
        if(dataset?.product_requestfor == 3){
          this.assetArrayy = dataset?.product_requestfor_asset_data?.asset;

          // this.assetArrayy.push(...dataset?.product_requestfor_asset?.asset);
          this.product_for = true;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  databrapp(data) {
   
  }

  nextClickdetail() {
    if (this.has_nextdetail === true) {
      this.SpinnerService.show();
      this.prposervice
        .getprdetails(this.PRheaderID_Data, this.presentpageprdetail + 1, 10)
        .subscribe(
          (results) => {
            this.SpinnerService.hide();
            let dataset = results["data"];
            this.prdetailsList = dataset;
            console.log("getproduct", dataset);
            let datapagination = results["pagination"];
            if (this.prdetailsList.length > 0) {
              this.has_nextdetail = datapagination.has_next;
              this.has_previousdetail = datapagination.has_previous;
              this.presentpageprdetail = datapagination.index;
            }
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
    }
  }

  previousClickdetail() {
    if (this.has_previousdetail === true) {
      this.SpinnerService.show();
      this.prposervice
        .getprdetails(this.PRheaderID_Data, this.presentpageprdetail - 1, 10)
        .subscribe(
          (results) => {
            this.SpinnerService.hide();
            let dataset = results["data"];
            this.prdetailsList = dataset;
            console.log("getproduct", dataset);
            let datapagination = results["pagination"];
            if (this.prdetailsList.length > 0) {
              this.has_nextdetail = datapagination.has_next;
              this.has_previousdetail = datapagination.has_previous;
              this.presentpageprdetail = datapagination.index;
            }
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
    }
  }

  addpr() {
    let data = "";
    this.prsharedservice.prsummary.next(data);
    // this.router.navigate(['/prmakers'], { skipLocationChange: true })
    this.isPrmakerTab = false;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = true;
    this.isPrApproverScreenTab = false;
    this.isBrmakerTab = false;
    this.isBrapproverTab = false;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
  }

  addbr() {
    let data = "";
    this.prsharedservice.brsummary.next(data);
    this.shareService.prpoeditvaluekey.next("");
    this.isBrmakerTab = false;
    this.isBrapproverTab = false;
    this.isBrCreateScreenTab = true;
    this.isBrApproverScreenTab = false;
    this.isPrmakerTab = false;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = false;
  }

  PRCreateSubmit() {
    this.getPRsummary("");
    this.isPrmakerTab = true;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = false;
    this.isBrmakerTab = false;
    this.isBrapproverTab = false;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
  }

  PRCreateCancel() {
    this.isPrmakerTab = true;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = false;
    this.isBrmakerTab = false;
    this.isBrapproverTab = false;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
  }

  BRCreateSubmit() {
    this.getBRsummary(1);
    this.isBrmakerTab = true;
    this.isBrapproverTab = false;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
    this.isPrmakerTab = false;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = false;
  }

  BRCreateCancel() {
    this.isBrmakerTab = true;
    this.isBrapproverTab = false;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
    this.isPrmakerTab = false;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = false;
  }

  predit(data) {
    this.prsharedservice.prsummary.next(data);
    console.log("app", data);
    // this.router.navigate(['/prmakers'], { skipLocationChange: true })
    this.isPrmakerTab = false;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = true;
    this.isPrApproverScreenTab = false;
    this.isBrmakerTab = false;
    this.isBrapproverTab = false;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
    return data;
  }

  bredit(data, id) {
    this.id = data?.id;
    this.shareService.prpoeditvalue.next(data);
    this.shareService.prpoeditvaluekey.next(id);

    // this.router.navigate(["/prpo/branchrequest-maker"], {
    //   skipLocationChange: true,
    // });
    this.isBrCreateScreenTab = true;
    this.isBrmakerTab = false;
    this.isBrapproverTab = false;
    this.isBrApproverScreenTab = false;
    this.isPrmakerTab = false;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = false;
  }
  // prDRAFTedit(data) {

  //   this.prsharedservice.prsummary.next(data);
  //   console.log("app", data)
  //   // this.router.navigate(['/prmakers'], { skipLocationChange: true })
  //   this.isPrmakerTab = false
  //   this.isPrapproverTab = false
  //   this.isPrCreateScreenTab = true
  //   this.isPrApproverScreenTab = false
  //   return data
  // }

  fileDownloads(id, fileName) {
    if (id == "" || id == null || id == undefined) {
      this.notification.showInfo("No Files Found");
      return false;
    }
    this.SpinnerService.show();
    this.prposervice.fileDownloadpo(id).subscribe(
      (results) => {
        this.SpinnerService.hide();
        console.log("re", results);
        let binaryData = [];
        binaryData.push(results);
        let filevalue = fileName.split(".");
        if (filevalue[1] != "pdf" && filevalue[1] != "PDF") {
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download = fileName;
          link.click();
        } else {
          let downloadUrl = window.URL.createObjectURL(
            new Blob(binaryData, { type: results.type })
          );
          window.open(downloadUrl, "_blank");
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  only_numalpha(event) {
    var k;
    k = event.charCode;
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  PRPDf(data) {
    let id = data?.id;
    let name = data?.no;
    this.SpinnerService.show();
  
    this.prposervice.getpdfPR(id).subscribe(
      (datas: any) => {
        if (datas?.code) {
        this.SpinnerService.hide();
        this.notification.showError(datas?.description);
        return false;
      }

        this.SpinnerService.hide();
        let blob = new Blob([datas], { type: "application/pdf" });
        let downloadUrl = window.URL.createObjectURL(blob);
  
        // Open in new tab
        window.open(downloadUrl, "_blank");
  
        // Provide download option
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  
  

  PRPDDf(data) {
    let id = data?.id;
    let name = data?.no;
    this.SpinnerService.show();
    this.prposervice.getpdfPR(id).subscribe(
      (datas) => {
        if (datas?.code) {
        this.SpinnerService.hide();
        this.notification.showError(datas?.description);
        return false;
      }

        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(datas);
        let downloadUrl = window.URL.createObjectURL(
          new Blob(binaryData, { type: datas.type })
        );
        window.open(downloadUrl, "_blank");
        // let link = document.createElement('a');
        // link.href = downloadUrl;
        // link.download = name + ".pdf";
        // link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  getBRsummary(page: number = 1) {
    let search = this.BRSummarySearch.value;
    this.quantity = this.BRSummarySearch.value.qty;
    console.log("search==>", search);
    this.showAll = true;

    this.braanchid = search?.branch_id?.id;

    let obj: any = {};

    if (this.braanchid && this.BRSummarySearch.get("branch_id").value != "") {
      obj["branch_id"] = this.braanchid;
    } else {
      delete obj["branch_id"];
    }

    if (
      this.commodittyid &&
      this.BRSummarySearch.get("commodity_id").value != ""
    ) {
      obj["commodity_id"] = this.commodittyid;
    } else {
      delete obj["commodity_id"];
    }

    if (
      this.productidss &&
      this.BRSummarySearch.get("product_id").value != ""
    ) {
      obj["product_id"] = this.productidss;
    } else {
      delete obj["product_id"];
    }

    if (
      this.product_type &&
      this.BRSummarySearch.get("product_type").value != ""
    ) {
      obj["product_type"] = this.product_type;
    } else {
      delete obj["product_type"];
    }

    if (this.quantity && this.BRSummarySearch.get("qty").value != "") {
      obj["qty"] = this.quantity;
    } else {
      delete obj["qty"];
    }

    console.log("Search parameters:", obj);

    if (!page || isNaN(page)) {
      page = 1;
    }

    this.SpinnerService.show();
    this.prposervice.getbrSearch(obj, page).subscribe(
      (result) => {
        this.SpinnerService.hide();
        console.log("brsummary", result);
        this.is_admin = result.is_admin;
        this.shareService.is_admin.next(this.is_admin);

        this.brSummaryList = result["data"];
        this.brSummaryList.forEach((data) => {
          this.fileList.push(...data.prheader_file); // Push all pr_header_file items into fileList
        });
        console.log("brsummaryList", this.brSummaryList);
        let dataPagination = result["pagination"];
        this.totalcount = result.total_count;
        if (this.brSummaryList.length > 0) {
          this.has_nextapp = dataPagination.has_next;
          this.has_previousapp = dataPagination.has_previous;
          this.presentpageapp = dataPagination.index;
          this.brmakert = true;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  changePagenext() {
    if (this.has_nextapp === true) {
      this.getBRsummary(this.presentpageapp + 1);
    }
  }
  changePagepre() {
    if (this.has_previousapp === true) {
      this.getBRsummary(this.presentpageapp - 1);
    }
  }

  changePagenextt() {
    if (this.has_nextapp === true) {
      this.getBRAppsummary(this.presentpageapp + 1);
    }
  }

  changePagepree() {
    if (this.has_previousapp === true) {
      this.getBRAppsummary(this.presentpageapp - 1);
    }
  }

  changePage(page: number) {
    if (page < 1) return;
    this.getBRsummary(page);
  }
  resetbr() {
    this.BRSummarySearch.controls["branch_id"].reset();
    this.BRSummarySearch.controls["commodity_id"].reset();
    this.BRSummarySearch.controls["product_id"].reset();
    this.BRSummarySearch.controls["qty"].reset();
    this.BRSummarySearch.controls["product_type"].reset();

    this.getBRFirst(1);
  }

  getBRFirst(pageno: number = 1) {
    this.SpinnerService.show();
    this.prposervice.getbrFSearch(pageno).subscribe(
      (result) => {
        this.SpinnerService.hide();
        console.log("brsummary", result);
        this.is_admin = result.is_admin;
        this.shareService.is_admin.next(this.is_admin);
        this.brSummaryList = result["data"];
        this.totalcount = result.total_count;
        console.log("brsummaryList", this.brSummaryList);
        let dataPagination = result["pagination"];
        if (this.brSummaryList.length > 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  HeaderFilesPRdownload(data) {
    console.log("For Header Files", data);
    let filesdataValue = data.prheader_file;
    if (filesdataValue.length <= 0) {
      this.notification.showInfo("No Files Found");
      this.showHeaderimagepopup = false;
      return false;
    } else {
      this.fileListHeader = filesdataValue;
      this.showHeaderimagepopup = true;
    }
  }

  HeaderFilesBRdownload(data) {
    console.log("For Files", data);
    let filesdataValue = data.prheader_file;
    if (filesdataValue.length <= 0) {
      this.notification.showInfo("No Files Found");
      this.showHeaderbrimagepopup = false;
      return false;
    } else {
      this.fileList = filesdataValue;
      this.showHeaderbrimagepopup = true;
    }
  }

  GRNRaised(data) {
    console.log("For Files", data);
    let filesdataValue = data.file_data;
    if (filesdataValue.length <= 0) {
      this.notification.showInfo("No Files Found");
      this.showgrnraisedpopup = false;
      return false;
    } else {
      this.grnrList = filesdataValue;
      this.showgrnraisedpopup = true;
    }
  }

  fileDownloadGRN(name) {
    this.SpinnerService.show();
    this.prposervice.fileDownloadsGRN(name).subscribe(
      (results) => {
        console.log("results", results);
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = name;
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  fileDownloadheaderBR(id, fileName) {
    this.SpinnerService.show();
    this.prposervice.fileDownloadsBRHeader(id).subscribe(
      (results) => {
        console.log("results", results);
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  fileDownloadheader(id, fileName) {
    this.SpinnerService.show();
    this.prposervice.fileDownloadsPoHeader(id).subscribe(
      (results) => {
        console.log("re", results);
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  commentPopupHeaderFiles(pdf_id, file_name) {
    if (pdf_id == "" || pdf_id == null || pdf_id == undefined) {
      this.notification.showInfo("No Files Found");
      return false;
    }
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token;
    let id = pdf_id;
    const headers = { Authorization: "Token " + token };
    let stringValue = file_name.split(".");
    if (
      stringValue[1] === "png" ||
      stringValue[1] === "jpeg" ||
      stringValue[1] === "jpg"
    ) {
      this.showimageHeader = true;
      this.jpgUrls =
        this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      console.log("url", this.jpgUrls);
    } else {
      this.showimageHeader = false;
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////PR Approval

  approver(data) {
    this.prsharedservice.Prapprover.next(data);
    console.log("app", data);
    // this.router.navigate(['/PRApprover'], { skipLocationChange: true })
    this.isPrmakerTab = false;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = true;
    this.isBrmakerTab = false;
    this.isBrapproverTab = false;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
    this.mepvalue = data;

    this.prsharedservice.pcadata.next(this.mepvalue);
  }
  showWarn: boolean = false;
  async Alert(data) {
    console.log("Alert", data);
    // this.showWarn = data.some((e) => e.pr_request == 2)
    for (let a of data) {
      let slicedstr = a?.prheader_id?.prheader_status?.slice(0,7)
      if (a?.pr_request == 2 && slicedstr == "Pending") {
        const modalTrigger = document.getElementById("openModalButton");
        modalTrigger?.click();
      }
    }
  }

  PRApproveSubmit() {
    this.getPRAppsummary("");
    this.isPrmakerTab = false;
    this.isPrapproverTab = true;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = false;
    this.isBrmakerTab = false;
    this.isBrapproverTab = false;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
  }

  PRApproveCancel() {
    this.isPrmakerTab = false;
    this.isPrapproverTab = true;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = false;
    this.isBrmakerTab = false;
    this.isBrapproverTab = false;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
  }

  BRApproveSubmit() {
    this.getBRAppsummary(1);
    this.isBrmakerTab = false;
    this.isBrapproverTab = true;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
    this.isPrmakerTab = false;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = false;
  }

  BRApproveCancel() {
    this.isBrmakerTab = false;
    this.isPrapproverTab = true;
    this.isBrCreateScreenTab = false;
    this.isBrApproverScreenTab = false;
    this.isPrmakerTab = false;
    this.isPrapproverTab = false;
    this.isPrCreateScreenTab = false;
    this.isPrApproverScreenTab = false;
  }

  serviceCallPRAppSummary(search, pageno, pageSize) {
    this.prposervice.getprapproverSearch(search, pageno).subscribe(
      (result) => {
        if(result?.code){
          this.SpinnerService.hide()
          this.notification.showError(result?.description)
          return false
        }
        this.SpinnerService.hide();
        console.log("searchhh", result);
        let data = result["data"]; //7420
        this.filekey = data.prdetails_bfile_id; //7420
        console.log("this.filekey data next===>", this.filekey);

        this.approverlist = result["data"];
        let datapagination = result["pagination"];
        this.totalcount = result.total_count;
        if (this.approverlist.length > 0) {
          this.has_nextapp = datapagination.has_next;
          this.has_previousapp = datapagination.has_previous;
          this.presentpageapp = datapagination.index;
          this.isPRApproverExport = this.prsumm = true;
        }
        if (this.approverlist.length == 0) {
          this.isPRApproverExport = true;
          this.prsumm = false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  getPRAppsummary(hint) {
    let Prappsearch = this.PRApproverSearch.value;
    // this.PRApproverSearch.value.commodityname = this.PRApproverSearch.value.commodityname.id

        // 🔹 Remove commas from amount before sending


      if (Prappsearch.amount) {
    Prappsearch.amount = Prappsearch.amount.toString().replace(/,/g, '');
  }

    let obj = {
      no: this.PRApproverSearch?.value?.no,
      commodityname: this.PRApproverSearch?.value?.commodityname?.id,
      branch_id: this.PRApproverSearch?.value?.branch_id?.id,
      supplier_id: this.PRApproverSearch?.value?.supplier_id?.id,
      prheader_status: this.PRApproverSearch?.value?.prheader_status,
      amount: this.PRApproverSearch?.value?.amount,
      product_type: this.PRApproverSearch?.value?.product_type?.id ?? '',
      product_id: this.PRApproverSearch?.value?.product_id?.id ,
      date: this.datepipe.transform(
        this.PRApproverSearch?.value?.date,
        "yyyy-MM-dd"
      ),
    };

  
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        delete obj[i];
      }
    }
    this.SpinnerService.show();

    if (hint == "next") {
      this.serviceCallPRAppSummary(obj, this.presentpageapp + 1, 10);
    } else if (hint == "previous") {
      this.serviceCallPRAppSummary(obj, this.presentpageapp - 1, 10);
    } else {
      this.serviceCallPRAppSummary(obj, 1, 10);
    }
  }

  getBRAppsummary(page: number = 1) {
    let search = this.BRApproverSearch.value;
    this.quantity = this.BRApproverSearch.value.qty;
    console.log("search===>", search);
    this.showApp = true;
    //   let obj
    //   obj = {
    //     branch_id : search?.branch_id?.id,
    //     commodity_id: this.commodittyid,
    //     product_id: this.productidss,
    //     qty:this.quantity
    //   }

    //   for (let i in obj) {
    //     if (obj[i] == null || obj[i] == "" || obj[i] == undefined ) {
    //       delete obj[i];
    //   }
    // }

    // console.log(obj)
    // console.log(obj.branch_id)
    // console.log(obj.commodity_id)
    // console.log(obj.product_id)
    // console.log(obj.qty)

    this.braanchid = search?.branch_id?.id;

    let obj: any = {};

    if (this.braanchid && this.BRApproverSearch.get("branch_id").value != "") {
      obj["branch_id"] = this.braanchid;
    } else {
      delete obj["branch_id"];
    }

    if (
      this.commodittyid &&
      this.BRApproverSearch.get("commodity_id").value != ""
    ) {
      obj["commodity_id"] = this.commodittyid;
    } else {
      delete obj["commodity_id"];
    }

    if (
      this.productidss &&
      this.BRApproverSearch.get("product_id").value != ""
    ) {
      obj["product_id"] = this.productidss;
    } else {
      delete obj["product_id"];
    }


    if (
      this.product_type &&
      this.BRApproverSearch.get("product_type").value != ""
    ) {
      obj["product_type"] = this.product_type;
    } else {
      delete obj["product_type"];
    }


    if (this.quantity && this.BRApproverSearch.get("qty").value != "") {
      obj["qty"] = this.quantity;
    } else {
      delete obj["qty"];
    }

    this.SpinnerService.show();
    this.prposervice.getapSearch(obj, page).subscribe(
      (result) => {
        this.SpinnerService.hide();
        console.log("brappsummary", result);
        this.is_admin = result.is_admin;
        this.shareService.is_admin.next(this.is_admin);

        this.brAppSummaryList = result["data"];
        console.log("brappsummaryList", this.brAppSummaryList);
        let dataPagination = result["pagination"];
        this.totalcount = result.total_count;
        if (this.brAppSummaryList.length > 0) {
          this.has_nextapp = dataPagination.has_next;
          this.has_previousapp = dataPagination.has_previous;
          this.presentpageapp = dataPagination.index;
          this.brappt = true;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  resetap() {
    this.BRApproverSearch.controls["branch_id"].reset();
    this.BRApproverSearch.controls["commodity_id"].reset();
    this.BRApproverSearch.controls["product_id"].reset();
    this.BRApproverSearch.controls["qty"].reset();
    this.BRApproverSearch.controls["product_type"].reset();

    this.getBRAppFirst(1);
  }

  getBRAppFirst(pageno: number = 1) {
    this.SpinnerService.show();
    this.prposervice.getbrAPSearch(pageno).subscribe(
      (result) => {
        this.SpinnerService.hide();
        console.log("brappsummary", result);
        this.is_admin = result.is_admin;
        this.shareService.is_admin.next(this.is_admin);

        this.brAppSummaryList = result["data"];
         this.totalcount = result.total_count;
        console.log("brappsummaryList", this.brAppSummaryList);
        let dataPagination = result["pagination"];
        if (this.brAppSummaryList.length > 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  resetapp() {
    this.PRApproverSearch.controls["no"].reset("");
    this.PRApproverSearch.controls["commodityname"].reset("");
    this.PRApproverSearch.controls["branch_id"].reset("");
    this.PRApproverSearch.controls["supplier_id"].reset("");
    this.PRApproverSearch.controls["prheader_status"].reset("");
    this.PRApproverSearch.controls["mepno"].reset("");
    this.PRApproverSearch.controls["amount"].reset("");
    this.PRApproverSearch.controls["date"].reset("");
    this.PRApproverSearch.controls["product_type"].reset("");
    this.getPRAppsummary("");
    // this.PRApproverSearch.reset();
  }

  gettranhistoryapp(data) {
    let headerId = data.id;
    console.log("headerId", headerId);
    this.SpinnerService.show();
    this.prposervice.getprtransummary(headerId).subscribe(
      (results: any) => {
        if(results?.code){
          this.SpinnerService.hide()
          this.notification.showError(results?.description)
          return false
        }
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getranhistory", datas);
        this.PrTranHistoryListapp = datas;
        this.totalcount = results["total_count"];
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  // getbrsummary() {
  //   this.SpinnerService.show();
  //   this.prposervice.getbrsummarydata()
  //     .subscribe((results: any[]) => {
  //       this.SpinnerService.hide();
  //       let datas = results["data"];
  //       console.log("getranhistory", datas);
  //       this.brsummarylist = datas;
  //       console.log("<><><><><><",this.brsummarylist)
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }

  only_char(event) {
    var a;
    a = event.which;
    if ((a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }

  HeaderFilesPRdownloadapp(data) {
    console.log("For Header Files", data);

    let filesdataValue = data.prheader_file;
    if (filesdataValue.length <= 0) {
      this.notification.showInfo("No Files Found");
    } else {
      this.fileListHeader = filesdataValue;
      this.showHeaderimagepopupapp = true;
    }
  }

  fileDownloadheaderapp(id, fileName) {
    this.SpinnerService.show();
    this.prposervice.fileDownloadsPoHeader(id).subscribe(
      (results) => {
        this.SpinnerService.hide();
        console.log("re", results);
        let binaryData = [];
        binaryData.push(results);
        let filevalue = fileName.split(".");
        if (filevalue[1] != "pdf" && filevalue[1] != "PDF") {
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download = fileName;
          link.click();
        } else {
          let downloadUrl = window.URL.createObjectURL(
            new Blob(binaryData, { type: results.type })
          );
          window.open(downloadUrl, "_blank");
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  commentPopupHeaderFilesapp(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token;
    let id = pdf_id;
    const headers = { Authorization: "Token " + token };
    let stringValue = file_name.split(".");
    if (
      stringValue[1] === "png" ||
      stringValue[1] === "jpeg" ||
      stringValue[1] === "jpg"
    ) {
      this.showimageHeaderapp = true;
      this.jpgUrls =
        this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      console.log("url", this.jpgUrls);
    } else {
      this.showimageHeaderapp = false;
    }
  }

  public displayFncommodity(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }
  getCommodityFK() {
    this.SpinnerService.show();
    this.prposervice.getcommoditydd().subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.commodityList = datas;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  currentpagecom = 1;
  has_nextcom = true;
  has_previouscom = true;

  autocompletecommodityScroll() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.autocompleteTrigger &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matcommodityAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.prposervice
                  .getcommodityFKdd(
                    this.commodityInput.nativeElement.value,
                    this.currentpagecom + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.commodityList = this.commodityList.concat(datas);
                      if (this.commodityList.length >= 0) {
                        this.has_nextcom = datapagination.has_next;
                        this.has_previouscom = datapagination.has_previous;
                        this.currentpagecom = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  // public displayFnbranch(branch?: branchlistss): any | undefined {
  //   return branch ? branch.code + "-" + branch.name : undefined;
  // }
  // <!-- //BUG ID:7807 -->

  public displayFnbranch(branch?: any): string {
    if (branch) {
      if (branch.value === -1) {
        return "ALL";
      } else {
        return `${branch.code}-${branch.name}`;
      }
    }
    return "";
  }

  getprbranch() {
    this.getbranchFK();

    this.PRSummarySearch.get("branch_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getbranchFK(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.branchList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getprappbranch() {
    this.getbranchFK();

    this.PRApproverSearch.get("branch_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getbranchFK(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.branchList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }
  mep_name: any;
  pcaId(mep) {
    this.mep_name = mep.name;
  }
  getbrbranch() {
    this.getbranchFK();

    this.BRSummarySearch.get("branch_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getbranchFK(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.branchList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getbrappbranch() {
    this.getbranchFK();

    this.BRApproverSearch.get("branch_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getbranchFK(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.branchList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getbranchFK() {
    this.prposervice.getbranchdd().subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  currentpagebranch = 1;
  has_nextbranch = true;
  has_previousbranch = true;
  autocompletebranchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.autocompleteTrigger &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matbranchAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbranch === true) {
                this.prposervice
                  .getbranchFK(
                    this.branchInput.nativeElement.value,
                    this.currentpagebranch + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.branchList = this.branchList.concat(datas);
                      this.totalcount = results["total_count"];
                      if (this.branchList.length >= 0) {
                        this.has_nextbranch = datapagination.has_next;
                        this.has_previousbranch = datapagination.has_previous;
                        this.currentpagebranch = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  /////////////////////////////////////////////////////////////////

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getprstatus() {
    this.prposervice.getPRStatus().subscribe((result) => {
      this.statuslist = result["data"];
      console.log("statuslist", this.statuslist);
    });
  }
  tabchange_reset() {
    this.PRSummarySearch.reset("");
    this.PRApproverSearch.reset("");
  }

  //PR DRAFT commodity field BUG ID:4529

  selectedValue: any;

  autocompletecomScroll() {
    this.currentpagecomm = 1;
    this.has_nextcomm = true;
    this.has_previouscomm = true;
    setTimeout(() => {
      if (
        this.matcommodityyAutocomplete &&
        this.autocompleteTrigger &&
        this.matcommodityyAutocomplete.panel
      ) {
        fromEvent(this.matcommodityyAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) =>
                this.matcommodityyAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matcommodityyAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matcommodityyAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matcommodityyAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcomm === true) {
                this.prposervice
                  .getcommodityFKdd(
                    this.comInput.nativeElement.value,
                    this.currentpagecomm + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.commodityList = this.commodityList.concat(datas);
                      // console.log("emp", datas)
                      if (this.commodityList.length >= 0) {
                        this.has_nextcomm = datapagination.has_next;
                        this.has_previouscomm = datapagination.has_previous;
                        this.currentpagecomm = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  ////////////////////////////////////////////////////

  public displayFncom(com?: comlistss): string | undefined {
    // console.log('id', com.id);
    // console.log('name', com.name);
    return com ? com.name : undefined;
  }

  getprcommodity() {
    this.getcommodityFK();

    this.PRSummarySearch.get("commodity_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getcommodityFKdd(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.commodityList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getbrcommodity() {
    this.getcommodityFK();

    this.BRSummarySearch.get("commodity_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getcommodityFKdd(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.commodityList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getbrappcommodity() {
    this.getcommodityFK();

    this.BRApproverSearch.get("commodity_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.prposervice.getcommodityFKdd(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.commodityList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getcommodityFK() {
    this.prposervice.getcommodityFKkey().subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.commodityList = datas;
        console.log("commodityList", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  //PR DRAFT SUMMARY BUG UD:6671

  //   getPRstatus(e){

  //     this.data_final = {
  //       "branch_id": this.PRSummarySearch.value.branch_id,
  //       "commodity_id": this.PRSummarySearch.value.commodity_id,
  //       "supplier_id":this.PRSummarySearch.value.supplier_id,
  //       "date":this.PRSummarySearch.value.date,
  //       "amount":this.PRSummarySearch.value.amount,
  //       "mepno":this.PRSummarySearch.value.mepno,
  //       "created_by":this.prraised
  //     }

  //   console.log("e==>",e)
  //   if(e == 'DRAFT' ){
  //     this.prposervice.getPRdraftsummary(this.data_final)
  //     .subscribe(result=>{
  //       this.prdraftsummary = result['data']
  //       console.log("prdraftsummary==>",this.prdraftsummary)
  //     })

  //   }
  //  }
  //BUG ID:7421
  summaryexceldwn() {
    this.SpinnerService.show();
    this.prposervice.prsummaryexldwn(this.prmakid).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Non Catelog PR Excel.xlsx";
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  //BUG ID:7089
  // getpo(prid,pageNumber=1,pageSize = 10){

  //   this.SpinnerService.show();
  //   this.prposervice.prsummarygerpo(prid,pageNumber,pageSize)
  //     .subscribe((results) => {
  //       this.SpinnerService.hide();
  //       this.PoList = results['data']
  //       let datapagination=results['pagination']
  //       if(this.PoList.length>0){
  //         this.has_next=datapagination.has_next;
  //         this.has_previous=datapagination.has_previous;
  //         this.presentpage=datapagination.index
  //       }

  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }
  // nextClick() {
  //     if (this.has_next === true) {
  //       this.getpo(this.presentpage + 1, 10)
  //     }
  //   }

  //   previousClick() {
  //     if (this.has_previous === true) {
  //       this.getpo(this.presentpage - 1, 10)
  //     }
  //   }
  getpo(pr) {
    this.prno = pr.no;
    this.id = pr.id;
    this.SpinnerService.show();
    this.prposervice.prsummarygerpo(this.id).subscribe(
      (results) => {
        this.SpinnerService.hide();
        this.PoList = results["data"];
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  download() {
    this.SpinnerService.show();
    this.prposervice.download(this.id).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Po Raised.xlsx";
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  delivaryDetailsPatch(data, index) {
    console.log("Delivary details patching data", data);
    // this.prccbsDetailsList = data
    // this.prappdelid=this.prccbsDetailsList[index].prdetails   //7420
    this.ccbs_bfile_id = data.ccbs_bfile_id;
    this.prappdelid = data.id;
    // if( (this.deliverydetailsList.length == 0) || (this.deliverydetailsList.length == undefined) ){
    //   this.delivaryDetailsPatchbulk(1)
    // }
  }

  hasnext = true;
  hasprevious = true;
  currentpg: number = 1;
  presentpg: number = 1;
  pgSize = 10;
  delivaryDetailsPatchbulk(pageNumber, i) {
    let id = this.prapproveId;
    this.SpinnerService.show();
    this.prposervice
      .getdeliverydetailspatch(this.prappdelid, pageNumber)
      .subscribe(
        (results) => {
          let datas = results;
          this.SpinnerService.hide();
          this.deliverydetailsList = results["data"];
          this.prdetailsList[i].cbs = results["data"];
          this.prdetailsList[i].totalcountt = results.total_count;
          let datapagination = results["pagination"];
          if (this.deliverydetailsList.length > 0) {
            this.hasnext = datapagination.has_next;
            this.hasprevious = datapagination.has_previous;
            this.presentpg = datapagination.index;
            this.isdelivery[i] = true;
          }
          if (this.deliverydetailsList.length == 0) {
            this.isdelivery[i] = false;
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    // prdetails.expanded = true;
  }
  salesweightnextClick(i) {
    if (this.hasnext === true) {
      this.delivaryDetailsPatchbulk(this.presentpg + 1, i);
    }
  }
  salesweightpreviousClick(i) {
    if (this.hasprevious === true) {
      this.delivaryDetailsPatchbulk(this.presentpg - 1, i);
    }
  }

  // commodittyid: any
  // comid(com){
  //   this.commodittyid = com.id
  //   console.log("",this.commodittyid)
  // }

  getpr(pr, pgnumner = 1) {
    this.prno = pr.no;
    this.id = pr.id;
    this.SpinnerService.show();
    this.prposervice.posummarygerpo(this.id).subscribe(
      (results) => {
        this.SpinnerService.hide();
        this.grnList = results["data"];
        // if (this.grnList.length > 0) {
        //   this.hasnextgrn = datapagination.has_next;
        //   this.haspreviousgrn = datapagination.has_previous;
        //   this.presentpggrn = datapagination.index;

        // }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  grnpreviousClick() {
    if (this.haspreviousgrn === true) {
      this.getpr(this.prno, this.presentpggrn - 1);
    }
  }
  grnnextClick() {
    if (this.hasnextgrn === true) {
      this.getpr(this.prno, this.presentpggrn + 1);
    }
  }
  toggleAndGetData(po: any, param: number): void {
    if (po) {
      po.expanded = !po.expanded;
      this.getpr(po, param);
    }
  }
  getprpo(pr) {
    this.prno = pr.no;
    this.id = pr.id;
    this.SpinnerService.show();
    this.prposervice.posummarygerpo(this.id).subscribe(
      (results) => {
        this.SpinnerService.hide();
        this.PrList = results["data"];
        this.PrList.forEach((data) => {
          this.grnrList.push(...data.file_data);
        });
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  ///////////////////////////////////////////////////////////////////////////

  public displayFnproduct(prod?: productLists): string | undefined {
    return prod ? prod.name : undefined;
  }

  getproductFK() {
    this.SpinnerService.show();
    let commodity = this.commodittyid;
    let type = this.BRSummarySearch.value.type;
    let value = this.productInput.nativeElement.value;
    if (commodity == undefined) {
      this.notification.showError("Kindly Choose Commodity");
      this.SpinnerService.hide();
      return false;
    } else {
      this.prposervice
        .getproductDependencyBR(this.commodittyid, type, value, 1)
        .subscribe(
          (results: any[]) => {
            this.SpinnerService.hide();
            let data = results;
            let datas = results["data"];
            //BUG ID/:8452
            this.currentpageprod = 1;
            this.has_nextprod = true;
            this.has_previousprod = true;
            //

            console.log("datas.length==>", datas.length);
            if (datas.length == 0) {
              this.notification.showInfo("No Records Found");
              return false;
            }
            //BUG ID:7538
            //  if (data['description'] ===  "The Product Doesn't Have a Valid Catalog") {
            //   this.SpinnerService.hide()
            //   this.notification.showError("The Product Doesn't Have a Valid Catalog")
            // }
            ("The Product Doesn't Have a Valid Catalog");
            this.productList = datas;
            console.log("product", datas);
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
    }
  }
  currentpageprod = 1;
  has_nextprod = true;
  has_previousprod = true;
  autocompleteproductScroll() {
    setTimeout(() => {
      if (
        this.matproductAutocomplete &&
        this.autocompleteTrigger &&
        this.matproductAutocomplete.panel
      ) {
        fromEvent(this.matproductAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matproductAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matproductAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matproductAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matproductAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextprod === true) {
                if (this.BRSummarySearch.value.supplier == "") {
                  this.prposervice
                    .getproductDependencyBR(
                      this.BRSummarySearch.value.type,
                      this.BRSummarySearch.value.commodity.id,
                      this.productInput.nativeElement.value,
                      this.currentpageprod + 1
                    )
                    .subscribe(
                      (results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.productList = this.productList.concat(datas);
                        if (this.productList.length >= 0) {
                          this.has_nextprod = datapagination.has_next;
                          this.has_previousprod = datapagination.has_previous;
                          this.currentpageprod = datapagination.index;
                        }
                        if (this.productList.length == 0) {
                          this.notification.showInfo("No Product Specified!");
                          this.SpinnerService.hide();
                        }
                      },
                      (error) => {
                        this.errorHandler.handleError(error);
                        this.SpinnerService.hide();
                      }
                    );
                } else {
                  //6671 this.prposervice.getproductDependencyFKdd(this.prForm.value.commodity.id, this.prForm.value.productCategory.id, this.prForm.value.productType.id, this.prForm.value.dts, this.productInput.nativeElement.value, this.currentpageprod + 1)
                  this.prposervice
                    .getproductDependencyBR(
                      this.BRSummarySearch.value.type,
                      this.BRSummarySearch.value.commodity.id,
                      this.productInput.nativeElement.value,
                      this.currentpageprod + 1
                    )

                    .subscribe(
                      (results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.productList = this.productList.concat(datas);
                        if (this.productList.length >= 0) {
                          this.has_nextprod = datapagination.has_next;
                          this.has_previousprod = datapagination.has_previous;
                          this.currentpageprod = datapagination.index;
                        }
                        if (this.productList.length == 0) {
                          this.notification.showInfo("No Product Specified!");
                          this.SpinnerService.hide();
                        }
                      },
                      (error) => {
                        this.errorHandler.handleError(error);
                        this.SpinnerService.hide();
                      }
                    );
                }
              }
            }
          });
      }
    });
  }

  ///////////////////////////////////////////////////////////////////////////////

  approveid(data) {
    this.ids = data?.id;
  }

  approve() {
    this.remark = this.ApproveBR?.value?.remarks;
    let obj;
    obj = {
      id: this.ids,
      prheader_status: this.APPROVED,
      remarks: this.remark,
    };
    console.log("head", obj.id);
    console.log("prheadid", obj.prheader_status);
    console.log("remarks", obj.remarks);
    this.prposervice.getapprove(obj).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        this.finalstatus = results;
        if (this.finalstatus.status === "success") {
          this.closebutton.nativeElement.click();
          this.ApproveBR.controls["remarks"].reset("");
          this.toastr.success("Approved");
          this.getBRAppFirst(1);
        } else {
          this.toastr.error(this.finalstatus.description);
          this.getBRAppFirst(1);

        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  returnid(data) {
    this.idss = data?.id;
  }

  return() {
    this.remarkk = this.ReturnBR.value.remarks;
    let obj;
    obj = {
      id: this.idss,
      prheader_status: this.RETURNED,
      remarks: this.remarkk,
    };
    console.log("head", obj.id);
    console.log("prheadid", obj.prheader_status);
    console.log("remarks", obj.remarks);
    this.prposervice.getreturn(obj).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        this.finalstatus = results;
        if (this.finalstatus.status === "success") {
          this.closerdbutton.nativeElement.click();
          this.ReturnBR.controls["remarks"].reset("");
          this.toastr.success("Returned");
          this.getBRAppFirst();
        } else {
          this.toastr.error(this.finalstatus.description);
          this.getBRAppFirst();
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  rejectid(data) {
    this.idds = data?.id;
  }

  reject() {
    this.remarrk = this.RejectBR.value.remarks;
    let obj;
    obj = {
      id: this.idds,
      prheader_status: this.REJECTED,
      remarks: this.remarrk,
    };
    console.log("head", obj.id);
    console.log("prheadid", obj.prheader_status);
    console.log("remarks", obj.remarks);
    this.prposervice.getreject(obj).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        this.finalstatus = results;
        if (this.finalstatus.status === "success") {
          this.closertbutton.nativeElement.click();
          this.RejectBR.controls["remarks"].reset("");
          this.toastr.success("Rejected");
          this.getBRAppFirst();
        } else {
          this.toastr.error(this.finalstatus.description);
          this.getBRAppFirst();
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  getSpecificationKeys(specification: any): string[] {
    return specification ? Object.keys(specification) : [];
  }
  assetArrayPR: any = [];

  assetDetailss(arr, id) {
   this.assetArrayPR = arr;
    console.log("assetArrayPR", this.assetArrayPR);
    const prdetails = this.prdetailsList.find(item => item.id === id);
    if (prdetails) {
      prdetails.assetArrayPR = arr;
      this.toggleAssetDetails(prdetails);
    }
    if (arr.length == 0) {
      this.notification.showInfo("No Data Found!");
    }
  }
  assetDetails(id) {
    this.SpinnerService.show();
    this.prposervice.getAssetDetails(id).subscribe((res) => {
      this.SpinnerService.hide();
      const assetArray = res["asset"];
      const prdetails = this.prdetailsList.find(item => item.id === id);
      if (prdetails) {
        prdetails.assetArrayPR = assetArray;
        this.toggleAssetDetails(prdetails);
      }
      if (res['asset'].length == 0) {
        this.notification.showInfo("No Data Found!");
      }
    });
  }
  assetDetailsnew(id) {
    this.SpinnerService.show();
    this.prposervice.getAssetDetailsreplace(id).subscribe((res) => {
      this.SpinnerService.hide();
      const assetArray = res["asset"];
      const prdetails = this.prdetailsList.find(item => item.id === id);
      if (prdetails) {
        prdetails.assetArrayPR = assetArray;
        this.toggleAssetDetails(prdetails);
      }
      if (res['asset'].length == 0) {
        this.notification.showInfo("No Data Found!");
      }
    });
  }
  toggleAssetDetails(prdetails: any): void {
    prdetails.showAssetDetails = !prdetails.showAssetDetails;
  }
    AmountCalculation(event,section,values){
     let value = event.target.value.replace(/,/g, ''); // remove commas
  // Allow numbers with optional dot and up to 2 decimals
  if (!/^\d*\.?\d{0,2}$/.test(value) && value !== '.') {
    value = value.slice(0, -1);
  }
  // Don't format if user has only typed a dot
  if (value !== '.') {
    const parts = value.split('.');
    let integerPart = parts[0] || '';
    // ✅ Keep dot and decimals correctly
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    // ✅ Indian numbering format (e.g. 1,00,000)
    // integerPart = integerPart.replace(/\B(?=(\d{2})+(?!\d)(?<=\d{3,}))/g, ',');
    integerPart = integerPart.replace(/\B(?=(\d{3})(\d{2})*$)/g, ',');
    value = integerPart + decimalPart;
  }
   section.get(values)?.setValue(value, { emitEvent: false });
  }
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ["add", ["addRowDown", "addRowUp", "addColLeft", "addColRight"]],
        ["delete", ["deleteRow", "deleteCol", "deleteTable"]],
        ["style", ["tableHeader", "tableBorderStyle", "tableBorderColor"]],
      ],
      link: [["link", ["linkDialogShow", "unlink"]]],
      air: [
        [
          "font",
          [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "superscript",
            "subscript",
            "clear",
          ],
        ],
      ],
    },
    height: "200px",
    toolbar: [
      ["misc", ["codeview", "undo", "redo", "codeBlock"]],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear",
        ],
      ],
      ["fontsize", ["fontname", "fontsize", "color"]],
      ["para", ["style0", "ul", "ol", "paragraph", "height"]],
      ["insert", ["picture", "link", "video", "hr", "customTable"]],
      [
        "table",
        ["addRow", "addColumn", "deleteRow", "deleteColumn", "deleteTable"],
      ],
    ],
    buttons: {
      customTable: function (context) {
        const ui = ($ as any).summernote.ui;
        return ui
          .button({
            contents: '<i class="note-icon-table"/>Table',
            tooltip: "Insert a 3x3 Table",
            click: function () {
              context.invoke("editor.focus"); // Ensure the editor is focused

              const editor = context.layoutInfo.editable[0];
              if (!editor) {
                console.error("Editor context is undefined");
                return;
              }

              const table = document.createElement("table");
              table.style.borderCollapse = "collapse";
              table.style.width = "100%";

              for (let i = 0; i < 3; i++) {
                const row = table.insertRow();
                for (let j = 0; j < 3; j++) {
                  const cell = row.insertCell();
                  cell.style.border = "1px solid black";
                  cell.style.padding = "5px 3px";
                  cell.style.height = "30px";
                  cell.style.width = "270px";
                  cell.style.boxSizing = "border-box";
                  cell.innerText = " ";
                }
              }

              const range = window.getSelection()?.getRangeAt(0);
              if (!range) {
                console.error(
                  "Range is undefined. Ensure the editor is focused."
                );
                return;
              }

              range.deleteContents();
              range.insertNode(table);
              range.collapse(false);
            },
          })
          .render();
      },
    },
    callbacks: {
      onInit: function() {
        // Adding default border style and basic table styles when creating a table
        const editor = document.querySelector('.note-editable');
        if (editor) {
          editor.addEventListener('input', function() {
            // Convert HTMLCollection to an array using Array.from
            const tables = Array.from(editor.getElementsByTagName('table'));
            tables.forEach((table) => {
              // Apply table-wide styles
              const htmlTable = table as HTMLTableElement;
              htmlTable.style.borderCollapse = 'collapse';
              htmlTable.style.width = '100%';
              htmlTable.style.textAlign = 'left';
  
              // Apply styles to each cell (th and td) within the table
              const cells = table.querySelectorAll('th, td');
              cells.forEach((cell) => {
                const htmlCell = cell as HTMLTableCellElement;
                htmlCell.style.border = '1px solid black';
                htmlCell.style.padding = '5px 3px';
                htmlCell.style.boxSizing = 'border-box';
              });
            });
          });
        }
      },
    },
  };

  editorDisabled = true;

  // get sanitizedHtml() {
  //   return this.sanitizer.bypassSecurityTrustHtml(this.PARmakerForm.get('html').value);
  // }

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

  summernoteInitt(event) {
    // console.log(event);
  }
  summernoteInit(event: any, index: number) {
    if (event && event.editor) {
      event.editor.setData(this.prdetailsList[index].specification);
    }
  }
  getProductTypes() {
    this.isLoading=true
    this.reportService.getpdtclasstype('',1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading=false
        let datas = results['data'];
        this.prdTypes = datas;
        let datapagination = results["pagination"];
                 
                        this.producttype_next = datapagination.has_next;
                        this.producttype_pre = datapagination.has_previous;
                        this.producttype_crtpage = datapagination.index;
                      
      }
    });
  }
  input_getProductTypes() {
    this.isLoading=true
    this.reportService.getpdtclasstype(this.productInput.nativeElement.value,1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading=false
        let datas = results['data'];
        this.prdTypes = datas;
        let datapagination = results["pagination"];
                 
                     
                        this.producttype_next = datapagination.has_next;
                        this.producttype_pre = datapagination.has_previous;
                        this.producttype_crtpage = datapagination.index;
                  
      }
    });
  }
 protype_autocompleteassetScroll() {
    setTimeout(() => {
      if (
        this.productAutocomplete &&
        this.autocompleteTrigger &&
        this.productAutocomplete.panel
      ) {
        fromEvent(this.productAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.productAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.productAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.productAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.productAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.producttype_next === true) {
                this.reportService
                  .getpdtclasstype(this.productInput.nativeElement.value,this.producttype_crtpage +1 )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.prdTypes = this.prdTypes.concat(datas);
                    
                        this.producttype_next = datapagination.has_next;
                        this.producttype_pre = datapagination.has_previous;
                        this.producttype_crtpage = datapagination.index;
                  
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  
}
