import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import { ProofingService } from '../proofing.service';
import { environment } from 'src/environments/environment';

// import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  proofingUrl = environment.apiURL

  summarylists = [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  account_type: any;
  historysummaryObjNew:any;

  constructor(private proofingService: ProofingService,  private router: Router, private route: ActivatedRoute, 
    private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.account_type = params['accountType'];
     console.log('branchCodeEmp:', this.account_type);
   });

    // this.gethistorydata();
    this.historysummary();
  }

  gethistorydata() {

    // let param = "page="+this.pagination.index;
    // let params = param

    this.proofingService.getHistory(this.pagination.index, this.account_type).subscribe(results => {
      if (!results) {
        return false;
      }
      // this.SpinnerService.hide();

      // this.summarylist = results.count;
     
      this.summarylists = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }

  prevpage()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
    }
    // this.gethistorydata();
    this.historysummary();
  }
  nextpage()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    // this.gethistorydata();
    this.historysummary();

  }
  backHome()
  {
    this.router.navigate(['proofing/ProofingUpload'], { });
  }
  downloadXS(record)
  {
    let acctype = record.account_type;
    let accno = record.id
    this.SpinnerService.show();
    this.proofingService.downloadExcel(acctype, accno).subscribe(results => {
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = record.to_date+".xlsx";
      link.click();
      this.SpinnerService.hide();
   
    
  })
  }
  // 
  historysummary(){
    this.historysummaryObjNew = { "method": "get", "url": this.proofingUrl + "prfserv/uploadhistory", "params": "&account_type=" + this.account_type }
  }
  historysummarydata:any  = [{ "columnname": "From Date", "key": "from_date" , "type": "date","datetype": "dd/MM/yyyy"},
    {"columnname": "To Date", "key": "to_date", "type": "date","datetype": "dd/MM/yyyy" },
    {"columnname": "Account Name", "key": "account" , "type": "object", "objkey":"account_name"},
    {"columnname": "Account Number", "key": "account", "type": "object", "objkey":"account_number" },
    {"columnname": "Download", "key": "download", "icon": "save_alt" , "button": true ,"function": true, "clickfunction": this.downloadXS.bind(this),},
    {"columnname": "Purge", "key": "purge", "icon": "archive" , "button": true},
    // {"columnname": "RenewalDate", "key": "renewal_date", "type": "date","datetype": "dd/MM/yyyy"},
    // {"columnname": "VendorStatus", "key": "mainstatus_name"},
    // {"columnname": "RequestType", "key": "requeststatus_name"},
    // {"columnname": "RequestStatus", "key": "vendor_status_name",validate: true, validatefunction: this.vendorcreatefn.bind(this)},
  ]

}
