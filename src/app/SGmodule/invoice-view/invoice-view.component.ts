import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SGShareService } from './../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SGService } from '../SG.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from '../error-handling.service';
import { environment } from 'src/environments/environment';


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
}
export interface approver {
  id: string;
  name: string;
}

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ],

})
export class InvoiceViewComponent implements OnInit {
  invoiceView: FormGroup;
  moveToCheckerForm: FormGroup;
  ApproverForm: FormGroup;
  rejectForm: FormGroup;
  reviewForm: FormGroup;
  moveToHeaderForm: FormGroup;
  branchCertifate_Id: any;
  getInvoiceData: any;
  isLoading = false;
  approvalbranchList: Array<approvalBranch>;
  employeeList: Array<approver>;
  invoiceDate: any;
  invoice_Id: any;
  invoicehistoryData: any;
  view: any;
  fromInvoice = "BC tab"
  fromInvoice1 = "System Bill"
  permission: any;

  @ViewChild('rejectModalMovetoChecker') rejectModalMovetoChecker;
  @ViewChild('rejectModalMovetoHeader') rejectModalMovetoHeader;
  @ViewChild('closebutton') closebutton;


  constructor(private fb: FormBuilder, private tostar: ToastrService, private router: Router, private errorHandler: ErrorHandlingService,
    private sgservice: SGService, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private shareservice: SGShareService) { }

  ngOnInit(): void {
    this.invoiceView = this.fb.group({
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

      approval_branch_name: [''],
      // approval_branch: [''],
      approver: ['', Validators.required],

      cgstamt: [''],
      sgstamt: [''],
      igstamt: [''],
      totalgst: [''],
      totlamtpayable: [''],

    })

    this.moveToCheckerForm = this.fb.group({
      remarks: ['']
    })
    this.moveToHeaderForm = this.fb.group({
      remarks: ['']
    })
    this.ApproverForm = this.fb.group({
      remarks: ['']
    })
    this.rejectForm = this.fb.group({
      remarks: ['']
    })
    this.reviewForm = this.fb.group({
      remarks: ['']
    })

    this.invoiceUpdate();

  }

  //patch value

  monthly_draft_get_api_list: any
  igstptach: any;

  invoiceUpdate() {
    let data = this.shareservice.invoiceSummaryDetails.value
    console.log("invoiceSummaryDetails", data)
    this.monthly_draft_get_api_list = data
    this.view = data;
    this.branchCertifate_Id = data.branchcertification_id
    // this.fileData = data.invoice_doc,
    // this.imagesForInvoice = this.fileData;
    // const Date = data.invoicedate;
    // this.date = this.datePipe.transform(Date, 'yyyy-MM-dd');   

    this.sgservice.getInvoiceData(this.branchCertifate_Id, data.id)
      .subscribe(result => {
        console.log("getInvoiceData", result)
        let datas = result.data;
        this.getInvoiceData = datas[0]
        let data = this.getInvoiceData
        this.permission = data.isheader
        const Date = data.invoicedate
        if (data.igstamt != null) {
          this.igstptach = data.igstamt.toLocaleString()
        }
        this.invoiceDate = this.datePipe.transform(Date, 'yyyy-MM-dd')
        this.invoiceView.patchValue({
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
          invoicedate: this.invoiceDate,
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
          approval_branch_name: data.approver.branch_code + '-' + data.approver.branch_name,
          // approval_branch: data.approver.id,
          approver: data.approver,
        })
        this.invoiceapprovalFlow();
      })
  }

  //  this.invoiceView.value.totlamtpayable
  // this.monthly_draft_get_api_list


  backToInvoiceSummary() {
    this.router.navigate(['SGmodule/securityguardpayment', 2], { skipLocationChange: true })
  }

  branchViewScreen() {
    this.shareservice.branchData.next(this.view)
    this.shareservice.key.next(this.fromInvoice)
    this.router.navigate(['SGmodule/branchview'], { skipLocationChange: true })
  }

