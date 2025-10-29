import { Component, OnInit, Injectable,ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { DtpcShareService } from '../dtpc-share.service';
import { Router } from '@angular/router'
import { DtpcService } from '../dtpc.service';
import { NgxSpinnerService } from "ngx-spinner";
import { from, Observable } from 'rxjs';
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map, share } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment'
import { NotificationService } from '../notification.service';
import { fromEvent } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ShareService } from 'src/app/atma/share.service';
// import { truncateSync } from 'fs';
// import { threadId } from 'worker_threads';

const isSkipLocationChange = environment.isSkipLocationChange

export interface ApplicationClass {
  id: number;
  ApplNo: string;
}
export interface BranchClass {
  id: number;
  name: string;
  code: string;

 
}
//---------------------------------------------
export interface BranchApplicationClass {
  id: number;
  ApplNo: string;
}
//----------------------------------------------
export interface InvoiceVendorClass {
  id: number;
  name: string;
}


export interface branchListss {
  name: string;
  codename: string;
  id: number;
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
//----------------------------------------------

export interface approvalVendorClass {
  id: number;
  name: string;
}

//-----------------------------------------------
// import { truncateSync } from 'fs';
// import { threadId } from 'worker_threads';
@Component({
  selector: 'app-los',
  templateUrl: './los.component.html',
  styleUrls: ['./los.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LosComponent implements OnInit {
  Los_Sub_Menu_List: any;
  sub_module_url: any;
  // pageSize = 10;
  Current_Page: string;

  is_los_summary: boolean;
  is_los_branch_summary: boolean;
  is_create_los: boolean;
  //--------------------------------------------------------------
  isLOSSummaryform: boolean;
  isLOSViewform: boolean;
  isLOSBranchSummaryform: boolean;
  isLOSBranchViewform: boolean;
  isLOSInvoiceSummaryform: boolean;
  isLOSInvoiceCreateform: boolean;
  isLOSInvoiceEditform: boolean;
  isLOSInvoiceViewform: boolean;
  isLOSInvoiceApprovalSummaryform: boolean;
  isLOSInvoiceApprovalViewform: boolean;
  isLOSReportSummaryform:boolean;
  isLOSProvisionReportform:boolean = false;
  isLOSRectifyform:boolean;
  isLOGlogform:boolean = false;

  urlprovision: any;
  urllos: any;// import { truncateSync } from 'fs';
  // import { threadId } from 'worker_threads';
  urllosbranch: any;
  urllosinvoice: any;
  urllosinvoiceapproval: any;
  urlreport:any;
  urlrectify:any;
  urllog: any;

  LOSpath: any;
  LOSbranchpath: any;
  LOSinvoicepath: any;
  LOSinvoiceapprovalpath: any;
  LOSreportpath:any;
  LOSprovision:any;
  LOSRectify:any;
  LOSLog:any;
  //-------------------------------------los variable -----------------------------
  vendorMasterList: any;
  applno: any;
  invoice_isEdit: any;
  losList: any;
  invoice_details_data: FormArray;
  pipe = new DatePipe('en-US');
  branchbank = 1;
  isLoading = false;
  // Los_Sub_Menu_List: any;
  // sub_module_url: any;
  // is_los_summary: boolean;
  // is_los_branch_summary: boolean;
  los_summary_data = []
  // is_create_los: boolean;
  losSummaryForm: FormGroup;
  isLosSummaryPagination: boolean;
  branchpatch: any;
  pageSize = 10;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  branap: any;




  has_losnext = true
  has_losprevious = true
  lospresentpage:number = 1
  lospagesize = 10

  has_losbranchnext = true
  has_losbranchprevious = true
  losbranchpresentpage:number = 1
  losbranchpagesize = 10

  has_losmakernext = true
  has_losmakerprevious = true
  losmakerpresentpage:number = 1
  losmakerpagesize = 10

  has_losapprovernext = true
  has_losapproverprevious = true
  losapproverpresentpage:number = 1
  losapproverpagesize = 10

  los_invoice_report_summary_data = []
  isLosReportSummaryPagination : boolean
  has_losreportnext = true
  has_losreportprevious = true
  reportpresentpage:number = 1
  losreportpagesize = 10
  //-------------------------------------------------------------------------------

  //-------------------------------------los branch variable -----------------------------

  bapplno: any;
  // pipe = new DatePipe('en-US'); ----already used
  // isLoading = false; ----already used
  los_branchsummary_data = []
  // is_create_los: boolean; ---not used
  losBranchSummaryForm: FormGroup;
  isLosBranchSummaryPagination: boolean;
  // branchpatch:any; ---not used
  BranchsummarypageSize = 10;
  Branchsummaryhas_next = true;
  Branchsummaryhas_previous = true;
  Branchcurrentpage: number = 1;
  Branchpresentpage: number = 1;
  //-------------------------------------------------------------------------------

  //-------------------------------------los invoice variable -----------------------------
  los_invoice_summary_data = []
  // is_create_los: boolean;
  losInvoiceSummaryForm: FormGroup;
  isLosInvoiceSummaryPagination: boolean;
  invoicesupplierNameData: any;
  // isLoading = false;
  chargeTypeList: any;
  LOSinvoicepageSize = 10;
  LOSinvoicehas_next = true;
  LOSinvoicehas_previous = true;
  LOSinvoicecurrentpage: number = 1;
  LOSinvoicepresentpage: number = 1;
  tokenValues: any
  pdfUrls: string;
  jpgUrls: string;
  fileextension: any;
  imageUrl = environment.apiURL;
  showPopupImages: boolean
  //-------------------------------------------------------------------------------

  //-------------------------------------los invoice approval variable -----------------------------
  los_invoice_approval_summary_data = []
  // is_create_los: boolean;
  losInvoiceApprovalSummaryForm: FormGroup;
  isLosApprovalSummaryPagination: boolean;
  ApprovalsupplierNameData: any;
  // isLoading = false;
  ApprovalchargeTypeList: any;
  BBranchlist:any

  ApprovalpageSize = 10;
  Approvalhas_next = true;
  Approvalhas_previous = true;
  Approvalcurrentpage: number = 1;
  Approvalpresentpage: number = 1;
  transdata: any;
  Branchlist: Array<branchListss>;
  isonbehalf:boolean;
  applicationpush:any
  losapppushsummary:any
  applicationpushurl:any
  losInvoiceReportSummaryForm: FormGroup
  losInvoiceRectifySummaryForm: FormGroup
  
  @ViewChild('branchtype') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('statusInput')statusInput:any;
  @ViewChild('branchtypeforapp') matappbranchAutocomplete: MatAutocomplete;
  @ViewChild('bbranchInput') bbranchInput: any;
  @ViewChild('bbranchtypeforapp') matappbbranchAutocomplete: MatAutocomplete;
  @ViewChild('bbranchrepInput') bbranchrepInput: any;
  @ViewChild('bbranchtypeforrep') matrepbranchAutocomplete: MatAutocomplete;
  @ViewChild('behalfbranchInput') behalfbranchInput: any;
  @ViewChild('losbehalfbranch') matbehalfbranchAutocomplete: MatAutocomplete;
  @ViewChild('losbranchInput') losbranchInput: any;
  @ViewChild('branchauto') matbranchautoAutocomplete: MatAutocomplete;
  @ViewChild('closebutton') closebutton;
 
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  statuslist = [{"name":"APPROVED"},{"name":"REJECTED"},{"name":"PENDING FOR APPROVAL"}]
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger2: MatAutocompleteTrigger;
  statustypelist = [{"name":"ALL"},{"name":"PENDING"}]
  
  //-------------------------------------------------------------------------------

  //--------------------------------------------------------------
  constructor(private sharedService: SharedService, private router: Router, private DtpcService: DtpcService, private datepipe: DatePipe,
    private fb: FormBuilder, private DtpcShareService: DtpcShareService, private SpinnerService: NgxSpinnerService, private notification: NotificationService,private dialog:MatDialog) { }

  ngOnInit(): void {
    // debugger;
    let datas = this.sharedService?.menuUrlData;
    this.Current_Page = "is_los_summary";
    // console.log(datas)
    datas?.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "LOS") {
        this.Los_Sub_Menu_List = subModule;
        this.LOSpath = subModule[0].name;
        // console.log("Los_Sub_Menu_List", this.Los_Sub_Menu_List)
      }
    });


    //-------------------------------------los oninit -----------------------------
    this.losSummaryForm = this.fb.group({
      branch: [''],
      application_no: [''],
      statustype:['']
    })
    let search_applno: String = "";
    let branch_name: string = "";
    let branch_code: string = "";
    this.Summaryapplication(search_applno);
    this.losSummaryForm.get('application_no').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.get_loanapp_dropdownLOS(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.applno = datas;
      })    
    this.Summaryapplication("");
 
    let branchskeyvalue: String = "";
    this.losbranchdropdown(branchskeyvalue);
    this.losSummaryForm.get('branch').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.DtpcService.getbranchscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branap = datas;
    })
   this.Summaryapplication("");
  this.DtpcShareService.Invoice_Data.next("")
  this.DtpcShareService.Invoice_isEdit.next("")
  // // this.reportsearch_loan_data(1);
  this.statustypelist = [{"name":"ALL"},{"name":"PENDING"}]

// let statuskeyvalue: String = "";
// this.Summaryapplication(statuskeyvalue);
// this.losSummaryForm.get('Status').valueChanges
// .pipe(
//   debounceTime(100),
//   distinctUntilChanged(),
//   tap(() => {
//     this.isLoading = true;
//   }),
//   switchMap(value => this.DtpcService.getstatusscroll(value, 1)
//     .pipe(
//       finalize(() => {
//         this.isLoading = false;
//       }),
//     )
//   )
// )
// .subscribe((results: any[]) => {
//   let datas = results["data"];
//   this.statuslist1 = datas;
// })
// this.Summaryapplication("");

