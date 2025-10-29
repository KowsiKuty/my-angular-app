import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
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
} from "@angular/forms";
import { NotificationService } from "../notification.service";
import { Router } from "@angular/router";
import { ViewChild } from "@angular/core";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  filter,
  switchMap,
  finalize,
  takeUntil,
  map,
  catchError,
} from "rxjs/operators";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { Observable, from, fromEvent, of } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { NgxSpinnerService } from "ngx-spinner";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import { formatDate, DatePipe } from "@angular/common";
import { ErrorHandlingServiceService } from "../error-handling-service.service";
import { event } from "jquery";
import { MatMenuTrigger } from "@angular/material/menu";
import { faservice } from "src/app/fa/fa.service";
import { threadId } from "worker_threads";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { isBoolean } from "util";
import { ReportserviceService } from "src/app/reports/reportservice.service";
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
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface supplierlistss {
  id: string;
  name: string;
}
export interface termslistss {
  id: string;
  name: string;
}
export interface Emplistss {
  id: string;
  full_name: string;
}

export interface commoditylistss {
  id: string;
  name: string;
}

export interface productLists {
  no: any;
  name: any;
  id: any;
  code: any;
}
export interface supplierlistsearch {
  id: string;
  name: string;
}
export interface productCategoryLists {
  // no: string;
  text: string;
  id: number;
}
export interface itemsLists {
  id: string;
  name: string;
}
@Component({
  selector: "app-po-create",
  templateUrl: "./po-create.component.html",
  styleUrls: ["./po-create.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
  ],
})
export class PoCreateComponent implements OnInit {
  PRsummarySearchForm: FormGroup;
  POForm: FormGroup;
  GlobalCheckArray=[]
  qty = new FormControl("");
  retired_remarks = new FormControl("");
  TermsForm: FormGroup;
  producttermsForm: FormGroup;
  servicetermsForm: FormGroup;
  // Istermsbutton:boolean=true;
  image: any;

  todayDate = new Date();
  PrList: any;
  delivaryList: any = [];

  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;
  isLoading = false;
  branchList: Array<branchlistss>;
  branch_id = new FormControl();

  supplierList: Array<supplierlistss>;
  termsList: Array<termslistss>;

  supplierbranch_id = new FormControl();
  terms_id = new FormControl();
  termlist: Array<any>;
  files: FormGroup;
  filesHeader: FormGroup;
  employeeList: Array<Emplistss>;
  employee_id = new FormControl();
  @ViewChild("emp") matempAutocomplete: MatAutocomplete;
  @ViewChild("empInput") empInput: any;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("branch") matbranchAutocomplete: MatAutocomplete;
  @ViewChild("branchInput") branchInput: any;
  @ViewChild("supplier") matsupplierAutocomplete: MatAutocomplete;
  @ViewChild("supplierInput") supplierInput: any;
  @ViewChild("tnc") mattermsAutocomplete: MatAutocomplete;
  @ViewChild("tncInput") tncInput: any;
  @ViewChild('CloseModal')CloseModal:ElementRef
  @ViewChild('BuyBackTrigger')BuyBackTrigger:ElementRef
  @ViewChild('BuyBackDismiss')BuyBackDismiss:ElementRef
  @Output() linesChange = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild("takeInput", { static: false }) InputVar: ElementRef;
  type = new FormControl({ value: "" });
  ShowNonCat: boolean;
  ShowCat: boolean;
  supplierdisable: boolean;
  clicked: boolean = false;

