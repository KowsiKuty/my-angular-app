import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { RemsShareService } from '../rems-share.service'
@Component({
  selector: 'app-statutory-type',
  templateUrl: './statutory-type.component.html',
  styleUrls: ['./statutory-type.component.scss']
})
export class StatutoryTypeComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  statutoryTypeForm: FormGroup;
  idValue: any;
  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService,
    private remsService: RemsService, private toastr:
      ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.statutoryTypeForm = this.fb.group({
      name: ['', Validators.required],
      remarks: ['', Validators.required],
    })
    this.getEditStatutoryType();
  }

  getEditStatutoryType() {
    let data: any = this.remsshareService.statutoryTypeForm.value
    this.idValue = data.id;
    if (data === '') {
      this.statutoryTypeForm.patchValue({
        name: '',
        remarks: ''
      })
    } else {
      this.statutoryTypeForm.patchValue({
        name: data.name,
        remarks: data.remarks
      })
    }
  }

  statutoryTypeCreate() {
    if (this.statutoryTypeForm.value.name === "") {
      this.toastr.warning('', 'Please Enter Name', { timeOut: 1500 });
      return false;
    }
    if (this.statutoryTypeForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    if (this.idValue == undefined) {
      this.remsService.statutoryTypeCreate(this.statutoryTypeForm.value, '')
        .subscribe(result => {
          console.log(">.statutoryTypeCreate", result)
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
      this.remsService.statutoryTypeCreate(this.statutoryTypeForm.value, this.idValue)
        .subscribe(result => {
          console.log(">.statutoryTypeCreate", result)
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