  systemGenerateBillScreen() {
    this.shareservice.searchdata.next(this.view)
    this.shareservice.key1.next(this.fromInvoice1)
    this.shareservice.agencyname.next(this.getInvoiceData)
    this.router.navigate(['SGmodule/paymentfreeze'], { skipLocationChange: true })
  }

  // invoice update 
  updateButton() {
    this.shareservice.invoiceEditValue.next(this.getInvoiceData);
    this.shareservice.branchCertifateId.next(this.branchCertifate_Id)
    this.router.navigate(['SGmodule/invoiceUpdate'], { skipLocationChange: true })
  }

  oncheckmonthly() {
    let totalpayble = this.getInvoiceData.totlamtpayable

    let branch_id = this.monthly_draft_get_api_list.branch.id
    let primiseid = this.monthly_draft_get_api_list.premise.id
    let month = this.monthly_draft_get_api_list.month
    let year = this.monthly_draft_get_api_list.year

    let monthysubmit = new monthlydraft()

    monthysubmit.branch_id = branch_id
    monthysubmit.premise_id = primiseid
    monthysubmit.vendor_id = this.getInvoiceData.vendor_id
    monthysubmit.month = month
    monthysubmit.year = year

    console.log("monthly objects", monthysubmit)
    this.sgservice.postMonthlydraft(monthysubmit).subscribe((result) => {
      let data = result
      console.log("name", data)
      this.daat = []
      this.daat.push(data)
      if (this.daat[0]?.armed_miniwages_total != null && this.daat[0]?.unarmed_miniwages_total != null) {
        this.Totalbillamount = this.daat[0]?.armed_miniwages_total?.grand_total + this.daat[0]?.unarmed_miniwages_total?.grand_total;
      }
      if (this.daat[0]?.armed_miniwages_total == null && this.daat[0]?.unarmed_miniwages_total != null) {
        this.Totalbillamount = 0 + this.daat[0]?.unarmed_miniwages_total?.grand_total;
      }
      if (this.daat[0]?.armed_miniwages_total != null && this.daat[0]?.unarmed_miniwages_total == null) {
        this.Totalbillamount = this.daat[0]?.armed_miniwages_total?.grand_total + 0;
      }


      console.log("total monhtly draft", parseInt(this.Totalbillamount));
      console.log("total monhtly draft", this.Totalbillamount);
      console.log("total invoice form value", parseInt(totalpayble))
      console.log("total invoice form value", totalpayble)

      if (parseInt(this.Totalbillamount) != parseInt(totalpayble)) {
        this.tostar.warning("Please check Invoice Form And monthly draft form ", "Values are Not Same")
        return false
      }
      this.rejectModalMovetoChecker.nativeElement.click();

    })


  }

  // submit to checker button 
  Totalbillamount: any
  daat: any
  moveToCheckerPopupForm() {



    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "status": 2,
      "invoice_id": invoiceGet_id,
    }

    this.sgservice.movetoCheckerInvoice(this.moveToCheckerForm.value, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Checker!...")
          this.invoiceUpdate();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }

  onCheckCondition() {
    if (this.getInvoiceData?.is_payment == false) {
      this.notification.showError("You can not Submit to Header before getting the ECF")
      return false
    }
    this.rejectModalMovetoHeader.nativeElement.click();

  }


  // submit to header button 

  moveToHeaderPopupForm() {
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "status": 5,
      "invoice_id": invoiceGet_id,
    }
    this.sgservice.movetoHeaderInvoice(this.moveToHeaderForm.value, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to Header!...")
          this.invoiceUpdate();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }

