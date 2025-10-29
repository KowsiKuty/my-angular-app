import { Component,EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';
import {ShareService} from '../share.service'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-designation-edit',
  templateUrl: './designation-edit.component.html',
  styleUrls: ['./designation-edit.component.scss']
})
export class DesignationEditComponent implements OnInit {
  @Output() onCancel=new EventEmitter<any>();
  @Output() onSubmit=new EventEmitter<any>();
  createdesignation:any=FormGroup;
  constructor(private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService,
    private shareservice:ShareService,private spinner:NgxSpinnerService) { }
  

  ngOnInit(): void {
    this.createdesignation=this.fb.group({
      'code':['',Validators.required],
      'name':['',Validators.required]
    });
    let data:any=this.shareservice.designationValue.value;
    console.log('eeeeeeeeeeee==',data);
    this.createdesignation.patchValue({
      'name':data.name,
      'code':data.code
    });
  }
  submitform(){
    if(this.createdesignation.get('name').value.toString().trim()=='' || this.createdesignation.get('name').value==undefined || this.createdesignation.get('name').value=='' || this.createdesignation.get('name').value==null){
      this.Notification.showError('Please Enter The Designation Name');
      return false;
    };
    // if(this.createdesignation.get('code').value.toString().trim()=='' || this.createdesignation.get('code').value==undefined || this.createdesignation.get('code').value=='' || this.createdesignation.get('code').value==null){
    //   this.Notification.showError('Please Enter The Designation Code');
    //   return false;
    // };
    let iddata:any=this.shareservice.designationValue.value;
    let data:any={
      'id':iddata.id,
      "name":this.createdesignation.get('name').value.toString().trim(),
      // 'code':this.createdesignation.get('code').value
    };
    this.spinner.show();
    this.masterservice.getdesignationcreate(data).subscribe(result=>{
      this.spinner.hide();
      console.table("result", result)
      if (result.code === "INVALID_DATA") {
        this.Notification.showWarning(result.description)
      }
      else if (result.code === "Duplicate Name") {
        this.Notification.showWarning(result.description)
      } 
      else if (result.code === "UNEXPECTED_ERROR") {
        this.Notification.showWarning(result.description)
      }else {
        this.Notification.showSuccess("Updated Successfully")
        this.onSubmit.emit();
      }
    })
  };
  clickcancel(){
    this.onCancel.emit();
  }
  keypressnodigit(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123)) {
  //     return false;
  //   }
  //   return true;
  // }
   
  if ( ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32 || charCode === 45) ) {
    return true;
  }
  return false;
}
}
