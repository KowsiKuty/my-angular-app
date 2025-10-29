import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common'; 
import { Rems2Service } from '../rems2.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { RemsShareService } from '../rems-share.service';
import { RemsService } from '../rems.service';

interface Invstatus{
  id:number;
  Value:any;
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
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})



export class InvoiceDetailsComponent implements OnInit {
  InvoiceDetails: FormGroup;
  InvoiceType:any;
  fileData:any;
  tomorrow = new Date();
  images: any;
  idValue=0;
  landlordList:any
  premiseId:any
  Invoicestatus: Invstatus[] = [

      {id: 1, Value: 1 },
     
    ];
    inputGstValue = "";

  constructor(private datePipe: DatePipe,private fb: FormBuilder,private router: Router,
    private toastr:ToastrService, private notification: NotificationService, private remsService: RemsService,
    private remsService2: Rems2Service,private remsshareService: RemsShareService) { }

  ngOnInit(): void {
    this.InvoiceDetails = this.fb.group({
      invoice_type: ['', Validators.required],
      pending_payment_months: ['', Validators.required],
      landlord:  ['', Validators.required],
      landlord_gstno:['', Validators.required],
      hsn_code:['', Validators.required],
      invoice_date:['', Validators.required],
      invoice_no:['', Validators.required],
      taxable_amount:['', Validators.required],
      cgstrate:['', Validators.required],
      sgstrate:['', Validators.required],
      igstrate:['', Validators.required],
      invoice_amount:['', Validators.required],
      invoice_status:['', Validators.required],
      remarks:['', Validators.required],
      images: [],
      

    })
    this.getInvoiceType();
    this.getInvoice();
    // this.getLandlordList();
  }
  getInvoice() {
    let data: any = this.remsshareService.getinvoicedetail.value
    console.log("invoicedet", data)
  //   // this.premiseId = data.premiseid;
    this.idValue = data.id;
    if (data.text !=0) {
      this.fileData=data.file_obj;
      console.log("filedata",this.fileData)
      this.InvoiceDetails.patchValue({
        invoice_type: data.invoice_type.id,
        pending_payment_months: data.pending_payment_months,
        landlord:data.landlord.id,
        landlord_gstno: data.landlord_gstno,
        hsn_code:data.hsn_code,
        invoice_date: data.invoice_date,
        invoice_no: data.invoice_no,
        taxable_amount: data.taxable_amount,
        cgstrate: data.cgstrate,
        sgstrate: data.sgstrate,
        igstrate: data.igstrate,
        invoice_amount: data.invoice_amount,
        invoice_status: data.invoice_status,
        remarks: data.remarks,
      })
      
    } else {
      // this.remsService.getInvoiceEdit(this.idValue)
      //   .subscribe((data) => {
      //     console.log("invv",data)
         
         

          this.InvoiceDetails.patchValue({
            invoice_type: '',
            pending_payment_months: '',
            landlord: '',
            landlord_gstno: '',
            hsn_code: '',
            invoice_date: '',
            invoice_no: '',
            taxable_amount: '',
            cgstrate: '',
            sgstrate: '',
            igstrate: '',
            invoice_amount: '',
            invoice_status: '',
            remarks: '',
           
    
          })
       
    }
  }

  getInvoiceType() {
    this.remsService2.getinvoiceType()
      .subscribe((result) => {
        console.log("getinvoiceType", result)
        this.InvoiceType = result.data
      })
  }

