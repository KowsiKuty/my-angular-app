import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { LosSummaryComponent } from './los-summary/los-summary.component';
import { LosComponent } from './los/los.component';
import { CreateLosComponent } from './create-los/create-los.component'
import { LosDetailsComponent } from './los-details/los-details.component'
// import { LosInvoiceSummaryComponent } from './los-invoice-summary/los-invoice-summary.component'
import { LosApproveRejectScreenComponent } from './los-approve-reject-screen/los-approve-reject-screen.component';
import { LosInvoiceApprovalViewComponent } from './los-invoice-approval-view/los-invoice-approval-view.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
// import { LosSummaryComponent } from './los-summary/los-summary.component';
import { LosAppPushComponent } from './los-app-push/los-app-push.component';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
  { path: 'los', component: LosComponent, canActivate: [CanActivateGuardService] },
  { path: "los/:id", component: LosComponent, canActivate: [CanActivateGuardService] },
  { path: 'createLos', component: CreateLosComponent },
  { path: 'losviewdetails', component: LosDetailsComponent },
  // { path: 'losinvoicesummary', component: LosInvoiceSummaryComponent },
  { path: 'losapprej', component: LosApproveRejectScreenComponent },
  { path: 'losappview', component: LosInvoiceApprovalViewComponent },
  { path : 'los_app_push' ,component:LosAppPushComponent}
  
  // { path: 'lossummary', component: LosSummaryComponent }

]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DtpcRoutingModule { }
