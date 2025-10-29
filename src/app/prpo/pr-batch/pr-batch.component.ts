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
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
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
import { NgxSpinnerService } from "ngx-spinner";
import { data } from "jquery";
// import { DataService } from '../service/data.service';
import { Router } from "@angular/router";
import { ReturnComponent } from "src/app/rmu/return/return.component";
import { isBoolean } from "util";
import { ToastrService } from "ngx-toastr";
import { AmountPipeCustomPipe } from '../amount-pipe-custom.pipe';
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
  name:string
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
  selector: 'app-pr-batch',
  templateUrl: './pr-batch.component.html',
  styleUrls: ['./pr-batch.component.scss']
})


export class PrBatchComponent implements OnInit {
  questionForm: any;
  displayData: any = [];
  vendorSearchForm: FormGroup;
  Lists: any = [];
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

  @ViewChild("commodity") matcommodityAutocomplete: MatAutocomplete;
  @ViewChild("commodityInput") commodityInput: any;

  @ViewChild("commodityy") matcommodityyAutocomplete: MatAutocomplete;
  @ViewChild("commodityInputt") commodityInputt: any;

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("supplierr") matsupplierAutocomplete: MatAutocomplete;
  @ViewChild("supplierInput") supplierInput: any;
  @ViewChild("productcatt") matproductAutocomplete: MatAutocomplete;
  @ViewChild("productInput") productInput: any;
  @ViewChild("productInputtype") productInputtype: any;

  @ViewChild("model") matmodelAutocomplete: MatAutocomplete;
  @ViewChild("modelInput") modelInput: any;
  @ViewChild("branch") matbranchAutocomplete: MatAutocomplete;
  @ViewChild("branchInput") branchInput: any;
  @ViewChild("uom") matuomAutocomplete: MatAutocomplete;
  @ViewChild("uomInput") uomInput: any;
  @ViewChild("closebutton") closebutton: ElementRef;

   @ViewChild("mepname") matmepAutocomplete: MatAutocomplete;
    @ViewChild("mepinput") mepinput: any;

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
  qty: any;
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
  commodityid:any;
  currentpagemep = 1;
   has_nextmep = true;
  has_previousmep = true;
  mepcurrentpage = 0;
  totalamount:any;
  @ViewChild("bs") matbsAutocomplete: MatAutocomplete;
  @ViewChild("bsInput") bsInput: any;
  MEPList: any;
  @ViewChild("emp") matempAutocomplete: MatAutocomplete;
  @ViewChild("empInput") empInput: any;
  @ViewChild("item") matitemAutocomplete: MatAutocomplete;
  @ViewChild("itemInput") itemInput: any;
  @ViewChild("spec") matspecsAutocomplete: MatAutocomplete;
  @ViewChild("specsInput") specsInput: any;
   producttype_next = false;
  producttype_pre = false;
  producttype_crtpage= 1;
 prdTypes: any=[]
  @ViewChild("productauto") productAutocomplete: MatAutocomplete;
  supplierList: any;
  supplierreadonly: any;
 
  prList: any = [];
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
  ccbsdata: any;
  location_fullname: any;
  qty_values: number;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  mepno: any;
  par_no: any;
  par_name: any;
  par_amount: any;

