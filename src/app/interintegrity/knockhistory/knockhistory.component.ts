import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { InterintegrityApiServiceService } from '../interintegrity-api-service.service';
import { fromEvent } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-knockhistory',
  templateUrl: './knockhistory.component.html',
  styleUrls: ['./knockhistory.component.scss']
})
export class KnockhistoryComponent implements OnInit {

  summarylists = [];
  searchForm : FormGroup;
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  knockofflists = [];
  knockoffSearchlists=[];
  totalCount : any;
  accounts: any;
  send_value:String="";
  @Input() file_id:any
  constructor(private fb: FormBuilder, private notification: NotificationService, public datepipe: DatePipe,
    private router: Router, config: NgbCarouselConfig, private SpinnerService: NgxSpinnerService,
    public interService: InterintegrityApiServiceService,) { }

  ngOnInit(): void {


    this.gethistorydata();

    this.searchForm = this.fb.group({
      code:'',
      account_id:'',
      transaction_date:'',
      run_date:'',
      transaction_from_date:'',
      transaction_to_date:'',
      branch_code:''

    })


    this.interService.getaccountdata(this.pagination.index)
    .subscribe(result => {
      this.accounts= result['data'] 
    })
    
  }

  gethistorydata() {
this.SpinnerService.show()
    this.interService.getknockofflists(this.pagination.index,this.file_id).subscribe(results => {
      this.SpinnerService.hide()
      if (!results) {
        return false;
      }
      this.SpinnerService.hide();

      // this.summarylist = results.count;
     
      this.summarylists = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  viewsinglerecord(val)
  {
    this.SpinnerService.show();
    this.interService.singlerecords(val).subscribe(results => {
      this.SpinnerService.hide();

      // this.dataArray = results['data'] ;
      // this.dataSource = new MatTableDataSource<Autoknockviewdata> (this.dataArray);

      // this.dataSource.paginator = this.pageCol1;
      // this.dataSource.sort = this.sortCol1;
      this.knockofflists = results['data'];
  
  
      // this.pagination = results.pagination ? results.pagination : this.pagination;
    
  })

  }

  downloadrecord(vals, code)
  {
    this.SpinnerService.show();
    this.interService.downloadsingle(vals).subscribe(results => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = code+".xlsx";
      link.click();
      this.SpinnerService.hide();
   
    
  })
  }
  onSubmit()
  {
     let formValue = this.searchForm.value;
     console.log("Search Inputs",formValue )
     this.send_value = ""
     if(formValue.code)
    {
      this.send_value=this.send_value+"&code="+formValue.code
    }
    if(formValue.account_id)
    {
      this.send_value=this.send_value+"&account_id="+formValue.account_id
    }
    if(formValue.branch_code)
    {
      this.send_value=this.send_value+"&branch_code="+formValue.branch_code
    }
    
    if(formValue.transaction_date)
    {
      this.send_value=this.send_value+"&transaction_date="+  this.datepipe.transform((formValue.transaction_date),'yyyy-MM-dd')
    }
    if(formValue.run_date)
    {
      this.send_value=this.send_value+"&run_date="+ this.datepipe.transform((formValue.run_date),'yyyy-MM-dd')
    }
    if(formValue.transaction_from_date)
    {
      this.send_value=this.send_value+"&transaction_from_date="+ this.datepipe.transform((formValue.transaction_from_date),'yyyy-MM-dd')
    }
    if(formValue.transaction_to_date)
    {
      this.send_value=this.send_value+"&transaction_to_date="+ this.datepipe.transform((formValue.transaction_to_date),'yyyy-MM-dd')
    }
  
  

    this.interService.getknockoffSearch(this.send_value, this.pagination.index).subscribe(results=> {
      this.knockoffSearchlists = results['data'];
      this.totalCount = results['count'];
    })
  }
  clearSearch()
  {
    this.searchForm.reset();
  }

  prevpages(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }


  }

  nextpages(){

    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1

    }
    // this.viewsinglerecord();
  
   

  }

  prevpage(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
    this.gethistorydata();


  }

  nextpage(){

    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1

    }
    this.gethistorydata();
  

}
backHome()
{
  this.router.navigate(['interintegrity/intertrans'],{}); 
}
downloadFile()
{

  let formValue = this.searchForm.value;
  console.log("Search Inputs",formValue )
  this.send_value = ""
  if(formValue.code)
 {
   this.send_value=this.send_value+"&code="+formValue.code
 }
 if(formValue.account_id)
 {
   this.send_value=this.send_value+"&account_id="+formValue.account_id
 }
 
 if(formValue.transaction_date)
 {
   this.send_value=this.send_value+"&transaction_date="+  this.datepipe.transform((formValue.transaction_date),'yyyy-MM-dd')
 }
 if(formValue.run_date)
 {
   this.send_value=this.send_value+"&run_date="+ this.datepipe.transform((formValue.run_date),'yyyy-MM-dd')
 }
 if(formValue.transaction_from_date)
 {
   this.send_value=this.send_value+"&transaction_from_date="+ this.datepipe.transform((formValue.transaction_from_date),'yyyy-MM-dd')
 }
 if(formValue.transaction_to_date)
 {
   this.send_value=this.send_value+"&transaction_to_date="+ this.datepipe.transform((formValue.transaction_to_date),'yyyy-MM-dd')
 }
 this.SpinnerService.show();
 this.interService.getknockoffSearchDownload(this.send_value, this.pagination.index).subscribe(results=> {
  let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'SearchData'+".xlsx";
      link.click();
      this.SpinnerService.hide();
})
  
}
@Output() type_id = new EventEmitter<any>();
getbacktomain(){
  this.type_id.emit(false)
}
}
