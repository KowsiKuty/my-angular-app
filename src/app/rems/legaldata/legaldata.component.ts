import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {RemsShareService} from '../rems-share.service'
import { SharedService } from '../../service/shared.service';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-legaldata',
  templateUrl: './legaldata.component.html',
  styleUrls: ['./legaldata.component.scss']
})
export class LegaldataComponent implements OnInit {

  legalDataForm: FormGroup;
  amentiesList: any;
  idValue: any;
  dropDownTag = "true"
  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService, private shareService: SharedService,
    private remsService: RemsService, private toastr:
      ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.legalDataForm = this.fb.group({
      EC_details: ['', Validators.required],
      lease_id: ['1', Validators.required],
      noc_details: ['', Validators.required],
      noc_remarks: ['', Validators.required],
      under_mortage: ['', Validators.required],
    })
    this.getEditLegalData();
  }

  getEditLegalData() {
    let data: any = this.remsshareService.legaldataForm.value
    this.idValue = data.id;
    if (data === '') {
      this.legalDataForm.patchValue({
        EC_details: '',
        lease_id: '1',
        noc_details: '',
        noc_remarks: '',
        under_mortage: ''
      })
    } else {
      this.legalDataForm.patchValue({
        EC_details: data.EC_details,
        lease_id: '1',
        noc_details: data.noc_details,
        noc_remarks: data.noc_remarks,
        under_mortage: data.under_mortage
      })
    }
  }

  legaldataCreate() {
    if (this.legalDataForm.value.EC_details === "") {
      this.toastr.warning('', 'Please Enter EC Details', { timeOut: 1500 });
      return false;
    } if (this.legalDataForm.value.under_mortage === "") {
      this.toastr.warning('', 'Select Mortage', { timeOut: 1500 });
      return false;
    } if (this.legalDataForm.value.noc_remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      return false;
    }
    if (this.legalDataForm.value.noc_details === "") {
      this.toastr.warning('', 'Please Enter Noc Details', { timeOut: 1500 });
      return false;
    }
    if (this.idValue == undefined) {
      this.remsService.legalDataFormCreate(this.legalDataForm.value, "")
        .subscribe(result => {
          console.log(">.legal dayaaa", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/premiseView'], { skipLocationChange: true });
          }
          this.idValue = result.id;
        })

    } else {
      this.remsService.legalDataFormCreate(this.legalDataForm.value, this.idValue)
        .subscribe(result => {
          console.log(">.AMAMAMMAitessss", result)
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully Updates!...")
            this.router.navigate(['/rems/premiseView'], { skipLocationChange: true });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { skipLocationChange: true });
  }

}
