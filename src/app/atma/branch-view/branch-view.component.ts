import { Component, OnInit, ViewChild,ChangeDetectorRef  } from "@angular/core";
import { ShareService } from "../share.service";
import { AtmaService } from "../atma.service";
import { NotificationService } from "../notification.service";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { color } from "html2canvas/dist/types/css/types/color";
import { environment } from "src/environments/environment";
import * as $ from "jquery";
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { ErrorHandlingServiceService } from "src/app/service/error-handling-service.service";

interface ProductConfiguration {
  specification: string;
  configuration: string;
  id?: number;  // id is optional
}

interface Product {
  product_name: any;
  productname: any;
  makename: any;
  modelname: any;
  specificationname: any;
  specification: any;
  UOM: any;
  categoryname: any;
  subcategoryname: any;
  make: any;
  model: any;
  category: any;
  subcategory: any;
  catelogspecification: any;
  size: any;
  remarks: any;
  uom: any;
  unitprice: any;
  from_date: any;
  to_date: any;
  packing_price: any;
  delivery_date: any;
  capacity: any;
  direct_to: any;
  id?: number;  // id is optional
  configuration: ProductConfiguration[];
}
@Component({
  selector: "app-branch-view",
  templateUrl: "./branch-view.component.html",
  styleUrls: ["./branch-view.component.scss"],
})

export class BranchViewComponent implements OnInit {
  // tabList: string[] = ['ACTIVITY','BRANCH TAX DETAILS','BRANCH PAYMENT DETAILS'];
  rename: any
  url: any = environment.apiURL;
  statusTab: any;
  activitySummary = true;
  myControl = new FormControl("ACTIVITY");
  options: string[] = ["ACTIVITY", "BRANCH PAYMENT DETAILS","CATALOG"];
  filteredOptions: Observable<string[]>;
  @ViewChild("closeaddpopup") closeaddpopup;
  @ViewChild('closebutton') closebutton;
  @ViewChild('previewclosebutton') previewclosebutton;
  vendorId: number;
  Fileidd: number;
  branchViewId: number;
  panNumber: string;
  creditTerms: string;
  gstNumber: string;
  limitDays: number;
  products: [];
  has_next_tax = false;
  has_previous_tax = false;
  Branchtaxadd = false;
  branchcode = "";
  name: string;
  remarks: string;
  contactName: string;
  contactDesignation: string;
  contactDOB: string;
  contactEmail: string;
  // contactType: string;
  contactLine1: string;
  contactLine2: string;
  contacMobile1: string;
  contacMobile2: string;
  contactWeddingDate: string;
  addressCity: string;
  addressDistrict: string;
  addressState: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  ispayment = false;
  istax = false;
  taxedit = false;
  addressPincode: string;
  isActivity = true;
  isActivityForm: boolean;
  isActivityEditForm: boolean;
  activityList: any;
  has_next = true;
  has_previous = true;
  paymenteditform = false;
  currentpage: number = 1;
  presentpage: number = 1;
  has_next_payment = false;
  has_previous_payment = false;
  currentpage_payment: number = 1;
  presentpage_payment: number = 1;
  pageSize = 10;
  branchtax = false;

  branchID: any;
  mainbid = 0;
  paymentaddform = false;
  vendorDetail: any;
  isActivityPagination: boolean;
  // getBranchList=[];
  getBranchList: any;
  displayedColumns: any;
  modificationdata: any;
  payment_data = [];
  payment_modify = false;
  requestStatusName: string;
  vendorStatusName: string;
  mainStatusName: string;
  isPaymentPagination: boolean;
  vendor_flag = false;

  modificationactivitydata: any;
  activity_data = [];
  activity_modify = false;

  tax_modify = false;
  tax_data = [];
  modificationtaxdata: any;
  branchtax_RMView = false;
  payment_RMView = false;
  docbtn: boolean;
  hide: false;
  viewdata: any;
  new_datass: { new_data: any };
  branchactivityedit: boolean = false;
  isCatalog:boolean=false
  atmaUrl = environment.apiURL
  catalogAddForm:FormGroup
  catalogpopupformgrp:FormGroup;
  radiocheck: any[] = [
    { value: 1, display: 'Normal Create Catalog' },
    { value: 0, display: 'Bulk Create Catalog' }
  ]
  catalogsearchdrop:any ={label:"Catalog Search"};
  productfield: any ={ label: "Product Name" };
  product_code: any;
  product_id: any;
  makefield: any = { label: "Make" }
  modelfield: any = { label: "Model" }
  Modenames: any;
  Modenames_code: any;
  Modenames_id: any;
  product_set_field_disable: boolean = false;
  value: number = 1;
  bulk_catalog_modify: boolean;
  error_file_id: any;
  preview_data: any;
  show_error_download: boolean = false;
  show_success_preview: boolean = false;
  modification_bulk_catalog_data: any[];
  array_branchId: any;
  bulk_upload: boolean = true;
  bulk_edit: boolean = false;
  Bulk_Sub_Menu_List =[ { value: 1, name: 'Bulk Upload Success' }, { value: 2, name: 'Bulk Upload Failed' }];
  success_bulk_data: any[];
  error_bulk_data: any[];
  success_table: boolean = false;
  error_table: boolean = false;
  constructor(
    private shareService: ShareService,
    private SpinnerService: NgxSpinnerService,
    private notification: NotificationService,
    private router: Router,
    private atamaService: AtmaService,
    private fb:FormBuilder,
    private errorHandler: ErrorHandlingServiceService,
    private cdr: ChangeDetectorRef
  ) {
    this.catalogsearchdrop={
      "label":"Catalog Search",
      method: "get",
      url: this.atmaUrl + "mstserv/categoryname_search",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled : false
    }
    this.productfield = {
      label: "Product Name",
      method: "get",
      url: this.atmaUrl + "mstserv/product_search",
      params: "",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      // required: true,
      disabled : false
    };

    this.makefield = {
      label:"Make",
      "method": "get",
      "url": this.atmaUrl + "mstserv/product_model_search",
      params: "&m_type=" + "make" ,
      searchkey: "query",
      displaykey: "name",
      disabled : false

    }

    this.modelfield = {
      label: "Model",
      "method": "get",
      "url": this.atmaUrl + "mstserv/product_model_search",
      params: "&m_type=" + "model",
      searchkey: "query",
      "displaykey": "name",
      disabled : false
    }
  }

  ngOnInit(): void {
    let data = this.shareService.vendorDATA.value;
    this.vendorDetail = data;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
    this.getBranchView();
    this.getVendorViewDetails();
    // this.getActivity();
    this.activitysummary();
    this.getmodification_vender();
    this.catalogAddForm = this.fb.group({
      cat_name:[''],
      product_name: [''],
      product_id:[''],
      Modename: [''],
      Modalname: [''],
      make:[''],model:['']
    })
    this.catalogpopupformgrp = this.fb.group({
      radio_btn_status:[1]
    })

    // this.selectedTab = this.Bulk_Sub_Menu_List[0];
    // this.initializeDefaultTab();
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.getVendorViewDetails();
  //   }, 2000);
  // }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  tabchange(event) {
    console.log("tab", event);
    if (event.isUserInput == true) {
      this.statusTab = event.source.value;
      if (this.statusTab === "ACTIVITY") {
        this.isCatalog=false
        this.activitySummary = true;
        this.isActivity = true;
        this.isActivityForm = false;
        this.istax = false;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.ispayment = false;
        this.paymentaddform = false;
        this.paymenteditform = false;
        // this.getActivity();
        this.activitysummary();
        return false;
      } else if (this.statusTab === "BRANCH TAX DETAILS") {
        this.isCatalog=false
        this.istax = true;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.getpagenation();
        this.activitySummary = false;
        this.isActivity = false;
        this.ispayment = false;
        this.paymentaddform = false;
        this.paymenteditform = false;
        return false;
      } else if (this.statusTab === "BRANCH PAYMENT DETAILS") {
        this.isCatalog=false
        this.activitySummary = false;
        this.isActivity = false;
        this.istax = false;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.ispayment = true;
        this.paymentaddform = false;
        this.paymenteditform = false;
        // this.getpaymentsummary();
        this.paymentsummary();

        return false;
      }
      else if (this.statusTab === "CATALOG") {
        this.isCatalog=true
        // this.catalogpopup();
        this.activitySummary = false;
        this.isActivity = false;
        this.istax = false;
        this.Branchtaxadd = false;
        this.taxedit = false;
        this.ispayment = false;
        this.paymentaddform = false;
        this.paymenteditform = false;
        // this.getpaymentsummary();
        this.catlogsummary();

        return false;
      }
    }
  }
  paymentaddcancel() {
    this.ispayment = true;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.payment_RMView = false;
    this.istax = false;
    // this.getpaymentsummary();
    this.paymentsummary();
    this.closedpopup();
  }
  paymentaddsumbmit() {
    this.ispayment = true;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = false;
    // this.getpaymentsummary();
    this.paymentsummary();
    this.closedpopup();
  }
  taxeditsubt() {
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;
    this.ispayment = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = true;
    this.getpagenation();
  }
  taxeditcancel() {
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;
    this.ispayment = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = true;
    this.getpagenation();
  }
  taxadd() {
    this.Branchtaxadd = true;
    this.isActivity = false;
    this.ispayment = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = false;
    this.shareService.branchTaxtEdit.next(" ");
  }
  branchayment() {
    this.isActivity = false;
    this.ispayment = true;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = false;

    // this.getpaymentsummary();
    this.paymentsummary();

    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivityEditForm = false;
  }
  branchpayadd() {
    this.ispayment = false;
    this.paymentaddform = true;
    this.paymenteditform = false;
    this.popupopen()
    this.rename = "Branch Payment Creation Form"
  }
  branchtaxaddsbt() {
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;
    this.ispayment = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = true;
    this.shareService.vendorDATA.next(this.vendorDetail);
    this.getpagenation();
  }
  branchtaxaddcancl() {
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivity = false;
    this.ispayment = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = true;
    this.branchtax_RMView = false;
    this.getpagenation();
  }
  RMView_branchpayment(data) {
    this.viewdata = data;
    let new_datas = {
      new_data: this.viewdata,
    };
    console.log("payment", new_datas);
    this.ispayment = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.payment_RMView = true;
    this.shareService.modification_data.next(new_datas);
    this.popupopen();
    this.rename = "Branch Payment Changes View"
  }
  RMView_branchtax(data) {
    console.log("tax", data);
    this.istax = false;
    this.Branchtaxadd = false;
    this.taxedit = false;
    this.branchtax_RMView = true;
    this.shareService.modification_data.next(data);
  }

