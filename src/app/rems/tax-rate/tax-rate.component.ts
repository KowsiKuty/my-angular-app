import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-tax-rate',
  templateUrl: './tax-rate.component.html',
  styleUrls: ['./tax-rate.component.scss']
})
export class TaxRateComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  taxRateForm: FormGroup;
  taxList: any;
  idValue: any;
  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService,
    private remsService: RemsService, private toastr:
      ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.taxRateForm = this.fb.group({
      tax_id: ['', Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      rate: ['', Validators.required],
    })
    this.getEditTaxRate();
    this.getTax();
  }

  getEditTaxRate() {
    let data: any = this.remsshareService.taxRateForm.value;
    this.idValue = data.id;
    if (data === '') {
      this.taxRateForm.patchValue({
        tax_id: '',
        code: '',
        name: '',
        rate: '',
      })
    } else {
      this.taxRateForm.patchValue({
        tax_id: data.tax_id,
        code: data.code,
        name: data.name,
        rate: data.rate
      })
    }
  }

  taxRateFormCreate() {
    if (this.taxRateForm.value.code === "") {
      this.toastr.warning('', 'Please Enter Code', { timeOut: 1500 });
      return false;
    } if (this.taxRateForm.value.name === "") {
      this.toastr.warning('', 'Please Enter Name', { timeOut: 1500 });
      return false;
    }
    if (this.taxRateForm.value.rate === "") {
      this.toastr.warning('', 'Please Enter Rate', { timeOut: 1500 });
      return false;
    }
    if (this.idValue == undefined) {
      this.remsService.taxRateFormCreate(this.taxRateForm.value, '')
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          } else if (result.code === "Unexpected Error" && result.description === "Unexpected Error") {
            this.notification.showError("Code Error")
          } else {
            this.notification.showSuccess("Successfully created!...")
            this.onSubmit.emit();
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.taxRateFormCreate(this.taxRateForm.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          } else if (result.code === "Unexpected Error" && result.description === "Unexpected Error") {
            this.notification.showError("Code Error")
          } else {
            this.notification.showSuccess("Successfully Updated!...")
            this.onSubmit.emit();
          }
        })
    }
  }

  onCancelClick() {
    this.onCancel.emit()
  }

  getTax() {
    this.remsService.getTaxList()
      .subscribe(data => {
        this.taxList = data.data;
      })
  }
}
