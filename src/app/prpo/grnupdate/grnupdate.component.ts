import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ErrorHandlingService } from "src/app/rems/error-handling.service";
import { ReportserviceService } from "src/app/reports/reportservice.service";
import { SharedService } from "src/app/service/shared.service";
import { fromEvent, Notification } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { MatCheckbox } from "@angular/material/checkbox";

export interface assetlists {
  asset_id: string;
  assetid: string;
  grndetail_id: number;
  serial_no: string;
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

@Component({
  selector: "app-grnupdate",
  templateUrl: "./grnupdate.component.html",
  styleUrls: ["./grnupdate.component.scss"],
})
export class GrnupdateComponent implements OnInit {
  finalsubmitarray: any[] = [];
  imagesarray: any;
  showsumamry: boolean = false;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private reportService: ReportserviceService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService,
    private sharedService: SharedService,
    private toastr: ToastrService
  ) { }

  @ViewChild("supplier") matsupplierAutocomplete: MatAutocomplete;
  @ViewChild("supplierInput") supplierInput: any;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("productcat") matproductAutocomplete: MatAutocomplete;
  @ViewChild("productInput") productInput: any;
  @ViewChild("productInput_type") productInput_type: any;
  @ViewChild("item") matitemAutocomplete: MatAutocomplete;
  @ViewChild("itemInput") itemInput: any;
  @ViewChild("branch") matbranchAutocomplete: MatAutocomplete;
  @ViewChild("productauto") productAutocomplete: MatAutocomplete;
  @ViewChild("productauto_type") productauto_typeAutocomplete: MatAutocomplete;
  @ViewChild("branchInput") branchInput: any;
  @ViewChild("assetInput") assetInput: any;
  @ViewChild("assetd") matassetAutocomplete: MatAutocomplete;
  grnAssetform: FormGroup;
  fileform: FormGroup;
  selectallfg = new FormControl();
  grnAssetsList: any = [];
  branchList: Array<branchlistss>;
  supplierList: Array<supplierlistss>;
  currentpageasset = 1;
  has_nextassset = false;
  has_previousasset = false;
  grn_summary_crt = 1;
  grn_summary_hasnext = false;
  grn_summary_hasprevious = false;
  currentpageasset_po = 1;
  has_nextassset_po = false;
  has_previousasset_po = false;
  producttype_crtpage = 1;
  producttype_next = false;
  producttype_pre = false;
  producttype_crtpage_name = 1;
  producttype_next_name = false;
  producttype_pre_name = false;
  has_nextccbs = false;
  has_previousccbs = false;
  currentpageccbs: number = 1;
  presentpageccbs: number = 1;
  currentpagesupplier = 1;
  has_nextsupplier = true;
  has_previoussupplier = true;
  isLoading = false;
  prdTypes: any = [];
  prdNames: any;
  obj: any;
  finalObj: any;
  selectedTypeQ: any = "";
  grnupdatesummary: any[] = [];

