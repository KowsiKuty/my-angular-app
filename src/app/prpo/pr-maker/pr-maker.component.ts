import {
  Component,
  OnInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
  TemplateRef,
  ChangeDetectorRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  AbstractControl,
  Validators,
} from "@angular/forms";
import { EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { PRPOSERVICEService } from "../prposervice.service";
import { Router } from "@angular/router";
import { NotificationService } from "../notification.service";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  filter,
  switchMap,
  finalize,
  takeUntil,
  map,
  startWith,
  catchError,
} from "rxjs/operators";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { Observable, from, fromEvent, of } from "rxjs";
import { PRPOshareService } from "../prposhare.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from "../error-handling-service.service";
import { resourceLimits } from "worker_threads";
import { G, H } from "@angular/cdk/keycodes";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { ReportserviceService } from "src/app/reports/reportservice.service";
import { ToastrService } from "ngx-toastr";

export interface mepnoLists {
  // no: string;
  id: number;
  mepno: string;
}

export interface productCategoryLists {
  no: string;
  name: string;
  id: number;
}

export interface productTypeLists {
  no: string;
  name: string;
  id: number;
}

export interface productLists {
  no: string;
  name: string;
  id: number;
  code: string;
}
export interface itemsLists {
  make: {
    no: string;
    name: string;
    id: number;
  };
  name: string;
}
export interface itemsListsmake {
  id: string;
  name: string;
}
export interface modelsLists {
  model: {
    no: string;
    name: string;
    id: number;
  };
}

export interface modelsList {
  id: any;
  name: any;
}
export interface specsLists {
  no: string;
  configuration: string;
  id: number;
}
export interface QuoteLists {
  // no: string;
  configuration: string;
  id: number;
  quotation: string;
}

export interface commoditylistss {
  id: string;
  name: string;
}

export interface supplierlistss {
  id: string;
  name: string;
  branch_data: any;
}

export interface branchlistss {
  id: any;
  name: string;
  code: string;
}

export interface HSNlistss {
  id: string;
  code: string;
}

export interface Emplistss {
  id: string;
  full_name: string;
}

export interface bslistss {
  id: string;
  name: string;
  bs: any;
}

export interface cclistss {
  id: string;
  costcentre_id: any;
  name: string;
}
export interface uomlistsss {
  id: string;
  name: string;
}

@Component({
  selector: "app-pr-maker",
  templateUrl: "./pr-maker.component.html",
  styleUrls: ["./pr-maker.component.scss"],
})
export class PrMakerComponent implements OnInit {
  prForm: FormGroup;
  files: FormGroup;
  filesHeader: FormGroup;
  filesCCBS: FormGroup; //7420
  selectedReportType: any = 0;
  selectedType: boolean = false;
  selectedPR: string = "1";
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  crntpg: number = 1;
  presentpage: number = 1;
  pageSize = 10;
  pgsize = 10;
  isLoading = false;
  MAKE: boolean = false;
  selectedToggle: string = "independentpr";
  independentpr: boolean = true;
  batchpr: boolean = false;
  quotationidnew: any;
  quotationdetailidnew: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onQuotation = new EventEmitter<any>();
  @Output() onQuotationCancel = new EventEmitter<any>();
  @Output() linesChange = new EventEmitter<any>();
  @Input() prsummary: any;

  MEPList: Array<mepnoLists>;

  productCategoryList: Array<productCategoryLists>;

  productTypeList: Array<productTypeLists>;

  productList: Array<productLists>;

  itemList: Array<itemsLists>;

  modelList: Array<modelsLists>;

  specsList: Array<specsLists>;

  commodityList: Array<commoditylistss>;

  supplierList: Array<supplierlistss>;

  branchList: Array<branchlistss>;

  employeeList: Array<Emplistss>;

  bslist: Array<bslistss>;

  cclist: Array<cclistss>;

  hsnrateList: Array<HSNlistss>;

  uomlist: Array<uomlistsss>;

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild("mepname") matmepAutocomplete: MatAutocomplete;
  @ViewChild("mepinput") mepinput: any;

  @ViewChild("productCategory") matproductCategoryAutocomplete: MatAutocomplete;
  @ViewChild("productCategoryInput") productCategoryInput: any;

  @ViewChild("productType") matproductTypeAutocomplete: MatAutocomplete;
  @ViewChild("productTypeinput") productTypeinput: any;

  @ViewChild("productcat") matproductAutocomplete: MatAutocomplete;
  @ViewChild("productInput") productInput: any;
  @ViewChild("productInputtype") productInputtype: any;

  @ViewChild("item") matitemAutocomplete: MatAutocomplete;
  @ViewChild("itemInput") itemInput: any;

  @ViewChild("model") matmodelAutocomplete: MatAutocomplete;
  @ViewChild("modelInput") modelInput: any;

  @ViewChild("spec") matspecsAutocomplete: MatAutocomplete;
  @ViewChild("specsInput") specsInput: any;

  @ViewChild("Quotation") matQuotationAutocomplete: MatAutocomplete;
  @ViewChild("QuotationInput") QuotationInput: any;

  @ViewChild("commodity") matcommodityAutocomplete: MatAutocomplete;
  @ViewChild("commodityInput") commodityInput: any;

  @ViewChild("emp") matempAutocomplete: MatAutocomplete;
  @ViewChild("empInput") empInput: any;

  @ViewChild("supplier") matsupplierAutocomplete: MatAutocomplete;
  @ViewChild("supplierInput") supplierInput: any;

  @ViewChild("supplierr") matsupplierrAutocomplete: MatAutocomplete;
  @ViewChild("supplierInputt") supplierInputt: any;

  @ViewChild("branch") matbranchAutocomplete: MatAutocomplete;
  @ViewChild("branchInput") branchInput: any;

  @ViewChild("bs") matbsAutocomplete: MatAutocomplete;
  @ViewChild("bsInput") bsInput: any;

  @ViewChild("cc") matccAutocomplete: MatAutocomplete;
  @ViewChild("ccInput") ccInput: any;

  @ViewChild("hsn") matHSNAutocomplete: MatAutocomplete;
  @ViewChild("hsnInput") hsnInput: any;

  @ViewChild("uom") matuomAutocomplete: MatAutocomplete;
  @ViewChild("uomInput") uomInput: any;
  @ViewChild("assetvalue") assetvalue: ElementRef;

  @ViewChild("takeInput", { static: false }) InputVar: ElementRef;
  @ViewChild("ccbsfile", { static: false }) ccbsinputfile: ElementRef; //7420

  // @ViewChild('mytemplate') mytemplate: TemplateRef<any>;
  @ViewChild("popupcontainer", { static: false }) popupcontainerbox: ElementRef;
  //////////////////////////////////////////////Yes or no radio button variables
  yesorno: any[] = [
    { value: 1, display: "Yes" },
    { value: 0, display: "No" },
  ];
  //////7421&7420
  prdetails_delete: any[] = [];
  prccbs_delete: any[] = [];
  /////////

  ///asset radio button BUG ID:7475 /////
  yesornoasset: any[] = [
    { value: 1, display: "Yes" },
    { value: 0, display: "No" },
  ];

  ///////////////// Edit or create
  isEditPRScreen: boolean;

  //////////////// Field enable disable variables
  Options: boolean = false;
  mepreadonly: boolean = false;
  comreadonly: boolean = false;
  prodcatreadonly: boolean = false;
  prodSubreadonly: boolean = false;
  prodreadonly: boolean = false;
  itemreadonly: boolean = false;
  modelreadonly: boolean = false;
  specreadonly: boolean = false;
  supplierreadonly: boolean = false;
  branchreadonly: boolean = false;
  ShowHideFile: boolean;
  ShowHideAssert: boolean;
  valuepr: any;
  ///////// edit PR variables for ID
  prapproveId: any;
  prodcatID = 0;

  ///////////// calculation amount variables

  amt: any;
  sum: any = 0.0;
  ////////////////////////ccbs related variables
  qtytotaloRow: any;
  RequiredQtyForThisccbs: any;

  ccbsqty: any;
  totalccbs: any;

  qtytotalInPopup: any;

  sums: any;
  cbqty: any;

  seletedPRdetailsIndex: any;
  selectedCCBSindex: any;

  //////////////////////////////popupmep global variables
  totalamount: any;
  pramt: any;
  poamt: any;
  remainamt: any;
  amount: number;
  quantitycount: number;
  mepnumber: string;
  description: any;

  ///////////////
  getCatlog_NonCatlogList: any;

  ///////////////////////////////////////////////// caltlog non catlog based variables
  dtsShow: boolean;
  productcatlog: boolean;
  itemcalog: boolean;
  radiochoice: boolean;
  modelcatlog: boolean;
  configcatlog: boolean;
  productNonCatlog: boolean;
  itemNonCalog: boolean;
  TypeData: any;
  branchid: any;
  DownloadnUploadExcelButton: boolean;

  ///////////////////////////////////////////////////////////////////patch index variable
  indexDet: any;
  commID: any;
  comid: any;
  status: any;
  CCBSindex: any;
  // isccbsbulkupload:any;
  isprbulkupload: boolean = false;
  blkuploadclkbtn: boolean;
  fileid: any;
  ccbskey: any;
  data: any; //7420
  ccbs_bfile_id: any;
  prblkuploadfile: any; //7421
  ccbsblkfile: any; //7420
  p = 1;
  pg = 1;
  ccbsdeleteid: any;
  dataPrDetailsid: any;
  index: any;
  ccbslength: number = 0;
  dataPrDetails: any;
  presentno: number;
  bulkeditid: any;
  editviewid: any;
  drafreditid: any; //7422
  ccbsdraftfileid: any; //7422
  draftnoncatfileid: any; //7422
  sliceddraftccbsfileid: any;
  sliceddraftccbsfileidnumber: number;
  sliceddraftnoncatfileid: any;
  userSelectedName: any;
  modelid: any;
  specid: any;
  isconfig: boolean = false;
  ismodel: any;
  modelID: any;
  modellname: any;
  configuration: boolean = false;
  catlogpayloadid: any;
  quotationnumbernew: any;
  conunitprice: any;
  is_make: boolean;
  is_model: any;
  isSupplier: boolean = false;
  isProduct: boolean = true;
  PRMaker: boolean = true;
  BPRMaker: boolean = false;
  totalcount: any;
  prmakert: boolean = true;
  assetForm: FormGroup;
   producttype_next = false;
  producttype_pre = false;
  producttype_crtpage= 1;
 prdTypes: any=[]
  @ViewChild("productauto") productAutocomplete: MatAutocomplete;
  // Lists = [
  //   {id:'1', text: 'Hardware'},
  //   {id:'2', text: 'Component'},
  //   {id:'3', text: 'Software'},
  //   {id:'4', text: 'Service'}
  // ]
  Lists: any = [];
  //   Lists = [
  //     {
  //         id: 1,
  //         text: "Goods & Service"
  //     },
  //     {
  //         id: 2,
  //         text: "Goods"
  //     },
  //     {
  //         id: 3,
  //         text: "Service"
  //     },
  //     {
  //         id: 4,
  //         text: "Hardware"
  //     },
  //     {
  //         id: 5,
  //         text: "Software"
  //     },
  //     {
  //         id: 6,
  //         text: "Component and IT Related Services"
  //     }
  // ];
  assets$: Observable<any[]>[] = [];
  showimageHeaderPreviewPDF: boolean = false;
  pdfurl: any;
  par_no: any;
  par_name: any;
  par_amount: any;
  new_array: any[]=[]

  constructor(
    private fb: FormBuilder,
    private prposervice: PRPOSERVICEService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    private prposhareService: PRPOshareService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingServiceService,
    private changeDetectorRef: ChangeDetectorRef,
    private reportService: ReportserviceService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.Options = false;
    this.mepreadonly = false;
    this.branchreadonly = false;
    this.comreadonly = false;
    this.prForm = this.fb.group({
      type: "",
      mepno: "",
      mepnokey: "",
      is_asset: [0], //7480
      prdetails_bfile_id: "", //7421
      draft_create: "", //4529
      commodity: "",
      commodity_id: "",
      productCategory: "",
      productType: "",
      prod_type_asset: "",
      product_for: "",
      asset_id: "",
      dts: [{ value: 0, disabled: false }, Validators.required],
      product_type: [""],
      product: "",
      items: "",
      models: "",
      modelsid: "",
      specs: "",
      specsid: "",
      itemsid: "",
      productnoncatlog: "",
      itemnoncatlog: "",
      supplier: "",
      supplier_id: "",
      service_des: "",
      unitprice: "",
      uom: "",
      employee_id: "",
      branch_id: "",
      totalamount: 0,
      notepad: "",
      justification: "",
      quotation: "",
      prdetails: this.fb.array([]),
      file_key: [["fileheader"]],
      // spec_config: [""],
      // related_component_id : 0,
      // related_component_name: "",
      // quotation_no: "--",
      // quotationid :[0],
      // quot_detailsid :[0] ,
    });

    this.files = this.fb.group({
      file_upload: new FormArray([]),
    });

    this.filesHeader = this.fb.group({
      file_upload: new FormArray([]),
    });

    //BUG ID:7420 CCBS BULK UPLOAD
    this.filesCCBS = this.fb.group({
      file_upload: new FormArray([]),
    });
    this.ismepdtl = false;
    this.getproductType();
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// MEP
    // let mepkey = ""
    // this.getmepFK()
    // this.prForm.get('mepno').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       // console.log('inside tap')

    //     }),
    //     switchMap(value => this.prposervice.getmepFKdd(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.MEPList = datas;

    //   },(error) => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// commodity

    // this.prForm.get('commodity').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       // console.log('inside tap')

    //     }),
    //     switchMap(value => this.prposervice.getcommodityDependencyFKdd(this.prForm.value.mepno, value, 1)
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// product cat

    // let prodcatkey = ""
    // this.getprodcatkeyFK(prodcatkey)

    // this.prForm.get('productCategory').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.prposervice.getproductCategoryFKdd(this.prForm.value.commodity.id, value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.productCategoryList = datas;

    //   },(error) => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   })

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// product type

    // this.prForm.get('productType').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.prposervice.getproductTypeFKdd(this.prForm.value.commodity?.id, this.prForm.value.productCategory?.id, value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe(
    //     response => {

    //       this.productTypeList = response["data"];
    //       console.log(this.productTypeList);
    //     },(error) => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }
    //   )

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// product

    // this.prForm.get('product').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       // console.log('inside tap')

    //     }),
    //     //6671 switchMap(value => this.prposervice.getproductDependencyFKdd(this.prForm.value.commodity.id, this.prForm.value.productCategory.id, this.prForm.value.productType.id, this.prForm.value.dts, value, 1)
    //     switchMap(value => this.prposervice.getproductDependencyFKdd(this.prForm.value.type,this.prForm.value.commodity.id, this.prForm.value.supplier.id,this.prForm.value.dts,value, 1)

    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];

    //     // if(datas.length == 0){
    //     //   this.notification.showInfo('No Records Found')
    //     // }
    //     this.productList = datas;

    //   },(error) => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   })

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// product comes first condition

    // this.prForm.get('product').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       // console.log('inside tap')

