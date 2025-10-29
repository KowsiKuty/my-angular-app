import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { SharedService } from '../../service/shared.service';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-rent-form',
  templateUrl: './rent-form.component.html',
  styleUrls: ['./rent-form.component.scss']
})
export class RentFormComponent implements OnInit {
  rentForm: FormGroup;
  idValue: number;
  leaseAgrementId: number;
  premiseID: number;
  landlordData: any;
  rentTypeData: any;
  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService, private shareService: SharedService,
    private remsService: RemsService, private toastr:
      ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.rentForm = this.fb.group({
      // allocation_ratio: ['', Validators.required,],
      amenties_amount: ['', Validators.required],
      maintenance_amount: ['', Validators.required],
      rent_amount: ['', Validators.required],
      renttype: ['', Validators.required],
      others: ['', Validators.required],
      remarks: ['', Validators.required],
    })
    this.getRentEdit();
    // this.getlanlordsummary();
    this.getRentType();
  }

  getRentEdit() {
    let data: any = this.remsshareService.rentForm.value;
    console.log("renftform", data)
    let leaseAgreementId : any = this.remsshareService.rentForm1.value;
    this.leaseAgrementId = leaseAgreementId;
    this.idValue = data.id;
    if (data === '') {
      this.rentForm.patchValue({
        // allocation_ratio: '',
        amenties_amount: '',
        maintenance_amount: '',
        rent_amount: '',
        renttype: '',
        others: '',
        remarks: '',
      })
    } else {
      this.rentForm.patchValue({
        // allocation_ratio: data.allocation_ratio,
        amenties_amount: data.amenties_amount,
        maintenance_amount: data.maintenance_amount,
        rent_amount: data.rent_amount,
        renttype: data.renttype.id,
        others: data.others,
        remarks: data.remarks,

      })
    }
  }

  rentFormCreate() {
     if (this.rentForm.value.amenties_amount === "") {
      this.toastr.warning('', 'Please Enter Amenities Amount', { timeOut: 1500 });
      return false;
    }
    if (this.rentForm.value.maintenance_amount === "") {
      this.toastr.warning('', 'Please Enter Maintance Amount', { timeOut: 1500 });
      return false;
    }
    if (this.rentForm.value.rent_amount === "") {
      this.toastr.warning('', 'Please Enter Rent Amount', { timeOut: 1500 });
      return false;
    } if (this.rentForm.value.renttype === "") {
      this.toastr.warning('', 'Please Enter Rent Tpe', { timeOut: 1500 });
      return false;
    } 

    if (this.idValue == undefined) {
      this.remsService.rentFormCreate(this.rentForm.value, '', this.leaseAgrementId)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/agreementView'], { queryParams: { status: "rent" }, skipLocationChange: true });
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.rentFormCreate(this.rentForm.value, this.idValue, this.leaseAgrementId)
        .subscribe(result => {
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/agreementView'], { queryParams: { status: "rent" }, skipLocationChange: true });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/agreementView'], { queryParams: { status: "rent" }, skipLocationChange: true });

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getlanlordsummary(filter = "", sortOrder = 'asc', pageNumber = 1, pageSize = 10) {
    this.remsService.getlanlordsummary(filter, sortOrder, pageNumber, pageSize, this.premiseID)
      .subscribe((result) => {
        this.landlordData = result.data
      })
  }

  getRentType() {
    this.remsService.getRentType()
      .subscribe((result) => {
        this.rentTypeData = result.data
      })
  }

}
  