  ngOnInit(): void {
    this.grnAssetform = this.fb.group({
      asset_id: [""],
      serial_no: [""],
      branchname: [""],
      product_id: [""],
      product_type: [""],
      supplier_id: [""],
      po_no: [""],
      invoice_no: [""],
      fromdate: [""],
      todate: [""],
    });
    this.fileform = this.fb.group({
      images: [""],
    });
  }
  refreshPage() {
    this.grnAssetform.reset();
    this.selectedTypeQ = "";
  }
  getgrnAssetlists() {
    let sNo = this.grnAssetform.get("serial_no").value;
    if (sNo !== "" || sNo !== null || sNo !== undefined) {
      this.reportService
        .getgrnAssets("", 1, sNo)
        .subscribe((results: any[]) => {
          if (results) {
            let datas = results["data"];
            this.grnAssetsList = datas;
            let datapagination = results["pagination"];

            if (this.grnAssetsList.length >= 0) {
              this.has_nextassset = datapagination.has_next;
              this.has_previousasset = datapagination.has_previous;
              this.currentpageasset = datapagination.index;
            }
          }
        });
    } else {
      this.reportService
        .getassetDropdownFKdd("", 1)
        .subscribe((results: any[]) => {
          if (results) {
            let datas = results["data"];
            this.grnAssetsList = datas;
          }
        });
    }
  }
  input_getgrnAssetlists() {
    let sNo = this.grnAssetform.get("serial_no").value;
    if (sNo !== "" || sNo !== null || sNo !== undefined) {
      this.reportService
        .getgrnAssets(this.assetInput.nativeElement.value, 1, sNo)
        .subscribe((results: any[]) => {
          if (results) {
            let datas = results["data"];
            this.grnAssetsList = datas;
            let datapagination = results["pagination"];

            if (this.grnAssetsList.length >= 0) {
              this.has_nextassset = datapagination.has_next;
              this.has_previousasset = datapagination.has_previous;
              this.currentpageasset = datapagination.index;
            }
          }
        });
    } else {
      this.reportService
        .getassetDropdownFKdd("", 1)
        .subscribe((results: any[]) => {
          if (results) {
            let datas = results["data"];
            this.grnAssetsList = datas;
          }
        });
    }
  }
  autocompleteassetScroll() {
    setTimeout(() => {
      if (
        this.matassetAutocomplete &&
        this.autocompleteTrigger &&
        this.matassetAutocomplete.panel
      ) {
        fromEvent(this.matassetAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matassetAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matassetAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matassetAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matassetAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextassset === true) {
                this.reportService
                  .getgrnAssets(
                    this.assetInput.nativeElement.value,
                    this.currentpageasset + 1,
                    this.grnAssetform.get("serial_no").value ?? ""
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.grnAssetsList = this.grnAssetsList.concat(datas);
                      if (this.grnAssetsList.length >= 0) {
                        this.has_nextassset = datapagination.has_next;
                        this.has_previousasset = datapagination.has_previous;
                        this.currentpageasset = datapagination.index;
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
  getbranchFK() {
    this.isLoading = true;
    let branchkeyvalue: String = "";
    // this.getbranchFK(branchkeyvalue);
    // this.SpinnerService.show();
    this.reportService.getbranch(branchkeyvalue, 1).subscribe(
      (results: any[]) => {
        this.isLoading = false;
        // this.SpinnerService.hide();
        let datas = results["data"];
        this.branchList = datas;
        let datapagination = results["pagination"];
        if (this.branchList.length >= 0) {
          this.has_nextccbs = datapagination.has_next;
          this.has_previousccbs = datapagination.has_previous;
          this.currentpageccbs = datapagination.index;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  input_getbranchFK() {
    // this.SpinnerService.show();
    this.isLoading = true;
    this.reportService
      .getbranch(this.branchInput.nativeElement.value, 1)
      .subscribe(
        (results: any[]) => {
          this.isLoading = false;
          // this.SpinnerService.hide();
          let datas = results["data"];
          this.branchList = datas;

          let datapagination = results["pagination"];
          if (this.branchList.length >= 0) {
            this.has_nextccbs = datapagination.has_next;
            this.has_previousccbs = datapagination.has_previous;
            this.currentpageccbs = datapagination.index;
          }
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
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
              if (this.has_nextccbs === true) {
                this.reportService
                  .getbranch(
                    this.branchInput.nativeElement.value,
                    this.currentpageccbs + 1
                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.branchList = this.branchList.concat(datas);
                      if (this.branchList.length >= 0) {
                        this.has_nextccbs = datapagination.has_next;
                        this.has_previousccbs = datapagination.has_previous;
                        this.currentpageccbs = datapagination.index;
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
    this.isLoading = true;
    this.reportService.getpdtclasstype("", 1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading = false;
        let datas = results["data"];
        this.prdTypes = datas;
        let datapagination = results["pagination"];

        this.producttype_next = datapagination.has_next;
        this.producttype_pre = datapagination.has_previous;
        this.producttype_crtpage = datapagination.index;
      }
    });
  }
  input_getProductTypes() {
    this.isLoading = true;
    this.reportService
      .getpdtclasstype(this.productInput.nativeElement.value, 1)
      .subscribe((results: any[]) => {
        if (results) {
          this.isLoading = false;
          let datas = results["data"];
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
            map((x) => this.productAutocomplete.panel.nativeElement.scrollTop),
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
                  .getpdtclasstype(
                    this.productInput.nativeElement.value,
                    this.producttype_crtpage + 1
                  )
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
  getproductName() {
    let x = this.grnAssetform.get("product_type").value?.id;
    if (x === null || x === "" || x === undefined) {
      this.isLoading = true;
      this.reportService.get_prod_name("", 1).subscribe((results: any[]) => {
        if (results) {
          this.isLoading = false;
          let datas = results["data"];
          this.prdNames = datas;
          let datapagination = results["pagination"];

          this.producttype_next_name = datapagination.has_next;
          this.producttype_pre_name = datapagination.has_previous;
          this.producttype_crtpage_name = datapagination.index;
        }
      });
    } else {
      this.isLoading = true;
      this.reportService
        .get_prod_name_type("", x, 1)
        .subscribe((results: any[]) => {
          if (results) {
            this.isLoading = false;
            let datas = results["data"];
            this.prdNames = datas;
            let datapagination = results["pagination"];

            this.producttype_next_name = datapagination.has_next;
            this.producttype_pre_name = datapagination.has_previous;
            this.producttype_crtpage_name = datapagination.index;
          }
        });
    }
  }
  input_getproductName() {
    let x = this.grnAssetform.get("product_type").value?.id;
    if (x === null || x === "" || x === undefined) {
      this.isLoading = true;
      this.reportService
        .get_prod_name(this.productInput_type.nativeElement.value, 1)
        .subscribe((results: any[]) => {
          if (results) {
            this.isLoading = false;
            let datas = results["data"];
            this.prdNames = datas;
            let datapagination = results["pagination"];

            this.producttype_next_name = datapagination.has_next;
            this.producttype_pre_name = datapagination.has_previous;
            this.producttype_crtpage_name = datapagination.index;
          }
        });
    } else {
      this.isLoading = true;
      this.reportService
        .get_prod_name_type(this.productInput_type.nativeElement.value, x, 1)
        .subscribe((results: any[]) => {
          if (results) {
            this.isLoading = false;
            let datas = results["data"];
            this.prdNames = datas;
            let datapagination = results["pagination"];

            this.producttype_next_name = datapagination.has_next;
            this.producttype_pre_name = datapagination.has_previous;
            this.producttype_crtpage_name = datapagination.index;
          }
        });
    }
  }
  proname_autocompleteassetScroll() {
    setTimeout(() => {
      if (
        this.productauto_typeAutocomplete &&
        this.autocompleteTrigger &&
        this.productauto_typeAutocomplete.panel
      ) {
        fromEvent(
          this.productauto_typeAutocomplete.panel.nativeElement,
          "scroll"
        )
          .pipe(
            map(
              (x) =>
                this.productauto_typeAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.productauto_typeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.productauto_typeAutocomplete.panel.nativeElement
                .scrollHeight;
            const elementHeight =
              this.productauto_typeAutocomplete.panel.nativeElement
                .clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.producttype_next_name === true) {
                let x = this.grnAssetform.get("product_type").value?.id;
                if (x === null || x === "" || x === undefined) {
                  this.reportService
                    .get_prod_name(
                      this.productInput_type.nativeElement.value,
                      this.producttype_crtpage_name + 1
                    )
                    .subscribe(
                      (results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.prdNames = this.prdNames.concat(datas);

                        this.producttype_next_name = datapagination.has_next;
                        this.producttype_pre_name = datapagination.has_previous;
                        this.producttype_crtpage_name = datapagination.index;
                      },
                      (error) => {
                        this.errorHandler.handleError(error);
                        this.SpinnerService.hide();
                      }
                    );
                } else {
                  this.reportService
                    .get_prod_name_type(
                      this.productInput_type.nativeElement.value,
                      x,
                      this.producttype_crtpage_name + 1
                    )
                    .subscribe(
                      (results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.prdNames = this.prdNames.concat(datas);

                        this.producttype_next_name = datapagination.has_next;
                        this.producttype_pre_name = datapagination.has_previous;
                        this.producttype_crtpage_name = datapagination.index;
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
  getprappsupplier() {
    this.getSupplier();

    this.grnAssetform
      .get("supplier_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.reportService.getsupplierDropdownFKdd(value, 1).pipe(
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
    this.isLoading = true;
    // this.SpinnerService.show();
    this.reportService.getsupplierDropdown().subscribe(
      (results: any[]) => {
        this.isLoading = false;
        // this.SpinnerService.hide();
        let datas = results["data"];
        this.supplierList = datas;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  downloadReport() {
    let asset_id: any = "";
    let serial_no: any = "";
    let ccbs_branch: any = "";
    let product_name: any = "";
    let product_id: any = "";
    let vendor: any = "";
    let po_no: any = "";
    let invoice_no: any = "";

    let data = this.grnAssetform.value;
    if (this.selectedTypeQ !== "") {
      if (
        data.fromdate === "" ||
        data.fromdate === null ||
        data.fromdate === undefined
      ) {
        this.toastr.error("Choose From Date");
        return;
      }
      if (
        data.todate === "" ||
        data.todate === null ||
        data.todate === undefined
      ) {
        this.toastr.error("Choose To Date");
        return;
      }
    }
    if (data) {
      asset_id = data?.asset_id ? data?.asset_id : "";
      serial_no = data?.serial_no ? data?.serial_no : "";
      ccbs_branch = data?.branchname ? data?.branchname : "";
      product_name = data?.product_type ? data?.product_type : "";
      product_id = data?.product_id ? data?.product_id : "";
      vendor = data?.supplier_id ? data?.supplier_id : "";
      po_no = data?.po_no ? data?.po_no : "";
      invoice_no = data?.invoice_no ? data?.invoice_no : "";

      this.obj = {
        asset_id: asset_id,
      };

      if (data) {
        const objs: any = {};
        let temp: any = {};
        if (this.selectedTypeQ !== "") {
          temp = {
            // asset_id: data?.asset_id?.asset_id,
            asset_id: data?.asset_id?.asset_id,
            serial_no: data?.serial_no,
            ccbs_branch: ccbs_branch?.id,
            product_id: product_id.id,
            product_type: product_name.id,
            vendor: vendor?.id,
            po_no: data?.po_no,
            invoice_no: data?.invoice_no,
            from_date: this.datePipe.transform(data.fromdate, "yyyy-MM-dd"),
            to_date: this.datePipe.transform(data.todate, "yyyy-MM-dd"),
            ref_date: this.selectedTypeQ,
          };
        } else {
          temp = {
            // asset_id: data?.asset_id?.asset_id,
            asset_id: data?.asset_id?.asset_id,
            serial_no: data?.serial_no,
            ccbs_branch: ccbs_branch?.id,
            product_id: product_id.id,
            product_type: product_name.id,
            vendor: vendor?.id,
            po_no: data?.po_no,
            invoice_no: data?.invoice_no,
            // from_date:data.fromdate,
            // to_date:data.todate,
            // ref_date:this.selectedTypeQ
          };
        }

        Object.keys(temp).forEach((key) => {
          const value = (temp as any)[key];
          if (value !== "" && value != null) {
            objs[key] = value;
          }
        });

        this.finalObj = objs;
      }
      this.SpinnerService.show();
      this.reportService.grnupdatexldownload(this.finalObj).subscribe(
        (results) => {
          if (results.type==='application/json') {
            this.toastr.error('Data Not Found')
             this.SpinnerService.hide();
          } else {
            this.SpinnerService.hide();
            let binaryData = [];
            binaryData.push(results);
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            let link = document.createElement("a");
            link.href = downloadUrl;
            let date = new Date();
            link.download = "GRN_Product_Attribute_Template_" + date + ".xlsx";
            link.click();
          }

        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }
  }

  fileChange(event) {
    this.imagesarray = event.target.files[0];
  }

  price_Quot(event) {
    this.selectedTypeQ = event.value;
  }

  individualclick(event: MatCheckbox, x) {
    if (event.checked) {
      this.finalsubmitarray.push(x);
    } else {
      this.finalsubmitarray = this.finalsubmitarray.filter(
        (item) => item !== x
      );
    }
  }

  selectall(event) {
    if (event.checked) {
      for (let x of this.grnupdatesummary) {
        x.ischecked = true;
      }
      this.finalsubmitarray = this.grnupdatesummary;
    } else {
      for (let x of this.grnupdatesummary) {
        x.ischecked = false;
      }
      this.finalsubmitarray = [];
    }
  }

  fileupload() {
    if (
      this.imagesarray === "" ||
      this.imagesarray === null ||
      this.imagesarray === undefined
    ) {
      this.toastr.error("Choose File");
      return;
    }
    this.SpinnerService.show();
    this.reportService.grnbulkupload(this.imagesarray).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.code === "Error") {
        this.grnupdatesummary = [];
        this.showsumamry = false;
        var answer = window.confirm(res.description);
        if (answer) {
          this.SpinnerService.show();
          this.reportService.grnfile_id_download(res.file_id).subscribe(
            (results) => {
              this.SpinnerService.hide();
              let binaryData = [];
              binaryData.push(results);
              let downloadUrl = window.URL.createObjectURL(
                new Blob(binaryData)
              );
              let link = document.createElement("a");
              link.href = downloadUrl;
              let date = new Date();
              link.download =
                "AssetOtherAttribute_" + date + "_" + res.file_id + ".xlsx";
              link.click();
              this.grnupdatesummary = [];
              this.showsumamry = false;
              this.selectallfg.reset();
              this.finalsubmitarray = [];
            },
            (error) => {
              this.grnupdatesummary = [];
              this.showsumamry = false;
              this.selectallfg.reset();
              this.finalsubmitarray = [];
              this.errorHandler.handleError(error);
              this.SpinnerService.hide();
            }
          );
        } else {
          this.grnupdatesummary = [];
          this.showsumamry = false;
          this.selectallfg.reset();
          this.finalsubmitarray = [];
        }
      } else {
        this.toastr.success(res.description);
        this.grnupdatesummary = res.data["success"];
        this.showsumamry = true;
      }
    });
  }

  finalsubmit() {
    if (this.finalsubmitarray.length === 0) {
      this.toastr.error("Select Any Data to Submit");
      return;
    }
    let payload = {
      data: this.finalsubmitarray,
    };
    this.SpinnerService.show();
    this.reportService.grnupdate_finalsubmit(payload).subscribe((res) => {
      this.SpinnerService.hide();
      if (res.code) {
        this.toastr.error(res.description);
      } else {
        this.toastr.success(res.message);
        this.resetfilesumamry()
      }
    });
  }
  resetfilesumamry() {

    this.grnupdatesummary = [];
    this.showsumamry = false;
    this.selectallfg.reset();
    this.finalsubmitarray = [];
    this.fileform.reset()
    this.imagesarray = ''
  }
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
                this.reportService
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
  public displayFngrnasset(asset?: assetlists): any | undefined {
    return asset ? asset.asset_id : undefined;
  }
  public displayFnbranch(branch?: branchlistss): string | undefined {
    let code = branch ? branch.code : undefined;
    let name = branch ? branch.name : undefined;
    return branch ? code + "-" + name : undefined;
  }
  public displayFnitem(item?: itemsLists): string | undefined {
    return item ? item.name : undefined;
  }
  public displayFnsupplier(supplier?: supplierlistss): any | undefined {
    return supplier ? supplier.name : undefined;
  }
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
