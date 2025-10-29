import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "src/environments/environment";
import { ReportserviceService } from "../../reports/reportservice.service";
import { formatDate, DatePipe } from "@angular/common";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { ErrorHandlingService } from "src/app/rems/error-handling.service";
import { ToastrService } from "ngx-toastr";
import { PageEvent } from "@angular/material/paginator";
import { SharedService } from "src/app/service/shared.service";
import { fromEvent, Notification } from "rxjs";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
// import { assert } from "console";
// import { NotificationService } from "../notification.service";

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
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface assetlists {
  asset_id: string;
  assetid: string;
  grndetail_id: number;
  serial_no: string;
}
@Component({
  selector: "app-prpo-reports",
  templateUrl: "./prpo-reports.component.html",
  styleUrls: ["./prpo-reports.component.scss"],
})
export class PrpoReportsComponent implements OnInit {
  isPODetReportform: boolean;
  isPOAssetReportform: boolean;

  frmPODetRpt: FormGroup;
  frmPOAssetRpt: FormGroup;
  itemsPerPage: any = 10;
  PODetReportSumDataAPI: any = [];
  PODetRptButtons: any;
  POAssetRptButtons: any;
  PODetRptSumAPI: any;
  APIurl = environment.apiURL;
  isGRNDETAILReportform: boolean;
  supplierList: Array<supplierlistss>;
  productList: Array<productLists>;
  branchList: Array<branchlistss>;