  paymentcancel() {
    this.ispayment = true;
    this.paymentaddform = false;
    this.paymenteditform = false;
    // this.getpaymentsummary();
    this.paymentsummary();
    this.closedpopup();
  }
  paymentsumbmit() {
    this.ispayment = true;
    this.paymentaddform = false;
    this.paymenteditform = false;
    // this.getpaymentsummary();
    this.paymentsummary();
    this.closedpopup();
  }
  // tax  start
  getpaymentsummary(pageNumber = 1, pageSize = 10) {
    this.atamaService
      .getpaymentsummary(pageNumber, pageSize, this.branchViewId)
      .subscribe((result) => {
        console.log("pay", result);
        let datass = result["data"];
        let datapagination = result["pagination"];
        this.getBranchList = datass;
        console.log("pay", this.getBranchList);

        if (this.getBranchList.length > 0) {
          this.has_next_payment = datapagination.has_next;
          this.has_previous_payment = datapagination.has_previous;
          this.presentpage_payment = datapagination.index;
          this.isPaymentPagination = true;
        }
        if (this.getBranchList <= 0) {
          this.isPaymentPagination = false;
        }
        if (this.has_next_payment == true) {
          this.has_next_payment = true;
        }
        if (this.has_previous_payment == true) {
          this.has_previous_payment = true;
        }
      });
    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.payment_modify = true;
    }
  }

  getbtn_status(array) {
    for (let i = 0; i < array.length; i++) {
      // this.contract_data[i]["remove_actions"]=false;
      if (array.length != i) {
        if (array[i].modify_status == 2) {
          for (let j = 1; j < array.length; j++) {
            if (array[i].id == array[j].modify_ref_id) {
              array[j]["modify_ref_id"] = true;
            }
          }
        }
      }
    }
    return array;
  }

  deletebranchpay(data) {
    // this.docbtn=true;

    let paymentid = data.id;
    console.log("deletebranchpay", paymentid);
    if (confirm("Delete Payment details?")) {
      this.atamaService
        .deletebranchform(paymentid, this.branchViewId)
        .subscribe((result) => {
          this.notification.showSuccess(" deleted....");
          this.getpaymentsummary();
          return true;
        });
    } else {
      return false;
    }
  }
  nextClickbranch() {
    if (this.has_next_payment === true) {
      this.getpaymentsummary(this.presentpage_payment + 1, 10);
    }
  }

  previousClickbranch() {
    if (this.has_previous_payment === true) {
      this.getpaymentsummary(this.presentpage_payment - 1, 10);
    }
  }

  editbranch(e) {
    this.ispayment = false;
    this.paymentaddform = false;
    this.paymenteditform = true;
    this.shareService.paymenteditid.next(e);
    this.popupopen();
    this.rename = "Branch Payment Edit"
    // this.router.navigate(['/PaymenteditComponent'], { skipLocationChange: true })
  }
  // tax end

  getBranchView() {
    let data: any = this.shareService.branchView.value;
    this.branchID = data;
    this.branchViewId = data.id;
    this.vendorId = data.vendor_id;

    this.atamaService
      .branchViewDetails(this.vendorId, this.branchViewId)
      .subscribe((data) => {
        this.name = data.name;
        this.branchcode = data.code;
        this.panNumber = data.panno;
        this.gstNumber = data.gstno;
        this.creditTerms = data.creditterms;
        this.limitDays = data.limitdays;
        this.remarks = data.remarks;
        let address = data.address_id;
        this.addressCity = address.city_id.name;
        this.addressDistrict = address.district_id.name;
        this.addressState = address.state_id.name;
        this.addressPincode = address.pincode_id.no;
        this.addressLine1 = address.line1;
        this.addressLine2 = address.line2;
        this.addressLine3 = address.line3;
        let contact = data.contact_id;
        this.contactName = contact.name;
        this.contactEmail = contact.email;
        this.contactDOB = contact.dob;
        this.contactWeddingDate = contact.wedding_date;
        this.contactLine1 = contact.landline;
        this.contactLine2 = contact.landline2;
        this.contacMobile1 = contact.mobile;
        this.contacMobile2 = contact.mobile2;
        this.contactDesignation = contact.designation_id.name;
        // this.contactType = contact.type_id.name;
        console.log("BRANCHVIEWDETAILS", data);
      });
  }
  getActivity(pageNumber = 1, pageSize = 10) {
    this.atamaService
      .getActivityList(this.branchViewId, pageNumber, pageSize)
      .subscribe((result) => {
        console.log("activity", result);
        let datas = result["data"];
        this.activityList = datas;
        this.shareService.activtycounts.next(this.activityList.length); //9259
        let datapagination = result["pagination"];
        this.activityList = datas;
        if (this.activityList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isActivityPagination = true;
        }
        if (this.activityList <= 0) {
          this.isActivityPagination = false;
        }
      });

    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.activity_modify = true;
    }
  }
  nextClickActivity() {
    if (this.has_next === true) {
      this.getActivity(this.presentpage + 1, 10);
    }
  }

  previousClickActivity() {
    if (this.has_previous === true) {
      this.getActivity(this.presentpage - 1, 10);
    }
  }
  activityBtn() {
    this.isActivity = true;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.ispayment = false;
    this.branchtax = false;
    this.istax = false;
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.isActivityEditForm = false;
    this.branchtax = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.istax = false;
    this.taxedit = false;
  }
  addActivity() {
    this.isActivity = false;
    this.isActivityForm = true;
    this.shareService.branchID.next(this.branchID);
    this.shareService.vendorDATA.next(this.vendorDetail);
    this.popupopen()
    this.rename = "Activity/Product  Creation Form"
  }
  activityEditForm(data) {
    this.isActivity = false;
    this.isActivityEditForm = true;
    this.shareService.activityEditForm.next(data);
    this.shareService.branchID.next(this.branchID);
  }
  activityCancel() {
    this.isActivityForm = false;
    this.isActivity = true;
    this.activitysummary();
    this.closedpopup();
  }
  activitySubmit() {
    // this.getActivity()
    this.activitysummary();
    this.isActivityForm = false;
    this.isActivity = true;
    this.closedpopup();
  }
  activityView(data) {
    this.shareService.activityView.next(data);
    this.router.navigate(["/atma/activityView"], { skipLocationChange: true });
  }

  taxsummary() {
    this.istax = true;
    this.getpagenation();
    this.isActivity = false;
    this.isActivityForm = false;
    this.isActivityEditForm = false;
    this.ispayment = false;
    this.branchtax = false;
    this.taxedit = false;
    this.Branchtaxadd = false;
    this.paymentaddform = false;
    this.paymenteditform = false;
    this.taxedit = false;
  }
  //tax section

  getpagenation(pageNumber = 1, pageSize = 10) {
    this.atamaService
      .Taxsummary(pageNumber, pageSize, this.vendorDetail.id)
      .subscribe((results: any[]) => {
        console.log("filterdata", results);
        let datapagination = results["pagination"];
        this.products = results["data"];
        if (this.products.length >= 0) {
          this.has_next_tax = datapagination.has_next;
          this.has_previous_tax = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
        if (this.has_next_tax == true) {
          this.has_next_tax = true;
        }
        if (this.has_previous_tax == true) {
          this.has_previous_tax = true;
        }
      });
    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.tax_modify = true;
    }
  }
  previousClick() {
    if (this.has_previous_tax === true) {
      // *(this.pageSize);
      this.getpagenation(this.presentpage - 1, 10);
    }
  }
  nextClick() {
    if (this.has_next_tax === true) {
      // *(this.pageSize);
      this.getpagenation(this.presentpage + 1, 10);
    }
  }
  // delete_tax
  delete_tax(id) {
    if (confirm("Delete Tax details?")) {
      this.atamaService
        .Brachtaxdelete(id, this.branchViewId)
        .subscribe((result) => {
          if (result.message == "Successfully Deleted") {
            this.notification.showSuccess("Deleted");
            // this.ngOnInit();
            this.getpagenation();
          } else {
            this.notification.showInfo("Try  Again....");
            this.ngOnInit();
          }
          // this.ngOnInit();
          return true;
        });
    } else {
      return false;
    }
  }
  Taxedit(e) {
    this.shareService.branchTaxtEdit.next(e);
    this.taxedit = true;
    this.istax = false;

    // this.router.navigate(['/branchTaxEdit'], { skipLocationChange: true })
  }

  activeto_inactive(data) {
    this.SpinnerService.show();
    if (data.paymode_id.name == "DD") {
      data["paymode_id"] = data.paymode_id.id;
      data["bank_id"] = 0;
      data["branch_id"] = 0;
    } else {
      data["paymode_id"] = data.paymode_id.id;
      data["bank_id"] = data.bank_id.id;
      data["branch_id"] = data.branch_id.id;
    }
    if (data.is_active) {
      data["is_active"] = 0;
    } else {
      data["is_active"] = 1;
    }
    this.atamaService.paymentactive(data).subscribe((result) => {
      if (result.id > 0 || result.id != undefined) {
        this.notification.showSuccess("Success");
        this.paymentsummary();
        this.SpinnerService.hide();
        return false;
      } else {
        this.notification.showError("failes");
        this.SpinnerService.hide();
        return false;
      }
    });
    this.SpinnerService.hide();
  }

  getVendorViewDetails() {
    this.atamaService
      .getVendorViewDetails(this.vendorId)
      .subscribe((result) => {
        this.requestStatusName = result.requeststatus_name;
        this.vendorStatusName = result.vendor_status_name;
        this.mainStatusName = result.mainstatus_name;
        if (
          this.requestStatusName == "Modification" &&
          this.vendorStatusName == "Draft"
        ) {
          this.vendor_flag = true;
        }
        if (
          this.mainStatusName == "Draft" &&
          this.requestStatusName == "Onboard" &&
          this.vendorStatusName == "Draft"
        ) {
          this.vendor_flag = true;
        }
        if (
          this.mainStatusName == "Draft" &&
          this.requestStatusName == "Onboard" &&
          this.vendorStatusName == "Rejected"
        ) {
          this.vendor_flag = true;
        }
        if (
          this.mainStatusName == "Approved" &&
          this.requestStatusName == "Modification" &&
          this.vendorStatusName == "Draft"
        ) {
          this.vendor_flag = true;
          this.activity_modify = true;
          this.catalog_modify = true;
        }
        if (
          this.mainStatusName == "Approved" &&
          this.requestStatusName == "Modification" &&
          this.vendorStatusName == "Rejected"
        ) {
          this.vendor_flag = true;
        }
      });
  }

  //Modification data for a particular vendor
  getmodification_vender(){
    this.activity_data=[];
    this.tax_data=[];
    this.payment_data=[];
    this.catalog_data=[];

    this.atamaService.getmodification(this.vendorId)
        .subscribe(result => {
          this.modificationdata = result['data']
          // console.log("modifysummary",this.modificationdata)
          this.modificationdata.forEach(element => {
            if(element.action==2)//edit
            {
            if(element.type_name==13 && element.new_data.branch==this.branchViewId){
              this.activity_data.push(element.new_data) 
              this.modifyactivitysummary()
            }
            if(element.type_name==11 && element.new_data.branch_id.id==this.branchViewId ){
              this.tax_data.push(element.new_data )
            }
            if(element.type_name==12 && element.new_data.supplierbranch_id.id==this.branchViewId){
              this.payment_data.push(element.new_data)
              this.modifypaymentsummary()
            }
            if (element.type_name== 15 && element.new_data.branch_id==this.branchViewId ) {
              this.catalog_data.push(element.new_data)
              this.modifysummary()
            }
          }
          if(element.action==1)//create
          {
            if(element.type_name==13 && element.data.branch==this.branchViewId){
              this.activity_data.push(element.data)
              this.modifyactivitysummary();
            }
              if(element.type_name==11 && element.data.branch_id.id===this.branchViewId){
                console.log(element.data.branch_id.id)
                this.tax_data.push(element.data)
              }
              if(element.type_name==12 && element.data.supplierbranch_id.id===this.branchViewId){
                console.log("payment create",element.data.branch_id.id)
                this.payment_data.push(element.data)
                this.modifypaymentsummary();
            }
            
              if(element.type_name==15 && element.data.branch_id===this.branchViewId ){
                console.log("catalog create",element.new_data)
                this.catalog_data.push(element.data)
                this.modifysummary()
              }
            
          }
          if(element.action==0)//delete
          {
            if(element.type_name==13 && element.data.branch==this.branchViewId){
              this.activity_data.push(element.data)
              this.modifyactivitysummary();
            }
              if(element.type_name==11  && element.data.branch_id.id==this.branchViewId){
                this.tax_data.push(element.data)
              }
              if(element.type_name==12 && element.data.supplierbranch_id.id==this.branchViewId){
                this.payment_data.push(element.data)
                this.modifypaymentsummary();
            }
            if(element.type_name==15 && element.data.branch_id==this.branchViewId){
              console.log("catalog create",element.new_data)
              this.catalog_data.push(element.data)
              this.modifysummary()
            }
          }
          if(element.action==3){
            if(element.type_name==12 && element.new_data.supplierbranch_id.id==this.branchViewId){
              this.payment_data.push(element.new_data)
              this.modifypaymentsummary();
            }
          }
          });
  
          if( this.requestStatusName=="Modification" && this.vendorStatusName=='Draft'){
            if(this.activity_data.length>0)
            {
              this.activity_data= this.getbtn_status(this.activity_data)
            this.modifyactivitysummary();
          }
            if(this.tax_data.length>0)
              {
                this.tax_data= this.getbtn_status(this.tax_data)}
            if(this.payment_data.length>0)
                {
                  this.payment_data= this.getbtn_status(this.payment_data)}   
                  if (this.catalog_data.length > 0) {
                    this.catalog_data = this.getbtn_status(this.catalog_data)
                    this.modifysummary()
                  }    
          }
              
  
     
        })
  
      console.log('cv',this.tax_data)
  }
  downattach(datas) {
    for (var i = 0; i < datas.attachment.length; i++) {
      this.Fileidd = datas.attachment[i].id;

      this.atamaService.downloadfile(this.Fileidd);
    }
  }

  activityUpdate(data) {
    this.shareService.activityEditForm.next(data);
    this.shareService.vendorID.next(this.vendorId);

    // this.router.navigate(["/atma/branchActivityEdit"], {
    //   skipLocationChange: true,
    // });
    this.branchactivityedit = true;
    this.popupopen();
    this.rename = "Activity/Product Edit Form"
  }
  branchpaymentedit() {
    this.branchactivityedit = false;
    this.activitysummary();
    this.closedpopup();
  }
  branchpaymenteditcancel() {
    this.branchactivityedit = false;
    this.activitysummary();
    this.closedpopup();
  }

  SummaryactivityData: any = [
    {
      columnname: "Department",
      key: "service_branch",
      type: "object",
      objkey: "name",
      // style: { color: "blue", cursor: "pointer" },
      function: false,
      clickfunction: this.activityView.bind(this),
    },

    { columnname: "Activity Type", key: "type" },

    { columnname: "Description", key: "description" },

    { columnname: "Activity Status", key: "activity_status" },

    { columnname: "Header Name", key: "rm" },

    {
      columnname: "Action",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      style: { cursor: "pointer" },
      validatefunction: this.activityeditfn.bind(this),
      clickfunction: this.activityUpdate.bind(this),
    },
    {
      columnname: "Delete",
      key: "delete",
      button: true,
      function: true,
      validate: true,
      style: { cursor: "pointer" },
      validatefunction: this.activitydeletefn.bind(this),
      clickfunction: this.activityDelete.bind(this),
    },
  ];
  SummarypaymentData: any = [
    {
      columnname: "Supplier Branch",
      key: "supplierbranch_id",
      type: "object",
      objkey: "name",
    },

    {
      columnname: "Paymode",
      key: "paymode_id",
      type: "object",
      objkey: "name",
    },

    { columnname: "Bank", key: "bank_id", type: "object", objkey: "name" },

    { columnname: "Account Number", key: "account_no" },

    { columnname: "Beneficiary Name", key: "beneficiary" },

    { columnname: "Status", key: "status", validate: true,
      validatefunction: this.paymentstatusfn.bind(this), },

    {
      columnname: "View",
      icon: "visibility",
      button: true,
      function: true,
      clickfunction: this.RMView_branchpayment.bind(this),
    },

    {
      columnname: "Edit",
      key: "remarks",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.paymenteditfn.bind(this),
      clickfunction: this.editbranch.bind(this),
    },

    {
      columnname: "Action",
      key: "remark",
      button: true,
      function: true,
      validate: true,
      validatefunction: this.paymentactiveinactivefn.bind(this),
      clickfunction: this.activeto_inactive.bind(this),
    },
  ];

  SummaryactivitymodifyData: any = [{ "columnname": "Department", "key": "service_branch",
    "type":"object","objkey":"name",function:false,clickfunction:this.activityView.bind(this) ,  
    validate: true,
    validatefunction: this.modfiyactivityvalidate.bind(this), },
    
    { "columnname": "Activity Type", "key": "type" },
    
    { "columnname": "Description", "key": "description" },
    
    { "columnname": "Activity Status", "key": "activity_status" },
    
    { "columnname": "Header Name", "key": "rm"},
    
    {
      columnname: "Status",
      validate: true,
      validatefunction: this.activitymodifystatusfn.bind(this),
    },
    
    { "columnname": "Action", "key": "remarks" , button:true,function:true, validate: true, validatefunction: this.activitymodifyeditfn.bind(this),
    clickfunction:this.activityUpdate.bind(this)},
    { "columnname": "Delete", "key": "delete" , button:true,function:true, validate: true, validatefunction: this.activitymodifydeletefn.bind(this),
    clickfunction:this.activityDelete.bind(this)},
    
    ]