    //     }),
    //     //6671 switchMap(value => this.prposervice.getproductDependencyFKdd(this.prForm.value.commodity.id, this.prForm.value.productCategory.id, this.prForm.value.productType.id, this.prForm.value.dts, value, 1)
    //     switchMap(value => this.prposervice.getproductPDependencyFKdd(this.prForm.value.type,this.prForm.value.commodity.id,this.prForm.value.dts,value, 1)

    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];

    //     // if(datas.length == 0){
    //     //   this.notification.showInfo('No Records Found')
    //     // }
    //     this.productList = datas;

    //   },(error) => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// items/ models

    this.prForm
      .get("items")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice
            .getitemsDependencyFKdd(
              this.prForm.value.product.id,
              // this.prForm.value.dts,
              this.prForm.get("dts")?.value,

              this.prForm.value.supplier,
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
          let data = results;
          this.itemList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );

    this.prForm
      .get("models")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice
            .getmodelDependencyFKdd(
              this.prForm.value.product.id,
              this.prForm.value.items.id,
              // this.prForm.value.dts,
              this.prForm.get("dts")?.value,
              this.prForm.value.supplier,
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
          let data = results;
          this.modelList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );

    this.prForm
      .get("specs")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice
            .getspecsDependencyFKdd(
              this.prForm.value.product.id,
              this.prForm.value.models.id,
              this.prForm.value.items.id,
              // this.prForm.value.dts,
              this.prForm.get("dts")?.value,
              this.prForm.value.supplier,
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
          let data = results;
          this.specsList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// supplier
    // this.prForm.get('supplier').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       // console.log('inside tap')

    //     }),

    //     switchMap(value => this.prposervice.getsupplierDependencyFKdd1(value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.supplierList = datas;

    //   },(error) => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   })

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// product comes first condition

    // this.prForm.get('supplier').valueChanges
    // .pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    //   tap(() => {
    //     this.isLoading = true;
    //     // console.log('inside tap')

    //   }),

    //   switchMap(value => this.prposervice.getsupplierPDependencyFKdd(this.prForm.value.product.id,this.prForm.value.dts,value, 1)
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////branch
    let branchkeyvalue: String = "";
    this.getbranchFK();

    this.prForm
      .get("branch_id")
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// approver
    this.prForm
      .get("employee_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice
            .getemployeeApproverforPRDD(
              this.prForm.value.commodity.id,
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
          this.employeeList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );

    let data = this.prposhareService.prsummary.value;
    // let data = this.prsummary;
    console.log("draft status data==>", data);
    if (data != "") {
      this.prapproveId = data?.id;
      this.status = data.comments;
      this.patchForm(this.prapproveId);
      // this.getEmployeeBranchData();
      this.isEditPRScreen = true;
    } else {
      this.isEditPRScreen = false;
      // this.getCatlog_NonCatlog()
    }

    this.getCatlog_NonCatlog();
    this.getEmployeeBranchData();

    console.log("this.bulkeditid ngon init===>", this.bulkeditid);

    // this.updateTotalCount();
    // this.prForm.get('prdetails').valueChanges.subscribe(()=>{
    //   this.updateTotalCount();
    // })
  }
  getproductType() {
    // this.isLoading = true;
    this.prposervice.getproduct_type().subscribe(
      (results: any) => {
        if (results?.code) {
          this.SpinnerService.hide();
          this.notification.showError(results?.description);
          return false;
        }
        // this.isLoading = false;
        // let datas = results["data"];
        // let datapagination = results["pagination"];
        this.Lists = results["data"];
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
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Calculation
  addSpecConfig(id: number, specification: string, configuration) {
    let specConfig = this.prForm.get("spec_config") as FormControl;

    // Get existing value and parse it
    let existingValue = specConfig.value ? specConfig.value.specification : "";

    // Convert to array, remove duplicates, and join as a string
    let specList = existingValue ? existingValue.split(", ") : [];
    let newEntry = `${specification} : ${configuration}`;

    if (!specList.includes(newEntry)) {
      specList.push(newEntry);
    }

    // Set the new comma-separated value with the correct ID
    specConfig.setValue({
      id: id, // Dynamically set ID
      specification: specList.join(", "),
    });
    // this.quotationForm.get("remarks").setValue(specList.join(", "))
  }
  // updateTotalCount(){
  //   let PRFormdetailsData = this.prForm.value.prdetails
  //   this.totalcount = PRFormdetailsData.length
  // }

  calcTotalpatch(unitprice, qty, amount: FormControl) {
    const unitprices = Number(unitprice.value) || 0;
    const qtys = qty.value;
    amount.setValue(qtys * unitprices, { emitEvent: false });
    this.datasums();
  }
  calcTotal(fg: FormGroup) {
    const { qty, unitprice } = fg.controls;
      const qtyNum = Number(qty.value) || 0;
const priceNum = Number((unitprice.value || '0').toString().replace(/,/g, ''));
    // const amount = +(qty.value * unitprice.value).toFixed(2);
    const amount = +(qtyNum * priceNum).toFixed(2);
    fg.controls["amount"].setValue(amount, { emitEvent: false });
    this.datasums();
  }

  datasums() {
    const total = this.prForm.value.prdetails
      .reduce((sum, { amount }) => sum + amount, 0)
      .toFixed(2);
    // this.prForm.patchValue({
    //   totalamount: +total // Convert back to number if needed
    // });
    this.sum = +total;
    this.prForm.get("totalamount").setValue(+total);
  }

  requiredqty(prdet, prdetailsIndexs) {
    // requiredqty(prdet, prdetailsIndex) {

    let prdetailsIndex = this.pgsize * (this.pg - 1) + prdetailsIndexs; //7421

    this.RequiredQtyForThisccbs = prdet.value.qty;
    this.seletedPRdetailsIndex = prdetailsIndex;
    this.ccbsdeleteid = prdet.value.id; //7421
    // console.log("this.seletedPRdetailsIndex", this.seletedPRdetailsIndex)
    console.log("ccbsdeleteid from qnty==>", this.ccbsdeleteid);

    // let prdetailsvalue =JSON.parse(JSON.stringify(this.prForm.value.prdetails))
    let prdetailsvalue = this.prForm.value.prdetails;
    let ccbsvalue = prdetailsvalue[prdetailsIndex].prccbs;
    this.ccbslength = ccbsvalue.length;
    // console.log('ccbslength===>',this.ccbslength)
    // console.log('ccbsvalue==>',ccbsvalue.length)

    this.ccbsqty = this.prForm.value.prdetails[prdetailsIndex].prccbs.map(
      (x) => x.qty
    );
    // console.log('data check qty', this.ccbsqty);
    this.totalccbs = this.ccbsqty.reduce((a, b) => a + b, 0);
    // console.log('sum of totals ccbs ', this.totalccbs);
  }

  checkqtyvalue() {
    let datavalue = this.prForm.value.prdetails;
    // for (let i in datavalue) {
    this.ccbsqty = this.prForm.value.prdetails[
      this.seletedPRdetailsIndex
    ].prccbs.map((x) => x.qty);
    // console.log('data check qty', this.ccbsqty);
    this.totalccbs = this.ccbsqty.reduce((a, b) => a + b, 0);
    // console.log('sum of totals ccbs ', this.totalccbs);
    // }
  }





  //   var k;
  //   k = event.charCode;
  //   return k == 190 || (k >= 48 && k <= 57) || k == 46; //6556
  //   // return ((k == 190) || (k >= 48 && k <= 57));
  // }
omit_special_num(event) {
  let k = event.charCode ? event.charCode : event.keyCode;

  // Allow numbers (0–9) → ASCII 48–57
  if (k >= 48 && k <= 57) {
    return true;
  }

  // Allow dot (.) → ASCII 46
  if (k === 46) {
    return true;
  }

  return false;
}
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////popup
  openLink(event: MouseEvent): void {
    // this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  // dialogRef: any
  displayVal = "none";
  buttonOpacity = 1;
  openModal(prdetailsIndexs, prdetails, event) {
    // openModal(prdetailsIndex, prdetails, event) {
    prdetails.editable = true;
    let prdetailsIndex = this.pgsize * (this.pg - 1) + prdetailsIndexs; //7421
    this.CCBSindex = prdetailsIndex; //7420
    this.ccbsdraftfileid = prdetails.value.ccbs_bfile_id; //7422
    this.sliceddraftccbsfileid = this.ccbsdraftfileid?.slice(-3); //7422
    console.log("typeof sliced===>", typeof this.sliceddraftccbsfileid);
    this.sliceddraftccbsfileidnumber = Number(this.sliceddraftccbsfileid);

    let qtycheck = prdetails.value.qty;
    if (qtycheck == "" || qtycheck == null || qtycheck == undefined) {
      this.notification.showWarning("Please fill Quantity ");
      return false;
    }
    let unitpricecheck = prdetails.value.unitprice;
    if (
      unitpricecheck == "" ||
      unitpricecheck == null ||
      unitpricecheck == undefined
    ) {
      this.notification.showWarning("Please check Unitprice ");
      return false;
    }
    let uomcheck = prdetails.value.uom;
    if (uomcheck == "" || uomcheck == null || uomcheck == undefined) {
      this.notification.showWarning("Please fill UOM ");
      return false;
    }
    this.displayVal = "flex";
    // console.log("emp data", this.empBranchdata)
    let defaultValueCCBSCheck = this.prForm.value.prdetails;
    // console.log("event data get ", event)
    // console.log("event of particular dataaa ", this.prForm.get('prdetails')['controls'][prdetailsIndex].get('prccbs')['controls'][0].get('qty'))
    // if(defaultValueCCBSCheck.length == 1){
    // this.prForm.get('prdetails')['controls'][prdetailsIndex].get('prccbs')['controls'][0].get('qty').setValue(qtycheck)
    // this.prForm.get('prdetails')['controls'][prdetailsIndex].get('prccbs')['controls'][0].get('branch_id').setValue(this.empBranchdata)
    // }
  }

  dataccbs: boolean = false;
  saveccbs(prdetailsIndexs, prdetails) {
    // saveccbs(prdetailsIndex, prdetails) {
    let prdetailsIndex = this.pgsize * (this.pg - 1) + prdetailsIndexs; //7421
    // document.getElementById('popupcontainer').style.display = "none";
    prdetails.editable = false;
    this.displayVal = "none";
    let datavalue = this.prForm.value.prdetails[prdetailsIndex].prccbs;
    if (datavalue.length == 0) {
      this.notification.showWarning("CCBS Details Not filled");
    }
    // BUG ID:6544-C
    else {
      let datadetails = this.prForm.value.prdetails;
      let prccbsdata = datadetails[prdetailsIndex].prccbs;
      for (let ccbs in prccbsdata) {
        let branchdata = prccbsdata[ccbs].branch_id;
        let bsdata = prccbsdata[ccbs].bs;
        let ccdata = prccbsdata[ccbs].cc;
        let qtydataOnCCBS = prccbsdata[ccbs].qty;
        let detailIndex = Number(prdetailsIndex);
        let ccbsindex = Number(ccbs);
        if (branchdata == "" || branchdata == null || branchdata == undefined) {
          this.notification.showWarning(
            "Please fill branch details at line " +
              (detailIndex + 1) +
              " in CCBS at line " +
              (ccbsindex + 1)
          );
          return false;
        }
        if (bsdata == "" || bsdata == null || bsdata == undefined) {
          this.notification.showWarning(
            "Please fill BS details at line " +
              (detailIndex + 1) +
              " in CCBS at line " +
              (ccbsindex + 1)
          );
          return false;
        }
        if (ccdata == "" || ccdata == null || ccdata == undefined) {
          this.notification.showWarning(
            "Please fill CC details at line " +
              (detailIndex + 1) +
              " in CCBS at line " +
              (ccbsindex + 1)
          );
          return false;
        }
        if (
          qtydataOnCCBS == "" ||
          qtydataOnCCBS == null ||
          qtydataOnCCBS == undefined
        ) {
          this.notification.showWarning(
            "Please fill Quantity details at line " +
              (detailIndex + 1) +
              " in CCBS at line " +
              (ccbsindex + 1)
          );
          return false;
        }
      }
    }
    //BUG ID:6544-C

    this.ccbsqty = this.prForm.value.prdetails[
      this.seletedPRdetailsIndex
    ].prccbs.map((x) => x.qty);
    // console.log('data check qty', this.ccbsqty);
    this.qtytotalInPopup = this.ccbsqty.reduce((a, b) => a + b, 0);
    // console.log('sum of totals qtytotalInPopup ', this.qtytotalInPopup);
    if (this.RequiredQtyForThisccbs != this.totalccbs) {
      this.notification.showWarning(
        "Required quantity and ccbs quantity must be equal"
      );
    }
    // else {
    //   // this.dataccbs = true
    //   prdetails.editable = false
    //   // this.displayVal = "flex";
    // }
  }
  closepopup(prdetails) {
    prdetails.editable = false;
    this.displayVal = "none";
  }
  //////////////////////////////////////////////// CCBS Validation

  ccbqty(data) {
    let datavalue = this.prForm.value.prdetails;
    for (let i in datavalue) {
      for (let j in datavalue[i]) {
        this.ccbsqty = this.prForm.value.prdetails[i].prccbs.map((x) => x.qty);
        // console.log('data check qty', this.ccbsqty);
        this.sums[i] = this.ccbsqty.reduce((a, b) => a + b, 0);
        // console.log('sum of totals ', this.sums);
        this.cbqty = this.sums[i];
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////// get functions
  commodityId;
  MEPUtilizationAmountList: any;
  getcomId(commodity) {
    this.commodityId = commodity?.id;
    this.prForm.value.commodity_id = this.commodityId;
  }
  getmepdtl() {
    let dataMep = this.prForm.value.mepno;
    let dataCom = this.prForm.value.commodity.id;
    if (dataMep == "") {
      this.ismepdtl = false;
      return false;
    } else {
      this.ismepdtl = true;
    }
    let IDMep: any;
    if (typeof dataMep == "string") {
      IDMep = dataMep;
    } else {
      IDMep = dataMep.no;
    }
    // console.log("mepno", IDMep)
    this.SpinnerService.show();
    this.prposervice.getmepdtl(IDMep, dataCom).subscribe(
      (result) => {
        if (result?.code) {
          this.SpinnerService.hide();
          this.notification.showError(result?.description);
          return false;
        }
        this.SpinnerService.hide();
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
        this.remainamt = datas[0]?.unutilized_amount;
        if (result.code == "Check PCA Data") {
          this.notification.showWarning(result.description);
        }
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
        this.SpinnerService.hide();
      }
    );
    // if (this.mepid != '') {
    //   this.ismepdtl = true
    // } else {
    //   this.ismepdtl = false

    // }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////// dropdown scrolls, get fucn

  getCatlog_NonCatlog() {
    this.SpinnerService.show();
    this.prposervice.getCatlog_NonCatlog().subscribe(
      (results: any) => {
        if (results?.code) {
          this.SpinnerService.hide();
          this.notification.showError(results?.description);
          return false;
        }
        this.SpinnerService.hide();
        let datas = results["data"];
        this.getCatlog_NonCatlogList = datas;
        // console.log("getCatlog_NonCatlog", datas)
        this.patchCatlogNoncatlog();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  patchCatlogNoncatlog() {
    if (this.isEditPRScreen == false) {
      const toSelect = this.getCatlog_NonCatlogList?.find((c) => c.id == 1);
      this.prForm.patchValue({
        type: toSelect.id,
      });
    }
    this.CatlogOrNotCatlog();
  }

  CatlogOrNotCatlog() {
    let catlogOrNonCatlog = this.prForm.value.type;
    this.TypeData = this.prForm.value.type;
    // console.log("checking value for catlog non catlog", catlogOrNonCatlog)
    // console.log('this.TypeData==>',this.TypeData)
    if (catlogOrNonCatlog == "1") {
      this.dtsShow = true;
      this.productcatlog = true;
      this.itemcalog = true;
      this.radiochoice = true;
      this.modelcatlog = true;
      this.configcatlog = true;
      this.productNonCatlog = false;
      this.itemNonCalog = false;
      // this.prForm.get("productCategory").enable();
      // this.prForm.get("productType").enable();
      this.isProduct = true;
      this.isSupplier = false;

      this.ShowHideAssert = false;
      this.ShowHideFile = true;

      this.DownloadnUploadExcelButton = false;
    }
    if (catlogOrNonCatlog == "2") {
      this.dtsShow = false;
      this.productcatlog = true;

      this.itemcalog = false;
      this.isProduct = false;
      this.isSupplier = true;
      this.radiochoice = false;
      this.modelcatlog = false;
      this.configcatlog = false;
      this.productNonCatlog = false;
      this.itemNonCalog = true;
      // this.prForm.get('productCategory').disable();
      // this.prForm.get('productType').disable();
      // this.prForm.get("productCategory").enable();
      // this.prForm.get("productType").enable();

      this.ShowHideAssert = true;
      this.ShowHideFile = false;

      this.DownloadnUploadExcelButton = true;
      console.log((this.DownloadnUploadExcelButton = true));
    }
  }

  ///////////////////////////////////////////////////////////////// validations

  resetAfterCatlogChange() {
    let prFormData = this.prForm.value.prdetails;
    if (prFormData.length == 0) {
      this.prForm.controls["dts"].reset(0);
      this.prForm.controls["mepno"].reset("");
      this.prForm.controls["mepnokey"].reset("");
      this.prForm.controls["productCategory"].reset("");
      this.prForm.controls["product_type"].reset("");
      this.prForm.controls["product"].reset("");
      this.prForm.controls["items"].reset("");
      this.prForm.controls["models"].reset("");
      this.prForm.controls["specs"].reset("");
      this.prForm.controls["productnoncatlog"].reset("");
      this.prForm.controls["itemnoncatlog"].reset("");
      this.prForm.controls["commodity"].reset("");
      this.prForm.controls["commodity_id"].reset("");
      this.prForm.controls["supplier"].reset("");
      this.prForm.controls["supplier_id"].reset("");
      this.prForm.controls["employee_id"].reset("");
      // this.prForm.controls["branch_id"].reset("");
      this.prForm.controls["unitprice"].reset("");
      this.prForm.controls["totalamount"].reset(0);
      this.ismep = false;
      this.ismepdtl = false;
      this.product_type = "";
      // (this.prForm.get('prdetails') as FormArray).clear();
    }
  }
  Products: boolean = true;
  Services: boolean;
  product_type: any;
  product_type1: any;
  product_dict: any;
  selectedVersion: number = 0;
  // isQuotation: any = 1;
  price_Quot(event: MatButtonToggleChange) {
    this.selectedTypeQ = event.value; // Use event.value, NOT event.id
    this.product_dict = event; // This stores the whole event object if needed
    this.prForm.controls["product"].reset("");
    this.prForm.controls["items"].reset("");
    this.prForm.controls["models"].reset("");
    this.prForm.controls["specs"].reset("");
    this.prForm.controls["productnoncatlog"].reset("");
    this.prForm.controls["itemnoncatlog"].reset("");
    this.prForm.controls["product_type"].reset("");
    this.prForm.controls["quotation"].reset("");
    this.prForm.controls["supplier"].reset("");
    this.prForm.controls["supplier_id"].reset("");
    this.prForm.controls["employee_id"].reset("");
    // this.prForm.controls["branch_id"].reset("");
    this.prForm.controls["unitprice"].reset("");
    this.prForm.controls["totalamount"].reset(0);
    if (this.selectedTypeQ == 2) {
      this.prForm.controls["dts"].disable();
      this.prForm.controls["dts"].setValue(0);
    }
    if (this.selectedTypeQ == 1) {
      this.prForm.controls["dts"].enable();
      this.prForm.controls["dts"].setValue(0);
    }

    // this.resetAfterCatlogChange();
  }
  selectedTypeQ = 1;
  product_type_name: any;
  product_for: boolean = false;
  assetArrayy: any = [];

  pcaValidation() {
    // this.prForm.value.mepno;

    // if(PRFormData.commodity.name.toLowerCase() === "technology related-equipment".toLowerCase() && PRFormData.mepno == "" || PRFormData.mepno == null || PRFormData.mepno == undefined){

    if (
      this.prForm.value.commodity.name.toLowerCase() ===
        "technology related-equipment" &&
      this.independentpr == true &&
      (this.prForm.value.mepno == "" ||
        this.prForm.value.mepno == null ||
        this.prForm.value.mepno == undefined)
    ) {
      this.notification.showWarning("Please Select PCA!");
      this.Lists = [];
      return false;
    } else {
      setTimeout(() => {
        this.getProductTypes();
      }, 100);
    }
  }
  product_service(e) {
    this.product_type = e.id;
    this.product_dict = e;
    this.prForm.controls["supplier"].reset("");
    this.prForm.controls["product"].reset("");
    this.prForm.controls["items"].reset("");
    this.prForm.controls["models"].reset("");
    this.prForm.controls["specs"].reset("");
    this.prForm.controls["unitprice"].reset("");
    this.prForm.controls["quotation"].reset("");

    this.product_type_name = e.name;
    if (
      this.product_type_name == "Component" ||
      this.product_type_name == "Service" ||
      this.product_type_name == "Software" ||
      this.product_type_name == "IT Related Services"
    ) {
      this.product_for = true;
    } else {
      this.product_for = false;
      this.assetArrayy = [];
      this.prForm.get("product_for").reset();
      this.prForm.get("asset_id").reset();
    }
    // this.Products = value == "P" ? true : false;
    // this.Services = value == "S" ? true : false;
    // if(this.Services){
    //   this.prForm.get('dts').setValue(0);
    //   this.prForm.get('dts').disable();
    // } else {
    //   this.prForm.get('dts').enable();
    // }
    // this.resetAfterCatlogChange();
  }
  product_service1(e) {
    this.product_type1 = e.id;
    this.prForm.get('product_for').reset()
    this.prForm.get('asset_id').reset()
  }
  productClick(event: MatButtonToggleChange) {
    let value = event.value; // Get the selected toggle value

    this.isSupplier = value === true;
    this.isProduct = !this.isSupplier; // Toggle the opposite state

    // Reset form fields
    this.prForm.get("product")?.reset();
    this.prForm.get("supplier")?.reset();
    this.prForm.get("items")?.reset();
    this.prForm.get("models")?.reset();
    this.prForm.get("specs")?.reset();
    this.prForm.get("unitprice")?.reset();
  }

  // productClick(e) {
  //   let value = e.checked;
  //   // this.isProduct = value == false ? true : false;
  //   // this.isSupplier = value == true ? true : this.isProduct == false;
  //   if (value == true) {
  //     this.isSupplier = true;
  //     this.isProduct = false;
  //   } else {
  //     this.isSupplier = false;
  //     this.isProduct = true;
  //   }
  //   this.prForm.get("product").reset();
  //   this.prForm.get("supplier").reset();
  //   this.prForm.get("items").reset();
  //   this.prForm.get("models").reset();
  // }

  supplierClick() {
    this.isSupplier = true;
    this.isProduct = false;
  }

  dtsValidation(event) {
    let prformValue = this.prForm.value.prdetails;
    if (prformValue.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      this.notification.showWarning(
        "This action is not allowed Please delete Product if you want to change in Details below"
      );
      return false;
    }
    if (prformValue.length == 0) {
      this.prForm.controls["productCategory"].reset("");
      this.prForm.controls["product_type"].reset("");
      this.prForm.controls["product"].reset("");
      this.prForm.controls["items"].reset("");
      this.prForm.controls["models"].reset("");
      this.prForm.controls["specs"].reset("");
      this.prForm.controls["productnoncatlog"].reset("");
      this.prForm.controls["itemnoncatlog"].reset("");
      this.prForm.controls["commodity"].reset("");
      this.prForm.controls["supplier"].reset("");
      // this.prForm.controls["branch_id"].reset("");
      this.prForm.controls["unitprice"].reset("");
    }
  }
  resetMepChange() {
    let prformValue = this.prForm.value.prdetails;
    if (prformValue.length > 0) {
      this.notification.showWarning(
        "This action is not allowed to add, Please delete Product if you want to change in Details below"
      );
      return false;
    }
    this.prForm.controls["mepno"].reset("");
    this.ismepdtl = false;
  }
  resetAfterMepChange() {
    let prformValue = this.prForm.value.prdetails;
    if (prformValue.length > 0) {
      this.notification.showWarning(
        "This action is not allowed to add, Please delete Product if you want to change in Details below"
      );
      return false;
    }
    let prFormData = this.prForm.value.prdetails;
    if (prFormData.length == 0) {
      this.prForm.controls["productCategory"].reset("");
      this.prForm.controls["product_type"].reset("");
      this.prForm.controls["product"].reset("");
      this.prForm.controls["items"].reset("");
      this.prForm.controls["models"].reset("");
      this.prForm.controls["specs"].reset("");
      this.prForm.controls["productnoncatlog"].reset("");
      this.prForm.controls["itemnoncatlog"].reset("");
      // this.prForm.controls["commodity"].reset("");
      this.prForm.controls["supplier"].reset("");
      // this.prForm.controls["branch_id"].reset("");
      this.prForm.controls["unitprice"].reset("");
    }
  }
  mep_name: any;
  pcaId(mep) {
    this.mep_name = mep.name;
    this.getproductType();
  }
  resetAfterCommodityChange(type) {
    this.prForm.controls["productCategory"].reset("");
    this.prForm.controls["product_type"].reset("");
    this.prForm.controls["product"].reset("");
    this.prForm.controls["items"].reset("");
    this.prForm.controls["models"].reset("");
    this.prForm.controls["specs"].reset("");
    this.prForm.controls["productnoncatlog"].reset("");
    this.prForm.controls["itemnoncatlog"].reset("");
    this.prForm.controls["unitprice"].reset("");
    let prFormData = this.prForm.value.prdetails;

    if (type == "removecom") {
      this.prForm.controls["commodity"].reset("");
      this.prForm.controls["mepno"].reset("");
    }
    this.ismepdtl = false;
  }

  resetAfterProdCatChange(type) {
    this.prForm.controls["product_type"].reset("");
    this.prForm.controls["product"].reset("");
    this.prForm.controls["items"].reset("");
    this.prForm.controls["models"].reset("");
    this.prForm.controls["specs"].reset("");
    this.prForm.controls["productnoncatlog"].reset("");
    this.prForm.controls["itemnoncatlog"].reset("");
    this.prForm.controls["unitprice"].reset("");
    let prFormData = this.prForm.value.prdetails;
    if (prFormData.length == 0) {
      this.prForm.controls["supplier"].reset("");
    }
    if (type == "removePC") {
      this.prForm.controls["productCategory"].reset("");
    }
  }

  // resetAfterProdTypeChange(type) {
  //   this.prForm.controls["product"].reset("")
  //   this.prForm.controls["items"].reset("")
  //   this.prForm.controls["productnoncatlog"].reset("")
  //   this.prForm.controls["itemnoncatlog"].reset("")
  //   this.prForm.controls["unitprice"].reset("");
  //   let prFormData = this.prForm.value.prdetails
  //   if (prFormData.length == 0) {
  //     this.prForm.controls["supplier"].reset("")
  //   }
  //   if( type == 'removePT'){
  //     this.prForm.controls["productType"].reset("")
  //   }
  // }
  resetBranch(index: number) {
    const prdetails = this.prForm.get("prdetails") as FormArray;
    prdetails.at(index).get("branch_id")?.reset();
  }
  resetProd(index: number) {
    const prdetails = this.prForm.get("prdetails") as FormArray;
    prdetails.at(index).get("prod")?.setValue("");
    const rowGroup = prdetails.at(index) as FormGroup;
    this.prod_id = "";
    rowGroup.get("items")?.disable();
    rowGroup.get("models")?.disable();
  }
  resetAss(index: number) {
    const prdetails = this.prForm.get("prdetails") as FormArray;
    prdetails.at(index).get("asset_id")?.reset();
    this.asset_id = "";
  }
  resetAfterProductChange(type, data) {
    // this.prForm.controls["items"].reset("");
    // this.prForm.controls["models"].reset("");
    // this.prForm.controls["specs"].reset("");
    // this.prForm.controls["productnoncatlog"].reset("");
    // this.prForm.controls["itemnoncatlog"].reset("");
    // this.prForm.controls["unitprice"].reset("");
    // let prFormData = this.prForm.value.prdetails;
    // if (data == "removeProd") {
    //   this.prForm.controls["product"].reset("");
    // }
    // if (data == "removeProd") {
    //   this.prForm.controls["product"].reset("");
    // }
    // if (data == "removeProdF") {
      this.prForm.controls["product_for"].reset("");
      // this.brForm.controls["product"].reset("");
      // this.assetForm.controls["product_name"].reset("");
    // }
    this.quotationnumbernew = "";
    this.quotationidnew = "";
    this.quotationdetailidnew = "";
    // this.is_make =data.make_check
    // if (this.is_make == false) {
    //   this.prForm.patchValue({
    //      item: '',
    //      item_name: ''
    //     });
    // }
  }
  make_id: any;
  makeCheck(data) {
    this.is_model = data.model_check;
    if (!this.is_model) {
      this.quotationnumbernew = data.quotation_no;
      if(this.quotationnumbernew != 0 || this.quotationnumbernew == ""){
       this.quotationget()
      console.log("quotation",this.quotationnumbernew)
      }
      console.log("quotation", this.quotationnumbernew);
    }
    this.make_id = data?.id;
  }
  resetAfterItemChange() {
    this.prForm.controls["items"].reset("");
    this.prForm.controls["models"].reset("");
    this.prForm.controls["specs"].reset("");
    this.prForm.controls["unitprice"].reset("");
    this.quotationnumbernew = "";
    this.quotationidnew = "";
    this.quotationdetailidnew = "";
  }
  resetAfterQuotChange() {
    this.prForm.controls["items"].reset("");
    this.prForm.controls["models"].reset("");
    this.prForm.controls["quotation"].reset("");
    this.prForm.controls["unitprice"].reset("");
    this.specList = [];
  }
  resetAfterModelChange() {
    this.prForm.controls["models"].reset("");
    this.prForm.controls["specs"].reset("");
    this.prForm.controls["unitprice"].reset("");
    this.quotationnumbernew = "";
    this.quotationidnew = "";
    this.quotationdetailidnew = "";
  }
  resetAfterSpecsChange() {
    this.prForm.controls["specs"].reset("");
    this.prForm.controls["unitprice"].reset("");
    this.quotationnumbernew = "";
    this.quotationidnew = "";
    this.quotationdetailidnew = "";
  }
  resetAfterSupplierChange() {
    this.prForm.controls["supplier"].reset("");
    this.prForm.controls["items"].reset("");
    this.prForm.controls["models"].reset("");
    this.prForm.controls["specs"].reset("");
    this.prForm.controls["unitprice"].reset("");
    this.quotationnumbernew = "";
    this.quotationidnew = "";
    this.quotationdetailidnew = "";
  }
  resetAfterBranchChange() {
    this.prForm.controls["branch_id"].reset("");
  }

  /////////////////////////////////////////////////////////////////////////// Add / Delete
  FormGroupArray: any;
  mepid: any;
  ismepdtl: boolean = false;
  ismep: boolean;
  ForCatlog: boolean;
  assetArray: any = [];

  //adding prform.prdetails form control name
  get prdetails(): FormGroup {
    let catlogOrNonCatlogtype = this.prForm.value.type;
    let specs = "",
      notepad = "",
      model = "",
      model_id = 0;
    // specs = (this.Services == true) ? this.prForm.value?.service_des : this.prForm.value.items.make?.name;
    // notepad = (this.Services == true) ? this.prForm.value?.notepad : this.prForm.value.specs?.configuration;
    // model = (this.Services == false) ? this.prForm.value.models.model?.name : "";
    // model_id = (this.Services == false) ? this.prForm.value.models.model?.id : 0;
    // console.log("this.prForm.value",this.prForm.value)
    if (catlogOrNonCatlogtype == "1") {
      this.ForCatlog = true;

      let FormGroupArray = this.fb.group({
        capitialized: 0,
        hsn: 0,
        hsnrate: 0,
        images: "",
        remarks: "",
        installationrequired: 0,
        // item: this.prForm.value?.items,
        item: this.prForm.value.items?.id,
        // item_name: specs,
        // model: this.prForm.value.models,
        // model_name: model,
        // model_id: model_id,
        // specification: notepad,

        item_name:
          this.selectedTypeQ == 1
            ? this.prForm.value?.items?.make?.name
            : this.prForm.value?.items,
        model: this.prForm.value?.models,
        model_name:
          this.selectedTypeQ == 1
            ? this.prForm.value.models?.model?.name
            : this.prForm.value?.models,
        model_id: this.prForm.value.models?.model?.id,
        specification:
          this.selectedTypeQ == 1
            ? this.prForm.value.specs?.configuration
            : this.prForm.value.specs,
        catalog_id:
          this.prForm.value?.items?.id ||
          this.prForm.value.models?.id ||
          this.prForm.value?.specs?.id ||
          0,
        related_component_id: 0,
        related_component_name: "",
        quotation_no: this.prForm.value?.quotation?.supplier_quot
          ? this.prForm.value?.quotation?.supplier_quot
          : this.quotationnumbernew || "--",
        quotationid: this.prForm.value?.quotation?.quotation_id
          ? this.prForm.value?.quotation?.quotation_id
          : this.quotationidnew || 0,
        quot_detailsid: this.prForm.value?.quotation?.id
          ? this.prForm.value?.quotation?.id
          : this.quotationdetailidnew || 0,
        // spec: this.prForm.value.specid,
        // specs_name: this.prForm.value.specs.name,
        product_id: this.prForm.value?.product?.id,
        product_name: this.prForm.value?.product?.name,
        product_type: this.prForm.value?.product_type?.id,
        prod_display: this.product_dict?.name,
        qty: "",
        unitprice: this.prForm.value?.unitprice,
        amount: 0,
        uom:
          this.selectedTypeQ == 1
            ? this.prForm.value?.uom?.name
            : this.prForm.value?.uom,
        supplier_id: this.prForm.value?.supplier?.id,
        is_asset: 0,
        ccbs_bfile_id: "", //7420
        // isccbsbulk:false,         //7420

        //duplicate form control
        suppliername: this.prForm.value?.supplier?.name,
        commodityname: this.prForm.value?.commodity?.name,
        itemname:
          this.selectedTypeQ == 1
            ? this.prForm.value?.items?.make?.name
            : this.prForm.value?.items,
        modelname:
          this.selectedTypeQ == 1
            ? this.prForm.value.models?.model?.name
            : this.prForm.value?.models,
        // specification: this.prForm.value.specs.configuration,
        productname: this.prForm.value?.product?.name,
        branch: this.prForm.value?.branch_id?.name,
        editable: false,
        models: this.prForm.value?.models?.name,
        items: this.prForm.value?.items?.name,
        serial_no: this.prForm.value?.serial_no, // 6799
        // asset_id: [''],
        asset_id: { value: "", disabled: false },
        branch_id: { value: "", disabled: false },
        prod: this.prForm.value?.product,
        pr_for: { value: "1", disabled: false },
        pr_request: this.fb.group({
          pr_request: 1,
          asset: this.fb.array([]),
        }),
        prrequest_for: {
          pr_requestfor: this.product_for == true ? 3 : 0,
          asset: this.assetArrayy,
        },
        req_for_make_id: 0,
        req_for_make_name: "",
        req_for_model_id: 0,
        req_for_model_name: "",
        req_for_product_id: this.prForm.value?.product_for?.id || 0,
        req_for_product_name: this.prForm.value?.product_for?.name || "--",

        is_save: false,
        /////// form array prccbs
        prccbs: this.fb.array([
          // this.prccbs
        ]),
      });

      FormGroupArray.get("asset_id")
        .valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice
              .get_Asset(
                value,
                this.branchid,
                this.prod_id,
                1,
                this.prForm.value?.items?.make?.name,
                this.prForm.value?.models?.name,
                this.prForm.value?.serial_no
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
            this.assetList = datas;
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
      FormGroupArray.get("branch_id")
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
      FormGroupArray.get("prod")
        .valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice.getproduct_Asset(value, this.branchid, 1).pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.productList = datas;
        });
      // this.branchid = this.prForm.value.branch_id.name,
      // console.log('this.branchid==>',this.branchid)
      FormGroupArray.get("qty")
        .valueChanges.pipe(debounceTime(20))
        .subscribe((value) => {
          // console.log("should be called first")
          this.calcTotal(FormGroupArray);
          // this.calcTotalOnIndex(this.indexDet)
          if (!this.prForm.valid) {
            return;
          }
          this.linesChange.emit(this.prForm.value["prdetails"]);
        });
      FormGroupArray.get("unitprice")
        .valueChanges.pipe(debounceTime(20))
        .subscribe((value) => {
          // console.log("should be called first")
          this.calcTotal(FormGroupArray);
          // this.calcTotalOnIndex(this.indexDet)
          if (!this.prForm.valid) {
            return;
          }
          this.linesChange.emit(this.prForm.value["prdetails"]);
        });
      const pr_request = FormGroupArray.get("pr_request") as FormGroup;
      const assetArray = pr_request.get("asset") as FormArray;
      if (assetArray) {
        assetArray.disable(); // Disable the entire asset array
      }

      return FormGroupArray;
    }

    let item =
      this.Services == true
        ? this.prForm.value?.service_des
        : this.prForm.value.itemnoncatlog;
    if (catlogOrNonCatlogtype == "2") {
      this.ForCatlog = false;
      let FormGroupArray = this.fb.group({
        capitialized: 0,
        hsn: 0,
        hsnrate: 0,
        images: "",
        remarks: "",
        installationrequired: 0,
        item: "",
        item_name: this.prForm.value?.itemnoncatlog,
        model: "",
        model_name: "",
        model_id: 0,
        specification: "",
        spec: "",
        catalog_id: 0,
        related_component_id: 0,
        related_component_name: " ",
        quotationid: 0,
        quot_detailsid: 0,
        product_id: this.prForm.value?.product?.id,
        product_name: this.prForm.value?.product?.name,
        product_type: this.prForm.value?.product_type?.id,
        prod_display: this.product_dict?.name,
        req_for_make_id: 0,
        req_for_make_name: "",
        req_for_model_id: 0,
        req_for_model_name: "",
        req_for_product_id: this.prForm.value?.product_for?.id,
        req_for_product_name: this.prForm.value?.product_for?.name,
        prrequest_for: {
          pr_requestfor: this.product_for == true ? 3 : 0,
          asset: this.assetArrayy,
        },
        quotation_no: this.prForm.value?.quotation?.supplier_quot
          ? this.prForm.value?.quotation?.supplier_quot
          : this.quotationnumbernew || "--",

        qty: "",
        amount: 0,
        unitprice: 0,
        uom: this.prForm.value?.uom?.name,
        supplier_id: this.prForm.value?.supplier?.id,
        is_asset: 0,
        ccbs_bfile_id: "", //7420
        //duplicate form control

        suppliername: this.prForm.value?.supplier?.name,
        commodityname: this.prForm.value?.commodity?.name,
        itemname: this.prForm.value.itemnoncatlog,
        // specsname: this.prForm.value.specsnoncatalog,
        productname: this.prForm.value?.product?.name,
        branch: this.prForm.value?.branch_id?.name,
        //asset
        branch_id: { value: "", disabled: false },
        asset_id: { value: "", disabled: false },
        pr_for: { value: "1", disabled: false },
        prod: this.prForm.value?.product,
        pr_request: this.fb.group({
          // asset_id : {value : '', disabled : false},
          pr_request: 1,
          asset: this.fb.array([]), // Entire array is disabled
        }),
        is_save: false,

        //prccbs
        prccbs: this.fb.array([
          // this.prccbs
        ]),
      });

      FormGroupArray.get("uom")
        .valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice.getuomFKdd(value, 1).pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.uomlist = datas;
          this.linesChange.emit(this.prForm.value["prdetails"]);
        });

      FormGroupArray.get("qty")
        .valueChanges.pipe(debounceTime(20))
        .subscribe((value) => {
          // console.log("should be called first")
          this.calcTotal(FormGroupArray);
          // this.calcTotalOnIndex(this.indexDet)
          if (!this.prForm.valid) {
            return;
          }
          this.linesChange.emit(this.prForm.value["prdetails"]);
        });
      FormGroupArray.get("unitprice")
        .valueChanges.pipe(debounceTime(20))
        .subscribe((value) => {
          // console.log("should be called first")
          this.calcTotal(FormGroupArray);
          // this.calcTotalOnIndex(this.indexDet)
          if (!this.prForm.valid) {
            return;
          }
          this.linesChange.emit(this.prForm.value["prdetails"]);
        });
      const pr_request = FormGroupArray.get("pr_request") as FormGroup;
      const assetArray = pr_request.get("asset") as FormArray;
      if (assetArray) {
        assetArray.disable(); // Disable the entire asset array
      }

      return FormGroupArray;
    }

    // return FormGroupArray
  }
  isUom: boolean = false;
  setUom(data) {
    if (this.selectedTypeQ == 2) {
      this.prForm.get("uom").setValue(data?.uom);
      this.isUom = false;
    }
    if (this.selectedTypeQ == 2 && data?.uom == "") {
      this.isUom = true;
    }
  }
  emptyStr = "--";
  getAssetDetails(prdetails) {
    this.assetArray = prdetails?.value?.prrequest_for?.asset || [];
  }
  // get assetArray(): FormArray {
  //   return this.prdetails.get('pr_request').get('asset') as FormArray;
  // }
  isToggleGroupDisabled(prdetails: any): boolean {
    return (
      prdetails?.value?.id && prdetails?.value?.pr_request?.pr_request !== 2
    );
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

  getuom() {
    this.prposervice.getuomFK("").subscribe((results: any) => {
      if (results?.code) {
        this.SpinnerService.hide();
        this.notification.showError(results?.description);
        return false;
      }
      let datas = results["data"];
      this.uomlist = datas;
      this.isLoading = false;
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
                  .subscribe((results: any) => {
                    if (results?.code) {
                      this.SpinnerService.hide();
                      this.notification.showError(results?.description);
                      return false;
                    }
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

  get asset(): FormGroup {
    let data = this.fb.group({
      asset_id: { value: "", disabled: true },
      asset: this.fb.array([]),
    });
    return data;
  }

  get prccbs(): FormGroup {
    let fgccbs = this.fb.group({
      branch_id: "",
      bs: "",
      cc: "",
      qty: 0,
      id: "",
    });

    fgccbs
      .get("branch_id")
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

    fgccbs
      .get("bs")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getbsFKdd(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.bslist = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );

    fgccbs
      .get("cc")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice
            .getcclistDependentBsdd(
              this.prForm
                .get("prdetails")
                ["controls"][this.seletedPRdetailsIndex].get("prccbs")[
                "controls"
              ][this.selectedCCBSindex].value.bs.id,
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
          this.cclist = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );

    fgccbs
      .get("qty")
      .valueChanges.pipe(debounceTime(20))
      .subscribe((value) => {
        // console.log("qty")
        this.checkqtyvalue();
      });

    return fgccbs;
  }

  getPrccbsIndex(index) {
    this.selectedCCBSindex = index;
    // console.log("this.selectedCCBSindex", this.selectedCCBSindex)
  }

  validationAdd() {
    const control = <FormArray>this.prForm.get("prdetails");
    control.push(this.prdetails);
    this.Options = true;
    this.mepreadonly = true;
    this.branchreadonly = true;
    this.comreadonly = true;
  }
  branchSubmit() {
    this.onSubmit.emit();
  }
  quotationSubmit() {
    this.onQuotation.emit();
  }

  branchCancel() {
    this.onCancel.emit();
  }
  quotationCancel() {
    this.onQuotationCancel.emit();
  }
  dell: any = [];
  editKey: any = 0;
  deleteAssett(data, i) {
    if (this.editKey != 1) {
      this.assetArrayy.forEach((e, ind) => {
        if (i === ind) {
          this.assetArrayy.splice(i, 1);
        }
      });
    }
    if (this.editKey == 1 && data.id != undefined) {
      let con = confirm("Are you sure want to Delete?");
      if (con) {
        this.assetArrayy.forEach((e, ind) => {
          if (i === ind) {
            // this.assetArrayy.splice(i, 1);
            this.dell.push(data.id);
            this.assetArrayy[i].status = 0;
          }
        });
      } else return;
    }
    if (this.editKey == 1 && data.id == undefined) {
      this.assetArrayy.forEach((e, ind) => {
        if (i === ind) {
          this.assetArrayy.splice(i, 1);
          // this.del.push(data.id);
        }
      });
    } else {
      return;
    }
  }
  addProduct() {
    let PRFormData = this.prForm.value;
    let PRFormdetailsData = this.prForm.value.prdetails;
    // if (PRFormdetailsData.length > 0) {
    //   if (this.prForm.value.commodity_id != this.prForm.value.commodity.id) {
    //     this.notification.showWarning("Please Choose Same Commodity");
    //     return false;
    //   }
    // }
    // if (PRFormdetailsData.length > 0) {
    //   if (this.prForm.value.supplier_id != this.prForm.value.supplier.id) {
    //     this.notification.showWarning("Please Choose Same Supplier");
    //     return false;
    //   }
    // }
    // if (PRFormdetailsData.length > 0) {
    //   if (this.prForm.value.mepno != this.prForm.value.mepnokey) {
    //     this.notification.showWarning("Please Choose Same MEP");
    //     return false;
    //   }
    // }
    if (
      PRFormData.mepno == "" ||
      PRFormData.mepno == null ||
      PRFormData.mepno == undefined
    ) {
      this.ismep = false;
      this.ismepdtl = false;
    } else {
      this.ismep = true;
      this.ismepdtl = true;
    }

    if (
      PRFormData.commodity.name.toLowerCase() ===
        "technology related-equipment".toLowerCase() &&
      this.independentpr == true &&
      (PRFormData.mepno == "" ||
        PRFormData.mepno == null ||
        PRFormData.mepno == undefined)
    ) {
      this.notification.showWarning("Please Choose PCA");
      return false;
    }
    if (PRFormData.type == 1) {
      if (PRFormData.product == "") {
        this.notification.showWarning("Please Choose Product Name");
        return false;
      }
      if (typeof PRFormData.product == "string") {
        this.notification.showWarning("Please Choose Product Name");
        return false;
      }

      // if (PRFormData.items == "") {
      //   this.notification.showWarning("Please Choose Items")
      //   return false
      // }
      // if(PRFormData.models == ""){
      //   this.notification.showWarning("Please Choose Models")
      // }
      // if(PRFormData.specs == "" && this.configuration == true){
      //   this.notification.showWarning("Please Choose Configurations")
      // }

      if (PRFormData.commodity == "") {
        this.notification.showWarning("Please Choose Commodity");
        return false;
      }

      if (PRFormData.supplier == "") {
        this.notification.showWarning("Please Choose Supplier");
        return false;
      }

      if (
        PRFormData.unitprice == "" ||
        PRFormData.unitprice == null ||
        PRFormData.unitprice == undefined ||
        PRFormData.unitprice <= 0
      ) {
        this.notification.showWarning("Please Check Unit Price");
        return false;
      }
      // if (PRFormdetailsData.length > 0) {
      //   for (let duplicateFind in PRFormdetailsData) {
      //     // console.log("PRFormdetailsData[duplicateFind].product_id " +duplicateFind +" index "+PRFormdetailsData[duplicateFind].product_id)
      //     // console.log("PRFormData.product.id "+duplicateFind +" index "+ PRFormData.product.id)
      //     // console.log("PRFormdetailsData[duplicateFind].item "+duplicateFind +" index "+ PRFormdetailsData[duplicateFind].item)
      //     // console.log("PRFormData.items.id "+duplicateFind +" index "+PRFormData.itemsid)
      //     if ((PRFormdetailsData[duplicateFind].product_id == PRFormData.product.id) && (PRFormdetailsData[duplicateFind].item == PRFormData.items.make.id)) {
      //       this.notification.showWarning(" 'Already Choosen',  Duplicate Product and Item ")
      //       return false
      //     }
      //   }

      // }

      // if (PRFormdetailsData.length > 0) {
      //   for (let duplicateFind in PRFormdetailsData) {
      //     if ((PRFormdetailsData[duplicateFind].product_id == PRFormData.product.id) && (PRFormdetailsData[duplicateFind].item == PRFormData.items.make.id) && (PRFormdetailsData[duplicateFind].model == PRFormData.models.model.id)) {
      //       this.notification.showWarning(" 'Already Choosen',  Duplicate Product Make and Model ")
      //       return false
      //     }
      //   }

      // }

      // if (PRFormdetailsData.length > 0) {
      //   for (let duplicateFind in PRFormdetailsData) {
      //     if ((PRFormdetailsData[duplicateFind].product_id == PRFormData.product.id)  && (PRFormdetailsData[duplicateFind].item == PRFormData.items.make.id) && (PRFormdetailsData[duplicateFind].model_id == PRFormData.models.model.id) && (PRFormdetailsData[duplicateFind].specification == PRFormData.specs.configuration)&& (this.configuration == true) || (this.configuration == false)) {
      //       this.notification.showWarning(" 'Already Choosen',  Duplicate Product Make Model and Configuration")
      //       return false
      //     }
      //   }

      // }

      if (PRFormdetailsData.length > 0 && this.selectedTypeQ == 1) {
        for (let duplicateFind in PRFormdetailsData) {
          let validation =
            PRFormdetailsData[duplicateFind].product_id ==
              PRFormData.product.id &&
            PRFormdetailsData[duplicateFind].supplier_id ==
              PRFormData.supplier.id &&
            PRFormdetailsData[duplicateFind].item == PRFormData.items.id &&
            PRFormdetailsData[duplicateFind].model_id ==
              PRFormData.models.model.id &&
            PRFormdetailsData[duplicateFind].specification ==
              PRFormData.specs.configuration;

          if (validation) {
            this.notification.showWarning(
              " 'Already Choosen',  Duplicate Values "
            );
            return false;
          }
        }
      }
      if (PRFormdetailsData.length > 0 && this.selectedTypeQ == 2) {
        for (let duplicateFind in PRFormdetailsData) {
          let validation =
            PRFormdetailsData[duplicateFind]?.product_name ==
              PRFormData?.product?.name &&
            PRFormdetailsData[duplicateFind]?.supplier_id ==
              PRFormData?.supplier?.id &&
            PRFormdetailsData[duplicateFind]?.item_name == PRFormData.items &&
            PRFormdetailsData[duplicateFind].model_name == PRFormData.models &&
            PRFormdetailsData[duplicateFind].specification == PRFormData.specs;

          if (validation) {
            this.notification.showWarning(
              " 'Already Choosen',  Duplicate Values "
            );
            return false;
          }
        }
      }
      // if (PRFormdetailsData.length > 0 && this.Services == true) {
      //   for (let duplicateFind in PRFormdetailsData) {
      //     let validation =
      //       PRFormdetailsData[duplicateFind].product_id ==
      //         PRFormData.product.id &&
      //       PRFormdetailsData[duplicateFind].item_name == PRFormData.service_des;

      //     if (validation) {
      //       this.notification.showWarning(
      //         " 'Already Choosen',  Duplicate Values "
      //       );
      //       return false;
      //     }
      //   }
      // }
      // if (PRFormdetailsData.length > 0) {
      //   for (let duplicateFind in PRFormdetailsData) {
      //     if (
      //       (PRFormdetailsData[duplicateFind].product_id ===
      //         PRFormData.product.id) &&
      //       (PRFormdetailsData[duplicateFind].item ===
      //         PRFormData.items.id) &&
      //     (PRFormdetailsData[duplicateFind].model_id ===
      //         PRFormData.models.model.id) &&
      //       (PRFormdetailsData[duplicateFind].specification ===
      //         PRFormData.specs.configuration)
      //     ) {
      //       this.notification.showWarning(
      //         " 'Already Choosen',  Duplicate Values "
      //       );
      //       return false;
      //     }
      //   }
      // }
    }
    if (PRFormData.type == 2) {
      if (PRFormData.product == "") {
        this.notification.showWarning("Please Choose Product");
        return false;
      }
      // if (PRFormData.itemnoncatlog == "") {
      //   this.notification.showWarning("Please Choose Make")
      //   return false
      // }
      if (PRFormData.commodity == "") {
        this.notification.showWarning("Please Choose Commodity");
        return false;
      }
      if (PRFormData.supplier == "") {
        this.notification.showWarning("Please Choose Supplier");
        return false;
      }
    }

    if (PRFormdetailsData.length == 0) {
      let supplierID = this.prForm.value.supplier.id;
      let commodityID = this.prForm.value.commodity.id;
      this.commID = commodityID;
      let mepnovalue = this.prForm.value.mepno;

      this.prForm.patchValue({
        supplier_id: supplierID,
        commodity_id: commodityID,
        mepnokey: mepnovalue,
      });
    }
    if (PRFormData.branch_id == "") {
      this.notification.showWarning("Please Choose Branch");
      return false;
    }
    if (PRFormdetailsData.length > 0) {
      for (let duplicateFind in PRFormdetailsData) {
        if (
          PRFormdetailsData[duplicateFind].product_id ==
            PRFormData.product.id &&
          PRFormdetailsData[duplicateFind].supplier_id ==
            PRFormData.supplier.id &&
          PRFormdetailsData[duplicateFind].item_name == PRFormData.itemnoncatlog
        ) {
          this.notification.showWarning(
            " 'Already Choosen',  Duplicate Values "
          );
          return false;
        }
      }
    }
    // if (PRFormdetailsData.length > 0 && this.Services == true) {
    //   for (let duplicateFind in PRFormdetailsData) {
    //     let validation =
    //       PRFormdetailsData[duplicateFind].product_id ==
    //         PRFormData.product.id &&
    //       PRFormdetailsData[duplicateFind].item_name == PRFormData.service_des;

    //     if (validation) {
    //       this.notification.showWarning(
    //         " 'Already Choosen',  Duplicate Values "
    //       );
    //       return false;
    //     }
    //   }
    // }

    this.validationAdd();
  }

  deleteProduct(indexs: number, dataPrDetails) {
    // deleteProduct(index: number,dataPrDetails) {
    ////7421
    let index = this.pgsize * (this.pg - 1) + indexs; //7421
    // this.ccbsdeleteid=dataPrDetails.value.id
    let id = dataPrDetails.value.id;
    console.log("ccbsdeleteid from delete==>", id);

    if (id != null && id != "" && id != undefined) {
      this.prdetails_delete.push(id);
    }
    /////
    (<FormArray>this.prForm.get("prdetails")).removeAt(index);
    this.files.value.file_upload.splice(index);

    let lengthCheckForRefreshData = this.prForm.value.prdetails;
    let lengthval = lengthCheckForRefreshData.length;
    if (lengthval === 0) {
      this.mepreadonly = false;
      this.branchreadonly = false;
      this.supplierreadonly = false;
      this.comreadonly = false;

      this.Options = false;
      this.prForm.controls["commodity_id"].reset("");
      this.prForm.controls["supplier_id"].reset("");
    }
    this.datasums();
  }
  //
  // addccbs(userIndex: number, data?: any) {
  addccbs(indexs: number, data?: any) {
    //7421
    // console.log('userIndex', userIndex, '-------', 'data', data);
    let userIndex = this.pgsize * (this.pg - 1) + indexs; //7421
    (<FormArray>(
      (<FormGroup>(
        (<FormArray>this.prForm.controls["prdetails"]).controls[userIndex]
      )).controls["prccbs"]
    )).push(this.prccbs);
    let BSpatchValue = data[0].prccbs[0]?.bs;
    let CCpatchValue = data[0].prccbs[0]?.cc;
    // console.log("BSpatchValue", BSpatchValue)
    // console.log("CCpatchValue", CCpatchValue)
    let branchdata = this.prForm.value.prdetails[userIndex].prccbs.length;
    this.prForm
      .get("prdetails")
      ["controls"][userIndex].get("prccbs")
      ["controls"][branchdata - 1].get("branch_id")
      .setValue(this.empBranchdata);
    this.prForm
      .get("prdetails")
      ["controls"][userIndex].get("prccbs")
      ["controls"][branchdata - 1].get("bs")
      .setValue(BSpatchValue);
    this.prForm
      .get("prdetails")
      ["controls"][userIndex].get("prccbs")
      ["controls"][branchdata - 1].get("cc")
      .setValue(CCpatchValue);

    if (branchdata == 1) {
      this.prForm
        .get("prdetails")
        ["controls"][userIndex].get("prccbs")
        ["controls"][0].get("qty")
        .setValue(this.RequiredQtyForThisccbs);
    }
  }

  // deleteccbs(userIndex: number, index: number,ccbsdata) {
  deleteccbs(userIndexs: number, index: number, ccbsdata) {
    // console.log('userIndex', userIndex, '-------', 'index', index);
    // console.log('ccbsdata for delete===>',ccbsdata)
    let userIndex = this.pgsize * (this.pg - 1) + userIndexs; //7421
    let id = ccbsdata.value.id;
    ///7420
    if (id != null && id != "" && id != undefined) {
      this.prccbs_delete.push(id);
    }
    //7421
    (<FormArray>(
      (<FormGroup>(
        (<FormArray>this.prForm.controls["prdetails"]).controls[userIndex]
      )).controls["prccbs"]
    )).removeAt(index);
    this.checkqtyvalue();
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////EDIT Function
  // patchForm(id): void {
  //   this.SpinnerService.show();
  //   this.prposervice.getpredit(id)
  //     .subscribe((results) => {
  //       this.SpinnerService.hide();
  //       let datas = results;
  //       console.log("dattat", datas)
  //       this.prForm.patchValue({
  //         type: datas.type.id,
  //         branch_id: datas.branch_id,
  //         commodity: datas.commodity_id,
  //         commodity_id: datas.commodity_id.id,
  //         mepno: datas.mepno,
  //         mepnokey: datas.mepno,
  //         dts: datas.dts,
  //         totalamount: datas.totalamount,
  //         notepad: datas.notepad
  //       })
  //       this.DataToDisableOnPatch()
  //       this.getmepdtl()
  //       this.loadForm(datas);
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })

  // }
  //BUG ID:4529
  has_nextt = true;
  has_previouss = true;
  currentpag: number = 1;
  presentpag: number = 1;
  patchForm(id, pagenumber = 1): void {
    this.SpinnerService.show();
    if (this.status == "PR Maker Draft") {
      this.prposervice.getprDRAFTedit(id).subscribe(
        (results) => {
          this.SpinnerService.hide();
          if (results?.code) {
            this.SpinnerService.hide();
            this.notification.showError(results?.description);
            return false;
          }
          let datas = results.prdetails;
          this.drafreditid = results.id; //7422
          // this.ccbsdraftfileid=results.prdetails[0]?.ccbs_bfile_id; //7422
          this.draftnoncatfileid = results?.prdetails_bfile_id; //7422
          this.sliceddraftnoncatfileid = this.draftnoncatfileid?.slice(-3); //7422
          console.log("typeof sliced===>", typeof this.sliceddraftnoncatfileid);
          this.sliceddraftccbsfileidnumber = Number(
            this.sliceddraftnoncatfileid
          );

          console.log("drafteditresult", datas);
          this.prForm.patchValue({
            type: results.type.id,
            branch_id: results.branch_id,
            commodity: results.commodity_id,
            commodity_id: results.commodity_id.id,
            product_type: results.product_type,
            mepno: results.mepno,
            mepnokey: results.mepno,
            dts: results.dts,
            model_id: results.prdetails.model_id,
            model_name: results.prdetails.model_name,
            specification: results.prdetails.specification,
            // totalamount: datas.totalamount,
            notepad: results.notepad,
            justification: results.justification,
            draft_create: 1,
            //BUG ID:7422
            prdetails_bfile_id: results.prdetails_bfile_id,
          });

          this.DataToDisableOnPatch();
          this.getmepdtl();
          this.loadFormdata(results);
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    } else {
      this.editviewid = id;
      // this.prposervice.preditview(id,pagenumber) //bulk upload ccbs seperate API
      // this.prposervice.getpredit(id,pagenumber) //normal edit
      this.prposervice.predit(id, pagenumber).subscribe(
        (results) => {
          this.SpinnerService.hide();
          if (results?.code) {
            this.SpinnerService.hide();
            this.notification.showError(results?.description);
            return false;
          }
          let data = results.prdetails;
          console.log("preditviewresults", results);
          let datas = results;
          this.bulkeditid = datas.id;
          let datapagination = results.prdetails.pagination;
          // let datapagination = results["pagination"];
          if (datas.prdetails["data"].length >= 0) {
            this.has_nextt = datapagination.has_next;
            this.has_previouss = datapagination.has_previous;
            this.presentpag = datapagination.index;
          }
          console.log("this.bulkeditid===>", this.bulkeditid);
          // console.log("dattat", datas)
          this.prForm.patchValue({
            type: datas.type.id,
            branch_id: datas.branch_id,
            commodity: datas.commodity_id,
            commodity_id: datas.commodity_id.id,
            mepno: datas.mepno,
            mepnokey: datas.mepno,
            dts: datas.dts,
            totalamount: datas.totalamount,
            notepad: datas.notepad,
            justification: datas.justification,
          });

          this.DataToDisableOnPatch();
          this.getmepdtl();
          this.loadForm(datas);
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }
  }
  nextClick() {
    if (this.has_nextt === true) {
      this.patchForm(this.editviewid, this.presentpag + 1);
    }
  }
  previousClick() {
    if (this.has_previouss === true) {
      this.patchForm(this.presentpag - 1);
    }
  }
  //4529

  loadForm(data) {
    console.log("datadata", data);
    let pr_draft_type = data.pr_draft_type;
    if (pr_draft_type == 2) {
      this.batchpr = true;
      this.independentpr = false;
      this.selectedToggle = "batchpr";
    } else {
      this.batchpr = false;
      this.independentpr = true;
      this.selectedToggle = "independentpr";
    }
    let catlogOrNonCatlogtype = data.type.id;
    if (catlogOrNonCatlogtype == 1) {
      this.ForCatlog = true;
      this.itemNonCalog = false;
      this.itemcalog = true;

      this.radiochoice = true;
      this.modelcatlog = true;
      this.configcatlog = true;
    }
    if (catlogOrNonCatlogtype == 2) {
      this.ForCatlog = false;
      this.itemNonCalog = true;
      this.itemcalog = false;
      this.isSupplier = true;
      this.isProduct = false;
      this.radiochoice = false;
      this.modelcatlog = false;
      this.configcatlog = false;
    }
    // this.prForm.get("employee_id").setValue(data?.employee);
    // for (let prdet of data.prdetails.data) {
    let arr = data.prdetails.data;
    arr.forEach((prdet, i) => {
      let amount: FormControl = new FormControl("");
      let capitialized: FormControl = new FormControl("");
      // let pr_request: FormControl = new FormControl('');
      let hsn: FormControl = new FormControl("");
      let hsnrate: FormControl = new FormControl(0);
      let images: FormControl = new FormControl("");
      let remarks: FormControl = new FormControl("");
      let installationrequired: FormControl = new FormControl("");
      let item: FormControl = new FormControl("");
      let item_name: FormControl = new FormControl("");
      let product_id: FormControl = new FormControl("");
      let product_name: FormControl = new FormControl("");
      let qty: FormControl = new FormControl("");
      let supplier_id: FormControl = new FormControl("");
      let unitprice: FormControl = new FormControl("");
      let uom: FormControl = new FormControl("");
      let is_asset: FormControl = new FormControl("");
      //duplicate form control
      let model_name: FormControl = new FormControl("");
      let related_compo;
      let model_id: FormControl = new FormControl("");
      let suppliername: FormControl = new FormControl("");
      let commodityname: FormControl = new FormControl("");
      let itemname: FormControl = new FormControl("");
      let modelname: FormControl = new FormControl("");
      let specification: FormControl = new FormControl("");
      let make_name: FormControl = new FormControl("");
      let make_id: FormControl = new FormControl("");
      let productname: FormControl = new FormControl("");
      let prod_display: FormControl = new FormControl("");
      let product_type: FormControl = new FormControl("");
      let branch: FormControl = new FormControl("");
      let catalog_id: FormControl = new FormControl("");
      let prod: FormControl = new FormControl("");
      let related_component_name: FormControl = new FormControl("");
      let related_component_id: FormControl = new FormControl("");
      let quotation_no: FormControl = new FormControl("");
      let quotationid: FormControl = new FormControl("");
      let quot_detailsid: FormControl = new FormControl("");

      let editable: FormControl = new FormControl("");
      let idControl: FormControl = new FormControl("");
      let pr_for: FormControl = new FormControl({ value: "", disabled: false });
      let is_save: FormControl = new FormControl({
        value: true,
        disabled: false,
      });
      let branch_id: FormControl = new FormControl("");

      let pr_request: FormGroup = new FormGroup({
        pr_request: this.fb.control(""),
        asset: this.fb.array([]),
      });
      let asset_id: FormControl = new FormControl({
        value: "",
        disabled: false,
      });

      const prdetFormArray = this.prForm.get("prdetails") as FormArray;
      idControl.setValue(prdet.id);
      // console.log("dataaaasss",data)
      // console.log("prdet",prdet)
      // if (data.type.id == 1) {
      productname.setValue(prdet.product_id.name);
      product_id.setValue(prdet.product_id.id);
      product_name.setValue(prdet.product_id.name);
      prod_display.setValue(prdet.product_type?.name);
      product_type.setValue(prdet.product_type?.id);
      prod.setValue(prdet.product_id);
      related_component_name.setValue(prdet.related_component_name || "");
      related_component_id.setValue(prdet.related_component_id || 0);
      quotation_no.setValue(
        prdet?.quotation?.supplier_quot || this.quotationnumbernew || "--"
      );
      quotationid.setValue(
        prdet?.quotation?.quotationid || this.quotationidnew || 0
      );
      quot_detailsid.setValue(
        prdet?.quotation?.quot_detailsid || this.quotationdetailidnew || 0
      );
      catalog_id.setValue(prdet?.item || 0);
      // }
      // else if (data.type.id == 2) {
      // productname.setValue(prdet.product_name)
      // product_name.setValue(prdet.product_name)
      // product_id.setValue("")
      //   productname.setValue(prdet.product_name)
      //   product_id.setValue(prdet.product_id.id)
      //   product_name.setValue("")
      // }
      if (data.type.id == 1) {
        itemname.setValue(prdet.item_name);
        item_name.setValue(prdet.item_name);
        item.setValue(prdet.item);
        model_name.setValue(prdet.model_name);
        modelname.setValue(prdet.model_name);
        model_id.setValue(prdet.model_id);
        specification.setValue(prdet.specification);
      }
      if (data.type.id == 2) {
        itemname.setValue(prdet.item_name);
        item_name.setValue(prdet.item_name);
        make_name.setValue(prdet.make_name);
        make_id.setValue(prdet.make_id);
        model_name.setValue("");
        modelname.setValue("");
        model_id.setValue(0);
        specification.setValue("");
        item.setValue("");
      }
      this.prForm.patchValue({
        supplier_id: prdet.supplier_id.id,
        supplier: prdet.supplier_id,
      });
      supplier_id.setValue(prdet.supplier_id.id);
      suppliername.setValue(prdet.supplier_id.name);
      // specification.setValue(data.specification);
      commodityname.setValue(data.commodity_id.name);
      editable.setValue(false);
      hsn.setValue(0);
      hsnrate.setValue(0);
      images.setValue(prdet.images);
      uom.setValue(prdet.uom);
      branch.setValue(data.branch_id.name);
      amount.setValue(prdet.amount);
      qty.setValue(prdet.qty);
      unitprice.setValue(prdet.unitprice);
      amount.setValue(prdet.qty * prdet.unitprice);
      remarks.setValue(prdet.remarks);
      installationrequired.setValue(prdet.installationrequired);
      capitialized.setValue(prdet.capitialized);
      pr_for.setValue(prdet?.pr_request?.pr_request.toString());

      // pr_request.setValue(prdet.pr_request)

      let isassert = null;
      if (prdet.is_assert == "Y") {
        isassert = 1;
      } else {
        isassert = 0;
      }
      is_asset.setValue(isassert);
      prdetFormArray.push(
        new FormGroup({
          branch_id: branch_id,
          prod: prod,
          product_id: product_id,
          supplier_id: supplier_id,
          qty: qty,
          unitprice: unitprice,
          installationrequired: installationrequired,
          remarks: remarks,
          capitialized: capitialized,
          prod_display: prod_display,
          product_type: product_type,
          related_component_name: related_component_name,
          related_component_id: related_component_id,
          quotation_no: quotation_no,
          quotationid: quotationid,
          quot_detailsid: quot_detailsid,
          // pr_request:pr_request,
          catalog_id: catalog_id,
          amount: amount,
          hsn: hsn,
          hsnrate: hsnrate,
          images: images,
          item: item,
          item_name: item_name,
          product_name: product_name,
          uom: uom,
          is_asset: is_asset,
          editable: editable,
          //duplicate form control
          suppliername: suppliername,
          commodityname: commodityname,
          itemname: itemname,
          modelname: modelname,
          model_id: model_id,
          model_name: model_name,
          make_id: make_id,
          make_name: make_name,
          specification: specification,
          productname: productname,
          branch: branch,
          id: idControl,
          pr_for: pr_for,

          prccbs: this.setccbs(prdet.prccbs, 1),
          pr_request: this.fb.group({
            pr_request: [prdet?.pr_request?.pr_request || ""],
            asset: this.getassetData(prdet?.pr_request?.asset || []),
          }),
          is_save: is_save,
          asset_id: asset_id,
        })
      );
      const prdetails = this.prForm.get("prdetails") as FormArray;
      const pr_requestt = prdetails.at(i).get("pr_request") as FormGroup;
      const assetArray = pr_requestt.get("asset") as FormArray;
      if (assetArray.length != 0) {
        prdetails.at(i).get("is_save").setValue(true);
      }
      this.initializeAssets(i);

      this.calcTotalpatch(unitprice, qty, amount);
      unitprice.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
        // console.log("should be called first")
        this.calcTotalpatch(unitprice, qty, amount);
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value["prdetails"]);
      });

      qty.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
        // console.log("should be called first")
        this.calcTotalpatch(unitprice, qty, amount);
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value["prdetails"]);
      });
    });
  }
  setccbs(prccbs, index) {
    // console.log("prccbs after", prccbs)
    let arr = new FormArray([]);
    for (let ccbs of prccbs) {
      let branch_id: FormControl = new FormControl("");
      let bs: FormControl = new FormControl("");
      let cc: FormControl = new FormControl("");
      let qty: FormControl = new FormControl("");
      let code: FormControl = new FormControl("");
      let idccbsControl: FormControl = new FormControl("");
      // branch_id.setValue(ccbs.branch_id.name);
      branch_id.setValue(ccbs.branch_id);
      bs.setValue(ccbs.bs);
      cc.setValue(ccbs.cc);
      qty.setValue(ccbs.qty);
      code.setValue(ccbs.code);
      idccbsControl.setValue(ccbs.id);
      arr.push(
        new FormGroup({
          branch_id: branch_id,
          bs: bs,
          cc: cc,
          qty: qty,
          code: code,
          id: idccbsControl,
        })
      );

      branch_id.valueChanges
        .pipe(
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
      bs.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice.getbsFKdd(value, 1).pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
          )
        )
        .subscribe(
          (results: any[]) => {
            let datas = results["data"];
            this.bslist = datas;
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
      cc.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice
              .getcclistDependentBsdd(
                this.prForm
                  .get("prdetails")
                  ["controls"][this.seletedPRdetailsIndex].get("prccbs")[
                  "controls"
                ][this.selectedCCBSindex].value.bs.id,
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
            this.cclist = datas;
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
      qty.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
        // console.log("qty")
        this.checkqtyvalue();
      });
    }
    this.CatlogOrNotCatlog();
    return arr;
  }

  DataToDisableOnPatch() {
    let formData = this.prForm.value.type;
    this.Options = true;
    if (formData == 2 || formData == "2") {
      this.prForm.get("productCategory").disable();
      this.prForm.get("product_type").disable();
    }
  }

  indexvalueOnprdetails(indexs) {
    // indexvalueOnprdetails(index) {
    let index = this.pgsize * (this.pg - 1) + indexs; //7421
    this.indexDet = index;
  }

  calcTotalOnIndex(index) {
    let dataOnDetails = this.prForm.value.prdetails;
    let qtyvalue = +dataOnDetails[index].qty;
    let unitpricevalue = +dataOnDetails[index].unitprice;
    let amountValue = +(qtyvalue * unitpricevalue);
    this.prForm
      .get("prdetails")
      ["controls"][index].get("amount")
      .setValue(amountValue);
    this.datasums();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////Bulk Upload

  downloadFileXLSXprTemplate() {
    this.SpinnerService.show();
    this.prposervice.DownloadExcel().subscribe(
      (results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Non Catelog PR Template.xlsx";
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  removeSingleFile(index: number, fileInput: HTMLInputElement) {
    this.droppedFiles.splice(index, 1);
    fileInput.value = "";
  }
  UPloadCSVFileData: any;
  errorXLSXList: any;
  ErrorMSgDivBulk: boolean;

  onFileSelectedBulkUpload(e) {
    let dataFilevalue = e.target.files[0];
    this.UPloadCSVFileData = dataFilevalue;
    this.droppedFiles = dataFilevalue;
  }
  onFileChange(files: FileList | File[]): void {
    this.droppedFiles = Array.from(files);
    this.uploadProgress = 0; // Reset progress when a new file is uploaded
    this.simulateUploadProgress();
  }
  droppedFiles: any = [];
  showpopup: boolean = false;
  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = true;
    //console.log('Drag over');
  }
  isActive: boolean = false;
  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = false;
    //console.log('Drag leave');
  }
  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;

    // Check if any file is present
    if (files.length > 0) {
      let isExcel = false;

      // Loop through the files to check if they are Excel files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type;

        // Validate if the file is an Excel file
        if (
          fileType === "application/vnd.ms-excel" ||
          fileType ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          isExcel = true;
        } else {
          // If a non-Excel file is found, show an error message
          this.notification.showInfo("Only Excel files are allowed.");
          return; // Stop further processing
        }
      }

      // Proceed with the upload process if all files are Excel files
      if (isExcel) {
        this.droppedFiles = files;
        this.uploadProgress = 0; // Reset progress when a new file is uploaded
        this.simulateUploadProgress();
        this.isActive = false;
      }
    }
  }
  simulateUploadProgress(): void {
    // Simulate file upload progress
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  }
  uploadProgress: number = 0;

  validateBulk() {
    let FilesRequiredData = this.prForm.value;
    if (!FilesRequiredData.commodity) {
      this.SpinnerService.hide();
      this.notification.showWarning("Choose Commodity");
      return false;
    }
    // else if (!FilesRequiredData.supplier) {
    //   this.SpinnerService.hide();
    //   this.notification.showWarning("Choose Supplier");
    //   return false;
    // }
    else if (!FilesRequiredData.branch_id) {
      this.SpinnerService.hide();
      this.notification.showWarning("Choose Branch");
      return false;
    } else this.showpopup = true;
    return true;
  }

  UploadCsv() {
    this.SpinnerService.show();
    let FilesRequiredData = this.prForm.value;
    if (!FilesRequiredData.commodity) {
      this.SpinnerService.hide();
      this.notification.showWarning("Choose Commodity");
      return false;
    }

    // if (!FilesRequiredData.supplier) {
    //   this.SpinnerService.hide();
    //   this.notification.showWarning("Choose Supplier");
    //   return false;
    // }

    if (!FilesRequiredData.branch_id) {
      this.SpinnerService.hide();
      this.notification.showWarning("Choose Branch");
      return false;
    }
    if (
      this.droppedFiles == "" ||
      this.droppedFiles == null ||
      this.droppedFiles == undefined
    ) {
      this.SpinnerService.hide();
      this.notification.showWarning("Please select file for bulk upload");
      return false;
    }
    let datalengthCheck = this.prForm.value.prdetails;
    if (datalengthCheck.length > 0) {
      this.SpinnerService.hide();
      this.notification.showWarning(
        "Bulk Upload not allowed once filled details below "
      );
      return false;
    }

    let data = {
      commodity_id: FilesRequiredData.commodity.id,
      supplier_id: FilesRequiredData?.supplier?.id,
      branch_id: FilesRequiredData.branch_id.id,
    };

    this.SpinnerService.show();
    this.prposervice.BulkUploadPR(data, this.droppedFiles[0]).subscribe(
      (results) => {
        if (results?.code) {
          this.SpinnerService.hide();
          this.notification.showError(results?.description);
          return false;
        }
        this.SpinnerService.hide();
        let datas = results;
        // this.prblkuploadfile=datas.prdetails_bfile_id    //7421 need to ucomment
        // this.prForm.value.prdetails_bfile_id=datas.prdetails_bfile_id
        this.prForm.patchValue({
          prdetails_bfile_id: datas.prdetails_bfile_id,
        });
        // console.log('overallbulkfile id===>',this.prForm.value.prdetails_bfile_id)
        // if (results.code === "INVALID_DATA" && results.description === "Invalid Data or DB Constraint") {
        //   this.SpinnerService.hide();
        //   this.notification.showError("Template has no correct format data!!")
        //   return false;
        // }
        ////////////////////////////////7421
        if (results.code == "PR Quantity MisMatched with CCBS Quantity") {
          this.SpinnerService.hide();
          this.notification.showError(results.description);
          return false;
        }

        if (results.code == "INVALID_FILETYPE") {
          this.SpinnerService.hide();
          this.notification.showError(results.description);
          return false;
        }

        if (results.code == "Kindly Change Sheet Name as Template") {
          this.SpinnerService.hide();
          this.notification.showError(results.description);
          return false;
        }
        if (results.code == "Kindly Change Header Name") {
          this.SpinnerService.hide();
          this.notification.showError(results.description);
          return false;
        }

        if (results.code == "INVALID_DATA") {
          var answer = window.confirm(
            results.description + "Click OK to Download"
          );
          this.fileid = results.prdetails_bfile_id;
          if (answer) {
            this.Downloadoverallblkfileclk(this.fileid);
          } else {
            return false;
          }
        }

        if (results.code == "Success Uploaded") {
          this.SpinnerService.hide();
          this.notification.showSuccess(results.description);
          this.closebtnbulk.nativeElement.click();

          if (results) {
            for (let errorOrData in results) {
              this.isprbulkupload = true; //7421
              this.patchBulkUploadDataInForm(results["prdetails"]);
              // console.log("data to patch", results)
              this.ErrorMSgDivBulk = false;
              this.SpinnerService.hide();
              return false;
            }
          }
        }
        ///////////////////////7421

        // if (results) {
        //   for (let errorOrData in results) {
        //     if (results[errorOrData].error) {
        //       this.errorXLSXList = results
        //       console.log(" error from bulk ", this.errorXLSXList)
        //       this.ErrorMSgDivBulk = true
        //       this.SpinnerService.hide();
        //       return false
        //     }
        //     else {
        //       this.isprbulkupload=true; //7421
        //       this.patchBulkUploadDataInForm(results)
        // this.prposhareService.prapproverblk.next(this.isprbulkupload) //7421
        //       console.log("data to patch", results)
        //       this.ErrorMSgDivBulk = false
        //       this.SpinnerService.hide();
        //       return false
        //     }
        //   }
        // }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  patchBulkUploadDataInForm(data) {
    this.prForm.patchValue({
      mepno: this.prForm.value.mepno,
      mepnokey: this.prForm.value.mepno,
      commodity_id: this.prForm.value.commodity.id,
      supplier_id: this.prForm.value.supplier.id,
    });
    this.mepreadonly = true;
    this.branchreadonly = true;
    this.supplierreadonly = true;
    this.comreadonly = true;

    for (let prdet of data.data) {
      let amount: FormControl = new FormControl("");
      let capitialized: FormControl = new FormControl("");
      // let pr_request: FormControl = new FormControl('');
      let images: FormControl = new FormControl("");
      let remarks: FormControl = new FormControl("");
      let installationrequired: FormControl = new FormControl("");
      let item: FormControl = new FormControl("");
      let item_name: FormControl = new FormControl("");
      let product_id: FormControl = new FormControl("");
      let product_name: FormControl = new FormControl("");
      let product_type: FormControl = new FormControl("");
      let model_name: FormControl = new FormControl("");
      let qty: FormControl = new FormControl("");
      let supplier_id: FormControl = new FormControl("");
      let unitprice: FormControl = new FormControl("");
      let uom: FormControl = new FormControl("");
      let is_asset: FormControl = new FormControl("");
      let editable: FormControl = new FormControl("");
      //duplicate form control
      let suppliername: FormControl = new FormControl("");
      let commodityname: FormControl = new FormControl("");
      let itemname: FormControl = new FormControl("");
      let modelname: FormControl = new FormControl("");
      let specification: FormControl = new FormControl("");
      let productname: FormControl = new FormControl("");
      let prod_display: FormControl = new FormControl("");
      let branch: FormControl = new FormControl("");
      let items: FormControl = new FormControl("");
      let models: FormControl = new FormControl("");
      // let idControl: FormControl = new FormControl('');

      const prdetFormArray = this.prForm.get("prdetails") as FormArray;
      productname.setValue(prdet.product_name);
      product_name.setValue(prdet.product_name);
      product_type.setValue(prdet.product_type);
      prod_display.setValue(prdet.product_type_name);
      product_id.setValue(prdet.product_id);
      itemname.setValue(prdet.item_name);
      modelname.setValue(prdet.model_name);
      specification.setValue(prdet.configuration);
      item.setValue(prdet.item);
      item_name.setValue(prdet.item_name);
      supplier_id.setValue(prdet.supplier_id);
      suppliername.setValue(prdet.supplier_name);
      commodityname.setValue(this.prForm.value.commodity.name);
      images.setValue(prdet.images);
      uom.setValue(prdet.uom);
      editable.setValue(false);
      branch.setValue(this.prForm.value.branch_id.name);
      amount.setValue(prdet.amount);
      qty.setValue(prdet.qty);
      unitprice.setValue(prdet.unitprice);
      amount.setValue(prdet.qty * prdet.unitprice);
      remarks.setValue(prdet.remarks);
      models.setValue(prdet.models);
      items.setValue(prdet.items);
      let install = null;
      let capitalize = null;
      if (prdet.installationrequired == "Y") {
        install = 1;
      } else {
        install = 0;
      }
      if (prdet.capitialized == "Y") {
        capitalize = 1;
      } else {
        capitalize = 0;
      }

      let isassert = null;
      if (prdet.is_assert == "Y") {
        isassert = 1;
      } else {
        isassert = 0;
      }
      // let pr_requestt = null
      // if (prdet.pr_request == 1) {
      //   pr_requestt = '1'
      // } else {
      //   pr_requestt = '2'
      // }
      // is_asset.setValue(isassert);
      is_asset.setValue(0);
      installationrequired.setValue(install);
      capitialized.setValue(capitalize);
      // pr_request.setValue(pr_requestt)
      let dict = {
        pr_requestfor: 0,
        asset: [],
      };
      let doc = {
        pr_request: 1,
      };
      prdetFormArray.push(
        new FormGroup({
          product_id: product_id,
          supplier_id: supplier_id,
          qty: qty,
          unitprice: unitprice,
          installationrequired: installationrequired,
          remarks: remarks,
          capitialized: capitialized,
          // pr_request : pr_request,
          amount: amount,
          images: images,
          item: item,
          item_name: item_name,
          product_name: product_name,
          product_type: product_type,
          model_name: model_name,
          uom: uom,
          is_asset: is_asset,
          editable: editable,
          //duplicate form control
          suppliername: suppliername,
          commodityname: commodityname,
          itemname: itemname,
          modelname: modelname,
          specification: specification,
          productname: productname,
          prod_display: prod_display,
          pr_request: new FormControl(doc),
          prrequest_for: new FormControl(dict),
          quotationid: new FormControl(0),
          quot_detailsid: new FormControl(0),
          req_for_make_id: new FormControl(0),
          req_for_make_name: new FormControl(""),
          req_for_model_id: new FormControl(0),
          req_for_model_name: new FormControl(""),
          req_for_product_id: new FormControl(0),
          req_for_product_name: new FormControl(""),
          branch: branch,

          prccbs: this.setccbsBulk(prdet.prccbs),
        })
      );
      this.calcTotalpatch(unitprice, qty, amount);
      unitprice.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
        // console.log("should be called first")
        this.calcTotalpatch(unitprice, qty, amount);
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value["prdetails"]);
      });

      qty.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
        // console.log("should be called first")
        this.calcTotalpatch(unitprice, qty, amount);
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value["prdetails"]);
      });
    }
  }
  setccbsBulk(prccbs) {
    // console.log("prccbs after", prccbs)
    let arr = new FormArray([]);
    for (let ccbs of prccbs) {
      let branch_id: FormControl = new FormControl("");
      let bs: FormControl = new FormControl("");
      let cc: FormControl = new FormControl("");
      let qty: FormControl = new FormControl("");
      let code: FormControl = new FormControl("");
      branch_id.setValue(ccbs.branch_id);
      bs.setValue(ccbs.bs);
      cc.setValue(ccbs.cc);
      qty.setValue(ccbs.qty);
      code.setValue(ccbs.code);
      arr.push(
        new FormGroup({
          branch_id: branch_id,
          bs: bs,
          cc: cc,
          qty: qty,
          code: code,
        })
      );
    }
    this.DataToDisableOnPatch();
    this.getmepdtl();
    return arr;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isProduct && changes.isProduct.currentValue === true) {
      this.autocompleteproductScrollP();
      this.autocompletesupplierScrollP();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////mep
  public displayFnMep(MEP?: any) {
    if (typeof MEP == "string") {
      return MEP;
    }
    return MEP ? this.MEPList.find((_) => _.mepno == MEP).mepno : undefined;
  }
  getprmpca() {
    // if(this.commodityId == undefined || this.commodityId == "" || this.commodityId == null
    if (
      this.prForm.value.commodity.id == undefined ||
      this.prForm.value.commodity.id == null ||
      this.prForm.value.commodity.id == ""
    ) {
      this.notification.showError("Please Choose Commodity");
      return;
    }
    this.getmepFK();

    this.prForm
      .get("mepno")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice.getmepcommodityFKdd(value, this.commodityId, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            catchError((error) => {
              this.errorHandler.handleError(error); // Handle the error
              this.SpinnerService.hide(); // Hide the spinner
              // Optionally return a fallback value to continue the observable stream
              return of([]); // Empty array or fallback response
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.MEPList = datas;
      });
  }

  getmepFK() {
    // if(this.commodityId == undefined || this.commodityId == "" || this.commodityId == null){
    if (
      this.prForm.value.commodity.id == undefined ||
      this.prForm.value.commodity.id == "" ||
      this.prForm.value.commodity.id == null
    ) {
      this.notification.showError("Please Choose Commodity");
      return;
    }
    this.SpinnerService.show();
    this.prposervice
      .getmepcommodityFKdd("", this.commodityId, this.currentpagemep)
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.MEPList = datas;
          this.SpinnerService.hide();
          this.isLoading = false;
          // console.log("mepList", datas)
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  currentpagemep = 1;
  has_nextmep = true;
  has_previousmep = true;
  mepcurrentpage = 0;
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
                    this.mepinput.nativeElement.value,
                    this.commodityId,
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
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////product category
  public displayFnproductCategory(
    prodcat?: productCategoryLists
  ): string | undefined {
    return prodcat ? prodcat.name : undefined;
  }
  DisabledMep = false;
  // getprodcatkeyFK() {
  //   this.SpinnerService.show();
  //   let comData = this.prForm.value.commodity.id
  //   this.prposervice.getproductCategory(comData)
  //     .subscribe((results: any[]) => {
  //       this.SpinnerService.hide();
  //       let datas = results["data"];
  //       if (datas.length == 0) {
  //         this.notification.showInfo("No Records Found ")
  //       }
  //       this.SpinnerService.hide();
  //       this.productCategoryList = datas;
  //       console.log("prod cat", datas)
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })

  // }
  currentpageprodcat = 1;
  has_nextprodcat = true;
  has_previousprodcat = true;
  // autocompleteproductCategoryScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matproductCategoryAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matproductCategoryAutocomplete.panel
  //     ) {
  //       fromEvent(this.matproductCategoryAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matproductCategoryAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matproductCategoryAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matproductCategoryAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matproductCategoryAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_nextprodcat === true) {
  //               this.prposervice.getproductCategoryFKdd(this.prForm.value.commodity.id, this.productCategoryInput.nativeElement.value, this.currentpageprodcat + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.productCategoryList = this.productCategoryList.concat(datas);
  //                   if (this.productCategoryList.length >= 0) {
  //                     this.has_nextprodcat = datapagination.has_next;
  //                     this.has_previousprodcat = datapagination.has_previous;
  //                     this.currentpageprodcat = datapagination.index;
  //                   }
  //                 },(error) => {
  //                   this.errorHandler.handleError(error);
  //                   this.SpinnerService.hide();
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////product type

  public displayFnproductType(
    prodsubcat?: productTypeLists
  ): string | undefined {
    return prodsubcat ? prodsubcat.name : undefined;
  }
  // getproductTypeFK() {
  //   this.SpinnerService.show();
  //   let commoditydata = this.prForm.value.commodity.id
  //   let productCatIddata = this.prForm.value.productCategory?.id
  //   this.prposervice.getproductTypeFK(commoditydata, productCatIddata, '')
  //     .subscribe((results: any[]) => {
  //       this.SpinnerService.hide();
  //       let datas = results["data"];
  //       if (datas.length == 0) {
  //         this.notification.showInfo("No Records Found ")
  //       }
  //       this.SpinnerService.hide();
  //       this.productTypeList = datas;
  //       console.log("productType", datas)
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  //   // this.resetAfterProdCatChange()
  // }
  currentpageprodsubcat = 1;
  has_nextprodsubcat = true;
  has_previousprodsubcat = true;
  // autocompleteproductTypeScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matproductTypeAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matproductTypeAutocomplete.panel
  //     ) {
  //       fromEvent(this.matproductTypeAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matproductTypeAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matproductTypeAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matproductTypeAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matproductTypeAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_nextprodsubcat === true) {
  //               this.prposervice.getproductTypeFKdd(this.prForm.value.commodity.id, this.prForm.value.productCategory.id, this.productTypeinput.nativeElement.value, this.currentpageprodsubcat + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.productTypeList = this.productTypeList.concat(datas);
  //                   if (this.productTypeList.length >= 0) {
  //                     this.has_nextprodsubcat = datapagination.has_next;
  //                     this.has_previousprodsubcat = datapagination.has_previous;
  //                     this.currentpageprodsubcat = datapagination.index;
  //                   }
  //                 },(error) => {
  //                   this.errorHandler.handleError(error);
  //                   this.SpinnerService.hide();
  //                 })

  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////product

  public displayFnproduct(prod?: productLists): string | undefined {
    return prod ? prod.name : undefined;
  }

  // getproductFK() {
  //   this.SpinnerService.show();
  //   let commodity = this.prForm.value.commodity.id

  //   let productCat = this.prForm.value.productCategory.id
  //   let prodType = this.prForm.value.productType.id
  //   let Dts = this.prForm.value.dts
  //   this.prposervice.getproductDependencyFK(commodity, productCat, prodType, Dts, "")
  //     .subscribe((results: any[]) => {
  //       this.SpinnerService.hide();
  //       let datas = results["data"];
  //       if (datas.length == 0) {
  //         this.notification.showInfo("No Records Found")
  //       }
  //       this.productList = datas;
  //       console.log("product", datas)
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }
  //6671

  getpproduct() {
    this.getproductFK();

    this.prForm
      .get("product")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice
            .getproductPDependencyFKdd(
              this.prForm.value.type,
              this.prForm.value.commodity.id,
              // this.prForm.value.dts,
              this.prForm.get("dts")?.value,

              value,
              1,
              this.product_type
            )
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
              catchError((error) => {
                this.errorHandler.handleError(error); // Handle the error
                this.SpinnerService.hide(); // Hide the spinner
                // Optionally return a fallback value to continue the observable stream
                return of([]); // Empty array or fallback response
              })
            )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas;
      });
  }

  getsproduct() {
    this.getproductFK();

    this.prForm
      .get("product")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice
            .getproductDependencyFK(
              this.prForm.value.type,
              this.prForm.value.commodity.id,
              this.prForm.value.supplier.id,
              // this.prForm.value.dts,
              this.prForm.get("dts")?.value,

              value,
              1,
              this.product_type
            )
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
              catchError((error) => {
                this.errorHandler.handleError(error); // Handle the error
                this.SpinnerService.hide(); // Hide the spinner
                // Optionally return a fallback value to prevent the observable from terminating
                return of([]); // Empty array or fallback response
              })
            )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas;
      });
  }

  getproductFK() {
    this.SpinnerService.show();
    let commodity = this.prForm.value?.commodity?.id;
    let supplier = this.prForm.value?.supplier?.id;
    let type = this.prForm.value?.type;
    let value = this.productInput?.nativeElement?.value;
    // let assetvalue=this.assetvalue.nativeElement.value
    let assetvalue = this.prForm.value.is_asset;
    console.log("value==>", value);

    // let productCat = this.prForm.value.productCategory.id
    // let prodType = this.prForm.value.productType.id

    let Dts = this.prForm.get("dts")?.value;

    if (!commodity) {
      this.notification.showError("Choose Commodity!");
      this.SpinnerService.hide();
      return false;
    } else if (!this.product_type) {
      this.notification.showError("Choose Product Type!");
      this.SpinnerService.hide();
      return false;
    } else {
      // this.prposervice.getproductDependencyFK(commodity,value,assetvalue,1)
      this.prposervice
        // .getproductdata(value, 1)
        .getproductDependencyFK(
          type,
          commodity,
          supplier,
          Dts,
          value,
          1,
          this.product_type
        )
        .subscribe(
          (results: any[]) => {
            this.SpinnerService.hide();
            this.isLoading = false;

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
              this.productList = [];
              return false;
            } else {
              this.productList = datas;
            }
            //BUG ID:7538
            //  if (data['description'] ===  "The Product Doesn't Have a Valid Catalog") {
            //   this.SpinnerService.hide()
            //   this.notification.showError("The Product Doesn't Have a Valid Catalog")
            // }
            // ("The Product Doesn't Have a Valid Catalog");
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
    this.has_nextprod = true;
    this.has_previousprod = true;
    this.currentpageprod = 1;
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
                if (this.prForm.value.supplier == "") {
                  this.prposervice
                    .getproductDependencyyFKdd(
                      this.prForm.value.type,
                      this.prForm.value.commodity.id,
                      // this.prForm.value.dts,
                      this.prForm.get("dts")?.value,
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
                      },
                      (error) => {
                        this.errorHandler.handleError(error);
                        this.SpinnerService.hide();
                      }
                    );
                } else {
                  //6671 this.prposervice.getproductDependencyFKdd(this.prForm.value.commodity.id, this.prForm.value.productCategory.id, this.prForm.value.productType.id, this.prForm.value.dts, this.productInput.nativeElement.value, this.currentpageprod + 1)
                  this.prposervice
                    .getproductDependencyFK(
                      this.prForm.value.type,
                      this.prForm.value.commodity.id,
                      this.prForm.value.supplier.id,
                      // this.prForm.value.dts,
                      this.prForm.get("dts")?.value,
                      this.productInput.nativeElement.value,
                      this.currentpageprod + 1,
                      this.product_type
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

  autocompleteproductScrollP() {
    this.has_nextprod = true;
    this.has_previousprod = true;
    this.currentpageprod = 1;

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
                  .getproductPDependencyFKdd(
                    this.prForm.value.type,
                    this.prForm.value.commodity.id,
                    // this.prForm.value.dts,
                    this.prForm.get("dts")?.value,
                    this.productInput.nativeElement.value,
                    this.currentpageprod + 1,
                    this.product_type
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
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////items
  public displayFnitem(item?: itemsLists): string | undefined {
    return item ? item.make.name : undefined;
  }
  public displayFnitemmake(item?: itemsListsmake): string | undefined {
    return item ? item.name : undefined;
  }
  public displayprodtype(item?: itemsLists): string | undefined {
    return item ? item.name : undefined;
  }
  
  getitemFK() {
    // this.SpinnerService.show();
    this.MAKE = true;
    console.log("data", this.MAKE);
    let product = this.prForm.value?.product?.id;
    let commodity = this.prForm.value?.commodity?.id;
    let dts = this.prForm.get("dts")?.value;
    let supplier = this.prForm.value.supplier.id;
    this.SpinnerService.show();
    if (
      // supplier == undefined ||
      product == undefined
      // commodity == undefined
    ) {
      this.notification.showError("Kindly Choose Supplier and Product");
      this.itemList = [];
      this.SpinnerService.hide();
      return false;
    } else {
      // this.prposervice.getServiceUnitPrice(product,supplier ,dts, this.product_type, 1)
      // .subscribe(
      this.prposervice.getitemsDependencyFK(product, dts, supplier).subscribe(
        (results: any[]) => {
          this.SpinnerService.hide();
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
          if (data["description"]) {
            this.SpinnerService.hide();
            this.notification.showError(
              "The Product Doesn't Have a Valid Make"
            );
            this.itemList = [];
            return false;
          }
          if (datas.length == 0) {
            this.notification.showError("No data is there against make");
            this.itemList = [];
            this.prForm.patchValue({
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

          //BUG ID:6902
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }
  }
  // getitemUnitPrice(data) {
  //   this.prForm.patchValue({
  //     unitprice: data.unitprice
  //   })
  // }
  currentpageitem = 1;
  has_nextitem = true;
  has_previousitem = true;
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
                // this.prposervice.getServiceUnitPrice(   this.prForm.value.product.id,this.prForm.value.supplier,   this.prForm.value.dts, this.product_type, this.currentpageitem + 1 )

                this.prposervice
                  .getitemsDependencyFKdd(
                    this.prForm.value.product.id,
                    this.prForm.get("dts")?.value,
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
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // public displayFnmodel(model): string | undefined {
  //   return model ? model.name : undefined;
  // }
  public displayFnmodel(model?: modelsLists): string | undefined {
    return model ? model.model.name : undefined;
  }

  QuotationList: any = [];
  has_nextquot: boolean = true;
  has_prevquot: boolean = true;
  currentpageQuot: number = 1;
  getQuotation() {
    this.SpinnerService.show();
    let supplier = this.prForm.value?.supplier?.id;
    let product = this.prForm.value?.product?.id;

    if (supplier == undefined || supplier == "" || supplier == null) {
      this.notification.showError("Supplier is Required!");
      this.SpinnerService.hide();
      return false;
    }
    if (product == undefined || product == "" || product == null) {
      this.notification.showError("Product is Required!");
      this.SpinnerService.hide();
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
      (results: any) => {
        if (results?.code) {
          this.SpinnerService.hide();
          this.notification.showError(results?.description);
          return false;
        }
        this.SpinnerService.hide();
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
        this.SpinnerService.hide();
      }
    );
    // }
  }
  getmodall() {
    // this.SpinnerService.show();
    let product = this.prForm.value.product?.id;
    let commodity = this.prForm.value.commodity?.id;
    // let dts = this.prForm.value.dts;
    let dts = this.prForm.get("dts")?.value;

    let supplier = this.prForm.value.supplier?.id;
    let makeId = this.prForm.value.items.make?.id;
    let make = this.prForm.value.items?.make;
    if (this.is_model == false) {
      this.notification.showInfo("No Model Specified!");
      this.modelList = [];
      return;
    }
    this.SpinnerService.show();
    if (
      supplier == undefined ||
      product == undefined ||
      commodity == undefined ||
      make == undefined
    ) {
      this.notification.showError("Kindly Choose Product Name and Make");
      this.modelList = [];
      this.SpinnerService.hide();
      return false;
    } else {
      this.prposervice
        .getmodalDependency(product, supplier, dts, makeId)
        .subscribe(
          (results: any) => {
            if (results?.code) {
              this.SpinnerService.hide();
              this.notification.showError(results?.description);
              return false;
            }
            this.SpinnerService.hide();
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
              this.modelList = [];
            }
            this.modelList = datas;
            console.log("product", datas);

            if (
              data["description"] === "The Product Doesn't Have a Valid Catalog"
            ) {
              this.SpinnerService.hide();
              this.notification.showError(
                "The Product Doesn't Have a Valid Catalog"
              );
            }

            //BUG ID:6902
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
    }
  }

  currentpagemodel = 1;
  has_nextmodel = true;
  has_previousmodel = true;
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
                    this.prForm.get("dts")?.value,
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
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // pr_request(){

  // }
  // public displayFnspecs(spec?: specsLists): string | undefined {
  //   return spec ? spec.configuration.name : undefined;
  // }

  // public displayFnspecs(spec?: specsLists): string | undefined {
  //   if (spec && spec.configuration) {
  //     return Object.values(spec.configuration).map(val => {
  //       if (typeof val === 'object') {
  //         return JSON.stringify(val);
  //       } else {
  //         return val;
  //       }
  //     }).join(', ');
  //   }
  //   return undefined;
  // }

  // public displayFnspecs(spec?: specsLists): string | undefined {
  //   if (spec && spec.configuration) {
  //     const values = Object.values(spec.configuration).map(val => {
  //       if (typeof val === 'object') {
  //         return JSON.stringify(val);
  //       } else {
  //         return val;
  //       }
  //     });
  //     return values.join(', ');
  //   }
  //   return undefined;
  // }

  // public displayFnspecs(spec?: any): string | undefined {
  //   const flattenObject = (obj: any, prefix: string = ''): string[] => {
  //     return Object.entries(obj).reduce((acc: string[], [key, val]) => {
  //       const pre = prefix.length ? prefix + '.' + key : key;
  //       if (typeof val === 'object' && val !== null) {
  //         acc.push(...flattenObject(val, pre));
  //       } else {
  //         acc.push(`${pre}: ${val}`);
  //       }
  //       return acc;
  //     }, []);
  //   };

  //   if (spec && spec.configuration) {
  //     const values = Object.entries(spec.configuration).map(([key, val]) => {
  //       if (typeof val === 'object' && val !== null) {
  //         return flattenObject(val).join(', ');
  //       } else {
  //         return `${key}: ${val}`;
  //       }
  //     });
  //     return values.join(', ');
  //   }
  //   return undefined;
  // }

  public displayFnspecs(spec?: specsLists): string | undefined {
    return spec ? spec.configuration : undefined;
  }
  public displayFnQuotation(q: QuoteLists): string | undefined {
    return q ? q.quotation : undefined;
  }
  isQuotation: boolean = false;
  getQuotationData(data) {
    console.log("Quotation Data", data);
    this.isQuotation = true;
    // this.prForm.get('items').setValue(data?.make)
    // this.prForm.get('models').setValue(data?.model)
    // this.prForm.get('specs').setValue(data?.spec_config?.specification)
    // this.prForm.get('quotationid').setValue(data?.quotation_id)
    // this.prForm.get('quot_detailsid').setValue(data?.id)
    // this.prForm.get('quotation_no').setValue(data?.quotation_no)

    // this.prForm.get('unitprice').setValue(data?.price)

    this.prForm.patchValue({
      items: data?.make?.name || "",
      models: data?.model?.name || "",
      specs: data?.spec_config?.specification || "",
      quotationid: data?.quotation_id || "0",
      quot_detailsid: data?.id || "0",
      quotation_no: data?.supplier_quot || "--",
      unitprice: data?.price || "",
    });
    this.quotation_id = data?.quotation_id;
    this.supplier_id = data?.supplier_id;
    // this.prForm.updateValueAndValidity();

    // this.prForm.get('product_type').setValue(data?.producttype)
    // this.prForm.get('product').setValue(data?.product)
  }
  quotation_id: any;
  supplier_id: any;
  // if(dict["supplier_code"] == ""){}
  //  else {
  autocompleteQuotationScroll() {
    let supplier = this.prForm.value?.supplier?.code;
    let product = this.prForm.value?.product?.name;

    let dict = {
      supplier_code: supplier,
      product_name: product,
    };
    console.log("has next of spec==>", this.has_nextquot);
    setTimeout(() => {
      if (
        this.matQuotationAutocomplete &&
        this.autocompleteTrigger &&
        this.matQuotationAutocomplete.panel
      ) {
        fromEvent(this.matQuotationAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matQuotationAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matQuotationAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matQuotationAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matQuotationAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextquot === true) {
                this.prposervice
                  .quotationSearchh(dict, this.currentpageQuot)
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.QuotationList = this.QuotationList.concat(datas);
                      // this.conunitprice=datas[0].unitprice
                      if (this.QuotationList.length >= 0) {
                        this.has_nextquot = datapagination.has_next;
                        this.has_prevquot = datapagination.has_previous;
                        this.currentpageQuot = datapagination.index;
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

  getspecs() {
    // this.SpinnerService.show();
    let product = this.prForm.value.product?.id;
    let commodity = this.prForm.value.commodity?.id;
    // let dts = this.prForm.value.dts;
    let dts = this.prForm.get("dts")?.value;

    let supplier = this.prForm.value?.supplier?.id;
    let make = this.prForm.value?.items?.make?.id;
    let model = this.prForm.value?.models?.model?.id;
    this.SpinnerService.show();
    if (this.configuration == false && this.product_for == false) {
      this.notification.showError("No Configuration Specified!");
      this.specsList = [];
      this.SpinnerService.hide();
      return;
    }
    if (
      supplier == undefined ||
      product == undefined ||
      commodity == undefined
    ) {
      this.notification.showError("Kindly Choose Supplier and Product");
      this.specsList = [];
      this.SpinnerService.hide();
      return false;
    } else {
      this.prposervice
        .getspecsDependency(product, supplier, dts, make, model)
        .subscribe(
          (results: any[]) => {
            this.SpinnerService.hide();
            this.isLoading = false;

            let datas = results["data"];
            let data = results;
            // this.conunitprice=datas[0].unitprice

            this.currentpagespecs = 1;
            this.has_nextspecs = true;
            this.has_previousspecs = true;

            if (datas?.length == 0) {
              this.notification.showInfo("No Records Found");
              this.specsList = [];
            }

            this.specsList = datas;
            console.log("product", datas);

            if (data["description"]) {
              this.SpinnerService.hide();
              this.notification.showError(
                "The Product Doesn't Have a Valid Catalog"
              );
              this.specsList = [];
            }

            //BUG ID:6902
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
    }
  }

  currentpagespecs = 1;
  has_nextspecs = true;
  has_previousspecs = true;
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
                    // this.prForm.value.dts,
                    this.prForm.get("dts")?.value,
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
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // autocompleteitemScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matcommodityAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matcommodityAutocomplete.panel
  //     ) {
  //       fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
  //         .pipe(
  //           map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe(x => {
  //           const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_nextitem === true) {
  //                 this.prposervice.getitemsDependencyFKdd(this.prForm.value.product.id, this.prForm.value.dts, this.itemInput.nativeElement.value, this.prForm.value.supplier, this.currentpageitem + 1)
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.itemList = this.itemList.concat(datas);
  //                   if (this.commodityList.length >= 0) {
  //                     this.has_nextitem = datapagination.has_next;
  //                     this.has_previousitem = datapagination.has_previous;
  //                     this.currentpageitem = datapagination.index;
  //                   }
  //                 },(error) => {
  //                   this.errorHandler.handleError(error);
  //                   this.SpinnerService.hide();
  //                 })
  //             }
  //           }
  //         });
  //     }
  //   });
  // }

  //////////////////////////////////////////////////////////////////////////////////////////////commodity

  public displayFncommodity(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }

  getprmcommodity() {
    this.getCommodityFK();

    this.prForm
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
            .getcommodityDependencyFKdd(this.prForm.value.mepno, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
              catchError((error) => {
                this.errorHandler.handleError(error); // Handle the error
                this.SpinnerService.hide(); // Hide the spinner
                // Optionally return a fallback value to continue the observable stream
                return of([]); // Empty array or fallback response
              })
            )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityList = datas;
      });
  }

  getCommodityFK() {
    if (this.prForm.value.prdetails.length > 0) {
      this.notification.showWarning(
        "Here after, Commodity is not allowed to choose!!. If you want to change Commodity please DELETE the Product Below "
      );
      return false;
    }
    this.SpinnerService.show();
    let productData = this.prForm.value.mepno;
    this.prposervice.getcommodityDependencyFK(productData, "").subscribe(
      (results: any[]) => {
        console.log("Commodity result==>", results);

        this.SpinnerService.hide();
        this.isLoading = false;

        this.isLoading = false;
        let datas = results["data"];
        this.commodityList = datas;
        console.log("product", datas);
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
    this.currentpagecom = 1;
    this.has_nextcom = true;
    this.has_previouscom = true;

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
                    this.prForm.value.mepno,
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////supplier
  currentpagesupplier = 1;
  has_nextsupplier = true;
  has_previoussupplier = true;
  autocompletesupplierScroll() {
    this.currentpagesupplier = 1;
    this.has_nextsupplier = true;
    this.has_previoussupplier = true;
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

  ////////////////////////////////////////////////////

  autocompletesupplierScrollP() {
    this.currentpagesupplier = 1;
    this.has_nextsupplier = true;
    this.has_previoussupplier = true;
    setTimeout(() => {
      if (
        this.matsupplierrAutocomplete &&
        this.autocompleteTrigger &&
        this.matsupplierrAutocomplete.panel
      ) {
        fromEvent(this.matsupplierrAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matsupplierrAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matsupplierrAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matsupplierrAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matsupplierrAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsupplier === true) {
                this.prposervice
                  .getsupplierPDependencyFKdd(
                    this.prForm.value?.product?.id,
                    // this.prForm.value.dts,
                    this.prForm.get("dts")?.value,
                    this.supplierInputt?.nativeElement?.value,
                    this.currentpagesupplier + 1,
                    this.product_type,
                    this.selectedTypeQ
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

  ///////////////////////////////////////////////////
  public displayFnsupplier(supplier?: supplierlistss): any | undefined {
    return supplier ? supplier.name : undefined;
  }

  getpsupplier() {
    this.getSupplier();

    this.prForm
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
              this.prForm.value?.product?.id,
              // this.prForm.value.dts,
              this.prForm.get("dts")?.value,
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
                this.SpinnerService.hide(); // Hide the spinner
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

  getssupplier() {
    this.getSupplier();

    this.prForm
      .get("supplier")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          // console.log('inside tap')
        }),
        switchMap((value) =>
          this.prposervice.getsupplierDependencyFKdd1(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            catchError((error) => {
              this.errorHandler.handleError(error); // Handle the error
              this.SpinnerService.hide(); // Hide the spinner
              // Optionally return a fallback value to keep the stream alive
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

  getSupplier() {
    let product = this.prForm.value?.product?.id;
    let dts = this.prForm.get("dts")?.value;

    let type = this.prForm.value?.type;

    this.SpinnerService.show();
    this.prposervice
      .getsupplierDependencyFK1(
        product,
        dts,
        type,
        this.product_type,
        this.selectedTypeQ,
        1
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.SpinnerService.hide();
          this.isLoading = false;

          this.supplierList = datas;
          console.log("supplierList", datas);
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }
  // getUnitprice() {
  //   let typedata = this.prForm.value.type
  //   if (typedata == 1) {
  //     let supplierdata = this.prForm.value.supplier.id
  //     let itemsname = this.prForm.value.items.name
  //     let productID = this.prForm.value.product.id
  //     // let makeID = this.prForm.value.items.id
  //     // let modelID = this.prForm.value.models.id
  //     // let specsID = this.prForm.value.specs.id
  //     if ((itemsname == "") || (itemsname == null) || (itemsname == undefined)) {
  //       return false
  //     }
  //     if ((supplierdata == "") || (supplierdata == null) || (supplierdata == undefined)) {
  //       return false
  //     }
  //     this.SpinnerService.show()
  //     this.prposervice.gettingUnitpricePR(itemsname, supplierdata, productID)
  //       .subscribe(results => {
  //         this.SpinnerService.hide()
  //         let data = results['data']

  //         this.SpinnerService.hide()

  //          // BUG ID:7538
  //          if (results['description'] === "Product - Catelog Price Is Not Valid For The Choosen Period") {
  //           this.notification.showError("Product - Catelog Price Is Not Valid For The Choosen Period")
  //         }
  //         //7538
  //         this.prForm.patchValue({
  //           unitprice: data[0]?.unitprice,
  //           itemsid: data[0]?.id,
  //           uom: data[0]?.uom.name
  //         })
  //       },(error) => {
  //         this.errorHandler.handleError(error);
  //         this.SpinnerService.hide();
  //       })
  //   }
  // }

  // getSupplierUnitPrice(data) {
  //   this.prForm.patchValue({
  //     unitprice: data.unit_price
  //   })
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// branch

  public displayFnbranch(branch?: branchlistss): any | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }

  getbranchFK() {
    this.SpinnerService.show();
    this.prposervice.getbranchdd().subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.branchList = datas;
        this.isLoading = false;
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////bs
  currentpagebs = 1;
  has_nextbs = true;
  has_previousbs = true;
  getbsdd() {
    this.SpinnerService.show();
    this.prposervice.getbsvaluedd().subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.bslist = datas;
        console.log("bslist", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
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
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }

  public displayFnbs(bs?: bslistss): any | undefined {
    if (typeof bs === "string") {
      return bs;
    }
    return bs ? bs.name : undefined;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////cc

  autocompleteccScroll() {
    // setTimeout(() => {
    //   if (
    //     this.matccAutocomplete &&
    //     this.autocompleteTrigger &&
    //     this.matccAutocomplete.panel
    //   ) {
    //     fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_next === true) {
    //             this.prposervice.getcclistDependentBsdd(this.prForm.value.commodity.id, this.ccInput.nativeElement.value, this.currentpage + 1)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.cclist = this.cclist.concat(datas);
    //                 // console.log("emp", datas)
    //                 if (this.cclist.length >= 0) {
    //                   this.has_next = datapagination.has_next;
    //                   this.has_previous = datapagination.has_previous;
    //                   this.currentpage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }

  // getccValue(productIndex, ccbsIndex) {
  getccValue(productIndexs, ccbsIndex) {
    //7421
    // let BsLine = this.prForm.get('prdetails')['controls'][productIndex].get('prccbs')['controls'][ccbsIndex].value.bs.id
    let productIndex = this.pgsize * (this.pg - 1) + productIndexs; //7421

    let BsLine = this.prForm
      .get("prdetails")
      ["controls"][productIndex].get("prccbs")["controls"][ccbsIndex].value
      .bs?.id;

    console.log(" bs id getting   ", BsLine);
    if (BsLine == null || BsLine == undefined || BsLine == "") {
      return false;
    }
    this.SpinnerService.show();
    this.prposervice.getcclistDependentBs(BsLine).subscribe(
      (result) => {
        let datas = result["data"];
        this.SpinnerService.hide();
        if (datas.length == 0) {
          this.SpinnerService.hide();
          this.notification.showInfo("No Records Found");
        }
        this.cclist = result["data"];
        console.log("cc", this.cclist);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  ccclear(productIndexs, ccbsIndex) {
    // ccclear(productIndex, ccbsIndex) {
    let productIndex = this.pgsize * (this.pg - 1) + productIndexs; //7421
    this.prForm
      .get("prdetails")
      ["controls"][productIndex].get("prccbs")
      ["controls"][ccbsIndex].get("cc")
      .setValue("");
  }

  public displayFncc(cc?: cclistss): any | undefined {
    if (typeof cc === "string") {
      return cc;
    }
    return cc ? cc.name : undefined;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////emp
  currentpageemp = 1;
  has_nextemp = true;
  has_previousemp = true;
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
                      this.SpinnerService.hide();
                    }
                  );
              }
            }
          });
      }
    });
  }
  public displayFnemp(emp?: Emplistss): string | undefined {
    // console.log('id', emp.id);
    // console.log('full_name', emp.full_name);
    return emp ? emp.full_name : undefined;
  }

  getemployeeForApprover() {
    let commodityID = this.prForm.value.commodity.id;
    console.log("commodityID", commodityID);
    if (commodityID === "" || commodityID === undefined) {
      this.notification.showInfo(
        "Please Select the Commdity to choose the Approver"
      );
      return false;
    }
    this.SpinnerService.show();
    this.prposervice.getemployeeApproverforPR(commodityID).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        if (datas.length == 0) {
          this.SpinnerService.hide();
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
        this.SpinnerService.hide();
      }
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////SUBMIT
  PRSubmit(typeOfSubmit) {
    if (typeOfSubmit == "makersubmit") {
      if (this.prForm.value.mepno != "") {
        if (this.prForm.value.totalamount > this.remainamt) {
          this.notification.showWarning(
            "Total Amount Exceeded than PCA Remaining Amount "
          );
          return false;
        }
      }
      if (
        (this.prForm.value.employee_id == "" ||
          this.prForm.value.employee_id == undefined ||
          this.prForm.value.employee_id == null) &&
        this.independentpr
      ) {
        this.notification.showWarning("Please choose Approver Employee");
        return false;
      }

      if (
        this.prForm.value == null ||
        this.prForm.value == "" ||
        this.prForm.value == 0
      ) {
        this.notification.showWarning(
          "Data Seems Empty..Pls fill Atleast commodity"
        );
        return false;
      }

      // if(this.prForm.value.specs == null || this.prForm.value.specs == "" || this.prForm.value.specs == undefined ){
      //   this.notification.showWarning('Please Check Unitprice')
      //   return false
      // }

      // let headerfilesvalue = this.filesHeader.value.file_upload
      // if (this.prForm.value.type == 2) {
      //   if (headerfilesvalue.length == 0) {
      //     this.notification.showWarning("Please Choose Header Files")
      //     return false
      //   }
      let filesvalueDetails = this.files.value.file_upload;
      let detailsValue = this.prForm.value.prdetails;

      if (this.isprbulkupload != true) {
        if (detailsValue.length == 0) {
          this.notification.showWarning(
            "Details seems empty Please fill the details before submit"
          );
          return false;
        }
      }
      if (!this.selectedToggle) {
        this.notification.showWarning(
          "Please Select Independent PR or Batch PR"
        );
        return false;
      }
    }
    // if (this.prForm.value.type == 1) {
    //   if (filesvalueDetails.length != detailsValue.length) {
    //     this.notification.showWarning("Please Check files is selected for all details")
    //     return false
    //   }

    // }

    let datadetails = this.prForm.value.prdetails;
    if (typeOfSubmit == "draft") {
      console.log(
        "this.prForm.value.commodity",
        this.prForm.value.commodity_id
      );
      if (
        this.prForm.value.commodity_id == "" ||
        this.prForm.value.commodity_id == null ||
        this.prForm.value.commodity_id == undefined
      ) {
        this.notification.showWarning("Choose Atleast Commodity");
        return false;
      }
    }

    // if(this.prForm.value.specs == null || this.prForm.value.specs == "" || this.prForm.value.specs == undefined ){
    //     this.notification.showWarning('Please Check Unitprice')
    //     return false
    //   }
    console.log("datadetails", datadetails);
    if (datadetails?.length > 0) {
      for (let detail in datadetails) {
        let datadetailsUom: any;
        console.log("this.prForm.value.type", this.prForm.value.type);
        console.log("datadetails[detail].uom", datadetails[detail].uom);

        delete datadetails[detail].pr_for;
        delete datadetails[detail].is_save;

        // if(this.prForm.value.type == 1 ){
        //   datadetails[detail].uom = datadetails[detail].uom
        // }else{
        //   datadetails[detail].uom = datadetails[detail].uom.name done by ram for uom patch in draft
        // }
        console.log("datadetailsUom", datadetailsUom);
        let datadetailsqty = datadetails[detail].qty;
        datadetails[detail].unitprice=parseFloat(datadetails[detail].unitprice.replace(/,/g,''))
        let datadetailsunitPrice = datadetails[detail].unitprice;

        let detailIndex = Number(detail);

        if (typeOfSubmit != "draft") {
          if (
            datadetails[detail].uom == "" ||
            datadetails[detail].uom == null ||
            datadetails[detail].uom == undefined
          ) {
            this.notification.showWarning(
              "Please fill UOM at line " + (detailIndex + 1)
            );
            return false;
          }
          if (
            datadetailsqty == "" ||
            datadetailsqty == null ||
            datadetailsqty == undefined
          ) {
            this.notification.showWarning(
              "Please fill Quantity at line " + (detailIndex + 1)
            );
            return false;
          }
          if (
            datadetailsunitPrice == "" ||
            datadetailsunitPrice == null ||
            datadetailsunitPrice == undefined
          ) {
            this.notification.showWarning(
              "Please fill Unitprice at line " + (detailIndex + 1)
            );
            return false;
          }
        }
        let prccbsdata = datadetails[detail].prccbs;
        for (let ccbs in prccbsdata) {
          let branchdata = prccbsdata[ccbs].branch_id;
          let bsdata = prccbsdata[ccbs].bs;
          let ccdata = prccbsdata[ccbs].cc;
          let qtydataOnCCBS = prccbsdata[ccbs].qty;
          let detailIndex = Number(detail);
          let ccbsindex = Number(ccbs);
          if (typeOfSubmit != "draft") {
            if (
              branchdata == "" ||
              branchdata == null ||
              branchdata == undefined
            ) {
              this.notification.showWarning(
                "Please fill branch details at line " +
                  (detailIndex + 1) +
                  " in CCBS at line " +
                  (ccbsindex + 1)
              );
              return false;
            }
            if (bsdata == "" || bsdata == null || bsdata == undefined) {
              this.notification.showWarning(
                "Please fill BS details at line " +
                  (detailIndex + 1) +
                  " in CCBS at line " +
                  (ccbsindex + 1)
              );
              return false;
            }
            if (ccdata == "" || ccdata == null || ccdata == undefined) {
              this.notification.showWarning(
                "Please fill CC details at line " +
                  (detailIndex + 1) +
                  " in CCBS at line " +
                  (ccbsindex + 1)
              );
              return false;
            }
            if (
              qtydataOnCCBS == "" ||
              qtydataOnCCBS == null ||
              qtydataOnCCBS == undefined
            ) {
              this.notification.showWarning(
                "Please fill Quantity details at line " +
                  (detailIndex + 1) +
                  " in CCBS at line " +
                  (ccbsindex + 1)
              );
              return false;
            }
          }
        }
      }

      ///////////////////////////////////////// ccbs validation on each row
      let ccbsarrayqtyTotal = [];
      let arrayofQtyPrdetails = this.prForm.value.prdetails.map((x) => x.qty);
      console.log("prdetailsarray", arrayofQtyPrdetails);
      let ccbsarray = this.prForm.value.prdetails;
      ccbsarray.forEach((row, index) => {
        let ccbsarrayqty = ccbsarray[index].prccbs.map((x) => x.qty);
        console.log("ccbs array qty", ccbsarrayqty);
        let totalqtydetails = ccbsarrayqty.reduce((a, b) => a + b, 0);
        ccbsarrayqtyTotal.push(totalqtydetails);
        console.log("ccbs array qty Total", ccbsarrayqtyTotal);
      });

      if (typeOfSubmit == "makersubmit") {
        for (let indexx in arrayofQtyPrdetails) {
          if (arrayofQtyPrdetails[indexx] != ccbsarrayqtyTotal[indexx]) {
            let a = Number(indexx);
            this.notification.showError(
              "CCBS Error: Please check quantity on line   " +
                (a + 1) +
                ", The maximum limit is " +
                arrayofQtyPrdetails[indexx] +
                " quantity, It should be equal to Maximum limit "
            );
            return false;
          }
        }
      }

      console.log("this.prform.value===>", this.prForm.value);

      let detailsvalue = this.prForm.value;
      console.log("detailsvalue===>", detailsvalue);

      if (detailsvalue) {
        delete detailsvalue.productCategory;
        delete detailsvalue.commodity;
        delete detailsvalue.itemnoncatlog;
        delete detailsvalue.items;
        delete detailsvalue.models;
        // delete detailsvalue.specs
        delete detailsvalue.product;
        delete detailsvalue.productnoncatlog;
        delete detailsvalue.productType;
        delete detailsvalue.supplier;
        delete detailsvalue.supplier_id;
        delete detailsvalue.unitprice;
      }

      let prdetailsvalue = this.prForm.value.prdetails;
      for (let i in prdetailsvalue) {
        delete prdetailsvalue[i].branch;
        delete prdetailsvalue[i].commodityname;
        delete prdetailsvalue[i].itemname;
        delete prdetailsvalue[i].modelname;
        // delete prdetailsvalue[i].specification
        delete prdetailsvalue[i].productname;
        delete prdetailsvalue[i].suppliername;
        if (this.prForm.value.type == 2) {
          // this.prForm.value.hsn = prdetailsvalue[i].hsn.id
          this.prForm.value.hsn = 0;
        }
        let ccbsbranch = prdetailsvalue[i].prccbs;
        for (let j in ccbsbranch) {
          if (ccbsbranch[j].branch_id.id == undefined) {
            ccbsbranch[j].branch_id = ccbsbranch[j].branch_id;
          } else {
            ccbsbranch[j].branch_id = ccbsbranch[j].branch_id.id;
          }
          if (ccbsbranch[j].bs.name == undefined) {
            ccbsbranch[j].bs = ccbsbranch[j].bs;
          } else {
            ccbsbranch[j].bs = ccbsbranch[j].bs.name;
          }
          if (ccbsbranch[j].cc.name == undefined) {
            ccbsbranch[j].cc = ccbsbranch[j].cc;
          } else {
            ccbsbranch[j].cc = ccbsbranch[j].cc.name;
          }
        }
      }
    }
    // this.prForm.value.branch_id = this.prForm.value?.branch_id?.id
    // this.prForm.value.employee_id = this.prForm.value?.employee_id?.id
    // console.log("employee",this.prForm.value.employee_id.id);
    // if(this.prForm.value.employee_id == null || this.prForm.value.employee_id == undefined || this.prForm.value.employee_id ==''){
    //   this.prForm.value.employee_id = this.prForm.value?.employee_id

    // }
    // this.prForm.value.models=this.prForm.value.models
    this.prForm.value.specs = this.prForm.value.specs;
    // this.prForm.value.commodity = this.prForm.value.commodity.id

    ////////////////////////////////////////////////////////////// 7420&7421

    // let obj={
    //   type:this.prForm.value.type,
    //   mepno:this.prForm.value.mepno ,
    //   mepnokey: this.prForm.value.mepnokey,
    //   // is_asset:[0],   //7480
    //   commodity: '',
    //   commodity_id:  this.prForm.value.commodity_id,
    //   // productCategory: '',
    //   // productType: '',
    //   dts:    this.prForm.value.dts,
    //   // product: '',
    //   // items: '',
    //   itemsid: this.prForm.value.itemsid,
    //   // productnoncatlog: '',
    //   // itemnoncatlog: '',
    //   // supplier: this.prForm.value.supplier_id,
    //   supplier_id: this.prForm.value.supplier_id,
    //   unitprice: this.prForm.value.unitprice,
    //   uom: this.prForm.value.uom,
    //   employee_id: this.prForm.value.employee_id,
    //   branch_id: this.prForm.value.branch_id.id,
    //   totalamount: this.prForm.value.totalamount,
    //   notepad:this.prForm.value.totalamount,
    //   prdetails_bfile_id: this.prForm.value.prdetails_bfile_id,
    //   prdetails: this.prForm.value.prdetails,
    //   // file_key:[["fileheader"]],

    //    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // this.prForm.value.prdetails_bfile_id=this.prblkuploadfile   //7420
    // this.prForm.get('prdetails')['controls'][this.CCBSindex].get('ccbs_bfile_id').setValue(this.ccbsblkfile)  //7421
    // if((this.prForm.value.prdetails_bfile_id==null)|| (this.prForm.value.prdetails_bfile_id=="")||(this.prForm.value.prdetails_bfile_id==undefined)){
    //   this.prForm.value.prdetails_bfile_id=""
    // }
    // prdetails_bfile_id
    // this.prForm.addControl("prdetails_bfile_id", this.prblkuploadfile )

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // if((this.is_make == false)){
    //   this.prForm.patchValue({
    //    item_id:"",
    //    item_name:"",
    //    model_id:"",
    //    model_name:"",
    //    specification: ''

    //   })
    // }

    if (this.is_model == false) {
      this.prForm.patchValue({
        model_id: "",
        model_name: "",
        specification: "",
      });
    }
    if (this.configuration == false) {
      this.prForm.patchValue({
        specification: "",
      });
    }
    console.log("datasssssssss", this.prForm.value);

    this.prForm.value.prdetails_bfile_id = this.prForm.value.prdetails_bfile_id;
    let prdetailsvalue = this.prForm.value.prdetails;
    let emp = typeof this.prForm.value.employee_id;
    if (emp == "object") {
      let id = this.prForm.value?.employee_id?.id;
      this.prForm.get("employee_id")?.setValue(id);
    } else {
      this.prForm.get("employee_id").disable();
    }
    let branch = typeof this.prForm.value.branch_id;
    if (branch == "object") {
      let id = this.prForm.value?.branch_id?.id;
      this.prForm.get("branch_id")?.setValue(id);
    }

    // if(!this.prForm.value.commodity_id){
    //   this.prForm.value.commodity_id = this.prForm.value.commodity.id;
    //   }

    // let dataSubmit = this.prForm.value;
    // let filteredDataSubmit: { [key: string]: any } = {};
    // for (let key in dataSubmit) {
    //   if (dataSubmit[key] !== null && dataSubmit[key] !== undefined && dataSubmit[key] !== '') {
    //     filteredDataSubmit[key] = dataSubmit[key];
    //   }
    // }    // let dataSubmit = obj

    let dataSubmit = { ...this.prForm.value };

    if (this.prapproveId) {
      dataSubmit = { ...dataSubmit, id: this.prapproveId };
    }

    if (this.selectedTypeQ == 2) {
      dataSubmit = { ...dataSubmit, dts: 0 };
    }
    delete dataSubmit.service_des;

    console.log("Pr Final Data", JSON.stringify(dataSubmit));

    // dataSubmit = Object.assign({}, dataSubmit, { "prdetails_del":this.prdetails_delete },{ "prccbs_del":this.prccbs_delete })
    // dataSubmit['prdetails_del']=this.prdetails_delete;
    // dataSubmit['prccbs_del']=this.prccbs_delete;
    dataSubmit = Object.assign({}, dataSubmit, {
      prdetails_del: this.prdetails_delete,
    }); //7421
    dataSubmit = Object.assign({}, dataSubmit, {
      prccbs_del: this.prccbs_delete,
    }); //7420
    // dataSubmit = Object.assign({}, dataSubmit, { "specification": {configuration:this.prForm.value.specs} })      //7420

    let filesvalue = this.files.value.file_upload;
    let filesHeadervalue = this.filesHeader.value.file_upload;
    console.log("datasubmit==>", dataSubmit);
    this.formDataChange(dataSubmit, typeOfSubmit);
  }

  config1: any = {
    placeholder: "Enter your note here...",

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
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Note Pad
  config: any = {
    placeholder: "Enter your note here...",
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

  employeeCode: any;
  employeeLimit: any;
  employeeValues: any;
  empValues(data) {
    this.employeeCode = data.code;
    this.employeeLimit = data.limit;
    this.employeeValues = data;
  }

  onCancelClick() {
    // this.router.navigate(['/prmaster'], { skipLocationChange: true })
    this.onCancel.emit();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// File upload

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

  FileDataArray = [];
  FileDataArrayIndex = [];
  onFileSelected(e, index) {
    // onFileSelected(e, j) {
    let j = this.pgsize * (this.pg - 1) + index; //7421
    this.FileDataArray[j] = e.target.files[0];
    this.FileDataArrayIndex[j] = j;
    console.log("this.FilesDataArray", this.FileDataArray);
    console.log("this.FilesDataArrayIndex", this.FileDataArrayIndex);
  }

  formDataChange(dataPO, typeOfSubmit) {
    console.log("fdataPO", dataPO);
    const formData: FormData = new FormData();
    let formdataIndex = this.FileDataArrayIndex;
    let formdataValue = this.FileDataArray;
    console.log("formdataIndex  after", formdataIndex);
    console.log("formdataValue  after", formdataValue);
    console.log("formdata==>", formData);
    console.log("this.FormData==>", FormData);
    for (let i = 0; i < formdataValue.length; i++) {
      let keyvalue = "file_key" + formdataIndex[i];
      let pairValue = formdataValue[i];

      if (formdataValue[i] == "") {
        console.log("");
      } else {
        formData.append(keyvalue, pairValue);
      }
    }
    let PRFormData = this.prForm.value.prdetails;

    for (let filekeyToinsert in formdataIndex) {
      let datakey = "file_key" + filekeyToinsert;
      console.log("datakey", datakey);
      PRFormData[filekeyToinsert].file_key = datakey;
    }
    let HeaderFilesdata = this.filesHeader.value.file_upload;
    for (var i = 0; i < HeaderFilesdata.length; i++) {
      let keyvalue = "fileheader";
      let pairValue = HeaderFilesdata[i];

      if (HeaderFilesdata[i] == "") {
        console.log("");
      } else {
        formData.append(keyvalue, pairValue);
      }
    }

    if (this.batchpr == true) {
      dataPO.pr_type = 2;
      dataPO.pr_draft_type = 2;
    } else {
      dataPO.pr_type = 1;
      dataPO.pr_draft_type = 1;
    }
    console.log("datadataPO==>", dataPO);
    let datavalue = JSON.stringify(dataPO);
    formData.append("data", datavalue);
    if (typeOfSubmit == "makersubmit") {
      this.SpinnerService.show();
      if (this.batchpr == true) {
        this.prposervice.batchprcrete(datavalue, this.Services).subscribe(
          (result) => {
            this.SpinnerService.hide();
            // if (result?.code) {
            //   this.SpinnerService.hide();
            //   this.notification.showError(result?.description);
            //   return false;
            // }

            if (result.id == undefined) {
              this.SpinnerService.hide();
              // this.notification.showError(result.description)
              this.notification.showSuccess("Successfully Created!...");
              this.onSubmit.emit();
              return true;
            } else {
              this.SpinnerService.hide();
              // this.notification.showSuccess("Successfully Created!...");
              this.notification.showError(result.description);

              this.selectreporttype(1);
            }

            console.log("pomaker Form SUBMIT", result);
            return true;
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
      } else {
        this.prposervice.prCreateForm(formData, this.Services).subscribe(
          (result) => {
            this.SpinnerService.hide();
            // if (result?.code) {
            //     this.SpinnerService.hide();
            //     this.notification.showError(result?.description);
            //     return false;
            //   }

            if (result.code=== "Asset ID Already Exists"
            ) {
                  this.SpinnerService.hide();
              let assetArr: any = [];
              assetArr = result.description["Asset ID"];
              // let assets = assetArr.map((x) => x.error);
              // this.notification.showInfo(assets.join("\n"));
               const message = assetArr.map(x => x.error).join('<br><br>');

            this.toastService.info(message, '', {
              enableHtml: true,
              timeOut: 5000,
            });
              this.prForm.get("employee_id").enable();
              this.prForm.get("employee_id")?.setValue(this.employeeValues);
              this.prForm.get("branch_id").enable();
              this.getEmployeeBranchData();
              return;
            }else if(result.code != "Asset ID Already Exists" && result.id === undefined){
                this.SpinnerService.hide();
              this.notification.showError(result.description);
              this.prForm.get("employee_id").enable();
              this.prForm.get("employee_id")?.setValue(this.employeeValues);
              this.prForm.get("branch_id").enable();
              this.getEmployeeBranchData();
              return;
            }

             else if(result.id) {
              this.SpinnerService.hide();
              this.notification.showSuccess("Successfully Created!...");
              this.onSubmit.emit();
            }

            // if (result.code == "Asset ID Already Exists") {
            //   this.SpinnerService.hide();
            //   let assetArr: any = [];
            //   assetArr = result.description["Asset ID"];
            //   let assets = assetArr.map((x) => x.error);
            //   this.notification.showInfo(assets.join("\n"));
            //   this.prForm.get("employee_id").enable();
            //   this.prForm.get("employee_id")?.setValue(this.employeeValues);
            //   this.prForm.get("branch_id").enable();
            //   this.getEmployeeBranchData();
            //   return;
            // }
            console.log("pomaker Form SUBMIT", result);
            return true;
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
      }
    }
    if (typeOfSubmit == "preview") {
          
        //  formData.append("raiser_branch_data", JSON.stringify(this.empBranchdata));
          const previewData = {
    ...dataPO,
    raiser_branch_data: this.empBranchdata
  };
      // this.showimageHeaderPreviewPDF = true;
      this.SpinnerService.show();
      this.prposervice.getpdfpreview(previewData).subscribe((datas) => {
        if (datas?.code) {
        this.SpinnerService.hide();
        this.notification.showError(datas?.description);
        return false;
      }

        this.SpinnerService.hide();
        let blob = new Blob([datas], { type: "application/pdf" });
        let downloadUrl = window.URL.createObjectURL(blob);
        let name = 'Purchase Request'
  
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
        // let reader = new FileReader();
        // console.log("reader", reader);
        // reader.onload = (e: any) => {
        //   this.pdfurl = e.target.result;
        //   console.log("this.pdfurl", e);
        //    this.SpinnerService.hide();
          
        // };
    
           this.SpinnerService.hide();
     this.independentpr = true;
     this.prForm.get("employee_id").enable();
       this.prForm.get("employee_id")?.setValue(this.employeeValues);

    }

    // else if ( typeOfSubmit == 'draft'   ){
    //   this.SpinnerService.show()
    //   this.prposervice.prDraftForm(formData)
    // .subscribe(result => {
    //   this.SpinnerService.hide()
    //   if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
    //     this.SpinnerService.hide()
    //     this.notification.showError("Please fill all  the field")
    //   }
    //   else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
    //     this.SpinnerService.hide()
    //     this.notification.showError("something went wrong")
    //   }
    //   else {
    //     this.SpinnerService.hide()
    //     this.notification.showSuccess("Successfully Drafted!...")
    //     // this.router.navigate(['/pr'], { skipLocationChange: true })
    //     this.onSubmit.emit();
    //   }
    // },(error) => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })
    // }
    // BUG ID:4529-c
    else if (typeOfSubmit == "draft") {
      this.SpinnerService.show();
      console.log("formData==>", formData);
      this.prposervice.prDraftForm(formData).subscribe(
        (result) => {
          // this.SpinnerService.hide();

          if (
            result.code === "UNEXPECTED_ERROR" &&
            result.description === "Unexpected Internal Server Error"
          ) {
            this.SpinnerService.hide();
            this.notification.showError("something went wrong");
            this.prForm.get("employee_id").enable();
            this.prForm.get("employee_id")?.setValue(this.employeeValues);
            this.prForm.get("branch_id").enable();
            this.getEmployeeBranchData();
          } else if (result.code == "Asset ID Already Exists") {
            this.SpinnerService.hide();
            let assetArr: any = [];
            assetArr = result.description;
            let assets = assetArr.map((x) => x.error);
            this.notification.showInfo(assets.join("\n"));
            this.prForm.get("employee_id").enable();
            this.prForm.get("employee_id")?.setValue(this.employeeValues);
            this.prForm.get("branch_id").enable();
            this.getEmployeeBranchData();

            return;
          } else if (result.code == "INVALID_FILETYPE") {
            this.SpinnerService.hide();
            this.notification.showError(result.description);
            this.prForm.get("employee_id").enable();
            this.prForm.get("employee_id")?.setValue(this.employeeValues);
            this.prForm.get("branch_id").enable();
            this.getEmployeeBranchData();
            return;
          } else {
            this.SpinnerService.hide();
            this.notification.showSuccess("Successfully Drafted!...");
            // this.router.navigate(['/pr'], { skipLocationChange: true })
            this.onSubmit.emit();
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }
  }

  empBranchdata: any;
  getEmployeeBranchData() {
    this.SpinnerService.show();
    this.prposervice.getEmpBranchId().subscribe(
      (results: any) => {
        this.SpinnerService.hide();
        if (results.error) {
          this.SpinnerService.hide();
          this.notification.showWarning(results.error + results.description);
          this.prForm.controls["branch_id"].reset("");
          return false;
        }

        let datas = results;
        this.empBranchdata = datas;
        this.branchid = this.empBranchdata.id;
        console.log("this.branchid==>", this.empBranchdata.id);
        console.log("empBranchdata", datas);
        this.prForm.patchValue({
          branch_id: this.empBranchdata,
        });
        console.log(this.prForm.value);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  resetAfterccbsbranchChange(prindexs, ccbsindex) {
    // resetAfterccbsbranchChange(prindex, ccbsindex){
    let prindex = this.pgsize * (this.pg - 1) + prindexs; //7421
    // this.prForm.controls["items"].reset("")
    this.prForm
      .get("prdetails")
      ["controls"][prindex].get("prccbs")
      ["controls"][ccbsindex].get("branch_id")
      .reset("");
  }

  resetAfterbsccbsChange(prindexs, ccbsindex) {
    // resetAfterbsccbsChange(prindex, ccbsindex){
    let prindex = this.pgsize * (this.pg - 1) + prindexs; //7421
    this.prForm
      .get("prdetails")
      ["controls"][prindex].get("prccbs")
      ["controls"][ccbsindex].get("bs")
      .reset("");
  }

  // resetAfterSccccbsChange(prindex, ccbsindex){
  resetAfterSccccbsChange(prindexs, ccbsindex) {
    let prindex = this.pgsize * (this.pg - 1) + prindexs; //7421
    this.prForm
      .get("prdetails")
      ["controls"][prindex].get("prccbs")
      ["controls"][ccbsindex].get("cc")
      .reset("");
  }

  //4529
  // patchUom(index, dataForm, uom){
  patchUom(indexs, dataForm, uom) {
    let index = this.pgsize * (this.pg - 1) + indexs; //7421
    this.prForm
      .get("prdetails")
      ["controls"][index].get("uom")
      .setValue(uom.name);
  }

  //BUG ID:7420 CCBS BULK UPLOAD
  // onFileSelectedCCBS(e) {
  //   for (var i = 0; i < e.target.files.length; i++) {
  //     this.filesCCBS.value.file_upload.push(e.target.files[i])
  //     let CCBSfile = this.filesCCBS.value.file_upload
  //     console.log("CCBSfile", CCBSfile)
  //       }

  // }
  UPloadCCBSfile: any;
  //Choose File
  onFileSelectedCCBS(e) {
    let CCBSFilevalue = e.target.files[0];
    this.UPloadCCBSfile = CCBSFilevalue;
    console.log("this.UPloadCCBSfile==>", this.UPloadCCBSfile);
  }

  //for CCBS Template Excel Download////

  CCBSExceldownld() {
    this.SpinnerService.show();
    this.prposervice.DownloadCCBSTemExcel().subscribe(
      (results) => {
        this.SpinnerService.hide();

        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "CCBS Template.xlsx";
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  //CCBS bulk upload Patching///

  ccbsBulkpatch(data, index) {
    console.log("data after===>", data);
    let arr = new FormArray([]);

    for (let ccbs of data) {
      // let branch_id: FormControl = new FormControl('');
      // let bs: FormControl = new FormControl('');
      // let cc: FormControl = new FormControl('');
      // let qty: FormControl = new FormControl('');
      // let code: FormControl = new FormControl('');
      // branch_id.setValue();
      // bs.setValue(ccbs.bs);
      // cc.setValue(ccbs.cc);
      // qty.setValue(ccbs.qty);ccbs.branch_id
      // code.setValue(ccbs.code);
      (<FormArray>(
        (<FormGroup>(
          (<FormArray>this.prForm.controls["prdetails"]).controls[index]
        )).controls["prccbs"]
      )).push(
        this.fb.group({
          branch_id: ccbs.branch_id,
          bs: ccbs.bs,
          cc: ccbs.cc,
          qty: ccbs.qty,
          id: ccbs.id,
        })
      );

      // this.prForm.get('prdetails')['controls'][index].get('prccbs').push({
      //   branch_id: branch_id.value,
      //   bs: bs.value,
      //   cc: cc.value,
      //   qty: qty.value,
      // })

      // this.prForm.value.prdetails[index].prccbs.push({

      //   branch_id: branch_id.value,
      //   bs: bs.value,
      //   cc: cc.value,
      //   qty: qty.value,
      // })

      //  this.prForm.value.prdetails[index].prccbs.patchValue({

      //     branch_id: branch_id.value,
      //     bs: bs.value,
      //     cc: cc.value,
      //     qty: qty.value,
      //   }
      //   )
    }
  }
  ///

  //for CCBS bulkupload after choose file////

  UploadCCBSfileclk() {
    this.SpinnerService.show();
    let FilesRequiredData = this.prForm.value;

    if (
      this.UPloadCCBSfile == "" ||
      this.UPloadCCBSfile == null ||
      this.UPloadCCBSfile == undefined
    ) {
      this.SpinnerService.hide();
      this.notification.showWarning("Please select file for bulk upload");
      return false;
    }
    let prdetailsvalue = this.prForm.value.prdetails;
    let ccbsvalue = prdetailsvalue[this.CCBSindex].prccbs;
    console.log("ccbsvalue==>", ccbsvalue.length);

    let prdetailquantityvalue = this.prForm
      .get("prdetails")
      ["controls"][this.CCBSindex].get("qty").value;
    console.log("prdetailquantityvalue==>", prdetailquantityvalue);

    let prdetailbulkquantityvalue =
      this.RequiredQtyForThisccbs - this.totalccbs; //7422

    let obj = {
      //  prdetail_quantity:prdetailquantityvalue
      prdetail_quantity: prdetailbulkquantityvalue, //7422
    };

    this.SpinnerService.show();
    this.prposervice.BulkUploadPRCCBS(this.UPloadCCBSfile, obj).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let datas = results;
        // this.isccbsbulkupload = results.ccbs_key;
        console.log("data.code==>", results.code);
        console.log("results.description==>", results.description);
        this.ccbsblkfile = results.ccbs_bfile_id; //7420
        this.prForm
          .get("prdetails")
          ["controls"][this.CCBSindex].get("ccbs_bfile_id")
          .setValue(results.ccbs_bfile_id);
        //7420(
        //   if(results.ccbs_bfile_id != -1){
        // this.prForm.patchValue({
        //   isccbsbulk:true
        // })
        //   }

        if (results.code == "PR Quantity MisMatched with CCBS Quantity") {
          this.SpinnerService.hide();
          this.notification.showError(results.description);
          return false;
        }

        if (results.code == "INVALID_FILETYPE") {
          this.SpinnerService.hide();
          this.notification.showError(results.description);
          return false;
        }

        if (results.code == "Kindly Change Sheet Name as Template") {
          this.SpinnerService.hide();
          this.notification.showError(results.description);
          return false;
        }
        if (results.code == "Kindly Change Header Name") {
          this.SpinnerService.hide();
          this.notification.showError(results.description);
          return false;
        }

        if (results.code == "Success Uploaded") {
          this.SpinnerService.hide();
          this.notification.showSuccess(results.description);
          this.popupcontainerbox.nativeElement.click();

          if (results) {
            this.ccbsBulkpatch(results["ccbs"], this.CCBSindex);

            console.log("results to patch", results);
            this.SpinnerService.hide();
          }
        }

        if (results.code == "INVALID_DATA") {
          var answer = window.confirm(
            results.description + "Click OK to Download"
          );
          this.fileid = results.ccbs_bfile_id;
          if (answer) {
            this.DownloadCCBSfileclk(this.fileid);
          } else {
            return false;
          }
        }
        // if(results.ccbs_key=="BULK"){
        //   this.isccbsbulkupload =true;
        //  this.data={
        // //  fileid :  this.fileid,
        //  isccbsbulkupload:this.isccbsbulkupload
        // }

        // console.log('this.data==>',this.data)
        // this.prposhareService.pr.next(this.data)      //7420
        // this.prForm.get('prdetails')['controls'][this.CCBSindex].get('ccbs_key').setValue(results.ccbs_key)
        // console.log('this.ccbskey==>',this.ccbskey)

        // }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  //CCBS ERROR FILE DOWNLOAD////

  DownloadCCBSfileclk(filekey) {
    this.SpinnerService.show();
    this.prposervice.DownloadCCBSErrorExcel(filekey).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "CCBS Error Excel.xlsx";
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  blkuploadclk() {
    let FilesRequiredData = this.prForm.value;

    let prdetailsvalue = this.prForm.value.prdetails;
    let ccbsvalue = prdetailsvalue[this.CCBSindex].prccbs;
    console.log("ccbsvalue==>", ccbsvalue.length);
    if (ccbsvalue.length > 0) {
      this.blkuploadclkbtn = false;
      this.SpinnerService.hide();
      this.notification.showWarning(
        "Bulk Upload not allowed once filled details below "
      );
      return false;
    } else {
      this.blkuploadclkbtn = true;
    }
  }

  //BUG ID:7475
  assetValidation(event) {
    let prformValue = this.prForm.value.prdetails;
    if (prformValue.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      this.notification.showWarning(
        "This action is not allowed Please delete Product if you want to change in Details below"
      );
      return false;
    }
    if (prformValue.length == 0) {
      this.prForm.controls["productCategory"].reset("");
      this.prForm.controls["productType"].reset("");
      this.prForm.controls["product"].reset("");
      this.prForm.controls["items"].reset("");
      this.prForm.controls["models"].reset("");
      this.prForm.controls["specs"].reset("");
      this.prForm.controls["productnoncatlog"].reset("");
      this.prForm.controls["itemnoncatlog"].reset("");
      this.prForm.controls["commodity"].reset("");
      this.prForm.controls["supplier"].reset("");
      // this.prForm.controls["branch_id"].reset("");
      this.prForm.controls["unitprice"].reset("");
    }
  }

  //7421
  Downloadoverallblkfileclk(hederrfile) {
    this.SpinnerService.show();
    this.prposervice.DownloadheaderErrorExcel(hederrfile).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "NonCatalogue Error Excel.xlsx";
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  //for ccbs pagination
  ccbspagination(index) {
    let dat = this.pageSize * (this.p - 1) + index;
    return dat;
  }

  //PR EDIT CCBS
  preditccbs(pagenumber, indexs, dataPrDetails) {
    // preditccbs(pagenumber,index,dataPrDetails){
    let index = this.pgsize * (this.pg - 1) + indexs; //7421
    this.presentno = 1;
    console.log("dataPrDetails==>", dataPrDetails);
    this.SpinnerService.show();
    // let id=this.prForm.get('prdetails')['controls'][index].get('predit')
    this.dataPrDetails = dataPrDetails;
    this.dataPrDetailsid = dataPrDetails.value.id;
    this.index = index;
    let id = this.dataPrDetailsid;
    console.log("preditid===>", id);
    this.prposervice.getdeliverydetailspatch(id, pagenumber).subscribe(
      (results) => {
        let datas = results;
        this.SpinnerService.hide();
        let data = results["data"];
        let datapagination = results.pagination;
        // console.log(datapagination)
        // console.log(results.prdetails.pagination)
        if (data.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
        this.presentno = this.presentno + 1;
        this.ccbsBulkpatchedit(data, index, this.presentpage);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  ccbsBulkpatchedit(data, index, presentpage) {
    console.log("data after===>", data);
    let arr = new FormArray([]);

    for (let ccbs of data) {
      (<FormArray>(
        (<FormGroup>(
          (<FormArray>this.prForm.controls["prdetails"]).controls[index]
        )).controls["prccbs"]
      )).push(
        this.fb.group({
          branch_id: ccbs.branch_id,
          bs: ccbs.bs,
          cc: ccbs.cc,
          qty: ccbs.qty,
          id: ccbs.id,
        })
      );
    }
    // if(presentpage==1){
    this.ccbsqty = this.prForm.value.prdetails[index].prccbs.map((x) => x.qty);
    console.log("data check qty", this.ccbsqty);
    this.totalccbs = this.ccbsqty.reduce((a, b) => a + b, 0);
    console.log("sum of totals ccbs ", this.totalccbs);
    // }
  }
  ccbsnextClick() {
    if (this.has_next === true) {
      this.preditccbs(this.presentpage + 1, this.index, this.dataPrDetails);
    }
  }

  // ccbspreviousClick() {
  //   if (this.has_previous === true) {
  //     this.preditccbs(this.presentpage - 1,this.index,this.dataPrDetails)
  //   }
  // }
  bulkpagination(index) {
    let dat1 = this.pgsize * (this.pg - 1) + index;
    return dat1;
  }

  loadFormdata(data) {
    console.log("datadata", data);

    let catlogOrNonCatlogtype = data.type.id;
    let pr_draft_type = data.pr_draft_type;
    if (pr_draft_type == 2) {
      this.batchpr = true;
      this.independentpr = false;
      this.selectedToggle = "batchpr";
    } else {
      this.batchpr = false;
      this.independentpr = true;
      this.selectedToggle = "independentpr";
    }
    if (catlogOrNonCatlogtype == 1) {
      this.ForCatlog = true;
      this.itemNonCalog = false;
      this.itemcalog = true;

      this.radiochoice = true;
      this.modelcatlog = true;
      this.configcatlog = true;
    }
    if (catlogOrNonCatlogtype == 2) {
      this.ForCatlog = false;
      this.itemNonCalog = true;
      this.itemcalog = false;
      this.isSupplier = false;
      this.isProduct = true;
      this.radiochoice = false;
      this.modelcatlog = false;
      this.configcatlog = false;
    }
    // this.prForm.get("employee_id").setValue(data?.employee);
    data.prdetails.forEach((prdet, i) => {
      // for (let prdet of data.prdetails) {
      let amount: FormControl = new FormControl("");
      let capitialized: FormControl = new FormControl("");
      // let pr_request: FormControl = new FormControl('');
      let hsn: FormControl = new FormControl("");
      let hsnrate: FormControl = new FormControl(0);
      let images: FormControl = new FormControl("");
      let remarks: FormControl = new FormControl("");
      let installationrequired: FormControl = new FormControl("");
      let item: FormControl = new FormControl("");
      let item_name: FormControl = new FormControl("");
      let product_id: FormControl = new FormControl("");
      let product_name: FormControl = new FormControl("");
      let catalog_id: FormControl = new FormControl("");
      let qty: FormControl = new FormControl("");
      let supplier_id: FormControl = new FormControl("");
      let unitprice: FormControl = new FormControl("");
      let uom: FormControl = new FormControl("");
      let is_asset: FormControl = new FormControl("");
      let prod_display: FormControl = new FormControl("");
      let product_type: FormControl = new FormControl("");
      //duplicate form control
      let suppliername: FormControl = new FormControl("");
      let commodityname: FormControl = new FormControl("");
      let itemname: FormControl = new FormControl("");
      let modelname: FormControl = new FormControl("");
      let model_name: FormControl = new FormControl("");
      let model_id: FormControl = new FormControl("");
      let make_name: FormControl = new FormControl("");
      let make_id: FormControl = new FormControl("");
      let specification: FormControl = new FormControl("");
      let productname: FormControl = new FormControl("");
      let branch: FormControl = new FormControl("");
      let editable: FormControl = new FormControl("");
      let idControl: FormControl = new FormControl("");
      let related_component_name: FormControl = new FormControl("");
      let related_component_id: FormControl = new FormControl("");
      let quotation_no: FormControl = new FormControl("");
      let quotationid: FormControl = new FormControl("");
      let quot_detailsid: FormControl = new FormControl("");
      let items: FormControl = new FormControl("");
      let models: FormControl = new FormControl("");
      let prod: FormControl = new FormControl("");
      //BUG ID:7422
      let ccbs_bfile_id: FormControl = new FormControl("");
      let pr_for: FormControl = new FormControl({ value: "", disabled: false });
      let is_save: FormControl = new FormControl({
        value: false,
        disabled: false,
      });
      let branch_id: FormControl = new FormControl("");
      let pr_request: FormGroup = new FormGroup({
        pr_request: this.fb.control(""),
        asset: this.fb.array([]),
      });
      let asset_id: FormControl = new FormControl({
        value: "",
        disabled: false,
      });
      const prdetFormArray = this.prForm.get("prdetails") as FormArray;
      idControl.setValue(prdet.id);
      console.log("dataaaasss", data);
      console.log("prdet", prdet);
      // if (data.type.id == 1) {
      productname.setValue(prdet.product_id.name);
      product_id.setValue(prdet.product_id.id);
      prod.setValue(prdet.product_id);
      product_name.setValue(prdet.product_id.name);
      product_type.setValue(prdet.product_type?.id);
      prod_display.setValue(prdet.product_type?.name);
      related_component_name.setValue(prdet.related_component_name || "");
      related_component_id.setValue(prdet.related_component_id || 0);
      quotation_no.setValue(
        prdet?.quotation?.supplier_quot || this.quotationnumbernew || "--"
      );
      quotationid.setValue(
        prdet?.quotation?.quotationid || this.quotationidnew || 0
      );
      quot_detailsid.setValue(
        prdet?.quotation?.quot_detailsid || this.quotationdetailidnew || 0
      );
      // model_name.setValue(prdet.model_name)
      // model_id.setValue(prdet.model_id)
      catalog_id.setValue(prdet?.item || 0);

      // }
      // else if (data.type.id == 2) {
      // productname.setValue(prdet.product_name)
      // product_name.setValue(prdet.product_name)
      // product_id.setValue("")
      //   productname.setValue(prdet.product_name)
      //   product_id.setValue(prdet.product_id.id)
      //   product_name.setValue("")
      // }
      if (data.type.id == 1) {
        itemname.setValue(prdet.item_name);
        // item.setValue(prdet.item)
        // item_name.setValue(prdet.item_name)
        item_name.setValue(prdet.item_name);
        model_name.setValue(prdet.model_name);
        modelname.setValue(prdet.model_name);
        model_id.setValue(prdet.model_id);
        specification.setValue(prdet.specification);
      }
      if (data.type.id == 2) {
        itemname.setValue(prdet.item_name);
        make_name.setValue(prdet.make_name);
        make_id.setValue(prdet.make_id);
        model_name.setValue("");
        modelname.setValue("");
        model_id.setValue(0);
        specification.setValue("");

        // item_name.setValue(prdet.item_name)
        // item.setValue("")
      }

      this.prForm.patchValue({
        supplier_id: prdet.supplier_id.id,
        supplier: prdet.supplier_id,
      });
      supplier_id.setValue(prdet.supplier_id.id);
      suppliername.setValue(prdet.supplier_id.name);
      commodityname.setValue(data.commodity_id.name);
      editable.setValue(false);
      hsn.setValue(0);
      hsnrate.setValue(0);
      images.setValue(prdet.images);
      uom.setValue(prdet.uom);
      branch.setValue(data.branch_id.name);
      amount.setValue(prdet.amount);
      qty.setValue(prdet.qty);
      unitprice.setValue(prdet.unitprice);
      amount.setValue(prdet.qty * prdet.unitprice);
      remarks.setValue(prdet.remarks);
      installationrequired.setValue(prdet.installationrequired);
      capitialized.setValue(prdet.capitialized);
      // pr_request.setValue(prdet.pr_request);
      ccbs_bfile_id.setValue(prdet.ccbs_bfile_id);
      pr_for.setValue(prdet?.pr_request?.pr_request.toString());
      // setTimeout(() => {

      // }, 1000);
      let isassert = null;
      if (prdet.is_assert == "Y") {
        isassert = 1;
      } else {
        isassert = 0;
      }
      is_asset.setValue(isassert);
      prdetFormArray.push(
        new FormGroup({
          branch_id: branch_id,
          prod: prod,
          product_id: product_id,
          supplier_id: supplier_id,
          qty: qty,
          unitprice: unitprice,
          installationrequired: installationrequired,
          remarks: remarks,
          capitialized: capitialized,
          related_component_name: related_component_name,
          related_component_id: related_component_id,
          quotation_no: quotation_no,
          quotationid: quotationid,
          quot_detailsid: quot_detailsid,
          catalog_id: catalog_id,
          // pr_request: pr_request,
          amount: amount,
          hsn: hsn,
          hsnrate: hsnrate,
          images: images,
          item: item,
          item_name: item_name,
          product_name: product_name,
          product_type: product_type,
          prod_display: prod_display,
          uom: uom,
          is_asset: is_asset,
          editable: editable,
          //duplicate form control
          suppliername: suppliername,
          commodityname: commodityname,
          itemname: itemname,
          modelname: modelname,
          specification: specification,
          model_id: model_id,
          model_name: model_name,
          make_id: make_id,
          make_name: make_name,
          productname: productname,
          branch: branch,
          id: idControl,
          ccbs_bfile_id: ccbs_bfile_id, //7422
          pr_for: pr_for,
          prccbs: this.setccbs(prdet.prccbs, 1),
          pr_request: this.fb.group({
            pr_request: [prdet?.pr_request?.pr_request || ""],
            asset: this.getasset(prdet?.pr_request?.asset || []),
          }),
          is_save: is_save,
          asset_id: asset_id,
        })
      );
      const prdetails = this.prForm.get("prdetails") as FormArray;
      const pr_requestt = prdetails.at(i).get("pr_request") as FormGroup;
      const assetArray = pr_requestt.get("asset") as FormArray;
      if (assetArray.length != 0) {
        prdetails.at(i).get("is_save").setValue(true);
      }
      this.initializeAssets(i);
      this.calcTotalpatch(unitprice, qty, amount);
      unitprice.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
        console.log("should be called first");
        this.calcTotalpatch(unitprice, qty, amount);
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value["prdetails"]);
      });

      qty.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
        console.log("should be called first");
        this.calcTotalpatch(unitprice, qty, amount);
        if (!this.prForm.valid) {
          return;
        }
        this.linesChange.emit(this.prForm.value["prdetails"]);
      });
    });
    console.log("this.prform.vale==>", this.prForm.value);
  }
  getassetData(assetData: any): FormArray {
    if (!Array.isArray(assetData)) {
      console.warn(
        "assetData is not an array, defaulting to empty array",
        assetData
      );
      assetData = [];
    }
    const assetArray = this.fb.array([]);
    assetData.forEach((asset) => {
      assetArray.push(
        this.fb.group({
          asset_id: [asset.asset_id || ""],
          serial_no: [asset.serial_no || ""],
          product_name: [asset.product_name || ""],
          item_name: [asset.item_name || ""],
          model_name: [asset.model_name || ""],
          specification: [asset.specification || ""],
          id: [asset.id || ""],
          status: [1],
        })
      );
    });
    return assetArray;
  }
  getasset(assetData: any): FormArray {
    if (!Array.isArray(assetData)) {
      console.warn(
        "assetData is not an array, defaulting to empty array",
        assetData
      );
      assetData = [];
    }
    const assetArray = this.fb.array([]);
    assetData.forEach((asset) => {
      assetArray.push(
        this.fb.group({
          asset_id: [asset.asset_id || ""],
          serial_no: [asset.serial_no || ""],
          product_name: [asset.product_name || ""],
          item_name: [asset.item_name || ""],
          model_name: [asset.model_name || ""],
          specification: [asset.specification || ""],
          status: [1],
        })
      );
    });
    return assetArray;
  }
  //BUG ID:7422
  //FOR NOncatalogue file download
  DraftNOnctlgExceldownld() {
    this.SpinnerService.show();
    this.prposervice
      .DraftNOnctlgExceldownld(this.drafreditid, this.draftnoncatfileid)
      .subscribe(
        (results) => {
          this.SpinnerService.hide();
          let binaryData = [];
          binaryData.push(results);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "NonCatalogue Draft Excel.xlsx";
          link.click();
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }
  //FOR CCBS DRAFT BULK UPLOAD DOWNLOAD
  DraftctlgExceldownld() {
    this.SpinnerService.show();
    this.prposervice
      .DraftctlgExceldownld(this.drafreditid, this.ccbsdraftfileid)
      .subscribe(
        (results) => {
          this.SpinnerService.hide();
          let binaryData = [];
          binaryData.push(results);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "CCBS Draft Excel.xlsx";
          link.click();
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  patchunitprice(data) {
    this.configuration = data.configuration_check;
    if (!this.configuration) {
      this.quotationnumbernew = data.quotation_no;
      if(this.quotationnumbernew != 0 || this.quotationnumbernew == ""){
       this.quotationget()
      console.log("quotation",this.quotationnumbernew)
      }

      console.log("quotation", this.quotationnumbernew);
    }
    this.catlogpayloadid = data?.id;
    if (this.configuration == false) {
      this.prForm.patchValue({
        unitprice: data.unitprice,
        uom: data.uom,
        // itemsid: data[0]?.id,
        // uom: data[0]?.uom.name
      });
    }
    this.showCard = this.configuration == true ? true : false;
    if (this.showCard) {
      this.getspecs();
    }
  }

  getUnitPrice(data) {
    if (this.quotationnumbernew != 0 || this.quotationnumbernew == "") {
      this.quotationnumbernew = data.quotation_no;
      if(this.quotationnumbernew != 0 || this.quotationnumbernew == ""){
       this.quotationget()
      console.log("quotation",this.quotationnumbernew)
      }
    }
    // if (this.configuration == true) {
    this.prForm.patchValue({
      unitprice: data.unitprice,
      uom: data.uom,
    });
    // this.config = true;
    // }
  }
  Quotation: boolean = false;
  batchPR: boolean = false;
  // selectedReportType: number = 0;
  selectreporttype(e: number) {
    this.selectedReportType = e;

    this.PRMaker = e === 0;
    this.batchPR = e === 1;
    this.BPRMaker = e === 2;
    this.Quotation = e === 3;

    if (this.PRMaker) {
      this.selectedToggle = "independentpr";
      this.independentpr = true;
      this.batchpr = false;
      this.prForm.reset();
      this.ngOnInit();
    }
  }
  // selectedReportType = 0;

  reportLabels: string[] = [
    "Purchase Request Maker (Independent)",
    "Purchase Request Maker (Batch)",
    "Purchase Request Maker (Branches)",
    "Quotation",
  ];

  // selectreporttype(index: number) {
  //   this.selectedReportType = index;
  //   // You can add more logic here if needed
  // }

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
        this.SpinnerService.hide();
        if (this.quotaionList.length == 0) {
          this.notification.showInfo("No Records Found!");
          this.SpinnerService.hide();
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
        this.SpinnerService.hide();
        if (this.quotaionList.length == 0) {
          this.notification.showInfo("No Records Found!");
          this.SpinnerService.hide();
        }
      });
  }
  quotaionList: any = [];
  resetAsset(data, popupIndex, index) {
    const prdetails = this.prForm.get("prdetails") as FormArray;
    // const pr_request = prdetails.at(popupIndex).get('pr_request') as FormGroup;
    // const assetArray = pr_request.get('asset') as FormArray;
    // if(assetArray.length != 0){
    //   pr_request.get('asset').enable();
    //   pr_request.get('pr_request').setValue(2);
    // }
    prdetails.at(popupIndex).get("asset_id").setValue("");
    this.initializeAssets(popupIndex);
  }
  assetIndex: any;
  assetData: any;
  toUpperCase(event, index) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    // this.assetForm.get("asset_id")?.setValue(input.value);
    this.assetIndex = index;
    // this.assetData = data
  }
  getSpecificationKeys(specification: any): string[] {
    console.log("objjjjjjjjj", Object.keys(specification));
    return specification ? Object.keys(specification) : [];
  }
  specification: any = [];
  isadd: boolean;

  addAssett() {
    let asset_value = this.prForm.get("asset_id").value.assetid;
    let pid = this.prForm.get("product_for").value.id;
    if (asset_value == "" || asset_value == null || asset_value == undefined) {
      this.notification.showInfo("Select an Asset ID to Add!");
      return;
    }
    this.SpinnerService.show();
    this.prposervice.get_Asset(asset_value, this.branchid, pid, 1).subscribe(
      (res) => {
        if (res["data"]) {
          // for (let element of this.assetArray) {
          //   if (element?.asset_id == res["data"][0]?.asset_id) {
          //     this.notification.showInfo("Asset ID Already Exists");
          //     // this.assetForm.reset();
          //      this.assetForm.get('asset_id').reset();

          //     this.SpinnerService.hide();
          //     return;
          //   }
          // }
          this.assetArrayy.push(res["data"][0]);
          // let podetail_id = res.podetail_id
          // let asset_id = res.asset_id
          // let dict = {
          //   podetail_id : res.podetail_id,
          //   asset_id : res.asset_id
          // }
          // this.assetDict.push(dict)

          this.SpinnerService.hide();
        } else if (res["code"] == "Asset ID Already Exists") {
          let assetArr: any = [];
          assetArr = res.description["Asset ID"];
          let assets = assetArr.map((x) => x.error);
          this.notification.showInfo(assets.join("\n"));
        } else {
          this.notification.showInfo(res.description);
          this.SpinnerService.hide();
        }
        this.isadd = true;
         this.prForm.get('product_for').reset()
    this.prForm.get('prod_type_asset').reset()
        this.prForm.get("asset_id").reset();
      },
      (error) => {
        this.SpinnerService.hide();
        this.notification.showError(error);
      }
    );
  }

  addAsset(data, index) {
    let asset_value = data?.value?.asset_id?.assetid;
    if (asset_value == "" || asset_value == null || asset_value == undefined) {
      this.notification.showInfo("Enter an Asset ID to Add!");
      return;
    }
   
      const prdetails = this.prForm.get("prdetails") as FormArray;
        const x = prdetails.at(index).get("pr_request") as FormGroup;
    const y = x.get("asset") as FormArray;
     for (const x of y.value) {
    if (x?.asset_id === asset_value) {
      this.notification.showInfo("Asset Already Chosen Against this PR");
      return;
    }
  }
  for (const x of this.new_array) {
    if (x?.asset_id === asset_value) {
      this.notification.showInfo("Asset Already Chosen Against this PR");
      return;
    }
  }

    
    let make = data?.value?.items?.name;
    let Model = data?.value?.models?.name;
    let serial_no = data?.value?.serial_no;
    let prod_id = data?.value?.prod?.id || "";
    let prdetail = this.prForm.get("prdetails") as FormArray;
    let pr_request = prdetail.at(index) as FormGroup;
    let asset = pr_request.get("pr_request") as FormGroup;
    let assetArray = asset.get("asset") as FormArray;
    let arr = [];
    this.SpinnerService.show();
    this.prposervice
      // addAssetId(asset_value)
      .get_Asset_replacement(asset_value, this.branchid, prod_id, 1, make, Model, serial_no)

      .subscribe(
        (res) => {
          const prdetails = this.prForm.get("prdetails") as FormArray;

          if (res["data"]) {
            for (let i = 0; i < prdetail.length; i++) {
              const pr_request_check = prdetail.at(i) as FormGroup;
              const asset_check = pr_request_check.get(
                "pr_request"
              ) as FormGroup;
              const assetArray_check = asset_check.get("asset") as FormArray;

              const existingAssetIndex = assetArray_check.controls.findIndex(
                (control) =>
                  control.get("asset_id")?.value === res["data"][0]?.asset_id
              );

              if (existingAssetIndex !== -1) {
                if (i === index) {
                  this.notification.showInfo("Asset ID Already Exists!");
                  prdetails.at(index).get("asset_id").setValue("");
                } else {
                  this.notification.showInfo(
                    `Asset ID Already Exists at S.No : ${i + 1}`
                  );
                  prdetails.at(index).get("asset_id").setValue("");
                }
                this.SpinnerService.hide();
                return;
              }
            }

            const assetFormGroup = this.fb.group({
              asset_id: [res["data"][0]?.assetid || ""],
              serial_no: [res["data"][0]?.serial_no || ""],
              product_name: [res["data"][0]?.product_name || ""],
              item_name: [res["data"][0]?.item_name || ""],
              model_name: [res["data"][0]?.model_name || ""],
              specification: [res["data"][0]?.specification || {}],
              status: [1],
              items: [res["data"][0]?.make || ""],
              models: [res["data"][0]?.model || ""],
            });

            // const assetExists = assetArray.controls.some((control) => control.get('asset_id')?.value === res["data"][0]?.asset_id);

            // if (assetExists) {
            //   this.notification.showInfo("Asset Id Already Exists!");
            //   prdetails.at(index).get("asset_id").setValue("");
            //   this.SpinnerService.hide();
            //   return;
            // }

            // if(res["data"][0].asset_id == )
            assetArray.push(assetFormGroup);
            // this.initializeAssets(index);

            // let arr = arr.push(res["data"][0]);
            // this.assetArray.push(res["data"][0])
            console.log("this.prForm", this.prForm);
            // this.specification.push(res['data'][0].specification)

            // let podetail_id = res.podetail_id
            // let asset_id = res.asset_id
            // let dict = {
            //   podetail_id : res.podetail_id,
            //   asset_id : res.asset_id
            // }
            // this.assetDict.push(dict)

            this.SpinnerService.hide();
          } else if (res.code == "Asset ID Already Exists") {
            this.SpinnerService.hide();
            let assetArr: any = [];
            assetArr = res.description["Asset ID"];
            // let assets = assetArr.map((x) => x.error);
            // this.notification.showInfo(assets.join("\n"));
            const message = assetArr.map(x => x.error).join('<br><br>');

            this.toastService.info(message, '', {
              enableHtml: true,
              timeOut: 5000,
            });
            prdetails.at(index).get("asset_id").setValue("");
            return;
          } else {
            this.notification.showInfo(res.description);
            this.SpinnerService.hide();
          }
          prdetails.at(index).get("asset_id").setValue("");
          // this.assetForm.reset();
        },
        (error) => {
          this.SpinnerService.hide();
          this.notification.showError(error);
        }
      );
  }

  // editKey: any;
  // del: any;
  // deleteAsset(data,popupIndex, index){
  //   this.assets$[popupIndex].forEach((e, i) => {
  //     if(i === index){
  //       this.assets$[popupIndex].splice(i,1);
  //     }
  //   })
  // }
  deleteAsset(index: number, assetIndex: number) {
    const prdetails = this.prForm.get("prdetails") as FormArray;
    const pr_request = prdetails.at(index).get("pr_request") as FormGroup;
    const assetArray = pr_request.get("asset") as FormArray;

    const id = prdetails?.at(index)?.get("id")?.value;
    const assetId = assetArray?.at(assetIndex)?.get("id")?.value;

    if (id) {
      let confirm = window.confirm("Are you sure want to Delete?");
      if (confirm) {
        assetArray.at(assetIndex).get("status").setValue(0);
      }
    } else {
      // assetArray.removeAt(assetIndex);
      // assetArray.removeAt(assetIndex);
      assetArray.removeAt(assetIndex);
    }
    this.initializeAssets(index);
  }
  initializeAssets(index: number) {
    const prdetails = this.prForm.get("prdetails") as FormArray;
    const pr_request = prdetails.at(index).get("pr_request") as FormGroup;
    const assetArray = pr_request.get("asset") as FormArray;

    this.assets$[index] = assetArray.valueChanges.pipe(
      startWith(assetArray.value)
    );
    const pr_request_val = pr_request.get("pr_request").value;
    if (pr_request_val == 1) {
      assetArray.disable();
      prdetails.at(index).get("pr_for").setValue("1");
      // prdetails.at(index).get('pr_for').setValue('1');
      // prdetails.at(index).get('asset_id').disable();
    }
    console.log("prform", this.prForm);
    console.log("prdetails", this.prdetails);
  }
  // deleteAsset(data, i) {
  //   if (this.editKey != 1) {
  //     this.assetArray.forEach((e, ind) => {
  //       if (i === ind) {
  //         this.assetArray.splice(i, 1);
  //       }
  //     });
  //   }
  //   if (this.editKey == 1 && data.id != undefined) {
  //     let con = confirm("Are you sure want to Delete?");
  //     if(con){
  //     this.assetArray.forEach((e, ind) => {
  //       if (i === ind) {
  //         this.assetArray.splice(i, 1);
  //         this.del.push(data.id);
  //       }
  //     });
  //   }
  //   else
  //     return
  //   }
  //   if(this.editKey == 1 && data.id == undefined){
  //     this.assetArray.forEach((e, ind) => {
  //       if (i === ind) {
  //         this.assetArray.splice(i, 1);
  //         // this.del.push(data.id);
  //       }
  //     });
  //  } else {
  //   return
  //  }
  // }
  popupname: any;
  popupIndex: any;
  prdetailsData: any;
  selectedIndex: any;
  getpopupName(prdetailsIndex, prdetail) {
    this.popupIndex = this.pgsize * (this.pg - 1) + prdetailsIndex; //7421
    this.popupname = "popup_" + this.popupIndex;
    this.prdetailsData = prdetail;
    this.selectedIndex = this.popupIndex;
    const prdetails = this.prForm.get("prdetails") as FormArray;
    prdetails.at(this.popupIndex).get("asset_id").enable();
    prdetails.at(this.popupIndex).get("branch_id").setValue(this.empBranchdata);
    prdetails
      .at(this.popupIndex)
      .get("prod")
      .setValue(prdetails.at(this.popupIndex).get("prod").value);
    this.initializeAssets(this.popupIndex);
  }
  previousType: string = "1";

  toggleNew(prdetailsIndex: number, prdetail: any): void {
    this.popupIndex = this.pgsize * (this.pg - 1) + prdetailsIndex;

    const prdetails = this.prForm.get("prdetails") as FormArray;
    const pr_request = prdetails
      .at(this.popupIndex)
      .get("pr_request") as FormGroup;
    const assetArray = pr_request.get("asset") as FormArray;
    const pr_forControl = prdetails.at(this.popupIndex).get("pr_for");

    const currentPrFor = pr_forControl?.value;
    this.previousType = pr_request?.value?.pr_request?.toString();
    if (currentPrFor == 1 && assetArray.length >= 1) {
      const confirmChange = confirm(
        "Switching to 'New' will Remove Replacement Assets. Proceed?"
      );
      if (!confirmChange) {
        pr_forControl.setValue(this.previousType, { emitEvent: false });
        return;
      } else {
        assetArray.clear();
        assetArray.disable();
        pr_request.get("pr_request").setValue(1);
      }
    }

    this.previousType = currentPrFor;
  }

  assetpagination(index) {
    let ind = this.pageSize * (this.p - 1) + index;
    return ind;
  }
  saveAsset(popupIndex) {
    const prdetails = this.prForm.get("prdetails") as FormArray;
    const pr_request = prdetails.at(popupIndex).get("pr_request") as FormGroup;
    const assetArray = pr_request.get("asset") as FormArray;

    if (assetArray.length == 0) {
      this.notification.showWarning("Add Asset Details to Save!");
    } else {
      pr_request.get("asset").enable();
      pr_request.get("pr_request").setValue(2);
      prdetails.at(popupIndex).get("pr_for").setValue("2");
      prdetails.at(popupIndex).get("asset_id").disable();
      prdetails.at(popupIndex).get("is_save").setValue(true);
      const modalTrigger = document.getElementById("assetmodal");
      modalTrigger?.click();
      
        const x = prdetails.at(popupIndex).get("pr_request") as FormGroup;
    const y = x.get("asset") as FormArray;
    for(let xx of y.value){
 this.new_array.push(xx)
    }
      // pr_request.get('pr_request').setValue(1);
      // pr_request.get('asset').disable();
      // prdetails.at(popupIndex).get('pr_for').setValue('1');
    }

    this.initializeAssets(popupIndex);
  }
  closeasset(popupIndex) {
    const prdetails = this.prForm.get("prdetails") as FormArray;
    const pr_request = prdetails.at(popupIndex).get("pr_request") as FormGroup;
    const assetArray = pr_request.get("asset") as FormArray;

    const id = prdetails.at(popupIndex).get("id")?.value;

    let is_save = prdetails.at(popupIndex).get("is_save")?.value;
    if (!id) {
      if (assetArray.length != 0) {
        pr_request.get("asset").enable();
        pr_request.get("pr_request").setValue(2);
        prdetails.at(popupIndex).get("pr_for").setValue("2");
      } else {
        pr_request.get("pr_request").setValue(1);
        prdetails.at(popupIndex).get("pr_for").setValue("1");
      }
    }
    if (!is_save) {
      assetArray.clear();
      pr_request.get("asset").disable();
      pr_request.get("pr_request").setValue(1);
    }
    prdetails.at(popupIndex).get("asset_id").setValue("");
    prdetails.at(popupIndex).get("asset_id").disable();
    this.initializeAssets(popupIndex);
  }
  patchUnitPrice() {
    this.SpinnerService.show();
    let commodity = this.prForm.value?.commodity?.id;
    let supplier = this.prForm.value?.supplier?.id;
    let product = this.prForm.value?.product?.id;
    let dts = this.prForm.get("dts")?.value;

    let type = this.prForm.value?.type;

    this.SpinnerService.show();
    this.prposervice
      .getServiceUnitPrice(product, supplier, dts, this.product_type, 1)
      .subscribe(
        (results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"][0];
          this.prForm.get("unitprice").setValue(datas.unitprice);
          this.prForm.get("service_des").setValue(datas.specification);
          this.prForm.get("uom").setValue(datas.uom);

          // this.supplierList = datas;
          console.log("unit_prices_data", datas);
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }
  @ViewChild("closebtnbulk") closebtnbulk: ElementRef;

  cancelUpload(fileInput: HTMLInputElement): void {
    // Logic for canceling upload
    this.removeFiles();
    this.closebtnbulk.nativeElement.click();
    fileInput.value = "";
  }
  removeFiles(): void {
    this.droppedFiles = [];
    this.uploadProgress = 0;
  }
  prod_id: any;
  getproduct_Asset() {
    // if (!this.assetForm.get("branch_id").value) {
    //   // this.commoditty = this.brForm?.get("commodity")?.value?.id;
    //   this.notification.showInfo("Please Select Request For");
    //   return;
    // }
    this.prposervice
      .getproduct_Asset("", this.branchid, 1)
      .subscribe((results: any) => {
        let datas = results["data"];
        this.productList = datas;
        this.SpinnerService.hide();
        if (this.productList.length == 0) {
          this.notification.showInfo("No Product Specified!");
          this.SpinnerService.hide();
        }
      });
  }
  getbrproduct() {
    this.getproduct_Asset();
    this.assetForm
      .get("prod")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getproduct_Asset(value, this.branchid, 1).pipe(
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
  getAsset(data, index, id) {
    if (id == 2) {
      if (!this.prForm.get("branch_id").value) {
        this.notification.showInfo("Please Select Request For");
        return;
      }
      // if (!this.prForm.get("product_name").value) {
      //   this.notification.showInfo("Please Select Product Name");
      //   return;
      // }

      let make = data?.value?.items?.name;
      let Model = data?.value?.models?.name;
      let serial_no = data?.value?.serial_no;

      let prod = data?.value?.prod?.id || "";
      this.prposervice
        .get_Asset(
          this.assetInput.nativeElement.value,
          this.branchid,
          prod,
          1,
          make,
          Model,
          serial_no
        )
        .subscribe((results: any) => {
          if (results["code"]) {
            this.notification.showInfo(results["description"]);
            this.assetList = [];
            return;
          }

          let datas = results["data"];
          this.assetList = datas;
          this.SpinnerService.hide();
          if (this.assetList.length == 0) {
            this.notification.showInfo("No Asset Specified!");
            this.assetList = [];
            this.SpinnerService.hide();
          }
        });
    }

    let branchFormData = this.prForm.value;
    let pid = branchFormData?.product_for?.id;
    if (id == 1) {
      if (!this.prForm.get("product_for").value) {
        this.notification.showInfo("Please Select Request Product For");
        return;
      }
      this.prposervice
        .get_Asset(this.assetInputt.nativeElement.value, this.branchid, pid, 1)
        .subscribe((results) => {
          let datas = results["data"];
          this.assetList = datas;
          this.SpinnerService.hide();
          if (results?.code) {
            this.notification.showInfo(results["description"]);
            this.SpinnerService.hide();
          }
          if (this.assetList.length == 0) {
            this.notification.showInfo("No Asset Specified!");
            this.SpinnerService.hide();
          }
        });
    }
  }
   getAsset_replacement(data, index, id) {
    if (id == 2) {
      if (!this.prForm.get("branch_id").value) {
        this.notification.showInfo("Please Select Request For");
        return;
      }
      // if (!this.prForm.get("product_name").value) {
      //   this.notification.showInfo("Please Select Product Name");
      //   return;
      // }

      let make = data?.value?.items?.name;
      let Model = data?.value?.models?.name;
      let serial_no = data?.value?.serial_no;

      let prod = data?.value?.prod?.id || "";
      this.prposervice
        .get_Asset_replacement(
          this.assetInput.nativeElement.value,
          this.branchid,
          prod,
          1,
          make,
          Model,
          serial_no
        )
        .subscribe((results: any) => {
          if (results["code"]) {
            this.notification.showInfo(results["description"]);
            this.assetList = [];
            return;
          }

          let datas = results["data"];
          this.assetList = datas;
          this.SpinnerService.hide();
          if (this.assetList.length == 0) {
            this.notification.showInfo("No Asset Specified!");
            this.assetList = [];
            this.SpinnerService.hide();
          }
        });
    }

    let branchFormData = this.prForm.value;
    let pid = branchFormData?.product_for?.id;
    if (id == 1) {
      if (!this.prForm.get("product_for").value) {
        this.notification.showInfo("Please Select Request Product For");
        return;
      }
      this.prposervice
        .get_Asset(this.assetInputt.nativeElement.value, this.branchid, pid, 1)
        .subscribe((results) => {
          let datas = results["data"];
          this.assetList = datas;
          this.SpinnerService.hide();
          if (results?.code) {
            this.notification.showInfo(results["description"]);
            this.SpinnerService.hide();
          }
          if (this.assetList.length == 0) {
            this.notification.showInfo("No Asset Specified!");
            this.SpinnerService.hide();
          }
        });
    }
  }
  getAssetId() {
    this.getAsset("", "", 1);
    this.prForm
      .get("asset_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice
            .get_Asset(value, this.branchid, this.prod_id, 1)
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
          this.assetList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  @ViewChild("assetDD") assetDD: MatAutocomplete;
  @ViewChild("assetInput") assetInput: any;
  @ViewChild("assetDDd") assetDDd: MatAutocomplete;
  @ViewChild("assetInputt") assetInputt: any;

  public displayFnAsset(item): string | undefined {
    return item ? item.assetid : undefined;
  }
  public displayFnReq(item): string | undefined {
    return item ? item.name : undefined;
  }
  has_next_asset = true;
  has_previous_asset = true;
  current_ass = 1;
  asset_id: any;
  assetList: any = [];
  autocompleteAssetScroll() {
    setTimeout(() => {
      if (this.assetDD && this.autocompleteTrigger && this.assetDD.panel) {
        fromEvent(this.assetDD.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.assetDD.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop = this.assetDD.panel.nativeElement.scrollTop;
            const scrollHeight = this.assetDD.panel.nativeElement.scrollHeight;
            const elementHeight = this.assetDD.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next_asset === true) {
                this.prposervice
                  .get_Asset_replacement(
                    this.assetInput.nativeElement.value,
                    this.branchid,
                    this.prod_id,
                    this.current_ass + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.assetList = this.assetList.concat(datas);
                      if (this.assetList.length >= 0) {
                        this.has_next_asset = datapagination.has_next;
                        this.has_previous_asset = datapagination.has_previous;
                        this.current_ass = datapagination.index;
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
  isProductChoosen: boolean = true;
  attrList: any = [];
  product_code: any;
  specList: any = [];
  showCard: boolean = false;
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
  getReq(): void {
    let typeId = 0;
    if (
      this.product_type1 == "" ||
      this.product_type1 == null ||
      this.product_type1 == undefined
    ) {
      this.notification.showInfo("Select Product Type!");
      return;
    }

    switch (this.product_type_name) {
      case "Service":
        typeId = 2;
        break;
      case "Component":
        typeId = 1;
        break;
      case "Software":
        typeId = 3;
        break;
    }

    if (this.product_type1) {
      this.prposervice.getprodname( this.product_type1,1, "").subscribe((res) => {
        this.specsList = res["data"];
      });
    }

    this.prForm
      .get("product_for")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getprodname(this.product_type1,1 , value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.specsList = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  getOtherAttributes(product) {
    this.product_code = product?.code;

    this.prposervice.getOtherAttributes(product?.code, 1).subscribe((res) => {
      // this.attrList = res;
      // this.itemList = res?.make;
      // this.modelList = res?.model;
      this.showCard = true;
      this.specList = res["data"];
      // this.configList = res?.specification?.configuration;
    });
  }
  onToggleChange(event) {
    const newToggle = event?.value;

    if (newToggle === "independentpr") {
      this.selectedToggle = "independentpr";
      this.independentpr = true;
      this.batchpr = false;
      this.previousToggle = "independentpr";
      this.ngOnInit();
    }

    if (newToggle === "batchpr") {
      const mepnoValue = this.prForm.get("mepno")?.value;

      if (mepnoValue) {
        const userConfirmed = window.confirm(
          "Switching to Batch PR will remove PCA Details?"
        );
        if (userConfirmed) {
          this.selectedToggle = "batchpr";
          this.independentpr = false;
          this.batchpr = true;
          this.previousToggle = "batchpr";
          this.ngOnInit();
        } else {
          setTimeout(() => {
            this.selectedToggle = this.previousToggle;
          }, 0);
        }
      } else {
        this.selectedToggle = "batchpr";
        this.independentpr = false;
        this.batchpr = true;
        this.previousToggle = "batchpr";
        this.ngOnInit();
      }
    }
  }

  previousToggle: string = "independentpr";

  getpcapopup() {
    //     this.commodityid = dict?.id
    // this.techRealted = dict?.name?.toLowerCase() === "technology related-equipment".toLowerCase()
    //   ? dict?.name.toLowerCase()
    //   : "";

    let pca = this.prForm.value.mepno;

    if (pca) {
      this.ismepdtl = true;
    }

    // console.log("mepno", IDMep)
    // this.spinnerservice.show();
    this.prposervice.getmepdtl(pca, this.prForm.value.commodity?.id).subscribe(
      (result) => {
        // this.spinnerservice.hide();
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
        // this.spinn.hide();
      }
    );
    // if (this.mepid != '') {
    //   this.ismepdtl = true
    // } else {
    //   this.ismepdtl = false

    // }
  }

  public displayFnmodell(model?: modelsList): string | undefined {
    return model ? model.name : undefined;
  }
  makeList: any;
  has_nextprodd = false;
  has_previousprodd = false;
  currentpageprodd = 1;
  @ViewChild("itemmake") matitemmakeAutocomplete: MatAutocomplete;
  @ViewChild("itemmakeInput") itemmakeInput: any;
  autocompleteitemScrollmake() {
    setTimeout(() => {
      if (
        this.matitemmakeAutocomplete &&
        this.autocompleteTrigger &&
        this.matitemmakeAutocomplete.panel
      ) {
        fromEvent(this.matitemmakeAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matitemmakeAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matitemmakeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matitemmakeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matitemmakeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextprodd == true) {
                this.prposervice
                  .getMake(
                    this.prForm.value.product.code,
                    this.itemmakeInput.nativeElement.value,
                    this.currentpageprodd + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.makeList = this.makeList.concat(datas);
                      if (this.makeList.length >= 0) {
                        this.has_nextprodd = datapagination.has_next;
                        this.has_previousprodd = datapagination.has_previous;
                        this.currentpageprodd = datapagination.index;
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

  getitemFKmake() {
    this.product_code = this.prForm.value.product.code;
    this.SpinnerService.show();
    if (this.product_code == "") {
      this.notification.showError("Kindly Choose Product!");
      this.SpinnerService.hide();
      return false;
    } else {
      this.prposervice.getMake(this.prForm.value.product.code, "", 1).subscribe(
        (results: any[]) => {
          this.SpinnerService.hide();
          this.isLoading = false;
          let datas = results["data"];
          let data = results;
          this.currentpageitem = 1;
          this.has_nextitem = true;
          this.has_previousitem = true;
          if (datas.length == 0) {
            this.notification.showError("No data is there against make");
          } else {
            this.makeList = datas;
          }
          console.log("product", datas);
          if (
            data["description"] === "The Product Doesn't Have a Valid Catalog"
          ) {
            this.SpinnerService.hide();
            this.notification.showError(
              "The Product Doesn't Have a Valid Catalog"
            );
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }
  }

  getmodallprmaker() {
    this.SpinnerService.show();
    if (this.make_id == undefined || this.make_id == "") {
      this.notification.showError("Choose Make!");
      this.SpinnerService.hide();
      return false;
    } else {
      this.prposervice
        .getModal(this.prForm.value.product.code, this.make_id, 1)
        .subscribe(
          (results: any[]) => {
            this.SpinnerService.hide();
            this.isLoading = false;

            let datas = results["data"];
            let data = results;
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
              this.SpinnerService.hide();
              this.notification.showError(
                "The Product Doesn't Have a Valid Catalog"
              );
            }
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );
    }
  }
  setProduct(item: any, index: number) {
    const prdetails = this.prForm.get("prdetails") as FormArray;
    const rowGroup = prdetails.at(index) as FormGroup;
    this.prod_id = item?.id || "";
    rowGroup.get("items")?.enable();
    rowGroup.get("models")?.enable();
  }
  quotationget() {
    let obj = {
      quotation_no: this.quotationnumbernew,
    };
    this.prposervice.getQuotationid(obj).subscribe((results: any) => {
      let datas = results;
      this.quotationidnew = datas.quotation_id;
      this.quotationdetailidnew = datas.id;
    });
  }
  previewClick() {
    if (
      this.prForm.value == null ||
      this.prForm.value == "" ||
      this.prForm.value == 0
    ) {
      this.notification.showWarning(
        "Data Seems Empty..Pls fill Atleast commodity"
      );
      return false;
    }

    let filesvalueDetails = this.files.value.file_upload;
    let detailsValue = this.prForm.value.prdetails;

    if (this.isprbulkupload != true) {
      if (detailsValue.length == 0) {
        this.notification.showWarning(
          "Details seems empty Please fill the details before submit"
        );
        return false;
      }
    }
    if (!this.selectedToggle) {
      this.notification.showWarning("Please Select Independent PR or Batch PR");
      return false;
    }

    let datadetails = this.prForm.value.prdetails;

    console.log("datadetails", datadetails);
    if (datadetails?.length > 0) {
      for (let detail in datadetails) {
        let datadetailsUom: any;
        console.log("this.prForm.value.type", this.prForm.value.type);
        console.log("datadetails[detail].uom", datadetails[detail].uom);

        delete datadetails[detail].pr_for;
        delete datadetails[detail].is_save;

        console.log("datadetailsUom", datadetailsUom);
        let datadetailsqty = datadetails[detail].qty;
        let datadetailsunitPrice = datadetails[detail].unitprice;

        let detailIndex = Number(detail);

        let prccbsdata = datadetails[detail].prccbs;
        for (let ccbs in prccbsdata) {
          let branchdata = prccbsdata[ccbs].branch_id;
          let bsdata = prccbsdata[ccbs].bs;
          let ccdata = prccbsdata[ccbs].cc;
          let qtydataOnCCBS = prccbsdata[ccbs].qty;
          let detailIndex = Number(detail);
          let ccbsindex = Number(ccbs);
        }
      }
      let ccbsarrayqtyTotal = [];
      let arrayofQtyPrdetails = this.prForm.value.prdetails.map((x) => x.qty);
      console.log("prdetailsarray", arrayofQtyPrdetails);
      let ccbsarray = this.prForm.value.prdetails;
      ccbsarray.forEach((row, index) => {
        let ccbsarrayqty = ccbsarray[index].prccbs.map((x) => x.qty);
        console.log("ccbs array qty", ccbsarrayqty);
        let totalqtydetails = ccbsarrayqty.reduce((a, b) => a + b, 0);
        ccbsarrayqtyTotal.push(totalqtydetails);
        console.log("ccbs array qty Total", ccbsarrayqtyTotal);
      });

      console.log("this.prform.value===>", this.prForm.value);

      let detailsvalue = this.prForm.value;
      console.log("detailsvalue===>", detailsvalue);

      if (detailsvalue) {
        delete detailsvalue.productCategory;
        delete detailsvalue.commodity;
        delete detailsvalue.itemnoncatlog;
        delete detailsvalue.items;
        delete detailsvalue.models;
        // delete detailsvalue.specs
        delete detailsvalue.product;
        delete detailsvalue.productnoncatlog;
        delete detailsvalue.productType;
        delete detailsvalue.supplier;
        delete detailsvalue.supplier_id;
        delete detailsvalue.unitprice;
      }

      let prdetailsvalue = this.prForm.value.prdetails;
      for (let i in prdetailsvalue) {
        delete prdetailsvalue[i].branch;
        delete prdetailsvalue[i].commodityname;
        delete prdetailsvalue[i].itemname;
        delete prdetailsvalue[i].modelname;
        // delete prdetailsvalue[i].specification
        delete prdetailsvalue[i].productname;
        delete prdetailsvalue[i].suppliername;
        if (this.prForm.value.type == 2) {
          // this.prForm.value.hsn = prdetailsvalue[i].hsn.id
          this.prForm.value.hsn = 0;
        }
        let ccbsbranch = prdetailsvalue[i].prccbs;
        for (let j in ccbsbranch) {
          if (ccbsbranch[j].branch_id.id == undefined) {
            ccbsbranch[j].branch_id = ccbsbranch[j].branch_id;
          } else {
            ccbsbranch[j].branch_id = ccbsbranch[j].branch_id.id;
          }
          if (ccbsbranch[j].bs.name == undefined) {
            ccbsbranch[j].bs = ccbsbranch[j].bs;
          } else {
            ccbsbranch[j].bs = ccbsbranch[j].bs.name;
          }
          if (ccbsbranch[j].cc.name == undefined) {
            ccbsbranch[j].cc = ccbsbranch[j].cc;
          } else {
            ccbsbranch[j].cc = ccbsbranch[j].cc.name;
          }
        }
      }
    }

    this.prForm.value.specs = this.prForm.value.specs;

    if (this.is_model == false) {
      this.prForm.patchValue({
        model_id: "",
        model_name: "",
        specification: "",
      });
    }
    if (this.configuration == false) {
      this.prForm.patchValue({
        specification: "",
      });
    }
    console.log("datasssssssss", this.prForm.value);

    this.prForm.value.prdetails_bfile_id = this.prForm.value.prdetails_bfile_id;
    let prdetailsvalue = this.prForm.value.prdetails;
    let emp = typeof this.prForm.value.employee_id;
    if (emp == "object") {
      let id = this.prForm.value?.employee_id?.id;
      this.prForm.get("employee_id")?.setValue(id);
    } else {
      this.prForm.get("employee_id").disable();
    }
    let branch = typeof this.prForm.value.branch_id;
    // if (branch == "object") {
    //   let id = this.prForm.value?.branch_id?.id;
    //   this.prForm.get("branch_id")?.setValue(id);
    // }
    let dataSubmit = { ...this.prForm.value };

    if (this.prapproveId) {
      dataSubmit = { ...dataSubmit, id: this.prapproveId };
    }

    if (this.selectedTypeQ == 2) {
      dataSubmit = { ...dataSubmit, dts: 0 };
    }
    delete dataSubmit.service_des;

    console.log("Pr Final Data", JSON.stringify(dataSubmit));

    dataSubmit = Object.assign({}, dataSubmit, {
      prdetails_del: this.prdetails_delete,
    });
    dataSubmit = Object.assign({}, dataSubmit, {
      prccbs_del: this.prccbs_delete,
    });

    let filesvalue = this.files.value.file_upload;
    let filesHeadervalue = this.filesHeader.value.file_upload;
    console.log("datasubmit==>", dataSubmit);
    // this.independentpr = true;
    this.formDataChange(dataSubmit, "preview");
  }
//   onUnitPriceInput(event: any, index: number, isBlur: boolean = false) {
//   let input = event.target.value;

//   if (!input) return;

//   // remove commas
//   const numericValue = input.replace(/,/g, '');
//   if (isNaN(Number(numericValue))) return;

//   const numberValue = Number(numericValue);

//   // Format with Indian commas
//   const formatted = new Intl.NumberFormat('en-IN', {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2
//   }).format(numberValue);

//   // always show formatted in field
//   event.target.value = formatted;

//   // update form control only on blur
//   if (isBlur) {
//     const prdetailsArray = this.prForm.get('prdetails') as FormArray;
//     // prdetailsArray.at(index).get('unitprice')?.setValue(numberValue, { emitEvent: false });

//     // recalc totals
//     this.calcTotal(prdetailsArray.at(index) as FormGroup);
//   }
// }

onAmountInput(event: any, section: FormGroup) {
  const input = event.target.value;
  const rawValue = input ? input.toString().replace(/,/g, '') : '';
  section.get('amount')?.setValue(rawValue, { emitEvent: false });
  section.get('unitprice')?.setValue(rawValue, { emitEvent: false });

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
   section.get('unitprice')?.setValue(value, { emitEvent: false });

}
validateAmount(event: any) {
  let value = event.target.value;

  // Allow only digits and dot
  value = value.replace(/[^0-9.]/g, '');

  // Allow only one dot
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts[1];
  }

  // Allow only two digits after decimal
  if (parts[1]?.length > 2) {
    value = parts[0] + '.' + parts[1].substring(0, 2);
  }

  // Prevent starting with a dot (e.g. ".25")
  if (value.startsWith('.')) {
    value = '0' + value;
  }

  event.target.value = value;
}
formatIndianNumber(input) {
  // Allow only numbers and dot
  input.value = input.value.replace(/[^0-9.]/g, '');

  // Split integer and decimal parts
  let [integerPart, decimalPart] = input.value.split('.');

  // Format integer part with Indian commas
  if (integerPart) {
    integerPart = integerPart.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    // Small fix for numbers under 1000
    integerPart = integerPart.replace(/^(\d+)(,\d{3})$/, '$1$2');
  }

  // If decimal part exists, limit to 2 digits
  if (decimalPart !== undefined) {
    decimalPart = decimalPart.slice(0, 2);
    input.value = `${integerPart}.${decimalPart}`;
  } else {
    input.value = integerPart;
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