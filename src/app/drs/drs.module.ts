import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DrsRoutingModule } from './drs-routing.module';
import { DrsComponent } from './drs.component';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportbuilderComponent } from './reportbuilder/reportbuilder.component';
import { DrssummaryComponent } from './drssummary/drssummary.component';
import { DrsdocumentComponent } from './drsdocument/drsdocument.component';
import { DrsSchdularComponent } from './drs-schdular/drs-schdular.component';
import { ScheduleItemComponent } from './schedule-item/schedule-item.component';
import { DrsSummaryTemplateComponent } from './drs-summary-template/drs-summary-template.component';
import { CurrencyFormatComponent } from './currency-format/currency-format.component';

import { ExceptionScheduleComponent } from './exception-schedule/exception-schedule.component';
import { AudictEntryComponent } from './audict-entry/audict-entry.component'; 
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotionalEntriesComponent } from './notional-entries/notional-entries.component';
// import { VirtualScrollerModule } from 'ngx-virtual-scroller';


@NgModule({
  declarations: [ DrsComponent, ReportbuilderComponent, DrssummaryComponent, DrsdocumentComponent, DrsSchdularComponent, ScheduleItemComponent, DrsSummaryTemplateComponent, CurrencyFormatComponent, ExceptionScheduleComponent, AudictEntryComponent, NotionalEntriesComponent],

  imports: [
    CommonModule,
        DrsRoutingModule,
    MatTableModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InfiniteScrollModule,
    // VirtualScrollerModule
  ]
})
export class DrsModule { }