  commodityList: Array<commoditylistss>;
  @ViewChild("commodity") matcommodityAutocomplete: MatAutocomplete;
  @ViewChild("commodityInput") commodityInput: any;
  suppliersearchList: Array<supplierlistsearch>;
  @ViewChild("suppliersearch") matsuppliersearchAutocomplete: MatAutocomplete;
  @ViewChild("suppliersearchInput") suppliersearchInput: any;
  isselected: any[] = []; //8199
  isselectedpar: any[] = [];
  selectedid: any; //8199
  productCategoryList: any;
  modelId: any;
  modelnname: any;
  catlog: any;
  cc: any;
  assetArray: any = [];
  totalcount: any;
  selectedTypeQ:number;
  pocreate: boolean = true;
  notepadfn: boolean = true;
  toggleDisabled: boolean = false;
  togglekey: boolean = false;
  pofirst: boolean = true;
  totalcount_qty: any;
  has_next_qty: any;
  has_previous_qty: any;
  presentpage_qty: number;
  totalcoount: number = 0;
  selectedTab: number = 0;
  serviceForm: FormGroup;
  retirediddata: any;
  previouspageclick: number;
  previousclick: boolean;
  previewClick: boolean = false;
  finaldata: string;
 producttype_next = false;
  producttype_pre = false;
  producttype_crtpage= 1;
 prdTypes: any=[]
  @ViewChild("productauto") productAutocomplete: MatAutocomplete;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private shareService: SharedService,
    private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService,
    private datePipe: DatePipe,
    private notification: NotificationService,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingServiceService,
     private reportService: ReportserviceService
  ) {}
  ngOnInit(): void {
    this.selectedTab = 0;

    this.productForm = this.fb.group({
      desc: "",
      type: "P",
    });
    this.serviceForm = this.fb.group({
      desc: "",
      type: "S",
    });
    this.TermsForm = this.fb.group({
      desc: "",
      type: "",
      id: "",
    });
    this.producttermsForm = this.fb.group({
      name: "",
      id: "",
    });

    this.servicetermsForm = this.fb.group({
      name: "",
    });

    this.files = this.fb.group({
      file_upload: new FormArray([]),
      file_uploadindexs: new FormArray([]),
    });
    this.filesHeader = this.fb.group({
      file_upload: new FormArray([]),
    });

    this.PRsummarySearchForm = this.fb.group({
      prno: [""],
      suppliername: [""],
      commodityname: [""],
      branchname: [""],
      product_type: [""],
      product_id: [""],
    });
    this.POForm = this.fb.group({
      supplierbranch_id: ["", Validators.required],
      commodity_id: ["", Validators.required],
      terms_id: [{ value: "", disabled: true }, ],
      validfrom: ["", Validators.required],
      validto: ["", Validators.required],
      branch_id: ["", Validators.required],
      onacceptance: 0,
      ondelivery: 0,
      oninstallation: 0,
      notepad: ["", Validators.required],
      warrenty: 0,
      amount: [0, Validators.required],
      discount: [0],
      employee_id: ["", Validators.required],
      mepno: ["", Validators.required],
      Header_img: null,
      file_key: [["fileheader"]],
      note_justify: "",
      terms_text:[''],
      note_placedto: "",
      note_title: "",
      podetails: this.fb.array([
        //this.addpodetailsGroup()
      ]),
    });
    this.getEmployeeBranchData();
    // let branchkeyvalue: String = "";
    // this.getbranchFK(branchkeyvalue);
    this.PRsummarySearchForm.get("branchname")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.dataService.getbranchFK(value, 1).pipe(
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

    // let branchkeyvalue: String = "";
    // this.getbranchFK(branchkeyvalue);
    this.POForm.get("branch_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.dataService.getbranchFK(value, 1).pipe(
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

    this.PRsummarySearchForm.get("commodityname")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.dataService.getcommodityFKdd(value, 1).pipe(
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

    this.PRsummarySearchForm.get("suppliername")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.dataService.getsupplierDD(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            }),
            catchError((error) => {
              this.errorHandler.handleError(error); // Log or display the error
              this.SpinnerService.hide(); // Hide the spinner
              // Return a fallback value to prevent the observable from terminating
              return of({ data: [] }); // Empty response with a `data` property
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.suppliersearchList = datas;
      },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })

    // let supplierkeyvalue: String = "";
    // this.getsupplierFK(supplierkeyvalue);
    // this.POForm.get('supplierbranch_id').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.dataService.getsupplierFK(value, 1)
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
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // })

    // this.serviceTab(1);
    let key = "";
    this.gettermsFK(key);
    if (this.POForm.value.supplierbranch_id != "") {
      this.formNotComplete = false;
    }

    this.POForm.get("employee_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.dataService
            .getemployeeLimitSearchPO(this.POForm.value.commodity_id, value)
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

    this.POForm.get("terms_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.dataService.gettermsFK(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.termlist = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );

    this.getCatlog_NonCatlog();
    this.getproductType();
    this.updateTotalCount();
    this.POForm.get("podetails").valueChanges.subscribe(() => {
      this.updateTotalCount();
    });
  }
  IDtype: any;
  // CheckValidationInSummary(event, id){
  //   this.IDtype = this.type .value
  //   let dataidCondition = this.IDtype
  //   let dataForm = this.POForm.value.podetails
  //   if((dataidCondition != "") || dataidCondition != undefined){
  //   if(dataForm.length > 0){
  //     event.preventDefault();
  //     event.stopPropagation();
  //     this.notification.showWarning("This action is not allowed Please delete Product if you want to change in Details below")
  //     return false;
  //   }
  //   else{
  //     this.getprapprovesummary()
  //   }
  // }
  // }

  getprapprovesummary(pageNumber = 1, pageSize = 10) {
    let dataForm = this.POForm.value.podetails;
    // if (dataForm.length > 0) {
    //   this.notification.showWarning("This Action is not allowed, If you want to change Please delete the selected Product below")
    //   return false
    // }
    this.SpinnerService.show();
    this.dataService
      .getprapprovesummary(this.type.value, pageNumber, pageSize)
      .subscribe(
        (results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          console.log(["getprapprovesummary", datas]);
          let datapagination = results["pagination"];
          this.PrList = datas;
          this.modelId = datas[0].model_id;
          this.modelnname = datas[0].model_name;

          // console.log(" this.PrList", this.PrList)
          if (this.PrList.length > 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.presentpage = datapagination.index;
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }
  nextClick() {
    if (this.has_next === true) {
      this.PRsummarySearch(this.presentpage + 1);
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.PRsummarySearch(this.presentpage - 1);
    }
  }

  resetpr() {
    this.PRsummarySearchForm.controls["prno"].reset("");
    this.PRsummarySearchForm.controls["suppliername"].reset("");
    this.PRsummarySearchForm.controls["commodityname"].reset("");
    this.PRsummarySearchForm.controls["branchname"].reset("");
    this.PRsummarySearchForm.controls["product_type"].reset("");
    // this.PRsummarySearchForm.reset("")
    // this.getprapprovesummary();
    this.PRsummarySearch(1);
  }
  PRsummarySearch(page) {
    let searchdel = this.PRsummarySearchForm.value;
    console.log("data for search", searchdel);
    if (searchdel.commodityname?.id == undefined) {
      searchdel.commodityname = searchdel.commodityname;
    } else {
      searchdel.commodityname = searchdel.commodityname?.id;
    }
    if (searchdel.branchname?.id == undefined) {
      searchdel.branchname = searchdel.branchname;
    } else {
      searchdel.branchname = searchdel.branchname?.id;
    }
    if (searchdel.suppliername?.id == undefined) {
      searchdel.suppliername = searchdel.suppliername;
    } else {
      searchdel.suppliername = searchdel.suppliername?.id;
    }
    if (searchdel?.product_id?.id == undefined) {
      searchdel.product_id = searchdel.product_id;
    } else {
      searchdel.product_id = searchdel.product_id?.id;
    }
     if (searchdel?.product_type?.id == undefined) {
      searchdel.product_type = searchdel.product_type
    } else {
      searchdel.product_type = searchdel.product_type?.id;
    }
    for (let i in searchdel) {
      if (
        searchdel[i] === null ||
        searchdel[i] === "" ||
        searchdel[i] == undefined
      ) {
        delete searchdel[i];
      }
    }
    this.SpinnerService.show();
    this.dataService
      .getprsummarySearch(this.type.value, searchdel, page)
      .subscribe(
        (result) => {
          this.SpinnerService.hide();
          console.log("prList search result", result);
          this.PrList = result["data"];
          let datass = result["data"];
          let prhead = datass[0].prheader_id;
          this.catlog = prhead.type_id;
          // console.log(" this.PrList1", this.PrList)
          let datapagination = result["pagination"];
          this.totalcount = result.total_count;
          if (this.PrList.length > 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.presentpage = datapagination.index;
            this.pofirst = true;
          }
          if (this.PrList.length == 0) {
            this.pofirst = false;
          }
          // if (searchdel.prno === '' && searchdel.suppliername === '' && searchdel.commodityname === '' && searchdel.branchname === '') {
          //   this.getprapprovesummary();
          // }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }
  previousClickqty() {
    if (this.has_previous_qty === true) {
      // this.previousclick = true
      this.getdeliveryDetails(this.prIndex, this.presentpage_qty - 1);
    }
  }
  
  nextClickqy() {
    if (this.has_next_qty === true) {
      this.getdeliveryDetails(this.prIndex, this.presentpage_qty + 1);
    }
  }
  nextpage() {
    if (this.has_next === true) {
      this.PRsummarySearch(this.presentpage + 1);
    }
  }
  previouspage() {
    if (this.has_previous === true) {
      this.PRsummarySearch(this.presentpage + 1);
    }
  }
  iddata: any;
  iddataNew:any
  poArrayid=[]
  prnodata: any;
  prSupplier: any;
  pr_request = 2;
  popupname: any;
  activePopup: string | null = null;

  // posharedata(data,i) {
  posharedata(data, index) {
    // this.pr_request = data?.pr_request;
    //this.prposhareService.PoShare.next(data);
    this.iddata = data.id;
    this.iddataNew=data.id
    
    this.prnodata = data.prheader_id.no;
    this.prSupplier = data.supplier_id.name;
    // this.oldunitprice = data.unitprice
    // this.selectedindex = i
    this.popupname = "popupname_" + this.iddata;
    this.activePopup = this.popupname;
    this.product_type_name = data?.product_type?.name;
    this.product_type = data?.product_type?.id;

    this.quotation_no = data?.quotation?.supplier_quot || 0;
    this.quot_detailsid = data?.quotation?.quot_detailsid || 0;
    this.quotationid = data?.quotation?.quotationid || 0;

    
    // return data;
    this.getdeliveryDetails(index, 1);
  }
  quot_detailsid: any;
  quotationid: any;
  product_type_name: any;
  quotation_no:  any;
  product_type: any ;
  retiredRemarks(data) {
    //this.prposhareService.PoShare.next(data);
    // this.iddata = data.id;
    this.retirediddata = data;
    this.prnodata = data.prheader_id.no;
    console.log("retired ID", this.iddata);
    console.log("this.prnodata", this.prnodata);
    return data;
  }
  retiredRemarksSubmit(data, retired_remarks, event) {
    this.iddata = data.id;
    this.prnodata = data.prheader_id.no;
    console.log("retired ID", this.iddata);
    console.log("this.prnodata", this.prnodata);
    console.log("retired_remarks", retired_remarks);
    let retvalue = {
      id: [this.iddata],
      remarks: retired_remarks,
    };
    console.log("retvalue", retvalue);
    // event.preventDefault();
    // event.stopPropagation();
    let dataConfirm = confirm("Do you want to continue to retire?");
    if (dataConfirm == true) {
      this.SpinnerService.show();
      this.dataService.retiredremarksPO(retvalue).subscribe(
        (res) => {
          this.SpinnerService.hide();
          if (
            res.code === "PO Created" &&
            res.description === "Already PO as been created for this PR"
          ) {
            this.SpinnerService.hide();
            this.notification.showWarning(
              "This PR is Not Allowed To Retire, PO Already Created"
            );
            return false;
            // event.preventDefault();
            // event.stopPropagation();
          } else {
            this.notification.showSuccess("Successfully Retired");
            this.onCancel.emit();
            this.SpinnerService.hide();
            this.PRsummarySearch(1);
            return;
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }
    if (dataConfirm == false) {
      this.notification.showInfo("Cancelled");
    }

    // return data
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  formNotComplete: boolean = true;

  addpodetailsGroup() {
    let group = new FormGroup({
      installationrequired: new FormControl(""),
      capitalized: new FormControl(""),
      commodity: new FormControl(""),

      Product_name: new FormControl(""),
      ProductArrayData:new FormControl([]),
      product_id: new FormControl(""),
      qty: new FormControl(0),
      uom: new FormControl(""),
      unitprice: new FormControl(0),
      amount: new FormControl(0),
      taxamount: new FormControl(""),
      amcvalue: new FormControl(0),
      deliveryperiod: new FormControl(0),
      totalamount: new FormControl(""),
      discount: new FormControl(0),
      is_asset: new FormControl(""),
      delivery_details: this.fb.array([
        this.fb.group({
          ccbsqty: new FormControl(""),
          prdetails_id: new FormControl(""),
          product_id: new FormControl(""),
          commodity_id: new FormControl(""),
          prccbs_id: new FormControl(""),
          ccbs: new FormControl(""),
          qty: new FormControl(0),
          uom: new FormControl(""),
          bs: new FormControl(""),
          cc: new FormControl(""),
          prccbs_remaining_qty_Value: new FormControl(""),
          location: new FormControl(""),
        }),
      ]),
    });
    return group;
  }

  delivery_detailsGroup(): FormGroup {
    return this.fb.group({
      ccbsqty: new FormControl(""),
      prdetails_id: new FormControl(""),
      product_id: new FormControl(""),
      commodity_id: new FormControl(""),
      prccbs_id: new FormControl(""),
      ccbs: new FormControl(""),
      qty: new FormControl(0),
      uom: new FormControl(""),
      bs: new FormControl(""),
      cc: new FormControl(""),
      prccbs_remaining_qty_Value: new FormControl(""),
      location: new FormControl(""),
    });
  }

  get podetailsArray(): FormArray {
    return <FormArray>this.POForm.get("podetails");
  }

  addSection() {
    const control = <FormArray>this.POForm.get("podetails");
    control.push(this.addpodetailsGroup());
  }

  removeSection(index, data) {
    for(let x of data.value.ProductArrayData){
       const cacheKey = x;
       if (this.deliveryCache.has(cacheKey)) {
    this.deliveryCache.delete(cacheKey);
  }
    }

    //8199
    console.log("data for delete==>", data);
    // let length= data.value.isselectedarray.length
    let length = data.value.delivery_details.length;
    console.log("myarraylength==>", length);
    for (let i = 0; i < length; i++) {
      // let value = data.value.isselectedarray[i];
      // if(this.isselected.includes(value)){
      //   this.isselected.splice(i, 1);
      // }
      // this.isselected = this.isselected.filter(value => !data.value.delivery_details.length.includes(value));

      let value = data.value.delivery_details[i].prdetails_id;
      // console.log("value===>",value)
      let valueindex = this.isselected.indexOf(value);
      let valueindexx = this.isselectedpar.indexOf(value);

      if (index !== -1 && valueindex != -1) {
        // Delete the element at the found index
        this.isselected.splice(valueindex, 1);
      }
      if (index !== -1 && valueindexx != -1) {
        // Delete the element at the found index
        this.isselectedpar.splice(valueindexx, 1);
      }

      // console.log("isselected array after splice====>",this.isselected)
    }
    //8199
    const control = <FormArray>this.POForm.get("podetails");
    control.removeAt(index);
    this.POForm.controls["employee_id"].reset("");
    // this.files.value.file_upload.splice(index)
    // this.files.value.file_uploadindexs.splice(index)
    this.FileDataArray.splice(index, 1);
    this.FileDataArrayIndex.splice(index, 1);
    let lengthCheckForRefreshData = this.POForm.value.podetails;
    let lengthval = lengthCheckForRefreshData.length;
    if (lengthval === 0) {
      this.POForm.reset();
      this.type.enable();
      // if (this.type.value == 1) {
      this.POForm.controls["supplierbranch_id"].reset("");
      this.POForm.controls["employee_id"].reset("");
      // }
      this.getEmployeeBranchData();
    }
    console.log("this.FileDataArray", this.FileDataArray);
    console.log("this.this.FileDataArrayIndex", this.FileDataArrayIndex);
    this.datasums();

    // this.isselected = [];   //8199
    this.PRsummarySearch(this.presentpage); //8199
  }
  prHeaderId: any;
  prIndex: any;
  // private deliveryCache = new Map<number, any>(); // Cache for delivery data by index

  // getdeliveryDetails(index, page) {
  //   this.prIndex = index;
  //   let id = this.iddata;
  //   if (
  //     this.isselected.includes(this.iddata) ||
  //     this.isselectedpar.includes(this.iddata)
  //   ) {
   
  //     console.log(
  //       "Using cached data because the ID is selected or partially selected"
  //     );
  //     console.log("iselectedincludes=>",this.isselected.includes(this.iddata))
  //     console.log("iselectedincludes=>",this.isselectedpar.includes(this.iddata))

  //     this.delivaryList = this.deliveryCache.get(index) || []; 
  //     return;
  //   }
  //   this.SpinnerService.show();
  //   this.dataService.getpodeliverydetails(id, page).subscribe(
  //     (results) => {
  //       let datas = results["data"];
  //       let prr = datas[0].prdetails.prheader_id;
  //       this.prHeaderId = prr.id;
  //       this.cc = prr.type_id;
  //       this.SpinnerService.hide();
  //       console.log("getsummaryddin grid", datas);
  //       this.delivaryList = datas;
  //       this.deliveryCache.set(index, datas); // Cache the result
  //       this.totalcount_qty = results.total_count;
  //       this.qty.reset();
  //       let datapagination = results["pagination"];
  //       if (this.delivaryList.length > 0) {
  //         this.has_next_qty = datapagination.has_next;
  //         this.has_previous_qty = datapagination.has_previous;
  //         this.presentpage_qty = datapagination.index;
  //         // this.summary = true
  //       }
  //     },
  //     (error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     }
  //   );
  // }
  // ✅ make sure your cache is defined like this in your component
deliveryCache: Map<string, any> = new Map();

getdeliveryDetails(index: number, page: number) {
  this.prIndex = index;
  let id = this.iddata;

  // ✅ build a unique cache key using index + page
  // const cacheKey = `${index}-${page}`;
  const cacheKey = this.iddata;
// this.previouspageclick = page
  // ✅ use cache only if selected/partially selected AND cache exists
  // if (this.deliveryCache.has(cacheKey))
  //    {
    
  //   this.delivaryList = this.deliveryCache.get(cacheKey) || []; 
  //   return;
  // }

  if (this.deliveryCache.has(cacheKey)) {
  const cached = this.deliveryCache.get(cacheKey);

  this.delivaryList = cached.datas || [];

  // ✅ restore pagination info from cache
  let datapagination = cached.pagination;
  if (this.delivaryList.length > 0) {
    this.has_next_qty = datapagination.has_next;
    this.has_previous_qty = datapagination.has_previous;
    this.presentpage_qty = datapagination.index;
  }
  return;
}

  // ✅ if no cache, fetch from backend
  this.SpinnerService.show();
  this.dataService.getpodeliverydetails(id, page).subscribe(
    (results) => {
      let datas = results["data"];

      // extract prheader details
      let prr = datas[0].prdetails.prheader_id;
      this.prHeaderId = prr.id;
      this.cc = prr.type_id;

      this.SpinnerService.hide();
      console.log("getsummaryddin grid", datas);

      // set delivery list
      this.delivaryList = datas;

      // ✅ save in cache with composite key
      // this.deliveryCache.set(cacheKey, datas);
      // storing all the datas to restore the selected product details
      this.deliveryCache.set(cacheKey, {
  datas,
  pagination: results["pagination"]
});

      // update pagination info
      this.totalcount_qty = results.total_count;
      this.qty.reset();

      let datapagination = results["pagination"];
      if (this.delivaryList.length > 0) {
        this.has_next_qty = datapagination.has_next;
        this.has_previous_qty = datapagination.has_previous;
        this.presentpage_qty = datapagination.index;
      }
    },
    (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
  );
}


  

  amt: any;
  sum: any = 0.0;
  dff: any = 0.0;
  ttlamt: any;
  amtt: any;
  disc: number;
  assetDetailsIndex:any

  getFormArray(): FormArray {
    return this.POForm.get("podetails") as FormArray;
  }
  qtypatchpo: any;
  variableforIndexccbs: any;
  totalqtydetails: any;
  gettingarrayOfCcbsValue(i, data) {
    let variableForccbs = this.POForm.value.podetails[i].delivery_details.map(
      (x) => x.ccbs
    );
    console.log("variableForccbs", variableForccbs);

    let indexvalueofccbsindifferentfunction = variableForccbs.indexOf(data.id);
    console.log(
      "indexvalueofccbsindifferentfunction",
      indexvalueofccbsindifferentfunction
    );
    this.variableforIndexccbs = indexvalueofccbsindifferentfunction;
    console.log("this.variableforIndexccbs", this.variableforIndexccbs);
  }
  colordiff(data, i) {}
  isCheckQty() {}
  arrayvalueget = [];
  ccbspatchpo: any;
  datavalueget: any;
  //////////////////////////////////////////////////// Type 1 and Type 2 (if conditions is used below)
  async getpodata(data, qtyvalues, i) {
    // console.log("data1",data)
    // console.log('qty', qtyvalues)
    let valueTocheckQuantity: any = +qtyvalues;
    if (valueTocheckQuantity <= 0 || valueTocheckQuantity > data.remainingQty) {
      this.notification.showWarning("Please Enter Valid Quantity");
      return false;
    } else {
      // const index = this.delivaryList.findIndex(item => item === data);
      // if (index !== -1) {
      this.delivaryList[i].remainingQty -= valueTocheckQuantity;
      // }
    }
    if (this.POForm.value.podetails.length > 0) {
      if (
        this.POForm.value.mepno !== "" &&
        data.prdetails.prheader_id.mepno === ""
      ) {
        this.notification.showWarning("Choose Same PCA");
        return false;
      }
      if (
        this.POForm.value.mepno === "" &&
        data.prdetails.prheader_id.mepno !== ""
      ) {
        this.notification.showWarning("Choose Same PCA");
        return false;
      }
    }
    console.log("dataaaaaaaa", data);
    console.log("qty", qtyvalues);
    /// reset supplier and approver for every changes in the table
    // if (this.type.value == 1) {
    //   this.POForm.controls['supplierbranch_id'].reset("")
    // }
    this.POForm.controls["employee_id"].reset("");
    let formvalues = this.POForm.value.podetails;
    //checking the condition if commodity in poform or if commodity is present check same commodity or not
    if (
      !this.POForm.value.commodity_id ||
      this.POForm.value.commodity_id ===
        data.prdetails.prheader_id.commodity_id.id
    ) {
      //checking if podetails length for updata the data
      if (formvalues.length > 0) {
        // if podetails is present check same product or different product to push or update
        for (let i in formvalues) {
          //if same product we have to update the delivery details data in podetails
          if (this.type.value == 1) {
            if (this.POForm.value.podetails.length > 0) {
              if (this.POForm.value.mepno != data.prdetails.prheader_id.mepno) {
                this.notification.showWarning("Choose Same PCA");
                return false;
              }
              if (
                this.POForm.value.supplierbranch_id.id !=
                data.prdetails.supplier_id.id
              ) {
                this.notification.showWarning("Choose Same Supplier");
                return false;
              }
            }
            // if(data.pr_request == 1){

            // }

            // formvalues[i].product_type === this.product_type &&

            if (
              formvalues[i].product_id === data.prdetails.product_id &&
              formvalues[i].item_name === data.prdetails.item_name &&
              formvalues[i].model_name === data.prdetails.model_name &&
              formvalues[i].item_name === data.prdetails.item_name &&
              formvalues[i].specification === data.prdetails.specification
            ) {
              // formvalues[i].item_name_replacement.id && data.pr_request)
              if(formvalues[i]?.ProductArrayData.length){
                let array=formvalues[i]?.ProductArrayData
                if(!formvalues[i]?.ProductArrayData.includes(this.iddataNew)){
                  formvalues[i]?.ProductArrayData.push(this.iddataNew)
                  // console.log('check',formvalues[i]?.ProductArrayData)
                }
                
                // array.push(this.iddataNew)
                // formvalues[i].patchValue({
                //   ProductArrayData:array
                // })
              }
              if(formvalues[i]?.ProductArrayAsset.length){
                let array=this.getAssestArray(formvalues[i].ProductArrayData)
                formvalues[i].ProductArrayAsset=array
              }
              
              //for checking purpose getting delivery details data in array if same delivery details then product delivery details is updated
              this.ccbspatchpo = this.POForm.value.podetails[
                i
              ].delivery_details.map((x) => x.ccbs);
              console.log("data check ccbspatchpo", this.ccbspatchpo);
              let variaccbs = this.ccbspatchpo;
              console.log("variaccbs", variaccbs);
              //if same commodity and same product and same delivery details then delivery details is updated in this portion else pushes the new delivery details with calculation of qty and unit price and total amount
              for (let z in variaccbs) {
                if (this.ccbspatchpo[z] === data.id) {
                  this.notification.showInfo("Product Quantity Updated");
                  console.log("ccbs for index in array ", data.id);
                  let indexvalueofccbs = variaccbs.indexOf(data.id);
                  console.log("indexvalueofccbs", indexvalueofccbs);

                  formvalues[i].delivery_details[indexvalueofccbs].qty =
                    +qtyvalues;
                  let qty: FormControl = new FormControl(null);
                  let amount: FormControl = new FormControl(null);
                  let unitprice: FormControl = new FormControl(null);
                  let totalamount: FormControl = new FormControl(null);
                  let discount: FormControl = new FormControl(0);
                  // let poneed :FormControl = new FormControl(null);
                  this.qtypatchpo = this.POForm.value.podetails[
                    i
                  ].delivery_details.map((x) => x.qty);
                  console.log("data check qtypatchpo", this.qtypatchpo);
                  this.totalqtydetails = this.qtypatchpo.reduce(
                    (a, b) => a + b,
                    0
                  );
                  this.POForm.get("podetails")
                    ["controls"][i].get("qty")
                    .setValue(this.totalqtydetails);
                  this.calcTotalpatch(unitprice, qty, amount, totalamount);
                  unitprice.valueChanges
                    .pipe(debounceTime(20))
                    .subscribe((value) => {
                      console.log("should be called first");
                      this.calcTotalpatch(unitprice, qty, amount, totalamount);
                      if (!this.POForm.valid) {
                        return;
                      }
                      this.linesChange.emit(this.POForm.value["podetails"]);
                    });
                  qty.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
                    console.log("should be called first");
                    this.calcTotalpatch(unitprice, qty, amount, totalamount);
                    if (!this.POForm.valid) {
                      return;
                    }
                    this.linesChange.emit(this.POForm.value["podetails"]);
                  });

                  return;
                }
              }
              //if not same delivery details in same product pushes the new delivery details in same product delivery details
              let ccbsqty: FormControl = new FormControl("");
              let prdetails_id: FormControl = new FormControl("");
              let commodity_id: FormControl = new FormControl("");
              let prccbs_id: FormControl = new FormControl("");
              let ccbs: FormControl = new FormControl("");
              let bs: FormControl = new FormControl("");
              let cc: FormControl = new FormControl("");
              let prccbs_remaining_qty_Value: FormControl = new FormControl("");
              let location: FormControl = new FormControl("");
              let product_id: FormControl = new FormControl("");
              let item: FormControl = new FormControl("");
              let product_name: FormControl = new FormControl("");
              let product_type: FormControl = new FormControl("");
              let product_type_name: FormControl = new FormControl("");              
              let quotation_no: FormControl = new FormControl(0);
              let quot_detailsid: FormControl = new FormControl(0);
              let quotationid: FormControl = new FormControl(0);
              let related_component_id = new FormControl(0);
              let related_component_name = new FormControl("");
              
              
              let item_name: FormControl = new FormControl("");
              let model_id: FormControl = new FormControl("");
              let model_name: FormControl = new FormControl("");
              let specification: FormControl = new FormControl("");
              let uom: FormControl = new FormControl("");
              let qty: FormControl = new FormControl(null);
              let amount: FormControl = new FormControl(null);
              let unitprice: FormControl = new FormControl(null);
              let totalamount: FormControl = new FormControl(null);
              let discount: FormControl = new FormControl(0);
              // console.log("dataassspo",data)
              product_id.setValue(data.prdetails.product_id);
              item.setValue(data.prdetails.item);
              product_name.setValue(data.prdetails.product_name);
              quotation_no.setValue(this.quotation_no);
              product_type.setValue(this.product_type);
              quot_detailsid.setValue(this.quot_detailsid);
              quotationid.setValue(this.quotationid);
              related_component_id.setValue(0);
              related_component_name.setValue("");

              product_type_name.setValue(this.product_type_name);

              
              item_name.setValue(data.prdetails.item_name);
              model_id.setValue(data.prdetails.model_id);
              model_name.setValue(data.prdetails.model_name);
              specification.setValue(data.prdetails.specification);
              uom.setValue(data.prdetails.uom);
              ccbsqty.setValue(data.qty);
              prdetails_id.setValue(data.prdetails.id);
              commodity_id.setValue(data.prdetails.prheader_id.commodity_id.id);
              prccbs_id.setValue(data.id);
              ccbs.setValue(data.id);
              bs.setValue(data.bs);
              cc.setValue(data.cc);
              prccbs_remaining_qty_Value.setValue(
                data.remainingQty - qtyvalues
              );
              location.setValue(data.branch_id.name);
              qty.setValue(+qtyvalues);

              this.POForm.value.podetails[i].delivery_details.push({
                ccbsqty: ccbsqty.value,
                prdetails_id: prdetails_id.value,
                product_id: product_id.value,
                item: item.value,
                product_name: product_name.value,
                product_type: product_type.value,
                product_type_name: product_type_name.value,
               
                item_name: item_name.value,
                model_id: model_id.value,
                model_name: model_name.value,
                specification: specification.value,
                commodity_id: commodity_id.value,
                prccbs_id: prccbs_id.value,
                ccbs: ccbs.value,
                qty: qty.value,
                uom: uom.value,
                bs: bs.value,
                cc: cc.value,
                prccbs_remaining_qty_Value: prccbs_remaining_qty_Value.value,
                location: location.value,
              });
              this.qtypatchpo = this.POForm.value.podetails[
                i
              ].delivery_details.map((x) => x.qty);
              console.log("data check qtypatchpo", this.qtypatchpo);
              this.totalqtydetails = this.qtypatchpo.reduce((a, b) => a + b, 0);
              this.POForm.get("podetails")
                ["controls"][i].get("qty")
                .setValue(this.totalqtydetails);
              //this.POForm.get('podetails')['controls'][i].get('totalamount').setValue(this.POForm.get('podetails')['controls'][i].get('qty') * this.POForm.get('podetails')['controls'][i].get('unitprice'))
              this.calcTotalpatch(unitprice, qty, amount, totalamount);
              unitprice.valueChanges
                .pipe(debounceTime(20))
                .subscribe((value) => {
                  console.log("should be called first");
                  this.calcTotalpatch(unitprice, qty, amount, totalamount);
                  if (!this.POForm.valid) {
                    return;
                  }
                  this.linesChange.emit(this.POForm.value["podetails"]);
                });
              qty.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
                console.log("should be called first");
                this.calcTotalpatch(unitprice, qty, amount, totalamount);
                if (!this.POForm.valid) {
                  return;
                }
                this.linesChange.emit(this.POForm.value["podetails"]);
              });
              this.notification.showInfo("Selected");
              //8199
              this.selectedid = this.iddata;
              let zeroqty = this.delivaryList.map((x) => x.remainingQty);
              let iszero = zeroqty.every((element) => element == 0);
              if (iszero) {
                this.isselected.push(this.selectedid);
              } else {
                this.isselectedpar.push(this.selectedid);
              }
              //8199
              return;
            }
            // this.PRsummarySearch(this.presentpage); //8199
          }

          if (this.type.value == 2) {
            if (this.POForm.value.podetails.length > 0) {
              if (
                this.POForm.value.supplierbranch_id.id !=
                data.prdetails.supplier_id.id
              ) {
                this.notification.showWarning("Choose Same Supplier");
                return false;
              }
            }

            if (formvalues[i].item_name === data.prdetails.item_name) {
              if(formvalues[i]?.ProductArrayData.length){
                let array=formvalues[i]?.ProductArrayData
                if(!formvalues[i]?.ProductArrayData.includes(this.iddataNew)){
                  formvalues[i]?.ProductArrayData.push(this.iddataNew)
                  console.log('check',formvalues[i]?.ProductArrayData)
                }
                
                // array.push(this.iddataNew)
                // formvalues[i].patchValue({
                //   ProductArrayData:array
                // })
              }
              if(formvalues[i]?.ProductArrayAsset.length){
                let array=this.getAssestArray(formvalues[i].ProductArrayData)
                formvalues[i].ProductArrayAsset=array
              }
              
              //for checking purpose getting delivery details data in array if same delivery details then product delivery details is updated
              this.ccbspatchpo = this.POForm.value.podetails[
                i
              ].delivery_details.map((x) => x.ccbs);
              console.log("data check ccbspatchpo", this.ccbspatchpo);
              let variaccbs = this.ccbspatchpo;
              console.log("variaccbs", variaccbs);
              //if same commodity and same product and same delivery details then delivery details is updated in this portion else pushes the new delivery details with calculation of qty and unit price and total amount
              for (let z in variaccbs) {
                if (this.ccbspatchpo[z] === data.id) {
                  this.notification.showInfo("Product Quantity Updated");
                  console.log("ccbs for index in array ", data.id);
                  let indexvalueofccbs = variaccbs.indexOf(data.id);
                  console.log("indexvalueofccbs", indexvalueofccbs);

                  formvalues[i].delivery_details[indexvalueofccbs].qty =
                    +qtyvalues;
                  let qty: FormControl = new FormControl(null);
                  let amount: FormControl = new FormControl(null);
                  let unitprice: FormControl = new FormControl(null);
                  let totalamount: FormControl = new FormControl(null);
                  let discount: FormControl = new FormControl(0);
                  this.qtypatchpo = this.POForm.value.podetails[
                    i
                  ].delivery_details.map((x) => x.qty);
                  console.log("data check qtypatchpo", this.qtypatchpo);
                  this.totalqtydetails = this.qtypatchpo.reduce(
                    (a, b) => a + b,
                    0
                  );
                  this.POForm.get("podetails")
                    ["controls"][i].get("qty")
                    .setValue(this.totalqtydetails);
                  this.calcTotalpatch(unitprice, qty, amount, totalamount);
                  unitprice.valueChanges
                    .pipe(debounceTime(20))
                    .subscribe((value) => {
                      console.log("should be called first");
                      this.calcTotalpatch(unitprice, qty, amount, totalamount);
                      if (!this.POForm.valid) {
                        return;
                      }
                      this.linesChange.emit(this.POForm.value["podetails"]);
                    });
                  qty.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
                    console.log("should be called first");
                    this.calcTotalpatch(unitprice, qty, amount, totalamount);
                    if (!this.POForm.valid) {
                      return;
                    }
                    this.linesChange.emit(this.POForm.value["podetails"]);
                  });

                  return;
                }
              }
              //if not same delivery details in same product pushes the new delivery details in same product delivery details
              let ccbsqty: FormControl = new FormControl("");
              let prdetails_id: FormControl = new FormControl("");
              let commodity_id: FormControl = new FormControl("");
              let prccbs_id: FormControl = new FormControl("");
              let ccbs: FormControl = new FormControl("");
              let bs: FormControl = new FormControl("");
              let cc: FormControl = new FormControl("");
              let prccbs_remaining_qty_Value: FormControl = new FormControl("");
              let location: FormControl = new FormControl("");
              let uom: FormControl = new FormControl("");
              let qty: FormControl = new FormControl(null);
              let amount: FormControl = new FormControl(null);
              let unitprice: FormControl = new FormControl(null);
              let totalamount: FormControl = new FormControl(null);
              let discount: FormControl = new FormControl(0);
              let product_name: FormControl = new FormControl("");
              let product_type: FormControl = new FormControl("");
              let product_type_name: FormControl = new FormControl("");

              
            
              
              let item_name: FormControl = new FormControl("");
              let item: FormControl = new FormControl("");
              let product_id: FormControl = new FormControl("");

              product_id.setValue(data.prdetails.product_id);
              item.setValue("");
              product_name.setValue(data.prdetails.product_name);
              item_name.setValue(data.prdetails.item_name);
              product_type.setValue(this.product_type);
              product_type_name.setValue(this.product_type_name);
            
              uom.setValue(data.prdetails.uom);
              ccbsqty.setValue(data.qty);
              prdetails_id.setValue(data.prdetails.id);
              commodity_id.setValue(data.prdetails.prheader_id.commodity_id.id);
              prccbs_id.setValue(data.id);
              ccbs.setValue(data.id);
              bs.setValue(data.bs);
              cc.setValue(data.cc);
              prccbs_remaining_qty_Value.setValue(
                data.remainingQty - qtyvalues
              );
              location.setValue(data.branch_id.name);
              qty.setValue(+qtyvalues);
              this.POForm.value.podetails[i].delivery_details.push({
                ccbsqty: ccbsqty.value,
                prdetails_id: prdetails_id.value,
                product_id: product_id.value,
                item: item.value,
                product_name: product_name.value,
                product_type: product_type.value,
                product_type_name: product_type_name.value,
              
                item_name: item_name.value,
                commodity_id: commodity_id.value,
                prccbs_id: prccbs_id.value,
                ccbs: ccbs.value,
                qty: qty.value,
                uom: uom.value,
                bs: bs.value,
                cc: cc.value,
                prccbs_remaining_qty_Value: prccbs_remaining_qty_Value.value,
                location: location.value,
              });
              this.qtypatchpo = this.POForm.value.podetails[
                i
              ].delivery_details.map((x) => x.qty);
              console.log("data check qtypatchpo", this.qtypatchpo);
              this.totalqtydetails = this.qtypatchpo.reduce((a, b) => a + b, 0);
              this.POForm.get("podetails")
                ["controls"][i].get("qty")
                .setValue(this.totalqtydetails);
              //this.POForm.get('podetails')['controls'][i].get('totalamount').setValue(this.POForm.get('podetails')['controls'][i].get('qty') * this.POForm.get('podetails')['controls'][i].get('unitprice'))
              this.calcTotalpatch(unitprice, qty, amount, totalamount);
              unitprice.valueChanges
                .pipe(debounceTime(20))
                .subscribe((value) => {
                  console.log("should be called first");
                  this.calcTotalpatch(unitprice, qty, amount, totalamount);
                  if (!this.POForm.valid) {
                    return;
                  }
                  this.linesChange.emit(this.POForm.value["podetails"]);
                });
              qty.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
                console.log("should be called first");
                this.calcTotalpatch(unitprice, qty, amount, totalamount);
                if (!this.POForm.valid) {
                  return;
                }
                this.linesChange.emit(this.POForm.value["podetails"]);
              });
              this.notification.showInfo("Selected");
              //8199
              this.selectedid = this.iddata;
              let zeroqty = this.delivaryList.map((x) => x.remainingQty);
              let iszero = zeroqty.every((element) => element == 0);
              if (iszero) {
                this.isselected.push(this.selectedid);
              } else {
                this.isselectedpar.push(this.selectedid);
              }
              //
              return;
            }
            // this.PRsummarySearch(this.presentpage); //8199
          }
        }
      }
      //if empty it works to push new data in table with qty, total amount and amount

      this.POForm.patchValue({
        commodity_id: data.prdetails.prheader_id.commodity_id.id,
        mepno: data.prdetails.prheader_id.mepno,
      });
      if (data) {
        // if(!this.POForm.value.podetails[i].ProductArrayData?.length){
        //       let datas=[data?.id]
        //       this.POForm.value.podetails[i].patchValue({
        //         ProductArrayData:datas
        //       })
        //     }
        //     console.log('purchase',this.POForm.value.podetails[i])
        if (this.type.value == 1) {
          this.POForm.patchValue({
            supplierbranch_id: data.prdetails.supplier_id,
          });
          this.ShowNonCat = false;
          this.ShowCat = true;
          this.supplierdisable = false;
        }
        if (this.type.value == 2) {
          this.ShowNonCat = true;
          this.ShowCat = false;
          this.POForm.patchValue({
            supplierbranch_id: data.prdetails.supplier_id,
          });
          this.supplierdisable = true;
        }
        // if (this.type.value == 2) {
        if (this.POForm.value.podetails.length > 0) {
          if (
            this.POForm.value.supplierbranch_id.id !=
            data.prdetails.supplier_id.id
          ) {
            this.notification.showWarning("Choose Same Supplier");
            return false;
          }
        }
        // }
        // let buyback_amount: FormControl;

        // if (data.pr_request == 2) {
        //   buyback_amount = new FormControl({ value: 0, disabled: false });
        // } else {
        //   buyback_amount = new FormControl({ value: 0, disabled: true });
        // }
        let buyback_amount:FormControl = new FormControl(0);
        let installationrequired: FormControl = new FormControl("");
        let capitalized: FormControl = new FormControl("");
        let commodity: FormControl = new FormControl("");
        let product_name: FormControl = new FormControl("");
        let product_type: FormControl = new FormControl("");
        let product_type_name: FormControl = new FormControl("");

        
        let quotation_no: FormControl = new FormControl(0);
        let quot_detailsid: FormControl = new FormControl(0);
        let quotationid: FormControl = new FormControl(0);
        let related_component_id = new FormControl(0);
        let related_component_name = new FormControl("");
        let product_idCatlog: FormControl = new FormControl("");
        let itemCatlog: FormControl = new FormControl("");
        let product_id: FormControl = new FormControl("");
        let item: FormControl = new FormControl("");
        let item_name: FormControl = new FormControl("");
        let qty: FormControl = new FormControl(null);
        let uom: FormControl = new FormControl("");
        let amount: FormControl = new FormControl(null);
        let unitprice: FormControl = new FormControl(null);
        let taxamount: FormControl = new FormControl("");
        let amcvalue: FormControl = new FormControl(0);
        let deliveryperiod: FormControl = new FormControl(0);
        let totalamount: FormControl = new FormControl("");
        let discount: FormControl = new FormControl(0);
        let is_asset: FormControl = new FormControl("");
        let file_key: FormControl = new FormControl("");
        let isselectedarray: FormControl = new FormControl(""); //8199
        let isselectedpararray: FormControl = new FormControl("");
        let item_name_replacement = new FormControl(""); //10270
        let model_id: FormControl = new FormControl("");
        let model_name: FormControl = new FormControl("");
        let specification: FormControl = new FormControl("");
        let ccbsqty: FormControl = new FormControl("");
        let prdetails_id: FormControl = new FormControl("");
        let commodity_id: FormControl = new FormControl("");
        let prccbs_id: FormControl = new FormControl("");
        let ccbs: FormControl = new FormControl("");
        let bs: FormControl = new FormControl("");
        let cc: FormControl = new FormControl("");
        let prccbs_remaining_qty_Value: FormControl = new FormControl("");
        let location: FormControl = new FormControl("");
        let ProductArrayData=new FormControl([])
        let ProductArrayAsset=new FormControl([])
        let warrenty: FormControl = new FormControl(0);
        let prheader_id: FormControl = new FormControl({
          value: "",
          disabled: true,
        });

        file_key.setValue("");
        installationrequired.setValue(data.prdetails.installationrequired);
        capitalized.setValue(data.prdetails.capitialized);
        commodity.setValue(data.prdetails.prheader_id.commodity_id.name);

        if (this.type.value == 1) {
          product_idCatlog.setValue(data.prdetails.product_name);
          product_id.setValue(data.prdetails.product_id);
          product_name.setValue(data.prdetails.product_name);
          model_id.setValue(data.prdetails.model_id);
          model_name.setValue(data.prdetails.model_name);
          specification.setValue(data.prdetails.specification);
          quotation_no.setValue(this.quotation_no);
          quot_detailsid.setValue(this.quot_detailsid);
          quotationid.setValue(this.quotationid);
          related_component_id.setValue(0);
          related_component_name.setValue("");
        } else {
          product_idCatlog.setValue("");
          product_name.setValue(data.prdetails.product_name);
          product_id.setValue(data.prdetails.product_id);
          model_id.setValue(0);
          model_name.setValue("");
          specification.setValue("");
        }
        if (data.prdetails.prheader_id.type_id == 1) {
          item.setValue(data.prdetails.item);
          item_name.setValue(data.prdetails.item_name);
          itemCatlog.setValue(data.prdetails.item_name);
        } else {
          item_name.setValue(data.prdetails.item_name);
          item.setValue("");
          itemCatlog.setValue("");
        }
        uom.setValue(data.prdetails.uom);
        taxamount.setValue(0);
        qty.setValue(+qtyvalues);
        // if (this.type.value == 1) {  //Comment for - BUG2421
        //   unitprice.setValue(0)
        // }
        // else {
        // unitprice.setValue(data.prdetails.unitprice.toFixed(2));
      const price = Number(data?.prdetails?.unitprice ?? 0);
const formattedPrice = price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
unitprice.setValue(formattedPrice);


        // }
       
        product_type.setValue(this.product_type);
        product_type_name.setValue(this.product_type_name);

let qtyVal = Number(String(qty.value || '').replace(/,/g, '') || 0);
let unitPriceVal = Number(String(unitprice.value || '').replace(/,/g, '') || 0);

let amountVal = qtyVal * unitPriceVal;
let totalAmount = qtyVal * unitPriceVal;

let poamount = isNaN(amountVal)
  ? '0.00'
  : amountVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

let totalamounts = isNaN(totalAmount)
  ? '0.00'
  : totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
amount.setValue(poamount);
totalamount.setValue(totalamounts);

        is_asset.setValue(data.prdetails.is_asset);
        isselectedarray.setValue(this.isselected); //8199
        isselectedpararray.setValue(this.isselectedpar);
        let value = {};
        if (data.pr_request == 2) {
          value = {
            id: 2,
            text: "Replacement",
          };
        } else {
          value = {
            id: 1,
            text: "New",
          };
        }

        item_name_replacement.setValue(value);
        // warrenty.setValue(data.prdetails.warrenty);
        warrenty.setValue(data?.prdetails?.warrenty || 0);


        ccbsqty.setValue(data.qty);
        prdetails_id.setValue(data.prdetails.id);
        commodity_id.setValue(data.prdetails.prheader_id.commodity_id.id);
        prccbs_id.setValue(data.id);
        ccbs.setValue(data.id);
        bs.setValue(data.bs);
        cc.setValue(data.cc);
        prccbs_remaining_qty_Value.setValue(data.remainingQty - qtyvalues);
        location.setValue(data.branch_id.name);
        prheader_id.setValue(data?.prdetails?.id);
        let prData=[this.iddataNew]
        ProductArrayData.setValue(prData);
        // console.log('line 1')
        let prAsset=await this.getAssestArray(ProductArrayData.value)
        // console.log('line 2')
        ProductArrayAsset.setValue(prAsset)
        ///here new linw items adding 8199
        this.getFormArray().push(
          new FormGroup({
            installationrequired: installationrequired,
            capitalized: capitalized,
            commodity: commodity,
            product_idCatlog: product_idCatlog,
            itemCatlog: itemCatlog,
            product_name: product_name,
            product_type: product_type,
            product_type_name: product_type_name,
            quotation_no: quotation_no,
            quot_detailsid : quot_detailsid,
            quotationid : quotationid,
            related_component_id : related_component_id,
            related_component_name : related_component_name,
            product_id: product_id,
            item_name: item_name,
            item: item,
            model_name: model_name,
            model_id: model_id,
            specification: specification,
            uom: uom,
            qty: qty,
            unitprice: unitprice,
            amount: amount,
            taxamount: taxamount,
            amcvalue: amcvalue,
            deliveryperiod: deliveryperiod,
            totalamount: totalamount,
            discount: discount,
            buyback_amount: buyback_amount,
            is_asset: is_asset,
            prheader_id: prheader_id,
            isselectedarray: isselectedarray, //8199
            item_name_replacement: item_name_replacement,
            warrenty: warrenty,
            ProductArrayData:ProductArrayData,
            ProductArrayAsset:ProductArrayAsset,
            //image: image,
            delivery_details: this.fb.array([
              this.fb.group({
                ccbsqty: ccbsqty,
                prdetails_id: prdetails_id,
                product_id: product_id,
                product_name: product_name,
                item_name: item_name,
                item: item,
                model_id: model_id,
                model_name: model_name,
                specification: specification,
                commodity_id: commodity_id,
                prccbs_id: prccbs_id,
                ccbs: ccbs,
                qty: qty,
                uom: uom,
                bs: bs,
                cc: cc,
                prccbs_remaining_qty_Value: prccbs_remaining_qty_Value,
                location: location,
              }),
            ]),
          })
        );
        console.log(this.getFormArray())
        // this.isselected = [];   //8199
        this.calcTotalpatch(unitprice, qty, amount, totalamount);

        unitprice.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
          console.log("should be called first");
          this.calcTotalpatch(unitprice, qty, amount, totalamount);
          if (!this.POForm.valid) {
            return;
          }
          this.linesChange.emit(this.POForm.value["podetails"]);
        });
        qty.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
          console.log("should be called first");
          this.calcTotalpatch(unitprice, qty, amount, totalamount);
          if (!this.POForm.valid) {
            return;
          }
          this.linesChange.emit(this.POForm.value["podetails"]);
        });

        amcvalue.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
          console.log("should be called first amc", value);
          // this.ChangingAmcAndDelivaryPeriod('amc')
          this.onChangeAMCandDelivaryPeriod(this.POForm.get("podetails"));

          if (!this.POForm.valid) {
            return;
          }
          this.linesChange.emit(this.POForm.value["podetails"]);
        });

        deliveryperiod.valueChanges
          .pipe(debounceTime(20))
          .subscribe((value) => {
            console.log("should be called first delivaryperiod", value);
            // this.ChangingAmcAndDelivaryPeriod('delivaryperiod')

            if (!this.POForm.valid) {
              return;
            }
            this.linesChange.emit(this.POForm.value["podetails"]);
          });

        this.notification.showInfo("Product Selected");
        //8199
        this.selectedid = this.iddata;
        this.poArrayid.push(this.iddata)
        let zeroqty = this.delivaryList.map((x) => x.remainingQty);
        let iszero = zeroqty.every((element) => element == 0);
        if (iszero) {
          this.isselected.push(this.selectedid);
        } else {
          this.isselectedpar.push(this.selectedid);
        }
        ////
        this.type.disable();
        // this.gettingUnitPrice()            // Comment for BUG2421
      }
      // this.PRsummarySearch(this.presentpage); //8199
    } else {
      this.notification.showWarning("Choose same Commmdity");
    }

  }
  // Function to determine button class based on delivery item conditions and popupname
  // getButtonClass(popupname: string, formArray: any[], index: number): string {
  //   const item = this.delivaryList[index];  // Get the specific item based on index

  //   if (!item || item.length === 0) {
  //     return 'btn-primary'; // Default state if no data exists
  // }
  //   const isSelected = formArray.some(formItem => formItem?.value?.isselectedarray?.includes(item.prdetails.id));

  // const allZero = item.every(item => item.remainingQty === 0);
  // const partialZero = item.some(item => item.remainingQty === 0);
  // if (this.activePopup === popupname) {
  //   if (isSelected) {

  // if (allZero) {
  //     return 'btn-danger'; // All remainingQty values are 0
  // } else if (partialZero) {
  //     return 'btn-success'; // Some remainingQty values are 0
  // }
  //   }
  // return 'btn-primary'; // No remainingQty values are 0
  // }
  //   // Return the default button color if the popup isn't active
  //   return 'btn-primary'; // Default color
  // }
  buttonColorState: { [key: number]: string } = {}; // To track color state for each item

  getButtonClass(
    popupname: string,
    deliveryList: any[],
    formArray: any[]
  ): string {
    let buttonClass = "btn-primary"; // Default color

    if (!deliveryList || deliveryList.length === 0) {
      return buttonClass; // Return default color if no deliveryList
    }

    // Loop through the delivery list and check conditions for each item
    for (let i = 0; i < deliveryList.length; i++) {
      const item = deliveryList[i];
      const prDetailsId = item.id;

      // Check if item is selected in the form array based on prdetails.id
      const isSelected = formArray.some((formItem) =>
        formItem.value.isselectedarray.includes(prDetailsId)
      );

      // Determine if the item should have a different color based on its remainingQty
      const allZero = item.remainingQty === 0;
      const partialZero = item.remainingQty > 0 && item.remainingQty < item.qty;

      // Check if the item is in the active popup
      if (this.activePopup === popupname) {
        if (isSelected) {
          // Store the selected color for the item
          if (allZero) {
            // Store the color when remainingQty is 0
            this.buttonColorState[i] = "btn-danger"; // Out of stock
            buttonClass = "btn-danger"; // Update the button color to danger
          } else if (partialZero) {
            // Store the color when remainingQty is partially available
            this.buttonColorState[i] = "btn-success"; // Partially available
            buttonClass = "btn-success"; // Update the button color to success
          } else {
            // Default color for the remaining items
            this.buttonColorState[i] = "btn-primary";
            buttonClass = "btn-primary"; // Default color
          }
        }
      }
    }

    // Return the final button color for the entire array (can be refined based on conditions)
    return buttonClass;
  }

  // buttonColorState: { [key: number]: string } = {};

  //calculation to patch amount