  itemList: Array<itemsLists>;
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
  assetddlist: any;
  Lists: any[];
  commoditty: any;
  commodittyid: any;
  grndetailform: FormGroup;
  product_type: any;
  pageSize = 10;
  isLoading = false;
  grnAssetrecords: any = [];
  searchGRNarray: any;
  GRNSummaryAPI: any;
  GRNSummaryDetails: any;
  GRNbtn: any;
  obj: any;
  finalObj: any;
  grnAssetform: FormGroup;
  grnAssetsList: any=[]
  prdTypes: any=[]
  prdNames: any;
  table_data: any=[]
    selectedAttributes: any[] = [];
selectedTypeQ:any=""
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private reportService: ReportserviceService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService,
    private sharedService: SharedService,
    private toastr: ToastrService // private notification: NotificationService,
  ) {
    // this.PODetRptSumAPI = {
    //   method: "post",
    //   url: this.APIurl + "prserv/prpo_common_reports?report_type=2&is_summary=1",
    //   data : {"po_no": "PO25060027" }
    //   }
    this.PODetRptSumAPI = {
      method: "post",
      url: this.APIurl + "prserv/prpo_common_reports",
      params: "&report_type=2&is_summary=1",
      data: {},
    };

    this.PODetRptButtons = [
      {
        icon: "download",
        tooltip: "Download",
        function: this.poDetRptDnld.bind(this),
      },
    ];

    this.POAssetRptButtons = [
      {
        icon: "download",
        tooltip: "Download",
        function: this.poAssetRptDnld.bind(this),
      },
    ];
    this.searchGRNarray = [
      {
        type: "input",
        label: "Serial Number",
        formvalue: "serial_no",
        // function: true,
        //  clickfunction: this.activityClick.bind(this),
      },
      {
        type: "dropdown",
        formvalue: "asset_id",
        inputobj: {
          label: "Asset ID",
          method: "get",
          url: this.APIurl + "prserv/search_assetid_new",
          searchkey: "query",
          displaykey: "asset_id",
          Outputkey: "asset_id",
        },
      },
      {
        type: "dropdown",
        formvalue: "ccbs_branch",
        inputobj: {
          label: "CCBS Branch",
          method: "get",
          url: this.APIurl + "usrserv/search_branch",
          searchkey: "query",
          displaykey: "name",
          Outputkey: "id",
        },
      },
      {
        type: "dropdown",
        formvalue: "product_id",
        inputobj: {
          label: "Product Type",
          method: "get",
          url: this.APIurl + "mstserv/pdtclasstype",
          searchkey: "query",
          displaykey: "name",
          Outputkey: "id",
        },
      },
      {
        type: "dropdown",
        formvalue: "product_name",
        inputobj: {
          label: "Product Name",
          method: "get",
          url: this.APIurl + "mstserv/productsearch",
          searchkey: "query",
          displaykey: "name",
          Outputkey: "id",
        },
      },
      {
        type: "input",
        label: "PO Number",
        formvalue: "po_no",
      },
      {
        type: "input",
        label: "Invoice No",
        formvalue: "invoice_no",
      },

      {
        type: "dropdown",
        formvalue: "vendor",
        inputobj: {
          label: "Vendor",
          method: "get",
          url: this.APIurl + "venserv/supplier_list",
          searchkey: "query",
          displaykey: "name",
          Outputkey: "id",
        },
      },
    ];
    this.GRNSummaryDetails = [
      {
        columnname: "Delivery Location",
        key: "DeliveryLocation",
        validate: true,
        validatefunction: this.delcolumnValidate.bind(this),
      },
      {
        columnname: "IBR Code",
        key: "IBR",
        validate: true,
        validatefunction: this.ibrcolumnValidate.bind(this),
      },
      {
        columnname: "BS",
        key: "BS",
        validate: true,
        validatefunction: this.bscolumnValidate.bind(this),
      },
      {
        columnname: "CC",
        key: "CS",
        validate: true,
        validatefunction: this.cscolumnValidate.bind(this),
      }, // you had "CC" in header but "CS" in data
      {
        columnname: "Raiser Branch Name",
        key: "Raiser_Branch_Name",
        validate: true,
        validatefunction: this.raisercolumnValidate.bind(this),
      },
      // { columnname: 'Host Name / Asset Tag', key: 'HostName' },
      {
        columnname: "Product Type",
        key: "Product_Type",
        validate: true,
        validatefunction: this.pTypecolumnValidate.bind(this),
      },
      {
        columnname: "Product Name",
        key: "Product_Name",
        validate: true,
        validatefunction: this.pnamecolumnValidate.bind(this),
      },

      {
        columnname: "Asset ID",
        key: "Asset_Id",
        validate: true,
        validatefunction: this.assetIdcolumnValidate.bind(this),
      },
      {
        columnname: "Buyback Asset ID",
        key: "BuybackAssetId",
        validate: true,
        validatefunction: this.columnValidatebb.bind(this),
      }, // needs function
      {
        columnname: "Buyback Asset Serial Number",
        key: "BuybackAssetSerialNo",
        validate: true,
        validatefunction: this.columnValidatebbs.bind(this),
      }, // needs function
      {
        columnname: "PR No",
        key: "PR_NO",
        validate: true,
        validatefunction: this.prnocolumnValidate.bind(this),
      },
      // { columnname: 'PO Raiser Details', key: 'PoRaiserDetails' },
      {
        columnname: "PO No",
        key: "Po_No",
        validate: true,
        validatefunction: this.ponocolumnValidate.bind(this),
      },
      {
        columnname: "PO Date",
        key: "Po_Date",
        validate: true,
        validatefunction: this.podatecolumnValidate.bind(this),
      },
      // { columnname: 'Owner', key: 'Owner' },
      {
        columnname: "Price",
        key: "Price",
        validate: true,
        validatefunction: this.pricecolumnValidate.bind(this),
      },
      {
        columnname: "Vendor",
        key: "Vendor",
        validate: true,
        validatefunction: this.vendorcolumnValidate.bind(this),
      },
      // { columnname: 'Serial No', key: 'Serial_Number' },
      {
        columnname: "Product Make",
        key: "Product_Make",
        validate: true,
        validatefunction: this.pmakevendorcolumnValidate.bind(this),
      },
      {
        columnname: "Product Model",
        key: "Product_Model",
        validate: true,
        validatefunction: this.pmodelvendorcolumnValidate.bind(this),
      },
      {
        columnname: "Date Of Creation",
        key: "Date_Of_Creation",
        validate: true,
        validatefunction: this.docvendorcolumnValidate.bind(this),
      },
      {
        columnname: "GRN No",
        key: "Grn_No",
        validate: true,
        validatefunction: this.grnnocolumnValidate.bind(this),
      },
      {
        columnname: "Serial Number",
        key: "Serial_Number",
        validate: true,
        validatefunction: this.columnValidate.bind(this),
      },
    ];
    this.GRNbtn = [
      {
        icon: "download",
        tooltip: "Excel Download",
        function: this.downloadFileXLSX.bind(this),
      },
    ];
  }

  ngOnInit(): void {
    let poRprt = this.sharedService.ReportsPO.value;
    if (poRprt == 1) {
      this.isPODetReportform = true;
      this.isPOAssetReportform = false;
      this.isGRNDETAILReportform = false;
    } else if (poRprt == 2) {
      this.isPODetReportform = false;
      this.isPOAssetReportform = true;
      this.isGRNDETAILReportform = false;

      // this.getAssetlists();
    } else if (poRprt == 5) {
      this.isPODetReportform = false;
      this.isPOAssetReportform = false;
      this.isGRNDETAILReportform = true;
      // this.getAssetlists();
      this.getgrndetailList();
      // this.getproductName()
    }
    this.frmPODetRpt = this.fb.group({
      po_no: [""],
    });
    this.frmPOAssetRpt = this.fb.group({
      asset_id: [""],
      serial_no: [""],
    });

    this.grndetailform = this.fb.group({
      asset_id: [""],
      serial_no: [""],
      branchname: [""],
      product_id: [""],
      product_type: [""],
      supplier_id: [""],
      po_no: [""],
      invoice_no: [""],
    });

    this.getproductType();
    this.grndetailform
      .get("branchname")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.reportService.getbranchFK(value, 1).pipe(
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
    // this.getGRNassetSummary();
    this.searchGRNevent("");
    this.grnAssetform = this.fb.group({
      asset_id: [""],
      serial_no: [""],
      branchname: [""],
      product_id: [""],
      product_type: [""],
      supplier_id: [""],
      po_no: [""],
      invoice_no: [""],
      fromdate:[''],
        todate:['']
    });
  }
  getproductType() {
    // this.isLoading = true;
    this.reportService.getproductType().subscribe(
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

  public displayFnitem(item?: itemsLists): string | undefined {
    return item ? item.name : undefined;
  }

  getbrproduct() {
    this.getitemFK();

    this.grndetailform
      .get("product_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
        }),
        switchMap((value) =>
          this.reportService
            .getproductfn(this.commodittyid, this.product_type, value, 1)
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
    if (this.grndetailform.get("commodity_id").value) {
      this.commoditty = this.grndetailform?.get("commodity_id")?.value?.id;
    }
    if (this.grndetailform.get("commodity_id").value) {
      this.commoditty = this.grndetailform?.get("commodity_id")?.value?.id;
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
    this.reportService
      .getproductfn(this.commodittyid, this.product_type, rmkeyvalue, 1)
      .subscribe((results: any) => {
        let datas = results["data"];
        this.productList = datas;
        this.SpinnerService.hide();
        if (this.productList.length == 0) {
          // this.notification.showInfo("No Product Specified!");
          this.SpinnerService.hide();
        }
      });
    // }
  }
  PODetailSrch: any = [
    {
      type: "input",
      label: "PO No",
      formvalue: "po_no",
    },
  ];

  PODetRptSumData: any = [
    {
      columnname: "PO No",
      key: "po_no",
      button: true,
      style: { cursor: "pointer", color: "blue" },
      function: true,
      clickfunction: this.GRNPopupOpen.bind(this),
    },
    { columnname: "PO Date", key: "po_date" },
    { columnname: "PO Amount", key: "po_amount" },
    { columnname: "PO Status", key: "status" },
    { columnname: "Supplier Branch", key: "supplierbranch" },
    // {columnname: "PO Status", key: "status"},
  ];
  form_value: any;
  PODetRptSumSearch(e) {
    this.form_value = e;
    console.log("eee", e);
    this.PODetRptSumAPI = {
      method: "post",
      url: this.APIurl + "prserv/prpo_common_reports",
      params: "&report_type=2&is_summary=1",
      // data : {"po_no": this.frmPODetRpt.value.po_no }
      data: e,
    };
  }
  PODetRptDnldAPI: any = {};

  poDetRptDnld() {
    if (
      this.download_param == "" ||
      this.download_param == undefined ||
      this.download_param == null ||
      (typeof this.download_param === "object" &&
        Object.keys(this.download_param).length === 0) ||
      (Array.isArray(this.download_param) && this.download_param.length === 0)
    ) {
      this.toastr.warning("Please Enter the PO Number");
      return false;
    }
    this.SpinnerService.show();
    this.reportService.po_detail_download(this.download_param).subscribe(
      (data: any) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(data);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = "PO Detail Report" + ".xlsx";
        link.click();
        this.toastr.success("Successfully Download");
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  // PODetRptReset() {
  //   this.frmPODetRpt.get("name").reset();
  //   this.PODetRptSumAPI = {
  //     method: "post",
  //     url: this.APIurl + "prserv/prpo_common_reports?report_type=2&is_summary=1",
  //     data : {"po_no": "" }
  //   }
  // }
  GRNDetails : any
  grnDetails:any
  po_no : any
  GRNPopupOpen(data){
    this.po_no = data.po_no
     this.getGRNdet()
     var myModal = new (bootstrap as any).Modal(
      document.getElementById("grnPopup"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();   
  }
  download_param:any;
po_detail_summary:any;
  po_details_report(data){
   if (data == "" || data == undefined || data == null || 
    (typeof data === 'object' && Object.keys(data).length === 0) ||
    (Array.isArray(data) && data.length === 0)) {
    this.toastr.warning("Please Enter the PO Number");
    return false;
}
    this.download_param=data
    console.log("data",data)
    this.reportService.po_details_report(data)
      .subscribe(results => {
        if (results) {
          let datas = [results];
          this.po_detail_summary = datas;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  getGRNdet(page = 1) {
    this.reportService.getPrpoGrnDet(this.po_no, page).subscribe(
      (results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.GRNDetails = datas;
          let pagination = results["pagination"];

          if (this.GRNDetails.length > 0) {
            this.has_next = pagination.has_next;
            this.has_previous = pagination.has_previous;
            this.CurrentPage = pagination.index;
          }
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  CurrentPage = 1;
  has_next = false;
  has_previous = false;

  nextclick() {
    this.CurrentPage = this.CurrentPage + 1;
    this.getGRNdet(this.CurrentPage);
  }
  previousclick() {
    this.CurrentPage = this.CurrentPage - 1;
    this.getGRNdet(this.CurrentPage);
  }

  searchvar: any = "string";

  POAssetSrch: any = [
    {
      type: "input",
      label: "PO No",
      formvalue: "po_no",
    },
  ];
  POAssetRptSumAPI: any = {};

  POAssetRptSumData: any = [
    {
      columnname: "PO No",
      key: "po_no",
      button: true,
      style: { cursor: "pointer", color: "blue" },
      function: true,
      clickfunction: this.GRNPopupOpen.bind(this),
    },
    { columnname: "PO Date", key: "po_date" },
    { columnname: "PO Amount", key: "po_amount" },
    { columnname: "PO Status", key: "status" },
    { columnname: "Supplier Branch", key: "supplierbranch" },
    { columnname: "PO Status", key: "status" },
  ];
  POAssetRptSumSearch(e) {
    this.POAssetRptSumAPI = {
      method: "post",
      url: this.APIurl + "prserv/prpo_common_reports",
      param: '&report_type=3&is_summary=1"',
      data: { po_no: this.frmPOAssetRpt.value.po_no },
    };
  }
  POAssetRptReset() {
    this.frmPOAssetRpt.get("name").reset();
    this.POAssetRptSumAPI = {
      method: "post",
      url: this.APIurl + "prserv/prpo_common_reports",
      param: "&report_type=3&is_summary=1",
      data: {
        asset_id: "KVBF24None06399",
        branch_id: 259,
        product_id: 1,
        service_id: 3,
        component_id: 6,
        other_attribute: "YES",
      },
    };
  }
  POAssetRptDnldAPI;
  poAssetRptDnld(data) {
    this.POAssetRptDnldAPI = {
      method: "post",
      url:
        this.APIurl + "prserv/prpo_common_reports?report_type=3&is_summary=0",
      data: { po_no: this.frmPODetRpt.value.po_no },
    };
  }

  AssetsList: any;
  pdtclasstype: any;
  getAssetlists() {
    let sNo = this.frmPOAssetRpt.get("serial_no").value;
    // if (sNo == "" || sNo == null || sNo == undefined) {
    //   this.toastr.error("Please Enter Serial No.");
    //   return;
    // }
     if (sNo == "" || sNo == null || sNo == undefined) {

    this.reportService.getPRPOAssets("", '',1).subscribe((results: any[]) => {
      if (results) {
        let datas = results["data"];
        this.AssetsList = datas;
         let datapagination = results["pagination"];
        if (this.AssetsList.length >= 0) {
          this.has_nextassset_po = datapagination.has_next;
          this.has_previousasset_po = datapagination.has_previous;
          this.currentpageasset_po = datapagination.index;
        }
        this.reportService.getpdtclasstype('',1).subscribe((results: any[]) => {
          if (results) {
            let datas = results["data"];
            this.pdtclasstype = datas;
          }
        });
      }
    });
  }
  else{
        this.reportService.getPRPOAssets("", sNo,1).subscribe((results: any[]) => {
      if (results) {
        let datas = results["data"];
        this.AssetsList = datas;
        let datapagination = results["pagination"];
        if (this.AssetsList.length >= 0) {
          this.has_nextassset_po = datapagination.has_next;
          this.has_previousasset_po = datapagination.has_previous;
          this.currentpageasset_po = datapagination.index;
        }
        this.reportService.getpdtclasstype('',1).subscribe((results: any[]) => {
          if (results) {
            let datas = results["data"];
            this.pdtclasstype = datas;
          }
        });
      }
    });
  }
}
getasset_autocomplete(){
   this.reportService.getPRPOAssets(this.assetInput.nativeElement.value, this.frmPOAssetRpt.get("serial_no").value,1).subscribe((results: any[]) => {
      if (results) {
        let datas = results["data"];
        this.AssetsList = datas;
        let datapagination = results["pagination"];
        if (this.AssetsList.length >= 0) {
          this.has_nextassset_po = datapagination.has_next;
          this.has_previousasset_po = datapagination.has_previous;
          this.currentpageasset_po = datapagination.index;
        }
      
      }
    });
}

  GRNList: any;
  // pdtclasstype : any
  getgrndetailList() {
    this.reportService.getPRPOAssets("", "",this.currentpageasset_po).subscribe((results: any[]) => {
      if (results) {
        let datas = results["data"];
        this.GRNList = datas;
        this.reportService.getpdtclasstype('',1).subscribe((results: any[]) => {
          if (results) {
            let datas = results["data"];
            // this.pdtclasstype = datas;
          }
        });
      }
    });
  }

  POAssetReset() {
    this.frmPOAssetRpt.controls["asset_id"].reset();
    this.frmPOAssetRpt.controls["serial_no"].reset();
    this.POAssetData = [];
  }
  POAssetData: any = [];
  getPOAssetSummary() {
    this.POAssetData = [];
    const asset_id = this.frmPOAssetRpt.value.asset_id;
    const serNo = this.frmPOAssetRpt.value.serial_no;
    if (asset_id == undefined || asset_id == null || asset_id == "") {
      this.toastr.error("Please Choose Asset.");
      return false;
    }
    let serviceid = this.pdtclasstype.filter((x) => x.name == "Service")[0].id;
    let component_id = this.pdtclasstype.filter((x) => x.name == "Component")[0]
      .id;
    let payload = {
      serial_no: serNo,
      asset_id: asset_id.assetid,
      branch_id: "",
      product_id: "",
      service_id: serviceid,
      component_id: component_id,
      other_attribute: "YES",
    };
    this.reportService.getPOAssetSummary(payload).subscribe((result) => {
      this.POAssetData.push(result);
    });
  }
  POAssetDownload() {
    const asset_id = this.frmPOAssetRpt.value.asset_id;
    const seriNo = this.frmPOAssetRpt.value.serial_no;
    if (asset_id == undefined || asset_id == null || asset_id == "") {
      this.toastr.error("Please Choose Asset.");
      return false;
    }
    let serviceid = this.pdtclasstype.filter((x) => x.name == "Service")[0].id;
    let component_id = this.pdtclasstype.filter((x) => x.name == "Component")[0]
      .id;
    let payload = {
      asset_id: asset_id.assetid,
      serial_no: seriNo,
      branch_id: "",
      product_id: "",
      service_id: serviceid,
      component_id: component_id,
      other_attribute: "YES",
    };
    this.reportService.getPOAssetDownload(payload).subscribe(
      (fullXLS) => {
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = "Assetdetails Report_" + date + ".xlsx";
        link.click();
      },
      (error) => {
        this.toastr.warning(error.status + error.statusText);
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

  //display function

  public displayFnbranch(branch?: branchlistss): string | undefined {
    let code = branch ? branch.code : undefined;
    let name = branch ? branch.name : undefined;
    return branch ? code + "-" + name : undefined;
  }

  has_nextccbs = false;
  has_previousccbs = false;
  currentpageccbs: number = 1;
  presentpageccbs: number = 1;

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

  GRNAssetReset() {
    this.grndetailform.controls["asset_id"].reset();
    this.GRNAssetData = [];
  }
  GRNAssetData: any = [];
  getGRNAssetSummary() {
    this.GRNAssetData = [];
    const asset_id = this.grndetailform.value;
    // if(asset_id == undefined || asset_id == null || asset_id == ''){
    //   this.toastr.error("Please Choose Any Data to .")
    //   return false
    // }
    // let serviceid = this.pdtclasstype.filter(x=> x.name =="Service")[0].id
    // let component_id = this.pdtclasstype.filter(x=> x.name =="Component")[0].id
    // let payload ={"asset_id":asset_id.assetid, "branch_id":"", "product_id":"",
    // "service_id":serviceid,
    // "component_id":component_id,  "other_attribute": "YES"}
    let obj = {
      asset_id: asset_id?.no,
      // prheader_status: asset_id?.prheader_status,
      branch_id: asset_id?.branch_id?.id,
      supplier_id: asset_id?.supplier_id?.id,
      product_id: asset_id?.product_id?.id,
      product_type: asset_id?.product_type?.id,
      // mepno: asset_id?.mepno?.no,
      po_no: asset_id?.po_no,
      invoice_no: asset_id?.invoice_no?.id,
      branchname: asset_id?.ccbsbrnh?.id,
      // date: this.datepipe.transform(asset_id.date, "yyyy-MM-dd"),
    };

    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        delete obj[i];
      }
    }
    this.reportService.getPOAssetSummary(obj).subscribe((result) => {
      this.GRNAssetData.push(result);
    });
  }
  GRNAssetDownload() {
    const asset_id = this.frmPOAssetRpt.value.asset_id;
    if (asset_id == undefined || asset_id == null || asset_id == "") {
      this.toastr.error("Please Choose Asset.");
      return false;
    }
    let serviceid = this.pdtclasstype.filter((x) => x.name == "Service")[0].id;
    let component_id = this.pdtclasstype.filter((x) => x.name == "Component")[0]
      .id;
    let payload = {
      asset_id: asset_id.assetid,
      branch_id: "",
      product_id: "",
      service_id: serviceid,
      component_id: component_id,
      other_attribute: "YES",
    };
    this.reportService.getPOAssetDownload(payload).subscribe(
      (fullXLS) => {
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = "PO Asset Report" + date + ".xlsx";
        link.click();
      },
      (error) => {
        this.toastr.warning(error.status + error.statusText);
      }
    );
  }

  getbranchFK() {
    let branchkeyvalue: String = "";
    // this.getbranchFK(branchkeyvalue);
    // this.SpinnerService.show();
    this.reportService.getbranch(branchkeyvalue,1).subscribe(
      (results: any[]) => {
        // this.SpinnerService.hide();
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas);
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
    this.reportService.getbranch( this.branchInput.nativeElement.value,1).subscribe(
      (results: any[]) => {
        // this.SpinnerService.hide();
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas);
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
  autocompleteitemScroll() {}
  productclick(data) {}
  getprappsupplier() {
    this.getSupplier();

    this.grnAssetform.get("supplier_id")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log("inside tap");
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
   
    this.reportService.getsupplierDropdown().subscribe(
      (results: any[]) => {
      
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

  getGRNassetSummary() {
    let obj = { asset_id: "KVBF25DMTPR05230/01/01" };
    this.reportService.getGRNAssetSummary(obj).subscribe((result) => {
      // this.grnAssetrecords.push(result)
      let datas = result["data"];
      this.grnAssetrecords = datas;
    });
  }

  getBuybackAssetId(item: any): string {
    return item?.["Buyback Asset ID"] ?? "";
  }
  getBuybackAssetSerialNo(item: any): string {
    return item?.["Buyback Asset Serial Number"] ?? "";
  }
  searchGRNevent(data) {
    let asset_id = "";
    let serial_no = "";
    let ccbs_branch = "";
    let product_name = "";
    let product_id = "";
    let vendor = "";
    let po_no = "";
    let invoice_no = "";

    

    if (data) {
      asset_id = data?.asset_id ? data?.asset_id : "";
      serial_no = data?.serial_no ? data?.serial_no : "";
      ccbs_branch = data?.ccbs_branch ? data?.ccbs_branch : "";
      product_name = data?.product_name ? data?.product_name : "";
      product_id = data?.product_id ? data?.product_id : "";
      vendor = data?.vendor ? data?.vendor : "";
      po_no = data?.po_no ? data?.po_no : "";
      invoice_no = data?.invoice_no ? data?.invoice_no : "";

      this.obj = {
        asset_id: asset_id,
      };

      if (data) {
        const objs: any = {};
        const temp = {
          asset_id: data?.asset_id,
          serial_no: data?.serial_no,
          ccbs_branch: data?.ccbs_branch,
          product_id: data?.product_name,
          product_type: data?.product_id,
          vendor: data?.vendor,
          po_no: data?.po_no,
          invoice_no: data?.invoice_no,
        };

        Object.keys(temp).forEach((key) => {
          const value = (temp as any)[key];
          if (value !== "" && value != null) {
            objs[key] = value;
          }
        });

        console.log("Final Object =>", objs);
        this.finalObj = objs;
      }

      //     if (data) {
      //   const keys = [
      //     "asset_id",
      //     "serial_no",
      //     "ccbs_branch",
      //     "product_type",
      //     "product_id",
      //     "vendor",
      //     "po_no",
      //     "invoice_no"
      //   ];

      //   keys.forEach(key => {
      //     if (data[key]) {
      //       this.obj[key] = data[key];
      //     }
      //   });
      // }

      this.SpinnerService.show();
      this.GRNSummaryAPI = {
        method: "post",
        url: this.APIurl + "prserv/prpo_common_reports",
        params: "&report_type=5&is_summary=1&is_prdetails=1&page=1",
        data: this.finalObj,
      };
    }
  }
  downloadFileXLSX(type: string): any {
    this.SpinnerService.show();
    this.reportService.DownloadExcel(this.finalObj).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "Inward Report.xlsx";
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
  columnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Serial_Number !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Serial_Number,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }

  columnValidatebb(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.BuybackAssetId !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: this.getBuybackAssetId(data?.Buyback_Details[0]),
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }

  columnValidatebbs(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.BuybackAssetSerialNo !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: this.getBuybackAssetSerialNo(data?.Buyback_Details[0]),
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  delcolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.DeliveryLocation !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.DeliveryLocation,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  ibrcolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.IBR !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.IBR,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }

  bscolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.BS !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.BS,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  cscolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.CC !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.CC,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  raisercolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Raiser_Branch_Name !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Raiser_Branch_Name,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }

  pTypecolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Product_Type !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Product_Type,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  pnamecolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Product_Name !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Product_Name,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  assetIdcolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Asset_Id !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Asset_Id,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  prnocolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.PR_NO !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.PR_NO,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  ponocolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Po_No !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Po_No,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  podatecolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Po_Date !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Po_Date,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  pricecolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Price !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Price,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  vendorcolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Vendor !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Vendor,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  pmakevendorcolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Product_Make !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Product_Make,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  pmodelvendorcolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Product_Model !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Product_Model,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  docvendorcolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Date_Of_Creation !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Date_Of_Creation,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  grnnocolumnValidate(data) {
    let config = {
      disabled: false,
      style: {},
      icon: "",
      tooltipValue: "",
      class: "",
      value: "",
    };

    if (data?.Grn_No !== "") {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: data?.Grn_No,
      };
    } else {
      config = {
        disabled: false,
        style: {},
        icon: "",
        tooltipValue: "",
        class: "",
        value: "",
      };
    }
    return config;
  }
  activityClick(data) {
    console.log("Data", data);
  }
  onSerialEntered(event: any) {
    let serialNo = event.target.value;
  }

  getgrnAssetlists() {
  
    let sNo = this.grnAssetform.get("serial_no").value;
    if (sNo !== "" || sNo !== null || sNo !== undefined) {
      this.reportService.getgrnAssets('',1, sNo).subscribe((results: any[]) => {
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
  }
  else
  {
      this.reportService.getassetDropdownFKdd("", 1).subscribe((results: any[]) => {
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
      this.reportService.getgrnAssets(this.assetInput.nativeElement.value,1, sNo).subscribe((results: any[]) => {
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
  }
  else
  {
      this.reportService.getassetDropdownFKdd("", 1).subscribe((results: any[]) => {
        if (results) {
          let datas = results["data"];
          this.grnAssetsList = datas;
      }
    });

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
  getproductName() {
    let x= this.grnAssetform.get('product_type').value?.id
    if(x===null || x===''|| x === undefined){
      this.isLoading=true
   this.reportService.get_prod_name('',1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading=false
        let datas = results["data"];
        this.prdNames = datas;
        let datapagination = results["pagination"];

        this.producttype_next_name = datapagination.has_next;
        this.producttype_pre_name = datapagination.has_previous;
        this.producttype_crtpage_name = datapagination.index;
    
      }
    });
    }else{
      this.isLoading=true
   this.reportService.get_prod_name_type('',x,1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading=false
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
    let x= this.grnAssetform.get('product_type').value?.id
    if(x===null || x===''|| x === undefined){
      this.isLoading=true
   this.reportService.get_prod_name(this.productInput_type.nativeElement.value,1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading=false
        let datas = results["data"];
        this.prdNames = datas;
        let datapagination = results["pagination"];

        this.producttype_next_name = datapagination.has_next;
        this.producttype_pre_name = datapagination.has_previous;
        this.producttype_crtpage_name = datapagination.index;
    
      }
    });
    }else{
      this.isLoading=true
   this.reportService.get_prod_name_type(this.productInput_type.nativeElement.value,x,1).subscribe((results: any[]) => {
      if (results) {
        this.isLoading=false
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
  getgrnSummary(){
    let payload = {}
    this.reportService.getgrnSummary(payload,this.grn_summary_crt).subscribe((results: any[]) => {
      if (results) {
        let datas = results["data"];
        this.table_data = datas;
          let datapagination = results["pagination"];
                  
                        this.grn_summary_hasnext = datapagination.has_next;
                        this.grn_summary_hasprevious = datapagination.has_previous;
                        this.grn_summary_crt = datapagination.index;
                
      }
    });
  }
   grn_nextclick() {
    this.grn_summary_crt = this.grn_summary_crt + 1;
    this.searchSummary();
  }
  grn_previousclick() {
    this.grn_summary_crt = this.grn_summary_crt - 1;
    this.searchSummary();
  }
  searchSummary(){
        let asset_id:any = "";
    let serial_no:any = "";
    let ccbs_branch:any = "";
    let product_name:any = "";
    let product_id:any = "";
    let vendor:any = "";
    let po_no:any = "";
    let invoice_no:any = "";

    let data = this.grnAssetform.value

    if(this.selectedTypeQ !==''){
      if(data.fromdate===''||data.fromdate===null||data.fromdate===undefined){
        this.toastr.error("Choose From Date")
        return
      }if(data.todate===''||data.todate===null||data.todate===undefined){
 this.toastr.error("Choose To Date")
        return
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
        let temp:any={}
        if(this.selectedTypeQ !==''){
 temp = {
          // asset_id: data?.asset_id?.asset_id,
          asset_id: data?.asset_id?.asset_id,
          serial_no: data?.serial_no,
          ccbs_branch:ccbs_branch?.id,
          product_id:product_id.id,
          product_type:product_name.id,
          vendor: vendor?.id,
          po_no: data?.po_no,
          invoice_no: data?.invoice_no,
          from_date: this.datePipe.transform(data.fromdate, "yyyy-MM-dd"),
          to_date: this.datePipe.transform(data.todate, "yyyy-MM-dd"),
          ref_date:this.selectedTypeQ
        };
        }else{
 temp = {
          // asset_id: data?.asset_id?.asset_id,
          asset_id: data?.asset_id?.asset_id,
          serial_no: data?.serial_no,
          ccbs_branch:ccbs_branch?.id,
          product_id:product_id.id,
          product_type:product_name.id,
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

        console.log("Final Object =>", objs);
        this.finalObj = objs;
      }
      this.SpinnerService.show();
       this.reportService.getgrnSummary(this.finalObj,this.grn_summary_crt).subscribe((results: any[]) => {
      if (results) {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.table_data = datas;
         let datapagination = results["pagination"];
                  
                        this.grn_summary_hasnext = datapagination.has_next;
                        this.grn_summary_hasprevious = datapagination.has_previous;
                        this.grn_summary_crt = datapagination.index;
      }
    });
    }
  }
    openAttributes(attributes: any[]) {
    this.selectedAttributes = attributes;
       var myModal = new (bootstrap as any).Modal(
      document.getElementById("attributesModal"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();   
    
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

    public displayFnasset(asset?: assetlists): any | undefined {
    return asset ? asset.assetid : undefined;
  }
   public displayFngrnasset(asset?: assetlists): any | undefined {
    return asset ? asset.asset_id : undefined;
  }
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
  autocompleteassetScroll() {
    setTimeout(() => {
      if (
        this.matassetAutocomplete &&
        this.autocompleteTrigger &&
        this.matassetAutocomplete.panel
      ) {
        fromEvent(this.matassetAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matassetAutocomplete.panel.nativeElement.scrollTop
            ),
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
                    this.grnAssetform.get("serial_no").value ?? ''

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
    proname_autocompleteassetScroll() {
    setTimeout(() => {
      if (
        this.productauto_typeAutocomplete &&
        this.autocompleteTrigger &&
        this.productauto_typeAutocomplete.panel
      ) {
        fromEvent(this.productauto_typeAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.productauto_typeAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.productauto_typeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.productauto_typeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.productauto_typeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.producttype_next_name === true) {
                 let x= this.grnAssetform.get('product_type').value?.id
    if(x===null || x===''|| x === undefined){
this.reportService
                  .get_prod_name(this.productInput_type.nativeElement.value,this.producttype_crtpage_name +1 )
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
    }else{
      this.reportService
                  .get_prod_name_type(this.productInput_type.nativeElement.value,x,this.producttype_crtpage_name +1 )
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
   autocompleteassetScroll_asset() {
    setTimeout(() => {
      if (
        this.matassetAutocomplete &&
        this.autocompleteTrigger &&
        this.matassetAutocomplete.panel
      ) {
        fromEvent(this.matassetAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matassetAutocomplete.panel.nativeElement.scrollTop
            ),
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
              if (this.has_nextassset_po === true) {
                this.reportService
                  .getPRPOAssets(
                    
                    this.assetInput.nativeElement.value,
                    this.frmPOAssetRpt.get("serial_no").value ?? '',
                    this.currentpageasset_po + 1,

                  )
                  .subscribe(
                    (results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.AssetsList = this.AssetsList.concat(datas);
        if (this.AssetsList.length >= 0) {
          this.has_nextassset_po = datapagination.has_next;
          this.has_previousasset_po = datapagination.has_previous;
          this.currentpageasset_po = datapagination.index;
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
  refreshPage(){
    this.grnAssetform.reset();
    this.selectedTypeQ=''
  }
  downloadReport(){
      let asset_id:any = "";
    let serial_no:any = "";
    let ccbs_branch:any = "";
    let product_name:any = "";
    let product_id:any = "";
    let vendor:any = "";
    let po_no:any = "";
    let invoice_no:any = "";

    let data = this.grnAssetform.value
 if(this.selectedTypeQ !==''){
      if(data.fromdate===''||data.fromdate===null||data.fromdate===undefined){
        this.toastr.error("Choose From Date")
        return
      }if(data.todate===''||data.todate===null||data.todate===undefined){
 this.toastr.error("Choose To Date")
        return
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
        let temp:any={}
        if(this.selectedTypeQ !==''){
 temp = {
          // asset_id: data?.asset_id?.asset_id,
          asset_id: data?.asset_id?.asset_id,
          serial_no: data?.serial_no,
          ccbs_branch:ccbs_branch?.id,
          product_id:product_id.id,
          product_type:product_name.id,
          vendor: vendor?.id,
          po_no: data?.po_no,
          invoice_no: data?.invoice_no,
          from_date: this.datePipe.transform(data.fromdate, "yyyy-MM-dd"),
          to_date: this.datePipe.transform(data.todate, "yyyy-MM-dd"),
          ref_date:this.selectedTypeQ
        };
        }else{
 temp = {
          // asset_id: data?.asset_id?.asset_id,
          asset_id: data?.asset_id?.asset_id,
          serial_no: data?.serial_no,
          ccbs_branch:ccbs_branch?.id,
          product_id:product_id.id,
          product_type:product_name.id,
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

        console.log("Final Object =>", objs);
        this.finalObj = objs;
      }
    this.SpinnerService.show();
    this.reportService.DownloadExcel(this.finalObj).subscribe(
      (results) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        let date= new Date()
        link.download = "GRN asset detail report_"+date+".xlsx";
        link.click();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }
}

 price_Quot(event){
this.selectedTypeQ=event.value
}

}

