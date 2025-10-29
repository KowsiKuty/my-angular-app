import { Component, OnInit,Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { Location } from '@angular/common'


import { BrsApiServiceService } from '../brs-api-service.service';


@Component({
  selector: 'app-createaccount',
  templateUrl: './createaccount.component.html',
  styleUrls: ['./createaccount.component.scss']
})
export class CreateaccountComponent implements OnInit {
  router: any;
  

  constructor(private formBuilder: FormBuilder, private brsService: BrsApiServiceService,
    private notification: NotificationService, private location: Location) { }

  AddForm: FormGroup;
  accounteditform: FormGroup;
  summarylists=[];
  @ViewChild('closebuttons') closebuttons; 
  has_next=true;
  has_previous=true;
  currentpage=1;
  pagesize = 10;

  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  ngOnInit(): void {

    this.AddForm = this.formBuilder.group({
      acc_no:'',
      acc_name:'',
      acc_description:'',
    })

    this.accounteditform = this.formBuilder.group({
      acc_no:'',
      acc_name:'',
      acc_description:'',
      id:''
    })
    


    this.getaccdata();
  }


  getaccdata() {

    this.brsService.getaccountdata(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylists = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  deleteaccount(value)
  {
    this.brsService.deleteaccounts(value).subscribe(results => {
      if (results.status == 'Successfully Updated') {
        this.notification.showSuccess("Account Updated Successfully...")
      
      }
      else {
        this.notification.showError(results.description)

      }
    })
  }

  submitForm() {

    // this.brsService.accountS(this.AddForm.value)
    this.brsService.accountS(this.AddForm.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Account Added Successfully ...")
        this.getaccdata();
        this.AddForm.reset();
      }
      else {
        this.notification.showError(results.description)

      }
    })

  }

  accountedit(data)
  {

    this.accounteditform.patchValue({
      acc_no: data.acc_no,
      acc_name: data.acc_name,
      acc_description:data.acc_description,
      id: data.id
     })

  }
  editForm()
  {

    if(this.accounteditform.value.acc_no == '' || this.accounteditform.value.acc_no == null){
      console.log(this.accounteditform.value.acc_no)
      this.notification.showError('Please Enter Account Number')
      throw new Error;
    }
    if(this.accounteditform.value.acc_name == '' || this.accounteditform.value.acc_name == null){
      console.log(this.accounteditform.value.acc_name)
      this.notification.showError('Please Enter Account Name')
      throw new Error;
    }
    if(this.accounteditform.value.acc_description == '' || this.accounteditform.value.acc_description == null){
      console.log(this.accounteditform.value.acc_description)
      this.notification.showError('Please Enter Account Description')
      throw new Error;
    }

    this.brsService.accountSedit(this.accounteditform.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Account Updated Successfully ...")
        this.closebuttons.nativeElement.click();
        this.getaccdata();
      }
      else {
        this.notification.showError(results.description)

      }
    })
  

  }

  backtoMaster()
  {
    // this.router.navigate(['/brsmaster'],{}); 
    this.location.back()
  }

  nextpage(){
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.getaccdata()
  }

  prevpage(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
    this.getaccdata()
  }

  

}
