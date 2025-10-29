import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { RemsShareService } from '../rems-share.service'
@Component({
  selector: 'app-bank-account-type',
  templateUrl: './bank-account-type.component.html',
  styleUrls: ['./bank-account-type.component.scss']
})
export class BankAccountTypeComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  bankAccountTypeForm: FormGroup;
  idValue: any;
  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService,
    private remsService: RemsService, private toastr:
      ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.bankAccountTypeForm = this.fb.group({
      name: ['', Validators.required],
      remarks: ['', Validators.required],
    })
    this.getBanckAccountEdit();
  }

  getBanckAccountEdit() {
    let data: any = this.remsshareService.bankAccountType.value
    this.idValue = data.id;
    if (data === '') {
      this.bankAccountTypeForm.patchValue({
        name: '',
        remarks: ''
      })
    } else {
      this.bankAccountTypeForm.patchValue({
        name: data.name,
        remarks: data.remarks
      })
    }
  }

  bankAccountTypeCreate() {
    if (this.bankAccountTypeForm.value.name === "") {
      this.toastr.warning('', 'Please Enter Name', { timeOut: 1500 });
      return false;
    }
    if (this.bankAccountTypeForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    if (this.idValue == undefined) {
      this.remsService.bankAccountTypeCreate(this.bankAccountTypeForm.value, '')
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.onSubmit.emit();
          }
        })
    } else {
      this.remsService.bankAccountTypeCreate(this.bankAccountTypeForm.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully Updates!...")
            this.onSubmit.emit();
          }
        })
    }
  }
  onCancelClick() {
    this.onCancel.emit()
  }


}
