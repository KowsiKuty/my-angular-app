import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { masterService } from '../master.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-create-designation',
  templateUrl: './create-designation.component.html',
  styleUrls: ['./create-designation.component.scss']
})
export class CreateDesignationComponent implements OnInit {
  @Output() onCancel=new EventEmitter<any>();
  @Output() onSubmit=new EventEmitter<any>();
  createdesignation:any=FormGroup;
  constructor(private fb:FormBuilder,private Notification:NotificationService,private masterservice:masterService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.createdesignation=this.fb.group({
      'code':['',Validators.required],
      'name':['',Validators.required]
    });
  }
  submitform(){
    if(this.createdesignation.get('code').value.toString().trim()=='' || this.createdesignation.get('code').value==undefined || this.createdesignation.get('code').value=='' || this.createdesignation.get('code').value==null){
      this.Notification.showError('Please Enter The Designation code');
      return false;
    }
    if(this.createdesignation.get('name').value.toString().trim()=='' || this.createdesignation.get('name').value==undefined || this.createdesignation.get('name').value=='' || this.createdesignation.get('name').value==null){
      this.Notification.showError('Please Enter The Designation Name');
      return false;
    }  
    let data:any={
      "name":this.createdesignation.get('name').value.toString().trim(),
      'code':this.createdesignation.get('code').value
    };
    this.spinner.show();
    this.masterservice.getdesignationcreate(data).subscribe(res=>{
      console.table("result", res)
      this.spinner.hide();
      if (res.status === "success") {
        this.Notification.showSuccess(res.message)
        this.onSubmit.emit();
      } 
      else {
        this.Notification.showWarning(res.description)
      }
    })
  };
  clickcancel(){
    this.onCancel.emit();
  }
  keypressnodigit(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
   
    if (((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32 || charCode === 45)) {
      return true;
    }
    
    return false;
  }
  keypresscode(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
   
    if (((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >=48 && charCode <=57) ||charCode === 32 || charCode === 45)) {
      return true;
    }
    
    return false;
  }
}
