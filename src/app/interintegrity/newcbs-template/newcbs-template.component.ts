import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { InterintegrityApiServiceService } from '../interintegrity-api-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';  

@Component({
  selector: 'app-newcbs-template',
  templateUrl: './newcbs-template.component.html',
  styleUrls: ['./newcbs-template.component.scss']
})
export class NewcbsTemplateComponent implements OnInit {

  userTable: FormGroup;
  control: FormArray;
  brsformdata: FormGroup;
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

  options = [  { key: +1, value: +1 },  { key: -1, value: -1 }];


  constructor(private fb: FormBuilder, private notification: NotificationService, private interService: InterintegrityApiServiceService,
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
      account_number: null,
      multiplier: null,
      branch_code: null



      

    });
    // this.addRow();

    this.brsformdata = this.fb.group({
      // glnumber: null,
      // templatecr: null,
      template_name: null,
      account_id: 1,
    })
    let id=1;
    this.interService.getaccountdata(this.pagination.index)
      .subscribe(result => {
        this.accounts= result['data']
  
  
      })

   

  }

  submitsForm()
  {
    this.interService.defineTemplatesBank(this.brsformdata.value, this.userTable.value).subscribe(results => {



      this.pagination = results.pagination ? results.pagination : this.pagination;

 
      if (results.status == 'success') {
        this.notification.showSuccess("Template Created Successfully...")
      
      }
      else {
        this.notification.showError(results.description)

      }
    })
  }

  goback()
  {
    this.router.navigate(['interintegrity/interintegritymaster'],{});  
  }
  changeColumn(event)
  {
    if(this.userTable.controls['amount_types'].value == 0)
    {
      // this.userTable.controls['amount_type'].value  === 1
      let val : number = 1
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      this.userTable.get('amount_type').setValue(val); 
      this.singleColumn = false;
      this.multiColumns = true;
    }
    if(this.userTable.controls['amount_types'].value == 1)
    {
      let newValue : number = 0 ; 
      let vals = "type";
      // this.userTable.controls['amount_type']. = newValue;
      // this.userTable.get('credit_debit').setValue(vals); 
      this.userTable.get('amount_type').setValue(newValue); 
      // this.userTable.controls['amount_type'].value  === 0
      this.singleColumn = true;
      this.multiColumns = false;
    }
  }


}
