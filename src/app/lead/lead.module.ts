import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

import { LeadRoutingModule } from './lead-routing.module'; 
import { SharedModule } from '../shared/shared.module';
import { LeadComponent } from './lead/lead.component';
import { LeaddataComponent } from './leaddata/leaddata.component';
import { SearchfilterPipe } from './searchfilter.pipe';
import { FollowupleadandtaskComponent } from './followupleadandtask/followupleadandtask.component';
import { EmployeetaskeditComponent } from './employeetaskedit/employeetaskedit.component';
import { AllleadComponent } from './alllead/alllead.component';
import { ResizebleDirective } from './resizeble.directive';
import { LeadreportComponent } from './leadreport/leadreport.component';
import { GroupComponent } from './group/group.component';
import { VowSummaryComponent } from './vow-summary/vow-summary.component';

// import { VowSummaryComponent } from '../vow/vow-summary/vow-summary.component';

// import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [LeadComponent, LeaddataComponent, SearchfilterPipe, FollowupleadandtaskComponent, EmployeetaskeditComponent, AllleadComponent, ResizebleDirective, LeadreportComponent, GroupComponent,VowSummaryComponent],
  imports: [
    CommonModule,
    LeadRoutingModule,MaterialModule, SharedModule,

  ],
})
export class LeadModule {  }
