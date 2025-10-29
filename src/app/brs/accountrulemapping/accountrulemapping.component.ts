import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';


import { BrsApiServiceService } from '../brs-api-service.service';

@Component({
  selector: 'app-accountrulemapping',
  templateUrl: './accountrulemapping.component.html',
  styleUrls: ['./accountrulemapping.component.scss']
})
export class AccountrulemappingComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private brsService: BrsApiServiceService,
    private notification: NotificationService) { }

  AddForm: FormGroup;
  accountmapeditform: FormGroup;
  
  AddForms: FormGroup;

  summarylists=[];
  accounts: any;
  templates: any;
  gtemplates: any;

  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  ngOnInit(): void {

    this.AddForm = this.formBuilder.group({
      account_id:null,
      template_id:null,
      description:null,
      ledger_template_id:null
    })

    this.AddForms = this.formBuilder.group({
      account_id:null,
      template_id:null,
      description:null,
      ledger_template_id:null
    })

    this.accountmapeditform = this.formBuilder.group({
      account_name:null,
      template_name:null,
      description:null,
      ledger_template_id:null,
      id:null,
      account_no:null

    })


    this.getaccdata();

    let id = 1;
    this.brsService.getaccountdata(id)
      .subscribe(result => {
        this.accounts= result['data']
  
  
      })
      //gettemplates
      let idss = 1;
      this.brsService.gettemplates(idss)
        .subscribe(result => {
          this.templates= result['data']
    
    
        })
      let ids = 1;
      this.brsService.Ggettemplates(ids)
        .subscribe(result => {
          this.gtemplates= result['data']
    
    
        })
    // this.brsService.accountS
  }


  getaccdata() {

    this.brsService.getaccountmapping(this.pagination.index).subscribe(results => {
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
    this.brsService.deleteaccountmapping(value).subscribe(results => {
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
    this.brsService.addAccountMap(this.AddForm.value).subscribe(results => {
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

  submitForms() {

    // this.brsService.accountS(this.AddForm.value)
    this.brsService.addAccountMap(this.AddForms.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Account Added Successfully ...")
        this.getaccdata();
        this.AddForms.reset();
      }
      else {
        this.notification.showError(results.description)

      }
    })

  }

  accounttempMapedit(data)
  {
    this.accountmapeditform.patchValue({
      account_name: data.account_name,
      template_name: data.template_name,
      description:data.description,
      ledger_template_id:data.ledger_template_id,
      id: data.id,
      account_no: data.account_no
  
     })

  }

  editForm()
  {
    this.brsService.addAccountMap(this.accountmapeditform.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Account Updated Successfully ...")
        // this.closebuttons.nativeElement.click();
        this.getaccdata();
      }
      else {
        this.notification.showError(results.description)

      }
    })


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
