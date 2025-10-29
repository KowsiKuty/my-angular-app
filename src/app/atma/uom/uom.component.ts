import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss']
})
export class UomComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  uomForm: FormGroup;
  disableSubmit = true;
  
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.uomForm = this.fb.group({
      code:['',Validators.required],
      name: ['', Validators.required],
    })
  }
  uomCreateForm() {
    console.log(this.uomForm.value);
    if(this.uomForm.get('code').value.toString().trim()=='' || this.uomForm.get('code').value==undefined || this.uomForm.get('code').value==null){
      this.notification.showError('Please Enter The Code');
      return false;
    }
    if(this.uomForm.get('name').value.toString().trim()=='' || this.uomForm.get('name').value==undefined || this.uomForm.get('name').value==null){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    // this.disableSubmit = true;
    // if(this.uomForm.valid){
      let data:any={
        'code':this.uomForm.get('code').value.toString().trim(),
        'name':this.uomForm.get('name').value.toString().trim()
      };
      console.log(data);
      this.spinner.show();
    this.atmaService.uomCreateForm(data)
      .subscribe(res => {
       this.spinner.hide()
       if (res.status === "success") {
        this.notification.showSuccess(res.message)
        this.onSubmit.emit();
      } 
      else {
        this.notification.showWarning(res.description)
        this.disableSubmit = false;
      }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
        this.spinner.hide();
      }
      );
    // } else {
      //   this.notification.showError("INVALID_DATA!...")
      //   this.disableSubmit = false;
      // }
  }

  onCancelClick() {
    this.onCancel.emit()
  }
  omit_special_char(event)
  {   
    var k;  
    k = event.charCode;  
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  

}
