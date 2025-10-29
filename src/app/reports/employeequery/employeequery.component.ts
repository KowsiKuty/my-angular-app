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
// import { NotificationService } from "../notification.service";
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
// import { ErrorHandlingServiceService } from "../error-handling-service.service";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import { formatDate, DatePipe } from "@angular/common";
import { ErrorHandlingService } from "src/app/atma/error-handling.service";
import { ReportserviceService } from "../../reports/reportservice.service";
import { PageEvent } from '@angular/material/paginator';

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
  selector: 'app-employeequery',
  templateUrl: './employeequery.component.html',
  styleUrls: ['./employeequery.component.scss']
})
export class EmployeequeryComponent implements OnInit {
  employeequery: any;
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
  statuslist: any;
  // inwarddocrespresentpage: number;
  //   totalcountdocres: any;
  // issummarypagedocres: boolean;
 has_next = true;
  has_previous = true;

  constructor(
    private fb: FormBuilder,
        private datePipe: DatePipe,
        private reportService: ReportserviceService,
        private SpinnerService: NgxSpinnerService,
        private errorHandler: ErrorHandlingService,
        private sharedService: SharedService,
        private toastr: ToastrService ,// private notification: NotificationService,
      private router: Router,
      private shareService: SharedService,
      // private notification: NotificationService,
      private datepipe: DatePipe,
      private renderer: Renderer2
   
  ) { }
 
  ngOnInit(): void {

      this.employeequery = this.fb.group({
      crno: [""],
      invoice_type: [""],
      supplier_name: [""],
      branchname: [""],
      invoice_no: [""],
      invoice_amt: [""],
      fromdate: [""],
      todate:[""],
      trans_from_date: [""],
      trans_to_date: [""],
      airwaybill: [""],
      prheader_status: [""],


    });
//  from_date: this.datePipe.transform(data.fromdate, "yyyy-MM-dd"),
//  to_date: this.datePipe.transform(data.todate, "yyyy-MM-dd"),

 this.employeequery
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
this.getprstatus() 
this.searchSummary('search')
      
  }
  getprstatus() {
    this.reportService.getStatus().subscribe((result) => {
      this.statuslist = result["data"];
      console.log("statuslist", this.statuslist);
    });
  }
    currentpageasset = 1;
    has_nextassset = false;
    has_previousasset = false;
    grn_summary_crt = 0;
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
public displayFngrnasset(asset?: assetlists): any | undefined {
    return asset ? asset.asset_id : undefined;
  }

 
   grn_nextclick() {
    this.grn_summary_crt = this.grn_summary_crt + 1;
    this.searchSummary('page');
  }
  grn_previousclick() {
    this.grn_summary_crt = this.grn_summary_crt - 1;
    this.searchSummary('page');
  }

 
  searchSummary(type){
    if(type ==='search'){
      this.grn_summary_crt=0
    }
      let payload = {
  params: {
    action: "GET",
    type: "AP_INVOICEHEADER_GET",
    filter: {
      InvoiceHeader_Status: "",
      InvoiceHeader_Gid: "",
      InvoiceHeader_InvoiceType: "",
      InvoiceHeader_InvoiceDate: "",
      invoiceheader_branchgid: "",
      InvoiceHeader_CRNo: this.employeequery.get("crno").value || '',
      selectedtype: [],
      selected_branch: "",
      Page_Index: this.grn_summary_crt || 0,
      Page_Size: 10
    }
  }
};

      // if (data) {
      //   const objs: any = {};
      //   let temp:any={}

      //   Object.keys(temp).forEach((key) => {
      //     const value = (temp as any)[key];
      //     if (value !== "" && value != null && value !== undefined) {
      //       objs[key] = value;
      //     }
      //   });

      //   console.log("Final Object =>", objs);
      //   this.finalObj = objs;
      // }
      this.SpinnerService.show();
       this.reportService.geemployeeqrySummary(payload).subscribe((results: any[]) => {
      if (results) {
        this.SpinnerService.hide()
        let datas = results;
        this.table_data = datas;
        //  let datapagination = results["pagination"];
                  if (this.table_data?.length > 0 && this.grn_summary_crt == 0) {
                      this.grn_summary_hasnext = true;
                      this.grn_summary_hasprevious = false;
                  }

                  if (this.table_data?.length === 0 && this.grn_summary_crt > 0) {
                      this.grn_summary_hasnext = false;
                      this.grn_summary_hasprevious = true;
                  }
                  if (this.table_data?.length != 0 && this.grn_summary_crt > 0) {
                      this.grn_summary_hasnext = true;
                      this.grn_summary_hasprevious = true;
                  }
                  
                        // this.grn_summary_hasnext = datapagination.has_next;
                        // this.grn_summary_hasprevious = datapagination.has_previous;
                        // this.grn_summary_crt = datapagination.index;
      }
    });
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
    this.reportService.DownloadeqExcel(this.finalObj).subscribe(
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
  refreshPage(){
    this.employeequery.reset();
    this.searchSummary('search');
  }
}
