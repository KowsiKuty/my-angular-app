import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, FormControlDirective, Validators } from '@angular/forms';
import { EcfapService } from '../ecfap.service';
import { ShareService } from '../share.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe, DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { share } from 'rxjs/operators';
import { NotificationService } from '../notification.service';
import { ErrorHandlingService } from '../error-handling.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { switchMap, finalize, debounceTime, distinctUntilChanged, tap, takeUntil, map } from 'rxjs/operators';
import { EcfService } from 'src/app/ECF/ecf.service';
import { PageEvent } from '@angular/material/paginator';
import * as bootstrap from "./../../../assets/bootstrap-4.5.3-dist/js/bootstrap";
import { environment } from 'src/environments/environment';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';

export interface approverListss {
  id: string;
  name: string;
  limit: number;
}

export interface catlistss {
  id: any;
  name: string;
  code: any
}
export interface subcatlistss {
  id: any;
  name: string;
  code: string;
}
export interface bslistss {
  id: any;
  name: string;
  code: any
}
export interface cclistss {
  id: any;
  name: string;
  code: any
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
  selector: 'app-approver-inv-detail-view',
  templateUrl: './approver-inv-detail-view.component.html',
  styleUrls: ['./approver-inv-detail-view.component.scss']
})
export class ApproverInvDetailViewComponent implements OnInit {

  yesorno = [{ 'value': "Y", 'display': 'Yes' }, { 'value': "N", 'display': 'No' }]

  frmInvHdr: FormGroup;
  invoiceheaderdetailForm: FormGroup
  InvoiceDetailForm: FormGroup

  creditdetForm: FormGroup
  DebitDetailForm: FormGroup
  ccbsForm: FormGroup
  apinvHeader_id = this.shareservice.invheaderid.value;
  crno = this.shareservice.crno.value;
  showinvoicediv = true
  showdebitdiv = false

  invHdrRes: any;
  invtotamount: any
  RsrEmppanel: any;
  InvNopanel: any;
  Branchpanel: any;
  BranchGSTpanel: any;
  Pmdpanel: any;
  InvDatepanel: any;
  TaxableAmtpanel: any;
  Statuspanel: any;
  Supplierpanel: any;
  SupGSTpanel: any;
  InvAmtpanel: any;
  Gstpanel: any;
  capitalizesPanel:any;
  invDetailList: any;
  invDebitList: any;
  invDebitTot: number;
  invCreditList: any;
  invCreditTot: number;
  getgstapplicable: any
  gstAppl: boolean
  aptypeid: any
  paytoid: any
  ppxid: any
  INVsum: any
  INVamt: any
  totalamount: any
  cdtsum: any
  showaccno = [false, false, false, false, false, false, false, false, false]
  showtranspay = [false, false, false, false, false, false, false, false, false]
  showtaxtype = [false, false, false, false, false, false, false, false, false]
  paymodecode = ['', '', '', '', '', '', '', '']
  invoicedetailsdata: any
  showtaxtypes = [true, true, true, true, true, true, true, true, true]
  showtaxrates = [true, true, true, true, true, true, true, true, true]
  showtaxrate = [false, false, false, false, false, false, false, false, false]
  ecfheaderid: any
  approverList: Array<approverListss>;
  @ViewChild('appInput') appInput: any;
  @ViewChild('approver') matappAutocomplete: MatAutocomplete;

  currentpageapp: any = 1
  has_nextapp: boolean = true
  has_previousapp: boolean = true
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  commodityid: any;
  createdbyid: any;
  isLoading: boolean;

  headerdata: any = []
  @Output() batchview = new EventEmitter<any>();
  @Output() ecfview = new EventEmitter<any>();
  showApprove: boolean
  loginuserid: any;
  SubmitECFApproverForm: FormGroup;
  SupplierDetailForm: FormGroup
  @ViewChild('supclosebuttons') supclosebuttons;
  @ViewChild('cattype') matcatAutocomplete: MatAutocomplete;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategorytype') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('bstype') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('cctype') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  categoryNameData: Array<catlistss>;
  subcategoryNameData: Array<subcatlistss>;
  bsNameData: Array<bslistss>;
  ccNameData: Array<cclistss>;
  catid: any
  bssid: any
  debitsaved: boolean = false
  @Output() linesChange = new EventEmitter<any>();
  url = environment.apiURL

  constructor(private formBuilder: FormBuilder, private service: EcfapService, private router: Router, private spinner: NgxSpinnerService, private shareservice: ShareService,
    public datepipe: DatePipe, private toastr: ToastrService, private notification: NotificationService, private errorHandler: ErrorHandlingService,
    private ecfservice: EcfService) { }

  ngOnInit(): void {
    const getToken = localStorage.getItem("sessionData")
    let tokendata = JSON.parse(getToken)
    this.loginuserid = tokendata.employee_id

    this.ecfheaderid = this.shareservice.ecfheader.value
    // let ecfdatas = this.shareservice.ecfviewdata.value
    // console.log("ecfdatas",ecfdatas)

    this.frmInvHdr = this.formBuilder.group({
      rsrCode: new FormControl(''),
      rsrEmp: new FormControl(''),
      gst: new FormControl(''),
      branchGST: new FormControl(''),
      branch: new FormControl(''),
      pmd: new FormControl(''),

      supplier: new FormControl(''),
      supName: new FormControl(''),
      supGST: new FormControl(''),
      status: new FormControl(''),

      invNo: new FormControl(''),
      invDate: new FormControl(''),
      taxableAmt: new FormControl(''),
      invAmt: new FormControl(''),
      is_capitalized: new FormControl(''),

    })

    this.InvoiceDetailForm = this.formBuilder.group({
      roundoffamt: [''],
      invoicedtls: new FormArray([
      ]),

      creditdtl: new FormArray([
      ])
    });


    this.creditdetForm = this.formBuilder.group({
      supName: new FormControl(''),
      isexcempted: new FormControl(''),
      TDSSection: new FormControl(''),
      TDSRate: new FormControl(''),
      thresholdValue: new FormControl(''),
      amountPaid: new FormControl(''),
      normaltdsRate: new FormControl(''),
      balThroAmt: new FormControl(''),
      bankdetails_id: new FormControl(''),
    }),

      this.DebitDetailForm = this.formBuilder.group({

        debitdtl: new FormArray([
        ])
      });

    this.ccbsForm = this.formBuilder.group({

      ccbsdtl: new FormArray([
      ])
    })
    this.SubmitECFApproverForm = this.formBuilder.group({
      id: this.ecfheaderid,
      approvedby: [''],
      remark: ['']
    })

    this.SupplierDetailForm = this.formBuilder.group({
      invoiceno: [''],
      invoicedate: [''],
      supplier_name: [''],
      suppliergst: [''],
      pincode: [''],
      address: ['']
    })



    this.getApHdr();
  }