  // approver button 
  ApproverPopupForm() {
    this.SpinnerService.show()
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "status": 3,
      "invoice_id": invoiceGet_id,
    }
    this.sgservice.approverInvoice(this.ApproverForm.value, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Approved Successfully!...")
          this.closebutton.nativeElement.click();
          // this.invoiceUpdate();
          this.ToECF();
          this.SpinnerService.hide()
        } else {
          this.notification.showError(res.description)
          this.SpinnerService.hide()
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      )

  }

  // reject button 
  rejectPopupForm() {
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "status": 0,
      "invoice_id": invoiceGet_id,
    }
    this.sgservice.rejectInvoice(this.rejectForm.value, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Rejected!...")
          this.invoiceUpdate();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }


  // reject button 
  reviewPopupForm() {
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "status": 4,
      "invoice_id": invoiceGet_id,
    }
    this.sgservice.reviewInvoice(this.reviewForm.value, json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("updated!...")
          this.invoiceUpdate();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })

  }

  //delete invoice
  getDeleteInvoice() {
    let invoiceGet_id = this.getInvoiceData?.id
    this.sgservice.getDeleteInvoice(invoiceGet_id)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Deleted!...")
          this.invoiceUpdate();
        } else {
          this.notification.showError(res.description)
        }
        return true
      })
  }


  //invoice approval Flow 

  invoiceapprovalFlow() {
    let invoiceGet_id = this.getInvoiceData?.id
    this.sgservice.invoiceapprovalFlow(invoiceGet_id)
      .subscribe(result => {
        console.log("invoiceapprovalFlow", result)
        this.invoicehistoryData = result.data;
      })
  }


  // to ECF Push 
  Talbillamount: any
  daatot: any
  ToECF() {
    let invoiceGet_id = this.getInvoiceData?.id
    let json = {
      "invoice_id": invoiceGet_id,
    }
    this.SpinnerService.show()

    this.sgservice.ToECFPush(json)
      .subscribe(res => {
        if (res.status == "success") {
          this.notification.showSuccess("Moved to ECF!...")
          this.invoiceUpdate();
          this.SpinnerService.hide();
        } else {
          this.notification.showError(res.description)
          this.invoiceUpdate();
          this.SpinnerService.hide();
        }
      },
        error => {
          this.errorHandler.handleError(error);
          this.invoiceUpdate()
          this.SpinnerService.hide();
        }
      )

  }


  coverNotedownload() {
    this.sgservice.coverNotedownload(this.getInvoiceData?.id)
      .subscribe((results) => {
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Covernote.pdf";
        link.click();
      })
  }


  jpgUrls: string;
  fileextension: any;
  showPopupImages: boolean = true
  imageUrl = environment.apiURL
  docFileView(id, file_name) {
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





  //approval branch drop down
  approvalBranch() {
    let approvalbranchkeyvalue: String = "";
    this.getApprovalBranch(approvalbranchkeyvalue);

    this.invoiceView.get('approval_branch').valueChanges
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
        this.approvalbranchList = datas;

      })

  }

  private getApprovalBranch(approvalbranchkeyvalue) {
    this.sgservice.getbranchdropdown(approvalbranchkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.approvalbranchList = datas;
      })
  }

  public displayFnapprovalbranch(approvalbranch?: approvalBranch): string | undefined {
    return approvalbranch ? approvalbranch.name : undefined;
  }

  get approvalbranch() {
    return this.invoiceView.value.get('approval_branch');
  }


  //approver drop down
  approvername() {
    let approverkeyvalue: String = "";
    this.getApprover(approverkeyvalue);

    this.invoiceView.get('approver').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.sgservice.getEmployeeFilter(value, 1)
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

  private getApprover(approverkeyvalue) {
    this.sgservice.getEmployeeFilter(approverkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;
      })
  }

  public displayFnEmployee(employee?: approver): string | undefined {
    return employee ? employee.name : undefined;
  }

  get employee() {
    return this.invoiceView.value.get('approver');
  }





}


class monthlydraft {
  premise_id: any
  branch_id: any
  vendor_id: any
  month: any
  year: any
}