import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
import { RemsShareService } from '../rems-share.service'
import { Rems2Service } from '../rems2.service'
@Component({
  selector: 'app-amenties',
  templateUrl: './amenties.component.html',
  styleUrls: ['./amenties.component.scss']
})
export class AmentiesComponent implements OnInit {
  amentiesForm: FormGroup;
  amentiesList: any;
  idValue: any;
  refTypeData: any
  premiseId: number;
  refTypeIdData: any;
  refIdValue: any;
  refTypeID: number;
  AmenitiesButton=false
  constructor(private fb: FormBuilder, private router: Router,
    private remsshareService: RemsShareService, private remsService2: Rems2Service,
    private remsService: RemsService, private toastr:
      ToastrService, private notification: NotificationService, ) { }

  ngOnInit(): void {
    this.amentiesForm = this.fb.group({
      amenties_id: ['', Validators.required],
      remarks: ['', Validators.required],
      ref_type: ['', Validators.required],
      ref_id: ['', Validators.required],
      premise_id: '',
    })
    this.getPremiseId();
    this.getEditAmenities();
    this.getAmenitiesType();
    this.getRefType();
  }
  getPremiseId() {
    this.premiseId = this.remsshareService.premiseViewID.value
  }

  getEditAmenities() {
    let data: any = this.remsshareService.amenities.value
    this.idValue = data.id;
    if (data === '') {
      this.refIdValue = this.premiseId
      this.amentiesForm.patchValue({
        amenties_id: '',
        remarks: '',
        ref_type: '',
        ref_id: '',
        premise_id: ''
      })
    } else {
      this.remsService.getEditAmenties(data.id)
        .subscribe((result) => {
          this.refIdValue = this.premiseId
          // if (result.ref_type.id){
          //   this.amentiesForm.get('ref_type').ma();
          // }if (result.ref_id.id){
          //   this.amentiesForm.get('ref_id').disable();
          // }
          this.refTypeID = result.ref_type.id
          this.getRefIdValue(this.refTypeID)
          this.amentiesForm.patchValue({
            amenties_id: result.amenties.id,
            remarks: result.remarks,
            ref_type: result.ref_type.id,
            ref_id: result.ref_id.id,
            premise_id: result.premise_id,
          })
        })
    }
  }

  amentiesFormCreate() {
    this.AmenitiesButton=true;
    if (this.amentiesForm.value.ref_type === "") {
      this.toastr.warning('', 'Please Enter Ref Type', { timeOut: 1500 });
      this.AmenitiesButton=false;
      return false;
    } if (this.amentiesForm.value.ref_id === "") {
      this.toastr.warning('', 'Please Enter Ref Id', { timeOut: 1500 });
      this.AmenitiesButton=false;
      return false;
    }
    if (this.amentiesForm.value.amenties_id === "") {
      this.toastr.warning('', 'Please Enter Amenities Type', { timeOut: 1500 });
      this.AmenitiesButton=false;
      return false;
    }
    if (this.amentiesForm.value.remarks === "") {
      this.toastr.warning('', 'Please Enter Remarks', { timeOut: 1500 });
      this.AmenitiesButton=false;
      return false;
    } 
    this.amentiesForm.value.premise_id = this.premiseId;
    if (this.idValue == undefined) {
      this.remsService.amentiesFormCreate(this.amentiesForm.value, '', this.premiseId)
        .subscribe(result => {
          let code = result.code
        if (code === "INVALID_MODIFICATION_REQUEST") {
          this.notification.showError("You can not Modify before getting the Approval")
          this.AmenitiesButton=false;
        }
         else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.AmenitiesButton=false;
          }
          else {
            this.notification.showSuccess("Successfully created!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Amenities & Infrastructure" }, skipLocationChange: true });
          }
          this.idValue = result.id;
        })
    } else {
      this.remsService.amentiesFormCreate(this.amentiesForm.value, this.idValue, this.premiseId)
        .subscribe(result => {
          let code = result.code
          if (code === "INVALID_MODIFICATION_REQUEST") {
            this.notification.showError("You can not Modify before getting the Approval")
            this.AmenitiesButton=false;
          }
          else if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.AmenitiesButton=false;
          }
          else {
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Amenities & Infrastructure" }, skipLocationChange: true });
          }
        })
    }
  }

  onCancelClick() {
    this.router.navigate(['/rems/premiseView'], { queryParams: { status: "Amenities & Infrastructure" }, skipLocationChange: true });

  }

  getAmenitiesType() {
    this.remsService.getAmenitiesTypeDD()
      .subscribe(result => {
        let data = result.data;
        this.amentiesList = data;
      })
  }


  getRefType() {
    this.remsService.getRefType(this.premiseId)

      .subscribe((result) => {
        this.refTypeData = result.data
      })
  }
  getRefIdValue(refType) {
    if (refType.value) {
      this.refTypeID = refType.value;
    } else {
      this.refTypeID = refType;
    }
    this.remsService2.getRefTypeId(this.refIdValue, this.refTypeID)
      .subscribe((result) => {
        this.refTypeIdData = result.data
      })
  }

}

