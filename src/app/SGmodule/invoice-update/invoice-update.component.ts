import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SGShareService } from './../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SGService } from '../SG.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, map, takeUntil } from 'rxjs/operators';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe, formatDate } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { fromEvent } from 'rxjs';

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

export interface approvalBranch {
  id: string;
  name: string;
  code: string;
  branch_code: string;
  branch_name: string;
  branch_id: any
}
export interface approver {
  id: string;
  name: string;
  code: string;
  full_name: string;
}

@Component({
  selector: 'app-invoice-update',
  templateUrl: './invoice-update.component.html',
  styleUrls: ['./invoice-update.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ],
})
export class InvoiceUpdateComponent implements OnInit {
  //approval branch
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  //approver
  @ViewChild('employee') matemployeeAutocomplete: MatAutocomplete;
  @ViewChild('employeeInput') employeeInput: any;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  //approval branch
  @ViewChild('appBranchInput') appBranchInput: any;
  @ViewChild('approvalBranch') matAutocompleteappbranch: MatAutocomplete;

  @ViewChild('ApproverContactInput') ApproverContactInput: any;
  @ViewChild('employee') matAutocompleteapprover: MatAutocomplete;
  @ViewChild('ApproverContactInput') clear_appBranch;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  updateInvoiceForm: FormGroup
  branchCertifate_Id: any;
  branchList: Array<approvalBranch>;
  employeeList: Array<approver>;
  isLoading = false
  fileData: any;
  imagesForInvoice: any;
  images: any;
  date: any;
  basedOnUpdate: boolean
  constructor(private fb: FormBuilder, private tostar: ToastrService, private router: Router,
    private sgservice: SGService, private datepipe: DatePipe, private datePipe: DatePipe,
    private notification: NotificationService, private shareservice: SGShareService,
    private errorHandler: ErrorHandlingService, private SpinnerService: NgxSpinnerService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.updateInvoiceForm = this.fb.group({
      id: [''],
      dataentrysite: [''],
      invoicemonth: [''],
      // nationalhdaysat: [''],

      // aguardhdaysat: [''],
      // sguardhdaysat: [''],
      // aguardhdaysatfri: [''],
      // sguardhdaysatfri: [''],

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

      // approval_branch:[''],
      approval_branch: [''],
      approver: ['', Validators.required],

      cgstamt: [''],
      sgstamt: [''],
      igstamt: [''],
      totalgst: [''],
      totlamtpayable: [''],

    })
    this.branchCertifate_Id = this.shareservice.branchCertifateId.value
    console.log("branchCertifate_Id", this.branchCertifate_Id)
    this.invoiceUpdate();
  }

  //patch value
  igstptach: any;
  invoiceUpdate() {
    // this.i_gst = true;
    let data = this.shareservice.invoiceEditValue.value;
    console.log("invoiceupdate", data)
    console.log("----------------------------------------------->", data)

    if (data.ismaker == true && (data.approval_status.id == 1 || data.approval_status.id == 2)) {
      this.basedOnUpdate = false
    }
    else { this.basedOnUpdate == true }
    this.fileData = data.invoice_doc,
      this.imagesForInvoice = this.fileData;
    const Date = data.invoicedate;
    this.date = this.datePipe.transform(Date, 'yyyy-MM-dd');
    if (data.igstamt != null) {
      this.igstptach = data.igstamt.toLocaleString()
    }
    this.updateInvoiceForm.patchValue({
      id: data.id,
      dataentrysite: data.dataentrysite,
      invoicemonth: data.invoicemonth,
      // nationalhdaysat: data.nationalhdaysat,
      // aguardhdaysat: data.aguardhdaysat,
      // sguardhdaysat: data.sguardhdaysat,
      // aguardhdaysatfri: data.aguardhdaysatfri,
      // sguardhdaysatfri: data.sguardhdaysatfri,
      securitypan: data.securitypan,
      securityagencename: data.securityagencename,
      // servicetaxno: data.servicetaxno,
      gst_no: data.gst_no,
      // noofdays: data.noofdays,
      invoiceno: data.invoiceno,
      invoicedate: this.date,
      aguarddutiespday: data.aguarddutiespday,
      aguarddutiesmonth: data.aguarddutiesmonth,
      abillamt: data.abillamt.toLocaleString(),
      sbillamt: data.sbillamt.toLocaleString(),
      unaguarddutiespday: data.unaguarddutiespday,
      unaguarddutiesmonth: data.unaguarddutiesmonth,
      totlbillamt: data.totlbillamt.toLocaleString(),
      cgstamt: data.cgstamt.toLocaleString(),
      sgstamt: data.sgstamt.toLocaleString(),
      igstamt: this.igstptach,
      totalgst: data.totalgst.toLocaleString(),
      totlamtpayable: data.totlamtpayable.toLocaleString(),
      approval_branch: data.approver,
      // approval_branch: data.approval_branch.id,
      approver: data.approver,

    })
    this.appBranch_Id = data.approver.branch_id

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
    this.updateInvoiceForm.reset();
  }


  //get Approval branch name & id
  approver(data) {
    console.log("invoice-approver", data)
    this.updateInvoiceForm.patchValue({
      "approval_branch": data.branch_code + '-' + data.branch_name,
      // "approval_branch" : data.branch_id
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
      this.toast.warning('', 'Number only accepted ', { timeOut: 1500 });
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
  onSubmitClick() {
    this.SpinnerService.show();

    if (this.updateInvoiceForm.value.dataentrysite === "") {
      this.tostar.error('Please Enter Site');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.updateInvoiceForm.value.nationalhdaysat === "") {
    //   this.tostar.error('Please Enter No of National/Festival holidays');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    // if (this.updateInvoiceForm.value.aguardhdaysat === "") {
    //   this.tostar.error('Please Enter No of Armed Guard duties on holidays(Saturday)');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.updateInvoiceForm.value.sguardhdaysat === "") {
    //   this.tostar.error('Please Enter No of Security  Guard duties on holidays(Saturday)');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    // if (this.updateInvoiceForm.value.aguardhdaysatfri === "") {
    //   this.tostar.error('Please Enter No of Armed Guard duties on holidays(Other than Saturday -Sun to Fri)');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.updateInvoiceForm.value.sguardhdaysatfri === "") {
    //   this.tostar.error('Please Enter No of Security Guard duties on holidays(Other than Saturday -Sun to Fri)');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.updateInvoiceForm.value.servicetaxno === ""){
    //   this.tostar.error('Please Enter Security Tax Number');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.updateInvoiceForm.value.gst_no === ""){
    //   this.tostar.error('Please Enter GST Number');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.updateInvoiceForm.value.noofdays === "") {
    //   this.tostar.error('Please Enter No of Days');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    if (this.updateInvoiceForm.value.invoiceno === "") {
      this.tostar.error('Please Enter Invoice Number');
      this.SpinnerService.hide();
      return false;
    }
    if (this.updateInvoiceForm.value.invoicedate === "") {
      this.tostar.error('Please Enter Invoice Date');
      this.SpinnerService.hide();
      return false;
    }
    if (this.updateInvoiceForm.value.approver === "") {
      this.tostar.error('Add Approver Field', 'Select Any one Approver', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false;
    }
    // this.addInvoice.patchValue({
    //   aguarddutiesmonth:this.wholemontharmedguard,
    //   totalgst: this.gst,
    //   totlamtpayable:this.alltotalamount,
    //   totlbillamt: this.Totalbillamt,
    //   unaguarddutiesmonth:this.wholemounthsecgusrd
    // })
    // const startDate = this.addInvoice.value;
    // startDate.invoicemonth = this.datePipe.transform(startDate.invoicemonth, 'yyyy-MM-dd');
    const endDate = this.updateInvoiceForm.value;
    endDate.invoicedate = this.datePipe.transform(endDate.invoicedate, 'yyyy-MM-dd');
    // this.updateInvoiceForm.value.approval_branch = this.updateInvoiceForm.value.approval_branch.id

    // approval_branch
    let dataForAppBranch = this.updateInvoiceForm.value.approval_branch?.branch_id
    let dataForAppBranchNameChoice = this.updateInvoiceForm.value.approval_branch?.id

    if (dataForAppBranch == undefined) {
      this.updateInvoiceForm.value.approval_branch = dataForAppBranchNameChoice
    } else {
      this.updateInvoiceForm.value.approval_branch = dataForAppBranch
    }
    if (this.updateInvoiceForm.value.approver.id != undefined) {
      this.updateInvoiceForm.value.approver = this.updateInvoiceForm.value.approver.id



      //remove comma filed for abill
      var aabill = this.updateInvoiceForm.value.abillamt;
      var armedBillCommaRemoved = aabill.replace(/,/g, "");
      this.updateInvoiceForm.value.abillamt = armedBillCommaRemoved
      //sbill
      var ssbill = this.updateInvoiceForm.value.sbillamt;
      var securityBillCommaRemoved = ssbill.replace(/,/g, "");
      this.updateInvoiceForm.value.sbillamt = securityBillCommaRemoved
      //total bill
      var ttbill = this.updateInvoiceForm.value.totlbillamt;
      var ttBillCommaRemoved = ttbill.replace(/,/g, "");
      this.updateInvoiceForm.value.totlbillamt = ttBillCommaRemoved
      //cgst
      var cgstvalue = this.updateInvoiceForm.value.cgstamt;
      var cgstCommaRemoved = cgstvalue.replace(/,/g, "");
      this.updateInvoiceForm.value.cgstamt = cgstCommaRemoved
      //sgst
      var sgstvalue = this.updateInvoiceForm.value.sgstamt;
      var sgstCommaRemoved = sgstvalue.replace(/,/g, "");
      this.updateInvoiceForm.value.sgstamt = sgstCommaRemoved
      //igst
      var igstvalue = this.updateInvoiceForm.value.igstamt;
      var igstCommaRemoved = igstvalue.replace(/,/g, "");
      this.updateInvoiceForm.value.igstamt = igstCommaRemoved
      //totalgst
      var totalgstvalue = this.updateInvoiceForm.value.totalgst;
      var tlgstCommaRemoved = totalgstvalue.replace(/,/g, "");
      this.updateInvoiceForm.value.totalgst = tlgstCommaRemoved
      //payable
      var payvalue = this.updateInvoiceForm.value.totlamtpayable;
      var payableCommaRemoved = payvalue.replace(/,/g, "");
      this.updateInvoiceForm.value.totlamtpayable = payableCommaRemoved


      const abill = this.updateInvoiceForm.value;
      abill.abillamt = Number(abill.abillamt)
      const sbill = this.updateInvoiceForm.value;
      sbill.sbillamt = Number(sbill.sbillamt)
      const tbill = this.updateInvoiceForm.value;
      tbill.totlbillamt = Number(tbill.totlbillamt)
      const cgt = this.updateInvoiceForm.value;
      cgt.cgstamt = Number(cgt.cgstamt)
      const sgt = this.updateInvoiceForm.value;
      sgt.sgstamt = Number(sgt.sgstamt)
      const igt = this.updateInvoiceForm.value;
      igt.igstamt = Number(igt.igstamt)
      const tgt = this.updateInvoiceForm.value;
      tgt.totalgst = Number(tgt.totalgst)
      const tamt = this.updateInvoiceForm.value;
      tamt.totlamtpayable = Number(tamt.totlamtpayable)
    }


    if (this.updateInvoiceForm.value.gst_no === "") {
      this.updateInvoiceForm.value.gst_no = null
    }
    // if(this.updateInvoiceForm.value.cgstamt=== 0 && this.updateInvoiceForm.value.sgstamt=== 0){
    //   this.updateInvoiceForm.value.cgstamt=null
    //   this.updateInvoiceForm.value.sgstamt=null
    // }

    console.log("onsubmit click", this.updateInvoiceForm.value)

    this.sgservice.InvoicedataEntry_update(this.updateInvoiceForm.value, this.branchCertifate_Id, this.imagesForInvoice, this.emptyList)
      .subscribe(result => {
        if (result.status === "success") {
          this.notification.showSuccess("Successfully Updated!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
          // this.router.navigate(['SGmodule/invoiceView'], { skipLocationChange: true })
        }
        else {
          this.notification.showError(result.description)
          this.SpinnerService.hide();
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
  }

  onCancelClick() {
    // this.router.navigate(['SGmodule/invoiceView'], { skipLocationChange: true })
    this.onCancel.emit();
  }


  //approval branch drop down
  approvalBranch() {
    let approvalbranchkeyvalue: String = "";
    this.getApprovalBranch(approvalbranchkeyvalue);

    this.updateInvoiceForm.get('approval_branch').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.sgservice.getbranchdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;

      })

  }

  private getApprovalBranch(approvalbranchkeyvalue) {
    this.sgservice.getbranchdropdown(approvalbranchkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      })
  }

  public displayFnbranch(branch?: approvalBranch): string | undefined {
    return branch ? branch.name : undefined;
  }

  get branch() {
    return this.updateInvoiceForm.value.get('approval_branch');
  }


  //approver drop down
  approvername() {
    // let approverkeyvalue: String = "";
    // this.getApprover(this.appBranch_Id,approverkeyvalue);

    // this.updateInvoiceForm.get('approver').valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //       console.log('inside tap')

    //     }),
    //     switchMap(value => this.sgservice.appBranchBasedEmployee(this.appBranch_Id, value, 1)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results["data"];
    //     this.employeeList = datas;

    //   })
    let a = this.ApproverContactInput.nativeElement.value
    this.sgservice.appBranchBasedEmployee(this.appBranch_Id, a, 1)
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
    return employee ? employee.name : undefined;
  }

  get employee() {
    return this.updateInvoiceForm.value.get('approver');
  }


  //invoice file upload
  onFileSelectForRaiseReq(e) {
    this.images = e.target.files;
    this.imagesForInvoice = this.images
  }

  jpgUrls: string;
  fileextension: any;
  showPopupImages: boolean = true
  imageUrl = environment.apiURL
  docFile(id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.fileextension === "pdf") {
      this.showPopupImages = false
      window.open(this.imageUrl + "sgserv/sg_document/" + id + "?token=" + token, "_blank");
    }
    else if (this.fileextension === "png" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
      // this.showPopupImages = true
      // this.jpgUrls = this.imageUrl + "sgserv/sg_document/" + id + "?token=" + token;
      // console.log("url", this.jpgUrls)
      this.showPopupImages = false
      window.open(this.imageUrl + "sgserv/sg_document/" + id + "?token=" + token, "_blank");
    }
    else {
      // this.fileDownload(id, file_name)
      // this.showPopupImages = false
      this.showPopupImages = false
      window.open(this.imageUrl + "sgserv/sg_document/" + id + "?token=" + token, "_blank");
    }
  }

  fileDownload(id, fileName) {
    this.sgservice.fileDownload(id)
      .subscribe((results) => {
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }

  // fileDeletes(data,index:number){
  // let value = data.file_id
  // console.log("filedel", value)
  // this.remsService2 .deletefile(value)
  // .subscribe(result =>  {
  //   let code = result.code
  //       if (code === "YOU CAN NOT DELETE THE LAST FILE") {
  //         this.notification.showError("You can not Delete the Last File")
  //         this.DocButton=false;
  //       } else {
  //         this.notification.showSuccess("Deleted....")
  //         this.fileData.splice(index, 1);
  //         this.getDocumentEdit()

  //       }

  // })

  // }
  emptyList = [];
  update_fileDelete(file_id, index: number) {
    this.emptyList.push(file_id)
    this.fileData.splice(index, 1)
    console.log("removve", this.fileData)
    this.notification.showSuccess("Deleted....")
    console.log("emptylist", this.emptyList)
  }










  appBranch_Id = 0;
  public displayFnEmployeeApprover(employee?: approver): string | undefined {
    console.log("employeee---->", employee)
    let empname = employee?.name
    let emp_fullname = employee?.full_name
    let nameOrFullname: any
    console.log("a value emp", empname)
    console.log("b value emp", emp_fullname)
    if (emp_fullname == undefined) {
      nameOrFullname = employee.name
    }
    else {
      nameOrFullname = emp_fullname
    }
    return employee ? nameOrFullname : undefined;
  }


  appBranchList: any
  approvalBranchClick() {
    let approvalbranchkeyvalue: String = "";
    this.getApprovalBranch(approvalbranchkeyvalue);
    this.updateInvoiceForm.get('approval_branch').valueChanges
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
  clearAppBranch() {
    this.clear_appBranch.nativeElement.value = '';
    this.updateInvoiceForm.controls['approver'].reset('')
  }


  public displayFnappBranch(branch?: approvalBranch): string | undefined {

    // return branch ? "("+branch.code +" )"+branch.name : undefined;

    console.log("branch---->", branch)
    let branchCode = branch.branch_code
    let branchName = branch.branch_name
    let branchCodeAndname

    if (branchCode == undefined || branchName == undefined) {
      branchCodeAndname = '(' + branch.code + ')' + branch.name
    }
    else {
      branchCodeAndname = '(' + branch.branch_code + ')' + branch.branch_name
    }
    return branch ? branchCodeAndname : undefined;

  }



  FocusApprovalBranch(data) {
    console.log("appbranch", data)
    this.appBranch_Id = data.id;
    console.log("id", this.appBranch_Id)
    this.getApprover(data.id, '')
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
