import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { SmsAmcCreateComponent } from './sms-amc-create/sms-amc-create.component';
import { SmsApprovalSummaryComponent } from './sms-approval-summary/sms-approval-summary.component';
import { SmsEditComponent } from './sms-edit/sms-edit.component';
import { SmsListOfAssetComponent } from './sms-list-of-asset/sms-list-of-asset.component';
import { SmsMakerSummaryComponent } from './sms-maker-summary/sms-maker-summary.component';
import { SmsNatureOfAssetProblemComponent } from './sms-nature-of-asset-problem/sms-nature-of-asset-problem.component';
import { SmsTicketSummaryComponent } from './sms-ticket-summary/sms-ticket-summary.component';
import { SmsTransactionSummaryComponent } from './sms-transaction-summary/sms-transaction-summary.component';
import { SmsWarrantyCreateComponent } from './sms-warranty-create/sms-warranty-create.component';
import { CreateTicketSummaryComponent } from './create-ticket-summary/create-ticket-summary.component';
import { SmsApprovalDataComponent } from './sms-approval-data/sms-approval-data.component';
import { TicketFollowupComponent } from './ticket-followup/ticket-followup.component';
import { NonOwnedAssetSummaryComponent } from './non-owned-asset-summary/non-owned-asset-summary.component';
import { NonOwnedAssetMakerComponent } from './non-owned-asset-maker/non-owned-asset-maker.component';
import { NonOwnedAssetApprovalSummaryComponent } from './non-owned-asset-approval-summary/non-owned-asset-approval-summary.component';
import { SmsMasterComponent } from './sms-master/sms-master.component';
import { SmsRenewalCreateComponent} from './sms-renewal-create/sms-renewal-create.component'
import { SmsAmcEditComponent } from './sms-amc-edit/sms-amc-edit.component';
const routes: Routes = [
  {
  path: '', canActivate: [CanActivateGuardService],
  children: [
    { path: 'smstransaction', component:SmsTransactionSummaryComponent},
    { path: 'smsmakersummary', component: SmsMakerSummaryComponent },
    { path: 'smsamccreate', component: SmsAmcCreateComponent },
    { path: 'smswarrantycreate', component: SmsWarrantyCreateComponent },
    { path: 'smsedit', component: SmsEditComponent },
    { path: 'smsapprovalsummary', component: SmsApprovalSummaryComponent },
    { path: 'smsnop', component: SmsNatureOfAssetProblemComponent },
    { path: 'smsticketsummary', component: SmsTicketSummaryComponent },
    { path: 'smslistofasset', component: SmsListOfAssetComponent },
    { path:'createticket' , component:CreateTicketSummaryComponent},
    { path:'smsapproval',component:SmsApprovalDataComponent},
    { path:'tfollowup',component:TicketFollowupComponent},
    {path:'nonownedassetsummary',component:NonOwnedAssetSummaryComponent},
    {path:'nonownedassetmaker',component:NonOwnedAssetMakerComponent},
    {path:'nonownedassetapprovalsummary',component:NonOwnedAssetApprovalSummaryComponent},
    {path:'smsmaster',component:SmsMasterComponent},
    {path:'smsamcrenewal',component:SmsRenewalCreateComponent},
    {path:'smsamcedit',component: SmsAmcEditComponent}

  
  ]
}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class SmsRoutingModule { }
