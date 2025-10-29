import { Component, HostListener, OnInit, ViewChild, ChangeDetectorRef , AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { BrsApiServiceService } from '../brs-api-service.service';
import { MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { LedgerData } from '../models/ledger-data';
import { SelectionModel } from '@angular/cdk/collections';
import { BstatementData } from '../models/bstatement-data';
import { Location } from '@angular/common';
import { AutoknockoffData } from '../models/autoknockoff-data';
import { DatePipe } from '@angular/common';
import { interval, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { resourceLimits } from 'worker_threads';
import {MatAccordion} from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-integrity',
  templateUrl: './integrity.component.html',
  styleUrls: ['./integrity.component.scss']
})





export class IntegrityComponent implements OnInit {
  brsconcile: FormGroup;
  wisefinUpload: FormGroup;
  bankstmtupload : FormGroup;
  showfirsttable: boolean = true;
  showknockofftable: boolean = false;
  displaybuttons: boolean = true;
  confirmbutton: boolean = false;
  showuploads: boolean = true;
  confirmknockoff: boolean = false;
  showBRS : boolean = false;
  showGLentry: boolean = true
  Swiper : any;
  templates: any;
  accounts: any;
  ntemplates: any;
  filterForm: FormGroup;
  pipe: DatePipe;
  isExpanded: boolean = true;
  isExpandeds: boolean = true;
  datal: any;
  mirror: any;
  // checkboxLabel: any;
  fileuploadprogress: boolean = false;
  fileuploadcomplete: boolean = false;
  valuess: any;
  subscription: Subscription;
  schedulerstat : any;
  wisefinscheduler: any;
  cbsscheduler: any;
  showstatuss: boolean = true;
  datafromObj: {
   
};
  branchCodeEmp: any;
  currentUser: string;
  empbranchid: any;

  // @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private fb: FormBuilder, private notification: NotificationService, private brsService: BrsApiServiceService,
    private router: Router, config: NgbCarouselConfig, private SpinnerService: NgxSpinnerService, private cdr:ChangeDetectorRef, private location: Location,
    private route: ActivatedRoute , public datepipe: DatePipe
    
    ) { 
     
    
    }
    selectedFile: any = null;

   
    // dataSource : any[] = [];  
  summarylist: any = [];
  summarylists = [];
  knockofflists=[];
  uploadfile: any;
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  account_id: any;
  accountid: any;
  pageEvent : PageEvent;

  displayedColumns: string[] = [ 'gl_date', 'line_description','gl_doc_no', 'credit_amount', 'debit_amount', 'select',];
  displayedColumnss: string[] = [ 'transaction_date','description',  'credit_amount', 'debit_amount', 'select',];  
  displayedCoulmnsA : string[] = ['ref_1','gl_date', 'line_description', 'gl_doc_no','debit_amount_ledger', 'credit_amount_ledger', 'description', 'transaction_date','credit_amount_statement','debit_amount_statement','select'];
  public dataSource : MatTableDataSource<LedgerData>;
  public dataSources : MatTableDataSource<BstatementData>;
  public dataSourceA : MatTableDataSource<AutoknockoffData>;
  selection  = new SelectionModel<LedgerData>(true, []);
  selections  = new SelectionModel<BstatementData>(true, []);
  selectionA = new SelectionModel<AutoknockoffData>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginators: MatPaginator;
  @ViewChild('sortCol1') sortCol1: MatSort;
  @ViewChild('sortCol2') sortCol2: MatSort;

  @ViewChild('pageCol1') pageCol1: MatPaginator;
  @ViewChild('pageCol2') pageCol2: MatPaginator;
  tabLenth: any;
  count: any;
  public selectedVal: string;
  page : any;


  // @ViewChild(MatPaginator, {static: false})
  // set paginator(value: MatPaginator) {
  //   if (this.dataSource){
  //     this.dataSource.paginator = value;
     
  //   }
  // }
  @ViewChild(MatSort) sort: MatSort;
  
  public dataArray : any;
  public dataArrayb : any;
  public dataArrays: any;
  id:any;
  ngOnInit(): void {

    this.brsService.gettemplates(1)
      .subscribe(result => {
        this.templates= result['data'] 
      })

      this.brsService.getaccountdata(1)
      .subscribe(result => {
        this.accounts= result['data'] 
      })
      this.brsService.getNtemplates(1)
      .subscribe(result => {
        this.ntemplates = result['data']
      })

    this.brsconcile = this.fb.group({
      cheque_Fromdate: '',
      cheque_Todate: '',
      chequeNum: '',
      cheq_status: '',
      cusName: '',
      chequeAmount: '',
      bankname: '',
      stmt_Fromdate: '',
      stmt_Todate: '',
      filedata: '',
      cheqNums: '',
      fileinput:'',
      filedatas: '',
      exclude_ledger_id:'',
      exclude_statement_id:'',
      mirror: 0,

    })

    this.wisefinUpload = this.fb.group({
      template_id:'',
      account_id:'',
      filedata:'',
      entry_status:'',
      entry_gl:'',
      fColumnName:null,
      fColumnValue:null,
      fColumnName1:null,
      fColumnValue1:null,
      startDate: null,
      endDate: null,
      acc_id:null
    })
    this.bankstmtupload =  this.fb.group({
      template_id:'',
      account_id:'',
      filedatas:'',
    })

    this.filterForm =  this.fb.group({
      fromDate: '',
      toDate: '',
  });

  this.selectedVal ='inter';

  // this.getSchedulerstatus();


  // this.dataSources.sort =  this.sortBs;


  

    // this.getdataLedger();
    // this.getStmtdata();

    // setTimeout(() => this.dataSource.paginator = this.paginator);
    this.route.paramMap
      .subscribe((params)=> 
      {
        const account_ids = this.route.snapshot.queryParamMap.get('account_id');
        const toDates= this.route.snapshot.queryParamMap.get('toDate');
        const acc_ids = this.route.snapshot.queryParamMap.get('acc_id');
        const fromDates= this.route.snapshot.queryParamMap.get('fromDate');
        console.log(fromDates)
        
        this.wisefinUpload.controls['acc_id'].setValue(acc_ids)
        this.wisefinUpload.controls['account_id'].setValue(account_ids)
        this.wisefinUpload.controls['startDate'].setValue(fromDates)
        this.wisefinUpload.controls['endDate'].setValue(toDates)

        // this.wisefinUpload.setValue('account_id') = account_ids
        // this.page = +params['toDate'] || 0;
        // console.log("DATE PARAM", this.page)
        // console.log("ACCOUNT NUMBER", account_id)
        
      })
    
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator
}
// headerarray =[]
// getAccountTemplate(temp) {
//   this.account_id = temp.id;
  // this.templateId = temp.template.id;
  // this.templateText = temp.template.file_type.text;
  // this.brsService.getaccountdata(temp.account_id)
  // .subscribe(response => {
  //   this.headerarray = response.details;
  // }
  // )
  // console.log("note", this.accountid);
  // console.log("notesss",  this.templateId );
  // console.log("BAAA",temp)

//   return this.account_id
// }

  getdataLedger() {

    this.brsService.getLedgerdata(this.wisefinUpload.value,this.pagination.index, 1).subscribe(results => {
      if (!results) {
        return false;
      }

      this.summarylist = results['data'];
      // this.dataArray = results['data'] ;
      // this.dataSource = new MatTableDataSource<LedgerData> (this.dataArray);
      // this.cdr.detectChanges();
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
   
  }
  get fromDate() { return this.filterForm.get('fromDate'); }
  get toDate() { return this.filterForm.get('toDate'); }

  viewglData()
  {

    if((this.wisefinUpload.controls['account_id'].value)=="")
    {
      this.notification.showError("Select Wisefin Account")
    }
    else{
    this.SpinnerService.show();
    // let accountsId = this.account_id;
    this.brsService.getLedgerdata( this.wisefinUpload.controls['account_id'].value,this.pagination.index, 1).subscribe(results => {
      if (!results) {
        return false;
      }
      this.SpinnerService.hide();

      // this.summarylist = results.count;
      this.dataArray = results['data'] ;
      this.dataSource = new MatTableDataSource<LedgerData> (this.dataArray);
      // this.cdr.detectChanges();
      this.dataSource.paginator = this.pageCol1;
      this.dataSource.sort = this.sortCol1;
      // this.dataSources.data. = this.tabLenth;
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      // this.pagination = results.pagination ? results.pagination : this.pagination;

      
  })
  }
}
  showbrs()
  {
    this.brsconcile.get("mirror").setValue(1);
  }

  showinter()
  {
    this.brsconcile.get("mirror").setValue(0);
  }

  viewbsData()
  {
    // if(this.currentUser == 'admin')
    // {
    //   this.branchCodeEmp = this.brsconcile.controls['branchs'].value;
    // }
    // else
    // {
    //   this.branchCodeEmp = this.empbranchid;
    // }
    if((this.bankstmtupload.controls['account_id'].value)=="")
    {
      this.notification.showError("Select CBS Account")
    }
    else{
    this.SpinnerService.show();
    this.brsService.getStatementdata( this.bankstmtupload.controls['account_id'].value,this.pagination.index, 1).subscribe(results => {
      if (!results) {
        return false;
      }
      this.SpinnerService.hide();
      // this.summarylists = results['data'];
      this.dataArrayb = results['data'] ;
      this.dataSources = new MatTableDataSource<BstatementData> (this.dataArrayb);
      // this.cdr.detectChanges();
      this.dataSources.paginator = this.pageCol2;
      this.dataSources.sort = this.sortCol2;
     
      // this.pagination = results.pagination ? results.pagination : this.pagination;
  })
  }
}
//  ngAfterViewinit()
//  {
 
//  }

  prevpage()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
    }
    this.viewglData()

  }

  nextpage()
  {

    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.viewglData()

  }

  getStmtdata()
  {

    this.brsService.getStatementdata(this.bankstmtupload.value,this.pagination.index, 1).subscribe(results => {
      if (!results) {
        return false;
      }
      // this.dataArrays = results['data'] ;
      // this.dataSources = new MatTableDataSource<BstatementData> (this.dataArrays);
      // this.cdr.detectChanges();
      // this.dataSources.paginator = this.paginator;
      // this.dataSources.sort = this.sort;
      this.summarylists = results['data'];
     
      this.pagination = results.pagination ? results.pagination : this.pagination;
      this.dataSources.filteredData.length = this.tabLenth;
    }) 
  }
  prevpages()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
    }
    this.getStmtdata();

  }

  nextpages()
  {

    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.getStmtdata();

  }

  autoknockoff()
  {
    if(((this.wisefinUpload.controls['account_id'].value)=="")&&(this.bankstmtupload.controls['account_id'].value==""))
    {
      this.notification.showError("Select Wisefin and CBS Accounts")
    }
    else if((this.wisefinUpload.controls['account_id'].value)=="")
    {
      this.notification.showError("Select Wisefin Account")
    }
    else if((this.bankstmtupload.controls['account_id'].value)=="")
    {
      this.notification.showError("Select CBS Account")
    }
  
    else
    {
      
    this.SpinnerService.show();
    let data = {
      ledger_account_id : this.wisefinUpload.controls['account_id'].value,
      statement_account_id : this.bankstmtupload.controls['account_id'].value,
      mirror: this.brsconcile.controls['mirror'].value,
      exclude_ledger_id : '',
      exclude_statement_id:''

    }
    this.isExpandeds = false;
    this.brsService.autoknockoff(this.wisefinUpload.controls['account_id'].value, this.bankstmtupload.controls['account_id'].value,  this.brsconcile.controls['mirror'].value, 1).subscribe(results => {
      this.SpinnerService.hide();
      this.knockofflists = results['data'];
      this.showfirsttable = false;
      this.showknockofftable = true;
      this.displaybuttons = false;
      this.confirmbutton = true;
      this.showuploads = true;
      this.showstatuss = true;

      this.pagination = results.pagination ? results.pagination : this.pagination;

      this.dataArrays = results['data'] ;
      this.dataSourceA = new MatTableDataSource<AutoknockoffData> (this.dataArrays);
      // this.cdr.detectChanges();
      this.dataSourceA.paginator = this.paginator;
      this.dataSourceA.sort = this.sort;

  })
}
      // if (results.status == 'success') {
      //   this.notification.showSuccess("Pickup Scheduled")
      
      // }
      // else {
      //   this.notification.showError(results.description)

      // }
  }
  // autoknockoffM()
  // {

  // }

  prevpagess()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index+1
    }
    this.autoknockoff();
  }
  nextpagess()
  {

    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.autoknockoff();

  }

  confirmsknockoff()
  {
    let data = {
      ledger_account_id : this.wisefinUpload.controls['account_id'].value,
      statement_account_id : this.bankstmtupload.controls['account_id'].value,
      mirror: this.brsconcile.controls['mirror'].value
      // exclude_ledger_id : '',
      // exclude_statement_id:''

    }
    
    this.SpinnerService.show();
    this.brsService.confirmingknockoff(data).subscribe(results => {
      this.SpinnerService.hide();
      // this.knockofflists = results['data'];
      this.showfirsttable = false;
      this.showknockofftable = true;
      this.displaybuttons = false;
      this.confirmbutton = true;
      this.autoknockoff();

      this.pagination = results.pagination ? results.pagination : this.pagination;

 
      if (results.status == 'success') {
        this.notification.showSuccess(results.message)
        this.getSchedulerstatus();
      
      }
      else {
        this.notification.showError(results.description)
        this.getSchedulerstatus();
      }
    })

  }
  onFileSelected(event: any){
    this.selectedFile = event.target.files[0] ?? null;

}
manualknockoff()
{
  let ledgerSelect= [];
  this.selection.selected.forEach(s => ledgerSelect.push(s.id));
  console.log(typeof(ledgerSelect))

  let bankSelect= [];
  this.selections.selected.forEach(l => bankSelect.push(l.id));
  console.log(typeof(bankSelect))
 
  let datas= {data : [
    {
      "bank_stmt_id":bankSelect ,
     
      "ledger_stmt_id":ledgerSelect ,

      "mirror": this.brsconcile.controls['mirror'].value
     
    }
  ]};
  // this.mirror = this.brsconcile.controls['mirror'].value,
  console.log(datas);
  this.SpinnerService.show();
 
  this.brsService.manualKnockoff(datas).subscribe(results => {
    this.SpinnerService.hide();

    if (results.status == 'success') {
      this.notification.showSuccess("Manual KnockOff Completed")
    
    }
    else {
      this.notification.showError(results.description)

    }
  });



}

 toNumber(value) {
  return Number(value);
}
gotoMaster()
{
  this.router.navigate(['brs/brsmaster'],{}); 
}

