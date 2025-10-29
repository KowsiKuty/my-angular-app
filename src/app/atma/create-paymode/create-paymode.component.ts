import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-paymode',
  templateUrl: './create-paymode.component.html',
  styleUrls: ['./create-paymode.component.scss']
})
export class CreatePaymodeComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  paymodeAddForm: FormGroup;
  disableSubmit = true;

  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService,private toastr: ToastrService,
    private notification: NotificationService,private router: Router,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.paymodeAddForm = this.formBuilder.group({
     
      name: ['', Validators.required],
      code:['',Validators.required]
        });
  }
  createFormat() {
    let data = this.paymodeAddForm.controls;
    let objPaymode = new paymode();
    objPaymode.code=data['code'].value;
    objPaymode.name = data['name'].value;
    console.log("objPaymode", objPaymode)
    return objPaymode;
  }

  submitForm() {
    if(this.paymodeAddForm.get('code').value.toString().trim()=='' || this.paymodeAddForm.get('code').value==undefined || this.paymodeAddForm.get('code').value==null){
      this.notification.showError('Please Enter The code');
      return false;
    }
    if(this.paymodeAddForm.get('name').value.toString().trim()=='' || this.paymodeAddForm.get('name').value==undefined || this.paymodeAddForm.get('name').value==null){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    this.spinner.show();
    this.atmaService.createpaymodeForm(this.createFormat()).subscribe(res => {
    this.spinner.hide();  
          if (res.status === "success") {
            this.notification.showSuccess(res.message)
            this.onSubmit.emit();
          } 
          else {
            this.notification.showWarning(res.description)
            this.disableSubmit = false;
          }
        
      }
      )
   
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
class paymode {
  code: string;
  name: string;
}
