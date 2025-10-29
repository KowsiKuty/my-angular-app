import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import  {DataService} from '../../service/data.service'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.scss']
})
export class CreateBankComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  bankAddForm: FormGroup;
  disableSubmit = true;

  constructor(private formBuilder: FormBuilder, private atmaService: AtmaService, private toastr: ToastrService,
    private router: Router, private notification: NotificationService,private dataService:DataService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.bankAddForm = this.formBuilder.group({
     
      name: ['', Validators.required]
    })
  }
  createFormat() {
    let data = this.bankAddForm.controls;
    let objBank = new Bank();
   
    objBank.name = data['name'].value;
    console.log("objBank", objBank)
    return objBank;
  }

  submitForm() {
    // this.disableSubmit = true;
    if(this.bankAddForm.get('name').value=='' || this.bankAddForm.get('name').value==null || this.bankAddForm.get('name').value==undefined || this.bankAddForm.get('name').value==""){
      this.notification.showError('Please Fill Bank Field');
      return false;
    }
    this.dataService.isLoading.next(true)
    if(this.bankAddForm.valid){
      this.spinner.show();
    this.atmaService.createBankForm(this.createFormat())
      .subscribe(res => {
        this.spinner.hide();
        console.log("res", res)
        let code = res.code
        if (code === "INVALID_DATA") {
          this.notification.showWarning(res.description)
          this.disableSubmit = false;
        } 
        else if (code === "UNEXPECTED_ERROR" && res.description === "NOT ALLOWED TO CREATE BANK") {
          this.notification.showError("NOT ALLOWED TO CREATE BANK  IN 'PROD' ENVIRONMENT")
          this.disableSubmit = false;

        }
        else if(code === "INVALID_BANK_ID"){
          this.notification.showWarning(res.description)
          this.disableSubmit = false;

        }
        else if(code ==="DUPLICATE BANK"){
          this.notification.showWarning(res.description)
          this.disableSubmit = false;
        }
        else if(res['status']=='success'){
          this.notification.showSuccess(res.message)
        this.onSubmit.emit();
        this.dataService.isLoading.next(false)
        }
        else {
          this.notification.showWarning(res['code']);
          this.notification.showWarning(res['description']);
          // this.onSubmit.emit();
          // this.dataService.isLoading.next(false)
        }
      }
      )
    } else{
      this.notification.showError(("INVALID_DATA..."))
      this.disableSubmit = false;
    }
  }
  keypressnodigit(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
   
    if (((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32 || charCode === 45)) {
      return true;
    }
    
    return false;
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}
class Bank {
  code: string;
  name: string;

}
