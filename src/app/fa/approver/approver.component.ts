import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Observable, fromEvent } from "rxjs";
import { DatePipe } from "@angular/common";
import { faservice } from "../fa.service";
import { faShareService } from "../share.service";
import { MatPaginator } from "@angular/material/paginator";
// import FileSaver from 'file-saver';
import { jsPDF } from "jspdf";

// "node_modules/jspdf/dist/jspdf.min.js",
// "node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js"

interface pv_done {
  value: string;
  viewValue: string;
}
interface BRANCH{
  name:string;
  code:string;
  value:string
}
interface products {
  id:string,
  name:string
}
@Component({
  selector: "app-approver",
  templateUrl: "./approver.component.html",
  styleUrls: ["./approver.component.scss"],
})
export class ApproverComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild("branch") matbranchAutocomplete: MatAutocomplete;
  @ViewChild("branchidInput") branchidInput: any;

  @ViewChild("branch_do") matbranchdoAutocomplete: MatAutocomplete;
  @ViewChild("branchdoidInput") branchdoidInput: any;

  @ViewChild("inputproduct") inputproduct: any;
  @ViewChild("products") products: MatAutocomplete;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  download: boolean = false;
  download_d: boolean = false;
  is_branch_has_next: boolean;
  is_branch_has_previous: boolean;
  is_branch_currentpage: number;

  @HostListener("document:keydown", ["$event"]) onkeyboard(
    event: KeyboardEvent
  ) {
    console.log("welcome", event.code);
    if (event.code == "Escape") {
      this.spinner.hide();
    }
  }
  pvserialnoupdate: boolean = true;
  pvapprover: boolean = false;
  currentpv_value: any = "pvserialnoupdate";
  head: any = [
    {
      s_no: "S.No",
      branch_code: "Branch Code",
      branch_name: "Branch Name",
      pv_done: "PV Done",
      pv_date: "PV Date",
    },
  ];
  selectPage: number = 10;
  selectPages: number = 10;
  head1: any = [
    {
      s_no: "S.No",
      asset_id: "Asset ID",
      product_name: "Product Name",
      branch_code: "Branch Code",
      branch_name: "Branch Name",
      asset_tag: "Asset Tag",
      make: "Make",
      serial_no: "Serial No",
      cr_number: "CR Number",
      kvb_asset_id: "KVB Asset ID",
      condition: "Condition",
      status: "Status",
      remarks: "Remarks",
      asset_tag1: "Asset Tag",
      make1: "Make",
      model: "Model",
      serial_no1: "Serial No",
      condition1: "Condition",
      document:"Document View",
      asset_spec:"Asset Product Specification",
      assetusedemp:"Asset Used By Employee",
      istransfer:"IS Branch Transfer",
      tran_branch:"Branch Transfer Name",
    },
  ];

  listcomments: any = [];
  listcomments1: any = [];
  assetgroupform: any = FormGroup;
  productId: any = null;
  d2: any;
  data: any;
  branchname: number;
  changeText: any;
  changeText1: any;
  changeTexthover: any;
  changeTexthover1: any;
  isLoading = false;
  assetsave: any = FormGroup;
  // assetgroupform:any= FormGroup;
  category: Array<any> = [];
  product: Array<any> = [];
  has_nextcom_branch = true;
  currentpagecom_branch = 1;
  has_previouscom = true;
  catId: any = null;
  has_nextbuk = false;
  has_previousbuk = false;
  has_nextbukPV = false;
  has_previousbukPV = false;
  pageNumber: number = 1;
  pageSize = 10;
  presentpagebuk: number = 1;
  presentpagebukPV: number = 1;

  datapagination: any = [];
  totalRecords: string;
  page: number = 1;
  date_asset: any = "";
  branchdata: any = [];
  flagSearch = true;
  flag = false;
  doBranch = true;
  goBack_new = false;
  searchFlag = false;
  first = false;
  second_t = false;
  second_d = false;
  second = false;
  role_download = true;
  role_download_t = true;
  pv_done: pv_done[] = [
    { value: "YES", viewValue: "YES" },
    { value: "NO", viewValue: "NO" },
  ];
  branch_id: any;
  flagSearchVar: string;
  branchdata_do: any;
  flag_ctrl = false;
  branchDO: any = [];
  pvfileData: any = new FormData();
  is_admin_branch:boolean=false;
  productName: any;

  constructor(
    private router: Router,
    private share: faShareService,
    private http: HttpClient,
    private Faservice: faservice,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // this.getApi();
    this.data = this.share.regular.value;

    if (true) {
      console.log("condition1=", this.data);
      this.assetgroupform = this.fb.group({
        Asset_id: new FormControl(),
        branch: new FormControl(),
        Asset_edit: new FormControl(),
        asset_cat: new FormControl(),
        invoicedate: new FormControl(),
        asset_cost: new FormControl(),
        product: new FormControl(),
        crno: new FormControl(""),
        product_id_data: new FormControl(""),
        branch_do: new FormControl(""),
        branch_admin: new FormControl('')
      });
      this.assetsave = new FormGroup({
        pv_done: new FormControl(""),
      });
    }
    this.Faservice.getbranchsearch("", 1).subscribe((data) => {
      this.branchdata = data["data"];
    });

     this.Faservice.get_is_branch('', 1).subscribe(data=>{
       let datas = data["data"];
        this.branch_code_list = datas;
        if(data?.is_admin === true){
          this.is_admin_branch=true
        }else{
           this.is_admin_branch=false
           this.currentpv_value = "pvapprover";
           this.onValueChange('pvapprover');

        }
    })

    this.assetgroupform
      .get("branch")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.Faservice.getbranchsearch(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )

      .subscribe((results: any[]) => {
        this.branchdata = results["data"];
        console.log("branch_id=", results);
        console.log("branch_data=", this.branchdata);
      });

    this.Faservice.getbranchdosearch("", 1).subscribe((data) => {
      this.branchdata_do = data["data"];
    });
    this.assetgroupform
      .get("branch_do")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.Faservice.getbranchdosearch(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )

      .subscribe((results: any[]) => {
        this.branchdata_do = results["data"];
        console.log("branch_id=", results);
        console.log("branch_data=", this.branchdata_do);
      });
    // this.Faservice.getassetproductdata("", 1).subscribe((data) => {
    //   this.product = data["data"];
    // });

    this.assetgroupform
      .get("product")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap((value: any) =>
          this.Faservice.get_productListdatas(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        this.productlist = results["data"];
      });



    console.log("true", this.flagSearch);
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 10 seconds */
      this.spinner.hide();
    }, 3000);

    this.listcomments.paginator = this.paginator;

    var date = new Date();
    console.log(this.datePipe.transform(date, "yyyy-MM-dd"));
    this.date_asset = this.datePipe.transform(date, "yyyy-MM-dd");
    this.getdata();
  }

  autocompleteScroll_branch() {
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
              if (this.has_nextcom_branch === true) {
                this.Faservice.getbranchdosearchscroll(
                  this.branchidInput.nativeElement.value,
                  this.currentpagecom_branch + 1
                ).subscribe((results: any[]) => {
                  let datas = results["data"];
                  console.log("branch_branch=", results);
                  let datapagination = results["pagination"];
                  this.branchdata = this.branchdata.concat(datas);
                  if (this.branchdata.length >= 0) {
                    this.has_nextcom_branch = datapagination.has_next;
                    this.has_previouscom = datapagination.has_previous;
                    this.currentpagecom_branch = datapagination.index;
                  }
                });
              }
            }
          });
      }
    });
  }

  autocompleteScroll_branchdo() {
    setTimeout(() => {
      if (
        this.matbranchdoAutocomplete &&
        this.autocompleteTrigger &&
        this.matbranchdoAutocomplete.panel
      ) {
        fromEvent(this.matbranchdoAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map(
              (x) => this.matbranchdoAutocomplete.panel.nativeElement.scrollTop
            ),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matbranchdoAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matbranchdoAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matbranchdoAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.Faservice.getbranchdosearchscroll(
                  this.branchidInput.nativeElement.value,
                  this.currentpagecom_branch + 1
                ).subscribe((results: any[]) => {
                  let datas = results["data"];
                  console.log("branch_branch=", results);
                  let datapagination = results["pagination"];
                  this.branchdata_do = this.branchdata_do.concat(datas);
                  if (this.branchdata.length >= 0) {
                    this.has_nextcom_branch = datapagination.has_next;
                    this.has_previouscom = datapagination.has_previous;
                    this.currentpagecom_branch = datapagination.index;
                  }
                });
              }
            }
          });
      }
    });
  }

  checker_branchs(data) {
    this.flag_ctrl = false;
    this.branch_id = data.code;
    this.getassetcategorysummary1(this.branch_id);
    this.getassetcategorysummary(this.branch_id);
  }

  checker_branchs_do(data) {
    console.log("new branch", data);
    this.flag = true;
    this.flag_ctrl = true;
    this.branch_id = data.control_office_branch.code;
    this.getassetcategorysummary3(this.branch_id);
    this.getassetcategorysummary2(this.branch_id);
  }

  checker_branchdo_filter(data) {
    this.getassetsearchsummary3(data.branch_code);
  }

  getassetcategorysummary1(d) {
    this.Faservice.getbranchsearchapprover1(d, this.pageNumber).subscribe(
      (result: any) => {
        // this.spinner.hide();
        console.log("landlord-1", result);
        let datass = result["data"];
        this.listcomments1 = result["data"];
        this.datapagination = result["pagination"];
        this.spinner.hide();
        console.log("landlord", this.listcomments1);
        if (this.listcomments1.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
      },
      (error: any) => {
        console.log(error);

        this.spinner.hide();
      }
    );
  }

  getassetcategorysummary(d) {
    this.Faservice.getbranchsearchapprover(d, this.pageNumber).subscribe(
      (result: any) => {
        // this.spinner.hide();
        console.log("landlord-1", result);
        let datass = result["data"];
        this.listcomments = result["data"];
        this.datapagination = result["pagination"];
        this.spinner.hide();
        console.log("landlord", this.listcomments);
        if (this.listcomments?.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
      },
      (error: any) => {
        console.log(error);

        this.spinner.hide();
      }
    );
  }

  getassetcategorysummary3(d) {
    this.Faservice.getbranchsearchapprover3(d, this.pageNumber).subscribe(
      (result: any) => {
        // this.spinner.hide();
        console.log("landlord-1", result);
        let datass = result["data"];
        this.listcomments1 = result["data"];
        this.datapagination = result["pagination"];
        this.spinner.hide();
        console.log("landlord", this.listcomments1);
        for (let i = 0; i < this.listcomments1.length; i++) {
          console.log("new", this.listcomments1);
          this.branchDO = this.listcomments1;
        }
        if (this.listcomments1.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
        console.log("brn_new", this.branchDO);
      },
      (error: any) => {
        console.log(error);

        this.spinner.hide();
      }
    );
  }

  getassetcategorysummary2(d) {
    this.Faservice.getbranchsearchapprover2(d, this.pageNumber).subscribe(
      (result: any) => {
        // this.spinner.hide();
        console.log("landlord-1", result);
        let datass = result["data"];
        this.listcomments = result["data"];
        this.datapagination = result["pagination"];
        this.spinner.hide();
        console.log("landlord", this.listcomments);
        if (this.listcomments?.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
      },
      (error: any) => {
        console.log(error);

        this.spinner.hide();
      }
    );
  }

  getassetsearchsummary3(d) {
    this.Faservice.getbranchsearchselect(d, this.pageNumber).subscribe(
      (result: any) => {
        // this.spinner.hide();
        console.log("landlord_DO Branch", result);
        let datass = result["data"];
        this.listcomments = result["data"];
        this.datapagination = result["pagination"];
        this.spinner.hide();
        console.log("landlord", this.listcomments);
        if (this.listcomments?.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
      },
      (error: any) => {
        console.log(error);

        this.spinner.hide();
      }
    );
  }

  assetgrps_ddlbranch(e: any) {
    this.d2 = e.branch_code;
    // let obj:string = event.target.value;
    let dear1: any = { branch_code: e.branch_code };
    this.Faservice.getbranchsearch(dear1, 1).subscribe((results) => {
      console.log(results);
      for (let i = 0; i < results.length; i++) {
        console.log(i);
        this.listcomments = results;
        console.log(this.listcomments);
      }
    });
  }

  search() {
   
    if (this.flagSearchVar == "YES") {
      this.getApi();
    } else if (this.flagSearchVar == "NO")  {      this.getApi2();
      this.getApi3();
      this.flag_ctrl = true;
    }
  }
  search_one() {
    if (true) {
      this.getdata();
    } else if (this.flagSearchVar == "NO") {
      this.getApi2();
      this.getApi3();
      this.flag_ctrl = true;
    }
  }
  finalSubmitted() {
    // for(let i=0;i<this.listcomments?.length;i++){
    //   if(this.listcomments[i].branch_code == this.d2) {
    //     this.listcomments[j] = this.listcomments[i]
    //     // console.log(this.listcomments)
    //     j++;
    //   }
    // }
  }
  public onValueChange(value) {
    if (value === "pvserialnoupdate") {
      this.currentpv_value = "pvserialnoupdate";
      this.pvserialnoupdate = true;
      this.pvapprover = false;
      this.getdata()
    }
    if (value === "pvapprover") {
      this.pvapprover = true;
      this.currentpv_value = "pvapprover";
      this.pvserialnoupdate = false;
      this.getApi();
      this.getApi1();
    }
  }

  private getasset_category(keyvalue) {
    this.Faservice.getassetcategorynew(keyvalue, 1).subscribe(
      (results: any[]) => {
        let datas = results["data"];
        this.category = datas;
      }
    );
  }
  asset_category() {
    let keyvalue: String = "";
    this.getasset_category(keyvalue);
    this.assetgroupform
      .get("asset_cat")
      .valueChanges.pipe(
        startWith(""),
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),

        switchMap((value: any) =>
          this.Faservice.getassetcategorynew(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.category = datas;
      });
  }

  categoryClick(d) {
    this.catId = d.id;
  }

  product12(data) {
    this.productId = data.id;
  }
  product123(data) {
    this.productName = data.name;
  }

  // resetgetdata1() {
  //   // (this.assetsave.get('listproduct') as FormArray).clear()
  //   let search: string = "";
  //   console.log(this.assetgroupform.value);
  //   this.assetgroupform.reset("");
  //   if (
  //     this.assetgroupform.get("branch").value != "" &&
  //     this.assetgroupform.get("branch").value != null
  //   ) {
  //     console.log("hi");
  //     // this.searchdata.branch=this.assetgroupform.value.branch
  //     search = search + "&branch=" + this.branch_id;
  //   }
  //   if (
  //     this.assetgroupform.get("Asset_id").value != "" &&
  //     this.assetgroupform.get("Asset_id").value != null
  //   ) {
  //     console.log("hii");
  //     // this.searchdata.barcode=this.assetgroupform.value.barcode
  //     search = search + "&barcode=" + this.assetgroupform.get("Asset_id").value;
  //   }
  //   if (
  //     this.assetgroupform.get("asset_cat").value != null &&
  //     this.assetgroupform.get("asset_cat").value != ""
  //   ) {
  //     search = search + "&asset_cat=" + this.catId;
  //   }
  //   if (
  //     this.assetgroupform.get("product").value != null &&
  //     this.assetgroupform.get("product").value != ""
  //   ) {
  //     search = search + "&product=" + this.productId;
  //   }
  //   if (
  //     this.assetgroupform.get("invoicedate").value != null &&
  //     this.assetgroupform.get("invoicedate").value != ""
  //   ) {
  //     let datevalue = this.assetgroupform.get("invoicedate").value;
  //     search =
  //       search +
  //       "&asset_cap=" +
  //       this.datePipe.transform(datevalue, "yyyy-MM-dd");
  //   }
  //   if (
  //     this.assetgroupform.get("asset_cost").value != null &&
  //     this.assetgroupform.get("asset_cost").value != ""
  //   ) {
  //     search =
  //       search + "&asset_cost=" + this.assetgroupform.get("asset_cost").value;
  //   }
  //   this.spinner.show();
  //   console.log(search);
  //   this.spinner.show();
  //   this.Faservice.getassetdata2_checkerPV(
  //     this.presentpagebuk,
  //     this.selectPage,
  //     search
  //   ).subscribe(
  //     (data) => {
  //       this.spinner.hide();
  //       if (data.code != undefined && data.code != "" && data.code != null) {
  //         this.toastr.warning(data.description);
  //       } else {
  //         this.listcomments = data[0]["data"];
  //         this.serial_count = data[0]["count"];

  //         console.log(data);
  //         for (let i = 0; i < this.listcomments?.length; i++) {
  //           this.listcomments[i]["is_Checked"] = false;
  //         }

  //         this.datapagination = data[0]["pagination"];
  //         if (this.listcomments.length >= 0) {
  //           this.has_nextbuk = this.datapagination.has_next;
  //           this.has_previousbuk = this.datapagination.has_previous;
  //           this.presentpagebuk = this.datapagination.index;
  //         }

  //         // let i:any=((this.assetsave.get('listproduct') as FormArray).length);
  //         // ((this.assetsave.get('listproduct') as FormArray).removeAt(i[11]-1));
  //       }
  //     },
  //     (error) => {
  //       this.spinner.hide();
  //       this.listcomments = [];
  //       this.toastr.warning(error.status + error.statusText);
  //     }
  //   );
  // }
  reset_pvserialno(){
    this.assetgroupform.reset('');
    this.getdata();
  }
  serial_count: number = 0;
  getdata() {
    // (this.assetsave.get('listproduct') as FormArray).clear()
    let search: string = "";
    console.log(this.assetgroupform.value);
    // if (
    //   this.assetgroupform.get("branch").value != "" &&
    //   this.assetgroupform.get("branch").value != null
    // ) {
    //   console.log("hi");
    //   // this.searchdata.branch=this.assetgroupform.value.branch
    //   search = search + "&branch=" + this.branch_id;
    // }
    if (
      this.assetgroupform.get("Asset_id").value != "" &&
      this.assetgroupform.get("Asset_id").value != null
    ) {
      console.log("hii");
      // this.searchdata.barcode=this.assetgroupform.value.barcode
      search = search + "&barcode=" + this.assetgroupform.get("Asset_id").value;
    }
    if (
      this.assetgroupform.get("asset_cat").value != null &&
      this.assetgroupform.get("asset_cat").value != ""
    ) {
      search = search + "&asset_cat=" + this.catId;
    }
    if (
      this.assetgroupform.get("product").value != null &&
      this.assetgroupform.get("product").value != ""
    ) {
      search = search + "&product=" + this.assetgroupform.get("product").value.id;
    }
    if (
      this.assetgroupform.get("invoicedate").value != null &&
      this.assetgroupform.get("invoicedate").value != ""
    ) {
      let datevalue = this.assetgroupform.get("invoicedate").value;
      search =
        search +
        "&asset_cap=" +
        this.datePipe.transform(datevalue, "yyyy-MM-dd");
    }
    if (
      this.assetgroupform.get("asset_cost").value != null &&
      this.assetgroupform.get("asset_cost").value != ""
    ) {
      search =
        search + "&asset_cost=" + this.assetgroupform.get("asset_cost").value;
    }
    if (
      this.assetgroupform.get("crno").value != null &&
      this.assetgroupform.get("crno").value != ""
    ) {
      search = search + "&crno=" + this.assetgroupform.get("crno").value;
    }
    if (
      this.assetgroupform.get("branch_admin").value != null &&
      this.assetgroupform.get("branch_admin").value != ""
    ){
      search= search + "&branch=" + this.assetgroupform.get('branch_admin').value.id
    }
    this.spinner.show();
    console.log(search);
    this.Faservice.getassetdata2_checker(
      this.presentpagebuk,
      this.selectPage,
      search
    ).subscribe(
      (data) => {
        this.spinner.hide();
        if (data.code != undefined && data.code != "" && data.code != null) {
          this.toastr.warning(data.description);
        } else {
          // if(data['data']['desp_startswith']==false){
          //   delete data['data']['description']
          // }
          this.listcomments = data["data"];
          this.serial_count = data["count"];

          console.log(data);
          if (data["data"].length == 0) {
            this.toastr.warning("Matching data Not Found");
          }
          for (let i = 0; i < this.listcomments?.length; i++) {
            this.listcomments[i]["is_Checked"] = false;
          }
          this.datapagination = data["pagination"];

          console.log("d-", data["data"]);
          console.log("page", this.datapagination);
          if (this.listcomments?.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
          }
          console.log(this.listcomments?.length);
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.warning(error.status + error.statusText);
        this.listcomments = [];
      }
    );
  }

  fapvfileprepare() {
    (this.assetsave.get("listproduct") as FormArray).clear();
    let search: string = "";
    console.log(this.assetgroupform.value);
    if (
      this.assetgroupform.get("branch").value != "" &&
      this.assetgroupform.get("branch").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.branch_id;
    }
    if (
      this.assetgroupform.get("Asset_id").value != "" &&
      this.assetgroupform.get("Asset_id").value != null
    ) {
      console.log("hii");
      // this.searchdata.barcode=this.assetgroupform.value.barcode
      search = search + "&barcode=" + this.assetgroupform.get("Asset_id").value;
    }
    if (
      this.assetgroupform.get("asset_cat").value != null &&
      this.assetgroupform.get("asset_cat").value != ""
    ) {
      search = search + "&asset_cat=" + this.catId;
    }
    if (
      this.assetgroupform.get("product").value != null &&
      this.assetgroupform.get("product").value != ""
    ) {
      search = search + "&product=" + this.productId;
    }
    if (
      this.assetgroupform.get("invoicedate").value != null &&
      this.assetgroupform.get("invoicedate").value != ""
    ) {
      let datevalue = this.assetgroupform.get("invoicedate").value;
      search =
        search +
        "&asset_cap=" +
        this.datePipe.transform(datevalue, "yyyy-MM-dd");
    }
    if (
      this.assetgroupform.get("asset_cost").value != null &&
      this.assetgroupform.get("asset_cost").value != ""
    ) {
      search =
        search + "&asset_cost=" + this.assetgroupform.get("asset_cost").value;
    }
    if (
      this.assetgroupform.get("crno").value != null &&
      this.assetgroupform.get("crno").value != "" &&
      this.assetgroupform.get("crno").value != undefined
    ) {
      search = search + "&crno=" + this.assetgroupform.get("crno").value;
    }
    this.spinner.show();
    console.log(search);
    this.first = true;
    this.spinner.show();
    this.Faservice.fapvrecordsprepare_checker(
      this.presentpagebuk,
      (this.pageSize = 10),
      search
    ).subscribe(
      (data: any) => {
        this.spinner.hide();
        console.log(data);
        this.first = false;
        this.spinner.hide();
        if (data.code != undefined && data.code != "" && data.code != null) {
          this.toastr.warning(data.code);
          this.toastr.warning(data.description);
        } else {
          this.toastr.success(data.status);
          this.toastr.success(data.message);
        }
      },
      (error: HttpErrorResponse) => {
        this.first = false;
        this.spinner.hide();
        this.toastr.error("Status=" + error.status);
        this.toastr.error("Error Type=" + error.statusText);
      }
    );
  }
  fapvfiledownload() {
    this.spinner.show();
    this.Faservice.fapvrecordsdownload_checker().subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response["type"] == "application/json") {
          const reader = new FileReader();

          reader.onload = (event: any) => {
            const fileContent = event.target.result;
            // Handle the file content here
            console.log(fileContent);
            let DataNew: any = JSON.parse(fileContent);
            this.toastr.warning(DataNew.code);
            this.toastr.warning(DataNew.description);
          };

          reader.readAsText(response);
          //this.toastr.warning('No Records Found..')
        } else {
          let filename: any = "document";
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink: any = document.createElement("a");
          //console.log()
          downloadLink.href = window.URL.createObjectURL(
            new Blob(binaryData, { type: dataType })
          );

          downloadLink.setAttribute("download", filename);
          document.body.appendChild(downloadLink);
          let dte: any = new Date();
          let valied_dte = this.datePipe.transform(dte, "yyyy-MM-dd");
          downloadLink.download = "FA-PV Data " + valied_dte + ".xlsx";
          downloadLink.click();
        }
      },
      (error: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastr.error("Status=" + error.status);
        this.toastr.error("Error Type=" + error.statusText);
      }
    );
  }
  fa_serial_number_update(dataf: any, i: any) {
    let serial_no: any = (
      (this.assetsave.get("listproduct") as FormArray).at(i) as FormGroup
    ).get("serial_no").value; //get("serial_no")
    console.log(serial_no);
    let data: any = dataf.value;
    let product_id: any = (
      (this.assetsave.get("listproduct") as FormArray).at(i) as FormGroup
    ).get("product_id_data").value;
    if (
      serial_no == undefined ||
      serial_no == "" ||
      serial_no == null ||
      serial_no == "0"
    ) {
      this.toastr.warning("Please Enter The Valid Serial No..");
      return false;
    }
    // return false;
    let datas: any = {
      assetheader_id: data.assetheader_id,
      barcode: data.barcode,
      serial_no: serial_no,
      product_id: product_id,
    };

    this.spinner.show();
    this.Faservice.fa_serial_no_update_checker(datas).subscribe(
      (responce: any) => {
        this.spinner.hide();
        if (
          responce.code != undefined &&
          responce.code != "" &&
          responce != null
        ) {
          this.toastr.warning(responce.code);
          this.toastr.warning(responce.description);
        } else {
          this.toastr.success(responce.status);
          this.toastr.success(responce.message);
        }
      },
      (error: HttpErrorResponse) => {
        this.spinner.hide();
        this.toastr.error("Status=" + error.status);
        this.toastr.error("Error Type=" + error.statusText);
      }
    );
  }
  fapvfileafterupload() {
    console.log(this.pvfileData.has("file"));
    if (this.pvfileData.has("file")) {
      this.spinner.show();
      this.Faservice.fapvrecordsupload_checker(this.pvfileData).subscribe(
        (responce: any) => {
          this.spinner.hide();
          if (responce.code != undefined && responce && responce != null) {
            this.toastr.warning(responce.code);
            this.toastr.warning(responce.description);
          } else {
            this.toastr.success(responce.status);
            this.toastr.success(responce.message);
          }
        },
        (error: HttpErrorResponse) => {
          this.spinner.hide();
          this.toastr.error("Status=" + error.status);
          this.toastr.error("Error Type=" + error.statusText);
        }
      );
    }
  }

  fapvfileget(event: any) {
    this.pvfileData.delete("file");

    if (event.target.files.length > 0) {
      this.pvfileData.append("file", event.target.files[0]);
    } else {
      this.toastr.warning("Please Select The Valid Files ..");
    }
  }
  getApi1() {
    let search: string = "";
    console.log(this.assetgroupform.value);
    if (
      this.assetgroupform.get("branch").value != "" &&
      this.assetgroupform.get("branch").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.branch_id;
    }
    if (
      this.assetgroupform.get("branch_do").value != "" &&
      this.assetgroupform.get("branch_do").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.branch_id;
    }
    // this.Faservice.getapprover1(this.pageNumber, search).subscribe(
    //   (data) => {
    //     console.log("santhosh", data);
    //     if (data.description == "Invalid Branch Id") {
    //       this.toastr.error("No Branch ID Assigned");
    //       this.flagSearch = false;
    //       this.doBranch = false;
    //       this.flagSearchVar = "NO";
    //       console.log("search_value", this.flagSearch);
    //     } else if (data[0].error == "INVALID_BRANCH_DO") {
    //       this.flagSearch = true;
    //       this.doBranch = true;
    //       this.goBack_new = true;
    //       this.searchFlag = true;
    //       this.listcomments1 = data[0]["data"];
    //       if (this.listcomments1.length === 0) {
    //         this.toastr.warning("No Maker Done For The Branch ID");
    //       }
      
    //     } else {
    //       console.log(data);
    //       this.flagSearchVar = "YES";
    //       this.doBranch = true;
    //       this.goBack_new = false;
    //       this.searchFlag = false;
    //       this.listcomments1 = data[0]["data"];
    //       if (this.listcomments1.length == 0) {
    //         this.toastr.warning("No Maker Done For The Branch ID");
    //       }

    //     }
    //   },
    //   (error) => {
    //     this.spinner.hide();
    //     this.toastr.warning(error.status + error.statusText);
    //   }
    // );
  }
  serial_counts: number = 0;
  getApi() {
    let search: string = "";
    console.log(this.assetgroupform.value);
    if (
      this.assetgroupform.get("branch").value != "" &&
      this.assetgroupform.get("branch").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.branch_id;
    }
    if (
      this.assetgroupform.get("branch_admin").value != "" &&
      this.assetgroupform.get("branch_admin").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.assetgroupform.get("branch_admin").value?.name;
    }
    if (
      this.assetgroupform.get("branch_do").value != "" &&
      this.assetgroupform.get("branch_do").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.branch_id;
    }
    this.spinner.show();
    this.Faservice.getapproverPV(this.pageNumber, search).subscribe(
      (data) => {
        this.spinner.hide()
        console.log("santhosh1", data);
        if (data[0].description == "Invalid Branch Id") {
          this.toastr.error("No Branch ID Assigned");
          this.flagSearch = false;
          this.doBranch = false;
          this.flagSearchVar = "NO";
          console.log("search_value", this.flagSearch);
          if (data[0].role == 1) {
            this.role_download = false;
          } else {
            this.role_download = true;
          }
        } else if (data[0].error == "INVALID_BRANCH_DO") {
          this.flagSearch = true;
          this.doBranch = true;
          this.goBack_new = true;
          this.searchFlag = true;
          this.listcomments = data[0]["data"];
          this.serial_counts = data[0]["count"];
          if (data[0].role == 1) {
            this.role_download = false;
          } else {
            this.role_download = true;
          }
          this.datapagination = data[0]["pagination"];
          if (this.listcomments?.length >= 0) {
            this.has_nextbukPV = this.datapagination.has_next;
            this.has_previousbukPV = this.datapagination.has_previous;
            this.presentpagebukPV = this.datapagination.index;
          }
          if (this.listcomments?.length <= 0) {
            // this.toastr.warning("No Maker Done For The Branch ID");
          }
        } else {
          console.log(data);
          this.flagSearchVar = "YES";
          this.doBranch = true;
          this.goBack_new = false;
          this.searchFlag = false;
          this.listcomments = data[0]["data"];
          this.serial_counts = data[0]["count"];
          if (this.listcomments?.length === 0) {
            // this.toastr.warning("No Maker Done For The Branch ID");
          }
          this.datapagination = data[0]["pagination"];
          console.log("d-", data[0]["data"]);
          console.log("page", this.datapagination);
          if (this.listcomments?.length >= 0) {
            this.has_nextbukPV = this.datapagination.has_next;
            this.has_previousbukPV = this.datapagination.has_previous;
            this.presentpagebukPV = this.datapagination.index;
          }
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.warning(error.status + error.statusText);
      }
    );
  }

  getApi3() {
    let search: string = "";
    console.log(this.assetgroupform.value);
    if (
      this.assetgroupform.get("branch").value != "" &&
      this.assetgroupform.get("branch").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.branch_id;
    }
    if (
      this.assetgroupform.get("branch_do").value != "" &&
      this.assetgroupform.get("branch_do").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.branch_id;
    }
    this.Faservice.getbranchsearchapproverbranch1(
      search,
      this.pageNumber
    ).subscribe(
      (data) => {
        this.listcomments1 = data["data"];
        if (this.listcomments1.length === 0) {
          // this.toastr.warning("No Maker Done For The Branch ID");
        }
        // this.datapagination = data['pagination'];
        // if (this.listcomments1.length >= 0) {
        //   this.has_nextbuk = this.datapagination.has_next;
        //   this.has_previousbuk = this.datapagination.has_previous;
        //   this.presentpagebuk = this.datapagination.index;
        //   }
        // console.log('d-',data['data']);
        // console.log('page',this.datapagination)
      },
      (error) => {
        this.spinner.hide();
        this.toastr.warning(error.status + error.statusText);
      }
    );
  }

  getApi2() {
    let search: string = "";
    console.log(this.assetgroupform.value);
    if (
      this.assetgroupform.get("branch").value != "" &&
      this.assetgroupform.get("branch").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.branch_id;
    }
    if (
      this.assetgroupform.get("branch_do").value != "" &&
      this.assetgroupform.get("branch_do").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.branch_id;
    }
    this.Faservice.getbranchsearchapproverfull1(
      search,
      this.pageNumber
    ).subscribe(
      (data) => {
        this.listcomments = data["data"];
        this.datapagination = data["pagination"];
        if (this.listcomments?.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
        if (this.listcomments?.length === 0) {
          // this.toastr.warning("No Maker Done For The Branch ID");
        }
        console.log("d-", data["data"]);
        console.log("page", this.datapagination);
      },
      (error) => {
        this.spinner.hide();
        this.toastr.warning(error.status + error.statusText);
      }
    );
  }

  // getApi2(){
  //   let search:string="";
  //   console.log(this.assetgroupform.value)
  //   this.Faservice.getbranchsearchapproverfull1(search,this.pageNumber).subscribe((data) => {
  //       console.log( data);
  //       this.listcomments = data['data'];
  //       this.datapagination = data['pagination'];
  //       console.log('d-',data['data']);
  //       console.log('page',this.datapagination)
  //       // if (this.listcomments?.length >= 0) {
  //       // this.has_nextbuk = this.datapagination.has_next;
  //       // this.has_previousbuk = this.datapagination.has_previous;
  //       // this.presentpagebuk = this.datapagination.index;
  //       // }
  //     }
  // )}

  // getApi3(){
  //   let search:string="";
  //   console.log(this.assetgroupform.value)
  //   this.Faservice.getbranchsearchapproverbranch1(search,this.pageNumber).subscribe((data) => {
  //       console.log( data);
  //       this.listcomments1 = data['data'];
  //       this.datapagination = data['pagination'];
  //       console.log('d-',data['data']);
  //       console.log('page',this.datapagination)
  //       if (this.listcomments?.length >= 0) {
  //       this.has_nextbuk = this.datapagination.has_next;
  //       this.has_previousbuk = this.datapagination.has_previous;
  //       this.presentpagebuk = this.datapagination.index;
  //       }
  //     }
  // )}

  // createPdf() {
  //   var doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text('My Team Detail', 11, 8);
  //   doc.setFontSize(11);
  //   doc.setTextColor(100);

  //   (doc as any).autoTable({
  //     head: this.head,
  //     body: this.listcomments,
  //     theme: 'plain',
  //     didDrawCell: data => {
  //       console.log(data.column.index)
  //     }
  //   })
  // below line for Open PDF document in new tab
  // doc.output('dataurlnewwindow')

  // below line for Download PDF document
  // doc.save('myteamdetail.pdf');
  // }

  createBranchXLS() {
    if (this.flag_ctrl == false) {
      this.spinner.show();
      this.Faservice.getApproverBranchDownload().subscribe(
        (branchXLS) => {
          console.log(branchXLS);
          let binaryData = [];
          binaryData.push(branchXLS);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = "PVSummaryReport" + date + ".xlsx";
          link.click();
          this.spinner.hide();
          // FileSaver.saveAs(branchXLS, `Summary_report.xlsx`)
        },
        (error) => {
          this.spinner.hide();
          this.toastr.warning(error.status + error.statusText);
        }
      );
    } else if (this.flag_ctrl == true) {
      this.spinner.show();
      this.Faservice.getApproverBranchDownload1(this.branch_id).subscribe(
        (fullXLS) => {
          console.log(fullXLS);
          let binaryData = [];
          binaryData.push(fullXLS);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = "PVDetailedReport" + date + ".xlsx";
          link.click();
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.warning(error.status + error.statusText);
        }
      );
    }
  }

  createFullXLS() {
    if (this.flag_ctrl == false) {
      this.spinner.show();
      this.Faservice.getApproverFullDownload().subscribe(
        (fullXLS) => {
          console.log(fullXLS);
          let binaryData = [];
          binaryData.push(fullXLS);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = "PVDetailedReport" + date + ".xlsx";
          link.click();
          this.spinner.hide();
          // FileSaver.saveAs(fullXLS, `Detailed_report.xlsx`)
        },
        (error) => {
          this.spinner.hide();
          this.toastr.warning(error.status + error.statusText);
        }
      );
    } else if (this.flag_ctrl == true) {
      this.spinner.show();
      this.Faservice.getApproverFullDownload1(this.branch_id).subscribe(
        (fullXLS) => {
          console.log(fullXLS);
          let binaryData = [];
          binaryData.push(fullXLS);
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement("a");
          link.href = downloadUrl;
          let date: Date = new Date();
          link.download = "PVDetailedReport" + date + ".xlsx";
          link.click();
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.warning(error.status + error.statusText);
        }
      );
    }
  }

  allBranchDownload() {
    // this.spinner.show()
    if (this.first == true) {
      this.toastr.warning("Already Progress");
      return true;
    }
    this.first = true;
    this.toastr.warning("Wait For 5 Mins", "", {
      timeOut: 420000,
      progressBar: true,
      progressAnimation: "decreasing",
    });
    this.Faservice.getAllBranchDownload().subscribe(
      (branchXLS) => {
        console.log(branchXLS);
        // this.first = false;
        // this.download = true;
        //this.toastr.success('Click Download')
        // this.spinner.hide()
      },
      (error) => {
        // this.spinner.hide();
        // this.first = false;
        this.toastr.warning(error.status + error.statusText);
      }
    );
    setTimeout(() => {
      this.first = false;
      this.download = true;
      this.toastr.success("Click Download");
    }, 420000);
  }
  allBranchDownload_t() {
    // this.spinner.show()
    if (this.second_t == true) {
      this.toastr.warning("Already Progress");
      return true;
    }
    this.second_t = true;
    this.toastr.warning("Wait For 5 Mins", "", {
      timeOut: 240000,
      progressBar: true,
      progressAnimation: "decreasing",
    });
    this.Faservice.getAllBranchDownload_new().subscribe(
      (branchXLS) => {
        console.log(branchXLS);
        // this.first = false;
        // this.download = true;
        //this.toastr.success('Click Download')
        // this.spinner.hide()
      },
      (error) => {
        // this.spinner.hide();
        // this.first = false;
        this.toastr.warning(error.status + error.statusText);
      }
    );
    setTimeout(() => {
      this.second_t = false;
      // this.second_d = true;
      this.download_d = true;
      this.toastr.success("Click Download");
    }, 240000);
  }

  allDownload() {
    // this.spinner.show()
    if (this.second == true) {
      this.toastr.warning("Already Progress");
      return true;
    }
    this.second = true;
    this.toastr.warning("Wait For 5 Mins");
    this.Faservice.getAllDownload().subscribe(
      (branchXLS) => {
        console.log(branchXLS);
        let binaryData = [];
        binaryData.push(branchXLS);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = "PVSummaryReport" + date + ".xlsx";
        link.click();
        this.second = false;
        this.toastr.success("SUCCESS");
        // this.spinner.hide()
      },
      (error) => {
        // this.spinner.hide();
        this.second = false;
        this.toastr.warning(error.status + error.statusText);
      }
    );
  }
  allDownload_d() {
    // this.spinner.show()
    if (this.second_d == true) {
      this.toastr.warning("Already Progress");
      return true;
    }
    this.second_d = true;
    this.toastr.warning("Wait For 5 Mins");
    this.Faservice.getAllDownload_new().subscribe(
      (branchXLS) => {
        console.log(branchXLS);
        let binaryData = [];
        binaryData.push(branchXLS);
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement("a");
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = "PVSummaryReport" + date + ".xlsx";
        link.click();
        this.second_d = false;
        // this.download_d = false;
        this.toastr.success("SUCCESS");
        // this.spinner.hide()
      },
      (error) => {
        // this.spinner.hide();
        this.second_d = false;
        this.toastr.warning(error.status + error.statusText);
      }
    );
  }
  //       createPdf1() {
  //         var doc = new jsPDF();

  //         doc.setFontSize(18);
  //         doc.text('My Team Detail', 11, 8);
  //         doc.setFontSize(11);
  //         doc.setTextColor(100);

  //         (doc as any).autoTable({
  //           head: this.head1,
  //           body: this.listcomments,
  //           theme: 'plain',
  //           didDrawCell: data => {
  //             console.log(data.column.index)
  //           }
  //         })
  //         // below line for Open PDF document in new tab
  //         doc.output('dataurlnewwindow')

  //         // below line for Download PDF document
  //         doc.save('myteamdetail.pdf');
  // }

  goBack() {
    this.Faservice.getapprover(this.pageNumber, "").subscribe(
      (data) => {
        console.log(data);
        this.listcomments = data["data"];
        this.datapagination = data["pagination"];
        console.log("d-", data["data"]);
        console.log("page", this.datapagination);
        if (this.listcomments?.length >= 0) {
          this.has_nextbuk = this.datapagination.has_next;
          this.has_previousbuk = this.datapagination.has_previous;
          this.presentpagebuk = this.datapagination.index;
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.warning(error.status + error.statusText);
      }
    );

    // this.Faservice.getapprover1(this.pageNumber, "").subscribe((data) => {
    //   console.log(data);
    //   this.listcomments1 = data["data"];
    //   this.datapagination = data["pagination"];
    //   console.log("d-", data["data"]);
    //   console.log("page", this.datapagination);
    //   if (this.listcomments1.length >= 0) {
    //     this.has_nextbuk = this.datapagination.has_next;
    //     this.has_previousbuk = this.datapagination.has_previous;
    //     this.presentpagebuk = this.datapagination.index;
    //   }
    // });
  }

  buknextClick() {
    console.log(this.has_nextbuk, this.has_previousbuk, this.presentpagebuk);
    if (this.has_nextbuk === true) {
      this.spinner.show();
      if (this.doBranch == true) {
        this.Faservice.getbackin_pv(
          (this.pageNumber = this.presentpagebuk + 1),
          10,
          ""
        ).subscribe(
          (data) => {
            console.log(data);
            this.listcomments = data[0]["data"];
            this.datapagination = data[0]["pagination"];
            this.spinner.hide();
            console.log("d-", data["data"]);
            console.log("page", this.datapagination);
            if (this.listcomments?.length >= 0) {
              this.has_nextbuk = this.datapagination.has_next;
              this.has_previousbuk = this.datapagination.has_previous;
              this.presentpagebuk = this.datapagination.index;
            }
          },
          (error: any) => {
            console.log(error);

            this.spinner.hide();
          }
        );
      } else if (this.doBranch == false) {
        this.Faservice.getbackin_DoPV(
          (this.pageNumber = this.presentpagebuk + 1),
          10,
          this.branch_id
        ).subscribe(
          (data) => {
            console.log(data);
            this.listcomments = data[0]["data"];
            this.datapagination = data[0]["pagination"];
            this.spinner.hide();
            console.log("d-", data["data"]);
            console.log("page", this.datapagination);
            if (this.listcomments?.length >= 0) {
              this.has_nextbuk = this.datapagination.has_next;
              this.has_previousbuk = this.datapagination.has_previous;
              this.presentpagebuk = this.datapagination.index;
            }
          },
          (error: any) => {
            console.log(error);

            this.spinner.hide();
          }
        );
      }
    }
  }

  bukpreviousClick() {
    if (this.has_previousbuk === true) {
      this.spinner.show();
      if (this.doBranch == true) {
        this.Faservice.getbackin_pv(
          (this.pageNumber = this.presentpagebuk - 1),
          10,
          ""
        ).subscribe(
          (data) => {
            console.log(data);
            this.listcomments = data[0]["data"];
            this.datapagination = data[0]["pagination"];
            this.spinner.hide();
            console.log("d-", data["data"]);
            console.log("page", this.datapagination);
            if (this.listcomments?.length >= 0) {
              this.has_nextbuk = this.datapagination.has_next;
              this.has_previousbuk = this.datapagination.has_previous;
              this.presentpagebuk = this.datapagination.index;
            }
          },
          (error: any) => {
            console.log(error);

            this.spinner.hide();
          }
        );
      } else if (this.doBranch == false) {
        this.Faservice.getbackin_DoPV(
          (this.pageNumber = this.presentpagebuk - 1),
          10,
          this.branch_id
        ).subscribe(
          (data) => {
            console.log(data);
            this.listcomments = data[0]["data"];
            this.datapagination = data[0]["pagination"];
            this.spinner.hide();
            console.log("d-", data["data"]);
            console.log("page", this.datapagination);
            if (this.listcomments?.length >= 0) {
              this.has_nextbuk = this.datapagination.has_next;
              this.has_previousbuk = this.datapagination.has_previous;
              this.presentpagebuk = this.datapagination.index;
            }
          },
          (error: any) => {
            console.log(error);

            this.spinner.hide();
          }
        );
      }
    }
  }

  savesub() {}

  save(form: any, e) {
    // let e = {};
    // e['pv_done']= this.assetsave.get('pv_done').value;
    // e['checker_date']=this.date_asset;
    // e['completed_date']=this.date_asset;
    // console.log(e);
    // let d = this.assetsave.get('pv_done').value;
    // form['pv_done']='yes';
    form["asset_details_id"] = this.listcomments[e].id;
    form["branch_code"] = this.listcomments[e].branch_code;
    form["pv_done"] = this.assetsave.get("pv_done").value;
    form["checker_date"] = this.date_asset;
    form["completed_date"] = this.date_asset;
    console.log("form ", form);
    console.log("formdate ", this.date_asset);
    console.log(this.assetsave.get("pv_done").value);
    this.toastr.success("success");
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
    }, 3000);
    console.log("form ", form);
    this.Faservice.getapprover_data(form).subscribe((result) => {
      console.log(result);
    });
    this.assetsave.reset();
    // this.listcomments = this.listcomments.show();
  }
  onCheckboxChange(event, value, index) {
    const allChecked = this.listcomments.every((item) => item.enb);
    this.selectall_chbx = allChecked;
    if (event.currentTarget.checked) {
      this.listcomments[index]["enb"] = true;
    } else {
      this.listcomments[index]["enb"] = false;
    }
  }
  selectall_chbx: boolean = false;

  oncheckboxselectAll() {
    for (let i = 0; i < this.listcomments?.length; i++) {
      this.listcomments[i].enb = this.selectall_chbx;
    }
  }

  paginationChange(event: any) {
    console.log(event);
    console.log(this.selectPage);
    this.getdata();
  }
  previousClick() {
    if (this.has_previousbuk === true) {
      this.presentpagebuk = this.presentpagebuk - 1;
      this.getdata();
    }
  }
  nextClick() {
    if (this.has_nextbuk === true) {
      this.presentpagebuk = this.presentpagebuk + 1;
      this.getdata();
    }
  }
  approvedata() {
    let data: any = {};
    let datalist: any = [];
    this.listcomments.forEach((e) => {
      if (e.enb == true) {
        datalist.push(e);
      }
    });
    if (datalist.length == 0) {
      this.toastr.warning("Please Select The Data");
      return false;
    } else {
      data["type"] = "APPROVE";
      data["datalist"] = datalist;
      this.spinner.show();
      this.Faservice.pvserialno_update_reject(data).subscribe(
        (result: any) => {
          this.spinner.hide();
          if (
            result.code != undefined &&
            result.code != "" &&
            result.code != null
          ) {
            this.toastr.warning(result.description);
          } else {
            this.toastr.success(result.message);
            this.getdata();
            this.selectall_chbx = false;
          }
        },
        (error: HttpErrorResponse) => {
          this.spinner.hide();
        }
      );
    }
  }
  rejectdata() {
    let data: any = {};
    let datalist: any = [];
    this.listcomments.forEach((e) => {
      if (e.enb == true) {
        datalist.push(e);
      }
    });
    if (datalist.length == 0) {
      this.toastr.warning("Please Select The Data");
      return false;
    } else {
      data["type"] = "REJECT";
      data["datalist"] = datalist;
      this.spinner.show();
      this.Faservice.pvserialno_update_reject(data).subscribe(
        (result: any) => {
          this.spinner.hide();
          if (
            result.code != undefined &&
            result.code != "" &&
            result.code != null
          ) {
            this.toastr.warning(result.description);
          } else {
            this.toastr.success(result.message);
            this.getdata();
            this.selectall_chbx = false;
          }
        },
        (error: HttpErrorResponse) => {
          this.spinner.hide();
        }
      );
    }
  }
  paginationChangePV(event: any) {
    console.log(event);
    console.log(this.selectPages);
    // this.getdataPV();
    this.searchData();
  }
  getdataPV() {
    // (this.assetsave.get('listproduct') as FormArray).clear()
    let search: string = "";
    console.log(this.assetgroupform.value);
    if (
      this.assetgroupform.get("branch").value != "" &&
      this.assetgroupform.get("branch").value != null
    ) {
      console.log("hi");
      // this.searchdata.branch=this.assetgroupform.value.branch
      search = search + "&branch=" + this.branch_id;
    }
    if (
      this.assetgroupform.get("Asset_id").value != "" &&
      this.assetgroupform.get("Asset_id").value != null
    ) {
      console.log("hii");
      // this.searchdata.barcode=this.assetgroupform.value.barcode
      search = search + "&barcode=" + this.assetgroupform.get("Asset_id").value;
    }
    if (
      this.assetgroupform.get("asset_cat").value != null &&
      this.assetgroupform.get("asset_cat").value != ""
    ) {
      search = search + "&asset_cat=" + this.catId;
    }
    if (
      this.assetgroupform.get("product").value != null &&
      this.assetgroupform.get("product").value != ""
    ) {
      search = search + "&product=" + this.productId;
    }
    if (
      this.assetgroupform.get("invoicedate").value != null &&
      this.assetgroupform.get("invoicedate").value != ""
    ) {
      let datevalue = this.assetgroupform.get("invoicedate").value;
      search =
        search +
        "&asset_cap=" +
        this.datePipe.transform(datevalue, "yyyy-MM-dd");
    }
    if (
      this.assetgroupform.get("asset_cost").value != null &&
      this.assetgroupform.get("asset_cost").value != ""
    ) {
      search =
        search + "&asset_cost=" + this.assetgroupform.get("asset_cost").value;
    }
    if (
      this.assetgroupform.get("crno").value != null &&
      this.assetgroupform.get("crno").value != ""
    ) {
      search = search + "&crno=" + this.assetgroupform.get("crno").value;
    }
    this.spinner.show();
    console.log(search);
    this.Faservice.getassetdata2_checkerPV(
      this.presentpagebukPV,
      this.selectPages,
      search
    ).subscribe(
      (data) => {
        this.spinner.hide();
        if (data.code != undefined && data.code != "" && data.code != null) {
          this.toastr.warning(data.description);
        } else {
          // if(data['data']['desp_startswith']==false){
          //   delete data['data']['description']
          // }
          this.listcomments = data[0]["data"];
          this.serial_counts = data[0]["count"];
          if (data[0]["data"]?.length == 0) {
            this.toastr.warning("Matching data Not Found");
          }
          for (let i = 0; i < this.listcomments?.length; i++) {
            this.listcomments[i]["is_Checked"] = false;
          }
          this.datapagination = data[0]["pagination"];
          if (this.listcomments?.length >= 0) {
            this.has_nextbukPV = this.datapagination.has_next;
            this.has_previousbukPV = this.datapagination.has_previous;
            this.presentpagebukPV = this.datapagination.index;
          }
          console.log(this.listcomments?.length);
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.warning(error.status + error.statusText);
        this.listcomments = [];
      }
    );
  }
  previousClickPV() {
    if (this.has_previousbukPV === true) {
      this.presentpagebukPV = this.presentpagebukPV - 1;
      this.getdataPV();
    }
  }
  nextClickPV() {
    if (this.has_nextbukPV === true) {
      this.presentpagebukPV = this.presentpagebukPV + 1;
      this.getdataPV();
    }
  }
  selectall_chbxs: boolean = false;

  // oncheckboxselectAlls() {
  //   for (let i = 0; i < this.listcomments?.length; i++) {
  //     this.listcomments[i].enbs = this.selectall_chbxs;
  //   }
  // }
  //   onCheckboxChanges(event, value, index) {
  //    const allChecked = this.listcomments.every(item => item.enbs);
  //    this.selectall_chbxs = allChecked;
  //   if (event.currentTarget.checked) {
  //     this.listcomments[index]['enbs']=true;
  //   }
  //   else{
  //     this.listcomments[index]['enbs']=false;
  //   }

  // }
  // holds selected row IDs (or indexes)
  selectedItems: Set<number> = new Set();
  selectAllChecked = false;

  onCheckboxChanges(event: any, value: any, id: number) {
    if (event.checked) {
      this.selectedItems.add(value.id);
    } else {
      this.selectedItems.delete(value.id);
    }

    // update select-all checkbox
    this.selectAllChecked =
      this.selectedItems.size === this.listcomments?.length;
  }

  oncheckboxselectAlls(event: any) {
    this.selectAllChecked = !this.selectAllChecked;

    if (this.selectAllChecked) {
      this.listcomments.forEach((item) => {
        this.selectedItems.add(item.id);
      });
      // select all IDs
      // this.selectedItems = new Set(this.listcomments.map((_, i) => i));
    } else {
      // clear all
      this.selectedItems.clear();
    }
  }
  markedYes() {
    let data: any = {};
    let datalist: any[] = [];
    const today = new Date().toISOString().split("T")[0];

    this.listcomments.forEach((e) => {
      if (this.selectedItems.has(e.id)) {
        datalist.push({
          barcode: e.barcode,
          id: e.id,
          pv_done: "YES",
          checker_date: today,
          completed_date: today
        });
      }
    });

    if (datalist.length == 0) {
      this.toastr.warning("Please Select The Data");
      return false;
    } else {
      data["asset_pv"] = datalist;
      this.spinner.show();
      this.Faservice.pvserialMarkYesNo(data).subscribe(
        (result: any) => {
          this.spinner.hide();
          if (
            result.code != undefined &&
            result.code != "" &&
            result.code != null
          ) {
            this.toastr.warning(result.description);
          } else {
            this.toastr.success(result.message);
            this.getdataPV();
            this.selectAllChecked = false;
            this.selectedItems.clear();
          }
        },
        (error: HttpErrorResponse) => {
          this.spinner.hide();
        }
      );
    }
  }
  markedNO() {
     let data: any = {};
    let datalist: any[] = [];
    const today = new Date().toISOString().split("T")[0];

    this.listcomments.forEach((e) => {
      if (this.selectedItems.has(e.id)) {
        datalist.push({
          barcode: e.barcode,
          id: e.id,
          pv_done: "NO",
          checker_date: today,
          completed_date: today
        });
      }
    });

    if (datalist.length == 0) {
      this.toastr.warning("Please Select The Data");
      return false;
    } else {
        data["asset_pv"] = datalist;
      this.spinner.show();
      this.Faservice.pvserialMarkYesNo(data).subscribe(
        (result: any) => {
          this.spinner.hide();
          if (
            result.code != undefined &&
            result.code != "" &&
            result.code != null
          ) {
            this.toastr.warning(result.description);
          } else {
            this.toastr.success(result.message);
            this.getdataPV();
            this.selectAllChecked = false;
            this.selectedItems.clear();
          }
        },
        (error: HttpErrorResponse) => {
          this.spinner.hide();
        }
      );
    }
  }
document_list:any;
    documents(data){
    console.log("jbdfghrrbf,krrjtoiltjholfykjgpk;uuulkhu",data)
  this.document_list=data
  }

  downloadfiledocument(data) {
  let vals = data?.id;
  let fileType = data?.gen_file_name;
  this.Faservice.pv_file_download(vals).subscribe(results => {
    let binaryData = [];
    binaryData.push(results);
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));

    let link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileType; 
    link.click();
  }, (error) => {
    this.spinner.hide();
    this.toastr.warning(error.status + " " + error.statusText);
  });
}

 branch_code_list: any;
 @ViewChild("branchInput") branchInput: any;
@ViewChild("is_branch") is_branch: MatAutocomplete;
public display_branch(branch ? : BRANCH): string | undefined {
    return branch ? branch.code +'-'+ branch.name : undefined;
  }

getbranchcode(){
//  this.spinner.show();
    this.Faservice
      .get_is_branch(this.branchInput.nativeElement.value, 1)
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((results) => {
        // this.spinner.hide();
        let datas = results["data"];
        this.branch_code_list = datas;
        console.log("getbranchcode", this.branch_code_list)
      });
}
autocompletebranchcodeScroll(){
    this.is_branch_has_next = true;
    this.is_branch_has_previous = true;
    this.is_branch_currentpage = 1;
    setTimeout(() => {
      if (this.is_branch && this.autocompleteTrigger && this.is_branch.panel) {
        fromEvent(this.is_branch.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.is_branch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.is_branch.panel.nativeElement.scrollTop;
            const scrollHeight = this.is_branch.panel.nativeElement.scrollHeight;
            const elementHeight = this.is_branch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.is_branch_has_next === true) {
                this.Faservice
                  .get_is_branch(
                    this.branchInput.nativeElement.value,
                    this.is_branch_currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branch_code_list = this.branch_code_list.concat(datas);
                    if (this.branch_code_list.length >= 0) {
                      this.is_branch_has_next = datapagination.has_next;
                      this.is_branch_has_previous = datapagination.has_previous;
                      this.is_branch_currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  searchData(){
    let payload = this.assetgroupform.value;
    let search: string = "";
    if (payload.Asset_id) {
      search = search + "&barcode=" + payload.Asset_id;
    }
    if (payload.asset_cost) {
      search = search + "&asset_cost=" + payload.asset_cost;
    }
    if (payload.crno) {
      search = search + "&crno=" + payload.crno;
    } 
    if (payload.asset_cat) {
      search = search + "&asset_cat=" + this.catId;
    }
    if (payload.product) {
      search = search + "&product=" + payload.product.id;
    }
    if(payload.branch_admin){
      search= search + "&branch="+payload.branch_admin.id
    } 

    if(this.selectPages){
      search = search + "&pageSize=" + this.selectPages;
    }
    this.spinner.show();
      this.Faservice.getapproverPV(this.pageNumber, search).subscribe(
      (data) => {
        console.log("santhosh1", data);
        this.spinner.hide()
        if (data[0].description == "Invalid Branch Id") {
          this.toastr.error("No Branch ID Assigned");
          this.flagSearch = false;
          this.doBranch = false;
          this.flagSearchVar = "NO";
          console.log("search_value", this.flagSearch);
          if (data[0].role == 1) {
            this.role_download = false;
          } else {
            this.role_download = true;
          }
        } else if (data[0].error == "INVALID_BRANCH_DO") {
          this.flagSearch = true;
          this.doBranch = true;
          this.goBack_new = true;
          this.searchFlag = true;
          this.listcomments = data[0]["data"];
          this.serial_counts = data[0]["count"];
          if (data[0].role == 1) {
            this.role_download = false;
          } else {
            this.role_download = true;
          }
          this.datapagination = data[0]["pagination"];
          if (this.listcomments?.length >= 0) {
            this.has_nextbuk = this.datapagination.has_next;
            this.has_previousbuk = this.datapagination.has_previous;
            this.presentpagebuk = this.datapagination.index;
          }
          if (this.listcomments?.length <= 0) {
            // this.toastr.warning("No Maker Done For The Branch ID");
          }
        } else {
          console.log(data);
          this.flagSearchVar = "YES";
          this.doBranch = true;
          this.goBack_new = false;
          this.searchFlag = false;
          this.listcomments = data[0]["data"];
          this.serial_counts = data[0]["count"];
          if (this.listcomments?.length === 0) {
            // this.toastr.warning("No Maker Done For The Branch ID");
          }
          this.datapagination = data[0]["pagination"];
          console.log("d-", data[0]["data"]);
          console.log("page", this.datapagination);
          if (this.listcomments?.length >= 0) {
            this.has_nextbukPV = this.datapagination.has_next;
            this.has_previousbukPV = this.datapagination.has_previous;
            this.presentpagebukPV = this.datapagination.index;
          }
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.warning(error.status + error.statusText);
      }
    );
  }
  resetPV(){
    this.assetgroupform.reset('');
    this.searchData();
  }

public display_prod(key?: products):string | undefined{
  return key?key.name:undefined

  } 
  productlist:Array<any>
  get_productdatas(){
    this.Faservice.get_productListdatas('',1).subscribe(res=>{
      this.productlist=res['data']
    })
  }

}
