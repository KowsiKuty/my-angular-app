import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { VendorreportComponent } from './vendorreport/vendorreport.component';
import { Vendorreportv2Component } from './vendorreportv2/vendorreportv2.component';
import { QueryscreenComponent } from './queryscreen/queryscreen.component';
import { TrialbalanceComponent } from './trialbalance/trialbalance.component';
import { ProvisionReportScreenViewComponent } from './provision-report-screen-view/provision-report-screen-view.component';
import { QueryexefileComponent } from './queryexefile/queryexefile.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VsSearchCmpComponent } from '@unnilouis.org/vs-search-inp';
import { CboxSummaryModule } from '@unnilouis.org/vs-summary-cbox';
import { VsSearchInpModule } from '@unnilouis.org/vs-search-inp';
import { VsChipdropdownModule } from '@unnilouis.org/vs-chipdropdown';
import { VsOptionddModule } from '@unnilouis.org/vs-optiondd';
import { VsDynamicformsModule } from '@unnilouis.org/vs-dynamicforms';
import { VsSepDatesModule } from '@unnilouis.org/vs-sep-dates';
import { PrpoReportsComponent } from './prpo-reports/prpo-reports.component';
import { EmployeequeryComponent } from './employeequery/employeequery.component';
import { PcadashboardreportComponent } from './pcadashboardreport/pcadashboardreport.component';
// import { ReportsComponent } from './reports/reports.component';



@NgModule({
  declarations: [VendorreportComponent, Vendorreportv2Component, QueryscreenComponent, TrialbalanceComponent, ProvisionReportScreenViewComponent, QueryexefileComponent, VendorReportComponent,DashboardComponent,PrpoReportsComponent,PcadashboardreportComponent,EmployeequeryComponent],
  exports: [VendorreportComponent, Vendorreportv2Component, TrialbalanceComponent, DashboardComponent,PcadashboardreportComponent,VsSearchInpModule, ProvisionReportScreenViewComponent, PrpoReportsComponent,EmployeequeryComponent],
  imports: [
    CommonModule,
    CboxSummaryModule,VsSearchInpModule,VsChipdropdownModule,VsOptionddModule,
    VsDynamicformsModule,VsSepDatesModule,
    ReportsRoutingModule, MaterialModule, SharedModule
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class ReportsModule { }


