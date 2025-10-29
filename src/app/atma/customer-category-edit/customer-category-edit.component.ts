import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { from } from 'rxjs';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customer-category-edit',
  templateUrl: './customer-category-edit.component.html',
  styleUrls: ['./customer-category-edit.component.scss']
})
export class CustomerCategoryEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  CustomerCategoryEditForm: FormGroup;
disableSubmit = true;
  
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService, private sharedService: ShareService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.CustomerCategoryEditForm = this.fb.group({
      name: ['', Validators.required],
      code:['']
    })
    this.getCustomerCatEdit();
  }

  getCustomerCatEdit(){
    let id = this.sharedService.customerCategoryEdit.value
    console.log("getCustomerCatEdit Edit", this.sharedService.customerCategoryEdit.value)
    this.atmaService.getCustomerCatEdit(id)
      .subscribe((result: any)  => {
        let Name = result.name; 
        let Code =result.code    
        this.CustomerCategoryEditForm.patchValue({
          name: Name,
          code:Code
        })
      })
  }

  CustomerCategoryEditFormSubmit(){
    if(this.CustomerCategoryEditForm.get('name').value.toString().trim()=='' || this.CustomerCategoryEditForm.get('name').value==undefined || this.CustomerCategoryEditForm.get('name').value=='' || this.CustomerCategoryEditForm.get('name').value==null){
      this.notification.showError('Please Enter The CustomCategory Name');
      return false;
    }
this.disableSubmit = true;
    let idValue: any = this.sharedService.customerCategoryEdit.value
    let data :any={
      "name":this.CustomerCategoryEditForm.get('name').value.toString().trim(),
      // 'code':this.CustomerCategoryEditForm.get('code').value
    }
    this.spinner.show();
    this.atmaService.editCustomerCatEdit(data, idValue.id).subscribe(result => {
    this.spinner.hide(); 
    if(result.status === "success"){
      this.notification.showSuccess("Updated Successfully");
      this.onSubmit.emit();
    }
      else {
          this.notification.showWarning(result.description)
          this.disableSubmit = false;
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