SummarypaymentmodifyData: any = [{ "columnname": "Supplier Branch", "key": "supplier" },

{ "columnname": "Paymode", "key": "paymode_id","type":"object","objkey":"name" },

{ "columnname": "Bank", "key": "bank_id","type":"object","objkey":"name" },

{ "columnname": "Account Number", "key": "account_no" },

{ "columnname": "Beneficiary Name", "key": "beneficiary" },

{
  columnname: "Status",
  validate: true,
  validatefunction: this.paymentmodifystatusfn.bind(this),
},
{ "columnname": "Edit", "key": "remarks" , button:true,function:true, validate: true, validatefunction: this.paymentmodfiyeditfn.bind(this),
clickfunction:this.editbranch.bind(this)},

{ "columnname": "Action", "key": "remark" , button:true,function:true, validate: true, validatefunction: this.paymentmodifyactiveinactivefn.bind(this),
clickfunction:this.activeto_inactive.bind(this)},

]
  activityeditfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (this.vendor_flag == true) {
      if (data.modify_ref_id > 0) {
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "edit",
          class: "",
          value: "",
          function: false,
        };
      } else if (data.modify_ref_id == "-1") {
        config = {
          disabled: false,
          style: { color: "green" },
          icon: "edit",
          class: "",
          value: "",
          function: true,
        };
      }
    } else if (this.vendor_flag == false) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  modfiyactivityvalidate(data){
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function:false
    };
    if(data.modify_status == 1){
       config={
        disabled: false,
        // style: {color:"blue",cursor:"pointer"},
        icon: '',
        class: '',
        value: data.service_branch.name,
        function:false
      }
    }
    else if(data.modify_status == 2 || data.modify_status == 0){
      if(data.service_branch.name){
        config={
          disabled: false,
          style: '',
          icon: '',
          class: '',
          value: data.service_branch.name,
          function:false
        }
      }
      else{
        config={
          disabled: false,
          style: '',
          icon: '',
          class: '',
          value: "DEPARTMENT-UNMAPPED",
          function:false
        }
      }
  
    }
    return config
  }
  activitymodifystatusfn(data) {
    let config: any = {
      value: "",
    };
    if (data.modify_status == 1) {
      config = {
        value: "Create",
      };
    } else if (data.modify_status == 2) {
      config = {
        value: "Update",
      };
    } else if (data.modify_status == 0) {
      config = {
        value: "Delete",
      };
    }

    return config;
  }
  activitymodifyeditfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if ((data.modify_ref_id != data.id && data.modify_status == 1) ||
        (data.modify_status == 2 && data.modify_ref_id == true)) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    } else if ((data.modify_ref_id == data.id && data.modify_status == 1) ||
               (data.modify_status == 2 && data.modify_ref_id != true)) {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "edit",
        class: "",
        value: "",
        function: true,
      };
    }
    return config;
  }
  paymentstatusfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if(data.is_active == true){
      config ={
        value: "Active",
      }
    }
    else if(data.is_active == false){
      config ={
        value: "Inactive",
      }
    }
    return config;
  }
  paymenteditfn(data) {
    let config: any = {
      disabled: false,
      style: "",
      icon: "",
      class: "",
      value: "",
      function: false,
    };
    if (this.vendor_flag == true) {
      if (data.modify_ref_id > 0) {
        config = {
          disabled: true,
          style: { color: "gray" },
          icon: "edit",
          class: "",
          value: "",
          function: false,
        };
      } else if (data.modify_ref_id == "-1") {
        config = {
          disabled: false,
          style: { color: "green" },
          icon: "edit",
          class: "",
          value: "",
          function: true,
        };
      }
    } else if (this.vendor_flag == false) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "edit",
        class: "",
        value: "",
        function: false,
      };
    }
    return config;
  }
  paymentmodifystatusfn(data){
    let config: any = {
      value: ''
    };
    if(data.modify_status==1){
      config={
        value: 'Create'
      }
    }
    else if(data.modify_status==2){
      config={
        value: 'Update'
      }
    }
    else if(data.modify_status==0){
      config={
        value: 'Delete'
      }
    }
    else if(this.vendor_flag==true){
      if(data.is_active==true){
        if(data.modify_status == 3){
          config={
            value: 'Active'
          }
        }
      }
      else if(data.is_active==false){
        if(data.modify_status == 3){
          config={
            value: 'Inactive'
          }
        }
      }
    }

    else if(this.vendor_flag==false){
       if(data.modify_status == 3){
        config={
          value: 'Active/Inactive'
        }
      }
    }
  
    return config
  }
  paymentmodfiyeditfn(data){
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function:false
    };
    if((data.modify_ref_id != data.id && data.modify_status == 1) ||
       (data.modify_status == 2 && data.modify_ref_id == true)){
  
      config={
        disabled: true,
        style: {color: 'gray'},
        icon: 'edit',
        class: '',
        value: '',
        function:false 
      }
    
    }
    else if((data.modify_ref_id == data.id && data.modify_status == 1) ||
            (data.modify_status == 2 && data.modify_ref_id != true)){
      config={
        disabled: false,
        style: {color:'green'},
        icon: 'edit',
        class: '',
        value: '',
        function:true
      }
    }
    return config
  }
  paymentactiveinactivefn(data){
    let config: any = {
      disabled: false,
      style: "",
      icon: "edit",
      class: "",
      value: "",
      function: false,
    };
    if(this.vendor_flag==true){
  
      if(data.modify_ref_id>0){
        if(data.is_active==true){
          config={
            // disabled:true,
            style: {  color: 'gray'},
            icon: 'wb_sunny',
            class: '',
            value: '',
            function:false
          }
        }
        else if(data.is_active==false){
          config={
            style: {color:'gray'},
            icon: 'wb_sunny',
            class: '',
            value: '',
            function:false
          }
        }
    
      }
     else if(data.modify_ref_id=='-1'){
        if(data.is_active==true){
          config={
            style: {color:'#007338'},
            icon: 'wb_sunny',
            class: '',
            value: '',
            function:true
          }
        }
        if(data.is_active==false){
          config={
            style: {color:'#f44336'},
            icon: 'wb_sunny',
            class: '',
            value: '',
            function:true
          }
        }
    
      }
  
     
    }
    else if(this.vendor_flag==false){
      if(data.is_active==true){
        config={
          style: {color:'gray'},
          icon: 'wb_sunny',
          class: '',
          value: '',
          function:false
        }
      }
      else if(data.is_active==false){
        config={
          style: {color:'gray'},
          icon: 'wb_sunny',
          class: '',
          value: '',
          function:false
        }
      }
    }
    return config
  }
  paymentmodifyactiveinactivefn(data){
    let config: any = {
      style: '',
      icon: '',
      class: '',
      value: '',
      function:false
    };
    if(data.modify_status != 0){
  
      if(data.is_active == true){
  
        config={
          style: {  color: '#007338'},
          icon: 'wb_sunny',
          class: '',
          value: '',
          function:true
        }
      }
     else if(data.is_active == false){
  
        config={
          style: {color:'#f44336'},
          icon: 'wb_sunny',
          class: '',
          value: '',
          function:true
        }
      }
   
     
    }
    else if(this.vendor_flag==false){
      if(data.is_active==true){
        config={
          disabled: true,
          style: {color:'gray'},
          icon: 'wb_sunny',
          class: '',
          value: '',
          function:false
        }
      }
      else if(data.is_active==false){
        config={
          disabled: true,
          style: {color:'gray'},
          icon: 'wb_sunny',
          class: '',
          value: '',
          function:false
        }
      }
    }
    return config
  }

 
  SummaryApiactivityObjNew: any;
  SummaryApipaymentObjNew: any;
  SummaryApiactivitymodifyObjNew: any;
  SummaryApipaymentmodifyObjNew: any;
  catalogTab:boolean=false;
  isCatalogForm:boolean
  modalclose:boolean
  SummarymodifycatalogData:any = [
  { "columnname": "Product Type", "key": "type","type":"object","objkey":"name" },

  { "columnname": "Product", "key": "productname","type":"object","objkey":"name" },
  
  { "columnname": "Make", "key": "make","type":"object","objkey":"name" },
  
  { "columnname": "Model", "key": "model","type":"object","objkey":"name" },

  { "columnname": "Category", "key": "category","type":"object","objkey":"name" },
  
  { "columnname": "Sub Category", "key": "subcategory","type":"object","objkey":"name" },

  { "columnname": "From Date", "key": "fromdate", "type": 'date',"datetype": "dd-MMM-yyyy"},

  { "columnname": "To date", "key": "todate", "type": 'date',"datetype": "dd-MMM-yyyy"},

  { "columnname": "Status", "key": "statuus" , validate: true, validatefunction: this.catlogstatusfn.bind(this)},

  { "columnname": "Action", "key": "remarks" , button:true,function:true, validate: true, validatefunction: this.catlogeditconfigfn.bind(this),
clickfunction:this.catalogEdit.bind(this)},

{ "columnname": "Delete", "key": "remark" , button:true,function:true, validate: true, validatefunction: this.catlogdeleteconfigfn.bind(this),
clickfunction:this.deleteCatalog.bind(this)},
]
  SummarybulkmodifycatalogData:any = [

    { "columnname": "Product Type", "key": "type","type":"object","objkey":"name" },

    { "columnname": "Product", "key": "productname","type":"object","objkey":"name" },
  
    { "columnname": "Make", "key": "make","type":"object","objkey":"name" },
    
    { "columnname": "Model", "key": "model","type":"object","objkey":"name" },
  
    { "columnname": "Specification & Configuration", "key": "specificationname", },
    
    // { "columnname": "Configuration Specification", "key": "configuration","array":true,"objkey":"specification" },
    
    { "columnname": "Category", "key": "category","type":"object","objkey":"code" },
    
    { "columnname": "Sub Category", "key": "subcategory","type":"object","objkey":"code" },
  
    { "columnname": "Catelog Specification", "key": "specification"},
    
    { "columnname": "Size", "key": "size" },
   
    { "columnname": "Remarks", "key": "remarks", },
   
    { "columnname": "UOM", "key": "uom","type":"object","objkey":"name" },
  
    { "columnname": "Unit Price", "key": "unitprice" },
    
    { "columnname": "From Date", "key": "fromdate", "type": 'date',"datetype": "dd-MMM-yyyy"},
    
    { "columnname": "To Date", "key": "todate", "type": 'date',"datetype": "dd-MMM-yyyy"},
   
    { "columnname": "Packing Price", "key": "packing_price", },
   
    { "columnname": "Delivery Days", "key": "delivery_date"},
  
    { "columnname": "Capacity", "key": "capacity" },
   
    { "columnname": "DTS", "key": "direct_to" },
   
    { "columnname": "Action", "key": "checkbox", "checkbox": true, "function": true, "clickfunction": this.bulkeditclick.bind(this) },


]
  SummarycatalogData: any = [

  { "columnname": "Product Type", "key": "type","type":"object","objkey":"name" },

  { "columnname": "Product", "key": "productname","type":"object","objkey":"name" },
  
  { "columnname": "Make", "key": "make","type":"object","objkey":"name" },
  
  { "columnname": "Model", "key": "model","type":"object","objkey":"name" },
    
  { "columnname": "Category", "key": "category","type":"object","objkey":"name" },
  
  { "columnname": "Sub Category", "key": "subcategory","type":"object","objkey":"name" },
  
  { "columnname": "From Date", "key": "fromdate", "type": 'date',"datetype": "dd-MMM-yyyy"},
  
  { "columnname": "To Date", "key": "todate", "type": 'date',"datetype": "dd-MMM-yyyy"},
  
  { "columnname": "View","icon":"visibility", button:true,function:true ,clickfunction:this.RMView_catelog.bind(this) },
  
  { "columnname": "Action", "key": "remarks" , button:true,function:true, validate: true, validatefunction: this.catlogeditfn.bind(this),
  clickfunction:this.catalogEdit.bind(this)},
  
  { "columnname": "Delete", "key": "remark" , button:true,function:true, validate: true, validatefunction: this.catlogdeletefn.bind(this),
  clickfunction:this.deleteCatalog.bind(this)},
  
  ]
  SummarybulkcatalogData: any = [

  // { "columnname": "I'm Bulk", "key": "productname","type":"object","objkey":"name" },

  // { "columnname": "Product Type", "key": "type","type":"object","objkey":"name" },

  { "columnname": "Product", "key": "productname","type":"object","objkey":"name" },
  
  { "columnname": "Make", "key": "make","type":"object","objkey":"name" },
  
  { "columnname": "Model", "key": "model","type":"object","objkey":"name" },

  { "columnname": "Specification & Configuration", "key": "specificationname", },
  
  // { "columnname": "Configuration", "key": "configuration_c","type":"object","objkey":"name" },
  
  { "columnname": "Category", "key": "category","type":"object","objkey":"code" },
  
  { "columnname": "Sub Category", "key": "subcategory","type":"object","objkey":"code" },

  { "columnname": "Catelog Specification", "key": "specification"},
  
  { "columnname": "Size", "key": "size" },
 
  { "columnname": "Remarks", "key": "remarks", },
 
  { "columnname": "UOM", "key": "uom","type":"object","objkey":"name" },

  { "columnname": "Unit Price", "key": "unitprice" },
  
  { "columnname": "From Date", "key": "fromdate", "type": 'date',"datetype": "dd-MMM-yyyy"},
  
  { "columnname": "To Date", "key": "todate", "type": 'date',"datetype": "dd-MMM-yyyy"},
 
  { "columnname": "Packing Price", "key": "packing_price", },
 
  { "columnname": "Delivery Days", "key": "delivery_date"},

  { "columnname": "Capacity", "key": "capacity" },
 
  { "columnname": "DTS", "key": "direct_to" },
  
  { "columnname": "Action", "key": "checkbox", "checkbox": true,button: true, "function": true, "clickfunction": this.bulkeditclick.bind(this),validate: true, validatefunction: this.checkboxvalidatefn.bind(this) },

  ]
  SummarybulkcatalogData1: any = [

  // { "columnname": "I'm Bulk", "key": "productname","type":"object","objkey":"name" },

  // { "columnname": "Product Type", "key": "type","type":"object","objkey":"name" },

  { "columnname": "Product", "key": "productname","type":"object","objkey":"name" },
  
  { "columnname": "Make", "key": "make","type":"object","objkey":"name" },
  
  { "columnname": "Model", "key": "model","type":"object","objkey":"name" },

  { "columnname": "Specification & Configuration", "key": "specificationname", },
  
  // { "columnname": "Configuration", "key": "configuration_c","type":"object","objkey":"name" },
  
  { "columnname": "Category", "key": "category","type":"object","objkey":"code" },
  
  { "columnname": "Sub Category", "key": "subcategory","type":"object","objkey":"code" },

  { "columnname": "Catelog Specification", "key": "specification"},
  
  { "columnname": "Size", "key": "size" },
 
  { "columnname": "Remarks", "key": "remarks", },
 
  { "columnname": "UOM", "key": "uom","type":"object","objkey":"name" },

  { "columnname": "Unit Price", "key": "unitprice" },
  
  { "columnname": "From Date", "key": "fromdate", "type": 'date',"datetype": "dd-MMM-yyyy"},
  
  { "columnname": "To Date", "key": "todate", "type": 'date',"datetype": "dd-MMM-yyyy"},
 
  { "columnname": "Packing Price", "key": "packing_price", },
 
  { "columnname": "Delivery Days", "key": "delivery_date"},

  { "columnname": "Capacity", "key": "capacity" },
 
  { "columnname": "DTS", "key": "direct_to" },
  
  // { "columnname": "Action", "key": "checkbox", "checkbox": true, "function": true, "clickfunction": this.bulkeditclick.bind(this) },
  
  ]
  SummarypreviewbulkcatalogData: any = [

  // { "columnname": "I'm Bulk", "key": "productname","type":"object","objkey":"name" },

  { "columnname": "Product", "key": "productname","type":"object","objkey":"name" },
  
  { "columnname": "Make", "key": "make","type":"object","objkey":"name" },
  
  { "columnname": "Model", "key": "model","type":"object","objkey":"name" },

  { "columnname": "Specification", "key": "specificationname","type":"object","objkey":"name" },
  
  { "columnname": "Configuration", "key": "configuration_c","type":"object","objkey":"name" },
  
  { "columnname": "Category", "key": "category","type":"object","objkey":"name" },
  
  { "columnname": "Sub Category", "key": "subcategory","type":"object","objkey":"name" },

  { "columnname": "Catelog Specification", "key": " specification","type":"object","objkey":"name" },
  
  { "columnname": "Size", "key": "size","type":"object","objkey":"name" },
 
  { "columnname": "Remarks", "key": "remarks","type":"object","objkey":"name" },
 
  { "columnname": "UOM", "key": "uom","type":"object","objkey":"name" },

  { "columnname": "Unit Price", "key": "unitprice","type":"object","objkey":"name" },
  
  { "columnname": "From Date", "key": "fromdate", "type": 'date',"datetype": "dd-MMM-yyyy"},
  
  { "columnname": "To Date", "key": "todate", "type": 'date',"datetype": "dd-MMM-yyyy"},
 
  { "columnname": "Packing Price", "key": "packing_price","type":"object","objkey":"name" },
 
  { "columnname": "Delivery Days", "key": "delivery_date", "type": 'date',"datetype": "dd-MMM-yyyy"},

  { "columnname": "Capacity", "key": "capacity","type":"object","objkey":"name" },
 
  { "columnname": "DTS", "key": "direct_to","type":"object","objkey":"name" },
  

  
  ]

  bulkeditclick(data){
    console.log("bulkeditclick",data)
    this.array_branchId = data.wholearray
    console.log("array_branchId",this.array_branchId)
    if(this.array_branchId.length == 0) {
      this.bulk_upload = true;
      this.bulk_edit = false;
    }
    else{
      this.bulk_upload = false;
      this.bulk_edit = true;
      this.show_success_preview = false
      this.show_error_download = false
    }
  }
  catlogdeleteconfigfn(deletesum){
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function:false
    };
  
    if (deletesum.modify_status != 0) {
      config = {
        disabled: false,
        style: {color: 'green'},
        icon: 'delete',
        class: '',
        value: '',
        function: true
      };
    } 
    else if (deletesum.modify_status == 0) {
      config = {
        disabled: false,
        style: {color: 'gray'},
        icon: 'delete',
        class: '',
        value: '',
        function: true
      };
    }
    return config
  }
  catlogeditconfigfn(actiondata){
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function:false
    };
  
    if (actiondata.modify_ref_id != actiondata.id && actiondata.modify_status == 1){
      config = {
        disabled: true,
        style: {color: 'gray'},
        icon: 'edit',
        class: '',
        value: '',
        function: false
      };
    }
    else if (actiondata.modify_ref_id == actiondata.id && actiondata.modify_status == 1){
      config = {
        disabled: false,
        style: {color: 'green'},
        icon: 'edit',
        class: '',
        value: '',
        function: true
      };
    }
    else if (actiondata.modify_status == 2 && actiondata.modify_ref_id != true){
      config = {
        disabled: false,
        style: {color: 'green'},
        icon: 'edit',
        class: '',
        value: '',
        function: true
      };
    }
    else if (actiondata.modify_status == 2 && actiondata.modify_ref_id == true){
      config = {
        disabled: true,
        style: {color: 'gray'},
        icon: 'edit',
        class: '',
        value: '',
        function: false
      };
    }
    return config;
  }
  catlogstatusfn(datasum){
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function:false
    };
  
    if (datasum.modify_status == 1){
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: 'Create',
        function:false
      };
    } else if (datasum.modify_status == 2){
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: 'Update',
        function:false
      };
    }  else if (datasum.modify_status == 0){
      config = {
        disabled: false,
        style: '',
        icon: '',
        class: '',
        value: 'Delete',
        function:false
      };
    }
    return config;
  }
  onCancelClick() {
    this.isCatalogForm = false;
    this.catelog_RMView = false;
    this.isCatalog = true
    this.modalclose = false
    this.cancelpopup()

  }
  catalogEditSubmit() {
    // this.getcatalogsummary();
    this.catlogsummary();
    this.isCatalogEditForm = false;
    // this.ismakerCheckerButton = true;
    this.isCatalog = true;
    this.cancelpopup()


  }
  catalogEditCancel() {
    this.isCatalogEditForm = false;
    // this.ismakerCheckerButton = true;
    this.isCatalog = true;
    this.cancelpopup()

  }
  catalogSubmit() {
    // this.getcatalogsummary();
    this.catlogsummary();
    this.isCatalogForm = false;

    this.isCatalog = true
    this.cancelpopup()
  }
  cancelpopup(){
    this.closeaddpopup.nativeElement.click();
  }
  catelog_RMView:any
  catlogdeletefn(data){
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function:false
    };
    if(this.vendor_flag==true){
  
      if(data.modify_ref_id>0){
        config={
          disabled: true,
          style: {color:'gray'},
          icon: 'delete',
          class: '',
          value: '',
          function:false
        }
      }
      else if(data.modify_ref_id=='-1'){
        config={
          disabled: false,
          style: {color:'green'},
          icon: 'delete',
          class: '',
          value: '',
          function:true
        }
      }
    }
  
    else if(this.vendor_flag==false){
      config={
        disabled: true,
        style: {color:'gray'},
        icon: 'delete',
        class: '',
        value: '',
        function:false
      }
    }
    return config
  }
  catlogeditfn(data){
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function:false
    };
    if(this.vendor_flag==true){
  
      if(data.modify_ref_id>0){
        config={
          disabled: true,
          style: {color:'gray'},
          icon: 'edit',
          class: '',
          value: '',
          function:false
        }
      }
      else if(data.modify_ref_id=='-1'){
        config={
          disabled: false,
          style: {color:'green'},
          icon: 'edit',
          class: '',
          value: '',
          function:true
        }
      }
    }
  
    else if(this.vendor_flag==false){
      config={
        disabled: true,
        style: {color:'gray'},
        icon: 'edit',
        class: '',
        value: '',
        function:false
      }
    }
    return config
  }
  checkboxvalidatefn(data){
    let config: any = {
      disabled: false,
      style: '',
      icon: '',
      class: '',
      value: '',
      function:false
    };
    if(this.vendor_flag==true){
  
      if(data.modify_ref_id>0){
        config={
          disabled: true,
          style: { cursor: 'pointer', color: 'grey' },
          icon: '',
          class: '',
          value: '',
          button: false,
          function: false,
        }
      }
      else if(data.modify_ref_id=='-1'){
        config={
          disabled: false, // Enable checkbox
          style: '',
          icon: '',
          class: '',
          value: '',
          button: true,
          function: true,
        }
      }
    }
  
    else if(this.vendor_flag==false){
      config={
        disabled: true,
        style: { cursor: 'pointer', color: 'grey' },
        icon: '',
        class: '',
        value: '',
        button: false,
        function: false,
      }
    }
    return config
  }

  RMView_catelog(data) {
    let new_datas = { 
      "new_data": data
    }
    console.log("catelog", new_datas)
    this.isCatalog = true;
    this.isCatalogForm = false;
    this.catelog_RMView = true;
    this.isCatalogEditForm = false;
    this.shareService.modification_data.next(new_datas);
    this.popupopen()
    this.rename = "Catelog Changes View Form"

  }
  getCatalogList: any;
  deleteCatalog(data,index) {
    //  this.getCatalogList[index].catbtn=true;
    // this.isLoading = true;
    // this.wait(2000).then( () => this.isLoading = false );
  
      // let datas: any = this.shareService.testingvalue.value;
      let activityDetailId = data.branch_id
      let value = data.id
      console.log("deleteCatalog", value)
      if(this.getCatalogList == 1){
        this.notification.showError('Atleast one Catalogue should be maintained')
        return false
      }
      else{
      if (confirm("Delete Catalog details?")) {
      this.atamaService.deleteCatalogForm(value, activityDetailId)
        .subscribe(result => {
                  //bug id:9259
                  // if (result.code === "Atleast one Catalogue should be maintained") {
                    // this.notification.showWarning("Should Not be Delete Activity...")
                  if (result.code) {
                    this.notification.showWarning(result.description)
          
                  } 
                  else {
                    this.notification.showSuccess("Successfully deleted....")
                    // this.getcatalogsummary();
                    this.catlogsummary();
                    return true
                  }
  
          // this.notification.showSuccess("Successfully deleted....")
          // this.getcatalogsummary();
          // return true
        })}else{
          return false
        }}
    }
  isCatalogEditForm:boolean
  catalogEdit(data) {
    this.isCatalogEditForm = true;
    this.isCatalog = true;
    // this.ismakerCheckerButton = false;
    this.shareService.catalogEdit.next(data)
    this.popupopen()
    this.rename = "Edit Catalogue Form"
    // console.log("catalog", data);
    // this.shareService.testingvalue.next(this.testingdata)
    return data;
  }
  addCatalog() {
    this.isCatalog = true;
    this.isCatalogForm = true;
    this.modalclose = true
    // this.testingdata = this.testingCat;
    // console.log(">>S>ScatgLOGVALUE", this.testingdata)

    // this.shareService.testingvalue.next(this.activity_catddl)

    this.popupopen()
    this.rename = "Catalogue Creation Form"
  }
  activitysummary() {
    this.SummaryApiactivityObjNew = {
      method: "get",
      url: this.url + "venserv/branch/" + this.branchViewId + "/activity",
    };
    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.activity_modify = true;
    }
  }
  paymentsummary() {
    this.SummaryApipaymentObjNew = {
      method: "get",
      url: this.url + "venserv/branch/" + this.branchViewId + "/payment",
    };
    if (
      (this.requestStatusName == "Modification" &&
        this.vendorStatusName == "Draft") ||
      (this.requestStatusName == "Renewal Process" &&
        this.vendorStatusName == "Draft")
    ) {
      this.getmodification_vender();
      this.payment_modify = true;
    }
  }

  modifyactivitysummary(){
    this.SummaryApiactivitymodifyObjNew = {
      FeSummary: true,
      data: this.activity_data,
    };
    console.log("activity_data ======>", this.activity_data);
  }
  modifypaymentsummary(){
    this.SummaryApipaymentmodifyObjNew = {
      FeSummary: true,
      data: this.payment_data,
    };
    console.log("payment_data ======>", this.payment_data);
  }
  goback() {
    this.router.navigate(["/atma/vendorView"], { skipLocationChange: true });
  }

  closepopup() {
    if (this.isActivityForm) {
      this.activityCancel();
    } 
    else if (this.paymentaddform) {
      this.paymentaddcancel();
    }
    else if (this.paymenteditform) {
      this.paymentcancel();
    }
    else if (this.branchactivityedit) {
      this.branchpaymenteditcancel();
    }
    else if (this.payment_RMView) {
      this.paymentaddcancel();
    }
    else if(this.isCatalogForm){
      this.onCancelClick()
    }
    else if(this.isCatalogEditForm){
      this.catalogEditCancel()
    }
    else if(this.catelog_RMView){
      this.onCancelClick()
    }

  }

  closedpopup() {
    this.closeaddpopup.nativeElement.click();
  }
  popupopen() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("branchViewMainModal"),
      {
        backdrop: 'static',
        keyboard: false
      }
    );
    myModal.show();
  }
  send_value:any
  SummaryApicatlogObjNew:any
  SummaryApibulkcatlogObjNew:any
  SummaryApipreviewbulkcatlogObjNew:any
  catalog_data:any=[]
  SummaryApicatlogmodifyObjNew:any
  SummaryApimodifybulkcatlogObjNew:any;
  modificationactivitydetaildata: any;
  catalog_modify:boolean
  productID:any
  catelogName:any
  subCatelogName:any
  prod(data) {
    if(data == "" || data == undefined || data == null){
      this.catlogsummary();

      this.productfield = {
        label: "Product Name",
        method: "get",
        url: this.atmaUrl + "mstserv/product_search",
        params: "",
        searchkey: "query",
        displaykey: "name",
        wholedata: true,
        disabled : false
      };
  
      this.makefield = {
        label:"Make",
        "method": "get",
        "url": this.atmaUrl + "mstserv/product_model_search",
        params: "&m_type=" + "make" ,
        searchkey: "query",
        displaykey: "name",
        disabled : false
      }
  
      this.modelfield = {
        label: "Model",
        "method": "get",
        "url": this.atmaUrl + "mstserv/product_model_search",
        params: "&m_type=" + "model",
        searchkey: "query",
        "displaykey": "name",
        disabled : false
      }

    }
    else{

      this.productfield = {
        label: "Product Name",
        method: "get",
        url: this.atmaUrl + "mstserv/product_search",
        params: "",
        searchkey: "query",
        displaykey: "name",
        wholedata: true,
        disabled : true
      };
  
      this.makefield = {
        label:"Make",
        "method": "get",
        "url": this.atmaUrl + "mstserv/product_model_search",
        params: "&m_type=" + "make" ,
        searchkey: "query",
        displaykey: "name",
        disabled : true
      }
  
      this.modelfield = {
        label: "Model",
        "method": "get",
        "url": this.atmaUrl + "mstserv/product_model_search",
        params: "&m_type=" + "model",
        searchkey: "query",
        "displaykey": "name",
        disabled : true
      }

    }
    this.catalogAddForm.get("cat_name").patchValue(data)
    this.productID = data
    let catelog = data["category"];
    this.catelogName = data?.name;


    
    this.catalogAddForm.patchValue({
      cat_name: this.productID,
      category: this.catelogName,
      subcategory: this.subCatelogName
      // category: this.categoryID,
      // subcategory: this.subcategoryID
    })
  }
  catalogsearch(page=1,pageSize=10){
    // let datas: any = this.shareService.catlogView.value;
    // this.activedetailId =datas.id;
    // this.shareService.catlogView.next(this.activedetailId)
    let search = this.catalogAddForm.value
    console.log("Search Values", search)
    let obj = 
    {
      
    }
  
    if(this.value === 1){
      if(search.cat_name!=""&& search.cat_name!=null&&search.cat_name!=undefined){
        obj["cat_name"]=search.cat_name
        this.send_value = ""
        this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/category_search",params :"&supplier_id="+this.branchViewId+'&category_name='+this.catelogName + '&is_bulk=0'  }
        this.getmodification_vender()
      }
      else{
        if((search.product_id!=""&& search.product_id!=null&&search.product_id!=undefined) && (search.make!=""&& search.make!=null&&search.make!=undefined) && (search.model!=""&& search.model!=null&&search.model!=undefined)){
          this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&product_id="+search.product_id + "&make_id="+search.make + "&model_id="+search.model + '&is_bulk=0'}
          this.getmodification_vender()
        }
        else if((search.product_id!=""&& search.product_id!=null&&search.product_id!=undefined) && (search.make!=""&& search.make!=null&&search.make!=undefined)){
          this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&product_id="+search.product_id + "&make_id="+search.make + '&is_bulk=0'}
          this.getmodification_vender()
        }
        else if((search.make!=""&& search.make!=null&&search.make!=undefined) && (search.model!=""&& search.model!=null&&search.model!=undefined)){
          this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&make_id="+search.make + "&model_id="+search.model + '&is_bulk=0'}
          this.getmodification_vender()
        }
        // else if((search.product_id!=""&& search.product_id!=null&&search.product_id!=undefined) && (search.model!=""&& search.model!=null&&search.model!=undefined)){
        //   this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&product_id="+search.product_id + "&model_id="+search.model}
        // }
        else if(search.product_id!=""&& search.product_id!=null&&search.product_id!=undefined){
          // obj["product_id"]=search.product_id
          this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&product_id="+search.product_id + '&is_bulk=0'}
          this.getmodification_vender()
        }
        else if(search.make!=""&& search.make!=null&&search.make!=undefined){
          // obj["make_id"]=search.make
          this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&make_id="+search.make+ '&is_bulk=0'}
          this.getmodification_vender()
        }
       else if(search.model!=""&& search.model!=null&&search.model!=undefined){
        // obj["model_id"]=search.model
        this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&model_id="+search.model+ '&is_bulk=0'}
        this.getmodification_vender()
        }
        // else{
  
        // }
        
       
        // this.send_value =obj
      }
    }
    else{
      if(search.cat_name!=""&& search.cat_name!=null&&search.cat_name!=undefined){
        obj["cat_name"]=search.cat_name
        this.send_value = ""
        this.SummaryApibulkcatlogObjNew={ "method": "get", "url": this.url + "venserv/category_search",params :"&supplier_id="+this.branchViewId+'&category_name='+this.catelogName + '&is_bulk=1'}
        this.getmodification_bulkcatalog_summary()
      }
      else{
        if((search.product_id!=""&& search.product_id!=null&&search.product_id!=undefined) && (search.make!=""&& search.make!=null&&search.make!=undefined) && (search.model!=""&& search.model!=null&&search.model!=undefined)){
          this.SummaryApibulkcatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&product_id="+search.product_id + "&make_id="+search.make + "&model_id="+search.model + '&is_bulk=1'}
          this.getmodification_bulkcatalog_summary()
        }
        else if((search.product_id!=""&& search.product_id!=null&&search.product_id!=undefined) && (search.make!=""&& search.make!=null&&search.make!=undefined)){
          this.SummaryApibulkcatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&product_id="+search.product_id + "&make_id="+search.make + '&is_bulk=1'}
          this.getmodification_bulkcatalog_summary()
        }
        else if((search.make!=""&& search.make!=null&&search.make!=undefined) && (search.model!=""&& search.model!=null&&search.model!=undefined)){
          this.SummaryApibulkcatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&make_id="+search.make + "&model_id="+search.model + '&is_bulk=1'}
          this.getmodification_bulkcatalog_summary()
        }
        // else if((search.product_id!=""&& search.product_id!=null&&search.product_id!=undefined) && (search.model!=""&& search.model!=null&&search.model!=undefined)){
        //   this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&product_id="+search.product_id + "&model_id="+search.model}
        // }
        else if(search.product_id!=""&& search.product_id!=null&&search.product_id!=undefined){
          // obj["product_id"]=search.product_id
          this.SummaryApibulkcatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&product_id="+search.product_id + '&is_bulk=1'}
          this.getmodification_bulkcatalog_summary()

        }
        else if(search.make!=""&& search.make!=null&&search.make!=undefined){
          // obj["make_id"]=search.make
          this.SummaryApibulkcatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&make_id="+search.make + '&is_bulk=1'}
          this.getmodification_bulkcatalog_summary()

        }
       else if(search.model!=""&& search.model!=null&&search.model!=undefined){
        // obj["model_id"]=search.model
        this.SummaryApibulkcatlogObjNew={ "method": "get", "url": this.url + "venserv/supplier_catelog_model/" + this.branchViewId,params : "&model_id="+search.model + '&is_bulk=1'}
        this.getmodification_bulkcatalog_summary()
        }
        // else{
  
        // }
        
       
        // this.send_value =obj
      }
    }
    //return this.http.get<any>(atmaUrl + "venserv/category_search?supplier_id=" + branchId+'&category_name='+catlogname+'&activity_id='+ activityViewId +'&activitydtl_id='+ activedetailId+'&page='+ page,{ 'headers': headers })


  //   this.atamaService.getcatlogsearch(page,this.branchId,this.activityViewId,this.cid,this.catelogName).subscribe(results => {
  //     console.log("res",results)
  //     this.getCatalogList = results['data']
  //     let dataPagination = results['pagination'];
  //     if(this.getCatalogList.length == 0){
  //       this.has_next = false;
  //       this.has_previous = false;
  //       this.catalogpage = 1
  //     }
  //     if (this.getCatalogList.length > 0) {
  //     this.has_next = dataPagination.has_next;
  //     this.has_previous = dataPagination.has_previous;
  //     this.catalogpage = dataPagination.index;
  //     this.isCatalogPagination = true;
  //     } 
  //     if (this.getCatalogList < 0) {
  //       this.isCatalogPagination = false;
  //     }

      

  //    console.log("getCatalogList", results)
  // })
  // this.getcatalogsummary();

  }
  catlogsummary(){
    this.SummaryApicatlogObjNew={ "method": "get", "url": this.url + "venserv/supplieractivitydtl/"+this.branchViewId+'/catelog' }
    if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
      this.getmodification_vender();
      this.catalog_modify = true;

    } 
    
}
    catalogbulksummary(){
        this.SummaryApibulkcatlogObjNew={ "method": "get", "url": this.url + "venserv/catalog_bulk_onboard/"+this.branchViewId }
        if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
          this.getmodification_bulkcatalog_summary();
          this.bulk_catalog_modify = true;

        } 
        
    }
    catalogpreviewbulksummary(){
        this.SummaryApipreviewbulkcatlogObjNew={ 
          FeSummary: true,
          data: this.preview_data,
        }
  
    }

    getmodification_bulkcatalog_summary(){
     this.SummaryApimodifybulkcatlogObjNew={ "method": "get", "url": this.url + "venserv/catalog_bulk_modification/"+this.branchViewId }
      // this.SummaryApimodifybulkcatlogObjNew={
      //   FeSummary: true,
      //   data: this.modification_bulk_catalog_data,
      // }

    }

    // getmodification_bulkcatalog_vender(){
    
    //   this.modification_bulk_catalog_data=[];
  
    //   this.atamaService.getcatalogbulkmodification(this.branchViewId)
    //       .subscribe(result => {
    //         this.modificationdata = result['data']
    //         // console.log("modifysummary",this.modificationdata)
    //         this.modificationdata.forEach(element => {
    //           if(element.action==2)//edit
    //           {
             
    //           if (element.type_name== 15 ) {
    //             this.modification_bulk_catalog_data.push(element.new_data)
    //             this.getmodification_bulkcatalog_summary()
    //           }
    //         }
    //         if(element.action==1)//create
    //         {
              
              
    //             if(element.type_name==15 ){
    //               console.log("catalog create",element.new_data)
    //               this.modification_bulk_catalog_data.push(element.data)
    //               this.getmodification_bulkcatalog_summary()
    //             }
              
    //         }
    //         if(element.action==0)//delete
    //         {
              
    //           if(element.type_name==15 ){
    //             console.log("catalog create",element.new_data)
    //             this.modification_bulk_catalog_data.push(element.data)
    //             this.getmodification_bulkcatalog_summary()
    //           }
    //         }
           
    //         });
    
    //         if( this.requestStatusName=="Modification" && this.vendorStatusName=='Draft'){

    //           if (this.modification_bulk_catalog_data.length > 0) {
    //             this.modification_bulk_catalog_data = this.getbtn_status(this.modification_bulk_catalog_data)
    //             this.getmodification_bulkcatalog_summary()
    //           }    
    //         }
                
    
       
    //       })
    
    //     console.log('cv ==== modify bulk=========>',this.modification_bulk_catalog_data)
    // }
