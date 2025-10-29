import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ToastrModule } from 'ngx-toastr';
import { ReportsmainComponent } from './reportsmain/reportsmain.component';
import { SearchfiltersApicallDirective } from './searchfilters-apicall.directive';
import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [ReportsmainComponent, SearchfiltersApicallDirective, ChartComponent],
  imports: [
    ToastrModule.forRoot({ timeOut: 10000 }),
    CommonModule, ReportsRoutingModule, SharedModule, MaterialModule,PdfViewerModule
  ]
})
export class ReportsModule { }
