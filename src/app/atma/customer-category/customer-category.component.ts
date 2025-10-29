import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customer-category',
  templateUrl: './customer-category.component.html',
  styleUrls: ['./customer-category.component.scss']
})
export class CustomerCategoryComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  customerCatForm: FormGroup;
  
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.customerCatForm = this.fb.group({
      name: ['', Validators.required],
      code:['',Validators.required]
    })
  }
  customerCatSubmitForm() {
    if(this.customerCatForm.get('code').value.toString().trim()=='' || this.customerCatForm.get('code').value==undefined || this.customerCatForm.get('code').value=='' || this.customerCatForm.get('code').value==null){
      this.notification.showError('Please Enter The CustomCategory code');
      return false;
    }
    if(this.customerCatForm.get('name').value.toString().trim()=='' || this.customerCatForm.get('name').value==undefined || this.customerCatForm.get('name').value=='' || this.customerCatForm.get('name').value==null){
      this.notification.showError('Please Enter The CustomCategory Name');
      return false;
    }
   
    let data:any={
      "name":this.customerCatForm.get('name').value.toString().trim(),
      'code':this.customerCatForm.get('code').value
    };
    this.spinner.show();
    this.atmaService.customerCatCreateForm(data).subscribe(res => {
    this.spinner.hide();  
    if (res.status === "success") {
      this.notification.showSuccess(res.message)
      this.onSubmit.emit();
    } 
    else {
      this.notification.showWarning(res.description)
    }
      })
  }
  onCancelClick() {
    this.onCancel.emit()
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

}