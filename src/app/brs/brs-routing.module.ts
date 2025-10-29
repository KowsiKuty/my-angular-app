import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrstransactionsComponent } from './brstransactions/brstransactions.component';
import { BrsmasterComponent } from './brsmaster/brsmaster.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { NewbrsformComponent } from './newbrsform/newbrsform.component';
import { NewbrsrulesetsComponent } from './newbrsrulesets/newbrsrulesets.component';
import { RulemappingComponent } from './rulemapping/rulemapping.component';
import { KnockoffhistoryComponent } from './knockoffhistory/knockoffhistory.component';
import { CreateaccountComponent } from './createaccount/createaccount.component';
import { AutoknockoffComponent } from './autoknockoff/autoknockoff.component';
import { NewtemplatecreateComponent } from './newtemplatecreate/newtemplatecreate.component';
import { RulesummaryComponent } from './rulesummary/rulesummary.component';
import { NwisefinsummComponent } from './nwisefinsumm/nwisefinsumm.component';
import { BanksummaryComponent } from './banksummary/banksummary.component';
import { AccountrulemappingComponent } from './accountrulemapping/accountrulemapping.component';
import { PurgehistoryComponent } from './purgehistory/purgehistory.component';
import { IntegrityComponent } from './integrity/integrity.component'; 
import { BrsUnknockoffdataComponent } from './brs-unknockoffdata/brs-unknockoffdata.component';
import { BrsUnmatchedComponent } from './brs-unmatched/brs-unmatched.component';
import { BrsReportComponent } from './brs-report/brs-report.component';
import { RulemasterCurdComponent } from './rulemaster-curd/rulemaster-curd.component';

const routes: Routes = [
{
path: '', canActivate: [CanActivateGuardService],
  children: [
    { path:"brstrans", component: BrstransactionsComponent },
      {path: "brsmaster", component: BrsmasterComponent},
      {path: "createbrs", component: NewbrsformComponent},
      {path: "newrulesets", component: NewbrsrulesetsComponent},
      {path:"rulemap", component:RulemappingComponent},
      {path:"knockoff", component:KnockoffhistoryComponent},
      {path:"newaccount", component:CreateaccountComponent},
      {path:"autoknock", component:AutoknockoffComponent},
      {path:"newtemp", component: NewtemplatecreateComponent},
      {path:"rulesumm", component: RulesummaryComponent},
      {path:"nwisesumm", component: NwisefinsummComponent},
      {path:"banksumm", component: BanksummaryComponent},
      {path:"accountmap", component: AccountrulemappingComponent},
      {path:"purge", component: PurgehistoryComponent},
      {path: "integrity", component: IntegrityComponent},
      {path: "brs_unknockoffdata", component:BrsUnknockoffdataComponent},
      {path: "brs_unmatched", component:BrsUnmatchedComponent},
      {path: "brs_report", component:BrsReportComponent},
      {path: "brs_curd", component:RulemasterCurdComponent},
  ]
}
];
// const routes: Routes = [
//   { path:"brstransactions", component: BrstransactionsComponent },
//   {path: "brsmater", component: BrsmasterComponent},
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrsRoutingModule { }
