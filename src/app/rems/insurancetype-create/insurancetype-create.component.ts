import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { RemsShareService } from '../rems-share.service'
@Component({
  selector: 'app-insurancetype-create',
  templateUrl: './insurancetype-create.component.html',
  styleUrls: ['./insurancetype-create.component.scss']
})
export class InsurancetypeCreateComponent implements OnInit {
  InsuranceTypeForm: FormGroup;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private fb: FormBuilder, private router: Router, private remsshareService: RemsShareService,
    private dataService: RemsService, private toastr: ToastrService, private notification: NotificationService, ) { }
  ngOnInit(): void {
    this.InsuranceTypeForm = this.fb.group({
      name: ['', Validators.required],
      type: 1,
    })
  }
  InsuranceTypeCreateSubmit() {
    if (this.InsuranceTypeForm.value.name === "") {
      this.toastr.error('Add Name Field', 'Empty value not Allowed');
      return false;
    }
    if (this.InsuranceTypeForm.value.name.trim() === "") {
      this.toastr.error('Add Name Field', ' WhiteSpace Not Allowed');
      return false;
    }
    if (this.InsuranceTypeForm.value.name.trim().length > 20) {
      this.toastr.error('Not more than 20 characters', 'Enter valid Name');
      return false;
    }
    let data = this.InsuranceTypeForm.value
    this.dataService.InsuranceTypeCreateSubmit(data)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showError("Duplicate! [INVALID_DATA! ...]")
        } else if (result.code === "INVALID_DATE  " && result.description === "INVALID DATE") {
          this.notification.showError("InValid Date")
        }
        else {
          this.notification.showSuccess("Successfully created!...")
          this.onSubmit.emit();
        }
        console.log("Insurane Form SUBMIT", result)
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