// this.DtpcService.getstatusscroll(this.statusInput.nativeElement.value, this.currentpage + 1)
// .subscribe((results: any[]) => {
//   let datas = results["data"];
//   let datapagination = results["pagination"];
//   if (this.statuslist1.length >= 0) {
//     this.statuslist1 = this.statuslist1.concat(datas);
//     this.has_next = datapagination.has_next;
//     this.has_previous = datapagination.has_previous;
//     this.currentpage = datapagination.index;
//   }
// })








    // this.Branchapplication(branch_name, branch_code);
    // this.losSummaryForm.get('branch').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.DtpcService.get_branch_dropdown(value, value)
    //       // switchMap(value => this.DtpcService.get_branch_dropdown(value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false;
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let res = results["data"];
    //     debugger
    //     console.log(res);
    //     this.branap = res;
    //   })
    // this.Branchapplication("", "");
    // this.search('',1)
    //-------------------------------------------------------------------------------

    //-------------------------------------los branch oninit -----------------------------

    this.losBranchSummaryForm = this.fb.group({
      branch: [''],
      application_no: ['']
    })
    // this.branchsearch_data(1)
    let search_Summarybranch_appno: String = "";
    this.Summarybranchapplication(search_Summarybranch_appno);
    this.losBranchSummaryForm.get('application_no').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.get_loanapp_branchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let bdatas = results["data"];
        this.bapplno = bdatas;
      })
    this.Summarybranchapplication("");
    
    
    this.losbranchdropdown(branchskeyvalue);
    this.losBranchSummaryForm.get('branch').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.DtpcService.getbranchscroll(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.branap = datas;
    })
  
    //-------------------------------------------------------------------------------

    //-------------------------------------los invoice oninit -----------------------------
    this.losInvoiceSummaryForm = this.fb.group({
      ecf_number: [''],
      invoice_number: [''],
      application_no: [''],
      vendor: [''],
      Invoice_Date: [''],
      invoice_charge_type: [''],
      invoice__total_amount: [''],
      Branchcode:[''],
      Status:[''],
      updated_date:[''],
      behalfbranch:['']
      
    });
    this.DtpcShareService.Invoice_Data.next("")
    this.DtpcShareService.Invoice_isEdit.next("")
    // this.Invoicesearch_loan_data('',1);
    this.chargeTypeList = [{ "charge_type": "LEGAL_FEE" }, { "charge_type": "VALU_FEE" }]
    
    let Invoicesearch_suppliername: String = "";
    this.Invoice_search_supplier_get(Invoicesearch_suppliername);
    this.losInvoiceSummaryForm.get('vendor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.search_vendor_get(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.invoicesupplierNameData = datas;
        // console.log(this.invoicesupplierNameData)
      })


      let branchkeyvalue: String = "";
      this.branchdropdown(branchkeyvalue);
      this.losInvoiceSummaryForm.get('behalfbranch').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            // console.log('inside tap')
  
          }),
  
          switchMap(value => this.DtpcService.getbranchscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.Branchlist = datas;
         
        })
        let bbranchkeyvalue: String = "";
        this.branchdropdown(bbranchkeyvalue);
        this.losInvoiceSummaryForm.get('Branchcode').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              // console.log('inside tap')
    
            }),
    
            switchMap(value => this.DtpcService.getbranchscroll(value, 1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.Branchlist = datas;
           
          })

          this.Summaryapplication(search_applno);
          this.losInvoiceSummaryForm.get('application_no').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
              }),
              switchMap(value => this.DtpcService.get_loanapp_dropdownLOS(value, 1)
                .pipe(
                  finalize(() => {
                    this.isLoading = false;
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.applno = datas;
            })
            this.Summaryapplication("");
    //-------------------------------------------------------------------------------

    //-------------------------------------los invoice approval oninit -----------------------------
    this.losInvoiceApprovalSummaryForm = this.fb.group({
      ecf_number: [''],
      invoice_number: [''],
      application_no: [''],
      vendor: [''],
      Invoice_Date: [''],
      invoice_charge_type: [''],
      invoice__total_amount: [''],
      Branchcode:[''],
      Status:[''],
      updated_date:[''],
      behalf_branch:['']

    });
    this.DtpcShareService.Invoice_Data.next("")
    this.DtpcShareService.Invoice_isEdit.next("")
    // this.Approvalsearch_loan_data(1);
    this.ApprovalchargeTypeList = [{ "charge_type": "LEGAL_FEE" }, { "charge_type": "VALU_FEE" }]

    let Approvalsearch_suppliername: String = "";
    this.Approval_search_supplier_get(Approvalsearch_suppliername);
    this.losInvoiceApprovalSummaryForm.get('vendor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.search_vendor_get(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let Approvaldatas = results["data"];
        this.ApprovalsupplierNameData = Approvaldatas;
        // console.log(this.ApprovalsupplierNameData)
      })


      // let branchkeyvalue: String = "";
      this.branchdropdown(branchkeyvalue);
      this.losInvoiceApprovalSummaryForm.get('Branchcode').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            // console.log('inside tap')
  
          }),
  
          switchMap(value => this.DtpcService.getbranchscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.Branchlist = datas;
         
        })

        this.branchdropdown(branchkeyvalue);
        this.losInvoiceApprovalSummaryForm.get('behalf_branch').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              // console.log('inside tap')
    
            }),
    
            switchMap(value => this.DtpcService.getbranchscroll(value, 1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.Branchlist = datas;
           
          })

    this.Summaryapplication(search_applno);
    this.losInvoiceApprovalSummaryForm.get('application_no').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.get_loanapp_dropdownLOS(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.applno = datas;
      })
    this.Summaryapplication("");
    //-------------------------------------------------------------------------------
    this.losInvoiceReportSummaryForm = this.fb.group({
      ecf_number: [''],
      invoice_number: [''],
      application_no: [''],
      vendor: [''],
      Invoice_Date: [''],
      invoice_charge_type: [''],
      invoice__total_amount: [''],
      Branchcode:[''],
      Status:[''],
      updated_date:[''],
      behalf_branch:['']

    });
    this.DtpcShareService.Invoice_Data.next("")
    this.DtpcShareService.Invoice_isEdit.next("")
    // this.reportsearch_loan_data(1);
    this.ApprovalchargeTypeList = [{ "charge_type": "LEGAL_FEE" }, { "charge_type": "VALU_FEE" }]

    let Reportsearch_suppliername: String = "";
    this.Approval_search_supplier_get(Reportsearch_suppliername);
    this.losInvoiceReportSummaryForm.get('vendor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.search_vendor_get(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let Approvaldatas = results["data"];
        this.ApprovalsupplierNameData = Approvaldatas;
        // console.log(this.ApprovalsupplierNameData)
      })


      // let branchkeyvalue: String = "";
      this.branchdropdown(branchkeyvalue);
      this.losInvoiceReportSummaryForm.get('Branchcode').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            // console.log('inside tap')
  
          }),
  
          switchMap(value => this.DtpcService.getbranchscroll(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.Branchlist = datas;
         
        })

        this.branchdropdown(branchkeyvalue);
        this.losInvoiceReportSummaryForm.get('behalf_branch').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              // console.log('inside tap')
    
            }),
    
            switchMap(value => this.DtpcService.getbranchscroll(value, 1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.Branchlist = datas;
           
          })

    this.Summaryapplication(search_applno);
    this.losInvoiceReportSummaryForm.get('application_no').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.get_loanapp_dropdownLOS(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.applno = datas;
      })
      this.Summaryapplication("");

          this.losInvoiceRectifySummaryForm = this.fb.group({
            ecf_number: [''],
            invoice_number: [''],
            application_no: [''],
            vendor: [''],
            Invoice_Date: [''],
            invoice_charge_type: [''],
            invoice__total_amount: [''],
            Branchcode:[''],
            Status:[''],
            updated_date:[''],
            behalf_branch:[''],
            App_No:['']
      
          });

          
      this.losInvoiceRectifySummaryForm.get('App_No').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.DtpcService.get_loanapp_dropdownLOS(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.applno = datas;
      })
          this.DtpcShareService.Invoice_Data.next("")
          this.DtpcShareService.Invoice_isEdit.next("")
          // this.reportsearch_loan_data(1);
          this.ApprovalchargeTypeList = [{ "charge_type": "LEGAL_FEE" }, { "charge_type": "VALU_FEE" }]
      
          let Rectifysearch_suppliername: String = "";
          this.Approval_search_supplier_get(Rectifysearch_suppliername);
          this.losInvoiceRectifySummaryForm.get('vendor').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
              }),
              switchMap(value => this.DtpcService.search_vendor_get(value)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let Approvaldatas = results["data"];
              this.ApprovalsupplierNameData = Approvaldatas;
              // console.log(this.ApprovalsupplierNameData)
            })
      
      
            // let branchkeyvalue: String = "";
            this.branchdropdown(branchkeyvalue);
            this.losInvoiceRectifySummaryForm.get('Branchcode').valueChanges
              .pipe(
                debounceTime(100),
                distinctUntilChanged(),
                tap(() => {
                  this.isLoading = true;
                  // console.log('inside tap')
        
                }),
        
                switchMap(value => this.DtpcService.getbranchscroll(value, 1)
                  .pipe(
                    finalize(() => {
                      this.isLoading = false
                    }),
                  )
                )
              )
              .subscribe((results: any[]) => {
                let datas = results["data"];
                this.Branchlist = datas;
               
              })
      
              this.branchdropdown(branchkeyvalue);
              this.losInvoiceRectifySummaryForm.get('behalf_branch').valueChanges
                .pipe(
                  debounceTime(100),
                  distinctUntilChanged(),
                  tap(() => {
                    this.isLoading = true;
                    // console.log('inside tap')
          
                  }),
          
                  switchMap(value => this.DtpcService.getbranchscroll(value, 1)
                    .pipe(
                      finalize(() => {
                        this.isLoading = false
                      }),
                    )
                  )
                )
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  this.Branchlist = datas;
                 
                })
        
  
         this.getonbehalfdetails()

  }

  getonbehalfdetails(){
    this.DtpcService.getonbehalf().subscribe(result=>{
      this.isonbehalf = result?.is_onbehalfoff_hr
      console.log("bres",result)
    })
  }

  invSummarybranchapplication(search_invSummarybranch_appno) {
    this.SpinnerService.show()
    this.DtpcService.get_loanapp_branchdropdown(search_invSummarybranch_appno, 1)
      .subscribe((result) => {
        this.SpinnerService.hide()
        let Branchapplnoresult = result['data'];
        this.bapplno = Branchapplnoresult;
        // console.log(this.bapplno)
      })
  }
  

  losSubModule(data) {
    // debugger;

    this.sub_module_url = data.url;
    this.urllos = "/los_other"
    this.urllosbranch = "/los_branch"
    this.urllosinvoice = "/loc_invoice"
    this.urllosinvoiceapproval = "/los_invoiceapproval"
    this.urlreport = "/losreport"
    this.urlprovision = "/losprovision"
    this.urlrectify = "/losrectify"
    this.urllog = "/los_log"
    this.applicationpushurl = "/los_app_push"

    this.LOSpath = this.urllos === this.sub_module_url ? true : false;
    this.LOSbranchpath = this.urllosbranch === this.sub_module_url ? true : false;
    this.LOSinvoicepath = this.urllosinvoice === this.sub_module_url ? true : false;
    this.LOSinvoiceapprovalpath = this.urllosinvoiceapproval === this.sub_module_url ? true : false;
    this.LOSreportpath =  this.urlreport === this.sub_module_url ? true : false;
    this.LOSprovision =  this.urlprovision === this.sub_module_url ? true : false;
    this.LOSRectify = this.urlrectify === this.sub_module_url ? true : false;
    this.LOSLog = this.urllog === this.sub_module_url ? true : false;
    this.losapppushsummary = this.applicationpushurl === this.sub_module_url ? true :false;
    if (this.LOSprovision){
      this.isLOSSummaryform = false
      this.isLOSViewform = false
      this.isLOSBranchSummaryform = false
      this.isLOSBranchViewform = false
      this.isLOSInvoiceSummaryform = false
      this.isLOSInvoiceCreateform = false
      this.isLOSInvoiceEditform = false
      this.isLOSInvoiceViewform = false
      this.isLOSInvoiceApprovalSummaryform = false
      this.isLOSInvoiceApprovalViewform = false
      this.isLOSReportSummaryform = false
      this.isLOSProvisionReportform = true
      this.isLOSRectifyform = false
      this.isLOGlogform = false;
      this.applicationpush = false;
      this.search('',1);
      this.reset();
    }
    if (this.LOSpath) {
      this.isLOSSummaryform = true
      this.isLOSViewform = false
      this.isLOSBranchSummaryform = false
      this.isLOSBranchViewform = false
      this.isLOSInvoiceSummaryform = false
      this.isLOSInvoiceCreateform = false
      this.isLOSInvoiceEditform = false
      this.isLOSInvoiceViewform = false
      this.isLOSInvoiceApprovalSummaryform = false
      this.isLOSInvoiceApprovalViewform = false
      this.isLOSReportSummaryform = false
      this.isLOSProvisionReportform = false
      this.isLOSRectifyform = false
      this.isLOGlogform = false;
      this.applicationpush = false;
      this.search('',1);
      this.reset();
    }
    else if (this.LOSbranchpath) {

      this.isLOSSummaryform = false
      this.isLOSViewform = false
      this.isLOSBranchSummaryform = true
      this.isLOSBranchViewform = false
      this.isLOSInvoiceSummaryform = false
      this.isLOSInvoiceCreateform = false
      this.isLOSInvoiceEditform = false
      this.isLOSInvoiceViewform = false
      this.isLOSInvoiceApprovalSummaryform = false
      this.isLOSInvoiceApprovalViewform = false
      this.isLOSReportSummaryform = false
      this.isLOSProvisionReportform = false
      this.isLOSRectifyform = false
      this.isLOGlogform = false;
      this.applicationpush = false;
      this.branchsearch_data('',1);
      this.branchremove();
    }
    else if (this.LOSinvoicepath) {
      var answer = window.confirm(" Click add (+) for new entry")
      this.isLOSSummaryform = false
      this.isLOSViewform = false
      this.isLOSBranchSummaryform = false
      this.isLOSBranchViewform = false
      this.isLOSInvoiceSummaryform = true
      this.isLOSInvoiceCreateform = false
      this.isLOSInvoiceEditform = false
      this.isLOSInvoiceViewform = false
      this.isLOSInvoiceApprovalSummaryform = false
      this.isLOSInvoiceApprovalViewform = false
      this.isLOSReportSummaryform = false
      this.isLOSProvisionReportform = false
      this.isLOSRectifyform = false
      this.isLOGlogform = false;
      this.applicationpush = false;
      this.Invoicesearch_loan_data('',1);
      this.clear_LOSInvoiceform();
    }
    else if (this.LOSinvoiceapprovalpath) {

      this.isLOSSummaryform = false
      this.isLOSViewform = false
      this.isLOSBranchSummaryform = false
      this.isLOSBranchViewform = false
      this.isLOSInvoiceSummaryform = false
      this.isLOSInvoiceCreateform = false
      this.isLOSInvoiceEditform = false
      this.isLOSInvoiceViewform = false
      this.isLOSInvoiceApprovalSummaryform = true
      this.isLOSInvoiceApprovalViewform = false
      this.isLOSReportSummaryform = false
      this.isLOSProvisionReportform = false
      this.isLOSRectifyform = false
      this.isLOGlogform = false;
      this.applicationpush = false;
      this.Approvalsearch_loan_data('',1);
      this.clear_approvalform();
    }

    else if (this.LOSreportpath) {

      this.isLOSSummaryform = false
      this.isLOSViewform = false
      this.isLOSBranchSummaryform = false
      this.isLOSBranchViewform = false
      this.isLOSInvoiceSummaryform = false
      this.isLOSInvoiceCreateform = false
      this.isLOSInvoiceEditform = false
      this.isLOSInvoiceViewform = false
      this.isLOSInvoiceApprovalSummaryform = false
      this.isLOSInvoiceApprovalViewform = false
      this.isLOSReportSummaryform = true
      this.isLOSProvisionReportform = false
      this.isLOSRectifyform = false
      this.isLOGlogform = false;
      this.applicationpush = false;
      this.rectifysearch_loan_data('',1);
      this.clear_reportform();
    }
    else if (this.LOSRectify) {

      this.isLOSSummaryform = false
      this.isLOSViewform = false
      this.isLOSBranchSummaryform = false
      this.isLOSBranchViewform = false
      this.isLOSInvoiceSummaryform = false
      this.isLOSInvoiceCreateform = false
      this.isLOSInvoiceEditform = false
      this.isLOSInvoiceViewform = false
      this.isLOSInvoiceApprovalSummaryform = false
      this.isLOSInvoiceApprovalViewform = false
      this.isLOSReportSummaryform = false
      this.isLOSProvisionReportform = false
      this.isLOSRectifyform = true
      this.isLOGlogform = false;
      this.applicationpush = false;
      this.rectifysearch_loan_data('',1);
      this.clear_reportform();
    }
    else if (this.LOSLog) {
      this.isLOSSummaryform = false
      this.isLOSViewform = false
      this.isLOSBranchSummaryform = false
      this.isLOSBranchViewform = false
      this.isLOSInvoiceSummaryform = false
      this.isLOSInvoiceCreateform = false
      this.isLOSInvoiceEditform = false
      this.isLOSInvoiceViewform = false
      this.isLOSInvoiceApprovalSummaryform = false
      this.isLOSInvoiceApprovalViewform = false
      this.isLOSReportSummaryform = false
      this.isLOSProvisionReportform = false
      this.isLOSRectifyform = false
      this.isLOGlogform = true;
      this.applicationpush = false;
    }
      else if (this.losapppushsummary) {
      this.isLOSSummaryform = false
      this.isLOSViewform = false
      this.isLOSBranchSummaryform = false
      this.isLOSBranchViewform = false
      this.isLOSInvoiceSummaryform = false
      this.isLOSInvoiceCreateform = false
      this.isLOSInvoiceEditform = false
      this.isLOSInvoiceViewform = false
      this.isLOSInvoiceApprovalSummaryform = false
      this.isLOSInvoiceApprovalViewform = false
      this.isLOSReportSummaryform = false
      this.isLOSProvisionReportform = false
      this.isLOSRectifyform = false
      this.isLOGlogform = false;
      this.applicationpush = true
    }
  }
  // losSubmit() { }
  // losCancel() { }
  losViewCancel() {
    this.isLOSSummaryform = true
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSProvisionReportform = false
    this.isLOSRectifyform = false
    this.search('',1);
    this.reset();
  }
  // losBranchSubmit() { }
  // losBranchCancel() { }
  losViewBranchCancel() {
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = true
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSProvisionReportform = false
    this.isLOSRectifyform = false
    this.branchsearch_data('',1);
    this.branchremove();
  }
  // losInvoiceSubmit() { }
  // losInvoiceCancel() { }
  losInvoiceCreateSubmit() {
    this.Invoicesearch_loan_data('',1);
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = true
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSProvisionReportform = false
    this.isLOSRectifyform = false
    this.Invoicesearch_loan_data('',1);
    this.clear_LOSInvoiceform();
  }
  losInvoiceCreateCancel() {
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = true
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSProvisionReportform = false
    this.isLOSRectifyform = false
    this.Invoicesearch_loan_data('',1);
    this.clear_LOSInvoiceform();
  }
  losInvoiceEditSubmit() {
    this.Invoicesearch_loan_data('',1);
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = true
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSProvisionReportform = false
    this.isLOSRectifyform = false
    this.Invoicesearch_loan_data('',1);
    this.clear_LOSInvoiceform();
  }
  losInvoiceEditCancel() {
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = true
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSProvisionReportform = false
    this.isLOSRectifyform = false
    this.Invoicesearch_loan_data('',1);
    this.clear_LOSInvoiceform();
  }
  losInvoiceViewCancel() {
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSProvisionReportform = false
    if(this.DtpcShareService.viewdata.value =='rect'){
      this.isLOSRectifyform = true
      this.isLOSReportSummaryform = false
      this.isLOSInvoiceSummaryform = false
      this.rectifysearch_loan_data('',1);
      this.clear_rectifyform();
    }
    else if(this.DtpcShareService.viewdata.value =='rep'){
      this.isLOSReportSummaryform = true
      this.isLOSRectifyform = false
      this.isLOSInvoiceSummaryform = false
      this.reportsearch_loan_data('',1);
      this.clear_reportform();
    } 
    else if(this.DtpcShareService.viewdata.value =='inv'){
      this.isLOSInvoiceSummaryform = true
      this.isLOSReportSummaryform = false
      this.isLOSRectifyform = false
      this.Invoicesearch_loan_data('',1);
      this.clear_LOSInvoiceform();
    }
  }
  losReportViewCancel() {
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = true
    this.isLOSProvisionReportform = false
    this.isLOSRectifyform = false
    this.rectifysearch_loan_data('',1);
    this.clear_reportform();
  }
  losRectifyViewCancel() {
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSProvisionReportform = false
    this.isLOSRectifyform = true
    this.rectifysearch_loan_data('',1);
    this.clear_reportform();
  }
  losInvoiceApprovalSubmit() {
    this.Approvalsearch_loan_data('',1);
      this.clear_approvalform();
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = true
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSProvisionReportform = false
    this.isLOSRectifyform = false
  }
  losInvoiceApprovalCancel() {
    this.Approvalsearch_loan_data('',1);
    this.clear_approvalform();
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = true
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSProvisionReportform = false
    this.isLOSRectifyform = false
  }
  // losInvoiceApprovalViewCancel() {
  //   this.isLOSSummaryform = false
  //   this.isLOSViewform = false
  //   this.isLOSBranchSummaryform = false
  //   this.isLOSBranchViewform = false
  //   this.isLOSInvoiceSummaryform = false
  //   this.isLOSInvoiceCreateform = false
  //   this.isLOSInvoiceEditform = false
  //   this.isLOSInvoiceViewform = false
  //   this.isLOSInvoiceApprovalSummaryform = true
  //   this.isLOSInvoiceApprovalViewform = false
  // }

  //-------------------------------------los functionalities -----------------------------
  Summaryapplication(search_applno) {
    this.SpinnerService.show()
    this.DtpcService.get_loanapp_dropdownLOS(search_applno, 1)
      .subscribe((result) => {
        if (result?.code === 'Invalid Data') {
          this.notification.showError("The Data is Invalid");
          this.SpinnerService.hide();
        }
        else{
        this.SpinnerService.hide()
        let applnovar = result['data'];
        this.applno = applnovar;
         console.log(this.applno)
        }
      })
  }
 

  private losbranchdropdown(branchskeyvalue) {
    this.DtpcService.getbranch(branchskeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branap = datas;
       
  
      })
  }
  // private losstatusdropdown(statuskeyvalue)
  // {
  //   this.DtpcService.getstatus(statuskeyvalue)
  //   .subscribe((results:any[])=>{
  //     let datas=results["data"];
  //     this.statuslist1=datas;
  //   })
  // }
  // // Branchapplication(branch_name)
   

  public displayFnbranch(branchtype?: branchListss): string | undefined {

    return branchtype ? branchtype.codename : undefined;
  }
  

  get branchtype() {
    return this.losInvoiceSummaryForm.get('Branchcode');
  }
  

  public displayFnbranchapp(branchtypeforapp?: branchListss): string | undefined {

    return branchtypeforapp ? branchtypeforapp.codename : undefined;
  }

  get branchtypeforapp() {
    return this.losInvoiceApprovalSummaryForm.get('Branchcode');
  }

  public displayFnbbranchapp(bbranchtypeforapp?: branchListss): string | undefined {

    return bbranchtypeforapp ? bbranchtypeforapp.codename : undefined;
  }

  get bbranchtypeforapp() {
    return this.losInvoiceApprovalSummaryForm.get('behalf_branch');
  }

  public displayFnbranchrep(branchtypeforrep?: branchListss): string | undefined {

    return branchtypeforrep ? branchtypeforrep.codename : undefined;
  }

  get branchtypeforrep() {
    return this.losInvoiceReportSummaryForm.get('Branchcode');
  }
  
  public displayFnbbranchrep(bbranchtypeforrep?: branchListss): string | undefined {

    return bbranchtypeforrep ? bbranchtypeforrep.codename : undefined;
  }

  get bbranchtypeforrep() {
    return this.losInvoiceReportSummaryForm.get('behalf_branch');
  }

  public displayFnbbranchlos(losbehalfbranch?: branchListss): string | undefined {

    return losbehalfbranch ? losbehalfbranch.codename : undefined;
  }

  get losbehalfbranch() {
    return this.losInvoiceSummaryForm.get('behalfbranch');
  }


  
  
  
  private branchdropdown(branchkeyvalue) {
    this.DtpcService.getbranch(branchkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
       
  
      })
  }
  
  private branchesdropdown(branchkeysvalue) {
    this.DtpcService.getbranch(branchkeysvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Branchlist = datas;
       
  
      })
  }
  
  branchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.DtpcService.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }



  appbranchScroll() {
    setTimeout(() => {
      if (
        this.matappbranchAutocomplete &&
        this.matappbranchAutocomplete &&
        this.matappbranchAutocomplete.panel
      ) {
        fromEvent(this.matappbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matappbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matappbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.DtpcService.getbranchscroll(this.branchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  
  bappbranchScroll() {
    setTimeout(() => {
      if (
        this.matappbbranchAutocomplete &&
        this.matappbbranchAutocomplete &&
        this.matappbbranchAutocomplete.panel
      ) {
        fromEvent(this.matappbbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matappbbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matappbbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappbbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappbbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.DtpcService.getbranchscroll(this.bbranchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  reportbranchScroll(){
    setTimeout(() => {
      if (
        this.matrepbranchAutocomplete &&
        this.matrepbranchAutocomplete &&
        this.matrepbranchAutocomplete.panel
      ) {
        fromEvent(this.matrepbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matrepbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matrepbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matrepbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matrepbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.DtpcService.getbranchscroll(this.bbranchrepInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  
  belalfbranchScroll(){
    setTimeout(() => {
      if (
        this.matbehalfbranchAutocomplete &&
        this.matbehalfbranchAutocomplete &&
        this.matbehalfbranchAutocomplete.panel
      ) {
        fromEvent(this.matbehalfbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbehalfbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbehalfbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbehalfbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbehalfbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.DtpcService.getbranchscroll(this.behalfbranchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.Branchlist.length >= 0) {
                      this.Branchlist = this.Branchlist.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  losbranchScroll(){
    setTimeout(() => {
      if (
        this.matbranchautoAutocomplete &&
        this.matbranchautoAutocomplete &&
        this.matbranchautoAutocomplete.panel
      ) {
        fromEvent(this.matbranchautoAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchautoAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchautoAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchautoAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchautoAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.DtpcService.getbranchscroll(this.losbranchInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.branap.length >= 0) {
                      this.branap = this.branap.concat(datas);
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  
  


  
  // myclick(data) {
  // this.branchpatch=data.BranchName
  // this.losSummaryForm.patchValue({
  //   branch: this.branchpatch
  // })
  // }
  public displayFn(ApplicationClass?: ApplicationClass): string | undefined {
    // this.validate_application_fun(ApplicationClass)
    return ApplicationClass ? ApplicationClass.ApplNo : undefined;
  }
  get ApplicationClass() {
    return this.losSummaryForm.get('application_no');
  }
  public displaybranch(BranchClass?: BranchClass): string | undefined {
     return BranchClass ? BranchClass.name + BranchClass.code : undefined;
    //  return BranchClass ?  BranchClass.codename  : undefined;
  }
  get BranchClass() {
    return this.losSummaryForm.get('branch');
  }
  public displaylosbranch(branchauto?: BranchClass): string | undefined {
    return branchauto ? branchauto.name + branchauto.code : undefined;
   //  return BranchClass ?  BranchClass.codename  : undefined;
 }
 get branchauto() {
   return this.losBranchSummaryForm.get('branch');
 }
  // create_los() {
  //   debugger;
  //   this.router.navigate(['/createLos'], { skipLocationChange: true })
  // }
  get_summary(pageNumber = 1, pageSize = 10) {
    // debugger;
    this.los_summary_data = []
    this.SpinnerService.show()
    this.DtpcService.get_loan_summary(pageNumber, pageSize).subscribe((results) => {
      this.SpinnerService.hide();
      //let single_data={"data":results}
      // console.log(results)
      this.los_summary_data = results['data']
      let dataPagination = results['pagination'];
      if (this.los_summary_data.length > 0) {
        this.has_next = dataPagination.has_next;
        this.has_previous = dataPagination.has_previous;
        this.presentpage = dataPagination.index;
        this.isLosSummaryPagination = true;
      } if (this.los_summary_data.length === 0) {
        this.isLosSummaryPagination = false;
      }
    }, error => {
      this.SpinnerService.hide();
      let errorMessage = error.statusText;
      // console.log("Erorr" + errorMessage);
      return Observable.throw(error);
    });
  }

  lossort:any
 
  search(data,pageNumber = 1) {
    let sort = data
    this.lossort = sort
    let searchappl = this.losSummaryForm.value.application_no.ApplNo;
    // let searchbranch = this.losSummaryForm.value.branch.name;
    let searchbranchcode = this.losSummaryForm.value.branch.code;
    let searchstatus=this.losSummaryForm.value['statustype']['name'];
    if (searchappl === undefined) { searchappl = "" }
    // if (searchbranch === undefined) { searchbranch = "" }
    if (searchbranchcode === undefined) { searchbranchcode = "" }
    // console.log('before service', searchappl);
    if(searchstatus===undefined) { searchstatus="" }
    this.DtpcService.getLOSsummarySearch(searchappl,searchbranchcode,searchstatus,sort,pageNumber)
      .subscribe(results => {
        // console.log(" after service", result)
        this.los_summary_data = results['data']
      let dataPagination = results['pagination'];
      if (this.los_summary_data.length > 0) {
        this.has_losnext = dataPagination.has_next;
        this.has_losprevious = dataPagination.has_previous;
        this.lospresentpage = dataPagination.index;
        this.isLosSummaryPagination = true;
      } if (this.los_summary_data.length === 0) {
        this.isLosSummaryPagination = false;
      }
      
        // if (searchappl === '' && searchbranch === '' && searchbranchcode === '') {
        //   this.search(1);
        // }
        // return true
      })
  }

  
  nextClicklos() {
   if(this.has_losnext == true){
    this.search(this.lossort,this.lospresentpage + 1)
  }
}
  previousClicklos() {
    if(this.has_losprevious == true){
    this.search(this.lossort,this.lospresentpage - 1)
  }
}
  reset() {
    this.losSummaryForm.controls["application_no"].reset("")
    this.losSummaryForm.controls["branch"].reset("")
    this.losSummaryForm.controls["statustype"].reset("")
    this.search('',1)
  }
  view_los_data(data) {
    // debugger;
    this.DtpcShareService.Los_Data.next(data)
    this.DtpcShareService.LosCurrentPage.next("")
    // this.router.navigate(['/losviewdetails'], { skipLocationChange: false })
    this.isLOSSummaryform = false
    this.isLOSViewform = true
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
  }
  //-------------------------------------------------------------------------------

  //-------------------------------------los branch functionalities -----------------------------
  Summarybranchapplication(search_Summarybranch_appno) {
    this.SpinnerService.show()
    this.DtpcService.get_loanapp_branchdropdown(search_Summarybranch_appno, 1)
      .subscribe((result) => {
        this.SpinnerService.hide()
        let Branchapplnoresult = result['data'];
        this.bapplno = Branchapplnoresult;
        // console.log(this.bapplno)
      })
  }
  // myclick(data){
  //   // let searchlos = this.losSummaryForm.value.application_no.BApplNo;
  //   // this.branap=data.value
  //   this.branchpatch=data.BranchName
  //   this.losBranchSummaryForm.patchValue({
  //     branch: this.branchpatch
  //   })
  // }
  public branchdisplayFn(BranchApplicationClass?: BranchApplicationClass): string | undefined {
    return BranchApplicationClass ? BranchApplicationClass.ApplNo : undefined;
  }
  get BranchApplicationClass() {
    return this.losBranchSummaryForm.get('application_no');
  }
 
  view_branchlos_data(data) {
    // debugger;
    this.DtpcShareService.Los_Data.next(data)
    this.DtpcShareService.LosCurrentPage.next("")
    // this.router.navigate(['/losviewdetails'], { skipLocationChange: false })
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = true
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
  }
  get_branchsummary(branchpageNumber = 1, BranchsummarypageSize = 10) {
    // debugger;
    this.los_branchsummary_data = [];
    this.SpinnerService.show()
    this.DtpcService.get_Branch_loan_summary(branchpageNumber, BranchsummarypageSize).subscribe((results) => {
      this.SpinnerService.hide();
      //let single_data={"data":results}
      // console.log(results)
      this.los_branchsummary_data = results['data']
      let branchdataPagination = results['pagination'];
      if (this.los_branchsummary_data.length > 0) {
        this.Branchsummaryhas_next = branchdataPagination.has_next;
        this.Branchsummaryhas_previous = branchdataPagination.has_previous;
        this.Branchpresentpage = branchdataPagination.index;
        this.isLosBranchSummaryPagination = true;
      } if (this.los_branchsummary_data.length === 0) {
        this.isLosBranchSummaryPagination = false;
      }
    }, error => {
      this.SpinnerService.hide();
      let errorMessage = error.statusText;
      // console.log("Erorr" + errorMessage);
      return Observable.throw(error);
    });
  }
  losbranchsort:any
  branchsearch_data(data,pageNumber = 1) {
    let sort = data
    this.losbranchsort = sort
    let search = this.losBranchSummaryForm.value.application_no.ApplNo;
    let searchbranchcode = this.losBranchSummaryForm.value.branch.code;
    console.log("searchbranchcode",searchbranchcode)
  
    // if (searchbranch === undefined) { searchbranch = "" }
    if (searchbranchcode === undefined) { searchbranchcode = "" }
    if (search === undefined) { search = "" }
    // console.log('before service', search);
    this.DtpcService.getLOSbranchsummarySearch(search,searchbranchcode,sort,pageNumber)
      .subscribe(results => {
        this.los_branchsummary_data = results['data']
        console.log("los_branchsummary_data", this.los_branchsummary_data)
        let branchdataPagination = results['pagination'];
        if (this.los_branchsummary_data.length > 0) {
          this.has_losbranchnext = branchdataPagination.has_next;
          this.has_losbranchprevious = branchdataPagination.has_previous;
          this.losbranchpresentpage = branchdataPagination.index;
          this.isLosBranchSummaryPagination = true;
        } if (this.los_branchsummary_data.length === 0) {
          this.isLosBranchSummaryPagination = false;
        }
        // if (result.pagination.has_next === false && result.pagination.has_previous === false ) {
        //   this.isLosBranchSummaryPagination = false;
        // }
        // if (result.pagination.has_next === true) {
        //   this.isLosBranchSummaryPagination = true;
        // }
        // if (search === '') {
        //   this.get_branchsummary();
        // }
        // return true
      })
  }

  branchnextClick() {
    if(this.has_losbranchnext == true){
     this.branchsearch_data(this.losbranchsort,this.losbranchpresentpage + 1)
    }
   }
   branchpreviousClick() {
     if(this.has_losbranchprevious == true){
     this.branchsearch_data(this.losbranchsort,this.losbranchpresentpage - 1)
     }
   }
  branchremove() {
    this.losBranchSummaryForm.controls["application_no"].reset("")
    this.losBranchSummaryForm.controls["branch"].reset("")
    this.branchsearch_data(1)
  }
  //-------------------------------------------------------------------------------

  //-------------------------------------los invoice functionalities -----------------------------
  Invoice_search_supplier_get(value) {
    // debugger;
    // this.SpinnerService.show()
    this.DtpcService.search_vendor_get(value)
      .subscribe((results) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.invoicesupplierNameData = datas;
        // console.log(this.invoicesupplierNameData)

      })
  }

  public InvoicedisplayVendor(InvoiceVendorClass?: InvoiceVendorClass): string | undefined {
    return InvoiceVendorClass ? InvoiceVendorClass.name : undefined;
  }
  get InvoiceVendorClass() {
    return this.losInvoiceSummaryForm.get('vendor');
  }


  get_LOSinvoicesummary(LOSinvoicepageNumber = 1, LOSinvoicepageSize = 10) {
    // debugger;
    this.los_invoice_summary_data = []
    this.SpinnerService.show();
    this.DtpcService.get_invoice_summary(LOSinvoicepageNumber, LOSinvoicepageSize).subscribe((results) => {
      //let single_data={"data":results}
      // console.log(results)
      this.SpinnerService.hide();
      this.los_invoice_summary_data = results['data']
      let dataPagination = results['pagination'];

      if (this.los_invoice_summary_data.length > 0) {
        this.LOSinvoicehas_next = dataPagination.has_next;
        this.LOSinvoicehas_previous = dataPagination.has_previous;
        this.LOSinvoicepresentpage = dataPagination.index;
        this.isLosInvoiceSummaryPagination = true;
      } if (this.los_invoice_summary_data.length === 0) {
        this.isLosInvoiceSummaryPagination = false;
      }

    })

  }
 
  LOSmainID: any;
  LOSpatchdata: any;
  edit_los(invoice, isEdit) {
    this.LOSmainID = invoice.id

    this.DtpcService.LOSEditButton(this.LOSmainID)
      .subscribe(res => {
        // console.log("thisthispatch", res)
        this.LOSpatchdata = res;
        // console.log("edit click", this.LOSpatchdata);
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
        }
        this.DtpcShareService.LOSpatchmaindatas.next(this.LOSpatchdata);
        // this.router.navigate(['/ecfedit'])
        this.DtpcShareService.Invoice_Data.next(invoice)
        this.DtpcShareService.Invoice_isEdit.next(isEdit)
        this.altergstypefunction();
      })
  }
  editsupplierid: any;
  GSTType: any;

  altergstypefunction() {
    // if (this.GSTType === "" || this.GSTType === undefined || this.GSTType === null) {
    if (this.LOSpatchdata !== "" || this.LOSpatchdata !== undefined) {
      this.editsupplierid = this.LOSpatchdata.Supplier.id
      // this.DtpcService.GetbranchgstnumberGSTtype(this.editsupplierid)
      //   .subscribe((results) => {
      //     let datas = results;
          // this.branchgstnumber = datas.Branchgst
          // this.GSTType = datas.Gsttype
          // console.log("GST type", this.GSTType)
          // this.DtpcShareService.GSTtype.next(this.GSTType)
          // console.log("branchgst number", this.branchgstnumber)
          if (this.GSTType !== undefined) {
            // this.router.navigate(['/createLos'], { skipLocationChange: true })
            this.isLOSSummaryform = false
            this.isLOSViewform = false
            this.isLOSBranchSummaryform = false
            this.isLOSBranchViewform = false
            this.isLOSInvoiceSummaryform = false
            this.isLOSInvoiceCreateform = false
            this.isLOSInvoiceEditform = true
            this.isLOSInvoiceViewform = false
            this.isLOSInvoiceApprovalSummaryform = false
            this.isLOSInvoiceApprovalViewform = false
            this.isLOSReportSummaryform = false
          }
        // })
    }
  }

  create_los(invoice, isEdit) {
    // debugger;
    this.DtpcShareService.Invoice_Data.next(invoice)
    this.DtpcShareService.Invoice_isEdit.next(isEdit)
    // this.router.navigate(['/createLos'], { skipLocationChange: true })
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = true
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
  }

  // clear_form() {
  //   this.losSummaryForm.reset();
  // }
  //----------------------------------------------------- my changes ----------------------------------

  clear_LOSInvoiceform() {
    this.losInvoiceSummaryForm.controls['ecf_number'].reset("")
    this.losInvoiceSummaryForm.controls['invoice_number'].reset("")
    this.losInvoiceSummaryForm.controls['vendor'].reset("")
    this.losInvoiceSummaryForm.controls['invoice_charge_type'].reset("")
    this.losInvoiceSummaryForm.controls["Invoice_Date"].reset("")
    this.losInvoiceSummaryForm.controls['invoice__total_amount'].reset("")
    this.losInvoiceSummaryForm.controls['Branchcode'].reset("")
    this.losInvoiceSummaryForm.controls['Status'].reset("")
    this.losInvoiceSummaryForm.controls['updated_date'].reset("")
    this.losInvoiceSummaryForm.controls['behalfbranch'].reset("")
    this.losInvoiceSummaryForm.controls['application_no'].reset("")
    this.Invoicesearch_loan_data('',1);
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  searchbranchcode :any
  losinvoicesort:any
  searchbehalfbranchcode:any
  searchapplno:any
  Invoicesearch_loan_data(data,pageNumber = 1) {
    let sortby=data
    this.losinvoicesort = sortby
    let searchecfno = this.losInvoiceSummaryForm.value.ecf_number;
    // console.log('ecf number', searchecfno);
    let searchinvoiceno = this.losInvoiceSummaryForm.value.invoice_number;
    // console.log('searchinvoiceno ', searchinvoiceno);
    let searchchargetype = this.losInvoiceSummaryForm.value.invoice_charge_type;
    // console.log('searchchargetype', searchchargetype);
    let searchinvoiceamount = this.losInvoiceSummaryForm.value.invoice__total_amount;
    // console.log('searchinvoiceamount ', searchinvoiceamount);

    if(this.losInvoiceSummaryForm.value.application_no == "" || this.losInvoiceSummaryForm.value.application_no == undefined || this.losInvoiceSummaryForm.value.application_no == null){
      this.searchapplno = ""
    }else{
      this.searchapplno = this.losInvoiceSummaryForm.value.application_no.id;
    }
  
    if(this.losInvoiceSummaryForm.value.Branchcode == "" || this.losInvoiceSummaryForm.value.Branchcode == undefined || this.losInvoiceSummaryForm.value.Branchcode == null){
      this.searchbranchcode = ""
    }else{
      this.searchbranchcode = this.losInvoiceSummaryForm.value.Branchcode.id;
    }
    if(this.losInvoiceSummaryForm.value.behalfbranch == "" || this.losInvoiceSummaryForm.value.behalfbranch == undefined || this.losInvoiceSummaryForm.value.behalfbranch == null){
      this.searchbehalfbranchcode = ""
    }else{
      this.searchbehalfbranchcode = this.losInvoiceSummaryForm.value.behalfbranch.id;
    }
    
    let losstatus =  this.losInvoiceSummaryForm.value.Status
    if(losstatus == 'PENDING FOR APPROVAL'){
      losstatus = 'pending for approval'
    }
    // console.log('searchbranchcode ', this.searchbranchcode);
    // let date=this.losSummaryForm.value.Invoice_Date
    let searchinvoicedate = this.datepipe.transform(this.losInvoiceSummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
    let searchapproveddate = this.datepipe.transform(this.losInvoiceSummaryForm.value.updated_date, 'yyyy-MM-dd')
    // console.log('searchdate ', searchinvoicedate);
    if (searchinvoicedate === null && searchapproveddate == null) {
      this.DtpcService.getInvoiceLOSsummarySearch(searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount,this.searchbranchcode,losstatus,this.searchbehalfbranchcode,this.searchapplno,sortby,pageNumber)
        .subscribe(result => {
          // console.log(" after service", result)
          this.los_invoice_summary_data = result['data']
          let dataPagination = result['pagination'];

      if (this.los_invoice_summary_data.length > 0) {
        this.has_losmakernext = dataPagination.has_next;
        this.has_losmakerprevious = dataPagination.has_previous;
        this.losmakerpresentpage = dataPagination.index;
        this.isLosInvoiceSummaryPagination = true;
      } if (this.los_invoice_summary_data.length === 0) {
        this.isLosInvoiceSummaryPagination = false;
      }
          // if (result.pagination.has_next === false && result.pagination.has_previous === false ) {
          //   this.isLosInvoiceSummaryPagination = false;
          // }
          // if (result.pagination.has_next === true) {
          //   this.isLosInvoiceSummaryPagination = true;
          // }
          // if (searchecfno === '' && searchinvoiceno === '' && searchchargetype === '' && searchinvoiceamount === '' && this.searchbranchcode === '') {
          //   this.get_LOSinvoicesummary();
          // }
          // return true
        })
    } else {
      this.DtpcService.getInvoiceLOSsummarySearchdate(searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount, searchinvoicedate,searchapproveddate,this.searchbranchcode,this.searchbehalfbranchcode,this.searchapplno,losstatus,sortby,pageNumber)
        .subscribe(result => {
          // console.log(" after service", result)
          this.los_invoice_summary_data = result['data']
          let dataPagination = result['pagination'];

      if (this.los_invoice_summary_data.length > 0) {
        this.has_losmakernext = dataPagination.has_next;
        this.has_losmakerprevious = dataPagination.has_previous;
        this.losmakerpresentpage = dataPagination.index;
        this.isLosInvoiceSummaryPagination = true;
      } if (this.los_invoice_summary_data.length === 0) {
        this.isLosInvoiceSummaryPagination = false;
      }
          // if (result.pagination.has_next === false && result.pagination.has_previous === false ) {
          //   this.isLosInvoiceSummaryPagination = false;
          // }
          // if (result.pagination.has_next === true) {
          //   this.isLosInvoiceSummaryPagination = true;
          // }
          // if (searchecfno === '' && searchinvoiceno === '' && searchchargetype === '' && searchinvoiceamount === '' && searchinvoicedate === '' && this.searchbranchcode === '') {
          //   this.get_LOSinvoicesummary();
          // }
          // return true
        })
    }
  }

  LOSinvoicepreviousClick() {
    if(this.has_losmakerprevious == true){
    this.Invoicesearch_loan_data( this.losinvoicesort,this.losmakerpresentpage - 1)
  }
}
  LOSinvoicenextClick() {
    if(this.has_losmakernext == true){ 
    this.Invoicesearch_loan_data( this.losinvoicesort,this.losmakerpresentpage + 1)
  }
}



  Invoiceviewdata(data,datas) {
    // debugger;
    console.log("idd",data);
    this.SpinnerService.show();
    this.DtpcShareService.LOS_INV_APP_id.next(data.inv_header_id.id)

    this.DtpcShareService.LOS_id.next(data)

    this.DtpcShareService.LosCurrentPage.next("")
    // this.router.navigate(['/losappview'], { skipLocationChange: false })
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = true
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.DtpcShareService.viewdata.next(datas)
  this.SpinnerService.hide();
  }

 repInvoiceviewdata(data,datas) {
   console.log("datas",datas)
    // debugger;
    this.SpinnerService.show();
    this.DtpcShareService.LOS_INV_APP_id.next(data.inv_header_id.id)

    this.DtpcShareService.LOS_id.next(data)

    this.DtpcShareService.LosCurrentPage.next("")
    // this.router.navigate(['/losappview'], { skipLocationChange: false })
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = true
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = false
    this.isLOSReportSummaryform = false
    this.isLOSRectifyform = false
    this.DtpcShareService.viewdata.next(datas);
    this.SpinnerService.hide();
  }

  rectInvoiceviewdata(data,datas) {
    console.log("datas",datas)
     // debugger;
     this.SpinnerService.show();
     this.DtpcShareService.LOS_INV_APP_id.next(data.inv_header_id.id)
     this.DtpcShareService.LosCurrentPage.next("")
     this.DtpcShareService.LOS_id.next(data)
     // this.router.navigate(['/losappview'], { skipLocationChange: false })
     this.isLOSSummaryform = false
     this.isLOSViewform = false
     this.isLOSBranchSummaryform = false
     this.isLOSBranchViewform = false
     this.isLOSInvoiceSummaryform = false
     this.isLOSInvoiceCreateform = false
     this.isLOSInvoiceEditform = false
     this.isLOSInvoiceViewform = true
     this.isLOSInvoiceApprovalSummaryform = false
     this.isLOSInvoiceApprovalViewform = false
     this.isLOSReportSummaryform = false
     this.isLOSRectifyform = false
     this.DtpcShareService.viewdata.next(datas)
     this.SpinnerService.hide();
   }


  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.fileextension === "pdf") {
      this.showPopupImages = false
      window.open(this.imageUrl + "dtpcserv/dtpcfile/DTPC_1" + id);
    }
    else if (this.fileextension === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
      // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showPopupImages = true
      this.jpgUrls = this.imageUrl + "dtpcserv/dtpcfile/DTPC_" + id;
      // console.log("url", this.jpgUrls)
    }
    else {
      this.fileDownload(pdf_id, file_name)
      this.showPopupImages = false
    }
  };
  fileDownload(id, fileName) {
    this.DtpcService.fileDownloadForLOSInvoice(id)
      .subscribe((results) => {
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }
  //-------------------------------------------------------------------------------

  //-------------------------------------los invoice approval functionalities -----------------------------
  Approval_search_supplier_get(value) {
    // debugger;
    // this.SpinnerService.show()
    this.DtpcService.search_vendor_get(value)
      .subscribe((results) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.ApprovalsupplierNameData = datas;
        // console.log(this.ApprovalsupplierNameData)

      })
  }

  public ApproverdisplayVendor(approvalVendorClass?: approvalVendorClass): string | undefined {
    return approvalVendorClass ? approvalVendorClass.name : undefined;
  }
  get approvalVendorClass() {
    return this.losInvoiceApprovalSummaryForm.get('vendor');
  }

  public repdisplayVendor(repVendorClass?: approvalVendorClass): string | undefined {
    return repVendorClass ? repVendorClass.name : undefined;
  }
  get repVendorClass() {
    return this.losInvoiceReportSummaryForm.get('vendor');
  }

  get_LOS_Approval_summary(ApprovalpageNumber = 1, ApprovalpageSize = 10) {
    // debugger;
    this.los_invoice_approval_summary_data = []
    this.SpinnerService.show();
    this.DtpcService.get_invoice_approval_summary(ApprovalpageNumber, ApprovalpageSize).subscribe((results) => {
      //let single_data={"data":results}
      // console.log(results)
      this.SpinnerService.hide();
      this.los_invoice_approval_summary_data = results['data']
      let ApprovaldataPagination = results['pagination'];

      if (this.los_invoice_approval_summary_data.length > 0) {
        this.Approvalhas_next = ApprovaldataPagination.has_next;
        this.Approvalhas_previous = ApprovaldataPagination.has_previous;
        this.Approvalpresentpage = ApprovaldataPagination.index;
        this.isLosApprovalSummaryPagination = true;
      } if (this.los_invoice_approval_summary_data.length === 0) {
        this.isLosApprovalSummaryPagination = false;
      }
    })

  }


  //----------------------------------------------------- my changes ----------------------------------

  clear_approvalform() {
    this.losInvoiceApprovalSummaryForm.controls['ecf_number'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['invoice_number'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['vendor'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['invoice_charge_type'].reset("")
    this.losInvoiceApprovalSummaryForm.controls["Invoice_Date"].reset("")
    this.losInvoiceApprovalSummaryForm.controls['invoice__total_amount'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['Branchcode'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['Status'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['updated_date'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['behalf_branch'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['application_no'].reset("")
    this.Approvalsearch_loan_data('',1);
  }

  searchappbranch:any
  appinvoicesort:any
  searchbappbranch:any
  searchappapplno:any
  Approvalsearch_loan_data(data,pageNumber = 1) {
    let sort = data
    this.appinvoicesort = sort
    if(this.losInvoiceApprovalSummaryForm.value.application_no == "" || this.losInvoiceApprovalSummaryForm.value.application_no == undefined || this.losInvoiceApprovalSummaryForm.value.application_no == null){
      this.searchapplno = ""
    }else{
      this.searchapplno = this.losInvoiceApprovalSummaryForm.value.application_no.id;
    }
  
    let searchecfno = this.losInvoiceApprovalSummaryForm.value.ecf_number;
    // console.log('ecf number', searchecfno);
    let searchinvoiceno = this.losInvoiceApprovalSummaryForm.value.invoice_number;
    // console.log('searchinvoiceno ', searchinvoiceno);
    let searchchargetype = this.losInvoiceApprovalSummaryForm.value.invoice_charge_type;
    // console.log('searchchargetype', searchchargetype);
    let searchinvoiceamount = this.losInvoiceApprovalSummaryForm.value.invoice__total_amount;
    // console.log('searchinvoiceamount ', searchinvoiceamount);
    if(this.losInvoiceApprovalSummaryForm.value.Branchcode == "" || this.losInvoiceApprovalSummaryForm.value.Branchcode == undefined || this.losInvoiceApprovalSummaryForm.value.Branchcode == null){
      this.searchappbranch = ""
    }else{
      this.searchappbranch = this.losInvoiceApprovalSummaryForm.value.Branchcode.id;
    }

    if(this.losInvoiceApprovalSummaryForm.value.behalf_branch == "" || this.losInvoiceApprovalSummaryForm.value.behalf_branch == undefined || this.losInvoiceApprovalSummaryForm.value.behalf_branch == null){
      this.searchbappbranch = ""
    }else{
      this.searchbappbranch = this.losInvoiceApprovalSummaryForm.value.behalf_branch.id;
    }

    if(this.losInvoiceApprovalSummaryForm.value.application_no == "" || this.losInvoiceApprovalSummaryForm.value.application_no == undefined || this.losInvoiceApprovalSummaryForm.value.application_no == null){
      this.searchappapplno = ""
    }else{
      this.searchappapplno = this.losInvoiceApprovalSummaryForm.value.application_no.id;
    }

    let losstatus =  this.losInvoiceApprovalSummaryForm.value.Status
    if(losstatus == 'PENDING FOR APPROVAL'){
      losstatus = 'pending for approval'
    }
    // console.log('searchbranch ',  this.searchappbranch);
    // let date=this.losInvoiceSummaryForm.value.Invoice_Date
    let searchinvoicedate = this.datepipe.transform(this.losInvoiceApprovalSummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
    let searchapproveddate = this.datepipe.transform(this.losInvoiceApprovalSummaryForm.value.updated_date, 'yyyy-MM-dd')
    // console.log('searchdate ', searchinvoicedate);
    if (searchinvoicedate === null && searchapproveddate == null) {
      this.DtpcService.getInvoiceLOSappsummarySearch( searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount, 
        this.searchappbranch,losstatus,this.searchbappbranch,this.searchappapplno,sort,pageNumber)
        .subscribe(result => {
          // console.log(" after service", result)
          this.los_invoice_approval_summary_data = result['data']
      let ApprovaldataPagination = result['pagination'];

      if (this.los_invoice_approval_summary_data.length > 0) {
        this.has_losapprovernext = ApprovaldataPagination.has_next;
        this.has_losapproverprevious = ApprovaldataPagination.has_previous;
        this.losapproverpresentpage = ApprovaldataPagination.index;
        this.isLosApprovalSummaryPagination = true;
      } if (this.los_invoice_approval_summary_data.length === 0) {
        this.isLosApprovalSummaryPagination = false;
      }
          // if (result.pagination.has_next === false && result.pagination.has_previous === false ) {
          //   this.isLosApprovalSummaryPagination = false;
          // }
          // if (result.pagination.has_next === true) {
          //   this.isLosApprovalSummaryPagination = true;
          // }
          // if (searchecfno === '' && searchinvoiceno === '' && searchchargetype === '' && searchinvoiceamount === '' &&  this.searchappbranch === '') {
          //   this.get_LOS_Approval_summary();
          // }
          // return true
        })
    } else {
      this.DtpcService.getInvoiceLOSappsummarySearchdate(searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount, 
        searchinvoicedate, searchapproveddate,this.searchappbranch,this.searchappapplno,losstatus,this.searchbappbranch,sort,pageNumber)
        .subscribe(result => {
          // console.log(" after service", result)
          this.los_invoice_approval_summary_data = result['data']
      let ApprovaldataPagination = result['pagination'];

      if (this.los_invoice_approval_summary_data.length > 0) {
        this.has_losapprovernext = ApprovaldataPagination.has_next;
        this.has_losapproverprevious = ApprovaldataPagination.has_previous;
        this.losapproverpresentpage = ApprovaldataPagination.index;
        this.isLosApprovalSummaryPagination = true;
      } if (this.los_invoice_approval_summary_data.length === 0) {
        this.isLosApprovalSummaryPagination = false;
      }
          // if (result.pagination.has_next === false && result.pagination.has_previous === false ) {
          //   this.isLosApprovalSummaryPagination = false;
          // }
          // if (result.pagination.has_next === true) {
          //   this.isLosApprovalSummaryPagination = true;
          // }
          // if (searchecfno === '' && searchinvoiceno === '' && searchchargetype === '' && searchinvoiceamount === '' && searchinvoicedate === '' &&  this.searchappbranch === '') {
          //   this.get_LOS_Approval_summary();
          // }
          // return true
        })
    }
  }

  ApprovalnextClick() {
   if(this.has_losapprovernext === true){
    this.Approvalsearch_loan_data(this.appinvoicesort,this.losapproverpresentpage + 1)
   }
  }
  ApprovalpreviousClick() {
   if(this.has_losapproverprevious === true){
    this.Approvalsearch_loan_data(this.appinvoicesort,this.losapproverpresentpage - 1)
   }
  }

  clear_rectifyform() {
    this.losInvoiceRectifySummaryForm.controls['ecf_number'].reset("")
    this.losInvoiceRectifySummaryForm.controls['invoice_number'].reset("")
    this.losInvoiceRectifySummaryForm.controls['vendor'].reset("")
    this.losInvoiceRectifySummaryForm.controls['invoice_charge_type'].reset("")
    this.losInvoiceRectifySummaryForm.controls["Invoice_Date"].reset("")
    this.losInvoiceRectifySummaryForm.controls['invoice__total_amount'].reset("")
    this.losInvoiceRectifySummaryForm.controls['Branchcode'].reset("")
    this.losInvoiceRectifySummaryForm.controls['Status'].reset("")
    this.losInvoiceRectifySummaryForm.controls['updated_date'].reset("")
    this.losInvoiceRectifySummaryForm.controls['behalf_branch'].reset("")
    this.losInvoiceRectifySummaryForm.controls['application_no'].reset("")
    this.losInvoiceRectifySummaryForm.controls['App_No'].reset("")
    this.rectifysearch_loan_data('',1);
  }

  clear_reportform() {
    this.losInvoiceReportSummaryForm.controls['ecf_number'].reset("")
    this.losInvoiceReportSummaryForm.controls['invoice_number'].reset("")
    // this.losInvoiceReportSummaryForm.controls['vendor'].reset("")
    this.losInvoiceReportSummaryForm.controls['invoice_charge_type'].reset("")
    this.losInvoiceReportSummaryForm.controls["Invoice_Date"].reset("")
    this.losInvoiceReportSummaryForm.controls['invoice__total_amount'].reset("")
    this.losInvoiceReportSummaryForm.controls['Branchcode'].reset("")
    this.losInvoiceReportSummaryForm.controls['Status'].reset("")
    this.losInvoiceReportSummaryForm.controls['updated_date'].reset("")
    this.losInvoiceReportSummaryForm.controls['behalf_branch'].reset("")
    this.losInvoiceReportSummaryForm.controls['application_no'].reset("")
    // this.losInvoiceReportSummaryForm.controls['App_No'].reset("")
    this.reportsearch_loan_data('',1);
  }

  searchrepbranch:any
  bsearchrepbranch:any
  losreportsort:any
  searchrepapplno:any
  searchrepApp_no:any
  rectifysearch_loan_data(data,pageNumber = 1) {
    let sort = data
    this.losreportsort = sort
    let searchecfno = this.losInvoiceRectifySummaryForm.value.ecf_number;
    // console.log('ecf number', searchecfno);
    let searchinvoiceno = this.losInvoiceRectifySummaryForm.value.invoice_number;
    // console.log('searchinvoiceno ', searchinvoiceno);
    let searchchargetype = this.losInvoiceRectifySummaryForm.value.invoice_charge_type;
    // console.log('searchchargetype', searchchargetype);
    let searchinvoiceamount = this.losInvoiceRectifySummaryForm.value.invoice__total_amount;
    // console.log('searchinvoiceamount ', searchinvoiceamount);
    if(this.losInvoiceRectifySummaryForm.value.Branchcode == "" || this.losInvoiceRectifySummaryForm.value.Branchcode == undefined || this.losInvoiceRectifySummaryForm.value.Branchcode == null){
      this.searchrepbranch = ""
    }else{
      this.searchrepbranch = this.losInvoiceRectifySummaryForm.value.Branchcode.id;
    }
    if(this.losInvoiceRectifySummaryForm.value.behalf_branch == "" || this.losInvoiceRectifySummaryForm.value.behalf_branch == undefined || this.losInvoiceRectifySummaryForm.value.behalf_branch == null){
      this.bsearchrepbranch = ""
    }else{
      this.bsearchrepbranch = this.losInvoiceRectifySummaryForm.value.behalf_branch.id;
    }
    
    if(this.losInvoiceRectifySummaryForm.value.App_No == "" || this.losInvoiceRectifySummaryForm.value.App_No == undefined || this.losInvoiceRectifySummaryForm.value.App_No == null){
      this.searchrepApp_no = ""
    }else{
      this.searchrepApp_no = this.losInvoiceRectifySummaryForm.value.App_No.id;
    }

    let losstatus =  this.losInvoiceRectifySummaryForm.value.Status
    if(losstatus == 'PENDING FOR APPROVAL'){
      losstatus = 'pending for approval'
    }
    // console.log('searchbranch ',  this.searchappbranch);
    // let date=this.losInvoiceSummaryForm.value.Invoice_Date
    let searchinvoicedate = this.datepipe.transform(this.losInvoiceRectifySummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
    let searchapproveddate = this.datepipe.transform(this.losInvoiceRectifySummaryForm.value.updated_date, 'yyyy-MM-dd')
    // console.log('searchdate ', searchinvoicedate);
    if (searchinvoicedate === null && searchapproveddate == null ) {
      this.DtpcService.getInvoiceLOSappsummarySearch(searchecfno, searchinvoiceno, searchchargetype, 
        searchinvoiceamount, this.searchrepbranch,losstatus,this.bsearchrepbranch,this.searchrepApp_no,sort,pageNumber)
        .subscribe(result => {
          // console.log(" after service", result)
          this.los_invoice_report_summary_data = result['data']
          let ReportdataPagination = result['pagination'];

      if (this.los_invoice_report_summary_data.length > 0) {
        this.has_losreportnext = ReportdataPagination.has_next;
        this.has_losreportprevious = ReportdataPagination.has_previous;
        this.reportpresentpage = ReportdataPagination.index;
        this.isLosReportSummaryPagination = true;
      } if (this.los_invoice_report_summary_data.length === 0) {
        this.isLosReportSummaryPagination = false;
      }
          // if (result.pagination.has_next === false && result.pagination.has_previous === false ) {
          //   this.isLosApprovalSummaryPagination = false;
          // }
          // if (result.pagination.has_next === true) {
          //   this.isLosApprovalSummaryPagination = true;
          // }
          // if (searchecfno === '' && searchinvoiceno === '' && searchchargetype === '' && searchinvoiceamount === '' &&  this.searchappbranch === '') {
          //   this.get_LOS_Approval_summary();
          // }
          // return true
        })
    } else {
      this.DtpcService.getInvoiceLOSappsummarySearchdate(searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount, searchinvoicedate,
        searchapproveddate, this.searchrepbranch,this.searchrepapplno,losstatus,this.bsearchrepbranch,sort,pageNumber)
        .subscribe(result => {
          // console.log(" after service", result)
          this.los_invoice_report_summary_data = result['data']
          let ReportdataPagination = result['pagination'];

      if (this.los_invoice_report_summary_data.length > 0) {
        this.has_losreportnext = ReportdataPagination.has_next;
        this.has_losreportprevious = ReportdataPagination.has_previous;
        this.reportpresentpage = ReportdataPagination.index;
        this.isLosReportSummaryPagination = true;
      } if (this.los_invoice_report_summary_data.length === 0) {
        this.isLosReportSummaryPagination = false;
      }
          // if (result.pagination.has_next === false && result.pagination.has_previous === false ) {
          //   this.isLosApprovalSummaryPagination = false;
          // }
          // if (result.pagination.has_next === true) {
          //   this.isLosApprovalSummaryPagination = true;
          // }
          // if (searchecfno === '' && searchinvoiceno === '' && searchchargetype === '' && searchinvoiceamount === '' && searchinvoicedate === '' &&  this.searchappbranch === '') {
          //   this.get_LOS_Approval_summary();
          // }
          // return true
        })
    }
  }

  RectifynextClick() {
   if(this.has_losreportnext === true){
    this.rectifysearch_loan_data( this.losreportsort ,this.reportpresentpage + 1)
   }
  }
  RectifypreviousClick() {
   if(this.has_losreportprevious === true){
    this.rectifysearch_loan_data( this.losreportsort ,this.reportpresentpage - 1)
   }
  }


  reportsearch_loan_data(data,pageNumber = 1) {
    // debugger
    let sort = data
    this.losreportsort = sort
    let searchecfno = this.losInvoiceReportSummaryForm.value.ecf_number;
    // console.log('ecf number', searchecfno);
    let searchinvoiceno = this.losInvoiceReportSummaryForm.value.invoice_number;
    // console.log('searchinvoiceno ', searchinvoiceno);
    let searchchargetype = this.losInvoiceReportSummaryForm.value.invoice_charge_type;
    // console.log('searchchargetype', searchchargetype);
    let searchinvoiceamount = this.losInvoiceReportSummaryForm.value.invoice__total_amount;
    // console.log('searchinvoiceamount ', searchinvoiceamount);
    if(this.losInvoiceReportSummaryForm.value.Branchcode == "" || this.losInvoiceReportSummaryForm.value.Branchcode == undefined || this.losInvoiceReportSummaryForm.value.Branchcode == null){
      this.searchrepbranch = ""
    }else{
      this.searchrepbranch = this.losInvoiceReportSummaryForm.value.Branchcode.id;
    }
    if(this.losInvoiceReportSummaryForm.value.behalf_branch == "" || this.losInvoiceReportSummaryForm.value.behalf_branch == undefined || this.losInvoiceReportSummaryForm.value.behalf_branch == null){
      this.bsearchrepbranch = ""
    }else{
      this.bsearchrepbranch = this.losInvoiceReportSummaryForm.value.behalf_branch.id;
    }

    
    if(this.losInvoiceReportSummaryForm.value.application_no == "" || this.losInvoiceReportSummaryForm.value.application_no == undefined || this.losInvoiceReportSummaryForm.value.application_no == null){
      this.searchrepapplno = ""
    }else{
      this.searchrepapplno = this.losInvoiceReportSummaryForm.value.application_no.id;
    }

    
    // if(this.losInvoiceReportSummaryForm.value.App_No == "" || this.losInvoiceReportSummaryForm.value.App_No == undefined || this.losInvoiceReportSummaryForm.value.App_No == null){
    //   this.searchrepApp_no = ""
    // }else{
    //   this.searchrepApp_no = this.losInvoiceReportSummaryForm.value.App_No;
    // }

    let losstatus =  this.losInvoiceReportSummaryForm.value.Status
    if(losstatus == 'PENDING FOR APPROVAL'){
      losstatus = 'pending for approval'
    }
    // console.log('searchbranch ',  this.searchappbranch);
    // let date=this.losInvoiceSummaryForm.value.Invoice_Date
    let searchinvoicedate = this.datepipe.transform(this.losInvoiceReportSummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
    let searchapproveddate = this.datepipe.transform(this.losInvoiceReportSummaryForm.value.updated_date, 'yyyy-MM-dd')
    // console.log('searchdate ', searchinvoicedate);
    if (searchinvoicedate === null && searchapproveddate == null ) {
      this.DtpcService.getInvoiceLOSappsummarySearch(searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount, this.searchrepbranch,losstatus,this.bsearchrepbranch,this.searchrepapplno,sort,pageNumber)
        .subscribe(result => {
          // console.log(" after service", result)
          this.los_invoice_report_summary_data = result['data']
          let ReportdataPagination = result['pagination'];

      if (this.los_invoice_report_summary_data.length > 0) {
        this.has_losreportnext = ReportdataPagination.has_next;
        this.has_losreportprevious = ReportdataPagination.has_previous;
        this.reportpresentpage = ReportdataPagination.index;
        this.isLosReportSummaryPagination = true;
      } if (this.los_invoice_report_summary_data.length === 0) {
        this.isLosReportSummaryPagination = false;
      }
          // if (result.pagination.has_next === false && result.pagination.has_previous === false ) {
          //   this.isLosApprovalSummaryPagination = false;
          // }
          // if (result.pagination.has_next === true) {
          //   this.isLosApprovalSummaryPagination = true;
          // }
          // if (searchecfno === '' && searchinvoiceno === '' && searchchargetype === '' && searchinvoiceamount === '' &&  this.searchappbranch === '') {
          //   this.get_LOS_Approval_summary();
          // }
          // return true
        })
    } else {
      this.DtpcService.getInvoiceLOSappsummarySearchdate(searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount, searchinvoicedate,
        searchapproveddate, this.searchrepbranch,this.searchrepapplno,losstatus,this.bsearchrepbranch,sort,pageNumber)
        .subscribe(result => {
          // console.log(" after service", result)
          this.los_invoice_report_summary_data = result['data']
          let ReportdataPagination = result['pagination'];

      if (this.los_invoice_report_summary_data.length > 0) {
        this.has_losreportnext = ReportdataPagination.has_next;
        this.has_losreportprevious = ReportdataPagination.has_previous;
        this.reportpresentpage = ReportdataPagination.index;
        this.isLosReportSummaryPagination = true;
      } if (this.los_invoice_report_summary_data.length === 0) {
        this.isLosReportSummaryPagination = false;
      }
          // if (result.pagination.has_next === false && result.pagination.has_previous === false ) {
          //   this.isLosApprovalSummaryPagination = false;
          // }
          // if (result.pagination.has_next === true) {
          //   this.isLosApprovalSummaryPagination = true;
          // }
          // if (searchecfno === '' && searchinvoiceno === '' && searchchargetype === '' && searchinvoiceamount === '' && searchinvoicedate === '' &&  this.searchappbranch === '') {
          //   this.get_LOS_Approval_summary();
          // }
          // return true
        })
    }
  }

  ReportnextClick() {
   if(this.has_losreportnext === true){
    this.reportsearch_loan_data( this.losreportsort ,this.reportpresentpage + 1)
   }
  }
  ReportpreviousClick() {
   if(this.has_losreportprevious === true){
    this.reportsearch_loan_data( this.losreportsort ,this.reportpresentpage - 1)
   }
  }

  Approverejectviewdata(data) {
    // debugger;
    this.isLOSSummaryform = false
    this.isLOSViewform = false
    this.isLOSBranchSummaryform = false
    this.isLOSBranchViewform = false
    this.isLOSInvoiceSummaryform = false
    this.isLOSInvoiceCreateform = false
    this.isLOSInvoiceEditform = false
    this.isLOSInvoiceViewform = false
    this.isLOSInvoiceApprovalSummaryform = false
    this.isLOSInvoiceApprovalViewform = true
    this.isLOSReportSummaryform = false

    this.DtpcShareService.LOS_INV_APP_id.next(data.inv_header_id.id)
    this.DtpcShareService.LOS_INV_APP_data.next(data.Status)
    this.DtpcShareService.LosCurrentPage.next("")
    // this.router.navigate(['/losapprej'], { skipLocationChange: false })
  }
  //-------------------------------------------------------------------------------

  download(data){
    // console.log("============================>", data)
      let id = data.inv_header_id.id
      let jsonid = { "id": id }
      this.DtpcService.getpdfGRN(jsonid)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'Dtpc Claim' + ".pdf";
          link.click();
        })
    }

    exceldownload(){
      let searchappl = this.losSummaryForm.value.application_no.ApplNo;
      // let searchbranch = this.losSummaryForm.value.branch.name;
      let searchbranchcode = this.losSummaryForm.value.branch.code;
      let searchstatus=this.losSummaryForm.value.statustype;
      if (searchappl === undefined) { searchappl = "" }
      // if (searchbranch === undefined) { searchbranch = "" }
      if (searchbranchcode === undefined) { searchbranchcode = "" }
      if (searchstatus ===undefined) {searchstatus=""}
      this.DtpcService.getlossumm(searchappl, searchbranchcode,searchstatus)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'LOS Summary Report' + ".xlsx";
        link.click();
      })
    }
    branchexceldownload(){
      let search = this.losBranchSummaryForm.value.application_no.ApplNo;
      if (search === undefined) { search = "" }
      let searchbranchcode = this.losBranchSummaryForm.value.branch.code;
    
      if (searchbranchcode === undefined) { searchbranchcode = "" }
      this.DtpcService.getlosbranch(search, searchbranchcode)
      .subscribe((data) => {
        if(data?.data != undefined){
          this.notification.showError("No Data available.")
          return false
        }
        else if(data?.Message != undefined){
          this.notification.showError(data.Message)
          return false
        }
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'LOS Branch Summary Report' + ".xlsx";
        link.click();
      })
      }
    losexceldownload(){
      let searchecfno = this.losInvoiceSummaryForm.value.ecf_number;
    // console.log('ecf number', searchecfno);
    let searchinvoiceno = this.losInvoiceSummaryForm.value.invoice_number;
    // console.log('searchinvoiceno ', searchinvoiceno);
    let searchchargetype = this.losInvoiceSummaryForm.value.invoice_charge_type;
    // console.log('searchchargetype', searchchargetype);
    let searchinvoiceamount = this.losInvoiceSummaryForm.value.invoice__total_amount;
    // console.log('searchinvoiceamount ', searchinvoiceamount);
  
    if(this.losInvoiceSummaryForm.value.application_no == "" || this.losInvoiceSummaryForm.value.application_no == undefined || this.losInvoiceSummaryForm.value.application_no == null){
      this.searchapplno = ""
    }else{
      this.searchapplno = this.losInvoiceSummaryForm.value.application_no.id;
    }
  
    if(this.losInvoiceSummaryForm.value.Branchcode == "" || this.losInvoiceSummaryForm.value.Branchcode == undefined || this.losInvoiceSummaryForm.value.Branchcode == null){
      this.searchbranchcode = ""
    }else{
      this.searchbranchcode = this.losInvoiceSummaryForm.value.Branchcode.id;
    }

    let losstatus =  this.losInvoiceSummaryForm.value.Status
      if(losstatus == 'PENDING FOR APPROVAL'){
        losstatus = 'pending for approval'
      }
    // console.log('searchbranchcode ', this.searchbranchcode);
    // let date=this.losSummaryForm.value.Invoice_Date
    let searchinvoicedate = this.datepipe.transform(this.losInvoiceSummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
    let searchapproveddate = this.datepipe.transform(this.losInvoiceApprovalSummaryForm.value.updated_date, 'yyyy-MM-dd')
    // console.log('searchdate ', searchinvoicedate);
    if (searchinvoicedate === null && searchapproveddate === null){
      this.DtpcService.getlosmaker(this.searchapplno, searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount,this.searchbranchcode,losstatus)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'LOS Invoicemaker Report' + ".xlsx";
        link.click();
      })
    }else{
      this.DtpcService.getlosmakerdate(this.searchapplno, searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount,searchinvoicedate,searchapproveddate,this.searchbranchcode,losstatus)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'LOS Invoicemaker Report' + ".xlsx";
        link.click();
      })
    }
    }
    applosexceldownload(){
      
      if(this.losInvoiceApprovalSummaryForm.value.application_no == "" || this.losInvoiceApprovalSummaryForm.value.application_no == undefined || this.losInvoiceApprovalSummaryForm.value.application_no == null){
        this.searchappapplno = ""
      }else{
        this.searchappapplno = this.losInvoiceApprovalSummaryForm.value.application_no.id;
      }
      let searchecfno = this.losInvoiceApprovalSummaryForm.value.ecf_number;
      // console.log('ecf number', searchecfno);
      let searchinvoiceno = this.losInvoiceApprovalSummaryForm.value.invoice_number;
      // console.log('searchinvoiceno ', searchinvoiceno);
      let searchchargetype = this.losInvoiceApprovalSummaryForm.value.invoice_charge_type;
      // console.log('searchchargetype', searchchargetype);
      let searchinvoiceamount = this.losInvoiceApprovalSummaryForm.value.invoice__total_amount;
      // console.log('searchinvoiceamount ', searchinvoiceamount);
      if(this.losInvoiceApprovalSummaryForm.value.Branchcode == "" || this.losInvoiceApprovalSummaryForm.value.Branchcode == undefined || this.losInvoiceApprovalSummaryForm.value.Branchcode == null){
        this.searchappbranch = ""
      }else{
        this.searchappbranch = this.losInvoiceApprovalSummaryForm.value.Branchcode.id;
      }

      let losstatus =  this.losInvoiceApprovalSummaryForm.value.Status
      if(losstatus == 'PENDING FOR APPROVAL'){
        losstatus = 'pending for approval'
      }
      // console.log('searchbranch ',  this.searchappbranch);
      // let date=this.losInvoiceSummaryForm.value.Invoice_Date
      let searchinvoicedate = this.datepipe.transform(this.losInvoiceApprovalSummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
      let searchapproveddate = this.datepipe.transform(this.losInvoiceApprovalSummaryForm.value.updated_date, 'yyyy-MM-dd')
      // console.log('searchdate ', searchinvoicedate);
      if (searchinvoicedate === null && searchapproveddate == null ) {
      this.DtpcService.getlosapproval(this.searchappapplno, searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount, this.searchappbranch,losstatus)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'LOS Invoiceapproval Report' + ".xlsx";
        link.click();
      })
    }else{
      this.DtpcService.getlosapprovaldate(this.searchappapplno ,searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount,searchinvoicedate,searchapproveddate,this.searchappbranch,losstatus
        
        )
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'LOS Invoiceapproval Report' + ".xlsx";
        link.click();
      })
    }
    }

    replosexceldownload(){
       
    if(this.losInvoiceReportSummaryForm.value.application_no == "" || this.losInvoiceReportSummaryForm.value.application_no == undefined || this.losInvoiceReportSummaryForm.value.application_no == null){
      this.searchrepapplno = ""
    }else{
      this.searchrepapplno = this.losInvoiceReportSummaryForm.value.application_no.id;
    }

      let searchecfno = this.losInvoiceReportSummaryForm.value.ecf_number;
      // console.log('ecf number', searchecfno);
      let searchinvoiceno = this.losInvoiceReportSummaryForm.value.invoice_number;
      // console.log('searchinvoiceno ', searchinvoiceno);
      let searchchargetype = this.losInvoiceReportSummaryForm.value.invoice_charge_type;
      // console.log('searchchargetype', searchchargetype);
      let searchinvoiceamount = this.losInvoiceReportSummaryForm.value.invoice__total_amount;
      // console.log('searchinvoiceamount ', searchinvoiceamount);
      if(this.losInvoiceReportSummaryForm.value.Branchcode == "" || this.losInvoiceReportSummaryForm.value.Branchcode == undefined || this.losInvoiceReportSummaryForm.value.Branchcode == null){
        this.searchrepbranch = ""
      }else{
        this.searchrepbranch = this.losInvoiceReportSummaryForm.value.Branchcode.id;
      }

      let losstatus =  this.losInvoiceReportSummaryForm.value.Status
      if(losstatus == 'PENDING FOR APPROVAL'){
        losstatus = 'pending for approval'
      }
      // console.log('searchbranch ',  this.searchappbranch);
      // let date=this.losInvoiceSummaryForm.value.Invoice_Date
      let searchinvoicedate = this.datepipe.transform(this.losInvoiceReportSummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
      let searchapproveddate = this.datepipe.transform(this.losInvoiceReportSummaryForm.value.updated_date, 'yyyy-MM-dd')
      // console.log('searchdate ', searchinvoicedate);
      if (searchinvoicedate === null && searchapproveddate == null) {
      this.DtpcService.getlosapproval(this.searchrepapplno, searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount, this.searchrepbranch,losstatus)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'LOS Report' + ".xlsx";
        link.click();
      })
    }else{
      this.DtpcService.getlosapprovaldate(this.searchrepapplno, searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount,searchinvoicedate,searchapproveddate,this.searchrepbranch,losstatus)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'LOS Report' + ".xlsx";
        link.click();
      })
    }
    }
    gettranshistory(id){
      this.DtpcService.gettranshistory(id).subscribe(
          result=>{
          this.transdata=result['data']
        
      }
      )
    }
    tranback(){
      this.closebutton.nativeElement.click()
    }
    provisionreport(){
      this.SpinnerService.show()
      this.DtpcService.getprovisionreport().subscribe((result)=>{
        this.SpinnerService.hide()
        let binaryData = [];
          binaryData.push(result)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'LOS Provision Report'+".xlsx";
          link.click();
        
    })
  }
  }