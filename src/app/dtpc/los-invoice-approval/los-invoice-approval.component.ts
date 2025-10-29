import { Component, OnInit, Injectable } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DtpcShareService } from '../dtpc-share.service';
import { Router } from '@angular/router'
import { DtpcService } from '../dtpc.service';
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { NotificationService } from '../notification.service';


export interface approvalVendorClass {
  id: number;
  name: string;
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

@Component({
  selector: 'app-los-invoice-approval',
  templateUrl: './los-invoice-approval.component.html',
  styleUrls: ['./los-invoice-approval.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LosInvoiceApprovalComponent implements OnInit {
  // vendorMasterList: any;

  // branchbank = 1;
  // Los_Sub_Menu_List: any;
  // sub_module_url: any;
  // is_los_summary: boolean;
  // is_los_branch_summary: boolean;
  los_invoice_approval_summary_data = []
  // is_create_los: boolean;
  losInvoiceApprovalSummaryForm: FormGroup;
  isLosApprovalSummaryPagination: boolean;
  ApprovalsupplierNameData: any;
  isLoading = false;
  ApprovalchargeTypeList: any;

  ApprovalpageSize = 10;
  Approvalhas_next = true;
  Approvalhas_previous = true;
  Approvalcurrentpage: number = 1;
  Approvalpresentpage: number = 1;

  constructor(private sharedService: SharedService, private router: Router, private DtpcService: DtpcService, private datepipe: DatePipe,
    private fb: FormBuilder, private DtpcShareService: DtpcShareService, private SpinnerService: NgxSpinnerService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.losInvoiceApprovalSummaryForm = this.fb.group({
      ecf_number: [''],
      invoice_number: [''],
      application_no: [''],
      vendor: [''],
      Invoice_Date: [''],
      invoice_charge_type: [''],
      invoice__total_amount: [''],

    });
    this.DtpcShareService.Invoice_Data.next("")
    this.DtpcShareService.Invoice_isEdit.next("")
    this.get_LOS_Approval_summary();
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
        console.log(this.ApprovalsupplierNameData)
      })

  }

  Approval_search_supplier_get(value) {
    // debugger;
    // this.SpinnerService.show()
    this.DtpcService.search_vendor_get(value)
      .subscribe((results) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.ApprovalsupplierNameData = datas;
        console.log(this.ApprovalsupplierNameData)

      })
  }

  public ApproverdisplayVendor(approvalVendorClass?: approvalVendorClass): string | undefined {
    return approvalVendorClass ? approvalVendorClass.name : undefined;
  }
  get approvalVendorClass() {
    return this.losInvoiceApprovalSummaryForm.get('vendor');
  }


  get_LOS_Approval_summary(ApprovalpageNumber = 1, ApprovalpageSize = 10) {
    // debugger;
    this.los_invoice_approval_summary_data = []
    this.SpinnerService.show();
    this.DtpcService.get_invoice_approval_summary(ApprovalpageNumber, ApprovalpageSize).subscribe((results) => {
      //let single_data={"data":results}
      console.log(results)
      this.SpinnerService.hide();
      this.los_invoice_approval_summary_data = results['data']
      let ApprovaldataPagination = results['pagination'];

      if (this.los_invoice_approval_summary_data.length >= 0) {
        this.Approvalhas_next = ApprovaldataPagination.has_next;
        this.Approvalhas_previous = ApprovaldataPagination.has_previous;
        this.Approvalpresentpage = ApprovaldataPagination.index;
        this.isLosApprovalSummaryPagination = true;
      } if (this.los_invoice_approval_summary_data.length <= 0) {
        this.isLosApprovalSummaryPagination = false;
      }

    })

  }
  ApprovalnextClick() {
    this.Approvalcurrentpage = this.Approvalpresentpage + 1
    this.get_LOS_Approval_summary(this.Approvalpresentpage + 1, 10)
  }
  ApprovalpreviousClick() {
    this.Approvalcurrentpage = this.Approvalpresentpage - 1
    this.get_LOS_Approval_summary(this.Approvalpresentpage - 1, 10)
  }

  // search_loan_data() {
  //   debugger;
  //   this.currentpage = 1;
  //   this.presentpage = 1;
  //   this.los_invoice_summary_data = []
  //   this.get_summary();

  // }
  // view_los_data(data) {
  //   debugger;
  //   this.DtpcShareService.Los_Data.next(data)
  //   this.DtpcShareService.LosCurrentPage.next("")
  //   this.router.navigate(['/losviewdetails'], { skipLocationChange: false })

  // }
  // LOSmainID: any;
  // LOSpatchdata: any;
  // edit_los(invoice, isEdit) {
  //   this.LOSmainID = invoice.id

