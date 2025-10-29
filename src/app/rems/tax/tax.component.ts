import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {RemsShareService} from '../rems-share.service'

import { SharedService } from '../../service/shared.service';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  taxForm: FormGroup;
  amentiesList: any;
  idValue: any;
  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService, private shareService: SharedService,
    private remsService: RemsService, private toastr:
      ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.taxForm = this.fb.group({
      glno: ['', Validators.required],
      name: ['', Validators.required],
      remarks: ['', Validators.required],
    })
    this.getEditTax();
  }

  getEditTax() {
    let data: any = this.remsshareService.taxForm.value;
    this.idValue = data.id;
    if (data === '') {
      this.taxForm.patchValue({
        name: '',
        glno: '',
        remarks: ''
      })
    } else {
      this.taxForm.patchValue({
        glno: data.glno,
        name: data.name,
        remarks: data.remarks
      })
    }
  }

  taxFormCreate() {
    if (this.taxForm.value.glno === "") {
      this.toastr.warning('', 'Please Enter GL no', { timeOut: 1500 });
      return false;
    }if (this.taxForm.value.name === "") {
      this.toastr.warning('', 'Please Enter Name', { timeOut: 1500 });
      return false;
    }
    if (this.taxForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    if (this.idValue == undefined) {
      this.remsService.taxFormCreate(this.taxForm.value, '')
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.onSubmit.emit();
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.taxFormCreate(this.taxForm.value, this.idValue)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.onSubmit.emit();
          }
        })
    }
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}