calcTotalpatch(unitprice, qty, amount, totalamount: FormControl) {
  const unitprices = Number(String(unitprice.value || '').replace(/,/g, '') || 0);
  const qtys = Number(String(qty.value || '').replace(/,/g, '') || 0);

  const amt = qtys * unitprices;
  const formattedAmt = amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  amount.setValue(formattedAmt, { emitEvent: false });
  totalamount.setValue(formattedAmt, { emitEvent: false });
  this.amtt = amt;
  this.ttlamt = amt;

  this.datasums();
}

datasums() {
    const amounts = this.POForm.value.podetails.map((x) =>
    Number(String(x.amount || '').replace(/,/g, '') || 0)
  );

  console.log('data check amt', amounts);
  this.sum = amounts.reduce((a, b) => a + b, 0);

  console.log('sum of total', this.sum);
  this.POForm.patchValue({
    amount: this.sum,
  });
}



  arraydata: any;
  ccpopup: any;
  bspopup: any;
  branchpopup: any;
  qtypopup: any;
  namesvaluedel: any;
  modalsboot(group) {
    console.log("index value", group.value.Product_name);
    let names = group.value;
    console.log("popup value", names);
    this.arraydata = names;
    this.namesvaluedel = group.value.delivery_details;
    console.log("popup value namesvaluedel", this.namesvaluedel);
  }

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
              if (this.has_next === true) {
                this.dataService
                  .getbranchFK(
                    this.branchInput.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.branchList = this.branchList.concat(datas);
                      if (this.branchList.length >= 0) {
                        this.has_next = datapagination.has_next;
                        this.has_previous = datapagination.has_previous;
                        this.currentpage = datapagination.index;
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

  // displayFnbranch(branch?: any) {
  //   return branch ? this.branchList.find(_ => _.id === branch).code : undefined;
  // }
  public displayFnbranch(branch?: branchlistss): string | undefined {
    let code = branch ? branch.code : undefined;
    let name = branch ? branch.name : undefined;
    return branch ? code + "-" + name : undefined;
  }

  get branch() {
    return this.POForm.get("branch_id");
  }

  getbranchFK() {
    let branchkeyvalue: String = "";
    // this.getbranchFK(branchkeyvalue);
    this.SpinnerService.show();
    this.dataService.getbranch(branchkeyvalue).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
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

  public displayFnsupplier(supplier?: supplierlistss): string | undefined {
    return supplier ? supplier.name : undefined;
  }

  get supplier() {
    return this.POForm.get("supplierbranch_id");
  }

  public displayFnterms(terms?: termslistss): string | undefined {
    return terms ? terms.name : undefined;
  }
  getTermsValue() {
    this.gettermsFK("");
    this.producttermsForm
      .get("name")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("Fetching terms...");
        }),
        switchMap((value) =>
          this.dataService.gettermsFK(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe(
        (results: any[]) => {
          this.termlist = results["data"]; // Ensure list is updated
          console.log("Updated termlist:", this.termlist);
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
  }

  gettermsFK(termskeyvalue) {
    // if (!this.termsList) {
      this.SpinnerService.show();
      this.dataService.geteermslist(termskeyvalue).subscribe(
        (results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.termlist = datas;
          console.log("termsList", datas);
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    // }
  }

  IsProductTab = false;
  IsServiceTab = false;
  IsCreateTab = false;
  typeList: any[] = [
    { display: "Product", value: "P" },
    { display: "Service", value: "S" },
  ];
  ServiceTermList: any;
  ProductTermList: any;

  // productTab(){

  // }
  producttermslistproduct: any;
  productForm: FormGroup;
  totalcount_pro: any;
  has_next_pro: boolean = false;
  has_previous_pro: boolean = false;
  presentpage_pro: number = 1;
  productTab(page) {
    this.IsProductTab = true;
    this.IsServiceTab = false;
    this.IsCreateTab = false;
    let data = this.productForm.value;
    if (data.desc == "" || data.desc == null || data.desc == undefined) {
      // this.notification.showWarning("Enter Product Term!");
      this.productForm.value.desc = "";
      // return false;
    }
    if (data.type == "" || data.type == null || data.type == undefined) {
      this.productForm.value.type = "";
    }
    this.SpinnerService.show();
    this.dataService.getproducttermsList(data, page).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.producttermslistproduct = datas;
        console.log("producttermslistproduct", this.producttermslistproduct);
        let datapagination = results["pagination"];
        this.totalcount_pro = results["total_count"];
        if (this.producttermslistproduct.length > 0) {
          this.has_next_pro = datapagination.has_next;
          this.has_previous_pro = datapagination.has_previous;
          this.presentpage_pro = datapagination.index;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  resetProc() {
    this.productForm.reset();
    this.productTab(1);
  }
  resetSer() {
    this.serviceForm.reset();
    this.serviceTab(1);
  }
  servicetermslist;
  totalcountSer: any;
  presentpage_ser: number = 1;
  serviceTab(page) {
    this.IsProductTab = false;
    this.IsServiceTab = true;
    this.IsCreateTab = false;
    let data = this.serviceForm.value;
    // if(data.desc == "" || data.desc == null || data.desc == undefined){
    //   this.notification.showWarning("Enter Service Term!");
    //   return false;
    // }
    if (data.desc == "" || data.desc == null || data.desc == undefined) {
      // this.notification.showWarning("Enter Product Term!");
      this.productForm.value.desc = "";
      // return false;
    }
    if (data.type == "" || data.type == null || data.type == undefined) {
      this.productForm.value.type = "";
    }
    this.SpinnerService.show();
    this.dataService.getservicetermsList(data, page).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.servicetermslist = datas;
        console.log("servicelist", this.servicetermslist);
        let datapagination = results["pagination"];
        this.totalcountSer = results["total_count"];
        if (this.servicetermslist.length > 0) {
          this.has_next_ser = datapagination.has_next;
          this.has_previous_ser = datapagination.has_previous;
          this.presentpage_ser = datapagination.index;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  createTab() {
    this.IsProductTab = false;
    this.IsServiceTab = false;
    this.IsCreateTab = true;
  }
  isUpdate: boolean = false;
  groupForm: FormGroup;
  termscreateSubmit() {
    let data: any = this.TermsForm.value;
    if (data?.id == undefined || data?.id == "" || data?.id == null) {
      delete data.id;
    }
    if (data.type == undefined || data.type == "" || data.type == null) {
      this.notification.showWarning("Please Fill Type of Term");
      return false;
    }
    if (data.desc == undefined || data.desc == "" || data.desc == null) {
      this.notification.showWarning("Please Fill Description");
      return false;
    }
    let msg = data?.id ? "Term Updated!" : "New Term Added!";
    this.SpinnerService.show();
    this.dataService.POTermsCreateForm(data).subscribe(
      (res) => {
        this.SpinnerService.hide();
        if(res['code'] == "Duplicate Name"){
          this.notification.showWarning(res['description']);
        } else {
        this.notification.showSuccess(msg);
        }
        this.TermsForm.reset();
        this.getTerms(1);
        this.isUpdate = false;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  GroupSubmit() {}
  checkboxlistid: any[] = [];

  productCheckBoxvalue(listItem, event) {
    if (event.checked == true) {
      this.checkboxlistid.push(listItem.id);
      console.log("checkboxlistid", this.checkboxlistid);
    } else {
      const index = this.checkboxlistid.indexOf(listItem.id);
      this.checkboxlistid.splice(index, 1);
      console.log("checkboxlistid", this.checkboxlistid);
    }
  }

  scheckboxlistid: any[] = [];

  serviceCheckBoxvalue(listItem, event) {
    if (event.checked == true) {
      this.scheckboxlistid.push(listItem.id);
      console.log("scheckboxlistid", this.scheckboxlistid);
    } else {
      const index = this.scheckboxlistid.indexOf(listItem.id);
      this.scheckboxlistid.splice(index, 1);
      console.log("scheckboxlistid", this.scheckboxlistid);
    }
  }

  servicetermsFormSubmit() {
    let data: any = this.servicetermsForm.value;
    let suplierid = this.POForm.value.supplierbranch_id.id;
    let text = "";

    data.supplierbranch_id = suplierid;
    data.potermstemplate = this.scheckboxlistid;
    if (suplierid == undefined || suplierid == "" || suplierid == null) {
      this.notification.showWarning("Choose Supplier");
      return false;
    }

    let TermServiceName = this.servicetermsForm.value.name;
    if (
      TermServiceName == undefined ||
      TermServiceName == "" ||
      TermServiceName == null
    ) {
      this.notification.showWarning("Please Fill Service Term Name");
      return false;
    }
    let selectedTerms = this.scheckboxlistid;
    if (selectedTerms.length == 0) {
      this.notification.showWarning("Please Select Atleast One Term ");
      return false;
    }

    let dataterms = {
      name: this.servicetermsForm.value.name,
      supplier_id: suplierid,
      text: "",
      potermstemplate: this.scheckboxlistid,
    };

    data.text = text;
    this.SpinnerService.show();
    this.dataService.POproductserviceCreateForm(dataterms).subscribe(
      (res) => {
        this.SpinnerService.hide();
        this.notification.showSuccess("New Service term added!...");
        let key = "";
        this.gettermsFK(key);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  producttermsFormSubmit() {
    let data: any = this.producttermsForm.value;
    let suplierid = this.POForm.value.supplierbranch_id.id;
    let text = "";

    data.supplierbranch_id = suplierid;
    data.text = text;
    data.potermstemplate = this.checkboxlistid;
    if (suplierid == undefined || suplierid == "" || suplierid == null) {
      this.notification.showWarning("Choose Supplier");
      return false;
    }
    let TermProductName = this.producttermsForm.value.name;
    if (
      TermProductName == undefined ||
      TermProductName == "" ||
      TermProductName == null
    ) {
      this.notification.showWarning("Enter List Name!");
      return false;
    }
    let selectedTerms = this.checkboxlistid;
    if (selectedTerms.length == 0) {
      this.notification.showWarning("Please Select Atleast One Term");
      return false;
    }
    let val = this.producttermsForm.value.name;
    let id = this.producttermsForm.value.id;
    if (typeof val == "object") {
      val = this.producttermsForm.value.name.name;
    } 
    if(val == undefined || val == "" || val == null){
      val = this.producttermsForm.value.name;
    }
    this.checkboxlistid = [...new Set(this.checkboxlistid.filter((x) => x))];
    let dataterms = {
      name: val,
      supplier_id: suplierid,
      text: "",
      potermstemplate: this.checkboxlistid,
      id: id
    };
    if (id == undefined || id == "" || id == null) {
      delete dataterms.id;
    }
    this.SpinnerService.show();
    this.dataService.POproductserviceCreateForm(dataterms).subscribe(
      (res) => {
        let msg = this.showLists ? "List Updated!" : "New List Added!";
        this.SpinnerService.hide();
        if (res["code"] == "Duplicate Name") {
          this.notification.showWarning(res["description"]);
        } else {
          this.notification.showSuccess(msg);
        }
          this.producttermsForm.reset();
          this.checkboxlistid = [];
          this.scheckboxlistid = [];
          this.showLists = false;
          let key = "";
          this.gettermsFK(key);
          this.productTab(1);
          this.serviceTab(1);
        
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  producttermslist: any;
  termsmodal() {
    let termid = this.POForm.value.terms_id.id;
    if (termid == "" || termid == null || termid == undefined) {
      this.notification.showWarning("Please choose the Terms");
      return false;
    }
    this.SpinnerService.show();
    this.dataService.gettermsget(termid).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.producttermslist = datas;
        console.log("aa", this.producttermslist);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  termsmodalList() {
    let termid = this.producttermsForm.value.name.id;
    if (termid == "" || termid == null || termid == undefined) {
      this.notification.showWarning("Please choose the Terms");
      return false;
    }
    this.SpinnerService.show();
    this.dataService.gettermsget(termid).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.producttermslist = datas;
        console.log("aa", this.producttermslist);

        let ids = this.producttermslist
        .map((x) => x.potermstemplate_id?.id) // Extract IDs, even if some entries might not have 'potermstemplate_id'
        .filter((id) => id !== undefined); // Remove any undefined values
      

        // let ids = this.producttermslist
        // .filter((x) => x.potermstemplate_id?.id)
        // .map((x) => x.potermstemplate_id.id);  // Extracting only the ID values
                if(this.showLists){ 
          this.scheckboxlistid.push(...ids)
          this.checkboxlistid.push(...ids)
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  updatePodetailsDiscountStatus() {
    let podetailsArray = this.POForm.value.podetails;
    for (let i = 0; i < podetailsArray.length; i++) {
      // let discountValue = podetailsArray[i].discount;
      // podetailsArray[i].is_discount = discountValue ? discountValue : 0;
      if (!("buyback_amount" in podetailsArray[i])) {
        podetailsArray[i].buyback_amount = 0;
      }
    }
  }
  //   updatePodetailsDiscountStatus() {
  //     const podetailsArray = this.POForm.get('podetails') as FormArray;
  //     podetailsArray.controls.forEach((group: FormGroup) => {
  //     const discountValue = group.get('discount')?.value;
  //     group.patchValue({
  //       is_discount: discountValue ? true : false
  //     });
  //   });
  // }
  MainPoSubmit(){
    if (
      this.POForm.value.supplierbranch_id == "" ||
      this.POForm.value.supplierbranch_id == null ||
      this.POForm.value.supplierbranch_id == undefined
    ) {
      this.notification.showWarning("Choose Supplier");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validfrom == "" ||
      this.POForm.value.validfrom == null ||
      this.POForm.value.validfrom == undefined
    ) {
      this.notification.showWarning("Please provide a 'From Date'.");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validto == "" ||
      this.POForm.value.validto == null ||
      this.POForm.value.validto == undefined
    ) {
      this.notification.showWarning("Please provide a 'To Date'.");
      this.clicked = false;
      return false;
    }
    if( this.notepadfn == true){
    if (
      this.POForm.value.terms_id == "" ||
      this.POForm.value.terms_id == null ||
      this.POForm.value.terms_id == undefined
    ) {
      this.notification.showWarning("Choose Terms And Conditions");
      this.clicked = false;
      return false;
    }
  }
    if (
      this.POForm.value.branch_id == "" ||
      this.POForm.value.branch_id == null ||
      this.POForm.value.branch_id == undefined
    ) {
      this.notification.showWarning("Choose Branch ");
      this.clicked = false;
      return false;
    }
    if (
      this.POForm.value.employee_id == "" ||
      this.POForm.value.employee_id == null ||
      this.POForm.value.employee_id == undefined
    ) {
      this.notification.showWarning("Choose Approver");
      this.clicked = false;
      return false;
    }
    let checkarray=[]
    console.log(this.POForm.value)
    for(let i in this.POForm.get('podetails').value){
      if(!this.POForm.get('podetails').value[i].buyback_amount && this.POForm.get('podetails').value[i].item_name_replacement?.id==2){
        // checkarray.push('line'+Number(i)+1)
        checkarray.push((+i)+(1)) //+i will change string into integer number
        

      }
    }
    console.log('checkarray==>',checkarray)
    if(checkarray.length){
      this.BuyBackTrigger.nativeElement.click()
      this.GlobalCheckArray=checkarray
    }
    else{
      this.POSubmit()
    }
  }
  POSubmit() {
    
 
    if (
      this.POForm.value.supplierbranch_id == "" ||
      this.POForm.value.supplierbranch_id == null ||
      this.POForm.value.supplierbranch_id == undefined
    ) {
      this.notification.showWarning("Choose Supplier");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validfrom == "" ||
      this.POForm.value.validfrom == null ||
      this.POForm.value.validfrom == undefined
    ) {
      this.notification.showWarning("Please provide a 'From Date'.");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validto == "" ||
      this.POForm.value.validto == null ||
      this.POForm.value.validto == undefined
    ) {
      this.notification.showWarning("Please provide a 'To Date'.");
      this.clicked = false;
      return false;
    }
if( this.notepadfn == true){
    if (
      this.POForm.value.terms_id == "" ||
      this.POForm.value.terms_id == null ||
      this.POForm.value.terms_id == undefined
    ) {
      this.notification.showWarning("Choose Terms And Conditions");
      this.clicked = false;
      return false;
    }
  }
    if (
      this.POForm.value.branch_id == "" ||
      this.POForm.value.branch_id == null ||
      this.POForm.value.branch_id == undefined
    ) {
      this.notification.showWarning("Choose Branch ");
      this.clicked = false;
      return false;
    }
    // if (
    //   this.POForm.value.warrenty == "" ||
    //   this.POForm.value.warrenty == null ||
    //   this.POForm.value.warrenty == undefined
    // ) {
    //   this.notification.showWarning("Please Fill Warrenty");
    //   this.clicked = false;
    //   return false;
    // }
    if (
      this.POForm.value.employee_id == "" ||
      this.POForm.value.employee_id == null ||
      this.POForm.value.employee_id == undefined
    ) {
      this.notification.showWarning("Choose Approver");
      this.clicked = false;
      return false;
    }

    // let totalDaysCheck =
    //   this.POForm.value.onacceptance +
    //   this.POForm.value.ondelivery +
    //   this.POForm.value.oninstallation;
    // if (totalDaysCheck != 100) {
    //   this.notification.showWarning(
    //     "Days for On Acceptance, On Delivery, On Installation Must be equal to 100"
    //   );
    //   this.clicked = false;
    //   return false;
    // }
    if (
      this.POForm.value.onacceptance == undefined ||
      this.POForm.value.onacceptance == "" ||
      this.POForm.value.onacceptance == null
    ) {
      this.POForm.value.onacceptance = 0;
    }
    if (
      this.POForm.value.ondelivery == null ||
      this.POForm.value.ondelivery == "" ||
      this.POForm.value.ondelivery == undefined
    ) {
      this.POForm.value.ondelivery = 0;
    }
    if (
      this.POForm.value.oninstallation == null ||
      this.POForm.value.oninstallation == "" ||
      this.POForm.value.oninstallation == undefined
    ) {
      this.POForm.value.oninstallation = 0;
    }

    this.updatePodetailsDiscountStatus();
    let datadetails = this.POForm.value.podetails;
    console.log("datadetails", datadetails);
    let filesvaluedetail = this.files.value.file_upload;
    for (let i in datadetails) {
      let amcdata = datadetails[i].amcvalue;
      let delivaryperiod = datadetails[i].deliveryperiod;
      let disc = datadetails[i]?.discount;

      // datadetails[i].product_name = datadetails[i].product_idCatlog
      // datadetails[i].item_name = datadetails[i].itemCatlog
      let indexNumber = Number(i);
      if (amcdata == "" || amcdata == undefined) {
        // this.notification.showWarning("AMC% is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
        datadetails[i].amcvalue = 0;
      }
      if (delivaryperiod == "" || delivaryperiod == undefined) {
        datadetails[i].deliveryperiod = 0;
        // this.notification.showWarning("Delivery Period is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
      }
      if (disc == "" || disc == undefined || disc == null) {
        datadetails[i].discount = 0;
        // this.notification.showWarning("Delivery Period is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
      }
    }
    if (this.POForm.value.supplierbranch_id.id == undefined) {
      this.POForm.value.supplierbranch_id = this.POForm.value.supplierbranch_id;
    } else {
      this.POForm.value.supplierbranch_id =
        this.POForm.value.supplierbranch_id.id;
    }
    if (this.POForm.value.branch_id.id == undefined) {
      this.POForm.value.branch_id = this.POForm.value.branch_id;
    } else {
      this.POForm.value.branch_id = this.POForm.value.branch_id.id;
    }
    if (this.POForm.value.employee_id.id == undefined) {
      this.POForm.value.employee_id = this.POForm.value.employee_id;
    } else {
      this.POForm.value.employee_id = this.POForm.value.employee_id.id;
    }
    if (this.POForm.value?.terms_id == undefined) {
      this.POForm.value.terms_id = "";
    } else {
      this.POForm.value.terms_id = this.POForm.value.terms_id?.id ?? this.POForm.value.terms_id;
    }
    // this.POForm.value.supplierbranch_id = this.POForm.value.supplierbranch_id.id
    // this.POForm.value.branch_id = this.POForm.value.branch_id.id
    // this.POForm.value.employee_id = this.POForm.value.employee_id.id
    // this.POForm.value.terms_id = this.POForm.value.terms_id.id
    // const currentDate = this.POForm.value.validfrom
    // let validfrom = this.datePipe.transform(currentDate.date, 'yyyy-MM-dd');
    this.POForm.value.validfrom = this.datePipe.transform(
      this.POForm.value.validfrom,
      "yyyy-MM-dd"
    );
    this.POForm.value.validto = this.datePipe.transform(
      this.POForm.value.validto,
      "yyyy-MM-dd"
    );
    for(let data of this.POForm.get('podetails').value){
      data.amount=typeof(data?.amount)=='string'?parseFloat(data?.amount?.replace(/,/g,'')):data?.amount
      data.totalamount=typeof(data?.totalamount)=='string'?parseFloat(data?.totalamount?.replace(/,/g,'')):data?.totalamount
      data.unitprice=typeof(data?.unitprice)=='string'?parseFloat(data?.unitprice?.replace(/,/g,'')):data?.unitprice
      data.buyback_amount=typeof(data?.buyback_amount)=='string'?parseFloat(data?.buyback_amount?.replace(/,/g,'')):data?.buyback_amount
      data.discount=typeof(data?.discount)=='string'?parseFloat(data?.discount?.replace(/,/g,'')):data?.discount
      if(data?.item_name_replacement?.id==2){
        for(let assetdata of data?.ProductArrayAsset){
          assetdata.status=1
          assetdata.amount=typeof(assetdata.amount)=='string'?parseFloat(assetdata.amount?.replace(/,/g,'')):assetdata.amount
          if(assetdata.hasOwnProperty('prdetail_id')){
            assetdata.prdetails_id=assetdata?.prdetail_id
            delete assetdata.prdetail_id;
          }
        }
        let assestDict={
          pr_request:2,
          asset:data?.ProductArrayAsset
        }
        data.pr_request=assestDict
      }
      if(data.hasOwnProperty('ProductArrayData')){
        delete data.ProductArrayData
      }
      if(data.hasOwnProperty('ProductArrayAsset')){
        delete data.ProductArrayAsset
      }
    }
    console.log('POFORM',this.POForm.get('podetails').value)
    let data = this.POForm.value;
    let dataID = Object.assign({}, data, { type: this.type.value });
    let filesvalue = this.files.value.file_upload;
    let filesHeadervalue = this.filesHeader.value.file_upload;
    this.formDataChange(dataID);
  }

  onCancelClick() {
    this.onCancel.emit();
  }

  ScrollTopFunction() {
    window.scrollTo(0, 0);
  }

  pdfSrc = "";

  // onFileSelected(e, j) {
  //   let datavalue = this.files.value.file_upload
  //   if (this.files.value.file_upload.length > j) {
  //     this.files.value.file_upload[j] = e.target.files[0]
  //   } else {
  //     for (var i = 0; i < e.target.files.length; i++) {
  //       // this.fileUpload.push(e.target.files[i]);
  //       this.files.value.file_upload.push(e.target.files[i])
  //       let checkvalue = this.files.value.file_upload
  //       console.log("checkvalue", checkvalue)
  //     }
  //   }
  //   console.log("this.files.value.file_upload", this.files.value.file_upload)
  // }

  autocompleteempScroll() {
    // setTimeout(() => {
    //   if (
    //     this.matempAutocomplete &&
    //     this.autocompleteTrigger &&
    //     this.matempAutocomplete.panel
    //   ) {
    //     fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_next === true) {
    //             this.dataService.getemployeeFKdd(this.empInput.nativeElement.value, this.currentpage + 1)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.employeeList = this.employeeList.concat(datas);
    //                 // console.log("emp", datas)
    //                 if (this.employeeList.length >= 0) {
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

  public displayFnemp(emp?: Emplistss): string | undefined {
    // console.log('id', emp.id);
    // console.log('full_name', emp.full_name);
    return emp ? emp.full_name : undefined;
  }

  get emp() {
    return this.POForm.get("employee_id");
  }
  getemployeeForApprover() {
    let commodityID = this.POForm.value.commodity_id;
    console.log("commodityID", commodityID);
    if (commodityID === "") {
      this.notification.showInfo(
        "Please Select the Product to choose the Approver"
      );
      return false;
    }
    this.SpinnerService.show();
    this.dataService.getemployeeApproverforPO(commodityID).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
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

  //unit price of product according to the supplier
  gettingUnitPrice() {
    let supplieridvalue = this.POForm.value.supplierbranch_id.id;

    let productidvalue = this.POForm.value.podetails;

    if (this.type.value == 2) {
      // this.notification.showInfo("Please Select the Product")
      return false;
    }
    for (let i in productidvalue) {
      console.log("productidvalue", productidvalue);
      let productID = productidvalue[i].product_id;
      let catlogName = productidvalue[i].item;

      console.log("productID", productID);

      console.log("catlogName", catlogName);

      this.SpinnerService.show();
      // this.dataService.getunitPrice(productID, supplieridvalue, catlogName)
      // bug id:9803
      this.dataService
        .getunitPrice(this.prnodata, productID, supplieridvalue)
        .subscribe(
          (results) => {
            this.SpinnerService.hide();
            let datas = results;
            console.log("unit price", datas);
            //this.POForm.value.podetails[i].unitprice.setValue(datas.unitprice)
            this.POForm.get("podetails")
              ["controls"][i].get("unitprice")
              .setValue(datas.unitprice);
          },
          (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        );

      //return
    }
  }
  //getting product to get the supplier
  gettingProductforSuplier() {
    let productdatainArray = this.POForm.value.podetails.map(
      (x) => x.product_id
    );
    let itemdatainArray = this.POForm.value.podetails.map((x) => x.itemCatlog);
    let stringValue = "";
    if (stringValue in productdatainArray) {
      return false;
    }
    if (productdatainArray.length == 0) {
      this.supplierList = [];
      this.notification.showInfo(
        "Please Select the Product to choose the Supplier"
      );
      return false;
    }
    let ProductForSupplierGet = {
      product: productdatainArray,
      dts: 0,
      catalog: itemdatainArray,
    };
    console.log("supplierbranch_id", this.POForm.value.supplierbranch_id);

    this.POForm.get("supplierbranch_id")
      .valueChanges.pipe(debounceTime(20))
      .subscribe((value) => {
        console.log("Hitted");
        this.SpinnerService.show();
        this.dataService
          .getsupplierProductmapping(ProductForSupplierGet, value)
          .subscribe(
            (results: any[]) => {
              let datas = results["data"];
              this.SpinnerService.hide();
              this.supplierList = datas;
              console.log("supplierList", datas);
            },
            (error) => {
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            }
          );
      });
    // console.log("ProductForSupplierGet", ProductForSupplierGet)
  }

  disablebutton = [true, true, true, true, true, true, true, true, true, true];
  eneblecheckbox(i, data) {
    this.qty.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
      console.log("should be called first");
      console.log("iiii index value for PO", i);
      this.disablebutton[i] = false;
    });
  }
  activeEditor: HTMLElement | null = null;
  editorDisabled = false;

  // Configuration for Summernote

 config: any = {
  airMode: false,
  tabDisable: true,
  height: 200,
  toolbar: [
    ["misc", ["codeview", "undo", "redo", "customTable"]],
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
    ["para", ["ul", "ol", "paragraph", "height"]],
    ["insert", ["picture", "link", "video", "hr"]],
    ["table", ["table"]],
  ],
  popover: {
    image: [
      ["image", ["resizeFull", "resizeHalf", "resizeQuarter", "resizeNone"]],
      ["float", ["floatLeft", "floatRight", "floatNone"]],
      ["remove", ["removeMedia"]],
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
  buttons: {
    customTable: function (context) {
      const ui = ($ as any).summernote.ui;
      return ui
        .button({
          contents: '<i class="note-icon-table"/> Table',
          tooltip: "Insert a 3x3 Table",
          click: function () {
            context.invoke("editor.focus"); // ensure editor is active

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

            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(table);
              range.collapse(false);
            } else {
              console.warn("No selection range found. Table inserted at end.");
              context.invoke("editor.insertNode", table);
            }
          },
        })
        .render();
    },
  },
  callbacks: {
    onInit: function () {
      const editor = document.querySelector(".note-editable");
      if (editor) {
        editor.addEventListener("input", function () {
          const tables = Array.from(
            (editor as HTMLElement).getElementsByTagName("table")
          );
          tables.forEach((table) => {
            const htmlTable = table as HTMLTableElement;
            htmlTable.style.borderCollapse = "collapse";
            htmlTable.style.width = "100%";
            htmlTable.style.textAlign = "left";

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

  config1: any = {
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
  config3: any = {
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
    onChange: (contents: string) => {
      this.POForm.get('terms_text')?.setValue(contents, { emitEvent: true });
      if(contents==='<br>' || contents===''||contents==='<p><br></p>'){
 this.toggleDisabled = false;
  this.togglekey = false;
      }else{
        this.togglekey = true;
      }
    }
  }
  };
  termsConfig: any = {
  height: 200,
  toolbar: [
    ['style', ['bold', 'italic', 'underline']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['insert', ['link', 'picture']]
  ],
  callbacks: {
    onChange: (contents: string) => {
      this.POForm.get('terms_text')?.setValue(contents, { emitEvent: true });
    }
  }
};
  // editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.POForm.get("notepad").value
    );
  }

  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  // Placeholder functions for other events
  onBlur() {
    console.log("Editor blurred");
  }

  onDelete(event: any) {
    console.log("Media deleted:", event);
  }

  summernoteInit(event) {
    // console.log(event);
  }

  omit_special_num(event) {
    var k;
    k = event.charCode;
    return k == 190 || (k >= 48 && k <= 57) || k == 46; //6556
    // return ((k == 190) || (k >= 48 && k <= 57));
  }

  only_numalpha(event) {
    var k;
    k = event.charCode;
    return (k > 96 && k < 123) || (k >= 48 && k <= 57);
    // return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  only_char(event) {
    var a;
    a = event.which;
    if ((a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }

  getCatlog_NonCatlogList: any;
  getCatlog_NonCatlog() {
    this.SpinnerService.show();
    this.dataService.getCatlog_NonCatlog().subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.getCatlog_NonCatlogList = datas;
        console.log("getCatlog_NonCatlog", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  onFileSelectedHeader(e) {
    let datavalue = this.filesHeader.value.file_upload;
    // this.filesHeader.value.file_upload.push(e.target.files)
    // let checkvalue = this.filesHeader.value.file_upload
    // console.log("checkvalue", checkvalue)
    for (var i = 0; i < e.target.files.length; i++) {
      // this.fileUpload.push(e.target.files[i]);
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

  employeeCode: any;
  employeeLimit: any;
  empValues(data) {
    this.employeeCode = data.code;
    this.employeeLimit = data.limit;
  }

  public displayFncommodity(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }
  getCommodityFK() {
    this.SpinnerService.show();
    this.dataService.getcommoditydd().subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
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
                this.dataService
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

  currentpagesupplier = 1;
  has_nextsupplier = true;
  has_previoussupplier = true;
  autocompletesuppliersearchScroll() {
    setTimeout(() => {
      if (
        this.matsuppliersearchAutocomplete &&
        this.autocompleteTrigger &&
        this.matsuppliersearchAutocomplete.panel
      ) {
        fromEvent(
          this.matsuppliersearchAutocomplete.panel.nativeElement,
          "scroll"
        )
          .pipe(
            map(
              (x) =>
                this.matsuppliersearchAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matsuppliersearchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matsuppliersearchAutocomplete.panel.nativeElement
                .scrollHeight;
            const elementHeight =
              this.matsuppliersearchAutocomplete.panel.nativeElement
                .clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsupplier === true) {
                this.dataService
                  .getsupplierDD(
                    this.suppliersearchInput.nativeElement.value,
                    this.currentpagesupplier + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.suppliersearchList =
                        this.suppliersearchList.concat(datas);
                      if (this.suppliersearchList.length >= 0) {
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

  public displayFnsuppliersearch(
    supplier?: supplierlistsearch
  ): any | undefined {
    return supplier ? supplier.name : undefined;
  }

  getSuppliersearch() {
    this.SpinnerService.show();
    this.dataService.getsupplierDD("",1).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.suppliersearchList = datas;
        console.log("suppliersearchList", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  FileDataArray = [];
  FileDataArrayIndex = [];
  onFileSelected(e, j) {
    let datavalue = this.files.value.file_upload;
    this.FileDataArray[j] = e.target.files[0];
    this.FileDataArrayIndex[j] = j;
    console.log("this.FilesDataArray", this.FileDataArray);
    console.log("this.FilesDataArrayIndex", this.FileDataArrayIndex);
  }

  formDataChange(dataPO) {
    console.log("fdataPO", dataPO);
    const formData: FormData = new FormData();
    let formdataIndex = this.FileDataArrayIndex;
    let formdataValue = this.FileDataArray;
    console.log("formdataIndex  after", formdataIndex);
    console.log("formdataValue  after", formdataValue);
    for (let i = 0; i < formdataValue.length; i++) {
      let keyvalue = "file_key" + formdataIndex[i];
      let pairValue = formdataValue[i];
      if (formdataValue[i] == "") {
        console.log("");
      } else {
        formData.append(keyvalue, pairValue);
      }
    }
    let POFormData = this.POForm.value.podetails;

    for (let filekeyToinsert in formdataIndex) {
      let datakey = "file_key" + filekeyToinsert;
      console.log("datakey", datakey);
      POFormData[filekeyToinsert].file_key = datakey;
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
    let datavalue = JSON.stringify(dataPO);
    formData.append("data", datavalue);
    this.SpinnerService.show();
    // Previous
    // this.dataService.POCreateForm(formData).subscribe(
    // New
    this.dataService.POCreateFormNew(formData).subscribe(
      (res) => {
        // this.SpinnerService.hide();
        // if (
        //   res.code === "INVALID_DATA" &&
        //   res.description === "Invalid Data or DB Constraint"
        // ) {
        //   this.notification.showError("[INVALID_DATA! ...]");
        // } else if (
        //   res.code === "UNEXPECTED_ERROR" &&
        //   res.description === "Duplicate Name"
        // ) {
        //   this.notification.showWarning("Duplicate Data! ...");
        // } 
        // else if(res.code == "INVALID_FILETYPE"){
        //   this.notification.showError(res.description);
        //   return;
        // } else if (
        //   res.code === "UNEXPECTED_ERROR" &&
        //   res.description === "Unexpected Internal Server Error"
        // ) {
        //   this.notification.showError("INVALID_DATA!...");
        if(res?.code){
          this.SpinnerService.hide()
          this.notification.showError(res?.description)
          this.BuyBackDismiss.nativeElement.click()
        } else {
          this.notification.showSuccess("Successfully created!...");
          this.BuyBackDismiss.nativeElement.click()
          this.onSubmit.emit();
        }
        console.log("pomaker Form SUBMIT", res);
        return true;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
        this.BuyBackDismiss.nativeElement.click()
      }
    );
  }

  updateDiscount(index: number): void {
    const podetailsArray = this.POForm.get("podetails") as FormArray;
    const podetailGroup = podetailsArray.at(index) as FormGroup;
    const discountValue = podetailGroup.get("discount")?.value;

    podetailGroup.patchValue({
      is_discount: discountValue ? true : false,
    });
  }

  empBranchdata: any;
  getEmployeeBranchData() {
    this.SpinnerService.show();
    this.dataService.getEmpBranchId().subscribe(
      (results: any) => {
        this.SpinnerService.hide();
        if (results.error) {
          this.SpinnerService.hide();
          this.notification.showWarning(results.error + results.description);
          this.POForm.controls["branch_id"].reset("");
          return false;
        }
        let datas = results;
        this.empBranchdata = datas;
        console.log("empBranchdata", datas);
        this.POForm.patchValue({
          branch_id: this.empBranchdata,
        });
        console.log(this.POForm.value);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  onChangeAMCandDelivaryPeriod(event) {
    let lengthofPOformDetails = this.POForm.value.podetails.length;
    // console.log("change event", event)
    // console.log("change detection")

    // if(lengthofPOformDetails > 1){
    //   for(let i=1; i<=lengthofPOformDetails; i++ ){
    //     console.log("indexx on for loop", i)
    //     if( type == 'amc' ){
    //       this.POForm.get('podetails')['controls'][i].get('amcvalue').setValue()
    //     }
    //     if( type == 'delivaryperiod' ){
    //       this.POForm.get('podetails')['controls'][i].get('deliveryperiod').setValue()
    //     }
    //   }
    // }
  }

  changeValueAmcDelivaryPeriod(value, index, type) {
    console.log("value", value);
    console.log("change index", index);
    let lengthofPOformDetails = this.POForm.value.podetails.length;

    if (lengthofPOformDetails > 1 && index == 0) {
      for (let i = 1; i < lengthofPOformDetails; i++) {
        console.log("indexx on for loop", i);
        if (type == "amc") {
          this.POForm.get("podetails")
            ["controls"][i].get("amcvalue")
            .setValue(value);
        }
        if (type == "delivaryperiod") {
          this.POForm.get("podetails")
            ["controls"][i].get("deliveryperiod")
            .setValue(value);
        }
        if (type == "item_name_replacement") {
          this.POForm.get("podetails")
            ["controls"][i].get("item_name_replacement")
            .setValue(value.id);
        }
      }
    }
  }

  getprodcatkeyFK() {
    this.SpinnerService.show();
    this.dataService.itemreplacement().subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        if (datas.length == 0) {
          this.notification.showInfo("No Records Found ");
        }
        this.SpinnerService.hide();
        this.productCategoryList = datas;
        console.log("prod cat", datas);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  public displayFnproductCategory(
    prodcat?: productCategoryLists
  ): string | undefined {
    return prodcat ? prodcat.text : undefined;
  }

  updateTotalCount() {
    this.totalcoount = this.podetailsArray.length;
  }

  discountvalue: any;
  totalamount2: any;
  totall: any;
  discount(data: any, i: number) {
    const discount = typeof(data?.discount)=='string'?parseFloat(data?.discount?.replace(/,/g,'')):data?.amount;
    const totalAmount = typeof(data?.amount)=='string'?parseFloat(data?.amount?.replace(/,/g,'')):data?.amount;
    if (discount > totalAmount) {
      // Clear the buyback amount field
      this.POForm.get("podetails")["controls"][i].get("discount").setValue('0.00');
      this.notification.showWarning("Discount is greater than the PO amount");
    } else {
      this.totall = totalAmount - discount;
      // let totalval=this.totall.toFixed(2);
      // Update the specific 'amount' field in the 'podetails' array
      // this.POForm.get('podetails')['controls'][i].get('amount').setValue(this.totall);
      // this.POForm.get("podetails")
      //   ["controls"][i].get("totalamount")
      //   .setValue(+this.totall);
      // this.datadiff();
          const num = Number(this.totall);
        let val;
        if (isNaN(num)){
          val=data?.amount
        } 
        else{
          const parts = num.toFixed(2).split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})(\d{2})*(?!\d))/g, ',');
          val=parts.length>1?parts[0]+'.'+parts[1]:parts[0];
        }
      this.POForm.get("podetails")
        ["controls"][i].get("totalamount")
        .setValue(val);
      this.datadiff();
    }
  }
  getSpecificationKeys(specification: any): string[] {
    return specification ? Object.keys(specification) : [];
  }
  discc(data: any, i: number) {
    const buybackAmount = data.buyback_amount;
    const totalAmount = data.totalamount;

    // Check if the buyback amount is greater than the total amount
    if (buybackAmount > totalAmount) {
      // Clear the buyback amount field
      this.POForm.get("podetails")
        ["controls"][i].get("buyback_amount")
        .setValue(null);
      this.notification.showWarning(
        "Buyback amount is greater than the PO amount"
      );
    } else {
      // this.totall = totalAmount - buybackAmount;
      // // this.POForm.get('podetails')['controls'][i].get('amount').setValue(this.totall);
      // this.POForm.get('podetails')['controls'][i].get('totalamount').setValue(this.totall);
      // this.datadiff();
      return;
    }

    // Recalculate totals or other necessary updates
  }

  datadiff() {
    this.amt = this.POForm.value.podetails.map((x) => String(x.totalamount)?.replace(/,/g,''));
    console.log("data check amt", this.amt);
    this.sum = this.amt.reduce((a, b) => Number(a) + Number(b), 0);
    // +this.sum.toFixed(2)
    console.log("sum of total ", this.sum);
    this.POForm.patchValue({
      amount: +this.sum,
    });
  }

  assetDetails(array,index) {
    this.assetDetailsIndex=index
    // let pr=[]
    // for(let i of id){
    //   pr.push(i?.prdetails_id)
    // }
    // this.SpinnerService.show();
    // let payload={
    //   "prdetails_id":array
    // }
    // this.dataService.getAssetDetailsNewpo(payload).subscribe((res) => {
    //   this.assetArray = res["asset"];
    //   this.SpinnerService.hide();
    //   if (res["asset"].length == 0) {
    //     this.notification.showInfo("No Data Found!");
    //   }
    // });
  }
  tabChange(e) {
    this.selectedTab = e.index;
    let label = e.tab.textLabel;
    if (label == "Create T & C") {
      // this.createTab();
      // this.serviceTab();
      this.isUpdate = false;
      this.TermsForm.reset();
      this.getTerms(1);
    }
    if (label == "Create T & C Lists") {
      // this.createLists();
      this.showLists = false;
      this.serviceTab(1);
      this.productTab(1);
    }
  }
  getTermsReset() {
    this.TermsForm.reset();
    this.getTerms(1);
    this.isUpdate = false;
  }
  presentpage_term: number = 1;
  hasprevious_term: boolean = false;
  hasnext_term: boolean = false;
  termsLists: any;
  getTerms(page) {
    // if (!this.termsLists) {
    this.selectedTab = 0;
    this.SpinnerService.show();
    let data = this.TermsForm.value;
    this.dataService.getTerms(page, data).subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.totalcount = results["total_count"];
        this.termsLists = datas;
        console.log("servicelist", this.servicetermslist);
        let datapagination = results["pagination"];
        this.totalcount = results["total_count"];
        if (this.termsLists.length > 0) {
          this.hasnext_term = datapagination.has_next;
          this.hasprevious_term = datapagination.has_previous;
          this.presentpage_term = datapagination.index;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
    // }
  }
  nextTerms() {
    if (this.hasnext_term === true) {
      this.getTerms(this.presentpage_term + 1);
    }
  }
  previousTerms() {
    if (this.hasprevious_term === true) {
      this.getTerms(this.presentpage_term - 1);
    }
  }
  has_next_ser: boolean = false;
  has_previous_ser: boolean = false;
  nextTermsServ() {
    if (this.has_next_ser === true) {
      this.serviceTab(this.presentpage_ser + 1);
    }
  }
  prevTermsServ() {
    if (this.has_previous_ser === true) {
      this.serviceTab(this.presentpage_ser + 1);
    }
  }
  nextTermsPro() {
    if (this.has_next_pro === true) {
      this.productTab(this.presentpage_pro + 1);
    }
  }
  prevTermsPro() {
    if (this.has_previous_pro === true) {
      this.productTab(this.presentpage_pro + 1);
    }
  }

  hasnext: boolean = false;
  hasprevious: boolean = false;
  isDisabled: boolean = false;
  deleteProc(data) {
    let id = data.id;
    if (confirm("Delete the Term?")) {
      this.SpinnerService.show();
      this.dataService.deleteTerms(id).subscribe(
        (results) => {
          this.SpinnerService.hide();
          if (results["status"]) {
            this.notification.showSuccess("Term Deleted!");
            this.getTerms(1);
            this.isUpdate = false;
          } else {
            this.notification.showSuccess(results?.message);
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    } else {
      return false;
    }
  }
  createLists() {}
  editProc(data, i) {
    this.TermsForm.patchValue({
      type: data?.type,
      desc: data?.desc,
      id: data?.id,
    });
    this.isUpdate = true;
    this.termsLists[i].isDisabled = true;
  }
  showLists: boolean = false;
  getLists(e, data) {
    console.log("Option selected:", data, e); // Debugging

    let id = data?.id;
    if (id) {
      this.showLists = true;
    }
    this.producttermsForm.get('id').setValue(id);
    this.termsmodalList();
    // this.productTab(1);
    // this.serviceTab(1);
  }
  resetTerms() {
    this.producttermsForm.reset();
    this.showLists = false;
    this.productTab(1);
    this.serviceTab(1);
  }
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  isMenuOpen: boolean = false;

  openMenu() {
    if (this.menuTrigger) {
      this.menuTrigger.openMenu(); // Open menu
      this.isMenuOpen = true;
    }
  }

  closeMenu() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu(); // Close menu
      this.isMenuOpen = false;
    }
  }
  Lists: any = [];
  getproductType(){
    // this.isLoading = true;
    this.dataService.getproductType().subscribe(
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
  @ViewChild("productcat") matproductAutocomplete: MatAutocomplete;
  @ViewChild("productInput") productInput: any;
  @ViewChild("productInputtype") productInputtype: any;
    getproductFK() {
      this.SpinnerService.show();
      let commodity = this.PRsummarySearchForm?.value?.commodityname?.id;
      let prod = this.PRsummarySearchForm?.value?.product_type?.id
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
      this.dataService.getproductfn(commodity, prod, value, 1).subscribe(
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
          //   this.spinnerservice.hide()
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
      // }
    }
    productList: any = []
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
                  this.dataService
                    .getproductfn(
                      this.PRsummarySearchForm.value.commodityname.id,
                      this.PRsummarySearchForm.value.product_type?.id,
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
                }
              }
            });
        }
      });
    }
      public displayFnproduct(prod?: productLists): string | undefined {
        return prod ? prod.name : undefined;
      }
      ResetSum(){
        this.assetArray.forEach(data=>{
          data.amount=0
        })
      }
      CancelReset(){
        this.CloseModal.nativeElement.click()
        this.ResetSum()
      }
      SaveAmount(datas){
        this.CloseModal.nativeElement.click()
        let sum=0
        datas.forEach(data=>{
          sum=sum+parseFloat(data.amount.replace(/,/g,''))
          // data.status=1
          // if(data.hasOwnProperty('prdetail_id')){
          //   data.prdetails_id=data?.prdetail_id
          //   delete data.prdetail_id;
          // }
        })
        const num = Number(sum);
        let val;
        if (isNaN(num)){
          val='0.00'
        } ;
        const parts = num.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})(\d{2})*(?!\d))/g, ',');
        val=parts.length>1?parts[0]+'.'+parts[1]:parts[0];

        this.POForm.get('podetails')['controls'][this.assetDetailsIndex].get('buyback_amount').setValue(val)
        // let payload={
        //   'pr_request':2,
        //   'asset':this.assetArray
        // }
        // this.POForm.get('podetails').value[this.assetDetailsIndex]['pr_request']=payload
        // console.log('form',this.POForm.value)
      }
      check(data,i){
        if(data.length>i+1){
          return true
        }
      }
      getAssestArray(array){
        return new Promise<any>(resolve=>{
          let payload={
            "prdetails_id":array
          }
          this.dataService.getAssetDetailsNewpo(payload).subscribe((res) => {
            // console.log('res',res)
            resolve(res['asset'])
            // this.assetArray = res["asset"];
            // this.SpinnerService.hide();
            // if (res["asset"].length == 0) {
            //   this.notification.showInfo("No Data Found!");
            // }
          },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
        })
      

      }
      AssetResArray(data){
        if(data?.get('podetails')['controls'][this.assetDetailsIndex]?.get('ProductArrayAsset').value){
          return data?.get('podetails')['controls'][this.assetDetailsIndex].get('ProductArrayAsset').value
        }
        else{
          return []
        }

      }
      price_Quot(event: MatButtonToggleChange) {
          this.selectedTypeQ = event.value; 
          if ( this.selectedTypeQ == 1){
            this.toggleDisabled = true;  
            this.notepadfn = true
             this.POForm.get('terms_id')?.enable();
          }
          else
            {
              this.togglekey = true;
              this.toggleDisabled = false;  
             this.notepadfn = false
             this.POForm.get('terms_id')?.disable();
            }
          
        }
  onEditorChange(content: string) {
  console.log("Editor content:", content);  // should log the HTML
  this.POForm.get('terms_text')?.setValue(content, { emitEvent: true });
}
notepadsave(){
   console.log(this.POForm.value.terms_text);
}
onTermsInput(event: any) {
  const value = event.target.value;
  if (!value || value.trim() === '') {  
    this.onTermsCleared();
  }
}

onTermsCleared() {
  console.log('Terms cleared');
  this.toggleDisabled = false;
  this.togglekey = false;
 
}

  onPoPreviewClick(){
    if(this.previewClick == false){
    this.MainPoSubmitNew();
    this.POSubmitNew();
    }
    else {
      this.POSubmitNew();
      this.popdfpreview();
    }

  }

  onJustificationPreviewClick(){
     if(this.previewClick == false){
     this.MainPoSubmitJust();
    this.POSubmitNewJust();
     }
     else {
       this.POSubmitNewJust();
      this.popdfpreviewJust();
     }
  }
    MainPoSubmitNew(){
    if (
      this.POForm.value.supplierbranch_id == "" ||
      this.POForm.value.supplierbranch_id == null ||
      this.POForm.value.supplierbranch_id == undefined
    ) {
      this.notification.showWarning("Choose Supplier");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validfrom == "" ||
      this.POForm.value.validfrom == null ||
      this.POForm.value.validfrom == undefined
    ) {
      this.notification.showWarning("Please provide a 'From Date'.");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validto == "" ||
      this.POForm.value.validto == null ||
      this.POForm.value.validto == undefined
    ) {
      this.notification.showWarning("Please provide a 'To Date'.");
      this.clicked = false;
      return false;
    }
    if( this.notepadfn == true){
    if (
      this.POForm.value.terms_id == "" ||
      this.POForm.value.terms_id == null ||
      this.POForm.value.terms_id == undefined
    ) {
      this.notification.showWarning("Choose Terms And Conditions");
      this.clicked = false;
      return false;
    }
  }
    if (
      this.POForm.value.branch_id == "" ||
      this.POForm.value.branch_id == null ||
      this.POForm.value.branch_id == undefined
    ) {
      this.notification.showWarning("Choose Branch ");
      this.clicked = false;
      return false;
    }
    if (
      this.POForm.value.employee_id == "" ||
      this.POForm.value.employee_id == null ||
      this.POForm.value.employee_id == undefined
    ) {
      this.notification.showWarning("Choose Approver");
      this.clicked = false;
      return false;
    }
    let checkarray=[]
    console.log(this.POForm.value)
    for(let i in this.POForm.get('podetails').value){
      if(!this.POForm.get('podetails').value[i].buyback_amount && this.POForm.get('podetails').value[i].item_name_replacement?.id==2){
        // checkarray.push('line'+Number(i)+1)
        checkarray.push((+i)+(1)) //+i will change string into integer number
        

      }
    }
    console.log('checkarray==>',checkarray)
    if(checkarray.length){
      this.BuyBackTrigger.nativeElement.click()
      this.GlobalCheckArray=checkarray
    }
    else{
      this.POSubmitNew()
    }
  }
  POSubmitNew() {
    
 
    if (
      this.POForm.value.supplierbranch_id == "" ||
      this.POForm.value.supplierbranch_id == null ||
      this.POForm.value.supplierbranch_id == undefined
    ) {
      this.notification.showWarning("Choose Supplier");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validfrom == "" ||
      this.POForm.value.validfrom == null ||
      this.POForm.value.validfrom == undefined
    ) {
      this.notification.showWarning("Please provide a 'From Date'.");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validto == "" ||
      this.POForm.value.validto == null ||
      this.POForm.value.validto == undefined
    ) {
      this.notification.showWarning("Please provide a 'To Date'.");
      this.clicked = false;
      return false;
    }
if( this.notepadfn == true){
    if (
      this.POForm.value.terms_id == "" ||
      this.POForm.value.terms_id == null ||
      this.POForm.value.terms_id == undefined
    ) {
      this.notification.showWarning("Choose Terms And Conditions");
      this.clicked = false;
      return false;
    }
  }
    if (
      this.POForm.value.branch_id == "" ||
      this.POForm.value.branch_id == null ||
      this.POForm.value.branch_id == undefined
    ) {
      this.notification.showWarning("Choose Branch ");
      this.clicked = false;
      return false;
    }
    // if (
    //   this.POForm.value.warrenty == "" ||
    //   this.POForm.value.warrenty == null ||
    //   this.POForm.value.warrenty == undefined
    // ) {
    //   this.notification.showWarning("Please Fill Warrenty");
    //   this.clicked = false;
    //   return false;
    // }
    if (
      this.POForm.value.employee_id == "" ||
      this.POForm.value.employee_id == null ||
      this.POForm.value.employee_id == undefined
    ) {
      this.notification.showWarning("Choose Approver");
      this.clicked = false;
      return false;
    }

    // let totalDaysCheck =
    //   this.POForm.value.onacceptance +
    //   this.POForm.value.ondelivery +
    //   this.POForm.value.oninstallation;
    // if (totalDaysCheck != 100) {
    //   this.notification.showWarning(
    //     "Days for On Acceptance, On Delivery, On Installation Must be equal to 100"
    //   );
    //   this.clicked = false;
    //   return false;
    // }
    if (
      this.POForm.value.onacceptance == undefined ||
      this.POForm.value.onacceptance == "" ||
      this.POForm.value.onacceptance == null
    ) {
      this.POForm.value.onacceptance = 0;
    }
    if (
      this.POForm.value.ondelivery == null ||
      this.POForm.value.ondelivery == "" ||
      this.POForm.value.ondelivery == undefined
    ) {
      this.POForm.value.ondelivery = 0;
    }
    if (
      this.POForm.value.oninstallation == null ||
      this.POForm.value.oninstallation == "" ||
      this.POForm.value.oninstallation == undefined
    ) {
      this.POForm.value.oninstallation = 0;
    }

    this.updatePodetailsDiscountStatus();
    let datadetails = this.POForm.value.podetails;
    console.log("datadetails", datadetails);
    let filesvaluedetail = this.files.value.file_upload;
    for (let i in datadetails) {
      let amcdata = datadetails[i].amcvalue;
      let delivaryperiod = datadetails[i].deliveryperiod;
      let disc = datadetails[i]?.discount;

      // datadetails[i].product_name = datadetails[i].product_idCatlog
      // datadetails[i].item_name = datadetails[i].itemCatlog
      let indexNumber = Number(i);
      if (amcdata == "" || amcdata == undefined) {
        // this.notification.showWarning("AMC% is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
        datadetails[i].amcvalue = 0;
      }
      if (delivaryperiod == "" || delivaryperiod == undefined) {
        datadetails[i].deliveryperiod = 0;
        // this.notification.showWarning("Delivery Period is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
      }
      if (disc == "" || disc == undefined || disc == null) {
        datadetails[i].discount = 0;
        // this.notification.showWarning("Delivery Period is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
      }
    }
    if (this.POForm.value.supplierbranch_id.id == undefined) {
      this.POForm.value.supplierbranch_id = this.POForm.value.supplierbranch_id;
    } else {
      this.POForm.value.supplierbranch_id =
        this.POForm.value.supplierbranch_id.id;
    }
    if (this.POForm.value.branch_id.id == undefined) {
      this.POForm.value.branch_id = this.POForm.value.branch_id;
    } else {
      this.POForm.value.branch_id = this.POForm.value.branch_id.id;
    }
    if (this.POForm.value.employee_id.id == undefined) {
      this.POForm.value.employee_id = this.POForm.value.employee_id;
    } else {
      this.POForm.value.employee_id = this.POForm.value.employee_id.id;
    }
    if (this.POForm.value?.terms_id == undefined) {
      this.POForm.value.terms_id = "";
    } else {
      this.POForm.value.terms_id = this.POForm.value.terms_id?.id ?? this.POForm.value.terms_id;
    }
    // this.POForm.value.supplierbranch_id = this.POForm.value.supplierbranch_id.id
    // this.POForm.value.branch_id = this.POForm.value.branch_id.id
    // this.POForm.value.employee_id = this.POForm.value.employee_id.id
    // this.POForm.value.terms_id = this.POForm.value.terms_id.id
    // const currentDate = this.POForm.value.validfrom
    // let validfrom = this.datePipe.transform(currentDate.date, 'yyyy-MM-dd');
    this.POForm.value.validfrom = this.datePipe.transform(
      this.POForm.value.validfrom,
      "yyyy-MM-dd"
    );
    this.POForm.value.validto = this.datePipe.transform(
      this.POForm.value.validto,
      "yyyy-MM-dd"
    );
    for(let data of this.POForm.get('podetails').value){
      if(data?.item_name_replacement?.id==2){
        for(let assetdata of data?.ProductArrayAsset){
          assetdata.status=1
          if(assetdata.hasOwnProperty('prdetail_id')){
            assetdata.prdetails_id=assetdata?.prdetail_id
            delete assetdata.prdetail_id;
          }
        }
        let assestDict={
          pr_request:2,
          asset:data?.ProductArrayAsset
        }
        data.pr_request=assestDict
      }
      if(data.hasOwnProperty('ProductArrayData')){
        delete data.ProductArrayData
      }
      if(data.hasOwnProperty('ProductArrayAsset')){
        delete data.ProductArrayAsset
      }
    }
    console.log('POFORM',this.POForm.get('podetails').value)
    let data = this.POForm.value;
    let dataID = Object.assign({}, data, { type: this.type.value });
    let filesvalue = this.files.value.file_upload;
    let filesHeadervalue = this.filesHeader.value.file_upload;
    this.formDataChangeNew(dataID, 'po');
  }
    formDataChangeNew(dataPO, key) {
    console.log("fdataPO", dataPO);
    for(let data of dataPO?.podetails){
      data.amount=typeof(data?.amount)=='string'?parseFloat(data?.amount?.replace(/,/g,'')):data?.amount
      data.totalamount=typeof(data?.totalamount)=='string'?parseFloat(data?.totalamount?.replace(/,/g,'')):data?.totalamount
      data.unitprice=typeof(data?.unitprice)=='string'?parseFloat(data?.unitprice?.replace(/,/g,'')):data?.unitprice
      data.discount=typeof(data?.discount)=='string'?parseFloat(data?.discount?.replace(/,/g,'')):data?.discount
    }
    const formData: FormData = new FormData();
    let formdataIndex = this.FileDataArrayIndex;
    let formdataValue = this.FileDataArray;
    console.log("formdataIndex  after", formdataIndex);
    console.log("formdataValue  after", formdataValue);
    for (let i = 0; i < formdataValue.length; i++) {
      let keyvalue = "file_key" + formdataIndex[i];
      let pairValue = formdataValue[i];
      if (formdataValue[i] == "") {
        console.log("");
      } else {
        formData.append(keyvalue, pairValue);
      }
    }
    let POFormData = this.POForm.value.podetails;

    for (let filekeyToinsert in formdataIndex) {
      let datakey = "file_key" + filekeyToinsert;
      console.log("datakey", datakey);
      POFormData[filekeyToinsert].file_key = datakey;
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
    let datavalue = JSON.stringify(dataPO);
    formData.append("data", datavalue);
    this.SpinnerService.show();
    if(key == 'po'){
      this.previewClick = true;
      this.finaldata = datavalue
    this.dataService.getPOpdfpreview(datavalue).subscribe(
      (res) => {
     
        if(res?.code){
          this.SpinnerService.hide()
          this.notification.showError(res?.description)
          this.BuyBackDismiss.nativeElement.click()
        } else {
           this.SpinnerService.hide()
           let blob = new Blob([res], { type: "application/pdf" });
        let downloadUrl = window.URL.createObjectURL(blob);
        let name = 'Purchase Order'
        window.open(downloadUrl, "_blank");  
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        }
        console.log("pomaker Form SUBMIT", res);
        return true;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
        this.BuyBackDismiss.nativeElement.click()
      }
    );
  }
  else{
      this.previewClick = true;
      this.finaldata = datavalue
      this.dataService.getJustpdfpreview(datavalue).subscribe(
      (res) => {
     
        if(res?.code){
          this.SpinnerService.hide()
          this.notification.showError(res?.description)
          this.BuyBackDismiss.nativeElement.click()
        } else {
          this.SpinnerService.hide()
           let blob = new Blob([res], { type: "application/pdf" });
        let downloadUrl = window.URL.createObjectURL(blob);
        let name = 'Justification Report'
        window.open(downloadUrl, "_blank");  
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        }
        console.log("pomaker Form SUBMIT", res);
        return true;
        
       
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
        this.BuyBackDismiss.nativeElement.click()
      }
    );
  }
}
  POSubmitNewJust() {    
 
    if (
      this.POForm.value.supplierbranch_id == "" ||
      this.POForm.value.supplierbranch_id == null ||
      this.POForm.value.supplierbranch_id == undefined
    ) {
      this.notification.showWarning("Choose Supplier");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validfrom == "" ||
      this.POForm.value.validfrom == null ||
      this.POForm.value.validfrom == undefined
    ) {
      this.notification.showWarning("Please provide a 'From Date'.");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validto == "" ||
      this.POForm.value.validto == null ||
      this.POForm.value.validto == undefined
    ) {
      this.notification.showWarning("Please provide a 'To Date'.");
      this.clicked = false;
      return false;
    }
if( this.notepadfn == true){
    if (
      this.POForm.value.terms_id == "" ||
      this.POForm.value.terms_id == null ||
      this.POForm.value.terms_id == undefined
    ) {
      this.notification.showWarning("Choose Terms And Conditions");
      this.clicked = false;
      return false;
    }
  }
    if (
      this.POForm.value.branch_id == "" ||
      this.POForm.value.branch_id == null ||
      this.POForm.value.branch_id == undefined
    ) {
      this.notification.showWarning("Choose Branch ");
      this.clicked = false;
      return false;
    }
    // if (
    //   this.POForm.value.warrenty == "" ||
    //   this.POForm.value.warrenty == null ||
    //   this.POForm.value.warrenty == undefined
    // ) {
    //   this.notification.showWarning("Please Fill Warrenty");
    //   this.clicked = false;
    //   return false;
    // }
    if (
      this.POForm.value.employee_id == "" ||
      this.POForm.value.employee_id == null ||
      this.POForm.value.employee_id == undefined
    ) {
      this.notification.showWarning("Choose Approver");
      this.clicked = false;
      return false;
    }

    // let totalDaysCheck =
    //   this.POForm.value.onacceptance +
    //   this.POForm.value.ondelivery +
    //   this.POForm.value.oninstallation;
    // if (totalDaysCheck != 100) {
    //   this.notification.showWarning(
    //     "Days for On Acceptance, On Delivery, On Installation Must be equal to 100"
    //   );
    //   this.clicked = false;
    //   return false;
    // }
    if (
      this.POForm.value.onacceptance == undefined ||
      this.POForm.value.onacceptance == "" ||
      this.POForm.value.onacceptance == null
    ) {
      this.POForm.value.onacceptance = 0;
    }
    if (
      this.POForm.value.ondelivery == null ||
      this.POForm.value.ondelivery == "" ||
      this.POForm.value.ondelivery == undefined
    ) {
      this.POForm.value.ondelivery = 0;
    }
    if (
      this.POForm.value.oninstallation == null ||
      this.POForm.value.oninstallation == "" ||
      this.POForm.value.oninstallation == undefined
    ) {
      this.POForm.value.oninstallation = 0;
    }

    this.updatePodetailsDiscountStatus();
    let datadetails = this.POForm.value.podetails;
    console.log("datadetails", datadetails);
    let filesvaluedetail = this.files.value.file_upload;
    for (let i in datadetails) {
      let amcdata = datadetails[i].amcvalue;
      let delivaryperiod = datadetails[i].deliveryperiod;
      let disc = datadetails[i]?.discount;

      // datadetails[i].product_name = datadetails[i].product_idCatlog
      // datadetails[i].item_name = datadetails[i].itemCatlog
      let indexNumber = Number(i);
      if (amcdata == "" || amcdata == undefined) {
        // this.notification.showWarning("AMC% is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
        datadetails[i].amcvalue = 0;
      }
      if (delivaryperiod == "" || delivaryperiod == undefined) {
        datadetails[i].deliveryperiod = 0;
        // this.notification.showWarning("Delivery Period is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
      }
      if (disc == "" || disc == undefined || disc == null) {
        datadetails[i].discount = 0;
        // this.notification.showWarning("Delivery Period is not filled, Please check on line " + (indexNumber + 1))
        // this.clicked = false
        // return false
      }
    }
    if (this.POForm.value.supplierbranch_id.id == undefined) {
      this.POForm.value.supplierbranch_id = this.POForm.value.supplierbranch_id;
    } else {
      this.POForm.value.supplierbranch_id =
        this.POForm.value.supplierbranch_id.id;
    }
    if (this.POForm.value.branch_id.id == undefined) {
      this.POForm.value.branch_id = this.POForm.value.branch_id;
    } else {
      this.POForm.value.branch_id = this.POForm.value.branch_id.id;
    }
    if (this.POForm.value.employee_id.id == undefined) {
      this.POForm.value.employee_id = this.POForm.value.employee_id;
    } else {
      this.POForm.value.employee_id = this.POForm.value.employee_id.id;
    }
    if (this.POForm.value?.terms_id == undefined) {
      this.POForm.value.terms_id = "";
    } else {
      this.POForm.value.terms_id = this.POForm.value.terms_id?.id ?? this.POForm.value.terms_id;
    }
    // this.POForm.value.supplierbranch_id = this.POForm.value.supplierbranch_id.id
    // this.POForm.value.branch_id = this.POForm.value.branch_id.id
    // this.POForm.value.employee_id = this.POForm.value.employee_id.id
    // this.POForm.value.terms_id = this.POForm.value.terms_id.id
    // const currentDate = this.POForm.value.validfrom
    // let validfrom = this.datePipe.transform(currentDate.date, 'yyyy-MM-dd');
    this.POForm.value.validfrom = this.datePipe.transform(
      this.POForm.value.validfrom,
      "yyyy-MM-dd"
    );
    this.POForm.value.validto = this.datePipe.transform(
      this.POForm.value.validto,
      "yyyy-MM-dd"
    );
    for(let data of this.POForm.get('podetails').value){
      if(data?.item_name_replacement?.id==2){
        for(let assetdata of data?.ProductArrayAsset){
          assetdata.status=1
          if(assetdata.hasOwnProperty('prdetail_id')){
            assetdata.prdetails_id=assetdata?.prdetail_id
            delete assetdata.prdetail_id;
          }
        }
        let assestDict={
          pr_request:2,
          asset:data?.ProductArrayAsset
        }
        data.pr_request=assestDict
      }
      if(data.hasOwnProperty('ProductArrayData')){
        delete data.ProductArrayData
      }
      if(data.hasOwnProperty('ProductArrayAsset')){
        delete data.ProductArrayAsset
      }
    }
    console.log('POFORM',this.POForm.get('podetails').value)
    let data = this.POForm.value;
    let dataID = Object.assign({}, data, { type: this.type.value });
    let filesvalue = this.files.value.file_upload;
    let filesHeadervalue = this.filesHeader.value.file_upload;
    this.formDataChangeNew(dataID, 'just');
  }
   MainPoSubmitJust(){
    if (
      this.POForm.value.supplierbranch_id == "" ||
      this.POForm.value.supplierbranch_id == null ||
      this.POForm.value.supplierbranch_id == undefined
    ) {
      this.notification.showWarning("Choose Supplier");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validfrom == "" ||
      this.POForm.value.validfrom == null ||
      this.POForm.value.validfrom == undefined
    ) {
      this.notification.showWarning("Please provide a 'From Date'.");
      this.clicked = false;
      return false;
    }

    if (
      this.POForm.value.validto == "" ||
      this.POForm.value.validto == null ||
      this.POForm.value.validto == undefined
    ) {
      this.notification.showWarning("Please provide a 'To Date'.");
      this.clicked = false;
      return false;
    }
    if( this.notepadfn == true){
    if (
      this.POForm.value.terms_id == "" ||
      this.POForm.value.terms_id == null ||
      this.POForm.value.terms_id == undefined
    ) {
      this.notification.showWarning("Choose Terms And Conditions");
      this.clicked = false;
      return false;
    }
  }
    if (
      this.POForm.value.branch_id == "" ||
      this.POForm.value.branch_id == null ||
      this.POForm.value.branch_id == undefined
    ) {
      this.notification.showWarning("Choose Branch ");
      this.clicked = false;
      return false;
    }
    if (
      this.POForm.value.employee_id == "" ||
      this.POForm.value.employee_id == null ||
      this.POForm.value.employee_id == undefined
    ) {
      this.notification.showWarning("Choose Approver");
      this.clicked = false;
      return false;
    }
    let checkarray=[]
    console.log(this.POForm.value)
    for(let i in this.POForm.get('podetails').value){
      if(!this.POForm.get('podetails').value[i].buyback_amount && this.POForm.get('podetails').value[i].item_name_replacement?.id==2){
        // checkarray.push('line'+Number(i)+1)
        checkarray.push((+i)+(1)) //+i will change string into integer number
        

      }
    }
    console.log('checkarray==>',checkarray)
    if(checkarray.length){
      this.BuyBackTrigger.nativeElement.click()
      this.GlobalCheckArray=checkarray
    }
    else{
      this.POSubmitNewJust()
    }
  }

  popdfpreview(){

      this.dataService.getPOpdfpreview(this.finaldata).subscribe(
      (res) => {
     
        if(res?.code){
          this.SpinnerService.hide()
          this.notification.showError(res?.description)
          this.BuyBackDismiss.nativeElement.click()
        } else {
           this.SpinnerService.hide()
           let blob = new Blob([res], { type: "application/pdf" });
        let downloadUrl = window.URL.createObjectURL(blob);
        let name = 'Purchase Order'
        window.open(downloadUrl, "_blank");  
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        }
        console.log("pomaker Form SUBMIT", res);
        return true;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
        this.BuyBackDismiss.nativeElement.click()
      }
    );
  }
  popdfpreviewJust(){

       this.dataService.getJustpdfpreview(this.finaldata).subscribe(
      (res) => {
     
        if(res?.code){
          this.SpinnerService.hide()
          this.notification.showError(res?.description)
          this.BuyBackDismiss.nativeElement.click()
        } else {
          this.SpinnerService.hide()
           let blob = new Blob([res], { type: "application/pdf" });
        let downloadUrl = window.URL.createObjectURL(blob);
        let name = 'Justification Report'
        window.open(downloadUrl, "_blank");  
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        }
        console.log("pomaker Form SUBMIT", res);
        return true;
        
       
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
        this.BuyBackDismiss.nativeElement.click()
      }
    );
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
    AmountCalculationPop(event,section){
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
  event.target.value=value
  // section.amount=''
  // section.amount=value
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
public displayFnitem(item?: itemsLists): string | undefined {
    return item ? item.name : undefined;
  }
}
