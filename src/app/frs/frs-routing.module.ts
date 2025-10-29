import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { FrsSummaryComponent } from './frs-summary/frs-summary.component';
import { FrsTransactionComponent } from './frs-transaction/frs-transaction.component';
import { FrstransactionComponent } from './frstransaction/frstransaction.component';
import { FrsDocumentComponent } from './frs-document/frs-document.component';
import { QueryPageComponent } from './query-page/query-page.component';
import { GlMappingComponent } from './gl-mapping/gl-mapping.component';
import { ReverseMasterComponent } from './reverse-master/reverse-master.component';


const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path:"frs_transaction", component: FrsTransactionComponent },
      {path:'frs_summary',component:FrsSummaryComponent},
      {path:'frs_document',component:FrsDocumentComponent},
      {path:'frstransaction',component:FrstransactionComponent},
      {path:'query_page',component:QueryPageComponent},
      {path:'gl_mapping',component:GlMappingComponent},
      {path:'reverse_master',component:ReverseMasterComponent},
    ]
   
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrsRoutingModule { }
