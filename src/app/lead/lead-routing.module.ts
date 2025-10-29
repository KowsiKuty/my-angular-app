import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllleadComponent } from './alllead/alllead.component';
import { LeadComponent } from './lead/lead.component';
import { LeaddataComponent } from './leaddata/leaddata.component';
import { LeadreportComponent } from './leadreport/leadreport.component';
import { GroupComponent } from './group/group.component';
import { VowSummaryComponent } from './vow-summary/vow-summary.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'lead', component: LeadComponent },
      { path: 'alllead', component: AllleadComponent },
      { path: 'leaddata', component: LeaddataComponent },
      { path: 'leadreport', component:LeadreportComponent},
      { path: 'group', component:GroupComponent},
      { path: 'vow_summary', component: VowSummaryComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadRoutingModule { }
