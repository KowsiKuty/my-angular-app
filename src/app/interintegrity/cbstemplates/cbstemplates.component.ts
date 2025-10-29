import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { InterintegrityApiServiceService } from '../interintegrity-api-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Cbstemplate } from '../models/cbstemplate';

import { MatPaginator, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-cbstemplates',
  templateUrl: './cbstemplates.component.html',
  styleUrls: ['./cbstemplates.component.scss']
})
export class CbstemplatesComponent implements OnInit {

  constructor(private fb: FormBuilder, private notification: NotificationService, private interService: InterintegrityApiServiceService,
    private router: Router,  private SpinnerService: NgxSpinnerService) { }

    summarylist = [];
    summaryslist = [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }

  displayedColumns: string[] = [ 'template_name', 'account_number','running_balance', 'edit', 'status'];

  public dataSource : MatTableDataSource<Cbstemplate>;

  public dataArray : any;

  pageSize = 10;

  totalRecords = 0;

  pageIndex = this.pagination.index;

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
  primary : any;
  options : any;
  serverValues: any;
  selectedValue: any;

  ngOnInit(): void {

    this.gettemplatedata();

    this.datassearch = this.fb.group({
      template_name: '',
      account_name:'',
      // delims:'',
      status:'',
    })

    this.templateeditform = this.fb.group({
      line_description:null,
      description : null,
      date:null,
      customer_ref_no:null,
      payment_date:null,
      transaction_date:null,
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
      journal_name:null,
      account_description:null,
      amount_type:null,
      credit_debit:null,
      amount_types:null,
      account_number:'',
      id:'',
      template_name:'',
      multiplier: '',
      branch_code:''
    });


 

  }

  gettemplatedata() {

    this.interService.gettemplates(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;

      this.dataArray = results['data'] ;
      this.dataSource = new MatTableDataSource<Cbstemplate> (this.dataArray);
    })
  }

  deletetemplate(value)
  {
    this.interService.deletetemplates(value).subscribe(results => {
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
    this.interService.Btemplatedate(val).subscribe(results => {
      this.SpinnerService.hide();
      this.summaryslist = results['data'];
  
  
      this.pagination = results.pagination ? results.pagination : this.pagination;
    
  })

  }
  opennewtemplates()
  {
    this.router.navigate(['interintegrity/newcbstemp'],{});  
  }
  editDatas(data)
  {
    console.log("FROM DB TEMPLATTE",data)
    this.templateeditform.patchValue({
      id: data.id,
      account_number:data.account_number,
      running_balance: data.running_balance,
      description: data.description,
      date: data.date,
      credit_debit: data.credit_debit,
      debit_name: data.debit_name,
      credit_name: data.credit_name,
      template_name: data.template_name,
      multiplier : data.multiplier,
      amount_type: data.amount_type,
      amount_types:data.amount_types,
      branch_code: data.branch_code,
      
     })
     this.serverValues = data.amount_types

      // this.amount_types = 0;
     this.changeColumn(event);


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

  changeColumn(event)
  {
    if(this.templateeditform.controls['amount_type'].value == 0)
    {
      let val : number = 1
      // let newValue : number = parseInt(val); 
      // this.userTable.controls['amount_type']. = newValue;
      
      this.singleColumn = true;
      this.multiColumns = false;
      // this.templateeditform.get('amount_type').setValue(val); 
    }
    if(this.templateeditform.controls['amount_type'].value == 1)
    {
      let newValue : any = "" ; 
      let vals = "type";
      // this.userTable.controls['amount_type']. = newValue;
      // this.userTable.get('credit_debit').setValue(vals); 

      // this.templateeditform.get('credit_debit').setValue(newValue); 
      // this.templateeditform.get('credit_name').setValue(newValue); 
      // this.templateeditform.get('debit_name').setValue(newValue); 
      this.singleColumn = false;
      this.multiColumns = true;
      // this.templateeditform.get('amount_type').setValue(newValue); 

    }
  }


  UpdateForms()
  {
    this.interService.templateSStmtedit(this.templateeditform.value).subscribe(results => {
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

  prevpage()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
    }
    this.gettemplatedata();


  }
  nextpage()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.gettemplatedata();
  }




}