  approvername() {
    let appkeyvalue: String = "";
    this.getapprover(appkeyvalue);

    this.SubmitECFApproverForm.get('approvedby').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.service.getapproverscroll(1, this.commodityid, this.createdbyid, "", value)

          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;

      })

  }
  private getapprover(appkeyvalue) {
    this.service.getapproverscroll(1, this.commodityid, this.createdbyid, "", appkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approverList = datas;
      })
  }

  public displayFnApprover(approver?: approverListss): string | undefined {
    return approver ? approver.name : undefined;
  }

  get approver() {
    return this.SubmitECFApproverForm.get('approvedby');
  }

  autocompleteapproverScroll() {

    setTimeout(() => {
      if (
        this.matappAutocomplete &&
        this.autocompleteTrigger &&
        this.matappAutocomplete.panel
      ) {
        fromEvent(this.matappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextapp === true) {
                this.service.getapproverscroll(this.currentpageapp + 1, this.commodityid, this.createdbyid, "", this.appInput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.approverList = this.approverList.concat(datas);
                    if (this.approverList.length >= 0) {
                      this.has_nextapp = datapagination.has_next;
                      this.has_previousapp = datapagination.has_previous;
                      this.currentpageapp = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  tdsapplicability = ""
  paymentinstructions = ""
  getApHdr() {
    this.service.getInvHdr(this.apinvHeader_id)
      .subscribe(result => {
        console.log("invhdrres", result)
        if (result.code == undefined) {
          this.invHdrRes = result.data[0]
          this.commodityid = this.invHdrRes?.commodity_id
          this.createdbyid = this.invHdrRes?.raisedby
          this.tdsapplicability = this.invHdrRes?.is_tds_applicable?.text
          this.paymentinstructions = this.invHdrRes?.payment_instruction
          this.headerdata = result['data']
          this.getInvHdr();
        }
        else {
          console.log("Error while fetching Invoice Header.")
          this.spinner.hide();
        }

      }, error => {
        console.log("Error while fetching Inv Header data")
        this.spinner.hide();
      }
      )


  }
  suppid: any
  Roundoffamount: any
  OtherAmount: any
  showAppName: boolean
  getInvHdr() {
    if (this.invHdrRes !== undefined && this.invHdrRes !== null) {
      let num: number = +this.invHdrRes.totalamount;
      let amt = new Intl.NumberFormat("en-GB").format(num);
      amt = amt ? amt.toString() : '';
      num = +this.invHdrRes.totalamount - +this.invHdrRes.taxamount;
      let taxableamt = new Intl.NumberFormat("en-GB").format(num);
      taxableamt = taxableamt ? taxableamt.toString() : '';
      this.aptypeid = this.invHdrRes.aptype_id
      console.log("this.aptypeid", this.aptypeid)
      let suppname: any
      let suppgst: any

      if (this.invHdrRes.approver_id != undefined && this.invHdrRes.approver_id != null && this.invHdrRes.approver_id != "")
        this.showAppName = true
      else
        this.showAppName = false

      if (this.invHdrRes.approver_id == this.loginuserid && this.invHdrRes.apinvoiceheader_status.id == 2) {
        this.showApprove = true
      }
      else {
        this.showApprove = false
      }
      if (this.aptypeid == 3) {
        suppname = this.invHdrRes.manualsupp_name
        suppgst = this.invHdrRes.manual_gstno
      } else if (this.aptypeid == 13) {
        suppname = this.invHdrRes.supplier_name,
          suppgst = this.invHdrRes.suppliergst

      } else {
        suppname = this.invHdrRes.supplier_id?.name,
          suppgst = this.invHdrRes.supplier_id?.gstno

      }
      this.RsrEmppanel = this.invHdrRes.raisername + ' - ' + this.invHdrRes.raisercode,
        this.InvNopanel = this.invHdrRes.invoiceno,
        this.Branchpanel = this.invHdrRes?.branchdetails_id?.code + ' - ' + this.invHdrRes?.branchdetails_id?.name,
        this.BranchGSTpanel = this.invHdrRes?.branchdetails_id?.gstin,
        this.Pmdpanel = this.invHdrRes?.pmd_data?.location
      this.InvDatepanel = this.datepipe.transform(this.invHdrRes.invoicedate, 'dd-MMM-yyyy'),
        this.TaxableAmtpanel = taxableamt,
        this.Statuspanel = this.invHdrRes.apinvoiceheader_status,
        this.Supplierpanel = this.invHdrRes.supplier_id?.name + ' - ' + this.invHdrRes.supplier_id?.code,
        this.SupGSTpanel = suppgst,
        this.Gstpanel = this.invHdrRes.invoicegst == 'Y' ? 'Yes' : 'No',
        this.capitalizesPanel = this.invHdrRes.invoicedetails.data[0].is_capitalized == true ? 'Yes': 'No'
        this.InvAmtpanel = amt,
        this.frmInvHdr.patchValue(
          {
            rsrCode: this.invHdrRes.raisercode,
            rsrEmp: this.invHdrRes.raisername + ' - ' + this.invHdrRes.raisercode,
            supplier: this.invHdrRes.supplier_id?.name + ' - ' + this.invHdrRes.supplier_id?.code,
            supName: suppname,
            supGST: suppgst,
            status: this.invHdrRes.apinvoiceheader_status,
            branch: this.invHdrRes?.branchdetails_id?.code + ' - ' + this.invHdrRes?.branchdetails_id?.name,
            branchGST: this.invHdrRes?.branchdetails_id?.gstin,
            invNo: this.invHdrRes.invoiceno,
            invDate: this.datepipe.transform(this.invHdrRes.invoicedate, 'dd-MMM-yyyy'),
            invAmt: amt,
            taxableAmt: taxableamt,
            gst: this.invHdrRes.invoicegst == 'Y' ? 'Yes' : 'No',
            pmd: this.invHdrRes?.pmd_data?.location
          }
        )

      this.SubmitECFApproverForm.patchValue({
        ecfApprover: this.invHdrRes.approvername
      })
      this.Roundoffamount = this.invHdrRes.roundoffamt
      this.OtherAmount = this.invHdrRes.invoicedetails.data[0]?.otheramount

      this.InvoiceDetailForm.patchValue({ roundoffamt: this.invHdrRes.roundoffamt })
      this.creditdetForm.patchValue({ supName: this.invHdrRes.supplier_id?.name })
      this.crno = this.invHdrRes.apinvoiceheader_crno
      // this.aptypeid = this.invHdrRes.aptype_id
      this.paytoid = this.invHdrRes.payto_id
      if (this.paytoid == undefined || this.paytoid == "")
        this.paytoid = this.invHdrRes?.ppx
      this.ppxid = this.invHdrRes?.ppx
      this.getgstapplicable = this.invHdrRes.invoicegst
      this.suppid = this.invHdrRes.supplier_id?.id
      if (this.getgstapplicable == "Y") {
        this.gstAppl = true
      }
      else {
        this.gstAppl = false
      }
      this.totalamount = Number(this.invHdrRes.totalamount)
      if (this.aptypeid != 4) {
        this.invDetailList = this.invHdrRes.invoicedetails.data
        this.frmInvHdr.controls['is_capitalized'].setValue(this.invDetailList[0]?.is_capitalized ? 'Yes' : 'No')
        this.getinvoicedtlrecords();
        this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
          .subscribe(result => {
            if (result) {
              // this.creditres = result.data;
              let cred = result.data;
              this.invCreditList = cred.filter(x => x.amount >= 0 && x.is_display == "YES")
              console.log("Invoice Credit Detail ", this.invCreditList);
              this.getcreditrecords(this.invCreditList);
              this.spinner.hide();
            }
          }, error => {
            console.log("Inv Credit Detail data not found")
            this.spinner.hide();
          }
          )
      }
      else {
        this.invtotamount = this.invHdrRes.invoicedetails.data[0].amount
        this.invdtladdonid = this.invHdrRes.invoicedetails.data[0].id
        this.service.getDebitCredit(this.apinvHeader_id, this.invdtladdonid, 1)
          .subscribe(result => {
            console.log("getInvdebit", result)
            if (result) {
              this.spinner.hide();
              let data = result.data
              this.debitdata = data.filter(x => x.is_display == "YES" && x.amount >= 0)

              this.getdebitrecords(this.debitdata)
            }
          })

        this.service.getDebitCredit(this.apinvHeader_id, 0, 2)
          .subscribe(result => {
            if (result) {
              this.spinner.hide();
              let cred = result.data;
              this.invCreditList = cred.filter(x => x.amount >= 0 && x.is_display == "YES")
              console.log("Invoice Credit Detail ", this.invCreditList);
              if (this.invCreditList?.length > 0)
                this.getcreditrecords(this.invCreditList);
            }
          }, error => {
            console.log("Inv Credit Detail data not found")
            this.spinner.hide();
          }
          )

      }
    }
    else {
      this.toastr.error('Invoice Hdr not available');
      return false;
      this.spinner.hide();
    }
  }

  getinvoicedtlrecords() {
    let datas = this.invDetailList
    this.totalamount = 0
    let i = 0

    for (let details of datas) {
      let apinvoiceheader_id: FormControl = new FormControl('');
      let id: FormControl = new FormControl('');
      let description: FormControl = new FormControl('');
      let productcode: FormControl = new FormControl('');
      let productname: FormControl = new FormControl('');
      let isrcm: FormControl = new FormControl('');
      let hsn: FormControl = new FormControl('');
      let hsn_percentage: FormControl = new FormControl('');
      let uom: FormControl = new FormControl('');
      let unitprice: FormControl = new FormControl(0);
      let quantity: FormControl = new FormControl(0);
      let amount: FormControl = new FormControl(0);
      let cgst: FormControl = new FormControl(0);
      let sgst: FormControl = new FormControl(0);
      let igst: FormControl = new FormControl(0);
      let discount: FormControl = new FormControl(0);
      let taxamount: FormControl = new FormControl(0);
      let totalamount: FormControl = new FormControl(0);
      let taxable_amount: FormControl = new FormControl(0);
      let roundoffamt: FormControl = new FormControl('');
      let otheramount: FormControl = new FormControl('');
      let dtltotalamt: FormControl = new FormControl(0);
      let is_rcmproduct: FormControl = new FormControl('');

      const invdetFormArray = this.InvoiceDetailForm.get("invoicedtls") as FormArray;
      apinvoiceheader_id.setValue(details.apinvoiceheader_id)
      id.setValue(details.id)
      productcode.setValue(details.productcode)
      is_rcmproduct.setValue(details.is_rcmproduct)


      productname.setValue(details.productname)
      isrcm.setValue(details.is_rcmproduct)
      description.setValue(details.description)
      if (details.hsn.code == "UNEXPECTED_ERROR") {
        hsn.setValue("")
        hsn_percentage.setValue("")
        cgst.setValue(0)
        sgst.setValue(0)
        igst.setValue(0)
        taxamount.setValue(0)
      }
      else if (details.hsn?.Status == "Failed") {
        hsn.setValue("NO HSN")
        hsn_percentage.setValue(0)
        cgst.setValue(0)
        sgst.setValue(0)
        igst.setValue(0)
        taxamount.setValue(0)
      }
      else {
        hsn.setValue(details.hsn.code)
        hsn_percentage.setValue(details.hsn_percentage)
        let num = +details.cgst;
        let cgstt = new Intl.NumberFormat("en-GB").format(num);
        cgstt = cgstt ? cgstt.toString() : '';
        cgst.setValue(cgstt)

        num = +details.sgst;
        let sgstt = new Intl.NumberFormat("en-GB").format(num);
        sgstt = sgstt ? sgstt.toString() : '';
        sgst.setValue(sgstt)

        num = +details.igst;
        let igstt = new Intl.NumberFormat("en-GB").format(num);
        igstt = igstt ? igstt.toString() : '';
        igst.setValue(igstt)

        num = +details.taxamount;
        let tax = new Intl.NumberFormat("en-GB").format(num);
        tax = tax ? tax.toString() : '';
        taxamount.setValue(tax)
      }
      uom.setValue(details.uom)

      let num: number = +details.unitprice;
      let up = new Intl.NumberFormat("en-GB").format(num);
      up = up ? up.toString() : '';
      unitprice.setValue(up)

      num = +details.quantity;
      let qty = new Intl.NumberFormat("en-GB").format(num);
      qty = qty ? qty.toString() : '';
      quantity.setValue(qty)

      num = +details.amount;
      let amt = new Intl.NumberFormat("en-GB").format(num);
      amt = amt ? amt.toString() : '';
      amount.setValue(amt)

      num = +details.discount;
      let dis = new Intl.NumberFormat("en-GB").format(num);
      dis = dis ? dis.toString() : '';
      discount.setValue(dis)

      num = +details.totalamount;
      let tot = new Intl.NumberFormat("en-GB").format(num);
      tot = tot ? tot.toString() : '';
      totalamount.setValue(tot)

      num = +details.taxable_amount;
      tot = new Intl.NumberFormat("en-GB",{ style: 'decimal', minimumFractionDigits : 2, maximumFractionDigits: 2}).format(num); 
      tot = tot ? tot.toString() : '';
      taxable_amount.setValue(tot)
      roundoffamt.setValue(details.roundoffamt)
      otheramount.setValue(details.otheramount)

      this.totalamount += details.totalamount

      invdetFormArray.push(new FormGroup({
        id: id,
        productcode: productcode,
        productname: productname,
        isrcm: isrcm,
        description: description,
        hsn: hsn,
        hsn_percentage: hsn_percentage,
        uom: uom,
        unitprice: unitprice,
        quantity: quantity,
        amount: amount,
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        discount: discount,
        taxamount: taxamount,
        totalamount: totalamount,
        taxable_amount: taxable_amount,
        roundoffamt: roundoffamt,
        otheramount: otheramount,
        is_rcmproduct: is_rcmproduct,
      }))


      i++;
    }
    this.INVdatasums();
    this.cdtsum = this.totalamount
  }

  Roundoffsamount: any
  totaltaxable
  INVdatasums() {
    this.INVamt = this.InvoiceDetailForm.value['invoicedtls'].map(x => Number((String(x.totalamount).replace(/,/g, ''))));
    let taxableamts = this.InvoiceDetailForm.value['invoicedtls'].map(x => Number((String(x.taxable_amount).replace(/,/g, ''))));
    this.totaltaxable = (taxableamts.reduce((a, b) => a + b, 0));
    this.Roundoffsamount = Number(this.InvoiceDetailForm.value.roundoffamt)
    this.OtherAmount = Number(this.invDetailList[0].otheramount)
    let INVsum = (this.INVamt.reduce((a, b) => a + b, 0));
    this.INVsum = INVsum + Number(this.Roundoffsamount) + +this.OtherAmount
    let num: number = +this.INVsum;
    this.INVsum = +(num.toFixed(2))
    if (this.INVsum > 0)
      this.totalamount = this.INVsum
    console.log('this.INVsum', this.INVsum);
  }
  getcreditrecords(datas) {
    let creditdet = datas;
    if (creditdet != undefined) {
      let i = 0
      for (let data of creditdet) {
        let id: FormControl = new FormControl('');
        let paymode_id: FormControl = new FormControl('');
        let creditbank_id: FormControl = new FormControl('');
        let suppliertax_id: FormControl = new FormControl('');

        let refno: FormControl = new FormControl('');
        let suppliertaxtype: FormControl = new FormControl('');
        let suppliertaxrate: FormControl = new FormControl('');
        let taxexcempted: FormControl = new FormControl('');

        let amount: FormControl = new FormControl('');
        let taxableamount: FormControl = new FormControl('');
        let ddtranbranch: FormControl = new FormControl('');
        let credittotal: FormControl = new FormControl('');
        let ddpaybranch: FormControl = new FormControl('');

        let category_code: FormControl = new FormControl('');
        let subcategory_code: FormControl = new FormControl('');
        let bank: FormControl = new FormControl('');
        let branch: FormControl = new FormControl('');
        let ifsccode: FormControl = new FormControl('');

        let benificiary: FormControl = new FormControl('');
        let amountchange: FormControl = new FormControl('');
        let accno: FormControl = new FormControl('');
        let cc_code: FormControl = new FormControl('');
        let bs_code: FormControl = new FormControl('');
        let ccbspercentage: FormControl = new FormControl('');
        let glno: FormControl = new FormControl('');
        let entry_type: FormControl = new FormControl('2');

        const creditdetailformArray = this.InvoiceDetailForm.get("creditdtl") as FormArray;

        if (i == 0) {

          this.creditdetForm.patchValue(
            {
              bankdetails_id: data.bankdetails ? data.bankdetails : undefined
            })
        }
        id.setValue(data.id)
        paymode_id.setValue(data.paymode.name)

        creditbank_id.setValue(data.creditbank_id)
        suppliertax_id.setValue(data.suppliertax_id)
        glno.setValue(data.glno)

        suppliertaxtype.setValue(data.suppliertaxtype)
        suppliertaxrate.setValue(data.suppliertaxrate)
        taxexcempted.setValue(data.taxexcempted)

        let num: number = +data.amount
        let amt = new Intl.NumberFormat("en-GB").format(num);
        amt = amt ? amt.toString() : '';
        amount.setValue(amt)
        console.log("amount", amt)

        num = +data.taxableamount
        let taxbleamt = new Intl.NumberFormat("en-GB").format(num);
        taxbleamt = taxbleamt ? taxbleamt.toString() : '';
        taxableamount.setValue(taxbleamt)

        ddtranbranch.setValue(data.ddtranbranch)
        ddpaybranch.setValue(data.ddpaybranch)
        category_code.setValue(data.category_code)
        subcategory_code.setValue(data.subcategory_code)
        bs_code.setValue(data.bs_code)
        cc_code.setValue(data.cc_code)
        accno.setValue(data?.refno)
        refno.setValue(data?.refno)
        this.CrnData = data?.category_code
        this.crnSubData = data?.subcategory_code
        this.crnglno = data?.glno
        if (data.paymode.name == "KVBAC") {
          accno.setValue(data?.refno)
          refno.setValue(data?.refno)
        }
        else {
          let accdet
          if (this.paytoid == "S") {
            if (data?.supplierpayment_details == null || data?.supplierpayment_details == undefined) {
              accno.setValue(data?.refno)
              refno.setValue(data?.refno)
              bank.setValue("")
              ifsccode.setValue("")
              branch.setValue("")
              benificiary.setValue("")
            }
            else if (data.supplierpayment_details.data?.length < 1) {
              accno.setValue("")
              refno.setValue("")
              bank.setValue("")
              ifsccode.setValue("")
              branch.setValue("")
              benificiary.setValue("")
            }
            else {
              accdet = data.supplierpayment_details["data"][0]
              accno.setValue(accdet?.account_no)
              refno.setValue(accdet?.account_no)
              bank.setValue(accdet?.bank_id?.name)
              ifsccode.setValue(accdet?.branch_id?.ifsccode)
              branch.setValue(accdet?.branch_id?.name)
              benificiary.setValue(accdet?.beneficiary)
            }
          }
          else if (this.paytoid == "E") {
            if (data?.employeeaccount_details == null || data?.employeeaccount_details == undefined) {
              accno.setValue(data?.refno)
              refno.setValue(data?.refno)
              bank.setValue("")
              ifsccode.setValue("")
              branch.setValue("")
              benificiary.setValue("")
            }
            else if (data?.employeeaccount_details.data?.length < 1) {
              accno.setValue("")
              refno.setValue("")
              bank.setValue("")
              ifsccode.setValue("")
              branch.setValue("")
              benificiary.setValue("")
            }
            else {
              accdet = data.employeeaccount_details
              accno.setValue(accdet?.account_number)
              refno.setValue(accdet?.account_number)
              bank.setValue(accdet?.bank_name)
              ifsccode.setValue(accdet?.bankbranch?.ifsccode)
              branch.setValue(accdet?.bankbranch?.name)
              benificiary.setValue(accdet?.beneficiary_name)
            }
          }
        }
        // if (data.paymode.gl_flag == "Payable")
        // {
        //   if(data.paymode.name == "KVBAC")
        //   {
        //     accno.setValue(data?.refno)              
        //     refno.setValue(data?.refno) 
        //   }
        //   else
        //   {
        //     let accdet 
        //     if(this.paytoid == "S")
        //     {
        //       if(data?.supplierpayment_details  == null || data?.supplierpayment_details == undefined)
        //       {
        //         accno.setValue(data?.refno)   
        //         refno.setValue(data?.refno)   
        //         bank.setValue("")
        //         ifsccode.setValue("")
        //         branch.setValue("")
        //         benificiary.setValue("")
        //       }
        //       else if(data.supplierpayment_details.data?.length <1)
        //       {
        //         accno.setValue("")   
        //         refno.setValue("")   
        //         bank.setValue("")
        //         ifsccode.setValue("")
        //         branch.setValue("")
        //         benificiary.setValue("")
        //       }
        //       else
        //       {
        //         accdet = data.supplierpayment_details["data"][0] 
        //         accno.setValue(accdet?.account_no)              
        //         refno.setValue(accdet?.account_no)    
        //         bank.setValue(accdet?.bank_id?.name)              
        //         ifsccode.setValue(accdet?.branch_id?.ifsccode)
        //         branch.setValue(accdet?.branch_id?.name)
        //         benificiary.setValue(accdet?.beneficiary)
        //       }        
        //     }
        //     else if(this.paytoid == "E")
        //     {
        //       if(data?.employeeaccount_details  == null || data?.employeeaccount_details == undefined)
        //       {
        //         accno.setValue(data?.refno)    
        //         refno.setValue(data?.refno)   
        //         bank.setValue("") 
        //         ifsccode.setValue("")
        //         branch.setValue("")
        //         benificiary.setValue("")
        //       }
        //       else if(data?.employeeaccount_details.data?.length < 1)
        //       {
        //          accno.setValue("")  
        //         refno.setValue("")     
        //         bank.setValue("") 
        //         ifsccode.setValue("")
        //         branch.setValue("")
        //         benificiary.setValue("")
        //       }
        //       else
        //       { 
        //         accdet  = data.employeeaccount_details
        //         accno.setValue(accdet?.account_number)               
        //         refno.setValue(accdet?.account_number) 
        //         bank.setValue(accdet?.bank_name)              
        //         ifsccode.setValue(accdet?.bankbranch?.ifsccode)
        //         branch.setValue(accdet?.bankbranch?.name)
        //         benificiary.setValue(accdet?.beneficiary_name)
        //       }       
        //     }
        //   }
        // }
        // else
        // {
        //   if(data.glno != "151515" && data.glno != "151516" && data.glno != "151517" )  
        //   {
        //     num = +data.amount
        //     let amt = new Intl.NumberFormat("en-GB").format(num); 
        //     amt = amt ? amt.toString() : '';
        //     amountchange.setValue(amt)  
        //   }       
        // }

        credittotal.setValue(0)

        creditdetailformArray.push(new FormGroup({
          paymode_id: paymode_id,
          creditbank_id: creditbank_id,
          suppliertax_id: suppliertax_id,
          glno: glno,

          refno: refno,
          suppliertaxtype: suppliertaxtype,
          suppliertaxrate: suppliertaxrate,
          taxexcempted: taxexcempted,
          amount: amount,

          taxableamount: taxableamount,
          ddtranbranch: ddtranbranch,
          ddpaybranch: ddpaybranch,
          category_code: category_code,
          subcategory_code: subcategory_code,
          accno: accno,

          id: id,
          bank: bank,
          branch: branch,
          ifsccode: ifsccode,
          benificiary: benificiary,

          amountchange: amountchange,
          credittotal: credittotal,
          cc_code: cc_code,
          bs_code: bs_code,
          ccbspercentage: ccbspercentage,
          entry_type: entry_type,
        }))

        i++

      }
    }

    this.creditdatasums()
  }

  creditdatasums() {
    let cdtamt = this.InvoiceDetailForm.value['creditdtl'].map(x => String(x.amount).replace(/,/g, ''));
    this.cdtsum = cdtamt.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
  }
  invdtladdonid: any
  debitsum: any
  invdtltaxableamount: any
  invdtloverallamount: any
  invdtltaxamount: any
  cgstval: any
  sgstval: any
  igstval: any
  gettaxrate: any
  debitdata: any[]
  RoundOffandOtherSum: any = 0

  adddebit(section, data, index) {

    this.spinner.show();

    let datas = this.DebitDetailForm.get('debitdtl') as FormArray
    datas.clear()

    if ((Number(this.Roundoffsamount) != 0 || Number(this.OtherAmount) != 0))
      this.RoundOffandOtherSum = +this.Roundoffsamount + +this.OtherAmount

    // console.log("debitsec", section)
    if (this.invoicedetailsdata != undefined) {
      let datas = this.invoicedetailsdata[index]
      this.invdtltaxableamount = this.invoicedetailsdata[index].amount
      if (index == 0)
        this.invtotamount = +this.invoicedetailsdata[index].totalamount + this.RoundOffandOtherSum
      else
        this.invtotamount = +this.invoicedetailsdata[index].totalamount
      this.invdtltaxamount = this.invoicedetailsdata[index].taxamount
      this.cgstval = +String(this.invoicedetailsdata[index].cgst).replace(/,/g, '')
      this.sgstval = +String(this.invoicedetailsdata[index].sgst).replace(/,/g, '')
      this.igstval = +String(this.invoicedetailsdata[index].igst).replace(/,/g, '')
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = datas.id
    }
    else {
      let sections = section.value
      this.invdtltaxableamount = sections.amount
      if (index == 0)
        this.invtotamount = +this.invoicedetailsdata[index].totalamount + this.RoundOffandOtherSum
      else
        this.invtotamount = +this.invoicedetailsdata[index].totalamount
      this.invdtltaxamount = sections.taxamount
      this.cgstval = +String(sections.cgst).replace(/,/g, '')
      this.sgstval = +String(sections.sgst).replace(/,/g, '')
      this.igstval = +String(sections.igst).replace(/,/g, '')
      this.gettaxrate = this.cgstval + this.sgstval + this.igstval
      this.invdtladdonid = sections.id
    }
    this.service.getDebitCredit(this.apinvHeader_id, this.invdtladdonid, 1)
      .subscribe(result => {

        console.log("getInvdebit", result)
        if (result) {
          this.showinvoicediv = false
          this.showdebitdiv = true
          let data = result.data
          this.debitdata = data.filter(x => x.is_display == "YES" && x.amount >= 0)
          console.log("debitdata", this.debitdata)
          this.getdebitrecords(this.debitdata)
        }
      })

    this.spinner.hide();
  }

  adddebits(detail, i) {
    if ((Number(this.Roundoffsamount) != 0 || Number(this.OtherAmount) != 0))
      this.RoundOffandOtherSum = +this.Roundoffsamount + +this.OtherAmount


    if (i == 0)
      this.invtotamount = +this.headerdata[0].invoicedetails.data[i].totalamount + this.RoundOffandOtherSum
    else
      this.invtotamount = +this.headerdata[0].invoicedetails.data[i].totalamount
    this.service.getDebitCredit(this.apinvHeader_id, detail.id, 1)
      .subscribe(result => {

        console.log("getInvdebit", result)
        if (result) {
          this.showinvoicediv = false
          this.showdebitdiv = true
          let data = result.data
          this.debitdata = data.filter(x => x.is_display == "YES" && x.amount >= 0)
          console.log("debitdata", this.debitdata)
          this.invdtladdonid = detail.id
          this.getdebitrecords(this.debitdata)
        }
      })
  }

  getdebitrecords(datas) {
    console.log(datas)
    this.debitsaved = false

    for (let debit of datas) {
      let id: FormControl = new FormControl('');
      let apinvoicedetail_id: FormControl = new FormControl('');
      let category_code: FormControl = new FormControl('');
      let subcategory_code: FormControl = new FormControl('');
      let glno: FormControl = new FormControl('');
      // let bsproduct_code: FormControl = new FormControl('');
      // let bsproduct_code_id: FormControl = new FormControl('');
      let amt: FormControl = new FormControl('');
      let amount: FormControl = new FormControl('');
      let deductionamount: FormControl = new FormControl(0);
      let bs_code: FormControl = new FormControl('');
      let cc_code: FormControl = new FormControl('');
      let ccbspercentage: FormControl = new FormControl('');
      let taxableamount: FormControl = new FormControl(0);
      let entry_type: FormControl = new FormControl('1');
      let paymode_id: FormControl = new FormControl('8');
      const debitFormArray = this.DebitDetailForm.get("debitdtl") as FormArray;

      id.setValue(debit.id)
      apinvoicedetail_id.setValue(debit.apinvoicedetail_id)
      let code = (debit.category_code?.code ? debit.category_code?.code : "").toLowerCase().trim()
      let subcode = (debit.subcategory_code?.code ? debit.subcategory_code?.code : "").toLowerCase().trim()
      if (code == null || code == "dummy" || code.indexOf("unexpected error") >= 0 || code.indexOf("unexpected_error") >= 0 || code.indexOf("invalid_data") >= 0) {
        category_code.setValue("")
        glno.setValue("")
      }
      else {
        category_code.setValue(debit.category_code)
        glno.setValue(debit.glno)
      }

      if (subcode == "dummy" || subcode.indexOf("unexpected error") >= 0 || subcode.indexOf("unexpected_error") >= 0 || subcode.indexOf("invalid_data") >= 0) {
        subcategory_code.setValue("")
        glno.setValue("")
      }
      else {
        subcategory_code.setValue(debit.subcategory_code)
        glno.setValue(debit.glno)
      }

      bs_code.setValue(debit.bs_code)
      cc_code.setValue(debit.cc_code)
      if (debit.category_code.code == "GST")
        ccbspercentage.setValue(100)
      else
        ccbspercentage.setValue(debit.ccbspercentage)
      let num: number = +debit.amount;
      if (+debit.amount == this.invdtltaxableamount)
        ccbspercentage.setValue(100)
      let dbtamt = new Intl.NumberFormat("en-GB").format(num);
      dbtamt = dbtamt ? dbtamt.toString() : '';
      amt.setValue(dbtamt)
      amount.setValue(dbtamt)
      deductionamount.setValue(debit.deductionamount)
      let debtax = Number((this.cgstval + this.sgstval + this.igstval) / 2)


      debitFormArray.push(new FormGroup({
        id: id,
        apinvoicedetail_id: apinvoicedetail_id,
        category_code: category_code,
        subcategory_code: subcategory_code,
        glno: glno,
        amt: amt,
        amount: amount,
        deductionamount: deductionamount,
        bs_code: bs_code,
        cc_code: cc_code,
        ccbspercentage: ccbspercentage,
        taxableamount: taxableamount,
        entry_type: entry_type,
        paymode_id: paymode_id,
      }))
      // let bskeyvalue: String = "";
      // this.getbs(bskeyvalue);
      bs_code.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.getbsscroll(this.bsInput.nativeElement.value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.bsNameData = datas;
          // console.log("bsdata", this.bsNameData)
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })

      cc_code.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.getccscroll(this.bssid, value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.ccNameData = datas;
          // console.log("ccdata", this.ccNameData)
          this.linesChange.emit(this.DebitDetailForm.value['debitdtl']);
        })

      this.debitdatasums();
    }
  }
  getDebitSections(form) {

    return form.controls.debitdtl.controls;
  }

  debitClose() {
    this.showinvoicediv = true
    this.showdebitdiv = false

    let debitcontrol = this.DebitDetailForm.controls["debitdtl"] as FormArray;
    debitcontrol.clear()
  }
  dbtamt: any
  dbtsum: any = 0

  debitdatasums() {
    this.dbtamt = this.DebitDetailForm.value['debitdtl'].map(x => String(x.amount).replace(/,/g, ''));
    this.dbtsum = this.dbtamt.reduce((a, b) => (Number(a) + Number(b)), 0);

    this.debitsum = this.dbtsum.toFixed(2);
  }

  debitbacks() {
    this.debitClose()
  }



  getCreditSections(form) {
    return form.controls.creditdtl.controls;
  }


  overallback() {
    this.shareservice.ecfheader.next(this.ecfheaderid)
    this.shareservice.ecfheaderedit.next(this.ecfheaderid)
    // this.router.navigate(['ECFAP/ecfapview'])
    // this.router.navigate(['ECFAP/ecfapsummary'], {queryParams : {comefrom : "invoicedetailview"}})
    if (this.shareservice.comefrom.value == 'batch')
      this.batchview.emit()
    else if (this.shareservice.comefrom.value == 'ecf')
      this.ecfview.emit()
  }
  viewtrnlist:any=[];
  viewtrnCurrentPage =1
  viewtrn(page =1)
  {
    this.viewtrnlist=[]
    this.spinner.show()
    this.service.getViewTrans(this.apinvHeader_id, page).subscribe(data=>{
      this.spinner.hide()
      this.viewtrnlist=data['data'];
      let pagination = data['pagination']
      
      if (this.viewtrnlist.length > 0) {
        this.length_viewtrn =data?.count
        this.viewtrnCurrentPage = pagination.index;
      }
    
    })
  }
 
 
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons:boolean=true;
  
  length_viewtrn = 0;
  pageSize_Viewtrn = 10
  pageIndexViewtrn=0
  handleViewtrn(event: PageEvent) {
    this.length_viewtrn = event.length;
    this.pageSize_Viewtrn = event.pageSize;
    this.pageIndexViewtrn = event.pageIndex;
    this.viewtrnCurrentPage=event.pageIndex+1;
    this.viewtrn( this.viewtrnCurrentPage);  
  }

  name: any;
  designation: any
  branch: any;
  view(dt) {
    this.name = dt.from_user.name + ' - ' + dt.from_user.code
    this.designation = dt.from_user.designation
    this.branch = dt.from_user_branch.name + ' - ' + dt.from_user_branch.code
  }
  viewto(dt) {
    this.name = dt.to_user.name + ' - ' + dt.to_user.code
    this.designation = dt.to_user.designation
    this.branch = dt.to_user_branch.name + ' - ' + dt.to_user_branch.code
  }

  ecfApprove() {
    let datas = this.SubmitECFApproverForm.value.remark
    if (datas == "" || datas == null || datas == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    // let chk = 1
    // for(let i= 0; i<this.invheaderdata.length; i++)
    //   {
    //     if(this.hdrSelectable[i] == false)
    //       chk =0
    //   }
    // if(chk == 0 )	
    // {	
    //   this.toastr.error('Please Check Audit & Dedup CheckList.')	
    //   return false	
    // }
    this.spinner.show()

    this.service.ecfApprove(this.SubmitECFApproverForm.value, '')

      .subscribe(result => {
        this.spinner.hide();

        if (result.status != "success") {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully Approved!...")
          // this.onSubmit.emit()
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.spinner.hide();
        }
      )
  }

  ecfReject() {
    let datas = this.SubmitECFApproverForm.value.remark
    if (datas == "" || datas == null || datas == undefined) {
      this.notification.showError("Please Enter Remarks")
      return false;
    }
    // let chk = 1
    // for(let i= 0; i<this.invheaderdata.length; i++)
    //   {
    //     if(this.hdrSelectable[i] == false)
    //       chk =0
    //   }
    // if(chk == 0 )	
    // {	
    //   this.toastr.error('Please Check Audit & Dedup CheckList.')	
    //   return false	
    // }
    this.spinner.show()

    this.service.ecfReject(this.SubmitECFApproverForm.value)

      .subscribe(result => {
        this.spinner.hide();

        if (result.status != "success") {
          this.notification.showError(result.description)
          return false
        }
        else {
          this.notification.showSuccess("Successfully Rejected!...")
          // this.onSubmit.emit()
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.spinner.hide();
        }
      )
  }

  forward() {
    let approverid: any
    this.spinner.show()
    if (this.SubmitECFApproverForm?.value?.approvedby === "") {
      this.toastr.error('Please Choose Approver');
      this.spinner.hide()
      return false;
    }
    if (this.SubmitECFApproverForm?.value?.remark === "") {
      this.toastr.error('Please Enter Remarks');
      this.spinner.hide()
      return false;
    }

    if (typeof (this.SubmitECFApproverForm?.value?.approvedby) == 'object') {
      approverid = this.SubmitECFApproverForm?.value?.approvedby?.id
    } else if (typeof (this.SubmitECFApproverForm?.value?.approvedby) == 'number') {
      approverid = this.SubmitECFApproverForm?.value?.approvedby
    } else {
      this.toastr.error('Please Choose Approver Name from the Dropdown');
      this.spinner.hide()
      return false;

    }


    let data = {
      "id": this.ecfheaderid,
      "approvedby": approverid,
      "remark": this.SubmitECFApproverForm?.value?.remark
    }
    this.service.ecfapproveforward(data)
      .subscribe(result => {
        if (result?.status == 'success') {
          this.notification.showSuccess('Forwarded Successfully')
          this.spinner.hide()
          // this.onSubmit.emit();
        } else {
          this.notification.showError(result?.description)
          this.spinner.hide()
          return false;
        }

      },

        error => {
          this.errorHandler.handleError(error);
          this.spinner.hide();
        }
      )

  }
  getsupplierindex(dtl) {
    this.popupopen2();

    this.SupplierDetailForm.patchValue({
      suppliergst: dtl?.supplier_gst,
      invoiceno: dtl?.invoiceno,
      invoicedate: dtl?.invoicedate,
      supplier_name: dtl?.supplier_name,
      pincode: dtl?.pincode,
      address: dtl?.address
    })
  }
  supplierBack() {
    this.supclosebuttons.nativeElement.click();
  }

  getcat(catkeyvalue) {
    // if (this.isCaptalized == true)
    // {
    //   catkeyvalue = "facl"
    // }
    this.service.getcat(catkeyvalue, this.aptypeid)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        datas = datas.filter(x => x.code != "SUSPENSE")
        // if(this.isCaptalized == false)
        //   {
        //     datas = datas.filter(x=> x.code != "FACL")
        //   }
      })
  }

  public displaycatFn(cattype?: catlistss): string | undefined {
    return cattype ? cattype.code : undefined;
  }

  get cattype() {
    return this.DebitDetailForm.get('category_code');
  }
  categoryScroll() {
    setTimeout(() => {
      if (
        this.matcatAutocomplete &&
        this.matcatAutocomplete &&
        this.matcatAutocomplete.panel
      ) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                // let cat = "facl"
                // if(!this.isCaptalized)
                // {
                //   cat =this.categoryInput.nativeElement.value
                // }
                let cat = this.categoryInput.nativeElement.value

                this.service.getcategoryscroll(cat, this.currentpage + 1, this.aptypeid)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    datas = datas.filter(x => x.code != "SUSPENSE")
                    // if(this.isCaptalized == false)
                    //   {
                    //     datas = datas.filter(x=> x.code != "FACL")
                    //   }

                    let datapagination = results["pagination"];
                    if (this.categoryNameData.length >= 0) {
                      this.categoryNameData = this.categoryNameData.concat(datas);
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


  public displaysubcatFn(subcategorytype?: subcatlistss): string | undefined {
    return subcategorytype ? subcategorytype.code : undefined;
  }

  get subcategorytype() {
    return this.DebitDetailForm.get('subcategory_code');
  }

  subcategoryScroll() {
    setTimeout(() => {
      if (
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete &&
        this.matsubcatAutocomplete.panel
      ) {
        fromEvent(this.matsubcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getsubcategoryscroll(this.catid, this.subcategoryInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.subcategoryNameData.length >= 0) {
                      this.subcategoryNameData = this.subcategoryNameData.concat(datas);
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


  subcatid: any;
  GLNumb
  getsubcat(id, subcatkeyvalue) {
    this.spinner.show()
    this.service.getsubcat(id, subcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.subcategoryNameData = datas;
        this.spinner.hide()
      })
  }
  getGLNumber(data, index) {
    this.GLNumb = data.glno
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('glno').setValue(data.glno)
    this.DebitDetailForm.get('debitdtl')['controls'][index].get('gldesc').setValue(data.gl_name)

    // if(this.expenseTaxID != undefined)
    //   this.DebitDetailForm.get('debitdtl')['controls'][this.expenseTaxID].get('glno').setValue(data.glno)

  }

  getbsdropdown() {
    this.getbs('')
  }
  public displaybsFn(bstype?: bslistss): string | undefined {
    return bstype ? bstype.name : undefined;
  }

  get bstype() {
    return this.DebitDetailForm.get('bs');
  }
  getbs(bskeyvalue) {
    this.service.getbs(bskeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsNameData = datas;
        this.catid = datas.id;

      })
  }

  bsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.matbsAutocomplete &&
        this.matbsAutocomplete.panel
      ) {
        fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getbsscroll(this.bsInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.bsNameData.length >= 0) {
                      this.bsNameData = this.bsNameData.concat(datas);
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
  bsidd: any

  bsid(data, code, i) {
    this.bssid = data['id'];
    this.bsidd = code;
    this.DebitDetailForm.get('debitdtl')['controls'][i].get('cc_code').reset("")
    this.getcc(this.bssid, "");
  }
  // crnbsid(data, code) {
  //   this.bssid = data['id'];
  //   this.bsidd = code;
  //   this.creditglForm.get('cc_code').reset("")
  //   this.getcc(this.bssid, "");
  // }
  public displayccFn(cctype?: cclistss): string | undefined {
    return cctype ? cctype.name : undefined;
  }

  ccidd: any
  cccodeid: any
  getccdata(code, id) {
    this.ccidd = code
    this.cccodeid = id

  }
  get cctype() {
    return this.DebitDetailForm.get('cc');
  }
  ccid: any;
  getcc(bssid, cckeyvalue) {
    this.spinner.show()
    this.service.getcc(bssid, cckeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccNameData = datas;
        this.ccid = datas.id;
        this.spinner.hide()

      })

  }

  ccScroll() {
    setTimeout(() => {
      if (
        this.matccAutocomplete &&
        this.matccAutocomplete &&
        this.matccAutocomplete.panel
      ) {
        fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.service.getccscroll(this.bssid, this.ccInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    if (this.ccNameData.length >= 0) {
                      this.ccNameData = this.ccNameData.concat(datas);
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

  bsClear(ind) {
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('bs_code').setValue('')
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('cc_code').setValue('')
  }
  CCclear(ind) {
    this.DebitDetailForm.get('debitdtl')['controls'][ind].get('cc_code').setValue('')
  }
  debitres: any
  debitform() {


    this.debitsaved = true
    const dbtdetaildata = this.DebitDetailForm.value.debitdtl;

    let debVal = []
    let j = 0
    for (let i in dbtdetaildata) {

      if (dbtdetaildata[i].category_code?.code == 'GST Tax') {
        j++
        continue;
      }

      let bscode = dbtdetaildata[i].bs_code
      if (typeof (dbtdetaildata[i].bs_code) == 'object')
        bscode = bscode?.code
      if ((bscode == '') || (bscode == null) || (bscode == undefined)) {
        this.toastr.error('Please Choose Bussiness Segment');
        this.debitsaved = false
        return false;
      }

      let cccode = dbtdetaildata[i].cc_code
      if (typeof (dbtdetaildata[i].cc_code) == 'object')
        cccode = cccode?.code
      if ((cccode == '') || (cccode == null) || (cccode == undefined)) {
        this.toastr.error('Please Choose Cost Centre');
        this.debitsaved = false
        return false;
      }

      if (dbtdetaildata[i].id === "") {
        delete dbtdetaildata[i].id
      }

      dbtdetaildata[i].amount = String(dbtdetaildata[i].amount).replace(/,/g, '')

      if (typeof (dbtdetaildata[i].category_code) == 'object')
        dbtdetaildata[i].category_code = dbtdetaildata[i].category_code.code
      if (typeof (dbtdetaildata[i].subcategory_code) == 'object')
        dbtdetaildata[i].subcategory_code = dbtdetaildata[i].subcategory_code.code
      if (typeof (dbtdetaildata[i].bs_code) == 'object')
        dbtdetaildata[i].bs_code = dbtdetaildata[i].bs_code.code
      if (typeof (dbtdetaildata[i].cc_code) == 'object')
        dbtdetaildata[i].cc_code = dbtdetaildata[i].cc_code.code
      dbtdetaildata[i].deductionamount = 0

      if (dbtdetaildata[i].id === "") {
        delete dbtdetaildata[i].id
      }
      if (this.invdtladdonid === "" || this.invdtladdonid === undefined || this.invdtladdonid === null) {
        delete dbtdetaildata[i].apinvoicedetail_id
      }
      else {
        dbtdetaildata[i].apinvoicedetail_id = this.invdtladdonid
      }
      debVal.push(dbtdetaildata[i])
      j++
    }

    if (debVal.length > 0) {
      let debdet = { "entry_list": debVal }
      this.spinner.show();

      this.service.debitCreditAddEdit(this.apinvHeader_id, debdet)
        .subscribe(result => {
          this.spinner.hide();

          if (result.status != undefined) {
            this.notification.showError(result.message)

          }
          else {
            this.notification.showSuccess("Successfully Debit Details Saved!...")
            this.debitres = result["data"]
            console.log("saved debit ", this.debitres)
            this.debitsaved = true
            //check for ccbs
            this.spinner.show();

            this.service.getDebitCredit(this.apinvHeader_id, this.invdtladdonid, 1)
              .subscribe(result => {
                this.spinner.hide();

                if (result) {
                  this.debitres = result.data
                  console.log(" Debit data ...", this.debitres)

                  let invdbtdatas = this.DebitDetailForm.get('debitdtl') as FormArray
                  invdbtdatas.clear()
                  this.debitdata = this.debitres.filter(x => x.is_display == "YES" && x.amount >= 0)

                  this.getdebitrecords(this.debitdata)
                  if (this.aptypeid != 4)
                    this.debitClose()
                }
              })
          }
        })
    }
    else {
      this.notification.showError("There are no changes to save.");
    }

  }
  SummaryApitransactionObjNew: any
  SummarytransactionData: any = [
    { columnname: "Type", key: "Type" },
    { columnname: "Status", key: "comments" },
    { columnname: "Transaction Date", key: "created_date", "type": 'date', "datetype": "dd-MMM-yyyy" },
    { columnname: "Remarks", key: "remarks", tooltip:{"dynamic":true,tooltipValue:"remarks"}  }, // tooltip   <td style="width: 255px;"><div style="width: 250px;overflow: hidden;"[matTooltip]="dt.remarks" matTooltipClass="custom-tooltipnew"> {{dt.remarks}}</div></td>
    { columnname: "Employee Name", key: "from_user", type: "object", objkey: "name", suffix: "View Details",suffix_style:{color:"green",display:"block"},  function: true, clickfunction: this.view.bind(this) },
    { columnname: "Approver Name ", key: "to_user", type: "object", objkey: "name", suffix: "View Details",suffix_style:{color:"green",display:"block"},  function: true, clickfunction: this.viewto.bind(this) },
  ]

 transaction_summary() {
    // this.SummaryApitransactionObjNew = {
    //   FeSummary: true,
    //   data: this.viewtrnlist
    // }
    this.popupopen1();
    this.name = ''; 
    this.designation = ''; 
    this.branch = ''; 
    this.SummaryApitransactionObjNew = {
      method: "get",
      url: this.url + "ecfapserv/view_transaction/" + this.apinvHeader_id,
      params: ""
    }
  }

  popupopen1() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("approver-inv-view-0001"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }
  popupopen2() {
    var myModal = new (bootstrap as any).Modal(
      document.getElementById("approver-inv-view-0002"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    myModal.show();
  }

  CrnData:any;
  crnSubData:any;
  crnglno:any;
    crnglpopupopen() {
      var myModal = new (bootstrap as any).Modal(
        document.getElementById("crnglpopup"),
        {
          backdrop: "static",
          keyboard: false,
        }
      );
      myModal.show();
    }
 @ViewChild('closebuttonsgl') closebuttonsgl;
  crnback(){
    this.closebuttonsgl.nativeElement.click()
  }
}