Reset(){
  this.catalogAddForm.reset();
  // this.getcatalogsummary();
  this.catlogsummary();
  this.catalogbulksummary();
  this.catalogsearchdrop={
    "label":"Catalog Search",
    method: "get",
    url: this.atmaUrl + "mstserv/categoryname_search",
    searchkey: "query",
    displaykey: "name",
    wholedata: true,
    disabled : false
  }
  this.product_reset()
  this.make_reset()
  this.model_reset()
  // this.catelogName = undefined;
}
// getmodificationactivitydetail_vender() {
//   // this.activitydetail_data = [];
//   this.catalog_data=[];
//   this.atamaService.getmodification(this.vendorId)
//     .subscribe(result => {
      
//       this.modificationactivitydetaildata = result['data']
//       this.modificationactivitydetaildata.forEach(element => {
//         if (element.action == 2)//edit
//         {
//           // if (element.type_name== 14 && element.new_data.activity_id.id==this.activityViewId) {
//           //   // this.activitydetail_data.push(element.new_data)
//           //   // this.acttivitymodifysummary()
//           // }
//           if (element.type_name== 15 ) {
//             this.catalog_data.push(element.new_data)
//             this.modifysummary()
//           }
//         }
//         //create and delete
//         else {
//           // if (element.type_name== 14 && element.data.activity_id.id==this.activityViewId) {
//           //   // this.activitydetail_data.push(element.data)
//           //   // this.acttivitymodifysummary()
//           // }
//           if (element.type_name== 15 ) {
//             this.catalog_data.push(element.data)
//             this.modifysummary()

