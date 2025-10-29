import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RemsService } from '../rems.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-licensetype',
  templateUrl: './licensetype.component.html',
  styleUrls: ['./licensetype.component.scss']
})
export class LicensetypeComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  LicenseTypeForm: FormGroup
  LicenseTypeList=[{'id':'1', 'name':0,'show':'License'},{'id':'2', 'name':1,'show':'Certificate'}];
  constructor(private fb: FormBuilder,private router: Router,
    private remsservice: RemsService,private notification: NotificationService,private toastr: ToastrService) { }
    ngOnInit(): void {
      this.LicenseTypeForm = this.fb.group({
        //code: ['', Validators.required],
        name: ['', Validators.required],
        type: ['', Validators.required],
      })
    }
    LicenseTypeCreateForm(){
      if (this.LicenseTypeForm.value.name.trim()===""){
        this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
        // this.onCancel.emit()
        return false;
      }
      if (this.LicenseTypeForm.value.type===""){
        this.toastr.error('Add type Field','Empty value inserted' ,{timeOut: 1500});
        // this.onCancel.emit()
        return false;
      }
      // if (this.LicenseTypeForm.value.type.trim()===""){
      //   this.toastr.error('Add type Field','Empty value inserted' ,{timeOut: 1500});
      //   // this.onCancel.emit()
      //   return false;
      // }
      // if (this.LicenseTypeForm.value.name.trim().length > 20){
      //   this.toastr.error('Dont Enter more than 20 characters','Limited characters allowed' ,{timeOut: 1500});
      //   // this.onCancel.emit()
      //   return false;
      // }
      let data = this.LicenseTypeForm.value
      this.remsservice.licenseCreateForm(data)
      .subscribe(res => {
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();          
          return true
          })
    }
    omit_special_char(event)
    {   
       var k;  
       k = event.charCode;  
       return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
    }
    onCancelClick() {
      this.onCancel.emit()
    }
} 