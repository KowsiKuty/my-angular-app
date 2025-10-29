
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// import * as QuicksightEmbedding from 'amazon-quicksight-embedding-sdk';
// import { EmbeddingContext } from 'amazon-quicksight-embedding-sdk/dist';
// import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';
import { take } from 'rxjs/operators';
import { SharedService } from '../../service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from '../dashboard.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loadingError = false;
  dashboard: any;
  sub_module_url:any
  dash_Sub_Menu_List:any
  dashsummaryPath:any
  dashboardsummary:any

  constructor(private http: HttpClient, private service: DashboardService, private sharedService: SharedService,private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    // this.GetDashboardURL();
    let datas = this.sharedService.menuUrlData;

    datas?.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "EMC Dashboard") {
        this.dash_Sub_Menu_List = subModule;
      }
    });
    this.getdashbordSummaryList(1)
  }

  public GetDashboardURL(id:any) {
    let data = { "dashboard_id": id };
    this.SpinnerService.show()
    this.service.GetDashboardURL(data)
      .pipe(
        take(1),
      )
      .subscribe((result: any) => this.embedDashboard(result.url));
  }

  public async embedDashboard(embeddedURL: string) {
    const containerDiv = document.getElementById("dashboardContainer");
    
    if (!containerDiv) {
      this.loadingError = true; // Handle error if the container is not found
      return;
    }

    const frameOptions = {
      url: embeddedURL,
      container: containerDiv,
      height: "850px",
      width: "100%",
      resizeHeightOnSizeChangedEvent: true,
    };
this.SpinnerService.hide()
    window.open(embeddedURL)

    // try {
    //   const embeddingContext: EmbeddingContext = await createEmbeddingContext();
    //   this.dashboard = embeddingContext.embedDashboard(frameOptions);
    // } catch (error) {
    //   this.loadingError = true; // Handle error during embedding
    //   console.error('Error embedding the dashboard:', error);
    // }
  }

  dashboardSubModule(data){
    this.sub_module_url = data.url;
    this.dashboardsummary ='/dashboard_summary'
    this.dashsummaryPath = this.dashboardsummary === this.sub_module_url ? true : false;

  }
  dashbord_summary_data:any=[]
  has_pagenext = true;
  has_pageprevious = true;
  dashbord_summary_page: boolean = true;
  dashbordpresentpage: number = 1;
  dashbordpagesize:number=10;
  getdashbordSummaryList(pageNumber) {
    this.SpinnerService.show()
    this.service.GetDashboard_summary(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.dashbord_summary_data = datas;
        let datapagination = results["pagination"];
        this.dashbord_summary_data = datas;
        this.length_dashboard = datapagination.count
        if (this.dashbord_summary_data.length === 0) {
          this.dashbord_summary_page = false
        }
        if (this.dashbord_summary_data.length > 0) {
          this.has_pagenext = datapagination.has_next;
          this.has_pageprevious = datapagination.has_previous;
          this.dashbordpresentpage = datapagination.index;
          this.dashbord_summary_page = true
        }
        this.SpinnerService.hide()
      })
  }

length_dashboard = 0;
pageIndexdashboard = 0;
pageSizeOptions = [5, 10, 25];
pageSize_dashboard=10;
showFirstLastButtons:boolean=true;
dashboardpresentpage: number = 1;
handlePageEvent(event: PageEvent) {
    this.length_dashboard = event.length;
    this.pageSize_dashboard = event.pageSize;
    this.pageIndexdashboard = event.pageIndex;
    this.dashboardpresentpage=event.pageIndex+1;
    this.getdashbordSummaryList(this.dashboardpresentpage);
    
  }
}

