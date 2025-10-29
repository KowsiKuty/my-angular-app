import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ErrorHandlingServiceService } from "../error-handling-service.service";
import { PRPOSERVICEService } from "../prposervice.service";
import { NotificationService } from "../notification.service";
import { PRPOshareService } from "../prposhare.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { fromEvent, Observable } from "rxjs";
import { data } from "jquery";
import { SharedService } from "../../service/shared.service";
import { error } from "console";
import { element } from "protractor";
import { ReportserviceService } from "src/app/reports/reportservice.service";
import { ToastrService } from "ngx-toastr";

export interface branchlistss {
  id: any;
  name: string;
  code: string;
}

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

export interface cclistss {
  id: string;
  costcentre_id: any;
  name: string;
}

export interface itemsLists {
  id: string;
  name: string;
}

export interface bslistss {
  id: string;
  name: string;
  bs: any;
}
export interface modelsList {
  id: any;
  name: any;
}

@Component({
  selector: "app-branchrequest-maker",
  templateUrl: "./branchrequest-maker.component.html",
  styleUrls: ["./branchrequest-maker.component.scss"],
})
export class BranchrequestMakerComponent implements OnInit {
  brForm: FormGroup;
  isLoading: boolean;

  @Output() onCancel = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() linesChange = new EventEmitter<any>();

  branchList: Array<branchlistss>;

  commodityList: Array<commoditylistss>;

  productList: Array<productLists>;

  bslist: Array<bslistss>;

