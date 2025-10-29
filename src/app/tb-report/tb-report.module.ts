import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TbReportRoutingModule } from './tb-report-routing.module';
import { TBReportComponent } from './tb-report/tb-report.component';
import { TBGlReportComponent } from './tb-gl-report/tb-gl-report.component';
import { TBSummaryComponent } from './tb-summary/tb-summary.component';
import {VsDynamicformsModule} from '@unnilouis.org/vs-dynamicforms';
import {VsDepDropdownModule} from '@unnilouis.org/vs-dep-dropdown';
import {CboxSummaryModule} from '@unnilouis.org/vs-summary-cbox';
import {VsSearchInpModule} from "@unnilouis.org/vs-search-inp";
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { VertReportComponent } from './vert-report/vert-report.component';
import { RoaReportComponent } from './roa-report/roa-report.component';
import { BusinessMasterComponent } from './business-master/business-master.component';
import { LabelMasterComponent } from './label-master/label-master.component';
import { MappingMasterComponent } from './mapping-master/mapping-master.component';
import { CommonReportComponent } from './common-report/common-report.component';
import { RoaManualentryComponent } from './roa-manualentry/roa-manualentry.component';
import { TwoDigitDecimalNumberDirective } from './two-digit-decimal-number.directive';
import { TbDocumentComponent } from './tb-document/tb-document.component';
import { TbSubmoduleRoutingComponent } from './tb-submodule-routing/tb-submodule-routing.component';
import { MasterRoutingComponent } from './master-routing/master-routing.component';
import { RoarunscreenComponent } from './roarunscreen/roarunscreen.component';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary.component';
import { CbdaReportComponent } from './cbda-report/cbda-report.component';



@NgModule({
  declarations: [TBSummaryComponent,TBReportComponent, TBGlReportComponent, VertReportComponent, RoaReportComponent, BusinessMasterComponent, LabelMasterComponent, MappingMasterComponent, CommonReportComponent, RoaManualentryComponent, TwoDigitDecimalNumberDirective, TbDocumentComponent, TbSubmoduleRoutingComponent, MasterRoutingComponent, RoarunscreenComponent, TransactionSummaryComponent, CbdaReportComponent,],
  imports: [
    CommonModule,
    TbReportRoutingModule,
    VsDynamicformsModule,
    VsDepDropdownModule,
    CboxSummaryModule,
    VsSearchInpModule,
    MatTableModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InfiniteScrollModule,
  ]
})
export class TbReportModule { }
