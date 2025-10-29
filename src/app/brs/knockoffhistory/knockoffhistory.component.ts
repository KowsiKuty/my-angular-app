import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { BrsApiServiceService } from '../brs-api-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { Autoknockviewdata } from '../models/autoknockviewdata';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-knockoffhistory',
  templateUrl: './knockoffhistory.component.html',
  styleUrls: ['./knockoffhistory.component.scss']
})
export class KnockoffhistoryComponent implements OnInit {

  
  summarylists = [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  columnList: string[] ;
  options = [  { key: 'Auto Knockoff', value: '1' },  { key: 'Manual Knockoff', value: '2' },  { key: 'Action Knockoff', value: '3' }];

  searchForm : FormGroup;
  knockofflists = [];
  displayedColumns: string[] = [ 'code','knockoff_date','gl_date', 'line_description', 'debit_amount_ledger', 'credit_amount_ledger','ref_1','transaction_date','description','debit_amount_statement','credit_amount_statement'];
  public dataSource : MatTableDataSource<Autoknockviewdata>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('sortCol1') sortCol1: MatSort;
  public dataArray : any;
  @ViewChild('pageCol1') pageCol1: MatPaginator;
  send_value:String="";
  branchCodeEmp: any;


  constructor(private fb: FormBuilder, private notification: NotificationService, private brsService: BrsApiServiceService,
    private router: Router, config: NgbCarouselConfig, private SpinnerService: NgxSpinnerService, private route: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
       this.branchCodeEmp = params['branchCodeEmp'];
      console.log('branchCodeEmp:', this.branchCodeEmp);
    });

    this.searchForm = this.fb.group({
      code:'',
      account_id:'',
      transaction_date:'',
      run_date:'',
      transaction_from_date:'',
      transaction_to_date:'',
      knock_code:''

    })

    this.brsService.getActionData()
    .subscribe(result => {
      this.columnList = result['data']
    })


    this.gethistorydata();
    
  }


  gethistorydata() {

    this.brsService.getknockofflists(this.pagination.index, this.branchCodeEmp).subscribe(results => {
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
    this.brsService.singlerecords(val).subscribe(results => {
      this.SpinnerService.hide();

      this.dataArray = results['data'] ;
      this.dataSource = new MatTableDataSource<Autoknockviewdata> (this.dataArray);
      // this.cdr.detectChanges();
      this.dataSource.paginator = this.pageCol1;
      this.dataSource.sort = this.sortCol1;
      // this.knockofflists = results['data'];
  
  
      // this.pagination = results.pagination ? results.pagination : this.pagination;
    
  })

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
  
   

  }

  downloadrecord(vals, code)
  {
    this.SpinnerService.show();
    this.brsService.downloadsingle(vals).subscribe(results => {
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
  prevpage()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
    }
    this.gethistorydata();
  }
  nextpage()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.gethistorydata();

  }

  backHome()
  {
    this.router.navigate(['brs/brstrans'],{}); 
  }
  applyFilterss(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  clearSearch()
  {
    this.searchForm.reset();
  }

  onSubmit()
  {
     let formValue = this.searchForm.value;
     console.log("Search Inputs",formValue )
     this.send_value = ""
     if(formValue.code)
    {
      this.send_value=this.send_value+"&knockoff_type="+formValue.code
    }
    if(formValue.account_id)
    {
      this.send_value=this.send_value+"&action_id="+formValue.account_id
    }
    if(formValue.knock_code)
    {
      this.send_value=this.send_value+"&code="+formValue.knock_code
    }
    
   
  
  

    this.brsService.getknockoffSearch(this.send_value, this.pagination.index).subscribe(results=> {
      this.summarylists = results['data'];
    })
  }

}
