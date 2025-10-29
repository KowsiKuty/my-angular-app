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
import { environment } from 'src/environments/environment'

const isSkipLocationChange = environment.isSkipLocationChange

export interface InvoiceVendorClass {
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
  selector: 'app-los-invoice-summary',
  templateUrl: './los-invoice-summary.component.html',
  styleUrls: ['./los-invoice-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LosInvoiceSummaryComponent implements OnInit {
  // vendorMasterList: any;

  // branchbank = 1;
  // Los_Sub_Menu_List: any;
  // sub_module_url: any;
  // is_los_summary: boolean;
  // is_los_branch_summary: boolean;
  los_invoice_summary_data = []
  // is_create_los: boolean;
  losInvoiceSummaryForm: FormGroup;
  isLosInvoiceSummaryPagination: boolean;
  invoicesupplierNameData: any;
  isLoading = false;
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

  constructor(private sharedService: SharedService, private router: Router, private DtpcService: DtpcService, private datepipe: DatePipe,
    private fb: FormBuilder, private DtpcShareService: DtpcShareService, private SpinnerService: NgxSpinnerService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.losInvoiceSummaryForm = this.fb.group({
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
    this.get_LOSinvoicesummary();
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
        console.log(this.invoicesupplierNameData)
      })

  }

  Invoice_search_supplier_get(value) {
    // debugger;
    // this.SpinnerService.show()
    this.DtpcService.search_vendor_get(value)
      .subscribe((results) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.invoicesupplierNameData = datas;
        console.log(this.invoicesupplierNameData)

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
      console.log(results)
      this.SpinnerService.hide();
      this.los_invoice_summary_data = results['data']
      let dataPagination = results['pagination'];

      if (this.los_invoice_summary_data.length >= 0) {
        this.LOSinvoicehas_next = dataPagination.has_next;
        this.LOSinvoicehas_previous = dataPagination.has_previous;
        this.LOSinvoicepresentpage = dataPagination.index;
        this.isLosInvoiceSummaryPagination = true;
      } if (this.los_invoice_summary_data.length <= 0) {
        this.isLosInvoiceSummaryPagination = false;
      }

    })

  }
  LOSinvoicenextClick() {
    this.LOSinvoicecurrentpage = this.LOSinvoicepresentpage + 1
    this.get_LOSinvoicesummary(this.LOSinvoicepresentpage + 1, 10)
  }
  LOSinvoicepreviousClick() {
    this.LOSinvoicecurrentpage = this.LOSinvoicepresentpage - 1
    this.get_LOSinvoicesummary(this.LOSinvoicepresentpage - 1, 10)
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
  LOSmainID: any;
  LOSpatchdata: any;
  edit_los(invoice, isEdit) {
    this.LOSmainID = invoice.id

    this.DtpcService.LOSEditButton(this.LOSmainID)
      .subscribe(res => {
        console.log("thisthispatch", res)
        this.LOSpatchdata = res;
        console.log("edit click", this.LOSpatchdata);
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
      this.DtpcService.GetbranchgstnumberGSTtype(this.editsupplierid)
        .subscribe((results) => {
          let datas = results;
          // this.branchgstnumber = datas.Branchgst
          this.GSTType = datas.Gsttype
          console.log("GST type", this.GSTType)
          this.DtpcShareService.GSTtype.next(this.GSTType)
          // console.log("branchgst number", this.branchgstnumber)
          if (this.GSTType !== undefined) {
            this.router.navigate(['/createLos'], { skipLocationChange: true })
          }
        })
    }
  }

  create_los(invoice, isEdit) {
    // debugger;
    this.DtpcShareService.Invoice_Data.next(invoice)
    this.DtpcShareService.Invoice_isEdit.next(isEdit)
    this.router.navigate(['/createLos'], { skipLocationChange: true })
  }

  // clear_form() {
  //   this.losSummaryForm.reset();
  // }
  //----------------------------------------------------- my changes ----------------------------------

  losList: any;

  clear_LOSInvoiceform() {
    this.losInvoiceSummaryForm.controls['ecf_number'].reset("")
    this.losInvoiceSummaryForm.controls['invoice_number'].reset("")
    this.losInvoiceSummaryForm.controls['vendor'].reset("")
    this.losInvoiceSummaryForm.controls['invoice_charge_type'].reset("")
    this.losInvoiceSummaryForm.controls["Invoice_Date"].reset("")
    this.losInvoiceSummaryForm.controls['invoice__total_amount'].reset("")
    this.get_LOSinvoicesummary();
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
  //   let searchlos = this.losInvoiceSummaryForm.value;
  //   console.log('data for searchlos', searchlos);
  //   searchlos.Invoice_Date = this.datepipe.transform(this.losInvoiceSummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
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
    //     this.los_invoice_summary_data = result['data'];
        // if (searchlos.ecf_number === '' && searchlos.invoice_number === '' && searchlos.invoice_charge_type === '' && searchlos.invoice__total_amount === ''
        //   && searchlos.Invoice_Date === '' && searchlos.vendor === '') {
        //   this.get_summary();
        // }
        // return true
  //     })
  // }
  Invoicesearch_loan_data(pageNumber = 1) {
    let searchecfno = this.losInvoiceSummaryForm.value.ecf_number;
    console.log('ecf number', searchecfno);
    let searchinvoiceno = this.losInvoiceSummaryForm.value.invoice_number;
    console.log('searchinvoiceno ', searchinvoiceno);
    let searchchargetype = this.losInvoiceSummaryForm.value.invoice_charge_type;
    console.log('searchchargetype', searchchargetype);
    let searchinvoiceamount = this.losInvoiceSummaryForm.value.invoice__total_amount;
    console.log('searchinvoiceamount ', searchinvoiceamount);
    // let date=this.losSummaryForm.value.Invoice_Date
    let searchinvoicedate = this.datepipe.transform(this.losInvoiceSummaryForm.value.Invoice_Date, 'yyyy-MM-dd')
    console.log('searchdate ', searchinvoicedate);
    if (searchinvoicedate === null) {
      // this.DtpcService.getInvoiceLOSsummarySearch(searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount,pageNumber)
      //   .subscribe(result => {
      //     console.log(" after service", result)
      //     this.los_invoice_summary_data = result['data'];
      //   })
    } else {
      // this.DtpcService.getInvoiceLOSsummarySearchdate(searchecfno, searchinvoiceno, searchchargetype, searchinvoiceamount, searchinvoicedate)
      //   .subscribe(result => {
      //     console.log(" after service", result)
      //     this.los_invoice_summary_data = result['data'];
      //   })
    }
  }
  Invoiceviewdata(data) {
    // debugger;
    this.DtpcShareService.LOS_INV_APP_id.next(data.id)
    this.DtpcShareService.LosCurrentPage.next("")
    this.router.navigate(['/losappview'], { skipLocationChange: false })
  }

  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension=stringValue.pop();
    if ( this.fileextension === "pdf"){
      this.showPopupImages = false
      window.open( this.imageUrl + "dtpcserv/dtpcfile/DTPC_1" + id );
    }
    else if( this.fileextension === "png" ||  this.fileextension === "jpeg" ||  this.fileextension === "jpg" ||  this.fileextension === "JPG" ||  this.fileextension === "JPEG") {
    // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showPopupImages = true
      this.jpgUrls = this.imageUrl + "dtpcserv/dtpcfile/DTPC_" + id;
      console.log("url", this.jpgUrls)
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
}

