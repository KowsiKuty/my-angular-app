import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SGShareService } from './../share.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SGService } from '../SG.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employeecatmaster',
  templateUrl: './employeecatmaster.component.html',
  styleUrls: ['./employeecatmaster.component.scss']
})
export class EmployeecatmasterComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  Employeecatogory:FormGroup
  empcat:FormControl
  empcatdesc:FormControl
  

  constructor(private fb:FormBuilder,private toast:ToastrService,private router:Router,private  sgservice:SGService,private shareservice:SGShareService,private notification:NotificationService,private toastr: ToastrService) { }

  ngOnInit(): void {

    this.Employeecatogory=this.fb.group({
      empcat:['',Validators.required],
      empcatdesc:['',Validators.required]
    })
    this.getEditemployeecat();
  }
  idValue:any
  getEditemployeecat(){

    let data: any = this.shareservice.employementcat.value;
    console.log("data",data)
    this.idValue = data.id;
    if (data === '') {
      this.Employeecatogory.patchValue({
        empcat: '',
        empcatdesc: '',
      })
    } else {
      this.Employeecatogory.patchValue({
        empcat: data.empcat,
        empcatdesc: data.empcatdesc,
      })
    }

  }

  


  submit:boolean=false

  EmployeeSubmitForm(){
    this.submit=true

    if(this.Employeecatogory.value.empcat==="")
    {
      this.submit=false
      this.toastr.warning('', 'Please Enter Employee category', { timeOut: 1500 });
      return false
    }
    if(this.Employeecatogory.value.empcatdesc==="")
    {
      this.submit=false
      this.toastr.warning('', 'Please Enter Description', { timeOut: 1500 });
      return false
    }
   
    console.log("employCatogory evalue",this.Employeecatogory.value)
    if (this.idValue == undefined) {
      this.sgservice.employeecatCreateForm(this.Employeecatogory.value, '')
        .subscribe(result => {
          if(result.status === "success"){
            this.notification.showSuccess("Successfully created!...")
            this.onSubmit.emit();
            // this.router.navigate(['SGmodule/sgmaster',0], { skipLocationChange: true })
          }
          else {
            this.notification.showError(result.description)
            this.submit = false;
            return false
          } 
        
          this.idValue = result.id;
        })
    } else {
      this.sgservice.employeecatCreateForm(this.Employeecatogory.value, this.idValue)
        .subscribe(result => {
          if(result.status === "success"){
            this.notification.showSuccess("Successfully Updated!...")
            this.router.navigate(['SGmodule/sgmaster',0], { skipLocationChange: true })
          }
          else {
            this.notification.showError(result.description)
            this.submit = false;
            return false
          } 
        
        })
      }
     
  }

  onCancelClick(){
    // this.router.navigate(['SGmodule/sgmaster',0], { skipLocationChange: true })
    this.onCancel.emit();
  }

  keyPressNumbers(event) {
    console.log(event.which)
    var charCode = (event.which) ? event.which : event.keyCode;
    console.log(event.keycode)
    // Only Numbers 0-9
    if (event.keyCode==32)
    {
      return true;
    }
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      this.toast.warning('', 'Please Enter the Number only', { timeOut: 1500 });
      return false;
    } else {
      return true;
    }
  }
  keyPressAlpha(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp) ||event.keyCode==32) {
      return true;
    } else {
      event.preventDefault();
      this.toast.warning('', 'Please Enter the Letter only', { timeOut: 1500 });      
      return false;
      
    }
  }
  keyPressAlphanumeric(event)
  {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)||event.keyCode==32  ) {
      return true;
    } else {
      event.preventDefault();
      this.toast.warning('', 'Don\'t Use Extra character ', { timeOut: 1500 });      
      return false;
      
    }
  }


}
