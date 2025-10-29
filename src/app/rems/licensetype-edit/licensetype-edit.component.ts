import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsShareService } from '../rems-share.service'
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-licensetype-edit',
  templateUrl: './licensetype-edit.component.html',
  styleUrls: ['./licensetype-edit.component.scss']
})
export class LicensetypeEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  LicenseTypeeditForm: FormGroup
  LicenseTypeList = [{ 'id': '1', 'name': 0, 'show': 'License' }, { 'id': '2', 'name': 1, 'show': 'Certificate' }];
  constructor(private fb: FormBuilder, private router: Router,
    private remsservice: RemsService, private shareservice: RemsShareService,
    private notification: NotificationService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.LicenseTypeeditForm = this.fb.group({
      //code: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
    })
    this.getLicenseEdit();
  }
  getLicenseEdit() {
    let id = this.shareservice.licensetypeEditValue.value
    this.remsservice.getLicenseEdit(id)
      .subscribe((results: any) => {
        let Name = results.name;
        let Type = results.type;
        // let Code=results.code;
        this.LicenseTypeeditForm.patchValue({
          // code: Code,
          name: Name,
          type: Type,
        })
      })
  }
  LicenseTypeediteForm() {
    // if (this.producttypeeditForm.value.name===""){
    //   this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
    //   // this.onCancel.emit()
    //   return false;
    // }
    // if (this.producttypeeditForm.value.productcategory_id===""){
    //   this.toastr.error('Add productcategory Field','Empty value inserted' ,{timeOut: 1500});
    //   // this.onCancel.emit()
    //   return false;
    // }
    if (this.LicenseTypeeditForm.value.name.trim() === "") {
      this.toastr.error('Add name Field', 'Empty value inserted', { timeOut: 1500 });
      // this.onCancel.emit()
      return false;
    }
    // if (this.LicenseTypeeditForm.value.name.trim().length > 20) {
    //   this.toastr.error('Dont Enter more than 20 characters', 'Limited characters allowed', { timeOut: 1500 });
    //   // this.onCancel.emit()
    //   return false;
    // }
    else if (this.LicenseTypeeditForm.value.type === "") {
      this.toastr.error('Add name Field', 'Empty value inserted', { timeOut: 1500 });
      // this.onCancel.emit()
      return false;
    }
    let idValue: any = this.shareservice.licensetypeEditValue.value
    let data = this.LicenseTypeeditForm.value
    this.remsservice.editLicenseForm(data, idValue.id)
      .subscribe(res => {
        this.notification.showSuccess("Saved Successfully!...")
        this.onSubmit.emit();
        return true
      })
  }
  onCancelClick() {
    this.onCancel.emit()
  }
} 