uploadchoose(evt) {
  this.uploadfile = evt.target.files[0];
  this.bankstmtupload.get('filedatas').setValue(this.uploadfile);

}

uploadchooses(evt) {
  this.uploadfile = evt.target.files[0];
  this.wisefinUpload.get('filedata').setValue(this.uploadfile);

}

bankstmtuploads()
{
  this.SpinnerService.show();
  this.brsService.bankstatementUplaodSchedule(this.bankstmtupload.controls['account_id'].value ,this.bankstmtupload.value, this.bankstmtupload.get('filedatas').value).subscribe(results => { 
    // this.summarylist = results['data'];
    // this.getStmtdata();
    this.SpinnerService.hide();
      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess(results.message)
        // this.getStmtdata();
        // this.closebtn.nativeElement.click();
        this.getSchedulerstatus();
      }
      else
      {
      this.notification.showError(results.description)

      }
    });
}



gluploads()
{
  
  let filterCol = this.wisefinUpload.controls['fColumnName'].value;
  let filterCol1 = this.wisefinUpload.controls['fColumnName1'].value;
  let filterVal = this.wisefinUpload.controls['fColumnValue'].value;
  let filterVal1 = this.wisefinUpload.controls['fColumnValue1'].value;
  let params = '';
  let params2='';
  let params1 = '';
  let params3 = '';
  // let filterVals =    this.myForm.value.filterProduct;
  if((filterVal && filterCol) && (filterCol1 && filterVal1) )
  {
    params=filterCol;
    params2=filterVal;
    params1=filterCol1
    params3 = filterVal1
     this.datal = {
      template_id : this.wisefinUpload.controls['template_id'].value,
     
      filter_list : 
      [
        { 
          [params]:[params2]
         },
         {
          [params1]:[params3]
         }
       
      ]
     
    
    }
  }
  

  else if(filterCol && filterVal)
  {
    let params = '';
    let params2='';
    params=filterCol;
    params2=filterVal;
 
     this.datal = {
      template_id : this.wisefinUpload.controls['template_id'].value,
     
      filter_list : 
      [
        { 
          [params]:[params2]
         }
       
      ]
     
    
    }
  }
  else
  {
     this.datal = {
      template_id : this.wisefinUpload.controls['template_id'].value 
    }

  }
  // this.brsService.updateSchedulerstatus().subscribe(result => {
  //   this.valuess = result})
  // console.log(this.valuess);

  this.SpinnerService.show();
  this.brsService.glUploadSchedule(this.datal, this.wisefinUpload.controls['account_id'].value , this.wisefinUpload.get('filedata').value).subscribe(results => { 
    this.SpinnerService.hide();
      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess(results.message)
        // this.fileuploadprogress = true;  
        this.getSchedulerstatus();
        
       
      }
      else
      {
      this.notification.showError(results.description)

      }
    });

}