  onFileSelected(e) {
    this.images = e.target.files;

  }
  InvoiceDetailCreate(){
    if (this.InvoiceDetails.value.invoice_type === ""||this.InvoiceDetails.value.invoice_type === null || this.InvoiceDetails.value.invoice_type === undefined) {
            this.toastr.warning('', 'Please Select Invoice Type', { timeOut: 1500 });
           return false;
    }
    if (this.InvoiceDetails.value.pending_payment_months === ""||this.InvoiceDetails.value.pending_payment_months === null || this.InvoiceDetails.value.pending_payment_months === undefined) {
      this.toastr.warning('', 'Please Enter Pending Payment Months', { timeOut: 1500 });
     return false;
   }
   if (this.InvoiceDetails.value.landlord === ""||this.InvoiceDetails.value.landlord === null || this.InvoiceDetails.value.landlord === undefined) {
    this.toastr.warning('', 'Please Enter Landlord', { timeOut: 1500 });
   return false;
   }
   if (this.InvoiceDetails.value.landlord_gstno === ""||this.InvoiceDetails.value.landlord_gstno === null || this.InvoiceDetails.value.landlord_gstno === undefined) {
    this.toastr.warning('', 'Please Enter Landlord GSTNo', { timeOut: 1500 });
   return false;
   }
   if (this.InvoiceDetails.value.hsn_code === ""||this.InvoiceDetails.value.hsn_code === null || this.InvoiceDetails.value.hsn_code === undefined) {
    this.toastr.warning('', 'Please Enter HSN Code', { timeOut: 1500 });
   return false;
   }
   if (this.InvoiceDetails.value.invoice_date === ""||this.InvoiceDetails.value.invoice_date === null || this.InvoiceDetails.value.invoice_date === undefined) {
    this.toastr.warning('', 'Please Select Invoice Date', { timeOut: 1500 });
   return false;
   }
   if (this.InvoiceDetails.value.invoice_no === ""||this.InvoiceDetails.value.invoice_no === null || this.InvoiceDetails.value.invoice_no === undefined) {
    this.toastr.warning('', 'Please Enter Invoice Number', { timeOut: 1500 });
   return false;
   }
   if (this.InvoiceDetails.value.taxable_amount === ""||this.InvoiceDetails.value.taxable_amount === null || this.InvoiceDetails.value.taxable_amount === undefined) {
    this.toastr.warning('', 'Please Enter Taxable Amount', { timeOut: 1500 });
   return false;
   }
   if (this.InvoiceDetails.value.cgstrate === ""||this.InvoiceDetails.value.cgstrate === null || this.InvoiceDetails.value.cgstrate === undefined) {
    this.toastr.warning('', 'Please Enter CGST', { timeOut: 1500 });
   return false;
   }
   if (this.InvoiceDetails.value.sgstrate === ""||this.InvoiceDetails.value.sgstrate === null || this.InvoiceDetails.value.sgstrate === undefined) {
    this.toastr.warning('', 'Please Enter SGST', { timeOut: 1500 });
   return false;
   } 
   if (this.InvoiceDetails.value.igstrate === ""||this.InvoiceDetails.value.igstrate === null || this.InvoiceDetails.value.igstrate === undefined) {
    this.toastr.warning('', 'Please Enter IGST', { timeOut: 1500 });
   return false;
   }
   if (this.InvoiceDetails.value.invoice_amount === "" ||this.InvoiceDetails.value.invoice_amount === null || this.InvoiceDetails.value.invoice_amount === undefined) {
    this.toastr.warning('', 'Please Enter Invoice Amount', { timeOut: 1500 });
   return false;
   } 
   if (this.InvoiceDetails.value.invoice_status === ""||this.InvoiceDetails.value.invoice_status === null || this.InvoiceDetails.value.invoice_status === undefined) {
    this.toastr.warning('', 'Please Enter Invoice Status', { timeOut: 1500 });
   return false;
   }
   if (this.InvoiceDetails.value.remarks === ""|| this.InvoiceDetails.value.remarks === null || this.InvoiceDetails.value.remarks === undefined) {
    this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
   return false;
   } 
   if (this.InvoiceDetails.value.images === ""|| this.InvoiceDetails.value.images === null || this.InvoiceDetails.value.images === undefined) { 
          this.toastr.warning('', 'Choose Upload Files ', { timeOut: 1500 });
          return false;
    }


    const Date = this.InvoiceDetails.value;
    Date.invoice_date = this.datePipe.transform(Date.invoice_date, 'yyyy-MM-dd');
    if (this.idValue == 0) {
    this.remsService.InvoiceDetailsForm(this.InvoiceDetails.value,'',this.images)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/rentconfirmation']);
          }
          this.idValue = result.id;
        })
      } else {
        this.remsService.InvoiceDetailsForm(this.InvoiceDetails.value, this.idValue, this.images)
          .subscribe(result => {
            if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
              this.notification.showError("Duplicate! [INVALID_DATA! ...]")
              
            }
            else {
              this.notification.showSuccess("Successfully Updates!...")
              this.router.navigate(['/rems/rentconfirmation']);
            }

  })
}
  }
  getLandlordList() {
    let data: any = this.remsshareService.PremiseView.value;
    this.premiseId=data.id
    this.remsService.getlanlord(this.premiseId)
      .subscribe(result => {
        this.landlordList = result.data;
        
      })
  }

  
  onCancelClick(){
    this.router.navigate(['/rems/rentconfirmation']);
  }

}
