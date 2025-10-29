import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service'
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service'
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Rems2Service } from '../rems2.service'

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss']
})
export class ExpenseDetailsComponent implements OnInit {
  ExpensesForm: FormGroup;
  idValue: any;
  ExpID:any;
  data:any;
  Res:any;

  @ViewChild(FormGroupDirective) fromGroupDirective : FormGroupDirective 
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private router: Router, private remsshareService: RemsShareService, private route: ActivatedRoute,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService,private remsService2: Rems2Service) { }

  ngOnInit(): void {
    this.ExpensesForm = this.fb.group({
      category: ['', Validators.required],
      subcategory: ['',Validators.required],
      gl_no: ['', Validators.required],
      bs_id: ['', Validators.required],
      cc_id: ['', Validators.required],
      amount: ['', Validators.required],
      percentage: ['',Validators.required]
  })
  this.getExpdetails();
  }

  getExpdetails() {
 
    this.data = this.remsshareService.ExpensesForm.value;
    console.log(">>hai",this.data)
    this.idValue = this.data.id;
    if (this.data != 0) {
      this.ExpensesForm.patchValue({
        category: this.data.category,
        subcategory: this.data.subcategory,
        gl_no: this.data.gl_no,
        bs_id:this.data.bs.id,
        cc_id:this.data.cc.id,
        amount:this.data.amount,
        percentage:this.data.percentage,
      })
    } else{  
      this.ExpensesForm.patchValue({
        category:'',
        subcategory:'',
        gl_no:'',
        bs_id:'',
        cc_id:'',
        amount: '',
        percentage: '',
      })      
    }
} 
ExpensesCreateEditForm() {
  
  if (this.ExpensesForm.value.category === "") {
      this.toastr.error('Add category  Field', 'Empty value inserted', { timeOut: 1500 });
      return false;
  }
  if (this.ExpensesForm.value.subcategory === "") {
      this.toastr.error('Add subcategory  Field', 'Empty value inserted', { timeOut: 1500 });
      return false;
  }
  if (this.ExpensesForm.value.gl_no === "") {
    this.toastr.error('Add gl_no  Field', 'Empty value inserted', { timeOut: 1500 });
    return false;
  }
  if (this.ExpensesForm.value.bs_id === "") {
    this.toastr.error('Add bs_id  Field', 'Empty value inserted', { timeOut: 1500 });
    return false;
  }
  if (this.ExpensesForm.value.cc_id === "") {
  this.toastr.error('Add cc_id  Field', 'Empty value inserted', { timeOut: 1500 });
  return false;
 }
 if (this.ExpensesForm.value.amount === "") {
  this.toastr.error('Add amount  Field', 'Empty value inserted', { timeOut: 1500 });
  return false;
 }
 if (this.ExpensesForm.value.percentage === "") {
  this.toastr.error('Add percentage  Field', 'Empty value inserted', { timeOut: 1500 });
  return false;
 }

  if (this.idValue == 0) {
      this.remsService2.ExpensesForm(this.ExpensesForm.value, '',this.ExpID)
          .subscribe(result => {
              console.log("EXP", result)
              if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
                  this.notification.showError("Duplicate! [INVALID_DATA! ...]")
                 
              }
              else {
                  this.notification.showSuccess("Successfully Created!...")
                  this.router.navigate(['/rems/rentconfirmation'], { skipLocationChange: true });
                  this.fromGroupDirective.resetForm()
              }
          })
  } else {
      this.remsService2.ExpensesForm(this.ExpensesForm.value, this.idValue,this.ExpID)
          .subscribe(result => {
              console.log("llb", result)
              if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
                  this.notification.showError("Duplicate! [INVALID_DATA! ...]")
      
              }
              else {

                  this.notification.showSuccess("Successfully Updated!...")
                  this.fromGroupDirective.resetForm() 
                  this.idValue = undefined
                  console.log('id',this.idValue)
                  this.router.navigate(['/rems/rentconfirmation'],{ skipLocationChange: true });
              }
          })
  }

}
onRMCancelClick(){
  this.router.navigate(['/rems/rentconfirmation'],{ skipLocationChange: true });
}

numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
  }
  return true;
}
numberOnlyandDot(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode < 46 || charCode >47)  && (charCode < 48 || charCode > 57) ){
  return false;
  }
  return true;
}
}