  itemList: Array<itemsLists>;
  selectedType: string = '1';
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
  // ]
  assetForm: FormGroup;

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("branch") matbranchAutocomplete: MatAutocomplete;
  @ViewChild("branchInput") branchInput: any;
  @ViewChild("commodity") matcommodityAutocomplete: MatAutocomplete;
  @ViewChild("commodityInput") commodityInput: any;
  @ViewChild("productcat") matproductAutocomplete: MatAutocomplete;
  @ViewChild("productInput") productInput: any;
  @ViewChild("bs") matbsAutocomplete: MatAutocomplete;
  @ViewChild("bsInput") bsInput: any;
  @ViewChild("item") matitemAutocomplete: MatAutocomplete;
  @ViewChild("itemInput") itemInput: any;
  @ViewChild("itemmake") matitemmakeAutocomplete: MatAutocomplete;
  @ViewChild("itemmakeInput") itemmakeInput: any;
  @ViewChild("assetDD") assetDD: MatAutocomplete;
  @ViewChild("assetInput") assetInput: any;
  @ViewChild("assetDDd") assetDDd: MatAutocomplete;
  @ViewChild("assetInputt") assetInputt: any;
  @ViewChild("uom") matuomAutocomplete: MatAutocomplete;
  @ViewChild("uomInput") uomInput: any;
  @ViewChild("cc") matuomAutocompletecc: MatAutocomplete;
  @ViewChild("ccInput") ccInput: any;
  @ViewChild("takeInput", { static: false }) InputVar: ElementRef;
  //////////////////////////////////////////////////
  producttype_next = false;
  producttype_pre = false;
  producttype_crtpage = 1;
  prdTypes: any = []
  @ViewChild("productauto") productAutocomplete: MatAutocomplete;
  remainamt: any;
  comid: any;
  has_nextu: boolean = true;
  has_nextcc: boolean = true;
  has_previouscc: boolean = false;
  currentpagecc: number = 1;
  uomlist: any[] = [];
  has_previousu: boolean = false;
  currentpageuom: number = 1;
  product = new FormControl();
  cclist: any;
  bsid: any;
  productidss: any;
  productname: any;
  uomname: any;
  quantityvalue: any;
  bsname: any;
  ccnames: any;
  empBranchdata: any;
  branchid: any;
  employeeid: any;
  selectedFiles: File[] = [];
  id: any;
  branchhId: any;
  commoditty: any;
  productt: any;
  prid: any;
  dataass: string;
  commodity: any;
  editKey: number = 0;
  payload: any;
  prdetails_id: any;
  prheader_id: any;
  prccbs_id: any;
  filesHeader: FormGroup;
  takeInput: any;
  currentpageprodd: any;
  has_previousprodd: any;
  has_nextprodd: any;
  isAsset: boolean = false;
  is_admin: any;
  clickvalue: any;
  birtype: any;
  showpopup = true
  product_type1: any;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private prposervice: PRPOSERVICEService,
    private router: Router,
    private notification: NotificationService,
    private prposhareService: PRPOshareService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingServiceService,
    private changeDetectorRef: ChangeDetectorRef,
    private shareService: SharedService,
    private reportService: ReportserviceService,
    private toastService: ToastrService
  ) { }

  ngOnInit() {
    let dataa = this.shareService.prpoeditvalue.value;
    // this.shareService.is_admin.next(this.is_admin);
    this.is_admin = this.shareService.is_admin.value;
    this.assetForm = this.fb.group({
      asset_id: [""],
      request_for: [""],
      product_name: [""],
      items: [""],
      models: [""],
      serial_no: ['']

    });
    this.brForm = this.fb.group({
      branch_id: "",
      commodity: "",
      product: "",
      quantity: "",
      product_type: [""],
      uom: "",
      bs: "",
      product_for: "",
      asset_id: "",
      cc: "",
      // flag: [1],
      files: [""],
      remarks: "",
      prod_type_asset: "",
    });

    this.filesHeader = this.fb.group({
      file_upload: new FormArray([]),
    });

    this.assetForm.get('product_name').valueChanges.subscribe(value => {
      if (value) {
        this.assetForm.get('items').enable();
        this.assetForm.get('models').enable();
      } else {
        this.assetForm.get('items').disable();
        this.assetForm.get('models').disable();
      }
    });

    this.assetForm.get('items').disable();
    this.assetForm.get('models').disable();
    this.getproductType();
    ////////////////////////////////////////////////////

    // this.brForm
    //   .get("commodity")
    //   .valueChanges.pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap((value) =>
    //       this.prposervice
    //         .getcommodityDependencyFKdd(this.brForm.value.mepno, value, 1)
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
    //       this.commodityList = datas;
    //     },
    //     (error) => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }
    //   );
    // this.brForm
    //   .get("uom")
    //   .valueChanges.pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap((value) =>
    //       this.prposervice.getuomFKdd(value, 1).pipe(
    //         finalize(() => {
    //           this.isLoading = false;
    //         })
    //       )
    //     )
    //   )
    //   .subscribe(
    //     (results: any[]) => {
    //       let datas = results["data"];
    //       this.uomlist = datas;
    //     },
    //     (error) => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }
    //   );
    // this.product.valueChanges.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged()
    // ).subscribe(value => {
    //   this.searchProducts(value);
    // });
    // this.brForm
    //   .get("product")
    //   .valueChanges.pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap((value) =>
    //       this.prposervice.getproductfn(this.comid, value, 1).pipe(
    //         finalize(() => {
    //           this.isLoading = false;
    //         })
    //       )
    //     )
    //   )
    //   .subscribe(
    //     (results: any[]) => {
    //       let datas = results["data"];
    //       this.productList = datas;
    //     },
    //     (error) => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }
    //   );

    ///////////////////////////////////////////////////////

    // this.brForm.get('product').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;

    //     }),
    //     switchMap(value => this.prposervice.getproductDependencyFKdd(this.brForm.value.type,this.brForm.value.commodity.id, this.brForm.value.supplier.id,this.brForm.value.dts,value, 1)

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

    ////////////////////////////////////////////////////////////////////////

    // this.brForm
    //   .get("bs")
    //   .valueChanges.pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap((value) =>
    //       this.prposervice.getbsFKdd(value, 1).pipe(
    //         finalize(() => {
    //           this.isLoading = false;
    //         })
    //       )
    //     )
    //   )
    //   .subscribe(
    //     (results: any[]) => {
    //       let datas = results["data"];
    //       this.bslist = datas;
    //     },
    //     (error) => {
    //       this.errorHandler.handleError(error);
    //       this.SpinnerService.hide();
    //     }
    //   );

    /////////////////////////////////////////////////////////////
    this.getEmployeeBranchData();

    this.editKey = this.shareService.prpoeditvaluekey.value;

    if (this.editKey == 1) {
      this.getbranchrequest();
    }
  }
  Lists$: Observable<any[]>; // Change from normal array to Observable


  getproductType() {
    this.prposervice.getproduct_type().subscribe((result) => {
      this.Lists = result['data'];
      console.log("Lists", this.Lists);
    });
  }
  product_service1(e) {
    this.product_type1 = e.id;
    this.brForm.get('product_for').reset()
    this.brForm.get('asset_id').reset()
  }

  getbranchrequest() {
    let data = this.shareService.prpoeditvalue.value;
    this.prid = data.id;
    this.SpinnerService.show();
    this.prposervice.MakerEdit(this.prid).subscribe((results) => {
      this.SpinnerService.hide();
      let dataset = results;

      this.prdetails_id = dataset.prdetails_id;
      this.prheader_id = dataset.prheader_id;
      this.prccbs_id = dataset.prccbs_id;
      this.product_type = dataset?.product_type?.id,
        this.product_type_name = dataset?.product_type?.name,
        // this.current_date = dataset.current_date;
        // this.selectedType = dataset.asset_data.pr_request.toString();
        console.log("dataset", dataset);
      this.brForm.get("branch_id").reset();
      let dict = {
        id: dataset.req_for_product_id,
        product_fullname: dataset.req_for_product_name,
      }
      this.brForm.patchValue({
        branch_id: data.branch_id,
        commodity: data.commodity_id,
        product: data.product_id,
        uom: dataset.uom,
        product_type: dataset?.product_type,
        // product_type: this.Lists.find(item => String(item.id) == String(dataset?.product_type?.id)),
        // product_for: dataset.req_for_product_name,
        product_for: dict,
        quantity: dataset.qty,
        bs: dataset.bs,
        cc: dataset.cc,
        remarks: dataset.remarks,
      });

      if (data.commodity_id) {
        this.comid = data?.commodity_id?.id;
      }
      if (dataset.asset_data.pr_request == 1) {
        this.isReplace = false;
        this.selectedType = dataset.asset_data.pr_request.toString();
        this.isAsset = false;
        this.panelOpenState = true;
      }
      if (dataset.asset_data.pr_request == 2) {
        this.isReplace = true;

        this.selectedType = dataset.asset_data.pr_request.toString();
        this.isAsset = true;
        // this.selectedType = '2'
        this.assetArray.push(...dataset.asset_data.asset);
      }

      if (dataset?.product_requestfor == 3) {
        this.assetArrayy = dataset.product_requestfor_asset_data.asset;
        this.product_for = true;
      }
    });
  }

  // searchProducts(query: string) {
  //   this.isLoading = true;
  //   this.prposervice.getproductfn(this.comid, query, 1).subscribe(
  //     (results: any[]) => {
  //       this.isLoading = false;
  //       let datas = results["data"];
  //       let datapagination = results["pagination"];
  //       this.productList = datas;
  //       this.has_nextprod = datapagination.has_next;
  //       this.has_previousprod = datapagination.has_previous;
  //       this.currentpageprod = datapagination.index;
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     }
  //   );
  // }

  public displayFnbranch(branch?: branchlistss): string | undefined {
    if (!branch) return undefined;
    if (branch.id === -1) return 'ALL'; // Handle "ALL" option
    return `${branch.code} - ${branch.name}`;
  }


  getbranchFK() {
    this.SpinnerService.show();
    this.prposervice.getbranchdd().subscribe(
      (results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas);

        this.brForm.patchValue({
          branch_id: this.branchList[0],
        });
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
  /////////////////////////////////////////////////////////////////////////////

  public displayFncommodity(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }
  branch_id: any;
  getbrproduct() {
    this.getproduct_Asset()
    this.assetForm
      .get("product_name")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getproduct_Asset(value, this.branch_id, 1).pipe(
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

  getproductList() {
    if (this.assetArray.length > 0 && this.brForm.get('product').value) {
      if (window.confirm("Are you sure you want to change the Product?")) {
        this.assetArray = [];
      } else {
        return;
      }
    }
    else {
      this.getitemFKList()
      this.brForm
        .get("product")
        .valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice.getproductList(value, this.comid, this.product_type, 1).pipe(
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
  }
  getitemFKList() {
    if (this.brForm.get("commodity").value) {
      this.commoditty = this.brForm?.get("commodity")?.value?.id;
    }
    if (this.commoditty == undefined || this.commoditty == "" || this.commoditty == null) {
      this.notification.showInfo("Please Select Commodity");
      return;
    }
    if (!this.brForm.get("product_type").value) {
      this.notification.showInfo("Please Select Product Type");
      return;
    }
    this.prposervice
      .getproductList(this.itemInput.nativeElement.value, this.comid, this.product_type, 1)
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
  asset_id: any;
  assetList: any = [];
  getAsset(id) {
    if (id == 2) {
      let assetFormData = this.assetForm.value;
      let pid = assetFormData?.product_name?.id ? assetFormData?.product_name?.id : ""

      let make = assetFormData.items?.name
      let Model = assetFormData.models?.name
      let serial_no = assetFormData.serial_no;
      // if (!this.assetForm.get("request_for").value) {
      //   this.notification.showInfo("Please Select Request For");
      //   return;
      // }
      // if (!this.assetForm.get("product_name").value) {
      //   this.notification.showInfo("Please Select Product Name");
      //   return;
      // }
      this.isLoading = true
      this.prposervice
        .get_Asset_replacement(this.assetInput.nativeElement.value, this.branch_id, pid, 1, make, Model, serial_no)
        .subscribe((results) => {
          let datas = results["data"];
          this.assetList = datas;
          this.isLoading = false
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
    let branchFormData = this.brForm.value;
    let pid = branchFormData?.product_for?.id ? branchFormData?.product_for?.id : ""
    if (id == 1) {
      if (!this.brForm.get("product_for").value) {
        this.notification.showInfo("Please Select Request Product For");
        return;
      }
      this.prposervice
        .get_Asset(this.assetInputt.nativeElement.value, this.branch_id, pid, 1)
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
  prod_id: any;
  setProduct(item) {
    this.prod_id = item?.id;
    this.product_code = item?.code;
    console.log("this.prod_id", this.prod_id)
    this.product_selected = false;
  }
  getAssetId(id) {
    this.getAsset(id)
    if (id == 2) {
      let assetFormData = this.assetForm.value;
      let pid = assetFormData?.product_name?.id ? assetFormData?.product_name?.id : ""
      let make = assetFormData.items?.name
      let Model = assetFormData.models?.name
      let serial_no = assetFormData.serial_no;
      this.assetForm
        .get("asset_id")
        .valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice.get_Asset(value, this.branch_id, pid, 1, make, Model, serial_no).pipe(
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
    let brFormData = this.brForm.value;
    let pid = brFormData?.product_for?.id ? brFormData?.product_for?.id : ""
    if (id == 1) {
      this.brForm
        .get("asset_id")
        .valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice.get_Asset(value, this.branch_id, pid, 1).pipe(
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
  }
  getAssetId_replacement(id) {
    this.getAsset(id)
    if (id == 2) {
      let assetFormData = this.assetForm.value;
      let pid = assetFormData?.product_name?.id ? assetFormData?.product_name?.id : ""
      let make = assetFormData.items?.name
      let Model = assetFormData.models?.name
      let serial_no = assetFormData.serial_no;
      this.assetForm
        .get("asset_id")
        .valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice.get_Asset_replacement(value, this.branch_id, pid, 1, make, Model, serial_no).pipe(
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
    let brFormData = this.brForm.value;
    let pid = brFormData?.product_for?.id ? brFormData?.product_for?.id : ""
    if (id == 1) {
      this.brForm
        .get("asset_id")
        .valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap((value) =>
            this.prposervice.get_Asset(value, this.branch_id, pid, 1).pipe(
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
  }
  has_next_asset = true;
  has_previous_asset = true;
  current_ass = 1;
  autocompleteAssetScroll() {
    setTimeout(() => {
      if (
        this.assetDD &&
        this.autocompleteTrigger &&
        this.assetDD.panel
      ) {
        fromEvent(this.assetDD.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.assetDD.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.assetDD.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.assetDD.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.assetDD.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next_asset === true) {
                this.prposervice
                  .get_Asset(
                    this.assetInput.nativeElement.value, this.branch_id, this.assetForm.value.product_name.id,
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


  getproduct_Asset() {
    if (!this.assetForm.get("request_for").value) {
      // this.commoditty = this.brForm?.get("commodity")?.value?.id;
      this.notification.showInfo("Please Select Request For");
      return;
    }
    this.isLoading = true
    this.prposervice
      .getproduct_Asset('', this.branch_id, 1)
      .subscribe((results: any) => {
        let datas = results["data"];
        this.productList = datas;
        this.isLoading = false
        this.SpinnerService.hide();
        if (this.productList.length == 0) {
          this.notification.showInfo("No Product Specified!");
          this.SpinnerService.hide();
        }
      });
  }
  // getitemFK() {

  //   let rmkeyvalue: String = "";
  //   this.getRmEmployee(rmkeyvalue);
  // }
  // private getRmEmployee(rmkeyvalue: any) {
  //   this.prposervice
  //     .getproductfn(this.comid, rmkeyvalue, 1)
  //     .subscribe((results: any) => {
  //       let datas = results["data"];
  //       this.productList = datas;
  //     });
  // }
  // private getRmEmployee(rmkeyvalue: any) {
  //   if (this.brForm.get("commodity").value) {
  //     this.commoditty = this.brForm?.get("commodity")?.value?.id;
  //   }

  //   if (
  //     this.commoditty == undefined ||
  //     this.commoditty == "" ||
  //     this.commoditty == null
  //   ) {
  //     this.prposervice
  //       .getonlyproduct(this.itemInput.nativeElement.value, 1)
  //       .subscribe((results: any) => {
  //         let datas = results["data"];
  //         this.productList = datas;
  //         this.SpinnerService.hide();
  //         if (this.productList.length == 0) {
  //           this.notification.showInfo("No Product Specified!");
  //           this.SpinnerService.hide();
  //         }
  //       });
  //   } else {
  //     this.prposervice
  //       .getproductfn(this.comid, rmkeyvalue, 1)
  //       .subscribe((results: any) => {
  //         let datas = results["data"];
  //         this.productList = datas;
  //         this.SpinnerService.hide();
  //         if (this.productList.length == 0) {
  //           this.notification.showInfo("No Product Specified!");
  //           this.SpinnerService.hide();
  //         }
  //       });
  //   }
  // }

  getbrcommodity() {
    this.getCommodityFK()

    this.brForm
      .get("commodity")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice
            .getcommodityDependencyFKdd(this.brForm.value.mepno, value, 1)
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
          this.SpinnerService.hide();
        }
      );
  }

  getCommodityFK() {
    // if(this.brForm.value.brdetails.length >0 ){
    //   this.notification.showWarning("Here after, Commodity is not allowed to choose!!. If you want to change Commodity please DELETE the Product Below ")
    //   return false;
    // }
    this.SpinnerService.show();
    let productData = this.brForm.value.mepno;
    this.prposervice.getcommodityDependencyFK(productData, "").subscribe(
      (results: any[]) => {
        console.log("Commodity result==>", results);

        this.SpinnerService.hide();
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
                    this.brForm.value.mepno,
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

  resetAfterCommodityChange(type, commodity) {
    this.comid = commodity.id;
    console.log("<><><", this.comid);

    this.brForm.controls["product"].reset("");
    // let brFormData = this.brForm.value.brdetails;

    if (type == "removecom") {
      this.brForm.controls["commodity"].reset("");
    }
  }
  resetAfterCCommodityChange(type, data) {
    this.brForm.controls["commodity"].reset("");
    // let brFormData = this.brForm.value.brdetails;
    if (type == "removecom") {
      this.brForm.controls["commodity"].reset("");
    }
  }
  /////////////////////////////////////////////////////////////
  public displayFnproduct(prod?: productLists): string | undefined {
    return prod ? prod.name : undefined;
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
                if (this.brForm.value.supplier == "") {
                  this.prposervice
                    .getproductDependencyyFKdd(
                      this.brForm.value.type,
                      this.brForm.value.commodity.id,
                      this.brForm.value.dts,
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
                    .getproductDependencyFKdd(
                      this.brForm.value.type,
                      this.brForm.value.commodity.id,
                      this.brForm.value.supplier.id,
                      this.brForm.value.dts,
                      this.productInput.nativeElement.value,
                      this.currentpageprod + 1,
                      false
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
  resetAfterProductChange(type, data) {
    // this.brForm.controls["product"].reset("");
    // let brFormData = this.brForm.value.brdetails;
    if (data == "removeProd") {
      this.brForm.controls["product"].reset("");
      // this.assetForm.controls["product_name"].reset("");
    }
    if (data == "removeProdB") {
      // this.brForm.controls["product"].reset("");
      // this.assetForm.controls["product_name"].reset("");
      this.assetForm.get("product_name").reset("");
    }

    if (type == "removeProdF") {
      this.brForm.controls["product_for"].reset("");
      // this.brForm.controls["product"].reset("");
      // this.assetForm.controls["product_name"].reset("");
    }

    if (data == "request_for") {
      // this.brForm.controls["product"].reset("");
      // this.assetForm.controls["request_for"].reset("");
      this.assetForm.get("request_for").reset("");

    }
    if (data == "asset") {
      // this.brForm.controls["product"].reset("");
      // this.assetForm.controls["asset_id"].reset("");
      this.assetForm.get("asset_id").reset("");


    }
    if (data == "asset_id") {
      // this.brForm.controls["product"].reset("");
      this.brForm.controls["asset_id"].reset("");
    }
  }
  ///////////////////////////////////////////////////////////////

  currentpagebs = 1;
  has_nextbs = true;
  has_previousbs = true;

  getbrbs() {
    this.getbsdd()
    this.brForm
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

  }

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
  // getccValue(){
  //   this.SpinnerService.show();

  // }
  resetAfterbsccbsChange() {
    this.brForm.get("bs").reset("");
  }
  ccclear(bs) {
    this.bsid = bs.id;
    console.log("<><><><<?<", this.bsid);
    this.bsname = bs.name;
    console.log(",.,.,.,.,.,.,.,.,.,.,.", this.bsname);
  }
  getccValue() {
    let BsLine = this.bsid;

    if (this.editKey == 1) {
      BsLine = this.bslist[0].id;
    }

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
  public displayFncc(cc?: cclistss): any | undefined {
    if (typeof cc === "string") {
      return cc;
    }
    return cc ? cc.name : undefined;
  }
  get uomtype() {
    return this.brForm.get("uom");
  }
  public displayFnuom(uomtype?: any): string | undefined {
    if (typeof uomtype === "string") {
      return uomtype;
    }
    return uomtype ? uomtype?.name : undefined;
  }

  // getPrccbsIndex(index) {
  //   this.selectedCCBSindex = index
  //   // console.log("this.selectedCCBSindex", this.selectedCCBSindex)
  // }

  PRSubmit() { }
  onCancelClick() {
    if (this.assetArray.length >= 1 && this.isadd) {
      let con = confirm("Are you sure want to Cancel?");
      if (!con) {
        return;
      } else {
        this.brForm.reset({
          branch_id: this.brForm.get('branch_id')?.value
        });
         this.product_for=false
        this.assetForm.reset();
        // this.router.navigate(['/prpo/pr'], { skipLocationChange: true });
        this.onCancel.emit();
      }
    } else {
      this.brForm.reset({
        branch_id: this.brForm.get('branch_id')?.value
      });
      this.product_for=false
      this.assetForm.reset();

      // this.router.navigate(['/prpo/pr'], { skipLocationChange: true });
      this.onCancel.emit();
    }
  }
  public displayFnAsset(item): string | undefined {
    return item ? item.assetid : undefined;
  }
  public displayFnitem(item?: itemsLists): string | undefined {
    return item ? item.name : undefined;
  }
  public displayFnProduct(item): string | undefined {
    return item ? item.name : undefined;
  }
  autocompleteitemScroll() {
    this.has_nextprodd = true;
    this.has_previousprodd = true;
    this.currentpageprodd = 1;
    console.log("has next of item==>", this.has_nextprodd);
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
                  .getproductList
                  (

                    this.itemInput.nativeElement.value,
                    this.comid,
                    this.product_type,
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

  getbruom() {
    this.getuom()
    this.brForm
      .get("uom")
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
      .subscribe(
        (results: any[]) => {
          let datas = results["data"];
          this.uomlist = datas;
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
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
              if (this.has_nextu === true) {
                this.prposervice
                  .getuomFKdd(
                    this.uomInput.nativeElement.value,
                    this.currentpageuom + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.uomlist.length >= 0) {
                      this.uomlist = this.uomlist.concat(datas);
                      this.has_nextu = datapagination.has_next;
                      this.has_previousu = datapagination.has_previous;
                      this.currentpageuom = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  ccscroll() {
    setTimeout(() => {
      if (
        this.matuomAutocompletecc &&
        this.matuomAutocompletecc &&
        this.matuomAutocompletecc.panel
      ) {
        fromEvent(this.matuomAutocompletecc.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matuomAutocompletecc.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matuomAutocompletecc.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matuomAutocompletecc.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matuomAutocompletecc.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcc === true) {
                this.prposervice
                  .getuomFKdd(
                    this.ccInput.nativeElement.value,
                    this.currentpageuom + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.uomlist.length >= 0) {
                      this.uomlist = this.uomlist.concat(datas);
                      this.has_nextcc = datapagination.has_next;
                      this.has_previouscc = datapagination.has_previous;
                      this.currentpagecc = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  productclick(item) {
    this.productidss = item.id;
    this.productname = item.name;
  }
  uomclick(uom) {
    this.uomname = uom.name;
  }
  resetAfterSccccbsChange() {
    //7421
    this.brForm.get("cc").reset("");
  }
  ccname(cc) {
    this.ccnames = cc.name;
  }
  Products: boolean = true;
  Services: boolean = false;
  listValue: any;
  product_type: any;
  product_type_name: any;
  product_for: boolean = false;
  product_service(e) {
    this.product_type = e.id;
    this.product_type_name = e.name;
    this.brForm.get('product').reset();
    if (this.product_type_name == "Component" || this.product_type_name == "Service" || this.product_type_name == "Software") {
      this.product_for = true;
    } else {
      this.product_for = false;
      this.assetArrayy = [];
      this.brForm.get('product_for').reset();
      this.brForm.get('asset_id').reset();
    }
    // this.hardware = value == "1" ? true : false;
    // this.Services = value == "2" ? true : false;
    // if(this.Services){
    //   this.prForm.get('dts').setValue(0);
    //   this.prForm.get('dts').disable();
    // } else {
    //   this.prForm.get('dts').enable();
    // }
    // this.resetAfterCatlogChange();

  }
  pr_asset = [];
  brrSubmit() {
    if (this.selectedType == "2" && this.assetArray.length == 0) {
      this.notification.showInfo("Please Add Asset Details!");
      this.isReplace = false;
      this.isAsset = true;
      this.panelOpenState = false;
      return;
    } else if (!this.brForm.get("commodity").value) {
      this.notification.showError("Please Choose Commodity");
      this.panelOpenState = true;
      return;
    } else if (!this.brForm.get("product").value) {
      this.notification.showError("Please Choose Product");
      this.panelOpenState = true;
      return;
    } else if (!this.brForm.get("uom").value) {
      this.notification.showError("Please Choose UOM");
      this.panelOpenState = true;
      return;
    } else if (!this.brForm.get("quantity").value) {
      this.notification.showError("Please Choose Quantity");
      this.panelOpenState = true;
      return;
    } else if (!this.brForm.get("bs").value) {
      this.notification.showError("Please Choose BS");
      this.panelOpenState = true;
      return;
    } else if (!this.brForm.get("cc").value) {
      this.notification.showError("Please Choose CC");
      this.panelOpenState = true;
      return;
    }

    if (this.editKey == 1) {
      // let prdetails = [];
      // prdetails = 
      for (let i = 0; i < this.assetArray.length; i++) {
        //   let clonedDetail = { ...prdetails[0] };

        let podetail_id = this.assetArray[i]?.podetails_id;
        let asset_id = this.assetArray[i]?.assetid || this.assetArray[i]?.asset_id;
        let id = this.assetArray[i]?.id;
        let serial_no = this.assetArray[i]?.serial_no;
        let status = this.assetArray[i]?.status ?? 1;

        let assetDict = {
          podetail_id: podetail_id,
          asset_id: asset_id,
          serial_no: serial_no,
          id: id,
          status: status
        };
        this.assetDict.push(assetDict);
        //   clonedDetail.asset = assetDict;

        //   this.pr_asset.push(clonedDetail);
      }

      for (let i = 0; i < this.assetArrayy.length; i++) {
        //   let clonedDetail = { ...prdetails[0] };

        // let podetail_id = this.assetArrayy[i]?.podetails_id;
        let asset_id = this.assetArrayy[i]?.assetid || this.assetArrayy[i]?.asset_id;
        let id = this.assetArrayy[i]?.id;
        let serial_no = this.assetArrayy[i]?.serial_no;
        let status = this.assetArrayy[i]?.status ?? 1;


        let assetDictt = {
          // podetail_id: podetail_id,
          asset_id: asset_id,
          serial_no: serial_no,
          id: id,
          status: status
        };
        this.assetDictt.push(assetDictt);
        //   clonedDetail.asset = assetDict;

        //   this.pr_asset.push(clonedDetail);
      }
      let currentDate = new Date().toJSON().slice(0, 10);

      // console.log("Updated pr_asset", this.pr_asset);

      this.payload = {
        id: this.prid,
        commodity_id: this.brForm.get("commodity").value.id,
        "bir_type": 1,
        employee_id: this.employeeid,
        branch_id: this.brForm.get("branch_id")?.value?.id,
        remarks: this.brForm.get("remarks").value || "",
        pr_request: Number(this.selectedType),
        req_for_product_id: this.brForm.get("product_for")?.value?.id || 0,
        req_for_product_name: this.brForm.get("product_for")?.value?.name || this.brForm.get("product_for")?.value?.product_fullname || "",
        asset: this.assetDict || [],
        "req_for_make_id": 0,
        "req_for_make_name": "",
        "req_for_model_id": 0,
        "req_for_model_name": "",
        "amc_start_date": currentDate,
        "amc_end_date": currentDate,
        product_requestfor: this.product_for ? 3 : 0,
        product_requestfor_asset: this.assetDictt || [],
        asset_delete: this.del,
        prdetails: [
          {
            id: this.prdetails_id,
            product_id: this.brForm.get("product").value.id,
            product_name: this.brForm.get("product").value.name,
            product_type: this.brForm.get("product_type").value?.id.toString(),
            qty: this.brForm.get("quantity").value,
            uom: this.brForm.get("uom").value,
            prccbs: [
              {
                id: this.prccbs_id,
                branch_id: this.brForm.get("branch_id")?.value?.id,
                bs: this.brForm.get("bs").value || this.bsname,
                cc: this.brForm.get("cc").value || this.ccnames,
                qty: this.brForm.get("quantity").value,
              },
            ],
          },
        ],
        file_key: ["fileheader"],
      };
      console.log("cc", this.ccnames);

      let datavalue = JSON.stringify(this.payload);
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

      // const formData = new FormData();
      // formData.append('data', JSON.stringify(this.payload));
      // this.selectedFiles.forEach((file, index) => {
      //   formData.append('files', file, file.name);
      // });

      this.SpinnerService.show();

      this.prposervice.Branchcreate(formdata).subscribe((res) => {
        this.SpinnerService.hide();
        if (res?.code) {
          this.SpinnerService.hide()
          this.notification.showError(res?.description)
          return false
        }
        if (res.status == "success") {
          this.notification.showSuccess("Updated Successfully!");
          this.assetDict = [];
          this.assetArray = [];
          this.onSubmit.emit();
              this.brForm.reset({
        branch_id: this.brForm.get('branch_id')?.value
      });
       this.product_for=false
          // this.router.navigate(['/prpo/pr'], { skipLocationChange: true })
        } else {
          this.notification.showError(res.description);
          this.assetDict = [];
          // this.assetArray = [];
        }
        this.SpinnerService.hide();
      });
    }
    if (this.editKey != 1) {
      // let prdetails = [];
      for (let i = 0; i < this.assetArray.length; i++) {
        //   let clonedDetail = { ...prdetails[0] };

        // let podetail_id = this.assetArray[i]?.podetails_id;
        let asset_id = this.assetArray[i]?.assetid;
        let serial_no = this.assetArray[i]?.serial_no;

        // let id = this.assetArray[i]?.id;
        let assetDict = {
          // podetail_id: podetail_id,
          asset_id: asset_id,
          serial_no: serial_no,
          status: 1
          // id:id
        };
        this.assetDict.push(assetDict);
        //   clonedDetail.asset = assetDict;

        //   this.pr_asset.push(clonedDetail);
      }

      for (let i = 0; i < this.assetArrayy.length; i++) {

        let asset_id = this.assetArrayy[i]?.assetid;
        let serial_no = this.assetArrayy[i]?.serial_no;

        let assetDictt = {
          asset_id: asset_id,
          serial_no: serial_no,
          status: 1
        };
        this.assetDictt.push(assetDictt);

      }


      // for (let i = 0; i < this.assetArray.length; i++) {
      //   let clonedDetail = { ...prdetails[0] };

      //   let podetail_id = this.assetArray[i].podetail_id;
      //   let asset_id = this.assetArray[i].asset_id;

      //   let assetDict = {
      //     podetail_id: podetail_id,
      //     asset_id: asset_id,
      //   };

      //   clonedDetail.asset = assetDict;

      //   this.pr_asset.push(clonedDetail);
      // }

      // console.log("Updated pr_asset", this.pr_asset);
      let currentDate = new Date().toJSON().slice(0, 10);
      this.clickvalue = this.shareService.clickedvalue.value


      if (this.clickvalue == 2) {
        this.birtype = 2
      }
      else {
        this.birtype = 1
      }

      this.payload = {
        commodity_id: this.brForm.get("commodity").value.id,
        employee_id: this.employeeid,
        branch_id: this.branchid,
        // bir_type:1, 
        bir_type: this.birtype,
        pr_request: Number(this.selectedType),
        req_for_product_id: this.brForm.get("product_for")?.value?.id || 0,
        req_for_product_name: this.brForm.get("product_for")?.value?.name || "",
        // req_for_product:  this.brForm.get("product_for")?.value || "",
        asset: this.assetDict || [],
        "req_for_make_id": 0,
        "req_for_make_name": "",
        "req_for_model_id": 0,
        "req_for_model_name": "",
        "amc_start_date": currentDate,
        "amc_end_date": currentDate,
        product_requestfor: this.product_for ? 3 : 0,
        product_requestfor_asset: this.assetDictt || [],
        remarks: this.brForm.get("remarks").value || [],
        prdetails: [
          {
            product_id: this.brForm.get("product").value.id,
            product_name: this.brForm.get("product").value.name,
            product_type: this.brForm.get("product_type").value.id,
            qty: this.brForm.get("quantity").value,
            uom: this.brForm.get("uom").value,
            prccbs: [
              {
                id: this.prccbs_id,
                branch_id: this.brForm.get("branch_id").value.id,
                bs: this.brForm.get("bs").value || this.bsname,
                cc: this.brForm.get("cc").value || this.ccnames,
                qty: this.brForm.get("quantity").value,
              },
            ],
          },
        ],
        file_key: ["fileheader"],
      };
      console.log("cc", this.ccnames);
      // const formData = new FormData();
      // formData.append('data', JSON.stringify(this.payload));
      // this.selectedFiles.forEach((file, index) => {
      //   formData.append('files', file, file.name);
      // });

      let datavalue = JSON.stringify(this.payload);
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
      this.SpinnerService.show();

      this.prposervice.Branchcreate(formdata).subscribe((res) => {
        this.SpinnerService.hide();
        // if(res?.code){
        //   this.SpinnerService.hide()
        //   this.notification.showError(res?.description)
        //   return false
        // }
        if (res.status == "success") {
          this.notification.showSuccess("Successfully Created!");
          this.assetDict = [];
          this.assetArray = [];
          this.onSubmit.emit();
            this.brForm.reset({
        branch_id: this.brForm.get('branch_id')?.value
      });
       this.product_for=false
          // Reset the shared service value
          this.shareService.clickedvalue.next(null);
          // this.router.navigate(['/prpo/pr'], { skipLocationChange: true })
        } else {
          this.notification.showError(res.description);
          this.assetDict = [];

          // this.assetArray = [];
        }
        this.SpinnerService.hide();
      });
    }
  }
  getEmployeeBranchData() {
    this.SpinnerService.show();
    this.prposervice.getEmpBranchId().subscribe(
      (results: any) => {
        this.SpinnerService.hide();
        if (results.error) {
          this.SpinnerService.hide();
          this.notification.showWarning(results.error + results.description);
          this.brForm["branch_id"].reset("");
          return false;
        }
        let datas = results;
        this.empBranchdata = datas;
        this.branchid = this.empBranchdata.id;
        this.branch_id = this.empBranchdata.id;
        this.employeeid = this.empBranchdata.employee_id;
        this.employeeid = parseInt(this.empBranchdata.employee_id, 10);
        console.log("this.branchid==>", this.empBranchdata.id, this.employeeid);
        console.log("empBranchdata", datas);
        this.brForm.patchValue({
          branch_id: this.empBranchdata,
        });
        this.assetForm.patchValue({
          request_for: this.empBranchdata
        })
        console.log(this.brForm.value);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
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

  // onFileSelectedHeader(e) {
  //   const filesArray = this.filesHeader.value.file_upload || [];
  //   for (let i = 0; i < e.target.files.length; i++) {
  //       filesArray.push(e.target.files[i]);
  //   }
  //   this.filesHeader.patchValue({ file_upload: filesArray });
  //   console.log("checkvalue", this.filesHeader.value.file_upload);
  // }

  // HeaderFilesDelete() {
  //   this.filesHeader.patchValue({ file_upload: [] });
  //   console.log("checkvalue", this.filesHeader.value.file_upload);
  //   this.takeInput.nativeElement.value = "";
  // }
  isReplace: boolean = false;
  panelOpenState = true;
  previousType: string = "1"; // To track the previous selection
  // showPopup: boolean = false;
  isReplacement(event: any) {
    if (event === "1" && this.assetArray.length >= 1 && this.isadd) {
      let con = confirm("Are you sure want to change to New?");

      if (!con) {
        // Revert the selection if the user cancels
        // Use setTimeout to delay the model update until after Angular renders the radio button change
        setTimeout(() => {
          this.selectedType = this.previousType;
        }, 0);
        return;
      }
    }
    // if(event === "2"){
    //   if(!this.brForm.get('product').value){
    //     this.notification.showError("Select Product Name!");
    //     setTimeout(() => {
    //       this.selectedType = this.previousType;
    //     }, 0);
    //     return;
    //   } else {
    //     this.showPopup = true;
    //   }
    // }
    // If confirmed, update the previous value
    this.previousType = event;
    this.isReplace = event == 2 ? false : true;
    this.isAsset = event == 2 ? true : false;

    this.panelOpenState = event == 2 ? false : true;
    this.assetForm.reset();
    // this.brForm.reset();
    this.brForm.patchValue({
      branch_id: this.empBranchdata,
    });
    this.assetForm.patchValue({
      request_for: this.empBranchdata
    })
    // this.assetForm.patchValue({
    //   product_name: this.empBranchdata
    // })
    // this.getEmployeeBranchData();
  }
  type = [
    { id: '1', text: 'New' },
    { id: '2', text: 'Replacement' },
    // {id:'3', text: 'Software'},
    // {id:'4', text: 'Service'}
  ]
  getbrbranch() {
    this.getbranchFK();

    this.assetForm.get("request_for")
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
  // isReplacement(event){
  //   console.log("Toogllge eve",event)

  //   let value = event.value
  //   this.isReplace = value == 2 ? true : false;
  //   this.panelOpenState = value == 2 ? false : true;
  //   if(value == 2 && this.assetArray.length >= 1){
  //     let con = confirm("Are you sure want to change?");
  //     if(!con){
  //          this.selectedType = value
  //     }
  //   }
  // }
  assetArray: any = [];
  //  assetArray = [
  //   {
  //     asset_id: "KVBF24NONE00001",
  //     id: 1,
  //     serial_no: "SN00001",
  //     prdetails_id: 1001,
  //     podetails_id: 2343,
  //     product: "Laptop",
  //     make: "Dell",
  //     model: "XPS 15",
  //     config: "16GB RAM, 512GB SSD",
  //     unit_price: 1500,
  //   },
  //   {
  //     asset_id: "KVBF24NONE00002",
  //     id: 2,
  //     serial_no: "SN00002",
  //     prdetails_id: 1002,
  //     podetails_id: 2344,
  //     product: "Monitor",
  //     make: "HP",
  //     model: "Z27",
  //     config: "27-inch, 4K",
  //     unit_price: 500,
  //   },
  //   {
  //     asset_id: "KVBF24NONE00003",
  //     id: 3,
  //     serial_no: "SN00003",
  //     prdetails_id: 1003,
  //     podetails_id: 2345,
  //     product: "Keyboard",
  //     make: "Logitech",
  //     model: "MX Keys",
  //     config: "Wireless",
  //     unit_price: 100,
  //   },
  //   {
  //     asset_id: "KVBF24NONE00004",
  //     id: 4,
  //     serial_no: "SN00004",
  //     prdetails_id: 1004,
  //     podetails_id: 2346,
  //     product: "Mouse",
  //     make: "Razer",
  //     model: "DeathAdder",
  //     config: "Wireless, RGB",
  //     unit_price: 70,
  //   },
  //   {
  //     asset_id: "KVBF24NONE00005",
  //     id: 5,
  //     serial_no: "SN00005",
  //     prdetails_id: 1005,
  //     podetails_id: 2347,
  //     product: "Smartphone",
  //     make: "Apple",
  //     model: "iPhone 14 Pro",
  //     config: "128GB, Space Gray",
  //     unit_price: 1200,
  //   },
  //   {
  //     asset_id: "KVBF24NONE00006",
  //     id: 6,
  //     serial_no: "SN00006",
  //     prdetails_id: 1006,
  //     podetails_id: 2348,
  //     product: "Tablet",
  //     make: "Samsung",
  //     model: "Galaxy Tab S8",
  //     config: "128GB, Wi-Fi",
  //     unit_price: 700,
  //   },
  //   {
  //     asset_id: "KVBF24NONE00007",
  //     id: 7,
  //     serial_no: "SN00007",
  //     prdetails_id: 1007,
  //     podetails_id: 2349,
  //     product: "Printer",
  //     make: "Canon",
  //     model: "PIXMA G5020",
  //     config: "Inkjet, Wireless",
  //     unit_price: 250,
  //   },
  // ];

  patchProduct() {
    this.assetForm.get('product_name').setValue(this.brForm.get('product').value)
    this.prod_id = this.assetForm.get('product_name')?.value?.id
    // this.product_selected = false
    this.selectedType = '2'
    // this.assetForm.patchValue({
    //   product_name: this.brForm.get('product').value
    // })
    this.showpopup = false;
  }
  closePopup() {
    this.showpopup = true
    this.close.emit();
    // this.onCancel.emit();
  }
  isadd: boolean = false;
  assetDict: any = [];
  assetDictt: any = [];

  specification: any = [];
  getSpecificationKeys(specification: any): string[] {
    return specification ? Object.keys(specification) : [];
  }
  addAssett() {
    let asset_value = this.brForm.get("asset_id").value.assetid;
    let pid = this.brForm.get("product_for").value.id;
    if (asset_value == "" || asset_value == null || asset_value == undefined) {
      this.notification.showInfo("Select an Asset ID to Add!");
      return;
    }
    this.SpinnerService.show();
    this.prposervice.
      get_Asset(asset_value, this.branch_id, pid, 1)
      .subscribe(
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
          } else if (res['code'] == "Asset ID Already Exists") {
            let assetArr: any = [];
            assetArr = res.description['Asset ID'];
            let assets = assetArr.map((x) => x.error);
            this.notification.showInfo(assets.join('\n'));
          }
          else {
            this.notification.showInfo(res.description);
            this.SpinnerService.hide();
          }
          this.isadd = true;
          this.brForm.get('product_for').reset()
          this.brForm.get('prod_type_asset').reset()
          this.brForm.get("asset_id").reset();
        },
        (error) => {
          this.SpinnerService.hide();
          this.notification.showError(error);

        }
      );
  }
  assetArrayy: any = [];
  addAsset() {
    let asset_value = this.assetForm.get("asset_id").value?.assetid;
    if (asset_value == "" || asset_value == null || asset_value == undefined) {
      this.notification.showInfo("Select an Asset ID to Add!");
      return;
    }
    for(let x of this.assetArray){
      if((x?.assetid || x?.asset_id)===asset_value){
    this.notification.showInfo("Asset Already Chosen Against This Branch Indent Request");
    return
      }
    }
    let brformdata = this.assetForm.value;
    let pid = brformdata?.product_name?.id ? brformdata?.product_name?.id : "";
    let make_name = brformdata?.items?.name
    let make_model = brformdata?.models?.name
    let serial_no = brformdata?.serial_no;
    this.SpinnerService.show();
    this.prposervice.
      get_Asset_replacement(asset_value, this.branch_id, pid, 1, make_name, make_model, serial_no)
      .subscribe(
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
            this.assetArray.push(res["data"][0]);
            // let podetail_id = res.podetail_id
            // let asset_id = res.asset_id
            // let dict = {
            //   podetail_id : res.podetail_id,
            //   asset_id : res.asset_id
            // }
            // this.assetDict.push(dict)

            this.SpinnerService.hide();
          } else if (res['code'] == "Asset ID Already Exists") {
            this.SpinnerService.hide();
            let assetArr: any = [];
            assetArr = res.description['Asset ID'];
            // let assets = assetArr.map((x) => x.error);
            // this.notification.showInfo(assets.join('\n')); 
            const message = assetArr.map(x => x.error).join('<br><br>');
            this.toastService.info(message, '', {
              enableHtml: true,
              timeOut: 5000,
            });
          }
          else {
            this.notification.showInfo(res.description);
            this.SpinnerService.hide();
          }
          this.isadd = true;
          this.assetForm.get('asset_id').reset('');
        },
        (error) => {
          this.SpinnerService.hide();
          this.notification.showError(error);
        }
      );
  }
  getbranch(branch) {
    this.branch_id = branch?.id;
    this.assetForm.get('asset_id').reset('');
  }
  resetAsset() {
    this.assetForm.reset();
  }
  del: any = [];
  deleteAsset(data, i) {
    if (this.editKey != 1) {
      this.assetArray.forEach((e, ind) => {
        if (i === ind) {
          this.assetArray.splice(i, 1);
        }
      });
    }
    if (this.editKey == 1 && data.id != undefined) {
      let con = confirm("Are you sure want to Delete?");
      if (con) {
        this.assetArray.forEach((e, ind) => {
          if (i === ind) {
            // this.assetArray.splice(i, 1);
            this.del.push(data.id);
            this.assetArray[i].status = 0;
          }
        });
      }
      else
        return
    }
    if (this.editKey == 1 && data.id == undefined) {
      this.assetArray.forEach((e, ind) => {
        if (i === ind) {
          this.assetArray.splice(i, 1);
          // this.del.push(data.id);
        }
      });
    } else {
      return
    }
  }
  dell: any = [];
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
      }
      else
        return
    }
    if (this.editKey == 1 && data.id == undefined) {
      this.assetArrayy.forEach((e, ind) => {
        if (i === ind) {
          this.assetArrayy.splice(i, 1);
          // this.del.push(data.id);
        }
      });
    } else {
      return
    }
  }

  toUpperCase(event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.assetForm.get("asset_id")?.setValue(input.value);
  }
  getConf(): void {
    let typeId = 0;
    if (this.product_type1 == "" || this.product_type1 == null || this.product_type1 == undefined) {
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
      this.prposervice.getprodname(this.product_type1, 1, "").subscribe((res) => {
        this.specsList = res["data"];
      });
    }

    this.brForm
      .get("product_for")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.prposervice.getConf_for(1, this.product_type1, value).pipe(
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

  // getConf(): void {
  //   if (this.product_type_name === "Service") {
  //     this.prposervice.getConf_for(1, 2).subscribe((res) => {
  //       this.specsList = res["data"];
  //     });
  //   } 
  //   if (this.product_type_name === "Component") {
  //     this.prposervice.getConf_for(1, 1).subscribe((res) => {
  //       this.specsList = res["data"];
  //     });
  //   } 
  //   if (this.product_type_name === "Software") {
  //     this.prposervice.getConf_for(1, 3).subscribe((res) => {
  //       this.specsList = res["data"];
  //     });
  //   } 

  //   this.brForm
  //   .get("product_for")
  //   .valueChanges.pipe(
  //     debounceTime(100),
  //     distinctUntilChanged(),
  //     tap(() => {
  //       this.isLoading = true;
  //     }),
  //     switchMap((value) =>
  //       this.prposervice.getConf_for(1, 1, value).pipe(
  //         finalize(() => {
  //           this.isLoading = false;
  //         })
  //       )
  //     )
  //   )
  //   .subscribe(
  //     (results: any[]) => {
  //       let datas = results["data"];
  //       this.specsList = datas;
  //     },
  //     (error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     }
  //   );
  // }
  specsList: any = [];

  product_selected: boolean = true
  modelList: any
  makeList: any
  product_code: any
  currentpageitem = 1;
  has_previousitem = false;
  has_nextitem = false;
  make_id: any
  currentpagemodel = 1;
  has_nextmodel = false;
  has_previousmodel = false;
  @ViewChild("model") matmodelAutocomplete: MatAutocomplete;
  @ViewChild("modelInput") modelInput: any;
  getitemFK() {
    this.product_code = this.assetForm.value.product_name.code
    this.SpinnerService.show();
    if (
      this.product_code == ""
    ) {
      this.notification.showError("Kindly Choose Product!");
      this.SpinnerService.hide();
      return false;
    } else {
      this.prposervice.getMake(this.assetForm.value.product_name.code, "", 1).subscribe(
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
  makeCheck(data) {
    this.make_id = data?.id;
  }

  getmodall() {
    this.SpinnerService.show();
    if (this.make_id == undefined || this.make_id == "") {
      this.notification.showError("Choose Make!");
      this.SpinnerService.hide();
      return false;
    } else {
      this.prposervice.getModal(this.assetForm.value.product_name.code, this.make_id, 1).subscribe(
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
                    this.assetForm.value.product.id,
                    this.assetForm.value.dts,
                    this.assetForm.value.items.id,
                    this.assetForm.value.supplier,
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

  autocompleteitemScrollmake() {
    setTimeout(() => {
      if (
        this.matitemmakeAutocomplete &&
        this.autocompleteTrigger &&
        this.matitemmakeAutocomplete.panel
      ) {
        fromEvent(this.matitemmakeAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matitemmakeAutocomplete.panel.nativeElement.scrollTop),
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
                  .getMake
                  (
                    this.assetForm.value.product_name.code,
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

  getProductTypes() {
    this.isLoading = true
    this.reportService.getpdtclasstype('', 1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading = false
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
    this.isLoading = true
    this.reportService.getpdtclasstype(this.productInput.nativeElement.value, 1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading = false
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
                  .getpdtclasstype(this.productInput.nativeElement.value, this.producttype_crtpage + 1)
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