//           }
//         }
//       });
//       if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft') {
//         // if (this.activitydetail_data.length > 0) {
//         //   // this.activitydetail_data = this.getbtn_status(this.activitydetail_data)
//         //   // this.acttivitymodifysummary()
//         // }
//         if (this.catalog_data.length > 0) {
//           this.catalog_data = this.getbtn_status(this.catalog_data)
//           this.modifysummary()
//         }

//       }
//     })

// }
modifysummary (){
  this.SummaryApicatlogmodifyObjNew = {
    FeSummary: true,
    data: this.catalog_data,
  };
  console.log("catalog_data ======>", this.catalog_data);

   
  
  
}






activityDelete(data) {
  // let data = this.getData
  console.log("deletedata", data);
  let activityID = data.id;
  this.branchViewId = data.branch;
  this.atamaService
    .activityDelete(this.branchViewId, activityID)
    .subscribe((result) => {
      console.log("deleteactivity", result);
      if (result.code === "Atleast one Activity should be maintained") {
        this.notification.showWarning(result.description)
      }
      else {
        this.notification.showSuccess("Successfully deleted....")
        this.activitysummary()
      //  this.router.navigate(['/atma/branchView'], { skipLocationChange: true })
      return true
      }
    });
}

activitydeletefn(data) {
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: "",
    function: false,
  };
  if (this.vendor_flag == true) {
    if (data.modify_ref_id > 0) {
      config = {
        disabled: true,
        style: { color: "gray" },
        icon: "delete",
        class: "",
        value: "",
        function: false,
      };
    } else if (data.modify_ref_id == "-1") {
      config = {
        disabled: false,
        style: { color: "green" },
        icon: "delete",
        class: "",
        value: "",
        function: true,
      };
    }
  } else if (this.vendor_flag == false) {
    config = {
      disabled: true,
      style: { color: "gray" },
      icon: "delete",
      class: "",
      value: "",
      function: false,
    };
  }
  return config;
}
activitymodifydeletefn(data) {
  let config: any = {
    disabled: false,
    style: "",
    icon: "",
    class: "",
    value: "",
    function: false,
  };
  if ((data.modify_ref_id != data.id && data.modify_status == 1) ||
      (data.modify_status == 2 && data.modify_ref_id == true)) {
    config = {
      disabled: true,
      style: { color: "gray" },
      icon: "delete",
      class: "",
      value: "",
      function: false,
    };
  } else if ((data.modify_ref_id == data.id && data.modify_status == 1) ||
             (data.modify_status == 2 && data.modify_ref_id != true)) {
    config = {
      disabled: false,
      style: { color: "green" },
      icon: "delete",
      class: "",
      value: "",
      function: true,
    };
  }
  return config;
}
product_reset(){
  this.productfield = {
    label: "Product Name",
    method: "get",
    url: this.atmaUrl + "mstserv/product_search",
    params: "",
    searchkey: "query",
    displaykey: "name",
    wholedata: true,
    disabled : false
  };
  this.catalogAddForm.get('product_name')?.reset();
  this.catalogAddForm.get('product_id')?.reset();
  // this.catalogAddForm.value.Modename.reset
}
make_reset(){
  this.makefield = {
    label:"Make",
    "method": "get",
    "url": this.atmaUrl + "mstserv/product_model_search",
    params: "&m_type=" + "make" ,
    searchkey: "query",
    displaykey: "name",
    disabled : false
  }

 this.catalogAddForm.get('Modename')?.reset();
 this.catalogAddForm.get('make')?.reset();
}
model_reset(){
  this.modelfield = {
    label: "Model",
    "method": "get",
    "url": this.atmaUrl + "mstserv/product_model_search",
    params: "&m_type=" + "model",
    searchkey: "query",
    "displaykey": "name",
    disabled : false
  }
  this.catalogAddForm.get('Modalname')?.reset();
  this.catalogAddForm.get('model')?.reset();
}
productdata(data) {
  this.productID = data
  this.product_code = data?.code
  console.log("Data...", this.product_code)
  this.product_id = data?.id
  console.log("Id......", this.product_id)

  this.catalogAddForm.patchValue({
    product_name: this.productID,
    product_id:this.product_id
  })

  if(data == "" || data == null || data == undefined){

    this.catlogsummary();
    this.make_reset();
    this.model_reset();
    this.catalogsearchdrop={
      "label":"Catalog Search",
      method: "get",
      url: this.atmaUrl + "mstserv/categoryname_search",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled: false
    }

    this.makefield = {
      label:"Make",
      "method": "get",
      "url": this.atmaUrl + "mstserv/product_model_search",
      params: "&m_type=" + "make" ,
      searchkey: "query",
      displaykey: "name",
      disabled : false
    }

    this.modelfield = {
      label: "Model",
      "method": "get",
      "url": this.atmaUrl + "mstserv/product_model_search",
      params: "&m_type=" + "model",
      searchkey: "query",
      "displaykey": "name",
      disabled : false
    }

  }
  else{
    this.make_reset();
    this.model_reset();

    this.catalogsearchdrop={
      "label":"Catalog Search",
      method: "get",
      url: this.atmaUrl + "mstserv/categoryname_search",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled: true
    }

    this.makefield = {
      label:"Make",
      "method": "get",
      "url": this.atmaUrl + "mstserv/product_model_search",
      params: "&m_type=" + "make" + "&product_code=" + this.product_code,
      searchkey: "query",
      displaykey: "name",
      disabled : false

    }
  }

 


}

