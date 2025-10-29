import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { from } from 'rxjs';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ShareService } from '../share.service'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-uom-edit',
  templateUrl: './uom-edit.component.html',
  styleUrls: ['./uom-edit.component.scss']
})
export class UomEditComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  uomEditForm: FormGroup;
  disableSubmit = true;
  
  constructor(private fb: FormBuilder, private atmaService: AtmaService, private notification: NotificationService, private sharedService: ShareService,
              private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.uomEditForm = this.fb.group({
      name: ['', Validators.required],
      code:['',Validators.required]
    });
    this.getuomEdit();
  }

  getuomEdit(){
    let id = this.sharedService.uomEdit.value
    console.log("getuomEdit Edit", this.sharedService.uomEdit.value)
    this.atmaService.getuomEdit(id)
      .subscribe((result: any)  => {
        let Name = result.name;
        let Code=result.code;
        this.uomEditForm.patchValue({
          name: Name,
          code:Code
        })
      })
  }


  uomEditFormSubmit(){
    console.log(this.uomEditForm.value);
    if(this.uomEditForm.get('name').value.toString().trim()=='' || this.uomEditForm.get('name').value==undefined || this.uomEditForm.get('name').value==null){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    if(this.uomEditForm.get('code').value.toString().trim()=='' || this.uomEditForm.get('code').value==undefined || this.uomEditForm.get('code').value==null){
      this.notification.showError('Please Enter The Code');
      return false;
    }
    let data:any={
      'name':this.uomEditForm.get('name').value.toString().trim(),
      'code':this.uomEditForm.get('code').value.toString().trim()
    };
    console.log(data);
    let idValue: any = this.sharedService.uomEdit.value
    // let data = this.uomEditForm.value
    this.spinner.show();
    this.atmaService.edituomSubmitEdit(data, idValue.id)
        .subscribe(res => {
          this.spinner.hide();
          if(res.status === "success"){
            this.notification.showSuccess("Updated Successfully");
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
  omit_special_char(event)
  {   
    var k;  
    k = event.charCode;  
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }
  

}