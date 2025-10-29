import { Component, OnInit, Output, EventEmitter, Injectable,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DtpcShareService } from '../dtpc-share.service';
import { DtpcService } from '../dtpc.service';
import { formatDate, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NotificationService } from '../notification.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer } from '@angular/platform-browser';

const isSkipLocationChange = environment.isSkipLocationChange

export interface ApplicationDetailsDialogData {
  single_application_details_data: [];
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
  selector: 'app-los-approve-reject-screen',
  templateUrl: './los-approve-reject-screen.component.html',
  styleUrls: ['./los-approve-reject-screen.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LosApproveRejectScreenComponent implements OnInit {
  approvalForm: FormGroup
  rejectForm: FormGroup
  single_application_data: any;
  Invoicelist = [];
  Balancechargelist = [];
  pageSize = 10;
  currentpage: number = 1;
  details_current_page: any;
  isapprove = false
  isreject = false
  Los_approver_summary_id: any;
  losstatus:string;


  tokenValues: any
  pdfUrls: string;
  jpgUrls: string;
  fileextension: any;
  imageUrl = environment.apiURL;
  showPopupImages: boolean;
  ViewForm:FormGroup;


  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private router: Router, private DtpcShareService: DtpcShareService, private SpinnerService: NgxSpinnerService,
    private DtpcService: DtpcService, public datepipe: DatePipe, private notification: NotificationService, private toastr: ToastrService,
    private sanitizer:DomSanitizer,public dialog: MatDialog) { }
  ngOnInit(): void {
    let invoice_header_id = this.DtpcShareService.LOS_INV_APP_id.value;
    this.Los_approver_summary_id = this.DtpcShareService.LOS_INV_APP_id.value;
    this.losstatus = this.DtpcShareService.LOS_INV_APP_data.value
   
    // this.losstatus = losstatus.status
    this.details_current_page = this.DtpcShareService.LosCurrentPage.value;
    this.get_los_details_data(invoice_header_id);
    this.approvalForm = this.fb.group({
      Remarks: ['', Validators.required],
      id: ''
    })
    this.rejectForm = this.fb.group({
      Remarks: ['', Validators.required],
      id: ''
    })
    this.ViewForm = this.fb.group({
      Notename:['']
    })
  }
  summaryListsInvoice: any
  flagstatus = { 'LEGAL_FEE': "false", 'VALU_FEE': 'false' }
  flagname: any
  public get_los_details_data(invoice_header_id) {
    let id = invoice_header_id
    this.SpinnerService.show();
    this.DtpcService.get_approval_data(id)
      .subscribe((results) => {
        if(results?.code)
        {
          this.SpinnerService.hide();
          this.notification.showError(results?.description)
        }
        this.SpinnerService.hide();
        this.summaryListsInvoice = results
        this.ViewForm.patchValue({
          Notename:this.summaryListsInvoice?.Notename
        })
       
        // if (single_datas.Message) {
        //   alert(JSON.stringify(single_datas))
        //   return false;
        // }
        // --------------------------------------------------------------------------------------
        let INVDate = this.summaryListsInvoice.Invoice_Date;
        let latest_date = this.datepipe.transform(INVDate, 'dd-MMM-yyyy');
        this.summaryListsInvoice.Invoice_Date = latest_date;
        //---------------------------------------------------------------------------------------
        let invoicearray = this.summaryListsInvoice.InvoiceDetails
        for (let i = 0; i < invoicearray.length; i++) {
          // console.log("invsum", invoicearray)
          let flagstatus = invoicearray[i].Is_Flag
          let value1 = JSON.parse(flagstatus)
          // console.log("json sidhu", value1)

          // if (value1.LEGAL_FEE === "false" && value1.VALU_FEE === "true") {
          //   this.flagname = "Final payment done for this application in Value Fee."
          // }
          // if (value1.LEGAL_FEE === "true" && value1.VALU_FEE === "false") {
          //   this.flagname = "Final payment done for this application in Legal Fee."
          // }
          // if (value1.LEGAL_FEE === "false" && value1.VALU_FEE === "false") {
          //   this.flagname = "Final payment till not done for this application."
          // }
          // if (value1.LEGAL_FEE === "true" && value1.VALU_FEE === "true") {
          //   this.flagname = "Final payment  done for this application."
          // }

          if (value1.VALU_FEE === "true" && this.summaryListsInvoice?.Invoice_Charge_type === "VALU_FEE") {
            this.flagname = "Final payment done for this application in Value Fee."
          }
          if (value1.LEGAL_FEE === "true" && this.summaryListsInvoice?.Invoice_Charge_type === "LEGAL_FEE") {
              this.flagname = "Final payment done for this application in Legal Fee."
          }
        }
      })
  }

  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.ViewForm.get('html').value);
  }


  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
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

  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    if (this.fileextension === "pdf" || this.fileextension === "PDF") {
      this.showPopupImages = false
      window.open(this.imageUrl + "dtpcserv/dtpcfile/" + id + "?identification_name=true&token=" + token, "_blank");
    }
    else if (this.fileextension === "png" || this.fileextension === "PNG" || this.fileextension === "jpeg" || this.fileextension === "jpg" || this.fileextension === "JPG" || this.fileextension === "JPEG") {
      // if (stringValue[1] === "png" || stringValue[1] fjfggf=== "jpeg" || stringValue[1] === "jpg") {
      this.showPopupImages = true
      this.jpgUrls = this.imageUrl + "dtpcserv/dtpcfile/" + id + "?identification_name=true&token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.fileDownload(pdf_id, file_name)
      this.showPopupImages = false
    }
  };

  // 'dtpcserv/dtpcfile/DTPC_' + id + '?identification_name=true&token=' + token
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

  los_summary(page_type) {
    // debugger;
    this.onCancel.emit();
    // if (page_type == "is_los_branch_summary") {
    //   // this.DtpcShareService.LosCurrentPage.next("is_los_branch_summary")
    //   // this.Current_Page="is_los_branch_summary";
    //   this.router.navigate(['/los'], { skipLocationChange: true })
    // }
    // else {
    //   this.router.navigate(['/los'], { skipLocationChange: true })
    // }
  }

  approveClick() {
    this.isapprove = true
    this.isreject = true
    this.approvalForm.value.id = this.Los_approver_summary_id;

    // data.id=this.inwardid
    if (this.approvalForm.value.Remarks === "") {
      this.toastr.warning('', 'Please Enter  Approval Remarks', { timeOut: 1500 });
      this.isapprove = false
      this.isreject = false
      return false;
    }
    if (this.approvalForm.value.Remarks !== "" || this.approvalForm.value.Remarks !== null) {
      this.isapprove = true
      this.isreject = true
    }
    this.SpinnerService.show()
    this.DtpcService.dtpcapprovaldata(this.approvalForm.value)
      .subscribe(results => {
        this.SpinnerService.hide()
        if (results.code === "INVALID_REQUEST_ID" && results.description === "Invalid Request ID") {
          this.notification.showError("INVALID REQUEST ID")
          this.isreject = false
          this.isapprove = false
        }
        else if (results.code === "INVALID_APPROVER_ID" && results.description === "Invalid Approver Id") {
          this.notification.showError("INVALID APPROVER ID")
          this.isreject = false
          this.isapprove = false
        }
        else if (results.message === 'Approved Successfully' && results.status === 'success') {
          this.toastr.success("", "Successfully Invoice Approved", { timeOut: 4000 });
          this.isreject = true
          this.isapprove = true
          this.onSubmit.emit();
          console.log("closed", results)
          return true
        }
        else {
          alert(JSON.stringify(results))
        }
        //this.getflag()
        // else {
        // this.notification.showSuccess("Successfully Approved!...")
        // this.router.navigate(['/los'], { skipLocationChange: true })

        // this.isreject = true
        // this.isapprove = true
        // }

        // this.onSubmit.emit();
        // this.onCancel.emit();

      })
  }
  // reer(){
  //   this.isapprove=true
  // }
  rejectClick() {
    this.isreject = true
    this.isapprove = true
    // const data = this.Los_approver_summary_id;
    //  data.id=this.inwardid
    this.rejectForm.value.id = this.Los_approver_summary_id;
    if (this.rejectForm.value.Remarks === "") {
      this.toastr.warning('', 'Please Enter  Reject Remarks', { timeOut: 1500 });
      this.isreject = false
      this.isapprove = false
      return false;
    }
    if (this.rejectForm.value.Remarks !== "" || this.rejectForm.value.Remarks !== null) {
      this.isreject = true
      this.isapprove = true
    }
    this.SpinnerService.show()
    this.DtpcService.dtpcrejectdata(this.rejectForm.value)
      .subscribe(results => {
        this.SpinnerService.hide()
        if (results.code === "INVALID_REQUEST_ID" && results.description === "Invalid Request ID") {
          this.notification.showError("INVALID REQUEST ID")
          this.isreject = false
          this.isapprove = false
        }
        if (results.code === "INVALID_APPROVER_ID" && results.description === "Invalid Approver Id") {
          this.notification.showError("INVALID REJECTOR ID")
          this.isreject = false
          this.isapprove = false
        }
        else if (results.message === 'Rejected Successfully' && results.status === 'success') {
          this.toastr.success("", "Successfully Invoice Rejected", { timeOut: 4000 });
          this.isreject = true
          this.isapprove = true
          this.onSubmit.emit();
          console.log("closed", results)
          return true
        }
        else {
          alert(JSON.stringify(results))
        }
        // if(){

        // }
        //this.getflag()
        // else {
          // this.notification.showSuccess("Successfully Rejected!...")
          // this.router.navigate(['/los'], { skipLocationChange: true })
        //   this.onSubmit.emit();
        //   this.isreject = true
        //   this.isapprove = true
        // }
        //this.router.navigate(['/grnapproversummary'], { skipLocationChange: true });

        // this.onCancel.emit();
        // console.log("closed", results)
        // return true
      })
  }

  step = 0;
  setStep(index: number) {
    this.step = index;
  }

  viewDetails(data){
    this.DtpcService.get_application_number(data).subscribe(result => {
      // console.log(result);
      this.SpinnerService.hide();
      this.single_application_data = result;

      const dialogRef = this.dialog.open(DialogAppDetails, {
        data: this.single_application_data,
        height: '90%',
        width: '100%',
      });

      dialogRef.afterClosed().subscribe(result => {

        // console.log(`Dialog result: ${result}`);
      });

  })
}

}


@Component({
  selector: 'app-dialog-app-details',
  templateUrl: './dialog-app-details.component.html',
  styleUrls: ['./dialog-app-details.component.scss']
})
export class DialogAppDetails {
  [x: string]: any;
  view_application: any;
  Collaterals: any;
  pageSize = 10;
  currentpage: number = 1;
  Charges: any;
  constructor(public dialogRef: MatDialogRef<DialogAppDetails>,
    @Inject(MAT_DIALOG_DATA) public single_application_details_data: ApplicationDetailsDialogData) {

  }
  ngOnInit(): void {
    this.view_application = this.single_application_details_data;
    this.Charges = this.view_application.Charges;
    this.Collaterals = this.view_application.Collaterals;


  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  
}