makedata(partdata) {
  this.catalogAddForm.patchValue({
    Modename: partdata,
    make:partdata?.id

  })
  this.Modenames = partdata.name;
  this.Modenames_code = partdata.code;
  this.Modenames_id = partdata.id;
  if(partdata == "" || partdata == null || partdata == undefined){

    this.model_reset();
    this.catalogAddForm.patchValue({
      Modename: "",
      make:""
  
    })

    this.catalogsearchdrop={
      "label":"Catalog Search",
      method: "get",
      url: this.atmaUrl + "mstserv/categoryname_search",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled: false
    }

    this.modelfield = {
      label: "Model",
      "method": "get",
      "url": this.atmaUrl + "mstserv/product_model_search",
      params: "&m_type=" + "model",
      searchkey: "query",
      "displaykey": "name",
      disabled : false
    }
  }
  else{

    this.model_reset();

    this.catalogsearchdrop={
      "label":"Catalog Search",
      method: "get",
      url: this.atmaUrl + "mstserv/categoryname_search",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled: true
    }

    this.modelfield = {
      label: "Model",
      "method": "get",
      "url": this.atmaUrl + "mstserv/product_model_search",
      params: "&m_type=" + "model" + "&product_code="+this.product_code +"&make_id="+this.Modenames_id,
      searchkey: "query",
      "displaykey": "name",
      "Depkey": "id",
      "DepValue": "make_id",

    }
  }
  // if(this.product_code && this.Modenames_id){
  //   this.ChildObj = {
  //     label: "Model",
  //     "method": "get",
  //     "url": this.atmaUrl + "mstserv/product_model_search",
  //     params: "&m_type=" + "model" + "&product_code="+this.product_code,
  //     searchkey: "query",
  //     "displaykey": "name",
  //     "Depkey": "id",
  //     "DepValue": "make_id",

  //   }

    
  // }
  // else{
  //   this.ChildObj = {
  //     label: "Model",
  //     "method": "get",
  //     "url": this.atmaUrl + "mstserv/product_model_search",
  //     params: "&m_type=" + "model",
  //     searchkey: "query",
  //     "displaykey": "name",

  //   }
  // }


}
modaldata(childata) {
  this.catalogAddForm.patchValue({
    Modalname: childata,
    model:childata?.id

  })
  if(childata == "" || childata == null || childata == undefined){

    this.catlogsummary();

    this.catalogsearchdrop={
      "label":"Catalog Search",
      method: "get",
      url: this.atmaUrl + "mstserv/categoryname_search",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled: false
    }

    this.catalogAddForm.patchValue({
      Modalname: "",
      model:""
  
    })
  }
  else{
    this.catalogsearchdrop={
      "label":"Catalog Search",
      method: "get",
      url: this.atmaUrl + "mstserv/categoryname_search",
      searchkey: "query",
      displaykey: "name",
      wholedata: true,
      disabled: true
    }
  }
  
}

