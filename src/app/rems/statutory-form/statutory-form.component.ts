import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Rems2Service } from '../rems2.service'
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
  selector: 'app-statutory-form',
  templateUrl: './statutory-form.component.html',
  styleUrls: ['./statutory-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class StatutoryFormComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  statutoryForm: FormGroup;
  premiseId:number;
  idValue: any;
  refTypeList:any;
  refidList:any;
  sss:any;
  refTypeID:number;
  statutoryidList:any;
  ref:any;
  StatutoryBtn=false;

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private router: Router, private remsshareService: RemsShareService, private route: ActivatedRoute,
    private remsService: RemsService, private toastr: ToastrService, private notification: NotificationService, private location: Location,private remsService2: Rems2Service) { }

  ngOnInit(): void {
    this.statutoryForm = this.fb.group({
      tax_name: ['', Validators.required],
      tax_amount: ['', Validators.required],
      due_date: ['', Validators.required],
      remarks: ['', Validators.required],
      ref_id: ['', Validators.required],
      ref_type: ['', Validators.required],
    })
    this.getPremiseId();
    this.getRefType();
    this.getstatutory();
    this.getstatutoryTypedetails();
   
  }
  getPremiseId() {	
    this.premiseId = this.remsshareService.premiseViewID.value	
  }	

  private getRefType(){
    this.remsService.getRefType(this.premiseId)
    .subscribe((results: any[]) => {
      let refdata = results["data"];
      this.refTypeList = refdata;
    })
    
  }

  dependentid(id){
    this.remsService.getRefID(this.premiseId,id)
    .subscribe((results: any[]) => {
      let refdata = results["data"];
      this.refidList = refdata;
    })
  }
  private getstatutoryTypedetails() {
    this.remsService2.getstatutoryTypedetails()
      .subscribe((results: any[]) => {
        let databb = results["data"];
        this.statutoryidList = databb;
      })
  }

  getstatutory() {
    let data: any = this.remsshareService.statutoryIdValue.value;
    this.idValue = data.id;
    if (data === '') {
      this.statutoryForm.patchValue({
        tax_name: '',
        tax_amount: '',
        due_date: '',
        remarks:'',
        ref_id:'',
        ref_type:''
      })
    } else {
    this.remsService2.statutoryparticular(data.id,this.premiseId)
    .subscribe((result) => {	
    this.refTypeID = result.ref_type
    this.dependentid(this.refTypeID)
    let datas = result.ref_id['data'];
    let overall=datas;
    for(var i=0;i<overall.length;i++){
      this.ref=overall[i].id
    }
      this.statutoryForm.patchValue({
        tax_name: result.tax_name.id,
        tax_amount: result.tax_amount,
        due_date: result.due_date,
        remarks:result.remarks,
        ref_id:this.ref,
        ref_type:result.ref_type
      })
    })
    }
  }
 
  statutoryCreateEditForm() {
    this.StatutoryBtn=true;
    if (this.statutoryForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter  Type', { timeOut: 1500 });
      this.StatutoryBtn=false;
      return false;
    }
    if (this.statutoryForm.value.ref_id === "") {
      this.toastr.warning('', 'Please Enter  ID', { timeOut: 1500 });
      this.StatutoryBtn=false;
      return false;
    }
    if (this.statutoryForm.value.tax_name === "") {
      this.toastr.warning('', 'Please Enter  Tax Name', { timeOut: 1500 });
      this.StatutoryBtn=false;
      return false;
    }
    if (this.statutoryForm.value.tax_amount === "") {
      this.toastr.warning('', 'Please Enter   Tax Amount', { timeOut: 1500 });
      this.StatutoryBtn=false;
      return false;
    }
    if (this.statutoryForm.value.due_date === "") {
      this.toastr.warning('', 'Please Enter  Due Date', { timeOut: 1500 });
      this.StatutoryBtn=false;
      return false;
    }
    if (this.statutoryForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter  Remarks', { timeOut: 1500 });
      this.StatutoryBtn=false;
      return false;
    }
 
    const currentDate = this.statutoryForm.value
    currentDate.due_date = this.datePipe.transform(currentDate.due_date, 'yyyy-MM-dd');


    if (this.idValue == undefined) {
      this.remsService2.statutoryCreateEditForm(this.statutoryForm.value, '',this.premiseId)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.StatutoryBtn=false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.StatutoryBtn=false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Statutory Payments" }, skipLocationChange: true });
            this.statutoryForm.reset();
            return true
          }
        })
    } else {
      this.remsService2.statutoryCreateEditForm(this.statutoryForm.value, this.idValue, this.premiseId)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.StatutoryBtn=false;
          }
         else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.StatutoryBtn=false;
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.idValue = undefined
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Statutory Payments" }, skipLocationChange: true });
            this.statutoryForm.reset();
            return true
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Statutory Payments" }, skipLocationChange: true });
   }

   omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
   only_char(event){
    var a;
    a = event.which;
    if((a>32) && (a<65 || a>90) && (a < 97 || a>122)){
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
}
