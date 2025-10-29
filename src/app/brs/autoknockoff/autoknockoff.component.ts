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

@Component({
  selector: 'app-autoknockoff',
  templateUrl: './autoknockoff.component.html',
  styleUrls: ['./autoknockoff.component.scss']
})
export class AutoknockoffComponent implements OnInit {

  constructor(private fb: FormBuilder, private notification: NotificationService, private brsService: BrsApiServiceService,
    private router: Router, config: NgbCarouselConfig, private SpinnerService: NgxSpinnerService) { }
    knockofflists=[];
    uploadfile: any;
    limit = 10;
    pagination = {
      has_next: false,
      has_previous: false,
      index: 1
    }
  ngOnInit(): void {

    this.autoknockoff();
  }

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
    this.SpinnerService.show();
    // this.brsService.confirmingknockoff(2,5).subscribe(results => {
    //   this.SpinnerService.hide();
    

    //   this.pagination = results.pagination ? results.pagination : this.pagination;

 
    //   if (results.status == 'success') {
    //     this.notification.showSuccess("Autoknockoff Completed")
      
    //   }
    //   else {
    //     this.notification.showError(results.description)

    //   }
    // })

  }

  autoknockoff()
  {
    this.SpinnerService.show();
    
  //   this.brsService.autoknockoff(4,5).subscribe(results => {
  //     this.SpinnerService.hide();
  //     this.knockofflists = results['data'];
 

  //     this.pagination = results.pagination ? results.pagination : this.pagination;

  // })
}

viewsinglerecord(value)
{

  this.brsService.singlerecords(value).subscribe(results => {
    this.SpinnerService.hide();
    this.knockofflists = results['data'];


    this.pagination = results.pagination ? results.pagination : this.pagination;
  
})
}
}
