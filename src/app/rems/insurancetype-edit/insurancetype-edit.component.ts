import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsService } from '../rems.service';
import { RemsShareService } from '../rems-share.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-insurancetype-edit',
  templateUrl: './insurancetype-edit.component.html',
  styleUrls: ['./insurancetype-edit.component.scss']
})
export class InsurancetypeEditComponent implements OnInit {
  InsuranceTypeEditForm: FormGroup;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private router: Router, private remsshareService: RemsShareService,
    private dataService: RemsService, private toastr: ToastrService, private notification: NotificationService, ) { }
  ngOnInit(): void {
    this.InsuranceTypeEditForm = this.fb.group({
      name: ['', Validators.required],
      type: 1,
    })
    this.getinsuranceEdit();
  }
  getinsuranceEdit() {
    let id = this.remsshareService.InsuranceTypeEdit.value
    console.log("InsuranceTypeEditForm Edit", this.remsshareService.InsuranceTypeEdit.value)
    this.dataService.getInsurance(id)
      .subscribe((result: any) => {
        let Name = result.name;
        this.InsuranceTypeEditForm.patchValue({
          name: Name
        })
      })
  }
  InsuranceTypeEditSubmit() {
    if (this.InsuranceTypeEditForm.value.name === "") {
      this.toastr.error('Add Name Field', 'Empty value not Allowed');
      return false;
    }
    if (this.InsuranceTypeEditForm.value.name.trim() === "") {
      this.toastr.error('Add Name Field', ' WhiteSpace Not Allowed');
      return false;
    }
    if (this.InsuranceTypeEditForm.value.name.trim().length > 20) {
      this.toastr.error('Not more than 20 characters', 'Enter valid Name');
      return false;
    }
    let idValue: any = this.remsshareService.InsuranceTypeEdit.value
    let data = this.InsuranceTypeEditForm.value
    this.dataService.InsuranceTypeEditSubmit(data, idValue.id)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.onSubmit.emit();
        }
        console.log("Insurane Edit Form SUBMIT", result)
        return true
      })
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  onCancelClick() {
    this.onCancel.emit()
  }
}
