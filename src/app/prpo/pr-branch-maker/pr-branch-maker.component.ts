import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injectable,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { fromEvent, Observable, of, Subscription } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { environment } from "src/environments/environment";
// import { ErrorHandlingServiceService } from '../service/error-handling-service.service';
import { ErrorHandlingServiceService } from "../error-handling-service.service";
import { NotificationService } from "../notification.service";
import { PRPOshareService } from "../prposhare.service";
// import { NotificationService } from '../../app/service/notification.service';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter,
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import * as _moment from "moment";
import { PRPOSERVICEService } from "../prposervice.service";
import { default as _rollupMoment, Moment } from "moment";
import { DatePipe, formatDate } from "@angular/common";
// import { SharedService } from '../service/shared.service';
import { SharedService } from "../../service/shared.service";
import { NgxSpinnerService } from "ngx-spinner";
import { data } from "jquery";
// import { DataService } from '../service/data.service';
import { Router } from "@angular/router";
import { ReturnComponent } from "src/app/rmu/return/return.component";
import { isBoolean } from "util";
import { ToastrService } from "ngx-toastr";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { A, R } from "@angular/cdk/keycodes";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { ReportserviceService } from "src/app/reports/reportservice.service";

export interface commoditylistss {
  id: any;
  name: any;
}
export interface productLists {
  no: any;
  name: any;
  id: any;
  code: any;
}
export interface itemsLists {
  make: {
    no: string;
    name: string;
    id: number;
  };
}

export interface itemList {
  id: any;
  name: any;
}

export interface modelsList {
  id: any;
  name: any;
}

export interface cclistss {
  id: string;
  costcentre_id: any;
  name: string;
}
export interface Emplistss {
  id: string;
  full_name: string;
}
export interface supplierlistss {
  id: string;
  name: string;
  branch_data: any;
}
export interface branchlistss {
  id: any;
  name: any;
  code: any;
  fullname: any;
}
export interface specsLists {
  no: string;
  configuration: string;
  id: number;
}
export interface specsList {
  // no: string;
  specification: any;
  id: number;
}
export interface bslistss {
  id: string;
  name: string;
  bs: any;
}
export interface modelsLists {
  model: {
    no: string;
    name: string;
    id: number;
  };
}
@Component({
  selector: "app-pr-branch-maker",
  templateUrl: "./pr-branch-maker.component.html",
  styleUrls: ["./pr-branch-maker.component.scss"],
})
export class PrBranchMakerComponent implements OnInit {
  questionForm: any;
  displayData: any = [];
  vendorSearchForm: FormGroup;
  Lists: any = [];
  Statuslist = [
    { id: 1, name: "Draft" },
    { id: 2, name: "New" },
  ];
  makepricelistenable: boolean = false;
  //   Lists = [
  //     {
  //         "id": 1,
  //         "text": "Goods & Service"
  //     },
  //     {
  //         "id": 2,
  //         "text": "Goods"
  //     },
  //     {
  //         "id": 3,
  //         "text": "Service"
  //     },
  //     {
  //         "id": 4,
  //         "text": "Hardware"
  //     },
  //     {
  //         "id": 5,
  //         "text": "Software"
  //     },
  //     {
  //         "id": 6,
  //         "text": "Component and IT Related Services"
  //     }
  // ]
  commodityList: Array<commoditylistss>;
  branchList: any;
  View: any;
  prccbssaved:boolean = false;
  @ViewChild("commodity") matcommodityAutocomplete: MatAutocomplete;
  @ViewChild("commodityInput") commodityInput: any;

  @ViewChild("commodityy") matcommodityyAutocomplete: MatAutocomplete;
  @ViewChild("commodityInputt") commodityInputt: any;

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("supplier") matsupplierAutocomplete: MatAutocomplete;
  @ViewChild("supplierInput") supplierInput: any;
  @ViewChild("productcat") matproductAutocomplete: MatAutocomplete;
  @ViewChild("productInput") productInput: any;
  @ViewChild("productInputtype") productInputtype: any;

  @ViewChild("model") matmodelAutocomplete: MatAutocomplete;
  @ViewChild("modelInput") modelInput: any;
  @ViewChild("branch") matbranchAutocomplete: MatAutocomplete;
  @ViewChild("branchInput") branchInput: any;
  @ViewChild("uom") matuomAutocomplete: MatAutocomplete;
  @ViewChild("uomInput") uomInput: any;
  @ViewChild("closebutton") closebutton: ElementRef;
  @ViewChild("closepopupbranch") closepopupbranch: ElementRef;
  //   SupplierArray: any = [
  //     {
  //         "branch_id": 2,
  //         "specifications": {
  //             "RAM": "16GB",
  //             "Storage": "512GB SSD",
  //             "Processor": "Intel i7"
  //         },
  //         "fromdate": "2020-11-23",
  //         "id": 36008,
  //         "make": {
  //             "code": "P01563",
  //             "id": 286,
  //             "name": "Dummy Make"
  //         },
  //         "model": {
  //             "code": "P01564",
  //             "id": 287,
  //             "name": "Dummy Model"
  //         },
  //         "productname": "1",
  //         "supplierbranch": {
  //             "code": "SU0000002",
  //             "id": 2,
  //             "name": "ESSEL CHAMBERS OWNERS ASSOCIATION - KARNATAKA"
  //         },
  //         "todate": "2025-11-24",
  //         "unitprice": "1.00",
  //         "uom": {
  //             "code": "NO",
  //             "id": 2,
  //             "name": "testing by a2"
  //         }
  //     },
  //     {
  //         "branch_id": 1129,
  //         "specifications": {
  //             "RAM": "16GB",
  //             "Storage": "512GB SSD",
  //             "Processor": "Intel i7"
  //         },
  //         "fromdate": "2020-11-23",
  //         "id": 1129,
  //         "make": {
  //             "code": "P01563",
  //             "id": 286,
  //             "name": "Dummy Make"
  //         },
  //         "model": {
  //             "code": "P01564",
  //             "id": 287,
  //             "name": "Dummy Model"
  //         },
  //         "productname": "1",
  //         "supplierbranch": {
  //             "code": "SU0001129",
  //             "id": 1129,
  //             "name": "INTEGRATED ENTERPRISE SOLUTIONS PVT LTD - TAMIL NADU"
  //         },
  //         "todate": "2025-12-30",
  //         "unitprice": "1.00",
  //         "uom": {
  //             "code": "NO",
  //             "id": 2,
  //             "name": "testing by a2"
  //         }
  //     },
  //     {
  //         "branch_id": 10569,
  //         "specifications": {
  //             "RAM": "16GB",
  //             "Storage": "512GB SSD",
  //             "Processor": "Intel i7"
  //         },
  //         "fromdate": "2025-03-25",
  //         "id": 37028,
  //         "make": {
  //             "code": "P00001",
  //             "id": 209,
  //             "name": "DM Printer Test"
  //         },
  //         "model": {
  //             "code": "P00001",
  //             "id": 214,
  //             "name": "Model xyz"
  //         },
  //         "productname": "1",
  //         "supplierbranch": {
  //             "code": "SU0010475",
  //             "id": 10569,
  //             "name": "SRI V S TRAVELS - SHEVAPET SALEM"
  //         },
  //         "todate": "2025-08-28",
  //         "unitprice": "150.00",
  //         "uom": {
  //             "code": "NO",
  //             "id": 2,
  //             "name": "testing by a2"
  //         }
  //     }
  // ];

  // SupplierArray: any =  [
  //   {
  //       "branch_id": 1129,
  //       "configuration": {
  //           "RAM": "8GB RAM",
  //           "Screen size": "15.6 Standard"
  //       },
  //       "fromdate": "2024-10-15",
  //       "id": 36550,
  //       "make": {
  //           "code": "P00268",
  //           "id": 2,
  //           "name": "dell"
  //       },
  //       "model": {
  //           "code": "P00268",
  //           "id": 4,
  //           "name": "G-Series"
  //       },
  //       "productname": "268",
  //       "quotation": " ",
  //       "supplierbranch": {
  //           "code": "SU0001129",
  //           "id": 1129,
  //           "name": "INTEGRATED ENTERPRISE SOLUTIONS PVT LTD - TAMIL NADU"
  //       },
  //       "todate": "2026-08-21",
  //       "unitprice": "5.00",
  //       "uom": {
  //           "code": "PKT",
  //           "id": 4,
  //           "name": "Packet"
  //       }
  //   },
  //   {
  //       "branch_id": 18634,
  //       "configuration": {
  //           "RAM": "16GB RAM",
  //           "Screen size": "12 to 14 inches can be more portable"
  //       },
  //       "fromdate": "2024-06-02",
  //       "id": 36515,
  //       "make": {
  //           "code": "P00268",
  //           "id": 57,
  //           "name": "Inspiron"
  //       },
  //       "model": {
  //           "code": "P00268",
  //           "id": 59,
  //           "name": "RA"
  //       },
  //       "productname": "268",
  //       "quotation": " ",
  //       "supplierbranch": {
  //           "code": "SU17720",
  //           "id": 18634,
  //           "name": "minakshidas"
  //       },
  //       "todate": "2027-06-20",
  //       "unitprice": "0.00",
  //       "uom": {
  //           "code": "KG",
  //           "id": 1,
  //           "name": "Kilogram"
  //       }
  //   },
  //   {
  //       "branch_id": 18727,
  //       "configuration": {
  //           "Display Type": "Pick IPS for great viewing angles",
  //           "RAM": "8GB"
  //       },
  //       "fromdate": "2023-12-24",
  //       "id": 36763,
  //       "make": {
  //           "code": "P00268",
  //           "id": 2,
  //           "name": "dell"
  //       },
  //       "model": {
  //           "code": "P00268",
  //           "id": 125,
  //           "name": "Precision"
  //       },
  //       "productname": "268",
  //       "quotation": " ",
  //       "supplierbranch": {
  //           "code": "SU17776",
  //           "id": 18727,
  //           "name": "Yogz"
  //       },
  //       "todate": "2026-12-24",
  //       "unitprice": "150.00",
  //       "uom": {
  //           "code": "NO",
  //           "id": 2068,
  //           "name": "NUMBER"
  //       }
  //   },
  //   {
  //       "branch_id": 18832,
  //       "configuration": {
  //           "RAM": "16GB"
  //       },
  //       "fromdate": "2023-10-24",
  //       "id": 36922,
  //       "make": {
  //           "code": "P00268",
  //           "id": 2,
  //           "name": "dell"
  //       },
  //       "model": {
  //           "code": "P00268",
  //           "id": 125,
  //           "name": "Precision"
  //       },
  //       "productname": "268",
  //       "quotation": " ",
  //       "supplierbranch": {
  //           "code": "SU17843",
  //           "id": 18832,
  //           "name": "JNLTD s1"
  //       },
  //       "todate": "2026-12-24",
  //       "unitprice": "15.00",
  //       "uom": {
  //           "code": "NO",
  //           "id": 2068,
  //           "name": "NUMBER"
  //       }
  //   },
  //   {
  //       "branch_id": 18879,
  //       "configuration": {
  //           "N/A": "N/A"
  //       },
  //       "fromdate": "2025-03-14",
  //       "id": 36995,
  //       "make": {
  //           "code": "P00268",
  //           "id": 2,
  //           "name": "dell"
  //       },
  //       "model": {
  //           "code": "P00268",
  //           "id": 3,
  //           "name": "Precisionn"
  //       },
  //       "productname": "268",
  //       "quotation": " ",
  //       "supplierbranch": {
  //           "code": "SU17863",
  //           "id": 18879,
  //           "name": "name"
  //       },
  //       "todate": "2025-09-18",
  //       "unitprice": "15.00",
  //       "uom": {
  //           "code": "54321",
  //           "id": 87,
  //           "name": "CAT"
  //       }
  //   },
  //   {
  //       "branch_id": 18879,
  //       "configuration": {
  //           "Screen size": "15.6 Standard"
  //       },
  //       "fromdate": "2025-03-14",
  //       "id": 37020,
  //       "make": {
  //           "code": "P00268",
  //           "id": 2,
  //           "name": "dell"
  //       },
  //       "model": {
  //           "code": "P00268",
  //           "id": 3,
  //           "name": "Precisionn"
  //       },
  //       "productname": "268",
  //       "quotation": " ",
  //       "supplierbranch": {
  //           "code": "SU17863",
  //           "id": 18879,
  //           "name": "name"
  //       },
  //       "todate": "2025-09-18",
  //       "unitprice": "15.00",
  //       "uom": {
  //           "code": "54321",
  //           "id": 87,
  //           "name": "CAT"
  //       }
  //   },
  //   {
  //       "branch_id": 18928,
  //       "configuration": {
  //           "Display Type": "LED",
  //           "RAM": "8GB RAM",
  //           "Screen size": "15.6 Standard"
  //       },
  //       "fromdate": "2025-04-03",
  //       "id": 37029,
  //       "make": {
  //           "code": "P00268",
  //           "id": 2,
  //           "name": "dell"
  //       },
  //       "model": {
  //           "code": "P00268",
  //           "id": 3,
  //           "name": "Precisionn"
  //       },
  //       "productname": "268",
  //       "quotation": " ",
  //       "supplierbranch": {
  //           "code": "SU17884",
  //           "id": 18928,
  //           "name": "Branch 2"
  //       },
  //       "todate": "2025-05-31",
  //       "unitprice": "12.00",
  //       "uom": {
  //           "code": "KG",
  //           "id": 1,
  //           "name": "Kilogram"
  //       }
  //   }
  // ];
  SupplierArray: any = [];

  currentRowIndex: number = 0;
  showpopup: boolean = false;
  currentpagecom = 1;
  has_nextcom = true;
  has_previouscom = true;
  SearchForm: FormGroup;
  isLoading: boolean = false;
  productList: any;
  prForm: FormGroup;
  datalist: any;
  commodity: any;
  product: any;
  cc: any;
  bs: any;
  uom: any;
  comreadonly: boolean;
  prodreadonly: any;
  isScore: any;
  branchreadonly: any;
  branchForm: FormGroup;
  getCatlog_NonCatlogList: any;
  yesorno: any[] = [
    { value: 1, display: "Yes" },
    { value: 0, display: "No" },
  ];
  @ViewChild("bs") matbsAutocomplete: MatAutocomplete;
  @ViewChild("bsInput") bsInput: any;
  MEPList: any;
  @ViewChild("emp") matempAutocomplete: MatAutocomplete;
  @ViewChild("empInput") empInput: any;
  @ViewChild("item") matitemAutocomplete: MatAutocomplete;
  @ViewChild("itemInput") itemInput: any;
  @ViewChild("spec") matspecsAutocomplete: MatAutocomplete;
  @ViewChild("specsInput") specsInput: any;
  supplierList: any;
  supplierreadonly: any;

  employeeList: any;
  has_nextemp: boolean;
  has_previousemp: any;
  currentpageemp: any;
  employeeCode: any;
  employeeLimit: any;
  MAKE: boolean;
  currentpageitem: number;
  has_nextitem: boolean;
  has_previousitem: boolean;
  itemList: any;
  itemreadonly: any;
  is_model: boolean;
  modelList: any;
  modelID: any;
  modellname: any;
  currentpagemodel: number;
  has_previousmodel: boolean;
  has_nextmodel: boolean;
  configuration: any;
  currentpagespecs: number;
  has_nextspecs: boolean;
  has_previousspecs: boolean;
  specsList: any;
  uomlist: any;
  ForCatlog: any;
  has_next: boolean;
  has_previous: any;
  currentpage: any;
  bslist: any;
  selectedCCBSindex: any;
  has_nextbs: boolean;
  has_previousbs: any;
  currentpagebs: any;
  dts = 0;
  cclist: any;
  subscriptions: Subscription[] = [];
  ccbsArray: FormArray;
  prdetails: any = [];
  file: string | Blob;
  used_branch_pr: any = [];
  filesHeader: FormGroup;
  @ViewChild("takeInput", { static: false }) InputVar: ElementRef;
  catalog: boolean = true;
  non_catalog: boolean;
  total_amount: number = 0.0;
  commodityListt: any;
  ismepdtl: boolean = false;
  MEPUtilizationAmountList: any;
  empBranchdata: any;
  branchid: any;
  employeeid: any;
  catalogtypeid: any = 1;
  checkconfiguration: boolean;
  location_fullname: any;
  qty_values: number;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  mepno: any;
  selectedType: any;
  type = [
    { id: "1", text: "New" },
    { id: "2", text: "Replacement" },
    // {id:'3', text: 'Software'},
    // {id:'4', text: 'Service'}
  ];
   producttype_next = false;
  producttype_pre = false;
  producttype_crtpage= 1;
 prdTypes: any=[]
  @ViewChild("productauto") productAutocomplete: MatAutocomplete;

