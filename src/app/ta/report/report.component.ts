import { Component, OnInit } from '@angular/core';
import { TourReportComponent } from '../tour-report/tour-report.component'
import { EmployeeTourReportComponent } from '../employee-tour-report/employee-tour-report.component'
import { EclaimBillConsolidateComponent } from '../eclaim-bill-consolidate/eclaim-bill-consolidate.component'
import { BranchwisePendingReportComponent } from '../branchwise-pending-report/branchwise-pending-report.component'
import { GstReportComponent } from '../gst-report/gst-report.component';
import { SharedService } from 'src/app/service/shared.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
   ReportList = [
    { name: "Tour Report", index: 1, component: TourReportComponent },
    { name: "Branch Wise Pending", index: 2, component: EmployeeTourReportComponent },
    { name: "Employee Report", index: 3, component: EclaimBillConsolidateComponent },
    { name: "TA Consolidate", index: 4, component: BranchwisePendingReportComponent },
    { name: "GST Report", index: 5, Component:GstReportComponent },

    ];

    istourreport:boolean
    isbranchwisereport:boolean
    isemployeereport:boolean
    istaconsolidate:boolean
    isgstreport:boolean;



  constructor(public SharedService: SharedService) { }

  ngOnInit(): void {
    let data =this.SharedService.summaryData.value;
    this.subModuleData(data)
  }
subModuleData(data){
  
  if(data.index == 1){
     this.istourreport=true 
    this.isbranchwisereport=false
    this.isemployeereport=false
    this.istaconsolidate=false
    this.isgstreport=false;

   }
   if(data.index == 2){
    this.istourreport=false
   this.isbranchwisereport=true
   this.isemployeereport=false
   this.istaconsolidate=false
   this.isgstreport=false;

  }
  if(data.index == 3){
    this.istourreport=false
   this.isbranchwisereport=false
   this.isemployeereport=true
   this.istaconsolidate=false
   this.isgstreport=false;

  }
  if(data.index == 4){
    this.istourreport=false
   this.isbranchwisereport=false
   this.isemployeereport=false
   this.istaconsolidate=true
   this.isgstreport=false;

  }
  if(data.index == 5){
    
    this.istourreport=false
    this.isbranchwisereport=false
    this.isemployeereport=false
    this.istaconsolidate=false
    this.isgstreport=true
    
  }

}
}
