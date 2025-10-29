import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SGShareService } from './../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SGService } from '../SG.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

import { NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';



// export const PICK_FORMATS = {
//   parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
//   display: {
//     dateInput: 'input',
//     monthYearLabel: { year: 'numeric', month: 'short' },
//     dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
//     monthYearA11yLabel: { year: 'numeric', month: 'long' }
//   }
// };
// class PickDateAdapter extends NativeDateAdapter {
//   format(date: Date, displayFormat: Object): string {
//     if (displayFormat === 'input') {
//       return formatDate(date, 'dd-MMM-yyyy', this.locale);
//     } else {
//       return date.toDateString();
//     }
//   }
// }

export interface branchList {
  id: number
  name: string
  code: string
}
export interface premiseList {
  id: number
  name: string
  code: string
}
export interface approvalBranch {
  id: string;
  name: string;
  code: string;
}
export interface approver {
  id: string;
  full_name: string;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // { provide: DateAdapter, useClass: PickDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    // DatePipe
  ],
})
export class AddInvoiceComponent implements OnInit {
  // [max]="maxDate"
maxDate: Date;

  // branch dropdown
  @ViewChild('branchContactInput') branchContactInput: any;
  @ViewChild('branch') matAutocompletebrach: MatAutocomplete;

  // Premise dropdown
  @ViewChild('PremiseContactInput') PremiseContactInput: any;
  @ViewChild('premise') matAutocompletepremise: MatAutocomplete;

  @ViewChild('PremiseContactInput') clear_premises;

  //approval branch
  @ViewChild('appBranchInput') appBranchInput: any;
  @ViewChild('approvalBranch') matAutocompleteappbranch: MatAutocomplete;

  // Approver dropdown
  @ViewChild('ApproverContactInput') ApproverContactInput: any;
  @ViewChild('employee') matAutocompleteapprover: MatAutocomplete;

  @ViewChild('ApproverContactInput') clear_appBranch;


  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  addInvoice: FormGroup
  branchcertificationId: FormGroup
  branchCertifate_Id: any;
  branchCertifate_list: any;
  branchList: Array<branchList>;
  premiseList: Array<premiseList>;
  approvalbranchList: Array<approvalBranch>;
  employeeList: Array<approver>;
  isLoading = false
  dataEntryButton = true;
  isShowtable = false;
  branchcertification_id_check: any;
  count = 0;
  gsttwonumber: any;
  b_gsttwonumber: any;
  inputGstValue = ""; 
  constructor(private fb: FormBuilder, private tostar: ToastrService, private router: Router,
    private sgservice: SGService, private datepipe: DatePipe, private datePipe: DatePipe,
    private notification: NotificationService, private shareservice: SGShareService,
    private errorHandler: ErrorHandlingService, private SpinnerService: NgxSpinnerService,
    private toast: ToastrService, private toastr: ToastrService) { }