catalogpopup(){
  var myModal = new (bootstrap as any).Modal(
    document.getElementById("create_catlog_popup"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  myModal.show();
}

popupdata(n){
  this.value = n.value
  
  if(n.value === 1){
    this.catlogsummary();
    // this.closebutton.nativeElement.click();  
  }
  else{
    this.catalogbulksummary();
    // if (this.requestStatusName == "Modification" && this.vendorStatusName == 'Draft' || this.requestStatusName == "Renewal Process" && this.vendorStatusName == "Draft") {
    //   this.getmodification_bulkcatalog_summary();
    //   this.bulk_catalog_modify = true;

    // }
    // this.closebutton.nativeElement.click();  
  }
}

downloadFileXLSXbulkTemplate() {
  this.SpinnerService.show();
  this.atamaService.DownloadExcel()
    .subscribe((results) => {
      this.SpinnerService.hide();
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "Bulk Upload Sample Template.xlsx"
      link.click();
    },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}

UPloadCSVFileData: any

onFileSelectedBulkUpload(e) {
  let dataFilevalue = e.target.files[0]
  this.UPloadCSVFileData = dataFilevalue
}

UploadCsv() {
  this.SpinnerService.show()
  
  if ((this.UPloadCSVFileData == "") || (this.UPloadCSVFileData == null) || (this.UPloadCSVFileData == undefined)) {
    this.SpinnerService.hide();
    this.notification.showWarning("Please select file for bulk upload")
    return false
  }
  

  

  this.SpinnerService.show();
  this.atamaService.BulkUploadCatalog(this.branchViewId, this.UPloadCSVFileData)
    .subscribe((results) => {
      this.SpinnerService.hide();
      let datas = results
  

      if(results.code =="Success"){
        this.SpinnerService.hide();
        this.notification.showSuccess(results.description)
        this.error_file_id = results.file_id
        this.show_success_preview = true
        this.show_error_download = false
        this.preview_data = results.data
        const fileInput = document.getElementById('file') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = ''; // Clear the input value
          }
        return false
      }
      else if(results.code =="Error"){
        this.SpinnerService.hide();
        if(results.file_id){
          this.notification.showError(results.description)
          this.show_error_download = true
          this.show_success_preview = false
          this.error_file_id = results.file_id
          const fileInput = document.getElementById('file') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = ''; // Clear the input value
            }
        }
        else{
          this.notification.showError(results.description)
          this.show_error_download = false
          this.show_success_preview = false
        }
        return false
      }

    //   if(results.code =="Kindly Change Sheet Name as Template"){
    //     this.SpinnerService.hide();
    //     this.notification.showError(results.description)
    //     return false
    //   }
    //   if(results.code =="Kindly Change Header Name"){
    //     this.SpinnerService.hide();
    //     this.notification.showError(results.description)
    //     return false
    //   }
      
    //   if(results.code =="INVALID_DATA"){
    //     var answer = window.confirm(results.description+"Click OK to Download");
    //     // this.fileid=results.prdetails_bfile_id 
    // // if (answer) {
    // //   this.Downloadoverallblkfileclk(this.fileid)
    // // }
    // // else {
    // //   return false;
    // // }
        
    //   }


    //   if(results.code =="Success Uploaded"){
    //     this.SpinnerService.hide();
    //     this.notification.showSuccess(results.description)

    //         if (results) {
    //           for (let errorOrData in results) {
                                  
    //               // this.isprbulkupload=true; //7421
    //               // this.patchBulkUploadDataInForm(results["prdetails"])
    //               // // console.log("data to patch", results)
    //               // this.ErrorMSgDivBulk = false
    //               // this.SpinnerService.hide();
    //               // return false
    //           }
    //         }
    //       }






    },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
      // const fileInput = document.getElementById('file') as HTMLInputElement;
      // if (fileInput) {
      //   fileInput.value = ''; // Clear the input value
      // }
      this.show_error_download = false
      this.show_success_preview = false
    })
}

