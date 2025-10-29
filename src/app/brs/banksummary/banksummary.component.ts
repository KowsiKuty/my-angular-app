import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { BrsApiServiceService } from '../brs-api-service.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-banksummary',
  templateUrl: './banksummary.component.html',
  styleUrls: ['./banksummary.component.scss']
})
export class BanksummaryComponent implements OnInit {

  constructor(private fb: FormBuilder, private notification: NotificationService, private brsService: BrsApiServiceService,
    private router: Router,  private SpinnerService: NgxSpinnerService) { }

    summarylist = [];
    summaryslist = [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }

  datassearch: FormGroup;
  templateeditform: FormGroup;

  accounts: any;
  templates : any;
  Column_type: string;
  ctypes : string[] = ['Single Column', 'Seperate Column'];
  singleColumn : boolean = false;
  multiColumns : boolean = false;
  amount_type: any;
  amount_types: any;

  ngOnInit(): void {

    this.gettemplatedata();

    this.datassearch = this.fb.group({
      template_name: '',
      account_name:'',
      // delims:'',
      status:'',
    })

    this.templateeditform = this.fb.group({
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
      transaction_date:null,      
      id:'',
      template_name:'',
      cheque_no: null,
      customer_ref_no: null,
      branch_code: null
    });

  }

  gettemplatedata() {

    this.brsService.gettemplates(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  deletetemplate(value)
  {
    this.brsService.deletetemplates(value).subscribe(results => {
      if (results.status == 'Successfully Updated') {
        this.notification.showSuccess("Template  Successfully Updated...")
      
      }
      else {
        this.notification.showError(results.description)

      }
    })
  }

  viewsinglerecord(val)
  {
    this.brsService.Btemplatedate(val).subscribe(results => {
      this.SpinnerService.hide();
      this.summaryslist = results['data'];
  
  
      this.pagination = results.pagination ? results.pagination : this.pagination;
    
  })

  }
  opennewtemplates()
  {
    this.router.navigate(['brs/newtemp'],{});  
  }
  editDatas(data)
  {
    console.log(data)
    this.templateeditform.patchValue({
      description:data.description,
      gl_date:data.gl_date,
     
      credit_amount:data.credit_amount,
      debit_amount:data.debit_amount,
      running_balance:data.running_balance,
      amount:data.amount,
      //mount_type:1,
      credit_name:data.credit_name,
      debit_name:data.debit_name,
      source : data.source,
      category:data.category,
      gl_doc_no:data.gl_doc_no,
      user_name:data.user_name,
      invoice_no:data.invoice_no,      
      ref_1:data.ref_1,
      pv_no:data.pv_no,
      amount_type: data.amount_type,
      amount_types:data.amount_types ? data.amount_types:0,
      credit_debit:data.credit_debit,
      transaction_date:data.transaction_date,   
      id: data.id,
      template_name: data.template_name,
      cheque_no: data.cheque_no,
      customer_ref_no: data.customer_ref_no,
      branch_code: data.branch_code
     })

      // this.amount_types = 0;
     this.changeColumn();


  //   this.brsService.getNsingletemplate(data).subscribe(results => {
  //     if (!results) {
  //       return false;
  //     }
  //     this.singleList = results['data'];
   
  //     this.pagination = results.pagination ? results.pagination : this.pagination;

  // })
}

inputColumns(event)
  {
    if(this.Column_type == "Single Column")
    {
      this.singleColumn = true;
      
    }
  }

  changeColumn()
  {
    if(this.templateeditform.controls['amount_types'].value == 1)
    {
      let val : number = 1
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      this.templateeditform.get('amount_type').setValue(val); 
      this.singleColumn = true;
      this.multiColumns = false;
    }
    if(this.templateeditform.controls['amount_types'].value == 0)
    {
      let newValue : number = 0 ; 
      let vals = "type";
      // this.userTable.controls['amount_type']. = newValue;
      // this.userTable.get('credit_debit').setValue(vals); 
      this.templateeditform.get('amount_type').setValue(newValue); 
      this.singleColumn = false;
      this.multiColumns = true;

    }
  }

  UpdateForms()
  {
    this.brsService.templateSStmtedit(this.templateeditform.value).subscribe(results => {
      if (results.status == 'success') {
        this.notification.showSuccess("Template Updated Successfully ...")
        // this.closebuttons.nativeElement.click();
        this.gettemplatedata();
      }
      else {
        this.notification.showError(results.description)

      }
    })
  }

  prevpages()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
      console.log('previous', this.pagination.index)
    }
    this.searchpagination(this.pagination.index)
  }
  nextpages()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
   this.searchpagination(this.pagination.index)
  
  }
  searchpagination(page){
    this.gettemplatedata()
  }

}
