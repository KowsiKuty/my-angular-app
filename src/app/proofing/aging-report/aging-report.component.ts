import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProofingService } from '../proofing.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingService } from 'src/app/ta/error-handling.service';
import { MatSelect } from '@angular/material/select';
import { ShareService } from '../share.service';

import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../notification.service';

export interface PeriodicElement {
  name : string;
  position: number;
}


// const ELEMENT_DATA: PeriodicElement[] ;




const datePickerFormat = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-aging-report',
  templateUrl: './aging-report.component.html',
  styleUrls: ['./aging-report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: datePickerFormat },
    DatePipe
  ],
})
export class AgingReportComponent implements OnInit {
  from_Date: string;
  public page = 1;
  public pageSize = 10
  knockForm: FormGroup;
  bucketform:FormGroup;
  to_Date: string;
  AccountList = [];
  acc_id : any;
  agingdatas: any;
  reportview: any;
  ageingData = [];
  days: any;
  from_days: number;
  to_days: number;
  binaryData: any[];
  downloadUrl: string;
  pdfSrc: string
  accountobject: any = {}
  headerarray = []
  recordlist = [];
  bucketlist = null;
  buckets = null;
  timeline = null;
  account_no = null;
  descinput = '';
  limit = 30;
  desclength:number;
  displayedColumns: string[] = ['Account Name'];
  Bucketdata = [];
  acc_name : any;
  dataSource = new MatTableDataSource<PeriodicElement>(this.Bucketdata);
  selection = new SelectionModel<PeriodicElement>(true, []);
  ageingDatas: boolean = false;
  // notification: any;
  constructor(private proofingservice: ProofingService,private errorHandler: ErrorHandlingService, private datePipe: DatePipe, private shareservice: ShareService, private SpinnerService: NgxSpinnerService,
    private fb: FormBuilder,private notification: NotificationService, private proofingService: ProofingService,private spinner:NgxSpinnerService,) { }
  ngOnInit(): void {
    this.getBucketList();
    this.knockForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      account_no: ['']
    })


    let sub1 = this.shareservice.accountobject.subscribe(value => {
      this.accountobject = value;
      this.SpinnerService.show();
      this.accountobject?.id ? this.proofingService.getTemplateDetails(this.accountobject?.template.id)
        .subscribe(response => {
          this.SpinnerService.hide();
          this.ageingData = []
          this.headerarray = response.details;
          this.headerarray.splice(3, 5);
          this.headerarray.push({ sys_col_name: '', column_name: 'Debit', class: 'proofingheaderamount' })
          this.headerarray.push({ sys_col_name: '', column_name: 'Credit', class: 'proofingheaderamount' })
        }
        ) : ''

    })

    this.shareservice.subcriptions.push(sub1)
  }

  bucketname = null;
  has_next
  has_previous;
  currentpage;
  getBucketList(page = 1) {
    let params = 'page=' + page
    this.bucketname ? params += '&name=' + this.bucketname : '';
    this.spinner.show()
    this.proofingservice.getbucketslist(params).subscribe(results => {
      this.spinner.hide()
      if (page == 1) {
        this.bucketlist = []
      }
      this.bucketlist = this.bucketlist.concat(results['data'])
      let datapagination = results["pagination"];

      if (this.bucketlist.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
    })
  }

  isAllSelected() {
    console.log(this.selection);
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
     console.log(this.selection);
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  selectRow(row) {
    this.selection.toggle(row);
    console.log(this.selection.selected);
  }

  bucket_show(element) {
    let value = `${element?.name}`
    return element ? value : ''
  }

  table_show() {
    this.dataSource = null
    this.Bucketdata = []
    this.buckets = null
    this.ageingDatas = false
  }  

  calculateDiff(sentDate) {
    // console.log(sentDate)
    var date1: any = new Date(sentDate);
    var date2: any = new Date();
    var diffDays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  viewRecord(records,items,each) {
    this.recordlist = records;
    this.timeline =  items.timeline;
    this.account_no = each.id;
    this.recordlist.forEach(element => element.aging = this.calculateDiff(element.date))
  }
  tablescrolled(scrollelement) {
    let value = scrollelement.target;

    const offsetHeight = value.offsetHeight;
    const scrollHeight = value.scrollHeight;
    const scrollTop = value.scrollTop;//current scrolled distance
    const upgradelimit = scrollHeight - offsetHeight - 50;


    if (scrollTop > upgradelimit) {
      console.log('bottom')
      this.limit += 30;
    }

  }
  agingSearch() {

    let agingsearch = {
      "bucket_id": this.buckets.id,
    }
    this.SpinnerService.show()

    this.proofingService.agingsearch(agingsearch.bucket_id)
      .subscribe((results: any) => {
        this.SpinnerService.hide()
        this.Bucketdata = results
        this.dataSource=new MatTableDataSource<PeriodicElement>(this.Bucketdata);
        this.ageingDatas = false;
        this.selection = new SelectionModel<PeriodicElement>(true, []);
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  downloadxl(arrayname) {

    console.log("ARRY NAME", arrayname)
    // if (this.accountid == null){
    //   this.notification.showError('Account No Not Seleced')
    //   return
    // }
    // let payload = {
    //   "filter_type": [arrayname],
    //   "account_id": this.accountid,
    // }
    let params;
    if(arrayname=1){
      params = "account_id=["+this.acc_id+"]"
    }
    else{
      params = "account_id=["+arrayname+"]";
    }
    
    console.log("params", params)
    this.proofingService.dataDownloadxl(params)
      .subscribe((data: any) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = arrayname + ".xlsx";
        link.click();
      })
  }

  downloadxl_trns() {
    let body;
    body = {
      "timeline":this.timeline,
      "account_id":this.account_no
    }

    this.proofingService.dataDownloadxl_trns(body)
      .subscribe((data: any) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Transaction_"+ this.timeline + ".xlsx";
        link.click();
      })
  }


  reportgettingfunc(){
    this.SpinnerService.show()
    console.log(this.selection.selected);
    if (this.selection.selected.length > 0){
      this.acc_id = this.selection.selected.map(i => i['id']);
      this.proofingService.agingreport([...new Set(this.acc_id)])
      .subscribe((results: any) => {
        this.SpinnerService.hide();
        this.ageingData = results.data 
        this.acc_name = this.selection.selected.map(i => i['name']);  
        this.ageingDatas = true;
        this.Bucketdata = []    
        // this.dataSource=new MatTableDataSource<PeriodicElement>(this.Bucketdata);
      }, error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
          
             })  
            }
    else {
              this.SpinnerService.hide();
              this.notification.showError('No account number is seleted')       
            }              
    }
  

  agingClear() {
    console.log(this.knockForm)
    this.knockForm.reset('')
    // this.knockForm.value['to_date'].reset('')
    // this.knockForm.value['account_id'].reset('')

  }

  downloadexlsearch() {
    let name = 'Aging Report'
    let params = {
      "fromdate": this.from_Date,
      "todate": this.to_Date,

    }


    this.proofingService.transactiondownload(this.knockForm.value.account_no, params)
      .subscribe((data: any) => {


        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = name + ".xlsx";
        link.click();
      })

  }
  test(values){
    console.log(values)
  }
}
