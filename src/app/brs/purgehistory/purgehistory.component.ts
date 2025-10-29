import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { BrsApiServiceService } from '../brs-api-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-purgehistory',
  templateUrl: './purgehistory.component.html',
  styleUrls: ['./purgehistory.component.scss']
})
export class PurgehistoryComponent implements OnInit {

  summarylists = [];
  summarylistsL : any = [];
  summarylistsB : any = [];
  purgedatalist: any= [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  branchCodeEmp: any;

  constructor(private fb: FormBuilder, private notification: NotificationService, private brsService: BrsApiServiceService,
    private router: Router, config: NgbCarouselConfig, private SpinnerService: NgxSpinnerService, private route: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.branchCodeEmp = params['branchCodeEmp'];
     console.log('branchCodeEmp:', this.branchCodeEmp);
   });


    this.getpurgedata( );
  }

  getpurgedata() {


    this.brsService.purgeHistory(this.pagination.index, this.branchCodeEmp).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylists = results['data'];
      this.summarylistsL =  this.summarylists.filter(element => element.entry_type == 1)      
      this.summarylistsB = this.summarylists.filter(element => element.entry_type == 2)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })
  }
  prevpage(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
    this.getpurgedata( );
  

  }

  nextpage(){

    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1

    }
    this.getpurgedata( );
  }

  prevpages(){
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1

    }
    this.getpurgedata( );
  

  }

  nextpages(){

    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1

    }
    this.getpurgedata( );
  }


backHome()
{
  this.router.navigate(['brs/brstrans'],{}); 
}

viewsinglerecord(val)
  {
    this.SpinnerService.show();
    this.brsService.singlerecordspurge(val).subscribe(results => {
      this.SpinnerService.hide();
      this.purgedatalist = results['data'];
  
  
      this.pagination = results.pagination ? results.pagination : this.pagination;
    
  })

  }
}