  monthdate = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.year(normalizedYear.year());
    this.monthdate.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monthdate.value;
    ctrlValue.month(normalizedMonth.month());
    this.monthdate.setValue(ctrlValue);
    datepicker.close();
    this.branchcertificationId.patchValue({
      monthdate: this.monthdate.value
    })
    this.count = 0
  }

  ngOnInit(): void {
    this.branchcertificationId = this.fb.group({
      monthdate: [''],
      premise_id: [''],
      branch_id: ['']
    })
    this.addInvoice = this.fb.group({
      dataentrysite: [''],
      invoicemonth: [''],
      // nationalhdaysat: [''],



      securitypan: [''],
      securityagencename: [''],
      // servicetaxno:[''],

      // noofdays: [''],
      invoiceno: [''],
      invoicedate: [''],

      aguarddutiespday: [''],
      aguarddutiesmonth: [''],

      unaguarddutiespday: [''],
      unaguarddutiesmonth: [''],

      gst_no: [''],
      abillamt: [''],
      sbillamt: [''],

      totlbillamt: [''],

      approval_branch: [''],
      // approval_branch_name:[''],
      approver: [''],

      cgstamt: [''],
      sgstamt: [''],
      igstamt: [''],
      totalgst: [''],
      totlamtpayable: [''],
      vendor_id: ['']

    });
    this.maxDate = new Date();
  }


  // Total number of Whole mouth

  wholemontharmedguard: number = 0;
  wholemounthsecgusrd: number = 0;
  noofdaysv: number = 0;
  dutyperdayarm: number = 0;
  dutyperdaysg: number = 0;

  Noofday(event) {
    this.noofdaysv = parseFloat(event.target.value)
    this.wholemounthsecgusrd = this.noofdaysv * this.dutyperdaysg
    this
    this.wholemontharmedguard = this.noofdaysv * this.dutyperdayarm
  }
  noofdutiesdayarm(event) {
    this.dutyperdayarm = parseFloat(event.target.value)
    this.wholemontharmedguard = this.noofdaysv * this.dutyperdayarm

  }

  // Total bill amount

  Totalbillamt: number = 0;
  Sgamount: number = 0;
  Agamount: number = 0;

  billamountofAG(event) {
    this.Agamount = parseFloat(event.target.value)
    this.Totalbillamt = this.Sgamount + this.Agamount
  }
  noofdutiesdaysg(event) {
    this.dutyperdaysg = parseFloat(event.target.value)
    this.wholemounthsecgusrd = this.dutyperdaysg * this.noofdaysv

  }
  billamountofSG(event) {
    this.Sgamount = parseFloat(event.target.value)
    this.Totalbillamt = this.Sgamount + this.Agamount
  }

  // GST and Total amount calculation

  sgst: number = 0;
  cgst: number = 0;
  gst: number = 0;

  alltotalamount: number = 0;

  findcgst(event) {
    this.cgst = parseFloat(event.target.value)
    this.gst = this.sgst + this.cgst
    this.alltotalamount = this.gst + this.Totalbillamt
  }

  findsgst(event) {
    this.sgst = parseFloat(event.target.value)
    this.gst = this.sgst + this.cgst;
    this.alltotalamount = this.gst + this.Totalbillamt
  }


  onResetclick() {

    this.wholemontharmedguard = 0;
    this.wholemounthsecgusrd = 0;
    this.noofdaysv = 0;
    this.dutyperdayarm = 0;
    this.dutyperdaysg = 0;
    this.Totalbillamt = 0;
    this.Sgamount = 0;
    this.Agamount = 0;

    this.sgst = 0;
    this.cgst = 0;
    this.gst = 0;

    this.alltotalamount = 0;
    this.addInvoice.reset();
  }


  //get Approval branch name & id
  approver(data) {
    console.log("invoice-approver", data)
    this.addInvoice.patchValue({
      "approval_branch_name": data.branch_code + '-' + data.branch_name,
      "approval_branch": data.branch_id
    })
  }



  omit_ForwardSlash(event) {
    var a;
    a = event.which;
    if ((a == 92)) {
      return false;
    }
  }


  only_char(event) {
    var a;
    a = event.which;
    if ((a > 32) && (a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  keyPressAmounts(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[0-9.]/.test(inp) || event.keyCode == 32) {
      return true;
    } else {
      event.preventDefault();
      this.toastr.warning('', 'Number only accepted ', { timeOut: 1500 });
      return false;

    }
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp) || event.keyCode == 32) {
      return true;
    } else {
      event.preventDefault();
      this.toast.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });
      return false;

    }
  }

  // validationGstNo(event) {
  //   let gstno = event.target.value;
  //   let gst = gstno
  //   gst = gst.slice(0, 2);
  //   this.gsttwonumber = gst;
  //   console.log("focusout gst------",this.gsttwonumber)
  //   if(this.branchCertifate_list.vendor.composite == 1 || this.branchCertifate_list.vendor.composite == 2){
  //     if(this.gsttwonumber == this.b_gsttwonumber){
  //       this.addInvoice.patchValue({
  //         cgstamt: this.fout_cgst,
  //         sgstamt: this.fout_sgst,
  //         igstamt: "0",
  //       })
  //      }else{
  //       this.addInvoice.patchValue({
  //         cgstamt: "0",
  //         sgstamt: "0",
  //         igstamt: this.fout_tgst,
  //       })

  //      }
  //   } else {
  //     this.addInvoice.patchValue({
  //       cgstamt: "0",
  //       sgstamt: "0",
  //       igstamt: "0",
  //       totalgst: "0",
  //       totlamtpayable: this.Tbillamt
  //     })
  //   }

  // }


  c_gst: boolean = false;
  s_gst: boolean = false;
  i_gst: boolean = false;
  Cgst(event) {
    let count = 0;
    if (event.target.value == "") {
      count++;
      this.i_gst = false;
    }
    if (count == 0) {
      this.i_gst = true;
    }

  }
  Sgst(event) {
    let count = 0
    if (event.target.value == "") {
      count++
      this.i_gst = false;
    }
    if (count == 0) {
      this.i_gst = true;
    }
  }
  Igst(event) {
    let count = 0
    if (event.target.value == "") {
      count++
      this.c_gst = false;
      this.s_gst = false;
    }
    if (count == 0) {
      this.c_gst = true;
      this.s_gst = true;
    }
  }

  idValue: any;
  keyFor_appr_Branch = false;
  keyFor_approver = false;
  onSubmitClick() {
    this.SpinnerService.show();
    // this.addInvoice.patchValue({
    //   aguarddutiesmonth:this.wholemontharmedguard,
    //   totalgst: this.gst,
    //   totlamtpayable:this.alltotalamount,
    //   totlbillamt: this.Totalbillamt,
    //   unaguarddutiesmonth:this.wholemounthsecgusrd
    // })
    // const startDate = this.addInvoice.value;
    // startDate.invoicemonth = this.datePipe.transform(startDate.invoicemonth, 'yyyy-MM-dd');
    if (this.addInvoice.value.dataentrysite === "") {
      this.tostar.error('Please Enter Site');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.addInvoice.value.nationalhdaysat === "") {
    //   this.tostar.error('Please Enter No of National/Festival holidays');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    // if (this.addInvoice.value.aguardhdaysat === "") {
    //   this.tostar.error('Please Enter No of Armed Guard duties on holidays(Saturday)');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.addInvoice.value.sguardhdaysat === "") {
    //   this.tostar.error('Please Enter No of Security  Guard duties on holidays(Saturday)');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    // if (this.addInvoice.value.aguardhdaysatfri === "") {
    //   this.tostar.error('Please Enter No of Armed Guard duties on holidays(Other than Saturday -Sun to Fri)');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.addInvoice.value.sguardhdaysatfri === "") {
    //   this.tostar.error('Please Enter No of Security Guard duties on holidays(Other than Saturday -Sun to Fri)');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.addInvoice.value.servicetaxno === ""){
    //   this.tostar.error('Please Enter Security Tax Number');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.addInvoice.value.gst_no === ""){
    //   this.tostar.error('Please Enter GST Number');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.addInvoice.value.noofdays === "") {
    //   this.tostar.error('Please Enter No of Days');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    if (this.addInvoice.value.invoiceno === "") {
      this.tostar.error('Please Enter Invoice Number');
      this.SpinnerService.hide();
      return false;
    }
    if (this.addInvoice.value.invoicedate === "") {
      this.tostar.error('Please Enter Invoice Date');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.addInvoice.value.approval_branch === ""){
    //   this.tostar.error('Add Approval Branch Field', 'Select Any one Approval Branch', { timeOut: 1500 });
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.addInvoice.value.approver === ""){
    //   this.tostar.error('Add Approver Field', 'Select Any one Approver', { timeOut: 1500 });
    //   this.SpinnerService.hide();
    //   return false;
    // }
    if (this.keyFor_appr_Branch == false) {
      if (this.addInvoice.value.approval_branch.id === undefined || this.addInvoice.value.approval_branch === "") {
        this.tostar.error('Add Approval Branch Field', 'Select Any one Approval Branch', { timeOut: 1500 });
        this.SpinnerService.hide();
        return false;
      }
    }

    if (this.keyFor_approver == false) {
      if (this.addInvoice.value.approver.id === undefined || this.addInvoice.value.approver === "") {
        this.tostar.error('Add Approver Field', 'Select Any one Approver', { timeOut: 1500 });
        this.SpinnerService.hide();
        return false;
      }
    }
    // if(this.addInvoice.value.invoiceno != ""){
    //   if(this.addInvoice.value.invoiceno.length != 16) {
    //     this.notification.showError("InvoiceNo length should be 16 digit");
    //     this.SpinnerService.hide();
    //     return false;
    //   }
    // }
    if (this.imagesForInvoice === undefined) {
      this.toastr.warning('', 'Choose Upload Files ', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false;
    }
    const endDate = this.addInvoice.value;
    endDate.invoicedate = this.datePipe.transform(endDate.invoicedate, 'yyyy-MM-dd');

    if (this.addInvoice.value.approval_branch.id != undefined) {

      this.addInvoice.value.approval_branch = this.addInvoice.value.approval_branch.id
      this.addInvoice.value.approver = this.addInvoice.value.approver.id



      //remove comma filed for abill
      var aabill = this.addInvoice.value.abillamt;
      var armedBillCommaRemoved = aabill.replace(/,/g, "");
      this.addInvoice.value.abillamt = armedBillCommaRemoved
      console.log("aabcd", this.addInvoice.value.abillamt)
      //sbill
      var ssbill = this.addInvoice.value.sbillamt;
      var securityBillCommaRemoved = ssbill.replace(/,/g, "");
      this.addInvoice.value.sbillamt = securityBillCommaRemoved
      //total bill
      var ttbill = this.addInvoice.value.totlbillamt;
      var ttBillCommaRemoved = ttbill.replace(/,/g, "");
      this.addInvoice.value.totlbillamt = ttBillCommaRemoved
      //cgst
      var cgstvalue = this.addInvoice.value.cgstamt;
      var cgstCommaRemoved = cgstvalue.replace(/,/g, "");
      this.addInvoice.value.cgstamt = cgstCommaRemoved
      //sgst
      var sgstvalue = this.addInvoice.value.sgstamt;
      var sgstCommaRemoved = sgstvalue.replace(/,/g, "");
      this.addInvoice.value.sgstamt = sgstCommaRemoved
      //igst
      var igstvalue = this.addInvoice.value.igstamt;
      var igstCommaRemoved = igstvalue.replace(/,/g, "");
      this.addInvoice.value.igstamt = igstCommaRemoved
      //totalgst
      var totalgstvalue = this.addInvoice.value.totalgst;
      var tlgstCommaRemoved = totalgstvalue.replace(/,/g, "");
      this.addInvoice.value.totalgst = tlgstCommaRemoved
      //payable
      var payvalue = this.addInvoice.value.totlamtpayable;
      var payableCommaRemoved = payvalue.replace(/,/g, "");
      this.addInvoice.value.totlamtpayable = payableCommaRemoved


      const abill = this.addInvoice.value;
      abill.abillamt = Number(abill.abillamt)
      const sbill = this.addInvoice.value;
      sbill.sbillamt = Number(sbill.sbillamt)
      const tbill = this.addInvoice.value;
      tbill.totlbillamt = Number(tbill.totlbillamt)
      const cgt = this.addInvoice.value;
      cgt.cgstamt = Number(cgt.cgstamt)
      const sgt = this.addInvoice.value;
      sgt.sgstamt = Number(sgt.sgstamt)
      const igt = this.addInvoice.value;
      igt.igstamt = Number(igt.igstamt)
      const tgt = this.addInvoice.value;
      tgt.totalgst = Number(tgt.totalgst)
      const tamt = this.addInvoice.value;
      tamt.totlamtpayable = Number(tamt.totlamtpayable)
    }


    if (this.addInvoice.value.gst_no === "") {
      this.addInvoice.value.gst_no = null
    }
    // if(this.addInvoice.value.cgstamt=== 0 && this.addInvoice.value.sgstamt=== 0){
    //   this.addInvoice.value.cgstamt=null
    //   this.addInvoice.value.sgstamt=null
    // }

    console.log("onsubmit click", this.addInvoice.value)

    this.sgservice.InvoicedataEntry(this.addInvoice.value, this.branchCertifate_Id, this.imagesForInvoice)
      .subscribe(result => {
        if (result.status === "success") {
          this.notification.showSuccess("Successfully created!...")
          this.SpinnerService.hide();
          // let dataIdToApprove  = result.id
          let json = {
            "status": 2, "invoice_id": result.id

          }
          let remarksJson = {
            "remarks": null,
          }
          this.sgservice.movetoCheckerInvoice(remarksJson, json)
            .subscribe(res => {
              if (res.status == "success") {
                this.notification.showSuccess("Moved to checker!...")
                this.SpinnerService.hide();
              } else {
                this.notification.showError(res.description)
                this.SpinnerService.hide();
              }
              //  return true
              this.onSubmit.emit();
              this.keyFor_appr_Branch = false
              this.keyFor_approver = false
            })
          // let json ={
          //   "branch":this.branchRecord,
          //   "premise":this.premiseRecord,
          //   "month":this.create_month,
          //   "year":this.create_year,
          //   "branchcertification_id":this.branchCertifate_Id
          // }
          // this.shareservice.invoiceSummaryDetails.next(json)
          // this.router.navigate(['SGmodule/invoiceView'], { skipLocationChange: true })
          // this.router.navigate(['SGmodule/securityguardpayment',2], { skipLocationChange: true })
        }
        else {
          this.notification.showError(result.description)
          this.keyFor_appr_Branch = true
          this.keyFor_approver = true
          this.SpinnerService.hide();
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.keyFor_appr_Branch = true
          this.keyFor_approver = true
          this.SpinnerService.hide();
        })

  }

  onCancelClick() {
    // this.router.navigate(['SGmodule/securityguardpayment',2], { skipLocationChange: true })
    this.onCancel.emit();
  }




  Abillamt: any;
  Sbillamt: any;
  Tbillamt: any;
  CGST: any;
  fout_cgst: any;
  SGST: any;
  fout_sgst: any;
  IGST: any;
  TotAmtPayable: any;
  TotalGST: any;
  fout_tgst: any;
  create_month: any;
  create_year: any;

  //  onClick invoice data entry button
  onClickInvoiceButton() {
    if (this.branchcertificationId.value.branch_id === "") {
      this.tostar.error('Add Branch Field', 'Select Any one Branch', { timeOut: 1500 });
      return false;
    }
    if (this.branchcertificationId.value.premise_id === "") {
      this.tostar.error('Add Site Field', 'Select Any one Site', { timeOut: 1500 });
      return false;
    }
    if (this.branchcertificationId.value.monthdate === "") {
      this.tostar.error('Add Month Field', 'Select month and year', { timeOut: 1500 });
      return false;
    }
    let site = "(" + this.branchcertificationId.value.premise_id.code + ") " + this.branchcertificationId.value.premise_id.name
    this.branchcertificationId.value.premise_id = this.branchcertificationId.value.premise_id.id
    this.branchcertificationId.value.branch_id = this.branchcertificationId.value.branch_id.id
    let month = this.datepipe.transform(this.branchcertificationId.value.monthdate, "M");
    let fullMonth = this.datepipe.transform(this.branchcertificationId.value.monthdate, "MMMM-yyyy");
    let year = this.datepipe.transform(this.branchcertificationId.value.monthdate, "yyyy")
    let MONTH = Number(month)
    let YEAR = Number(year)
    this.create_month = MONTH
    this.create_year = YEAR

    this.sgservice.branchcertification_id_check(this.branchcertificationId.value, month, year)
      .subscribe((result) => {
        let datas = result['data'];
        this.branchcertification_id_check = datas;
        console.log("branchcertification_id_check", this.branchcertification_id_check)
        if (this.branchcertification_id_check.length != 0) {
          this.dataEntryButton = false;
          this.isShowtable = true;
          this.branchCertifate_Id = this.branchcertification_id_check[0].id
          this.branchCertifate_list = this.branchcertification_id_check[0]
          console.log("branchCertifate_Id", this.branchCertifate_Id)

          this.sgservice.monthlyDraftFetch(this.branchcertificationId.value, MONTH, YEAR, this.branchCertifate_list.vendor.id)
            .subscribe((result) => {
              let data = result;
              console.log("calculation", data)
              //abill with comma added
              if (data.armed_miniwages_total != null) {
                let Abill = data.armed_miniwages_total.totalbill_roundoff
                let ANumber: number = Abill;
                this.Abillamt = ANumber.toLocaleString();
              } else {
                this.Abillamt = "0"
              }

              //sbill with comma added
              if (data.unarmed_miniwages_total != null) {
                let Sbill = data.unarmed_miniwages_total.totalbill_roundoff
                let sNumber: number = Sbill;
                this.Sbillamt = sNumber.toLocaleString();
              } else {
                this.Sbillamt = "0"
              }

              //Total bill with comma added
              if (data.armed_miniwages_total != null && data.unarmed_miniwages_total != null) {
                let Tbill = data.armed_miniwages_total.totalbill_roundoff + data.unarmed_miniwages_total.totalbill_roundoff
                let TNumber: number = Tbill;
                this.Tbillamt = TNumber.toLocaleString();
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total != null) {
                let Tbill = 0 + data.unarmed_miniwages_total.totalbill_roundoff
                let TNumber: number = Tbill;
                this.Tbillamt = TNumber.toLocaleString();
              } if (data.armed_miniwages_total != null && data.unarmed_miniwages_total == null) {
                let Tbill = data.armed_miniwages_total.totalbill_roundoff + 0
                let TNumber: number = Tbill;
                this.Tbillamt = TNumber.toLocaleString();
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total == null) {
                this.Tbillamt = "0"
              }

              //cgst
              if (data.armed_miniwages_total != null && data.unarmed_miniwages_total != null) {
                let c_gstamt = data.armed_miniwages_total.cgst + data.unarmed_miniwages_total.cgst
                let CAMt: number = c_gstamt;
                let cgstConvertToDecimal = CAMt.toFixed(2);
                let cgstConvertToNumber = Number(cgstConvertToDecimal)
                let CNumber: number = cgstConvertToNumber;
                this.CGST = CNumber.toLocaleString();
                this.fout_cgst = this.CGST
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total != null) {
                let c_gstamt = 0 + data.unarmed_miniwages_total.cgst
                let CAMt: number = c_gstamt;
                let cgstConvertToDecimal = CAMt.toFixed(2);
                let cgstConvertToNumber = Number(cgstConvertToDecimal)
                let CNumber: number = cgstConvertToNumber;
                this.CGST = CNumber.toLocaleString();
                this.fout_cgst = this.CGST
              } if (data.armed_miniwages_total != null && data.unarmed_miniwages_total == null) {
                let c_gstamt = data.armed_miniwages_total.cgst + 0
                let CAMt: number = c_gstamt;
                let cgstConvertToDecimal = CAMt.toFixed(2);
                let cgstConvertToNumber = Number(cgstConvertToDecimal)
                let CNumber: number = cgstConvertToNumber;
                this.CGST = CNumber.toLocaleString();
                this.fout_cgst = this.CGST
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total == null) {
                this.CGST = "0"
                this.fout_cgst = this.CGST
              }

              //sgst
              if (data.armed_miniwages_total != null && data.unarmed_miniwages_total != null) {
                let s_gstamt = data.armed_miniwages_total.sgst + data.unarmed_miniwages_total.sgst
                let SAMt: number = s_gstamt;
                let sgstConvertToDecimal = SAMt.toFixed(2);
                let sgstConvertToNumber = Number(sgstConvertToDecimal)
                let SNumber: number = sgstConvertToNumber;
                this.SGST = SNumber.toLocaleString();
                this.fout_sgst = this.SGST
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total != null) {
                let s_gstamt = 0 + data.unarmed_miniwages_total.sgst
                let SAMt: number = s_gstamt;
                let sgstConvertToDecimal = SAMt.toFixed(2);
                let sgstConvertToNumber = Number(sgstConvertToDecimal)
                let SNumber: number = sgstConvertToNumber;
                this.SGST = SNumber.toLocaleString();
                this.fout_sgst = this.SGST
              } if (data.armed_miniwages_total != null && data.unarmed_miniwages_total == null) {
                let s_gstamt = data.armed_miniwages_total.sgst + 0
                let SAMt: number = s_gstamt;
                let sgstConvertToDecimal = SAMt.toFixed(2);
                let sgstConvertToNumber = Number(sgstConvertToDecimal)
                let SNumber: number = sgstConvertToNumber;
                this.SGST = SNumber.toLocaleString();
                this.fout_sgst = this.SGST
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total == null) {
                this.SGST = "0"
                this.fout_sgst = this.SGST
              }

              //igst
              if (data.armed_miniwages_total != null && data.unarmed_miniwages_total != null) {
                let i_gstamt = data.armed_miniwages_total.igst + data.unarmed_miniwages_total.igst
                let IAMt: number = i_gstamt;
                let igstConvertToDecimal = IAMt.toFixed(2);
                let igstConvertToNumber = Number(igstConvertToDecimal)
                let INumber: number = igstConvertToNumber;
                this.IGST = INumber.toLocaleString();
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total != null) {
                let i_gstamt = 0 + data.unarmed_miniwages_total.igst
                let IAMt: number = i_gstamt;
                let igstConvertToDecimal = IAMt.toFixed(2);
                let igstConvertToNumber = Number(igstConvertToDecimal)
                let INumber: number = igstConvertToNumber;
                this.IGST = INumber.toLocaleString();
              } if (data.armed_miniwages_total != null && data.unarmed_miniwages_total == null) {
                let i_gstamt = data.armed_miniwages_total.igst + 0
                let IAMt: number = i_gstamt;
                let igstConvertToDecimal = IAMt.toFixed(2);
                let igstConvertToNumber = Number(igstConvertToDecimal)
                let INumber: number = igstConvertToNumber;
                this.IGST = INumber.toLocaleString();
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total == null) {
                this.IGST = "0"
              }

              //totalgst
              if (data.armed_miniwages_total != null && data.unarmed_miniwages_total != null) {
                let CS_Total = (data.armed_miniwages_total.cgst + data.unarmed_miniwages_total.cgst) + (data.armed_miniwages_total.sgst + data.unarmed_miniwages_total.sgst)
                  + (data.armed_miniwages_total.igst + data.unarmed_miniwages_total.igst)
                let gstTotal: number = CS_Total;
                let tgstConvertToDecimal = gstTotal.toFixed(2);
                let tgstConvertToNumber = Number(tgstConvertToDecimal)
                let TGNumber: number = tgstConvertToNumber;
                this.TotalGST = TGNumber.toLocaleString();
                this.fout_tgst = this.TotalGST
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total != null) {
                let CS_Total = (0 + data.unarmed_miniwages_total.cgst) + (0 + data.unarmed_miniwages_total.sgst) + (0 + data.unarmed_miniwages_total.igst)
                let gstTotal: number = CS_Total;
                let tgstConvertToDecimal = gstTotal.toFixed(2);
                let tgstConvertToNumber = Number(tgstConvertToDecimal)
                let TGNumber: number = tgstConvertToNumber;
                this.TotalGST = TGNumber.toLocaleString();
                this.fout_tgst = this.TotalGST
              } if (data.armed_miniwages_total != null && data.unarmed_miniwages_total == null) {
                let CS_Total = (data.armed_miniwages_total.cgst + 0) + (data.armed_miniwages_total.sgst + 0) + (data.armed_miniwages_total.igst + 0)
                let gstTotal: number = CS_Total;
                let tgstConvertToDecimal = gstTotal.toFixed(2);
                let tgstConvertToNumber = Number(tgstConvertToDecimal)
                let TGNumber: number = tgstConvertToNumber;
                this.TotalGST = TGNumber.toLocaleString();
                this.fout_tgst = this.TotalGST
              }
              if (data.armed_miniwages_total == null && data.unarmed_miniwages_total == null) {
                this.TotalGST = "0"
                this.fout_tgst = this.TotalGST
              }

              //total amt payable
              if (data.armed_miniwages_total != null && data.unarmed_miniwages_total != null) {
                let payable = data.armed_miniwages_total.grand_total + data.unarmed_miniwages_total.grand_total
                let TotalAMt: number = payable;
                let payableConvertToDecimal = TotalAMt.toFixed(2);
                let payableConvertToNumber = Number(payableConvertToDecimal)
                let PayNumber: number = payableConvertToNumber;
                this.TotAmtPayable = PayNumber.toLocaleString();
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total != null) {
                let payable = 0 + data.unarmed_miniwages_total.grand_total
                let TotalAMt: number = payable;
                let payableConvertToDecimal = TotalAMt.toFixed(2);
                let payableConvertToNumber = Number(payableConvertToDecimal)
                let PayNumber: number = payableConvertToNumber;
                this.TotAmtPayable = PayNumber.toLocaleString();
              } if (data.armed_miniwages_total != null && data.unarmed_miniwages_total == null) {
                let payable = data.armed_miniwages_total.grand_total + 0
                let TotalAMt: number = payable;
                let payableConvertToDecimal = TotalAMt.toFixed(2);
                let payableConvertToNumber = Number(payableConvertToDecimal)
                let PayNumber: number = payableConvertToNumber;
                this.TotAmtPayable = PayNumber.toLocaleString();
              } if (data.armed_miniwages_total == null && data.unarmed_miniwages_total == null) {
                this.TotAmtPayable = "0"
              }

              //gstNO
              // let gstNo =this.branchCertifate_list.vendor.gstno
              // this.gsttwonumber = gstNo.slice(0, 2);
              // console.log("gst------",this.gsttwonumber)
              // branch gstNo
              // let b_gstNo =this.branchCertifate_list.branch_gst
              // this.b_gsttwonumber = b_gstNo.slice(0, 2);
              // console.log("b_gst------",this.b_gsttwonumber)
              // if(this.branchCertifate_list.vendor.composite == 1 || this.branchCertifate_list.vendor.composite == 2){
              //   if(this.gsttwonumber == this.b_gsttwonumber){
              //     this.IGST = "0"
              //   }else{
              //     this.CGST = "0"
              //     this.SGST = "0"
              //     this.IGST = this.TotalGST

              //   }
              // } else {
              //   this.CGST = "0"
              //   this.SGST = "0"
              //   this.IGST = "0"
              //   this.TotalGST = "0"
              //   this.TotAmtPayable = this.Tbillamt
              // }


              this.addInvoice.patchValue({
                securitypan: this.branchCertifate_list.vendor.panno,
                securityagencename: this.branchCertifate_list.vendor.name,
                gst_no: this.branchCertifate_list.vendor.gstno,
                vendor_id: this.branchCertifate_list.vendor.id,
                dataentrysite: site,
                invoicemonth: fullMonth,
                aguarddutiespday: data.incidents_data.armemp_count,
                aguarddutiesmonth: data.incidents_data.present_armemp,
                unaguarddutiespday: data.incidents_data.unarmemp_count,
                unaguarddutiesmonth: data.incidents_data.present_unarmemp,
                abillamt: this.Abillamt,
                sbillamt: this.Sbillamt,
                totlbillamt: this.Tbillamt,
                cgstamt: this.CGST,
                sgstamt: this.SGST,
                igstamt: this.IGST,
                totalgst: this.TotalGST,
                totlamtpayable: this.TotAmtPayable,
              })
            })
        } else {
          this.notification.showError("You can not create invoice before getting the branch certification Approval")
          this.dataEntryButton = true;
          this.isShowtable = false;
        }

      })
  }
















  // branch drop down
  branchname() {
    // let prokeyvalue: String = "";
    //   this.getbranchid(prokeyvalue);
    //   this.branchcertificationId.get('branch_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //       }),
    //       switchMap(value => this.sgservice.getBranchLoadMore(value,1)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.branchList = datas;

    //     })
    let a = this.branchContactInput.nativeElement.value
    this.sgservice.getBranchLoadMore(a, 1)
      //  .subscribe(x =>{
      //    console.log("dd value data", x)
      //  })
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;

      })


  }
  getbranchid() {
    this.sgservice.getBranchLoadMore("", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;

      })
  }

  public displayfnbranch(branch?: branchList): string | undefined {
    return branch ? "(" + branch.code + ") " + branch.name : undefined;

  }

  get branch() {
    return this.branchcertificationId.value.get('branch_id');
  }
  branchRecord: any;
  premisesArray = [];
  branchFocusOut(data) {
    this.branchRecord = data
    this.premisesArray = [];
    let list = data.premise;
    for (let i = 0; i < list.length; i++) {
      let premise_id = list[i].id
      this.premisesArray.push(premise_id)
    }
    console.log("premisesArray", this.premisesArray)
    this.getpremiseid()
  }

  clearPremises() {
    this.clear_premises.nativeElement.value = '';

  }



  // site
  premisename() {
    // let prokeyvalue: String = "";
    //   this.getpremiseid(this.premisesArray,prokeyvalue);
    //   this.branchcertificationId.get('premise_id').valueChanges
    //     .pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //       }),
    //       switchMap(value => this.sgservice.getpremises(this.premisesArray,value,1)
    //         .pipe(
    //           finalize(() => {
    //             this.isLoading = false
    //           }),
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results["data"];
    //       this.premiseList = datas;
    //     })
    let a = this.PremiseContactInput.nativeElement.value
    this.sgservice.getpremises(this.premisesArray, a, 1)
      //  .subscribe(x =>{
      //    console.log("dd value data", x)
      //  })
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiseList = datas;
      })



  }
  getpremiseid() {
    this.sgservice.getpremises(this.premisesArray, "", 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.premiseList = datas;

      })
  }

  public displayfnpremise(premise?: premiseList): string | undefined {
    return premise ? "(" + premise.code + ") " + premise.name : undefined;

  }
  get premise() {
    return this.branchcertificationId.value.get('premise_id');
  }

  premiseRecord: any;
  premiseFocusOut(data) {
    this.premiseRecord = data
  }


  //approval branch

  appBranchList: any
  approvalBranchClick() {
    this.keyFor_appr_Branch = false;
    this.keyFor_approver = false;
    let approvalbranchkeyvalue: String = "";
    this.getApprovalBranch(approvalbranchkeyvalue);
    this.addInvoice.get('approval_branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.sgservice.getBranchLoadMore(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appBranchList = datas;

      })

  }

  private getApprovalBranch(approvalbranchkeyvalue) {
    this.sgservice.getBranchLoadMore(approvalbranchkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appBranchList = datas;
      })
  }

  public displayFnappBranch(branch?: approvalBranch): string | undefined {

    return branch ? "(" + branch.code + " )" + branch.name : undefined;
  }

  appBranch_Id = 0;
  FocusApprovalBranch(data) {
    console.log("appbranch", data)
    this.appBranch_Id = data.id;
    console.log("id", this.appBranch_Id)
    this.getApprover(data.id, '')
  }
  clearAppBranch() {
    this.clear_appBranch.nativeElement.value = '';
  }

  // appbranch based employee

  approvername() {
    this.keyFor_appr_Branch = false;
    this.keyFor_approver = false;
    let approverkeyvalue: String = "";
    this.getApprover(this.appBranch_Id, approverkeyvalue);

    this.addInvoice.get('approver').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.sgservice.appBranchBasedEmployee(this.appBranch_Id, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      })

  }

  private getApprover(id, approverkeyvalue) {
    this.sgservice.appBranchBasedEmployee(id, approverkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })
  }

  public displayFnEmployee(employee?: approver): string | undefined {
    return employee ? employee.full_name : undefined;
  }


  imagesForInvoice: any;
  //invoice file upload
  onFileSelectForRaiseReq(e) {
    this.imagesForInvoice = e.target.files;
  }


  // Branch  dropdown

  currentpagebra: any = 1
  has_nextbra: boolean = true
  has_previousbra: boolean = true
  autocompletebranchnameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletebrach &&
        this.autocompleteTrigger &&
        this.matAutocompletebrach.panel
      ) {
        fromEvent(this.matAutocompletebrach.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletebrach.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletebrach.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletebrach.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletebrach.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbra === true) {
                this.sgservice.getBranchLoadMore(this.branchContactInput.nativeElement.value, this.currentpagebra + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbra = datapagination.has_next;
                      this.has_previousbra = datapagination.has_previous;
                      this.currentpagebra = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // Premies dropdown
  currentpagepre: any = 1
  has_nextpre: boolean = true
  has_previouspre: boolean = true
  autocompletePremisenameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompletepremise &&
        this.autocompleteTrigger &&
        this.matAutocompletepremise.panel
      ) {
        fromEvent(this.matAutocompletepremise.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompletepremise.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompletepremise.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletepremise.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletepremise.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpre === true) {
                this.sgservice.getpremises(this.premisesArray, this.PremiseContactInput.nativeElement.value, this.currentpagepre + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.premiseList = this.premiseList.concat(datas);
                    if (this.premiseList.length >= 0) {
                      this.has_nextpre = datapagination.has_next;
                      this.has_previouspre = datapagination.has_previous;
                      this.currentpagepre = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }



  // approval branch
  currentpageappbranch: any = 1
  has_nextappbranch: boolean = true
  has_previousappbranch: boolean = true
  autocompleteapprovalBranchScroll() {

    setTimeout(() => {
      if (
        this.matAutocompleteappbranch &&
        this.autocompleteTrigger &&
        this.matAutocompleteappbranch.panel
      ) {
        fromEvent(this.matAutocompleteappbranch.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteappbranch.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteappbranch.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteappbranch.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteappbranch.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextappbranch === true) {
                this.sgservice.getBranchLoadMore(this.appBranchInput.nativeElement.value, this.currentpageappbranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.appBranchList = this.appBranchList.concat(datas);
                    if (this.appBranchList.length >= 0) {
                      this.has_nextappbranch = datapagination.has_next;
                      this.has_previousappbranch = datapagination.has_previous;
                      this.currentpageappbranch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  // Approver(employee) dropdown
  currentpageaddpay: any = 1
  has_nextaddpay: boolean = true
  has_previousaddpay: boolean = true
  autocompleteapprovernameScroll() {

    setTimeout(() => {
      if (
        this.matAutocompleteapprover &&
        this.autocompleteTrigger &&
        this.matAutocompleteapprover.panel
      ) {
        fromEvent(this.matAutocompleteapprover.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.matAutocompleteapprover.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.matAutocompleteapprover.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteapprover.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteapprover.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextaddpay === true) {
                this.sgservice.appBranchBasedEmployee(this.appBranch_Id, this.ApproverContactInput.nativeElement.value, this.currentpageaddpay + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    if (this.employeeList.length >= 0) {
                      this.has_nextaddpay = datapagination.has_next;
                      this.has_previousaddpay = datapagination.has_previous;
                      this.currentpageaddpay = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


}