gotoBack()
{
  this.router.navigate(['/brstransactions'],{});  
  this.isExpandeds = true;
  // this.viewbsData();
      // this.viewglData();
  // this.location.back();
}

gotoHome()
{
  // this.router.navigate(['brs/brstransactions'],{});  
}
showHistory()
{

  this.router.navigate(['brs/knockoff'],{}); 

}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceA.filter = filterValue.trim().toLowerCase();
}
applyFilterb(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSources.filter = filterValue.trim().toLowerCase();
}
applyFilterss(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}


toggleAllRows() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.dataSource.data);
}

checkboxLabel(row?: LedgerData): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.line_description + 1}`;
}


isAllSelecteds() {
  const numSelecteds = this.selections.selected.length;
  const numRowss = this.dataSources.data.length;
  return numSelecteds === numRowss;
}


toggleAllRowss() {
  if (this.isAllSelecteds()) {
    this.selections.clear();
    return;
  }
  this.selections.select(...this.dataSources.data);
}
checkboxLabels(rows?: BstatementData): string {
  if (!rows) {
    return `${this.isAllSelecteds() ? 'deselect' : 'select'} all`;
  }
  return `${this.selections.isSelected(rows) ? 'deselect' : 'select'} row ${rows.description + 1}`;
}
  getDateRange(value) {
    // this.brsService.autoknockoff(this.wisefinUpload.controls['account_id'].value, this.bankstmtupload.controls['account_id'].value).subscribe(results => {
      this.SpinnerService.hide();

    // this.dataArrays = results['data'] ;
    this.dataSourceA = new MatTableDataSource<AutoknockoffData> (this.dataArrays);
    // getting date from calendar
    const fromDate = value.fromDate;
    const toDate = value.toDate;
     this.dataSourceA.data = this.dataSourceA.data.filter(e=>e.gl_date > fromDate && e.gl_date < toDate ) ;
     //.sort((a, b) => (a.gl_date).valueOf()  - (b.gl_date).valueOf())
    console.log(fromDate, toDate);
    // })
  }
  

  // this.selections.select(...this.dataSources.data);

  getLedgerDownload()
  {
    this.brsService.downloadLedger(this.wisefinUpload.controls['account_id'].value, 1).subscribe(results=>{
      // if (results.status == 'success') {
      //   this.notification.showSuccess("Files Uploaded Successfully")
      //   // this.closebtn.nativeElement.click();
      // }
      // else
      // {
      // this.notification.showError(results.description)

      // }

      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'LedgerData'+".xlsx";
      link.click();
  
    })
  }

  getStmtDownload()
  {
    this.brsService.downloadStmt(this.bankstmtupload.controls['account_id'].value, 1).subscribe(results=>{
      // if (results.status == 'success') {
      //   this.notification.showSuccess("Files Uploaded Successfully")
      //   // this.closebtn.nativeElement.click();
      // }
      // else
      // {
      // this.notification.showError(results.description)

      // }

      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'StatementData'+".xlsx";
      link.click();
  
    }) 
  }

  downloadAuto()
  {
    // this.brsService.downloadAutoknockoff(this.wisefinUpload.controls['account_id'].value).subscribe(results=>{
      let id= 14;
      this.brsService.AutoknockoffDownload(id).subscribe(results=>{
        // if (results.status == 'success') {
        //   this.notification.showSuccess("Files Uploaded Successfully")
        //   // this.closebtn.nativeElement.click();
        // }
        // else
        // {
        // this.notification.showError(results.description)
  
        // }
  
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'AutoknockoffData'+".xlsx";
        link.click();
    
      }) 
  }

  purgeLedger()
  {

    let dataPl= {
      account_id : this.wisefinUpload.controls['account_id'].value,
      type : "ledger"
      // [
        // {
        //   entry_status: ''
        // },
        // {
        //   entry_gl : ''
        // }
      // ]
     
    
    }
    this.brsService.purgeLedgerServ(dataPl).subscribe(results=>{
      if (results.status == 'success') {
        this.notification.showSuccess("Files Purged Successfully")
        // this.closebtn.nativeElement.click();
      }
      else
      {
      this.notification.showError(results.description)

      }
    })
  }
  purgeStatement()
  {
    let dataSt= {
      account_id : this.bankstmtupload.controls['account_id'].value,
      type : "statement"
      // [
        // {
        //   entry_status: ''
        // },
        // {
        //   entry_gl : ''
        // }
      // ]
     
    
    }
    this.brsService.purgeStmtServ(dataSt).subscribe(results=>{
      if (results.status == 'success') {
        this.notification.showSuccess("Files Purged Successfully")
        // this.closebtn.nativeElement.click();
      }
      else
      {
      this.notification.showError(results.description)

      }
    })
  }

  purgeHistory()
  {
    this.router.navigate(['brs/purge'],{}); 
  }

  changeColumn(event)
  {
    if(this.wisefinUpload.controls['entry_status'].value == 1)
    {
      this.showGLentry = false; 
    }
    if(this.wisefinUpload.controls['entry_status'].value == 0)
    {
      this.showGLentry = true; 
    }
  }

  backtoHome()
  {

    this.showfirsttable = true;
      this.showknockofftable = false;
      this.displaybuttons = true;
      this.confirmbutton = false;
      this.showuploads = true;
      this.isExpandeds = true;
      // this.viewbsData();
      // this.viewglData();
  }

  selectedRow(row)
  {

    this.selection.selected.forEach(
       s => console.log(s.id)
    )
    
  }
  gotoIntegrity()
  {

    this.router.navigate(['interintegrity/intertrans'],{ queryParams:{
      date : this.datepipe.transform((this.wisefinUpload.controls['endDate'].value),'yyyy-MM-dd')
     
    }}); 
    console.log("Choosing Date", this.datepipe.transform((this.wisefinUpload.controls['startDate'].value),'yyyy-MM-dd'))
    
  }

  addfilters()
  {

  }
  getSchedulerstatus()
  {
    this.branchCodeEmp = this.currentUser == 'admin' ? this.brsconcile.controls['branchs'].value : this.empbranchid;
    this.subscription = timer(0, 20000).pipe(
      switchMap(() => this.brsService.schedulerStatus(this.branchCodeEmp))
    ).subscribe(result => 
      {
       
      this.schedulerstat = result.knockoff_scheduler;
      this.wisefinscheduler = result.wisefin_scheduler;
      this.cbsscheduler = result.statement_scheduler;
      console.log("Scheduler Status", this.schedulerstat)
      if(result.knockoff_scheduler == 0)
      {
        this.subscription.unsubscribe();
      }
      }
    
    );
      

    // this.brsService.schedulerStatus().subscribe(results=>{
    //   if (results) {
    //     this.schedulerstat = results.knockoff_scheduler;
    //     console.log("Scheduler Status", this.schedulerstat)

    //     // this.notification.showSuccess("Files Purged Successfully")
    //     // this.closebtn.nativeElement.click();
    //   }
    //   else
    //   {
    //   this.notification.showError(results.description)

    //   }
    // })
  }

  checkStatusSched()
  {
    this.getSchedulerstatus();
  }

  glfetch()
  {

    let datal = {
      account_id : this.wisefinUpload.controls['acc_id'].value,
      // template_id : this.wisefinUpload.controls['template_id'].value ,
      from_date : this.datepipe.transform((this.wisefinUpload.controls['startDate'].value),'yyyy-MM-dd'),
      to_date : this.datepipe.transform((this.wisefinUpload.controls['endDate'].value),'yyyy-MM-dd'),
      file : 0
    }
    this.SpinnerService.show();
  this.brsService.fetchgldata(datal).subscribe(results => { 
    this.SpinnerService.hide();
      this.pagination = results.pagination ? results.pagination : this.pagination;
      if (results.status == 'success') {
        this.notification.showSuccess(results.message)
        // this.fileuploadprogress = true;  
        this.getSchedulerstatus();
        
       
      }
      else
      {
      this.notification.showError(results.description)

      }
    });
  }

  // showuploadprogress()
  // {
  //   this.fileuploadcomplete = false;
  //   this.fileuploadprogress = true;
  // }

}

// checkboxLabels(a){


// applyFilters(event: Event) {
  // const filterValue = (event.target as HTMLInputElement).value;
  // this.dataSources.filter = filterValue.trim().toLowerCase();
// }




// }