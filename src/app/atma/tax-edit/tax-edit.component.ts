import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ShareService } from '../share.service'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-tax-edit',
  templateUrl: './tax-edit.component.html',
  styleUrls: ['./tax-edit.component.scss']
})
export class TaxEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  taxEditForm: FormGroup;
  taxEditId: number;
  disableSubmit=true;
  s: any;
  pay_receivableList = [
    { "PayRec": "receivable", id: 1, name: "Receivable" },
    { "PayRec": "payable", id: 2, name: "Payable" }
  ]
  constructor(private shareService: ShareService, private fb: FormBuilder, 
    private notification: NotificationService,
    private atmaService: AtmaService) { }

  ngOnInit(): void {
    this.taxEditForm = this.fb.group({
    
      name: ['', Validators.required],
      glno: ['', Validators.required],
      pay_receivable: ['', Validators.required],
    })
    this.getTaxEditForm()
  }


  getTaxEditForm() {
    let data: any = this.shareService.taxEdit.value;
    this.taxEditId = data.id;
    let Code = data.code;
    let Name = data.name;
    let Glno = data.glno;
    let Payable = data.payable;
    let Receivable = data.receivable
    let payReceivable = "";
    if (Payable === true) {
      payReceivable = "payable"
    } else if (Receivable === true) {
      payReceivable = "receivable"
    }
    this.taxEditForm.patchValue({
      name: Name,
      code: Code,
      glno: Glno,
      pay_receivable: payReceivable
    })
  }


  taxEditCreateForm() {
    this.disableSubmit=true;
   if(this.taxEditForm.valid){

   

    this.atmaService.taxEditCreateForm(this.taxEditId, this.taxEditForm.value)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate Code & Name ...")
          this.disableSubmit=false;

        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          this.disableSubmit=false;
        } else {
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
        }
      })}
      else{
        this.notification.showError("INVALID_DATA!...")
        this.disableSubmit=false;
        return false
      }
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