  //   this.DtpcService.LOSEditButton(this.LOSmainID)
  //     .subscribe(res => {
  //       console.log("thisthispatch", res)
  //       this.LOSpatchdata = res;
  //       console.log("edit click", this.LOSpatchdata);
  //       if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
  //         this.notification.showError("Duplicate! [INVALID_DATA! ...]")
  //       }
  //       this.DtpcShareService.LOSpatchmaindatas.next(this.LOSpatchdata);
  //       // this.router.navigate(['/ecfedit'])

  //       this.DtpcShareService.Invoice_Data.next(invoice)
  //       this.DtpcShareService.Invoice_isEdit.next(isEdit)
  //       this.router.navigate(['/createLos'], { skipLocationChange: true })
  //     })
  // }

  // create_los(invoice, isEdit) {
  //   debugger;
  //   this.DtpcShareService.Invoice_Data.next(invoice)
  //   this.DtpcShareService.Invoice_isEdit.next(isEdit)
  //   this.router.navigate(['/createLos'], { skipLocationChange: true })
  // }

  // clear_form() {
  //   this.losInvoiceSummaryForm.reset();
  // }
  //----------------------------------------------------- my changes ----------------------------------



  clear_approvalform() {
    this.losInvoiceApprovalSummaryForm.controls['ecf_number'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['invoice_number'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['vendor'].reset("")
    this.losInvoiceApprovalSummaryForm.controls['invoice_charge_type'].reset("")
    this.losInvoiceApprovalSummaryForm.controls["Invoice_Date"].reset("")
    this.losInvoiceApprovalSummaryForm.controls['invoice__total_amount'].reset("")
    this.get_LOS_Approval_summary();
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

  // search_loan_data1() {
  //   let searchlos = this.losInvoiceApprovalSummaryForm.value;
  //   console.log('data for searchlos', searchlos);
  //   searchlos.Invoice_Date = this.datepipe.transform(this.losInvoiceApprovalSummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
  //   console.log('searchdate ', searchlos.Invoice_Date);
  //   if (searchlos.Invoice_Date === null) {
  //     searchlos.Invoice_Date = ''
  //     console.log("searched name", searchlos.Invoice_Date)
  //   }
    // for (let i in searchlos) {
      
    //   if (searchlos[i] === null || searchlos[i] === "") {
    //     delete searchlos[i];
    //   }
    // }
    // this.DtpcService.getInvoiceLOSsummarySearch1(searchlos)
    //   .subscribe(result => {
    //     console.log("grnList search result", result) 
    //     this.los_invoice_approval_summary_data = result['data'];
        // if (searchlos.ecf_number === '' && searchlos.invoice_number === '' && searchlos.invoice_charge_type === '' && searchlos.invoice__total_amount === ''
        //   && searchlos.Invoice_Date === '' && searchlos.vendor === '') {
        //   this.get_summary();
        // }
        // return true
  //     })
  // }
  Approvalsearch_loan_data() {
    let searchecfno = this.losInvoiceApprovalSummaryForm.value.ecf_number;
    console.log('ecf number', searchecfno);
    let searchinvoiceno = this.losInvoiceApprovalSummaryForm.value.invoice_number;
    console.log('searchinvoiceno ', searchinvoiceno);
    let searchchargetype = this.losInvoiceApprovalSummaryForm.value.invoice_charge_type;
    console.log('searchchargetype', searchchargetype);
    let searchinvoiceamount = this.losInvoiceApprovalSummaryForm.value.invoice__total_amount;
    console.log('searchinvoiceamount ', searchinvoiceamount);
    // let date=this.losInvoiceSummaryForm.value.Invoice_Date
    let searchinvoicedate = this.datepipe.transform(this.losInvoiceApprovalSummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
    console.log('searchdate ', searchinvoicedate);
    if (searchinvoicedate === null) {
      this.DtpcService.getInvoiceLOSsummarySearch(searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount)
        .subscribe(result => {
          console.log(" after service", result)
          this.los_invoice_approval_summary_data = result['data'];
        })
    } else {
      this.DtpcService.getInvoiceLOSsummarySearchdate(searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount, searchinvoicedate)
        .subscribe(result => {
          console.log(" after service", result)
          this.los_invoice_approval_summary_data = result['data'];
        })
    }
  }
  
  Approverejectviewdata(data) {
    // debugger;
    this.DtpcShareService.LOS_INV_APP_id.next(data.id)
    this.DtpcShareService.LosCurrentPage.next("")
    this.router.navigate(['/losapprej'], { skipLocationChange: false })
  }
}
