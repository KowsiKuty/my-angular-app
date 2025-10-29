import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  taxForm: FormGroup;
  disableSubmit=true;
  pay_receivableList = [
    { "PayRec": "Receivable", id: 1, name: "Receivable" },
    { "PayRec": "Payable", id: 2, name: "Payable" }
  ]
  payable:any={'Yes':1,'No':0};
  receivable:any={'Yes':1,'No':0};
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.taxForm = this.fb.group({
      
      name: ['', Validators.required],
      glno: ['', Validators.required],
      pay_receivable: ['', Validators.required],
      isreceivable:['',Validators.required]
    })
  }

  taxCreateForm() {
    console.log(this.taxForm.get('glno').value.toString().length);
    if(this.taxForm.get('glno').value.toString().length ==9 || this.taxForm.get('glno').value.toString().length ==16){
      console.log(this.taxForm.value);
    }
    else{
      this.notification.showError('Please Enter The Glno upto 9 0r 16 digits');
      return false;
    }
    if(this.taxForm.get('name').value.trim()=='' || this.taxForm.get('name').value==undefined || this.taxForm.get('name').value==null){
      this.notification.showError('Please Enter The Tax Name');
      return false;
    }
    if(this.taxForm.get('pay_receivable').value==null || this.taxForm.get('pay_receivable').value=='' || this.taxForm.get('pay_receivable').value==undefined ){
      this.notification.showError('Please Enter The Payable');
      return false;
    }
    if(this.taxForm.get('isreceivable').value==null || this.taxForm.get('isreceivable').value==undefined || this.taxForm.get('isreceivable').value==''){
      this.notification.showError('Please Enter The Receivable');
      return false;
    }
    let data:any={
      "name":this.taxForm.get('name').value.trim(),
      "receivable":this.receivable[this.taxForm.get('isreceivable').value],
      "payable":this.payable[this.taxForm.get('pay_receivable').value],
      "glno":this.taxForm.get('glno').value
  }
    this.atmaService.taxCreateForm(data)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate Code & Name ...")
          this.disableSubmit=false
        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          this.disableSubmit=false
        } else {
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
        }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      )
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onCancelClick() {
    this.onCancel.emit()
  }

}
