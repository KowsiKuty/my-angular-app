import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RemsService } from '../rems.service';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RemsShareService } from '../rems-share.service'

interface Insurance{
  id:number;
  Name:boolean;
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
  selector: 'app-repair-and-maintenance-create',
  templateUrl: './repair-and-maintenance-create.component.html',
  styleUrls: ['./repair-and-maintenance-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class RepairAndMaintenanceCreateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  repaircreateAddForm: FormGroup;
  isRepairForm: boolean;
  @Input() max: any;
  tomorrow = new Date();
  currentDate: any = new Date();
  defaultDate = new FormControl(new Date());
  TypeidList:any;
  premiseId:any;
  premiseViewID:any;  
  refidList:any;
  refTypeList:any;
  InsuranceList=[{'id':'1', 'name':true,'show':'Yes'},{'id':'0', 'name':false,'show':'No'}]
  RMButton=false;

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,
    private toastr: ToastrService, private remsservice: RemsService, private notification: NotificationService,
    private router: Router, private remsshareService: RemsShareService) { }

  ngOnInit(): void {
    this.repaircreateAddForm = this.formBuilder.group({
      ref_type: ['', Validators.required],
      ref_id: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      damage_amount: ['', Validators.required],
      is_insurance_claimed: ['', Validators.required],
      amount_claimed: ['', Validators.required],
      rm_type: ['', Validators.required],
      remarks: ['', Validators.required]
    })
    this.getTypedetails();
    this.getPremiseId();
    this.getRefType();
  }
  getPremiseId() {
    this.premiseId = this.remsshareService.premiseViewID.value
  }

  private getRefType(){
    this.remsservice.getRefType(this.premiseId)
    .subscribe((results: any[]) => {
      let refdata = results["data"];
      this.refTypeList = refdata;
    })
  }
  setDate(date: string) {
    this.currentDate = date
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    return this.currentDate;
  }

  private getTypedetails() {
    this.remsservice.getTypedetails()
      .subscribe((results: any[]) => {
        let databb = results["data"];
        this.TypeidList = databb;
      })
  }
  dependentid(s){
    this.remsservice.getRefID(this.premiseId,s)
    .subscribe((results: any[]) => {
      let refdata = results["data"];
      this.refidList = refdata;
    })
  }

  createFormate() {
    let data = this.repaircreateAddForm.controls;

    let objrepaircreate = new repaircreate();
    objrepaircreate.ref_type = data['ref_type'].value;
    objrepaircreate.ref_id = data['ref_id'].value;
    objrepaircreate.description = data['description'].value;
    objrepaircreate.date = data['date'].value;
    objrepaircreate.damage_amount = data['damage_amount'].value;
    objrepaircreate.is_insurance_claimed = data['is_insurance_claimed'].value;
    objrepaircreate.amount_claimed = data['amount_claimed'].value;
    objrepaircreate.remarks = data['remarks'].value;
    objrepaircreate.rm_type = data['rm_type'].value;
    let dateValue = this.repaircreateAddForm.value;
    objrepaircreate.date = this.datePipe.transform(dateValue.date, 'yyyy-MM-dd');
    return objrepaircreate;
  }
  submitForm() {
    this. RMButton=true;
    if (this.repaircreateAddForm.value.ref_type ===""){
      this.toastr.warning('', 'Please Enter  Type', { timeOut: 1500 });
      this. RMButton=false;
      return false;
    }
    else if (this.repaircreateAddForm.value.ref_id ===""){
      this.toastr.warning('', 'Please Enter ID', { timeOut: 1500 });

      this. RMButton=false;
      return false;
    }
    else if (this.repaircreateAddForm.value.description === "") {
      this.toastr.warning('', 'Please Enter Description', { timeOut: 1500 });
      this. RMButton=false;
      return false;
    }

    else if (this.repaircreateAddForm.value.date === "") {
      this.toastr.warning('', 'Please Enter Date', { timeOut: 1500 });
      this. RMButton=false;
      return false;
    }
    else if (this.repaircreateAddForm.value.damage_amount === "") {
      this.toastr.warning('', 'Please Enter Damage Amount', { timeOut: 1500 });
      this. RMButton=false;
      return false;
    }
    else if (this.repaircreateAddForm.value.is_insurance_claimed === "") {
      this.toastr.warning('', 'Please Enter Insurance Claimed', { timeOut: 1500 });
      this. RMButton=false;
      return false;
    }
    else if (this.repaircreateAddForm.value.amount_claimed === "") {
      this.toastr.warning('', 'Please Enter Amount Claimed', { timeOut: 1500 });
      this. RMButton=false;
      return false;
    }
    else if (this.repaircreateAddForm.value.rm_type === "") {
      this.toastr.warning('', 'Please Enter Type', { timeOut: 1500 });
      this. RMButton=false;
      return false;
    }
    else if (this.repaircreateAddForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      this. RMButton=false;
      return false;
    }
    if(this.repaircreateAddForm.value.is_insurance_claimed === false){
      if (this.repaircreateAddForm.value.amount_claimed!=0) {
        this.toastr.warning('', 'Claimed Amount should be 0', { timeOut: 1500 });
        this. RMButton=false;
        return false;
      }

    }
    if(this.repaircreateAddForm.value.is_insurance_claimed === true){
      if (this.repaircreateAddForm.value.amount_claimed > this.repaircreateAddForm.value.damage_amount) {
        this.toastr.warning('', 'claimed Amount should be less than or equal to amount of damage', { timeOut: 1500 });
        this. RMButton=false;
        return false;
      }

    }
   


    this.remsservice.repaircreateAddForm(this.createFormate(),this.premiseId)
     .subscribe(result => {
      let code = result.code
      if (code === "INVALID_MODIFICATION_REQUEST") {
        this.notification.showError("You can not Modify before getting the Approval")
        this. RMButton=false;
      }
      else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.notification.showError("Duplicate! [INVALID_DATA! ...]")
        this. RMButton=false;
      }
      else{
       this.notification.showSuccess("Successfully created....")
       console.log("result", result)
       this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Repairs & Maintenance" }, skipLocationChange: true });
        return true
      }
     } )

  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Repairs & Maintenance" }, skipLocationChange: true });
  }


  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  only_num(event) {
    var k;
    k = event.charCode;
    return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  only_char(event) {
    var a;
    a = event.which;
    if ((a>32) &&(a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }

}
class repaircreate {
  ref_type:number;
  ref_id:number;
  description: string;
  date: string;
  damage_amount: number;
  is_insurance_claimed: string;
  amount_claimed: number;
  rm_type: string
  remarks: string;
}