  constructor(
    private activateroute: ActivatedRoute,
    private spinnerservice: NgxSpinnerService,
    private shareService: PRPOshareService,
    private notification: NotificationService,
    private cd: ChangeDetectorRef,
    private errorHandler: ErrorHandlingServiceService,
    private formbuilder: FormBuilder,
    public datepipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private prposervice: PRPOSERVICEService,
    private renderer: Renderer2,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef,
     private reportService: ReportserviceService
  ) {}

  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  ngOnInit(): void {
    this.filesHeader = this.fb.group({
      file_upload: new FormArray([]),
    });

    this.branchForm = this.fb.group({
      type: ["", Validators.required],
      dts: [0, Validators.required],
      branch: ["", Validators.required],
      pca: [""],
      commodity: ["", Validators.required],
      employee_id: ["", Validators.required],
      rows: this.fb.array(["", Validators.required]),
      file_key: [["fileheader"]],
      notepad: [""],
      product: [""],
      supplier: [""],
      quotation: [""],
      items: [""],
      models: [""],
      specs: [""],
      spec_config: this.fb.group({}), // Store configurations as an object
      unitprice: [""],
      supplierRows: this.fb.array([]), // Dynamic supplier array
      uom: [""],
      amount: [""],
      qty: [""],
    });
    this.getCatlog_NonCatlog();
    this.getproductType();
    this.branchForm
      .get("branch")
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
          this.spinnerservice.hide();
        }
      );

    // this.SearchForm.valueChanges.subscribe(() => {
    //   this.Search(); // Automatically call Search when any filter changes
    // });

    // this.getSupplier()
    // this.prForm = this.fb.group({
    //   type: "",
    //   mepno: '',
    //   mepnokey: '',
    //   is_asset:[0],   //7480
    //   prdetails_bfile_id:'',                 //7421
    //   draft_create:'',  //4529
    //   commodity: '',
    //   commodity_id: '',
    //   productCategory: '',
    //   productType: '',
    //   dts: [0, Validators.required],
    //   product: '',
    //   items: '',
    //   models:'',
    //   modelsid:'',
    //   specs:'',
    //   specsid:'',
    //   itemsid: '',
    //   productnoncatlog: '',
    //   itemnoncatlog: '',
    //   supplier: '',
    //   supplier_id: '',
    //   unitprice: '',
    //   uom: '',
    //   employee_id: '',
    //   branch_id: '',
    //   totalamount: 0,
    //   notepad: '',
    //   prdetails: this.fb.array([]),
    //   file_key:[["fileheader"]],
    // });

    this.SearchForm = this.fb.group({
      commodity_id: [""],
      product_id: [""],
      branch_id: [""],
      qty: [""],
      pr_for: [""],
      product_type: [""],
      Draftstatus: ["New"],
      no: [""],
    });

    // this.getapprovedBRdata()    //summary API call
    // this.branchForm
    //   .get("pca")
    //   .valueChanges.pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       // console.log('inside tap')
    //     }),
    //     switchMap((value) =>
    //       this.prposervice.getmepFKdd(value, 1).pipe(
    //         finalize(() => {
    //           this.isLoading = false;
    //         })
    //       )
    //     )
    //   )
    //   .subscribe(
    //     (results: any[]) => {
    //       let datas = results["data"];
    //       this.MEPList = datas;
    //     },
    //     (error) => {
    //       this.errorHandler.handleError(error);
    //       this.spinnerservice.hide();
    //     }
    //   );

    // this.branchForm
    //   .get("commodity")
    //   .valueChanges.pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       // console.log('inside tap')
    //     }),
    //     switchMap((value) =>
    //       this.prposervice
    //         .getcommodityDependencyFKdd(this.branchForm.value.pca, value, 1)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false;
    //           })
    //         )
    //     )
    //   )
    //   .subscribe(
    //     (results: any[]) => {
    //       let datas = results["data"];
    //       this.commodityListt = datas;
    //     },
    //     (error) => {
    //       this.errorHandler.handleError(error);
    //       this.spinnerservice.hide();
    //     }
    //   );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// MEP
    // let mepkey = ""
    this.SearchForm.get("commodity_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice
            .getcommodityDependencyFKdd(this.branchForm.value.pca, value, 1)
            .pipe(
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
          this.spinnerservice.hide();
        }
      );
    this.SearchForm.get("product_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice
            .getproductfn(
              this.SearchForm.value?.commodity_id?.id,
              this.SearchForm.value?.product_type?.id,
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
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.productList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );

    ////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////branch
    let branchkeyvalue: String = "";
    this.getbranchFK();

    this.SearchForm.get("branch_id")
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
          this.spinnerservice.hide();
        }
      );
    //////////////////////////////////////////////////
    this.rows.clear();
    // this.getapprovedBRdata()
    this.NewgetapprovedBRdata();
    this.getEmployeeBranchData();
    // this.getproductFK();
    // this.getbranchFK();
    this.getCommodityFK();
    // this.getMasterQuotation(1);
  }
  showSpinner() {
    this.loadingProcesses++;
    console.log("Spinner shown. Active processes:", this.loadingProcesses); // Debugging log
    this.spinnerservice.show();
  }

  // Function to hide the spinner
  hideSpinner() {
    this.loadingProcesses--;
    console.log("Spinner hidden. Active processes:", this.loadingProcesses); // Debugging log
    if (this.loadingProcesses <= 0) {
      this.loadingProcesses = 0; // Prevent negative counter
      this.spinnerservice.hide();
    }
  }
  loadingProcesses = 0;
  mep_name: any;
  pcaId(mep) {
    this.mepno = mep.no;
    this.mep_name = mep.name;
  }
  get rows(): FormArray {
    return this.branchForm.get("rows") as FormArray;
  }

  // getCCBSArray(rowIndex: number): FormArray {
  //   return this.rows.at(rowIndex).get('prccbs') as FormArray;
  // }
  // getCCBSArray(rowIndex: number): FormArray {
  //   const row = this.rows.at(rowIndex) as FormGroup;
  //   return row.get('prccbs') as FormArray; // Make sure `prccbs` is properly defined
  // }
  // getCCBSArray(index: number): FormArray {
  //   return (this.rows as FormArray)
  //     .at(index)
  //     .get("prccbs") as FormArray;
  // }
  getCCBSArray(index: number): FormArray {
    const rowsArray = this.rows as FormArray;

    // if (!rowsArray || index < 0 || index >= rowsArray.length) {
    //   console.warn(`Invalid index ${index} or rows not initialized`);
    //   return this.fb.array([]); // or return null if you prefer
    // }

    const group = rowsArray.at(index) as FormGroup;
    const prccbs = group.get("prccbs") as FormArray;

    return prccbs ?? this.fb.array([]);
  }
  getSpecificationKeys(specification: any): string[] {
    return specification ? Object.keys(specification) : [];
  }
  createRow(data): FormGroup {
    const newRow = this.fb.group({
      branch: [data.branch_id.fullname || ""],
      commodity: [data.commodity_id.name || ""],
      commodity_id: [data.commodity_id.id || ""],
      id: [data.id || ""],
      product_name: [data.product_id.name || ""],
      product_type: [data.product_type?.name || ""],
      product_id: [data.product_id.id || ""],
      pr_for: [data.pr_request == 1 ? "1" : data.pr_request == 2 ? "2" : ""],
      supplier: [data.supplier || ""],
      supplier_id: [""],
      items: [data.items || ""],
      item: [""],
      item_name: [""],
      model_id: [""],
      model_name: [""],
      specification: [""],
      // models: [data.models || ""],
      // specs: [data.specs || ""],
      models: [{ value: data.models || "", disabled: true }], // Add this control for the checkbox
      specs: [{ value: data.specs || "", disabled: true }], // Add this control for the checkbox
      branch_pr_request: [{ value: "", disabled: false }],
      prdetail_id: [{ value: data.prdetail_id || "", disabled: true }],
      unitprice: [data.unitprice || ""],
      uom: [data.uom || ""],
      qty: [data.qty || ""],
      remarks: [data.remarks || ""],
      installationrequired: [data.installationrequired || 0],
      capitialized: [data.capitialized || 0],
      amount: [data.amount || ""],
      checked: [{ value: false, disabled: true }], // Add this control for the checkbox
      prccbs: this.fb.array([this.createCCBSRow(data)]),
    });

    return newRow;
  }
  createData(data): FormGroup {
    const uniqueSpecs = Array.from(
      new Set(this.specList.map((s) => s.specification))
    );

    // ✅ Ensure specControls is an object
    const specControls: Record<string, any> = uniqueSpecs.reduce(
      (acc: Record<string, any>, spec: string) => {
        acc[spec] = [{ value: "", disabled: true }];
        return acc;
      },
      {} // Initial value as an empty object
    );

    return this.fb.group({
      id: [data.id || ""],
      product_name: [this.branchForm.get("product").value?.name || ""],
      product_type: [this.prodType || ""],
      product_id: [this.branchForm.get("product").value?.id || ""],
      pr_for: [data.pr_request == 1 ? "1" : data.pr_request == 2 ? "2" : ""],
      supplier: [data.supplierbranch || ""],
      supplier_id: [""],
      items: [data.make || ""],
      item: [""],
      item_name: [""],
      model_id: [""],
      model_name: [""],
      specification: [""],
      models: [data.model || ""],
      specs: [{ value: data.configuration || "", disabled: true }],
      branch_pr_request: [{ value: "", disabled: false }],
      prdetail_id: [{ value: data.prdetail_id || "", disabled: true }],
      unitprice: [data.unitprice || ""],
      uom: [data.uom || ""],
      qty: [data.qty || ""],
      remarks: [data.remarks || ""],
      installationrequired: [data.installationrequired || 0],
      capitialized: [data.capitialized || 0],
      amount: [data.qty && data.unitprice ? data.qty * data.unitprice : 0],
      checked: [{ value: false, disabled: true }],
      related_component_id: 0,
      related_component_name: "",
      quotation_no: [
        data?.quotation?.supplier_quot
          ? data?.quotation?.quotation?.supplier_quot
          : "--",
      ],
      quotationid: [
        data?.quotation?.quotation_id ? data?.quotation?.quotation_id : 0,
      ],
      quot_detailsid: [data?.quotation?.id ? data?.quotation?.id : 0],
      prccbs: this.fb.array([this.createCCBSRow(data)]),

      ...specControls,
    });
  }

  // createData(data): FormGroup {
  //   const newRow = this.fb.group({
  //     // branch: [data.branch_id.fullname || ""],
  //     // commodity: [data.commodity_id.name || ""],
  //     // commodity_id: [data.commodity_id.id || ""],
  //     id: [data.id || ""],
  //     product_name: [this.branchForm.get('product').value?.name || ""],
  //     product_type: [this.prodType || ""],
  //     product_id: [this.branchForm.get('product').value?.id || ""],
  //     pr_for:[data.pr_request == 1 ? '1' : data.pr_request == 2 ? '2' : ''],
  //     supplier: [data.supplierbranch || ""],
  //     supplier_id: [""],
  //     items: [data.make || ""],
  //     item: [""],
  //     item_name: [""],
  //     model_id: [""],
  //     model_name: [""],
  //     specification: [""],
  //     // models: [data.models || ""],
  //     // specs: [data.specs || ""],
  //     models: [ data.model || ""], // Add this control for the checkbox
  //     specs: [{ value: data.configuration || "", disabled: true }], // Add this control for the checkbox
  //     branch_pr_request: [{ value:"", disabled: false }],
  //     prdetail_id: [{ value: data.prdetail_id || "", disabled: true }],
  //     unitprice: [data.unitprice || ""],
  //     uom: [data.uom || ""],
  //     qty: [data.qty || ""],
  //     remarks: [data.remarks || ""],
  //     installationrequired: [data.installationrequired || 0],
  //     capitialized: [data.capitialized || 0],
  //     amount: [data.qty && data.unitprice ? data.qty * data.unitprice : 0],
  //     checked: [{ value: false, disabled: true }], // Add this control for the checkbox
  //     related_component_id : 0,
  //     related_component_name: "",
  //     quotation_no: [data?.quotation?.supplier_quot ?  data?.quotation?.quotation?.supplier_quot : "--"],
  //     quotationid : [data?.quotation?.quotation_id ? data?.quotation?.quotation_id : 0],
  //     quot_detailsid : [data?.quotation?.id ? data?.quotation?.id : 0 ],

  //     prccbs: this.fb.array([this.createCCBSRow(data)]),
  //   });

  //   return newRow;
  // }
  createCCBSRow(data): FormGroup {
    return this.fb.group({
      branch_id: [data.branch_id || ""],
      bs: [data.bs || ""],
      cc: [data.cc || ""],
      req_qty: [data.qty || ""],
      blc_qty: [data.qty || ""],
      qty: [0],
    });
  }
  //   addCCBSRow(i: number) {
  //     const rowsArray = this.branchForm.get('rows') as FormArray;
  //     const row = rowsArray.at(i) as FormGroup;

  //     // Get the prccbs FormArray for the specific row
  //     const ccbsArray = row.get('prccbs') as FormArray;

  //     // Add a new CCBS row to the prccbs FormArray
  //     ccbsArray.push(this.createCCBSRow({}));
  //     console.log("ccbsArray.value",ccbsArray.value)
  //     console.log("ccbsArray.value",rowsArray.value)
  // }
  addCCBSRow(rowIndex: number): void {
    const prccbs = this.getCCBSArray(rowIndex);

    // Create and push a new CCBS row
    const newCCBSRow = this.createCCBSRow("");
    prccbs.push(newCCBSRow);

    // Patch the new row with values from ccbsdata[0]
    if (this.ccbsdata[rowIndex]) {
      newCCBSRow.patchValue({
        branch_id: this.ccbsdata[rowIndex].branch_id,
        bs: this.ccbsdata[rowIndex].bs,
        cc: this.ccbsdata[rowIndex].cc,
        qty: 0,
      });
    }
  }

  // addCCBSRow(rowIndex: number, data?: any): void {
  //   // Get the FormArray of 'prccbs' at the specified row index
  //   const prccbs = this.getCCBSArray(rowIndex);

  //   // Create and push a new CCBS row (FormGroup)
  //   const newCCBSRow = this.createCCBSRow('');
  //   prccbs.push(newCCBSRow);

  //   // Patch the new row with values from data if available
  //   if (data) {
  //     newCCBSRow.patchValue({
  //       branch_id: data.branch_id,
  //       bs: data.bs,
  //       cc: data.cc,
  //       qty: data.qty,
  //     });
  //   }
  // }

  removeCCBSRow(rowIndex: number, ccbsIndex: number): void {
    this.getCCBSArray(rowIndex).removeAt(ccbsIndex);
  }
  chooseType(type) {
    console.log(type, "type");
    let ischeck = this.branchForm.value.type;
    if (this.catalogtypeid === type.id) {
      return;
    } else {
      var answer = window.confirm("Do u want to continue with " + type.text);

      if (answer) {
        this.Reset();
        // this.selectedRows = [];
        // this.rows.clear();
        // this.branchForm.reset();
        // this.getEmployeeBranchData();
        // this.getCatlog_NonCatlog();
      } else {
        return false;
      }
    }
    if (ischeck == 1) {
      this.catalog = true;
      this.non_catalog = false;
      this.catalogtypeid = 1;
    }
    if (ischeck == 2) {
      this.catalog = false;
      this.non_catalog = true;
      this.catalogtypeid = 2;
    }
    // this.catalog = (id == 1) ? true : false;
    // this.non_catalog = (id == 2) ? true : false;
  }
  autocompletecomScroll() {
    this.has_nextcom = true;
    this.has_previouscom = true;
    this.currentpagecom = 1;
    console.log("hasnext of commodity", this.has_nextcom);
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
              if (this.has_nextcom === true) {
                this.prposervice
                  .getcommodityDependencyFKdd(
                    this.branchForm.value.pca,
                    this.commodityInputt.nativeElement.value,
                    this.currentpagecom + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.commodityListt = this.commodityListt.concat(datas);
                      if (this.commodityListt.length >= 0) {
                        this.has_nextcom = datapagination?.has_next;
                        this.has_previouscom = datapagination?.has_previous;
                        this.currentpagecom = datapagination?.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.spinnerservice.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  // addProduct(){
  //   // let dict = {
  //   //   product_id: this.branchForm.get('product')?.value?.id,
  //   // };
  //   // this.spinnerservice.show();
  //   // this.prposervice.getapprovedBRdata(dict).subscribe((result) => {
  //   //   let datas = result["data"];
  //   //   this.ccbsdata = result["data"];

  //   //   if (datas.length <= 0) {
  //   //     this.notification.showInfo("No Record Found!");
  //   //     this.spinnerservice.hide();
  //   //   }

  //     // this.rows.clear();
  //     let data = {
  //       supplier : this.branchForm.get('supplier')?.value,
  //       items: this.branchForm.get('items')?.value,
  //       models: this.branchForm.get('models')?.value,
  //       specs : this.branchForm.get('specs')?.value,
  //       unitprice : this.branchForm.get('unitprice')?.value,
  //       uom : this.branchForm.get('uom')?.value,
  //       amount : this.branchForm.get('amount')?.value,
  //       quotation : this.branchForm.get('quotation')?.value,
  //     }
  //     // // datas.forEach((question) => {
  //     //   // if(this.selectedRows.includes(question.id) == question.id){
  //     //   this.selectedRows.forEach((row) => {
  //     // //     // if(row.id == question.id){
  //     //   this.rows.push(this.createData(row,data));
  //     // //   // }
  //     // // // });
  //     // });
  //     this.selectedRows.forEach((row, index) => {
  //       const exists = this.rows.controls.some(control => control.value.id === row.id); // Check if the row exists
  //       if (!exists) {
  //         this.rows.push(this.createData(row, data)); // Push only if it doesn't exist
  //         this.checkboxvalidation(index, row);
  //       }
  //     });

  //     // this.selectedRows.forEach((row) => {
  //     //   // Create a new object each time to prevent reference issues
  //     //   let newData = {
  //     //     supplier: this.branchForm.get('supplier')?.value,
  //     //     items: this.branchForm.get('items')?.value,
  //     //     models: this.branchForm.get('models')?.value,
  //     //     specs: this.branchForm.get('specs')?.value,
  //     //     unitprice: this.branchForm.get('unitprice')?.value,
  //     //     uom: this.branchForm.get('uom')?.value,
  //     //   };

  //     //   this.rows.push(this.createData(row, newData)); // Pass a fresh object
  //     // });

  //     console.log("thsrows", this.rows);
  //   //   this.spinnerservice.hide();
  //   // });

  //   // this.selectedRows.forEach((row) => {
  //   //   row.get("id").value ==
  // }
  // selectSupp(checkvalue, data, qty) {

  // }
  //  dataSelection(index: number, row: any) {
  //   row.checked = !row.checked;

  //   if (row.checked) {
  //     if (this.selected.length > 0 && this.selected[0].product_id.id !== row.product_id.id) {
  //       // alert("You can select only one type of product at a time.");
  //       this.notification.showInfo("You can select only one type of product at a time.");
  //       row.checked = false; // Uncheck the row immediately
  //       return;
  //     }

  //     const existingRow = this.selected.find(item => item.product_id.id === row.product_id.id);

  //     if (existingRow) {
  //       // If the product exists, update the quantity
  //       existingRow.qty += row.qty;
  //     } else {
  //       this.selected.push({ ...row });
  //       this.ccbsdata = this.selected;
  //     }
  //   } else {
  //     // Remove the row when unchecked
  //     this.selected = this.selected.filter(item => item.product_id.id !== row.product_id.id);
  //   }

  //   console.table(this.selected);

  //   if (this.selected.length > 0) {
  //     const totalQty = this.selected.reduce((sum, item) => sum + item.qty, 0);
  //     let selectedRow = this.selected[0]; // All selected items are of the same product type

  //     this.branchForm.get('product').setValue(selectedRow.product_id);
  //     this.product = this.branchForm.get('product').value.name;
  //     this.prodType = selectedRow.product_type.name
  //     this.product_type = selectedRow.product_type.id;
  //     this.row_id = selectedRow?.id;
  //     this.branchForm.get('qty').setValue(totalQty);
  //     this.totalQty = totalQty
  //     this.branchForm.get('commodity').setValue(selectedRow.commodity_id);
  //   } else {
  //     // Reset fields if no product is selected
  //     // this.branchForm.get('product').setValue(null);
  //     // this.product_type = null;
  //     // this.row_id = null;
  //     // this.branchForm.get('qty').setValue(null);
  //     this.branchForm.get('commodity').setValue(null);
  //   }
  //   this.getOtherAttributes(this.branchForm.get('product').value.code);
  //   // this.searchProduct();
  //   // this.patchSpecifications();
  // }
  idSelected: any = [];
  idUnchecked:any[] = [];
  prrequestvalue: any;

  isSelected(row: any): boolean {
  return this.selected.some(item => item.id === row.id);
}

onCheckboxChange(event: any, index: number, row: any) {
  if (event.target.checked) {
    // Validate first
    if (this.selected.length > 0) {
      const first = this.selected[0];
      if (first.product_id.id !== row.product_id.id) {
        this.notification.showInfo("Different Products are not Allowed!");
        event.target.checked = false;  // forcibly uncheck UI checkbox
        return;
      }
      if (first.commodity_id.id !== row.commodity_id.id) {
        this.notification.showInfo("Different Commodities are not Allowed!");
        event.target.checked = false;
        return;
      }
      if (first.pr_request !== row.pr_request) {
        this.notification.showInfo("Different Request types are not Allowed!");
        event.target.checked = false;
        return;
      }
    }

    // If valid, add
    this.selected.push({ ...row });
    this.idSelected.push(row.id);
    this.ccbsdata.push({ ...row });

  } else {
    // Remove
    const selectedIndex = this.selected.findIndex(item => item.id === row.id);
    if (selectedIndex !== -1) {
      this.totalQty -= this.selected[selectedIndex].qty;
      this.selected.splice(selectedIndex, 1);
      this.idSelected = this.idSelected.filter(id => id !== row.id);
      this.idUnchecked.push(row.id);
    }

    const ccbsIndex = this.ccbsdata.findIndex(item => item.id === row.id);
    if (ccbsIndex !== -1) {
      this.ccbsdata.splice(ccbsIndex, 1);
    }
  }

  this.updateFormAndData();
}

updateFormAndData() {
  if (this.selected.length > 0) {
    const totalQty = this.selected.reduce((sum, item) => sum + item.qty, 0);
    const selectedRow = this.selected[0];

    this.branchForm.patchValue({
      product: selectedRow?.product_id,
      qty: totalQty,
      commodity: selectedRow?.commodity_id,
    });

    this.product = selectedRow?.product_id?.name;
    this.prodType = selectedRow?.product_type?.name;
    this.prod_val = ["Service", "IT Related Services"].includes(this.prodType);
    this.prodDict = selectedRow?.product_type;
    this.Commodity = selectedRow?.commodity_id?.id;
    this.pr_request = selectedRow?.pr_request;
    this.product_type = selectedRow?.product_type?.id;
    this.row_id = selectedRow?.id;
    this.totalQty = totalQty;

    if (this.quotation === true) {
      this.quotation = false;
      setTimeout(() => {
        this.quotation = true;
        this.selected = [...this.selected];
      }, 0);
    }
  } else {
    this.branchForm.reset();
    this.selected = [];
    this.ccbsdata = [];
    this.quotation = false;
    this.selectedTypeQ = "";
    this.selectedRows = [];
    this.showData = false;
    this.SupplierArray = [];
  }

  this.getOtherAttributes(this.branchForm.get("product")?.value?.code);
}

dataSelection(index: number, row: any) {
  // STEP 1: Validate before toggling checked
  if (this.selected.length > 0) {
    const first = this.selected[0];

    if (first.product_id.id !== row.product_id.id) {
      this.notification.showInfo("Different Products are not Allowed!");
    setTimeout(() => {
        row.checked = false;
      },100);
      return;
    }

    if (first.commodity_id.id !== row.commodity_id.id) {
      this.notification.showInfo("Different Commodities are not Allowed!");
     setTimeout(() => {
        row.checked = false;
      },100);
      return;
    }

    if (first.pr_request !== row.pr_request) {
      this.notification.showInfo("Different Request types are not Allowed!");
       setTimeout(() => {
        row.checked = false;
      },200);
      return;
    }
  }

  // STEP 2: Toggle check state AFTER validation
  row.checked = !row.checked;

  if (row.checked) {
    this.prrequestvalue = row?.product_requestfor;

    if (!this.idSelected.includes(row.id)) {
      this.idSelected.push(row.id);
    }

    const exists = this.selected.find((item) => item.id === row.id);
    if (!exists) {
      this.selected.push({ ...row });
    }

    const inCcbs = this.ccbsdata.find((item) => item.id === row.id);
    if (!inCcbs) {
      this.ccbsdata.push({ ...row });
    }
  } else {
    const selectedIndex = this.selected.findIndex((item) => item.id === row.id);
    if (selectedIndex !== -1) {
      this.totalQty -= this.selected[selectedIndex].qty;
      this.selected.splice(selectedIndex, 1);
      this.idSelected = this.idSelected.filter(id => id !== row.id);
      this.idUnchecked.push(row.id);
    }

    const ccbsIndex = this.ccbsdata.findIndex((item) => item.id === row.id);
    if (ccbsIndex !== -1) {
      this.ccbsdata.splice(ccbsIndex, 1);
    }
  }

  // Update form if selected items remain
  if (this.selected.length > 0) {
    const totalQty = this.selected.reduce((sum, item) => sum + item.qty, 0);
    const selectedRow = this.selected[0];

    this.branchForm.patchValue({
      product: selectedRow?.product_id,
      qty: totalQty,
      commodity: selectedRow?.commodity_id,
    });

    this.product = selectedRow?.product_id?.name;
    this.prodType = selectedRow?.product_type?.name;
    this.prod_val = ["Service", "IT Related Services"].includes(this.prodType);
    this.prodDict = selectedRow?.product_type;
    this.Commodity = selectedRow?.commodity_id?.id;
    this.pr_request = selectedRow?.pr_request;
    this.product_type = selectedRow?.product_type?.id;
    this.row_id = selectedRow?.id;
    this.totalQty = totalQty;

    if (this.quotation === true) {
      this.quotation = false;
      setTimeout(() => {
        this.quotation = true;
        this.selected = [...this.selected];
      }, 0);
    }
  } else {
    this.branchForm.reset();
    this.selected = [];
    this.ccbsdata = [];
    this.quotation = false;
    this.selectedTypeQ = "";
    this.selectedRows = [];
    this.showData = false;
    this.SupplierArray = [];
  }

  this.getOtherAttributes(this.branchForm.get("product")?.value?.code);
}
  prod_val: boolean = false;
  pr_request: any;
  prodDict: any;
  // patchSpecifications() {
  //   const specConfigGroup = this.branchForm.get('spec_config') as FormGroup;

  //   this.specList.forEach((spec) => {
  //     const matchedConfigs = this.SupplierArray.flatMap((supplier) =>
  //       supplier.configuration.filter((config) => config.specification === spec.specification)
  //     );

  //     if (matchedConfigs.length > 0) {
  //       specConfigGroup.addControl(
  //         spec.specification,
  //         this.fb.control(matchedConfigs.map((conf) => conf.configuration).join(', '))
  //       );
  //     }
  //   });
  // }

  Commodity: any;
  totalQty: any;
  prodType: any;
  // selectSupp(event: FocusEvent, data: any, qty: number, index: number) {
  //   if (qty == null || qty <= 0) {
  //     this.notification.showInfo("Quantity must be greater than zero!");
  //     this.qty.controls[index].setValue(""); // Clear the quantity field
  //     return;
  //   }

  //   // Calculate the total quantity entered so far
  //   const totalQty = this.selectedRows.reduce((sum, item) => sum + item.qty, 0) + qty;

  //   // Check if total quantity does not match the required total
  //   const requiredQty = this.branchForm.get('qty')?.value; // Assuming required total is stored here
  //   if (totalQty !== requiredQty) {
  //     this.notification.showInfo("Quantity Mismatch!");
  //     this.qty.controls[index].setValue(""); // Clear the quantity field
  //     return;
  //   }

  //   const amount = qty * data.unitprice; // Calculate amount

  //   // Check if the row already exists in selectedRows
  //   const existingRow = this.selectedRows.find(item => item.id === data.id);
  //   if (existingRow) {
  //     existingRow.qty = qty;
  //     existingRow.amount = amount;
  //   } else {
  //     this.selectedRows.push({ ...data, qty, amount });
  //   }

  //   console.log("Updated Selected Rows:", this.selectedRows);
  // }
  // selectSupp(event: FocusEvent, data: any, qty: number, index: number) {
  //   if (qty == null || qty <= 0) {
  //     this.notification.showInfo("Quantity must be greater than zero!");
  //     this.qty.controls[index].setValue(""); // Clear the quantity field
  //     return;
  //   }

  //   // Calculate the total quantity entered so far
  //   const updatedRows = this.selectedRows.map(item =>
  //     item.id === data.id ? { ...item, qty } : item
  //   );

  //   const totalQty = updatedRows.reduce((sum, item) => sum + item.qty, 0);
  //   const requiredQty = this.branchForm.get('qty')?.value; // Required total quantity

  //   if (totalQty !== requiredQty) {
  //     this.notification.showInfo("Quantity Mismatch!");
  //     this.qty.controls[index].setValue(""); // Clear the quantity field
  //     return;
  //   }

  //   const amount = qty * data.unitprice; // Calculate amount

  //   // Check if the row already exists in selectedRows
  //   const existingIndex = this.selectedRows.findIndex(item => item.id === data.id);
  //   if (existingIndex !== -1) {
  //     this.selectedRows[existingIndex].qty = qty;
  //     this.selectedRows[existingIndex].amount = amount;
  //   } else {
  //     this.selectedRows.push({ ...data, qty, amount });
  //   }

  //   console.log("Updated Selected Rows:", this.selectedRows);
  // }

  // selectSupp(event: FocusEvent, data: any, qty: number, index: number) {
  //   // Validation: Ensure quantity is greater than zero
  //   if (!qty || qty <= 0) {
  //     this.notification.showInfo("Quantity must be greater than zero!");
  //     this.qty.controls[index].setValue(""); // Clear the quantity field
  //     return;
  //   }

  //   // Calculate amount
  //   const amount = qty * data.unitprice;

  //   // Check if this is the first selection
  //   if (this.selectedRows.length === 0) {
  //     // Add the first selected row
  //     this.selectedRows.push({ ...data, qty, amount });
  //   } else {
  //     // Check if the row already exists
  //     const existingRow = this.selectedRows.find((item) => item.id === data.id);
  //     if (existingRow) {
  //       // Update quantity and amount for existing row
  //       existingRow.qty = qty;
  //       existingRow.amount = amount;
  //     } else {
  //       // Add new row
  //       this.selectedRows.push({ ...data, qty, amount });
  //     }
  //   }

  //   console.log("Updated Selected Rows:", this.selectedRows);
  // }
  selectSupp(event: FocusEvent, data: any, qty: number, index: number) {
    if (data.unitprice == null || data.unitprice <= 0) {
      this.notification.showInfo("Please Check Unit Price!");
      this.qty.controls[index].setValue("");
      return;
    }

    if (!qty || qty <= 0) {
      this.notification.showInfo("Quantity must be greater than zero!");
      this.qty.controls[index].setValue("");
      return;
    }
    const requiredQty = this.branchForm.get("qty")?.value;

    const amount = qty * data.unitprice;

    const existingRow = this.selectedRows.find((item) => item.id === data.id);
    let previousQty = existingRow ? existingRow.qty : 0;

    if (this.selectedRows.length > 0) {
      let totalQty =
        this.selectedRows.reduce((sum, item) => sum + item.qty, 0) -
        previousQty +
        qty;

      if (totalQty > requiredQty) {
        this.notification.showInfo(
          "Quantity Mismatch! Exceeds Required Quantity!"
        );
        this.qty.controls[index].setValue(previousQty);
        return;
      }
    }

  if (existingRow) {
    existingRow.qty = qty;
    existingRow.amount = amount;
  } else if (qty > 0 && amount > 0) {
    // ✅ Push only if both qty and amount are valid
    this.selectedRows.push({ ...data, qty, amount });
  }

    console.log("Updated Selected Rows:", this.selectedRows);
  }

  addProduct() {
    const totalQty = this.selectedRows.reduce((sum, item) => sum + item.qty, 0);
    const formQty = this.branchForm.get("qty")?.value;

    if (totalQty !== formQty) {
      this.notification.showInfo("Quantity Mismatch!");
      return;
    }

    this.selectedRows.forEach((row, i) => {
      // const existingRow = this.rows.controls.find(control => control.value.product_id === row.id);

      // if (existingRow) {
      //   // If row already exists, update quantity
      //   existingRow.patchValue({ qty: existingRow.value.qty + row.qty });
      // } else {
      // If row is new, add it
      this.rows.push(this.createData(row));
      this.isChecked(i);
      // }
    });
    const modalTrigger = document.getElementById("closemodal");
    modalTrigger?.click();
    console.log("Final Rows:", this.rows.value);
  }

  // addProduct() {
  //   // let data = {
  //   //   supplier: this.branchForm.get('supplier')?.value,
  //   //   items: this.branchForm.get('items')?.value,
  //   //   models: this.branchForm.get('models')?.value,
  //   //   specs: this.branchForm.get('specs')?.value,
  //   //   unitprice: this.branchForm.get('unitprice')?.value,
  //   //   uom: this.branchForm.get('uom')?.value,
  //   //   amount: this.branchForm.get('amount')?.value,
  //   //   quotation: this.branchForm.get('quotation')?.value,
  //   // };
  //   // this.selectedRows.forEach()

  //   this.selectedRows.forEach(row => {
  //     const totalQty = this.selectedRows.reduce((sum, item) => sum + item.qty, 0);
  //     let qty = this.branchForm.get('qty').value
  //     // const existingRow = this.rows.controls.find(control => control.value.product_id === row.id);
  //     if(totalQty ==  qty){
  //       this.rows.push(this.createData(row)); // Add new row
  //     } else {
  //       this.notification.showInfo("Quantity Mismatch!");
  //       return;
  //     }
  //     // if (existingRow) {
  //       // existingRow.patchValue({ qty: existingRow.value.qty + row.qty }); // Update quantity
  //     // } else {
  //     // }
  //   });

  //   console.log("Final Rows:", this.rows.value);
  //   // console.log("Total Added Rows:", this.selectedRowCount);
  // }
  getSummary(id) {
    this.branchForm.controls["employee_id"].reset("");
    let dict = {
      commodity_id: id,
    };
    this.spinnerservice.show();
    this.prposervice.getapprovedBRdata(dict).subscribe((result) => {
      let datas = result["data"];
      this.ccbsdata = result["data"];

      if (datas.length <= 0) {
        this.notification.showInfo("No Record Found!");
        this.spinnerservice.hide();
      }

      this.rows.clear();
      datas.forEach((question) => {
        this.rows.push(this.createRow(question));
      });
      console.log("thsrows", this.rows);
      this.spinnerservice.hide();
    });
  }

  getEmployeeBranchData() {
    // this.spinnerservice.show();
    this.showSpinner();
    this.prposervice.getEmpBranchId().subscribe(
      (results: any) => {
        // this.spinnerservice.hide();
        this.hideSpinner();
        if (results.error) {
          // this.spinnerservice.hide();
          this.notification.showWarning(results.error + results.description);
          this.branchForm["branch"].reset("");
          return false;
        }
        let datas = results;
        this.empBranchdata = datas;
        this.branchid = this.empBranchdata.id;
        this.employeeid = this.empBranchdata.employee_id;
        console.log("this.branchid==>", this.empBranchdata.id, this.employeeid);
        console.log("empBranchdata", datas);
        this.branchForm.patchValue({
          branch: this.empBranchdata,
        });
        console.log(this.branchForm.value);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }

  getapprovedBRdata() {
    this.spinnerservice.show();
    let data = this.SearchForm.value;

    for (let i in data) {
      if (data[i] == null || data[i] == "" || data[i] == undefined) {
        delete data[i];
      }
    }
    this.prposervice.getapprovedBRdata(data).subscribe((result) => {
      let datas = result["data"];
      if (datas.length == 0) {
        this.notification.showInfo("No Record Found!");
        this.spinnerservice.hide();
      }
      this.rows.clear();
      datas.forEach((question) => {
        this.rows.push(this.createRow(question));
      });
      console.log("thsrows", this.rows);
      this.spinnerservice.hide();
    });
  }
  // NewgetapprovedBRdata() {
  //   // this.spinnerservice.show();
  //   this.showSpinner();
  //   let data = this.SearchForm.value;

  //   let filteredData = Object.keys(data).reduce((acc, key) => {
  //     if (data[key] !== null && data[key] !== "" && data[key] !== undefined) {
  //       acc[key] = data[key];
  //     }
  //     return acc;
  //   }, {});

  //   this.prposervice.getapprovedBRdata(filteredData).subscribe((result) => {
  //     // this.spinnerservice.hide();

  //     let datas = result["data"];
  //     this.hideSpinner()

  //     if (datas.length === 0) {
  //       this.notification.showInfo("No Record Found!");
  //     } else {
  //       this.approvedList = datas;
  //       // this.filteredList = [...datas]; // Initialize filteredList with new data
  //       // this.extractUniqueValues(); // Extract unique dropdown values
  //     }

  //     // this.spinnerservice.hide();
  //   });
  // }
  NewgetapprovedBRdata(callback?: () => void) {
    this.showSpinner();
    let data = this.SearchForm.value;

    let filteredData = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== null && data[key] !== "" && data[key] !== undefined) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    this.prposervice.getapprovedBRdata(filteredData).subscribe((result) => {
      this.hideSpinner();

      let datas = result["data"];
      if (datas.length === 0) {
        this.notification.showInfo("No Record Found!");
      } else {
        this.approvedList = datas;
        if (callback) callback(); // ✅ call callback after approvedList is set
      }
    });
  }

  // NewgetapprovedBRdata() {
  //   this.spinnerservice.show();
  //   let data = this.SearchForm.value;

  //   for (let i in data) {
  //     if (data[i] == null || data[i] == "" || data[i] == undefined) {
  //       delete data[i];
  //     }
  //   }
  //   this.prposervice.getapprovedBRdata(data).subscribe((result) => {
  //     let datas = result["data"];
  //     if (datas.length == 0) {
  //       this.notification.showInfo("No Record Found!");
  //       this.spinnerservice.hide();
  //     }
  //     this.approvedList = datas;
  //     // this.rows.clear();
  //     // datas.forEach((question) => {
  //     //   this.rows.push(this.createRow(question));
  //     // });
  //     console.log("thsrows", this.rows);
  //     this.spinnerservice.hide();
  //   });
  // }
  approvedList: any = [];

  public displayFncommodity(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }
  getmakercommodity() {
    this.getCommodityFKk();

    this.branchForm
      .get("commodity")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice
            .getcommodityDependencyFKdd(this.branchForm.value.pca, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.commodityListt = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
  }
  getCommodityFKk() {
    this.spinnerservice.show();
    let productData = this.branchForm.value.pca;
    this.prposervice.getcommodityDependencyFK(productData, "").subscribe(
      (results: any[]) => {
        console.log("Commodity result==>", results);

        this.spinnerservice.hide();
        let datas = results["data"];
        this.commodityListt = datas;
        console.log("product", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }
  getCommodityFK() {
    // this.spinnerservice.show();
    this.showSpinner();
    let productData = this.SearchForm.value.mepno;
    this.prposervice.getcommodityDependencyFK(productData, "").subscribe(
      (results: any[]) => {
        console.log("Commodity result==>", results);
        this.hideSpinner();
        // this.spinnerservice.hide();
        let datas = results["data"];
        this.commodityList = datas;
        console.log("product", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }
  autocompletecommodityScroll() {
    console.log("hasnext of commodity", this.has_nextcom);
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
                  .getcommodityDependencyFKdd(
                    this.branchForm.value.pca,
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
                      this.spinnerservice.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  resetAfterCommodityChange(type) {
    if (type == "removecom") {
      this.branchForm.controls["commodity"].reset("");
    }
    if (type == "com") {
      this.SearchForm.controls["commodity_id"].reset("");
    }
    if (type == "pca") {
      this.branchForm.controls["pca"].reset("");
    }
    if (type == "product_id") {
      this.SearchForm.controls["product_id"].reset("");
    }
    if (type == "branch") {
      this.SearchForm.controls["branch_id"].reset("");
    }
  }

  //For product dropdown
  public displayFnproduct(prod?: productLists): string | undefined {
    return prod ? prod.name : undefined;
  }

  getproductFK() {
    // this.spinnerservice.show();
    this.showSpinner();
    let commodity = this.SearchForm?.value?.commodity_id?.id;
    let prod = this.SearchForm?.value?.product_type?.id;
    if (commodity == "" || commodity == null || commodity == undefined) {
      commodity = "";
    }
    if (prod == "" || prod == null || prod == undefined) {
      prod = "";
    }
    //  if(prod == "" || prod == null || prod == undefined){
    //   this.notification.showError("Choose Product Type!");
    //   return;
    // }
    // let type = this.SearchForm.value.type
    let value = this.productInput?.nativeElement?.value;
    // let assetvalue=this.assetvalue.nativeElement.value
    console.log("value==>", value);

    // let productCat = this.prForm.value.productCategory.id
    // let prodType = this.prForm.value.productType.id
    //   if (commodity==undefined && type==2) {
    //     this.notification.showError("Kindly Choose Commodity")
    //     this.spinnerservice.hide()
    //     return false
    //   }

    //  else if ((supplier==undefined || commodity==undefined) && type==1) {
    //   this.notification.showError("Kindly Choose Supplier and Commodity")
    //   this.spinnerservice.hide()
    //   return false
    // }
    // else{
    // this.prposervice.getproductDependencyFK(commodity,value,assetvalue,1)
    this.prposervice.getproductfn(commodity, prod, value, 1).subscribe(
      (results: any[]) => {
        // this.spinnerservice.hide();
        this.hideSpinner();
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
        //   this.spinnerservice.hide()
        //   this.notification.showError("The Product Doesn't Have a Valid Catalog")
        // }
        ("The Product Doesn't Have a Valid Catalog");
        this.productList = datas;
        console.log("product", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
    // }
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
                this.prposervice
                  .getproductfn(
                    this.SearchForm.value?.commodity?.id,
                    this.SearchForm?.value?.product_type?.id,
                    this.productInput?.nativeElement?.value,
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
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.spinnerservice.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  Reset() {
    this.SearchForm.reset();
    // this.getapprovedBRdata()
  }
  getFilteredSearchData() {
    const data = this.SearchForm.value;
    return Object.keys(data).reduce((acc, key) => {
      if (data[key] !== null && data[key] !== "" && data[key] !== undefined) {
        acc[key] = data[key];
      }
      return acc;
    }, {});
  }

  showdraft: boolean = false;
  isdraftSubmit:boolean = false;
  getdraftData(data) {
    this.draft_id = data.id
    this.showSpinner();
    this.prposervice.getdraftData(data?.id).subscribe(
      (results) => {
        // this.NewgetapprovedBRdata();
        // this.approvedList.unshift(...results['prdetails'][0]?.branch_indent)
        this.hideSpinner();
        this.showdraft = false;

        const datas = results["prdetails"];
        this.prdetails = datas;
        // this.NewgetapprovedBRdata(() => {
        //   const branchIndent = this.prdetails?.[0]?.branch_indent;

        //   // ✅ Add only if checked and not already in approvedList
        //   if (checked && branchIndent) {
        //     const exists = this.approvedList?.some(item => item?.id === branchIndent?.id);
        //     if (!exists) {
        //       this.approvedList.unshift(branchIndent);
        //     }
        //   }

        //   console.log("approvedList", this.approvedList);
        // });
        const prdetailsData = results["prdetails"];

        const branchIndent = prdetailsData?.[0]?.branch_indent;
        this.prposervice
          .getapprovedBRdata(this.getFilteredSearchData())
          .subscribe((result) => {
            this.hideSpinner();
            this.showdraft = false;

            this.approvedList = result?.data || [];

            if (branchIndent) {
              const itemsToAdd = Array.isArray(branchIndent)
                ? branchIndent
                : [branchIndent];
              this.approvedList.unshift(...itemsToAdd); // Add to beginning
              this.selected = itemsToAdd;
              this.ccbsdata = itemsToAdd;
              this.idSelected = itemsToAdd.map((item) => item.id);
            }
          });

        this.selectedTypeQ = "1";
        this.SupplierArray = this.prdetails?.[0]?.catlog || [];
        this.selectedRows = this.SupplierArray;
        const totalQty = this.SupplierArray.reduce(
          (sum, item) => sum + (item.qty || 0),
          0
        );

        this.branchForm.patchValue({
          product: this.prdetails?.[0]?.prdetails?.[0]?.product,
          qty: totalQty,
        });
        this.product = this.prdetails?.[0]?.prdetails?.[0]?.product?.name;
        this.prodType = this.prdetails?.[0]?.prdetails?.[0]?.producttype?.name;
        this.prodDict = this.prdetails?.[0]?.prdetails?.[0]?.producttype;
        this.Commodity = this.prdetails?.[0]?.commodity_id;
        this.pr_request = this.prdetails?.[0]?.prdetails[0]?.pr_request;
        this.prrequestvalue =
          this.prdetails?.[0]?.prdetails[0]?.product_requestfor;
        this.getOtherAttributes(
          this.prdetails?.[0]?.prdetails?.[0]?.product?.code
        );
        this.showData = true;
        this.qty = new FormArray(
          this.SupplierArray.map((i) => new FormControl(i?.qty))
           );    

        this.rows.clear();

        this.prdetails[0]?.prdetails.forEach((supplier) => {
          const ccbsdata = supplier?.prccbs || [];

          const prccbsArray = this.fb.array(
            ccbsdata.map((ccbsItem) =>
              this.fb.group({
                branch_id: [ccbsItem?.branch || ""],
                bs: [ccbsItem?.bs || ""],
                cc: [ccbsItem?.cc || ""],
                req_qty: [ccbsItem?.qty || 0],
                blc_qty: [0],
                allc_blc_qty: [0],
                master_blc_qty: [ccbsItem?.qty || 0],
                qty: [ccbsItem?.qty || 0, Validators.required],
              })
            )
          );

          const supplierGroup = this.fb.group({
            prccbs: prccbsArray,
            supplier_id: [supplier?.supplier_id || ""],
            product_id: [supplier?.product?.id || ""],
            qty: [supplier?.qty || 0],
            unit_price: [supplier?.unit_price || 0],
            total: [supplier?.qty * supplier?.unit_price || 0],
          });

          this.rows.push(supplierGroup);
        });

        console.log("this.rows", this.rows);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.hideSpinner();
      }
    );
  }
  resetField() {
        this.selectedRows = []; // Clear selected rows after submission
        if (this.qty && this.qty.controls) {
          this.qty.controls.forEach(control => control.setValue(""));
        }
        this.showData = false;
        this.branchForm.reset(); // Reset the form
        this.rows.clear(); // Clear the rows in the form array
        this.selected = [];
        this.idUnchecked = []; // Clear selected rows
        this.specList = [];
        this.selectedTypeQ = "";
        // this.ngOnInit(); //
  }
  private enterPressed = false;

onEnterKey(event: KeyboardEvent) {
  if (!this.enterPressed) {
    this.enterPressed = true;
    this.Search();
    setTimeout(() => {
      this.enterPressed = false;
    }, 500); 
  }

  event.preventDefault();      
  event.stopPropagation();  
}
  draft_id:any;
  Search() {
    this.spinnerservice.show();
    let productData = this.SearchForm?.value;
    this.showdraft = productData?.Draftstatus == "Draft" ? true : false;
    if(this.showdraft) this.isdraftSubmit = true; 

    let data = {
      commodity_id: productData?.commodity_id?.id,
      product_id: productData?.product_id?.id,
      branch_id: productData?.branch_id?.id,
      qty: productData?.qty,
      product_type: productData?.product_type?.id,
      pr_request: Number(productData?.pr_for),
      prheader_status: productData?.Draftstatus,
      no: productData?.no,
    };

    for (let i in data) {
      if (data[i] == null || data[i] == "" || data[i] == undefined) {
        delete data[i];
      }
    }
    if (this.showdraft == true) {
      this.prposervice.getapprovedBRdatanew(data).subscribe(
        (results) => {
           if(results?.code){
          this.spinnerservice.hide()
          this.notification.showError(results?.description)
          return false
        }
          let datas = results["data"];
          this.draftList = datas;
          // this.rows.clear();
          // datas.forEach((question) => {
          //   this.rows.push(this.createRow(question));
          // });
          console.log("draftList", this.draftList);
          this.spinnerservice.hide();
          return true;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
    } else {
      this.prposervice.getapprovedBRdatanew(data).subscribe(
        (results) => {
          if(results?.code){
          this.spinnerservice.hide()
          this.notification.showError(results?.description)
          return false
        }
          let datas = results["data"];
          this.approvedList = datas;
          // this.rows.clear();
          // datas.forEach((question) => {
          //   this.rows.push(this.createRow(question));
          // });
          console.log("thsrows", this.rows);
          this.spinnerservice.hide();
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
    }
  }
  draftList: any = [];
  // draftList: any = [
  //         {
  //             "data": {
  //                 "commodity_id": {
  //                     "code": "COMD001",
  //                     "id": 1,
  //                     "name": "Courier, Mail Services and Postage",
  //                     "status": 1
  //                 },
  //                 "id": 292,
  //                                 "pr_request": "2",

  //                 "no": "PRD25050001",
  //                 "product_id": {
  //                     "code": "P00001",
  //                     "id": 1,
  //                     "name": "(DOT MATRIX) PRINTER"
  //                 },
  //                 "product_type": {
  //                     "id": "4",
  //                     "name": "Hardware"
  //                 },
  //                 "sub_array": [
  //                     {
  //                         "branch_id": {
  //                             "address_id": 458,
  //                             "code": "1101",
  //                             "contact_id": 441,
  //                             "fullname": "(1101) CENTRAL OFFICE",
  //                             "gstin": "33AAACT3373J1ZD",
  //                             "id": 471,
  //                             "name": "CENTRAL OFFICE"
  //                         },
  //                         "no": "BPR25040018",
  //                         "qty": 2.0
  //                     }
  //                 ]
  //             },
  //             "id": 292,
  //             "no": "PRD25050001"
  //         },
  //         {
  //             "data": {
  //                 "commodity_id": {
  //                     "code": "COMD001",
  //                     "id": 1,
  //                     "name": "Courier, Mail Services and Postage",
  //                     "status": 1
  //                 },
  //                                 "pr_request": "2",

  //                 "id": 291,
  //                 "no": "PRD25050001",
  //                 "product_id": {
  //                     "code": "P00001",
  //                     "id": 1,
  //                     "name": "(DOT MATRIX) PRINTER"
  //                 },
  //                 "product_type": {
  //                     "id": "4",
  //                     "name": "Hardware"
  //                 },
  //                 "sub_array": [
  //                     {
  //                         "branch_id": {
  //                             "address_id": 458,
  //                             "code": "1101",
  //                             "contact_id": 441,
  //                             "fullname": "(1101) CENTRAL OFFICE",
  //                             "gstin": "33AAACT3373J1ZD",
  //                             "id": 471,
  //                             "name": "CENTRAL OFFICE"
  //                         },
  //                         "no": "BPR25040020",
  //                         "qty": 3.0
  //                     },
  //                      {
  //                         "branch_id": {
  //                             "address_id": 458,
  //                             "code": "1101",
  //                             "contact_id": 441,
  //                             "fullname": "(1101) CENTRAL OFFICE",
  //                             "gstin": "33AAACT3373J1ZD",
  //                             "id": 471,
  //                             "name": "CENTRAL OFFICE"
  //                         },
  //                         "no": "BPR25040020",
  //                         "qty": 5.0
  //                     }
  //                 ]
  //             },
  //             "id": 291,
  //             "no": "PRD25050001"
  //         }
  //     ];
  reset() {
    this.SearchForm.reset();
    this.Search();
  }

  public displayFnbranch(branch?: branchlistss): any | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }

  getbranchFK() {
    // this.spinnerservice.show();
    this.showSpinner();
    this.prposervice.getbranchdd().subscribe(
      (results) => {
        // this.spinnerservice.hide();
        this.hideSpinner();
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas);
        // this.branchForm.patchValue({
        //   branch: this.branchList[0]
        // })
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
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
                      if (this.branchList.length >= 0) {
                        this.has_nextbranch = datapagination.has_next;
                        this.has_previousbranch = datapagination.has_previous;
                        this.currentpagebranch = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.spinnerservice.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  getCatlog_NonCatlog() {
    // this.spinnerservice.show();
    this.showSpinner();
    this.prposervice.getCatlog_NonCatlog().subscribe(
      (results: any[]) => {
        // this.spinnerservice.hide();
        this.hideSpinner();
        let datas = results["data"];
        this.getCatlog_NonCatlogList = datas;
        this.branchForm
          .get("type")
          .patchValue(this.getCatlog_NonCatlogList[0].id);
        // console.log("getCatlog_NonCatlog", datas)
        // this.patchCatlogNoncatlog()
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }
  dtsValidation(e) {
    // console.log(this.dts,'before')
    // console.log(e,'e')
    this.dts = e;
    // console.log(this.dts,'after')
  }

  public displayFnMep(MEP?: any) {
    if (typeof MEP == "string") {
      return MEP;
    }
    return MEP ? this.MEPList.find((_) => _.mepno == MEP).mepno : undefined;
  }

  getmakerpca() {
    this.getmepFK();

    this.branchForm
      .get("pca")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
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
          this.MEPList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
  }
  getmepFK() {
    this.spinnerservice.show();
    this.branchForm.get("commodity").reset();
    this.prposervice.getmepFK("").subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.MEPList = datas;
        this.spinnerservice.hide();
        // console.log("mepList", datas)
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }
  public displayFnsupplier(supplier?: supplierlistss): any | undefined {
    return supplier ? supplier.name : undefined;
  }

  currentpagesupplier = 1;
  has_nextsupplier = true;
  has_previoussupplier = true;
  autocompletesupplierScroll(index) {
    if (this.catalogtypeid === 1) {
      let formarray = this.branchForm.get("rows") as FormArray;
      let element = formarray.at(index);

      const commodity = element.get("commodity_id").value;
      const product = element.get("product_id").value;
      setTimeout(() => {
        if (
          this.matsupplierAutocomplete &&
          this.autocompleteTrigger &&
          this.matsupplierAutocomplete.panel
        ) {
          fromEvent(this.matsupplierAutocomplete.panel.nativeElement, "scroll")
            .pipe(
              map(
                (x) =>
                  this.matsupplierAutocomplete.panel.nativeElement.scrollTop
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
                    .getsupplierDependencyFKdd(
                      product,
                      this.dts,
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
                          this.has_previoussupplier =
                            datapagination.has_previous;
                          this.currentpagesupplier = datapagination.index;
                        }
                      },
                      (error) => {
                        this.errorHandler.handleError(error);
                        this.spinnerservice.hide();
                      }
                    );
                }
              }
            });
        }
      });
    }
    if (this.catalogtypeid === 2) {
      let formarray = this.branchForm.get("rows") as FormArray;
      let element = formarray.at(index);

      const commodity = element.get("commodity_id").value;
      const product = element.get("product_id").value;
      setTimeout(() => {
        if (
          this.matsupplierAutocomplete &&
          this.autocompleteTrigger &&
          this.matsupplierAutocomplete.panel
        ) {
          fromEvent(this.matsupplierAutocomplete.panel.nativeElement, "scroll")
            .pipe(
              map(
                (x) =>
                  this.matsupplierAutocomplete.panel.nativeElement.scrollTop
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
                    .getsupplierDependencyFKdd1(
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
                          this.has_previoussupplier =
                            datapagination.has_previous;
                          this.currentpagesupplier = datapagination.index;
                        }
                      },
                      (error) => {
                        this.errorHandler.handleError(error);
                        this.spinnerservice.hide();
                      }
                    );
                }
              }
            });
        }
      });
    }
  }
  public displayFnemp(emp?: Emplistss): string | undefined {
    // console.log('id', emp.id);
    // console.log('full_name', emp.full_name);
    return emp ? emp.full_name : undefined;
  }
  autocompleteempScroll() {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextemp === true) {
                this.prposervice
                  .getemployeeApproverforPRDD(
                    this.branchForm.value.commodity.id,
                    this.empInput.nativeElement.value,
                    this.currentpageemp + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.employeeList = this.employeeList.concat(datas);
                      // console.log("emp", datas)
                      if (this.employeeList.length >= 0) {
                        this.has_nextemp = datapagination.has_next;
                        this.has_previousemp = datapagination.has_previous;
                        this.currentpageemp = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.spinnerservice.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  getemployeeForApprover() {
    let commodityID = this.branchForm.value.commodity.id;
    console.log("commodityID", commodityID);
    if (commodityID === "" || commodityID === undefined) {
      this.notification.showInfo(
        "Please Select the Commdity to choose the Approver"
      );
      return false;
    }
    this.spinnerservice.show();
    this.prposervice.getemployeeApproverforPR(commodityID).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.spinnerservice.hide();
        if (datas.length == 0) {
          this.spinnerservice.hide();
          this.notification.showInfo(
            "No PR Approver is found against this Commodity"
          );
          return false;
        }
        this.employeeList = datas;
        console.log("employeeList", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }
  empValues(data) {
    this.employeeCode = data.code;
    this.employeeLimit = data.limit;
  }
  getSupplier(index) {
    const type = this.branchForm.get("type").value;
    const commodity_id = this.branchForm.get("commodity").value.id;
    const employee_id = this.branchForm.get("employee_id").value.id;
    if (type === "" || type === null || type === undefined) {
      this.notification.showError("Catalog/Non Catalog is mandatory");
      return;
    }

    if (
      commodity_id === "" ||
      commodity_id === null ||
      commodity_id === undefined
    ) {
      this.notification.showError("Commodity is mandatory");
      return;
    }
    if (
      employee_id === "" ||
      employee_id === null ||
      employee_id === undefined
    ) {
      this.notification.showError("Approver name is mandatory");
      return;
    }
    let formarray = this.branchForm.get("rows") as FormArray;
    let element = formarray.at(index);

    const commodity = element.get("commodity_id").value;
    const product = element.get("product_id").value;
    const dts = this.branchForm.get("dts").value;

    const { rows, ...formData } = this.branchForm.value;

    // if(dts == '' || dts == undefined || dts == null){
    //   this.notification.showWarning("Kindly Choose DTS!");
    //   this.spinnerservice.hide();
    //   return false;
    // }

    this.spinnerservice.show();
    if (this.catalogtypeid === 1) {
      this.prposervice.getsupplierDependencyFK(product, this.dts).subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.spinnerservice.hide();
          this.supplierList = datas;
          console.log("supplierList", datas);
          if (this.supplierList.length == 0) {
            this.notification.showInfo("No Record Found!");
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
    }

    if (this.catalogtypeid === 2) {
      this.spinnerservice.show();
      let value = "";
      this.prposervice.getsupplierDependencyFKdd1(value, 1).subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.spinnerservice.hide();
          this.supplierList = datas;
          console.log("supplierList", datas);
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
    }
  }
  // getitemFK(index) {
  //   const type = this.branchForm.get("type").value;
  //   const commodity_id = this.branchForm.get("commodity").value.id;
  //   const employee_id = this.branchForm.get("employee_id").value.id;
  //   if (type === "" || type === null || type === undefined) {
  //     this.notification.showError("Catalog/Non Catalog is mandatory");
  //     return;
  //   }

  //   if (
  //     commodity_id === "" ||
  //     commodity_id === null ||
  //     commodity_id === undefined
  //   ) {
  //     this.notification.showError("Commodity is mandatory");
  //     return;
  //   }
  //   if (
  //     employee_id === "" ||
  //     employee_id === null ||
  //     employee_id === undefined
  //   ) {
  //     this.notification.showError("Approver name is mandatory");
  //     return;
  //   }
  //   // this.SpinnerService.show();
  //   this.MAKE = true;
  //   console.log("data", this.MAKE);
  //   let formarray = this.branchForm.get("rows") as FormArray;
  //   let element = formarray.at(index);

  //   const commodity = element.get("commodity_id")?.value;
  //   const product = element.get("product_id")?.value;
  //   const supplier = element.get("supplier")?.value?.id;

  //   // Validate supplier, product, and commodity
  //   if (!(supplier || product || commodity)) {
  //     this.notification.showError("Kindly Choose Supplier and Product");
  //     this.spinnerservice.hide();
  //     return false;
  //   }

  //   this.spinnerservice.show();
  //   // this.dts = this.branchForm.get('dts').value;

  //   // Call the service to get items dependency
  //   this.prposervice
  //     .getitemsDependencyFK(product, 0, supplier)
  //     .subscribe(
  //       (results: any[]) => {
  //         this.spinnerservice.hide();
  //         let datas = results["data"];
  //         let data = results;

  //         //   if(datas[0].make == 0){
  //         //     this.notification.showError("No data is there against make")
  //         //     this.prForm.patchValue({
  //         //       unitprice: datas[0].unitprice,
  //         //       uom: datas[0].uom
  //         // })
  //         //   }
  //         //   else{
  //         //     this.itemList = datas;
  //         //   }
  //         // Handle results and perform actions
  //         this.currentpageitem = 1;
  //         this.has_nextitem = true;
  //         this.has_previousitem = true;

  //         this.itemList = datas;

  //         console.log("product", datas);

  //         if (data["description"]) {
  //           this.spinnerservice.hide();
  //           this.notification.showError(
  //             "The Product Doesn't Have a Valid Catalog"
  //           );
  //         }
  //       },
  //       (error) => {
  //         this.errorHandler.handleError(error);
  //         this.spinnerservice.hide();
  //       }
  //     );
  // }
  make_id: any;
deleteRow(index: number, data: any) {
  this.qty.at(index).setValue("");

  const rowGroup = this.rows.at(index) as FormGroup;
  const prccbsArray = rowGroup.get("prccbs") as FormArray;

  prccbsArray.controls.forEach((ctrl: AbstractControl, idx: number) => {
    ctrl.get("qty")?.setValue(0);
    ctrl.get("blc_qty")?.setValue(0);
    ctrl.get("allc_blc_qty")?.setValue(0);
  }); 

  rowGroup.get("unit_price")?.setValue(0);
  rowGroup.get("total")?.setValue(0);

  if (this.selectedRows[index]?.prccbs) {
    this.SupplierArray[index].prccbs.forEach((item: any) => {
      item.qty = 0;
      item.blc_qty = 0;
      item.allc_blc_qty = 0;
    });
  }

  // ✅ Delete `qty` and `amount` keys from selectedRows[index]
  delete this.selectedRows[index].qty;
  delete this.selectedRows[index].amount;

  console.log("this.selectedRows", this.selectedRows);
}


  submitData() {
    // const totalQty = this.selectedRows.reduce((sum, item) => sum + item.qty, 0);
    // const requiredQty = this.branchForm.get("qty")?.value; // Get the required total quantity

   
    const validRows = this.selectedRows.filter((item) => item.qty && item.amount);
const totalQty = validRows.reduce((sum, item) => sum + item.qty, 0);
const requiredQty = this.branchForm.get("qty")?.value;
console.log("validsss",validRows)
if (totalQty !== requiredQty) {
  this.notification.showInfo(
    "Total Quantity Mismatch! Please Adjust your Selection!"
  );
  return;
}
// if (this.prccbssaved == false){
//   this.notification.showWarning("Please Add CCBS Details");
//   return
// }
    const rowsArray = this.rows as FormArray;

    // Check each selected row has at least one non-zero qty in its prccbs
    // for (let i = 0; i < this.selectedRows.length; i++) {
    //   const rowIndex = i;
    //   const row = rowsArray.at(rowIndex);
    //   const prccbsArray = row.get('prccbs') as FormArray;

    //   const hasNonZeroQty = prccbsArray.controls.some(group => (+group.get('qty')?.value || 0) > 0);

    //   if (!hasNonZeroQty ) {
    //     this.notification.showError(`Please Enter Quantity for at least one CCBS row (Row #${i + 1})`);
    //     return;
    //   }
    // }

    console.log("this.selectedRows", this.selectedRows);
    console.log("this.branchForm", this.branchForm.value);
    console.log("this.selected", this.selected);
    console.log("this.rows", this.rows);




    // const payload = this.selectedRows.map(selectedRow => {
    //   const matchingRow = (this.rows as FormArray).value.find(row => row.supplier_id === selectedRow.id);

    //   const filteredPrccbs = (matchingRow?.prccbs || []).map(prccb => {
    //     const { master_blc_qty, blc_qty, req_qty, ...rest } = prccb;
    //     return rest;
    //   });

    //   return {
    //     ...selectedRow,
    //     employee_id : this.employeeid,
    //     commodity_id : this.commodity,
    //     prccbs: filteredPrccbs
    //   };
    // });

    const payload = {
      employee_id: Number(this.employeeid),
      commodity_id: this.Commodity,
      branch_id: this.branchid,
      pr_type:1,

      con_bpa_no: {
        id: this.idSelected,
      },
prdetails: this.selectedRows
  .filter((row) => row.qty && row.amount)  // 💡 Only include rows with qty & amount
  .map((selectedRow) => {
        const matchingRow = (this.rows as FormArray).value.find(
          (row) =>
            row.supplier_id === selectedRow.id ||
            row.supplier_id === selectedRow.supplierbranch?.id
        );

        const prccbs = (matchingRow?.prccbs || [])
         .filter(item => item.qty !== 0) 
         .map(
          ({
            master_blc_qty,
            blc_qty,
            req_qty,
            allc_blc_qty,
            branch_id,
            ...rest
          }) => ({
            ...rest,
            branch_id: branch_id?.id || branch_id, // flatten if it's an object
          })
        );
        

        return {
          // catelog_id: Number(this.selectedTypeQ),
          catalog_id: selectedRow?.id,
          uom: selectedRow.uom?.name || "",
          qty: selectedRow.qty,
          pr_request: this.pr_request,
          product_requestfor: this.prrequestvalue,
          supplier: {
            code: selectedRow.supplierbranch?.code,
            id: selectedRow.supplierbranch?.id,
            name: selectedRow.supplierbranch?.name,
          },
          // pr_request: selectedRow.pr_request,
          supplier_id: selectedRow?.supplierbranch?.id,
          quotation_id: selectedRow?.quotation?.[0].quotation_id || 0,
          quotationdetail_id: selectedRow?.quotation?.[0].id || 0,
          producttype: this.prodDict,
          product: this.branchForm.get("product").value,
          make: selectedRow.make,
          model: selectedRow.model,
          spec_config: {
            specification: Object.entries(selectedRow.configuration || {})
              .map(([key, value]) => `${key}: ${value}`)
              .join(", "),
          },
          unit_price: Number(selectedRow.unitprice),
          amount: Number(selectedRow.amount),
          prccbs,
        };
      }),
    };

    // console.log("this.prccbs", this.prccbs);
    // Prepare the payload
    // const payload = this.selectedRows.map(row => ({
    //   product_id: row.id,
    //   qty: row.qty,
    //   unit_price: row.unitprice,
    //   amount: row.amount,
    //   vendor: row.supplierbranch?.name,
    //   model: row.model?.name,
    //   make: row.make?.name,
    //   specifications: row.specifications
    // }));

    // console.log("Final Payload:", payload);

    // Submit payload (Replace with actual API call)
    let orgnlpayload:any
    let payload2 = {
       delete_con_bpa_no:{
        id:this.idUnchecked
      },
      is_draft:this.draft_id
    }
    if(this.isdraftSubmit){
      orgnlpayload = {...payload , ...payload2}
    }
    else {
  orgnlpayload = { ...payload } as any;;

  const hasInvalidPrccbs = (orgnlpayload.prdetails || []).some(detail => {
    return !detail.prccbs || detail.prccbs.length === 0;
  });

  if (hasInvalidPrccbs) {
    this.notification.showError('Please Enter CCBS Details');
    return;
  }

  console.log("payloads", orgnlpayload);
}

    
    console.log("payloads",orgnlpayload)
    this.showSpinner();
    this.prposervice.submitPrice(orgnlpayload).subscribe(
      (response) => {
        this.hideSpinner();
        if (response["message"]) {
          this.notification.showSuccess(response["message"]);
          this.prccbssaved = false;
        }
        this.selectedRows = []; // Clear selected rows after submission
        this.qty.controls.forEach((control) => control.setValue("")); // Reset input fields
        this.showData = false;
        this.branchForm.reset(); // Reset the form
        this.rows.clear(); // Clear the rows in the form array
        this.selected = []; // Clear selected rows
        this.specList = [];
        this.idUnchecked = [];
        this.selectedTypeQ = "";
        this.ngOnInit(); //
      },
      (error) => {
        this.notification.showError(
          "Error while submitting! Please try again."
        );
      }
    );
  }

  // makeCheckk(data) {
  //   this.is_model = data.model_check;
  //   this.make_id = data?.id;
  //   if(this.is_model == false){
  //     this.branchForm.get("unitprice").setValue(data.unitprice);
  //     this.branchForm.get("uom").setValue(data.uom);
  //     // this.calAmt();

  //   } else {
  //     this.branchForm.get("unitprice").setValue("");
  //     this.branchForm.get("uom").setValue("");
  //   }
  // }
  calAmt() {
    let qty = this.branchForm.get("qty").value;
    let unitprice = this.branchForm.get("unitprice").value;
    let total = qty * unitprice;
    this.branchForm.get("amount").setValue(total);
  }
  getitem() {
    // this.SpinnerService.show();
    this.MAKE = true;
    console.log("data", this.MAKE);
    let product = this.branchForm.value.product.id;
    let commodity = this.branchForm.value.commodity.id;
    let dts = this.branchForm.value.dts;
    let supplier = this.branchForm.value.supplier.id;
    this.spinnerservice.show();
    if (
      // supplier == undefined ||
      product == undefined
      // commodity == undefined
    ) {
      this.notification.showError("Kindly Choose Supplier and Product");
      this.spinnerservice.hide();
      return false;
    } else {
      // this.prposervice.getServiceUnitPrice(product,supplier ,dts, this.product_type, 1)
      // .subscribe(
      this.prposervice.getitemsDependencyFK(product, 0, supplier).subscribe(
        (results: any[]) => {
          this.spinnerservice.hide();
          this.isLoading = false;
          let datas = results["data"];
          let data = results;

          //BUG ID:8452
          this.currentpageitem = 1;
          this.has_nextitem = true;
          this.has_previousitem = true;
          //

          // if (datas?.length == 0) {
          //   this.notification.showInfo("No Records Found")
          // }
          if (datas.length == 0) {
            this.notification.showError("No data is there against make");
            this.branchForm.patchValue({
              unitprice: datas[0].unitprice,
              uom: datas[0].uom,
            });
          } else {
            this.itemList = datas;
          }

          console.log("product", datas);
          //BUG ID:6902
          // if (data['description'] === "Kindly Choose Other Item") {
          //   this.SpinnerService.hide()
          //   this.notification.showError("Kindly Choose Other Item")
          // }
          if (
            data["description"] === "The Product Doesn't Have a Valid Catalog"
          ) {
            this.spinnerservice.hide();
            this.notification.showError(
              "The Product Doesn't Have a Valid Catalog"
            );
          }

          //BUG ID:6902
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
    }
  }
  // autocompleteitemScroll() {
  //   console.log("has next of item==>", this.has_nextitem);
  //   setTimeout(() => {
  //     if (
  //       this.matitemAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matitemAutocomplete.panel
  //     ) {
  //       fromEvent(this.matitemAutocomplete.panel.nativeElement, "scroll")
  //         .pipe(
  //           map((x) => this.matitemAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.matitemAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.matitemAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.matitemAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_nextitem === true) {
  //               this.prposervice
  //                 .getitemsDependencyFKdd(
  //                   this.branchForm.value.product.id,
  //                   this.branchForm.value.dts,
  //                   this.itemInput.nativeElement.value,
  //                   this.branchForm.value.supplier,
  //                   this.currentpageitem + 1
  //                 )
  //                 .subscribe(
  //                   (results: any[]) => {
  //                     let datas = results["data"];
  //                     let datapagination = results["pagination"];
  //                     this.itemList = this.itemList.concat(datas);
  //                     if (this.itemList.length >= 0) {
  //                       this.has_nextitem = datapagination.has_next;
  //                       this.has_previousitem = datapagination.has_previous;
  //                       this.currentpageitem = datapagination.index;
  //                     }
  //                   },
  //                   (error) => {
  //                     this.errorHandler.handleError(error);
  //                     this.spinnerservice.hide();
  //                   }
  //                 );
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  // makeCheck(data, i, row) {
  //   this.is_model = data.model_check;
  //   this.checkboxvalidation(i, row);
  //   if (!this.is_model) {
  //     this.notification.showInfo("No Model specified!");
  //   }

  //   if (this.is_model) {
  //     row.get("models").enable();
  //   }
  // }
  // public displayFnitem(item?: itemsLists): string | undefined {
  //   return item ? item.make.name : undefined;
  // }
  public displayFnitemm(item?: itemList): string | undefined {
    return item ? item.name : undefined;
  }
  getmodal() {
    // this.SpinnerService.show();
    let product = this.branchForm.value.product.id;
    let commodity = this.branchForm.value.commodity.id;
    let dts = this.branchForm.value.dts;
    let supplier = this.branchForm.value.supplier.id;
    let makeId = this.branchForm.value.items.make.id;
    let make = this.branchForm.value.items.make;
    if (this.is_model == false) {
      this.notification.showInfo("No Model Specified!");

      return;
    }
    this.spinnerservice.show();
    if (
      supplier == undefined ||
      product == undefined ||
      commodity == undefined ||
      make == undefined
    ) {
      this.notification.showError("Kindly Choose Product Name and Make");
      this.spinnerservice.hide();
      return false;
    } else {
      this.prposervice
        .getmodalDependency(product, supplier, dts, makeId)
        .subscribe(
          (results: any[]) => {
            this.spinnerservice.hide();
            this.isLoading = false;

            let datas = results["data"];
            let data = results;
            // this.modelID = datas[0].model.id;
            // this.modellname = datas[0].model.name;

            this.currentpagemodel = 1;
            this.has_nextmodel = true;
            this.has_previousmodel = true;

            if (datas?.length == 0) {
              this.notification.showInfo("No Records Found");
            }
            this.modelList = datas;
            console.log("product", datas);

            if (
              data["description"] === "The Product Doesn't Have a Valid Catalog"
            ) {
              this.spinnerservice.hide();
              this.notification.showError(
                "The Product Doesn't Have a Valid Catalog"
              );
            }

            //BUG ID:6902
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.spinnerservice.hide();
          }
        );
    }
  }
  getmodall() {
    // this.SpinnerService.show();
    // let product = this.prForm.value.product.id;
    // let commodity = this.prForm.value.commodity.id;
    // let dts = this.prForm.value.dts;
    // let supplier = this.prForm.value.supplier.id;
    // let makeId = this.prForm.value.items.make.id;
    // let make = this.prForm.value.items.make;

    this.spinnerservice.show();
    if (this.make_id == undefined || this.make_id == "") {
      this.notification.showError("Choose Make!");
      this.spinnerservice.hide();
      return false;
    } else {
      this.prposervice.getModal(this.product_code, this.make_id, 1).subscribe(
        (results: any[]) => {
          this.spinnerservice.hide();
          this.isLoading = false;

          let datas = results["data"];
          let data = results;
          // this.modelID = datas[0].model.id;
          // this.modellname = datas[0].model.name;

          this.currentpagemodel = 1;
          this.has_nextmodel = true;
          this.has_previousmodel = true;

          if (datas?.length == 0) {
            this.notification.showInfo("No Records Found");
          }
          this.modelList = datas;
          console.log("product", datas);

          if (
            data["description"] === "The Product Doesn't Have a Valid Catalog"
          ) {
            this.spinnerservice.hide();
            this.notification.showError(
              "The Product Doesn't Have a Valid Catalog"
            );
          }

          //BUG ID:6902
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
    }
  }
  // getmodall(index: number) {
  //   const type = this.branchForm.get("type").value;
  //   const commodity_id = this.branchForm.get("commodity").value.id;
  //   const employee_id = this.branchForm.get("employee_id").value.id;
  //   if (type === "" || type === null || type === undefined) {
  //     this.notification.showError("Catalog/Non Catalog is mandatory");
  //     return;
  //   }

  //   if (
  //     commodity_id === "" ||
  //     commodity_id === null ||
  //     commodity_id === undefined
  //   ) {
  //     this.notification.showError("Commodity is mandatory");
  //     return;
  //   }
  //   if (
  //     employee_id === "" ||
  //     employee_id === null ||
  //     employee_id === undefined
  //   ) {
  //     this.notification.showError("Approver name is mandatory");
  //     return;
  //   }
  //   // Retrieve the specific control at the provided index
  //   let formArray = this.branchForm.get("rows") as FormArray;
  //   let element = formArray.at(index);

  //   // Get the required form control values
  //   const product = element.get("product_id").value;
  //   let supplier = element.get("supplier").value.id;
  //   let make = element.get("items").value.make.id;

  //   this.spinnerservice.show();

  //   // Validate the required fields
  //   if (!supplier || !make) {
  //     this.notification.showError("Kindly Choose Supplier Name and Make");
  //     this.spinnerservice.hide();
  //     return false;
  //   }

  //   // Call the service to get the modal dependency
  //   this.prposervice
  //     .getmodalDependency(product, supplier, this.dts, make)
  //     .subscribe(
  //       (results: any[]) => {
  //         this.spinnerservice.hide();
  //         let datas = results["data"];
  //         let data = results;

  //         this.modelID = datas[0].model.id;
  //         this.modellname = datas[0].model.name;

  //         this.currentpagemodel = 1;
  //         this.has_nextmodel = true;
  //         this.has_previousmodel = true;

  //         // Check if no records are found
  //         if (datas?.length == 0) {
  //           this.notification.showInfo("No Records Found");
  //         }

  //         this.modelList = datas;
  //         console.log("product", datas);

  //         // Check if there is a description error
  //         if (data["description"]) {
  //           this.spinnerservice.hide();
  //           this.notification.showError(
  //             "The Product Doesn't Have a Valid Catalog"
  //           );
  //         }
  //       },
  //       (error) => {
  //         this.errorHandler.handleError(error);
  //         this.spinnerservice.hide();
  //       }
  //     );
  // }

  // getmodall(index) {
  //   // this.SpinnerService.show();
  //   let product = this.prForm.value.product.id
  //   let commodity = this.prForm.value.commodity.id
  //   let dts = this.prForm.value.dts
  //   let supplier = this.prForm.value.supplier.id
  //   let makeId = this.prForm.value.items.make.id
  //   let make = this.prForm.value.items.make

  //   this.spinnerservice.show();
  //   if (supplier==undefined || product==undefined || commodity==undefined || make==undefined) {
  //     this.notification.showError("Kindly Choose Product Name and Make")
  //     this.spinnerservice.hide()
  //     return false
  //   }
  //   else
  //   {
  //   this.prposervice.getmodalDependency(product,supplier,dts,makeId)
  //     .subscribe((results: any[]) => {
  //       this.spinnerservice.hide();
  //       let datas = results["data"];
  //       let data=results
  //       this.modelID = datas[0].model.id
  //       this.modellname = datas[0].model.name

  //       this.currentpagemodel = 1
  //       this.has_nextmodel = true;
  //       this.has_previousmodel = true;

  //       if (datas?.length == 0) {
  //         this.notification.showInfo("No Records Found")

  //       }
  //       this.modelList = datas;
  //       console.log("product", datas)

  //       if (data['description']) {
  //         this.spinnerservice.hide()
  //         this.notification.showError("The Product Doesn't Have a Valid Catalog")
  //       }

  //               //BUG ID:6902

  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.spinnerservice.hide();
  //     })
  //   }
  // }
  public displayFnmodel(model?: modelsLists): string | undefined {
    return model ? model.model.name : undefined;
  }
  public displayFnmodell(model?: modelsList): string | undefined {
    return model ? model.name : undefined;
  }
  autocompletemodelScroll() {
    console.log("has next of model==>", this.has_nextmodel);
    setTimeout(() => {
      if (
        this.matmodelAutocomplete &&
        this.autocompleteTrigger &&
        this.matmodelAutocomplete.panel
      ) {
        fromEvent(this.matmodelAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matmodelAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matmodelAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matmodelAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matmodelAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextmodel === true) {
                this.prposervice
                  .getmodelDependencyFKdd(
                    this.branchForm.value.product.id,
                    this.branchForm.value.dts,
                    this.branchForm.value.items.id,
                    this.branchForm.value.supplier,
                    this.currentpagemodel + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.modelList = this.modelList.concat(datas);
                      if (this.modelList.length >= 0) {
                        this.has_nextmodel = datapagination.has_next;
                        this.has_previousmodel = datapagination.has_previous;
                        this.currentpagemodel = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.spinnerservice.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  getspecs(index: number) {
    const type = this.branchForm.get("type").value;
    const commodity_id = this.branchForm.get("commodity").value.id;
    const employee_id = this.branchForm.get("employee_id").value.id;
    if (type === "" || type === null || type === undefined) {
      this.notification.showError("Catalog/Non Catalog is mandatory");
      return;
    }

    if (
      commodity_id === "" ||
      commodity_id === null ||
      commodity_id === undefined
    ) {
      this.notification.showError("Commodity is mandatory");
      return;
    }
    if (
      employee_id === "" ||
      employee_id === null ||
      employee_id === undefined
    ) {
      this.notification.showError("Approver name is mandatory");
      return;
    }
    // Retrieve the specific control at the provided index
    let formArray = this.branchForm.get("rows") as FormArray;
    let element = formArray.at(index);

    // Get the required form control values
    let product = element.get("product_id").value;
    let supplier = element.get("supplier").value.id;
    let make = element.get("items").value.make.id;
    let model = element.get("models").value.model.id;

    this.spinnerservice.show();

    // Validate the required fields
    if (!supplier || !make || !model) {
      this.notification.showError("Kindly Choose Make and Model");
      this.spinnerservice.hide();
      return false;
    }

    // Call the service to get the specs dependency
    this.prposervice
      .getspecsDependency(product, supplier, this.dts, make, model)
      .subscribe(
        (results: any[]) => {
          this.spinnerservice.hide();
          let datas = results["data"];
          let data = results;

          this.currentpagespecs = 1;
          this.has_nextspecs = true;
          this.has_previousspecs = true;

          // Check if no records are found
          if (datas?.length == 0) {
            this.notification.showInfo("No Records Found");
          }

          this.specsList = datas;
          console.log("product", datas);

          // Check if there is a description error
          if (data["description"]) {
            this.spinnerservice.hide();
            this.notification.showError(
              "The Product Doesn't Have a Valid Catalog"
            );
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
  }

  // getspecs(index) {
  //   // this.SpinnerService.show();
  //   let product = this.prForm.value.product.id
  //   let commodity = this.prForm.value.commodity.id
  //   let dts = this.prForm.value.dts
  //   let supplier = this.prForm.value.supplier.id
  //   let make = this.prForm.value.items.make.id
  //   let model = this.prForm.value.models.model.id
  //   this.spinnerservice.show();
  //   if (supplier==undefined || product==undefined || commodity == undefined || make == undefined || model == undefined) {
  //     this.notification.showError("Kindly Choose Make and Model")
  //     this.spinnerservice.hide()
  //     return false
  //   }
  //   else
  //   {
  //   this.prposervice.getspecsDependency(product,supplier,dts,make,model)
  //     .subscribe((results: any[]) => {
  //       this.spinnerservice.hide();
  //       let datas = results["data"];
  //       let data=results
  //       // this.conunitprice=datas[0].unitprice

  //       this.currentpagespecs = 1
  //       this.has_nextspecs = true;
  //       this.has_previousspecs = true;

  //       if (datas?.length == 0) {
  //         this.notification.showInfo("No Records Found")
  //       }

  //       this.specsList = datas;
  //       console.log("product", datas)

  //       if (data['description'] ===  "The Product Doesn't Have a Valid Catalog") {
  //         this.spinnerservice.hide()
  //         this.notification.showError("The Product Doesn't Have a Valid Catalog")
  //       }

  //               //BUG ID:6902

  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.spinnerservice.hide();
  //     })
  //   }
  // }
  public displayFnspecs(spec?: specsLists): string | undefined {
    return spec ? spec.configuration : undefined;
  }
  public displayFnspecss(spec?: specsList): string | undefined {
    return spec ? spec.specification : undefined;
  }

  autocompletespecsScroll() {
    console.log("has next of spec==>", this.has_nextspecs);
    setTimeout(() => {
      if (
        this.matspecsAutocomplete &&
        this.autocompleteTrigger &&
        this.matspecsAutocomplete.panel
      ) {
        fromEvent(this.matspecsAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matspecsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matspecsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matspecsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matspecsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextspecs === true) {
                this.prposervice
                  .getspecsDependencyFKdd(
                    this.branchForm.value.product.id,
                    this.branchForm.value.dts,
                    this.branchForm.value.items.id,
                    this.branchForm.value.supplier,
                    this.branchForm.value.models.id,
                    this.currentpagespecs + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.specsList = this.specsList.concat(datas);
                      // this.conunitprice=datas[0].unitprice
                      if (this.specsList.length >= 0) {
                        this.has_nextspecs = datapagination.has_next;
                        this.has_previousspecs = datapagination.has_previous;
                        this.currentpagespecs = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.spinnerservice.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  patchunitprice(data) {
    // this.spec = data.model_check;
    // this.make_id = data?.id;
    // if(this.is_model == false){
    this.branchForm.get("unitprice").setValue(data.unitprice);
    this.branchForm.get("uom").setValue(data.uom);
    // this.calculateAmount(this.branchForm);
    // this.calAmt();

    // } else {
    //   this.branchForm.get("unitprice").setValue("");
    // }
  }
  getspecss() {
    // this.SpinnerService.show();
    let product = this.branchForm.value.product.id;
    let commodity = this.branchForm.value.commodity.id;
    let dts = this.branchForm.value.dts;
    let supplier = this.branchForm.value.supplier.id;
    let make = this.branchForm.value.items.make.id;
    let model = this.branchForm.value.models.model.id;
    this.spinnerservice.show();
    if (this.configuration == false) {
      this.notification.showError("No Configuration Specified!");
      this.spinnerservice.hide();
      return;
    }
    if (
      supplier == undefined ||
      product == undefined ||
      commodity == undefined ||
      make == undefined ||
      model == undefined
    ) {
      this.notification.showError("Kindly Choose Make and Model");
      this.spinnerservice.hide();
      return false;
    } else {
      this.prposervice
        .getspecsDependency(product, supplier, dts, make, model)
        .subscribe(
          (results: any[]) => {
            this.spinnerservice.hide();
            this.isLoading = false;

            let datas = results["data"];
            let data = results;
            // this.conunitprice=datas[0].unitprice

            this.currentpagespecs = 1;
            this.has_nextspecs = true;
            this.has_previousspecs = true;

            if (datas?.length == 0) {
              this.notification.showInfo("No Records Found");
            }

            this.specsList = datas;
            console.log("product", datas);

            if (
              data["description"] === "The Product Doesn't Have a Valid Catalog"
            ) {
              this.spinnerservice.hide();
              this.notification.showError(
                "The Product Doesn't Have a Valid Catalog"
              );
            }

            //BUG ID:6902
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.spinnerservice.hide();
          }
        );
    }
  }
  getUnitPricee(data) {}
  getUnitPrice(data, index, row, id) {
    this.checkconfiguration = data.configuration_check;
    console.log(this.checkconfiguration, "data");
    this.checkboxvalidation(index, row);
    if (id == 1) {
      if (!this.checkconfiguration) {
        this.notification.showInfo("No Configuration specified!");
      }
    }
    if (this.checkconfiguration) {
      row.get("specs").enable();
    }
    let formArray = this.branchForm.get("rows") as FormArray;
    let element = formArray.at(index);

    // if(this.configuration==true){
    element.patchValue({
      unitprice: data.unitprice,
    });
    formArray.controls.forEach((row: FormGroup) => {
      this.calculateAmount(row); // Calculate amount when quantity changes
      // this.calculateTotalAmount();
    }); // this.config = true;
    // }
  }
  getuom() {
    this.prposervice.getuomFK("").subscribe((results: any[]) => {
      let datas = results["data"];
      this.uomlist = datas;
    });
  }
  uomScroll() {
    setTimeout(() => {
      if (
        this.matuomAutocomplete &&
        this.matuomAutocomplete &&
        this.matuomAutocomplete.panel
      ) {
        fromEvent(this.matuomAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matuomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matuomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matuomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matuomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.prposervice
                  .getuomFKdd(
                    this.uomInput.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.uomlist.length >= 0) {
                      this.uomlist = this.uomlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  public displayFnuom(uomtype?: any): string | undefined {
    if (typeof uomtype === "string") {
      return uomtype;
    }
    return uomtype ? uomtype?.name : undefined;
  }

  get uomtype() {
    return this.branchForm.get("uom");
  }
  getPrccbsIndex() {
    // this.selectedCCBSindex = index
    // console.log("this.selectedCCBSindex", this.selectedCCBSindex)
  }

  public displayFnbs(bs?: bslistss): any | undefined {
    if (typeof bs === "string") {
      return bs;
    }
    return bs ? bs.name : undefined;
  }

  getbsdd(index, ccbsindex) {
    const rows = this.branchForm.get("rows") as FormArray;
    const rowGroup = rows.at(index) as FormGroup;
    const prccbs = rowGroup.get("prccbs") as FormArray;
    const group = prccbs.at(ccbsindex) as FormGroup;
    group.get("bs").reset();
    group.get("cc").reset();

    this.spinnerservice.show();
    this.prposervice.getbsvaluedd().subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.spinnerservice.hide();
        this.bslist = datas;
        console.log("bslist", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }

  autocompletebsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.autocompleteTrigger &&
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
              if (this.has_nextbs === true) {
                this.prposervice
                  .getbsFKdd(
                    this.bsInput.nativeElement.value,
                    this.currentpagebs + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.bslist = this.bslist.concat(datas);
                      if (this.bslist.length >= 0) {
                        this.has_nextbs = datapagination.has_next;
                        this.has_previousbs = datapagination.has_previous;
                        this.currentpagebs = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.spinnerservice.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  getccValue(index, ccbsindex) {
    const rows = this.branchForm.get("rows") as FormArray;
    const rowGroup = rows.at(index) as FormGroup;
    const prccbs = rowGroup.get("prccbs") as FormArray;
    const group = prccbs.at(ccbsindex) as FormGroup;

    const bsid = group.get("bs").value.id;

    this.spinnerservice.show();
    this.prposervice.getcclistDependentBs(bsid).subscribe(
      (result) => {
        let datas = result["data"];
        this.spinnerservice.hide();
        if (datas.length == 0) {
          this.spinnerservice.hide();
          this.notification.showInfo("No Records Found");
        }
        this.cclist = result["data"];
        console.log("cc", this.cclist);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }
  public displayFncc(cc?: cclistss): any | undefined {
    if (typeof cc === "string") {
      return cc;
    }
    return cc ? cc.name : undefined;
  }
  setupValueChanges(index: number) {
    if (this.catalogtypeid === 1) {
      const rows = this.branchForm.get("rows") as FormArray;
      const group = rows.at(index) as FormGroup;
      const supplierControl = group.get("supplier");
      const product = group.get("product_id").value;

      if (supplierControl) {
        const sub = supplierControl.valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap((value) =>
              this.prposervice
                .getsupplierDependencyFKdd(product, this.dts, value, 1)
                .pipe(
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
              this.spinnerservice.hide();
            }
          );

        this.subscriptions.push(sub);
      }
    }
    if (this.catalogtypeid === 2) {
      const rows = this.branchForm.get("rows") as FormArray;
      const group = rows.at(index) as FormGroup;
      const supplierControl = group.get("supplier");
      const product = group.get("product_id").value;

      if (supplierControl) {
        const sub = supplierControl.valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap((value) =>
              this.prposervice.getsupplierDependencyFKdd1(value, 1).pipe(
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
              this.spinnerservice.hide();
            }
          );

        this.subscriptions.push(sub);
      }
    }
  }
  autocompleteccScroll() {}
  patchAmount(id) {
    const rowsArray = this.branchForm.get("rows") as FormArray;
    if (id === 1) {
      rowsArray.controls.forEach((row: FormGroup) => {
        row
          .get("unitprice")
          .valueChanges.pipe(
            debounceTime(300), // Debounce time for smooth user experience
            distinctUntilChanged() // Only emit if the value has changed
          )
          .subscribe(() => {
            this.calculateAmount(row); // Calculate amount when quantity changes
            // this.calculateTotalAmount();
          });
      });
    }
    if (id === 2) {
      rowsArray.controls.forEach((row: FormGroup) => {
        row
          .get("qty")
          .valueChanges.pipe(
            debounceTime(300), // Debounce time for smooth user experience
            distinctUntilChanged() // Only emit if the value has changed
          )
          .subscribe(() => {
            this.calculateAmount(row); // Calculate amount when quantity changes
            // this.calculateTotalAmount();
          });
      });
    }
  }
  calculateAmount(row: FormGroup) {
    const quantity = row.get("qty").value;
    const unitprice = row.get("unitprice").value;

    // Perform calculation if both quantity and unitprice are valid numbers
    if (
      quantity !== null &&
      unitprice !== null &&
      !isNaN(quantity) &&
      !isNaN(unitprice)
    ) {
      const calculatedAmount = quantity * unitprice;
      row.patchValue({ amount: calculatedAmount }, { emitEvent: false });
    }
  }
  calculateTotalAmount(amountToAdjust: number = 0) {
    this.total_amount = 0;

    const rowsArray = this.branchForm.get("rows") as FormArray;

    rowsArray.controls.forEach((row: FormGroup) => {
      const amount = row.get("amount")?.value;

      if (amount !== null && !isNaN(amount)) {
        this.total_amount += amount;
      }
    });

    this.total_amount += amountToAdjust;
    console.log("Updated total amount:", this.total_amount);
  }
  // addccbcBranch(index, row) {
  //   console.log(index, "index");
  //   console.log(row, "row");
  //   console.log(this.ccbsdata[index], " this.ccbsdata");
  //   console.log(this.ccbsdata[index].branch_id.fullname, " fullname");

  //   const rows = this.branchForm.get('rows') as FormArray;
  //   const rowGroup = rows.at(index) as FormGroup;
  //   const prccbs = rowGroup.get('prccbs') as FormArray;

  //   // Clear existing FormArray entries
  //   prccbs.clear();

  //   // Iterate over ccbsdata and add values to prccbs FormArray
  //   const ccbsItem = this.ccbsdata[index];
  //   const group = this.fb.group({
  //     branch_id: [ccbsItem.branch_id, Validators.required],
  //     bs: [ccbsItem.bs, Validators.required],
  //     cc: [ccbsItem.cc, Validators.required],
  //     qty: [ccbsItem.qty, Validators.required],
  //     // id: [''] // Add other controls as needed
  //   });
  //   prccbs.push(group);
  //   // Log the form array to verify values
  //   console.log("Updated prccbs form array:", prccbs.value);

  //   // Manually trigger change detection
  // }
  requestedQty: any;
  popuname: any = "";
  // addccbcBranch(index, row) {
  //   console.log(index, "index");
  //   console.log(row, "row");
  //   // if (row.value.checked === true) {
  //   //   this.notification.showInfo("Please Unselect a Record & Proceed!");
  //   //   return;
  //   // }
  //   this.currentRowIndex = index; // Store the index of the current row
  //   console.log(this.ccbsdata[index], " this.ccbsdata");
  //   this.requestedQty = row.value.qty;
  //   // console.log(this.ccbsdata[index].branch_id.fullname," fullname")
  //   const rows = this.branchForm.get('rows') as FormArray;
  //   const rowGroup = rows.at(index) as FormGroup;
  //   const prccbs = rowGroup.get('prccbs') as FormArray;
  //   const group = prccbs.at(0) as FormGroup;
  //   this.popuname = "popup_" + index;
  //   group.patchValue({
  //   //     // branch_id:this.branchForm.get('branch').value,
  //   //     branch_id:this.ccbsdata[index].branch_id,
  //   //     bs:this.ccbsdata[index].bs,
  //   //     cc:this.ccbsdata[index].cc,
  //       qty:this.requestedQty
  //     });
  //   this.showpopup = true;
  // }
  get supplierRows(): FormArray {
    return this.branchForm.get("supplierRows") as FormArray;
  }

  // addccbcBranch(index: number, row: FormGroup) {
  //   console.log(index, "index");
  //   console.log(row, "row value");

  //   if(this.qty.controls[index].value == null || this.qty.controls[index].value == undefined || this.qty.controls[index].value == ""){
  //     this.notification.showInfo("Please Enter Allocated Quantity!");
  //     return;
  //   }
  //   // qty.controls[i].value
  //   // if(this.qty['controls']?.value[index] == null || this.qty[index]?.value == undefined || this.qty[index]?.value == ""){
  //   //   this.notification.showInfo("Please Enter Allocated Quantity!");
  //   //   return;
  //   // }
  //   this.currentRowIndex = index;
  //   this.popuname = "popup_" + index;

  //   // Access supplierRows instead of rows

  //   this.showpopup = true;
  //   // this.setupQuantityListeners(); // ✅ Ensure dynamic updates for all rows

  // }
  alloc_qty: any;
  addccbcBranch(index: number, qty, row: FormGroup) {
    console.log(index, "index");
    console.log(row, "row value");

    if (
      this.qty.controls[index].value == null ||
      this.qty.controls[index].value == undefined ||
      this.qty.controls[index].value == ""
    ) {
      this.notification.showInfo("Please Enter Allocated Quantity!");
      return;
    }

    this.currentRowIndex = index;
    this.popuname = "popup_" + index;
    this.showpopup = true;
    this.alloc_qty = qty;
    // const rowsArray = this.rows as FormArray;
    // if (!rowsArray) return;

    // rowsArray.controls.forEach((row: AbstractControl) => {
    //   const prccbsArray = row.get('prccbs') as FormArray;

    // // ✅ Patch req_qty only if it's different from blc_qty
    // // const prccbsArray = row.get('prccbs') as FormArray;
    // if (prccbsArray) {
    //   prccbsArray.controls.forEach((group: AbstractControl) => {
    //     const reqQty = group.get('req_qty')?.value || 0;
    //     const blcQty = group.get('blc_qty')?.value || 0;

    //     if (blcQty !== reqQty) {
    //       group.patchValue({ req_qty: blcQty }, { emitEvent: false });
    //     }
    //      if (blcQty !== reqQty) {
    //       group.patchValue({ blc_qty: reqQty }, { emitEvent: false });
    //     }
    //   });
    // }
    //   });
  }

  // addccbcBranch(index: number, row: FormGroup) {
  //   console.log(index, "index");
  //   console.log(row.value, "row value");

  //   this.currentRowIndex = index;
  //   this.popuname = "popup_" + index;

  //   const supplierGroup = this.rows.at(index) as FormGroup;
  //   const prccbs = supplierGroup.get('prccbs') as FormArray;

  //   // Push new CCBS data into prccbs
  //   this.ccbsdata.forEach((ccbs, i) => {
  //     const ccbsGroup = new FormGroup({
  //       branch_id: new FormControl(ccbs.branch_id || ''),
  //       bs: new FormControl(ccbs.bs || ''),
  //       cc: new FormControl(ccbs.cc || ''),
  //       req_qty: new FormControl(ccbs.qty || 0), // Requested Quantity
  //       blc_qty: new FormControl(ccbs.qty || 0), // Initial Balance Quantity
  //       qty: new FormControl('', Validators.required) // Quantity Input
  //     });

  //     // Listen for changes in 'qty' for this specific CCBS row
  //     ccbsGroup.get('qty')?.valueChanges.subscribe((enteredQty) => {
  //       const reqQty = ccbsGroup.get('req_qty')?.value || 0;
  //       const balanceQty = Math.max(0, reqQty - (enteredQty || 0)); // Prevent negative values

  //       ccbsGroup.patchValue({ blc_qty: balanceQty }, { emitEvent: false });
  //     });

  //     prccbs.push(ccbsGroup);
  //   });

  //   this.showpopup = true;
  // }
hideBackdrop() {
  const body = document.body;
  this.renderer.removeClass(body, "modal-open");

  const backdrops = document.querySelectorAll(".modal-backdrop");
  backdrops.forEach((bd) => {
    if (bd.parentNode) {
      bd.parentNode.removeChild(bd);
    }
  });

  // Optional: reset scroll locking
  body.style.overflow = "";
}

  multipleCCBS() {
    const newRow = this.fb.group({
      ccbsbranch: ["", Validators.required],
      bs: ["", Validators.required],
      cc: ["", Validators.required],
      ccbsqty: ["", Validators.required],
      // Include other specific form controls as needed
    });

    // Access the FormArray and push the new FormGroup
    const rowsArray = this.branchForm.get("rows") as FormArray;
    rowsArray.push(newRow);
  }
  // updateBalanceQuantity() {
  //   const rowsArray = this.branchForm.get('rows') as FormArray;
  //   if (!rowsArray) return;

  //   rowsArray.controls.forEach((row: AbstractControl) => {
  //     const prccbsArray = row.get('prccbs') as FormArray;

  //     prccbsArray.controls.forEach((group: AbstractControl) => {
  //       const reqQty = group.get('req_qty')?.value || 0;
  //       let enteredQty = group.get('qty')?.value || 0;

  //       // Prevent enteredQty from exceeding reqQty
  //       if (enteredQty > reqQty) {
  //         enteredQty = reqQty; // Reset to max allowed
  //         this.notification.showError(`Quantity cannot exceed Requested Quantity (${reqQty})!`);
  //         group.patchValue({ qty: reqQty }, { emitEvent: false });
  //       }

  //       const balanceQty = Math.max(0, reqQty - enteredQty); // Ensure non-negative balance
  //       group.patchValue({ blc_qty: balanceQty }, { emitEvent: false });
  //     });
  //   });
  //   // this.setupQuantityListeners();
  // }
  // updateBalanceQuantity() {
  //   const rowsArray = this.branchForm.get('rows') as FormArray;
  //   if (!rowsArray) return;

  //   rowsArray.controls.forEach((row: AbstractControl) => {
  //     const prccbsArray = row.get('prccbs') as FormArray;

  //     prccbsArray.controls.forEach((group: AbstractControl) => {
  //       const reqQty = group.get('req_qty')?.value || 0;
  //       const blcQty = group.get('blc_qty')?.value || 0;
  //       let enteredQty = group.get('qty')?.value || 0;

  //       // Prevent enteredQty from exceeding blcQty
  //       if (enteredQty > blcQty) {
  //         enteredQty = blcQty;
  //         this.notification.showError(`Quantity cannot exceed Balance Quantity (${blcQty})!`);
  //         group.patchValue({ qty: blcQty }, { emitEvent: false });
  //       }

  //       const balanceQty = Math.max(0, reqQty - enteredQty);
  //       group.patchValue({ blc_qty: balanceQty }, { emitEvent: false });
  //     });
  //   });
  // }
  updateBalanceQuantity() {
    const rowsArray = this.branchForm.get("rows") as FormArray;
    if (!rowsArray) return;

    rowsArray.controls.forEach((row: AbstractControl) => {
      const prccbsArray = row.get("prccbs") as FormArray;

      prccbsArray.controls.forEach((group: AbstractControl) => {
        const masterBlcQty = group.get("master_blc_qty")?.value ?? 0;
        let enteredQty = group.get("qty")?.value || 0;

        // Prevent over-entry
        if (enteredQty > masterBlcQty) {
          enteredQty = masterBlcQty;
          this.notification.showError(
            `Quantity cannot exceed Balance Quantity (${masterBlcQty})!`
          );
          group.patchValue({ qty: masterBlcQty }, { emitEvent: false });
        }

        // Correct balance calculation
        const remainingQty = Math.max(0, masterBlcQty - enteredQty);
        group.patchValue({ blc_qty: remainingQty }, { emitEvent: false });
      });
    });
  }

  // updateBalanceQuantity() {
  //   const rowsArray = this.branchForm.get('rows') as FormArray;
  //   if (!rowsArray) return;

  //   rowsArray.controls.forEach((row: AbstractControl) => {
  //     const prccbsArray = row.get('prccbs') as FormArray;

  //     prccbsArray.controls.forEach((group: AbstractControl) => {
  //       const blcQty = group.get('blc_qty')?.value || 0;
  //       let enteredQty = group.get('qty')?.value || 0;

  //       if (enteredQty > blcQty) {
  //         enteredQty = blcQty;
  //         this.notification.showError(`Quantity cannot exceed Balance Quantity (${blcQty})!`);
  //         group.patchValue({ qty: blcQty }, { emitEvent: false });
  //       }

  //       // ❌ Removed re-calculation of blc_qty
  //       // Because it should only be changed during save/sync
  //     });
  //   });
  // }

  setupQuantityListeners() {
    const rowsArray = this.rows as FormArray;
    if (!rowsArray) return;

    rowsArray.controls.forEach((row: AbstractControl) => {
      const prccbsArray = row.get("prccbs") as FormArray;

      prccbsArray.controls.forEach((group: AbstractControl) => {
        group.get("qty")?.valueChanges.subscribe(() => {
          this.updateBalanceQuantity(); // Auto-update balance qty
        });
      });
    });
  }
  ccbsState: { [index: number]: any[] } = {};
  ccbsBalanceState: { [index: number]: number[] } = {};
  updateClickedRowBalance(index: number) {
    const rowsArray = this.branchForm.get("rows") as FormArray;
    if (!rowsArray || !rowsArray.at(index)) return;

    const clickedRow = rowsArray.at(index) as FormGroup;
    const prccbsArray = clickedRow.get("prccbs") as FormArray;
    if (!prccbsArray) return;

    let carriedBalance = null;
    const balanceArray: number[] = []; // Store only balance values

    prccbsArray.controls.forEach((group: AbstractControl, index) => {
      const originalReq = group.get("req_qty")?.value || 0;
      let enteredQty = group.get("qty")?.value || 0;

      if (enteredQty > originalReq) {
        enteredQty = originalReq;
        this.notification.showError(
          `Qty cannot exceed Requested Qty (${originalReq})`
        );
        group.patchValue({ qty: originalReq }, { emitEvent: false });
      }

      const reqQty = carriedBalance !== null ? carriedBalance : originalReq;
      const blcQty = Math.max(0, reqQty - enteredQty);

      group.patchValue(
        {
          // req_qty: reqQty,
          blc_qty: blcQty,
        },
        { emitEvent: false }
      );

      balanceArray.push(blcQty);
      carriedBalance = blcQty;
      this.ccbsBalanceState[index] = balanceArray;
    });

    // ✅ Save only the blc_qty values globally for that row
  }

  // updateClickedRowBalance(index: number) {
  //   const rowsArray = this.branchForm.get('rows') as FormArray;
  //   if (!rowsArray || !rowsArray.at(index)) return;

  //   const clickedRow = rowsArray.at(index) as FormGroup;
  //   const prccbsArray = clickedRow.get('prccbs') as FormArray;
  //   if (!prccbsArray) return;

  //   let carriedBalance = null;

  //   prccbsArray.controls.forEach((group: AbstractControl) => {
  //     const originalReq = group.get('req_qty')?.value || 0;
  //     let enteredQty = group.get('qty')?.value || 0;

  //     // Prevent over-allocation
  //     if (enteredQty > originalReq) {
  //       enteredQty = originalReq;
  //       this.notification.showError(`Qty cannot exceed Requested Qty (${originalReq})`);
  //       group.patchValue({ qty: originalReq }, { emitEvent: false });
  //     }

  //     const reqQty = carriedBalance !== null ? carriedBalance : originalReq;
  //     const blcQty = Math.max(0, reqQty - enteredQty);

  //     group.patchValue({
  //       req_qty: reqQty,
  //       blc_qty: blcQty
  //     }, { emitEvent: false });

  //     carriedBalance = blcQty;
  //   });

  //   // ✅ Update the in-memory global state
  //   this.ccbsState[index] = prccbsArray.value;
  addCCBSave(index: number, id, type): void {
    if (type === "closebtn") {
      this.showpopup = false;
      this.hideBackdrop();
      document.body.style.paddingRight = ""; // reset to default
      // this.closebtn.nativeElement.click();
      return;
    }

    if (type === "save") {
      const confirmSave = window.confirm(
        "Do you want to save the CCBS Quantities?"
      );
      if (!confirmSave) return;

      const rowsArray = this.rows as FormArray;
      if (!rowsArray) return;

      const savedRow = rowsArray.at(index);
      const savedPrccbs = savedRow.get("prccbs") as FormArray;

      const totalQtyEntered = savedPrccbs.controls.reduce((sum, group) => {
        const qty = +group.get("qty")?.value || 0;
        return sum + qty;
      }, 0);

      const selectedQty = +this.alloc_qty || 0;

      if (totalQtyEntered !== selectedQty) {
        this.notification.showError(
          `Total Quantity Entered (${totalQtyEntered}) should be Equal to Allocated Quantity (${selectedQty}).`
        );
        this.prccbssaved = false;
        return;
      }

      this.notification.showSuccess("CCBS Quantities Saved Successfully!");
      this.prccbssaved = true;

      // Store the saved values
      const savedBlcQtys = savedPrccbs.controls.map(
        (group) => group.get("blc_qty")?.value || 0
      );
      const savedQtys = savedPrccbs.controls.map(
        (group) => group.get("qty")?.value || 0
      );

      // Update all other rows with qty → alloc_qty
      rowsArray.controls.forEach((row: AbstractControl, rowIndex: number) => {
        if (rowIndex !== index) {
          const prccbsArray = row.get("prccbs") as FormArray;

          prccbsArray?.controls.forEach((group: AbstractControl, i: number) => {
            const newBlcQty = savedBlcQtys[i] || 0;
            const newQty = savedQtys[i] || 0;

            group.patchValue(
              {
                blc_qty: newBlcQty,
                master_blc_qty: newBlcQty,
                // alloc_qty: newQty // ✅ patch qty → alloc_qty
              },
              { emitEvent: false }
            );
          });
        }
      });

      const numPrccbsItems = savedPrccbs.length;

      // 1. Compute alloc_qty sum at each prccbs[i] across all rows
      const newQtys = savedPrccbs.controls.map(
        (group) => +group.get("qty")?.value || 0
      );

      // Step 3: Add this qty to all rows' alloc_qty
      rowsArray.controls.forEach((row: AbstractControl) => {
        const prccbsArray = row.get("prccbs") as FormArray;

        prccbsArray.controls.forEach((group: AbstractControl, i: number) => {
          const currentAlloc = +group.get("allc_blc_qty")?.value || 0;
          const updatedAlloc = currentAlloc + newQtys[i];
          group.patchValue(
            { allc_blc_qty: updatedAlloc },
            { emitEvent: false }
          );
        });
      });

      this.showpopup = false;
      this.hideBackdrop();
      document.body.style.paddingRight = ""; // reset to default

      return;
    }

    this.showpopup = false;
    this.hideBackdrop();
    document.body.style.paddingRight = ""; // reset to default
  }

  // }

  // addCCBSave(index: number, id, type): void {
  //   if (type === 'closebtn') {
  //     this.showpopup = false;
  //     this.hideBackdrop();
  //     return;
  //   }

  //   if (type === 'save') {
  //     this.showpopup = false;
  //     this.hideBackdrop();

  //     const rowsArray = this.rows as FormArray;
  //     if (!rowsArray) return;

  //     rowsArray.controls.forEach((row: AbstractControl, rowIndex: number) => {
  //       if (rowIndex !== index) {
  //         const prccbsArray = row.get('prccbs') as FormArray;

  //         prccbsArray?.controls.forEach((group: AbstractControl) => {
  //           const reqQty = group.get('req_qty')?.value || 0;
  //           const blc_qty = group.get('blc_qty')?.value || 0;

  //           // ✅ Patch req_qty into blc_qty (excluding saved index)
  //           group.patchValue(
  //             { blc_qty: blc_qty },
  //             { emitEvent: false }
  //           );
  //         });
  //       }
  //     });

  //     return;
  //   }
  // }

  // addCCBSave(index: number, id, type): void {
  //   if(type == 'closebtn'){
  //     this.showpopup = false;
  //     this.hideBackdrop();
  //     // this.updateClickedRowBalance(index);
  //     // this.setupQuantityListeners(); //
  //     return;
  //   }
  //   if(type == 'save'){
  //     this.showpopup = false;
  //     this.hideBackdrop();
  //     this.updateClickedRowBalance(index);
  //     // this.setupQuantityListeners(); //
  //     return;
  //   }
  //   let formArray = this.branchForm.get("rows") as FormArray;
  //   let row = formArray.at(index) as FormGroup;
  //   const rows = this.rows.at(index) as FormGroup;

  //   const rowQuantity = row.get("qty").value;
  //   const ccbsArray = row.get("prccbs") as FormArray;

  //   // Calculate the sum of quantities in prccbs
  //   let ccbsQuantitySum = 0;
  //   let hasZeroQty = false; // Variable to check if any qty is 0

  //   ccbsArray.controls.forEach((ccbsRow) => {
  //     const qty = ccbsRow.get("qty").value;
  //     ccbsQuantitySum += qty;
  //     if (qty === 0 || qty == "" || qty == undefined) {
  //       hasZeroQty = true;
  //     }
  //   });

  //   if (hasZeroQty) {
  //     this.notification.showWarning("Please enter quantity of all line items!");
  //     return;
  //   }
  //   if (rowQuantity === ccbsQuantitySum) {
  //     this.showpopup = false;
  //     this.hideBackdrop();
  //     rows.get("checked").enable();
  //     if (id == 2) {
  //       this.notification.showSuccess("CCBS Saved!");
  //     }
  //   } else {
  //     rows.get("checked").disable();
  //     this.notification.showWarning(
  //       "Required quantity and ccbs quantity must be equal!"
  //     );
  //   }
  // }

  wholeData() {
    const type = this.branchForm.get("type")?.value;
    const pca = this.branchForm.get("pca")?.value;
    const branchId = this.branchForm.get("branch")?.value?.id;
    const commodity_id = this.branchForm.get("commodity")?.value?.id;
    const employee_id = this.branchForm.get("employee_id")?.value?.id;
    const notepad = this.branchForm.get("notepad")?.value;
    if (
      commodity_id === "" ||
      commodity_id === null ||
      commodity_id === undefined
    ) {
      this.notification.showError("Commodity is mandatory");
      return;
    }
    if (type === "" || type === null || type === undefined) {
      this.notification.showError("Catalog/Non Catalog is mandatory");
      return;
    }
    if (
      employee_id === "" ||
      employee_id === null ||
      employee_id === undefined
    ) {
      this.notification.showError("Approver name is mandatory");
      return;
    }
    if (this.prdetails.length == 0) {
      this.notification.showError("Select any Record to Proceed!");
      return;
    }
    this.prdetails.forEach((obj) => {
      delete obj.id;
      delete obj.pr_for;
    });
    let payloadDict = {
      type: type,
      mepno: pca,
      dts: this.dts,
      branch_id: branchId,
      employee_id: employee_id,
      commodity_id: commodity_id,
      notepad: notepad,
      file_key: ["fileheader"],
      prdetails: this.prdetails,
      totalamount: this.total_amount,
      used_branch_pr: this.used_branch_pr,
    };

    console.log("payloadarray", payloadDict);
    let datavalue = JSON.stringify(payloadDict);
    let formdata = new FormData();
    let HeaderFilesdata = this.filesHeader.value.file_upload;

    for (var i = 0; i < HeaderFilesdata.length; i++) {
      let keyvalue = "fileheader";
      let pairValue = HeaderFilesdata[i];

      if (HeaderFilesdata[i] == "") {
        console.log("");
      } else {
        formdata.append(keyvalue, pairValue);
      }
    }

    formdata.append("data", datavalue);
    this.spinnerservice.show();
    this.prposervice.prCreateForm(formdata, this.Services).subscribe(
      (result) => {
        this.spinnerservice.hide();
        if (
          result.code === "INVALID_DATA" &&
          result.description === "Invalid Data or DB Constraint"
        ) {
          this.spinnerservice.hide();
          this.notification.showError(result.code);
        }
        if (result.Error) {
          this.notification.showWarning(result.Error);
        } else if (
          result.code === "UNEXPECTED_ERROR" &&
          result.description === "Unexpected Internal Server Error"
        ) {
          this.spinnerservice.hide();
          this.notification.showError("Something went wrong");
        } else {
          this.spinnerservice.hide();
          this.notification.showSuccess("Successfully created!...");
          this.onSubmit.emit();
        }
        console.log("Form SUBMIT", result);
        return true;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }
  isChecked(index) {
    // let value = event.checked;

    let formArray = this.branchForm.get("rows") as FormArray;
    let formGroup = formArray.at(index) as FormGroup;
    let id = formGroup.get("id").value;
    let prdetail_id = formGroup.get("prdetail_id").value;
    console.log("formGroup.value", formGroup.value);

    let supplier_id = formGroup.get("supplier")?.value?.id;
    formGroup.get("supplier_id").setValue(supplier_id);

    let item_id = formGroup.get("items")?.value?.id;
    formGroup.get("item").setValue(item_id);

    let item_name = formGroup.get("items")?.value?.make?.name;
    formGroup.get("item_name").setValue(item_name);

    let model_id = formGroup.get("models")?.value?.id;
    formGroup.get("model_id").setValue(model_id);

    let model_name = formGroup.get("models")?.value?.model?.name;
    formGroup.get("model_name").setValue(model_name);

    let specs = formGroup.get("specs")?.value?.configuration;
    formGroup.get("specification").setValue(specs);

    let ccbs = formGroup.get("prccbs")?.value;
    let transformedCCBS = ccbs.map((data) => ({
      branch_id: data?.branch_id?.id ?? data.branch_id,
      cc: typeof data.cc === "string" ? data.cc : data.cc?.name,
      bs: typeof data.bs === "string" ? data.bs : data.bs?.name,
      req_qty: data.qty,
    }));

    let unit_price = formGroup.get("unitprice")?.value;
    if (
      unit_price == 0 ||
      unit_price == null ||
      unit_price == undefined ||
      unit_price == ""
    ) {
      this.notification.showInfo("Invalid Unit Price!");
      return false;
    }
    // Update the nested form array with transformed values
    // let ccbsFormArray = formGroup.get("prccbs") as FormArray;
    // ccbsFormArray.clear();
    // transformedCCBS.forEach((data) => {
    //   ccbsFormArray.push(
    //     this.fb.group({
    //       branch_id: [data.branch_id, Validators.required],
    //       bs: [data.bs, Validators.required],
    //       cc: [data.cc, Validators.required],
    //       qty: [data.qty, Validators.required],
    //       id: [""],
    //     })
    //   );
    // });
    // branch_id.get('branch_id').value.id;

    // formGroup.get('prccbs')['controls']['branch_id'].setValue(branch_id)

    // if (value === true) {
    const pr_request = formGroup.get("pr_for")?.value;
    let dict;
    if (pr_request == "New") {
      dict = {
        pr_request: 1,
      };
      formGroup.get("branch_pr_request").setValue(dict);
    } else if (pr_request == "Replacement") {
      dict = {
        pr_request: 2,
        prdetail_id: prdetail_id,
      };
      formGroup.get("branch_pr_request").setValue(dict);
      // }
      // if(formGroup.valid){
      // this.prdetails.push(formGroup.value);

      //         const formData = { ...formGroup.value };

      // delete formData.id;

      // this.prdetails.push({
      //     ...formData,
      //     prccbs: transformedCCBS
      // });
      this.prdetails.push({
        ...formGroup.value,
        prccbs: transformedCCBS,
      });

      this.used_branch_pr.push(id);
      console.log("this.used_branch_pr", this.used_branch_pr);

      this.calculateTotalAmount();

      console.log("this.prdetails", this.prdetails);
      // } else {
      //   this.notification.showWarning("Please fill all the details!");
      //   formGroup.get('checked').setValue(false);
      //   return false;
      // }
    }
    // if (value === false) {
    //   // If unchecked, remove the item from prdetails array
    //   const indexToRemove = this.prdetails.findIndex((item) => item.id === id); // Find by unique ID
    //   if (indexToRemove !== -1) {
    //     const removedItem = this.prdetails.splice(indexToRemove, 1)[0]; // Remove the item and get it
    //     console.log("Removed item:", removedItem);
    //     this.used_branch_pr = this.used_branch_pr.filter(
    //       (itemId) => itemId !== id
    //     );
    //     console.log("this.used_branch_pr", this.used_branch_pr);

    //     // Pass the negative amount to subtract from total
    //     this.calculateTotalAmount(-removedItem.amount);

    //     console.log("this.prdetails", this.prdetails);
    //   }
    // }
  }
  onFileSelectedHeader(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.filesHeader.value.file_upload.push(e.target.files[i]);
      let checkvalue = this.filesHeader.value.file_upload;
      console.log("checkvalue", checkvalue);
    }
  }

  HeaderFilesDelete() {
    let checkvalue = this.filesHeader.value.file_upload;
    for (let i in checkvalue) {
      checkvalue.splice(i);
    }
    console.log("checkvalue", checkvalue);
    this.InputVar.nativeElement.value = "";
    console.log("checkvalue", checkvalue);
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
      onInit: function () {
        // Adding default border style and basic table styles when creating a table
        const editor = document.querySelector(".note-editable");
        if (editor) {
          editor.addEventListener("input", function () {
            // Convert HTMLCollection to an array using Array.from
            const tables = Array.from(editor.getElementsByTagName("table"));
            tables.forEach((table) => {
              // Apply table-wide styles
              const htmlTable = table as HTMLTableElement;
              htmlTable.style.borderCollapse = "collapse";
              htmlTable.style.width = "100%";
              htmlTable.style.textAlign = "left";

              // Apply styles to each cell (th and td) within the table
              const cells = table.querySelectorAll("th, td");
              cells.forEach((cell) => {
                const htmlCell = cell as HTMLTableCellElement;
                htmlCell.style.border = "1px solid black";
                htmlCell.style.padding = "5px 3px";
                htmlCell.style.boxSizing = "border-box";
              });
            });
          });
        }
      },
    },
  };

  editorDisabled = false;

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

  summernoteInit(event) {
    // console.log(event);
  }
  //   validateSuppliers(i,row) {
  //     const rows = this.rows.at(i) as FormGroup;
  //     const formArray = this.branchForm.get('rows') as FormArray;

  //     // If the form array has less than two items, no need for validation
  //     // if (formArray.length < 2) {
  //     //   return;
  //     // }
  //     console.log(i,"IIIII")
  //   console.log(rows,'rows')
  //   if(i===0){
  //     return;
  //   }
  //   const rowss = this.rows.at(0) as FormGroup;
  //  if(rows.value.supplier.id!==rowss.value.supplier.id){
  //   this.notification.showWarning("Commodity & Supplier must be same!");
  //   return;
  //  }
  //     // Get the supplier ID of the first row

  //     // Validate that all supplier IDs are the same
  //     // for (let i = 1; i < formArray.length; i++) {
  //     //   const currentSupplierId = formArray.at(i).get('supplier').value.id;
  //     //   if (currentSupplierId !== firstSupplierId) {
  //     //     this.notification.showWarning("Commodity & Supplier must be same!");
  //     //     return;
  //     //   }
  //     // }
  //   }
  validateSuppliers(i, row) {
    const rows = this.rows.at(i) as FormGroup;
    const formArray = this.branchForm.get("rows") as FormArray;

    // If the form array has less than two items, no need for validation
    if (formArray.length < 2) {
      return;
    }

    console.log(i, "IIIII");
    console.log(rows, "rows");

    // Get the supplier ID of the clicked row
    const currentSupplier = rows.value.supplier;

    // Check if the supplier field in the current row is empty
    if (!currentSupplier || !currentSupplier.id) {
      return;
    }

    // Iterate through the form array and compare supplier IDs
    for (let index = 0; index < formArray.length; index++) {
      if (index !== i) {
        // Skip the clicked row itself
        const rowToCompare = formArray.at(index) as FormGroup;
        const supplierToCompare = rowToCompare.get("supplier").value;

        // Check if the supplier field in the row to compare is empty
        if (!supplierToCompare || !supplierToCompare.id) {
          continue;
        }

        if (currentSupplier.id !== supplierToCompare.id) {
          this.notification.showWarning("Commodity & Supplier must be same!");
          rows.get("supplier").reset();
          return;
        }
      }
    }
  }

  backtoSummary() {
    this.spinnerservice.show();
    this.onCancel.emit();
    this.spinnerservice.hide();
  }
  getpcapopup(id) {
    let pca = this.branchForm.value.pca;

    if (pca) {
      this.ismepdtl = true;
    }

    // console.log("mepno", IDMep)
    this.spinnerservice.show();
    this.prposervice.getmepdtl(pca, id).subscribe(
      (result) => {
        this.spinnerservice.hide();
        let datas = result["data"];
        this.MEPUtilizationAmountList = datas;
        // this.mepnumber = result.mep_no
        // this.totalamount = result.mep_amount
        // this.pramt = result.pr_total
        // this.poamt = result.po_total
        // this.description = result[0].justification
        // this.ismep = true
        // this.remainamt = datas[0]?.unutilized_amount

        // this.mepnumber = result.mepno
        // this.totalamount = result.originalamount
        // this.pramt = result.amount
        // this.poamt = result.po_amount
        // this.description = result.justification
        // this.ismep = true
        // this.remainamt = result.pending_amount
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
    // if (this.mepid != '') {
    //   this.ismepdtl = true
    // } else {
    //   this.ismepdtl = false

    // }
  }
  mandatoryfield() {
    const type = this.branchForm.get("type").value;
    const commodity_id = this.branchForm.get("commodity").value.id;
    const employee_id = this.branchForm.get("employee_id").value.id;
    if (type === "" || type === null || type === undefined) {
      this.notification.showError("Catalog/Non Catalog is mandatory");
      return;
    }

    if (
      commodity_id === "" ||
      commodity_id === null ||
      commodity_id === undefined
    ) {
      this.notification.showError("Commodity is mandatory");
      return;
    }
    if (
      employee_id === "" ||
      employee_id === null ||
      employee_id === undefined
    ) {
      this.notification.showError("Approver name is mandatory");
      return;
    }
  }
  checkboxvalidation(i, row) {
    // this.validateSuppliers(i, row);
    const rows = this.rows.at(i) as FormGroup;
    console.log(i, "i");
    console.log(row, "row");

    if (this.catalog === true) {
      if (row.value?.commodity === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value?.branch === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.product_name === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.supplier === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.items === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.models === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.installationrequired === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.capitialized === "") {
        rows.get("checked").disable();
        return;
      }
      if (this.checkconfiguration === true) {
        if (row.value.specs === "") {
          rows.get("checked").disable();
          return;
        }
      }

      // if(row.value.unitprice ===''){
      //   rows.get('checked').disable();
      //   return
      // }
      if (row.value.uom === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.qty === "") {
        rows.get("checked").disable();
        return;
      }
      // let formArray = this.branchForm.get('rows') as FormArray;
      // let row = formArray.at(i) as FormGroup;
      else {
        rows.get("checked").enable();
      }
      const rowQuantity = row.get("qty").value;
      const ccbsArray = row.get("prccbs") as FormArray;

      // Calculate the sum of quantities in prccbs
      let ccbsQuantitySum = 0;
      ccbsArray.controls.forEach((ccbsRow) => {
        ccbsQuantitySum += ccbsRow.get("qty").value;
      });

      if (rowQuantity === ccbsQuantitySum) {
        // this.closebutton.nativeElement.click();
        // this.notification.showSuccess("CCBS Saved!");
        rows.get("checked").enable();
      } else {
        rows.get("checked").disable();

        // this.notification.showWarning('Required quantity and ccbs quantity must be equal!');
      }

      // if(row.value.amount ===''){
      //   rows.get('checked').disable();
      //   return
      // }
    }
    if (this.non_catalog === true) {
      if (row.value.commodity === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.installationrequired === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.capitialized === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.branch === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.product_name === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.supplier === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.items === "") {
        rows.get("checked").disable();
        return;
      }
      // if(row.value.models ===''){
      //   rows.get('checked').disable();
      //   return
      // }
      // if(row.value.specs ===''){
      //   rows.get('checked').disable();
      //   return
      // }
      if (row.value.unitprice === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.uom === "") {
        rows.get("checked").disable();
        return;
      }
      if (row.value.qty === "") {
        rows.get("checked").disable();
        return;
      }
      // if(row.value.amount ===''){
      //   rows.get('checked').disable();
      //   return
      // }
      else {
        rows.get("checked").enable();
      }
      const rowQuantity = row.get("qty").value;
      const ccbsArray = row.get("prccbs") as FormArray;

      // Calculate the sum of quantities in prccbs
      let ccbsQuantitySum = 0;
      ccbsArray.controls.forEach((ccbsRow) => {
        ccbsQuantitySum += ccbsRow.get("qty").value;
      });

      if (rowQuantity === ccbsQuantitySum) {
        // this.closebutton.nativeElement.click();
        // this.notification.showSuccess("CCBS Saved!");
        rows.get("checked").enable();
      } else {
        rows.get("checked").disable();

        // this.notification.showWarning('Required quantity and ccbs quantity must be equal!');
      }
    }
  }

  //     quantityvalidation(index,j){
  //       this.qty_values = 0;
  // console.log(j,'j')
  //   // Access the FormArray from the form
  //   let formArray = this.branchForm.get('rows') as FormArray;
  //   let row = formArray.at(index) as FormGroup;
  //   const ccbsArray = row.get('prccbs') as FormArray;

  //   if (ccbsArray) {
  //     // Get the values from the FormArray
  //     const value = ccbsArray.value;

  //     // Sum up the qty values
  //     for (let item of value) {
  //       const qty = parseFloat(item.qty); // Convert qty to a number
  //       if (!isNaN(qty)) { // Check if qty is a valid number
  //         this.qty_values += qty;
  //       } else {
  //         console.warn(`Invalid qty value: ${item.qty}`);
  //       }
  //     }

  //     console.log(data, 'data');
  //     console.log(this.qty_values, 'qty_values');
  //     if(data.value.qty < this.qty_values){
  //       this.notification.showError('Required quantity and ccbs quantity must be equal!')
  //       const qtyControl = ccbsArray.at(j).get('qty')
  //       qtyControl.reset()
  //     }
  //   }

  //     }
  // }

  reportDownload() {
    let productData = this.SearchForm?.value;

    let data = {
      commodity_id: productData?.commodity_id?.id,
      product_id: productData?.product_id?.id,
      branch_id: productData?.branch_id?.id,
      qty: productData?.qty,
    };

    for (let i in data) {
      if (data[i] == null || data[i] == "" || data[i] == undefined) {
        delete data[i];
      }
    }
    this.spinnerservice.show();
    this.prposervice.getExcelDwnld(data).subscribe(
      (data) => {
        this.spinnerservice.hide();
        if (data["size"] <= 75) {
          this.toastr.warning("", "Records Not Found", { timeOut: 1500 });
          return false;
        } else {
          let binaryData = [];
          binaryData.push(data);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "BPR Approved Report" + ".xlsx";
          link.click();
        }
      },
      (error) => {
        this.spinnerservice.hide();
      }
    );
  }
  getproductType() {
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
        this.spinnerservice.hide();
      }
    );
  }
  Products: boolean = true;
  Services: boolean;
  product_type: any;
  product_service(e) {
    let value = e.id;
    this.product_type = value;
    this.Products = value == "P" ? true : false;
    this.Services = value == "S" ? true : false;
    if (this.Services) {
      this.prForm.get("dts").setValue(0);
      this.prForm.get("dts").disable();
    } else {
      this.prForm.get("dts").enable();
    }
    // this.resetAfterCatlogChange();
  }
  assetArray: any;
  assetDetails(id) {
    let did = id?.id
    this.spinnerservice.show();
    this.prposervice.getAssetDetailss(did).subscribe((res) => {
      this.assetArray = res["asset"];
      this.spinnerservice.hide();
      if (res["asset"].length == 0) {
        this.notification.showInfo("No Data Found!");
      }
    });
  }
  selectedRows: any[] = [];
  selected: any[] = [];
  ccbsdata: any[] = [];
  selectAll(isChecked: boolean, approvedList: any[]) {
    // this.approvedList.forEach((prsummary) => {
    //   prsummary.checked = isChecked;
    // });
    const firstProduct = approvedList[0].product_id.id;
    const allSame = approvedList.every(
      (item) => item.product_id.id === firstProduct
    );
    if (allSame) {
      this.selectedRows = isChecked ? [...approvedList] : [];
      this.ccbsdata = this.selectedRows;
    } else {
      this.notification.showWarning("Please select same product to proceed!");
      return;
    }
    isChecked = false;
    // Update the selectedRows list based on selection
    // this.selectedRows = isChecked ? [...this.approvedList] : [];
  }

  getOtherAttributes(product_code) {
    this.product_code = product_code;

    this.prposervice
      .getOtherAttributes(this.product_code, 1)
      .subscribe((res) => {
        // this.attrList = res;
        // this.itemList = res?.make;
        // this.modelList = res?.model;
        this.specList = res["data"];
        this.specList.length > 0
          ? (this.showCard = true)
          : (this.showCard = false);
        // this.specDict = this.specList
        // this.configList = res?.specification?.configuration;
      });
  }

  // dataSelection(index: number, row: any) {
  //   row.checked = !row.checked;

  //   if (row.checked) {
  //     this.selectedRows.push(row);
  //     this.ccbsdata = this.selectedRows;

  //   } else {
  //     this.selectedRows = this.selectedRows.filter(item => item !== row);
  //   }
  //   console.table(this.selectedRows);
  //   this.branchForm.get('product').setValue(row.product_id);
  //   this.product_type = row.product_type.id;
  //   this.row_id = row?.id;
  //   this.branchForm.get('qty').setValue(row.qty);
  //   this.branchForm.get('commodity').setValue(row.commodity_id);

  // }
  row_id: any;
  selectedTypeQ: any;
  quotation: Boolean = false;
  quetprice: any;

  product_dict: any;

  specList: any = [];
  showCard: boolean = false;
  // specsList: any = [];
  product_code: any;
  getConf(spec) {
    // this.product_code = product?.code;

    this.prposervice.getConf(1, spec, this.product_code).subscribe((res) => {
      // this.attrList = res;
      // this.itemList = res?.make;
      // this.modelList = res?.model;
      this.specsList = res["data"];
      // this.configList = res?.specification?.configuration;
    });
  }
  // addSpecConfig(id: number, specification: string, configuration, formGroup) {
  //   let specConfig = formGroup.get("spec_config") as FormControl;

  //   // Get existing value and parse it
  //   let existingValue = specConfig.value ? specConfig.value.specification : "";

  //   // Convert to array, remove duplicates, and join as a string
  //   let specList = existingValue ? existingValue.split(", ") : [];
  //   let newEntry = `${specification} : ${configuration}`;

  //   if (!specList.includes(newEntry)) {
  //     specList.push(newEntry);
  //   }

  //   // Set the new comma-separated value with the correct ID
  //   specConfig.setValue({
  //     id: id, // Dynamically set ID
  //     specification: specList.join(", "),
  //   });
  //   // this.quotationForm.get("remarks").setValue(specList.join(", "))
  // }
  // addSpecConfig(specId: string, specification: string, configuration: string, form: FormGroup) {
  //   let specConfig = form.get('spec_config')?.value || {};

  //   specConfig[specification] = configuration; // Store configuration mapped to specification
  //   this.branchForm.patchValue({ spec_config: specConfig });
  // }

  // addSpecConfig(specId: string, specification: string, configuration: string, form: FormGroup) {
  //   let specConfigControl = form.get('spec_config') as FormGroup;

  //   if (!specConfigControl) {
  //     console.error("spec_config form group not found");
  //     return;
  //   }

  //   let updatedConfig = { ...specConfigControl.value }; // Copy existing config
  //   updatedConfig[specification] = configuration; // Update the selected configuration

  //   // ✅ Patch the updated object back to the form
  //   specConfigControl.patchValue(updatedConfig);

  //   console.log("Updated spec_config:", specConfigControl.value); // Debugging
  // }
  addSpecConfig(
    specId: string,
    specification: string,
    configuration: string,
    form: FormGroup
  ) {
    let specConfigControl = form.get("spec_config") as FormGroup;

    if (!specConfigControl) {
      console.error("spec_config form group not found");
      return;
    }

    if (!specConfigControl.get(specification)) {
      specConfigControl.addControl(specification, new FormControl(""));
    }

    specConfigControl.get(specification)?.setValue(configuration);

    console.log("Updated spec_config:", specConfigControl.value); // Debugging
  }

  addSpecConfigg(
    specId: string,
    specification: string,
    configuration: string,
    form: FormGroup
  ) {
    let specConfigControl = form.get("spec_config") as FormGroup;

    if (!specConfigControl) {
      console.error("spec_config form group not found");
      return;
    }

    if (!specConfigControl.get(specification)) {
      specConfigControl.addControl(specification, new FormControl(""));
    }

    specConfigControl.get(specification)?.setValue(configuration);

    console.log("Updated spec_config:", specConfigControl.value); // Debugging
    this.searchProduct();
  }

  showData: boolean = false;
  // searchProduct() {
  //   this.spinnerservice.show();
  //   this.showData = true;
  //   // let supplier = this.branchForm.get('supplier')?.value?.id || "";
  //   let prod = this.branchForm.get('product')?.value?.id || "";
  //   let make = this.branchForm.get('items')?.value?.id || "";
  //   let model = this.branchForm.get('models')?.value?.id || "";
  //   const formValue = this.branchForm.value;

  //   // Extract specifications and configurations from spec_config object
  //   const specArr = Object.keys(formValue.spec_config);
  //   const configArr = Object.values(formValue.spec_config);

  //   // let spec = this.branchForm.get('specs')?.value || "";
  //   // let config = this.branchForm.get('config')?.value || "";
  //   this.prposervice.getSupplierData(prod, make, model, specArr, configArr).subscribe({
  //     next: (res) => {
  //       this.SupplierArray = res?.data || [];
  //       this.qty = new FormArray(this.SupplierArray.map(() => new FormControl(""))); // Default quantity
  //       this.supplierRows.clear(); // Clear previous entries
  //       this.ccbsdata.forEach((supplier) => {
  //         this.rows.push(this.fb.group({
  //           supplier_id: [supplier.id || ''],
  //           prccbs: this.fb.array([
  //             this.fb.group({
  //               branch_id: [supplier.branch_id || ''],
  //               bs: [supplier.bs || ''],
  //               cc: [supplier.cc || ''],
  //               req_qty: [''],
  //               blc_qty: [''],
  //               qty: [0],
  //             })
  //           ])
  //         }));
  //       });

  //     this.setupQuantityListeners();

  //       this.spinnerservice.hide();

  //       if (this.SupplierArray.length == 0) {
  //         this.notification.showInfo("No Data Found!");
  //       }
  //     },
  //     error: (err) => {
  //       console.error("Error fetching supplier data:", err);
  //       this.spinnerservice.hide();
  //       this.notification.showError("Failed to fetch data. Please try again.");
  //     }
  //   });
  // }
  // searchProduct() {
  //   this.spinnerservice.show();
  //   this.showData = true;

  //   let prod = this.branchForm.get('product')?.value?.id || "";
  //   let make = this.branchForm.get('items')?.value?.id || "";
  //   let model = this.branchForm.get('models')?.value?.id || "";
  //   const formValue = this.branchForm.value;

  //   // Extract specifications and configurations from spec_config object
  //   const specArr = Object.keys(formValue.spec_config);
  //   const configArr = Object.values(formValue.spec_config);

  //   this.prposervice.getSupplierData(prod, make, model, specArr, configArr).subscribe({
  //     next: (res) => {
  //       this.SupplierArray = res?.data || [];
  //       this.qty = new FormArray(this.SupplierArray.map(() => new FormControl(""))); // Default quantity

  //       this.supplierRows.clear(); // Clear previous entries
  //       this.rows.clear(); // Clear rows before repopulating

  //       this.ccbsdata.forEach((supplier) => {
  //         const prccbsArray = this.fb.array([]);

  //         if (this.ccbsdata && Array.isArray(this.ccbsdata)) {
  //           this.ccbsdata.forEach((ccbsItem) => {
  //             prccbsArray.push(
  //               this.fb.group({
  //                 branch_id: [ccbsItem?.branch_id || ''],
  //                 bs: [ccbsItem?.bs || ''],
  //                 cc: [ccbsItem?.cc || ''],
  //                 req_qty: [ccbsItem?.qty || 0], // Requested Quantity
  //                 blc_qty: [ccbsItem?.qty || 0], // Initial Balance Quantity
  //                 qty: [0, Validators.required] // Quantity Input
  //               })
  //             );
  //           });
  //         }

  //         this.rows.push(this.fb.group({
  //           supplier_id: [supplier.id || ''],
  //           prccbs: prccbsArray
  //         }));
  //       });

  //       // this.setupQuantityListeners(); // ✅ Ensure dynamic updates for all rows
  //       this.spinnerservice.hide();

  //       if (this.SupplierArray.length === 0) {
  //         this.notification.showInfo("No Data Found!");
  //       }
  //     },
  //     error: (err) => {
  //       console.error("Error fetching supplier data:", err);
  //       this.spinnerservice.hide();
  //       this.notification.showError("Failed to fetch data. Please try again.");
  //     }
  //   });
  // }
  // searchProduct() {
  //   this.spinnerservice.show();
  //   this.showData = true;

  //   let prod = this.branchForm.get('product')?.value?.id || "";
  //   let make = this.branchForm.get('items')?.value?.id || "";
  //   let model = this.branchForm.get('models')?.value?.id || "";
  //   const formValue = this.branchForm.value;

  //   const specArr = Object.keys(formValue.spec_config);
  //   const configArr = Object.values(formValue.spec_config);

  //   this.prposervice.getSupplierData(prod, make, model, specArr, configArr).subscribe({
  //     next: (res) => {
  //       this.SupplierArray = res?.data || [];
  //       this.qty = new FormArray(this.SupplierArray.map(() => new FormControl("")));

  //       this.supplierRows.clear();
  //       this.rows.clear();

  //       this.SupplierArray.forEach((supplier) => {
  //         const prccbsArray = this.fb.array(
  //           this.ccbsdata.map((ccbsItem) =>
  //             this.fb.group({
  //               branch_id: [ccbsItem?.branch_id || ''],
  //               bs: [ccbsItem?.bs || ''],
  //               cc: [ccbsItem?.cc || ''],
  //               req_qty: [ccbsItem?.qty || 0],
  //               blc_qty: [ccbsItem?.qty || 0],
  //               allc_blc_qty: [0], //
  //               master_blc_qty: [ccbsItem?.qty || 0], // ✅ added here
  //               qty: [0, Validators.required],
  //             })
  //           )
  //         );

  //         this.rows.push(this.fb.group({
  //           supplier_id: [supplier.id || ''],
  //           prccbs: prccbsArray,
  //         }));
  //       });

  //       this.spinnerservice.hide();

  //       if (this.SupplierArray.length === 0) {
  //         this.notification.showInfo("No Data Found!");
  //       }
  //     },
  //     error: (err) => {
  //       console.error("Error fetching supplier data:", err);
  //       this.spinnerservice.hide();
  //       this.notification.showError("Failed to fetch data. Please try again.");
  //     }
  //   });
  // }
  // searchProduct() {
  //   this.spinnerservice.show();
  //   this.showData = true;

  //   let prod = this.branchForm.get("product")?.value?.id || "";
  //   let make = this.branchForm.get("items")?.value?.id || "";
  //   let model = this.branchForm.get("models")?.value?.id || "";
  //   const formValue = this.branchForm.value;

  //   const specArr = Object.keys(formValue.spec_config);
  //   const configArr = Object.values(formValue.spec_config);

  //   this.prposervice
  //     .getSupplierData(prod, make, model, specArr, configArr)
  //     .subscribe({
  //       next: (res) => {
  //         const newSuppliers = res?.data || [];

  //         // ✅ Filter out already-added supplier IDs
  //         const existingSupplierIds = new Set(
  //           this.SupplierArray.map((s) => s.id)
  //         );
  //         const uniqueSuppliers = newSuppliers.filter(
  //           (s) => !existingSupplierIds.has(s.id)
  //         );

  //         // ✅ Append only new suppliers
  //         this.SupplierArray.push(...uniqueSuppliers);
  //         this.qty = new FormArray(
  //           uniqueSuppliers.map(() => new FormControl(""))
  //         ); // Default quantity

  //         // ✅ Append new controls to qty and rows without clearing
  //         uniqueSuppliers.forEach((supplier) => {
  //           this.qty.push(new FormControl(""));

  //           const prccbsArray = this.fb.array(
  //             this.ccbsdata.map((ccbsItem) =>
  //               this.fb.group({
  //                 branch_id: [ccbsItem?.branch_id || ""],
  //                 bs: [ccbsItem?.bs || ""],
  //                 cc: [ccbsItem?.cc || ""],
  //                 req_qty: [ccbsItem?.qty || 0],
  //                 blc_qty: [ccbsItem?.qty || 0],
  //                 allc_blc_qty: [0],
  //                 master_blc_qty: [ccbsItem?.qty || 0],
  //                 qty: [0, Validators.required],
  //               })
  //             )
  //           );

  //           this.rows.push(
  //             this.fb.group({
  //               supplier_id: [supplier.id || ""],
  //               prccbs: prccbsArray,
  //             })
  //           );
  //         });

  //         this.spinnerservice.hide();

  //         if (uniqueSuppliers.length === 0) {
  //           this.notification.showInfo("No new suppliers found.");
  //         }
  //       },
  //       error: (err) => {
  //         console.error("Error fetching supplier data:", err);
  //         this.spinnerservice.hide();
  //         this.notification.showError(
  //           "Failed to fetch data. Please try again."
  //         );
  //       },
  //     });
  // }
searchProduct() {
  this.spinnerservice.show();
  this.showData = true;

  let prod = this.branchForm.get("product")?.value?.id || "";
  let make = this.branchForm.get("items")?.value?.id || "";
  let model = this.branchForm.get("models")?.value?.id || "";
  const formValue = this.branchForm.value;

  const specArr = Object.keys(formValue.spec_config);
  const configArr = Object.values(formValue.spec_config);

  this.prposervice
    .getSupplierData(prod, make, model, specArr, configArr)
    .subscribe({
      next: (res) => {
        const newSuppliers = res?.data || [];

        // ✅ Filter out already-added supplier IDs
        const existingSupplierIds = new Set(
          this.SupplierArray.map((s) => s.id)
        );
        const uniqueSuppliers = newSuppliers.filter(
          (s) => !existingSupplierIds.has(s.id)
        );

        // ✅ Append only new suppliers
        this.SupplierArray.push(...uniqueSuppliers);

        if (this.SupplierArray.length === uniqueSuppliers.length) {
          // If SupplierArray was empty, initialize qty with new suppliers
          this.qty = new FormArray(
            uniqueSuppliers.map(() => new FormControl(""))
          );
        } else {
          // If SupplierArray was not empty, just append to qty
          uniqueSuppliers.forEach(() => {
            this.qty.push(new FormControl(""));
          });
        }

        // ✅ Append new controls to rows
        uniqueSuppliers.forEach((supplier) => {
          const prccbsArray = this.fb.array(
            this.ccbsdata.map((ccbsItem) =>
              this.fb.group({
                branch_id: [ccbsItem?.branch_id || ""],
                bs: [ccbsItem?.bs || ""],
                cc: [ccbsItem?.cc || ""],
                req_qty: [ccbsItem?.qty || 0],
                blc_qty: [ccbsItem?.qty || 0],
                allc_blc_qty: [0],
                master_blc_qty: [ccbsItem?.qty || 0],
                qty: [0, Validators.required],
              })
            )
          );
          console.log(prccbsArray, "prccbsArray");
          this.rows.push(
            this.fb.group({
              supplier_id: [supplier.id || ""],
              prccbs: prccbsArray,
            })
          );
        });
        console.log(this.rows, "rows");
        console.log(this.SupplierArray, "SupplierArray");
        console.log(this.qty, "qty");
        this.spinnerservice.hide();

        if (uniqueSuppliers.length === 0) {
          this.notification.showInfo("Catalog not found for this product!");
        }
      },
      error: (err) => {
        console.error("Error fetching supplier data:", err);
        this.spinnerservice.hide();
        this.notification.showError("Failed to fetch data. Please try again.");
      },
    });
}

  qty: any;
  previousToggleValue: number = 0; // To restore previous toggle value

  // price_Quot(event: MatButtonToggleChange) {
  //     this.product_dict = event; // This stores the whole event object if needed
  //     // this.prForm.controls["product"].reset("");
  //     this.branchForm.controls["items"].reset("");
  //     this.branchForm.controls["models"].reset("");
  //     this.branchForm.controls["specs"].reset("");
  //     // this.prForm.controls["productnoncatlog"].reset("");
  //     // this.prForm.controls["itemnoncatlog"].reset("");
  //     this.branchForm.controls["quotation"].reset("");
  //     this.branchForm.controls["supplier"].reset("");
  //     // this.prForm.controls["supplier_id"].reset("");
  //     // this.prForm.controls["employee_id"].reset("");
  //     // // this.prForm.controls["branch_id"].reset("");
  //     this.branchForm.controls["unitprice"].reset("");
  //     this.branchForm.controls["uom"].reset("");
  //     if(this.selected.length == 0){
  //       this.notification.showWarning("Please Select any Product to Proceed!");
  //       this.selectedTypeQ = 0;
  //       return;
  //     } else {
  //     if(event.value == 2){
  //       this.quotation = true;
  //       this.selectedTypeQ = event.value; // Use event.value, NOT event.id
  //       // this.onSubmit.emit();
  //     }
  //     if(event.value == 1){
  //       this.quotation = false;
  //       this.selectedTypeQ = event.value; // Use event.value, NOT event.id
  //       // this.getspecss()
  //       // this.onSubmit.emit();
  //     }
  //   }
  //     // this.prForm.controls["totalamount"].reset(0);

  //   //   if(this.selectedRows){
  //   //     this.selectedTypeQ = event.value; // Use event.value, NOT event.id
  //   //     // this.supplierInput.nativeElement.focus();
  //   //     // this.getSupplierr();
  //   // }
  //     // this.resetAfterCatlogChange();
  //   }
  price_Quot(event: MatButtonToggleChange): void {
    if (!Array.isArray(this.selected) || this.selected.length === 0) {
      this.notification.showWarning("Please Select any Product to Proceed!");
      this.selectedTypeQ = this.previousToggleValue;
      return;
    }

    this.previousToggleValue = event.value;
    this.product_dict = event;
    this.branchForm.patchValue({
      items: "",
      models: "",
      specs: "",
      quotation: "",
      supplier: "",
      unitprice: "",
      uom: "",
    });

    if (event.value === 2) {
      this.quotation = true;
    } else if (event.value === 1) {
      this.quotation = false;
    }

    this.selectedTypeQ = event.value;
  }

  quotationMasterSearch: FormGroup;
  getMasterQuotation(page) {
    const formValues = this.quotationMasterSearch.value;
    formValues.quotation_for_id = formValues.quotation_for_id
      ? formValues?.quotation_for_id?.id
      : "";
    formValues.product_id = formValues.product_id
      ? formValues?.product_id?.id
      : "";

    // Create a new object only containing keys that have a truthy value
    const filteredValues = Object.keys(formValues)
      .filter(
        (key) =>
          formValues[key] !== null &&
          formValues[key] !== undefined &&
          formValues[key] !== ""
      )
      .reduce((acc, key) => {
        acc[key] = formValues[key];
        return acc;
      }, {});

    this.spinnerservice.show();
    this.prposervice
      .quotationSearchMaster(filteredValues, page)
      .subscribe((res) => {
        this.masterQuotationList = res["data"];
        this.spinnerservice.hide();
      });
  }
  masterQuotationList: any = [];

  getpsupplier() {
    this.getSupplierr();

    this.branchForm
      .get("supplier")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice
            .getsupplierPDependencyFKdd(
              this.branchForm.value.product.id,
              this.branchForm.value.dts,
              value,
              1,
              this.product_type,
              this.selectedTypeQ
            )
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
              catchError((error) => {
                this.errorHandler.handleError(error); // Handle the error
                this.spinnerservice.hide(); // Hide the spinner
                // Optionally return a fallback value to continue the observable stream
                return of([]); // Empty array or fallback response
              })
            )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      });
  }
  getSupplierr() {
    let product = this.branchForm.value?.product?.id;
    let dts = this.branchForm.value?.dts;
    const type = this.branchForm.get("type").value;

    this.spinnerservice.show();
    this.prposervice
      .getsupplierDependencyFK1(
        product,
        this.dts,
        type,
        this.product_type,
        this.selectedTypeQ,
        1
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.spinnerservice.hide();
          this.isLoading = false;

          this.supplierList = datas;
          console.log("supplierList", datas);
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
  }
  QuotationList: any = [];
  has_nextquot: boolean = true;
  has_prevquot: boolean = true;
  currentpageQuot: number = 1;
  getQuotation() {
    this.spinnerservice.show();
    let supplier = this.branchForm.value?.supplier?.id;
    let product = this.branchForm.value?.product?.id;

    if (supplier == undefined || supplier == "" || supplier == null) {
      this.notification.showError("Supplier is Required!");
      this.spinnerservice.hide();
      return false;
    }
    if (product == undefined || product == "" || product == null) {
      this.notification.showError("Product is Required!");
      this.spinnerservice.hide();
      return false;
    }
    let dict = {
      supplier_id: supplier,
      product_id: product,
    };
    // if(dict["supplier_code"] == ""){}
    //  else {

    // this.prposervice.quotationSearch(dict, this.currentpageQuot).subscribe(
    this.prposervice.quotationDD(dict, this.currentpageQuot).subscribe(
      (results: any[]) => {
        this.spinnerservice.hide();
        this.isLoading = false;

        let datas = results["data"];
        let data = results;
        // this.modelID = datas[0].model.id;
        // this.modellname = datas[0].model.name;

        this.currentpageQuot = 1;
        this.has_nextquot = true;
        this.has_prevquot = true;

        if (datas?.length == 0) {
          this.notification.showInfo("No Records Found");
          return;
        }
        this.QuotationList = datas;
        console.log("QuotationList", datas);

        // if (
        //   data["description"] === "The Product Doesn't Have a Valid Catalog"
        // ) {
        //   this.SpinnerService.hide();
        //   this.notification.showError(
        //     "The Product Doesn't Have a Valid Catalog"
        //   );
        // }

        //BUG ID:6902
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
    // }
  }
  public displayFnQuotation(q): string | undefined {
    return q ? q.quotation : undefined;
  }
  getQuotationData(data) {
    console.log("Quotation Data", data);
    // this.isQuotation = true;
    // this.prForm.get('items').setValue(data?.make)
    // this.prForm.get('models').setValue(data?.model)
    // this.prForm.get('specs').setValue(data?.spec_config?.specification)
    // this.prForm.get('quotationid').setValue(data?.quotation_id)
    // this.prForm.get('quot_detailsid').setValue(data?.id)
    // this.prForm.get('quotation_no').setValue(data?.quotation_no)

    // this.prForm.get('unitprice').setValue(data?.price)

    this.branchForm.patchValue({
      items: data?.make || "",
      models: data?.model || "",
      specs: data?.spec_config?.specification || "",
      quotationid: data?.quotation_id || "0",
      quot_detailsid: data?.id || "0",
      quotation_no: data?.supplier_quot || "--",
      unitprice: data?.price || "",
    });
    // this.quotation_id = data?.quotation_id;
    // this.supplier_id = data?.supplier_id;
    // this.prForm.updateValueAndValidity();

    // this.prForm.get('product_type').setValue(data?.producttype)
    // this.prForm.get('product').setValue(data?.product)
  }
  getitemFK() {
    // this.SpinnerService.show();
    // this.MAKE = true;
    // console.log("data", this.MAKE);
    // let product = this.masterForm.value.product.id;
    // let commodity = this.quotationForm.value.commodity.id;
    // let dts = this.quotationForm.value.dts;
    // let supplier = this.quotationForm.value.supplier.id;
    this.spinnerservice.show();
    if (
      // supplier == undefined ||
      this.product_code == ""
      // commodity == undefined
    ) {
      this.notification.showError("Kindly Choose Product!");
      this.spinnerservice.hide();
      return false;
    } else {
      this.prposervice.getMake(this.product_code, "", 1).subscribe(
        (results: any[]) => {
          this.spinnerservice.hide();
          this.isLoading = false;
          let datas = results["data"];
          let data = results;

          //BUG ID:8452
          this.currentpageitem = 1;
          this.has_nextitem = true;
          this.has_previousitem = true;
          //

          // if (datas?.length == 0) {
          //   this.notification.showInfo("No Records Found")
          // }
          if (datas.length == 0) {
            this.notification.showError("No data is there against make");
            // this.quotationForm.patchValue({
            //   unitprice: datas[0].unitprice,
            //   uom: datas[0].uom,
            // });
          } else {
            this.itemList = datas;
          }

          console.log("product", datas);
          //BUG ID:6902
          // if (data['description'] === "Kindly Choose Other Item") {
          //   this.SpinnerService.hide()
          //   this.notification.showError("Kindly Choose Other Item")
          // }
          if (
            data["description"] === "The Product Doesn't Have a Valid Catalog"
          ) {
            this.spinnerservice.hide();
            this.notification.showError(
              "The Product Doesn't Have a Valid Catalog"
            );
          }

          //BUG ID:6902
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.spinnerservice.hide();
        }
      );
    }
  }
  public displayFnitem(item): string | undefined {
    return item ? item.name : undefined;
  }

  makeCheck(data) {
    // this.is_model = data.model_check;
    this.make_id = data?.id;
  }
  autocompleteitemScroll() {
    console.log("has next of item==>", this.has_nextitem);
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
              if (this.has_nextitem === true) {
                this.prposervice
                  .getMake(
                    this.product_code,
                    this.itemInput.nativeElement.value,
                    this.currentpageitem + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.itemList = this.itemList.concat(datas);
                      if (this.itemList.length >= 0) {
                        this.has_nextitem = datapagination.has_next;
                        this.has_previousitem = datapagination.has_previous;
                        this.currentpageitem = datapagination.index;
                      }
                    },
                    (error) => {
                      this.errorHandler.handleError(error);
                      this.spinnerservice.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  productDetails: any;
  selectedVersion: number = 0;
  version: boolean = false;
  history: boolean = false;
  changeTab(e: number) {
    this.version = e === 0; // Purchase Request
    this.history = e === 1; // Branch Purchase Request
    // this.Quotation = e === 2; // Quotation
    if (this.version) {
      this.getVersionView();
    }
    if (this.history) {
      this.getVersionHistory();
    }
    // if (!this.prForm.get("branch_id").value) {
    //   this.notification.showInfo("Please Select Request For");
    //   return;
    // }
    // if (!this.prForm.get("product_name").value) {
    //   this.notification.showInfo("Please Select Product Name");
    //   return;
    // }
  }
  viewQ(data) {
    this.quotation_id = data?.quotation[0]?.quotation_id;
    this.supplier_id = data?.quotation[0]?.supplier_id;
    this.getVersionView();
    this.getVersionHistory();
  }
  supplier_id: any;
  quotation_id: any;
  getVersionHistory() {
    this.prposervice
      .getQuotationDetailsHistory(this.quotation_id, this.supplier_id)
      .subscribe((results: any) => {
        if (results["code"]) {
          this.notification.showInfo(results["description"]);
          return;
        }

        let datas = results["data"];
        this.quotaionList = datas;
        this.spinnerservice.hide();
        if (this.quotaionList.length == 0) {
          this.notification.showInfo("No Records Found!");
          this.spinnerservice.hide();
        }
      });
  }
  getVersionView() {
    this.prposervice
      .getQuotationDetails(this.quotation_id, this.supplier_id)
      .subscribe((results: any) => {
        if (results["code"]) {
          this.notification.showInfo(results["description"]);
          return;
        }

        let datas = results["data"];
        this.quotaionList = datas;
        this.spinnerservice.hide();
        if (this.quotaionList.length == 0) {
          this.notification.showInfo("No Records Found!");
          this.spinnerservice.hide();
        }
      });
  }
  Draftsub() {
    if (this.quotation) {
      this.quetprice = 1;
    } else {
      this.quetprice = 2;
    }

    const validRows = this.selectedRows.filter((item) => item.qty && item.amount);
const totalQty = validRows.reduce((sum, item) => sum + item.qty, 0);
const requiredQty = this.branchForm.get("qty")?.value;

if (totalQty !== requiredQty) {
  this.notification.showInfo(
    "Total Quantity Mismatch! Please Adjust your Selection!"
  );
  return;
}

    const rowsArray = this.rows as FormArray;
    console.log("this.selectedRows", this.selectedRows);
    console.log("this.branchForm", this.branchForm.value);
    console.log("this.selected", this.selected);
    console.log("this.rows", this.rows);
    const payload = {
      employee_id: Number(this.employeeid),
      commodity_id: this.Commodity,
      branch: this.empBranchdata,
      branch_id: this.branchid,
      prequestfor: this.quetprice,
      branch_indent: this.ccbsdata,
      catlog: validRows,
      con_bpa_no: {
        id: this.idSelected,
      },
prdetails: validRows
  .filter((row) => row.qty && row.amount)  // 💡 Only include rows with qty & amount
  .map((selectedRow) => {
      const matchingRow = (this.rows as FormArray).value.find(
          (row) =>
            row.supplier_id === selectedRow.id ||
            row.supplier_id === selectedRow.supplierbranch?.id
        );

        const prccbs = (matchingRow?.prccbs || []).map(
          ({
            master_blc_qty,
            blc_qty,
            req_qty,
            allc_blc_qty,
            branch_id,
            ...rest
          }) => ({
            ...rest,
            branch_id: branch_id.id || branch_id,
            branch: branch_id,
          })
        );
        //  const catlog = this.selectedRows

        return {
          catelog_id: Number(this.selectedTypeQ),
          uom: selectedRow.uom?.name || "",
          qty: selectedRow.qty,
          pr_request: this.pr_request,
          product_requestfor: this.prrequestvalue,
          supplier: {
            code: selectedRow.supplierbranch?.code,
            id: selectedRow.supplierbranch?.id,
            name: selectedRow.supplierbranch?.name,
          },

          supplier_id: selectedRow.supplierbranch?.id,
          supplierid: selectedRow.supplierbranch,
          quotation_id: selectedRow.quotation[0].quotation_id || 0,
          quotationid: selectedRow.quotation,
          quotationdetail_id: selectedRow.quotation[0].id || 0,
          quotationdetailid: selectedRow.quotation,
          producttype: this.prodDict,
          product: this.branchForm.get("product").value,
          make: selectedRow.make,
          model: selectedRow.model,
          spec_config: {
            specification: Object.entries(selectedRow.configuration || {})
              .map(([key, value]) => `${key}: ${value}`)
              .join(", "),
          },
          unit_price: Number(selectedRow.unitprice),
          amount: Number(selectedRow.amount),
          prccbs,
        };
      }),
    };
    console.log("payload", payload);
    this.spinnerservice.show();
    this.prposervice.submitDraft(payload).subscribe(
      (response) => {
        this.spinnerservice.hide();
        if (response["id"]) {
          this.notification.showSuccess("Draft Created Successfully!");
        }
        // this.selectedRows = [];
        // this.qty.controls.forEach(control => control.setValue(""));
        // this.showData = false;
        // this.branchForm.reset();
        // this.rows.clear();
        // this.selected = [];

        this.selectedRows = []; // Clear selected rows after submission
        this.qty.controls.forEach((control) => control.setValue("")); // Reset input fields
        this.showData = false;
        this.branchForm.reset(); // Reset the form
        this.rows.clear(); // Clear the rows in the form array
        this.selected = []; // Clear selected rows
        this.specList = [];
        this.selectedTypeQ = "";
        this.ngOnInit(); //
        // this.ngOnInit();
      },
      (error) => {
        this.notification.showError(
          "Error while submitting! Please try again."
        );
      }
    );
  }
  Draftsearch() {}
  quotaionList: any = [];
  Addbranchpr(clickvalue){
 this.getEmployeeBranchData();
   this.sharedService.clickedvalue.next(clickvalue);

  }
  BRCreateSubmit() {
   this.Search()
    this.closepopupbranch.nativeElement.click()
  
  }

  BRCreateCancel() {

    this.closepopupbranch.nativeElement.click()
    this.Search()
   
  }
  openpopup(){
 this.closepopupbranch.nativeElement.click()
    // this.Search()
   console.log("in pr branch popup")
       var myModal = new (bootstrap as any).Modal(
            document.getElementById("productview"),
            {
              keyboard: false,
            }
          );
          myModal.show();
   
  }
 
  branchcancel(){
     this.closepopupbranch.nativeElement.click()
    this.Search()
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
    this.reportService.getpdtclasstype(this.productInputtype.nativeElement.value,1).subscribe((results: any[]) => {
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
                  .getpdtclasstype(this.productInputtype.nativeElement.value,this.producttype_crtpage +1 )
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
     
                    }
                  );
              }
            }
          });
      }
    });
  }

}
