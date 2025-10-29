import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LcaComponent } from './lca/lca.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { LcaApprovalSummaryComponent } from './lca-approval-summary/lca-approval-summary.component';
import { LcaViewComponent } from './lca-view/lca-view.component';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
     {path:'lca',component:LcaComponent,canActivate:[CanActivateGuardService]},
     {path:'lcasummary',component:LcaComponent,canActivate:[CanActivateGuardService]},
     {path:'lcapprover',component:LcaApprovalSummaryComponent,canActivate:[CanActivateGuardService]},
     {path:'viewdeatils',component:LcaViewComponent,canActivate:[CanActivateGuardService]}
    ]}]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes),
    CommonModule
  ],
  exports:[RouterModule]
})
export class LcaRoutingModule { }
