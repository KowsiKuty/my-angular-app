import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { DrsComponent } from './drs.component';
import { ReportbuilderComponent } from './reportbuilder/reportbuilder.component';
import { DrssummaryComponent } from './drssummary/drssummary.component';
import { DrsdocumentComponent } from './drsdocument/drsdocument.component';
import { DrsSchdularComponent } from './drs-schdular/drs-schdular.component';
import { ScheduleItemComponent } from './schedule-item/schedule-item.component';
import { DrsSummaryTemplateComponent } from './drs-summary-template/drs-summary-template.component';
import { ExceptionScheduleComponent } from './exception-schedule/exception-schedule.component'; 
import { AudictEntryComponent } from './audict-entry/audict-entry.component';
import { NotionalEntriesComponent } from './notional-entries/notional-entries.component';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path:"drscomponent", component: DrsComponent },
      { path:"reportbuilder", component:  ReportbuilderComponent},
      { path:"drssummary", component:  DrssummaryComponent},
      {path:"drsDocument",component:DrsdocumentComponent},
      {path:"schdular",component:DrsSchdularComponent},
      {path:"schedule_item",component:ScheduleItemComponent},
      {path:"template",component:DrsSummaryTemplateComponent} ,
      {path:"excep",component:ExceptionScheduleComponent},
      {path:"audict",component:AudictEntryComponent},
      {path:"notional",component:NotionalEntriesComponent}
    ]
   
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrsRoutingModule { }
