import { Component, OnInit, Output, EventEmitter, Injectable,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DtpcShareService } from '../dtpc-share.service';
import { DtpcService } from '../dtpc.service';
import { formatDate, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NotificationService } from '../notification.service';
import { environment } from 'src/environments/environment'
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
  selector: 'app-los-invoice-approval-view',
  templateUrl: './los-invoice-approval-view.component.html',
  styleUrls: ['./los-invoice-approval-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class LosInvoiceApprovalViewComponent implements OnInit {

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

  tokenValues: any
  pdfUrls: string;
  jpgUrls: string;
  fileextension: any;
  imageUrl = environment.apiURL;
  showPopupImages: boolean;
  repviewdata:any;
  ViewForm:FormGroup;
  truefalseList =[{"name":"True","value":"true"},{"name":"False","value":"false"}]
  apstatusList = [{"name":"PAYMENT"},{"name":"PAID"},{"name":"REJECT"}]
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  EditfeeForm:FormGroup;
  EditamtForm:FormGroup;
  EditstatusForm:FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private DtpcShareService: DtpcShareService, private SpinnerService: NgxSpinnerService,
    private DtpcService: DtpcService, public datepipe: DatePipe, private notification: NotificationService,public dialog: MatDialog,
    private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    let invoice_header_id = this.DtpcShareService.LOS_INV_APP_id.value;
    this.Los_approver_summary_id = this.DtpcShareService.LOS_id.value;
    // console.log("invoice_header_id---->",this.Los_approver_summary_id)
    this.details_current_page = this.DtpcShareService.LosCurrentPage.value;
    this.repviewdata = this.DtpcShareService.viewdata.value;
    // console.log("repviewdata",this.repviewdata)
    this.ViewForm = this.fb.group({
      Notename :['']
    })
    this.EditfeeForm = this.fb.group({
      legal_fee:[''],
      value_fee:['']
    })
    this.EditamtForm = this.fb.group({
      Loan_Application_id:[''],
      current_balance:[0],
      charge_type:['']
    })
    this.EditstatusForm = this.fb.group({
      id:[''],
      AP_Status:[''],
      utrno:['']
    })
    
    // this.get_los_details_data(invoice_header_id);
    // this.get_invoice_view_details(invoice_header_id);
     if (this.repviewdata === 'inv') {
      // this.onCancel.emit();
      this.get_los_details_data(invoice_header_id);
    }
  
    if (this.repviewdata === 'rep') {
      // this.onSubmit.emit();
      this.get_los_details_data(invoice_header_id);
    }
  
    if (this.repviewdata === 'rect') {
    this.get_invoice_view_details(invoice_header_id);
    }
   
  }
  //Viewdatainrectify
  summaryListsInvoice: any
  
  flagstatus = { 'LEGAL_FEE': "false", 'VALU_FEE': 'false' }
  flagname: any
  public get_los_details_data(invoice_header_id) {
    let id = invoice_header_id
    this.SpinnerService.show();
    this.DtpcService.get_approval_data(id)
      .subscribe((results: any) => {
        if (results?.code == 'INVALID_DATA') {
          this.notification.showError(results?.description)
          this.SpinnerService.hide();
          return true;
        }
        else{
        this.summaryListsInvoice = results
        console.log("summaryListsInvoice",this.summaryListsInvoice )
        }
        const feedata = JSON.parse(this.summaryListsInvoice['InvoiceDetails'][0]?.Is_Flag)
        this.EditfeeForm.patchValue({
          legal_fee:feedata.LEGAL_FEE,
          value_fee:feedata.VALU_FEE
        })
        this.EditamtForm.patchValue({
          Loan_Application_id:this.summaryListsInvoice?.Balancecharge[0]?.Loan_Application?.id,
          // current_balance: this.summaryListsInvoice?.Balancecharge[0]?.Amount,
          charge_type:this.summaryListsInvoice?.Balancecharge[0]?.Charge_Type
        })
        this.EditstatusForm.patchValue({
          id:this.summaryListsInvoice?.id,
          AP_Status:this.summaryListsInvoice?.AP_Status
        })
        this.ViewForm.patchValue({
          Notename:this.summaryListsInvoice?.Notename
        })
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


  public get_invoice_view_details(invoice_header_id) {
    let id = invoice_header_id
    this.SpinnerService.show();
    this.DtpcService.Viewdatainrectify(id)
      .subscribe((results: any) => {
        if (results?.code == 'INVALID_DATA') {
          this.notification.showError(results?.description)
          this.SpinnerService.hide();
          return true;
        }
        else{
        this.summaryListsInvoice = results
        console.log("summaryListsInvoice",this.summaryListsInvoice )
        }
        const feedata = JSON.parse(this.summaryListsInvoice?.Is_Flag)
        this.EditfeeForm.patchValue({
          legal_fee:feedata.LEGAL_FEE,
          value_fee:feedata.VALU_FEE
        })
        this.EditamtForm.patchValue({
          Loan_Application_id:this.summaryListsInvoice?.Loan_Application_id,
          // current_balance: this.summaryListsInvoice?.Balancecharge[0]?.Amount,
          charge_type:this.summaryListsInvoice?.charge_type
        })
        this.EditstatusForm.patchValue({
          id:this.summaryListsInvoice?.Id,
          AP_Status:this.summaryListsInvoice?.AP_Status
        })
        this.ViewForm.patchValue({
          Notename:this.summaryListsInvoice?.Notename
        })
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
  goback()
  {
    this.onCancel.emit()
  }

  
  los_summary(page_type) {
    if(this.repviewdata == 'inv'){
    this.onCancel.emit()
    }
     if(this.repviewdata == 'rep'){
      // this.onSubmit.emit()
      this.get_los_details_data('')
    }
     if(this.repviewdata == 'rect'){
      this.get_invoice_view_details('')
    }
    // if (page_type == "is_los_branch_summary") {
    //   // this.DtpcShareService.LosCurrentPage.next("is_los_branch_summary")
    //   // this.Current_Page="is_los_branch_summary";
    //   this.router.navigate(['/los'], { skipLocationChange: true })
    // }
    // else {
    //   this.router.navigate(['/los'], { skipLocationChange: true })
    // }
  }
  viewdata(data) {
    // debugger;
    this.DtpcShareService.LOS_INV_APP_id.next(data.id)
    this.DtpcShareService.LosCurrentPage.next("")
    this.router.navigate(['/losappview'], { skipLocationChange: false })

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
      // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
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

  step = 0;
  setStep(index: number) {
    this.step = index;
  }


  viewDetails(data){
    this.DtpcService.get_application_number(data).subscribe(result => {
      // console.log(result);
      this.SpinnerService.hide();
      this.single_application_data = result;

      const dialogRef = this.dialog.open(DialogDetails, {
        data: this.single_application_data,
        height: '90%',
        width: '100%',
      });

      dialogRef.afterClosed().subscribe(result => {

        // console.log(`Dialog result: ${result}`);
      });

  })
}
 
numberOnlyandDot(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode < 46 || charCode > 47) && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

geteditfee(){
  let dta = this.EditfeeForm.value
  const flagstatus = {"LEGAL_FEE": dta.legal_fee, "VALU_FEE": dta.value_fee}
  let dataaa = {"id":this.Los_approver_summary_id?.id,"Is_Flag":JSON.stringify(flagstatus)}
  // console.log("fsts--->",flagstatus)
  this.SpinnerService.show()
  this.DtpcService.isflgchange(dataaa).subscribe(result=>{
    this.SpinnerService.hide()
    // console.log("flgchg--->",result)
    if(result?.status == "success"){
      this.notification.showSuccess("Success")
    }else{
      this.notification.showError(result?.description)
      return false;
    }
  })
}
amtchange(){
  let dta = this.EditamtForm.value
  this.SpinnerService.show()
  this.DtpcService.isamtchange(dta).subscribe(result=>{
    this.SpinnerService.hide()
    // console.log("result",result)
    if(result?.status == "success"){
      this.notification.showSuccess("Success")
      this.EditamtForm.patchValue({
        current_balance:0
      })
    }else{
      this.notification.showError(result?.description)
      return false;
    }
  })
}
statchange(){
  let dta=this.EditstatusForm.value
  this.SpinnerService.show()
  this.DtpcService.isstatuschange(dta).subscribe(result=>{
    this.SpinnerService.hide()
    // console.log("res==>",result)
    if(result?.status == "success"){
      this.notification.showSuccess("Success")
    }else{
      this.notification.showError(result?.description);
      return false;
    }
  })
}

}


@Component({
  selector: 'app-dialog-details',
  templateUrl: './dialog-details.component.html',
  styleUrls: ['./dialog-details.component.scss']
})
export class DialogDetails {
  [x: string]: any;
  view_application: any;
  Collaterals: any;
  pageSize = 10;
  currentpage: number = 1;
  Charges: any;
  constructor(public dialogRef: MatDialogRef<DialogDetails>,
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



