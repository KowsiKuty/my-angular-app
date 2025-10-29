import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcfapComponent } from './ecfap/ecfap.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { CreateEcfComponent } from './create-ecf/create-ecf.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InvDetailViewComponent } from './inv-detail-view/inv-detail-view.component';
import { ApApproveComponent } from './ap-approve/ap-approve.component';
import { InvDetailApproveComponent } from './inv-detail-approve/inv-detail-approve.component';
import { EcfapViewComponent } from './ecfap-view/ecfap-view.component';
import { ApComponent } from './ap/ap.component';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
  {path: 'ecfapsummary', component: EcfapComponent ,canActivate:[CanActivateGuardService]},
  {path: 'createecf', component: CreateEcfComponent ,canActivate:[CanActivateGuardService]},
  {path: 'invdetailview', component: InvDetailViewComponent ,canActivate:[CanActivateGuardService]},
  {path: 'invoicedetail', component:InvoiceDetailComponent ,canActivate:[CanActivateGuardService]},
  {path: 'apapproval', component: ApApproveComponent ,canActivate:[CanActivateGuardService]},
  {path: 'invdetApproval', component: InvDetailApproveComponent ,canActivate:[CanActivateGuardService]},
  {path: 'ecfapview', component: EcfapComponent ,canActivate:[CanActivateGuardService]},
  {path: 'ecfapmakersummary', component: ApComponent ,canActivate:[CanActivateGuardService]}
  
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcfapRoutingModule { }
