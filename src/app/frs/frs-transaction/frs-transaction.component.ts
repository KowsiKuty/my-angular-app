import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  ChangeDetectorRef
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { Router } from "@angular/router";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { fromEvent } from "rxjs";
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  finalize,
  flatMap,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { FrsServiceService } from "../frs-service.service";
import { DomSanitizer } from "@angular/platform-browser";
import { FrsshareService } from "../frsshare.service";
import { StringLiteral } from "typescript";
export interface frs {
  transaction: string;
  payment: string;
  customer: string;
  credit: string;
  id: number;
  debit: string;
  product: string;
  bil_name: string;
  name: string;
  code: string;
  // description:string,
  gl_no: number;
  transactions: string;
  microcccode: string;
  gl_name;
}
export interface branch {
  code: any;
  name: string;
  id: number;
}

@Component({
  selector: "app-frs-transaction",
  templateUrl: "./frs-transaction.component.html",
  styleUrls: ["./frs-transaction.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class FrsTransactionComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("statedata") statedata: any;
  @ViewChild("Productdata") Productdata: any;
  @ViewChild("bsdata") bsdata: any;
  @ViewChild("cata_data") cata_data: any;
  @ViewChild("credit_data") credit_data: any;
  @ViewChild("credit_gl_name_mat") credit_gl_name_mat:any;
  @ViewChild("subcat_data") subcat_data: any;
  @ViewChild("ccdata") ccdata: any;
  @ViewChild("state_auto") state_auto: MatAutocomplete;
  @ViewChild("Product_auto") Product_auto: MatAutocomplete;
  // @ViewChild('gst_auto') gst_auto: MatAutocomplete
  @ViewChild("branchInput") branchInput: any;
  @ViewChild("branch") branch: MatAutocomplete;
  @ViewChild("bs_auto") bs_auto: MatAutocomplete;
  @ViewChild("cc_auto") cc_auto: MatAutocomplete;
  @ViewChild("creditgls") creditgls: MatAutocomplete;
  @ViewChild("Catagory") Catagory: MatAutocomplete;
  @ViewChild("subcats") subcats: MatAutocomplete;
  @ViewChild("takeInput") takeInput: ElementRef;
  @ViewChild("closepopupApp")closepopupApp:ElementRef
  @ViewChild("closepopup") closepopup: ElementRef;
  @ViewChild("closepopups") closepopups: ElementRef;
  @ViewChild("closepopupdel") closepopupdel: ElementRef;
  @ViewChild("closepopupreverse") closepopupreverse:ElementRef;

  @Input("item") item: any;
  @Input("show") show: any;
  // @Input('appShowToastOnCondition') condition: boolean;
  frs_payment: FormGroup;
  frs_transaction: FormGroup;
  frs_billing: FormGroup;
  frs_Walk_in: FormGroup;
  FileAttachement: FormGroup;
  checked = false;
  isLoading: boolean;
  gst_success_message: any;
  subcat_credit: any;
  // Approve:FormGroup;

  transaction_view: boolean = false;
  billing_view: boolean = false;
  walk_view: boolean = false;
  walkview: boolean = false;
  button_hide: boolean = false;
  GL_ACC: boolean;
  CusType_value: any;
  approve_id: any;
  Approved_indetails_id: any;
  depit_acc: boolean = false;
  payment_list: any;
  transaction_list: any;
  customer_list: any;
  checkbox_hide: boolean=true;
  credit_intrest_rec_Dep:boolean=false;
  currentpage: any = 1;
  has_next: boolean = true;
  has_previous: boolean = true;
  sixteendigit: boolean = true;
  ninedigit: boolean = true;

  // debit_list: any = [
  //   { id: 1, debit: "GL" },
  //   { id: 2, debit: "CASA" },
  // ];
  debit_list:any;
  // creditgl_list=[]
  customer_data: any;
  product_list = [
    { id: 1, product: "GL" },
    { id: 2, product: "CASA" },
  ];
  // bil_list=[]
  branch_code_list: any;
  income_data: any;
  tranempty_data: boolean;
  trancation_datails: any;
  walkin_details: any;
  walkempty_data: boolean;
  billing_details: any;
  billempty_data: boolean;
  view_edit: boolean = true;
  edit_frs_summary: any;
  nav_summary_page: boolean = false;
  edit_frs_screen:boolean=true;
  view_change: boolean = true;
  view_changed = "center_align";
  tran_data: any;
  state_code: any;
  trans_data: any;
  is_approver: boolean = false;
  is_maker: boolean = false;
  Aprovereject = new FormControl("");
  gst_no: any;
  Walinkey: number;
  creditgl_list: any;
  Debit: any;
  customer_type_value: any;
  Product: any;
  Moveto_approver: boolean = false;
  save_btn: boolean = false;
  Approv_rejec: boolean = true;
  payment_lists: any;
  rejected: any;
  movetoapprove: any;
  check: boolean = true;
  reverse: boolean = false;
  bs_details: any;
  cc_details: any;
  bs_has_next: boolean;
  bs_has_previous: any;
  bs_currentpage: any;
  cc_has_next: any;
  cc_has_previous: any;
  cc_currentpage: any;
  readvalue: boolean = false;
  custmor_values_type: any;
  custom: any;
  dab: any;
  product_list_data: any;
  bill_id: any;
  tran_id: any;
  document_view: boolean = false;
  Catagory_list: any;
  retun_data: boolean = false;
  subcats_list: any;
  cat_has_next: boolean;
  cat_has_previous: any;
  cat_currentpage: any;
  subcat_has_next: any;
  subcat_has_previous: any;
  subcat_currentpage: any;
  cat_id: any;
  walkin_data: number;
  check_value: boolean;
  readonly_value: boolean = false;
  Gst_value: boolean = false;
  Gst_amt_hide: boolean = false;
  cbsupload: boolean = false;
  credit_has_next: boolean;
  credit_has_previous: any;
  credit_currentpage: any;
  payment_id: any;
  trans_debit_list: any;
  paymentcharacter: any;
  retun_data_check: any;
  customer_type_readonly:boolean=false;
  debit_readonly:boolean;
  disable_data: boolean;
  currentpagecred: any;
  hascred_previous: any;
  hascred_next: any;
  reverse_return:boolean=false;
  Account_no_hide:boolean=false;
  creditgl_listss: any;
  Approver_approve_data:boolean=false;
  click_not_allow:any;
  Approver_save:boolean=true;
  depit_acc_no:boolean=false;
  produ_bs_cc:boolean=false;
  produ_bs_cc_hide:any
isDisabled:boolean = false;
  code_remars: any;
  page_changes: any;
  query_page: boolean;
  all_btn_hide: boolean;
  email_validation_test: boolean;
  gst_create: boolean;
  account_walkin_based_hide: boolean;
  reverse_branch: any;
  reverse_data_brach_value: any;
  gst_not_valid:any;
  constructor(
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private frsService: FrsServiceService,
    private spinnerservice: NgxSpinnerService,
    private frsshareservice: FrsshareService,
    private sanitizer: DomSanitizer,private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.frs_payment = this.fb.group({
      id: "",
      branchcode: "",
      payment_type: "",
      transtype: "",
      custype: "",
    });
    this.frs_transaction = this.fb.group({
      id: "",
      debitacc: "",
      debitGL: [""],
      creditGL: [""],
      creditGL_name:[""],
      loanfcc: "",
      customertype: "",
      invoiceNum: "",
      gst_address:"",
      gst:"",
      gstin: "",
      states_code: "",
      business_segment: "",
      cc: "",
      Product: [""],
      cat: [""],
      subcat: [""],
      gl: "",
      act_no:"",
    });
    this.frs_billing = this.fb.group({
      id: "",
      // prodtype: "",
      // gstate_code: "",
      billamt: [''],
      gstamt: "",
      totbillamt: "",
      totpay: "",
      narration: "",
    });
    this.frs_Walk_in = this.fb.group({
      id: "",
      cusname: "",
      address: "",
      mobnum:  ['', [Validators.required, Validators.pattern('\\d{10}')]],
      email:  ['', [ Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
    this.FileAttachement = this.fb.group({
      file: "",
    });

    if (typeof this.item === "object") {
      this.view_edit = this.show;
      this.GL_ACC = true;
      this.walkview = true;
      this.frs_edit_value(this.item);
    }
    let cbsstatus = this.frsshareservice.cbs_status.value;
    let data: any = this.frsshareservice.Approvermaker.value;
    let dataset: any = this.frsshareservice.Status_hide.value;
    let brach_data: any = this.frsshareservice.Branch_value.value;
    this.code_remars=this.frsshareservice.summary_code.value;
    this.reverse_data_brach_value=this.frsshareservice.reverse_data_branch.value;
    this.reverse_branch=this.frsshareservice.reverse_api_data.value;
    let branch_list =this.frsshareservice.branch_drop_list.value;
    this.retun_data_check=dataset;
    this.branch_code_list = branch_list
    console.log("brach_data", brach_data,cbsstatus);
    console.log("this.frsshareservice.Approvermaker", data);
    console.log("this.frsshareservice.Approvermaker.value", dataset);
    this.page_changes=this.frsshareservice.query_page.value
    if(this.page_changes=="query"){
      this.reverse = false;
      this.check = false;
      this.is_approver=false;
      this.checkbox_hide=true;
      this.disable_data=true;
      this.produ_bs_cc=true;
      this.click_not_allow="Pending"
      this.Approver_approve_data=true;
      this.credit_intrest_rec_Dep=true;
      this.depit_acc=true;
      this.depit_acc_no=true;
      this.customer_type_readonly=true;
      this.produ_bs_cc_hide="Pending";
      this.Approver_save=true;
    }else{
    

    if (data == "Approver" || data == "Maker-Approver" || data == "Approver-Maker") {
      this.is_approver = true;
      this.save_btn = false;
      this.retun_data = false;
      this.readonly_value = true;
      // this.frs_payment.disable();
      // this.frs_transaction.disable();
      // this.frs_billing.disable();
      // this.frs_Walk_in.disable();
      if (
        dataset == "Approved" ||
        dataset == "Return" ||
        dataset == "Rejected"
      ) {
        this.Approv_rejec = false;
      }

      if (dataset == "Pending") {
        this.Approver_save=false;
        this.click_not_allow="Pending"
        this.check = false;
        this.Approver_approve_data=true;
      this.credit_intrest_rec_Dep=true;
      this.depit_acc=true;
      this.customer_type_readonly=true;
      }
    }
    if (data == "Maker" && dataset == "Return" || data == "Maker-Approver" && dataset == "Return" || data == "Approver-Maker" && dataset == "Return") {
      this.is_maker = true;
      this.Approver_approve_data=false;
      this.credit_intrest_rec_Dep=false;
      this.depit_acc=false;
      this.customer_type_readonly=false;
      // this.document_view=true;
      // this.Moveto_approver = true;
      this.Approv_rejec=false;
      this.is_approver = false;
      this.save_btn = true;
      this.disable_data=false;
    }
    if (data == "Maker" && dataset == "Approved" || data == "Maker-Approver" && dataset == "Approved" || data == "Approver-Maker" && dataset == "Approver") {
      this.reverse = true;      
      this.check = false;
      this.is_approver=false;
      this.checkbox_hide=true;
      this.disable_data=true;
      this.click_not_allow="Pending"
      this.produ_bs_cc_hide="Pending"     
      this.Approver_approve_data=true;
      this.credit_intrest_rec_Dep=true;
      this.depit_acc=true;
      this.depit_acc_no=true;
      this.customer_type_readonly=true;
      this.produ_bs_cc=true;
    }
    if (data == "Approver" && dataset == "Approved" || data == "Maker-Approver" && dataset == "Approved" || data == "Approver-Maker" && dataset == "Approved") {
      this.reverse = true;      
      this.check = false;
      this.is_approver=false;
      this.checkbox_hide=true;
      this.disable_data=true;
      this.click_not_allow="Pending"
      this.produ_bs_cc_hide="Pending"     
      this.Approver_approve_data=true;
      this.credit_intrest_rec_Dep=true;
      this.depit_acc=true;
      this.depit_acc_no=true;
      this.customer_type_readonly=true;
      this.produ_bs_cc=true;
    }
    if (
      (data == "Maker" && dataset == "Pending" ) ||
      (data == "Maker" && dataset == "Reverse Raised") ||
      dataset == "Rejected"
    ) {
      this.check = false;
      this.is_approver=false;    
      this.click_not_allow="Pending"
      this.produ_bs_cc_hide="Pending"     
      this.Approver_approve_data=true;
      this.credit_intrest_rec_Dep=true;
      this.depit_acc=true;
      this.depit_acc_no=true;
      this.customer_type_readonly=true;
      this.produ_bs_cc=true;  
    }
    if (data == "Maker" && dataset == "add" || data == "Maker-Approver" && dataset == "add" || data == "Approver-Maker" && dataset == "add") {
      this.save_btn = true;
      this.document_view = true;
      this.frs_payment.patchValue({
        branchcode: brach_data[0],
      });
    }
    // if (data == "Maker" && dataset == "add" || data == "Maker-Approver" && dataset == "add") {
    
    // }
    if(data == "Maker" && cbsstatus=="Success" && dataset == "Approved" || data == "Maker-Approver" &&  cbsstatus=="Success" && dataset == "Approved" || data == "Approver-Maker" && dataset == "Approved" && cbsstatus=="Success" || data == "Maker-Approver" &&  cbsstatus=="Success" && dataset == "Approved"){
      this.reverse = true;
      this.click_not_allow="Pending"
      this.produ_bs_cc_hide="Pending"     
      this.Approver_approve_data=true;
      this.credit_intrest_rec_Dep=true;
      this.depit_acc=true;
      this.depit_acc_no=true;
      this.customer_type_readonly=true;
      this.produ_bs_cc=true;
    }else{
      this.reverse = false;
    }
    // if(data == "Maker-Approver" && dataset == "Reverse Raised" || data == "Approver-Maker" && dataset=="Reverse Raised" || data == "Approver" && dataset=="Reverse Raised"){
    //   this.reverse_return=false;
    // }
    if(data == "Maker-Approver" && dataset == "Pending" || data == "Approver-Maker" && dataset=="Pending" || data == "Approver" && dataset=="Pending"){
      this.reverse_return=true;
      this.click_not_allow="Pending"
      this.Approver_approve_data=true;
      this.credit_intrest_rec_Dep=true;
      this.depit_acc=true;
      this.depit_acc_no=true;
      this.customer_type_readonly=true;
    }
    if( data == "Maker-Approver" && dataset=="Reverse Approved" || data == "Approver-Maker" && dataset=="Reverse Approved" || data == "Approver" && dataset=="Reverse Approved"){
      this.reverse = false;
      this.check = false;
      this.is_approver=false;
      this.checkbox_hide=true;
      this.disable_data=true;
      this.produ_bs_cc=true;
      this.click_not_allow="Pending"
      this.Approver_approve_data=true;
      this.credit_intrest_rec_Dep=true;
      this.depit_acc=true;
      this.depit_acc_no=true;
      this.customer_type_readonly=true;
      this.produ_bs_cc_hide="Pending"

    }
    let branch_reverse_approved=brach_data[0]    
    if(data == "Maker-Approver" && dataset == "Reverse Raised" || data == "Approver-Maker" && dataset=="Reverse Raised" || data == "Approver" && dataset=="Reverse Raised"){
      let reverse_data_branch =branch_reverse_approved.code
      let found = this.reverse_branch.some((number) => number === reverse_data_branch);      
      if(found === true){
      this.reverse_return=false;
      this.is_approver=true;
      this.check = true;
      this.click_not_allow="Pending"
      this.Approver_approve_data=true;
      this.credit_intrest_rec_Dep=true;
      this.depit_acc=true;
      this.depit_acc_no=true;
      this.customer_type_readonly=true;
      this.produ_bs_cc_hide="Pending"
      this.produ_bs_cc=true;

      }else{
        this.check = false;
        this.is_approver=false;
      }
      
  }

}
    // if(data == "Admin" && dataset == 'Approved' &&  cbsstatus == 'FAILED'){
    //   this.cbsupload=true
    // }
  }
  public branch_code_display(branch_name?: branch): string | undefined {
    return branch_name ? branch_name.name + "-" + branch_name.code : undefined;
  }
  public payment_display(payment_name?: frs): string | undefined {
    return payment_name ? payment_name.name : undefined;
  }
  public transaction_display(transaction_name?: frs): string | undefined {
    return transaction_name ? transaction_name.name : undefined;
  }
  public customer_display(customer_name?: frs): string | undefined {
    return customer_name ? customer_name.name : undefined;
  }
  public creditgl_display(creditgl?: frs): string | undefined {
    return creditgl ? creditgl.gl_no + "-" + creditgl.gl_name : undefined;
  }
  public debit_display(debit?: frs): string | undefined {
    return debit ? debit.name : undefined;
  }
  public cus_display(customer_name?: frs): string | undefined {
    return customer_name ? customer_name.name : undefined;
  }
  public product_display(product_name?: frs): string | undefined {
    return product_name ? product_name.product : undefined;
  }
  public Catagory_display(cat_name?: frs): string | undefined {
    return cat_name ? cat_name.name : undefined;
  }
  public subcats_display(subcat_name?: frs): string | undefined {
    return subcat_name ? subcat_name.name : undefined;
  }
  public display_state(State?: frs): string | undefined {
    return State ? State.name : undefined;
  }
  public display_bs(bs?: frs): string | undefined {
    return bs ? bs.name + "-" + bs.code : undefined;
  }
  public display_cc(CC?: frs): string | undefined {
    return CC ? CC.name : undefined;
  }
  public Product_display(product_name?: frs): string | undefined {
    return product_name ? product_name.name : undefined;
  }
  getbranchcode() {
    this.spinnerService.show();
    this.frsService
      .get_branch()
      .subscribe((results: any[]) => {
        this.spinnerService.hide();
        let datas = results["data"];
        this.branch_code_list = datas;
      });
  }

  // getStyle() {
  //   if (this.view_change === false) {
  //     return {
  // 'padding': '0px 0px 0px 0px', 
  //       'position': 'absolute',
  //       'height': '10vh',
  //       'top': '1px'





  //       // 'padding': '25% 10px 10px 0px',
  //       // 'position': 'absolute',
  //       // 'height': '10vh',
  //       // 'width': '200px',
  //       // 'top': '5px'
  //     };
  //   } else {
    
  //   }
  // }

  naration_input(event){
let value =event.target.value
if(value.length <40){
  // console.log("dgfh",value)
}else{
  this.toastr.warning("","Narration Allowed Only 40 Letter")
  // console.log("dgfdfhgjghjh",value)
}

  }


  debit_gl_type() {
    // if(this.frs_payment.value.transtype== "" || this.frs_payment.value.transtype==null || this.frs_payment.value.transtype==undefined){
    //   this.toastr.warning("","Please Select Transaction Type")
    //   return false
    // }
    // this.frs_transaction.get("debitacc").reset();
    // this.frs_transaction.get("debitGL").reset();
    this.spinnerService.show();
    this.frsService
      .debit_gl_type()
      .subscribe((results: any[]) => {
        this.spinnerService.hide();
        let datas = results["data"];
        this.debit_list = datas;
      });
  }

  autocompletebranchcodeScroll() {
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1;
    setTimeout(() => {
      if (this.branch && this.autocompleteTrigger && this.branch.panel) {
        fromEvent(this.branch.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.branch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.branch.panel.nativeElement.scrollTop;
            const scrollHeight = this.branch.panel.nativeElement.scrollHeight;
            const elementHeight = this.branch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.frsService
                  .get_branch_code(
                    this.branchInput.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branch_code_list = this.branch_code_list.concat(datas);
                    if (this.branch_code_list.length >= 0) {
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
  payment_type() {
    // this.frs_transaction.controls['creditGL'].reset()
    // this.frs_payment.get("transtype").reset();
    // this.frs_payment.get("custype").reset();
    // this.frs_transaction.get("debitacc").reset();
    // this.frs_transaction.get("debitGL").reset();
    // this.frs_transaction.get("customertype").reset();
    // this.frs_transaction.get("gstin").reset();
    // this.frs_transaction.get("creditGL").reset();
    // this.frs_transaction.get("creditGL_name").reset();
    // this.frs_transaction.get("cat").reset();
    // this.frs_transaction.get("subcat").reset();
    // this.frs_billing.get("billamt").reset();
    // // this.frs_transaction.get("Product").reset();
    // this.frs_billing.get("gstamt").reset();
    // this.frs_billing.get("totbillamt").reset();
    // this.frs_billing.get("totpay").reset();
    this.spinnerService.show();
    this.frsService.get_payment_type().subscribe((results) => {
      let data = results["data"];
      this.spinnerService.hide();
      this.payment_lists = data;
    });
    this.debit_gl_type()
  }

  payment_datas(event) {    
    // console.log("event", event);
    this.frs_transaction.controls['creditGL'].reset()
    this.frs_payment.get("transtype").reset();
    this.frs_payment.get("custype").reset();
    this.frs_transaction.get("debitacc").reset();
    this.frs_transaction.get("debitGL").reset();
    this.frs_transaction.get("customertype").reset();
    this.frs_transaction.get("gstin").reset();
    this.frs_transaction.get("creditGL").reset();
    this.frs_transaction.get("creditGL_name").reset();
    this.frs_transaction.get("cat").reset();
    this.frs_transaction.get("subcat").reset();
    this.frs_billing.get("billamt").reset();
    // this.frs_transaction.get("Product").reset();
    this.frs_billing.get("gstamt").reset();
    this.frs_billing.get("totbillamt").reset();
    this.frs_billing.get("totpay").reset();
    let paymenyty = event;
    // console.log("payjhdgmgjk", paymenyty);
    this.paymentcharacter = paymenyty.name;
    // console.log("this.paymentcharacter", this.paymentcharacter);
    if (paymenyty.id == 2 || paymenyty.id == 3) {
      // this.Gst_value=true;
      this.Gst_amt_hide = true;
    } else {
      // this.Gst_value=false
      this.Gst_amt_hide = false;
    }
    if(paymenyty.id==2 || paymenyty.id==3){
      this.credit_intrest_rec_Dep=true;
      this.creditgl_income()
    }else{
      this.frs_transaction.get("creditGL").reset();
    this.frs_transaction.get("creditGL_name").reset();
    this.frs_transaction.get("cat").reset();
    this.frs_transaction.get("subcat").reset();
      this.credit_intrest_rec_Dep=false;
    }
  //   if(paymenyty.id == 2){
  //     this.credit_intrest_rec_Dep=true
  //     let creadit_value ={
  //       "gl_name":"INTEREST PAID ON OTHERS",
  //       "gl_no":"421200300",
  //       "Cd_name":"INTEREST PAID ON OTHERS",
  //       "id": 2431
  //     }
  //     let cat={
  //       "name":"INT PAID DEP"
  //     }
  //     let subcat={
  //       "name":"180 JAN DHAN YOJ"
  //     }
  // this.frs_transaction.patchValue({
  // creditGL:creadit_value,
  // creditGL_name:creadit_value.Cd_name,
  // cat:cat,
  // subcat:subcat
  // })

    // }else{
    //   this.frs_transaction.get("creditGL").reset();
    //   this.frs_transaction.get("creditGL_name").reset();
    //   this.frs_transaction.get("cat").reset();
    //   this.frs_transaction.get("subcat").reset();
    //   this.credit_intrest_rec_Dep=false;
    // }
  }
  payment_data(a) {
    // this.debit_list=[]
  
    // console.log("a", a);
    // console.log("this.frs_transaction.getreset();");
    this.frs_transaction.get("debitGL").reset();
    // this.frs_transaction.get("debitacc").reset();
    this.frs_transaction.get("debitacc").reset();
    this.frs_transaction.get("customertype").reset();
    this.frs_transaction.get("act_no").reset();
    this.frs_transaction.get("gstin").reset();
    this.frs_payment.get("custype").reset();
    this.frs_transaction.get("gst").reset();
    this.frs_transaction.get("gst_address").reset();
    
    let customer = a.customer_type[0];
    let customers = a.customer_type;
    if(this.frs_payment.value.payment_type?.id!=1 && a.name == "Cash"){
      customers.pop()
    }
    // console.log("customer", customer.name);
    // console.log("customers", customers);
    if (a.name == "GL" || a.name == "Cash") {
      this.customer_type_readonly=false;
      this.frs_payment.get("custype").reset();
      this.frs_transaction.get("debitacc").reset();
      this.frs_transaction.get("debitGL").reset();
      this.frs_transaction.get("gst").reset();
    this.frs_transaction.get("gst_address").reset();
    this.frs_Walk_in.get("cusname").reset()
      if(this.frs_payment.value.payment_type?.name == "Interest Recovery on Deposit" || this.frs_payment.value.payment_type?.name == "Interest Recovery on Advances"){     
      this.frs_transaction.get("Product").reset();
      this.frs_transaction.get("business_segment").reset();
      this.frs_transaction.get("cc").reset()

      }else{
        this.frs_transaction.get("creditGL").reset();
        this.frs_transaction.get("creditGL_name").reset();
        this.frs_transaction.get("Product").reset();
      this.frs_transaction.get("business_segment").reset();
      this.frs_transaction.get("cc").reset();
      this.frs_transaction.get("gst").reset();
    this.frs_transaction.get("gst_address").reset();
      }
      this.customer_list = customers;
      this.depit_acc = false;  
      
      // this.readvalue=false
    } else {
      // this.customer_list=[]
      this.custom = customers.length;
      if (this.custom == 1) {
      
      }      
 
      // console.log("customers", this.custom);
      if(a.name == "Transfer"){
      this.frs_payment.patchValue({
        custype: customer,
      });
    }
      // this.checkbox_hide=false;
      // this.readvalue= false
      if(a.name == "Transfer" && customer.name == "Existing Customer"){
        this.dab = [];
        this.Account_no_hide=true;
        this.account_walkin_based_hide=false;
        // console.log("dab", this.dab);
        let debits = this.debit_list[1];
        // console.log("this.debit_list[1];",this.debit_list[1])
        this.is_approver = false;
        this.walkview = false;
        this.check=true
        this.checkbox_hide = true;
        this.customer_type_readonly=true;
        // this.checkbox_hide = false;.       
        this.frs_transaction.patchValue({
          debitacc: debits,
        });
        this.depit_acc = true;
        this.depit_acc_no=false;
      }
      if (a.name == "Cash" && customer.name == "Existing Customer") {
      
        this.dab = [];
        // console.log("dab", this.dab);
        let debits = this.debit_list[0];
        // console.log("this.debit_list[1];",this.debit_list[1])
        this.is_approver = false;
        this.walkview = false;
        this.check=true
        this.checkbox_hide = true;
        this.customer_type_readonly=true;
        // this.checkbox_hide = false;.       
        this.frs_transaction.patchValue({
          debitacc: debits,
        });
        this.depit_acc = true;
      }

    }
    if (customer.name == "Walkin Customer" || customer?.id === 4) {
      this.customer_type_readonly=true;
      this.walkview = true;
      this.depit_acc = false;     
      // this.customer_list=[]
      this.is_approver = true;
      this.check=true
      this.checkbox_hide=false;
      this.frs_transaction.get("debitacc").reset();
      this.frs_transaction.get("debitGL").reset();

    }
    // this.customer_type_readonly=true;
    // console.log("this.levels dab", this.dab);
    // console.log("this.debit_list.debit", debits.debit);

    // console.log(
    //   "this.transaction_list.customer_type",
    //   this.transaction_list.customer_type
    // );

    // console.log("abcd", a.customer_type[0]);
    // this.checkbox_hide = false;
    // if (a.source.value.name == "Cash") {
    //   this.checkbox_hide = true;
    //   this.transdebit_gl();
    // }

  }
    transcation_type(transaction) {
      this.check_value=false;  
    this.spinnerService.show();
    this.frsService.get_transcation_type().subscribe((results) => {
      this.spinnerService.hide();
      let data = results["data"];
      this.transaction_list = data;
      this.readvalue = true;
    
      // console.log("this.transaction_list", this.transaction_list[0]);
      // this.frs_payment.get('custype').reset()
      //       if(this.transaction_list[0].name == 'Cash'){
      // this.transdebit_gl()
      //       }
    });
this.debit_gl_type()
    // console.log("trans_data jkhgu", transaction.transtype);
    // this.frs_payment.get('custype').reset()
    // this.frs_payment.get('custype').reset()
    // if(transaction.transtype != ''){
    // let customer = transaction.transtype.customer_type[0];

    // if (
    //   transaction.transtype.name == "Cash" ||
    //   transaction.transtype.name == "Transfer"
    // ) {
    //   this.frs_payment.patchValue({
    //     custype: customer,
    //   });
    // } else {
    //   if (transaction.transtype.name == "GL") {
    //     this.customer_list = transaction.transtype.customer_type;
    //   }

    // console.log(
    //   "this.transaction_list.customer_typessss",
    //   this.transaction_list
    // );

    this.walkview = false;
    // }
  }

  transdebit_gl() {
    // let debit = values
    // console.log("debit",debit)
    this.frs_transaction.get("customertype").reset();
    this.frs_transaction.get("gstin").reset();
    // this.checkbox_hide=true
    if(this.frs_payment.value.transtype=="" || this.frs_payment.value.transtype == null || this.frs_payment.value.transtype==undefined){
      this.toastr.warning("","Please Select Transaction Type")
      return false
    }
    if(this.frs_transaction.value.debitacc?.name =='GL'&& this.frs_payment.value.transtype?.name =='GL'){     
      
      }else{
        let trans_id = this.frs_payment.value.transtype.id
        this.spinnerService.show();
        this.frsService.get_trans_debit(trans_id).subscribe((results) => {
          this.spinnerService.hide();
          let data = results['data'];
          this.trans_debit_list = data[0];
          console.log("this.trans_debit_list", this.trans_debit_list);
          this.frs_transaction.patchValue({
            debitGL: this.trans_debit_list.glno,
          });
        });
      }

  }
  only_nummber(event) {
    // const charCode = event.which ? event.which : event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //   return false;
    // }
    // return true;   
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  // only_number(event){
  //   var charCode = (event.which) ? event.which : event.keyCode;
  // if (charCode != 46 && charCode > 31
  //   && (charCode < 48 || charCode > 57)) {
  //   event.preventDefault();

  
  //   return false;
  // }
  // return true;
  // }
  
  frs_Gl(frs_data) {
    if (frs_data.value.transtype.name == "GL") {
      this.GL_ACC = true;
    } else {
      this.GL_ACC = false;
      this.frs_transaction.reset();
    }
    this.button_hide = true;
  }
//   frs_Walkin(frs_data) {
//     this.frs_transaction.get("debitacc").reset();
//     this.frs_transaction.get("debitGL").reset();
//     this.frs_transaction.get("customertype").reset();
//     this.frs_transaction.get("gstin").reset();
//     // if(frs_data.value.custype)
//     // console.log("frsdhgjnfkmhji", frs_data.custype.name);
//     let debits = this.debit_list[0];
//     // console.log(" this.debit_list[1]", this.debit_list, debits);
//     if (frs_data.transtype?.name=="Cash"  &&  frs_data.custype.name == "Existing Customer") {      
//       this.dab = [];
//       this.is_approver = false;
//         this.check=true
//       this.checkbox_hide=true;
//       this.frs_transaction.patchValue({
//         debitacc: debits,
//       });
//       this.depit_acc = true;
//     }
//     let debit_gl_value={"name":"GL","id":1}
//     let debitgl=270006250
// if(frs_data.custype.id ==3){
//   this.depit_acc = true;
//   this.frs_transaction.patchValue({
//     debitacc: debit_gl_value,
//     debitGL:debitgl
//   });  
// }

//     if (frs_data.custype.name == "Walkin Customer" || frs_data.custype?.id === 4) {     
//       this.walkview = true;
//       this.Account_no_hide=true;
//       this.depit_acc = false;
//       this.is_approver = true;
//       this.check=true
//     this.checkbox_hide=false;
//     } else {
//       this.walkview = false;
//       this.frs_Walk_in.reset();
//     }
//     this.button_hide = true;
//   }
  frs_view() {
    this.check_value = false;
    // this.frs_payment.reset("");
    this.file_data=[]
    this.FileAttachement.get("file")?.reset();
    this.frs_payment.get("payment_type").reset();
    this.frs_payment.get("transtype").reset();
    this.frs_payment.get("custype").reset();
    this.frs_Walk_in.reset("");
    this.frs_billing.reset("");
    this.frs_transaction.reset("");
    // this.takeInput.nativeElement.value = '';
  }
  customer_type_dd(select){

    this.frs_transaction.get("debitacc").reset();
    this.frs_transaction.get("debitGL").reset();
    this.frs_transaction.get("customertype").reset();
    this.frs_transaction.get("gstin").reset();
    // if(frs_data.value.custype)
    // console.log("frsdhgjnfkmhji", frs_data.custype.name);
    let debits = this.debit_list[0];
    // console.log(" this.debit_list[1]", this.debit_list, debits);
    if (this.frs_payment.value.transtype?.name=="Cash"  &&  select.name == "Existing Customer") {      
      this.dab = [];
      this.is_approver = false;
        this.check=true
      this.checkbox_hide=true;
      this.frs_transaction.patchValue({
        debitacc: debits,
      });
      this.depit_acc = true;
    }
    let debit_gl_value={"name":"GL","id":1}
    let debitgl=270006250
if(select?.id ==3){
  this.depit_acc = true;
  this.frs_transaction.patchValue({
    debitacc: debit_gl_value,
    debitGL:debitgl
  });  
}

    if (select.name == "Walkin Customer" || select?.id === 4) {     
      this.walkview = true;
      this.Account_no_hide=true;
      this.depit_acc = false;
      this.is_approver = true;
      this.check=true
    this.checkbox_hide=false;
    } else {
      this.walkview = false;
      this.frs_Walk_in.reset();
    }
    this.button_hide = true;
    if(this.frs_Walk_in.value.cusname === Object ){
      this.frs_Walk_in.get("cusname").reset();
    }
   if(this.frs_transaction.value.gst === "" || this.frs_transaction.value.gst === null || this.frs_transaction.value.gst === undefined){
    
   }else{
    this.frs_transaction.get("gst").reset();
   }
   if(this.frs_transaction.value.gst_address === "" || this.frs_transaction.value.gst_address === null || this.frs_transaction.value.gst_address === undefined){
      }else{
        this.frs_transaction.get("gst_address").reset();
      }
   if(this.frs_Walk_in.value.email === "" || this.frs_Walk_in.value.email === null || this.frs_Walk_in.value.email === undefined){
       }else{
        this.frs_Walk_in.get("email").reset();
       }
       if(this.frs_Walk_in.value.mobnum === "" || this.frs_Walk_in.value.mobnum === null || this.frs_Walk_in.value.mobnum === undefined){
      }else{
       this.frs_Walk_in.get("mobnum").reset();
      }
if(this.frs_payment.value.transtype.name == "Cash" && select.name=="Existing Customer" ){
  this.Account_no_hide=false;
  this.account_walkin_based_hide=false;
  this.depit_acc = true;
  this.depit_acc_no=true;
  let debits = this.debit_list[0];
  this.frs_transaction.patchValue({
    debitacc: debits,
  });
  this.transdebit_gl() 
}
if(this.frs_payment.value.transtype.name == "Cash" && select.name=="Existing Customer(Loan FCC)"|| this.frs_payment.value.transtype.name == "GL" && select.name=="Existing Customer(Loan FCC)"){
  this.Account_no_hide=false;
  this.depit_acc_no=true;
  this.account_walkin_based_hide=false;
  let debit_gl_value={"name":"GL","id":1}
  let debitgl=270006250

this.depit_acc = true;
this.frs_transaction.patchValue({
  debitacc: debit_gl_value,
  debitGL:debitgl
})

}
if(this.frs_payment.value.transtype.name == "Cash" && select.name=="Walkin Customer" || this.frs_payment.value.transtype.name == "Cash" && select.id==4){
  this.depit_acc=true;
  this.Account_no_hide=true;
  this.account_walkin_based_hide=true;
  this.depit_acc_no=true;
  let debits = this.debit_list[0];
  this.frs_transaction.patchValue({
    debitacc: debits,
  });

  this.transdebit_gl() 
}
if(this.frs_payment.value.transtype.name == "Transfer" && select.name=="Existing Customer" || this.frs_payment.value.transtype.name == "Transfer" && select.name=="Walkin Customer" || this.frs_payment.value.transtype.name == "Transfer" && select.name=="Existing Customer(Loan FCC)" ){
  this.Account_no_hide=true
  this.account_walkin_based_hide=false;
}
if(this.frs_payment.value.transtype.name == "GL" && select.name=="Existing Customer"|| this.frs_payment.value.transtype.name == "GL" && select.name=="Walkin Customer"){
  let debits = this.debit_list[0];
  this.frs_transaction.patchValue({
    debitacc: debits,
  });
  this.depit_acc=true;
  this.depit_acc_no=true;
this.frs_transaction.patchValue({
  debitGL: "275300110",
});
}

if(this.frs_payment.value.transtype.name == "GL" && select.name=="Existing Customer"){
  this.account_walkin_based_hide=false;
}

if(select?.id === 4){
  this.gst_create=false
}else{
  this.gst_create=true
}

  }

  frs_edit_value(summary_val) {
    this.edit_frs_summary = summary_val;
    let val = {
      id: summary_val.id,
    };
    this.spinnerService.show();
    this.frsService
      .frs_info(val, "income")
      .then((res) => {
        this.spinnerService.hide();
        this.income_data = res;
        this.customer_type_value = this.income_data.customer_type;
        // console.log("this.income_data", this.income_data.customer_type);
        this.frs_details(summary_val, false);
      })
      .catch((error) => {
        this.transaction_view = false;
        this.billing_view = false;
        this.walk_view = false;
        this.frs_edit_reset();
      });

    this.frs_payment.patchValue({
      id: summary_val.id,
      branchcode:
        summary_val.branch == null
          ? ""
          : typeof summary_val.branch === "object"
          ? summary_val.branch
          : "--",
      payment_type:
        summary_val.payment_type != null
          ? typeof summary_val.payment_type === "object"
            ? summary_val.payment_type
            : "--"
          : "--",
      transtype:
        summary_val.transaction_type != null
          ? typeof summary_val.transaction_type === "object"
            ? summary_val.transaction_type
            : "--"
          : "--",

      custype:
        summary_val.customer_type != null
          ? typeof summary_val.customer_type === "object"
            ? summary_val.customer_type
            : "--"
          : "--",
    });    
    if (summary_val.transaction_type.id == 1 || summary_val.transaction_type.id == 3) {
      this.checkbox_hide = false;

    } else {
      this.checkbox_hide = true;
    }
    if (summary_val.payment_type.id == 2 || summary_val.payment_type.id == 3) {
      this.Gst_amt_hide = true;
    } else {
      this.Gst_amt_hide = false;
    }
    if (summary_val.transaction_type.id == 1 || summary_val.transaction_type.id == 2) {
      this.customer_type_readonly=true

    } else {
      this.customer_type_readonly= false;
    }
   
    console.log("comduiwtgfywhgytfegyfeytfgytrtgh", summary_val.customer_type);
    // if(this.income_data.customer_type.name == 'Walkin Customer'){

    // }
  }
  async frs_details(frsdetails, display = true) {
    this.spinnerService.show();
    if (frsdetails.customer_type?.name == "Walkin Customer" || frsdetails.customer_type?.id === 4) {
      this.walkview = true;
      this.account_walkin_based_hide=true;
    }
    this.walkview = false;
    this.readvalue = true;
    // let tran_id: any = "";
    // this.bill_id: any = "";
    if(frsdetails.customer_type?.id === 4){
    this.gst_create=false
    }else{
      this.gst_create=true
    }

    let transac = {
      incomedetails: frsdetails.id,
    };
  
    await this.frsService
      .frs_info(transac, "trancation")
      .then((res: any) => {      
        let data = res;
        this.tran_id = data.id;
        console.log("this.tran_id = data.id;",this.tran_id)
        if (data.length != 0) {       
          this.transaction_view = true;          
          console.log("state_value", data);
          console.log("transac,trancation", this.trancation_datails);
         if( this.income_data?.transaction_type?.name== "Cash" && this.income_data?.customer_type?.name=="Existing Customer" ||  this.income_data?.transaction_type?.name== "Cash" && this.income_data?.customer_type?.name=="Existing Customer(Loan FCC)"){
             this.Account_no_hide=false
         }else{
          this.Account_no_hide=true
         }

          this.frs_transaction.patchValue({
            id: data.id,
            debitacc:data.debitaccount_type != null ? data.debitaccount_type : "",
            debitGL: data.debit_gl != null ? data.debit_gl : "",
            creditGL: data.credit_gl != null ? data.credit_gl : "",
            creditGL_name:data.credit_gl.gl_name != null ? data.credit_gl.gl_name : "",
            act_no: data.account_no != null ? data.account_no : "",
            customertype:data.debitaccount_title != null ? data.debitaccount_title : "",
            invoiceNum: data.invoice_no != null ? data.invoice_no : "",
            gst: data.gst != null ? data.gst : "",
            gst_address: data.gst_address != null ? data.gst_address : "",
            gstin: data.gstin != null ? data.gstin : "",
            states_code:
              data.state_code != null &&
              Object.keys(data.state_code).length != 0
                ? data.state_code
                : "",
            business_segment:
              data.bs_code != null && Object.keys(data.bs_code).length !== 0
                ? data.bs_code
                : "",
            cc:
              data.cc_code != null && Object.keys(data.cc_code).length !== 0
                ? data.cc_code
                : "",
            Product: data.businessproduct != null ? data.businessproduct : "",
            cat:
              data.apcat != null || Object.keys(data.apcat).length !== 0
                ? data.apcat
                : "",
            subcat:
              data.apsub_cat != null || Object.keys(data.apsub_cat).length !== 0
                ? data.apsub_cat
                : "",
            gl: data.apsub_cat.glno != null ? data.apsub_cat.glno : "",
          });
          console.log("data.id", data.id);
          // this.frs_billing_edit(frsdetails, display = true)
        } else {
          this.transaction_view = false;
          this.billing_view = false;
          this.walk_view = false;
          this.billing_details = "";
          this.walkin_details = "";
          this.trancation_datails = "";
          // this.toastr.warning('','No Data Found..',{timeOut:1500})state_value.name != null ? state_value.name : ''
          this.frs_edit_reset();
          return false;
        }
      })
      .catch((error) => {
        this.transaction_view = false;
        this.billing_view = false;
        this.walk_view = false;
        this.billing_details = "";
        this.walkin_details = "";
        this.trancation_datails = "";
        this.frs_edit_reset();
      });

    // frs_billing_edit(frsdetails, display = true){
    if (this.transaction_view) {
      let billing = {
        transactiontype: this.tran_id,
      };
      console.log("billingdatasfdh", billing);

      await this.frsService
        .frs_info(billing, "billingdetails")
        .then((bill: any) => {
      
          let data = bill;
          if (data != 0) {
            this.bill_id = data;
            let depitGl = this.bill_id.product_type;
            // console.log("bill_id=data[0];", depitGl);
            if (depitGl == 1) {
              this.Product = this.product_list[0];
            } else {
              this.Product = this.product_list[1];
            }
            this.billing_details = data;
            this.billing_view = true;
            this.frs_billing.patchValue({
              id: this.bill_id.id,
              // prodtype: this.Product != null ? this.Product : "",
              // gstate_code: this.bill_id.gst_code != null ? this.bill_id.gst_code : "",
              billamt:
                this.bill_id.billamount_gst != null
                  ? this.bill_id.billamount_gst
                  : "",
              gstamt:
                this.bill_id.gst_amount != null ? this.bill_id.gst_amount : "",
              totbillamt:
                this.bill_id.totalbill_amount != null
                  ? this.bill_id.totalbill_amount
                  : "",
              totpay:
                this.bill_id.totalamount_pr != null
                  ? this.bill_id.totalamount_pr
                  : "",
              narration:
                this.bill_id.narration != null ? this.bill_id.narration : "",
            });           
            
            // this.frswalkin_edit(frsdetails, display = true)
          } else {
            this.billing_view = false;
            this.walk_view = false;
            this.walkin_details = "";
            this.billing_details = "";
            // this.toastr.warning('','No Data Found..',{timeOut:1500})
            this.frs_edit_reset();
            return false;
          }
        })
        .catch((error) => {
          this.billing_view = false;
          this.walk_view = false;
          this.walkin_details = "";
          this.billing_details = "";
          this.frs_edit_reset();
        });
    }

    // frswalkin_edit(frsdetails, display = true){
    if (this.billing_view) {
      let walk = {
        billingdetails: this.bill_id.id,
      };
      // this.walkview=false

      await this.frsService
        .frs_info(walk, "walkin")
        .then((walking: any) => {
        
          let val = walking;
          this.approve_id = val;
          // console.log("valuesinthe datas", this.approve_id);
          // console.log("valuesinthe datas", val);
          if (this.income_data.customer_type.name == "Walkin Customer" ||  this.income_data.customer_type?.id === 4) {
            this.walkview = true;
            // if (val != 0) {
            // let data=val
            this.walkin_details = val;
            this.walk_view = true;
            // this.walkview=true
            this.frs_Walk_in.patchValue({
              id: val.id,
              cusname: val.customer_name != null ? val.customer_name : "",
              address: val.address != null ? val.address : "",
              mobnum: val.mobile_number != null ? val.mobile_number : "",
              email: val.email != null ? val.email : "",
            });
            this.spinnerService.hide();
            // console.log("cusname: val.customer_name ", val.customer_name);
            // } else {
            this.walk_view = false;
            // this.walkin_details = "";
            // this.toastr.warning('','No Data Found..',{timeOut:1500})
            // this.frs_edit_reset("frs_Walk_in");
            return false;
            // }
          }
          // this.walkview = false;
        })
        .catch((error) => {
          this.walk_view = false;
          this.walkview = false;
          this.walkin_details = "";
          this.frs_edit_reset();
        });
    }
  }
  appr(){
    let value=this.bill_id.narration
    console.log("value",value)
  
    this.Aprovereject.setValue(this.bill_id.narration)   
  }

  frs_edit_reset() {
    this.check_value = false;
    this.frs_Walk_in.reset("");
    this.frs_billing.reset("");
    this.file_data=[]
    this.FileAttachement.get("file")?.reset();
    this.frs_transaction.reset("");
    this.frs_payment.get("payment_type").reset();
    this.frs_payment.get("transtype").reset();
    this.frs_payment.get("custype").reset();  
  }
 
  frs_edit(payment, trasaction, billing, walkin) {
   
    if (
      payment.payment_type == undefined ||
      payment.payment_type == null ||
      payment.payment_type == ""
    ) {
      this.toastr.warning("", "Please  Enter Payment Type", { timeOut: 1500 });
      return false;
    }
    if (
      payment.transtype == undefined ||
      payment.transtype == null ||
      payment.transtype == ""
    ) {
      this.toastr.warning("", "Please  Enter Transaction Type", { timeOut: 1500 });
      return false;
    }
    if (
      payment.custype == undefined ||
      payment.custype == null ||
      payment.custype == ""
    ) {
      this.toastr.warning("", "Please  Enter Customer Type", { timeOut: 1500 });
      return false;
    }
    if(trasaction.debitacc == "" || trasaction.debitacc == null || trasaction.debitacc == undefined ){
      this.toastr.warning("", "Please  Enter Debit Account Type", { timeOut: 1500 });
        return false;
    }
    
      if (
        trasaction.debitGL == undefined ||
        trasaction.debitGL == null ||
        trasaction.debitGL == ""
      ) {
        this.toastr.warning("", "Please  Enter DebiteGl", { timeOut: 1500 });
        return false;
      }
      
      
      if(this.frs_payment.value.transtype.name == "Cash" && this.frs_payment.value.custype.name=="Existing Customer" || this.frs_payment.value.transtype.name == "Cash" && this.frs_payment.value.custype.name=="Existing Customer(Loan FCC)"){
        if (
          trasaction.act_no != undefined &&
          trasaction.act_no != null &&
          trasaction.act_no != ""
        ) {         
        
        if (trasaction.act_no.length < 16) {
          this.toastr.warning(
            "",
            "Please Enter  Valid 16 Digit  Account  No",
            {
              timeOut: 1500,
            }
          );
          return false;
        }
        }
      }else{
      if (trasaction.debitGL.id == 2 ) {
        this.checkbox_hide=false;
      }else{
        this.checkbox_hide=true
      }
      if (trasaction.debitacc.id == 2) {
        if (trasaction.debitGL.length < 16) {
          this.toastr.warning(
            "",
            "Please Enter  Valid 16 Digit DebitGL Account  No",
            {
              timeOut: 1500,
            }
          );
          return false;
        }
      }
      if (payment.transtype.id == 2) {
      if (trasaction.debitGL.length < 16) {
        this.toastr.warning(
          "",
          "Please Enter  Valid 16 Digit DebitGL Account  No",
          {
            timeOut: 1500,
          }
        );
        return false;
      }
    }
  }
  if(trasaction.gst ==="" || trasaction.gst ===null || trasaction.gst===undefined){
 
}else{
  if(payment.custype?.id == "4"){
    if(trasaction.gst.length < 15){
      this.toastr.warning("","Please Enter The Valid GST No",{timeOut: 1500,});
      return false;
    }
  }
  if(this.gst_not_valid==="NOT GST"){
    this.toastr.warning("","Please Enter The Valid GST No",{timeOut: 1500,});
    return false;
  }
}
    if (
      trasaction.creditGL == undefined ||
      trasaction.creditGL == null ||
      trasaction.creditGL == ""
    ) {
      this.toastr.warning("", "Please  Select Creadit GL", { timeOut: 1500 });
      return false;
    }
    if (
      trasaction.Product == undefined ||
      trasaction.Product == null ||
      trasaction.Product == ""
    ) {
      this.toastr.warning("", "Please  Select Product", { timeOut: 1500 });
      return false;
    }
    // if (
    //   trasaction.cat == undefined ||
    //   trasaction.cat == null ||
    //   trasaction.cat == ""
      
    // ) {
    //   this.toastr.warning("", "Please  Enter Catagory", { timeOut: 1500 });
    //   return false;
    // }
    // if (
    //   trasaction.subcat == undefined ||
    //   trasaction.subcat == null ||
    //   trasaction.subcat == ""
    // ) {
    //   this.toastr.warning("", "Please  Enter SubCatagory", { timeOut: 1500 });
    //   return false;
    // }
    if (
      trasaction.business_segment == undefined ||
      trasaction.business_segment == null ||
      trasaction.business_segment == ""
    ) {
      this.toastr.warning("", "Please  Enter BS", { timeOut: 1500 });
      return false;
    }
    if (
      trasaction.cc == undefined ||
      trasaction.cc == null ||
      trasaction.cc == ""
    ) {
      this.toastr.warning("", "Please  Enter CC", { timeOut: 1500 });
      return false;
    }

    if (
      payment.payment_type.name == "CustomerServiceCharge" ||
      payment.payment_type.name == "Non FA scrapsale"
    ) {
      if (
        billing.billamt == undefined ||
        billing.billamt == null ||
        billing.billamt == ""
      ) {
        this.toastr.warning("", "Please  Enter BillAmt", { timeOut: 1500 });
        return false;
      }
      if (
        billing.gstamt == undefined ||
        billing.gstamt == null ||
        billing.gstamt == ""
      ) {
        this.toastr.warning("", "Please  Enter GST AMt", { timeOut: 1500 });
        return false;
      }
      if (
        billing.totbillamt == undefined ||
        billing.totbillamt == null ||
        billing.totbillamt == ""
      ) {
        this.toastr.warning("", "Please  Enter Total Bill Amount", {
          timeOut: 1500,
        });
        return false;
      }
    }
    // if (payment.transtype.name == "Cash") {
    //   if (billing.totpay > 10000) {
    //     this.toastr.warning("", "The Bill Amount Should Be Less Then 10000", {
    //       timeOut: 1500,
    //     });
    //     return false;
    //   }
    // }
    if (
      billing.totpay == undefined ||
      billing.totpay == null ||
      billing.totpay == ""
    ) {
      this.toastr.warning("", "Please  Enter Total Amount Payable/Receivable", {
        timeOut: 1500,
      });
      return false;
    }
    if (
      billing.narration == undefined ||
      billing.narration == null ||
      billing.narration == ""
    ) {
      this.toastr.warning("", "Please  Enter Narration", { timeOut: 1500 });
      return false;
    }
    if (payment.custype.name == "Walkin Customer") {
      if (
        walkin.cusname == undefined ||
        walkin.cusname == null ||
        walkin.cusname == ""
      ) {
        this.toastr.warning("", "Please  Enter Customer Name", { timeOut: 1500 });
        return false;
      }
      if (
        walkin.address == undefined ||
        walkin.address == null ||
        walkin.address == ""
      ) {
        this.toastr.warning("", "Please  Enter Address", { timeOut: 1500 });
        return false;
      }    
      if (
        walkin.mobnum == undefined ||
        walkin.mobnum == null ||
        walkin.mobnum == ""
      ) {
        this.toastr.warning("", "Please  Enter Mobile Number", {
          timeOut: 1500,
        });
        return false;
      }
      if (walkin.mobnum.length < 10) {
        this.toastr.warning("", "Please  Enter Valid Mobile Number", {
          timeOut: 1500,
        });
        return false;
      }
      if(payment.custype?.id ==='4'){
        if (
          walkin.mobnum == undefined ||
          walkin.mobnum == null ||
          walkin.mobnum == ""
        ) {
          this.toastr.warning("", "Please  Enter Mobile Number", {
            timeOut: 1500,
          });
          return false;
        }
        if (walkin.mobnum.length < 10) {
          this.toastr.warning("", "Please  Enter Valid Mobile Number", {
            timeOut: 1500,
          });
          return false;
        } 
      if (
        walkin.email == undefined ||
        walkin.email == null ||
        walkin.email == ""
      ) {
        this.toastr.warning("", "Please  Enter Email", { timeOut: 1500 });
        return false;
      }
      if(this.email_validation_test === false){
        this.toastr.warning("", "Please  Enter the Valid Email", { timeOut: 1500 });
        return false;
      }
    }
    if(walkin.email =="" || walkin.email == undefined || walkin.email == null){

    }else{
     if(this.email_validation_test === false){
      this.toastr.warning("", "Please  Enter the Valid Email", { timeOut: 1500 });
      return false;
    }
  }
    }
    this.walkin_data = 0;
    if (payment.custype.name == "Walkin Customer" || payment.custype?.id == 4) {
      this.walkin_data = 1;
    }
    // if(payment.payment_type.name == "Non FA scrapsale"){
    //   if ( trasaction.invoiceNum == undefined || trasaction.invoiceNum == null || trasaction.invoiceNum == "" ) {
    //       this.toastr.warning("", "Please  Enter Invoice Number", { timeOut: 1500 });
    //       return false;
    //     }
    // }

    let param = {
      branch_id:
        payment.branchcode != null || payment.branchcode != undefined
          ? typeof payment.branchcode == "object"
            ? payment.branchcode.id
            : ""
          : "",
      payment_type:
        payment.payment_type != null || payment.payment_type != undefined
          ? typeof payment.payment_type == "object"
            ? payment.payment_type.id
            : ""
          : "",
      transaction_type:
        payment.transtype != null || payment.transtype != undefined
          ? typeof payment.transtype == "object"
            ? payment.transtype.id
            : ""
          : "",
      customer_type:
        payment.custype != null || payment.custype != undefined
          ? typeof payment.custype == "object"
            ? payment.custype.id
            : ""
          : "",
      id: payment.id,
      transactiondetails: {
        debitaccount_type:
          trasaction.debitacc != null || trasaction.debitacc != undefined
            ? typeof trasaction.debitacc == "object"
              ? trasaction.debitacc.id
              : ""
            : "",
        debit_gl:
          trasaction.debitGL != null || trasaction.debitGL != undefined
            ? trasaction.debitGL
              ? trasaction.debitGL
              : ""
            : "",
        credit_gl:
          trasaction.creditGL != null || trasaction.creditGL != undefined
            ? trasaction.creditGL
              ? trasaction.creditGL.id
              : ""
            : "",
        account_no:
          trasaction.act_no != null || trasaction.act_no != undefined
            ? trasaction.act_no
              ? trasaction.act_no
              : ""
            : "",
            // customer_account:
            // trasaction.act_no != null || trasaction.act_no != undefined
            // ? trasaction.act_no
            //   ? trasaction.act_no
            //   : ""
            // : "",
        debitaccount_title:
          trasaction.customertype != null ||
          trasaction.customertype != undefined
            ? trasaction.customertype
              ? trasaction.customertype
              : ""
            : "",
        category:
          trasaction.cat != null || trasaction.cat != undefined
            ? trasaction.cat
              ? trasaction.cat.id
              : ""
            : "",
        sub_category:
          trasaction.subcat != null || trasaction.subcat != undefined
            ? trasaction.subcat
              ? trasaction.subcat.id
              : ""
            : "",
        invoice_no:
          trasaction.invoiceNum != null || trasaction.invoiceNum != undefined
            ? trasaction.invoiceNum
              ? trasaction.invoiceNum
              : ""
            : "",
            gst_address:
            trasaction.gst_address != null || trasaction.gst_address != undefined
              ? trasaction.gst_address
                ? trasaction.gst_address
                : ""
              : "",
              gst:
              trasaction.gst != null || trasaction.gst != undefined
                ? trasaction.gst
                  ? trasaction.gst
                  : ""
                : "",
        gstin:
          trasaction.gstin != null || trasaction.gstin != undefined
            ? trasaction.gstin
              ? trasaction.gstin
              : ""
            : "",
        state_code:
          trasaction.states_code != null || trasaction.states_code != undefined
            ? trasaction.states_code
              ? trasaction.states_code.id
              : ""
            : "",
        bs_id:
          trasaction.business_segment != null ||
          trasaction.business_segment != undefined
            ? trasaction.business_segment
              ? trasaction.business_segment.id
              : ""
            : "",
        cc_id:
          trasaction.cc != null || trasaction.cc != undefined
            ? trasaction.cc
              ? trasaction.cc.id
              : ""
            : "",
        product_id:
          trasaction.Product != null || trasaction.Product != undefined
            ? trasaction.Product
              ? trasaction.Product.id
              : ""
            : "",
        id: trasaction.id,
        billingdetails: {
          product_type: "",
          gst_code: "",
          gst_amount:
            billing.gstamt != null || billing.gstamt != undefined ? billing.gstamt  : "",
          totalbill_amount:
            billing.totbillamt != null || billing.totbillamt != undefined
              ? billing.totbillamt
                ? billing.totbillamt
                : ""
              : "",
          totalamount_pr:
            billing.totpay != null || billing.totpay != undefined
              ? billing.totpay
                ? billing.totpay
                : ""
              : "",
          narration:
            billing.narration != null || billing.narration != undefined
              ? billing.narration
                ? billing.narration
                : ""
              : "",
          billamount_gst:
            billing.billamt != null || billing.billamt != undefined
              ? billing.billamt
                ? billing.billamt
                : ""
              : "",
          id: billing.id,
          walkindetails: {
            key: this.walkin_data,
            customer_name:
              walkin.cusname != null || walkin.cusname != undefined
                ? walkin.cusname
                  ? walkin.cusname
                  : ""
                : "",
            address:
              walkin.address != null || walkin.address != undefined
                ? walkin.address
                  ? walkin.address
                  : ""
                : "",
            mobile_number:
              walkin.mobnum != null || walkin.mobnum != undefined
                ? walkin.mobnum
                  ? walkin.mobnum
                  : ""
                : "",
            email:
              walkin.email != null || walkin.email != undefined
                ? walkin.email
                  ? walkin.email
                  : ""
                : "",
            id: walkin.id ? walkin.id : null,
          },
        },
      },
    };
    if (this.subcat_credit == "CASA" ) {
      if (this.gst_success_message == "Success") {
      } else {
        this.toastr.warning("","Debit GL Not Success")
        return false;
      }
    }
  if(this.click_not_allow="Pending"){ }
  else{
    // if(this.frs_payment.value.transtype.name == "Cash" && this.frs_payment.value.custype.name=="Existing Customer" || this.frs_payment.value.transtype.name == "Cash" && this.frs_payment.value.custype.name=="Existing Customer(Loan FCC)"){
    //   if (this.gst_success_message == "Success") {
    //   } else {
    //     this.toastr.warning("","Account No Not Success")
    //     return false;
    //   }
    // }
  } 
    this.spinnerService.show();
    this.frsService.frs_edit(param).subscribe((res) => {
      this.spinnerService.hide();     
      // console.log("res ,gbf", res);
      if (res.set_code == "success") {
        this.toastr.success("", "SUCCESSFULLY  UPDATED", { timeOut: 1500 });
        if(this.retun_data_check=="Return"){
          this.move_approve('')
        }
        if(this.click_not_allow==="Pending" ){
        }else{
        this.nav_summary_page = true;
        this.edit_frs_screen=false;
        this.frsshareservice.submoduletab.next("summary")
        }
      } else {
        this.toastr.warning("", res.set_description, { timeOut: 1500 });
        this.spinnerService.hide();
      }
      // this.frs_edit_reset('reset');
      // this.nav_summary_page = true;
    });
  }

  file_data = [];
  files(e) {
    if(e.target.value.length>21){
console.log("file target data length",e.target.value)
    }
    for (var i = 0; i < e.target.files.length; i++) {
      this.file_data.push(e.target.files[i]);
    }
    // console.log("file data ", this.file_data);
  }

  frs_transaction_details(payment, walk, billing, transaction) {
    this.document_view = true;
    console.log(
      "payment,walk,billing,transaction",
      payment,
      walk,
      billing,
      transaction
    );
    // this.Gstnumber('','')
    // if(payment.branchcode == undefined || payment.branchcode == null || payment.branchcode == ''){
    //   this.toastr.warning('','Please  Enter Branch',{timeOut:1500})
    //   return false;
    // }

    if (
      payment.payment_type == undefined ||
      payment.payment_type == null ||
      payment.payment_type == ""
    ) {
      this.toastr.warning("", "Please  Enter Payment Type", { timeOut: 1500 });
      return false;
    }
    if (
      payment.transtype == undefined ||
      payment.transtype == null ||
      payment.transtype == ""
    ) {
      this.toastr.warning("", "Please  Enter Transaction Type", { timeOut: 1500 });
      return false;
    }
    if (
      payment.custype == undefined ||
      payment.custype == null ||
      payment.custype == ""
    ) {
      this.toastr.warning("", "Please  Enter Customer Type" , { timeOut: 1500 });
      return false;
    }
    if(transaction.debitacc == "" || transaction.debitacc == null || transaction.debitacc == undefined ){
      this.toastr.warning("", "Please  Enter Debit Account Type", { timeOut: 1500 });
        return false;
    }
      if (
        transaction.debitGL == undefined ||
        transaction.debitGL == null ||
        transaction.debitGL == ""
      ) {
        this.toastr.warning("", "Please  Enter DebitGl", { timeOut: 1500 });
        return false;
      }
      if(this.frs_payment.value.transtype.name == "Cash" && this.frs_payment.value.custype.name=="Existing Customer" || this.frs_payment.value.transtype.name == "Cash" && this.frs_payment.value.custype.name=="Existing Customer(Loan FCC)"){
        if (
          transaction.act_no != undefined &&
          transaction.act_no != null &&
          transaction.act_no != ""
        ) {         
        
        if (transaction.act_no.length < 16) {
          this.toastr.warning(
            "",
            "Please Enter  Valid 16 Digit  Account  No",
            {
              timeOut: 1500,
            }
          );
          return false;
        }
        }
      }else{
      if (transaction.debitGL.id == 2 ) {
        this.checkbox_hide=false;
      }else{
        this.checkbox_hide=true
      }
      if (transaction.debitacc.id == 2) {
        if (transaction.debitGL.length < 16) {
          this.toastr.warning(
            "",
            "Please Enter  Valid 16 Digit DebitGL Account  No",
            {
              timeOut: 1500,
            }
          );
          return false;
        }
      }
      if (payment.transtype.id == 2) {
      if (transaction.debitGL.length < 16) {
        this.toastr.warning(
          "",
          "Please Enter  Valid 16 Digit DebitGL Account  No",
          {
            timeOut: 1500,
          }
        );
        return false;
      }
    }
  }
  if(transaction.gst ==="" || transaction.gst ===null || transaction.gst===undefined){
 
  }else{
if(payment.custype?.id == "4"){
  if(transaction.gst.length < 15){
    this.toastr.warning("","Please Enter The Valid GST  No",{timeOut: 1500,});
    return false;
  }
}
if(this.gst_not_valid==="NOT GST"){
  this.toastr.warning("","Please Enter The Valid GST No ",{timeOut: 1500,});
  return false;
}
  }
    // if (transaction.loanfcc.length < 16) {
    //   this.toastr.warning("", "Please Enter  Valid 16 Digit Loan Account  No", {
    //     timeOut: 1500,
    //   });
    //   return false;
    // }
    // if (
    //   transaction.loanfcc == undefined ||
    //   transaction.loanfcc == null ||
    //   transaction.loanfcc == ""
    // ) {
    //   this.toastr.warning("", "Please  Enter Loan Account Number", {
    //     timeOut: 1500,
    //   });
    //   return false;
    // }

    if (
      transaction.creditGL == undefined ||
      transaction.creditGL == null ||
      transaction.creditGL == ""
    ) {
      this.toastr.warning("", "Please  Enter Credit GL", { timeOut: 1500 });
      return false;
    }
    // if (
    //   transaction.cat == undefined ||
    //   transaction.cat == null ||
    //   transaction.cat == ""
    // ) {
    //   this.toastr.warning("", "Please  Enter Cat", { timeOut: 1500 });
    //   return false;
    // }
    // if (
    //   transaction.subcat == undefined ||
    //   transaction.subcat == null ||
    //   transaction.subcat == ""
    // ) {
    //   this.toastr.warning("", "Please  Enter subcat", { timeOut: 1500 });
    //   return false;
    // }
    if (
      transaction.Product == undefined ||
      transaction.Product == null ||
      transaction.Product == ""
    ) {
      this.toastr.warning("", "Please  Enter Product", { timeOut: 1500 });
      return false;
    }
    if (
      transaction.business_segment == undefined ||
      transaction.business_segment == null ||
      transaction.business_segment == ""
    ) {
      this.toastr.warning("", "Please  Enter BS", { timeOut: 1500 });
      return false;
    }
    if (
      transaction.cc == undefined ||
      transaction.cc == null ||
      transaction.cc == ""
    ) {
      this.toastr.warning("", "Please  Enter CC", { timeOut: 1500 });
      return false;
    }
    // if (
    //   transaction.states_code == undefined ||
    //   transaction.states_code == null ||
    //   transaction.states_code == ""
    // ) {
    //   this.toastr.warning("", "Please  Enter State", { timeOut: 1500 });
    //   return false;
    // }

    if (
      payment.payment_type.name == "CustomerServiceCharge" ||
      payment.payment_type.name == "Non FA scrapsale"
    ) {
      if (
        billing.billamt == undefined ||
        billing.billamt == null ||
        billing.billamt == ""
      ) {
        this.toastr.warning("", "Please  Enter BillAmt", { timeOut: 1500 });
        return false;
      }
      if (
        billing.gstamt == undefined ||
        billing.gstamt == null ||
        billing.gstamt == ""
      ) {
        this.toastr.warning("", "Please  Enter GST AMt", { timeOut: 1500 });
        return false;
      }
      if (
        billing.totbillamt == undefined ||
        billing.totbillamt == null ||
        billing.totbillamt == ""
      ) {
        this.toastr.warning("", "Please  Enter Total Bill Amount", {
          timeOut: 1500,
        });
        return false;
      }
      //  if (
      //   transaction.gstin == undefined ||
      //   transaction.gstin == null ||
      //   transaction.gstin == ""
      // ) {
      //   this.toastr.warning("", "Please  Enter GstNo", { timeOut: 1500 });
      //   return false;
      // }
    }

    // if (
    //   billing.gstate_code == undefined ||
    //   billing.gstate_code == null ||
    //   billing.gstate_code == ""
    // ) {
    //   this.toastr.warning("", "Please  Enter Gst Code", { timeOut: 1500 });
    //   return false;
    // }
    // if (payment.transtype.name == "Cash") {
    //   if (billing.billamt > 10000) {
    //     this.toastr.warning("", "The Bill Amount Should Be Less Then 10000", {
    //       timeOut: 1500,
    //     });
    //     return false;
    //   }
    // }
    // if (
    //   billing.billamt == undefined ||
    //   billing.billamt == null ||
    //   billing.billamt == ""
    // ) {
    //   this.toastr.warning("", "Please  Enter BillAmt", { timeOut: 1500 });
    //   return false;
    // }
    // if (
    //   billing.gstamt == undefined ||
    //   billing.gstamt == null ||
    //   billing.gstamt == ""
    // ) {
    //   this.toastr.warning("", "Please  Enter GST AMt", { timeOut: 1500 });
    //   return false;
    // }
    // if (payment.transtype.name == "Cash") {
    //   if (billing.totbillamt > 10000) {
    //     this.toastr.warning("", "The Bill Amount Should Be Less Then 10000", {
    //       timeOut: 1500,
    //     });
    //     return false;
    //   }
    // }
    // if (
    //   billing.totbillamt == undefined ||
    //   billing.totbillamt == null ||
    //   billing.totbillamt == ""
    // ) {
    //   this.toastr.warning("", "Please  Enter Total Bill Amount", {
    //     timeOut: 1500,
    //   });
    //   return false;
    // }
    // if (payment.transtype.name == "Cash") {
    //   if (billing.totpay > 10000) {
    //     this.toastr.warning("", "The Bill Amount Should Be Less Then 10000", {
    //       timeOut: 1500,
    //     });
    //     return false;
    //   }
    // }
    if (
      billing.totpay == undefined ||
      billing.totpay == null ||
      billing.totpay == ""
    ) {
      this.toastr.warning("", "Please  Enter Total Amount Payable/Receivable", {
        timeOut: 1500,
      });
      return false;
    }
    if (
      billing.narration == undefined ||
      billing.narration == null ||
      billing.narration == ""
    ) {
      this.toastr.warning("", "Please  Enter Narration", { timeOut: 1500 });
      return false;
    }
    if (payment.custype.name == "Walkin Customer") {
      if (
        walk.cusname == undefined ||
        walk.cusname == null ||
        walk.cusname == ""
      ) {
        this.toastr.warning("", "Please  Enter Customer Name", { timeOut: 1500 });
        return false;
      }
      if (
        walk.address == undefined ||
        walk.address == null ||
        walk.address == ""
      ) {
        this.toastr.warning("", "Please  Enter Address", { timeOut: 1500 });
        return false;
      }    
      if (
        walk.mobnum == undefined ||
        walk.mobnum == null ||
        walk.mobnum == ""
      ) {
        this.toastr.warning("", "Please  Enter Mobile Number", {
          timeOut: 1500,
        });
        return false;
      }
      if (walk.mobnum.length < 10) {
        this.toastr.warning("", "Please  Enter Valid Mobile Number", {
          timeOut: 1500,
        });
        return false;
      }  
     
    }
    if (payment.custype?.id == "4") {
      if (
        walk.mobnum == undefined ||
        walk.mobnum == null ||
        walk.mobnum == ""
      ) {
        this.toastr.warning("", "Please  Enter Mobile Number", {
          timeOut: 1500,
        });
        return false;
      }
      if (walk.mobnum.length < 10) {
        this.toastr.warning("", "Please  Enter Valid Mobile Number", {
          timeOut: 1500,
        });
        return false;
      }  
      if (walk.email == undefined || walk.email == null || walk.email == "") {
        this.toastr.warning("", "Please  Enter Email", { timeOut: 1500 });
        return false;
      }
      if(this.email_validation_test === false){
        this.toastr.warning("", "Please  Enter the Valid Email", { timeOut: 1500 });
        return false;
      }
    }
    if(walk.email =="" || walk.email == undefined || walk.email == null){

    }else{
     if(this.email_validation_test === false){
      this.toastr.warning("", "Please  Enter the Valid Email", { timeOut: 1500 });
      return false;
    }
  }
    // if(payment.payment_type.name == "Non FA scrapsale"){
    //   if ( transaction.invoiceNum == undefined || transaction.invoiceNum == null || transaction.invoiceNum == "" ) {
    //       this.toastr.warning("", "Please  Enter Invoice Number", { timeOut: 1500 });
    //       return false;
    //     }
    // }
    // if(this.file_data == undefined || this.file_data == null || this.file_data.length == 0){
    //   this.toastr.warning("", "Please  Select File", { timeOut: 1500 });
    //     return false;
    // }
    // for (var i = 0; i < e.target.files.length; i++) {
    //   this.file_data.push(e.target.files[i]);
    // }   

    this.Walinkey = 0;
    if (payment.custype.name == "Walkin Customer" ||  payment.custype?.id === 4) {
      this.Walinkey = 1;
    }
    // this.walkview=true;
    this.tran_data = [
      {
        branch_id:
          payment.branchcode != null ||
          payment.branchcode != undefined ||
          payment.branchcode != ""
            ? typeof payment.branchcode == "object"
              ? payment.branchcode.id
              : ""
            : "",
        payment_type:
          payment.payment_type != null ||
          payment.payment_type != undefined ||
          payment.payment_type != ""
            ? typeof payment.payment_type == "object"
              ? payment.payment_type.id
              : ""
            : "",
        transaction_type:
          payment.transtype != null ||
          payment.transtype != undefined ||
          payment.transtype != ""
            ? typeof payment.transtype == "object"
              ? payment.transtype.id
              : ""
            : "",
        customer_type:
          payment.custype != null ||
          payment.custype != undefined ||
          payment.custype != ""
            ? typeof payment.custype == "object"
              ? payment.custype.id
              : ""
            : "",
        transactiondetails: [
          {
            debitaccount_type:
              transaction.debitacc != null || transaction.debitacc != undefined
                ? typeof transaction.debitacc == "object"
                  ? transaction.debitacc.id
                  : ""
                : "",
            debit_gl:
              transaction.debitGL != null || transaction.debitGL != undefined
                ? transaction.debitGL != ""
                  ? transaction.debitGL
                  : ""
                : "",
            credit_gl:
              transaction.creditGL != null || transaction.creditGL != undefined
                ? transaction.creditGL
                  ? transaction.creditGL.id
                  : ""
                : "",
            account_no:
              transaction.act_no != null || transaction.act_no != undefined
                ? transaction.act_no
                  ? transaction.act_no
                  : ""
                : "",
                // customer_account:
                // transaction.act_no != null || transaction.act_no != undefined
                // ? transaction.act_no
                //   ? transaction.act_no
                //   :""
                //   :"",
            debitaccount_title:
              transaction.customertype != null ||
              transaction.customertype != undefined
                ? transaction.customertype
                  ? transaction.customertype
                  : ""
                : "",
            invoice_no:
              transaction.invoiceNum != null ||
              transaction.invoiceNum != undefined
                ? transaction.invoiceNum
                  ? transaction.invoiceNum
                  : ""
                : "",
                gst_address:
                transaction.gst_address != null || transaction.gst_address != undefined
                  ? transaction.gst_address
                    ? transaction.gst_address
                    : ""
                  : "",
                  gst:
                  transaction.gst != null || transaction.gst != undefined
                    ? transaction.gst
                      ? transaction.gst
                      : ""
                    : "",
            gstin:
              transaction.gstin != null || transaction.gstin != undefined
                ? transaction.gstin != ""
                  ? transaction.gstin
                  : ""
                : "",
            state_code:
              transaction.states_code != null ||
              transaction.states_code!= undefined
                ? transaction.states_code != ""
                  ? transaction.states_code.id
                  : ""
                : "",
            bs_id:
              transaction.business_segment != null ||
              transaction.business_segment != undefined
                ? transaction.business_segment
                  ? transaction.business_segment.id
                  : ""
                : "",
            cc_id:
              transaction.cc != null || transaction.cc != undefined
                ? transaction.cc
                  ? transaction.cc.id
                  : ""
                : "",
            product_id:
              transaction.Product != null || transaction.Product != undefined
                ? transaction.Product != ""
                  ? transaction.Product.id
                  : ""
                : "",
            category:
              transaction.cat != null || transaction.cat != undefined
                ? transaction.cat != ""
                  ? transaction.cat.id
                  : ""
                : "",
            sub_category:
              transaction.subcat != null || transaction.subcat != undefined
                ? transaction.subcat != ""
                  ? transaction.subcat.id
                  : ""
                : "",
            billingdetails: [
              {
                product_type: "",
                gst_code: "",
                gst_amount:billing.gstamt != null || billing.gstamt != undefined ? billing.gstamt  : "",
                totalbill_amount:
                  billing.totbillamt != null || billing.totbillamt != undefined
                    ? billing.totbillamt
                      ? billing.totbillamt
                      : ""
                    : "",
                totalamount_pr:
                  billing.totpay != null || billing.totpay != undefined
                    ? billing.totpay != ""
                      ? billing.totpay
                      : ""
                    : "",
                narration:
                  billing.narration != null || billing.narration != undefined
                    ? billing.narration != ""
                      ? billing.narration
                      : ""
                    : "",
                billamount_gst:
                  billing.billamt != null || billing.billamt != undefined
                    ? billing.billamt != ""
                      ? billing.billamt
                      : ""
                    : "",
                walkindetails: [
                  {
                    key: this.Walinkey,
                    customer_name:
                      walk.cusname != null || walk.cusname != undefined
                        ? walk.cusname != ""
                          ? walk.cusname
                          : ""
                        : "",
                    address:
                      walk.address != null || walk.address != undefined
                        ? walk.address != ""
                          ? walk.address
                          : ""
                        : "",
                    mobile_number:
                      walk.mobnum != null || walk.mobnum != undefined
                        ? walk.mobnum != ""
                          ? walk.mobnum
                          : ""
                        : "",
                    email:
                      walk.email != null || walk.email != undefined
                        ? walk.email != ""
                          ? walk.email
                          : ""
                        : "",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    if(this.file_data.length != 0){
      for (var i=0; i<this.file_data.length; i++ ){
        if(this.file_data[i].name.length>75){
          console.log("this.file_data[i] length",this.file_data[i].name.length)
           this.toastr.warning("","Please Select File Name Length 75 Only Allowed ")
           return false
        }
      }
    }
    if (this.frs_transaction.value.debitacc?.name == "CASA" ) {
      if (this.gst_success_message == "Success") {
      }else {
        this.toastr.warning("","Debit GL Not Success")
        return false;
      }
    }   
    this.view_edit = true;
    console.log("file", this.file_data[0], this.tran_data);
    this.spinnerService.show();
    this.frsService.frs_details(this.tran_data, this.file_data).subscribe(
      (res) => {
        this.spinnerService.hide();
        if (res["set_code"] == "success") {
          this.toastr.success("", "Successfully Created", { timeOut: 1500 });
          this.FileAttachement.get("file")?.reset();
          // console.log("datavalue", res);
          this.nav_summary_page = true;
          this.edit_frs_screen=false;
          this.frsshareservice.submoduletab.next("summary")
          // this.frs_view('','reset')
          this.frs_payment.reset();
          this.frs_transaction.reset();
          this.frs_billing.reset();
          this.frs_Walk_in.reset();
        } else {
          this.toastr.warning("", res["code"], { timeOut: 1500 });
          this.spinnerService.hide();
        }

        this.isDisabled = true;
        setTimeout(() => {
          this.isDisabled = false;
        }, 5000);
      },
      (error) => {
        this.tran_data = [];
        this.spinnerService.hide();
      }
    );
  }
  error_fun(Message) {
    this.toastr.warning("", "Please Enter " + Message, { timeOut: 1500 });
    return false;
  }
  State_value() {
    this.frsService
      .getStatedropdown(this.statedata.nativeElement.value, 1)
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
        let datas = results["data"];
        this.state_code = datas;
        // console.log("main=>", this.state_code);
      });
  }
  state_datasscroll() {
    // console.log("scroll");
    this.has_next = true;
    this.has_previous = true;
    this.currentpage = 1;
    setTimeout(() => {
      if (
        this.state_auto &&
        this.autocompleteTrigger &&
        this.state_auto.panel
      ) {
        fromEvent(this.state_auto.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.state_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop = this.state_auto.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.state_auto.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.state_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              // console.log(this.has_next);
              if (this.has_next === true) {
                // console.log("true");
                this.frsService
                  .getStatedropdown(this.statedata.nativeElement.value, 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.state_code = this.state_code.concat(datas);
                    if (this.state_code.length >= 0) {
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

  Approved(approw) {
    if (approw == undefined || approw == null || approw == "") {
      this.toastr.warning("", "Please  Enter Remarks", { timeOut: 1500 });
      return false;
    }
    this.Approved_indetails_id = this.edit_frs_summary.id;
    console.log("this.Approve id", this.Approved_indetails_id);
    if (this.edit_frs_summary.status.name == "Reverse Raised") {
      var Approve = {
        status: 5,
        incomedetails_id: this.Approved_indetails_id,
        type: 5,
        remarks: this.code_remars+"-"+approw.value,
      };
    } else {
      var Approve = {
        status: 2,
        incomedetails_id: this.Approved_indetails_id,
        type: 2,
        remarks: this.code_remars+"-"+approw.value,
      };
    }
    this.spinnerService.show();
    this.frsService
      .Approve_stats(Approve, this.file_data)
      .subscribe((results) => {
        this.spinnerService.hide();
        if (results.set_code == "SUCCESS") {
          this.toastr.success("", "SUCCESSFULLY  APPROVED", { timeOut: 1500 });
          this.closepopupApp.nativeElement.click();
          this.FileAttachement.get("file")?.reset();

          let data = results["data"];
          this.payment_list = data;
          this.nav_summary_page = true;
          this.edit_frs_screen=false;
        } else {
          this.toastr.warning("", results.set_description, { timeOut: 1500 });
          this.spinnerService.hide();
        }
      });
    // approw.reset()
  }
  Return(rejec) {
    if (rejec == undefined || rejec == null || rejec == "") {
      this.toastr.warning("", "Please  Enter Remarks", { timeOut: 1500 });
      return false;
    }
    this.Approved_indetails_id = this.edit_frs_summary.id;
    console.log("this.Return id", this.Approved_indetails_id);     
      var Approve = {
        status: 7,
        incomedetails_id: this.Approved_indetails_id,
        type: 7,
        remarks: rejec.value,
      };    
    this.spinnerService.show();
    this.frsService
      .Approve_stats(Approve, this.file_data)
      .subscribe((results) => {
        this.spinnerService.hide();
        if (results.set_code == "SUCCESS") {          
          this.FileAttachement.get("file")?.reset();
          let data = results["data"];
          this.rejected = data;
          this.nav_summary_page = true;
          this.edit_frs_screen=false;
          this.toastr.success("", "SUCCESSFULLY  RETURND", { timeOut: 1500 });
          this.closepopups.nativeElement.click();
        } else {
          this.toastr.warning("", results.set_description, { timeOut: 1500 });
          this.spinnerService.hide();
        }
      });
    // rejec.reset()
  }

  move_approve(moveapprov) {    
    this.Approved_indetails_id = this.edit_frs_summary.id;
    console.log("this.move to Approve id", this.Approved_indetails_id);
    let Approve = {
      status: 8,
      incomedetails_id: this.Approved_indetails_id,
      type: 8,
      remarks: "",
    };
    this.spinnerService.show();
    this.frsService
      .Approve_stats(Approve, this.file_data)
      .subscribe((results) => {
        this.spinnerService.hide();
        if (results.set_code == "SUCCESS") {
          // this.toastr.success("", "SUCCESS", {
          //   timeOut: 1500,
          // });

          this.FileAttachement.get("file")?.reset();
          let data = results["data"];
          this.movetoapprove = data;
          this.closepopups.nativeElement.click();
          this.nav_summary_page = true;
          this.edit_frs_screen=false;
        } else {
          this.spinnerService.hide();
          // this.toastr.warning("", results.set_description, { timeOut: 1500 });
        }
      });
  }
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ["add", ["addRowDown", "addRowUp", "addColLeft", "addColRight"]],
        ["delete", ["deleteRow", "deleteCol", "deleteTable"]],
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
    // uploadImagePath: '/api/upload',
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
      ["insert", ["table", "picture", "link", "video", "hr"]],
    ],
    codeviewFilter: true,
    codeviewFilterRegex:
      /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  editorDisabled = false;
  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml("Aprovereject");
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
  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  Gstnumber(event,form_value,deff) {
    // if (
    //   depitegl.debitGL == undefined ||
    //   depitegl.debitGL == null ||
    //   depitegl.debitGL == ""
    // ) {
    //   this.toastr.warning("", "Please  Enter DebiteGl", { timeOut: 1500 });
    //   return false;
    // }
    // if (depitegl.debitGL.length != 0  && depitegl.debitGL.length < 16) {
    //   this.toastr.warning("", "Please  Enter DebiteGl", { timeOut: 1500 });
    //    return false;
    // }
    let debit_value
    if(deff=='debit'){
      debit_value=this.frs_transaction.value.debitGL
    }else{
      debit_value=this.frs_transaction.value.act_no 
    }
    let Depitegl = {     
      AccountNo: debit_value,
      CustId: "",
    };
    // let  Depitegl = depitegl
    // console.log("depitegl", Depitegl);
    // if (depitegl == null ) {
    //   this.toastr.warning("", "Please Enter Valide Account Number");
    
    //   this.check_value=false;
    // }
    // if (depitegl.debitGL.length < 16) {
    //   this.toastr.warning("", "Please Enter Valide Account Number");
    //   // console.log("  this.check_value=false;" , this.check_value)     
    //   return false;
    //   this.check_value=false;
    // }
    if(event.target.value.length<16 && deff=='debit'){
      this.toastr.warning("","Please Enter Valid Debit Gl")
      return false
    }
    if(event.target.value.length<16 && deff=='accont'){
      this.toastr.warning("","Please Enter Valid Account No")
      return false
    }

    if (event.target.value.length==16) {
      this.check_value = true;
      this.spinnerService.show();
      this.frsService.Gstnumber(Depitegl).subscribe((results) => {
        // this.toastr.success("", "Successfully  Created", { timeOut: 1500 });
        let data = results["data"];
        this.spinnerService.hide();
        this.payment_list = data[0];
        let gstin = this.payment_list.out_msg.ErrorMessage;
        // let gstin = this.payment_list
        this.gst_success_message = gstin;
        this.gst_no = gstin.GstNo;
        console.log("results.ErrorMessage", gstin);
        if (gstin == "Success") {
          this.toastr.success("", gstin, { timeOut: 1500 });
          this.debit_readonly=true
          // this.check_value=false;
          // console.log("payment_list,payment_list", this.payment_list);
          // console.log(
          //   "this.payment_list.out_msg.AccountTitle,",
          //   this.payment_list.out_msg.AccountTitle
          // );
         if(this.payment_list.out_msg.GstNo == "NO DATA"){
          this.toastr.warning("Customer type chosen as B2C. Hence GST invoice will not be issued for the transaction")
         }
          this.frs_transaction.patchValue({
            gstin:
              this.payment_list.out_msg.GstNo == "NO DATA"
                ? " Not Available GST No"
                : this.payment_list.out_msg.GstNo,
            customertype: this.payment_list.out_msg.AccountTitle,
          });
        } else {
          this.debit_readonly=false
          this.toastr.warning("", gstin, { timeOut: 1500 });
          this.spinnerService.hide();
        }
      });
    } else {
     
      this.frs_transaction.get("debitGL").reset();
      this.frs_transaction.get("gstin").reset();
      this.frs_transaction.get("customertype").reset();
    }
    
  }

  gst_value_radio(billings) {
    let values = billings.billamt;
    let vall=parseInt(values);
    // Number.parseFloat(values).toFixed(2)
    console.log("valuygtfrnyh", values);
    if (
      this.frs_payment.value.payment_type.name == "CustomerServiceCharge" ||
      this.frs_payment.value.payment_type.name == "Non FA scrapsale"
    ) {
      let total_bill = parseInt(values);
      let amount = (total_bill * 18) / 100;
      let amtratio: number = amount;
      this.frs_billing.patchValue({
        gstamt: amtratio.toFixed(2),
      });
      console.log("gstamt", amount);
      // console.log("amtratio", amtratio);

      const total_values = total_bill + amtratio;
      this.frs_billing.patchValue({
        totbillamt: total_values.toFixed(2),
        totpay: total_values.toFixed(2),
      });
      // console.log("total_values", total_values);
    } else {
      this.frs_billing.patchValue({
        totbillamt: vall.toFixed(2),
        totpay: vall.toFixed(2),
      });
    }
  }
  reversed(rever) {
    if (rever == undefined || rever == null || rever == "") {
      this.toastr.warning("", "Please  Enter Remarks", { timeOut: 1500 });
      return false;
    }
    this.Approved_indetails_id = this.edit_frs_summary.id;
    console.log("this.Reverse", this.Approved_indetails_id);
    let Approve = {
      status: 4,
      incomedetails_id: this.Approved_indetails_id,
      type: 4,
      remarks: rever.value,
    };
    this.spinnerService.show();
    this.frsService
      .Approve_stats(Approve, this.file_data)
      .subscribe((results) => {
        if (results.set_description == "SUCCESSFULLY REVERSE") {
          this.toastr.success("", results.set_description, { timeOut: 1500 });
          this.closepopupreverse.nativeElement.click();
          this.FileAttachement.get("file")?.reset();
          this.spinnerService.hide();
          let data = results["data"];
          this.movetoapprove = data;
          this.nav_summary_page = true;
          this.edit_frs_screen=false;
        } else {
          this.toastr.warning("", results.set_description, { timeOut: 1500 });
          this.spinnerService.hide();
        }
      });
  }
  Reject(rever) {
    if (rever == undefined || rever == null || rever == "") {
      this.toastr.warning("", "Please  Enter Remarks", { timeOut: 1500 });
      return false;
    }
    this.Approved_indetails_id = this.edit_frs_summary.id;
    console.log("this.reject id", this.Approved_indetails_id);
    if (this.edit_frs_summary.status.name == "Reverse Raised") {
      var Approve = {
        status: 6,
        incomedetails_id: this.Approved_indetails_id,
        type: 6,
        remarks: rever.value,
      };
    }else{ 
     Approve = {
      status: 0,
      incomedetails_id: this.Approved_indetails_id,
      type: 0,
      remarks: rever.value,
    };
  }
    this.spinnerService.show();
    this.frsService
      .Approve_stats(Approve, this.file_data)
      .subscribe((results) => {
        this.spinnerService.hide();
        if (results.set_code == "SUCCESS") {
          this.toastr.success("", "SUCCESSFULLY REJECTED", { timeOut: 1500 });
          this.closepopupdel.nativeElement.click();
          this.FileAttachement.get("file")?.reset();
          let data = results["data"];
          this.movetoapprove = data;
          this.nav_summary_page = true;
          this.edit_frs_screen=false;
        } else {
          this.toastr.warning("", results.set_description, { timeOut: 1500 });
          this.spinnerService.hide();
        }
      });
  }
  bs_dropdown() {  
    if(this.frs_transaction.value.creditGL == "" || this.frs_transaction.value.creditGL == null || this.frs_transaction.value.creditGL==undefined){
      this.toastr.warning("Please Select Credit GL")
      return false
    }
    let gl_id=this.frs_transaction.value.creditGL?.id??""
    this.frs_transaction.get("cc").reset()
    this.spinnerService.show();
    this.frsService
      .getbs_dropdown(this.bsdata.nativeElement.value, 1,gl_id)
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
        this.spinnerService.hide();
        let datas = results["data"];
        this.bs_details = datas;
        // console.log("main=>", this.bs_details);
      });
  }
  cc_dropdown() {
     if(this.frs_transaction.value.creditGL == "" || this.frs_transaction.value.creditGL == null || this.frs_transaction.value.creditGL==undefined){
      this.toastr.warning("Please Select Credit GL")
      return false
    }
    
    if (this.frs_transaction.value.business_segment == undefined || this.frs_transaction.value.business_segment == null || this.frs_transaction.value.business_segment=="") {
      this.toastr.warning("Please Select BS");
      return false;
    }
    let bs_id = this.frs_transaction.value.business_segment.id;
    // console.log("bs_id", bs_id);
    this.spinnerService.show();
    this.frsService
      .getcc_dropdown(bs_id, this.ccdata.nativeElement.value, 1)
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
        this.spinnerService.hide();
        let datas = results["data"];
        this.cc_details = datas;
        // console.log("main=>", this.cc_details);
      });
  }
  autocompletebsnameScroll() {
    let gl_id=this.frs_transaction.value.creditGL?.id??""
    this.bs_has_next = true;
    this.bs_has_previous = true;
    this.bs_currentpage = 1;
    setTimeout(() => {
      if (this.bs_auto && this.autocompleteTrigger && this.bs_auto.panel) {
        fromEvent(this.bs_auto.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.bs_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.bs_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.bs_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.bs_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.bs_has_next === true) {
                this.frsService
                  .getbs_dropdown(
                    this.bsdata.nativeElement.value,
                    this.currentpage + 1,gl_id
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bs_details = this.bs_details.concat(datas);
                    if (this.bs_details.length >= 0) {
                      this.bs_has_next = datapagination.has_next;
                      this.bs_has_previous = datapagination.has_previous;
                      this.bs_currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  autocompletccnameScroll() {
    let bs_id = this.frs_transaction.value.business_segment.id;
    this.cc_has_next = true;
    this.cc_has_previous = true;
    this.cc_currentpage = 1;
    setTimeout(() => {
      if (this.cc_auto && this.autocompleteTrigger && this.cc_auto.panel) {
        fromEvent(this.cc_auto.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.cc_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.cc_auto.panel.nativeElement.scrollTop;
            const scrollHeight = this.cc_auto.panel.nativeElement.scrollHeight;
            const elementHeight = this.cc_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.cc_has_next === true) {
                this.frsService.getcc_dropdown(bs_id,this.ccdata.nativeElement.value,this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.cc_details = this.cc_details.concat(datas);
                    if (this.cc_details.length >= 0) {
                      this.cc_has_next = datapagination.has_next;
                      this.cc_has_previous = datapagination.has_previous;
                      this.cc_currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  search_details(bs_event) {
    console.log("bs_eventdata", bs_event);
  }

  Catagorys() {
    if (
      this.frs_transaction.value.creditGL == "" ||
      this.frs_transaction.value.creditGL == null ||
      this.frs_transaction.value.creditGL == undefined
    ) {
      this.toastr.warning("", "Please Select Credit GL");
      return false;
    }
    this.spinnerService.show();
    this.frsService
      .Catagorys(this.cata_data.nativeElement.value, 1)
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
        this.spinnerService.hide();
        let datas = results["data"];
        this.Catagory_list = datas;
        this.cat_id = this.Catagory_list.id;
        // console.log("main=>", this.Catagory_list);
      });
  }
  Subcats(cat_value) {
    if (
      this.frs_transaction.value.creditGL == "" ||
      this.frs_transaction.value.creditGL == null ||
      this.frs_transaction.value.creditGL == undefined
    ) {
      this.toastr.warning("", "Please Select Credit GL");
      return false;
    }
    // if (
    //   this.frs_transaction.value.cat == "" ||
    //   this.frs_transaction.value.cat == null ||
    //   this.frs_transaction.value.cat == undefined
    // ) {
    //   this.toastr.warning("", "Please Select Credit GL");
    //   return false;
    // }
    // console.log("cat_value", cat_value.cat.id);
    let catid = cat_value.cat.id;
    let cat_values = cat_value.cat;
    // console.log("this.frs_transaction.value.cat.name", cat_values);
    // if (cat_values == "" || cat_values == null || cat_values == undefined) {
    //   this.toastr.warning("", "Please Select Catagory");
    //   return false;
    // }

    this.spinnerService.show();
    this.frsService
      .Subcats(this.subcat_data.nativeElement.value, catid, 1)
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
        this.spinnerService.hide();
        let datas = results["data"];
        this.subcats_list = datas;

        // console.log("mainss=>", this.subcats_list);

        // console.log("cat_value.subcat.glno",cat_value.subcat.glno)
        // var creditgl_data = cat_value.subcat.glno
      });
  }
  subcat_datas(value) {
    this.frs_transaction.get("creditGL_name").reset();
    this.frs_transaction.get("cc").reset();
    this.frs_transaction.get("business_segment").reset();
    this.frs_transaction.get("Product").reset();
    let subcat_credit =value;
    // console.log("subcat_credit", subcat_credit);
    this.frs_transaction.patchValue({
      creditGL_name:subcat_credit.gl_name
    })
    let gl_id = subcat_credit.id;
    // this.spinnerService.show();
    this.frsService.catsubcat_value(gl_id).subscribe((results: any) => {
      // this.spinnerService.hide();
      let data = results["data"];
      this.product_list_data = data;
      this.frs_transaction.patchValue({
        cat: results.cat,
        subcat: results.subcat,
      });
    });
  }
  autocompletecatScroll() {
    let catid = this.cat_id;
    this.cat_has_next = true;
    this.cat_has_previous = true;
    this.cat_currentpage = 1;
    setTimeout(() => {
      if (this.Catagory && this.autocompleteTrigger && this.Catagory.panel) {
        fromEvent(this.Catagory.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.Catagory.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.Catagory.panel.nativeElement.scrollTop;
            const scrollHeight = this.Catagory.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.Catagory.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.cat_has_next === true) {
                this.frsService
                  .Subcats(
                    this.subcat_data.nativeElement.value,
                    catid,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.Catagory_list = this.Catagory_list.concat(datas);
                    if (this.Catagory_list.length >= 0) {
                      this.cat_has_next = datapagination.has_next;
                      this.cat_has_previous = datapagination.has_previous;
                      this.cat_currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }
  autocompletesubcatScroll() {
    this.subcat_has_next = true;
    this.subcat_has_previous = true;
    this.subcat_currentpage = 1;
    setTimeout(() => {
      if (this.subcats && this.autocompleteTrigger && this.subcats.panel) {
        fromEvent(this.subcats.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.subcats.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.subcats.panel.nativeElement.scrollTop;
            const scrollHeight = this.subcats.panel.nativeElement.scrollHeight;
            const elementHeight = this.subcats.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.subcat_has_next === true) {
                this.frsService
                  .get_branch_code(
                    this.subcat_data.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subcats_list = this.subcats_list.concat(datas);
                    if (this.subcats_list.length >= 0) {
                      this.subcat_has_next = datapagination.has_next;
                      this.subcat_has_previous = datapagination.has_previous;
                      this.subcat_currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  // Creditgl() {
  //   let Approve = this.frs_payment.value.payment_type.id;
  //   // if (Approve == undefined) {
  //   //   this.toastr.warning("", "Please Select Payment Type");
  //   // } else {
  //     // console.log("approve",Approve)
  //     this.spinnerService.show()
  //     this.frsService.Creditgl().subscribe((results) => {
  //       this.spinnerService.hide()
  //       let data = results["data"];
  //       this.creditgl_list = data;
  //       console.log("this.creditgl_list", this.creditgl_list);
  //       // this.nav_summary_page=true
  //     });
  //   // }
  // }

creditgl_income(){
  this.payment_id = this.frs_payment.value.payment_type?.id;
  this.spinnerService.show()
  this.frsService.Creditgl("", this.payment_id, 1).subscribe((results) => {
    this.spinnerService.hide();
    let datas = results["data"];  
    this.creditgl_listss = datas[0];
    console.log("main=>", this.creditgl_listss.id);  
    this.frs_transaction.patchValue({
     creditGL:this.creditgl_listss,
     creditGL_name:this.creditgl_listss.gl_name     
    })
    this.subcat_datas(this.creditgl_listss)
   
  })
}

  Creditgl() {
    if (
      this.frs_payment.value.payment_type == null ||
      this.frs_payment.value.payment_type == "" ||
      this.frs_payment.value.payment_type == undefined
    ) {
      this.toastr.warning("", "Please Select Payment Type");
      return false;
    }
    if(this.frs_transaction.value.debitGL == "" || this.frs_transaction.value.debitGL ==null || this.frs_transaction.value.debitGL ==undefined){
      this.toastr.warning("","please Enter Debit Gl")
      return false
    }
    if(this.frs_transaction.value.debitacc?.name =='CASA'){
    if(this.frs_transaction.value.debitGL.length<16){
      this.toastr.warning("","please Enter Valid Debit Gl")
      return false
    }
  }
  // if(this.frs_transaction.value.creditGL != ""){
  //   console.log("kowsi")
  //   this.frs_transaction.get("creditGL").reset()
  //   this.frs_transaction.get("creditGL_name").reset();
  //   this.frs_transaction.get("cc").reset();
  //   this.frs_transaction.get("business_segment").reset();
  //   this.frs_transaction.get("Product").reset();
  // }
    this.payment_id = this.frs_payment.value.payment_type.id;
    this.spinnerService.show();
    this.frsService
      .Creditgl(this.credit_data.nativeElement.value, this.payment_id, 1)
      .pipe(delay(500),
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
        this.spinnerService.hide();
        let datas = results["data"];
        this.creditgl_list = datas;
        this.cat_id = this.creditgl_list.id;
        this.cdr.detectChanges();  
         console.log("main=>", this.creditgl_list[0],this.creditgl_list);         
      });

  }


  onSelectChange(selected: any): void {
    this.credit_data.selectedValue = selected; 
    this.credit_data.value = selected.gl_name;
    console.log("this.credit",this.credit_data.value)
  }
  creditgl_datasscroll() {
    this.hascred_next = true;
    this.hascred_previous = true;
    this.currentpagecred = 1;
    setTimeout(() => {
      if (
        this.creditgls &&
        this.autocompleteTrigger &&
        this.creditgls.panel
      ) {
        fromEvent(this.creditgls.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.creditgls.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop =this.creditgls.panel.nativeElement.scrollTop;
            const scrollHeight =this.creditgls.panel.nativeElement.scrollHeight;
            const elementHeight =this.creditgls.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hascred_next === true) {
                this.frsService
                  .Creditgl(
                    this.credit_data.nativeElement.value,
                    this.payment_id,
                    this.currentpagecred + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.creditgl_list = this.creditgl_list.concat(datas);
                    if (this.creditgl_list.length >= 0) {
                      this.hascred_next = datapagination.has_next;
                      this.hascred_previous = datapagination.has_previous;
                      this.currentpagecred = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  Product_value() {
    // this.frs_transaction.get("cat").reset();
    // this.frs_transaction.get("subcat").reset();
    // if(this.frs_payment.value.payment_type == null || this.frs_payment.value.payment_type == "" || this.frs_payment.value.payment_type == undefined){
    //   this.toastr.warning("","Please Select Payment Type")
    //   return false;
    // }
    // this.payment_id=this.frs_payment.value.payment_type.id
    if(this.frs_transaction.value.debitGL == "" || this.frs_transaction.value.debitGL ==null || this.frs_transaction.value.debitGL ==undefined){
      this.toastr.warning("","please Enter Debit Gl")
      return false
    }
    if(this.frs_transaction.value.debitacc?.name =='CASA'){
    if(this.frs_transaction.value.debitGL.length<16){
      this.toastr.warning("","please Enter Valid Debit Gl")
      return false
    }
  }
  
    this.spinnerService.show();
    this.frsService
      .getProductdropdown(this.Productdata.nativeElement.value, 1)
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
        this.spinnerService.hide();
        let datas = results["data"];
        this.product_list_data = datas;
      });
  }

  product_datasscroll() {
    setTimeout(() => {
      if (
        this.Product_auto &&
        this.autocompleteTrigger &&
        this.Product_auto.panel
      ) {
        fromEvent(this.Product_auto.panel.nativeElement, "scroll")
          .pipe(
            map(() => this.Product_auto.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.Product_auto.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.Product_auto.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.Product_auto.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.frsService
                  .getProductdropdown(
                    this.Productdata.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.product_list_data =
                      this.product_list_data.concat(datas);
                    if (this.product_list_data.length >= 0) {
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
  deleteInlineFile(fileindex) {
    console.log("fileindex", fileindex);
    let filedata = this.file_data;
    console.log("filedata for delete before", filedata);
    filedata.splice(fileindex, 1);
    console.log("filedata for delete after", filedata);
  }
  charcode(event) {
    return event.charCode >= 48;
  }

  debit_acoount_type(event) { 
    this.subcat_credit = event.name;
    console.log("Debit account type", this.subcat_credit);

    if (this.subcat_credit == "GL" && this.frs_payment.value.transtype?.id==1) {
     this.transdebit_gl() 
    } 
    if (this.subcat_credit == "GL" && this.frs_payment.value.transtype?.id==3) {
      this.frs_transaction.patchValue({
        debitGL: "275300110",
      });
     } 
     

      if(this.subcat_credit == "CASA"){      
        this.frs_transaction.get("debitGL").reset();
        this.frs_transaction.get("customertype").reset();
        this.frs_transaction.get("gstin").reset();      
      }
    

  }

  back_summary(){
    this.frsshareservice.submoduletab.next("summary")
    if( this.page_changes=="query"){    
      this.query_page=true
      this.nav_summary_page=false;
    this.edit_frs_screen=false;
      this.page_changes=""
    }else{
      this.query_page=false
    this.nav_summary_page=true;
    this.edit_frs_screen=false;
    }
  }


  reversepopclose(){
  this.FileAttachement.reset()
  }

  credit_kydown(event){
    console.log("down",event.code)
      if (event.code === 'Backspace') {
        this.frs_transaction.get("creditGL").reset();
        this.frs_transaction.get("creditGL_name").reset()
        this.Catagory_list = []
        this.credit_data.nativeElement.blur();
      }
    }

  Gst_number_validation_api(data){
    if(data.target.value.length<15){
    this.toastr.warning("Please Enter The Valid GST No")
    return false
    }
    let gst_no=data.target.value
    this.spinnerService.show()
    this.frsService.Gst_in_api(gst_no).subscribe((results) => {
      this.spinnerService.hide();
      let datas = results['validation_status'];  
      if(datas?.pradr){
        this.gst_not_valid="GST";
      console.log("gst no","NO"+datas.pradr.addr.pncd+datas.pradr.addr.st+datas.pradr.addr.stcd)
      let gst_addresss="NO/"+datas.pradr.addr.flno+','+datas.pradr.addr.loc+","+datas.pradr.addr.st+","+datas.pradr.addr.stcd+","+datas.pradr.addr.pncd
      console.log("gst_addresss",gst_addresss)
      this.frs_transaction.patchValue({
        gst_address:gst_addresss
      })
      this.frs_Walk_in.patchValue({
        cusname:datas.lgnm
      })
    }else{
      this.gst_not_valid="NOT GST";
     this.toastr.warning("GST Not Valid")
    }
    },error=>{
      this.gst_not_valid="NOT GST";
    } )      
  }

  email_validation(event){
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = emailPattern.test(event.target.value);
    console.log("isValidEmail",isValidEmail);
    this.email_validation_test=isValidEmail
    // if(this.frs_payment.value.custype?.id===4){
    if(this.email_validation_test === false){
      this.toastr.warning("", "Please  Enter the Valid Email", { timeOut: 1500 });
      return false;
    }
  
  }

}