downloadFileXLSXErrorFile() {
  this.SpinnerService.show();
  this.atamaService.DownloadErrorExcel(this.error_file_id)
    .subscribe((results) => {
      this.SpinnerService.hide();
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "Bulk Upload Sample Template.xlsx"
      link.click();
      this.show_error_download = false
    },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
}

previewpopup(): void {
  // Open the modal
  var myModal = new (bootstrap as any).Modal(
    document.getElementById("preview_popup"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  myModal.show();

  // Set the default tab to "Bulk Upload Success"
  this.selectedTab = this.Bulk_Sub_Menu_List[0];

  // Call BulkSubModule to show the success table
  this.BulkSubModule(this.selectedTab);
}


preview_submit(){
  this.SpinnerService.show();
  console.log("preview_payload_data---------->",this.preview_data)

  // Modify preview_data before sending it to the backend
  const modifiedPreviewData = this.modifyPreviewData(this.preview_data);

  this.atamaService.previewSubmit(this.branchViewId,modifiedPreviewData).subscribe((results) => {
    this.SpinnerService.hide();
    if (results.status == "success") {
      this.notification.showSuccess(results.message)
      this.previewclosebutton.nativeElement.click(); 
      this.show_success_preview = false
      this.catalogbulksummary()
    }
    else {
      this.notification.showError(results.message)
      this.previewclosebutton.nativeElement.click(); 
      this.show_success_preview = false
      this.catalogbulksummary()
    }
  },(error) => {
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}

modifyPreviewData(data: any) {
  return {
    data: data.success.map((item: Product) => {
      const modifiedProduct: Product = {
        product_name: item.product_name,
        productname: item.productname,
        makename: item.makename,
        modelname: item.modelname,
        specificationname: item.specificationname,
        specification: item.specification,
        UOM: item.UOM,
        categoryname: item.categoryname,
        subcategoryname: item.subcategoryname,
        make: item.make,
        model: item.model,
        category: item.category,
        subcategory: item.subcategory,
        catelogspecification: item.catelogspecification,
        size: item.size,
        remarks: item.remarks,
        uom: item.uom,
        unitprice: item.unitprice,
        from_date: item.from_date,
        to_date: item.to_date,
        packing_price: item.packing_price,
        delivery_date: item.delivery_date,
        capacity: item.capacity,
        direct_to: item.direct_to,
        configuration: item.configuration.map((config: ProductConfiguration) => {
          const modifiedConfig: ProductConfiguration = {
            specification: config.specification,
            configuration: config.configuration
          };
          if (config.id) modifiedConfig.id = config.id;  // Only add 'id' if it exists
          return modifiedConfig;
        })
      };

      // Add 'id' only if it exists in the product
      if (item.id) modifiedProduct.id = item.id;

      return modifiedProduct;
    })
  };
}

BulkUpdate(){
  this.SpinnerService.show();
  let payload={
   "data":this.array_branchId
  }
  this.atamaService.BulkUpdate(this.branchViewId,payload).subscribe((results) => {

    // if (results.code == "Success") {
    //   this.notification.showSuccess(results.description)
    // }
    // else {
    //   this.notification.showError(results.description)
    // }
    let binaryData = [];
    binaryData.push(results)
    let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
    let link = document.createElement('a');
    link.href = downloadUrl;
    link.download = "Bulk Update.xlsx"
    link.click();
    this.SpinnerService.hide();
    this.catalogbulksummary()
    this.bulk_edit =false;
    this.bulk_upload = true;
  },(error) => {  
    this.errorHandler.handleError(error);
    this.SpinnerService.hide();
  })
}
selectedTab: any = null;

// initializeDefaultTab(): void {
//   // Set the default tab as "Bulk Upload Success"
//   this.BulkSubModule(this.selectedTab);
// }

BulkSubModule(data) {
  console.log("BulkSubModule triggered with:", data);
  this.success_bulk_data = [];
  this.error_bulk_data = [];
  this.success_table = false;
  this.error_table = false;

  if (data.value === 1) {
    this.success_table = true;
    if (this.preview_data?.success) {
      this.preview_data.success.forEach(element => {
        this.success_bulk_data.push(element);
      });
    }
  } else if (data.value === 2) {
    this.error_table = true;
    if (this.preview_data?.error) {
      this.preview_data.error.forEach(element => {
        this.error_bulk_data.push(element);
      });
    }
  }

  // Trigger change detection to ensure the table renders
  this.cdr.detectChanges();
  console.log("Success Table:", this.success_bulk_data);
  console.log("Error Table:", this.error_bulk_data);
}

}