  constructor(
    private activateroute: ActivatedRoute,
    private spinnerservice: NgxSpinnerService,
    private shareService: PRPOshareService,
    private notification: NotificationService,
    private cd: ChangeDetectorRef,
    private errorHandler: ErrorHandlingServiceService,
    private formbuilder: FormBuilder,
    public datepipe: DatePipe,
    private toastr:ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private prposervice: PRPOSERVICEService,
    private renderer: Renderer2,
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
  //   this.prList = 
  //   [
  //     {
  //         "no": "CM7961",
  //         "product_name": "(DOT MATRIX) PRINTER",
  //         "sup_array": [
  //             {
  //                 "commodity_id": {
  //                     "code": "COMD001",
  //                     "id": 1,
  //                     "name": "Courier, Mail Services and Postage",
  //                     "status": 1
  //                 },
  //                 "id": 8646,
  //                 "make": {
  //                     "id": null,
  //                     "name": null
  //                 },
  //                 "pr_request": 1,
  //                 "model": {
  //                     "id": 217,
  //                     "name": "color "
  //                 },
  //                 "prccbs_ids": [
  //                     {
  //                         "branch_id": {
  //                             "address_id": 258,
  //                             "code": "1903",
  //                             "contact_id": 246,
  //                             "fullname": "1903--EXPENSES MANAGEMENT CELL",
  //                             "gstin": "33AAACT3373J1ZD",
  //                             "id": 259,
  //                             "name": "EXPENSES MANAGEMENT CELL"
  //                         },
  //                         "bs": "CBDL-DOMESTIC",
  //                         "cc": "CASA & TD",
  //                         "id": 10304,
  //                         "prdetails_id": 8646,
  //                         "qty": 12.0
  //                     },
  //                     {
  //                         "branch_id": {
  //                             "address_id": 258,
  //                             "code": "1903",
  //                             "contact_id": 246,
  //                             "fullname": "1903--EXPENSES MANAGEMENT CELL",
  //                             "gstin": "33AAACT3373J1ZD",
  //                             "id": 259,
  //                             "name": "EXPENSES MANAGEMENT CELL"
  //                         },
  //                         "bs": "CBDL-DOMESTIC",
  //                         "cc": "BANK ASSURANCE",
  //                         "id": 10306,
  //                         "prdetails_id": 8646,
  //                         "qty": 1.0
  //                     },
  //                     {
  //                         "branch_id": {
  //                             "address_id": 258,
  //                             "code": "1903",
  //                             "contact_id": 246,
  //                             "fullname": "1903--EXPENSES MANAGEMENT CELL",
  //                             "gstin": "33AAACT3373J1ZD",
  //                             "id": 259,
  //                             "name": "EXPENSES MANAGEMENT CELL"
  //                         },
  //                         "bs": "CBDL-DOMESTIC",
  //                         "cc": "BANK ASSURANCE",
  //                         "id": 10307,
  //                         "prdetails_id": 8646,
  //                         "qty": 1.0
  //                     },
  //                     {
  //                         "branch_id": {
  //                             "address_id": 258,
  //                             "code": "1903",
  //                             "contact_id": 246,
  //                             "fullname": "1903--EXPENSES MANAGEMENT CELL",
  //                             "gstin": "33AAACT3373J1ZD",
  //                             "id": 259,
  //                             "name": "EXPENSES MANAGEMENT CELL"
  //                         },
  //                         "bs": "CBDL-DOMESTIC",
  //                         "cc": "BANK ASSURANCE",
  //                         "id": 10308,
  //                         "prdetails_id": 8646,
  //                         "qty": 1.0
  //                     }
  //                 ],
  //                 "product": {
  //                     "id": 1,
  //                     "name": "(DOT MATRIX) PRINTER"
  //                 },
  //                 "qty": 1.0,
  //                 "quotation_id": 0,
  //                 "spec_config": {
  //                     "specification": "version : 1.9, XPrint Pro 2000 : XPrint Pro 2000"
  //                 },
  //                 "specification": "version : 1.9, XPrint Pro 2000 : XPrint Pro 2000",
  //                 "supplier_id": {
  //                     "address_id": 42353,
  //                     "code": "SU0010524",
  //                     "fullname": "SU0010524--SHREE KRISHNA TRAVELS - GANDHIDHAM",
  //                     "gstno": "",
  //                     "id": 10574,
  //                     "name": "SHREE KRISHNA TRAVELS - GANDHIDHAM",
  //                     "vendor_id": 9687
  //                 },
  //                 "unitprice": 500.0
  //             },
  //             {
  //                 "commodity_id": null,
  //                 "id": 8647,
  //                 "pr_request": 1,
  //                 "make": {
  //                     "id": null,
  //                     "name": null
  //                 },
  //                 "model": {
  //                     "id": 217,
  //                     "name": "color "
  //                 },
  //                 "prccbs_ids": [
  //                     {
  //                         "branch_id": {
  //                             "address_id": 258,
  //                             "code": "1903",
  //                             "contact_id": 246,
  //                             "fullname": "1903--EXPENSES MANAGEMENT CELL",
  //                             "gstin": "33AAACT3373J1ZD",
  //                             "id": 259,
  //                             "name": "EXPENSES MANAGEMENT CELL"
  //                         },
  //                         "bs": "CBDL-DOMESTIC",
  //                         "cc": "CASA & TD",
  //                         "id": 10305,
  //                         "prdetails_id": 8647,
  //                         "qty": 12.0
  //                     }
  //                 ],
  //                 "product": {
  //                     "id": 1,
  //                     "name": "(DOT MATRIX) PRINTER"
  //                 },
  //                 "qty": 1.0,
  //                 "quotation_id": 0,
  //                 "spec_config": {
  //                     "specification": "version : 1.9, XPrint Pro 2000 : XPrint Pro 2000"
  //                 },
  //                 "specification": "version : 1.9, XPrint Pro 2000 : XPrint Pro 2000",
  //                 "supplier_id": {
  //                     "address_id": 42353,
  //                     "code": "SU0010524",
  //                     "fullname": "SU0010524--SHREE KRISHNA TRAVELS - GANDHIDHAM",
  //                     "gstno": "",
  //                     "id": 10574,
  //                     "name": "SHREE KRISHNA TRAVELS - GANDHIDHAM",
  //                     "vendor_id": 9687
  //                 },
  //                 "unitprice": 500.0
  //             }
  //         ]
  //     }
  // ]

    this.branchForm = this.fb.group({
      type: ["", Validators.required],
      dts: [0, Validators.required],
      branch: ["", Validators.required],
      pca: [""],
      commodity: ["", Validators.required],
      employee_id: ["", Validators.required],
      // rows: this.fb.array(["", Validators.required]),
      file_key: [["fileheader"]],
      supplier: [""],
      product: [""],
      no: [""],
      product_type: [""],
      notepad: [""],
      justification: [""],
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
  this.branchForm.get("commodity")
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
      this.branchForm.get("product")
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
          this.branchForm.value?.commodity_id?.id,
          this.branchForm.value?.product_type?.id,
          value,1
        ).pipe(
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
      product_type: [""]
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
    // this.rows.clear();
    // this.getapprovedBRdata()
    // this.getCCBSArray.clear();
    // this.getproductFK();
    this.getEmployeeBranchData();
    this.getSummary();
  }
enterPressed = false
  onEnterKey(event: KeyboardEvent) {
  if (!this.enterPressed) {
    this.enterPressed = true;
    this.getSummary();
    setTimeout(() => {
      this.enterPressed = false;
    }, 500); 
  }

  event.preventDefault();      
  event.stopPropagation();  
}
  getSummary() {
    const rawFormValues = this.branchForm.value;
  
    const formValues: any = {
      commodity_id: rawFormValues?.commodity?.id || "",
      supplier_id: rawFormValues?.supplier?.id || "",
      no: rawFormValues?.no || "",
      producttype_id: rawFormValues?.product_type?.id || "",
      product_id: rawFormValues?.product?.id || "",
      qty: rawFormValues?.qty || ""
    };
  
    // Optional: Filter out empty values
    const filteredValues = Object.keys(formValues).reduce((acc, key) => {
      if (formValues[key]) {
        acc[key] = formValues[key];
      }
      return acc;
    }, {});
  
    this.spinnerservice.show();
    this.prposervice.getPrList(filteredValues).subscribe((res) => {
      if(res["code"]){
        this.toastr.error(res["description"]);
        
      this.spinnerservice.hide();
      return;
      }
      this.prList = res["data"][0];
    //   this.quotation_id: 0,
    //  this.quotationdetails_id: 0,
      this.spinnerservice.hide();
    });
  }
  
  getccbs(data){
    this.ccbsArr = data?.prccbs_ids;
  }
  ccbsArr: any = [];
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
  getCCBSArray(index: number): FormArray {
    return (this.branchForm.get("rows") as FormArray)
      .at(index)
      .get("prccbs") as FormArray;
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
      pr_for:[data.pr_request == 1 ? '1' : data.pr_request == 2 ? '2' : ''],
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
      branch_pr_request: [{ value:"", disabled: false }],
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

  createCCBSRow(data): FormGroup {
    return this.fb.group({
      branch_id: [data.branch_id || ""],
      bs: [data.bs || ""],
      cc: [data.cc || ""],
      qty: [data.qty || ""],
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
  // getSummary(id) {
  //   this.branchForm.controls["employee_id"].reset("");
  //   let dict = {
  //     commodity_id: id,
  //   };
  //   this.spinnerservice.show();
  //   this.prposervice.getapprovedBRdata(dict).subscribe((result) => {
  //     let datas = result["data"];
  //     this.ccbsdata = result["data"];

  //     if (datas.length <= 0) {
  //       this.notification.showInfo("No Record Found!");
  //       this.spinnerservice.hide();
  //     }

  //     this.rows.clear();
  //     datas.forEach((question) => {
  //       this.rows.push(this.createRow(question));
  //     });
  //     console.log("thsrows", this.rows);
  //     this.spinnerservice.hide();
  //   });
  // }

  getEmployeeBranchData() {
    this.spinnerservice.show();
    this.prposervice.getEmpBranchId().subscribe(
      (results: any) => {
        this.spinnerservice.hide();
        if (results.error) {
          this.spinnerservice.hide();
          this.notification.showWarning(results.error + results.description);
          this.branchForm["branch"].reset("");
          return false;
        }
      //   if (results?.code) {
      //   this.spinnerservice.hide();
      //   this.notification.showError(results?.description);
      //   return false;
      // }
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

  // getapprovedBRdata() {
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
  //     this.rows.clear();
  //     datas.forEach((question) => {
  //       this.rows.push(this.createRow(question));
  //     });
  //     console.log("thsrows", this.rows);
  //     this.spinnerservice.hide();
  //   });
  // }

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
    this.spinnerservice.show();
    let productData = this.SearchForm.value.mepno;
    this.prposervice.getcommodityDependencyFK(productData, "").subscribe(
      (results: any[]) => {
        console.log("Commodity result==>", results);

        this.spinnerservice.hide();
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
       this.branchForm.controls["pca"].reset("");
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
    this.spinnerservice.show();
    let commodity = this.branchForm?.value?.commodity?.id;
    let prod = this.branchForm?.value?.product_type?.id
    if(commodity == "" || commodity == null || commodity == undefined
    ){
      commodity = ''
    }
    if(prod == "" || prod == null || prod == undefined){
      prod = ''
    }
    //  if(prod == "" || prod == null || prod == undefined){
    //   this.notification.showError("Choose Product Type!");
    //   return;
    // }
    // let type = this.SearchForm.value.type
    let value = this.productInput.nativeElement.value;
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
        this.spinnerservice.hide();
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
    this.currentpageprod = 1;
    this.has_nextprod = true;
    this.has_previousprod = true;
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
                    this.branchForm.value?.commodity?.id,
                    this.branchForm.value?.product_type?.id,
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
  Search() {
    this.spinnerservice.show();
    let productData = this.SearchForm?.value;

    let data = {
      commodity_id: productData?.commodity_id?.id,
      product_id: productData?.product_id?.id,
      branch_id: productData?.branch_id?.id,
      qty: productData?.qty,
      product_type: productData?.product_type,
    };

    for (let i in data) {
      if (data[i] == null || data[i] == "" || data[i] == undefined) {
        delete data[i];
      }
    }

    this.prposervice.getapprovedBRdata(data).subscribe(
      (results) => {
        let datas = results["data"];
        this.rows.clear();
        datas.forEach((question) => {
          this.rows.push(this.createRow(question));
        });
        console.log("thsrows", this.rows);
        this.spinnerservice.hide();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.spinnerservice.hide();
      }
    );
  }

  public displayFnbranch(branch?: branchlistss): any | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }

  getbranchFK() {
    this.spinnerservice.show();
    this.prposervice.getbranchdd().subscribe(
      (results) => {
        this.spinnerservice.hide();
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
    this.spinnerservice.show();
    this.prposervice.getCatlog_NonCatlog().subscribe(
      (results: any[]) => {
        this.spinnerservice.hide();
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
     if(this.commodityid == undefined || this.commodityid == "" || this.commodityid == null){
      this.notification.showError("Please Choose Commodity")
      return
    }
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
          this.prposervice.getmepcommodityFKdd(value,this.commodityid, 1).pipe(
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
    // this.branchForm.get("commodity").reset();
    this.prposervice.getmepcommodityFKdd("",this.commodityid,1).subscribe(
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
  autocompletesupplierScroll() {
    // if (this.catalogtypeid === 1) {
      // let formarray = this.branchForm.get("rows") as FormArray;
      // let element = formarray.at(index);

      // const commodity = element.get("commodity_id").value;
      // const product = element.get("product_id").value;
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
                    .getsupplierPDependencyFKdd(
                      this.branchForm.value?.product?.id,
                      this.branchForm.value?.dts,
                      this.supplierInput.nativeElement.value,
                      this.currentpagesupplier + 1,
                      this.branchForm.value?.product_type?.id,
                      this.selectedTypeQ
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
    // }
    
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
                    this.prForm.value.commodity.id,
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
  getitemFK(index) {
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
    // this.SpinnerService.show();
    this.MAKE = true;
    console.log("data", this.MAKE);
    let formarray = this.branchForm.get("rows") as FormArray;
    let element = formarray.at(index);

    const commodity = element.get("commodity_id")?.value;
    const product = element.get("product_id")?.value;
    const supplier = element.get("supplier")?.value?.id;

    // Validate supplier, product, and commodity
    if (!(supplier || product || commodity)) {
      this.notification.showError("Kindly Choose Supplier and Product");
      this.spinnerservice.hide();
      return false;
    }

    this.spinnerservice.show();
    // this.dts = this.branchForm.get('dts').value;

    // Call the service to get items dependency
    this.prposervice
      .getitemsDependencyFK(product, this.dts, supplier)
      .subscribe(
        (results: any[]) => {
          this.spinnerservice.hide();
          let datas = results["data"];
          let data = results;

          //   if(datas[0].make == 0){
          //     this.notification.showError("No data is there against make")
          //     this.prForm.patchValue({
          //       unitprice: datas[0].unitprice,
          //       uom: datas[0].uom
          // })
          //   }
          //   else{
          //     this.itemList = datas;
          //   }
          // Handle results and perform actions
          this.currentpageitem = 1;
          this.has_nextitem = true;
          this.has_previousitem = true;

          this.itemList = datas;

          console.log("product", datas);

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
                  .getitemsDependencyFKdd(
                    this.prForm.value.product.id,
                    this.prForm.value.dts,
                    this.itemInput.nativeElement.value,
                    this.prForm.value.supplier,
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
  makeCheck(data, i, row) {
    this.is_model = data.model_check;
    // this.checkboxvalidation(i, row);
    if (!this.is_model) {
      this.notification.showInfo("No Model specified!");
    }

    if (this.is_model) {
      row.get("models").enable();
    }
  }
  public displayFnitem(item?: itemsLists): string | undefined {
    return item ? item.make.name : undefined;
  }
  public displayFnitem1(item?: itemsLists): string | undefined {
    return item ? item.name : undefined;
  }
  getmodall(index: number) {
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
    const product = element.get("product_id").value;
    let supplier = element.get("supplier").value.id;
    let make = element.get("items").value.make.id;

    this.spinnerservice.show();

    // Validate the required fields
    if (!supplier || !make) {
      this.notification.showError("Kindly Choose Supplier Name and Make");
      this.spinnerservice.hide();
      return false;
    }

    // Call the service to get the modal dependency
    this.prposervice
      .getmodalDependency(product, supplier, this.dts, make)
      .subscribe(
        (results: any[]) => {
          this.spinnerservice.hide();
          let datas = results["data"];
          let data = results;

          this.modelID = datas[0].model.id;
          this.modellname = datas[0].model.name;

          this.currentpagemodel = 1;
          this.has_nextmodel = true;
          this.has_previousmodel = true;

          // Check if no records are found
          if (datas?.length == 0) {
            this.notification.showInfo("No Records Found");
          }

          this.modelList = datas;
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
                    this.prForm.value.product.id,
                    this.prForm.value.dts,
                    this.prForm.value.items.id,
                    this.prForm.value.supplier,
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
                    this.prForm.value.product.id,
                    this.prForm.value.dts,
                    this.prForm.value.items.id,
                    this.prForm.value.supplier,
                    this.prForm.value.models.id,
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
  // getUnitPrice(data, index, row, id) {
  //   this.checkconfiguration = data.configuration_check;
  //   console.log(this.checkconfiguration, "data");
  //   this.checkboxvalidation(index, row);
  //   if(id == 1){
  //   if (!this.checkconfiguration) {
  //     this.notification.showInfo("No Configuration specified!");
  //   }}
  //   if (this.checkconfiguration) {
  //     row.get("specs").enable();
  //   }
  //   let formArray = this.branchForm.get("rows") as FormArray;
  //   let element = formArray.at(index);

  //   // if(this.configuration==true){
  //   element.patchValue({
  //     unitprice: data.unitprice,
  //   });
  //   formArray.controls.forEach((row: FormGroup) => {
  //     this.calculateAmount(row); // Calculate amount when quantity changes
  //     // this.calculateTotalAmount();
  //   }); // this.config = true;
  //   // }
  // }
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
    return this.prForm.get("uom");
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
 
  
  // setupValueChanges(index: number) {
  //   if (this.catalogtypeid === 1) {
  //     const rows = this.branchForm.get("rows") as FormArray;
  //     const group = rows.at(index) as FormGroup;
  //     const supplierControl = group.get("supplier");
  //     const product = group.get("product_id").value;

  //     if (supplierControl) {
  //       const sub = supplierControl.valueChanges
  //         .pipe(
  //           debounceTime(100),
  //           distinctUntilChanged(),
  //           tap(() => {
  //             this.isLoading = true;
  //           }),
  //           switchMap((value) =>
  //             this.prposervice
  //               .getsupplierDependencyFKdd(product, this.dts, value, 1)
  //               .pipe(
  //                 finalize(() => {
  //                   this.isLoading = false;
  //                 })
  //               )
  //           )
  //         )
  //         .subscribe(
  //           (results: any[]) => {
  //             let datas = results["data"];
  //             this.supplierList = datas;
  //           },
  //           (error) => {
  //             this.errorHandler.handleError(error);
  //             this.spinnerservice.hide();
  //           }
  //         );

  //       this.subscriptions.push(sub);
  //     }
  //   }
  //   if (this.catalogtypeid === 2) {
  //     const rows = this.branchForm.get("rows") as FormArray;
  //     const group = rows.at(index) as FormGroup;
  //     const supplierControl = group.get("supplier");
  //     const product = group.get("product_id").value;

  //     if (supplierControl) {
  //       const sub = supplierControl.valueChanges
  //         .pipe(
  //           debounceTime(100),
  //           distinctUntilChanged(),
  //           tap(() => {
  //             this.isLoading = true;
  //           }),
  //           switchMap((value) =>
  //             this.prposervice.getsupplierDependencyFKdd1(value, 1).pipe(
  //               finalize(() => {
  //                 this.isLoading = false;
  //               })
  //             )
  //           )
  //         )
  //         .subscribe(
  //           (results: any[]) => {
  //             let datas = results["data"];
  //             this.supplierList = datas;
  //           },
  //           (error) => {
  //             this.errorHandler.handleError(error);
  //             this.spinnerservice.hide();
  //           }
  //         );

  //       this.subscriptions.push(sub);
  //     }
  //   }
  // }
  autocompleteccScroll() {}
  // patchAmount(id) {
  //   const rowsArray = this.branchForm.get("rows") as FormArray;
  //   if (id === 1) {
  //     rowsArray.controls.forEach((row: FormGroup) => {
  //       row
  //         .get("unitprice")
  //         .valueChanges.pipe(
  //           debounceTime(300), // Debounce time for smooth user experience
  //           distinctUntilChanged() // Only emit if the value has changed
  //         )
  //         .subscribe(() => {
  //           this.calculateAmount(row); // Calculate amount when quantity changes
  //           // this.calculateTotalAmount();
  //         });
  //     });
  //   }
  //   if (id === 2) {
  //     rowsArray.controls.forEach((row: FormGroup) => {
  //       row
  //         .get("qty")
  //         .valueChanges.pipe(
  //           debounceTime(300), // Debounce time for smooth user experience
  //           distinctUntilChanged() // Only emit if the value has changed
  //         )
  //         .subscribe(() => {
  //           this.calculateAmount(row); // Calculate amount when quantity changes
  //           // this.calculateTotalAmount();
  //         });
  //     });
  //   }
  // }
  // calculateAmount(row: FormGroup) {
  //   const quantity = row.get("qty").value;
  //   const unitprice = row.get("unitprice").value;

  //   // Perform calculation if both quantity and unitprice are valid numbers
  //   if (
  //     quantity !== null &&
  //     unitprice !== null &&
  //     !isNaN(quantity) &&
  //     !isNaN(unitprice)
  //   ) {
  //     const calculatedAmount = quantity * unitprice;
  //     row.patchValue({ amount: calculatedAmount }, { emitEvent: false });
  //   }
  // }
  // calculateTotalAmount(amountToAdjust: number = 0) {
  //   this.total_amount = 0;

  //   const rowsArray = this.branchForm.get("rows") as FormArray;

  //   rowsArray.controls.forEach((row: FormGroup) => {
  //     const amount = row.get("amount")?.value;

  //     if (amount !== null && !isNaN(amount)) {
  //       this.total_amount += amount;
  //     }
  //   });

  //   this.total_amount += amountToAdjust;
  //   console.log("Updated total amount:", this.total_amount);
  // }
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
  //   if (row.value.checked === true) {
  //     this.notification.showInfo("Please Unselect a Record & Proceed!");
  //     return;
  //   }
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
  hideBackdrop() {
    const body = document.querySelector("body");
    this.renderer.removeClass(body, "modal-open");
    const backdrop = body.querySelector(".modal-backdrop");
    if (backdrop) {
      this.renderer.removeChild(body, backdrop);
    }
  }
  // multipleCCBS() {
  //   const newRow = this.fb.group({
  //     ccbsbranch: ["", Validators.required],
  //     bs: ["", Validators.required],
  //     cc: ["", Validators.required],
  //     ccbsqty: ["", Validators.required],
  //     // Include other specific form controls as needed
  //   });

  //   // Access the FormArray and push the new FormGroup
  //   const rowsArray = this.branchForm.get("rows") as FormArray;
  //   rowsArray.push(newRow);
  // }
  // addCCBSave(index: number, id): void {
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

  // wholeData() {
  //   const type = this.branchForm.get("type")?.value;
  //   const pca = this.branchForm.get("pca")?.value;
  //   const branchId = this.branchForm.get("branch")?.value?.id;
  //   const commodity_id = this.branchForm.get("commodity")?.value?.id;
  //   const employee_id = this.branchForm.get("employee_id")?.value?.id;
  //   const notepad = this.branchForm.get("notepad")?.value;
  //   if (
  //     commodity_id === "" ||
  //     commodity_id === null ||
  //     commodity_id === undefined
  //   ) {
  //     this.notification.showError("Commodity is mandatory");
  //     return;
  //   }
  //   if (type === "" || type === null || type === undefined) {
  //     this.notification.showError("Catalog/Non Catalog is mandatory");
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
  //   if (this.prdetails.length == 0) {
  //     this.notification.showError("Select any Record to Proceed!");
  //     return;
  //   }
  //   this.prdetails.forEach((obj) => {
  //     delete obj.id;
  //     delete obj.pr_for
  //   });
  //   let payloadDict = {
  //     type: type,
  //     mepno: pca,
  //     dts: this.dts,
  //     branch_id: branchId,
  //     employee_id: employee_id,
  //     commodity_id: commodity_id,
  //     notepad: notepad,
  //     file_key: ["fileheader"],
  //     prdetails: this.prdetails,
  //     totalamount: this.total_amount,
  //     used_branch_pr: this.used_branch_pr,
  //   };

  //   console.log("payloadarray", payloadDict);
  //   let datavalue = JSON.stringify(payloadDict);
  //   let formdata = new FormData();
  //   let HeaderFilesdata = this.filesHeader.value.file_upload;

  //   for (var i = 0; i < HeaderFilesdata.length; i++) {
  //     let keyvalue = "fileheader";
  //     let pairValue = HeaderFilesdata[i];

  //     if (HeaderFilesdata[i] == "") {
  //       console.log("");
  //     } else {
  //       formdata.append(keyvalue, pairValue);
  //     }
  //   }

  //   formdata.append("data", datavalue);
  //   this.spinnerservice.show();
  //   this.prposervice.prCreateForm(formdata,this.Services).subscribe(
  //     (result) => {
  //       this.spinnerservice.hide();
  //       if (
  //         result.code === "INVALID_DATA" &&
  //         result.description === "Invalid Data or DB Constraint"
  //       ) {
  //         this.spinnerservice.hide();
  //         this.notification.showError(result.code);
  //       }
  //       if (result.Error) {
  //         this.notification.showWarning(result.Error);
  //       } else if (
  //         result.code === "UNEXPECTED_ERROR" &&
  //         result.description === "Unexpected Internal Server Error"
  //       ) {
  //         this.spinnerservice.hide();
  //         this.notification.showError("Something went wrong");
  //       } else {
  //         this.spinnerservice.hide();
  //         this.notification.showSuccess("Successfully created!...");
  //         this.onSubmit.emit();
  //       }
  //       console.log("Form SUBMIT", result);
  //       return true;
  //     },
  //     (error) => {
  //       this.errorHandler.handleError(error);
  //       this.spinnerservice.hide();
  //     }
  //   );
  // }
  // isChecked(event, index) {
  //   let value = event.checked;

  //   let formArray = this.branchForm.get("rows") as FormArray;
  //   let formGroup = formArray.at(index) as FormGroup;
  //   let id = formGroup.get("id").value;
  //   let prdetail_id = formGroup.get("prdetail_id").value;
  //   console.log("formGroup.value", formGroup.value);

  //   let supplier_id = formGroup.get("supplier")?.value?.id;
  //   formGroup.get("supplier_id").setValue(supplier_id);

  //   let item_id = formGroup.get("items")?.value?.id;
  //   formGroup.get("item").setValue(item_id);

  //   let item_name = formGroup.get("items")?.value?.make?.name;
  //   formGroup.get("item_name").setValue(item_name);

  //   let model_id = formGroup.get("models")?.value?.id;
  //   formGroup.get("model_id").setValue(model_id);

  //   let model_name = formGroup.get("models")?.value?.model?.name;
  //   formGroup.get("model_name").setValue(model_name);

  //   let specs = formGroup.get("specs")?.value?.configuration;
  //   formGroup.get("specification").setValue(specs);

  //   let ccbs = formGroup.get("prccbs")?.value;
  //   let transformedCCBS = ccbs.map((data) => ({
  //     branch_id: data?.branch_id?.id ?? data.branch_id,
  //     cc: typeof data.cc === "string" ? data.cc : data.cc?.name,
  //     bs: typeof data.bs === "string" ? data.bs : data.bs?.name,
  //     qty: data.qty,
  //   }));

  //   let unit_price = formGroup.get("unitprice")?.value;
  //   if (
  //     unit_price == 0 ||
  //     unit_price == null ||
  //     unit_price == undefined ||
  //     unit_price == ""
  //   ) {
  //     this.notification.showInfo("Invalid Unit Price!");
  //     return false;
  //   }
  //   // Update the nested form array with transformed values
  //   // let ccbsFormArray = formGroup.get("prccbs") as FormArray;
  //   // ccbsFormArray.clear();
  //   // transformedCCBS.forEach((data) => {
  //   //   ccbsFormArray.push(
  //   //     this.fb.group({
  //   //       branch_id: [data.branch_id, Validators.required],
  //   //       bs: [data.bs, Validators.required],
  //   //       cc: [data.cc, Validators.required],
  //   //       qty: [data.qty, Validators.required],
  //   //       id: [""],
  //   //     })
  //   //   );
  //   // });
  //   // branch_id.get('branch_id').value.id;

  //   // formGroup.get('prccbs')['controls']['branch_id'].setValue(branch_id)

  //   if (value === true) {
  //     const pr_request = formGroup.get("pr_for")?.value;
  //     let dict;
  //     if(pr_request == "New"){
  //       dict = {
  //         "pr_request": 1, 
  //       } 
  //       formGroup.get("branch_pr_request").setValue(dict);
  //     } else if(pr_request == "Replacement"){
  //       dict = {
  //         "pr_request": 2, 
  //         "prdetail_id":prdetail_id
  //       } 
  //       formGroup.get("branch_pr_request").setValue(dict);
  //     }
  //     // if(formGroup.valid){
  //     // this.prdetails.push(formGroup.value);

  //     //         const formData = { ...formGroup.value };

  //     // delete formData.id;

  //     // this.prdetails.push({
  //     //     ...formData,
  //     //     prccbs: transformedCCBS
  //     // });
  //     this.prdetails.push({
  //       ...formGroup.value,
  //       prccbs: transformedCCBS,
  //     });

  //     this.used_branch_pr.push(id);
  //     console.log("this.used_branch_pr", this.used_branch_pr);

  //     this.calculateTotalAmount();

  //     console.log("this.prdetails", this.prdetails);
  //     // } else {
  //     //   this.notification.showWarning("Please fill all the details!");
  //     //   formGroup.get('checked').setValue(false);
  //     //   return false;
  //     // }
  //   }
  //   if (value === false) {
  //     // If unchecked, remove the item from prdetails array
  //     const indexToRemove = this.prdetails.findIndex((item) => item.id === id); // Find by unique ID
  //     if (indexToRemove !== -1) {
  //       const removedItem = this.prdetails.splice(indexToRemove, 1)[0]; // Remove the item and get it
  //       console.log("Removed item:", removedItem);
  //       this.used_branch_pr = this.used_branch_pr.filter(
  //         (itemId) => itemId !== id
  //       );
  //       console.log("this.used_branch_pr", this.used_branch_pr);

  //       // Pass the negative amount to subtract from total
  //       this.calculateTotalAmount(-removedItem.amount);

  //       console.log("this.prdetails", this.prdetails);
  //     }
  //   }
  // }
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
  // validateSuppliers(i, row) {
  //   const rows = this.rows.at(i) as FormGroup;
  //   const formArray = this.branchForm.get("rows") as FormArray;

  //   // If the form array has less than two items, no need for validation
  //   if (formArray.length < 2) {
  //     return;
  //   }

  //   console.log(i, "IIIII");
  //   console.log(rows, "rows");

  //   // Get the supplier ID of the clicked row
  //   const currentSupplier = rows.value.supplier;

  //   // Check if the supplier field in the current row is empty
  //   if (!currentSupplier || !currentSupplier.id) {
  //     return;
  //   }

  //   // Iterate through the form array and compare supplier IDs
  //   for (let index = 0; index < formArray.length; index++) {
  //     if (index !== i) {
  //       // Skip the clicked row itself
  //       const rowToCompare = formArray.at(index) as FormGroup;
  //       const supplierToCompare = rowToCompare.get("supplier").value;

  //       // Check if the supplier field in the row to compare is empty
  //       if (!supplierToCompare || !supplierToCompare.id) {
  //         continue;
  //       }

  //       if (currentSupplier.id !== supplierToCompare.id) {
  //         this.notification.showWarning("Commodity & Supplier must be same!");
  //         rows.get("supplier").reset();
  //         return;
  //       }
  //     }
  //   }
  // }

  backtoSummary() {
    this.spinnerservice.show();
    this.onCancel.emit();
    this.spinnerservice.hide();
  }
  getcomm(dict) {
    this.commodityid = dict?.id;
    this.techRealted = dict?.name?.toLowerCase() === "technology related-equipment".toLowerCase()
      ? dict?.name.toLowerCase()
      : "";
  }
  techRealted: string = "";
  getpcapopup() {
//     this.commodityid = dict?.id
// this.techRealted = dict?.name?.toLowerCase() === "technology related-equipment".toLowerCase()
//   ? dict?.name.toLowerCase()
//   : "";
    
    let pca = this.branchForm.value.pca;

    if (pca) {
      this.ismepdtl = true;
    }

    // console.log("mepno", IDMep)
    this.spinnerservice.show();
    this.prposervice.getmepdtl(pca, this.commodityid).subscribe(
      (result) => {
         if(result?.code){
          this.spinnerservice.hide()
          this.notification.showError(result?.description)
          return false
        }
        this.spinnerservice.hide();
        let datas = result["data"];
        this.MEPUtilizationAmountList = datas;
        this.par_no = datas[0]?.par_no;
        this.par_name = datas[0]?.par_name;
        this.par_amount = datas[0]?.par_amount;

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
  // mandatoryfield() {
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
  // }
  // checkboxvalidation(i, row) {
  //   // this.validateSuppliers(i, row);
  //   const rows = this.rows.at(i) as FormGroup;
  //   console.log(i, "i");
  //   console.log(row, "row");

  //   if (this.catalog === true) {
  //     if (row.value.commodity === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.branch === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.product_name === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.supplier === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.items === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.models === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.installationrequired === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.capitialized === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (this.checkconfiguration === true) {
  //       if (row.value.specs === "") {
  //         rows.get("checked").disable();
  //         return;
  //       }
  //     }

  //     // if(row.value.unitprice ===''){
  //     //   rows.get('checked').disable();
  //     //   return
  //     // }
  //     if (row.value.uom === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.qty === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     // let formArray = this.branchForm.get('rows') as FormArray;
  //     // let row = formArray.at(i) as FormGroup;
  //     else {
  //       rows.get("checked").enable();
  //     }
  //     const rowQuantity = row.get("qty").value;
  //     const ccbsArray = row.get("prccbs") as FormArray;

  //     // Calculate the sum of quantities in prccbs
  //     let ccbsQuantitySum = 0;
  //     ccbsArray.controls.forEach((ccbsRow) => {
  //       ccbsQuantitySum += ccbsRow.get("qty").value;
  //     });

  //     if (rowQuantity === ccbsQuantitySum) {
  //       // this.closebutton.nativeElement.click();
  //       // this.notification.showSuccess("CCBS Saved!");
  //       rows.get("checked").enable();
  //     } else {
  //       rows.get("checked").disable();

  //       // this.notification.showWarning('Required quantity and ccbs quantity must be equal!');
  //     }

  //     // if(row.value.amount ===''){
  //     //   rows.get('checked').disable();
  //     //   return
  //     // }
  //   }
  //   if (this.non_catalog === true) {
  //     if (row.value.commodity === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.installationrequired === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.capitialized === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.branch === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.product_name === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.supplier === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.items === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     // if(row.value.models ===''){
  //     //   rows.get('checked').disable();
  //     //   return
  //     // }
  //     // if(row.value.specs ===''){
  //     //   rows.get('checked').disable();
  //     //   return
  //     // }
  //     if (row.value.unitprice === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.uom === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     if (row.value.qty === "") {
  //       rows.get("checked").disable();
  //       return;
  //     }
  //     // if(row.value.amount ===''){
  //     //   rows.get('checked').disable();
  //     //   return
  //     // }
  //     else {
  //       rows.get("checked").enable();
  //     }
  //     const rowQuantity = row.get("qty").value;
  //     const ccbsArray = row.get("prccbs") as FormArray;

  //     // Calculate the sum of quantities in prccbs
  //     let ccbsQuantitySum = 0;
  //     ccbsArray.controls.forEach((ccbsRow) => {
  //       ccbsQuantitySum += ccbsRow.get("qty").value;
  //     });

  //     if (rowQuantity === ccbsQuantitySum) {
  //       // this.closebutton.nativeElement.click();
  //       // this.notification.showSuccess("CCBS Saved!");
  //       rows.get("checked").enable();
  //     } else {
  //       rows.get("checked").disable();

  //       // this.notification.showWarning('Required quantity and ccbs quantity must be equal!');
  //     }
  //   }
  // }

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

  reportDownload(){

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
    this.prposervice.getExcelDwnld(data)
    .subscribe((data) => {
      this.spinnerservice.hide()
      if(data['size']<=75){
        this.toastr.warning("",'Records Not Found',{timeOut:1500})
        return false;
      }else{
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'BPR Approved Report'+".xlsx";
      link.click();
      }
    },(error)=>{
      this.spinnerservice.hide()
    })

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
        this.spinnerservice.hide();
      }
    );
  }
  Products: boolean = true;
  Services: boolean;
  product_type: any;
  product_service(e){
    let value = e.id;
    this.product_type = value;
    this.Products = value == "P" ? true : false;
    this.Services = value == "S" ? true : false;
    if(this.Services){
      this.prForm.get('dts').setValue(0);
      this.prForm.get('dts').disable();
    } else {
      this.prForm.get('dts').enable();
    }
    // this.resetAfterCatlogChange();
    
  }
  assetArray: any;
  assetDetails(id) {
    this.spinnerservice.show();
    this.prposervice.getAssetDetails(id).subscribe((res) => {
      this.assetArray = res["asset"];
      this.spinnerservice.hide();
      if (res["asset"].length == 0) {
        this.notification.showInfo("No Data Found!");
      }
    });
  }

  selectedItems: any[] = [];

onCheckboxChange(checked: boolean, data, item: any): void {
  if (checked) {
    // Push if not already in array
    if(!this.branchForm.get('commodity').value){
      this.notification.showWarning("Please Select Commodity!");
      return;
    }
    if(!this.branchForm.get('pca').value && this.techRealted == "technology related-equipment"){
      this.notification.showWarning("Please Select PCA for Technology Related Equipment!");
      return;
    }
    let productType = data?.producttype?.id;
    const exists = this.selectedItems.some(i => i.id === item.id);
    if (!exists) {
      let dict = {product_type: productType, ...item};
      this.selectedItems.push(dict);
      // this.selectedItems.push(item);
    }
  } else {
    // Remove by unique identifier (e.g., id)
    this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
  }
  const totalAmount = this.selectedItems.reduce((acc, curr) => {
    const qty = Number(curr.qty) || 0;
    const unitPrice = Number(curr.unitprice) || 0;
    return acc + (qty * unitPrice);
  }, 0);
console.log("total",totalAmount)
  console.log('Selected Items:', this.selectedItems);
  this.totalamount = totalAmount
}
// onCheckboxChange(checked: boolean, item: any, event: Event): void {
//   if (checked) {
//     if (!this.branchForm.get('commodity')?.value) {
//       this.notification.showWarning("Please Select Commodity!");

//       (event.target as HTMLInputElement).checked = false;
//       return;
//     }

//     const exists = this.selectedItems.some(i => i.id === item.id);
//     if (!exists) {
//       this.selectedItems.push(item);
//     }
//   } else {
//     this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
//   }

//   console.log('Selected Items:', this.selectedItems);
// }

// onCheckboxChange(checked: boolean, item: any, event: Event): void {
//   const commoditySelected = this.branchForm.get('commodity')?.value;

//   if (checked) {
//     if (!commoditySelected) {
//       this.notification.showWarning("Please Select Commodity!");

//       // 👇 Uncheck only that checkbox
//       (event.target as HTMLInputElement).checked = false;
//       return;
//     }

//     const exists = this.selectedItems.some(i => i.id === item.id);
//     if (!exists) {
//       this.selectedItems.push(item);
//     }
//   } else {
//     this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
//   }

//   console.log('Selected Items:', this.selectedItems);
// }

isSelected(item: any): boolean {
  return this.selectedItems.some(i => i.id === item.id);
}

submitData(){
  if(this.selectedItems.length == 0){
    this.notification.showWarning("Please Select Atleast One Record!");
    return;
  }
  if(this.branchForm.get('commodity').value == null || this.branchForm.get('commodity').value == undefined || this.branchForm.get('commodity').value == ''){
    this.notification.showWarning("Please Select Commodity!");
    return;
  }
  // if(!this.branchForm.get('pca').value && this.techRealted == "technology related-equipment"){
  //     this.notification.showWarning("Please Select PCA for Technology Related Equipment!");
  //     return;
  //   }
  if(this.techRealted == "technology related-equipment" && (this.branchForm.get('pca').value == null || this.branchForm.get('pca').value == undefined || this.branchForm.get('pca').value == '')){
    this.notification.showWarning("Please Select PCA!");
    return;
  }
  if(this.branchForm.get('employee_id').value == null || this.branchForm.get('employee_id').value == undefined || this.branchForm.get('employee_id').value == ''){
    this.notification.showWarning("Please Select Delmat Approver!");
    return;
  }
  if(this.employeeLimit < this.totalamount) {
    this.notification.showWarning("Total Amount Exceeds the Employee Limit!");
    return;
  }
  // let data = {
  //   commodity_id: this.branchForm.get('commodity').value.id,
  //   product_id: this.branchForm.get('product').value.id,
  //   branch_id: this.branchForm.get('branch').value.id,
  //   type: this.branchForm.get('type').value,
  //   qty: this.branchForm.get('qty').value,
  //   prdetails: this.selectedItems
  // }
  this.spinnerservice.show();
  let data = this.generatePayload();
  console.log(data, "data");
  let formdata = new FormData();
  formdata.append("data", JSON.stringify(data));
  this.prposervice.prCreate(formdata).subscribe((res) => {
    this.spinnerservice.hide();
    if(res['code']){
      this.notification.showInfo(res['description']);
      // this.onCancel.emit();
    } else {
      this.notification.showSuccess("Successfully Created!");
      this.onSubmit.emit();
      
    }
  }, (error) => {
    this.spinnerservice.hide();
    this.errorHandler.handleError(error);
  })
}


 generatePayload() {
  const prdetails = this.selectedItems.map(item => {
    return {
      capitialized: 0,
      commodity_id: this.branchForm.get('commodity').value.id,
      type: 1,
      dts: this.branchForm.get('dts').value,
      employee_id: this.branchForm.get('employee_id').value.id,
      id: item.id,
      hsn: 0,
      hsnrate: 0,
      images: "",
      remarks: "",
      installationrequired: 0,
      specification: item.spec_config.specification,
      item: item.make.id,
      related_component_id: 0,
      related_component_name: "",
      item_name: item.make.name,
      product_id: item.product.id,
      product_name: item.product.name,
      model_id: item.model.id,
      model_name: item.model.name,
      catalog_id: item?.catalog_id,
      qty: item.qty,
      unitprice: item.unitprice,
      amount: Number(item.unitprice) * Number(item.qty),
      uom: item.uom,
      supplier_id: item.supplier_id.id,
      is_asset: 0,
      editable: false,
      product_type: item.product_type,
      // quotationid: 0,
      quotationid: item.quotation_id || 0,
      // quot_detailsid: 0,
      quot_detailsid: item.quotationdetails_id || 0,
      branch_pr_request: {
        pr_request: item.pr_request
      },
      prccbs: item.prccbs_ids.map(cc => ({
        branch_id: cc.branch_id?.id,
        bs: cc.bs,
        cc: cc.cc,
        qty: cc.qty,
        id: cc.id
      }))
    };
  });

  const totalamount = prdetails.reduce((sum, item) => sum + item.amount, 0);

  const payload = {
    type: 1,
    mepno: this.branchForm.get('pca').value,
    commodity_id: this.branchForm.get('commodity').value.id,
    dts: this.branchForm.get('dts').value,
    employee_id: this.branchForm.get('employee_id').value.id,
    branch_id: this.branchForm.get('branch').value.id,
    totalamount: totalamount,
    notepad: "",
    justification: this.branchForm.get('justification').value,
    prdetails: prdetails
  };

  return payload;
}
selectedTypeQ: number = 2;
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
      let page = 1;
      this.spinnerservice.show();
      this.prposervice
        .getsupplierDependencyFK1(product, this.dts, type, this.product_type, this.selectedTypeQ, page)
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
 
 autocompleteMepScroll() {
    setTimeout(() => {
      if (
        this.matmepAutocomplete &&
        this.autocompleteTrigger &&
        this.matmepAutocomplete.panel
      ) {
        fromEvent(this.matmepAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matmepAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matmepAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matmepAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matmepAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 50 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextmep == true) {
                if (this.mepcurrentpage == this.currentpagemep) {
                  return false;
                }
                this.prposervice
                  .getmepcommodityFKdd(
                    this.mepinput.nativeElement.value,this.commodityid,
                    this.currentpagemep + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.MEPList = this.MEPList.concat(datas);
                      if (this.MEPList.length > 0) {
                        this.has_nextmep = datapagination.has_next;
                        this.has_previousmep = datapagination.has_previous;
                        this.currentpagemep = datapagination.index;
                        this.mepcurrentpage = datapagination.index + 1;
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