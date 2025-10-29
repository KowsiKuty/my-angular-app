import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { BrsApiServiceService } from '../brs-api-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';  


@Component({
  selector: 'app-newtemplatecreate',
  templateUrl: './newtemplatecreate.component.html',
  styleUrls: ['./newtemplatecreate.component.scss']
})
export class NewtemplatecreateComponent implements OnInit {

  userTable: FormGroup;
  control: FormArray;
  brsformdata: FormGroup;
  newcbsform: FormGroup;
  mode: boolean;
  shownwisefin= false;
  showbnkstmt = false;
  touchedRows: any;
  el: any;
  dragger: any;
  // bgcolor: any = "black";
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  accounts:any;
  singleColumn : boolean = false;
  multiColumns : boolean = false;
  uploadedFileName: any;


  constructor(private fb: FormBuilder, private notification: NotificationService, private brsService: BrsApiServiceService,
    private router: Router, config: NgbCarouselConfig) { }

  ngOnInit(): void {

    this.touchedRows = [];
    this.userTable = this.fb.group({
      description:null,
      gl_date:null,
     
      credit_amount:null,
      debit_amount:null,
      running_balance:null,
      amount:null,
      //mount_type:1,
      credit_name:null,
      debit_name:null,
      source : null,
      category:null,
      gl_doc_no:null,
      user_name:null,
      invoice_no:null,      
      ref_1:1,
      pv_no:null,
      amount_type: null,
      amount_types:null,
      credit_debit:null,
      date:null,
      cheque_no: null,
      customer_ref_no: null,
      branch_code:''



      

    });
    // this.addRow();
this.newcbsform=this.fb.group({
  account_number:null,
  branch_code:null,
  narration:null,
  dr_cr:null,
  amount:null
})
    this.brsformdata = this.fb.group({
      // glnumber: null,
      // templatecr: null,
      template_name: null,
      account_id: 1,
    })
    let id=1;
    this.brsService.getaccountdata(id)
      .subscribe(result => {
        this.accounts= result['data']
  
  
      })

   

  }

  submitsForm()
  {
    console.log(this.newcbsform.value,'formvalue')
   let validation=this.brsformdata.get('template_name').value
   if(validation===''||validation===null||validation===undefined){
    this.notification.showError('Enter template name')
    return
   }
   let daynamicdata=''
    this.brsService.defineTemplatesBank(this.brsformdata.value, this.newcbsform.value,daynamicdata,'').subscribe(results => {
      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess("Template Created Successfully...") 
        this.goback()
      }
      else {
        this.notification.showError(results.description)
      }
    })
  }

  goback()
  {
    this.router.navigate(['brs/brsmaster'],{queryParams: {key:'back'},skipLocationChange: true});  
  }
  changeColumn(event)
  {
    if(this.userTable.controls['amount_types'].value == 1)
    {
      // this.userTable.controls['amount_type'].value  === 1
      let val : number = 1
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      this.userTable.get('amount_type').setValue(val); 
      this.singleColumn = true;
      this.multiColumns = false;
    }
    if(this.userTable.controls['amount_types'].value == 0)
    {
      let newValue : number = 0 ; 
      let vals = "type";
      // this.userTable.controls['amount_type']. = newValue;
      // this.userTable.get('credit_debit').setValue(vals); 
      this.userTable.get('amount_type').setValue(newValue); 
      // this.userTable.controls['amount_type'].value  === 0
      this.singleColumn = false;
      this.multiColumns = true;
    }
  }
  wisefinfileupload(e){
    console.log(e)
    const file = e.target.files[0];
        if (file) {
          this.uploadedFileName = file.name;
        }
      }
      deleteFile() {
        this.uploadedFileName = null;
      }
}
